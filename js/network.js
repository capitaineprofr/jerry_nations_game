/**
 * Jerry's Nations: Frontline Realms - P2P WebRTC Multiplayer & Room Lobby (PeerJS)
 * Synchronisation du salon d'attente (souverains connectés, slots, bannières),
 * diffusion du lancement de partie (seed et factions) et synchronisation des ordres RTS.
 */

export class NetworkManager {
  constructor(engine) {
    this.engine = engine;
    this.peer = null;
    this.connections = [];
    this.hostConn = null;
    this.isHost = false;
    this.isConnected = false;
    this.myPlayerId = 1; // 1 = Faction joueur hôte
    this.roomId = null;

    this.lobbyPlayers = [];
    this.onPlayerUpdated = null;
    this.onStartGameCallback = null;
  }

  // Création d'un salon multijoueur par l'Hôte
  createRoom(hostPlayerInfo, onRoomCreated, onPlayerUpdated, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé. Vérifiez votre connexion Internet.");
      return;
    }

    this.onPlayerUpdated = onPlayerUpdated;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const peerId = `jerry-realm-${randomSuffix}`;

    try {
      this.peer = new window.Peer(peerId);

      this.peer.on("open", (id) => {
        this.isHost = true;
        this.isConnected = true;
        this.roomId = id;
        this.myPlayerId = 1;

        // Slot 1 : L'Hôte
        this.lobbyPlayers = [
          {
            id: 1,
            name: hostPlayerInfo.name || "Jerry",
            nationName: hostPlayerInfo.nationName || "Empire d'Émeraude",
            color: hostPlayerInfo.color || "#1b7a63",
            border: hostPlayerInfo.border || "#22c55e",
            avatarUrl: hostPlayerInfo.avatarUrl || "textures/ui/me.gif",
            isHost: true,
            isReady: true
          }
        ];

        if (onRoomCreated) onRoomCreated(id, this.lobbyPlayers);
        if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
      });

      this.peer.on("connection", (conn) => {
        this.handleIncomingClient(conn);
      });

      this.peer.on("error", (err) => {
        console.warn("Erreur P2P Host:", err);
        if (onError) onError(err.message || "Erreur de création de salon.");
      });
    } catch (e) {
      if (onError) onError(e.message);
    }
  }

  // Connexion d'un Client à un salon existant
  joinRoom(targetRoomId, clientPlayerInfo, onJoined, onPlayerUpdated, onStartGame, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé. Vérifiez votre connexion Internet.");
      return;
    }

    this.onPlayerUpdated = onPlayerUpdated;
    this.onStartGameCallback = onStartGame;

    try {
      this.peer = new window.Peer();

      this.peer.on("open", () => {
        const cleanRoomId = targetRoomId.trim();
        const conn = this.peer.connect(cleanRoomId);

        conn.on("open", () => {
          this.hostConn = conn;
          this.isHost = false;
          this.isConnected = true;
          this.roomId = cleanRoomId;

          // Présentation du joueur à l'hôte
          conn.send({
            type: "PLAYER_HELLO",
            player: {
              name: clientPlayerInfo.name || "Souverain Allié",
              nationName: clientPlayerInfo.nationName || "Royaume Saphir",
              color: clientPlayerInfo.color || "#1d4ed8",
              border: clientPlayerInfo.border || "#06b6d4",
              avatarUrl: clientPlayerInfo.avatarUrl || "textures/ui/me.gif"
            }
          });

          if (onJoined) onJoined(cleanRoomId);
        });

        conn.on("data", (data) => {
          this.handleHostData(data);
        });

        conn.on("error", () => {
          if (onError) onError("Échec de connexion au salon de l'hôte.");
        });

        conn.on("close", () => {
          this.isConnected = false;
          if (this.onPlayerUpdated) this.onPlayerUpdated([]);
        });
      });

      this.peer.on("error", (err) => {
        if (onError) onError(err.message || "Erreur de liaison P2P.");
      });
    } catch (e) {
      if (onError) onError(e.message);
    }
  }

  handleIncomingClient(conn) {
    this.connections.push(conn);

    conn.on("data", (data) => {
      if (data.type === "PLAYER_HELLO") {
        const assignedId = this.lobbyPlayers.length + 1;
        const newPlayer = {
          id: assignedId,
          name: data.player.name,
          nationName: data.player.nationName,
          color: data.player.color,
          border: data.player.border,
          avatarUrl: data.player.avatarUrl,
          isHost: false,
          isReady: true,
          conn
        };

        this.lobbyPlayers.push(newPlayer);

        // Diffuser la mise à jour des slots à tous les joueurs connectés
        this.broadcastRoomSync();
        if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
      } else {
        this.handleClientCommand(data);
      }
    });

    conn.on("close", () => {
      this.connections = this.connections.filter((c) => c !== conn);
      this.lobbyPlayers = this.lobbyPlayers.filter((p) => p.conn !== conn);
      this.broadcastRoomSync();
      if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
    });
  }

  broadcastRoomSync() {
    const serializedPlayers = this.lobbyPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      nationName: p.nationName,
      color: p.color,
      border: p.border,
      avatarUrl: p.avatarUrl,
      isHost: p.isHost,
      isReady: p.isReady
    }));

    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send({
          type: "ROOM_SYNC",
          players: serializedPlayers
        });
      }
    });
  }

  // Lancement de la partie par l'Hôte
  broadcastStartGame(gameConfig) {
    const seed = Date.now();
    const serializedPlayers = this.lobbyPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      nationName: p.nationName,
      color: p.color,
      border: p.border,
      avatarUrl: p.avatarUrl,
      isHost: p.isHost
    }));

    const payload = {
      type: "START_GAME",
      seed,
      gameConfig,
      players: serializedPlayers
    };

    this.connections.forEach((conn) => {
      if (conn.open) conn.send(payload);
    });

    return payload;
  }

  handleHostData(data) {
    if (data.type === "ROOM_SYNC") {
      this.lobbyPlayers = data.players;
      // Déterminer son propre ID parmi la liste
      const me = this.lobbyPlayers.find((p) => !p.isHost && p.name === this.engine?.settings?.playerName) || this.lobbyPlayers[this.lobbyPlayers.length - 1];
      if (me) {
        this.myPlayerId = me.id;
      }
      if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
    } else if (data.type === "START_GAME") {
      if (this.onStartGameCallback) {
        this.onStartGameCallback(data);
      }
    } else if (data.type === "MOVE_SYNC") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine?.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
    }
  }

  handleClientCommand(data) {
    if (data.type === "MOVE") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine?.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
      // Relayer l'ordre à tous les autres clients
      this.connections.forEach((conn) => {
        if (conn.open) conn.send({ ...data, type: "MOVE_SYNC" });
      });
    } else if (data.type === "RECRUIT") {
      this.engine?.recruitUnit(data.factionId, data.unitType);
    } else if (data.type === "BUILD") {
      this.engine?.buildInfrastructure(data.factionId, data.x, data.y, data.infraType);
    }
  }

  sendMove(unitIds, targetX, targetY) {
    const payload = {
      type: "MOVE",
      factionId: this.myPlayerId,
      unitIds,
      targetX,
      targetY
    };

    if (this.isHost) {
      this.connections.forEach((conn) => {
        if (conn.open) conn.send({ ...payload, type: "MOVE_SYNC" });
      });
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(payload);
    }
  }

  leaveRoom() {
    if (this.hostConn) {
      this.hostConn.close();
      this.hostConn = null;
    }
    this.connections.forEach((c) => c.close());
    this.connections = [];
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
    this.isConnected = false;
    this.lobbyPlayers = [];
  }
}


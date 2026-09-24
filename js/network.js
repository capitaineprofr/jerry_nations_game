/**
 * Jerry's Nations: Frontline Realms - P2P WebRTC Multiplayer (PeerJS)
 * Synchronisation des ordres de déplacement, recrutement et construction en P2P.
 */

export class NetworkManager {
  constructor(engine) {
    this.engine = engine;
    this.peer = null;
    this.connections = [];
    this.hostConn = null;
    this.isHost = false;
    this.isConnected = false;
    this.myPlayerId = 1; // 1 = Faction joueur
    this.roomId = null;
  }

  createRoom(onSuccess, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé. Mode Solo actif.");
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const peerId = `jerry-realm-${randomSuffix}`;

    try {
      this.peer = new window.Peer(peerId);

      this.peer.on("open", (id) => {
        this.isHost = true;
        this.isConnected = true;
        this.roomId = id;
        this.myPlayerId = 1;
        if (onSuccess) onSuccess(id);
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

  joinRoom(targetRoomId, onSuccess, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé.");
      return;
    }

    try {
      this.peer = new window.Peer();

      this.peer.on("open", () => {
        const conn = this.peer.connect(targetRoomId.trim());

        conn.on("open", () => {
          this.hostConn = conn;
          this.isHost = false;
          this.isConnected = true;
          this.roomId = targetRoomId;

          this.myPlayerId = 3;
          const myFaction = this.engine.factions.get(this.myPlayerId);
          if (myFaction) {
            myFaction.isAI = false;
            myFaction.isPlayer = true;
          }

          if (onSuccess) onSuccess(targetRoomId);
        });

        conn.on("data", (data) => {
          this.handleHostData(data);
        });

        conn.on("error", () => {
          if (onError) onError("Échec de connexion au salon.");
        });
      });

      this.peer.on("error", (err) => {
        if (onError) onError(err.message || "Erreur de liaison Peer.");
      });
    } catch (e) {
      if (onError) onError(e.message);
    }
  }

  handleIncomingClient(conn) {
    this.connections.push(conn);
    const assignedFactionId = this.connections.length + 2;

    const clientFaction = this.engine.factions.get(assignedFactionId);
    if (clientFaction) {
      clientFaction.isAI = false;
      clientFaction.isPlayer = true;
    }

    conn.on("open", () => {
      conn.send({
        type: "WELCOME",
        assignedFactionId,
        seed: Date.now()
      });
      this.engine.addLog(`§aUn joueur a rejoint la partie sous la bannière ${clientFaction ? clientFaction.name : "alliée"} !`);
    });

    conn.on("data", (data) => {
      this.handleClientCommand(data);
    });
  }

  handleClientCommand(data) {
    if (data.type === "MOVE") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
    } else if (data.type === "RECRUIT") {
      this.engine.recruitUnit(data.factionId, data.unitType);
    } else if (data.type === "BUILD") {
      this.engine.buildInfrastructure(data.factionId, data.x, data.y, data.infraType);
    }
  }

  handleHostData(data) {
    if (data.type === "WELCOME") {
      this.myPlayerId = data.assignedFactionId;
      const f = this.engine.factions.get(this.myPlayerId);
      if (f) {
        f.isAI = false;
        f.isPlayer = true;
      }
      this.engine.addLog(`§aConnecté au salon hôte ! Vous dirigez : ${f ? f.name : "Votre faction"}.`);
    } else if (data.type === "MOVE_SYNC") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
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
}

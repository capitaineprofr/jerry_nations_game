/**
 * Jerry's Nations: Frontline Realms - Main Entry Point & Game Orchestrator
 * Initialisation des modules, gestion du Lobby & Création de Nation, boucle requestAnimationFrame.
 * RÈGLE STRICTE : ZÉRO EMOJI.
 */

import { CONFIG } from "./config.js";
import { WorldMap } from "./map.js";
import { GameEngine } from "./engine.js";
import { MapRenderer } from "./renderer.js";
import { AIController } from "./ai.js";
import { NetworkManager } from "./network.js";
import { UIManager } from "./ui.js";
import { SOUND } from "./audio.js";

class GameApp {
  constructor() {
    this.map = null;
    this.engine = null;
    this.renderer = null;
    this.ai = null;
    this.network = null;
    this.ui = null;

    this.isPlaying = false;
    this.lastTime = 0;

    // Paramètres de partie par défaut
    let savedAvatar = null;
    try {
      savedAvatar = localStorage.getItem("jerry_nations_skin_avatar");
    } catch (e) {}

    this.settings = {
      playerName: "Jerry",
      nationName: "Empire d'Émeraude",
      playerAvatarUrl: savedAvatar || "textures/ui/me.gif",
      bannerPreset: "emerald",
      bannerColor: "#1b7a63",
      bannerBorder: "#22c55e",
      textCode: "§a",
      gameMode: "standard",
      botCount: 3,
      aiDifficulty: "normal",
      enableMarauders: true
    };

    this.initLobbyEvents();
    this.initSkinImporter();
  }

  // Gestionnaire d'importation de skin Minecraft (.PNG)
  initSkinImporter() {
    const btnUpload = document.getElementById("btn-upload-skin");
    const inputSkinFile = document.getElementById("setup-skin-file");
    const btnReset = document.getElementById("btn-reset-skin");
    const previewImg = document.getElementById("setup-avatar-preview");

    if (previewImg && this.settings.playerAvatarUrl) {
      previewImg.src = this.settings.playerAvatarUrl;
    }

    if (btnUpload && inputSkinFile) {
      btnUpload.addEventListener("click", () => {
        inputSkinFile.click();
      });

      inputSkinFile.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Création de l'icône / buste du joueur sur canvas à partir du skin Minecraft
            const cvs = document.createElement("canvas");
            cvs.width = 64;
            cvs.height = 64;
            const ctx = cvs.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            const isLegacy = img.height === 32;

            // 1. Torse supérieur
            ctx.drawImage(img, 20, 20, 8, 7, 18, 36, 28, 26);
            if (!isLegacy) {
              ctx.drawImage(img, 20, 36, 8, 7, 18, 36, 28, 26);
            }

            // 2. Bras Droit
            ctx.drawImage(img, 44, 20, 4, 7, 6, 36, 12, 26);
            if (!isLegacy) {
              ctx.drawImage(img, 44, 36, 4, 7, 6, 36, 12, 26);
            }

            // 3. Bras Gauche
            if (!isLegacy) {
              ctx.drawImage(img, 36, 52, 4, 7, 46, 36, 12, 26);
              ctx.drawImage(img, 52, 52, 4, 7, 46, 36, 12, 26);
            } else {
              ctx.save();
              ctx.scale(-1, 1);
              ctx.drawImage(img, 44, 20, 4, 7, -58, 36, 12, 26);
              ctx.restore();
            }

            // 4. Visage de base UV [8, 8, 8, 8]
            ctx.drawImage(img, 8, 8, 8, 8, 16, 4, 32, 32);

            // 5. Casque / Chapeau / Reliefs UV [40, 8, 8, 8]
            ctx.drawImage(img, 40, 8, 8, 8, 14, 2, 36, 36);

            const avatarDataUrl = cvs.toDataURL("image/png");
            this.settings.playerAvatarUrl = avatarDataUrl;
            if (previewImg) previewImg.src = avatarDataUrl;

            try {
              localStorage.setItem("jerry_nations_skin_avatar", avatarDataUrl);
            } catch (err) {}

            SOUND.playClick();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.settings.playerAvatarUrl = "textures/ui/me.gif";
        if (previewImg) previewImg.src = "textures/ui/me.gif";
        try {
          localStorage.removeItem("jerry_nations_skin_avatar");
        } catch (err) {}
        SOUND.playClick();
      });
    }
  }

  initLobbyEvents() {
    const inputPlayer = document.getElementById("setup-player-name");
    const inputNation = document.getElementById("setup-nation-name");
    const btnStart = document.getElementById("btn-start-game");

    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    // 1. Choix des bannières
    document.querySelectorAll(".banner-swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll(".banner-swatch").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        const bId = swatch.dataset.banner;
        const preset = CONFIG.BANNER_PRESETS.find((p) => p.id === bId) || CONFIG.BANNER_PRESETS[0];
        this.settings.bannerPreset = preset.id;
        this.settings.bannerColor = preset.color;
        this.settings.bannerBorder = preset.border;
        this.settings.textCode = preset.textCode;
        SOUND.playClick();
      });
    });

    // 2. Boutons Bascules (Toggles de paramètres)
    document.querySelectorAll(".setup-btn-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const settingKey = btn.dataset.setting;
        const valStr = btn.dataset.value;

        // Désélectionner les autres boutons de la même ligne
        btn.parentElement.querySelectorAll(".setup-btn-toggle").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (settingKey === "botCount") {
          this.settings.botCount = parseInt(valStr, 10);
        } else if (settingKey === "marauders") {
          this.settings.enableMarauders = valStr === "true";
        } else if (settingKey === "gameMode") {
          this.settings.gameMode = valStr;
          const help = document.getElementById("mode-help-text");
          if (help) {
            help.textContent = valStr === "sandbox"
              ? "Ressources infinies (99 999), constructions libres, aucune famine."
              : "11 Stades, Banquet au crépuscule et gestion alimentaire.";
          }
        } else if (settingKey === "aiDifficulty") {
          this.settings.aiDifficulty = valStr;
        }

        SOUND.playClick();
      });
    });

    // 3. Lancement de la partie
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        if (inputPlayer && inputPlayer.value.trim()) {
          this.settings.playerName = inputPlayer.value.trim();
        }
        if (inputNation && inputNation.value.trim()) {
          this.settings.nationName = inputNation.value.trim();
        }

        SOUND.playClick();
        this.startGameSession(false);
      });
    }

    // 4. Multijoueur P2P WebRTC & Salon d'Attente
    this.initMultiplayerLobbyEvents();

    // Instanciation réseau précoce
    this.network = new NetworkManager({ factions: new Map(), addLog: () => {} });
  }

  // Initialisation du Salon d'Attente Multijoueur
  initMultiplayerLobbyEvents() {
    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    const mpModal = document.getElementById("multiplayer-lobby-modal");
    const btnMpStart = document.getElementById("btn-mp-start-game");
    const btnMpLeave = document.getElementById("btn-mp-leave-room");
    const btnCopyCode = document.getElementById("btn-copy-room-code");
    const mpCopyFeedback = document.getElementById("mp-copy-feedback");

    // Bouton Copier le code du salon
    if (btnCopyCode) {
      btnCopyCode.addEventListener("click", () => {
        if (this.network.roomId) {
          navigator.clipboard.writeText(this.network.roomId);
          if (mpCopyFeedback) {
            mpCopyFeedback.textContent = "Code copié dans le presse-papiers ! Partagez-le avec vos alliés.";
            mpCopyFeedback.style.color = "#15803d";
          }
          SOUND.playClick();
        }
      });
    }

    // Bouton Quitter le salon
    if (btnMpLeave) {
      btnMpLeave.addEventListener("click", () => {
        this.network.leaveRoom();
        if (mpModal) mpModal.classList.add("hidden");
        SOUND.playClick();
      });
    }

    // Bouton Lancer la partie pour tous (Hôte uniquement)
    if (btnMpStart) {
      btnMpStart.addEventListener("click", () => {
        if (!this.network.isHost) return;
        SOUND.playFanfare();
        const payload = this.network.broadcastStartGame(this.settings);
        this.onMultiplayerGameStart(payload);
      });
    }

    // Hôte : Création d'un nouveau salon P2P
    if (btnHost) {
      btnHost.addEventListener("click", () => {
        SOUND.playClick();
        const inputPlayer = document.getElementById("setup-player-name");
        const inputNation = document.getElementById("setup-nation-name");
        if (inputPlayer && inputPlayer.value.trim()) this.settings.playerName = inputPlayer.value.trim();
        if (inputNation && inputNation.value.trim()) this.settings.nationName = inputNation.value.trim();

        if (p2pStatus) p2pStatus.textContent = "Création du salon P2P en cours...";

        const hostInfo = {
          name: this.settings.playerName,
          nationName: this.settings.nationName,
          color: this.settings.bannerColor,
          border: this.settings.bannerBorder,
          avatarUrl: this.settings.playerAvatarUrl
        };

        this.network.createRoom(
          hostInfo,
          (roomId, players) => {
            if (p2pStatus) p2pStatus.textContent = "";
            this.openMultiplayerRoomLobby(true, roomId, players);
          },
          (players) => {
            this.updateMultiplayerSlots(players);
          },
          (err) => {
            if (p2pStatus) p2pStatus.textContent = `Erreur : ${err}`;
          }
        );
      });
    }

    // Client : Rejoindre un salon existant
    if (btnJoin) {
      btnJoin.addEventListener("click", () => {
        SOUND.playClick();
        const inputPlayer = document.getElementById("setup-player-name");
        const inputNation = document.getElementById("setup-nation-name");
        if (inputPlayer && inputPlayer.value.trim()) this.settings.playerName = inputPlayer.value.trim();
        if (inputNation && inputNation.value.trim()) this.settings.nationName = inputNation.value.trim();

        const code = inputRoom ? inputRoom.value.trim() : "";
        if (!code) {
          if (p2pStatus) p2pStatus.textContent = "Veuillez entrer un code de salon valide.";
          return;
        }

        if (p2pStatus) p2pStatus.textContent = "Connexion au salon de l'hôte...";

        const clientInfo = {
          name: this.settings.playerName,
          nationName: this.settings.nationName,
          color: this.settings.bannerColor,
          border: this.settings.bannerBorder,
          avatarUrl: this.settings.playerAvatarUrl
        };

        this.network.joinRoom(
          code,
          clientInfo,
          (roomId) => {
            if (p2pStatus) p2pStatus.textContent = "";
            this.openMultiplayerRoomLobby(false, roomId, [
              { id: 1, name: "Hôte du Royaume", nationName: "Empire Hôte", isHost: true, avatarUrl: "textures/ui/me.gif" },
              { id: 2, ...clientInfo, isHost: false }
            ]);
          },
          (players) => {
            this.updateMultiplayerSlots(players);
          },
          (gameStartPayload) => {
            this.onMultiplayerGameStart(gameStartPayload);
          },
          (err) => {
            if (p2pStatus) p2pStatus.textContent = `Échec de connexion : ${err}`;
          }
        );
      });
    }
  }

  // Ouverture visuelle de la Salle d'Attente Multijoueur
  openMultiplayerRoomLobby(isHost, roomId, players) {
    const mpModal = document.getElementById("multiplayer-lobby-modal");
    const mpRoomCode = document.getElementById("mp-room-code-text");
    const mpStatus = document.getElementById("mp-lobby-status");
    const btnMpStart = document.getElementById("btn-mp-start-game");
    const mpCopyFeedback = document.getElementById("mp-copy-feedback");

    if (mpModal) mpModal.classList.remove("hidden");
    if (mpRoomCode) mpRoomCode.textContent = roomId;
    if (mpCopyFeedback) {
      mpCopyFeedback.textContent = "Transmettez ce code à vos amis pour qu'ils rejoignent votre royaume.";
      mpCopyFeedback.style.color = "#78350f";
    }

    if (isHost) {
      if (mpStatus) mpStatus.textContent = "Salon ouvert ! En attente d'autres souverains...";
      if (btnMpStart) {
        btnMpStart.style.display = "block";
        btnMpStart.textContent = "LANCER LA PARTIE POUR TOUS";
        btnMpStart.disabled = false;
        btnMpStart.classList.add("btn-gold");
      }
    } else {
      if (mpStatus) mpStatus.textContent = "Connecté au salon ! En attente du lancement par l'Hôte...";
      if (btnMpStart) {
        btnMpStart.style.display = "block";
        btnMpStart.textContent = "EN ATTENTE DU SIGNAL DE L'HÔTE...";
        btnMpStart.disabled = true;
        btnMpStart.classList.remove("btn-gold");
      }
    }

    this.updateMultiplayerSlots(players);
  }

  // Mise à jour des 4 cartes d'emplacements joueurs dans le salon
  updateMultiplayerSlots(players) {
    const container = document.getElementById("mp-slots-container");
    if (!container) return;

    let html = "";
    for (let i = 0; i < 4; i++) {
      const p = players && players[i];
      if (p) {
        const badgeClass = p.isHost ? "host" : "ready";
        const badgeLabel = p.isHost ? "[HÔTE]" : "[PRÊT]";
        html += `
          <div class="mp-slot-card occupied" style="border-color:${p.border || '#15803d'}">
            <div class="mp-slot-avatar" style="border-color:${p.border || '#78350f'}">
              <img src="${p.avatarUrl || 'textures/ui/me.gif'}" alt="Avatar">
            </div>
            <div class="mp-slot-info">
              <div class="mp-slot-player-name" style="color:${p.border || '#2b1d0c'}">${p.name}</div>
              <div class="mp-slot-faction-name">${p.nationName || 'Royaume'}</div>
              <div class="mp-slot-badge ${badgeClass}">${badgeLabel}</div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="mp-slot-card empty">
            <div class="mp-slot-avatar" style="opacity:0.4;">
              <span style="font-size:16px; color:#78350f;">?</span>
            </div>
            <div class="mp-slot-info">
              <div class="mp-slot-player-name" style="color:#78350f;">Emplacement ${i + 1}</div>
              <div class="mp-slot-faction-name">En attente d'un joueur ou Bot IA</div>
              <div class="mp-slot-badge">[LIBRE]</div>
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = html;
  }

  // Lancement synchronisé de la partie multijoueur
  onMultiplayerGameStart(payload) {
    const mpModal = document.getElementById("multiplayer-lobby-modal");
    if (mpModal) mpModal.classList.add("hidden");

    this.startGameSession(true, payload);
  }

  startGameSession(isMultiplayer = false, mpData = null) {
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");

    if (lobbyOverlay) lobbyOverlay.classList.add("hidden");
    if (gameContainer) gameContainer.classList.remove("in-lobby");

    // Mettre à jour l'avatar et le profil du joueur dans le HUD In-Game
    const hudAvatar = document.getElementById("hud-player-avatar");
    if (hudAvatar && this.settings.playerAvatarUrl) {
      hudAvatar.src = this.settings.playerAvatarUrl;
    }
    const hudPlayer = document.getElementById("hud-player-name");
    if (hudPlayer && this.settings.playerName) {
      hudPlayer.textContent = this.settings.playerName;
    }

    // 1. Définir la liste des factions actives selon les réglages
    const activeFactions = [];
    const myPlayerId = isMultiplayer && this.network ? this.network.myPlayerId : 1;

    if (isMultiplayer && mpData && mpData.players) {
      // Configuration multijoueur avec les vrais joueurs
      mpData.players.forEach((p, idx) => {
        activeFactions.push({
          id: p.id,
          name: p.nationName || `Royaume ${idx + 1}`,
          color: p.color || CONFIG.BANNER_PRESETS[idx % CONFIG.BANNER_PRESETS.length].color,
          border: p.border || CONFIG.BANNER_PRESETS[idx % CONFIG.BANNER_PRESETS.length].border,
          textCode: "§a",
          isPlayer: p.id === myPlayerId,
          isAI: false
        });
      });

      // Compléter avec des bots si moins de 4 factions
      const botCandidates = [CONFIG.FACTIONS[1], CONFIG.FACTIONS[2], CONFIG.FACTIONS[3], CONFIG.FACTIONS[4]];
      for (let i = activeFactions.length; i < 4; i++) {
        const candidate = botCandidates[i % botCandidates.length];
        activeFactions.push({
          ...candidate,
          id: i + 1,
          isPlayer: false,
          isAI: true
        });
      }
    } else {
      // Solo standard
      const playerBanner = CONFIG.BANNER_PRESETS.find((b) => b.id === this.settings.bannerPreset) || CONFIG.BANNER_PRESETS[0];

      activeFactions.push({
        id: 1,
        name: this.settings.nationName,
        color: playerBanner.color,
        border: playerBanner.border,
        textCode: playerBanner.textCode,
        isPlayer: true
      });

      const botCount = this.settings.botCount;
      const botCandidates = [];
      if (this.settings.enableMarauders) {
        botCandidates.push(CONFIG.FACTIONS[1]); // Maraudeurs
      }
      botCandidates.push(CONFIG.FACTIONS[2]);
      botCandidates.push(CONFIG.FACTIONS[3]);
      botCandidates.push(CONFIG.FACTIONS[4]);

      for (let i = 0; i < botCount && i < botCandidates.length; i++) {
        activeFactions.push(botCandidates[i]);
      }
    }

    // 2. Génération de la carte de monde avec les factions actives (Seed synchronisée en multijoueur)
    const mapSeed = (isMultiplayer && mpData && mpData.seed) ? mpData.seed : Date.now();
    this.map = new WorldMap();
    this.map.generate(mapSeed, activeFactions);

    // 3. Moteur de simulation
    this.engine = new GameEngine(this.map, this.settings);
    this.network.engine = this.engine;

    // 4. Rendu Canvas
    const canvas = document.getElementById("world-canvas");
    this.renderer = new MapRenderer(canvas, this.map, this.engine);

    // 5. Intelligence Artificielle
    this.ai = new AIController(this.engine, this.map);

    // 6. Interface Utilisateur
    this.ui = new UIManager(this.engine, this.renderer, this.network);
    this.ui.onQuitToLobby = () => this.returnToLobby();

    this.isPlaying = true;
    const modeName = this.settings.gameMode === "sandbox" ? "Bac à Sable" : "Conquête";
    const netPrefix = isMultiplayer ? "[MULTIJOUEUR P2P] " : "";
    this.engine.addLog(`§a${netPrefix}[${modeName}] Gloire à ${this.settings.playerName}, souverain de l'${this.settings.nationName} !`);

    // Lancer la boucle de jeu
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  returnToLobby() {
    this.isPlaying = false;
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");
    const pauseModal = document.getElementById("pause-modal");
    const mpModal = document.getElementById("multiplayer-lobby-modal");

    if (pauseModal) pauseModal.classList.add("hidden");
    if (mpModal) mpModal.classList.add("hidden");
    if (lobbyOverlay) lobbyOverlay.classList.remove("hidden");
    if (gameContainer) gameContainer.classList.add("in-lobby");
  }

  gameLoop(currentTime) {
    if (!this.isPlaying) return;

    // Simulation (20 Hz géré en interne via le tick rate)
    this.engine.update();
    this.ai.update();

    // Rendu visuel 60 FPS
    this.renderer.render();

    // Mise à jour de l'affichage DOM
    this.ui.updateHUD();

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Démarrer l'application au chargement du DOM
window.addEventListener("DOMContentLoaded", () => {
  window.app = new GameApp();
});

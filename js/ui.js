/**
 * Jerry's Nations: Frontline Realms - RTS UI Controller & Tactical Command Dock
 * Sélection directe (clic & Marquee Box Select), ordres de déplacement/attaque au clic droit,
 * recrutement de bataillons, expéditions rapides et gestion des infrastructures.
 */

import { CONFIG } from "./config.js";
import { SOUND } from "./audio.js";

export class UIManager {
  constructor(engine, renderer, network) {
    this.engine = engine;
    this.renderer = renderer;
    this.network = network;

    this.selectedUnits = [];
    this.selectedBuildMode = null;

    this.bindDomElements();
    this.setupCameraAndMenuControls();
    this.setupRTSMouseControls();
    this.setupSpeedControls();
    this.setupRecruitmentControls();
    this.setupExpeditionControls();
    this.setupBuildControls();
  }

  bindDomElements() {
    this.elNationName = document.getElementById("hud-nation-name");
    this.elStageBadge = document.getElementById("hud-stage-badge");
    this.elMoodValue = document.getElementById("hud-mood-value");
    this.elMoodBar = document.getElementById("hud-mood-bar");
    this.elMoodStatus = document.getElementById("hud-mood-status");

    this.elFood = document.getElementById("res-food");
    this.elWood = document.getElementById("res-wood");
    this.elStone = document.getElementById("res-stone");
    this.elGold = document.getElementById("res-gold");
    this.elTroops = document.getElementById("res-troops");
    this.elTerritory = document.getElementById("res-territory");

    this.elDayDisplay = document.getElementById("hud-day-display");
    this.elCombatLog = document.getElementById("combat-log-stream");
    this.elMuteBtn = document.getElementById("btn-toggle-sound");

    this.elSelectionInfo = document.getElementById("selection-info-text");
    this.elBtnHalt = document.getElementById("btn-order-halt");

    // Bouton Ordre Halte
    if (this.elBtnHalt) {
      this.elBtnHalt.addEventListener("click", () => {
        this.selectedUnits.forEach((u) => {
          u.targetX = null;
          u.targetY = null;
          u.targetUnit = null;
          u.state = "idle";
        });
        SOUND.playClick();
      });
    }

    // Bouton Son On/Off
    if (this.elMuteBtn) {
      this.elMuteBtn.addEventListener("click", () => {
        const isMuted = SOUND.toggleMute();
        this.elMuteBtn.textContent = isMuted ? "[SON : COUPE]" : "[SON : ACTIF]";
        this.elMuteBtn.classList.toggle("muted", isMuted);
      });
    }
  }

  setupSpeedControls() {
    document.querySelectorAll(".btn-speed-ctrl").forEach((btn) => {
      btn.addEventListener("click", () => {
        const speed = parseInt(btn.dataset.speed, 10);
        this.engine.timeScale = speed;
        this.engine.isPaused = speed === 0;

        document.querySelectorAll(".btn-speed-ctrl").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        SOUND.playClick();
      });
    });
  }

  setupCameraAndMenuControls() {
    const btnCenter = document.getElementById("btn-center-camera");
    const btnMenu = document.getElementById("btn-open-menu");
    const modal = document.getElementById("pause-modal");
    const btnResume = document.getElementById("modal-btn-resume");
    const btnModalCenter = document.getElementById("modal-btn-center");
    const btnToggleEdge = document.getElementById("modal-btn-toggle-edge-scroll");
    const btnQuit = document.getElementById("modal-btn-quit-lobby");

    if (btnCenter) {
      btnCenter.addEventListener("click", () => {
        this.renderer.centerCameraOnPlayerCapital();
        SOUND.playClick();
      });
    }

    const openPauseMenu = () => {
      if (modal) modal.classList.remove("hidden");
      this.engine.isPaused = true;
      SOUND.playClick();
    };

    const closePauseMenu = () => {
      if (modal) modal.classList.add("hidden");
      this.engine.isPaused = false;
      SOUND.playClick();
    };

    if (btnMenu) {
      btnMenu.addEventListener("click", openPauseMenu);
    }

    if (btnResume) {
      btnResume.addEventListener("click", closePauseMenu);
    }

    if (btnModalCenter) {
      btnModalCenter.addEventListener("click", () => {
        this.renderer.centerCameraOnPlayerCapital();
        closePauseMenu();
      });
    }

    if (btnToggleEdge) {
      btnToggleEdge.addEventListener("click", () => {
        this.renderer.edgeScrollEnabled = !this.renderer.edgeScrollEnabled;
        btnToggleEdge.textContent = this.renderer.edgeScrollEnabled
          ? "DÉFILEMENT BORD ÉCRAN : ACTIF"
          : "DÉFILEMENT BORD ÉCRAN : DÉSACTIVÉ";
        SOUND.playClick();
      });
    }

    if (btnQuit) {
      btnQuit.addEventListener("click", () => {
        if (this.onQuitToLobby) {
          this.onQuitToLobby();
        } else {
          location.reload();
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (modal && !modal.classList.contains("hidden")) {
          closePauseMenu();
        } else {
          openPauseMenu();
        }
      }
    });
  }

  // Commandes de recrutement d'unités
  setupRecruitmentControls() {
    document.querySelectorAll(".btn-recruit-unit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const unitType = btn.dataset.unitType;
        const myPlayerId = this.network.myPlayerId;
        const newUnit = this.engine.recruitUnit(myPlayerId, unitType);
        if (newUnit) {
          this.selectSingleUnit(newUnit);
        }
      });
    });
  }

  // Expéditions rapides stratégiques
  setupExpeditionControls() {
    const btnColo = document.getElementById("btn-expedition-colo");
    const btnDef = document.getElementById("btn-expedition-def");
    const btnAssault = document.getElementById("btn-expedition-assault");

    const myPlayerId = this.network.myPlayerId;

    if (btnColo) {
      btnColo.addEventListener("click", () => {
        this.engine.launchColonizationExpedition(myPlayerId);
      });
    }

    if (btnDef) {
      btnDef.addEventListener("click", () => {
        this.engine.rallyDefense(myPlayerId);
      });
    }

    if (btnAssault) {
      btnAssault.addEventListener("click", () => {
        this.engine.launchCoordinatedAssault(myPlayerId);
      });
    }
  }

  setupBuildControls() {
    document.querySelectorAll(".btn-build-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.buildType;
        if (this.selectedBuildMode === type) {
          this.selectedBuildMode = null;
          btn.classList.remove("active");
          this.updateSelectionDisplay();
        } else {
          this.selectedBuildMode = type;
          document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          SOUND.playClick();

          const proto = CONFIG.INFRASTRUCTURES[type.toUpperCase()];
          if (proto && this.elSelectionInfo) {
            const req = proto.allowedTerrain
              ? proto.allowedTerrain.map((tid) => Object.values(CONFIG.TERRAIN).find((v) => v.id === tid)?.name || tid).join(" ou ")
              : "Tous";
            this.elSelectionInfo.innerHTML = `
              <span style="color:var(--parchment-gold)">MODE CONSTRUCTION : Cliquez sur un secteur contrôlé (Biome requis : <strong>${req}</strong>)</span>
            `;
          }
        }
      });
    });
  }

  // Contrôles Souris RTS (Sélection & Ordres)
  setupRTSMouseControls() {
    const canvas = this.renderer.canvas;
    let isMouseDown = false;
    let startScreenX = 0;
    let startScreenY = 0;
    let hasDragged = false;

    // Clic gauche : Sélection ou Construction
    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || e.shiftKey) return;

      const rect = canvas.getBoundingClientRect();
      startScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
      startScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

      isMouseDown = true;
      hasDragged = false;

      this.renderer.boxStartX = startScreenX;
      this.renderer.boxStartY = startScreenY;
      this.renderer.boxEndX = startScreenX;
      this.renderer.boxEndY = startScreenY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;

      const rect = canvas.getBoundingClientRect();
      const curX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const curY = (e.clientY - rect.top) * (canvas.height / rect.height);

      this.renderer.boxEndX = curX;
      this.renderer.boxEndY = curY;

      if (Math.hypot(curX - startScreenX, curY - startScreenY) > 8) {
        hasDragged = true;
        this.renderer.isBoxSelecting = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.renderer.isBoxSelecting = false;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

      const myPlayerId = this.network.myPlayerId;

      // 1. Mode Construction actif
      if (this.selectedBuildMode && !hasDragged) {
        const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
        if (cell) {
          const success = this.engine.buildInfrastructure(myPlayerId, cell.x, cell.y, this.selectedBuildMode);
          if (success && !e.shiftKey) {
            this.selectedBuildMode = null;
            document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
          }
        }
        return;
      }

      // 2. Sélection par Box Select (Marquee)
      if (hasDragged) {
        const minScreenX = Math.min(startScreenX, mouseX);
        const maxScreenX = Math.max(startScreenX, mouseX);
        const minScreenY = Math.min(startScreenY, mouseY);
        const maxScreenY = Math.max(startScreenY, mouseY);

        this.deselectAll();

        this.engine.units.forEach((u) => {
          if (u.factionId === myPlayerId && u.hp > 0) {
            const screenPos = this.renderer.worldToScreen(u.x, u.y);
            if (
              screenPos.x >= minScreenX &&
              screenPos.x <= maxScreenX &&
              screenPos.y >= minScreenY &&
              screenPos.y <= maxScreenY
            ) {
              u.isSelected = true;
              this.selectedUnits.push(u);
            }
          }
        });

        if (this.selectedUnits.length > 0) {
          SOUND.playClick();
        }
        this.updateSelectionDisplay();
        return;
      }

      // 3. Clic simple gauche : Sélection d'une seule unité
      const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
      if (!cell) return;

      const clickedUnit = this.engine.units.find(
        (u) => Math.hypot(u.x - (cell.x + 0.5), u.y - (cell.y + 0.5)) < 1.0 && u.hp > 0
      );

      if (clickedUnit && clickedUnit.factionId === myPlayerId) {
        this.selectSingleUnit(clickedUnit);
      } else {
        this.deselectAll();
      }

      this.updateSelectionDisplay();
    });

    // Clic droit : Ordre de déplacement ou Attaque
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (this.renderer.hasRightDragged) return;
      if (this.selectedUnits.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const cell = this.renderer.screenToWorldCell(mouseX, mouseY);

      if (!cell) return;

      const myPlayerId = this.network.myPlayerId;

      // Vérifier si un ennemi a été ciblé
      const targetEnemy = this.engine.units.find(
        (u) => u.factionId !== myPlayerId && Math.hypot(u.x - (cell.x + 0.5), u.y - (cell.y + 0.5)) < 1.4 && u.hp > 0
      );

      if (targetEnemy) {
        // ORDRE D'ATTAQUE
        this.selectedUnits.forEach((u) => {
          u.attackTarget(targetEnemy);
        });
        this.renderer.addOrderRipple(mouseX, mouseY, true);
        SOUND.playCharge();
      } else {
        // ORDRE DE DÉPLACEMENT EN FORMATION
        const count = this.selectedUnits.length;
        const cols = Math.ceil(Math.sqrt(count));

        this.selectedUnits.forEach((u, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const offsetX = (col - cols / 2) * 0.7;
          const offsetY = (row - cols / 2) * 0.7;

          u.moveTo(cell.x + offsetX, cell.y + offsetY);
        });

        this.renderer.addOrderRipple(mouseX, mouseY, false);
        SOUND.playClick();
      }
    });
  }

  selectSingleUnit(unit) {
    this.deselectAll();
    unit.isSelected = true;
    this.selectedUnits = [unit];
    SOUND.playClick();
    this.updateSelectionDisplay();
  }

  deselectAll() {
    this.selectedUnits.forEach((u) => (u.isSelected = false));
    this.selectedUnits = [];
    this.updateSelectionDisplay();
  }

  updateSelectionDisplay() {
    if (!this.elSelectionInfo) return;

    if (this.selectedUnits.length === 0) {
      this.elSelectionInfo.innerHTML = `<span class="mc-gray">Aucun bataillon sélectionné. Clic gauche ou glisser pour sélectionner.</span>`;
      return;
    }

    const counts = {};
    this.selectedUnits.forEach((u) => {
      counts[u.name] = (counts[u.name] || 0) + 1;
    });

    const summary = Object.entries(counts)
      .map(([name, num]) => `<strong>${num}</strong> ${name}`)
      .join(", ");

    const totalHp = this.selectedUnits.reduce((acc, u) => acc + u.hp, 0);
    const maxHp = this.selectedUnits.reduce((acc, u) => acc + u.maxHp, 0);

    this.elSelectionInfo.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <span>BATAILLONS : <strong style="color:var(--parchment-green)">${summary}</strong> (${this.selectedUnits.length})</span>
        <span style="font-family:var(--font-mono); font-size:11px; color:#57442d;">PV : ${totalHp}/${maxHp}</span>
      </div>
    `;
  }

  // Boucle de rafraîchissement continue du HUD
  updateHUD() {
    const myPlayerId = this.network.myPlayerId;
    const playerFaction = this.engine.factions.get(myPlayerId);
    if (!playerFaction) return;

    // Nom et Bannière
    if (this.elNationName) {
      this.elNationName.textContent = playerFaction.name;
      this.elNationName.style.color = playerFaction.border;
    }

    // Stade de progression ou Mode Bac à Sable
    if (this.elStageBadge) {
      if (this.engine.gameMode === "sandbox") {
        this.elStageBadge.textContent = "[BAC À SABLE]";
        this.elStageBadge.style.color = "var(--parchment-gold)";
      } else {
        const stage = CONFIG.STAGES[playerFaction.stageTier];
        if (stage) {
          this.elStageBadge.textContent = `[T${stage.tier}] ${stage.name}`;
          this.elStageBadge.style.color = "";
        }
      }
    }

    // Scoreboard Mood
    const moodState = this.engine.getMoodState(playerFaction.moodScore);
    if (this.elMoodValue && this.elMoodStatus) {
      const scoreStr = playerFaction.moodScore >= 0 ? `+${playerFaction.moodScore}` : `${playerFaction.moodScore}`;
      this.elMoodValue.textContent = `${scoreStr} pts`;
      this.elMoodStatus.textContent = moodState.name;
      this.elMoodStatus.style.color = CONFIG.MC_COLORS[moodState.color] || "#ffffff";
    }

    if (this.elMoodBar) {
      const pct = Math.max(0, Math.min(100, ((playerFaction.moodScore + 1000) / 2000) * 100));
      this.elMoodBar.style.width = `${pct}%`;
      this.elMoodBar.style.backgroundColor = CONFIG.MC_COLORS[moodState.color] || "#249278";
    }

    // Ressources
    if (this.elFood) this.elFood.textContent = playerFaction.food;
    if (this.elWood) this.elWood.textContent = playerFaction.wood;
    if (this.elStone) this.elStone.textContent = playerFaction.stone;
    if (this.elGold) this.elGold.textContent = playerFaction.gold;

    // Compte des troupes actives
    const activeTroops = this.engine.units.filter((u) => u.factionId === myPlayerId).length;
    if (this.elTroops) this.elTroops.textContent = activeTroops;
    if (this.elTerritory) this.elTerritory.textContent = `${playerFaction.territoryCount} secteurs`;

    if (this.elDayDisplay) {
      this.elDayDisplay.textContent = `JOUR ${this.engine.dayCount}`;
    }

    // Nettoyer les unités mortes de la sélection
    if (this.selectedUnits.some((u) => u.hp <= 0)) {
      this.selectedUnits = this.selectedUnits.filter((u) => u.hp > 0);
      this.updateSelectionDisplay();
    }

    // Inspection du secteur survolé si aucun bataillon sélectionné
    if (this.renderer.hoverCell && this.selectedUnits.length === 0 && !this.selectedBuildMode && this.elSelectionInfo) {
      const c = this.renderer.hoverCell;
      const ownerFac = c.owner > 0 ? this.engine.factions.get(c.owner) : null;
      const ownerStr = ownerFac ? `<strong style="color:${ownerFac.border}">${ownerFac.name}</strong>` : `<span class="mc-gray">Terre Sauvage</span>`;
      const infraStr = c.infrastructure ? ` | Bâtiment : <strong style="color:#b45309">${CONFIG.INFRASTRUCTURES[c.infrastructure.toUpperCase()]?.name || c.infrastructure}</strong>` : "";
      this.elSelectionInfo.innerHTML = `
        <span style="font-size:11px;">Secteur (${c.x}, ${c.y}) : <strong>${c.terrain.name}</strong> | ${c.terrain.desc} | Contrôle : ${ownerStr}${infraStr}</span>
      `;
    }

    this.renderCombatLog();
  }

  renderCombatLog() {
    if (!this.elCombatLog) return;
    const msgs = this.engine.logMessages.slice(0, 15);
    const html = msgs
      .map((msg) => `<div class="log-entry">${this.parseMinecraftColors(msg.text)}</div>`)
      .join("");
    this.elCombatLog.innerHTML = html;
  }

  parseMinecraftColors(text) {
    if (!text) return "";
    let safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const regex = /§([0-9a-fklmnor])/g;

    safe = safe.replace(regex, (match, code) => {
      const hex = CONFIG.MC_COLORS[`§${code}`];
      if (hex) {
        return `</span><span style="color: ${hex}">`;
      }
      return "</span>";
    });

    return `<span>${safe}</span>`;
  }
}

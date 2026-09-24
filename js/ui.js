/**
 * Jerry's Nations: Frontline Realms - UI Controller & DOM Binder
 * Synchronisation du HUD de guerre, du slider de troupes %, des raccourcis rapides,
 * du scoreboard jn_mood, du journal de combat avec parseur de codes §a/§c, et des actions de construction.
 */

import { CONFIG } from "./config.js";
import { SOUND } from "./audio.js";

export class UIManager {
  constructor(engine, renderer, network) {
    this.engine = engine;
    this.renderer = renderer;
    this.network = network;

    this.selectedTroopPercent = 25;
    this.selectedBuildMode = null; // null ou "farm", "palisade", "watchtower", "citadel"

    this.bindDomElements();
    this.setupAttackDragControls();
    this.setupSpeedControls();
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
    this.elSunMoonIcon = document.getElementById("hud-sun-moon");

    this.elTroopSlider = document.getElementById("troop-slider");
    this.elTroopPercentDisplay = document.getElementById("troop-percent-display");
    this.elTroopCountPreview = document.getElementById("troop-count-preview");

    this.elCombatLog = document.getElementById("combat-log-stream");
    this.elMuteBtn = document.getElementById("btn-toggle-sound");

    // Slider de troupes
    if (this.elTroopSlider) {
      this.elTroopSlider.addEventListener("input", (e) => {
        this.setTroopPercent(parseInt(e.target.value, 10));
      });
    }

    // Boutons rapides de pourcentage (20%, 50%, 75%, 100%)
    document.querySelectorAll(".btn-quick-pct").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pct = parseInt(btn.dataset.percent, 10);
        this.setTroopPercent(pct);
        SOUND.playClick();
      });
    });

    // Bouton Son On/Off
    if (this.elMuteBtn) {
      this.elMuteBtn.addEventListener("click", () => {
        const isMuted = SOUND.toggleMute();
        this.elMuteBtn.textContent = isMuted ? "[SON : COUPE]" : "[SON : ACTIF]";
        this.elMuteBtn.classList.toggle("muted", isMuted);
      });
    }
  }

  setTroopPercent(pct) {
    this.selectedTroopPercent = Math.max(1, Math.min(100, pct));
    if (this.elTroopSlider) this.elTroopSlider.value = this.selectedTroopPercent;
    if (this.elTroopPercentDisplay) {
      this.elTroopPercentDisplay.textContent = `${this.selectedTroopPercent}%`;
    }

    // Mise à jour de l'état actif sur les boutons
    document.querySelectorAll(".btn-quick-pct").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseInt(btn.dataset.percent, 10) === this.selectedTroopPercent
      );
    });
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

  setupBuildControls() {
    document.querySelectorAll(".btn-build-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.buildType;
        if (this.selectedBuildMode === type) {
          this.selectedBuildMode = null; // Annuler mode construction
          btn.classList.remove("active");
        } else {
          this.selectedBuildMode = type;
          document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          SOUND.playClick();
        }
      });
    });
  }

  setupAttackDragControls() {
    const canvas = this.renderer.canvas;
    let isMouseDown = false;

    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || e.shiftKey) return; // Seul le clic gauche simple est réservé aux assauts

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const cell = this.renderer.screenToWorldCell(mouseX, mouseY);

      if (!cell) return;

      const myPlayerId = this.network.myPlayerId;

      // Mode Construction actif
      if (this.selectedBuildMode) {
        if (cell.owner === myPlayerId) {
          this.engine.buildInfrastructure(myPlayerId, cell.x, cell.y, this.selectedBuildMode);
        }
        return;
      }

      // Début de ciblage d'assaut depuis son propre territoire
      if (cell.owner === myPlayerId) {
        isMouseDown = true;
        this.renderer.dragAttackSource = cell;
        this.renderer.dragAttackTarget = cell;
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isMouseDown || !this.renderer.dragAttackSource) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const targetCell = this.renderer.screenToWorldCell(mouseX, mouseY);

      if (targetCell) {
        this.renderer.dragAttackTarget = targetCell;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;

      const source = this.renderer.dragAttackSource;
      const target = this.renderer.dragAttackTarget;

      this.renderer.dragAttackSource = null;
      this.renderer.dragAttackTarget = null;

      if (!source || !target) return;

      const myPlayerId = this.network.myPlayerId;

      if (source.owner === myPlayerId && target.owner !== myPlayerId && target.terrain.traversable) {
        // Exécuter l'attaque
        const success = this.engine.launchAttack(
          myPlayerId,
          source.x,
          source.y,
          target.x,
          target.y,
          this.selectedTroopPercent
        );

        if (success) {
          this.network.sendAttack(
            source.x,
            source.y,
            target.x,
            target.y,
            this.selectedTroopPercent
          );
        }
      }
    });
  }

  // Boucle de rafraîchissement du HUD
  updateHUD() {
    const myPlayerId = this.network.myPlayerId;
    const playerFaction = this.engine.factions.get(myPlayerId);
    if (!playerFaction) return;

    // Nom et Bannière
    if (this.elNationName) {
      this.elNationName.textContent = playerFaction.name;
      this.elNationName.style.color = playerFaction.border;
    }

    // Stade de progression
    const stage = CONFIG.STAGES[playerFaction.stageTier];
    if (this.elStageBadge && stage) {
      this.elStageBadge.textContent = `[T${stage.tier}] ${stage.name}`;
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
      // Normaliser [-1000..1000] en [0%..100%]
      const pct = Math.max(0, Math.min(100, ((playerFaction.moodScore + 1000) / 2000) * 100));
      this.elMoodBar.style.width = `${pct}%`;
      this.elMoodBar.style.backgroundColor = CONFIG.MC_COLORS[moodState.color] || "#249278";
    }

    // Ressources
    if (this.elFood) this.elFood.textContent = playerFaction.food;
    if (this.elWood) this.elWood.textContent = playerFaction.wood;
    if (this.elStone) this.elStone.textContent = playerFaction.stone;
    if (this.elGold) this.elGold.textContent = playerFaction.gold;
    if (this.elTroops) this.elTroops.textContent = playerFaction.troops;
    if (this.elTerritory) this.elTerritory.textContent = `${playerFaction.territoryCount} pts`;

    // Aperçu calculé du slider
    if (this.elTroopCountPreview) {
      const count = Math.max(3, Math.floor(playerFaction.troops * (this.selectedTroopPercent / 100)));
      this.elTroopCountPreview.textContent = `(${count} troupes)`;
    }

    // Heure et jour
    if (this.elDayDisplay) {
      this.elDayDisplay.textContent = `JOUR ${this.engine.dayCount}`;
    }

    // Journal de combat (mise à jour si nouveau message)
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

  // Parseur de codes de couleurs Minecraft (§a, §c, §e...)
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

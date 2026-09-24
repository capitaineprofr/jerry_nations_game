/**
 * Jerry's Nations: Frontline Realms - Standalone Game Bundle
 * Concaténation autonome 100% compatible file:/// (sans restriction CORS de modules ES6).
 */

(function () {
  "use strict";

  // ==================== 1. CONFIGURATION & CONSTANTES ====================
  const CONFIG = {
    VERSION: "1.0.0",
    TICK_RATE: 20,
    MAP_WIDTH: 140,
    MAP_HEIGHT: 90,
    CELL_SIZE: 12,
    DAY_DURATION_SEC: 45,

    MOOD: {
      GOLDEN_AGE: { min: 750, max: 1000, key: "golden_age", name: "Âge d'Or", color: "§a", speedBuff: 1.30, combatBuff: 1.25 },
      PROSPEROUS: { min: 250, max: 749, key: "prosperous", name: "Prospère", color: "§2", speedBuff: 1.15, combatBuff: 1.10 },
      STABLE:     { min: -249, max: 249, key: "stable", name: "Stable", color: "§7", speedBuff: 1.00, combatBuff: 1.00 },
      UNHAPPY:    { min: -749, max: -250, key: "unhappy", name: "Mécontente", color: "§6", speedBuff: 0.75, combatBuff: 0.80 },
      REVOLT:     { min: -1000, max: -750, key: "revolt", name: "En Révolte", color: "§c", speedBuff: 0.50, combatBuff: 0.60 }
    },

    STAGES: [
      { tier: 0, id: "settlement", name: "Campement", reqPop: 10, reqTerritory: 20, reqGold: 0, maxCities: 1, color: "§7" },
      { tier: 1, id: "union", name: "Union", reqPop: 35, reqTerritory: 60, reqGold: 50, maxCities: 1, color: "§f" },
      { tier: 2, id: "commonwealth", name: "Commonwealth", reqPop: 80, reqTerritory: 140, reqGold: 150, maxCities: 1, color: "§e" },
      { tier: 3, id: "state", name: "État", reqPop: 150, reqTerritory: 260, reqGold: 350, maxCities: 2, color: "§6" },
      { tier: 4, id: "developing_state", name: "État en Dév.", reqPop: 260, reqTerritory: 450, reqGold: 700, maxCities: 2, color: "§b" },
      { tier: 5, id: "advanced_state", name: "État Avancé", reqPop: 420, reqTerritory: 750, reqGold: 1200, maxCities: 3, color: "§9" },
      { tier: 6, id: "nation", name: "Nation", reqPop: 650, reqTerritory: 1200, reqGold: 2000, maxCities: 5, color: "§2" },
      { tier: 7, id: "rising_nation", name: "Nation Émergente", reqPop: 950, reqTerritory: 1800, reqGold: 3200, maxCities: 6, color: "§a" },
      { tier: 8, id: "established_nation", name: "Nation Établie", reqPop: 1400, reqTerritory: 2600, reqGold: 5000, maxCities: 8, color: "§d" },
      { tier: 9, id: "great_nation", name: "Grande Nation", reqPop: 2000, reqTerritory: 3800, reqGold: 8000, maxCities: 10, color: "§5" },
      { tier: 10, id: "superpower_nation", name: "Superpuissance", reqPop: 3000, reqTerritory: 5500, reqGold: 13000, maxCities: 12, color: "§c" }
    ],

    TERRAIN: {
      DEEP_WATER: { id: 0, name: "Mer Parchemin", color: "#dec89b", traversable: false, moveCost: 999 },
      SHALLOW_WATER: { id: 1, name: "Rivière / Côte", color: "#ebe0c1", traversable: true, moveCost: 2.2 },
      PLAIN: { id: 2, name: "Plaine Fertile", color: "#5b7b4a", traversable: true, moveCost: 1.0, foodYield: 1.2 },
      FOREST: { id: 3, name: "Forêt Dense", color: "#34512b", traversable: true, moveCost: 1.5, woodYield: 1.5, defenseBonus: 0.25 },
      HILLS: { id: 4, name: "Collines Rocheuses", color: "#8a7b62", traversable: true, moveCost: 1.8, stoneYield: 1.5, defenseBonus: 0.40 },
      MOUNTAIN: { id: 5, name: "Hautes Montagnes", color: "#a49782", traversable: false, moveCost: 999, defenseBonus: 0.80 }
    },

    FACTIONS: [
      { id: 1, name: "Empire d'Émeraude", color: "#249278", border: "#55FF55", textCode: "§a", isPlayer: true, isAI: false },
      { id: 2, name: "Clan Maraudeur", color: "#8a2424", border: "#FF5555", textCode: "§c", isPlayer: false, isAI: true, personality: "aggressive" },
      { id: 3, name: "Ordre Solaire", color: "#b8860b", border: "#FFFF55", textCode: "§e", isPlayer: false, isAI: true, personality: "expansionist" },
      { id: 4, name: "Confédération Royale", color: "#2255aa", border: "#55FFFF", textCode: "§b", isPlayer: false, isAI: true, personality: "defensive" },
      { id: 5, name: "Guilde d'Améthyste", color: "#6a2d9c", border: "#FF55FF", textCode: "§d", isPlayer: false, isAI: true, personality: "balanced" }
    ],

    INFRASTRUCTURES: {
      FARM: { id: "farm", name: "Ferme Coloniale", woodCost: 40, stoneCost: 10, foodBonus: 4.0, icon: "farm" },
      PALISADE: { id: "palisade", name: "Palissade Frontalière", woodCost: 30, stoneCost: 15, defenseBonus: 0.40, icon: "shield" },
      WATCHTOWER: { id: "watchtower", name: "Tour de Guet", woodCost: 60, stoneCost: 50, defenseBonus: 0.80, range: 4, icon: "tower" },
      CITADEL: { id: "citadel", name: "Bastion de Forteresse", woodCost: 150, stoneCost: 200, goldCost: 100, defenseBonus: 1.50, troopBonus: 2.0, icon: "fortress" }
    },

    MC_COLORS: {
      "§0": "#000000", "§1": "#1e3a8a", "§2": "#15803d", "§3": "#0284c7",
      "§4": "#991b1b", "§5": "#7e22ce", "§6": "#b45309", "§7": "#57534e",
      "§8": "#292524", "§9": "#1d4ed8", "§a": "#15803d", "§b": "#0369a1",
      "§c": "#b91c1c", "§d": "#a21caf", "§e": "#854d0e", "§f": "#1c1917"
    }
  };

  // ==================== 2. MOTEUR AUDIO PROCÉDURAL ====================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.masterGain = null;
    }

    init() {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
    }

    resume() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.25, this.ctx.currentTime);
      }
      return this.muted;
    }

    playClick() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    playCharge() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(330, now + 0.15);
      osc1.frequency.setValueAtTime(440, now + 0.25);
      osc2.frequency.setValueAtTime(110, now);
      osc2.frequency.exponentialRampToValueAtTime(165, now + 0.15);
      osc2.frequency.setValueAtTime(220, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    }

    playClash() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      whiteNoise.start(now);
    }

    playRaidAlert() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.8);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.95);
    }

    playLevelUp() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const time = now + idx * 0.08;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.4);
      });
    }

    playBuild() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    playSunsetBell() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 1.2);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.35);
    }
  }

  const SOUND = new SoundEngine();

  // ==================== 3. CARTE DU MONDE (WORLD MAP) ====================
  class WorldMap {
    constructor(width = CONFIG.MAP_WIDTH, height = CONFIG.MAP_HEIGHT) {
      this.width = width;
      this.height = height;
      this.grid = new Array(width * height);
      this.capitals = [];
    }

    generate(seed = Date.now()) {
      const prng = this.createPrng(seed);
      const heightMap = new Float32Array(this.width * this.height);
      const moistureMap = new Float32Array(this.width * this.height);

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const nx = (x / this.width) * 4;
          const ny = (y / this.height) * 4;
          const dx = 2 * (x / this.width) - 1;
          const dy = 2 * (y / this.height) - 1;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let h = Math.sin(nx + prng() * 0.1) * 0.4 + Math.cos(ny + prng() * 0.1) * 0.4;
          h += Math.sin(nx * 2) * 0.2 + Math.cos(ny * 2) * 0.2;
          h += Math.sin(nx * 4) * 0.1 + Math.cos(ny * 4) * 0.1;
          h = (h + 1) * 0.5 - dist * 0.45;

          let m = (Math.sin(nx * 1.5 + 1.2) * 0.5 + Math.cos(ny * 1.5 + 0.8) * 0.5 + 1) * 0.5;

          const idx = y * this.width + x;
          heightMap[idx] = h;
          moistureMap[idx] = m;
        }
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = y * this.width + x;
          const h = heightMap[idx];
          const m = moistureMap[idx];

          let terrain;
          if (h < 0.22) terrain = CONFIG.TERRAIN.DEEP_WATER;
          else if (h < 0.32) terrain = CONFIG.TERRAIN.SHALLOW_WATER;
          else if (h > 0.78) terrain = CONFIG.TERRAIN.MOUNTAIN;
          else if (h > 0.62) terrain = CONFIG.TERRAIN.HILLS;
          else if (m > 0.55) terrain = CONFIG.TERRAIN.FOREST;
          else terrain = CONFIG.TERRAIN.PLAIN;

          this.grid[idx] = {
            x, y, terrain, owner: 0,
            troops: terrain.traversable ? Math.floor(prng() * 5) + 2 : 0,
            infrastructure: null, isCapital: false, capitalFactionId: null
          };
        }
      }

      this.placeCapitals(prng);
    }

    placeCapitals(prng) {
      this.capitals = [];
      const factions = CONFIG.FACTIONS;
      const candidates = [];

      for (let y = 10; y < this.height - 10; y++) {
        for (let x = 10; x < this.width - 10; x++) {
          const cell = this.getCell(x, y);
          if (cell && cell.terrain === CONFIG.TERRAIN.PLAIN) candidates.push(cell);
        }
      }

      if (candidates.length === 0) return;
      const minDist = Math.floor(Math.min(this.width, this.height) / (factions.length * 0.7));

      factions.forEach((faction) => {
        let chosen = null;
        let attempts = 0;
        while (!chosen && attempts < 200) {
          attempts++;
          const candidate = candidates[Math.floor(prng() * candidates.length)];
          const tooClose = this.capitals.some((cap) => Math.hypot(cap.x - candidate.x, cap.y - candidate.y) < minDist);
          if (!tooClose) chosen = candidate;
        }
        if (!chosen) chosen = candidates[Math.floor(prng() * candidates.length)];

        chosen.owner = faction.id;
        chosen.isCapital = true;
        chosen.capitalFactionId = faction.id;
        chosen.troops = 120;
        chosen.infrastructure = "citadel";

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighbor = this.getCell(chosen.x + dx, chosen.y + dy);
            if (neighbor && neighbor.terrain.traversable) {
              neighbor.owner = faction.id;
              neighbor.troops = 30;
            }
          }
        }

        this.capitals.push({ factionId: faction.id, x: chosen.x, y: chosen.y, name: faction.name });
      });
    }

    getCell(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
      return this.grid[y * this.width + x];
    }

    getNeighbors(x, y) {
      const list = [];
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const c = this.getCell(x + dx, y + dy);
        if (c) list.push(c);
      }
      return list;
    }

    isBorderCell(x, y, factionId) {
      const cell = this.getCell(x, y);
      if (!cell || cell.owner !== factionId) return false;
      const neighbors = this.getNeighbors(x, y);
      return neighbors.some((n) => n.owner !== factionId && n.terrain.traversable);
    }

    getBorderCells(factionId) {
      const borders = [];
      for (let i = 0; i < this.grid.length; i++) {
        const cell = this.grid[i];
        if (cell.owner === factionId && this.isBorderCell(cell.x, cell.y, factionId)) {
          borders.push(cell);
        }
      }
      return borders;
    }

    countFactionTerritory(factionId) {
      let count = 0;
      for (let i = 0; i < this.grid.length; i++) {
        if (this.grid[i].owner === factionId) count++;
      }
      return count;
    }

    createPrng(seed) {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }
  }

  // ==================== 4. MOTEUR DE SIMULATION ====================
  class GameEngine {
    constructor(worldMap) {
      this.map = worldMap;
      this.tickCount = 0;
      this.dayTimeSec = 0;
      this.dayCount = 1;
      this.timeScale = 1;
      this.isPaused = false;

      this.factions = new Map();
      this.attackWaves = [];
      this.combatEvents = [];
      this.logMessages = [];

      this.initFactions();
    }

    initFactions() {
      CONFIG.FACTIONS.forEach((fac) => {
        this.factions.set(fac.id, {
          ...fac,
          territoryCount: 0,
          population: 50,
          troops: 80,
          food: 120,
          wood: 60,
          stone: 40,
          gold: 100,
          moodScore: 0,
          stageTier: 0,
          isDefeated: false,
          totalLosses: 0,
          totalKills: 0
        });
      });
      this.updateTerritoryCounts();
    }

    updateTerritoryCounts() {
      this.factions.forEach((f) => {
        f.territoryCount = this.map.countFactionTerritory(f.id);
        if (f.territoryCount === 0 && !f.isDefeated) {
          f.isDefeated = true;
          this.addLog(`§cLa faction ${f.name} a été totalement anéantie !`);
        }
      });
    }

    update() {
      if (this.isPaused || this.timeScale === 0) return;
      const iterations = this.timeScale;
      for (let it = 0; it < iterations; it++) {
        this.tickCount++;
        this.dayTimeSec += 1 / CONFIG.TICK_RATE;

        this.updateAttackWaves();

        if (this.tickCount % CONFIG.TICK_RATE === 0) {
          this.updateEconomy();
          this.checkStageAdvancements();
        }

        if (this.dayTimeSec >= CONFIG.DAY_DURATION_SEC) {
          this.dayTimeSec = 0;
          this.dayCount++;
          this.executeSunsetBanquet();
        }
      }
    }

    executeSunsetBanquet() {
      SOUND.playSunsetBell();
      this.addLog(`§6[Crépuscule - Jour ${this.dayCount}] Le banquet de la nation commence...`);

      this.factions.forEach((f) => {
        if (f.isDefeated) return;
        const foodRequired = Math.ceil(f.troops / 15) + Math.ceil(f.population / 25);
        if (f.food >= foodRequired) {
          f.food -= foodRequired;
          f.moodScore = Math.min(1000, f.moodScore + 35);
          if (f.isPlayer) this.addLog(`§aBanquet réussi : ${foodRequired} rations consommées. Le moral s'élève.`);
        } else {
          const shortfall = foodRequired - f.food;
          f.food = 0;
          const moodPenalty = Math.min(350, 100 + shortfall * 10);
          f.moodScore = Math.max(-1000, f.moodScore - moodPenalty);
          const desertion = Math.ceil(f.troops * 0.08);
          f.troops = Math.max(5, f.troops - desertion);
          if (f.isPlayer) {
            this.addLog(`§c[FAMINE NATIONALE] Pénurie de nourriture ! -${moodPenalty} Mood, ${desertion} soldats ont déserté !`);
            SOUND.playRaidAlert();
          }
        }
      });
    }

    updateEconomy() {
      this.factions.forEach((f) => {
        if (f.isDefeated) return;
        const moodConfig = this.getMoodState(f.moodScore);
        const moodBuff = moodConfig.speedBuff;

        const territoryBonus = Math.sqrt(f.territoryCount) * 0.4;
        const troopGain = Math.max(1, Math.floor((1.5 + territoryBonus) * moodBuff));
        f.troops += troopGain;

        let foodProd = f.territoryCount * 0.15;
        let woodProd = 0.5;
        let stoneProd = 0.3;
        let goldProd = f.territoryCount * 0.12;

        for (let i = 0; i < this.map.grid.length; i++) {
          const cell = this.map.grid[i];
          if (cell.owner === f.id && cell.infrastructure) {
            const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
            if (infra && infra.foodBonus) foodProd += infra.foodBonus;
          }
        }

        f.food = Math.floor(f.food + foodProd);
        f.wood = Math.floor(f.wood + woodProd);
        f.stone = Math.floor(f.stone + stoneProd);
        f.gold = Math.floor(f.gold + goldProd);
      });
    }

    launchAttack(attackerId, fromX, fromY, targetX, targetY, troopPercent) {
      const faction = this.factions.get(attackerId);
      if (!faction || faction.isDefeated) return false;

      const fromCell = this.map.getCell(fromX, fromY);
      const targetCell = this.map.getCell(targetX, targetY);

      if (!fromCell || !targetCell) return false;
      if (fromCell.owner !== attackerId || targetCell.owner === attackerId) return false;
      if (!targetCell.terrain.traversable) return false;

      const troopsToCommit = Math.max(3, Math.floor(faction.troops * (troopPercent / 100)));
      if (faction.troops < troopsToCommit) return false;

      faction.troops -= troopsToCommit;
      const moodState = this.getMoodState(faction.moodScore);
      const baseSpeed = 1.6 * moodState.speedBuff;

      this.attackWaves.push({
        id: Math.random().toString(36).substring(2, 9),
        attackerId, fromX, fromY, currentX: fromX, currentY: fromY,
        targetX, targetY, totalTroops: troopsToCommit, currentTroops: troopsToCommit,
        speed: baseSpeed, progress: 0
      });

      if (attackerId === 1) SOUND.playCharge();
      return true;
    }

    updateAttackWaves() {
      for (let i = this.attackWaves.length - 1; i >= 0; i--) {
        const wave = this.attackWaves[i];
        const distTotal = Math.hypot(wave.targetX - wave.fromX, wave.targetY - wave.fromY) || 1;
        wave.progress += (wave.speed / distTotal) * 0.15;
        wave.currentX = wave.fromX + (wave.targetX - wave.fromX) * Math.min(1, wave.progress);
        wave.currentY = wave.fromY + (wave.targetY - wave.fromY) * Math.min(1, wave.progress);

        if (wave.progress >= 1.0) {
          this.resolveFrontlineClash(wave);
          this.attackWaves.splice(i, 1);
        }
      }
    }

    resolveFrontlineClash(wave) {
      const targetCell = this.map.getCell(wave.targetX, wave.targetY);
      if (!targetCell) return;

      const attacker = this.factions.get(wave.attackerId);
      const defenderId = targetCell.owner;
      const defender = this.factions.get(defenderId);

      const attMood = attacker ? this.getMoodState(attacker.moodScore).combatBuff : 1;
      let defBonus = targetCell.terrain.defenseBonus || 0;

      if (targetCell.infrastructure) {
        const infra = CONFIG.INFRASTRUCTURES[targetCell.infrastructure.toUpperCase()];
        if (infra && infra.defenseBonus) defBonus += infra.defenseBonus;
      }

      const attackPower = wave.currentTroops * attMood;
      const defensePower = (targetCell.troops || 2) * (1 + defBonus);

      this.combatEvents.push({ x: targetCell.x, y: targetCell.y, life: 25, attackerId: wave.attackerId, defenderId });
      if (wave.attackerId === 1 || defenderId === 1) SOUND.playClash();

      if (attackPower > defensePower) {
        const remainingTroops = Math.max(1, Math.floor((attackPower - defensePower) / attMood));
        if (targetCell.isCapital && defender) {
          this.addLog(`§c[CAPITALE CAPTURÉE] ${attacker.name} s'est emparé de la capitale de ${defender.name} !`);
          SOUND.playRaidAlert();
          targetCell.isCapital = false;
          attacker.moodScore = Math.min(1000, attacker.moodScore + 200);
          defender.moodScore = Math.max(-1000, defender.moodScore - 400);
        }

        targetCell.owner = wave.attackerId;
        targetCell.troops = remainingTroops;
        targetCell.infrastructure = null;

        if (attacker) {
          attacker.moodScore = Math.min(1000, attacker.moodScore + 5);
          attacker.totalKills += Math.floor(defensePower);
        }
        if (defender) {
          defender.moodScore = Math.max(-1000, defender.moodScore - 8);
          defender.totalLosses += Math.floor(defensePower);
        }
        this.updateTerritoryCounts();
      } else {
        targetCell.troops = Math.max(1, Math.floor((defensePower - attackPower) / (1 + defBonus)));
        if (attacker) {
          attacker.moodScore = Math.max(-1000, attacker.moodScore - 10);
          attacker.totalLosses += wave.currentTroops;
        }
        if (defender) {
          defender.moodScore = Math.min(1000, defender.moodScore + 8);
          defender.totalKills += wave.currentTroops;
        }
      }
    }

    checkStageAdvancements() {
      this.factions.forEach((f) => {
        if (f.isDefeated) return;
        const nextStage = CONFIG.STAGES[f.stageTier + 1];
        if (nextStage) {
          const canAdvance =
            f.population >= nextStage.reqPop &&
            f.territoryCount >= nextStage.reqTerritory &&
            f.gold >= nextStage.reqGold &&
            f.moodScore >= 0;

          if (canAdvance) {
            f.stageTier++;
            f.gold -= nextStage.reqGold;
            f.moodScore = Math.min(1000, f.moodScore + 150);
            if (f.isPlayer) {
              SOUND.playLevelUp();
              this.addLog(`§a§l[PROMOTION DE NATION] Votre nation accède au stade ${nextStage.name} (Tier ${nextStage.tier}) !`);
            } else {
              this.addLog(`§e${f.name} a atteint le stade ${nextStage.name} (Tier ${nextStage.tier}).`);
            }
          }
        }
      });
    }

    buildInfrastructure(factionId, x, y, infraType) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;
      const cell = this.map.getCell(x, y);
      if (!cell || cell.owner !== factionId || cell.infrastructure) return false;

      const infra = CONFIG.INFRASTRUCTURES[infraType.toUpperCase()];
      if (!infra) return false;

      const woodCost = infra.woodCost || 0;
      const stoneCost = infra.stoneCost || 0;
      const goldCost = infra.goldCost || 0;

      if (faction.wood < woodCost || faction.stone < stoneCost || faction.gold < goldCost) return false;

      faction.wood -= woodCost;
      faction.stone -= stoneCost;
      faction.gold -= goldCost;

      cell.infrastructure = infra.id;
      if (infra.id === "citadel" || infra.id === "palisade") cell.troops += 20;

      if (factionId === 1) {
        SOUND.playBuild();
        this.addLog(`§2${infra.name} bâtie avec succès en (${x}, ${y}).`);
      }
      return true;
    }

    getMoodState(score) {
      if (score >= CONFIG.MOOD.GOLDEN_AGE.min) return CONFIG.MOOD.GOLDEN_AGE;
      if (score >= CONFIG.MOOD.PROSPEROUS.min) return CONFIG.MOOD.PROSPEROUS;
      if (score >= CONFIG.MOOD.STABLE.min) return CONFIG.MOOD.STABLE;
      if (score >= CONFIG.MOOD.UNHAPPY.min) return CONFIG.MOOD.UNHAPPY;
      return CONFIG.MOOD.REVOLT;
    }

    addLog(msg) {
      this.logMessages.unshift({ text: msg, time: Date.now() });
      if (this.logMessages.length > 40) this.logMessages.pop();
    }
  }

  // ==================== 5. RENDU CANVAS 2D (60 FPS) ====================
  class MapRenderer {
    constructor(canvas, worldMap, engine) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
      this.map = worldMap;
      this.engine = engine;

      this.scale = 1.0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;

      this.dragAttackSource = null;
      this.dragAttackTarget = null;
      this.hoverCell = null;

      this.initCanvasSize();
      this.centerCameraOnPlayerCapital();
      this.setupEventListeners();
    }

    initCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
      const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
      this.canvas.width = (width || window.innerWidth) * dpr;
      this.canvas.height = (height || window.innerHeight) * dpr;
      this.ctx.imageSmoothingEnabled = false;
    }

    centerCameraOnPlayerCapital() {
      const playerCapital = this.map.capitals.find((c) => c.factionId === 1);
      const cellSize = CONFIG.CELL_SIZE;
      if (playerCapital) {
        const capWorldX = playerCapital.x * cellSize;
        const capWorldY = playerCapital.y * cellSize;
        this.offsetX = this.canvas.width / 2 - capWorldX * this.scale;
        this.offsetY = this.canvas.height / 2 - capWorldY * this.scale;
      }
    }

    setupEventListeners() {
      window.addEventListener("resize", () => this.initCanvasSize());

      this.canvas.addEventListener("mousedown", (e) => {
        if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
          this.isDragging = true;
          this.dragStartX = e.clientX - this.offsetX;
          this.dragStartY = e.clientY - this.offsetY;
        }
      });

      window.addEventListener("mousemove", (e) => {
        if (this.isDragging) {
          this.offsetX = e.clientX - this.dragStartX;
          this.offsetY = e.clientY - this.dragStartY;
        } else {
          const rect = this.canvas.getBoundingClientRect();
          const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
          const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
          this.hoverCell = this.screenToWorldCell(mouseX, mouseY);
        }
      });

      window.addEventListener("mouseup", () => {
        this.isDragging = false;
      });

      this.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        const newScale = Math.max(0.4, Math.min(3.5, this.scale * zoomFactor));
        this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
        this.scale = newScale;
      }, { passive: false });

      this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    screenToWorldCell(screenX, screenY) {
      const cellSize = CONFIG.CELL_SIZE * this.scale;
      const worldX = Math.floor((screenX - this.offsetX) / cellSize);
      const worldY = Math.floor((screenY - this.offsetY) / cellSize);
      return this.map.getCell(worldX, worldY);
    }

    render() {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const cellSize = CONFIG.CELL_SIZE * this.scale;

      // Fond parchemin infini identique à la couleur des menus
      ctx.fillStyle = "#dec89b";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(this.offsetX, this.offsetY);

      const startX = Math.max(0, Math.floor(-this.offsetX / cellSize));
      const startY = Math.max(0, Math.floor(-this.offsetY / cellSize));
      const endX = Math.min(this.map.width, Math.ceil((width - this.offsetX) / cellSize));
      const endY = Math.min(this.map.height, Math.ceil((height - this.offsetY) / cellSize));

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const cell = this.map.getCell(x, y);
          if (!cell) continue;

          const px = x * cellSize;
          const py = y * cellSize;

          ctx.fillStyle = cell.terrain.color;
          ctx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);

          // Vaguelettes d'encre médiévales sur l'eau (style carte ancienne)
          if (cell.terrain.id === 0 && (x * 3 + y * 7) % 23 === 0) {
            ctx.fillStyle = "#c5ad7c";
            ctx.fillRect(px + 1, py + cellSize * 0.5, Math.max(3, cellSize * 0.55), 1.5);
          }

          if (cell.owner > 0) {
            const faction = this.engine.factions.get(cell.owner);
            if (faction) {
              ctx.fillStyle = faction.color;
              ctx.globalAlpha = 0.65;
              ctx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);
              ctx.globalAlpha = 1.0;

              if (this.map.isBorderCell(x, y, cell.owner)) {
                ctx.strokeStyle = faction.border;
                ctx.lineWidth = Math.max(1, 2 * this.scale);
                ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
              }
            }
          }

          if (cell.isCapital) {
            this.drawCapitalIcon(ctx, px, py, cellSize);
          } else if (cell.infrastructure) {
            this.drawInfraIcon(ctx, px, py, cellSize, cell.infrastructure);
          }
        }
      }

      this.renderAttackWaves(ctx, cellSize);
      this.renderCombatEvents(ctx, cellSize);

      if (this.dragAttackSource && this.dragAttackTarget) {
        this.drawAttackVector(ctx, this.dragAttackSource, this.dragAttackTarget, cellSize);
      }

      if (this.hoverCell) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.hoverCell.x * cellSize, this.hoverCell.y * cellSize, cellSize, cellSize);
      }

      ctx.restore();

      this.renderDayNightAtmosphere(ctx, width, height);
      this.renderMinimap(ctx, width, height);
    }

    drawCapitalIcon(ctx, px, py, cellSize) {
      const cx = px + cellSize / 2;
      const cy = py + cellSize / 2;
      const r = cellSize * 0.45;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (cellSize > 16) {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8);
      }
    }

    drawInfraIcon(ctx, px, py, cellSize, type) {
      const cx = px + cellSize / 2;
      const cy = py + cellSize / 2;
      const r = cellSize * 0.35;
      if (type === "farm") {
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === "citadel" || type === "watchtower") {
        ctx.fillStyle = "#64748b";
        ctx.fillRect(cx - r * 0.6, cy - r * 0.6, r * 1.2, r * 1.2);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - r * 0.6, cy - r * 0.6, r * 1.2, r * 1.2);
      } else if (type === "palisade") {
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      }
    }

    renderAttackWaves(ctx, cellSize) {
      this.engine.attackWaves.forEach((wave) => {
        const faction = this.engine.factions.get(wave.attackerId);
        const color = faction ? faction.border : "#ffffff";
        const x = (wave.currentX + 0.5) * cellSize;
        const y = (wave.currentY + 0.5) * cellSize;

        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(3, 5 * this.scale), 0, Math.PI * 2);
        ctx.fill();

        if (this.scale > 0.8) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.shadowBlur = 2;
          ctx.shadowColor = "#000000";
          ctx.fillText(wave.currentTroops, x, y - 6);
        }
        ctx.restore();
      });
    }

    renderCombatEvents(ctx, cellSize) {
      for (let i = this.engine.combatEvents.length - 1; i >= 0; i--) {
        const event = this.engine.combatEvents[i];
        event.life--;
        const cx = (event.x + 0.5) * cellSize;
        const cy = (event.y + 0.5) * cellSize;

        ctx.save();
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 1.5;
        const spread = (25 - event.life) * 0.8 * this.scale;
        ctx.beginPath();
        ctx.arc(cx, cy, spread, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (event.life <= 0) this.engine.combatEvents.splice(i, 1);
      }
    }

    drawAttackVector(ctx, source, target, cellSize) {
      const sx = (source.x + 0.5) * cellSize;
      const sy = (source.y + 0.5) * cellSize;
      const tx = (target.x + 0.5) * cellSize;
      const ty = (target.y + 0.5) * cellSize;

      ctx.save();
      ctx.strokeStyle = "#55FF55";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = "#FF5555";
      ctx.beginPath();
      ctx.arc(tx, ty, cellSize * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    renderDayNightAtmosphere(ctx, width, height) {
      const dayProgress = this.engine.dayTimeSec / CONFIG.DAY_DURATION_SEC;
      let overlayColor = null;
      if (dayProgress > 0.85 || dayProgress < 0.15) overlayColor = "rgba(10, 20, 45, 0.35)";
      else if (dayProgress >= 0.70 && dayProgress <= 0.85) overlayColor = "rgba(180, 70, 20, 0.18)";
      else if (dayProgress >= 0.15 && dayProgress <= 0.30) overlayColor = "rgba(230, 180, 50, 0.12)";

      if (overlayColor) {
        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, width, height);
      }
    }

    renderMinimap(ctx, screenWidth, screenHeight) {
      const miniW = 160;
      const miniH = 100;
      const miniX = screenWidth - miniW - 16;
      const miniY = screenHeight - miniH - 16;

      ctx.save();
      ctx.fillStyle = "rgba(42, 29, 16, 0.94)";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;
      ctx.fillRect(miniX, miniY, miniW, miniH);
      ctx.strokeRect(miniX, miniY, miniW, miniH);

      const stepX = miniW / this.map.width;
      const stepY = miniH / this.map.height;

      for (let y = 0; y < this.map.height; y += 2) {
        for (let x = 0; x < this.map.width; x += 2) {
          const cell = this.map.getCell(x, y);
          if (cell && cell.owner > 0) {
            const fac = this.engine.factions.get(cell.owner);
            if (fac) {
              ctx.fillStyle = fac.border;
              ctx.fillRect(miniX + x * stepX, miniY + y * stepY, stepX * 2, stepY * 2);
            }
          }
        }
      }

      const cellSize = CONFIG.CELL_SIZE * this.scale;
      const camX = miniX + (-this.offsetX / (this.map.width * cellSize)) * miniW;
      const camY = miniY + (-this.offsetY / (this.map.height * cellSize)) * miniH;
      const camW = (screenWidth / (this.map.width * cellSize)) * miniW;
      const camH = (screenHeight / (this.map.height * cellSize)) * miniH;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(camX, camY, camW, camH);
      ctx.restore();
    }
  }

  // ==================== 6. IA CONTROLLER ====================
  class AIController {
    constructor(engine, worldMap) {
      this.engine = engine;
      this.map = worldMap;
      this.aiTickCounter = 0;
    }

    update() {
      this.aiTickCounter++;
      if (this.aiTickCounter % 25 !== 0) return;

      this.engine.factions.forEach((faction) => {
        if (!faction.isAI || faction.isDefeated) return;
        this.processFactionTurn(faction);
      });
    }

    processFactionTurn(faction) {
      if (faction.troops < 25) return;
      const borders = this.map.getBorderCells(faction.id);
      if (borders.length === 0) return;

      let commitPercent = 25;
      if (faction.personality === "aggressive") commitPercent = 45;
      else if (faction.personality === "expansionist") commitPercent = 35;
      else if (faction.personality === "defensive") commitPercent = 20;

      let bestSource = null;
      let bestTarget = null;
      let bestScore = -999;
      const sampleSize = Math.min(borders.length, 12);

      for (let i = 0; i < sampleSize; i++) {
        const source = borders[Math.floor(Math.random() * borders.length)];
        const neighbors = this.map.getNeighbors(source.x, source.y);

        for (const target of neighbors) {
          if (target.owner === faction.id || !target.terrain.traversable) continue;
          let score = 0;
          if (target.owner === 0) {
            score += 50 - (target.troops || 0);
            if (target.terrain.foodYield) score += 20;
          } else {
            if (faction.personality === "aggressive") score += 40;
            score += Math.max(0, 40 - (target.troops || 0));
            if (target.isCapital) score += 80;
          }

          if (score > bestScore) {
            bestScore = score;
            bestSource = source;
            bestTarget = target;
          }
        }
      }

      if (bestSource && bestTarget && bestScore > 0) {
        this.engine.launchAttack(faction.id, bestSource.x, bestSource.y, bestTarget.x, bestTarget.y, commitPercent);
      }

      if (faction.wood >= 60 && faction.stone >= 50 && Math.random() < 0.2) {
        const buildCell = borders[Math.floor(Math.random() * borders.length)];
        if (buildCell && !buildCell.infrastructure) {
          const infraType = faction.personality === "defensive" ? "palisade" : "farm";
          this.engine.buildInfrastructure(faction.id, buildCell.x, buildCell.y, infraType);
        }
      }
    }
  }

  // ==================== 7. RÉSEAU P2P WEBRTC ====================
  class NetworkManager {
    constructor(engine) {
      this.engine = engine;
      this.peer = null;
      this.connections = [];
      this.hostConn = null;
      this.isHost = false;
      this.isConnected = false;
      this.myPlayerId = 1;
      this.roomId = null;
    }

    createRoom(onSuccess, onError) {
      if (typeof window.Peer === "undefined") {
        if (onError) onError("PeerJS non disponible. Mode Solo actif.");
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
          this.connections.push(conn);
          const assignedId = this.connections.length + 2;
          const clientFaction = this.engine.factions.get(assignedId);
          if (clientFaction) {
            clientFaction.isAI = false;
            clientFaction.isPlayer = true;
          }
          conn.on("open", () => {
            conn.send({ type: "WELCOME", assignedFactionId: assignedId });
            this.engine.addLog(`§aUn joueur a rejoint sous la bannière ${clientFaction ? clientFaction.name : "alliée"} !`);
          });
          conn.on("data", (data) => {
            if (data.type === "ATTACK") {
              this.engine.launchAttack(data.attackerId, data.fromX, data.fromY, data.targetX, data.targetY, data.percent);
            }
          });
        });
        this.peer.on("error", (err) => {
          if (onError) onError(err.message || "Erreur salon.");
        });
      } catch (e) {
        if (onError) onError(e.message);
      }
    }

    joinRoom(targetRoomId, onSuccess, onError) {
      if (typeof window.Peer === "undefined") {
        if (onError) onError("PeerJS non disponible.");
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
            if (data.type === "WELCOME") {
              this.myPlayerId = data.assignedFactionId;
              const f = this.engine.factions.get(this.myPlayerId);
              if (f) {
                f.isAI = false;
                f.isPlayer = true;
              }
              this.engine.addLog(`§aConnecté ! Vous dirigez : ${f ? f.name : "Votre faction"}.`);
            } else if (data.type === "ATTACK_SYNC") {
              this.engine.launchAttack(data.attackerId, data.fromX, data.fromY, data.targetX, data.targetY, data.percent);
            }
          });
          conn.on("error", () => {
            if (onError) onError("Échec connexion au salon.");
          });
        });
        this.peer.on("error", (err) => {
          if (onError) onError(err.message || "Erreur Peer.");
        });
      } catch (e) {
        if (onError) onError(e.message);
      }
    }

    sendAttack(fromX, fromY, targetX, targetY, percent) {
      const payload = { type: "ATTACK", attackerId: this.myPlayerId, fromX, fromY, targetX, targetY, percent };
      if (this.isHost) {
        this.connections.forEach((conn) => {
          if (conn.open) conn.send({ ...payload, type: "ATTACK_SYNC" });
        });
      } else if (this.hostConn && this.hostConn.open) {
        this.hostConn.send(payload);
      }
    }
  }

  // ==================== 8. GESTIONNAIRE D'INTERFACE (UI) ====================
  class UIManager {
    constructor(engine, renderer, network) {
      this.engine = engine;
      this.renderer = renderer;
      this.network = network;

      this.selectedTroopPercent = 25;
      this.selectedBuildMode = null;

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

      this.elTroopSlider = document.getElementById("troop-slider");
      this.elTroopPercentDisplay = document.getElementById("troop-percent-display");
      this.elTroopCountPreview = document.getElementById("troop-count-preview");
      this.elCombatLog = document.getElementById("combat-log-stream");
      this.elMuteBtn = document.getElementById("btn-toggle-sound");

      if (this.elTroopSlider) {
        this.elTroopSlider.addEventListener("input", (e) => {
          this.setTroopPercent(parseInt(e.target.value, 10));
        });
      }

      document.querySelectorAll(".btn-quick-pct").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.setTroopPercent(parseInt(btn.dataset.percent, 10));
          SOUND.playClick();
        });
      });

      if (this.elMuteBtn) {
        this.elMuteBtn.addEventListener("click", () => {
          const isMuted = SOUND.toggleMute();
          this.elMuteBtn.textContent = isMuted ? "[SON : COUPE]" : "[SON : ACTIF]";
        });
      }
    }

    setTroopPercent(pct) {
      this.selectedTroopPercent = Math.max(1, Math.min(100, pct));
      if (this.elTroopSlider) this.elTroopSlider.value = this.selectedTroopPercent;
      if (this.elTroopPercentDisplay) this.elTroopPercentDisplay.textContent = `${this.selectedTroopPercent}%`;

      document.querySelectorAll(".btn-quick-pct").forEach((btn) => {
        btn.classList.toggle("active", parseInt(btn.dataset.percent, 10) === this.selectedTroopPercent);
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
            this.selectedBuildMode = null;
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
        if (e.button !== 0 || e.shiftKey) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
        if (!cell) return;

        const myPlayerId = this.network.myPlayerId;
        if (this.selectedBuildMode) {
          if (cell.owner === myPlayerId) {
            this.engine.buildInfrastructure(myPlayerId, cell.x, cell.y, this.selectedBuildMode);
          }
          return;
        }

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
        if (targetCell) this.renderer.dragAttackTarget = targetCell;
      });

      window.addEventListener("mouseup", () => {
        if (!isMouseDown) return;
        isMouseDown = false;

        const source = this.renderer.dragAttackSource;
        const target = this.renderer.dragAttackTarget;
        this.renderer.dragAttackSource = null;
        this.renderer.dragAttackTarget = null;

        if (!source || !target) return;
        const myPlayerId = this.network.myPlayerId;

        if (source.owner === myPlayerId && target.owner !== myPlayerId && target.terrain.traversable) {
          const success = this.engine.launchAttack(
            myPlayerId, source.x, source.y, target.x, target.y, this.selectedTroopPercent
          );
          if (success) {
            this.network.sendAttack(source.x, source.y, target.x, target.y, this.selectedTroopPercent);
          }
        }
      });
    }

    updateHUD() {
      const myPlayerId = this.network.myPlayerId;
      const playerFaction = this.engine.factions.get(myPlayerId);
      if (!playerFaction) return;

      if (this.elNationName) {
        this.elNationName.textContent = playerFaction.name;
        this.elNationName.style.color = playerFaction.border;
      }

      const stage = CONFIG.STAGES[playerFaction.stageTier];
      if (this.elStageBadge && stage) this.elStageBadge.textContent = `[T${stage.tier}] ${stage.name}`;

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

      if (this.elFood) this.elFood.textContent = playerFaction.food;
      if (this.elWood) this.elWood.textContent = playerFaction.wood;
      if (this.elStone) this.elStone.textContent = playerFaction.stone;
      if (this.elGold) this.elGold.textContent = playerFaction.gold;
      if (this.elTroops) this.elTroops.textContent = playerFaction.troops;
      if (this.elTerritory) this.elTerritory.textContent = `${playerFaction.territoryCount} pts`;

      if (this.elTroopCountPreview) {
        const count = Math.max(3, Math.floor(playerFaction.troops * (this.selectedTroopPercent / 100)));
        this.elTroopCountPreview.textContent = `(${count} troupes)`;
      }

      if (this.elDayDisplay) this.elDayDisplay.textContent = `JOUR ${this.engine.dayCount}`;
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
        return hex ? `</span><span style="color: ${hex}">` : "</span>";
      });
      return `<span>${safe}</span>`;
    }
  }

  // ==================== 9. APPLICATION & ORCHESTRATION ====================
  class GameApp {
    constructor() {
      this.map = null;
      this.engine = null;
      this.renderer = null;
      this.ai = null;
      this.network = null;
      this.ui = null;
      this.isPlayingSession = false;

      this.network = new NetworkManager({ factions: new Map(), addLog: () => {} });
      this.initWorldAndLobby();
    }

    initWorldAndLobby() {
      this.map = new WorldMap();
      this.map.generate(Date.now());

      this.engine = new GameEngine(this.map);
      this.network.engine = this.engine;

      const canvas = document.getElementById("world-canvas");
      this.renderer = new MapRenderer(canvas, this.map, this.engine);

      this.ai = new AIController(this.engine, this.map);
      this.ui = new UIManager(this.engine, this.renderer, this.network);

      const gameContainer = document.getElementById("game-container");
      if (gameContainer) gameContainer.classList.add("in-lobby");

      this.initLobbyEvents();
      requestAnimationFrame(() => this.gameLoop());
    }

    initLobbyEvents() {
      const btnSolo = document.getElementById("btn-start-solo");
      const btnHost = document.getElementById("btn-create-room");
      const btnJoin = document.getElementById("btn-join-room");
      const inputRoom = document.getElementById("input-room-code");
      const p2pStatus = document.getElementById("p2p-status-msg");

      if (btnSolo) {
        btnSolo.addEventListener("click", () => {
          SOUND.playClick();
          this.startSession();
        });
      }

      if (btnHost) {
        btnHost.addEventListener("click", () => {
          SOUND.playClick();
          if (p2pStatus) p2pStatus.textContent = "Création du salon P2P...";
          this.network.createRoom(
            (roomId) => {
              if (p2pStatus) {
                p2pStatus.innerHTML = `Salon hébergé ! Code : <strong style="color:#15803d">${roomId}</strong> (partagez ce code)`;
              }
              setTimeout(() => this.startSession(), 1200);
            },
            (err) => {
              if (p2pStatus) p2pStatus.textContent = `Erreur : ${err}`;
            }
          );
        });
      }

      if (btnJoin) {
        btnJoin.addEventListener("click", () => {
          SOUND.playClick();
          const code = inputRoom ? inputRoom.value.trim() : "";
          if (!code) {
            if (p2pStatus) p2pStatus.textContent = "Veuillez entrer un code de salon valide.";
            return;
          }

          if (p2pStatus) p2pStatus.textContent = "Connexion au salon...";
          this.network.joinRoom(
            code,
            () => {
              if (p2pStatus) p2pStatus.textContent = "Connecté avec succès !";
              setTimeout(() => this.startSession(), 1000);
            },
            (err) => {
              if (p2pStatus) p2pStatus.textContent = `Échec de connexion : ${err}`;
            }
          );
        });
      }
    }

    startSession() {
      const lobbyOverlay = document.getElementById("lobby-overlay");
      const gameContainer = document.getElementById("game-container");

      if (lobbyOverlay) {
        lobbyOverlay.classList.add("hidden");
        setTimeout(() => { lobbyOverlay.style.display = "none"; }, 500);
      }
      if (gameContainer) gameContainer.classList.remove("in-lobby");

      this.isPlayingSession = true;
      this.renderer.centerCameraOnPlayerCapital();
      this.engine.addLog("§aPartie lancée ! Conquérez les terres sauvages et repoussez les Maraudeurs !");
    }

    gameLoop() {
      if (this.isPlayingSession) {
        this.engine.update();
        this.ai.update();
        this.ui.updateHUD();
      } else {
        // En mode lobby : dérive cinématique douce de la caméra pour animer la carte en arrière-plan
        this.renderer.offsetX -= 0.25;
      }

      this.renderer.render();
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  // Initialisation immédiate ou sur DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.app = new GameApp();
    });
  } else {
    window.app = new GameApp();
  }
})();

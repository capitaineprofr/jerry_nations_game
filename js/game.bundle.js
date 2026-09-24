/**
 * Jerry's Nations: Frontline Realms - Standalone RTS Game Bundle
 * Concaténation autonome 100% compatible file:/// (sans restriction CORS de modules ES6).
 * Modèle RTS : Bataillons physiques, tirs balistiques, sélection directe (Marquee Box & Clic),
 * recrutement, expéditions stratégiques, banquet du crépuscule (jn_food) et Scoreboard Mood.
 */

(function () {
  "use strict";

  // ==================== 1. CONFIGURATION & CONSTANTES ====================
  const CONFIG = {
    VERSION: "2.0.0",
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

    UNITS: {
      PIONEER: {
        id: "pioneer",
        name: "Pionnier",
        desc: "Fonde des avant-postes et bâtit les infrastructures",
        foodCost: 30,
        woodCost: 20,
        stoneCost: 0,
        goldCost: 0,
        hp: 70,
        speed: 0.08,
        attack: 0,
        range: 1.0,
        defense: 1,
        canBuild: true,
        canClaim: true,
        icon: "hammer"
      },
      MILITIA: {
        id: "militia",
        name: "Milicien",
        desc: "Infanterie d'épée robuste pour tenir les lignes",
        foodCost: 25,
        woodCost: 0,
        stoneCost: 15,
        goldCost: 0,
        hp: 140,
        speed: 0.07,
        attack: 16,
        range: 1.1,
        defense: 3,
        icon: "sword"
      },
      ARCHER: {
        id: "archer",
        name: "Archer",
        desc: "Tirs de flèches à distance percutants",
        foodCost: 30,
        woodCost: 30,
        stoneCost: 0,
        goldCost: 0,
        hp: 85,
        speed: 0.075,
        attack: 18,
        range: 4.8,
        defense: 1,
        isRanged: true,
        icon: "bow"
      },
      CAVALRY: {
        id: "cavalry",
        name: "Cavalier",
        desc: "Cavalerie très rapide pour charger et harceler",
        foodCost: 50,
        woodCost: 10,
        stoneCost: 0,
        goldCost: 40,
        hp: 180,
        speed: 0.125,
        attack: 26,
        range: 1.2,
        defense: 4,
        chargeBonus: 1.5,
        icon: "horse"
      },
      SIEGE: {
        id: "siege",
        name: "Trébuchet",
        desc: "Engin lourd pour démolir les bastions ennemis",
        foodCost: 0,
        woodCost: 80,
        stoneCost: 60,
        goldCost: 50,
        hp: 220,
        speed: 0.045,
        attack: 55,
        range: 6.2,
        defense: 2,
        isRanged: true,
        vsBuildingMultiplier: 3.5,
        icon: "trebuchet"
      }
    },

    FACTIONS: [
      { id: 1, name: "Empire d'Émeraude", color: "#249278", border: "#55FF55", textCode: "§a", isPlayer: true, isAI: false },
      { id: 2, name: "Clan Maraudeur", color: "#8a2424", border: "#FF5555", textCode: "§c", isPlayer: false, isAI: true, personality: "aggressive" },
      { id: 3, name: "Ordre Solaire", color: "#b8860b", border: "#FFFF55", textCode: "§e", isPlayer: false, isAI: true, personality: "expansionist" },
      { id: 4, name: "Confédération Royale", color: "#2255aa", border: "#55FFFF", textCode: "§b", isPlayer: false, isAI: true, personality: "defensive" },
      { id: 5, name: "Guilde d'Améthyste", color: "#6a2d9c", border: "#FF55FF", textCode: "§d", isPlayer: false, isAI: true, personality: "balanced" }
    ],

    INFRASTRUCTURES: {
      FARM: { id: "farm", name: "Ferme Coloniale", woodCost: 40, stoneCost: 10, foodBonus: 3.5, hp: 150, icon: "farm" },
      BARRACKS: { id: "barracks", name: "Caserne d'Armes", woodCost: 60, stoneCost: 35, goldCost: 20, hp: 250, icon: "barracks", desc: "Centre d'entraînement militaire" },
      OUTPOST: { id: "outpost", name: "Avant-poste", woodCost: 50, stoneCost: 30, goldCost: 15, territoryRadius: 3, defenseBonus: 0.35, hp: 300, icon: "flag", desc: "Revendique et stabilise les terres" },
      LUMBER_CAMP: { id: "lumber_camp", name: "Scierie", woodCost: 30, stoneCost: 10, woodBonus: 2.2, hp: 120, icon: "axe" },
      QUARRY: { id: "quarry", name: "Carrière de Pierre", woodCost: 40, stoneCost: 20, stoneBonus: 1.8, hp: 140, icon: "pickaxe" },
      PALISADE: { id: "palisade", name: "Palissade Frontalière", woodCost: 25, stoneCost: 10, defenseBonus: 0.45, hp: 180, icon: "shield" },
      WATCHTOWER: { id: "watchtower", name: "Tour de Guet", woodCost: 60, stoneCost: 50, defenseBonus: 0.80, range: 4.5, attackDamage: 12, hp: 220, icon: "tower" },
      CITADEL: { id: "citadel", name: "Bastion de Forteresse", woodCost: 150, stoneCost: 200, goldCost: 100, defenseBonus: 1.50, range: 6.0, attackDamage: 25, hp: 600, icon: "fortress" }
    },

    MC_COLORS: {
      "§0": "#000000",
      "§1": "#1e3a8a",
      "§2": "#15803d",
      "§3": "#0284c7",
      "§4": "#991b1b",
      "§5": "#7e22ce",
      "§6": "#b45309",
      "§7": "#57534e",
      "§8": "#292524",
      "§9": "#1d4ed8",
      "§a": "#15803d",
      "§b": "#0369a1",
      "§c": "#b91c1c",
      "§d": "#a21caf",
      "§e": "#854d0e",
      "§f": "#1c1917"
    }
  };

  // ==================== 2. MOTEUR AUDIO PROCÉDURAL ====================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.masterGain = null;
      this.initAudioContext();
    }

    initAudioContext() {
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
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
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
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.3);
    }

    playRaidAlert() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(240, now + 0.15);
      osc.frequency.setValueAtTime(180, now + 0.30);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
    }

    playLevelUp() {
      if (this.muted) return;
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.1;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 0.32);
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
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  const SOUND = new SoundEngine();

  // ==================== 3. GÉNÉRATEUR DE MONDE & CARTE ====================
  class WorldMap {
    constructor(width = CONFIG.MAP_WIDTH, height = CONFIG.MAP_HEIGHT) {
      this.width = width;
      this.height = height;
      this.grid = new Array(width * height);
      this.capitals = [];
    }

    createPrng(seed) {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return function () {
        return (s = (s * 16807) % 2147483647) / 2147483647;
      };
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
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);

          let h = Math.sin(nx + prng() * 0.1) * 0.4 + Math.cos(ny + prng() * 0.1) * 0.4;
          h += Math.sin(nx * 2) * 0.2 + Math.cos(ny * 2) * 0.2;
          h += Math.sin(nx * 4) * 0.1 + Math.cos(ny * 4) * 0.1;
          h = (h + 1) * 0.5 - distFromCenter * 0.45;

          let m = Math.sin(nx * 1.5 + 1.2) * 0.5 + Math.cos(ny * 1.5 + 0.8) * 0.5;
          m = (m + 1) * 0.5;

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
          if (h < 0.22) {
            terrain = CONFIG.TERRAIN.DEEP_WATER;
          } else if (h < 0.32) {
            terrain = CONFIG.TERRAIN.SHALLOW_WATER;
          } else if (h > 0.78) {
            terrain = CONFIG.TERRAIN.MOUNTAIN;
          } else if (h > 0.62) {
            terrain = CONFIG.TERRAIN.HILLS;
          } else if (m > 0.55) {
            terrain = CONFIG.TERRAIN.FOREST;
          } else {
            terrain = CONFIG.TERRAIN.PLAIN;
          }

          this.grid[idx] = {
            x,
            y,
            terrain,
            owner: 0,
            troops: terrain.traversable ? Math.floor(prng() * 4) + 1 : 0,
            infrastructure: null,
            infraHp: null,
            isCapital: false,
            capitalFactionId: null
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
          if (cell && cell.terrain === CONFIG.TERRAIN.PLAIN) {
            candidates.push(cell);
          }
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
        chosen.infrastructure = "citadel";
        chosen.infraHp = 600;

        // Territoire initial 3x3
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighbor = this.getCell(chosen.x + dx, chosen.y + dy);
            if (neighbor && neighbor.terrain.traversable) {
              neighbor.owner = faction.id;
            }
          }
        }

        this.capitals.push({ factionId: faction.id, x: chosen.x, y: chosen.y });
      });
    }

    getCell(x, y) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
      return this.grid[y * this.width + x];
    }

    getNeighbors(x, y) {
      const neighbors = [];
      const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const cell = this.getCell(x + dx, y + dy);
        if (cell) neighbors.push(cell);
      }
      return neighbors;
    }

    countFactionTerritory(factionId) {
      let count = 0;
      for (let i = 0; i < this.grid.length; i++) {
        if (this.grid[i].owner === factionId) count++;
      }
      return count;
    }

    isBorderCell(x, y, factionId) {
      const neighbors = this.getNeighbors(x, y);
      for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i].owner !== factionId) return true;
      }
      return false;
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
  }

  // ==================== 4. UNITÉS & PROJECTILES RTS ====================
  class Projectile {
    constructor(attackerId, fromX, fromY, targetX, targetY, damage, targetUnit = null, isSiege = false) {
      this.id = Math.random().toString(36).substring(2, 9);
      this.attackerId = attackerId;
      this.fromX = fromX;
      this.fromY = fromY;
      this.currentX = fromX;
      this.currentY = fromY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.damage = damage;
      this.targetUnit = targetUnit;
      this.isSiege = isSiege;

      this.progress = 0;
      this.distTotal = Math.hypot(targetX - fromX, targetY - fromY) || 1;
      this.speed = isSiege ? 0.16 : 0.32;
    }

    update(engine) {
      if (this.targetUnit && this.targetUnit.hp > 0) {
        this.targetX = this.targetUnit.x;
        this.targetY = this.targetUnit.y;
        this.distTotal = Math.hypot(this.targetX - this.fromX, this.targetY - this.fromY) || 1;
      }

      this.progress += this.speed / this.distTotal;
      this.currentX = this.fromX + (this.targetX - this.fromX) * Math.min(1, this.progress);
      this.currentY = this.fromY + (this.targetY - this.fromY) * Math.min(1, this.progress);

      if (this.progress >= 1.0) {
        this.hit(engine);
        return false;
      }
      return true;
    }

    hit(engine) {
      if (this.targetUnit && this.targetUnit.hp > 0) {
        this.targetUnit.takeDamage(this.damage, this.attackerId, engine);
      } else {
        const targetCell = engine.map.getCell(Math.round(this.targetX), Math.round(this.targetY));
        if (targetCell && targetCell.infrastructure && targetCell.owner !== this.attackerId) {
          const mult = this.isSiege ? 3.5 : 1.0;
          engine.damageInfrastructure(targetCell, this.damage * mult, this.attackerId);
        }
      }

      engine.combatEvents.push({
        x: this.targetX,
        y: this.targetY,
        life: 14,
        attackerId: this.attackerId,
        type: this.isSiege ? "explosion" : "spark"
      });
    }
  }

  class Unit {
    constructor(factionId, typeKey, x, y, id = null) {
      const proto = CONFIG.UNITS[typeKey.toUpperCase()] || CONFIG.UNITS.MILITIA;

      this.id = id || Math.random().toString(36).substring(2, 9);
      this.factionId = factionId;
      this.type = proto.id;
      this.name = proto.name;
      this.icon = proto.icon;

      this.x = x;
      this.y = y;
      this.targetX = null;
      this.targetY = null;
      this.targetUnit = null;

      this.hp = proto.hp;
      this.maxHp = proto.hp;
      this.speed = proto.speed;
      this.attack = proto.attack;
      this.range = proto.range;
      this.defense = proto.defense || 0;
      this.isRanged = !!proto.isRanged;
      this.canBuild = !!proto.canBuild;
      this.canClaim = !!proto.canClaim;
      this.chargeBonus = proto.chargeBonus || 1.0;
      this.hasCharged = false;

      this.state = "idle";
      this.attackCooldown = 0;
      this.isSelected = false;

      this.offsetX = (Math.random() - 0.5) * 0.35;
      this.offsetY = (Math.random() - 0.5) * 0.35;
    }

    moveTo(cellX, cellY) {
      this.targetX = cellX + 0.5;
      this.targetY = cellY + 0.5;
      this.targetUnit = null;
      this.state = "moving";
      this.hasCharged = false;
    }

    attackTarget(targetUnit) {
      if (!targetUnit || targetUnit.hp <= 0 || targetUnit.factionId === this.factionId) return;
      this.targetUnit = targetUnit;
      this.targetX = targetUnit.x;
      this.targetY = targetUnit.y;
      this.state = "attacking";
    }

    update(engine) {
      if (this.hp <= 0) return false;
      if (this.attackCooldown > 0) this.attackCooldown--;

      const faction = engine.factions.get(this.factionId);
      const moodBuff = faction ? engine.getMoodState(faction.moodScore).speedBuff : 1.0;
      const combatBuff = faction ? engine.getMoodState(faction.moodScore).combatBuff : 1.0;

      // 1. Attaque d'unité ciblée
      if (this.targetUnit) {
        if (this.targetUnit.hp <= 0) {
          this.targetUnit = null;
          this.state = "idle";
        } else {
          const dist = Math.hypot(this.targetUnit.x - this.x, this.targetUnit.y - this.y);
          if (dist <= this.range) {
            this.performAttack(this.targetUnit, engine, combatBuff);
            return true;
          } else {
            this.stepTowards(this.targetUnit.x, this.targetUnit.y, this.speed * moodBuff, engine);
            return true;
          }
        }
      }

      // 2. Déplacement vers waypoint
      if (this.targetX !== null && this.targetY !== null) {
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (dist < 0.25) {
          this.x = this.targetX;
          this.y = this.targetY;
          this.targetX = null;
          this.targetY = null;
          this.state = "idle";
          this.onReachedDestination(engine);
        } else {
          this.stepTowards(this.targetX, this.targetY, this.speed * moodBuff, engine);
        }
        return true;
      }

      // 3. Scan passif des ennemis proches
      if (this.state === "idle" && this.attack > 0) {
        this.scanForNearbyEnemies(engine);
      }

      // 4. Capture passive du territoire
      if (this.state === "idle") {
        this.claimCurrentCell(engine);
      }

      return true;
    }

    stepTowards(tx, ty, moveSpeed, engine) {
      const angle = Math.atan2(ty - this.y, tx - this.x);
      const nextX = this.x + Math.cos(angle) * moveSpeed;
      const nextY = this.y + Math.sin(angle) * moveSpeed;

      const cell = engine.map.getCell(Math.floor(nextX), Math.floor(nextY));
      if (cell && cell.terrain.traversable) {
        this.x = nextX;
        this.y = nextY;
      } else {
        this.x += Math.cos(angle + Math.PI / 4) * (moveSpeed * 0.5);
        this.y += Math.sin(angle + Math.PI / 4) * (moveSpeed * 0.5);
      }
    }

    performAttack(target, engine, combatBuff) {
      if (this.attackCooldown > 0) return;
      this.attackCooldown = this.isRanged ? 24 : 16;

      let dmg = this.attack * combatBuff;
      if (this.chargeBonus > 1.0 && !this.hasCharged) {
        dmg *= this.chargeBonus;
        this.hasCharged = true;
      }

      if (this.isRanged) {
        const isSiege = this.type === "siege";
        const proj = new Projectile(this.factionId, this.x, this.y, target.x, target.y, dmg, target, isSiege);
        engine.projectiles.push(proj);
        if (this.factionId === 1 || target.factionId === 1) SOUND.playCharge();
      } else {
        target.takeDamage(dmg, this.factionId, engine);
        if (this.factionId === 1 || target.factionId === 1) SOUND.playClash();
      }
    }

    takeDamage(amount, attackerId, engine) {
      const netDamage = Math.max(2, Math.floor(amount - this.defense));
      this.hp -= netDamage;

      engine.combatEvents.push({
        x: this.x,
        y: this.y,
        life: 12,
        attackerId,
        type: "slash"
      });

      if (!this.targetUnit && this.attack > 0) {
        const attackerUnit = engine.units.find((u) => u.id === attackerId || (u.factionId === attackerId && Math.hypot(u.x - this.x, u.y - this.y) <= this.range * 1.5));
        if (attackerUnit) this.attackTarget(attackerUnit);
      }

      if (this.hp <= 0) {
        this.hp = 0;
        this.onDeath(attackerId, engine);
      }
    }

    onDeath(killerFactionId, engine) {
      const killer = engine.factions.get(killerFactionId);
      const victim = engine.factions.get(this.factionId);

      if (killer) {
        killer.totalKills++;
        killer.moodScore = Math.min(1000, killer.moodScore + 4);
      }
      if (victim) {
        victim.totalLosses++;
        victim.moodScore = Math.max(-1000, victim.moodScore - 6);
        if (victim.isPlayer) {
          engine.addLog(`§cUn bataillon de ${this.name} est tombé au combat !`);
        }
      }
    }

    scanForNearbyEnemies(engine) {
      const aggroRadius = this.isRanged ? this.range + 1.5 : 4.0;
      let closestEnemy = null;
      let minDist = aggroRadius;

      for (let i = 0; i < engine.units.length; i++) {
        const other = engine.units[i];
        if (other.factionId !== this.factionId && other.hp > 0) {
          const d = Math.hypot(other.x - this.x, other.y - this.y);
          if (d < minDist) {
            minDist = d;
            closestEnemy = other;
          }
        }
      }

      if (closestEnemy) {
        this.attackTarget(closestEnemy);
      }
    }

    claimCurrentCell(engine) {
      const cx = Math.floor(this.x);
      const cy = Math.floor(this.y);
      const cell = engine.map.getCell(cx, cy);

      if (cell && cell.terrain.traversable && cell.owner !== this.factionId) {
        if (!cell.infrastructure || cell.infrastructure === "farm") {
          cell.owner = this.factionId;
          engine.updateTerritoryCounts();
        }
      }
    }

    onReachedDestination(engine) {
      const cx = Math.floor(this.x);
      const cy = Math.floor(this.y);
      const cell = engine.map.getCell(cx, cy);

      if (cell && cell.terrain.traversable && cell.owner !== this.factionId && !cell.infrastructure) {
        cell.owner = this.factionId;
        engine.updateTerritoryCounts();
      }
    }
  }

  // ==================== 5. MOTEUR DE SIMULATION RTS ====================
  class GameEngine {
    constructor(worldMap) {
      this.map = worldMap;
      this.tickCount = 0;
      this.dayTimeSec = 0;
      this.dayCount = 1;
      this.timeScale = 1;
      this.isPaused = false;

      this.factions = new Map();
      this.units = [];
      this.projectiles = [];
      this.combatEvents = [];
      this.logMessages = [];

      this.initFactions();
      this.spawnInitialArmies();
    }

    initFactions() {
      CONFIG.FACTIONS.forEach((fac) => {
        this.factions.set(fac.id, {
          ...fac,
          territoryCount: 0,
          population: 30,
          food: 120,
          wood: 80,
          stone: 60,
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

    spawnInitialArmies() {
      this.map.capitals.forEach((cap) => {
        const fid = cap.factionId;
        this.spawnUnit(fid, "pioneer", cap.x + 0.5, cap.y + 1.2);
        this.spawnUnit(fid, "militia", cap.x - 0.8, cap.y + 0.2);
        this.spawnUnit(fid, "militia", cap.x + 0.8, cap.y + 0.2);
        this.spawnUnit(fid, "militia", cap.x, cap.y - 0.8);
        this.spawnUnit(fid, "archer", cap.x - 1.2, cap.y - 0.8);
        this.spawnUnit(fid, "archer", cap.x + 1.2, cap.y - 0.8);
      });
    }

    spawnUnit(factionId, typeKey, x, y) {
      const unit = new Unit(factionId, typeKey, x, y);
      this.units.push(unit);
      return unit;
    }

    recruitUnit(factionId, typeKey) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;

      const proto = CONFIG.UNITS[typeKey.toUpperCase()];
      if (!proto) return false;

      if (
        faction.food < proto.foodCost ||
        faction.wood < proto.woodCost ||
        faction.stone < proto.stoneCost ||
        faction.gold < proto.goldCost
      ) {
        if (factionId === 1) {
          this.addLog(`§cRessources insuffisantes pour recruter un ${proto.name} !`);
        }
        return false;
      }

      let spawnX = null;
      let spawnY = null;

      for (let i = 0; i < this.map.grid.length; i++) {
        const cell = this.map.grid[i];
        if (cell.owner === factionId && (cell.infrastructure === "barracks" || cell.isCapital)) {
          spawnX = cell.x + 0.5 + (Math.random() - 0.5) * 0.8;
          spawnY = cell.y + 0.5 + (Math.random() - 0.5) * 0.8;
          break;
        }
      }

      if (spawnX === null) {
        const cap = this.map.capitals.find((c) => c.factionId === factionId);
        if (cap) {
          spawnX = cap.x + 0.5;
          spawnY = cap.y + 0.5;
        } else {
          return false;
        }
      }

      faction.food -= proto.foodCost;
      faction.wood -= proto.woodCost;
      faction.stone -= proto.stoneCost;
      faction.gold -= proto.goldCost;

      const newUnit = this.spawnUnit(factionId, typeKey, spawnX, spawnY);

      if (factionId === 1) {
        SOUND.playBuild();
        this.addLog(`§a[RECRUTEMENT] Bataillon de ${proto.name} mobilisé avec succès !`);
      }

      return newUnit;
    }

    updateTerritoryCounts() {
      this.factions.forEach((f) => {
        f.territoryCount = this.map.countFactionTerritory(f.id);
        if (f.territoryCount === 0 && !f.isDefeated) {
          f.isDefeated = true;
          this.addLog(`§cLa nation ${f.name} a été totalement anéantie !`);
        }
      });
    }

    update() {
      if (this.isPaused || this.timeScale === 0) return;

      const iterations = this.timeScale;
      for (let it = 0; it < iterations; it++) {
        this.tickCount++;
        this.dayTimeSec += 1 / CONFIG.TICK_RATE;

        this.updateUnits();
        this.updateProjectiles();

        if (this.tickCount % 15 === 0) {
          this.updateTowerDefenses();
        }

        this.updateCombatEvents();

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

    updateUnits() {
      for (let i = this.units.length - 1; i >= 0; i--) {
        const unit = this.units[i];
        const alive = unit.update(this);
        if (!alive || unit.hp <= 0) {
          this.units.splice(i, 1);
        }
      }
    }

    updateProjectiles() {
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const active = this.projectiles[i].update(this);
        if (!active) {
          this.projectiles.splice(i, 1);
        }
      }
    }

    updateCombatEvents() {
      for (let i = this.combatEvents.length - 1; i >= 0; i--) {
        this.combatEvents[i].life--;
        if (this.combatEvents[i].life <= 0) {
          this.combatEvents.splice(i, 1);
        }
      }
    }

    updateTowerDefenses() {
      for (let i = 0; i < this.map.grid.length; i++) {
        const cell = this.map.grid[i];
        if (!cell.infrastructure || cell.owner === 0) continue;

        const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
        if (!infra || !infra.range) continue;

        const range = infra.range;
        let targetUnit = null;
        let minDist = range;

        for (let u = 0; u < this.units.length; u++) {
          const unit = this.units[u];
          if (unit.factionId !== cell.owner && unit.hp > 0) {
            const d = Math.hypot(unit.x - (cell.x + 0.5), unit.y - (cell.y + 0.5));
            if (d <= minDist) {
              minDist = d;
              targetUnit = unit;
            }
          }
        }

        if (targetUnit) {
          const isCitadel = cell.infrastructure === "citadel";
          const dmg = infra.attackDamage || 12;
          const proj = new Projectile(cell.owner, cell.x + 0.5, cell.y + 0.5, targetUnit.x, targetUnit.y, dmg, targetUnit, isCitadel);
          this.projectiles.push(proj);
        }
      }
    }

    damageInfrastructure(cell, damage, attackerFactionId) {
      if (!cell.infrastructure) return;

      if (!cell.infraHp) {
        const proto = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
        cell.infraHp = proto ? proto.hp : 200;
      }

      cell.infraHp -= damage;

      if (cell.infraHp <= 0) {
        const infraName = cell.infrastructure;
        cell.infrastructure = null;
        cell.infraHp = null;

        const attacker = this.factions.get(attackerFactionId);
        const owner = this.factions.get(cell.owner);

        if (cell.isCapital && owner) {
          this.addLog(`§c§l[CAPITALE TOMBÉE] La citadelle de ${owner.name} a été rasée par ${attacker ? attacker.name : "l'ennemi"} !`);
          SOUND.playRaidAlert();
          cell.isCapital = false;
          cell.owner = attackerFactionId;
          if (owner) owner.moodScore = Math.max(-1000, owner.moodScore - 500);
          if (attacker) attacker.moodScore = Math.min(1000, attacker.moodScore + 250);
        } else {
          this.addLog(`§6Un bâtiment (${infraName}) a été détruit.`);
        }

        this.updateTerritoryCounts();
      }
    }

    executeSunsetBanquet() {
      SOUND.playSunsetBell();
      this.addLog(`§6[Crépuscule - Jour ${this.dayCount}] Le banquet de la nation commence...`);

      this.factions.forEach((f) => {
        if (f.isDefeated) return;

        const factionUnits = this.units.filter((u) => u.factionId === f.id);
        const foodRequired = Math.ceil(factionUnits.length * 2.5) + Math.ceil(f.territoryCount * 0.05);

        if (f.food >= foodRequired) {
          f.food -= foodRequired;
          f.moodScore = Math.min(1000, f.moodScore + 40);
          if (f.isPlayer) {
            this.addLog(`§aBanquet réussi : ${foodRequired} rations consommées. Les troupes sont prêtes au combat.`);
          }
        } else {
          const shortfall = foodRequired - f.food;
          f.food = 0;
          const moodPenalty = Math.min(400, 120 + shortfall * 15);
          f.moodScore = Math.max(-1000, f.moodScore - moodPenalty);

          const desertedCount = Math.max(1, Math.floor(factionUnits.length * 0.25));
          for (let i = 0; i < desertedCount && factionUnits.length > 0; i++) {
            const deserted = factionUnits.pop();
            const uIdx = this.units.indexOf(deserted);
            if (uIdx !== -1) this.units.splice(uIdx, 1);
          }

          if (f.isPlayer) {
            this.addLog(`§c[FAMINE NATIONALE] Rupture de nourriture ! -${moodPenalty} Mood, ${desertedCount} bataillon(s) ont déserté !`);
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

        let foodProd = f.territoryCount * 0.08;
        let woodProd = 0.4;
        let stoneProd = 0.3;
        let goldProd = f.territoryCount * 0.10;

        for (let i = 0; i < this.map.grid.length; i++) {
          const cell = this.map.grid[i];
          if (cell.owner === f.id && cell.infrastructure) {
            const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
            if (infra) {
              if (infra.foodBonus) foodProd += infra.foodBonus;
              if (infra.woodBonus) woodProd += infra.woodBonus;
              if (infra.stoneBonus) stoneProd += infra.stoneBonus;
            }
          }
        }

        f.food = Math.floor(f.food + foodProd * moodBuff);
        f.wood = Math.floor(f.wood + woodProd * moodBuff);
        f.stone = Math.floor(f.stone + stoneProd * moodBuff);
        f.gold = Math.floor(f.gold + goldProd * moodBuff);
      });
    }

    buildInfrastructure(factionId, x, y, infraType) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;

      const cell = this.map.getCell(x, y);
      if (!cell || !cell.terrain.traversable) return false;

      const infra = CONFIG.INFRASTRUCTURES[infraType.toUpperCase()];
      if (!infra) return false;

      if (infra.id === "outpost") {
        if (cell.owner !== 0 && cell.owner !== factionId) return false;
      } else {
        if (cell.owner !== factionId) return false;
      }

      if (cell.infrastructure) return false;

      const woodCost = infra.woodCost || 0;
      const stoneCost = infra.stoneCost || 0;
      const goldCost = infra.goldCost || 0;

      if (faction.wood < woodCost || faction.stone < stoneCost || faction.gold < goldCost) {
        if (factionId === 1) {
          this.addLog(`§cRessources insuffisantes pour bâtir ${infra.name} !`);
        }
        return false;
      }

      faction.wood -= woodCost;
      faction.stone -= stoneCost;
      faction.gold -= goldCost;

      cell.infrastructure = infra.id;
      cell.infraHp = infra.hp || 200;
      cell.owner = factionId;

      if (infra.territoryRadius) {
        const r = infra.territoryRadius;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.hypot(dx, dy) <= r) {
              const neighbor = this.map.getCell(x + dx, y + dy);
              if (neighbor && neighbor.terrain.traversable && (neighbor.owner === 0 || neighbor.owner === factionId)) {
                neighbor.owner = factionId;
              }
            }
          }
        }
      }

      this.updateTerritoryCounts();

      if (factionId === 1) {
        SOUND.playBuild();
        this.addLog(`§2${infra.name} érigé en (${x}, ${y}).`);
      }

      return true;
    }

    launchColonizationExpedition(factionId) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;

      let bestCell = null;
      let bestScore = -9999;

      for (let i = 0; i < this.map.grid.length; i++) {
        const cell = this.map.grid[i];
        if (cell.owner === 0 && cell.terrain === CONFIG.TERRAIN.PLAIN) {
          const distToOwned = this.getMinDistanceToFaction(cell.x, cell.y, factionId);
          if (distToOwned >= 2 && distToOwned <= 8) {
            const score = 100 - distToOwned * 10;
            if (score > bestScore) {
              bestScore = score;
              bestCell = cell;
            }
          }
        }
      }

      if (!bestCell) {
        if (factionId === 1) this.addLog("§cAucun secteur propice à la colonisation n'a été détecté.");
        return false;
      }

      let pioneer = this.units.find((u) => u.factionId === factionId && u.type === "pioneer" && u.state === "idle");
      if (!pioneer) {
        pioneer = this.recruitUnit(factionId, "pioneer");
      }

      if (!pioneer) return false;

      pioneer.moveTo(bestCell.x, bestCell.y);

      const escorts = this.units.filter((u) => u.factionId === factionId && u.type === "militia" && u.state === "idle").slice(0, 2);
      escorts.forEach((esc, idx) => {
        esc.moveTo(bestCell.x + (idx === 0 ? -1 : 1), bestCell.y);
      });

      if (factionId === 1) {
        SOUND.playCharge();
        this.addLog(`§a[EXPÉDITION] Colonisation en route vers le secteur (${bestCell.x}, ${bestCell.y}) !`);
      }

      return true;
    }

    rallyDefense(factionId) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;

      let threatenedX = null;
      let threatenedY = null;

      for (let i = 0; i < this.units.length; i++) {
        const u = this.units[i];
        if (u.factionId !== factionId && u.hp > 0) {
          const cell = this.map.getCell(Math.floor(u.x), Math.floor(u.y));
          if (cell && cell.owner === factionId) {
            threatenedX = u.x;
            threatenedY = u.y;
            break;
          }
        }
      }

      if (threatenedX === null) {
        const cap = this.map.capitals.find((c) => c.factionId === factionId);
        if (cap) {
          threatenedX = cap.x;
          threatenedY = cap.y;
        }
      }

      if (threatenedX === null) return false;

      const defenders = this.units.filter((u) => u.factionId === factionId && u.attack > 0);
      defenders.forEach((u, idx) => {
        const ox = (idx % 3 - 1) * 1.0;
        const oy = Math.floor(idx / 3) * 1.0;
        u.moveTo(threatenedX + ox, threatenedY + oy);
      });

      if (factionId === 1) {
        SOUND.playCharge();
        this.addLog(`§6[ORDRE GÉNÉRAL] Toutes les forces sont rappelées au front défensif !`);
      }

      return true;
    }

    launchCoordinatedAssault(factionId, targetFactionId = null) {
      const faction = this.factions.get(factionId);
      if (!faction || faction.isDefeated) return false;

      let targetX = null;
      let targetY = null;

      const enemyCapitals = this.map.capitals.filter((c) => c.factionId !== factionId && (!targetFactionId || c.factionId === targetFactionId));
      if (enemyCapitals.length > 0) {
        const cap = enemyCapitals[0];
        targetX = cap.x;
        targetY = cap.y;
      }

      if (targetX === null) return false;

      const strikeForce = this.units.filter((u) => u.factionId === factionId && u.attack > 0);
      if (strikeForce.length === 0) {
        if (factionId === 1) this.addLog("§cAucun bataillon militaire disponible pour un assaut coordonné !");
        return false;
      }

      strikeForce.forEach((u, idx) => {
        const ox = (idx % 4 - 1.5) * 1.2;
        const oy = Math.floor(idx / 4) * 1.2;
        u.moveTo(targetX + ox, targetY + oy);
      });

      if (factionId === 1) {
        SOUND.playCharge();
        this.addLog(`§c§l[OFFENSIVE ROYALE] Assaut coordonné de ${strikeForce.length} bataillon(s) lancé !`);
      }

      return true;
    }

    getMinDistanceToFaction(x, y, factionId) {
      let minDist = 999;
      for (let dy = -8; dy <= 8; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          const c = this.map.getCell(x + dx, y + dy);
          if (c && c.owner === factionId) {
            const d = Math.hypot(dx, dy);
            if (d < minDist) minDist = d;
          }
        }
      }
      return minDist;
    }

    checkStageAdvancements() {
      this.factions.forEach((f) => {
        if (f.isDefeated) return;

        const nextStage = CONFIG.STAGES[f.stageTier + 1];

        if (nextStage) {
          const canAdvance =
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

    getMoodState(score) {
      if (score >= CONFIG.MOOD.GOLDEN_AGE.min) return CONFIG.MOOD.GOLDEN_AGE;
      if (score >= CONFIG.MOOD.PROSPEROUS.min) return CONFIG.MOOD.PROSPEROUS;
      if (score >= CONFIG.MOOD.STABLE.min) return CONFIG.MOOD.STABLE;
      if (score >= CONFIG.MOOD.UNHAPPY.min) return CONFIG.MOOD.UNHAPPY;
      return CONFIG.MOOD.REVOLT;
    }

    addLog(msg) {
      this.logMessages.unshift({ text: msg, time: Date.now() });
      if (this.logMessages.length > 40) {
        this.logMessages.pop();
      }
    }
  }

  // ==================== 6. RENDU CANVAS 2D RTS ====================
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

      this.isBoxSelecting = false;
      this.boxStartX = 0;
      this.boxStartY = 0;
      this.boxEndX = 0;
      this.boxEndY = 0;

      this.orderRipples = [];
      this.hoverCell = null;

      this.initCanvasSize();
      this.centerCameraOnPlayerCapital();
      this.setupEventListeners();
    }

    initCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.canvas.parentElement.clientWidth * dpr;
      this.canvas.height = this.canvas.parentElement.clientHeight * dpr;
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
        if (e.button === 1 || (e.button === 2 && e.shiftKey)) {
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

      window.addEventListener("mouseup", (e) => {
        if (this.isDragging) {
          this.isDragging = false;
        }
      });

      this.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        const newScale = Math.max(0.45, Math.min(3.5, this.scale * zoomFactor));

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

    worldToScreen(worldX, worldY) {
      const cellSize = CONFIG.CELL_SIZE * this.scale;
      return {
        x: this.offsetX + worldX * cellSize,
        y: this.offsetY + worldY * cellSize
      };
    }

    addOrderRipple(screenX, screenY, isAttack = false) {
      this.orderRipples.push({
        x: screenX,
        y: screenY,
        radius: 4,
        maxRadius: 22,
        isAttack,
        alpha: 1.0
      });
    }

    render() {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const cellSize = CONFIG.CELL_SIZE * this.scale;

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

          if (cell.owner > 0) {
            const faction = this.engine.factions.get(cell.owner);
            if (faction) {
              ctx.fillStyle = faction.color;
              ctx.globalAlpha = 0.50;
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
            this.drawCapitalIcon(ctx, px, py, cellSize, cell);
          } else if (cell.infrastructure) {
            this.drawInfraIcon(ctx, px, py, cellSize, cell);
          }
        }
      }

      this.renderUnits(ctx, cellSize);
      this.renderProjectiles(ctx, cellSize);
      this.renderCombatEvents(ctx, cellSize);

      if (this.hoverCell) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          this.hoverCell.x * cellSize,
          this.hoverCell.y * cellSize,
          cellSize,
          cellSize
        );
      }

      ctx.restore();

      if (this.isBoxSelecting) {
        this.drawSelectionBox(ctx);
      }

      this.renderOrderRipples(ctx);
      this.renderDayNightAtmosphere(ctx, width, height);
      this.renderMinimap(ctx, width, height);
    }

    renderUnits(ctx, cellSize) {
      const units = this.engine.units;

      for (let i = 0; i < units.length; i++) {
        const u = units[i];
        const px = (u.x + u.offsetX) * cellSize;
        const py = (u.y + u.offsetY) * cellSize;
        const radius = Math.max(5, 7 * this.scale);

        const faction = this.engine.factions.get(u.factionId);
        const factionColor = faction ? faction.color : "#999999";
        const factionBorder = faction ? faction.border : "#ffffff";

        if (u.isSelected) {
          ctx.strokeStyle = "#55FF55";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(px, py, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = factionColor;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = factionBorder;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.drawUnitInsignia(ctx, px, py, radius, u.type);

        if (u.hp < u.maxHp || u.isSelected) {
          const barW = Math.max(14, 18 * this.scale);
          const barH = Math.max(2, 3 * this.scale);
          const barX = px - barW / 2;
          const barY = py - radius - barH - 3;

          ctx.fillStyle = "#1e1b18";
          ctx.fillRect(barX, barY, barW, barH);

          const hpRatio = Math.max(0, Math.min(1, u.hp / u.maxHp));
          ctx.fillStyle = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.25 ? "#eab308" : "#ef4444";
          ctx.fillRect(barX, barY, barW * hpRatio, barH);
        }
      }
    }

    drawUnitInsignia(ctx, px, py, r, type) {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = Math.max(1, 1.4 * this.scale);

      const s = r * 0.55;

      if (type === "militia") {
        ctx.beginPath();
        ctx.moveTo(px - s, py + s);
        ctx.lineTo(px + s, py - s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px - s * 0.3, py + s * 0.9);
        ctx.lineTo(px - s * 0.9, py + s * 0.3);
        ctx.stroke();
      } else if (type === "archer") {
        ctx.beginPath();
        ctx.arc(px, py, s, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px + s * 0.3, py - s * 0.9);
        ctx.lineTo(px + s * 0.3, py + s * 0.9);
        ctx.stroke();
      } else if (type === "cavalry") {
        ctx.beginPath();
        ctx.arc(px, py, s * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py - s * 0.2, s * 0.4, 0, Math.PI);
        ctx.fill();
      } else if (type === "pioneer") {
        ctx.beginPath();
        ctx.moveTo(px - s * 0.6, py + s);
        ctx.lineTo(px + s * 0.4, py - s * 0.2);
        ctx.stroke();
        ctx.fillRect(px + s * 0.1, py - s, s * 0.9, s * 0.6);
      } else if (type === "siege") {
        ctx.beginPath();
        ctx.moveTo(px - s, py + s);
        ctx.lineTo(px + s, py - s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px + s * 0.8, py - s * 0.8, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    renderProjectiles(ctx, cellSize) {
      const projs = this.engine.projectiles;

      for (let i = 0; i < projs.length; i++) {
        const p = projs[i];
        const px = p.currentX * cellSize;
        const py = p.currentY * cellSize;
        const arcElevation = Math.sin(p.progress * Math.PI) * Math.max(12, 18 * this.scale);

        ctx.fillStyle = "rgba(40, 30, 20, 0.35)";
        ctx.beginPath();
        ctx.ellipse(px, py, 3 * this.scale, 2 * this.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        const flyingY = py - arcElevation;

        if (p.isSiege) {
          ctx.fillStyle = "#4a453f";
          ctx.beginPath();
          ctx.arc(px, flyingY, 4 * this.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#1a1612";
          ctx.stroke();
        } else {
          const angle = Math.atan2(p.targetY - p.fromY, p.targetX - p.fromX);
          const len = 6 * this.scale;

          ctx.strokeStyle = "#5a3a1a";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px - Math.cos(angle) * len, flyingY - Math.sin(angle) * len);
          ctx.lineTo(px, flyingY);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(px, flyingY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    renderCombatEvents(ctx, cellSize) {
      const events = this.engine.combatEvents;

      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const px = ev.x * cellSize;
        const py = ev.y * cellSize;
        const alpha = ev.life / 14;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (ev.type === "explosion") {
          ctx.fillStyle = "#f97316";
          ctx.beginPath();
          ctx.arc(px, py, (14 - ev.life) * 1.5 * this.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 2;
          const s = (14 - ev.life) * this.scale;
          ctx.beginPath();
          ctx.moveTo(px - s, py - s);
          ctx.lineTo(px + s, py + s);
          ctx.moveTo(px + s, py - s);
          ctx.lineTo(px - s, py + s);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    drawCapitalIcon(ctx, px, py, cellSize, cell) {
      const faction = this.engine.factions.get(cell.owner);
      const color = faction ? faction.border : "#ffffff";

      ctx.save();
      ctx.fillStyle = "#334155";
      ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

      ctx.fillStyle = color;
      ctx.fillRect(px + 3, py + 2, cellSize - 6, 3);

      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      ctx.restore();
    }

    drawInfraIcon(ctx, px, py, cellSize, cell) {
      const type = cell.infrastructure;
      ctx.save();

      if (type === "farm") {
        ctx.fillStyle = "#854d0e";
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 3, py + 3, cellSize - 6, cellSize - 6);
      } else if (type === "barracks") {
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px + cellSize * 0.4, py + 2, cellSize * 0.2, cellSize - 4);
      } else if (type === "outpost") {
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        ctx.strokeStyle = "#60a5fa";
        ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      } else if (type === "watchtower") {
        ctx.fillStyle = "#475569";
        ctx.fillRect(px + 3, py + 1, cellSize - 6, cellSize - 2);
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(px + 4, py + 2, cellSize - 8, 3);
      } else if (type === "palisade") {
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
      } else if (type === "citadel") {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      } else if (type === "lumber_camp") {
        ctx.fillStyle = "#273f1d";
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      } else if (type === "quarry") {
        ctx.fillStyle = "#52525b";
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
      }

      ctx.restore();
    }

    drawSelectionBox(ctx) {
      const x = Math.min(this.boxStartX, this.boxEndX);
      const y = Math.min(this.boxStartY, this.boxEndY);
      const w = Math.abs(this.boxEndX - this.boxStartX);
      const h = Math.abs(this.boxEndY - this.boxStartY);

      ctx.save();
      ctx.strokeStyle = "#22c55e";
      ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    renderOrderRipples(ctx) {
      for (let i = this.orderRipples.length - 1; i >= 0; i--) {
        const r = this.orderRipples[i];
        r.radius += 1.2;
        r.alpha -= 0.05;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          this.orderRipples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = r.isAttack ? `rgba(239, 68, 68, ${r.alpha})` : `rgba(34, 197, 94, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    renderDayNightAtmosphere(ctx, width, height) {
      const progress = this.engine.dayTimeSec / CONFIG.DAY_DURATION_SEC;
      let nightAlpha = 0;

      if (progress > 0.65 && progress <= 0.85) {
        nightAlpha = ((progress - 0.65) / 0.20) * 0.45;
      } else if (progress > 0.85) {
        nightAlpha = 0.45;
      } else if (progress < 0.15) {
        nightAlpha = (1 - progress / 0.15) * 0.45;
      }

      if (nightAlpha > 0.01) {
        ctx.fillStyle = `rgba(10, 15, 30, ${nightAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    renderMinimap(ctx, screenWidth, screenHeight) {
      const miniW = 150;
      const miniH = 100;
      const pad = 12;
      const miniX = screenWidth - miniW - pad;
      const miniY = screenHeight - miniH - 126;

      ctx.fillStyle = "#dec89b";
      ctx.fillRect(miniX, miniY, miniW, miniH);
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 2;
      ctx.strokeRect(miniX, miniY, miniW, miniH);

      const stepX = miniW / this.map.width;
      const stepY = miniH / this.map.height;

      for (let y = 0; y < this.map.height; y += 2) {
        for (let x = 0; x < this.map.width; x += 2) {
          const cell = this.map.getCell(x, y);
          if (cell && cell.owner > 0) {
            const faction = this.engine.factions.get(cell.owner);
            if (faction) {
              ctx.fillStyle = faction.color;
              ctx.fillRect(miniX + x * stepX, miniY + y * stepY, stepX * 2, stepY * 2);
            }
          }
        }
      }

      this.engine.units.forEach((u) => {
        ctx.fillStyle = u.factionId === 1 ? "#55FF55" : "#FF5555";
        ctx.fillRect(miniX + u.x * stepX, miniY + u.y * stepY, 2, 2);
      });

      const cellSize = CONFIG.CELL_SIZE * this.scale;
      const camX = miniX + (-this.offsetX / cellSize) * stepX;
      const camY = miniY + (-this.offsetY / cellSize) * stepY;
      const camW = (screenWidth / cellSize) * stepX;
      const camH = (screenHeight / cellSize) * stepY;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(camX, camY, camW, camH);
    }
  }

  // ==================== 7. IA TACTIQUE RTS ====================
  class AIController {
    constructor(engine, worldMap) {
      this.engine = engine;
      this.map = worldMap;
      this.aiTickCounter = 0;
    }

    update() {
      this.aiTickCounter++;
      if (this.aiTickCounter % 30 !== 0) return;

      this.engine.factions.forEach((faction) => {
        if (!faction.isAI || faction.isDefeated) return;
        this.processFactionTurn(faction);
      });
    }

    processFactionTurn(faction) {
      const fid = faction.id;
      const myUnits = this.engine.units.filter((u) => u.factionId === fid && u.hp > 0);

      this.decideRecruitment(faction, myUnits);
      this.decideConstruction(faction, myUnits);
      this.commandUnits(faction, myUnits);
    }

    decideRecruitment(faction, myUnits) {
      const fid = faction.id;
      if (myUnits.length >= 25) return;

      const militaryCount = myUnits.filter((u) => u.attack > 0).length;
      const pioneerCount = myUnits.filter((u) => u.type === "pioneer").length;

      if (pioneerCount < 2 && faction.food >= 30 && faction.wood >= 20) {
        this.engine.recruitUnit(fid, "pioneer");
        return;
      }

      if (faction.personality === "aggressive") {
        if (Math.random() < 0.4 && faction.gold >= 40 && faction.food >= 50) {
          this.engine.recruitUnit(fid, "cavalry");
        } else if (Math.random() < 0.5 && faction.wood >= 30 && faction.food >= 30) {
          this.engine.recruitUnit(fid, "archer");
        } else if (faction.stone >= 15 && faction.food >= 25) {
          this.engine.recruitUnit(fid, "militia");
        }
      } else {
        if (militaryCount < 6 && faction.food >= 25 && faction.stone >= 15) {
          this.engine.recruitUnit(fid, "militia");
        } else if (faction.wood >= 30 && faction.food >= 30) {
          this.engine.recruitUnit(fid, "archer");
        }
      }
    }

    decideConstruction(faction, myUnits) {
      const fid = faction.id;
      const borders = this.map.getBorderCells(fid);
      if (borders.length === 0) return;

      if (faction.food < 40 && faction.wood >= 40 && faction.stone >= 10) {
        const plainCell = borders.find((c) => c.terrain === CONFIG.TERRAIN.PLAIN && !c.infrastructure);
        if (plainCell) {
          this.engine.buildInfrastructure(fid, plainCell.x, plainCell.y, "farm");
          return;
        }
      }

      if (faction.wood >= 50 && faction.stone >= 30 && faction.gold >= 15 && Math.random() < 0.25) {
        const targetBorder = borders[Math.floor(Math.random() * borders.length)];
        if (targetBorder && !targetBorder.infrastructure) {
          this.engine.buildInfrastructure(fid, targetBorder.x, targetBorder.y, "outpost");
          return;
        }
      }

      if (faction.wood >= 60 && faction.stone >= 50 && Math.random() < 0.2) {
        const targetBorder = borders[Math.floor(Math.random() * borders.length)];
        if (targetBorder && !targetBorder.infrastructure) {
          this.engine.buildInfrastructure(fid, targetBorder.x, targetBorder.y, "watchtower");
        }
      }
    }

    commandUnits(faction, myUnits) {
      const fid = faction.id;
      const idleUnits = myUnits.filter((u) => u.state === "idle");
      if (idleUnits.length === 0) return;

      const idlePioneers = idleUnits.filter((u) => u.type === "pioneer");
      idlePioneers.forEach((p) => {
        const targetCell = this.findExpansionTarget(fid, p.x, p.y);
        if (targetCell) p.moveTo(targetCell.x, targetCell.y);
      });

      const idleMilitary = idleUnits.filter((u) => u.attack > 0);
      if (idleMilitary.length >= 3) {
        const targetEnemy = this.findEnemyTarget(fid, idleMilitary[0].x, idleMilitary[0].y, faction.personality === "aggressive");
        if (targetEnemy) {
          idleMilitary.slice(0, 5).forEach((u, idx) => {
            const ox = (idx % 2 - 0.5) * 1.0;
            const oy = Math.floor(idx / 2) * 1.0;
            u.moveTo(targetEnemy.x + ox, targetEnemy.y + oy);
          });
        }
      }
    }

    findExpansionTarget(factionId, fromX, fromY) {
      let bestCell = null;
      let minDist = 999;

      for (let dy = -10; dy <= 10; dy += 2) {
        for (let dx = -10; dx <= 10; dx += 2) {
          const cx = Math.floor(fromX + dx);
          const cy = Math.floor(fromY + dy);
          const cell = this.map.getCell(cx, cy);

          if (cell && cell.terrain.traversable && cell.owner === 0) {
            const d = Math.hypot(dx, dy);
            if (d < minDist && d > 2) {
              minDist = d;
              bestCell = cell;
            }
          }
        }
      }

      return bestCell;
    }

    findEnemyTarget(factionId, fromX, fromY, isAggressive) {
      for (let i = 0; i < this.engine.units.length; i++) {
        const other = this.engine.units[i];
        if (other.factionId !== factionId && other.hp > 0) {
          const d = Math.hypot(other.x - fromX, other.y - fromY);
          if (d < 16) return { x: other.x, y: other.y };
        }
      }

      if (isAggressive) {
        const playerCap = this.map.capitals.find((c) => c.factionId === 1);
        if (playerCap && Math.random() < 0.6) return { x: playerCap.x, y: playerCap.y };
      }

      const enemyCapitals = this.map.capitals.filter((c) => c.factionId !== factionId);
      if (enemyCapitals.length > 0) {
        const randomCap = enemyCapitals[Math.floor(Math.random() * enemyCapitals.length)];
        return { x: randomCap.x, y: randomCap.y };
      }

      return null;
    }
  }

  // ==================== 8. GESTIONNAIRE RÉSEAU P2P ====================
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

  // ==================== 9. CONTRÔLEUR D'INTERFACE UTILISATEUR ====================
  class UIManager {
    constructor(engine, renderer, network) {
      this.engine = engine;
      this.renderer = renderer;
      this.network = network;

      this.selectedUnits = [];
      this.selectedBuildMode = null;

      this.bindDomElements();
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
          } else {
            this.selectedBuildMode = type;
            document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            SOUND.playClick();
          }
        });
      });
    }

    setupRTSMouseControls() {
      const canvas = this.renderer.canvas;
      let isMouseDown = false;
      let startScreenX = 0;
      let startScreenY = 0;
      let hasDragged = false;

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

          if (this.selectedUnits.length > 0) SOUND.playClick();
          this.updateSelectionDisplay();
          return;
        }

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

      canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (this.selectedUnits.length === 0) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        const cell = this.renderer.screenToWorldCell(mouseX, mouseY);

        if (!cell) return;

        const myPlayerId = this.network.myPlayerId;

        const targetEnemy = this.engine.units.find(
          (u) => u.factionId !== myPlayerId && Math.hypot(u.x - (cell.x + 0.5), u.y - (cell.y + 0.5)) < 1.4 && u.hp > 0
        );

        if (targetEnemy) {
          this.selectedUnits.forEach((u) => u.attackTarget(targetEnemy));
          this.renderer.addOrderRipple(mouseX, mouseY, true);
          SOUND.playCharge();
        } else {
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

    updateHUD() {
      const myPlayerId = this.network.myPlayerId;
      const playerFaction = this.engine.factions.get(myPlayerId);
      if (!playerFaction) return;

      if (this.elNationName) {
        this.elNationName.textContent = playerFaction.name;
        this.elNationName.style.color = playerFaction.border;
      }

      const stage = CONFIG.STAGES[playerFaction.stageTier];
      if (this.elStageBadge && stage) {
        this.elStageBadge.textContent = `[T${stage.tier}] ${stage.name}`;
      }

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

      const activeTroops = this.engine.units.filter((u) => u.factionId === myPlayerId).length;
      if (this.elTroops) this.elTroops.textContent = activeTroops;
      if (this.elTerritory) this.elTerritory.textContent = `${playerFaction.territoryCount} pts`;

      if (this.elDayDisplay) {
        this.elDayDisplay.textContent = `JOUR ${this.engine.dayCount}`;
      }

      if (this.selectedUnits.some((u) => u.hp <= 0)) {
        this.selectedUnits = this.selectedUnits.filter((u) => u.hp > 0);
        this.updateSelectionDisplay();
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
        if (hex) return `</span><span style="color: ${hex}">`;
        return "</span>";
      });

      return `<span>${safe}</span>`;
    }
  }

  // ==================== 10. ORCHESTRATEUR PRINCIPAL (GAME APP) ====================
  class GameApp {
    constructor() {
      this.map = new WorldMap();
      this.map.generate(Date.now());

      this.network = new NetworkManager({ factions: new Map(), addLog: () => {} });
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
      this.engine.addLog("§aPartie lancée ! Sélectionnez vos bataillons (clic/glisser) et commandez vos troupes au clic droit !");
    }

    gameLoop() {
      if (this.isPlayingSession) {
        this.engine.update();
        this.ai.update();
        this.ui.updateHUD();
      } else {
        this.renderer.offsetX -= 0.25;
      }

      this.renderer.render();
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.app = new GameApp();
    });
  } else {
    window.app = new GameApp();
  }
})();

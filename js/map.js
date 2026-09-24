/**
 * Jerry's Nations: Frontline Realms - Procedural Map Generator & Spatial Index
 * Génération de continents, fleuves, chaînes de montagnes, forêts et capitales initiales.
 */

import { CONFIG } from "./config.js";

export class WorldMap {
  constructor(width = CONFIG.MAP_WIDTH, height = CONFIG.MAP_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = new Array(width * height);
    this.capitals = [];
  }

  // Pseudo-générateur déterministe simple
  generate(seed = Date.now()) {
    const prng = this.createPrng(seed);

    // 1. Génération de carte de hauteur (Perlin / multi-octave synthétique)
    const heightMap = new Float32Array(this.width * this.height);
    const moistureMap = new Float32Array(this.width * this.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nx = (x / this.width) * 4;
        const ny = (y / this.height) * 4;

        // Bords de carte entourés d'eau (masque d'île)
        const dx = 2 * (x / this.width) - 1;
        const dy = 2 * (y / this.height) - 1;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        let h = Math.sin(nx + prng() * 0.1) * 0.4 + Math.cos(ny + prng() * 0.1) * 0.4;
        h += Math.sin(nx * 2) * 0.2 + Math.cos(ny * 2) * 0.2;
        h += Math.sin(nx * 4) * 0.1 + Math.cos(ny * 4) * 0.1;
        h = (h + 1) * 0.5; // Normaliser 0..1
        h -= distFromCenter * 0.45; // Effet d'île continentale

        let m = Math.sin(nx * 1.5 + 1.2) * 0.5 + Math.cos(ny * 1.5 + 0.8) * 0.5;
        m = (m + 1) * 0.5;

        const idx = y * this.width + x;
        heightMap[idx] = h;
        moistureMap[idx] = m;
      }
    }

    // 2. Attribution des biomes / terrains
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

        // Cellule initiale
        this.grid[idx] = {
          x,
          y,
          terrain,
          owner: 0, // 0 = Wilderness neutre
          troops: terrain.traversable ? Math.floor(prng() * 5) + 2 : 0, // Résistance initiale faible
          infrastructure: null,
          isCapital: false,
          capitalFactionId: null,
          lastCombatTick: 0
        };
      }
    }

    // 3. Placement équilibré des capitales pour chaque faction
    this.placeCapitals(prng);
  }

  placeCapitals(prng) {
    this.capitals = [];
    const factions = CONFIG.FACTIONS;
    const candidates = [];

    // Trouver toutes les cellules de plaine fertiles loin de l'eau profonde
    for (let y = 10; y < this.height - 10; y++) {
      for (let x = 10; x < this.width - 10; x++) {
        const cell = this.getCell(x, y);
        if (cell && cell.terrain === CONFIG.TERRAIN.PLAIN) {
          candidates.push(cell);
        }
      }
    }

    if (candidates.length === 0) return;

    // Placer la capitale de chaque faction avec une distance minimale
    const minDist = Math.floor(Math.min(this.width, this.height) / (factions.length * 0.7));

    factions.forEach((faction) => {
      let chosen = null;
      let attempts = 0;

      while (!chosen && attempts < 200) {
        attempts++;
        const candidate = candidates[Math.floor(prng() * candidates.length)];
        const tooClose = this.capitals.some((cap) => {
          const d = Math.hypot(cap.x - candidate.x, cap.y - candidate.y);
          return d < minDist;
        });

        if (!tooClose) {
          chosen = candidate;
        }
      }

      if (!chosen) {
        chosen = candidates[Math.floor(prng() * candidates.length)];
      }

      chosen.owner = faction.id;
      chosen.isCapital = true;
      chosen.capitalFactionId = faction.id;
      chosen.troops = 120; // Garnison de départ importante
      chosen.infrastructure = "citadel";

      // Revendiquer un territoire initial 3x3 autour de la capitale
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighbor = this.getCell(chosen.x + dx, chosen.y + dy);
          if (neighbor && neighbor.terrain.traversable) {
            neighbor.owner = faction.id;
            neighbor.troops = 30;
          }
        }
      }

      this.capitals.push({
        factionId: faction.id,
        x: chosen.x,
        y: chosen.y,
        name: faction.name
      });
    });
  }

  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.grid[y * this.width + x];
  }

  getNeighbors(x, y, includeDiagonals = false) {
    const list = [];
    const dirs = includeDiagonals
      ? [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]
      : [[0, 1], [1, 0], [0, -1], [-1, 0]];

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

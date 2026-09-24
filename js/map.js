/**
 * Jerry's Nations: Frontline Realms - Strategic Sector Map Generator
 * Carte continentale à grande échelle découpée en secteurs tactiques de 56px.
 * Biomes à fort impact (Plaines agricoles, Forêts d'exploitation, Collines minières, Cols de montagne et Rivières à gués).
 */

import { CONFIG } from "./config.js";

export class WorldMap {
  constructor(width = CONFIG.MAP_WIDTH, height = CONFIG.MAP_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = new Array(width * height);
    this.capitals = [];
  }

  createPrng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  generate(seed = Date.now()) {
    const prng = this.createPrng(seed);

    const heightMap = new Float32Array(this.width * this.height);
    const moistureMap = new Float32Array(this.width * this.height);

    // 1. Génération de carte de relief et d'humidité
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nx = (x / this.width) * 3.5;
        const ny = (y / this.height) * 3.5;

        // Masque de continent insulaire
        const dx = 2 * (x / this.width) - 1;
        const dy = 2 * (y / this.height) - 1;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        let h = Math.sin(nx + prng() * 0.15) * 0.38 + Math.cos(ny + prng() * 0.15) * 0.38;
        h += Math.sin(nx * 2.2 + 0.5) * 0.22 + Math.cos(ny * 2.2 + 0.3) * 0.22;
        h += Math.sin(nx * 4.4) * 0.10 + Math.cos(ny * 4.4) * 0.10;
        h = (h + 1) * 0.5 - distFromCenter * 0.42;

        let m = Math.sin(nx * 1.8 + 1.2) * 0.5 + Math.cos(ny * 1.8 + 0.8) * 0.5;
        m = (m + 1) * 0.5;

        const idx = y * this.width + x;
        heightMap[idx] = h;
        moistureMap[idx] = m;
      }
    }

    // 2. Traçage d'un grand fleuve avec des gués (points de passage tactiques)
    const riverY = Math.floor(this.height * 0.52);
    const riverCoords = new Set();
    const fordCoords = new Set();

    let curY = riverY;
    for (let x = 6; x < this.width - 6; x++) {
      if (prng() < 0.25) curY += prng() < 0.5 ? 1 : -1;
      curY = Math.max(8, Math.min(this.height - 8, curY));
      riverCoords.add(`${x},${curY}`);

      // Gués placés tous les 8 à 12 secteurs
      if (x % 10 === 0) {
        fordCoords.add(`${x},${curY}`);
      }
    }

    // 3. Attribution des Biomes par Secteur
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const h = heightMap[idx];
        const m = moistureMap[idx];
        const coordKey = `${x},${y}`;

        let terrain;

        if (fordCoords.has(coordKey) && h >= 0.22) {
          terrain = CONFIG.TERRAIN.FORD;
        } else if (riverCoords.has(coordKey) && h >= 0.22) {
          terrain = CONFIG.TERRAIN.RIVER;
        } else if (h < 0.20) {
          terrain = CONFIG.TERRAIN.DEEP_WATER;
        } else if (h > 0.74) {
          terrain = CONFIG.TERRAIN.MOUNTAIN;
        } else if (h > 0.55) {
          terrain = CONFIG.TERRAIN.HILLS;
        } else if (m > 0.48) {
          terrain = CONFIG.TERRAIN.FOREST;
        } else {
          terrain = CONFIG.TERRAIN.PLAIN;
        }

        // Variantes visuelles (arbres, rochers, herbes) pour le rendu sectorisé
        const variantSeed = Math.floor(prng() * 100);

        this.grid[idx] = {
          x,
          y,
          terrain,
          variantSeed,
          owner: 0, // 0 = Neutre / Sauvage
          infrastructure: null,
          infraHp: null,
          isCapital: false,
          capitalFactionId: null
        };
      }
    }

    // 4. Implantation stratégique des capitales
    this.placeCapitals(prng);
  }

  placeCapitals(prng) {
    this.capitals = [];
    const factions = CONFIG.FACTIONS;
    const candidates = [];

    // Trouver les secteurs de plaine entourés de forêts et collines exploitables
    for (let y = 6; y < this.height - 6; y++) {
      for (let x = 6; x < this.width - 6; x++) {
        const cell = this.getCell(x, y);
        if (cell && cell.terrain === CONFIG.TERRAIN.PLAIN) {
          // Vérifier qu'il y a du bois et de la roche à proximité (2 à 4 cases)
          const neighbors = this.getNeighbors(x, y, true);
          const hasWater = neighbors.some((n) => n.terrain === CONFIG.TERRAIN.DEEP_WATER);
          if (!hasWater) {
            candidates.push(cell);
          }
        }
      }
    }

    if (candidates.length === 0) return;

    const minDist = Math.floor(Math.min(this.width, this.height) / (factions.length * 0.55));

    factions.forEach((faction) => {
      let chosen = null;
      let attempts = 0;

      while (!chosen && attempts < 250) {
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

      // Revendication territoriale initiale (secteurs immédiats)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighbor = this.getCell(chosen.x + dx, chosen.y + dy);
          if (neighbor && neighbor.terrain.traversable) {
            neighbor.owner = faction.id;
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
}

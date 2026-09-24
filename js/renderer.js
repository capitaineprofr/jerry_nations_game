/**
 * Jerry's Nations: Frontline Realms - RTS Canvas 2D Renderer
 * Rendu haute performance 60 FPS des bataillons physiques, projectiles balistiques en cloche,
 * bâtiments médiévaux, boîte de sélection (Marquee), effets d'impacts et cycle jour/nuit.
 */

import { CONFIG } from "./config.js";

export class MapRenderer {
  constructor(canvas, worldMap, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.map = worldMap;
    this.engine = engine;

    // Caméra & Transformations
    this.scale = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Box Selection (Rectangle de sélection RTS à la souris)
    this.isBoxSelecting = false;
    this.boxStartX = 0;
    this.boxStartY = 0;
    this.boxEndX = 0;
    this.boxEndY = 0;

    // Marqueurs d'ordres visuels (clic vert/rouge)
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

    // Déplacement de caméra (Pan au clic molette ou clic droit avec shift)
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

    // Zoom molette centré
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

    // 1. Fond parchemin vieilli
    ctx.fillStyle = "#dec89b";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);

    // 2. Grille de terrain & zones territoriales
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

        // Terrain
        ctx.fillStyle = cell.terrain.color;
        ctx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);

        // Teinte territoriale
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

        // Bâtiments & Infrastructures
        if (cell.isCapital) {
          this.drawCapitalIcon(ctx, px, py, cellSize, cell);
        } else if (cell.infrastructure) {
          this.drawInfraIcon(ctx, px, py, cellSize, cell);
        }
      }
    }

    // 3. Dessin des Unités Physiques RTS
    this.renderUnits(ctx, cellSize);

    // 4. Dessin des Projectiles Balistiques (flèches en cloche, boulets)
    this.renderProjectiles(ctx, cellSize);

    // 5. Étincelles & Impacts de combat
    this.renderCombatEvents(ctx, cellSize);

    // 6. Cellule survolée
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

    // 7. Dessin de la boîte de sélection Marquee (en coordonnées écran)
    if (this.isBoxSelecting) {
      this.drawSelectionBox(ctx);
    }

    // 8. Cercles d'ordres animés (Clic vert / rouge)
    this.renderOrderRipples(ctx);

    // 9. Ambiance Jour / Nuit
    this.renderDayNightAtmosphere(ctx, width, height);

    // 10. Mini-carte radar
    this.renderMinimap(ctx, width, height);
  }

  // Rendu de chaque bataillon d'unité
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

      // 1. Cercle de sélection joueur
      if (u.isSelected) {
        ctx.strokeStyle = "#55FF55";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, py, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Socle d'unité de faction
      ctx.fillStyle = factionColor;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = factionBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Dessin de l'insigne d'unité
      this.drawUnitInsignia(ctx, px, py, radius, u.type);

      // 4. Barre de vie (HP)
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
      // Épée
      ctx.beginPath();
      ctx.moveTo(px - s, py + s);
      ctx.lineTo(px + s, py - s);
      ctx.stroke();
      // Garde de l'épée
      ctx.beginPath();
      ctx.moveTo(px - s * 0.3, py + s * 0.9);
      ctx.lineTo(px - s * 0.9, py + s * 0.3);
      ctx.stroke();
    } else if (type === "archer") {
      // Arc
      ctx.beginPath();
      ctx.arc(px, py, s, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px + s * 0.3, py - s * 0.9);
      ctx.lineTo(px + s * 0.3, py + s * 0.9);
      ctx.stroke();
    } else if (type === "cavalry") {
      // Fer à cheval / Casque
      ctx.beginPath();
      ctx.arc(px, py, s * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py - s * 0.2, s * 0.4, 0, Math.PI);
      ctx.fill();
    } else if (type === "pioneer") {
      // Marteau de bâtisseur
      ctx.beginPath();
      ctx.moveTo(px - s * 0.6, py + s);
      ctx.lineTo(px + s * 0.4, py - s * 0.2);
      ctx.stroke();
      ctx.fillRect(px + s * 0.1, py - s, s * 0.9, s * 0.6);
    } else if (type === "siege") {
      // Trébuchet / Baliste
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

  // Rendu des projectiles balistiques en cloche
  renderProjectiles(ctx, cellSize) {
    const projs = this.engine.projectiles;

    for (let i = 0; i < projs.length; i++) {
      const p = projs[i];
      const px = p.currentX * cellSize;
      const py = p.currentY * cellSize;

      // Arc balistique vertical (élévation en cloche)
      const arcElevation = Math.sin(p.progress * Math.PI) * Math.max(12, 18 * this.scale);

      // Ombre portée au sol
      ctx.fillStyle = "rgba(40, 30, 20, 0.35)";
      ctx.beginPath();
      ctx.ellipse(px, py, 3 * this.scale, 2 * this.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Projectile dans les airs
      const flyingY = py - arcElevation;

      if (p.isSiege) {
        // Boulet de trébuchet
        ctx.fillStyle = "#4a453f";
        ctx.beginPath();
        ctx.arc(px, flyingY, 4 * this.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1a1612";
        ctx.stroke();
      } else {
        // Flèche d'arc
        const angle = Math.atan2(p.targetY - p.fromY, p.targetX - p.fromX);
        const len = 6 * this.scale;

        ctx.strokeStyle = "#5a3a1a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px - Math.cos(angle) * len, flyingY - Math.sin(angle) * len);
        ctx.lineTo(px, flyingY);
        ctx.stroke();

        // Pointe métallique blanche
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
        // Étincelle d'épée
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
    // Bâtiment fortifié de capitale
    ctx.fillStyle = "#334155";
    ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

    ctx.fillStyle = color;
    ctx.fillRect(px + 3, py + 2, cellSize - 6, 3);

    // Bannière / Couronne
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
      nightAlpha = ((progress - 0.65) / 0.20) * 0.45; // Crépuscule
    } else if (progress > 0.85) {
      nightAlpha = 0.45; // Nuit
    } else if (progress < 0.15) {
      nightAlpha = (1 - progress / 0.15) * 0.45; // Aube
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
    const miniY = screenHeight - miniH - 110;

    // Cadre parchemin minimap
    ctx.fillStyle = "#dec89b";
    ctx.fillRect(miniX, miniY, miniW, miniH);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.strokeRect(miniX, miniY, miniW, miniH);

    const stepX = miniW / this.map.width;
    const stepY = miniH / this.map.height;

    // Rendu des cellules possédées
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

    // Positions des unités sur la minimap
    this.engine.units.forEach((u) => {
      ctx.fillStyle = u.factionId === 1 ? "#55FF55" : "#FF5555";
      ctx.fillRect(miniX + u.x * stepX, miniY + u.y * stepY, 2, 2);
    });

    // Rectangle caméra
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

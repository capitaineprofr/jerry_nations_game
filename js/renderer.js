/**
 * Jerry's Nations: Frontline Realms - Strategic Sector Canvas 2D Renderer
 * Rendu haute performance 60 FPS des secteurs quadrillés de 56px.
 * Visualisation riche des biomes (arbres en forêt, champs de blé en plaine, roches en collines, pics enneigés),
 * bâtiments médiévaux, unités physiques, balistique en cloche et interface de survol.
 */

import { CONFIG } from "./config.js";

export class MapRenderer {
  constructor(canvas, worldMap, engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.map = worldMap;
    this.engine = engine;

    // Caméra & Transformations
    this.scale = 0.95;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Déplacement et navigation
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.isRightMouseDown = false;
    this.rightDragStartX = 0;
    this.rightDragStartY = 0;
    this.hasRightDragged = false;

    this.keysDown = {};
    this.mouseScreenX = -1;
    this.mouseScreenY = -1;
    this.isMouseInWindow = false;
    this.isSpacePressed = false;
    this.edgeScrollEnabled = false; // Désactivé par défaut pour éviter les mouvements intempestifs
    this.minimapBounds = { x: 0, y: 0, w: 160, h: 106 };

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
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.parentElement.clientWidth * this.dpr;
    this.canvas.height = this.canvas.parentElement.clientHeight * this.dpr;
    this.ctx.imageSmoothingEnabled = false;
  }

  updateCamera() {
    const panSpeed = 10 * this.dpr;

    // 1. Déplacement Clavier (ZQSD / WASD / Flèches)
    if (this.keysDown["KeyW"] || this.keysDown["KeyZ"] || this.keysDown["ArrowUp"]) {
      this.offsetY += panSpeed;
    }
    if (this.keysDown["KeyS"] || this.keysDown["ArrowDown"]) {
      this.offsetY -= panSpeed;
    }
    if (this.keysDown["KeyA"] || this.keysDown["KeyQ"] || this.keysDown["ArrowLeft"]) {
      this.offsetX += panSpeed;
    }
    if (this.keysDown["KeyD"] || this.keysDown["ArrowRight"]) {
      this.offsetX -= panSpeed;
    }

    // 2. Défilement aux bords de l'écran (si activé explicitement par le joueur)
    if (this.edgeScrollEnabled && this.isMouseInWindow && !this.isBoxSelecting && !this.isDragging) {
      const edge = 8;
      const scrollSpeed = 6 * this.dpr;

      if (this.mouseScreenX >= 0 && this.mouseScreenX < edge) {
        this.offsetX += scrollSpeed;
      } else if (this.mouseScreenX > window.innerWidth - edge && this.mouseScreenX <= window.innerWidth) {
        this.offsetX -= scrollSpeed;
      }

      if (this.mouseScreenY >= 0 && this.mouseScreenY < edge) {
        this.offsetY += scrollSpeed;
      } else if (this.mouseScreenY > window.innerHeight - edge && this.mouseScreenY <= window.innerHeight) {
        this.offsetY -= scrollSpeed;
      }
    }

    this.clampCamera();
  }

  centerCameraOnPlayerCapital() {
    const playerCapital = this.map.capitals.find((c) => c.factionId === 1);
    const cellSize = CONFIG.CELL_SIZE;
    if (playerCapital) {
      this.centerCameraOnWorld(playerCapital.x * cellSize + cellSize / 2, playerCapital.y * cellSize + cellSize / 2);
    } else {
      this.centerCameraOnWorld((this.map.width * cellSize) / 2, (this.map.height * cellSize) / 2);
    }
  }

  centerCameraOnWorld(worldX, worldY) {
    this.offsetX = this.canvas.width / 2 - worldX * this.scale;
    this.offsetY = this.canvas.height / 2 - worldY * this.scale;
    this.clampCamera();
  }

  clampCamera() {
    const totalW = this.map.width * CONFIG.CELL_SIZE * this.scale;
    const totalH = this.map.height * CONFIG.CELL_SIZE * this.scale;
    const margin = 100 * this.dpr;

    if (totalW + margin * 2 <= this.canvas.width) {
      this.offsetX = (this.canvas.width - totalW) / 2;
    } else {
      const minOffsetX = this.canvas.width - totalW - margin;
      const maxOffsetX = margin;
      this.offsetX = Math.min(maxOffsetX, Math.max(minOffsetX, this.offsetX));
    }

    if (totalH + margin * 2 <= this.canvas.height) {
      this.offsetY = (this.canvas.height - totalH) / 2;
    } else {
      const minOffsetY = this.canvas.height - totalH - margin;
      const maxOffsetY = margin;
      this.offsetY = Math.min(maxOffsetY, Math.max(minOffsetY, this.offsetY));
    }
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.initCanvasSize();
      this.clampCamera();
    });

    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      this.keysDown[e.code] = true;
      if (e.code === "Space") this.isSpacePressed = true;
      if (e.code === "KeyC") {
        this.centerCameraOnPlayerCapital();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keysDown[e.code] = false;
      if (e.code === "Space") this.isSpacePressed = false;
    });

    window.addEventListener("mousemove", (e) => {
      this.mouseScreenX = e.clientX;
      this.mouseScreenY = e.clientY;
      this.isMouseInWindow = true;

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      if (this.isRightMouseDown) {
        const dist = Math.hypot(e.clientX - this.rightDragStartX, e.clientY - this.rightDragStartY);
        if (dist > 6) {
          this.hasRightDragged = true;
          this.isDragging = true;
        }
      }

      if (this.isDragging) {
        this.offsetX = mouseX - this.dragStartX;
        this.offsetY = mouseY - this.dragStartY;
        this.clampCamera();
      } else {
        this.hoverCell = this.screenToWorldCell(mouseX, mouseY);
      }
    });

    window.addEventListener("mouseleave", () => {
      this.isMouseInWindow = false;
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      // Clic sur la minimap pour téléporter la vue
      if (this.checkMinimapClick(mouseX, mouseY)) {
        return;
      }

      // Clic droit : préparer détection drag ou ordre
      if (e.button === 2) {
        this.isRightMouseDown = true;
        this.hasRightDragged = false;
        this.rightDragStartX = e.clientX;
        this.rightDragStartY = e.clientY;
        this.dragStartX = mouseX - this.offsetX;
        this.dragStartY = mouseY - this.offsetY;
      }

      // Clic molette (1) ou Espace + Clic gauche (0)
      if (e.button === 1 || (e.button === 0 && this.isSpacePressed)) {
        this.isDragging = true;
        this.dragStartX = mouseX - this.offsetX;
        this.dragStartY = mouseY - this.offsetY;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button === 2) {
        this.isRightMouseDown = false;
      }
      if (this.isDragging) {
        this.isDragging = false;
      }
    });

    // Zoom molette
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newScale = Math.max(0.35, Math.min(2.8, this.scale * zoomFactor));

      this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
      this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
      this.scale = newScale;
      this.clampCamera();
    }, { passive: false });

    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  checkMinimapClick(screenX, screenY) {
    const mb = this.minimapBounds;
    if (screenX >= mb.x && screenX <= mb.x + mb.w && screenY >= mb.y && screenY <= mb.y + mb.h) {
      const normX = (screenX - mb.x) / mb.w;
      const normY = (screenY - mb.y) / mb.h;
      const targetWorldX = normX * this.map.width * CONFIG.CELL_SIZE;
      const targetWorldY = normY * this.map.height * CONFIG.CELL_SIZE;
      this.centerCameraOnWorld(targetWorldX, targetWorldY);
      return true;
    }
    return false;
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
      radius: 6,
      maxRadius: 28,
      isAttack,
      alpha: 1.0
    });
  }

  render() {
    this.updateCamera();

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cellSize = CONFIG.CELL_SIZE * this.scale;

    // 1. Fond parchemin vieilli
    ctx.fillStyle = "#dec89b";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);

    // 2. Grille de secteurs tactiques
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

        // Rendu du terrain et des éléments de biome (arbres, champs, roches)
        this.drawSectorBiome(ctx, px, py, cellSize, cell);

        // Quadrillage visible de secteur (lignes parcheminées gravées)
        ctx.strokeStyle = "rgba(40, 25, 10, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, cellSize, cellSize);

        // Teinte de possession territoriale de faction
        if (cell.owner > 0) {
          const faction = this.engine.factions.get(cell.owner);
          if (faction) {
            ctx.fillStyle = faction.color;
            ctx.globalAlpha = 0.38;
            ctx.fillRect(px, py, cellSize, cellSize);
            ctx.globalAlpha = 1.0;

            // Bordure frontalière accentuée
            if (this.map.isBorderCell(x, y, cell.owner)) {
              ctx.strokeStyle = faction.border;
              ctx.lineWidth = Math.max(2, 3 * this.scale);
              ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
            }
          }
        }

        // Bâtiments et infrastructures
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

    // 6. Surbrillance du Secteur Survolé
    if (this.hoverCell) {
      this.drawHoverSectorHighlight(ctx, this.hoverCell, cellSize);
    }

    ctx.restore();

    // 7. Boîte de sélection Marquee
    if (this.isBoxSelecting) {
      this.drawSelectionBox(ctx);
    }

    // 8. Cercles d'ordres animés
    this.renderOrderRipples(ctx);

    // 9. Ambiance Jour / Nuit
    this.renderDayNightAtmosphere(ctx, width, height);

    // 10. Mini-carte radar
    this.renderMinimap(ctx, width, height);
  }

  // Rendu visuel riche du biome dans le secteur de 56px
  drawSectorBiome(ctx, px, py, s, cell) {
    const t = cell.terrain;
    const v = cell.variantSeed;

    // Couleur de base du sol
    ctx.fillStyle = t.color;
    ctx.fillRect(px, py, s, s);

    ctx.save();

    if (t.id === "plain") {
      // Plaine arable : herbes et fleurs subtiles
      ctx.fillStyle = "rgba(45, 75, 30, 0.4)";
      const ox1 = ((v * 7) % 36) * (s / 56);
      const oy1 = ((v * 13) % 36) * (s / 56);
      ctx.fillRect(px + ox1 + 8, py + oy1 + 10, 4, 3);
      ctx.fillRect(px + ox1 + 22, py + oy1 + 18, 5, 3);

      // Si une ferme est installée : tracer des sillons de blé doré
      if (cell.infrastructure === "farm") {
        ctx.fillStyle = "#eab308";
        for (let i = 8; i < s - 8; i += 7) {
          ctx.fillRect(px + 6, py + i, s - 12, 3);
        }
      }
    } else if (t.id === "forest") {
      // Forêt dense : dessiner un bosquet de 4 à 6 arbres
      ctx.fillStyle = "#1e3713"; // Feuillage sombre
      ctx.strokeStyle = "#14250c";

      const treeOffsets = [
        [14, 14], [34, 12], [22, 28], [38, 34], [12, 36]
      ];

      treeOffsets.forEach(([tx, ty]) => {
        const x = px + (tx * s) / 56;
        const y = py + (ty * s) / 56;
        const r = 5.5 * this.scale;

        // Tronc
        ctx.fillStyle = "#3e2712";
        ctx.fillRect(x - 1, y + 2, 2, 4);

        // Couronne de feuilles
        ctx.fillStyle = "#1e3713";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Si scierie : dessiner bûches coupées
      if (cell.infrastructure === "lumber_camp") {
        ctx.fillStyle = "#b45309";
        ctx.fillRect(px + s * 0.4, py + s * 0.4, s * 0.25, 4);
      }
    } else if (t.id === "hills") {
      // Collines rocheuses : crêtes de collines rocheuses
      ctx.fillStyle = "#5c4f3a";
      ctx.beginPath();
      ctx.arc(px + s * 0.35, py + s * 0.55, s * 0.28, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = "#4a3f2e";
      ctx.beginPath();
      ctx.arc(px + s * 0.65, py + s * 0.60, s * 0.24, Math.PI, 0);
      ctx.fill();
    } else if (t.id === "mountain") {
      // Montagnes infranchissables : pics avec cimes blanches
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(px + s * 0.1, py + s * 0.85);
      ctx.lineTo(px + s * 0.45, py + s * 0.15);
      ctx.lineTo(px + s * 0.8, py + s * 0.85);
      ctx.closePath();
      ctx.fill();

      // Cime enneigée
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(px + s * 0.35, py + s * 0.35);
      ctx.lineTo(px + s * 0.45, py + s * 0.15);
      ctx.lineTo(px + s * 0.55, py + s * 0.35);
      ctx.closePath();
      ctx.fill();
    } else if (t.id === "river") {
      // Rivière : lignes de courant d'eau
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(px + 6, py + s * 0.4, s - 12, 2);
      ctx.fillRect(px + 12, py + s * 0.6, s - 20, 2);
    } else if (t.id === "ford") {
      // Gué de rivière : pierres de passage
      ctx.fillStyle = "#78716c";
      ctx.beginPath();
      ctx.arc(px + s * 0.3, py + s * 0.4, 4, 0, Math.PI * 2);
      ctx.arc(px + s * 0.5, py + s * 0.5, 4, 0, Math.PI * 2);
      ctx.arc(px + s * 0.7, py + s * 0.6, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.id === "deep_water") {
      // Mer et Océan : vaguelettes marines subtiles
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.5;
      const wOff = ((v * 7) % 18) * (s / 56);
      ctx.beginPath();
      ctx.arc(px + s * 0.35 + wOff, py + s * 0.45, 6 * this.scale, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px + s * 0.65 - wOff, py + s * 0.70, 7 * this.scale, Math.PI, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Rendu de chaque bataillon d'unité
  renderUnits(ctx, cellSize) {
    const units = this.engine.units;

    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const px = (u.x + u.offsetX) * cellSize;
      const py = (u.y + u.offsetY) * cellSize;
      const radius = Math.max(8, 11 * this.scale);

      const faction = this.engine.factions.get(u.factionId);
      const factionColor = faction ? faction.color : "#999999";
      const factionBorder = faction ? faction.border : "#ffffff";

      // 1. Cercle de sélection joueur
      if (u.isSelected) {
        ctx.strokeStyle = "#55FF55";
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.arc(px, py, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Socle d'unité de faction
      ctx.fillStyle = factionColor;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = factionBorder;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // 3. Dessin de l'insigne d'unité
      this.drawUnitInsignia(ctx, px, py, radius, u.type);

      // 4. Barre de vie (HP)
      if (u.hp < u.maxHp || u.isSelected) {
        const barW = Math.max(18, 24 * this.scale);
        const barH = Math.max(3, 4 * this.scale);
        const barX = px - barW / 2;
        const barY = py - radius - barH - 4;

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
    ctx.lineWidth = Math.max(1.5, 2.0 * this.scale);

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
      const arcElevation = Math.sin(p.progress * Math.PI) * Math.max(16, 26 * this.scale);

      ctx.fillStyle = "rgba(40, 30, 20, 0.35)";
      ctx.beginPath();
      ctx.ellipse(px, py, 4 * this.scale, 2.5 * this.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      const flyingY = py - arcElevation;

      if (p.isSiege) {
        ctx.fillStyle = "#4a453f";
        ctx.beginPath();
        ctx.arc(px, flyingY, 5 * this.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1a1612";
        ctx.stroke();
      } else {
        const angle = Math.atan2(p.targetY - p.fromY, p.targetX - p.fromX);
        const len = 8 * this.scale;

        ctx.strokeStyle = "#5a3a1a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px - Math.cos(angle) * len, flyingY - Math.sin(angle) * len);
        ctx.lineTo(px, flyingY);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, flyingY, 2, 0, Math.PI * 2);
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
        ctx.arc(px, py, (14 - ev.life) * 2.2 * this.scale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 2;
        const s = (14 - ev.life) * 1.5 * this.scale;
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

  drawCapitalIcon(ctx, px, py, s, cell) {
    const faction = this.engine.factions.get(cell.owner);
    const color = faction ? faction.border : "#ffffff";

    ctx.save();
    // Citadelle royale de capitale (château imposant avec créneaux et donjon)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(px + s * 0.15, py + s * 0.15, s * 0.7, s * 0.7);

    // Murailles biseautées
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(px + s * 0.15, py + s * 0.15, s * 0.7, s * 0.7);

    // Bannière royale
    ctx.fillStyle = color;
    ctx.fillRect(px + s * 0.35, py + s * 0.3, s * 0.3, s * 0.2);

    ctx.strokeStyle = "#fbbf24";
    ctx.strokeRect(px + s * 0.35, py + s * 0.3, s * 0.3, s * 0.2);
    ctx.restore();
  }

  drawInfraIcon(ctx, px, py, s, cell) {
    const type = cell.infrastructure;
    ctx.save();

    if (type === "farm") {
      ctx.fillStyle = "#78350f";
      ctx.fillRect(px + s * 0.2, py + s * 0.2, s * 0.6, s * 0.6);
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + s * 0.2, py + s * 0.2, s * 0.6, s * 0.6);
    } else if (type === "barracks") {
      ctx.fillStyle = "#881337";
      ctx.fillRect(px + s * 0.2, py + s * 0.2, s * 0.6, s * 0.6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(px + s * 0.42, py + s * 0.25, s * 0.16, s * 0.5);
    } else if (type === "outpost") {
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(px + s * 0.25, py + s * 0.25, s * 0.5, s * 0.5);
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + s * 0.25, py + s * 0.25, s * 0.5, s * 0.5);
    } else if (type === "watchtower") {
      ctx.fillStyle = "#334155";
      ctx.fillRect(px + s * 0.3, py + s * 0.15, s * 0.4, s * 0.7);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(px + s * 0.35, py + s * 0.2, s * 0.3, s * 0.15);
    } else if (type === "palisade") {
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 4, py + 4, s - 8, s - 8);
    } else if (type === "citadel") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(px + s * 0.15, py + s * 0.15, s * 0.7, s * 0.7);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + s * 0.15, py + s * 0.15, s * 0.7, s * 0.7);
    } else if (type === "lumber_camp") {
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(px + s * 0.25, py + s * 0.25, s * 0.5, s * 0.5);
      ctx.fillStyle = "#b45309";
      ctx.fillRect(px + s * 0.3, py + s * 0.4, s * 0.4, 4);
    } else if (type === "quarry") {
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(px + s * 0.2, py + s * 0.2, s * 0.6, s * 0.6);
      ctx.fillStyle = "#a1a1aa";
      ctx.fillRect(px + s * 0.35, py + s * 0.35, s * 0.3, s * 0.3);
    }

    ctx.restore();
  }

  drawHoverSectorHighlight(ctx, cell, cellSize) {
    const px = cell.x * cellSize;
    const py = cell.y * cellSize;

    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

    // Infobulle légère au-dessus du secteur survolé
    ctx.fillStyle = "rgba(20, 15, 10, 0.85)";
    const labelW = 120;
    const labelH = 22;
    ctx.fillRect(px + cellSize / 2 - labelW / 2, py - labelH - 4, labelW, labelH);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.strokeRect(px + cellSize / 2 - labelW / 2, py - labelH - 4, labelW, labelH);

    ctx.fillStyle = "#fef08a";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${cell.terrain.name}`, px + cellSize / 2, py - 9);
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
      r.radius += 1.4;
      r.alpha -= 0.045;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.orderRipples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = r.isAttack ? `rgba(239, 68, 68, ${r.alpha})` : `rgba(34, 197, 94, ${r.alpha})`;
      ctx.lineWidth = 2.5;
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
    const dpr = this.dpr || 1;
    const miniW = 170 * dpr;
    const miniH = 110 * dpr;
    const pad = 12 * dpr;
    const miniX = screenWidth - miniW - pad;
    const miniY = screenHeight - miniH - 128 * dpr;

    this.minimapBounds = { x: miniX, y: miniY, w: miniW, h: miniH };

    ctx.fillStyle = "#dec89b";
    ctx.fillRect(miniX, miniY, miniW, miniH);
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2 * dpr;
    ctx.strokeRect(miniX, miniY, miniW, miniH);

    const stepX = miniW / this.map.width;
    const stepY = miniH / this.map.height;

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const cell = this.map.getCell(x, y);
        if (cell) {
          ctx.fillStyle = cell.owner > 0
            ? (this.engine.factions.get(cell.owner)?.color || cell.terrain.color)
            : cell.terrain.color;
          ctx.fillRect(miniX + x * stepX, miniY + y * stepY, stepX + 0.5, stepY + 0.5);
        }
      }
    }

    this.engine.units.forEach((u) => {
      ctx.fillStyle = u.factionId === 1 ? "#55FF55" : "#FF5555";
      ctx.fillRect(miniX + u.x * stepX, miniY + u.y * stepY, 2.5, 2.5);
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

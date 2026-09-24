/**
 * Jerry's Nations: Frontline Realms - 60 FPS Canvas 2D Renderer
 * Rendu haute performance des territoires dynamiques, des frontières vivantes,
 * des mouvements de troupes, des effets d'affrontement et du cycle lumineux solaire.
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

    // Sélection d'assaut en cours (drag de troupes)
    this.dragAttackSource = null;
    this.dragAttackTarget = null;
    this.hoverCell = null;

    this.initCanvasSize();
    this.centerCameraOnPlayerCapital();
    this.setupEventListeners();
  }

  initCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.parentElement.clientWidth * dpr;
    this.canvas.height = this.canvas.parentElement.clientHeight * dpr;
    this.ctx.imageSmoothingEnabled = false; // Rendu pixel net
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

    // Déplacement de caméra (Pan)
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
        // Clic droit ou Shift + Clic gauche pour pan
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

    // Zoom molette centré sur le curseur
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

    // Clic pour attaquer
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  screenToWorldCell(screenX, screenY) {
    const cellSize = CONFIG.CELL_SIZE * this.scale;
    const worldX = Math.floor((screenX - this.offsetX) / cellSize);
    const worldY = Math.floor((screenY - this.offsetY) / cellSize);
    return this.map.getCell(worldX, worldY);
  }

  // Rendu de la boucle d'animation
  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cellSize = CONFIG.CELL_SIZE * this.scale;

    // 1. Fond sombre de base
    ctx.fillStyle = "#0c1017";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);

    // 2. Rendu de la grille et des territoires
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

        // Terrain de base
        ctx.fillStyle = cell.terrain.color;
        ctx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);

        // Revêtement territorial si possédé par une nation
        if (cell.owner > 0) {
          const faction = this.engine.factions.get(cell.owner);
          if (faction) {
            ctx.fillStyle = faction.color;
            ctx.globalAlpha = 0.65;
            ctx.fillRect(px, py, cellSize + 0.5, cellSize + 0.5);
            ctx.globalAlpha = 1.0;

            // Bordure lumineuse pour les frontières
            if (this.map.isBorderCell(x, y, cell.owner)) {
              ctx.strokeStyle = faction.border;
              ctx.lineWidth = Math.max(1, 2 * this.scale);
              ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
            }
          }
        }

        // Dessin des infrastructures (Fermes, Forteresses, Capitales)
        if (cell.isCapital) {
          this.drawCapitalIcon(ctx, px, py, cellSize, cell);
        } else if (cell.infrastructure) {
          this.drawInfraIcon(ctx, px, py, cellSize, cell.infrastructure);
        }
      }
    }

    // 3. Dessin des vagues d'attaque de troupes
    this.renderAttackWaves(ctx, cellSize);

    // 4. Dessin des affrontements et étincelles de combat
    this.renderCombatEvents(ctx, cellSize);

    // 5. Flèche d'assaut tactique en cours de tracé par le joueur
    if (this.dragAttackSource && this.dragAttackTarget) {
      this.drawAttackVector(ctx, this.dragAttackSource, this.dragAttackTarget, cellSize);
    }

    // 6. Surbrillance de la cellule survolée
    if (this.hoverCell) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        this.hoverCell.x * cellSize,
        this.hoverCell.y * cellSize,
        cellSize,
        cellSize
      );
    }

    ctx.restore();

    // 7. Ambiance lumineuse selon le cycle solaire Jour / Nuit
    this.renderDayNightAtmosphere(ctx, width, height);

    // 8. Mini-carte radar tactique
    this.renderMinimap(ctx, width, height);
  }

  drawCapitalIcon(ctx, px, py, cellSize, cell) {
    const cx = px + cellSize / 2;
    const cy = py + cellSize / 2;
    const r = cellSize * 0.45;

    ctx.fillStyle = "#f59e0b"; // Or impérial
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Symbole couronne / donjon
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
      ctx.fillStyle = "#eab308"; // Jaune épi de blé
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "citadel" || type === "watchtower") {
      ctx.fillStyle = "#64748b"; // Pierre fortifiée
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
      // Sphère d'énergie / troupe en marche
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(3, 5 * this.scale), 0, Math.PI * 2);
      ctx.fill();

      // Texte de troupe transportée
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
      ctx.fillStyle = "#ffdd44";
      ctx.lineWidth = 1.5;

      const spread = (25 - event.life) * 0.8 * this.scale;
      ctx.beginPath();
      ctx.arc(cx, cy, spread, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      if (event.life <= 0) {
        this.engine.combatEvents.splice(i, 1);
      }
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

    // Réticule d'assaut sur la cible
    ctx.setLineDash([]);
    ctx.strokeStyle = "#FF5555";
    ctx.beginPath();
    ctx.arc(tx, ty, cellSize * 0.6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  renderDayNightAtmosphere(ctx, width, height) {
    const dayProgress = this.engine.dayTimeSec / CONFIG.DAY_DURATION_SEC; // 0..1
    let overlayColor = null;

    if (dayProgress > 0.85 || dayProgress < 0.15) {
      // Nuit profonde bleutée
      overlayColor = "rgba(10, 20, 45, 0.35)";
    } else if (dayProgress >= 0.70 && dayProgress <= 0.85) {
      // Crépuscule orangé (Sunset)
      overlayColor = "rgba(180, 70, 20, 0.18)";
    } else if (dayProgress >= 0.15 && dayProgress <= 0.30) {
      // Aube dorée
      overlayColor = "rgba(230, 180, 50, 0.12)";
    }

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
    // Cadre ardoise
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.fillRect(miniX, miniY, miniW, miniH);
    ctx.strokeRect(miniX, miniY, miniW, miniH);

    // Dessiner les pixels des capitales et territoires
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

    // Rectangle du viewport de la caméra
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

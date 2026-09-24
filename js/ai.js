/**
 * Jerry's Nations: Frontline Realms - RTS AI Controller
 * Intelligence artificielle pour le Clan Maraudeur et les Seigneurs féodaux rivaux.
 * Recrutement autonome, manœuvres de régiments physiques, raids de pillards et construction d'avant-postes.
 */

import { CONFIG } from "./config.js";

export class AIController {
  constructor(engine, worldMap) {
    this.engine = engine;
    this.map = worldMap;
    this.aiTickCounter = 0;
  }

  update() {
    this.aiTickCounter++;
    const diffKey = (this.engine.aiDifficulty || "normal").toUpperCase();
    const diff = CONFIG.DIFFICULTIES[diffKey] || CONFIG.DIFFICULTIES.NORMAL;
    const interval = Math.max(10, Math.floor(30 * diff.intervalMultiplier));

    if (this.aiTickCounter % interval !== 0) return;

    this.engine.factions.forEach((faction) => {
      if (!faction.isAI || faction.isDefeated) return;

      this.processFactionTurn(faction, diff);
    });
  }

  processFactionTurn(faction, diff) {
    const fid = faction.id;
    const myUnits = this.engine.units.filter((u) => u.factionId === fid && u.hp > 0);

    // 1. DÉCISION DE RECRUTEMENT
    this.decideRecruitment(faction, myUnits, diff);

    // 2. DÉCISION DE CONSTRUCTION
    this.decideConstruction(faction, myUnits);

    // 3. COMMANDEMENT MILITAIRE DES UNITÉS INACTIVES
    this.commandUnits(faction, myUnits, diff);
  }

  decideRecruitment(faction, myUnits) {
    const fid = faction.id;
    if (myUnits.length >= 25) return; // Limite d'armée pour la performance

    const militaryCount = myUnits.filter((u) => u.attack > 0).length;
    const pioneerCount = myUnits.filter((u) => u.type === "pioneer").length;

    // Avoir au moins 1 ou 2 pionniers pour étendre le territoire
    if (pioneerCount < 2 && faction.food >= 30 && faction.wood >= 20) {
      this.engine.recruitUnit(fid, "pioneer");
      return;
    }

    // Choix selon la personnalité de la faction
    if (faction.personality === "aggressive") {
      // Maraudeurs : Priorité Cavaliers et Archers
      if (Math.random() < 0.4 && faction.gold >= 40 && faction.food >= 50) {
        this.engine.recruitUnit(fid, "cavalry");
      } else if (Math.random() < 0.5 && faction.wood >= 30 && faction.food >= 30) {
        this.engine.recruitUnit(fid, "archer");
      } else if (faction.stone >= 15 && faction.food >= 25) {
        this.engine.recruitUnit(fid, "militia");
      }
    } else {
      // Équilibré / Défensif
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

    // Ferme si manque de nourriture (Plaine obligatoire)
    if (faction.food < 40 && faction.wood >= 40 && faction.stone >= 10) {
      const plainCell = borders.find((c) => c.terrain.id === "plain" && !c.infrastructure);
      if (plainCell) {
        this.engine.buildInfrastructure(fid, plainCell.x, plainCell.y, "farm");
        return;
      }
    }

    // Scierie si besoin de bois (Forêt obligatoire)
    if (faction.wood < 60 && faction.wood >= 30 && faction.stone >= 10) {
      const forestCell = borders.find((c) => c.terrain.id === "forest" && !c.infrastructure);
      if (forestCell) {
        this.engine.buildInfrastructure(fid, forestCell.x, forestCell.y, "lumber_camp");
        return;
      }
    }

    // Carrière si besoin de pierre (Collines obligatoires)
    if (faction.stone < 50 && faction.wood >= 40 && faction.stone >= 20) {
      const hillsCell = borders.find((c) => c.terrain.id === "hills" && !c.infrastructure);
      if (hillsCell) {
        this.engine.buildInfrastructure(fid, hillsCell.x, hillsCell.y, "quarry");
        return;
      }
    }

    // Avant-poste pour étendre la frontière
    if (faction.wood >= 50 && faction.stone >= 30 && faction.gold >= 15 && Math.random() < 0.25) {
      const targetBorder = borders[Math.floor(Math.random() * borders.length)];
      if (targetBorder && !targetBorder.infrastructure && targetBorder.terrain.traversable) {
        this.engine.buildInfrastructure(fid, targetBorder.x, targetBorder.y, "outpost");
        return;
      }
    }

    // Tour de guet pour la défense
    if (faction.wood >= 60 && faction.stone >= 50 && Math.random() < 0.2) {
      const targetBorder = borders[Math.floor(Math.random() * borders.length)];
      if (targetBorder && !targetBorder.infrastructure && targetBorder.terrain.traversable) {
        this.engine.buildInfrastructure(fid, targetBorder.x, targetBorder.y, "watchtower");
      }
    }
  }

  commandUnits(faction, myUnits) {
    const fid = faction.id;
    const idleUnits = myUnits.filter((u) => u.state === "idle");
    if (idleUnits.length === 0) return;

    // A. Pionniers : chercher un secteur neutre fertile pour coloniser
    const idlePioneers = idleUnits.filter((u) => u.type === "pioneer");
    idlePioneers.forEach((p) => {
      const targetCell = this.findExpansionTarget(fid, p.x, p.y);
      if (targetCell) {
        p.moveTo(targetCell.x, targetCell.y);
      }
    });

    // B. Troupes militaires : patrouille ou raid offensif
    const idleMilitary = idleUnits.filter((u) => u.attack > 0);
    const minSquad = diff && diff.id === "peaceful" ? 6 : (diff && diff.id === "hard" ? 2 : 3);
    if (idleMilitary.length >= minSquad) {
      // Former une escouade d'assaut
      const targetEnemy = this.findEnemyTarget(fid, idleMilitary[0].x, idleMilitary[0].y, faction.personality === "aggressive", diff);
      if (targetEnemy) {
        idleMilitary.slice(0, 6).forEach((u, idx) => {
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

  findEnemyTarget(factionId, fromX, fromY, isAggressive, diff) {
    const isPeacefulPeriod = diff && diff.peacefulDays && this.engine.dayCount <= diff.peacefulDays;

    // 1. Chercher d'abord des unités ennemies proches (autodéfense)
    for (let i = 0; i < this.engine.units.length; i++) {
      const other = this.engine.units[i];
      if (other.factionId !== factionId && other.hp > 0) {
        if (isPeacefulPeriod && other.factionId === 1) continue;
        const d = Math.hypot(other.x - fromX, other.y - fromY);
        if (d < 16) {
          return { x: other.x, y: other.y };
        }
      }
    }

    if (isPeacefulPeriod) return null;

    // 2. Si agressif (ex: Maraudeurs), cibler la capitale du joueur ou une ville ennemie
    if (isAggressive) {
      const playerCap = this.map.capitals.find((c) => c.factionId === 1);
      if (playerCap && Math.random() < 0.6) {
        return { x: playerCap.x, y: playerCap.y };
      }
    }

    // 3. Cibler un avant-poste ou une frontière ennemie
    const enemyCapitals = this.map.capitals.filter((c) => c.factionId !== factionId);
    if (enemyCapitals.length > 0) {
      const randomCap = enemyCapitals[Math.floor(Math.random() * enemyCapitals.length)];
      return { x: randomCap.x, y: randomCap.y };
    }

    return null;
  }
}

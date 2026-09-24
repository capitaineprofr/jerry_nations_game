/**
 * Jerry's Nations: Frontline Realms - RTS Simulation Engine
 * Gestion physique des bataillons, tirs balistiques, défenses de tours/bastions,
 * logistique alimentaire (jn_food), Scoreboard Mood (-1000 à +1000) et 11 Stades de Jerry's Nations.
 */

import { CONFIG } from "./config.js";
import { SOUND } from "./audio.js";
import { Unit, Projectile } from "./units.js";

export class GameEngine {
  constructor(worldMap) {
    this.map = worldMap;
    this.tickCount = 0;
    this.dayTimeSec = 0;
    this.dayCount = 1;
    this.timeScale = 1; // 0 = Pause, 1 = Normal, 2 = x2, 5 = x5
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
        food: 120, // jn_food
        wood: 80,
        stone: 60,
        gold: 100,
        moodScore: 0, // Scoreboard jn_mood [-1000 à +1000]
        stageTier: 0, // Tier 0: settlement
        isDefeated: false,
        totalLosses: 0,
        totalKills: 0
      });
    });

    this.updateTerritoryCounts();
  }

  // Déploiement initial d'unités pour chaque faction
  spawnInitialArmies() {
    this.map.capitals.forEach((cap) => {
      const fid = cap.factionId;
      // 1 Pionnier, 3 Miliciens, 2 Archers
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

  // Recrutement actif par le joueur ou l'IA
  recruitUnit(factionId, typeKey) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    const proto = CONFIG.UNITS[typeKey.toUpperCase()];
    if (!proto) return false;

    // Vérifier les coûts en ressources
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

    // Trouver un point de spawn (Caserne ou Capitale)
    let spawnX = null;
    let spawnY = null;

    // Chercher une caserne de la faction
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

    // Déduction des ressources
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

  // Boucle de simulation à 20 Hz
  update() {
    if (this.isPaused || this.timeScale === 0) return;

    const iterations = this.timeScale;
    for (let it = 0; it < iterations; it++) {
      this.tickCount++;
      this.dayTimeSec += 1 / CONFIG.TICK_RATE;

      // 1. Mise à jour physique des unités
      this.updateUnits();

      // 2. Mise à jour des projectiles en vol
      this.updateProjectiles();

      // 3. Tir automatique des défenses statiques (Tours de guet, Bastions)
      if (this.tickCount % 15 === 0) {
        this.updateTowerDefenses();
      }

      // 4. Nettoyage des événements de combat
      this.updateCombatEvents();

      // 5. Production passive et économie (chaque seconde = 20 ticks)
      if (this.tickCount % CONFIG.TICK_RATE === 0) {
        this.updateEconomy();
        this.checkStageAdvancements();
      }

      // 6. Cycle Jour / Nuit & Banquet du Crépuscule (Sunset Food Consumption)
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

  // Tirs automatiques des tours de guet et bastions
  updateTowerDefenses() {
    for (let i = 0; i < this.map.grid.length; i++) {
      const cell = this.map.grid[i];
      if (!cell.infrastructure || cell.owner === 0) continue;

      const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
      if (!infra || !infra.range) continue;

      // Chercher une unité ennemie dans le rayon
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

  // Dégâts sur les bâtiments et infrastructures
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

  // Banquet du crépuscule (Logique authentique Jerry's Nations jn_food)
  executeSunsetBanquet() {
    SOUND.playSunsetBell();
    this.addLog(`§6[Crépuscule - Jour ${this.dayCount}] Le banquet de la nation commence...`);

    this.factions.forEach((f) => {
      if (f.isDefeated) return;

      const factionUnits = this.units.filter((u) => u.factionId === f.id);
      const foodRequired = Math.ceil(factionUnits.length * 2.5) + Math.ceil(f.territoryCount * 0.05);

      if (f.food >= foodRequired) {
        // Ravitaillement réussi
        f.food -= foodRequired;
        f.moodScore = Math.min(1000, f.moodScore + 40);
        if (f.isPlayer) {
          this.addLog(`§aBanquet réussi : ${foodRequired} rations consommées. Les troupes sont exaltées.`);
        }
      } else {
        // FAMINE MAJEURE !
        const shortfall = foodRequired - f.food;
        f.food = 0;
        const moodPenalty = Math.min(400, 120 + shortfall * 15);
        f.moodScore = Math.max(-1000, f.moodScore - moodPenalty);

        // Désertion / Attrition d'unités
        const desertedCount = Math.max(1, Math.floor(factionUnits.length * 0.25));
        for (let i = 0; i < desertedCount && factionUnits.length > 0; i++) {
          const deserted = factionUnits.pop();
          const uIdx = this.units.indexOf(deserted);
          if (uIdx !== -1) {
            this.units.splice(uIdx, 1);
          }
        }

        if (f.isPlayer) {
          this.addLog(`§c[FAMINE NATIONALE] Rupture de nourriture ! -${moodPenalty} Mood, ${desertedCount} bataillon(s) ont péri/déserté !`);
          SOUND.playRaidAlert();
        }
      }
    });
  }

  // Économie en continu
  updateEconomy() {
    this.factions.forEach((f) => {
      if (f.isDefeated) return;

      const moodConfig = this.getMoodState(f.moodScore);
      const moodBuff = moodConfig.speedBuff;

      // Production de base proportionnelle au territoire
      let foodProd = f.territoryCount * 0.08;
      let woodProd = 0.4;
      let stoneProd = 0.3;
      let goldProd = f.territoryCount * 0.10;

      // Bonus des infrastructures spécialisées
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

  // Construction d'infrastructure ou avant-poste
  buildInfrastructure(factionId, x, y, infraType) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    const cell = this.map.getCell(x, y);
    if (!cell || !cell.terrain.traversable) return false;

    const infra = CONFIG.INFRASTRUCTURES[infraType.toUpperCase()];
    if (!infra) return false;

    // Pour l'avant-poste, on peut coloniser en bordure ou terrain neutre
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

    // Si c'est un avant-poste, revendiquer un rayon de 3 cases
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

  // --- EXPÉDITIONS RAPIDES STRATÉGIQUES ---

  // 1. Expédition de Colonisation
  launchColonizationExpedition(factionId) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    // Trouver la cellule fertile neutre la plus proche de la frontière
    let bestCell = null;
    let bestScore = -9999;

    for (let i = 0; i < this.map.grid.length; i++) {
      const cell = this.map.grid[i];
      if (cell.owner === 0 && cell.terrain === CONFIG.TERRAIN.PLAIN) {
        // Vérifier la proximité d'une cellule de la faction
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

    // Trouver un pionnier et des gardes ou les recruter
    let pioneer = this.units.find((u) => u.factionId === factionId && u.type === "pioneer" && u.state === "idle");
    if (!pioneer) {
      pioneer = this.recruitUnit(factionId, "pioneer");
    }

    if (!pioneer) return false;

    // Envoyer le pionnier
    pioneer.moveTo(bestCell.x, bestCell.y);

    // Envoyer 2 miliciens en escorte si disponibles
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

  // 2. Ralliement Défensif
  rallyDefense(factionId) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    // Trouver où des ennemis attaquent nos unités ou nos bâtiments
    let threatenedX = null;
    let threatenedY = null;

    // Chercher la première menace
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

    // Si aucune menace immédiate, rallier à la capitale
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

  // 3. Assaut Coordonné
  launchCoordinatedAssault(factionId, targetFactionId = null) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    // Trouver la capitale ou l'avant-poste ennemi
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

  // Progression des 11 Stades de Jerry's Nations
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

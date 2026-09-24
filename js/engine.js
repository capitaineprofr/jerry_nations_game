/**
 * Jerry's Nations: Frontline Realms - Real-Time Simulation Engine
 * Résolution des combats de frontlines, logistique alimentaire (jn_food),
 * Scoreboard Mood (-1000 à +1000), 11 Stades de Jerry's Nations, et gestion des armées.
 */

import { CONFIG } from "./config.js";
import { SOUND } from "./audio.js";

export class GameEngine {
  constructor(worldMap) {
    this.map = worldMap;
    this.tickCount = 0;
    this.dayTimeSec = 0;
    this.dayCount = 1;
    this.timeScale = 1; // 0 = Pause, 1 = Normal, 2 = x2, 5 = x5
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
        troops: 80, // Troupes de réserve disponibles pour attaquer
        food: 120, // jn_food
        wood: 60,
        stone: 40,
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

  updateTerritoryCounts() {
    this.factions.forEach((f) => {
      f.territoryCount = this.map.countFactionTerritory(f.id);
      if (f.territoryCount === 0 && !f.isDefeated) {
        f.isDefeated = true;
        this.addLog(`§cLa faction ${f.name} a été totalement anéantie !`);
      }
    });
  }

  // Boucle de simulation appelée à 20 Hz
  update() {
    if (this.isPaused || this.timeScale === 0) return;

    const iterations = this.timeScale;
    for (let it = 0; it < iterations; it++) {
      this.tickCount++;
      this.dayTimeSec += 1 / CONFIG.TICK_RATE;

      // 1. Mise à jour des troupes et des vagues d'attaque
      this.updateAttackWaves();

      // 2. Production passive et économie (chaque seconde = 20 ticks)
      if (this.tickCount % CONFIG.TICK_RATE === 0) {
        this.updateEconomy();
        this.checkStageAdvancements();
      }

      // 3. Cycle Jour / Nuit & Repas du Crépuscule (Sunset Food Consumption)
      if (this.dayTimeSec >= CONFIG.DAY_DURATION_SEC) {
        this.dayTimeSec = 0;
        this.dayCount++;
        this.executeSunsetBanquet();
      }
    }
  }

  // Exécution du banquet du crépuscule (Logique authentique Jerry's Nations)
  executeSunsetBanquet() {
    SOUND.playSunsetBell();
    this.addLog(`§6[Crépuscule - Jour ${this.dayCount}] Le banquet de la nation commence...`);

    this.factions.forEach((f) => {
      if (f.isDefeated) return;

      const foodRequired = Math.ceil(f.troops / 15) + Math.ceil(f.population / 25);

      if (f.food >= foodRequired) {
        // Ravitaillement réussi
        f.food -= foodRequired;
        f.moodScore = Math.min(1000, f.moodScore + 35);
        if (f.isPlayer) {
          this.addLog(`§aBanquet réussi : ${foodRequired} rations consommées. Le moral s'élève.`);
        }
      } else {
        // FAMINE MAJEURE !
        const shortfall = foodRequired - f.food;
        f.food = 0;
        const moodPenalty = Math.min(350, 100 + shortfall * 10);
        f.moodScore = Math.max(-1000, f.moodScore - moodPenalty);

        // Pertes par désertion / faim
        const desertion = Math.ceil(f.troops * 0.08);
        f.troops = Math.max(5, f.troops - desertion);

        if (f.isPlayer) {
          this.addLog(`§c[FAMINE NATIONALE] Pénurie de nourriture ! -${moodPenalty} Mood, ${desertion} soldats ont déserté !`);
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

      // Croissance démographique et recrutement de troupes
      const territoryBonus = Math.sqrt(f.territoryCount) * 0.4;
      const troopGain = Math.max(1, Math.floor((1.5 + territoryBonus) * moodBuff));
      f.troops += troopGain;

      // Production de blé/pain (Nourriture)
      let foodProd = f.territoryCount * 0.15;
      let woodProd = 0.5;
      let stoneProd = 0.3;
      let goldProd = f.territoryCount * 0.12;

      // Bonus des infrastructures
      for (let i = 0; i < this.map.grid.length; i++) {
        const cell = this.map.grid[i];
        if (cell.owner === f.id && cell.infrastructure) {
          const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
          if (infra) {
            if (infra.foodBonus) foodProd += infra.foodBonus;
          }
        }
      }

      f.food = Math.floor(f.food + foodProd);
      f.wood = Math.floor(f.wood + woodProd);
      f.stone = Math.floor(f.stone + stoneProd);
      f.gold = Math.floor(f.gold + goldProd);
    });
  }

  // Lancement d'un assaut de frontières (façon OpenFront / Territorial.io)
  launchAttack(attackerId, fromX, fromY, targetX, targetY, troopPercent) {
    const faction = this.factions.get(attackerId);
    if (!faction || faction.isDefeated) return false;

    const fromCell = this.map.getCell(fromX, fromY);
    const targetCell = this.map.getCell(targetX, targetY);

    if (!fromCell || !targetCell) return false;
    if (fromCell.owner !== attackerId) return false;
    if (targetCell.owner === attackerId) return false;
    if (!targetCell.terrain.traversable) return false;

    // Calcul du contingent à engager
    const troopsToCommit = Math.max(3, Math.floor(faction.troops * (troopPercent / 100)));
    if (faction.troops < troopsToCommit) return false;

    faction.troops -= troopsToCommit;

    // Calcul de la vitesse de la troupe (affectée par le Mood)
    const moodState = this.getMoodState(faction.moodScore);
    const baseSpeed = 1.6 * moodState.speedBuff;

    const wave = {
      id: Math.random().toString(36).substring(2, 9),
      attackerId,
      fromX,
      fromY,
      currentX: fromX,
      currentY: fromY,
      targetX,
      targetY,
      totalTroops: troopsToCommit,
      currentTroops: troopsToCommit,
      speed: baseSpeed,
      progress: 0
    };

    this.attackWaves.push(wave);

    if (attackerId === 1) {
      SOUND.playCharge();
    }

    return true;
  }

  // Déplacement et résolution des combats de frontières
  updateAttackWaves() {
    for (let i = this.attackWaves.length - 1; i >= 0; i--) {
      const wave = this.attackWaves[i];
      const distTotal = Math.hypot(wave.targetX - wave.fromX, wave.targetY - wave.fromY) || 1;

      wave.progress += (wave.speed / distTotal) * 0.15;
      wave.currentX = wave.fromX + (wave.targetX - wave.fromX) * Math.min(1, wave.progress);
      wave.currentY = wave.fromY + (wave.targetY - wave.fromY) * Math.min(1, wave.progress);

      // La vague a atteint la frontière ennemie / sauvage
      if (wave.progress >= 1.0) {
        this.resolveFrontlineClash(wave);
        this.attackWaves.splice(i, 1);
      }
    }
  }

  // Résolution du combat au point d'impact
  resolveFrontlineClash(wave) {
    const targetCell = this.map.getCell(wave.targetX, wave.targetY);
    if (!targetCell) return;

    const attacker = this.factions.get(wave.attackerId);
    const defenderId = targetCell.owner;
    const defender = this.factions.get(defenderId);

    // Multiplicateurs de combat
    const attMood = attacker ? this.getMoodState(attacker.moodScore).combatBuff : 1;
    let defBonus = targetCell.terrain.defenseBonus || 0;

    // Bonus d'infrastructure
    if (targetCell.infrastructure) {
      const infra = CONFIG.INFRASTRUCTURES[targetCell.infrastructure.toUpperCase()];
      if (infra && infra.defenseBonus) {
        defBonus += infra.defenseBonus;
      }
    }

    const attackPower = wave.currentTroops * attMood;
    const defensePower = (targetCell.troops || 2) * (1 + defBonus);

    // Événement d'étincelles/combat visuel pour le renderer
    this.combatEvents.push({
      x: targetCell.x,
      y: targetCell.y,
      life: 25,
      attackerId: wave.attackerId,
      defenderId
    });

    if (wave.attackerId === 1 || defenderId === 1) {
      SOUND.playClash();
    }

    if (attackPower > defensePower) {
      // VICTOIRE DE L'ATTAQUANT : Prise du territoire
      const remainingTroops = Math.max(1, Math.floor((attackPower - defensePower) / attMood));

      // Notification si la capitale tombe
      if (targetCell.isCapital && defender) {
        this.addLog(`§c[CAPITALE CAPTURÉE] ${attacker.name} s'est emparé de la capitale de ${defender.name} !`);
        SOUND.playRaidAlert();
        targetCell.isCapital = false;
        attacker.moodScore = Math.min(1000, attacker.moodScore + 200);
        defender.moodScore = Math.max(-1000, defender.moodScore - 400);
      }

      targetCell.owner = wave.attackerId;
      targetCell.troops = remainingTroops;
      targetCell.infrastructure = null; // Les défenses sont détruites lors de l'assaut

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
      // DÉFENSEUR REPOUSSE L'ASSAUT
      const survivingDefenders = Math.max(1, Math.floor((defensePower - attackPower) / (1 + defBonus)));
      targetCell.troops = survivingDefenders;

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

  // Vérification de la promotion parmi les 11 Stades de Jerry's Nations
  checkStageAdvancements() {
    this.factions.forEach((f) => {
      if (f.isDefeated) return;

      const currentStage = CONFIG.STAGES[f.stageTier];
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

  // Construction d'infrastructure sur une cellule
  buildInfrastructure(factionId, x, y, infraType) {
    const faction = this.factions.get(factionId);
    if (!faction || faction.isDefeated) return false;

    const cell = this.map.getCell(x, y);
    if (!cell || cell.owner !== factionId) return false;
    if (cell.infrastructure) return false;

    const infra = CONFIG.INFRASTRUCTURES[infraType.toUpperCase()];
    if (!infra) return false;

    const woodCost = infra.woodCost || 0;
    const stoneCost = infra.stoneCost || 0;
    const goldCost = infra.goldCost || 0;

    if (faction.wood < woodCost || faction.stone < stoneCost || faction.gold < goldCost) {
      return false;
    }

    faction.wood -= woodCost;
    faction.stone -= stoneCost;
    faction.gold -= goldCost;

    cell.infrastructure = infra.id;
    if (infra.id === "citadel" || infra.id === "palisade") {
      cell.troops += 20;
    }

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
    if (this.logMessages.length > 40) {
      this.logMessages.pop();
    }
  }
}

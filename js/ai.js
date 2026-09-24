/**
 * Jerry's Nations: Frontline Realms - AI Faction Controller
 * Intelligence artificielle pour le Clan Maraudeur et les Seigneurs féodaux rivaux.
 */

export class AIController {
  constructor(engine, worldMap) {
    this.engine = engine;
    this.map = worldMap;
    this.aiTickCounter = 0;
  }

  update() {
    this.aiTickCounter++;
    // Exécuter l'IA toutes les 25 ticks (environ 1.25 seconde)
    if (this.aiTickCounter % 25 !== 0) return;

    this.engine.factions.forEach((faction) => {
      if (!faction.isAI || faction.isDefeated) return;

      this.processFactionTurn(faction);
    });
  }

  processFactionTurn(faction) {
    // Si la réserve de troupes est trop faible, conserver pour la défense
    if (faction.troops < 25) return;

    const borders = this.map.getBorderCells(faction.id);
    if (borders.length === 0) return;

    // 1. Choix du pourcentage de troupes à engager selon la personnalité
    let commitPercent = 25;
    if (faction.personality === "aggressive") {
      commitPercent = 45;
    } else if (faction.personality === "expansionist") {
      commitPercent = 35;
    } else if (faction.personality === "defensive") {
      commitPercent = 20;
    }

    // 2. Sélection intelligente de la cible
    let bestSource = null;
    let bestTarget = null;
    let bestScore = -999;

    // Évaluer un échantillon de cellules frontalières pour la performance
    const sampleSize = Math.min(borders.length, 12);
    for (let i = 0; i < sampleSize; i++) {
      const source = borders[Math.floor(Math.random() * borders.length)];
      const neighbors = this.map.getNeighbors(source.x, source.y);

      for (const target of neighbors) {
        if (target.owner === faction.id || !target.terrain.traversable) continue;

        let score = 0;

        // Terres sauvages faciles à conquérir
        if (target.owner === 0) {
          score += 50 - (target.troops || 0);
          if (target.terrain.foodYield) score += 20; // Privilégier les plaines fertiles
        } else {
          // Attaque sur une nation rivale ou le joueur
          const defender = this.engine.factions.get(target.owner);
          if (defender) {
            // Maraudeur attaque agressivement les voisins
            if (faction.personality === "aggressive") {
              score += 40;
            }
            // Cibler les cellules peu défendues
            score += Math.max(0, 40 - (target.troops || 0));
            // Cibler la capitale pour un coup d'éclat
            if (target.isCapital) score += 80;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestSource = source;
          bestTarget = target;
        }
      }
    }

    // 3. Lancer l'assaut
    if (bestSource && bestTarget && bestScore > 0) {
      this.engine.launchAttack(
        faction.id,
        bestSource.x,
        bestSource.y,
        bestTarget.x,
        bestTarget.y,
        commitPercent
      );
    }

    // 4. Décision de construction d'infrastructure
    if (faction.wood >= 60 && faction.stone >= 50 && Math.random() < 0.2) {
      const buildCell = borders[Math.floor(Math.random() * borders.length)];
      if (buildCell && !buildCell.infrastructure) {
        const infraType = faction.personality === "defensive" ? "palisade" : "farm";
        this.engine.buildInfrastructure(faction.id, buildCell.x, buildCell.y, infraType);
      }
    }
  }
}

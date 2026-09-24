/**
 * Jerry's Nations: Frontline Realms - Real-Time Physical Units & Projectiles Engine
 * Système de bataillons physiques (Pionniers, Milice, Archers, Cavalerie, Trébuchets).
 * Déplacement libre, combats au corps-à-corps et tirs balistiques à distance.
 */

import { CONFIG } from "./config.js";
import { SOUND } from "./audio.js";

export class Projectile {
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
    this.speed = isSiege ? 0.16 : 0.32; // vitesse par tick
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
      return false; // Supprimer le projectile
    }
    return true; // Continuer le vol
  }

  hit(engine) {
    if (this.targetUnit && this.targetUnit.hp > 0) {
      this.targetUnit.takeDamage(this.damage, this.attackerId, engine);
    } else {
      // Dégât de zone ou sur infrastructure
      const targetCell = engine.map.getCell(Math.round(this.targetX), Math.round(this.targetY));
      if (targetCell && targetCell.infrastructure && targetCell.owner !== this.attackerId) {
        const mult = this.isSiege ? 3.5 : 1.0;
        engine.damageInfrastructure(targetCell, this.damage * mult, this.attackerId);
      }
    }

    // Effet d'impact visuel
    engine.combatEvents.push({
      x: this.targetX,
      y: this.targetY,
      life: 14,
      attackerId: this.attackerId,
      type: this.isSiege ? "explosion" : "spark"
    });
  }
}

export class Unit {
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
    this.targetCell = null;

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

    this.state = "idle"; // "idle", "moving", "attacking", "building"
    this.attackCooldown = 0;
    this.isSelected = false;

    // Dérive de micro-position pour éviter la superposition exacte
    this.offsetX = (Math.random() - 0.5) * 0.35;
    this.offsetY = (Math.random() - 0.5) * 0.35;
  }

  moveTo(cellX, cellY) {
    this.targetX = cellX + 0.5;
    this.targetY = cellY + 0.5;
    this.targetUnit = null;
    this.targetCell = null;
    this.state = "moving";
    this.hasCharged = false;
  }

  attackTarget(targetUnit) {
    if (!targetUnit || targetUnit.hp <= 0 || targetUnit.factionId === this.factionId) return;
    this.targetUnit = targetUnit;
    this.targetCell = null;
    this.targetX = targetUnit.x;
    this.targetY = targetUnit.y;
    this.state = "attacking";
  }

  update(engine) {
    if (this.hp <= 0) return false;

    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }

    // Récupérer le bonus/malus du scoreboard de Mood de la faction
    const faction = engine.factions.get(this.factionId);
    const moodBuff = faction ? engine.getMoodState(faction.moodScore).speedBuff : 1.0;
    const combatBuff = faction ? engine.getMoodState(faction.moodScore).combatBuff : 1.0;

    // 1. Ciblage d'unité ennemie active
    if (this.targetUnit) {
      if (this.targetUnit.hp <= 0) {
        this.targetUnit = null;
        this.state = "idle";
      } else {
        const dist = Math.hypot(this.targetUnit.x - this.x, this.targetUnit.y - this.y);

        if (dist <= this.range) {
          // À portée : attaquer !
          this.performAttack(this.targetUnit, engine, combatBuff);
          return true;
        } else {
          // Hors de portée : s'approcher de l'ennemi
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

    // 3. Unité inactive (Idle) : auto-détection des cibles ennemies proches (Rayon d'Aggro)
    if (this.state === "idle" && this.attack > 0) {
      this.scanForNearbyEnemies(engine);
    }

    // 4. Capture territoriale continue si stationnée dans une zone
    if (this.state === "idle") {
      this.claimCurrentCell(engine);
    }

    return true;
  }

  stepTowards(tx, ty, moveSpeed, engine) {
    const angle = Math.atan2(ty - this.y, tx - this.x);
    const nextX = this.x + Math.cos(angle) * moveSpeed;
    const nextY = this.y + Math.sin(angle) * moveSpeed;

    // Vérifier franchissement du terrain
    const cell = engine.map.getCell(Math.floor(nextX), Math.floor(nextY));
    if (cell && cell.terrain.traversable) {
      this.x = nextX;
      this.y = nextY;
    } else {
      // Contournement léger
      this.x += Math.cos(angle + Math.PI / 4) * (moveSpeed * 0.5);
      this.y += Math.sin(angle + Math.PI / 4) * (moveSpeed * 0.5);
    }
  }

  performAttack(target, engine, combatBuff) {
    if (this.attackCooldown > 0) return;

    this.attackCooldown = this.isRanged ? 24 : 16; // Ticks entre attaques (20 ticks = 1 sec)

    let dmg = this.attack * combatBuff;
    if (this.chargeBonus > 1.0 && !this.hasCharged) {
      dmg *= this.chargeBonus;
      this.hasCharged = true;
    }

    if (this.isRanged) {
      // Lancer un projectile balistique
      const isSiege = this.type === "siege";
      const proj = new Projectile(this.factionId, this.x, this.y, target.x, target.y, dmg, target, isSiege);
      engine.projectiles.push(proj);

      if (this.factionId === 1 || target.factionId === 1) {
        SOUND.playCharge();
      }
    } else {
      // Attaque au corps à corps directe
      target.takeDamage(dmg, this.factionId, engine);
      if (this.factionId === 1 || target.factionId === 1) {
        SOUND.playClash();
      }
    }
  }

  takeDamage(amount, attackerId, engine) {
    const netDamage = Math.max(2, Math.floor(amount - this.defense));
    this.hp -= netDamage;

    // Événement visuel
    engine.combatEvents.push({
      x: this.x,
      y: this.y,
      life: 12,
      attackerId,
      type: "slash"
    });

    // Auto-riposte si la cible n'en a pas
    if (!this.targetUnit && this.attack > 0) {
      const attackerUnit = engine.units.find((u) => u.id === attackerId || (u.factionId === attackerId && Math.hypot(u.x - this.x, u.y - this.y) <= this.range * 1.5));
      if (attackerUnit) {
        this.attackTarget(attackerUnit);
      }
    }

    // Mort de l'unité
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
      // Si la case n'a pas d'infrastructure ennemie ou si l'unité est capable de pacifier
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

    if (cell && cell.terrain.traversable) {
      // Revendiquer la cellule
      if (cell.owner !== this.factionId && !cell.infrastructure) {
        cell.owner = this.factionId;
        engine.updateTerritoryCounts();
      }
    }
  }
}

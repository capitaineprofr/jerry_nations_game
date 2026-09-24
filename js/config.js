/**
 * Jerry's Nations: Frontline Realms - Configuration & Game Constants
 * Conforme au Lore & Systèmes officiels de Jerry's Nations (Bedrock Addon)
 * Règle stricte : ZÉRO emoji, codes couleurs Bedrock purs (§a, §c, §e, §6, §b, §7).
 */

export const CONFIG = {
  VERSION: "2.1.0",
  TICK_RATE: 20, // 20 ticks par seconde (simulation)
  MAP_WIDTH: 72, // Largeur de la grille territoriale en secteurs
  MAP_HEIGHT: 48, // Hauteur de la grille territoriale en secteurs
  CELL_SIZE: 56, // Taille d'affichage de chaque secteur en pixels (quadrillage visible)

  // Échelle de temps
  DAY_DURATION_SEC: 50, // Durée d'une journée complète in-game

  // Scoreboard National Mood [-1000 à +1000]
  MOOD: {
    GOLDEN_AGE: { min: 750, max: 1000, key: "golden_age", name: "Âge d'Or", color: "§a", speedBuff: 1.30, combatBuff: 1.25 },
    PROSPEROUS: { min: 250, max: 749, key: "prosperous", name: "Prospère", color: "§2", speedBuff: 1.15, combatBuff: 1.10 },
    STABLE:     { min: -249, max: 249, key: "stable", name: "Stable", color: "§7", speedBuff: 1.00, combatBuff: 1.00 },
    UNHAPPY:    { min: -749, max: -250, key: "unhappy", name: "Mécontente", color: "§6", speedBuff: 0.75, combatBuff: 0.80 },
    REVOLT:     { min: -1000, max: -750, key: "revolt", name: "En Révolte", color: "§c", speedBuff: 0.50, combatBuff: 0.60 }
  },

  // Hiérarchie des 11 Stades de Nation (Tiers 0 à 10)
  STAGES: [
    { tier: 0, id: "settlement", name: "Campement", reqPop: 10, reqTerritory: 12, reqGold: 0, maxCities: 1, color: "§7" },
    { tier: 1, id: "union", name: "Union", reqPop: 35, reqTerritory: 30, reqGold: 50, maxCities: 1, color: "§f" },
    { tier: 2, id: "commonwealth", name: "Commonwealth", reqPop: 80, reqTerritory: 65, reqGold: 150, maxCities: 1, color: "§e" },
    { tier: 3, id: "state", name: "État", reqPop: 150, reqTerritory: 120, reqGold: 350, maxCities: 2, color: "§6" },
    { tier: 4, id: "developing_state", name: "État en Dév.", reqPop: 260, reqTerritory: 200, reqGold: 700, maxCities: 2, color: "§b" },
    { tier: 5, id: "advanced_state", name: "État Avancé", reqPop: 420, reqTerritory: 320, reqGold: 1200, maxCities: 3, color: "§9" },
    { tier: 6, id: "nation", name: "Nation", reqPop: 650, reqTerritory: 500, reqGold: 2000, maxCities: 5, color: "§2" },
    { tier: 7, id: "rising_nation", name: "Nation Émergente", reqPop: 950, reqTerritory: 750, reqGold: 3200, maxCities: 6, color: "§a" },
    { tier: 8, id: "established_nation", name: "Nation Établie", reqPop: 1400, reqTerritory: 1100, reqGold: 5000, maxCities: 8, color: "§d" },
    { tier: 9, id: "great_nation", name: "Grande Nation", reqPop: 2000, reqTerritory: 1600, reqGold: 8000, maxCities: 10, color: "§5" },
    { tier: 10, id: "superpower_nation", name: "Superpuissance", reqPop: 3000, reqTerritory: 2400, reqGold: 13000, maxCities: 12, color: "§c" }
  ],

  // Types de terrains / Biomes avec impact stratégique sur le gameplay
  TERRAIN: {
    DEEP_WATER: {
      id: "deep_water",
      name: "Mer Parchemin",
      color: "#385868",
      traversable: false,
      desc: "Océan et eaux profondes infranchissables"
    },
    RIVER: {
      id: "river",
      name: "Rivière Fluviale",
      color: "#4e7b8f",
      traversable: false,
      desc: "Obstacle naturel infranchissable à pied"
    },
    FORD: {
      id: "ford",
      name: "Gué Fluvial",
      color: "#8ca89c",
      traversable: true,
      moveCost: 1.8,
      defenseBonus: -0.15,
      desc: "Point de passage stratégique à pied"
    },
    PLAIN: {
      id: "plain",
      name: "Plaine Arable",
      color: "#60804b",
      traversable: true,
      moveCost: 1.0,
      baseFood: 1.5,
      cavalrySpeedBonus: 1.20,
      allowsFarm: true,
      desc: "Terres fertiles idéales pour les Fermes et la Cavalerie"
    },
    FOREST: {
      id: "forest",
      name: "Forêt Dense",
      color: "#355428",
      traversable: true,
      moveCost: 1.3,
      baseWood: 1.8,
      defenseBonus: 0.30,
      cavalrySpeedPenalty: 0.65,
      allowsLumberCamp: true,
      desc: "Abondance de Bois, couverture défensive pour l'infanterie"
    },
    HILLS: {
      id: "hills",
      name: "Collines Rocheuses",
      color: "#847458",
      traversable: true,
      moveCost: 1.5,
      baseStone: 1.6,
      baseGold: 0.8,
      defenseBonus: 0.45,
      archerRangeBonus: 1.0,
      allowsQuarry: true,
      desc: "Gisements de Pierre et Or, surplomb pour les Archers"
    },
    MOUNTAIN: {
      id: "mountain",
      name: "Pics Montagneux",
      color: "#9f9380",
      traversable: false,
      desc: "Rempart rocheux naturel infranchissable"
    }
  },

  // Classes de Bataillons et Unités physiques RTS
  UNITS: {
    PIONEER: {
      id: "pioneer",
      name: "Pionnier",
      desc: "Fonde des avant-postes et bâtit les infrastructures",
      foodCost: 30,
      woodCost: 20,
      stoneCost: 0,
      goldCost: 0,
      hp: 70,
      speed: 0.08,
      attack: 0,
      range: 1.0,
      defense: 1,
      canBuild: true,
      canClaim: true,
      icon: "hammer"
    },
    MILITIA: {
      id: "militia",
      name: "Milicien",
      desc: "Infanterie d'épée robuste pour tenir les lignes",
      foodCost: 25,
      woodCost: 0,
      stoneCost: 15,
      goldCost: 0,
      hp: 140,
      speed: 0.07,
      attack: 16,
      range: 1.1,
      defense: 3,
      icon: "sword"
    },
    ARCHER: {
      id: "archer",
      name: "Archer",
      desc: "Tirs de flèches à distance percutants",
      foodCost: 30,
      woodCost: 30,
      stoneCost: 0,
      goldCost: 0,
      hp: 85,
      speed: 0.075,
      attack: 18,
      range: 4.8,
      defense: 1,
      isRanged: true,
      icon: "bow"
    },
    CAVALRY: {
      id: "cavalry",
      name: "Cavalier",
      desc: "Cavalerie très rapide pour charger et harceler",
      foodCost: 50,
      woodCost: 10,
      stoneCost: 0,
      goldCost: 40,
      hp: 180,
      speed: 0.125,
      attack: 26,
      range: 1.2,
      defense: 4,
      chargeBonus: 1.5,
      icon: "horse"
    },
    SIEGE: {
      id: "siege",
      name: "Trébuchet",
      desc: "Engin lourd pour démolir les bastions ennemis",
      foodCost: 0,
      woodCost: 80,
      stoneCost: 60,
      goldCost: 50,
      hp: 220,
      speed: 0.045,
      attack: 55,
      range: 6.2,
      defense: 2,
      isRanged: true,
      vsBuildingMultiplier: 3.5,
      icon: "trebuchet"
    }
  },

  // Factions prédéfinies
  FACTIONS: [
    { id: 1, name: "Empire d'Émeraude", color: "#249278", border: "#55FF55", textCode: "§a", isPlayer: true, isAI: false },
    { id: 2, name: "Clan Maraudeur", color: "#8a2424", border: "#FF5555", textCode: "§c", isPlayer: false, isAI: true, personality: "aggressive" },
    { id: 3, name: "Ordre Solaire", color: "#b8860b", border: "#FFFF55", textCode: "§e", isPlayer: false, isAI: true, personality: "expansionist" },
    { id: 4, name: "Confédération Royale", color: "#2255aa", border: "#55FFFF", textCode: "§b", isPlayer: false, isAI: true, personality: "defensive" },
    { id: 5, name: "Guilde d'Améthyste", color: "#6a2d9c", border: "#FF55FF", textCode: "§d", isPlayer: false, isAI: true, personality: "balanced" }
  ],

  // Bâtiments & Infrastructures de territoire
  INFRASTRUCTURES: {
    FARM: { id: "farm", name: "Ferme", allowedTerrain: ["plain"], woodCost: 40, stoneCost: 10, foodBonus: 5.0, hp: 150, icon: "farm", desc: "Produit des récoltes abondantes de Pain (Plaine obligatoire)" },
    BARRACKS: { id: "barracks", name: "Caserne d'Armes", allowedTerrain: ["plain", "forest", "hills"], woodCost: 60, stoneCost: 35, goldCost: 20, hp: 250, icon: "barracks", desc: "Centre d'entraînement militaire" },
    OUTPOST: { id: "outpost", name: "Avant-poste", allowedTerrain: ["plain", "forest", "hills"], woodCost: 50, stoneCost: 30, goldCost: 15, territoryRadius: 2, defenseBonus: 0.35, hp: 300, icon: "flag", desc: "Revendique et stabilise les secteurs voisins" },
    LUMBER_CAMP: { id: "lumber_camp", name: "Scierie", allowedTerrain: ["forest"], woodCost: 30, stoneCost: 10, woodBonus: 4.5, hp: 120, icon: "axe", desc: "Exploitation forestière intensive de Bois (Forêt obligatoire)" },
    QUARRY: { id: "quarry", name: "Carrière de Pierre", allowedTerrain: ["hills"], woodCost: 40, stoneCost: 20, stoneBonus: 3.5, goldBonus: 1.5, hp: 140, icon: "pickaxe", desc: "Extraction de Pierre et filons d'Or (Collines obligatoires)" },
    PALISADE: { id: "palisade", name: "Palissade", allowedTerrain: ["plain", "forest", "hills"], woodCost: 25, stoneCost: 10, defenseBonus: 0.45, hp: 180, icon: "shield", desc: "Barricade défensive" },
    WATCHTOWER: { id: "watchtower", name: "Tour de Guet", allowedTerrain: ["plain", "forest", "hills"], woodCost: 60, stoneCost: 50, defenseBonus: 0.80, range: 3.5, attackDamage: 14, hp: 220, icon: "tower", desc: "Tirs de flèches automatiques (portée accrue sur Collines)" },
    CITADEL: { id: "citadel", name: "Bastion Impérial", allowedTerrain: ["plain", "hills"], woodCost: 150, stoneCost: 200, goldCost: 100, defenseBonus: 1.50, range: 5.0, attackDamage: 28, hp: 600, icon: "fortress", desc: "Citadelle souveraine imprenable" }
  },

  // Couleurs textuelles Minecraft adaptées au parchemin (dialogue_box.png)
  MC_COLORS: {
    "§0": "#000000",
    "§1": "#1e3a8a",
    "§2": "#15803d",
    "§3": "#0284c7",
    "§4": "#991b1b",
    "§5": "#7e22ce",
    "§6": "#b45309",
    "§7": "#57534e",
    "§8": "#292524",
    "§9": "#1d4ed8",
    "§a": "#15803d",
    "§b": "#0369a1",
    "§c": "#b91c1c",
    "§d": "#a21caf",
    "§e": "#854d0e",
    "§f": "#1c1917"
  },

  // Options de personnalisation de la Nation du joueur
  BANNER_PRESETS: [
    { id: "emerald", name: "Émeraude", color: "#1b7a63", border: "#22c55e", textCode: "§a" },
    { id: "ruby",    name: "Rubis",    color: "#8a2424", border: "#ef4444", textCode: "§c" },
    { id: "sapphire",name: "Saphir",   color: "#1d4ed8", border: "#06b6d4", textCode: "§b" },
    { id: "amethyst",name: "Améthyste",color: "#6a2d9c", border: "#a855f7", textCode: "§d" },
    { id: "amber",   name: "Ambre Or", color: "#b8860b", border: "#eab308", textCode: "§e" }
  ],

  // Modes de Jeu
  GAME_MODES: {
    STANDARD: { id: "standard", name: "Conquête Standard", startingFood: 150, startingWood: 100, startingStone: 75, startingGold: 100, freeBuild: false },
    SANDBOX:  { id: "sandbox",  name: "Bac à Sable",       startingFood: 99999, startingWood: 99999, startingStone: 99999, startingGold: 99999, freeBuild: true }
  },

  // Difficulté des Bots
  DIFFICULTIES: {
    PEACEFUL: { id: "peaceful", name: "Paisible", intervalMultiplier: 1.8, aggression: 0.2, peacefulDays: 10 },
    NORMAL:   { id: "normal",   name: "Équilibré", intervalMultiplier: 1.0, aggression: 0.6, peacefulDays: 3 },
    HARD:     { id: "hard",     name: "Implacable", intervalMultiplier: 0.65, aggression: 1.0, peacefulDays: 0 }
  }
};


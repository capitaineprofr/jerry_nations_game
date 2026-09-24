/**
 * Jerry's Nations: Frontline Realms - Configuration & Game Constants
 * Conforme au Lore & Systèmes officiels de Jerry's Nations (Bedrock Addon)
 * Règle stricte : ZÉRO emoji, codes couleurs Bedrock purs (§a, §c, §e, §6, §b, §7).
 */

export const CONFIG = {
  VERSION: "1.0.0",
  TICK_RATE: 20, // 20 ticks par seconde (simulation)
  MAP_WIDTH: 140, // Largeur de la grille territoriale
  MAP_HEIGHT: 90, // Hauteur de la grille territoriale
  CELL_SIZE: 12, // Taille d'affichage de base en pixels

  // Échelle de temps
  DAY_DURATION_SEC: 45, // Durée d'une journée complète in-game

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
    { tier: 0, id: "settlement", name: "Campement", reqPop: 10, reqTerritory: 20, reqGold: 0, maxCities: 1, color: "§7" },
    { tier: 1, id: "union", name: "Union", reqPop: 35, reqTerritory: 60, reqGold: 50, maxCities: 1, color: "§f" },
    { tier: 2, id: "commonwealth", name: "Commonwealth", reqPop: 80, reqTerritory: 140, reqGold: 150, maxCities: 1, color: "§e" },
    { tier: 3, id: "state", name: "État", reqPop: 150, reqTerritory: 260, reqGold: 350, maxCities: 2, color: "§6" },
    { tier: 4, id: "developing_state", name: "État en Dév.", reqPop: 260, reqTerritory: 450, reqGold: 700, maxCities: 2, color: "§b" },
    { tier: 5, id: "advanced_state", name: "État Avancé", reqPop: 420, reqTerritory: 750, reqGold: 1200, maxCities: 3, color: "§9" },
    { tier: 6, id: "nation", name: "Nation", reqPop: 650, reqTerritory: 1200, reqGold: 2000, maxCities: 5, color: "§2" },
    { tier: 7, id: "rising_nation", name: "Nation Émergente", reqPop: 950, reqTerritory: 1800, reqGold: 3200, maxCities: 6, color: "§a" },
    { tier: 8, id: "established_nation", name: "Nation Établie", reqPop: 1400, reqTerritory: 2600, reqGold: 5000, maxCities: 8, color: "§d" },
    { tier: 9, id: "great_nation", name: "Grande Nation", reqPop: 2000, reqTerritory: 3800, reqGold: 8000, maxCities: 10, color: "§5" },
    { tier: 10, id: "superpower_nation", name: "Superpuissance", reqPop: 3000, reqTerritory: 5500, reqGold: 13000, maxCities: 12, color: "§c" }
  ],

  // Types de terrains (Harmonisés avec le parchemin des menus dialogue_box.png)
  TERRAIN: {
    DEEP_WATER: { id: 0, name: "Mer Parchemin", color: "#dec89b", traversable: false, moveCost: 999 },
    SHALLOW_WATER: { id: 1, name: "Rivière / Côte", color: "#ebe0c1", traversable: true, moveCost: 2.2 },
    PLAIN: { id: 2, name: "Plaine Fertile", color: "#5b7b4a", traversable: true, moveCost: 1.0, foodYield: 1.2 },
    FOREST: { id: 3, name: "Forêt Dense", color: "#34512b", traversable: true, moveCost: 1.5, woodYield: 1.5, defenseBonus: 0.25 },
    HILLS: { id: 4, name: "Collines Rocheuses", color: "#8a7b62", traversable: true, moveCost: 1.8, stoneYield: 1.5, defenseBonus: 0.40 },
    MOUNTAIN: { id: 5, name: "Hautes Montagnes", color: "#a49782", traversable: false, moveCost: 999, defenseBonus: 0.80 }
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
    FARM: { id: "farm", name: "Ferme Coloniale", woodCost: 40, stoneCost: 10, foodBonus: 3.5, hp: 150, icon: "farm" },
    BARRACKS: { id: "barracks", name: "Caserne d'Armes", woodCost: 60, stoneCost: 35, goldCost: 20, hp: 250, icon: "barracks", desc: "Centre d'entraînement militaire" },
    OUTPOST: { id: "outpost", name: "Avant-poste", woodCost: 50, stoneCost: 30, goldCost: 15, territoryRadius: 3, defenseBonus: 0.35, hp: 300, icon: "flag", desc: "Revendique et stabilise les terres" },
    LUMBER_CAMP: { id: "lumber_camp", name: "Scierie", woodCost: 30, stoneCost: 10, woodBonus: 2.2, hp: 120, icon: "axe" },
    QUARRY: { id: "quarry", name: "Carrière de Pierre", woodCost: 40, stoneCost: 20, stoneBonus: 1.8, hp: 140, icon: "pickaxe" },
    PALISADE: { id: "palisade", name: "Palissade Frontalière", woodCost: 25, stoneCost: 10, defenseBonus: 0.45, hp: 180, icon: "shield" },
    WATCHTOWER: { id: "watchtower", name: "Tour de Guet", woodCost: 60, stoneCost: 50, defenseBonus: 0.80, range: 4.5, attackDamage: 12, hp: 220, icon: "tower" },
    CITADEL: { id: "citadel", name: "Bastion de Forteresse", woodCost: 150, stoneCost: 200, goldCost: 100, defenseBonus: 1.50, range: 6.0, attackDamage: 25, hp: 600, icon: "fortress" }
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
  }
};

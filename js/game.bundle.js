/**
 * Jerry's Nations: Frontline Realms - Standalone RTS Game Bundle (Version 2.2.0)
 * Navigation intuitive au curseur (Bords d'écran, Clic droit glissé, ZQSD/Flèches, Clic Minimap).
 * Écran complet de configuration de partie : Choix de Nation, Pseudo, Bannière, Mode Bac à Sable, Bots et Difficulté.
 * Carte tactique quadrillée 56px, impact réel des biomes et bataillons RTS.
 * RÈGLE STRICTE : ZÉRO EMOJI.
 */

(function () {
  "use strict";

  // ==================== MODULE: config.js ====================
/**
 * Jerry's Nations: Frontline Realms - Configuration & Game Constants
 * Conforme au Lore & Systèmes officiels de Jerry's Nations (Bedrock Addon)
 * Règle stricte : ZÉRO emoji, codes couleurs Bedrock purs (§a, §c, §e, §6, §b, §7).
 */

const CONFIG = {
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
      traversable: true,
      moveCost: 4.2,
      defenseBonus: -0.30,
      desc: "Courant fluvial profond, traversée pénible et lente à découvert"
    },
    FORD: {
      id: "ford",
      name: "Gué Fluvial",
      color: "#8ca89c",
      traversable: true,
      moveCost: 2.2,
      defenseBonus: -0.10,
      desc: "Passage naturel dans l'eau, ralentissement modéré"
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
      moveCost: 1.6,
      baseWood: 1.8,
      defenseBonus: 0.30,
      cavalrySpeedPenalty: 0.50,
      allowsLumberCamp: true,
      desc: "Abondance de Bois, couverture défensive pour l'infanterie"
    },
    HILLS: {
      id: "hills",
      name: "Collines Rocheuses",
      color: "#847458",
      traversable: true,
      moveCost: 1.9,
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

  // Classes de Bataillons et Unités physiques RTS (Cadence réaliste et pondérée)
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
      speed: 0.028,
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
      speed: 0.026,
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
      speed: 0.027,
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
      speed: 0.048,
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
      speed: 0.015,
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
    FARM: { id: "farm", name: "Ferme", allowedTerrain: ["plain"], woodCost: 40, stoneCost: 10, foodBonus: 5.0, hp: 180, icon: "farm", desc: "Produit des récoltes abondantes de Pain (Plaine obligatoire)" },
    BARRACKS: { id: "barracks", name: "Caserne d'Armes", allowedTerrain: ["plain", "forest", "hills"], woodCost: 60, stoneCost: 35, goldCost: 20, hp: 350, icon: "barracks", desc: "Centre d'entraînement militaire" },
    OUTPOST: { id: "outpost", name: "Avant-poste", allowedTerrain: ["plain", "forest", "hills"], woodCost: 50, stoneCost: 30, goldCost: 15, territoryRadius: 2, defenseBonus: 0.35, hp: 300, icon: "flag", desc: "Revendique et stabilise les secteurs voisins" },
    LUMBER_CAMP: { id: "lumber_camp", name: "Scierie", allowedTerrain: ["forest"], woodCost: 30, stoneCost: 10, woodBonus: 4.5, hp: 180, icon: "axe", desc: "Exploitation forestière intensive de Bois (Forêt obligatoire)" },
    QUARRY: { id: "quarry", name: "Carrière de Pierre", allowedTerrain: ["hills"], woodCost: 40, stoneCost: 20, stoneBonus: 3.5, goldBonus: 1.5, hp: 220, icon: "pickaxe", desc: "Extraction de Pierre et filons d'Or (Collines obligatoires)" },
    PALISADE: { id: "palisade", name: "Palissade", allowedTerrain: ["plain", "forest", "hills"], woodCost: 25, stoneCost: 10, defenseBonus: 0.45, hp: 220, icon: "shield", desc: "Barricade défensive" },
    WATCHTOWER: { id: "watchtower", name: "Tour de Guet", allowedTerrain: ["plain", "forest", "hills"], woodCost: 60, stoneCost: 50, defenseBonus: 0.80, range: 3.8, attackDamage: 16, hp: 350, icon: "tower", desc: "Tirs de flèches automatiques (portée accrue sur Collines)" },
    CITADEL: { id: "citadel", name: "Bastion Impérial", allowedTerrain: ["plain", "hills"], woodCost: 150, stoneCost: 200, goldCost: 100, defenseBonus: 1.50, range: 5.0, attackDamage: 30, hp: 800, icon: "fortress", desc: "Citadelle souveraine imprenable" }
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

  // Difficulté des Bots (Rythme posé et stratégique)
  DIFFICULTIES: {
    PEACEFUL: { id: "peaceful", name: "Paisible", intervalMultiplier: 2.5, aggression: 0.2, peacefulDays: 10 },
    NORMAL:   { id: "normal",   name: "Équilibré", intervalMultiplier: 1.6, aggression: 0.6, peacefulDays: 3 },
    HARD:     { id: "hard",     name: "Implacable", intervalMultiplier: 1.0, aggression: 1.0, peacefulDays: 0 }
  }
};



  // ==================== MODULE: i18n.js ====================
/**
 * Jerry's Nations: Frontline Realms - Bilingual Translation Engine (FR / EN)
 * Gestionnaire de traduction bilingue intégrale conforme aux règles strictes du projet.
 * RÈGLE STRICTE : ZÉRO EMOJI. Mémorisation du choix utilisateur dans localStorage.
 */

const I18N = {
  currentLang: "fr",
  _listenerBound: false,

  translations: {
    fr: {
      langBtn: "LANGUE : FRANÇAIS",
      langCode: "FR",
      switchLang: "ENGLISH",

      // Noms des Unités
      unitPioneer: "Pionnier",
      unitMilitia: "Milicien",
      unitArcher: "Archer",
      unitCavalry: "Cavalier",
      unitSiege: "Trébuchet",

      // Noms des Biomes
      biomePlain: "Plaine",
      biomeForest: "Forêt",
      biomeHills: "Collines",
      biomeWater: "Eau Profonde",
      biomeRiver: "Rivière",
      biomeFord: "Gué de Rivière",
      biomeMountain: "Montagnes",

      // Lobby & Écran de Configuration
      gameTitle: "JERRY'S NATIONS",
      gameSubtitle: "Frontline Realms - Grand RTS de Conquête Territoriale",
      secIdentity: "1. IDENTITÉ DE LA NATION",
      avatarLabel: "Avatar & Skin du Dirigeant :",
      btnUploadSkin: "IMPORTER SKIN (.PNG)",
      btnResetSkin: "DÉFAUT (ME.GIF)",
      avatarHint: "Supporte les fichiers skins Minecraft 64x64 PNG avec reliefs.",
      playerNameLabel: "Pseudo du Dirigeant :",
      nationNameLabel: "Nom du Royaume / Nation :",
      bannerLabel: "Bannière Royale & Couleur :",
      nationMottoLabel: "Devise de la Faction :",
      defaultMotto: "Souveraineté, Moissons et Gloire",

      secRules: "2. RÈGLES & DIFFICULTÉ",
      gameModeLabel: "Mode de Jeu :",
      modeStandard: "Conquête",
      modeStandardSub: "Ressources & Famine",
      modeSandbox: "Bac à Sable",
      modeSandboxSub: "Illimité & Gratuit",

      botCountLabel: "Royaumes Rivaux (Bots) :",
      bots0: "0 (Solo)",
      bots1: "1 Faction",
      bots2: "2 Factions",
      bots3: "3 Factions",

      aiDiffLabel: "Stratégie de l'IA :",
      diffPeaceful: "Paisible",
      diffPeacefulSub: "Expansion modérée",
      diffNormal: "Équilibrée",
      diffNormalSub: "Pression constante",
      diffHard: "Implacable",
      diffHardSub: "Raids rapides",

      maraudersLabel: "Pillards Maraudeurs :",
      optMarauders: "Clan Maraudeur (Pillards agressifs des terres sauvages)",
      btnLaunchGame: "FONDER LA NATION & COMMENCER",

      secP2P: "MULTIJOUEUR P2P WEBRTC :",
      roomCodePlaceholder: "Code de salon (ex: jerry-123)",
      btnJoinRoom: "REJOINDRE",
      btnCreateRoom: "HÉBERGER UN NOUVEAU SALON",

      recapNav: "Navigation Carte : Bords d'écran, Clic droit glissé, Clic molette, ZQSD/Flèches ou Clic Minimap",
      recapUnits: "Bataillons RTS : Glisser pour encadrer (Box Select), Clic droit pour ordonner",
      recapCenter: "Recentrer Caméra : Touche C ou bouton [CENTRER]",

      // HUD Supérieur
      dayLabel: "JOUR",
      resFoodLabel: "PAIN:",
      resWoodLabel: "BOIS:",
      resStoneLabel: "PIERRE:",
      resGoldLabel: "OR:",
      resArmyLabel: "ARMÉE:",
      resTerritoryLabel: "SECTEURS:",
      sectorsUnit: "secteurs",
      btnPause: "PAUSE",
      btnResume: "REPRENDRE",
      btnCenter: "CENTRER",
      btnMenu: "MENU",
      soundActive: "[SON : ACTIF]",
      soundMuted: "[SON : COUPE]",

      // Panneau de construction (Tiroir droit)
      buildingsToggleHandle: "BÂTIMENTS",
      buildingsTitle: "BÂTIMENTS & AVANT-POSTES",
      buildingsSubtitle: "Sélectionnez une structure puis cliquez sur un secteur éligible :",
      bldFarmName: "+ FERME",
      bldFarmDesc: "Plaine | +5.0 Pain/jour",
      bldLumberName: "+ SCIERIE",
      bldLumberDesc: "Forêt | +4.5 Bois/jour",
      bldQuarryName: "+ CARRIÈRE",
      bldQuarryDesc: "Collines | +3.5 Pierre +1.5 Or/jour",
      bldBarracksName: "+ CASERNE",
      bldBarracksDesc: "Tout secteur | Caserne militaire",
      bldOutpostName: "+ AVANT-POSTE",
      bldOutpostDesc: "Étend les frontières de +2 cases",
      bldTowerName: "+ TOUR",
      bldTowerDesc: "Tirs défensifs (portée accrue sur colline)",
      bldBastionName: "+ BASTION",
      bldBastionDesc: "Forteresse suprême & +150% défense",

      // Volet de commandement inférieur
      toggleCmdTitle: "COMMANDEMENT & SECTEUR",
      secInfoTitle: "SECTEUR SÉLECTIONNÉ",
      lblSecControl: "Contrôle :",
      lblSecInfra: "Bâtiment :",
      lblSecDefense: "Défense :",
      lblSecYields: "Rendement :",
      sectorWild: "Terre Sauvage (Libre)",
      sectorNoInfra: "Aucun aménagement",
      sectorCitadel: "Cité Royale (Bastion)",
      defensePts: "pts",
      noYields: "Aucun revenu",
      noUnitsSelected: "Aucun bataillon sélectionné. Clic gauche ou glisser pour sélectionner.",
      battalionsSelected: "BATAILLONS :",
      hpLabel: "PV :",
      btnHalt: "HALTE",
      btnRecruitPioneer: "+ PIONNIER",
      btnRecruitMilitia: "+ MILICIEN",
      btnRecruitArcher: "+ ARCHER",
      btnRecruitCavalry: "+ CAVALIER",
      btnRecruitSiege: "+ TRÉBUCHET",
      btnExpColonize: "[EXPÉDITION COLONISATION]",
      btnExpDefend: "[DÉFENSE FRONTIÈRE]",
      btnExpAssault: "[ASSAUT GÉNÉRAL]",

      // Phase de fondation de la capitale
      foundingTitle: "FONDATION DU ROYAUME : CHOISISSEZ VOTRE CAPITALE",
      foundingCountdown: "Temps restant :",
      foundingInstruction: "Explorez la carte et cliquez sur un secteur fertile pour y établir votre Citadelle.",
      foundingBtn: "FONDER MA CAPITALE ICI",
      foundingDoneMsg: "Capitale fondée avec succès ! Gloire au Souverain !",

      // Salon d'Attente Multijoueur
      mpLobbyTitle: "SALON MULTIJOUEUR - SALLE D'ATTENTE",
      mpLobbyStatusWaiting: "En attente de connexion...",
      mpLobbyStatusHost: "Salon ouvert ! En attente d'autres souverains...",
      mpLobbyStatusClient: "Connecté au salon ! En attente du signal de l'Hôte...",
      mpCodeLabel: "CODE DU SALON À PARTAGER :",
      btnCopyCode: "COPIER LE CODE",
      mpCopyFeedback: "Transmettez ce code à vos amis pour qu'ils rejoignent votre royaume.",
      mpCopySuccess: "Code copié dans le presse-papiers ! Partagez-le avec vos alliés.",
      mpSlotsTitle: "ROYAUMES & SOUVERAINS DANS LE SALON (1 à 4 JOUEURS) :",
      mpSlotFree: "En attente d'un joueur ou Bot IA",
      mpSlotBadgeFree: "[LIBRE]",
      mpSlotBadgeHost: "[HÔTE]",
      mpSlotBadgeReady: "[PRÊT]",
      mpBtnStart: "LANCER LA PARTIE POUR TOUS",
      mpBtnLeave: "QUITTER LE SALON",

      // Modal de Pause
      pauseModalTitle: "CONSEIL DE GUERRE - PAUSE",
      pauseModalDesc: "La simulation est suspendue. Choisissez une directive :",
      pauseBtnResume: "REPRENDRE LA PARTIE",
      pauseBtnCenter: "RECENTRER SUR LA CAPITALE (C)",
      pauseBtnEdgeScrollOn: "DÉFILEMENT BORD ÉCRAN : ACTIF",
      pauseBtnEdgeScrollOff: "DÉFILEMENT BORD ÉCRAN : DÉSACTIVÉ",
      pauseBtnQuit: "QUITTER VERS LE MENU PRINCIPAL",

      // Fin de Partie (Victoire / Défaite)
      victoryTitle: "VICTOIRE ROYALE",
      victoryDesc: "Toutes les capitales rivales sont tombées sous vos bannières ! Vous régnez désormais en maître souverain sur ce monde !",
      defeatTitle: "DÉFAITE ROYALE",
      defeatDesc: "Votre Capitale a été rasée par les armées ennemies... Votre empire s'effondre dans les cendres.",
      btnReturnLobby: "RETOURNER AU SALON PRINCIPAL"
    },

    en: {
      langBtn: "LANGUAGE : ENGLISH",
      langCode: "EN",
      switchLang: "FRANÇAIS",

      // Unit Names
      unitPioneer: "Pioneer",
      unitMilitia: "Militia",
      unitArcher: "Archer",
      unitCavalry: "Cavalry",
      unitSiege: "Trebuchet",

      // Biome Names
      biomePlain: "Plains",
      biomeForest: "Forest",
      biomeHills: "Hills",
      biomeWater: "Deep Water",
      biomeRiver: "River",
      biomeFord: "River Ford",
      biomeMountain: "Mountains",

      // Lobby & Setup Screen
      gameTitle: "JERRY'S NATIONS",
      gameSubtitle: "Frontline Realms - Grand Territorial RTS Web Game",
      secIdentity: "1. NATION IDENTITY",
      avatarLabel: "Leader Avatar & Skin:",
      btnUploadSkin: "IMPORT SKIN (.PNG)",
      btnResetSkin: "DEFAULT (ME.GIF)",
      avatarHint: "Supports 64x64 Minecraft PNG skins with 3D overlays.",
      playerNameLabel: "Leader Username:",
      nationNameLabel: "Kingdom / Realm Name:",
      bannerLabel: "Royal Banner & Color:",
      nationMottoLabel: "Faction Motto:",
      defaultMotto: "Sovereignty, Harvest and Glory",

      secRules: "2. RULES & DIFFICULTY",
      gameModeLabel: "Game Mode:",
      modeStandard: "Conquest",
      modeStandardSub: "Resources & Starvation",
      modeSandbox: "Sandbox",
      modeSandboxSub: "Unlimited & Free",

      botCountLabel: "Rival Kingdoms (Bots):",
      bots0: "0 (Solo)",
      bots1: "1 Faction",
      bots2: "2 Factions",
      bots3: "3 Factions",

      aiDiffLabel: "AI Strategy:",
      diffPeaceful: "Peaceful",
      diffPeacefulSub: "Slow expansion",
      diffNormal: "Balanced",
      diffNormalSub: "Steady pressure",
      diffHard: "Relentless",
      diffHardSub: "Swift raids",

      maraudersLabel: "Marauder Raiders:",
      optMarauders: "Marauder Clan (Hostile border raiders)",
      btnLaunchGame: "FOUND REALM & START",

      secP2P: "P2P WEBRTC MULTIPLAYER:",
      roomCodePlaceholder: "Room Code (e.g. jerry-123)",
      btnJoinRoom: "JOIN ROOM",
      btnCreateRoom: "HOST A NEW ROOM",

      recapNav: "Map Controls: Screen edges, Right-click drag, Middle-click, WASD/Arrows or Minimap click",
      recapUnits: "RTS Battalions: Drag to Box Select, Right-click to issue orders",
      recapCenter: "Center Camera: C key or [CENTER] button",

      // Top HUD
      dayLabel: "DAY",
      resFoodLabel: "BREAD:",
      resWoodLabel: "WOOD:",
      resStoneLabel: "STONE:",
      resGoldLabel: "GOLD:",
      resArmyLabel: "ARMY:",
      resTerritoryLabel: "SECTORS:",
      sectorsUnit: "sectors",
      btnPause: "PAUSE",
      btnResume: "RESUME",
      btnCenter: "CENTER",
      btnMenu: "MENU",
      soundActive: "[SOUND: ON]",
      soundMuted: "[SOUND: MUTED]",

      // Building Drawer (Right)
      buildingsToggleHandle: "BUILDINGS",
      buildingsTitle: "BUILDINGS & OUTPOSTS",
      buildingsSubtitle: "Select a structure then click on an eligible sector:",
      bldFarmName: "+ FARM",
      bldFarmDesc: "Plain | +5.0 Bread/day",
      bldLumberName: "+ LUMBER CAMP",
      bldLumberDesc: "Forest | +4.5 Wood/day",
      bldQuarryName: "+ QUARRY",
      bldQuarryDesc: "Hills | +3.5 Stone +1.5 Gold/day",
      bldBarracksName: "+ BARRACKS",
      bldBarracksDesc: "Any sector | Military hub",
      bldOutpostName: "+ OUTPOST",
      bldOutpostDesc: "Expands borders by +2 tiles",
      bldTowerName: "+ WATCHTOWER",
      bldTowerDesc: "Defensive archery (bonus on hills)",
      bldBastionName: "+ CITADEL",
      bldBastionDesc: "Supreme fortress & +150% defense",

      // Bottom Command Dock
      toggleCmdTitle: "COMMAND & SECTOR",
      secInfoTitle: "SELECTED SECTOR",
      lblSecControl: "Control:",
      lblSecInfra: "Building:",
      lblSecDefense: "Defense / HP:",
      lblSecYields: "Yields:",
      sectorWild: "Wildlands (Neutral)",
      sectorNoInfra: "No infrastructure",
      sectorCitadel: "Royal Capital (Citadel)",
      defensePts: "HP",
      noYields: "No revenue",
      noUnitsSelected: "No battalion selected. Left-click or drag to select.",
      battalionsSelected: "BATTALIONS:",
      hpLabel: "HP:",
      btnHalt: "HALT",
      btnRecruitPioneer: "+ PIONEER",
      btnRecruitMilitia: "+ MILITIA",
      btnRecruitArcher: "+ ARCHER",
      btnRecruitCavalry: "+ CAVALRY",
      btnRecruitSiege: "+ TREBUCHET",
      btnExpColonize: "[COLONIZATION EXPEDITION]",
      btnExpDefend: "[FRONTIER DEFENSE]",
      btnExpAssault: "[GENERAL ASSAULT]",

      // Capital Founding Phase
      foundingTitle: "FOUNDING OF THE REALM: CHOOSE YOUR CAPITAL",
      foundingCountdown: "Time remaining:",
      foundingInstruction: "Scout the map and click on a fertile sector to establish your Citadel.",
      foundingBtn: "FOUND MY CAPITAL HERE",
      foundingDoneMsg: "Capital established! Long live the Sovereign!",

      // Multiplayer Lobby Modal
      mpLobbyTitle: "MULTIPLAYER LOBBY - WAITING ROOM",
      mpLobbyStatusWaiting: "Waiting for connection...",
      mpLobbyStatusHost: "Room created! Waiting for other monarchs...",
      mpLobbyStatusClient: "Connected! Waiting for host to launch...",
      mpCodeLabel: "ROOM CODE TO SHARE:",
      btnCopyCode: "COPY CODE",
      mpCopyFeedback: "Send this code to your friends so they can join your realm.",
      mpCopySuccess: "Code copied to clipboard! Share it with your allies.",
      mpSlotsTitle: "KINGDOMS & MONARCHS IN ROOM (1 to 4 PLAYERS):",
      mpSlotFree: "Waiting for player or AI Bot",
      mpSlotBadgeFree: "[OPEN]",
      mpSlotBadgeHost: "[HOST]",
      mpSlotBadgeReady: "[READY]",
      mpBtnStart: "LAUNCH GAME FOR ALL",
      mpBtnLeave: "LEAVE ROOM",

      // Pause Modal
      pauseModalTitle: "WAR COUNCIL - PAUSE",
      pauseModalDesc: "Simulation is paused. Choose a directive:",
      pauseBtnResume: "RESUME GAME",
      pauseBtnCenter: "CENTER ON CAPITAL (C)",
      pauseBtnEdgeScrollOn: "EDGE SCROLLING: ON",
      pauseBtnEdgeScrollOff: "EDGE SCROLLING: OFF",
      pauseBtnQuit: "QUIT TO MAIN MENU",

      // Game End (Victory / Defeat)
      victoryTitle: "ROYAL VICTORY",
      victoryDesc: "All rival capitals have fallen under your banners! You now reign supreme over this world!",
      defeatTitle: "ROYAL DEFEAT",
      defeatDesc: "Your Capital has been destroyed by enemy armies... Your empire collapses into ashes.",
      btnReturnLobby: "RETURN TO MAIN MENU"
    }
  },

  init() {
    try {
      const saved = localStorage.getItem("jerry_nations_lang");
      if (saved && (saved === "fr" || saved === "en")) {
        this.currentLang = saved;
      } else {
        const nav = (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage) || "").toLowerCase();
        this.currentLang = nav.startsWith("en") ? "en" : "fr";
      }
    } catch (e) {
      this.currentLang = "fr";
    }

    // Gestionnaire de clic délégué unique sur le document
    if (!this._listenerBound && typeof document !== "undefined") {
      this._listenerBound = true;
      document.addEventListener("click", (e) => {
        const btn = e.target && e.target.closest && e.target.closest(".btn-toggle-lang");
        if (btn) {
          e.preventDefault();
          this.toggleLang();
          if (typeof SOUND !== "undefined" && SOUND.playClick) {
            SOUND.playClick();
          }
          if (typeof window !== "undefined" && window.app && window.app.ui) {
            window.app.ui.updateHUD();
            window.app.ui.updateSectorInfoDisplay();
          }
        }
      });
    }

    this.applyToDOM();
  },

  setLang(lang) {
    if (lang !== "fr" && lang !== "en") return;
    this.currentLang = lang;
    try {
      localStorage.setItem("jerry_nations_lang", lang);
    } catch (e) {}
    this.applyToDOM();
  },

  toggleLang() {
    this.setLang(this.currentLang === "fr" ? "en" : "fr");
  },

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    return dict[key] || this.translations.fr[key] || key;
  },

  getUnitName(unitType) {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    const map = {
      pioneer: dict.unitPioneer,
      militia: dict.unitMilitia,
      archer: dict.unitArcher,
      cavalry: dict.unitCavalry,
      siege: dict.unitSiege
    };
    return map[unitType] || unitType;
  },

  getBiomeName(biomeType) {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    const map = {
      plain: dict.biomePlain,
      forest: dict.biomeForest,
      hills: dict.biomeHills,
      water: dict.biomeWater,
      deep_water: dict.biomeWater,
      river: dict.biomeRiver,
      ford: dict.biomeFord,
      mountain: dict.biomeMountain
    };
    return map[biomeType] || biomeType;
  },

  getInfraName(infraType) {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    const map = {
      farm: dict.bldFarmName,
      barracks: dict.bldBarracksName,
      outpost: dict.bldOutpostName,
      lumber_camp: dict.bldLumberName,
      quarry: dict.bldQuarryName,
      palisade: dict.bldBastionName,
      watchtower: dict.bldTowerName,
      citadel: dict.bldBastionName
    };
    return map[infraType] || infraType;
  },

  applyToDOM() {
    if (typeof document === "undefined") return;
    const lang = this.currentLang;
    const dict = this.translations[lang] || this.translations.fr;

    if (document.documentElement) {
      document.documentElement.lang = lang;
    }

    // Mettre à jour les boutons de langue
    document.querySelectorAll(".btn-toggle-lang").forEach((btn) => {
      btn.textContent = dict.langBtn;
    });

    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const setPlaceholder = (id, placeholder) => {
      const el = document.getElementById(id);
      if (el) el.placeholder = placeholder;
    };

    // 1. Écran Titre & Lobby
    setText("lobby-main-subtitle", dict.gameSubtitle);
    setText("lobby-sec1-title", dict.secIdentity);
    setText("lbl-leader-avatar", dict.avatarLabel);
    setText("btn-upload-skin", dict.btnUploadSkin);
    setText("btn-reset-skin", dict.btnResetSkin);
    setText("txt-avatar-hint", dict.avatarHint);
    setText("lbl-player-name", dict.playerNameLabel);
    setText("lbl-nation-name", dict.nationNameLabel);
    setText("lbl-banner-picker", dict.bannerLabel);
    setText("lbl-nation-motto", dict.nationMottoLabel);
    setPlaceholder("setup-player-name", lang === "fr" ? "Votre Nom ou Pseudo" : "Your Name or Alias");
    setPlaceholder("setup-nation-name", lang === "fr" ? "Nom de votre Empire" : "Your Empire Name");

    setText("lobby-sec2-title", dict.secRules);
    setText("lbl-game-mode", dict.gameModeLabel);
    setText("lbl-bot-count", dict.botCountLabel);
    setText("lbl-ai-diff", dict.aiDiffLabel);
    setText("lbl-marauders", dict.maraudersLabel || dict.optMarauders);
    setText("btn-start-game", dict.btnLaunchGame);

    setText("lobby-sec3-title", lang === "fr" ? "3. COMMANDEMENT" : "3. COMMAND");
    setText("txt-command-desc", lang === "fr"
      ? "Explorez la carte, exploitez les forêts pour le bois, les plaines pour le pain et les collines pour la pierre."
      : "Explore the map, harvest forests for wood, plains for bread and hills for stone.");

    setText("txt-p2p-title", dict.secP2P);
    setPlaceholder("input-room-code", lang === "fr" ? "Code de salon (ex: jerry-123)" : "Room code (e.g. jerry-123)");
    setText("btn-join-room", dict.btnJoinRoom);
    setText("btn-create-room", dict.btnCreateRoom);

    // Récap commandes
    const navPart = (dict.recapNav || "").includes(": ") ? dict.recapNav.split(": ")[1] : dict.recapNav;
    const unitsPart = (dict.recapUnits || "").includes(": ") ? dict.recapUnits.split(": ")[1] : dict.recapUnits;
    const centerPart = (dict.recapCenter || "").includes(": ") ? dict.recapCenter.split(": ")[1] : dict.recapCenter;
    setHtml("recap-item-nav", `<strong>${lang === 'fr' ? 'Navigation Carte' : 'Map Controls'}</strong> : ${navPart}`);
    setHtml("recap-item-units", `<strong>${lang === 'fr' ? 'Bataillons RTS' : 'RTS Battalions'}</strong> : ${unitsPart}`);
    setHtml("recap-item-center", `<strong>${lang === 'fr' ? 'Recentrer Caméra' : 'Center Camera'}</strong> : ${centerPart}`);

    // 2. Top HUD : Ressources & Contrôles
    setText("lbl-res-food", dict.resFoodLabel);
    setText("lbl-res-wood", dict.resWoodLabel);
    setText("lbl-res-stone", dict.resStoneLabel);
    setText("lbl-res-gold", dict.resGoldLabel);
    setText("lbl-res-troops", dict.resArmyLabel);
    setText("lbl-res-territory", dict.resTerritoryLabel);

    setText("btn-center-camera", dict.btnCenter);
    setText("btn-open-menu", dict.btnMenu);

    // 3. Tiroir Latéral Bâtiments
    setText("txt-buildings-toggle", dict.buildingsToggleHandle);
    setText("buildings-drawer-title", dict.buildingsTitle);
    setText("buildings-drawer-desc", dict.buildingsSubtitle);

    setText("bld-name-farm", dict.bldFarmName);
    setText("bld-desc-farm", dict.bldFarmDesc);
    setText("bld-name-lumber", dict.bldLumberName);
    setText("bld-desc-lumber", dict.bldLumberDesc);
    setText("bld-name-quarry", dict.bldQuarryName);
    setText("bld-desc-quarry", dict.bldQuarryDesc);
    setText("bld-name-barracks", dict.bldBarracksName);
    setText("bld-desc-barracks", dict.bldBarracksDesc);
    setText("bld-name-outpost", dict.bldOutpostName);
    setText("bld-desc-outpost", dict.bldOutpostDesc);
    setText("bld-name-tower", dict.bldTowerName);
    setText("bld-desc-tower", dict.bldTowerDesc);
    setText("bld-name-citadel", dict.bldBastionName);
    setText("bld-desc-citadel", dict.bldBastionDesc);

    // 4. Volet Inférieur de Commandement
    setText("txt-bottom-dock-toggle", dict.toggleCmdTitle);
    setText("sector-info-title", dict.secInfoTitle);
    setText("lbl-sec-control", dict.lblSecControl);
    setText("lbl-sec-infra", dict.lblSecInfra);
    setText("lbl-sec-defense", dict.lblSecDefense);
    setText("lbl-sec-yields", dict.lblSecYields);

    setText("btn-order-halt", dict.btnHalt);
    setText("btn-recruit-pioneer", dict.btnRecruitPioneer);
    setText("btn-recruit-militia", dict.btnRecruitMilitia);
    setText("btn-recruit-archer", dict.btnRecruitArcher);
    setText("btn-recruit-cavalry", dict.btnRecruitCavalry);
    setText("btn-recruit-siege", dict.btnRecruitSiege);

    // 5. Modal de Pause
    setText("modal-pause-title", dict.pauseModalTitle);
    setText("modal-pause-desc", dict.pauseModalDesc);
    setText("modal-btn-resume", dict.pauseBtnResume);
    setText("modal-btn-center", dict.pauseBtnCenter);
    setText("modal-btn-quit-lobby", dict.pauseBtnQuit);

    const btnEdge = document.getElementById("modal-btn-toggle-edge-scroll");
    if (btnEdge) {
      const isScrollActive = !btnEdge.textContent.includes("DÉSACTIVÉ") && !btnEdge.textContent.includes("OFF");
      btnEdge.textContent = isScrollActive ? dict.pauseBtnEdgeScrollOn : dict.pauseBtnEdgeScrollOff;
    }

    // 6. Salon Multijoueur
    setText("mp-lobby-header-title", dict.mpLobbyTitle);
    setText("mp-code-label-text", dict.mpCodeLabel);
    setText("btn-copy-room-code", dict.btnCopyCode);
    setText("mp-copy-feedback", dict.mpCopyFeedback);
    setText("mp-slots-title-text", dict.mpSlotsTitle);
    setText("btn-mp-start-game", dict.mpBtnStart);
    setText("btn-mp-leave-room", dict.mpBtnLeave);

    // 7. Bandeau de fondation
    setText("founding-banner-title", dict.foundingTitle);
    setText("btn-confirm-founding", dict.foundingBtn);

    // 8. Modal de Fin de Partie
    setText("btn-end-quit-lobby", dict.btnReturnLobby);

    // 9. Boutons de réglages du Lobby (Mode, Bots, Difficulté, Maraudeurs)
    document.querySelectorAll(".setup-btn-toggle").forEach((btn) => {
      const setting = btn.dataset.setting;
      const val = btn.dataset.value;
      if (setting === "gameMode") {
        btn.textContent = val === "standard"
          ? (lang === "fr" ? "CONQUÊTE (T0-T10)" : "CONQUEST (T0-T10)")
          : (lang === "fr" ? "BAC À SABLE" : "SANDBOX");
      } else if (setting === "botCount") {
        if (val === "0") btn.textContent = lang === "fr" ? "0 (SEUL)" : "0 (ALONE)";
        else btn.textContent = `${val} ${val === "1" ? "BOT" : "BOTS"}`;
      } else if (setting === "aiDifficulty") {
        if (val === "peaceful") btn.textContent = lang === "fr" ? "PAISIBLE" : "PEACEFUL";
        else if (val === "normal") btn.textContent = lang === "fr" ? "ÉQUILIBRÉ" : "BALANCED";
        else if (val === "hard") btn.textContent = lang === "fr" ? "IMPLACABLE" : "RELENTLESS";
      } else if (setting === "marauders") {
        btn.textContent = val === "true"
          ? (lang === "fr" ? "ACTIVÉS (HOSTILES)" : "ENABLED (HOSTILE)")
          : (lang === "fr" ? "DÉSACTIVÉS" : "DISABLED");
      }
    });

    const help = document.getElementById("mode-help-text");
    if (help) {
      const isSandbox = document.querySelector('.setup-btn-toggle[data-setting="gameMode"][data-value="sandbox"]')?.classList.contains("active");
      help.textContent = isSandbox
        ? (lang === "fr" ? "Ressources infinies (99 999), constructions libres, aucune famine." : "Unlimited resources (99,999), free building, no starvation.")
        : (lang === "fr" ? "11 Stades, Banquet au crépuscule et gestion alimentaire." : "11 Stages, Sunset banquet and food starvation system.");
    }
  }
};


  // ==================== MODULE: audio.js ====================
/**
 * Jerry's Nations: Frontline Realms - Web Audio Procedural Synthesizer
 * Aucun asset audio externe requis : sons procéduraux 100% autonomes et fidèles à l'ambiance médiévale/Minecraft.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.muted;
  }

  // Clic d'interface UI léger façon Minecraft Bedrock
  playClick() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Cor de guerre / trompette de charge lors d'un ordre d'attaque
  playCharge() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(330, now + 0.15);
    osc1.frequency.setValueAtTime(440, now + 0.25);

    osc2.frequency.setValueAtTime(110, now);
    osc2.frequency.exponentialRampToValueAtTime(165, now + 0.15);
    osc2.frequency.setValueAtTime(220, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  // Choc de boucliers et d'épées sur la ligne de front
  playClash() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
  }

  // Alarme de raid maraudeur (cor grave menaçant)
  playRaidAlert() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.8);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  // Fanfare triomphale de passage de stade (Level Up de la Nation)
  playLevelUp() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // Do, Mi, Sol, Do, Mi

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.08;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // Fanfare impériale royale (fondation de capitale et lancement multijoueur)
  playFanfare() {
    this.playLevelUp();
  }

  // Bruitage de marteau / construction d'infrastructure
  playBuild() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Cloche du crépuscule (repas des citoyens / sunset consumption)
  playSunsetBell() {
    if (this.muted) return;
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // Ré5
    osc.frequency.exponentialRampToValueAtTime(580, now + 1.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.35);
  }
}

const SOUND = new SoundEngine();


  // ==================== MODULE: units.js ====================
/**
 * Jerry's Nations: Frontline Realms - Real-Time Physical Units & Projectiles Engine
 * Système de bataillons physiques (Pionniers, Milice, Archers, Cavalerie, Trébuchets).
 * Déplacement libre, combats au corps-à-corps et tirs balistiques à distance.
 */



class Projectile {
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
      const targetCell = engine.map.getCell(Math.floor(this.targetX), Math.floor(this.targetY));
      if (targetCell && targetCell.infrastructure && targetCell.owner !== this.attackerId) {
        engine.damageInfrastructure(targetCell, this.damage, this.attackerId);
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

class Unit {
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
    this.targetBuildingCell = null;

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

    this.state = "idle"; // "idle", "moving", "attacking", "attacking_building", "building"
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
    this.targetBuildingCell = null;
    this.state = "moving";
    this.hasCharged = false;
  }

  attackTarget(targetUnit) {
    if (!targetUnit || targetUnit.hp <= 0 || targetUnit.factionId === this.factionId) return;
    this.targetUnit = targetUnit;
    this.targetCell = null;
    this.targetBuildingCell = null;
    this.targetX = targetUnit.x;
    this.targetY = targetUnit.y;
    this.state = "attacking";
  }

  attackBuilding(targetCell) {
    if (!targetCell || !targetCell.infrastructure || targetCell.owner === this.factionId) return;
    this.targetBuildingCell = targetCell;
    this.targetUnit = null;
    this.targetCell = null;
    this.targetX = targetCell.x + 0.5;
    this.targetY = targetCell.y + 0.5;
    this.state = "attacking_building";
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

        const effectiveRange = this.getEffectiveRange(engine);
        if (dist <= effectiveRange) {
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

    // 1b. Ciblage d'un bâtiment ou d'une citadelle / capitale ennemie
    if (this.targetBuildingCell) {
      if (!this.targetBuildingCell.infrastructure || this.targetBuildingCell.owner === this.factionId) {
        this.targetBuildingCell = null;
        this.state = "idle";
      } else {
        const bx = this.targetBuildingCell.x + 0.5;
        const by = this.targetBuildingCell.y + 0.5;
        const dist = Math.hypot(bx - this.x, by - this.y);

        const effectiveRange = this.getEffectiveRange(engine);
        if (dist <= effectiveRange) {
          this.performBuildingAttack(this.targetBuildingCell, engine, combatBuff);
          return true;
        } else {
          this.stepTowards(bx, by, this.speed * moodBuff, engine);
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

  getEffectiveRange(engine) {
    let r = this.range;
    const cell = engine.map.getCell(Math.floor(this.x), Math.floor(this.y));
    if (cell && cell.terrain.archerRangeBonus && this.isRanged) {
      r += cell.terrain.archerRangeBonus;
    }
    return r;
  }

  getEffectiveDefense(engine) {
    let def = this.defense;
    const cell = engine.map.getCell(Math.floor(this.x), Math.floor(this.y));
    if (cell && cell.terrain.defenseBonus) {
      def += Math.floor(cell.terrain.defenseBonus * 5);
    }
    return def;
  }

  stepTowards(tx, ty, moveSpeed, engine) {
    const curCell = engine.map.getCell(Math.floor(this.x), Math.floor(this.y));
    let adjustedSpeed = moveSpeed;

    if (curCell) {
      if (this.type === "cavalry") {
        if (curCell.terrain.cavalrySpeedBonus) adjustedSpeed *= curCell.terrain.cavalrySpeedBonus;
        if (curCell.terrain.cavalrySpeedPenalty) adjustedSpeed *= curCell.terrain.cavalrySpeedPenalty;
      }
      if (curCell.terrain.moveCost) {
        adjustedSpeed /= curCell.terrain.moveCost;
      }
    }

    const angle = Math.atan2(ty - this.y, tx - this.x);
    const nextX = this.x + Math.cos(angle) * adjustedSpeed;
    const nextY = this.y + Math.sin(angle) * adjustedSpeed;

    const cell = engine.map.getCell(Math.floor(nextX), Math.floor(nextY));
    if (cell && cell.terrain.traversable) {
      this.x = nextX;
      this.y = nextY;
    } else {
      this.x += Math.cos(angle + Math.PI / 4) * (adjustedSpeed * 0.5);
      this.y += Math.sin(angle + Math.PI / 4) * (adjustedSpeed * 0.5);
    }
  }

  performAttack(target, engine, combatBuff) {
    if (this.attackCooldown > 0) return;

    this.attackCooldown = this.isRanged ? 24 : 16;

    let dmg = this.attack * combatBuff;
    if (this.chargeBonus > 1.0 && !this.hasCharged) {
      dmg *= this.chargeBonus;
      this.hasCharged = true;
    }

    if (this.isRanged) {
      const isSiege = this.type === "siege";
      const proj = new Projectile(this.factionId, this.x, this.y, target.x, target.y, dmg, target, isSiege);
      engine.projectiles.push(proj);

      if (this.factionId === 1 || target.factionId === 1) {
        SOUND.playCharge();
      }
    } else {
      target.takeDamage(dmg, this.factionId, engine);
      if (this.factionId === 1 || target.factionId === 1) {
        SOUND.playClash();
      }
    }
  }

  performBuildingAttack(targetCell, engine, combatBuff) {
    if (this.attackCooldown > 0) return;

    this.attackCooldown = this.isRanged ? 24 : 18;

    let dmg = this.attack * combatBuff;
    // Multiplicateur contre les fortifications
    let mult = 1.0;
    if (this.type === "siege") mult = 3.5;
    else if (this.type === "militia") mult = 1.25;
    else if (this.type === "cavalry") mult = 0.9;
    else if (this.type === "archer") mult = 0.8;
    else if (this.type === "pioneer") mult = 0.5;

    dmg *= mult;

    const targetX = targetCell.x + 0.5;
    const targetY = targetCell.y + 0.5;

    if (this.isRanged) {
      const isSiege = this.type === "siege";
      const proj = new Projectile(this.factionId, this.x, this.y, targetX, targetY, dmg, null, isSiege);
      engine.projectiles.push(proj);

      if (this.factionId === 1) {
        SOUND.playCharge();
      }
    } else {
      engine.damageInfrastructure(targetCell, dmg, this.factionId);
      if (this.factionId === 1) {
        SOUND.playClash();
      }
      engine.combatEvents.push({
        x: targetX,
        y: targetY,
        life: 14,
        attackerId: this.factionId,
        type: "slash"
      });
    }
  }

  takeDamage(amount, attackerId, engine) {
    const def = this.getEffectiveDefense(engine);
    const netDamage = Math.max(2, Math.floor(amount - def));
    this.hp -= netDamage;

    // Événement visuel
    engine.combatEvents.push({
      x: this.x,
      y: this.y,
      life: 12,
      attackerId,
      type: "slash"
    });

    // Auto-riposte si l'unité n'a pas déjà de cible ou d'ordre de siège
    if (!this.targetUnit && !this.targetBuildingCell && this.attack > 0) {
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

    // Pour les trébuchets (armes de siège), priorité absolue aux fortifications et bastions ennemis
    if (this.type === "siege") {
      let closestBuilding = null;
      let minBldDist = aggroRadius;
      const curX = Math.floor(this.x);
      const curY = Math.floor(this.y);
      const rInt = Math.ceil(aggroRadius);

      for (let dy = -rInt; dy <= rInt; dy++) {
        for (let dx = -rInt; dx <= rInt; dx++) {
          const c = engine.map.getCell(curX + dx, curY + dy);
          if (c && c.owner !== 0 && c.owner !== this.factionId && c.infrastructure) {
            const d = Math.hypot((c.x + 0.5) - this.x, (c.y + 0.5) - this.y);
            if (d <= minBldDist) {
              minBldDist = d;
              closestBuilding = c;
            }
          }
        }
      }

      if (closestBuilding) {
        this.attackBuilding(closestBuilding);
        return;
      }
    }

    // 1. Détection des bataillons ennemis mobiles
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
      return;
    }

    // 2. Si aucune unité ennemie en vue, détecter les bastions, tours et citadelles ennemis dans le rayon
    let closestBuilding = null;
    let minBldDist = aggroRadius;
    const curX = Math.floor(this.x);
    const curY = Math.floor(this.y);
    const rInt = Math.ceil(aggroRadius);

    for (let dy = -rInt; dy <= rInt; dy++) {
      for (let dx = -rInt; dx <= rInt; dx++) {
        const c = engine.map.getCell(curX + dx, curY + dy);
        if (c && c.owner !== 0 && c.owner !== this.factionId && c.infrastructure) {
          const d = Math.hypot((c.x + 0.5) - this.x, (c.y + 0.5) - this.y);
          if (d <= minBldDist) {
            minBldDist = d;
            closestBuilding = c;
          }
        }
      }
    }

    if (closestBuilding) {
      this.attackBuilding(closestBuilding);
    }
  }

  claimCurrentCell(engine) {
    const cx = Math.floor(this.x);
    const cy = Math.floor(this.y);
    const cell = engine.map.getCell(cx, cy);

    if (cell && cell.terrain.traversable && cell.owner !== this.factionId) {
      if (cell.infrastructure && cell.owner !== 0) {
        // Le secteur contient un bâtiment ennemi : engager le siège !
        this.attackBuilding(cell);
      } else {
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
      if (cell.owner !== this.factionId) {
        if (cell.infrastructure && cell.owner !== 0) {
          this.attackBuilding(cell);
        } else {
          cell.owner = this.factionId;
          engine.updateTerritoryCounts();
        }
      }
    }
  }
}


  // ==================== MODULE: map.js ====================
/**
 * Jerry's Nations: Frontline Realms - Strategic Sector Map Generator
 * Carte continentale à grande échelle découpée en secteurs tactiques de 56px.
 * Biomes à fort impact (Plaines agricoles, Forêts d'exploitation, Collines minières, Cols de montagne et Rivières à gués).
 */


class WorldMap {
  constructor(width = CONFIG.MAP_WIDTH, height = CONFIG.MAP_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = new Array(width * height);
    this.capitals = [];
  }

  createPrng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  generate(seed = Date.now(), activeFactions = null) {
    const prng = this.createPrng(seed);

    const heightMap = new Float32Array(this.width * this.height);
    const moistureMap = new Float32Array(this.width * this.height);

    // 1. Génération de carte de relief et d'humidité (Grand continent avec golfes et côtes)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nx = (x / this.width) * 3.2;
        const ny = (y / this.height) * 3.2;

        // Masque de continent organique (forme continentale vaste sans grand vide)
        const dx = 2 * (x / this.width) - 1;
        const dy = 2 * (y / this.height) - 1;
        const distFromCenter = Math.sqrt(dx * dx * 0.85 + dy * dy * 1.15);

        let h = Math.sin(nx + prng() * 0.15) * 0.38 + Math.cos(ny + prng() * 0.15) * 0.38;
        h += Math.sin(nx * 2.2 + 0.5) * 0.22 + Math.cos(ny * 2.2 + 0.3) * 0.22;
        h += Math.sin(nx * 4.4) * 0.10 + Math.cos(ny * 4.4) * 0.10;
        h = (h + 1) * 0.5 - distFromCenter * 0.26;

        let m = Math.sin(nx * 1.8 + 1.2) * 0.5 + Math.cos(ny * 1.8 + 0.8) * 0.5;
        m = (m + 1) * 0.5;

        const idx = y * this.width + x;
        heightMap[idx] = h;
        moistureMap[idx] = m;
      }
    }

    // 2. Traçage d'un grand fleuve avec des gués (points de passage tactiques)
    const riverY = Math.floor(this.height * 0.52);
    const riverCoords = new Set();
    const fordCoords = new Set();

    let curY = riverY;
    for (let x = 4; x < this.width - 4; x++) {
      if (prng() < 0.25) curY += prng() < 0.5 ? 1 : -1;
      curY = Math.max(6, Math.min(this.height - 6, curY));
      riverCoords.add(`${x},${curY}`);

      // Gués placés tous les 8 à 11 secteurs
      if (x % 9 === 0) {
        fordCoords.add(`${x},${curY}`);
      }
    }

    // 3. Attribution des Biomes par Secteur
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const h = heightMap[idx];
        const m = moistureMap[idx];
        const coordKey = `${x},${y}`;

        let terrain;

        if (fordCoords.has(coordKey) && h >= 0.18) {
          terrain = CONFIG.TERRAIN.FORD;
        } else if (riverCoords.has(coordKey) && h >= 0.18) {
          terrain = CONFIG.TERRAIN.RIVER;
        } else if (h < 0.16) {
          terrain = CONFIG.TERRAIN.DEEP_WATER;
        } else if (h > 0.75) {
          terrain = CONFIG.TERRAIN.MOUNTAIN;
        } else if (h > 0.56) {
          terrain = CONFIG.TERRAIN.HILLS;
        } else if (m > 0.48) {
          terrain = CONFIG.TERRAIN.FOREST;
        } else {
          terrain = CONFIG.TERRAIN.PLAIN;
        }

        // Variantes visuelles (arbres, rochers, herbes, vagues) pour le rendu sectorisé
        const variantSeed = Math.floor(prng() * 100);

        this.grid[idx] = {
          x,
          y,
          terrain,
          variantSeed,
          owner: 0, // 0 = Neutre / Sauvage
          infrastructure: null,
          infraHp: null,
          isCapital: false,
          capitalFactionId: null
        };
      }
    }

    // 4. Implantation stratégique des capitales (pour les factions actives)
    this.placeCapitals(prng, activeFactions || CONFIG.FACTIONS);
  }

  placeCapitals(prng, factions = CONFIG.FACTIONS) {
    this.capitals = [];
    const candidates = [];

    // Trouver les secteurs de plaine entourés de forêts et collines exploitables
    for (let y = 5; y < this.height - 5; y++) {
      for (let x = 5; x < this.width - 5; x++) {
        const cell = this.getCell(x, y);
        if (cell && cell.terrain === CONFIG.TERRAIN.PLAIN) {
          const neighbors = this.getNeighbors(x, y, true);
          const hasWater = neighbors.some((n) => n.terrain === CONFIG.TERRAIN.DEEP_WATER);
          if (!hasWater) {
            candidates.push(cell);
          }
        }
      }
    }

    if (candidates.length === 0) return;

    const minDist = Math.floor(Math.min(this.width, this.height) / Math.max(1, factions.length * 0.5));

    factions.forEach((faction) => {
      let chosen = null;
      let attempts = 0;

      while (!chosen && attempts < 250) {
        attempts++;
        const candidate = candidates[Math.floor(prng() * candidates.length)];
        const tooClose = this.capitals.some((cap) => Math.hypot(cap.x - candidate.x, cap.y - candidate.y) < minDist);
        if (!tooClose) chosen = candidate;
      }

      if (!chosen) chosen = candidates[Math.floor(prng() * candidates.length)];

      chosen.owner = faction.id;
      chosen.isCapital = true;
      chosen.capitalFactionId = faction.id;
      chosen.infrastructure = "citadel";
      chosen.infraHp = 800;
      chosen.maxInfraHp = 800;

      // Revendication territoriale initiale (secteurs immédiats)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighbor = this.getCell(chosen.x + dx, chosen.y + dy);
          if (neighbor && neighbor.terrain.traversable) {
            neighbor.owner = faction.id;
          }
        }
      }

      this.capitals.push({
        factionId: faction.id,
        x: chosen.x,
        y: chosen.y,
        name: faction.name
      });
    });
  }

  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.grid[y * this.width + x];
  }

  getNeighbors(x, y, includeDiagonals = false) {
    const list = [];
    const dirs = includeDiagonals
      ? [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]
      : [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (const [dx, dy] of dirs) {
      const c = this.getCell(x + dx, y + dy);
      if (c) list.push(c);
    }
    return list;
  }

  isBorderCell(x, y, factionId) {
    const cell = this.getCell(x, y);
    if (!cell || cell.owner !== factionId) return false;
    const neighbors = this.getNeighbors(x, y);
    return neighbors.some((n) => n.owner !== factionId && n.terrain.traversable);
  }

  getBorderCells(factionId) {
    const borders = [];
    for (let i = 0; i < this.grid.length; i++) {
      const cell = this.grid[i];
      if (cell.owner === factionId && this.isBorderCell(cell.x, cell.y, factionId)) {
        borders.push(cell);
      }
    }
    return borders;
  }

  countFactionTerritory(factionId) {
    let count = 0;
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i].owner === factionId) count++;
    }
    return count;
  }
}


  // ==================== MODULE: engine.js ====================
/**
 * Jerry's Nations: Frontline Realms - RTS Simulation Engine
 * Gestion physique des bataillons, tirs balistiques, défenses de tours/bastions,
 * logistique alimentaire (jn_food), Scoreboard Mood (-1000 à +1000) et 11 Stades de Jerry's Nations.
 */




class GameEngine {
  constructor(worldMap, settings = {}) {
    this.map = worldMap;
    this.settings = Object.assign({
      playerName: "Jerry",
      nationName: "Empire d'Émeraude",
      bannerPreset: "emerald",
      bannerColor: "#1b7a63",
      bannerBorder: "#22c55e",
      textCode: "§a",
      gameMode: "standard",
      botCount: 3,
      aiDifficulty: "normal",
      enableMarauders: true
    }, settings);

    this.tickCount = 0;
    this.dayTimeSec = 0;
    this.dayCount = 1;
    this.timeScale = 1; // 0 = Pause, 1 = Normal, 2 = x2, 5 = x5
    this.isPaused = false;
    this.aiDifficulty = this.settings.aiDifficulty;
    this.gameMode = this.settings.gameMode;

    this.factions = new Map();
    this.units = [];
    this.projectiles = [];
    this.combatEvents = [];
    this.logMessages = [];

    // Phase de fondation du royaume (60 secondes pour choisir l'emplacement de la capitale)
    this.isFoundingCapital = true;
    this.foundingCountdown = 60.0;
    this.candidateFoundingCell = null;

    this.initFactions();
    this.spawnInitialArmies();

    // Emplacement candidat initial par défaut
    const initialCap = this.map.capitals.find((c) => c.factionId === 1);
    if (initialCap) {
      this.candidateFoundingCell = this.map.getCell(initialCap.x, initialCap.y);
    }
  }

  initFactions() {
    const isSandbox = this.gameMode === "sandbox";
    const modeConfig = isSandbox ? CONFIG.GAME_MODES.SANDBOX : CONFIG.GAME_MODES.STANDARD;

    // 1. Faction du Joueur
    const playerBanner = CONFIG.BANNER_PRESETS.find((b) => b.id === this.settings.bannerPreset) || CONFIG.BANNER_PRESETS[0];

    const playerFaction = {
      id: 1,
      name: this.settings.nationName || "Empire d'Émeraude",
      leaderName: this.settings.playerName || "Jerry",
      color: this.settings.bannerColor || playerBanner.color,
      border: this.settings.bannerBorder || playerBanner.border,
      textCode: this.settings.textCode || playerBanner.textCode,
      isPlayer: true,
      isAI: false,
      territoryCount: 0,
      population: 30,
      food: modeConfig.startingFood,
      wood: modeConfig.startingWood,
      stone: modeConfig.startingStone,
      gold: modeConfig.startingGold,
      moodScore: isSandbox ? 1000 : 0,
      stageTier: isSandbox ? 10 : 0,
      isDefeated: false,
      totalLosses: 0,
      totalKills: 0
    };
    this.factions.set(1, playerFaction);

    // 2. Factions IA (selon le nombre choisi par le joueur)
    const botCount = typeof this.settings.botCount === "number" ? this.settings.botCount : 3;
    const candidatesAI = [];

    if (this.settings.enableMarauders) {
      candidatesAI.push(CONFIG.FACTIONS[1]); // Clan Maraudeur
    }
    candidatesAI.push(CONFIG.FACTIONS[2]); // Ordre Solaire
    candidatesAI.push(CONFIG.FACTIONS[3]); // Confédération Royale
    candidatesAI.push(CONFIG.FACTIONS[4]); // Guilde d'Améthyste

    const activeBots = candidatesAI.slice(0, botCount);

    activeBots.forEach((fac) => {
      this.factions.set(fac.id, {
        ...fac,
        territoryCount: 0,
        population: 30,
        food: isSandbox ? 150 : modeConfig.startingFood,
        wood: isSandbox ? 100 : modeConfig.startingWood,
        stone: isSandbox ? 75 : modeConfig.startingStone,
        gold: isSandbox ? 100 : modeConfig.startingGold,
        moodScore: 0,
        stageTier: 0,
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

    const isSandbox = this.gameMode === "sandbox";

    // Vérifier les coûts en ressources (sauf bac à sable)
    if (!isSandbox && (
      faction.food < proto.foodCost ||
      faction.wood < proto.woodCost ||
      faction.stone < proto.stoneCost ||
      faction.gold < proto.goldCost
    )) {
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

    // Déduction des ressources (sauf bac à sable)
    if (!isSandbox) {
      faction.food -= proto.foodCost;
      faction.wood -= proto.woodCost;
      faction.stone -= proto.stoneCost;
      faction.gold -= proto.goldCost;
    }

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

    // Phase de fondation du royaume (60 secondes) : le monde attend la décision du joueur
    if (this.isFoundingCapital) {
      this.foundingCountdown -= 1 / CONFIG.TICK_RATE;
      if (this.foundingCountdown <= 0) {
        this.foundingCountdown = 0;
        this.confirmCapitalFounding();
      }
      return;
    }

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

  // Sélection d'un secteur candidat pour la capitale pendant la phase des 60s
  selectFoundingSector(cell) {
    if (!this.isFoundingCapital || !cell) return false;
    if (!cell.terrain.traversable) {
      this.addLog("§cCe secteur naturel est infranchissable. Choisissez une plaine, forêt ou colline.");
      return false;
    }
    if (cell.owner > 1) {
      this.addLog("§cCe secteur est déjà revendiqué par un autre royaume !");
      return false;
    }

    this.candidateFoundingCell = cell;
    SOUND.playClick();
    return true;
  }

  // Confirmation définitive de la fondation de la capitale
  confirmCapitalFounding(customCell = null) {
    if (!this.isFoundingCapital) return;

    const targetCell = customCell || this.candidateFoundingCell || this.findBestStartingCell();
    if (!targetCell) return;

    this.isFoundingCapital = false;
    this.candidateFoundingCell = null;

    // 1. Nettoyer l'ancienne capitale provisoire
    const oldCap = this.map.capitals.find((c) => c.factionId === 1);
    if (oldCap) {
      const oldCell = this.map.getCell(oldCap.x, oldCap.y);
      if (oldCell) {
        oldCell.isCapital = false;
        oldCell.capitalFactionId = null;
        oldCell.infrastructure = null;
        oldCell.infraHp = null;
      }
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const c = this.map.getCell(oldCap.x + dx, oldCap.y + dy);
          if (c && c.owner === 1) c.owner = 0;
        }
      }
    }

    // 2. Établir la citadelle sur le nouveau secteur
    targetCell.owner = 1;
    targetCell.isCapital = true;
    targetCell.capitalFactionId = 1;
    targetCell.infrastructure = "citadel";
    targetCell.infraHp = 800;
    targetCell.maxInfraHp = 800;

    // 3. Revendiquer les 3x3 secteurs environnants
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const neighbor = this.map.getCell(targetCell.x + dx, targetCell.y + dy);
        if (neighbor && neighbor.terrain.traversable && neighbor.owner === 0) {
          neighbor.owner = 1;
        }
      }
    }

    // 4. Mettre à jour l'enregistrement de la capitale
    const capIdx = this.map.capitals.findIndex((c) => c.factionId === 1);
    const playerCapEntry = {
      factionId: 1,
      x: targetCell.x,
      y: targetCell.y,
      name: this.settings.nationName || "Empire d'Émeraude"
    };
    if (capIdx >= 0) {
      this.map.capitals[capIdx] = playerCapEntry;
    } else {
      this.map.capitals.push(playerCapEntry);
    }

    // 5. Déployer les armées initiales autour de la nouvelle capitale
    this.units = this.units.filter((u) => u.factionId !== 1);
    this.spawnUnit(1, "pioneer", targetCell.x + 0.5, targetCell.y + 1.2);
    this.spawnUnit(1, "militia", targetCell.x - 0.8, targetCell.y + 0.2);
    this.spawnUnit(1, "militia", targetCell.x + 0.8, targetCell.y + 0.2);
    this.spawnUnit(1, "militia", targetCell.x, targetCell.y - 0.8);
    this.spawnUnit(1, "archer", targetCell.x - 1.2, targetCell.y - 0.8);
    this.spawnUnit(1, "archer", targetCell.x + 1.2, targetCell.y - 0.8);

    this.updateTerritoryCounts();
    SOUND.playFanfare();
    this.addLog(`§a§l[FONDATION ROYALE] Capitale établie en (${targetCell.x}, ${targetCell.y}) sur ${targetCell.terrain.name} !`);
  }

  findBestStartingCell() {
    const cap = this.map.capitals.find((c) => c.factionId === 1);
    if (cap) {
      const cell = this.map.getCell(cap.x, cap.y);
      if (cell) return cell;
    }
    for (let i = 0; i < this.map.grid.length; i++) {
      const c = this.map.grid[i];
      if (c.terrain.id === "plain" && c.owner === 0) return c;
    }
    return this.map.grid[0];
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
      cell.maxInfraHp = cell.infraHp;
    }

    cell.infraHp -= damage;

    if (cell.infraHp <= 0) {
      const infraName = cell.infrastructure;
      const isCapital = cell.isCapital;
      const ownerId = cell.owner;
      const owner = this.factions.get(ownerId);
      const attacker = this.factions.get(attackerFactionId);

      cell.infrastructure = null;
      cell.infraHp = null;
      cell.maxInfraHp = null;

      if (isCapital && owner) {
        cell.isCapital = false;
        cell.owner = attackerFactionId;
        owner.isDefeated = true;

        // Dissoudre les troupes restantes de la nation vaincue
        this.units = this.units.filter((u) => u.factionId !== ownerId);

        // Neutraliser les autres territoires de la faction défaite
        for (let y = 0; y < this.map.height; y++) {
          for (let x = 0; x < this.map.width; x++) {
            const c = this.map.getCell(x, y);
            if (c && c.owner === ownerId) {
              c.owner = 0;
              c.infrastructure = null;
              c.infraHp = null;
              c.maxInfraHp = null;
            }
          }
        }

        const capitalMsg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
          ? `§c§l[CAPITAL FALLEN] The Citadel of ${owner.name} has been razed by ${attacker ? attacker.name : "the enemy"}! The realm has collapsed!`
          : `§c§l[CAPITALE TOMBÉE] La citadelle de ${owner.name} a été rasée par ${attacker ? attacker.name : "l'ennemi"} ! La nation est anéantie !`;
        this.addLog(capitalMsg);
        SOUND.playRaidAlert();

        if (attackerFactionId === 1) {
          SOUND.playFanfare();
          const conquerMsg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
            ? `§a§l[CONQUEST] You have destroyed the rival capital of ${owner.name}!`
            : `§a§l[CONQUÊTE MAJEURE] Vous avez détruit la capitale rivale de ${owner.name} !`;
          this.addLog(conquerMsg);
        }

        // Vérifier si la capitale du joueur est tombée
        if (ownerId === 1) {
          this.onPlayerDefeat();
        } else {
          // Vérifier si toutes les factions rivales sont vaincues
          const remainingRivals = Array.from(this.factions.values()).filter((f) => f.id !== 1 && !f.isDefeated);
          if (remainingRivals.length === 0) {
            this.onPlayerVictory();
          }
        }
      } else {
        const destroyedMsg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
          ? `§6A building (${infraName}) was destroyed.`
          : `§6Un bâtiment (${infraName}) a été détruit.`;
        this.addLog(destroyedMsg);
      }

      this.updateTerritoryCounts();
    }
  }

  onPlayerVictory() {
    this.isPaused = true;
    SOUND.playFanfare();
    const msg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
      ? "§6§l[ROYAL VICTORY] All rival capitals have fallen! You reign supreme across the realm!"
      : "§6§l[VICTOIRE ROYALE] Toutes les capitales rivales sont tombées ! Vous régnez sans partage sur le monde !";
    this.addLog(msg);
    if (this.onVictoryCallback) this.onVictoryCallback();
  }

  onPlayerDefeat() {
    this.isPaused = true;
    SOUND.playRaidAlert();
    const msg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
      ? "§4§l[ROYAL DEFEAT] Your Capital has fallen! Your realm has collapsed into ashes..."
      : "§4§l[DÉFAITE ROYALE] Votre Capitale est tombée ! Votre royaume s'est effondré dans les flammes...";
    this.addLog(msg);
    if (this.onDefeatCallback) this.onDefeatCallback();
  }

  // Banquet du crépuscule (Logique authentique Jerry's Nations jn_food)
  executeSunsetBanquet() {
    SOUND.playSunsetBell();
    this.addLog(`§6[Crépuscule - Jour ${this.dayCount}] Le banquet de la nation commence...`);

    if (this.gameMode === "sandbox") {
      const p = this.factions.get(1);
      if (p) {
        p.food = 99999;
        p.wood = 99999;
        p.stone = 99999;
        p.gold = 99999;
        p.moodScore = 1000;
        this.addLog("§a[BAC À SABLE] Festin nocturne illimité ! Rations et stocks maintenus au maximum.");
      }
      return;
    }

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

  // Économie en continu liée directement aux biomes des secteurs
  updateEconomy() {
    this.factions.forEach((f) => {
      if (f.isDefeated) return;

      if (this.gameMode === "sandbox" && f.isPlayer) {
        f.food = 99999;
        f.wood = 99999;
        f.stone = 99999;
        f.gold = 99999;
        return;
      }

      const moodConfig = this.getMoodState(f.moodScore);
      const moodBuff = moodConfig.speedBuff;

      let foodProd = 0.5;
      let woodProd = 0.5;
      let stoneProd = 0.3;
      let goldProd = 0.2;

      // Calcul des rendements selon chaque secteur contrôlé
      for (let i = 0; i < this.map.grid.length; i++) {
        const cell = this.map.grid[i];
        if (cell.owner === f.id) {
          // Rendement naturel du biome
          if (cell.terrain.baseFood) foodProd += cell.terrain.baseFood * 0.15;
          if (cell.terrain.baseWood) woodProd += cell.terrain.baseWood * 0.15;
          if (cell.terrain.baseStone) stoneProd += cell.terrain.baseStone * 0.15;
          if (cell.terrain.baseGold) goldProd += cell.terrain.baseGold * 0.12;

          // Rendement décuplé par l'infrastructure spécialisée
          if (cell.infrastructure) {
            const infra = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
            if (infra) {
              if (infra.foodBonus) foodProd += infra.foodBonus * 0.25;
              if (infra.woodBonus) woodProd += infra.woodBonus * 0.25;
              if (infra.stoneBonus) stoneProd += infra.stoneBonus * 0.25;
              if (infra.goldBonus) goldProd += infra.goldBonus * 0.25;
            }
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

    // 1. Vérification stricte du biome autorisé (Impact réel du terrain !)
    if (infra.allowedTerrain && !infra.allowedTerrain.includes(cell.terrain.id)) {
      if (factionId === 1) {
        const allowedNames = infra.allowedTerrain.map((tid) => {
          const t = Object.values(CONFIG.TERRAIN).find((val) => val.id === tid);
          return t ? t.name : tid;
        }).join(" ou ");
        this.addLog(`§cEmplacement invalide : la ${infra.name} requiert un secteur de type ${allowedNames} !`);
        SOUND.playClick();
      }
      return false;
    }

    // 2. Vérification de possession
    if (infra.id === "outpost") {
      if (cell.owner !== 0 && cell.owner !== factionId) return false;
    } else {
      if (cell.owner !== factionId) {
        if (factionId === 1) {
          this.addLog(`§cVous devez contrôler ce secteur pour y bâtir une infrastructure !`);
        }
        return false;
      }
    }

    if (cell.infrastructure) {
      if (factionId === 1) this.addLog("§cUn bâtiment est déjà érigé sur ce secteur.");
      return false;
    }

    const isSandbox = this.gameMode === "sandbox";
    const woodCost = isSandbox ? 0 : (infra.woodCost || 0);
    const stoneCost = isSandbox ? 0 : (infra.stoneCost || 0);
    const goldCost = isSandbox ? 0 : (infra.goldCost || 0);

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
    cell.maxInfraHp = cell.infraHp;
    cell.owner = factionId;

    // Si c'est un avant-poste, revendiquer un rayon de secteurs
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
      this.addLog(`§2${infra.name} érigé en (${x}, ${y}) sur secteur ${cell.terrain.name}.`);
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


  // ==================== MODULE: ai.js ====================
/**
 * Jerry's Nations: Frontline Realms - RTS AI Controller
 * Intelligence artificielle pour le Clan Maraudeur et les Seigneurs féodaux rivaux.
 * Recrutement autonome, manœuvres de régiments physiques, raids de pillards et construction d'avant-postes.
 */


class AIController {
  constructor(engine, worldMap) {
    this.engine = engine;
    this.map = worldMap;
    this.aiTickCounter = 0;
  }

  update() {
    this.aiTickCounter++;
    const diffKey = (this.engine.aiDifficulty || "normal").toUpperCase();
    const diff = CONFIG.DIFFICULTIES[diffKey] || CONFIG.DIFFICULTIES.NORMAL;
    const interval = Math.max(50, Math.floor(65 * diff.intervalMultiplier));

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
    this.decideConstruction(faction, myUnits, diff);

    // 3. COMMANDEMENT MILITAIRE DES UNITÉS INACTIVES
    this.commandUnits(faction, myUnits, diff);
  }

  decideRecruitment(faction, myUnits, diff) {
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

  decideConstruction(faction, myUnits, diff) {
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

  commandUnits(faction, myUnits, diff) {
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
    const effectiveDiff = diff || CONFIG.DIFFICULTIES.NORMAL;
    const minSquad = effectiveDiff && effectiveDiff.id === "peaceful" ? 6 : (effectiveDiff && effectiveDiff.id === "hard" ? 2 : 3);
    if (idleMilitary.length >= minSquad) {
      // Former une escouade d'assaut
      const targetEnemy = this.findEnemyTarget(fid, idleMilitary[0].x, idleMilitary[0].y, faction.personality === "aggressive", effectiveDiff);
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


  // ==================== MODULE: network.js ====================
/**
 * Jerry's Nations: Frontline Realms - P2P WebRTC Multiplayer & Room Lobby (PeerJS)
 * Synchronisation du salon d'attente (souverains connectés, slots, bannières),
 * diffusion du lancement de partie (seed et factions) et synchronisation des ordres RTS.
 */

class NetworkManager {
  constructor(engine) {
    this.engine = engine;
    this.peer = null;
    this.connections = [];
    this.hostConn = null;
    this.isHost = false;
    this.isConnected = false;
    this.myPlayerId = 1; // 1 = Faction joueur hôte
    this.roomId = null;

    this.lobbyPlayers = [];
    this.onPlayerUpdated = null;
    this.onStartGameCallback = null;
  }

  // Création d'un salon multijoueur par l'Hôte
  createRoom(hostPlayerInfo, onRoomCreated, onPlayerUpdated, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé. Vérifiez votre connexion Internet.");
      return;
    }

    this.onPlayerUpdated = onPlayerUpdated;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const peerId = `jerry-realm-${randomSuffix}`;

    try {
      this.peer = new window.Peer(peerId);

      this.peer.on("open", (id) => {
        this.isHost = true;
        this.isConnected = true;
        this.roomId = id;
        this.myPlayerId = 1;

        // Slot 1 : L'Hôte
        this.lobbyPlayers = [
          {
            id: 1,
            name: hostPlayerInfo.name || "Jerry",
            nationName: hostPlayerInfo.nationName || "Empire d'Émeraude",
            color: hostPlayerInfo.color || "#1b7a63",
            border: hostPlayerInfo.border || "#22c55e",
            avatarUrl: hostPlayerInfo.avatarUrl || "textures/ui/me.gif",
            isHost: true,
            isReady: true
          }
        ];

        if (onRoomCreated) onRoomCreated(id, this.lobbyPlayers);
        if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
      });

      this.peer.on("connection", (conn) => {
        this.handleIncomingClient(conn);
      });

      this.peer.on("error", (err) => {
        console.warn("Erreur P2P Host:", err);
        if (onError) onError(err.message || "Erreur de création de salon.");
      });
    } catch (e) {
      if (onError) onError(e.message);
    }
  }

  // Connexion d'un Client à un salon existant
  joinRoom(targetRoomId, clientPlayerInfo, onJoined, onPlayerUpdated, onStartGame, onError) {
    if (typeof window.Peer === "undefined") {
      if (onError) onError("PeerJS non chargé. Vérifiez votre connexion Internet.");
      return;
    }

    this.onPlayerUpdated = onPlayerUpdated;
    this.onStartGameCallback = onStartGame;

    try {
      this.peer = new window.Peer();

      this.peer.on("open", () => {
        const cleanRoomId = targetRoomId.trim();
        const conn = this.peer.connect(cleanRoomId);

        conn.on("open", () => {
          this.hostConn = conn;
          this.isHost = false;
          this.isConnected = true;
          this.roomId = cleanRoomId;

          // Présentation du joueur à l'hôte
          conn.send({
            type: "PLAYER_HELLO",
            player: {
              name: clientPlayerInfo.name || "Souverain Allié",
              nationName: clientPlayerInfo.nationName || "Royaume Saphir",
              color: clientPlayerInfo.color || "#1d4ed8",
              border: clientPlayerInfo.border || "#06b6d4",
              avatarUrl: clientPlayerInfo.avatarUrl || "textures/ui/me.gif"
            }
          });

          if (onJoined) onJoined(cleanRoomId);
        });

        conn.on("data", (data) => {
          this.handleHostData(data);
        });

        conn.on("error", () => {
          if (onError) onError("Échec de connexion au salon de l'hôte.");
        });

        conn.on("close", () => {
          this.isConnected = false;
          if (this.onPlayerUpdated) this.onPlayerUpdated([]);
        });
      });

      this.peer.on("error", (err) => {
        if (onError) onError(err.message || "Erreur de liaison P2P.");
      });
    } catch (e) {
      if (onError) onError(e.message);
    }
  }

  handleIncomingClient(conn) {
    this.connections.push(conn);

    conn.on("data", (data) => {
      if (data.type === "PLAYER_HELLO") {
        const assignedId = this.lobbyPlayers.length + 1;
        const newPlayer = {
          id: assignedId,
          name: data.player.name,
          nationName: data.player.nationName,
          color: data.player.color,
          border: data.player.border,
          avatarUrl: data.player.avatarUrl,
          isHost: false,
          isReady: true,
          conn
        };

        this.lobbyPlayers.push(newPlayer);

        // Diffuser la mise à jour des slots à tous les joueurs connectés
        this.broadcastRoomSync();
        if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
      } else {
        this.handleClientCommand(data);
      }
    });

    conn.on("close", () => {
      this.connections = this.connections.filter((c) => c !== conn);
      this.lobbyPlayers = this.lobbyPlayers.filter((p) => p.conn !== conn);
      this.broadcastRoomSync();
      if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
    });
  }

  broadcastRoomSync() {
    const serializedPlayers = this.lobbyPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      nationName: p.nationName,
      color: p.color,
      border: p.border,
      avatarUrl: p.avatarUrl,
      isHost: p.isHost,
      isReady: p.isReady
    }));

    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send({
          type: "ROOM_SYNC",
          players: serializedPlayers
        });
      }
    });
  }

  // Lancement de la partie par l'Hôte
  broadcastStartGame(gameConfig) {
    const seed = Date.now();
    const serializedPlayers = this.lobbyPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      nationName: p.nationName,
      color: p.color,
      border: p.border,
      avatarUrl: p.avatarUrl,
      isHost: p.isHost
    }));

    const payload = {
      type: "START_GAME",
      seed,
      gameConfig,
      players: serializedPlayers
    };

    this.connections.forEach((conn) => {
      if (conn.open) conn.send(payload);
    });

    return payload;
  }

  handleHostData(data) {
    if (data.type === "ROOM_SYNC") {
      this.lobbyPlayers = data.players;
      // Déterminer son propre ID parmi la liste
      const me = this.lobbyPlayers.find((p) => !p.isHost && p.name === this.engine?.settings?.playerName) || this.lobbyPlayers[this.lobbyPlayers.length - 1];
      if (me) {
        this.myPlayerId = me.id;
      }
      if (this.onPlayerUpdated) this.onPlayerUpdated(this.lobbyPlayers);
    } else if (data.type === "START_GAME") {
      if (this.onStartGameCallback) {
        this.onStartGameCallback(data);
      }
    } else if (data.type === "MOVE_SYNC") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine?.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
    }
  }

  handleClientCommand(data) {
    if (data.type === "MOVE") {
      data.unitIds.forEach((uid) => {
        const unit = this.engine?.units.find((u) => u.id === uid);
        if (unit) unit.moveTo(data.targetX, data.targetY);
      });
      // Relayer l'ordre à tous les autres clients
      this.connections.forEach((conn) => {
        if (conn.open) conn.send({ ...data, type: "MOVE_SYNC" });
      });
    } else if (data.type === "RECRUIT") {
      this.engine?.recruitUnit(data.factionId, data.unitType);
    } else if (data.type === "BUILD") {
      this.engine?.buildInfrastructure(data.factionId, data.x, data.y, data.infraType);
    }
  }

  sendMove(unitIds, targetX, targetY) {
    const payload = {
      type: "MOVE",
      factionId: this.myPlayerId,
      unitIds,
      targetX,
      targetY
    };

    if (this.isHost) {
      this.connections.forEach((conn) => {
        if (conn.open) conn.send({ ...payload, type: "MOVE_SYNC" });
      });
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(payload);
    }
  }

  leaveRoom() {
    if (this.hostConn) {
      this.hostConn.close();
      this.hostConn = null;
    }
    this.connections.forEach((c) => c.close());
    this.connections = [];
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
    this.isConnected = false;
    this.lobbyPlayers = [];
  }
}



  // ==================== MODULE: renderer.js ====================
/**
 * Jerry's Nations: Frontline Realms - Strategic Sector Canvas 2D Renderer
 * Rendu haute performance 60 FPS des secteurs quadrillés de 56px.
 * Visualisation riche des biomes (arbres en forêt, champs de blé en plaine, roches en collines, pics enneigés),
 * bâtiments médiévaux, unités physiques, balistique en cloche et interface de survol.
 */


class MapRenderer {
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

    // 6b. Surbrillance du site candidat de Capitale en phase de fondation (60s)
    if (this.engine.isFoundingCapital && this.engine.candidateFoundingCell) {
      this.drawCandidateFoundingHighlight(ctx, this.engine.candidateFoundingCell, cellSize);
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
      if (ctx.ellipse) {
        ctx.ellipse(px, py, 4 * this.scale, 2.5 * this.scale, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(px, py, 3 * this.scale, 0, Math.PI * 2);
      }
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

    // Barre de PV de la Capitale
    const maxHp = cell.maxInfraHp || 800;
    const currentHp = cell.infraHp !== undefined && cell.infraHp !== null ? cell.infraHp : maxHp;
    const barW = s * 0.76;
    const barH = 5;
    const barX = px + (s - barW) / 2;
    const barY = py + 3;
    const hpRatio = Math.max(0, Math.min(1, currentHp / maxHp));

    // Fond
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    // Barre colorée
    ctx.fillStyle = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.25 ? "#eab308" : "#ef4444";
    ctx.fillRect(barX, barY, barW * hpRatio, barH);

    // Bordure dorée prestigieuse
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);

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

    // Barre de points de vie (PV) du bâtiment si endommagé ou s'il s'agit d'une Citadelle / Capitale
    if (cell.infraHp !== null && cell.infraHp !== undefined) {
      const maxHp = cell.maxInfraHp || (CONFIG.INFRASTRUCTURES[type.toUpperCase()]?.hp || 200);
      const isDamaged = cell.infraHp < maxHp;
      const isImportant = cell.isCapital || type === "citadel" || type === "watchtower";

      if (isDamaged || isImportant) {
        const barW = s * 0.7;
        const barH = 4;
        const barX = px + (s - barW) / 2;
        const barY = py + 3;

        const hpRatio = Math.max(0, Math.min(1, cell.infraHp / maxHp));

        // Fond sombre
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

        // Couleur dynamique selon le pourcentage de vie restant
        if (hpRatio > 0.5) ctx.fillStyle = "#22c55e"; // Vert
        else if (hpRatio > 0.25) ctx.fillStyle = "#eab308"; // Jaune
        else ctx.fillStyle = "#ef4444"; // Rouge critique

        ctx.fillRect(barX, barY, barW * hpRatio, barH);

        // Bordure dorée pour la Capitale
        if (cell.isCapital) {
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 1;
          ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);
        }
      }
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
    const labelW = 130;
    const labelH = 22;
    ctx.fillRect(px + cellSize / 2 - labelW / 2, py - labelH - 4, labelW, labelH);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.strokeRect(px + cellSize / 2 - labelW / 2, py - labelH - 4, labelW, labelH);

    ctx.fillStyle = "#fef08a";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    const biomeName = (typeof I18N !== "undefined" && I18N.getBiomeName)
      ? I18N.getBiomeName(cell.terrain.id)
      : cell.terrain.name;
    const isCap = cell.isCapital ? (typeof I18N !== "undefined" && I18N.currentLang === "en" ? " (Capital)" : " (Capitale)") : "";
    ctx.fillText(`${biomeName}${isCap}`, px + cellSize / 2, py - 9);
    ctx.restore();
  }

  drawCandidateFoundingHighlight(ctx, cell, cellSize) {
    const px = cell.x * cellSize;
    const py = cell.y * cellSize;

    ctx.save();
    // 1. Périmètre 3x3 projeté de la future colonie
    ctx.strokeStyle = "rgba(234, 179, 8, 0.75)";
    ctx.lineWidth = Math.max(2, 3 * this.scale);
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(px - cellSize, py - cellSize, cellSize * 3, cellSize * 3);
    ctx.setLineDash([]);

    // 2. Halo d'emplacement de la Citadelle avec pulsation
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
    ctx.fillStyle = `rgba(234, 179, 8, ${0.28 + 0.22 * pulse})`;
    ctx.fillRect(px, py, cellSize, cellSize);

    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = Math.max(2.5, 4 * this.scale);
    ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);

    // 3. Texte d'information clair
    ctx.fillStyle = "rgba(20, 15, 10, 0.9)";
    const tagW = Math.max(130, 140 * this.scale);
    const tagH = 24;
    ctx.fillRect(px + cellSize / 2 - tagW / 2, py - tagH - 6, tagW, tagH);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px + cellSize / 2 - tagW / 2, py - tagH - 6, tagW, tagH);

    ctx.fillStyle = "#fef08a";
    ctx.font = `bold ${Math.max(10, 11 * this.scale)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("FUTUR SITE DE CITADELLE", px + cellSize / 2, py - 10);

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


  // ==================== MODULE: ui.js ====================
/**
 * Jerry's Nations: Frontline Realms - RTS UI Controller & Tactical Command Dock
 * Sélection directe (clic & Marquee Box Select), ordres de déplacement/attaque au clic droit,
 * recrutement de bataillons, expéditions rapides et gestion des infrastructures.
 */




class UIManager {
  constructor(engine, renderer, network) {
    this.engine = engine;
    this.renderer = renderer;
    this.network = network;

    this.selectedUnits = [];
    this.selectedBuildMode = null;
    this.inspectedCell = null;

    this.bindDomElements();
    this.setupLanguageControls();
    this.setupCameraAndMenuControls();
    this.setupMinimizationControls();
    this.setupRTSMouseControls();
    this.setupRecruitmentControls();
    this.setupBuildControls();

    // Callbacks de fin de partie
    this.engine.onVictoryCallback = () => this.showGameEndModal(true);
    this.engine.onDefeatCallback = () => this.showGameEndModal(false);
  }

  bindDomElements() {
    this.elPlayerName = document.getElementById("hud-player-name");
    this.elPlayerAvatar = document.getElementById("hud-player-avatar");
    this.elNationName = document.getElementById("hud-nation-name");
    this.elStageBadge = document.getElementById("hud-stage-badge");
    this.elMoodValue = document.getElementById("hud-mood-value");
    this.elMoodBar = document.getElementById("hud-mood-bar");
    this.elMoodStatus = document.getElementById("hud-mood-status");

    this.elFood = document.getElementById("res-food");
    this.elWood = document.getElementById("res-wood");
    this.elStone = document.getElementById("res-stone");
    this.elGold = document.getElementById("res-gold");
    this.elTroops = document.getElementById("res-troops");
    this.elTerritory = document.getElementById("res-territory");

    this.elDayDisplay = document.getElementById("hud-day-display");
    this.elMuteBtn = document.getElementById("btn-toggle-sound");
    this.elBtnPause = document.getElementById("btn-hud-pause");

    this.elSelectionInfo = document.getElementById("selection-info-text");
    this.elBtnHalt = document.getElementById("btn-order-halt");

    // Éléments du panneau d'information de secteur
    this.elSectorCoord = document.getElementById("sector-coord");
    this.elSectorBiomeBadge = document.getElementById("sector-biome-badge");
    this.elSectorOwner = document.getElementById("sector-owner");
    this.elSectorInfra = document.getElementById("sector-infra");
    this.elSectorDefense = document.getElementById("sector-defense");
    this.elSectorYields = document.getElementById("sector-yields");
    this.elSectorTacticalNote = document.getElementById("sector-tactical-note");

    // Panneaux et poignées de réduction
    this.topHud = document.getElementById("top-hud");
    this.bottomDock = document.getElementById("bottom-dock");
    this.sidebarBuildings = document.getElementById("sidebar-buildings");
    this.btnToggleTopHud = document.getElementById("btn-toggle-top-hud");
    this.btnToggleBottomDock = document.getElementById("btn-toggle-bottom-dock");
    this.btnToggleBuildings = document.getElementById("btn-toggle-buildings-panel");

    // Bouton Ordre Halte
    if (this.elBtnHalt) {
      this.elBtnHalt.addEventListener("click", () => {
        this.selectedUnits.forEach((u) => {
          u.targetX = null;
          u.targetY = null;
          u.targetUnit = null;
          u.state = "idle";
        });
        SOUND.playClick();
      });
    }

    // Bouton Pause Directe In-Game
    if (this.elBtnPause) {
      this.elBtnPause.addEventListener("click", () => {
        this.engine.isPaused = !this.engine.isPaused;
        this.elBtnPause.textContent = this.engine.isPaused ? "REPRENDRE" : "PAUSE";
        this.elBtnPause.classList.toggle("btn-gold", this.engine.isPaused);
        SOUND.playClick();
      });
    }

    // Bouton Son On/Off
    if (this.elMuteBtn) {
      this.elMuteBtn.addEventListener("click", () => {
        const isMuted = SOUND.toggleMute();
        this.elMuteBtn.textContent = isMuted ? I18N.t("soundMuted") : I18N.t("soundActive");
        this.elMuteBtn.classList.toggle("muted", isMuted);
      });
    }

    // Bandeau de fondation de la capitale (60s)
    this.elFoundingBanner = document.getElementById("founding-capital-banner");
    this.elFoundingCountdown = document.getElementById("founding-countdown-sec");
    this.elBtnConfirmFounding = document.getElementById("btn-confirm-founding");

    if (this.elBtnConfirmFounding) {
      this.elBtnConfirmFounding.addEventListener("click", () => {
        this.engine.confirmCapitalFounding();
        this.renderer.centerCameraOnPlayerCapital();
        this.updateFoundingBanner();
        SOUND.playClick();
      });
    }
  }

  setupLanguageControls() {
    I18N.applyToDOM();
  }

  // Configuration des contrôles de minimisation / réduction des interfaces
  setupMinimizationControls() {
    // 1. Réduction du Top HUD
    if (this.btnToggleTopHud && this.topHud) {
      this.btnToggleTopHud.addEventListener("click", () => {
        this.topHud.classList.toggle("collapsed");
        const isCollapsed = this.topHud.classList.contains("collapsed");
        this.btnToggleTopHud.textContent = isCollapsed ? "▼" : "▲";
        SOUND.playClick();
      });
    }

    // 2. Réduction du Volet Inférieur de Commandement
    if (this.btnToggleBottomDock && this.bottomDock) {
      this.btnToggleBottomDock.addEventListener("click", () => {
        this.bottomDock.classList.toggle("collapsed");
        const isCollapsed = this.bottomDock.classList.contains("collapsed");
        this.btnToggleBottomDock.innerHTML = isCollapsed
          ? `<span class="toggle-icon">▲</span> <span class="toggle-text">COMMANDEMENT & SECTEUR</span>`
          : `<span class="toggle-icon">▼</span> <span class="toggle-text">COMMANDEMENT & SECTEUR</span>`;
        SOUND.playClick();
      });
    }

    // 3. Réduction / Déploiement du Tiroir Latéral des Bâtiments
    if (this.btnToggleBuildings && this.sidebarBuildings) {
      this.btnToggleBuildings.addEventListener("click", () => {
        this.sidebarBuildings.classList.toggle("collapsed");
        const isCollapsed = this.sidebarBuildings.classList.contains("collapsed");
        const icon = this.btnToggleBuildings.querySelector(".toggle-icon");
        if (icon) {
          icon.textContent = isCollapsed ? "◀" : "▶";
        }
        SOUND.playClick();
      });
    }
  }

  setupCameraAndMenuControls() {
    const btnCenter = document.getElementById("btn-center-camera");
    const btnMenu = document.getElementById("btn-open-menu");
    const modal = document.getElementById("pause-modal");
    const btnResume = document.getElementById("modal-btn-resume");
    const btnModalCenter = document.getElementById("modal-btn-center");
    const btnToggleEdge = document.getElementById("modal-btn-toggle-edge-scroll");
    const btnQuit = document.getElementById("modal-btn-quit-lobby");

    if (btnCenter) {
      btnCenter.addEventListener("click", () => {
        this.renderer.centerCameraOnPlayerCapital();
        SOUND.playClick();
      });
    }

    const openPauseMenu = () => {
      if (modal) modal.classList.remove("hidden");
      this.engine.isPaused = true;
      SOUND.playClick();
    };

    const closePauseMenu = () => {
      if (modal) modal.classList.add("hidden");
      this.engine.isPaused = false;
      SOUND.playClick();
    };

    if (btnMenu) {
      btnMenu.addEventListener("click", openPauseMenu);
    }

    if (btnResume) {
      btnResume.addEventListener("click", closePauseMenu);
    }

    if (btnModalCenter) {
      btnModalCenter.addEventListener("click", () => {
        this.renderer.centerCameraOnPlayerCapital();
        closePauseMenu();
      });
    }

    if (btnToggleEdge) {
      btnToggleEdge.addEventListener("click", () => {
        this.renderer.edgeScrollEnabled = !this.renderer.edgeScrollEnabled;
        btnToggleEdge.textContent = this.renderer.edgeScrollEnabled
          ? "DÉFILEMENT BORD ÉCRAN : ACTIF"
          : "DÉFILEMENT BORD ÉCRAN : DÉSACTIVÉ";
        SOUND.playClick();
      });
    }

    if (btnQuit) {
      btnQuit.addEventListener("click", () => {
        if (this.onQuitToLobby) {
          this.onQuitToLobby();
        } else {
          location.reload();
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (modal && !modal.classList.contains("hidden")) {
          closePauseMenu();
        } else {
          openPauseMenu();
        }
      }
    });
  }

  // Commandes de recrutement d'unités
  setupRecruitmentControls() {
    document.querySelectorAll(".btn-recruit-unit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const unitType = btn.dataset.unitType;
        const myPlayerId = this.network.myPlayerId;
        const newUnit = this.engine.recruitUnit(myPlayerId, unitType);
        if (newUnit) {
          this.selectSingleUnit(newUnit);
        }
      });
    });
  }

  setupBuildControls() {
    document.querySelectorAll(".btn-build-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.buildType;
        if (this.selectedBuildMode === type) {
          this.selectedBuildMode = null;
          btn.classList.remove("active");
          this.updateSelectionDisplay();
        } else {
          this.selectedBuildMode = type;
          document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          SOUND.playClick();

          const proto = CONFIG.INFRASTRUCTURES[type.toUpperCase()];
          if (proto && this.elSelectionInfo) {
            const req = proto.allowedTerrain
              ? proto.allowedTerrain.map((tid) => Object.values(CONFIG.TERRAIN).find((v) => v.id === tid)?.name || tid).join(" ou ")
              : "Tous";
            this.elSelectionInfo.innerHTML = `
              <span style="color:var(--parchment-gold)">MODE CONSTRUCTION : Cliquez sur un secteur contrôlé (Biome requis : <strong>${req}</strong>)</span>
            `;
          }
        }
      });
    });
  }

  // Contrôles Souris RTS (Sélection & Ordres)
  setupRTSMouseControls() {
    const canvas = this.renderer.canvas;
    let isMouseDown = false;
    let startScreenX = 0;
    let startScreenY = 0;
    let hasDragged = false;

    // Clic gauche : Sélection ou Construction
    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || e.shiftKey) return;

      const rect = canvas.getBoundingClientRect();
      startScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
      startScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

      isMouseDown = true;
      hasDragged = false;

      this.renderer.boxStartX = startScreenX;
      this.renderer.boxStartY = startScreenY;
      this.renderer.boxEndX = startScreenX;
      this.renderer.boxEndY = startScreenY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;

      const rect = canvas.getBoundingClientRect();
      const curX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const curY = (e.clientY - rect.top) * (canvas.height / rect.height);

      this.renderer.boxEndX = curX;
      this.renderer.boxEndY = curY;

      if (Math.hypot(curX - startScreenX, curY - startScreenY) > 18) {
        hasDragged = true;
        this.renderer.isBoxSelecting = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.renderer.isBoxSelecting = false;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

      const myPlayerId = this.network.myPlayerId;

      // 0. Phase de fondation du royaume (60s) : Sélection du site de Capitale
      if (this.engine.isFoundingCapital && !hasDragged) {
        const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
        if (cell) {
          const selected = this.engine.selectFoundingSector(cell);
          if (selected) {
            this.inspectedCell = cell;
            this.updateSectorInfoDisplay();
          }
          this.updateFoundingBanner();
        }
        return;
      }

      // 1. Mode Construction actif
      if (this.selectedBuildMode && !hasDragged) {
        const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
        if (cell) {
          const success = this.engine.buildInfrastructure(myPlayerId, cell.x, cell.y, this.selectedBuildMode);
          if (success && !e.shiftKey) {
            this.selectedBuildMode = null;
            document.querySelectorAll(".btn-build-action").forEach((b) => b.classList.remove("active"));
          }
        }
        return;
      }

      // 2. Sélection par Box Select (Marquee)
      if (hasDragged) {
        const minScreenX = Math.min(startScreenX, mouseX);
        const maxScreenX = Math.max(startScreenX, mouseX);
        const minScreenY = Math.min(startScreenY, mouseY);
        const maxScreenY = Math.max(startScreenY, mouseY);

        this.deselectAll();

        this.engine.units.forEach((u) => {
          if (u.factionId === myPlayerId && u.hp > 0) {
            const screenPos = this.renderer.worldToScreen(u.x, u.y);
            if (
              screenPos.x >= minScreenX &&
              screenPos.x <= maxScreenX &&
              screenPos.y >= minScreenY &&
              screenPos.y <= maxScreenY
            ) {
              u.isSelected = true;
              this.selectedUnits.push(u);
            }
          }
        });

        if (this.selectedUnits.length > 0) {
          SOUND.playClick();
        } else {
          // Aucun bataillon encadré : sélectionner et inspecter le secteur sous le curseur
          const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
          if (cell) {
            this.inspectedCell = cell;
            this.updateSectorInfoDisplay();
            SOUND.playClick();
          }
        }
        this.updateSelectionDisplay();
        return;
      }

      // 3. Clic simple gauche : Sélection d'une seule unité ou inspection de secteur
      const cell = this.renderer.screenToWorldCell(mouseX, mouseY);
      if (!cell) return;

      const clickedUnit = this.engine.units.find(
        (u) => Math.hypot(u.x - (cell.x + 0.5), u.y - (cell.y + 0.5)) < 1.0 && u.hp > 0
      );

      if (clickedUnit && clickedUnit.factionId === myPlayerId) {
        this.selectSingleUnit(clickedUnit);
      } else {
        this.deselectAll();
        // Mémoriser le secteur inspecté
        this.inspectedCell = cell;
        this.updateSectorInfoDisplay();
        SOUND.playClick();
      }

      this.updateSelectionDisplay();
    });

    // Clic droit : Ordre de déplacement ou Attaque
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (this.renderer.hasRightDragged) return;
      if (this.selectedUnits.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const cell = this.renderer.screenToWorldCell(mouseX, mouseY);

      if (!cell) return;

      const myPlayerId = this.network.myPlayerId;

      // 1. Vérifier si un bataillon ennemi a été ciblé
      const targetEnemy = this.engine.units.find(
        (u) => u.factionId !== myPlayerId && Math.hypot(u.x - (cell.x + 0.5), u.y - (cell.y + 0.5)) < 1.4 && u.hp > 0
      );

      if (targetEnemy) {
        // ORDRE D'ATTAQUE D'UNITÉ
        this.selectedUnits.forEach((u) => {
          u.attackTarget(targetEnemy);
        });
        this.renderer.addOrderRipple(mouseX, mouseY, true);
        SOUND.playCharge();
      } else if (cell.owner !== 0 && cell.owner !== myPlayerId && cell.infrastructure) {
        // ORDRE DE SIÈGE DE BÂTIMENT / CITADELLE / CAPITALE ENNEMIE
        this.selectedUnits.forEach((u) => {
          u.attackBuilding(cell);
        });
        this.renderer.addOrderRipple(mouseX, mouseY, true);
        SOUND.playCharge();
        const bldName = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()]?.name || cell.infrastructure;
        const msg = (typeof I18N !== "undefined" && I18N.currentLang === "en")
          ? `[ASSAULT] Siege ordered on enemy ${bldName} (${cell.infraHp || 200} HP)!`
          : `[ASSAUT] Siège ordonné sur ${bldName} ennemie (${cell.infraHp || 200} PV) !`;
        this.engine.addLog(`§c${msg}`);
      } else {
        // ORDRE DE DÉPLACEMENT EN FORMATION
        const count = this.selectedUnits.length;
        const cols = Math.ceil(Math.sqrt(count));

        this.selectedUnits.forEach((u, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const offsetX = (col - cols / 2) * 0.7;
          const offsetY = (row - cols / 2) * 0.7;

          u.moveTo(cell.x + offsetX, cell.y + offsetY);
        });

        this.renderer.addOrderRipple(mouseX, mouseY, false);
        SOUND.playClick();
      }
    });
  }

  selectSingleUnit(unit) {
    this.deselectAll();
    unit.isSelected = true;
    this.selectedUnits = [unit];
    SOUND.playClick();
    this.updateSelectionDisplay();
  }

  deselectAll() {
    this.selectedUnits.forEach((u) => (u.isSelected = false));
    this.selectedUnits = [];
    this.updateSelectionDisplay();
  }

  updateSelectionDisplay() {
    if (!this.elSelectionInfo) return;

    if (this.selectedUnits.length === 0) {
      this.elSelectionInfo.innerHTML = `<span class="mc-gray">${I18N.t("noUnitsSelected")}</span>`;
      return;
    }

    const counts = {};
    this.selectedUnits.forEach((u) => {
      const uName = I18N.getUnitName(u.type);
      counts[uName] = (counts[uName] || 0) + 1;
    });

    const summary = Object.entries(counts)
      .map(([name, num]) => `<strong>${num}</strong> ${name}`)
      .join(", ");

    const totalHp = this.selectedUnits.reduce((acc, u) => acc + u.hp, 0);
    const maxHp = this.selectedUnits.reduce((acc, u) => acc + u.maxHp, 0);

    this.elSelectionInfo.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <span>${I18N.t("battalionsSelected")} <strong style="color:var(--parchment-green)">${summary}</strong> (${this.selectedUnits.length})</span>
        <span style="font-family:var(--font-mono); font-size:11px; color:#57442d;">${I18N.t("hpLabel")} ${totalHp}/${maxHp}</span>
      </div>
    `;
  }

  // Boucle de rafraîchissement continue du HUD
  updateHUD() {
    const myPlayerId = this.network.myPlayerId;
    const playerFaction = this.engine.factions.get(myPlayerId);
    if (!playerFaction) return;

    // Nom et Bannière
    if (this.elNationName) {
      this.elNationName.textContent = playerFaction.name;
      this.elNationName.style.color = playerFaction.border;
    }

    // Stade de progression ou Mode Bac à Sable
    if (this.elStageBadge) {
      if (this.engine.gameMode === "sandbox") {
        this.elStageBadge.textContent = I18N.currentLang === "fr" ? "[BAC À SABLE]" : "[SANDBOX]";
        this.elStageBadge.style.color = "var(--parchment-gold)";
      } else {
        const stage = CONFIG.STAGES[playerFaction.stageTier];
        if (stage) {
          this.elStageBadge.textContent = `[T${stage.tier}] ${stage.name}`;
          this.elStageBadge.style.color = "";
        }
      }
    }

    // Scoreboard Mood
    const moodState = this.engine.getMoodState(playerFaction.moodScore);
    if (this.elMoodValue && this.elMoodStatus) {
      const scoreStr = playerFaction.moodScore >= 0 ? `+${playerFaction.moodScore}` : `${playerFaction.moodScore}`;
      this.elMoodValue.textContent = `${scoreStr} pts`;
      this.elMoodStatus.textContent = moodState.name;
      this.elMoodStatus.style.color = CONFIG.MC_COLORS[moodState.color] || "#ffffff";
    }

    if (this.elMoodBar) {
      const pct = Math.max(0, Math.min(100, ((playerFaction.moodScore + 1000) / 2000) * 100));
      this.elMoodBar.style.width = `${pct}%`;
      this.elMoodBar.style.backgroundColor = CONFIG.MC_COLORS[moodState.color] || "#249278";
    }

    // Ressources
    if (this.elFood) this.elFood.textContent = playerFaction.food;
    if (this.elWood) this.elWood.textContent = playerFaction.wood;
    if (this.elStone) this.elStone.textContent = playerFaction.stone;
    if (this.elGold) this.elGold.textContent = playerFaction.gold;

    // Compte des troupes actives
    const activeTroops = this.engine.units.filter((u) => u.factionId === myPlayerId).length;
    if (this.elTroops) this.elTroops.textContent = activeTroops;
    if (this.elTerritory) this.elTerritory.textContent = `${playerFaction.territoryCount} ${I18N.t("sectorsUnit")}`;

    if (this.elDayDisplay) {
      this.elDayDisplay.textContent = `${I18N.t("dayLabel")} ${this.engine.dayCount}`;
    }

    // Nettoyer les unités mortes de la sélection
    if (this.selectedUnits.some((u) => u.hp <= 0)) {
      this.selectedUnits = this.selectedUnits.filter((u) => u.hp > 0);
      this.updateSelectionDisplay();
    }

    // Inspection du secteur survolé si aucun bataillon sélectionné
    if (this.renderer.hoverCell && this.selectedUnits.length === 0 && !this.selectedBuildMode && this.elSelectionInfo) {
      const c = this.renderer.hoverCell;
      const ownerFac = c.owner > 0 ? this.engine.factions.get(c.owner) : null;
      const ownerStr = ownerFac ? `<strong style="color:${ownerFac.border}">${ownerFac.name}</strong>` : `<span class="mc-gray">${I18N.t("sectorWild")}</span>`;
      const infraName = c.isCapital ? I18N.t("sectorCitadel") : (c.infrastructure ? I18N.getInfraName(c.infrastructure) : "");
      const infraStr = infraName ? ` | ${I18N.t("lblSecInfra")} <strong style="color:#b45309">${infraName}</strong>` : "";
      const secWord = I18N.currentLang === "en" ? "Sector" : "Secteur";
      const ctrlWord = I18N.t("lblSecControl");
      this.elSelectionInfo.innerHTML = `
        <span style="font-size:11px;">${secWord} (${c.x}, ${c.y}) : <strong>${I18N.getBiomeName(c.terrain.id)}</strong> | ${ctrlWord} ${ownerStr}${infraStr}</span>
      `;
    }

    // Mise à jour du bandeau de fondation de la capitale
    this.updateFoundingBanner();

    // Mise à jour du panneau de détails du secteur inspecté
    this.updateSectorInfoDisplay();
  }

  updateFoundingBanner() {
    if (!this.elFoundingBanner) return;

    if (this.engine.isFoundingCapital) {
      this.elFoundingBanner.classList.remove("hidden");
      if (this.elFoundingCountdown) {
        const sec = Math.max(0, Math.ceil(this.engine.foundingCountdown));
        this.elFoundingCountdown.textContent = `${sec}s`;
      }
      if (this.elBtnConfirmFounding) {
        const c = this.engine.candidateFoundingCell;
        if (c) {
          this.elBtnConfirmFounding.disabled = false;
          this.elBtnConfirmFounding.textContent = I18N.currentLang === "fr"
            ? `FONDER LA CITADELLE EN (${c.x}, ${c.y})`
            : `FOUND CITADEL AT (${c.x}, ${c.y})`;
        } else {
          this.elBtnConfirmFounding.disabled = true;
          this.elBtnConfirmFounding.textContent = I18N.t("foundingBtn");
        }
      }
    } else {
      this.elFoundingBanner.classList.add("hidden");
    }
  }

  // Remplissage dynamique des informations du secteur sélectionné
  updateSectorInfoDisplay() {
    if (!this.elSectorCoord) return;
    const myPlayerId = this.network.myPlayerId;

    let cell = this.inspectedCell || this.renderer.hoverCell;
    if (!cell) {
      const cap = this.engine.map.capitals.find((c) => c.factionId === myPlayerId);
      if (cap) cell = this.engine.map.getCell(cap.x, cap.y);
    }
    if (!cell) return;

    // 1. Coordonnées et Biome
    const isCap = cell.isCapital ? (I18N.currentLang === "en" ? " (Capital)" : " (Capitale)") : "";
    const secWord = I18N.currentLang === "en" ? "Sector" : "Secteur";
    this.elSectorCoord.textContent = `${secWord} (${cell.x}, ${cell.y})${isCap}`;

    if (this.elSectorBiomeBadge) {
      this.elSectorBiomeBadge.textContent = I18N.getBiomeName(cell.terrain.id);
      this.elSectorBiomeBadge.style.color = cell.terrain.color || "#78350f";
      this.elSectorBiomeBadge.style.borderColor = cell.terrain.color || "#78350f";
    }

    // 2. Contrôle territorial
    if (this.elSectorOwner) {
      const ownerFac = cell.owner > 0 ? this.engine.factions.get(cell.owner) : null;
      if (ownerFac) {
        this.elSectorOwner.textContent = ownerFac.name;
        this.elSectorOwner.style.color = ownerFac.border || "#55FF55";
      } else {
        this.elSectorOwner.textContent = I18N.t("sectorWild");
        this.elSectorOwner.style.color = "#78350f";
      }
    }

    // 3. Infrastructure & Fortification
    if (this.elSectorInfra) {
      if (cell.isCapital) {
        this.elSectorInfra.textContent = I18N.t("sectorCitadel");
        this.elSectorInfra.style.color = "#b45309";
      } else if (cell.infrastructure) {
        this.elSectorInfra.textContent = I18N.getInfraName(cell.infrastructure);
        this.elSectorInfra.style.color = "#b45309";
      } else {
        this.elSectorInfra.textContent = I18N.t("sectorNoInfra");
        this.elSectorInfra.style.color = "#78350f";
      }
    }

    // 4. Défense & Résistance (Points de vie réels de la structure)
    if (this.elSectorDefense) {
      let defPts = 100;
      let maxDef = 100;
      if (cell.isCapital) {
        maxDef = cell.maxInfraHp || 800;
        defPts = cell.infraHp !== null && cell.infraHp !== undefined ? cell.infraHp : maxDef;
      } else if (cell.infrastructure) {
        const proto = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
        maxDef = cell.maxInfraHp || (proto ? proto.hp : 200);
        defPts = cell.infraHp !== null && cell.infraHp !== undefined ? cell.infraHp : maxDef;
      }
      this.elSectorDefense.textContent = `${defPts} / ${maxDef} ${I18N.t("defensePts")}`;
      this.elSectorDefense.style.color = defPts < maxDef * 0.4 ? "#dc2626" : "#2b1d0c";
    }

    // 5. Rendement Économique
    if (this.elSectorYields) {
      let food = (cell.terrain.baseFood || 0) * 3;
      let wood = (cell.terrain.baseWood || 0) * 3;
      let stone = (cell.terrain.baseStone || 0) * 3;
      let gold = (cell.terrain.baseGold || 0) * 2;

      if (cell.infrastructure) {
        const proto = CONFIG.INFRASTRUCTURES[cell.infrastructure.toUpperCase()];
        if (proto) {
          if (proto.foodBonus) food += proto.foodBonus * 2;
          if (proto.woodBonus) wood += proto.woodBonus * 2;
          if (proto.stoneBonus) stone += proto.stoneBonus * 2;
          if (proto.goldBonus) gold += (proto.goldBonus || 0) * 2;
        }
      }

      const foodWord = I18N.currentLang === "en" ? "Bread" : "Pain";
      const woodWord = I18N.currentLang === "en" ? "Wood" : "Bois";
      const stoneWord = I18N.currentLang === "en" ? "Stone" : "Pierre";
      const goldWord = I18N.currentLang === "en" ? "Gold" : "Or";
      const daySuffix = I18N.currentLang === "en" ? "/day" : "/j";

      const yields = [];
      if (food > 0) yields.push(`+${food.toFixed(0)} ${foodWord}`);
      if (wood > 0) yields.push(`+${wood.toFixed(0)} ${woodWord}`);
      if (stone > 0) yields.push(`+${stone.toFixed(0)} ${stoneWord}`);
      if (gold > 0) yields.push(`+${gold.toFixed(0)} ${goldWord}`);

      this.elSectorYields.textContent = yields.length > 0 ? `${yields.join(", ")} ${daySuffix}` : I18N.t("noYields");
    }

    // 6. Note Tactique
    if (this.elSectorTacticalNote) {
      this.elSectorTacticalNote.textContent = cell.terrain.desc || I18N.t("tacticalDefaultNote");
    }
  }

  showGameEndModal(isVictory) {
    const modal = document.getElementById("game-end-modal");
    const title = document.getElementById("game-end-title");
    const desc = document.getElementById("game-end-desc");
    const btnQuit = document.getElementById("btn-end-quit-lobby");

    if (!modal) return;
    modal.classList.remove("hidden");

    if (isVictory) {
      if (title) {
        title.textContent = I18N.t("victoryTitle");
        title.className = "modal-title mc-gold";
      }
      if (desc) {
        desc.textContent = I18N.t("victoryDesc");
      }
    } else {
      if (title) {
        title.textContent = I18N.t("defeatTitle");
        title.className = "modal-title mc-red";
      }
      if (desc) {
        desc.textContent = I18N.t("defeatDesc");
      }
    }

    if (btnQuit) {
      btnQuit.textContent = I18N.t("btnReturnLobby");
      btnQuit.onclick = () => {
        modal.classList.add("hidden");
        if (this.onQuitToLobby) {
          this.onQuitToLobby();
        } else {
          location.reload();
        }
      };
    }
  }
}


  // ==================== MODULE: main.js ====================
/**
 * Jerry's Nations: Frontline Realms - Main Entry Point & Game Orchestrator
 * Initialisation des modules, gestion du Lobby & Création de Nation, boucle requestAnimationFrame.
 * RÈGLE STRICTE : ZÉRO EMOJI.
 */










class GameApp {
  constructor() {
    I18N.init();
    I18N.applyToDOM();

    this.map = null;
    this.engine = null;
    this.renderer = null;
    this.ai = null;
    this.network = null;
    this.ui = null;

    this.isPlaying = false;
    this.lastTime = 0;

    // Paramètres de partie par défaut
    let savedAvatar = null;
    try {
      savedAvatar = localStorage.getItem("jerry_nations_skin_avatar");
    } catch (e) {}

    this.settings = {
      playerName: "Jerry",
      nationName: "Empire d'Émeraude",
      playerAvatarUrl: savedAvatar || "textures/ui/me.gif",
      bannerPreset: "emerald",
      bannerColor: "#1b7a63",
      bannerBorder: "#22c55e",
      textCode: "§a",
      gameMode: "standard",
      botCount: 3,
      aiDifficulty: "normal",
      enableMarauders: true
    };

    this.initLobbyEvents();
    this.initSkinImporter();
  }

  // Gestionnaire d'importation de skin Minecraft (.PNG)
  initSkinImporter() {
    const btnUpload = document.getElementById("btn-upload-skin");
    const inputSkinFile = document.getElementById("setup-skin-file");
    const btnReset = document.getElementById("btn-reset-skin");
    const previewImg = document.getElementById("setup-avatar-preview");

    if (previewImg && this.settings.playerAvatarUrl) {
      previewImg.src = this.settings.playerAvatarUrl;
    }

    if (btnUpload && inputSkinFile) {
      btnUpload.addEventListener("click", () => {
        inputSkinFile.click();
      });

      inputSkinFile.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Création de l'icône / buste du joueur sur canvas à partir du skin Minecraft
            const cvs = document.createElement("canvas");
            cvs.width = 64;
            cvs.height = 64;
            const ctx = cvs.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            const isLegacy = img.height === 32;

            // 1. Torse supérieur
            ctx.drawImage(img, 20, 20, 8, 7, 18, 36, 28, 26);
            if (!isLegacy) {
              ctx.drawImage(img, 20, 36, 8, 7, 18, 36, 28, 26);
            }

            // 2. Bras Droit
            ctx.drawImage(img, 44, 20, 4, 7, 6, 36, 12, 26);
            if (!isLegacy) {
              ctx.drawImage(img, 44, 36, 4, 7, 6, 36, 12, 26);
            }

            // 3. Bras Gauche
            if (!isLegacy) {
              ctx.drawImage(img, 36, 52, 4, 7, 46, 36, 12, 26);
              ctx.drawImage(img, 52, 52, 4, 7, 46, 36, 12, 26);
            } else {
              ctx.save();
              ctx.scale(-1, 1);
              ctx.drawImage(img, 44, 20, 4, 7, -58, 36, 12, 26);
              ctx.restore();
            }

            // 4. Visage de base UV [8, 8, 8, 8]
            ctx.drawImage(img, 8, 8, 8, 8, 16, 4, 32, 32);

            // 5. Casque / Chapeau / Reliefs UV [40, 8, 8, 8]
            ctx.drawImage(img, 40, 8, 8, 8, 14, 2, 36, 36);

            const avatarDataUrl = cvs.toDataURL("image/png");
            this.settings.playerAvatarUrl = avatarDataUrl;
            if (previewImg) previewImg.src = avatarDataUrl;

            try {
              localStorage.setItem("jerry_nations_skin_avatar", avatarDataUrl);
            } catch (err) {}

            SOUND.playClick();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.settings.playerAvatarUrl = "textures/ui/me.gif";
        if (previewImg) previewImg.src = "textures/ui/me.gif";
        try {
          localStorage.removeItem("jerry_nations_skin_avatar");
        } catch (err) {}
        SOUND.playClick();
      });
    }
  }

  initLobbyEvents() {
    const inputPlayer = document.getElementById("setup-player-name");
    const inputNation = document.getElementById("setup-nation-name");
    const btnStart = document.getElementById("btn-start-game");

    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    // 1. Choix des bannières
    document.querySelectorAll(".banner-swatch").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll(".banner-swatch").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        const bId = swatch.dataset.banner;
        const preset = CONFIG.BANNER_PRESETS.find((p) => p.id === bId) || CONFIG.BANNER_PRESETS[0];
        this.settings.bannerPreset = preset.id;
        this.settings.bannerColor = preset.color;
        this.settings.bannerBorder = preset.border;
        this.settings.textCode = preset.textCode;
        SOUND.playClick();
      });
    });

    // 2. Boutons Bascules (Toggles de paramètres)
    document.querySelectorAll(".setup-btn-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const settingKey = btn.dataset.setting;
        const valStr = btn.dataset.value;

        // Désélectionner les autres boutons de la même ligne
        btn.parentElement.querySelectorAll(".setup-btn-toggle").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (settingKey === "botCount") {
          this.settings.botCount = parseInt(valStr, 10);
        } else if (settingKey === "marauders") {
          this.settings.enableMarauders = valStr === "true";
        } else if (settingKey === "gameMode") {
          this.settings.gameMode = valStr;
          const help = document.getElementById("mode-help-text");
          if (help) {
            help.textContent = valStr === "sandbox"
              ? "Ressources infinies (99 999), constructions libres, aucune famine."
              : "11 Stades, Banquet au crépuscule et gestion alimentaire.";
          }
        } else if (settingKey === "aiDifficulty") {
          this.settings.aiDifficulty = valStr;
        }

        SOUND.playClick();
      });
    });

    // 3. Lancement de la partie
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        if (inputPlayer && inputPlayer.value.trim()) {
          this.settings.playerName = inputPlayer.value.trim();
        }
        if (inputNation && inputNation.value.trim()) {
          this.settings.nationName = inputNation.value.trim();
        }

        SOUND.playClick();
        this.startGameSession(false);
      });
    }

    // 4. Multijoueur P2P WebRTC & Salon d'Attente
    this.initMultiplayerLobbyEvents();

    // Instanciation réseau précoce
    this.network = new NetworkManager({ factions: new Map(), addLog: () => {} });
  }

  // Initialisation du Salon d'Attente Multijoueur
  initMultiplayerLobbyEvents() {
    const btnHost = document.getElementById("btn-create-room");
    const btnJoin = document.getElementById("btn-join-room");
    const inputRoom = document.getElementById("input-room-code");
    const p2pStatus = document.getElementById("p2p-status-msg");

    const mpModal = document.getElementById("multiplayer-lobby-modal");
    const btnMpStart = document.getElementById("btn-mp-start-game");
    const btnMpLeave = document.getElementById("btn-mp-leave-room");
    const btnCopyCode = document.getElementById("btn-copy-room-code");
    const mpCopyFeedback = document.getElementById("mp-copy-feedback");

    // Bouton Copier le code du salon
    if (btnCopyCode) {
      btnCopyCode.addEventListener("click", () => {
        if (this.network.roomId) {
          navigator.clipboard.writeText(this.network.roomId);
          if (mpCopyFeedback) {
            mpCopyFeedback.textContent = "Code copié dans le presse-papiers ! Partagez-le avec vos alliés.";
            mpCopyFeedback.style.color = "#15803d";
          }
          SOUND.playClick();
        }
      });
    }

    // Bouton Quitter le salon
    if (btnMpLeave) {
      btnMpLeave.addEventListener("click", () => {
        this.network.leaveRoom();
        if (mpModal) mpModal.classList.add("hidden");
        SOUND.playClick();
      });
    }

    // Bouton Lancer la partie pour tous (Hôte)
    if (btnMpStart) {
      btnMpStart.addEventListener("click", () => {
        SOUND.playFanfare();
        const payload = this.network.broadcastStartGame ? this.network.broadcastStartGame(this.settings) : { seed: Date.now() };
        this.onMultiplayerGameStart(payload);
      });
    }

    // Hôte : Création d'un nouveau salon P2P (Bascule immédiate vers le Hub)
    if (btnHost) {
      btnHost.addEventListener("click", () => {
        SOUND.playClick();
        const inputPlayer = document.getElementById("setup-player-name");
        const inputNation = document.getElementById("setup-nation-name");
        if (inputPlayer && inputPlayer.value.trim()) this.settings.playerName = inputPlayer.value.trim();
        if (inputNation && inputNation.value.trim()) this.settings.nationName = inputNation.value.trim();

        const hostInfo = {
          name: this.settings.playerName,
          nationName: this.settings.nationName,
          color: this.settings.bannerColor,
          border: this.settings.bannerBorder,
          avatarUrl: this.settings.playerAvatarUrl,
          isHost: true,
          isReady: true
        };

        const tempRoomId = "jerry-" + Math.floor(1000 + Math.random() * 9000);
        // Basculer DIRECTEMENT dans le salon d'attente
        this.openMultiplayerRoomLobby(true, tempRoomId, [
          { id: 1, ...hostInfo }
        ]);

        this.network.createRoom(
          hostInfo,
          (roomId, players) => {
            const mpRoomCode = document.getElementById("mp-room-code-text");
            if (mpRoomCode) mpRoomCode.textContent = roomId;
            this.updateMultiplayerSlots(players);
          },
          (players) => {
            this.updateMultiplayerSlots(players);
          },
          (err) => {
            const mpStatus = document.getElementById("mp-lobby-status");
            if (mpStatus) mpStatus.textContent = `Avertissement réseau : ${err}`;
          }
        );
      });
    }

    // Client : Rejoindre un salon existant (Bascule immédiate vers le Hub)
    if (btnJoin) {
      btnJoin.addEventListener("click", () => {
        SOUND.playClick();
        const inputPlayer = document.getElementById("setup-player-name");
        const inputNation = document.getElementById("setup-nation-name");
        if (inputPlayer && inputPlayer.value.trim()) this.settings.playerName = inputPlayer.value.trim();
        if (inputNation && inputNation.value.trim()) this.settings.nationName = inputNation.value.trim();

        const code = inputRoom ? inputRoom.value.trim() : "";
        if (!code) {
          if (p2pStatus) p2pStatus.textContent = I18N.currentLang === "fr" ? "Veuillez entrer un code de salon valide." : "Please enter a valid room code.";
          return;
        }

        const clientInfo = {
          name: this.settings.playerName,
          nationName: this.settings.nationName,
          color: this.settings.bannerColor,
          border: this.settings.bannerBorder,
          avatarUrl: this.settings.playerAvatarUrl,
          isHost: false,
          isReady: true
        };

        // Basculer DIRECTEMENT dans le salon d'attente
        this.openMultiplayerRoomLobby(false, code, [
          { id: 1, name: "Hôte du Royaume", nationName: "Empire Hôte", isHost: true, avatarUrl: "textures/ui/me.gif" },
          { id: 2, ...clientInfo }
        ]);

        this.network.joinRoom(
          code,
          clientInfo,
          (roomId) => {
            const mpRoomCode = document.getElementById("mp-room-code-text");
            if (mpRoomCode) mpRoomCode.textContent = roomId;
          },
          (players) => {
            this.updateMultiplayerSlots(players);
          },
          (gameStartPayload) => {
            this.onMultiplayerGameStart(gameStartPayload);
          },
          (err) => {
            const mpStatus = document.getElementById("mp-lobby-status");
            if (mpStatus) mpStatus.textContent = `Échec de connexion : ${err}`;
          }
        );
      });
    }
  }

  // Ouverture visuelle de la Salle d'Attente Multijoueur
  openMultiplayerRoomLobby(isHost, roomId, players) {
    const mpModal = document.getElementById("multiplayer-lobby-modal");
    const mpRoomCode = document.getElementById("mp-room-code-text");
    const mpStatus = document.getElementById("mp-lobby-status");
    const btnMpStart = document.getElementById("btn-mp-start-game");
    const mpCopyFeedback = document.getElementById("mp-copy-feedback");

    if (mpModal) mpModal.classList.remove("hidden");
    if (mpRoomCode) mpRoomCode.textContent = roomId;
    if (mpCopyFeedback) {
      mpCopyFeedback.textContent = "Transmettez ce code à vos amis pour qu'ils rejoignent votre royaume.";
      mpCopyFeedback.style.color = "#78350f";
    }

    if (isHost) {
      if (mpStatus) mpStatus.textContent = "Salon ouvert ! En attente d'autres souverains...";
      if (btnMpStart) {
        btnMpStart.style.display = "block";
        btnMpStart.textContent = "LANCER LA PARTIE POUR TOUS";
        btnMpStart.disabled = false;
        btnMpStart.classList.add("btn-gold");
      }
    } else {
      if (mpStatus) mpStatus.textContent = "Connecté au salon ! En attente du lancement par l'Hôte...";
      if (btnMpStart) {
        btnMpStart.style.display = "block";
        btnMpStart.textContent = "EN ATTENTE DU SIGNAL DE L'HÔTE...";
        btnMpStart.disabled = true;
        btnMpStart.classList.remove("btn-gold");
      }
    }

    this.updateMultiplayerSlots(players);
  }

  // Mise à jour des 4 cartes d'emplacements joueurs dans le salon
  updateMultiplayerSlots(players) {
    const container = document.getElementById("mp-slots-container");
    if (!container) return;

    let html = "";
    for (let i = 0; i < 4; i++) {
      const p = players && players[i];
      if (p) {
        const badgeClass = p.isHost ? "host" : "ready";
        const badgeLabel = p.isHost ? "[HÔTE]" : "[PRÊT]";
        html += `
          <div class="mp-slot-card occupied" style="border-color:${p.border || '#15803d'}">
            <div class="mp-slot-avatar" style="border-color:${p.border || '#78350f'}">
              <img src="${p.avatarUrl || 'textures/ui/me.gif'}" alt="Avatar">
            </div>
            <div class="mp-slot-info">
              <div class="mp-slot-player-name" style="color:${p.border || '#2b1d0c'}">${p.name}</div>
              <div class="mp-slot-faction-name">${p.nationName || 'Royaume'}</div>
              <div class="mp-slot-badge ${badgeClass}">${badgeLabel}</div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="mp-slot-card empty">
            <div class="mp-slot-avatar" style="opacity:0.4;">
              <span style="font-size:16px; color:#78350f;">?</span>
            </div>
            <div class="mp-slot-info">
              <div class="mp-slot-player-name" style="color:#78350f;">Emplacement ${i + 1}</div>
              <div class="mp-slot-faction-name">En attente d'un joueur ou Bot IA</div>
              <div class="mp-slot-badge">[LIBRE]</div>
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = html;
  }

  // Lancement synchronisé de la partie multijoueur
  onMultiplayerGameStart(payload) {
    const mpModal = document.getElementById("multiplayer-lobby-modal");
    if (mpModal) mpModal.classList.add("hidden");

    this.startGameSession(true, payload);
  }

  startGameSession(isMultiplayer = false, mpData = null) {
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");

    if (lobbyOverlay) lobbyOverlay.classList.add("hidden");
    if (gameContainer) gameContainer.classList.remove("in-lobby");

    // Mettre à jour l'avatar et le profil du joueur dans le HUD In-Game
    const hudAvatar = document.getElementById("hud-player-avatar");
    if (hudAvatar && this.settings.playerAvatarUrl) {
      hudAvatar.src = this.settings.playerAvatarUrl;
    }
    const hudPlayer = document.getElementById("hud-player-name");
    if (hudPlayer && this.settings.playerName) {
      hudPlayer.textContent = this.settings.playerName;
    }

    // 1. Définir la liste des factions actives selon les réglages
    const activeFactions = [];
    const myPlayerId = isMultiplayer && this.network ? this.network.myPlayerId : 1;

    if (isMultiplayer && mpData && mpData.players) {
      // Configuration multijoueur avec les vrais joueurs
      mpData.players.forEach((p, idx) => {
        activeFactions.push({
          id: p.id,
          name: p.nationName || `Royaume ${idx + 1}`,
          color: p.color || CONFIG.BANNER_PRESETS[idx % CONFIG.BANNER_PRESETS.length].color,
          border: p.border || CONFIG.BANNER_PRESETS[idx % CONFIG.BANNER_PRESETS.length].border,
          textCode: "§a",
          isPlayer: p.id === myPlayerId,
          isAI: false
        });
      });

      // Compléter avec des bots si moins de 4 factions
      const botCandidates = [CONFIG.FACTIONS[1], CONFIG.FACTIONS[2], CONFIG.FACTIONS[3], CONFIG.FACTIONS[4]];
      for (let i = activeFactions.length; i < 4; i++) {
        const candidate = botCandidates[i % botCandidates.length];
        activeFactions.push({
          ...candidate,
          id: i + 1,
          isPlayer: false,
          isAI: true
        });
      }
    } else {
      // Solo standard
      const playerBanner = CONFIG.BANNER_PRESETS.find((b) => b.id === this.settings.bannerPreset) || CONFIG.BANNER_PRESETS[0];

      activeFactions.push({
        id: 1,
        name: this.settings.nationName,
        color: playerBanner.color,
        border: playerBanner.border,
        textCode: playerBanner.textCode,
        isPlayer: true
      });

      const botCount = this.settings.botCount;
      const botCandidates = [];
      if (this.settings.enableMarauders) {
        botCandidates.push(CONFIG.FACTIONS[1]); // Maraudeurs
      }
      botCandidates.push(CONFIG.FACTIONS[2]);
      botCandidates.push(CONFIG.FACTIONS[3]);
      botCandidates.push(CONFIG.FACTIONS[4]);

      for (let i = 0; i < botCount && i < botCandidates.length; i++) {
        activeFactions.push(botCandidates[i]);
      }
    }

    // 2. Génération de la carte de monde avec les factions actives (Seed synchronisée en multijoueur)
    const mapSeed = (isMultiplayer && mpData && mpData.seed) ? mpData.seed : Date.now();
    this.map = new WorldMap();
    this.map.generate(mapSeed, activeFactions);

    // 3. Moteur de simulation
    this.engine = new GameEngine(this.map, this.settings);
    this.network.engine = this.engine;

    // 4. Rendu Canvas
    const canvas = document.getElementById("world-canvas");
    this.renderer = new MapRenderer(canvas, this.map, this.engine);

    // 5. Intelligence Artificielle
    this.ai = new AIController(this.engine, this.map);

    // 6. Interface Utilisateur
    this.ui = new UIManager(this.engine, this.renderer, this.network);
    this.ui.onQuitToLobby = () => this.returnToLobby();

    this.isPlaying = true;
    const modeName = this.settings.gameMode === "sandbox" ? "Bac à Sable" : "Conquête";
    const netPrefix = isMultiplayer ? "[MULTIJOUEUR P2P] " : "";
    this.engine.addLog(`§a${netPrefix}[${modeName}] Gloire à ${this.settings.playerName}, souverain de l'${this.settings.nationName} !`);

    // Lancer la boucle de jeu
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  returnToLobby() {
    this.isPlaying = false;
    const lobbyOverlay = document.getElementById("lobby-overlay");
    const gameContainer = document.getElementById("game-container");
    const pauseModal = document.getElementById("pause-modal");
    const mpModal = document.getElementById("multiplayer-lobby-modal");

    if (pauseModal) pauseModal.classList.add("hidden");
    if (mpModal) mpModal.classList.add("hidden");
    if (lobbyOverlay) lobbyOverlay.classList.remove("hidden");
    if (gameContainer) gameContainer.classList.add("in-lobby");
  }

  gameLoop(currentTime) {
    if (!this.isPlaying) return;

    try {
      // Simulation (20 Hz géré en interne via le tick rate)
      this.engine.update();
      this.ai.update();

      // Rendu visuel 60 FPS
      this.renderer.render();

      // Mise à jour de l'affichage DOM
      this.ui.updateHUD();
    } catch (err) {
      console.error("[CRITICAL GAME LOOP ERROR]", err);
      if (this.engine) {
        this.engine.addLog(`§c[ERREUR] ${err.message || err}`);
      }
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Démarrer l'application au chargement du DOM
window.addEventListener("DOMContentLoaded", () => {
  window.app = new GameApp();
});


})();

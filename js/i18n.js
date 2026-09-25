/**
 * Jerry's Nations: Frontline Realms - Bilingual System (FR / EN)
 * Gestionnaire de traduction bilingue conforme aux règles strictes du projet.
 * ZÉRO EMOJI. Mémorisation du choix utilisateur dans localStorage.
 */

export const I18N = {
  currentLang: "fr",

  translations: {
    fr: {
      langBtn: "LANGUE : FRANÇAIS",
      langCode: "FR",
      switchLang: "ENGLISH",
      
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
      resFood: "Pain",
      resWood: "Bois",
      resStone: "Pierre",
      resGold: "Or",
      resArmy: "Armée",
      resTerritory: "Secteurs",
      btnPause: "PAUSE",
      btnResume: "REPRENDRE",
      btnCenter: "CENTRER",
      btnMenu: "MENU",
      soundActive: "[SON : ACTIF]",
      soundMuted: "[SON : COUPE]",

      // Panneau de construction (Tiroir droit)
      buildingsTitle: "BÂTIMENTS & AVANT-POSTES",
      buildingsSubtitle: "Sélectionnez une structure puis cliquez sur un secteur éligible :",
      bldFarm: "FERME",
      bldFarmDesc: "Plaine | +5.0 Pain/jour",
      bldLumber: "SCIERIE",
      bldLumberDesc: "Forêt | +4.5 Bois/jour",
      bldQuarry: "CARRIÈRE",
      bldQuarryDesc: "Collines | +3.5 Pierre +1.5 Or/jour",
      bldBarracks: "CASERNE",
      bldBarracksDesc: "Tout secteur | Caserne militaire",
      bldOutpost: "AVANT-POSTE",
      bldOutpostDesc: "Étend les frontières de +2 cases",
      bldTower: "TOUR",
      bldTowerDesc: "Tir défensif (portée accrue sur colline)",

      // Volet de commandement inférieur
      toggleCmdTitle: "COMMANDEMENT & SECTEUR",
      secInfoTitle: "SECTEUR SÉLECTIONNÉ",
      sectorWild: "Terre Sauvage (Libre)",
      sectorNoInfra: "Aucun aménagement",
      sectorCitadel: "Cité Royale (Bastion)",
      defensePts: "pts",
      noYields: "Aucun revenu",
      noUnitsSelected: "Aucun bataillon sélectionné. Clic gauche ou glisser pour sélectionner.",
      battalionsSelected: "BATAILLONS :",
      hpLabel: "PV :",
      btnHalt: "HALTE",
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
      mpBtnStartHost: "LANCER LA PARTIE POUR TOUS",
      mpBtnStartClient: "EN ATTENTE DU SIGNAL DE L'HÔTE...",
      mpBtnLeave: "QUITTER LE SALON",

      // Modal de Pause
      pauseModalTitle: "CONSEIL DE GUERRE - PAUSE",
      pauseModalDesc: "La simulation est suspendue. Choisissez une directive :",
      pauseBtnResume: "REPRENDRE LA PARTIE",
      pauseBtnCenter: "RECENTRER SUR LA CAPITALE (C)",
      pauseBtnEdgeScrollOn: "DÉFILEMENT BORD ÉCRAN : ACTIF",
      pauseBtnEdgeScrollOff: "DÉFILEMENT BORD ÉCRAN : DÉSACTIVÉ",
      pauseBtnQuit: "QUITTER VERS LE MENU PRINCIPAL"
    },

    en: {
      langBtn: "LANGUAGE : ENGLISH",
      langCode: "EN",
      switchLang: "FRANÇAIS",
      
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
      resFood: "Bread",
      resWood: "Wood",
      resStone: "Stone",
      resGold: "Gold",
      resArmy: "Army",
      resTerritory: "Sectors",
      btnPause: "PAUSE",
      btnResume: "RESUME",
      btnCenter: "CENTER",
      btnMenu: "MENU",
      soundActive: "[SOUND: ON]",
      soundMuted: "[SOUND: MUTED]",

      // Building Drawer (Right)
      buildingsTitle: "BUILDINGS & OUTPOSTS",
      buildingsSubtitle: "Select a structure then click on an eligible sector:",
      bldFarm: "FARM",
      bldFarmDesc: "Plain | +5.0 Bread/day",
      bldLumber: "LUMBER CAMP",
      bldLumberDesc: "Forest | +4.5 Wood/day",
      bldQuarry: "QUARRY",
      bldQuarryDesc: "Hills | +3.5 Stone +1.5 Gold/day",
      bldBarracks: "BARRACKS",
      bldBarracksDesc: "Any sector | Military hub",
      bldOutpost: "OUTPOST",
      bldOutpostDesc: "Expands borders by +2 tiles",
      bldTower: "TOWER",
      bldTowerDesc: "Defensive archery (bonus on hills)",

      // Bottom Command Dock
      toggleCmdTitle: "COMMAND & SECTOR",
      secInfoTitle: "SELECTED SECTOR",
      sectorWild: "Wildlands (Neutral)",
      sectorNoInfra: "No infrastructure",
      sectorCitadel: "Royal City (Citadel)",
      defensePts: "pts",
      noYields: "No revenue",
      noUnitsSelected: "No battalion selected. Left-click or drag to select.",
      battalionsSelected: "BATTALIONS:",
      hpLabel: "HP:",
      btnHalt: "HALT",
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
      mpBtnStartHost: "LAUNCH GAME FOR ALL",
      mpBtnStartClient: "WAITING FOR HOST...",
      mpBtnLeave: "LEAVE ROOM",

      // Pause Modal
      pauseModalTitle: "WAR COUNCIL - PAUSE",
      pauseModalDesc: "Simulation is paused. Choose a directive:",
      pauseBtnResume: "RESUME GAME",
      pauseBtnCenter: "CENTER ON CAPITAL (C)",
      pauseBtnEdgeScrollOn: "EDGE SCROLLING: ON",
      pauseBtnEdgeScrollOff: "EDGE SCROLLING: OFF",
      pauseBtnQuit: "QUIT TO MAIN MENU"
    }
  },

  init() {
    try {
      const saved = localStorage.getItem("jerry_nations_lang");
      if (saved && (saved === "fr" || saved === "en")) {
        this.currentLang = saved;
      } else {
        const nav = (navigator.language || "").toLowerCase();
        this.currentLang = nav.startsWith("en") ? "en" : "fr";
      }
    } catch (e) {
      this.currentLang = "fr";
    }
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

  applyToDOM() {
    const lang = this.currentLang;
    const dict = this.translations[lang];

    // Mettre à jour les boutons de langue
    document.querySelectorAll(".btn-toggle-lang").forEach((btn) => {
      btn.textContent = dict.langBtn;
    });

    // Éléments du Lobby
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

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

    setText("lobby-sec2-title", dict.secRules);
    setText("lbl-game-mode", dict.gameModeLabel);
    setText("lbl-bot-count", dict.botCountLabel);
    setText("lbl-ai-diff", dict.aiDiffLabel);
    setText("txt-opt-marauders", dict.optMarauders);
    setText("btn-start-game", dict.btnLaunchGame);

    setText("txt-p2p-title", dict.secP2P);
    setText("btn-join-room", dict.btnJoinRoom);
    setText("btn-create-room", dict.btnCreateRoom);

    // Récap commandes
    setHtml("recap-item-nav", `<strong>${lang === 'fr' ? 'Navigation Carte' : 'Map Controls'}</strong> : ${dict.recapNav.split(': ')[1]}`);
    setHtml("recap-item-units", `<strong>${lang === 'fr' ? 'Bataillons RTS' : 'RTS Battalions'}</strong> : ${dict.recapUnits.split(': ')[1]}`);
    setHtml("recap-item-center", `<strong>${lang === 'fr' ? 'Recentrer Caméra' : 'Center Camera'}</strong> : ${dict.recapCenter.split(': ')[1]}`);

    // Modal de Pause
    setText("modal-pause-title", dict.pauseModalTitle);
    setText("modal-pause-desc", dict.pauseModalDesc);
    setText("modal-btn-resume", dict.pauseBtnResume);
    setText("modal-btn-center", dict.pauseBtnCenter);
    setText("modal-btn-quit-lobby", dict.pauseBtnQuit);

    // Salon Multijoueur
    setText("mp-lobby-header-title", dict.mpLobbyTitle);
    setText("mp-code-label-text", dict.mpCodeLabel);
    setText("btn-copy-room-code", dict.btnCopyCode);
    setText("mp-slots-title-text", dict.mpSlotsTitle);
    setText("btn-mp-leave-room", dict.mpBtnLeave);

    // Volet Bâtiments
    setText("buildings-drawer-title", dict.buildingsTitle);
    setText("buildings-drawer-desc", dict.buildingsSubtitle);

    // Ordres rapides & Halte
    setText("btn-order-halt", dict.btnHalt);
    setText("btn-expedition-col", dict.btnExpColonize);
    setText("btn-expedition-def", dict.btnExpDefend);
    setText("btn-expedition-assault", dict.btnExpAssault);

    // Bandeau de fondation
    setText("founding-banner-title", dict.foundingTitle);
    setText("btn-confirm-founding", dict.foundingBtn);
  }
};

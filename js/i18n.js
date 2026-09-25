/**
 * Jerry's Nations: Frontline Realms - Bilingual Translation Engine (FR / EN)
 * Gestionnaire de traduction bilingue intégrale conforme aux règles strictes du projet.
 * RÈGLE STRICTE : ZÉRO EMOJI. Mémorisation du choix utilisateur dans localStorage.
 */

export const I18N = {
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

    setText("btn-expedition-colo", dict.btnExpColonize);
    setText("btn-expedition-def", dict.btnExpDefend);
    setText("btn-expedition-assault", dict.btnExpAssault);

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

// Son İstasyon v23.0 — 6 Yeni Canlı Oyun Mekaniği Modülü:
// 1) 🏎️ Patron Direksiyonda (3D Açık Dünya Sürüş, Korna & 2x Hız Teftişi)
// 2) ⛽ Canlı Akaryakıt Fiyat Politikası (İndirimli Sürüm / Normal / Yüksek Kâr Marjı -> 3D Totem Senkron)
// 3) 🚑 Araziler Arası 3D Acil Müdahale (Ambulans & İtfaiye/Teknik Ekip Sevk Sistemi)
// 4) 🔨 Canlı Dev İhaleler (Rakiplerle Süreli Açık Artırma & Çok Günlü Sözleşme Geliri)
// 5) 🪧 Kurumsal Kimlik (Kendi Marka Adını & Neon Rengini 3D Tabelalara Basma)
// 6) 🏅 Çalışan Morali, Kahve İkramı, Bayram İkramiyesi (%150 Turbo) & Personel Sosyal Tesisi

window.MechanicsV23 = (function () {
  const LAND_META = {
    station: { ox: -112, oz: -36, num: 1, name: "1. İstasyon" },
    land2:   { ox:  -56, oz: -36, num: 2, name: "2. Grand AVM" },
    land3:   { ox:    0, oz: -36, num: 3, name: "3. Lunapark & Tatil Köyü" },
    land4:   { ox:   56, oz: -36, num: 4, name: "4. Arazi" },
    land5:   { ox:  112, oz: -36, num: 5, name: "5. Arazi" },
    land6:   { ox: -112, oz:  36, num: 6, name: "6. Arazi" },
    land7:   { ox:  -56, oz:  36, num: 7, name: "7. Arazi" },
    land8:   { ox:    0, oz:  36, num: 8, name: "8. Arazi" },
    land9:   { ox:   56, oz:  36, num: 9, name: "9. Arazi" },
    land10:  { ox:  112, oz:  36, num: 10, name: "10. Arazi" }
  };

  // 1) CANLI AKARYAKIT FİYAT POLİTİKALARI
  const FUEL_POLICIES = {
    discount: {
      key: "discount",
      title: "🟢 İndirimli Sürüm",
      badge: "🟢 Ucuz Yakıt",
      benzin: "39.90",
      dizel: "38.40",
      lpg: "21.90",
      ev: "7.90",
      trafficMult: 1.65,
      fuelPayMult: 0.84,
      shopBonus: 0.25,
      desc: "Otoyoldan araç akını +%65 hızlanır! Market, Restoran ve Motelde müşteri patlaması yaşanır (yakıt marjı -%16)."
    },
    normal: {
      key: "normal",
      title: "🟡 Piyasa Normali",
      badge: "🟡 Dengeli Fiyat",
      benzin: "44.90",
      dizel: "43.20",
      lpg: "25.40",
      ev: "9.50",
      trafficMult: 1.0,
      fuelPayMult: 1.0,
      shopBonus: 0,
      desc: "Standart piyasa fiyatları. Trafik yoğunluğu ve araç başı yakıt kârı dengelidir."
    },
    premium: {
      key: "premium",
      title: "🔴 Yüksek Kâr Marjı",
      badge: "🔴 Yüksek Marj",
      benzin: "52.90",
      dizel: "50.80",
      lpg: "29.90",
      ev: "12.40",
      trafficMult: 0.74,
      fuelPayMult: 1.45,
      shopBonus: -0.05,
      desc: "Araç başı Benzin, Mazot, LPG ve EV Şarj geliri +%45 artar! Trafik %26 daha sakin akar."
    }
  };

  // 2) KURUMSAL NEON TEMALARI
  const NEON_THEMES = {
    amber:   { key: "amber",   name: "🟡 Altın Kehribar", hex: "#f59e0b", glow: "#fde047", dark: "#92400e" },
    red:     { key: "red",     name: "🔴 Neon Kırmızı",   hex: "#ff3358", glow: "#fda4af", dark: "#991b1b" },
    cyan:    { key: "cyan",    name: "🔵 Siber Mavi",     hex: "#38bdf8", glow: "#bae6fd", dark: "#0369a1" },
    emerald: { key: "emerald", name: "🟢 Zümrüt Yeşili",  hex: "#22c55e", glow: "#86efac", dark: "#166534" },
    purple:  { key: "purple",  name: "🟣 Kraliyet Moru",  hex: "#c084fc", glow: "#e9d5ff", dark: "#6b21a8" }
  };

  // 3) SÜRÜLEBİLİR PATRON ARAÇLARI
  const BOSS_CARS = [
    { key: "boss_coupe", reqCar: null,        name: "🚘 Patron Makam Coupé",  shape: "sport", color: "#f59e0b", maxSpd: 36 },
    { key: "hatchback",  reqCar: "hatchback", name: "🚗 Şehir Hatchback",      shape: "sedan", color: "#22c55e", maxSpd: 34 },
    { key: "sedan_lux",  reqCar: "sedan_lux", name: "🚘 Lüks Alman Sedan",     shape: "sedan", color: "#f8fafc", maxSpd: 39 },
    { key: "ev_suv",     reqCar: "ev_suv",    name: "🚙 Elektrikli Süper SUV", shape: "ev",    color: "#38bdf8", maxSpd: 42 },
    { key: "supercar",   reqCar: "supercar",  name: "🏎️ İtalyan Süper Spor",  shape: "sport", color: "#ef4444", maxSpd: 48 }
  ];

  // 4) DEV KURUMSAL & BELEDİYE İHALELERİ HAVUZU
  const TENDER_POOL = [
    {
      key: "bus_fuel",
      emoji: "🚌",
      name: "Şehirlerarası Otobüs Filosu Yakıt İhalesi",
      desc: "45 otobüslük dev firma tüm yakıt ve mola anlaşmasını kazanan holdinge veriyor!",
      startBid: 4800,
      stepBid: 650,
      buyout: 8200,
      cycleIncome: 290,
      days: 3,
      repBonus: 4
    },
    {
      key: "cargo_fleet",
      emoji: "🚚",
      name: "Ulusal Kargo & Lojistik Tedarik Sözleşmesi",
      desc: "Yüzlerce dağıtım kamyonunun yakıt, yıkama ve kantar ihalesi!",
      startBid: 9500,
      stepBid: 1200,
      buyout: 16500,
      cycleIncome: 580,
      days: 3,
      repBonus: 5
    },
    {
      key: "municipal_service",
      emoji: "🏛️",
      name: "Büyükşehir Belediyesi Hizmet Araçları İhalesi",
      desc: "Belediyenin tüm araç filosu için garantili 4 günlük dev kamu sözleşmesi!",
      startBid: 18000,
      stepBid: 2200,
      buyout: 31000,
      cycleIncome: 1120,
      days: 4,
      repBonus: 7
    },
    {
      key: "festival_sponsor",
      emoji: "🎤",
      name: "Yaz Festivali & Konser Ana Sponsorluğu",
      desc: "AVM, Otel ve İstasyon reklamlarıyla bölgenin en prestijli sponsorluk ihalesi!",
      startBid: 28000,
      stepBid: 3200,
      buyout: 46000,
      cycleIncome: 1680,
      days: 4,
      repBonus: 10
    },
    {
      key: "airport_vip",
      emoji: "✈️",
      name: "Havalimanı VIP Transfer & Yakıt İhalesi",
      desc: "Turist kafilesi ve iş insanlarının 4 gün boyunca kesintisiz VIP transfer paketi!",
      startBid: 45000,
      stepBid: 5000,
      buyout: 74000,
      cycleIncome: 2650,
      days: 4,
      repBonus: 12
    },
    {
      key: "ev_grid",
      emoji: "⚡",
      name: "Otoyol Elektrikli Şarj Ağı Devlet Teşvik İhalesi",
      desc: "Bölgesel yeşil enerji ve hızlı şarj operatörlüğü dev kontratı!",
      startBid: 68000,
      stepBid: 7500,
      buyout: 112000,
      cycleIncome: 3950,
      days: 5,
      repBonus: 15
    }
  ];

  const RIVAL_BIDDERS = [
    { boss: "Hakkı Bey", hold: "Anadolu Petrol" },
    { boss: "Selçuk Bey", hold: "Kuzey Grup" },
    { boss: "Aysel Hanım", hold: "Yıldız Holding" },
    { boss: "Turgut Bey", hold: "Altın Vadi" },
    { boss: "Cemil Soylu", hold: "Marmara Dev Holding" }
  ];

  const LOUNGE_COST = 6800;

  // Canlı Değişkenler (60 FPS)
  let currentCmdTab = "brand"; // "brand" | "tenders" | "morale" | "drive"
  const inspectedLands = {}; // landId -> kalan saniye (2x Hız!)
  let contractTickTimer = 0;
  let auctionSpawnTimer = 28;
  let rivalBidCooldown = 5.5;
  let emergencyTimer = 34;

  // Canlı 3D Acil Müdahale Durumu
  let activeEmergency = null;
  // { id, kind: 'ambulance'|'fire', targetLand, title, reward, timeLeft, dispatched, vehicle: { wx, wz, angle, phase, waypoints, waitTimer } }
  const emergencyFloats = [];

  // Canlı 3D Patron Sürüş Durumu
  const bossDrive = {
    active: false,
    wx: -112,
    wz: -61.2,
    angle: Math.PI / 2,
    speed: 0,
    hornFlash: 0,
    carShape: "sport",
    carColor: "#f59e0b",
    carName: "🚘 Patron Makam Coupé"
  };

  const keysHeld = { up: false, down: false, left: false, right: false };
  const touchHeld = { up: false, down: false, left: false, right: false };
  let keyboardBound = false;
  let latestDataRef = null;
  let latestHelpersRef = null;

  function createDefaultV23() {
    return {
      brandName: "SON İSTASYON",
      neonTheme: "amber",
      fuelPolicy: "normal",
      morale: 100,
      loungeUnlocked: false,
      selectedCarKey: "auto",
      activeContracts: [],
      activeAuction: null,
      tendersWonCount: 0,
      emergenciesResolved: 0,
      inspectionsCount: 0
    };
  }

  function mergeV23(saved) {
    const def = createDefaultV23();
    if (!saved) return def;
    const out = Object.assign({}, def, saved);
    out.brandName = sanitizeBrandName(out.brandName || "SON İSTASYON");
    if (!NEON_THEMES[out.neonTheme]) out.neonTheme = "amber";
    if (!FUEL_POLICIES[out.fuelPolicy]) out.fuelPolicy = "normal";
    out.morale = Math.max(35, Math.min(150, Number.isFinite(out.morale) ? out.morale : 100));
    if (!Array.isArray(out.activeContracts)) out.activeContracts = [];
    return out;
  }

  function ensureV23(data) {
    if (!data.empire) return createDefaultV23();
    if (!data.empire.v23) data.empire.v23 = createDefaultV23();
    return data.empire.v23;
  }

  function sanitizeBrandName(raw) {
    const clean = String(raw || "")
      .trim()
      .replace(/[<>"'`]/g, "")
      .slice(0, 14)
      .toLocaleUpperCase("tr-TR");
    return clean || "SON İSTASYON";
  }

  function getBrandShort(data) {
    const v23 = ensureV23(data);
    const full = v23.brandName || "SON İSTASYON";
    const firstWord = full.split(/\s+/)[0] || "SON";
    return firstWord.slice(0, 10);
  }

  function getNeonTheme(data) {
    const v23 = ensureV23(data);
    return NEON_THEMES[v23.neonTheme] || NEON_THEMES.amber;
  }

  function getFuelPolicy(data) {
    const v23 = ensureV23(data);
    return FUEL_POLICIES[v23.fuelPolicy] || FUEL_POLICIES.normal;
  }

  function applyBrandThemeToDOM(data) {
    const v23 = ensureV23(data);
    const theme = getNeonTheme(data);
    document.documentElement.style.setProperty("--amber", theme.hex);
    document.documentElement.style.setProperty("--brand-glow", theme.glow);

    const splashLogo = document.querySelector(".splash-logo");
    if (splashLogo) splashLogo.textContent = v23.brandName || "SON İSTASYON";
  }

  // =========================================================================
  // HIZ & GELİR ÇARPANLARI (MORAL + TEFTİŞ + YAKIT FİYAT POLİTİKASI)
  // =========================================================================
  function getMoraleMult(data) {
    const v23 = ensureV23(data);
    const m = v23.morale || 100;
    if (m >= 115) return 1.5; // 🔥 Bayram İkramiyesi / Prim Coşkusu (%150 Turbo!)
    if (m >= 80) return 1.1;  // 😊 Yüksek Moral
    if (m >= 50) return 1.0;  // 🙂 Normal Tempo
    return 0.85;              // 😴 Yorgun Ekip
  }

  function getMoraleStatus(morale) {
    if (morale >= 115) return { label: "🔥 SÜPER COŞKU (1.5x Hız!)", color: "#facc15" };
    if (morale >= 80)  return { label: "😊 Dinç & Moralli (1.1x Hız)", color: "#4ade80" };
    if (morale >= 50)  return { label: "🙂 Normal Vardiya (1.0x Hız)", color: "#38bdf8" };
    return { label: "😴 Ekip Yorgun (0.85x Hız — Kahve/Prim Ver!)", color: "#f87171" };
  }

  function isLandInspected(landId) {
    return (inspectedLands[landId] || 0) > 0;
  }

  function getLandSpeedMult(data, landId) {
    const moraleM = getMoraleMult(data);
    const inspectM = isLandInspected(landId) ? 2.0 : 1.0;
    return moraleM * inspectM;
  }

  function getChosenBossCar(data) {
    const emp = data.empire || {};
    const v23 = ensureV23(data);
    const ownedMap = emp.cars || {};

    if (v23.selectedCarKey && v23.selectedCarKey !== "auto") {
      const picked = BOSS_CARS.find((c) => c.key === v23.selectedCarKey && (!c.reqCar || ownedMap[c.reqCar]));
      if (picked) return picked;
    }
    // En prestijli sahip olunan aracı otomatik seç
    for (let i = BOSS_CARS.length - 1; i >= 0; i--) {
      const c = BOSS_CARS[i];
      if (!c.reqCar || ownedMap[c.reqCar]) return c;
    }
    return BOSS_CARS[0];
  }

  // =========================================================================
  // 1) 🏎️ PATRON DİREKSİYONDA (WASD / OK TUŞLARI + MOBİL DOKUNMATİK SÜRÜŞ)
  // =========================================================================
  function bindDrivingKeyboard() {
    if (keyboardBound) return;
    keyboardBound = true;

    window.addEventListener("keydown", (e) => {
      if (!bossDrive.active) return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const anyModalOpen = Array.from(document.querySelectorAll(".overlay-modal")).some(
        (m) => !m.classList.contains("hidden")
      );
      if (anyModalOpen) return;

      if (e.code === "KeyW" || e.code === "ArrowUp") {
        keysHeld.up = true;
        e.preventDefault();
      } else if (e.code === "KeyS" || e.code === "ArrowDown") {
        keysHeld.down = true;
        e.preventDefault();
      } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        keysHeld.left = true;
        e.preventDefault();
      } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        keysHeld.right = true;
        e.preventDefault();
      } else if (e.code === "Space") {
        e.preventDefault();
        if (latestDataRef && latestHelpersRef) honkAndInspect(latestDataRef, latestHelpersRef);
      } else if (e.code === "Escape") {
        e.preventDefault();
        stopDriving(latestHelpersRef);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keysHeld.up = false;
      if (e.code === "KeyS" || e.code === "ArrowDown") keysHeld.down = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keysHeld.left = false;
      if (e.code === "KeyD" || e.code === "ArrowRight") keysHeld.right = false;
    });
  }

  function setTouchDir(dir, isDown) {
    if (touchHeld[dir] !== undefined) touchHeld[dir] = isDown;
  }

  function getNearestLandToPos(wx, wz) {
    let bestId = "station";
    let bestDist = Infinity;
    Object.keys(LAND_META).forEach((lid) => {
      const m = LAND_META[lid];
      const d = Math.hypot(wx - m.ox, wz - m.oz);
      if (d < bestDist) {
        bestDist = d;
        bestId = lid;
      }
    });
    return { landId: bestId, dist: bestDist, meta: LAND_META[bestId] };
  }

  function isLandOwned(data, landId) {
    if (landId === "station") return true;
    if (landId === "land2") return !!(data.empire && data.empire.land2Owned);
    if (landId === "land3") return !!(data.empire && data.empire.land3 && data.empire.land3.owned);
    const st = data.empire && data.empire.extraLands && data.empire.extraLands[landId];
    return !!(st && st.owned);
  }

  function toggleDriving(data, activeLand, helpers) {
    latestDataRef = data;
    latestHelpersRef = helpers;
    bindDrivingKeyboard();

    if (bossDrive.active) {
      stopDriving(helpers);
      return false;
    }

    const carDef = getChosenBossCar(data);
    const startMeta = LAND_META[activeLand] || LAND_META.station;
    bossDrive.active = true;
    bossDrive.carShape = carDef.shape;
    bossDrive.carColor = carDef.color;
    bossDrive.carName = carDef.name;
    bossDrive.wx = startMeta.ox;
    bossDrive.wz = startMeta.oz < 0 ? -61.2 : 10.8;
    bossDrive.angle = Math.PI / 2;
    bossDrive.speed = 0;

    if (helpers && helpers.sfx && helpers.sfx.carHorn) helpers.sfx.carHorn();
    if (helpers && helpers.showToast) {
      helpers.showToast(`${carDef.name} direksiyonundasın! Arazilerin önünde 📣 Teftiş'e bas -> 2x Hız!`);
    }
    syncDriveHudDOM(data);
    return true;
  }

  function stopDriving(helpers) {
    bossDrive.active = false;
    bossDrive.speed = 0;
    keysHeld.up = keysHeld.down = keysHeld.left = keysHeld.right = false;
    touchHeld.up = touchHeld.down = touchHeld.left = touchHeld.right = false;
    syncDriveHudDOM(latestDataRef);
    if (helpers && helpers.showToast) helpers.showToast("🅿️ Makam aracını park ettin.");
  }

  function honkAndInspect(data, helpers) {
    if (!bossDrive.active) return;
    const v23 = ensureV23(data);
    bossDrive.hornFlash = 0.85;
    if (helpers && helpers.sfx && helpers.sfx.carHorn) helpers.sfx.carHorn();

    const near = getNearestLandToPos(bossDrive.wx, bossDrive.wz);
    if (!isLandOwned(data, near.landId)) {
      if (helpers && helpers.showToast) {
        helpers.showToast(`📣 Bip-Bip! ${near.meta.name} henüz satın alınmamış!`);
      }
      return;
    }

    const wasAlready = (inspectedLands[near.landId] || 0) > 45;
    inspectedLands[near.landId] = 60; // 60 saniye boyunca 2x Hız!
    v23.inspectionsCount = (v23.inspectionsCount || 0) + 1;

    if (!wasAlready) {
      const tip = 120 + near.meta.num * 25;
      data.cash += tip;
      if (data.daily) data.daily.eventIncome = (data.daily.eventIncome || 0) + tip;
      if (data.empire && data.empire.v16) data.empire.v16.xp = (data.empire.v16.xp || 0) + 15;
      emergencyFloats.push({
        wx: near.meta.ox,
        wz: near.meta.oz,
        text: `📣 PATRON TEFTİŞİ: 2X HIZ! (+${tip}₺)`,
        color: "#fde047",
        life: 2.2
      });
      if (helpers && helpers.showToast) {
        helpers.showToast(`📣 ${near.meta.name} teftiş edildi! 60 sn boyunca 2X HIZ & VERİM! (+${tip}₺)`);
      }
      if (helpers && helpers.saveGame) helpers.saveGame();
    } else if (helpers && helpers.showToast) {
      helpers.showToast(`📣 ${near.meta.name} zaten tam gaz (2x Hız) çalışıyor!`);
    }
    syncDriveHudDOM(data);
  }

  function syncDriveHudDOM(data) {
    const hud = document.getElementById("bossDriveHud");
    const driveBtn = document.getElementById("btnDriveBossCar");
    if (driveBtn) driveBtn.classList.toggle("driving-on", bossDrive.active);
    if (!hud) return;
    hud.classList.toggle("hidden", !bossDrive.active);
    if (!bossDrive.active) return;

    const near = getNearestLandToPos(bossDrive.wx, bossDrive.wz);
    const carLbl = document.getElementById("driveCarTitle");
    const nearLbl = document.getElementById("driveInspectSub");
    if (carLbl) carLbl.textContent = bossDrive.carName;
    if (nearLbl && data) {
      const owned = isLandOwned(data, near.landId);
      const rem = Math.ceil(inspectedLands[near.landId] || 0);
      nearLbl.textContent = !owned
        ? `${near.meta.name} (Satılık)`
        : rem > 0
        ? `${near.meta.name} • 🔥 2x (${rem}sn)`
        : `${near.meta.name} • 2x Hız Ver!`;
    }
  }

  // =========================================================================
  // 3) 🚑 ARAZİLER ARASI 3D ACİL MÜDAHALE (AMBULANS & İTFAİYE SEVKİ)
  // =========================================================================
  function getOwnedLandsList(data) {
    return Object.keys(LAND_META).filter((lid) => isLandOwned(data, lid));
  }

  function findOwnedHospitalLand(data) {
    const ext = data.empire && data.empire.extraLands;
    if (!ext) return null;
    for (const lid of Object.keys(ext)) {
      if (ext[lid] && ext[lid].owned && ext[lid].projectKey === "hospital") {
        return lid;
      }
    }
    return null;
  }

  function spawnCityEmergency(data, helpers) {
    const owned = getOwnedLandsList(data);
    if (owned.length === 0) return;
    const targetLand = owned[Math.floor(Math.random() * owned.length)];
    const meta = LAND_META[targetLand];
    const isMedical = Math.random() < 0.55;
    const hospLand = findOwnedHospitalLand(data);
    const baseReward = Math.round((550 + meta.num * 210) * (isMedical && hospLand ? 1.5 : 1.0));

    activeEmergency = {
      id: Date.now(),
      kind: isMedical ? "ambulance" : "fire",
      targetLand,
      title: isMedical
        ? `🚑 ${meta.name}: VIP Misafir Rahatsızlandı!`
        : `🚒 ${meta.name}: Elektrik Panosu Kıvılcımı!`,
      reward: baseReward,
      hasHospitalBonus: !!(isMedical && hospLand),
      hospLand,
      timeLeft: 38,
      dispatched: false,
      vehicle: null
    };

    // Eğer oyuncunun Özel Hastanesi ve Hastane Müdürü varsa sağlık aciline otomatik ambulans çıkar!
    if (
      isMedical &&
      hospLand &&
      data.empire.extraLands[hospLand].staff &&
      data.empire.extraLands[hospLand].staff.manager
    ) {
      dispatchEmergency(data, helpers, true);
      return;
    }

    syncEmergencyBannerDOM();
    if (helpers && helpers.sfx) helpers.sfx.doorBell();
  }

  function buildBoulevardWaypoints(startWx, startWz, targetLand) {
    const tMeta = LAND_META[targetLand] || LAND_META.station;
    const targetRoadZ = tMeta.oz < 0 ? -61.2 : 10.8;
    const targetFrontZ = tMeta.oz - 17.5;
    const wps = [];

    if (Math.abs(startWz - targetRoadZ) > 8) {
      // En yakın dikey bağlantı caddesinden karşı bulvara geç!
      const avenues = [-140, -84, -28, 28, 84, 140];
      let bestAx = -28;
      let bestD = Infinity;
      avenues.forEach((ax) => {
        const d = Math.abs(startWx - ax) + Math.abs(tMeta.ox - ax) * 0.5;
        if (d < bestD) {
          bestD = d;
          bestAx = ax;
        }
      });
      wps.push({ wx: bestAx, wz: startWz });
      wps.push({ wx: bestAx, wz: targetRoadZ });
    }
    wps.push({ wx: tMeta.ox, wz: targetRoadZ });
    wps.push({ wx: tMeta.ox, wz: targetFrontZ });
    return wps;
  }

  function dispatchEmergency(data, helpers, isAuto = false) {
    if (!activeEmergency || activeEmergency.dispatched) return false;
    activeEmergency.dispatched = true;

    const hospLid = activeEmergency.kind === "ambulance" ? activeEmergency.hospLand : null;
    const startMeta = hospLid ? LAND_META[hospLid] : null;
    const tMeta = LAND_META[activeEmergency.targetLand] || LAND_META.station;

    const startWx = startMeta ? startMeta.ox : -158;
    const startWz = startMeta ? (startMeta.oz < 0 ? -61.2 : 10.8) : (tMeta.oz < 0 ? -61.2 : 10.8);

    activeEmergency.vehicle = {
      wx: startWx,
      wz: startWz,
      angle: Math.PI / 2,
      kind: activeEmergency.kind,
      phase: "to_target",
      waitTimer: 2.3,
      waypoints: buildBoulevardWaypoints(startWx, startWz, activeEmergency.targetLand)
    };

    syncEmergencyBannerDOM();
    if (helpers && helpers.sfx) helpers.sfx.policeSiren();
    if (helpers && helpers.showToast) {
      helpers.showToast(
        isAuto
          ? `🏥 Özel Hastanenden ${tMeta.name} için 3D Ambulans otomatik sevk edildi!`
          : `${activeEmergency.kind === "ambulance" ? "🚑 3D Ambulans" : "🚒 3D Acil Müdahale Ekibi"} bulvardan ${tMeta.name}'a hızla gidiyor!`
      );
    }
    return true;
  }

  function syncEmergencyBannerDOM() {
    const bar = document.getElementById("cityEmergencyBar");
    if (!bar) return;
    if (!activeEmergency) {
      bar.classList.add("hidden");
      return;
    }
    bar.classList.remove("hidden");
    if (activeEmergency.dispatched) {
      bar.classList.add("dispatched");
      bar.textContent = `${activeEmergency.kind === "ambulance" ? "🚑 Ambulans" : "🚒 Acil Ekip"} Yolda -> ${LAND_META[activeEmergency.targetLand].name} (+${activeEmergency.reward}₺)`;
    } else {
      bar.classList.remove("dispatched");
      bar.textContent = `🚨 ${activeEmergency.title} — Dokun Ekip Gönder (+${activeEmergency.reward}₺ • ${Math.ceil(activeEmergency.timeLeft)}sn)`;
    }
  }

  // =========================================================================
  // 4) 🔨 CANLI DEV İHALELER (AÇIK ARTIRMA & ÇOK GÜNLÜ SÖZLEŞMELER)
  // =========================================================================
  function startNewAuction(data, helpers, manualOpen = false) {
    const v23 = ensureV23(data);
    if (v23.activeAuction && !manualOpen) return;

    // Oyuncunun büyüklüğüne uygun ihale seç (ilk günlerde uygun fiyatlı ihaleler de gelsin!)
    const wealthRef = Math.max(5000, (data.cash || 0) + ((data.empire && data.empire.personalCash) || 0));
    const eligible = TENDER_POOL.filter((t) => t.startBid <= Math.max(12000, wealthRef * 2.2));
    const pool = eligible.length > 0 ? eligible : [TENDER_POOL[0], TENDER_POOL[1]];
    const def = pool[Math.floor(Math.random() * pool.length)];
    const rival = RIVAL_BIDDERS[Math.floor(Math.random() * RIVAL_BIDDERS.length)];

    v23.activeAuction = {
      id: Date.now(),
      defKey: def.key,
      emoji: def.emoji,
      name: def.name,
      desc: def.desc,
      currentBid: def.startBid,
      stepBid: def.stepBid,
      buyout: def.buyout,
      maxRivalBid: Math.round(def.buyout * 0.82),
      cycleIncome: def.cycleIncome,
      days: def.days,
      repBonus: def.repBonus,
      rivalBoss: rival.boss,
      rivalHold: rival.hold,
      leadingByPlayer: false,
      playerCommittedBid: 0,
      timeLeft: 65
    };
    rivalBidCooldown = 6.5;

    if (helpers && helpers.showToast) {
      helpers.showToast(`🔨 YENİ DEV İHALE: ${def.emoji} ${def.name}! ⚡ Komuta'dan teklif ver!`);
    }
    syncCommandFabBadge(data);
  }

  function finalizeAuctionWin(data, auc, paidPrice, helpers) {
    const v23 = ensureV23(data);
    v23.activeContracts.push({
      id: auc.id,
      emoji: auc.emoji,
      name: auc.name,
      cycleIncome: auc.cycleIncome,
      daysLeft: auc.days
    });
    v23.tendersWonCount = (v23.tendersWonCount || 0) + 1;
    v23.activeAuction = null;
    data.reputation = Math.min(100, (data.reputation || 50) + (auc.repBonus || 5));
    if (data.empire && data.empire.v16) {
      data.empire.v16.xp = (data.empire.v16.xp || 0) + 95;
    }
    if (helpers) {
      if (helpers.sfx) helpers.sfx.perfectHit();
      if (helpers.showToast) {
        helpers.showToast(`🏆 İHALEYİ KAZANDIN: ${auc.name}! (${auc.days} gün boyunca +${auc.cycleIncome}₺/döngü)`);
      }
      if (helpers.saveGame) helpers.saveGame();
      if (helpers.updateHUD) helpers.updateHUD();
    }
    syncCommandFabBadge(data);
  }

  function syncCommandFabBadge(data) {
    const btn = document.getElementById("commandV23Btn");
    if (!btn || !data) return;
    const v23 = ensureV23(data);
    const alertOn = !!(v23.activeAuction || activeEmergency || (v23.morale || 100) < 50);
    btn.classList.toggle("reward-ready", alertOn);
  }

  // =========================================================================
  // ANA 60 FPS DÜNYA GÜNCELLEMESİ (TÜM 6 MEKANİK BİR ARADA)
  // =========================================================================
  function updateV23(dt, data, helpers) {
    latestDataRef = data;
    latestHelpersRef = helpers;
    const v23 = ensureV23(data);

    // 1. Teftiş Sayaçlarını Güncelle
    Object.keys(inspectedLands).forEach((lid) => {
      if (inspectedLands[lid] > 0) {
        inspectedLands[lid] = Math.max(0, inspectedLands[lid] - dt);
      }
    });

    // 2. Ekip Morali Doğal Değişimi (Sosyal Tesis varsa %65 daha yavaş yorulur, taban %75 kalır!)
    const minFloor = v23.loungeUnlocked ? 78 : 44;
    const decayRate = v23.morale > 100 ? 0.55 : v23.loungeUnlocked ? 0.08 : 0.24;
    if (v23.morale > minFloor) {
      v23.morale = Math.max(minFloor, v23.morale - decayRate * dt);
    }

    // 3. Kazanılmış İhale Sözleşmelerinin Canlı Döngü Geliri
    if (v23.activeContracts && v23.activeContracts.length > 0) {
      contractTickTimer += dt;
      if (contractTickTimer >= 8.0) {
        contractTickTimer -= 8.0;
        const totalInc = v23.activeContracts.reduce((s, c) => s + (c.cycleIncome || 0), 0);
        if (totalInc > 0) {
          data.cash += totalInc;
          if (data.daily) data.daily.tenderIncome = (data.daily.tenderIncome || 0) + totalInc;
        }
      }
    }

    // 4. Canlı Açık Artırma (İhale) Sayacı & Rakip Teklifleri
    if (v23.activeAuction) {
      const auc = v23.activeAuction;
      auc.timeLeft -= dt;

      if (auc.leadingByPlayer && auc.currentBid < auc.maxRivalBid) {
        rivalBidCooldown -= dt;
        if (rivalBidCooldown <= 0) {
          rivalBidCooldown = 6.5 + Math.random() * 4.5;
          if (Math.random() < 0.65) {
            // Rakip üstüne çıkarsa oyuncunun önceki bloke teklifini kasasına iade et!
            if (auc.playerCommittedBid > 0) {
              data.cash += auc.playerCommittedBid;
              auc.playerCommittedBid = 0;
            }
            auc.currentBid += auc.stepBid;
            auc.leadingByPlayer = false;
            if (helpers && helpers.showToast) {
              helpers.showToast(`🔨 ${auc.rivalBoss} (${auc.rivalHold}) ihalede teklifi ${auc.currentBid.toLocaleString("tr-TR")} ₺ yaptı!`);
            }
            refreshModalIfOpen(data, helpers);
          }
        }
      }

      if (auc.timeLeft <= 0) {
        if (auc.leadingByPlayer) {
          finalizeAuctionWin(data, auc, auc.playerCommittedBid, helpers);
        } else {
          v23.activeAuction = null;
          if (helpers && helpers.showToast) {
            helpers.showToast(`⌛ İhale süresi doldu: ${auc.name} rakip ${auc.rivalHold}'e gitti.`);
          }
        }
        auctionSpawnTimer = 55;
        refreshModalIfOpen(data, helpers);
      }
    } else {
      auctionSpawnTimer -= dt;
      if (auctionSpawnTimer <= 0) {
        auctionSpawnTimer = 65 + Math.random() * 25;
        startNewAuction(data, helpers, false);
      }
    }

    // 5. Araziler Arası 3D Acil Müdahale Hareketi
    if (!activeEmergency) {
      emergencyTimer -= dt;
      if (emergencyTimer <= 0) {
        emergencyTimer = 48 + Math.random() * 20;
        spawnCityEmergency(data, helpers);
      }
    } else if (!activeEmergency.dispatched) {
      activeEmergency.timeLeft -= dt;
      if (Math.floor(activeEmergency.timeLeft + dt) !== Math.floor(activeEmergency.timeLeft)) {
        syncEmergencyBannerDOM();
      }
      if (activeEmergency.timeLeft <= 0) {
        activeEmergency = null;
        syncEmergencyBannerDOM();
      }
    } else if (activeEmergency.vehicle) {
      const v = activeEmergency.vehicle;
      if (v.phase === "to_target" || v.phase === "leaving") {
        const wp = v.waypoints[0];
        if (wp) {
          const dx = wp.wx - v.wx;
          const dz = wp.wz - v.wz;
          const dist = Math.hypot(dx, dz);
          const spd = 44;
          if (dist > 0.2) {
            v.angle = Math.atan2(dx, dz);
          }
          if (dist <= spd * dt) {
            v.wx = wp.wx;
            v.wz = wp.wz;
            v.waypoints.shift();
          } else {
            v.wx += (dx / dist) * spd * dt;
            v.wz += (dz / dist) * spd * dt;
          }
        } else if (v.phase === "to_target") {
          v.phase = "treating";
        } else {
          activeEmergency = null;
          syncEmergencyBannerDOM();
        }
      } else if (v.phase === "treating") {
        v.waitTimer -= dt;
        if (v.waitTimer <= 0) {
          const rew = activeEmergency.reward;
          const tMeta = LAND_META[activeEmergency.targetLand] || LAND_META.station;
          data.cash += rew;
          if (data.daily) data.daily.emergencyIncome = (data.daily.emergencyIncome || 0) + rew;
          data.reputation = Math.min(100, (data.reputation || 50) + 4);
          data.security = Math.min(100, (data.security || 65) + 4);
          v23.emergenciesResolved = (v23.emergenciesResolved || 0) + 1;
          if (data.empire && data.empire.v16) data.empire.v16.xp = (data.empire.v16.xp || 0) + 30;

          emergencyFloats.push({
            wx: tMeta.ox,
            wz: tMeta.oz,
            text: `${activeEmergency.kind === "ambulance" ? "🚑" : "🚒"} MÜDAHALE TAMAM +${rew}₺!`,
            color: "#4ade80",
            life: 2.3
          });
          if (helpers) {
            if (helpers.sfx) helpers.sfx.cashRegister();
            if (helpers.showToast) {
              helpers.showToast(`✅ ${tMeta.name} acil durumu çözüldü! +${rew} ₺ ödül ve +4 İtibar!`);
            }
            if (helpers.saveGame) helpers.saveGame();
          }
          const outRoadZ = tMeta.oz < 0 ? -61.2 : 10.8;
          v.phase = "leaving";
          v.waypoints = [
            { wx: tMeta.ox, wz: outRoadZ },
            { wx: 168, wz: outRoadZ }
          ];
          syncEmergencyBannerDOM();
        }
      }
    }

    // 6. 🏎️ 3D Patron Aracı Fizik & Kamera Takibi
    if (bossDrive.active) {
      if (bossDrive.hornFlash > 0) bossDrive.hornFlash = Math.max(0, bossDrive.hornFlash - dt);
      const carDef = getChosenBossCar(data);
      const maxSpd = carDef.maxSpd || 40;
      const throttle = (keysHeld.up || touchHeld.up ? 1 : 0) - (keysHeld.down || touchHeld.down ? 1 : 0);
      const steerIn = (keysHeld.left || touchHeld.left ? 1 : 0) - (keysHeld.right || touchHeld.right ? 1 : 0);

      if (throttle > 0) {
        bossDrive.speed = Math.min(maxSpd, bossDrive.speed + 52 * dt);
      } else if (throttle < 0) {
        bossDrive.speed = Math.max(-maxSpd * 0.55, bossDrive.speed - 56 * dt);
      } else {
        bossDrive.speed *= Math.max(0, 1 - 4.2 * dt);
        if (Math.abs(bossDrive.speed) < 0.3) bossDrive.speed = 0;
      }

      if (Math.abs(bossDrive.speed) > 0.8 && steerIn !== 0) {
        const dirSign = bossDrive.speed >= 0 ? 1 : -1;
        bossDrive.angle += steerIn * dirSign * 2.55 * dt;
      }

      bossDrive.wx = Math.max(-152, Math.min(152, bossDrive.wx + Math.sin(bossDrive.angle) * bossDrive.speed * dt));
      bossDrive.wz = Math.max(-68, Math.min(76, bossDrive.wz + Math.cos(bossDrive.angle) * bossDrive.speed * dt));

      if (window.Engine3D && window.Engine3D.followWorldPos) {
        window.Engine3D.followWorldPos(bossDrive.wx, bossDrive.wz);
      }
      if (helpers && helpers.onBossNearLand) {
        const near = getNearestLandToPos(bossDrive.wx, bossDrive.wz);
        if (near.dist < 36) helpers.onBossNearLand(near.landId);
      }
      syncDriveHudDOM(data);
    }

    // Uçuşan 3D Etiketler
    for (let i = emergencyFloats.length - 1; i >= 0; i--) {
      emergencyFloats[i].life -= dt;
      if (emergencyFloats[i].life <= 0) emergencyFloats.splice(i, 1);
    }

    syncCommandFabBadge(data);
  }

  function onDayRollover(data) {
    const v23 = ensureV23(data);
    // İhale sözleşmelerinin kalan gününü düşür
    if (Array.isArray(v23.activeContracts)) {
      v23.activeContracts.forEach((c) => {
        c.daysLeft = (c.daysLeft || 1) - 1;
      });
      v23.activeContracts = v23.activeContracts.filter((c) => c.daysLeft > 0);
    }
    // Sosyal tesis varsa yeni güne en az %95 dinç moralle başlar!
    if (v23.loungeUnlocked && v23.morale < 95) {
      v23.morale = 95;
    } else if (v23.morale < 75) {
      v23.morale = 75;
    }
  }

  function get3DRenderState(data) {
    const v23 = ensureV23(data);
    const customPlate = data.empire && data.empire.v16 && data.empire.v16.customPlate;
    return {
      brandName: v23.brandName || "SON İSTASYON",
      brandShort: getBrandShort(data),
      neonHex: getNeonTheme(data).hex,
      neonGlow: getNeonTheme(data).glow,
      fuelPolicy: getFuelPolicy(data),
      bossDrive: bossDrive.active
        ? {
            wx: bossDrive.wx,
            wz: bossDrive.wz,
            angle: bossDrive.angle,
            color: bossDrive.carColor,
            shape: bossDrive.carShape,
            hornFlash: bossDrive.hornFlash,
            tag: customPlate ? `👑 ${customPlate}` : `👑 PATRON`
          }
        : null,
      emergencyVehicle:
        activeEmergency && activeEmergency.vehicle
          ? {
              wx: activeEmergency.vehicle.wx,
              wz: activeEmergency.vehicle.wz,
              angle: activeEmergency.vehicle.angle,
              kind: activeEmergency.vehicle.kind,
              phase: activeEmergency.vehicle.phase
            }
          : null,
      pendingEmergencyLand:
        activeEmergency && !activeEmergency.dispatched
          ? { landId: activeEmergency.targetLand, kind: activeEmergency.kind }
          : null,
      inspectedLands,
      floats: emergencyFloats
    };
  }

  // =========================================================================
  // ⚡ KOMUTA MERKEZİ MODALI (4 SEKME: FİYAT & MARKA • İHALELER • MORAL • SÜRÜŞ & ACİL)
  // =========================================================================
  function setCommandTab(tab) {
    currentCmdTab = tab;
  }

  function refreshModalIfOpen(data, helpers) {
    const modal = document.getElementById("commandV23Modal");
    if (modal && !modal.classList.contains("hidden")) {
      renderCommandModal(data, helpers);
    }
  }

  function renderCommandModal(data, helpers) {
    const v23 = ensureV23(data);
    const body = document.getElementById("commandV23Body");
    const badge = document.getElementById("commandV23Badge");
    if (!body) return;

    const mStat = getMoraleStatus(v23.morale);
    if (badge) badge.textContent = `Moral %${Math.round(v23.morale)}`;

    document.querySelectorAll(".cmd23-tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.cmdtab === currentCmdTab);
    });

    // SEKME 1: ⛽ FİYAT POLİTİKASI & 🪧 KURUMSAL MARKA / NEON
    if (currentCmdTab === "brand") {
      const curPol = getFuelPolicy(data);
      const curTheme = getNeonTheme(data);

      const policyCards = Object.values(FUEL_POLICIES)
        .map((p) => {
          const active = p.key === curPol.key;
          return `
            <div class="upgrade-card" style="border-color:${active ? "#4ade80" : "#334155"}; background:${active ? "rgba(20,83,45,0.35)" : ""};">
              <div class="up-info">
                <h3>${p.title} <span style="font-size:12px; color:#fde047;">(${p.benzin} ₺/L)</span></h3>
                <p>${p.desc}</p>
              </div>
              <button class="up-buy-btn v23-pol-btn" data-pol="${p.key}" ${active ? "disabled" : ""}>
                ${active ? "AKTİF ✓" : "Uygula"}
              </button>
            </div>
          `;
        })
        .join("");

      const themeBtns = Object.values(NEON_THEMES)
        .map((t) => {
          const isSel = t.key === curTheme.key;
          return `
            <button class="sal-btn v23-neon-btn ${isSel ? "active" : ""}" data-neon="${t.key}" style="border-color:${t.hex}; ${isSel ? `background:${t.hex}; color:#090d1a;` : ""}">
              ${t.name}
            </button>
          `;
        })
        .join("");

      body.innerHTML = `
        <div class="rep-section" style="border-color:${curTheme.hex}; margin-bottom:10px;">
          <h4 style="color:${curTheme.glow};">🪧 KURUMSAL KİMLİK &amp; 3D NEON TABELA</h4>
          <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:8px;">
            Yazdığın marka adı <strong>3D Yakıt Totemi, Dev Otoyol Tabelası, Grand AVM, Grand Otel ve Holding Ligi</strong> tabelalarına anında basılır!
          </p>
          <div style="display:flex; gap:7px; margin-bottom:10px;">
            <input id="v23BrandInput" type="text" maxlength="14" value="${v23.brandName}" placeholder="Örn: DİJİTESLA"
              style="flex:1; background:#090d1a; color:#fef08a; border:2px solid ${curTheme.hex}; border-radius:10px; padding:9px 11px; font-size:15px; font-weight:900; text-transform:uppercase;" />
            <button id="v23SaveBrandBtn" class="up-buy-btn" style="padding:9px 14px;">Tabelaya Bas</button>
          </div>
          <div style="font-size:12px; font-weight:800; color:#e2e8f0; margin-bottom:6px;">🎨 Tesis &amp; Kanopi Neon Rengi:</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">${themeBtns}</div>
        </div>

        <div class="rep-section" style="border-color:#38bdf8;">
          <h4>⛽ CANLI AKARYAKIT FİYAT REKABETİ (3D TOTEM CANLI)</h4>
          <p style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">
            Benzin: <strong>${curPol.benzin}₺</strong> • Dizel: <strong>${curPol.dizel}₺</strong> • LPG: <strong>${curPol.lpg}₺</strong> • EV: <strong>${curPol.ev}₺</strong>
          </p>
          ${policyCards}
        </div>
      `;

      const saveBtn = document.getElementById("v23SaveBrandBtn");
      const inp = document.getElementById("v23BrandInput");
      if (saveBtn && inp) {
        saveBtn.addEventListener("click", () => {
          v23.brandName = sanitizeBrandName(inp.value);
          applyBrandThemeToDOM(data);
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          helpers.showToast(`🪧 "${v23.brandName}" tüm 3D tesis tabelalarına ve toteme basıldı!`);
          renderCommandModal(data, helpers);
        });
      }

      body.querySelectorAll(".v23-neon-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nk = btn.dataset.neon;
          if (!NEON_THEMES[nk]) return;
          v23.neonTheme = nk;
          applyBrandThemeToDOM(data);
          helpers.sfx.tap();
          helpers.saveGame();
          helpers.showToast(`🎨 Kurumsal Neon Rengi: ${NEON_THEMES[nk].name} aktif!`);
          renderCommandModal(data, helpers);
        });
      });

      body.querySelectorAll(".v23-pol-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pk = btn.dataset.pol;
          if (!FUEL_POLICIES[pk]) return;
          v23.fuelPolicy = pk;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          helpers.showToast(`⛽ Fiyat Politikası: ${FUEL_POLICIES[pk].title} (${FUEL_POLICIES[pk].benzin} ₺/L) 3D toteme yansıdı!`);
          renderCommandModal(data, helpers);
        });
      });
      return;
    }

    // SEKME 2: 🔨 CANLI DEV İHALELER & AKTİF SÖZLEŞMELER
    if (currentCmdTab === "tenders") {
      const auc = v23.activeAuction;
      let aucHtml = "";
      if (auc) {
        const nextBid = auc.currentBid + auc.stepBid;
        aucHtml = `
          <div class="rep-section" style="border-color:#f59e0b; background:rgba(120,53,15,0.22); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:12px; font-weight:900; color:#fde047;">🔨 CANLI AÇIK ARTIRMA</span>
              <span class="shift-pill" style="color:#fca5a5;">⏳ ${Math.ceil(auc.timeLeft)} sn</span>
            </div>
            <h3 style="font-size:16px; font-weight:900; color:#fff; margin-bottom:4px;">${auc.emoji} ${auc.name}</h3>
            <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:8px;">${auc.desc}</p>
            <div class="rep-row"><span>💼 Sözleşme Kazancı:</span><span class="val-pos">+${auc.cycleIncome} ₺ / döngü (${auc.days} Gün)</span></div>
            <div class="rep-row"><span>⭐ İtibar Ödülü:</span><span class="val-pos">+${auc.repBonus} İtibar</span></div>
            <div class="rep-row" style="margin-top:4px; padding-top:4px; border-top:1px solid #334155;">
              <span>Şu Anki En Yüksek Teklif:</span>
              <strong style="color:#fde047; font-size:15px;">${auc.currentBid.toLocaleString("tr-TR")} ₺</strong>
            </div>
            <div style="font-size:12px; font-weight:800; color:${auc.leadingByPlayer ? "#4ade80" : "#f87171"}; margin:5px 0 10px;">
              ${auc.leadingByPlayer ? "✅ Lider Sensin! Süre bitince veya Hemen Kapat ile sözleşme senin!" : `⚠️ Lider Rakip: ${auc.rivalBoss} (${auc.rivalHold})`}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button id="v23BidStepBtn" class="up-buy-btn" ${auc.leadingByPlayer ? "disabled" : ""}>
                ${auc.leadingByPlayer ? "LİDERSİN ✓" : `🔨 Teklif Ver (${nextBid.toLocaleString("tr-TR")}₺)`}
              </button>
              <button id="v23BuyoutTenderBtn" class="up-buy-btn" style="background:linear-gradient(180deg,#22c55e,#15803d); color:#fff;">
                ⚡ Hemen Al (${auc.buyout.toLocaleString("tr-TR")}₺)
              </button>
            </div>
          </div>
        `;
      } else {
        aucHtml = `
          <div class="rep-section" style="text-align:center; margin-bottom:10px;">
            <div style="font-size:14px; font-weight:900; color:#fde68a; margin-bottom:6px;">📋 Şu An Açıkta İhale Yok</div>
            <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:10px;">Yeni kurumsal ihale birazdan açılacak veya beklemeden yeni ihale dosyası açtırabilirsin!</p>
            <button id="v23OpenNewTenderBtn" class="primary-btn" style="padding:10px; font-size:14px;">📢 Hemen Yeni İhale Dosyası Aç</button>
          </div>
        `;
      }

      const contractsHtml =
        v23.activeContracts.length > 0
          ? v23.activeContracts
              .map(
                (c) => `
              <div class="upgrade-card" style="border-color:#22c55e;">
                <div class="up-info">
                  <h3>${c.emoji} ${c.name}</h3>
                  <p>Düzenli Gelir: <strong style="color:#4ade80;">+${c.cycleIncome} ₺ / döngü</strong> • Kalan: <strong>${c.daysLeft} Gün</strong></p>
                </div>
                <span class="shift-pill" style="color:#86efac;">AKTİF ✓</span>
              </div>
            `
              )
              .join("")
          : `<div style="font-size:12.5px; color:#94a3b8; text-align:center; padding:8px;">Henüz aktif ihale sözleşmen yok. Yukarıdan ihale kazanarak düzenli nakit akışı bağla!</div>`;

      body.innerHTML = `
        ${aucHtml}
        <div class="rep-section" style="border-color:#22c55e;">
          <h4>📜 KAZANILAN AKTİF SÖZLEŞMELER (${v23.activeContracts.length})</h4>
          ${contractsHtml}
        </div>
      `;

      const openNewBtn = document.getElementById("v23OpenNewTenderBtn");
      if (openNewBtn) {
        openNewBtn.addEventListener("click", () => {
          helpers.sfx.tap();
          startNewAuction(data, helpers, true);
          renderCommandModal(data, helpers);
        });
      }

      const bidBtn = document.getElementById("v23BidStepBtn");
      if (bidBtn && auc) {
        bidBtn.addEventListener("click", () => {
          const nextBid = auc.currentBid + auc.stepBid;
          helpers.payForBusiness(nextBid, `${auc.name} İhale Teklifi`, () => {
            if (auc.playerCommittedBid > 0) data.cash += auc.playerCommittedBid;
            auc.currentBid = nextBid;
            auc.playerCommittedBid = nextBid;
            auc.leadingByPlayer = true;
            rivalBidCooldown = 7.0;
            helpers.sfx.tap();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast(`🔨 ${nextBid.toLocaleString("tr-TR")} ₺ teklifle ihalede liderliğe yükseldin!`);
            renderCommandModal(data, helpers);
          });
        });
      }

      const buyBtn = document.getElementById("v23BuyoutTenderBtn");
      if (buyBtn && auc) {
        buyBtn.addEventListener("click", () => {
          const netNeed = Math.max(0, auc.buyout - (auc.playerCommittedBid || 0));
          helpers.payForBusiness(netNeed, `${auc.name} İhale Hemen Kapatma`, () => {
            finalizeAuctionWin(data, auc, auc.buyout, helpers);
            renderCommandModal(data, helpers);
          });
        });
      }
      return;
    }

    // SEKME 3: 🏅 EKİP MORALİ, KAHVE İKRAMI, BAYRAM PRİMİ & SOSYAL TESİS
    if (currentCmdTab === "morale") {
      const mVal = Math.round(v23.morale);
      const pctBar = Math.min(100, Math.round((mVal / 150) * 100));
      const ownedCount = getOwnedLandsList(data).length;
      const coffeeCost = 180 + ownedCount * 60;
      const bonusCost = 950 + ownedCount * 380;

      body.innerHTML = `
        <div class="rep-section" style="border-color:${mStat.color}; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:14px; font-weight:900; color:#fff;">🏅 Tüm Araziler Ekip Morali</span>
            <strong style="font-size:17px; color:${mStat.color};">%${mVal} / 150</strong>
          </div>
          <div style="width:100%; height:13px; background:#090d1a; border-radius:999px; border:1.5px solid #334155; overflow:hidden; margin-bottom:6px;">
            <div style="width:${pctBar}%; height:100%; background:linear-gradient(90deg,#22c55e,#facc15,#f97316); transition:width 0.25s;"></div>
          </div>
          <div style="font-size:12.5px; font-weight:800; color:${mStat.color};">${mStat.label}</div>
          <p style="font-size:12px; color:#cbd5e1; margin-top:4px;">
            Moral %115 üstüne çıktığında <strong>10 arazinin tamamında pompacılar, aşçılar, AVM ve otel ekipleri 1.5x TURBO HIZLA</strong> çalışır!
          </p>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>☕ Sıcak Kahve &amp; Tatlı İkram Et</h3>
            <p>Tüm vardiyaya taze kahve ve baklava dağıtır: Moral <strong>+%30</strong> yükselir!</p>
          </div>
          <button id="v23CoffeeBtn" class="up-buy-btn" ${mVal >= 148 ? "disabled" : ""}>${coffeeCost} ₺</button>
        </div>

        <div class="upgrade-card" style="border-color:#facc15;">
          <div class="up-info">
            <h3>💸 Bayram İkramiyesi / Prim Dağıt</h3>
            <p>Tüm ekibin moralini anında <strong>%150 SÜPER COŞKU (1.5x Hız)</strong> yapar ve <strong>+5 İtibar</strong> kazandırır!</p>
          </div>
          <button id="v23BonusBtn" class="up-buy-btn" ${mVal >= 148 ? "disabled" : ""}>${bonusCost.toLocaleString("tr-TR")} ₺</button>
        </div>

        <div class="upgrade-card" style="border-color:#38bdf8;">
          <div class="up-info">
            <h3>🛋️ Personel Dinlenme &amp; Kafe Salonu</h3>
            <p>Kalıcı tesis: Çalışanların yorulmasını %65 azaltır, her sabah vardiyaya en az %95 dinç başlarlar!</p>
          </div>
          <button id="v23LoungeBtn" class="up-buy-btn" ${v23.loungeUnlocked ? "disabled" : ""}>
            ${v23.loungeUnlocked ? "KURULDU ✓" : `${LOUNGE_COST.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
      `;

      const cofBtn = document.getElementById("v23CoffeeBtn");
      if (cofBtn) {
        cofBtn.addEventListener("click", () => {
          helpers.payForBusiness(coffeeCost, "Ekibe Kahve & Tatlı İkramı", () => {
            v23.morale = Math.min(150, v23.morale + 30);
            helpers.sfx.coffeeBrew();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast(`☕ Ekibe kahve ve tatlı ikram edildi! Moral: %${Math.round(v23.morale)}`);
            renderCommandModal(data, helpers);
          });
        });
      }

      const bonBtn = document.getElementById("v23BonusBtn");
      if (bonBtn) {
        bonBtn.addEventListener("click", () => {
          helpers.payForBusiness(bonusCost, "Bayram İkramiyesi & Maaş Primi", () => {
            v23.morale = 150;
            data.reputation = Math.min(100, (data.reputation || 50) + 5);
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast("🔥 BAYRAM İKRAMİYESİ DAĞITILDI! Tüm 10 arazide %150 SÜPER COŞKU (1.5x Hız) başladı!");
            renderCommandModal(data, helpers);
          });
        });
      }

      const lngBtn = document.getElementById("v23LoungeBtn");
      if (lngBtn && !v23.loungeUnlocked) {
        lngBtn.addEventListener("click", () => {
          helpers.payForBusiness(LOUNGE_COST, "Personel Dinlenme & Kafe Salonu", () => {
            v23.loungeUnlocked = true;
            v23.morale = Math.max(v23.morale, 115);
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast("🛋️ Personel Sosyal Tesisi açıldı! Ekip artık yorulmuyor!");
            renderCommandModal(data, helpers);
          });
        });
      }
      return;
    }

    // SEKME 4: 🏎️ 3D PATRON SÜRÜŞÜ & 🚑 ŞEHİR ACİL MÜDAHALE MERKEZİ
    const ownedCarsMap = (data.empire && data.empire.cars) || {};
    const curCar = getChosenBossCar(data);
    const carSelectHtml = BOSS_CARS.map((c) => {
      const unlocked = !c.reqCar || !!ownedCarsMap[c.reqCar];
      const isSel = curCar.key === c.key;
      return `
        <div class="upgrade-card" style="padding:9px 11px; border-color:${isSel ? "#facc15" : unlocked ? "#334155" : "#1e293b"}; opacity:${unlocked ? "1" : "0.6"};">
          <div class="up-info">
            <h3 style="font-size:14.5px;">${c.name}</h3>
            <p style="font-size:12px;">Maks Hız: ${c.maxSpd * 3} km/s ${!unlocked ? "• (🏙️ Şehir -> Galerici'den satın al)" : ""}</p>
          </div>
          <button class="up-buy-btn v23-pickcar-btn" data-ckey="${c.key}" style="padding:7px 10px; font-size:12px;" ${!unlocked || isSel ? "disabled" : ""}>
            ${isSel ? "SEÇİLİ ✓" : unlocked ? "Seç" : "Kilitli 🔒"}
          </button>
        </div>
      `;
    }).join("");

    const hospLid = findOwnedHospitalLand(data);
    const emHtml = activeEmergency
      ? `
        <div class="upgrade-card" style="border-color:#ef4444; background:rgba(127,29,29,0.28);">
          <div class="up-info">
            <h3>🚨 ${activeEmergency.title}</h3>
            <p>Ödül: <strong style="color:#4ade80;">+${activeEmergency.reward} ₺</strong> + 4 İtibar</p>
          </div>
          <button id="v23ModalDispatchBtn" class="up-buy-btn" ${activeEmergency.dispatched ? "disabled" : ""}>
            ${activeEmergency.dispatched ? "Yolda 🚑" : "Ekip Gönder!"}
          </button>
        </div>
      `
      : `<div style="font-size:12.5px; color:#86efac; margin-bottom:6px;">✅ Şu an 10 arazide aktif acil durum yok (Çözülen: ${v23.emergenciesResolved || 0}).</div>`;

    body.innerHTML = `
      <div class="rep-section" style="border-color:#ef4444; margin-bottom:10px;">
        <h4>🏎️ PATRON DİREKSİYONDA (3D ŞEHİR TURU &amp; 2X TEFTİŞ)</h4>
        <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:8px;">
          Mac/Windows'ta <strong>WASD veya Yön Tuşları</strong> (Korna/Teftiş: <strong>Boşluk [Space]</strong>), telefonda ise ekrandaki <strong>yön tuşlarıyla</strong> 10 araziyi gez!
        </p>
        <button id="v23StartDriveModalBtn" class="primary-btn" style="background:linear-gradient(180deg,#ef4444,#991b1b); margin-bottom:10px;">
          🏎️ ŞİMDİ DİREKSİYONA GEÇ (${curCar.name})
        </button>
        ${carSelectHtml}
      </div>

      <div class="rep-section" style="border-color:#38bdf8;">
        <h4>🚑 ARAZİLER ARASI 3D ACİL MÜDAHALE AĞI</h4>
        <p style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">
          ${hospLid ? `🏥 Özel Hastanen (${LAND_META[hospLid].name}) aktif: Sağlık müdahaleleri <strong>+%50 ekstra ödül</strong> verir!` : "💡 İpucu: 4.–10. arazilerden birine 🏥 Özel Hastane kurarsan ambulanslar doğrudan hastanenden çıkar ve +%50 ödül verir!"}
        </p>
        ${emHtml}
      </div>
    `;

    body.querySelectorAll(".v23-pickcar-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        v23.selectedCarKey = btn.dataset.ckey;
        helpers.sfx.tap();
        helpers.saveGame();
        renderCommandModal(data, helpers);
      });
    });

    const startDrv = document.getElementById("v23StartDriveModalBtn");
    if (startDrv) {
      startDrv.addEventListener("click", () => {
        const modal = document.getElementById("commandV23Modal");
        if (modal) modal.classList.add("hidden");
        if (!bossDrive.active) toggleDriving(data, helpers.getActiveLand ? helpers.getActiveLand() : "station", helpers);
      });
    }

    const dispBtn = document.getElementById("v23ModalDispatchBtn");
    if (dispBtn) {
      dispBtn.addEventListener("click", () => {
        dispatchEmergency(data, helpers, false);
        renderCommandModal(data, helpers);
      });
    }
  }

  return {
    FUEL_POLICIES,
    NEON_THEMES,
    createDefaultV23,
    mergeV23,
    ensureV23,
    applyBrandThemeToDOM,
    getBrandShort,
    getNeonTheme,
    getFuelPolicy,
    getMoraleMult,
    getMoraleStatus,
    getLandSpeedMult,
    isLandInspected,
    toggleDriving,
    stopDriving,
    honkAndInspect,
    setTouchDir,
    isDriving: () => bossDrive.active,
    dispatchEmergency,
    startNewAuction,
    updateV23,
    onDayRollover,
    get3DRenderState,
    setCommandTab,
    renderCommandModal
  };
})();

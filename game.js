// Son İstasyon v12.0 — 2. Arazi (Outlet & Plaza), İstasyon Müdürü, Şahsi Maaş, Şehir Yaşamı & Akıllı Telefon OS

(function () {
  const sfx = window.sfx;
  const MR = window.MapRenderer;
  const SE = window.ScenarioEngine;
  const EMP = window.EmpireSystem;

  const SAVE_KEY = "son_istasyon_v12_pro";
  const LEGACY_KEYS = ["son_istasyon_v11_pro", "son_istasyon_v9_pro", "son_istasyon_v8_pro", "son_istasyon_v7_pro"];

  const RESTAURANT_MENU = [
    { name: "Mercimek Çorbası", short: "Çorba", emoji: "🥣", basePrice: 34 },
    { name: "Kaşarlı Tost", short: "Tost", emoji: "🥪", basePrice: 30 },
    { name: "Tavuk Döner Dürüm", short: "Döner", emoji: "🌯", basePrice: 48 },
    { name: "Izgara Köfte", short: "Köfte", emoji: "🍖", basePrice: 74 },
    { name: "Kuru Fasulye & Pilav", short: "Kuru Pilav", emoji: "🥘", basePrice: 58 },
    { name: "Karışık Pide", short: "Pide", emoji: "🍕", basePrice: 66 },
    { name: "Adana Kebap", short: "Adana", emoji: "🥩", basePrice: 94 },
    { name: "Kayseri Mantısı", short: "Mantı", emoji: "🥟", basePrice: 70 },
    { name: "Tavuk Şiş Tabak", short: "Tavuk Şiş", emoji: "🍗", basePrice: 80 },
    { name: "Fırın Sütlaç & Çay", short: "Sütlaç", emoji: "🍮", basePrice: 40 }
  ];

  function createEmptyDailyStats() {
    return {
      fuelIncome: 0,
      evIncome: 0,
      marketIncome: 0,
      restaurantIncome: 0,
      motelIncome: 0,
      scaleIncome: 0,
      serviceIncome: 0,
      parkingIncome: 0,
      mallIncome: 0,
      land2Income: 0,
      eventIncome: 0,
      tankerCost: 0,
      eventLoss: 0,
      carsServed: 0,
      evServed: 0,
      dishesServed: 0,
      marketServed: 0,
      motelGuests: 0,
      trucksWeighed: 0
    };
  }

  let data = {
    cash: 120,
    fuelStock: 1200,
    tankLevel: 1,
    autoTanker: false,
    pumpsUnlocked: 1, // 1..9
    pumpSpeedLvl: 1, // 1..10
    marketLvl: 1, // 1..8
    restaurantUnlocked: false,
    restaurantLvl: 1, // 1..6
    evUnlocked: false,
    evLvl: 1, // 1..6
    motelUnlocked: false,
    motelLvl: 1, // 1..6
    scaleUnlocked: false,
    scaleLvl: 1, // 1..6
    carWashUnlocked: false,
    carWashLvl: 1, // 1..6
    garageUnlocked: false,
    garageLvl: 1, // 1..6
    solarInstalled: false,
    camerasInstalled: false,
    billboardInstalled: false,
    dumanHired: false,
    staff: {
      ali: 0, // Pompacı 1
      murat: 0, // Pompacı 2
      hasan: 0, // Pompacı 3
      zeynep: 0, // Market Kasiyeri
      mehmet: 0, // Restoran Aşçısı
      kerem: 0, // ⚡ EV Şarj Teknisyeni
      selin: 0, // 🏨 Motel Resepsiyonisti
      osman: 0, // ⚖️ Kantar Görevlisi
      kadir: 0, // Oto Yıkamacı
      cemil: 0 // Tamir Ustası
    },
    reputation: 50,
    security: 65,
    dayNumber: 1,
    totalServed: 0,
    eventsResolved: 0,
    tankerDiscount: false,
    daily: createEmptyDailyStats(),
    empire: EMP.createDefaultEmpire()
  };

  try {
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      for (const lk of LEGACY_KEYS) {
        raw = localStorage.getItem(lk);
        if (raw) break;
      }
    }
    if (raw) {
      const p = JSON.parse(raw);
      Object.assign(data, p);
      data.staff = Object.assign(
        { ali: 0, murat: 0, hasan: 0, zeynep: 0, mehmet: 0, kerem: 0, selin: 0, osman: 0, kadir: 0, cemil: 0 },
        p.staff || {}
      );
      data.daily = Object.assign(createEmptyDailyStats(), p.daily || {});
      data.empire = EMP.mergeEmpire(p.empire);
      data.reputation = Math.max(0, Math.min(100, Number.isFinite(data.reputation) ? data.reputation : 50));
      data.security = Math.max(0, Math.min(100, Number.isFinite(data.security) ? data.security : 65));
      data.dayNumber = Math.max(1, Number.isFinite(data.dayNumber) ? data.dayNumber : 1);
    }
  } catch (_) {}

  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function maxFuelCapacity() {
    return 1200 + (data.tankLevel - 1) * 900;
  }

  function maxMotelRooms() {
    return Math.min(4, 2 + Math.floor((data.motelLvl - 1) / 2));
  }

  function stationLevel() {
    return (
      data.pumpsUnlocked +
      (data.evUnlocked ? 2 : 0) +
      (data.restaurantUnlocked ? 2 : 0) +
      (data.motelUnlocked ? 2 : 0) +
      (data.scaleUnlocked ? 2 : 0) +
      (data.carWashUnlocked ? 1 : 0) +
      (data.garageUnlocked ? 1 : 0) +
      (data.solarInstalled ? 1 : 0) +
      (data.camerasInstalled ? 1 : 0) +
      (data.billboardInstalled ? 1 : 0) +
      Math.floor((data.pumpSpeedLvl + data.marketLvl + data.tankLevel) / 3)
    );
  }

  function calcDailyStaffWages() {
    let total = 0;
    const breakdown = [];
    const wageMap = [
      { key: "ali", label: "Pompacı Ali", base: 24, perLvl: 10 },
      { key: "murat", label: "Pompacı Murat", base: 28, perLvl: 11 },
      { key: "hasan", label: "Pompacı Hasan", base: 34, perLvl: 12 },
      { key: "zeynep", label: "Kasiyer Zeynep", base: 26, perLvl: 10 },
      { key: "kerem", label: "EV Teknisyeni Kerem", base: 30, perLvl: 11 },
      { key: "mehmet", label: "Aşçı Mehmet", base: 35, perLvl: 13 },
      { key: "selin", label: "Resepsiyonist Selin", base: 36, perLvl: 13 },
      { key: "osman", label: "Kantar Görevlisi Osman", base: 36, perLvl: 13 },
      { key: "kadir", label: "Yıkamacı Kadir", base: 28, perLvl: 11 },
      { key: "cemil", label: "Tamir Ustası Cemil", base: 38, perLvl: 14 }
    ];
    wageMap.forEach((w) => {
      const lvl = data.staff[w.key] || 0;
      if (lvl > 0) {
        const amt = w.base + (lvl - 1) * w.perLvl;
        total += amt;
        breakdown.push({ label: `${w.label} (Sv.${lvl})`, amount: amt });
      }
    });
    if (data.dumanHired) {
      total += 15;
      breakdown.push({ label: "Bekçi Duman (Mama)", amount: 15 });
    }
    if (data.empire && data.empire.managerHired) {
      total += 55;
      breakdown.push({ label: "👔 İstasyon Müdürü Kemal", amount: 55 });
    }
    return { total, breakdown };
  }

  function calcDailyUtilityCost() {
    let base = 20 + data.pumpsUnlocked * 8;
    if (data.evUnlocked) base += 20;
    if (data.restaurantUnlocked) base += 26;
    if (data.motelUnlocked) base += 28;
    if (data.scaleUnlocked) base += 18;
    if (data.carWashUnlocked) base += 18;
    if (data.garageUnlocked) base += 22;
    if (data.billboardInstalled) base += 10;
    if (data.solarInstalled) base = Math.round(base * 0.55);
    return base;
  }

  const el = {
    startScreen: document.getElementById("startScreen"),
    startGameBtn: document.getElementById("startGameBtn"),
    toastBanner: document.getElementById("toastBanner"),
    cashText: document.getElementById("cashText"),
    fuelStockText: document.getElementById("fuelStockText"),
    repText: document.getElementById("repText"),
    secText: document.getElementById("secText"),
    stationLvlSub: document.getElementById("stationLvlSub"),
    reportBtn: document.getElementById("reportBtn"),
    musicBtn: document.getElementById("musicBtn"),
    muteBtn: document.getElementById("muteBtn"),
    liveHintText: document.getElementById("liveHintText"),
    shiftBadgeText: document.getElementById("shiftBadgeText"),
    activeEffectBar: document.getElementById("activeEffectBar"),
    canvas: document.getElementById("stationCanvas"),

    btnCallTanker: document.getElementById("btnCallTanker"),
    tankerCostSub: document.getElementById("tankerCostSub"),
    btnOpenUpgrades: document.getElementById("btnOpenUpgrades"),
    btnOpenStaff: document.getElementById("btnOpenStaff"),
    staffCountSub: document.getElementById("staffCountSub"),

    upgradesModal: document.getElementById("upgradesModal"),
    upCashText: document.getElementById("upCashText"),
    upgradesList: document.getElementById("upgradesList"),
    closeUpgradesBtn: document.getElementById("closeUpgradesBtn"),

    staffModal: document.getElementById("staffModal"),
    staffCashText: document.getElementById("staffCashText"),
    staffList: document.getElementById("staffList"),
    closeStaffBtn: document.getElementById("closeStaffBtn"),

    storyModal: document.getElementById("storyModal"),
    storyCategoryTag: document.getElementById("storyCategoryTag"),
    storyAvatarBox: document.getElementById("storyAvatarBox"),
    storyName: document.getElementById("storyName"),
    storyRole: document.getElementById("storyRole"),
    storyPlate: document.getElementById("storyPlate"),
    storySpeech: document.getElementById("storySpeech"),
    dumanStoryAlert: document.getElementById("dumanStoryAlert"),
    inspectGrid: document.getElementById("inspectGrid"),
    inspectResultBox: document.getElementById("inspectResultBox"),
    storyQuestionsBox: document.getElementById("storyQuestionsBox"),
    storyActionsGrid: document.getElementById("storyActionsGrid"),

    storyResultModal: document.getElementById("storyResultModal"),
    resTitle: document.getElementById("resTitle"),
    resImpactRow: document.getElementById("resImpactRow"),
    resBody: document.getElementById("resBody"),
    closeResBtn: document.getElementById("closeResBtn"),

    dayReportModal: document.getElementById("dayReportModal"),
    repModalTitle: document.getElementById("repModalTitle"),
    repModalBadge: document.getElementById("repModalBadge"),
    dayReportContent: document.getElementById("dayReportContent"),
    closeDayReportBtn: document.getElementById("closeDayReportBtn"),

    tabStationBtn: document.getElementById("tabStationBtn"),
    tabLand2Btn: document.getElementById("tabLand2Btn"),
    openCityBtn: document.getElementById("openCityBtn"),
    personalCashTop: document.getElementById("personalCashTop"),
    openPhoneBtn: document.getElementById("openPhoneBtn"),
    managerAlertBar: document.getElementById("managerAlertBar"),

    cityModal: document.getElementById("cityModal"),
    closeCityBtn: document.getElementById("closeCityBtn"),
    phoneModal: document.getElementById("phoneModal"),
    closePhoneBtn: document.getElementById("closePhoneBtn")
  };

  let activeLand = "station"; // "station" | "land2"
  let managerAlertTargetCar = null;
  let kemalEmergencyCooldown = 210; // Müdür Kemal çok acil bir kriz olmadıkça en az ~4 dk boyunca patronu aramaz!
  let kemalOutageFixTimer = 0;

  let toastTimer = null;
  function showToast(msg) {
    el.toastBanner.textContent = msg;
    el.toastBanner.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toastBanner.classList.add("hidden"), 2800);
  }

  // =========================================================================
  // 3D HARİTA YERLEŞİM PLANI (9 POMPA + 4 ARAÇ GİRİŞLİ TESİS + 3 YAYA MEYDANI)
  // =========================================================================
  const WORLD_W = 480;
  const WORLD_H = 620;
  const HIGHWAY_UP_Y = 23;
  const HIGHWAY_IN_Y = 58;
  const ENTRY_X = 98;
  const EXIT_X = 412;
  const APRON_MID_Y = 212;
  const APRON_LOW_Y = 338;

  // 9 Pompa Adası: Üst Sıra (P1..P5 VIP) + Orta Sıra (P6..P9 VIP)
  const PUMPS = [
    { idx: 0, x: 144, y: 136, carX: 144, carY: 170, laneY: APRON_MID_Y, unlockCost: 0, label: "POMPA 1", short: "P-1", shortLabel: "P-1", isVip: false },
    { idx: 1, x: 200, y: 136, carX: 200, carY: 170, laneY: APRON_MID_Y, unlockCost: 420, label: "POMPA 2", short: "P-2", shortLabel: "P-2", isVip: false },
    { idx: 2, x: 256, y: 136, carX: 256, carY: 170, laneY: APRON_MID_Y, unlockCost: 1150, label: "POMPA 3", short: "P-3", shortLabel: "P-3", isVip: false },
    { idx: 3, x: 312, y: 136, carX: 312, carY: 170, laneY: APRON_MID_Y, unlockCost: 2200, label: "POMPA 4", short: "P-4", shortLabel: "P-4", isVip: false },
    { idx: 4, x: 368, y: 136, carX: 368, carY: 170, laneY: APRON_MID_Y, unlockCost: 3600, label: "POMPA 5 VIP", short: "VIP-1", shortLabel: "P-5 VIP", isVip: true },
    { idx: 5, x: 158, y: 262, carX: 158, carY: 296, laneY: APRON_LOW_Y, unlockCost: 5200, label: "POMPA 6", short: "P-6", shortLabel: "P-6", isVip: false },
    { idx: 6, x: 224, y: 262, carX: 224, carY: 296, laneY: APRON_LOW_Y, unlockCost: 7200, label: "POMPA 7", short: "P-7", shortLabel: "P-7", isVip: false },
    { idx: 7, x: 290, y: 262, carX: 290, carY: 296, laneY: APRON_LOW_Y, unlockCost: 9800, label: "POMPA 8", short: "P-8", shortLabel: "P-8", isVip: false },
    { idx: 8, x: 356, y: 262, carX: 356, carY: 296, laneY: APRON_LOW_Y, unlockCost: 13500, label: "POMPA 9 VIP", short: "VIP-2", shortLabel: "P-9 VIP", isVip: true }
  ];

  const TANK_POS = { x: 64, y: 196, w: 36, h: 86 };

  // Band 3 — 4 Araç Girişli Tesis (APRON_LOW_Y üzerinden engelsiz giriş!)
  const EV_POS = { x: 48, y: 362, w: 92, h: 98, carX: 100, carY: 420, unlockCost: 1100 };
  const WASH_POS = { x: 144, y: 362, w: 92, h: 98, carX: 190, carY: 420, unlockCost: 850 };
  const GARAGE_POS = { x: 240, y: 362, w: 92, h: 98, carX: 286, carY: 420, unlockCost: 1950 };
  const SCALE_POS = { x: 336, y: 362, w: 96, h: 98, carX: 384, carY: 420, unlockCost: 2900 };

  // Band 4 — 3 Yaya Tesis Meydanı (Market + Restoran + Mini Motel)
  const MARKET_POS = { x: 48, y: 474, w: 122, h: 110, doorX: 109, doorY: 474 };
  const RESTAURANT_POS = { x: 176, y: 474, w: 126, h: 110, doorX: 239, doorY: 474, unlockCost: 1450 };
  const MOTEL_POS = { x: 308, y: 474, w: 124, h: 110, doorX: 370, doorY: 474, unlockCost: 2400 };

  const CUSTOMER_SHIRTS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316", "#e2e8f0"];
  const CUSTOMER_HAIRS = ["#18181b", "#451a03", "#78350f", "#27272a", "#92400e"];

  // Canlı Değişkenler
  let running = false;
  let reportPaused = false;
  let pointerHeldPump = -1;
  let highwayBgCars = [];
  let cars = [];
  let shoppers = [];
  let marketQueue = 0;
  let marketProgress = 0;
  let restaurantQueue = [];
  let restaurantProgress = 0;
  let motelQueue = []; // { shopperRef }
  let motelOccupants = []; // { timer, shopperRef }
  let motelProgress = 0;

  let evCar = null;
  let washCar = null;
  let garageCar = null;
  let scaleCar = null;
  let tanker = null;
  let policeCruiser = null;
  let floatingTexts = [];
  let exhaustPuffs = [];
  let activeStoryCar = null;

  let servedSinceSpecial = 0;
  let nextSpecialTarget = SE.nextSpecialInterval(data);
  let pendingSpecialReady = false;
  let spawnCooldown = 0.85;
  let evSpawnCooldown = 3.0;
  let scaleSpawnCooldown = 4.0;

  let shiftClock = Math.random() * 0.2;
  let vipRushTimer = 0;
  let policePatrolTimer = 0;
  let slowTrafficTimer = 0;
  let powerOutage = false;
  let crisisCheckTimer = 38;

  const workers = {
    ali: { x: 126, y: 342, color: "#f97316", hat: "#dc2626", name: "Ali", targetPump: -1, moving: false },
    murat: { x: 170, y: 342, color: "#38bdf8", hat: "#0284c7", name: "Murat", targetPump: -1, moving: false },
    hasan: { x: 214, y: 342, color: "#14b8a6", hat: "#0f766e", name: "Hasan", targetPump: -1, moving: false },
    zeynep: { x: 105, y: 520, color: "#ec4899", hat: "#be185d", name: "Zeynep", moving: false },
    mehmet: { x: 235, y: 520, color: "#f97316", hat: "#ffffff", name: "Mehmet", moving: false },
    selin: { x: 365, y: 520, color: "#f472b6", hat: "#831843", name: "Selin", moving: false },
    kerem: { x: 64, y: 418, color: "#06b6d4", hat: "#0e7490", name: "Kerem", moving: false },
    kadir: { x: 158, y: 418, color: "#22c55e", hat: "#15803d", name: "Kadir", moving: false },
    cemil: { x: 254, y: 418, color: "#a855f7", hat: "#6b21a8", name: "Cemil", moving: false },
    osman: { x: 350, y: 418, color: "#eab308", hat: "#854d0e", name: "Osman", moving: false },
    duman: { x: 130, y: 102, dir: 1 }
  };

  function addFloatingText(x, y, text, color = "#4ade80") {
    floatingTexts.push({ x, y, text, color, life: 1.55 });
  }

  function getShiftPhase() {
    if (shiftClock < 0.4) return { name: "Gece", icon: "🌙", night: 1.0, tint: "rgba(4, 10, 26, 0.12)", speedMult: 1.0 };
    if (shiftClock < 0.56) return { name: "Şafak", icon: "🌅", night: 0.42, tint: "rgba(251, 146, 60, 0.09)", speedMult: 1.1 };
    if (shiftClock < 0.84) return { name: "Gündüz", icon: "☀️", night: 0.0, tint: "rgba(186, 230, 253, 0.08)", speedMult: 1.24 };
    return { name: "Akşam", icon: "🌆", night: 0.65, tint: "rgba(139, 92, 246, 0.1)", speedMult: 1.1 };
  }

  function pickRestaurantDish() {
    const base = RESTAURANT_MENU[Math.floor(Math.random() * RESTAURANT_MENU.length)];
    const mult = 1 + (data.restaurantLvl - 1) * 0.2;
    const vipMult = vipRushTimer > 0 ? 1.25 : 1;
    return { name: base.name, short: base.short, emoji: base.emoji, price: Math.round(base.basePrice * mult * vipMult) };
  }

  function tankerRefillCost() {
    const missing = maxFuelCapacity() - data.fuelStock;
    if (missing < 80) return 0;
    let cost = Math.max(45, Math.round(missing * 0.065));
    if (data.tankerDiscount) cost = Math.max(25, Math.round(cost * 0.6));
    return cost;
  }

  function updateHUD() {
    el.cashText.textContent = Math.round(data.cash);
    el.fuelStockText.textContent = `${Math.round(data.fuelStock)}`;
    el.repText.textContent = `${Math.round(data.reputation)}`;
    el.secText.textContent = `${Math.round(data.security)}`;
    el.stationLvlSub.textContent = `İstasyon Sv.${stationLevel()}`;

    el.repText.parentElement.classList.toggle("low", data.reputation < 30);
    el.secText.parentElement.classList.toggle("low", data.security < 35);

    const ph = getShiftPhase();
    el.shiftBadgeText.textContent = `${ph.icon} G${data.dayNumber} ${ph.name}`;

    const activeMsgs = [];
    let isDanger = false;
    if (powerOutage) {
      activeMsgs.push("⚡ ELEKTRİK KESİK! Marketten Sigortayı Aç!");
      isDanger = true;
    }
    if (vipRushTimer > 0) activeMsgs.push(`🌟 VIP Akını (+%40 Bahşiş • ${Math.ceil(vipRushTimer)}sn)`);
    if (policePatrolTimer > 0) activeMsgs.push(`🚔 Polis Devriyesi (${Math.ceil(policePatrolTimer)}sn)`);
    if (data.tankerDiscount) activeMsgs.push("⛽ Tanker %40 İndirimli");
    if (slowTrafficTimer > 0) {
      activeMsgs.push(`📉 Trafik Yavaş (${Math.ceil(slowTrafficTimer)}sn)`);
      isDanger = true;
    }

    if (activeMsgs.length > 0) {
      el.activeEffectBar.textContent = activeMsgs.join("  •  ");
      el.activeEffectBar.classList.remove("hidden");
      el.activeEffectBar.classList.toggle("danger", isDanger);
    } else {
      el.activeEffectBar.classList.add("hidden");
    }

    const tCost = tankerRefillCost();
    el.tankerCostSub.textContent = tCost === 0 ? "Depo Dolu ✓" : `Doldur (${tCost}₺)`;
    el.btnCallTanker.classList.toggle("fuel-low", data.fuelStock < maxFuelCapacity() * 0.18);

    const staffKeys = ["ali", "murat", "hasan", "zeynep", "mehmet", "kerem", "selin", "osman", "kadir", "cemil"];
    const hiredCount =
      staffKeys.reduce((acc, k) => acc + (data.staff[k] > 0 ? 1 : 0), 0) +
      (data.dumanHired ? 1 : 0) +
      (data.empire.managerHired ? 1 : 0);
    el.staffCountSub.textContent = `${hiredCount}/12 Ekip`;

    el.personalCashTop.textContent = Math.round(data.empire.personalCash || 0);
    el.tabStationBtn.classList.toggle("active", activeLand === "station");
    el.tabLand2Btn.classList.toggle("active", activeLand === "land2");
    el.tabLand2Btn.textContent = data.empire.land2Owned ? "🛍️ Yan Arazi" : "🏗️ Yan Arazi";
    el.openPhoneBtn.classList.toggle("locked", !data.empire.electronics.phone);
    el.openPhoneBtn.textContent = data.empire.electronics.phone ? "📱 Telefon" : "🔒 Telefon";
  }

  // =========================================================================
  // AKICI YÖNLÜ HAREKET VE DÖNÜŞ MOTORU
  // =========================================================================
  function rotateTowards(current, target, turnRate, dt) {
    let diff = target - current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const step = turnRate * dt;
    if (Math.abs(diff) <= step) return target;
    return current + Math.sign(diff) * step;
  }

  function moveTowards(obj, tx, ty, speed, dt) {
    const dx = tx - obj.x;
    const dy = ty - obj.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= speed * dt) {
      obj.x = tx;
      obj.y = ty;
      return true;
    }
    obj.x += (dx / dist) * speed * dt;
    obj.y += (dy / dist) * speed * dt;
    return false;
  }

  function followWaypoints(vehicle, dt, turnRate = 10) {
    if (!vehicle.waypoints || vehicle.waypoints.length === 0) return true;
    const wp = vehicle.waypoints[0];
    const dx = wp.x - vehicle.x;
    const dy = wp.y - vehicle.y;
    const dist = Math.hypot(dx, dy);
    const spd = wp.speed || 120;

    if (dist > 1) {
      const moveAngle = Math.atan2(dy, dx) + Math.PI / 2;
      const desiredAngle = wp.reverse ? moveAngle + Math.PI : moveAngle;
      vehicle.angle = rotateTowards(vehicle.angle, desiredAngle, turnRate, dt);
    }

    if (dist <= spd * dt) {
      vehicle.x = wp.x;
      vehicle.y = wp.y;
      if (wp.finalAngle !== undefined) vehicle.angle = wp.finalAngle;
      vehicle.waypoints.shift();
      return vehicle.waypoints.length === 0;
    }

    vehicle.x += (dx / dist) * spd * dt;
    vehicle.y += (dy / dist) * spd * dt;
    return false;
  }

  function setCarExitPath(car, fromBay = false) {
    car.state = "leaving";
    const p = car.pumpIdx >= 0 ? PUMPS[car.pumpIdx] : null;
    const laneY = fromBay ? APRON_LOW_Y : p ? p.laneY : APRON_LOW_Y;
    car.waypoints = [
      { x: car.x, y: laneY, speed: 70, reverse: true },
      { x: EXIT_X, y: laneY, speed: 125 },
      { x: EXIT_X, y: HIGHWAY_IN_Y, speed: 132 },
      { x: WORLD_W + 75, y: HIGHWAY_IN_Y, speed: 155 }
    ];
  }

  // =========================================================================
  // ARAÇ, EV ARACI, KANTAR TIRI VE RASTGELE ÖZEL OLAY ÜRETİMİ
  // =========================================================================
  const CAR_COLORS = ["#ef4444", "#2563eb", "#f59e0b", "#10b981", "#e2e8f0", "#8b5cf6", "#ec4899", "#0ea5e9"];
  const EV_COLORS = ["#38bdf8", "#e2e8f0", "#06b6d4", "#818cf8", "#34d399"];

  function trySpawnEvCar() {
    if (!data.evUnlocked || evCar) return;
    const car = {
      x: -45,
      y: HIGHWAY_IN_Y,
      angle: Math.PI / 2,
      pumpIdx: -1,
      color: EV_COLORS[Math.floor(Math.random() * EV_COLORS.length)],
      shape: "ev",
      state: "going_ev",
      waypoints: [
        { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 140 },
        { x: ENTRY_X, y: APRON_LOW_Y, speed: 122 },
        { x: EV_POS.carX, y: APRON_LOW_Y, speed: 110 },
        { x: EV_POS.carX, y: EV_POS.carY, speed: 92, finalAngle: Math.PI }
      ],
      serviceProg: 0,
      serviceManual: false,
      isEv: true,
      isStory: false
    };
    evCar = car;
    cars.push(car);
  }

  function trySpawnScaleTruck() {
    if (!data.scaleUnlocked || scaleCar) return;
    const tons = (22 + Math.random() * 20).toFixed(1);
    const truck = {
      x: -55,
      y: HIGHWAY_IN_Y,
      angle: Math.PI / 2,
      pumpIdx: -1,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      shape: "truck",
      state: "going_scale",
      waypoints: [
        { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 118 },
        { x: ENTRY_X, y: APRON_LOW_Y, speed: 105 },
        { x: SCALE_POS.carX, y: APRON_LOW_Y, speed: 105 },
        { x: SCALE_POS.carX, y: SCALE_POS.carY, speed: 85, finalAngle: Math.PI }
      ],
      serviceProg: 0,
      serviceManual: false,
      weightTons: tons,
      isScale: true,
      isStory: false
    };
    scaleCar = truck;
    cars.push(truck);
  }

  function trySpawnStationCar() {
    const openPumps = [];
    for (let i = 0; i < data.pumpsUnlocked; i++) {
      const busy = cars.some((c) => c.pumpIdx === i && c.state !== "leaving");
      if (!busy) openPumps.push(i);
    }
    if (openPumps.length === 0) return;

    const chosenPump = openPumps[Math.floor(Math.random() * openPumps.length)];
    const p = PUMPS[chosenPump];

    const anyStoryOnMap = cars.some((c) => c.isStory && c.state !== "leaving");
    if (pendingSpecialReady && !anyStoryOnMap) {
      const ev = SE.generateEvent(data);
      pendingSpecialReady = false;
      servedSinceSpecial = 0;
      nextSpecialTarget = SE.nextSpecialInterval(data);

      cars.push({
        x: -45,
        y: HIGHWAY_IN_Y,
        angle: Math.PI / 2,
        pumpIdx: chosenPump,
        color: ev.carColor,
        shape: ev.carShape || "sedan",
        state: "entering",
        waypoints: [
          { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 140 },
          { x: ENTRY_X, y: p.laneY, speed: 122 },
          { x: p.carX, y: p.laneY, speed: 118 },
          { x: p.carX, y: p.carY, speed: 95, finalAngle: 0 }
        ],
        fuelNeeded: 22,
        fuelFilled: 0,
        manualLatched: false,
        payAmount: 100,
        isStory: true,
        storyEvent: ev
      });
      return;
    }

    const isBig = chosenPump >= 2 ? Math.random() < 0.34 : Math.random() < 0.16;
    const isVip = p.isVip || (data.reputation >= 72 && Math.random() < 0.3) || (data.billboardInstalled && Math.random() < 0.25) || vipRushTimer > 0;
    const fuelReq = isBig ? 30 : 18;
    let basePay = Math.round((p.isVip ? 56 : isVip ? 42 : isBig ? 34 : 22) + (data.pumpSpeedLvl - 1) * 7);
    if (vipRushTimer > 0) basePay = Math.round(basePay * 1.4);

    const shapes = isBig ? ["truck"] : isVip ? ["sport", "suv"] : ["sedan", "suv", "taxi"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    cars.push({
      x: -45,
      y: HIGHWAY_IN_Y,
      angle: Math.PI / 2,
      pumpIdx: chosenPump,
      color: shape === "taxi" ? "#facc15" : CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      shape,
      state: "entering",
      waypoints: [
        { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 145 },
        { x: ENTRY_X, y: p.laneY, speed: 126 },
        { x: p.carX, y: p.laneY, speed: 120 },
        { x: p.carX, y: p.carY, speed: 96, finalAngle: 0 }
      ],
      fuelNeeded: fuelReq,
      fuelFilled: 0,
      manualLatched: false,
      payAmount: basePay,
      wantsMotel: data.motelUnlocked && Math.random() < 0.32,
      wantsRestaurant: data.restaurantUnlocked && Math.random() < 0.44,
      wantsMarket: Math.random() < 0.45,
      wantsWash: data.carWashUnlocked && !washCar && Math.random() < 0.42,
      wantsGarage: data.garageUnlocked && !garageCar && Math.random() < 0.38,
      isStory: false,
      storyEvent: null
    });
  }

  function sendDriverToPedestrianPlaza(car, forced = false) {
    const shirt = CUSTOMER_SHIRTS[Math.floor(Math.random() * CUSTOMER_SHIRTS.length)];
    const hair = CUSTOMER_HAIRS[Math.floor(Math.random() * CUSTOMER_HAIRS.length)];

    if ((car.wantsMotel || (forced && data.motelUnlocked && Math.random() < 0.35)) && motelQueue.length + motelOccupants.length < maxMotelRooms() + 2) {
      car.state = "shopping_wait";
      shoppers.push({ x: car.x - 8, y: car.y + 8, carRef: car, dest: "motel", phase: "to_dest", shirt, hair, animPhase: Math.random() * 6 });
      return true;
    }
    if ((car.wantsRestaurant || (forced && data.restaurantUnlocked && Math.random() < 0.5)) && restaurantQueue.length < 4) {
      car.state = "shopping_wait";
      shoppers.push({ x: car.x - 8, y: car.y + 8, carRef: car, dest: "restaurant", phase: "to_dest", shirt, hair, animPhase: Math.random() * 6 });
      return true;
    }
    if ((car.wantsMarket || (forced && Math.random() < 0.6)) && marketQueue < 3) {
      car.state = "shopping_wait";
      shoppers.push({ x: car.x - 8, y: car.y + 8, carRef: car, dest: "market", phase: "to_dest", shirt, hair, animPhase: Math.random() * 6 });
      return true;
    }
    return false;
  }

  // =========================================================================
  // TANKER İKMAL SİSTEMİ
  // =========================================================================
  function callFuelTanker(isAuto = false) {
    if (tanker) {
      if (!isAuto) showToast("🚛 Yakıt tankeri zaten istasyonda!");
      return;
    }
    const cost = tankerRefillCost();
    if (cost === 0) {
      if (!isAuto) showToast("🛢️ Ana yakıt depon zaten dolu!");
      return;
    }

    if (data.cash < cost) {
      if (data.fuelStock < 35 && data.cash < 45) {
        showToast("🚛 Acil veresiye yakıt ikmali gönderildi!");
      } else {
        if (!isAuto) {
          sfx.burnFail();
          showToast(`Tanker için ${cost} ₺ gerekli!`);
        }
        return;
      }
    } else {
      data.cash -= cost;
      data.daily.tankerCost += cost;
      data.tankerDiscount = false;
    }

    sfx.doorBell();
    tanker = {
      x: -75,
      y: HIGHWAY_IN_Y,
      angle: Math.PI / 2,
      state: "entering",
      progress: 0,
      waypoints: [
        { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 120 },
        { x: ENTRY_X, y: TANK_POS.y, speed: 98, finalAngle: Math.PI }
      ]
    };
    if (!isAuto) showToast("🚛 Yakıt Tankeri yola çıktı!");
    updateHUD();
  }

  el.btnCallTanker.addEventListener("click", () => callFuelTanker(false));

  // =========================================================================
  // GÜN SONU & CANLI KÂR / ZARAR RAPORU
  // =========================================================================
  function openDayReport(isDayEnd = false) {
    reportPaused = true;
    const d = data.daily;
    const wages = calcDailyStaffWages();
    const utility = calcDailyUtilityCost();

    const parkingRev = d.parkingIncome || 0;
    const mallRev = d.mallIncome || 0;
    const towersRev = Math.max(0, (d.land2Income || 0) - mallRev);

    const totalRev =
      d.fuelIncome +
      d.evIncome +
      d.marketIncome +
      d.restaurantIncome +
      d.motelIncome +
      d.scaleIncome +
      d.serviceIncome +
      parkingRev +
      (d.land2Income || 0) +
      d.eventIncome;
    const totalCost = d.tankerCost + wages.total + utility + d.eventLoss;
    const net = totalRev - totalCost;
    const dailyRent = EMP.calcDailyRent(data.empire);
    const sal = EMP.calcSalaryBreakdown(data.empire);
    let paidSalary = 0;

    if (isDayEnd) {
      const endDeduction = wages.total + utility;
      data.cash = Math.max(0, data.cash - endDeduction);

      // İstasyon + Otopark + Yan Arazi/AVM Maaşlarının Tamamı Şirket Kasasından Şahsi Cüzdanına Yatar!
      paidSalary = Math.min(Math.floor(data.cash), sal.total);
      data.cash -= paidSalary;
      data.empire.personalCash += paidSalary + dailyRent;

      el.repModalTitle.textContent = `📊 Gün ${data.dayNumber} Sonu Raporu`;
      el.repModalBadge.textContent = "Vardiya Kapandı";
      el.closeDayReportBtn.textContent = `GÜN ${data.dayNumber + 1}'E BAŞLA ➔`;
    } else {
      paidSalary = sal.total;
      el.repModalTitle.textContent = `📊 Gün ${data.dayNumber} Canlı Bilanço`;
      el.repModalBadge.textContent = "Anlık Özet";
      el.closeDayReportBtn.textContent = "HARİTAYA DÖN ➔";
    }

    const wageLines =
      wages.breakdown.length > 0
        ? wages.breakdown
            .map((b) => `<div class="rep-row"><span>• ${b.label}</span><span class="val-neg">-${b.amount} ₺</span></div>`)
            .join("")
        : `<div class="rep-row"><span>• Çalışan maaşı yok (Tek çalışıyorsun)</span><span>0 ₺</span></div>`;

    el.dayReportContent.innerHTML = `
      <div class="rep-section">
        <h4>💰 ŞİRKET GELİRLERİ (Toplam: +${Math.round(totalRev)} ₺)</h4>
        <div class="rep-row"><span>⛽ Yakıt Satışları (${d.carsServed} araç)</span><span class="val-pos">+${Math.round(d.fuelIncome)} ₺</span></div>
        <div class="rep-row"><span>⚡ EV Hızlı Şarj (${d.evServed} araç)</span><span class="val-pos">+${Math.round(d.evIncome)} ₺</span></div>
        <div class="rep-row"><span>🏪 7/24 Market (${d.marketServed} satış)</span><span class="val-pos">+${Math.round(d.marketIncome)} ₺</span></div>
        <div class="rep-row"><span>🍽️ Yol Restoranı (${d.dishesServed} tabak)</span><span class="val-pos">+${Math.round(d.restaurantIncome)} ₺</span></div>
        <div class="rep-row"><span>🏨 Mini Motel (${d.motelGuests} oda)</span><span class="val-pos">+${Math.round(d.motelIncome)} ₺</span></div>
        <div class="rep-row"><span>🚛 Tır Kantarı (${d.trucksWeighed} tır)</span><span class="val-pos">+${Math.round(d.scaleIncome)} ₺</span></div>
        <div class="rep-row"><span>🚿 Yıkama &amp; 🔧 Tamirhane</span><span class="val-pos">+${Math.round(d.serviceIncome)} ₺</span></div>
        <div class="rep-row"><span>🅿️ Ücretli Otopark Gişesi</span><span class="val-pos">+${Math.round(parkingRev)} ₺</span></div>
        <div class="rep-row"><span>🏬 Otoyol AVM Mağaza Kiraları</span><span class="val-pos">+${Math.round(mallRev)} ₺</span></div>
        <div class="rep-row"><span>🏢 Yan Arazi Lojistik &amp; Plaza</span><span class="val-pos">+${Math.round(towersRev)} ₺</span></div>
        <div class="rep-row"><span>🕵️ Özel Olay Ödülleri</span><span class="val-pos">+${Math.round(d.eventIncome)} ₺</span></div>
      </div>

      <div class="rep-section">
        <h4>📉 ŞİRKET GİDERLERİ (Toplam: -${Math.round(totalCost)} ₺)</h4>
        <div class="rep-row"><span>🚛 Tanker Yakıt Alımları</span><span class="val-neg">-${Math.round(d.tankerCost)} ₺</span></div>
        <div class="rep-row"><span>⚡ Elektrik &amp; Tesis Gideri${data.solarInstalled ? " (Güneş %45 İnd.)" : ""}</span><span class="val-neg">-${utility} ₺</span></div>
        <div class="rep-row"><span>❌ Olay / Ceza Kayıpları</span><span class="val-neg">-${Math.round(d.eventLoss)} ₺</span></div>
        <div class="rep-row" style="margin-top:4px; border-top:1px solid #334155; padding-top:5px;">
          <span><strong>👷 Eleman &amp; Müdür Maaşları (${isDayEnd ? "Ödendi" : "Gün Sonu"})</strong></span>
          <span class="val-neg">-${wages.total} ₺</span>
        </div>
        ${wageLines}
      </div>

      <div class="rep-section" style="border-color:#22c55e;">
        <h4>💳 PATRON ŞAHSİ CÜZDAN (${isDayEnd ? "Yatırıldı!" : "Gün Sonu Yatar"})</h4>
        <div class="rep-row"><span>⛽ İstasyon Maaşın</span><span class="val-pos">+${sal.stationSal} ₺</span></div>
        <div class="rep-row"><span>🅿️ Ücretli Otopark Maaşın</span><span class="val-pos">+${sal.parkingSal} ₺</span></div>
        <div class="rep-row"><span>🏬 Yan Arazi &amp; AVM Maaşın</span><span class="val-pos">+${sal.land2Sal} ₺</span></div>
        <div class="rep-row"><span>🏠 Emlak Kira Gelirlerin</span><span class="val-pos">+${dailyRent} ₺</span></div>
        <div class="rep-row" style="border-top:1px solid #334155; padding-top:4px; margin-top:3px;">
          <span><strong>💼 Toplam Yatırılan Maaş</strong></span>
          <span class="val-pos">+${paidSalary} ₺</span>
        </div>
        <div class="rep-row"><span><strong>💳 Güncel Şahsi Cüzdanın</strong></span><span class="val-pos">${Math.round(data.empire.personalCash)} ₺</span></div>
      </div>

      <div class="rep-net-box ${net < 0 ? "loss" : ""}">
        ${net >= 0 ? `📈 ŞİRKET NET KÂR: +${Math.round(net)} ₺` : `📉 ŞİRKET NET ZARAR: ${Math.round(net)} ₺`}
        <div style="font-size:12px; font-weight:700; color:#e2e8f0; margin-top:4px;">
          Şirket Kasası: ${Math.round(data.cash)} ₺ • ⭐ İtibar: ${Math.round(data.reputation)} • 🛡️ Güvenlik: ${Math.round(data.security)}
        </div>
      </div>
    `;

    el.dayReportModal.dataset.isDayEnd = isDayEnd ? "1" : "0";
    el.dayReportModal.classList.remove("hidden");
    updateHUD();
  }

  el.reportBtn.addEventListener("click", () => {
    sfx.tap();
    openDayReport(false);
  });

  el.closeDayReportBtn.addEventListener("click", () => {
    sfx.tap();
    const wasDayEnd = el.dayReportModal.dataset.isDayEnd === "1";
    el.dayReportModal.classList.add("hidden");
    if (wasDayEnd) {
      data.dayNumber += 1;
      data.daily = createEmptyDailyStats();
      saveGame();
      showToast(`🌅 Gün ${data.dayNumber} başladı! Bol kazançlı vardiyalar!`);
    }
    reportPaused = false;
    updateHUD();
  });

  // =========================================================================
  // DÜNYA GÜNCELLEMESİ (60 FPS)
  // =========================================================================
  function updateWorld(dt) {
    if (reportPaused) return;

    shiftClock += dt / 120;
    if (shiftClock >= 1) {
      shiftClock = 0;
      sfx.perfectHit();
      openDayReport(true);
      return;
    }

    if (vipRushTimer > 0) vipRushTimer = Math.max(0, vipRushTimer - dt);
    if (policePatrolTimer > 0) policePatrolTimer = Math.max(0, policePatrolTimer - dt);
    if (slowTrafficTimer > 0) slowTrafficTimer = Math.max(0, slowTrafficTimer - dt);

    if (!powerOutage && !data.solarInstalled && policePatrolTimer <= 0 && data.security < 35) {
      crisisCheckTimer -= dt;
      if (crisisCheckTimer <= 0) {
        crisisCheckTimer = 42 + Math.random() * 25;
        const riskChance = data.camerasInstalled ? 0.2 : 0.45;
        if (Math.random() < riskChance) {
          powerOutage = true;
          sfx.burnFail();
          showToast("⚡ Düşük güvenlik yüzünden şalter indirildi! Marketten sigortayı aç!");
        }
      }
    }

    if (data.autoTanker && !tanker && data.fuelStock < maxFuelCapacity() * 0.16 && data.cash >= tankerRefillCost()) {
      callFuelTanker(true);
    }

    // 2. Arazi & Borsa Canlı Güncellemesi
    EMP.updateEmpire(dt, data, {
      onStockTick() {
        if (!el.phoneModal.classList.contains("hidden")) {
          EMP.renderPhoneModal(data, empireHelpers);
        }
      },
      onLand2Earn() {
        saveGame();
      }
    });

    // 👔 SAKİN VE TEMKİNLİ İSTASYON MÜDÜRÜ KEMAL BEY OTOPİLOT SİSTEMİ
    // Çok acil bir kriz olmadıkça patronu ASLA rahatsız etmez, istasyonu sessizce yönetir!
    if (kemalEmergencyCooldown > 0) kemalEmergencyCooldown = Math.max(0, kemalEmergencyCooldown - dt);

    if (data.empire.managerHired) {
      // 1. Depo %22'nin altına inerse sessizce tanker çağırır!
      if (!tanker && data.fuelStock < maxFuelCapacity() * 0.22 && data.cash >= tankerRefillCost()) {
        callFuelTanker(true);
        EMP.addManagerLog(data.empire, "👔 Kemal Bey: Depo %22 altına inince yakıt tankerini sessizce çağırdım.");
      }

      // 2. Elektrik kesilirse patronu aramak yerine şalteri 2 saniyede kendi kaldırır!
      if (powerOutage) {
        kemalOutageFixTimer += dt;
        if (kemalOutageFixTimer >= 2.0) {
          powerOutage = false;
          kemalOutageFixTimer = 0;
          EMP.addManagerLog(data.empire, "👔 Kemal Bey: İstasyonda sigorta attı, sizi rahatsız etmeden hemen açtım.");
        }
      } else {
        kemalOutageFixTimer = 0;
      }

      // 3. Yan arazideyken tüm istasyon tesislerini kesintisiz çalıştırır!
      if (activeLand === "land2") {
        cars.forEach((c) => {
          if (!c.isStory && c.pumpIdx >= 0 && (c.state === "waiting_fuel" || c.state === "fueling") && data.fuelStock > 1) {
            c.manualLatched = true;
          }
          if ((c.state === "charging" || c.state === "weighing" || c.state === "washing" || c.state === "repairing") && !c.serviceManual) {
            c.serviceManual = true;
          }
        });
        if (marketQueue > 0 && data.staff.zeynep === 0 && !powerOutage) completeOneMarketSale();
        if (restaurantQueue.length > 0 && data.staff.mehmet === 0 && !powerOutage) completeOneRestaurantOrder();
        if (motelQueue.length > 0 && data.staff.selin === 0 && motelOccupants.length < maxMotelRooms() && !powerOutage) checkInOneMotelGuest();
      }

      // 4. Özel Müşteriler: %95'ini sessizce kendisi çözer; sadece ÇOK ACİL nadir krizlerde (4-5 dakikada en fazla 1 kez) arar!
      const waitingStory = cars.find((c) => c.isStory && c.state === "story_wait");
      const RARE_EMERGENCY_FAMILIES = ["followup_police", "sabotage_tech"];

      if (waitingStory) {
        waitingStory.managerWait = (waitingStory.managerWait || 0) + dt;
        if (waitingStory.isRareEmergency === undefined) {
          const isSevereType = RARE_EMERGENCY_FAMILIES.includes(waitingStory.storyEvent.family);
          waitingStory.isRareEmergency = kemalEmergencyCooldown <= 0 && isSevereType;
          if (waitingStory.isRareEmergency) {
            kemalEmergencyCooldown = 260; // Bir daha en az 4.5 dakika boyunca patronu aramaz!
          }
        }

        if (waitingStory.isRareEmergency && waitingStory.managerWait < 45) {
          managerAlertTargetCar = waitingStory;
          el.managerAlertBar.textContent = `🚨 ÇOK ACİL — MÜDÜR KEMAL: İstasyonda büyük güvenlik krizi var! Müsait olunca dokun!`;
          el.managerAlertBar.classList.remove("hidden");
          if (!waitingStory.managerNotified) {
            waitingStory.managerNotified = true;
            EMP.addManagerLog(data.empire, `🚨 ÇOK ACİL: ${waitingStory.storyEvent.name} için acil müdahalen gerekiyor patron!`);
          }
        } else if (waitingStory.managerWait >= (activeLand === "land2" ? 2.0 : 4.8)) {
          // Sakin ve güvenli çözüm: Hata yapmaz, istasyonu aksatmaz!
          const safeGain = 95;
          data.cash += safeGain;
          data.daily.eventIncome += safeGain;
          data.reputation = clamp(data.reputation + 4, 0, 100);
          data.security = clamp(data.security + 4, 0, 100);
          EMP.addManagerLog(
            data.empire,
            `👔 Kemal Bey: ${waitingStory.storyEvent.name} (${waitingStory.storyEvent.plate}) konusunu sessizce hallettim (+${safeGain}₺).`
          );
          if (activeLand === "station") {
            addFloatingText(waitingStory.x, waitingStory.y - 24, `👔 Kemal Halletti +${safeGain}₺`, "#fde047");
          }
          el.managerAlertBar.classList.add("hidden");
          setCarExitPath(waitingStory, false);
          saveGame();
        }
      } else {
        managerAlertTargetCar = null;
        el.managerAlertBar.classList.add("hidden");
      }
    } else {
      el.managerAlertBar.classList.add("hidden");
    }

    const phase = getShiftPhase();

    // Otoyol üst şerit
    const tooCloseOnHighway = highwayBgCars.some((hc) => hc.x > WORLD_W - 85);
    if (!tooCloseOnHighway && Math.random() < dt * 0.85 && highwayBgCars.length < 5) {
      highwayBgCars.push({
        x: WORLD_W + 45,
        y: HIGHWAY_UP_Y,
        angle: -Math.PI / 2,
        speed: 105 + Math.random() * 25,
        color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
      });
    }
    highwayBgCars.forEach((hc) => (hc.x -= hc.speed * dt));
    highwayBgCars = highwayBgCars.filter((hc) => hc.x > -65);

    // Pompa Araç Doğurma
    spawnCooldown -= dt;
    if (spawnCooldown <= 0) {
      trySpawnStationCar();
      let baseInterval = Math.max(0.75, 2.9 - data.pumpsUnlocked * 0.26);
      baseInterval /= phase.speedMult;
      if (data.billboardInstalled) baseInterval *= 0.82;
      if (data.reputation >= 70 || vipRushTimer > 0) baseInterval *= 0.82;
      if (data.reputation < 30 || slowTrafficTimer > 0) baseInterval *= 1.38;
      spawnCooldown = baseInterval;
    }

    // EV Araç Doğurma (Yakıttan bağımsız!)
    if (data.evUnlocked && !evCar) {
      evSpawnCooldown -= dt;
      if (evSpawnCooldown <= 0) {
        trySpawnEvCar();
        evSpawnCooldown = 4.5 + Math.random() * 3.5;
      }
    }

    // Tır Kantarı Tır Doğurma
    if (data.scaleUnlocked && !scaleCar) {
      scaleSpawnCooldown -= dt;
      if (scaleSpawnCooldown <= 0) {
        trySpawnScaleTruck();
        scaleSpawnCooldown = 5.5 + Math.random() * 4.0;
      }
    }

    // Tanker
    if (tanker) {
      if (tanker.state === "entering") {
        if (followWaypoints(tanker, dt, 7.5)) {
          tanker.state = "filling";
          sfx.coffeeBrew();
        }
      } else if (tanker.state === "filling") {
        tanker.progress += dt * 0.65;
        data.fuelStock = Math.min(maxFuelCapacity(), data.fuelStock + maxFuelCapacity() * 0.7 * dt);
        if (data.fuelStock >= maxFuelCapacity() || tanker.progress >= 1.7) {
          data.fuelStock = maxFuelCapacity();
          tanker.state = "leaving";
          tanker.waypoints = [
            { x: ENTRY_X, y: APRON_LOW_Y, speed: 95 },
            { x: EXIT_X, y: APRON_LOW_Y, speed: 112 },
            { x: EXIT_X, y: HIGHWAY_IN_Y, speed: 118 },
            { x: WORLD_W + 90, y: HIGHWAY_IN_Y, speed: 140 }
          ];
          sfx.perfectHit();
          addFloatingText(64, 160, `🛢️ +${maxFuelCapacity()}L DOLDU!`, "#38bdf8");
          saveGame();
        }
      } else if (tanker.state === "leaving") {
        if (followWaypoints(tanker, dt, 7.5)) tanker = null;
      }
    }

    // Polis Aracı
    if (policeCruiser) {
      if (policeCruiser.state === "entering") {
        if (followWaypoints(policeCruiser, dt, 11)) {
          policeCruiser.state = "arresting";
          policeCruiser.timer = 1.1;
        }
      } else if (policeCruiser.state === "arresting") {
        policeCruiser.timer -= dt;
        if (policeCruiser.timer <= 0) {
          if (policeCruiser.suspectCar) setCarExitPath(policeCruiser.suspectCar, false);
          policeCruiser.state = "leaving";
          const exitLane = policeCruiser.exitLaneY || APRON_LOW_Y;
          policeCruiser.waypoints = [
            { x: EXIT_X, y: exitLane, speed: 150 },
            { x: EXIT_X, y: HIGHWAY_IN_Y, speed: 160 },
            { x: WORLD_W + 80, y: HIGHWAY_IN_Y, speed: 180 }
          ];
        }
      } else if (policeCruiser.state === "leaving") {
        if (followWaypoints(policeCruiser, dt, 11)) policeCruiser = null;
      }
    }

    // Köpek Duman
    if (data.dumanHired) {
      const storyCar = cars.find((c) => c.isStory && c.state === "story_wait");
      if (storyCar) {
        moveTowards(workers.duman, storyCar.x - 22, storyCar.y + 8, 86, dt);
      } else {
        workers.duman.x += workers.duman.dir * 28 * dt;
        if (workers.duman.x > 220) workers.duman.dir = -1;
        if (workers.duman.x < 120) workers.duman.dir = 1;
        workers.duman.y = 102;
      }
    }

    // 3 Pompacı İşçi
    const powerFactor = powerOutage ? 0.45 : 1.0;
    const pumperKeys = ["ali", "murat", "hasan"];
    pumperKeys.forEach((wKey, idx) => {
      const lvl = data.staff[wKey];
      if (!lvl) return;
      const w = workers[wKey];
      const otherTargets = pumperKeys.filter((k) => k !== wKey).map((k) => workers[k].targetPump);

      const targetCar = cars.find(
        (c) =>
          !c.isStory &&
          c.pumpIdx >= 0 &&
          (c.state === "waiting_fuel" || c.state === "fueling") &&
          !otherTargets.includes(c.pumpIdx)
      );

      if (targetCar) {
        w.targetPump = targetCar.pumpIdx;
        const p = PUMPS[targetCar.pumpIdx];
        const arrived = moveTowards(w, p.x - 19, p.carY, 74 + lvl * 17, dt);
        w.moving = !arrived;
        if (arrived && data.fuelStock > 0.5) {
          targetCar.state = "fueling";
          const rate = (5.4 + lvl * 2.5 + data.pumpSpeedLvl * 1.25) * powerFactor * dt;
          const used = Math.min(data.fuelStock, rate);
          targetCar.fuelFilled += used;
          data.fuelStock -= used;
        }
      } else {
        w.targetPump = -1;
        const idleArrived = moveTowards(w, 126 + idx * 44, 342, 62, dt);
        w.moving = !idleArrived;
      }
    });

    // Tüm Araçların Döngüsü
    cars.forEach((car) => {
      if (car.state === "entering") {
        if (Math.random() < 0.18) {
          const backX = car.x - Math.sin(car.angle) * 18;
          const backY = car.y + Math.cos(car.angle) * 18;
          exhaustPuffs.push({ x: backX, y: backY, r: 2.4, life: 0.4 });
        }
        if (followWaypoints(car, dt, 10.5)) {
          if (car.isStory) {
            car.state = "story_wait";
            if (!(activeLand === "land2" && data.empire.managerHired)) {
              sfx.doorBell();
              el.liveHintText.textContent = "❗ Özel olay aracı geldi! Kırmızı ünlemli araca dokun!";
              if (data.dumanHired && car.storyEvent.dumanHint && car.storyEvent.dumanHint.includes("hırl")) {
                sfx.dogGrowl();
              }
            }
          } else {
            car.state = "waiting_fuel";
          }
        }
      } else if (car.state === "waiting_fuel" || car.state === "fueling") {
        const playerPressing = pointerHeldPump === car.pumpIdx || car.manualLatched;
        if (playerPressing) {
          if (data.fuelStock <= 0.5) {
            car.manualLatched = false;
            el.liveHintText.textContent = "🛢️ Yakıt bitti! Sol alttan Tanker Çağır!";
          } else {
            car.state = "fueling";
            const boost = pointerHeldPump === car.pumpIdx ? 1.9 : 1.0;
            const rate = (7.8 + data.pumpSpeedLvl * 2.3) * boost * powerFactor * dt;
            const used = Math.min(data.fuelStock, rate);
            car.fuelFilled += used;
            data.fuelStock -= used;
            if (Math.random() < 0.2) sfx.pumpTick(300 + (car.fuelFilled / car.fuelNeeded) * 230);
          }
        }

        if (car.fuelFilled >= car.fuelNeeded) {
          car.fuelFilled = car.fuelNeeded;
          car.manualLatched = false;
          data.cash += car.payAmount;
          data.totalServed += 1;
          data.daily.fuelIncome += car.payAmount;
          data.daily.carsServed += 1;

          if (!pendingSpecialReady) {
            servedSinceSpecial += 1;
            if (servedSinceSpecial >= nextSpecialTarget) pendingSpecialReady = true;
          }

          sfx.cashRegister();
          addFloatingText(car.x, car.y - 24, `+${car.payAmount} ₺`, "#4ade80");
          saveGame();

          if (sendDriverToPedestrianPlaza(car, false)) {
            // Yaya meydanına (Motel / Restoran / Market) yürüdü!
          } else if (car.wantsWash && data.carWashUnlocked && !washCar) {
            car.state = "going_wash";
            washCar = car;
            const p = PUMPS[car.pumpIdx];
            car.waypoints = [
              { x: car.x, y: p.laneY, speed: 70, reverse: true },
              ...(p.laneY !== APRON_LOW_Y ? [{ x: ENTRY_X, y: p.laneY, speed: 110 }, { x: ENTRY_X, y: APRON_LOW_Y, speed: 115 }] : []),
              { x: WASH_POS.carX, y: APRON_LOW_Y, speed: 115 },
              { x: WASH_POS.carX, y: WASH_POS.carY, speed: 95, finalAngle: Math.PI }
            ];
          } else if (car.wantsGarage && data.garageUnlocked && !garageCar) {
            car.state = "going_garage";
            garageCar = car;
            const p = PUMPS[car.pumpIdx];
            car.waypoints = [
              { x: car.x, y: p.laneY, speed: 70, reverse: true },
              ...(p.laneY !== APRON_LOW_Y ? [{ x: ENTRY_X, y: p.laneY, speed: 110 }, { x: ENTRY_X, y: APRON_LOW_Y, speed: 115 }] : []),
              { x: GARAGE_POS.carX, y: APRON_LOW_Y, speed: 115 },
              { x: GARAGE_POS.carX, y: GARAGE_POS.carY, speed: 95, finalAngle: Math.PI }
            ];
          } else {
            setCarExitPath(car, false);
          }
        }
      } else if (car.state === "going_ev") {
        if (followWaypoints(car, dt, 10)) {
          car.state = "charging";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "charging") {
        const autoSpd = data.staff.kerem > 0 ? 22 + data.staff.kerem * 9 : 0;
        const manSpd = car.serviceManual ? 38 : 0;
        if (autoSpd + manSpd > 0 && !powerOutage) {
          car.serviceProg += (autoSpd + manSpd) * dt;
          if (car.serviceProg >= 100) {
            const solarBonus = data.solarInstalled ? 1.25 : 1.0;
            const evPay = Math.round((68 + (data.evLvl - 1) * 22) * solarBonus * (vipRushTimer > 0 ? 1.25 : 1));
            data.cash += evPay;
            data.daily.evIncome += evPay;
            data.daily.evServed += 1;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 24, `⚡ +${evPay} ₺`, "#22d3ee");
            evCar = null;
            saveGame();
            // EV sürücüsü ekstra alışveriş/yemek/motel için inebilir!
            if (!sendDriverToPedestrianPlaza(car, true)) {
              setCarExitPath(car, true);
            }
          }
        }
      } else if (car.state === "going_scale") {
        if (followWaypoints(car, dt, 9)) {
          car.state = "weighing";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "weighing") {
        const autoSpd = data.staff.osman > 0 ? 22 + data.staff.osman * 9 : 0;
        const manSpd = car.serviceManual ? 40 : 0;
        if (autoSpd + manSpd > 0) {
          car.serviceProg += (autoSpd + manSpd) * powerFactor * dt;
          if (car.serviceProg >= 100) {
            const scalePay = Math.round((135 + (data.scaleLvl - 1) * 35) * (vipRushTimer > 0 ? 1.25 : 1));
            data.cash += scalePay;
            data.daily.scaleIncome += scalePay;
            data.daily.trucksWeighed += 1;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 24, `⚖️ ${car.weightTons}T +${scalePay}₺`, "#facc15");
            scaleCar = null;
            setCarExitPath(car, true);
            saveGame();
          }
        }
      } else if (car.state === "going_wash") {
        if (followWaypoints(car, dt, 10)) {
          car.state = "washing";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "washing") {
        const autoSpd = data.staff.kadir > 0 ? 22 + data.staff.kadir * 9 : 0;
        const manSpd = car.serviceManual ? 38 : 0;
        if (autoSpd + manSpd > 0) {
          car.serviceProg += (autoSpd + manSpd) * powerFactor * dt;
          if (car.serviceProg >= 100) {
            const washPay = Math.round((36 + (data.carWashLvl - 1) * 14) * (vipRushTimer > 0 ? 1.3 : 1));
            data.cash += washPay;
            data.daily.serviceIncome += washPay;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 25, `🚿 +${washPay} ₺`, "#38bdf8");
            washCar = null;
            setCarExitPath(car, true);
            saveGame();
          }
        }
      } else if (car.state === "going_garage") {
        if (followWaypoints(car, dt, 10)) {
          car.state = "repairing";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "repairing") {
        const autoSpd = data.staff.cemil > 0 ? 20 + data.staff.cemil * 9 : 0;
        const manSpd = car.serviceManual ? 36 : 0;
        if (autoSpd + manSpd > 0) {
          car.serviceProg += (autoSpd + manSpd) * powerFactor * dt;
          if (car.serviceProg >= 100) {
            const repPay = Math.round((58 + (data.garageLvl - 1) * 20) * (vipRushTimer > 0 ? 1.3 : 1));
            data.cash += repPay;
            data.daily.serviceIncome += repPay;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 25, `🔧 +${repPay} ₺`, "#c084fc");
            garageCar = null;
            setCarExitPath(car, true);
            saveGame();
          }
        }
      } else if (car.state === "leaving") {
        if (Math.random() < 0.14 && !car.isEv) {
          const backX = car.x - Math.sin(car.angle) * 18;
          const backY = car.y + Math.cos(car.angle) * 18;
          exhaustPuffs.push({ x: backX, y: backY, r: 2.3, life: 0.36 });
        }
        if (followWaypoints(car, dt, 10.5)) car.remove = true;
      }
    });
    cars = cars.filter((c) => !c.remove);

    // Yürüyen Müşteri Karakterleri (Market, Restoran ve Mini Motel!)
    shoppers.forEach((sh) => {
      if (sh.phase === "to_dest") {
        const target =
          sh.dest === "motel" ? MOTEL_POS : sh.dest === "restaurant" ? RESTAURANT_POS : MARKET_POS;
        if (moveTowards(sh, target.doorX, target.doorY + 26, 86, dt)) {
          sh.phase = "inside";
          if (sh.dest === "motel") {
            motelQueue.push({ shopperRef: sh });
          } else if (sh.dest === "restaurant") {
            const dish = pickRestaurantDish();
            restaurantQueue.push(Object.assign(dish, { shopperRef: sh }));
          } else {
            marketQueue += 1;
          }
        }
      } else if (sh.phase === "back_to_car") {
        if (moveTowards(sh, sh.carRef.x, sh.carRef.y, 90, dt)) {
          sh.done = true;
          setCarExitPath(sh.carRef, !!sh.carRef.isEv);
        }
      }
    });
    shoppers = shoppers.filter((s) => !s.done);

    // Mini Motel Odalarında Dinlenen Misafirler
    motelOccupants.forEach((occ) => {
      occ.timer -= dt;
      if (occ.timer <= 0) {
        occ.done = true;
        if (occ.shopperRef) occ.shopperRef.phase = "back_to_car";
      }
    });
    motelOccupants = motelOccupants.filter((o) => !o.done);

    // Otomatik Çalışanlar (Zeynep, Mehmet, Selin)
    if (marketQueue > 0 && data.staff.zeynep > 0 && !powerOutage) {
      marketProgress += (28 + data.staff.zeynep * 11) * dt;
      workers.zeynep.x = 105 + Math.sin(Date.now() * 0.006) * 14;
      workers.zeynep.moving = true;
      if (marketProgress >= 100) completeOneMarketSale();
    } else {
      workers.zeynep.moving = false;
    }

    if (restaurantQueue.length > 0 && data.staff.mehmet > 0 && !powerOutage) {
      restaurantProgress += (24 + data.staff.mehmet * 10) * dt;
      workers.mehmet.x = 235 + Math.sin(Date.now() * 0.007) * 14;
      workers.mehmet.moving = true;
      if (restaurantProgress >= 100) completeOneRestaurantOrder();
    } else {
      workers.mehmet.moving = false;
    }

    if (motelQueue.length > 0 && motelOccupants.length < maxMotelRooms() && data.staff.selin > 0 && !powerOutage) {
      motelProgress += (26 + data.staff.selin * 10) * dt;
      workers.selin.x = 365 + Math.sin(Date.now() * 0.006) * 14;
      workers.selin.moving = true;
      if (motelProgress >= 100) checkInOneMotelGuest();
    } else {
      workers.selin.moving = false;
    }

    exhaustPuffs.forEach((ep) => {
      ep.r += 9 * dt;
      ep.life -= dt;
    });
    exhaustPuffs = exhaustPuffs.filter((ep) => ep.life > 0);

    floatingTexts.forEach((ft) => {
      ft.y -= 26 * dt;
      ft.life -= dt;
    });
    floatingTexts = floatingTexts.filter((ft) => ft.life > 0);

    updateHUD();
  }

  function completeOneMarketSale() {
    if (marketQueue <= 0) return;
    marketQueue -= 1;
    marketProgress = 0;
    const sale = Math.round((18 + (data.marketLvl - 1) * 9) * (vipRushTimer > 0 ? 1.3 : 1));
    data.cash += sale;
    data.daily.marketIncome += sale;
    data.daily.marketServed += 1;
    sfx.cashRegister();
    addFloatingText(MARKET_POS.doorX, MARKET_POS.y - 6, `☕ +${sale} ₺`, "#fde68a");
    const waitingShopper = shoppers.find((s) => s.dest === "market" && s.phase === "inside");
    if (waitingShopper) waitingShopper.phase = "back_to_car";
    saveGame();
  }

  function completeOneRestaurantOrder() {
    if (restaurantQueue.length === 0) return;
    const order = restaurantQueue.shift();
    restaurantProgress = 0;
    data.cash += order.price;
    data.daily.restaurantIncome += order.price;
    data.daily.dishesServed += 1;
    sfx.cashRegister();
    addFloatingText(RESTAURANT_POS.doorX, RESTAURANT_POS.y - 6, `${order.emoji} ${order.short} +${order.price}₺`, "#fb923c");
    if (order.shopperRef) order.shopperRef.phase = "back_to_car";
    saveGame();
  }

  function checkInOneMotelGuest() {
    if (motelQueue.length === 0) return;
    if (motelOccupants.length >= maxMotelRooms()) {
      showToast("🏨 Tüm motel odaları dolu, birazdan boşalacak!");
      return;
    }
    const guest = motelQueue.shift();
    motelProgress = 0;
    const rent = Math.round((115 + (data.motelLvl - 1) * 32) * (vipRushTimer > 0 ? 1.25 : 1));
    data.cash += rent;
    data.daily.motelIncome += rent;
    data.daily.motelGuests += 1;
    sfx.cashRegister();
    addFloatingText(MOTEL_POS.doorX, MOTEL_POS.y - 6, `🏨 Oda +${rent} ₺`, "#f472b6");
    motelOccupants.push({ timer: 7.5, shopperRef: guest.shopperRef });
    saveGame();
  }

  // =========================================================================
  // YENİ NESİL 3D HARİTA ÇİZİMİ
  // =========================================================================
  const ctx = el.canvas.getContext("2d");

  function renderMap() {
    const dpr = window.devicePixelRatio || 1;
    const cw = el.canvas.clientWidth || 440;
    const ch = el.canvas.clientHeight || 580;
    if (el.canvas.width !== Math.round(cw * dpr) || el.canvas.height !== Math.round(ch * dpr)) {
      el.canvas.width = Math.round(cw * dpr);
      el.canvas.height = Math.round(ch * dpr);
    }

    const phase = getShiftPhase();

    ctx.save();
    ctx.scale((cw * dpr) / WORLD_W, (ch * dpr) / WORLD_H);

    // Eğer oyuncu 2. Arazi (Yan Arsa / Outlet & Plaza) sekmesindeyse 2. Araziyi çiz!
    if (activeLand === "land2") {
      EMP.renderLand2(ctx, WORLD_W, WORLD_H, phase, data, MR);
      ctx.restore();
      return;
    }

    // 1. 3D Stilize Zemin Haritası
    MR.drawGround(ctx, WORLD_W, WORLD_H, phase.night);

    // Sürüş Koridoru Kılavuzları
    ctx.save();
    ctx.strokeStyle = "rgba(226, 232, 240, 0.13)";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(ENTRY_X, 94);
    ctx.lineTo(ENTRY_X, APRON_LOW_Y);
    ctx.lineTo(EXIT_X, APRON_LOW_Y);
    ctx.lineTo(EXIT_X, 94);
    ctx.moveTo(ENTRY_X, APRON_MID_Y);
    ctx.lineTo(EXIT_X, APRON_MID_Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Giriş / Çıkış Yön Etiketleri
    MR.rr(ctx, ENTRY_X - 24, 78, 48, 14, 4, "rgba(15, 23, 42, 0.72)", "rgba(253, 224, 71, 0.65)", 1);
    MR.rr(ctx, EXIT_X - 24, 78, 48, 14, 4, "rgba(15, 23, 42, 0.72)", "rgba(253, 224, 71, 0.65)", 1);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⬇ GİRİŞ", ENTRY_X, 88);
    ctx.fillText("⬆ ÇIKIŞ", EXIT_X, 88);

    if (data.billboardInstalled) MR.drawHighwayBillboard(ctx, 255, 95, powerOutage);
    MR.drawStreetLamp(ctx, 165, 93, phase.night, powerOutage);
    MR.drawStreetLamp(ctx, 255, 93, phase.night, powerOutage);
    MR.drawStreetLamp(ctx, 345, 93, phase.night, powerOutage);

    highwayBgCars.forEach((hc) =>
      MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", hc.angle, { nightIntensity: phase.night })
    );

    // Ana Depo & Tanker
    MR.drawFuelDepot(ctx, TANK_POS, data.fuelStock, maxFuelCapacity());
    if (tanker) {
      MR.drawDetailedVehicle(ctx, tanker.x, tanker.y, "#ea580c", "tanker", tanker.angle, { nightIntensity: phase.night });
      if (tanker.state === "filling") {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(tanker.x - 11, tanker.y);
        ctx.lineTo(TANK_POS.x + 15, TANK_POS.y);
        ctx.stroke();
      }
    }

    // 9 Pompa Adası
    PUMPS.forEach((p, idx) => MR.drawPumpIsland(ctx, p, idx < data.pumpsUnlocked, data.pumpSpeedLvl, powerOutage));

    // Band 3 — 4 Araç Girişli Tesis: ⚡ EV Şarj, 🚿 Oto Yıkama, 🔧 Tamirhane, 🚛 Tır Kantarı
    MR.drawEvChargerBay(ctx, EV_POS, data.evUnlocked, data.evLvl, powerOutage);
    MR.drawServiceBay(ctx, WASH_POS, data.carWashUnlocked, data.carWashLvl, "wash");
    MR.drawServiceBay(ctx, GARAGE_POS, data.garageUnlocked, data.garageLvl, "garage");
    const scaleWeightTxt = scaleCar && scaleCar.state === "weighing" ? `${scaleCar.weightTons} TON` : "";
    MR.drawTruckScaleBay(ctx, SCALE_POS, data.scaleUnlocked, data.scaleLvl, scaleWeightTxt);

    // Band 4 — 3 Yaya Meydanı Binası: 🏪 Market, 🍽️ Restoran, 🏨 Mini Motel
    MR.drawMarketBuilding(ctx, MARKET_POS, data.marketLvl, marketQueue, data.staff.zeynep > 0, powerOutage, {
      solarInstalled: data.solarInstalled,
      camerasInstalled: data.camerasInstalled
    });
    MR.drawRestaurantBuilding(ctx, RESTAURANT_POS, data.restaurantUnlocked, data.restaurantLvl, restaurantQueue, data.staff.mehmet > 0, powerOutage);
    MR.drawMotelBuilding(ctx, MOTEL_POS, data.motelUnlocked, data.motelLvl, motelOccupants.length, maxMotelRooms(), motelQueue.length, data.staff.selin > 0, powerOutage);

    // Egzoz Dumanları
    exhaustPuffs.forEach((ep) => {
      ctx.fillStyle = `rgba(203, 213, 225, ${ep.life * 0.5})`;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, ep.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tüm Araçlar & Etkileşim Balonları
    cars.forEach((car) => {
      MR.drawDetailedVehicle(ctx, car.x, car.y, car.color, car.shape, car.angle, { nightIntensity: phase.night });

      if (car.state === "fueling") {
        const p = PUMPS[car.pumpIdx];
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + 14, p.y + 14, car.x + 8, car.y - 4);
        ctx.stroke();
      }

      if (car.state === "charging") {
        // Mavi elektrik şarj kablosu & enerji halkası
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(EV_POS.x + 22, EV_POS.y + 48);
        ctx.quadraticCurveTo(car.x - 16, car.y - 8, car.x - 8, car.y);
        ctx.stroke();

        if (data.staff.kerem === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 35, car.y - 38, 70, 22, 6, "#0891b2", "#ecfeff", 1.8);
          ctx.fillStyle = "#fff";
          ctx.font = "900 9.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⚡ ŞARJ ET!", car.x, car.y - 23.5);
        } else {
          MR.rr(ctx, car.x - 26, car.y - 34, 52, 9, 4, "#090d1a", "#22d3ee", 1.3);
          ctx.fillStyle = "#22d3ee";
          ctx.fillRect(car.x - 24, car.y - 32, 48 * (car.serviceProg / 100), 5);
        }
      }

      if (car.state === "weighing") {
        if (data.staff.osman === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 36, car.y - 40, 72, 22, 6, "#ca8a04", "#fef9c3", 1.8);
          ctx.fillStyle = "#fff";
          ctx.font = "900 9.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⚖️ TART!", car.x, car.y - 25.5);
        } else {
          MR.rr(ctx, car.x - 26, car.y - 36, 52, 9, 4, "#090d1a", "#facc15", 1.3);
          ctx.fillStyle = "#facc15";
          ctx.fillRect(car.x - 24, car.y - 34, 48 * (car.serviceProg / 100), 5);
        }
      }

      if (car.state === "washing") {
        const spin = Date.now() * 0.012;
        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
        ctx.beginPath();
        ctx.arc(car.x - 13, car.y + Math.sin(spin) * 9, 7, 0, Math.PI * 2);
        ctx.arc(car.x + 13, car.y - Math.sin(spin) * 9, 7, 0, Math.PI * 2);
        ctx.fill();

        if (data.staff.kadir === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 34, car.y - 38, 68, 22, 6, "#0284c7", "#fff", 1.8);
          ctx.fillStyle = "#fff";
          ctx.font = "900 9.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🚿 YIKA!", car.x, car.y - 23.5);
        } else {
          MR.rr(ctx, car.x - 26, car.y - 34, 52, 9, 4, "#090d1a", "#38bdf8", 1.3);
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(car.x - 24, car.y - 32, 48 * (car.serviceProg / 100), 5);
        }
      }

      if (car.state === "repairing") {
        if (data.staff.cemil === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 35, car.y - 38, 70, 22, 6, "#7e22ce", "#fff", 1.8);
          ctx.fillStyle = "#fff";
          ctx.font = "900 9.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🔧 ONAR!", car.x, car.y - 23.5);
        } else {
          MR.rr(ctx, car.x - 26, car.y - 34, 52, 9, 4, "#090d1a", "#c084fc", 1.3);
          ctx.fillStyle = "#c084fc";
          ctx.fillRect(car.x - 24, car.y - 32, 48 * (car.serviceProg / 100), 5);
        }
      }

      if (car.state === "story_wait") {
        const bounce = Math.sin(Date.now() * 0.008) * 3.5;
        MR.rr(ctx, car.x - 42, car.y - 46 + bounce, 84, 25, 8, "#dc2626", "#fef08a", 2.2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("❗ İNCELE!", car.x, car.y - 30 + bounce);
      }

      if (!car.isStory && car.pumpIdx >= 0 && (car.state === "waiting_fuel" || car.state === "fueling")) {
        const pct = Math.min(1, car.fuelFilled / car.fuelNeeded);
        if (pct < 0.02 && data.staff.ali === 0 && data.staff.murat === 0 && data.staff.hasan === 0) {
          MR.rr(ctx, car.x - 32, car.y - 40, 64, 21, 6, "#16a34a", "#fef08a", 1.8);
          ctx.fillStyle = "#fff";
          ctx.font = "900 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⛽ DOLDUR", car.x, car.y - 26.5);
        } else {
          MR.rr(ctx, car.x - 25, car.y - 34, 50, 9.5, 4, "#090d1a", "#fff", 1.2);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(car.x - 23, car.y - 32, 46 * pct, 5.5);
        }
      }
    });

    if (policeCruiser) {
      MR.drawDetailedVehicle(ctx, policeCruiser.x, policeCruiser.y, "#1e3a8a", "sedan", policeCruiser.angle, {
        isPolice: true,
        headlightsAlways: true,
        nightIntensity: 1
      });
    }

    // Yürüyen Müşteri Karakterleri
    shoppers.forEach((sh) => {
      if (sh.phase !== "inside") {
        const icon = sh.phase === "to_dest" ? (sh.dest === "motel" ? "🛏️" : sh.dest === "restaurant" ? "🍽️" : "☕") : "";
        MR.drawCustomerCharacter(ctx, sh.x, sh.y, sh.shirt, sh.hair, icon, sh.animPhase);
      }
    });

    // Çalışanlar
    if (data.staff.ali > 0) MR.drawAnimatedWorker(ctx, workers.ali.x, workers.ali.y, workers.ali.color, workers.ali.hat, "Ali", workers.ali.moving);
    if (data.staff.murat > 0) MR.drawAnimatedWorker(ctx, workers.murat.x, workers.murat.y, workers.murat.color, workers.murat.hat, "Murat", workers.murat.moving);
    if (data.staff.hasan > 0) MR.drawAnimatedWorker(ctx, workers.hasan.x, workers.hasan.y, workers.hasan.color, workers.hasan.hat, "Hasan", workers.hasan.moving);
    if (data.staff.zeynep > 0) MR.drawAnimatedWorker(ctx, workers.zeynep.x, workers.zeynep.y, workers.zeynep.color, workers.zeynep.hat, "Zeynep", workers.zeynep.moving);
    if (data.staff.mehmet > 0 && data.restaurantUnlocked) MR.drawAnimatedWorker(ctx, workers.mehmet.x, workers.mehmet.y, workers.mehmet.color, workers.mehmet.hat, "Mehmet", workers.mehmet.moving);
    if (data.staff.selin > 0 && data.motelUnlocked) MR.drawAnimatedWorker(ctx, workers.selin.x, workers.selin.y, workers.selin.color, workers.selin.hat, "Selin", workers.selin.moving);
    if (data.staff.kerem > 0 && data.evUnlocked) MR.drawAnimatedWorker(ctx, workers.kerem.x, workers.kerem.y, workers.kerem.color, workers.kerem.hat, "Kerem", false);
    if (data.staff.kadir > 0 && data.carWashUnlocked) MR.drawAnimatedWorker(ctx, workers.kadir.x, workers.kadir.y, workers.kadir.color, workers.kadir.hat, "Kadir", false);
    if (data.staff.cemil > 0 && data.garageUnlocked) MR.drawAnimatedWorker(ctx, workers.cemil.x, workers.cemil.y, workers.cemil.color, workers.cemil.hat, "Cemil", false);
    if (data.staff.osman > 0 && data.scaleUnlocked) MR.drawAnimatedWorker(ctx, workers.osman.x, workers.osman.y, workers.osman.color, workers.osman.hat, "Osman", false);

    if (data.dumanHired) {
      ctx.save();
      ctx.translate(workers.duman.x, workers.duman.y);
      MR.rr(ctx, -10, -5.5, 20, 12, 5.5, "#d97706", "#050811", 1.8);
      ctx.fillStyle = "#050811";
      ctx.beginPath();
      ctx.arc(workers.duman.dir > 0 ? 7 : -7, -3.5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "900 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fde68a";
      ctx.fillText("🐕 Duman", 0, -9);
      ctx.restore();
    }

    // Vardiya Filtresi & Elektrik Kesintisi
    ctx.fillStyle = phase.tint;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    if (powerOutage) {
      ctx.fillStyle = "rgba(4, 6, 15, 0.45)";
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }

    // Uçan Yazılar
    floatingTexts.forEach((ft) => {
      ctx.globalAlpha = Math.min(1, ft.life);
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#050811";
      ctx.lineWidth = 3.5;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }

  // =========================================================================
  // HARİTAYA DOKUNMA KONTROLLERİ
  // =========================================================================
  function getLogicalCoords(e) {
    const rect = el.canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: (cx / rect.width) * WORLD_W, y: (cy / rect.height) * WORLD_H };
  }

  function inBox(pt, box) {
    return pt.x >= box.x && pt.x <= box.x + box.w && pt.y >= box.y && pt.y <= box.y + box.h;
  }

  el.canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (reportPaused) return;
    const pt = getLogicalCoords(e);

    if (activeLand === "land2") {
      EMP.handleLand2Click(pt, data, empireHelpers);
      return;
    }

    // 1. Ana Depo
    if (Math.abs(pt.x - TANK_POS.x) < 24 && Math.abs(pt.y - TANK_POS.y) < 48) {
      callFuelTanker(false);
      return;
    }

    // 2. 9 Pompa Adası
    for (let i = 0; i < PUMPS.length; i++) {
      const p = PUMPS[i];
      if (Math.abs(pt.x - p.x) < 27 && pt.y > p.y - 38 && pt.y < p.carY + 30) {
        if (i >= data.pumpsUnlocked) {
          if (i > data.pumpsUnlocked) return showToast(`Önce ${PUMPS[data.pumpsUnlocked].label}'i açmalısın!`);
          if (data.cash >= p.unlockCost) {
            data.cash -= p.unlockCost;
            data.pumpsUnlocked += 1;
            sfx.perfectHit();
            addFloatingText(p.x, p.y, `🎉 ${p.label} KURULDU!`, "#fde68a");
            saveGame();
            updateHUD();
          } else {
            sfx.burnFail();
            showToast(`${p.label} için ${p.unlockCost} ₺ gerekli!`);
          }
          return;
        }
        const carAtPump = cars.find((c) => c.pumpIdx === i && c.state !== "leaving" && c.state !== "entering");
        if (carAtPump) {
          if (carAtPump.state === "story_wait") return openStoryEncounter(carAtPump);
          if (data.fuelStock <= 1) {
            sfx.burnFail();
            return showToast("🛢️ Ana depo boş! Sol alttan Tanker Çağır!");
          }
          pointerHeldPump = i;
          carAtPump.manualLatched = true;
          sfx.tap();
        }
        return;
      }
    }

    // 3. ⚡ EV Hızlı Şarj
    if (inBox(pt, EV_POS)) {
      if (!data.evUnlocked) {
        if (data.cash >= EV_POS.unlockCost) {
          data.cash -= EV_POS.unlockCost;
          data.evUnlocked = true;
          sfx.perfectHit();
          addFloatingText(EV_POS.carX, EV_POS.y + 30, "⚡ EV ŞARJ KURULDU!", "#22d3ee");
          showToast("⚡ Elektrikli Araç Hızlı Şarj istasyonu açıldı!");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`EV Hızlı Şarj için ${EV_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (evCar && evCar.state === "charging") {
        if (powerOutage) return showToast("⚡ Elektrik kesik! Önce Marketten sigortayı aç!");
        evCar.serviceManual = true;
        sfx.tap();
      }
      return;
    }

    // 4. 🚿 Oto Yıkama
    if (inBox(pt, WASH_POS)) {
      if (!data.carWashUnlocked) {
        if (data.cash >= WASH_POS.unlockCost) {
          data.cash -= WASH_POS.unlockCost;
          data.carWashUnlocked = true;
          sfx.perfectHit();
          addFloatingText(WASH_POS.carX, WASH_POS.y + 30, "🚿 OTO YIKAMA KURULDU!", "#38bdf8");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Oto Yıkama için ${WASH_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (washCar && washCar.state === "washing") {
        washCar.serviceManual = true;
        sfx.tap();
      }
      return;
    }

    // 5. 🔧 Tamirhane
    if (inBox(pt, GARAGE_POS)) {
      if (!data.garageUnlocked) {
        if (data.cash >= GARAGE_POS.unlockCost) {
          data.cash -= GARAGE_POS.unlockCost;
          data.garageUnlocked = true;
          sfx.perfectHit();
          addFloatingText(GARAGE_POS.carX, GARAGE_POS.y + 30, "🔧 TAMİRHANE KURULDU!", "#c084fc");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Tamirhane için ${GARAGE_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (garageCar && garageCar.state === "repairing") {
        garageCar.serviceManual = true;
        sfx.tap();
      }
      return;
    }

    // 6. 🚛 Tır Kantarı
    if (inBox(pt, SCALE_POS)) {
      if (!data.scaleUnlocked) {
        if (data.cash >= SCALE_POS.unlockCost) {
          data.cash -= SCALE_POS.unlockCost;
          data.scaleUnlocked = true;
          sfx.perfectHit();
          addFloatingText(SCALE_POS.carX, SCALE_POS.y + 30, "🚛 TIR KANTARI AÇILDI!", "#facc15");
          showToast("🚛 Tır Kantar & Dinlenme Parkı açıldı!");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Tır Kantarı için ${SCALE_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (scaleCar && scaleCar.state === "weighing") {
        scaleCar.serviceManual = true;
        sfx.tap();
      }
      return;
    }

    // 7. 🏪 7/24 Market (+ Sigorta)
    if (inBox(pt, MARKET_POS)) {
      if (powerOutage) {
        powerOutage = false;
        sfx.perfectHit();
        addFloatingText(MARKET_POS.doorX, MARKET_POS.y, "⚡ ELEKTRİK GELDİ!", "#fde047");
        showToast("⚡ Sigorta açıldı! Tüm sistemler tam güç çalışıyor.");
        updateHUD();
        return;
      }
      if (marketQueue > 0) completeOneMarketSale();
      else openUpgradesModal();
      return;
    }

    // 8. 🍽️ Yol Restoranı
    if (inBox(pt, RESTAURANT_POS)) {
      if (!data.restaurantUnlocked) {
        if (data.cash >= RESTAURANT_POS.unlockCost) {
          data.cash -= RESTAURANT_POS.unlockCost;
          data.restaurantUnlocked = true;
          sfx.perfectHit();
          addFloatingText(RESTAURANT_POS.doorX, RESTAURANT_POS.y + 25, "🍽️ RESTORAN AÇILDI!", "#fb923c");
          showToast("🍽️ 10 Çeşit Yemekli Yol Restoranı açıldı!");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Yol Restoranı için ${RESTAURANT_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (restaurantQueue.length > 0) completeOneRestaurantOrder();
      else openUpgradesModal();
      return;
    }

    // 9. 🏨 Mini Motel
    if (inBox(pt, MOTEL_POS)) {
      if (!data.motelUnlocked) {
        if (data.cash >= MOTEL_POS.unlockCost) {
          data.cash -= MOTEL_POS.unlockCost;
          data.motelUnlocked = true;
          sfx.perfectHit();
          addFloatingText(MOTEL_POS.doorX, MOTEL_POS.y + 25, "🏨 MİNİ MOTEL AÇILDI!", "#f472b6");
          showToast("🏨 Yol Üstü Mini Motel açıldı!");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Mini Motel için ${MOTEL_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (motelQueue.length > 0) checkInOneMotelGuest();
      else openUpgradesModal();
    }
  });

  window.addEventListener("pointerup", () => (pointerHeldPump = -1));
  window.addEventListener("pointercancel", () => (pointerHeldPump = -1));

  // =========================================================================
  // TESİS GELİŞTİRME VE 11 KİŞİLİK EKİP MENÜLERİ
  // =========================================================================
  function openUpgradesModal() {
    sfx.tap();
    el.upCashText.textContent = Math.round(data.cash);
    el.upgradesList.innerHTML = "";

    const nextPump = data.pumpsUnlocked < PUMPS.length ? PUMPS[data.pumpsUnlocked] : null;

    const items = [
      {
        title: `⛽ Yeni Pompa Adası Kur (${data.pumpsUnlocked}/9)`,
        desc: nextPump ? `Sıradaki: ${nextPump.label}${nextPump.isVip ? " (VIP!)" : ""}. 5. ve 9. pompalar VIP'tir!` : "9 pompanın tamamı (2 VIP dahil) aktif!",
        done: data.pumpsUnlocked >= PUMPS.length,
        cost: nextPump ? nextPump.unlockCost : 0,
        buy: () => (data.pumpsUnlocked += 1)
      },
      {
        title: `⚡ Pompa Kalitesi & Hızı (Sv.${data.pumpSpeedLvl}/10)`,
        desc: "Dolum hızını ve araç başı net yakıt kârını (+7 ₺) artırır.",
        done: data.pumpSpeedLvl >= 10,
        cost: Math.round(240 * Math.pow(1.52, data.pumpSpeedLvl - 1)),
        buy: () => (data.pumpSpeedLvl += 1)
      },
      {
        title: data.evUnlocked ? `⚡ EV Süper Şarj Geliştir (Sv.${data.evLvl}/6)` : "⚡ Elektrikli Araç Hızlı Şarj Kur",
        desc: data.evUnlocked ? "EV şarj gelirini +22 ₺ artırır (Güneş paneli +%25 kâr verir!)." : "Yakıt harcamadan elektrikli lüks araçları şarj eder!",
        done: data.evUnlocked && data.evLvl >= 6,
        cost: data.evUnlocked ? Math.round(580 * Math.pow(1.55, data.evLvl - 1)) : EV_POS.unlockCost,
        buy: () => {
          if (!data.evUnlocked) data.evUnlocked = true;
          else data.evLvl += 1;
        }
      },
      {
        title: data.restaurantUnlocked ? `🍽️ Yol Restoranı Mutfağı (Sv.${data.restaurantLvl}/6)` : "🍽️ 10 Çeşit Yemekli Yol Restoranı Kur",
        desc: data.restaurantUnlocked ? "10 çeşit yemeğin fiyatını +%20 artırır!" : "Müşterilerin 10 farklı yemek yiyip ödediği restoranı açar!",
        done: data.restaurantUnlocked && data.restaurantLvl >= 6,
        cost: data.restaurantUnlocked ? Math.round(680 * Math.pow(1.55, data.restaurantLvl - 1)) : RESTAURANT_POS.unlockCost,
        buy: () => {
          if (!data.restaurantUnlocked) data.restaurantUnlocked = true;
          else data.restaurantLvl += 1;
        }
      },
      {
        title: data.motelUnlocked ? `🏨 Mini Motel Odaları (Sv.${data.motelLvl}/6)` : "🏨 Yol Üstü Mini Motel İnşa Et",
        desc: data.motelUnlocked ? `Oda kirasını +32 ₺ ve oda kapasitesini artırır (Şu an: ${maxMotelRooms()} oda).` : "Yorgun yolcuların oda tutup yüksek kira ödediği moteli kurar!",
        done: data.motelUnlocked && data.motelLvl >= 6,
        cost: data.motelUnlocked ? Math.round(920 * Math.pow(1.55, data.motelLvl - 1)) : MOTEL_POS.unlockCost,
        buy: () => {
          if (!data.motelUnlocked) data.motelUnlocked = true;
          else data.motelLvl += 1;
        }
      },
      {
        title: data.scaleUnlocked ? `🚛 Tır Kantarı Geliştir (Sv.${data.scaleLvl}/6)` : "🚛 Tır Kantar & Dinlenme Parkı Kur",
        desc: data.scaleUnlocked ? "Tır tartım ve park gelirini +35 ₺ artırır!" : "Dev uzun yol tırlarına tartım ve park hizmeti verir!",
        done: data.scaleUnlocked && data.scaleLvl >= 6,
        cost: data.scaleUnlocked ? Math.round(1050 * Math.pow(1.55, data.scaleLvl - 1)) : SCALE_POS.unlockCost,
        buy: () => {
          if (!data.scaleUnlocked) data.scaleUnlocked = true;
          else data.scaleLvl += 1;
        }
      },
      {
        title: `🛢️ Yeraltı Yakıt Tankı (Sv.${data.tankLevel}/8)`,
        desc: `Kapasiteyi +900L büyütür (Şu an: ${maxFuelCapacity()}L) ve depoyu bedava fuller!`,
        done: data.tankLevel >= 8,
        cost: Math.round(320 * Math.pow(1.55, data.tankLevel - 1)),
        buy: () => {
          data.tankLevel += 1;
          data.fuelStock = maxFuelCapacity();
        }
      },
      {
        title: data.carWashUnlocked ? `🚿 Oto Yıkama Geliştir (Sv.${data.carWashLvl}/6)` : "🚿 Oto Yıkama Tüneli İnşa Et",
        desc: data.carWashUnlocked ? "Köpüklü yıkama gelirini +14 ₺ artırır." : "Gelir getiren oto yıkama tesisi kurar!",
        done: data.carWashUnlocked && data.carWashLvl >= 6,
        cost: data.carWashUnlocked ? Math.round(380 * Math.pow(1.55, data.carWashLvl - 1)) : WASH_POS.unlockCost,
        buy: () => {
          if (!data.carWashUnlocked) data.carWashUnlocked = true;
          else data.carWashLvl += 1;
        }
      },
      {
        title: data.garageUnlocked ? `🔧 Tamirhane Geliştir (Sv.${data.garageLvl}/6)` : "🔧 Lastik & Motor Tamirhanesi Kur",
        desc: data.garageUnlocked ? "Tamir gelirini araç başı +20 ₺ artırır." : "Yüksek yan gelirli tamir garajını açar!",
        done: data.garageUnlocked && data.garageLvl >= 6,
        cost: data.garageUnlocked ? Math.round(620 * Math.pow(1.55, data.garageLvl - 1)) : GARAGE_POS.unlockCost,
        buy: () => {
          if (!data.garageUnlocked) data.garageUnlocked = true;
          else data.garageLvl += 1;
        }
      },
      {
        title: `🏪 7/24 Market Rafları (Sv.${data.marketLvl}/8)`,
        desc: "Büfe satış gelirini müşteri başı +9 ₺ yükseltir.",
        done: data.marketLvl >= 8,
        cost: Math.round(260 * Math.pow(1.5, data.marketLvl - 1)),
        buy: () => (data.marketLvl += 1)
      },
      {
        title: "☀️ Güneş Paneli & Yedek Jeneratör",
        desc: "Elektrik giderini %45 düşürür, kesintileri önler ve EV Şarj kârını +%25 artırır!",
        done: data.solarInstalled,
        cost: 1650,
        buy: () => {
          data.solarInstalled = true;
          powerOutage = false;
        }
      },
      {
        title: "📹 HD Güvenlik Kamera Ağı",
        desc: "İstasyon güvenliğini kalıcı +15 artırır, gece sabotaj riskini azaltır.",
        done: data.camerasInstalled,
        cost: 1250,
        buy: () => {
          data.camerasInstalled = true;
          data.security = clamp(data.security + 15, 0, 100);
        }
      },
      {
        title: "🪧 Otoyol Dev LED Reklam Tabelası",
        desc: "Trafik hızını +%20 artırır ve daha çok VIP araç çeker!",
        done: data.billboardInstalled,
        cost: 2100,
        buy: () => (data.billboardInstalled = true)
      },
      {
        title: "🚛 Otomatik Tanker İkmal Anlaşması",
        desc: "Ana yakıt deposu %15'e indiğinde tanker otomatik gelir!",
        done: data.autoTanker,
        cost: 2400,
        buy: () => (data.autoTanker = true)
      }
    ];

    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${it.title}</h3><p>${it.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (it.done) {
        btn.disabled = true;
        btn.textContent = "MAKS ✓";
      } else {
        btn.textContent = `${it.cost} ₺`;
        btn.addEventListener("click", () => {
          if (data.cash < it.cost) {
            sfx.burnFail();
            return showToast(`Yetersiz kasa! (${it.cost} ₺ gerekli)`);
          }
          data.cash -= it.cost;
          it.buy();
          sfx.perfectHit();
          saveGame();
          updateHUD();
          openUpgradesModal();
        });
      }
      card.appendChild(btn);
      el.upgradesList.appendChild(card);
    });

    el.upgradesModal.classList.remove("hidden");
  }

  function openStaffModal() {
    sfx.tap();
    el.staffCashText.textContent = Math.round(data.cash);
    el.staffList.innerHTML = "";

    const staffDefs = [
      { key: "ali", title: data.staff.ali > 0 ? `👷 Pompacı Ali (Sv.${data.staff.ali}/6)` : "👷 Pompacı Ali'yi İşe Al", desc: "Pompalara koşup otomatik yakıt doldurur. (Maaş: ~24₺+)", done: data.staff.ali >= 6, cost: data.staff.ali === 0 ? 360 : Math.round(320 * Math.pow(1.55, data.staff.ali)) },
      { key: "duman", title: data.dumanHired ? "🐕 Bekçi Köpek Duman (Görevde ❤️)" : "🐕 Bekçi Köpek Duman'ı Sahiplen", desc: "Özel olaylarda koku/stres ipuçları verir, Güvenlik +10! (Mama: 15₺)", done: data.dumanHired, cost: 240 },
      { key: "zeynep", title: data.staff.zeynep > 0 ? `👩‍🍳 Kasiyer Zeynep (Sv.${data.staff.zeynep}/6)` : "👩‍🍳 Kasiyer Zeynep'i İşe Al", desc: "7/24 Market satışlarını otomatik yapar. (Maaş: ~26₺+)", done: data.staff.zeynep >= 6, cost: data.staff.zeynep === 0 ? 480 : Math.round(360 * Math.pow(1.55, data.staff.zeynep)) },
      { key: "kerem", title: data.staff.kerem > 0 ? `⚡ EV Teknisyeni Kerem (Sv.${data.staff.kerem}/6)` : "⚡ EV Teknisyeni Kerem'i İşe Al", desc: "Elektrikli araçları otomatik hızlı şarj eder! (Maaş: ~30₺+)", done: data.staff.kerem >= 6, cost: data.staff.kerem === 0 ? 920 : Math.round(480 * Math.pow(1.55, data.staff.kerem)) },
      { key: "kadir", title: data.staff.kadir > 0 ? `🚿 Yıkamacı Kadir (Sv.${data.staff.kadir}/6)` : "🚿 Yıkamacı Kadir'i İşe Al", desc: "Oto yıkamaya giren araçları otomatik yıkar. (Maaş: ~28₺+)", done: data.staff.kadir >= 6, cost: data.staff.kadir === 0 ? 980 : Math.round(500 * Math.pow(1.55, data.staff.kadir)) },
      { key: "mehmet", title: data.staff.mehmet > 0 ? `👨‍🍳 Aşçı Mehmet (Sv.${data.staff.mehmet}/6)` : "👨‍🍳 Aşçı Mehmet'i İşe Al", desc: "Yol Restoranı'ndaki 10 çeşit yemeği otomatik servis eder! (Maaş: ~35₺+)", done: data.staff.mehmet >= 6, cost: data.staff.mehmet === 0 ? 1100 : Math.round(520 * Math.pow(1.55, data.staff.mehmet)) },
      { key: "murat", title: data.staff.murat > 0 ? `👷 2. Pompacı Murat (Sv.${data.staff.murat}/6)` : "👷 2. Pompacı Murat'ı İşe Al", desc: "Çoklu pompalarda Ali ile birlikte çalışır! (Maaş: ~28₺+)", done: data.staff.murat >= 6, cost: data.staff.murat === 0 ? 1150 : Math.round(580 * Math.pow(1.55, data.staff.murat)) },
      { key: "selin", title: data.staff.selin > 0 ? `🏨 Resepsiyonist Selin (Sv.${data.staff.selin}/6)` : "🏨 Resepsiyonist Selin'i İşe Al", desc: "Mini Motel misafirlerine otomatik oda verir! (Maaş: ~36₺+)", done: data.staff.selin >= 6, cost: data.staff.selin === 0 ? 1750 : Math.round(720 * Math.pow(1.55, data.staff.selin)) },
      { key: "cemil", title: data.staff.cemil > 0 ? `🔧 Tamir Ustası Cemil (Sv.${data.staff.cemil}/6)` : "🔧 Tamir Ustası Cemil'i İşe Al", desc: "Tamirhane garajındaki araçları otomatik onarır! (Maaş: ~38₺+)", done: data.staff.cemil >= 6, cost: data.staff.cemil === 0 ? 2100 : Math.round(850 * Math.pow(1.55, data.staff.cemil)) },
      { key: "osman", title: data.staff.osman > 0 ? `⚖️ Kantar Görevlisi Osman (Sv.${data.staff.osman}/6)` : "⚖️ Kantar Görevlisi Osman'ı İşe Al", desc: "Tır Kantarı'ndaki tırları otomatik tartar ve ücret alır! (Maaş: ~36₺+)", done: data.staff.osman >= 6, cost: data.staff.osman === 0 ? 2250 : Math.round(880 * Math.pow(1.55, data.staff.osman)) },
      { key: "hasan", title: data.staff.hasan > 0 ? `👷 3. Pompacı Hasan (Sv.${data.staff.hasan}/6)` : "👷 3. Pompacı Hasan'ı İşe Al", desc: "9 pompalı dev istasyonda 3. pompacı olarak çalışır! (Maaş: ~34₺+)", done: data.staff.hasan >= 6, cost: data.staff.hasan === 0 ? 3200 : Math.round(1050 * Math.pow(1.55, data.staff.hasan)) },
      { key: "manager", title: data.empire.managerHired ? "👔 İstasyon Müdürü Kemal Bey (Görevde ✓)" : "👔 İstasyon Müdürü Kemal Bey'i Ata", desc: "İstasyonu temkinle yönetir, hata yapmaz, rutin olayları çözer ve kritik krizlerde seni arar! (Maaş: 55₺/gün)", done: data.empire.managerHired, cost: 4500 }
    ];

    staffDefs.forEach((st) => {
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${st.title}</h3><p>${st.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (st.done) {
        btn.disabled = true;
        btn.textContent = "TAMAM ✓";
      } else {
        btn.textContent = `${st.cost} ₺`;
        btn.addEventListener("click", () => {
          if (data.cash < st.cost) {
            sfx.burnFail();
            return showToast(`Yetersiz kasa! (${st.cost} ₺ gerekli)`);
          }
          data.cash -= st.cost;
          if (st.key === "duman") {
            data.dumanHired = true;
            data.security = clamp(data.security + 10, 0, 100);
            sfx.dogBark();
          } else if (st.key === "manager") {
            data.empire.managerHired = true;
            EMP.addManagerLog(data.empire, "👔 Kemal Bey: Merhaba patron! İstasyon emin ellerde, sen yan araziye rahatça odaklanabilirsin.");
            sfx.perfectHit();
            showToast("👔 Müdür Kemal atandı! Artık yan araziye rahatça odaklanabilirsin!");
          } else {
            data.staff[st.key] += 1;
            sfx.perfectHit();
          }
          saveGame();
          updateHUD();
          openStaffModal();
        });
      }
      card.appendChild(btn);
      el.staffList.appendChild(card);
    });

    el.staffModal.classList.remove("hidden");
  }

  // =========================================================================
  // BÖLGE SEKMELERİ, ŞEHİR & AKILLI TELEFON BAĞLANTILARI
  // =========================================================================
  const empireHelpers = {
    sfx,
    showToast,
    saveGame,
    updateHUD,
    triggerVipRush(sec) {
      vipRushTimer = Math.max(vipRushTimer, sec || 30);
    }
  };

  function switchLand(land) {
    activeLand = land;
    sfx.tap();
    el.liveHintText.textContent =
      land === "land2"
        ? data.empire.land2Owned
          ? "🅿️ Otopark (20->150) & 🏬 AVM Dükkanları: Dokun kur ve kiraya ver!"
          : "🏗️ Yan Arazi tapusunu alıp Otopark ve AVM kur!"
        : "👆 Pompadaki araca dokun / basılı tut!";
    updateHUD();
  }

  el.tabStationBtn.addEventListener("click", () => switchLand("station"));
  el.tabLand2Btn.addEventListener("click", () => switchLand("land2"));

  el.managerAlertBar.addEventListener("click", () => {
    switchLand("station");
    if (managerAlertTargetCar && managerAlertTargetCar.state === "story_wait") {
      openStoryEncounter(managerAlertTargetCar);
    }
  });

  el.openCityBtn.addEventListener("click", () => {
    sfx.tap();
    EMP.renderCityModal(data, empireHelpers);
    el.cityModal.classList.remove("hidden");
  });
  el.closeCityBtn.addEventListener("click", () => el.cityModal.classList.add("hidden"));

  document.querySelectorAll(".city-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      EMP.setCityTab(btn.dataset.tab);
      EMP.renderCityModal(data, empireHelpers);
    });
  });

  el.openPhoneBtn.addEventListener("click", () => {
    sfx.tap();
    if (!data.empire.electronics.phone) {
      showToast("📱 Önce Şehir -> Elektronik'ten Akıllı Telefon (650₺) satın al!");
      EMP.setCityTab("electronics");
      EMP.renderCityModal(data, empireHelpers);
      el.cityModal.classList.remove("hidden");
      return;
    }
    EMP.renderPhoneModal(data, empireHelpers);
    el.phoneModal.classList.remove("hidden");
  });
  el.closePhoneBtn.addEventListener("click", () => el.phoneModal.classList.add("hidden"));

  document.querySelectorAll(".phone-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      EMP.setPhoneApp(btn.dataset.app);
      EMP.renderPhoneModal(data, empireHelpers);
    });
  });

  el.btnOpenUpgrades.addEventListener("click", openUpgradesModal);
  el.closeUpgradesBtn.addEventListener("click", () => el.upgradesModal.classList.add("hidden"));
  el.btnOpenStaff.addEventListener("click", openStaffModal);
  el.closeStaffBtn.addEventListener("click", () => el.staffModal.classList.add("hidden"));

  // =========================================================================
  // ÇOK MODLU ÖZEL OLAY & DİNAMİK KARAR EKRANI
  // =========================================================================
  function openStoryEncounter(carObj) {
    activeStoryCar = carObj;
    const ev = carObj.storyEvent;
    sfx.tap();

    el.storyCategoryTag.textContent = ev.categoryTag || "🔍 ÖZEL OLAY";
    el.storyAvatarBox.innerHTML = window.renderPortraitSVG(ev.look, "neutral");
    el.storyName.textContent = ev.name;
    el.storyRole.textContent = ev.role;
    el.storyPlate.textContent = `TR • ${ev.plate}`;
    el.storySpeech.textContent = `"${ev.speech}"`;

    if (data.dumanHired && ev.dumanHint) {
      el.dumanStoryAlert.style.display = "block";
      el.dumanStoryAlert.textContent = ev.dumanHint;
      el.dumanStoryAlert.style.borderColor = "#f59e0b";
      el.dumanStoryAlert.style.color = "#fde68a";
    } else {
      el.dumanStoryAlert.style.display = "none";
    }

    el.inspectResultBox.style.display = "none";
    el.inspectGrid.innerHTML = "";
    (ev.inspections || []).forEach((ins) => {
      const btn = document.createElement("button");
      btn.className = "inspect-btn";
      btn.textContent = ins.label;
      btn.addEventListener("click", () => showClueText(btn, ins.text));
      el.inspectGrid.appendChild(btn);
    });

    el.storyQuestionsBox.innerHTML = "";
    (ev.questions || []).forEach((qObj) => {
      const qb = document.createElement("button");
      qb.className = "story-q-btn";
      qb.textContent = `💬 ${qObj.q}`;
      qb.addEventListener("click", () => {
        sfx.tap();
        el.storySpeech.textContent = `"${qObj.a}"`;
        el.storyAvatarBox.innerHTML = window.renderPortraitSVG(ev.look, qObj.mood || "neutral");
      });
      el.storyQuestionsBox.appendChild(qb);
    });

    el.storyActionsGrid.innerHTML = "";
    (ev.actions || []).forEach((act) => {
      const ab = document.createElement("button");
      ab.className = `big-dec-btn big-${act.style || "serve"}`;
      ab.textContent = act.label;
      ab.addEventListener("click", () => resolveStoryChoice(act.id));
      el.storyActionsGrid.appendChild(ab);
    });

    el.storyModal.classList.remove("hidden");
  }

  function showClueText(btn, text) {
    sfx.flashlightClick();
    btn.classList.add("checked");
    el.inspectResultBox.textContent = text;
    el.inspectResultBox.style.display = "block";
  }

  function applyStationEffect(eff) {
    if (!eff) return;
    if (eff.type === "vip_rush") vipRushTimer = Math.max(vipRushTimer, eff.duration || 45);
    if (eff.type === "police_patrol") policePatrolTimer = Math.max(policePatrolTimer, eff.duration || 55);
    if (eff.type === "slow_traffic") slowTrafficTimer = Math.max(slowTrafficTimer, eff.duration || 30);
    if (eff.type === "tanker_discount") data.tankerDiscount = true;
    if (eff.type === "power_outage" && !data.solarInstalled) powerOutage = true;
  }

  function resolveStoryChoice(choice) {
    if (!activeStoryCar) return;
    const ev = activeStoryCar.storyEvent;
    const res = ev.resolve(choice);

    el.storyModal.classList.add("hidden");

    const p = PUMPS[activeStoryCar.pumpIdx];
    const laneY = p ? p.laneY : APRON_LOW_Y;

    if (choice === "police") {
      sfx.policeSiren();
      policeCruiser = {
        x: -50,
        y: HIGHWAY_IN_Y,
        angle: Math.PI / 2,
        suspectCar: activeStoryCar,
        exitLaneY: laneY,
        state: "entering",
        timer: 1.1,
        waypoints: [
          { x: ENTRY_X, y: HIGHWAY_IN_Y, speed: 175 },
          { x: ENTRY_X, y: laneY, speed: 165 },
          { x: activeStoryCar.x, y: laneY - 8, speed: 155, finalAngle: 0 }
        ]
      };
    } else {
      setCarExitPath(activeStoryCar, false);
    }

    data.eventsResolved += 1;
    const delta = res.cashDelta || 0;
    data.cash = Math.max(0, data.cash + delta);
    if (delta > 0) data.daily.eventIncome += delta;
    if (delta < 0) data.daily.eventLoss += Math.abs(delta);

    if (res.fuelDelta) {
      data.fuelStock = clamp(data.fuelStock + res.fuelDelta, 0, maxFuelCapacity());
    }

    data.reputation = clamp(data.reputation + (res.repDelta || 0), 0, 100);
    data.security = clamp(data.security + (res.secDelta || 0), 0, 100);
    applyStationEffect(res.effect);

    if (res.status === "good") {
      if (choice !== "police") sfx.perfectHit();
      el.resTitle.style.color = "#4ade80";
      if (delta > 0) addFloatingText(activeStoryCar.x, activeStoryCar.y - 25, `🌟 +${delta} ₺`, "#fde68a");
    } else if (res.status === "mixed") {
      sfx.cashRegister();
      el.resTitle.style.color = "#facc15";
    } else {
      sfx.burnFail();
      el.resTitle.style.color = "#f87171";
    }

    el.resTitle.textContent = res.title;
    el.resBody.textContent = res.message;

    el.resImpactRow.innerHTML = "";
    const addBadge = (txt, cls) => {
      const sp = document.createElement("span");
      sp.className = `impact-badge ${cls}`;
      sp.textContent = txt;
      el.resImpactRow.appendChild(sp);
    };
    if (delta) addBadge(`💵 ${delta > 0 ? "+" : ""}${delta} ₺`, delta > 0 ? "pos" : "neg");
    if (res.fuelDelta) addBadge(`🛢️ ${res.fuelDelta > 0 ? "+" : ""}${res.fuelDelta}L Yakıt`, res.fuelDelta > 0 ? "pos" : "info");
    if (res.repDelta) addBadge(`⭐ İtibar ${res.repDelta > 0 ? "+" : ""}${res.repDelta}`, res.repDelta > 0 ? "pos" : "neg");
    if (res.secDelta) addBadge(`🛡️ Güvenlik ${res.secDelta > 0 ? "+" : ""}${res.secDelta}`, res.secDelta > 0 ? "pos" : "neg");
    if (res.effect && res.effect.label) addBadge(res.effect.label, res.effect.type === "power_outage" || res.effect.type === "slow_traffic" ? "neg" : "info");

    el.liveHintText.textContent = "👆 İstasyonu yönet — bir sonraki sürpriz olay rastgele gelecek!";
    activeStoryCar = null;
    saveGame();
    updateHUD();
    el.storyResultModal.classList.remove("hidden");
  }

  el.closeResBtn.addEventListener("click", () => {
    sfx.tap();
    el.storyResultModal.classList.add("hidden");
  });

  el.musicBtn.addEventListener("click", () => {
    const on = sfx.toggleMusic();
    el.musicBtn.textContent = on ? "🎵" : "🔕";
  });
  el.muteBtn.addEventListener("click", () => {
    const m = sfx.toggleMute();
    el.muteBtn.textContent = m ? "🔇" : "🔊";
  });

  let lastTime = performance.now();
  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if (running) {
      updateWorld(dt);
      renderMap();
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  function applyFullStationPreset() {
    const emp = EMP.createDefaultEmpire();
    emp.managerHired = true;
    emp.land2Owned = false;
    emp.personalCash = 1600;
    emp.dailySalary = 400;
    emp.managerLogs = [
      "👔 Kemal Bey: Merhaba patron! 1. İstasyon tam kapasite çalışıyor, Yan Arazi tapusunu almaya hazırız!"
    ];

    Object.assign(data, {
      cash: 9500,
      fuelStock: 7500,
      tankLevel: 8,
      autoTanker: true,
      pumpsUnlocked: 9,
      pumpSpeedLvl: 10,
      marketLvl: 8,
      restaurantUnlocked: true,
      restaurantLvl: 6,
      evUnlocked: true,
      evLvl: 6,
      motelUnlocked: true,
      motelLvl: 6,
      scaleUnlocked: true,
      scaleLvl: 6,
      carWashUnlocked: true,
      carWashLvl: 6,
      garageUnlocked: true,
      garageLvl: 6,
      solarInstalled: true,
      camerasInstalled: true,
      billboardInstalled: true,
      dumanHired: true,
      staff: {
        ali: 6,
        murat: 6,
        hasan: 6,
        zeynep: 6,
        mehmet: 6,
        kerem: 6,
        selin: 6,
        osman: 6,
        kadir: 6,
        cemil: 6
      },
      reputation: 88,
      security: 95,
      dayNumber: 12,
      totalServed: 210,
      eventsResolved: 18,
      daily: createEmptyDailyStats(),
      empire: emp
    });
    saveGame();
  }

  function launchIntoMap(welcomeMsg) {
    el.startScreen.classList.add("hidden");
    running = true;
    trySpawnStationCar();
    updateHUD();
    if (welcomeMsg) showToast(welcomeMsg);
  }

  window.addEventListener("pointerdown", () => sfx.startRainAmbience(), { once: true });

  el.startGameBtn.addEventListener("click", () => {
    sfx.startRainAmbience();
    sfx.tap();
    launchIntoMap();
  });

  const loadPresetBtn = document.getElementById("loadPresetBtn");
  if (loadPresetBtn) {
    loadPresetBtn.addEventListener("click", () => {
      sfx.startRainAmbience();
      sfx.tap();
      applyFullStationPreset();
      launchIntoMap("✅ Son ilerlemen açıldı! Üstten '🛍️ Yan Arazi'ye geçip arsayı alabilirsin!");
    });
  }

  // URL parametresi (?kayit=yan-arazi) veya mevcut kayıt varsa açılış ekranını atlayıp doğrudan kaldığı yerden başlat!
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("kayit") === "yan-arazi") {
      applyFullStationPreset();
      try {
        window.history.replaceState({}, "", window.location.pathname);
      } catch (_) {}
      launchIntoMap("✅ Son ilerlemen açıldı! Üstten '🛍️ Yan Arazi'ye geçip arsayı alabilirsin!");
    } else if (data.totalServed > 0 || data.pumpsUnlocked > 1 || data.dayNumber > 1 || (data.empire && data.empire.land2Owned)) {
      launchIntoMap();
    }
  } catch (_) {}
})();

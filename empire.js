// Son İstasyon v13.0 — Gelişmiş 2.5D Yan Arazi: Ücretli Otopark (20->150 Araç), Otoyol AVM (8 Satılık & Kiralık Dükkan),
// Lojistik & Plaza Kulesi, Çok Kaynaklı Şahsi Maaş Sistemi (İstasyon + Otopark + Yan Arazi/AVM), Şehir & Akıllı Telefon OS!

window.EmpireSystem = (function () {
  // Temiz 3D ağaçlı ve otoyollu zemin (üzerine çizilen otopark çizgileri ve AVM ile %100 uyumlu, çakışmasız!)
  const baseLotImg = new Image();
  let baseLotReady = false;
  baseLotImg.onload = () => (baseLotReady = true);
  baseLotImg.src = "./assets/station-ground.jpg";

  const LAND2_COST = 6500;
  const PARKING_UNLOCK_COST = 2200;
  const MALL_UNLOCK_COST = 4800;

  // ÜCRETLİ OTOPARK SEVİYELERİ (Başlangıç: TAM 20 ARAÇ KAPASİTE!)
  const PARKING_CAPS = [20, 35, 55, 80, 110, 150];
  const PARKING_CAP_COSTS = [0, 1800, 3200, 5400, 8500, 13000];

  const PARKING_FEES = [24, 36, 52, 70, 92, 120];
  const PARKING_FEE_COSTS = [0, 1400, 2500, 4200, 6800, 10500];
  const PARKING_VALET_COST = 3400;

  // OTOYOL AVM İÇİNDEKİ 8 BAĞIMSIZ DÜKKAN (Önce Tapusunu Satın Al -> Sonra Kiracıya Kiraya Ver!)
  const MALL_SHOPS = [
    {
      key: "coffee",
      floor: "Zemin Kat • No:1",
      name: "Kahve Zinciri Köşesi",
      emoji: "☕",
      deedCost: 1600,
      baseRent: 60,
      color: "#f59e0b",
      desc: "Otoyol yolcularının uğrak kahve durağı."
    },
    {
      key: "burger",
      floor: "Zemin Kat • No:2",
      name: "Gurme Burger & Döner",
      emoji: "🍔",
      deedCost: 2300,
      baseRent: 86,
      color: "#ef4444",
      desc: "Sıcak menüleriyle gün boyu yüksek müşteri çeker."
    },
    {
      key: "supermarket",
      floor: "Zemin Kat • No:3",
      name: "AVM Hipermarket",
      emoji: "🛒",
      deedCost: 3200,
      baseRent: 120,
      color: "#38bdf8",
      desc: "Ailelerin toplu alışveriş yaptığı büyük market alanı."
    },
    {
      key: "fashion",
      floor: "1. Kat • No:4",
      name: "Moda & Giyim Mağazası",
      emoji: "👗",
      deedCost: 4400,
      baseRent: 165,
      color: "#ec4899",
      desc: "Ünlü giyim markalarının yarıştığı geniş mağaza."
    },
    {
      key: "tech",
      floor: "1. Kat • No:5",
      name: "Teknoloji & Elektronik",
      emoji: "📱",
      deedCost: 5800,
      baseRent: 220,
      color: "#06b6d4",
      desc: "Telefon, bilgisayar ve aksesuar devi kurumsal kiracı."
    },
    {
      key: "arcade",
      floor: "1. Kat • No:6",
      name: "Bowling & Oyun Salonu",
      emoji: "🎮",
      deedCost: 7600,
      baseRent: 285,
      color: "#a855f7",
      desc: "Gençlerin ve çocuklu ailelerin favori eğlence katı."
    },
    {
      key: "jewelry",
      floor: "Teras Kat • No:7",
      name: "Kuyumcu & Lüks Saat",
      emoji: "💎",
      deedCost: 9800,
      baseRent: 370,
      color: "#facc15",
      desc: "Yüksek güvenlikli VIP mücevher ve saat mağazası."
    },
    {
      key: "cinema",
      floor: "Teras Kat • No:8",
      name: "VIP Sinema Salonları",
      emoji: "🎬",
      deedCost: 12800,
      baseRent: 480,
      color: "#fb7185",
      desc: "AVM'nin en yüksek kira getiren dev sinema kompleksi!"
    }
  ];

  // YAN ARAZİ SAĞ KANAT TİCARİ KULELER
  const SIDE_TOWERS = [
    {
      key: "logistics",
      name: "E-Ticaret Lojistik Deposu",
      short: "📦 LOJİSTİK",
      emoji: "📦",
      x: 308, y: 324, w: 124, h: 128,
      cost: 4200,
      baseIncome: 195,
      cycleSec: 8.0,
      desc: "Bölgesel kargo aktarma merkezi: düzenli yüksek ticari gelir!"
    },
    {
      key: "office",
      name: "İş Merkezi & Plaza Kulesi",
      short: "🏢 PLAZA",
      emoji: "🏢",
      x: 308, y: 460, w: 124, h: 128,
      cost: 7800,
      baseIncome: 380,
      cycleSec: 9.5,
      desc: "Helikopter pistli kurumsal ofis kulesi: dev şirket kiraları!"
    }
  ];

  // Harita Bölgeleri (480 x 620 Mantıksal Koordinatlar)
  const PARKING_BOX = { x: 48, y: 112, w: 384, h: 168 };
  const MALL_BOX = { x: 48, y: 324, w: 252, h: 264 };

  // 20 Görsel Park Slotu (2 Sıra x 10 Araç = 20 Araçlık Nizami Saha!)
  const PARKING_BAYS = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 10; col++) {
      PARKING_BAYS.push({
        idx: row * 10 + col,
        x: 78 + col * 34,
        y: row === 0 ? 147 : 239,
        row
      });
    }
  }

  // ŞEHİR KATALOGLARI (ŞAHSİ MAAŞINLA SATIN ALINIR!)
  const ELECTRONICS = [
    { key: "phone", name: "📱 Akıllı Telefon Pro", price: 650, prestige: 10, desc: "📱 Telefon uygulamasını açar! (Borsa, YolGram, Müdür Mesajları)" },
    { key: "headphones", name: "🎧 Stüdyo Kulaklık", price: 450, prestige: 8, desc: "Keyifli vardiya ve şahsi prestij (+8 Prestij)." },
    { key: "watch", name: "⌚ Akıllı Saat Ultra", price: 950, prestige: 15, desc: "Önemli bildirimleri anında bileğine taşır (+15 Prestij)." },
    { key: "laptop", name: "💻 Patron Dizüstü PC", price: 1400, prestige: 22, desc: "Borsa işlemlerinde %0 komisyon avantajı (+22 Prestij)." },
    { key: "tv", name: "📺 85 İnç 4K OLED TV", price: 2200, prestige: 30, desc: "Ev keyfi ve yüksek yaşam standardı (+30 Prestij)." }
  ];

  const PROPERTIES = [
    { key: "studio", name: "🏢 1+1 Stüdyo Daire", price: 3500, dailyRent: 120, prestige: 20, desc: "Her gün şahsi hesabına +120 ₺ kira geliri yatar." },
    { key: "city2p1", name: "🏠 2+1 Şehir Dairesi", price: 7500, dailyRent: 280, prestige: 40, desc: "Merkezi konumda daire: günde +280 ₺ pasif kira!" },
    { key: "residence", name: "🏙️ 3+1 Deniz Rezidans", price: 15000, dailyRent: 600, prestige: 75, desc: "Lüks rezidans: günde +600 ₺ kira ve büyük prestij!" },
    { key: "villa", name: "🏡 Havuzlu Boğaz Villası", price: 32000, dailyRent: 1400, prestige: 150, desc: "Hayallerin zirvesi: günde +1.400 ₺ pasif gelir!" }
  ];

  const GALLERY_CARS = [
    { key: "hatchback", name: "🚗 Şehir Hatchback", price: 2800, prestige: 18, repBonus: 2, desc: "İlk kişisel aracın (+18 Prestij)." },
    { key: "sedan_lux", name: "🚘 Lüks Alman Sedan", price: 8500, prestige: 45, repBonus: 5, desc: "Patron karizması (+45 Prestij, İtibar +5)." },
    { key: "ev_suv", name: "🚙 Elektrikli Süper SUV", price: 14000, prestige: 75, repBonus: 8, desc: "Yeni nesil lüks SUV (+75 Prestij, İtibar +8)." },
    { key: "supercar", name: "🏎️ İtalyan Süper Spor", price: 28000, prestige: 140, repBonus: 15, desc: "Otoyolun efsanesi (+140 Prestij, İtibar +15)!" }
  ];

  const INITIAL_STOCKS = [
    { sym: "ENRJ", name: "Anadolu Enerji", price: 100, prev: 100, vol: 0.09 },
    { sym: "TEKN", name: "Dijital Teknoloji", price: 180, prev: 180, vol: 0.14 },
    { sym: "OTOM", name: "Yerli Otomotiv", price: 140, prev: 140, vol: 0.11 },
    { sym: "GIDA", name: "Lezzet Gıda", price: 75, prev: 75, vol: 0.06 },
    { sym: "ALTN", name: "Altın Fonu", price: 240, prev: 240, vol: 0.05 },
    { sym: "KRPT", name: "Kripto Sepeti", price: 320, prev: 320, vol: 0.22 }
  ];

  const MARKET_NEWS = [
    "📰 Enerji sektöründe yeni teşvik açıklandı — ENRJ hareketli!",
    "📰 Yerli elektrikli araç satışları rekor kırdı — OTOM yükselişte!",
    "📰 Yapay zeka şirketlerine dev yatırım — TEKN canlı!",
    "📰 Küresel piyasalarda dalgalanma — Altın Fonu (ALTN) güvenli liman.",
    "📰 Kripto piyasasında sert iniş çıkışlar bekleniyor!",
    "📰 Perakende ve AVM ciroları zirve yaptı — GIDA pozitif."
  ];

  const SOCIAL_COMMENTS = [
    "🅿️ @geceyolcusu: 'Yeni ücretli otopark tertemiz, aracımı güvenle bırakıp AVM'ye geçtim!'",
    "🏬 @alisveris_tutkunu: 'Otoyol AVM şahane olmuş, mağazalar ışıl ışıl!'",
    "⚡ @elektrikli_surucu: 'İstasyon + AVM + Otopark bir arada, tam Avrupa standartlarında tesis!'",
    "🎬 @sinemasever: 'Yol üstünde VIP sinema ve gurme burger keyfi bir başka!'",
    "👔 @is_insani: 'Plaza kulesi ve otopark vale hizmeti 10 numara olmuş.'"
  ];

  function createDefaultMallShops() {
    const map = {};
    MALL_SHOPS.forEach((s) => {
      map[s.key] = { owned: false, rented: false, lvl: 1, contract: "fixed" };
    });
    return map;
  }

  function createDefaultEmpire() {
    const stocks = {};
    INITIAL_STOCKS.forEach((s) => {
      stocks[s.sym] = { price: s.price, prev: s.prev, shares: 0, avgCost: 0 };
    });
    return {
      v13Ready: true,
      managerHired: false,
      land2Owned: false,

      // Ücretli Otopark (Başlangıç 20 Araç!)
      parkingUnlocked: false,
      parkingCapLvl: 1, // 1..6 -> [20, 35, 55, 80, 110, 150]
      parkingFeeLvl: 1, // 1..6
      parkingValet: false,

      // Otoyol AVM & Dükkanlar (Başlangıçta 0 dükkan bizim!)
      mallUnlocked: false,
      mallShops: createDefaultMallShops(),

      // Sağ Kanat Lojistik & Plaza
      sideLevels: { logistics: 0, office: 0 },

      // 3. Arazi Mega Holding Kompleksi
      land3: window.Land3System ? window.Land3System.createDefaultLand3() : null,

      // Çok Kaynaklı Şahsi Maaş Sistemi!
      personalCash: 0,
      dailySalary: 200, // 1. İstasyon Maaşım
      parkingSalary: 0, // Ücretli Otoparktan Şahsi Maaşım
      land2Salary: 0, // Yan Arazi & AVM'den Şahsi Maaşım

      electronics: {},
      properties: {},
      cars: {},
      stocks,
      stockNews: MARKET_NEWS[0],
      socialFollowers: 120,
      socialPosts: [
        "⛽ Son İstasyon & Otoyol AVM kompleksimiz 7/24 hizmetinizde!"
      ],
      managerLogs: [
        "👔 Kemal Bey işe alındığında istasyonu sessizce yönetir; çok acil bir kriz olmadıkça seni rahatsız etmez."
      ],
      pendingRefund: 0
    };
  }

  function mergeEmpire(saved) {
    const def = createDefaultEmpire();
    if (!saved) return def;
    const out = Object.assign({}, def, saved);

    // Eski v12 kaydından geçiş: Lojistik ve Plaza seviyelerini koru, eski kutu dükkan harcamalarını iade et!
    out.sideLevels = Object.assign({ logistics: 0, office: 0 }, saved.sideLevels || {});
    if (!saved.v13Ready && saved.land2Levels) {
      if (saved.land2Levels.logistics) out.sideLevels.logistics = saved.land2Levels.logistics;
      if (saved.land2Levels.office) out.sideLevels.office = saved.land2Levels.office;
      let refund = 0;
      const oldRefundCosts = { coffee: 1800, hypermarket: 2600, arcade: 3400, cinema: 6200 };
      Object.keys(oldRefundCosts).forEach((k) => {
        const lv = saved.land2Levels[k] || 0;
        if (lv > 0) refund += oldRefundCosts[k] * lv;
      });
      if (refund > 0) out.pendingRefund = refund;
      out.v13Ready = true;
    }

    const defShops = createDefaultMallShops();
    out.mallShops = {};
    MALL_SHOPS.forEach((s) => {
      out.mallShops[s.key] = Object.assign({}, defShops[s.key], (saved.mallShops && saved.mallShops[s.key]) || {});
    });

    out.parkingCapLvl = Math.max(1, Math.min(6, out.parkingCapLvl || 1));
    out.parkingFeeLvl = Math.max(1, Math.min(6, out.parkingFeeLvl || 1));
    out.dailySalary = Number.isFinite(out.dailySalary) ? out.dailySalary : 200;
    out.parkingSalary = Number.isFinite(out.parkingSalary) ? out.parkingSalary : 0;
    out.land2Salary = Number.isFinite(out.land2Salary) ? out.land2Salary : 0;
    if (window.Land3System) {
      out.land3 = window.Land3System.mergeLand3(saved.land3);
    }

    out.electronics = Object.assign({}, saved.electronics || {});
    out.properties = Object.assign({}, saved.properties || {});
    out.cars = Object.assign({}, saved.cars || {});
    out.stocks = Object.assign({}, def.stocks);
    if (saved.stocks) {
      INITIAL_STOCKS.forEach((s) => {
        if (saved.stocks[s.sym]) {
          out.stocks[s.sym] = Object.assign({ price: s.price, prev: s.prev, shares: 0, avgCost: 0 }, saved.stocks[s.sym]);
        }
      });
    }
    if (!Array.isArray(out.socialPosts)) out.socialPosts = def.socialPosts;
    if (!Array.isArray(out.managerLogs)) out.managerLogs = def.managerLogs;
    return out;
  }

  // =========================================================================
  // HESAPLAMA YARDIMCILARI (OTOPARK, AVM KİRA, ÇOKLU ŞAHSİ MAAŞ)
  // =========================================================================
  function getMaxParkingCap(emp) {
    return PARKING_CAPS[(emp.parkingCapLvl || 1) - 1] || 20;
  }

  function getParkingFee(emp) {
    const base = PARKING_FEES[(emp.parkingFeeLvl || 1) - 1] || 24;
    return emp.parkingValet ? Math.round(base * 1.25) : base;
  }

  function getMallShopUpgradeCost(shopDef, currentLvl) {
    return Math.round(shopDef.deedCost * 0.55 * Math.pow(1.45, currentLvl - 1));
  }

  function getParkingOccupancyBonus(emp) {
    if (!emp.parkingUnlocked) return 0;
    const count = getCurrentParkedCount();
    return Math.min(0.35, count * 0.012); // Otoparktaki araçlar AVM ciro/kirasını +%35'e kadar artırır!
  }

  function getShopCycleRent(shopDef, shopState, emp) {
    if (!shopState || !shopState.owned || !shopState.rented) return 0;
    const lvlMult = 1 + (shopState.lvl - 1) * 0.35;
    if (shopState.contract === "share") {
      const occBonus = 1 + getParkingOccupancyBonus(emp) * 1.3;
      return Math.round(shopDef.baseRent * lvlMult * occBonus);
    }
    return Math.round(shopDef.baseRent * 1.15 * lvlMult);
  }

  function getMallTotalCycleRent(emp) {
    if (!emp.mallUnlocked) return 0;
    return MALL_SHOPS.reduce((sum, s) => sum + getShopCycleRent(s, emp.mallShops[s.key], emp), 0);
  }

  function getMallCounts(emp) {
    let owned = 0;
    let rented = 0;
    MALL_SHOPS.forEach((s) => {
      const st = emp.mallShops[s.key];
      if (st && st.owned) owned += 1;
      if (st && st.rented) rented += 1;
    });
    return { owned, rented, total: MALL_SHOPS.length };
  }

  function calcSideTowerUpgradeCost(tower, lvl) {
    if (lvl === 0) return tower.cost;
    return Math.round(tower.cost * 0.72 * Math.pow(1.5, lvl));
  }

  function calcSideTowerIncome(tower, lvl) {
    if (lvl <= 0) return 0;
    return Math.round(tower.baseIncome * (1 + (lvl - 1) * 0.45));
  }

  // Çok Kaynaklı Şahsi Maaş Hesabı (1. İstasyon + Otopark + 2. Arazi/AVM + 3. Arazi)
  function calcSalaryBreakdown(emp) {
    const stationSal = Math.max(0, emp.dailySalary || 0);
    const parkingSal = emp.parkingUnlocked ? Math.max(0, emp.parkingSalary || 0) : 0;
    const hasLand2Biz = emp.land2Owned && (emp.mallUnlocked || (emp.sideLevels.logistics || 0) > 0 || (emp.sideLevels.office || 0) > 0);
    const land2Sal = hasLand2Biz ? Math.max(0, emp.land2Salary || 0) : 0;
    const hasLand3Biz = window.Land3System && window.Land3System.hasAnyLand3Business(emp.land3);
    const land3Sal = hasLand3Biz ? Math.max(0, (emp.land3 && emp.land3.land3Salary) || 0) : 0;
    return {
      stationSal,
      parkingSal,
      land2Sal,
      land3Sal,
      total: stationSal + parkingSal + land2Sal + land3Sal
    };
  }

  function calcDailyRent(emp) {
    return PROPERTIES.reduce((sum, p) => sum + (emp.properties[p.key] ? p.dailyRent : 0), 0);
  }

  function calcPrestige(emp) {
    let p = 0;
    ELECTRONICS.forEach((e) => { if (emp.electronics[e.key]) p += e.prestige; });
    PROPERTIES.forEach((pr) => { if (emp.properties[pr.key]) p += pr.prestige; });
    GALLERY_CARS.forEach((c) => { if (emp.cars[c.key]) p += c.prestige; });
    if (emp.mallUnlocked) p += getMallCounts(emp).rented * 6;
    if (emp.parkingUnlocked) p += emp.parkingCapLvl * 4;
    return p;
  }

  function calcPortfolioValue(emp) {
    let v = 0;
    INITIAL_STOCKS.forEach((s) => {
      const st = emp.stocks[s.sym];
      if (st && st.shares > 0) v += st.shares * st.price;
    });
    return Math.round(v);
  }

  function calcTotalPersonalWealth(emp) {
    let assets = emp.personalCash + calcPortfolioValue(emp);
    ELECTRONICS.forEach((e) => { if (emp.electronics[e.key]) assets += e.price; });
    PROPERTIES.forEach((pr) => { if (emp.properties[pr.key]) assets += pr.price; });
    GALLERY_CARS.forEach((c) => { if (emp.cars[c.key]) assets += c.price; });
    return Math.round(assets);
  }

  function addManagerLog(emp, text) {
    emp.managerLogs.unshift(text);
    if (emp.managerLogs.length > 14) emp.managerLogs.pop();
  }

  // =========================================================================
  // CANLI YAN ARAZİ SİMÜLASYONU (OTOPARK ARAÇLARI, BARİYERLER, AVM KİRALARI)
  // =========================================================================
  const LOT_COLORS = ["#ef4444", "#2563eb", "#f59e0b", "#10b981", "#e2e8f0", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
  const LOT_SHAPES = ["sedan", "suv", "sport", "ev"];

  let lotBgHighwayCars = [];
  let parkingCars = []; // { state: 'entering'|'parked'|'exiting', bayIdx, isDeck, x, y, angle, color, shape, timer, waypoints }
  let lotShoppers = [];
  let land2Floats = [];
  let entryGateTimer = 0;
  let exitGateTimer = 0;
  let parkSpawnTimer = 1.1;
  let mallRentProgress = 0;
  const sideProgress = { logistics: 0, office: 0 };
  let stockTickTimer = 9;
  let socialCooldown = 0;
  let activeLand2ModalMode = "mall"; // "parking" | "mall" | "logistics" | "office"
  let cachedHelpers = null;

  function getCurrentParkedCount() {
    return parkingCars.filter((c) => c.state === "entering" || c.state === "parked").length;
  }

  function stepWaypoints(car, dt) {
    if (!car.waypoints || car.waypoints.length === 0) return true;
    const wp = car.waypoints[0];
    const dx = wp.x - car.x;
    const dy = wp.y - car.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      const targetAngle = Math.atan2(dx, -dy);
      let diff = targetAngle - car.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      car.angle += diff * Math.min(1, 11 * dt);
    }
    const spd = wp.speed || 105;
    if (dist <= spd * dt) {
      car.x = wp.x;
      car.y = wp.y;
      if (wp.finalAngle !== undefined) car.angle = wp.finalAngle;
      car.waypoints.shift();
      return car.waypoints.length === 0;
    }
    car.x += (dx / dist) * spd * dt;
    car.y += (dy / dist) * spd * dt;
    return false;
  }

  function spawnParkingCar(emp) {
    const maxCap = getMaxParkingCap(emp);
    if (getCurrentParkedCount() >= maxCap) return;

    // Önce görsel 20 slottan boş olanı bul; 20 slot doluysa üst kat/arka kapasiteye al
    const usedBays = new Set(parkingCars.filter((c) => c.bayIdx >= 0 && c.state !== "exiting").map((c) => c.bayIdx));
    const freeBays = PARKING_BAYS.filter((b) => !usedBays.has(b.idx));

    let bayIdx = -1;
    let targetX = 240;
    let targetY = 192;
    let finalAngle = Math.PI / 2;

    if (freeBays.length > 0) {
      const chosen = freeBays[Math.floor(Math.random() * freeBays.length)];
      bayIdx = chosen.idx;
      targetX = chosen.x;
      targetY = chosen.y;
      finalAngle = chosen.row === 0 ? 0 : Math.PI;
    } else {
      // 21..150 arası kapasitede katlı otopark platformuna park eder
      targetX = 140 + Math.random() * 200;
      targetY = 192;
    }

    const shape = emp.parkingValet && Math.random() < 0.55
      ? (Math.random() < 0.5 ? "sport" : "ev")
      : LOT_SHAPES[Math.floor(Math.random() * LOT_SHAPES.length)];

    parkingCars.push({
      x: -36,
      y: 58,
      angle: Math.PI / 2,
      color: LOT_COLORS[Math.floor(Math.random() * LOT_COLORS.length)],
      shape,
      bayIdx,
      isDeck: bayIdx === -1,
      state: "entering",
      timer: 8.5 + Math.random() * 7.5,
      waypoints: [
        { x: 98, y: 58, speed: 125 },
        { x: 98, y: 105, speed: 95 },
        { x: 98, y: 193, speed: 98 },
        { x: targetX, y: 193, speed: 102 },
        ...(bayIdx >= 0 ? [{ x: targetX, y: targetY, speed: 78, finalAngle }] : [])
      ]
    });
  }

  function updateEmpire(dt, data, callbacks) {
    const emp = data.empire;

    // Eski v12 kaydından iade varsa bir kez kasaya aktar
    if (emp.pendingRefund && emp.pendingRefund > 0) {
      data.cash += emp.pendingRefund;
      emp.pendingRefund = 0;
    }

    if (socialCooldown > 0) socialCooldown = Math.max(0, socialCooldown - dt);
    if (entryGateTimer > 0) entryGateTimer = Math.max(0, entryGateTimer - dt);
    if (exitGateTimer > 0) exitGateTimer = Math.max(0, exitGateTimer - dt);

    // 1. Borsa Canlı Fiyat Hareketi
    stockTickTimer -= dt;
    if (stockTickTimer <= 0) {
      stockTickTimer = 9 + Math.random() * 4;
      emp.stockNews = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
      INITIAL_STOCKS.forEach((s) => {
        const st = emp.stocks[s.sym];
        st.prev = st.price;
        let drift = (Math.random() - 0.48) * 2 * s.vol;
        if (emp.stockNews.includes(s.sym)) drift += 0.05;
        st.price = Math.max(20, Math.round(st.price * (1 + drift)));
      });
      if (callbacks.onStockTick) callbacks.onStockTick();
    }

    // Otoyol üst şerit arka plan trafiği (Yan Arazi)
    if (window.Land3System) {
      window.Land3System.updateLand3(dt, data, callbacks.onLand2Earn);
    }
    if (Math.random() < dt * 0.8 && lotBgHighwayCars.length < 4) {
      lotBgHighwayCars.push({
        x: 520,
        y: 23,
        speed: 105 + Math.random() * 30,
        color: LOT_COLORS[Math.floor(Math.random() * LOT_COLORS.length)]
      });
    }
    lotBgHighwayCars.forEach((hc) => (hc.x -= hc.speed * dt));
    lotBgHighwayCars = lotBgHighwayCars.filter((hc) => hc.x > -60);

    if (!emp.land2Owned) return;

    // 2. ÜCRETLİ OTOPARK SİMÜLASYONU (Hangi sekmede olursan ol çalışır!)
    if (emp.parkingUnlocked) {
      parkSpawnTimer -= dt;
      if (parkSpawnTimer <= 0) {
        spawnParkingCar(emp);
        const mallBoost = emp.mallUnlocked ? 0.78 : 1.0;
        const valetBoost = emp.parkingValet ? 0.75 : 1.0;
        parkSpawnTimer = Math.max(0.75, 2.2 * mallBoost * valetBoost);
      }

      parkingCars.forEach((car) => {
        if (car.state === "entering") {
          if (Math.abs(car.x - 98) < 18 && Math.abs(car.y - 102) < 24) entryGateTimer = 0.9;
          if (stepWaypoints(car, dt)) {
            car.state = "parked";
            // Araçtan inip AVM veya kulelere yürüyen müşteri!
            if (lotShoppers.length < 12 && (emp.mallUnlocked || (emp.sideLevels.logistics || 0) > 0 || (emp.sideLevels.office || 0) > 0)) {
              const goMall = emp.mallUnlocked || Math.random() < 0.75;
              lotShoppers.push({
                x: car.x,
                y: Math.max(255, car.y + 18),
                tx: goMall ? 174 + (Math.random() - 0.5) * 34 : 368,
                ty: goMall ? 332 : 385,
                shirt: LOT_COLORS[Math.floor(Math.random() * LOT_COLORS.length)],
                hair: "#18181b",
                icon: ["🛍️", "☕", "🍔", "🎬", "📱"][Math.floor(Math.random() * 5)],
                phase: Math.random() * 6,
                stay: 1.8,
                leaving: false
              });
            }
          }
        } else if (car.state === "parked") {
          car.timer -= dt;
          if (car.timer <= 0) {
            car.state = "exiting";
            car.waypoints = [
              { x: car.x, y: 193, speed: 82 },
              { x: 404, y: 193, speed: 108 },
              { x: 404, y: 98, speed: 98 },
              { x: 412, y: 58, speed: 112 },
              { x: 535, y: 58, speed: 138 }
            ];
          }
        } else if (car.state === "exiting") {
          if (!car.paid && Math.abs(car.x - 404) < 20 && car.y < 122) {
            car.paid = true;
            exitGateTimer = 0.95;
            const fee = getParkingFee(emp);
            data.cash += fee;
            if (data.daily) {
              data.daily.parkingIncome = (data.daily.parkingIncome || 0) + fee;
              data.daily.parkingCount = (data.daily.parkingCount || 0) + 1;
            }

            // Otoparktan Şahsi Maaş seçiliyse canlı maaş avansı da şahsi cüzdana damlar!
            let personalCut = 0;
            if (emp.parkingSalary > 0) {
              personalCut = Math.max(2, Math.round(emp.parkingSalary * 0.014));
              emp.personalCash += personalCut;
            }

            land2Floats.push({
              x: 392,
              y: 94,
              text: personalCut > 0 ? `🅿️ +${fee}₺ (💳+${personalCut}₺)` : `🅿️ +${fee} ₺`,
              color: "#38bdf8",
              life: 1.45
            });
            if (callbacks.onLand2Earn) callbacks.onLand2Earn(fee);
          }
          if (stepWaypoints(car, dt)) {
            car.remove = true;
          }
        }
      });
      parkingCars = parkingCars.filter((c) => !c.remove);
    }

    // 3. OTOYOL AVM KİRA DÖNGÜSÜ (Kiraya verilmiş dükkanların toplam kirası!)
    if (emp.mallUnlocked) {
      const totalRent = getMallTotalCycleRent(emp);
      if (totalRent > 0) {
        mallRentProgress += dt / 7.5;
        if (mallRentProgress >= 1) {
          mallRentProgress -= 1;
          data.cash += totalRent;
          if (data.daily) {
            data.daily.mallIncome = (data.daily.mallIncome || 0) + totalRent;
            data.daily.land2Income = (data.daily.land2Income || 0) + totalRent;
            if (!data.daily.mallShopIncomes) data.daily.mallShopIncomes = {};
            MALL_SHOPS.forEach((sh) => {
              const r = getShopCycleRent(sh, emp.mallShops[sh.key], emp);
              if (r > 0) data.daily.mallShopIncomes[sh.key] = (data.daily.mallShopIncomes[sh.key] || 0) + r;
            });
          }

          let personalBonus = 0;
          if (emp.land2Salary > 0) {
            personalBonus = Math.max(4, Math.round(emp.land2Salary * 0.02));
            emp.personalCash += personalBonus;
          }

          land2Floats.push({
            x: MALL_BOX.x + MALL_BOX.w / 2,
            y: MALL_BOX.y + 30,
            text: personalBonus > 0 ? `🏬 Kira +${totalRent}₺ (💳+${personalBonus}₺)` : `🏬 AVM Kira +${totalRent} ₺`,
            color: "#4ade80",
            life: 1.65
          });
          if (callbacks.onLand2Earn) callbacks.onLand2Earn(totalRent);
        }
      }
    }

    // 4. Sağ Kanat Lojistik & Plaza Kulesi Döngüsü
    SIDE_TOWERS.forEach((tw) => {
      const lvl = emp.sideLevels[tw.key] || 0;
      if (lvl > 0) {
        sideProgress[tw.key] += dt / tw.cycleSec;
        if (sideProgress[tw.key] >= 1) {
          sideProgress[tw.key] -= 1;
          const inc = calcSideTowerIncome(tw, lvl);
          data.cash += inc;
          if (data.daily) {
            data.daily.land2Income = (data.daily.land2Income || 0) + inc;
            if (tw.key === "logistics") data.daily.logisticsIncome = (data.daily.logisticsIncome || 0) + inc;
            if (tw.key === "office") data.daily.officeIncome = (data.daily.officeIncome || 0) + inc;
          }
          land2Floats.push({
            x: tw.x + tw.w / 2,
            y: tw.y + 24,
            text: `${tw.emoji} +${inc} ₺`,
            color: "#fde047",
            life: 1.5
          });
          if (callbacks.onLand2Earn) callbacks.onLand2Earn(inc);
        }
      }
    });

    // Yürüyen Müşteri Karakterleri
    lotShoppers.forEach((v) => {
      v.phase += dt * 7;
      const dx = v.tx - v.x;
      const dy = v.ty - v.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        v.x += (dx / dist) * 56 * dt;
        v.y += (dy / dist) * 56 * dt;
      } else if (!v.leaving) {
        v.stay -= dt;
        if (v.stay <= 0) {
          v.leaving = true;
          v.tx = 100 + Math.random() * 260;
          v.ty = 262;
        }
      } else {
        v.done = true;
      }
    });
    lotShoppers = lotShoppers.filter((v) => !v.done);

    land2Floats.forEach((f) => {
      f.y -= 24 * dt;
      f.life -= dt;
    });
    land2Floats = land2Floats.filter((f) => f.life > 0);
  }

  // =========================================================================
  // GELİŞMİŞ 2.5D YAN ARAZİ ÇİZİM MOTORU (OTOPARK + HAVUZLU BULVAR + DEV AVM)
  // =========================================================================
  function drawGateBooth(ctx, MR, x, y, label, isOpen, accentColor) {
    // Gişe Kulübesi 2.5D
    MR.rr(ctx, x - 20, y - 10, 40, 22, 5, "rgba(0,0,0,0.45)", null);
    MR.rr(ctx, x - 21, y - 12, 42, 20, 5, "#1e293b", accentColor, 1.6);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 7.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 1);

    // Hareketli Kırmızı-Beyaz Bariyer Kolu!
    ctx.save();
    ctx.translate(x + 16, y + 4);
    ctx.rotate(isOpen ? -Math.PI * 0.38 : 0);
    MR.rr(ctx, 0, -2, 24, 4.5, 2, "#ef4444", "#090d1a", 1);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(6, -1.5, 5, 3.5);
    ctx.fillRect(15, -1.5, 5, 3.5);
    ctx.restore();
  }

  function drawParkingArea(ctx, MR, emp, phase) {
    const { x, y, w, h } = PARKING_BOX;

    if (!emp.parkingUnlocked) {
      ctx.save();
      ctx.setLineDash([7, 5]);
      MR.rr(ctx, x, y, w, h, 14, "rgba(15, 23, 42, 0.82)", "#38bdf8", 2.2);
      ctx.setLineDash([]);
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "900 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🅿️ ÜCRETLİ OTOPARK İNŞA ET (20 ARAÇLIK)", x + w / 2, y + 54);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 11px sans-serif";
      ctx.fillText("Gişeli bariyer sistemi • 20 araçtan 150 araca büyütülebilir!", x + w / 2, y + 78);
      ctx.fillText("Otopark gelirinden şahsi maaş bağlayabilirsin!", x + w / 2, y + 96);

      MR.rr(ctx, x + w / 2 - 88, y + 112, 176, 36, 10, "#0284c7", "#fef08a", 1.8);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 12.5px sans-serif";
      ctx.fillText(`İNŞA ET — ${PARKING_UNLOCK_COST} ₺`, x + w / 2, y + 134);
      ctx.restore();
      return;
    }

    // 1. Otopark Asfalt Tabanı & Çevre Bordürü
    MR.rr(ctx, x, y, w, h, 12, "rgba(17, 24, 39, 0.88)", "#475569", 2);

    // Orta Sürüş Koridoru Yön Okları
    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("➔        ➔        OTOPARK KORİDORU        ➔        ➔", x + w / 2, 197);

    // 2. 20 Görsel Park Yeri Çizgileri + Numaralar
    PARKING_BAYS.forEach((bay) => {
      const topY = bay.row === 0 ? bay.y - 20 : bay.y - 18;
      ctx.strokeStyle = emp.parkingValet ? "rgba(56, 189, 248, 0.55)" : "rgba(226, 232, 240, 0.42)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bay.x - 14, topY, 28, 38);

      // Tekerlek stoperi
      ctx.fillStyle = "#facc15";
      ctx.fillRect(bay.x - 8, bay.row === 0 ? topY + 2 : topY + 34, 16, 2.2);
    });

    // 3. Giriş & Çıkış Gişeleri + Hareketli Bariyerler
    drawGateBooth(ctx, MR, 74, 98, "⬇ GİRİŞ", entryGateTimer > 0, "#22c55e");
    drawGateBooth(ctx, MR, 378, 98, "⬆ ÖDEME", exitGateTimer > 0, "#f59e0b");

    // 4. Katlı Otopark Çelik Kanopisi (Kapasite Sv.2+ ise üst sundurma görünür!)
    if (emp.parkingCapLvl >= 2) {
      MR.rr(ctx, x + 8, y + 3, w - 16, 12, 4, "rgba(30, 58, 138, 0.72)", "#38bdf8", 1.2);
      ctx.fillStyle = "#bae6fd";
      ctx.font = "900 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`★ KATLI AKILLI OTOPARK SİSTEMİ Sv.${emp.parkingCapLvl} ${emp.parkingValet ? "• VIP VALE AKTİF" : ""} ★`, x + w / 2, y + 11.5);
    }

    // 5. Otoparktaki Gerçek 3D Araçlar (Girenler, Park Edenler, Çıkanlar)
    parkingCars.forEach((car) => {
      if (car.isDeck && car.state === "parked") return; // 21+ üst kat araçları dijital sayaçta görünür
      MR.drawDetailedVehicle(ctx, car.x, car.y, car.color, car.shape, car.angle, {
        nightIntensity: phase.night * (car.state === "parked" ? 0.15 : 0.85)
      });
    });

    // 6. Üst Dijital Doluluk & Ücret Tabelası (Dokununca Otopark Yönetimi Açılır)
    const count = getCurrentParkedCount();
    const maxCap = getMaxParkingCap(emp);
    const fee = getParkingFee(emp);
    const isFull = count >= maxCap;

    MR.rr(ctx, 118, 82, 224, 24, 7, "rgba(9, 13, 26, 0.94)", isFull ? "#ef4444" : "#38bdf8", 1.8);
    ctx.fillStyle = isFull ? "#fca5a5" : "#fde047";
    ctx.font = "900 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `🅿️ OTOPARK: ${count}/${maxCap} Araç ${isFull ? "(DOLU!)" : ""} • +${fee}₺ • Yönet`,
      230,
      97.5
    );
  }

  function drawPromenadeAndPlaza(ctx, MR, phase) {
    // Sıcak Taş Yaya Bulvarı & Meydan Zemini (y: 284..592)
    MR.rr(ctx, 44, 284, 392, 310, 14, "#1e2638", "#475569", 1.8);

    // Yaya Geçidi Şeritleri (Otoparktan Bulvara)
    ctx.fillStyle = "rgba(248, 250, 252, 0.6)";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(156 + i * 9, 282, 5, 12);
      ctx.fillRect(348 + i * 9, 282, 5, 12);
    }

    // Orta Turkuaz Fıskiyeli Süs Havuzu (Canlı Dalgalı!)
    const fx = 240;
    const fy = 303;
    MR.rr(ctx, fx - 44, fy - 12, 88, 24, 12, "#0f172a", "#94a3b8", 2);
    MR.rr(ctx, fx - 40, fy - 9, 80, 18, 9, "#0284c7", "#38bdf8", 1.2);
    const ripple = (Date.now() % 1400) / 1400;
    ctx.strokeStyle = `rgba(224, 242, 254, ${(1 - ripple) * 0.8})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(fx, fy, 8 + ripple * 24, 3 + ripple * 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Yan Süs Çamları & Sokak Lambaları
    MR.drawStreetLamp(ctx, 64, 294, phase.night, false);
    MR.drawStreetLamp(ctx, 416, 294, phase.night, false);
  }

  function drawGrandMall(ctx, MR, emp) {
    const { x, y, w, h } = MALL_BOX;

    if (!emp.mallUnlocked) {
      ctx.save();
      ctx.setLineDash([7, 5]);
      MR.rr(ctx, x, y, w, h, 16, "rgba(15, 23, 42, 0.86)", "#f59e0b", 2.4);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🏬 OTOYOL AVM İNŞA ET", x + w / 2, y + 68);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 11px sans-serif";
      ctx.fillText("Dev Alışveriş & Yaşam Merkezi!", x + w / 2, y + 96);
      ctx.fillText("İçinde 8 bağımsız dükkan tapusu bulunur:", x + w / 2, y + 118);
      ctx.fillStyle = "#93c5fd";
      ctx.fillText("☕ Kahve • 🍔 Burger • 🛒 Market • 👗 Giyim", x + w / 2, y + 140);
      ctx.fillText("📱 Teknoloji • 🎮 Oyun • 💎 Kuyumcu • 🎬 Sinema", x + w / 2, y + 158);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Dükkanları tek tek satın alıp kiraya ver!", x + w / 2, y + 182);

      MR.rr(ctx, x + 36, y + 202, w - 72, 42, 11, "#d97706", "#fef08a", 2);
      ctx.fillStyle = "#090d1a";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`AVM İNŞA ET — ${MALL_UNLOCK_COST} ₺`, x + w / 2, y + 228);
      ctx.restore();
      return;
    }

    const counts = getMallCounts(emp);
    const cycleRent = getMallTotalCycleRent(emp);

    // 1. 3D Derin Bina Gölgesi
    MR.rr(ctx, x + 6, y + 8, w, h, 16, "rgba(0, 0, 0, 0.55)", null);

    // 2. AVM Ana Gövde (Modern Mermer/Antrasit Cephe)
    MR.rr(ctx, x, y + 16, w, h - 16, 14, "#1e293b", "#090d1a", 2.5);
    // Üst Kademeli Çatı Katmanı
    MR.rr(ctx, x - 3, y, w + 6, 36, 12, "#0f172a", "#f59e0b", 2.2);

    // Giriş Kırmızı Halı & Cam Döner Kapı Kanopisi (Üst Orta: x + w/2)
    const doorX = x + w / 2;
    MR.rr(ctx, doorX - 28, y - 6, 56, 14, 4, "#991b1b", "#fde047", 1.5);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 7.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AVM GİRİŞ", doorX, y + 3.5);

    // AVM Ana Neon Tabelası
    MR.rr(ctx, x + 16, y + 10, w - 32, 22, 6, "#7c2d12", "#fde047", 1.8);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 11.5px sans-serif";
    ctx.fillText("🏬 OTOYOL GRAND AVM", x + w / 2, y + 25);

    // 3. Merkez Parlak Turkuaz Cam Atrium Kubbesi (Skylight Roof!)
    const skyGrad = ctx.createLinearGradient(x + 36, y + 42, x + w - 36, y + 102);
    skyGrad.addColorStop(0, "#0369a1");
    skyGrad.addColorStop(0.5, "#38bdf8");
    skyGrad.addColorStop(1, "#0c4a6e");
    MR.rr(ctx, x + 26, y + 40, w - 52, 56, 12, skyGrad, "#bae6fd", 1.8);

    // Cam kubbe çelik kayıt çizgileri
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= 4; i++) {
      const gx = x + 26 + ((w - 52) / 5) * i;
      ctx.beginPath();
      ctx.moveTo(gx, y + 41);
      ctx.lineTo(gx, y + 95);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x + 27, y + 68);
    ctx.lineTo(x + w - 27, y + 68);
    ctx.stroke();

    // Çatı Klima Üniteleri
    MR.rr(ctx, x + 8, y + 48, 12, 36, 3, "#475569", "#0f172a", 1.2);
    MR.rr(ctx, x + w - 20, y + 48, 12, 36, 3, "#475569", "#0f172a", 1.2);

    // 4. 8 DÜKKAN VİTRİN PANOSU (4x2 Izgara: Satılık / Boş / Kirada Canlı Görünür!)
    const gridStartX = x + 14;
    const gridStartY = y + 106;
    const cellW = 53;
    const cellH = 44;

    MALL_SHOPS.forEach((shop, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const cx = gridStartX + col * (cellW + 4);
      const cy = gridStartY + row * (cellH + 6);
      const st = emp.mallShops[shop.key];

      const bg = st.rented ? "rgba(20, 83, 45, 0.92)" : st.owned ? "rgba(120, 53, 15, 0.9)" : "rgba(15, 23, 42, 0.88)";
      const brd = st.rented ? "#4ade80" : st.owned ? "#f59e0b" : "#475569";
      MR.rr(ctx, cx, cy, cellW, cellH, 7, bg, brd, 1.5);

      ctx.font = "15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(shop.emoji, cx + cellW / 2, cy + 20);

      ctx.font = "900 7.5px sans-serif";
      ctx.fillStyle = st.rented ? "#86efac" : st.owned ? "#fde047" : "#94a3b8";
      ctx.fillText(st.rented ? `KİRADA` : st.owned ? `BOŞ (BİZİM)` : `SATILIK`, cx + cellW / 2, cy + 36);
    });

    // 5. Alt Kira İlerleme Çubuğu & Yönetim Butonu
    MR.rr(ctx, x + 14, y + 210, w - 28, 11, 5, "#090d1a", "#22c55e", 1.2);
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(x + 16, y + 212, (w - 32) * Math.min(1, mallRentProgress), 7);

    MR.rr(ctx, x + 14, y + 227, w - 28, 27, 8, "#0284c7", "#fef08a", 1.6);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      cycleRent > 0
        ? `🔑 Kirada: ${counts.rented}/8 (+${cycleRent}₺) • Dükkanları Yönet`
        : `🔑 Tapulu: ${counts.owned}/8 • Dokun Dükkan Al & Kirala!`,
      x + w / 2,
      y + 244
    );
  }

  function drawSideTower(ctx, MR, tw, lvl) {
    const { x, y, w, h } = tw;
    const isOffice = tw.key === "office";

    if (lvl === 0) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      MR.rr(ctx, x, y, w, h, 12, "rgba(15, 23, 42, 0.84)", isOffice ? "#facc15" : "#34d399", 2);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fde68a";
      ctx.font = "900 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔒 ${tw.short}`, x + w / 2, y + 38);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`${tw.cost} ₺`, x + w / 2, y + 62);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 9px sans-serif";
      ctx.fillText(`+${tw.baseIncome} ₺ / döngü`, x + w / 2, y + 84);
      ctx.fillText("(Dokun Kur)", x + w / 2, y + 102);
      ctx.restore();
      return;
    }

    // 3D Gölge
    MR.rr(ctx, x + 5, y + 6, w, h, 12, "rgba(0,0,0,0.5)", null);

    if (isOffice) {
      // Mavi Cam Gökdelen Plaza + Helikopter Pisti (H)
      MR.rr(ctx, x, y + 14, w, h - 14, 11, "#0f172a", "#38bdf8", 2);
      MR.rr(ctx, x + 4, y, w - 8, 24, 8, "#1e3a8a", "#facc15", 1.8);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 9.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🏢 PLAZA ★${lvl}`, x + w / 2, y + 15.5);

      // Işıklı Ofis Pencereleri + Helipad
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          MR.rr(ctx, x + 12 + c * 17, y + 34 + r * 18, 12, 12, 2, "#38bdf8", null);
        }
      }
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + w - 24, y + 50, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.font = "900 10px sans-serif";
      ctx.fillText("H", x + w - 24, y + 53.5);
    } else {
      // Modern Lojistik Deposu + Sarı Yükleme Rampaları
      MR.rr(ctx, x, y + 14, w, h - 14, 11, "#064e3b", "#34d399", 2);
      MR.rr(ctx, x + 2, y, w - 4, 24, 8, "#022c22", "#34d399", 1.8);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "900 9.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`📦 LOJİSTİK ★${lvl}`, x + w / 2, y + 15.5);

      for (let d = 0; d < 3; d++) {
        MR.rr(ctx, x + 12 + d * 36, y + 34, 28, 30, 4, "#1e293b", "#facc15", 1.4);
      }
    }

    const inc = calcSideTowerIncome(tw, lvl);
    const pct = Math.min(1, sideProgress[tw.key] || 0);
    MR.rr(ctx, x + 10, y + 76, w - 20, 9, 4, "#090d1a", "#4ade80", 1);
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(x + 12, y + 78, (w - 24) * pct, 5);

    ctx.fillStyle = "#fef08a";
    ctx.font = "900 10.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`+${inc} ₺`, x + w / 2, y + 101);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "800 8.5px sans-serif";
    ctx.fillText(lvl >= 6 ? "MAKS ★" : `Büyüt: ${calcSideTowerUpgradeCost(tw, lvl)}₺`, x + w / 2, y + 116);
  }

  function renderLand2(ctx, W, H, phase, data, MR) {
    const emp = data.empire;
    if (baseLotReady) {
      ctx.drawImage(baseLotImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#162030";
      ctx.fillRect(0, 0, W, H);
    }

    // Otoyol üst şeritte akan araçlar
    lotBgHighwayCars.forEach((hc) => {
      MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", -Math.PI / 2, { nightIntensity: phase.night });
    });

    // Otoyol Giriş Kemeri Tabelası
    MR.drawHighwayBillboard(ctx, 255, 76, false);

    if (!emp.land2Owned) {
      MR.rr(ctx, 54, 150, W - 108, 280, 18, "rgba(15, 23, 42, 0.92)", "#f59e0b", 2.5);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏗️ YAN ARAZİ TAPUSUNU AL!", W / 2, 196);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 12.5px sans-serif";
      ctx.fillText("İstasyonun hemen yanındaki dev ticari arsa:", W / 2, 228);
      ctx.fillStyle = "#7dd3fc";
      ctx.fillText("🅿️ 20->150 Araçlık Ücretli Otopark (Bariyerli)", W / 2, 254);
      ctx.fillStyle = "#fde68a";
      ctx.fillText("🏬 Otoyol Grand AVM (8 Satılık & Kiralık Dükkan)", W / 2, 278);
      ctx.fillStyle = "#a7f3d0";
      ctx.fillText("📦 Lojistik Merkezi & 🏢 Plaza Gökdelen Kulesi", W / 2, 302);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("💼 Otopark ve AVM'den kendine ek şahsi maaş bağla!", W / 2, 328);

      const canAfford = data.cash >= LAND2_COST;
      MR.rr(ctx, 92, 354, W - 184, 50, 12, canAfford ? "#16a34a" : "#475569", "#fef08a", 2.2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px sans-serif";
      ctx.fillText(`TAPUYU SATIN AL — ${LAND2_COST} ₺`, W / 2, 384);
      return;
    }

    // 1. Orta & Alt Yaya Bulvarı + Süs Havuzu
    drawPromenadeAndPlaza(ctx, MR, phase);

    // 2. Üst Saha: Ücretli Otopark + Bariyerler + Park Eden Araçlar
    drawParkingArea(ctx, MR, emp, phase);

    // 3. Sol-Orta Dev Yapı: Otoyol Grand AVM (Cam Kubbeli & 8 Vitrinli)
    drawGrandMall(ctx, MR, emp);

    // 4. Sağ Kanat Kuleler: Lojistik & Plaza
    SIDE_TOWERS.forEach((tw) => {
      drawSideTower(ctx, MR, tw, emp.sideLevels[tw.key] || 0);
    });

    // 5. Yürüyen Ziyaretçiler
    lotShoppers.forEach((v) => {
      MR.drawCustomerCharacter(ctx, v.x, v.y, v.shirt, v.hair, v.leaving ? "" : v.icon, v.phase);
    });

    // 6. Uçan Gelir Yazıları
    land2Floats.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.font = "900 13.5px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#050811";
      ctx.lineWidth = 3.5;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = phase.tint;
    ctx.fillRect(0, 0, W, H);
  }

  // =========================================================================
  // OTOPARK & AVM DÜKKAN SATIN ALMA / KİRAYA VERME MODALI (#land2Modal)
  // =========================================================================
  function openLand2Modal(mode, data, helpers) {
    activeLand2ModalMode = mode;
    cachedHelpers = helpers;
    renderLand2Modal(data, helpers);
    const modal = document.getElementById("land2Modal");
    if (modal) modal.classList.remove("hidden");
  }

  function renderLand2Modal(data, helpers) {
    const emp = data.empire;
    const titleEl = document.getElementById("land2ModalTitle");
    const cashEl = document.getElementById("land2CompanyCash");
    const body = document.getElementById("land2ModalBody");
    if (!body || !titleEl) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash);

    // 1. ÜCRETLİ OTOPARK YÖNETİM VE BÜYÜTME EKRANI
    if (activeLand2ModalMode === "parking") {
      titleEl.textContent = "🅿️ Ücretli Otopark Yönetimi";
      const count = getCurrentParkedCount();
      const maxCap = getMaxParkingCap(emp);
      const fee = getParkingFee(emp);
      const nextCap = emp.parkingCapLvl < 6 ? PARKING_CAPS[emp.parkingCapLvl] : maxCap;
      const capCost = emp.parkingCapLvl < 6 ? PARKING_CAP_COSTS[emp.parkingCapLvl] : 0;
      const feeCost = emp.parkingFeeLvl < 6 ? PARKING_FEE_COSTS[emp.parkingFeeLvl] : 0;

      body.innerHTML = `
        <div class="mall-summary-bar">
          <div class="mall-stat-pill">
            <span class="lbl">🚗 ANLIK DOLULUK</span>
            <span class="val">${count} / ${maxCap} Araç</span>
          </div>
          <div class="mall-stat-pill">
            <span class="lbl">🎫 ARAÇ BAŞI ÜCRET</span>
            <span class="val" style="color:#4ade80;">+${fee} ₺</span>
          </div>
          <div class="mall-stat-pill">
            <span class="lbl">💼 ŞAHSİ MAAŞ PAYI</span>
            <span class="val" style="color:#38bdf8;">${emp.parkingSalary} ₺/gün</span>
          </div>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>🚗 Otopark Kapasitesini Büyüt (Sv.${emp.parkingCapLvl}/6)</h3>
            <p>${emp.parkingCapLvl >= 6 ? `Maksimum kapasiteye ulaştın (${maxCap} araç)!` : `Kapasiteyi <strong>${maxCap} araçtan ➔ ${nextCap} araca</strong> çıkarır! Daha çok araç aynı anda park eder.`}</p>
          </div>
          <button id="btnUpParkCap" class="up-buy-btn" ${emp.parkingCapLvl >= 6 ? "disabled" : ""}>
            ${emp.parkingCapLvl >= 6 ? "MAKS ✓" : `${capCost} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>🎫 Saatlik Tarife &amp; Hızlı Gişe (Sv.${emp.parkingFeeLvl}/6)</h3>
            <p>${emp.parkingFeeLvl >= 6 ? "En yüksek tarife aktif!" : `Çıkış gişesinde alınan otopark ücretini artırır (Şu an: +${fee} ₺/araç).`}</p>
          </div>
          <button id="btnUpParkFee" class="up-buy-btn" ${emp.parkingFeeLvl >= 6 ? "disabled" : ""}>
            ${emp.parkingFeeLvl >= 6 ? "MAKS ✓" : `${feeCost} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>⚡ VIP Vale &amp; Plaka Tanıma Sistemi</h3>
            <p>Otoparka gelen lüks spor/SUV araç oranını artırır, tüm otopark gelirlerine kalıcı <strong>+%25</strong> ekler!</p>
          </div>
          <button id="btnBuyValet" class="up-buy-btn" ${emp.parkingValet ? "disabled" : ""}>
            ${emp.parkingValet ? "AKTİF ✓" : `${PARKING_VALET_COST} ₺`}
          </button>
        </div>

        <div class="rep-section" style="border-color:#22c55e; margin-top:6px;">
          <h4>💳 OTOPARKTAN ŞAHSİ MAAŞINI SEÇ</h4>
          <p style="font-size:12px; color:#cbd5e1; margin-bottom:6px;">Otopark gelirinden hem her araç çıkışında canlı avans hem de gün sonunda maaş yatar!</p>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${[0, 100, 250, 500, 900, 1500]
              .map((amt) => `<button class="sal-btn park-sal-quick ${emp.parkingSalary === amt ? "active" : ""}" data-amt="${amt}">${amt} ₺</button>`)
              .join("")}
          </div>
        </div>
      `;

      const capBtn = document.getElementById("btnUpParkCap");
      if (capBtn && emp.parkingCapLvl < 6) {
        capBtn.addEventListener("click", () => {
          if (data.cash < capCost) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Kapasite büyütmek için ${capCost} ₺ gerekli!`);
          }
          data.cash -= capCost;
          emp.parkingCapLvl += 1;
          helpers.sfx.perfectHit();
          helpers.showToast(`🚗 Otopark kapasitesi ${ getMaxParkingCap(emp) } araca yükseltildi!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderLand2Modal(data, helpers);
        });
      }

      const feeBtn = document.getElementById("btnUpParkFee");
      if (feeBtn && emp.parkingFeeLvl < 6) {
        feeBtn.addEventListener("click", () => {
          if (data.cash < feeCost) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Tarife yükseltmek için ${feeCost} ₺ gerekli!`);
          }
          data.cash -= feeCost;
          emp.parkingFeeLvl += 1;
          helpers.sfx.perfectHit();
          helpers.showToast(`🎫 Otopark ücreti araç başı +${getParkingFee(emp)} ₺ oldu!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderLand2Modal(data, helpers);
        });
      }

      const valetBtn = document.getElementById("btnBuyValet");
      if (valetBtn && !emp.parkingValet) {
        valetBtn.addEventListener("click", () => {
          if (data.cash < PARKING_VALET_COST) {
            helpers.sfx.burnFail();
            return helpers.showToast(`VIP Vale için ${PARKING_VALET_COST} ₺ gerekli!`);
          }
          data.cash -= PARKING_VALET_COST;
          emp.parkingValet = true;
          helpers.sfx.perfectHit();
          helpers.showToast("⚡ VIP Vale & Plaka Tanıma Sistemi kuruldu!");
          helpers.saveGame();
          helpers.updateHUD();
          renderLand2Modal(data, helpers);
        });
      }

      body.querySelectorAll(".park-sal-quick").forEach((b) => {
        b.addEventListener("click", () => {
          emp.parkingSalary = Number(b.dataset.amt);
          helpers.sfx.tap();
          helpers.saveGame();
          helpers.showToast(`🅿️ Otopark şahsi maaşın ${emp.parkingSalary} ₺/gün yapıldı!`);
          renderLand2Modal(data, helpers);
        });
      });
      return;
    }

    // 2. OTOYOL AVM — DÜKKAN TAPUSU SATIN ALMA & KİRAYA VERME EKRANI
    titleEl.textContent = "🏬 Otoyol AVM — Dükkan & Kira Yönetimi";
    const counts = getMallCounts(emp);
    const totalRent = getMallTotalCycleRent(emp);
    const parkBonusPct = Math.round(getParkingOccupancyBonus(emp) * 100);

    let html = `
      <div class="mall-summary-bar">
        <div class="mall-stat-pill">
          <span class="lbl">🔑 BİZİM DÜKKAN</span>
          <span class="val">${counts.owned} / ${counts.total}</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">✅ KİRADA OLAN</span>
          <span class="val" style="color:#4ade80;">${counts.rented} / ${counts.total}</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💰 TOPLAM KİRA</span>
          <span class="val" style="color:#4ade80;">+${totalRent} ₺</span>
        </div>
      </div>
      <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:9px;">
        AVM'deki dükkanların önce <strong>tapusunu satın al</strong>, ardından kurumsal veya ciro ortaklı markaya <strong>kiraya ver!</strong> ${emp.parkingUnlocked ? `<span style="color:#38bdf8; font-weight:800;">(🅿️ Otopark Yoğunluk Bonusu: +%${parkBonusPct})</span>` : ""}
      </p>
    `;

    MALL_SHOPS.forEach((shop) => {
      const st = emp.mallShops[shop.key];
      const cardCls = st.rented ? "rented" : st.owned ? "owned" : "";
      const tagHtml = st.rented
        ? `<span class="shop-status-tag tag-rented">✅ KİRADA (Sv.${st.lvl}/5)</span>`
        : st.owned
        ? `<span class="shop-status-tag tag-vacant">🔑 MÜLK BİZİM • BOŞ</span>`
        : `<span class="shop-status-tag tag-sale">🏷️ SATILIK DÜKKAN</span>`;

      const curRent = getShopCycleRent(shop, st, emp);
      const fixedPreview = Math.round(shop.baseRent * 1.15);
      const upCost = getMallShopUpgradeCost(shop, st.lvl);

      let actionsHtml = "";
      if (!st.owned) {
        actionsHtml = `
          <div class="shop-btn-row">
            <button class="shop-action-btn buy-deed" data-shop="${shop.key}" data-act="buy">
              🔑 Dükkan Tapusunu Satın Al — ${shop.deedCost} ₺
            </button>
          </div>
        `;
      } else if (!st.rented) {
        actionsHtml = `
          <div class="shop-btn-row">
            <button class="shop-action-btn rent-fixed" data-shop="${shop.key}" data-act="rent_fixed">
              📝 Sabit Kiracıya Ver (+${fixedPreview} ₺)
            </button>
            <button class="shop-action-btn rent-share" data-shop="${shop.key}" data-act="rent_share">
              📈 Ciro Paylı Kiraya Ver (+${shop.baseRent}₺ + Otopark Primi)
            </button>
          </div>
        `;
      } else {
        const contractName = st.contract === "share" ? "Ciro Ortaklı Marka" : "Kurumsal Sabit Kiracı";
        actionsHtml = `
          <div style="font-size:12.5px; color:#86efac; font-weight:800; margin-top:4px;">
            💼 Kiracı: ${contractName} • Düzenli Kira: <strong>+${curRent} ₺ / döngü</strong>
          </div>
          <div class="shop-btn-row">
            <button class="shop-action-btn up-rent" data-shop="${shop.key}" data-act="upgrade" ${st.lvl >= 5 ? "disabled" : ""}>
              ${st.lvl >= 5 ? "★ MAKSİMUM KİRA KONTRATI" : `⬆️ Dekor Yenile & Kirayı Artır (Sv.${st.lvl + 1} — ${upCost} ₺)`}
            </button>
          </div>
        `;
      }

      html += `
        <div class="mall-shop-card ${cardCls}">
          <div class="shop-top-row">
            <div>
              <div style="font-size:11px; color:#94a3b8; font-weight:800;">${shop.floor}</div>
              <div class="shop-title">${shop.emoji} ${shop.name}</div>
            </div>
            ${tagHtml}
          </div>
          <div style="font-size:12.5px; color:#cbd5e1;">${shop.desc}</div>
          ${actionsHtml}
        </div>
      `;
    });

    body.innerHTML = html;

    body.querySelectorAll(".shop-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.shop;
        const act = btn.dataset.act;
        const shop = MALL_SHOPS.find((s) => s.key === key);
        const st = emp.mallShops[key];
        if (!shop || !st) return;

        if (act === "buy") {
          if (data.cash < shop.deedCost) {
            helpers.sfx.burnFail();
            return helpers.showToast(`${shop.name} tapusu için ${shop.deedCost} ₺ gerekli!`);
          }
          data.cash -= shop.deedCost;
          st.owned = true;
          st.rented = false;
          helpers.sfx.perfectHit();
          helpers.showToast(`🔑 ${shop.name} tapusunu satın aldın! Şimdi kiracı seçip kiraya ver!`);
        } else if (act === "rent_fixed" || act === "rent_share") {
          st.rented = true;
          st.contract = act === "rent_share" ? "share" : "fixed";
          helpers.sfx.cashRegister();
          helpers.showToast(`📝 ${shop.name} kiraya verildi! Düzenli kira geliri başladı!`);
        } else if (act === "upgrade" && st.lvl < 5) {
          const upCost = getMallShopUpgradeCost(shop, st.lvl);
          if (data.cash < upCost) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Mağaza yenilemesi için ${upCost} ₺ gerekli!`);
          }
          data.cash -= upCost;
          st.lvl += 1;
          helpers.sfx.perfectHit();
          helpers.showToast(`⬆️ ${shop.name} kirası +${getShopCycleRent(shop, st, emp)} ₺ seviyesine yükseldi!`);
        }

        helpers.saveGame();
        helpers.updateHUD();
        renderLand2Modal(data, helpers);
      });
    });
  }

  // Haritaya Tıklama Yönetimi (Yan Arazi)
  function inRect(pt, box) {
    return pt.x >= box.x && pt.x <= box.x + box.w && pt.y >= box.y && pt.y <= box.y + box.h;
  }

  function handleLand2Click(pt, data, helpers) {
    const emp = data.empire;
    cachedHelpers = helpers;

    if (!emp.land2Owned) {
      if (pt.x > 54 && pt.x < 426 && pt.y > 150 && pt.y < 430) {
        if (data.cash >= LAND2_COST) {
          data.cash -= LAND2_COST;
          emp.land2Owned = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🎉 Yan Arazi tapusunu aldın! Ücretli Otopark ve Otoyol AVM kurabilirsin!");
          helpers.saveGame();
          helpers.updateHUD();
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`Yan Arazi tapusu için Şirket Kasasında ${LAND2_COST} ₺ gerekli!`);
        }
      }
      return;
    }

    // 1. Üst Bölge: Ücretli Otopark (Tabela dahil y: 80..280)
    if (pt.x >= 48 && pt.x <= 432 && pt.y >= 80 && pt.y <= 282) {
      if (!emp.parkingUnlocked) {
        if (data.cash >= PARKING_UNLOCK_COST) {
          data.cash -= PARKING_UNLOCK_COST;
          emp.parkingUnlocked = true;
          emp.parkingCapLvl = 1; // 20 Araç!
          helpers.sfx.perfectHit();
          helpers.showToast("🅿️ 20 Araçlık Ücretli Otopark açıldı! Tekrar dokunarak kapasiteyi büyütebilirsin!");
          helpers.saveGame();
          helpers.updateHUD();
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`Ücretli Otopark kurulumu için ${PARKING_UNLOCK_COST} ₺ gerekli!`);
        }
        return;
      }
      helpers.sfx.tap();
      openLand2Modal("parking", data, helpers);
      return;
    }

    // 2. Sol-Orta Dev Bölge: Otoyol Grand AVM
    if (inRect(pt, MALL_BOX)) {
      if (!emp.mallUnlocked) {
        if (data.cash >= MALL_UNLOCK_COST) {
          data.cash -= MALL_UNLOCK_COST;
          emp.mallUnlocked = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🏬 Otoyol AVM inşa edildi! Şimdi içindeki dükkanları satın alıp kiraya ver!");
          helpers.saveGame();
          helpers.updateHUD();
          openLand2Modal("mall", data, helpers);
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`Otoyol AVM inşası için ${MALL_UNLOCK_COST} ₺ gerekli!`);
        }
        return;
      }
      helpers.sfx.tap();
      openLand2Modal("mall", data, helpers);
      return;
    }

    // 3. Sağ Kanat Kuleler: Lojistik & Plaza
    for (const tw of SIDE_TOWERS) {
      if (inRect(pt, tw)) {
        const lvl = emp.sideLevels[tw.key] || 0;
        if (lvl >= 6) {
          helpers.showToast(`★ ${tw.name} maksimum seviyede!`);
          return;
        }
        const cost = calcSideTowerUpgradeCost(tw, lvl);
        if (data.cash >= cost) {
          data.cash -= cost;
          emp.sideLevels[tw.key] = lvl + 1;
          helpers.sfx.perfectHit();
          helpers.showToast(lvl === 0 ? `🎉 ${tw.name} açıldı!` : `⬆️ ${tw.name} Sv.${lvl + 1} oldu!`);
          helpers.saveGame();
          helpers.updateHUD();
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`${tw.name} için ${cost} ₺ gerekli!`);
        }
        return;
      }
    }
  }

  // Modal Kapatma Bağlantısı
  const closeL2Btn = document.getElementById("closeLand2ModalBtn");
  if (closeL2Btn) {
    closeL2Btn.addEventListener("click", () => {
      if (cachedHelpers && cachedHelpers.sfx) cachedHelpers.sfx.tap();
      const modal = document.getElementById("land2Modal");
      if (modal) modal.classList.add("hidden");
    });
  }

  // =========================================================================
  // ŞEHİR & ÇOK KAYNAKLI ŞAHSİ MAAŞ EKRANI (İSTASYON + OTOPARK + YAN ARAZİ/AVM)
  // =========================================================================
  let currentCityTab = "salary";

  function renderCityModal(data, helpers) {
    const emp = data.empire;
    const body = document.getElementById("cityModalBody");
    const cashEl = document.getElementById("cityPersonalCash");
    if (!body) return;
    if (cashEl) cashEl.textContent = Math.round(emp.personalCash);

    document.querySelectorAll(".city-tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === currentCityTab);
    });

    if (currentCityTab === "salary") {
      const sal = calcSalaryBreakdown(emp);
      const dailyRent = calcDailyRent(emp);
      const wealth = calcTotalPersonalWealth(emp);
      const prestige = calcPrestige(emp);

      const stationPresets = [0, 150, 300, 600, 1000, 1500, 2000];
      const parkingPresets = [0, 100, 250, 500, 900, 1500];
      const land2Presets = [0, 200, 500, 1000, 2000, 3500, 5000];
      const land3Presets = [0, 300, 750, 1500, 3000, 5000, 8000];

      const hasLand2Biz = emp.land2Owned && (emp.mallUnlocked || (emp.sideLevels.logistics || 0) > 0 || (emp.sideLevels.office || 0) > 0);
      const hasLand3Biz = window.Land3System && window.Land3System.hasAnyLand3Business(emp.land3);
      const curL3Sal = (emp.land3 && emp.land3.land3Salary) || 0;

      body.innerHTML = `
        <div class="rep-section" style="margin-bottom:10px; border-color:#22c55e;">
          <h4>💼 ÇOK KAYNAKLI ŞAHSİ MAAŞ YÖNETİMİ</h4>
          <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:6px;">
            İstasyon, Ücretli Otopark ve Yan Arazi/AVM işletmelerinden <strong>Şahsi Cüzdanına</strong> yatacak günlük maaşları ayrı ayrı belirle!
          </p>
          <div style="font-size:19px; font-weight:900; color:#4ade80; text-align:center; padding:6px; background:#090d1a; border-radius:9px;">
            Toplam Günlük Maaşın: +${sal.total} ₺ / gün
          </div>

          <!-- 1. İstasyon Maaşı -->
          <div class="sal-source-box">
            <div class="sal-source-head">
              <span style="color:#fde68a;">⛽ 1. İstasyon Maaşım</span>
              <span style="color:#4ade80;">+${sal.stationSal} ₺/gün</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:5px;">
              ${stationPresets
                .map((amt) => `<button class="sal-btn" data-src="station" data-amt="${amt}" ${emp.dailySalary === amt ? 'style="background:#16a34a;border-color:#86efac;color:#fff;"' : ""}>${amt} ₺</button>`)
                .join("")}
            </div>
          </div>

          <!-- 2. Ücretli Otopark Maaşı -->
          <div class="sal-source-box ${emp.parkingUnlocked ? "" : "locked"}">
            <div class="sal-source-head">
              <span style="color:#38bdf8;">🅿️ Ücretli Otopark Maaşım</span>
              <span style="color:#4ade80;">${emp.parkingUnlocked ? `+${sal.parkingSal} ₺/gün` : "🔒 Önce Otopark Kur"}</span>
            </div>
            ${
              emp.parkingUnlocked
                ? `<div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${parkingPresets
                      .map((amt) => `<button class="sal-btn" data-src="parking" data-amt="${amt}" ${emp.parkingSalary === amt ? 'style="background:#0284c7;border-color:#7dd3fc;color:#fff;"' : ""}>${amt} ₺</button>`)
                      .join("")}
                  </div>`
                : `<div style="font-size:11.5px; color:#94a3b8;">Yan Arazi'de Ücretli Otopark kurduğunda buradan ek şahsi maaş bağlayabilirsin.</div>`
            }
          </div>

          <!-- 3. Yan Arazi & AVM Maaşı -->
          <div class="sal-source-box ${hasLand2Biz ? "" : "locked"}">
            <div class="sal-source-head">
              <span style="color:#f472b6;">🏬 2. Arazi &amp; AVM Kira Maaşım</span>
              <span style="color:#4ade80;">${hasLand2Biz ? `+${sal.land2Sal} ₺/gün` : "🔒 Önce AVM / Tesis Kur"}</span>
            </div>
            ${
              hasLand2Biz
                ? `<div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${land2Presets
                      .map((amt) => `<button class="sal-btn" data-src="land2" data-amt="${amt}" ${emp.land2Salary === amt ? 'style="background:#db2777;border-color:#fbcfe8;color:#fff;"' : ""}>${amt} ₺</button>`)
                      .join("")}
                  </div>`
                : `<div style="font-size:11.5px; color:#94a3b8;">2. Arazi'de Otoyol AVM veya Kule açtığında buradan yüksek patron maaşı bağlayabilirsin.</div>`
            }
          </div>

          <!-- 4. 3. Arazi (Go-Kart, Filo & Tatil Köyü) Maaşı -->
          <div class="sal-source-box ${hasLand3Biz ? "" : "locked"}">
            <div class="sal-source-head">
              <span style="color:#c084fc;">🎡 3. Arazi (Filo &amp; Tatil Köyü) Maaşım</span>
              <span style="color:#4ade80;">${hasLand3Biz ? `+${sal.land3Sal} ₺/gün` : "🔒 Önce 3. Arazi Tesisi Kur"}</span>
            </div>
            ${
              hasLand3Biz
                ? `<div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${land3Presets
                      .map((amt) => `<button class="sal-btn" data-src="land3" data-amt="${amt}" ${curL3Sal === amt ? 'style="background:#7c3aed;border-color:#ddd6fe;color:#fff;"' : ""}>${amt} ₺</button>`)
                      .join("")}
                  </div>`
                : `<div style="font-size:11.5px; color:#94a3b8;">3. Arazi'de Go-Kart, Tır Filosu veya Tatil Köyü kurduğunda dev holding maaşı bağlayabilirsin.</div>`
            }
          </div>
        </div>

        <div class="rep-section">
          <h4>💎 ŞAHSİ SERVET ÖZETİN</h4>
          <div class="rep-row"><span>💳 Şahsi Cüzdan (Nakit)</span><span class="val-pos">${Math.round(emp.personalCash)} ₺</span></div>
          <div class="rep-row"><span>📈 Borsa Portföy Değeri</span><span class="val-pos">${calcPortfolioValue(emp)} ₺</span></div>
          <div class="rep-row"><span>🏠 Emlak Kira Gelirlerin</span><span class="val-pos">+${dailyRent} ₺ / gün</span></div>
          <div class="rep-row"><span>👑 Yaşam Prestiji</span><span style="color:#facc15; font-weight:900;">${prestige} Puan</span></div>
          <div class="rep-row" style="border-top:1px solid #334155; padding-top:5px; margin-top:4px;">
            <span><strong>🏦 Toplam Şahsi Servet</strong></span>
            <span class="val-pos">${wealth} ₺</span>
          </div>
        </div>
      `;

      body.querySelectorAll(".sal-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const src = btn.dataset.src;
          const amt = Number(btn.dataset.amt);
          if (src === "station") emp.dailySalary = amt;
          if (src === "parking") emp.parkingSalary = amt;
          if (src === "land2") emp.land2Salary = amt;
          if (src === "land3" && emp.land3) emp.land3.land3Salary = amt;
          helpers.sfx.tap();
          helpers.saveGame();
          const updated = calcSalaryBreakdown(emp);
          helpers.showToast(`💼 Toplam günlük şahsi maaşın ${updated.total} ₺ olarak güncellendi!`);
          renderCityModal(data, helpers);
        });
      });
      return;
    }

    const listMap = {
      electronics: { items: ELECTRONICS, owned: emp.electronics, type: "electronics" },
      properties: { items: PROPERTIES, owned: emp.properties, type: "properties" },
      cars: { items: GALLERY_CARS, owned: emp.cars, type: "cars" }
    };
    const cfg = listMap[currentCityTab];
    body.innerHTML = "";

    cfg.items.forEach((it) => {
      const isOwned = !!cfg.owned[it.key];
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${it.name}</h3><p>${it.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (isOwned) {
        btn.disabled = true;
        btn.textContent = "SAHİPSİN ✓";
      } else {
        btn.textContent = `${it.price} ₺`;
        btn.addEventListener("click", () => {
          if (emp.personalCash < it.price) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Şahsi cüzdanda ${it.price} ₺ gerekli! (Maaşın hem canlı hem gün sonunda yatar)`);
          }
          emp.personalCash -= it.price;
          cfg.owned[it.key] = true;
          if (it.repBonus) data.reputation = Math.min(100, data.reputation + it.repBonus);
          helpers.sfx.perfectHit();
          if (cfg.type === "electronics" && it.key === "phone") {
            helpers.showToast("📱 Akıllı Telefon alındı! Artık üstten 📱 Telefon'u açabilirsin!");
          } else {
            helpers.showToast(`🎉 Hayırlı olsun! ${it.name} satın alındı!`);
          }
          helpers.saveGame();
          helpers.updateHUD();
          renderCityModal(data, helpers);
        });
      }
      card.appendChild(btn);
      body.appendChild(card);
    });
  }

  // =========================================================================
  // 📱 AKILLI TELEFON OS (BORSA • YOLGRAM • MÜDÜR • SERVET)
  // =========================================================================
  let currentPhoneApp = "stocks";

  function renderPhoneModal(data, helpers) {
    const emp = data.empire;
    const screen = document.getElementById("phoneAppScreen");
    if (!screen) return;

    document.querySelectorAll(".phone-nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.app === currentPhoneApp);
    });

    if (currentPhoneApp === "stocks") {
      const hasLaptop = !!emp.electronics.laptop;
      let html = `
        <div class="phone-news-bar">${emp.stockNews}</div>
        <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:800; color:#cbd5e1; margin-bottom:8px;">
          <span>💳 Şahsi Nakit: <strong style="color:#4ade80;">${Math.round(emp.personalCash)} ₺</strong></span>
          <span>📈 Portföy: <strong style="color:#38bdf8;">${calcPortfolioValue(emp)} ₺</strong></span>
        </div>
      `;

      INITIAL_STOCKS.forEach((s) => {
        const st = emp.stocks[s.sym];
        const diff = st.price - st.prev;
        const pct = st.prev > 0 ? ((diff / st.prev) * 100).toFixed(1) : "0.0";
        const up = diff >= 0;
        const pnl = st.shares > 0 ? Math.round((st.price - st.avgCost) * st.shares) : 0;
        html += `
          <div class="stock-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:900; font-size:14px; color:#fff;">${s.sym} <span style="font-size:11px; color:#94a3b8; font-weight:700;">${s.name}</span></div>
                <div style="font-size:11.5px; color:#cbd5e1;">Elinde: <strong>${st.shares} lot</strong> ${st.shares > 0 ? `(${pnl >= 0 ? "+" : ""}${pnl}₺)` : ""}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:900; font-size:15px; color:#fde047;">${st.price} ₺</div>
                <div style="font-size:11px; font-weight:900; color:${up ? "#4ade80" : "#f87171"};">${up ? "▲" : "▼"} %${Math.abs(Number(pct))}</div>
              </div>
            </div>
            <div class="stock-actions">
              <button class="stk-btn buy" data-sym="${s.sym}" data-act="buy1">+1 Al</button>
              <button class="stk-btn buy" data-sym="${s.sym}" data-act="buy5">+5 Al</button>
              <button class="stk-btn sell" data-sym="${s.sym}" data-act="sell1">-1 Sat</button>
              <button class="stk-btn sell" data-sym="${s.sym}" data-act="sellall">Tümü Sat</button>
            </div>
          </div>
        `;
      });
      if (hasLaptop) {
        html += `<div style="font-size:11px; color:#4ade80; text-align:center; margin-top:4px;">💻 Patron PC Aktif: %0 Borsa Komisyonu!</div>`;
      }
      screen.innerHTML = html;

      screen.querySelectorAll(".stk-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const sym = btn.dataset.sym;
          const act = btn.dataset.act;
          const st = emp.stocks[sym];
          const feeRate = emp.electronics.laptop ? 0 : 0.02;

          if (act === "buy1" || act === "buy5") {
            const qty = act === "buy5" ? 5 : 1;
            const totalCost = Math.round(st.price * qty * (1 + feeRate));
            if (emp.personalCash < totalCost) {
              helpers.sfx.burnFail();
              return helpers.showToast(`Yetersiz şahsi bakiye! (${totalCost} ₺ gerekli)`);
            }
            const oldVal = st.shares * st.avgCost;
            emp.personalCash -= totalCost;
            st.shares += qty;
            st.avgCost = (oldVal + st.price * qty) / st.shares;
            helpers.sfx.cashRegister();
          } else {
            if (st.shares <= 0) return helpers.showToast("Satacak hissen yok!");
            const qty = act === "sellall" ? st.shares : 1;
            const gain = Math.round(st.price * qty * (1 - feeRate));
            st.shares -= qty;
            if (st.shares === 0) st.avgCost = 0;
            emp.personalCash += gain;
            helpers.sfx.cashRegister();
          }
          helpers.saveGame();
          helpers.updateHUD();
          renderPhoneModal(data, helpers);
        });
      });
      return;
    }

    if (currentPhoneApp === "social") {
      const canPost = socialCooldown <= 0;
      const postsHtml = emp.socialPosts
        .slice(0, 5)
        .map((txt) => `<div class="social-post">${txt}</div>`)
        .join("");
      const comment = SOCIAL_COMMENTS[Math.floor(Date.now() / 10000) % SOCIAL_COMMENTS.length];
      screen.innerHTML = `
        <div class="rep-section" style="margin-bottom:8px; text-align:center;">
          <div style="font-size:13px; color:#f472b6; font-weight:900;">📸 YolGram • @sonistasyon_patron</div>
          <div style="font-size:20px; font-weight:900; color:#fff; margin:4px 0;">${emp.socialFollowers} Takipçi</div>
          <button id="btnMakeSocialPost" class="primary-btn" style="padding:10px; font-size:14px;" ${canPost ? "" : "disabled"}>
            ${canPost ? "📸 YENİ PAYLAŞIM YAP (+VIP Akını & İtibar!)" : `⏳ Yeni paylaşım için ${Math.ceil(socialCooldown)}sn`}
          </button>
        </div>
        <div class="social-post" style="border-color:#38bdf8; color:#bae6fd;">${comment}</div>
        ${postsHtml}
      `;
      const pBtn = document.getElementById("btnMakeSocialPost");
      if (pBtn && canPost) {
        pBtn.addEventListener("click", () => {
          const gained = 35 + Math.floor(calcPrestige(emp) * 0.8) + Math.floor(Math.random() * 45);
          emp.socialFollowers += gained;
          socialCooldown = 25;
          const postTemplates = [
            `🅿️ Yeni Ücretli Otopark ve Otoyol AVM hızla büyüyor! (+${gained} yeni takipçi)`,
            `🏬 AVM mağazalarımızda gece boyu alışveriş keyfi! (+${gained} takipçi)`,
            `⛽ İstasyon + AVM + Otopark tek komplekste! (+${gained} takipçi)`
          ];
          emp.socialPosts.unshift(postTemplates[Math.floor(Math.random() * postTemplates.length)]);
          if (emp.socialPosts.length > 8) emp.socialPosts.pop();
          data.reputation = Math.min(100, data.reputation + 5);
          helpers.triggerVipRush(30);
          helpers.sfx.perfectHit();
          helpers.showToast(`📸 Paylaşım tuttu! +${gained} takipçi ve 30 sn VIP Akını!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderPhoneModal(data, helpers);
        });
      }
      return;
    }

    if (currentPhoneApp === "manager") {
      const logsHtml = emp.managerLogs
        .map((m) => `<div class="chat-bubble">${m}</div>`)
        .join("");
      screen.innerHTML = `
        <div class="rep-section" style="margin-bottom:8px;">
          <div style="font-weight:900; color:#fde047; font-size:14px;">👔 Müdür Kemal Bey ${emp.managerHired ? "(🟢 Görevde — Tam Otopilot)" : "(⚪ Henüz Atanmadı)"}</div>
          <p style="font-size:12px; color:#cbd5e1; margin-top:3px;">
            ${emp.managerHired ? "Sakin yönetim aktif: İstasyondaki tüm rutin olayları ve arızaları kendi çözer, seni yalnızca çok nadir büyük acil durumlarda arar." : "Çalışanlar menüsünden Müdür Kemal'i işe alarak istasyonu ona emanet edebilirsin."}
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">${logsHtml}</div>
      `;
      return;
    }

    // wealth app
    const sal = calcSalaryBreakdown(emp);
    screen.innerHTML = `
      <div class="rep-section">
        <h4>🏦 KİŞİSEL BANKA &amp; SERVET</h4>
        <div class="rep-row"><span>💳 Şahsi Cüzdan</span><span class="val-pos">${Math.round(emp.personalCash)} ₺</span></div>
        <div class="rep-row"><span>⛽ İstasyon Maaşın</span><span class="val-pos">+${sal.stationSal} ₺/gün</span></div>
        <div class="rep-row"><span>🅿️ Otopark Maaşın</span><span class="val-pos">+${sal.parkingSal} ₺/gün</span></div>
        <div class="rep-row"><span>🏬 2. Arazi &amp; AVM Maaşın</span><span class="val-pos">+${sal.land2Sal} ₺/gün</span></div>
        <div class="rep-row"><span>🎡 3. Arazi Maaşın</span><span class="val-pos">+${sal.land3Sal} ₺/gün</span></div>
        <div class="rep-row"><span>🏠 Emlak Kira Geliri</span><span class="val-pos">+${calcDailyRent(emp)} ₺/gün</span></div>
        <div class="rep-row"><span>📈 Hisse Portföyü</span><span class="val-pos">${calcPortfolioValue(emp)} ₺</span></div>
        <div class="rep-row"><span>🏢 Şirket Kasası</span><span style="color:#fde047; font-weight:900;">${Math.round(data.cash)} ₺</span></div>
        <div class="rep-row" style="border-top:1px solid #334155; padding-top:6px; margin-top:4px;">
          <span><strong>💎 Toplam Şahsi Servet</strong></span>
          <span class="val-pos">${calcTotalPersonalWealth(emp)} ₺</span>
        </div>
      </div>
    `;
  }

  return {
    LAND2_COST,
    PARKING_UNLOCK_COST,
    MALL_UNLOCK_COST,
    MALL_SHOPS,
    SIDE_TOWERS,
    ELECTRONICS,
    PROPERTIES,
    GALLERY_CARS,
    createDefaultEmpire,
    mergeEmpire,
    calcSalaryBreakdown,
    calcDailyRent,
    calcPrestige,
    calcTotalPersonalWealth,
    addManagerLog,
    updateEmpire,
    renderLand2,
    handleLand2Click,
    setCityTab(tab) { currentCityTab = tab; },
    setPhoneApp(app) { currentPhoneApp = app; },
    renderCityModal,
    renderPhoneModal
  };
})();

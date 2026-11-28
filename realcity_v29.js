// Son İstasyon v29.0 — Gerçek Şehir Yaşamı, Adım Adım Belediye Başkanlığı (Başkan Ekrem Çetin -> Seçim) ve 34 Yeni Sistem:
// Round 1 (14): #2 3D Şantiye Vinci, #3 10 Şehre 3D Uçuş, #5 4 Mevsim, #6 Kantar Kaçak Denetimi, #8 Market 4 Reyon,
//   #9 Gece Pazarı Karavanları, #10 Yönetim Kurulu, #11 Marka Sponsorlukları, #12 TV Röportajı & Anket,
//   #13 Şehir Elektrik & Su Şebekesi, #14 3D Gişeli Körfez Köprüsü, #15 3D Go-Kart & Bulvar Yarışı,
//   #17 Kendi Kredi Bankan, #18 Patron & Neon Makam Aracı Tasarımı.
// Round 2 (20): #21 Müteahhitlik (Yap-Sat-Kirala), #22 Sahil Çay Bahçesi & Plaj, #23 3D Teleferik & Mesire,
//   #24 Esnaf Çarşısı, #25 Kuyumcu & Döviz, #26 Sebze-Meyve & Balık Hali, #27 Belediye Otobüsü Ağı,
//   #28 Çöp Kamyonları & Geri Dönüşüm, #29 İtfaiye/Polis/Zabıta, #30 Oto Sanayi & Ekspertiz,
//   #31 Sürücü Kursu, #32 Su/Tüp/Kargo Bayiliği, #33 Gezi Teknesi & Deniz Taksi, #34 3D Düğün Konvoyu & Semt Pazarı,
//   #35 Değerlenen Mahalle Emlak Al-Sat, #36 Bilboard & Yerel TV, #37 Düğün Salonu, #38 Vatandaş Talepleri,
//   #39 Yol Asfaltlama & Kavşak, #40 Sokak Seviyesinde Gezme Kamerası.

window.RealCityV29 = (function () {
  const INCUMBENT_MAYOR_NAME = "Başkan Ekrem Çetin";

  // ⚖️ BELEDİYE VERGİ POLİTİKALARI (Başkan Olunca Belediye Bütçesini Yönetir!)
  const TAX_POLICIES = [
    {
      key: "low",
      label: "🟢 %4 Düşük Vergi (Halk & Esnaf Dostu)",
      short: "%4 Düşük",
      taxMult: 0.62,
      privateBizMult: 1.15,
      dailySupportDelta: 3,
      desc: "Belediye kasası yavaş birikir ama halk çok memnundur (+%3 oy/gün) ve şehirdeki özel şirketlerinin cirosu +%15 artar!"
    },
    {
      key: "balanced",
      label: "🟡 %8 Dengeli Vergi (Standart Tarife)",
      short: "%8 Dengeli",
      taxMult: 1.0,
      privateBizMult: 1.05,
      dailySupportDelta: 1,
      desc: "Hem Belediye Bütçesi düzenli vergi toplar hem de esnaf ve vatandaş memnundur (+%5 şehir ticareti)."
    },
    {
      key: "high",
      label: "🔴 %14 Kalkınma Vergisi (Hızlı Yatırım)",
      short: "%14 Yüksek",
      taxMult: 1.8,
      privateBizMult: 0.94,
      dailySupportDelta: -2,
      desc: "Belediye Kasasına neredeyse 2 kat vergi akar (Köprü ve Teleferik bütçesi hızla birikir), özel ticaret hafif yavaşlar (-%6)."
    }
  ];

  // 🌸☀️🍂❄️ 4 MEVSİM DÖNGÜSÜ (#5)
  const SEASONS = [
    { key: "spring", badge: "🌸 İlkbahar", grassTint: "#2f7a44", treeTint: "#4ade80", blossom: "#f9a8d4", desc: "Çiçek açan ağaçlar! Çarşı, Teleferik ve Mesire gelirleri +%25 artar." },
    { key: "summer", badge: "☀️ Yaz", grassTint: "#2d6a3e", treeTint: "#22c55e", blossom: null, desc: "Cıvıl cıvıl sahil! Plaj, Sahil Çay Bahçesi, Gezi Teknesi ve Soğuk İçecek +%40 coşar!" },
    { key: "autumn", badge: "🍂 Sonbahar", grassTint: "#5c6432", treeTint: "#d97706", blossom: "#ea580c", desc: "Altın yapraklar! Sebze-Meyve Hali, Sanayi, Okul ve Üniversite gelirleri +%30 artar." },
    { key: "winter", badge: "❄️ Kış", grassTint: "#cbd5e1", treeTint: "#e2e8f0", blossom: "#f8fafc", desc: "Beyaz kış örtüsü! Elektrik/Tüp dağıtımı, Motel, Sıcak Kahve ve Çekici +%40 kazandırır!" }
  ];

  // 🛒 MARKET 4 REYON YÖNETİMİ (#8)
  const MARKET_AISLES = [
    { key: "coffee", emoji: "☕", name: "Sıcak Kahve & Çay Köşesi", baseCost: 420, bonusPerLvl: 0.09, desc: "Taze demleme çay ve çekirdek kahve (Kışın ekstra +%20)." },
    { key: "cold", emoji: "🥤", name: "Soğuk İçecek & Dondurma Dolabı", baseCost: 560, bonusPerLvl: 0.10, desc: "Buz gibi meşrubat ve dondurma dolapları (Yazın ekstra +%25)." },
    { key: "bakery", emoji: "🥐", name: "Sıcak Poğaça & Sandviç Reyonu", baseCost: 720, bonusPerLvl: 0.11, desc: "Sabah yolcuları için sıcak unlu mamuller ve sandviç." },
    { key: "autogear", emoji: "🛞", name: "Oto Bakım, Yağ & Aksesuar Rafı", baseCost: 950, bonusPerLvl: 0.12, desc: "Cam suyu, motor yağı, telefon tutucu ve oto kokusu." }
  ];

  // 🏪 GERÇEK ESNAF ÇARŞISI DÜKKANLARI (#24)
  const BAZAAR_SHOPS = [
    { key: "barber", emoji: "💈", name: "Mahalle Berberi & Kuaför", cost: 4800, cyclePay: 95, supportGain: 2 },
    { key: "pharmacy", emoji: "💊", name: "Nöbetçi Şehir Eczanesi", cost: 8200, cyclePay: 155, supportGain: 4 },
    { key: "bakery_trad", emoji: "🥖", name: "Odun Ateşli Mahalle Fırını", cost: 9600, cyclePay: 180, supportGain: 3 },
    { key: "butcher", emoji: "🥩", name: "Şarküteri & Kasap Dükkanı", cost: 12500, cyclePay: 235, supportGain: 3 },
    { key: "tailor", emoji: "🧵", name: "Terzi & Kuru Temizleme", cost: 6900, cyclePay: 125, supportGain: 2 }
  ];

  // 🏗️ MÜTEAHHİTLİK KONUT PROJELERİ — YAP / SAT / KİRALA (#21)
  const HOUSING_PROJECTS = [
    { key: "apt8", emoji: "🏡", name: "8 Daireli Bahçeli Apartman", landCost: 18000, buildCost: 22000, sellTotal: 58000, cycleRent: 340 },
    { key: "site24", emoji: "🏢", name: "24 Daireli Güvenlikli Konut Sitesi", landCost: 48000, buildCost: 62000, sellTotal: 162000, cycleRent: 960 },
    { key: "res48", emoji: "🏙️", name: "48 Daireli Deniz Manzaralı Rezidans", landCost: 125000, buildCost: 165000, sellTotal: 435000, cycleRent: 2650 }
  ];

  // 📈 DEĞERLENEN MAHALLEDE EMLAK AL-SAT PARSELLERİ (#35)
  const NEIGHBORHOOD_PARCELS = [
    { key: "np_station", name: "Merkez Kavşak Köşe Parseli", basePrice: 16000 },
    { key: "np_coast", name: "Sahil Yolu Cepheli Arsa", basePrice: 34000 },
    { key: "np_north", name: "Kuzey Teleferik Eteği Bahçe", basePrice: 52000 },
    { key: "np_bridge", name: "Körfez Çıkışı Ticari Parsel", basePrice: 88000 }
  ];

  // 🗣️ VATANDAŞ VE MAHALLE TALEPLERİ (#38 — Başkanlık İçin Halk Desteği Kazandırır!)
  const CITIZEN_REQUEST_POOL = [
    { id: "req_pothole", who: "Mahalle Muhtarı İhsan Bey", text: "Yan caddedeki çukurlar araçları yoruyor, esnaf olarak el atar mısın?", cost: 1800, support: 6, rep: 3, reward: 900 },
    { id: "req_students", who: "Öğrenci Velileri Derneği", text: "Okul servisi bekleyen çocuklar için kapalı durak ve sıcak çorba desteği lazım.", cost: 2400, support: 7, rep: 4, reward: 1200 },
    { id: "req_tea", who: "Sahil Emekliler Kıraathanesi", text: "Sahil yürüyüş yoluna banklar ve uygun fiyatlı çay bahçesi istiyoruz!", cost: 3200, support: 8, rep: 5, reward: 1600 },
    { id: "req_trees", who: "Şehir Gönüllüleri", text: "Bulvar kenarına 50 yeni çınar ve ıhlamur fidanı dikelim!", cost: 2900, support: 7, rep: 5, reward: 1400 },
    { id: "req_lights", who: "Çarşı Esnaf Odası", text: "Akşamları çarşı sokaklarının aydınlatmasını güçlendirelim, alışveriş canlansın!", cost: 3800, support: 8, rep: 4, reward: 2200 },
    { id: "req_clinic", who: "Kuzey Mahalle Sakinleri", text: "Yaşlılarımız için gezici sağlık taraması aracına sponsor olur musun?", cost: 4500, support: 9, rep: 6, reward: 2600 }
  ];

  // 👔 HOLDİNG YÖNETİM KURULU ÜYELERİ (#10)
  const BOARD_MEMBERS = [
    { key: "cfo", emoji: "💼", name: "Finans Direktörü (CFO) Selda Hanım", cost: 26000, desc: "Fatura ve kredi maliyetlerini -%20 düşürür, banka faiz gelirini +%20 artırır!" },
    { key: "architect", emoji: "📐", name: "Baş Mimar Sinan Bey", cost: 32000, desc: "Tüm inşaat ve müteahhitlik maliyetlerini -%15 düşürür, 3D vinç süresini yarıya indirir!" },
    { key: "cmo", emoji: "📣", name: "Pazarlama Dehası (CMO) Bora Bey", cost: 36000, desc: "Çarşı, AVM, Sahil, Sponsorluk ve Reklam gelirlerini kalıcı +%22 artırır!" },
    { key: "counsel", emoji: "⚖️", name: "Baş Hukuk Müşaviri Av. Murat", cost: 29000, desc: "Kantar/Zabıta ödüllerini +%35 artırır, rakip ve kriz kayıplarını önler!" }
  ];

  // 🤝 MARKA SPONSORLUK ANLAŞMALARI (#11)
  const SPONSOR_DEALS = [
    { key: "sp_coffee", emoji: "☕", brand: "KahveDünyası Express", upfront: 12000, cyclePay: 180, days: 5, minRep: 45, desc: "İstasyon ve AVM'ye kahve stantları kurar; anında 12.000 ₺ peşin öder!" },
    { key: "sp_tire", emoji: "🛞", brand: "Anadolu Lastik & Akü", upfront: 28000, cyclePay: 360, days: 6, minRep: 60, desc: "Sanayi ve tamirhaneye resmi tabela sponsoru; anında 28.000 ₺ peşin!" },
    { key: "sp_cola", emoji: "🥤", brand: "BuzKola Yaz Festivali", upfront: 52000, cyclePay: 640, days: 7, minRep: 72, desc: "Sahil plajı, stadyum ve market dolapları ana sponsoru; 52.000 ₺ peşin!" },
    { key: "sp_tech", emoji: "📱", brand: "TurkFiber 5G Akıllı Şehir", upfront: 95000, cyclePay: 1150, days: 8, minRep: 82, desc: "Tüm şehir durakları ve kule ekranları sponsoru; 95.000 ₺ peşin!" }
  ];

  // 🏦 KENDİ KREDİ BANKAN — ESNAFA VE ŞİRKETLERE KREDİ PAKETLERİ (#17)
  const LENDING_PACKS = [
    { key: "lend_esnaf", emoji: "🏪", name: "Çarşı Esnafına Kredi Ver", principal: 15000, dailyReturn: 4200, days: 5, totalBack: 21000, desc: "15.000 ₺ kredi ver -> 5 günde toplam 21.000 ₺ (+%40 net faiz kârı) tahsil et!" },
    { key: "lend_builder", emoji: "🏗️", name: "Konut Müteahhidine Kredi Ver", principal: 50000, dailyReturn: 14500, days: 5, totalBack: 72500, desc: "50.000 ₺ kredi ver -> 5 günde toplam 72.500 ₺ (+22.500 ₺ faiz kârı) tahsil et!" },
    { key: "lend_export", emoji: "🚢", name: "İhracatçı Sanayiciye Kredi Ver", principal: 140000, dailyReturn: 36000, days: 6, totalBack: 216000, desc: "140.000 ₺ kredi ver -> 6 günde toplam 216.000 ₺ (+76.000 ₺ faiz kârı) tahsil et!" }
  ];

  // 🎤 TV RÖPORTAJI SORULARI (#12)
  const TV_INTERVIEWS = [
    {
      q: "Muhabir: 'Şehirde yatırımlarınız hızla büyüyor; kazancınızı öncelikle nereye yönlendireceksiniz?'",
      opts: [
        { label: "🗣️ 'Halkımızın refahına, ucuz ulaşıma ve mahallelerimize!'", support: 8, rep: 5, cash: 0, stockBoost: 0.03 },
        { label: "📈 'Yeni fabrikalara, ihracata ve teknoloji kulelerine!'", support: 2, rep: 3, cash: 4500, stockBoost: 0.12 },
        { label: "🏪 'Çarşı esnafımıza ve çalışan kardeşlerimizin primlerine!'", support: 5, rep: 5, cash: 2500, morale: 18 }
      ]
    },
    {
      q: "Muhabir: 'Mevcut Belediye Başkanı Ekrem Çetin'in şehir yönetimini nasıl buluyorsunuz?'",
      opts: [
        { label: "🏛️ 'Şehrimiz çok daha hızlı asfalt, otobüs ve teleferik hak ediyor!'", support: 9, rep: 4, cash: 0, stockBoost: 0.04 },
        { label: "🤝 'Polemik değil, istihdam ve üretim üretmeye odaklanıyoruz.'", support: 5, rep: 6, cash: 3500, stockBoost: 0.08 },
        { label: "🌳 'Önce sahili, parkları ve temizliği el birliğiyle çözeceğiz!'", support: 8, rep: 5, cash: 1500, stockBoost: 0.05 }
      ]
    }
  ];

  // 🎨 PATRON KARAKTERİ & 3D MAKAM ARACI TASARIMI (#18)
  const BOSS_AVATARS = [
    { key: "classic", label: "👔 Klasik Holding Patronu" },
    { key: "sport", label: "🕶️ Modern Girişimci" },
    { key: "mayor", label: "🏛️ Babacan Halk İnsanı" },
    { key: "vision", label: "👑 Altın Vizyoner" }
  ];
  const CAR_PAINT_COLORS = [
    { key: "#dc2626", label: "🔴 İtalyan Kırmızı" },
    { key: "#0f172a", label: "⚫ Makam Siyahı" },
    { key: "#f8fafc", label: "⚪ İnci Beyazı" },
    { key: "#facc15", label: "🟡 Yarış Sarısı" },
    { key: "#0284c7", label: "🔵 Metalik Mavi" },
    { key: "#16a34a", label: "🟢 Zümrüt Yeşili" }
  ];
  const CAR_RIM_STYLES = [
    { key: "chrome", label: "✨ Parlak Krom", col: "#e2e8f0" },
    { key: "gold", label: "👑 24K Altın Jant", col: "#facc15" },
    { key: "black", label: "🖤 Mat Karbon", col: "#1e293b" }
  ];
  const CAR_NEON_COLORS = [
    { key: "none", label: "Kapalı", col: null },
    { key: "cyan", label: "💎 Buz Mavisi", col: "#22d3ee" },
    { key: "green", label: "💚 Zümrüt", col: "#4ade80" },
    { key: "purple", label: "💜 Mor Neon", col: "#c084fc" },
    { key: "red", label: "🔥 Ateş Kırmızı", col: "#f43f5e" },
    { key: "gold", label: "🌟 Altın Neon", col: "#fde047" }
  ];

  // Canlı Durum Değişkenleri (60 FPS)
  let currentRcTab = "bazaar"; // "bazaar" | "builder" | "coast" | "civic" | "corp"
  let streetViewActive = false;

  // 3D Canlı Şehir Varlıkları
  const activeConstructionSites = {}; // landId -> { timeLeft, total, label }
  const liveCityBuses = [];
  const liveGarbageTrucks = [];
  const liveDeliveryVans = [];
  const liveTourBoats = [];
  const liveWeddingCars = [];
  const liveRaceCars = [];
  let liveAirplane = null; // { wx, wy, wz, phase, timer, cityName, payout }
  let liveAsphaltRoller = null; // { wx, wz, timer }
  let cableCarPhase = 0; // 0..1 gidiş-dönüş 3D teleferik kabinleri!
  let bridgeTollTimer = 0;

  // Etkileşimli Olaylar
  let activeScaleSuspect = null; // { plate, tons, issue, bounty, timeLeft }
  let activeInterview = null; // { q, opts, timeLeft }
  let activeRace = null; // { progress, playerPos, boostUsed, timer, prize }
  const rcFloats = [];

  // Zamanlayıcılar
  let seasonTimer = 85;
  let goldTickTimer = 7;
  let cityCycleTimer = 0;
  let scaleSuspectTimer = 34;
  let interviewTimer = 68;
  let weddingTimer = 52;
  let nightMarketTimer = 0;
  let flightTimer = 18;
  let incumbentNewsTimer = 48;

  function rollCitizenRequests() {
    const shuf = CITIZEN_REQUEST_POOL.slice().sort(() => Math.random() - 0.5);
    return shuf.slice(0, 3).map((r) => Object.assign({}, r, { done: false }));
  }

  function createDefaultV29() {
    return {
      seasonIdx: 0, // 0: İlkbahar, 1: Yaz, 2: Sonbahar, 3: Kış
      publicSupport: 14, // %14 başlangıç oy desteği (Ekrem Çetin %58; %51+ olunca seçim kazanılabilir!)
      citizenRequestsSolved: 0,
      citizenRequests: rollCitizenRequests(),
      marketAisles: { coffee: 0, cold: 0, bakery: 0, autogear: 0 },
      scaleCaughtCount: 0,
      bazaarShops: { barber: false, pharmacy: false, bakery_trad: false, butcher: false, tailor: false },
      jewelry: { unlocked: false, goldGrams: 0, goldPrice: 2850, fxUnits: 0, fxPrice: 36 },
      wholesaleHal: { unlocked: false, lvl: 1 },
      deliveryAgency: { vans: 0, lvl: 1 },
      autoIndustry: { unlocked: false, lvl: 1, ekspertiz: false },
      drivingSchool: { unlocked: false, lvl: 1 },
      weddingHall: { unlocked: false, lvl: 1, eventsHosted: 0 },
      beachClub: { unlocked: false, lvl: 1 },
      seaTour: { boats: 0 },
      flights: { routeLvl: 0, vipJet: false, flightsDone: 0 },
      housing: {
        apt8: { built: false, mode: null, soldCount: 0 }, // mode: "building" | "ready" | "rented"
        site24: { built: false, mode: null, soldCount: 0 },
        res48: { built: false, mode: null, soldCount: 0 }
      },
      parcels: {
        np_station: { owned: false, boughtAtMult: 1.0 },
        np_coast: { owned: false, boughtAtMult: 1.0 },
        np_north: { owned: false, boughtAtMult: 1.0 },
        np_bridge: { owned: false, boughtAtMult: 1.0 }
      },
      // 🏛️ BELEDİYE HAZİNESİ, VERGİ SİSTEMİ & KAMU HİZMETLERİ (Şirket Kasasından Tamamen Ayrı Kamu Bütçesi!)
      municipal: {
        budget: 72000, // Mevcut belediye hazinesi (seçimi kazanınca devralınır, vergilerle büyür!)
        taxPolicy: "balanced", // "low" | "balanced" | "high"
        dailyTaxIn: 0,
        dailyTransitIn: 0,
        dailyStateGrant: 0,
        dailyMaintOut: 0,
        busCount: 0,
        garbageTrucks: 0,
        recyclingPlant: false,
        fireStation: false,
        policeHQ: false,
        zabitaHQ: false,
        roadAsphaltLvl: 0, // 0..5
        powerWaterLvl: 0, // 0..5
        cableCarUnlocked: false, // #23 3D Teleferik!
        bayBridgeUnlocked: false // #14 3D Körfez Asma Köprüsü!
      },
      // 👔 KURUMSAL HOLDİNG, BANKA, MEDYA, YARIŞ & TASARIM
      board: { cfo: false, architect: false, cmo: false, counsel: false },
      activeSponsors: [], // { key, brand, cyclePay, daysLeft }
      playerBank: { unlocked: false, activeLoansOut: [] }, // { key, name, dailyReturn, daysLeft }
      media: { billboards: 0, localTv: false },
      racesWon: 0,
      bossStyle: {
        avatar: "classic",
        carColor: "#dc2626",
        rims: "gold",
        neon: "cyan"
      }
    };
  }

  function mergeV29(saved) {
    const def = createDefaultV29();
    if (!saved) return def;
    const out = Object.assign({}, def, saved);
    out.marketAisles = Object.assign({}, def.marketAisles, saved.marketAisles || {});
    out.bazaarShops = Object.assign({}, def.bazaarShops, saved.bazaarShops || {});
    out.jewelry = Object.assign({}, def.jewelry, saved.jewelry || {});
    out.wholesaleHal = Object.assign({}, def.wholesaleHal, saved.wholesaleHal || {});
    out.deliveryAgency = Object.assign({}, def.deliveryAgency, saved.deliveryAgency || {});
    out.autoIndustry = Object.assign({}, def.autoIndustry, saved.autoIndustry || {});
    out.drivingSchool = Object.assign({}, def.drivingSchool, saved.drivingSchool || {});
    out.weddingHall = Object.assign({}, def.weddingHall, saved.weddingHall || {});
    out.beachClub = Object.assign({}, def.beachClub, saved.beachClub || {});
    out.seaTour = Object.assign({}, def.seaTour, saved.seaTour || {});
    out.flights = Object.assign({}, def.flights, saved.flights || {});
    out.municipal = Object.assign({}, def.municipal, saved.municipal || {});
    out.board = Object.assign({}, def.board, saved.board || {});
    out.playerBank = Object.assign({}, def.playerBank, saved.playerBank || {});
    if (!Array.isArray(out.playerBank.activeLoansOut)) out.playerBank.activeLoansOut = [];
    if (!Array.isArray(out.activeSponsors)) out.activeSponsors = [];
    if (!Array.isArray(out.citizenRequests) || out.citizenRequests.length === 0) {
      out.citizenRequests = def.citizenRequests;
    }
    out.media = Object.assign({}, def.media, saved.media || {});
    out.bossStyle = Object.assign({}, def.bossStyle, saved.bossStyle || {});

    out.housing = Object.assign({}, def.housing);
    HOUSING_PROJECTS.forEach((hp) => {
      if (saved.housing && saved.housing[hp.key]) {
        out.housing[hp.key] = Object.assign({}, def.housing[hp.key], saved.housing[hp.key]);
      }
    });
    out.parcels = Object.assign({}, def.parcels);
    NEIGHBORHOOD_PARCELS.forEach((np) => {
      if (saved.parcels && saved.parcels[np.key]) {
        out.parcels[np.key] = Object.assign({}, def.parcels[np.key], saved.parcels[np.key]);
      }
    });
    return out;
  }

  function ensureV29(data) {
    if (!data.empire) return createDefaultV29();
    if (!data.empire.v29) data.empire.v29 = createDefaultV29();
    return data.empire.v29;
  }

  // =========================================================================
  // ADIM ADIM İLERLEME (AŞAMA 1 -> 4) VE BAŞKANLIK ŞARTLARI
  // =========================================================================
  function getOwnedLandCount(data) {
    const emp = data.empire || {};
    let c = 1; // 1. İstasyon
    if (emp.land2Owned) c += 1;
    if (emp.land3 && emp.land3.owned) c += 1;
    if (emp.extraLands) {
      Object.values(emp.extraLands).forEach((st) => {
        if (st && st.owned) c += 1;
      });
    }
    return c;
  }

  function getPlayerStage(data) {
    const mayorElected = !!(data.empire && data.empire.v28 && data.empire.v28.mayor && data.empire.v28.mayor.elected);
    if (mayorElected) return { num: 4, badge: "🏛️ Aşama 4: Belediye Başkanı & İmparator" };
    const lands = getOwnedLandCount(data);
    const rep = data.reputation || 50;
    const day = data.dayNumber || 1;
    if (lands >= 3 || day >= 5 || rep >= 68) return { num: 3, badge: "🏢 Aşama 3: Şehir Holdingi" };
    if (lands >= 2 || day >= 3 || rep >= 55 || (data.pumpsUnlocked || 1) >= 3) return { num: 2, badge: "🏗️ Aşama 2: Tüccar & Müteahhit" };
    return { num: 1, badge: "⛽ Aşama 1: İstasyon & Esnaf" };
  }

  function getMayorElectionStatus(data) {
    const v29 = ensureV29(data);
    const v28 = data.empire && data.empire.v28;
    const elected = !!(v28 && v28.mayor && v28.mayor.elected);
    const lands = getOwnedLandCount(data);
    const dayOk = (data.dayNumber || 1) >= 8 || lands >= 4;
    const repOk = (data.reputation || 50) >= 75;
    const monOk = !!(v28 && v28.monuments && Object.values(v28.monuments).some(Boolean));
    const sup = Math.min(96, Math.max(5, Math.round(v29.publicSupport || 14)));
    const rivalSup = Math.max(4, Math.min(86, 100 - sup - 8));
    const supOk = sup >= 51;
    return {
      elected,
      incumbentName: INCUMBENT_MAYOR_NAME,
      support: sup,
      rivalSupport: rivalSup,
      dayOk,
      repOk,
      monOk,
      supOk,
      lands,
      canRun: !elected && dayOk && repOk && monOk && supOk,
      campaignCost: 75000
    };
  }

  // =========================================================================
  // ÇARPANLAR & SİNERJİLER (MARKET REYONU, MEVSİM, MAHALLE DEĞERİ, YÖNETİM KURULU)
  // =========================================================================
  function getCurrentSeason(data) {
    const v29 = ensureV29(data);
    return SEASONS[(v29.seasonIdx || 0) % SEASONS.length];
  }

  function getMarketAisleMult(data) {
    const v29 = ensureV29(data);
    const season = getCurrentSeason(data);
    let m = 1.0;
    MARKET_AISLES.forEach((a) => {
      const lvl = (v29.marketAisles && v29.marketAisles[a.key]) || 0;
      if (lvl > 0) {
        let add = lvl * a.bonusPerLvl;
        if (a.key === "coffee" && season.key === "winter") add *= 1.25;
        if (a.key === "cold" && season.key === "summer") add *= 1.25;
        m += add;
      }
    });
    if (v29.wholesaleHal && v29.wholesaleHal.unlocked) m *= 1.25;
    return m;
  }

  function getSeasonFacilityMult(data, kind) {
    const s = getCurrentSeason(data).key;
    if (s === "summer" && (kind === "wash" || kind === "market")) return 1.22;
    if (s === "winter" && (kind === "motel" || kind === "tow")) return 1.3;
    if (s === "autumn" && (kind === "scale" || kind === "restaurant")) return 1.2;
    if (s === "spring" && kind === "restaurant") return 1.15;
    return 1.0;
  }

  function getArchitectCostMult(data) {
    const v29 = ensureV29(data);
    return v29.board && v29.board.architect ? 0.85 : 1.0;
  }

  function getCfoUtilityMult(data) {
    const v29 = ensureV29(data);
    return v29.board && v29.board.cfo ? 0.8 : 1.0;
  }

  function getCmoCommercialMult(data) {
    const v29 = ensureV29(data);
    return v29.board && v29.board.cmo ? 1.22 : 1.0;
  }

  function getEkspertizCarMult(data) {
    const v29 = ensureV29(data);
    return v29.autoIndustry && v29.autoIndustry.ekspertiz ? 1.25 : 1.0;
  }

  function getRoadSpeedMult(data) {
    const v29 = ensureV29(data);
    return 1.0 + ((v29.municipal && v29.municipal.roadAsphaltLvl) || 0) * 0.05;
  }

  // =========================================================================
  // 🏛️ GERÇEK BELEDİYE BÜTÇESİ, VERGİ DAİRESİ & ŞEHİR NÜFUSU SİSTEMİ
  // =========================================================================
  function getTaxPolicyDef(v29) {
    const k = (v29 && v29.municipal && v29.municipal.taxPolicy) || "balanced";
    return TAX_POLICIES.find((p) => p.key === k) || TAX_POLICIES[1];
  }

  function calcCityPopulation(data) {
    const v29 = ensureV29(data);
    const emp = data.empire || {};
    const v28 = emp.v28 || {};
    const m = v29.municipal || {};
    let pop = 38000 + getOwnedLandCount(data) * 4200;
    if (emp.mallUnlocked) pop += 9500;
    pop += Object.values(v29.bazaarShops || {}).filter(Boolean).length * 2400;
    HOUSING_PROJECTS.forEach((hp) => {
      const st = v29.housing[hp.key];
      if (st && (st.built || st.soldCount > 0)) pop += 5500 + (st.soldCount || 0) * 2800;
    });
    pop += (m.busCount || 0) * 3200;
    pop += (m.roadAsphaltLvl || 0) * 4500;
    pop += (m.powerWaterLvl || 0) * 5200;
    if (v28.tram && v28.tram.unlocked) pop += 14000 + (v28.tram.lvl || 1) * 3500;
    if (m.cableCarUnlocked) pop += 12000;
    if (m.bayBridgeUnlocked) pop += 26000;
    return Math.round(pop);
  }

  // Belediye altyapısı geliştikçe ve vergi politikasına göre oyuncunun ÖZEL şirketlerinin kazanç çarpanı!
  function getCityDevelopmentMult(data) {
    const v29 = ensureV29(data);
    const mStatus = getMayorElectionStatus(data);
    const popBonus = Math.min(0.55, Math.max(0, (calcCityPopulation(data) - 42000) / 320000));
    const taxMult = mStatus.elected ? getTaxPolicyDef(v29).privateBizMult : 1.0;
    return Number(((1.0 + popBonus) * taxMult).toFixed(3));
  }

  function calcMunicipalBudgetFlow(data) {
    const v29 = ensureV29(data);
    const emp = data.empire || {};
    const m = v29.municipal;
    const season = getCurrentSeason(data).key;
    const pol = getTaxPolicyDef(v29);
    const pop = calcCityPopulation(data);

    // 1) Emlak & Çevre Temizlik Vergisi (Nüfus + Araziler + Konutlar)
    const propTax = Math.round((280 + (pop / 1000) * 14 + getOwnedLandCount(data) * 85) * pol.taxMult);

    // 2) Esnaf Ruhsat, İlan & Reklam Harçları (AVM + Çarşı + Sanayi + Panolar)
    const rentedMallCount = emp.mallShops ? Object.values(emp.mallShops).filter((s) => s && s.rented).length : 0;
    const bazaarCount = Object.values(v29.bazaarShops || {}).filter(Boolean).length;
    const bizTax = Math.round(
      (160 + rentedMallCount * 55 + bazaarCount * 48 + (v29.autoIndustry.unlocked ? 140 : 0) + (v29.media.billboards || 0) * 40) *
        pol.taxMult
    );

    // 3) Belediye Kamu İşletme Gelirleri (Otobüs, Köprü Gişesi, Teleferik, Elektrik/Su, Geri Dönüşüm)
    let transitAndUtil = 0;
    if (m.busCount > 0) transitAndUtil += m.busCount * 145;
    if (m.garbageTrucks > 0 && m.recyclingPlant) transitAndUtil += m.garbageTrucks * 165;
    if (m.powerWaterLvl > 0) {
      transitAndUtil += Math.round(m.powerWaterLvl * 320 * (season === "winter" ? 1.35 : 1.0));
    }
    if (m.cableCarUnlocked) {
      transitAndUtil += Math.round(680 * (season === "spring" || season === "summer" ? 1.3 : 1.0));
    }
    if (m.bayBridgeUnlocked) {
      transitAndUtil += 1180;
    }

    // 4) Belediye Hizmet & Personel Bakım Gideri
    const maintOut =
      (m.busCount || 0) * 32 +
      (m.garbageTrucks || 0) * 28 +
      (m.fireStation ? 55 : 0) +
      (m.policeHQ ? 65 : 0) +
      (m.zabitaHQ ? 40 : 0) +
      (m.roadAsphaltLvl || 0) * 35;

    const taxTotal = propTax + bizTax;
    const netCycle = Math.max(120, taxTotal + transitAndUtil - maintOut);
    const dailyGrantEst = Math.round(2500 + (pop / 1000) * 75);

    return {
      pop,
      pol,
      propTax,
      bizTax,
      taxTotal,
      transitAndUtil,
      maintOut,
      netCycle,
      dailyGrantEst
    };
  }

  function addMunicipalRevenue(data, amount, kind = "transit") {
    const v29 = ensureV29(data);
    const amt = Math.round(amount || 0);
    if (amt <= 0) return;
    v29.municipal.budget = Math.max(0, Math.round((v29.municipal.budget || 0) + amt));
    if (kind === "tax") v29.municipal.dailyTaxIn = (v29.municipal.dailyTaxIn || 0) + amt;
    else v29.municipal.dailyTransitIn = (v29.municipal.dailyTransitIn || 0) + amt;
  }

  function payFromMunicipalBudget(cost, title, data, helpers, onPaid) {
    const v29 = ensureV29(data);
    const mStatus = getMayorElectionStatus(data);
    if (!mStatus.elected) {
      if (helpers && helpers.sfx && helpers.sfx.burnFail) helpers.sfx.burnFail();
      if (helpers && helpers.showToast) {
        helpers.showToast(`🔒 "${title}" belediye yetkisindedir! Önce seçimi kazanıp Belediye Başkanı olmalısın.`);
      }
      return false;
    }
    const curBudget = Math.floor(v29.municipal.budget || 0);
    if (curBudget < cost) {
      if (helpers && helpers.sfx && helpers.sfx.burnFail) helpers.sfx.burnFail();
      if (helpers && helpers.showToast) {
        helpers.showToast(
          `🏛️ Belediye Bütçesi yetersiz! (Kasa: ${curBudget.toLocaleString("tr-TR")} ₺ / Gereken: ${cost.toLocaleString("tr-TR")} ₺) — Vergi ve gişe gelirlerinin birikmesini bekle!`
        );
      }
      return false;
    }
    v29.municipal.budget = curBudget - cost;
    if (helpers && helpers.saveGame) helpers.saveGame();
    if (helpers && helpers.updateHUD) helpers.updateHUD();
    if (onPaid) onPaid();
    return true;
  }

  function calcNeighborhoodMultiplier(data) {
    const v29 = ensureV29(data);
    const emp = data.empire || {};
    const v28 = emp.v28 || {};
    let mult = 1.0;
    if (emp.mallUnlocked) mult += 0.18;
    if (v28.tram && v28.tram.unlocked) mult += 0.22;
    if (v28.monuments) {
      Object.values(v28.monuments).forEach((b) => { if (b) mult += 0.09; });
    }
    if (v29.beachClub && v29.beachClub.unlocked) mult += 0.16;
    if (Object.values(v29.bazaarShops || {}).some(Boolean)) mult += 0.14;
    if (v29.municipal.roadAsphaltLvl > 0) mult += v29.municipal.roadAsphaltLvl * 0.07;
    if (v29.municipal.cableCarUnlocked) mult += 0.25;
    if (v29.municipal.bayBridgeUnlocked) mult += 0.35;
    return Number(mult.toFixed(2));
  }

  // =========================================================================
  // 🏗️ #2 — CANLI 3D İNŞAAT ŞANTİYESİ & SARI KULE VİNÇ
  // =========================================================================
  function startConstructionSite(landId, label, data) {
    if (!landId) return;
    const v29 = data ? ensureV29(data) : null;
    const fast = v29 && v29.board && v29.board.architect;
    const dur = fast ? 6.5 : 12.0;
    activeConstructionSites[landId] = {
      timeLeft: dur,
      total: dur,
      label: label || "Yeni İnşaat"
    };
  }

  function speedUpAllSites(helpers) {
    let any = false;
    Object.keys(activeConstructionSites).forEach((lid) => {
      activeConstructionSites[lid].timeLeft = Math.max(0.2, activeConstructionSites[lid].timeLeft - 5.0);
      any = true;
    });
    if (any && helpers) {
      if (helpers.sfx) helpers.sfx.perfectHit();
      if (helpers.showToast) helpers.showToast("🏗️ Ustabaşı vinçleri hızlandırdı! İnşaat hızla tamamlanıyor!");
    }
  }

  // =========================================================================
  // 🚶 #40 — SOKAK SEVİYESİNDE GEZME MODU
  // =========================================================================
  function toggleStreetView(helpers) {
    streetViewActive = !streetViewActive;
    const btn = document.getElementById("btnStreetView");
    if (btn) btn.classList.toggle("street-on", streetViewActive);
    if (window.Engine3D && window.Engine3D.setStreetViewMode) {
      window.Engine3D.setStreetViewMode(streetViewActive);
    }
    if (helpers) {
      if (helpers.sfx) helpers.sfx.tap();
      if (helpers.showToast) {
        helpers.showToast(
          streetViewActive
            ? "🚶 Sokak Seviyesi Görünüm Açıldı! Parmağınla sürükleyip caddelerde ve dükkanların önünde gez!"
            : "🎥 Kuşbakışı 3D Şehir Kamerasına dönüldü."
        );
      }
    }
    return streetViewActive;
  }

  // =========================================================================
  // ANA 60 FPS DÜNYA DÖNGÜSÜ (TÜM 34 YENİ SİSTEMİN CANLI HAREKETİ & GELİRİ)
  // =========================================================================
  function syncPool(arr, count, initFn) {
    while (arr.length < count) arr.push(initFn(arr.length));
    if (arr.length > count) arr.length = count;
  }

  function hasAirportBuilt(data) {
    const ext = data.empire && data.empire.extraLands;
    if (!ext) return false;
    return Object.values(ext).some((st) => st && st.owned && st.projectKey === "airport");
  }

  function calcCityCycleEarnings(data) {
    const v29 = ensureV29(data);
    const season = getCurrentSeason(data).key;
    const cmo = getCmoCommercialMult(data);
    let biz = 0;
    let muni = 0;

    // Esnaf Çarşısı (#24)
    BAZAAR_SHOPS.forEach((sh) => {
      if (v29.bazaarShops[sh.key]) biz += sh.cyclePay;
    });
    if (season === "spring") biz *= 1.25;
    if (v29.wholesaleHal.unlocked) biz *= 1.2;

    // Kuyumcu vitrin kârı (#25)
    if (v29.jewelry.unlocked) biz += 210;

    // Sebze-Meyve & Balık Hali (#26)
    if (v29.wholesaleHal.unlocked) {
      biz += Math.round(280 * (1 + (v29.wholesaleHal.lvl - 1) * 0.35) * (season === "autumn" ? 1.3 : 1.0));
    }

    // Su, Tüp & Kargo Dağıtım (#32)
    if (v29.deliveryAgency.vans > 0) {
      biz += Math.round(v29.deliveryAgency.vans * 95 * (1 + (v29.deliveryAgency.lvl - 1) * 0.25) * (season === "winter" ? 1.4 : 1.0));
    }

    // Oto Sanayi & Ekspertiz (#30)
    if (v29.autoIndustry.unlocked) {
      biz += Math.round(320 * (1 + (v29.autoIndustry.lvl - 1) * 0.35) * (v29.autoIndustry.ekspertiz ? 1.3 : 1.0));
    }

    // Sürücü Kursu (#31) ve Düğün Salonu (#37)
    if (v29.drivingSchool.unlocked) biz += Math.round(230 * (1 + (v29.drivingSchool.lvl - 1) * 0.3));
    if (v29.weddingHall.unlocked) biz += Math.round(390 * (1 + (v29.weddingHall.lvl - 1) * 0.35) * (season === "summer" ? 1.3 : 1.0));

    // Sahil Çay Bahçesi & Plaj (#22) + Gezi Teknesi (#33)
    if (v29.beachClub.unlocked) {
      biz += Math.round(310 * (1 + (v29.beachClub.lvl - 1) * 0.35) * (season === "summer" ? 1.45 : 1.0));
    }
    if (v29.seaTour.boats > 0) {
      biz += Math.round(v29.seaTour.boats * 165 * (season === "summer" ? 1.4 : 1.0));
    }

    // Kiraya Verilen Müteahhitlik Konut Siteleri (#21)
    HOUSING_PROJECTS.forEach((hp) => {
      const st = v29.housing[hp.key];
      if (st && st.built && st.mode === "rented") biz += hp.cycleRent;
    });

    // Sponsorluklar (#11) + Reklam Bilboard & Yerel TV (#36)
    v29.activeSponsors.forEach((sp) => { biz += sp.cyclePay || 0; });
    if (v29.media.billboards > 0) biz += v29.media.billboards * 115;
    if (v29.media.localTv) biz += 540;
    if (nightMarketTimer > 0) biz += 380;

    biz = Math.round(biz * cmo * getCityDevelopmentMult(data));
    const muniFlow = calcMunicipalBudgetFlow(data);

    return { biz, muniFlow };
  }

  function updateV29(dt, data, helpers) {
    const v29 = ensureV29(data);
    const mayorElected = !!(data.empire && data.empire.v28 && data.empire.v28.mayor && data.empire.v28.mayor.elected);
    const roadMult = getRoadSpeedMult(data);

    // 1) 🏗️ 3D İnşaat Şantiyesi Sayaçları
    Object.keys(activeConstructionSites).forEach((lid) => {
      const s = activeConstructionSites[lid];
      s.timeLeft -= dt;
      if (s.timeLeft <= 0) {
        delete activeConstructionSites[lid];
      }
    });

    // 2) 🌸☀️🍂❄️ 4 Mevsim Geçişi
    seasonTimer -= dt;
    if (seasonTimer <= 0) {
      seasonTimer = 85;
      v29.seasonIdx = ((v29.seasonIdx || 0) + 1) % SEASONS.length;
      const ns = SEASONS[v29.seasonIdx];
      if (helpers && helpers.showToast) {
        helpers.showToast(`${ns.badge} mevsimi başladı! ${ns.desc}`);
      }
      if (helpers && helpers.updateHUD) helpers.updateHUD();
    }

    // 3) 💍 Kuyumcu & Döviz Canlı Kur Dalgalanması (#25)
    goldTickTimer -= dt;
    if (goldTickTimer <= 0) {
      goldTickTimer = 7.0;
      const gDelta = Math.round((Math.random() - 0.46) * 95);
      v29.jewelry.goldPrice = Math.max(2100, Math.min(4800, (v29.jewelry.goldPrice || 2850) + gDelta));
      const fDelta = (Math.random() - 0.46) * 1.4;
      v29.jewelry.fxPrice = Number(Math.max(28, Math.min(62, (v29.jewelry.fxPrice || 36) + fDelta)).toFixed(2));
    }

    // 4) 🚌 Belediye Otobüsleri, 🗑️ Çöp Kamyonları, 🚚 Su/Tüp/Kargo Kamyonetleri, 🛥️ Gezi Tekneleri
    syncPool(liveCityBuses, v29.municipal.busCount || 0, (i) => ({
      wx: -185 + i * 44,
      wz: i % 2 === 0 ? -61.2 : 10.6,
      dir: i % 2 === 0 ? 1 : -1,
      speed: 22
    }));
    liveCityBuses.forEach((b) => {
      b.wx += b.dir * b.speed * roadMult * dt;
      if (b.wx > 198) b.wx = -198;
      if (b.wx < -198) b.wx = 198;
    });

    syncPool(liveGarbageTrucks, v29.municipal.garbageTrucks || 0, (i) => ({
      wx: 180 - i * 52,
      wz: i % 2 === 0 ? -74.5 : -13.5,
      dir: i % 2 === 0 ? -1 : 1,
      speed: 16
    }));
    liveGarbageTrucks.forEach((gt) => {
      gt.wx += gt.dir * gt.speed * roadMult * dt;
      if (gt.wx > 196) gt.wx = -196;
      if (gt.wx < -196) gt.wx = 196;
    });

    syncPool(liveDeliveryVans, v29.deliveryAgency.vans || 0, (i) => ({
      wx: -150 + i * 48,
      wz: i % 2 === 0 ? -13.2 : 59.5,
      dir: i % 2 === 0 ? 1 : -1,
      speed: 24
    }));
    liveDeliveryVans.forEach((dv) => {
      dv.wx += dv.dir * dv.speed * roadMult * dt;
      if (dv.wx > 195) dv.wx = -195;
      if (dv.wx < -195) dv.wx = 195;
    });

    syncPool(liveTourBoats, v29.seaTour.boats || 0, (i) => ({
      wx: -95 + i * 55,
      wz: 118 + (i % 2) * 8,
      dir: i % 2 === 0 ? 1 : -1,
      speed: 14
    }));
    liveTourBoats.forEach((tb) => {
      tb.wx += tb.dir * tb.speed * dt;
      if (tb.wx > 155) tb.dir = -1;
      if (tb.wx < -155) tb.dir = 1;
    });

    // 5) 🌲 3D Teleferik Kabin Hareketi & 🌉 3D Körfez Köprüsü Gişe Akışı + 🛣️ Asfalt Silindiri
    if (v29.municipal.cableCarUnlocked) {
      cableCarPhase = (cableCarPhase + dt * 0.085) % 1;
    }
    if (v29.municipal.bayBridgeUnlocked) {
      bridgeTollTimer += dt;
      if (bridgeTollTimer >= 6.5) {
        bridgeTollTimer = 0;
        rcFloats.push({ wx: -112, wz: 118, text: "🌉 KÖRFEZ KÖPRÜSÜ GİŞE +320₺", color: "#38bdf8", life: 1.7 });
      }
    }
    if (liveAsphaltRoller) {
      liveAsphaltRoller.wx += 18 * dt;
      liveAsphaltRoller.timer -= dt;
      if (liveAsphaltRoller.timer <= 0 || liveAsphaltRoller.wx > 190) liveAsphaltRoller = null;
    }

    // 6) ✈️ Şehirlerarası 3D Uçuş Hattı & Özel Jet İniş-Kalkışı (#3)
    if ((v29.flights.routeLvl > 0 || v29.flights.vipJet) && hasAirportBuilt(data)) {
      if (!liveAirplane) {
        flightTimer -= dt;
        if (flightTimer <= 0) {
          flightTimer = Math.max(12, 26 - v29.flights.routeLvl * 3);
          const unlockedCities = window.MetropolisV28 ? window.MetropolisV28.getUnlockedSurroundingCount(data) : 0;
          const pay = Math.round((950 + v29.flights.routeLvl * 480 + unlockedCities * 320) * (v29.flights.vipJet ? 1.45 : 1.0));
          liveAirplane = { wx: -220, wy: 36, wz: 36, phase: "landing", timer: 4.0, payout: pay };
        }
      } else {
        if (liveAirplane.phase === "landing") {
          liveAirplane.wx += 48 * dt;
          liveAirplane.wy = Math.max(2.2, liveAirplane.wy - 7.5 * dt);
          if (liveAirplane.wx >= 96) {
            liveAirplane.wx = 96;
            liveAirplane.wy = 2.2;
            liveAirplane.phase = "boarding";
            liveAirplane.timer = 3.2;
          }
        } else if (liveAirplane.phase === "boarding") {
          liveAirplane.timer -= dt;
          if (liveAirplane.timer <= 0) {
            data.cash += liveAirplane.payout;
            v29.flights.flightsDone = (v29.flights.flightsDone || 0) + 1;
            if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + liveAirplane.payout;
            rcFloats.push({ wx: 96, wz: 36, text: `✈️ ŞEHİRLERARASI UÇUŞ +${liveAirplane.payout.toLocaleString("tr-TR")}₺`, color: "#fde047", life: 2.0 });
            liveAirplane.phase = "takeoff";
          }
        } else {
          liveAirplane.wx += 54 * dt;
          liveAirplane.wy += 9.5 * dt;
          if (liveAirplane.wx > 235) liveAirplane = null;
        }
      }
    }

    // 7) 🎉 Yaşayan Sokak Olayları: 3D Gelin Arabası Düğün Konvoyu (#34) & 🎪 Gece Pazarı (#9)
    if (nightMarketTimer > 0) nightMarketTimer = Math.max(0, nightMarketTimer - dt);
    if (liveWeddingCars.length === 0) {
      weddingTimer -= dt;
      if (weddingTimer <= 0 && (data.dayNumber || 1) >= 2) {
        weddingTimer = 64 + Math.random() * 25;
        for (let i = 0; i < 4; i++) {
          liveWeddingCars.push({
            wx: -205 - i * 11,
            wz: -61.2,
            speed: 30,
            color: i === 0 ? "#ffffff" : ["#f43f5e", "#38bdf8", "#facc15"][i - 1],
            tipped: false
          });
        }
        if (helpers && helpers.sfx && helpers.sfx.carHorn) helpers.sfx.carHorn();
      }
    } else {
      liveWeddingCars.forEach((wc, idx) => {
        wc.wx += wc.speed * dt;
        if (idx === 0 && !wc.tipped && wc.wx >= 0) {
          wc.tipped = true;
          const tip = v29.weddingHall.unlocked ? 1450 : 380;
          data.cash += tip;
          if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + tip;
          rcFloats.push({ wx: 0, wz: -61, text: `👰 DÜĞÜN KONVOYU BAHŞİŞİ +${tip}₺!`, color: "#f472b6", life: 2.1 });
        }
      });
      if (liveWeddingCars[liveWeddingCars.length - 1].wx > 210) {
        liveWeddingCars.length = 0;
      }
    }

    // 8) 🏎️ Canlı 3D Go-Kart & Bulvar Yarışı (#15)
    if (activeRace) {
      activeRace.timer -= dt;
      activeRace.progress = Math.min(100, activeRace.progress + 18 * dt);
      liveRaceCars.forEach((rc, i) => {
        rc.wx += rc.speed * dt;
        if (rc.wx > 200) rc.wx = -200;
      });
      if (activeRace.progress >= 100 || activeRace.timer <= 0) {
        const won = activeRace.playerPos === 1;
        const prize = won ? activeRace.prize : Math.round(activeRace.prize * 0.35);
        data.cash += prize;
        if (won) v29.racesWon = (v29.racesWon || 0) + 1;
        if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + prize;
        if (helpers && helpers.sfx) helpers.sfx.stadiumGoal();
        if (helpers && helpers.showToast) {
          helpers.showToast(won ? `🏆 YARIŞI 1. BİTİRDİN! Kupa ve +${prize.toLocaleString("tr-TR")} ₺ kazandın!` : `🏁 Yarış bitti (${activeRace.playerPos}. sıra)! Teselli ödülü +${prize.toLocaleString("tr-TR")} ₺!`);
        }
        activeRace = null;
        liveRaceCars.length = 0;
        if (helpers && helpers.updateHUD) helpers.updateHUD();
      }
    }

    // 9) 🚓 Otoyol & Kantar Kaçak / Aşırı Yük Denetimi (#6)
    if (!activeScaleSuspect && data.scaleUnlocked) {
      scaleSuspectTimer -= dt;
      if (scaleSuspectTimer <= 0) {
        scaleSuspectTimer = 46 + Math.random() * 20;
        const counselMult = v29.board.counsel ? 1.35 : 1.0;
        const bounty = Math.round((1850 + (data.scaleLvl || 1) * 420) * counselMult);
        if (v29.municipal.zabitaHQ || v29.municipal.policeHQ) {
          addMunicipalRevenue(data, bounty, "transit");
          v29.scaleCaughtCount = (v29.scaleCaughtCount || 0) + 1;
          rcFloats.push({ wx: 22, wz: -38, text: `🏛️ BELEDİYE ZABITA CEZASI +${bounty}₺`, color: "#38bdf8", life: 1.9 });
        } else {
          activeScaleSuspect = {
            plate: `34 KCK ${100 + Math.floor(Math.random() * 890)}`,
            tons: (44 + Math.random() * 9).toFixed(1),
            bounty,
            timeLeft: 38
          };
        }
      }
    } else if (activeScaleSuspect) {
      activeScaleSuspect.timeLeft -= dt;
      if (activeScaleSuspect.timeLeft <= 0) activeScaleSuspect = null;
    }

    // 10) 🎤 TV Röportajı & 🏛️ Mevcut Başkan Ekrem Çetin Haberleri
    if (!activeInterview) {
      interviewTimer -= dt;
      if (interviewTimer <= 0 && (data.dayNumber || 1) >= 2) {
        interviewTimer = 80 + Math.random() * 30;
        const item = TV_INTERVIEWS[Math.floor(Math.random() * TV_INTERVIEWS.length)];
        activeInterview = Object.assign({}, item, { timeLeft: 65 });
      }
    } else {
      activeInterview.timeLeft -= dt;
      if (activeInterview.timeLeft <= 0) activeInterview = null;
    }

    if (!mayorElected) {
      incumbentNewsTimer -= dt;
      if (incumbentNewsTimer <= 0) {
        incumbentNewsTimer = 70 + Math.random() * 30;
        if (window.MetropolisV28 && data.empire && data.empire.v28) {
          const msgs = [
            `📰 BELEDİYE: ${INCUMBENT_MAYOR_NAME}, yeni otobüs ve teleferik projesini yine bütçe bahanesiyle erteledi!`,
            `📰 ŞEHİR GÜNDEMİ: Vatandaşlar mahalle taleplerini çözen hayırsever iş insanına büyük destek veriyor!`
          ];
          const m = msgs[Math.floor(Math.random() * msgs.length)];
          if (Array.isArray(data.empire.v28.headlines) && data.empire.v28.headlines[0] !== m) {
            data.empire.v28.headlines.unshift(m);
            if (data.empire.v28.headlines.length > 8) data.empire.v28.headlines.pop();
          }
        }
      }
    }

    // 11) 🚒 Kamu Güvenlik Binaları Etkisi (#29)
    if (v29.municipal.fireStation || v29.municipal.policeHQ) {
      data.security = Math.min(100, Math.max(data.security || 65, 92));
    }

    // 12) Düzenli Döngü Geliri (8.0 sn): Özel İşletmeler -> Şirket Kasasına | Vergi & Kamu Geliri -> 🏛️ Belediye Bütçesine!
    cityCycleTimer += dt;
    if (cityCycleTimer >= 8.0) {
      cityCycleTimer -= 8.0;
      const earn = calcCityCycleEarnings(data);
      if (earn.biz > 0) {
        data.cash += earn.biz;
        if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + earn.biz;
      }
      const mf = earn.muniFlow;
      if (mayorElected) {
        v29.municipal.budget = Math.max(0, Math.round((v29.municipal.budget || 0) + mf.netCycle));
        v29.municipal.dailyTaxIn = (v29.municipal.dailyTaxIn || 0) + mf.taxTotal;
        v29.municipal.dailyTransitIn = (v29.municipal.dailyTransitIn || 0) + mf.transitAndUtil;
        v29.municipal.dailyMaintOut = (v29.municipal.dailyMaintOut || 0) + mf.maintOut;
      } else {
        // Başkan Ekrem Çetin döneminde de belediye kasasında bir miktar kamu vergisi birikir
        v29.municipal.budget = Math.min(180000, Math.round((v29.municipal.budget || 72000) + mf.taxTotal * 0.35));
      }
    }

    // Uçuşan 3D Yazılar
    for (let i = rcFloats.length - 1; i >= 0; i--) {
      rcFloats[i].life -= dt;
      if (rcFloats[i].life <= 0) rcFloats.splice(i, 1);
    }

    // Sağ Menü Uyarı Parlaması
    const fab = document.getElementById("realCityBizBtn");
    if (fab) {
      const hasAction = !!(activeScaleSuspect || activeInterview || v29.citizenRequests.some((r) => !r.done && data.cash >= r.cost));
      fab.classList.toggle("reward-ready", hasAction);
    }
  }

  function onDayRollover(data) {
    const v29 = ensureV29(data);
    let bankInterestCollected = 0;

    // 🏦 Kendi Kredi Bankamızdan Günlük Taksit & Faiz Tahsilatı (#17)
    const cfoMult = v29.board && v29.board.cfo ? 1.2 : 1.0;
    for (let i = v29.playerBank.activeLoansOut.length - 1; i >= 0; i--) {
      const ln = v29.playerBank.activeLoansOut[i];
      const pay = Math.round(ln.dailyReturn * cfoMult);
      data.cash += pay;
      bankInterestCollected += pay;
      ln.daysLeft -= 1;
      if (ln.daysLeft <= 0) v29.playerBank.activeLoansOut.splice(i, 1);
    }

    // 🤝 Marka Sponsorluk Gün Sayacı (#11)
    for (let i = v29.activeSponsors.length - 1; i >= 0; i--) {
      v29.activeSponsors[i].daysLeft -= 1;
      if (v29.activeSponsors[i].daysLeft <= 0) v29.activeSponsors.splice(i, 1);
    }

    // Yeni Günde Vatandaş Taleplerini Tazele & Belediye Devlet Ödeneğini Yatır (#38)
    v29.citizenRequests = rollCitizenRequests();
    const mayorElected = !!(data.empire && data.empire.v28 && data.empire.v28.mayor && data.empire.v28.mayor.elected);
    const mf = calcMunicipalBudgetFlow(data);
    let muniStateGrant = 0;
    if (mayorElected) {
      muniStateGrant = mf.dailyGrantEst;
      v29.municipal.budget = Math.round((v29.municipal.budget || 0) + muniStateGrant);
      v29.publicSupport = Math.max(25, Math.min(98, (v29.publicSupport || 55) + mf.pol.dailySupportDelta));
    }
    const muniSummary = {
      budget: Math.round(v29.municipal.budget || 0),
      taxIn: Math.round(v29.municipal.dailyTaxIn || 0),
      transitIn: Math.round(v29.municipal.dailyTransitIn || 0),
      stateGrant: muniStateGrant,
      maintOut: Math.round(v29.municipal.dailyMaintOut || 0)
    };
    v29.municipal.dailyTaxIn = 0;
    v29.municipal.dailyTransitIn = 0;
    v29.municipal.dailyStateGrant = muniStateGrant;
    v29.municipal.dailyMaintOut = 0;
    return { bankInterestCollected, muniSummary };
  }

  // =========================================================================
  // 🏪 GERÇEK ŞEHİR İŞLETMELERİ, BELEDİYE HİZMETLERİ & KURUMSAL MODAL ARAYÜZÜ
  // =========================================================================
  function setRcTab(tab) {
    if (tab) currentRcTab = tab;
  }

  function renderRealCityModal(data, helpers) {
    const v29 = ensureV29(data);
    const body = document.getElementById("realCityBody");
    const sBadge = document.getElementById("realCitySeasonBadge");
    if (!body) return;

    const season = getCurrentSeason(data);
    if (sBadge) sBadge.textContent = season.badge;

    const modalEl = document.getElementById("realCityModal");
    if (modalEl) {
      modalEl.querySelectorAll(".rc29-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.rctab === currentRcTab);
      });
    }

    const stage = getPlayerStage(data);
    const mStatus = getMayorElectionStatus(data);
    const archMult = getArchitectCostMult(data);
    const activeSiteCount = Object.keys(activeConstructionSites).length;

    const siteBannerHtml = activeSiteCount > 0
      ? `
        <div class="rep-section" style="border-color:#facc15; background:rgba(120,53,15,0.3); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div style="font-size:12px; color:#fef08a; font-weight:800;">🏗️ ${activeSiteCount} Şantiyede 3D Sarı Kule Vinç Çalışıyor!</div>
          <button id="rc29SpeedCraneBtn" class="up-buy-btn" style="padding:5px 10px; font-size:11.5px;">⚡ Vinci Hızlandır</button>
        </div>
      `
      : "";

    // =====================================================================
    // SEKME 1: 🏪 ÇARŞI, MARKET REYONLARI, KANTAR DENETİMİ, KUYUMCU & HAL
    // =====================================================================
    if (currentRcTab === "bazaar") {
      const suspectHtml = activeScaleSuspect
        ? `
          <div class="rep-section" style="border-color:#ef4444; background:rgba(127,29,29,0.35); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <div>
                <strong style="color:#fef08a; font-size:13px;">🚓 KANTAR KAÇAK / AŞIRI YÜK TESPİTİ!</strong>
                <div style="font-size:11.5px; color:#f8fafc;">Plaka: ${activeScaleSuspect.plate} • ${activeScaleSuspect.tons} Ton (${Math.ceil(activeScaleSuspect.timeLeft)}sn)</div>
              </div>
              <button id="rc29CatchScaleBtn" class="up-buy-btn" style="background:#16a34a; color:#fff;">Ceza Kes (+${activeScaleSuspect.bounty}₺)</button>
            </div>
          </div>
        `
        : "";

      const aisleCards = MARKET_AISLES.map((a) => {
        const lvl = v29.marketAisles[a.key] || 0;
        const cost = Math.round(a.baseCost * Math.pow(1.55, lvl));
        return `
          <div class="upgrade-card" style="padding:9px 11px;">
            <div class="up-info">
              <h3 style="font-size:13.5px;">${a.emoji} ${a.name} (Sv.${lvl}/5)</h3>
              <p style="font-size:11.5px;">${a.desc}</p>
            </div>
            <button class="up-buy-btn rc29-aisle-btn" data-akey="${a.key}" ${lvl >= 5 ? "disabled" : ""}>
              ${lvl >= 5 ? "TAM ✓" : `${cost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;
      }).join("");

      const bazaarCards = BAZAAR_SHOPS.map((sh) => {
        const owned = !!v29.bazaarShops[sh.key];
        return `
          <div class="upgrade-card" style="padding:9px 11px; border-color:${owned ? "#22c55e" : "#334155"};">
            <div class="up-info">
              <h3 style="font-size:13.5px;">${sh.emoji} ${sh.name}</h3>
              <p style="font-size:11.5px;">Döngü geliri: <strong style="color:#4ade80;">+${sh.cyclePay} ₺</strong> • Halk Desteği: +${sh.supportGain}%</p>
            </div>
            <button class="up-buy-btn rc29-bazaar-btn" data-skey="${sh.key}" ${owned ? "disabled" : ""}>
              ${owned ? "AÇIK ✓" : `${sh.cost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;
      }).join("");

      const vanCost = Math.round(5200 * Math.pow(1.38, v29.deliveryAgency.vans || 0));
      const halCost = !v29.wholesaleHal.unlocked ? 22000 : Math.round(16000 * Math.pow(1.6, v29.wholesaleHal.lvl));

      const stage2Html = stage.num < 2
        ? `<div class="step-lock-card"><h4>🔒 Adım 2 Ticaret (Kuyumcu & Sebze-Meyve Hali)</h4><p>Önce istasyonda 3 pompa aç veya 3. güne ulaş; şehir tüccarı kademesi hemen açılır!</p></div>`
        : `
          <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
            <h4>💍 KUYUMCU &amp; CANLI ALTIN / DÖVİZ BÜROSU</h4>
            ${!v29.jewelry.unlocked
              ? `<button id="rc29UnlockJewelryBtn" class="primary-btn" style="padding:9px; font-size:13px;">💍 Çarşı Kuyumcu &amp; Döviz Bürosunu Aç (19.500 ₺)</button>`
              : `
                <div class="rep-row"><span>🪙 Gram Altın Kuru: <strong>${v29.jewelry.goldPrice.toLocaleString("tr-TR")} ₺</strong></span><span>Kasadaki Altın: <strong style="color:#fde047;">${v29.jewelry.goldGrams} Gr</strong></span></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin:6px 0;">
                  <button id="rc29BuyGold10" class="sal-btn">🪙 10 Gr Altın Al (${(v29.jewelry.goldPrice * 10).toLocaleString("tr-TR")}₺)</button>
                  <button id="rc29SellGoldAll" class="sal-btn" style="border-color:#22c55e; color:#86efac;">💰 Altınları Bozdur</button>
                </div>
                <div class="rep-row"><span>💵 Döviz Kuru: <strong>${v29.jewelry.fxPrice} ₺</strong></span><span>Döviz Hesabı: <strong style="color:#38bdf8;">${v29.jewelry.fxUnits} $</strong></span></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px;">
                  <button id="rc29BuyFx500" class="sal-btn">💵 500 $ Döviz Al (${Math.round(v29.jewelry.fxPrice * 500).toLocaleString("tr-TR")}₺)</button>
                  <button id="rc29SellFxAll" class="sal-btn" style="border-color:#22c55e; color:#86efac;">💰 Dövizi Bozdur</button>
                </div>
              `}
          </div>

          <div class="upgrade-card" style="border-color:#fb923c;">
            <div class="up-info">
              <h3>🚜 Şehir Sebze-Meyve &amp; Balık Hali ${v29.wholesaleHal.unlocked ? `(Sv.${v29.wholesaleHal.lvl}/5)` : ""}</h3>
              <p>Sabah halden doğrudan tedarik sağlar; Market ve Esnaf Çarşısı kârını +%25 artırır ve toptan satış geliri üretir!</p>
            </div>
            <button id="rc29HalBtn" class="up-buy-btn" ${v29.wholesaleHal.unlocked && v29.wholesaleHal.lvl >= 5 ? "disabled" : ""}>
              ${!v29.wholesaleHal.unlocked ? "Kur 22.000 ₺" : v29.wholesaleHal.lvl >= 5 ? "MAKS ✓" : `${halCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;

      body.innerHTML = `
        ${siteBannerHtml}
        ${suspectHtml}
        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>🛒 1. İSTASYON MARKET REYONLARI (Çarpan: ${getMarketAisleMult(data).toFixed(2)}x)</h4>
            <span style="font-size:11px; color:#86efac; font-weight:800;">${stage.badge}</span>
          </div>
          ${aisleCards}
        </div>

        <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
          <h4>🏪 MAHALLE ESNAF ÇARŞISI (GERÇEK DÜKKANLAR)</h4>
          ${bazaarCards}
          <div class="upgrade-card" style="margin-top:6px; border-color:#38bdf8;">
            <div class="up-info">
              <h3>🚚 Su, Tüp &amp; Kargo Dağıtım Bayiliği (${v29.deliveryAgency.vans}/8 Kamyonet)</h3>
              <p>3D mavi kamyonetlerle evlere damacana su, tüp ve kargo dağıtır (Kışın +%40 kazanç)!</p>
            </div>
            <button id="rc29BuyVanBtn" class="up-buy-btn" ${v29.deliveryAgency.vans >= 8 ? "disabled" : ""}>
              ${v29.deliveryAgency.vans >= 8 ? "8 ARAC ✓" : `${vanCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        </div>
        ${stage2Html}
      `;

      bindSiteSpeedBtn();
      const csBtn = document.getElementById("rc29CatchScaleBtn");
      if (csBtn && activeScaleSuspect) {
        csBtn.addEventListener("click", () => {
          const b = activeScaleSuspect.bounty;
          data.cash += b;
          data.security = Math.min(100, (data.security || 65) + 4);
          v29.scaleCaughtCount = (v29.scaleCaughtCount || 0) + 1;
          if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + b;
          activeScaleSuspect = null;
          helpers.sfx.policeSiren();
          helpers.showToast(`🚓 Kaçak/aşırı yüklü tıra tutanak tutuldu! +${b.toLocaleString("tr-TR")} ₺ ödül!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      }
      body.querySelectorAll(".rc29-aisle-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const a = MARKET_AISLES.find((x) => x.key === btn.dataset.akey);
          const lvl = v29.marketAisles[a.key] || 0;
          if (!a || lvl >= 5) return;
          const cost = Math.round(a.baseCost * Math.pow(1.55, lvl));
          helpers.payForBusiness(cost, a.name, () => {
            v29.marketAisles[a.key] = lvl + 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`${a.emoji} ${a.name} Sv.${lvl + 1} oldu!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      });
      body.querySelectorAll(".rc29-bazaar-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const sh = BAZAAR_SHOPS.find((x) => x.key === btn.dataset.skey);
          if (!sh || v29.bazaarShops[sh.key]) return;
          helpers.payForBusiness(sh.cost, sh.name, () => {
            v29.bazaarShops[sh.key] = true;
            v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + sh.supportGain);
            helpers.sfx.perfectHit();
            helpers.showToast(`${sh.emoji} ${sh.name} açıldı! Mahalle halkının desteği (+%${sh.supportGain}) arttı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      });
      const vBtn = document.getElementById("rc29BuyVanBtn");
      if (vBtn && v29.deliveryAgency.vans < 8) {
        vBtn.addEventListener("click", () => {
          helpers.payForBusiness(vanCost, "Su/Tüp/Kargo Dağıtım Kamyoneti", () => {
            v29.deliveryAgency.vans += 1;
            helpers.sfx.carHorn();
            helpers.showToast(`🚚 ${v29.deliveryAgency.vans}. Dağıtım Kamyoneti mahalle seferine çıktı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const ujBtn = document.getElementById("rc29UnlockJewelryBtn");
      if (ujBtn) {
        ujBtn.addEventListener("click", () => {
          helpers.payForBusiness(19500, "Kuyumcu & Döviz Bürosu", () => {
            v29.jewelry.unlocked = true;
            helpers.sfx.cashRegister();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const bg10 = document.getElementById("rc29BuyGold10");
      if (bg10) {
        bg10.addEventListener("click", () => {
          const cost = v29.jewelry.goldPrice * 10;
          helpers.payForBusiness(cost, "10 Gram Altın Alımı", () => {
            v29.jewelry.goldGrams += 10;
            helpers.sfx.cashRegister();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const sgAll = document.getElementById("rc29SellGoldAll");
      if (sgAll) {
        sgAll.addEventListener("click", () => {
          if (v29.jewelry.goldGrams <= 0) return helpers.showToast("Bozdurulacak altın yok!");
          const val = v29.jewelry.goldGrams * v29.jewelry.goldPrice;
          v29.jewelry.goldGrams = 0;
          data.cash += val;
          helpers.sfx.cashRegister();
          helpers.showToast(`🪙 Altınlar bozduruldu: +${val.toLocaleString("tr-TR")} ₺!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      }
      const bf500 = document.getElementById("rc29BuyFx500");
      if (bf500) {
        bf500.addEventListener("click", () => {
          const cost = Math.round(v29.jewelry.fxPrice * 500);
          helpers.payForBusiness(cost, "500 $ Döviz Alımı", () => {
            v29.jewelry.fxUnits += 500;
            helpers.sfx.cashRegister();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const sfAll = document.getElementById("rc29SellFxAll");
      if (sfAll) {
        sfAll.addEventListener("click", () => {
          if (v29.jewelry.fxUnits <= 0) return helpers.showToast("Bozdurulacak döviz yok!");
          const val = Math.round(v29.jewelry.fxUnits * v29.jewelry.fxPrice);
          v29.jewelry.fxUnits = 0;
          data.cash += val;
          helpers.sfx.cashRegister();
          helpers.showToast(`💵 Döviz bozduruldu: +${val.toLocaleString("tr-TR")} ₺!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      }
      const hBtn = document.getElementById("rc29HalBtn");
      if (hBtn) {
        hBtn.addEventListener("click", () => {
          helpers.payForBusiness(halCost, "Sebze-Meyve & Balık Hali", () => {
            if (!v29.wholesaleHal.unlocked) v29.wholesaleHal.unlocked = true;
            else v29.wholesaleHal.lvl += 1;
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      return;
    }

    // =====================================================================
    // SEKME 2: 🏗️ MÜTEAHHİTLİK (YAP-SAT-KİRALA), DEĞERLENEN EMLAK & SANAYİ
    // =====================================================================
    if (currentRcTab === "builder") {
      if (stage.num < 2) {
        body.innerHTML = `<div class="step-lock-card"><h4>🔒 Adım 2: Müteahhitlik, Emlak & Oto Sanayi</h4><p>Bu gerçek şehir yatırımlarını açmak için önce 1. İstasyonda 3 pompa aç veya 2. Araziyi al!</p></div>`;
        return;
      }

      const nMult = calcNeighborhoodMultiplier(data);
      const housingHtml = HOUSING_PROJECTS.map((hp) => {
        const st = v29.housing[hp.key];
        const totalCost = Math.round((hp.landCost + hp.buildCost) * archMult);
        const sellVal = Math.round(hp.sellTotal * Math.min(1.6, nMult));
        let btns = "";
        if (!st.built) {
          btns = `<button class="shop-action-btn buy-deed rc29-house-act" data-hkey="${hp.key}" data-act="build">🏗️ Arsa Al &amp; İnşa Et (${totalCost.toLocaleString("tr-TR")} ₺)</button>`;
        } else if (st.mode === "ready") {
          btns = `
            <button class="shop-action-btn rent-fixed rc29-house-act" data-hkey="${hp.key}" data-act="sell">💵 Daireleri Peşin Sat (+${sellVal.toLocaleString("tr-TR")} ₺)</button>
            <button class="shop-action-btn rent-share rc29-house-act" data-hkey="${hp.key}" data-act="rent">🔑 Kiraya Ver (+${hp.cycleRent} ₺/döngü)</button>
          `;
        } else if (st.mode === "rented") {
          btns = `<button class="shop-action-btn up-rent rc29-house-act" data-hkey="${hp.key}" data-act="sell">💵 Kiracılı Binayı Toplu Sat (+${sellVal.toLocaleString("tr-TR")} ₺)</button>`;
        }
        return `
          <div class="mall-shop-card ${st.mode === "rented" ? "rented" : st.built ? "owned" : ""}">
            <div class="shop-top-row">
              <div class="shop-title">${hp.emoji} ${hp.name}</div>
              <span class="shop-status-tag ${st.mode === "rented" ? "tag-rented" : st.built ? "tag-vacant" : "tag-sale"}">
                ${st.mode === "rented" ? "KİRA GETİRİYOR" : st.built ? "SATIŞA HAZIR" : `Satılan: ${st.soldCount || 0}`}
              </span>
            </div>
            <div class="shop-btn-row">${btns}</div>
          </div>
        `;
      }).join("");

      const parcelHtml = NEIGHBORHOOD_PARCELS.map((np) => {
        const st = v29.parcels[np.key];
        const curPrice = Math.round(np.basePrice * nMult);
        return `
          <div class="upgrade-card" style="padding:9px 11px; border-color:${st.owned ? "#22c55e" : "#334155"};">
            <div class="up-info">
              <h3 style="font-size:13.5px;">📈 ${np.name}</h3>
              <p style="font-size:11.5px;">Güncel Mahalle Değeri (${nMult}x): <strong style="color:#4ade80;">${curPrice.toLocaleString("tr-TR")} ₺</strong> ${st.owned ? `(Alış: ${st.boughtAtMult}x)` : ""}</p>
            </div>
            <button class="up-buy-btn rc29-parcel-btn" data-pkey="${np.key}" style="${st.owned ? "background:#16a34a;color:#fff;" : ""}">
              ${st.owned ? `💰 Sat (+${curPrice.toLocaleString("tr-TR")}₺)` : `Tapu Al (${curPrice.toLocaleString("tr-TR")}₺)`}
            </button>
          </div>
        `;
      }).join("");

      const sanayiCost = !v29.autoIndustry.unlocked ? 26000 : Math.round(19000 * Math.pow(1.6, v29.autoIndustry.lvl));
      const drvCost = !v29.drivingSchool.unlocked ? 18500 : Math.round(13500 * Math.pow(1.55, v29.drivingSchool.lvl));
      const wedCost = !v29.weddingHall.unlocked ? 32000 : Math.round(22000 * Math.pow(1.6, v29.weddingHall.lvl));

      body.innerHTML = `
        ${siteBannerHtml}
        <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
          <h4>🏗️ MÜTEAHHİTLİK: ARSA AL - KONUT SİTESİ YAP - SAT / KİRALA</h4>
          ${housingHtml}
        </div>

        <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
          <h4>📈 DEĞERLENEN MAHALLEDE EMLAK AL-SAT (Şehir Çarpanı: ${nMult}x)</h4>
          <p style="font-size:11.5px; color:#cbd5e1; margin-bottom:6px;">AVM, Tramvay, Park, Sahil, Teleferik ve Köprü yaptıkça mahalle arsaları gerçek hayattaki gibi değerlenir!</p>
          ${parcelHtml}
        </div>

        <div class="rep-section" style="border-color:#38bdf8;">
          <h4>🔧 OTO SANAYİ, EKSPERTİZ, SÜRÜCÜ KURSU &amp; DÜĞÜN SALONU</h4>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>🔧 Oto Sanayi Sitesi ${v29.autoIndustry.unlocked ? `(Sv.${v29.autoIndustry.lvl}/5)` : ""}</h3>
              <p>Kaporta, motor ve elektrik ustalarının çalıştığı sanayi dükkanları!</p>
            </div>
            <button id="rc29SanayiBtn" class="up-buy-btn" ${v29.autoIndustry.unlocked && v29.autoIndustry.lvl >= 5 ? "disabled" : ""}>
              ${!v29.autoIndustry.unlocked ? "Kur 26.000 ₺" : v29.autoIndustry.lvl >= 5 ? "MAKS ✓" : `${sanayiCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>🔍 Kurumsal Oto Ekspertiz Merkezi</h3>
              <p>2. El Oto Pazarında yenilediğin araçların satış değerini kalıcı olarak +%25 artırır!</p>
            </div>
            <button id="rc29EkspertizBtn" class="up-buy-btn" ${v29.autoIndustry.ekspertiz || !v29.autoIndustry.unlocked ? "disabled" : ""}>
              ${v29.autoIndustry.ekspertiz ? "AKTİF ✓" : !v29.autoIndustry.unlocked ? "Önce Sanayi Kur" : "16.000 ₺"}
            </button>
          </div>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>🎓 Sürücü Kursu &amp; Direksiyon Eğitim Pisti ${v29.drivingSchool.unlocked ? `(Sv.${v29.drivingSchool.lvl}/5)` : ""}</h3>
              <p>Ehliyet adaylarına direksiyon eğitimi verir, düzenli kurs kayıt geliri sağlar!</p>
            </div>
            <button id="rc29DrvSchoolBtn" class="up-buy-btn" ${v29.drivingSchool.unlocked && v29.drivingSchool.lvl >= 5 ? "disabled" : ""}>
              ${!v29.drivingSchool.unlocked ? "Aç 18.500 ₺" : v29.drivingSchool.lvl >= 5 ? "MAKS ✓" : `${drvCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>👰 Düğün, Nişan &amp; Balo Salonu ${v29.weddingHall.unlocked ? `(Sv.${v29.weddingHall.lvl}/5)` : ""}</h3>
              <p>Organizasyon geliri üretir ve bulvardan geçen 3D Düğün Konvoyu bahşişini 4 katına çıkarır!</p>
            </div>
            <button id="rc29WedHallBtn" class="up-buy-btn" ${v29.weddingHall.unlocked && v29.weddingHall.lvl >= 5 ? "disabled" : ""}>
              ${!v29.weddingHall.unlocked ? "Aç 32.000 ₺" : v29.weddingHall.lvl >= 5 ? "MAKS ✓" : `${wedCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        </div>
      `;

      bindSiteSpeedBtn();
      body.querySelectorAll(".rc29-house-act").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hp = HOUSING_PROJECTS.find((x) => x.key === btn.dataset.hkey);
          const st = v29.housing[hp.key];
          const act = btn.dataset.act;
          const totalCost = Math.round((hp.landCost + hp.buildCost) * archMult);
          const sellVal = Math.round(hp.sellTotal * Math.min(1.6, nMult));
          if (act === "build") {
            helpers.payForBusiness(totalCost, `${hp.name} İnşaatı`, () => {
              st.built = true;
              st.mode = "ready";
              startConstructionSite("station", hp.name, data);
              helpers.sfx.perfectHit();
              helpers.showToast(`🏗️ ${hp.name} tamamlandı! İster daireleri sat ister kiraya ver!`);
              helpers.saveGame();
              helpers.updateHUD();
              renderRealCityModal(data, helpers);
            });
          } else if (act === "rent") {
            st.mode = "rented";
            helpers.sfx.cashRegister();
            helpers.showToast(`🔑 ${hp.name} kiracılara verildi! Düzenli kira geliri başladı.`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          } else if (act === "sell") {
            data.cash += sellVal;
            if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + Math.max(0, sellVal - totalCost);
            st.built = false;
            st.mode = null;
            st.soldCount = (st.soldCount || 0) + 1;
            helpers.sfx.cashRegister();
            helpers.showToast(`💵 Tüm daireler satıldı! Kasaya +${sellVal.toLocaleString("tr-TR")} ₺ girdi!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          }
        });
      });

      body.querySelectorAll(".rc29-parcel-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const np = NEIGHBORHOOD_PARCELS.find((x) => x.key === btn.dataset.pkey);
          const st = v29.parcels[np.key];
          const curPrice = Math.round(np.basePrice * nMult);
          if (!st.owned) {
            helpers.payForBusiness(curPrice, np.name, () => {
              st.owned = true;
              st.boughtAtMult = nMult;
              helpers.sfx.perfectHit();
              helpers.showToast(`🔑 ${np.name} alındı! Şehre tesis yaptıkça değeri artacak!`);
              helpers.saveGame();
              helpers.updateHUD();
              renderRealCityModal(data, helpers);
            });
          } else {
            st.owned = false;
            data.cash += curPrice;
            helpers.sfx.cashRegister();
            helpers.showToast(`📈 Değerlenen parsel satıldı: +${curPrice.toLocaleString("tr-TR")} ₺!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          }
        });
      });

      document.getElementById("rc29SanayiBtn").addEventListener("click", () => {
        helpers.payForBusiness(sanayiCost, "Oto Sanayi Sitesi", () => {
          if (!v29.autoIndustry.unlocked) v29.autoIndustry.unlocked = true;
          else v29.autoIndustry.lvl += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
      const ekBtn = document.getElementById("rc29EkspertizBtn");
      if (ekBtn && v29.autoIndustry.unlocked && !v29.autoIndustry.ekspertiz) {
        ekBtn.addEventListener("click", () => {
          helpers.payForBusiness(16000, "Kurumsal Oto Ekspertiz", () => {
            v29.autoIndustry.ekspertiz = true;
            helpers.sfx.perfectHit();
            helpers.showToast("🔍 Oto Ekspertiz açıldı! 2. el araç satışların artık +%25 daha değerli!");
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      document.getElementById("rc29DrvSchoolBtn").addEventListener("click", () => {
        helpers.payForBusiness(drvCost, "Sürücü Kursu & Eğitim Pisti", () => {
          if (!v29.drivingSchool.unlocked) v29.drivingSchool.unlocked = true;
          else v29.drivingSchool.lvl += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
      document.getElementById("rc29WedHallBtn").addEventListener("click", () => {
        helpers.payForBusiness(wedCost, "Düğün & Balo Salonu", () => {
          if (!v29.weddingHall.unlocked) v29.weddingHall.unlocked = true;
          else v29.weddingHall.lvl += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
      return;
    }

    // =====================================================================
    // SEKME 3: 🏖️ SAHİL ÇAY BAHÇESİ & PLAJ, GEZİ TEKNESİ, GECE PAZARI & 3D UÇUŞ
    // =====================================================================
    if (currentRcTab === "coast") {
      const beachCost = !v29.beachClub.unlocked ? 24000 : Math.round(17000 * Math.pow(1.6, v29.beachClub.lvl));
      const boatCost = Math.round(11500 * Math.pow(1.42, v29.seaTour.boats || 0));
      const airportReady = hasAirportBuilt(data);
      const flightCost = Math.round(38000 * Math.pow(1.6, v29.flights.routeLvl || 0));

      body.innerHTML = `
        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
          <h4>☕ GÜNEY SAHİL ÇAY BAHÇESİ, KAFE &amp; ŞEZLONGLU PLAJ</h4>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>🏖️ Sahil Kordon Kafe &amp; Halk Plajı ${v29.beachClub.unlocked ? `(Sv.${v29.beachClub.lvl}/5)` : ""}</h3>
              <p>Güney kumsalına 3D renkli plaj şemsiyeleri, şezlonglar ve çay bahçesi kurar (+%4 Halk Desteği)!</p>
            </div>
            <button id="rc29BeachBtn" class="up-buy-btn" ${v29.beachClub.unlocked && v29.beachClub.lvl >= 5 ? "disabled" : ""}>
              ${!v29.beachClub.unlocked ? "Aç 24.000 ₺" : v29.beachClub.lvl >= 5 ? "MAKS ✓" : `${beachCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>🛥️ Koy Turu Gezi Teknesi &amp; Deniz Taksi (${v29.seaTour.boats}/6 Tekne)</h3>
              <p>Marinadan kalkıp 3D sahil boyunca gezi turu ve deniz ulaşımı sağlar!</p>
            </div>
            <button id="rc29TourBoatBtn" class="up-buy-btn" ${v29.seaTour.boats >= 6 ? "disabled" : ""}>
              ${v29.seaTour.boats >= 6 ? "6 TEKNE ✓" : `${boatCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>

          <div class="upgrade-card" style="border-color:#f472b6;">
            <div class="up-info">
              <h3>🎪 Hafta Sonu Gece Pazarı &amp; Lezzet Karavanları</h3>
              <p>Bulvar meydanına ışıklı 3D sokak lezzeti karavanları ve alışveriş çadırları kurar (60 sn canlı kazanç)!</p>
            </div>
            <button id="rc29NightMarketBtn" class="up-buy-btn" ${nightMarketTimer > 0 ? "disabled" : ""}>
              ${nightMarketTimer > 0 ? `Açık (${Math.ceil(nightMarketTimer)}sn)` : "Kur 3.200 ₺"}
            </button>
          </div>
        </div>

        <div class="rep-section" style="border-color:#fde047;">
          <h4>✈️ ŞEHİRLERARASI 3D UÇUŞ AĞI &amp; VIP ÖZEL JET (#3)</h4>
          ${!airportReady
            ? `<div class="step-lock-card"><h4>🔒 Önce Özel Havalimanı Kurmalısın</h4><p>4.–16. arazilerden birine <strong>✈️ Özel Havalimanı</strong> kurduğunda 10 çevre şehre 3D yolcu uçağı seferleri açılır!</p></div>`
            : `
              <div class="upgrade-card">
                <div class="up-info">
                  <h3>✈️ 10 Çevre Şehre 3D Yolcu Uçuş Hattı (Sv.${v29.flights.routeLvl}/5)</h3>
                  <p>3D yolcu uçağı pistten gerçekten havalanıp iner! Tamamlanan Uçuş: <strong>${v29.flights.flightsDone || 0}</strong></p>
                </div>
                <button id="rc29FlightRouteBtn" class="up-buy-btn" ${v29.flights.routeLvl >= 5 ? "disabled" : ""}>
                  ${v29.flights.routeLvl === 0 ? "Hattı Aç 38.000 ₺" : v29.flights.routeLvl >= 5 ? "TAM HAT ✓" : `${flightCost.toLocaleString("tr-TR")} ₺`}
                </button>
              </div>
              <div class="upgrade-card">
                <div class="up-info">
                  <h3>🛩️ Patron VIP Özel Jet Filosu</h3>
                  <p>Uçuş gelirlerini +%45 artırır ve uluslararası iş insanlarını şehre taşır!</p>
                </div>
                <button id="rc29VipJetBtn" class="up-buy-btn" ${v29.flights.vipJet ? "disabled" : ""}>
                  ${v29.flights.vipJet ? "HANGARDA ✓" : "85.000 ₺"}
                </button>
              </div>
            `}
        </div>
      `;

      document.getElementById("rc29BeachBtn").addEventListener("click", () => {
        helpers.payForBusiness(beachCost, "Sahil Çay Bahçesi & Halk Plajı", () => {
          if (!v29.beachClub.unlocked) {
            v29.beachClub.unlocked = true;
            v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + 4);
            helpers.showToast("🏖️ Sahil Çay Bahçesi ve 3D Plaj açıldı! Halk Desteği +%4 arttı!");
          } else {
            v29.beachClub.lvl += 1;
          }
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
      const tbBtn = document.getElementById("rc29TourBoatBtn");
      if (tbBtn && v29.seaTour.boats < 6) {
        tbBtn.addEventListener("click", () => {
          helpers.payForBusiness(boatCost, "Koy Turu Gezi Teknesi", () => {
            v29.seaTour.boats += 1;
            helpers.sfx.shipHorn();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const nmBtn = document.getElementById("rc29NightMarketBtn");
      if (nmBtn && nightMarketTimer <= 0) {
        nmBtn.addEventListener("click", () => {
          helpers.payForBusiness(3200, "Hafta Sonu Gece Pazarı & Karavanlar", () => {
            nightMarketTimer = 60;
            v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + 2);
            helpers.sfx.perfectHit();
            helpers.showToast("🎪 Meydana 3D Sokak Lezzeti Karavanları ve Gece Pazarı kuruldu!");
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const frBtn = document.getElementById("rc29FlightRouteBtn");
      if (frBtn && airportReady && v29.flights.routeLvl < 5) {
        frBtn.addEventListener("click", () => {
          helpers.payForBusiness(flightCost, "Şehirlerarası 3D Uçuş Hattı", () => {
            v29.flights.routeLvl += 1;
            flightTimer = 1.5;
            helpers.sfx.perfectHit();
            helpers.showToast("✈️ Şehirlerarası 3D Yolcu Uçağı sefere başladı!");
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      const vjBtn = document.getElementById("rc29VipJetBtn");
      if (vjBtn && airportReady && !v29.flights.vipJet) {
        vjBtn.addEventListener("click", () => {
          helpers.payForBusiness(85000, "VIP Özel Jet", () => {
            v29.flights.vipJet = true;
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }
      return;
    }

    // =====================================================================
    // SEKME 4: 🏛️ BELEDİYE BÜTÇESİ, VERGİ DAİRESİ & KAMU HİZMETLERİ!
    // =====================================================================
    if (currentRcTab === "civic") {
      const m = v29.municipal;
      const mf = calcMunicipalBudgetFlow(data);
      const devPct = Math.round((getCityDevelopmentMult(data) - 1) * 100);

      const reqCards = v29.citizenRequests.map((rq, idx) => `
        <div class="upgrade-card" style="padding:9px 11px; border-color:${rq.done ? "#22c55e" : "#facc15"};">
          <div class="up-info">
            <h3 style="font-size:13px; color:#fde68a;">🗣️ ${rq.who}</h3>
            <p style="font-size:11.5px;">"${rq.text}" • <strong style="color:#4ade80;">+%${rq.support} Halk Desteği</strong> + ${rq.reward}₺ katkı</p>
          </div>
          <button class="up-buy-btn rc29-req-btn" data-ridx="${idx}" ${rq.done ? "disabled" : ""}>
            ${rq.done ? "ÇÖZÜLDÜ ✓" : `${mStatus.elected ? "🏛️" : "💵"} Çöz (${rq.cost.toLocaleString("tr-TR")}₺)`}
          </button>
        </div>
      `).join("");

      const electionHeaderHtml = !mStatus.elected
        ? `
          <div class="rep-section" style="border-color:#f59e0b; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
              <strong style="font-size:13.5px; color:#fde047;">🏛️ Koltuktaki Başkan: ${mStatus.incumbentName}</strong>
              <span class="shift-pill" style="color:#86efac;">Senin Oyun: %${mStatus.support}</span>
            </div>
            <div style="width:100%; height:10px; background:#1e293b; border-radius:999px; overflow:hidden; display:flex; margin-bottom:6px; border:1px solid #475569;">
              <div style="width:${mStatus.support}%; background:linear-gradient(90deg,#22c55e,#4ade80);"></div>
              <div style="width:${mStatus.rivalSupport}%; background:#ef4444;"></div>
            </div>
            <div class="rep-row" style="font-size:12px; margin-bottom:5px;">
              <span>🏛️ Mevcut Belediye Hazinesi (Seçilince Devralırsın):</span>
              <strong style="color:#fde047;">${Math.round(m.budget || 72000).toLocaleString("tr-TR")} ₺</strong>
            </div>
            <div style="font-size:11.5px; color:#cbd5e1; margin-bottom:8px;">
              Belediye işleri kendi cebinden değil, <strong>vergilerle biriken Belediye Bütçesinden</strong> yapılır! Seçime girmek için 4 şartı tamamla:
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:6px; font-size:11px; font-weight:800;">
                <span style="color:${mStatus.dayOk ? "#4ade80" : "#fca5a5"};">${mStatus.dayOk ? "✅" : "⏳"} Gün 8+ veya 4 Arazi</span>
                <span style="color:${mStatus.repOk ? "#4ade80" : "#fca5a5"};">${mStatus.repOk ? "✅" : "⏳"} İtibar ≥ 75 (${Math.round(data.reputation || 50)})</span>
                <span style="color:${mStatus.monOk ? "#4ade80" : "#fca5a5"};">${mStatus.monOk ? "✅" : "⏳"} En Az 1 Şehir Eseri</span>
                <span style="color:${mStatus.supOk ? "#4ade80" : "#fca5a5"};">${mStatus.supOk ? "✅" : "⏳"} Halk Oyu ≥ %51 (%${mStatus.support})</span>
              </div>
            </div>
            <button id="rc29WinMayorBtn" class="primary-btn" style="padding:10px; font-size:13.5px;" ${mStatus.canRun ? "" : "disabled"}>
              ${mStatus.canRun ? `🗳️ SEÇİME GİR & BELEDİYE HAZİNESİNİ DEVRAL (${mStatus.campaignCost.toLocaleString("tr-TR")} ₺)` : "🔒 Önce Yukarıdaki 4 Adaylık Şartını Tamamla"}
            </button>
          </div>
        `
        : `
          <div class="rep-section" style="border-color:#22c55e; background:rgba(20,83,45,0.28); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong style="color:#4ade80; font-size:14px;">🏛️ BELEDİYE BÜTÇESİ &amp; VERGİ DAİRESİ</strong>
              <span class="shift-pill" style="color:#fde047; font-size:13px;">🏛️ ${Math.round(m.budget || 0).toLocaleString("tr-TR")} ₺</span>
            </div>
            <div class="mall-summary-bar" style="margin-bottom:8px;">
              <div class="mall-stat-pill">
                <span class="lbl">👥 ŞEHİR NÜFUSU</span>
                <span class="val" style="color:#fff;">${mf.pop.toLocaleString("tr-TR")}</span>
              </div>
              <div class="mall-stat-pill">
                <span class="lbl">📊 DÖNGÜ BÜTÇESİ</span>
                <span class="val" style="color:#4ade80;">+${mf.netCycle.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div class="mall-stat-pill">
                <span class="lbl">📈 ŞİRKET KATKISI</span>
                <span class="val" style="color:#38bdf8;">${devPct >= 0 ? `+${devPct}%` : `${devPct}%`}</span>
              </div>
            </div>
            <div class="rep-row" style="font-size:12px;"><span>🏠 Emlak &amp; Çevre Temizlik Vergisi:</span><span class="val-pos">+${mf.propTax} ₺/döngü</span></div>
            <div class="rep-row" style="font-size:12px;"><span>🏪 Esnaf Ruhsat, İlan &amp; Reklam Vergisi:</span><span class="val-pos">+${mf.bizTax} ₺/döngü</span></div>
            <div class="rep-row" style="font-size:12px;"><span>🎫 Otobüs, Köprü, Teleferik &amp; Su Geliri:</span><span class="val-pos">+${mf.transitAndUtil} ₺/döngü</span></div>
            <div class="rep-row" style="font-size:12px;"><span>👷 Belediye Hizmet &amp; Personel Gideri:</span><span class="val-neg">-${mf.maintOut} ₺/döngü</span></div>
            <div class="rep-row" style="font-size:12px; border-top:1px solid #334155; margin-top:3px; padding-top:4px;"><span>🏛️ Gün Sonu İller Bankası Ödeneği:</span><span class="val-pos">+${mf.dailyGrantEst.toLocaleString("tr-TR")} ₺/gün</span></div>

            <div style="margin-top:8px;">
              <div style="font-size:11.5px; font-weight:900; color:#fde68a; margin-bottom:5px;">⚖️ Şehir Vergi Oranı (Başkan Kararı):</div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:5px; margin-bottom:5px;">
                ${TAX_POLICIES.map((tp) => `
                  <button class="sal-btn rc29-tax-btn ${m.taxPolicy === tp.key ? "active" : ""}" data-tkey="${tp.key}" style="font-size:11px; padding:6px 4px;">
                    ${tp.short}
                  </button>
                `).join("")}
              </div>
              <div style="font-size:11px; color:#cbd5e1; margin-bottom:7px;">${mf.pol.desc}</div>
              <button id="rc29DonateMuniBtn" class="sal-btn" style="width:100%; font-size:11.5px; padding:6px; border-color:#facc15; color:#fde047;">
                🤝 Holding Kasasından Belediyeye +25.000 ₺ Şartlı Bağış Yap (+%3 Halk Oyu)
              </button>
            </div>
          </div>
        `;

      const busCost = Math.round(14000 * Math.pow(1.38, m.busCount));
      const garCost = Math.round(11000 * Math.pow(1.4, m.garbageTrucks));
      const roadCost = Math.round(28000 * Math.pow(1.65, m.roadAsphaltLvl));
      const gridCost = Math.round(34000 * Math.pow(1.65, m.powerWaterLvl));

      body.innerHTML = `
        ${electionHeaderHtml}

        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
          <h4>🗣️ VATANDAŞ &amp; MAHALLE TALEPLERİ (Çözülen: ${v29.citizenRequestsSolved || 0})</h4>
          ${reqCards}
        </div>

        <div class="rep-section" style="border-color:${mStatus.elected ? "#22c55e" : "#64748b"}; opacity:${mStatus.elected ? "1" : "0.78"};">
          <h4>🏛️ BELEDİYE BÜTÇESİYLE YAPILAN KAMU İŞLERİ ${!mStatus.elected ? "(🔒 Başkan Olunca Açılır)" : "(Şirket Parana Dokunmaz!)"}</h4>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>🚌 Belediye Otobüsü &amp; Durak Ağı (${m.busCount}/8 Otobüs)</h3>
              <p>3D mavi belediye otobüsleri; bilet geliri Belediye Kasasına akar ve şehir nüfusunu büyütür!</p>
            </div>
            <button id="rc29MuniBusBtn" class="up-buy-btn" ${!mStatus.elected || m.busCount >= 8 ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.busCount >= 8 ? "8 OTOBÜS ✓" : `🏛️ ${busCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>🗑️ Çöp Kamyonları (${m.garbageTrucks}/6) &amp; ♻️ Geri Dönüşüm</h3>
              <p>3D turuncu temizlik araçları şehri temizler, geri dönüşüm tesisi Belediye Bütçesine gelir katar!</p>
            </div>
            <button id="rc29MuniGarbageBtn" class="up-buy-btn" ${!mStatus.elected || (m.garbageTrucks >= 6 && m.recyclingPlant) ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.garbageTrucks < 6 ? `🏛️ ${garCost.toLocaleString("tr-TR")} ₺` : !m.recyclingPlant ? "🏛️ 35.000 ₺" : "TAM ✓"}
            </button>
          </div>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>🚒 İtfaiye, 🚓 Polis &amp; 👮 Zabıta Merkezleri</h3>
              <p>Şehir güvenliğini 100 tutar, yangın/kaza ve kantar cezalarını Belediye Kasasına toplar!</p>
            </div>
            <button id="rc29MuniSafetyBtn" class="up-buy-btn" ${!mStatus.elected || (m.fireStation && m.policeHQ && m.zabitaHQ) ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : !m.fireStation ? "🏛️ İtfaiye 32B₺" : !m.policeHQ ? "🏛️ Emniyet 38B₺" : !m.zabitaHQ ? "🏛️ Zabıta 25B₺" : "AKTİF ✓"}
            </button>
          </div>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>🛣️ Yol Asfaltlama &amp; Kavşak Genişletme (Sv.${m.roadAsphaltLvl}/5)</h3>
              <p>Belediye bütçesiyle yolları yeniler; tüm şehir araç akışı +%${m.roadAsphaltLvl * 5} hızlanır ve arsa değerleri artar!</p>
            </div>
            <button id="rc29MuniRoadBtn" class="up-buy-btn" ${!mStatus.elected || m.roadAsphaltLvl >= 5 ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.roadAsphaltLvl >= 5 ? "OTOBAN ✓" : `🏛️ ${roadCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>

          <div class="upgrade-card">
            <div class="up-info">
              <h3>⚡ Şehir Elektrik &amp; Su Şebekesi İdaresi (Sv.${m.powerWaterLvl}/5)</h3>
              <p>Şehrin enerji ve su şebekesini büyütür; abonelik tahsilatı Belediye Kasasını hızla doldurur!</p>
            </div>
            <button id="rc29MuniGridBtn" class="up-buy-btn" ${!mStatus.elected || m.powerWaterLvl >= 5 ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.powerWaterLvl >= 5 ? "TAM ŞEBEKE ✓" : `🏛️ ${gridCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>

          <div class="upgrade-card" style="border-color:#4ade80;">
            <div class="up-info">
              <h3>🌲 Kuzey Tepesi 3D Teleferik &amp; Mesire Alanı (#23)</h3>
              <p>Belediye bütçesiyle sahilden tepeye canlı 3D Teleferik kurar (+12.000 Nüfus &amp; yüksek bilet geliri)!</p>
            </div>
            <button id="rc29CableCarBtn" class="up-buy-btn" ${!mStatus.elected || m.cableCarUnlocked ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.cableCarUnlocked ? "3D AKTİF ✓" : "🏛️ 95.000 ₺"}
            </button>
          </div>

          <div class="upgrade-card" style="border-color:#fde047;">
            <div class="up-info">
              <h3>🌉 Ücretli 3D Körfez Asma Köprüsü (#14)</h3>
              <p>Belediyenin en büyük eseri! Dev 3D gişeli köprü (+26.000 Nüfus, +0.35x emlak değeri &amp; gişe geliri)!</p>
            </div>
            <button id="rc29BayBridgeBtn" class="up-buy-btn" ${!mStatus.elected || m.bayBridgeUnlocked ? "disabled" : ""}>
              ${!mStatus.elected ? "🔒 Başkanlık" : m.bayBridgeUnlocked ? "3D KÖPRÜ ✓" : "🏛️ 185.000 ₺"}
            </button>
          </div>
        </div>
      `;

      body.querySelectorAll(".rc29-req-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const rq = v29.citizenRequests[Number(btn.dataset.ridx)];
          if (!rq || rq.done) return;
          if (mStatus.elected) {
            // Başkan olduktan sonra vatandaş/mahalle talepleri de Belediye Bütçesinden karşılanır!
            payFromMunicipalBudget(rq.cost, rq.who, data, helpers, () => {
              rq.done = true;
              addMunicipalRevenue(data, rq.reward, "tax");
              data.reputation = Math.min(100, (data.reputation || 50) + rq.rep);
              v29.publicSupport = Math.min(98, (v29.publicSupport || 55) + rq.support);
              v29.citizenRequestsSolved = (v29.citizenRequestsSolved || 0) + 1;
              helpers.sfx.perfectHit();
              helpers.showToast(`🏛️ Mahalle talebi Belediye Bütçesinden çözüldü! Halk Desteği: %${v29.publicSupport}`);
              renderRealCityModal(data, helpers);
            });
          } else {
            // Başkan olmadan önce kendi iş insanı bütçenle mahallelere destek olup oy toplarsın!
            helpers.payForBusiness(rq.cost, rq.who, () => {
              rq.done = true;
              data.cash += rq.reward;
              data.reputation = Math.min(100, (data.reputation || 50) + rq.rep);
              v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + rq.support);
              v29.citizenRequestsSolved = (v29.citizenRequestsSolved || 0) + 1;
              helpers.sfx.perfectHit();
              helpers.showToast(`🗣️ Vatandaş talebi çözüldü! Halk Desteğin %${v29.publicSupport}'e yükseldi!`);
              helpers.saveGame();
              helpers.updateHUD();
              renderRealCityModal(data, helpers);
            });
          }
        });
      });

      const winBtn = document.getElementById("rc29WinMayorBtn");
      if (winBtn && mStatus.canRun) {
        winBtn.addEventListener("click", () => {
          helpers.payForBusiness(mStatus.campaignCost, "Büyük Belediye Başkanlığı Seçim Kampanyası", () => {
            if (data.empire && data.empire.v28) {
              data.empire.v28.mayor.elected = true;
            }
            m.budget = Math.max(125000, Math.round((m.budget || 72000) + 55000));
            data.reputation = 100;
            helpers.sfx.stadiumGoal();
            helpers.showToast(`🏛️ BAŞKAN SEÇİLDİN! Belediye Hazinesi (${m.budget.toLocaleString("tr-TR")} ₺) ve vergi yetkisi emrinde!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });
      }

      if (mStatus.elected) {
        body.querySelectorAll(".rc29-tax-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            m.taxPolicy = btn.dataset.tkey;
            helpers.sfx.tap();
            helpers.showToast(`⚖️ Belediye vergi oranı güncellendi: ${getTaxPolicyDef(v29).label}`);
            helpers.saveGame();
            helpers.updateHUD();
            renderRealCityModal(data, helpers);
          });
        });

        const donBtn = document.getElementById("rc29DonateMuniBtn");
        if (donBtn) {
          donBtn.addEventListener("click", () => {
            helpers.payForBusiness(25000, "Belediye Hazinesine Şartlı Bağış", () => {
              m.budget = Math.round((m.budget || 0) + 25000);
              v29.publicSupport = Math.min(98, (v29.publicSupport || 55) + 3);
              data.reputation = Math.min(100, (data.reputation || 50) + 3);
              helpers.sfx.perfectHit();
              helpers.showToast("🤝 Belediye Hazinesine +25.000 ₺ bağışlandı! (+%3 Halk Desteği)");
              helpers.saveGame();
              helpers.updateHUD();
              renderRealCityModal(data, helpers);
            });
          });
        }

        const bBtn = document.getElementById("rc29MuniBusBtn");
        if (bBtn && m.busCount < 8) {
          bBtn.addEventListener("click", () => {
            payFromMunicipalBudget(busCost, "Yeni 3D Belediye Otobüsü", data, helpers, () => {
              m.busCount += 1;
              helpers.sfx.carHorn();
              helpers.showToast(`🚌 ${m.busCount}. Belediye Otobüsü Belediye Bütçesiyle sefere çıktı!`);
              renderRealCityModal(data, helpers);
            });
          });
        }
        const gBtn = document.getElementById("rc29MuniGarbageBtn");
        if (gBtn) {
          gBtn.addEventListener("click", () => {
            if (m.garbageTrucks < 6) {
              payFromMunicipalBudget(garCost, "Belediye Çöp Kamyonu", data, helpers, () => {
                m.garbageTrucks += 1;
                helpers.sfx.perfectHit();
                helpers.showToast(`🗑️ ${m.garbageTrucks}. Çöp Kamyonu Belediye Bütçesiyle alındı!`);
                renderRealCityModal(data, helpers);
              });
            } else if (!m.recyclingPlant) {
              payFromMunicipalBudget(35000, "Belediye Geri Dönüşüm Tesisi", data, helpers, () => {
                m.recyclingPlant = true;
                helpers.sfx.perfectHit();
                helpers.showToast("♻️ Geri Dönüşüm Tesisi Belediye Bütçesiyle kuruldu!");
                renderRealCityModal(data, helpers);
              });
            }
          });
        }
        const sfBtn = document.getElementById("rc29MuniSafetyBtn");
        if (sfBtn) {
          sfBtn.addEventListener("click", () => {
            const cost = !m.fireStation ? 32000 : !m.policeHQ ? 38000 : 25000;
            const lbl = !m.fireStation ? "İtfaiye Merkezi" : !m.policeHQ ? "Polis Emniyet Müdürlüğü" : "Zabıta Müdürlüğü";
            payFromMunicipalBudget(cost, lbl, data, helpers, () => {
              if (!m.fireStation) m.fireStation = true;
              else if (!m.policeHQ) m.policeHQ = true;
              else m.zabitaHQ = true;
              data.security = 100;
              helpers.sfx.policeSiren();
              helpers.showToast(`🏛️ ${lbl} Belediye Bütçesiyle hizmete açıldı!`);
              renderRealCityModal(data, helpers);
            });
          });
        }
        const rdBtn = document.getElementById("rc29MuniRoadBtn");
        if (rdBtn && m.roadAsphaltLvl < 5) {
          rdBtn.addEventListener("click", () => {
            payFromMunicipalBudget(roadCost, "Yol Asfaltlama & Kavşak Genişletme", data, helpers, () => {
              m.roadAsphaltLvl += 1;
              liveAsphaltRoller = { wx: -180, wz: 10.5, timer: 12 };
              helpers.sfx.perfectHit();
              helpers.showToast("🛣️ Belediye Bütçesiyle 3D Asfalt Silindiri caddeleri yeniliyor!");
              renderRealCityModal(data, helpers);
            });
          });
        }
        const grBtn = document.getElementById("rc29MuniGridBtn");
        if (grBtn && m.powerWaterLvl < 5) {
          grBtn.addEventListener("click", () => {
            payFromMunicipalBudget(gridCost, "Elektrik & Su Şebekesi", data, helpers, () => {
              m.powerWaterLvl += 1;
              helpers.sfx.perfectHit();
              helpers.showToast(`⚡ Şehir Elektrik & Su Şebekesi Belediye Bütçesiyle Sv.${m.powerWaterLvl} oldu!`);
              renderRealCityModal(data, helpers);
            });
          });
        }
        const ccBtn = document.getElementById("rc29CableCarBtn");
        if (ccBtn && !m.cableCarUnlocked) {
          ccBtn.addEventListener("click", () => {
            payFromMunicipalBudget(95000, "Kuzey Tepesi 3D Teleferik Hattı", data, helpers, () => {
              m.cableCarUnlocked = true;
              helpers.sfx.stadiumGoal();
              helpers.showToast("🌲 3D Teleferik Hattı Belediye Bütçesiyle kuruldu!");
              renderRealCityModal(data, helpers);
            });
          });
        }
        const bbBtn = document.getElementById("rc29BayBridgeBtn");
        if (bbBtn && !m.bayBridgeUnlocked) {
          bbBtn.addEventListener("click", () => {
            payFromMunicipalBudget(185000, "Ücretli 3D Körfez Asma Köprüsü", data, helpers, () => {
              m.bayBridgeUnlocked = true;
              helpers.sfx.stadiumGoal();
              helpers.showToast("🌉 Dev 3D Körfez Asma Köprüsü Belediye Bütçesiyle açıldı!");
              renderRealCityModal(data, helpers);
            });
          });
        }
      }
      return;
    }

    // =====================================================================
    // SEKME 5: 👔 YÖNETİM KURULU, BANKAM, SPONSOR, TV RÖPORTAJI, YARIŞ & ARAÇ TASARIMI
    // =====================================================================
    const tvHtml = activeInterview
      ? `
        <div class="rep-section" style="border-color:#f43f5e; background:rgba(136,19,55,0.28); margin-bottom:10px;">
          <div style="font-size:12px; font-weight:900; color:#fda4af;">🎤 CANLI TV RÖPORTAJI &amp; HALK ANKETİ</div>
          <p style="font-size:12.5px; color:#fff; font-weight:800; margin:5px 0 8px;">${activeInterview.q}</p>
          <div style="display:grid; gap:6px;">
            ${activeInterview.opts.map((o, idx) => `
              <button class="sal-btn rc29-tv-opt" data-oidx="${idx}" style="text-align:left; padding:8px 10px; font-size:11.5px;">${o.label}</button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const raceHtml = `
      <div class="rep-section" style="border-color:#ef4444; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>🏎️ 3D GO-KART &amp; BULVAR YARIŞI (Kazanılan: ${v29.racesWon || 0} 🏆)</h4>
          ${activeRace ? `<span class="shift-pill" style="color:#fde047;">Sıra: ${activeRace.playerPos}. (%${Math.round(activeRace.progress)})</span>` : ""}
        </div>
        ${activeRace
          ? `
            <p style="font-size:12px; color:#fef08a; margin:5px 0;">3D yarış araçları bulvarda kapışıyor! Birincilik için Nitro bas!</p>
            <button id="rc29RaceBoostBtn" class="primary-btn" style="padding:9px; background:linear-gradient(180deg,#eab308,#ca8a04); color:#090d1a;" ${activeRace.boostUsed ? "disabled" : ""}>
              ${activeRace.boostUsed ? "⚡ NİTRO KULLANILDI — FİNİŞE GİDİYOR!" : "⚡ NİTRO & VİRAJ ATAĞI YAP (1. SIRAYA GEÇ!)"}
            </button>
          `
          : `
            <p style="font-size:11.5px; color:#cbd5e1; margin-bottom:6px;">Rakiplere karşı 3D bulvar yarışına katıl; 1. olursan büyük ödül senin!</p>
            <button id="rc29StartRaceBtn" class="up-buy-btn" style="width:100%; padding:9px;">🏁 Yarışa Katıl (Giriş: 2.500 ₺ ➔ Ödül: 9.500 ₺!)</button>
          `}
      </div>
    `;

    const hasBankTower = !!(data.empire && data.empire.extraLands && Object.values(data.empire.extraLands).some((st) => st && st.owned && st.projectKey === "banktower"));
    const canUnlockBank = hasBankTower || stage.num >= 3;

    const bankHtml = `
      <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
        <h4>🏦 KENDİ YATIRIM &amp; KREDİ BANKANI İŞLET (#17)</h4>
        ${!v29.playerBank.unlocked
          ? `<button id="rc29UnlockBankBtn" class="primary-btn" style="padding:9px; font-size:13px;" ${canUnlockBank ? "" : "disabled"}>
              ${canUnlockBank ? "🏦 Kendi Kredi Bankanı Kur (85.000 ₺ Sermaye)" : "🔒 Aşama 3 veya Finans Kulesi Gerekli"}
            </button>`
          : `
            <div style="font-size:11.5px; color:#86efac; margin-bottom:6px;">Aktif Verilen Krediler: <strong>${v29.playerBank.activeLoansOut.length}/4</strong> (Her gün sonu faiziyle tahsil edilir!)</div>
            ${LENDING_PACKS.map((lp) => `
              <div class="upgrade-card" style="padding:8px 10px;">
                <div class="up-info">
                  <h3 style="font-size:13px;">${lp.emoji} ${lp.name}</h3>
                  <p style="font-size:11px;">${lp.desc}</p>
                </div>
                <button class="up-buy-btn rc29-lend-btn" data-lkey="${lp.key}" ${v29.playerBank.activeLoansOut.length >= 4 ? "disabled" : ""}>
                  Ver (${lp.principal.toLocaleString("tr-TR")}₺)
                </button>
              </div>
            `).join("")}
          `}
      </div>
    `;

    const boardHtml = BOARD_MEMBERS.map((bm) => {
      const hired = !!v29.board[bm.key];
      return `
        <div class="upgrade-card" style="padding:8px 10px; border-color:${hired ? "#22c55e" : "#334155"};">
          <div class="up-info">
            <h3 style="font-size:13px;">${bm.emoji} ${bm.name}</h3>
            <p style="font-size:11px;">${bm.desc}</p>
          </div>
          <button class="up-buy-btn rc29-board-btn" data-bkey="${bm.key}" ${hired ? "disabled" : ""}>
            ${hired ? "KURULDA ✓" : `${bm.cost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
      `;
    }).join("");

    const sponsorHtml = SPONSOR_DEALS.map((sp) => {
      const active = v29.activeSponsors.find((x) => x.key === sp.key);
      const repOk = (data.reputation || 50) >= sp.minRep;
      return `
        <div class="upgrade-card" style="padding:8px 10px; border-color:${active ? "#22c55e" : "#334155"};">
          <div class="up-info">
            <h3 style="font-size:13px;">${sp.emoji} ${sp.brand}</h3>
            <p style="font-size:11px;">${sp.desc}</p>
          </div>
          <button class="up-buy-btn rc29-spon-btn" data-spkey="${sp.key}" ${active || !repOk ? "disabled" : ""}>
            ${active ? `${active.daysLeft}g Aktif` : !repOk ? `İtibar ${sp.minRep}` : `İmzala (+${sp.upfront.toLocaleString("tr-TR")}₺)`}
          </button>
        </div>
      `;
    }).join("");

    const bbCost = Math.round(7500 * Math.pow(1.4, v29.media.billboards || 0));

    body.innerHTML = `
      ${tvHtml}
      ${raceHtml}
      ${bankHtml}

      <div class="rep-section" style="border-color:#a855f7; margin-bottom:10px;">
        <h4>🎨 PATRON UNVANI &amp; 3D NEON MAKAM ARACI TASARIMI (#18)</h4>
        <div style="font-size:11.5px; color:#cbd5e1; margin-bottom:4px;">Patron Görünümü:</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
          ${BOSS_AVATARS.map((av) => `<button class="sal-btn rc29-av-btn ${v29.bossStyle.avatar === av.key ? "active" : ""}" data-av="${av.key}" style="font-size:11px; padding:4px 8px;">${av.label}</button>`).join("")}
        </div>
        <div style="font-size:11.5px; color:#cbd5e1; margin-bottom:4px;">3D Makam Aracı Rengi:</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
          ${CAR_PAINT_COLORS.map((cp) => `<button class="sal-btn rc29-cp-btn ${v29.bossStyle.carColor === cp.key ? "active" : ""}" data-cp="${cp.key}" style="font-size:11px; padding:4px 8px;">${cp.label}</button>`).join("")}
        </div>
        <div style="font-size:11.5px; color:#cbd5e1; margin-bottom:4px;">3D Araç Altı Neon LED &amp; Jant:</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px;">
          ${CAR_NEON_COLORS.map((nc) => `<button class="sal-btn rc29-neon-btn ${v29.bossStyle.neon === nc.key ? "active" : ""}" data-nc="${nc.key}" style="font-size:11px; padding:4px 8px;">${nc.label}</button>`).join("")}
          ${CAR_RIM_STYLES.map((rm) => `<button class="sal-btn rc29-rim-btn ${v29.bossStyle.rims === rm.key ? "active" : ""}" data-rm="${rm.key}" style="font-size:11px; padding:4px 8px;">${rm.label}</button>`).join("")}
        </div>
      </div>

      <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
        <h4>👔 HOLDİNG YÖNETİM KURULU ÜYELERİ (#10)</h4>
        ${boardHtml}
      </div>

      <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
        <h4>🤝 ULUSAL MARKA SPONSORLUK ANLAŞMALARI (#11)</h4>
        ${sponsorHtml}
      </div>

      <div class="rep-section" style="border-color:#fb923c;">
        <h4>🪧 ŞEHİR REKLAM PANOLARI &amp; YEREL TV KANALI (#36)</h4>
        <div class="upgrade-card">
          <div class="up-info">
            <h3>🪧 Işıklı 3D Cadde Bilboardları (${v29.media.billboards}/8 Pano)</h3>
            <p>Şehir bulvarındaki dev panolardan diğer markalardan kira alırsın!</p>
          </div>
          <button id="rc29BillboardBtn" class="up-buy-btn" ${v29.media.billboards >= 8 ? "disabled" : ""}>
            ${v29.media.billboards >= 8 ? "8 PANO ✓" : `${bbCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
        <div class="upgrade-card">
          <div class="up-info">
            <h3>📺 Kendi Yerel TV &amp; Haber Kanalın</h3>
            <p>Reklam geliri üretir ve her seçim/anket döneminde Halk Desteğini güçlendirir!</p>
          </div>
          <button id="rc29LocalTvBtn" class="up-buy-btn" ${v29.media.localTv ? "disabled" : ""}>
            ${v29.media.localTv ? "YAYINDA ✓" : "58.000 ₺"}
          </button>
        </div>
      </div>
    `;

    function bindSiteSpeedBtn() {
      const sb = document.getElementById("rc29SpeedCraneBtn");
      if (sb) {
        sb.addEventListener("click", () => {
          speedUpAllSites(helpers);
          renderRealCityModal(data, helpers);
        });
      }
    }

    body.querySelectorAll(".rc29-tv-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!activeInterview) return;
        const o = activeInterview.opts[Number(btn.dataset.oidx)];
        v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + (o.support || 0));
        data.reputation = Math.min(100, (data.reputation || 50) + (o.rep || 0));
        if (o.cash) data.cash += o.cash;
        if (o.morale && data.empire && data.empire.v23) {
          data.empire.v23.morale = Math.min(150, (data.empire.v23.morale || 100) + o.morale);
        }
        activeInterview = null;
        helpers.sfx.perfectHit();
        helpers.showToast(`🎤 Canlı yayın büyük beğeni topladı! Halk Desteğin: %${v29.publicSupport}`);
        helpers.saveGame();
        helpers.updateHUD();
        renderRealCityModal(data, helpers);
      });
    });

    const srBtn = document.getElementById("rc29StartRaceBtn");
    if (srBtn && !activeRace) {
      srBtn.addEventListener("click", () => {
        helpers.payForBusiness(2500, "3D Bulvar & Go-Kart Yarışı Girişi", () => {
          activeRace = { progress: 5, playerPos: 2, boostUsed: false, timer: 12, prize: 9500 };
          liveRaceCars.length = 0;
          const cols = [v29.bossStyle.carColor || "#dc2626", "#facc15", "#38bdf8", "#22c55e"];
          for (let i = 0; i < 4; i++) {
            liveRaceCars.push({ wx: -180 - i * 9, wz: 10.6 + (i % 2) * 2.2, speed: 48 + i * 2, color: cols[i] });
          }
          helpers.sfx.carHorn();
          renderRealCityModal(data, helpers);
        });
      });
    }
    const rbBtn = document.getElementById("rc29RaceBoostBtn");
    if (rbBtn && activeRace && !activeRace.boostUsed) {
      rbBtn.addEventListener("click", () => {
        activeRace.boostUsed = true;
        activeRace.playerPos = 1;
        activeRace.progress = Math.min(95, activeRace.progress + 35);
        helpers.sfx.perfectHit();
        renderRealCityModal(data, helpers);
      });
    }

    const ubBtn = document.getElementById("rc29UnlockBankBtn");
    if (ubBtn && canUnlockBank && !v29.playerBank.unlocked) {
      ubBtn.addEventListener("click", () => {
        helpers.payForBusiness(85000, "Kendi Kredi Bankanı Kurma Sermayesi", () => {
          v29.playerBank.unlocked = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🏦 Kendi Kredi Bankan açıldı! Artık esnafa ve şirketlere faizle kredi verebilirsin!");
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
    }
    body.querySelectorAll(".rc29-lend-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lp = LENDING_PACKS.find((x) => x.key === btn.dataset.lkey);
        if (!lp || v29.playerBank.activeLoansOut.length >= 4) return;
        helpers.payForBusiness(lp.principal, lp.name, () => {
          v29.playerBank.activeLoansOut.push({
            key: lp.key,
            name: lp.name,
            dailyReturn: lp.dailyReturn,
            daysLeft: lp.days
          });
          helpers.sfx.cashRegister();
          helpers.showToast(`🏦 Kredi kullandırıldı! ${lp.days} gün boyunca günde +${lp.dailyReturn.toLocaleString("tr-TR")} ₺ tahsil edilecek!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
    });

    body.querySelectorAll(".rc29-av-btn").forEach((b) => {
      b.addEventListener("click", () => {
        v29.bossStyle.avatar = b.dataset.av;
        helpers.sfx.tap();
        helpers.saveGame();
        renderRealCityModal(data, helpers);
      });
    });
    body.querySelectorAll(".rc29-cp-btn").forEach((b) => {
      b.addEventListener("click", () => {
        v29.bossStyle.carColor = b.dataset.cp;
        helpers.sfx.tap();
        helpers.saveGame();
        renderRealCityModal(data, helpers);
      });
    });
    body.querySelectorAll(".rc29-neon-btn").forEach((b) => {
      b.addEventListener("click", () => {
        v29.bossStyle.neon = b.dataset.nc;
        helpers.sfx.tap();
        helpers.saveGame();
        renderRealCityModal(data, helpers);
      });
    });
    body.querySelectorAll(".rc29-rim-btn").forEach((b) => {
      b.addEventListener("click", () => {
        v29.bossStyle.rims = b.dataset.rm;
        helpers.sfx.tap();
        helpers.saveGame();
        renderRealCityModal(data, helpers);
      });
    });

    body.querySelectorAll(".rc29-board-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const bm = BOARD_MEMBERS.find((x) => x.key === btn.dataset.bkey);
        if (!bm || v29.board[bm.key]) return;
        helpers.payForBusiness(bm.cost, bm.name, () => {
          v29.board[bm.key] = true;
          helpers.sfx.perfectHit();
          helpers.showToast(`👔 ${bm.name} Yönetim Kuruluna katıldı!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
    });

    body.querySelectorAll(".rc29-spon-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sp = SPONSOR_DEALS.find((x) => x.key === btn.dataset.spkey);
        if (!sp) return;
        data.cash += sp.upfront;
        if (data.daily) data.daily.realCityIncome = (data.daily.realCityIncome || 0) + sp.upfront;
        v29.activeSponsors.push({ key: sp.key, brand: sp.brand, cyclePay: sp.cyclePay, daysLeft: sp.days });
        helpers.sfx.cashRegister();
        helpers.showToast(`🤝 ${sp.brand} anlaşması imzalandı! Kasaya peşin +${sp.upfront.toLocaleString("tr-TR")} ₺ yattı!`);
        helpers.saveGame();
        helpers.updateHUD();
        renderRealCityModal(data, helpers);
      });
    });

    const bbBtn = document.getElementById("rc29BillboardBtn");
    if (bbBtn && v29.media.billboards < 8) {
      bbBtn.addEventListener("click", () => {
        helpers.payForBusiness(bbCost, "3D Cadde Reklam Panosu", () => {
          v29.media.billboards += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
    }
    const tvBtn = document.getElementById("rc29LocalTvBtn");
    if (tvBtn && !v29.media.localTv) {
      tvBtn.addEventListener("click", () => {
        helpers.payForBusiness(58000, "Yerel TV & Haber Kanalı", () => {
          v29.media.localTv = true;
          v29.publicSupport = Math.min(96, (v29.publicSupport || 14) + 6);
          helpers.sfx.perfectHit();
          helpers.showToast("📺 Yerel TV Kanalın yayına başladı! Halk Desteği +%6 arttı!");
          helpers.saveGame();
          helpers.updateHUD();
          renderRealCityModal(data, helpers);
        });
      });
    }
  }

  function getBossNeonHex(v29) {
    if (!v29 || !v29.bossStyle) return null;
    const found = CAR_NEON_COLORS.find((x) => x.key === v29.bossStyle.neon);
    return found ? found.col : null;
  }

  function get3DRenderState(data) {
    const v29 = ensureV29(data);
    return {
      v29,
      season: getCurrentSeason(data),
      streetViewActive,
      constructionSites: activeConstructionSites,
      cityBuses: liveCityBuses,
      garbageTrucks: liveGarbageTrucks,
      deliveryVans: liveDeliveryVans,
      tourBoats: liveTourBoats,
      weddingCars: liveWeddingCars,
      raceCars: liveRaceCars,
      airplane: liveAirplane,
      asphaltRoller: liveAsphaltRoller,
      beachUnlocked: !!(v29.beachClub && v29.beachClub.unlocked),
      nightMarketActive: nightMarketTimer > 0,
      cableCarUnlocked: !!(v29.municipal && v29.municipal.cableCarUnlocked),
      cableCarPhase,
      bayBridgeUnlocked: !!(v29.municipal && v29.municipal.bayBridgeUnlocked),
      billboardsCount: (v29.media && v29.media.billboards) || 0,
      bossCarColor: v29.bossStyle && v29.bossStyle.carColor,
      bossNeonColor: getBossNeonHex(v29),
      floats: rcFloats
    };
  }

  return {
    INCUMBENT_MAYOR_NAME,
    TAX_POLICIES,
    SEASONS,
    createDefaultV29,
    mergeV29,
    ensureV29,
    getPlayerStage,
    getMayorElectionStatus,
    getCurrentSeason,
    getMarketAisleMult,
    getSeasonFacilityMult,
    getArchitectCostMult,
    getCfoUtilityMult,
    getCmoCommercialMult,
    getEkspertizCarMult,
    getRoadSpeedMult,
    calcCityPopulation,
    getCityDevelopmentMult,
    calcMunicipalBudgetFlow,
    addMunicipalRevenue,
    payFromMunicipalBudget,
    calcNeighborhoodMultiplier,
    startConstructionSite,
    speedUpAllSites,
    toggleStreetView,
    isStreetView: () => streetViewActive,
    updateV29,
    onDayRollover,
    setRcTab,
    renderRealCityModal,
    get3DRenderState
  };
})();

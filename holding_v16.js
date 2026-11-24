// Son İstasyon v16.0 — Holding Ligi & Rakip Patronlar, Günlük Görevler, Büyük Otoyol Günleri,
// Kurumsal Banka & Halka Arz (SONH IPO), Özel Plaka, Lüks Yat & Haritada Uçan Patron Helikopteri!

window.HoldingV16 = (function () {
  // 1) 5 RAKİP HOLDİNG & ALT ŞİRKETLERİ (Yarış, Şirketlerini Tek Tek Satın Al veya Holdingi Devral!)
  const RIVAL_DEFS = [
    {
      key: "anadolu",
      name: "Anadolu Petrol A.Ş.",
      boss: "Hakkı Bey",
      emoji: "⛽",
      startVal: 65000,
      growth: 0.035,
      buyout: 95000,
      cycleIncome: 280,
      cycleSec: 9,
      companies: [
        { id: "anadolu_ist", emoji: "⛽", name: "Anadolu Otoban İstasyonu", price: 28000, cycleIncome: 95 },
        { id: "anadolu_lpg", emoji: "🔵", name: "Anadolu LPG Dolum Tesisi", price: 35000, cycleIncome: 125 },
        { id: "anadolu_tank", emoji: "🚛", name: "Anadolu Tanker Dağıtım", price: 42000, cycleIncome: 160 }
      ]
    },
    {
      key: "kuzey",
      name: "Kuzey Otoyol Grup",
      boss: "Selçuk Bey",
      emoji: "🛣️",
      startVal: 185000,
      growth: 0.04,
      buyout: 260000,
      cycleIncome: 620,
      cycleSec: 9.5,
      companies: [
        { id: "kuzey_dinlenme", emoji: "🍽️", name: "Kuzey Dinlenme Tesisleri", price: 75000, cycleIncome: 240 },
        { id: "kuzey_otopark", emoji: "🅿️", name: "Kuzey Katlı Otopark A.Ş.", price: 90000, cycleIncome: 300 },
        { id: "kuzey_kargo", emoji: "📦", name: "Kuzey Ekspres Kargo", price: 115000, cycleIncome: 390 }
      ]
    },
    {
      key: "yildiz",
      name: "Yıldız AVM & Lojistik",
      boss: "Aysel Hanım",
      emoji: "🏬",
      startVal: 420000,
      growth: 0.045,
      buyout: 600000,
      cycleIncome: 1350,
      cycleSec: 10,
      companies: [
        { id: "yildiz_avm", emoji: "🏬", name: "Yıldız Cadde AVM", price: 175000, cycleIncome: 580 },
        { id: "yildiz_depo", emoji: "🏭", name: "Yıldız Soğuk Hava Deposu", price: 210000, cycleIncome: 720 },
        { id: "yildiz_plaza", emoji: "🏢", name: "Yıldız Ticaret Plazası", price: 260000, cycleIncome: 910 }
      ]
    },
    {
      key: "altinvadi",
      name: "Altın Vadi Turizm",
      boss: "Turgut Bey",
      emoji: "🏨",
      startVal: 860000,
      growth: 0.05,
      buyout: 1200000,
      cycleIncome: 2700,
      cycleSec: 10.5,
      companies: [
        { id: "altin_termal", emoji: "♨️", name: "Altın Vadi Termal Otel", price: 340000, cycleIncome: 1150 },
        { id: "altin_marina", emoji: "⛵", name: "Altın Körfez Marina A.Ş.", price: 440000, cycleIncome: 1520 },
        { id: "altin_resort", emoji: "🏖️", name: "Altın Vadi 5★ Tatil Köyü", price: 520000, cycleIncome: 1850 }
      ]
    },
    {
      key: "marmara",
      name: "Marmara Dev Holding",
      boss: "Cemil Soylu",
      emoji: "👑",
      startVal: 1750000,
      growth: 0.055,
      buyout: 2450000,
      cycleIncome: 5800,
      cycleSec: 11,
      companies: [
        { id: "marmara_enerji", emoji: "⚡", name: "Marmara Güneş & Enerji A.Ş.", price: 680000, cycleIncome: 2400 },
        { id: "marmara_oto", emoji: "🚗", name: "Marmara Otomotiv Fabrikası", price: 850000, cycleIncome: 3100 },
        { id: "marmara_bank", emoji: "🏦", name: "Marmara Yatırım & Finans", price: 1100000, cycleIncome: 4200 }
      ]
    }
  ];

  // 2) PATRON RÜTBELERİ
  const RANKS = [
    { minXp: 0, title: "Çırak Pompacı", icon: "⛽" },
    { minXp: 120, title: "İstasyoncu", icon: "🔧" },
    { minXp: 300, title: "Bölge Esnafı", icon: "🏪" },
    { minXp: 600, title: "Tesis Patronu", icon: "🏨" },
    { minXp: 1100, title: "AVM Yatırımcısı", icon: "🏬" },
    { minXp: 1800, title: "Holding Başkanı", icon: "🏢" },
    { minXp: 2800, title: "Otoyol Baronu", icon: "🚁" },
    { minXp: 4200, title: "Efsane İmparator", icon: "👑" }
  ];

  // 3) BÜYÜK OTOYOL GÜNLERİ (DİNAMİK ETKİNLİK & HAVA DURUMU)
  const SPECIAL_DAYS = [
    {
      key: "normal",
      badge: "☀️ Akıcı Gün",
      title: "☀️ Normal Otoyol Trafiği",
      desc: "Standart dengeli trafik ve kazançlar.",
      incomeMult: 1.0,
      trafficMult: 1.0,
      snow: false,
      confetti: false,
      color: "#38bdf8"
    },
    {
      key: "bayram",
      badge: "🎉 Bayram Akını",
      title: "🎉 Bayram Tatili Akını!",
      desc: "Otoyol dolup taşıyor! Trafik %60 daha hızlı, tüm gelirler +%45!",
      incomeMult: 1.45,
      trafficMult: 1.6,
      snow: false,
      confetti: true,
      color: "#f59e0b"
    },
    {
      key: "snow",
      badge: "❄️ Kar Fırtınası",
      title: "❄️ Yoğun Kar Fırtınası!",
      desc: "Yollar buzlu! Oto Çekici, Mini Motel ve Grand Otel gelirleri +%75, genel gelir +%20!",
      incomeMult: 1.2,
      towMotelMult: 1.75,
      trafficMult: 0.9,
      snow: true,
      confetti: false,
      color: "#93c5fd"
    },
    {
      key: "derby",
      badge: "⚽ Derbi & Konser",
      title: "⚽ Derbi & Konser Gecesi!",
      desc: "Taraftar ve konser kalabalığı akıyor! Otopark, AVM, Restoran ve Stadyum +%60!",
      incomeMult: 1.35,
      trafficMult: 1.4,
      snow: false,
      confetti: true,
      color: "#c084fc"
    },
    {
      key: "vip_summit",
      badge: "🌟 VIP Zirvesi",
      title: "🌟 Bölge Turizm & VIP Zirvesi!",
      desc: "Lüks araçlar ve iş insanları yolda! VIP bahşişleri ve tüm gelirler +%50!",
      incomeMult: 1.5,
      trafficMult: 1.3,
      snow: false,
      confetti: false,
      color: "#facc15"
    }
  ];

  // 4) KURUMSAL KREDİ PAKETLERİ
  const LOAN_OFFERS = [
    { key: "kobi", name: "💳 KOBİ Büyüme Kredisi", amount: 15000, days: 5, dailyPay: 3450, desc: "Anında 15.000 ₺ nakit • 5 gün x 3.450 ₺ taksit." },
    { key: "growth", name: "🏦 Tesis Yatırım Kredisi", amount: 55000, days: 6, dailyPay: 10500, desc: "Anında 55.000 ₺ nakit • 6 gün x 10.500 ₺ taksit." },
    { key: "mega", name: "👑 Holding Mega Kredisi", amount: 220000, days: 8, dailyPay: 31500, desc: "Anında 220.000 ₺ nakit • 8 gün x 31.500 ₺ taksit." }
  ];

  // 5) VIP PRESTİJ & HELİKOPTER / YAT / GENEL MERKEZ KATALOĞU (ŞAHSİ CÜZDANDAN!)
  const VIP_ASSETS = [
    { key: "yacht", name: "🛥️ Lüks Motor Yat (28m)", price: 45000, dailyRent: 1850, prestige: 180, repBonus: 10, desc: "Günde +1.850 ₺ VIP charter geliri ve +180 Prestij!" },
    { key: "helicopter", name: "🚁 Patron Helikopteri", price: 85000, dailyRent: 0, prestige: 320, repBonus: 15, desc: "Araziler arası geçişte haritada DÖNEN PERVANELİ helikopterin uçar + geçişte VIP bonusu!" },
    { key: "hq", name: "🏛️ Holding Genel Merkezi", price: 140000, dailyRent: 3200, prestige: 500, repBonus: 20, desc: "Tüm şirket gelirlerine kalıcı +%15 verimlilik ve günde +3.200 ₺ temettü!" }
  ];

  const PLATE_COST = 2500;
  const IPO_MIN_HOLDING_VALUE = 100000;

  // Canlı Görsel Efektler (Kar taneleri, Konfeti ve Uçan Helikopter!)
  const snowFlakes = [];
  const confettiBits = [];
  let heliFly = null; // { x, y, tx, ty, rotor, active }
  const rivalTimers = {};

  function generateDailyQuests(dayNum) {
    const pool = [
      { id: "cars", title: "⛽ 6 araca yakıt doldur", target: 6, reward: 550, xp: 45, kind: "company" },
      { id: "market_or_food", title: "🍽️ Market veya Restoranda 4 satış yap", target: 4, reward: 650, xp: 50, kind: "company" },
      { id: "events", title: "🕵️ 1 özel olayı çöz", target: 1, reward: 800, xp: 60, kind: "company" },
      { id: "stock_trade", title: "📈 Telefondan 1 borsa işlemi yap", target: 1, reward: 450, xp: 50, kind: "personal" },
      { id: "social_post", title: "📸 YolGram'da 1 paylaşım yap", target: 1, reward: 400, xp: 45, kind: "personal" },
      { id: "day_rev", title: "💰 Günlük 4.000 ₺ şirket geliri elde et", target: 4000, reward: 1200, xp: 75, kind: "company" }
    ];
    // Her gün deterministik olmayan 3 farklı görev seç
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((q) => Object.assign({}, q, { progress: 0, claimed: false, day: dayNum }));
  }

  function createDefaultV16() {
    const rivals = {};
    RIVAL_DEFS.forEach((r) => {
      const companies = {};
      r.companies.forEach((c) => { companies[c.id] = false; });
      rivals[r.key] = { value: r.startVal, acquired: false, companies };
    });
    return {
      xp: 0,
      rivals,
      quests: generateDailyQuests(1),
      specialDayKey: "normal",
      activeLoan: null, // { key, name, remainingDays, dailyPay }
      ipoLaunched: false,
      ipoStockPrice: 150,
      ipoPrevPrice: 150,
      ipoMyShares: 0,
      customPlate: "",
      vipAssets: { yacht: false, helicopter: false, hq: false },
      dailyStockTrades: 0,
      dailySocialPosts: 0,
      dailyEventsSolved: 0
    };
  }

  function mergeV16(saved) {
    const def = createDefaultV16();
    if (!saved) return def;
    const out = Object.assign(def, saved);
    out.rivals = Object.assign({}, def.rivals);
    RIVAL_DEFS.forEach((r) => {
      const defComp = {};
      r.companies.forEach((c) => { defComp[c.id] = false; });
      if (saved.rivals && saved.rivals[r.key]) {
        const sr = saved.rivals[r.key];
        const mergedComp = Object.assign({}, defComp, sr.companies || {});
        if (sr.acquired) {
          r.companies.forEach((c) => { mergedComp[c.id] = true; });
        }
        const allOwned = r.companies.every((c) => !!mergedComp[c.id]);
        out.rivals[r.key] = Object.assign({ value: r.startVal, acquired: allOwned }, sr, {
          acquired: allOwned || !!sr.acquired,
          companies: mergedComp
        });
      }
    });
    out.vipAssets = Object.assign(def.vipAssets, saved.vipAssets || {});
    if (!Array.isArray(out.quests) || out.quests.length === 0) out.quests = def.quests;
    return out;
  }

  function getRivalOwnedCompanyIncome(rDef, st) {
    if (!st) return 0;
    let total = 0;
    rDef.companies.forEach((c) => {
      if (st.acquired || (st.companies && st.companies[c.id])) {
        total += c.cycleIncome;
      }
    });
    return total;
  }

  function getRivalRemainingBuyout(rDef, st) {
    if (!st || st.acquired) return 0;
    let sum = 0;
    let remCount = 0;
    rDef.companies.forEach((c) => {
      if (!st.companies || !st.companies[c.id]) {
        sum += c.price;
        remCount += 1;
      }
    });
    return remCount > 1 ? Math.round(sum * 0.92) : sum; // Toplu alımda %8 indirim!
  }

  function getSpecialDay(v16) {
    return SPECIAL_DAYS.find((d) => d.key === (v16 && v16.specialDayKey)) || SPECIAL_DAYS[0];
  }

  function getRank(xp) {
    let cur = RANKS[0];
    let next = RANKS[1] || null;
    for (let i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].minXp) {
        cur = RANKS[i];
        next = RANKS[i + 1] || null;
      }
    }
    return { cur, next };
  }

  function calcPlayerHoldingValue(data) {
    const emp = data.empire;
    const v16 = emp.v16;
    let val = Math.round(data.cash || 0);
    // 1. İstasyon tesis değeri
    val += (data.pumpsUnlocked || 1) * 3200 + (data.pumpSpeedLvl || 1) * 900 + (data.marketLvl || 1) * 800;
    if (data.restaurantUnlocked) val += 4500 * (data.restaurantLvl || 1);
    if (data.evUnlocked) val += 3800 * (data.evLvl || 1);
    if (data.motelUnlocked) val += 6500 * (data.motelLvl || 1);
    if (data.scaleUnlocked) val += 6000 * (data.scaleLvl || 1);
    if (data.lpgUnlocked) val += 5000 * (data.lpgLvl || 1);
    if (data.towUnlocked) val += 5500 * (data.towLvl || 1);
    if (data.busBakeryUnlocked) val += 6000 * (data.busBakeryLvl || 1);
    if (data.carWashUnlocked) val += 2500 * (data.carWashLvl || 1);
    if (data.garageUnlocked) val += 4200 * (data.garageLvl || 1);

    // 2. Arazi (Otopark + AVM)
    if (emp.land2Owned) val += 10000;
    if (emp.parkingUnlocked) val += 8000 * (emp.parkingCapLvl || 1);
    if (emp.mallUnlocked) {
      val += 15000;
      Object.values(emp.mallShops || {}).forEach((sh) => {
        if (sh.owned) val += 6000 * (sh.lvl || 1);
      });
    }

    // 3. Arazi
    if (emp.land3 && emp.land3.owned) {
      val += 25000;
      if (emp.land3.themeUnlocked) val += 18000 * (emp.land3.themeLvl || 1);
      if (emp.land3.refineryUnlocked) val += 35000;
      val += (emp.land3.fleetCount || 0) * 9500;
      if (emp.land3.resortUnlocked) val += 22000;
    }

    // 4.–10. Araziler
    if (emp.extraLands) {
      Object.values(emp.extraLands).forEach((pl) => {
        if (pl && pl.owned) val += 45000;
        if (pl && pl.projectKey) val += 60000 * (pl.floorsLvl || 1);
      });
    }

    // Devralınan rakip şirketleri
    RIVAL_DEFS.forEach((r) => {
      const st = v16.rivals[r.key];
      if (!st) return;
      r.companies.forEach((c) => {
        if (st.acquired || (st.companies && st.companies[c.id])) {
          val += c.price;
        }
      });
    });

    // Şahsi servet katkısı
    if (window.EmpireSystem) {
      val += Math.round(window.EmpireSystem.calcTotalPersonalWealth(emp) * 0.5);
    }
    return Math.round(val);
  }

  function calcVipDailyRent(v16) {
    let rent = 0;
    VIP_ASSETS.forEach((a) => {
      if (v16.vipAssets[a.key] && a.dailyRent) rent += a.dailyRent;
    });
    if (v16.ipoLaunched) {
      // Kendi holdinginden günlük temettü!
      rent += Math.round(v16.ipoStockPrice * 3.5);
    }
    return rent;
  }

  function calcVipPrestige(v16) {
    let p = v16.customPlate ? 35 : 0;
    VIP_ASSETS.forEach((a) => {
      if (v16.vipAssets[a.key]) p += a.prestige;
    });
    return p;
  }

  function triggerHelicopterFlight(helpers) {
    heliFly = { x: -40, y: 120 + Math.random() * 160, vx: 210, vy: 55, rotor: 0, active: true };
    if (helpers && helpers.onHeliBonus) helpers.onHeliBonus();
  }

  function recordQuestAction(data, actionType) {
    const v16 = data.empire && data.empire.v16;
    if (!v16) return;
    if (actionType === "stock") v16.dailyStockTrades = (v16.dailyStockTrades || 0) + 1;
    if (actionType === "social") v16.dailySocialPosts = (v16.dailySocialPosts || 0) + 1;
    if (actionType === "event") v16.dailyEventsSolved = (v16.dailyEventsSolved || 0) + 1;
    syncQuestProgress(data);
  }

  function syncQuestProgress(data) {
    const v16 = data.empire && data.empire.v16;
    if (!v16 || !v16.quests) return;
    const d = data.daily || {};
    const extTotal = d.extraLandIncomes
      ? Object.values(d.extraLandIncomes).reduce((s, v) => s + (v || 0), 0)
      : 0;
    const totalRev =
      (d.fuelIncome || 0) +
      (d.lpgIncome || 0) +
      (d.evIncome || 0) +
      (d.towIncome || 0) +
      (d.busBakeryIncome || 0) +
      (d.marketIncome || 0) +
      (d.restaurantIncome || 0) +
      (d.motelIncome || 0) +
      (d.scaleIncome || 0) +
      (d.serviceIncome || 0) +
      (d.parkingIncome || 0) +
      (d.land2Income || 0) +
      (d.land3ThemeIncome || 0) +
      (d.land3RefineryIncome || 0) +
      (d.land3FleetIncome || 0) +
      (d.land3ResortIncome || 0) +
      extTotal +
      (d.rivalIncome || 0);

    v16.quests.forEach((q) => {
      if (q.id === "cars") q.progress = d.carsServed || 0;
      else if (q.id === "market_or_food") q.progress = (d.dishesServed || 0) + (d.marketServed || 0);
      else if (q.id === "events") q.progress = v16.dailyEventsSolved || 0;
      else if (q.id === "stock_trade") q.progress = v16.dailyStockTrades || 0;
      else if (q.id === "social_post") q.progress = v16.dailySocialPosts || 0;
      else if (q.id === "day_rev") q.progress = Math.round(totalRev);
    });
  }

  function hasClaimableQuest(data) {
    const v16 = data.empire && data.empire.v16;
    if (!v16 || !v16.quests) return false;
    syncQuestProgress(data);
    return v16.quests.some((q) => !q.claimed && q.progress >= q.target);
  }

  // Her Gün Sonunda Çalışır: Kredi taksiti, Rakiplerin büyümesi, Yeni Otoyol Günü, Yeni Görevler, IPO Hisse Güncellemesi!
  function onDayRollover(data) {
    const v16 = data.empire.v16;
    const summary = { loanPaid: 0, ipoDividend: 0, vipRent: 0, newSpecialDay: null };

    // 1. Kredi Taksiti
    if (v16.activeLoan && v16.activeLoan.remainingDays > 0) {
      const pay = Math.min(Math.floor(data.cash), v16.activeLoan.dailyPay);
      data.cash -= pay;
      summary.loanPaid = pay;
      v16.activeLoan.remainingDays -= 1;
      if (v16.activeLoan.remainingDays <= 0) {
        v16.activeLoan = null;
      }
    }

    // 2. VIP Yat / Genel Merkez & IPO Temettü özeti (calcDailyRent zaten şahsi cüzdana yatırır, çifte ödeme yok!)
    summary.vipRent = calcVipDailyRent(v16);

    // 3. Rakipler büyür (devralınmamış olanlar)
    RIVAL_DEFS.forEach((r) => {
      const st = v16.rivals[r.key];
      if (st && !st.acquired) {
        st.value = Math.round(st.value * (1 + r.growth * (0.7 + Math.random() * 0.6)));
      }
    });

    // 4. Kendi Holding Hissemiz (SONH) gerçek holding değerimize göre değerlenir!
    if (v16.ipoLaunched) {
      v16.ipoPrevPrice = v16.ipoStockPrice;
      const hv = calcPlayerHoldingValue(data);
      const targetPrice = Math.max(80, Math.round(hv / 1200));
      v16.ipoStockPrice = Math.max(60, Math.round(v16.ipoStockPrice * 0.65 + targetPrice * 0.35 + (Math.random() - 0.42) * 18));
    }

    // 5. Yeni Büyük Otoyol Günü Seç (Her 2 günde 1 kesin özel gün şansı yüksek!)
    const specialRoll = Math.random();
    if (specialRoll < 0.32) v16.specialDayKey = "normal";
    else if (specialRoll < 0.5) v16.specialDayKey = "bayram";
    else if (specialRoll < 0.68) v16.specialDayKey = "snow";
    else if (specialRoll < 0.85) v16.specialDayKey = "derby";
    else v16.specialDayKey = "vip_summit";
    summary.newSpecialDay = getSpecialDay(v16);

    // 6. Yeni Günlük Görevler
    v16.dailyStockTrades = 0;
    v16.dailySocialPosts = 0;
    v16.dailyEventsSolved = 0;
    v16.quests = generateDailyQuests(data.dayNumber + 1);

    return summary;
  }

  // Canlı 60 FPS Güncelleme (Devralınan rakiplerin pasif geliri + Kar/Konfeti + Helikopter uçuşu!)
  function updateV16(dt, data) {
    const v16 = data.empire && data.empire.v16;
    if (!v16) return;

    const sd = getSpecialDay(v16);
    const hqMult = v16.vipAssets.hq ? 1.15 : 1.0;

    // Devralınan Rakip Holding Şirketlerinden Sürekli Pasif Gelir
    RIVAL_DEFS.forEach((r) => {
      const st = v16.rivals[r.key];
      const baseInc = getRivalOwnedCompanyIncome(r, st);
      if (baseInc > 0) {
        rivalTimers[r.key] = (rivalTimers[r.key] || 0) + dt;
        if (rivalTimers[r.key] >= r.cycleSec) {
          rivalTimers[r.key] -= r.cycleSec;
          const earn = Math.round(baseInc * sd.incomeMult * hqMult);
          data.cash += earn;
          if (data.daily) data.daily.rivalIncome = (data.daily.rivalIncome || 0) + earn;
        }
      }
    });

    // Kar Fırtınası Animasyonu
    if (sd.snow) {
      if (snowFlakes.length < 48 && Math.random() < dt * 28) {
        snowFlakes.push({ x: Math.random() * 480, y: -6, r: 1.5 + Math.random() * 2.5, vy: 45 + Math.random() * 35, vx: -15 + Math.random() * 12 });
      }
      snowFlakes.forEach((f) => {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
      });
      for (let i = snowFlakes.length - 1; i >= 0; i--) {
        if (snowFlakes[i].y > 630) snowFlakes.splice(i, 1);
      }
    } else if (snowFlakes.length > 0) {
      snowFlakes.length = 0;
    }

    // Bayram / Derbi Konfetisi
    if (sd.confetti) {
      if (confettiBits.length < 22 && Math.random() < dt * 9) {
        confettiBits.push({
          x: Math.random() * 480,
          y: -6,
          vy: 38 + Math.random() * 28,
          col: ["#facc15", "#f472b6", "#38bdf8", "#4ade80", "#fb923c"][Math.floor(Math.random() * 5)],
          rot: Math.random() * 6
        });
      }
      confettiBits.forEach((c) => {
        c.y += c.vy * dt;
        c.rot += 4 * dt;
      });
      for (let i = confettiBits.length - 1; i >= 0; i--) {
        if (confettiBits[i].y > 630) confettiBits.splice(i, 1);
      }
    } else if (confettiBits.length > 0) {
      confettiBits.length = 0;
    }

    // Uçan Patron Helikopteri
    if (heliFly && heliFly.active) {
      heliFly.x += heliFly.vx * dt;
      heliFly.y += heliFly.vy * dt;
      heliFly.rotor += 26 * dt;
      if (heliFly.x > 540 || heliFly.y > 660) heliFly = null;
    }
  }

  // Harita Üstü Atmosfer & Helikopter Çizimi
  function renderV16Overlay(ctx, W, H, data) {
    const v16 = data.empire && data.empire.v16;
    if (!v16) return;
    const sd = getSpecialDay(v16);

    // Kar Taneleri
    if (sd.snow) {
      ctx.save();
      ctx.fillStyle = "rgba(224, 242, 254, 0.78)";
      snowFlakes.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Bayram / Konser Konfetisi
    if (sd.confetti) {
      ctx.save();
      confettiBits.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.col;
        ctx.fillRect(-3, -1.5, 6, 3);
        ctx.restore();
      });
      ctx.restore();
    }

    // Dönen Pervaneli Patron Helikopteri!
    if (heliFly && heliFly.active) {
      ctx.save();
      // Zemindeki gölge
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(heliFly.x + 16, heliFly.y + 38, 22, 10, 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(heliFly.x, heliFly.y);
      ctx.rotate(0.25);

      // Kuyruk
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-34, -3, 24, 6);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-36, -8, 4, 14);

      // Gövde
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Kokpit Camı
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.ellipse(8, 0, 7, 6.5, 0, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      // Dönen Ana Pervane
      ctx.strokeStyle = "rgba(241, 245, 249, 0.85)";
      ctx.lineWidth = 2.6;
      for (let k = 0; k < 2; k++) {
        const a = heliFly.rotor + k * (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * -32, Math.sin(a) * -32);
        ctx.lineTo(Math.cos(a) * 32, Math.sin(a) * 32);
        ctx.stroke();
      }
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // =========================================================================
  // 🏆 HOLDİNG LİGİ, GÖREVLER, BANKA/IPO & VIP GARAGE MODALI
  // =========================================================================
  let currentHubTab = "league"; // "league" | "quests" | "bank" | "vip"
  let expandedRivalKey = "anadolu";

  function setHubTab(tab) {
    currentHubTab = tab;
  }

  function renderHubModal(data, helpers) {
    const v16 = data.empire.v16;
    const body = document.getElementById("holdingHubBody");
    const rankBadge = document.getElementById("holdingRankBadge");
    if (!body) return;

    syncQuestProgress(data);
    const rk = getRank(v16.xp);
    if (rankBadge) rankBadge.textContent = `${rk.cur.icon} ${rk.cur.title} (${v16.xp} XP)`;

    document.querySelectorAll(".hub-tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.hub === currentHubTab);
    });

    // 1) HOLDİNG LİGİ & RAKİP PATRONLARIN ŞİRKETLERİNİ SATIN ALMA
    if (currentHubTab === "league") {
      const myVal = calcPlayerHoldingValue(data);
      const board = [
        { key: "player", name: `🏆 SON İSTASYON HOLDİNG${v16.customPlate ? ` [${v16.customPlate}]` : ""}`, boss: "SEN (Patron)", emoji: "⭐", value: myVal, isPlayer: true }
      ];
      RIVAL_DEFS.forEach((r) => {
        const st = v16.rivals[r.key];
        const ownedCount = r.companies.filter((c) => st.acquired || (st.companies && st.companies[c.id])).length;
        const ownedIncome = getRivalOwnedCompanyIncome(r, st);
        const remBuyout = getRivalRemainingBuyout(r, st);
        board.push({
          key: r.key,
          def: r,
          st,
          name: r.name,
          boss: r.boss,
          emoji: r.emoji,
          value: st.acquired ? 0 : st.value,
          acquired: st.acquired,
          ownedCount,
          totalCount: r.companies.length,
          ownedIncome,
          remBuyout
        });
      });
      board.sort((a, b) => b.value - a.value);
      const myPos = board.findIndex((x) => x.isPlayer) + 1;

      const sd = getSpecialDay(v16);
      let html = `
        <div class="rep-section" style="margin-bottom:8px; border-color:${sd.color};">
          <div style="font-weight:900; color:${sd.color}; font-size:13.5px;">${sd.title}</div>
          <div style="font-size:12px; color:#cbd5e1; margin-top:2px;">${sd.desc}</div>
        </div>
        <div class="rep-section" style="margin-bottom:8px; text-align:center;">
          <div style="font-size:13px; color:#fde047; font-weight:900;">Bölge Holding Sıralaman: #${myPos} / ${board.length}</div>
          <div style="font-size:17px; color:#4ade80; font-weight:900; margin-top:2px;">Holding Değerin: ${myVal.toLocaleString("tr-TR")} ₺</div>
          <div style="font-size:11.5px; color:#93c5fd; margin-top:2px;">Rakiplerin alt şirketlerini tek tek satın alıp kendi holdingine kat!</div>
        </div>
      `;

      board.forEach((row, idx) => {
        if (row.isPlayer) {
          html += `
            <div class="upgrade-card" style="border-color:#facc15; background:#1e293b;">
              <div class="up-info">
                <h3>#${idx + 1} ${row.name}</h3>
                <p>Patron: <strong>${row.boss}</strong> • Değer: <strong style="color:#4ade80;">${row.value.toLocaleString("tr-TR")} ₺</strong></p>
              </div>
              <span class="shift-pill" style="color:#fde047;">SEN</span>
            </div>
          `;
        } else {
          const isOpen = expandedRivalKey === row.key;
          let subHtml = "";
          if (isOpen) {
            const compCards = row.def.companies
              .map((c) => {
                const isBought = row.acquired || (row.st.companies && row.st.companies[c.id]);
                return `
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:#090d1a; border:1px solid ${isBought ? "#22c55e" : "#334155"}; border-radius:9px; padding:7px 9px; margin-top:6px;">
                    <div style="flex:1;">
                      <div style="font-size:12.5px; font-weight:900; color:${isBought ? "#86efac" : "#f8fafc"};">${c.emoji} ${c.name}</div>
                      <div style="font-size:11px; color:#94a3b8;">Pasif Gelir: <strong style="color:#4ade80;">+${c.cycleIncome} ₺</strong> / döngü</div>
                    </div>
                    <button class="up-buy-btn rival-comp-btn" data-rkey="${row.key}" data-cid="${c.id}" style="padding:6px 9px; font-size:11.5px;" ${isBought ? "disabled" : ""}>
                      ${isBought ? "BİZİM ✓" : `Al ${Math.round(c.price / 1000)}B₺`}
                    </button>
                  </div>
                `;
              })
              .join("");

            const bulkBtn = !row.acquired && row.ownedCount < row.totalCount - 1
              ? `<button class="primary-btn rival-buy-all-btn" data-rkey="${row.key}" style="margin-top:8px; padding:8px; font-size:12.5px; background:linear-gradient(180deg,#d97706,#92400e);">👑 Kalan Tüm Şirketleri Toplu Devral (${row.remBuyout.toLocaleString("tr-TR")} ₺ • %8 İnd.)</button>`
              : "";

            subHtml = `<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #334155;">${compCards}${bulkBtn}</div>`;
          }

          html += `
            <div class="upgrade-card" style="flex-direction:column; align-items:stretch; border-color:${row.acquired ? "#22c55e" : isOpen ? "#38bdf8" : "#334155"};">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div class="up-info">
                  <h3>#${idx + 1} ${row.emoji} ${row.name} ${row.acquired ? "👑" : ""}</h3>
                  <p>Patron: ${row.boss} • Kalan Değer: ${row.value.toLocaleString("tr-TR")} ₺<br/>
                  <span style="color:${row.ownedCount > 0 ? "#4ade80" : "#cbd5e1"}; font-weight:800;">
                    🏢 Şirketleri: ${row.ownedCount}/${row.totalCount} Bizde ${row.ownedIncome > 0 ? `(+${row.ownedIncome}₺ pasif gelir!)` : ""}
                  </span></p>
                </div>
                <button class="up-buy-btn rival-toggle-btn" data-rkey="${row.key}" style="padding:7px 10px; font-size:12px;">
                  ${isOpen ? "Gizle ▲" : row.acquired ? "BİZİM ✓" : `Şirketler (${row.totalCount}) ▼`}
                </button>
              </div>
              ${subHtml}
            </div>
          `;
        }
      });

      body.innerHTML = html;

      body.querySelectorAll(".rival-toggle-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const rkKey = btn.dataset.rkey;
          expandedRivalKey = expandedRivalKey === rkKey ? null : rkKey;
          helpers.sfx.tap();
          renderHubModal(data, helpers);
        });
      });

      body.querySelectorAll(".rival-comp-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const rDef = RIVAL_DEFS.find((x) => x.key === btn.dataset.rkey);
          if (!rDef) return;
          const cDef = rDef.companies.find((x) => x.id === btn.dataset.cid);
          const st = v16.rivals[rDef.key];
          if (!cDef || !st || st.acquired || (st.companies && st.companies[cDef.id])) return;

          const finishCompanyBuy = () => {
            if (!st.companies) st.companies = {};
            st.companies[cDef.id] = true;
            st.value = Math.max(0, Math.round(st.value - cDef.price * 0.72));
            v16.xp += 65;
            const allNow = rDef.companies.every((x) => !!st.companies[x.id]);
            if (allNow) {
              st.acquired = true;
              st.value = 0;
              v16.xp += 180;
              helpers.showToast(`👑 ${rDef.name} şirketlerinin tamamını satın aldın! (+180 XP Devralma Bonusu!)`);
            } else {
              helpers.showToast(`🏢 ${cDef.name} artık senin holdinginde! (+${cDef.cycleIncome}₺ pasif gelir)`);
            }
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            renderHubModal(data, helpers);
          };

          if (helpers.payForBusiness) {
            helpers.payForBusiness(cDef.price, `${cDef.name} Satın Alma`, finishCompanyBuy);
          } else {
            if (data.cash < cDef.price) {
              helpers.sfx.burnFail();
              return helpers.showToast(`${cDef.name} için ${cDef.price.toLocaleString("tr-TR")} ₺ gerekli!`);
            }
            data.cash -= cDef.price;
            finishCompanyBuy();
          }
        });
      });

      body.querySelectorAll(".rival-buy-all-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const rDef = RIVAL_DEFS.find((x) => x.key === btn.dataset.rkey);
          const st = rDef && v16.rivals[rDef.key];
          if (!rDef || !st || st.acquired) return;
          const remCost = getRivalRemainingBuyout(rDef, st);
          const finishBuyout = () => {
            if (!st.companies) st.companies = {};
            rDef.companies.forEach((c) => { st.companies[c.id] = true; });
            st.acquired = true;
            st.value = 0;
            v16.xp += 220;
            helpers.sfx.perfectHit();
            helpers.showToast(`🏆 ${rDef.name} tamamen holdingine katıldı! (+${getRivalOwnedCompanyIncome(rDef, st)}₺ pasif gelir!)`);
            helpers.saveGame();
            helpers.updateHUD();
            renderHubModal(data, helpers);
          };
          if (helpers.payForBusiness) {
            helpers.payForBusiness(remCost, `${rDef.name} Komple Devralma`, finishBuyout);
          } else {
            if (data.cash < remCost) {
              helpers.sfx.burnFail();
              return helpers.showToast(`Devralmak için ${remCost.toLocaleString("tr-TR")} ₺ gerekli!`);
            }
            data.cash -= remCost;
            finishBuyout();
          }
        });
      });
      return;
    }

    // 2) GÜNLÜK GÖREVLER & PATRON RÜTBESİ
    if (currentHubTab === "quests") {
      const nextTxt = rk.next ? `Sonraki Rütbe: ${rk.next.icon} ${rk.next.title} (${rk.next.minXp} XP)` : "👑 Zirvedesin: Efsane İmparator!";
      let html = `
        <div class="rep-section" style="margin-bottom:9px; border-color:#facc15;">
          <h4>${rk.cur.icon} PATRON RÜTBEN: ${rk.cur.title} (${v16.xp} XP)</h4>
          <div style="font-size:12px; color:#cbd5e1;">${nextTxt}</div>
        </div>
      `;

      v16.quests.forEach((q, idx) => {
        const done = q.progress >= q.target;
        const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
        html += `
          <div class="upgrade-card" style="${done && !q.claimed ? "border-color:#22c55e;" : ""}">
            <div class="up-info" style="flex:1;">
              <h3>${q.title}</h3>
              <p>İlerleme: <strong>${Math.min(q.progress, q.target)} / ${q.target}</strong> (%${pct}) • Ödül: <strong style="color:#4ade80;">+${q.reward} ₺ ${q.kind === "personal" ? "(Şahsi)" : "(Şirket)"}</strong> + ${q.xp} XP</p>
            </div>
            <button class="up-buy-btn quest-claim-btn" data-qidx="${idx}" ${q.claimed || !done ? "disabled" : ""}>
              ${q.claimed ? "ALINDI ✓" : done ? "🎁 AL!" : `%${pct}`}
            </button>
          </div>
        `;
      });

      body.innerHTML = html;
      body.querySelectorAll(".quest-claim-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const q = v16.quests[Number(btn.dataset.qidx)];
          if (!q || q.claimed || q.progress < q.target) return;
          q.claimed = true;
          v16.xp += q.xp;
          if (q.kind === "personal") data.empire.personalCash += q.reward;
          else data.cash += q.reward;
          helpers.sfx.perfectHit();
          helpers.showToast(`🎁 Görev tamamlandı! +${q.reward} ₺ ve +${q.xp} XP kazandın!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderHubModal(data, helpers);
        });
      });
      return;
    }

    // 3) KURUMSAL BANKA: TİCARİ KREDİ & KENDİ HOLDİNGİNİ BORSAYA AÇMA (IPO!)
    if (currentHubTab === "bank") {
      const myVal = calcPlayerHoldingValue(data);
      const ipoBonus = Math.round(myVal * 0.2);
      let html = `
        <div class="rep-section" style="margin-bottom:10px; border-color:#38bdf8;">
          <h4>🔔 KENDİ HOLDİNGİNİ BORSAYA AÇ (HALKA ARZ — SONH)</h4>
          ${
            v16.ipoLaunched
              ? `
                <div class="rep-row"><span>📈 Hisse Kodun: <strong>SONH</strong></span><span class="val-pos">${v16.ipoStockPrice} ₺</span></div>
                <div class="rep-row"><span>💰 Günlük Patron Temettüsü</span><span class="val-pos">+${Math.round(v16.ipoStockPrice * 3.5)} ₺ / gün (Şahsi)</span></div>
                <p style="font-size:12px; color:#cbd5e1; margin-top:4px;">Yeni arazi ve tesis kurdukça SONH hissen yükselir, temettün büyür!</p>
              `
              : `
                <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:8px;">
                  Holding değerin <strong>${IPO_MIN_HOLDING_VALUE.toLocaleString("tr-TR")} ₺</strong>'yi geçtiğinde şirketini borsaya açıp tek seferde <strong>+${ipoBonus.toLocaleString("tr-TR")} ₺</strong> fon ve her gün temettü kazan!
                </p>
                <button id="btnLaunchIpo" class="primary-btn" style="padding:10px; font-size:14px;" ${myVal >= IPO_MIN_HOLDING_VALUE ? "" : "disabled"}>
                  ${myVal >= IPO_MIN_HOLDING_VALUE ? `🔔 HALKA ARZ ET (+${ipoBonus.toLocaleString("tr-TR")} ₺ FON!)` : `🔒 Holding Değeri ${myVal.toLocaleString("tr-TR")} / 100.000 ₺`}
                </button>
              `
          }
        </div>
        <div class="rep-section">
          <h4>🏦 KURUMSAL TİCARİ KREDİ</h4>
      `;

      if (v16.activeLoan) {
        const payoff = v16.activeLoan.remainingDays * v16.activeLoan.dailyPay;
        html += `
          <div class="rep-row"><span>Aktif Kredi</span><strong>${v16.activeLoan.name}</strong></div>
          <div class="rep-row"><span>Kalan Taksit</span><span class="val-neg">${v16.activeLoan.remainingDays} gün x ${v16.activeLoan.dailyPay.toLocaleString("tr-TR")} ₺</span></div>
          <button id="btnPayoffLoan" class="up-buy-btn" style="width:100%; margin-top:8px;">Krediyi Erken Kapat (${payoff.toLocaleString("tr-TR")} ₺)</button>
        `;
      } else {
        LOAN_OFFERS.forEach((ln) => {
          html += `
            <div class="upgrade-card" style="margin-top:6px;">
              <div class="up-info"><h3>${ln.name}</h3><p>${ln.desc}</p></div>
              <button class="up-buy-btn loan-take-btn" data-lkey="${ln.key}">Çek</button>
            </div>
          `;
        });
      }
      html += `</div>`;
      body.innerHTML = html;

      const ipoBtn = document.getElementById("btnLaunchIpo");
      if (ipoBtn) {
        ipoBtn.addEventListener("click", () => {
          if (v16.ipoLaunched || calcPlayerHoldingValue(data) < IPO_MIN_HOLDING_VALUE) return;
          v16.ipoLaunched = true;
          v16.ipoStockPrice = Math.max(120, Math.round(calcPlayerHoldingValue(data) / 1200));
          v16.ipoPrevPrice = v16.ipoStockPrice;
          data.cash += ipoBonus;
          v16.xp += 250;
          helpers.sfx.perfectHit();
          helpers.showToast(`🔔 SONH Halka Arz Edildi! Kasaya +${ipoBonus.toLocaleString("tr-TR")} ₺ fon girdi!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderHubModal(data, helpers);
        });
      }

      const payBtn = document.getElementById("btnPayoffLoan");
      if (payBtn && v16.activeLoan) {
        payBtn.addEventListener("click", () => {
          const payoff = v16.activeLoan.remainingDays * v16.activeLoan.dailyPay;
          const finishPayoff = () => {
            v16.activeLoan = null;
            helpers.sfx.perfectHit();
            helpers.showToast("✅ Kredi borcunun tamamı kapatıldı!");
            helpers.saveGame();
            helpers.updateHUD();
            renderHubModal(data, helpers);
          };
          if (helpers.payForBusiness) {
            helpers.payForBusiness(payoff, "Kredi Erken Kapama", finishPayoff);
          } else {
            if (data.cash < payoff) {
              helpers.sfx.burnFail();
              return helpers.showToast(`Erken kapama için ${payoff.toLocaleString("tr-TR")} ₺ gerekli!`);
            }
            data.cash -= payoff;
            finishPayoff();
          }
        });
      }

      body.querySelectorAll(".loan-take-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const ln = LOAN_OFFERS.find((x) => x.key === btn.dataset.lkey);
          if (!ln || v16.activeLoan) return;
          data.cash += ln.amount;
          v16.activeLoan = { key: ln.key, name: ln.name, remainingDays: ln.days, dailyPay: ln.dailyPay };
          helpers.sfx.cashRegister();
          helpers.showToast(`🏦 ${ln.amount.toLocaleString("tr-TR")} ₺ kredi şirket kasasına yatırıldı!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderHubModal(data, helpers);
        });
      });
      return;
    }

    // 4) 🚁 VIP PRESTİJ: ÖZEL PLAKA, YAT, UÇAN HELİKOPTER & GENEL MERKEZ
    let html = `
      <div class="rep-section" style="margin-bottom:9px; border-color:#f472b6;">
        <h4>🔤 ÖZEL PATRON PLAKASI (Şahsi Bakiye: ${Math.round(data.empire.personalCash).toLocaleString("tr-TR")} ₺)</h4>
        <p style="font-size:12px; color:#cbd5e1; margin-bottom:7px;">
          ${v16.customPlate ? `Aktif Özel Plakan: <strong style="color:#fde047;">${v16.customPlate}</strong> (+35 Prestij)` : `Kendi özel plakanı belirle (örn. 34 DİJİ 01) — Ücret: ${PLATE_COST} ₺ Şahsi`}
        </p>
        <div style="display:flex; gap:6px;">
          <input id="customPlateInput" type="text" maxlength="12" placeholder="Örn: 34 DİJİ 01" value="${v16.customPlate || ""}" style="flex:1; background:#090d1a; color:#fff; border:1.5px solid #475569; border-radius:9px; padding:8px; font-weight:900; text-transform:uppercase;" />
          <button id="savePlateBtn" class="up-buy-btn">${v16.customPlate ? "Değiştir" : `${PLATE_COST}₺ Al`}</button>
        </div>
      </div>
    `;

    VIP_ASSETS.forEach((a) => {
      const owned = !!v16.vipAssets[a.key];
      html += `
        <div class="upgrade-card">
          <div class="up-info"><h3>${a.name}</h3><p>${a.desc}</p></div>
          <button class="up-buy-btn vip-buy-btn" data-vkey="${a.key}" ${owned ? "disabled" : ""}>
            ${owned ? "SAHİPSİN ✓" : `${a.price.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
      `;
    });
    body.innerHTML = html;

    const plateBtn = document.getElementById("savePlateBtn");
    if (plateBtn) {
      plateBtn.addEventListener("click", () => {
        const inp = document.getElementById("customPlateInput");
        const val = (inp ? inp.value : "").trim().toUpperCase();
        if (val.length < 3) return helpers.showToast("Lütfen geçerli bir plaka yaz (en az 3 karakter)!");
        if (!v16.customPlate) {
          if (data.empire.personalCash < PLATE_COST) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Şahsi cüzdanda ${PLATE_COST} ₺ gerekli!`);
          }
          data.empire.personalCash -= PLATE_COST;
          v16.xp += 60;
        }
        v16.customPlate = val;
        helpers.sfx.perfectHit();
        helpers.showToast(`🔤 Özel plakan [${val}] tescillendi!`);
        helpers.saveGame();
        helpers.updateHUD();
        renderHubModal(data, helpers);
      });
    }

    body.querySelectorAll(".vip-buy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = VIP_ASSETS.find((x) => x.key === btn.dataset.vkey);
        if (!a || v16.vipAssets[a.key]) return;
        if (data.empire.personalCash < a.price) {
          helpers.sfx.burnFail();
          return helpers.showToast(`Şahsi cüzdanda ${a.price.toLocaleString("tr-TR")} ₺ gerekli!`);
        }
        data.empire.personalCash -= a.price;
        v16.vipAssets[a.key] = true;
        if (a.repBonus) data.reputation = Math.min(100, data.reputation + a.repBonus);
        v16.xp += 200;
        helpers.sfx.perfectHit();
        if (a.key === "helicopter") {
          triggerHelicopterFlight(helpers);
          helpers.showToast("🚁 Patron Helikopteri alındı! Artık araziler arası helikopterinle uçuyorsun!");
        } else {
          helpers.showToast(`🎉 Hayırlı olsun! ${a.name} artık senin!`);
        }
        helpers.saveGame();
        helpers.updateHUD();
        renderHubModal(data, helpers);
      });
    });
  }

  return {
    RIVAL_DEFS,
    SPECIAL_DAYS,
    VIP_ASSETS,
    createDefaultV16,
    mergeV16,
    getSpecialDay,
    getRank,
    calcPlayerHoldingValue,
    calcVipDailyRent,
    calcVipPrestige,
    triggerHelicopterFlight,
    recordQuestAction,
    syncQuestProgress,
    hasClaimableQuest,
    onDayRollover,
    updateV16,
    renderV16Overlay,
    setHubTab,
    renderHubModal
  };
})();

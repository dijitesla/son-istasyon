// Son İstasyon v28.0 — Büyükşehir Planlaması, 1+10 Kilitli Şehir Haritası ve 17 Yeni İmparatorluk Sistemi:
// 1) 🚄 3D Hızlı Tren / Tramvay Hattı  2) 🏭 Tesisler Arası Üretim Zinciri  3) 🏛️ Belediye Seçimi & Şehir Kararları
// 4) 🌧️ Gerçekçi Hava Durumu & Islak Asfalt  5) 🏆 12 Kupa Vitrini & Cihazlar Arası Kayıt Taşıma (Mac/Windows/Mobil)
// 6) 🛵 3D Motokurye Filosu  7) 🛡️ Zırhlı Kasa Aracı (%4 Faiz) & Gece Soygunu Kovalamacası  8) 🔥 Rakip Hamleleri & Şehir Gazetesi
// 9) 🏗️ Kat Kat Karma Gökdelen (lands_4_10.js)  10) 🎪 Bulvar Rallisi & Dev Konser  11) ⭐ Özel Yetenekli Baş Müdürler
// 12) 🛳️ Dev 3D Kruvaziyer Gemisi & Balıkçı Tekneleri  13) 🚗 Araç Al-Tamir Et-Sat Oto Pazarı  14) ⛽ Ülke Çapında Bayilik (Franchise)
// 15) 🏫 Şehre Eser Bırakma (Okul, Park, Köprü, Vakıf)  16) ⏱️ Süreli Fırsat & Kriz Görevleri  17) 🌍 1 Ana Şehir + 10 Çevre Şehir!

window.MetropolisV28 = (function () {
  // =========================================================================
  // 🌍 ANA ŞEHRİN ETRAFINDAKİ 10 KİLİTLİ ÇEVRE ŞEHİR (Sırayla %100 Tamamlanınca Açılır!)
  // =========================================================================
  const SURROUNDING_CITIES = [
    {
      id: "city1", num: 1, emoji: "🌲", name: "Yeşil Sahil Kenti", angleDeg: -90,
      specialty: "Fındık, Karadeniz Sahili & Liman Ticareti (+%12 Genel Gelir)",
      basePlotCost: 95000, cycleBase: 420,
      rivals: ["Hakkı Bey", "Selçuk Bey"]
    },
    {
      id: "city2", num: 2, emoji: "⚓", name: "Kuzey Tersane Kenti", angleDeg: -54,
      specialty: "Denizcilik & Konteyner Hattı (+%14 Genel Gelir)",
      basePlotCost: 145000, cycleBase: 640,
      rivals: ["Selçuk Bey", "Aysel Hanım"]
    },
    {
      id: "city3", num: 3, emoji: "🏭", name: "Sanayi & Döküm Vadisi", angleDeg: -18,
      specialty: "Ağır Sanayi & Lojistik Üssü (+%16 Genel Gelir)",
      basePlotCost: 220000, cycleBase: 920,
      rivals: ["Hakkı Bey", "Turgut Bey"]
    },
    {
      id: "city4", num: 4, emoji: "🌾", name: "Bereket Ovası Şehri", angleDeg: 18,
      specialty: "Organik Gıda & Tarım Borsası (+%18 Genel Gelir)",
      basePlotCost: 330000, cycleBase: 1320,
      rivals: ["Aysel Hanım", "Selçuk Bey"]
    },
    {
      id: "city5", num: 5, emoji: "🏔️", name: "Termal & Kayak Kenti", angleDeg: 54,
      specialty: "Kış Turizmi & 5★ Dağ Otelleri (+%20 Genel Gelir)",
      basePlotCost: 490000, cycleBase: 1850,
      rivals: ["Turgut Bey", "Aysel Hanım"]
    },
    {
      id: "city6", num: 6, emoji: "🎓", name: "Bilim & Kampüs Şehri", angleDeg: 90,
      specialty: "Üniversite, Teknokent & Yazılım (+%22 Genel Gelir)",
      basePlotCost: 720000, cycleBase: 2550,
      rivals: ["Turgut Bey", "Cemil Soylu"]
    },
    {
      id: "city7", num: 7, emoji: "🏖️", name: "Turkuaz Kruvaziyer Koyu", angleDeg: 126,
      specialty: "Yat Marinası & Tatil Köyleri (+%25 Genel Gelir)",
      basePlotCost: 1050000, cycleBase: 3450,
      rivals: ["Aysel Hanım", "Cemil Soylu"]
    },
    {
      id: "city8", num: 8, emoji: "⚡", name: "Enerji & Rafineri Havzası", angleDeg: 162,
      specialty: "Petrol Rafinerisi & Rüzgar Tarlaları (+%28 Genel Gelir)",
      basePlotCost: 1550000, cycleBase: 4650,
      rivals: ["Hakkı Bey", "Cemil Soylu"]
    },
    {
      id: "city9", num: 9, emoji: "🏦", name: "Altın Boğaz Finans Kenti", angleDeg: 198,
      specialty: "Uluslararası Bankacılık & Borsa (+%32 Genel Gelir)",
      basePlotCost: 2300000, cycleBase: 6300,
      rivals: ["Turgut Bey", "Cemil Soylu"]
    },
    {
      id: "city10", num: 10, emoji: "👑", name: "Mega Başkent Metropolü", angleDeg: 234,
      specialty: "Ülke Ekonomisinin Zirvesi (+%40 İmparatorluk Çarpanı!)",
      basePlotCost: 3500000, cycleBase: 8900,
      rivals: ["Cemil Soylu", "Turgut Bey"]
    }
  ];

  // Her Çevre Şehirde 4 Bölge × 2 Arazi = 8 Bölgesel Arazi (Yarısı Rakip Patronlarda!)
  const SUBCITY_PLOTS = [
    { idx: 0, dist: "⛽ Otoyol Giriş Bölgesi", name: "1. Otoyol İstasyon & Dinlenme Parseli", isRival: false },
    { idx: 1, dist: "⛽ Otoyol Giriş Bölgesi", name: "2. Rakip Akaryakıt & Lojistik Üssü", isRival: true },
    { idx: 2, dist: "🏬 Merkez Çarşı Bölgesi", name: "3. Şehir Meydanı & Grand AVM Arsası", isRival: false },
    { idx: 3, dist: "🏬 Merkez Çarşı Bölgesi", name: "4. Rakip Ticaret Plazası", isRival: true },
    { idx: 4, dist: "🏭 Üretim & Teknoloji Bölgesi", name: "5. Organize Sanayi & Fabrika Parseli", isRival: false },
    { idx: 5, dist: "🏭 Üretim & Teknoloji Bölgesi", name: "6. Rakip Enerji & Depo Kompleksi", isRival: true },
    { idx: 6, dist: "🌊 Sahil & Zirve Prestij Bölgesi", name: "7. Panoramik Otel & Marina Parseli", isRival: false },
    { idx: 7, dist: "🌊 Sahil & Zirve Prestij Bölgesi", name: "8. Rakip Holding Merkez Kulesi", isRival: true }
  ];

  const SUBCITY_BUILD_CHOICES = [
    { key: "istasyon_avm", emoji: "⛽", name: "Mega İstasyon & AVM" },
    { key: "grand_otel", emoji: "🏨", name: "5★ Şehir Oteli & Marina" },
    { key: "fabrika_liman", emoji: "🏭", name: "Üretim & İhracat Üssü" },
    { key: "karma_kule", emoji: "🏙️", name: "Karma Finans Gökdeleni" }
  ];

  // 🏛️ BELEDİYE KARARNAMELERİ (#3)
  const MAYOR_DECREES = [
    { key: "festival", title: "🎉 Kültür & Turizm Festivali", desc: "Otel, AVM, Restoran ve Lunapark gelirleri +%35 artar!", bonusText: "+%35 Turizm & AVM" },
    { key: "taxcut", title: "💼 Esnaf & Holding Vergi İndirimi", desc: "Günlük fatura gideri -%45 düşer, tüm net kazançlar +%18 artar!", bonusText: "+%18 Tüm Kazançlar" },
    { key: "freetransit", title: "🚄 Ücretsiz Raylı & Toplu Ulaşım", desc: "Market, Restoran, Kurye ve İstasyon müşteri akışı +%40 hızlanır!", bonusText: "+%40 Market/Kurye" },
    { key: "urban_aid", title: "🏗️ Kentsel Dönüşüm & İmar Teşviki", desc: "Yeni yapı kurma ve kat çıkma maliyetlerinde %18 belediye indirimi!", bonusText: "-%18 İnşaat Maliyeti" }
  ];

  // 🌧️ HAVA DURUMLARI (#4)
  const WEATHER_MODES = {
    sunny: {
      key: "sunny",
      badge: "☀️ Güneşli Sıcak",
      desc: "Aquapark, Tatil Köyü, Oto Yıkama ve soğuk içecek satışları +%40 coşar!",
      wetRoad: false
    },
    rain: {
      key: "rain",
      badge: "🌧️ Sağanak Yağmur",
      desc: "3D asfalt ıslanıp parlar! Oto Çekici, Mini Motel ve Paket Servis gelirleri +%50 artar!",
      wetRoad: true
    },
    breeze: {
      key: "breeze",
      badge: "🌤️ Açık Bahar Havası",
      desc: "Dengeli otoyol akışı, Rüzgar Santrali ve Liman seferleri +%25 verimli!",
      wetRoad: false
    }
  };

  // 🏫 ŞEHRE ESER BIRAKMA (#15)
  const CIVIC_MONUMENTS = [
    { key: "school", emoji: "🏫", name: "Anadolu Lisesi & Kütüphane", cost: 48000, rep: 8, loveBonus: 0.05, wx: -150, wz: 76, desc: "Kendi markanın adını taşıyan modern okul (+8 İtibar ve kalıcı +%5 Şehir Geliri)." },
    { key: "park", emoji: "🌳", name: "Sahil Millet Bahçesi & Anıt", cost: 72000, rep: 10, loveBonus: 0.06, wx: 150, wz: 76, desc: "Palmiyeli sahil yürüyüş parkı ve fıskiye (+10 İtibar ve kalıcı +%6 Şehir Geliri)." },
    { key: "bridge", emoji: "🌉", name: "Altın Bulvar Yaya Üst Geçidi", cost: 96000, rep: 12, sec: 8, loveBonus: 0.07, wx: -56, wz: -1.5, desc: "İki bulvarı bağlayan ışıklı 3D yaya köprüsü (+12 İtibar, +8 Güvenlik, +%7 Gelir)." },
    { key: "foundation", emoji: "🏛️", name: "Bilim, Sanat & Sağlık Vakfı", cost: 165000, rep: 15, sec: 10, loveBonus: 0.10, wx: 56, wz: -73.5, desc: "Şehrin en prestijli kültür eseri (+15 İtibar, +10 Güvenlik ve kalıcı +%10 Gelir)!" }
  ];

  // ⭐ BAŞ MÜDÜRLER & ÖZEL YETENEKLERİ (#11)
  const HEAD_DIRECTORS = [
    { key: "stationChief", emoji: "⛽", name: "Baş Müdür Kemal (İstasyon)", superpower: "VIP Mıknatısı: Yakıt, Market ve Restoran gelirine seviye başı +%8 ekler!", baseCost: 8500 },
    { key: "mallChief", emoji: "🏬", name: "Direktör Leyla (AVM & Kurye)", superpower: "Perakende Dehası: AVM kiraları, Otopark ve Motokurye gelirine seviye başı +%9 ekler!", baseCost: 12000 },
    { key: "portChief", emoji: "⚓", name: "Amiral Demir (Liman & Kruvaziyer)", superpower: "Açık Deniz Hakimi: İhracat, Kruvaziyer ve Balıkçı gelirine seviye başı +%10 ekler!", baseCost: 16500 },
    { key: "cityChief", emoji: "🏙️", name: "Genel Koordinatör Selim (16 Arazi)", superpower: "Kule Mimarı: Tüm 4.–16. arazi ve çevre şehir gelirlerine seviye başı +%8 ekler!", baseCost: 22000 }
  ];

  // 🏆 12 ÖDÜLLÜ KUPA VİTRİNİ (#5)
  const ACHIEVEMENTS = [
    { id: "first_pump", icon: "⛽", title: "İlk Kıvılcım", desc: "İstasyonda en az 3 pompa aç.", reward: 1500, xp: 50, check: (d) => (d.pumpsUnlocked || 1) >= 3 },
    { id: "mall_baron", icon: "🏬", title: "AVM Patronu", desc: "2. Araziyi alıp Grand AVM'yi aç.", reward: 4500, xp: 80, check: (d) => !!(d.empire && d.empire.mallUnlocked) },
    { id: "first_rival_plot", icon: "⚔️", title: "Rakip Avcısı", desc: "Şehirde bir rakibin elindeki araziyi satın alıp devral.", reward: 12000, xp: 120, check: (d, v28) => (v28.rivalPlotsConquered || 0) >= 1 },
    { id: "tram_builder", icon: "🚄", title: "Demir Ağlar", desc: "Şehir bulvarına 3D Hızlı Tramvay hattını kur.", reward: 8000, xp: 90, check: (d, v28) => !!v28.tram.unlocked },
    { id: "mayor_elected", icon: "🏛️", title: "Şehrin Başkanı", desc: "Belediye seçimini kazanıp Belediye Başkanı ol.", reward: 15000, xp: 140, check: (d, v28) => !!v28.mayor.elected },
    { id: "car_flipper", icon: "🚗", title: "Oto Galeri Kurdu", desc: "2. El Oto Pazarında en az 1 araç yenileyip kârla sat.", reward: 6000, xp: 85, check: (d, v28) => (v28.carsFlipped || 0) >= 1 },
    { id: "franchise_5", icon: "🪧", title: "Ulusal Marka", desc: "Ülke çapında en az 5 istasyon bayiliği (Franchise) ver.", reward: 18000, xp: 150, check: (d, v28) => (v28.franchiseCount || 0) >= 5 },
    { id: "cruise_host", icon: "🛳️", title: "Turizm Limanı", desc: "Dev 3D Kruvaziyer yolcu gemisini limanına yanaştır.", reward: 20000, xp: 160, check: (d, v28) => !!v28.sea.cruiseUnlocked },
    { id: "monument_1", icon: "🏫", title: "Hayırsever Patron", desc: "Şehre adını taşıyan en az 1 kalıcı eser bırak.", reward: 16000, xp: 130, check: (d, v28) => Object.values(v28.monuments || {}).some(Boolean) },
    { id: "millionaire", icon: "💎", title: "İlk Milyoner", desc: "Kasa + Şahsi Cüzdan + Vadeli Kasada toplam 1.000.000 ₺ biriktir.", reward: 50000, xp: 250, check: (d, v28) => ((d.cash || 0) + ((d.empire && d.empire.personalCash) || 0) + (v28.vaultBalance || 0)) >= 1000000 },
    { id: "city_100", icon: "🏙️", title: "16 Arazi Şehir Hakimi", desc: "Merkez Şehirdeki tüm 16 araziyi tamamlayıp 1. Çevre Şehri aç!", reward: 120000, xp: 400, check: (d) => !!(window.ExtraLandsSystem && window.ExtraLandsSystem.getMainCityCompletion(d).completed) },
    { id: "country_emp", icon: "🌍", title: "11 Şehir Ülke İmparatoru", desc: "Etraftaki 10 çevre şehrin en az 3'ünü fethet!", reward: 250000, xp: 600, check: (d, v28) => getCompletedSurroundingCount(d, v28) >= 3 }
  ];

  // 🚗 2. EL OTO PAZARI HAVUZU (#13)
  const USED_CAR_POOL = [
    { name: "🚗 Yorgun Şehir Sedanı", buyMin: 4200, buyMax: 6400, repairCost: 1200, sellMult: 1.62 },
    { name: "🚙 Çamurlu Arazi SUV", buyMin: 9500, buyMax: 14000, repairCost: 2400, sellMult: 1.68 },
    { name: "🏎️ Hasarlı Klasik Coupé", buyMin: 18500, buyMax: 26000, repairCost: 4200, sellMult: 1.75 },
    { name: "🚘 Koleksiyon Lüks Makam", buyMin: 36000, buyMax: 48000, repairCost: 7500, sellMult: 1.82 },
    { name: "⚡ İkinci El Süper EV", buyMin: 55000, buyMax: 74000, repairCost: 11000, sellMult: 1.86 }
  ];

  // ⏱️ SÜRELİ FIRSAT & KRİZ GÖREVLERİ HAVUZU (#16)
  const FLASH_QUEST_POOL = [
    { key: "cheap_fuel", emoji: "🛢️", title: "Rafineri Fazlası Ucuz Yakıt!", desc: "2.200 ₺ ödeyip ana yakıt deponu anında %100 doldur ve +4.800 ₺ stok teşviki al!", cost: 2200, reward: 4800, fillTank: true },
    { key: "vip_convoy", emoji: "🚘", title: "Diplomatik VIP Konvoy Molası!", desc: "Hazırlık için 3.500 ₺ harca; anında +8.200 ₺ konvoy ödemesi + VIP müşteri akını kazan!", cost: 3500, reward: 8200, vipRush: 35 },
    { key: "storm_rescue", emoji: "🚜", title: "Otoyol Fırtına Kurtarma Operasyonu!", desc: "Ekipman için 4.000 ₺ ayır; 5 mahsur aracı kurtarıp +9.600 ₺ ödül ve +5 İtibar al!", cost: 4000, reward: 9600, rep: 5 },
    { key: "export_rush", emoji: "📦", title: "Acil Konteyner Siparişi!", desc: "Tedarik için 6.500 ₺ bağla; ekspres sevkiyatla anında +14.500 ₺ net nakit tahsil et!", cost: 6500, reward: 14500 }
  ];

  // 🔥 RAKİP KARŞI HAMLELERİ (#8)
  const RIVAL_ATTACKS = [
    { boss: "Hakkı Bey (Anadolu Petrol)", title: "Pompa İndirim Savaşı Başlattı!", desc: "Müşterileri çekmeye çalışıyor (-%10 trafik). Karşı kampanyayla müşterileri kendi istasyonuna çek!", counterCost: 2800, reward: 5600 },
    { boss: "Aysel Hanım (Yıldız Holding)", title: "Dev Bilboard Reklam Baskını!", desc: "AVM müşterilerine göz dikti! Sosyal medya & bilboard karşı hamlesiyle +VIP akını yakala!", counterCost: 4500, reward: 9200 },
    { boss: "Cemil Soylu (Marmara Dev)", title: "Kurumsal Filo Çelmesi!", desc: "Tır ve otobüsleri kendi tesisine yönlendiriyor! Özel filo indirimiyle hepsini kazan!", counterCost: 7500, reward: 15500 }
  ];

  // Canlı 60 FPS Durum Değişkenleri
  let currentMetroTab = "mayor"; // "mayor" | "transit" | "market" | "rivals" | "trophies"
  let selectedWorldCityId = "city1";

  // 3D Canlı Nesneler
  const liveTram = { wx: -195, wz: -1.5, dir: 1, stopTimer: 0 };
  const liveCouriers = [];
  const liveRallyCars = [];
  let armoredVan = null; // { wx, wz, phase, timer }
  let cruiseShip = null; // { wx, wz, phase, timer, payout }
  let activeHeist = null; // { timeLeft, potentialLoss, bounty }
  let activeRivalMove = null; // { boss, title, desc, counterCost, reward, timeLeft }
  let activeFlashQuest = null; // { emoji, title, desc, cost, reward, timeLeft, ... }
  const metroFloats = [];

  // Zamanlayıcılar
  let courierIncomeTimer = 0;
  let franchiseTimer = 0;
  let multiCityTimer = 0;
  let weatherTimer = 58;
  let heistTimer = 74;
  let rivalMoveTimer = 62;
  let flashQuestTimer = 42;
  let directorXpTimer = 0;
  let rallyTimer = 0;
  let concertTimer = 0;

  function rollUsedCarOffer(idx) {
    const def = USED_CAR_POOL[(idx + Math.floor(Math.random() * USED_CAR_POOL.length)) % USED_CAR_POOL.length];
    const buyPrice = Math.round(def.buyMin + Math.random() * (def.buyMax - def.buyMin));
    return {
      id: Date.now() + idx * 17 + Math.floor(Math.random() * 999),
      name: def.name,
      buyPrice,
      repairCost: def.repairCost,
      sellMult: def.sellMult,
      owned: false,
      repaired: false
    };
  }

  function createDefaultSurroundingCities() {
    const out = {};
    SURROUNDING_CITIES.forEach((c) => {
      out[c.id] = {
        unlocked: false,
        managerHired: false,
        plots: SUBCITY_PLOTS.map((p) => ({
          owned: false,
          builtKey: null,
          lvl: 1,
          rivalOwner: p.isRival ? c.rivals[p.idx % c.rivals.length] : null
        }))
      };
    });
    return out;
  }

  function createDefaultV28() {
    return {
      activeCityBanner: "Merkez Şehir",
      rivalPlotsConquered: 0,
      tram: { unlocked: false, lvl: 1 },
      couriers: { count: 0, lvl: 1 },
      franchiseCount: 0,
      mayor: { elected: false, activeDecree: "festival" },
      weatherKey: "sunny",
      monuments: { school: false, park: false, bridge: false, foundation: false },
      vaultBalance: 0,
      heistsStopped: 0,
      sea: { cruiseUnlocked: false, fishingBoats: 0 },
      carLot: [rollUsedCarOffer(0), rollUsedCarOffer(1), rollUsedCarOffer(2)],
      carsFlipped: 0,
      directors: {
        stationChief: { lvl: 0, xp: 0 },
        mallChief: { lvl: 0, xp: 0 },
        portChief: { lvl: 0, xp: 0 },
        cityChief: { lvl: 0, xp: 0 }
      },
      claimedAchievements: {},
      headlines: [
        "📰 ŞEHİR POSTASI: Otoyol kavşağında yeni kurulan istasyon sürücülerin gözdesi oldu!"
      ],
      surroundingCities: createDefaultSurroundingCities()
    };
  }

  function mergeV28(saved) {
    const def = createDefaultV28();
    if (!saved) return def;
    const out = Object.assign({}, def, saved);
    out.tram = Object.assign({}, def.tram, saved.tram || {});
    out.couriers = Object.assign({}, def.couriers, saved.couriers || {});
    out.mayor = Object.assign({}, def.mayor, saved.mayor || {});
    out.monuments = Object.assign({}, def.monuments, saved.monuments || {});
    out.sea = Object.assign({}, def.sea, saved.sea || {});
    out.claimedAchievements = Object.assign({}, saved.claimedAchievements || {});
    if (!Array.isArray(out.carLot) || out.carLot.length === 0) out.carLot = def.carLot;
    if (!Array.isArray(out.headlines) || out.headlines.length === 0) out.headlines = def.headlines;

    out.directors = Object.assign({}, def.directors);
    HEAD_DIRECTORS.forEach((hd) => {
      if (saved.directors && saved.directors[hd.key]) {
        out.directors[hd.key] = Object.assign({ lvl: 0, xp: 0 }, saved.directors[hd.key]);
      }
    });

    const defCities = createDefaultSurroundingCities();
    out.surroundingCities = {};
    SURROUNDING_CITIES.forEach((c) => {
      const sc = saved.surroundingCities && saved.surroundingCities[c.id];
      if (!sc) {
        out.surroundingCities[c.id] = defCities[c.id];
      } else {
        out.surroundingCities[c.id] = {
          unlocked: !!sc.unlocked,
          managerHired: !!sc.managerHired,
          plots: SUBCITY_PLOTS.map((p, idx) => {
            const sp = sc.plots && sc.plots[idx];
            return Object.assign({}, defCities[c.id].plots[idx], sp || {});
          })
        };
      }
    });
    return out;
  }

  function ensureV28(data) {
    if (!data.empire) return createDefaultV28();
    if (!data.empire.v28) data.empire.v28 = createDefaultV28();
    return data.empire.v28;
  }

  function addHeadline(v28, text) {
    if (!Array.isArray(v28.headlines)) v28.headlines = [];
    if (v28.headlines[0] === text) return;
    v28.headlines.unshift(text);
    if (v28.headlines.length > 8) v28.headlines.pop();
  }

  // =========================================================================
  // 🏭 #2 — TESİSLER ARASI ÜRETİM ZİNCİRİ & SİNERJİ HESABI
  // =========================================================================
  function hasProjectBuilt(data, projKey) {
    const ext = data.empire && data.empire.extraLands;
    if (!ext) return false;
    return Object.values(ext).some((st) => st && st.owned && st.projectKey === projKey);
  }

  function calcSupplyChainSynergies(data) {
    const hasFarm = hasProjectBuilt(data, "agrifarm");
    const hasAuto = hasProjectBuilt(data, "autofactory");
    const hasRefinery = !!(data.empire && data.empire.land3 && data.empire.land3.refineryUnlocked);
    const hasTech = hasProjectBuilt(data, "techpark");
    const hasStudio = hasProjectBuilt(data, "filmstudio");
    const hasPower = hasProjectBuilt(data, "powerplant");
    return {
      hasFarm,      // Market & Restoran +%35
      hasAuto,      // Taksi, Çekici & Oto Pazarı +%35
      hasRefinery,  // Bedava Tanker + Bayilik & İhracat +%30
      hasTech,      // Motokurye +%30 & Borsa %0 komisyon
      hasStudio,    // AVM Kira & Bayilik +%30
      hasPower      // Fatura -%50 & EV Şarj / Tramvay +%35
    };
  }

  // =========================================================================
  // 🌍 1 + 10 ŞEHİR İLERLEME & KİLİT KONTROLLERİ
  // =========================================================================
  function getSubCityCompletion(cityState) {
    if (!cityState || !Array.isArray(cityState.plots)) return { built: 0, total: 8, pct: 0, completed: false };
    const built = cityState.plots.filter((p) => p.owned && p.builtKey).length;
    return {
      built,
      total: cityState.plots.length,
      pct: Math.round((built / cityState.plots.length) * 100),
      completed: built >= cityState.plots.length
    };
  }

  function syncCityUnlocks(data) {
    const v28 = ensureV28(data);
    const mainDone = !!(window.ExtraLandsSystem && window.ExtraLandsSystem.getMainCityCompletion(data).completed);
    SURROUNDING_CITIES.forEach((c, idx) => {
      const st = v28.surroundingCities[c.id];
      if (!st) return;
      if (idx === 0) {
        if (mainDone) st.unlocked = true;
      } else {
        const prevId = SURROUNDING_CITIES[idx - 1].id;
        const prevDone = getSubCityCompletion(v28.surroundingCities[prevId]).completed;
        if (prevDone) st.unlocked = true;
      }
    });
  }

  function getUnlockedSurroundingCount(data) {
    const v28 = ensureV28(data);
    syncCityUnlocks(data);
    return SURROUNDING_CITIES.filter((c) => v28.surroundingCities[c.id] && v28.surroundingCities[c.id].unlocked).length;
  }

  function getCompletedSurroundingCount(data, v28Ref) {
    const v28 = v28Ref || ensureV28(data);
    return SURROUNDING_CITIES.filter((c) => getSubCityCompletion(v28.surroundingCities[c.id]).completed).length;
  }

  function calcMultiCityCycleIncome(data) {
    const v28 = ensureV28(data);
    let sum = 0;
    SURROUNDING_CITIES.forEach((c) => {
      const st = v28.surroundingCities[c.id];
      if (!st || !st.unlocked) return;
      st.plots.forEach((p) => {
        if (p.owned && p.builtKey) {
          sum += Math.round(c.cycleBase * (1 + (p.lvl - 1) * 0.35) * (st.managerHired ? 1.25 : 1.0));
        }
      });
    });
    const chiefLvl = (v28.directors.cityChief && v28.directors.cityChief.lvl) || 0;
    return Math.round(sum * (1 + chiefLvl * 0.08));
  }

  // =========================================================================
  // GENEL ÇARPANLAR (İSTASYON, ARAZİLER, AVM, İNŞAAT İNDİRİMİ, FATURA İNDİRİMİ)
  // =========================================================================
  function getMonumentLoveMult(v28) {
    let m = 1.0;
    CIVIC_MONUMENTS.forEach((cm) => {
      if (v28.monuments && v28.monuments[cm.key]) m += cm.loveBonus;
    });
    return m;
  }

  function getGlobalEmpireMult(data) {
    const v28 = ensureV28(data);
    let m = getMonumentLoveMult(v28);
    if (v28.mayor.elected && v28.mayor.activeDecree === "taxcut") m *= 1.18;
    if (activeRivalMove) m *= 0.92; // Rakip hamlesine karşı koyana kadar hafif rekabet baskısı
    if (rallyTimer > 0) m *= 1.35;
    if (concertTimer > 0) m *= 1.35;
    // Tamamlanan her Çevre Şehir imparatorluğa kalıcı çarpan katar!
    const compCities = getCompletedSurroundingCount(data, v28);
    m *= 1 + compCities * 0.08;
    return m;
  }

  function getStationFacilityMult(data, kind) {
    const v28 = ensureV28(data);
    const syn = calcSupplyChainSynergies(data);
    let m = getGlobalEmpireMult(data);
    const stChief = (v28.directors.stationChief && v28.directors.stationChief.lvl) || 0;
    m *= 1 + stChief * 0.08;

    if ((kind === "market" || kind === "restaurant") && syn.hasFarm) m *= 1.35;
    if (kind === "restaurant" && (v28.sea.fishingBoats || 0) > 0) m *= 1 + v28.sea.fishingBoats * 0.06;
    if (kind === "tow" && syn.hasAuto) m *= 1.35;
    if (kind === "ev" && syn.hasPower) m *= 1.35;

    if (v28.weatherKey === "rain" && (kind === "tow" || kind === "motel")) m *= 1.5;
    if (v28.weatherKey === "sunny" && (kind === "wash" || kind === "market")) m *= 1.4;
    if (v28.mayor.elected && v28.mayor.activeDecree === "freetransit" && (kind === "market" || kind === "restaurant")) m *= 1.4;
    return m;
  }

  function getExtraLandMult(data, projKey) {
    const v28 = ensureV28(data);
    let m = getGlobalEmpireMult(data);
    const cChief = (v28.directors.cityChief && v28.directors.cityChief.lvl) || 0;
    m *= 1 + cChief * 0.08;
    if (v28.mayor.elected && v28.mayor.activeDecree === "festival" && (projKey === "hotel" || projKey === "aquapark" || projKey === "stadium" || projKey === "convention")) {
      m *= 1.35;
    }
    if (v28.weatherKey === "sunny" && projKey === "aquapark") m *= 1.4;
    if (v28.weatherKey === "breeze" && projKey === "powerplant") m *= 1.25;
    if (cruiseShip && cruiseShip.phase === "docked" && (projKey === "hotel" || projKey === "aquapark" || projKey === "mixedtower")) {
      m *= 1.35;
    }
    return m;
  }

  function getBuildDiscountMult(data) {
    const v28 = ensureV28(data);
    const mayorDisc = v28.mayor && v28.mayor.elected && v28.mayor.activeDecree === "urban_aid" ? 0.82 : 1.0;
    const archDisc = window.RealCityV29 ? window.RealCityV29.getArchitectCostMult(data) : 1.0;
    return mayorDisc * archDisc;
  }

  function getUtilityDiscountMult(data) {
    const v28 = ensureV28(data);
    const mayorDisc = v28.mayor && v28.mayor.elected && v28.mayor.activeDecree === "taxcut" ? 0.55 : 1.0;
    const cfoDisc = window.RealCityV29 ? window.RealCityV29.getCfoUtilityMult(data) : 1.0;
    return mayorDisc * cfoDisc;
  }

  function onRivalPlotConquered(data, landDef) {
    const v28 = ensureV28(data);
    v28.rivalPlotsConquered = (v28.rivalPlotsConquered || 0) + 1;
    const brand = (data.empire && data.empire.v23 && data.empire.v23.brandName) || "SON İSTASYON";
    addHeadline(v28, `📰 FLAŞ: ${brand} Holding, ${landDef.rivalBoss}'in ${landDef.num}. Arazisini satın alarak rakibini geriletti!`);
    syncCityUnlocks(data);
  }

  // =========================================================================
  // ANA 60 FPS DÜNYA GÜNCELLEMESİ (TRAMVAY, KURYE, KRUVAZİYER, RALLİ, KRİZLER)
  // =========================================================================
  function syncCourierPool(targetCount) {
    while (liveCouriers.length < targetCount) {
      const idx = liveCouriers.length;
      const laneZ = idx % 2 === 0 ? -61.5 : 10.5;
      const dir = idx % 2 === 0 ? 1 : -1;
      liveCouriers.push({
        wx: -180 + idx * 34,
        wz: laneZ + (dir > 0 ? 1.5 : -1.5),
        dir,
        speed: 26 + (idx % 3) * 4
      });
    }
    if (liveCouriers.length > targetCount) liveCouriers.length = targetCount;
  }

  function startCruiseArrival(data, helpers, isAuto = false) {
    const v28 = ensureV28(data);
    if (!v28.sea.cruiseUnlocked || cruiseShip) return;
    const pChief = (v28.directors.portChief && v28.directors.portChief.lvl) || 0;
    const payout = Math.round(9200 * (1 + pChief * 0.1) * getGlobalEmpireMult(data));
    cruiseShip = { wx: -210, wz: 138, phase: "arriving", timer: 6.5, payout };
    if (!isAuto && helpers && helpers.showToast) {
      helpers.showToast("🛳️ Dev Kruvaziyer Yolcu Gemisi limana yaklaşıyor!");
    }
  }

  function triggerBoulevardRally(data, helpers) {
    if (rallyTimer > 0) return;
    rallyTimer = 36;
    liveRallyCars.length = 0;
    const cols = ["#ef4444", "#facc15", "#38bdf8", "#22c55e", "#ec4899", "#f97316"];
    for (let i = 0; i < 6; i++) {
      liveRallyCars.push({ wx: -200 - i * 11, wz: 10.6, speed: 46 + (i % 2) * 3, color: cols[i] });
    }
    const v28 = ensureV28(data);
    addHeadline(v28, "📰 BÜYÜK HEYECAN: Şehir Bulvarında Süper Spor Rallisi başladı, istasyon ve tesisler dolup taşıyor!");
    if (helpers && helpers.sfx && helpers.sfx.carHorn) helpers.sfx.carHorn();
    if (helpers && helpers.showToast) helpers.showToast("🏎️ BULVAR RALLİSİ BAŞLADI! 36 sn boyunca tüm gelirler +%35!");
  }

  function triggerMegaConcert(data, helpers) {
    if (concertTimer > 0) return;
    concertTimer = 40;
    const v28 = ensureV28(data);
    addHeadline(v28, "📰 DEV KONSER: Stadyum ve bulvar ışıl ışıl! Binlerce müziksever şehre akın etti!");
    if (helpers && helpers.sfx && helpers.sfx.stadiumGoal) helpers.sfx.stadiumGoal();
    if (helpers && helpers.showToast) helpers.showToast("🎤 STADYUM DEV KONSERİ BAŞLADI! 40 sn boyunca tüm gelirler +%35!");
  }

  function sendArmoredDeposit(amount, data, helpers) {
    const v28 = ensureV28(data);
    const amt = Math.min(Math.floor(data.cash || 0), Math.max(0, Math.floor(amount)));
    if (amt <= 0) return;
    data.cash -= amt;
    v28.vaultBalance = (v28.vaultBalance || 0) + amt;
    armoredVan = { wx: -112, wz: -61.2, phase: "going", timer: 5.5 };
    if (helpers) {
      if (helpers.sfx) helpers.sfx.cashRegister();
      if (helpers.showToast) helpers.showToast(`🛡️ Zırhlı Kasa Aracı ${amt.toLocaleString("tr-TR")} ₺ nakdi Merkez Kasasına taşıyor (+%4/gün faiz)!`);
      if (helpers.saveGame) helpers.saveGame();
      if (helpers.updateHUD) helpers.updateHUD();
    }
  }

  function updateV28(dt, data, helpers) {
    const v28 = ensureV28(data);
    syncCityUnlocks(data);
    const syn = calcSupplyChainSynergies(data);

    // 1) 🚄 3D Hızlı Tren / Tramvay Hareketi & İstasyon Yolcu/Bilet Geliri
    if (v28.tram.unlocked) {
      if (liveTram.stopTimer > 0) {
        liveTram.stopTimer -= dt;
      } else {
        const prevX = liveTram.wx;
        const spd = 28 + (v28.tram.lvl - 1) * 4;
        liveTram.wx += liveTram.dir * spd * dt;
        if ((prevX < 0 && liveTram.wx >= 0) || (prevX > 0 && liveTram.wx <= 0)) {
          liveTram.wx = 0;
          liveTram.stopTimer = 2.4;
          const fare = Math.round((165 + v28.tram.lvl * 95) * (syn.hasPower ? 1.35 : 1.0) * getGlobalEmpireMult(data));
          data.cash += fare;
          if (data.daily) data.daily.tramIncome = (data.daily.tramIncome || 0) + fare;
          metroFloats.push({ wx: 0, wz: -1.5, text: `🚄 TRAMVAY YOLCU & BİLET +${fare}₺`, color: "#38bdf8", life: 1.8 });
          if (helpers && helpers.onTramDropPassengers) helpers.onTramDropPassengers();
        }
        if (liveTram.wx > 205) { liveTram.wx = 205; liveTram.dir = -1; }
        if (liveTram.wx < -205) { liveTram.wx = -205; liveTram.dir = 1; }
      }
    }

    // 2) 🛵 3D Motokurye Filosu Hareketi & Paket Servis Geliri
    const cCount = v28.couriers.count || 0;
    syncCourierPool(cCount);
    for (let i = 0; i < liveCouriers.length; i++) {
      const mc = liveCouriers[i];
      mc.wx += mc.dir * mc.speed * dt;
      if (mc.wx > 195) mc.wx = -195;
      if (mc.wx < -195) mc.wx = 195;
    }
    if (cCount > 0) {
      courierIncomeTimer += dt;
      if (courierIncomeTimer >= 6.0) {
        courierIncomeTimer -= 6.0;
        const mChief = (v28.directors.mallChief && v28.directors.mallChief.lvl) || 0;
        const rainBoost = v28.weatherKey === "rain" ? 1.5 : 1.0;
        const techBoost = syn.hasTech ? 1.3 : 1.0;
        const earn = Math.round(cCount * (48 + v28.couriers.lvl * 22) * (1 + mChief * 0.09) * rainBoost * techBoost);
        data.cash += earn;
        if (data.daily) data.daily.courierIncome = (data.daily.courierIncome || 0) + earn;
      }
    }

    // 3) ⛽ Ülke Çapında Bayilik (Franchise) & 🛥️ Balıkçı Teknesi Geliri
    if ((v28.franchiseCount || 0) > 0 || (v28.sea.fishingBoats || 0) > 0) {
      franchiseTimer += dt;
      if (franchiseTimer >= 8.5) {
        franchiseTimer -= 8.5;
        if (v28.franchiseCount > 0) {
          const refB = syn.hasRefinery ? 1.3 : 1.0;
          const stuB = syn.hasStudio ? 1.3 : 1.0;
          const fInc = Math.round(v28.franchiseCount * 145 * refB * stuB);
          data.cash += fInc;
          if (data.daily) data.daily.franchiseIncome = (data.daily.franchiseIncome || 0) + fInc;
        }
        if ((v28.sea.fishingBoats || 0) > 0) {
          const pChief = (v28.directors.portChief && v28.directors.portChief.lvl) || 0;
          const fishInc = Math.round(v28.sea.fishingBoats * 95 * (1 + pChief * 0.1));
          data.cash += fishInc;
          if (data.daily) data.daily.portIncome = (data.daily.portIncome || 0) + fishInc;
        }
      }
    }

    // 4) 🌍 Fethedilen Çevre Şehirlerin (Şehir 1..10) Düzenli Holding Geliri
    multiCityTimer += dt;
    if (multiCityTimer >= 9.0) {
      multiCityTimer -= 9.0;
      const mcInc = calcMultiCityCycleIncome(data);
      if (mcInc > 0) {
        data.cash += mcInc;
        if (data.daily) data.daily.multiCityIncome = (data.daily.multiCityIncome || 0) + mcInc;
      }
    }

    // 5) 🛳️ Dev 3D Kruvaziyer Yolcu Gemisi Hareketi
    if (v28.sea.cruiseUnlocked && !cruiseShip && Math.random() < dt * 0.06) {
      startCruiseArrival(data, helpers, true);
    }
    if (cruiseShip) {
      if (cruiseShip.phase === "arriving") {
        cruiseShip.wx += 28 * dt;
        if (cruiseShip.wx >= 38) {
          cruiseShip.wx = 38;
          cruiseShip.phase = "docked";
          cruiseShip.timer = 9.0;
        }
      } else if (cruiseShip.phase === "docked") {
        cruiseShip.timer -= dt;
        if (cruiseShip.timer <= 0) {
          data.cash += cruiseShip.payout;
          if (data.daily) data.daily.portIncome = (data.daily.portIncome || 0) + cruiseShip.payout;
          metroFloats.push({ wx: 38, wz: 132, text: `🛳️ KRUVAZİYER TURİST AKINI +${cruiseShip.payout.toLocaleString("tr-TR")}₺!`, color: "#fde047", life: 2.3 });
          cruiseShip.phase = "departing";
        }
      } else {
        cruiseShip.wx += 30 * dt;
        if (cruiseShip.wx > 225) cruiseShip = null;
      }
    }

    // 6) 🛡️ Zırhlı Para Aracı Hareketi
    if (armoredVan) {
      armoredVan.wx += 38 * dt;
      armoredVan.timer -= dt;
      if (armoredVan.timer <= 0 || armoredVan.wx > 195) armoredVan = null;
    }

    // 7) 🎪 Ralli & Konser Sayaçları
    if (rallyTimer > 0) {
      rallyTimer = Math.max(0, rallyTimer - dt);
      liveRallyCars.forEach((rc) => {
        rc.wx += rc.speed * dt;
        if (rc.wx > 205) rc.wx = -205;
      });
      if (rallyTimer <= 0) liveRallyCars.length = 0;
    }
    if (concertTimer > 0) concertTimer = Math.max(0, concertTimer - dt);

    // 8) 🌧️ Dinamik Hava Durumu Döngüsü
    weatherTimer -= dt;
    if (weatherTimer <= 0) {
      weatherTimer = 58 + Math.random() * 25;
      const keys = ["sunny", "rain", "breeze"];
      v28.weatherKey = keys[Math.floor(Math.random() * keys.length)];
    }

    // 9) ⭐ Baş Müdürlerin Çalıştıkça Otomatik XP Kazanması
    directorXpTimer += dt;
    if (directorXpTimer >= 12.0) {
      directorXpTimer -= 12.0;
      HEAD_DIRECTORS.forEach((hd) => {
        const st = v28.directors[hd.key];
        if (st && st.lvl > 0 && st.lvl < 5) {
          st.xp += 18;
          if (st.xp >= st.lvl * 120) {
            st.xp = 0;
            st.lvl += 1;
            if (helpers && helpers.showToast) {
              helpers.showToast(`⭐ ${hd.name} tecrübe kazanıp Sv.${st.lvl} oldu!`);
            }
          }
        }
      });
    }

    // 10) 🛡️ Gece Soygunu / Kasa Girişimi & Otomatik Güvenlik Yakalaması
    if (!activeHeist) {
      heistTimer -= dt;
      if (heistTimer <= 0 && (data.cash || 0) > 4000) {
        heistTimer = 85 + Math.random() * 35;
        const sec = data.security || 65;
        if (sec >= 85 || data.dumanHired) {
          const bounty = 850 + Math.round((data.dayNumber || 1) * 45);
          data.cash += bounty;
          v28.heistsStopped = (v28.heistsStopped || 0) + 1;
          if (data.daily) data.daily.eventIncome = (data.daily.eventIncome || 0) + bounty;
          if (helpers && helpers.showToast) {
            helpers.showToast(`🚓 Güvenlik ekibin gece hırsızını suçüstü yakaladı! (+${bounty} ₺ ödül)`);
          }
        } else {
          activeHeist = { timeLeft: 28, potentialLoss: Math.min(2500, Math.round(data.cash * 0.06)), bounty: 1200 };
          if (helpers && helpers.showToast) {
            helpers.showToast("🚨 HIRSIZ ALARMI! 🌐 Büyükşehir -> Oto Pazar & Kasa sekmesinden hemen yakala!");
          }
        }
      }
    } else {
      activeHeist.timeLeft -= dt;
      if (activeHeist.timeLeft <= 0) {
        data.cash = Math.max(0, data.cash - activeHeist.potentialLoss);
        if (data.daily) data.daily.eventLoss = (data.daily.eventLoss || 0) + activeHeist.potentialLoss;
        activeHeist = null;
      }
    }

    // 11) 🔥 Rakip Karşı Hamlesi & ⏱️ Süreli Fırsat Görevi
    if (!activeRivalMove) {
      rivalMoveTimer -= dt;
      if (rivalMoveTimer <= 0 && (data.dayNumber || 1) >= 2) {
        rivalMoveTimer = 75 + Math.random() * 30;
        const def = RIVAL_ATTACKS[Math.floor(Math.random() * RIVAL_ATTACKS.length)];
        activeRivalMove = Object.assign({}, def, { timeLeft: 45 });
        addHeadline(v28, `📰 REKABET: ${def.boss} — ${def.title}`);
      }
    } else {
      activeRivalMove.timeLeft -= dt;
      if (activeRivalMove.timeLeft <= 0) activeRivalMove = null;
    }

    if (!activeFlashQuest) {
      flashQuestTimer -= dt;
      if (flashQuestTimer <= 0) {
        flashQuestTimer = 52 + Math.random() * 25;
        const fq = FLASH_QUEST_POOL[Math.floor(Math.random() * FLASH_QUEST_POOL.length)];
        activeFlashQuest = Object.assign({}, fq, { timeLeft: 65 });
      }
    } else {
      activeFlashQuest.timeLeft -= dt;
      if (activeFlashQuest.timeLeft <= 0) activeFlashQuest = null;
    }

    // Uçuşan 3D Kazanç Yazıları
    for (let i = metroFloats.length - 1; i >= 0; i--) {
      metroFloats[i].life -= dt;
      if (metroFloats[i].life <= 0) metroFloats.splice(i, 1);
    }

    syncMetroFabBadge(data, v28);
  }

  function onDayRollover(data) {
    const v28 = ensureV28(data);
    let vaultInterest = 0;
    if ((v28.vaultBalance || 0) > 0) {
      vaultInterest = Math.round(v28.vaultBalance * 0.04); // +%4 günlük bileşik faiz!
      v28.vaultBalance += vaultInterest;
    }
    // Oto pazarında satılmamış fırsatları tazele
    v28.carLot = v28.carLot.map((c, idx) => (c.owned ? c : rollUsedCarOffer(idx)));
    return { vaultInterest };
  }

  function hasClaimableAchievement(data, v28) {
    return ACHIEVEMENTS.some((a) => !v28.claimedAchievements[a.id] && a.check(data, v28));
  }

  function syncMetroFabBadge(data, v28Ref) {
    const btn = document.getElementById("metropolisBtn");
    if (!btn) return;
    const v28 = v28Ref || ensureV28(data);
    const alertOn = !!(activeHeist || activeRivalMove || activeFlashQuest || hasClaimableAchievement(data, v28));
    btn.classList.toggle("reward-ready", alertOn);
  }

  // =========================================================================
  // 🌍 1 ANA ŞEHİR + ETRAFINDA 10 KİLİTLİ ŞEHİR HARİTASI ARAYÜZÜ (#landsDirectoryModal & #metropolisModal)
  // =========================================================================
  function renderWorldCitiesTab(container, data, helpers, onRefresh) {
    if (!container) return;
    const v28 = ensureV28(data);
    syncCityUnlocks(data);
    const mainComp = window.ExtraLandsSystem
      ? window.ExtraLandsSystem.getMainCityCompletion(data)
      : { built: 1, total: 16, pct: 6, completed: false };

    // Görsel Dairesel 1+10 Şehir Haritası (Merkezde Ana Şehir, Etrafında 10 Çevre Şehir!)
    const nodesHtml = SURROUNDING_CITIES.map((c, idx) => {
      const st = v28.surroundingCities[c.id];
      const subC = getSubCityCompletion(st);
      const rad = (c.angleDeg * Math.PI) / 180;
      const cx = 50 + Math.cos(rad) * 39;
      const cy = 50 + Math.sin(rad) * 38;
      const isSel = selectedWorldCityId === c.id;
      const bg = subC.completed ? "#15803d" : st.unlocked ? "#0284c7" : "#1e293b";
      const brd = isSel ? "#fde047" : subC.completed ? "#4ade80" : st.unlocked ? "#38bdf8" : "#475569";
      return `
        <button class="world-city-node" data-wcity="${c.id}"
          style="position:absolute; left:${cx.toFixed(1)}%; top:${cy.toFixed(1)}%; transform:translate(-50%,-50%); background:${bg}; border:2px solid ${brd}; border-radius:11px; padding:3px 6px; color:#fff; font-size:10px; font-weight:900; cursor:pointer; white-space:nowrap; box-shadow:${isSel ? "0 0 12px rgba(250,204,21,0.75)" : "0 3px 8px rgba(0,0,0,0.5)"}; opacity:${st.unlocked ? "1" : "0.68"};">
          ${st.unlocked ? c.emoji : "🔒"} ${idx + 1}
        </button>
      `;
    }).join("");

    const linesSvg = SURROUNDING_CITIES.map((c) => {
      const st = v28.surroundingCities[c.id];
      const rad = (c.angleDeg * Math.PI) / 180;
      const x2 = 50 + Math.cos(rad) * 39;
      const y2 = 50 + Math.sin(rad) * 38;
      return `<line x1="50%" y1="50%" x2="${x2.toFixed(1)}%" y2="${y2.toFixed(1)}%" stroke="${st.unlocked ? "#38bdf8" : "#334155"}" stroke-width="1.8" stroke-dasharray="${st.unlocked ? "none" : "4 3"}" />`;
    }).join("");

    const selDef = SURROUNDING_CITIES.find((c) => c.id === selectedWorldCityId) || SURROUNDING_CITIES[0];
    const selIdx = SURROUNDING_CITIES.findIndex((c) => c.id === selDef.id);
    const selState = v28.surroundingCities[selDef.id];
    const selComp = getSubCityCompletion(selState);
    const prevRequirementText = selIdx === 0
      ? `Önce ⭐ Merkez Şehir'deki tüm 16 araziye yapı kurmalısın (Şu an: ${mainComp.built}/${mainComp.total})!`
      : `Önce ${SURROUNDING_CITIES[selIdx - 1].emoji} ${SURROUNDING_CITIES[selIdx - 1].name} şehrindeki 8 bölge yapısını %100 tamamlamalısın!`;

    let detailHtml = "";
    if (!selState.unlocked) {
      detailHtml = `
        <div class="rep-section" style="border-color:#475569; text-align:center;">
          <h4 style="color:#fca5a5;">🔒 ${selDef.num}. Çevre Şehir: ${selDef.emoji} ${selDef.name} (KİLİTLİ)</h4>
          <p style="font-size:12px; color:#cbd5e1; margin-bottom:6px;">${selDef.specialty}</p>
          <div style="background:#090d1a; border:1px solid #334155; border-radius:10px; padding:8px; font-size:12px; color:#fde047; font-weight:800;">
            🗝️ Nasıl Açılır? ${prevRequirementText}
          </div>
        </div>
      `;
    } else {
      const mgrCost = Math.round(selDef.basePlotCost * 1.4);
      const plotsHtml = SUBCITY_PLOTS.map((pDef, pIdx) => {
        const pSt = selState.plots[pIdx];
        const cost = Math.round(selDef.basePlotCost * (1 + pIdx * 0.22));
        const upCost = Math.round(cost * 0.65 * pSt.lvl);
        const bChoice = SUBCITY_BUILD_CHOICES.find((b) => b.key === pSt.builtKey);

        let actBtns = "";
        if (!pSt.owned) {
          actBtns = `
            <button class="shop-action-btn buy-deed subcity-buy-btn" data-pidx="${pIdx}">
              ${pSt.rivalOwner ? `⚔️ Rakip ${pSt.rivalOwner}'den Satın Al (${cost.toLocaleString("tr-TR")} ₺)` : `🔑 Bölge Arsasını Al (${cost.toLocaleString("tr-TR")} ₺)`}
            </button>
          `;
        } else if (!pSt.builtKey) {
          actBtns = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; width:100%;">
              ${SUBCITY_BUILD_CHOICES.map((ch) => `
                <button class="sal-btn subcity-build-btn" data-pidx="${pIdx}" data-bkey="${ch.key}" style="font-size:11px; padding:6px;">
                  ${ch.emoji} ${ch.name} (${Math.round(cost * 0.5).toLocaleString("tr-TR")}₺)
                </button>
              `).join("")}
            </div>
          `;
        } else {
          actBtns = `
            <button class="shop-action-btn up-rent subcity-up-btn" data-pidx="${pIdx}" ${pSt.lvl >= 5 ? "disabled" : ""}>
              ${pSt.lvl >= 5 ? "★ MAKSİMUM SEVİYE" : `⬆️ Kuleyi Büyüt Sv.${pSt.lvl + 1} (${upCost.toLocaleString("tr-TR")} ₺)`}
            </button>
          `;
        }

        return `
          <div class="mall-shop-card ${pSt.builtKey ? "rented" : pSt.owned ? "owned" : ""}" style="margin-bottom:6px;">
            <div class="shop-top-row">
              <div>
                <div style="font-size:10.5px; color:#93c5fd; font-weight:800;">${pDef.dist}</div>
                <div class="shop-title">${pDef.name}</div>
              </div>
              <span class="shop-status-tag ${pSt.builtKey ? "tag-rented" : pSt.owned ? "tag-vacant" : "tag-sale"}">
                ${pSt.builtKey ? `${bChoice.emoji} Sv.${pSt.lvl}/5` : pSt.owned ? "BOŞ ARSA" : pSt.rivalOwner ? `⚔️ ${pSt.rivalOwner}` : "SATILIK"}
              </span>
            </div>
            <div class="shop-btn-row">${actBtns}</div>
          </div>
        `;
      }).join("");

      detailHtml = `
        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="margin:0; color:#fde047;">${selDef.emoji} ${selDef.num}. Şehir: ${selDef.name} (${selComp.built}/8)</h4>
            <button id="btnSetCityBanner" class="sal-btn" style="font-size:11px; padding:4px 8px;">
              ${v28.activeCityBanner === selDef.name ? "📍 Aktif Sancak ✓" : "📍 Şehre Geç"}
            </button>
          </div>
          <p style="font-size:11.5px; color:#86efac; margin:4px 0 8px;">${selDef.specialty}</p>
          <div class="upgrade-card" style="margin-bottom:8px; border-color:#facc15;">
            <div class="up-info">
              <h3>👔 ${selDef.name} Bölge Koordinatörü</h3>
              <p>Bu şehirdeki tüm tesislerin gelirini kalıcı olarak +%25 artırır!</p>
            </div>
            <button id="btnHireSubCityMgr" class="up-buy-btn" ${selState.managerHired ? "disabled" : ""}>
              ${selState.managerHired ? "GÖREVDE ✓" : `${mgrCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
          ${plotsHtml}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="rep-section" style="border-color:#facc15; margin-bottom:10px; padding:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="font-size:13px; color:#fde047;">🌍 ÜLKE HARİTASI (1 MERKEZ + 10 ÇEVRE ŞEHİR)</strong>
          <span style="font-size:11px; color:#4ade80; font-weight:900;">+${calcMultiCityCycleIncome(data).toLocaleString("tr-TR")} ₺/döngü</span>
        </div>
        <div style="position:relative; width:100%; height:206px; background:radial-gradient(circle at 50% 50%, rgba(14,165,233,0.22), rgba(9,13,26,0.96)); border:1.5px solid #334155; border-radius:14px; overflow:hidden;">
          <svg width="100%" height="100%" style="position:absolute; inset:0; pointer-events:none;">${linesSvg}</svg>
          <div style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); background:linear-gradient(180deg,#f59e0b,#b45309); border:2px solid #fef08a; border-radius:999px; padding:6px 10px; color:#090d1a; font-size:11px; font-weight:900; box-shadow:0 0 16px rgba(245,158,11,0.6); text-align:center;">
            ⭐ MERKEZ<br/><span style="font-size:9.5px;">${mainComp.built}/${mainComp.total} Yapı</span>
          </div>
          ${nodesHtml}
        </div>
        <div style="font-size:11px; color:#94a3b8; text-align:center; margin-top:5px;">
          Bir şehirdeki tüm yapılar %100 tamamlanınca sıradaki komşu şehrin kilidi açılır!
        </div>
      </div>
      ${detailHtml}
    `;

    container.querySelectorAll(".world-city-node").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedWorldCityId = btn.dataset.wcity;
        if (helpers && helpers.sfx) helpers.sfx.tap();
        renderWorldCitiesTab(container, data, helpers, onRefresh);
      });
    });

    const bannerBtn = container.querySelector("#btnSetCityBanner");
    if (bannerBtn && selState.unlocked) {
      bannerBtn.addEventListener("click", () => {
        v28.activeCityBanner = selDef.name;
        if (helpers && helpers.sfx) helpers.sfx.perfectHit();
        if (helpers && helpers.showToast) helpers.showToast(`📍 Aktif Şehir Odağı: ${selDef.emoji} ${selDef.name}!`);
        if (helpers && helpers.saveGame) helpers.saveGame();
        if (helpers && helpers.updateHUD) helpers.updateHUD();
        renderWorldCitiesTab(container, data, helpers, onRefresh);
      });
    }

    const mgrBtn = container.querySelector("#btnHireSubCityMgr");
    if (mgrBtn && selState.unlocked && !selState.managerHired) {
      const mgrCost = Math.round(selDef.basePlotCost * 1.4);
      mgrBtn.addEventListener("click", () => {
        helpers.payForBusiness(mgrCost, `${selDef.name} Bölge Koordinatörü`, () => {
          selState.managerHired = true;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderWorldCitiesTab(container, data, helpers, onRefresh);
        });
      });
    }

    container.querySelectorAll(".subcity-buy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pIdx = Number(btn.dataset.pidx);
        const pSt = selState.plots[pIdx];
        const cost = Math.round(selDef.basePlotCost * (1 + pIdx * 0.22));
        helpers.payForBusiness(cost, `${selDef.name} - ${SUBCITY_PLOTS[pIdx].name}`, () => {
          pSt.owned = true;
          if (pSt.rivalOwner) v28.rivalPlotsConquered = (v28.rivalPlotsConquered || 0) + 1;
          helpers.sfx.perfectHit();
          helpers.showToast(pSt.rivalOwner ? `⚔️ Rakip ${pSt.rivalOwner}'den araziyi satın aldın! Şimdi yapıyı seç!` : "🔑 Bölge arsası alındı! Şimdi yapıyı kur!");
          helpers.saveGame();
          helpers.updateHUD();
          renderWorldCitiesTab(container, data, helpers, onRefresh);
        });
      });
    });

    container.querySelectorAll(".subcity-build-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pIdx = Number(btn.dataset.pidx);
        const bKey = btn.dataset.bkey;
        const pSt = selState.plots[pIdx];
        const cost = Math.round(selDef.basePlotCost * (1 + pIdx * 0.22) * 0.5 * getBuildDiscountMult(data));
        const ch = SUBCITY_BUILD_CHOICES.find((x) => x.key === bKey);
        helpers.payForBusiness(cost, `${selDef.name} - ${ch.name}`, () => {
          pSt.builtKey = bKey;
          pSt.lvl = 1;
          syncCityUnlocks(data);
          helpers.sfx.perfectHit();
          const nowComp = getSubCityCompletion(selState);
          if (nowComp.completed && selIdx + 1 < SURROUNDING_CITIES.length) {
            const nxt = SURROUNDING_CITIES[selIdx + 1];
            addHeadline(v28, `📰 TARİHİ ZAFER: ${selDef.name} %100 tamamlandı, ${nxt.emoji} ${nxt.name} kapıları açıldı!`);
            helpers.showToast(`🏆 ${selDef.name} %100 TAMAMLANDI! Sıradaki şehir açıldı: ${nxt.emoji} ${nxt.name}!`);
          } else {
            helpers.showToast(`${ch.emoji} ${ch.name} kuruldu!`);
          }
          helpers.saveGame();
          helpers.updateHUD();
          if (onRefresh) onRefresh();
          else renderWorldCitiesTab(container, data, helpers, onRefresh);
        });
      });
    });

    container.querySelectorAll(".subcity-up-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pIdx = Number(btn.dataset.pidx);
        const pSt = selState.plots[pIdx];
        if (pSt.lvl >= 5) return;
        const baseCost = Math.round(selDef.basePlotCost * (1 + pIdx * 0.22));
        const upCost = Math.round(baseCost * 0.65 * pSt.lvl * getBuildDiscountMult(data));
        helpers.payForBusiness(upCost, `${selDef.name} Tesis Büyütme`, () => {
          pSt.lvl += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderWorldCitiesTab(container, data, helpers, onRefresh);
        });
      });
    });
  }

  // =========================================================================
  // 🌐 BÜYÜKŞEHİR & İMPARATORLUK MERKEZİ MODALI (5 SEKME — TÜM 17 YENİLİK!)
  // =========================================================================
  function setMetroTab(tab) {
    if (tab) currentMetroTab = tab;
  }

  function renderMetropolisModal(data, helpers) {
    const v28 = ensureV28(data);
    const body = document.getElementById("metropolisBody");
    const badge = document.getElementById("metropolisBadge");
    if (!body) return;

    const wMode = WEATHER_MODES[v28.weatherKey] || WEATHER_MODES.sunny;
    if (badge) badge.textContent = wMode.badge;

    const modalEl = document.getElementById("metropolisModal");
    if (modalEl) {
      modalEl.querySelectorAll(".metro28-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.mtab === currentMetroTab);
      });
    }

    const brand = (data.empire && data.empire.v23 && data.empire.v23.brandName) || "SON İSTASYON";
    const syn = calcSupplyChainSynergies(data);

    // SEKME 1: 🚄 ULAŞIM, MOTOKURYE, BAYİLİK & ÜRETİM ZİNCİRİ (#1, #2, #6, #14)
    if (currentMetroTab === "transit") {
      const tramCost = !v28.tram.unlocked ? 24000 : Math.round(18000 * Math.pow(1.6, v28.tram.lvl));
      const nextCourierCost = Math.round(3800 * Math.pow(1.38, v28.couriers.count));
      const franCost = Math.round(28000 * Math.pow(1.26, v28.franchiseCount || 0));
      const canFranchise = (data.reputation || 50) >= 55;

      body.innerHTML = `
        <div class="upgrade-card" style="border-color:#38bdf8;">
          <div class="up-info">
            <h3>🚄 3D Hızlı Tramvay &amp; Merkez İstasyon ${v28.tram.unlocked ? `(Sv.${v28.tram.lvl}/5)` : ""}</h3>
            <p>Bulvarın ortasından geçen ışıklı 3D tren her duruşta tesislere müşteri indirir! ${!v28.mayor.elected ? "<strong style='color:#fde047;'>(Belediye Başkanı seçilince açılır)</strong>" : ""}</p>
          </div>
          <button id="m28TramBtn" class="up-buy-btn" ${(!v28.mayor.elected && !v28.tram.unlocked) || (v28.tram.unlocked && v28.tram.lvl >= 5) ? "disabled" : ""}>
            ${!v28.mayor.elected && !v28.tram.unlocked ? "🔒 Başkanlık" : !v28.tram.unlocked ? "Kur 24.000 ₺" : v28.tram.lvl >= 5 ? "MAKS ✓" : `${tramCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card" style="border-color:#facc15;">
          <div class="up-info">
            <h3>🛵 3D Motokurye &amp; Paket Servis Ağı (${v28.couriers.count}/10 Kurye)</h3>
            <p>Market, Restoran ve AVM'den çıkan 3D sarı çantalı motokuryeler tüm şehre sipariş taşır (Yağmurda +%50 kâr)!</p>
          </div>
          <button id="m28CourierBtn" class="up-buy-btn" ${v28.couriers.count >= 10 ? "disabled" : ""}>
            ${v28.couriers.count >= 10 ? "TAM FİLO ✓" : `${nextCourierCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card" style="border-color:#22c55e;">
          <div class="up-info">
            <h3>⛽ Ülke Çapında "${brand}" Bayilik Zinciri (${v28.franchiseCount}/25 Şube)</h3>
            <p>Başka şehirlere kendi markanın isim hakkını (Franchise) ver; her şube düzenli isim hakkı ödesin! ${!canFranchise ? "(En az 55 İtibar gerekir)" : ""}</p>
          </div>
          <button id="m28FranBtn" class="up-buy-btn" ${(v28.franchiseCount >= 25 || !canFranchise) ? "disabled" : ""}>
            ${v28.franchiseCount >= 25 ? "25 ŞUBE ✓" : `${franCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="rep-section" style="border-color:#a855f7; margin-top:8px;">
          <h4>🏭 TESİSLER ARASI ÜRETİM ZİNCİRİ (OTOMATİK SİNERJİ)</h4>
          <div class="rep-row"><span>🌾 Organik Çiftlik ➔ Market &amp; Restoran +%35</span><strong style="color:${syn.hasFarm ? "#4ade80" : "#94a3b8"};">${syn.hasFarm ? "AKTİF ✅" : "Çiftlik Kur"}</strong></div>
          <div class="rep-row"><span>🚗 Oto Fabrika ➔ Taksi, Çekici &amp; Oto Pazarı +%35</span><strong style="color:${syn.hasAuto ? "#4ade80" : "#94a3b8"};">${syn.hasAuto ? "AKTİF ✅" : "Fabrika Kur"}</strong></div>
          <div class="rep-row"><span>🏭 Rafineri ➔ Bedava Tanker + Bayilik +%30</span><strong style="color:${syn.hasRefinery ? "#4ade80" : "#94a3b8"};">${syn.hasRefinery ? "AKTİF ✅" : "3. Arazide Kur"}</strong></div>
          <div class="rep-row"><span>💻 Teknokent ➔ Motokurye +%30 &amp; Sıfır Komisyon</span><strong style="color:${syn.hasTech ? "#4ade80" : "#94a3b8"};">${syn.hasTech ? "AKTİF ✅" : "Teknokent Kur"}</strong></div>
          <div class="rep-row"><span>🎬 Film Stüdyosu ➔ AVM &amp; Bayilik Geliri +%30</span><strong style="color:${syn.hasStudio ? "#4ade80" : "#94a3b8"};">${syn.hasStudio ? "AKTİF ✅" : "Stüdyo Kur"}</strong></div>
          <div class="rep-row"><span>⚡ Enerji Santrali ➔ Fatura -%50 &amp; EV/Tren +%35</span><strong style="color:${syn.hasPower ? "#4ade80" : "#94a3b8"};">${syn.hasPower ? "AKTİF ✅" : "Santral Kur"}</strong></div>
        </div>
      `;

      const tBtn = document.getElementById("m28TramBtn");
      if (tBtn) {
        tBtn.addEventListener("click", () => {
          helpers.payForBusiness(tramCost, !v28.tram.unlocked ? "3D Hızlı Tramvay Hattı" : "Tramvay Hattı Yükseltme", () => {
            if (!v28.tram.unlocked) {
              v28.tram.unlocked = true;
              v28.tram.lvl = 1;
              addHeadline(v28, `📰 ULAŞIM DEVRİMİ: ${brand} Holding şehre modern 3D Hızlı Tramvay hattı kurdu!`);
              helpers.showToast("🚄 3D Hızlı Tramvay Hattı açıldı! Tren bulvarda sefere başladı!");
            } else {
              v28.tram.lvl += 1;
              helpers.showToast(`🚄 Hızlı Tramvay Sv.${v28.tram.lvl} seviyesine yükseldi!`);
            }
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }

      const cBtn = document.getElementById("m28CourierBtn");
      if (cBtn && v28.couriers.count < 10) {
        cBtn.addEventListener("click", () => {
          helpers.payForBusiness(nextCourierCost, "Yeni 3D Motokurye", () => {
            v28.couriers.count += 1;
            helpers.sfx.carHorn();
            helpers.showToast(`🛵 ${v28.couriers.count}. Motokurye 3D şehir caddelerinde paket dağıtımına çıktı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }

      const fBtn = document.getElementById("m28FranBtn");
      if (fBtn && v28.franchiseCount < 25 && canFranchise) {
        fBtn.addEventListener("click", () => {
          helpers.payForBusiness(franCost, `${brand} Yeni Şehir Bayiliği`, () => {
            v28.franchiseCount += 1;
            helpers.sfx.cashRegister();
            helpers.showToast(`⛽ ${v28.franchiseCount}. "${brand}" bayisi açıldı! Düzenli isim hakkı geliri başladı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }
      return;
    }

    // SEKME 2: 🏛️ BELEDİYE BAŞKANLIĞI, HAVA DURUMU, RALLİ/KONSER & KALICI ESERLER (#3, #4, #10, #15)
    if (currentMetroTab === "mayor") {
      const mStatus = window.RealCityV29
        ? window.RealCityV29.getMayorElectionStatus(data)
        : {
            elected: !!v28.mayor.elected,
            incumbentName: "Başkan Ekrem Çetin",
            support: 55,
            rivalSupport: 37,
            dayOk: true,
            repOk: (data.reputation || 50) >= 75,
            monOk: true,
            supOk: true,
            canRun: (data.reputation || 50) >= 75,
            campaignCost: 75000
          };
      const canRunMayor = mStatus.canRun;
      const mayorHtml = !v28.mayor.elected
        ? `
          <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <h4 style="margin:0;">🏛️ MEVCUT BAŞKAN: ${mStatus.incumbentName}</h4>
              <span class="shift-pill" style="color:#86efac;">Halk Oyun: %${mStatus.support}</span>
            </div>
            <p style="font-size:11.5px; color:#cbd5e1; margin-bottom:7px;">
              Hemen başkan olunmaz! Önce şehirde iş kurup eser bırakmalı ve vatandaş taleplerini çözerek halkın oyunu %51'in üstüne çıkarmalısın:
            </p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:11px; font-weight:800; margin-bottom:8px;">
              <span style="color:${mStatus.dayOk ? "#4ade80" : "#fca5a5"};">${mStatus.dayOk ? "✅" : "⏳"} Gün 8+ / 4 Arazi</span>
              <span style="color:${mStatus.repOk ? "#4ade80" : "#fca5a5"};">${mStatus.repOk ? "✅" : "⏳"} İtibar ≥ 75 (${Math.round(data.reputation || 50)})</span>
              <span style="color:${mStatus.monOk ? "#4ade80" : "#fca5a5"};">${mStatus.monOk ? "✅" : "⏳"} En Az 1 Şehir Eseri</span>
              <span style="color:${mStatus.supOk ? "#4ade80" : "#fca5a5"};">${mStatus.supOk ? "✅" : "⏳"} Halk Oyu ≥ %51 (%${mStatus.support})</span>
            </div>
            <button id="m28RunMayorBtn" class="primary-btn" style="padding:10px; font-size:13px; margin-bottom:6px;" ${canRunMayor ? "" : "disabled"}>
              ${canRunMayor ? `🗳️ SEÇİME GİR & BAŞKAN OL (${mStatus.campaignCost.toLocaleString("tr-TR")} ₺)` : "🔒 Önce 4 Adaylık Şartını Tamamla"}
            </button>
            <button id="m28JumpCivicBtn" class="sal-btn" style="width:100%; padding:8px; font-size:12px; border-color:#38bdf8; color:#bae6fd;">
              🗣️ Vatandaş Talepleri, Otobüs, Teleferik &amp; Körfez Köprüsü Ekranını Aç ➔
            </button>
          </div>
        `
        : `
          <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <h4 style="margin:0;">🏛️ BELEDİYE BAŞKANI KARARNAMELERİ</h4>
              <button id="m28JumpCivicBtn" class="sal-btn" style="font-size:11px; padding:4px 8px; border-color:#38bdf8;">🚌 Belediye Hizmetleri ➔</button>
            </div>
            <div style="display:grid; gap:6px; margin-top:6px;">
              ${MAYOR_DECREES.map((d) => {
                const act = v28.mayor.activeDecree === d.key;
                return `
                  <div class="upgrade-card" style="padding:8px 10px; border-color:${act ? "#4ade80" : "#334155"};">
                    <div class="up-info">
                      <h3 style="font-size:13.5px;">${d.title}</h3>
                      <p style="font-size:11.5px;">${d.desc}</p>
                    </div>
                    <button class="up-buy-btn m28-decree-btn" data-dkey="${d.key}" style="font-size:11.5px; padding:6px 10px;" ${act ? "disabled" : ""}>
                      ${act ? "YÜRÜRLÜKTE ✓" : "İmzala"}
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;

      const monCards = CIVIC_MONUMENTS.map((cm) => {
        const built = !!v28.monuments[cm.key];
        return `
          <div class="upgrade-card" style="border-color:${built ? "#22c55e" : "#334155"};">
            <div class="up-info">
              <h3>${cm.emoji} "${brand}" ${cm.name}</h3>
              <p>${cm.desc}</p>
            </div>
            <button class="up-buy-btn m28-mon-btn" data-mkey="${cm.key}" ${built ? "disabled" : ""}>
              ${built ? "3D ŞEHİRDE ✓" : `${cm.cost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;
      }).join("");

      body.innerHTML = `
        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:13.5px; color:#fff;">${wMode.badge}</strong>
            <span style="font-size:11px; color:#86efac; font-weight:800;">Halk Sevgisi: +%${Math.round((getMonumentLoveMult(v28) - 1) * 100)}</span>
          </div>
          <p style="font-size:12px; color:#cbd5e1; margin:4px 0 8px;">${wMode.desc}</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:7px;">
            <button id="m28StartRallyBtn" class="up-buy-btn" style="background:#dc2626; color:#fff;" ${rallyTimer > 0 ? "disabled" : ""}>
              ${rallyTimer > 0 ? `🏎️ Ralli (${Math.ceil(rallyTimer)}sn)` : "🏎️ Bulvar Rallisi (4.500₺)"}
            </button>
            <button id="m28StartConcertBtn" class="up-buy-btn" style="background:#7c3aed; color:#fff;" ${concertTimer > 0 ? "disabled" : ""}>
              ${concertTimer > 0 ? `🎤 Konser (${Math.ceil(concertTimer)}sn)` : "🎤 Dev Konser (6.000₺)"}
            </button>
          </div>
        </div>
        ${mayorHtml}
        <div class="rep-section" style="border-color:#fde047;">
          <h4>🏫 ŞEHRE ADINI TAŞIYAN 3D ESERLER BIRAK</h4>
          ${monCards}
        </div>
      `;

      const ralB = document.getElementById("m28StartRallyBtn");
      if (ralB && rallyTimer <= 0) {
        ralB.addEventListener("click", () => {
          helpers.payForBusiness(4500, "3D Bulvar Süper Spor Rallisi", () => {
            triggerBoulevardRally(data, helpers);
            renderMetropolisModal(data, helpers);
          });
        });
      }
      const conB = document.getElementById("m28StartConcertBtn");
      if (conB && concertTimer <= 0) {
        conB.addEventListener("click", () => {
          helpers.payForBusiness(6000, "Stadyum Dev Halk Konseri", () => {
            triggerMegaConcert(data, helpers);
            renderMetropolisModal(data, helpers);
          });
        });
      }
      const jumpCiv = document.getElementById("m28JumpCivicBtn");
      if (jumpCiv) {
        jumpCiv.addEventListener("click", () => {
          document.getElementById("metropolisModal").classList.add("hidden");
          if (helpers && helpers.openCivicServices) helpers.openCivicServices();
        });
      }
      const runM = document.getElementById("m28RunMayorBtn");
      if (runM && canRunMayor) {
        runM.addEventListener("click", () => {
          helpers.payForBusiness(mStatus.campaignCost, "Belediye Başkanlığı Seçim Kampanyası", () => {
            v28.mayor.elected = true;
            data.reputation = 100;
            addHeadline(v28, `📰 SEÇİM ZAFERİ: ${brand} Holding Patronu, ${mStatus.incumbentName}'i sandıkta yenerek Belediye Başkanı seçildi!`);
            helpers.sfx.stadiumGoal();
            helpers.showToast("🏛️ TEBRİKLER BAŞKAN! Seçimi kazandın; belediye hizmetleri, tramvay, teleferik ve körfez köprüsü yetkisi açıldı!");
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }
      body.querySelectorAll(".m28-decree-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          v28.mayor.activeDecree = btn.dataset.dkey;
          helpers.sfx.perfectHit();
          helpers.showToast("📜 Yeni Belediye Kararnamesi yürürlüğe girdi!");
          helpers.saveGame();
          helpers.updateHUD();
          renderMetropolisModal(data, helpers);
        });
      });
      body.querySelectorAll(".m28-mon-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const cm = CIVIC_MONUMENTS.find((x) => x.key === btn.dataset.mkey);
          if (!cm || v28.monuments[cm.key]) return;
          helpers.payForBusiness(cm.cost, `${brand} ${cm.name}`, () => {
            v28.monuments[cm.key] = true;
            data.reputation = Math.min(100, (data.reputation || 50) + cm.rep);
            if (cm.sec) data.security = Math.min(100, (data.security || 65) + cm.sec);
            if (data.empire && data.empire.v29) {
              data.empire.v29.publicSupport = Math.min(96, (data.empire.v29.publicSupport || 14) + 9);
            }
            addHeadline(v28, `📰 HAYIRSEVER PATRON: "${brand} ${cm.name}" törenle açıldı!`);
            helpers.sfx.perfectHit();
            helpers.showToast(`🏫 "${brand} ${cm.name}" 3D şehre inşa edildi! (+%9 Halk Oyu)`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      });
      return;
    }

    // SEKME 3: 🚗 2. EL OTO PAZARI, 🛡️ ZIRHLI KASA & 🛳️ KRUVAZİYER / BALIKÇI (#7, #12, #13)
    if (currentMetroTab === "market") {
      const hasWashAndGarage = !!(data.carWashUnlocked && data.garageUnlocked);
      const ekspertizMult = window.RealCityV29 ? window.RealCityV29.getEkspertizCarMult(data) : 1.0;
      const autoBonus = (syn.hasAuto ? 1.35 : 1.0) * ekspertizMult;

      const heistHtml = activeHeist
        ? `
          <div class="rep-section" style="border-color:#ef4444; background:rgba(127,29,29,0.35); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#fef08a;">🚨 GECE HIRSIZI KOVALAMACASI (${Math.ceil(activeHeist.timeLeft)}sn)</strong>
              <button id="m28CatchThiefBtn" class="up-buy-btn" style="background:#16a34a; color:#fff;">🚓 Yakala (+${activeHeist.bounty}₺)</button>
            </div>
          </div>
        `
        : "";

      const carCards = v28.carLot.map((car, idx) => {
        const effRepair = hasWashAndGarage ? Math.round(car.repairCost * 0.5) : car.repairCost;
        const sellVal = Math.round((car.buyPrice + car.repairCost) * car.sellMult * (hasWashAndGarage ? 1.15 : 1.0) * autoBonus);
        let btnHtml = "";
        if (!car.owned) {
          btnHtml = `<button class="up-buy-btn m28-car-act" data-cidx="${idx}" data-act="buy">Al (${car.buyPrice.toLocaleString("tr-TR")}₺)</button>`;
        } else if (!car.repaired) {
          btnHtml = `<button class="up-buy-btn m28-car-act" data-cidx="${idx}" data-act="repair" style="background:#0284c7; color:#fff;">🔧 Yenile (${effRepair.toLocaleString("tr-TR")}₺)</button>`;
        } else {
          btnHtml = `<button class="up-buy-btn m28-car-act" data-cidx="${idx}" data-act="sell" style="background:#16a34a; color:#fff;">💰 Sat (+${sellVal.toLocaleString("tr-TR")}₺)</button>`;
        }
        return `
          <div class="upgrade-card" style="border-color:${car.repaired ? "#22c55e" : car.owned ? "#38bdf8" : "#334155"};">
            <div class="up-info">
              <h3>${car.name}</h3>
              <p>${!car.owned ? `Tahmini Yenilenmiş Satış: <strong style="color:#4ade80;">${sellVal.toLocaleString("tr-TR")} ₺</strong>` : car.repaired ? `✨ Pırıl pırıl hazır! Hemen kârla sat!` : `Tamir & Yıkama ile değerini katla!`}</p>
            </div>
            ${btnHtml}
          </div>
        `;
      }).join("");

      const fishCost = Math.round(6500 * Math.pow(1.45, v28.sea.fishingBoats || 0));

      body.innerHTML = `
        ${heistHtml}
        <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
          <h4>🛡️ ZIRHLI KASA ARACI &amp; MERKEZ BANKASI KASASI (+%4/GÜN FAİZ)</h4>
          <div class="rep-row"><span>🔐 Vadeli Kasadaki Paran:</span><strong style="color:#4ade80; font-size:15px;">${Math.round(v28.vaultBalance || 0).toLocaleString("tr-TR")} ₺</strong></div>
          <div class="rep-row"><span>💰 Yarınki Faiz Getirisi:</span><span class="val-pos">+${Math.round((v28.vaultBalance || 0) * 0.04).toLocaleString("tr-TR")} ₺</span></div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:8px;">
            <button id="m28VaultDep10" class="sal-btn">🛡️ 10B₺ Yatır</button>
            <button id="m28VaultDepHalf" class="sal-btn">🛡️ Yarısını Yatır</button>
            <button id="m28VaultWithdraw" class="sal-btn" style="border-color:#22c55e; color:#86efac;">💵 Tümünü Çek</button>
          </div>
        </div>

        <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4>🚗 2. EL ARAÇ AL - TAMİR ET - SAT (Satılan: ${v28.carsFlipped || 0})</h4>
            <button id="m28RefreshCars" class="sal-btn" style="font-size:11px; padding:3px 7px;">🔄 İlan Yenile</button>
          </div>
          <p style="font-size:11.5px; color:#93c5fd; margin-bottom:6px;">
            ${hasWashAndGarage ? "✅ Kendi Tamirhane & Oto Yıkama'n aktif: Yenileme %50 ucuz ve satış +%15 değerli!" : "💡 İstasyonda Tamirhane ve Oto Yıkama açarsan yenileme yarı fiyatına düşer!"}
          </p>
          ${carCards}
        </div>

        <div class="rep-section" style="border-color:#0ea5e9;">
          <h4>🛳️ DEV KRUVAZİYER TURİST GEMİSİ &amp; 🛥️ BALIKÇI TEKNELERİ</h4>
          <div class="upgrade-card" style="margin-top:6px;">
            <div class="up-info">
              <h3>🛳️ Dev 3D Kruvaziyer Yolcu İskelesi</h3>
              <p>${v28.sea.cruiseUnlocked ? "Aktif! Dev yolcu gemisi düzenli yanaşıp turist ve döviz bırakır!" : "Güney denizine 4 katlı dev 3D Turist Gemisi yanaşır, tüm otel/AVM gelirini coşturur!"}</p>
            </div>
            <button id="m28CruiseBtn" class="up-buy-btn" ${v28.sea.cruiseUnlocked && cruiseShip ? "disabled" : ""}>
              ${!v28.sea.cruiseUnlocked ? "54.000 ₺" : cruiseShip ? "Denizde 🛳️" : "🛳️ Gemi Çağır"}
            </button>
          </div>
          <div class="upgrade-card">
            <div class="up-info">
              <h3>🛥️ Karadeniz Balıkçı Tekneleri (${v28.sea.fishingBoats || 0}/6 Tekne)</h3>
              <p>Denizde avlanıp Yol Restoranı'na taze balık sağlar (Restoran kârı tekne başı +%6 artar)!</p>
            </div>
            <button id="m28FishBtn" class="up-buy-btn" ${(v28.sea.fishingBoats || 0) >= 6 ? "disabled" : ""}>
              ${(v28.sea.fishingBoats || 0) >= 6 ? "6 TEKNE ✓" : `${fishCost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        </div>
      `;

      const catchBtn = document.getElementById("m28CatchThiefBtn");
      if (catchBtn && activeHeist) {
        catchBtn.addEventListener("click", () => {
          data.cash += activeHeist.bounty;
          v28.heistsStopped = (v28.heistsStopped || 0) + 1;
          activeHeist = null;
          helpers.sfx.policeSiren();
          helpers.showToast("🚓 Hırsız kıskıvrak yakalandı! Kasa korundu ve ödül alındı!");
          helpers.saveGame();
          helpers.updateHUD();
          renderMetropolisModal(data, helpers);
        });
      }

      document.getElementById("m28VaultDep10").addEventListener("click", () => {
        if ((data.cash || 0) < 10000) return helpers.showToast("Kasada en az 10.000 ₺ olmalı!");
        sendArmoredDeposit(10000, data, helpers);
        renderMetropolisModal(data, helpers);
      });
      document.getElementById("m28VaultDepHalf").addEventListener("click", () => {
        const half = Math.floor((data.cash || 0) * 0.5);
        if (half < 500) return helpers.showToast("Yatırılacak yeterli nakit yok!");
        sendArmoredDeposit(half, data, helpers);
        renderMetropolisModal(data, helpers);
      });
      document.getElementById("m28VaultWithdraw").addEventListener("click", () => {
        if ((v28.vaultBalance || 0) <= 0) return;
        const amt = v28.vaultBalance;
        v28.vaultBalance = 0;
        data.cash += amt;
        helpers.sfx.cashRegister();
        helpers.showToast(`💵 Vadeli kasadaki ${amt.toLocaleString("tr-TR")} ₺ şirket kasasına aktarıldı!`);
        helpers.saveGame();
        helpers.updateHUD();
        renderMetropolisModal(data, helpers);
      });

      document.getElementById("m28RefreshCars").addEventListener("click", () => {
        v28.carLot = v28.carLot.map((c, idx) => (c.owned ? c : rollUsedCarOffer(idx)));
        helpers.sfx.tap();
        renderMetropolisModal(data, helpers);
      });

      body.querySelectorAll(".m28-car-act").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.cidx);
          const act = btn.dataset.act;
          const car = v28.carLot[idx];
          if (!car) return;
          const effRepair = hasWashAndGarage ? Math.round(car.repairCost * 0.5) : car.repairCost;
          const sellVal = Math.round((car.buyPrice + car.repairCost) * car.sellMult * (hasWashAndGarage ? 1.15 : 1.0) * autoBonus);

          if (act === "buy") {
            helpers.payForBusiness(car.buyPrice, `${car.name} Alımı`, () => {
              car.owned = true;
              helpers.sfx.tap();
              helpers.saveGame();
              helpers.updateHUD();
              renderMetropolisModal(data, helpers);
            });
          } else if (act === "repair") {
            helpers.payForBusiness(effRepair, `${car.name} Tamir & Parlatma`, () => {
              car.repaired = true;
              helpers.sfx.perfectHit();
              helpers.saveGame();
              helpers.updateHUD();
              renderMetropolisModal(data, helpers);
            });
          } else if (act === "sell") {
            data.cash += sellVal;
            if (data.daily) data.daily.carFlipIncome = (data.daily.carFlipIncome || 0) + (sellVal - car.buyPrice - effRepair);
            v28.carsFlipped = (v28.carsFlipped || 0) + 1;
            v28.carLot[idx] = rollUsedCarOffer(idx);
            helpers.sfx.cashRegister();
            helpers.showToast(`🚗 Araç satıldı! Kasaya +${sellVal.toLocaleString("tr-TR")} ₺ girdi!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          }
        });
      });

      const crBtn = document.getElementById("m28CruiseBtn");
      if (crBtn) {
        crBtn.addEventListener("click", () => {
          if (!v28.sea.cruiseUnlocked) {
            helpers.payForBusiness(54000, "Dev Kruvaziyer Turist İskelesi", () => {
              v28.sea.cruiseUnlocked = true;
              startCruiseArrival(data, helpers, false);
              helpers.sfx.shipHorn();
              helpers.saveGame();
              helpers.updateHUD();
              renderMetropolisModal(data, helpers);
            });
          } else if (!cruiseShip) {
            startCruiseArrival(data, helpers, false);
            helpers.sfx.shipHorn();
            renderMetropolisModal(data, helpers);
          }
        });
      }

      const fsBtn = document.getElementById("m28FishBtn");
      if (fsBtn && (v28.sea.fishingBoats || 0) < 6) {
        fsBtn.addEventListener("click", () => {
          helpers.payForBusiness(fishCost, "Yeni Balıkçı Teknesi", () => {
            v28.sea.fishingBoats = (v28.sea.fishingBoats || 0) + 1;
            helpers.sfx.shipHorn();
            helpers.showToast(`🛥️ ${v28.sea.fishingBoats}. Balıkçı Teknesi denize açıldı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }
      return;
    }

    // SEKME 4: 📰 RAKİP HAMLELERİ, SÜRELİ FIRSATLAR & BAŞ MÜDÜR AKADEMİSİ (#8, #11, #16)
    if (currentMetroTab === "rivals") {
      const flashHtml = activeFlashQuest
        ? `
          <div class="rep-section" style="border-color:#22c55e; background:rgba(20,83,45,0.28); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:900; color:#86efac;">⏱️ ANLIK FIRSAT GÖREVİ</span>
              <span class="shift-pill" style="color:#fde047;">${Math.ceil(activeFlashQuest.timeLeft)} sn</span>
            </div>
            <h3 style="font-size:15px; color:#fff; margin:4px 0;">${activeFlashQuest.emoji} ${activeFlashQuest.title}</h3>
            <p style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">${activeFlashQuest.desc}</p>
            <button id="m28DoFlashBtn" class="primary-btn" style="padding:9px; font-size:13px;">
              ⚡ Fırsatı Değerlendir (${activeFlashQuest.cost.toLocaleString("tr-TR")}₺ ➔ +${activeFlashQuest.reward.toLocaleString("tr-TR")}₺!)
            </button>
          </div>
        `
        : `<div class="rep-section" style="margin-bottom:10px; font-size:12px; color:#93c5fd;">⏱️ Yeni anlık fırsat görevi birazdan telsize düşecek!</div>`;

      const rivalAttackHtml = activeRivalMove
        ? `
          <div class="rep-section" style="border-color:#ef4444; background:rgba(127,29,29,0.28); margin-bottom:10px;">
            <div style="font-size:12px; font-weight:900; color:#fca5a5;">🔥 RAKİP HAMLESİ • ${activeRivalMove.boss}</div>
            <h3 style="font-size:15px; color:#fff; margin:3px 0;">${activeRivalMove.title}</h3>
            <p style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">${activeRivalMove.desc}</p>
            <button id="m28CounterRivalBtn" class="primary-btn" style="padding:9px; font-size:13px; background:linear-gradient(180deg,#dc2626,#991b1b);">
              🔥 Karşı Kampanya Başlat (${activeRivalMove.counterCost.toLocaleString("tr-TR")}₺ ➔ +${activeRivalMove.reward.toLocaleString("tr-TR")}₺ Ciro!)
            </button>
          </div>
        `
        : `<div class="rep-section" style="border-color:#22c55e; margin-bottom:10px; font-size:12px; color:#86efac;">✅ Rakipler şu an sessiz! Şehirde üstünlük tamamen sende.</div>`;

      const dirCards = HEAD_DIRECTORS.map((hd) => {
        const st = v28.directors[hd.key] || { lvl: 0, xp: 0 };
        const cost = Math.round(hd.baseCost * Math.pow(1.65, st.lvl));
        return `
          <div class="upgrade-card" style="border-color:${st.lvl > 0 ? "#facc15" : "#334155"};">
            <div class="up-info">
              <h3>${hd.emoji} ${hd.name} ${st.lvl > 0 ? `(Sv.${st.lvl}/5)` : ""}</h3>
              <p>${hd.superpower}</p>
            </div>
            <button class="up-buy-btn m28-dir-btn" data-dkey="${hd.key}" ${st.lvl >= 5 ? "disabled" : ""}>
              ${st.lvl === 0 ? `Ata ${cost.toLocaleString("tr-TR")}₺` : st.lvl >= 5 ? "UZMAN ✓" : `Eğit ${cost.toLocaleString("tr-TR")}₺`}
            </button>
          </div>
        `;
      }).join("");

      const newsHtml = (v28.headlines || [])
        .slice(0, 4)
        .map((n) => `<div class="social-post" style="font-size:12px; margin-bottom:5px;">${n}</div>`)
        .join("");

      body.innerHTML = `
        ${flashHtml}
        ${rivalAttackHtml}
        <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
          <h4>⭐ ÖZEL YETENEKLİ BAŞ MÜDÜRLER (ÇALIŞTIKÇA SEVİYE ATLAR)</h4>
          ${dirCards}
        </div>
        <div class="rep-section" style="border-color:#94a3b8;">
          <h4>📰 ŞEHİR POSTASI GAZETESİ MANŞETLERİ</h4>
          ${newsHtml}
        </div>
      `;

      const fqBtn = document.getElementById("m28DoFlashBtn");
      if (fqBtn && activeFlashQuest) {
        fqBtn.addEventListener("click", () => {
          const fq = activeFlashQuest;
          helpers.payForBusiness(fq.cost, fq.title, () => {
            data.cash += fq.reward;
            if (data.daily) data.daily.eventIncome = (data.daily.eventIncome || 0) + (fq.reward - fq.cost);
            if (fq.fillTank && helpers.fillMainTankFull) helpers.fillMainTankFull();
            if (fq.vipRush && helpers.triggerVipRush) helpers.triggerVipRush(fq.vipRush);
            if (fq.rep) data.reputation = Math.min(100, (data.reputation || 50) + fq.rep);
            activeFlashQuest = null;
            helpers.sfx.perfectHit();
            helpers.showToast(`⚡ Fırsat tamamlandı! Kasaya +${fq.reward.toLocaleString("tr-TR")} ₺ girdi!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }

      const cntBtn = document.getElementById("m28CounterRivalBtn");
      if (cntBtn && activeRivalMove) {
        cntBtn.addEventListener("click", () => {
          const rm = activeRivalMove;
          helpers.payForBusiness(rm.counterCost, "Rakibe Karşı Kampanya", () => {
            data.cash += rm.reward;
            if (data.daily) data.daily.eventIncome = (data.daily.eventIncome || 0) + (rm.reward - rm.counterCost);
            addHeadline(v28, `📰 ZAFER: ${brand} Holding karşı kampanyayla ${rm.boss}'i piyasada geride bıraktı!`);
            activeRivalMove = null;
            helpers.sfx.perfectHit();
            helpers.showToast(`🔥 Karşı hamle tuttu! Müşteriler akın etti (+${rm.reward.toLocaleString("tr-TR")} ₺)!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      }

      body.querySelectorAll(".m28-dir-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hd = HEAD_DIRECTORS.find((x) => x.key === btn.dataset.dkey);
          const st = v28.directors[hd.key];
          if (!hd || !st || st.lvl >= 5) return;
          const cost = Math.round(hd.baseCost * Math.pow(1.65, st.lvl));
          helpers.payForBusiness(cost, hd.name, () => {
            st.lvl += 1;
            st.xp = 0;
            helpers.sfx.perfectHit();
            helpers.showToast(`⭐ ${hd.name} Sv.${st.lvl} olarak göreve başladı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderMetropolisModal(data, helpers);
          });
        });
      });
      return;
    }

    // SEKME 5: 🏆 12 KUPA VİTRİNİ, 🌍 1+10 ŞEHİR KISAYOLU & 💾 KAYIT TAŞIMA (#5, #17)
    const achCards = ACHIEVEMENTS.map((a) => {
      const claimed = !!v28.claimedAchievements[a.id];
      const ready = a.check(data, v28);
      return `
        <div class="upgrade-card" style="border-color:${claimed ? "#22c55e" : ready ? "#facc15" : "#334155"};">
          <div class="up-info">
            <h3>${a.icon} ${a.title}</h3>
            <p>${a.desc} • Ödül: <strong style="color:#4ade80;">+${a.reward.toLocaleString("tr-TR")} ₺</strong> + ${a.xp} XP</p>
          </div>
          <button class="up-buy-btn m28-ach-btn" data-aid="${a.id}" ${claimed || !ready ? "disabled" : ""}>
            ${claimed ? "ALINDI ✓" : ready ? "🎁 ÖDÜL AL" : "Kilitli"}
          </button>
        </div>
      `;
    }).join("");

    body.innerHTML = `
      <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px; text-align:center;">
        <h4>🌍 1 MERKEZ + 10 ÇEVRE ŞEHİR HARİTASI</h4>
        <p style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">
          Şehirdeki yapıları tamamladıkça etraftaki 10 yeni şehrin kilidini aç ve rakiplerin bölgelerini satın al!
        </p>
        <button id="m28JumpWorldMapBtn" class="primary-btn" style="padding:10px; font-size:13.5px; background:linear-gradient(180deg,#0284c7,#0369a1);">
          🌍 1 + 10 ŞEHİR ÜLKE HARİTASINI AÇ ➔
        </button>
      </div>

      <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
        <h4>💾 CİHAZLAR ARASI KAYIT TAŞIMA (TELEFON ⇄ MAC / WINDOWS)</h4>
        <p style="font-size:11.5px; color:#cbd5e1; margin-bottom:6px;">
          İlerlemeni kopyalayıp (<strong>Mac: Cmd+C / Cmd+V</strong>, <strong>Windows: Ctrl+C / Ctrl+V</strong>) diğer bilgisayar veya telefonuna yapıştırabilirsin:
        </p>
        <textarea id="m28SaveCodeArea" rows="2" placeholder="Kayıt kodu burada görünür veya başka cihazdaki kodu buraya yapıştır..."
          style="width:100%; background:#090d1a; color:#fde68a; border:1.5px solid #334155; border-radius:9px; padding:7px; font-size:11px; margin-bottom:6px;"></textarea>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <button id="m28ExportSaveBtn" class="up-buy-btn" style="font-size:12px;">📋 Kayıt Kodunu Üret</button>
          <button id="m28ImportSaveBtn" class="up-buy-btn" style="background:#16a34a; color:#fff; font-size:12px;">📥 Kodu Yükle</button>
        </div>
      </div>

      <div class="rep-section" style="border-color:#facc15;">
        <h4>🏆 KUPA VİTRİNİ &amp; BAŞARIMLAR (${Object.keys(v28.claimedAchievements).length}/${ACHIEVEMENTS.length})</h4>
        ${achCards}
      </div>
    `;

    document.getElementById("m28JumpWorldMapBtn").addEventListener("click", () => {
      document.getElementById("metropolisModal").classList.add("hidden");
      if (helpers.openWorldCitiesMap) helpers.openWorldCitiesMap();
    });

    document.getElementById("m28ExportSaveBtn").addEventListener("click", () => {
      try {
        if (helpers.saveGame) helpers.saveGame(true);
        const json = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(json)));
        const area = document.getElementById("m28SaveCodeArea");
        if (area) {
          area.value = encoded;
          if (area.select) area.select();
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(encoded).catch(() => {});
        }
        helpers.sfx.perfectHit();
        helpers.showToast("📋 Kayıt kodun kutuya hazırlandı! Kopyalayıp (Mac: Cmd+C / Windows: Ctrl+C) saklayabilirsin.");
      } catch (_) {}
    });

    document.getElementById("m28ImportSaveBtn").addEventListener("click", () => {
      const area = document.getElementById("m28SaveCodeArea");
      const raw = (area && area.value || "").trim();
      if (!raw) return helpers.showToast("Önce kayıt kodunu kutuya yapıştır!");
      try {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (!parsed || typeof parsed.cash !== "number") throw new Error("Invalid");
        if (helpers.applyImportedSave) helpers.applyImportedSave(parsed);
        helpers.sfx.perfectHit();
        helpers.showToast("✅ Kayıt başarıyla yüklendi!");
        renderMetropolisModal(data, helpers);
      } catch (_) {
        helpers.sfx.burnFail();
        helpers.showToast("⚠️ Geçersiz veya eksik kayıt kodu!");
      }
    });

    body.querySelectorAll(".m28-ach-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const a = ACHIEVEMENTS.find((x) => x.id === btn.dataset.aid);
        if (!a || v28.claimedAchievements[a.id] || !a.check(data, v28)) return;
        v28.claimedAchievements[a.id] = true;
        data.cash += a.reward;
        if (data.empire && data.empire.v16) data.empire.v16.xp = (data.empire.v16.xp || 0) + a.xp;
        helpers.sfx.stadiumGoal();
        helpers.showToast(`🏆 "${a.title}" kupasını kazandın! +${a.reward.toLocaleString("tr-TR")} ₺!`);
        helpers.saveGame();
        helpers.updateHUD();
        renderMetropolisModal(data, helpers);
      });
    });
  }

  function get3DRenderState(data) {
    const v28 = ensureV28(data);
    return {
      v28,
      tram: v28.tram.unlocked ? liveTram : null,
      couriers: liveCouriers,
      rallyCars: liveRallyCars,
      armoredVan,
      cruiseShip,
      fishingBoatsCount: v28.sea.fishingBoats || 0,
      monuments: v28.monuments || {},
      monumentDefs: CIVIC_MONUMENTS,
      isRain: v28.weatherKey === "rain",
      concertActive: concertTimer > 0,
      floats: metroFloats
    };
  }

  return {
    SURROUNDING_CITIES,
    CIVIC_MONUMENTS,
    createDefaultV28,
    mergeV28,
    ensureV28,
    calcSupplyChainSynergies,
    syncCityUnlocks,
    getUnlockedSurroundingCount,
    getCompletedSurroundingCount,
    calcMultiCityCycleIncome,
    getGlobalEmpireMult,
    getStationFacilityMult,
    getExtraLandMult,
    getBuildDiscountMult,
    getUtilityDiscountMult,
    onRivalPlotConquered,
    updateV28,
    onDayRollover,
    setMetroTab,
    renderMetropolisModal,
    renderWorldCitiesTab,
    get3DRenderState
  };
})();

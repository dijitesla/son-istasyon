// Son İstasyon v4.0 — Ürün Kataloğu, Ekipmanlar, Rozetler ve Zengin Rastgele Vardiya Üreticisi

window.CATALOG = {
  fuels: {
    benzin: { label: "🟢 Benzin", short: "Benzin", color: "#22c55e" },
    mazot: { label: "⚫ Mazot (Dizel)", short: "Mazot", color: "#94a3b8" },
    lpg: { label: "🔵 LPG Otogaz", short: "LPG", color: "#38bdf8" }
  },
  drinks: {
    cay: { label: "🫖 Demli Çay", short: "Çay" },
    turk: { label: "☕ Türk Kahvesi", short: "T.Kahvesi" },
    sade: { label: "🥤 Sade Filtre", short: "Sade" },
    sutlu: { label: "🥛 Sütlü Latte", short: "Latte" }
  },
  toasts: {
    kasarli: { label: "🧀 Kaşarlı Tost", short: "Kaşarlı" },
    sucuklu: { label: "🌶️ Karışık Sucuklu", short: "Sucuklu" }
  },
  market: {
    su: { label: "💧 Soğuk Su", short: "Su" },
    enerji: { label: "⚡ Enerji İçeceği", short: "Enerji" },
    cikolata: { label: "🍫 Fıstıklı Çikolata", short: "Çikolata" },
    yag: { label: "🛢️ Motor Yağı / Cam Suyu", short: "Oto Yağ" }
  }
};

window.SHOP_UPGRADES = [
  {
    id: "autoPump",
    name: "⛽ Akıllı Pompa Kesici",
    cost: 240,
    desc: "Yakıt sayacı hedefe yaklaşınca yavaşlar, tam isabet bahşişini kolaylaştırır."
  },
  {
    id: "smartGrill",
    name: "🥪 Çift Telli Termostat Izgara",
    cost: 220,
    desc: "Tostların yanmasını önler; tam kıvamında otomatik alır (+20 ₺ bahşiş)."
  },
  {
    id: "digitalRegister",
    name: "🧮 Akıllı Yazar Kasa",
    cost: 230,
    desc: "Para üstü ekranında tek tuşla hatasız para üstü verme özelliğini açar."
  },
  {
    id: "depotAlarm",
    name: "🚨 Kızılötesi Depo Sensörü",
    cost: 280,
    desc: "Arka depoya biri sızdığında kamera butonunda kırmızı alarm yanar."
  },
  {
    id: "proUv",
    name: "🟣 Lazerli Mor Işık Kasası",
    cost: 250,
    desc: "Sahte banknot uzatıldığında kasa düğmesinde anında mor uyarı yanar."
  },
  {
    id: "upsBattery",
    name: "🔋 Jeneratör Güç Kaynağı",
    cost: 260,
    desc: "Şalter attığında sigortaların çoğunu otomatik korur, tek dokunuşla açar."
  },
  {
    id: "vipEspresso",
    name: "☕ Bakır Çay & Kahve Kazanı",
    cost: 250,
    desc: "Tüm çay ve kahve siparişlerinden ekstra +20 ₺ bahşiş kazandırır."
  }
];

window.BADGES_LIST = [
  { id: "first_night", icon: "🌙", name: "İlk Gece Sağ Çıktı", desc: "1. Gece vardiyasını tamamladın." },
  { id: "dog_friend", icon: "🐕", name: "Duman'ın Dostu", desc: "İstasyon köpeği Duman'ı besleyip sadakatini kazandın." },
  { id: "trunk_detective", icon: "🔦", name: "Bagaj Dedektifi", desc: "El feneriyle bagajda gizlenen suç delilini buldun!" },
  { id: "scam_buster", icon: "☎️", name: "Yutmazlar!", desc: "Sabit telefondan arayan dolandırıcının oyununu bozdun!" },
  { id: "fake_hunter", icon: "🟣", name: "Kalpazan Avcısı", desc: "Mor ışıkla sahte parayı yakaladın." },
  { id: "code_breaker", icon: "🔓", name: "Şifre ve Galeri Avcısı", desc: "Şifreli telefonu kırıp gizli mesaj/fotoğraflara ulaştın." },
  { id: "safe_haven", icon: "🤫", name: "Güvenli Sığınak", desc: "Yardıma muhtaç birini arka odaya saklayıp korudun." },
  { id: "story_master", icon: "🏆", name: "Son İstasyon Efsanesi", desc: "5 gecelik ana hikayeyi (25 müşteri) tamamladın!" }
];

// SONSUZ RASTGELE VARDİYA ÜRETİCİSİ (v4.0: Bagaj, Duman, Sabit Telefon, Veresiye ve Galeri dahil!)
window.generateEndlessNight = function (shiftNo) {
  const firstNamesM = ["Kadir", "Orhan", "Sinan", "Tufan", "Zafer", "Yavuz", "Serkan", "Oğuz", "Metin", "Cihan", "İlker", "Levent", "Soner", "Furkan", "Hakan"];
  const firstNamesF = ["Zeynep", "Derya", "Selin", "Gökçe", "Aylin", "Burcu", "Damla", "Sibel", "Ceren", "Aslı", "Pınar", "Tuğba", "Merve"];
  const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Özkan", "Arslan", "Doğan", "Kılıç", "Polat", "Keskin", "Bozkurt", "Karaca"];
  const rolesGood = ["Gece Fırıncısı", "Şehirler Arası Kurye", "Nöbetçi Eczacı", "Üniversite Öğrencisi", "Balık Hali Esnafı", "Veteriner Hekim", "Düğün Fotoğrafçısı", "Gezi Yazarı"];
  const rolesSus = ["Tedirgin Yolcu", "Gece Yarısı Yabancısı", "Karanlık Sürücü", "Aceleci Müşteri", "Gözlüklü Şahıs"];

  const stylesM = ["short", "trucker", "cap", "beanie", "bald", "slick", "hood", "helmet"];
  const stylesF = ["long", "bun", "curly", "hijab"];
  const skins = ["#fad2b4", "#f3c6a5", "#eab68c", "#dfb18b", "#d2996e"];
  const colors = ["#dc2626", "#2563eb", "#16a34a", "#7c3aed", "#ea580c", "#0f766e", "#be123c", "#334155", "#ca8a04"];
  const carShapes = [
    { shape: "sedan", type: "Gece Sedanı" },
    { shape: "suv", type: "Arazi SUV" },
    { shape: "truck", type: "Nakliye Kamyonu" },
    { shape: "van", type: "Kapalı Panelvan" },
    { shape: "taxi", type: "Gece Taksisi" }
  ];
  const cities = ["06", "16", "34", "35", "41", "52", "55", "61", "07"];
  const letters = ["KYP", "GCE", "SRN", "MTR", "YLD", "DRK", "FTR", "VRD"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const usedNames = new Set();

  const wantedPlateEnd = String(100 + Math.floor(Math.random() * 899));
  const wantedFullPlate = `${pick(cities)} KÇK ${wantedPlateEnd}`;

  const customers = [];
  const times = ["00:20", "01:15", "02:10", "03:25", "04:35"];
  const archetypes = ["clean_credit", "victim", "fraud", "clean_call", "wanted"].sort(() => Math.random() - 0.5);

  archetypes.forEach((arch, idx) => {
    const isFemale = arch === "victim" ? Math.random() < 0.7 : Math.random() < 0.44;
    let fName = "";
    do {
      fName = isFemale ? pick(firstNamesF) : pick(firstNamesM);
    } while (usedNames.has(fName));
    usedNames.add(fName);

    const fullName = `${fName} ${pick(lastNames)}`;
    const birthYear = 1973 + Math.floor(Math.random() * 30);
    const carInfo = pick(carShapes);
    const carColor = pick(colors);
    const normalPlate = `${pick(cities)} ${pick(letters)} ${10 + Math.floor(Math.random() * 89)}`;
    const plate = arch === "wanted" ? wantedFullPlate : normalPlate;

    const hasFuel = Math.random() < 0.6;
    const fuelType = hasFuel ? pick(["benzin", "mazot", "lpg"]) : null;
    const fuelAmt = hasFuel ? pick([250, 300, 350, 400]) : 0;
    const drink = Math.random() < 0.7 ? pick(["cay", "turk", "sade", "sutlu"]) : null;
    const toast = Math.random() < 0.55 ? pick(["kasarli", "sucuklu"]) : null;
    const market = !drink && !toast ? "su" : Math.random() < 0.55 ? pick(["su", "enerji", "cikolata", "yag"]) : null;

    const isThreat = arch === "fraud" || arch === "wanted";
    const fakeBill = arch === "fraud" && Math.random() < 0.6;
    const fakeId = arch === "fraud" && !fakeBill;
    const depotIntruder = arch === "wanted";
    const powerOut = idx === 2 && Math.random() < 0.5;

    // Para üstü ve veresiye hesabı
    const billCost = (hasFuel ? 110 : 0) + (drink ? 30 : 0) + (toast ? 40 : 0) + (market ? 30 : 0) || 60;
    const paidWith = billCost <= 150 ? 200 : 500;
    const asksCredit = arch === "clean_credit" || (arch === "fraud" && !fakeBill && Math.random() < 0.4);
    const creditHonest = arch === "clean_credit";

    // Bagaj verisi
    const trunkData =
      arch === "wanted"
        ? { type: "stolen_plates", label: "🚨 ÇALINTI PLAKALAR VE HALAT!", suspicious: true }
        : arch === "fraud"
        ? { type: "fake_money", label: "🚨 SAHTE BANKNOT KALIPLARI!", suspicious: true }
        : Math.random() < 0.4
        ? { type: "kitten", label: "🐱 Yağmurdan Kurtarılan Yavru Kedi (Temiz)", suspicious: false }
        : { type: "clean_tools", label: "🧰 Yedek Lastik ve Valiz (Temiz)", suspicious: false };

    // Sabit hat araması
    let landlineCall = null;
    if (arch === "clean_call") {
      landlineCall = {
        caller: "Telefon Dolandırıcısı (Sahte Ortak)",
        text: "Alo genç! Ben patronun ortağıyım, acil kasadan 150 TL ayırıp kuryeye ver!",
        isScam: true
      };
    } else if (arch === "wanted") {
      landlineCall = {
        caller: "155 Polis Haber Merkezi",
        text: `Dikkat! Aranan ${wantedFullPlate} plakalı şahsın istasyonunuza girdiği saptandı! Bagajını kontrol edin ve 112'ye basın!`,
        isScam: false
      };
    }

    const orderParts = [];
    if (hasFuel) orderParts.push(`${fuelAmt} ₺ ${window.CATALOG.fuels[fuelType].short}`);
    if (drink) orderParts.push(window.CATALOG.drinks[drink].label);
    if (toast) orderParts.push(window.CATALOG.toasts[toast].label);
    if (market) orderParts.push(window.CATALOG.market[market].label);

    let greeting = asksCredit
      ? `Abi çok mahcubum, cüzdanı düşürmüşüm... ${orderParts.join(", ")} hazırlasan da VERESİYE yazsan? Yarın gece iki katıyla öderim!`
      : `İyi geceler! Bana ${orderParts.join(", ")} hazırlar mısın?`;

    let wantsCharger = false;
    let phoneData = null;

    if (arch === "victim") {
      greeting = `Ne olur yardım et! Peşimde belalı bir araba var... ${orderParts.join(" ve ")} verip beni ARKA ODAYA SAKLA!`;
      wantsCharger = true;
      phoneData = {
        owner: `${fName}'in Telefonu`,
        locked: false,
        pin: null,
        wallpaperTone: "indigo",
        notifications: [{ app: "ACİL MESAJ", sender: "Ailem", body: "Sakın yola devam etme, açık bir benzinliğe sığın!" }],
        gallery: [{ theme: "car", caption: "Arkadan takip eden şüpheli aracın farları" }]
      };
    } else if (arch === "wanted") {
      wantsCharger = true;
      phoneData = {
        owner: "Şifreli Cihaz",
        locked: true,
        pin: String(birthYear),
        pinHint: "Kilit Notu: ' Kimlikteki doğum yılım '",
        wallpaperTone: "crimson",
        notifications: [{ app: "ŞİFRELİ KANAL", sender: "Merkez", body: `${wantedFullPlate} plakası deşifre oldu, bagajdaki malları sakla!` }],
        gallery: [{ theme: "pier", caption: "Gece 05:30 kaçış teknesi konumu" }]
      };
    }

    let outcomes = {};
    if (arch === "clean_credit" || arch === "clean_call") {
      outcomes = {
        serve: { correct: true, badge: "TEMİZ SATIŞ", title: `${fName} memnun ayrıldı!`, desc: "Para üstünü doğru verdin ve satışı tamamladın!" },
        credit: { correct: creditHonest, badge: "VERESİYE DEFTERİ", title: `${fName} Veresiye Defterine Yazıldı!`, desc: "Söz verdiği gibi bir sonraki gece 2 KATIYLA ödeyip ödemeyeceğini göreceğiz!" },
        hide: { correct: false, badge: "GEREKSİZ", title: "Normal müşteriyi arka odaya çağırdın!", desc: "Müşteri şaşırıp çıktı (-40 ₺).", penalty: 40 },
        lock: { correct: false, badge: "MÜŞTERİ KAÇTI", title: "Dürüst müşteriyi kovdun!", desc: "Satış kaçtı (-50 ₺).", penalty: 50 },
        police: { correct: false, badge: "ASILSIZ İHBAR", title: "Masum müşteriye polis çağırdın!", desc: "Ceza kesildi (-100 ₺).", penalty: 100 }
      };
    } else if (arch === "victim") {
      outcomes = {
        hide: { correct: true, badge: "HAYAT KURTARDIN!", title: `${fName} Arka Odada Güvende! (+165 ₺)`, desc: "Mağduru korudun, takipçiler istasyonu boş sanıp geçti!", bonus: 165, badgeUnlock: "safe_haven" },
        serve: { correct: false, badge: "RİSKLİ", title: "Mağduru dışarıda bıraktın!", desc: "İçeri saklamak gerekiyordu (-40 ₺).", penalty: 40 },
        lock: { correct: false, badge: "VİCDANSIZLIK", title: "Sığınmacıya kapıyı kilitledin!", desc: "Tepki çektin (-90 ₺).", penalty: 90 },
        police: { correct: true, badge: "EKİP KORUMASI", title: "Polis mağduru korumaya aldı (+95 ₺)", desc: "Güvenle götürüldü.", bonus: 95 }
      };
    } else if (arch === "fraud") {
      outcomes = {
        serve: { correct: false, badge: "DOLANDIRILDIN!", title: "Sahtekâra Satış Yaptın! (-190 ₺)", desc: "Duman'ın hırlamasını, mor ışığı veya bagajı atladın!", penalty: 190 },
        credit: { correct: false, badge: "VERESİYE ÇARPTI!", title: "Sahtekârı Veresiye Yazdın!", desc: "Sahte isim vermiş, borcun üstüne yatacak!" },
        hide: { correct: false, badge: "HATA!", title: "Dolandırıcıyı İçeri Soktun!", desc: "Kasadan para çaldı (-180 ₺)!", penalty: 180 },
        lock: { correct: true, badge: "GEÇİT YOK!", title: "Sahtekârı Kapı Dışarı Ettin! (+135 ₺)", desc: "Kontrollerin sayesinde zarar görmedin!", bonus: 135, badgeUnlock: "fake_hunter" },
        police: { correct: true, badge: "SUÇÜSTÜ!", title: "Dolandırıcı Yakalandı! (+175 ₺)", desc: "Bagajdaki sahte kalıplarla ele geçirildi!", bonus: 175, badgeUnlock: "fake_hunter" }
      };
    } else {
      outcomes = {
        police: { correct: true, badge: "ARANAN YAKALANDI!", title: `${wantedFullPlate} Kıskıvrak Alındı! (+290 ₺)`, desc: "Aranan şahsı ve bagajdaki delilleri polise teslim ettin!", bonus: 290 },
        lock: { correct: true, badge: "SAVUNMA", title: "Kepengi indirip suçluyu kovdun (+75 ₺)", desc: "Kendini korudun.", bonus: 75 },
        serve: { correct: false, badge: "SUÇLUYA YARDIM!", title: "Aranan Araca Hizmet Ettin!", desc: "Ceza kesildi (-190 ₺).", penalty: 190 },
        hide: { correct: false, badge: "FELAKET!", title: "Aranan Suçluyu İçeri Aldın!", desc: "Kasa soyuldu (-240 ₺)!", penalty: 240 }
      };
    }

    customers.push({
      id: `rnd4_${shiftNo}_${idx}`,
      name: fName,
      role: isThreat ? pick(rolesSus) : pick(rolesGood),
      time: times[idx],
      radioTicker: `🚨 BÜLTEN: Bu gece ${wantedFullPlate} plakalı araç aranıyor! Şüpheli araçların bagajını fenerle kontrol edin!`,
      look: {
        style: arch === "wanted" && Math.random() < 0.5 ? "hood" : isFemale ? pick(stylesF) : pick(stylesM),
        skin: pick(skins),
        outfit: pick(colors),
        outfit2: "#0f172a",
        capColor: pick(colors),
        hairColor: pick(["#090d1a", "#3f3f46", "#7c2d12", "#1e1b4b"]),
        mustache: !isFemale && Math.random() < 0.35,
        glasses: Math.random() < 0.28,
        scar: isThreat && Math.random() < 0.5
      },
      isThreat,
      car: {
        shape: carInfo.shape,
        type: carInfo.type,
        color: carColor,
        plate,
        muddyPlate: arch === "wanted",
        vestClue: false,
        pumpNote: arch === "wanted" ? `🚨 ARANAN PLAKA: ${wantedFullPlate}!` : "Araç dıştan normal görünüyor."
      },
      trunkData,
      idCard: {
        fullName,
        birthYear,
        validUntil: fakeId ? "2020 (GEÇERSİZ!)" : "2031",
        plateMatch: fakeId ? "00 SAHTE 00 (UYUŞMUYOR!)" : plate,
        isFake: isThreat
      },
      depotIntruder,
      depotNote: depotIntruder ? "🚨 Arka depo kapısında levye ile zorlama var!" : "Arka depo sakin.",
      powerOutage: powerOut,
      landlineCall,
      requests: { fuelType, fuel: fuelAmt, drink, toast, market },
      payment: { billCost, paidWith, asksCredit, creditHonest, creditAmount: 140 },
      cashBill: {
        denom: paidWith,
        fake: fakeBill,
        serial: fakeBill ? "FK-000999" : `TR-${300000 + Math.floor(Math.random() * 600000)}`,
        uvText: fakeBill ? `⚠️ SAHTE ${paidWith} ₺ KOPYA!` : `${paidWith} ₺ ORİJİNAL ŞERİT ✓`
      },
      wantsCharger,
      phoneData,
      reward: billCost,
      greeting,
      questions: [
        { btn: "Bagajda ne taşıyorsun?", mood: isThreat ? "nervous" : "warm", reply: isThreat ? "Özel eşyam var birader, fener falan tutma sakın!" : "Yedek malzemelerim var, fenerle bakabilirsin." },
        { btn: "Evraklarında sıkıntı var mı?", mood: isThreat ? "angry" : "neutral", reply: isThreat ? "Amma çok soru sordun!" : "Her şeyim tam kardeşim." },
        { btn: "Yol durumu nasıl?", mood: "neutral", reply: `Polis ${wantedFullPlate} plakasını arıyormuş.` }
      ],
      outcomes
    });
  });

  return {
    nightNumber: shiftNo,
    isEndless: true,
    title: `SONSUZ VARDİYA #${shiftNo}`,
    wantedPoster: {
      title: `ARANAN PLAKA: ${wantedFullPlate}`,
      desc: "Şüpheli araçların bagajını fenerle ara, köpeğin Duman'ı besle, çalan sabit telefona dikkat et!"
    },
    bossSms: `Sonsuz Vardiya #${shiftNo}! Bu gece aranan plaka: ${wantedFullPlate}. Duman'ı beslemeyi ve para üstünü doğru saymayı unutma!`,
    customers
  };
};

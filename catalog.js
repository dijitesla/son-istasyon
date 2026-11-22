// Son İstasyon v3.0 — Ürün Kataloğu, Ekipmanlar, Rozetler ve Rastgele Vardiya Üreticisi

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
    desc: "Yakıt sayacı hedefe yaklaşınca otomatik yavaşlar, tam isabet bahşişini kolaylaştırır."
  },
  {
    id: "smartGrill",
    name: "🥪 Çift Telli Termostat Izgara",
    cost: 220,
    desc: "Kaşarlı ve sucuklu tostların yanmasını önler; tam kıvamında otomatik alır (+20 ₺ bahşiş)."
  },
  {
    id: "depotAlarm",
    name: "🚨 Kızılötesi Depo Sensörü",
    cost: 290,
    desc: "Arka depoya biri sızdığında kamera butonunda kırmızı alarm çalar, soygunu önler."
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
    cost: 270,
    desc: "Şalter attığında acil aydınlatma devreye girer ve sigortaları tek tuşla kaldırır."
  },
  {
    id: "vipEspresso",
    name: "☕ Bakır Çay & Kahve Kazanı",
    cost: 260,
    desc: "Tüm çay ve kahve siparişlerinden ekstra +20 ₺ lezzet bahşişi kazandırır."
  }
];

window.BADGES_LIST = [
  { id: "first_night", icon: "🌙", name: "İlk Gece Sağ Çıktı", desc: "1. Gece vardiyasını tamamladın." },
  { id: "fake_hunter", icon: "🟣", name: "Kalpazan Avcısı", desc: "Sahte para veren bir dolandırıcıyı yakaladın." },
  { id: "code_breaker", icon: "🔓", name: "Şifre Kırıcı", desc: "Şarjdaki kilitli bir telefonun PIN kodunu çözdün." },
  { id: "safe_haven", icon: "🤫", name: "Güvenli Sığınak", desc: "Yardıma muhtaç birini arka odaya saklayıp korudun." },
  { id: "depot_guard", icon: "🔔", name: "Depo Bekçisi", desc: "Arka depoya sızan hırsızı kameradan yakalayıp püskürttün." },
  { id: "id_detective", icon: "🪪", name: "Sahte Kimlik Dedektifi", desc: "Kimlik kontrolüyle aranan veya sahte evraklı şahsı tespit ettin." },
  { id: "story_master", icon: "🏆", name: "Son İstasyon Efsanesi", desc: "5 gecelik ana hikayeyi (25 müşteri) bitirdin!" }
];

// SONSUZ RASTGELE VARDİYA ÜRETİCİSİ (Her gece bambaşka 5 müşteri üretir!)
window.generateEndlessNight = function (shiftNo) {
  const firstNamesM = ["Kadir", "Orhan", "Sinan", "Tufan", "Zafer", "Yavuz", " Serkan", "Oğuz", "Metin", "Cihan", "İlker", "Levent", "Soner", "Furkan", "Hakan"];
  const firstNamesF = ["Zeynep", "Derya", "Selin", "Gökçe", "Aylin", "Burcu", "Damla", "Sibel", "Ceren", "Aslı", "Pınar", "Tuğba", "Merve"];
  const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Özkan", "Arslan", "Doğan", "Kılıç", "polat", "keskin", "bozkurt", "karaca"];
  const rolesGood = ["Gece Fırıncısı", "Şehirler Arası Kurye", "Nöbetçi Eczacı", "Üniversite Öğrencisi", "Balık Hali Esnafı", "Gece Vardiyası İşçisi", "Veteriner Hekim", "Düğün Fotoğrafçısı", "Gezi Yazarı", "Tır Şoförü"];
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
    { shape: "taxi", type: "Gece Taksisi" },
    { shape: "moto", type: "Kurye Motosikleti" }
  ];
  const cities = ["06", "16", "34", "35", "41", "52", "55", "61", "07"];
  const letters = ["KYP", "GCE", "SRN", "MTR", "YLD", "DRK", "FTR", "VRD", "ozl"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const usedNames = new Set();

  // O gecenin aranan suçlu plakası veya ismi
  const wantedPlateEnd = String(100 + Math.floor(Math.random() * 899));
  const wantedCity = pick(cities);
  const wantedFullPlate = `${wantedCity} KÇK ${wantedPlateEnd}`;

  const customers = [];
  const times = ["00:20", "01:15", "02:10", "03:25", "04:35"];

  // 5 farklı senaryo tipi karıştırılır: 2 temiz müşteri, 1 mağdur (saklanmak isteyen), 1 sahte para/kimlikçi, 1 aranan suçlu!
  const archetypes = ["clean", "victim", "fraud", "clean2", "wanted"].sort(() => Math.random() - 0.5);

  archetypes.forEach((arch, idx) => {
    const isFemale = arch === "victim" ? Math.random() < 0.7 : Math.random() < 0.42;
    let fName = "";
    do {
      fName = (isFemale ? pick(firstNamesF) : pick(firstNamesM)).trim();
    } while (usedNames.has(fName));
    usedNames.add(fName);

    const lName = pick(lastNames);
    const fullName = `${fName} ${lName.charAt(0).toUpperCase() + lName.slice(1)}`;
    const birthYear = 1972 + Math.floor(Math.random() * 32);
    const carInfo = pick(carShapes);
    const carColor = pick(colors);
    const normalPlate = `${pick(cities)} ${pick(letters).toUpperCase()} ${10 + Math.floor(Math.random() * 89)}`;
    const plate = arch === "wanted" ? wantedFullPlate : normalPlate;

    // Zengin rastgele sipariş
    const fuelKeys = ["benzin", "mazot", "lpg"];
    const hasFuel = carInfo.shape !== "walk" && Math.random() < 0.65;
    const fuelType = hasFuel ? pick(fuelKeys) : null;
    const fuelAmt = hasFuel ? pick([250, 300, 350, 400, 500]) : 0;

    const drinkKeys = ["cay", "turk", "sade", "sutlu"];
    const drink = Math.random() < 0.75 ? pick(drinkKeys) : null;
    const toast = Math.random() < 0.55 ? pick(["kasarli", "sucuklu"]) : null;
    const market = !drink && !toast ? "su" : Math.random() < 0.6 ? pick(["su", "enerji", "cikolata", "yag"]) : null;

    const fakeBill = arch === "fraud" && Math.random() < 0.65;
    const fakeId = arch === "fraud" && !fakeBill;
    const depotIntruder = arch === "wanted" || (arch === "fraud" && Math.random() < 0.45);
    const powerOut = idx === 2 && Math.random() < 0.65;

    const pinCode = String(birthYear);
    const look = {
      style: arch === "wanted" && Math.random() < 0.5 ? "hood" : isFemale ? pick(stylesF) : pick(stylesM),
      skin: pick(skins),
      outfit: pick(colors),
      outfit2: "#0f172a",
      capColor: pick(colors),
      hairColor: pick(["#090d1a", "#3f3f46", "#7c2d12", "#1e1b4b"]),
      mustache: !isFemale && Math.random() < 0.35,
      glasses: Math.random() < 0.28,
      scar: arch === "wanted" && Math.random() < 0.5
    };

    const orderParts = [];
    if (hasFuel) orderParts.push(`${fuelAmt} ₺ ${window.CATALOG.fuels[fuelType].short}`);
    if (drink) orderParts.push(window.CATALOG.drinks[drink].label);
    if (toast) orderParts.push(window.CATALOG.toasts[toast].label);
    if (market) orderParts.push(window.CATALOG.market[market].label);

    let greeting = `İyi geceler! Bana ${orderParts.join(", ")} hazırlar mısın?`;
    let idCard = {
      fullName,
      birthYear,
      validUntil: fakeId ? "2020 (SÜRESİ GEÇMİŞ!)" : "2031",
      plateMatch: fakeId ? "00 SAHTE 00 (UYUŞMUYOR!)" : plate,
      isFake: fakeId || arch === "wanted"
    };

    let phoneData = null;
    let wantsCharger = false;

    if (arch === "victim") {
      greeting = `Ne olur yardım et! Peşimde belalı bir araç var... ${orderParts.join(" ve ")} verip beni arka odaya saklar mısın?!`;
      wantsCharger = true;
      phoneData = {
        owner: `${fName}'in Telefonu`,
        locked: false,
        pin: null,
        wallpaperTone: "indigo",
        notifications: [
          { app: "ACİL MESAJ", sender: "Kardeşim", body: "Sakın yola çıkma, plakanı almışlar! Açık bir benzinlik bulursan içeri sığın!" }
        ]
      };
    } else if (arch === "wanted") {
      wantsCharger = true;
      phoneData = {
        owner: "Şifreli Cihaz",
        locked: true,
        pin: pinCode,
        pinHint: `Kilit Notu: ' Kimlikteki doğum yılım ' (Kimlik isteyerek görebilirsin!)`,
        wallpaperTone: "crimson",
        notifications: [
          { app: "GİZLİ KANAL", sender: "Şebeke", body: `Polis ${wantedFullPlate} plakasını anons geçti! Yakıtı alıp hemen sınırı geç!` }
        ]
      };
    }

    const questions = [
      {
        btn: "Bu saatte yolculuk nereye?",
        mood: arch === "clean" || arch === "clean2" ? "warm" : "nervous",
        reply:
          arch === "victim"
            ? "Lütfen sesini yükseltme, farları görünmeden beni arka odaya al!"
            : arch === "wanted" || arch === "fraud"
            ? "Sana ne birader yolumdan? Siparişi hazırla işine bak!"
            : "Sabah vardiyasına yetişiyorum, bir sıcak mola vereyim dedim."
      },
      {
        btn: "Evraklarda ve paranda bir sıkıntı yok değil mi?",
        mood: arch === "fraud" || arch === "wanted" ? "angry" : "neutral",
        reply:
          fakeBill
            ? "Ne sıkıntısı olacak canım, ışığa tutmana bile gerek yok at kasaya!"
            : fakeId
            ? "Ehliyet biraz eski kalmış olabilir, idare et gece vakti..."
            : "Her şeyim tam kardeşim, kimliğime de parama da bakabilirsin."
      },
      {
        btn: "Yolda şüpheli bir durum gördün mü?",
        mood: "neutral",
        reply: `İleride polis çevirmesi var, ${wantedFullPlate} plakalı bir aracı arıyorlarmış.`
      }
    ];

    let outcomes = {};
    if (arch === "clean" || arch === "clean2") {
      outcomes = {
        serve: { correct: true, badge: "TEMİZ SATIŞ", title: `${fName} memnun ayrıldı!`, desc: "Siparişi eksiksiz teslim ettin, kasaya temiz kazanç girdi." },
        hide: { correct: false, badge: "TUHAF HAREKET", title: "Normal müşteriyi arka odaya sokmaya çalıştın!", desc: "Müşteri korkup kaçtı (-50 ₺).", penalty: 50 },
        lock: { correct: false, badge: "MÜŞTERİ KAÇTI", title: "Dürüst müşteriyi geri çevirdin!", desc: "Satışı kaçırdın (-50 ₺).", penalty: 50 },
        police: { correct: false, badge: "ASILSIZ İHBAR", title: "Masum vatandaşa 112 çağırdın!", desc: "Ceza yazıldı (-100 ₺).", penalty: 100 }
      };
    } else if (arch === "victim") {
      outcomes = {
        hide: { correct: true, badge: "HAYAT KURTARDIN!", title: `${fName} Arka Odada Güvende! (+160 ₺ Ödül)`, desc: "Mağduru içeri sakladın, peşindekiler istasyonu boş sanıp geçti!", bonus: 160, badgeUnlock: "safe_haven" },
        serve: { correct: false, badge: "RİSKLİ KARAR", title: "Yardım isteyen kişiyi karanlık yola geri gönderdin!", desc: "Arka odaya saklasaydın çok daha güvenli olacaktı.", penalty: 40 },
        lock: { correct: false, badge: "VİCDANSIZLIK", title: "Sığınmak isteyen kişiye kapıyı kilitledin!", desc: "Büyük tepki çektin (-90 ₺).", penalty: 90 },
        police: { correct: true, badge: "KORUMA EKİBİ", title: "Polis gelip mağduru korumaya aldı (+90 ₺)", desc: "Güvenli şekilde karakola götürüldü.", bonus: 90 }
      };
    } else if (arch === "fraud") {
      outcomes = {
        serve: { correct: false, badge: "DOLANDIRILDIN!", title: fakeBill ? "Sahte Parayı Yuttun! (-200 ₺)" : "Sahte Kimlikli Şahsa Satış Yaptın!", desc: "Kontrolleri atladığın için zarar ettin!", penalty: 180 },
        hide: { correct: false, badge: "BÜYÜK HATA!", title: "Dolandırıcıyı kendi dükkânına soktun!", desc: "Kasadan para aşırıp kaçtı (-180 ₺)!", penalty: 180 },
        lock: { correct: true, badge: "GEÇİT YOK!", title: "Sahtekârı yakalayıp kepengi indirdin! (+130 ₺)", desc: "Mor ışık ve kimlik kontrolün işe yaradı!", bonus: 130, badgeUnlock: fakeBill ? "fake_hunter" : "id_detective" },
        police: { correct: true, badge: "SUÇÜSTÜ!", title: "Dolandırıcı ekibe teslim edildi! (+170 ₺)", desc: "Dikkatli incelemen sayesinde ödül aldın!", bonus: 170, badgeUnlock: fakeBill ? "fake_hunter" : "id_detective" }
      };
    } else {
      // wanted
      outcomes = {
        police: { correct: true, badge: "ARANAN YAKALANDI!", title: `${wantedFullPlate} Kıskıvrak Alındı! (+280 ₺ Ödül)`, desc: "Radyo ve bültendeki aranan aracı tam isabet yakalattın!", bonus: 280, badgeUnlock: "id_detective" },
        lock: { correct: true, badge: "SAVUNMA", title: "Aranan suçluya kapıyı kilitledin (+70 ₺)", desc: "Kendini korudun ama şahıs kaçtı.", bonus: 70 },
        serve: { correct: false, badge: "SUÇLUYA YARDIM!", title: "Aranan plakaya yakıt verip gönderdin!", desc: "Polis kamera kaydından ihmalini tespit etti (-180 ₺).", penalty: 180 },
        hide: { correct: false, badge: "FELAKET!", title: "Aranan suçluyu arka odaya aldın!", desc: "Kasayı boşaltıp kaçtı (-240 ₺)!", penalty: 240 }
      };
    }

    customers.push({
      id: `rnd_${shiftNo}_${idx}`,
      name: fName,
      role: arch === "clean" || arch === "clean2" ? pick(rolesGood) : pick(rolesSus),
      time: times[idx],
      radioTicker: `🚨 EMNİYET BÜLTENİ: Bu gece ${wantedFullPlate} plakalı araç ve sahte kimlikli şahıslar her yerde aranıyor!`,
      look,
      car: {
        shape: carInfo.shape,
        type: carInfo.type,
        color: carColor,
        plate,
        muddyPlate: arch === "wanted",
        vestClue: false,
        pumpNote: arch === "wanted" ? `🚨 DİKKAT: Plaka arananlar bültenindeki '${wantedFullPlate}' ile AYNI!` : "Araç ve plaka temiz görünüyor."
      },
      idCard,
      depotIntruder,
      depotNote: depotIntruder ? "🚨 DİKKAT! Arka depo kapısında levye ile zorlama var!" : "Arka depo sakin.",
      powerOutage: powerOut,
      requests: { fuelType, fuel: fuelAmt, drink, toast, market },
      cashBill: {
        denom: 200,
        fake: fakeBill,
        serial: fakeBill ? "FK-000999" : `TR-${300000 + Math.floor(Math.random() * 600000)}`,
        uvText: fakeBill ? "⚠️ SAHTE KOPYA! ŞERİT YOK!" : "200 ₺ ORİJİNAL GÜVENLİK ŞERİDİ ✓"
      },
      wantsCharger,
      phoneData,
      reward: 130 + (hasFuel ? 45 : 0),
      greeting,
      questions,
      outcomes
    });
  });

  return {
    nightNumber: shiftNo,
    isEndless: true,
    title: `SONSUZ VARDİYA #${shiftNo}`,
    wantedPoster: {
      title: `ARANAN PLAKA: ${wantedFullPlate}`,
      desc: "Ayrıca sahte 200 ₺ banknotlara ve süresi geçmiş sahte kimliklere dikkat et! Yardım isteyen mağdurları 'İçeri Sakla' ile koru."
    },
    bossSms: `Sonsuz Gece Vardiyası #${shiftNo} başladı! Bu gece aranan plaka: ${wantedFullPlate}. Her müşteri bambaşka, gözünü dört aç!`,
    customers
  };
};

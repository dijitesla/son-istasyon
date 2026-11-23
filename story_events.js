// Son İstasyon v7.0 — Canlı İstasyon Haritasına Gelen Özel Hikaye & Gizem Müşterileri
// Tüm diyaloglar büyük punto (18px) ekranda tek bakışta okunacak netlikte yazılmıştır.

window.STORY_EVENTS = [
  {
    id: "ev_selim",
    name: "Selim Usta",
    role: "Uzun Yol Tır Şoförü",
    carColor: "#dc2626",
    carShape: "truck",
    plate: "52 TR 618",
    look: { style: "trucker", skin: "#e0a97f", outfit: "#9a3412", outfit2: "#431407", capColor: "#dc2626", hairColor: "#3f3f46", mustache: true },
    isThreat: false,
    speech: "Hayırlı olsun yeğenim, istasyonu devralmışsın! Depoyu mazotla fulle. Senden önceki işletmeci Emre kaybolmadan önce buraya çamurlu, sonu 404 plakalı lacivert bir araba dadanmıştı. Gözün açık olsun!",
    clues: {
      idText: "🪪 Ehliyet: Selim Karaca (1974) — Plaka: 52 TR 618 (TEMİZ ✓)",
      trunkText: "🔦 Bagaj/Dorse: Mühürlü fındık çuvalları (TEMİZ ✓)",
      moneyText: "🟣 200 ₺ Banknot: Orijinal güvenlik şeridi var (GERÇEK ✓)",
      phoneText: null
    },
    questions: [
      { q: "404 plakalı araba ne zaman geldi?", a: "Gece 03:00 gibi arka deponun orada gördüm yeğenim, bagajında garip çantalar vardı.", mood: "neutral" },
      { q: "Başka dikkat edeceğim bir şey var mı?", a: "Sahte 200 lira veren çok oluyor, parayı mor ışığa tutmadan kasaya atma!", mood: "warm" }
    ],
    correctChoices: ["serve"],
    reward: 220,
    successMsg: "Selim Usta mazotunu alıp kornayla selam verdi! İlk hikaye ipucunu (404 Plaka) öğrendin!",
    failMsg: "Emektar tırcıyı boşuna geri çevirdin, hem kazanç hem ipucu kaçtı!"
  },

  {
    id: "ev_cengiz",
    name: "Gözlüklü Cengiz",
    role: "Aceleci Gece Sürücüsü",
    carColor: "#27272a",
    carShape: "sport",
    plate: "16 CNZ 88",
    look: { style: "slick", skin: "#dfb18b", outfit: "#065f46", outfit2: "#022c22", hairColor: "#18181b", glasses: true },
    isThreat: true,
    speech: "Kardeşim çabuk 200 liralık benzin bas, çok acelem var! Nakit 200'lüğü uzattım işte, mor ışığa falan tutmana gerek yok, üstü de senin olsun!",
    clues: {
      idText: "🪪 Ehliyet: Cengiz Keskin — Plaka: 16 CNZ 88 (Kayıtlı)",
      trunkText: "🔦 Bagaj: 🚨 SAHTE 200 TL BASKI KALIPLARI BULUNDU!",
      moneyText: "🟣 200 ₺ Banknot: ⚠️ SAHTE FOTOKOPİ PARA! FİLİGRAN YOK!",
      phoneText: null
    },
    questions: [
      { q: "Bu 200 liranın kağıdı neden garip?", a: "Yağmurda nemlenmiştir birader, lafı uzatma bas benzini!", mood: "angry" },
      { q: "Bagajda ne taşıyorsun?", a: "Sana ne benim bagajımdan?! İşine baksana sen!", mood: "nervous" }
    ],
    correctChoices: ["lock", "police"],
    reward: 260,
    successMsg: "Sahte parayı ve bagajdaki kalıpları yakaladın! Kalpazan Cengiz kıskıvrak yakalandı!",
    failMsg: "Sahte 200 TL'yi yuttun! Kasadan zarar ettin (-180 ₺)."
  },

  {
    id: "ev_melis",
    name: "Melis",
    role: "Yardım İsteyen Yolcu",
    carColor: "#e2e8f0",
    carShape: "sedan",
    plate: "34 MLS 27",
    look: { style: "long", skin: "#fad2b4", outfit: "#4f46e5", outfit2: "#1e1b4b", hairColor: "#1e1b2e" },
    isThreat: false,
    speech: "Ne olur yardım edin! Takıntılı eski nişanlım Bora gri spor arabayla peşimden geliyor! Arabamı arka tarafa çekip beni istasyon binasında biraz saklar mısınız?!",
    clues: {
      idText: "🪪 Kimlik: Melis Aydın (2001) — Plaka: 34 MLS 27 (TEMİZ ✓)",
      trunkText: "🔦 Bagaj: Aceleyle toplanmış kıyafet valizi (TEMİZ ✓)",
      moneyText: "🟣 100 ₺ Banknot: Gerçek banknot ✓",
      phoneText: "📱 Telefon Mesajı (Annem): 'Kızım Bora peşinden çıktı, açık bir benzinlik bulursan içeri sığın!'"
    },
    questions: [
      { q: "Peşindeki aracın plakası ne?", a: "Gri spor araba, plakası 34 BR 901! Birazdan buraya gelebilir, ne olur beni sakla!", mood: "nervous" },
      { q: "Yaralı mısın?", a: "Hayır iyiyim, sadece beni görmesin yeter!", mood: "warm" }
    ],
    correctChoices: ["hide", "police"],
    reward: 240,
    successMsg: "Melis'i istasyon ofisinde korumaya aldın! Ailesi teşekkür ödülü gönderdi!",
    failMsg: "Yardıma muhtaç yolcuyu karanlık yola geri gönderdin!"
  },

  {
    id: "ev_bora",
    name: "Bora",
    role: "Öfkeli Takipçi",
    carColor: "#64748b",
    carShape: "sport",
    plate: "34 BR 901",
    look: { style: "short", skin: "#eac09c", outfit: "#1e293b", outfit2: "#e2e8f0", hairColor: "#0f172a", tie: "#ef4444" },
    isThreat: true,
    speech: "Pompadan 400 liralık benzin doldur koçum! Az önce buradan beyaz arabalı Melis geçti mi? Doğruyu söyle, seni paraya boğayım!",
    clues: {
      idText: "🪪 Ehliyet: Bora Soylu — ⚠️ HAKKINDA UZAKLAŞTIRMA KARARI VAR!",
      trunkText: "🔦 Bagaj: 🚨 ŞÜPHELİ HALAT VE KIRIK TELEFON KILIFI!",
      moneyText: "🟣 200 ₺ Banknot: Gerçek para ✓",
      phoneText: null
    },
    questions: [
      { q: "Hakkınızda uzaklaştırma kararı görünüyor?", a: "Sana ne birader özel hayatımızdan?! Benzinimi ver yoksa kötü olur!", mood: "angry" },
      { q: "Bagajdaki halat ne için?", a: "Çekme halatı o, burnunu sokma!", mood: "nervous" }
    ],
    correctChoices: ["lock", "police"],
    reward: 280,
    successMsg: "112 Polis otosu istasyona girip Bora'yı paketledi! Melis tamamen kurtuldu!",
    failMsg: "Tehlikeli takipçiye benzin verip gönderdin (-160 ₺)!"
  },

  {
    id: "ev_404",
    name: "Kapüşonlu Yabancı",
    role: "Aranan 404 Şüphelisi",
    carColor: "#1e3a8a",
    carShape: "sedan",
    plate: "06 KYP 404",
    look: { style: "hood", outfit: "#111827", outfit2: "#030712" },
    isThreat: true,
    speech: "Oyalanmadan depoyu doldur birader. Şu telefonu da 2 dakika şarja tak, sakın ekranına elini sürme bozuşuruz!",
    clues: {
      idText: "🪪 Ehliyet: ⚠️ SÜRESİ 2021'DE BİTMİŞ SAHTE KİMLİK! Plaka uyuşmuyor!",
      trunkText: "🔦 Bagaj: 🚨 KAYIP EMRE'NİN YELEĞİ VE DEMİR LEVYE BULUNDU!",
      moneyText: "🟣 200 ₺ Banknot: Gerçek para ✓",
      phoneText: "📱 Şifreli Mesaj (Kuzgun): 'Emre'yi maden deposuna kapattık. İstasyonun altındaki altın zulasını kontrol et!'"
    },
    questions: [
      { q: "Plakanız neden çamurla kapatılmış?", a: "Dağ yolundan geldik dedik ya! Plaka memuru musun sen?!", mood: "angry" },
      { q: "Bagajdaki kırmızı yelek bizim Emre'nin mi?", a: "Ne Emre'si be?! Çabuk bitir işini!", mood: "nervous" }
    ],
    correctChoices: ["police"],
    reward: 380,
    successMsg: "BÜYÜK OPERASYON! Polis aracı sirenlerle istasyona daldı ve 404 plakalı şüpheliyi tutukladı!",
    failMsg: "Aranan baş şüpheli gözünün önünde istasyondan kaçtı (-220 ₺)!"
  },

  {
    id: "ev_nermin",
    name: "Nermin Hemşire",
    role: "Acil Servis Hemşiresi",
    carColor: "#f8fafc",
    carShape: "ambulance",
    plate: "52 SH 112",
    look: { style: "hijab", skin: "#f3c6a5", outfit: "#0284c7", outfit2: "#e0f2fe", capColor: "#0369a1", glasses: true },
    isThreat: false,
    speech: "İyi nöbetler evladım! Ambulansa yakıt alacağım. Sana müjdem var: Akşam hastaneye eli sargılı bir genç geldi, tanıdım; kayıp Emre HAYATTA!",
    clues: {
      idText: "🪪 Görev Kartı: Nermin Özkan — Devlet Hastanesi (TEMİZ ✓)",
      trunkText: "🔦 Arka Kabin: Tıbbi ilk yardım çantaları ve kurtarılmış yavru kedi 🐱 (TEMİZ ✓)",
      moneyText: "🟣 200 ₺ Banknot: Gerçek para ✓",
      phoneText: null
    },
    questions: [
      { q: "Emre nereye gitti abla?", a: "'Çetenin sahte polisleri peşimde, yakında istasyona sığınacağım' dedi evladım!", mood: "warm" },
      { q: "Durumu iyi miydi?", a: "Pansumanını yaptım, merak etme durumu iyi!", mood: "warm" }
    ],
    correctChoices: ["serve"],
    reward: 250,
    successMsg: "Nermin Abla'yı uğurladın ve Emre'nin hayatta olduğunu öğrendin!",
    failMsg: "Nöbetçi sağlık aracını geri çevirdin (-120 ₺)!"
  },

  {
    id: "ev_tarik",
    name: "Sahte Müfettiş Tarık",
    role: "Şüpheli Denetçi",
    carColor: "#111827",
    carShape: "sedan",
    plate: "06 KRL 99",
    look: { style: "bald", skin: "#d9a077", outfit: "#1f2937", outfit2: "#374151", hairColor: "#111827", mustache: true, scar: true },
    isThreat: true,
    speech: "Teftişten geliyorum genç! Arabama bedava benzin koy, bir de eski çalışan Emre'nin dolabındaki evrakları hemen bana teslim et!",
    clues: {
      idText: "🪪 Kimlik: ⚠️ SAHTE MÜFETTİŞ KARTI! Geçerlilik: 2019 (GEÇERSİZ!)",
      trunkText: "🔦 Bagaj: 🚨 ÇALINTI PLAKALAR VE KUZGUN ÇETESİ DOSYALARI!",
      moneyText: "🟣 100 ₺ Banknot: ⚠️ SAHTE PARA! Mürekkebi dağılmış!",
      phoneText: null
    },
    questions: [
      { q: "Gece yarısı teftiş mi olur, kimliğiniz de geçmiş?", a: "Bana bak devlet memurunu sorgulama, yakarım istasyonunu!", mood: "angry" },
      { q: "Arabanız neden kiralık plakalı?", a: "Gizli görev aracı o, uzatma!", mood: "nervous" }
    ],
    correctChoices: ["lock", "police"],
    reward: 320,
    successMsg: "Sahte müfettişin maskesini düşürdün! Gerçek polis gelip kelepçeyi taktı!",
    failMsg: "Sahte müfettişe kandın, hem yakıt hem delil kaptırdın (-200 ₺)!"
  },

  {
    id: "ev_gelin",
    name: "Seda (Kaçan Gelin)",
    role: "Düğünden Kaçan Genç Kız",
    carColor: "#f8fafc",
    carShape: "sedan",
    plate: "52 GLN 01",
    look: { style: "veil", skin: "#fad2b4", outfit: "#f8fafc", outfit2: "#e2e8f0", hairColor: "#451a03" },
    isThreat: false,
    speech: "Lütfen şaşırmayın! Zorla evlendirildiğim tefeci ailenin düğününden kaçtım! Ablam gelip beni alana kadar istasyonunuzda saklanabilir miyim?!",
    clues: {
      idText: "🪪 Kimlik: Seda Demir (2000) — Plaka: 52 GLN 01 (TEMİZ ✓)",
      trunkText: "🔦 Bagaj: Gelin çiçeği ve küçük kedi sepeti 🐱 (TEMİZ ✓)",
      moneyText: "🟣 200 ₺ Banknot: Gerçek para ✓",
      phoneText: "📱 WhatsApp (Ablam): 'Seda sakın korkma, Son İstasyon'a sığın, 15 dakikaya seni alacağız!'"
    },
    questions: [
      { q: "Peşinde konvoy var mı?", a: "Evet, damat Kuzgun çetesinin adamıymış! Ne olur beni 'İstasyonda Sakla'!", mood: "nervous" },
      { q: "Ablan yolda mı?", a: "Mesaj attı, neredeyse buradalar!", mood: "warm" }
    ],
    correctChoices: ["hide", "police"],
    reward: 300,
    successMsg: "Gelin Seda'yı istasyonda saklayıp kurtardın! Ablası gelip teşekkür ikramiyesi bıraktı!",
    failMsg: "Yardım isteyen Seda'yı kapıda bıraktın (-150 ₺)!"
  },

  {
    id: "ev_emre",
    name: "Yaralı Emre",
    role: "Kayıp Eski İşletmeci!",
    carColor: "#dc2626",
    carShape: "van",
    plate: "52 EMR 04",
    look: { style: "curly", skin: "#f3c6a5", outfit: "#dc2626", outfit2: "#1e293b", hairColor: "#292524", bandage: true },
    isThreat: false,
    speech: "Kardeşim kapıyı aç, BEN EMRE! Maden deposundan bir kamyonet bulup kaçtım! Peşimde elebaşı Kuzgun var, beni hemen İSTASYONDA SAKLA, Kuzgun gelince 112'yi ara!",
    clues: {
      idText: "🪪 Personel Kartı: Emre Kaya — Son İstasyon Eski Sorumlusu (GERÇEK ✓)",
      trunkText: "🔦 Kasa: Maden deposundan kurtardığı kanıt defteri (GERÇEK ✓)",
      moneyText: "🟣 100 ₺ Banknot: Gerçek para ✓",
      phoneText: "📱 Ses Kaydı Notu: 'Kuzgun 06 KZG 001 siyah zırhlı ciple arkamdan geliyor!'"
    },
    questions: [
      { q: "Seni neden kaçırmışlardı Emre?", a: "Pompa adasının altındaki eski tanka kaçak altın saklamışlar, görünce beni kaçırdılar!", mood: "nervous" },
      { q: "Hemen arka odaya geç!", a: "Sağ ol kardeşim! Siyah zırhlı cip geldiği an polise bas!", mood: "warm" }
    ],
    correctChoices: ["hide"],
    reward: 350,
    successMsg: "Emre'yi güvenle istasyon ofisine sakladın! Şimdi büyük finalde Kuzgun'u yakalatma zamanı!",
    failMsg: "Emre'yi saklamadığın için tehlikeye düştü (-180 ₺)!"
  },

  {
    id: "ev_kuzgun",
    name: "Elebaşı 'Kuzgun'",
    role: "Organize Suç Lideri",
    carColor: "#090d1a",
    carShape: "suv",
    plate: "06 KZG 001",
    look: { style: "slick", skin: "#d6a27c", outfit: "#090d1a", outfit2: "#7f1d1d", hairColor: "#e2e8f0", scar: true, tie: "#dc2626" },
    isThreat: true,
    speech: "Demek istasyonun yeni sahibi sensin... Siyah cipimin deposunu fulle. Buraya Emre adında yaralı bir çocuk sığındı mı? Uslu durursan seni ihya ederim!",
    clues: {
      idText: "🪪 Pasaport: ⚠️ SAHTE DİPLOMATİK KİMLİK! Kırmızı Bültenle Aranıyor!",
      trunkText: "🔦 Bagaj: 🚨 ALTIN ZULASI İÇİN ÇELİK ÇANTALAR VE SİLAH KUTUSU!",
      moneyText: "🟣 200 ₺ Banknot: ⚠️ SAHTE RÜŞVET PARASI!",
      phoneText: "📱 Mesaj (Liman Kaptanı): '06:00 gemisi hazır Kuzgun, altınları al, istasyon sahibini de sustur!'"
    },
    questions: [
      { q: "Her yer polis kaynıyor Kuzgun, yolun sonu geldi!", a: "Bana kimse dokunamaz çocuk! Çabuk doldur yakıtı!", mood: "angry" },
      { q: "Verdiğin rüşvet parası bile sahte!", a: "Fazla konuşma, işini yap!", mood: "angry" }
    ],
    correctChoices: ["police"],
    reward: 650,
    successMsg: "EFSANE BASKIN! Özel harekat araçları istasyonu sardı, Kuzgun ve çetesi kıskıvrak yakalandı! İstasyon tamamen senin!",
    failMsg: "Kuzgun zırhlı cipiyle elini kolunu sallayarak kaçtı (-300 ₺)!"
  }
];


// ============================================================================
// v7.0 EKONOMİ DENGESİ & SINIRSIZ ÖZEL MÜŞTERİ ÜRETİCİSİ
// (İşçi alınsa da, 10 ana hikaye bitse de Özel Müşteriler ASLA bitmez!)
// ============================================================================
(function setupEndlessSpecialEvents() {
  // Ana hikaye ödüllerini yeni zorlu ekonomiye göre dengele
  const balancedRewards = [75, 95, 90, 110, 150, 100, 130, 125, 160, 280];
  window.STORY_EVENTS.forEach((ev, i) => {
    ev.reward = balancedRewards[i] || 110;
    ev.failMsg = ev.failMsg.replace(/\s*\(-\d+\s*₺\)/g, "");
  });

  const namesM = ["Kadir", "Sinan", "Orhan", "Tufan", "Zafer", "Yavuz", "Cihan", "Levent", "Furkan", "Soner", "Hakan", "Metin"];
  const namesF = ["Zeynep", "Derya", "Selin", "Gökçe", "Aylin", "Burcu", "Damla", "Ceren", "Pınar", "Merve"];
  const surnames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Arslan", "Doğan", "Keskin", "Polat", "Karaca"];
  const cities = ["06", "16", "34", "35", "41", "52", "55", "61"];
  const colors = ["#dc2626", "#2563eb", "#7c3aed", "#ea580c", "#0f766e", "#be123c", "#334155", "#ca8a04"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  window.getNextSpecialEvent = function (storyIndex) {
    if (storyIndex < window.STORY_EVENTS.length) {
      return window.STORY_EVENTS[storyIndex];
    }

    // 10 Ana Hikaye bittikten sonra sınırsız rastgele özel olay üret!
    const types = ["vip_honest", "counterfeiter", "refugee", "smuggler"];
    const t = types[storyIndex % types.length];
    const isFem = t === "refugee" ? Math.random() < 0.7 : Math.random() < 0.4;
    const fName = isFem ? pick(namesF) : pick(namesM);
    const fullName = `${fName} ${pick(surnames)}`;
    const plate = `${pick(cities)} ${pick(["KYP", "GCE", "SRN", "DRK", "VRD"])} ${10 + Math.floor(Math.random() * 89)}`;
    const look = {
      style: isFem ? pick(["long", "bun", "curly", "hijab"]) : pick(["short", "trucker", "cap", "beanie", "slick", "hood"]),
      skin: pick(["#fad2b4", "#f3c6a5", "#eab68c", "#dfb18b"]),
      outfit: pick(colors),
      outfit2: "#0f172a",
      capColor: pick(colors),
      hairColor: "#1e1b2e",
      glasses: Math.random() < 0.3,
      mustache: !isFem && Math.random() < 0.35
    };

    if (t === "vip_honest") {
      return {
        id: `dyn_${storyIndex}`,
        name: `${fName} (VIP Yolcu)`,
        role: "Uzun Yol İş İnsanı",
        carColor: pick(colors),
        carShape: "suv",
        plate,
        look,
        isThreat: false,
        speech: "İyi geceler! İstasyonunuzun namını duydum, depoyu fulleyebilir miyiz? Evraklarım ve ödemem hazır, üstü de bahşişiniz olsun!",
        clues: {
          idText: `🪪 Ehliyet: ${fullName} — Plaka: ${plate} (TEMİZ ✓)`,
          trunkText: "🔦 Bagaj: Evrak çantası ve takım elbise kılıfı (TEMİZ ✓)",
          moneyText: "🟣 200 ₺ Banknot: Orijinal güvenlik şeridi var (GERÇEK ✓)",
          phoneText: null
        },
        questions: [
          { q: "Yolculuk ne tarafa?", a: "Sabah toplantısına yetişiyorum, hizmetiniz çok kaliteli!", mood: "warm" },
          { q: "Evraklarınızı kontrol edebilir miyim?", a: "Tabii ki buyurun, her şeyim nizami.", mood: "neutral" }
        ],
        correctChoices: ["serve"],
        reward: 115,
        successMsg: `${fName} memnun kaldı ve cömert bir VIP bahşişi bıraktı!`,
        failMsg: "Dürüst VIP müşteriyi boş yere kaçırdın!"
      };
    }

    if (t === "counterfeiter") {
      return {
        id: `dyn_${storyIndex}`,
        name: `Şüpheli ${fName}`,
        role: "Gece Kalpazanı",
        carColor: "#18181b",
        carShape: "sedan",
        plate,
        look,
        isThreat: true,
        speech: "Çabuk depoyu doldur birader, hiç vaktim yok! Parayı peşin verdim işte, ışığa falan tutmadan at kasaya!",
        clues: {
          idText: `🪪 Ehliyet: ${fullName} — Geçerlilik: 2020 (SÜRESİ GEÇMİŞ!)`,
          trunkText: "🔦 Bagaj: 🚨 KESİLMEMİŞ SAHTE BANKNOT KAĞITLARI BULUNDU!",
          moneyText: "🟣 200 ₺ Banknot: ⚠️ SAHTE KOPYA! Güvenlik şeridi yok!",
          phoneText: null
        },
        questions: [
          { q: "Bu 200 lira neden fotokopi gibi duruyor?", a: "Ne fotokopisi kardeşim?! İftira atma müşteriye!", mood: "angry" },
          { q: "Neden bu kadar panik halindesin?", a: "Sana ne birader, işini yap!", mood: "nervous" }
        ],
        correctChoices: ["lock", "police"],
        reward: 135,
        successMsg: "Sahte parayı yakaladın! Kalpazan kıskıvrak ele geçirildi!",
        failMsg: "Sahte 200 TL'yi yuttun, kasadan zarar ettin!"
      };
    }

    if (t === "refugee") {
      return {
        id: `dyn_${storyIndex}`,
        name: fName,
        role: "Tehlikedeki Yolcu",
        carColor: "#e2e8f0",
        carShape: "sedan",
        plate,
        look,
        isThreat: false,
        speech: "Ne olur yardım edin! Yolda tehlikeli bir grup aracımı sıkıştırdı, izimi kaybettirmek için beni biraz istasyonunuzda saklar mısınız?!",
        clues: {
          idText: `🪪 Kimlik: ${fullName} — Plaka: ${plate} (TEMİZ ✓)`,
          trunkText: "🔦 Bagaj: Kişisel valiz ve ilk yardım çantası (TEMİZ ✓)",
          moneyText: "🟣 100 ₺ Banknot: Gerçek para ✓",
          phoneText: "📱 Mesaj (112 Acil): 'En yakın aydınlık istasyona sığının, devriyemiz yolda!'"
        },
        questions: [
          { q: "Peşindekiler silahlı mıydı?", a: "Bilmiyorum ama çok korktum, ne olur beni 'İstasyonda Sakla'!", mood: "nervous" },
          { q: "Ailene haber verdin mi?", a: "Evet, birazdan gelip beni alacaklar!", mood: "warm" }
        ],
        correctChoices: ["hide", "police"],
        reward: 130,
        successMsg: `${fName}'i güvenle istasyonda korudun! Teşekkür ödülü kazandın!`,
        failMsg: "Yardım isteyen yolcuyu tehlikenin ortasına geri gönderdin!"
      };
    }

    // smuggler
    return {
      id: `dyn_${storyIndex}`,
      name: `Kaçakçı ${fName}`,
      role: "Aranan Gece Kuryesi",
      carColor: "#1e3a8a",
      carShape: "van",
      plate,
      look,
      isThreat: true,
      speech: "Mazotu fulle koçum, kimseye de buradan geçtiğimi söyleme. Bagajdan gelen seslere de kulağını tıka!",
      clues: {
        idText: `🪪 Ehliyet: ⚠️ SAHTE KİMLİK! Araç plakası (${plate}) çalıntı listesinde!`,
        trunkText: "🔦 Bagaj: 🚨 ÇALINTI OTO PARÇALARI VE LEVYE BULUNDU!",
        moneyText: "🟣 200 ₺ Banknot: Gerçek para ✓",
        phoneText: "📱 Gizli Mesaj: 'Polis çevirmesine yakalanmadan sınırı geç!'"
      },
      questions: [
        { q: "Plakanız çalıntı araç listesinde görünüyor?", a: "Yanlış görmüşsün sen, başını belaya sokma!", mood: "angry" },
        { q: "Bagajda ne var?", a: "Seni ilgilendirmez, çabuk doldur!", mood: "angry" }
      ],
      correctChoices: ["police"],
      reward: 165,
      successMsg: "112 Polis aracı sirenlerle gelip kaçakçıyı suçüstü yakaladı!",
      failMsg: "Çalıntı araçlı kaçakçıyı elini kolunu sallayarak gönderdin!"
    };
  };
})();

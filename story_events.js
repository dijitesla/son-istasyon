// Son İstasyon v6.0 — Canlı İstasyon Haritasına Gelen Özel Hikaye & Gizem Müşterileri
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

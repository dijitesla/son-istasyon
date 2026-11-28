// Son İstasyon v15.0 — 4'ten 10'a Kadar Satın Alınabilir Yeni Araziler (Toplam 10 Arazi Sistemi!)
// Her yeni arazide 6 Dev Proje Seçeneği (5 Yıldızlı Grand Otel, Özel Hastane, Otomobil Fabrikası, Stadyum, Teknokent, Kongre Sarayı)
// Önce Patron Manuel İlgilenir (Kayıt Açma & Oda/Birim Hazırlama), Geliştirdikçe Eleman ve Genel Müdür İşe Alınır!

window.ExtraLandsSystem = (function () {
  const baseImg = new Image();
  let baseReady = false;
  baseImg.onload = () => (baseReady = true);
  baseImg.src = "./assets/extra-ground.jpg";

  // 4 RESMİ ŞEHİR BÖLGESİ (Bölge Tamamlandığında +%18 Kalıcı Bölge Hakimiyet Bonusu!)
  const CITY_DISTRICTS = [
    {
      key: "dist_core",
      title: "⛽ 1. Bölge — Otoyol & Ticaret Merkezi",
      subtitle: "Başlangıç aksı: Ana İstasyon, Otopark & Grand AVM ve Tatil Köyü",
      color: "#f59e0b",
      landIds: ["station", "land2", "land3"]
    },
    {
      key: "dist_north",
      title: "🏙️ 2. Bölge — Kuzey Finans & Lojistik Bulvarı",
      subtitle: "Kuzey bulvar kavşakları ve rakip holdinglerin doğu-batı kapıları",
      color: "#38bdf8",
      landIds: ["land12", "land4", "land5", "land11"]
    },
    {
      key: "dist_south",
      title: "🏭 3. Bölge — Güney Sanayi, Spor & Teknoloji Kuşağı",
      subtitle: "Üretim fabrikaları, stadyum, teknokent ve orta bulvar rakipleri",
      color: "#a855f7",
      landIds: ["land6", "land7", "land8", "land9", "land10"]
    },
    {
      key: "dist_horizon",
      title: "🌊 4. Bölge — Boğaz Zirvesi & Prestij Kordonu",
      subtitle: "Büyük rakiplerin elindeki en değerli sahil kanatları ve kuzey zirve parselleri",
      color: "#22c55e",
      landIds: ["land13", "land14", "land15", "land16"]
    }
  ];

  // 4. ARAZİDEN 16. ARAZİYE KADAR 13 YATIRIM & RAKİP DEVRALMA ARSASI (Toplam 16 Arazi!)
  const EXTRA_LANDS = [
    { id: "land4", num: 4, district: "dist_north", name: "4. Arazi — Kuzey Kavşağı", deedCost: 45000, mult: 1.0, desc: "Otoyol ana kavşağında otel ve dev tesisler için altın değerinde arsa." },
    { id: "land5", num: 5, district: "dist_north", name: "5. Arazi — Vadi Yamacı", deedCost: 85000, mult: 1.22, desc: "Panoramik manzaralı yüksek gelir çarpanlı (+%22) yatırım arsası." },
    { id: "land6", num: 6, district: "dist_south", name: "6. Arazi — Sahil Bulvarı", deedCost: 150000, mult: 1.48, desc: "Deniz manzaralı turizm ve ticaret kuşağı (+%48 gelir bonusu)." },
    { id: "land7", num: 7, district: "dist_south", name: "7. Arazi — Sanayi Çıkışı", deedCost: 260000, mult: 1.78, desc: "Yoğun iş ve filo trafiğinin kalbinde dev parsel (+%78 gelir bonusu)." },
    {
      id: "land8", num: 8, district: "dist_south", name: "8. Arazi — Orta Bulvar Meydanı", deedCost: 420000, mult: 2.15,
      rivalBoss: "Hakkı Bey", rivalHold: "Anadolu Petrol", rivalShort: "HAKKI BEY", rivalColor: "#dc2626", rivalBuildTitle: "ANADOLU TESİS",
      desc: "Rakip Hakkı Bey'in elindeki işlek meydan arsası! Satın alıp kendi dev yapını kur (x2.15 gelir)."
    },
    {
      id: "land9", num: 9, district: "dist_south", name: "9. Arazi — Havalimanı Yolu", deedCost: 680000, mult: 2.6,
      rivalBoss: "Selçuk Bey", rivalHold: "Kuzey Grup", rivalShort: "SELÇUK BEY", rivalColor: "#0284c7", rivalBuildTitle: "KUZEY LOJİSTİK",
      desc: "Rakip Selçuk Bey'in elindeki havalimanı kavşağı! Devralıp kendi kuleni dik (x2.6 gelir)."
    },
    { id: "land10", num: 10, district: "dist_south", name: "10. Arazi — Altın Körfez VIP", deedCost: 1100000, mult: 3.2, desc: "Güney bulvarının en yüksek çarpanlı VIP köşe parseli (x3.2 gelir)!" },
    {
      id: "land11", num: 11, district: "dist_north", name: "11. Arazi — Doğu Finans Kapısı", deedCost: 190000, mult: 1.65,
      rivalBoss: "Hakkı Bey", rivalHold: "Anadolu Petrol", rivalShort: "HAKKI BEY", rivalColor: "#dc2626", rivalBuildTitle: "ANADOLU PLAZA",
      desc: "Kuzey bulvarının doğu girişinde Hakkı Bey'in işlettiği ticari tesis — satın alıp devral (+%65 bonus)!"
    },
    {
      id: "land12", num: 12, district: "dist_north", name: "12. Arazi — Batı Lojistik Kavşağı", deedCost: 320000, mult: 1.95,
      rivalBoss: "Selçuk Bey", rivalHold: "Kuzey Grup", rivalShort: "SELÇUK BEY", rivalColor: "#0284c7", rivalBuildTitle: "KUZEY MERKEZ",
      desc: "Batı otoyol girişinde Selçuk Bey'in üssü — rakibinden satın alıp bölgeyi ele geçir (+%95 bonus)!"
    },
    {
      id: "land13", num: 13, district: "dist_horizon", name: "13. Arazi — Batı Sahil Kordonu", deedCost: 520000, mult: 2.35,
      rivalBoss: "Aysel Hanım", rivalHold: "Yıldız Holding", rivalShort: "AYSEL HANIM", rivalColor: "#db2777", rivalBuildTitle: "YILDIZ AVM",
      desc: "Aysel Hanım'ın batı yakasındaki gözde AVM parseli — satın alıp kendi projeni kur (x2.35 gelir)!"
    },
    {
      id: "land14", num: 14, district: "dist_horizon", name: "14. Arazi — Doğu Marina Yolu", deedCost: 790000, mult: 2.8,
      rivalBoss: "Turgut Bey", rivalHold: "Altın Vadi", rivalShort: "TURGUT BEY", rivalColor: "#d97706", rivalBuildTitle: "ALTIN VADİ OTEL",
      desc: "Turgut Bey'in doğu sahil turizm arsası — devralıp deniz hattına hükmet (x2.8 gelir)!"
    },
    {
      id: "land15", num: 15, district: "dist_horizon", name: "15. Arazi — Kuzeybatı Zirve Tepesi", deedCost: 1250000, mult: 3.4,
      rivalBoss: "Turgut Bey", rivalHold: "Altın Vadi", rivalShort: "TURGUT BEY", rivalColor: "#d97706", rivalBuildTitle: "ALTIN REZİDANS",
      desc: "Malikane tepesinin batı yamacında Turgut Bey'in lüks zirve parseli (x3.4 gelir)!"
    },
    {
      id: "land16", num: 16, district: "dist_horizon", name: "16. Arazi — Kuzeydoğu İmparatorluk Zirvesi", deedCost: 1850000, mult: 4.0,
      rivalBoss: "Cemil Soylu", rivalHold: "Marmara Dev", rivalShort: "CEMİL SOYLU", rivalColor: "#7c3aed", rivalBuildTitle: "MARMARA KULE",
      desc: "Şehrin en büyük rakibi Cemil Soylu'nun kalesi! Burayı da alırsan şehir tamamen senin olur (x4.0 gelir)!"
    }
  ];

  // HER ARAZİYE KURULABİLECEK 14 FARKLI DEV YAPI SEÇENEĞİ (3 KATEGORİDE ZENGİN ÇEŞİTLİLİK!)
  const PROJECT_TYPES = [
    {
      key: "agrifarm",
      cat: "industry",
      name: "Organik Çiftlik & Sera Kompleksi",
      short: "ÇİFTLİK",
      emoji: "🌾",
      buildCost: 52000,
      basePay: 345,
      color: "#7f1d1d",
      roofCol: "#450a0a",
      accent: "#84cc16",
      checkinLabel: "🌱 ÜRETİM & HASAT BAŞLAT",
      prepLabel: "🚜 SERA & PAKETLEME HAZIRLA",
      unitName: "Sera",
      floorLabel: "Yeni Cam Sera & Silo Ekle (+6 Sera)",
      vipLabel: "🍯 Gurme Şarküteri & Süt Tesisi",
      heliLabel: "🌬️ Modern Rüzgar Değirmeni & Sulama",
      staffNames: {
        clerk: "📋 Ziraat Sorumlusu (Oto Üretim)",
        cleaner: "🚜 Çiftlik & Paketleme Ekibi (Oto Bakım)",
        specialist: "👩‍🔬 Gıda Mühendisi (+%35 Gelir)",
        manager: "👔 Çiftlik Genel Müdürü (Tam Otopilot)"
      },
      desc: "Modern cam seralar, tahıl silosu ve kırmızı ambar! Liman gıda ihracatına +%50 bonus verir."
    },
    {
      key: "stadium",
      cat: "tourism",
      name: "Spor Kompleksi & Stadyum",
      short: "STADYUM",
      emoji: "🏟️",
      buildCost: 58000,
      basePay: 375,
      color: "#064e3b",
      roofCol: "#022c22",
      accent: "#4ade80",
      checkinLabel: "🎟️ BİLET & SAHA AÇ",
      prepLabel: "🌱 ÇİM & TRİBÜN HAZIRLA",
      unitName: "Saha/Loca",
      floorLabel: "Yeni Tribün & Loca Katı (+6 Loca)",
      vipLabel: "🌟 Şampiyonlar VIP Locası",
      heliLabel: "📺 Dev Canlı Yayın Ekranları",
      staffNames: {
        clerk: "🎟️ Gişe Görevlisi (Oto Bilet)",
        cleaner: "🌱 Saha Bakım Ekibi (Oto Bakım)",
        specialist: "🏆 Spor Koordinatörü (+%35 Gelir)",
        manager: "👔 Stadyum Müdürü (Tam Otopilot)"
      },
      desc: "Işıklı çim saha ve dev tribünler! Futbol Kulübünün maç gelirlerini +%45 artırır."
    },
    {
      key: "aquapark",
      cat: "tourism",
      name: "Dev Aquapark & Su Dünyası",
      short: "AQUAPARK",
      emoji: "🎢",
      buildCost: 64000,
      basePay: 405,
      color: "#0369a1",
      roofCol: "#0c4a6e",
      accent: "#22d3ee",
      checkinLabel: "🎟️ ZİYARETÇİ BİLETİ KES",
      prepLabel: "🌊 HAVUZ & KAYDIRAK TEMİZLE",
      unitName: "Kaydırak/Havuz",
      floorLabel: "Kaydırak Kulesini Yükselt (+6 Hat)",
      vipLabel: "🏖️ Yapay Dalga Havuzu & Jakuzi Adası",
      heliLabel: "🍹 Tropikal Plaj Kulübü",
      staffNames: {
        clerk: "🎟️ Gişe Memuru (Oto Giriş)",
        cleaner: "🛟 Cankurtaran & Havuz Ekibi (Oto Bakım)",
        specialist: "🎉 Animasyon Ekibi (+%35 Gelir)",
        manager: "👔 Aquapark Müdürü (Tam Otopilot)"
      },
      desc: "Kıvrımlı dev su kaydırakları ve dalga havuzu! Ailelerin ve turistlerin akın ettiği eğlence merkezi."
    },
    {
      key: "hotel",
      cat: "tourism",
      name: "5 Yıldızlı Grand Otel",
      short: "OTEL",
      emoji: "🏨",
      buildCost: 65000,
      basePay: 420,
      color: "#7c2d12",
      roofCol: "#0f172a",
      accent: "#facc15",
      checkinLabel: "🛎️ ODA KAYDI AÇ",
      prepLabel: "🧹 ODAYI TEMİZLE",
      unitName: "Oda",
      floorLabel: "Yeni Otel Katı Çık (+6 Oda)",
      vipLabel: "👑 Kral Dairesi & Çatı Havuzu",
      heliLabel: "🚁 VIP Helikopter Pisti",
      staffNames: {
        clerk: "🛎️ Resepsiyonist (Otomatik Kayıt)",
        cleaner: "🧹 Kat Hizmetleri Ekibi (Oto Temizlik)",
        specialist: "👨‍🍳 Oda Servisi & Şef (+%35 Gelir)",
        manager: "👔 Otel Genel Müdürü (Tam Otopilot)"
      },
      desc: "Lüks odalar, kral dairesi ve çatı havuzu! Önce resepsiyon ve temizlikle sen ilgilenirsin, sonra tam kadro kurarsın."
    },
    {
      key: "filmstudio",
      cat: "tourism",
      name: "Film & Dizi Stüdyosu Platosu",
      short: "STÜDYO",
      emoji: "🎬",
      buildCost: 74000,
      basePay: 465,
      color: "#27272a",
      roofCol: "#18181b",
      accent: "#f43f5e",
      checkinLabel: "🎥 ÇEKİM SETİNİ BAŞLAT",
      prepLabel: "🎭 SAHNE & DEKOR HAZIRLA",
      unitName: "Plato",
      floorLabel: "Yeni Çekim Hangarı Ekle (+6 Plato)",
      vipLabel: "🌟 Kırmızı Halı Gala & IMAX Salonu",
      heliLabel: "🚁 Hava Çekim & Ünlü Helikopter Pisti",
      staffNames: {
        clerk: "🎬 Yapım Asistanı (Oto Set Kaydı)",
        cleaner: "🎭 Dekor & Işık Ekibi (Oto Hazırlık)",
        specialist: "🎥 Ünlü Yönetmen (+%35 Gelir)",
        manager: "👔 Medya Yapım Patronu (Tam Otopilot)"
      },
      desc: "Dev ses geçirmez çekim hangarları ve yeşil perde sahnesi! Yüksek prodüksiyon ve kira geliri sağlar."
    },
    {
      key: "hospital",
      cat: "prestige",
      name: "Özel Otoyol Hastanesi",
      short: "HASTANE",
      emoji: "🏥",
      buildCost: 78000,
      basePay: 490,
      color: "#0c4a6e",
      roofCol: "#082f49",
      accent: "#38bdf8",
      checkinLabel: "🩺 HASTA KAYDI AÇ",
      prepLabel: "🧼 KLİNİK STERİLİZE ET",
      unitName: "Klinik",
      floorLabel: "Yeni Poliklinik Katı Ekle (+6 Oda)",
      vipLabel: "🔬 MR & VIP Check-Up Ünitesi",
      heliLabel: "🚁 Hava Ambulans Pisti",
      staffNames: {
        clerk: "📋 Hasta Kabul Görevlisi (Oto Kayıt)",
        cleaner: "🧼 Sterilizasyon Ekibi (Oto Hazırlık)",
        specialist: "👨‍⚕️ Uzman Doktor Kadrosu (+%35 Gelir)",
        manager: "👔 Başhekim & İdari Müdür (Tam Otopilot)"
      },
      desc: "7/24 acil ve VIP check-up merkezi! Şehirdeki sağlık acillerine +%50 ekstra ödül kazandırır."
    },
    {
      key: "university",
      cat: "prestige",
      name: "Özel Üniversite & Kampüs",
      short: "ÜNİVERSİTE",
      emoji: "🎓",
      buildCost: 82000,
      basePay: 515,
      color: "#7c2d12",
      roofCol: "#1e293b",
      accent: "#fbbf24",
      checkinLabel: "📚 ÖĞRENCİ & DÖNEM KAYDI",
      prepLabel: "🏛️ AMFİ & LAB HAZIRLA",
      unitName: "Amfi/Fakülte",
      floorLabel: "Yeni Fakülte Binası & Kat (+6 Amfi)",
      vipLabel: "🔬 Ar-Ge Laboratuvarı & Kubbeli Kütüphane",
      heliLabel: "🏅 Uluslararası Kampüs Akreditasyonu",
      staffNames: {
        clerk: "📋 Öğrenci İşleri Memuru (Oto Kayıt)",
        cleaner: "🧹 Kampüs İdare Ekibi (Oto Hazırlık)",
        specialist: "👨‍🏫 Profesör Kadrosu (+%35 Gelir)",
        manager: "👔 Üniversite Rektörü (Tam Otopilot)"
      },
      desc: "Saat kuleli görkemli kampüs ve kütüphane kubbesi! Şehre yüksek prestij ve eğitim geliri katar."
    },
    {
      key: "convention",
      cat: "prestige",
      name: "Grand Düğün & Kongre Sarayı",
      short: "KONGRE",
      emoji: "👑",
      buildCost: 88000,
      basePay: 540,
      color: "#4c1d95",
      roofCol: "#2e1065",
      accent: "#f472b6",
      checkinLabel: "🥂 DAVETLİLERİ KARŞILA",
      prepLabel: "✨ SALONU SÜSLE & TOPLA",
      unitName: "Salon",
      floorLabel: "Yeni Balo & Kongre Katı (+6 Salon)",
      vipLabel: "💎 Kraliyet Kristal Balo Salonu",
      heliLabel: "🚁 VIP Konuk Helikopter Pisti",
      staffNames: {
        clerk: "🤵 Karşılama Hostesi (Oto Kayıt)",
        cleaner: "✨ Organizasyon Ekibi (Oto Hazırlık)",
        specialist: "🎂 Ziyafet Başşefi (+%35 Gelir)",
        manager: "👔 Saray Genel Müdürü (Tam Otopilot)"
      },
      desc: "Altın kubbeli düğün ve kongre sarayı! Lüks lansman ve organizasyonlardan yüksek gelir üretir."
    },
    {
      key: "powerplant",
      cat: "industry",
      name: "Rüzgar & Güneş Enerji Santrali",
      short: "SANTRAL",
      emoji: "⚡",
      buildCost: 92000,
      basePay: 565,
      color: "#0f172a",
      roofCol: "#0284c7",
      accent: "#38bdf8",
      checkinLabel: "⚡ ŞEBEKEYE ENERJİ AKTAR",
      prepLabel: "🔧 TÜRBİN & PANEL BAKIMI",
      unitName: "Türbin/Ünite",
      floorLabel: "Yeni Rüzgar Türbini & Panel Ekle (+6 Ünite)",
      vipLabel: "🔋 Dev Lityum Enerji Depolama Üssü",
      heliLabel: "🌐 Yüksek Gerilim İletim Hattı",
      staffNames: {
        clerk: "⚡ Şebeke Operatörü (Oto Aktarım)",
        cleaner: "🔧 Türbin Bakım Teknisyeni (Oto Bakım)",
        specialist: "👷 Enerji Başmühendisi (+%35 Gelir)",
        manager: "👔 Santral Direktörü (Tam Otopilot)"
      },
      desc: "Dönen dev rüzgar türbinleri ve güneş tarlası! Şehre elektrik satar ve tesis elektrik giderini %50 düşürür!"
    },
    {
      key: "autofactory",
      cat: "industry",
      name: "Otomobil Montaj & Showroom",
      short: "FABRİKA",
      emoji: "🚗",
      buildCost: 95000,
      basePay: 590,
      color: "#1e293b",
      roofCol: "#090d1a",
      accent: "#f97316",
      checkinLabel: "🔩 SİPARİŞ BANDI BAŞLAT",
      prepLabel: "🔧 KALİTE KONTROL YAP",
      unitName: "Bant",
      floorLabel: "Üretim Bandını Genişlet (+6 Hat)",
      vipLabel: "🏎️ Süper Spor Showroom Galerisi",
      heliLabel: "🚛 Otomatik Tır Sevkiyat Rampası",
      staffNames: {
        clerk: "📋 Sipariş Sorumlusu (Oto Başlatma)",
        cleaner: "🔧 Kalite Kontrol Ustası (Oto Kontrol)",
        specialist: "👷 Başmühendis (+%35 Üretim Değeri)",
        manager: "👔 Fabrika Direktörü (Tam Otopilot)"
      },
      desc: "Araç montaj hattı ve cam galeri! Liman otomotiv ihracatına +%55 ekstra bonus kazandırır."
    },
    {
      key: "techpark",
      cat: "industry",
      name: "Teknokent & Veri Merkezi",
      short: "TEKNOKENT",
      emoji: "💻",
      buildCost: 110000,
      basePay: 680,
      color: "#1e1b4b",
      roofCol: "#0f172a",
      accent: "#818cf8",
      checkinLabel: "🖥️ SUNUCU KONTRATI AÇ",
      prepLabel: "❄️ SOĞUTMA & BAKIM YAP",
      unitName: "Sunucu",
      floorLabel: "Yeni Sunucu Kulesi Katı (+6 Kabin)",
      vipLabel: "🤖 Yapay Zeka Süper Bilgisayarı",
      heliLabel: "☀️ Özel Trafo & Fiber Omurga",
      staffNames: {
        clerk: "💼 Kontrat Uzmanı (Oto Kabul)",
        cleaner: "❄️ Soğutma Teknisyeni (Oto Bakım)",
        specialist: "👨‍💻 Kıdemli Yazılım Mimarı (+%35 Gelir)",
        manager: "👔 Teknokent CEO'su (Tam Otopilot)"
      },
      desc: "Bulut sunucu ve yazılım üssü! Liman teknoloji ihracatına +%60 dev bonus verir!"
    },
    {
      key: "twintowers",
      cat: "prestige",
      name: "İkiz Kuleler Lüks Rezidans",
      short: "İKİZ KULE",
      emoji: "🏙️",
      buildCost: 120000,
      basePay: 735,
      color: "#0f172a",
      roofCol: "#1e293b",
      accent: "#38bdf8",
      checkinLabel: "🔑 KONTRAT & ANAHTAR VER",
      prepLabel: "✨ REZİDANS & LOBİ HAZIRLA",
      unitName: "Penthouse",
      floorLabel: "İkiz Kulelere Yeni Kat Çık (+6 Daire)",
      vipLabel: "🌉 Cam Gökyüzü Köprüsü & Teras Lounge",
      heliLabel: "🚁 Çift Kule VIP Helikopter Pisti",
      staffNames: {
        clerk: "🤵 Rezidans Danışmanı (Oto Kontrat)",
        cleaner: "✨ Concierge & Bakım Ekibi (Oto Hazırlık)",
        specialist: "💎 VIP Emlak Direktörü (+%35 Gelir)",
        manager: "👔 Kuleler Genel Müdürü (Tam Otopilot)"
      },
      desc: "Gökyüzü köprüsüyle birbirine bağlanan çift cam gökdelen! Çok yüksek kira ve rezidans geliri üretir."
    },
    {
      key: "airport",
      cat: "tourism",
      name: "Özel Havalimanı & Jet Terminali",
      short: "HAVALİMANI",
      emoji: "✈️",
      buildCost: 135000,
      basePay: 790,
      color: "#0c4a6e",
      roofCol: "#0f172a",
      accent: "#bae6fd",
      checkinLabel: "🛫 UÇUŞ & CHECK-IN AÇ",
      prepLabel: "⛽ APRON & KABİN HAZIRLA",
      unitName: "Uçuş/Jet",
      floorLabel: "Yeni Terminal Kapısı & Hangar (+6 Kapı)",
      vipLabel: "🥂 Duty-Free & Özel İş Jeti Salonu",
      heliLabel: "📡 Gelişmiş Hava Trafik Radar Kulesi",
      staffNames: {
        clerk: "👩‍✈️ Check-In & Yer Hizmeti (Oto Uçuş)",
        cleaner: "🛠️ Apron & Teknik Bakım (Oto Hazırlık)",
        specialist: "👨‍✈️ Başpilot & Operasyon (+%35 Gelir)",
        manager: "👔 Havalimanı Direktörü (Tam Otopilot)"
      },
      desc: "3D yolcu jeti, pist ışıkları ve radarlı kontrol kulesi! Şehre zengin turist ve iş insanı yağdırır."
    },
    {
      key: "banktower",
      cat: "prestige",
      name: "Finans Kulesi & Özel Banka",
      short: "FİNANS BANK",
      emoji: "🏦",
      buildCost: 145000,
      basePay: 850,
      color: "#1c1917",
      roofCol: "#090d1a",
      accent: "#facc15",
      checkinLabel: "💼 YATIRIM & KREDİ ONAYLA",
      prepLabel: "🔐 ZIRHLI KASA DENETİMİ",
      unitName: "Portföy",
      floorLabel: "Yeni Finans & Borsa Katı Çık (+6 Birim)",
      vipLabel: "🪙 Altın Rezerv Kasası & Özel Bankacılık",
      heliLabel: "🚁 Zırhlı VIP Transfer Helikopter Pisti",
      staffNames: {
        clerk: "💼 Gişe & Müşteri Temsilcisi (Oto Onay)",
        cleaner: "🔐 Kasa & Denetim Uzmanı (Oto Hazırlık)",
        specialist: "📈 Başekonomist & Fon Yöneticisi (+%35 Gelir)",
        manager: "👔 Banka Genel Müdürü (Tam Otopilot)"
      },
      desc: "Altın taçlı siyah finans gökdeleni! Çok yüksek tekil işlem kazancı üretir!"
    },
    {
      key: "mixedtower",
      cat: "prestige",
      name: "Özel Karma Gökdelen (Kat Kat Tasarla!)",
      short: "KARMA KULE",
      emoji: "🏗️",
      buildCost: 132000,
      basePay: 890,
      color: "#0f172a",
      roofCol: "#1e1b4b",
      accent: "#38bdf8",
      checkinLabel: "🛎️ LOBİ & KULE GİRİŞİ AÇ",
      prepLabel: "✨ KAT & TERASLARI HAZIRLA",
      unitName: "Kat Birimi",
      floorLabel: "Karma Gökdelene Yeni Kat Ekle (+6 Birim)",
      vipLabel: "🌉 Panoramik Cam Seyir Terası",
      heliLabel: "🚁 Çatı VIP Helikopter & Lounge",
      staffNames: {
        clerk: "🤵 Kule Resepsiyon & Danışma (Oto Giriş)",
        cleaner: "✨ Gökdelen Kat Bakım Ekibi (Oto Hazırlık)",
        specialist: "💎 Karma Kule İşletme Direktörü (+%35 Gelir)",
        manager: "👔 Gökdelen CEO'su (Tam Otopilot)"
      },
      desc: "Zemin katı AVM/Galeri, orta katı Otel/Ofis, üst katı Rezidans/Banka ve çatısı Helikopter/Restoran olan kendi özel kuleni tasarla!"
    }
  ];

  const MIXED_TOWER_OPTIONS = {
    ground: [
      { key: "avm", label: "🛍️ Zemin: Lüks AVM", col: "#9a3412", bonus: 0.06 },
      { key: "market", label: "🏪 Zemin: Hipermarket", col: "#166534", bonus: 0.05 },
      { key: "gallery", label: "🏎️ Zemin: Süper Oto Galeri", col: "#991b1b", bonus: 0.08 }
    ],
    mid: [
      { key: "hotel", label: "🏨 Orta: 5★ Otel Katları", col: "#b45309", bonus: 0.07 },
      { key: "office", label: "🏢 Orta: Kurumsal Plaza", col: "#0369a1", bonus: 0.06 },
      { key: "clinic", label: "🏥 Orta: VIP Estetik & Klinik", col: "#0f766e", bonus: 0.08 }
    ],
    top: [
      { key: "penthouse", label: "💎 Üst: Kral Rezidans", col: "#4338ca", bonus: 0.08 },
      { key: "finance", label: "🏦 Üst: Yatırım Bankası", col: "#ca8a04", bonus: 0.09 },
      { key: "tech", label: "💻 Üst: Teknoloji Üssü", col: "#6d28d9", bonus: 0.07 }
    ],
    roof: [
      { key: "helipad", label: "🚁 Çatı: Helikopter Pisti", col: "#facc15", bonus: 0.07 },
      { key: "skyrest", label: "🍽️ Çatı: Dönen Restoran", col: "#f43f5e", bonus: 0.08 },
      { key: "skypool", label: "🏊 Çatı: Sonsuzluk Havuzu", col: "#22d3ee", bonus: 0.08 }
    ]
  };

  function createSingleLandState() {
    return {
      owned: false,
      projectKey: null,
      floorsLvl: 1,
      vipUpgrade: false,
      heliUpgrade: false,
      mixedConfig: { ground: "avm", mid: "hotel", top: "penthouse", roof: "helipad" },
      staff: {
        clerk: false,
        cleaner: false,
        specialist: false,
        manager: false
      },
      salary: 0
    };
  }

  function createDefaultExtraLands() {
    const obj = {};
    EXTRA_LANDS.forEach((l) => {
      obj[l.id] = createSingleLandState();
    });
    return obj;
  }

  function mergeExtraLands(saved) {
    const def = createDefaultExtraLands();
    if (!saved) return def;
    EXTRA_LANDS.forEach((l) => {
      if (saved[l.id]) {
        def[l.id] = Object.assign(createSingleLandState(), saved[l.id]);
        def[l.id].staff = Object.assign(
          { clerk: false, cleaner: false, specialist: false, manager: false },
          saved[l.id].staff || {}
        );
        def[l.id].mixedConfig = Object.assign(
          { ground: "avm", mid: "hotel", top: "penthouse", roof: "helipad" },
          saved[l.id].mixedConfig || {}
        );
      }
    });
    return def;
  }

  // Canlı Çalışma Durumu (Her arazi için kapıda bekleyen araçlar, dolu odalar, temizlik bekleyen odalar!)
  const runtime = {};
  EXTRA_LANDS.forEach((l) => {
    runtime[l.id] = {
      waitingCars: [], // Kapıda kayıt bekleyen müşteri araçları
      occupiedTimers: [], // İçeride konaklayan/işlem gören birimler (süre bitince ödeme yapar ve kirlenir!)
      dirtyCount: 0, // Temizlik/hazırlık bekleyen oda/birim sayısı
      spawnTimer: 1.5,
      clerkTimer: 0,
      cleanTimer: 0,
      floats: [],
      bgCars: [],
      walkers: []
    };
  });

  let cachedHelpers = null;
  let activeManageLandId = "land4";
  let activeModalTab = "overview"; // "overview" | "staff"
  let activeProjFilter = "all"; // "all" | "tourism" | "industry" | "prestige"
  let activeDirectoryTab = "districts"; // "districts" | "world_cities"
  let confirmDemolishLandId = null;

  function getLandDef(landId) {
    return EXTRA_LANDS.find((l) => l.id === landId);
  }

  function getProjectDef(key) {
    return PROJECT_TYPES.find((p) => p.key === key);
  }

  function isCoreLandBuilt(data, id) {
    const emp = data.empire || {};
    if (id === "station") return true;
    if (id === "land2") return !!(emp.land2Owned && (emp.parkingUnlocked || emp.mallUnlocked));
    if (id === "land3") return !!(emp.land3 && emp.land3.owned && (emp.land3.themeUnlocked || emp.land3.refineryUnlocked || emp.land3.resortUnlocked));
    const st = emp.extraLands && emp.extraLands[id];
    return !!(st && st.owned && st.projectKey);
  }

  function isDistrictMastered(data, distKey) {
    const d = CITY_DISTRICTS.find((x) => x.key === distKey);
    if (!d) return false;
    return d.landIds.every((id) => isCoreLandBuilt(data, id));
  }

  function getMainCityCompletion(data) {
    const allIds = ["station", "land2", "land3", ...EXTRA_LANDS.map((l) => l.id)];
    const built = allIds.filter((id) => isCoreLandBuilt(data, id)).length;
    return {
      built,
      total: allIds.length,
      pct: Math.round((built / allIds.length) * 100),
      completed: built >= allIds.length
    };
  }

  function getMaxUnits(st) {
    return 6 * (st.floorsLvl || 1); // 6, 12, 18, 24, 30 oda/birim!
  }

  function getMixedTowerBonus(st) {
    if (!st || st.projectKey !== "mixedtower" || !st.mixedConfig) return 1.0;
    const mc = st.mixedConfig;
    let b = 1.0;
    ["ground", "mid", "top", "roof"].forEach((tier) => {
      const opt = (MIXED_TOWER_OPTIONS[tier] || []).find((o) => o.key === mc[tier]);
      if (opt) b += opt.bonus;
    });
    return b;
  }

  function getUnitPayout(landDef, projDef, st, data) {
    let val = projDef.basePay * landDef.mult * (1 + (st.floorsLvl - 1) * 0.22);
    if (st.vipUpgrade) val *= 1.35;
    if (st.heliUpgrade) val *= 1.25;
    if (st.staff.specialist) val *= 1.35;
    if (projDef.key === "mixedtower") val *= getMixedTowerBonus(st);
    if (data && landDef.district && isDistrictMastered(data, landDef.district)) {
      val *= 1.18; // +%18 Bölge Hakimiyet Bonusu!
    }
    return Math.round(val);
  }

  function getFloorUpgradeCost(landDef, projDef, floorsLvl, data) {
    const disc = data && window.MetropolisV28 ? window.MetropolisV28.getBuildDiscountMult(data) : 1.0;
    return Math.round(projDef.buildCost * 0.55 * landDef.mult * Math.pow(1.55, floorsLvl - 1) * disc);
  }

  function getStaffCosts(landDef, projDef) {
    const m = landDef.mult;
    return {
      clerk: Math.round(14000 * m),
      cleaner: Math.round(16500 * m),
      specialist: Math.round(24000 * m),
      manager: Math.round(38000 * m)
    };
  }

  function calcTotalExtraSalary(extraLands) {
    if (!extraLands) return 0;
    let sum = 0;
    EXTRA_LANDS.forEach((l) => {
      const st = extraLands[l.id];
      if (st && st.owned && st.projectKey) {
        sum += Math.max(0, st.salary || 0);
      }
    });
    return sum;
  }

  function calcDailyExtraWages(extraLands) {
    let total = 0;
    const breakdown = [];
    if (!extraLands) return { total, breakdown };
    EXTRA_LANDS.forEach((l) => {
      const st = extraLands[l.id];
      if (!st || !st.owned || !st.projectKey) return;
      let sub = 0;
      if (st.staff.clerk) sub += 45;
      if (st.staff.cleaner) sub += 45;
      if (st.staff.specialist) sub += 65;
      if (st.staff.manager) sub += 95;
      if (sub > 0) {
        total += sub;
        breakdown.push({ label: `${l.num}. Arazi (${getProjectDef(st.projectKey).name}) Ekibi`, amount: sub });
      }
    });
    return { total, breakdown };
  }

  // =========================================================================
  // MİNİ AKSİYONLAR (ÖNCE BİZ İLGİLENİRİZ, ELEMAN ALINCA OTOMATİK OLUR!)
  // =========================================================================
  function doCheckInOne(landId, data, isAuto = false) {
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];
    if (!st || !st.projectKey || rt.waitingCars.length === 0) return false;

    const maxU = getMaxUnits(st);
    const usedU = rt.occupiedTimers.length + rt.dirtyCount;
    if (usedU >= maxU) {
      if (!isAuto && cachedHelpers) {
        const p = getProjectDef(st.projectKey);
        cachedHelpers.showToast(
          rt.dirtyCount > 0
            ? `🧹 Boş yer kalmadı! Önce kirli ${p.unitName.toLowerCase()}ları hazırla!`
            : `🏨 Tüm ${p.unitName.toLowerCase()}lar dolu (${maxU}/${maxU})! Kat çıkabilirsin.`
        );
      }
      return false;
    }

    const carIdx = isAuto ? rt.waitingCars.findIndex((c) => c.arrived) : 0;
    if (carIdx < 0) return false;
    const car = rt.waitingCars.splice(carIdx, 1)[0];
    rt.occupiedTimers.push(6.0 + Math.random() * 3.2);
    rt.walkers.push({
      x: car.x,
      y: Math.max(176, car.y + 10),
      tx: 240 + (Math.random() - 0.5) * 40,
      ty: 256,
      col: car.color,
      phase: Math.random() * 6
    });
    if (!isAuto && cachedHelpers) {
      cachedHelpers.sfx.tap();
    }
    return true;
  }

  function doCleanOne(landId, data, isAuto = false, count = 1) {
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];
    if (!st || !st.projectKey || rt.dirtyCount <= 0) return false;
    const cleanAmt = isAuto ? count : 2;
    rt.dirtyCount = Math.max(0, rt.dirtyCount - cleanAmt);
    if (!isAuto && cachedHelpers) {
      cachedHelpers.sfx.tap();
      rt.floats.push({ x: 240, y: 340, text: "✨ Hazırlandı!", color: "#38bdf8", life: 1.1 });
    }
    return true;
  }

  function getV16Mult(data) {
    const v16 = data.empire && data.empire.v16;
    if (!window.HoldingV16 || !v16) return 1.0;
    const sd = window.HoldingV16.getSpecialDay(v16);
    const hq = v16.vipAssets && v16.vipAssets.hq ? 1.15 : 1.0;
    return (sd.incomeMult || 1.0) * hq;
  }

  // =========================================================================
  // CANLI SİMÜLASYON (TÜM 4..10 ARAZİLER ARKA PLANDA VE EKRANDA ÇALIŞIR!)
  // =========================================================================
  function updateExtraLands(dt, data, onEarn) {
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();
    const colors = ["#ef4444", "#2563eb", "#f59e0b", "#10b981", "#e2e8f0", "#8b5cf6", "#ec4899"];
    const v16Mult = getV16Mult(data);

    EXTRA_LANDS.forEach((lDef) => {
      const st = data.empire.extraLands[lDef.id];
      const rt = runtime[lDef.id];

      if (Math.random() < dt * 0.7 && rt.bgCars.length < 3) {
        rt.bgCars.push({ x: 520, y: 23, speed: 110 + Math.random() * 25, color: colors[Math.floor(Math.random() * colors.length)] });
      }
      rt.bgCars.forEach((c) => (c.x -= c.speed * dt));
      rt.bgCars = rt.bgCars.filter((c) => c.x > -60);

      if (!st.owned || !st.projectKey) return;
      const proj = getProjectDef(st.projectKey);
      const dtL = dt * (window.MechanicsV23 ? window.MechanicsV23.getLandSpeedMult(data, lDef.id) : 1.0);

      // 1. Otoyoldan Tesise Müşteri Aracı Gelişi (Kesintisiz Waypoint Motoru!)
      rt.spawnTimer -= dtL;
      if (rt.spawnTimer <= 0 && rt.waitingCars.length < 5) {
        rt.spawnTimer = Math.max(1.15, 3.4 - st.floorsLvl * 0.35 - (st.heliUpgrade ? 0.55 : 0));
        const slotIdx = rt.waitingCars.length;
        const slotX = 145 + slotIdx * 48;
        rt.waitingCars.push({
          x: -40,
          y: 58,
          targetX: slotX,
          targetY: 178,
          angle: Math.PI / 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: st.vipUpgrade && Math.random() < 0.5 ? "sport" : "suv",
          arrived: false,
          waypoints: [
            { x: 98, y: 58, speed: 132 },
            { x: 98, y: 178, speed: 112 },
            { x: slotX, y: 178, speed: 108, finalAngle: Math.PI / 2 }
          ]
        });
      }

      rt.waitingCars.forEach((c, idx) => {
        const desiredX = 145 + idx * 48;
        c.targetX = desiredX;
        if (c.waypoints && c.waypoints.length > 0) {
          c.waypoints[c.waypoints.length - 1].x = desiredX;
          const wp = c.waypoints[0];
          const dx = wp.x - c.x;
          const dy = wp.y - c.y;
          const d = Math.hypot(dx, dy);
          const spd = wp.speed || 115;
          if (d <= spd * dt + 1.5) {
            c.x = wp.x;
            c.y = wp.y;
            if (wp.finalAngle !== undefined) c.angle = wp.finalAngle;
            c.waypoints.shift();
            if (c.waypoints.length === 0) {
              c.angle = Math.PI / 2;
              c.arrived = true;
            }
          } else {
            c.angle = Math.atan2(dx, -dy);
            c.x += (dx / d) * spd * dt;
            c.y += (dy / d) * spd * dt;
          }
        } else {
          // Sıradaki boşluğa kay
          const dx = desiredX - c.x;
          if (Math.abs(dx) > 2) {
            c.x += Math.sign(dx) * Math.min(Math.abs(dx), 95 * dt);
          } else {
            c.x = desiredX;
          }
          c.y = 178;
          c.angle = Math.PI / 2;
          c.arrived = true;
        }
      });

      // 2. Eleman Varsa (Resepsiyonist veya Genel Müdür) Otomatik Kayıt Açar! Yoksa Patronu Bekler!
      if ((st.staff.clerk || st.staff.manager) && rt.waitingCars.some((c) => c.arrived)) {
        rt.clerkTimer += dtL;
        const clerkRate = st.staff.manager && st.staff.clerk ? 0.65 : st.staff.manager ? 0.85 : 1.25;
        if (rt.clerkTimer >= clerkRate) {
          rt.clerkTimer = 0;
          doCheckInOne(lDef.id, data, true);
        }
      }

      // 3. Konaklayan / İşlem Gören Birimler Süresi Dolunca Ödeme Bırakır ve Oda Kirlenir!
      for (let i = rt.occupiedTimers.length - 1; i >= 0; i--) {
        rt.occupiedTimers[i] -= dtL;
        if (rt.occupiedTimers[i] <= 0) {
          rt.occupiedTimers.splice(i, 1);
          rt.dirtyCount += 1;
          const m28Mult = window.MetropolisV28 ? window.MetropolisV28.getExtraLandMult(data, proj.key) : 1.0;
          const pay = Math.round(getUnitPayout(lDef, proj, st, data) * v16Mult * m28Mult);
          data.cash += pay;
          if (data.daily) {
            if (!data.daily.extraLandIncomes) data.daily.extraLandIncomes = {};
            data.daily.extraLandIncomes[lDef.id] = (data.daily.extraLandIncomes[lDef.id] || 0) + pay;
          }
          if (st.salary > 0) {
            data.empire.personalCash += Math.max(5, Math.round(st.salary * 0.018));
          }
          rt.floats.push({
            x: 240 + (Math.random() - 0.5) * 90,
            y: 280,
            text: `${proj.emoji} +${pay} ₺`,
            color: "#4ade80",
            life: 1.55
          });
          if (onEarn) onEarn(pay);
        }
      }

      // 4. Kat Hizmetleri / Bakım Ekibi veya Müdür Varsa Kirli Odaları Otomatik Hazırlar!
      if ((st.staff.cleaner || st.staff.manager) && rt.dirtyCount > 0) {
        rt.cleanTimer += dt;
        const bothClean = st.staff.cleaner && st.staff.manager;
        const cleanRate = bothClean ? 0.65 : st.staff.manager ? 0.85 : 1.25;
        if (rt.cleanTimer >= cleanRate) {
          rt.cleanTimer = 0;
          doCleanOne(lDef.id, data, true, bothClean ? 2 : 1);
        }
      }

      // Yürüyen Konuklar & Uçan Yazılar
      rt.walkers.forEach((w) => {
        w.phase += dt * 7;
        const dx = w.tx - w.x;
        const dy = w.ty - w.y;
        const d = Math.hypot(dx, dy);
        if (d > 3) {
          w.x += (dx / d) * 60 * dt;
          w.y += (dy / d) * 60 * dt;
        } else {
          w.done = true;
        }
      });
      rt.walkers = rt.walkers.filter((w) => !w.done);

      rt.floats.forEach((f) => {
        f.y -= 24 * dt;
        f.life -= dt;
      });
      rt.floats = rt.floats.filter((f) => f.life > 0);
    });
  }

  // =========================================================================
  // GERÇEKÇİ 2.5D MİMARİ ÇİZİM (GRAND OTEL, HASTANE, FABRİKA, STADYUM, TEKNOKENT, SARAY)
  // =========================================================================
  function renderExtraLand(ctx, W, H, phase, data, MR, landId) {
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();
    const lDef = getLandDef(landId);
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];

    if (baseReady) ctx.drawImage(baseImg, 0, 0, W, H);
    else {
      ctx.fillStyle = "#162030";
      ctx.fillRect(0, 0, W, H);
    }

    rt.bgCars.forEach((hc) => {
      MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", -Math.PI / 2, { nightIntensity: phase.night });
    });

    // Üst Arazi Başlığı
    MR.rr(ctx, 74, 76, W - 148, 26, 7, "rgba(9, 13, 26, 0.92)", "#facc15", 1.8);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 10.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🗺️ ${lDef.name.toUpperCase()} (Gelir Çarpanı: x${lDef.mult})`, W / 2, 93);

    // DURUM 1: ARSA HENÜZ SATIN ALINMAMIŞ
    if (!st.owned) {
      MR.rr(ctx, 50, 148, W - 100, 290, 18, "rgba(15, 23, 42, 0.94)", "#f59e0b", 2.5);
      ctx.fillStyle = "#fde047";
      ctx.font = "900 19px sans-serif";
      ctx.fillText(`🏞️ ${lDef.name}`, W / 2, 194);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 12px sans-serif";
      ctx.fillText(lDef.desc, W / 2, 224);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "800 12px sans-serif";
      ctx.fillText("Tapuyu aldığında 6 dev projeden birini seçebilirsin:", W / 2, 256);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText("🏨 5 Yıldızlı Grand Otel • 🏥 Özel Hastane", W / 2, 282);
      ctx.fillText("🚗 Otomobil Fabrikası • 🏟️ Stadyum", W / 2, 304);
      ctx.fillText("💻 Teknokent Veri Üssü • 👑 Kongre Sarayı", W / 2, 326);

      const canBuy = data.cash >= lDef.deedCost;
      MR.rr(ctx, 78, 358, W - 156, 52, 13, canBuy ? "#16a34a" : "#475569", "#fef08a", 2.2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px sans-serif";
      ctx.fillText(`ARSA TAPUSUNU SATIN AL — ${lDef.deedCost.toLocaleString("tr-TR")} ₺`, W / 2, 389);
      return;
    }

    // DURUM 2: ARSA BİZİM AMA HENÜZ 6 PROJEDEN BİRİ SEÇİLMEDİ!
    if (!st.projectKey) {
      MR.rr(ctx, 48, 136, W - 96, 320, 18, "rgba(15, 23, 42, 0.94)", "#38bdf8", 2.5);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 16px sans-serif";
      ctx.fillText("✅ ARSA TAPUSU SENİN! NE İNŞA EDELİM?", W / 2, 176);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 12px sans-serif";
      ctx.fillText("Otel, Hastane, Fabrika, Stadyum, Teknokent veya Saray!", W / 2, 202);

      PROJECT_TYPES.forEach((p, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const bx = 62 + col * 182;
        const by = 218 + row * 68;
        MR.rr(ctx, bx, by, 174, 60, 10, "#1e293b", p.accent, 1.8);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 11px sans-serif";
        ctx.fillText(`${p.emoji} ${p.name}`, bx + 87, by + 24);
        ctx.fillStyle = "#fde047";
        ctx.font = "900 11.5px sans-serif";
        ctx.fillText(`${Math.round(p.buildCost * lDef.mult).toLocaleString("tr-TR")} ₺`, bx + 87, by + 45);
      });
      return;
    }

    // DURUM 3: DEV PROJE İNŞA EDİLDİ — GERÇEKÇİ 2.5D MİMARİ & CANLI İŞLEYİŞ!
    const proj = getProjectDef(st.projectKey);
    const maxU = getMaxUnits(st);
    const occU = rt.occupiedTimers.length;
    const dirtyU = rt.dirtyCount;

    // 1. VIP Ön Avlu (Yarı saydam — yeni 3D mermer/palmiye zemin alttan görünür!)
    MR.rr(ctx, 48, 112, 384, 122, 16, "rgba(15, 23, 42, 0.34)", "rgba(250, 204, 21, 0.38)", 1.5);
    // Kırmızı VIP karşılama halısı & parlak altın dubalar
    const carpetG = ctx.createLinearGradient(198, 202, 198, 248);
    carpetG.addColorStop(0, "#dc2626");
    carpetG.addColorStop(1, "#7f1d1d");
    MR.rr(ctx, 198, 202, 84, 46, 5, carpetG, "#fde047", 1.7);
    [206, 274].forEach((bxp) => {
      [212, 232].forEach((byp) => {
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(bxp, byp, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    MR.drawStreetLamp(ctx, 76, 128, phase.night, false);
    MR.drawStreetLamp(ctx, 404, 128, phase.night, false);

    // Kapıda Bekleyen Müşteri Araçları
    rt.waitingCars.forEach((c) => {
      MR.drawDetailedVehicle(ctx, c.x, c.y, c.color, c.shape, c.angle, { nightIntensity: phase.night });
    });

    rt.walkers.forEach((w) => {
      MR.drawCustomerCharacter(ctx, w.x, w.y, w.col, "#18181b", proj.emoji, w.phase);
    });

    // 2. Ana 3D Lüks Çok Katlı Dev Tesis / Grand Otel Binası (x: 48..432, y: 246..588)
    const bx = 48;
    const by = 246;
    const bw = 384;
    const bh = 342;

    // Derin Yumuşak 3D Bina Gölgesi
    MR.rr(ctx, bx + 8, by + 11, bw, bh, 19, "rgba(0,0,0,0.58)", null);

    // Zengin 3D Mimari Cephe Gradyanı (Düz kahverengi kutu yerine mermer/metal derinlik!)
    const facadeG = ctx.createLinearGradient(bx, by + 20, bx + bw, by + bh);
    facadeG.addColorStop(0, proj.color);
    facadeG.addColorStop(0.55, "#151e32");
    facadeG.addColorStop(1, "#0b1120");
    MR.rr(ctx, bx, by + 20, bw, bh - 20, 17, facadeG, proj.accent, 2.0);

    // İnce Mimari Mermer Sütun Çizgileri
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let col = 1; col < 6; col++) {
      ctx.fillRect(bx + 22 + col * 56 - 2, by + 102, 2.5, bh - 170);
    }

    // Kademeli 3D Çatı Kornişi & Parlak Neon Taç
    const roofG = ctx.createLinearGradient(bx, by, bx, by + 40);
    roofG.addColorStop(0, "#1e293b");
    roofG.addColorStop(1, proj.roofCol);
    MR.rr(ctx, bx - 3, by, bw + 6, 40, 14, roofG, proj.accent, 2.3);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(bx + 12, by + 2, bw - 24, 2.2);

    // Çatı Köşe Mimari LED Noktaları
    const ledBlink = 0.55 + 0.45 * Math.sin(Date.now() * 0.005);
    ctx.fillStyle = `rgba(254, 240, 138, ${ledBlink.toFixed(2)})`;
    [bx + 14, bx + 32, bx + bw - 32, bx + bw - 14].forEach((lx) => {
      ctx.beginPath();
      ctx.arc(lx, by + 20, 2.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Üst Tabela
    MR.rr(ctx, bx + 48, by + 8, bw - 96, 24, 8, "rgba(9, 13, 26, 0.94)", proj.accent, 1.6);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 11.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${proj.emoji} ${proj.name.toUpperCase()} ★ KAT ${st.floorsLvl}/5`, W / 2, by + 24);

    // Çatı Özellikleri: Çatı Sonsuzluk Havuzu (vipUpgrade) & Helikopter Pisti (heliUpgrade)
    const shimmer = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
    if (st.vipUpgrade) {
      MR.rr(ctx, bx + 14, by + 48, 146, 48, 10, "#e2e8f0", "#fde047", 1.6);
      const rPoolG = ctx.createLinearGradient(bx + 18, by + 52, bx + 156, by + 92);
      rPoolG.addColorStop(0, "#0284c7");
      rPoolG.addColorStop(0.5, "#38bdf8");
      rPoolG.addColorStop(1, "#0369a1");
      MR.rr(ctx, bx + 18, by + 52, 138, 40, 7.5, rPoolG, null);
      ctx.fillStyle = `rgba(224, 242, 254, ${0.24 + shimmer * 0.24})`;
      ctx.fillRect(bx + 24, by + 57, 126, 4.5);
      ctx.fillRect(bx + 36, by + 82, 104, 3.5);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 8.2px sans-serif";
      ctx.fillText(proj.key === "hotel" ? "🏊 ÇATI HAVUZU & VIP" : "🌟 VIP ÜNİTE AKTİF", bx + 87, by + 75);
    }
    if (st.heliUpgrade) {
      const hx = bx + bw - 50;
      const hy = by + 72;
      MR.rr(ctx, hx - 32, hy - 24, 64, 48, 10, "#0f172a", "#facc15", 1.6);
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(hx, hy, 15, 0, Math.PI * 2);
      ctx.stroke();
      // Helikopter pisti 4 köşe fener ışığı
      ctx.fillStyle = `rgba(74, 222, 128, ${ledBlink.toFixed(2)})`;
      [[hx - 25, hy - 17], [hx + 25, hy - 17], [hx - 25, hy + 17], [hx + 25, hy + 17]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#facc15";
      ctx.font = "900 12px sans-serif";
      ctx.fillText("H", hx, hy + 4.5);
    }

    // 3. Kat Kat Cam Yansımalı Lüks Oda / Birim Pencereleri!
    const cols = 6;
    const rows = st.floorsLvl; // 1..5 kat!
    const winW = 48;
    const winH = 26;
    const startX = bx + 26;
    const startY = by + 106;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const wx = startX + c * 56;
        const wy = startY + r * 34;
        const isOcc = idx < occU;
        const isDirty = !isOcc && idx < occU + dirtyU;

        if (isOcc) {
          ctx.save();
          ctx.fillStyle = `rgba(250, 204, 21, ${(0.14 + 0.14 * phase.night).toFixed(2)})`;
          ctx.fillRect(wx - 2.5, wy - 2.5, winW + 5, winH + 5);
          ctx.restore();
        }

        let wFill;
        if (isOcc) {
          wFill = ctx.createLinearGradient(wx, wy, wx, wy + winH);
          wFill.addColorStop(0, "#fef08a");
          wFill.addColorStop(1, "#f59e0b");
        } else if (isDirty) {
          wFill = ctx.createLinearGradient(wx, wy, wx, wy + winH);
          wFill.addColorStop(0, "#c2410c");
          wFill.addColorStop(1, "#7c2d12");
        } else {
          wFill = ctx.createLinearGradient(wx, wy, wx + winW, wy + winH);
          wFill.addColorStop(0, "#1e3a5f");
          wFill.addColorStop(0.5, "#172554");
          wFill.addColorStop(1, "#0f172a");
        }
        const wBrd = isOcc ? "#fde047" : isDirty ? "#fb923c" : "rgba(125, 211, 252, 0.45)";
        MR.rr(ctx, wx, wy, winW, winH, 6, wFill, wBrd, 1.3);

        // Pencere camı üst parlama şeridi
        ctx.fillStyle = isOcc ? "rgba(255,255,255,0.38)" : "rgba(186,230,253,0.16)";
        ctx.fillRect(wx + 4, wy + 2.5, winW - 8, 3);

        ctx.font = "900 7.8px sans-serif";
        ctx.fillStyle = isOcc ? "#090d1a" : isDirty ? "#fed7aa" : "#bae6fd";
        ctx.fillText(isOcc ? "★ DOLU" : isDirty ? "🧹 KİRLİ" : "HAZIR", wx + winW / 2, wy + 17);
      }
    }

    // 4. MANUEL İŞLEM BUTONLARI (Eleman Yokken Patron Tıklar, Eleman Alınınca Otomatik Çalışır!)
    const waitingReady = rt.waitingCars.filter((c) => c.arrived).length;

    // Sol Eylem Kutu: Müşteri Kaydı Açma
    const needManualCheckin = waitingReady > 0 && !st.staff.clerk && !st.staff.manager;
    MR.rr(
      ctx,
      bx + 16,
      by + bh - 62,
      170,
      48,
      10,
      needManualCheckin ? "#16a34a" : st.staff.clerk || st.staff.manager ? "#064e3b" : "#0f172a",
      needManualCheckin ? "#fef08a" : st.staff.clerk || st.staff.manager ? "#22c55e" : "#334155",
      2
    );
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.fillText(
      st.staff.clerk || st.staff.manager
        ? `🟢 OTO KAYIT (${occU}/${maxU} Dolu)`
        : waitingReady > 0
        ? `${proj.checkinLabel} (${waitingReady})!`
        : `Müşteri Bekleniyor (${occU}/${maxU})`,
      bx + 101,
      by + bh - 34
    );

    // Sağ Eylem Kutu: Oda / Birim Temizleme & Hazırlama
    const needManualClean = dirtyU > 0 && !st.staff.cleaner && !st.staff.manager;
    MR.rr(
      ctx,
      bx + bw - 186,
      by + bh - 62,
      170,
      48,
      10,
      needManualClean ? "#ea580c" : st.staff.cleaner || st.staff.manager ? "#0c4a6e" : "#0f172a",
      needManualClean ? "#fef08a" : st.staff.cleaner || st.staff.manager ? "#38bdf8" : "#334155",
      2
    );
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      st.staff.cleaner || st.staff.manager
        ? `🟢 OTO TEMİZLİK (${dirtyU} Kirli)`
        : dirtyU > 0
        ? `${proj.prepLabel} (${dirtyU})!`
        : `✨ Tüm ${proj.unitName}lar Temiz`,
      bx + bw - 101,
      by + bh - 34
    );

    // Orta Üst "Yönet & Ekip" Rozeti (Havuz ve Helikopter Pisti ile Çakışmaz!)
    MR.rr(ctx, bx + 166, by + 54, 130, 36, 9, "#0284c7", "#fef08a", 1.8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.fillText("🏗️ YÖNET & EKİP", bx + 231, by + 76);

    // Uçan Kazanç Yazıları
    rt.floats.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.font = "900 14px sans-serif";
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
  // HARİTA TIKLAMA VE 6 PROJE SEÇİM / TESİS YÖNETİM MODALI
  // =========================================================================
  function handleExtraLandClick(pt, data, helpers, landId) {
    cachedHelpers = helpers;
    const lDef = getLandDef(landId);
    const st = data.empire.extraLands[landId];

    // 1. Arsa satın alma (Rakip patronun elindeyse Rakip Devralma!)
    if (!st.owned) {
      if (pt.x >= 16 && pt.x <= 464 && pt.y >= 60 && pt.y <= 590) {
        const buyTitle = lDef.rivalBoss ? `⚔️ ${lDef.rivalBoss}'den ${lDef.num}. Araziyi Devral` : `${lDef.name} Tapusu`;
        helpers.payForBusiness(lDef.deedCost, buyTitle, () => {
          st.owned = true;
          if (lDef.rivalBoss) {
            data.reputation = Math.min(100, (data.reputation || 50) + 4);
            if (data.empire && data.empire.v16) data.empire.v16.xp = (data.empire.v16.xp || 0) + 85;
            if (window.MetropolisV28) window.MetropolisV28.onRivalPlotConquered(data, lDef);
          }
          helpers.sfx.perfectHit();
          helpers.showToast(
            lDef.rivalBoss
              ? `⚔️ ${lDef.rivalBoss} (${lDef.rivalHold}) elinden ${lDef.num}. Araziyi satın aldın! Şimdi kendi yapını kur!`
              : `🎉 ${lDef.name} tapusu alındı! Şimdi 15 farklı 3D yapıdan birini seç!`
          );
          helpers.saveGame();
          helpers.updateHUD();
          openExtraLandModal(landId, data, helpers);
        });
      }
      return;
    }

    // 2. 14 Proje Seçim Ekranı
    if (!st.projectKey) {
      openExtraLandModal(landId, data, helpers);
      return;
    }

    // 3. Bina Alt Sol Buton: Manuel Müşteri Kaydı Açma!
    if (pt.x >= 54 && pt.x <= 238 && pt.y >= 496 && pt.y <= 596) {
      if (!doCheckInOne(landId, data, false)) {
        openExtraLandModal(landId, data, helpers);
      }
      return;
    }

    // 4. Bina Alt Sağ Buton: Manuel Oda/Birim Temizleme!
    if (pt.x >= 242 && pt.x <= 426 && pt.y >= 496 && pt.y <= 596) {
      if (!doCleanOne(landId, data, false)) {
        openExtraLandModal(landId, data, helpers);
      }
      return;
    }

    // Kapıda bekleyen araca tıklanırsa da hemen kayıt açsın!
    if (pt.y >= 112 && pt.y <= 236 && runtime[landId].waitingCars.some((c) => c.arrived)) {
      doCheckInOne(landId, data, false);
      return;
    }

    // Binanın gövdesine dokununca Kat Çıkma & Eleman Alma menüsü açılır
    helpers.sfx.tap();
    openExtraLandModal(landId, data, helpers);
  }

  function openExtraLandModal(landId, data, helpers) {
    activeManageLandId = landId;
    cachedHelpers = helpers;
    renderExtraLandModal(data, helpers);
    const m = document.getElementById("land3Modal");
    if (m) m.classList.remove("hidden");
  }

  function renderExtraLandModal(data, helpers) {
    const lDef = getLandDef(activeManageLandId);
    const st = data.empire.extraLands[activeManageLandId];
    const titleEl = document.getElementById("land3ModalTitle");
    const cashEl = document.getElementById("land3CompanyCash");
    const body = document.getElementById("land3ModalBody");
    if (!body || !titleEl) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash).toLocaleString("tr-TR");

    // EĞER HENÜZ PROJE SEÇİLMEDİYSE 15 YAPI SEÇENEĞİNİ KATEGORİ FİLTRESİYLE GÖSTER!
    if (!st.projectKey) {
      titleEl.textContent = `🏗️ ${lDef.num}. Arazi — 15 Yapı Seçeneği`;
      const discMult = window.MetropolisV28 ? window.MetropolisV28.getBuildDiscountMult(data) : 1.0;
      const filtered = activeProjFilter === "all"
        ? PROJECT_TYPES
        : PROJECT_TYPES.filter((p) => p.cat === activeProjFilter);

      let html = `
        <p style="font-size:12.5px; color:#fde68a; font-weight:800; margin-bottom:8px;">
          Bu araziye <strong>Özel Karma Gökdelen</strong> dahil <strong>15 farklı 3D yapıdan</strong> istediğini kurabilirsin:
        </p>
        <div class="subtab-row" style="grid-template-columns: repeat(4, 1fr); margin-bottom:10px;">
          <button class="city-tab-btn proj-cat-btn ${activeProjFilter === "all" ? "active" : ""}" data-pcat="all">🌟 Tümü (15)</button>
          <button class="city-tab-btn proj-cat-btn ${activeProjFilter === "tourism" ? "active" : ""}" data-pcat="tourism">🏨 Turizm</button>
          <button class="city-tab-btn proj-cat-btn ${activeProjFilter === "industry" ? "active" : ""}" data-pcat="industry">🏭 Üretim</button>
          <button class="city-tab-btn proj-cat-btn ${activeProjFilter === "prestige" ? "active" : ""}" data-pcat="prestige">🎓 Prestij</button>
        </div>
      `;
      filtered.forEach((p) => {
        const buildPrice = Math.round(p.buildCost * lDef.mult * discMult);
        const estPay = Math.round(p.basePay * lDef.mult);
        html += `
          <div class="mall-shop-card" style="border-color:${p.accent};">
            <div class="shop-top-row">
              <div class="shop-title">${p.emoji} ${p.name}</div>
              <span class="shop-status-tag tag-sale">+${estPay} ₺ / işlem</span>
            </div>
            <div style="font-size:12.5px; color:#cbd5e1;">${p.desc}</div>
            <div class="shop-btn-row">
              <button class="shop-action-btn buy-deed pick-proj-btn" data-proj="${p.key}">
                🏗️ ${p.name} Kur — ${buildPrice.toLocaleString("tr-TR")} ₺
              </button>
            </div>
          </div>
        `;
      });
      body.innerHTML = html;

      body.querySelectorAll(".proj-cat-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeProjFilter = btn.dataset.pcat;
          helpers.sfx.tap();
          renderExtraLandModal(data, helpers);
        });
      });

      body.querySelectorAll(".pick-proj-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pKey = btn.dataset.proj;
          const pDef = getProjectDef(pKey);
          const buildPrice = Math.round(pDef.buildCost * lDef.mult * discMult);
          helpers.payForBusiness(buildPrice, `${pDef.name} İnşaatı`, () => {
            st.projectKey = pKey;
            st.floorsLvl = 1;
            confirmDemolishLandId = null;
            if (window.RealCityV29) window.RealCityV29.startConstructionSite(activeManageLandId, pDef.name, data);
            helpers.sfx.perfectHit();
            helpers.showToast(`🏗️ 3D Sarı Kule Vinç sahaya kuruldu; ${pDef.name} yükseliyor!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      });
      return;
    }

    // PROJE KURULMUŞ -> BÜYÜTME, KARMA KULE KAT TASARIMI, ELEMAN ALMA VE ŞAHSİ MAAŞ BAĞLAMA!
    const proj = getProjectDef(st.projectKey);
    titleEl.textContent = `${proj.emoji} ${lDef.num}. Arazi: ${proj.name}`;

    const floorCost = getFloorUpgradeCost(lDef, proj, st.floorsLvl, data);
    const vipCost = Math.round(proj.buildCost * 0.75 * lDef.mult);
    const heliCost = Math.round(proj.buildCost * 0.95 * lDef.mult);
    const sCosts = getStaffCosts(lDef, proj);
    const curPay = getUnitPayout(lDef, proj, st, data);
    const salPresets = [0, 500, 1500, 3500, 7500, 15000];

    body.innerHTML = `
      <div class="mall-summary-bar">
        <div class="mall-stat-pill">
          <span class="lbl">🏢 KAPASİTE</span>
          <span class="val">${getMaxUnits(st)} ${proj.unitName}</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💰 İŞLEM BAŞI</span>
          <span class="val" style="color:#4ade80;">+${curPay} ₺</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💼 ŞAHSİ MAAŞ</span>
          <span class="val" style="color:#38bdf8;">+${st.salary} ₺</span>
        </div>
      </div>

      <div class="subtab-row" style="grid-template-columns: 1fr 1fr; margin-bottom:8px;">
        <button class="city-tab-btn ${activeModalTab === "overview" ? "active" : ""}" id="tabExtUp">🏗️ Tesis Büyütme</button>
        <button class="city-tab-btn ${activeModalTab === "staff" ? "active" : ""}" id="tabExtStaff">👷 Eleman &amp; Maaş</button>
      </div>

      <div id="extModalInner"></div>
    `;

    document.getElementById("tabExtUp").addEventListener("click", () => {
      activeModalTab = "overview";
      renderExtraLandModal(data, helpers);
    });
    document.getElementById("tabExtStaff").addEventListener("click", () => {
      activeModalTab = "staff";
      renderExtraLandModal(data, helpers);
    });

    const inner = document.getElementById("extModalInner");
    if (activeModalTab === "overview") {
      if (!st.mixedConfig) st.mixedConfig = { ground: "avm", mid: "hotel", top: "penthouse", roof: "helipad" };
      const mixedHtml = proj.key === "mixedtower"
        ? `
          <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
            <h4>🏗️ KARMA GÖKDELENİNİ KAT KAT TASARLA (3D CANLI!)</h4>
            <p style="font-size:12px; color:#cbd5e1; margin-bottom:7px;">Her kat kuşağının işlevini seç; 3D gökdeleninin kat renkleri ve geliri anında güncellenir!</p>
            ${["ground", "mid", "top", "roof"].map((tier) => `
              <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:6px;">
                ${MIXED_TOWER_OPTIONS[tier].map((opt) => `
                  <button class="sal-btn mixed-tier-btn ${st.mixedConfig[tier] === opt.key ? "active" : ""}" data-tier="${tier}" data-okey="${opt.key}" style="font-size:11px; padding:5px 8px;">
                    ${opt.label} (+%${Math.round(opt.bonus * 100)})
                  </button>
                `).join("")}
              </div>
            `).join("")}
          </div>
        `
        : "";

      inner.innerHTML = `
        ${mixedHtml}
        <div class="upgrade-card">
          <div class="up-info">
            <h3>🏢 ${proj.floorLabel} (Kat ${st.floorsLvl}/5)</h3>
            <p>Kapasiteyi +6 ${proj.unitName.toLowerCase()} büyütür ve birim gelirini +%22 artırır!</p>
          </div>
          <button id="btnExtFloor" class="up-buy-btn" ${st.floorsLvl >= 5 ? "disabled" : ""}>
            ${st.floorsLvl >= 5 ? "5 KAT TAM ✓" : `${floorCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>${proj.vipLabel}</h3>
            <p>Lüks müşteri çeker ve tüm gelirleri kalıcı olarak <strong>+%35</strong> artırır!</p>
          </div>
          <button id="btnExtVip" class="up-buy-btn" ${st.vipUpgrade ? "disabled" : ""}>
            ${st.vipUpgrade ? "AKTİF ✓" : `${vipCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>${proj.heliLabel}</h3>
            <p>Müşteri geliş hızını artırır ve tüm gelirlere ekstra <strong>+%25</strong> ekler!</p>
          </div>
          <button id="btnExtHeli" class="up-buy-btn" ${st.heliUpgrade ? "disabled" : ""}>
            ${st.heliUpgrade ? "AKTİF ✓" : `${heliCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card" style="border-color:#64748b; background:rgba(15,23,42,0.75); margin-top:8px;">
          <div class="up-info">
            <h3 style="font-size:14.5px; color:#fca5a5;">🔄 Yapıyı Yık &amp; 15 Seçenekten Başka Yapı Kur</h3>
            <p style="font-size:12px;">Mevcut yapıyı kaldırıp inşaat bedelinin %50'sini (+${Math.round(proj.buildCost * lDef.mult * 0.5).toLocaleString("tr-TR")} ₺) kasaya iade eder; arsa tapun sende kalır.</p>
          </div>
          <button id="btnExtChangeProj" class="up-buy-btn" style="background:${confirmDemolishLandId === activeManageLandId ? "#dc2626" : "#334155"}; color:#fff; font-size:12.5px;">
            ${confirmDemolishLandId === activeManageLandId ? "⚠️ Onayla (Yık)" : "🔄 Değiştir"}
          </button>
        </div>
      `;

      inner.querySelectorAll(".mixed-tier-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          st.mixedConfig[btn.dataset.tier] = btn.dataset.okey;
          helpers.sfx.tap();
          helpers.saveGame();
          helpers.updateHUD();
          renderExtraLandModal(data, helpers);
        });
      });

      const chgBtn = document.getElementById("btnExtChangeProj");
      if (chgBtn) {
        chgBtn.addEventListener("click", () => {
          if (confirmDemolishLandId !== activeManageLandId) {
            confirmDemolishLandId = activeManageLandId;
            helpers.sfx.tap();
            renderExtraLandModal(data, helpers);
            return;
          }
          const refund = Math.round(proj.buildCost * lDef.mult * 0.5);
          data.cash += refund;
          st.projectKey = null;
          st.floorsLvl = 1;
          st.vipUpgrade = false;
          st.heliUpgrade = false;
          st.staff = { clerk: false, cleaner: false, specialist: false, manager: false };
          runtime[activeManageLandId].waitingCars = [];
          runtime[activeManageLandId].occupiedTimers = [];
          runtime[activeManageLandId].dirtyCount = 0;
          confirmDemolishLandId = null;
          helpers.sfx.cashRegister();
          helpers.showToast(`🔄 Arsa temizlendi (+${refund.toLocaleString("tr-TR")} ₺ iade)! Şimdi 15 yapıdan yenisini seçebilirsin!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderExtraLandModal(data, helpers);
        });
      }

      const fBtn = document.getElementById("btnExtFloor");
      if (fBtn && st.floorsLvl < 5) {
        fBtn.addEventListener("click", () => {
          helpers.payForBusiness(floorCost, `${proj.name} Yeni Kat`, () => {
            st.floorsLvl += 1;
            if (window.RealCityV29) window.RealCityV29.startConstructionSite(activeManageLandId, `${proj.name} Kat ${st.floorsLvl}`, data);
            helpers.sfx.perfectHit();
            helpers.showToast(`🏢 ${proj.name} ${st.floorsLvl}. kata yükseldi (${getMaxUnits(st)} ${proj.unitName})!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }

      const vBtn = document.getElementById("btnExtVip");
      if (vBtn && !st.vipUpgrade) {
        vBtn.addEventListener("click", () => {
          helpers.payForBusiness(vipCost, proj.vipLabel, () => {
            st.vipUpgrade = true;
            helpers.sfx.perfectHit();
            helpers.showToast(`🌟 ${proj.vipLabel} hizmete açıldı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }

      const hBtn = document.getElementById("btnExtHeli");
      if (hBtn && !st.heliUpgrade) {
        hBtn.addEventListener("click", () => {
          helpers.payForBusiness(heliCost, proj.heliLabel, () => {
            st.heliUpgrade = true;
            helpers.sfx.perfectHit();
            helpers.showToast(`🚁 ${proj.heliLabel} tamamlandı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }
      return;
    }

    // STAFF & PERSONAL SALARY TAB
    inner.innerHTML = `
      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.clerk}</h3>
          <p>Kapıya gelen müşterileri sen dokunmadan otomatik içeri alır!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="clerk" ${st.staff.clerk ? "disabled" : ""}>
          ${st.staff.clerk ? "GÖREVDE ✓" : `${sCosts.clerk.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.cleaner}</h3>
          <p>Boşalan ${proj.unitName.toLowerCase()}ları otomatik temizleyip yeni müşteriye hazırlar!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="cleaner" ${st.staff.cleaner ? "disabled" : ""}>
          ${st.staff.cleaner ? "GÖREVDE ✓" : `${sCosts.cleaner.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.specialist}</h3>
          <p>Hizmet kalitesini zirveye taşır, kazancı <strong>+%35</strong> artırır!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="specialist" ${st.staff.specialist ? "disabled" : ""}>
          ${st.staff.specialist ? "GÖREVDE ✓" : `${sCosts.specialist.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card" style="border-color:#facc15;">
        <div class="up-info">
          <h3>${proj.staffNames.manager}</h3>
          <p>Sen diğer arazilerdeyken burayı %100 tam hızda otopilot yönetir!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="manager" ${st.staff.manager ? "disabled" : ""}>
          ${st.staff.manager ? "OTOPİLOT ✓" : `${sCosts.manager.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="rep-section" style="border-color:#22c55e; margin-top:8px;">
        <h4>💳 BU ARAZİDEN ŞAHSİ MAAŞ BAĞLA</h4>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:6px;">
          ${salPresets
            .map((amt) => `<button class="sal-btn ext-sal-btn ${st.salary === amt ? "active" : ""}" data-amt="${amt}">${amt} ₺</button>`)
            .join("")}
        </div>
      </div>
    `;

    inner.querySelectorAll(".ext-stf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.role;
        const cost = sCosts[role];
        helpers.payForBusiness(cost, proj.staffNames[role], () => {
          st.staff[role] = true;
          helpers.sfx.perfectHit();
          helpers.showToast(`👷 ${proj.staffNames[role]} göreve başladı!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderExtraLandModal(data, helpers);
        });
      });
    });

    inner.querySelectorAll(".ext-sal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        st.salary = Number(btn.dataset.amt);
        helpers.sfx.tap();
        helpers.saveGame();
        helpers.showToast(`💼 ${lDef.num}. Arazi şahsi maaşın ${st.salary} ₺/gün yapıldı!`);
        renderExtraLandModal(data, helpers);
      });
    });
  }

  // =========================================================================
  // 🗺️ 4 BÖLGELİ 16 ARAZİ HARİTASI & 1+10 ÇEVRE ŞEHİR SEÇİCİSİ (#landsDirectoryModal)
  // =========================================================================
  function renderLandsDirectory(data, activeLand, onSelectLand, helpers) {
    if (helpers) cachedHelpers = helpers;
    const box = document.getElementById("landsDirectoryList");
    const cashEl = document.getElementById("landsDirCash");
    if (!box) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash).toLocaleString("tr-TR");
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();

    const comp = getMainCityCompletion(data);
    const unlockedCitiesCount = window.MetropolisV28 ? window.MetropolisV28.getUnlockedSurroundingCount(data) : 0;

    const topTabsHtml = `
      <div class="subtab-row" style="grid-template-columns: 1fr 1fr; margin-bottom:9px;">
        <button class="city-tab-btn dir-main-tab ${activeDirectoryTab === "districts" ? "active" : ""}" data-dtab="districts">
          🏙️ Şehir Bölgeleri (${comp.built}/${comp.total})
        </button>
        <button class="city-tab-btn dir-main-tab ${activeDirectoryTab === "world_cities" ? "active" : ""}" data-dtab="world_cities">
          🌍 1+10 Şehir Haritası (${1 + unlockedCitiesCount}/11)
        </button>
      </div>
    `;

    if (activeDirectoryTab === "world_cities" && window.MetropolisV28) {
      box.innerHTML = `${topTabsHtml}<div id="worldCitiesSubBox"></div>`;
      box.querySelectorAll(".dir-main-tab").forEach((b) => {
        b.addEventListener("click", () => {
          activeDirectoryTab = b.dataset.dtab;
          if (cachedHelpers && cachedHelpers.sfx) cachedHelpers.sfx.tap();
          renderLandsDirectory(data, activeLand, onSelectLand, cachedHelpers);
        });
      });
      const subBox = document.getElementById("worldCitiesSubBox");
      window.MetropolisV28.renderWorldCitiesTab(subBox, data, cachedHelpers, () => {
        renderLandsDirectory(data, activeLand, onSelectLand, cachedHelpers);
      });
      return;
    }

    const coreLookup = {
      station: {
        id: "station",
        title: "⛽ 1. Arazi — Ana İstasyon",
        status: "AKTİF MERKEZ",
        owned: true,
        built: true,
        desc: "9 Pompa, LPG, Çekici, Otobüs Peronu, EV Şarj, Restoran & Motel"
      },
      land2: {
        id: "land2",
        title: "🛍️ 2. Arazi — Otopark & Grand AVM",
        status: data.empire.land2Owned ? "TAPULU ✓" : `SATILIK (${window.EmpireSystem.LAND2_COST} ₺)`,
        owned: data.empire.land2Owned,
        built: isCoreLandBuilt(data, "land2"),
        desc: "Ücretli Otopark, 8 Dükkanlı AVM, Lojistik & Plaza"
      },
      land3: {
        id: "land3",
        title: "🎡 3. Arazi — Park, Filo & Tatil Köyü",
        status: data.empire.land3 && data.empire.land3.owned ? "TAPULU ✓" : `SATILIK (${window.Land3System.LAND3_COST} ₺)`,
        owned: !!(data.empire.land3 && data.empire.land3.owned),
        built: isCoreLandBuilt(data, "land3"),
        desc: "Go-Kart, Dönme Dolap, Rafineri, 10 Tır & Bungalov"
      }
    };

    let html = `
      ${topTabsHtml}
      <div class="rep-section" style="border-color:${comp.completed ? "#22c55e" : "#facc15"}; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="font-size:13.5px; color:#fff;">🏗️ Merkez Şehir Yapılanması: ${comp.built} / ${comp.total} (%${comp.pct})</strong>
          <span class="shift-pill" style="color:${comp.completed ? "#4ade80" : "#fde047"};">${comp.completed ? "1. ÇEVRE ŞEHİR AÇIK! 🌍" : "Hedef: %100"}</span>
        </div>
        <div style="width:100%; height:9px; background:#090d1a; border-radius:999px; overflow:hidden; border:1px solid #334155; margin-bottom:5px;">
          <div style="width:${comp.pct}%; height:100%; background:linear-gradient(90deg,#38bdf8,#22c55e);"></div>
        </div>
        <div style="font-size:11.5px; color:#cbd5e1;">
          ${comp.completed ? "🎉 Bu şehirdeki tüm yapılar tamamlandı! Üstteki '🌍 1+10 Şehir Haritası' sekmesinden diğer şehirlere geçebilirsin!" : "Rakiplerin elindeki arazileri satın alıp tüm 16 araziye yapı kurduğunda etraftaki 10 yeni şehrin kilidi sırayla açılır!"}
        </div>
      </div>
    `;

    CITY_DISTRICTS.forEach((dist) => {
      const mastered = isDistrictMastered(data, dist.key);
      const distBuilt = dist.landIds.filter((id) => isCoreLandBuilt(data, id)).length;
      html += `
        <div class="rep-section" style="border-color:${mastered ? "#22c55e" : dist.color}; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:4px;">
            <h4 style="margin:0; color:${mastered ? "#86efac" : "#fde68a"};">${dist.title}</h4>
            <span class="shift-pill" style="font-size:10.5px; color:${mastered ? "#4ade80" : "#cbd5e1"};">
              ${mastered ? "✅ HAKİMİYET +%18" : `${distBuilt}/${dist.landIds.length} Yapı`}
            </span>
          </div>
          <p style="font-size:11.5px; color:#94a3b8; margin-bottom:7px;">${dist.subtitle}</p>
      `;

      dist.landIds.forEach((lid) => {
        if (coreLookup[lid]) {
          const c = coreLookup[lid];
          html += `
            <div class="mall-shop-card ${c.owned ? "rented" : ""}" style="margin-bottom:6px;">
              <div class="shop-top-row">
                <div class="shop-title">${c.title}</div>
                <span class="shop-status-tag ${c.owned ? "tag-rented" : "tag-sale"}">${c.status}</span>
              </div>
              <div style="font-size:12px; color:#cbd5e1;">${c.desc}</div>
              <div class="shop-btn-row">
                <button class="shop-action-btn ${activeLand === c.id ? "up-rent" : "rent-fixed"} go-land-btn" data-land="${c.id}">
                  ${activeLand === c.id ? "📍 ŞU AN BURADASIN" : "🚀 BU ARAZİYE GİT ➔"}
                </button>
              </div>
            </div>
          `;
        } else {
          const l = getLandDef(lid);
          if (!l) return;
          const st = data.empire.extraLands[l.id] || createSingleLandState();
          const pDef = st.projectKey ? getProjectDef(st.projectKey) : null;
          const isRivalHeld = !st.owned && !!l.rivalBoss;
          const statusTxt = !st.owned
            ? isRivalHeld
              ? `⚔️ RAKİP: ${l.rivalBoss} • ${l.deedCost.toLocaleString("tr-TR")} ₺`
              : `SATILIK • ${l.deedCost.toLocaleString("tr-TR")} ₺`
            : pDef
            ? `${pDef.emoji} ${pDef.name} (Kat ${st.floorsLvl})`
            : "🔑 ARSA BİZİM • YAPI SEÇ!";

          html += `
            <div class="mall-shop-card ${pDef ? "rented" : st.owned ? "owned" : ""}" style="margin-bottom:6px; ${isRivalHeld ? `border-color:${l.rivalColor};` : ""}">
              <div class="shop-top-row">
                <div class="shop-title">${isRivalHeld ? "⚔️" : "🏞️"} ${l.name}</div>
                <span class="shop-status-tag ${pDef ? "tag-rented" : st.owned ? "tag-vacant" : "tag-sale"}">${statusTxt}</span>
              </div>
              <div style="font-size:12px; color:#cbd5e1;">${l.desc}</div>
              <div class="shop-btn-row">
                <button class="shop-action-btn ${st.owned ? "rent-share" : "buy-deed"} go-land-btn" data-land="${l.id}">
                  ${!st.owned
                    ? isRivalHeld
                      ? `⚔️ Rakip Araziye Git & Satın Al (${l.deedCost.toLocaleString("tr-TR")} ₺)`
                      : `🗺️ Arsayı Gör & Satın Al (${l.deedCost.toLocaleString("tr-TR")} ₺)`
                    : pDef
                    ? `🚀 ${pDef.name} Haritasına Git ➔`
                    : "🏗️ 15 Yapıdan Birini Seç & Kur ➔"}
                </button>
              </div>
            </div>
          `;
        }
      });

      html += `</div>`;
    });

    box.innerHTML = html;
    box.querySelectorAll(".dir-main-tab").forEach((b) => {
      b.addEventListener("click", () => {
        activeDirectoryTab = b.dataset.dtab;
        if (cachedHelpers && cachedHelpers.sfx) cachedHelpers.sfx.tap();
        renderLandsDirectory(data, activeLand, onSelectLand, cachedHelpers);
      });
    });
    box.querySelectorAll(".go-land-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.land;
        const m = document.getElementById("landsDirectoryModal");
        if (m) m.classList.add("hidden");
        onSelectLand(target);
      });
    });
  }

  return {
    CITY_DISTRICTS,
    EXTRA_LANDS,
    PROJECT_TYPES,
    MIXED_TOWER_OPTIONS,
    createDefaultExtraLands,
    mergeExtraLands,
    getLandDef,
    getProjectDef,
    getMainCityCompletion,
    isDistrictMastered,
    setDirectoryTab(tab) { if (tab) activeDirectoryTab = tab; },
    calcTotalExtraSalary,
    calcDailyExtraWages,
    updateExtraLands,
    renderExtraLand,
    handleExtraLandClick,
    openExtraLandModal,
    renderLandsDirectory,
    get3DState(landId) {
      return runtime[landId] || null;
    }
  };
})();

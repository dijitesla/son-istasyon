// Son İstasyon v10.0 — Çok Modlu, Özel Seçenekli, Zincirleme ve Öngörülemez Olay Motoru
// Sabit 4 buton ve tek kalıp dedektiflik kalktı! 16+ farklı olay ailesi, ters köşe (gerçek/tuzak) varyantları,
// her olaya özel 4 farklı karar seçeneği ve önceki kararlarını hatırlayan devam olayları!

window.ScenarioEngine = (function () {
  const NAMES_M = [
    "Selim", "Tufan", "Orhan", "Sinan", "Yavuz", "Cihan", "Levent", "Furkan",
    "Soner", "Hakan", "Metin", "Kerem", "Bora", "Murat", "Emre", "Serkan",
    "Zafer", "Gökhan", "Erhan", "Kemal", "Tarık", "Onur", "Barış", "Tolga",
    "Kaan", "Oğuz", "Volkan", "Berkay", "Uğur", "İlker", "Nadir", "Halil", "Efe", "Arda"
  ];
  const NAMES_F = [
    "Melis", "Derya", "Selin", "Gökçe", "Aylin", "Burcu", "Damla", "Ceren",
    "Pınar", "Merve", "Nihan", "Elif", "Seda", "Gizem", "Hande", "Ebru",
    "Aslı", "Buse", "Tuğba", "İrem", "Nazlı", "Şeyma", "Zehra", "Ezgi", "Defne"
  ];
  const SURNAMES = [
    "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Arslan", "Doğan", "Keskin",
    "Polat", "Karaca", "Soylu", "Aydın", "Korkmaz", "Yıldız", "Öztürk", "Koç",
    "Aksoy", "Eren", "Güneş", "Taş", "Uçar", "Balcı", "Yalçın", "Tekin", "Kurt"
  ];
  const CITIES = [
    { code: "01", name: "Adana" }, { code: "06", name: "Ankara" }, { code: "07", name: "Antalya" },
    { code: "16", name: "Bursa" }, { code: "26", name: "Eskişehir" }, { code: "34", name: "İstanbul" },
    { code: "35", name: "İzmir" }, { code: "41", name: "Kocaeli" }, { code: "42", name: "Konya" },
    { code: "52", name: "Ordu" }, { code: "55", name: "Samsun" }, { code: "61", name: "Trabzon" }
  ];
  const PLATE_LETTERS = ["KLM", "TRK", "GCE", "SRN", "VDR", "BKT", "YLD", "NHR", "MZR", "DGT", "KYN", "PLS", "AKN", "BRS", "ZFR"];
  const CAR_COLORS = ["#dc2626", "#2563eb", "#0f766e", "#ca8a04", "#334155", "#7c3aed", "#e2e8f0", "#ea580c", "#18181b", "#475569", "#0284c7", "#be123c"];
  const ROLES = [
    "Gece Yolcusu", "Şehirlerarası Sürücü", "Kargo Şoförü", "İş İnsanı", "Taksici",
    "Esnaf", "Teknisyen", "Pazarlamacı", "Sağlık Çalışanı", "Özel Araç Sürücüsü",
    "Tur Kaptanı", "Nakliyeci", "Mühendis", "Üniversiteli", "Muhabir"
  ];

  // Bellek: Son olay aileleri + Zincirleme devam olayları kuyruğu!
  let recentFamilies = [];
  let pendingFollowUps = [];

  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];
  const chance = (p) => Math.random() < p;

  function makePlate(cityObj) {
    const c = cityObj || pick(CITIES);
    return `${c.code} ${pick(PLATE_LETTERS)} ${10 + rand(890)}`;
  }

  function mutatePlate(plate) {
    const parts = plate.split(" ");
    const digits = Number(parts[2]);
    if (chance(0.5)) return `${parts[0]} ${parts[1]} ${digits + (digits > 500 ? -13 : 17)}`;
    const otherCity = pick(CITIES.filter((c) => c.code !== parts[0]));
    return `${otherCity.code} ${parts[1]} ${parts[2]}`;
  }

  function makePerson(forceFemale = null) {
    const isFem = forceFemale !== null ? forceFemale : chance(0.45);
    const first = isFem ? pick(NAMES_F) : pick(NAMES_M);
    const last = pick(SURNAMES);
    const birthYear = 1966 + rand(37);
    const look = {
      style: isFem
        ? pick(["long", "bun", "curly", "hijab"])
        : pick(["short", "trucker", "cap", "beanie", "slick", "hood"]),
      skin: pick(["#fad2b4", "#f3c6a5", "#eab68c", "#dfb18b", "#d49b72"]),
      outfit: pick(CAR_COLORS),
      outfit2: "#0f172a",
      capColor: pick(CAR_COLORS),
      hairColor: pick(["#18181b", "#3f3f46", "#451a03", "#27272a", "#78350f"]),
      glasses: chance(0.32),
      mustache: !isFem && chance(0.36)
    };
    return { first, last, fullName: `${first} ${last}`, isFem, birthYear, look };
  }

  function queueFollowUp(delayEvents, factory) {
    pendingFollowUps.push({ countdown: delayEvents, factory });
  }

  function nextSpecialInterval(state) {
    const base = 3 + rand(4); // 3..6 araç arası rastgele
    if (state && state.security < 35 && chance(0.4)) return Math.max(2, base - 1);
    return base;
  }

  // =========================================================================
  // 1) GİZEMLİ EMANET PAKET (50/50 GERÇEK DEĞERLİ EMANET VEYA KAÇAK MAL!)
  // =========================================================================
  function famMysteryPackage() {
    const p = makePerson();
    const plate = makePlate();
    const isIllegal = chance(0.5); // Oyuncu asla baştan bilemez!
    const offer = 240 + rand(120);

    return {
      family: "mystery_package",
      categoryTag: "📦 EMANET TEKLİFİ",
      name: p.first,
      role: pick(["İş İnsanı", "Kargo Şoförü", "Özel Araç Sürücüsü"]),
      plate,
      carColor: pick(CAR_COLORS),
      carShape: pick(["sedan", "suv", "van"]),
      look: p.look,
      dumanHint: isIllegal
        ? "🐕 Duman kapalı kutunun kenarını uzun uzun koklayıp geriye doğru iki adım attı."
        : "🐕 Duman kutuyu kokladı, ardından sakinleşip yerine oturdu.",
      speech: `Kolay gelsin! Yarın sabah ortağım gelip alacak, şu kilitli çantayı sabaha kadar ofisinde emanet tutar mısın? Zahmetin için peşin ${offer} ₺ vereyim.`,
      inspections: [
        { label: "🪪 Kimlik & Kartvizit", text: isIllegal ? `🪪 ${p.fullName} • Kartvizitteki şirket adı silik ve telefon numarası eksik.` : `🪪 ${p.fullName} • Kuyumculuk & Antika A.Ş. onaylı ticaret odası kartı, plaka ${plate} ile uyumlu.` },
        { label: "📦 Çantayı İncele", text: isIllegal ? "📦 Çanta anormal ağır; kilit menteşesinde kazınmış yabancı gümrük etiketi artığı var." : "📦 Üzerinde sigortalı kargo barkodu ve 'Kırılabilir Porselen / Saat' etiketi duruyor." },
        { label: "🟣 Peşinat Parası", text: "🟣 Verilen nakit banknotlar mor ışıkta tamamen orijinal." },
        { label: "📱 Telefon Ekranı", text: isIllegal ? "📱 Mesaj: 'Çevirme kalkana kadar o benzinliğe bırak, kimse açmasın.'" : "📱 Mesaj (Kardeşim): 'Uçak rötar yaptı, çantayı güvenilir bir istasyona bırak sabah alayım.'" }
      ],
      questions: [
        { q: "Çantanın içinde tam olarak ne var?", a: isIllegal ? "Özel ticari numune, açıp bakmana gerek yok, paranı peşin veriyorum işte." : "Aile yadigarı antika saat ve sigortalı belgeler var, otel odasında bırakmak istemedim.", mood: isIllegal ? "nervous" : "warm" },
        { q: "Tutanak tutup açıp baksak olur mu?", a: isIllegal ? "Asla! Kilitli kalacak dedim, istemiyorsan kalsın!" : "Tabii, üstündeki sigorta barkodunu not alabilirsin.", mood: isIllegal ? "angry" : "warm" }
      ],
      actions: [
        { id: "accept", label: `📦 EMANET AL (+${offer}₺)`, style: "serve" },
        { id: "inspect_open", label: "🔎 AÇMADAN ALMAM DE", style: "hide" },
        { id: "refuse", label: "🚫 KİBARCA REDDET", style: "lock" },
        { id: "police", label: "🚨 112 POLİSE BİLDİR", style: "police" }
      ],
      resolve(choice) {
        if (choice === "accept") {
          if (!isIllegal) {
            queueFollowUp(2 + rand(2), () => famFollowUpGratefulOwner(p.fullName, offer));
            return {
              status: "good",
              cashDelta: offer,
              repDelta: 10,
              secDelta: 2,
              title: "📦 GÜVENİLİR ESNAF! EMANETİ ALDIN",
              message: `Belgeler ve barkod temizdi! Peşin ${offer} ₺ aldın, sahibi yakında teslim almaya gelecek.`
            };
          }
          queueFollowUp(2 + rand(2), () => famFollowUpPoliceCheck(p.fullName));
          return {
            status: "mixed",
            cashDelta: offer,
            repDelta: -8,
            secDelta: -18,
            title: `💰 PARAYI ALDIN (+${offer}₺) — AMA ÇANTA ŞÜPHELİ!`,
            message: "Gümrük etiketi kazınmış kaçak çantayı ofise aldın! Polis yakında kapını çalabilir..."
          };
        }
        if (choice === "inspect_open") {
          if (isIllegal) {
            return {
              status: "good",
              cashDelta: 110,
              repDelta: 7,
              secDelta: 10,
              title: "🔎 BLÖFÜNÜ BOZDUN!",
              message: "Açıp bakmak isteyince panikleyip çantayı kaptığı gibi kaçtı! İstasyonu beladan kurtardın."
            };
          }
          return {
            status: "good",
            cashDelta: Math.round(offer * 0.7),
            repDelta: 6,
            secDelta: 4,
            title: "✅ TEMİZ ÇIKTI VE ANLAŞTINIZ",
            message: "Sigorta evrakını gösterdi, gönül rahatlığıyla emaneti kabul ettin."
          };
        }
        if (choice === "police") {
          if (isIllegal) {
            return {
              status: "good",
              cashDelta: 190,
              repDelta: 12,
              secDelta: 15,
              title: "🚔 KAÇAK ÇANTA ELE GEÇİRİLDİ!",
              message: "Ekipler çantada kaçak malzeme yakaladı! Emniyetten ödül ve devriye desteği kazandın.",
              effect: { type: "police_patrol", duration: 55, label: "🚔 Polis Devriyesi Aktif" }
            };
          }
          return {
            status: "bad",
            cashDelta: -75,
            repDelta: -12,
            secDelta: -2,
            title: "❌ TEMİZ İŞ İNSANINI İHBAR ETTİN!",
            message: "Çantadan sigortalı antika saat ve resmi fatura çıktı. Gereksiz ihbar itibarını düşürdü."
          };
        }
        return {
          status: "mixed",
          cashDelta: 20,
          repDelta: 1,
          secDelta: 4,
          title: "🚫 RİSK ALMADIN",
          message: "Emanet sorumluluğunu kibarca reddettin, yolcu yakıtını alıp ayrıldı."
        };
      }
    };
  }

  // =========================================================================
  // 2) TUR OTOBÜSÜ / KONVOY ANLAŞMASI (TİCARİ PAZARLIK & BÜYÜK GELİR!)
  // =========================================================================
  function famConvoyDeal(gameState) {
    const p = makePerson(false);
    const plate = makePlate();
    const fuelReq = 180;
    const hasFuel = (gameState.fuelStock || 0) >= fuelReq;
    const baseDeal = 340 + rand(120);

    return {
      family: "convoy_deal",
      categoryTag: "🚌 TİCARİ ANLAŞMA",
      name: `Kaptan ${p.first}`,
      role: "Tur Şirketi Kaptanı",
      plate,
      carColor: "#0284c7",
      carShape: "van",
      look: p.look,
      dumanHint: "🐕 Duman kaptana neşeyle yaklaşıyor, kesinlikle tehlike yok.",
      speech: `Usta arkadan 3 tur otobüsümüz geliyor! Toplu ${fuelReq}L yakıt ve yolculara mola verirsen hemen ${baseDeal} ₺ peşin öderim. Ne dersin?`,
      inspections: [
        { label: "🪪 Tur Şirketi Kartı", text: `🪪 ${p.fullName} • 'Anadolu Ekspres Turizm' resmi kaptan kartı ve sefer belgesi.` },
        { label: "🛢️ Depo Durumun", text: hasFuel ? `🛢️ Ana deponda yeterli yakıt var (${Math.round(gameState.fuelStock)}L). ${fuelReq}L rahatça karşılanır!` : `🛢️ Dikkat! Deponda sadece ${Math.round(gameState.fuelStock)}L var, ${fuelReq}L için yetersiz olabilir!` },
        { label: "🟣 Peşin Ödeme", text: "🟣 Şirket kartı ve nakit avans tamamen gerçek ve onaylı." }
      ],
      questions: [
        { q: "Yolcular market ve restorana da uğrar mı?", a: "Kesinlikle! 120 aç yolcu var, restoranın ve marketin coşar!", mood: "warm" },
        { q: "Fiyatı biraz yukarı çekebilir miyiz?", a: "Hizmetin hızlıysa ekstra bahşiş koparabilirim ama fazla zorlarsan yan istasyona gideriz.", mood: "neutral" }
      ],
      actions: [
        { id: "deal", label: `🚌 ANLAŞMAYI YAP (+${baseDeal}₺)`, style: "serve" },
        { id: "haggle", label: "💬 PAZARLIK YAP (+%30 İSTE)", style: "hide" },
        { id: "mola_only", label: "🍽️ SADECE MOLA VER (+140₺)", style: "lock" },
        { id: "decline", label: "🚫 KAPASİTE DOLU DE", style: "police" }
      ],
      resolve(choice) {
        if (choice === "deal") {
          if (!hasFuel) {
            return {
              status: "bad",
              cashDelta: -40,
              repDelta: -8,
              secDelta: 0,
              title: "🛢️ YAKIT YETMEDİ!",
              message: "Anlaşmayı kabul ettin ama ana depoda 180L yakıt yoktu! Konvoy yarıda başka istasyona geçti."
            };
          }
          return {
            status: "good",
            cashDelta: baseDeal,
            fuelDelta: -fuelReq,
            repDelta: 12,
            secDelta: 3,
            title: "🚌 KONVOY ANLAŞMASI MÜKEMMEL GEÇTİ!",
            message: `3 otobüs dolusu yolcu istasyonunu doldurdu! +${baseDeal} ₺ net gelir ve VIP hareketliliği başladı!`,
            effect: { type: "vip_rush", duration: 50, label: "🌟 Tur Konvoyu: VIP Akını (+%40)" }
          };
        }
        if (choice === "haggle") {
          if (!hasFuel) {
            return { status: "bad", cashDelta: -30, repDelta: -6, secDelta: 0, title: "🛢️ DEPO YETERSİZ", message: "Hem yüksek fiyat istedin hem yakıt yetmedi!" };
          }
          if (chance(0.58)) {
            const bigPay = Math.round(baseDeal * 1.3);
            return {
              status: "good",
              cashDelta: bigPay,
              fuelDelta: -fuelReq,
              repDelta: 10,
              secDelta: 2,
              title: `🤝 PAZARLIK TUTTU! (+${bigPay} ₺)`,
              message: "Kaptan fiyatı kabul etti! Harika bir ticari hamle yaptın!",
              effect: { type: "vip_rush", duration: 40, label: "🌟 Konvoy Bahşiş Akını" }
            };
          }
          return {
            status: "mixed",
            cashDelta: 0,
            repDelta: -3,
            secDelta: 0,
            title: "😅 PAZARLIK FAZLA GELDİ",
            message: "Kaptan fiyatı yüksek bulup 5 km ilerideki istasyona devam etti."
          };
        }
        if (choice === "mola_only") {
          return {
            status: "good",
            cashDelta: 140,
            repDelta: 6,
            secDelta: 2,
            title: "🍽️ SADECE MOLA VERDİLER (+140 ₺)",
            message: "Yakıt harcamadan market ve yemek molasından temiz gelir elde ettin!"
          };
        }
        return {
          status: "mixed",
          cashDelta: 0,
          repDelta: -2,
          secDelta: 0,
          title: "🚫 KONVOYU ÇEVİRDİN",
          message: "Kaptan teşekkür edip yoluna devam etti."
        };
      }
    };
  }

  // =========================================================================
  // 3) KART ÇEKMEDİ / VERESİYE İKİLEMİ (GERÇEK DÜRÜST MÜ, KAÇAKÇI MI?)
  // =========================================================================
  function famCardDeclined() {
    const p = makePerson();
    const plate = makePlate();
    const isHonest = chance(0.55);
    const fuelCost = 110 + rand(60);

    return {
      family: "card_declined",
      categoryTag: "💳 ÖDEME SORUNU",
      name: p.first,
      role: pick(["Üniversiteli", "Esnaf", "Sağlık Çalışanı", "Gece Yolcusu"]),
      plate,
      carColor: pick(CAR_COLORS),
      carShape: pick(["sedan", "suv", "taxi"]),
      look: p.look,
      dumanHint: isHonest
        ? "🐕 Duman sürücünün utangaç ve gergin halini sezdi ama saldırgan değil."
        : "🐕 Duman arabanın açık çalışan motoruna doğru huzursuzca havladı!",
      speech: `Abi çok mahcubum... Banka kartım az önce limit hatası verdi, cebimde nakit de yok ama depom sıfır! ${fuelCost} liralık yakıtı veresiye yazsan yarın iki katıyla getirsem olur mu?`,
      inspections: [
        { label: "🪪 Kimlik & Adres", text: isHonest ? `🪪 ${p.fullName} • Bu ilçede ikamet ediyor, plaka ${plate} kendi adına kayıtlı.` : `🪪 Kimliğini 'evde unuttum' diyor; ruhsatta başka bir şehir ve kiralık araç kaşesi var.` },
        { label: "📱 Banka Uygulaması", text: isHonest ? "📱 Ekranda gerçekten 'Banka sistem bakımı 02:00-03:00 arası işlem yapılamıyor' uyarısı var." : "📱 Telefonu hızlıca kapatıp cebine attı, ekranı göstermekten kaçındı." },
        { label: "🔦 Araç İçi", text: isHonest ? "🔦 Ön koltukta okul/iş dosyaları ve bu bölgenin belediye abonman kartı." : "🔦 Motor hâlâ çalışır durumda, vites D konumunda kaçmaya hazır bekliyor!" }
      ],
      questions: [
        { q: "Telefon numaranızı ve kimlik bilginizi bırakır mısınız?", a: isHonest ? "Tabii ki! Hemen yaz numaramı, hatta çaldır gör. Söz yarın buradayım." : "Ya ne gerek var evrak işine, bir iyilik yapacaksın işte!", mood: isHonest ? "warm" : "angry" },
        { q: "Aracın motorunu neden kapatmadınız?", a: isHonest ? "Akü zayıf abi, stop ederse çalışmıyor diye açık bıraktım." : "Sana ne benim motorumdan, verecek misin vermeyecek misin?", mood: isHonest ? "nervous" : "angry" }
      ],
      actions: [
        { id: "trust", label: `🤝 GÜVEN & VERESİYE VER`, style: "serve" },
        { id: "collateral", label: "⌚ REHİN / İMZA AL", style: "hide" },
        { id: "refuse", label: "🚫 NAKİTSİZ VEREMEM DE", style: "lock" },
        { id: "police", label: "🚨 PLAKAYI POLİSE BİLDİR", style: "police" }
      ],
      resolve(choice) {
        if (choice === "trust") {
          if (isHonest) {
            queueFollowUp(2 + rand(2), () => famFollowUpDebtRepaid(p.fullName, fuelCost * 2));
            return {
              status: "good",
              cashDelta: 0,
              repDelta: 12,
              secDelta: 2,
              title: "🤝 GÜVENİP YAKIT VERDİN!",
              message: `${p.first} minnetle teşekkür etti. Bakalım sözünü tutup geri gelecek mi...`
            };
          }
          return {
            status: "bad",
            cashDelta: -fuelCost,
            repDelta: -4,
            secDelta: -8,
            title: "💨 GAZA BASIP KAÇTI!",
            message: `Kimliği olmayan dolandırıcı depoyu doldurur doldurmaz lastik yakarak kaçtı (-${fuelCost} ₺)!`
          };
        }
        if (choice === "collateral") {
          if (isHonest) {
            return {
              status: "good",
              cashDelta: fuelCost + 35,
              repDelta: 6,
              secDelta: 5,
              title: "📝 İMZA VE GÜVENCE İLE HALLETTİN",
              message: "Dürüst yolcu memnuniyetle tutanak imzalayıp 1 saat sonra EFT ile fazlasıyla ödedi!"
            };
          }
          return {
            status: "good",
            cashDelta: 60,
            repDelta: 4,
            secDelta: 8,
            title: "🛡️ DOLANDIRICIYI KAÇIRDIN!",
            message: "Kimlik ve imza isteyince bahaneler uydurup yakıt almadan istasyondan çıktı!"
          };
        }
        if (choice === "police") {
          if (!isHonest) {
            return {
              status: "good",
              cashDelta: 140,
              repDelta: 7,
              secDelta: 11,
              title: "🚔 YAKIT HIRSIZI YAKALANDI!",
              message: "Polis sorgusunda bu aracın son 3 istasyondan bedava yakıt alıp kaçtığı ortaya çıktı!"
            };
          }
          return {
            status: "bad",
            cashDelta: -50,
            repDelta: -11,
            secDelta: 0,
            title: "❌ MAĞDUR VATANDAŞA POLİS ÇAĞIRDIN",
            message: "Banka bakımı yüzünden zor durumda kalan dürüst vatandaşı rezil ettin."
          };
        }
        return {
          status: "mixed",
          cashDelta: 0,
          repDelta: isHonest ? -4 : 3,
          secDelta: 3,
          title: "🚫 KURALI UYGULADIN",
          message: "Nakit veya geçerli kart olmadan yakıt veremeyeceğini söyledin."
        };
      }
    };
  }

  // =========================================================================
  // 4) ŞEHİR / SAAT ÇELİŞKİSİ DEDEKTİFLİĞİ (ZAMAN ÇİZELGESİ ANALİZİ!)
  // =========================================================================
  function famTimelineDetective() {
    const p = makePerson();
    const cityClaim = pick(CITIES.slice(0, 6));
    const cityReal = pick(CITIES.slice(6));
    const plate = makePlate(cityClaim);
    const isLying = chance(0.6);

    return {
      family: "timeline_detective",
      categoryTag: "🕒 ROTA & ZAMAN ANALİZİ",
      name: p.first,
      role: pick(ROLES),
      plate,
      carColor: pick(CAR_COLORS),
      carShape: pick(["sedan", "suv", "sport"]),
      look: p.look,
      dumanHint: isLying
        ? "🐕 Duman çamurlu lastikleri koklayıp huzursuzca inledi."
        : "🐕 Duman sakin duruyor.",
      speech: `Selamlar! Az önce 40 dakika önce ${cityClaim.name} merkezden çıktım, hiç durmadan buraya geldim. Depoyu fulleyelim mi?`,
      inspections: [
        { label: "🧾 Otoyol Geçiş Fişi", text: isLying ? `🧾 Torpidodaki son gişe fişi: 3 saat önce ${cityReal.name} sınır kapısından geçilmiş!` : `🧾 Torpidodaki son gişe fişi: 38 dakika önce ${cityClaim.name} çıkışı (Söylediğiyle birebir tutarlı!).` },
        { label: "🔦 Bagaj & Çamur", text: isLying ? "🔦 Bagajda ıslak orman çamurlu kürek, kesilmiş tel örgü parçası ve 2 ağır çuval!" : "🔦 Bagajda tertemiz valiz, bilgisayar çantası ve hediye paketi." },
        { label: "🪪 Ehliyet & Ruhsat", text: `🪪 ${p.fullName} (${p.birthYear}) • Plaka: ${plate}` },
        { label: "🟣 Ödeme Parası", text: "🟣 200 ₺ Banknot mor ışıkta orijinal." }
      ],
      questions: [
        { q: "Yolda hiç başka şehre veya ara yola saptınız mı?", a: isLying ? "Hayır kesinlikle! Direkt otobandan geldim diyorum, niye sordun ki?" : `Hayır, ${cityClaim.name} gişelerinden çıkıp direkt buraya geldim.`, mood: isLying ? "nervous" : "warm" },
        { q: "Aracınız neden bu kadar çamurlu?", a: isLying ? "Şey... otobanda yol çalışması vardı herhalde!" : "Az önce hafif çiseledi, o kadar.", mood: isLying ? "angry" : "neutral" }
      ],
      actions: [
        { id: "serve", label: "✅ YAKIT VER & GÖNDER", style: "serve" },
        { id: "confront", label: "🧾 FİŞİ YÜZÜNE SOR", style: "hide" },
        { id: "lock", label: "🔒 POMPAYI KAPAT", style: "lock" },
        { id: "police", label: "🚨 112 POLİS ÇAĞIR", style: "police" }
      ],
      resolve(choice) {
        if (choice === "confront") {
          if (isLying) {
            return {
              status: "good",
              cashDelta: 150,
              repDelta: 9,
              secDelta: 12,
              title: "🕵️ YALAN ROTAYI YÜZÜNE VURDUN!",
              message: `${cityReal.name} fişini sorunca kekeleyip panikledi; güvenlik kamerasıyla plakayı polise ilettin!`
            };
          }
          return {
            status: "good",
            cashDelta: 105,
            repDelta: 5,
            secDelta: 3,
            title: "✅ ROTA TAMAMEN DOĞRU ÇIKTI",
            message: "Fiş ve saat tutarlıydı; gülümseyerek yakıtını alıp bahşiş bıraktı."
          };
        }
        if (choice === "police") {
          if (isLying) {
            return {
              status: "good",
              cashDelta: 185,
              repDelta: 11,
              secDelta: 15,
              title: "🚔 YALAN BEYANLI KAÇAKÇI YAKALANDI!",
              message: "Gişe fişindeki rota çelişkisini yakaladın! Bagajdaki çalıntı kablolarla suçüstü yapıldı!"
            };
          }
          return {
            status: "bad",
            cashDelta: -85,
            repDelta: -12,
            secDelta: -2,
            title: "❌ MASUM YOLCUYU POLİSE VERDİN!",
            message: `${cityClaim.name} fişi ve saati söyledikleriyle tamamen uyumluydu!`
          };
        }
        if (choice === "serve") {
          if (!isLying) {
            return { status: "good", cashDelta: 115, repDelta: 7, secDelta: 2, title: "✅ TEMİZ YOLCU MEMNUN!", message: "Tüm bilgiler tutarlıydı, teşekkür edip bahşiş bıraktı." };
          }
          return { status: "bad", cashDelta: -95, repDelta: -6, secDelta: -12, title: "❌ ÇELİŞKİYİ KAÇIRDIN!", message: `${cityClaim.name} dedi ama fişi ${cityReal.name} çıktı! Kaçakçı elinden kaçtı.` };
        }
        return {
          status: isLying ? "good" : "bad",
          cashDelta: isLying ? 80 : -65,
          repDelta: isLying ? 4 : -8,
          secDelta: isLying ? 7 : -2,
          title: isLying ? "🔒 ŞÜPHELİYİ KOVDUN" : "❌ DÜRÜST MÜŞTERİYİ KOVDUN",
          message: isLying ? "Rota yalanını sezdin ve yakıt vermedin." : "Evrakları temiz bir yolcuyu sebepsiz çevirdin."
        };
      }
    };
  }

  // =========================================================================
  // 5) SAHADA TARTIŞAN İKİ SÜRÜCÜ KRİZİ (ARABULUCULUK!)
  // =========================================================================
  function famParkingDispute() {
    const p1 = makePerson();
    const p2 = makePerson();
    const plate = makePlate();
    const p1Fault = chance(0.5);

    return {
      family: "parking_dispute",
      categoryTag: "⚡ İSTASYON KRİZİ",
      name: `${p1.first} & ${p2.first}`,
      role: "Pompa Sırası Tartışması",
      plate,
      carColor: "#ef4444",
      carShape: "sport",
      look: p1.look,
      dumanHint: "🐕 Duman iki sürücünün arasında durup havlayarak kavgayı engelliyor!",
      speech: `İstasyon sahibi buraya gel! Bu adam (${p2.first}) pompanın önünde tamponuma sürttü, şimdi de inkar ediyor! Ya zararımı ödesin ya ortalık karışır!`,
      inspections: [
        { label: "📹 İstasyon Kamerası", text: p1Fault ? `📹 Kayıtta ${p1.first}'in hızlıca şerit değiştirip ${p2.first}'in önüne kırdığı net görünüyor!` : `📹 Kayıtta ${p2.first}'in telefonla oynarken geri geri gelip ${p1.first}'e dokunduğu açıkça görünüyor!` },
        { label: "🚗 Hasar Kontrolü", text: "🚗 Sadece plastik tamponda ufak bir boya çiziği var, büyük hasar yok." },
        { label: "💬 Görgü Tanığı", text: "💬 Market önündeki müşteri de kamera kaydına bakılmasını öneriyor." }
      ],
      questions: [
        { q: "Kamera kaydına birlikte bakalım mı?", a: p1Fault ? "Ne kamerası ya, ben haklıyım işte! İkram kahve ver geçelim." : "Lütfen bakın! Ben sıramda bekliyordum, o çarptı!", mood: p1Fault ? "nervous" : "warm" }
      ],
      actions: [
        { id: "camera_truth", label: "📹 KAMERAYLA HAKLIYI BUL", style: "serve" },
        { id: "coffee_peace", label: "☕ ÇAY İKRAM ET & BARIŞTIR", style: "hide" },
        { id: "kick_both", label: "🔒 İKİSİNİ DE ÇIKAR", style: "lock" },
        { id: "police", label: "🚨 TRAFİK POLİSİ ÇAĞIR", style: "police" }
      ],
      resolve(choice) {
        if (choice === "camera_truth") {
          return {
            status: "good",
            cashDelta: 150,
            repDelta: 14,
            secDelta: 10,
            title: "📹 ADALETLİ ÇÖZÜM! İSTASYON ALKIŞLANDI",
            message: `Kamera gerçeği ortaya çıkardı (${p1Fault ? p1.first : p2.first} hatalı çıktı). Herkes adaletine hayran kaldı!`,
            effect: { type: "vip_rush", duration: 40, label: "🌟 Güvenilir İstasyon: VIP Akını" }
          };
        }
        if (choice === "coffee_peace") {
          return {
            status: "good",
            cashDelta: 95,
            repDelta: 10,
            secDelta: 6,
            title: "☕ TATLI DİLLE BARIŞTIRDİN",
            message: "İkisine sıcak çay ikram ettin, el sıkışıp yakıtlarını alıp gittiler!"
          };
        }
        if (choice === "police") {
          return {
            status: "mixed",
            cashDelta: 50,
            repDelta: 3,
            secDelta: 12,
            title: "🚔 TRAFİK EKİBİ TUTANAK TUTTU",
            message: "Kavga büyümeden polis tutanak tuttu, istasyon güvenliği arttı."
          };
        }
        return {
          status: "bad",
          cashDelta: -40,
          repDelta: -9,
          secDelta: 2,
          title: "🔒 İKİSİNİ DE KOVDUN",
          message: "Haklı olan müşteri çok sinirlendi ve istasyona kötü puan verdi."
        };
      }
    };
  }

  // =========================================================================
  // 6) YOLDA KALMIŞ LÜKS ARAÇ (TAMİR & YEDEK PARÇA FIRSATI!)
  // =========================================================================
  function famStrandedLuxury() {
    const p = makePerson();
    const plate = makePlate();
    const bigTip = 220 + rand(130);

    return {
      family: "stranded_luxury",
      categoryTag: "🔧 ACİL ARIZA FIRSATI",
      name: p.first,
      role: "Lüks Spor Araç Sürücüsü",
      plate,
      carColor: "#f59e0b",
      carShape: "sport",
      look: p.look,
      dumanHint: "🐕 Duman kaputtan çıkan hafif buhara bakıp kenara çekildi.",
      speech: `İyi ki açıksınız! Radyatör hortumu gevşemiş, hararet yükseldi. Önemli bir iş yemeğine yetişeceğim; hemen su + kelepçe takıp halledersen ${bigTip} ₺ bahşiş bırakırım!`,
      inspections: [
        { label: "🔧 Kaput Altı", text: "🔧 Gerçekten sadece radyatör kelepçesi gevşemiş ve suyu eksilmiş — 5 dakikalık kolay iş!" },
        { label: "🪪 Kimlik & Plaka", text: `🪪 ${p.fullName} • Plaka: ${plate} • Temiz kayıt.` },
        { label: "🟣 Cüzdan", text: "🟣 Orijinal banknotlar hazır." }
      ],
      questions: [
        { q: "Çekici çağırmak ister misiniz?", a: "Çekici 2 saat sürer! Ufak bir kelepçe ve antifrizle hallolur, parasını fazlasıyla vereceğim!", mood: "nervous" }
      ],
      actions: [
        { id: "quick_fix", label: `🔧 HEMEN TAMİR ET (+${bigTip}₺)`, style: "serve" },
        { id: "sell_parts", label: "🛒 ANTİFRİZ SAT (+110₺)", style: "hide" },
        { id: "tow_truck", label: "🚚 ÇEKİCİ ÇAĞIR (+70₺)", style: "lock" },
        { id: "refuse", label: "🚫 UĞRAŞAMAM DE", style: "police" }
      ],
      resolve(choice) {
        if (choice === "quick_fix") {
          return {
            status: "good",
            cashDelta: bigTip,
            repDelta: 13,
            secDelta: 2,
            title: `🔧 HIZIR GİBİ YETİŞTİN! (+${bigTip} ₺)`,
            message: "5 dakikada harareti çözdün! VIP sürücü çevresine istasyonunu övdü!",
            effect: { type: "vip_rush", duration: 45, label: "🌟 VIP Tavsiyesi: +%40 Bahşiş" }
          };
        }
        if (choice === "sell_parts") {
          return {
            status: "good",
            cashDelta: 110,
            repDelta: 5,
            secDelta: 0,
            title: "🛒 ANTİFRİZ & KELEPÇE SATTIN",
            message: "Sürücü kendisi halledip yola devam etti."
          };
        }
        if (choice === "tow_truck") {
          return {
            status: "mixed",
            cashDelta: 70,
            repDelta: 3,
            secDelta: 2,
            title: "🚚 ÇEKİCİ KOMİSYONU (+70 ₺)",
            message: "Anlaşmalı çekici geldi, araç güvenle alındı."
          };
        }
        return {
          status: "bad",
          cashDelta: 0,
          repDelta: -10,
          secDelta: 0,
          title: "❌ YARDIM ETMEDİN",
          message: "Zor durumdaki VIP müşteri hayal kırıklığıyla ayrıldı."
        };
      }
    };
  }

  // =========================================================================
  // 7) TERS KÖŞE: SAHTE MAĞDUR vs GERÇEK MAĞDUR (AYNI SÖZLER, FARKLI İPUCU!)
  // =========================================================================
  function famShelterPlea() {
    const p = makePerson(chance(0.65));
    const plate = makePlate();
    const wrongPlate = mutatePlate(plate);
    const isTrap = chance(0.5); // 50/50 GERÇEK MAĞDUR VEYA HIRSIZ!

    return {
      family: "shelter_plea",
      categoryTag: "🚨 ACİL SIĞINMA TALEBİ",
      name: p.first,
      role: "Gece Yolcusu",
      plate,
      carColor: pick(["#e2e8f0", "#cbd5e1", "#0ea5e9", "#dc2626"]),
      carShape: "sedan",
      look: p.look,
      dumanHint: isTrap
        ? "🐕 Duman ofis kapısının önünde durup sürücüye sertçe hırlıyor!"
        : "🐕 Duman sürücünün korkusunu hissedip koruyucu biçimde yanına sokuldu.",
      speech: `Ne olur yardım edin! Yolda tehlikeli bir araç beni takip ediyor, çok korkuyorum! Polis gelene kadar ofiste biraz saklanabilir miyim?`,
      inspections: [
        { label: "🪪 Kimlik & Ruhsat", text: isTrap ? `🪪 ${p.fullName} • Ruhsat plakası ${wrongPlate} görünüyor (araçtaki ${plate} ile farklı!).` : `🪪 ${p.fullName} (${p.birthYear}) • Plaka ${plate} kendi üzerine kayıtlı.` },
        { label: "🔦 Bagaj", text: isTrap ? "🔦 Bagajda kar maskesi, maymuncuk takımı ve boş büyük siyah sırt çantası!" : "🔦 Bagajda alelacele toplanmış kıyafet valizi, su ve ilaç kutusu." },
        { label: "📱 Telefon Ekranı", text: isTrap ? "📱 Mesaj (Ortak): 'Korkmuş rolü yap, ofise girince kasayı boşalt, dışarıda bekliyorum.'" : "📱 Mesaj (112 Acil): 'Aydınlık bir istasyona sığının, devriye ekibimiz 6 dakikaya orada!'" }
      ],
      questions: [
        { q: "112 Polis çağıralım, hemen gelsinler?", a: isTrap ? "HAYIR! Polis çağırma sakın, sadece arka odaya geçeyim yeter!" : "Evet lütfen çağırın, gelene kadar burada bekleyeyim!", mood: isTrap ? "angry" : "nervous" },
        { q: "Bagajda neden o eşyalar var?", a: isTrap ? "Şimdi bagajın sırası mı, aç şu ofis kapısını!" : "Evden aceleyle çıkarken ne bulduysam valize attım.", mood: "nervous" }
      ],
      actions: [
        { id: "hide", label: "🤫 OFİSTE SAKLA", style: "hide" },
        { id: "police", label: "🚨 112 POLİS ÇAĞIR", style: "police" },
        { id: "lock", label: "🔒 KAPIYI KİLİTLE & KOV", style: "lock" },
        { id: "serve", label: "⛽ YAKIT VER GÖNDER", style: "serve" }
      ],
      resolve(choice) {
        if (isTrap) {
          if (choice === "police") return { status: "good", cashDelta: 185, repDelta: 11, secDelta: 15, title: "🚔 SAHTE MAĞDUR SOYGUNCUSU YAKALANDI!", message: "İpuçlarına bakıp tuzağı bozdun! Kasa soyulmaktan kurtuldu!" };
          if (choice === "lock") return { status: "good", cashDelta: 95, repDelta: 5, secDelta: 8, title: "🔒 TUZAĞI ENGELLEDİN!", message: "Hırsızı ofise sokmadın, eli boş kaçtı." };
          if (choice === "hide") return { status: "bad", cashDelta: -190, repDelta: -10, secDelta: -18, title: "🚨 KASA SOYULDU! (-190 ₺)", message: "İçeri aldığın kişi mağdur değil hırsızdı! Kasadan 190 ₺ çalıp kaçtı!" };
          return { status: "bad", cashDelta: -85, repDelta: -6, secDelta: -10, title: "❌ HIRSIZA YAKIT VERDİN", message: "Sahte plakalı soyguncuyu fark etmeden gönderdin." };
        } else {
          if (choice === "hide" || choice === "police") {
            return {
              status: "good",
              cashDelta: 150,
              repDelta: 13,
              secDelta: 9,
              title: "🛡️ MAĞDURU GÜVENLE KURTARDIN!",
              message: `${p.first} güvenle korundu ve polis/ailesine teslim edildi! Harika bir itibar kazandın!`,
              effect: { type: "vip_rush", duration: 40, label: "🌟 Kahraman İstasyon: VIP Akını" }
            };
          }
          return { status: "bad", cashDelta: -75, repDelta: -15, secDelta: -8, title: "❌ GERÇEK MAĞDURU GERİ ÇEVİRDİN!", message: "112 mesajı ve evrakları tamamen gerçekti; çaresiz yolcuyu karanlığa yolladın." };
        }
      }
    };
  }

  // =========================================================================
  // 8) TERS KÖŞE: TEKNİSYEN vs SABOTAJCI (AYNI KILIF, 50/50!)
  // =========================================================================
  function famTechnicianVisit() {
    const p = makePerson();
    const plate = makePlate();
    const isSaboteur = chance(0.5);

    return {
      family: "technician_visit",
      categoryTag: "⚡ TEKNİK KONTROL",
      name: p.first,
      role: "Elektrik / Hat Teknisyeni",
      plate,
      carColor: "#f59e0b",
      carShape: "van",
      look: p.look,
      dumanHint: isSaboteur
        ? "🐕 Duman alet çantasına doğru şiddetle havlıyor!"
        : "🐕 Duman alet çantasını koklayıp hemen sakinleşti.",
      speech: "Kolay gelsin! 50 liralık yakıt alacağım, bir de bölgede voltaj dalgalanması bildirimi var; senin elektrik panosuna ve ana depoya kısa bir bakım yapayım.",
      inspections: [
        { label: "🪪 Görev Kartı", text: isSaboteur ? `🪪 ${p.fullName} • Kurum görev kartı YOK! Sadece eski bir kişisel ehliyet.` : `🪪 ${p.fullName} • Barkodlu Resmi Dağıtım Şirketi Teknisyen Kartı (2026 Geçerli).` },
        { label: "🔦 Arka Kasa", text: isSaboteur ? "🔦 Kalın tel keski, etiketsiz yelek ve şekerli su dolu bidonlar!" : "🔦 Mühürlü dijital voltmetre, yalıtımlı eldiven ve onaylı bakım iş emri." },
        { label: "📱 İş Emri Mesajı", text: isSaboteur ? "📱 Mesaj (Rakip): 'Şalteri boz, yakıt deposuna karışımı dök, bu gece müşteri bize aksın!'" : "📱 Mesaj (Merkez): 'Son İstasyon rutin hat bakımı onaylandı — İş Emri #7419.'" }
      ],
      questions: [
        { q: "Resmi görev emrinizi görebilir miyim?", a: isSaboteur ? "Acil çıktık kağıt merkezde kaldı, 2 dakikada bakıp çıkacağım uzatma!" : "Tabii buyurun, barkodlu kartım ve iş emri numaram burada.", mood: isSaboteur ? "angry" : "warm" }
      ],
      actions: [
        { id: "allow", label: "⚡ BAKIMA İZİN VER", style: "serve" },
        { id: "fuel_only", label: "⛽ SADECE YAKIT VER", style: "hide" },
        { id: "kick", label: "🔒 İSTASYONDAN KOV", style: "lock" },
        { id: "police", label: "🚨 112 POLİS ÇAĞIR", style: "police" }
      ],
      resolve(choice) {
        if (isSaboteur) {
          if (choice === "police") return { status: "good", cashDelta: 190, repDelta: 10, secDelta: 15, title: "🚔 SABOTAJCI SUÇÜSTÜ YAKALANDI!", message: "Rakibin gönderdiği sahte teknisyeni panoya ulaşmadan yakalattın!" };
          if (choice === "kick" || choice === "fuel_only") return { status: "good", cashDelta: 90, repDelta: 5, secDelta: 8, title: "🔒 SABOTAJI ÖNLEDİN!", message: "Panoya yaklaştırmadın, istasyon güvende kaldı." };
          return {
            status: "bad",
            cashDelta: -120,
            repDelta: -8,
            secDelta: -16,
            title: "⚡ SABOTAJA UĞRADIN!",
            message: "Sahte teknisyen şalteri bozup kaçtı! Hemen Market önünden sigortayı aç!",
            effect: { type: "power_outage", label: "⚡ ELEKTRİK KESİNTİSİ! Marketten Aç!" }
          };
        } else {
          if (choice === "allow") return { status: "good", cashDelta: 130, repDelta: 9, secDelta: 12, title: "⚡ HAT BAKIMI TAMAMLANDI!", message: "Gerçek teknisyen elektrik hattını güçlendirdi; ücretsiz bakım ve güvenlik artışı kazandın!" };
          if (choice === "fuel_only") return { status: "mixed", cashDelta: 65, repDelta: 2, secDelta: 2, title: "⛽ SADECE YAKIT ALDI", message: "Temkinli davrandın ama ücretsiz hat bakımını kaçırdın." };
          return { status: "bad", cashDelta: -65, repDelta: -10, secDelta: -4, title: "❌ RESMİ TEKNİSYENİ KOVDUN!", message: "Barkodlu görev kartı ve iş emri gerçekti; boşuna geri çevirdin." };
        }
      }
    };
  }

  // =========================================================================
  // 9) UCUZ TOPLU YAKIT TEKLİFİ (KAÇAK MAZOT MU, FIRSAT MI?)
  // =========================================================================
  function famCheapFuelOffer() {
    const p = makePerson(false);
    const plate = makePlate();
    const isAdulterated = chance(0.5); // 50/50 temiz fazla stok vs karışık kaçak yakıt!
    const price = 140;

    return {
      family: "cheap_fuel_offer",
      categoryTag: "🛢️ YAKIT TEDARİK FIRSATI",
      name: p.first,
      role: "Tanker Şoförü",
      plate,
      carColor: "#ea580c",
      carShape: "truck",
      look: p.look,
      dumanHint: isAdulterated
        ? "🐕 Duman tanker vanasından gelen ağır solvent kokusuna burnunu çevirdi!"
        : "🐕 Duman normal yakıt kokusuna sakin tepki verdi.",
      speech: `Selam usta! İlerideki tesis kapandığı için tankerde 600 Litre temiz mazot arttı. Normalde çok daha pahalı ama sadece ${price} ₺'ye depona basıp geçeyim mi?`,
      inspections: [
        { label: "🧾 İrsaliye & Fatura", text: isAdulterated ? "🧾 İrsaliye yok! 'Faturasız elden vereceğim' diyor." : `🧾 Resmi rafineri çıkış irsaliyesi ve kalite analiz belgesi mühürlü! Plaka: ${plate}.` },
        { label: "🧪 Numune Kontrolü", text: isAdulterated ? "🧪 Yakıt rengi bulanık koyu, ağır tiner/solvent kokuyor (motor bozucu karışım!)." : "🧪 Berrak, standart temiz dizel görünümü ve kokusu." },
        { label: "🪪 Sürücü Belgesi", text: `🪪 ${p.fullName} • ${isAdulterated ? "Tehlikeli madde taşıma belgesi süresi dolmuş." : "SRC5 resmi yakıt taşıma belgesi güncel."}` }
      ],
      questions: [
        { q: "Kalite analiz raporu ve faturanız var mı?", a: isAdulterated ? "Bu fiyata fatura mı soruyorsun birader, işine gelirse!" : "Evet rafineri mühürlü faturam hazır, hemen kesebilirim.", mood: isAdulterated ? "angry" : "warm" }
      ],
      actions: [
        { id: "buy", label: `🛢️ 600L SATIN AL (-${price}₺)`, style: "serve" },
        { id: "sample", label: "🧪 ÖNCE TEST ET", style: "hide" },
        { id: "refuse", label: "🚫 İSTEMEM DE", style: "lock" },
        { id: "police", label: "🚨 KAÇAK YAKIT İHBARI", style: "police" }
      ],
      resolve(choice) {
        if (choice === "buy") {
          if (!isAdulterated) {
            return {
              status: "good",
              cashDelta: -price,
              fuelDelta: 600,
              repDelta: 6,
              secDelta: 2,
              title: "🛢️ HARİKA FIRSAT! +600L TEMİZ YAKIT!",
              message: "Resmi faturalı temiz yakıtı çok ucuza kaptın! Ana depona 600 Litre eklendi!"
            };
          }
          return {
            status: "bad",
            cashDelta: -(price + 140),
            repDelta: -16,
            secDelta: -10,
            title: "💀 KAÇAK KARIŞIK MAZOT ALDIN!",
            message: "Solventli yakıt müşterilerin motorunu tekletince şikayet yağdı! Tazminat ödedin ve itibar düştü!",
            effect: { type: "slow_traffic", duration: 35, label: "📉 Bozuk Yakıt Skandalı: Trafik Düştü" }
          };
        }
        if (choice === "sample") {
          if (isAdulterated) return { status: "good", cashDelta: 90, repDelta: 6, secDelta: 8, title: "🧪 TESTTE HİLEYİ YAKALADIN!", message: "Solvent karışımını anlayınca şoför hemen kaçtı!" };
          return { status: "good", cashDelta: -price, fuelDelta: 600, repDelta: 8, secDelta: 4, title: "🧪 TEST TEMİZ! +600L ALDIN!", message: "Numune tertemiz çıktı, güvenle 600L yakıtı ucuza aldın!" };
        }
        if (choice === "police") {
          if (isAdulterated) {
            return {
              status: "good",
              cashDelta: 195,
              repDelta: 12,
              secDelta: 15,
              title: "🚔 KAÇAK AKARYAKIT TANKERİ YAKALANDI!",
              message: "Ekipler kaçak solventli yakıta el koydu! Sana sonraki tankerde %40 devlet indirimi verildi!",
              effect: { type: "tanker_discount", label: "⛽ Ödül: Sonraki Tanker %40 İndirimli!" }
            };
          }
          return { status: "bad", cashDelta: -70, repDelta: -10, secDelta: -2, title: "❌ YASAL TEDARİKÇİYİ İHBAR ETTİN", message: "Faturalı ve rafineri mühürlü temiz tankerdi!" };
        }
        return { status: "mixed", cashDelta: 0, repDelta: 0, secDelta: 3, title: "🚫 TEKLİFİ REDDETTİN", message: "Kendi standart tankerinden şaşmadın." };
      }
    };
  }

  // =========================================================================
  // 10) SAHTE PARA vs GERÇEK VIP (AYNI NAKİT 200'LÜK SENARYOSU!)
  // =========================================================================
  function famCashInspection() {
    const p = makePerson();
    const plate = makePlate();
    const isFake = chance(0.55);

    return {
      family: "cash_inspection",
      categoryTag: "💵 NAKİT KONTROLÜ",
      name: p.first,
      role: pick(ROLES),
      plate,
      carColor: pick(CAR_COLORS),
      carShape: pick(["sedan", "suv", "sport"]),
      look: p.look,
      dumanHint: isFake
        ? "🐕 Duman uzatılan paradan gelen ağır kimyasal mürekkep kokusuna hapşırdı."
        : "🐕 Duman gayet sakin duruyor.",
      speech: `İyi geceler! Depoyu fulleyelim, nakit 200'lük uzatıyorum. Para üstünü de hızlıca verebilirsen çok makbule geçer.`,
      inspections: [
        { label: "🟣 Mor Işık Kontrolü", text: isFake ? "🟣 Kağıt aşırı parlak ve kaygan; mor ışıkta güvenlik şeridi parlamıyor, iki banknotun seri numarası aynı!" : "🟣 Mat pamuklu kağıt, kabartma belirgin, mor ışıkta güvenlik şeridi ve filigran net parlıyor." },
        { label: "🪪 Ehliyet & Plaka", text: `🪪 ${p.fullName} (${p.birthYear}) • Plaka: ${plate}` },
        { label: "🔦 Bagaj", text: isFake ? "🔦 Kapalı karton kutular, maket bıçağı ve renkli toner kartuşları." : "🔦 Temiz bavul, laptop çantası ve gezi dergileri." }
      ],
      questions: [
        { q: "Kartla ödeme yapabilir misiniz?", a: isFake ? "Kartım yanımda değil, şu nakidi al uzatma kardeşim!" : "Tabii istersen kartla da ödeyebilirim ama nakit daha pratik dedim.", mood: isFake ? "angry" : "warm" }
      ],
      actions: [
        { id: "accept_cash", label: "✅ NAKİDİ AL & DOLDUR", style: "serve" },
        { id: "ask_card", label: "💳 SADECE KART KABUL ET", style: "hide" },
        { id: "refuse", label: "🔒 PARAYI REDDET & KOV", style: "lock" },
        { id: "police", label: "🚨 KALPAZAN İHBARI", style: "police" }
      ],
      resolve(choice) {
        if (isFake) {
          if (choice === "police") return { status: "good", cashDelta: 170, repDelta: 9, secDelta: 13, title: "🚔 KALPAZAN SUÇÜSTÜ YAKALANDI!", message: "Mor ışık kontrolüyle sahte parayı yakalattın!" };
          if (choice === "refuse" || choice === "ask_card") return { status: "good", cashDelta: 85, repDelta: 4, secDelta: 6, title: "🔒 SAHTE PARAYI ÖNLEDİN!", message: "Kalpazan kart çıkaramayıp hızla uzaklaştı." };
          return { status: "bad", cashDelta: -155, repDelta: -6, secDelta: -8, title: "❌ SAHTE 200 TL'Yİ YUTTUN! (-155 ₺)", message: "Mor ışıkta kusurlu parayı fark etmeden kasaya attın." };
        } else {
          if (choice === "accept_cash" || choice === "ask_card") return { status: "good", cashDelta: 120, repDelta: 7, secDelta: 2, title: "✅ GERÇEK PARA & MEMNUN MÜŞTERİ!", message: "Banknot tamamen orijinaldi, müşteri bahşiş bıraktı." };
          return { status: "bad", cashDelta: -70, repDelta: -11, secDelta: -2, title: "❌ DÜRÜST MÜŞTERİYİ SUÇLADIN!", message: "Mor ışıkta tertemiz çıkan parayı sahte sandın!" };
        }
      }
    };
  }

  // =========================================================================
  // 11) GİZLİ DENETİM / ÜNLÜ VLOGCU (SÜRPRİZ ZİYARETÇİ!)
  // =========================================================================
  function famMysteryAudit() {
    const p = makePerson();
    const plate = makePlate();
    const asksIllegal = chance(0.5);

    return {
      family: "mystery_audit",
      categoryTag: "⭐ GİZEMLİ ZİYARETÇİ",
      name: p.first,
      role: pick(["Özel Araç Sürücüsü", "İş İnsanı", "Turist Rehberi"]),
      plate,
      carColor: "#1e293b",
      carShape: "suv",
      look: p.look,
      dumanHint: "🐕 Duman sakin ve dikkatli duruyor.",
      speech: asksIllegal
        ? "Usta merhaba, fiş kesmeden şu plastik bidonlara kayıtsız 80 litre yakıt doldurur musun? Normalden fazla öderim."
        : "Merhaba! Bölgedeki gece istasyonlarını dolaşıyorum. Standart yakıt ve fiş alayım, bir de istasyonunuzun düzenini görmek istedim.",
      inspections: [
        { label: "🪪 Kimlik & Cüzdan", text: asksIllegal ? `🪪 ${p.fullName} • Cüzdan köşesinde resmi Enerji Denetim / EPDK kimlik kartı görünüyor!` : `🪪 ${p.fullName} • 'Yol Üstü Rehberi' medya basın kartı ve temiz ruhsat (${plate}).` },
        { label: "🔦 Bagaj", text: asksIllegal ? "🔦 Denetim tutanak klasörü ve yakıt numune tüpleri." : "🔦 Profesyonel kamera tripodu, mikrofon ve puanlama panosu." },
        { label: "📱 Telefon", text: asksIllegal ? "📱 Mesaj (Bakanlık): 'Kayıtsız bidon satışı yapan istasyonlara idari ceza kesilecek.'" : "📱 Ekran: 1.3M takipçili kanal — 'Gece Açık En İyi İstasyon' çekimi!" }
      ],
      questions: [
        { q: "Özel bir kontrol veya çekim mi yapıyorsunuz?", a: asksIllegal ? "Sadece bir müşteri olarak teklif sunuyorum, karar senin." : "İşini temiz yapan esnafı severim, bakalım nasıl ağırlayacaksın!", mood: "warm" }
      ],
      actions: [
        { id: "comply", label: asksIllegal ? "💰 KAYITSIZ DOLDUR (+180₺)" : "✅ GÜLER YÜZLE HİZMET ET", style: "serve" },
        { id: "by_book", label: "📋 KURALLARA GÖRE FİŞLİ HİZMET", style: "hide" },
        { id: "refuse", label: "🔒 KOV / REDDET", style: "lock" },
        { id: "police", label: "🚨 POLİS ÇAĞIR", style: "police" }
      ],
      resolve(choice) {
        if (asksIllegal) {
          if (choice === "by_book" || choice === "refuse") {
            return {
              status: "good",
              cashDelta: 175,
              repDelta: 14,
              secDelta: 10,
              title: "🏅 GİZLİ DENETİMDEN TAM NOT!",
              message: "Kayıtsız satış tuzağına düşmedin! Örnek İstasyon ödülü ve %40 Tanker İndirimi kazandın!",
              effect: { type: "tanker_discount", label: "⛽ Örnek İstasyon: Tanker %40 İndirimli!" }
            };
          }
          if (choice === "comply") {
            return { status: "bad", cashDelta: -180, repDelta: -15, secDelta: -8, title: "📋 GİZLİ MÜFETTİŞ CEZASI! (-180 ₺)", message: "Kayıtsız bidon satışını kabul ettiğin anda müfettiş kartını çıkarıp ceza kesti!" };
          }
          return { status: "mixed", cashDelta: 40, repDelta: 2, secDelta: 4, title: "📋 MÜFETTİŞ KİMLİĞİNİ GÖSTERDİ", message: "Yasa dışı satış yapmadığın için ceza yemedin." };
        } else {
          if (choice === "comply" || choice === "by_book") {
            return {
              status: "good",
              cashDelta: 195,
              repDelta: 16,
              secDelta: 4,
              title: "🎥 VİRAL VİDEO! VIP AKINI BAŞLADI!",
              message: "Ünlü gezgin istasyonuna 10/10 puan verdi! Sürücüler akın ediyor!",
              effect: { type: "vip_rush", duration: 55, label: "🌟 Viral Etki: VIP Akını (+%40 Bahşiş)" }
            };
          }
          return { status: "bad", cashDelta: -75, repDelta: -14, secDelta: 0, title: "❌ VİRAL FIRSATI KOVDUN!", message: "Ünlü gezgini tersledin, olumsuz paylaşım trafiği yavaşlattı." };
        }
      }
    };
  }

  // =========================================================================
  // 12) ZİNCİRLEME DEVAM OLAYLARI (ÖNCEKİ KARARLARININ GERÇEK SONUCU!)
  // =========================================================================
  function famFollowUpGratefulOwner(ownerName, origAmt) {
    const p = makePerson();
    const plate = makePlate();
    const bonus = 180 + rand(80);
    return {
      family: "followup_owner",
      categoryTag: "🔁 DEVAM OLAYI",
      name: ownerName.split(" ")[0],
      role: "Emanet Çanta Sahibi (Geri Döndü!)",
      plate,
      carColor: "#2563eb",
      carShape: "suv",
      look: p.look,
      dumanHint: "🐕 Duman tanıdık misafiri görünce kuyruk sallıyor!",
      speech: `Tekrar merhaba dostum! Geçen saat emanet bıraktığım sigortalı çantayı almaya geldim. Güvenilirliğin için söz verdiğim gibi ekstra ${bonus} ₺ teşekkür hediyesi getirdim!`,
      inspections: [
        { label: "🪪 Kimlik Eşleşmesi", text: `🪪 ${ownerName} • Emanet fişi ve kimlik birebir eşleşiyor!` }
      ],
      questions: [
        { q: "Yolculuğunuz iyi geçti mi?", a: "Sayende gözüm arkada kalmadı! Çevremdeki herkese istasyonunu tavsiye ettim.", mood: "warm" }
      ],
      actions: [
        { id: "deliver", label: `📦 ÇANTAYI TESLİM ET (+${bonus}₺)`, style: "serve" },
        { id: "coffee", label: `☕ ÇAY İKRAM ET (+${bonus + 30}₺)`, style: "hide" },
        { id: "ask_more", label: "💰 EKSTRA ÜCRET İSTE", style: "lock" },
        { id: "refuse", label: "🚫 TANIYAMADIM DE", style: "police" }
      ],
      resolve(choice) {
        if (choice === "deliver" || choice === "coffee") {
          const pay = choice === "coffee" ? bonus + 30 : bonus;
          return {
            status: "good",
            cashDelta: pay,
            repDelta: 15,
            secDelta: 5,
            title: `🌟 EMANET TESLİM EDİLDİ! (+${pay} ₺)`,
            message: "Önceki doğru kararın sana büyük ödül ve harika bir VIP akını olarak geri döndü!",
            effect: { type: "vip_rush", duration: 45, label: "🌟 Güvenilir İstasyon: VIP Akını" }
          };
        }
        return { status: "bad", cashDelta: 0, repDelta: -14, secDelta: -4, title: "❌ GÜVENİ SARSTIN", message: "Müşteri tavrından rahatsız olup çantasını alıp soğukça ayrıldı." };
      }
    };
  }

  function famFollowUpDebtRepaid(debtorName, repayAmt) {
    const p = makePerson();
    const plate = makePlate();
    return {
      family: "followup_debt",
      categoryTag: "🔁 SÖZÜNÜ TUTAN MÜŞTERİ",
      name: debtorName.split(" ")[0],
      role: "Veresiye Alan Yolcu (Geri Döndü!)",
      plate,
      carColor: "#10b981",
      carShape: "sedan",
      look: p.look,
      dumanHint: "🐕 Duman sevinçle havlıyor!",
      speech: `Abi söz verdiğim gibi geri geldim! Kartım düzeldi, hem borcumu hem de insanlığın için iki katı tam ${repayAmt} ₺ getirdim. Allah razı olsun!`,
      inspections: [
        { label: "🟣 Ödeme", text: `🟣 Tam ${repayAmt} ₺ orijinal banknotlar!` }
      ],
      questions: [
        { q: "İşlerini halledebildin mi?", a: "Sayende yolda kalmadım abi, bundan sonra ömürlük müşterinim!", mood: "warm" }
      ],
      actions: [
        { id: "take_full", label: `💵 ${repayAmt} ₺ AL & TEŞEKKÜR ET`, style: "serve" },
        { id: "take_half", label: `❤️ SADECE YAKIT BEDELİNİ AL`, style: "hide" },
        { id: "invite_meal", label: "🍽️ YEMEK ISMARLA (+İTİBAR)", style: "lock" },
        { id: "ignore", label: "👋 ÖNEMLİ DEĞİL DE", style: "police" }
      ],
      resolve(choice) {
        if (choice === "take_full") {
          return { status: "good", cashDelta: repayAmt, repDelta: 10, secDelta: 4, title: `💵 BORÇ İKİ KATI ÖDENDİ! (+${repayAmt} ₺)`, message: "Doğru kişiye güvendiğin için hem paranı katladın hem dost kazandın!" };
        }
        return {
          status: "good",
          cashDelta: Math.round(repayAmt * 0.55),
          repDelta: 20,
          secDelta: 6,
          title: "❤️ BÖLGENİN EFSANE ESNAFI OLDUN!",
          message: "Gönlü zengin tavrın kulaktan kulağa yayıldı! İstasyonun VIP dolup taşacak!",
          effect: { type: "vip_rush", duration: 60, label: "🌟 Efsane İtibar: VIP Akını!" }
        };
      }
    };
  }

  function famFollowUpPoliceCheck(suspectName) {
    const p = makePerson(false);
    const plate = "34 A 4155";
    return {
      family: "followup_police",
      categoryTag: "🔁 POLİS SORUŞTURMASI",
      name: `Komiser ${p.first}`,
      role: "Emniyet Narkotik / Kaçakçılık",
      plate,
      carColor: "#1e3a8a",
      carShape: "sedan",
      look: p.look,
      dumanHint: "🐕 Duman polise sakin bakıyor ama ofis tarafına göz atıyor.",
      speech: `İyi geceler. Az önce buradan geçen ${suspectName} adlı şahsı yakaladık; ifadesinde kaçak çantayı senin ofisine bıraktığını söyledi! Çanta burada mı?`,
      inspections: [
        { label: "🪪 Polis Rozeti", text: "🪪 Resmi Emniyet Başkomiser Kimliği ve Arama İzni — tamamen gerçek." }
      ],
      questions: [
        { q: "Ben içinde ne olduğunu bilmiyordum!", a: "İş birliği yaparsan hafifletici sebep yazarım, inkar edersen arama yaparız!", mood: "neutral" }
      ],
      actions: [
        { id: "cooperate", label: "📦 ÇANTAYI HEMEN TESLİM ET", style: "serve" },
        { id: "explain", label: "🗣️ BİLMEDİĞİNİ AÇIKLA", style: "hide" },
        { id: "deny", label: "🤥 İNKAR ET", style: "lock" },
        { id: "bribe_cop", label: "💰 KAPATALIM TEKLİF ET", style: "police" }
      ],
      resolve(choice) {
        if (choice === "cooperate" || choice === "explain") {
          return { status: "mixed", cashDelta: -90, repDelta: -4, secDelta: 10, title: "📦 İŞ BİRLİĞİYLE UCUZ ATLATTIN", message: "Çantayı teslim ettiğin için küçük bir idari uyarıyla kapandı (-90 ₺)." };
        }
        return { status: "bad", cashDelta: -260, repDelta: -16, secDelta: -15, title: "🚨 AĞIR SORUŞTURMA CEZASI! (-260 ₺)", message: "Ofiste kaçak çanta bulundu! İnkar ettiğin için ağır ceza yedin." };
      }
    };
  }

  // =========================================================================
  // 13) BÜYÜK PATRON OLAYLARI (MÜDÜR KEMAL'İN SENİ ARADIĞI KRİTİK KARARLAR!)
  // =========================================================================
  function famBrandSponsor() {
    const p = makePerson();
    const plate = makePlate();
    const dealAmt = 450 + rand(200);
    return {
      family: "brand_sponsor",
      critical: true,
      categoryTag: "🏢 PATRON KARARI • SPONSORLUK",
      name: `${p.first} Bey/Hanım`,
      role: "Bölge Akaryakıt Direktörü",
      plate,
      carColor: "#0f172a",
      carShape: "suv",
      look: p.look,
      dumanHint: "🐕 Duman sakin, gelen heyet kurumsal görünüyor.",
      speech: `İyi günler patron! İstasyonunuzun büyümesini takip ediyoruz. 3 günlük reklam tabelası sponsorluğu için peşin ${dealAmt} ₺ ve tanker indirimi teklif ediyoruz. Ne dersiniz?`,
      inspections: [
        { label: "📄 Sözleşme Taslağı", text: "📄 Temiz kurumsal sponsorluk: sadece kısa süreli marka tanıtımı, gizli bağlayıcı madde yok." },
        { label: "🪪 Şirket Kartı", text: `🪪 ${p.fullName} • Enerji Dağıtım A.Ş. Bölge Müdürü.` }
      ],
      questions: [
        { q: "Bağımsız işletme hakkımız korunacak mı?", a: "Kesinlikle! Sadece kısa süreli reklam iş birliği, istasyon tamamen sizin.", mood: "warm" }
      ],
      actions: [
        { id: "sign", label: `🤝 ANLAŞMAYI İMZALA (+${dealAmt}₺)`, style: "serve" },
        { id: "negotiate", label: "💼 %25 FAZLA İSTE", style: "hide" },
        { id: "decline", label: "🚫 BAĞIMSIZ KAL", style: "lock" },
        { id: "ask_fuel", label: "⛽ NAKİT YERİNE +500L YAKIT", style: "police" }
      ],
      resolve(choice) {
        if (choice === "sign") {
          return {
            status: "good",
            cashDelta: dealAmt,
            repDelta: 10,
            secDelta: 4,
            title: `🤝 SPONSORLUK İMZALANDI! (+${dealAmt} ₺)`,
            message: "Peşin sponsorluk bedeli şirkete yattı ve sonraki tankerde %40 indirim kazandın!",
            effect: { type: "tanker_discount", label: "⛽ Sponsor İndirimi: Tanker %40 İndirimli!" }
          };
        }
        if (choice === "negotiate") {
          if (chance(0.6)) {
            const big = Math.round(dealAmt * 1.25);
            return { status: "good", cashDelta: big, repDelta: 12, secDelta: 4, title: `💼 HARİKA PAZARLIK! (+${big} ₺)`, message: "Direktör yüksek teklifi kabul etti!" };
          }
          return { status: "mixed", cashDelta: Math.round(dealAmt * 0.7), repDelta: 4, secDelta: 2, title: "🤝 ORTA YOLDA ANLAŞILDI", message: "Biraz daha düşük ama yine de kârlı bir sözleşme imzaladınız." };
        }
        if (choice === "ask_fuel") {
          return { status: "good", cashDelta: 120, fuelDelta: 500, repDelta: 8, secDelta: 4, title: "⛽ +500L YAKIT + 120 ₺ ALDIN!", message: "Ana yakıt depon bedava doldu!" };
        }
        return { status: "mixed", cashDelta: 0, repDelta: 5, secDelta: 2, title: "🚫 BAĞIMSIZ KALDIN", message: "Kendi markanla devam etmeyi seçtin." };
      }
    };
  }

  function famFleetContract() {
    const p = makePerson();
    const plate = makePlate();
    const pay = 520 + rand(180);
    return {
      family: "fleet_contract",
      critical: true,
      categoryTag: "🚚 PATRON KARARI • FİLO ANLAŞMASI",
      name: p.first,
      role: "Lojistik Filo Yöneticisi",
      plate,
      carColor: "#1e3a8a",
      carShape: "van",
      look: p.look,
      dumanHint: "🐕 Duman sakin ve dostane.",
      speech: `Patron, 25 araçlık kargo filomuz bu otoyoldan geçiyor. Tek seferlik 220L toplu yakıt + dinlenme sözleşmesi yaparsak peşin ${pay} ₺ öderiz!`,
      inspections: [
        { label: "📄 Filo Belgeleri", text: `📄 ${p.fullName} • 'Kuzey Kargo Filo A.Ş.' resmi yetki belgesi.` },
        { label: "🟣 Banka Havalesi", text: "🟣 Peşin kurumsal ödeme hazır." }
      ],
      questions: [
        { q: "Araçlarınız restoran ve kantarı da kullanır mı?", a: "Elbette! Şoförlerimiz sıcak yemek ve kantar için hep size uğrayacak.", mood: "warm" }
      ],
      actions: [
        { id: "accept", label: `🚚 SÖZLEŞMEYİ YAP (+${pay}₺)`, style: "serve" },
        { id: "vip_only", label: "🍽️ SADECE RESTORAN/KANTAR (+220₺)", style: "hide" },
        { id: "delay", label: "⏳ SONRA KONUŞALIM", style: "lock" },
        { id: "refuse", label: "🚫 KABUL ETME", style: "police" }
      ],
      resolve(choice) {
        if (choice === "accept") {
          return {
            status: "good",
            cashDelta: pay,
            fuelDelta: -220,
            repDelta: 14,
            secDelta: 5,
            title: `🚚 DEV FİLO ANLAŞMASI! (+${pay} ₺)`,
            message: "Kargo filosu istasyonunu ana üs seçti! Uzun süreli VIP hareketliliği başladı!",
            effect: { type: "vip_rush", duration: 60, label: "🌟 Filo Akını: +%40 Bahşiş" }
          };
        }
        if (choice === "vip_only") {
          return { status: "good", cashDelta: 220, repDelta: 7, secDelta: 2, title: "🍽️ MOLA ANLAŞMASI (+220 ₺)", message: "Yakıt harcamadan temiz filo geliri elde ettin!" };
        }
        return { status: "mixed", cashDelta: 0, repDelta: 0, secDelta: 0, title: "⏳ TEKLİF ERTELENDİ", message: "Filo yöneticisi kartını bırakıp ayrıldı." };
      }
    };
  }

  const FAMILIES = [
    { key: "mystery_package", fn: famMysteryPackage, weight: 14 },
    { key: "convoy_deal", fn: famConvoyDeal, weight: 12 },
    { key: "card_declined", fn: famCardDeclined, weight: 13 },
    { key: "timeline_detective", fn: famTimelineDetective, weight: 13 },
    { key: "parking_dispute", fn: famParkingDispute, weight: 11 },
    { key: "stranded_luxury", fn: famStrandedLuxury, weight: 11 },
    { key: "shelter_plea", fn: famShelterPlea, weight: 12 },
    { key: "technician_visit", fn: famTechnicianVisit, weight: 12 },
    { key: "cheap_fuel_offer", fn: famCheapFuelOffer, weight: 12 },
    { key: "cash_inspection", fn: famCashInspection, weight: 12 },
    { key: "mystery_audit", fn: famMysteryAudit, weight: 11 },
    { key: "brand_sponsor", fn: famBrandSponsor, weight: 10 },
    { key: "fleet_contract", fn: famFleetContract, weight: 10 }
  ];

  function generateEvent(gameState = {}) {
    // 1. Önce bekleyen zincirleme devam olayı var mı kontrol et!
    for (let i = 0; i < pendingFollowUps.length; i++) {
      pendingFollowUps[i].countdown -= 1;
    }
    const readyIdx = pendingFollowUps.findIndex((f) => f.countdown <= 0);
    if (readyIdx !== -1) {
      const item = pendingFollowUps.splice(readyIdx, 1)[0];
      return item.factory();
    }

    // 2. Son 6 olay ailesini asla tekrar etme!
    const candidates = FAMILIES.filter((f) => !recentFamilies.includes(f.key));
    const pool = candidates.length > 0 ? candidates : FAMILIES;

    const weighted = pool.map((f) => ({
      item: f,
      w: f.weight * (0.5 + Math.random() * 1.1)
    }));
    const total = weighted.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    let chosen = weighted[0].item;
    for (const e of weighted) {
      r -= e.w;
      if (r <= 0) {
        chosen = e.item;
        break;
      }
    }

    recentFamilies.push(chosen.key);
    if (recentFamilies.length > 6) recentFamilies.shift();

    return chosen.fn(gameState);
  }

  return {
    generateEvent,
    nextSpecialInterval
  };
})();

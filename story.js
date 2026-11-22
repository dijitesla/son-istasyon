// Son İstasyon v3.0 — 5 Hikaye Gecesi x 5 Benzersiz Müşteri = 25 Farklı Karakter!

window.CLUE_DATABASE = {
  clue_404: {
    title: "Çamurlu 404 Plakası",
    night: "1. Gece",
    detail: "Tır şoförü Selim Usta, Emre'nin kaybolduğu gece Pompa 4'te sonu 404 olan çamurlu lacivert bir araç gördü."
  },
  clue_vest: {
    title: "Bagajdaki Yelek ve Kuzgun",
    night: "1. Gece",
    detail: "06 KYP 404 aracın bagajından Emre'nin yaka kartı, şifreli telefondan ise 'Kuzgun' ismi çıktı."
  },
  clue_alive: {
    title: "Emre Hayatta!",
    night: "2. Gece",
    detail: "Acil hemşiresi Nermin Abla, eli sargılı Emre'nin gizlice pansuman yaptırıp maden yoluna kaçtığını söyledi."
  },
  clue_mine: {
    title: "Eski Maden Deposu",
    night: "2. Gece",
    detail: "Panelvanlı Rasim'in şifreli telefonundan (1919), Emre'nin eski maden deposunda tutulduğu ve Pompa 4 altındaki altın zulası öğrenildi."
  },
  clue_code: {
    title: "Muhbirin Verdiği Kasa Kodu",
    night: "3. Gece",
    detail: "Eski muhasebeci Leyla, Kuzgun'un plakasının '06 KZG 001' ve telefon şifresinin '4004' olduğunu sızdırdı."
  },
  clue_emre_rescued: {
    title: "Emre Arka Odaya Saklandı",
    night: "4. Gece",
    detail: "Ellerini çözüp istasyona sığınan Emre'yi sahte ambulansçılardan koruyup arka odada güvenceye aldın!"
  },
  clue_kuzgun_busted: {
    title: "Kuzgun Şebekesi Çökertildi!",
    night: "5. Gece",
    detail: "06 KZG 001 plakalı elebaşı Kuzgun, şalter sabotajına rağmen 112 operasyonuyla suçüstü yakalandı!"
  }
};

// Yardımcı varsayılan "İçeri Sakla" sonucu (gereksiz müşteride kullanılırsa)
const defaultHideWrong = {
  correct: false,
  badge: "GEREKSİZ HAMLE",
  title: "Müşteriyi durup dururken arka odaya çağırdın!",
  desc: "Müşteri senden şüphelenip arkasına bakmadan dükkândan çıktı (-50 ₺).",
  penalty: 50
};

window.GAME_NIGHTS = [
  // =========================================================================
  // 1. GECE (5 FARKLI MÜŞTERİ): KAYIP VARDİYA
  // =========================================================================
  {
    nightNumber: 1,
    title: "1. GECE: KAYIP VARDİYA",
    wantedPoster: {
      title: "ARANAN: SONU '404' LACİVERT SEDAN",
      desc: "Kayıp kasiyer Emre olayında son görülen çamurlu lacivert sedan aranıyor. Ayrıca sahte 200 ₺ banknotlara dikkat!"
    },
    bossSms:
      "Hoş geldin genç. Senden önceki gececi Emre 3 gündür kayıp. Pompadan doğru yakıt türünü seç, çay/tost ve market ürünlerini hazırla, mor ışık ve kimlik kontrolünü ihmal etme!",
    customers: [
      {
        id: "n1_1",
        name: "Selim Usta",
        role: "Uzun Yol Tır Şoförü",
        time: "00:15",
        radioTicker: "📻 FM 98.4: Son İstasyon çalışanı Emre K.'dan 3 gündür haber alınamıyor, sonu 404 plakalı araç aranıyor...",
        look: { style: "trucker", skin: "#e0a97f", outfit: "#9a3412", outfit2: "#431407", capColor: "#dc2626", hairColor: "#3f3f46", mustache: true },
        car: { shape: "truck", type: "Kırmızı Tır Çekicisi", color: "#dc2626", plate: "52 TR 618", pumpNote: "Dorse mühürlü, plaka ve evraklar nizami." },
        idCard: { fullName: "Selim Karaca", birthYear: 1974, validUntil: "2030", plateMatch: "52 TR 618", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo kilitli ve sakin.",
        powerOutage: false,
        requests: { fuelType: "mazot", fuel: 350, drink: "cay", toast: "kasarli", market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-884192", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 165,
        greeting: "Bereketli geceler yeğenim. Tıra 350 liralık MAZOT basıver, yanına da demli bir çayla kaşarlı tost yap da içimiz ısınsın.",
        questions: [
          { btn: "Emre'yi kaybolduğu gece gördün mü?", mood: "neutral", reply: "Gördüm ya... Gece 03:00'te Pompa 4'te çamurlu LACİVERT bir sedan vardı, plakasının sonu 404'tü." },
          { btn: "Yolculuk ne tarafa usta?", mood: "warm", reply: "Ordu'dan fındık yükledim Ankara'ya gidiyorum. Gece sahte para süren çok olur, mor ışığa bakmadan para alma." },
          { btn: "Arka depodan ses duydun mu?", mood: "neutral", reply: "Yok yeğenim, şimdilik dışarısı sakin ama gözün kamerada olsun." }
        ],
        outcomes: {
          serve: { correct: true, badge: "TEMİZ BAŞLANGIÇ", title: "Selim Usta memnun ayrıldı!", desc: "Doğru yakıtı ve çayı verdin. '404 plakalı lacivert sedan' ipucunu panoya ekledin!", clue: "clue_404" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "YANLIŞ ALARM", title: "Emektar tırcıyı kapıda bıraktın!", desc: "Hem kazancı hem de görgü tanığını kaçırdın (-60 ₺).", penalty: 60 },
          police: { correct: false, badge: "ASILSIZ İHBAR", title: "Masum şoföre polis çağırdın!", desc: "Evrakları tam çıktı (-100 ₺ ceza).", penalty: 100 }
        }
      },

      {
        id: "n1_2",
        name: "Melis",
        role: "Yağmurda Kaçan Yolcu",
        time: "01:10",
        radioTicker: "📻 FM 98.4 HAVA: Gece fırtınası şiddetleniyor, görüş mesafesi düştü...",
        look: { style: "long", skin: "#fad2b4", outfit: "#4f46e5", outfit2: "#1e1b4b", hairColor: "#1e1b2e" },
        car: { shape: "sedan", type: "Beyaz Hatchback", color: "#e2e8f0", plate: "34 MLS 27", pumpNote: "Arka koltukta valiz var, sürücü korkuyla yola bakıyor." },
        idCard: { fullName: "Melis Aydın", birthYear: 2001, validUntil: "2032", plateMatch: "34 MLS 27", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha temiz.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: null, toast: null, market: "su" },
        cashBill: { denom: 100, fake: false, serial: "TR-512094", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Melis'in Telefonu",
          locked: false,
          pin: null,
          wallpaperTone: "indigo",
          notifications: [
            { app: "MESAJLAR • ŞİMDİ", sender: "Annem ❤️", body: "Kızım eski nişanlın Bora gri spor arabayla peşinden çıktı! Açık bir yer bulursan saklan!" },
            { app: "WHATSAPP", sender: "Bora", body: "Son benzincide olduğunu biliyorum Melis, 15 dakikaya oradayım." }
          ]
        },
        reward: 85,
        greeting: "Ne olur yardım et... Bir şişe soğuk su ver, telefonumu da 2 dakika şarja tak. Peşimde biri var, beni biraz arka odada saklayabilir misin?!",
        questions: [
          { btn: "Kimden kaçıyorsun?", mood: "nervous", reply: "Takıntılı eski nişanlım Bora! Gri spor arabayla arkamdan geliyor, ne olur beni 'İçeri Sakla' veya ona geçtiğimi söyleme!" },
          { btn: "Yaralı mısın, ambulans çağırayım mı?", mood: "nervous", reply: "Hayır yaralı değilim, sadece arabamı görmesin yeter!" },
          { btn: "Kimliğine bakabilir miyim?", mood: "neutral", reply: "Tabii buyur, Melis Aydın... Yeter ki beni koru." }
        ],
        outcomes: {
          hide: { correct: true, badge: "GÜVENLİ SIĞINAK!", title: "Melis'i Arka Odaya Sakladın! (+150 ₺ Ödül)", desc: "Suyunu verip güvenli odaya aldın ve arabasını arka tarafa çektirdin! Birazdan Bora geldiğinde onu gafil avlayabilirsin!", bonus: 150, badgeUnlock: "safe_haven" },
          serve: { correct: true, badge: "İYİ NİYET", title: "Melis'e suyunu verip arka yoldan uğurladın (+85 ₺)", desc: "Peşinden gelecek 'Bora' ismini aklına yazdın." },
          lock: { correct: false, badge: "VİCDAN AZABI", title: "Yardım isteyen kızı fırtınada kovdun!", desc: "Karanlıkta çaresiz kaldı (-80 ₺).", penalty: 80 },
          police: { correct: false, badge: "PANİK", title: "Siren sesinden korkup suyunu almadan kaçtı!", desc: "İçeri saklamak çok daha doğruydu (-40 ₺).", penalty: 40 }
        }
      },

      {
        id: "n1_3",
        name: "Cengiz",
        role: "Gece Gezgini",
        time: "02:05",
        radioTicker: "📻 FM 98.4 UYARI: Bölgedeki esnaflara sahte 200 TL sürüldüğü ihbar edildi! Mor ışık kullanın...",
        look: { style: "slick", skin: "#dfb18b", outfit: "#065f46", outfit2: "#022c22", hairColor: "#18181b", glasses: true },
        car: { shape: "sport", type: "Siyah Kupe", color: "#27272a", plate: "16 CNZ 88", pumpNote: "Farları kısık, motoru çalışır halde tutuyor." },
        idCard: { fullName: "Cengiz Keskin", birthYear: 1988, validUntil: "2029", plateMatch: "16 CNZ 88", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: "sutlu", toast: null, market: "cikolata" },
        cashBill: { denom: 200, fake: true, serial: "FK-000000", uvText: "⚠️ SAHTE KOPYA! FİLİGRAN YOK!" },
        wantsCharger: false,
        phoneData: null,
        reward: 120,
        greeting: "Selam birader, bir sütlü latte ile fıstıklı çikolata ver bakalım. Şöyle 200'lük bıraktım, üstü kalsın acelem var!",
        questions: [
          { btn: "Neden mor ışığa bakmamı istemiyorsun?", mood: "nervous", reply: "Ne alaka canım, yeni çektim bankamatikten, uğraşma diye dedim!" },
          { btn: "Bu paranın kağıdı neden kaygan?", mood: "angry", reply: "Yağmurda nemlenmiştir kardeşim, laf uzatma!" },
          { btn: "Gece vakti nereden geliyorsun?", mood: "neutral", reply: "Şehir merkezinden dönüyorum, tatlı krizim tuttu." }
        ],
        outcomes: {
          serve: { correct: false, badge: "DOLANDIRILDIN!", title: "Sahte 200 TL'yi Kasaya Koydun! (-200 ₺)", desc: "Mor ışık kontrolünü atladın, kalpazan sırıtarak uzaklaştı!", penalty: 200 },
          hide: defaultHideWrong,
          lock: { correct: true, badge: "KESKİN GÖZ!", title: "Sahte Parayı Yakalayıp Kepengi İndirdin! (+110 ₺)", desc: "Mor ışığı görünce panikleyip kaçtı!", bonus: 110, badgeUnlock: "fake_hunter" },
          police: { correct: true, badge: "SUÇÜSTÜ!", title: "Kalpazan Cengiz Ekibe Teslim Edildi! (+150 ₺)", desc: "Cebinden bir deste sahte 200'lük daha çıktı!", bonus: 150, badgeUnlock: "fake_hunter" }
        }
      },

      {
        id: "n1_4",
        name: "Bora",
        role: "Öfkeli Takipçi",
        time: "03:00",
        radioTicker: "📻 FM 98.4: Uzaklaştırma kararını ihlal eden gri spor araç sürücüsü hakkında ihbar var...",
        look: { style: "short", skin: "#eac09c", outfit: "#1e293b", outfit2: "#e2e8f0", hairColor: "#0f172a", tie: "#ef4444" },
        car: { shape: "sport", type: "Gri Spor Sedan", color: "#64748b", plate: "34 BR 901", pumpNote: "⚠️ Motor aşırı sıcak! Ön koltukta kırık telefon kılıfı var." },
        idCard: { fullName: "Bora Soylu", birthYear: 1995, validUntil: "2028", plateMatch: "34 BR 901", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo kapısı sağlam.",
        powerOutage: false,
        requests: { fuelType: "benzin", fuel: 400, drink: "sade", toast: null, market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-773410", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 130,
        greeting: "Pompadan 400 liralık BENZİN aç, bir de sade filtre kahve ver. Az önce buradan Melis geçti mi? Doğru söyle bahşişe boğayım seni.",
        questions: [
          { btn: "Hakkında uzaklaştırma kararı mı var?", mood: "angry", reply: "Sana ne birader bizim meselemizden?! Benzinimi ver çeneni kapat!" },
          { btn: "Madem nişanlın, neden aramıyorsun?", mood: "nervous", reply: "Şarjı bitmiş ulaşamıyorum... Gördün mü görmedin mi?" },
          { btn: "Kamerada aşırı hızla geldiğin görünüyor.", mood: "angry", reply: "Trafik polisi misin kasiyer mi?!" }
        ],
        outcomes: {
          serve: { correct: false, badge: "TEHLİKELİ HATA!", title: "Takipçinin Deposunu Doldurup Yol Verdin!", desc: "Tehlikeli bir şahsa benzin verip peşinden gönderdin (-130 ₺).", penalty: 130 },
          hide: { correct: false, badge: "AKIL ALMAZ HATA!", title: "Takipçiyi Melis'in Olduğu Arka Odaya Soktun!", desc: "Büyük arbede çıktı (-200 ₺)!", penalty: 200 },
          lock: { correct: true, badge: "GEÇİT VERMEDİN!", title: "Benzin Vermedin, Kapıyı Kilitledin! (+120 ₺)", desc: "Yakıtsız kalınca geri dönmek zorunda kaldı!", bonus: 120 },
          police: { correct: true, badge: "TAM İSABET!", title: "112 Devriyesi Bora'yı Kavşakta Aldı! (+160 ₺)", desc: "Melis tamamen güvende!", bonus: 160 }
        }
      },

      {
        id: "n1_5",
        name: "Gölge Kurye",
        role: "Gece Yarısı Yabancısı",
        time: "04:15",
        radioTicker: "🚨 ACİL ANONS: Emre olayında aranan SONU 404 PLAKALI ÇAMURLU LACİVERT SEDAN kasaba çıkışında görüldü!",
        look: { style: "hood", outfit: "#111827", outfit2: "#030712" },
        car: {
          shape: "sedan",
          type: "Çamurlu Lacivert Sedan",
          color: "#1e3a8a",
          plate: "06 KYP 404",
          muddyPlate: true,
          vestClue: true,
          pumpNote: "🚨 ARANAN ARAÇ: Plaka sonu '404'! Bagaj kapağından kırmızı 'Son İstasyon' yeleği sarkıyor!"
        },
        idCard: { fullName: "Murat Çetin (SAHTE!)", birthYear: 1985, validUntil: "2021 (GEÇERSİZ!)", plateMatch: "34 XXX 11 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: true,
        depotNote: "🚨 TEHLİKE! Maskeli ikinci şahıs levye ile ARKA DEPO kapısını zorluyor! Alarm çal!",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: null, toast: "sucuklu", market: "enerji" },
        cashBill: { denom: 200, fake: false, serial: "TR-109442", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Şifreli Cihaz",
          locked: true,
          pin: "0404",
          pinHint: "Kilit İpucu: ' Sıfır + Plakamın son 3 rakamı ' (0 + ___)",
          wallpaperTone: "crimson",
          notifications: [
            { app: "ŞİFRELİ KANAL", sender: "Kuzgun", body: "Emre'nin yaka kartını aldın mı? Sen kasiyeri oyalarken ortağın arka depoyu açsın!" }
          ]
        },
        reward: 130,
        greeting: "Sucuklu tostla enerji içeceği ver, oyalanma. Şu telefonu da prize tak ama sakın ekranına dokunma bozuşuruz!",
        questions: [
          { btn: "Bagajdan sarkan kırmızı kumaş bizim yelek mi?", mood: "angry", reply: "Ne yeleği be?! Eski bez parçası o, işine bak!" },
          { btn: "Kimliğinizdeki plaka ile dışarıdaki araç tutmuyor?", mood: "nervous", reply: "Eمانet araba birader, sorgu memuru musun?!" },
          { btn: "Arka depodan tıkırtı mı geliyor?", mood: "nervous", reply: "Rüzgârdır o, kasadan ayrılma!" }
        ],
        outcomes: {
          police: { correct: true, badge: "BÜYÜK YAKALAMA!", title: "06 KYP 404 Suçüstü Yakalandı! (+270 ₺ Ödül)", desc: "Hem sahte kimliği hem 0404 şifresini çözdün! Bagajdan Emre'nin kartı ve 'Kuzgun' ipucu çıktı!", bonus: 270, clue: "clue_vest", badgeUnlock: "id_detective" },
          lock: { correct: true, badge: "KIL PAYI", title: "Kepengi indirdin ama 404 kaçtı (+70 ₺)", desc: "Kendini korudun fakat araç izini kaybettirdi.", bonus: 70 },
          serve: { correct: false, badge: "FELAKET!", title: "Aranan Baş Şüpheliyi Gönderdin!", desc: "Hem aranan plaka hem sahte kimlik gözünden kaçtı (-190 ₺)!", penalty: 190 },
          hide: { correct: false, badge: "KORKUNÇ HATA!", title: "Suçluyu Arka Odaya Aldın!", desc: "İçerideki kasayı soyup kaçtılar (-250 ₺)!", penalty: 250 }
        }
      }
    ]
  },

  // =========================================================================
  // 2. GECE (5 YENİ MÜŞTERİ): SAHTE KİMLİKLER VE KARANLIK
  // =========================================================================
  {
    nightNumber: 2,
    title: "2. GECE: SAHTE KİMLİKLER",
    wantedPoster: {
      title: "ARANAN: '34 KZG 19' KOYU GRİ PANELVAN & SAHTE GÖREVLİLER",
      desc: "Kendini sivil müfettiş/polis gibi tanıtan süresi geçmiş kimlikli şahıslara ve '34 KZG 19' panelvana dikkat!"
    },
    bossSms:
      "İkinci gecen! Dün gece yakalanan 404'ün arkasında 'Kuzgun' diye biri varmış. Bu gece fırtına yüzünden elektrik şalteri atabilir, hazırlıklı ol!",
    customers: [
      {
        id: "n2_1",
        name: "Nermin Hemşire",
        role: "Acil Servis Hemşiresi",
        time: "00:20",
        radioTicker: "📻 FM 98.4: Kayıp kasiyer Emre'yi arama çalışmaları eski maden yoluna kaydırıldı...",
        look: { style: "hijab", skin: "#f3c6a5", outfit: "#0284c7", outfit2: "#e0f2fe", capColor: "#0369a1", glasses: true },
        car: { shape: "ambulance", type: "Nöbetçi Sağlık Aracı", color: "#f8fafc", plate: "52 SH 112", pumpNote: "Resmi sağlık nakil aracı, kayıtları temiz." },
        idCard: { fullName: "Nermin Özkan", birthYear: 1982, validUntil: "2033", plateMatch: "52 SH 112", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: "cay", toast: null, market: "cikolata" },
        cashBill: { denom: 100, fake: false, serial: "TR-662918", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 115,
        greeting: "Hayırlı nöbetler evladım. Nöbet çıkışı kan şekerim düştü, bir demli çayla çikolata verir misin? Sana Emre hakkında müjdem var!",
        questions: [
          { btn: "Emre hakkında ne biliyorsun abla?", mood: "warm", reply: "Akşam acilin arka kapısına eli sargılı bir genç geldi, yaka izinden tanıdım: EMRE HAYATTA!" },
          { btn: "Nereye gitti peki?", mood: "nervous", reply: "'Şebekenin sahte memurları beni arıyor abla, eski maden yoluna saklanacağım' deyip gitti." },
          { btn: "Durumu ağır mıydı?", mood: "neutral", reply: "Pansumanını yaptım, korkma ama çok bitkin görünüyordu." }
        ],
        outcomes: {
          serve: { correct: true, badge: "MÜJDELİ HABER!", title: "Emre'nin Hayatta Olduğunu Öğrendin!", desc: "Nermin Abla'yı uğurladın ve yeni kanıtı panoya ekledin!", clue: "clue_alive" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "YANLIŞ KARAR", title: "Sağlık çalışanını geri çevirdin!", desc: "Önemli bilgiyi kaçırdın (-60 ₺).", penalty: 60 },
          police: { correct: false, badge: "ASILSIZ İHBAR", title: "Hemşireye ekip çağırdın!", desc: "Ceza kesildi (-90 ₺).", penalty: 90 }
        }
      },

      {
        id: "n2_2",
        name: "Kurye Mert",
        role: "Gece Paket Kuryesi",
        time: "01:15",
        radioTicker: "📻 FM 98.4 HAVA: Şiddetli yıldırım nedeniyle kasaba hattında voltaj dalgalanması yaşanıyor...",
        look: { style: "helmet", outfit: "#ea580c", outfit2: "#18181b", capColor: "#dc2626" },
        car: { shape: "moto", type: "Kurye Motosikleti", color: "#ea580c", plate: "52 MRT 08", pumpNote: "Sepetli paket motosikleti, plaka temiz." },
        idCard: { fullName: "Mert Doğan", birthYear: 2002, validUntil: "2031", plateMatch: "52 MRT 08", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha temiz.",
        powerOutage: true, // ⚡ ELEKTRİK ŞALTERİ ATACAK!
        requests: { fuelType: "benzin", fuel: 200, drink: null, toast: null, market: "enerji" },
        cashBill: { denom: 200, fake: false, serial: "TR-419002", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 135,
        greeting: "Abi selam, yağmurda sırılsıklam oldum! Motora 200 liralık BENZİN, bana da bir enerji içeceği ateşler misin?",
        questions: [
          { btn: "Bu fırtınada hâlâ paket mi dağıtıyorsun?", mood: "warm", reply: "Ekmek parası abi, son siparişi bıraktım eve dönüyorum." },
          { btn: "Kaskını neden çıkarmadın?", mood: "neutral", reply: "İçlik ıslandı abi, kimliğime bakabilirsin hiçbir yamuğumuz yok." },
          { btn: "Yolda garip birini gördün mü?", mood: "neutral", reply: "Arkamdaki siyah arabada bıyıklı bir adam polis telsizi taklidi yapıyordu, tuhafıma gitti." }
        ],
        outcomes: {
          serve: { correct: true, badge: "HIZLI SERVİS!", title: "Şalter Arızasına Rağmen Mert'i Uğurladın!", desc: "Hem elektriği geri açtın hem de sahte memur uyarısını aldın!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "MÜŞTERİ KAYBI", title: "Üşümüş kuryeyi yağmurda bıraktın!", desc: "Satış kaçtı (-50 ₺).", penalty: 50 },
          police: { correct: false, badge: "YANLIŞ İHBAR", title: "Masum kuryeye polis çağırdın!", desc: "Evrakları tam çıktı (-90 ₺).", penalty: 90 }
        }
      },

      {
        id: "n2_3",
        name: "Sahte Müfettiş Tarık",
        role: "Şüpheli Resmi Görevli",
        time: "02:20",
        radioTicker: "📻 FM 98.4 UYARI: Sahte görev kimliğiyle iş yerlerinden kayıt toplamaya çalışan dolandırıcılara dikkat!",
        look: { style: "bald", skin: "#d9a077", outfit: "#1f2937", outfit2: "#374151", hairColor: "#111827", mustache: true, scar: true },
        car: { shape: "sedan", type: "Siyah Kiralık Otomobil", color: "#111827", plate: "06 KRL 99", pumpNote: "⚠️ Resmi araç değil, kiralık plaka çerçevesi var!" },
        idCard: { fullName: "Tarık Vural (SAHTE MÜFETTİŞ)", birthYear: 1979, validUntil: "2019 (SÜRESİ GEÇMİŞ!)", plateMatch: "06 RESMİ 01 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: false,
        depotNote: "Arka depo temiz.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: "turk", toast: null, market: null },
        cashBill: { denom: 100, fake: true, serial: "FK-999111", uvText: "⚠️ SAHTE 100 ₺ BANKNOT!" },
        wantsCharger: false,
        phoneData: null,
        reward: 95,
        greeting: "Bakanlık teftişinden geliyorum genç! Bana bir Türk kahvesi yap, sonra da kayıp kasiyer Emre'den kalan ne varsa teslim et.",
        questions: [
          { btn: "Kimliğinizin süresi 2019'da bitmiş görünüyor?", mood: "angry", reply: "Yenisi basımda kardeşim! Devlet memurunu mu sorguluyorsun sen?!" },
          { btn: "Gece 02:20'de teftiş mi olur?", mood: "nervous", reply: "Olağanüstü durum var dedik ya, ver kahvemi çıkar dosyaları!" },
          { btn: "Uzattığınız 100 lira da sahte duruyor?", mood: "angry", reply: "Bana bak başını belaya sokarım senin!" }
        ],
        outcomes: {
          serve: { correct: false, badge: "KÖSTEBEĞE KANDIN!", title: "Hem Sahte Parayı Aldın Hem Bilgi Kaptırdın!", desc: "Kimliği ve parası sahteydi (-180 ₺)!", penalty: 180 },
          hide: { correct: false, badge: "BÜYÜK HATA!", title: "Sahte Müfettişi Arka Odaya Aldın!", desc: "Emre'nin dolabını karıştırıp kaçtı (-200 ₺)!", penalty: 200 },
          lock: { correct: true, badge: "MASKESİ DÜŞTÜ!", title: "Sahte Kimliği Yakalayıp Kapıyı Kilitledin! (+140 ₺)", desc: "Foyası ortaya çıkınca arkasına bakmadan kaçtı!", bonus: 140, badgeUnlock: "id_detective" },
          police: { correct: true, badge: "GERÇEK POLİS GELDİ!", title: "Sahte Müfettiş Kıskıvrak Tutuklandı! (+190 ₺)", desc: "Kuzgun'un delil karartmak için gönderdiği adamı yakalattın!", bonus: 190, badgeUnlock: "id_detective" }
        }
      },

      {
        id: "n2_4",
        name: "DJ Ece",
        role: "Radyo Programcısı",
        time: "03:20",
        radioTicker: "📻 FM 98.4 GECE SEANSI: Yağmurlu yollarda direksiyon sallayan herkese selam olsun...",
        look: { style: "curly", skin: "#fad2b4", outfit: "#9333ea", outfit2: "#3b0764", hairColor: "#7c2d12" },
        car: { shape: "sedan", type: "Kırmızı Hatchback", color: "#ef4444", plate: "35 ECE 99", pumpNote: "Arka koltukta kulaklık ve plak çantası var. Tertemiz." },
        idCard: { fullName: "Ece Yıldırım", birthYear: 1998, validUntil: "2032", plateMatch: "35 ECE 99", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: "lpg", fuel: 250, drink: "sutlu", toast: "kasarli", market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-449021", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 165,
        greeting: "Selam! Yayından çıktım çok acıktım; arabaya 250 liralık LPG, bana da sütlü latte ve kaşarlı tost hazırlar mısın?",
        questions: [
          { btn: "FM 98.4'teki ses sen misin yoksa?", mood: "warm", reply: "Evet benim! Gece haberlerini okurken sizin istasyonu o kadar anlattım ki uğramadan geçemedim." },
          { btn: "Yolda şüpheli panelvan gördün mü?", mood: "neutral", reply: "Evet! 34 KZG 19 plakalı koyu gri bir minibüs virajda pusuya yatmış gibi bekliyordu!" },
          { btn: "Yol açık mı ileride?", mood: "warm", reply: "Yağış var ama açık, kolay gelsin sana!" }
        ],
        outcomes: {
          serve: { correct: true, badge: "KEYİFLİ MOLA", title: "DJ Ece Bahşiş Bırakarak Ayrıldı!", desc: "Doğru LPG ve tost servisiyle tam puan aldın!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "MÜŞTERİ KAYBI", title: "Radyocu Ece'yi kapıda bıraktın!", desc: "Temiz kazanç kaçtı (-60 ₺).", penalty: 60 },
          police: { correct: false, badge: "ASILSIZ İHBAR", title: "Masum müşteriye polis çağırdın!", desc: "Ceza kesildi (-100 ₺).", penalty: 100 }
        }
      },

      {
        id: "n2_5",
        name: "Panelvanlı Rasim",
        role: "Gece Nakliyecisi",
        time: "04:30",
        radioTicker: "🚨 EMNİYET BÜLTENİ: '34 KZG 19' plakalı koyu gri panelvan minibüs her yerde aranıyor!",
        look: { style: "beanie", skin: "#d2996e", outfit: "#312e81", outfit2: "#090d1a", capColor: "#1e1b4b", beard: true },
        car: {
          shape: "van",
          type: "Koyu Gri Panelvan",
          color: "#334155",
          plate: "34 KZG 19",
          muddyPlate: false,
          vestClue: false,
          pumpNote: "🚨 ARANAN PLAKA: '34 KZG 19'! Arka camlar siyah filmli, içeride oksijen kaynağı var!"
        },
        idCard: { fullName: "Rasim Kurt", birthYear: 1983, validUntil: "2028", plateMatch: "34 KZG 19", isFake: false },
        depotIntruder: true,
        depotNote: "🚨 DİKKAT! Minibüsten inen ortağı ARKA DEPO kilidini kesmeye çalışıyor!",
        powerOutage: false,
        requests: { fuelType: "mazot", fuel: 450, drink: null, toast: null, market: "yag" },
        cashBill: { denom: 200, fake: true, serial: "KZ-001919", uvText: "⚠️ SAHTE 200 ₺! ŞERİT YOK!" },
        wantsCharger: true,
        phoneData: {
          owner: "Rasim'in Telefonu",
          locked: true,
          pin: "1919",
          pinHint: "Kilit İpucu: ' Plakamın sayısı (19) yan yana iki kez '",
          wallpaperTone: "crimson",
          notifications: [
            { app: "ŞİFRELİ MESAJ", sender: "Kuzgun", body: "Emre'yi eski maden deposuna kapattık. Pompa 4'ün altındaki altın zulasını açmak için yağ ve kaynak lazım!" }
          ]
        },
        reward: 155,
        greeting: "450'lik MAZOT bas, raftan da bir motor yağı ver. Şu telefonu prize tak ama sakın şifresini deneme!",
        questions: [
          { btn: "Minibüsteki kaynak makinesi ne iş?", mood: "angry", reply: "Tesisatçıyız birader, sana mı soracağız ne taşıdığımızı?!" },
          { btn: "Bültende sizin 34 KZG 19 plaka aranıyor?", mood: "nervous", reply: "İsim benzerliğidir o, çabuk ver yağı gideyim!" },
          { btn: "Verdiğiniz 200 lira da sahte?", mood: "angry", reply: "Fazla kurcalayanın sonu Emre gibi olur koçum!" }
        ],
        outcomes: {
          police: { correct: true, badge: "ŞİFRE KIRILDI!", title: "Panelvan Bağlandı, Maden Deposu Bulundu! (+290 ₺)", desc: "1919 şifresini kırıp Emre'nin tutulduğu yeri ve altın zulasını öğrendin!", bonus: 290, clue: "clue_mine", badgeUnlock: "code_breaker" },
          lock: { correct: true, badge: "SAVUNMA", title: "Kepengi kilitleyip soyguncuları kovdun (+85 ₺)", desc: "Zarar görmedin ama minibüs kaçtı.", bonus: 85 },
          serve: { correct: false, badge: "AĞIR KAYIP!", title: "Aranan Kuryeye Mazot Verip Sahte Para Aldın!", desc: "Hem kasa soyuldu hem suçlu kaçtı (-220 ₺)!", penalty: 220 },
          hide: { correct: false, badge: "FELAKET!", title: "Çete Üyesini İçeri Aldın!", desc: "Depoyu yağmaladılar (-250 ₺)!", penalty: 250 }
        }
      }
    ]
  },

  // =========================================================================
  // 3. GECE (5 YENİ MÜŞTERİ): GECE YARISI KAÇAKLARI
  // =========================================================================
  {
    nightNumber: 3,
    title: "3. GECE: GECE KAÇAKLARI",
    wantedPoster: {
      title: "ARANAN: 'AKREP' LAKABIYLA BİLİNEN SİYAH GÖZLÜKLÜ TETİKÇİ (06 AKR 66)",
      desc: "Gece yarısı bile güneş gözlüğü takan 'Akrep' ve çalıntı plakalı kalpazan Haluk aranıyor!"
    },
    bossSms:
      "3. Geceye ulaştın! Polis eski maden deposuna baskın yaptı ama Emre karanlıkta kaçmış. Bu gece kimseye acıma, ama yardıma muhtaç olanı da koru!",
    customers: [
      {
        id: "n3_1",
        name: "Taksici Mahmut",
        role: "Durağın Emektarı",
        time: "00:15",
        radioTicker: "📻 FM 98.4: Maden deposu baskınında kaçakçılık izleri bulundu, Emre her yerde aranıyor...",
        look: { style: "short", skin: "#e0a97f", outfit: "#b45309", outfit2: "#fef3c7", hairColor: "#52525b", mustache: true },
        car: { shape: "taxi", type: "Sarı Ticari Taksi", color: "#f59e0b", plate: "52 T 0144", pumpNote: "Resmi durak taksisi, müşteri koltuğu boş." },
        idCard: { fullName: "Mahmut Şahin", birthYear: 1969, validUntil: "2029", plateMatch: "52 T 0144", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: "lpg", fuel: 300, drink: "cay", toast: "sucuklu", market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-908172", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 170,
        greeting: "Selamünaleyküm kardeşim. Taksiye 300 liralık LPG, bana da demli bir çayla sucuklu tost yap bakalım. Maden sapağında tuhaf şeyler gördüm!",
        questions: [
          { btn: "Ne gördün Mahmut Abi?", mood: "nervous", reply: "Tarlaların içinden kolu sargılı bir çocuk koşuyordu! Arkasından da siyah gözlüklü bir adam aramaya çıkmıştı." },
          { btn: "Başka kimse var mıydı yolda?", mood: "neutral", reply: "Bir de telli duvaklı bir gelin arabası son sürat buraya geliyordu, kızcağız ağlıyor gibiydi." },
          { btn: "İşler nasıl bu gece?", mood: "warm", reply: "Çok şükür kardeşim, senin çay da pek güzel oluyormuş." }
        ],
        outcomes: {
          serve: { correct: true, badge: "ESNAF DOSTU", title: "Mahmut Abi Uyardı ve Memnun Ayrıldı!", desc: "Birazdan gelecek kaçak gelin ve siyah gözlüklü tetikçi için hazırlıklısın!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "AYIP OLDU", title: "Durağın taksicisini geri çevirdin!", desc: "Kazanç kaçtı (-60 ₺).", penalty: 60 },
          police: { correct: false, badge: "YANLIŞ İHBAR", title: "Taksiciye polis çağırdın!", desc: "Ceza kesildi (-100 ₺).", penalty: 100 }
        }
      },

      {
        id: "n3_2",
        name: "Seda (Kaçan Gelin)",
        role: "Düğünden Kaçan Genç Kız",
        time: "01:15",
        radioTicker: "📻 FM 98.4: Gece saatlerinde konvoy halinde hız yapan araçlara karşı uyarı yapıldı...",
        look: { style: "veil", skin: "#fad2b4", outfit: "#f8fafc", outfit2: "#e2e8f0", hairColor: "#451a03" },
        car: { shape: "sedan", type: "Süslü Beyaz Otomobil", color: "#f8fafc", plate: "52 GLN 01", pumpNote: "Ön kaputta kopmuş gelin çiçeği kurdelesi var." },
        idCard: { fullName: "Seda Demir", birthYear: 2000, validUntil: "2031", plateMatch: "52 GLN 01", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha sakin.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: null, toast: null, market: "su" },
        cashBill: { denom: 100, fake: false, serial: "TR-112840", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Seda'nın Telefonu",
          locked: false,
          pin: null,
          wallpaperTone: "indigo",
          notifications: [
            { app: "WHATSAPP", sender: "Ablam", body: "Seda sakın o tefeci aileye boyun eğme! Benzinlikte bekle, 20 dakikaya eniştenle seni almaya geliyoruz!" }
          ]
        },
        reward: 90,
        greeting: "Lütfen şaşırma... Zorla evlendirildiğim düğünden kaçtım! Bir su verip ablam gelene kadar beni arka odada saklar mısın? Konvoy peşimde!",
        questions: [
          { btn: "Neden düğünden kaçtın?", mood: "nervous", reply: "Damat dedikleri adam Kuzgun çetesinin tefecisi çıktı! Nikah masasına oturmadan anahtarı kapıp kaçtım!" },
          { btn: "Ablan ne zaman gelecek?", mood: "warm", reply: "Telefonumdaki mesajda yazıyor, 20 dakikaya buradalar. Ne olur 'İçeri Sakla'!" },
          { btn: "Silahlılar mı?", mood: "nervous", reply: "Evet, konvoy beni görürse zorla götürürler!" }
        ],
        outcomes: {
          hide: { correct: true, badge: "KAHRAMAN ESNAF!", title: "Kaçan Gelin Seda'yı Arka Odaya Sakladın! (+170 ₺)", desc: "Ablası gelip Seda'yı güvenle aldı ve sana teşekkür ikramiyesi bıraktı!", bonus: 170, badgeUnlock: "safe_haven" },
          serve: { correct: false, badge: "TEHLİKELİ", title: "Seda'yı dışarıda bıraktın, konvoydan zor kurtuldu!", desc: "İçeri saklaman gerekiyordu (-50 ₺).", penalty: 50 },
          lock: { correct: false, badge: "ACIMASIZ KARAR", title: "Yardım isteyen gelini kapıda bıraktın!", desc: "Büyük vicdan azabı (-100 ₺).", penalty: 100 },
          police: { correct: true, badge: "JANDARMA KORUMASI", title: "Ekip gelip Seda'yı ailesine ulaştırdı (+90 ₺)", desc: "Güvenli şekilde koruma altına alındı.", bonus: 90 }
        }
      },

      {
        id: "n3_3",
        name: "Kalpazan Haluk",
        role: "Şüpheli Hurdacı",
        time: "02:20",
        radioTicker: "📻 FM 98.4 ASAYİŞ: Bantlanmış sahte plakalı minibüsle sahte 200 TL dağıtan şahıs aranıyor...",
        look: { style: "cap", skin: "#dfb18b", outfit: "#3f3f46", outfit2: "#18181b", capColor: "#15803d", hairColor: "#27272a", scar: true },
        car: { shape: "van", type: "Kirli Beyaz Minibüs", color: "#cbd5e1", plate: "34 HKL 00", muddyPlate: true, pumpNote: "⚠️ Plaka koli bandıyla yapıştırılmış!" },
        idCard: { fullName: "Haluk Boz", birthYear: 1981, validUntil: "2020 (GEÇERSİZ!)", plateMatch: "16 Yalan 99 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: false,
        depotNote: "Arka saha sakin.",
        powerOutage: true, // ⚡ SİGORTA ATACAK!
        requests: { fuelType: "mazot", fuel: 400, drink: null, toast: null, market: "enerji" },
        cashBill: { denom: 200, fake: true, serial: "FK-000200", uvText: "⚠️ SAHTE FOTOKOPİ 200 ₺!" },
        wantsCharger: false,
        phoneData: null,
        reward: 145,
        greeting: "Karanlıkta işimiz çabuk bitsin koçum! 400'lük MAZOT bas, bir de enerji içeceği ver. Parayı tezgâha koydum!",
        questions: [
          { btn: "Elektrik kesilince sahte parayı yutturacağını mı sandın?", mood: "angry", reply: "Ne sahtesi birader, kes sesini doldur mazotu!" },
          { btn: "Ehliyetin hem geçmiş hem plaka tutmuyor?", mood: "nervous", reply: "Amma meraklı çıktın be!" },
          { btn: "Plakan neden bantlı?", mood: "angry", reply: "Düştü yolda yapıştırdık, sana ne?!" }
        ],
        outcomes: {
          serve: { correct: false, badge: "SOYULDUN!", title: "Hem Sahte Para Hem Sahte Plakayı Yuttun! (-210 ₺)", desc: "Kalpazan karanlıktan faydalanıp seni çarptı!", penalty: 210 },
          hide: defaultHideWrong,
          lock: { correct: true, badge: "GÖZ AÇTIRMADIN!", title: "Şalteri Açıp Kalpazanı Kapı Dışı Ettin! (+130 ₺)", desc: "Sahte parasını yüzüne çarptın!", bonus: 130, badgeUnlock: "fake_hunter" },
          police: { correct: true, badge: "TAM İSABET!", title: "Kalpazan Haluk Kıskıvrak Alındı! (+190 ₺)", desc: "Çalıntı minibüs ve sahte banknotlar ele geçirildi!", bonus: 190, badgeUnlock: "fake_hunter" }
        }
      },

      {
        id: "n3_4",
        name: "Leyla (Muhbir)",
        role: "Eski Çete Muhasebecisi",
        time: "03:25",
        radioTicker: "📻 FM 98.4: Organize suç örgütü 'Kuzgun'un mali kayıtlarını sızdıran gizli tanık aranıyor...",
        look: { style: "long", skin: "#f3c6a5", outfit: "#be123c", outfit2: "#1f2937", hairColor: "#090d1a", glasses: true },
        car: { shape: "sedan", type: "Bordo Otomobil", color: "#9f1239", plate: "06 LYL 77", pumpNote: "Plaka gerçek, arka koltukta evrak çantası var." },
        idCard: { fullName: "Leyla Erdem", birthYear: 1991, validUntil: "2030", plateMatch: "06 LYL 77", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo temiz.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: "turk", toast: null, market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-774512", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Leyla'nın Telefonu",
          locked: true,
          pin: "1991",
          pinHint: "Kilit İpucu: ' Kimlik kartımdaki doğum yılım ' (🪪 Kimlik İste ile bak!)",
          wallpaperTone: "indigo",
          notifications: [
            { app: "GİZLİ DOSYA", sender: "Savcılık Notu", body: "Kuzgun'un plakası 06 KZG 001 ve özel telefon şifresi 4004! Birazdan tetikçisi Akrep (06 AKR 66) istasyonu yoklayacak!" }
          ]
        },
        reward: 115,
        greeting: "Sade bir Türk kahvesi lütfen. Telefonumu şarja bırakıyorum; kimliğimden doğum yılıma bakıp şifresini aç ve içindeki notu oku!",
        questions: [
          { btn: "Neden bu bilgileri bana veriyorsun?", mood: "warm", reply: "Çünkü Kuzgun'u durdurabilecek tek kişi sensin. Sabaha savcılığa teslim olacağım." },
          { btn: "Kimliğini görebilir miyim?", mood: "neutral", reply: "Buyur, doğum yılım orada yazıyor; telefon şifrem de o." },
          { btn: "Peşinde kim var?", mood: "nervous", reply: "Kuzgun'un tetikçisi 'Akrep'! Gece vakti bile siyah gözlük takar, gelirse hemen 112'ye bas!" }
        ],
        outcomes: {
          serve: { correct: true, badge: "ALTIN BİLGİ!", title: "Kuzgun'un Şifresini (4004) Öğrendin!", desc: "Kimlikten doğum yılını (1991) bulup gizli dosyayı okudun!", clue: "clue_code", badgeUnlock: "code_breaker" },
          hide: { correct: true, badge: "GİZLİ TANIK KORUNDU", title: "Leyla'yı Güvenle Sakladın (+130 ₺)", desc: "Kuzgun'un şifresini (4004) sana verdi!", bonus: 130, clue: "clue_code" },
          lock: { correct: false, badge: "FIRSAT KAÇTI", title: "Sana yardım eden muhbiri kovdun!", desc: "Kritik istihbarat kaçtı (-80 ₺).", penalty: 80 },
          police: { correct: false, badge: "ERKEN SİREN", title: "Leyla savcılığa kendi gidecekti, korkuttun!", desc: "Sirenler tetikçiyi uyardı (-60 ₺).", penalty: 60 }
        }
      },

      {
        id: "n3_5",
        name: "Tetikçi 'Akrep'",
        role: "Siyah Gözlüklü Yabancı",
        time: "04:40",
        radioTicker: "🚨 KIRMIZI BÜLTEN: '06 AKR 66' plakalı siyah spor araçlı, güneş gözlüklü tetikçi 'Akrep' aranıyor!",
        look: { style: "slick", skin: "#d6a27c", outfit: "#090d1a", outfit2: "#450a0a", hairColor: "#090d1a", sunglasses: true, scar: true },
        car: { shape: "sport", type: "Siyah Spor Kupe", color: "#090d1a", plate: "06 AKR 66", pumpNote: "🚨 ARANAN PLAKA: '06 AKR 66'! Arananlar bültenindeki şahıs!" },
        idCard: { fullName: "Kemal Sönmez (SAHTE)", birthYear: 1984, validUntil: "2022 (GEÇERSİZ!)", plateMatch: "34 KML 10 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: true,
        depotNote: "🚨 TEHLİKE! Akrep'in adamı ARKA DEPO kapısını levye ile kanırtıyor!",
        powerOutage: false,
        requests: { fuelType: "benzin", fuel: 500, drink: null, toast: null, market: "enerji" },
        cashBill: { denom: 200, fake: false, serial: "TR-551902", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 160,
        greeting: "500'lük BENZİN doldur, bir de enerji içeceği ver aslanım. Bordo arabalı bir kadın uğradı mı buraya? Yalan söylersen yakarım bu büfeyi.",
        questions: [
          { btn: "Gece 04:40'ta neden güneş gözlüğü takıyorsun?", mood: "angry", reply: "Gözlerim ışığa hassas koçum, fazla konuşma işini yap!" },
          { btn: "Arananlar ilanındaki 'Akrep' siz misiniz?", mood: "angry", reply: "Kaşınıyorsun bak... Hemen benzinimi ver!" },
          { btn: "Arka depodaki adamınız ne yapıyor?", mood: "nervous", reply: "Ne adamı be?! Kes sesini!" }
        ],
        outcomes: {
          police: { correct: true, badge: "TETİKÇİ PAKETLENDİ!", title: "'Akrep' ve Depodaki Ortağı Yakalandı! (+310 ₺ Ödül)", desc: "Bültendeki eşkâli tanıdın ve 112 ile çetenin sağ kolunu çökerttin!", bonus: 310, badgeUnlock: "id_detective" },
          lock: { correct: true, badge: "ÇELİK KEPENK", title: "Kepengi indirip tetikçiyi dışarıda bıraktın (+90 ₺)", desc: "Saldırıyı savuşturdun ama kaçtı.", bonus: 90 },
          serve: { correct: false, badge: "BÜYÜK FELAKET!", title: "Aranan Tetikçiye Benzin Verip Gönderdin!", desc: "Polis kamera kayıtlarından ağır ceza kesti (-220 ₺)!", penalty: 220 },
          hide: { correct: false, badge: "İNTİHAR HAMLESİ!", title: "Tetikçiyi Dükkânın İçine Aldın!", desc: "Kasayı soyup seni kilitledi (-260 ₺)!", penalty: 260 }
        }
      }
    ]
  },

  // =========================================================================
  // 4. GECE (5 YENİ MÜŞTERİ): EMRE GERİ DÖNÜYOR!
  // =========================================================================
  {
    nightNumber: 4,
    title: "4. GECE: SAHTE AMBULANS",
    wantedPoster: {
      title: "ARANAN: SAHTE AMBULANS (34 KZG 112) VE KAÇAK DEFİNECİ",
      desc: "Kuzgun çetesinin yaralı Emre'yi kaçırmak için sahte ambulans kullandığı tespit edildi!"
    },
    bossSms:
      "4. Gece! Emre her an istasyona sığınabilir! Onu koru ama peşinden gelecek kılık değiştirmiş çete üyelerine sakın kanma!",
    customers: [
      {
        id: "n4_1",
        name: "Emekli Albay Kemal",
        role: "Eski Harita Subayı",
        time: "00:20",
        radioTicker: "📻 FM 98.4: Kasaba genelinde fırtına ve yıldırım uyarısı devam ediyor...",
        look: { style: "short", skin: "#e0a97f", outfit: "#3f6212", outfit2: "#1a2e05", hairColor: "#cbd5e1", mustache: true },
        car: { shape: "suv", type: "Yeşil Arazi Aracı", color: "#3f6212", plate: "06 KML 52", pumpNote: "Askeri emekli kartı camda, bakımlı arazi aracı." },
        idCard: { fullName: "Kemal Bozkurt", birthYear: 1962, validUntil: "2030", plateMatch: "06 KML 52", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha temiz.",
        powerOutage: false,
        requests: { fuelType: "mazot", fuel: 400, drink: "turk", toast: null, market: "yag" },
        cashBill: { denom: 200, fake: false, serial: "TR-301928", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 180,
        greeting: "İyi nöbetler evlat. Arazi aracına 400 liralık MAZOT, bir motor yağı ve sade bir Türk kahvesi rica edeceğim.",
        questions: [
          { btn: "Bu istasyonun altındaki eski tankları biliyor musunuz?", mood: "neutral", reply: "1980'lerde yapıldı evlat; Pompa 4'ün altındaki kör tank doğrudan arka depoya bağlanır. Kaçakçılar orayı zula yapmış olmalı!" },
          { btn: "Bu gece hava nasıl komutanım?", mood: "warm", reply: "Sert rüzgâr var ama nöbetçinin gözü uyku tutmaz, aferin sana." },
          { btn: "Yolda dikkat çeken bir araç var mıydı?", mood: "neutral", reply: "Sirenleri sönük eski bir ambulans maden kavşağında bekliyordu, pek hayra alamet değil." }
        ],
        outcomes: {
          serve: { correct: true, badge: "SAYGILI HİZMET", title: "Albay Kemal'den Tünel Bilgisini Aldın!", desc: "Birazdan gelebilecek sahte ambulansa karşı uyarıldın!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "AYIP OLDU", title: "Emekli albayı kapıda bıraktın!", desc: "Kazanç kaçtı (-70 ₺).", penalty: 70 },
          police: { correct: false, badge: "YANLIŞ İHBAR", title: "Asılsız ihbar cezası!", desc: "Evrakları tertemizdi (-100 ₺).", penalty: 100 }
        }
      },

      {
        id: "n4_2",
        name: "Hacker Tuna",
        role: "Gece Yazılımcısı",
        time: "01:25",
        radioTicker: "📻 FM 98.4 TEKNOLOJİ: Bölge baz istasyonunda siber hareketlilik saptandı...",
        look: { style: "beanie", skin: "#fad2b4", outfit: "#0284c7", outfit2: "#0f172a", capColor: "#38bdf8", glasses: true },
        car: { shape: "sedan", type: "Mavi Otomobil", color: "#0284c7", plate: "34 TNA 42", pumpNote: "Arka koltukta dizüstü bilgisayar çantaları var." },
        idCard: { fullName: "Tuna Yılmaz", birthYear: 2003, validUntil: "2033", plateMatch: "34 TNA 42", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha sakin.",
        powerOutage: true, // ⚡ SİGORTA ATACAK!
        requests: { fuelType: null, fuel: 0, drink: "sade", toast: "sucuklu", market: "enerji" },
        cashBill: { denom: 200, fake: false, serial: "TR-817263", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 150,
        greeting: "Selam abi! Sabaha kadar kod yazacağım; hem sade kahve hem enerji içeceği hem de sucuklu tost alayım ki beynim çalışsın!",
        questions: [
          { btn: "Az önce şalter neden attı sence?", mood: "nervous", reply: "Abi dışarıdaki direğe kaçak hat bağlamışlar, Kuzgun çetesi kameraları kör etmeye çalışıyor olabilir!" },
          { btn: "Ne projesi üstünde çalışıyorsun?", mood: "warm", reply: "Üniversite bitirme projem abi, son teslim yarın sabah." },
          { btn: "Kimliğin yanında mı?", mood: "neutral", reply: "Tabii abi buyur bak." }
        ],
        outcomes: {
          serve: { correct: true, badge: "ENERJİ DOLU!", title: "Tuna Bahşiş Bırakarak Ayrıldı!", desc: "Şalteri hızla açıp siparişi yetiştirdin!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "MÜŞTERİ KAYBI", title: "Öğrenciyi geri çevirdin!", desc: "Satış kaçtı (-55 ₺).", penalty: 55 },
          police: { correct: false, badge: "YANLIŞ İHBAR", title: "Masum öğrenciye polis çağırdın!", desc: "Ceza kesildi (-90 ₺).", penalty: 90 }
        }
      },

      {
        id: "n4_3",
        name: "Defineci Veli",
        role: "Çamurlu Kamyonetçi",
        time: "02:25",
        radioTicker: "📻 FM 98.4 ASAYİŞ: Tarihi sit alanında kaçak kazı yapıp sahte para kullanan şahıs aranıyor!",
        look: { style: "trucker", skin: "#d2996e", outfit: "#713f12", outfit2: "#422006", capColor: "#ca8a04", beard: true },
        car: { shape: "truck", type: "Çamurlu Kamyonet", color: "#854d0e", plate: "55 DFN 09", muddyPlate: true, pumpNote: "⚠️ Kasada kazma, kürek ve metal dedektörü var!" },
        idCard: { fullName: "Veli Çakır (SAHTE)", birthYear: 1977, validUntil: "2020 (GEÇERSİZ!)", plateMatch: "05 AAA 11 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: false,
        depotNote: "Arka depo temiz.",
        powerOutage: false,
        requests: { fuelType: "lpg", fuel: 300, drink: "cay", toast: "kasarli", market: null },
        cashBill: { denom: 200, fake: true, serial: "FK-777000", uvText: "⚠️ SAHTE 200 ₺! KAĞIT BOzuk!" },
        wantsCharger: false,
        phoneData: null,
        reward: 155,
        greeting: "300'lük LPG bas yeğenim, bir çay bir de kaşarlı tost ver. Dağda bahçe belledik acıktık!",
        questions: [
          { btn: "Gece 02:25'te metal dedektörüyle mi bahçe belledin?", mood: "nervous", reply: "Su borusu aradık yeğenim ya, ne dedektörü!" },
          { btn: "Verdiğin 200 lira da kimliğin de sahte?", mood: "angry", reply: "Uzatma be, vermezsen verme!" },
          { btn: "Plakan neden çamurlu?", mood: "nervous", reply: "Tarladan çıktık dedik ya!" }
        ],
        outcomes: {
          serve: { correct: false, badge: "KANDIRILDIN!", title: "Kaçak Definecinin Sahte Parasını Aldın! (-200 ₺)", desc: "Hem kimliği hem parası sahteydi!", penalty: 200 },
          hide: defaultHideWrong,
          lock: { correct: true, badge: "GEÇİT YOK!", title: "Sahte Parayı Yakalayıp Kepengi İndirdin! (+125 ₺)", desc: "Defineci arkasına bakmadan kaçtı!", bonus: 125, badgeUnlock: "fake_hunter" },
          police: { correct: true, badge: "KAÇAKÇI YAKALANDI!", title: "Jandarma Defineci Veli'yi Aldı! (+180 ₺)", desc: "Kaçak kazı malzemeleri ve sahte paralar ele geçirildi!", bonus: 180, badgeUnlock: "id_detective" }
        }
      },

      {
        id: "n4_4",
        name: "Emre (Kayıp Kasiyer!)",
        role: "Eski Gece Vardiyacısı",
        time: "03:30",
        radioTicker: "📻 FM 98.4: Yağmur altında maden yolundan kasabaya inen bir gencin görüldüğü bildirildi...",
        look: { style: "curly", skin: "#f3c6a5", outfit: "#dc2626", outfit2: "#1e293b", hairColor: "#292524", bandage: true },
        car: { shape: "walk", type: "Araç Yok (Koşarak Yaya Geldi!)", color: "#1e293b", plate: "YAYA GELDİ", pumpNote: "Pompa 4 boş! Emre çamurlar içinde yaya olarak sığındı!" },
        idCard: { fullName: "Emre Kaya (SON İSTASYON PERSONELİ)", birthYear: 2004, validUntil: "2034", plateMatch: "YAYA", isFake: false },
        depotIntruder: false,
        depotNote: "Uzakta sirenleri kapalı sahte bir ambulans yaklaşıyor!",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: null, toast: "sucuklu", market: "su" },
        cashBill: { denom: 100, fake: false, serial: "TR-040404", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 100,
        greeting: "Kardeşim aç kapıyı, BEN EMRE! Maden deposundan kaçtım! Çok açım, bir suyla sucuklu tost verip beni hemen ARKA ODAYA SAKLA! Peşimde Kuzgun'un sahte ambulansı var!",
        questions: [
          { btn: "Gerçekten Emre olduğunu kanıtla!", mood: "nervous", reply: "Personel kimliğime bak! Pompa 4'ün altındaki kör tankta Kuzgun'un kaçak altınlarını görünce beni kaçırdılar!" },
          { btn: "Neden hemen 112'yi aramıyoruz?", mood: "warm", reply: "Arkamdaki sahte ambulans siren sesini duyarsa kaçar! Beni 'İçeri Sakla', 5 dakika sonra sahte ambulans gelince 112'ye basıp suçüstü yakalat!" },
          { btn: "Yaran derin mi?", mood: "neutral", reply: "Nermin Abla sardı, iyiyim; yeter ki beni içeri sakla!" }
        ],
        outcomes: {
          hide: { correct: true, badge: "EMRE KURTARILDI!", title: "Emre'yi Arka Odaya Saklayıp Güvenceye Aldın! (+220 ₺)", desc: "Muhteşem hamle! Şimdi peşinden gelecek sahte ambulansa tuzak kurmaya hazırsın!", bonus: 220, clue: "clue_emre_rescued", badgeUnlock: "safe_haven" },
          serve: { correct: false, badge: "TEHLİKELİ!", title: "Emre'ye su verdin ama dışarıda bıraktın!", desc: "Arka odaya saklamadığın için tarlaya geri kaçmak zorunda kaldı (-80 ₺).", penalty: 80 },
          lock: { correct: false, badge: "BÜYÜK HATA!", title: "Kayıp İş Arkadaşını Kapıda Bıraktın!", desc: "Emre çaresizce karanlığa geri koştu (-190 ₺)!", penalty: 190 },
          police: { correct: true, badge: "KURTARILDI", title: "Polis Emre'yi aldı ama sahte ambulans uzaktan kaçtı (+90 ₺)", desc: "Emre kurtuldu fakat çete uyarıldı.", bonus: 90, clue: "clue_emre_rescued" }
        }
      },

      {
        id: "n4_5",
        name: "Sahte Ambulansçı",
        role: "Şüpheli Sağlık Görevlisi",
        time: "04:40",
        radioTicker: "🚨 ACİL UYARI: Çalıntı '34 KZG 112' plakalı sahte ambulans bölgede görüldü! Gerçek sağlık ekibi değildir!",
        look: { style: "cap", skin: "#dfb18b", outfit: "#f8fafc", outfit2: "#dc2626", capColor: "#dc2626", mustache: true, scar: true },
        car: { shape: "ambulance", type: "Sahte Ambulans Minibüsü", color: "#f8fafc", plate: "34 KZG 112", pumpNote: "🚨 ARANAN SAHTE AMBULANS: '34 KZG 112'! İçeride sedye yerine halat var!" },
        idCard: { fullName: "Dr. Kenan (SAHTE KART!)", birthYear: 1980, validUntil: "2021 (GEÇERSİZ!)", plateMatch: "34 HASTANE (UYUŞMUYOR!)", isFake: true },
        depotIntruder: true,
        depotNote: "🚨 TEHLİKE! Sahte hemşire kılığındaki ikinci adam ARKA DEPO kapısını zorluyor (Emre içeride)!",
        powerOutage: false,
        requests: { fuelType: "mazot", fuel: 400, drink: "sade", toast: null, market: null },
        cashBill: { denom: 200, fake: true, serial: "KZ-112112", uvText: "⚠️ SAHTE 200 ₺ BANKNOT!" },
        wantsCharger: false,
        phoneData: null,
        reward: 150,
        greeting: "Acil durum genç! 400'lük MAZOT ve sade kahve ver; ayrıca buraya sargılı bir hasta sığınmış, hemen bize teslim et hastaneye götüreceğiz!",
        questions: [
          { btn: "Bültende 34 KZG 112 sahte ambulans diye anons geçildi?", mood: "angry", reply: "Radyo yanlış biliyor koçum! Çocuğu ver yoksa fena olur!" },
          { btn: "Doktor kimliğinizin süresi neden 2021'de bitmiş?", mood: "nervous", reply: "Nöbet yoğunluğundan yenilemedik birader!" },
          { btn: "Arka depoyu neden zorluyorsunuz?", mood: "angry", reply: "Çocuğu sakladığını biliyoruz, aç kapıyı!" }
        ],
        outcomes: {
          police: { correct: true, badge: "TUZAK TUTTU!", title: "Sahte Ambulans Çetesi Suçüstü Yakalandı! (+320 ₺)", desc: "Depo alarmını çalıp 112'yi aradın; Emre kurtuldu, Kuzgun'un adamları kelepçelendi!", bonus: 320, badgeUnlock: "depot_guard" },
          lock: { correct: true, badge: "EMRE'Yİ KORUDUN", title: "Çelik kepengi kilitleyip sahte ambulansı püskürttün (+110 ₺)", desc: "Emre'yi alamadan kaçtılar!", bonus: 110 },
          serve: { correct: false, badge: "FELAKET!", title: "Sahte Ambulansa Hizmet Ettin!", desc: "Hem sahte parayı yuttun hem Emre'yi tehlikeye attın (-240 ₺)!", penalty: 240 },
          hide: { correct: false, badge: "KORKUNÇ HATA!", title: "Çete Üyesini Emre'nin Yanına Soktun!", desc: "Büyük felaket yaşandı (-280 ₺)!", penalty: 280 }
        }
      }
    ]
  },

  // =========================================================================
  // 5. GECE (5 YENİ MÜŞTERİ): SON İSTASYON BÜYÜK FİNAL!
  // =========================================================================
  {
    nightNumber: 5,
    title: "5. GECE: BÜYÜK FİNAL",
    wantedPoster: {
      title: "KIRMIZI BÜLTEN: ELEBAŞI 'KUZGUN' (06 KZG 001)",
      desc: "Siyah zırhlı SUV ile Pompa 4 altındaki altın zulası için bu gece bizzat geleceği istihbaratı alındı!"
    },
    bossSms:
      "5. ve Son Hikaye Gecen! Polis pusuda bekliyor ama Kuzgun çok kurnaz; avukatını, kaçan adamını ve şalter sabotajını gönderebilir. Efsane olmaya hazır mısın?",
    customers: [
      {
        id: "n5_1",
        name: "Gazeteci Pelin",
        role: "Araştırmacı Muhabir",
        time: "00:15",
        radioTicker: "📻 FM 98.4: Tüm ülke Son İstasyon'daki gizemli olayları konuşuyor, bu gece büyük operasyon bekleniyor...",
        look: { style: "bun", skin: "#fad2b4", outfit: "#d97706", outfit2: "#1e293b", hairColor: "#78350f" },
        car: { shape: "sedan", type: "Sarı Basın Aracı", color: "#eab308", plate: "34 BSN 24", pumpNote: "Ön camda ulusal basın kartı var. Temiz." },
        idCard: { fullName: "Pelin Arslan", birthYear: 1994, validUntil: "2031", plateMatch: "34 BSN 24", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: "benzin", fuel: 300, drink: "sutlu", toast: "kasarli", market: null },
        cashBill: { denom: 200, fake: false, serial: "TR-609114", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 175,
        greeting: "Merhaba! Sabahki büyük manşet için bölgedeyim; 300 liralık BENZİN, sütlü latte ve kaşarlı tost alabilir miyim?",
        questions: [
          { btn: "Kuzgun gerçekten bu gece gelecek mi?", mood: "neutral", reply: "Limandaki gemisi sabah 06:00'da kalkıyor! Pompa 4'ün altındaki çantaları almadan ülkeden çıkamaz, kesin gelecek!" },
          { btn: "Emre şimdi nerede?", mood: "warm", reply: "Savcılık korumasında ifade veriyor, sayende kurtuldu!" },
          { btn: "Haberde bizden de bahsedecek misin?", mood: "warm", reply: "Bu gece Kuzgun'u yakalatırsan yarın tüm Türkiye seni konuşacak!" }
        ],
        outcomes: {
          serve: { correct: true, badge: "MANŞET HAZIR", title: "Gazeteci Pelin Memnun Ayrıldı!", desc: "Sabah 06:00 gemisi ipucunu öğrendin!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "YANLIŞ KARAR", title: "Basın mensubunu kapıda bıraktın!", desc: "Kazanç kaçtı (-60 ₺).", penalty: 60 },
          police: { correct: false, badge: "ASILSIZ İHBAR", title: "Muhabire polis çağırdın!", desc: "Basın kartı gerçekti (-100 ₺).", penalty: 100 }
        }
      },

      {
        id: "n5_2",
        name: "Kaptan Rıza",
        role: "Şehirler Arası Otobüs Kaptanı",
        time: "01:15",
        radioTicker: "📻 FM 98.4 YOL DURUMU: Liman kavşağında özel harekat barikatı hazır bekliyor...",
        look: { style: "short", skin: "#e0a97f", outfit: "#1e3a8a", outfit2: "#f8fafc", hairColor: "#94a3b8", tie: "#1e40af", mustache: true },
        car: { shape: "truck", type: "Gece Yolcu Otobüsü", color: "#1d4ed8", plate: "34 KPT 61", pumpNote: "Yolcular içeride uyuyor, resmi sefer otobüsü." },
        idCard: { fullName: "Rıza Polat", birthYear: 1971, validUntil: "2030", plateMatch: "34 KPT 61", isFake: false },
        depotIntruder: false,
        depotNote: "Arka saha temiz.",
        powerOutage: false,
        requests: { fuelType: "mazot", fuel: 500, drink: "cay", toast: null, market: "su" },
        cashBill: { denom: 200, fake: false, serial: "TR-992811", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 195,
        greeting: "Hayırlı işler genç kaptan! Otobüse 500'lük MAZOT bas, bana da demli bir çayla su ver de 40 yolcuyu sağ salim ulaştıralım.",
        questions: [
          { btn: "Yolda şüpheli bir araç solladı mı?", mood: "neutral", reply: "Gümüş renkli lüks bir sedan solladı, içindeki kravatlı adam telefonda 'Kasiyere rüşvet verip susturacağım' diyordu!" },
          { btn: "Yolcular uyuyor mu kaptanım?", mood: "warm", reply: "Mışıl mışıl uyuyorlar evlat, gece kaptanlığı senin işin gibi dikkat ister." },
          { btn: "İyi yolculuklar dilerim.", mood: "warm", reply: "Sağ olasın aslanım, Allah kaza bela vermesin." }
        ],
        outcomes: {
          serve: { correct: true, badge: "UĞURLU SEFER", title: "Kaptan Rıza Rüşvetçi Avukatı Haber Verdi!", desc: "Bir sonraki müşterinin Kuzgun'un avukatı olduğunu artık biliyorsun!" },
          hide: defaultHideWrong,
          lock: { correct: false, badge: "MÜŞTERİ KAYBI", title: "Yolcu otobüsünü geri çevirdin!", desc: "Büyük mazot satışı kaçtı (-80 ₺).", penalty: 80 },
          police: { correct: false, badge: "YANLIŞ İHBAR", title: "Otobüs kaptanına polis çağırdın!", desc: "Ceza kesildi (-100 ₺).", penalty: 100 }
        }
      },

      {
        id: "n5_3",
        name: "Avukat Nejat",
        role: "Kuzgun'un Arabulucusu",
        time: "02:25",
        radioTicker: "📻 FM 98.4: Suç örgütünün tanıkları susturmak için sahte döviz ve banknot kullandığı saptandı...",
        look: { style: "slick", skin: "#eac09c", outfit: "#334155", outfit2: "#f8fafc", hairColor: "#475569", glasses: true, tie: "#7c3aed" },
        car: { shape: "sedan", type: "Gümüş Lüks Sedan", color: "#94a3b8", plate: "34 AVK 26", pumpNote: "Plaka kiralık şirket üstüne kayıtlı." },
        idCard: { fullName: "Nejat Soydan", birthYear: 1980, validUntil: "2029", plateMatch: "34 AVK 26", isFake: false },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: "turk", toast: null, market: "cikolata" },
        cashBill: { denom: 200, fake: true, serial: "KZ-202600", uvText: "⚠️ SAHTE RÜŞVET PARASI!" },
        wantsCharger: true,
        phoneData: {
          owner: "Nejat'ın Telefonu",
          locked: true,
          pin: "1980",
          pinHint: "Kilit İpucu: ' Kimlikteki doğum yılım ' (🪪 Kimlik İste ile bak!)",
          wallpaperTone: "crimson",
          notifications: [
            { app: "MESAJ • KUZGUN", sender: "Kuzgun", body: "Kasiyer çocuğa sahte paraları ver gözünü boya! Saat 04:45'te 06 KZG 001 ile gelip şalteri indireceğim!" }
          ]
        },
        reward: 130,
        greeting: "Bak delikanlı, bana bir Türk kahvesiyle çikolata ver. Telefonumu da şarja tak. Bu gece saat 04:00'ten sonra kameraları kapatırsan seni ihya ederiz, al şu 200'lüğü!",
        questions: [
          { btn: "Rüşvet diye uzattığınız 200 lira bile sahte!", mood: "nervous", reply: "Öhö... Karışmış canım, esas ödemeyi sabah yapacağız!" },
          { btn: "Müvekkiliniz Kuzgun mu?", mood: "angry", reply: "İsim telaffuz etme genç, başın ağrır!" },
          { btn: "Kimliğinizi görebilir miyim?", mood: "neutral", reply: "Buyur bak, her şeyim yasal benim." }
        ],
        outcomes: {
          serve: { correct: false, badge: "RÜŞVETE KANDIN!", title: "Sahte Rüşvet Parasını Kabul Ettin! (-200 ₺)", desc: "Şebeke avukatına boyun eğdin!", penalty: 200 },
          hide: defaultHideWrong,
          lock: { correct: true, badge: "DİK DURUŞ!", title: "Sahte Rüşvetini Yüzüne Çarpıp Kapıyı Kilitledin! (+140 ₺)", desc: "1980 şifresiyle Kuzgun'un 04:45 planını da öğrendin!", bonus: 140, badgeUnlock: "fake_hunter" },
          police: { correct: true, badge: "DELİL KARARTMA SUÇU!", title: "Rüşvetçi Avukat Suçüstü Alındı! (+200 ₺)", desc: "Telefonundaki mesajlar savcılığa delil oldu!", bonus: 200, badgeUnlock: "code_breaker" }
        }
      },

      {
        id: "n5_4",
        name: "Pişman Üye Ferhat",
        role: "Çeteden Kaçan İtirafçı",
        time: "03:35",
        radioTicker: "📻 FM 98.4: Çete içinde panik başladı, bazı üyelerin itirafçı olmak için kaçtığı bildirildi...",
        look: { style: "beanie", skin: "#eab68c", outfit: "#3f3f46", outfit2: "#18181b", capColor: "#991b1b", bandage: true, scar: true },
        car: { shape: "moto", type: "Siyah Motosiklet", color: "#18181b", plate: "06 FRH 14", pumpNote: "Motosiklet çamurlu, sürücü yaralı ve silahsız." },
        idCard: { fullName: "Ferhat Kılıç", birthYear: 1996, validUntil: "2030", plateMatch: "06 FRH 14", isFake: false },
        depotIntruder: false,
        depotNote: "Uzakta Kuzgun'un siyah zırhlı cipinin farları göründü!",
        powerOutage: false,
        requests: { fuelType: null, fuel: 0, drink: null, toast: null, market: "su" },
        cashBill: { denom: 100, fake: false, serial: "TR-448112", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 95,
        greeting: "Abi yalvarırım dinle! Emre'nin kaçmasına ben yardım ettim diye Kuzgun peşime düştü! Bir su verip beni ARKA ODAYA SAKLA, sabah savcıya her şeyi anlatacağım!",
        questions: [
          { btn: "Tuzak olmadığını nereden bileyim?", mood: "nervous", reply: "Üstümü ara abi silahım bile yok! Kuzgun 10 dakika sonra 06 KZG 001 ile gelecek, ilk iş şalteri attıracak!" },
          { btn: "Emre'yi gerçekten sen mi çözdün?", mood: "warm", reply: "Vallahi ben çözdüm abi, vicdanım elvermedi!" },
          { btn: "Kimliğin gerçek mi?", mood: "neutral", reply: "Gerçek abi buyur bak, Ferhat Kılıç." }
        ],
        outcomes: {
          hide: { correct: true, badge: "İTİRAFÇI KORUNDU!", title: "Ferhat'ı Arka Odaya Aldın, Kuzgun'un Planını Öğrendin! (+180 ₺)", desc: "Şalter sabotajına karşı hazırlıklısın! Şimdi büyük final zamanı!", bonus: 180, badgeUnlock: "safe_haven" },
          police: { correct: true, badge: "TANIK TESLİMİ", title: "Polis İtirafçıyı Korumaya Aldı (+120 ₺)", desc: "Ferhat emniyete götürüldü.", bonus: 120 },
          serve: { correct: false, badge: "RİSKLİ", title: "İtirafçıyı dışarıda bıraktın!", desc: "Saklasaydın çok daha güvenli olacaktı (-50 ₺).", penalty: 50 },
          lock: { correct: false, badge: "YANLIŞ KARAR", title: "İtirafçıyı kapıda bıraktın!", desc: "Önemli bir tanığı kaybettin (-90 ₺).", penalty: 90 }
        }
      },

      {
        id: "n5_5",
        name: "Elebaşı 'Kuzgun'",
        role: "Organize Suç Lideri",
        time: "04:45",
        radioTicker: "🚨 KIRMIZI ALARM: '06 KZG 001' plakalı SİYAH ZIRHLI SUV istasyona giriş yaptı! Tüm birimler teyakkuzda!",
        look: { style: "slick", skin: "#d6a27c", outfit: "#090d1a", outfit2: "#7f1d1d", hairColor: "#e2e8f0", scar: true, tie: "#dc2626" },
        car: {
          shape: "suv",
          type: "Siyah Zırhlı SUV",
          color: "#090d1a",
          plate: "06 KZG 001",
          muddyPlate: false,
          vestClue: true,
          pumpNote: "🚨 KIRMIZI BÜLTEN: '06 KZG 001'! Pompa 4'ün altındaki zula kapağının tam üstünde duruyor!"
        },
        idCard: { fullName: "Cevdet Karahan (SAHTE PASAPORT)", birthYear: 1975, validUntil: "2022 (GEÇERSİZ!)", plateMatch: "34 DPL 01 (UYUŞMUYOR!)", isFake: true },
        depotIntruder: true,
        depotNote: "🚨 KRİTİK BASKIN! Kuzgun'un silahlı koruması ARKA DEPO kapısını kırıyor! Hemen alarm çal!",
        powerOutage: true, // ⚡ BÜYÜK FİNAL ŞALTER SABOTAJI!
        requests: { fuelType: "benzin", fuel: 600, drink: "sade", toast: null, market: null },
        cashBill: { denom: 200, fake: true, serial: "KZ-000001", uvText: "⚠️ SAHTE 200 ₺ BANKNOT!" },
        wantsCharger: true,
        phoneData: {
          owner: "Kuzgun'un Ana Cihazı",
          locked: true,
          pin: "4004",
          pinHint: "Kilit İpucu: ' Pompa 4 + iki sıfır + Pompa 4 ' (Muhbir Leyla'nın verdiği kod: 4__4)",
          wallpaperTone: "crimson",
          notifications: [
            { app: "LİMAN KAPTANI • ŞİMDİ", sender: "Kargo Gemisi", body: "06:00'da demir alıyoruz Kuzgun! Pompa 4'ün altındaki altınları yükle, kasiyeri de ortadan kaldır!" }
          ]
        },
        reward: 250,
        greeting: "Şalterin attı galiba genç, karanlık iyidir... 600 liralık BENZİN doldur, sade kahvemi ver. Telefonumu da prize tak; uslu durursan bu geceden sağ çıkarsın.",
        questions: [
          { btn: "Pompa 4'ün altındaki altınlar için mi geldin Kuzgun?", mood: "angry", reply: "Adımı ağzına alacak kadar cesursun demek... Arka kapıdaki adamım birazdan susturur seni!" },
          { btn: "Hem kimliğin hem paran sahte, her yer sarıldı!", mood: "nervous", reply: "Blöf yapma bana çocuk! Çabuk yakıtı ver!" },
          { btn: "Emre de Ferhat da her şeyi savcıya anlattı!", mood: "angry", reply: "Yalan söylüyorsun! Kimse elimden kurtulamaz!" }
        ],
        outcomes: {
          police: {
            correct: true,
            badge: "EFSANE FİNAL!",
            title: "ÖZEL HAREKAT BASKINI! KUZGUN VE ÇETESİ ÇÖKERTİLDİ! (+600 ₺ Ödül)",
            desc: "Şalteri açtın, depo alarmıyla korumasını püskürttün, 4004 şifresini kırdın ve 112 ile tüm şebekeyi paketlettin! Son İstasyon Efsanesi oldun — artık 'Sonsuz Vardiya' modunda her gece yeni maceralar seni bekliyor!",
            bonus: 600,
            clue: "clue_kuzgun_busted",
            badgeUnlock: "story_master"
          },
          lock: { correct: true, badge: "CANINI KURTARDIN", title: "Kepengi İndirdin Ama Kuzgun Zırhlı Ciple Kaçtı (+130 ₺)", desc: "Hayatta kaldın fakat elebaşı limana doğru kaçtı.", bonus: 130 },
          serve: { correct: false, badge: "KARANLIK SON!", title: "Kuzgun'a Benzin Verdin, Altın Zulası Kaçırıldı!", desc: "Tüm kasaba şebekenin kaçışını konuştu (-300 ₺)...", penalty: 300 },
          hide: { correct: false, badge: "FELAKET!", title: "Elebaşını Arka Odaya Soktun!", desc: "İtirafçıyı ve kasayı ele geçirdi (-350 ₺)!", penalty: 350 }
        }
      }
    ]
  }
];


// ============================================================================
// v4.0 HİKAYE ZENGİNLEŞTİRME KATMANI
// (Bagaj Feneri, Köpek Duman Sezgisi, Sabit Hat Telefonu, Veresiye & Para Üstü, Fotoğraf Galerisi)
// ============================================================================
(function enrichStoryV4() {
  const threatIds = new Set([
    "n1_3", "n1_4", "n1_5",
    "n2_3", "n2_5",
    "n3_3", "n3_5",
    "n4_3", "n4_5",
    "n5_3", "n5_5"
  ]);

  const trunkMap = {
    n1_1: { type: "clean_tools", label: "📦 Fındık Çuvalları ve Kriko (Temiz)", suspicious: false },
    n1_2: { type: "clean_tools", label: "🧳 Aceleyle Toplanmış Kıyafet Valizi (Temiz)", suspicious: false },
    n1_3: { type: "fake_money", label: "🚨 SAHTE 200 TL BASKI KALIPLARI!", suspicious: true },
    n1_4: { type: "ropes", label: "🚨 ŞÜPHELİ HALAT VE KIRIK TELEFON!", suspicious: true },
    n1_5: { type: "vest_evidence", label: "🚨 EMRE'NİN YELEĞİ VE DEMİR LEVYE!", suspicious: true },

    n2_1: { type: "kitten", label: "🐱 Yağmurdan Kurtarılmış Yavru Kedi! (Temiz)", suspicious: false },
    n2_3: { type: "stolen_plates", label: "🚨 SAHTE MÜFETTİŞ DOSYALARI VE PLAKA!", suspicious: true },
    n2_4: { type: "clean_tools", label: "🎸 Plak Çantası ve Yedek Kablolar (Temiz)", suspicious: false },
    n2_5: { type: "ropes", label: "🚨 OKSİJEN KAYNAĞI VE BAĞLAMA İPLERİ!", suspicious: true },

    n3_1: { type: "clean_tools", label: "🧰 Taksi İlk Yardım Çantası (Temiz)", suspicious: false },
    n3_2: { type: "kitten", label: "🐱 Gelin Çiçeği ve Küçük Kedi Sepeti (Temiz)", suspicious: false },
    n3_3: { type: "fake_money", label: "🚨 FOTOKOPİ SAHTE PARA DESTELERİ!", suspicious: true },
    n3_4: { type: "clean_tools", label: "📁 Savcılığa Verilecek Muhasebe Belgeleri (Temiz)", suspicious: false },
    n3_5: { type: "stolen_plates", label: "🚨 ÇALINTI PLAKALAR VE SUSTURUCU KUTUSU!", suspicious: true },

    n4_1: { type: "clean_tools", label: "🧰 Askeri Kamp Çantası ve Harita (Temiz)", suspicious: false },
    n4_2: { type: "clean_tools", label: "💻 Sunucu Kasası ve Kablo Çantası (Temiz)", suspicious: false },
    n4_3: { type: "fake_money", label: "🚨 KAÇAK KAZI DEDEKTÖRÜ VE SAHTE PARA!", suspicious: true },
    n4_5: { type: "ropes", label: "🚨 SEDYE YOK! YERİNDE HALAT VE BANT VAR!", suspicious: true },

    n5_1: { type: "clean_tools", label: "📷 Basın Kamerası ve Tripod (Temiz)", suspicious: false },
    n5_2: { type: "clean_tools", label: "🧳 Yolcu Valizleri (Temiz)", suspicious: false },
    n5_3: { type: "fake_money", label: "🚨 SAHTE RÜŞVET DESTELERİ!", suspicious: true },
    n5_5: { type: "gold_case", label: "🚨 POMPA 4 ZULASI İÇİN BOŞ ÇELİK ALTIN ÇANTASI!", suspicious: true }
  };

  const landlineMap = {
    n1_3: {
      caller: "Telefon Dolandırıcısı (Sahte Patron)",
      text: "Alo genç! Ben Cevdet Abinin ortağıyım, kasadan 150 TL ayırıp hemen dışarıdaki kuryeye teslim et!",
      isScam: true
    },
    n1_5: {
      caller: "155 Polis Haber Merkezi",
      text: "Son İstasyon dikkat! Sonu 404 plakalı araç istasyonunuzda sinyal verdi! Bagajı fenerle kontrol edip hemen 112'ye basın!",
      isScam: false
    },
    n2_3: {
      caller: "İlçe Emniyet Nöbetçi Amirliği",
      text: "İyi geceler, bu gece bölgemizde resmi teftiş YOKTUR. Kendini müfettiş tanıtan biri gelirse kimliğine bakın ve 112'ye bildirin!",
      isScam: false
    },
    n3_1: {
      caller: "Mahmut Abinin Eşi (Sabit Hat)",
      text: "İyi geceler evladım, bizim bey sabaha kadar direksiyon sallıyor, çayını demli ver de uyuklamasın olur mu?",
      isScam: false
    },
    n3_3: {
      caller: "Sahte Banka Görevlisi (Dolandırıcı)",
      text: "İyi geceler, yazar kasa güncellemesi için kasadaki 150 TL'yi ayırmanız gerekiyor, onaylıyor musunuz?",
      isScam: true
    },
    n4_5: {
      caller: "Devlet Hastanesi Başhekimliği",
      text: "ACİL UYARI! 34 KZG 112 plakalı ambulans hastanemize ait DEĞİLDİR! Sakın yaralı teslim etmeyin!",
      isScam: false
    },
    n5_2: {
      caller: "Dolandırıcı Hat",
      text: "Alo kardeşim, ben otobüs firması müdürüyüm, kaptandan para alma kasadan 150 TL iade et!",
      isScam: true
    },
    n5_5: {
      caller: "Özel Harekat Komiseri",
      text: "Evlat sakın panik yapma, tüm istasyonu sardık! Kuzgun'un bagajını ve telefonunu belgelediğin an 112 butonuna bas, baskını başlatıyoruz!",
      isScam: false
    }
  };

  const creditCustomers = {
    n2_2: { asksCredit: true, creditHonest: true, creditAmount: 135, note: "Abi pos cihazım bozuldu, cüzdan da dükkânda kaldı! Veresiye yazsan yarın gece iki katıyla bıraksam?" },
    n4_2: { asksCredit: true, creditHonest: true, creditAmount: 150, note: "Abi öğrenci kartımın limiti gece kilitlenmiş ya... Veresiye defterine yazsan yarın burs yatınca 2 katı ödesem?" },
    n4_3: { asksCredit: true, creditHonest: false, creditAmount: 155, note: "Yeğenim istersen veresiye de yazabilirsin, yarın uğrar fazlasıyla veririm hehe!" }
  };

  const galleryMap = {
    n1_2: [
      { theme: "car", caption: "Bora'nın evin önünde bekleyen gri spor arabası" }
    ],
    n1_5: [
      { theme: "hatch", caption: "Pompa 4'ün altındaki gizli kapağın işaretli fotoğrafı!" }
    ],
    n2_5: [
      { theme: "hatch", caption: "Eski maden deposu ve Pompa 4 tünel krokisi" }
    ],
    n3_2: [
      { theme: "car", caption: "Ablamın gönderdiği güvenli buluşma konumu" }
    ],
    n3_4: [
      { theme: "ledger", caption: "Kuzgun'un gizli defteri: Plaka 06 KZG 001 • Kod 4004!" }
    ],
    n5_3: [
      { theme: "pier", caption: "Sabah 06:00 kaçış gemisinin liman fotoğrafı" }
    ],
    n5_5: [
      { theme: "hatch", caption: "Pompa 4 altındaki altın çantalarının son görüntüsü" },
      { theme: "pier", caption: "06:00'da kalkacak kaçak kargo gemisi" }
    ]
  };

  window.GAME_NIGHTS.forEach((night) => {
    night.customers.forEach((c) => {
      c.isThreat = threatIds.has(c.id);

      if (c.car.shape !== "walk" && c.car.shape !== "moto") {
        c.trunkData = trunkMap[c.id] || {
          type: "clean_tools",
          label: "🧰 Yedek Lastik ve Çanta (Temiz)",
          suspicious: false
        };
      } else {
        c.trunkData = null;
      }

      c.landlineCall = landlineMap[c.id] || null;

      const cred = creditCustomers[c.id];
      const billCost = c.reward || 140;
      const paidWith = billCost <= 160 ? 200 : 500;

      c.payment = {
        billCost,
        paidWith,
        asksCredit: cred ? cred.asksCredit : false,
        creditHonest: cred ? cred.creditHonest : false,
        creditAmount: cred ? cred.creditAmount : billCost
      };

      // Nakit banknot kupürünü paidWith ile eşitle
      c.cashBill.denom = paidWith;
      if (!c.cashBill.fake) {
        c.cashBill.uvText = `${paidWith} ₺ ORİJİNAL GÜVENLİK ŞERİDİ ✓`;
      }

      if (cred) {
        c.greeting += ` (${cred.note})`;
        c.outcomes.credit = cred.creditHonest
          ? {
              correct: true,
              badge: "ESNAF GÜVENİ!",
              title: `${c.name} Veresiye Defterine Yazıldı!`,
              desc: "Zor durumdaki dürüst müşteriye güvendin. Bir sonraki gece başında borcunu 2 KATIYLA ödeyecek!"
            }
          : {
              correct: false,
              badge: "VERESİYE ÇARPTI!",
              title: "Sahte Kimlikli Defineciyi Veresiye Yazdın!",
              desc: "Adam sahte isim vermiş, borcun üstüne yatacak!"
            };
      }

      if (c.phoneData) {
        c.phoneData.gallery = galleryMap[c.id] || [
          { theme: "car", caption: "Gece yolculuğu kamera görüntüsü" }
        ];
      }
    });
  });
})();

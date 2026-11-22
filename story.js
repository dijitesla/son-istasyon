// Son İstasyon v2 — 3 Gece x 5 Müşteri (15 Bölüm), Ekipman Dükkânı ve Kanıt Panosu

window.SHOP_UPGRADES = [
  {
    id: "autoPump",
    name: "⛽ Otomatik Pompa Kesici",
    cost: 280,
    desc: "Benzin sayacı hedefe yaklaşınca yavaşlar, taşırma riskini azaltır ve bahşiş aralığını genişletir."
  },
  {
    id: "smartGrill",
    name: "🥪 Termostatlı Tost Izgarası",
    cost: 240,
    desc: "Tostun yanmasını engeller; piştiği an kilitlenir ve her tosttan ekstra çıtırlık bahşişi kazandırır."
  },
  {
    id: "depotAlarm",
    name: "🚨 Hareket Sensörlü Depo Spotu",
    cost: 320,
    desc: "Arka depoya biri yaklaştığında kamera butonunda kırmızı alarm yanıp söner, hırsızlığı önler."
  },
  {
    id: "proUv",
    name: "🟣 Otomatik Mor Işık Kasası",
    cost: 260,
    desc: "Müşteri sahte banknot uzattığında mor ışık kutusunda anında uyarı işareti belirir."
  }
];

window.CLUE_DATABASE = {
  clue_404: {
    title: "Çamurlu 404 Plakası",
    night: "1. Gece",
    detail: "Kamyoncu Selim Usta, Emre'nin kaybolduğu gece Pompa 4'te sonu 404 olan lacivert bir araç gördü."
  },
  clue_vest: {
    title: "Bagajdaki Personel Yeleği",
    night: "1. Gece",
    detail: "06 KYP 404 plakalı aracın bagajından Emre'nin yaka kartı ve 'Kuzgun' kod adlı kişiden gelen kasa mesajı çıktı."
  },
  clue_alive: {
    title: "Emre Hayatta!",
    night: "2. Gece",
    detail: "Gece hemşiresi Nermin Abla, acile eli sargılı ve benzin kokan genç bir çocuğun gizlice pansumana geldiğini söyledi."
  },
  clue_fake_cop: {
    title: "Köstebek ve Eski Maden Yolu",
    night: "2. Gece",
    detail: "Kuzgun'un kuryesinin şifreli telefonundan Emre'nin eski maden yolundaki depoda tutulduğu ortaya çıktı."
  },
  clue_emre_safe: {
    title: "Emre İstasyona Sığındı",
    night: "3. Gece",
    detail: "Ellerini çözüp kaçan Emre arka odaya saklandı; Pompa 4'ün altındaki eski tankta kaçak altın sevkiyatı saklandığını anlattı."
  },
  clue_kuzgun_down: {
    title: "Kuzgun Şebekesi Çökertildi",
    night: "3. Gece",
    detail: "06 KZG 001 plakalı elebaşı ve arka depodaki adamı 112 operasyonuyla suçüstü yakalandı!"
  }
};

window.GAME_NIGHTS = [
  // =========================================================================
  // 1. GECE (5 MÜŞTERİ): KAYIP VARDİYA
  // =========================================================================
  {
    nightNumber: 1,
    title: "1. GECE: KAYIP VARDİYA",
    bossSms:
      "Genç, bu gece istasyon sende. Senden önceki kasiyer Emre 3 gündür kayıp. Pompa sayacını taşırma, paraları mor ışıkta kontrol et, şarja bırakılan telefonlara ve arka depoya göz kulak ol!",
    customers: [
      {
        id: "n1_selim",
        name: "Selim Usta",
        role: "Uzun Yol Kamyoncusu",
        time: "00:15",
        radioTicker: "📻 FM 98.4: Son İstasyon kasiyeri 22 yaşındaki Emre K.'dan 3 gündür haber alınamıyor...",
        look: { style: "trucker", skin: "#e0a97f", outfit: "#9a3412", outfit2: "#431407", capColor: "#dc2626", hairColor: "#3f3f46", mustache: true },
        car: {
          type: "Kırmızı Tır Çekicisi",
          color: "#dc2626",
          plate: "52 TR 618",
          pumpNote: "Dorse mühürlü, lastikler çamurlu ama plaka tertemiz okunuyor."
        },
        depotIntruder: false,
        depotNote: "Arka depo kapısı kilitli. Yağmur oluklarından başka hareket yok.",
        requests: { fuel: 300, coffee: "sade", toast: true, water: false },
        cashBill: { denom: 200, fake: false, serial: "TR-884192", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 160,
        greeting: "Bereketli geceler yeğenim. Pompa 4'ten 300 liralık mazot basıver, yanına da bir sade kahveyle sıcak tost yap da yolumuza bakalım.",
        questions: [
          {
            btn: "Emre'yi son gece gördün mü?",
            mood: "neutral",
            reply: "Gördüm ya... Gece 03:00 gibi buradan geçerken Pompa 4'te çamurlu LACİVERT bir sedan duruyordu, plakasının sonu 404'tü."
          },
          {
            btn: "Gece bu yol tekin mi usta?",
            mood: "warm",
            reply: "Uyanık olursan korkma. Ama gece yarısı sahte 200'lük süren çok olur, kasadaki mor ışığı mutlaka kullan."
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "DOĞRU KARAR",
            title: "Selim Usta memnun ayrıldı!",
            desc: "Sıcak tostunu alıp kornaya basarak uğurlandı. 'Sonu 404 olan lacivert araba' ipucunu not ettin.",
            clue: "clue_404"
          },
          lock: {
            correct: false,
            badge: "YANLIŞ ALARM",
            title: "Emektar kamyoncuyu kapıda bıraktın!",
            desc: "Selim Usta şaşırıp mazot almadan gitti. Hem satış kaçtı hem de görgü tanığını dinleyemedin.",
            penalty: 60
          },
          police: {
            correct: false,
            badge: "ASILSIZ İHBAR",
            title: "Masum şoföre ekip çağırdın!",
            desc: "Polis evraklarını kontrol etti, hiçbir suç unsuru çıkmadı (-100 ₺ ceza).",
            penalty: 100
          }
        }
      },

      {
        id: "n1_melis",
        name: "Melis",
        role: "Telaşlı Genç Yolcu",
        time: "01:10",
        radioTicker: "📻 FM 98.4 HAVA DURUMU: Kasaba çıkışında sağanak yağış etkisini artırıyor...",
        look: { style: "long", skin: "#fad2b4", outfit: "#4f46e5", outfit2: "#1e1b4b", hairColor: "#1e1b2e" },
        car: {
          type: "Beyaz Küçük Hatchback",
          color: "#e2e8f0",
          plate: "34 MLS 27",
          pumpNote: "Arka koltukta aceleyle toplanmış bir sırt çantası var. Sürücü sürekli yola bakıyor."
        },
        depotIntruder: false,
        depotNote: "Arka saha sakin, kedi çöp kutusunun üstünden atladı.",
        requests: { fuel: 0, coffee: null, toast: false, water: true },
        cashBill: { denom: 100, fake: false, serial: "TR-512094", uvText: "100 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Melis'in Telefonu",
          locked: false,
          pin: null,
          pinHint: null,
          wallpaperTone: "indigo",
          notifications: [
            {
              app: "MESAJLAR • ŞİMDİ",
              sender: "Annem ❤️",
              body: "Kızım sakın eve dönme! Eski nişanlın Bora yine kapıya dayandı, gri arabasıyla peşinden çıktı!"
            },
            {
              app: "WHATSAPP • 1 DK ÖNCE",
              sender: "Bora (Yeni Hat)",
              body: "Son benzincide duracağını biliyorum Melis. 20 dakikaya oradayım."
            }
          ]
        },
        reward: 75,
        greeting: "İyi geceler... Sadece bir soğuk su alacağım. Bir de telefonum kapandı, ne olur 2 dakika şarja takar mısın? Ellerim titriyor...",
        questions: [
          {
            btn: "Birinden mi kaçıyorsun?",
            mood: "nervous",
            reply: "Lütfen... Arkamdan gri arabalı, takım elbiseli biri gelip beni sorarsa sakın buradan geçtiğimi söyleme!"
          },
          {
            btn: "Polisi aramamı ister misin?",
            mood: "nervous",
            reply: "Hayır hayır, tutanak beklersem beni burada yakalar! Şehir dışına teyzeme gidiyorum, suyumla telefonumu alayım yeter."
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "DOĞRU YARDIM",
            title: "Melis'i sakinleştirip güvenle uğurladın!",
            desc: "Şarjdaki mesajdan tehlikede olduğunu gördün. Peşinden gelecek 'Bora' ismini aklına yazdın."
          },
          lock: {
            correct: false,
            badge: "VİCDAN AZABI",
            title: "Yardıma muhtaç yolcuyu geri çevirdin!",
            desc: "Şarjsız telefonuyla karanlık yağmurda yola devam etmek zorunda kaldı.",
            penalty: 50
          },
          police: {
            correct: false,
            badge: "PANİK YARATTIN",
            title: "Melis siren korkusuyla kaçtı!",
            desc: "Beklemekten korktuğu için suyunu bile almadan gaza bastı.",
            penalty: 50
          }
        }
      },

      {
        id: "n1_cengiz",
        name: "Cengiz",
        role: "Gece Gezgini",
        time: "02:05",
        radioTicker: "📻 FM 98.4 ASAYİŞ: Bölgedeki küçük esnafa gece saatlerinde sahte 200 TL sürüldüğü bildirildi! Mor ışık uyarısı yapıldı...",
        look: { style: "slick", skin: "#dfb18b", outfit: "#065f46", outfit2: "#022c22", hairColor: "#18181b", glasses: true },
        car: {
          type: "Siyah Eski Kupe",
          color: "#27272a",
          plate: "16 CNZ 88",
          pumpNote: "Motor çalışır halde bekliyor, farları bilerek kısık bırakmış."
        },
        depotIntruder: false,
        depotNote: "Arka depo kapısı kapalı, anormal bir durum görünmüyor.",
        requests: { fuel: 0, coffee: "sutlu", toast: true, water: false },
        cashBill: { denom: 200, fake: true, serial: "XX-000000", uvText: "⚠️ SAHTE KOPYA! FİLİGRAN YOK!" },
        wantsCharger: false,
        phoneData: null,
        reward: 130,
        greeting: "Selam birader, bol sütlü bir kahveyle kaşarlı tost yap bakalım. Nakit 200'lük uzattım, üstü kalsın acelem var!",
        questions: [
          {
            btn: "Neden bu kadar acele ediyorsun?",
            mood: "nervous",
            reply: "Canım ne acelesi... Üstü kalsın dedik işte, parayı kasaya at ver siparişi uzatma!"
          },
          {
            btn: "Bu 200 liranın kağıdı biraz tuhaf mı?",
            mood: "angry",
            reply: "Ne tuhafı kardeşim, bankamatikten yeni çektim! İftira mı atıyorsun müşteriye?!"
          }
        ],
        outcomes: {
          serve: {
            correct: false,
            badge: "DOLANDIRILDIN!",
            title: "Sahte 200 TL'yi kasaya koydun! (-200 ₺)",
            desc: "Mor ışıkta kontrol etmedin ya da göz yumdun! Adam sahte parayı yutturup sırıtarak uzaklaştı.",
            penalty: 200
          },
          lock: {
            correct: true,
            badge: "GÖZÜN AÇIK!",
            title: "Sahte parayı yüzüne çarpıp kapıyı kilitledin! (+90 ₺ Prim)",
            desc: "Mor ışığı görünce rengi attı, arkasını dönüp arkasına bakmadan kaçtı!",
            bonus: 90
          },
          police: {
            correct: true,
            badge: "SUÇÜSTÜ!",
            title: "Kalpazana 112'yi çağırdın! (+140 ₺ İkramiye)",
            desc: "Cebinden bir tomar sahte 200'lük çıktı. Patron dikkatin için kasa primi yazdı!",
            bonus: 140
          }
        }
      },

      {
        id: "n1_bora",
        name: "Bora",
        role: "Fazla Kibar Yabancı",
        time: "02:55",
        radioTicker: "📻 FM 98.4: Uzmanlar gece yolculuklarında şüpheli takip vakalarına karşı istasyon çalışanlarını uyardı...",
        look: { style: "short", skin: "#eac09c", outfit: "#1e293b", outfit2: "#e2e8f0", hairColor: "#0f172a", tie: "#ef4444" },
        car: {
          type: "Gri Spor Sedan",
          color: "#64748b",
          plate: "34 BR 901",
          pumpNote: "⚠️ Motor kaputu aşırı sıcak! Ön koltukta zorla kırılmış pembe bir telefon kılıfı duruyor."
        },
        depotIntruder: false,
        depotNote: "Arka saha temiz.",
        requests: { fuel: 400, coffee: "sade", toast: false, water: false },
        cashBill: { denom: 200, fake: false, serial: "TR-773410", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 120,
        greeting: "İyi geceler dostum. Pompadan 400 liralık benzinle bir sade kahve alayım. Bu arada... Az önce beyaz arabalı Melis adında bir kız geçti mi? Cüzdanını düşürmüş de.",
        questions: [
          {
            btn: "Madem nişanlın, neden cepten aramıyorsun?",
            mood: "nervous",
            reply: "Şey... şarjı bitmiş herhalde. Sen gördün mü görmedin mi onu söyle, bahşişin benden."
          },
          {
            btn: "Hakkında uzaklaştırma kararı mı var?",
            mood: "angry",
            reply: "Sana ne birader özel hayatımızdan?! Benzinimi ver yoksa kötü konuşacağım!"
          }
        ],
        outcomes: {
          serve: {
            correct: false,
            badge: "TEHLİKELİ HATA!",
            title: "Takipçinin deposunu doldurup yol verdin!",
            desc: "Bora sinsi bir gülüşle tam gaz Melis'in gittiği yöne bastı. Büyük bir tehlikeye davetiye çıkardın!",
            penalty: 120
          },
          lock: {
            correct: true,
            badge: "USTACA ENGEL",
            title: "Benzin vermedin, kepengi kilitledin! (+110 ₺)",
            desc: "'Kamera kayıtta, buradan kimse geçmedi' deyince benzin alamadan geri dönmek zorunda kaldı!",
            bonus: 110
          },
          police: {
            correct: true,
            badge: "TAM İSABET!",
            title: "Polis kavşakta Bora'yı durdurdu! (+150 ₺)",
            desc: "Uzaklaştırma kararını ihlal ettiği saptandı. Melis artık tamamen güvende!",
            bonus: 150
          }
        }
      },

      {
        id: "n1_404",
        name: "Kapüşonlu Yabancı",
        role: "Gece Yarısı Müşterisi",
        time: "04:05",
        radioTicker: "🚨 SON DAKİKA: Kayıp kasiyer Emre olayında aranan ÇAMURLU LACİVERT SEDAN (Plaka sonu 404) bölge yolunda görüldü!",
        look: { style: "hood", outfit: "#111827", outfit2: "#030712" },
        car: {
          type: "Çamurlu Lacivert Sedan",
          color: "#1e3a8a",
          plate: "06 KYP 404",
          pumpNote: "🚨 DİKKAT: Plakanın başı çamurlu ama sonu '404'! Bagaj aralığından kırmızı 'Son İstasyon' personel yeleği sarkıyor!"
        },
        depotIntruder: true,
        depotNote: "🚨 TEHLİKE! Siyah maskeli ikinci bir şahıs levye ile ARKA DEPO kilidini zorluyor! Hemen alarm çal!",
        requests: { fuel: 0, coffee: null, toast: true, water: true },
        cashBill: { denom: 200, fake: false, serial: "TR-109442", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Şifreli Cihaz",
          locked: true,
          pin: "0404",
          pinHint: "Kilit Notu: ' Sıfır + Plakamın son 3 rakamı ' (Örn: 0 + 3 rakam)",
          wallpaperTone: "crimson",
          notifications: [
            {
              app: "ŞİFRELİ SOHBET • GİZLİ",
              sender: "Kuzgun",
              body: "Kasiyer çocuk Emre'nin yaka kartını aldın değil mi? Sen yeni kasiyeri oyalarken ortağın arka depodaki kasayı yoklasın!"
            },
            {
              app: "SESLİ NOT DÖKÜMÜ",
              sender: "Bilinmeyen",
              body: "Pompa 4'ün altındaki eski tankı kimse bilmiyor. Yarın gece kuryeyi göndereceğim."
            }
          ]
        },
        reward: 110,
        greeting: "Tostla su ver birader, oyalanma. Şu telefonu da 2 dakika şarja tak; şifreli zaten ama ekranına elini bile sürme!",
        questions: [
          {
            btn: "Plakanız neden çamurla sıvanmış?",
            mood: "angry",
            reply: "Dağ yolundan indik dedik ya! Plaka memuru musun sen, tostumu ver işine bak!"
          },
          {
            btn: "Arka depodan ses mi geliyor?",
            mood: "nervous",
            reply: "Rüzgârdır o rüzgâr... Sen kasadan ayrılma birader!"
          }
        ],
        outcomes: {
          police: {
            correct: true,
            badge: "BÜYÜK OPERASYON!",
            title: "404 Plakalı Şüpheli Kıskıvrak Yakalandı! (+260 ₺ Ödül)",
            desc: "Şifreyi (0404) kırıp mesajı okudun ve 112'yi çağırdın! Bagajdan Emre'nin yaka kartı çıktı ama telefondaki 'Kuzgun' hâlâ dışarıda!",
            bonus: 260,
            clue: "clue_vest"
          },
          lock: {
            correct: true,
            badge: "KIL PAYI KURTULUŞ",
            title: "Kepengi indirdin ama 404 karanlığa kaçtı (+70 ₺)",
            desc: "Tehlikeyi sezdin ama polis gelmeden gaza basıp uzaklaştı.",
            bonus: 70
          },
          serve: {
            correct: false,
            badge: "FELAKET HATA!",
            title: "Baş şüpheliyi elini kolunu sallayarak gönderdin!",
            desc: "Aranan 404 plakalı araç gözünün önünde kayboldu, üstelik şebeke izlerini sildi!",
            penalty: 180
          }
        }
      }
    ]
  },

  // =========================================================================
  // 2. GECE (5 MÜŞTERİ): ARKA DEPODAKİ SIR
  // =========================================================================
  {
    nightNumber: 2,
    title: "2. GECE: ARKA DEPODAKİ SIR",
    bossSms:
      "Dün geceki 404 olayından sonra ortalık karıştı! Polis 'Kuzgun' denen elebaşını arıyor. Bu gece hem sahte paraya hem de arka depoya iki kat dikkat et!",
    customers: [
      {
        id: "n2_nermin",
        name: "Nermin Abla",
        role: "Acil Servis Hemşiresi",
        time: "00:20",
        radioTicker: "📻 FM 98.4: Dün gece Son İstasyon'daki operasyondan sonra kayıp Emre'yi arama çalışmaları maden yoluna kaydırıldı...",
        look: { style: "bun", skin: "#f3c6a5", outfit: "#0284c7", outfit2: "#e0f2fe", hairColor: "#334155", glasses: true },
        car: {
          type: "Mavi Sedan",
          color: "#0ea5e9",
          plate: "52 NRM 12",
          pumpNote: "Ön camda Devlet Hastanesi personel kartı asılı. Temiz ve güvenli."
        },
        depotIntruder: false,
        depotNote: "Arka depo sakin, yeni kilit sağlam duruyor.",
        requests: { fuel: 250, coffee: "sutlu", toast: false, water: true },
        cashBill: { denom: 200, fake: false, serial: "TR-662918", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 150,
        greeting: "İyi nöbetler evladım. Nöbetten çıktım, 250 liralık benzinle bir sütlü kahve ve su alabilir miyim? Sana önemli bir şey anlatacağım.",
        questions: [
          {
            btn: "Ne oldu Nermin Abla, Emre'yle mi ilgili?",
            mood: "warm",
            reply: "Evet! Akşamüstü acilin arka kapısına eli kesik, üstü benzin kokan genç bir çocuk geldi, kayıtsız pansuman istedi. Yaka izinden tanıdım, EMRE HAYATTA!"
          },
          {
            btn: "Neden polise gitmemiş?",
            mood: "nervous",
            reply: "'İçeride köstebek var abla, kimseye güvenemem, maden yoluna saklanacağım' deyip yağmura karıştı..."
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "KRİTİK İPUCU!",
            title: "Emre'nin hayatta olduğunu öğrendin!",
            desc: "Nermin Abla'yı uğurladın. Demek Emre yaşıyor ve polisin bile içinde şebekenin adamı olabilir!",
            clue: "clue_alive"
          },
          lock: {
            correct: false,
            badge: "YANLIŞ KARAR",
            title: "Nöbetçi hemşireyi kapıdan çevirdin!",
            desc: "Emre hakkında anlatacağı hayati bilgiyi kaçırdın.",
            penalty: 70
          },
          police: {
            correct: false,
            badge: "ASILSIZ İHBAR",
            title: "Hastane personeline polis çağırdın!",
            desc: "Gereksiz panik yüzünden uyarı aldın (-90 ₺).",
            penalty: 90
          }
        }
      },

      {
        id: "n2_berkay",
        name: "Berkay",
        role: "Gece Yarışçısı",
        time: "01:15",
        radioTicker: "📻 FM 98.4: Sanayi kavşağında egzoz patlatan modifiyeli araçlara denetim başlatıldı...",
        look: { style: "cap", skin: "#eab68c", outfit: "#eab308", outfit2: "#18181b", capColor: "#2563eb", hairColor: "#18181b" },
        car: {
          type: "Sarı Modifiyeli Hatchback",
          color: "#facc15",
          plate: "34 BRK 55",
          pumpNote: "Müzik son ses açık, yan koltuk boş ama kapısı aralık bırakılmış!"
        },
        depotIntruder: true,
        depotNote: "🚨 DİKKAT! Berkay'ın yan koltuktan inen arkadaşı ARKA DEPO camını zorluyor! Alarm butonuna bas!",
        requests: { fuel: 500, coffee: null, toast: true, water: true },
        cashBill: { denom: 200, fake: false, serial: "TR-330182", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 175,
        greeting: "Kanka 500'lük benzin fulle, bir tost bir de su patlat! Yavaş yavaş yap acelesi yok, muhabbet edelim biraz ya!",
        questions: [
          {
            btn: "Yan koltuktaki arkadaşın nereye indi?",
            mood: "nervous",
            reply: "Ha o mu... Şey, tuvalete gitti kanka ya, sen arkaya falan bakma tostu yap!"
          },
          {
            btn: "Beni bilerek mi oyalıyorsun?",
            mood: "angry",
            reply: "Ne oyalaması birader, parasıyla değil mi?!"
          }
        ],
        outcomes: {
          serve: {
            correct: false,
            badge: "TUZAĞA DÜŞTÜN!",
            title: "Seni lafa tutпular, hırsızlık girişimini ödüllendirdin!",
            desc: "Bu ikili dükkânı soymaya gelmişti; normal müşteri gibi gönderince pişkin pişkin güldüler!",
            penalty: 110
          },
          lock: {
            correct: true,
            badge: "OYUNU BOZDUN!",
            title: "Numaralarını çakıp kepengi kilitledin! (+110 ₺)",
            desc: "Arka depodaki ortağıyla birlikte panikleyip arabalarına atlayıp kaçtılar!",
            bonus: 110
          },
          police: {
            correct: true,
            badge: "TAM İSABET!",
            title: "İki kafadar hırsızlığa teşebbüsten alındı! (+150 ₺)",
            desc: "Kameradan arka depoyu yakaladığın için polis ikisini de suçüstü tuttu!",
            bonus: 150
          }
        }
      },

      {
        id: "n2_tarik",
        name: "Sahte Komiser Tarık",
        role: "Sivil Kıyafetli Şahıs",
        time: "02:25",
        radioTicker: "📻 FM 98.4 UYARI: Emniyet, kendisini sivil görevli gibi tanıtan dolandırıcılara karşı resmi kimlik kontrolü yapılmasını istedi...",
        look: { style: "short", skin: "#d9a077", outfit: "#1f2937", outfit2: "#374151", hairColor: "#111827", mustache: true, scar: true },
        car: {
          type: "Siyah Sivil Otomobil",
          color: "#111827",
          plate: "06 SVL 09",
          pumpNote: "⚠️ Resmi görev plakası değil! Arka plakada kiralık araç çerçevesi var."
        },
        depotIntruder: false,
        depotNote: "Arka depo temiz.",
        requests: { fuel: 0, coffee: "sade", toast: false, water: false },
        cashBill: { denom: 100, fake: true, serial: "FK-999111", uvText: "⚠️ SAHTE 100 ₺! MÜREKKEP DAĞILMIŞ!" },
        wantsCharger: false,
        phoneData: null,
        reward: 90,
        greeting: "Sakin ol genç, emniyettenim. Bir sade kahve ver, parasını bıraktım. Bir de Emre'den kalan defter veya ses kaydı varsa hemen bana teslim et, delil toplayacağım.",
        questions: [
          {
            btn: "Görev kimliğinizi ve tutanağı görebilir miyim?",
            mood: "angry",
            reply: "Gece vakti ne tutanağı kardeşim?! Gizli operasyon diyorum, ver şu kahveyi canımı sıkma!"
          },
          {
            btn: "Arabanız neden kiralık plakalı?",
            mood: "nervous",
            reply: "Takip aracı o... Fazla soru sorma, Emre'nin eşyalarını çıkar!"
          }
        ],
        outcomes: {
          serve: {
            correct: false,
            badge: "KÖSTEBEĞE KANDIN!",
            title: "Hem sahte 100 ₺ aldın hem de bilgi kaptırdın!",
            desc: "Nermin Abla'nın bahsettiği sahte görevli buydu! Şebekenin adamına hizmet ettin.",
            penalty: 160
          },
          lock: {
            correct: true,
            badge: "GEÇİT VERMEDİN!",
            title: "Sahte polisi kapı dışarı ettin! (+130 ₺)",
            desc: "Tutanak isteyip sahte parasını da yakalayınca maskesi düştü, hızla uzaklaştı!",
            bonus: 130
          },
          police: {
            correct: true,
            badge: "GERÇEK POLİS GELDİ!",
            title: "Üniformasız dolandırıcı kıskıvrak yakalandı! (+180 ₺)",
            desc: "Gerçek 112 ekibi gelince Kuzgun için delil çalmaya geldiği ortaya çıktı!",
            bonus: 180
          }
        }
      },

      {
        id: "n2_ece",
        name: "Ece",
        role: "Konserden Dönen Müzisyen",
        time: "03:20",
        radioTicker: "📻 FM 98.4 GECE MÜZİĞİ: Yağmurlu gecede direksiyon başındakilere sakin melodiler...",
        look: { style: "curly", skin: "#fad2b4", outfit: "#9333ea", outfit2: "#3b0764", hairColor: "#7c2d12" },
        car: {
          type: "Kırmızı Küçük Otomobil",
          color: "#ef4444",
          plate: "35 ECE 99",
          pumpNote: "Arka koltukta gitar kutusu var. Plaka ve evraklar nizami."
        },
        depotIntruder: false,
        depotNote: "Arka depo sakin.",
        requests: { fuel: 300, coffee: "sutlu", toast: true, water: false },
        cashBill: { denom: 200, fake: false, serial: "TR-449021", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Ece'nin Telefonu",
          locked: false,
          pin: null,
          pinHint: null,
          wallpaperTone: "indigo",
          notifications: [
            {
              app: "GRUP SOHBETİ • SAHNE EKİBİ",
              sender: "Davulcu Mert",
              body: "Ece sağ salim geçtin mi kasaba çıkışını? Benzinlikte sıcak bir tost ye de uykun açsın :)"
            }
          ]
        },
        reward: 165,
        greeting: "Selam! Sahne çıkışı çok acıktım; 300 liralık benzin, bir sütlü kahve ve sıcak tost rica edeceğim. Telefonumu da 2 dakika prize takabilir miyiz?",
        questions: [
          {
            btn: "Gecenin bu saatinde nereden geliyorsun?",
            mood: "warm",
            reply: "Ordu'da akustik sahnemiz vardı, sabah provaya yetişeceğim. Büfenin ışığını görünce çok sevindim!"
          },
          {
            btn: "Yolda şüpheli bir araç gördün mü?",
            mood: "neutral",
            reply: "Arkamdaki virajda koyu gri bir kurye minibüsü bekliyordu, farlarını kapatmıştı. Biraz ürkütücüydü açıkçası."
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "TEMİZ SATIŞ!",
            title: "Ece bahşiş bırakarak ayrıldı! (+165 ₺)",
            desc: "Hem gerçek parayı doğruladın hem de bir sonraki şüpheli minibüs hakkında ipucu aldın!"
          },
          lock: {
            correct: false,
            badge: "MÜŞTERİ KAYBI",
            title: "Masum müzisyeni geri çevirdin!",
            desc: "Gereksiz şüphecilik yüzünden temiz satışı kaçırdın.",
            penalty: 60
          },
          police: {
            correct: false,
            badge: "YANLIŞ İHBAR",
            title: "Masum yolcuya polis çağırdın!",
            desc: "Gitar kutusundan sadece gitar çıktı (-100 ₺ ceza).",
            penalty: 100
          }
        }
      },

      {
        id: "n2_kurye",
        name: "Kuzgun'un Kuryesi",
        role: "Gece Kargo Minibüsü",
        time: "04:30",
        radioTicker: "🚨 EMNİYET ANONSU: 404 plakalı araçla bağlantılı koyu gri panelvan minibüs bölgede aranıyor!",
        look: { style: "hood", outfit: "#312e81", outfit2: "#090d1a" },
        car: {
          type: "Koyu Gri Panelvan",
          color: "#334155",
          plate: "34 KZG 19",
          pumpNote: "🚨 Plaka '34 KZG 19'! Yan camlar siyah film kaplı, içeride çelik kasa ekipmanı görünüyor!"
        },
        depotIntruder: true,
        depotNote: "🚨 DİKKAT! Minibüsün arka kapısından inen gölge ARKA DEPO şalterini indirmeye çalışıyor!",
        requests: { fuel: 400, coffee: "sade", toast: false, water: true },
        cashBill: { denom: 200, fake: true, serial: "KZ-001919", uvText: "⚠️ SAHTE 200 ₺! ŞERİT YOK!" },
        wantsCharger: true,
        phoneData: {
          owner: "Kurye Cihazı",
          locked: true,
          pin: "1919",
          pinHint: "Kilit İpucu: ' Plakamın son 2 rakamı yan yana iki kez ' (Örn: XX -> XXXX)",
          wallpaperTone: "crimson",
          notifications: [
            {
              app: "ŞİFRELİ KANAL • KUZGUN",
              sender: "Kuzgun (Patron)",
              body: "Kasiyer Emre eski maden deposundan kaçmaya çalışmış ama bağladık. Yarın gece bizzat gelip Pompa 4'ün altındaki altınları alacağım!"
            }
          ]
        },
        reward: 140,
        greeting: "400'lük mazot aç, bir sade kahve bir de su ver. Şu telefonu da prize tak ama sakın şifresini kurcalama!",
        questions: [
          {
            btn: "Ece yolda farları kapalı beklediğinizi görmüş?",
            mood: "nervous",
            reply: "Sigorta atmıştı onu düzelttim birader... Sen mazotu bas işine karışma!"
          },
          {
            btn: "Uzattığınız bu 200 lira sahte!",
            mood: "angry",
            reply: "Kes sesini! Başına eski kasiyerin geldiği gelsin istemiyorsan çeneni kapat!"
          }
        ],
        outcomes: {
          police: {
            correct: true,
            badge: "ŞİFRE ÇÖZÜLDÜ!",
            title: "Kurye Yakalandı, Emre'nin Yeri Bulundu! (+280 ₺)",
            desc: "1919 şifresini kırıp Kuzgun'un planını deşifre ettin! Yarın gece bizzat elebaşı Kuzgun istasyona gelecek!",
            bonus: 280,
            clue: "clue_fake_cop"
          },
          lock: {
            correct: true,
            badge: "SAVUNMA BAŞARILI",
            title: "Kapıyı kilitleyip kuryeyi püskürttün (+80 ₺)",
            desc: "Sahte parayı ve tehdidi savuşturdun ama minibüs kaçmayı başardı.",
            bonus: 80
          },
          serve: {
            correct: false,
            badge: "AĞIR KAYIP!",
            title: "Hem sahte parayı yuttun hem kuryeye benzin verdin!",
            desc: "Kuzgun'un adamı gözünün içine baka baka seni soyup gitti!",
            penalty: 220
          }
        }
      }
    ]
  },

  // =========================================================================
  // 3. GECE (5 MÜŞTERİ): SON HESAPLAŞMA
  // =========================================================================
  {
    nightNumber: 3,
    title: "3. GECE: SON HESAPLAŞMA",
    bossSms:
      "Bu gece düğüm çözülüyor! Emre her an bir yerden çıkabilir, 'Kuzgun' denen elebaşı da Pompa 4'ün altındaki zula için gelecektir. Soğukkanlı kal!",
    customers: [
      {
        id: "n3_mahmut",
        name: "Taksici Mahmut",
        role: "Gece Taksisi",
        time: "00:15",
        radioTicker: "📻 FM 98.4: Polis eski maden yolundaki depoya baskın düzenledi ancak içeride kimse bulunamadı...",
        look: { style: "short", skin: "#e0a97f", outfit: "#b45309", outfit2: "#fef3c7", hairColor: "#52525b", mustache: true },
        car: {
          type: "Sarı Ticari Taksi",
          color: "#f59e0b",
          plate: "52 T 0144",
          pumpNote: "Taksi durağı logolu resmi plaka. Arka koltuk boş."
        },
        depotIntruder: false,
        depotNote: "Arka saha sakin.",
        requests: { fuel: 350, coffee: "sade", toast: true, water: false },
        cashBill: { denom: 200, fake: false, serial: "TR-908172", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 170,
        greeting: "Selamünaleyküm kardeşim. 350 liralık yakıt, bir sade kahve bir de tost yap bakalım. Az önce maden sapağında koşan yaralı bir genç gördüm!",
        questions: [
          {
            btn: "Koşan genç ne tarafa gidiyordu?",
            mood: "nervous",
            reply: "Üstünde yırtık tişört vardı, tarlaların içinden direkt bu istasyona doğru koşuyordu! Peşinde de siyah cipler vardı."
          },
          {
            btn: "Neden arabaya almadın abi?",
            mood: "neutral",
            reply: "Korna çaldım ama korkudan saklandı garibim, beni de o adamlardan sandı herhalde."
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "HAZIRLIKLI OL!",
            title: "Mahmut Abi uyardı: Emre buraya koşuyor! (+170 ₺)",
            desc: "Temiz satışı tamamladın. Birazdan Emre kapıda belirebilir!"
          },
          lock: {
            correct: false,
            badge: "GEREKSİZ KİLİT",
            title: "Taksici esnafı kapıda bıraktın!",
            desc: "Hem satışı hem de önemli uyarıyı kaçırdın.",
            penalty: 60
          },
          police: {
            correct: false,
            badge: "YANLIŞ İHBAR",
            title: "Durağın taksicisine polis çağırdın!",
            desc: "Asılsız ihbar cezası kesildi (-100 ₺).",
            penalty: 100
          }
        }
      },

      {
        id: "n3_leyla",
        name: "Leyla",
        role: "Gizemli Muhbir",
        time: "01:20",
        radioTicker: "📻 FM 98.4: Kasaba giriş çıkışlarında sivil ekipler devriye sayısını iki katına çıkardı...",
        look: { style: "long", skin: "#f3c6a5", outfit: "#be123c", outfit2: "#1f2937", hairColor: "#090d1a", glasses: true },
        car: {
          type: "Bordo Hatchback",
          color: "#9f1239",
          plate: "06 LYL 77",
          pumpNote: "Plaka gerçek. Sürücü sürekli arkadaki yoldan gelen far var mı diye kontrol ediyor."
        },
        depotIntruder: false,
        depotNote: "Arka depo kilitli ve temiz.",
        requests: { fuel: 0, coffee: "sutlu", toast: false, water: true },
        cashBill: { denom: 200, fake: false, serial: "TR-774512", uvText: "200 ₺ ORİJİNAL ŞERİT ✓" },
        wantsCharger: true,
        phoneData: {
          owner: "Leyla'nın Telefonu",
          locked: true,
          pin: "7701",
          pinHint: "Kilit Notu: ' Plakamın sayısı (77) + Kuzgun'un plaka sonu (01) '",
          wallpaperTone: "indigo",
          notifications: [
            {
              app: "SES KAYDI NOTU • MUHBİR",
              sender: "Leyla (Kendime Not)",
              body: "Artık bu suça ortak olmayacağım. Kuzgun saat 04:30'da 06 KZG 001 plakalı siyah ciple gelecek; şifresi 4004!"
            }
          ]
        },
        reward: 110,
        greeting: "Sütlü kahve ve su lütfen. Telefonumu şarja bırakıyorum... Eğer cesaretin varsa şifresini çöz (plakam 77 + Kuzgun'un 01'i) ve içindeki notu oku. Sonra beni görmemiş ol.",
        questions: [
          {
            btn: "Sen Kuzgun'u nereden tanıyorsun?",
            mood: "nervous",
            reply: "Eski muhasebecisiydim... Emre'ye yaptıklarından sonra kaçtım. Telefondaki notta Kuzgun'un plakasını ve şifresini bıraktım, iyi bak!"
          },
          {
            btn: "Polise tanıklık yapacak mısın?",
            mood: "warm",
            reply: "Sen bu gece Kuzgun'u yakalat, sabah ilk iş savcılığa elimdeki belgeleri vereceğim. Söz!"
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "ALTIN İSTİHBARAT!",
            title: "Muhbir Leyla'dan Kuzgun'un şifresini (4004) öğrendin!",
            desc: "Leyla güvenli şekilde uzaklaştı. Artık finalde gelecek siyah cipe karşı tam donanımlısın!"
          },
          lock: {
            correct: false,
            badge: "FIRSAT KAÇTI",
            title: "Sana yardım etmeye gelen muhbiri kovdun!",
            desc: "Kuzgun'un telefon şifresini öğrenme şansını teptin.",
            penalty: 80
          },
          police: {
            correct: false,
            badge: "ERKEN HAMLE",
            title: "Siren sesleri Kuzgun'u uyandırabilirdi!",
            desc: "Leyla korkup kaçtı; oysa sabaha savcılığa belgeleri bizzat teslim edecekti.",
            penalty: 70
          }
        }
      },

      {
        id: "n3_haluk",
        name: "Kalpazan Haluk",
        role: "Şüpheli Gece Müşterisi",
        time: "02:30",
        radioTicker: "📻 FM 98.4: Bölgede çalıntı plakalı beyaz minibüs ve sahte banknot şebekesi aranıyor...",
        look: { style: "cap", skin: "#dfb18b", outfit: "#3f3f46", outfit2: "#18181b", capColor: "#15803d", hairColor: "#27272a", scar: true },
        car: {
          type: "Kirli Beyaz Minibüs",
          color: "#cbd5e1",
          plate: "34 HKL 00",
          pumpNote: "⚠️ Plaka bantla tutturulmuş, vidaları sökük (Çalıntı plaka şüphesi)!"
        },
        depotIntruder: true,
        depotNote: "🚨 DİKKAT! Minibüsten inen ikinci şahıs ARKA DEPO havalandırmasını söküyor!",
        requests: { fuel: 450, coffee: "sade", toast: true, water: false },
        cashBill: { denom: 200, fake: true, serial: "FK-000200", uvText: "⚠️ SAHTE KOPYA! KAĞIT PARLIYOR!" },
        wantsCharger: false,
        phoneData: null,
        reward: 150,
        greeting: "450'lik mazot bas, bir sade kahve bir de tost ver koçum. Parayı peşin koydum tezgâha, ışığa mışığa tutmana gerek yok!",
        questions: [
          {
            btn: "Plakanız neden bantla yapıştırılmış?",
            mood: "angry",
            reply: "Sanayide tampon değişti birader, her şeye burnunu sokma!"
          },
          {
            btn: "Bu 200 lira bariz fotokopi?",
            mood: "nervous",
            reply: "Yanlış cebimden çıkmıştır ya... Neyse uzatma!"
          }
        ],
        outcomes: {
          serve: {
            correct: false,
            badge: "ÇİFTE ZARAR!",
            title: "Çalıntı plakalı kalpazana yakıt ve tost verdin! (-200 ₺)",
            desc: "Sahte parayla kasayı zarara uğrattın!",
            penalty: 200
          },
          lock: {
            correct: true,
            badge: "GEÇİT YOK!",
            title: "Sahtekârı ve depodaki ortağını püskürttün! (+120 ₺)",
            desc: "Yakıt alamadan kaçmak zorunda kaldılar!",
            bonus: 120
          },
          police: {
            correct: true,
            badge: "TAM İSABET!",
            title: "Çalıntı plakalı minibüs ekip tarafından bağlandı! (+190 ₺)",
            desc: "Hem sahte parayı hem arka depo hırsızlığını önledin!",
            bonus: 190
          }
        }
      },

      {
        id: "n3_emre",
        name: "Emre (Kayıp Kasiyer!)",
        role: "Eski Gece Vardiyacısı",
        time: "03:35",
        radioTicker: "📻 FM 98.4: Yağmur şiddetini artırdı, sabaha karşı fırtına bekleniyor...",
        look: { style: "curly", skin: "#f3c6a5", outfit: "#dc2626", outfit2: "#1e293b", hairColor: "#292524", bandage: true },
        car: {
          type: "Araç Yok (Yaya Geldi!)",
          color: "#1e293b",
          plate: "YAYA GELDİ",
          pumpNote: "Pompa 4 boş! Müşteri tarlaların içinden koşarak yaya geldi, kolunda sargı ve yırtık 'Son İstasyon' tişörtü var!"
        },
        depotIntruder: false,
        depotNote: "Arka saha şu an boş ama uzakta siyah bir cipin farları belirdi!",
        requests: { fuel: 0, coffee: null, toast: true, water: true },
        cashBill: { denom: 100, fake: false, serial: "PERSONEL-04", uvText: "100 ₺ ORİJİNAL (Emre'nin son parası) ✓" },
        wantsCharger: false,
        phoneData: null,
        reward: 100,
        greeting: "Kardeşim kapıyı aç, BEN EMRE! Maden deposundan ellerimi çözüp kaçtım! Çok susadım, bir suyla tost ver beni hemen içerideki odaya sakla; Kuzgun arkamdan geliyor!",
        questions: [
          {
            btn: "Gerçekten Emre olduğunu nasıl bileyim?",
            mood: "nervous",
            reply: "Kasanın altındaki ses kaydını ben bıraktım! Pompa 4'ün altındaki kör tanka kaçak külçe saklamışlar, şans eseri görünce beni kaçırdılar!"
          },
          {
            btn: "Şimdi polisi arayalım mı?",
            mood: "warm",
            reply: "Şimdi siren çalarsa Kuzgun uzaktan görüp kaçar! Önce beni içeri al, 10 dakika sonra Kuzgun pompaya yanaşınca suçüstü 112'ye bas!"
          }
        ],
        outcomes: {
          serve: {
            correct: true,
            badge: "EMRE KURTARILDI!",
            title: "Emre'ye su ve tost verip personel odasına sakladın!",
            desc: "Harika hamle! Emre güvende ve Kuzgun birazdan tuzağa kendi ayağıyla gelecek!",
            clue: "clue_emre_safe"
          },
          lock: {
            correct: false,
            badge: "BÜYÜK VİCDANSIZLIK!",
            title: "Yaralı Emre'yi kapıda bıraktın!",
            desc: "Çocukcağız yeniden karanlığa saklanmak zorunda kaldı!",
            penalty: 180
          },
          police: {
            correct: false,
            badge: "ERKEN SİREN!",
            title: "Emre kurtuldu ama sirenleri gören Kuzgun uzaktan geri döndü!",
            desc: "Emre sağ salim polise kavuştu fakat şebeke lideri Kuzgun uyarıyı fark etti.",
            penalty: 50
          }
        }
      },

      {
        id: "n3_kuzgun",
        name: "Kuzgun (Elebaşı)",
        role: "Siyah Zırhlı Cip Sürücüsü",
        time: "04:45",
        radioTicker: "🚨 KIRMIZI BÜLTEN: Organize kaçakçılık lideri 'Kuzgun' kod adlı şahsın 06 KZG 001 plakalı siyah ciple bölgede olduğu saptandı!",
        look: { style: "slick", skin: "#d6a27c", outfit: "#090d1a", outfit2: "#7f1d1d", hairColor: "#e2e8f0", scar: true, tie: "#dc2626" },
        car: {
          type: "Siyah Zırhlı SUV Cip",
          color: "#090d1a",
          plate: "06 KZG 001",
          pumpNote: "🚨 ARANAN ARAÇ: '06 KZG 001'! Pompa 4'ün yer kapağının tam üstüne park etti!"
        },
        depotIntruder: true,
        depotNote: "🚨 KRİTİK TEHLİKE! Kuzgun'un koruması ARKA DEPO kapısından içeri girmek üzere! Hemen alarmı çal!",
        requests: { fuel: 600, coffee: "sade", toast: false, water: false },
        cashBill: { denom: 200, fake: true, serial: "KZ-000001", uvText: "⚠️ SAHTE 200 ₺ BANKNOT!" },
        wantsCharger: true,
        phoneData: {
          owner: "Kuzgun'un Şifreli Telefonu",
          locked: true,
          pin: "4004",
          pinHint: "Kilit İpucu: ' Pompa 4 + iki sıfır + Pompa 4 ' (Muhbir Leyla'nın verdiği 4 haneli kod: 4__4)",
          wallpaperTone: "crimson",
          notifications: [
            {
              app: "ŞİFRELİ TRANSFER • ŞİMDİ",
              sender: "Liman Alıcısı",
              body: "Pompa 4'ün altındaki çantaları yükle, şahit kalmasın. Sabah 06:00 gemisi bekliyor!"
            }
          ]
        },
        reward: 200,
        greeting: "600 liralık yakıt doldur genç, bir de sert sade kahve ver. Telefonumu şarja bırakıyorum. Buraya yaralı bir çocuk uğradı mı? Doğruyu söyle, seni zengin edeyim.",
        questions: [
          {
            btn: "Pompa 4'ün altındaki tankta ne saklıyorsunuz?",
            mood: "angry",
            reply: "Demek burnunu fazla soktun... Arka kapıdaki adamım birazdan sana ne sakladığımızı gösterir!"
          },
          {
            btn: "Emre'yi neden kaçırdınız?",
            mood: "nervous",
            reply: "Görmemesi gereken şeyi gördü! Tıpkı senin şu an yaptığın gibi..."
          }
        ],
        outcomes: {
          police: {
            correct: true,
            badge: "EFSANE FİNAL!",
            title: "112 Özel Harekat Baskını! Kuzgun ve Çetesi Çökertildi! (+500 ₺ Ödül)",
            desc: "Depo alarmıyla korumasını kilitledin, 4004 şifresiyle suçu belgeledin ve 112'yi çağırdın! Emre kurtuldu, Son İstasyon kahramanı olarak manşetlere çıktın!",
            bonus: 500,
            clue: "clue_kuzgun_down"
          },
          lock: {
            correct: true,
            badge: "CANINI KURTARDIN",
            title: "Çelik kepengi indirdin ama Kuzgun cipiyle kaçtı (+120 ₺)",
            desc: "Emre'yi ve kendini korudun fakat elebaşı karanlıkta izini kaybettirdi.",
            bonus: 120
          },
          serve: {
            correct: false,
            badge: "KARANLIK SON!",
            title: "Kuzgun'a hizmet ettin, zula boşaltıldı!",
            desc: "Suç şebekesi Pompa 4'ün altındaki çantaları alıp kayıplara karıştı...",
            penalty: 300
          }
        }
      }
    ]
  }
];

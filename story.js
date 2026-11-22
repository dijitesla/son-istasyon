// Son İstasyon — 1. Gece: "Kayıp Vardiya" Hikaye ve Karakter Verisi

window.GAME_STORY = {
  nightNumber: 1,
  nightTitle: "1. GECE: KAYIP VARDİYA",
  bossNote: {
    sender: "Patron (Cevdet Abi)",
    time: "23:55",
    text: "Hoş geldin genç. Senden önceki gececi Emre 3 gündür sırra kadem bastı, telefonu da kapalı. Gece 12'den sabaha kadar Pompa 4 ve büfe sende. Radyoyu açık tut, dış kamerayı kontrol etmeyi unutma. Gözünü dört aç!"
  },
  customers: [
    {
      id: "selim",
      name: "Selim Usta",
      role: "Uzun Yol Kamyoncusu",
      time: "00:25",
      radioTicker: "📻 FM 98.4 GECE HABERLERİ: Kasaba çıkışındaki Son İstasyon'da çalışan 22 yaşındaki Emre K.'dan 3 gündür haber alınamıyor...",
      car: {
        type: "Kırmızı Çekici Kamyon",
        color: "#dc2626",
        plate: "52 TR 618",
        pumpNote: "Pompa 4 önünde rölantide çalışıyor. Dorse mühürlü, plaka temiz.",
        suspicious: false
      },
      orders: ["coffee", "toast"],
      wantsCharger: false,
      reward: 145,
      greeting: "Hayırlı işler yeğenim, yeni başlamışsın. Koyu bir gece kahvesiyle sıcak bir kaşarlı tost yap da gözümüz açılsın.",
      questions: [
        {
          btn: "Emre'yi tanıyor muydun?",
          reply: "Tanımaz mıyım, iyi çocuktu. Kaybolduğu gece 03:00 sularında buradan geçtim; Pompa 4'te çamurlu LACİVERT bir sedan duruyordu, plakasının sonu 404 gibiydi."
        },
        {
          btn: "Yol nereden böyle?",
          reply: "Ordu'dan fındık yükledim, sabaha Ankara'ya indireceğim inşallah. Gece bu yol tekin değildir, kapı kilidine elin yakın dursun."
        }
      ],
      phoneData: null,
      avatarSvg: `
        <svg viewBox="0 0 180 180" class="char-svg">
          <defs>
            <linearGradient id="jacket1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#9a3412"/>
              <stop offset="100%" stop-color="#431407"/>
            </linearGradient>
          </defs>
          <!-- Shoulders -->
          <path d="M24 180 C28 128 54 118 90 118 C126 118 152 128 156 180 Z" fill="url(#jacket1)" stroke="#090d1a" stroke-width="5"/>
          <path d="M72 118 L90 148 L108 118" fill="#fef3c7" stroke="#090d1a" stroke-width="4"/>
          <!-- Neck & Head -->
          <rect x="75" y="96" width="30" height="26" rx="8" fill="#e0a97f" stroke="#090d1a" stroke-width="4"/>
          <rect x="52" y="38" width="76" height="68" rx="28" fill="#eab68c" stroke="#090d1a" stroke-width="5"/>
          <!-- Trucker Cap -->
          <path d="M48 56 C48 26 132 26 132 56 Z" fill="#dc2626" stroke="#090d1a" stroke-width="5"/>
          <rect x="68" y="32" width="44" height="16" rx="4" fill="#fef08a" stroke="#090d1a" stroke-width="3"/>
          <path d="M42 55 Q90 46 142 58 Q112 64 42 55 Z" fill="#991b1b" stroke="#090d1a" stroke-width="4"/>
          <!-- Eyes & Mustache -->
          <circle cx="74" cy="70" r="4.5" fill="#090d1a"/>
          <circle cx="106" cy="70" r="4.5" fill="#090d1a"/>
          <path d="M66 61 L82 63" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M98 63 L114 61" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M68 88 Q90 79 112 88 Q102 96 90 93 Q78 96 68 88 Z" fill="#3f3f46" stroke="#090d1a" stroke-width="3"/>
        </svg>
      `,
      outcomes: {
        serve: {
          correct: true,
          badge: "DOĞRU KARAR",
          title: "Selim Usta memnun ayrıldı (+145 ₺)",
          desc: "Sıcak kahvesini alıp yola çıktı. Çamurlu lacivert araba ve '404' plaka ipucunu kenara not ettin.",
          clueUnlocked: "selim_clue"
        },
        lock: {
          correct: false,
          badge: "YANLIŞ ALARM",
          title: "Kamyoncu Selim Usta'yı kapıda bıraktın!",
          desc: "Adamcağız şaşkınlıkla kamyonuna binip gitti. Kasaya para girmedi, üstelik önemli bir görgü tanığını kaçırdın.",
          penalty: 50
        },
        police: {
          correct: false,
          badge: "ASILSIZ İHBAR",
          title: "Masum kamyoncuya polis çağırdın!",
          desc: "Ekip gelip evraklarına baktı, tertemiz çıktı. Patron telefon açıp fırça kaydı (-100 ₺ ceza).",
          penalty: 100
        }
      }
    },

    {
      id: "melis",
      name: "Melis",
      role: "Telaşlı Genç Yolcu",
      time: "01:40",
      radioTicker: "📻 FM 98.4 HAVA & YOL: Gece sağanağı şiddetleniyor. Şehirler arası yolda görüş mesafesi 20 metreye düştü...",
      car: {
        type: "Beyaz Küçük Hatchback",
        color: "#e2e8f0",
        plate: "34 MLS 27",
        pumpNote: "Arka koltukta aceleyle toplanmış bir valiz var. Sürücü sürekli dikiz aynasından yola bakıyor.",
        suspicious: false
      },
      orders: ["water"],
      wantsCharger: true,
      reward: 65,
      greeting: "Şey... bir şişe su alabilir miyim? Bir de telefonum kapandı, ne olur 2 dakika şarja takar mısın? Ellerim titriyor kusura bakma...",
      questions: [
        {
          btn: "İyi misin? Birinden mi kaçıyorsun?",
          reply: "Ben... sadece buradan şehir dışına geçiyorum. Eğer arkamdan takım elbiseli biri gelip beni sorarsa ne olur görmedim de!"
        },
        {
          btn: "Neden bu kadar geç çıktın?",
          reply: "Evde kalamazdım, telefonum da yolda kapandı. Şarj biraz dolsun hemen çıkacağım, söz kimseye yük olmam."
        }
      ],
      phoneData: {
        owner: "Melis'in Telefonu",
        battery: "%4 — Şarj Oluyor ⚡",
        wallpaperTone: "rose",
        notifications: [
          {
            app: "MESAJLAR • ŞİMDİ",
            sender: "Annem ❤️",
            body: "Kızım sakın eve dönme! Eski nişanlın Bora yine kapıya dayandı, gri arabasıyla peşinden yola çıktı. Doğru teyzene git!"
          },
          {
            app: "WHATSAPP • 2 DK ÖNCE",
            sender: "Bora (Engelli Numara - Yeni Hat)",
            body: "Şarjın bitti sanıyorsun ama son benzincide duracağını biliyorum Melis. Geliyorum."
          }
        ]
      },
      avatarSvg: `
        <svg viewBox="0 0 180 180" class="char-svg">
          <defs>
            <linearGradient id="hoodie2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#4f46e5"/>
              <stop offset="100%" stop-color="#1e1b4b"/>
            </linearGradient>
          </defs>
          <!-- Hair back -->
          <path d="M44 58 C38 96 40 132 54 144 L126 144 C140 132 142 96 136 58 Z" fill="#1e1b2e" stroke="#090d1a" stroke-width="5"/>
          <!-- Shoulders -->
          <path d="M30 180 C34 132 58 120 90 120 C122 120 146 132 150 180 Z" fill="url(#hoodie2)" stroke="#090d1a" stroke-width="5"/>
          <!-- Neck & Face -->
          <rect x="78" y="98" width="24" height="24" rx="8" fill="#f3c6a5" stroke="#090d1a" stroke-width="4"/>
          <rect x="56" y="40" width="68" height="64" rx="28" fill="#fad2b4" stroke="#090d1a" stroke-width="5"/>
          <!-- Bangs -->
          <path d="M54 58 C62 34 118 34 126 58 C112 50 96 54 90 46 C80 54 66 50 54 58 Z" fill="#1e1b2e" stroke="#090d1a" stroke-width="4"/>
          <!-- Worried Eyes -->
          <circle cx="75" cy="72" r="5" fill="#090d1a"/>
          <circle cx="105" cy="72" r="5" fill="#090d1a"/>
          <circle cx="76.5" cy="70.5" r="1.6" fill="#ffffff"/>
          <circle cx="106.5" cy="70.5" r="1.6" fill="#ffffff"/>
          <path d="M67 62 L81 59" stroke="#090d1a" stroke-width="3" stroke-linecap="round"/>
          <path d="M99 59 L113 62" stroke="#090d1a" stroke-width="3" stroke-linecap="round"/>
          <!-- Nervous mouth -->
          <path d="M82 90 Q90 86 98 90" fill="none" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
        </svg>
      `,
      outcomes: {
        serve: {
          correct: true,
          badge: "HAYAT KURTARDIN",
          title: "Melis'e yardım ettin ve uyarısını aldın (+65 ₺)",
          desc: "Şarjdaki mesajdan tehlikede olduğunu anladın. 'Arkandan soran olursa yanılttım bil' deyip güvenle uğurladın.",
          clueUnlocked: "saved_melis"
        },
        lock: {
          correct: false,
          badge: "VICDAN AZABI",
          title: "Yardıma muhtaç kızı yağmurda kapıda bıraktın!",
          desc: "Şarjsız telefonuyla karanlık yola geri dönmek zorunda kaldı. İçine kurt düştü.",
          penalty: 40
        },
        police: {
          correct: false,
          badge: "YANLIŞ DEĞERLENDİRME",
          title: "Suçlu sanıp korkuttun!",
          desc: "Siren sesini duyunca panikle arabasına atlayıp uzaklaştı. Oysa kaçan kişi suçlu değil mağdurdu.",
          penalty: 60
        }
      }
    },

    {
      id: "bora",
      name: "Bora",
      role: "Fazla Kibar Yabancı",
      time: "02:50",
      radioTicker: "📻 FM 98.4 GECE BÜLTENİ: Emniyet kaynakları kayıp kasiyer Emre olayında istasyonun arka deposunu mercek altına aldı...",
      car: {
        type: "Gri Spor Sedan",
        color: "#64748b",
        plate: "34 BR 901",
        pumpNote: "Motor kaputu çok sıcak, aşırı hızla gelmiş! Sürücü koltuğunun yanında başkasının kırık telefon kılıfı duruyor.",
        suspicious: true
      },
      orders: ["coffee"],
      wantsCharger: false,
      reward: 80,
      greeting: "İyi geceler dostum, sade bir kahve alayım. Bu arada... 15 dakika önce buradan beyaz arabalı genç bir kız geçti mi? Nişanlım cüzdanını evde unutmuş da yetişmeye çalışıyorum.",
      questions: [
        {
          btn: "Madem nişanlın, neden aramıyorsun?",
          reply: "Haha, şey... şarjı bitmiş galiba, ulaşamıyorum. Sen gördün mü görmedin mi onu söyle yeter, bahşişin benden."
        },
        {
          btn: "Kamerada çok hızlı geldiğin görünüyor?",
          reply: "Gece vakti boş yol birader, sorgu memuru musun kasiyer mi? Kahveyi ver, soruma cevap ver."
        }
      ],
      phoneData: null,
      avatarSvg: `
        <svg viewBox="0 0 180 180" class="char-svg">
          <defs>
            <linearGradient id="suit3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
          </defs>
          <!-- Suit Shoulders -->
          <path d="M26 180 C30 130 56 118 90 118 C124 118 150 130 154 180 Z" fill="url(#suit3)" stroke="#090d1a" stroke-width="5"/>
          <path d="M74 118 L90 156 L106 118 Z" fill="#e2e8f0" stroke="#090d1a" stroke-width="4"/>
          <path d="M87 124 L93 124 L95 152 L90 158 L85 152 Z" fill="#ef4444" stroke="#090d1a" stroke-width="2.5"/>
          <!-- Neck & Head -->
          <rect x="76" y="96" width="28" height="24" rx="8" fill="#dfb18b" stroke="#090d1a" stroke-width="4"/>
          <rect x="55" y="38" width="70" height="65" rx="24" fill="#eac09c" stroke="#090d1a" stroke-width="5"/>
          <!-- Slick Hair -->
          <path d="M52 54 C54 28 124 26 128 52 C114 40 72 40 52 54 Z" fill="#0f172a" stroke="#090d1a" stroke-width="4"/>
          <!-- Fake Smile & Sharp Eyes -->
          <circle cx="75" cy="69" r="4.5" fill="#090d1a"/>
          <circle cx="105" cy="69" r="4.5" fill="#090d1a"/>
          <path d="M66 60 L83 64" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M97 64 L114 60" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M75 86 Q90 95 106 84" fill="none" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
        </svg>
      `,
      outcomes: {
        serve: {
          correct: false,
          badge: "TEHLİKELİ HATA",
          title: "Takipçiye hizmet edip yol verdin!",
          desc: "Bora yüzündeki sinsi gülümsemeyle kahvesini aldı ve tam gaz Melis'in gittiği yöne sürdü. Yalanını yuttun!",
          penalty: 90
        },
        lock: {
          correct: true,
          badge: "USTACA HAMLE",
          title: "Kapıyı kilitledin, yalanını yüzüne vurdun! (+100 ₺ İtibar)",
          desc: "'Buradan kimse geçmedi, kamera kayıtta' deyip kepengi kilitledin. Bora küfredip ters yöne dönmek zorunda kaldı!",
          bonus: 100
        },
        police: {
          correct: true,
          badge: "TAM İSABET",
          title: "Polis devriyesi Bora'yı kavşakta durdurdu! (+120 ₺ Ödül)",
          desc: "Hakkındaki uzaklaştırma kararını ihlal ettiği ortaya çıktı. Melis artık tamamen güvende!",
          bonus: 120
        }
      }
    },

    {
      id: "yabanci",
      name: "Kapüşonlu Yabancı",
      role: "Gece Yarısı Müşterisi",
      time: "03:45",
      radioTicker: "🚨 SON DAKİKA ANONSU: Kayıp kasiyer Emre'nin son gecesinde istasyon kamerasına takılan LACİVERT SEDAN (Plaka sonu 404) her yerde aranıyor!",
      car: {
        type: "Çamurlu Lacivert Sedan",
        color: "#1e3a8a",
        plate: "06 KYP 404",
        pumpNote: "⚠️ DİKKAT: Plakanın üstü çamurla sıvanmış ama sonundaki '404' okunuyor! Bagaj kapağının arasından kırmızı 'Son İstasyon' personel yeleği sıkışmış!",
        suspicious: true
      },
      orders: ["toast", "water"],
      wantsCharger: true,
      reward: 110,
      greeting: "Tostla su ver, acelem var. Şu telefonu da 1 dakika prize tak; sakın ekranına elini sürme, bozuşuruz.",
      questions: [
        {
          btn: "Plakanız neden çamurla kaplı?",
          reply: "Dağ yolundan geldim birader, sana ne plakadan? İşini yap, fazla merak bu saatte adama yaramaz."
        },
        {
          btn: "Bagajdaki kırmızı kumaş bizim yelek mi?",
          reply: "Ne yeleği be?! Eski bez parçası o... Çabuk ver şu siparişi gidiyorum!"
        }
      ],
      phoneData: {
        owner: "Şifreli Cihaz",
        battery: "%9 — Şarj Oluyor ⚡",
        wallpaperTone: "crimson",
        notifications: [
          {
            app: "ŞİFRELİ SOHBET • ŞİMDİ",
            sender: "Kuzgun",
            body: "Kasiyer çocuk Emre'nin yaka kartını aldın değil mi? Pompa 4'ün altındaki eski kasayı açmadan şehirden çıkma!"
          },
          {
            app: "HATIRLATICI • 04:00",
            sender: "Gizli Not",
            body: "Yeni kasiyer şüphelenirse arka depodaki şalteri indir."
          }
        ]
      },
      avatarSvg: `
        <svg viewBox="0 0 180 180" class="char-svg">
          <defs>
            <linearGradient id="hood4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#111827"/>
              <stop offset="100%" stop-color="#030712"/>
            </linearGradient>
          </defs>
          <!-- Heavy Dark Hoodie -->
          <path d="M22 180 C26 126 52 114 90 114 C128 114 154 126 158 180 Z" fill="url(#hood4)" stroke="#090d1a" stroke-width="5"/>
          <!-- Outer Hood -->
          <path d="M40 108 C36 38 62 22 90 22 C118 22 144 38 140 108 C126 122 54 122 40 108 Z" fill="#1f2937" stroke="#090d1a" stroke-width="5"/>
          <!-- Shadowed Face -->
          <ellipse cx="90" cy="74" rx="34" ry="36" fill="#090d1a"/>
          <path d="M62 78 C66 98 114 98 118 78 Z" fill="#9ca3af" fill-opacity="0.22"/>
          <!-- Glowing Cold Eyes under hood -->
          <ellipse cx="76" cy="68" rx="5.5" ry="3" fill="#fca5a5"/>
          <ellipse cx="104" cy="68" rx="5.5" ry="3" fill="#fca5a5"/>
          <!-- Scar / Mask line -->
          <path d="M64 84 L116 84" stroke="#374151" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `,
      outcomes: {
        police: {
          correct: true,
          badge: "BÜYÜK YAKALAMA!",
          title: "112 Sessiz Alarm! Lacivert Sedan Kıskıvrak Yakalandı! (+250 ₺ Ödül)",
          desc: "Tostu hazırlıyor gibi yapıp tezgâh altından polisi aradın. Sirenler istasyonu sardı; bagajdan Emre'nin yaka kartı ve gizli bir kasa anahtarı çıktı!",
          bonus: 250,
          caughtSuspect: true
        },
        lock: {
          correct: true,
          badge: "KIL PAYI KURTULUŞ",
          title: "Kapıyı kilitledin ama şüpheli karanlığa kaçtı (+60 ₺)",
          desc: "Şüphelendiğini anlayınca telefonunu kapıp gaza bastı. Canını kurtardın ama 404 plakalı araç izini kaybettirdi.",
          bonus: 60,
          caughtSuspect: false
        },
        serve: {
          correct: false,
          badge: "FELAKET KARAR!",
          title: "Aranan suçluyu elini kolunu sallayarak gönderdin!",
          desc: "Hem plaka 404'tü hem de telefonunda Emre ile ilgili mesaj vardı! Adam gittikten 10 dakika sonra polis geldi ama çok geçti...",
          penalty: 150,
          caughtSuspect: false
        }
      }
    }
  ]
};

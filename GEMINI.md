# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al; kullanıcının istediği oyun güncellemelerini bu GitHub deposunda güncel tut.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v29.0 — Yaşayan Gerçek Şehir, Adım Adım Başkanlık Seçimi, Ferah Menüler & 34 Yeni Şehir Sistemi)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **Son Test İlerlemesiyle Doğrudan Açılış Linki:** https://dijitesla.github.io/son-istasyon/?kayit=son-durum
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 10 Arazili gerçekçi 2.5D/3D kuşbakışı canlı işletme & holding simülasyonu + önce manuel yönetip büyüdükçe eleman/müdür alma döngüsü + çok kaynaklı şahsi maaş, borsa ve şehir yaşamı.

### Mevcut Özellikler ve Dosya Yapısı (v17.0)
1. **1. Arazi — Ana İstasyon (`game.js`, `map_renderer.js`):**
   - 9 Yakıt Pompası (2 VIP), **🔵 LPG / Otogaz Adası & Basınçlı Tank**, **🚜 7/24 Sarı Kayar Kasalı Oto Çekici** (otoyolda arıza yapan aracı sırtına yükleyip Tamirhaneye getirir), **🚌 Şehirlerarası Otobüs Peronu & 🥖 Sıcak Taş Fırın**, EV Hızlı Şarj, Oto Yıkama, Tamirhane, Tır Kantarı, 7/24 Market, 10 Çeşit Yemekli Restoran, Mini Motel ve **👔 Sakin Müdür Kemal Bey** (çok acil kriz olmadıkça patronu rahatsız etmez).
2. **2. Arazi — Canlı İşlemli Ücretli Otopark & Otoyol Grand AVM (`empire.js`):**
   - **🅿️ Ücretli Otopark:** Başlangıçta 20 araç kapasiteli (`35 -> 55 -> 80 -> 110 -> 150` araca büyütülür), hareketli bariyerli gişe ve VIP Vale.
   - **🏬 Otoyol AVM (8 Dükkan):** İçindeki 8 dükkan başlangıçta bizim değildir; önce tek tek **tapusu satın alınır**, sonra **sabit veya ciro ortaklı kiracıya kiraya verilir**. Yanında Lojistik ve Plaza kuleleri bulunur.
   - **Canlı İşlemler & Ekip:** Otopark çıkışında `🎫 Ücret Al`, AVM'de `📦 Mal Kabul Kamyonu` ve `🧹 AVM Bakım` işlemleri başta oyuncu tarafından yapılır; sonradan Gişe Görevlisi, Mal Kabul Sorumlusu, Teknik Ekip ve 2. Arazi Müdürü işe alınır.
3. **3. Arazi — Eğlence, Rafineri, Filo & Tatil Köyü (`land3.js`):**
   - **🏎️ Go-Kart Yarış Pisti & 🎡 Dönme Dolap**, **🏭 Yakıt Rafinerisi** (1. İstasyonun tanker dolumunu **0 ₺ bedava** yapar!), **🚛 10 Tırlık Kendi Sevkiyat Filomuz** ve **🏖️ 6 Kiralık Bungalovlu Termal Tatil Köyü**.
4. **4.–10. Araziler — 10 Arazili Harita & 6 Seçenekli Mega Projeler (`lands_4_10.js`):**
   - Üst menüdeki **🗺️ 10 Arazi** butonundan açılır; `45.000 ₺`'den `1.100.000 ₺`'ye uzanan 7 yeni pahalı yatırım arsası (`4. Arazi` .. `10. Arazi`).
   - Her arsa alındığında **6 proje seçeneği** sunulur: **🏨 5 Yıldızlı Grand Otel (`65.000 ₺`)**, **🏥 Özel Hastane**, **🚗 Otomobil Fabrikası**, **🏟️ Stadyum**, **💻 Teknokent Veri Merkezi**, **👑 Kongre & Düğün Sarayı**.
   - Her projede başta müşteri kaydı ve oda/birim temizliğiyle oyuncu ilgilenir; büyüdükçe 4 kademe personel/müdür alınır ve 5 kata kadar çıkılır.
5. **Ayrıntılı Gün Sonu Muhasebe Tablosu, Şahsi Maaşlar & Telefon (`game.js`, `empire.js`, `story_events.js`, `audio.js`):**
   - Gün sonunda 1., 2. (AVM dükkanları tek tek dahil), 3., 4.–10. araziler ve devralınan rakip holdinglerin kazançları ayrı ayrı hesaplanır.
   - Tüm arazilerden ayrı ayrı **Şahsi Maaş** bağlanabilir; Borsa (6 hisse + kendi `SONH` hissen), YolGram (özel plaka rozetli), Emlakçı ve Oto Galeri aktiftir.
6. **v16.0 Holding & Patron Merkezi (`holding_v16.js` — Üst Çubukta `🏆` Butonu):**
   - **🏆 Holding Ligi & Rakip Şirketleri Satın Alma:** 5 rakip holdingin her birinin altında 3'er adet olmak üzere toplam **15 alt şirket** bulunur; oyuncular rakip şirketleri tek tek satın alıp kendi holdingine katabilir veya kalanları %8 indirimle toplu devralabilir.
   - **🎯 Günlük Görevler & Patron Rütbesi:** Her gün yenilenen 3 görev, alınabilir ödül parlaması, XP ile 8 farklı Patron Rütbesi (`Çırak Pompacı` -> `Efsane İmparator`).
   - **🌦️ Büyük Otoyol Günleri:** Dinamik özel günler (`🎉 Bayram Akını`, `❄️ Kar Fırtınası` kar yağışı efektli, `⚽ Derbi & Konser` konfeti efektli, `🌟 VIP Zirvesi`) ve gerçek trafik/gelir çarpanları.
   - **🏦 Kurumsal Banka & Kendi Holdingini Borsaya Açma (`SONH` IPO):** 3 farklı taksitli ticari kredi + Holding değeri `100.000 ₺`'yi geçince Halka Arz ile toplu fon, telefonda canlı `SONH` hissesi ve günlük şahsi temettü.
   - **🚁 Patron Prestiji:** Özel Patron Plakası, Lüks Motor Yat, Holding Genel Merkezi (+%15 kalıcı verimlilik) ve arazi değiştirirken haritanın üstünden dönen pervanesiyle uçan **Patron Helikopteri**.

- **v16.0 Ek Özellikler:**
  - **Kasadan mı, Şahsi Cüzdandan mı? (`#payChoiceModal`):** Tüm iş büyütme harcamalarında (tesisler, elemanlar, arsalar, rakip devralma, kredi kapama) oyuncuya **Şirket Kasası**, **Şahsi Cüzdan** veya **Kasa + Cüzdan Birlikte Öde** seçeneği sunulur.
  - **`?kayit=son-durum` Full 10 Arazi Kaydı:** 1'den 10'a kadar tüm araziler tüm yükseltmeleri, katları, dükkanları, 10 tırı, 6 bungalovu ve tam kadrosuyla %100 dolu şekilde açılır.

  - **v16.2 Görsel Cila & Otomasyon Düzeltmesi:**
    - 4.–10. arazilerdeki araçların otoyol girişinde donmasına sebep olan yol bulma hatası kesin olarak düzeltildi (3 noktalı waypoint + otomatik kayıt & temizlik hızlandırıldı, tüm arazilere v16 özel gün/Genel Merkez çarpanı bağlandı).
    - 2., 3. ve 4.–10. arazilere özel 3D üstten zemin haritaları eklendi (`assets/land2-ground.jpg`, `assets/land3-ground.jpg`, `assets/extra-ground.jpg`), koyu ince kaydırma çubukları, cam efektli modallar ve gece pencere parıltısı eklendi.
    - Tek seferlik **+%1000 Borsa Rallisi** (`surge1000Applied` bayrağıyla) eklendi.

  - **v17.0 Büyük Arayüz & Giriş Ekranı Yenilemesi:**
    - Tam ekran sinematik 3D açılış kapağı (`assets/cover-v17.jpg`), yazı kalabalığından tamamen arındırılmış minimalist altın tipografi ve tek dokunuşla `▶ KALDIĞIN YERDEN DEVAM ET` / `▶ OYUNA BAŞLA`.
    - 4 sıkışık üst bar yerine **tek temiz yüzen üst çubuk** (2 ana para birimi kısaltmalı + gün + `⚙️` açılır hızlı durum/ses paneli), **tek dokunuşlu kaydırmalı 10 arazi şeridi (`◀ 1..10 ▶ 🗺️`)** ve haritanın sağ kenarında **yüzen cam aksiyon butonları (`🏆 Holding`, `📱 Telefon`, `🏙️ Şehir`, `📊 Rapor`)** kuruldu.

  - **v18.0 Harita İçi 3D Mimari & Canlı Atmosfer Cilası:**
    - **1. Arazi (`map_renderer.js`):** 9 pompa kanopisine parlak metalik cam yansıması ve LED durum noktası, Market/Restoran/Motel cephelerine 3D derinlik gradyanı, Taş Fırın'a canlı titreyen odun alevi eklendi.
    - **2. Arazi (`empire.js`):** Yeni 3D taş meydan zemininin (`land2-ground.jpg`) görünmesi için yarı saydam meydan & otopark entegrasyonu, çift dalgalı mermer fıskiye ve Grand AVM cam kubbesine çapraz güneş yansıması eklendi.
    - **3. Arazi (`land3.js`):** Yeni 3D zümrüt çim zeminin (`land3-ground.jpg`) alttan parlaması sağlandı; neon ışıklı dönme dolap, SPA buharı ve gölgeli havuz şemsiyeleri eklendi.
    - **4.–10. Araziler (`lands_4_10.js`):** Düz kahverengi kutu yerine mermer sütunlu 3D mimari cephe, köşe LED ışıklı çatı kornişi, parlak cam yansımalı odalar, altın dubalı kırmızı halı ve 4 köşe fenerli helikopter pisti tasarlandı.

  - **v20.0 Gerçek İzometrik 3D WebGL Motoru (`engine3d.js`, `lib/three.min.js`):**
    - Düz 2D üstten görünüm yerine **gerçek Three.js İzometrik 3D dünya** kuruldu (*SimCity BuildIt* / *My Perfect Hotel* tarzı açılı 3D kamera, gerçek yönlü gölgeler, dinamik gece-gündüz gökyüzü ve sis).
    - **Tüm 10 arazi 3D sahneye taşındı:** 1. İstasyon (3D 9 pompa kanopisi, LPG silosu, EV, yıkama, tamir, kantar, market+güneş paneli, restoran, 2 katlı motel, taş fırın), 2. Arazi (3D hareketli bariyerli otopark, mermer fıskiye, cam kubbeli Grand AVM, yükselen Plaza gökdeleni), 3. Arazi (3D Go-Kart, dik dönen 3D Dönme Dolap, rafineri, 6 üçgen çatılı A-frame bungalov & havuz), 4.–10. Araziler (kat çıktıkça göğe yükselen 6 farklı 3D mega proje: Grand Otel + çatı havuzu, Hastane, Fabrika, Stadyum + projektörler, Teknokent, Altın Kubbeli Kongre Sarayı).
    - **Gerçek 3D Araçlar, Yürüyen Karakterler, Uçan 3D Helikopter ve Kamera Kontrolleri:** `➕`/`➖` yakınlaştırma, fare tekerleği, sürükle-kaydır (pan), `🎥` 3 farklı 3D kamera açısı (İzometrik 3D / Yakın Sinematik / Geniş Bakış) ve 3D Raycast ile tüm dokunmalar %100 çalışır.

  - **v20.1 SimCity Tarzı İzometrik 3D Kamera & Mimari Cilası (`engine3d.js`, `index.html`, `game.js`):**
    - Ön çatıları şişiren geniş açı yerine **dar açılı (28° FOV) dengeli SimCity izometrik maket kamerası** kuruldu; sol alta **🔄 90° döndürme** (4 köşe 360° bakış) eklendi.
    - Ekstra indirme gerektirmeden prosedürel asfalt, çim ve ışıklı cam cephe dokuları üretildi; tüm binalara çatı parapet çerçevesi, klima/havalandırma üniteleri, çift yüzlü ışıklı 3D tabelalar (`★ SON İSTASYON ★`, `MARKET 7/24`, `RESTORAN`, `MİNİ MOTEL`, `OTOYOL GRAND AVM`, `GRAND OTEL` vb.) ve aralarında temiz yaya kaldırımları eklendi.

  - **v21.0 Büyük 3D Grafik & Detay Yükseltmesi (`engine3d.js`, `index.html`):**
    - **2048×2048 Yumuşak Gölgeler & Atmosfer:** Gölgeler 4 kat netleştirildi; sokak lambaları ve pompa kanopilerinin altına sıcak zemin ışık haleleri, otoyola metal bariyerler, uzak ufka yeşil tepeler, geniş yapraklı ağaçlar ve çiçekli çalılar eklendi.
    - **Gerçekçi 3D Araçlar & Karakterler:** Araçlara gövde renginde boyalı tavan, krom jantlar, ön krom panjur, rüzgarlık, polis/çekici tepe lambaları ve otobüs panoramik camları eklendi. Karakterlere sallanan 3D kollar, siperlikli şapka, bekçi köpeği Duman'a da sallanan kuyruk, 4 pati ve kırmızı tasma eklendi.
    - **Canlı Bina & Saha Detayları:** Otoyol girişine ışıklı **3D Yakıt Fiyat Totemi (`SON 7/24`)**, yaya geçidi (zebra) çizgileri, dönen köpüklü oto yıkama fırçaları, tamirhane sarı liftleri, Restoran önü açık hava kafe masaları & kırmızı şemsiyeler, Market soğutucu dolabı, Motel uydu çanağı, tüm çatılara dokulu kaplama & ışıklı cam tavan pencereleri (skylight) eklendi. 2., 3. ve 4.–10. arazilere mermer giriş saçağı, köşe LED şeritleri, Go-Kart yarış bordürleri ve çiçek saksıları eklendi.

  - **v22.0 Tek Dev Açık Dünya 2×5 Şehir Bulvarı (`engine3d.js`, `game.js`, `index.html`):**
    - 10 ayrı ekran yerine **tüm 10 arazi tek bir kesintisiz 3D şehir haritasında** 2 sıra × 5 arazi düzeninde birleşti (Üst sıra: `1. İstasyon`, `2. Grand AVM`, `3. Lunapark`, `4. Grand Otel`, `5. Hastane`; Alt sıra: `6. Fabrika`, `7. Stadyum`, `8. Teknokent`, `9. Kongre Sarayı`, `10. 2. Grand Otel`).
    - İki ana otoyol bulvarı, 6 dikey bağlantı caddesi, güney çevre yolu, kesintisiz akan şehir trafiği ve henüz alınmamış arsalar için 3D **"SATILIK ARSA"** çitli parselleri kuruldu.
    - Parmağınla/fareyle sürükleyerek araziler arasında kesintisiz gezilir, üstteki `1..10` butonları kamerayı o araziye akıcı biçimde uçurur, `🎥` kamera moduna eklenen **"İmparatorluk"** kuşbakışı ile tüm 10 arazi tek ekranda görünür ve hangi araziye dokunulursa doğrudan o arazi yönetilir.

  - **v23.0 Altı Yeni Canlı Oyun Mekaniği (`mechanics_v23.js`, `engine3d.js`, `game.js`, `index.html`, `style.css`):**
    1. **🏎️ Patron Direksiyonda (3D Açık Dünya Sürüş & 2x Hız Teftişi):** Sol alttaki `🏎️` butonuyla veya `⚡ Komuta -> Sürüş` menüsünden kendi kişisel arabanla (İtalyan Süper Spor, Elektrikli SUV, Lüks Sedan vb.) 2×5 3D şehir bulvarında Mac/Windows (`WASD` / Yön tuşları + `Space` korna) ve mobil dokunmatik yön tuşlarıyla serbestçe gezilir; sahip olunan arazilerin önünde **📣 Teftiş & Korna** basıldığında 60 sn boyunca **2x Hız & Verim** bonusu açılır!
    2. **⛽ Canlı Akaryakıt Fiyat Rekabeti:** `🟢 İndirimli Sürüm (39.90₺ — +%65 araç akını + market/restoran yoğunluğu)`, `🟡 Piyasa Normali (44.90₺)` ve `🔴 Yüksek Kâr Marjı (52.90₺ — +%45 araç başı yakıt/LPG/EV kârı)` modları; seçilen fiyat **3D Yakıt Fiyat Totemi** üzerinde anında güncellenir!
    3. **🚑 Araziler Arası 3D Acil Müdahale:** Sahip olunan arazilerde periyodik sağlık veya kıvılcım/teknik acilleri çıkar; tek dokunuşla (veya 🏥 Özel Hastane + Müdür varsa otomatik) **3D Ambulans** veya **3D İtfaiye/Acil Ekip Aracı** çakar lambalarıyla bulvardan hedef araziye gidip müdahale eder, yüksek nakit + itibar kazandırır.
    4. **🔨 Canlı Dev İhaleler (Süreli Açık Artırma):** Rakiplerle (`Hakkı Bey`, `Selçuk Bey`, `Aysel Hanım` vb.) yarışılan süreli B2B/Belediye yakıt, lojistik, stadyum sponsorluğu ve havalimanı VIP transfer ihaleleri; kazanılan sözleşmeler çok günlü düzenli döngü geliri sağlar.
    5. **🪧 Kendi Marka Adını & Neon Rengini Basma:** Oyuncunun yazdığı marka adı (ör. `DİJİTESLA`) ve seçtiği 5 kurumsal neon rengi **3D Yakıt Totemi, Otoyol Dev Tabelası, Market, Grand AVM, Grand Otel, Açılış Logosu ve Holding Ligi** tabelalarına anında işlenir!
    6. **🏅 Çalışan Morali, Kahve İkramı, Bayram İkramiyesi & Sosyal Tesis:** Tüm 10 araziyi etkileyen moral çubuğu (`0–150%`), Sıcak Kahve & Tatlı ikramı, **%150 Süper Coşku (1.5x Turbo Hız)** veren Bayram İkramiyesi ve yorulmayı %65 azaltan kalıcı **Personel Dinlenme & Kafe Salonu**.

  - **v24.0 Tam Ekran Geniş Görünüm, Şehir Coğrafyası, Köşe Mini Radar & 4 Yeni Bölge (`city_v24.js`, `engine3d.js`, `style.css`, `index.html`, `game.js`):**
    1. **🖥️ Tam Ekran Geniş Görünüm & Köşe Şehir Radarı (`#miniRadarBox`):** Bilgisayar (Mac/Windows), tablet ve yatay/dikey telefonlarda eski dar `450px` telefon çerçevesi kaldırılıp **100% tam ekran geniş 3D şehir görünümü** açıldı. Sol üste tüm bölgeleri, gemiyi, taksileri ve patron aracını canlı gösteren, tek dokunuşla istenen bölgeye uçuran **Kuşbakışı Şehir Radarı** eklendi.
    2. **🏡 Kuzey Manzaralı 3D Patron Malikanesi & Özel Garaj (`mansion`):** Kuzeydeki yüksek teras tepede oyuncunun aldığı Villa, Sonsuzluk Havuzu, Misafir Köşkü, Helikopteri ve 4 Koleksiyon Arabası canlı 3D sergilenir; **VIP Yatırımcı Daveti** düzenlenebilir.
    3. **⚽ Stadyumda Kendi Futbol Kulübün (`<MARKA> SK`):** Yıldız kaleci, 10 numara, golcü forvet ve teknik direktör transferleriyle takım gücü artırılır; canlı 90 dakika maç simülasyonu, 3D stadyum üstü canlı skor tabelası ve yüksek bilet/yayın geliri sağlar.
    4. **🚕 Şehir İçi Taksi & Dolmuş Hattı:** Batı kavşağındaki merkez duraktan çıkan 8'e kadar **3D Sarı Taksi ve Şehir Dolmuşu**, tüm bulvarlarda dolaşarak düzenli taksimetre kazancı bırakır.
    5. **⚓ Güney Deniz Kıyısı, Marina & İhracat Limanı (`port`):** Şehrin güneyi kumsal, palmiyeli kordon, deniz feneri ve masmavi denize açıldı. Lüks Yat marinada yüzer; dev **3D İhracat Kargo Gemisi** rıhtım vinçlerinin altına yanaşıp Rafineri, Oto Fabrika ve Teknokent ürünlerini yurt dışına ihraç eder.

  - **v25.0 Arazilerde 14 Farklı 3D Yapı Çeşidi & Yapı Değiştirme (`lands_4_10.js`, `engine3d.js`, `city_v24.js`, `game.js`):**
    - Satın alınan arazilere (4.–10. Araziler) kurulabilen yapı seçenekleri 6'dan **14 farklı özel 3D mimarili yapıya** çıkarıldı (`🏨 Grand Otel`, `🏥 Özel Hastane`, `🚗 Oto Fabrika`, `🏟️ Stadyum`, `💻 Teknokent`, `👑 Kongre Sarayı`, **`🌾 Organik Çiftlik & Sera`**, **`🎢 Dev Aquapark`**, **`🎬 Film & Dizi Stüdyosu`**, **`🎓 Özel Üniversite & Saat Kulesi`**, **`⚡ Dönen Rüzgar & Güneş Enerji Santrali`**, **`🏙️ Gökyüzü Köprülü İkiz Kuleler`**, **`✈️ 3D Yolcu Jetli Özel Havalimanı`**, **`🏦 Altın Taçlı Finans Kulesi & Banka`**).
    - Kategori süzgeci (`🌟 Tümü`, `🏨 Turizm`, `🏭 Üretim`, `🎓 Prestij`) ve kurulu bir yapıyı %50 iadeyle kaldırıp **başka bir yapı kurma (`🔄 Değiştir`)** özelliği eklendi.

  - **v25.1 Dikey 9:16 Mobil Oyun Çerçevesi Geri Getirildi (`style.css`, `index.html`):**
    - v24.0'da eklenen tam ekran yatay/masaüstü genişleme (`width: 100vw` ve `@media (min-width: 680px)`) kaldırıldı; oyun yeniden orijinal **dikey 9:16 mobil telefon çerçevesine** (`max-width: 450px`, `max-height: 940px`) alındı.
    - Köşe Şehir Radarı mobil boyutuna (`112×80px`) daraltıldı, özel gün rozeti sağ üste taşındı ve 6'lı sağ menü butonları dikey mobil ekrana çakışmasız oturtuldu.
    - **KURAL:** Oyun her zaman **dikey 9:16 mobil oyun görünümünde** kalmalı; tam ekran yatay masaüstü görünümüne çevrilmemeli.

  - **v26.0 Yayın Öncesi Cila, Gerçekçi 3D Atmosfer & Android APK (`engine3d.js`, `game.js`, `empire.js`, `index.html`, `style.css`, `.github/workflows/build-apk.yml`):**
    - **Ekonomi Dengelemesi & Test Temizliği:** Yapay `+%1000` test borsa sıçraması ve açılıştaki full kayıt test butonu kaldırıldı (gizli `?kayit=son-durum` test linki korunur); sıfırdan başlayanlar için başlangıç kasası (`180 ₺`), ilk pompa/eleman fiyatları ve yakıt gelirleri dengelendi.
    - **İlk 3 Adım Başlangıç Rehberi (`#onboardingGuide`):** Yeni oyunculara sırasıyla ilk dolum, ilk geliştirme ve ilk pompacı adımlarını gösteren, tamamlanınca otomatik kapanan rehber eklendi.
    - **Ekstra Gerçekçi 3D Grafikler:** Gökyüzünde süzülen 3D bulut kümeleri, altın gün batımı kenar ışığı (`rimLight`), her aracın altında yumuşak temas gölgesi + gece asfalta vuran far hüzmeleri, hareketli deniz dalgaları, pompa koruma dubaları, lastik izli asfalt şeridi, pompadan araca bağlanan **canlı 3D yakıt dolum hortumu** ve Restoran/Fırın bacalarından yükselen sıcak duman eklendi.
    - **Android APK Otomasyonu:** GitHub Actions üzerinden dikey kilitli, çevrimdışı çalışan **Android APK (`Son-Istasyon-v26.0.apk`)** üretim hattı kuruldu.

  - **v27.0 Akıcı 60 FPS Performans, İki Parmak Kamera, İç Müşteri Görünürlüğü, Sığan/Kapanan Uyarılar & 10 Banka Kredisi (`engine3d.js`, `game.js`, `holding_v16.js`, `mechanics_v23.js`, `style.css`, `index.html`):**
    1. **⚡ 60 FPS Akıcılık & Sıfır Gecikme:** Şekil bazlı sıfır tahsisli (zero-alloc) 3D araç ve karakter havuzları, paylaşımlı geometri önbelleği, akıllı ekran-dışı mesafe gizleme (off-screen culling), tek aşamalı hızlı kamera takibi, kısıtlanmış DOM HUD güncellemesi ve gecikmesiz arka plan kaydı (`saveGame`) ile kasma ve dokunma gecikmesi tamamen giderildi.
    2. **🤌 Gerçek İki Parmak Yakınlaştırma & Serbest 360° Döndürme:** Eski `➕`, `➖`, `🔄` tuşları kaldırıldı; tek parmak 1:1 zemine kilitli kaydırma, **iki parmak kıstır/aç yakınlaştırma (pinch-to-zoom)**, **iki parmak çevirerek serbest 360° döndürme (twist-to-rotate)** ve iki parmak dikey eğim (Mac/Windows'ta fare tekerleği / trackpad kıstırma + sağ tık veya `Shift+Sürükle` serbest döndürme) eklendi.
    3. **🏪 Market, Restoran, Motel ve Servislerde Müşteri Görünürlüğü:** Market, Restoran ve Motel önüne şeffaf ışıklı 3D cam vitrinler + taş meydan eklendi; içeride müşteri varken vitrin ve Motel 2. kat oda pencereleri sıcak sarı yanar, 3D müşteriler kasa/şemsiyeli masa/resepsiyon önünde görünür ve üstlerinde canlı müşteri sayısı + ilerleme çubuğu (`🛒 MARKET: X Müşteri`, `🍽️ RESTORAN: X Müşteri`, `🏨 MOTEL: X/Y Dolu`, `⚡/🚿/🔧/⚖️/🔵`) yazar.
    4. **🚨 Ekrana Tam Sığan & Dokununca Kapanan Uyarılar:** Acil durum uyarısının sağa taşmasına yol açan `transform` çakışması giderildi; tüm gelen uyarılar (`#cityEmergencyBar`, `#toastBanner`, `#managerAlertBar`, `#activeEffectBar`, alt ipucu çubuğu) 9:16 ekrana tam sığar ve **üzerine dokunulduğu anda kapanır**.
    5. **🏦 10 Farklı Banka Kredisi Tutarı:** Mevcut `15.000 ₺`, `55.000 ₺` ve `220.000 ₺` kredileri korundu; `5.000 ₺`, `30.000 ₺`, `110.000 ₺`, `500.000 ₺`, `1.000.000 ₺`, `2.500.000 ₺` ve `5.000.000 ₺` tutarlarında 7 yeni kredi eklendi.
    6. **✨ Gelişmiş 3D Grafikler:** 256px keskin asfalt ve taş meydan dokuları, gece yıldızlı gökyüzü kubbesi, araç yan aynaları, kesintisiz LED arka stop şeridi ve taksilerde ışıklı sarı `TAKSİ` tepe tabelası eklendi.

  - **v27.1 Kapsamlı Oyun Testi (QA) & Hata Düzeltmeleri (`game.js`, `empire.js`, `engine3d.js`, `holding_v16.js`, `land3.js`, `lands_4_10.js`, `index.html`, `manifest.json`):**
    1. **Menü Sekmesi Çakışması Hatası Giderildi (`game.js`, `empire.js`):** `⚡ Komuta` veya `⚓ Liman/SK` pencerelerinde sekme değiştirildiğinde ortak `.city-tab-btn` sınıfı yüzünden `🏙️ Şehir` ekranının bozulmasına yol açan sekme çakışması kesin olarak düzeltildi.
    2. **2. Arazi ve 4.–10. Arazilerde Eksik 3D İşlem Rozetleri Eklendi (`engine3d.js`):** 2. Arazide eleman alınmadan önce görünmeyen `🎫 ÜCRET AL!`, `📦 MAL KABUL YAP!` (turuncu 3D sevkiyat kamyonu dahil), `🧹 AVM BAKIM YAP!`, `📦 LOJİSTİK` ve `🏢 PLAZA` 3D etiketleri ile zemin parselleri eklendi; 4.–10. arazilerde eleman yokken müşteri kaydı ve temizlik uyarı rozetleri 3D binanın önüne eklendi.
    3. **3D Etiket Kenar Kesilmesi & Harita Tıklama İyileştirmesi (`engine3d.js`, `game.js`, `land3.js`, `lands_4_10.js`):** Kamerayı kaydırırken veya yakınlaştırırken ekran dışına çıkan 3D etiketlerin yarım kesilerek kenarda kalması önlendi; satılık arsalarda dokunma alanı genişletildi; 1. İstasyonda haritadan doğrudan bina/pompa açma işlemleri Şahsi Cüzdan/Ortak Ödeme (`payForBusiness`) sistemine bağlandı ve şahsi cüzdan `0 ₺` iken gereksiz ödeme seçimi penceresi kaldırıldı.
    4. **Muhasebe, Holding Değeri & Tanım Güncellemeleri (`game.js`, `holding_v16.js`, `manifest.json`):** Gün sonu giderlerine Liman Müdürü ve Futbol Kulübü transfer maaşları eklendi; günlük ciro görevine ve Holding Ligi değer hesabına yeni bölge/VIP yatırımları (`price` alanı düzeltmesiyle) dahil edildi; `manifest.json` eski dedektiflik metninden güncel Türkçe holding açıklamasına çevrildi.

  - **v28.0 Büyükşehir Planlaması, 16 Arazi, Rakip Bölgeleri Devralma, 1+10 Kilitli Çevre Şehir & 17 Yeni İmparatorluk Sistemi (`metropolis_v28.js`, `lands_4_10.js`, `engine3d.js`, `city_v24.js`, `mechanics_v23.js`, `empire.js`, `holding_v16.js`, `game.js`, `index.html`, `style.css`):**
    1. **🏙️ 4 Bölgeli 16 Arazi & Rakip Patronlardan Arazi Satın Alma (`lands_4_10.js`, `engine3d.js`):** Mevcut başlangıç yapısı ve 1.–10. arazi ilerlemesi korunarak Merkez Şehir **16 adet 3D araziye (`Arazi 1..16`)** büyütüldü ve **4 Şehir Bölgesine** (`Merkez Otoyol`, `Kuzey Bulvar`, `Güney Sanayi & Finans`, `Doğu-Batı Ufuk`) ayrıldı (bölge tamamlanınca `+%18` Bölge Hakimiyet Bonusu). `8, 9` ve `11..16` numaralı araziler rakiplerin (`Hakkı Bey`, `Selçuk Bey`, `Aysel Hanım`, `Turgut Bey`, `Cemil Soylu`) 3D binalarıyla doludur; oyuncu ilerledikçe bu arazileri rakiplerden satın alıp kendi tesisini kurar!
    2. **🌍 1 Ana Şehir + Etrafında 10 Kilitli Çevre Şehir (`metropolis_v28.js`, `lands_4_10.js`):** Merkez Şehrin etrafında dairesel ülke haritasında **10 çevre şehir (`Yeşil Sahil Kenti` -> `Mega Başkent Metropolü`)** yer alır. Kilitler hemen açılmaz: Merkez Şehirdeki **16/16 (%100)** yapı bitince `1. Çevre Şehir`, oradaki **8/8** bölge (yarısı rakiplerde) tamamlanınca `2. Çevre Şehir` ve sırayla `10. Çevre Şehir` açılır!
    3. **🌐 Büyükşehir & İmparatorluk Merkezi (`#metropolisBtn` — Tüm 17 Öneri Eklendi):**
       - **🚄 3D Hızlı Tramvay Hattı** (orta refüjde hareketli 3 vagonlu 3D tren, yolcu indirme & bilet geliri) ve **🛵 3D Motokurye Filosu** (`0..10` sarı çantalı kurye).
       - **🏭 Tesisler Arası Üretim Zinciri** (`Çiftlik ➔ Market/Restoran +%35`, `Oto Fabrika ➔ Taksi/Çekici/Oto Pazarı +%35`, `Rafineri ➔ Bedava Tanker + Bayilik +%30`, `Teknokent ➔ Kurye +%30 & %0 Borsa komisyonu`, `Film Stüdyosu ➔ AVM/Bayilik +%30`, `Santral ➔ Fatura -%50 & EV/Tren +%35`).
       - **🏛️ Belediye Seçimi & 4 Şehir Kararnamesi**, **🌧️ Gerçekçi Hava Durumu & Parlayan Islak 3D Asfalt**, **🏫 Şehre Adını Yaşatan 4 Kalıcı 3D Eser** (`Okul`, `Sahil Parkı`, `Yaya Üst Geçidi`, `Vakıf`) ve **🎪 3D Bulvar Rallisi & Dev Stadyum Konseri**.
       - **🏗️ Kat Kat Tasarlanan 3D Karma Gökdelen** (`mixedtower` — 15. yapı seçeneği; Zemin, Orta, Üst ve Çatı katlarını oyuncu seçer), **⛽ Ülke Çapında `<MARKA>` Bayilik (Franchise) Zinciri (`0..25` Şube)** ve **⭐ Özel Yetenekli 4 Baş Müdür** (otomatik XP ile `Sv.1..5`).
       - **🚗 2. El Araç Al - Tamir Et - Sat Oto Pazarı**, **🛡️ Zırhlı Kasa Aracı (`+%4/gün` faizli Merkez Kasası) & Gece Hırsızı Kovalamacası**, **🛳️ Dev 3D Kruvaziyer Turist Gemisi & 🛥️ Balıkçı Tekneleri**.
       - **🔥 Rakip Karşı Hamleleri & 📰 Şehir Postası Gazetesi**, **⏱️ Süreli Fırsat Görevleri**, **🏆 12 Ödüllü Kupa Vitrini** ve **💾 Cihazlar Arası Kayıt Kodu Taşıma** (Mac `Cmd+C/V` & Windows `Ctrl+C/V`).

  - **v29.0 Yaşayan Gerçek Şehir, Adım Adım Belediye Başkanlığı (`Başkan Ekrem Çetin`), Kullanışlı Yeni Menüler & 34 Yeni Sistem (`realcity_v29.js`, `metropolis_v28.js`, `engine3d.js`, `game.js`, `index.html`, `style.css`):**
    1. **🧭 Ferah 4'lü Ana Menü, Hızlı Rehber Çekmecesi & Kaydırılabilir Hap Sekmeler (`index.html`, `style.css`):** Sağ kenardaki sıkışık 7 küçük buton kaldırılıp ferah **4 Ana Merkez (`🏪 Şehir İşleri`, `🏛️ Belediye`, `🏆 Holding`, `🧭 Menüler`)** yapısına geçildi; tüm menü sekmeleri yatay kaydırılabilir okunaklı hap butonlara (`pill-tabs-scroll`) dönüştürüldü; sol alta **🚶 Sokak Seviyesinde Gezme (`#btnStreetView`)** tuşu eklendi.
    2. **🏛️ Mevcut Belediye Başkanı (`Başkan Ekrem Çetin`), Ayrı Belediye Bütçesi & Vergi Sistemi (`v29.1`):** Oyuncu hemen başkan olamaz! Başlangıçta şehri **Başkan Ekrem Çetin** yönetir; belediye yetkileri kilitlidir. Seçime girmek için 4 şart gerekir (`Gün 8+ / 4 Arazi`, `İtibar ≥ 75`, `En Az 1 Kalıcı Eser`, **🗣️ Vatandaş Talepleriyle `%51+` Halk Oyu**). Başkan seçilince şirket kasasından **tamamen ayrı bir `🏛️ Belediye Hazinesi (Belediye Bütçesi)`** açılır! Bütçe **Emlak & Çevre Temizlik Vergisi**, **Esnaf Ruhsat/İlan Harçları**, **Ulaşım/Köprü/Teleferik/Su İşletme Gelirleri** ve **Gün Sonu İller Bankası Nüfus Ödeneği** ile dolar; başkan **Vergi Oranını (`%4 Düşük / %8 Dengeli / %14 Yüksek`)** belirler ve tüm belediye işleri (`Tramvay`, `Belediye Otobüsü`, `Çöp/Geri Dönüşüm`, `İtfaiye/Polis/Zabıta`, `Asfaltlama`, `Elektrik/Su`, `3D Teleferik`, `3D Körfez Köprüsü`, `Kültür Festivali`) kendi şirket parasına hiç dokunmadan **yalnızca Belediye Bütçesiyle** yapılır!
    3. **🏪 Gerçek Şehir İşletmeleri, Müteahhitlik, 4 Mevsim & 3D Mega Altyapı (`realcity_v29.js`, `engine3d.js`):**
       - **Esnaf, Reyon & Ticaret:** İstasyon Market **4 Reyon Yönetimi** (Kahve, Soğuk İçecek, Fırın, Oto Aksesuar), **Kantar Kaçak/Aşırı Yük Denetimi**, **Mahalle Esnaf Çarşısı** (Berber, Eczane, Fırın, Kasap, Terzi), **Kuyumcu & Canlı Altın/Döviz Bürosu**, **Sebze-Meyve & Balık Hali**, **Su/Tüp/Kargo Dağıtım Kamyonetleri**, **Oto Sanayi & Ekspertiz (+%25 araç değeri)**, **Sürücü Kursu** ve **Düğün Salonu**.
       - **Müteahhitlik & Mahalle Değerlenmesi:** Arsa alıp apartman/site dikerek ister **peşin satma ister kiraya verme (`Yap-Sat-Kirala`)** ve şehre tesis yaptıkça değerlenen mahalle parsellerinde **Emlak Al-Sat**.
       - **Sahil, Uçuş & Yaşayan Sokaklar:** Güney kumsalda **3D Sahil Çay Bahçesi & Şezlonglu Plaj**, **Koy Gezi Teknesi**, **Hafta Sonu Gece Pazarı Karavanları**, **3D Gelin Arabası Düğün Konvoyu**, **4 Mevsim Döngüsü** (İlkbahar-Yaz-Sonbahar-Kış 3D zemin tonları), **3D Sarı Kule Vinçli İnşaat Şantiyesi** ve Havalimanından **10 Çevre Şehre İnip Kalkan 3D Yolcu Uçağı & VIP Jet**.
       - **Kurumsal, Banka, Medya, Yarış & Neon Araç:** **4 Yönetim Kurulu Üyesi**, **Marka Sponsorlukları**, esnafa/şirketlere faizle kredi veren **Kendi Kredi Bankan**, **Canlı TV Röportajı**, **Işıklı 3D Cadde Bilboardları & Yerel TV**, **Nitro'lu 3D Go-Kart/Bulvar Yarışı** ve **Patron & 3D Araç Altı Neon LED Tasarımı**.

## 📌 Diğer Bilgisayardaki Asistana Devir Notu (28 Kasım — v29.0 Son Durum)
- **Mevcut Sürüm:** **v29.0** — 16 Arazi, 1+10 Kilitli Çevre Şehir, Mevcut Başkan Ekrem Çetin -> Adım Adım Seçim sistemi, ferah 4'lü menü tasarımı ve 34 yeni gerçek şehir sistemi tamamlandı; 5 senaryolu tam simülasyon testinden (`TEST 1..5`) **0 hata** ile geçti.
- **Bu Oturumda Tamamlanan Büyük Dönüşüm (v22.0 -> v25.0):**
  1. **6 Yeni Canlı Mekanik (`v23.0`, `mechanics_v23.js`):** 3D Patron Aracı Sürüşü (`WASD`/Oklar + Mobil D-Pad + `📣 2x Hız Teftiş`), Canlı Akaryakıt Fiyat Rekabeti (3D Totem senkronlu), 3D Ambulans/İtfaiye Acil Müdahale, Süreli Dev İhaleler, Kendi Marka Adını & Neon Rengini 3D Tabelalara Basma ve Çalışan Morali / Bayram İkramiyesi (%150 hız).
  2. **Tam Ekran Görüntüleme, Şehir Radarı & 4 Yeni Bölge (`v24.0`, `city_v24.js`, `style.css`):** Dar `450px` kutu kaldırılıp Mac/Windows ve yatay/dikey telefonda **%100 Tam Ekran 3D Şehir** görünümüne geçildi; sol üste tek dokunuşla ışınlayan **Kuşbakışı Şehir Radarı** eklendi. Kuzeye **3D Patron Malikanesi Tepesi**, güneye **Mavi Deniz, Marina & 3D Kargo Gemili İhracat Limanı**, stadyuma **Kendi Futbol Kulübün (`<MARKA> SK`)** ve caddelere **8 Araçlık Sarı Taksi & Dolmuş Filosu** eklendi.
  3. **14 Farklı 3D Arazi Yapısı & Yapı Değiştirme (`v25.0`, `lands_4_10.js`, `engine3d.js`):** 4.–10. arazilere kurulabilen yapılar 6'dan **14 özel 3D binaya** çıkarıldı (`Organik Çiftlik`, `Aquapark`, `Film Stüdyosu`, `Üniversite`, `Rüzgar & Güneş Santrali`, `İkiz Kuleler`, `Özel Havalimanı`, `Finans Banka Kulesi` eklendi) + kategori süzgeci ve `%50` iadeli **`🔄 Yapıyı Değiştir`** özelliği kuruldu.
- **Diğer Bilgisayarda Sıradaki Olası Adımlar:**
  1. Kullanıcının isteğine göre yeni şehir mekanikleri (Belediye/Vergi, Hızlı Tren/Metro vb.) veya **v25.0** üzerine ince görsel/ses cilası,
  2. Yayın öncesi **Zorluk ve Ekonomi Dengelemesi** (erken aşama para kazanma hızına kullanıcı isteyene kadar dokunma; son aşamada dengelenecek),
  3. Yayın hazırlığı (mobil performans kontrolü, PWA ikonu/açıklaması, mağaza/web yayın adımları).
- **KRİTİK KURAL:** `game.js` içindeki `SAVE_KEY = "son_istasyon_v12_pro"` anahtarını **ASLA değiştirme** ki kullanıcının canlı sitedeki (`https://dijitesla.github.io/son-istasyon/`) kendi ilerlemesi sıfırlanmasın.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull origin main`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al; kullanıcının istediği oyun güncellemelerini bu GitHub deposunda güncel tut.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v22.0 — Tek Dev Açık Dünya 2×5 Şehir Bulvarı 3D Motoru — Three.js)
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

## 📌 Diğer Bilgisayardaki Asistana Devir Notu (25 Kasım — Windows -> Mac, v17.0)
- **Mevcut Sürüm:** **v17.0** — tüm dosyalar `main` dalına yüklendi ve canlı tarayıcıda **0 konsol hatası** ile doğrulandı.
- **Bu Oturumda Tamamlananlar (v16.0 -> v17.0):**
  1. `holding_v16.js`: Holding Ligi + **5 rakip holdingin altında toplam 15 alt şirketi tek tek satın alma** (veya %8 indirimli toplu devralma), Günlük Görevler & 8 Patron Rütbesi, Büyük Otoyol Günleri (`Bayram`, `Kar`, `Derbi`, `VIP`), Kurumsal Banka & Halka Arz (`SONH`), Özel Plaka, Yat, Genel Merkez ve Uçan Patron Helikopteri.
  2. **Kasadan mı, Şahsi Cüzdandan mı? (`#payChoiceModal`):** Tüm iş büyütme ve rakip şirket satın alımlarında Şirket Kasası, Şahsi Cüzdan veya Kasa + Cüzdan Birlikte Öde seçeneği.
  3. **Otomasyon Düzeltmesi:** 4.–10. arazilerdeki araç donma hatası kesin çözüldü; tüm 10 arazi tam otopilotta sorunsuz çalışıyor.
  4. **Anlık +%1000 Borsa Rallisi:** Tek seferlik `surge1000Applied` bayrağıyla eklendi (kullanıcının mevcut kaydı `SAVE_KEY = "son_istasyon_v12_pro"` bozulmaz!).
  5. **Görsel & Arayüz Devrimi (v17.0):** 3 yeni 3D arazi zemini (`land2-ground.jpg`, `land3-ground.jpg`, `extra-ground.jpg`), yeni AAA sinematik açılış kapağı (`cover-v17.jpg`), tek satır sade yüzen üst çubuk, tek dokunuşlu kaydırmalı **10 arazi geçiş şeridi (`◀ 1..10 ▶ 🗺️`)** ve sağ kenar yüzen cam butonları (`🏆`, `📱`, `🏙️`, `📊`).
- **Yarın İçin Sıradaki Olası Adımlar:**
  1. Kullanıcının v17.0 yeni arayüz ve kapak ekranıyla ilgili geri bildirimlerine göre son görsel ince ayarlar (ör. harita içi bina çizimlerinin daha da 3D/modern hale getirilmesi, ses/müzik cilası),
  2. Yayın öncesi **Zorluk ve Ekonomi Dengelemesi** (erken aşama para kazanma hızına kullanıcı isteyene kadar dokunma; son aşamada dengelenecek),
  3. **ÖNEMLİ:** `SAVE_KEY = "son_istasyon_v12_pro"` anahtarını değiştirme ki kullanıcının canlı sitedeki kendi ilerlemesi asla sıfırlanmasın.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull origin main`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

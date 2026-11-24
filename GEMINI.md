# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al; kullanıcının istediği oyun güncellemelerini bu GitHub deposunda güncel tut.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v17.0 — Yeni Nesil Sinematik Kapak, Yüzen Cam Arayüz & Tek Dokunuşlu 10 Arazi)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **Son Test İlerlemesiyle Doğrudan Açılış Linki:** https://dijitesla.github.io/son-istasyon/?kayit=son-durum
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 10 Arazili gerçekçi 2.5D/3D kuşbakışı canlı işletme & holding simülasyonu + önce manuel yönetip büyüdükçe eleman/müdür alma döngüsü + çok kaynaklı şahsi maaş, borsa ve şehir yaşamı.

### Mevcut Özellikler ve Dosya Yapısı (v15.0)
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

## 📌 Diğer Bilgisayardaki Asistana Devir Notu (24 Kasım — Windows v16.0)
- Windows bilgisayarda **v16.0** (`holding_v16.js` + `index.html`, `style.css`, `empire.js`, `game.js` bağlantıları) tamamlandı ve canlı tarayıcıda 0 konsol hatasıyla doğrulandı.
- **Kullanıcının Önemli Yayın Öncesi Kararı:** Şu an yeni özellik ve arazi geliştirmelerine odaklanıyoruz; mevcut erken aşama para kazanma hızına şimdilik dokunma. Oyun geliştirmesi tamamen bittiğinde yayınlamadan hemen önce:
  1. **Zorluk ve Ekonomi Dengelemesi** (yeni arazi/tesis alımlarının başlangıçtaki tatlı zorluk hissini koruması),
  2. **Son Aşama Genel Grafik Cilası** yapılacak.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull origin main`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

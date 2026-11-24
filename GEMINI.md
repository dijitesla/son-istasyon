# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v14.0 — 3 Arazi, LPG, Oto Çekici, Otobüs Peronu, Go-Kart, Tır Filosu & Tatil Köyü)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 3 Arazili gerçekçi 2.5D/3D kuşbakışı canlı işletme & holding simülasyonu + çok modlu hikaye olayları + 4 kaynaklı şahsi maaş, şehir yaşamı ve akıllı telefon (Borsa/Sosyal Medya).

### Mevcut Özellikler (v14.0)
1. **1. Arazi — Dev İstasyon & Gerçekçi Yeni Tesisler (`game.js`, `map_renderer.js`):**
   - **9 Yakıt Pompası (2 VIP)**, **🔵 LPG / Otogaz Adası & Basınçlı Çelik Tank**, **🚜 7/24 Sarı Kayar Kasalı Oto Çekici** (otoyolda duman çıkaran arızalı araçları sırtına yükleyip Tamirhaneye getirir!), **🚌 Şehirlerarası Otobüs Peronu & 🥖 Sıcak Taş Fırın** (yolcu otobüsleri yanaşır), **⚡ EV Hızlı Şarj**, **🚿 Oto Yıkama**, **🔧 Tamirhane**, **🚛 Tır Kantarı**, **🏪 7/24 Market**, **🍽️ Yol Restoranı** ve **🏨 Mini Motel**.
   - **👔 Sakin İstasyon Müdürü Kemal Bey:** Rutin olayların %95'ini ve elektrik kesintilerini sessizce halleder; patronu yalnızca çok nadir büyük güvenlik krizlerinde arar.
2. **2. Arazi — Ücretli Otopark & Otoyol Grand AVM (`empire.js`):**
   - **🅿️ Ücretli Otopark:** Başlangıçta **20 araç kapasiteli** olup `35 -> 55 -> 80 -> 110 -> 150 araca` büyütülür; hareketli bariyerli gişe sistemi ve VIP Vale vardır.
   - **🏬 Otoyol AVM (8 Dükkan):** İçindeki 8 dükkan önce tek tek **satın alınır**, sonra **kiraya verilir**; yanında **📦 Lojistik** ve **🏢 Plaza Kulesi** bulunur.
3. **3. Arazi — Mega Holding Arsası (`land3.js`):**
   - **🏎️ Go-Kart Yarış Pisti & 🎡 Işıklı Dönme Dolap:** Canlı yarışan 4 Go-Kart aracı ve dönen kabinli dönme dolap.
   - **🏭 Akaryakıt Dolum Rafinerisi & 🚛 Kendi Tır Filomuz (1..10 Tır):** Rafineri kurulduğunda 1. İstasyonun tanker yakıt ikmalini **%100 BEDAVA (`0 ₺`)** yapar; kendi tır filomuz otoyoldan şehirlere sefere çıkıp büyük kazanç getirir.
   - **🏖️ Havuzlu Bungalov & Termal Tatil Köyü:** Turkuaz yüzme/termal havuzu, SPA merkezi ve tek tek satın alınıp gecelik kiraya verilen **6 ahşap A-Frame bungalov**.
4. **Ayrıntılı Gün Sonu Muhasebe Tablosu & 4 Kaynaklı Şahsi Maaş (`game.js`, `empire.js`):**
   - Gün sonunda **1. Arazi, 2. Arazi (AVM dükkanları tek tek dahil) ve 3. Arazi** kazançları müşteri/sefer sayılarıyla ayrı ayrı hesaplanır.
   - **4 Ayrı Şahsi Maaş:** `⛽ İstasyon` + `🅿️ Otopark` + `🏬 2. Arazi/AVM` + `🎡 3. Arazi` maaşları şahsi cüzdana yatar.
5. **Çok Modlu, Tekrarsız Özel Olay Motoru (`story_events.js`):**
   - 13 farklı olay ailesi (Emanet çanta, tur konvoyu pazarlığı, veresiye ikilemi, rota/fiş analizi, saha kavgası, lüks araç arızası, sığınma tuzağı, teknisyen/sabotajcı, ucuz yakıt, nakit kontrolü, gizli denetim, sponsorluk, filo sözleşmesi) + önceki kararlara bağlı devam olayları. Her olayın kendi özel inceleme butonları ve 4 özgün karar seçeneği vardır.
6. **Sakin Ses Motoru & Gün Sonu Kâr/Zarar Raporu (`audio.js`, `game.js`):**
   - Yağmur cızırtısı kaldırıldı; yumuşak ses efektleri ve opsiyonel sakin piyano ambiyansı (`🔕`/`🎵`).
   - Her gün sonunda ve üstteki `📊` butonundan tüm gelirler, yakıt/elektrik maliyetleri, çalışan maaşları, net kâr/zarar ve şahsi cüzdan özeti görünür.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

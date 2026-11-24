# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v13.0 — Ücretli Otopark, Otoyol AVM Dükkan Kira & Çoklu Şahsi Maaş)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 3D/2.5D stilize kuşbakışı canlı harita (İstasyon + Yan Arazi Ücretli Otopark & Otoyol AVM) + çok modlu sürprizli olaylar + çok kaynaklı şahsi maaş, şehir yaşamı ve akıllı telefon (Borsa/Sosyal Medya).

### Mevcut Özellikler (v13.0)
1. **Gelişmiş 3D/2.5D Haritalar & Grafikler (`map_renderer.js`, `empire.js`, `assets/station-ground.jpg`):**
   - Çam ağaçlı, bordürlü, çakışmasız temiz asfalt zeminler; hareketli bariyerli otopark gişeleri, fıskiyeli yaya bulvarı, cam kubbeli AVM ve helikopter pistli Plaza kulesi.
2. **Dev İstasyon Tesisleri & Sakin Müdür Kemal (`game.js`):**
   - **9 Yakıt Pompası (2 VIP)**, Ana Yakıt Deposu, **⚡ EV Hızlı Şarj**, **🚿 Oto Yıkama**, **🔧 Tamirhane**, **🚛 Tır Kantarı**, **🏪 7/24 Market**, **🍽️ Yol Restoranı** ve **🏨 Mini Motel**.
   - **👔 Sakin İstasyon Müdürü Kemal Bey:** Rutin olayların %95'ini ve elektrik sigorta atmalarını sessizce kendi çözer; patronu yalnızca çok nadir büyük güvenlik krizlerinde (en erken 4-5 dakikada bir) arar.
3. **2. Arazi — Ücretli Otopark & Otoyol Grand AVM (`empire.js`):**
   - **🅿️ Ücretli Otopark:** `2.200 ₺` ile açılır; başlangıçta **20 araç kapasiteli** olup büyütmeyle `35 -> 55 -> 80 -> 110 -> 150 araca` çıkar, saatlik gişe ücreti ve VIP Vale yükseltilebilir.
   - **🏬 Otoyol AVM (8 Dükkan):** `4.800 ₺` ile AVM binası kurulur; içindeki 8 dükkan (Kahve, Burger, Hipermarket, Moda, Teknoloji, Bowling, Kuyumcu, VIP Sinema) başlangıçta bizim değildir — önce **tapusu satın alınır**, sonra **sabit veya ciro paylı kiracıya kiraya verilir**.
   - **📦 Lojistik Deposu & 🏢 Plaza Kulesi:** Sağ kanatta yükseltilebilir 2 ticari kule.
4. **Çok Kaynaklı Şahsi Maaş, Şehir Yaşamı & 📱 Akıllı Telefon OS (`empire.js`, `index.html`, `style.css`):**
   - **3 Ayrı Şahsi Maaş Kaynağı:** `⛽ İstasyon Maaşım` + `🅿️ Ücretli Otopark Maaşım` + `🏬 Yan Arazi & AVM Maaşım` (hem canlı avans hem gün sonu ödemeli).
   - **🏙️ Şehir & 📱 Telefon:** Elektronik, Emlakçı, Oto Galeri, Canlı Borsa (6 hisse), YolGram, Müdür Mesajları ve Servet Özeti.
5. **Çok Modlu, Tekrarsız Özel Olay Motoru (`story_events.js`):**
   - 13 farklı olay ailesi (Emanet çanta, tur konvoyu pazarlığı, veresiye ikilemi, rota/fiş analizi, saha kavgası, lüks araç arızası, sığınma tuzağı, teknisyen/sabotajcı, ucuz yakıt, nakit kontrolü, gizli denetim, sponsorluk, filo sözleşmesi) + önceki kararlara bağlı devam olayları. Her olayın kendi özel inceleme butonları ve 4 özgün karar seçeneği vardır.
6. **Sakin Ses Motoru & Gün Sonu Kâr/Zarar Raporu (`audio.js`, `game.js`):**
   - Yağmur cızırtısı kaldırıldı; yumuşak ses efektleri ve opsiyonel sakin piyano ambiyansı (`🔕`/`🎵`).
   - Her gün sonunda ve üstteki `📊` butonundan tüm gelirler, yakıt/elektrik maliyetleri, çalışan maaşları, net kâr/zarar ve şahsi cüzdan özeti görünür.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

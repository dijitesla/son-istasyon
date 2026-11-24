# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v12.0 — İkinci Arazi, İstasyon Müdürü & Patron Yaşamı)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** Yeni nesil 3D stilize kuşbakışı canlı harita (İstasyon + 2. Arazi Outlet & Plaza) + çok modlu sürprizli olaylar + şahsi maaş, şehir yaşamı ve akıllı telefon (Borsa/Sosyal Medya).

### Mevcut Özellikler (v12.0)
1. **Yeni Nesil 3D Stilize Haritalar & Grafikler (`map_renderer.js`, `assets/station-ground.jpg`, `assets/land2-ground.jpg`):**
   - 3D çam ağaçlı, beton bordürlü, metalik bariyerli istasyon zemini ve otoyol; parlak metalik araçlar, doğru yönle giriş/çıkış dönüş açıları, yürüyen müşteri karakterleri (nokta yerine tam karakter).
2. **Dev İstasyon Tesisleri (`game.js`):**
   - **9 Yakıt Pompası (2 VIP: P-5 VIP & P-9 VIP)**, Ana Yakıt Deposu (`1.200L` -> geliştirilebilir), **⚡ EV Hızlı Şarj (yakıt harcamaz)**, **🚿 Oto Yıkama**, **🔧 Tamirhane**, **🚛 Tır Kantar & Parkı**, **🏪 7/24 Market**, **🍽️ 10 Çeşit Yemekli Yol Restoranı** ve **🏨 Mini Motel**.
   - **Ek Geliştirmeler:** Güneş Paneli & Jeneratör (elektrik gideri -%45, kesinti önleme, EV +%25 kâr), HD Güvenlik Kamerası, Otoyol Dev LED Tabelası, Otomatik Tanker.
   - **12 Kişilik Ekip:** 3 Pompacı (Ali, Murat, Hasan), Kasiyer Zeynep, Aşçı Mehmet, EV Teknisyeni Kerem, Resepsiyonist Selin, Kantar Görevlisi Osman, Yıkamacı Kadir, Tamir Ustası Cemil, Bekçi Duman ve **👔 Temkinli İstasyon Müdürü Kemal Bey** (rutin olayları hata yapmadan çözer, kritik krizlerde patronu arar).
3. **2. Arazi — Yan Arsa (Otoyol Outlet & Lojistik Plaza) (`empire.js`):**
   - `6.500 ₺` ile tapusu alınır; içinde 6 ayrı ticari işletme (Kahve Zinciri, Dev Hipermarket, Oyun & Eğlence, E-Ticaret Deposu, Açık Hava Sinema, İş Merkezi Kulesi) bulunur.
4. **Şahsi Maaş, Şehir Yaşamı & 📱 Akıllı Telefon OS (`empire.js`, `index.html`, `style.css`):**
   - **Kendi Günlük Maaşını Belirleme** (`0 ₺`–`2.000 ₺`) + Şahsi Cüzdan.
   - **🏙️ Şehir:** Elektronik Mağazası (Akıllı Telefon `650 ₺`, Kulaklık, Saat, Patron PC, 4K TV), Emlakçı (günlük pasif kira getiren 4 daire/villa), Oto Galerici (4 kişisel araç).
   - **📱 Akıllı Telefon (Telefon alınınca açılır):** Canlı **📈 Borsa / Hisse Senedi (6 hisse + haber akışı)**, **📸 YolGram Sosyal Medya**, **💬 Müdür Kemal Mesajları** ve **💎 Servet Özeti**.
5. **Çok Modlu, Tekrarsız Özel Olay Motoru (`story_events.js`):**
   - 13 farklı olay ailesi (Emanet çanta, tur konvoyu pazarlığı, veresiye ikilemi, rota/fiş analizi, saha kavgası, lüks araç arızası, sığınma tuzağı, teknisyen/sabotajcı, ucuz yakıt, nakit kontrolü, gizli denetim, sponsorluk, filo sözleşmesi) + önceki kararlara bağlı devam olayları. Her olayın kendi özel inceleme butonları ve 4 özgün karar seçeneği vardır.
6. **Sakin Ses Motoru & Gün Sonu Kâr/Zarar Raporu (`audio.js`, `game.js`):**
   - Yağmur cızırtısı kaldırıldı; yumuşak ses efektleri ve opsiyonel sakin piyano ambiyansı (`🔕`/`🎵`).
   - Her gün sonunda ve üstteki `📊` butonundan tüm gelirler, yakıt/elektrik maliyetleri, çalışan maaşları, net kâr/zarar ve şahsi cüzdan özeti görünür.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

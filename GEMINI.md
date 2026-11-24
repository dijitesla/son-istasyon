# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v15.0 — 10 Arazi Sistemi, Grand Otel & 6 Mega Proje, Canlı 2. Arazi İşlemleri)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 10 Arazili gerçekçi 2.5D/3D kuşbakışı canlı işletme & holding simülasyonu + önce manuel yönetip büyüdükçe eleman/müdür alma döngüsü + çok kaynaklı şahsi maaş, borsa ve şehir yaşamı.

### Mevcut Özellikler (v15.0)
1. **1. Arazi — Ana İstasyon (`game.js`, `map_renderer.js`):** 9 Pompa (2 VIP), LPG Adası, 7/24 Sarı Oto Çekici, Otobüs Peronu & Taş Fırın, EV Şarj, Oto Yıkama, Tamirhane, Tır Kantarı, Market, Restoran, Motel ve Sakin Müdür Kemal.
2. **2. Arazi — Canlı İşlemli Otopark & Otoyol Grand AVM (`empire.js`):**
   - **Canlı İşlemler & Ekip:** Otopark çıkış gişesinde `🎫 Ücret Al`, AVM'de `📦 Mal Kabul Kamyonu` ve `🧹 AVM Bakım/Temizlik` işlemleri başta patron tarafından yapılır; geliştirildikçe **Gişe Görevlisi, Mal Kabul Sorumlusu, Teknik Ekip ve 2. Arazi Müdürü** işe alınır.
3. **3. Arazi — Park, Rafineri, 10 Tır Filosu & Tatil Köyü (`land3.js`):** Go-Kart & Dönme Dolap, Bedava Tanker sağlayan Rafineri, 10 Tırlık Filo ve 6 Bungalovlu Termal Köy.
4. **4.–10. Araziler — 10 Arazili Harita & 6 Seçenekli Mega Projeler (`lands_4_10.js`):**
   - `45.000 ₺`'den `1.100.000 ₺`'ye uzanan 7 yeni arsa (`4. Arazi` .. `10. Arazi`).
   - Her arsa alındığında **6 dev seçenek** sunulur: **🏨 5 Yıldızlı Grand Otel**, **🏥 Özel Hastane**, **🚗 Otomobil Fabrikası**, **🏟️ Stadyum**, **💻 Teknokent Veri Merkezi**, **👑 Kongre & Düğün Sarayı**.
   - Her projede başta müşteri kaydı ve oda/birim temizliğiyle oyuncu ilgilenir; büyüdükçe 4 kademe personel/müdür alınır ve 5 kata kadar büyütülür.

### Yayın Öncesi Notlar (Son Aşamada Yapılacaklar)
- Tüm özellikler tamamlandıktan sonra yayın öncesi **ekonomi/zorluk dengesi** (2. ve yeni arazilere geçiş hızının başlangıç zorluğunda dengelenmesi) ve **son aşama grafik cilası** yapılacak.
5. **Çok Modlu, Tekrarsız Özel Olay Motoru (`story_events.js`):**
   - 13 farklı olay ailesi (Emanet çanta, tur konvoyu pazarlığı, veresiye ikilemi, rota/fiş analizi, saha kavgası, lüks araç arızası, sığınma tuzağı, teknisyen/sabotajcı, ucuz yakıt, nakit kontrolü, gizli denetim, sponsorluk, filo sözleşmesi) + önceki kararlara bağlı devam olayları. Her olayın kendi özel inceleme butonları ve 4 özgün karar seçeneği vardır.
6. **Sakin Ses Motoru & Gün Sonu Kâr/Zarar Raporu (`audio.js`, `game.js`):**
   - Yağmur cızırtısı kaldırıldı; yumuşak ses efektleri ve opsiyonel sakin piyano ambiyansı (`🔕`/`🎵`).
   - Her gün sonunda ve üstteki `📊` butonundan tüm gelirler, yakıt/elektrik maliyetleri, çalışan maaşları, net kâr/zarar ve şahsi cüzdan özeti görünür.

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

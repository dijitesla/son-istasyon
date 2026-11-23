# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v7.0 — Gelişmiş 2.5D İstasyon Yönetimi)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** 2.5D kuşbakışı canlı istasyon haritası (işletme / yönetim) + büyük yazılı gizemli hikaye olayları (9:16 dikey mobil uyumlu).

### Mevcut Özellikler (v7.0)
1. **Gelişmiş 2.5D Harita Çizim Motoru (`map_renderer.js` & `game.js`):** Gölgeli binalar, çam ağaçları, sokak lambası ışık konileri, yağmur halkaları, tekerlekli/aynalı/farlı araçlar, 4 pompa adası (`Pompa 1`..`Pompa 4 VIP`), sol tarafta 3D Ana Yakıt Silosu, altta `7/24 Market`, `Oto Yıkama` ve sarı liftli `Tamirhane`.
2. **Dengeli ve Uzun Ömürlü Ekonomi:** Başlangıç kasası `120 ₺`, kademeli zorlaşan tesis ve personel eğitim maliyetleri (Sv.6–8'e kadar).
3. **Büyük Ana Yakıt Deposu & Otomatik Tanker:** Başlangıç deposu `1.200L` (geliştirmeyle `5.700L`'ye çıkar), düşük araç tüketimi ve opsiyonel `Otomatik Tanker İkmal Anlaşması`.
4. **Haritada Yürüyen 6 Çalışan:** Pompacı Ali, 2. Pompacı Murat, Kasiyer Zeynep, Yıkamacı Kadir, Tamir Ustası Cemil ve Bekçi Köpek Duman.
5. **Kesintisiz Özel Müşteri Sistemi (`story_events.js`):** İşçiler çalışırken de sayaç ilerler; her 5 araçta bir kesin `❗ İNCELE!` özel müşterisi gelir ve 10 ana hikaye karakteri bittikten sonra da sınırsız yeni özel olaylar üretilmeye devam eder.
6. **Görseller ve Ek Dosyalar:** `assets/` altında çizgi roman kapak/pencere/ikon görselleri, `privacy.html` (mağaza gizlilik politikası), `capacitor.config.json` (Android/iOS mağaza paketleme ayarı) ve `REELS_TANITIM_PLANI.md` (3 tanıtım Reels senaryosu).

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

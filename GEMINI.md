# Son İstasyon — Proje Hafızası ve Çalışma Kuralları

## İletişim ve Kullanıcı Kuralları (Her Zaman Uygula)
- Kullanıcı Dijitesla ajansının sahibidir; yazılımcı değildir ve İngilizce bilmez.
- **Her mesaj Türkçe, kısa, açık ve sade olmalı:** Önce net sonuç, ardından en fazla birkaç kısa madde. Uzatma.
- Teknik terim kullanmak gerekirse yanına parantez içinde kısa Türkçe açıklama ekle.
- Eğitim ve yönlendirmelerde **Mac ve Windows** karşılıklarını birlikte yaz.
- Silme, üzerine yazma, kurulum ve dışarıya gönderim (`git push` dahil büyük değişiklikler) öncesi onay al.
- Yerel görsel/video yapay zekâ modeli önerme veya kurma.
- Uydurma veri, fiyat veya sonuç yazma.

## Proje Özeti: Son İstasyon (v6.0 — İstasyon Sahibi Sürümü)
- **Canlı Oyun Linki (GitHub Pages):** https://dijitesla.github.io/son-istasyon/
- **GitHub Deposu:** https://github.com/dijitesla/son-istasyon
- **Oyun Türü:** Kuşbakışı canlı istasyon haritası (işletme / yönetim) + büyük yazılı gizemli hikaye olayları (9:16 dikey mobil uyumlu).

### Mevcut Özellikler (v6.0)
1. **Canlı İstasyon Haritası (`game.js`):** Otoyoldan sapan araçlar, 3 pompa adası (Pompa 1 açık, Pompa 2 ve 3 kazançla açılır), sol tarafta Ana Yakıt Deposu ve `Tanker Çağır` ikmal sistemi, sol altta `7/24 Büfe & Market`, sağ altta `Oto Yıkama & Bakım` tesisi.
2. **Haritada Yürüyen Çalışanlar:** Pompacı Ali, 2. Pompacı Murat, Kasiyer Zeynep, Yıkama Ustası Kadir ve Bekçi Köpek Duman.
3. **Büyük Yazılı Hikaye Olayları (`story_events.js`):** Haritaya gelen `❗ ÖZEL MÜŞTERİ` araçlarına dokununca 18px büyük okunaklı konuşma balonu, kimlik/bagaj/mor ışık/telefon incelemesi ve 4 karar (`Yakıt Ver`, `İstasyonda Sakla`, `Pompayı Kapat`, `112 Polis Çağır` — haritaya çakarlı polis otosu girer) açılır.
4. **Görseller ve Ek Dosyalar:** `assets/` altında çizgi roman kapak/pencere/ikon görselleri, `privacy.html` (mağaza gizlilik politikası), `capacitor.config.json` (Android/iOS mağaza paketleme ayarı) ve `REELS_TANITIM_PLANI.md` (3 tanıtım Reels senaryosu).

## İki Bilgisayar Arasında Çalışma Akışı (Mac & Windows)
- Çalışmaya başlarken son değişiklikleri çek: `git pull`
- Çalışma bitince GitHub'a gönder: `git add .`, `git commit -m "..."`, `git push origin main`

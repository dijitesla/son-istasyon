// Son İstasyon v5.0 — Türkçe / İngilizce (Last Station) Dil Desteği, Dekorasyon Temaları ve 9:16 Vardiya Karnesi Üreticisi

window.DECOR_ITEMS = [
  {
    id: "neon_cyber",
    type: "sign",
    name: "🔮 Siber Mor Neon Tabela",
    nameEn: "🔮 Cyber Purple Neon Sign",
    cost: 180,
    desc: "Dış pompa tabelasını ve üst ışıkları siber mor/mavi renge çevirir."
  },
  {
    id: "neon_gold",
    type: "sign",
    name: "✨ Altın Retro Tabela",
    nameEn: "✨ Golden Retro Sign",
    cost: 210,
    desc: "Pompa 04 tabelasını klasik sıcak altın sarısı neon yapar."
  },
  {
    id: "counter_marble",
    type: "counter",
    name: "🪨 Gece Mermeri Tezgâh",
    nameEn: "🪨 Midnight Marble Counter",
    cost: 190,
    desc: "Ahşap büfe tezgâhını şık koyu granit mermer görünüme yükseltir."
  },
  {
    id: "duman_house",
    type: "dog",
    name: "🏠 Duman'a Kırmızı Kulübe",
    nameEn: "🏠 Red Doghouse for Duman",
    cost: 160,
    desc: "Duman her geceye otomatik TOK ve mutlu başlar (her gece 20 ₺ mama parası ödemezsin!)."
  }
];

window.I18N = {
  tr: {
    gameTitle: "SON İSTASYON",
    subtitle: "v5.0 Master Sürüm — Çizgi Roman Atmosfer + TR/EN",
    startBtn: "🌙 VARDİYAYI BAŞLAT",
    endlessBtn: "♾️ SONSUZ RASTGELE VARDİYA (Her Seferinde Yeni Müşteriler!)",
    camera: "KAMERA (2)",
    wanted: "🎯 Bülten",
    badges: "🏅 Rozet",
    decor: "🎨 Dekor",
    askId: "🪪 Kimlik",
    trunk: "🔦 Bagaj Ara",
    ledger: "📓 Defter",
    ticket: "🧾 İSTEK FİŞİ:",
    pump: "Pompa 4",
    drinks: "Çay & Kahve",
    grill: "Tost Izgara",
    market: "Market Rafı",
    uv: "Mor Işık",
    charger: "Şarj Prizi",
    serve: "✅ KASA & SATIŞ",
    hide: "🤫 SAKLA",
    hideSub: "Arka Odaya Al",
    lock: "🔒 KİLİTLE",
    lockSub: "Reddet & Kov",
    police: "🚨 112 POLİS",
    policeSub: "Sessiz İhbar",
    wipeHint: "❄️ Cam buğulandı! Görmek için parmağınla camı sil!",
    shareBtn: "📸 VARDİYA KARNESİNİ İNDİR / PAYLAŞ (9:16 REELS)"
  },
  en: {
    gameTitle: "LAST STATION",
    subtitle: "v5.0 Master Edition — Graphic Novel Night Shift",
    startBtn: "🌙 START NIGHT SHIFT",
    endlessBtn: "♾️ ENDLESS RANDOM SHIFT (5 New Customers Every Night!)",
    camera: "CCTV (2)",
    wanted: "🎯 Wanted",
    badges: "🏅 Badges",
    decor: "🎨 Decor",
    askId: "🪪 Check ID",
    trunk: "🔦 Trunk",
    ledger: "📓 Tab Book",
    ticket: "🧾 ORDER:",
    pump: "Pump 04",
    drinks: "Hot Drinks",
    grill: "Panini Grill",
    market: "Night Mart",
    uv: "UV Light",
    charger: "Phone Dock",
    serve: "✅ REGISTER",
    hide: "🤫 HIDE",
    hideSub: "Safe Room",
    lock: "🔒 LOCK DOOR",
    lockSub: "Reject",
    police: "🚨 CALL 911",
    policeSub: "Silent Alert",
    wipeHint: "❄️ Window frosted! Wipe the glass with your finger!",
    shareBtn: "📸 SHARE / SAVE SHIFT REPORT CARD (9:16 STORY)"
  }
};

// 9:16 Instagram Story / Reels Vardiya Karnesi Görsel Üreticisi
window.shareOrDownloadShiftCard = async function (opts) {
  const cnv = document.createElement("canvas");
  cnv.width = 1080;
  cnv.height = 1920;
  const g = cnv.getContext("2d");

  // Arka plan koyu gece + neon geçiş
  const grad = g.createLinearGradient(0, 0, 0, 1920);
  grad.addColorStop(0, "#090d1a");
  grad.addColorStop(0.5, "#1e1b4b");
  grad.addColorStop(1, "#070911");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1080, 1920);

  // Dış neon çerçeve
  g.strokeStyle = "#ff3358";
  g.lineWidth = 10;
  g.strokeRect(48, 48, 984, 1824);

  // Üst Başlık
  g.fillStyle = "#fde68a";
  g.font = "900 36px Arial, sans-serif";
  g.textAlign = "center";
  g.fillText("7/24 GECE VARDİYASI RAPORU", 540, 175);

  g.fillStyle = "#ffffff";
  g.shadowColor = "#ff3358";
  g.shadowBlur = 32;
  g.font = "900 96px Arial, sans-serif";
  g.fillText(opts.lang === "en" ? "LAST STATION" : "SON İSTASYON", 540, 295);
  g.shadowBlur = 0;

  // Orta Rapor Kutusu
  g.fillStyle = "rgba(15, 23, 42, 0.92)";
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 6;
  g.fillRect(100, 390, 880, 960);
  g.strokeRect(100, 390, 880, 960);

  g.fillStyle = "#38bdf8";
  g.font = "900 48px Arial, sans-serif";
  g.fillText(opts.nightTitle, 540, 495);

  g.fillStyle = "#4ade80";
  g.font = "900 120px Arial, sans-serif";
  g.fillText(`${opts.correct}/5`, 540, 670);

  g.fillStyle = "#cbd5e1";
  g.font = "700 38px Arial, sans-serif";
  g.fillText(opts.lang === "en" ? "CORRECT DECISIONS" : "DOĞRU KARAR", 540, 735);

  // İstatistikler
  g.fillStyle = "#fde68a";
  g.font = "900 54px Arial, sans-serif";
  g.fillText(`💵 Kasa: ${opts.cash} ₺`, 540, 880);
  g.fillText(`🏅 Kazanılan Rozet: ${opts.badgeCount}/8`, 540, 980);
  g.fillText(`🐕 Bekçi Duman: ${opts.dumanFed ? "Sadık Dost ❤️" : "Uyukladı 💤"}`, 540, 1080);

  g.fillStyle = "#f87171";
  g.font = "800 36px Arial, sans-serif";
  g.fillText(opts.rankText, 540, 1230);

  // Alt Meydan Okuma
  g.fillStyle = "#ffffff";
  g.font = "900 46px Arial, sans-serif";
  g.fillText(
    opts.lang === "en" ? "CAN YOU SURVIVE UNTIL 06:00 AM?" : "SEN SABAHA SAĞ ÇIKABİLİR MİSİN?",
    540,
    1520
  );

  g.fillStyle = "#94a3b8";
  g.font = "700 32px monospace";
  g.fillText("dijitesla.github.io/son-istasyon", 540, 1610);

  return new Promise((resolve) => {
    cnv.toBlob(async (blob) => {
      if (!blob) return resolve(false);
      const file = new File([blob], "son-istasyon-karne.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Son İstasyon — Vardiya Karnem",
            text: "Gece vardiyasından sağ çıktım! Sen başarabilir misin?",
            files: [file]
          });
          return resolve(true);
        } catch (_) {}
      }
      // Paylaşım desteklenmiyorsa doğrudan indir
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "son-istasyon-karne.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      resolve(true);
    }, "image/png");
  });
};

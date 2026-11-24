// Son İstasyon v12.0 — 2. Arazi (Otoyol AVM & Lojistik Parkı), Şahsi Maaş, Şehir Yaşamı & Akıllı Telefon OS
// Elektronik Mağazası, Emlakçı, Oto Galerici, Canlı Borsa/Hisse Senedi, YolGram Sosyal Medya ve Müdür Kemal Mesajları!

window.EmpireSystem = (function () {
  const land2Img = new Image();
  let land2Ready = false;
  land2Img.onload = () => (land2Ready = true);
  land2Img.src = "./assets/land2-ground.jpg";

  const LAND2_COST = 6500;

  // 2. ARAZİ — 6 FARKLI İŞLETME / TİCARİ YAPI (2x3 Düzenli Yerleşim, 480x620)
  const LAND2_SLOTS = [
    {
      key: "coffee",
      name: "Kahve Zinciri",
      short: "☕ KAHVE",
      emoji: "☕",
      x: 54, y: 142, w: 180, h: 122,
      cost: 1800,
      baseIncome: 62,
      cycleSec: 6.0,
      color: "#78350f",
      border: "#fbbf24",
      desc: "Ünlü kahve şubesi: hızlı ve sürekli nakit akışı!"
    },
    {
      key: "hypermarket",
      name: "Dev Hipermarket",
      short: "🛒 HİPERMARKET",
      emoji: "🛒",
      x: 246, y: 142, w: 180, h: 122,
      cost: 2600,
      baseIncome: 95,
      cycleSec: 7.0,
      color: "#1e3a8a",
      border: "#38bdf8",
      desc: "Geniş otoyol süpermarketi: yüksek hacimli satış."
    },
    {
      key: "arcade",
      name: "Oyun & Eğlence",
      short: "🎮 EĞLENCE",
      emoji: "🎮",
      x: 54, y: 280, w: 180, h: 122,
      cost: 3400,
      baseIncome: 135,
      cycleSec: 7.5,
      color: "#581c87",
      border: "#e879f9",
      desc: "Aileler ve gençler için yüksek kârlı eğlence merkezi."
    },
    {
      key: "logistics",
      name: "E-Ticaret Deposu",
      short: "📦 LOJİSTİK",
      emoji: "📦",
      x: 246, y: 280, w: 180, h: 122,
      cost: 4800,
      baseIncome: 195,
      cycleSec: 8.5,
      color: "#064e3b",
      border: "#34d399",
      desc: "Kargo aktarma merkezi: düzenli dev ticari gelir!"
    },
    {
      key: "cinema",
      name: "Açık Hava Sinema",
      short: "🎬 SİNEMA",
      emoji: "🎬",
      x: 54, y: 418, w: 180, h: 126,
      cost: 6200,
      baseIncome: 260,
      cycleSec: 9.0,
      color: "#7f1d1d",
      border: "#fb7185",
      desc: "Arabalı gece sineması: otoyolun en popüler durağı!"
    },
    {
      key: "office",
      name: "İş Merkezi Kulesi",
      short: "🏢 PLAZA",
      emoji: "🏢",
      x: 246, y: 418, w: 180, h: 126,
      cost: 9500,
      baseIncome: 420,
      cycleSec: 10.0,
      color: "#1e293b",
      border: "#facc15",
      desc: "Kurumsal ofis kulesi: en yüksek pasif kira & şirket geliri!"
    }
  ];

  // ŞEHİR KATALOGLARI (ŞAHSİ MAAŞINLA SATIN ALINIR!)
  const ELECTRONICS = [
    { key: "phone", name: "📱 Akıllı Telefon Pro", price: 650, prestige: 10, desc: "📱 Telefonum uygulamasını açar! (Borsa, Sosyal Medya, Müdür Mesajları)" },
    { key: "headphones", name: "🎧 Stüdyo Kulaklık", price: 450, prestige: 8, desc: "Keyifli vardiya ve şahsi prestij (+8 Prestij)." },
    { key: "watch", name: "⌚ Akıllı Saat Ultra", price: 950, prestige: 15, desc: "İstasyondaki acil durumları anında bileğine bildirir (+15 Prestij)." },
    { key: "laptop", name: "💻 Patron Dizüstü PC", price: 1400, prestige: 22, desc: "Borsa işlemlerinde sıfır komisyon ve VIP analiz avantajı (+22 Prestij)." },
    { key: "tv", name: "📺 85 İnç 4K OLED TV", price: 2200, prestige: 30, desc: "Ev keyfi ve yüksek yaşam standardı (+30 Prestij)." }
  ];

  const PROPERTIES = [
    { key: "studio", name: "🏢 1+1 Stüdyo Daire", price: 3500, dailyRent: 120, prestige: 20, desc: "Her gün şahsi hesabına +120 ₺ kira geliri yatar." },
    { key: "city2p1", name: "🏠 2+1 Şehir Dairesi", price: 7500, dailyRent: 280, prestige: 40, desc: "Merkezi konumda daire: günde +280 ₺ pasif kira!" },
    { key: "residence", name: "🏙️ 3+1 Deniz Rezidans", price: 15000, dailyRent: 600, prestige: 75, desc: "Lüks rezidans: günde +600 ₺ kira ve büyük prestij!" },
    { key: "villa", name: "🏡 Havuzlu Boğaz Villası", price: 32000, dailyRent: 1400, prestige: 150, desc: "Hayallerin zirvesi: günde +1.400 ₺ pasif gelir!" }
  ];

  const GALLERY_CARS = [
    { key: "hatchback", name: "🚗 Şehir Hatchback", price: 2800, prestige: 18, repBonus: 2, desc: "İlk kişisel aracın (+18 Prestij)." },
    { key: "sedan_lux", name: "🚘 Lüks Alman Sedan", price: 8500, prestige: 45, repBonus: 5, desc: "Patron karizması (+45 Prestij, İtibar +5)." },
    { key: "ev_suv", name: "🚙 Elektrikli Süper SUV", price: 14000, prestige: 75, repBonus: 8, desc: "Yeni nesil lüks SUV (+75 Prestij, İtibar +8)." },
    { key: "supercar", name: "🏎️ İtalyan Süper Spor", price: 28000, prestige: 140, repBonus: 15, desc: "Otoyolun efsanesi (+140 Prestij, İtibar +15)!" }
  ];

  const INITIAL_STOCKS = [
    { sym: "ENRJ", name: "Anadolu Enerji", price: 100, prev: 100, vol: 0.09 },
    { sym: "TEKN", name: "Dijital Teknoloji", price: 180, prev: 180, vol: 0.14 },
    { sym: "OTOM", name: "Yerli Otomotiv", price: 140, prev: 140, vol: 0.11 },
    { sym: "GIDA", name: "Lezzet Gıda", price: 75, prev: 75, vol: 0.06 },
    { sym: "ALTN", name: "Altın Fonu", price: 240, prev: 240, vol: 0.05 },
    { sym: "KRPT", name: "Kripto Sepeti", price: 320, prev: 320, vol: 0.22 }
  ];

  const MARKET_NEWS = [
    "📰 Enerji sektöründe yeni teşvik açıklandı — ENRJ hareketli!",
    "📰 Yerli elektrikli araç satışları rekor kırdı — OTOM yükselişte!",
    "📰 Yapay zeka şirketlerine dev yatırım — TEKN canlı!",
    "📰 Küresel piyasalarda dalgalanma — Altın Fonu (ALTN) güvenli liman.",
    "📰 Kripto piyasasında sert iniş çıkışlar bekleniyor!",
    "📰 Gıda zincirlerinde bayram öncesi talep artışı — GIDA pozitif."
  ];

  const SOCIAL_COMMENTS = [
    "🔥 @geceyolcusu: 'Bu istasyonun restoranındaki Adana Kebap efsane!'",
    "⚡ @elektrikli_surucu: 'EV hızlı şarj tertemiz çalışıyor, 10 numara!'",
    "🏨 @uzunyol_tircisi: 'Motel odaları mis gibi, kantar da çok hızlı.'",
    "🌟 @vlog_gezgin: 'Otoyoldaki yeni plaza ile burası tam yaşam merkezi olmuş!'",
    "☕ @kahvesever: 'Yan arazideki kahve şubesi gecenin kurtarıcısı!'"
  ];

  function createDefaultEmpire() {
    const stocks = {};
    INITIAL_STOCKS.forEach((s) => {
      stocks[s.sym] = { price: s.price, prev: s.prev, shares: 0, avgCost: 0 };
    });
    return {
      managerHired: false,
      land2Owned: false,
      land2Levels: { coffee: 0, hypermarket: 0, arcade: 0, logistics: 0, cinema: 0, office: 0 },
      personalCash: 0,
      dailySalary: 200,
      electronics: {},
      properties: {},
      cars: {},
      stocks,
      stockNews: MARKET_NEWS[0],
      socialFollowers: 120,
      socialPosts: [
        "⛽ Son İstasyon 7/24 açık! Yeni nesil hizmetimizle yoldayız."
      ],
      managerLogs: [
        "👔 Kemal Bey işe alındığında istasyonu temkinle yönetir ve sadece kritik krizlerde seni arar."
      ]
    };
  }

  function mergeEmpire(saved) {
    const def = createDefaultEmpire();
    if (!saved) return def;
    const out = Object.assign(def, saved);
    out.land2Levels = Object.assign(def.land2Levels, saved.land2Levels || {});
    out.electronics = Object.assign({}, saved.electronics || {});
    out.properties = Object.assign({}, saved.properties || {});
    out.cars = Object.assign({}, saved.cars || {});
    out.stocks = Object.assign({}, def.stocks);
    if (saved.stocks) {
      INITIAL_STOCKS.forEach((s) => {
        if (saved.stocks[s.sym]) {
          out.stocks[s.sym] = Object.assign({ price: s.price, prev: s.prev, shares: 0, avgCost: 0 }, saved.stocks[s.sym]);
        }
      });
    }
    if (!Array.isArray(out.socialPosts)) out.socialPosts = def.socialPosts;
    if (!Array.isArray(out.managerLogs)) out.managerLogs = def.managerLogs;
    return out;
  }

  // Canlı 2. Arazi Animasyon ve Sayaç Değişkenleri
  const land2Progress = { coffee: 0, hypermarket: 0, arcade: 0, logistics: 0, cinema: 0, office: 0 };
  const land2Visitors = [];
  const land2Floats = [];
  let stockTickTimer = 9;
  let socialCooldown = 0;

  function calcUpgradeCost(slot, lvl) {
    if (lvl === 0) return slot.cost;
    return Math.round(slot.cost * 0.72 * Math.pow(1.52, lvl));
  }

  function calcSlotIncome(slot, lvl) {
    if (lvl <= 0) return 0;
    return Math.round(slot.baseIncome * (1 + (lvl - 1) * 0.45));
  }

  function calcDailyRent(emp) {
    return PROPERTIES.reduce((sum, p) => sum + (emp.properties[p.key] ? p.dailyRent : 0), 0);
  }

  function calcPrestige(emp) {
    let p = 0;
    ELECTRONICS.forEach((e) => { if (emp.electronics[e.key]) p += e.prestige; });
    PROPERTIES.forEach((pr) => { if (emp.properties[pr.key]) p += pr.prestige; });
    GALLERY_CARS.forEach((c) => { if (emp.cars[c.key]) p += c.prestige; });
    return p;
  }

  function calcPortfolioValue(emp) {
    let v = 0;
    INITIAL_STOCKS.forEach((s) => {
      const st = emp.stocks[s.sym];
      if (st && st.shares > 0) v += st.shares * st.price;
    });
    return Math.round(v);
  }

  function calcTotalPersonalWealth(emp) {
    let assets = emp.personalCash + calcPortfolioValue(emp);
    ELECTRONICS.forEach((e) => { if (emp.electronics[e.key]) assets += e.price; });
    PROPERTIES.forEach((pr) => { if (emp.properties[pr.key]) assets += pr.price; });
    GALLERY_CARS.forEach((c) => { if (emp.cars[c.key]) assets += c.price; });
    return Math.round(assets);
  }

  function addManagerLog(emp, text) {
    emp.managerLogs.unshift(text);
    if (emp.managerLogs.length > 14) emp.managerLogs.pop();
  }

  // Canlı Güncelleme (2. Arazi gelirleri + Borsa tikleri + Ziyaretçi animasyonu)
  function updateEmpire(dt, data, callbacks) {
    const emp = data.empire;
    if (socialCooldown > 0) socialCooldown = Math.max(0, socialCooldown - dt);

    // 1. Borsa Canlı Fiyat Hareketi (Her ~9 saniyede bir!)
    stockTickTimer -= dt;
    if (stockTickTimer <= 0) {
      stockTickTimer = 9 + Math.random() * 4;
      const newsIdx = Math.floor(Math.random() * MARKET_NEWS.length);
      emp.stockNews = MARKET_NEWS[newsIdx];
      INITIAL_STOCKS.forEach((s) => {
        const st = emp.stocks[s.sym];
        st.prev = st.price;
        let drift = (Math.random() - 0.48) * 2 * s.vol;
        if (emp.stockNews.includes(s.sym)) drift += 0.05; // Haberde geçen hisseye pozitif destek!
        st.price = Math.max(20, Math.round(st.price * (1 + drift)));
      });
      if (callbacks.onStockTick) callbacks.onStockTick();
    }

    // 2. 2. Arazi İşletmeleri Pasif & Canlı Gelir Döngüsü (Hangi sekmede olursan ol çalışır!)
    if (emp.land2Owned) {
      LAND2_SLOTS.forEach((slot) => {
        const lvl = emp.land2Levels[slot.key] || 0;
        if (lvl > 0) {
          land2Progress[slot.key] += dt / slot.cycleSec;
          if (land2Progress[slot.key] >= 1) {
            land2Progress[slot.key] -= 1;
            const inc = calcSlotIncome(slot, lvl);
            data.cash += inc;
            if (data.daily) data.daily.land2Income = (data.daily.land2Income || 0) + inc;
            land2Floats.push({ x: slot.x + slot.w / 2, y: slot.y + 18, text: `${slot.emoji} +${inc} ₺`, color: "#4ade80", life: 1.5 });
            if (callbacks.onLand2Earn) callbacks.onLand2Earn(inc);
          }
        }
      });

      // Ziyaretçi Karakterler
      const openSlots = LAND2_SLOTS.filter((s) => (emp.land2Levels[s.key] || 0) > 0);
      if (openSlots.length > 0 && land2Visitors.length < 7 && Math.random() < dt * 1.4) {
        const target = openSlots[Math.floor(Math.random() * openSlots.length)];
        land2Visitors.push({
          x: 90 + Math.random() * 300,
          y: 95,
          tx: target.x + target.w / 2 + (Math.random() - 0.5) * 30,
          ty: target.y + target.h - 14,
          shirt: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 6)],
          hair: "#18181b",
          icon: target.emoji,
          phase: Math.random() * 6,
          stay: 1.5,
          leaving: false
        });
      }
      land2Visitors.forEach((v) => {
        const dx = v.tx - v.x;
        const dy = v.ty - v.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 4) {
          v.x += (dx / dist) * 58 * dt;
          v.y += (dy / dist) * 58 * dt;
        } else if (!v.leaving) {
          v.stay -= dt;
          if (v.stay <= 0) {
            v.leaving = true;
            v.tx = 400;
            v.ty = 85;
          }
        } else {
          v.done = true;
        }
      });
      for (let i = land2Visitors.length - 1; i >= 0; i--) {
        if (land2Visitors[i].done) land2Visitors.splice(i, 1);
      }
      land2Floats.forEach((f) => {
        f.y -= 24 * dt;
        f.life -= dt;
      });
      for (let i = land2Floats.length - 1; i >= 0; i--) {
        if (land2Floats[i].life <= 0) land2Floats.splice(i, 1);
      }
    }
  }

  // 2. ARAZİ 2.5D CANLI HARİTA ÇİZİMİ
  function renderLand2(ctx, W, H, phase, data, MR) {
    const emp = data.empire;
    if (land2Ready) {
      ctx.drawImage(land2Img, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#172033";
      ctx.fillRect(0, 0, W, H);
    }

    // Üst Başlık Bandı
    MR.rr(ctx, 56, 76, W - 112, 30, 8, "rgba(15, 23, 42, 0.85)", "#f59e0b", 1.8);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      emp.land2Owned ? "🛍️ OTOYOL OUTLET & LOJİSTİK PLAZA (2. ARAZİ)" : "🏗️ SATILIK YAN ARAZİ — YENİ İŞ YATIRIMI",
      W / 2,
      95
    );

    if (!emp.land2Owned) {
      // Satın Alınmamış Boş Arsa Kartı
      MR.rr(ctx, 58, 170, W - 116, 250, 16, "rgba(15, 23, 42, 0.9)", "#f59e0b", 2.5);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 17px sans-serif";
      ctx.fillText("🏗️ YAN ARAZİYİ SATIN AL!", W / 2, 215);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 12px sans-serif";
      ctx.fillText("İstasyonun yanındaki dev ticari arsa!", W / 2, 246);
      ctx.fillText("☕ Kahve • 🛒 Hipermarket • 🎮 Eğlence", W / 2, 270);
      ctx.fillText("📦 Lojistik • 🎬 Sinema • 🏢 Plaza Kulesi", W / 2, 292);
      ctx.fillText("İstasyonun başına Müdür koy, burayı büyüt!", W / 2, 318);

      const canAfford = data.cash >= LAND2_COST;
      MR.rr(ctx, 98, 344, W - 196, 48, 12, canAfford ? "#16a34a" : "#475569", "#fef08a", 2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 14px sans-serif";
      ctx.fillText(`TAPUYU AL — ${LAND2_COST} ₺`, W / 2, 373);
      return;
    }

    // 6 Ticari Bina Çizimi
    LAND2_SLOTS.forEach((slot) => {
      const lvl = emp.land2Levels[slot.key] || 0;
      const { x, y, w, h } = slot;

      if (lvl === 0) {
        ctx.save();
        ctx.setLineDash([6, 4]);
        MR.rr(ctx, x, y, w, h, 12, "rgba(15, 23, 42, 0.82)", slot.border, 2);
        ctx.setLineDash([]);
        ctx.fillStyle = "#fde68a";
        ctx.font = "900 11.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🔒 ${slot.short}`, x + w / 2, y + 38);
        ctx.fillStyle = "#4ade80";
        ctx.font = "900 14px sans-serif";
        ctx.fillText(`${slot.cost} ₺`, x + w / 2, y + 62);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "700 9.5px sans-serif";
        ctx.fillText(`+${slot.baseIncome} ₺ / döngü`, x + w / 2, y + 82);
        ctx.fillText("(Dokun İnşa Et)", x + w / 2, y + 99);
        ctx.restore();
        return;
      }

      // 3D Gölge + Bina Gövdesi + Çatı
      MR.rr(ctx, x + 5, y + 6, w, h, 12, "rgba(0,0,0,0.48)", null);
      MR.rr(ctx, x, y + 18, w, h - 18, 10, slot.color, "#0f172a", 2);
      MR.rr(ctx, x - 2, y, w + 4, 28, 9, "#1e293b", slot.border, 2);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 10.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${slot.short} ★${lvl}`, x + w / 2, y + 17.5);

      // Vitrinler + Gelir Bilgisi
      const inc = calcSlotIncome(slot, lvl);
      MR.rr(ctx, x + 10, y + 36, w - 20, 34, 6, "rgba(254, 243, 199, 0.16)", slot.border, 1.2);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`${slot.emoji} +${inc} ₺`, x + w / 2, y + 58);

      // Canlı Gelir İlerleme Çubuğu
      const pct = Math.min(1, land2Progress[slot.key] || 0);
      MR.rr(ctx, x + 12, y + 78, w - 24, 10, 5, "#090d1a", slot.border, 1.2);
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(x + 14, y + 80, (w - 28) * pct, 6);

      // Yükseltme Etiketi
      const upCost = calcUpgradeCost(slot, lvl);
      ctx.fillStyle = lvl >= 6 ? "#4ade80" : "#cbd5e1";
      ctx.font = "800 9px sans-serif";
      ctx.fillText(lvl >= 6 ? "MAKS SEVİYE ★" : `Yükselt: ${upCost} ₺ (Dokun)`, x + w / 2, y + 105);
    });

    // Yürüyen Plaza Ziyaretçileri
    land2Visitors.forEach((v) => {
      MR.drawCustomerCharacter(ctx, v.x, v.y, v.shirt, v.hair, v.leaving ? "" : v.icon, v.phase);
    });

    // Uçan Gelir Yazıları
    land2Floats.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.font = "900 14px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#050811";
      ctx.lineWidth = 3.5;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = phase.tint;
    ctx.fillRect(0, 0, W, H);
  }

  function handleLand2Click(pt, data, helpers) {
    const emp = data.empire;
    if (!emp.land2Owned) {
      if (pt.x > 58 && pt.x < 422 && pt.y > 170 && pt.y < 420) {
        if (data.cash >= LAND2_COST) {
          data.cash -= LAND2_COST;
          emp.land2Owned = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🎉 Yan Arazi tapusunu aldın! Artık 6 yeni iş kurabilirsin!");
          helpers.saveGame();
          helpers.updateHUD();
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`Yan Arazi için Şirket Kasasında ${LAND2_COST} ₺ gerekli!`);
        }
      }
      return;
    }

    for (const slot of LAND2_SLOTS) {
      if (pt.x >= slot.x && pt.x <= slot.x + slot.w && pt.y >= slot.y && pt.y <= slot.y + slot.h) {
        const lvl = emp.land2Levels[slot.key] || 0;
        if (lvl >= 6) {
          helpers.showToast(`★ ${slot.name} zaten maksimum seviyede!`);
          return;
        }
        const cost = calcUpgradeCost(slot, lvl);
        if (data.cash >= cost) {
          data.cash -= cost;
          emp.land2Levels[slot.key] = lvl + 1;
          helpers.sfx.perfectHit();
          helpers.showToast(lvl === 0 ? `🎉 ${slot.name} açıldı!` : `⬆️ ${slot.name} Sv.${lvl + 1} oldu!`);
          helpers.saveGame();
          helpers.updateHUD();
        } else {
          helpers.sfx.burnFail();
          helpers.showToast(`${slot.name} için ${cost} ₺ gerekli!`);
        }
        return;
      }
    }
  }

  // =========================================================================
  // ŞEHİR & ŞAHSİ YAŞAM MODALI (MAAŞ AYARI • ELEKTRONİK • EMLAKÇI • GALERİCİ)
  // =========================================================================
  let currentCityTab = "salary";

  function renderCityModal(data, helpers) {
    const emp = data.empire;
    const body = document.getElementById("cityModalBody");
    const cashEl = document.getElementById("cityPersonalCash");
    if (!body) return;
    if (cashEl) cashEl.textContent = Math.round(emp.personalCash);

    document.querySelectorAll(".city-tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === currentCityTab);
    });

    if (currentCityTab === "salary") {
      const dailyRent = calcDailyRent(emp);
      const wealth = calcTotalPersonalWealth(emp);
      const prestige = calcPrestige(emp);
      const presets = [0, 100, 200, 400, 750, 1200, 2000];

      body.innerHTML = `
        <div class="rep-section" style="margin-bottom:10px;">
          <h4>💼 KENDİ GÜNLÜK MAAŞINI BELİRLE</h4>
          <p style="font-size:13px; color:#cbd5e1; margin-bottom:8px;">
            Her gün sonunda seçtiğin maaş <strong>Şirket Kasasından</strong> çekilip <strong>Şahsi Cüzdanına</strong> yatar. Şahsi paranla telefon, daire, araba ve hisse senedi alabilirsin!
          </p>
          <div style="font-size:20px; font-weight:900; color:#4ade80; text-align:center; margin:8px 0;">
            Günlük Maaşın: ${emp.dailySalary} ₺ / gün
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center;">
            ${presets
              .map(
                (amt) =>
                  `<button class="sal-btn ${emp.dailySalary === amt ? "active" : ""}" data-sal="${amt}">${amt} ₺</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="rep-section">
          <h4>💎 ŞAHSİ SERVET ÖZETİN</h4>
          <div class="rep-row"><span>💳 Şahsi Cüzdan (Nakit)</span><span class="val-pos">${Math.round(emp.personalCash)} ₺</span></div>
          <div class="rep-row"><span>📈 Borsa Portföy Değeri</span><span class="val-pos">${calcPortfolioValue(emp)} ₺</span></div>
          <div class="rep-row"><span>🏠 Günlük Pasif Kira Geliri</span><span class="val-pos">+${dailyRent} ₺ / gün</span></div>
          <div class="rep-row"><span>👑 Yaşam Prestiji</span><span style="color:#facc15; font-weight:900;">${prestige} Puan</span></div>
          <div class="rep-row" style="border-top:1px solid #334155; padding-top:5px; margin-top:4px;">
            <span><strong>🏦 Toplam Şahsi Servet</strong></span>
            <span class="val-pos">${wealth} ₺</span>
          </div>
        </div>
      `;

      body.querySelectorAll(".sal-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          emp.dailySalary = Number(btn.dataset.sal);
          helpers.sfx.tap();
          helpers.saveGame();
          helpers.showToast(`💼 Günlük şahsi maaşın ${emp.dailySalary} ₺ olarak ayarlandı!`);
          renderCityModal(data, helpers);
        });
      });
      return;
    }

    const listMap = {
      electronics: { items: ELECTRONICS, owned: emp.electronics, type: "electronics" },
      properties: { items: PROPERTIES, owned: emp.properties, type: "properties" },
      cars: { items: GALLERY_CARS, owned: emp.cars, type: "cars" }
    };
    const cfg = listMap[currentCityTab];
    body.innerHTML = "";

    cfg.items.forEach((it) => {
      const isOwned = !!cfg.owned[it.key];
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${it.name}</h3><p>${it.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (isOwned) {
        btn.disabled = true;
        btn.textContent = "SAHİPSİN ✓";
      } else {
        btn.textContent = `${it.price} ₺`;
        btn.addEventListener("click", () => {
          if (emp.personalCash < it.price) {
            helpers.sfx.burnFail();
            return helpers.showToast(`Şahsi cüzdanda ${it.price} ₺ gerekli! (Maaşın gün sonunda yatar)`);
          }
          emp.personalCash -= it.price;
          cfg.owned[it.key] = true;
          if (it.repBonus) data.reputation = Math.min(100, data.reputation + it.repBonus);
          helpers.sfx.perfectHit();
          if (cfg.type === "electronics" && it.key === "phone") {
            helpers.showToast("📱 Akıllı Telefon alındı! Artık üstten 📱 Telefonum'u açabilirsin!");
          } else {
            helpers.showToast(`🎉 Hayırlı olsun! ${it.name} satın alındı!`);
          }
          helpers.saveGame();
          helpers.updateHUD();
          renderCityModal(data, helpers);
        });
      }
      card.appendChild(btn);
      body.appendChild(card);
    });
  }

  // =========================================================================
  // 📱 AKILLI TELEFON OS (BORSA • YOLGRAM SOSYAL MEDYA • MÜDÜR • SERVET)
  // =========================================================================
  let currentPhoneApp = "stocks";

  function renderPhoneModal(data, helpers) {
    const emp = data.empire;
    const screen = document.getElementById("phoneAppScreen");
    if (!screen) return;

    document.querySelectorAll(".phone-nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.app === currentPhoneApp);
    });

    if (currentPhoneApp === "stocks") {
      const hasLaptop = !!emp.electronics.laptop;
      let html = `
        <div class="phone-news-bar">${emp.stockNews}</div>
        <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:800; color:#cbd5e1; margin-bottom:8px;">
          <span>💳 Şahsi Nakit: <strong style="color:#4ade80;">${Math.round(emp.personalCash)} ₺</strong></span>
          <span>📈 Portföy: <strong style="color:#38bdf8;">${calcPortfolioValue(emp)} ₺</strong></span>
        </div>
      `;

      INITIAL_STOCKS.forEach((s) => {
        const st = emp.stocks[s.sym];
        const diff = st.price - st.prev;
        const pct = st.prev > 0 ? ((diff / st.prev) * 100).toFixed(1) : "0.0";
        const up = diff >= 0;
        const pnl = st.shares > 0 ? Math.round((st.price - st.avgCost) * st.shares) : 0;
        html += `
          <div class="stock-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:900; font-size:14px; color:#fff;">${s.sym} <span style="font-size:11px; color:#94a3b8; font-weight:700;">${s.name}</span></div>
                <div style="font-size:11.5px; color:#cbd5e1;">Elinde: <strong>${st.shares} lot</strong> ${st.shares > 0 ? `(${pnl >= 0 ? "+" : ""}${pnl}₺)` : ""}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:900; font-size:15px; color:#fde047;">${st.price} ₺</div>
                <div style="font-size:11px; font-weight:900; color:${up ? "#4ade80" : "#f87171"};">${up ? "▲" : "▼"} %${Math.abs(Number(pct))}</div>
              </div>
            </div>
            <div class="stock-actions">
              <button class="stk-btn buy" data-sym="${s.sym}" data-act="buy1">+1 Al</button>
              <button class="stk-btn buy" data-sym="${s.sym}" data-act="buy5">+5 Al</button>
              <button class="stk-btn sell" data-sym="${s.sym}" data-act="sell1">-1 Sat</button>
              <button class="stk-btn sell" data-sym="${s.sym}" data-act="sellall">Tümü Sat</button>
            </div>
          </div>
        `;
      });
      if (hasLaptop) {
        html += `<div style="font-size:11px; color:#4ade80; text-align:center; margin-top:4px;">💻 Patron PC Aktif: %0 Borsa Komisyonu!</div>`;
      }
      screen.innerHTML = html;

      screen.querySelectorAll(".stk-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const sym = btn.dataset.sym;
          const act = btn.dataset.act;
          const st = emp.stocks[sym];
          const feeRate = emp.electronics.laptop ? 0 : 0.02;

          if (act === "buy1" || act === "buy5") {
            const qty = act === "buy5" ? 5 : 1;
            const totalCost = Math.round(st.price * qty * (1 + feeRate));
            if (emp.personalCash < totalCost) {
              helpers.sfx.burnFail();
              return helpers.showToast(`Yetersiz şahsi bakiye! (${totalCost} ₺ gerekli)`);
            }
            const oldVal = st.shares * st.avgCost;
            emp.personalCash -= totalCost;
            st.shares += qty;
            st.avgCost = (oldVal + st.price * qty) / st.shares;
            helpers.sfx.cashRegister();
          } else {
            if (st.shares <= 0) return helpers.showToast("Satacak hissen yok!");
            const qty = act === "sellall" ? st.shares : 1;
            const gain = Math.round(st.price * qty * (1 - feeRate));
            st.shares -= qty;
            if (st.shares === 0) st.avgCost = 0;
            emp.personalCash += gain;
            helpers.sfx.cashRegister();
          }
          helpers.saveGame();
          helpers.updateHUD();
          renderPhoneModal(data, helpers);
        });
      });
      return;
    }

    if (currentPhoneApp === "social") {
      const canPost = socialCooldown <= 0;
      const postsHtml = emp.socialPosts
        .slice(0, 5)
        .map((txt) => `<div class="social-post">${txt}</div>`)
        .join("");
      const comment = SOCIAL_COMMENTS[Math.floor(Date.now() / 10000) % SOCIAL_COMMENTS.length];
      screen.innerHTML = `
        <div class="rep-section" style="margin-bottom:8px; text-align:center;">
          <div style="font-size:13px; color:#f472b6; font-weight:900;">📸 YolGram • @sonistasyon_patron</div>
          <div style="font-size:20px; font-weight:900; color:#fff; margin:4px 0;">${emp.socialFollowers} Takipçi</div>
          <button id="btnMakeSocialPost" class="primary-btn" style="padding:10px; font-size:14px;" ${canPost ? "" : "disabled"}>
            ${canPost ? "📸 YENİ PAYLAŞIM YAP (+VIP Akını & İtibar!)" : `⏳ Yeni paylaşım için ${Math.ceil(socialCooldown)}sn`}
          </button>
        </div>
        <div class="social-post" style="border-color:#38bdf8; color:#bae6fd;">${comment}</div>
        ${postsHtml}
      `;
      const pBtn = document.getElementById("btnMakeSocialPost");
      if (pBtn && canPost) {
        pBtn.addEventListener("click", () => {
          const gained = 35 + Math.floor(calcPrestige(emp) * 0.8) + Math.floor(Math.random() * 45);
          emp.socialFollowers += gained;
          socialCooldown = 25;
          const postTemplates = [
            `⛽ İstasyonumuzda gece servisi son hız! (+${gained} yeni takipçi)`,
            `🏎️ Yeni yatırımlarla büyümeye devam ediyoruz! (+${gained} takipçi)`,
            `🍽️ Sıcak yemek, hızlı şarj ve güvenilir yakıt tek adreste! (+${gained} takipçi)`
          ];
          emp.socialPosts.unshift(postTemplates[Math.floor(Math.random() * postTemplates.length)]);
          if (emp.socialPosts.length > 8) emp.socialPosts.pop();
          data.reputation = Math.min(100, data.reputation + 5);
          helpers.triggerVipRush(30);
          helpers.sfx.perfectHit();
          helpers.showToast(`📸 Paylaşım tuttu! +${gained} takipçi ve 30 sn VIP Akını!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderPhoneModal(data, helpers);
        });
      }
      return;
    }

    if (currentPhoneApp === "manager") {
      const logsHtml = emp.managerLogs
        .map((m) => `<div class="chat-bubble">${m}</div>`)
        .join("");
      screen.innerHTML = `
        <div class="rep-section" style="margin-bottom:8px;">
          <div style="font-weight:900; color:#fde047; font-size:14px;">👔 Müdür Kemal Bey ${emp.managerHired ? "(🟢 Görevde)" : "(⚪ Henüz Atanmadı)"}</div>
          <p style="font-size:12px; color:#cbd5e1; margin-top:3px;">
            ${emp.managerHired ? "Temkinli yönetim aktif: rutin olayları güvenle çözer, büyük krizlerde seni hemen arar." : "Çalışanlar menüsünden Müdür Kemal'i işe alarak istasyonu ona emanet edebilirsin."}
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">${logsHtml}</div>
      `;
      return;
    }

    // wealth app
    screen.innerHTML = `
      <div class="rep-section">
        <h4>🏦 KİŞİSEL BANKA & SERVET</h4>
        <div class="rep-row"><span>💳 Şahsi Cüzdan</span><span class="val-pos">${Math.round(emp.personalCash)} ₺</span></div>
        <div class="rep-row"><span>💼 Günlük Maaşın</span><span class="val-pos">${emp.dailySalary} ₺/gün</span></div>
        <div class="rep-row"><span>🏠 Günlük Kira Geliri</span><span class="val-pos">+${calcDailyRent(emp)} ₺/gün</span></div>
        <div class="rep-row"><span>📈 Hisse Portföyü</span><span class="val-pos">${calcPortfolioValue(emp)} ₺</span></div>
        <div class="rep-row"><span>🏢 Şirket Kasası</span><span style="color:#fde047; font-weight:900;">${Math.round(data.cash)} ₺</span></div>
        <div class="rep-row" style="border-top:1px solid #334155; padding-top:6px; margin-top:4px;">
          <span><strong>💎 Toplam Şahsi Servet</strong></span>
          <span class="val-pos">${calcTotalPersonalWealth(emp)} ₺</span>
        </div>
      </div>
    `;
  }

  return {
    LAND2_COST,
    LAND2_SLOTS,
    ELECTRONICS,
    PROPERTIES,
    GALLERY_CARS,
    createDefaultEmpire,
    mergeEmpire,
    calcDailyRent,
    calcPrestige,
    calcTotalPersonalWealth,
    addManagerLog,
    updateEmpire,
    renderLand2,
    handleLand2Click,
    setCityTab(tab) { currentCityTab = tab; },
    setPhoneApp(app) { currentPhoneApp = app; },
    renderCityModal,
    renderPhoneModal
  };
})();

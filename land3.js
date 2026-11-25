// Son İstasyon v14.0 — 3. Arazi Mega Kompleksi:
// 1) 🏎️ Go-Kart Yarış Pisti & 🎡 Dönme Dolap (Canlı Yarışan Kartlar & Dönen Kabinler)
// 2) 🏭 Akaryakıt Rafinerisi (İstasyon Tankerini 0 ₺ Yapar!) & 🚛 Kendi Tır Filomuz (1..10 Tır Satın Al & Sefer Gönder)
// 3) 🏖️ Havuzlu Bungalov & Termal Tatil Köyü (6 Ayrı Bungalov İnşa Et & Gecelik Kiraya Ver + SPA)

window.Land3System = (function () {
  const baseImg = new Image();
  let baseReady = false;
  baseImg.onload = () => (baseReady = true);
  baseImg.src = "./assets/land3-ground.jpg";

  const LAND3_COST = 18000;
  const THEME_UNLOCK_COST = 5500;
  const REFINERY_COST = 8500;
  const RESORT_UNLOCK_COST = 6800;
  const SPA_UNLOCK_COST = 5200;

  const THEME_BOX = { x: 48, y: 100, w: 204, h: 238 };
  const FLEET_BOX = { x: 260, y: 100, w: 172, h: 238 };
  const RESORT_BOX = { x: 48, y: 348, w: 384, h: 242 };

  // 6 Ayrı Ahşap A-Frame Bungalov (Tek tek satın alınır ve kiraya verilir!)
  const BUNGALOW_DEFS = [
    { key: "b1", name: "Çamlık Bungalov #1", cost: 2400, rent: 95, desc: "Doğayla iç içe şömineli ahşap ev." },
    { key: "b2", name: "Havuz Başı Bungalov #2", cost: 3200, rent: 130, desc: "Isıtmalı havuza sıfır özel veranda." },
    { key: "b3", name: "Jakuzili Bungalov #3", cost: 4300, rent: 175, desc: "Termal jakuzili lüks çift konsepti." },
    { key: "b4", name: "Aile Suit Bungalov #4", cost: 5600, rent: 230, desc: "Çift katlı geniş aile tatil villası." },
    { key: "b5", name: "Balayı VIP Bungalov #5", cost: 7400, rent: 305, desc: "Cam tavanlı yıldız manzaralı VIP ev." },
    { key: "b6", name: "Kraliyet Termal Villa #6", cost: 9800, rent: 410, desc: "Özel termal havuzlu en yüksek kira getirisi!" }
  ];

  // Go-Kart Pist Koordinatları (Kapalı Oval-Şikan Yarış Pisti)
  const KART_TRACK_PTS = [
    { x: 82, y: 162 },
    { x: 158, y: 162 },
    { x: 172, y: 186 },
    { x: 166, y: 222 },
    { x: 126, y: 214 },
    { x: 96, y: 226 },
    { x: 74, y: 196 }
  ];

  const karts = [
    { seg: 0, t: 0.0, col: "#ef4444", speed: 1.35 },
    { seg: 2, t: 0.3, col: "#3b82f6", speed: 1.48 },
    { seg: 4, t: 0.6, col: "#facc15", speed: 1.41 },
    { seg: 5, t: 0.8, col: "#22c55e", speed: 1.52 }
  ];

  let wheelAngle = 0;
  let themeProgress = 0;
  let refineryProgress = 0;
  let resortProgress = 0;
  let activeFleetTrucks = []; // Otoyola sefere çıkan kendi tırlarımız!
  let fleetDispatchTimer = 2.0;
  let resortGuests = [];
  let land3Floats = [];
  let bgCars = [];
  let activeModalMode = "theme"; // "theme" | "fleet" | "resort"
  let cachedHelpers = null;

  function createDefaultLand3() {
    const bungalows = {};
    BUNGALOW_DEFS.forEach((b) => {
      bungalows[b.key] = { owned: false, rented: false, lvl: 1 };
    });
    return {
      owned: false,
      themeUnlocked: false,
      themeLvl: 1, // 1..6
      refineryUnlocked: false, // Aktif olunca 1. İstasyon Tanker İkmalini 0 ₺ BEDAVA yapar!
      fleetCount: 0, // 0..10 Tır
      fleetLvl: 1, // 1..5 Sefer Geliri Çarpanı
      resortUnlocked: false,
      spaUnlocked: false,
      bungalows,
      land3Salary: 0 // 3. Araziden Şahsi Maaşım!
    };
  }

  function mergeLand3(saved) {
    const def = createDefaultLand3();
    if (!saved) return def;
    const out = Object.assign({}, def, saved);
    out.bungalows = {};
    BUNGALOW_DEFS.forEach((b) => {
      out.bungalows[b.key] = Object.assign(
        { owned: false, rented: false, lvl: 1 },
        (saved.bungalows && saved.bungalows[b.key]) || {}
      );
    });
    out.fleetCount = Math.max(0, Math.min(10, out.fleetCount || 0));
    out.themeLvl = Math.max(1, Math.min(6, out.themeLvl || 1));
    out.fleetLvl = Math.max(1, Math.min(5, out.fleetLvl || 1));
    out.land3Salary = Number.isFinite(out.land3Salary) ? out.land3Salary : 0;
    return out;
  }

  // Hesaplamalar
  function getThemeCycleIncome(l3) {
    if (!l3.themeUnlocked) return 0;
    return Math.round(145 * (1 + (l3.themeLvl - 1) * 0.45));
  }

  function getThemeUpgradeCost(l3) {
    return Math.round(3600 * Math.pow(1.5, l3.themeLvl - 1));
  }

  function getNextTruckCost(fleetCount) {
    return Math.round(3200 * Math.pow(1.28, fleetCount));
  }

  function getFleetUpgradeCost(fleetLvl) {
    return Math.round(4500 * Math.pow(1.55, fleetLvl - 1));
  }

  function getTruckTripIncome(l3) {
    return Math.round(115 * (1 + (l3.fleetLvl - 1) * 0.38));
  }

  function getBungalowRent(bDef, bState, l3) {
    if (!bState || !bState.owned || !bState.rented) return 0;
    const spaMult = l3.spaUnlocked ? 1.35 : 1.0;
    const lvlMult = 1 + (bState.lvl - 1) * 0.35;
    return Math.round(bDef.rent * lvlMult * spaMult);
  }

  function getResortTotalRent(l3) {
    if (!l3.resortUnlocked) return 0;
    return BUNGALOW_DEFS.reduce((sum, b) => sum + getBungalowRent(b, l3.bungalows[b.key], l3), 0);
  }

  function getResortCounts(l3) {
    let owned = 0;
    let rented = 0;
    BUNGALOW_DEFS.forEach((b) => {
      const st = l3.bungalows[b.key];
      if (st && st.owned) owned += 1;
      if (st && st.rented) rented += 1;
    });
    return { owned, rented, total: BUNGALOW_DEFS.length };
  }

  function hasAnyLand3Business(l3) {
    return !!(l3 && l3.owned && (l3.themeUnlocked || l3.refineryUnlocked || l3.fleetCount > 0 || l3.resortUnlocked));
  }

  // =========================================================================
  // CANLI GÜNCELLEME (YARIŞAN GO-KARTLAR, DÖNME DOLAP, SEFERDEKİ TIRLAR, TATİL KÖYÜ)
  // =========================================================================
  function updateLand3(dt, data, onEarn) {
    if (!data.empire.land3) data.empire.land3 = createDefaultLand3();
    const l3 = data.empire.land3;

    // Otoyol üst şerit arka plan araçları
    if (Math.random() < dt * 0.75 && bgCars.length < 4) {
      bgCars.push({
        x: 520,
        y: 23,
        speed: 108 + Math.random() * 25,
        color: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#e2e8f0"][Math.floor(Math.random() * 5)]
      });
    }
    bgCars.forEach((c) => (c.x -= c.speed * dt));
    bgCars = bgCars.filter((c) => c.x > -60);

    if (!l3.owned) return;

    const v16Mult = (() => {
      const v16 = data.empire && data.empire.v16;
      if (!window.HoldingV16 || !v16) return 1.0;
      const sd = window.HoldingV16.getSpecialDay(v16);
      const hq = v16.vipAssets && v16.vipAssets.hq ? 1.15 : 1.0;
      return (sd.incomeMult || 1.0) * hq;
    })();

    // 1. Go-Kart Pisti & Dönme Dolap
    if (l3.themeUnlocked) {
      wheelAngle += dt * 0.55;
      karts.forEach((k) => {
        k.t += dt * k.speed * (1 + (l3.themeLvl - 1) * 0.08);
        if (k.t >= 1) {
          k.t -= 1;
          k.seg = (k.seg + 1) % KART_TRACK_PTS.length;
        }
      });

      themeProgress += dt / 7.0;
      if (themeProgress >= 1) {
        themeProgress -= 1;
        const inc = Math.round(getThemeCycleIncome(l3) * v16Mult);
        data.cash += inc;
        if (data.daily) {
          data.daily.land3ThemeIncome = (data.daily.land3ThemeIncome || 0) + inc;
        }
        if (l3.land3Salary > 0) {
          data.empire.personalCash += Math.max(3, Math.round(l3.land3Salary * 0.015));
        }
        land3Floats.push({ x: THEME_BOX.x + THEME_BOX.w / 2, y: THEME_BOX.y + 34, text: `🎡 Bilet +${inc} ₺`, color: "#facc15", life: 1.5 });
        if (onEarn) onEarn(inc);
      }
    }

    // 2. Rafineri Toptan Satış Geliri
    if (l3.refineryUnlocked) {
      refineryProgress += dt / 9.0;
      if (refineryProgress >= 1) {
        refineryProgress -= 1;
        const refInc = 160;
        data.cash += refInc;
        if (data.daily) {
          data.daily.land3RefineryIncome = (data.daily.land3RefineryIncome || 0) + refInc;
        }
        land3Floats.push({ x: 312, y: 138, text: `🛢️ Rafineri +${refInc} ₺`, color: "#38bdf8", life: 1.45 });
        if (onEarn) onEarn(refInc);
      }
    }

    // 3. Kendi Tır Filomuz (Sefer Gönderimi & Dönüş Geliri!)
    if (l3.fleetCount > 0) {
      fleetDispatchTimer -= dt;
      if (fleetDispatchTimer <= 0 && activeFleetTrucks.length < Math.min(4, l3.fleetCount)) {
        fleetDispatchTimer = Math.max(1.8, 6.2 - l3.fleetCount * 0.42);
        const colors = ["#dc2626", "#2563eb", "#f59e0b", "#10b981", "#7c3aed"];
        activeFleetTrucks.push({
          x: 345,
          y: 268,
          angle: 0,
          color: colors[activeFleetTrucks.length % colors.length],
          phase: "departing",
          waypoints: [
            { x: 412, y: 268, speed: 88 },
            { x: 412, y: 58, speed: 102 },
            { x: 540, y: 58, speed: 132 }
          ]
        });
      }

      activeFleetTrucks.forEach((tr) => {
        const wp = tr.waypoints[0];
        if (!wp) return;
        const dx = wp.x - tr.x;
        const dy = wp.y - tr.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1) tr.angle = Math.atan2(dx, -dy);
        if (dist <= wp.speed * dt) {
          tr.x = wp.x;
          tr.y = wp.y;
          tr.waypoints.shift();
          if (tr.waypoints.length === 0) {
            if (tr.phase === "departing") {
              // Otoyoldan döner ve sevkiyat parasını kasaya bırakır!
              tr.phase = "returning";
              tr.x = -50;
              tr.y = 58;
              tr.waypoints = [
                { x: 98, y: 58, speed: 125 },
                { x: 98, y: 342, speed: 100 },
                { x: 345, y: 342, speed: 95 },
                { x: 345, y: 282, speed: 80 }
              ];
            } else {
              const tripPay = Math.round((getTruckTripIncome(l3) + l3.fleetCount * 18) * v16Mult);
              data.cash += tripPay;
              if (data.daily) {
                data.daily.land3FleetIncome = (data.daily.land3FleetIncome || 0) + tripPay;
                data.daily.land3FleetTrips = (data.daily.land3FleetTrips || 0) + 1;
              }
              if (l3.land3Salary > 0) {
                data.empire.personalCash += Math.max(4, Math.round(l3.land3Salary * 0.018));
              }
              land3Floats.push({ x: 346, y: 248, text: `🚛 Filo Seferi +${tripPay} ₺`, color: "#4ade80", life: 1.6 });
              tr.done = true;
              if (onEarn) onEarn(tripPay);
            }
          }
        } else {
          tr.x += (dx / dist) * wp.speed * dt;
          tr.y += (dy / dist) * wp.speed * dt;
        }
      });
      activeFleetTrucks = activeFleetTrucks.filter((t) => !t.done);
    }

    // 4. Havuzlu Bungalov & Termal Tatil Köyü Kiraları
    if (l3.resortUnlocked) {
      const totalRent = Math.round(getResortTotalRent(l3) * v16Mult);
      if (totalRent > 0) {
        resortProgress += dt / 8.0;
        if (resortProgress >= 1) {
          resortProgress -= 1;
          data.cash += totalRent;
          if (data.daily) {
            data.daily.land3ResortIncome = (data.daily.land3ResortIncome || 0) + totalRent;
          }
          if (l3.land3Salary > 0) {
            data.empire.personalCash += Math.max(5, Math.round(l3.land3Salary * 0.02));
          }
          land3Floats.push({
            x: RESORT_BOX.x + RESORT_BOX.w / 2,
            y: RESORT_BOX.y + 42,
            text: `🏖️ Tatil Köyü +${totalRent} ₺`,
            color: "#34d399",
            life: 1.65
          });
          if (onEarn) onEarn(totalRent);
        }
      }

      // Havuz kenarında gezen tatilciler
      if (getResortCounts(l3).rented > 0 && resortGuests.length < 6 && Math.random() < dt * 0.9) {
        resortGuests.push({
          x: 185 + Math.random() * 110,
          y: 410 + Math.random() * 120,
          tx: 185 + Math.random() * 110,
          ty: 410 + Math.random() * 120,
          shirt: ["#38bdf8", "#f472b6", "#facc15", "#4ade80"][Math.floor(Math.random() * 4)],
          phase: Math.random() * 6,
          life: 5 + Math.random() * 4
        });
      }
      resortGuests.forEach((g) => {
        g.phase += dt * 5;
        g.life -= dt;
        const dx = g.tx - g.x;
        const dy = g.ty - g.y;
        const d = Math.hypot(dx, dy);
        if (d > 3) {
          g.x += (dx / d) * 24 * dt;
          g.y += (dy / d) * 24 * dt;
        }
      });
      resortGuests = resortGuests.filter((g) => g.life > 0);
    }

    land3Floats.forEach((f) => {
      f.y -= 24 * dt;
      f.life -= dt;
    });
    land3Floats = land3Floats.filter((f) => f.life > 0);
  }

  // =========================================================================
  // GERÇEKÇİ 2.5D 3. ARAZİ HARİTA ÇİZİMİ
  // =========================================================================
  function drawThemeParkZone(ctx, MR, l3) {
    const { x, y, w, h } = THEME_BOX;
    if (!l3.themeUnlocked) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      MR.rr(ctx, x, y, w, h, 14, "rgba(15, 23, 42, 0.84)", "#f472b6", 2);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fbcfe8";
      ctx.font = "900 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🏎️ GO-KART & 🎡 LUNAPARK", x + w / 2, y + 76);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 9.5px sans-serif";
      ctx.fillText("Canlı yarış pisti ve ışıklı dönme dolap!", x + w / 2, y + 98);
      MR.rr(ctx, x + 28, y + 118, w - 56, 36, 9, "#db2777", "#fef08a", 1.8);
      ctx.fillStyle = "#fff";
      ctx.font = "900 11.5px sans-serif";
      ctx.fillText(`KUR — ${THEME_UNLOCK_COST} ₺`, x + w / 2, y + 140);
      ctx.restore();
      return;
    }

    // 1. Yeni 3D zeminle uyumlu şeffaf yeşil park çerçevesi (çim ve taş yollar alttan görünür!)
    MR.rr(ctx, x, y, w, h, 14, "rgba(6, 78, 59, 0.34)", "rgba(244, 114, 182, 0.8)", 2);
    const thHeadG = ctx.createLinearGradient(x + 6, y + 6, x + w - 6, y + 26);
    thHeadG.addColorStop(0, "#9d174d");
    thHeadG.addColorStop(1, "#500724");
    MR.rr(ctx, x + 6, y + 6, w - 12, 20, 6, thHeadG, "#fde047", 1.4);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🏎️ GO-KART & LUNAPARK ★${l3.themeLvl}`, x + w / 2, y + 19.5);

    // 2. Gerçekçi Go-Kart Pisti (Kırmızı-Beyaz Kerb + Asfalt Pist + Damalı Çizgi)
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    KART_TRACK_PTS.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();

    // Kırmızı-Beyaz FIA Viraj Bordürü
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 22;
    ctx.stroke();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 22;
    ctx.stroke();
    ctx.setLineDash([]);

    // Koyu Yarış Asfaltı
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 17;
    ctx.stroke();
    ctx.restore();

    // Damalı Başlangıç Çizgisi
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(116, 153, 5, 18);
    ctx.fillStyle = "#090d1a";
    ctx.fillRect(116, 157, 5, 5);
    ctx.fillRect(116, 166, 5, 5);

    // Pistte Canlı Yarışan 4 Go-Kart Aracı (Açık Tekerlekli + Kasklı Sürücü!)
    karts.forEach((k) => {
      const p1 = KART_TRACK_PTS[k.seg];
      const p2 = KART_TRACK_PTS[(k.seg + 1) % KART_TRACK_PTS.length];
      const kx = p1.x + (p2.x - p1.x) * k.t;
      const ky = p1.y + (p2.y - p1.y) * k.t;
      const ang = Math.atan2(p2.x - p1.x, -(p2.y - p1.y));
      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(ang);
      ctx.fillStyle = "#090d1a";
      ctx.fillRect(-5.5, -5, 2.5, 3.5);
      ctx.fillRect(3, -5, 2.5, 3.5);
      ctx.fillRect(-5.5, 2, 2.5, 3.5);
      ctx.fillRect(3, 2, 2.5, 3.5);
      MR.rr(ctx, -3.8, -6.5, 7.6, 13, 3, k.col, "#fff", 0.8);
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Sağ Köşede Dönen Neon Işıklı 2.5D Dönme Dolap!
    const wx = x + w - 40;
    const wy = y + 158;
    const wr = 28;
    // Altın neon ışık halesi
    const wheelGlow = ctx.createRadialGradient(wx, wy, 4, wx, wy, wr + 16);
    wheelGlow.addColorStop(0, "rgba(250, 204, 21, 0.28)");
    wheelGlow.addColorStop(1, "rgba(244, 114, 182, 0)");
    ctx.fillStyle = wheelGlow;
    ctx.beginPath();
    ctx.arc(wx, wy, wr + 16, 0, Math.PI * 2);
    ctx.fill();

    // Zemin gölgesi & Çelik Ayaklar
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(wx, wy + 31, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wx - 16, wy + 30);
    ctx.lineTo(wx, wy);
    ctx.lineTo(wx + 16, wy + 30);
    ctx.stroke();

    // Dönen Çember & Teller
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(wx, wy, wr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(244, 114, 182, 0.65)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(wx, wy, wr - 6, 0, Math.PI * 2);
    ctx.stroke();

    const cabinCols = ["#ef4444", "#38bdf8", "#4ade80", "#f472b6", "#facc15", "#a855f7", "#fb923c", "#2dd4bf"];
    for (let i = 0; i < 8; i++) {
      const a = wheelAngle + (i * Math.PI) / 4;
      const cx = wx + Math.cos(a) * wr;
      const cy = wy + Math.sin(a) * wr;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      // Daima dik duran yolcu kabinleri!
      MR.rr(ctx, cx - 4.5, cy - 3, 9, 7.5, 2.5, cabinCols[i], "#090d1a", 1);
    }

    // Alt Gelir Çubuğu
    MR.rr(ctx, x + 10, y + h - 38, w - 20, 28, 7, "rgba(15, 23, 42, 0.9)", "#f472b6", 1.4);
    ctx.fillStyle = "#fde047";
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🎟️ +${getThemeCycleIncome(l3)} ₺ • Dokun Büyüt`, x + w / 2, y + h - 20);
  }

  function drawRefineryAndFleetZone(ctx, MR, l3, phase) {
    const { x, y, w, h } = FLEET_BOX;
    MR.rr(ctx, x, y, w, h, 14, "rgba(15, 23, 42, 0.72)", "rgba(148, 163, 184, 0.55)", 1.8);

    MR.rr(ctx, x + 6, y + 6, w - 12, 20, 6, "#0f172a", "#38bdf8", 1.4);
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "900 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🏭 RAFİNERİ & TIR FİLOSU", x + w / 2, y + 19.5);

    // Üst Yarı: Çift Çelik Akaryakıt Rafineri Silosu!
    if (!l3.refineryUnlocked) {
      MR.rr(ctx, x + 10, y + 32, w - 20, 74, 9, "rgba(9,13,26,0.75)", "#38bdf8", 1.3);
      ctx.fillStyle = "#bae6fd";
      ctx.font = "900 9.5px sans-serif";
      ctx.fillText("🔒 🛢️ YAKIT RAFİNERİSİ", x + w / 2, y + 54);
      ctx.fillStyle = "#4ade80";
      ctx.font = "800 8.5px sans-serif";
      ctx.fillText(`Tankeri BEDAVA Yapar! (${REFINERY_COST}₺)`, x + w / 2, y + 72);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 8px sans-serif";
      ctx.fillText("(Dokun Kur)", x + w / 2, y + 89);
    } else {
      // Gerçekçi Parlak Çelik Silolar + Boru Köprüsü
      [x + 48, x + 122].forEach((sx) => {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.beginPath();
        ctx.ellipse(sx + 3, y + 72, 24, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        const sg = ctx.createRadialGradient(sx - 6, y + 62, 3, sx, y + 68, 25);
        sg.addColorStop(0, "#ffffff");
        sg.addColorStop(0.45, "#cbd5e1");
        sg.addColorStop(1, "#475569");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, y + 68, 23, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });
      // Sarı Boru Hattı
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(x + 48, y + 68);
      ctx.lineTo(x + 122, y + 68);
      ctx.stroke();
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 8.2px sans-serif";
      ctx.fillText("✓ TANKER İKMALİ 0 ₺ BEDAVA!", x + w / 2, y + 104);
    }

    // Alt Yarı: 10 Tırlık Kendi Lojistik Filo Garajımız!
    MR.rr(ctx, x + 10, y + 114, w - 20, 82, 9, "#0f172a", "#facc15", 1.4);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 9.5px sans-serif";
    ctx.fillText(`🚛 KENDİ TIR FİLOMUZ: ${l3.fleetCount}/10`, x + w / 2, y + 130);

    // Park halindeki filo tırları (Görsel peron çizgileri)
    for (let i = 0; i < 5; i++) {
      const bx = x + 26 + i * 30;
      ctx.strokeStyle = "rgba(250, 204, 21, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx - 11, y + 138, 22, 48);
      if (i < Math.ceil(l3.fleetCount / 2)) {
        MR.drawDetailedVehicle(ctx, bx, y + 162, ["#dc2626", "#2563eb", "#f59e0b", "#10b981", "#8b5cf6"][i], "truck", 0, {
          nightIntensity: 0.15
        });
      }
    }

    MR.rr(ctx, x + 10, y + h - 36, w - 20, 26, 7, "#0284c7", "#fef08a", 1.4);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9px sans-serif";
    ctx.fillText("🚛 Tır Satın Al & Rafineri Yönet", x + w / 2, y + h - 19.5);

    // Otoyola sefere çıkan canlı tırlarımız!
    activeFleetTrucks.forEach((tr) => {
      MR.drawDetailedVehicle(ctx, tr.x, tr.y, tr.color, "truck", tr.angle, { nightIntensity: phase.night });
    });
  }

  function drawResortZone(ctx, MR, l3) {
    const { x, y, w, h } = RESORT_BOX;
    if (!l3.resortUnlocked) {
      ctx.save();
      ctx.setLineDash([7, 5]);
      MR.rr(ctx, x, y, w, h, 16, "rgba(15, 23, 42, 0.86)", "#34d399", 2.2);
      ctx.setLineDash([]);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "900 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🏖️ HAVUZLU BUNGALOV & TERMAL TATİL KÖYÜ", x + w / 2, y + 78);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 11.5px sans-serif";
      ctx.fillText("Isıtmalı turkuaz yüzme havuzu, Termal SPA ve 6 ayrı kiralık VIP Bungalov!", x + w / 2, y + 106);
      ctx.fillText("Bungalovları tek tek inşa edip gecelik yüksek kiraya ver!", x + w / 2, y + 128);
      MR.rr(ctx, x + w / 2 - 105, y + 150, 210, 42, 11, "#059669", "#fef08a", 2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`TATİL KÖYÜNÜ AÇ — ${RESORT_UNLOCK_COST} ₺`, x + w / 2, y + 176);
      ctx.restore();
      return;
    }

    // 1. Yeni 3D Zümrüt Çim Bahçe & Taş Yürüyüş Yolu Alttan Parlasın!
    MR.rr(ctx, x, y, w, h, 16, "rgba(6, 78, 59, 0.24)", "rgba(52, 211, 153, 0.75)", 2);
    const resHeadG = ctx.createLinearGradient(x + 12, y + 8, x + w - 12, y + 30);
    resHeadG.addColorStop(0, "#065f46");
    resHeadG.addColorStop(1, "#022c22");
    MR.rr(ctx, x + 12, y + 8, w - 24, 22, 7, resHeadG, "#fde047", 1.5);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 10.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `🏖️ TERMAL BUNGALOV TATİL KÖYÜ ${l3.spaUnlocked ? "• ♨️ SPA AKTİF (+%35)" : ""}`,
      x + w / 2,
      y + 23
    );

    // 2. Merkezde Gerçekçi Ahşap Güverteli Turkuaz Yüzme & Termal Havuz!
    const px = x + w / 2 - 56;
    const py = y + 40;
    const pw = 112;
    const ph = 148;
    // Ahşap güneşlenme terası
    MR.rr(ctx, px - 12, py - 6, pw + 24, ph + 12, 14, "#78350f", "#d97706", 1.5);
    // Beyaz mermer havuz kenarı & turkuaz su
    MR.rr(ctx, px, py, pw, ph, 12, "#f8fafc", null);
    const poolG = ctx.createLinearGradient(px, py, px + pw, py + ph);
    poolG.addColorStop(0, "#06b6d4");
    poolG.addColorStop(0.5, "#38bdf8");
    poolG.addColorStop(1, "#0284c7");
    MR.rr(ctx, px + 4, py + 4, pw - 8, ph - 8, 9, poolG, null);

    // Canlı su dalgası parıltıları & Termal SPA buharı & şemsiyeler
    const nowT = Date.now();
    const wave = Math.sin(nowT * 0.004) * 5;
    ctx.strokeStyle = "rgba(255,255,255,0.52)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px + 18, py + 45 + wave);
    ctx.lineTo(px + pw - 18, py + 45 - wave);
    ctx.moveTo(px + 22, py + 98 - wave);
    ctx.lineTo(px + pw - 22, py + 98 + wave);
    ctx.stroke();

    if (l3.spaUnlocked) {
      for (let s = 0; s < 3; s++) {
        const sp = ((nowT * 0.00055) + s * 0.33) % 1;
        ctx.fillStyle = `rgba(224, 242, 254, ${(1 - sp) * 0.35})`;
        ctx.beginPath();
        ctx.arc(px + 26 + s * 30 + Math.sin(sp * 6) * 4, py + 120 - sp * 78, 6 + sp * 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Havuz kenarı gölgeli lüks güneş şemsiyeleri
    [py + 28, py + 118].forEach((uy) => {
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.beginPath();
      ctx.arc(px - 3, uy + 2.5, 8.5, 0, Math.PI * 2);
      ctx.arc(px + pw + 7, uy + 2.5, 8.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(px - 5, uy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(px - 5, uy, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(px + pw + 5, uy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(px + pw + 5, uy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Sol (3 adet) ve Sağ (3 adet) Gerçekçi Üçgen Çatılı Ahşap A-Frame Bungalovlar!
    BUNGALOW_DEFS.forEach((bDef, idx) => {
      const isLeft = idx < 3;
      const row = idx % 3;
      const bx = isLeft ? x + 16 : x + w - 102;
      const by = y + 40 + row * 52;
      const bw = 86;
      const bh = 44;
      const st = l3.bungalows[bDef.key];

      if (!st.owned) {
        ctx.save();
        ctx.setLineDash([4, 3]);
        MR.rr(ctx, bx, by, bw, bh, 8, "rgba(15,23,42,0.72)", "#94a3b8", 1.2);
        ctx.setLineDash([]);
        ctx.fillStyle = "#fde68a";
        ctx.font = "900 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🏷️ SATILIK #${idx + 1}`, bx + bw / 2, by + 18);
        ctx.fillStyle = "#4ade80";
        ctx.fillText(`${bDef.cost} ₺`, bx + bw / 2, by + 33);
        ctx.restore();
        return;
      }

      // Gerçekçi Ahşap Veranda + A-Frame Kiremit/Sedir Çatı + Sıcak Pencere Işığı!
      MR.rr(ctx, bx + 3, by + 4, bw, bh, 8, "rgba(0,0,0,0.45)", null);
      MR.rr(ctx, bx, by, bw, bh, 8, "#92400e", st.rented ? "#4ade80" : "#f59e0b", 1.6);
      // Çatı sırt çizgisi (2.5D üçgen çatı etkisi)
      MR.rr(ctx, bx + 4, by + 4, bw - 22, bh - 8, 5, "#78350f", "#451a03", 1.2);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx + 6, by + bh / 2);
      ctx.lineTo(bx + bw - 20, by + bh / 2);
      ctx.stroke();

      // Sıcak sarı pencere & durum
      MR.rr(ctx, bx + bw - 16, by + 8, 11, bh - 16, 3, st.rented ? "#fde047" : "#334155", null);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 7.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(st.rented ? `✅ KİRADA` : `🔑 BOŞ`, bx + (bw - 18) / 2 + 2, by + bh / 2 + 3);
    });

    // Alt Yönetim Çubuğu
    const counts = getResortCounts(l3);
    const totalRent = getResortTotalRent(l3);
    MR.rr(ctx, x + 16, y + h - 34, w - 32, 25, 8, "#047857", "#fef08a", 1.5);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9.8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `🏡 Kirada Bungalov: ${counts.rented}/6 (+${totalRent} ₺) • Dokun Bungalov Al & Kirala`,
      x + w / 2,
      y + h - 18
    );
  }

  function renderLand3(ctx, W, H, phase, data, MR) {
    if (!data.empire.land3) data.empire.land3 = createDefaultLand3();
    const l3 = data.empire.land3;

    if (baseReady) ctx.drawImage(baseImg, 0, 0, W, H);
    else {
      ctx.fillStyle = "#162030";
      ctx.fillRect(0, 0, W, H);
    }

    bgCars.forEach((hc) => {
      MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", -Math.PI / 2, { nightIntensity: phase.night });
    });

    MR.drawHighwayBillboard(ctx, 255, 76, false);

    if (!l3.owned) {
      MR.rr(ctx, 50, 142, W - 100, 300, 18, "rgba(15, 23, 42, 0.93)", "#a855f7", 2.5);
      ctx.fillStyle = "#fde047";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🎡 3. ARAZİ MEGA HOLDİNG TAPUSU!", W / 2, 186);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 12px sans-serif";
      ctx.fillText("Üç dev yatırım aynı arazide birleşiyor:", W / 2, 216);
      ctx.fillStyle = "#f472b6";
      ctx.fillText("🏎️ Go-Kart Yarış Pisti & 🎡 Işıklı Dönme Dolap", W / 2, 244);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("🏭 Yakıt Rafinerisi (Tankeri 0 ₺ Bedava Yapar!)", W / 2, 268);
      ctx.fillStyle = "#fde047";
      ctx.fillText("🚛 10 Tırlık Kendi Lojistik Sevkiyat Filomuz", W / 2, 292);
      ctx.fillStyle = "#4ade80";
      ctx.fillText("🏖️ Havuzlu 6 VIP Kiralık Bungalov & Termal Köy", W / 2, 316);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("💼 3. Araziden şahsi cüzdanına dev maaş bağla!", W / 2, 342);

      const ok = data.cash >= LAND3_COST;
      MR.rr(ctx, 84, 368, W - 168, 50, 12, ok ? "#7c3aed" : "#475569", "#fef08a", 2.2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px sans-serif";
      ctx.fillText(`3. ARAZİ TAPUSUNU AL — ${LAND3_COST} ₺`, W / 2, 398);
      return;
    }

    drawThemeParkZone(ctx, MR, l3);
    drawResortZone(ctx, MR, l3);
    drawRefineryAndFleetZone(ctx, MR, l3, phase);

    resortGuests.forEach((g) => {
      MR.drawCustomerCharacter(ctx, g.x, g.y, g.shirt, "#18181b", "🏖️", g.phase);
    });

    land3Floats.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.font = "900 13.5px sans-serif";
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

  // =========================================================================
  // 3. ARAZİ YÖNETİM MODALI (#land3Modal)
  // =========================================================================
  function inRect(pt, b) {
    return pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h;
  }

  function openLand3Modal(mode, data, helpers) {
    activeModalMode = mode;
    cachedHelpers = helpers;
    renderLand3Modal(data, helpers);
    const m = document.getElementById("land3Modal");
    if (m) m.classList.remove("hidden");
  }

  function renderLand3Modal(data, helpers) {
    const l3 = data.empire.land3;
    const titleEl = document.getElementById("land3ModalTitle");
    const cashEl = document.getElementById("land3CompanyCash");
    const body = document.getElementById("land3ModalBody");
    if (!body || !titleEl) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash);

    if (activeModalMode === "theme") {
      titleEl.textContent = "🏎️ Go-Kart & 🎡 Lunapark Yönetimi";
      const upCost = getThemeUpgradeCost(l3);
      body.innerHTML = `
        <div class="rep-section" style="margin-bottom:10px;">
          <div class="rep-row"><span>🎟️ Dönemlik Bilet Geliri</span><span class="val-pos">+${getThemeCycleIncome(l3)} ₺</span></div>
          <div class="rep-row"><span>⭐ Tesis Seviyesi</span><span style="color:#fde047; font-weight:900;">Sv.${l3.themeLvl} / 6</span></div>
        </div>
        <div class="upgrade-card">
          <div class="up-info">
            <h3>🏎️ Pist, Go-Kart &amp; Dönme Dolap Büyüt</h3>
            <p>Yeni yarış araçları, VIP tribün ve konser ışıklandırması ekleyerek bilet gelirini +%45 artırır!</p>
          </div>
          <button id="btnUpTheme3" class="up-buy-btn" ${l3.themeLvl >= 6 ? "disabled" : ""}>
            ${l3.themeLvl >= 6 ? "MAKS ✓" : `${upCost} ₺`}
          </button>
        </div>
      `;
      const btn = document.getElementById("btnUpTheme3");
      if (btn && l3.themeLvl < 6) {
        btn.addEventListener("click", () => {
          helpers.payForBusiness(upCost, "Go-Kart & Lunapark Büyütme", () => {
            l3.themeLvl += 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`🎡 Lunapark & Go-Kart Sv.${l3.themeLvl} oldu!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
        });
      }
      return;
    }

    if (activeModalMode === "fleet") {
      titleEl.textContent = "🏭 Yakıt Rafinerisi & 🚛 Tır Filosu";
      const truckCost = getNextTruckCost(l3.fleetCount);
      const fltUpCost = getFleetUpgradeCost(l3.fleetLvl);

      body.innerHTML = `
        <div class="mall-summary-bar">
          <div class="mall-stat-pill">
            <span class="lbl">🛢️ RAFİNERİ</span>
            <span class="val" style="color:${l3.refineryUnlocked ? "#4ade80" : "#94a3b8"};">${l3.refineryUnlocked ? "AKTİF (0₺)" : "Kapalı"}</span>
          </div>
          <div class="mall-stat-pill">
            <span class="lbl">🚛 TIR SAYISI</span>
            <span class="val">${l3.fleetCount} / 10 Tır</span>
          </div>
          <div class="mall-stat-pill">
            <span class="lbl">💰 SEFER BAŞI</span>
            <span class="val" style="color:#4ade80;">+${getTruckTripIncome(l3) + l3.fleetCount * 18} ₺</span>
          </div>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>🛢️ Kendi Akaryakıt Dolum Rafinerimiz</h3>
            <p>1. İstasyondaki <strong>Tanker Yakıt İkmalini %100 BEDAVA (0 ₺)</strong> yapar ve düzenli toptan yakıt geliri (+160 ₺) kazandırır!</p>
          </div>
          <button id="btnBuyRefinery" class="up-buy-btn" ${l3.refineryUnlocked ? "disabled" : ""}>
            ${l3.refineryUnlocked ? "AKTİF ✓" : `${REFINERY_COST} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>🚛 Filoya Yeni Çekici Tır Satın Al (${l3.fleetCount}/10)</h3>
            <p>Otoyoldan şehirlere sevkiyat yapıp her dönüşte yüksek ihracat geliri bırakır!</p>
          </div>
          <button id="btnBuyFleetTruck" class="up-buy-btn" ${l3.fleetCount >= 10 ? "disabled" : ""}>
            ${l3.fleetCount >= 10 ? "10/10 TAM ✓" : `${truckCost} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>📦 Uluslararası Lojistik Kontratları (Sv.${l3.fleetLvl}/5)</h3>
            <p>Tüm tırların sefer başı kazancını +%38 artırır.</p>
          </div>
          <button id="btnUpFleetLvl" class="up-buy-btn" ${l3.fleetLvl >= 5 ? "disabled" : ""}>
            ${l3.fleetLvl >= 5 ? "MAKS ✓" : `${fltUpCost} ₺`}
          </button>
        </div>
      `;

      const refBtn = document.getElementById("btnBuyRefinery");
      if (refBtn && !l3.refineryUnlocked) {
        refBtn.addEventListener("click", () => {
          helpers.payForBusiness(REFINERY_COST, "Akaryakıt Dolum Rafinerisi", () => {
            l3.refineryUnlocked = true;
            helpers.sfx.perfectHit();
            helpers.showToast("🛢️ Yakıt Rafinerisi kuruldu! Artık 1. İstasyonda tanker dolumu tamamen BEDAVA!");
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
        });
      }

      const trkBtn = document.getElementById("btnBuyFleetTruck");
      if (trkBtn && l3.fleetCount < 10) {
        trkBtn.addEventListener("click", () => {
          helpers.payForBusiness(truckCost, `Filo Çekici Tır #${l3.fleetCount + 1}`, () => {
            l3.fleetCount += 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`🚛 Filo Tır #${l3.fleetCount} satın alındı ve sefere hazır!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
        });
      }

      const fltBtn = document.getElementById("btnUpFleetLvl");
      if (fltBtn && l3.fleetLvl < 5) {
        fltBtn.addEventListener("click", () => {
          helpers.payForBusiness(fltUpCost, "Lojistik Kontrat Yükseltme", () => {
            l3.fleetLvl += 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`📦 Lojistik kontratları Sv.${l3.fleetLvl} seviyesine yükseldi!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
        });
      }
      return;
    }

    // resort mode: 6 Bungalov Satın Al & Kiraya Ver + Termal SPA!
    titleEl.textContent = "🏖️ Bungalov & Termal Tatil Köyü";
    const counts = getResortCounts(l3);
    const totalRent = getResortTotalRent(l3);

    let html = `
      <div class="mall-summary-bar">
        <div class="mall-stat-pill">
          <span class="lbl">🏡 BİZİM EV</span>
          <span class="val">${counts.owned} / 6</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">✅ KİRADA</span>
          <span class="val" style="color:#4ade80;">${counts.rented} / 6</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💰 DÖNGÜ KİRA</span>
          <span class="val" style="color:#4ade80;">+${totalRent} ₺</span>
        </div>
      </div>

      <div class="upgrade-card" style="border-color:#38bdf8;">
        <div class="up-info">
          <h3>♨️ Termal SPA &amp; Hamam Merkezi</h3>
          <p>Tüm bungalovların gecelik kirasını kalıcı olarak <strong>+%35</strong> artırır!</p>
        </div>
        <button id="btnBuySpa3" class="up-buy-btn" ${l3.spaUnlocked ? "disabled" : ""}>
          ${l3.spaUnlocked ? "AKTİF ✓" : `${SPA_UNLOCK_COST} ₺`}
        </button>
      </div>
    `;

    BUNGALOW_DEFS.forEach((b) => {
      const st = l3.bungalows[b.key];
      const curRent = getBungalowRent(b, st, l3);
      const upCost = Math.round(b.cost * 0.6 * Math.pow(1.45, st.lvl - 1));
      const cls = st.rented ? "rented" : st.owned ? "owned" : "";

      let actHtml = "";
      if (!st.owned) {
        actHtml = `<div class="shop-btn-row"><button class="shop-action-btn buy-deed" data-b="${b.key}" data-act="buy">🔑 Bungalovu İnşa Et &amp; Tapu Al — ${b.cost} ₺</button></div>`;
      } else if (!st.rented) {
        actHtml = `<div class="shop-btn-row"><button class="shop-action-btn rent-fixed" data-b="${b.key}" data-act="rent">📝 VIP Tatilcilere Kiraya Ver (+${Math.round(b.rent * (l3.spaUnlocked ? 1.35 : 1))} ₺)</button></div>`;
      } else {
        actHtml = `
          <div style="font-size:12.5px; color:#86efac; font-weight:800; margin-top:4px;">🏖️ Gecelik Kira: <strong>+${curRent} ₺ / döngü</strong> (Sv.${st.lvl}/4)</div>
          <div class="shop-btn-row">
            <button class="shop-action-btn up-rent" data-b="${b.key}" data-act="up" ${st.lvl >= 4 ? "disabled" : ""}>
              ${st.lvl >= 4 ? "★ LÜKS PAKET TAMAM" : `⬆️ Özel Jakuzi &amp; Dekor Ekle (${upCost} ₺)`}
            </button>
          </div>
        `;
      }

      html += `
        <div class="mall-shop-card ${cls}">
          <div class="shop-top-row">
            <div class="shop-title">🏡 ${b.name}</div>
            <span class="shop-status-tag ${st.rented ? "tag-rented" : st.owned ? "tag-vacant" : "tag-sale"}">
              ${st.rented ? "KİRADA" : st.owned ? "BOŞ" : "SATILIK"}
            </span>
          </div>
          <div style="font-size:12.5px; color:#cbd5e1;">${b.desc}</div>
          ${actHtml}
        </div>
      `;
    });

    body.innerHTML = html;

    const spaBtn = document.getElementById("btnBuySpa3");
    if (spaBtn && !l3.spaUnlocked) {
      spaBtn.addEventListener("click", () => {
        helpers.payForBusiness(SPA_UNLOCK_COST, "Termal SPA & Hamam Merkezi", () => {
          l3.spaUnlocked = true;
          helpers.sfx.perfectHit();
          helpers.showToast("♨️ Termal SPA açıldı! Tüm bungalov kiraları +%35 arttı!");
          helpers.saveGame();
          helpers.updateHUD();
          renderLand3Modal(data, helpers);
        });
      });
    }

    body.querySelectorAll(".shop-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.b;
        const act = btn.dataset.act;
        const bDef = BUNGALOW_DEFS.find((x) => x.key === key);
        const st = l3.bungalows[key];
        if (!bDef || !st) return;

        if (act === "buy") {
          helpers.payForBusiness(bDef.cost, bDef.name, () => {
            st.owned = true;
            helpers.sfx.perfectHit();
            helpers.showToast(`🏡 ${bDef.name} inşa edildi! Şimdi kiraya verebilirsin!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
          return;
        } else if (act === "rent") {
          st.rented = true;
          helpers.sfx.cashRegister();
          helpers.showToast(`🏖️ ${bDef.name} VIP tatilcilere kiraya verildi!`);
        } else if (act === "up" && st.lvl < 4) {
          const upCost = Math.round(bDef.cost * 0.6 * Math.pow(1.45, st.lvl - 1));
          helpers.payForBusiness(upCost, `${bDef.name} Yükseltme`, () => {
            st.lvl += 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`⬆️ ${bDef.name} lüks seviyesi artırıldı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderLand3Modal(data, helpers);
          });
          return;
        }
        helpers.saveGame();
        helpers.updateHUD();
        renderLand3Modal(data, helpers);
      });
    });
  }

  function handleLand3Click(pt, data, helpers) {
    if (!data.empire.land3) data.empire.land3 = createDefaultLand3();
    const l3 = data.empire.land3;
    cachedHelpers = helpers;

    if (!l3.owned) {
      if (pt.x > 50 && pt.x < 430 && pt.y > 142 && pt.y < 442) {
        helpers.payForBusiness(LAND3_COST, "3. Arazi Tapusu", () => {
          l3.owned = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🎉 3. Arazi tapusunu aldın! Go-Kart, Rafineri/Filo ve Tatil Köyü kurabilirsin!");
          helpers.saveGame();
          helpers.updateHUD();
        });
      }
      return;
    }

    if (inRect(pt, THEME_BOX)) {
      if (!l3.themeUnlocked) {
        helpers.payForBusiness(THEME_UNLOCK_COST, "Go-Kart & Lunapark Kurulumu", () => {
          l3.themeUnlocked = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🏎️ Go-Kart Pisti ve 🎡 Dönme Dolap açıldı!");
          helpers.saveGame();
          helpers.updateHUD();
        });
        return;
      }
      helpers.sfx.tap();
      openLand3Modal("theme", data, helpers);
      return;
    }

    if (inRect(pt, FLEET_BOX)) {
      helpers.sfx.tap();
      openLand3Modal("fleet", data, helpers);
      return;
    }

    if (inRect(pt, RESORT_BOX)) {
      if (!l3.resortUnlocked) {
        helpers.payForBusiness(RESORT_UNLOCK_COST, "Bungalov Tatil Köyü Kurulumu", () => {
          l3.resortUnlocked = true;
          helpers.sfx.perfectHit();
          helpers.showToast("🏖️ Havuzlu Bungalov Tatil Köyü açıldı! Şimdi bungalovları alıp kiraya ver!");
          helpers.saveGame();
          helpers.updateHUD();
          openLand3Modal("resort", data, helpers);
        });
        return;
      }
      helpers.sfx.tap();
      openLand3Modal("resort", data, helpers);
    }
  }

  const closeBtn = document.getElementById("closeLand3ModalBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (cachedHelpers && cachedHelpers.sfx) cachedHelpers.sfx.tap();
      const m = document.getElementById("land3Modal");
      if (m) m.classList.add("hidden");
    });
  }

  return {
    LAND3_COST,
    BUNGALOW_DEFS,
    createDefaultLand3,
    mergeLand3,
    hasAnyLand3Business,
    updateLand3,
    renderLand3,
    handleLand3Click,
    get3DState() {
      return {
        bgCars,
        karts,
        KART_TRACK_PTS,
        wheelAngle,
        activeFleetTrucks,
        resortGuests,
        land3Floats,
        THEME_BOX,
        FLEET_BOX,
        RESORT_BOX
      };
    }
  };
})();

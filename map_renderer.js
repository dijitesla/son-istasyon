// Son İstasyon v7.0 — Gelişmiş 2.5D İzometrik-Kuşbakışı İstasyon Çizim Motoru
// Kutu görünümden çıkarılmış; gölgeli binalar, detaylı araçlar, ağaçlar, ışık hüzmeleri ve partiküller içerir.

window.MapRenderer = (function () {
  function rr(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
  }

  // Çam Ağacı Çizimi (Kenar Peyzajı)
  function drawPineTree(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(3, 4, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    const layers = [
      { r: 14, col: "#064e3b", off: 0 },
      { r: 10, col: "#047857", off: -2 },
      { r: 6, col: "#10b981", off: -4 }
    ];
    layers.forEach((l) => {
      ctx.beginPath();
      ctx.arc(0, l.off, l.r, 0, Math.PI * 2);
      ctx.fillStyle = l.col;
      ctx.fill();
      ctx.strokeStyle = "#022c22";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    ctx.restore();
  }

  // Sokak Lambası ve Sıcak Işık Hüzmesi
  function drawStreetLamp(ctx, x, y) {
    const g = ctx.createRadialGradient(x, y + 12, 2, x, y + 12, 42);
    g.addColorStop(0, "rgba(253, 224, 71, 0.28)");
    g.addColorStop(1, "rgba(253, 224, 71, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y + 12, 42, 0, Math.PI * 2);
    ctx.fill();

    rr(ctx, x - 3, y - 6, 6, 14, 2, "#475569", "#0f172a", 1.5);
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(x, y + 7, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gerçekçi Detaylı Araç Çizimi (Tekerlek, Ayna, Kaput, Cam Parlaması, Far ve Stop Lambası)
  function drawDetailedVehicle(ctx, x, y, color, shape = "sedan", horizontal = false, extra = {}) {
    ctx.save();
    ctx.translate(x, y);
    if (horizontal) ctx.rotate(-Math.PI / 2);

    const isTruck = shape === "truck" || shape === "tanker";
    const isVan = shape === "van" || shape === "ambulance";
    const w = isTruck ? 34 : isVan ? 30 : 26;
    const h = isTruck ? 64 : isVan ? 52 : 46;

    // 1. Ön Far Işık Konisi
    const beam = ctx.createLinearGradient(0, -h / 2, 0, -h / 2 - 36);
    beam.addColorStop(0, "rgba(254, 240, 138, 0.45)");
    beam.addColorStop(1, "rgba(254, 240, 138, 0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 3, -h / 2);
    ctx.lineTo(-w / 2 - 12, -h / 2 - 36);
    ctx.lineTo(w / 2 + 12, -h / 2 - 36);
    ctx.lineTo(w / 2 - 3, -h / 2);
    ctx.closePath();
    ctx.fill();

    // 2. Araç Alt Gölgesi
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 3, -h / 2 + 4, w, h, 8);
    ctx.fill();

    // 3. 4 Tekerlek Çıkıntısı
    ctx.fillStyle = "#090d1a";
    const wheelY1 = -h / 2 + 8;
    const wheelY2 = h / 2 - 15;
    ctx.fillRect(-w / 2 - 2.5, wheelY1, 3, 9);
    ctx.fillRect(w / 2 - 0.5, wheelY1, 3, 9);
    ctx.fillRect(-w / 2 - 2.5, wheelY2, 3, 9);
    ctx.fillRect(w / 2 - 0.5, wheelY2, 3, 9);

    if (shape === "tanker") {
      // Turuncu Kupa + Parlak Metalik Yakıt Tankeri Dorsesi
      rr(ctx, -w / 2 + 1, -h / 2, w - 2, 20, 5, "#ea580c", "#070911", 2);
      rr(ctx, -w / 2 + 4, -h / 2 + 4, w - 8, 8, 2, "#38bdf8", null);
      const tGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      tGrad.addColorStop(0, "#64748b");
      tGrad.addColorStop(0.5, "#f1f5f9");
      tGrad.addColorStop(1, "#475569");
      rr(ctx, -w / 2, -h / 2 + 21, w, h - 21, 9, tGrad, "#070911", 2);
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(-3, -h / 2 + 24, 6, h - 28);
    } else if (shape === "truck") {
      // Çekici Kupa + Dorse
      rr(ctx, -w / 2 + 1, -h / 2, w - 2, 21, 5, color, "#070911", 2);
      rr(ctx, -w / 2 + 4, -h / 2 + 5, w - 8, 8, 2, "#7dd3fc", null);
      rr(ctx, -w / 2, -h / 2 + 22, w, h - 22, 4, "#334155", "#070911", 2);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2 + 4, -h / 2 + 26, w - 8, h - 30);
    } else {
      // Binek / SUV / Ambulans / Polis Gövdesi (Metalik Degrade)
      const bodyGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      bodyGrad.addColorStop(0, color);
      bodyGrad.addColorStop(0.5, "#ffffff33");
      bodyGrad.addColorStop(1, color);
      rr(ctx, -w / 2, -h / 2, w, h, 8, color, "#050811", 2.2);

      // Yan Aynalar
      ctx.fillStyle = color;
      ctx.fillRect(-w / 2 - 3, -h / 2 + 12, 3, 4);
      ctx.fillRect(w / 2, -h / 2 + 12, 3, 4);

      // Ön Cam (Parlak Yansımalı)
      rr(ctx, -w / 2 + 3.5, -h / 2 + 9, w - 7, 10, 3, "#0f172a", null);
      ctx.fillStyle = "rgba(125, 211, 252, 0.65)";
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 5, -h / 2 + 10);
      ctx.lineTo(w / 2 - 8, -h / 2 + 10);
      ctx.lineTo(w / 2 - 12, -h / 2 + 18);
      ctx.lineTo(-w / 2 + 5, -h / 2 + 18);
      ctx.closePath();
      ctx.fill();

      // Tavan & Arka Cam
      rr(ctx, -w / 2 + 4, -h / 2 + 20, w - 8, h - 32, 3, "rgba(255,255,255,0.12)", null);
      if (!isVan) {
        rr(ctx, -w / 2 + 4.5, h / 2 - 12, w - 9, 7, 2, "#1e293b", null);
      }

      // Ambulans Şeridi
      if (shape === "ambulance") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-4, -h / 2 + 23, 8, 3);
        ctx.fillRect(-1.5, -h / 2 + 20.5, 3, 8);
      }

      // Polis Çakar Barı
      if (extra.isPolice) {
        const flash = Math.floor(Date.now() / 110) % 2 === 0;
        rr(ctx, -8, -3, 8, 5, 1.5, flash ? "#ef4444" : "#7f1d1d", null);
        rr(ctx, 0, -3, 8, 5, 1.5, flash ? "#1e3a8a" : "#38bdf8", null);
      }
    }

    // Ön Sarı Farlar & Arka Kırmızı Stoplar
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-w / 2 + 3, -h / 2, 5, 2.5);
    ctx.fillRect(w / 2 - 8, -h / 2, 5, 2.5);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-w / 2 + 3, h / 2 - 2.5, 5, 2.5);
    ctx.fillRect(w / 2 - 8, h / 2 - 2.5, 5, 2.5);

    ctx.restore();
  }

  // 2.5D Derinlikli Pompa Adası Çizimi
  function drawPumpIsland(ctx, p, unlocked, pumpSpeedLvl) {
    const x = p.x;
    const y = p.y;

    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      rr(ctx, x - 35, y - 24, 70, 92, 10, "rgba(15, 23, 42, 0.72)", "#f59e0b", 2);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fde68a";
      ctx.font = "900 10.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔒 ${p.label}`, x, y + 8);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 12px sans-serif";
      ctx.fillText(`${p.unlockCost} ₺`, x, y + 26);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "700 9.5px sans-serif";
      ctx.fillText("(Dokun Kur)", x, y + 41);
      ctx.restore();
      return;
    }

    // Zeminde Neon Yansıma Işığı
    const glow = ctx.createRadialGradient(x, y + 22, 4, x, y + 22, 46);
    glow.addColorStop(0, "rgba(255, 51, 88, 0.22)");
    glow.addColorStop(1, "rgba(255, 51, 88, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y + 22, 46, 0, Math.PI * 2);
    ctx.fill();

    // Sarı-Siyah Park Slotu Çizgileri
    ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.strokeRect(p.carX - 21, p.carY - 30, 42, 60);
    ctx.setLineDash([]);

    // Beton Pompa Adası Tabanı (2.5D Kalınlık)
    rr(ctx, x - 34, y - 8, 68, 16, 5, "#475569", "#0f172a", 2);
    rr(ctx, x - 34, y - 12, 68, 13, 5, "#94a3b8", "#0f172a", 1.8);

    // Pompa Cihazı Gövdesi
    rr(ctx, x - 14, y - 28, 28, 20, 4, "#dc2626", "#070911", 2);
    rr(ctx, x - 9, y - 24, 18, 8, 2, "#fef08a", "#070911", 1.2);

    // Üst 2.5D Kanopi Çatısı (Gölgeli + Neon Şeritli)
    rr(ctx, x - 36, y - 42, 72, 12, 4, "#991b1b", "#070911", 2);
    rr(ctx, x - 36, y - 48, 72, 10, 4, "#1e293b", "#ff3358", 2);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${p.short} ★${pumpSpeedLvl}`, x, y - 40);
  }

  // 2.5D Ana Yakıt Silosu (Sol Üst)
  function drawFuelDepot(ctx, pos, fuelStock, maxCap) {
    const { x, y, w, h } = pos;
    // Sarı tehlike zemini
    rr(ctx, x - w / 2, y - h / 2, w, h, 10, "#172033", "#475569", 2);

    // 3D Silindirik Yakıt Tankı
    const cylGrad = ctx.createLinearGradient(x - 24, 0, x + 24, 0);
    cylGrad.addColorStop(0, "#334155");
    cylGrad.addColorStop(0.45, "#94a3b8");
    cylGrad.addColorStop(1, "#1e293b");
    rr(ctx, x - 24, y - 28, 48, 62, 14, cylGrad, "#090d1a", 2.2);

    // İç Doluluk Cam Penceresi
    const pct = Math.max(0, Math.min(1, fuelStock / maxCap));
    rr(ctx, x - 13, y - 18, 26, 42, 5, "#090d1a", "#cbd5e1", 1.5);
    const fillH = Math.round(38 * pct);
    ctx.fillStyle = pct < 0.2 ? "#ef4444" : pct < 0.45 ? "#f59e0b" : "#22c55e";
    ctx.fillRect(x - 11, y - 16 + (38 - fillH), 22, fillH);

    ctx.fillStyle = "#fde68a";
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ANA DEPO", x, y - 34);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.fillText(`${Math.round(fuelStock)}L`, x, y + 45);
  }

  // 2.5D Detaylı 7/24 Büfe & Market Binası
  function drawMarketBuilding(ctx, m, marketLvl, queueCount, hasCashier) {
    const { x, y, w, h } = m;
    // Bina Gölgesi
    rr(ctx, x + 5, y + 6, w, h, 12, "rgba(0,0,0,0.5)", null);
    // Ana Cephe Duvarı
    rr(ctx, x, y + 20, w, h - 20, 10, "#3b2316", "#090d1a", 2.5);
    // 2.5D Çatı Katmanı + Klima Ünitesi
    rr(ctx, x - 3, y, w + 6, 30, 9, "#1e293b", "#f59e0b", 2.5);
    rr(ctx, x + 12, y + 5, 22, 14, 3, "#64748b", "#090d1a", 1.5);

    // Neon Tabela
    rr(ctx, x + 40, y + 5, w - 50, 18, 4, "#7f1d1d", "#fde047", 1.8);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`7/24 MARKET ★${marketLvl}`, x + 40 + (w - 50) / 2, y + 17.5);

    // Işıklı Cam Vitrinler ve Raflar
    rr(ctx, x + 10, y + 36, 56, 36, 4, "#fef3c7", "#090d1a", 2);
    // Cam içindeki renkli raf çizgileri
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 15, y + 44, 46, 5);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(x + 15, y + 54, 46, 5);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x + 15, y + 63, 46, 5);

    // Çift Kanatlı Giriş Kapısı ve Paspas
    rr(ctx, x + 74, y + 38, 34, 40, 3, "#bae6fd", "#090d1a", 2);
    ctx.beginPath();
    ctx.moveTo(x + 91, y + 38);
    ctx.lineTo(x + 91, y + 78);
    ctx.strokeStyle = "#090d1a";
    ctx.stroke();
    rr(ctx, x + 76, y + 80, 30, 8, 2, "#991b1b", null);

    // Sağ Taraf Kahve Köşesi Camı
    rr(ctx, x + 116, y + 36, 36, 36, 4, "#fde68a", "#090d1a", 2);
    ctx.font = "16px sans-serif";
    ctx.fillText("☕", x + 134, y + 60);

    // Alt Durum veya Satış Balonu
    if (queueCount > 0 && !hasCashier) {
      rr(ctx, x + 14, y + 92, w - 28, 30, 8, "#16a34a", "#fef08a", 2);
      ctx.fillStyle = "#fff";
      ctx.font = "900 11.5px sans-serif";
      ctx.fillText(`☕ SATIŞ YAP (${queueCount})`, x + w / 2, y + 111);
    } else {
      ctx.fillStyle = "#fde68a";
      ctx.font = "800 10.5px sans-serif";
      ctx.fillText(hasCashier ? "👩‍🍳 Zeynep Kasada" : "Büfe Açık", x + w / 2, y + 110);
    }
  }

  // 2.5D Oto Yıkama & Tamirhane Tesisleri
  function drawServiceBay(ctx, box, unlocked, lvl, type = "wash") {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      rr(ctx, x, y, w, h, 12, "rgba(15, 23, 42, 0.72)", type === "wash" ? "#38bdf8" : "#a855f7", 2);
      ctx.setLineDash([]);
      ctx.fillStyle = type === "wash" ? "#bae6fd" : "#e9d5ff";
      ctx.font = "900 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(type === "wash" ? "🔒 🚿 OTO YIKAMA" : "🔒 🔧 TAMİRHANE", x + w / 2, y + 48);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 70);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "700 9.5px sans-serif";
      ctx.fillText("(Dokun İnşa Et)", x + w / 2, y + 88);
      ctx.restore();
      return;
    }

    rr(ctx, x + 4, y + 5, w, h, 11, "rgba(0,0,0,0.45)", null);
    if (type === "wash") {
      rr(ctx, x, y, w, h, 11, "#0c2d48", "#38bdf8", 2.5);
      rr(ctx, x + 4, y + 4, w - 8, 20, 5, "#0284c7", null);
      ctx.fillStyle = "#fff";
      ctx.font = "900 9.8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🚿 YIKAMA ★${lvl}`, x + w / 2, y + 17.5);
      rr(ctx, x + 18, y + 30, w - 36, h - 38, 7, "#071929", "#38bdf8", 1.5);
    } else {
      rr(ctx, x, y, w, h, 11, "#271a38", "#c084fc", 2.5);
      rr(ctx, x + 4, y + 4, w - 8, 20, 5, "#7e22ce", null);
      ctx.fillStyle = "#fff";
      ctx.font = "900 9.8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔧 TAMİR ★${lvl}`, x + w / 2, y + 17.5);
      // Sarı Araç Lifti Rayları
      rr(ctx, x + 18, y + 30, w - 36, h - 38, 7, "#18181b", "#facc15", 1.5);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(x + 24, y + 40, 5, h - 56);
      ctx.fillRect(x + w - 29, y + 40, 5, h - 56);
    }
  }

  // Yürüyen Çalışan Çizimi (Adım Animasyonlu)
  function drawAnimatedWorker(ctx, x, y, bodyCol, hatCol, label, moving = false) {
    ctx.save();
    const bob = moving ? Math.sin(Date.now() * 0.018) * 2.2 : 0;
    ctx.translate(x, y + bob);

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(0, 10 - bob, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    rr(ctx, -8, -4, 16, 14, 5, bodyCol, "#050811", 2);
    ctx.beginPath();
    ctx.arc(0, -10, 6.8, 0, Math.PI * 2);
    ctx.fillStyle = "#fad2b4";
    ctx.fill();
    ctx.strokeStyle = "#050811";
    ctx.lineWidth = 2;
    ctx.stroke();

    rr(ctx, -7, -17, 14, 5, 2, hatCol, "#050811", 1.5);

    rr(ctx, -20, 12, 40, 13, 4, "rgba(9,13,26,0.85)", null);
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fde68a";
    ctx.fillText(label, 0, 21.5);
    ctx.restore();
  }

  return {
    rr,
    drawPineTree,
    drawStreetLamp,
    drawDetailedVehicle,
    drawPumpIsland,
    drawFuelDepot,
    drawMarketBuilding,
    drawServiceBay,
    drawAnimatedWorker
  };
})();

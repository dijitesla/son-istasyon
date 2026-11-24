// Son İstasyon v11.0 — Yeni Nesil 3D Stilize Çizim Motoru
// 9 Pompa (2 VIP) + EV Süper Şarj + Mini Motel + Tır Kantarı + Market + Restoran + Oto Yıkama + Tamirhane!

window.MapRenderer = (function () {
  const groundImg = new Image();
  let groundReady = false;
  groundImg.onload = () => (groundReady = true);
  groundImg.src = "./assets/station-ground.jpg";

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

  function drawGround(ctx, W, H, night = 1) {
    if (groundReady) {
      ctx.drawImage(groundImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#162030";
      ctx.fillRect(0, 0, W, H);
    }
    if (night < 0.2) {
      ctx.fillStyle = "rgba(255, 250, 235, 0.12)";
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawStreetLamp(ctx, x, y, nightIntensity = 1, powerOut = false) {
    if (!powerOut && nightIntensity > 0.15) {
      const g = ctx.createRadialGradient(x, y + 10, 2, x, y + 10, 44);
      g.addColorStop(0, `rgba(254, 240, 138, ${(0.32 * nightIntensity).toFixed(2)})`);
      g.addColorStop(0.5, `rgba(251, 191, 36, ${(0.12 * nightIntensity).toFixed(2)})`);
      g.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y + 10, 44, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 8, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    rr(ctx, x - 2.5, y - 5, 5, 11, 2, "#64748b", "#0f172a", 1.2);
    ctx.fillStyle = powerOut ? "#334155" : nightIntensity > 0.15 ? "#fef9c3" : "#e2e8f0";
    ctx.beginPath();
    ctx.arc(x, y + 5, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHighwayBillboard(ctx, x, y, powerOut = false) {
    ctx.save();
    rr(ctx, x - 52, y - 9, 104, 18, 5, "rgba(0,0,0,0.5)", null);
    rr(ctx, x - 54, y - 11, 108, 18, 5, powerOut ? "#1e293b" : "#991b1b", powerOut ? "#475569" : "#fde047", 1.8);
    if (!powerOut) {
      const glow = ctx.createRadialGradient(x, y, 5, x, y, 54);
      glow.addColorStop(0, "rgba(253, 224, 71, 0.24)");
      glow.addColorStop(1, "rgba(253, 224, 71, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 54, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = powerOut ? "#64748b" : "#fef9c3";
    ctx.font = "900 8.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("★ SON İSTASYON 7/24 ★", x, y + 1);
    ctx.restore();
  }

  // YENİ NESİL PARLAK METALİK 3D ARAÇLAR (+ SLEEK ELEKTRİKLİ EV ARACI!)
  function drawDetailedVehicle(ctx, x, y, color, shape = "sedan", angle = 0, extra = {}) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const isTruck = shape === "truck" || shape === "tanker";
    const isVan = shape === "van" || shape === "ambulance";
    const isSport = shape === "sport" || shape === "ev";
    const w = isTruck ? 25 : isVan ? 23 : 20;
    const h = isTruck ? 48 : isVan ? 40 : isSport ? 38 : 35;
    const night = extra.nightIntensity !== undefined ? extra.nightIntensity : 1;

    // 1. Ön Far Hüzmesi
    if (night > 0.2 || extra.headlightsAlways) {
      const a = Math.max(0.2, 0.46 * night);
      const beamCol = shape === "ev" ? `rgba(125, 211, 252, ${a.toFixed(2)})` : `rgba(254, 249, 195, ${a.toFixed(2)})`;
      const beam = ctx.createLinearGradient(0, -h / 2, 0, -h / 2 - 34);
      beam.addColorStop(0, beamCol);
      beam.addColorStop(1, "rgba(253, 224, 71, 0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 2.5, -h / 2);
      ctx.lineTo(-w / 2 - 10, -h / 2 - 34);
      ctx.lineTo(w / 2 + 10, -h / 2 - 34);
      ctx.lineTo(w / 2 - 2.5, -h / 2);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Yumuşak 3D Zemin Gölgesi
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 2, -h / 2 + 3, w + 3, h + 3, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 1.5, -h / 2 + 2, w, h, 7);
    ctx.fill();

    // 3. Tekerlekler
    ctx.fillStyle = "#090d16";
    const wy1 = -h / 2 + 5;
    const wy2 = h / 2 - 11.5;
    ctx.fillRect(-w / 2 - 1.8, wy1, 2.3, 6.5);
    ctx.fillRect(w / 2 - 0.5, wy1, 2.3, 6.5);
    ctx.fillRect(-w / 2 - 1.8, wy2, 2.3, 6.5);
    ctx.fillRect(w / 2 - 0.5, wy2, 2.3, 6.5);

    if (shape === "tanker") {
      rr(ctx, -w / 2 + 1, -h / 2, w - 2, 14, 4, "#ea580c", "#0f172a", 1.4);
      rr(ctx, -w / 2 + 3.5, -h / 2 + 3, w - 7, 5, 2, "#38bdf8", null);
      const tGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      tGrad.addColorStop(0, "#475569");
      tGrad.addColorStop(0.35, "#e2e8f0");
      tGrad.addColorStop(0.55, "#ffffff");
      tGrad.addColorStop(1, "#334155");
      rr(ctx, -w / 2, -h / 2 + 15, w, h - 15, 7.5, tGrad, "#0f172a", 1.4);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(-1.8, -h / 2 + 18, 3.6, h - 21);
    } else if (shape === "truck") {
      rr(ctx, -w / 2 + 1, -h / 2, w - 2, 15, 4, color, "#0f172a", 1.4);
      rr(ctx, -w / 2 + 3.5, -h / 2 + 3.5, w - 7, 5.5, 2, "#7dd3fc", null);
      const dGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      dGrad.addColorStop(0, "#334155");
      dGrad.addColorStop(0.5, "#64748b");
      dGrad.addColorStop(1, "#1e293b");
      rr(ctx, -w / 2, -h / 2 + 16, w, h - 16, 3.5, dGrad, "#0f172a", 1.4);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      for (let yy = -h / 2 + 21; yy < h / 2 - 4; yy += 6) {
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 3, yy);
        ctx.lineTo(w / 2 - 3, yy);
        ctx.stroke();
      }
    } else {
      rr(ctx, -w / 2, -h / 2, w, h, isSport ? 9 : 6, color, "#090d16", 1.5);
      const gloss = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      gloss.addColorStop(0, "rgba(255,255,255,0.34)");
      gloss.addColorStop(0.45, "rgba(255,255,255,0.06)");
      gloss.addColorStop(1, "rgba(0,0,0,0.28)");
      rr(ctx, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, isSport ? 8 : 5, gloss, null);

      ctx.fillStyle = color;
      ctx.fillRect(-w / 2 - 1.8, -h / 2 + 9, 1.8, 3);
      ctx.fillRect(w / 2, -h / 2 + 9, 1.8, 3);

      // Ön Cam
      rr(ctx, -w / 2 + 2.6, -h / 2 + 6.5, w - 5.2, 7.5, 2.5, "#0f172a", null);
      ctx.fillStyle = "rgba(186, 230, 253, 0.72)";
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 3.8, -h / 2 + 7.5);
      ctx.lineTo(w / 2 - 5, -h / 2 + 7.5);
      ctx.lineTo(w / 2 - 9, -h / 2 + 13);
      ctx.lineTo(-w / 2 + 3.8, -h / 2 + 13);
      ctx.closePath();
      ctx.fill();

      // Panoramik EV Cam Tavanı veya Standart Tavan
      if (shape === "ev") {
        rr(ctx, -w / 2 + 3.2, -h / 2 + 14.5, w - 6.4, h - 22, 3, "#0c4a6e", "#38bdf8", 0.9);
      } else {
        rr(ctx, -w / 2 + 3.2, -h / 2 + 14.5, w - 6.4, h - 24, 2.5, "rgba(255,255,255,0.18)", null);
        if (!isVan) rr(ctx, -w / 2 + 3.6, h / 2 - 9, w - 7.2, 5, 1.8, "#1e293b", null);
      }

      if (shape === "sport") {
        ctx.fillStyle = "rgba(255,255,255,0.34)";
        ctx.fillRect(-1.4, -h / 2 + 1, 2.8, h - 2);
      }
      if (shape === "taxi") {
        rr(ctx, -4.2, -1.5, 8.4, 3.2, 1.4, "#111827", "#fde047", 1);
      }
      if (shape === "ambulance") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-3.2, -h / 2 + 17, 6.4, 2.2);
        ctx.fillRect(-1.1, -h / 2 + 15, 2.2, 6.4);
      }
      if (extra.isPolice) {
        const flash = Math.floor(Date.now() / 110) % 2 === 0;
        rr(ctx, -6.5, -2.5, 6.5, 4, 1.4, flash ? "#ef4444" : "#7f1d1d", null);
        rr(ctx, 0, -2.5, 6.5, 4, 1.4, flash ? "#1e3a8a" : "#38bdf8", null);
      }
    }

    // Farlar (EV'lerde şık tam boy mavi LED bar!)
    if (shape === "ev") {
      ctx.fillStyle = "#7dd3fc";
      ctx.fillRect(-w / 2 + 2, -h / 2, w - 4, 2.2);
    } else {
      ctx.fillStyle = "#fef9c3";
      ctx.fillRect(-w / 2 + 2, -h / 2, 3.6, 2);
      ctx.fillRect(w / 2 - 5.6, -h / 2, 3.6, 2);
    }
    ctx.fillStyle = "#ff4458";
    ctx.fillRect(-w / 2 + 2, h / 2 - 2, 3.6, 2);
    ctx.fillRect(w / 2 - 5.6, h / 2 - 2, 3.6, 2);

    ctx.restore();
  }

  // 3D Pompa Adası
  function drawPumpIsland(ctx, p, unlocked, pumpSpeedLvl, powerOut = false) {
    const x = p.x;
    const y = p.y;
    const isVip = !!p.isVip;

    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      rr(ctx, x - 24, y - 18, 48, 70, 9, "rgba(15, 23, 42, 0.72)", isVip ? "#facc15" : "rgba(245, 158, 11, 0.85)", 1.5);
      ctx.setLineDash([]);
      ctx.fillStyle = isVip ? "#fef08a" : "#fde68a";
      ctx.font = "900 7.8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔒 ${p.shortLabel}`, x, y + 3);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 9.8px sans-serif";
      ctx.fillText(`${p.unlockCost}₺`, x, y + 18);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 7.2px sans-serif";
      ctx.fillText("(Dokun Kur)", x, y + 31);
      ctx.restore();
      return;
    }

    if (!powerOut) {
      const glow = ctx.createRadialGradient(x, y + 16, 4, x, y + 16, 34);
      glow.addColorStop(0, isVip ? "rgba(250, 204, 21, 0.28)" : "rgba(56, 189, 248, 0.18)");
      glow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y + 16, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = isVip ? "rgba(250, 204, 21, 0.7)" : "rgba(226, 232, 240, 0.36)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(p.carX - 15, p.carY - 21, 30, 42);
    ctx.setLineDash([]);

    rr(ctx, x - 23, y - 5, 46, 12, 4.5, "rgba(0,0,0,0.42)", null);
    rr(ctx, x - 24, y - 8, 48, 10, 4, "#64748b", "#0f172a", 1.3);
    rr(ctx, x - 23, y - 10, 46, 7, 3.5, "#cbd5e1", null);

    const bodyGrad = ctx.createLinearGradient(x - 9, y - 22, x + 9, y - 8);
    bodyGrad.addColorStop(0, isVip ? "#eab308" : "#ef4444");
    bodyGrad.addColorStop(1, isVip ? "#a16207" : "#991b1b");
    rr(ctx, x - 9, y - 22, 18, 14, 3, bodyGrad, "#0f172a", 1.4);
    rr(ctx, x - 6, y - 19, 12, 5.5, 1.5, powerOut ? "#334155" : "#e0f2fe", "#0f172a", 1);

    rr(ctx, x - 25, y - 32, 50, 11, 4, "rgba(0,0,0,0.45)", null);
    const roofGrad = ctx.createLinearGradient(x, y - 38, x, y - 25);
    roofGrad.addColorStop(0, isVip ? "#fef08a" : "#334155");
    roofGrad.addColorStop(0.4, isVip ? "#ca8a04" : "#1e293b");
    roofGrad.addColorStop(1, isVip ? "#713f12" : "#0f172a");
    rr(ctx, x - 26, y - 38, 52, 12, 4, roofGrad, powerOut ? "#475569" : isVip ? "#fde047" : "#fb7185", 1.6);

    ctx.fillStyle = isVip ? "#0f172a" : "#ffffff";
    ctx.font = "900 7.6px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${p.short} ★${pumpSpeedLvl}`, x, y - 30);
  }

  // 3D Yakıt Silosu
  function drawFuelDepot(ctx, pos, fuelStock, maxCap) {
    const { x, y, w, h } = pos;
    rr(ctx, x - w / 2 + 2, y - h / 2 + 3, w, h, 8, "rgba(0,0,0,0.42)", null);
    rr(ctx, x - w / 2, y - h / 2, w, h, 8, "rgba(15, 23, 42, 0.88)", "#64748b", 1.5);

    const cylGrad = ctx.createLinearGradient(x - 12, 0, x + 12, 0);
    cylGrad.addColorStop(0, "#334155");
    cylGrad.addColorStop(0.35, "#e2e8f0");
    cylGrad.addColorStop(0.65, "#94a3b8");
    cylGrad.addColorStop(1, "#1e293b");
    rr(ctx, x - 12, y - 20, 24, 44, 8, cylGrad, "#090d1a", 1.4);

    const pct = Math.max(0, Math.min(1, fuelStock / maxCap));
    rr(ctx, x - 6.5, y - 13, 13, 30, 3, "#090d1a", "#e2e8f0", 1);
    const fillH = Math.round(26 * pct);
    ctx.fillStyle = pct < 0.2 ? "#ef4444" : pct < 0.45 ? "#f59e0b" : "#22c55e";
    ctx.fillRect(x - 5, y - 11 + (26 - fillH), 10, fillH);

    ctx.fillStyle = "#fde68a";
    ctx.font = "900 6.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DEPO", x, y - 26);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 7.6px sans-serif";
    ctx.fillText(`${Math.round(fuelStock)}L`, x, y + 34);
  }

  // YENİ BİNÂ 1: ⚡ ELEKTRİKLİ ARAÇ HIZLI ŞARJ İSTASYONU (EV SÜPER ŞARJ)
  function drawEvChargerBay(ctx, box, unlocked, lvl, powerOut = false) {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      rr(ctx, x, y, w, h, 9, "rgba(15, 23, 42, 0.78)", "#22d3ee", 1.8);
      ctx.setLineDash([]);
      ctx.fillStyle = "#a5f3fc";
      ctx.font = "900 8.2px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 ⚡ EV ŞARJ", x + w / 2, y + 34);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 11px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 51);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 7.5px sans-serif";
      ctx.fillText("Yakıt Harcamaz!", x + w / 2, y + 66);
      ctx.fillText("(Dokun Kur)", x + w / 2, y + 78);
      ctx.restore();
      return;
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.45)", null);
    rr(ctx, x, y, w, h, 9, "#082f49", powerOut ? "#475569" : "#22d3ee", 2);
    // Üst Parlak Mavi LED Başlık
    rr(ctx, x + 4, y + 4, w - 8, 17, 4.5, powerOut ? "#1e293b" : "#0891b2", null);
    ctx.fillStyle = "#ecfeff";
    ctx.font = "900 7.8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`⚡ EV ŞARJ ★${lvl}`, x + w / 2, y + 15.2);

    // Park Slotu & Şarj Ünitesi
    rr(ctx, x + 12, y + 25, w - 24, h - 32, 6, "#061b2c", "#06b6d4", 1.3);
    // Sol tarafta dikey Süper Şarj Kulesi
    rr(ctx, x + 15, y + 34, 10, 26, 3, "#e0f2fe", "#0284c7", 1.2);
    ctx.fillStyle = powerOut ? "#475569" : "#22d3ee";
    ctx.fillRect(x + 17.5, y + 39, 5, 14);
  }

  // YENİ BİNÂ 2: 🚛 TIR KANTAR & DİNLENME PARKI
  function drawTruckScaleBay(ctx, box, unlocked, lvl, weightText = "") {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      rr(ctx, x, y, w, h, 9, "rgba(15, 23, 42, 0.78)", "#eab308", 1.8);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🚛 TIR KANTARI", x + w / 2, y + 34);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 11px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 51);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 7.5px sans-serif";
      ctx.fillText("Tartım + Park", x + w / 2, y + 66);
      ctx.fillText("(Dokun Kur)", x + w / 2, y + 78);
      ctx.restore();
      return;
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.45)", null);
    rr(ctx, x, y, w, h, 9, "#1c1917", "#eab308", 2);
    rr(ctx, x + 4, y + 4, w - 8, 17, 4.5, "#a16207", null);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 7.6px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`⚖️ KANTAR ★${lvl}`, x + w / 2, y + 15.2);

    // Kantar Platformu (Sarı-Siyah Çizgili Metal Baskül)
    rr(ctx, x + 12, y + 25, w - 24, h - 32, 6, "#292524", "#facc15", 1.4);
    ctx.fillStyle = "rgba(250, 204, 21, 0.25)";
    for (let yy = y + 31; yy < y + h - 14; yy += 10) {
      ctx.fillRect(x + 16, yy, w - 32, 3);
    }

    if (weightText) {
      rr(ctx, x + 14, y + h - 22, w - 28, 14, 3, "#090d1a", "#4ade80", 1);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 7.5px monospace";
      ctx.fillText(weightText, x + w / 2, y + h - 12);
    }
  }

  // YENİ BİNÂ 3: 🏨 YOL ÜSTÜ MİNİ MOTEL (Konaklama Odaları!)
  function drawMotelBuilding(ctx, box, unlocked, lvl, activeRooms, maxRooms, waitingCount, hasReception, powerOut = false) {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      rr(ctx, x, y, w, h, 9, "rgba(15, 23, 42, 0.78)", "#ec4899", 1.8);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fbcfe8";
      ctx.font = "900 8.8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🏨 MİNİ MOTEL", x + w / 2, y + 38);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 11.5px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 56);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 8px sans-serif";
      ctx.fillText("Yüksek Oda Geliri", x + w / 2, y + 72);
      ctx.fillText("(Dokun İnşa Et)", x + w / 2, y + 85);
      ctx.restore();
      return;
    }

    if (!powerOut) {
      const spill = ctx.createLinearGradient(x, y - 10, x, y + 4);
      spill.addColorStop(0, "rgba(244, 114, 182, 0)");
      spill.addColorStop(1, "rgba(244, 114, 182, 0.22)");
      ctx.fillStyle = spill;
      ctx.fillRect(x + 8, y - 10, w - 16, 12);
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.48)", null);
    rr(ctx, x, y + 16, w, h - 16, 8, "#31102f", "#0f172a", 2);
    // Şık Mor/Pembe Neon Çatı
    rr(ctx, x - 2, y, w + 4, 24, 7, "#4c1d95", powerOut ? "#64748b" : "#f472b6", 2);
    rr(ctx, x + 6, y + 4, w - 12, 15, 4, powerOut ? "#1e293b" : "#831843", powerOut ? "#64748b" : "#fbcfe8", 1.4);
    ctx.fillStyle = powerOut ? "#94a3b8" : "#fdf2f8";
    ctx.font = "900 7.8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🏨 MOTEL ★${lvl} (${activeRooms}/${maxRooms})`, x + w / 2, y + 14.2);

    // 4 Oda Penceresi (Dolu odalar sıcak sarı ışıkla parlar!)
    const winW = 22;
    const gap = 6;
    const startX = x + (w - (maxRooms * winW + (maxRooms - 1) * gap)) / 2;
    for (let i = 0; i < maxRooms; i++) {
      const lit = !powerOut && i < activeRooms;
      rr(ctx, startX + i * (winW + gap), y + 31, winW, 24, 3.5, lit ? "#fde047" : "#1e1b4b", "#0f172a", 1.4);
      ctx.font = "11px sans-serif";
      ctx.fillText(lit ? "🛏️" : "🌙", startX + i * (winW + gap) + winW / 2, y + 47);
    }

    if (waitingCount > 0 && !hasReception) {
      rr(ctx, x + 7, y + 66, w - 14, 32, 7, "#db2777", "#fef08a", 1.8);
      ctx.fillStyle = "#fff";
      ctx.font = "900 8.5px sans-serif";
      ctx.fillText(`🔑 ODA VER (${waitingCount})`, x + w / 2, y + 85);
    } else {
      ctx.fillStyle = "#fbcfe8";
      ctx.font = "800 8.5px sans-serif";
      ctx.fillText(
        hasReception
          ? `👩‍💼 Selin Aktif (${activeRooms} Dolu)`
          : activeRooms > 0
            ? `💤 ${activeRooms} Oda Konaklıyor`
            : "Odalar Hazır",
        x + w / 2,
        y + 84
      );
    }
  }

  // 7/24 Market Binası (Kompakt & Şık Alt Meydan Boyutu)
  function drawMarketBuilding(ctx, m, marketLvl, queueCount, hasCashier, powerOut = false, opts = {}) {
    const { x, y, w, h } = m;

    if (!powerOut) {
      const spill = ctx.createLinearGradient(x, y - 10, x, y + 4);
      spill.addColorStop(0, "rgba(253, 224, 71, 0)");
      spill.addColorStop(1, "rgba(253, 224, 71, 0.2)");
      ctx.fillStyle = spill;
      ctx.fillRect(x + 8, y - 10, w - 16, 12);
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.48)", null);
    rr(ctx, x, y + 16, w, h - 16, 8, "#3b2114", "#0f172a", 2);
    rr(ctx, x - 2, y, w + 4, 24, 7, "#1e293b", powerOut ? "#ef4444" : "#f59e0b", 2);

    if (opts.solarInstalled) {
      rr(ctx, x + 3, y + 3, 18, 17, 2, "#0284c7", "#7dd3fc", 1.1);
      ctx.strokeStyle = "#e0f2fe";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x + 12, y + 3);
      ctx.lineTo(x + 12, y + 20);
      ctx.moveTo(x + 3, y + 11.5);
      ctx.lineTo(x + 21, y + 11.5);
      ctx.stroke();
    }

    const sx = opts.solarInstalled ? x + 23 : x + 6;
    const sw = opts.solarInstalled ? w - 29 : w - 12;
    rr(ctx, sx, y + 4, sw, 15, 4, powerOut ? "#1e293b" : "#991b1b", powerOut ? "#64748b" : "#fde047", 1.4);
    ctx.fillStyle = powerOut ? "#94a3b8" : "#fef9c3";
    ctx.font = "900 7.8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`MARKET ★${marketLvl}`, sx + sw / 2, y + 14.2);

    if (opts.camerasInstalled) {
      const blink = Math.floor(Date.now() / 480) % 2 === 0;
      rr(ctx, x + w - 11, y - 4, 9, 5.5, 2, "#f1f5f9", "#0f172a", 1);
      ctx.fillStyle = blink ? "#ef4444" : "#7f1d1d";
      ctx.beginPath();
      ctx.arc(x + w - 4, y - 1.2, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    rr(ctx, x + 8, y + 29, 44, 28, 3.5, powerOut ? "#334155" : "#fef3c7", "#0f172a", 1.5);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 12, y + 35, 36, 3.5);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(x + 12, y + 42, 36, 3.5);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x + 12, y + 49, 36, 3.5);

    rr(ctx, x + 56, y + 30, 26, 28, 3, powerOut ? "#475569" : "#bae6fd", "#0f172a", 1.5);
    rr(ctx, x + 86, y + 29, 28, 28, 3.5, powerOut ? "#334155" : "#fde68a", "#0f172a", 1.5);
    ctx.font = "12px sans-serif";
    ctx.fillText("☕", x + 100, y + 47);

    if (powerOut) {
      const pulse = Math.floor(Date.now() / 320) % 2 === 0;
      rr(ctx, x + 7, y + 66, w - 14, 32, 7, pulse ? "#dc2626" : "#991b1b", "#fde047", 1.8);
      ctx.fillStyle = "#fff";
      ctx.font = "900 8.5px sans-serif";
      ctx.fillText("⚡ SİGORTAYI AÇ!", x + w / 2, y + 85);
    } else if (queueCount > 0 && !hasCashier) {
      rr(ctx, x + 7, y + 66, w - 14, 32, 7, "#16a34a", "#fef08a", 1.8);
      ctx.fillStyle = "#fff";
      ctx.font = "900 9px sans-serif";
      ctx.fillText(`☕ SATIŞ (${queueCount})`, x + w / 2, y + 85);
    } else {
      ctx.fillStyle = "#fde68a";
      ctx.font = "800 8.8px sans-serif";
      ctx.fillText(hasCashier ? "👩‍🍳 Zeynep Aktif" : "7/24 Büfe Açık", x + w / 2, y + 84);
    }
  }

  // 10 Çeşit Yemekli Yol Restoranı
  function drawRestaurantBuilding(ctx, box, unlocked, lvl, queueList, hasChef, powerOut = false) {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      rr(ctx, x, y, w, h, 9, "rgba(15, 23, 42, 0.78)", "#fb923c", 1.8);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fed7aa";
      ctx.font = "900 8.8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔒 🍽️ RESTORAN", x + w / 2, y + 38);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 11.5px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 56);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 8px sans-serif";
      ctx.fillText("10 Çeşit Yemek", x + w / 2, y + 72);
      ctx.fillText("(Dokun İnşa Et)", x + w / 2, y + 85);
      ctx.restore();
      return;
    }

    if (!powerOut) {
      const spill = ctx.createLinearGradient(x, y - 10, x, y + 4);
      spill.addColorStop(0, "rgba(251, 146, 60, 0)");
      spill.addColorStop(1, "rgba(251, 146, 60, 0.22)");
      ctx.fillStyle = spill;
      ctx.fillRect(x + 8, y - 10, w - 16, 12);
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.48)", null);
    rr(ctx, x, y + 16, w, h - 16, 8, "#431407", "#0f172a", 2);
    rr(ctx, x - 2, y, w + 4, 24, 7, "#7c2d12", powerOut ? "#64748b" : "#fb923c", 2);
    for (let sx = x + 4; sx < x + w - 8; sx += 12) {
      ctx.fillStyle = Math.floor(sx / 12) % 2 === 0 ? "#dc2626" : "#fef3c7";
      ctx.fillRect(sx, y + 22, 6, 4.5);
    }

    rr(ctx, x + 6, y + 4, w - 12, 15, 4, powerOut ? "#1e293b" : "#9a3412", powerOut ? "#64748b" : "#fde047", 1.4);
    ctx.fillStyle = powerOut ? "#94a3b8" : "#fef9c3";
    ctx.font = "900 7.8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🍽️ RESTORAN ★${lvl}`, x + w / 2, y + 14.2);

    rr(ctx, x + 8, y + 30, 48, 27, 3.5, powerOut ? "#334155" : "#ffedd5", "#0f172a", 1.5);
    ctx.fillStyle = "#9a3412";
    ctx.beginPath();
    ctx.arc(x + 21, y + 43, 5, 0, Math.PI * 2);
    ctx.arc(x + 42, y + 43, 5, 0, Math.PI * 2);
    ctx.fill();

    rr(ctx, x + 60, y + 30, 24, 27, 3, powerOut ? "#475569" : "#fed7aa", "#0f172a", 1.5);
    rr(ctx, x + 88, y + 30, 28, 27, 3.5, powerOut ? "#334155" : "#fde68a", "#0f172a", 1.5);
    ctx.font = "12px sans-serif";
    ctx.fillText("🍲", x + 102, y + 47);

    if (queueList && queueList.length > 0 && !hasChef) {
      const nextDish = queueList[0];
      rr(ctx, x + 6, y + 63, w - 12, 38, 7, "#ea580c", "#fef08a", 1.8);
      ctx.fillStyle = "#fff";
      ctx.font = "900 8.5px sans-serif";
      ctx.fillText(`🍽️ SERVİS (${queueList.length})`, x + w / 2, y + 77);
      ctx.fillStyle = "#fef08a";
      ctx.font = "800 7.6px sans-serif";
      ctx.fillText(`${nextDish.emoji} ${nextDish.short} ${nextDish.price}₺`, x + w / 2, y + 92);
    } else if (queueList && queueList.length > 0 && hasChef) {
      const nextDish = queueList[0];
      ctx.fillStyle = "#fed7aa";
      ctx.font = "900 8px sans-serif";
      ctx.fillText(`👨‍🍳 ${nextDish.emoji} ${nextDish.short}`, x + w / 2, y + 77);
      ctx.fillStyle = "#4ade80";
      ctx.font = "800 8px sans-serif";
      ctx.fillText(`Hazırlanıyor (${queueList.length})`, x + w / 2, y + 91);
    } else {
      ctx.fillStyle = "#fed7aa";
      ctx.font = "800 8.6px sans-serif";
      ctx.fillText(hasChef ? "👨‍🍳 Mehmet Hazır" : "10 Çeşit Sıcak", x + w / 2, y + 84);
    }
  }

  // Oto Yıkama & Tamirhane
  function drawServiceBay(ctx, box, unlocked, lvl, type = "wash") {
    const { x, y, w, h } = box;
    if (!unlocked) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      rr(ctx, x, y, w, h, 9, "rgba(15, 23, 42, 0.78)", type === "wash" ? "#38bdf8" : "#a855f7", 1.8);
      ctx.setLineDash([]);
      ctx.fillStyle = type === "wash" ? "#bae6fd" : "#e9d5ff";
      ctx.font = "900 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(type === "wash" ? "🔒 OTO YIKAMA" : "🔒 TAMİRHANE", x + w / 2, y + 36);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 11px sans-serif";
      ctx.fillText(`${box.unlockCost} ₺`, x + w / 2, y + 53);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 7.5px sans-serif";
      ctx.fillText("(Dokun Kur)", x + w / 2, y + 70);
      ctx.restore();
      return;
    }

    rr(ctx, x + 3, y + 4, w, h, 9, "rgba(0,0,0,0.45)", null);
    if (type === "wash") {
      rr(ctx, x, y, w, h, 9, "#0c2d48", "#38bdf8", 2);
      rr(ctx, x + 4, y + 4, w - 8, 17, 4.5, "#0284c7", null);
      ctx.fillStyle = "#fff";
      ctx.font = "900 7.6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🚿 YIKAMA ★${lvl}`, x + w / 2, y + 15.2);
      rr(ctx, x + 12, y + 25, w - 24, h - 32, 6, "#071929", "#38bdf8", 1.3);
      ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
      ctx.beginPath();
      ctx.arc(x + 20, y + 56, 7, 0, Math.PI * 2);
      ctx.arc(x + w - 20, y + 56, 7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      rr(ctx, x, y, w, h, 9, "#271a38", "#c084fc", 2);
      rr(ctx, x + 4, y + 4, w - 8, 17, 4.5, "#7e22ce", null);
      ctx.fillStyle = "#fff";
      ctx.font = "900 7.6px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🔧 TAMİR ★${lvl}`, x + w / 2, y + 15.2);
      rr(ctx, x + 12, y + 25, w - 24, h - 32, 6, "#18181b", "#facc15", 1.3);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(x + 17, y + 33, 3.8, h - 46);
      ctx.fillRect(x + w - 20.8, y + 33, 3.8, h - 46);
    }
  }

  function drawAnimatedWorker(ctx, x, y, bodyCol, hatCol, label, moving = false) {
    ctx.save();
    const bob = moving ? Math.sin(Date.now() * 0.018) * 2.1 : 0;
    ctx.translate(x, y + bob);

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(0, 9 - bob, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const step = moving ? Math.sin(Date.now() * 0.018) * 2.4 : 0;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-4.2, 6, 3.2, 3.8 + step);
    ctx.fillRect(1, 6, 3.2, 3.8 - step);

    rr(ctx, -7, -4, 14, 12, 4.5, bodyCol, "#050811", 1.6);
    ctx.beginPath();
    ctx.arc(0, -9, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fad2b4";
    ctx.fill();
    ctx.strokeStyle = "#050811";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    rr(ctx, -6.2, -15.5, 12.4, 4.2, 2, hatCol, "#050811", 1.2);

    rr(ctx, -17, 11, 34, 11.5, 4, "rgba(9,13,26,0.88)", null);
    ctx.font = "900 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fde68a";
    ctx.fillText(label, 0, 19);
    ctx.restore();
  }

  function drawCustomerCharacter(ctx, x, y, shirtCol, hairCol, icon = "", phase = 0) {
    ctx.save();
    const t = Date.now() * 0.016 + phase;
    const bob = Math.sin(t) * 1.8;
    const step = Math.sin(t) * 2.3;
    ctx.translate(x, y + bob);

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.beginPath();
    ctx.ellipse(0, 8 - bob, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-3.6, 5, 2.8, 3.5 + step * 0.6);
    ctx.fillRect(0.8, 5, 2.8, 3.5 - step * 0.6);

    rr(ctx, -6, -3.5, 12, 10, 4, shirtCol, "#050811", 1.4);
    ctx.beginPath();
    ctx.arc(0, -7.8, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fad2b4";
    ctx.fill();
    ctx.strokeStyle = "#050811";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -9.2, 5, Math.PI, Math.PI * 2);
    ctx.fillStyle = hairCol;
    ctx.fill();

    if (icon) {
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(icon, 0, -15.5);
    }
    ctx.restore();
  }

  return {
    rr,
    drawGround,
    drawStreetLamp,
    drawHighwayBillboard,
    drawDetailedVehicle,
    drawPumpIsland,
    drawFuelDepot,
    drawEvChargerBay,
    drawTruckScaleBay,
    drawMotelBuilding,
    drawMarketBuilding,
    drawRestaurantBuilding,
    drawServiceBay,
    drawAnimatedWorker,
    drawCustomerCharacter
  };
})();

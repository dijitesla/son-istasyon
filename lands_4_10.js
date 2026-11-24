// Son İstasyon v15.0 — 4'ten 10'a Kadar Satın Alınabilir Yeni Araziler (Toplam 10 Arazi Sistemi!)
// Her yeni arazide 6 Dev Proje Seçeneği (5 Yıldızlı Grand Otel, Özel Hastane, Otomobil Fabrikası, Stadyum, Teknokent, Kongre Sarayı)
// Önce Patron Manuel İlgilenir (Kayıt Açma & Oda/Birim Hazırlama), Geliştirdikçe Eleman ve Genel Müdür İşe Alınır!

window.ExtraLandsSystem = (function () {
  const baseImg = new Image();
  let baseReady = false;
  baseImg.onload = () => (baseReady = true);
  baseImg.src = "./assets/extra-ground.jpg";

  // 4. ARAZİDEN 10. ARAZİYE KADAR 7 YENİ YATIRIM ARSASI (Pahalı ve Prestijli Para Eritme Hedefleri!)
  const EXTRA_LANDS = [
    { id: "land4", num: 4, name: "4. Arazi — Kuzey Kavşağı", deedCost: 45000, mult: 1.0, desc: "Otoyol ana kavşağında otel ve dev tesisler için altın değerinde arsa." },
    { id: "land5", num: 5, name: "5. Arazi — Vadi Yamacı", deedCost: 85000, mult: 1.22, desc: "Panoramik manzaralı yüksek gelir çarpanlı (+%22) yatırım arsası." },
    { id: "land6", num: 6, name: "6. Arazi — Sahil Bulvarı", deedCost: 150000, mult: 1.48, desc: "Deniz manzaralı turizm ve ticaret kuşağı (+%48 gelir bonusu)." },
    { id: "land7", num: 7, name: "7. Arazi — Sanayi Çıkışı", deedCost: 260000, mult: 1.78, desc: "Yoğun iş ve filo trafiğinin kalbinde dev parsel (+%78 gelir bonusu)." },
    { id: "land8", num: 8, name: "8. Arazi — Boğaz Tepesi", deedCost: 420000, mult: 2.15, desc: "VIP müşterilerin uğrak noktası prestij arazisi (x2.15 gelir)." },
    { id: "land9", num: 9, name: "9. Arazi — Havalimanı Yolu", deedCost: 680000, mult: 2.6, desc: "Uluslararası yolcu akışının tam üstünde mega arsa (x2.6 gelir)." },
    { id: "land10", num: 10, name: "10. Arazi — Altın Körfez VIP", deedCost: 1100000, mult: 3.2, desc: "İmparatorluğun zirvesi! En yüksek kazanç çarpanlı efsane parsel (x3.2 gelir)!" }
  ];

  // HER ARAZİYE KURULABİLECEK 6 FARKLI DEV PROJE SEÇENEĞİ!
  const PROJECT_TYPES = [
    {
      key: "hotel",
      name: "5 Yıldızlı Grand Otel",
      emoji: "🏨",
      buildCost: 65000,
      basePay: 420,
      color: "#7c2d12",
      roofCol: "#0f172a",
      accent: "#facc15",
      checkinLabel: "🛎️ ODA KAYDI AÇ",
      prepLabel: "🧹 ODAYI TEMİZLE",
      unitName: "Oda",
      floorLabel: "Yeni Otel Katı Çık (+6 Oda)",
      vipLabel: "👑 Kral Dairesi & Çatı Havuzu",
      heliLabel: "🚁 VIP Helikopter Pisti",
      staffNames: {
        clerk: "🛎️ Resepsiyonist (Otomatik Kayıt)",
        cleaner: "🧹 Kat Hizmetleri Ekibi (Oto Temizlik)",
        specialist: "👨‍🍳 Oda Servisi & Şef (+%35 Gelir)",
        manager: "👔 Otel Genel Müdürü (Tam Otopilot)"
      },
      desc: "Lüks odalar, kral dairesi ve çatı havuzu! Önce resepsiyon ve temizlikle sen ilgilenirsin, sonra tam kadro kurarsın."
    },
    {
      key: "hospital",
      name: "Özel Otoyol Hastanesi",
      emoji: "🏥",
      buildCost: 78000,
      basePay: 490,
      color: "#0c4a6e",
      roofCol: "#082f49",
      accent: "#38bdf8",
      checkinLabel: "🩺 HASTA KAYDI AÇ",
      prepLabel: "🧼 KLİNİK STERİLİZE ET",
      unitName: "Klinik",
      floorLabel: "Yeni Poliklinik Katı Ekle (+6 Oda)",
      vipLabel: "🔬 MR & VIP Check-Up Ünitesi",
      heliLabel: "🚁 Hava Ambulans Pisti",
      staffNames: {
        clerk: "📋 Hasta Kabul Görevlisi (Oto Kayıt)",
        cleaner: "🧼 Sterilizasyon Ekibi (Oto Hazırlık)",
        specialist: "👨‍⚕️ Uzman Doktor Kadrosu (+%35 Gelir)",
        manager: "👔 Başhekim & İdari Müdür (Tam Otopilot)"
      },
      desc: "7/24 acil ve VIP check-up merkezi. Yüksek muayene ve sağlık geliri sağlar."
    },
    {
      key: "autofactory",
      name: "Otomobil Montaj & Showroom",
      emoji: "🚗",
      buildCost: 95000,
      basePay: 590,
      color: "#1e293b",
      roofCol: "#090d1a",
      accent: "#f97316",
      checkinLabel: "🔩 SİPARİŞ BANDI BAŞLAT",
      prepLabel: "🔧 KALİTE KONTROL YAP",
      unitName: "Bant",
      floorLabel: "Üretim Bandını Genişlet (+6 Hat)",
      vipLabel: "🏎️ Süper Spor Showroom Galerisi",
      heliLabel: "🚛 Otomatik Tır Sevkiyat Rampası",
      staffNames: {
        clerk: "📋 Sipariş Sorumlusu (Oto Başlatma)",
        cleaner: "🔧 Kalite Kontrol Ustası (Oto Kontrol)",
        specialist: "👷 Başmühendis (+%35 Üretim Değeri)",
        manager: "👔 Fabrika Direktörü (Tam Otopilot)"
      },
      desc: "Araç montaj hattı ve dev cam galeri! En yüksek tekil teslimat gelirlerinden birini üretir."
    },
    {
      key: "stadium",
      name: "Spor Kompleksi & Stadyum",
      emoji: "🏟️",
      buildCost: 58000,
      basePay: 375,
      color: "#064e3b",
      roofCol: "#022c22",
      accent: "#4ade80",
      checkinLabel: "🎟️ BİLET & SAHA AÇ",
      prepLabel: "🌱 ÇİM & TRİBÜN HAZIRLA",
      unitName: "Saha/Loca",
      floorLabel: "Yeni Tribün & Loca Katı (+6 Loca)",
      vipLabel: "🌟 Şampiyonlar VIP Locası",
      heliLabel: "📺 Dev Canlı Yayın Ekranları",
      staffNames: {
        clerk: "🎟️ Gişe Görevlisi (Oto Bilet)",
        cleaner: "🌱 Saha Bakım Ekibi (Oto Bakım)",
        specialist: "🏆 Spor Koordinatörü (+%35 Gelir)",
        manager: "👔 Stadyum Müdürü (Tam Otopilot)"
      },
      desc: "Işıklı çim sahalar, turnuvalar ve VIP localar ile kesintisiz bilet geliri."
    },
    {
      key: "techpark",
      name: "Teknokent & Veri Merkezi",
      emoji: "💻",
      buildCost: 110000,
      basePay: 680,
      color: "#1e1b4b",
      roofCol: "#0f172a",
      accent: "#818cf8",
      checkinLabel: "🖥️ SUNUCU KONTRATI AÇ",
      prepLabel: "❄️ SOĞUTMA & BAKIM YAP",
      unitName: "Sunucu",
      floorLabel: "Yeni Sunucu Kulesi Katı (+6 Kabin)",
      vipLabel: "🤖 Yapay Zeka Süper Bilgisayarı",
      heliLabel: "☀️ Özel Trafo & Fiber Omurga",
      staffNames: {
        clerk: "💼 Kontrat Uzmanı (Oto Kabul)",
        cleaner: "❄️ Soğutma Teknisyeni (Oto Bakım)",
        specialist: "👨‍💻 Kıdemli Yazılım Mimarı (+%35 Gelir)",
        manager: "👔 Teknokent CEO'su (Tam Otopilot)"
      },
      desc: "Dev şirketlere bulut sunucu ve yazılım kiralayan ultra kârlı teknoloji üssü!"
    },
    {
      key: "convention",
      name: "Grand Düğün & Kongre Sarayı",
      emoji: "👑",
      buildCost: 88000,
      basePay: 540,
      color: "#4c1d95",
      roofCol: "#2e1065",
      accent: "#f472b6",
      checkinLabel: "🥂 DAVETLİLERİ KARŞILA",
      prepLabel: "✨ SALONU SÜSLE & TOPLA",
      unitName: "Salon",
      floorLabel: "Yeni Balo & Kongre Katı (+6 Salon)",
      vipLabel: "💎 Kraliyet Kristal Balo Salonu",
      heliLabel: "🚁 VIP Konuk Helikopter Pisti",
      staffNames: {
        clerk: "🤵 Karşılama Hostesi (Oto Kayıt)",
        cleaner: "✨ Organizasyon Ekibi (Oto Hazırlık)",
        specialist: "🎂 Ziyafet Başşefi (+%35 Gelir)",
        manager: "👔 Saray Genel Müdürü (Tam Otopilot)"
      },
      desc: "Lüks düğünler, lansmanlar ve uluslararası kongrelerle yüksek organizasyon kazancı."
    }
  ];

  function createSingleLandState() {
    return {
      owned: false,
      projectKey: null, // null iken 6 seçenek sunulur!
      floorsLvl: 1, // 1..5 -> kapasite 6..30 oda/birim
      vipUpgrade: false,
      heliUpgrade: false,
      staff: {
        clerk: false, // Otomatik müşteri kaydı
        cleaner: false, // Otomatik oda/birim temizliği
        specialist: false, // +%35 gelir artışı
        manager: false // Tam otopilot + bakım garantisi
      },
      salary: 0 // Bu araziden şahsi cüzdana bağlanan günlük maaş
    };
  }

  function createDefaultExtraLands() {
    const obj = {};
    EXTRA_LANDS.forEach((l) => {
      obj[l.id] = createSingleLandState();
    });
    return obj;
  }

  function mergeExtraLands(saved) {
    const def = createDefaultExtraLands();
    if (!saved) return def;
    EXTRA_LANDS.forEach((l) => {
      if (saved[l.id]) {
        def[l.id] = Object.assign(createSingleLandState(), saved[l.id]);
        def[l.id].staff = Object.assign(
          { clerk: false, cleaner: false, specialist: false, manager: false },
          saved[l.id].staff || {}
        );
      }
    });
    return def;
  }

  // Canlı Çalışma Durumu (Her arazi için kapıda bekleyen araçlar, dolu odalar, temizlik bekleyen odalar!)
  const runtime = {};
  EXTRA_LANDS.forEach((l) => {
    runtime[l.id] = {
      waitingCars: [], // Kapıda kayıt bekleyen müşteri araçları
      occupiedTimers: [], // İçeride konaklayan/işlem gören birimler (süre bitince ödeme yapar ve kirlenir!)
      dirtyCount: 0, // Temizlik/hazırlık bekleyen oda/birim sayısı
      spawnTimer: 1.5,
      clerkTimer: 0,
      cleanTimer: 0,
      floats: [],
      bgCars: [],
      walkers: []
    };
  });

  let cachedHelpers = null;
  let activeManageLandId = "land4";
  let activeModalTab = "overview"; // "overview" | "staff"

  function getLandDef(landId) {
    return EXTRA_LANDS.find((l) => l.id === landId);
  }

  function getProjectDef(key) {
    return PROJECT_TYPES.find((p) => p.key === key);
  }

  function getMaxUnits(st) {
    return 6 * (st.floorsLvl || 1); // 6, 12, 18, 24, 30 oda/birim!
  }

  function getUnitPayout(landDef, projDef, st) {
    let val = projDef.basePay * landDef.mult * (1 + (st.floorsLvl - 1) * 0.22);
    if (st.vipUpgrade) val *= 1.35;
    if (st.heliUpgrade) val *= 1.25;
    if (st.staff.specialist) val *= 1.35;
    return Math.round(val);
  }

  function getFloorUpgradeCost(landDef, projDef, floorsLvl) {
    return Math.round(projDef.buildCost * 0.55 * landDef.mult * Math.pow(1.55, floorsLvl - 1));
  }

  function getStaffCosts(landDef, projDef) {
    const m = landDef.mult;
    return {
      clerk: Math.round(14000 * m),
      cleaner: Math.round(16500 * m),
      specialist: Math.round(24000 * m),
      manager: Math.round(38000 * m)
    };
  }

  function calcTotalExtraSalary(extraLands) {
    if (!extraLands) return 0;
    let sum = 0;
    EXTRA_LANDS.forEach((l) => {
      const st = extraLands[l.id];
      if (st && st.owned && st.projectKey) {
        sum += Math.max(0, st.salary || 0);
      }
    });
    return sum;
  }

  function calcDailyExtraWages(extraLands) {
    let total = 0;
    const breakdown = [];
    if (!extraLands) return { total, breakdown };
    EXTRA_LANDS.forEach((l) => {
      const st = extraLands[l.id];
      if (!st || !st.owned || !st.projectKey) return;
      let sub = 0;
      if (st.staff.clerk) sub += 45;
      if (st.staff.cleaner) sub += 45;
      if (st.staff.specialist) sub += 65;
      if (st.staff.manager) sub += 95;
      if (sub > 0) {
        total += sub;
        breakdown.push({ label: `${l.num}. Arazi (${getProjectDef(st.projectKey).name}) Ekibi`, amount: sub });
      }
    });
    return { total, breakdown };
  }

  // =========================================================================
  // MİNİ AKSİYONLAR (ÖNCE BİZ İLGİLENİRİZ, ELEMAN ALINCA OTOMATİK OLUR!)
  // =========================================================================
  function doCheckInOne(landId, data, isAuto = false) {
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];
    if (!st || !st.projectKey || rt.waitingCars.length === 0) return false;

    const maxU = getMaxUnits(st);
    const usedU = rt.occupiedTimers.length + rt.dirtyCount;
    if (usedU >= maxU) {
      if (!isAuto && cachedHelpers) {
        const p = getProjectDef(st.projectKey);
        cachedHelpers.showToast(
          rt.dirtyCount > 0
            ? `🧹 Boş yer kalmadı! Önce kirli ${p.unitName.toLowerCase()}ları hazırla!`
            : `🏨 Tüm ${p.unitName.toLowerCase()}lar dolu (${maxU}/${maxU})! Kat çıkabilirsin.`
        );
      }
      return false;
    }

    const carIdx = isAuto ? rt.waitingCars.findIndex((c) => c.arrived) : 0;
    if (carIdx < 0) return false;
    const car = rt.waitingCars.splice(carIdx, 1)[0];
    rt.occupiedTimers.push(6.0 + Math.random() * 3.2);
    rt.walkers.push({
      x: car.x,
      y: Math.max(176, car.y + 10),
      tx: 240 + (Math.random() - 0.5) * 40,
      ty: 256,
      col: car.color,
      phase: Math.random() * 6
    });
    if (!isAuto && cachedHelpers) {
      cachedHelpers.sfx.tap();
    }
    return true;
  }

  function doCleanOne(landId, data, isAuto = false, count = 1) {
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];
    if (!st || !st.projectKey || rt.dirtyCount <= 0) return false;
    const cleanAmt = isAuto ? count : 2;
    rt.dirtyCount = Math.max(0, rt.dirtyCount - cleanAmt);
    if (!isAuto && cachedHelpers) {
      cachedHelpers.sfx.tap();
      rt.floats.push({ x: 240, y: 340, text: "✨ Hazırlandı!", color: "#38bdf8", life: 1.1 });
    }
    return true;
  }

  function getV16Mult(data) {
    const v16 = data.empire && data.empire.v16;
    if (!window.HoldingV16 || !v16) return 1.0;
    const sd = window.HoldingV16.getSpecialDay(v16);
    const hq = v16.vipAssets && v16.vipAssets.hq ? 1.15 : 1.0;
    return (sd.incomeMult || 1.0) * hq;
  }

  // =========================================================================
  // CANLI SİMÜLASYON (TÜM 4..10 ARAZİLER ARKA PLANDA VE EKRANDA ÇALIŞIR!)
  // =========================================================================
  function updateExtraLands(dt, data, onEarn) {
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();
    const colors = ["#ef4444", "#2563eb", "#f59e0b", "#10b981", "#e2e8f0", "#8b5cf6", "#ec4899"];
    const v16Mult = getV16Mult(data);

    EXTRA_LANDS.forEach((lDef) => {
      const st = data.empire.extraLands[lDef.id];
      const rt = runtime[lDef.id];

      if (Math.random() < dt * 0.7 && rt.bgCars.length < 3) {
        rt.bgCars.push({ x: 520, y: 23, speed: 110 + Math.random() * 25, color: colors[Math.floor(Math.random() * colors.length)] });
      }
      rt.bgCars.forEach((c) => (c.x -= c.speed * dt));
      rt.bgCars = rt.bgCars.filter((c) => c.x > -60);

      if (!st.owned || !st.projectKey) return;
      const proj = getProjectDef(st.projectKey);

      // 1. Otoyoldan Tesise Müşteri Aracı Gelişi (Kesintisiz Waypoint Motoru!)
      rt.spawnTimer -= dt;
      if (rt.spawnTimer <= 0 && rt.waitingCars.length < 5) {
        rt.spawnTimer = Math.max(1.15, 3.4 - st.floorsLvl * 0.35 - (st.heliUpgrade ? 0.55 : 0));
        const slotIdx = rt.waitingCars.length;
        const slotX = 145 + slotIdx * 48;
        rt.waitingCars.push({
          x: -40,
          y: 58,
          targetX: slotX,
          targetY: 178,
          angle: Math.PI / 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: st.vipUpgrade && Math.random() < 0.5 ? "sport" : "suv",
          arrived: false,
          waypoints: [
            { x: 98, y: 58, speed: 132 },
            { x: 98, y: 178, speed: 112 },
            { x: slotX, y: 178, speed: 108, finalAngle: Math.PI / 2 }
          ]
        });
      }

      rt.waitingCars.forEach((c, idx) => {
        const desiredX = 145 + idx * 48;
        c.targetX = desiredX;
        if (c.waypoints && c.waypoints.length > 0) {
          c.waypoints[c.waypoints.length - 1].x = desiredX;
          const wp = c.waypoints[0];
          const dx = wp.x - c.x;
          const dy = wp.y - c.y;
          const d = Math.hypot(dx, dy);
          const spd = wp.speed || 115;
          if (d <= spd * dt + 1.5) {
            c.x = wp.x;
            c.y = wp.y;
            if (wp.finalAngle !== undefined) c.angle = wp.finalAngle;
            c.waypoints.shift();
            if (c.waypoints.length === 0) {
              c.angle = Math.PI / 2;
              c.arrived = true;
            }
          } else {
            c.angle = Math.atan2(dx, -dy);
            c.x += (dx / d) * spd * dt;
            c.y += (dy / d) * spd * dt;
          }
        } else {
          // Sıradaki boşluğa kay
          const dx = desiredX - c.x;
          if (Math.abs(dx) > 2) {
            c.x += Math.sign(dx) * Math.min(Math.abs(dx), 95 * dt);
          } else {
            c.x = desiredX;
          }
          c.y = 178;
          c.angle = Math.PI / 2;
          c.arrived = true;
        }
      });

      // 2. Eleman Varsa (Resepsiyonist veya Genel Müdür) Otomatik Kayıt Açar! Yoksa Patronu Bekler!
      if ((st.staff.clerk || st.staff.manager) && rt.waitingCars.some((c) => c.arrived)) {
        rt.clerkTimer += dt;
        const clerkRate = st.staff.manager && st.staff.clerk ? 0.65 : st.staff.manager ? 0.85 : 1.25;
        if (rt.clerkTimer >= clerkRate) {
          rt.clerkTimer = 0;
          doCheckInOne(lDef.id, data, true);
        }
      }

      // 3. Konaklayan / İşlem Gören Birimler Süresi Dolunca Ödeme Bırakır ve Oda Kirlenir!
      for (let i = rt.occupiedTimers.length - 1; i >= 0; i--) {
        rt.occupiedTimers[i] -= dt;
        if (rt.occupiedTimers[i] <= 0) {
          rt.occupiedTimers.splice(i, 1);
          rt.dirtyCount += 1;
          const pay = Math.round(getUnitPayout(lDef, proj, st) * v16Mult);
          data.cash += pay;
          if (data.daily) {
            if (!data.daily.extraLandIncomes) data.daily.extraLandIncomes = {};
            data.daily.extraLandIncomes[lDef.id] = (data.daily.extraLandIncomes[lDef.id] || 0) + pay;
          }
          if (st.salary > 0) {
            data.empire.personalCash += Math.max(5, Math.round(st.salary * 0.018));
          }
          rt.floats.push({
            x: 240 + (Math.random() - 0.5) * 90,
            y: 280,
            text: `${proj.emoji} +${pay} ₺`,
            color: "#4ade80",
            life: 1.55
          });
          if (onEarn) onEarn(pay);
        }
      }

      // 4. Kat Hizmetleri / Bakım Ekibi veya Müdür Varsa Kirli Odaları Otomatik Hazırlar!
      if ((st.staff.cleaner || st.staff.manager) && rt.dirtyCount > 0) {
        rt.cleanTimer += dt;
        const bothClean = st.staff.cleaner && st.staff.manager;
        const cleanRate = bothClean ? 0.65 : st.staff.manager ? 0.85 : 1.25;
        if (rt.cleanTimer >= cleanRate) {
          rt.cleanTimer = 0;
          doCleanOne(lDef.id, data, true, bothClean ? 2 : 1);
        }
      }

      // Yürüyen Konuklar & Uçan Yazılar
      rt.walkers.forEach((w) => {
        w.phase += dt * 7;
        const dx = w.tx - w.x;
        const dy = w.ty - w.y;
        const d = Math.hypot(dx, dy);
        if (d > 3) {
          w.x += (dx / d) * 60 * dt;
          w.y += (dy / d) * 60 * dt;
        } else {
          w.done = true;
        }
      });
      rt.walkers = rt.walkers.filter((w) => !w.done);

      rt.floats.forEach((f) => {
        f.y -= 24 * dt;
        f.life -= dt;
      });
      rt.floats = rt.floats.filter((f) => f.life > 0);
    });
  }

  // =========================================================================
  // GERÇEKÇİ 2.5D MİMARİ ÇİZİM (GRAND OTEL, HASTANE, FABRİKA, STADYUM, TEKNOKENT, SARAY)
  // =========================================================================
  function renderExtraLand(ctx, W, H, phase, data, MR, landId) {
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();
    const lDef = getLandDef(landId);
    const st = data.empire.extraLands[landId];
    const rt = runtime[landId];

    if (baseReady) ctx.drawImage(baseImg, 0, 0, W, H);
    else {
      ctx.fillStyle = "#162030";
      ctx.fillRect(0, 0, W, H);
    }

    rt.bgCars.forEach((hc) => {
      MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", -Math.PI / 2, { nightIntensity: phase.night });
    });

    // Üst Arazi Başlığı
    MR.rr(ctx, 74, 76, W - 148, 26, 7, "rgba(9, 13, 26, 0.92)", "#facc15", 1.8);
    ctx.fillStyle = "#fef08a";
    ctx.font = "900 10.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🗺️ ${lDef.name.toUpperCase()} (Gelir Çarpanı: x${lDef.mult})`, W / 2, 93);

    // DURUM 1: ARSA HENÜZ SATIN ALINMAMIŞ
    if (!st.owned) {
      MR.rr(ctx, 50, 148, W - 100, 290, 18, "rgba(15, 23, 42, 0.94)", "#f59e0b", 2.5);
      ctx.fillStyle = "#fde047";
      ctx.font = "900 19px sans-serif";
      ctx.fillText(`🏞️ ${lDef.name}`, W / 2, 194);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "700 12px sans-serif";
      ctx.fillText(lDef.desc, W / 2, 224);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "800 12px sans-serif";
      ctx.fillText("Tapuyu aldığında 6 dev projeden birini seçebilirsin:", W / 2, 256);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText("🏨 5 Yıldızlı Grand Otel • 🏥 Özel Hastane", W / 2, 282);
      ctx.fillText("🚗 Otomobil Fabrikası • 🏟️ Stadyum", W / 2, 304);
      ctx.fillText("💻 Teknokent Veri Üssü • 👑 Kongre Sarayı", W / 2, 326);

      const canBuy = data.cash >= lDef.deedCost;
      MR.rr(ctx, 78, 358, W - 156, 52, 13, canBuy ? "#16a34a" : "#475569", "#fef08a", 2.2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px sans-serif";
      ctx.fillText(`ARSA TAPUSUNU SATIN AL — ${lDef.deedCost.toLocaleString("tr-TR")} ₺`, W / 2, 389);
      return;
    }

    // DURUM 2: ARSA BİZİM AMA HENÜZ 6 PROJEDEN BİRİ SEÇİLMEDİ!
    if (!st.projectKey) {
      MR.rr(ctx, 48, 136, W - 96, 320, 18, "rgba(15, 23, 42, 0.94)", "#38bdf8", 2.5);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 16px sans-serif";
      ctx.fillText("✅ ARSA TAPUSU SENİN! NE İNŞA EDELİM?", W / 2, 176);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 12px sans-serif";
      ctx.fillText("Otel, Hastane, Fabrika, Stadyum, Teknokent veya Saray!", W / 2, 202);

      PROJECT_TYPES.forEach((p, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const bx = 62 + col * 182;
        const by = 218 + row * 68;
        MR.rr(ctx, bx, by, 174, 60, 10, "#1e293b", p.accent, 1.8);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 11px sans-serif";
        ctx.fillText(`${p.emoji} ${p.name}`, bx + 87, by + 24);
        ctx.fillStyle = "#fde047";
        ctx.font = "900 11.5px sans-serif";
        ctx.fillText(`${Math.round(p.buildCost * lDef.mult).toLocaleString("tr-TR")} ₺`, bx + 87, by + 45);
      });
      return;
    }

    // DURUM 3: DEV PROJE İNŞA EDİLDİ — GERÇEKÇİ 2.5D MİMARİ & CANLI İŞLEYİŞ!
    const proj = getProjectDef(st.projectKey);
    const maxU = getMaxUnits(st);
    const occU = rt.occupiedTimers.length;
    const dirtyU = rt.dirtyCount;

    // 1. VIP Ön Avlu, Kırmızı Halı / Porte-Cochère Girişi (y: 112..238)
    MR.rr(ctx, 48, 112, 384, 122, 14, "rgba(15, 23, 42, 0.85)", "#475569", 1.8);
    // Kırmızı karşılama halısı & altın dubalar
    MR.rr(ctx, 198, 202, 84, 46, 5, "#991b1b", "#fde047", 1.6);
    MR.drawStreetLamp(ctx, 76, 128, phase.night, false);
    MR.drawStreetLamp(ctx, 404, 128, phase.night, false);

    // Kapıda Bekleyen Müşteri Araçları
    rt.waitingCars.forEach((c) => {
      MR.drawDetailedVehicle(ctx, c.x, c.y, c.color, c.shape, c.angle, { nightIntensity: phase.night });
    });

    rt.walkers.forEach((w) => {
      MR.drawCustomerCharacter(ctx, w.x, w.y, w.col, "#18181b", proj.emoji, w.phase);
    });

    // 2. Ana 2.5D Çok Katlı Dev Tesis / Grand Otel Binası (x: 48..432, y: 244..586)
    const bx = 48;
    const by = 246;
    const bw = 384;
    const bh = 342;

    // Derin 3D Bina Gölgesi
    MR.rr(ctx, bx + 7, by + 9, bw, bh, 18, "rgba(0,0,0,0.58)", null);
    // Cephe Gövdesi
    MR.rr(ctx, bx, by + 20, bw, bh - 20, 16, proj.color, "#090d1a", 2.6);
    // Kademeli Çatı & Neon Taç
    MR.rr(ctx, bx - 3, by, bw + 6, 40, 13, proj.roofCol, proj.accent, 2.4);

    // Üst Tabela
    MR.rr(ctx, bx + 54, by + 8, bw - 108, 24, 7, "#090d1a", proj.accent, 1.6);
    ctx.fillStyle = "#fef9c3";
    ctx.font = "900 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${proj.emoji} ${proj.name.toUpperCase()} ★ KAT ${st.floorsLvl}/5`, W / 2, by + 24);

    // Çatı Özellikleri: Çatı Sonsuzluk Havuzu (vipUpgrade) & Helikopter Pisti (heliUpgrade)
    const shimmer = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
    if (st.vipUpgrade) {
      MR.rr(ctx, bx + 14, by + 48, 146, 48, 9, "#f8fafc", "#fde047", 1.5);
      MR.rr(ctx, bx + 18, by + 52, 138, 40, 7, "#0ea5e9", null);
      ctx.fillStyle = `rgba(186, 230, 253, ${0.22 + shimmer * 0.22})`;
      ctx.fillRect(bx + 24, by + 57, 126, 5);
      ctx.fillRect(bx + 34, by + 81, 106, 4);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 8.2px sans-serif";
      ctx.fillText(proj.key === "hotel" ? "🏊 ÇATI HAVUZU & VIP" : "🌟 VIP ÜNİTE AKTİF", bx + 87, by + 75);
    }
    if (st.heliUpgrade) {
      const hx = bx + bw - 50;
      const hy = by + 72;
      MR.rr(ctx, hx - 32, hy - 24, 64, 48, 9, "#1e293b", "#facc15", 1.6);
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(hx, hy, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.font = "900 12px sans-serif";
      ctx.fillText("H", hx, hy + 4.5);
    }

    // 3. Kat Kat Gerçekçi Oda / Birim Pencereleri (Gece Sıcak Işık Parlamalı!)
    const cols = 6;
    const rows = st.floorsLvl; // 1..5 kat!
    const winW = 48;
    const winH = 26;
    const startX = bx + 26;
    const startY = by + 106;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const wx = startX + c * 56;
        const wy = startY + r * 34;
        const isOcc = idx < occU;
        const isDirty = !isOcc && idx < occU + dirtyU;

        if (isOcc && phase.night > 0.25) {
          ctx.save();
          ctx.fillStyle = `rgba(250, 204, 21, ${0.18 * phase.night})`;
          ctx.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);
          ctx.restore();
        }

        const wFill = isOcc ? "#fde047" : isDirty ? "#9a3412" : "#1e293b";
        const wBrd = isOcc ? "#ca8a04" : isDirty ? "#fb923c" : proj.accent;
        MR.rr(ctx, wx, wy, winW, winH, 5, wFill, wBrd, 1.4);

        ctx.font = "900 8px sans-serif";
        ctx.fillStyle = isOcc ? "#090d1a" : isDirty ? "#fed7aa" : "#cbd5e1";
        ctx.fillText(isOcc ? "DOLU" : isDirty ? "🧹 KİRLİ" : "HAZIR", wx + winW / 2, wy + 16);
      }
    }

    // 4. MANUEL İŞLEM BUTONLARI (Eleman Yokken Patron Tıklar, Eleman Alınınca Otomatik Çalışır!)
    const waitingReady = rt.waitingCars.filter((c) => c.arrived).length;

    // Sol Eylem Kutu: Müşteri Kaydı Açma
    const needManualCheckin = waitingReady > 0 && !st.staff.clerk && !st.staff.manager;
    MR.rr(
      ctx,
      bx + 16,
      by + bh - 62,
      170,
      48,
      10,
      needManualCheckin ? "#16a34a" : st.staff.clerk || st.staff.manager ? "#064e3b" : "#0f172a",
      needManualCheckin ? "#fef08a" : st.staff.clerk || st.staff.manager ? "#22c55e" : "#334155",
      2
    );
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.fillText(
      st.staff.clerk || st.staff.manager
        ? `🟢 OTO KAYIT (${occU}/${maxU} Dolu)`
        : waitingReady > 0
        ? `${proj.checkinLabel} (${waitingReady})!`
        : `Müşteri Bekleniyor (${occU}/${maxU})`,
      bx + 101,
      by + bh - 34
    );

    // Sağ Eylem Kutu: Oda / Birim Temizleme & Hazırlama
    const needManualClean = dirtyU > 0 && !st.staff.cleaner && !st.staff.manager;
    MR.rr(
      ctx,
      bx + bw - 186,
      by + bh - 62,
      170,
      48,
      10,
      needManualClean ? "#ea580c" : st.staff.cleaner || st.staff.manager ? "#0c4a6e" : "#0f172a",
      needManualClean ? "#fef08a" : st.staff.cleaner || st.staff.manager ? "#38bdf8" : "#334155",
      2
    );
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      st.staff.cleaner || st.staff.manager
        ? `🟢 OTO TEMİZLİK (${dirtyU} Kirli)`
        : dirtyU > 0
        ? `${proj.prepLabel} (${dirtyU})!`
        : `✨ Tüm ${proj.unitName}lar Temiz`,
      bx + bw - 101,
      by + bh - 34
    );

    // Orta Üst "Yönet & Ekip" Rozeti (Havuz ve Helikopter Pisti ile Çakışmaz!)
    MR.rr(ctx, bx + 166, by + 54, 130, 36, 9, "#0284c7", "#fef08a", 1.8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px sans-serif";
    ctx.fillText("🏗️ YÖNET & EKİP", bx + 231, by + 76);

    // Uçan Kazanç Yazıları
    rt.floats.forEach((f) => {
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

  // =========================================================================
  // HARİTA TIKLAMA VE 6 PROJE SEÇİM / TESİS YÖNETİM MODALI
  // =========================================================================
  function handleExtraLandClick(pt, data, helpers, landId) {
    cachedHelpers = helpers;
    const lDef = getLandDef(landId);
    const st = data.empire.extraLands[landId];

    // 1. Arsa satın alma
    if (!st.owned) {
      if (pt.x > 50 && pt.x < 430 && pt.y > 148 && pt.y < 440) {
        helpers.payForBusiness(lDef.deedCost, `${lDef.name} Tapusu`, () => {
          st.owned = true;
          helpers.sfx.perfectHit();
          helpers.showToast(`🎉 ${lDef.name} tapusu alındı! Şimdi 6 dev projeden birini seç!`);
          helpers.saveGame();
          helpers.updateHUD();
          openExtraLandModal(landId, data, helpers);
        });
      }
      return;
    }

    // 2. 6 Proje Seçim Ekranı
    if (!st.projectKey) {
      openExtraLandModal(landId, data, helpers);
      return;
    }

    // 3. Bina Alt Sol Buton: Manuel Müşteri Kaydı Açma!
    if (pt.x >= 64 && pt.x <= 234 && pt.y >= 518 && pt.y <= 582) {
      if (!doCheckInOne(landId, data, false)) {
        openExtraLandModal(landId, data, helpers);
      }
      return;
    }

    // 4. Bina Alt Sağ Buton: Manuel Oda/Birim Temizleme!
    if (pt.x >= 246 && pt.x <= 416 && pt.y >= 518 && pt.y <= 582) {
      if (!doCleanOne(landId, data, false)) {
        openExtraLandModal(landId, data, helpers);
      }
      return;
    }

    // Kapıda bekleyen araca tıklanırsa da hemen kayıt açsın!
    if (pt.y >= 112 && pt.y <= 236 && runtime[landId].waitingCars.some((c) => c.arrived)) {
      doCheckInOne(landId, data, false);
      return;
    }

    // Binanın gövdesine dokununca Kat Çıkma & Eleman Alma menüsü açılır
    helpers.sfx.tap();
    openExtraLandModal(landId, data, helpers);
  }

  function openExtraLandModal(landId, data, helpers) {
    activeManageLandId = landId;
    cachedHelpers = helpers;
    renderExtraLandModal(data, helpers);
    const m = document.getElementById("land3Modal");
    if (m) m.classList.remove("hidden");
  }

  function renderExtraLandModal(data, helpers) {
    const lDef = getLandDef(activeManageLandId);
    const st = data.empire.extraLands[activeManageLandId];
    const titleEl = document.getElementById("land3ModalTitle");
    const cashEl = document.getElementById("land3CompanyCash");
    const body = document.getElementById("land3ModalBody");
    if (!body || !titleEl) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash).toLocaleString("tr-TR");

    // EĞER HENÜZ PROJE SEÇİLMEDİYSE 6 SEÇENEĞİ GÖSTER!
    if (!st.projectKey) {
      titleEl.textContent = `🏗️ ${lDef.num}. Arazi — Ne İnşa Edelim?`;
      let html = `
        <p style="font-size:13px; color:#fde68a; font-weight:800; margin-bottom:10px;">
          Bu araziye aşağıdaki <strong>6 dev projeden istediğin birini</strong> kurabilirsin! Kurulduğunda önce işlerle sen ilgilenirsin, büyüdükçe eleman ve müdür alırsın:
        </p>
      `;
      PROJECT_TYPES.forEach((p) => {
        const buildPrice = Math.round(p.buildCost * lDef.mult);
        const estPay = Math.round(p.basePay * lDef.mult);
        html += `
          <div class="mall-shop-card">
            <div class="shop-top-row">
              <div class="shop-title">${p.emoji} ${p.name}</div>
              <span class="shop-status-tag tag-sale">+${estPay} ₺ / işlem</span>
            </div>
            <div style="font-size:12.5px; color:#cbd5e1;">${p.desc}</div>
            <div class="shop-btn-row">
              <button class="shop-action-btn buy-deed pick-proj-btn" data-proj="${p.key}">
                🏗️ ${p.name} İnşa Et — ${buildPrice.toLocaleString("tr-TR")} ₺
              </button>
            </div>
          </div>
        `;
      });
      body.innerHTML = html;

      body.querySelectorAll(".pick-proj-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pKey = btn.dataset.proj;
          const pDef = getProjectDef(pKey);
          const buildPrice = Math.round(pDef.buildCost * lDef.mult);
          helpers.payForBusiness(buildPrice, `${pDef.name} İnşaatı`, () => {
            st.projectKey = pKey;
            st.floorsLvl = 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`🎉 ${pDef.name} inşa edildi! Başlangıçta kayıt ve hazırlıkla sen ilgileniyorsun!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      });
      return;
    }

    // PROJE KURULMUŞ -> BÜYÜTME, ELEMAN ALMA VE ŞAHSİ MAAŞ BAĞLAMA!
    const proj = getProjectDef(st.projectKey);
    titleEl.textContent = `${proj.emoji} ${lDef.num}. Arazi: ${proj.name}`;

    const floorCost = getFloorUpgradeCost(lDef, proj, st.floorsLvl);
    const vipCost = Math.round(proj.buildCost * 0.75 * lDef.mult);
    const heliCost = Math.round(proj.buildCost * 0.95 * lDef.mult);
    const sCosts = getStaffCosts(lDef, proj);
    const curPay = getUnitPayout(lDef, proj, st);
    const salPresets = [0, 500, 1500, 3500, 7500, 15000];

    body.innerHTML = `
      <div class="mall-summary-bar">
        <div class="mall-stat-pill">
          <span class="lbl">🏢 KAPASİTE</span>
          <span class="val">${getMaxUnits(st)} ${proj.unitName}</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💰 İŞLEM BAŞI</span>
          <span class="val" style="color:#4ade80;">+${curPay} ₺</span>
        </div>
        <div class="mall-stat-pill">
          <span class="lbl">💼 ŞAHSİ MAAŞ</span>
          <span class="val" style="color:#38bdf8;">+${st.salary} ₺</span>
        </div>
      </div>

      <div class="subtab-row" style="grid-template-columns: 1fr 1fr; margin-bottom:8px;">
        <button class="city-tab-btn ${activeModalTab === "overview" ? "active" : ""}" id="tabExtUp">🏗️ Tesis Büyütme</button>
        <button class="city-tab-btn ${activeModalTab === "staff" ? "active" : ""}" id="tabExtStaff">👷 Eleman &amp; Maaş</button>
      </div>

      <div id="extModalInner"></div>
    `;

    document.getElementById("tabExtUp").addEventListener("click", () => {
      activeModalTab = "overview";
      renderExtraLandModal(data, helpers);
    });
    document.getElementById("tabExtStaff").addEventListener("click", () => {
      activeModalTab = "staff";
      renderExtraLandModal(data, helpers);
    });

    const inner = document.getElementById("extModalInner");
    if (activeModalTab === "overview") {
      inner.innerHTML = `
        <div class="upgrade-card">
          <div class="up-info">
            <h3>🏢 ${proj.floorLabel} (Kat ${st.floorsLvl}/5)</h3>
            <p>Kapasiteyi +6 ${proj.unitName.toLowerCase()} büyütür ve birim gelirini +%22 artırır!</p>
          </div>
          <button id="btnExtFloor" class="up-buy-btn" ${st.floorsLvl >= 5 ? "disabled" : ""}>
            ${st.floorsLvl >= 5 ? "5 KAT TAM ✓" : `${floorCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>${proj.vipLabel}</h3>
            <p>Lüks müşteri çeker ve tüm gelirleri kalıcı olarak <strong>+%35</strong> artırır!</p>
          </div>
          <button id="btnExtVip" class="up-buy-btn" ${st.vipUpgrade ? "disabled" : ""}>
            ${st.vipUpgrade ? "AKTİF ✓" : `${vipCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>${proj.heliLabel}</h3>
            <p>Müşteri geliş hızını artırır ve tüm gelirlere ekstra <strong>+%25</strong> ekler!</p>
          </div>
          <button id="btnExtHeli" class="up-buy-btn" ${st.heliUpgrade ? "disabled" : ""}>
            ${st.heliUpgrade ? "AKTİF ✓" : `${heliCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
      `;

      const fBtn = document.getElementById("btnExtFloor");
      if (fBtn && st.floorsLvl < 5) {
        fBtn.addEventListener("click", () => {
          helpers.payForBusiness(floorCost, `${proj.name} Yeni Kat`, () => {
            st.floorsLvl += 1;
            helpers.sfx.perfectHit();
            helpers.showToast(`🏢 ${proj.name} ${st.floorsLvl}. kata yükseldi (${getMaxUnits(st)} ${proj.unitName})!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }

      const vBtn = document.getElementById("btnExtVip");
      if (vBtn && !st.vipUpgrade) {
        vBtn.addEventListener("click", () => {
          helpers.payForBusiness(vipCost, proj.vipLabel, () => {
            st.vipUpgrade = true;
            helpers.sfx.perfectHit();
            helpers.showToast(`🌟 ${proj.vipLabel} hizmete açıldı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }

      const hBtn = document.getElementById("btnExtHeli");
      if (hBtn && !st.heliUpgrade) {
        hBtn.addEventListener("click", () => {
          helpers.payForBusiness(heliCost, proj.heliLabel, () => {
            st.heliUpgrade = true;
            helpers.sfx.perfectHit();
            helpers.showToast(`🚁 ${proj.heliLabel} tamamlandı!`);
            helpers.saveGame();
            helpers.updateHUD();
            renderExtraLandModal(data, helpers);
          });
        });
      }
      return;
    }

    // STAFF & PERSONAL SALARY TAB
    inner.innerHTML = `
      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.clerk}</h3>
          <p>Kapıya gelen müşterileri sen dokunmadan otomatik içeri alır!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="clerk" ${st.staff.clerk ? "disabled" : ""}>
          ${st.staff.clerk ? "GÖREVDE ✓" : `${sCosts.clerk.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.cleaner}</h3>
          <p>Boşalan ${proj.unitName.toLowerCase()}ları otomatik temizleyip yeni müşteriye hazırlar!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="cleaner" ${st.staff.cleaner ? "disabled" : ""}>
          ${st.staff.cleaner ? "GÖREVDE ✓" : `${sCosts.cleaner.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card">
        <div class="up-info">
          <h3>${proj.staffNames.specialist}</h3>
          <p>Hizmet kalitesini zirveye taşır, kazancı <strong>+%35</strong> artırır!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="specialist" ${st.staff.specialist ? "disabled" : ""}>
          ${st.staff.specialist ? "GÖREVDE ✓" : `${sCosts.specialist.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card" style="border-color:#facc15;">
        <div class="up-info">
          <h3>${proj.staffNames.manager}</h3>
          <p>Sen diğer arazilerdeyken burayı %100 tam hızda otopilot yönetir!</p>
        </div>
        <button class="up-buy-btn ext-stf-btn" data-role="manager" ${st.staff.manager ? "disabled" : ""}>
          ${st.staff.manager ? "OTOPİLOT ✓" : `${sCosts.manager.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="rep-section" style="border-color:#22c55e; margin-top:8px;">
        <h4>💳 BU ARAZİDEN ŞAHSİ MAAŞ BAĞLA</h4>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:6px;">
          ${salPresets
            .map((amt) => `<button class="sal-btn ext-sal-btn ${st.salary === amt ? "active" : ""}" data-amt="${amt}">${amt} ₺</button>`)
            .join("")}
        </div>
      </div>
    `;

    inner.querySelectorAll(".ext-stf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.role;
        const cost = sCosts[role];
        helpers.payForBusiness(cost, proj.staffNames[role], () => {
          st.staff[role] = true;
          helpers.sfx.perfectHit();
          helpers.showToast(`👷 ${proj.staffNames[role]} göreve başladı!`);
          helpers.saveGame();
          helpers.updateHUD();
          renderExtraLandModal(data, helpers);
        });
      });
    });

    inner.querySelectorAll(".ext-sal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        st.salary = Number(btn.dataset.amt);
        helpers.sfx.tap();
        helpers.saveGame();
        helpers.showToast(`💼 ${lDef.num}. Arazi şahsi maaşın ${st.salary} ₺/gün yapıldı!`);
        renderExtraLandModal(data, helpers);
      });
    });
  }

  // =========================================================================
  // 🗺️ 10 ARAZİLİ BÖLGE HARİTASI SEÇİCİSİ (#landsDirectoryModal)
  // =========================================================================
  function renderLandsDirectory(data, activeLand, onSelectLand) {
    const box = document.getElementById("landsDirectoryList");
    const cashEl = document.getElementById("landsDirCash");
    if (!box) return;
    if (cashEl) cashEl.textContent = Math.round(data.cash).toLocaleString("tr-TR");
    if (!data.empire.extraLands) data.empire.extraLands = createDefaultExtraLands();

    const coreLands = [
      { id: "station", title: "⛽ 1. Arazi — Ana İstasyon", status: "AKTİF MERKEZ", owned: true, desc: "9 Pompa, LPG, Çekici, Otobüs Peronu, EV Şarj, Restoran & Motel" },
      { id: "land2", title: "🛍️ 2. Arazi — Otopark & Grand AVM", status: data.empire.land2Owned ? "TAPULU ✓" : `SATILIK (${window.EmpireSystem.LAND2_COST} ₺)`, owned: data.empire.land2Owned, desc: "Ücretli Otopark, 8 Dükkanlı AVM, Mal Kabul İşlemleri & Plaza" },
      { id: "land3", title: "🎡 3. Arazi — Park, Filo & Tatil Köyü", status: data.empire.land3 && data.empire.land3.owned ? "TAPULU ✓" : `SATILIK (${window.Land3System.LAND3_COST} ₺)`, owned: !!(data.empire.land3 && data.empire.land3.owned), desc: "Go-Kart, Dönme Dolap, Bedava Tanker Rafinerisi, 10 Tır & Bungalov" }
    ];

    let html = "";
    coreLands.forEach((c) => {
      html += `
        <div class="mall-shop-card ${c.owned ? "rented" : ""}">
          <div class="shop-top-row">
            <div class="shop-title">${c.title}</div>
            <span class="shop-status-tag ${c.owned ? "tag-rented" : "tag-sale"}">${c.status}</span>
          </div>
          <div style="font-size:12px; color:#cbd5e1;">${c.desc}</div>
          <div class="shop-btn-row">
            <button class="shop-action-btn ${activeLand === c.id ? "up-rent" : "rent-fixed"} go-land-btn" data-land="${c.id}">
              ${activeLand === c.id ? "📍 ŞU AN BURADASIN" : "🚀 BU ARAZİYE GİT ➔"}
            </button>
          </div>
        </div>
      `;
    });

    EXTRA_LANDS.forEach((l) => {
      const st = data.empire.extraLands[l.id];
      const pDef = st.projectKey ? getProjectDef(st.projectKey) : null;
      const statusTxt = !st.owned
        ? `SATILIK • ${l.deedCost.toLocaleString("tr-TR")} ₺`
        : pDef
        ? `${pDef.emoji} ${pDef.name} (Kat ${st.floorsLvl})`
        : "🔑 ARSA BİZİM • PROJE SEÇ!";

      html += `
        <div class="mall-shop-card ${pDef ? "rented" : st.owned ? "owned" : ""}">
          <div class="shop-top-row">
            <div class="shop-title">🏞️ ${l.name}</div>
            <span class="shop-status-tag ${pDef ? "tag-rented" : st.owned ? "tag-vacant" : "tag-sale"}">${statusTxt}</span>
          </div>
          <div style="font-size:12px; color:#cbd5e1;">${l.desc}</div>
          <div class="shop-btn-row">
            <button class="shop-action-btn ${st.owned ? "rent-share" : "buy-deed"} go-land-btn" data-land="${l.id}">
              ${!st.owned ? `🗺️ Arsayı Gör & Satın Al (${l.deedCost.toLocaleString("tr-TR")} ₺)` : pDef ? `🚀 ${pDef.name} Haritasına Git ➔` : "🏗️ 6 Projeden Birini Seç & Kur ➔"}
            </button>
          </div>
        </div>
      `;
    });

    box.innerHTML = html;
    box.querySelectorAll(".go-land-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.land;
        const m = document.getElementById("landsDirectoryModal");
        if (m) m.classList.add("hidden");
        onSelectLand(target);
      });
    });
  }

  return {
    EXTRA_LANDS,
    PROJECT_TYPES,
    createDefaultExtraLands,
    mergeExtraLands,
    getLandDef,
    getProjectDef,
    calcTotalExtraSalary,
    calcDailyExtraWages,
    updateExtraLands,
    renderExtraLand,
    handleExtraLandClick,
    openExtraLandModal,
    renderLandsDirectory
  };
})();

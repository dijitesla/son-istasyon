// Son İstasyon v6.0 — Canlı İstasyon Haritası, Pompa/Tanker Kontrolü, Yürüyen Çalışanlar ve Büyük Yazılı Hikaye Motoru

(function () {
  const sfx = window.sfx;
  const storyEvents = window.STORY_EVENTS || [];

  const SAVE_KEY = "son_istasyon_v6_tycoon";

  // Kalıcı İstasyon Verisi
  let data = {
    cash: 350,
    fuelStock: 240,
    tankLevel: 1, // max = 240 + (lvl-1)*160
    pumpsUnlocked: 1, // 1..3
    pumpSpeedLvl: 1, // 1..5
    marketLvl: 1, // 1..4
    carWashUnlocked: false,
    carWashLvl: 1,
    dumanHired: false,
    staff: {
      ali: 0, // 0 = yok, 1..4 seviye (Pompacı 1)
      murat: 0, // Pompacı 2
      zeynep: 0, // Market Kasiyeri
      kadir: 0 // Oto Yıkama Ustası
    },
    storyIndex: 0,
    totalServed: 0
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      Object.assign(data, p);
      if (p.staff) data.staff = Object.assign({ ali: 0, murat: 0, zeynep: 0, kadir: 0 }, p.staff);
    }
  } catch (_) {}

  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function maxFuelCapacity() {
    return 240 + (data.tankLevel - 1) * 180;
  }

  function stationLevel() {
    return (
      data.pumpsUnlocked +
      (data.carWashUnlocked ? 1 : 0) +
      Math.floor((data.pumpSpeedLvl + data.marketLvl + data.tankLevel) / 3) +
      (data.staff.ali > 0 ? 1 : 0) +
      (data.staff.zeynep > 0 ? 1 : 0)
    );
  }

  // DOM Elemanları
  const el = {
    startScreen: document.getElementById("startScreen"),
    startGameBtn: document.getElementById("startGameBtn"),
    toastBanner: document.getElementById("toastBanner"),
    cashText: document.getElementById("cashText"),
    fuelStockText: document.getElementById("fuelStockText"),
    stationLvlText: document.getElementById("stationLvlText"),
    musicBtn: document.getElementById("musicBtn"),
    muteBtn: document.getElementById("muteBtn"),
    liveHintText: document.getElementById("liveHintText"),
    storyProgressText: document.getElementById("storyProgressText"),
    canvas: document.getElementById("stationCanvas"),

    btnCallTanker: document.getElementById("btnCallTanker"),
    tankerCostSub: document.getElementById("tankerCostSub"),
    btnOpenUpgrades: document.getElementById("btnOpenUpgrades"),
    btnOpenStaff: document.getElementById("btnOpenStaff"),
    staffCountSub: document.getElementById("staffCountSub"),

    upgradesModal: document.getElementById("upgradesModal"),
    upCashText: document.getElementById("upCashText"),
    upgradesList: document.getElementById("upgradesList"),
    closeUpgradesBtn: document.getElementById("closeUpgradesBtn"),

    staffModal: document.getElementById("staffModal"),
    staffCashText: document.getElementById("staffCashText"),
    staffList: document.getElementById("staffList"),
    closeStaffBtn: document.getElementById("closeStaffBtn"),

    storyModal: document.getElementById("storyModal"),
    storyAvatarBox: document.getElementById("storyAvatarBox"),
    storyName: document.getElementById("storyName"),
    storyRole: document.getElementById("storyRole"),
    storyPlate: document.getElementById("storyPlate"),
    storySpeech: document.getElementById("storySpeech"),
    dumanStoryAlert: document.getElementById("dumanStoryAlert"),
    insIdBtn: document.getElementById("insIdBtn"),
    insTrunkBtn: document.getElementById("insTrunkBtn"),
    insMoneyBtn: document.getElementById("insMoneyBtn"),
    insPhoneBtn: document.getElementById("insPhoneBtn"),
    inspectResultBox: document.getElementById("inspectResultBox"),
    storyQuestionsBox: document.getElementById("storyQuestionsBox"),
    actServeBtn: document.getElementById("actServeBtn"),
    actHideBtn: document.getElementById("actHideBtn"),
    actLockBtn: document.getElementById("actLockBtn"),
    actPoliceBtn: document.getElementById("actPoliceBtn"),

    storyResultModal: document.getElementById("storyResultModal"),
    resTitle: document.getElementById("resTitle"),
    resBody: document.getElementById("resBody"),
    closeResBtn: document.getElementById("closeResBtn")
  };

  let toastTimer = null;
  function showToast(msg) {
    el.toastBanner.textContent = msg;
    el.toastBanner.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toastBanner.classList.add("hidden"), 2600);
  }

  // =========================================================================
  // HARİTA DÜNYASI SABİTLERİ (400 x 540 Mantıksal Koordinat Sistemi)
  // =========================================================================
  const WORLD_W = 400;
  const WORLD_H = 540;

  const PUMPS = [
    { idx: 0, x: 145, y: 196, carX: 145, carY: 238, unlockCost: 0, label: "POMPA 1" },
    { idx: 1, x: 245, y: 196, carX: 245, carY: 238, unlockCost: 300, label: "POMPA 2" },
    { idx: 2, x: 342, y: 196, carX: 342, carY: 238, unlockCost: 650, label: "POMPA 3 (LPG)" }
  ];

  const TANK_POS = { x: 48, y: 185, w: 64, h: 102 };
  const MARKET_POS = { x: 18, y: 365, w: 172, h: 138, doorX: 104, doorY: 365 };
  const WASH_POS = { x: 210, y: 365, w: 174, h: 138, carX: 297, carY: 432, unlockCost: 500 };

  // Canlı Oyun Varlıkları
  let running = false;
  let pointerHeldPump = -1;
  let highwayBgCars = [];
  let cars = [];
  let shoppers = []; // Arabadan markete yürüyen müşteriler
  let marketQueue = 0;
  let marketProgress = 0;
  let washCar = null;
  let tanker = null; // { x, y, state: 'entering'|'filling'|'leaving', progress }
  let policeCruiser = null; // { x, y, targetX, targetY, state, timer }
  let floatingTexts = [];
  let activeStoryCar = null;
  let carsSinceLastStory = 0;
  let spawnCooldown = 1.2;

  // Haritada Yürüyen Çalışanlar
  const workers = {
    ali: { x: 120, y: 310, color: "#f97316", hat: "#dc2626", name: "Ali", targetPump: -1 },
    murat: { x: 175, y: 310, color: "#38bdf8", hat: "#0284c7", name: "Murat", targetPump: -1 },
    zeynep: { x: 104, y: 430, color: "#ec4899", hat: "#be185d", name: "Zeynep" },
    kadir: { x: 255, y: 430, color: "#22c55e", hat: "#15803d", name: "Kadir" },
    duman: { x: 85, y: 135, dir: 1 }
  };

  function addFloatingText(x, y, text, color = "#4ade80") {
    floatingTexts.push({ x, y, text, color, life: 1.35 });
  }

  function tankerRefillCost() {
    const missing = maxFuelCapacity() - data.fuelStock;
    if (missing <= 5) return 0;
    return Math.max(40, Math.round(missing * 0.35));
  }

  function updateHUD() {
    el.cashText.textContent = Math.round(data.cash);
    el.fuelStockText.textContent = `${Math.round(data.fuelStock)}/${maxFuelCapacity()}`;
    el.stationLvlText.textContent = String(stationLevel());
    el.storyProgressText.textContent = `Hikaye: ${Math.min(data.storyIndex, storyEvents.length)}/${storyEvents.length}`;

    const tCost = tankerRefillCost();
    el.tankerCostSub.textContent = tCost === 0 ? "Depo Dolu ✓" : `İkmal Yap (${tCost}₺)`;
    el.btnCallTanker.classList.toggle("fuel-low", data.fuelStock < 45);

    const hiredCount =
      (data.staff.ali > 0 ? 1 : 0) +
      (data.staff.murat > 0 ? 1 : 0) +
      (data.staff.zeynep > 0 ? 1 : 0) +
      (data.staff.kadir > 0 ? 1 : 0);
    el.staffCountSub.textContent = `${hiredCount}/4 Çalışan`;
  }

  // =========================================================================
  // ARAÇ ÜRETİMİ VE TRAFİK AKIŞI
  // =========================================================================
  const CAR_COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#e2e8f0", "#a855f7", "#fb7185", "#38bdf8"];

  function trySpawnStationCar() {
    // Boş pompa bul
    const openPumps = [];
    for (let i = 0; i < data.pumpsUnlocked; i++) {
      const occupied = cars.some((c) => c.pumpIdx === i && c.state !== "leaving");
      if (!occupied) openPumps.push(i);
    }
    if (openPumps.length === 0) return;

    const chosenPump = openPumps[Math.floor(Math.random() * openPumps.length)];
    const p = PUMPS[chosenPump];

    // Her 3 normal araçtan sonra sıradaki Hikaye Müşterisi gelsin!
    const hasPendingStory = data.storyIndex < storyEvents.length;
    const anyStoryOnMap = cars.some((c) => c.isStory);
    const shouldSpawnStory = hasPendingStory && !anyStoryOnMap && carsSinceLastStory >= 2;

    if (shouldSpawnStory) {
      const ev = storyEvents[data.storyIndex % storyEvents.length];
      carsSinceLastStory = 0;
      cars.push({
        x: -40,
        y: 52,
        pumpIdx: chosenPump,
        targetX: p.carX,
        targetY: p.carY,
        color: ev.carColor,
        isTruck: ev.carShape === "truck" || ev.carShape === "van" || ev.carShape === "ambulance",
        state: "entering_road",
        fuelNeeded: 35,
        fuelFilled: 0,
        manualLatched: false,
        payAmount: ev.reward,
        isStory: true,
        storyEvent: ev
      });
      return;
    }

    carsSinceLastStory += 1;
    const isBig = chosenPump === 2 || Math.random() < 0.25;
    const fuelReq = isBig ? 42 : 28;
    const basePay = Math.round((isBig ? 135 : 95) + (data.pumpSpeedLvl - 1) * 18);

    cars.push({
      x: -40,
      y: 52,
      pumpIdx: chosenPump,
      targetX: p.carX,
      targetY: p.carY,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      isTruck: isBig,
      state: "entering_road", // entering_road -> parking -> waiting_fuel -> fueling -> shopping_wait -> leaving
      fuelNeeded: fuelReq,
      fuelFilled: 0,
      manualLatched: false,
      payAmount: basePay,
      wantsMarket: Math.random() < 0.55,
      wantsWash: data.carWashUnlocked && !washCar && Math.random() < 0.45,
      isStory: false,
      storyEvent: null
    });
  }

  // =========================================================================
  // TANKER ÇAĞIRMA (ANA YAKIT DEPOSU İKMALİ)
  // =========================================================================
  function callFuelTanker() {
    if (tanker) {
      showToast("🚛 Yakıt tankeri zaten yolda / dolum yapıyor!");
      return;
    }
    const cost = tankerRefillCost();
    if (cost === 0) {
      showToast("🛢️ Ana yakıt deposu zaten tam dolu!");
      return;
    }
    const actualCost = Math.min(data.cash, cost);
    if (data.cash < 25 && data.fuelStock < 15) {
      // Oyuncu parasız ve yakıtsız kalmasın diye acil avans ikmal!
      showToast("🚛 Patron acil yakıt ikmali gönderdi (Ücretsiz Destek)!");
    } else if (data.cash < cost) {
      if (data.cash < 40) {
        sfx.burnFail();
        showToast(`Tanker için en az 40 ₺ gerekli!`);
        return;
      }
    }

    const payNow = data.cash >= cost ? cost : data.cash >= 40 ? data.cash : 0;
    data.cash -= payNow;
    sfx.doorBell();
    tanker = { x: -70, y: 52, state: "entering", progress: 0 };
    showToast("🚛 Yakıt Tankeri istasyona giriyor!");
    updateHUD();
  }

  el.btnCallTanker.addEventListener("click", callFuelTanker);

  // =========================================================================
  // SİMÜLASYON GÜNCELLEME DÖNGÜSÜ (60 FPS)
  // =========================================================================
  function moveTowards(obj, tx, ty, speed, dt) {
    const dx = tx - obj.x;
    const dy = ty - obj.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= speed * dt) {
      obj.x = tx;
      obj.y = ty;
      return true;
    }
    obj.x += (dx / dist) * speed * dt;
    obj.y += (dy / dist) * speed * dt;
    return false;
  }

  function updateWorld(dt) {
    // Arka plan otoyol trafiği
    if (Math.random() < dt * 0.7 && highwayBgCars.length < 4) {
      highwayBgCars.push({
        x: WORLD_W + 40,
        y: 22,
        speed: 95 + Math.random() * 45,
        color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
      });
    }
    highwayBgCars.forEach((hc) => {
      hc.x -= hc.speed * dt;
    });
    highwayBgCars = highwayBgCars.filter((hc) => hc.x > -60);

    // Yeni müşteri aracı doğurma
    spawnCooldown -= dt;
    if (spawnCooldown <= 0) {
      trySpawnStationCar();
      spawnCooldown = Math.max(1.4, 3.2 - data.pumpsUnlocked * 0.55);
    }

    // Tanker Hareketi
    if (tanker) {
      if (tanker.state === "entering") {
        if (tanker.x < 82 && tanker.y < 60) {
          moveTowards(tanker, 82, 52, 115, dt);
        } else if (moveTowards(tanker, 92, 165, 95, dt)) {
          tanker.state = "filling";
          sfx.coffeeBrew();
        }
      } else if (tanker.state === "filling") {
        tanker.progress += dt * 0.7;
        data.fuelStock = Math.min(maxFuelCapacity(), data.fuelStock + dt * 160);
        if (data.fuelStock >= maxFuelCapacity() || tanker.progress >= 1.8) {
          data.fuelStock = maxFuelCapacity();
          tanker.state = "leaving";
          sfx.perfectHit();
          addFloatingText(60, 145, "🛢️ DEPO FULLENDİ!", "#38bdf8");
          saveGame();
        }
      } else if (tanker.state === "leaving") {
        if (tanker.y > 54) {
          moveTowards(tanker, 92, 52, 105, dt);
        } else if (moveTowards(tanker, WORLD_W + 80, 52, 130, dt)) {
          tanker = null;
        }
      }
    }

    // Polis Baskını Aracı Hareketi
    if (policeCruiser) {
      if (policeCruiser.state === "entering") {
        if (moveTowards(policeCruiser, policeCruiser.targetX, policeCruiser.targetY + 46, 175, dt)) {
          policeCruiser.state = "arresting";
          policeCruiser.timer = 1.1;
        }
      } else if (policeCruiser.state === "arresting") {
        policeCruiser.timer -= dt;
        if (policeCruiser.timer <= 0) {
          if (policeCruiser.suspectCar) {
            policeCruiser.suspectCar.state = "leaving";
          }
          policeCruiser.state = "leaving";
        }
      } else if (policeCruiser.state === "leaving") {
        if (moveTowards(policeCruiser, WORLD_W + 70, 52, 165, dt)) {
          policeCruiser = null;
        }
      }
    }

    // Bekçi Köpek Duman devriyesi
    if (data.dumanHired) {
      const threatCar = cars.find((c) => c.isStory && c.storyEvent.isThreat && c.state === "story_wait");
      if (threatCar) {
        moveTowards(workers.duman, threatCar.x - 28, threatCar.y + 10, 85, dt);
      } else {
        workers.duman.x += workers.duman.dir * 26 * dt;
        if (workers.duman.x > 135) workers.duman.dir = -1;
        if (workers.duman.x < 68) workers.duman.dir = 1;
        workers.duman.y = 132;
      }
    }

    // Pompacı Çalışanlar (Ali & Murat)
    ["ali", "murat"].forEach((wKey, idx) => {
      const lvl = data.staff[wKey];
      if (!lvl) return;
      const w = workers[wKey];

      // Başka pompacının bakmadığı, hikaye olmayan ve yakıt bekleyen araç bul
      const otherKey = idx === 0 ? "murat" : "ali";
      const targetCar = cars.find(
        (c) =>
          !c.isStory &&
          (c.state === "waiting_fuel" || c.state === "fueling") &&
          workers[otherKey].targetPump !== c.pumpIdx
      );

      if (targetCar) {
        w.targetPump = targetCar.pumpIdx;
        const p = PUMPS[targetCar.pumpIdx];
        const arrived = moveTowards(w, p.x - 24, p.carY, 90 + lvl * 22, dt);
        if (arrived && data.fuelStock > 0.5) {
          targetCar.state = "fueling";
          const rate = (10 + lvl * 5 + data.pumpSpeedLvl * 3) * dt;
          const used = Math.min(data.fuelStock, rate);
          targetCar.fuelFilled += used;
          data.fuelStock -= used;
        }
      } else {
        w.targetPump = -1;
        moveTowards(w, 122 + idx * 48, 315, 65, dt);
      }
    });

    // İstasyon Araçları Döngüsü
    cars.forEach((car) => {
      if (car.state === "entering_road") {
        if (moveTowards(car, 98, 52, 135, dt)) {
          car.state = "parking";
        }
      } else if (car.state === "parking") {
        if (moveTowards(car, car.targetX, car.targetY, 115, dt)) {
          if (car.isStory) {
            car.state = "story_wait";
            sfx.doorBell();
            el.liveHintText.textContent = `❗ ${car.storyEvent.name} istasyona geldi! Araca dokun!`;
            if (data.dumanHired && car.storyEvent.isThreat) {
              sfx.dogGrowl();
              showToast("🐕 Duman yeni gelen araca hırlıyor! Dikkat!");
            }
          } else {
            car.state = "waiting_fuel";
          }
        }
      } else if (car.state === "waiting_fuel" || car.state === "fueling") {
        const playerPressing = pointerHeldPump === car.pumpIdx || car.manualLatched;
        if (playerPressing) {
          if (data.fuelStock <= 0.5) {
            car.manualLatched = false;
            el.liveHintText.textContent = "🛢️ Ana yakıt depon bitti! Alttan Tanker Çağır!";
          } else {
            car.state = "fueling";
            const boost = pointerHeldPump === car.pumpIdx ? 2.1 : 1.15;
            const rate = (14 + data.pumpSpeedLvl * 5) * boost * dt;
            const used = Math.min(data.fuelStock, rate);
            car.fuelFilled += used;
            data.fuelStock -= used;
            if (Math.random() < 0.22) sfx.pumpTick(300 + (car.fuelFilled / car.fuelNeeded) * 240);
          }
        }

        if (car.fuelFilled >= car.fuelNeeded) {
          car.fuelFilled = car.fuelNeeded;
          car.manualLatched = false;
          data.cash += car.payAmount;
          data.totalServed += 1;
          sfx.cashRegister();
          addFloatingText(car.x, car.y - 26, `+${car.payAmount} ₺`, "#4ade80");
          saveGame();

          if (car.wantsMarket && marketQueue < 3) {
            car.state = "shopping_wait";
            shoppers.push({
              x: car.x - 14,
              y: car.y + 8,
              carRef: car,
              phase: "to_market"
            });
          } else if (car.wantsWash && data.carWashUnlocked && !washCar) {
            car.state = "going_wash";
            washCar = car;
          } else {
            car.state = "leaving";
          }
        }
      } else if (car.state === "going_wash") {
        if (moveTowards(car, WASH_POS.carX, WASH_POS.carY, 105, dt)) {
          car.state = "washing";
          car.washProg = 0;
          car.washManual = false;
        }
      } else if (car.state === "washing") {
        const autoSpeed = data.staff.kadir > 0 ? 28 + data.staff.kadir * 12 : 0;
        const manualSpeed = car.washManual ? 42 : 0;
        if (autoSpeed + manualSpeed > 0) {
          car.washProg += (autoSpeed + manualSpeed) * dt;
          if (car.washProg >= 100) {
            const washPay = 110 + (data.carWashLvl - 1) * 35;
            data.cash += washPay;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 25, `🚿 +${washPay} ₺`, "#38bdf8");
            washCar = null;
            car.state = "leaving";
            saveGame();
          }
        }
      } else if (car.state === "leaving") {
        if (car.y > 54 && car.x < 355) {
          moveTowards(car, 365, 115, 125, dt);
        } else if (car.y > 54) {
          moveTowards(car, 365, 52, 125, dt);
        } else if (moveTowards(car, WORLD_W + 65, 52, 145, dt)) {
          car.remove = true;
        }
      }
    });
    cars = cars.filter((c) => !c.remove);

    // Markete Yürüyen Müşteriler & Kasiyer Zeynep
    shoppers.forEach((sh) => {
      if (sh.phase === "to_market") {
        if (moveTowards(sh, MARKET_POS.doorX, MARKET_POS.doorY + 12, 78, dt)) {
          sh.phase = "inside";
          marketQueue += 1;
        }
      } else if (sh.phase === "back_to_car") {
        if (moveTowards(sh, sh.carRef.x, sh.carRef.y, 85, dt)) {
          sh.done = true;
          sh.carRef.state = "leaving";
        }
      }
    });
    shoppers = shoppers.filter((s) => !s.done);

    if (marketQueue > 0) {
      const zeynepRate = data.staff.zeynep > 0 ? 35 + data.staff.zeynep * 16 : 0;
      if (zeynepRate > 0) {
        marketProgress += zeynepRate * dt;
        workers.zeynep.x = 95 + Math.sin(Date.now() * 0.006) * 22;
        if (marketProgress >= 100) {
          completeOneMarketSale();
        }
      }
    }

    if (data.staff.kadir > 0 && washCar && washCar.state === "washing") {
      workers.kadir.x = WASH_POS.carX - 36 + Math.sin(Date.now() * 0.008) * 8;
    }

    // Uçan Para Yazıları
    floatingTexts.forEach((ft) => {
      ft.y -= 28 * dt;
      ft.life -= dt;
    });
    floatingTexts = floatingTexts.filter((ft) => ft.life > 0);

    updateHUD();
  }

  function completeOneMarketSale() {
    if (marketQueue <= 0) return;
    marketQueue -= 1;
    marketProgress = 0;
    const sale = 65 + (data.marketLvl - 1) * 25;
    data.cash += sale;
    sfx.cashRegister();
    addFloatingText(MARKET_POS.doorX, MARKET_POS.y - 10, `☕ +${sale} ₺`, "#fde68a");
    const waitingShopper = shoppers.find((s) => s.phase === "inside");
    if (waitingShopper) waitingShopper.phase = "back_to_car";
    saveGame();
  }

  // =========================================================================
  // RETİNA HARİTA ÇİZİM MOTORU
  // =========================================================================
  const ctx = el.canvas.getContext("2d");

  function drawRoundRect(x, y, w, h, r, fill, stroke, lineW = 2) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineW;
      ctx.stroke();
    }
  }

  function drawVehicleOnMap(x, y, color, isTruck, horizontal = false) {
    ctx.save();
    ctx.translate(x, y);
    if (horizontal) ctx.rotate(-Math.PI / 2);

    const w = isTruck ? 32 : 26;
    const h = isTruck ? 56 : 44;

    // Far Işığı Hüzmesi
    const grad = ctx.createLinearGradient(0, -h / 2, 0, -h / 2 - 28);
    grad.addColorStop(0, "rgba(254, 240, 138, 0.42)");
    grad.addColorStop(1, "rgba(254, 240, 138, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 2, -h / 2);
    ctx.lineTo(-w / 2 - 10, -h / 2 - 28);
    ctx.lineTo(w / 2 + 10, -h / 2 - 28);
    ctx.lineTo(w / 2 - 2, -h / 2);
    ctx.closePath();
    ctx.fill();

    // Gövde
    drawRoundRect(-w / 2, -h / 2, w, h, 7, color, "#050811", 2.5);
    // Ön ve arka cam
    drawRoundRect(-w / 2 + 4, -h / 2 + 8, w - 8, 11, 3, "#7dd3fc", null);
    if (!isTruck) {
      drawRoundRect(-w / 2 + 5, h / 2 - 14, w - 10, 8, 2, "#38bdf8", null);
    }
    ctx.restore();
  }

  function drawWorkerSprite(x, y, bodyCol, hatCol, label) {
    ctx.save();
    ctx.translate(x, y);
    // Gölge
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Gövde & Baş
    drawRoundRect(-8, -4, 16, 14, 5, bodyCol, "#050811", 2);
    ctx.beginPath();
    ctx.arc(0, -10, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#fad2b4";
    ctx.fill();
    ctx.strokeStyle = "#050811";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Şapka
    drawRoundRect(-7, -17, 14, 5, 2, hatCol, "#050811", 1.5);
    // İsim Etiketi
    ctx.font = "900 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(label, 0, 22);
    ctx.restore();
  }

  function renderMap() {
    const dpr = window.devicePixelRatio || 1;
    const cw = el.canvas.clientWidth || 400;
    const ch = el.canvas.clientHeight || 540;
    if (el.canvas.width !== Math.round(cw * dpr) || el.canvas.height !== Math.round(ch * dpr)) {
      el.canvas.width = Math.round(cw * dpr);
      el.canvas.height = Math.round(ch * dpr);
    }

    ctx.save();
    ctx.scale((cw * dpr) / WORLD_W, (ch * dpr) / WORLD_H);

    // 1. Zemin (Gece Çimi & İstasyon Asfaltı)
    ctx.fillStyle = "#0c1829";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // İstasyon Sahası Asfaltı
    drawRoundRect(8, 76, 384, 448, 16, "#1b2436", "#334155", 2);

    // 2. Üst Gece Otoyolu
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, WORLD_W, 74);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(0, 37);
    ctx.lineTo(WORLD_W, 37);
    ctx.stroke();
    ctx.setLineDash([]);

    // Giriş ve Çıkış Asfalt Rampaları
    ctx.fillStyle = "#1b2436";
    ctx.fillRect(72, 68, 48, 22);
    ctx.fillRect(340, 68, 44, 22);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "900 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⬇ GİRİŞ", 96, 86);
    ctx.fillText("⬆ ÇIKIŞ", 362, 86);

    // Otoyoldan geçen araçlar
    highwayBgCars.forEach((hc) => drawVehicleOnMap(hc.x, hc.y, hc.color, false, true));

    // 3. Sol Köşe: ANA YAKIT TANKI
    drawRoundRect(TANK_POS.x - 32, TANK_POS.y - 52, TANK_POS.w, TANK_POS.h, 12, "#0f172a", "#475569", 2.5);
    const fuelPct = Math.max(0, Math.min(1, data.fuelStock / maxFuelCapacity()));
    const barH = 62 * fuelPct;
    ctx.fillStyle = fuelPct < 0.22 ? "#ef4444" : "#22c55e";
    ctx.fillRect(TANK_POS.x - 22, TANK_POS.y - 24 + (62 - barH), 44, barH);
    ctx.strokeStyle = "#cbd5e1";
    ctx.strokeRect(TANK_POS.x - 22, TANK_POS.y - 24, 44, 62);
    ctx.fillStyle = "#fde68a";
    ctx.font = "900 11px sans-serif";
    ctx.fillText("ANA DEPO", TANK_POS.x, TANK_POS.y - 34);
    ctx.fillStyle = "#fff";
    ctx.fillText(`%${Math.round(fuelPct * 100)}`, TANK_POS.x, TANK_POS.y + 12);

    // Tanker varsa çiz
    if (tanker) {
      drawVehicleOnMap(tanker.x, tanker.y, "#ea580c", true, tanker.y < 65);
      if (tanker.state === "filling") {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tanker.x - 14, tanker.y);
        ctx.lineTo(TANK_POS.x + 22, TANK_POS.y);
        ctx.stroke();
      }
    }

    // 4. POMPA ADALARI (1, 2, 3)
    PUMPS.forEach((p, idx) => {
      const unlocked = idx < data.pumpsUnlocked;
      if (unlocked) {
        // Neon Kanopi Çatısı ve Pompa Cihazı
        drawRoundRect(p.x - 38, p.y - 34, 76, 36, 8, "#0f172a", "#ff3358", 2.5);
        drawRoundRect(p.x - 16, p.y - 26, 32, 20, 4, "#e11d48", "#fde68a", 1.5);
        ctx.fillStyle = "#fff";
        ctx.font = "900 11px sans-serif";
        ctx.fillText(`P-${idx + 1}`, p.x, p.y - 12);

        // Yerdeki Park Çizgisi
        ctx.strokeStyle = "rgba(253, 230, 138, 0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.carX - 24, p.carY - 32, 48, 64);
      } else {
        // Kilitli Pompa İnşaat Alanı (Dokununca Kurulur!)
        ctx.setLineDash([6, 4]);
        drawRoundRect(p.x - 40, p.y - 26, 80, 96, 10, "rgba(15, 23, 42, 0.65)", "#f59e0b", 2);
        ctx.setLineDash([]);
        ctx.fillStyle = "#fde68a";
        ctx.font = "900 11.5px sans-serif";
        ctx.fillText(`🔒 ${p.label}`, p.x, p.y + 8);
        ctx.fillStyle = "#4ade80";
        ctx.font = "900 13px sans-serif";
        ctx.fillText(`KUR: ${p.unlockCost}₺`, p.x, p.y + 28);
      }
    });

    // 5. SOL ALT: 7/24 GECE MARKETİ & BÜFE BİNASI
    drawRoundRect(MARKET_POS.x, MARKET_POS.y, MARKET_POS.w, MARKET_POS.h, 14, "#291d14", "#f59e0b", 3);
    // Işıklı Cam Vitrin
    drawRoundRect(MARKET_POS.x + 14, MARKET_POS.y + 34, MARKET_POS.w - 28, 44, 6, "#fef3c7", "#090d1a", 2);
    ctx.fillStyle = "#fde68a";
    ctx.font = "900 13px sans-serif";
    ctx.fillText(`🏪 7/24 BÜFE & MARKET (Sv.${data.marketLvl})`, MARKET_POS.x + MARKET_POS.w / 2, MARKET_POS.y + 22);

    if (marketQueue > 0 && data.staff.zeynep === 0) {
      // Kasiyer yoksa oyuncunun dokunması için büyük balon!
      drawRoundRect(MARKET_POS.x + 22, MARKET_POS.y + 88, 128, 34, 9, "#16a34a", "#fff", 2);
      ctx.fillStyle = "#fff";
      ctx.font = "900 12.5px sans-serif";
      ctx.fillText(`☕ SATIŞ YAP (${marketQueue})`, MARKET_POS.x + 86, MARKET_POS.y + 109);
    } else {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "800 11.5px sans-serif";
      ctx.fillText(
        data.staff.zeynep > 0 ? `👩‍🍳 Zeynep Kasada Çalışıyor` : "Müşteri Bekleniyor",
        MARKET_POS.x + MARKET_POS.w / 2,
        MARKET_POS.y + 108
      );
    }

    // 6. SAĞ ALT: OTO YIKAMA & TAMİR BİNASI
    if (data.carWashUnlocked) {
      drawRoundRect(WASH_POS.x, WASH_POS.y, WASH_POS.w, WASH_POS.h, 14, "#0c2d48", "#38bdf8", 3);
      ctx.fillStyle = "#bae6fd";
      ctx.font = "900 13px sans-serif";
      ctx.fillText(`🚿 OTO YIKAMA (Sv.${data.carWashLvl})`, WASH_POS.x + WASH_POS.w / 2, WASH_POS.y + 22);

      // Yıkama Tüneli Zemini
      drawRoundRect(WASH_POS.x + 48, WASH_POS.y + 34, 78, 92, 8, "#081c2e", "#0284c7", 2);
    } else {
      ctx.setLineDash([7, 5]);
      drawRoundRect(WASH_POS.x, WASH_POS.y, WASH_POS.w, WASH_POS.h, 14, "rgba(15, 23, 42, 0.7)", "#38bdf8", 2.5);
      ctx.setLineDash([]);
      ctx.fillStyle = "#bae6fd";
      ctx.font = "900 14px sans-serif";
      ctx.fillText("🔒 🚿 OTO YIKAMA KUR", WASH_POS.x + WASH_POS.w / 2, WASH_POS.y + 62);
      ctx.fillStyle = "#4ade80";
      ctx.font = "900 16px sans-serif";
      ctx.fillText(`${WASH_POS.unlockCost} ₺ (Dokun Aç)`, WASH_POS.x + WASH_POS.w / 2, WASH_POS.y + 88);
    }

    // 7. İSTASYON ARAÇLARI, HORTUMLAR VE DOLUM BALONLARI
    cars.forEach((car) => {
      const horiz = car.y < 66;
      drawVehicleOnMap(car.x, car.y, car.color, car.isTruck, horiz);

      // Pompadan Arabaya Uzanan Siyah Yakıt Hortumu!
      if (car.state === "fueling") {
        const p = PUMPS[car.pumpIdx];
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + 18, p.y + 20, car.x + 10, car.y - 6);
        ctx.stroke();
      }

      // Yıkamadaki arabanın üstünde dönen mavi köpük fırçaları!
      if (car.state === "washing") {
        const spin = Date.now() * 0.01;
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.beginPath();
        ctx.arc(car.x - 16, car.y + Math.sin(spin) * 12, 10, 0, Math.PI * 2);
        ctx.arc(car.x + 16, car.y - Math.sin(spin) * 12, 10, 0, Math.PI * 2);
        ctx.fill();

        if (data.staff.kadir === 0 && !car.washManual) {
          drawRoundRect(car.x - 46, car.y - 44, 92, 28, 8, "#0284c7", "#fff", 2);
          ctx.fillStyle = "#fff";
          ctx.font = "900 12px sans-serif";
          ctx.fillText("🚿 YIKA!", car.x, car.y - 26);
        } else {
          drawRoundRect(car.x - 34, car.y - 40, 68, 10, 5, "#090d1a", "#38bdf8", 1.5);
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(car.x - 32, car.y - 38, 64 * (car.washProg / 100), 6);
        }
      }

      // ÖZEL HİKAYE ARACI BALONU (BÜYÜK KIRMIZI ❗)
      if (car.state === "story_wait") {
        const bounce = Math.sin(Date.now() * 0.008) * 4;
        drawRoundRect(car.x - 52, car.y - 54 + bounce, 104, 32, 9, "#dc2626", "#fef08a", 2.5);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 13px sans-serif";
        ctx.fillText("❗ ÖZEL MÜŞTERİ", car.x, car.y - 33 + bounce);
      }

      // NORMAL YAKIT DOLUM BALONU & İLERLEME BARI
      if (!car.isStory && (car.state === "waiting_fuel" || car.state === "fueling")) {
        const pct = Math.min(1, car.fuelFilled / car.fuelNeeded);
        if (pct < 0.02 && data.staff.ali === 0 && data.staff.murat === 0) {
          drawRoundRect(car.x - 46, car.y - 50, 92, 28, 8, "#16a34a", "#fef08a", 2);
          ctx.fillStyle = "#fff";
          ctx.font = "900 12px sans-serif";
          ctx.fillText("⛽ BENZİN KOY", car.x, car.y - 32);
        } else {
          drawRoundRect(car.x - 36, car.y - 44, 72, 13, 6, "#090d1a", "#fff", 1.5);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(car.x - 34, car.y - 42, 68 * pct, 9);
        }
      }
    });

    // Polis Baskını Otosu Çizimi
    if (policeCruiser) {
      drawVehicleOnMap(policeCruiser.x, policeCruiser.y, "#1e3a8a", false, policeCruiser.y < 65);
      const flash = Math.floor(Date.now() / 120) % 2 === 0;
      ctx.fillStyle = flash ? "#ef4444" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(policeCruiser.x, policeCruiser.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Yürüyen Market Müşterileri
    shoppers.forEach((sh) => {
      if (sh.phase !== "inside") {
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
      }
    });

    // 8. YÜRÜYEN ÇALIŞANLAR VE BEKÇİ DUMAN
    if (data.staff.ali > 0) drawWorkerSprite(workers.ali.x, workers.ali.y, workers.ali.color, workers.ali.hat, "👷 Ali");
    if (data.staff.murat > 0) drawWorkerSprite(workers.murat.x, workers.murat.y, workers.murat.color, workers.murat.hat, "👷 Murat");
    if (data.staff.zeynep > 0) drawWorkerSprite(workers.zeynep.x, workers.zeynep.y, workers.zeynep.color, workers.zeynep.hat, "👩‍🍳 Zeynep");
    if (data.staff.kadir > 0 && data.carWashUnlocked) drawWorkerSprite(workers.kadir.x, workers.kadir.y, workers.kadir.color, workers.kadir.hat, "🔧 Kadir");

    if (data.dumanHired) {
      ctx.save();
      ctx.translate(workers.duman.x, workers.duman.y);
      drawRoundRect(-11, -7, 22, 14, 6, "#d97706", "#050811", 2);
      ctx.font = "900 11px sans-serif";
      ctx.fillStyle = "#fde68a";
      ctx.fillText("🐕 Duman", 0, -11);
      ctx.restore();
    }

    // 9. UÇAN KAZANÇ YAZILARI
    floatingTexts.forEach((ft) => {
      ctx.globalAlpha = Math.min(1, ft.life);
      ctx.font = "900 16px sans-serif";
      ctx.strokeStyle = "#050811";
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }

  // =========================================================================
  // HARİTAYA DOKUNMA / BASILI TUTMA KONTROLLERİ
  // =========================================================================
  function getLogicalCoords(e) {
    const rect = el.canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return {
      x: (cx / rect.width) * WORLD_W,
      y: (cy / rect.height) * WORLD_H
    };
  }

  el.canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const pt = getLogicalCoords(e);

    // 1. Ana Yakıt Tankına dokunuldu mu?
    if (Math.abs(pt.x - TANK_POS.x) < 38 && Math.abs(pt.y - TANK_POS.y) < 58) {
      callFuelTanker();
      return;
    }

    // 2. Pompa Adalarına veya Pompadaki Araçlara dokunuldu mu?
    for (let i = 0; i < PUMPS.length; i++) {
      const p = PUMPS[i];
      if (Math.abs(pt.x - p.x) < 46 && pt.y > p.y - 42 && pt.y < p.carY + 46) {
        // Kilitli pompaysa doğrudan satın al!
        if (i >= data.pumpsUnlocked) {
          if (i > data.pumpsUnlocked) {
            showToast(`Önce Pompa ${data.pumpsUnlocked + 1}'i kurmalısın!`);
            return;
          }
          if (data.cash >= p.unlockCost) {
            data.cash -= p.unlockCost;
            data.pumpsUnlocked += 1;
            sfx.perfectHit();
            addFloatingText(p.x, p.y, `🎉 ${p.label} AÇILDI!`, "#fde68a");
            saveGame();
            updateHUD();
          } else {
            sfx.burnFail();
            showToast(`${p.label} için ${p.unlockCost} ₺ gerekli!`);
          }
          return;
        }

        // Açık pompadaki aracı bul
        const carAtPump = cars.find((c) => c.pumpIdx === i && c.state !== "leaving" && c.state !== "entering_road");
        if (carAtPump) {
          if (carAtPump.state === "story_wait") {
            openStoryEncounter(carAtPump);
            return;
          }
          if (data.fuelStock <= 1) {
            sfx.burnFail();
            showToast("🛢️ Ana yakıt deposu boş! Alttan Tanker Çağır!");
            return;
          }
          pointerHeldPump = i;
          carAtPump.manualLatched = true; // Tek dokunuşta hortumu takar, basılı tutarsa ekstra hızlanır!
          sfx.tap();
          el.liveHintText.textContent = "⛽ Yakıt doluyor! (Basılı tutarsan 2 kat hızlı dolar!)";
        }
        return;
      }
    }

    // 3. Market Binasına dokunuldu mu?
    if (
      pt.x >= MARKET_POS.x &&
      pt.x <= MARKET_POS.x + MARKET_POS.w &&
      pt.y >= MARKET_POS.y &&
      pt.y <= MARKET_POS.y + MARKET_POS.h
    ) {
      if (marketQueue > 0) {
        completeOneMarketSale();
      } else {
        openUpgradesModal();
      }
      return;
    }

    // 4. Oto Yıkama Alanına dokunuldu mu?
    if (
      pt.x >= WASH_POS.x &&
      pt.x <= WASH_POS.x + WASH_POS.w &&
      pt.y >= WASH_POS.y &&
      pt.y <= WASH_POS.y + WASH_POS.h
    ) {
      if (!data.carWashUnlocked) {
        if (data.cash >= WASH_POS.unlockCost) {
          data.cash -= WASH_POS.unlockCost;
          data.carWashUnlocked = true;
          sfx.perfectHit();
          addFloatingText(WASH_POS.carX, WASH_POS.y + 40, "🚿 OTO YIKAMA AÇILDI!", "#38bdf8");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Oto Yıkama için ${WASH_POS.unlockCost} ₺ gerekli!`);
        }
        return;
      }
      if (washCar && washCar.state === "washing") {
        washCar.washManual = true;
        sfx.waterGrab ? sfx.waterGrab() : sfx.tap();
        showToast("🚿 Köpüklü yıkama başladı!");
      }
    }
  });

  window.addEventListener("pointerup", () => {
    pointerHeldPump = -1;
  });
  window.addEventListener("pointercancel", () => {
    pointerHeldPump = -1;
  });

  // =========================================================================
  // İSTASYON GELİŞTİRME VE ÇALIŞAN MENÜLERİ
  // =========================================================================
  function openUpgradesModal() {
    sfx.tap();
    el.upCashText.textContent = Math.round(data.cash);
    el.upgradesList.innerHTML = "";

    const items = [
      {
        title: `⛽ Yeni Pompa Adası Aç (${data.pumpsUnlocked}/3)`,
        desc: "Aynı anda daha fazla araca benzin koyup kazancını katla!",
        done: data.pumpsUnlocked >= 3,
        cost: data.pumpsUnlocked === 1 ? 300 : 650,
        buy: () => {
          data.pumpsUnlocked += 1;
        }
      },
      {
        title: `⚡ Pompa Dolum Hızı (Sv.${data.pumpSpeedLvl}/5)`,
        desc: "Pompalar çok daha hızlı benzin basar ve araç başı kazanç +18 ₺ artar.",
        done: data.pumpSpeedLvl >= 5,
        cost: 180 + (data.pumpSpeedLvl - 1) * 140,
        buy: () => {
          data.pumpSpeedLvl += 1;
        }
      },
      {
        title: `🛢️ Ana Yakıt Deposunu Büyüt (Sv.${data.tankLevel}/5)`,
        desc: `Kapasiteyi +180L artırır (Şu an: ${maxFuelCapacity()}L) ve depoyu anında doldurur!`,
        done: data.tankLevel >= 5,
        cost: 220 + (data.tankLevel - 1) * 160,
        buy: () => {
          data.tankLevel += 1;
          data.fuelStock = maxFuelCapacity();
        }
      },
      {
        title: data.carWashUnlocked ? `🚿 Oto Yıkama Kalitesi (Sv.${data.carWashLvl}/4)` : "🚿 Oto Yıkama & Bakım Tesisi Kur",
        desc: data.carWashUnlocked ? "Yıkama gelirini +35 ₺ artırır." : "Haritanın sağ altına köpüklü oto yıkama tüneli kurar!",
        done: data.carWashUnlocked && data.carWashLvl >= 4,
        cost: data.carWashUnlocked ? 260 + (data.carWashLvl - 1) * 160 : WASH_POS.unlockCost,
        buy: () => {
          if (!data.carWashUnlocked) data.carWashUnlocked = true;
          else data.carWashLvl += 1;
        }
      },
      {
        title: `🏪 7/24 Büfe & Market Büyüt (Sv.${data.marketLvl}/4)`,
        desc: "Kahve ve tost satışından gelen geliri araç başı +25 ₺ artırır.",
        done: data.marketLvl >= 4,
        cost: 200 + (data.marketLvl - 1) * 150,
        buy: () => {
          data.marketLvl += 1;
        }
      }
    ];

    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${it.title}</h3><p>${it.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (it.done) {
        btn.disabled = true;
        btn.textContent = "MAKS ✓";
      } else {
        btn.textContent = `${it.cost} ₺`;
        btn.addEventListener("click", () => {
          if (data.cash < it.cost) {
            sfx.burnFail();
            showToast("Kasada yeterli para yok!");
            return;
          }
          data.cash -= it.cost;
          it.buy();
          sfx.perfectHit();
          saveGame();
          updateHUD();
          openUpgradesModal();
        });
      }
      card.appendChild(btn);
      el.upgradesList.appendChild(card);
    });

    el.upgradesModal.classList.remove("hidden");
  }

  function openStaffModal() {
    sfx.tap();
    el.staffCashText.textContent = Math.round(data.cash);
    el.staffList.innerHTML = "";

    const staffDefs = [
      {
        key: "ali",
        title: data.staff.ali > 0 ? `👷 Pompacı Ali (Sv.${data.staff.ali}/4)` : "👷 Pompacı Ali'yi İşe Al",
        desc: "Haritada yürüyerek pompalardaki araçlara senin yerine otomatik benzin koyar!",
        done: data.staff.ali >= 4,
        cost: data.staff.ali === 0 ? 280 : 220 * data.staff.ali
      },
      {
        key: "zeynep",
        title: data.staff.zeynep > 0 ? `👩‍🍳 Kasiyer Zeynep (Sv.${data.staff.zeynep}/4)` : "👩‍🍳 Kasiyer Zeynep'i İşe Al",
        desc: "7/24 Market binasında bekler; içeri giren müşterilere otomatik satış yapar!",
        done: data.staff.zeynep >= 4,
        cost: data.staff.zeynep === 0 ? 340 : 240 * data.staff.zeynep
      },
      {
        key: "murat",
        title: data.staff.murat > 0 ? `👷 2. Pompacı Murat (Sv.${data.staff.murat}/4)` : "👷 2. Pompacı Murat'ı İşe Al",
        desc: "Çoklu pompalarda Ali'ye yetişir, yoğun trafiği eritir!",
        done: data.staff.murat >= 4,
        cost: data.staff.murat === 0 ? 480 : 260 * data.staff.murat
      },
      {
        key: "kadir",
        title: data.staff.kadir > 0 ? `🔧 Yıkama Ustası Kadir (Sv.${data.staff.kadir}/4)` : "🔧 Yıkama Ustası Kadir'i İşe Al",
        desc: "Oto yıkamaya giren araçları elini sürmeden köpükleyip yıkar!",
        done: data.staff.kadir >= 4,
        cost: data.staff.kadir === 0 ? 420 : 250 * data.staff.kadir
      },
      {
        key: "duman",
        title: data.dumanHired ? "🐕 Bekçi Köpek Duman (Görevde ❤️)" : "🐕 Bekçi Köpek Duman'ı Sahiplen",
        desc: "İstasyon girişinde nöbet tutar; tehlikeli ve sahtekâr hikaye araçlarına hırlayarak seni uyarır!",
        done: data.dumanHired,
        cost: 150
      }
    ];

    staffDefs.forEach((st) => {
      const card = document.createElement("div");
      card.className = "upgrade-card";
      card.innerHTML = `<div class="up-info"><h3>${st.title}</h3><p>${st.desc}</p></div>`;
      const btn = document.createElement("button");
      btn.className = "up-buy-btn";
      if (st.done) {
        btn.disabled = true;
        btn.textContent = "TAMAM ✓";
      } else {
        btn.textContent = `${st.cost} ₺`;
        btn.addEventListener("click", () => {
          if (data.cash < st.cost) {
            sfx.burnFail();
            showToast("Kasada yeterli para yok!");
            return;
          }
          data.cash -= st.cost;
          if (st.key === "duman") {
            data.dumanHired = true;
            sfx.dogBark();
          } else {
            data.staff[st.key] += 1;
            sfx.perfectHit();
          }
          saveGame();
          updateHUD();
          openStaffModal();
        });
      }
      card.appendChild(btn);
      el.staffList.appendChild(card);
    });

    el.staffModal.classList.remove("hidden");
  }

  el.btnOpenUpgrades.addEventListener("click", openUpgradesModal);
  el.closeUpgradesBtn.addEventListener("click", () => el.upgradesModal.classList.add("hidden"));
  el.btnOpenStaff.addEventListener("click", openStaffModal);
  el.closeStaffBtn.addEventListener("click", () => el.staffModal.classList.add("hidden"));

  // =========================================================================
  // BÜYÜK YAZILI ÖZEL HİKAYE MÜŞTERİSİ EKRANI
  // =========================================================================
  function openStoryEncounter(carObj) {
    activeStoryCar = carObj;
    const ev = carObj.storyEvent;
    sfx.tap();

    el.storyAvatarBox.innerHTML = window.renderPortraitSVG(ev.look, "neutral");
    el.storyName.textContent = ev.name;
    el.storyRole.textContent = ev.role;
    el.storyPlate.textContent = `TR • ${ev.plate}`;
    el.storySpeech.textContent = `"${ev.speech}"`;

    if (data.dumanHired) {
      el.dumanStoryAlert.style.display = "block";
      el.dumanStoryAlert.textContent = ev.isThreat
        ? "🐕 DUMAN HIRLIYOR! Bu müşteride bir tekinsizlik veya sahtekârlık var, dikkatli incele!"
        : "🐕 Duman kuyruk sallıyor: Bu müşteri zararsız veya yardıma muhtaç görünüyor.";
      el.dumanStoryAlert.style.borderColor = ev.isThreat ? "#ef4444" : "#22c55e";
      el.dumanStoryAlert.style.color = ev.isThreat ? "#fecaca" : "#bbf7d0";
    } else {
      el.dumanStoryAlert.style.display = "none";
    }

    el.inspectResultBox.style.display = "none";
    [el.insIdBtn, el.insTrunkBtn, el.insMoneyBtn, el.insPhoneBtn].forEach((b) => b.classList.remove("checked"));
    el.insPhoneBtn.style.display = ev.clues.phoneText ? "block" : "none";

    el.storyQuestionsBox.innerHTML = "";
    ev.questions.forEach((qObj) => {
      const qb = document.createElement("button");
      qb.className = "story-q-btn";
      qb.textContent = `💬 ${qObj.q}`;
      qb.addEventListener("click", () => {
        sfx.tap();
        el.storySpeech.textContent = `"${qObj.a}"`;
        el.storyAvatarBox.innerHTML = window.renderPortraitSVG(ev.look, qObj.mood || "neutral");
      });
      el.storyQuestionsBox.appendChild(qb);
    });

    el.storyModal.classList.remove("hidden");
  }

  function showClueText(btn, text) {
    sfx.flashlightClick();
    btn.classList.add("checked");
    el.inspectResultBox.textContent = text;
    el.inspectResultBox.style.display = "block";
  }

  el.insIdBtn.addEventListener("click", () => {
    if (activeStoryCar) showClueText(el.insIdBtn, activeStoryCar.storyEvent.clues.idText);
  });
  el.insTrunkBtn.addEventListener("click", () => {
    if (activeStoryCar) showClueText(el.insTrunkBtn, activeStoryCar.storyEvent.clues.trunkText);
  });
  el.insMoneyBtn.addEventListener("click", () => {
    if (activeStoryCar) showClueText(el.insMoneyBtn, activeStoryCar.storyEvent.clues.moneyText);
  });
  el.insPhoneBtn.addEventListener("click", () => {
    if (activeStoryCar && activeStoryCar.storyEvent.clues.phoneText) {
      showClueText(el.insPhoneBtn, activeStoryCar.storyEvent.clues.phoneText);
    }
  });

  function resolveStoryChoice(choice) {
    if (!activeStoryCar) return;
    const ev = activeStoryCar.storyEvent;
    const isCorrect = ev.correctChoices.includes(choice);

    el.storyModal.classList.add("hidden");

    if (choice === "police") {
      sfx.policeSiren();
      policeCruiser = {
        x: 75,
        y: 52,
        targetX: activeStoryCar.x,
        targetY: activeStoryCar.y,
        suspectCar: activeStoryCar,
        state: "entering",
        timer: 1.2
      };
    } else {
      activeStoryCar.state = "leaving";
    }

    if (isCorrect) {
      data.cash += ev.reward;
      data.storyIndex += 1;
      if (choice !== "police") sfx.perfectHit();
      addFloatingText(activeStoryCar.x, activeStoryCar.y - 25, `🌟 +${ev.reward} ₺`, "#fde68a");
      el.resTitle.textContent = `✅ DOĞRU KARAR! (+${ev.reward} ₺)`;
      el.resTitle.style.color = "#4ade80";
      el.resBody.textContent = ev.successMsg;
    } else {
      const pen = 140;
      data.cash = Math.max(0, data.cash - pen);
      sfx.burnFail();
      el.resTitle.textContent = `❌ YANLIŞ KARAR! (-${pen} ₺)`;
      el.resTitle.style.color = "#f87171";
      el.resBody.textContent = ev.failMsg;
    }

    el.liveHintText.textContent = "👆 İstasyon haritasında araçlara yakıt doldurmaya devam et!";
    activeStoryCar = null;
    saveGame();
    updateHUD();
    el.storyResultModal.classList.remove("hidden");
  }

  el.actServeBtn.addEventListener("click", () => resolveStoryChoice("serve"));
  el.actHideBtn.addEventListener("click", () => resolveStoryChoice("hide"));
  el.actLockBtn.addEventListener("click", () => resolveStoryChoice("lock"));
  el.actPoliceBtn.addEventListener("click", () => resolveStoryChoice("police"));
  el.closeResBtn.addEventListener("click", () => {
    sfx.tap();
    el.storyResultModal.classList.add("hidden");
  });

  // Ses ve Müzik Butonları
  el.musicBtn.addEventListener("click", () => {
    const on = sfx.toggleMusic();
    el.musicBtn.textContent = on ? "🎵" : "🔕";
  });
  el.muteBtn.addEventListener("click", () => {
    const m = sfx.toggleMute();
    el.muteBtn.textContent = m ? "🔇" : "🔊";
  });

  // Ana Oyun Döngüsü Başlatıcı
  let lastTime = performance.now();
  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if (running) {
      updateWorld(dt);
      renderMap();
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  el.startGameBtn.addEventListener("click", () => {
    sfx.startRainAmbience();
    sfx.tap();
    el.startScreen.classList.add("hidden");
    running = true;
    trySpawnStationCar();
    updateHUD();
  });
})();

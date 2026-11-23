// Son İstasyon v7.0 — Gelişmiş 2.5D Grafik, Dengeli/Zorlu Gelişim, 1200L Tanker ve Kesintisiz Özel Müşteri Motoru

(function () {
  const sfx = window.sfx;
  const MR = window.MapRenderer;

  const SAVE_KEY = "son_istasyon_v7_pro";

  // Zorlu ve Uzun Ömürlü Başlangıç Verisi
  let data = {
    cash: 120,
    fuelStock: 1200,
    tankLevel: 1, // 1200L -> +900L her seviyede (maks Sv.6 = 5700L)
    autoTanker: false,
    pumpsUnlocked: 1, // 1..4
    pumpSpeedLvl: 1, // 1..8
    marketLvl: 1, // 1..8
    carWashUnlocked: false,
    carWashLvl: 1, // 1..6
    garageUnlocked: false,
    garageLvl: 1, // 1..6
    dumanHired: false,
    staff: {
      ali: 0, // 0..6 seviye (Pompacı 1)
      murat: 0, // 0..6 (Pompacı 2)
      zeynep: 0, // 0..6 (Market Kasiyeri)
      kadir: 0, // 0..6 (Oto Yıkamacı)
      cemil: 0 // 0..6 (Tamir Ustası)
    },
    storyIndex: 0,
    servedSinceSpecial: 0, // Her 5 araçta bir kesin Özel Müşteri!
    totalServed: 0
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      Object.assign(data, p);
      if (p.staff) {
        data.staff = Object.assign({ ali: 0, murat: 0, zeynep: 0, kadir: 0, cemil: 0 }, p.staff);
      }
    }
  } catch (_) {}

  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function maxFuelCapacity() {
    return 1200 + (data.tankLevel - 1) * 900;
  }

  function stationLevel() {
    return (
      data.pumpsUnlocked +
      (data.carWashUnlocked ? 1 : 0) +
      (data.garageUnlocked ? 1 : 0) +
      Math.floor((data.pumpSpeedLvl + data.marketLvl + data.tankLevel) / 3)
    );
  }

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
  // 2.5D HARİTA YERLEŞİM PLANI (420 x 560 Mantıksal Koordinatlar)
  // =========================================================================
  const WORLD_W = 420;
  const WORLD_H = 560;

  // 4 Pompa Adası!
  const PUMPS = [
    { idx: 0, x: 132, y: 192, carX: 132, carY: 235, unlockCost: 0, label: "POMPA 1", short: "P-1" },
    { idx: 1, x: 212, y: 192, carX: 212, carY: 235, unlockCost: 420, label: "POMPA 2", short: "P-2" },
    { idx: 2, x: 292, y: 192, carX: 292, carY: 235, unlockCost: 1250, label: "POMPA 3", short: "P-3" },
    { idx: 3, x: 372, y: 192, carX: 372, carY: 235, unlockCost: 2800, label: "POMPA 4 VIP", short: "VIP" }
  ];

  const TANK_POS = { x: 50, y: 198, w: 68, h: 112 };
  const MARKET_POS = { x: 14, y: 386, w: 162, h: 136, doorX: 105, doorY: 386 };
  const WASH_POS = { x: 186, y: 386, w: 108, h: 136, carX: 240, carY: 462, unlockCost: 850 };
  const GARAGE_POS = { x: 302, y: 386, w: 106, h: 136, carX: 355, carY: 462, unlockCost: 1950 };

  const TREES = [
    { x: 24, y: 95, s: 0.9 },
    { x: 22, y: 325, s: 1.0 },
    { x: 400, y: 98, s: 0.85 },
    { x: 402, y: 332, s: 0.95 }
  ];

  // Canlı Değişkenler
  let running = false;
  let pointerHeldPump = -1;
  let highwayBgCars = [];
  let cars = [];
  let shoppers = [];
  let marketQueue = 0;
  let marketProgress = 0;
  let washCar = null;
  let garageCar = null;
  let tanker = null;
  let policeCruiser = null;
  let floatingTexts = [];
  let exhaustPuffs = [];
  let rainRipples = [];
  let activeStoryCar = null;
  let pendingSpecialReady = false;
  let spawnCooldown = 1.0;

  const workers = {
    ali: { x: 120, y: 325, color: "#f97316", hat: "#dc2626", name: "Ali", targetPump: -1, moving: false },
    murat: { x: 170, y: 325, color: "#38bdf8", hat: "#0284c7", name: "Murat", targetPump: -1, moving: false },
    zeynep: { x: 95, y: 452, color: "#ec4899", hat: "#be185d", name: "Zeynep", moving: false },
    kadir: { x: 212, y: 452, color: "#22c55e", hat: "#15803d", name: "Kadir", moving: false },
    cemil: { x: 326, y: 452, color: "#a855f7", hat: "#6b21a8", name: "Cemil", moving: false },
    duman: { x: 88, y: 128, dir: 1 }
  };

  function addFloatingText(x, y, text, color = "#4ade80") {
    floatingTexts.push({ x, y, text, color, life: 1.4 });
  }

  function tankerRefillCost() {
    const missing = maxFuelCapacity() - data.fuelStock;
    if (missing < 80) return 0;
    // Ekonomik toptan dolum: litre başı sadece ~0.065 ₺!
    return Math.max(45, Math.round(missing * 0.065));
  }

  function updateHUD() {
    el.cashText.textContent = Math.round(data.cash);
    el.fuelStockText.textContent = `${Math.round(data.fuelStock)}`;
    el.stationLvlText.textContent = String(stationLevel());

    const anyStoryNow = cars.some((c) => c.isStory && c.state !== "leaving");
    if (anyStoryNow || pendingSpecialReady) {
      el.storyProgressText.textContent = "❗ ÖZEL MÜŞTERİ GELDİ!";
      el.storyProgressText.style.color = "#fde047";
    } else {
      el.storyProgressText.textContent = `🕵️ Özel: ${data.servedSinceSpecial}/5`;
      el.storyProgressText.style.color = "#38bdf8";
    }

    const tCost = tankerRefillCost();
    el.tankerCostSub.textContent = tCost === 0 ? "Depo Dolu ✓" : `Doldur (${tCost}₺)`;
    el.btnCallTanker.classList.toggle("fuel-low", data.fuelStock < maxFuelCapacity() * 0.18);

    const hiredCount =
      (data.staff.ali > 0 ? 1 : 0) +
      (data.staff.murat > 0 ? 1 : 0) +
      (data.staff.zeynep > 0 ? 1 : 0) +
      (data.staff.kadir > 0 ? 1 : 0) +
      (data.staff.cemil > 0 ? 1 : 0) +
      (data.dumanHired ? 1 : 0);
    el.staffCountSub.textContent = `${hiredCount}/6 Ekip`;
  }

  // =========================================================================
  // ARAÇ VE GARANTİLİ ÖZEL MÜŞTERİ ÜRETİMİ
  // =========================================================================
  const CAR_COLORS = ["#ef4444", "#2563eb", "#f59e0b", "#10b981", "#e2e8f0", "#8b5cf6", "#ec4899", "#0ea5e9"];

  function trySpawnStationCar() {
    const openPumps = [];
    for (let i = 0; i < data.pumpsUnlocked; i++) {
      const busy = cars.some((c) => c.pumpIdx === i && c.state !== "leaving");
      if (!busy) openPumps.push(i);
    }
    if (openPumps.length === 0) return;

    const chosenPump = openPumps[Math.floor(Math.random() * openPumps.length)];
    const p = PUMPS[chosenPump];

    // İşçi çalışsa da, sen çalışsan da her 5 araçta bir KESİN ÖZEL MÜŞTERİ!
    const anyStoryOnMap = cars.some((c) => c.isStory && c.state !== "leaving");
    if (pendingSpecialReady && !anyStoryOnMap) {
      const ev = window.getNextSpecialEvent(data.storyIndex);
      pendingSpecialReady = false;
      data.servedSinceSpecial = 0;

      cars.push({
        x: -40,
        y: 50,
        pumpIdx: chosenPump,
        targetX: p.carX,
        targetY: p.carY,
        color: ev.carColor,
        shape: ev.carShape || "sedan",
        state: "entering_road",
        fuelNeeded: 22,
        fuelFilled: 0,
        manualLatched: false,
        payAmount: ev.reward,
        isStory: true,
        storyEvent: ev
      });
      return;
    }

    const isBig = chosenPump >= 2 ? Math.random() < 0.55 : Math.random() < 0.2;
    const isVip = chosenPump === 3;
    // Düşük yakıt tüketimi -> Tanker çok hızlı boşalmaz!
    const fuelReq = isBig ? 32 : 18;
    // Zorlu ve gerçekçi kâr dengesi!
    const basePay = Math.round((isVip ? 42 : isBig ? 34 : 22) + (data.pumpSpeedLvl - 1) * 7);

    cars.push({
      x: -40,
      y: 50,
      pumpIdx: chosenPump,
      targetX: p.carX,
      targetY: p.carY,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      shape: isBig ? "truck" : Math.random() < 0.35 ? "suv" : "sedan",
      state: "entering_road",
      fuelNeeded: fuelReq,
      fuelFilled: 0,
      manualLatched: false,
      payAmount: basePay,
      wantsMarket: Math.random() < 0.52,
      wantsWash: data.carWashUnlocked && !washCar && Math.random() < 0.45,
      wantsGarage: data.garageUnlocked && !garageCar && Math.random() < 0.4,
      isStory: false,
      storyEvent: null
    });
  }

  // =========================================================================
  // TANKER İKMAL SİSTEMİ
  // =========================================================================
  function callFuelTanker(isAuto = false) {
    if (tanker) {
      if (!isAuto) showToast("🚛 Yakıt tankeri zaten istasyonda!");
      return;
    }
    const cost = tankerRefillCost();
    if (cost === 0) {
      if (!isAuto) showToast("🛢️ Ana yakıt depon zaten dolu!");
      return;
    }

    if (data.cash < cost) {
      if (data.fuelStock < 35 && data.cash < 45) {
        showToast("🚛 Acil veresiye yakıt ikmali gönderildi!");
      } else {
        if (!isAuto) {
          sfx.burnFail();
          showToast(`Tanker için ${cost} ₺ gerekli!`);
        }
        return;
      }
    } else {
      data.cash -= cost;
    }

    sfx.doorBell();
    tanker = { x: -75, y: 50, state: "entering", progress: 0 };
    if (!isAuto) showToast("🚛 Yakıt Tankeri yola çıktı!");
    updateHUD();
  }

  el.btnCallTanker.addEventListener("click", () => callFuelTanker(false));

  // =========================================================================
  // DÜNYA GÜNCELLEMESİ (60 FPS)
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
    // Otomatik Tanker Anlaşması varsa %15 altında kendisi çağırsın!
    if (data.autoTanker && !tanker && data.fuelStock < maxFuelCapacity() * 0.16 && data.cash >= tankerRefillCost()) {
      callFuelTanker(true);
    }

    // Yağmur halkaları
    if (Math.random() < dt * 5 && rainRipples.length < 14) {
      rainRipples.push({
        x: 20 + Math.random() * (WORLD_W - 40),
        y: 85 + Math.random() * 280,
        r: 1,
        alpha: 0.45
      });
    }
    rainRipples.forEach((rp) => {
      rp.r += 16 * dt;
      rp.alpha -= 0.45 * dt;
    });
    rainRipples = rainRipples.filter((rp) => rp.alpha > 0);

    // Otoyol arka plan araçları
    if (Math.random() < dt * 0.75 && highwayBgCars.length < 4) {
      highwayBgCars.push({
        x: WORLD_W + 45,
        y: 20,
        speed: 95 + Math.random() * 45,
        color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
      });
    }
    highwayBgCars.forEach((hc) => (hc.x -= hc.speed * dt));
    highwayBgCars = highwayBgCars.filter((hc) => hc.x > -65);

    // İstasyon araç doğurma
    spawnCooldown -= dt;
    if (spawnCooldown <= 0) {
      trySpawnStationCar();
      spawnCooldown = Math.max(1.25, 3.1 - data.pumpsUnlocked * 0.45);
    }

    // Tanker hareketi
    if (tanker) {
      if (tanker.state === "entering") {
        if (tanker.x < 88 && tanker.y < 60) {
          moveTowards(tanker, 88, 50, 115, dt);
        } else if (moveTowards(tanker, 92, 195, 95, dt)) {
          tanker.state = "filling";
          sfx.coffeeBrew();
        }
      } else if (tanker.state === "filling") {
        tanker.progress += dt * 0.65;
        data.fuelStock = Math.min(maxFuelCapacity(), data.fuelStock + maxFuelCapacity() * 0.7 * dt);
        if (data.fuelStock >= maxFuelCapacity() || tanker.progress >= 1.7) {
          data.fuelStock = maxFuelCapacity();
          tanker.state = "leaving";
          sfx.perfectHit();
          addFloatingText(60, 145, `🛢️ +${maxFuelCapacity()}L DOLDU!`, "#38bdf8");
          saveGame();
        }
      } else if (tanker.state === "leaving") {
        if (tanker.y > 54) moveTowards(tanker, 92, 50, 105, dt);
        else if (moveTowards(tanker, WORLD_W + 85, 50, 130, dt)) tanker = null;
      }
    }

    // Polis aracı baskını
    if (policeCruiser) {
      if (policeCruiser.state === "entering") {
        if (moveTowards(policeCruiser, policeCruiser.targetX, policeCruiser.targetY + 46, 180, dt)) {
          policeCruiser.state = "arresting";
          policeCruiser.timer = 1.1;
        }
      } else if (policeCruiser.state === "arresting") {
        policeCruiser.timer -= dt;
        if (policeCruiser.timer <= 0) {
          if (policeCruiser.suspectCar) policeCruiser.suspectCar.state = "leaving";
          policeCruiser.state = "leaving";
        }
      } else if (policeCruiser.state === "leaving") {
        if (moveTowards(policeCruiser, WORLD_W + 75, 50, 170, dt)) policeCruiser = null;
      }
    }

    // Köpek Duman devriyesi
    if (data.dumanHired) {
      const threatCar = cars.find((c) => c.isStory && c.storyEvent.isThreat && c.state === "story_wait");
      if (threatCar) {
        moveTowards(workers.duman, threatCar.x - 26, threatCar.y + 8, 85, dt);
      } else {
        workers.duman.x += workers.duman.dir * 26 * dt;
        if (workers.duman.x > 140) workers.duman.dir = -1;
        if (workers.duman.x < 72) workers.duman.dir = 1;
        workers.duman.y = 128;
      }
    }

    // Pompacı İşçiler (Ali & Murat) — Başta makul hızda, eğittikçe hızlanır!
    ["ali", "murat"].forEach((wKey, idx) => {
      const lvl = data.staff[wKey];
      if (!lvl) return;
      const w = workers[wKey];
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
        const arrived = moveTowards(w, p.x - 22, p.carY, 68 + lvl * 16, dt);
        w.moving = !arrived;
        if (arrived && data.fuelStock > 0.5) {
          targetCar.state = "fueling";
          const rate = (5.2 + lvl * 2.4 + data.pumpSpeedLvl * 1.2) * dt;
          const used = Math.min(data.fuelStock, rate);
          targetCar.fuelFilled += used;
          data.fuelStock -= used;
        }
      } else {
        w.targetPump = -1;
        const idleArrived = moveTowards(w, 118 + idx * 52, 325, 58, dt);
        w.moving = !idleArrived;
      }
    });

    // İstasyon Araçları Döngüsü
    cars.forEach((car) => {
      if (car.state === "entering_road") {
        if (Math.random() < 0.25) exhaustPuffs.push({ x: car.x - 16, y: car.y, r: 3, life: 0.5 });
        if (moveTowards(car, 98, 50, 135, dt)) car.state = "parking";
      } else if (car.state === "parking") {
        if (moveTowards(car, car.targetX, car.targetY, 115, dt)) {
          if (car.isStory) {
            car.state = "story_wait";
            sfx.doorBell();
            el.liveHintText.textContent = `❗ ${car.storyEvent.name} geldi! Kırmızı ünlemli araca dokun!`;
            if (data.dumanHired && car.storyEvent.isThreat) {
              sfx.dogGrowl();
              showToast("🐕 Duman yeni gelen özel araca hırlıyor!");
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
            el.liveHintText.textContent = "🛢️ Yakıt bitti! Sol alttan Tanker Çağır!";
          } else {
            car.state = "fueling";
            const boost = pointerHeldPump === car.pumpIdx ? 1.9 : 1.0;
            const rate = (7.5 + data.pumpSpeedLvl * 2.2) * boost * dt;
            const used = Math.min(data.fuelStock, rate);
            car.fuelFilled += used;
            data.fuelStock -= used;
            if (Math.random() < 0.2) sfx.pumpTick(300 + (car.fuelFilled / car.fuelNeeded) * 230);
          }
        }

        if (car.fuelFilled >= car.fuelNeeded) {
          car.fuelFilled = car.fuelNeeded;
          car.manualLatched = false;
          data.cash += car.payAmount;
          data.totalServed += 1;

          // İŞÇİ DOLDURSA DA SEN DOLDURSAN DA ÖZEL MÜŞTERİ SAYACI ARTAR!
          if (!pendingSpecialReady) {
            data.servedSinceSpecial += 1;
            if (data.servedSinceSpecial >= 5) {
              pendingSpecialReady = true;
              showToast("🕵️ Özel bir müşteri istasyona yaklaşıyor!");
            }
          }

          sfx.cashRegister();
          addFloatingText(car.x, car.y - 26, `+${car.payAmount} ₺`, "#4ade80");
          saveGame();

          if (car.wantsMarket && marketQueue < 3) {
            car.state = "shopping_wait";
            shoppers.push({ x: car.x - 12, y: car.y + 8, carRef: car, phase: "to_market" });
          } else if (car.wantsWash && data.carWashUnlocked && !washCar) {
            car.state = "going_wash";
            washCar = car;
          } else if (car.wantsGarage && data.garageUnlocked && !garageCar) {
            car.state = "going_garage";
            garageCar = car;
          } else {
            car.state = "leaving";
          }
        }
      } else if (car.state === "going_wash") {
        if (moveTowards(car, WASH_POS.carX, WASH_POS.carY, 105, dt)) {
          car.state = "washing";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "washing") {
        const autoSpd = data.staff.kadir > 0 ? 22 + data.staff.kadir * 9 : 0;
        const manSpd = car.serviceManual ? 36 : 0;
        if (autoSpd + manSpd > 0) {
          car.serviceProg += (autoSpd + manSpd) * dt;
          if (car.serviceProg >= 100) {
            const washPay = 36 + (data.carWashLvl - 1) * 14;
            data.cash += washPay;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 25, `🚿 +${washPay} ₺`, "#38bdf8");
            washCar = null;
            car.state = "leaving";
            saveGame();
          }
        }
      } else if (car.state === "going_garage") {
        if (moveTowards(car, GARAGE_POS.carX, GARAGE_POS.carY, 105, dt)) {
          car.state = "repairing";
          car.serviceProg = 0;
          car.serviceManual = false;
        }
      } else if (car.state === "repairing") {
        const autoSpd = data.staff.cemil > 0 ? 20 + data.staff.cemil * 9 : 0;
        const manSpd = car.serviceManual ? 34 : 0;
        if (autoSpd + manSpd > 0) {
          car.serviceProg += (autoSpd + manSpd) * dt;
          if (car.serviceProg >= 100) {
            const repPay = 58 + (data.garageLvl - 1) * 20;
            data.cash += repPay;
            sfx.cashRegister();
            addFloatingText(car.x, car.y - 25, `🔧 +${repPay} ₺`, "#c084fc");
            garageCar = null;
            car.state = "leaving";
            saveGame();
          }
        }
      } else if (car.state === "leaving") {
        if (Math.random() < 0.2) exhaustPuffs.push({ x: car.x, y: car.y + 20, r: 3, life: 0.45 });
        if (car.y > 54 && car.x < 378) moveTowards(car, 384, 112, 125, dt);
        else if (car.y > 54) moveTowards(car, 384, 50, 125, dt);
        else if (moveTowards(car, WORLD_W + 70, 50, 145, dt)) car.remove = true;
      }
    });
    cars = cars.filter((c) => !c.remove);

    // Markete Yürüyen Müşteriler
    shoppers.forEach((sh) => {
      if (sh.phase === "to_market") {
        if (moveTowards(sh, MARKET_POS.doorX, MARKET_POS.doorY + 42, 78, dt)) {
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

    if (marketQueue > 0 && data.staff.zeynep > 0) {
      marketProgress += (26 + data.staff.zeynep * 11) * dt;
      workers.zeynep.x = 88 + Math.sin(Date.now() * 0.006) * 18;
      workers.zeynep.moving = true;
      if (marketProgress >= 100) completeOneMarketSale();
    } else {
      workers.zeynep.moving = false;
    }

    // Egzoz dumanı ve uçan yazılar
    exhaustPuffs.forEach((ep) => {
      ep.r += 9 * dt;
      ep.life -= dt;
    });
    exhaustPuffs = exhaustPuffs.filter((ep) => ep.life > 0);

    floatingTexts.forEach((ft) => {
      ft.y -= 26 * dt;
      ft.life -= dt;
    });
    floatingTexts = floatingTexts.filter((ft) => ft.life > 0);

    updateHUD();
  }

  function completeOneMarketSale() {
    if (marketQueue <= 0) return;
    marketQueue -= 1;
    marketProgress = 0;
    const sale = 18 + (data.marketLvl - 1) * 9;
    data.cash += sale;
    sfx.cashRegister();
    addFloatingText(MARKET_POS.doorX, MARKET_POS.y - 6, `☕ +${sale} ₺`, "#fde68a");
    const waitingShopper = shoppers.find((s) => s.phase === "inside");
    if (waitingShopper) waitingShopper.phase = "back_to_car";
    saveGame();
  }

  // =========================================================================
  // 2.5D DETAYLI HARİTA ÇİZİMİ
  // =========================================================================
  const ctx = el.canvas.getContext("2d");

  function renderMap() {
    const dpr = window.devicePixelRatio || 1;
    const cw = el.canvas.clientWidth || 420;
    const ch = el.canvas.clientHeight || 560;
    if (el.canvas.width !== Math.round(cw * dpr) || el.canvas.height !== Math.round(ch * dpr)) {
      el.canvas.width = Math.round(cw * dpr);
      el.canvas.height = Math.round(ch * dpr);
    }

    ctx.save();
    ctx.scale((cw * dpr) / WORLD_W, (ch * dpr) / WORLD_H);

    // 1. Koyu Gece Çim Zemini
    ctx.fillStyle = "#081715";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 2. İstasyon Asfalt Sahası + Kaldırım Bordürü
    MR.rr(ctx, 8, 76, WORLD_W - 16, WORLD_H - 86, 16, "#182132", "#475569", 3);

    // Yağmur damlası halkaları
    rainRipples.forEach((rp) => {
      ctx.strokeStyle = `rgba(148, 197, 255, ${rp.alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 3. Çift Şeritli Gece Otoyolu + Çelik Bariyer
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, WORLD_W, 74);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(0, 72, WORLD_W, 4);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(WORLD_W, 36);
    ctx.stroke();
    ctx.setLineDash([]);

    // Giriş & Çıkış Rampaları ve Oklar
    ctx.fillStyle = "#182132";
    ctx.fillRect(72, 68, 50, 18);
    ctx.fillRect(358, 68, 48, 18);
    ctx.fillStyle = "#fde047";
    ctx.font = "900 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⬇ GİRİŞ", 97, 84);
    ctx.fillText("⬆ ÇIKIŞ", 382, 84);

    // Sokak Lambaları ve Çam Ağaçları
    MR.drawStreetLamp(ctx, 56, 76);
    MR.drawStreetLamp(ctx, 225, 76);
    MR.drawStreetLamp(ctx, 340, 76);
    TREES.forEach((tr) => MR.drawPineTree(ctx, tr.x, tr.y, tr.s));

    // Otoyoldan geçen araçlar
    highwayBgCars.forEach((hc) => MR.drawDetailedVehicle(ctx, hc.x, hc.y, hc.color, "sedan", true));

    // 4. Ana Yakıt Silosu & Tanker
    MR.drawFuelDepot(ctx, TANK_POS, data.fuelStock, maxFuelCapacity());
    if (tanker) {
      MR.drawDetailedVehicle(ctx, tanker.x, tanker.y, "#ea580c", "tanker", tanker.y < 64);
      if (tanker.state === "filling") {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tanker.x - 14, tanker.y);
        ctx.lineTo(TANK_POS.x + 22, TANK_POS.y);
        ctx.stroke();
      }
    }

    // 5. 4 Pompa Adası
    PUMPS.forEach((p, idx) => {
      MR.drawPumpIsland(ctx, p, idx < data.pumpsUnlocked, data.pumpSpeedLvl);
    });

    // 6. Alt Tesisler: Market, Oto Yıkama, Tamirhane
    MR.drawMarketBuilding(ctx, MARKET_POS, data.marketLvl, marketQueue, data.staff.zeynep > 0);
    MR.drawServiceBay(ctx, WASH_POS, data.carWashUnlocked, data.carWashLvl, "wash");
    MR.drawServiceBay(ctx, GARAGE_POS, data.garageUnlocked, data.garageLvl, "garage");

    // Egzoz dumanları
    exhaustPuffs.forEach((ep) => {
      ctx.fillStyle = `rgba(203, 213, 225, ${ep.life * 0.55})`;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, ep.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 7. İstasyon Araçları, Hortumlar ve Etkileşim Balonları
    cars.forEach((car) => {
      const horiz = car.y < 64;
      MR.drawDetailedVehicle(ctx, car.x, car.y, car.color, car.shape, horiz);

      if (car.state === "fueling") {
        const p = PUMPS[car.pumpIdx];
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + 18, p.y + 18, car.x + 10, car.y - 5);
        ctx.stroke();
      }

      if (car.state === "washing") {
        const spin = Date.now() * 0.012;
        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
        ctx.beginPath();
        ctx.arc(car.x - 16, car.y + Math.sin(spin) * 12, 9, 0, Math.PI * 2);
        ctx.arc(car.x + 16, car.y - Math.sin(spin) * 12, 9, 0, Math.PI * 2);
        ctx.fill();

        if (data.staff.kadir === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 40, car.y - 44, 80, 25, 7, "#0284c7", "#fff", 2);
          ctx.fillStyle = "#fff";
          ctx.font = "900 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🚿 YIKA!", car.x, car.y - 28);
        } else {
          MR.rr(ctx, car.x - 30, car.y - 40, 60, 9, 4, "#090d1a", "#38bdf8", 1.5);
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(car.x - 28, car.y - 38, 56 * (car.serviceProg / 100), 5);
        }
      }

      if (car.state === "repairing") {
        if (data.staff.cemil === 0 && !car.serviceManual) {
          MR.rr(ctx, car.x - 42, car.y - 44, 84, 25, 7, "#7e22ce", "#fff", 2);
          ctx.fillStyle = "#fff";
          ctx.font = "900 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🔧 ONAR!", car.x, car.y - 28);
        } else {
          MR.rr(ctx, car.x - 30, car.y - 40, 60, 9, 4, "#090d1a", "#c084fc", 1.5);
          ctx.fillStyle = "#c084fc";
          ctx.fillRect(car.x - 28, car.y - 38, 56 * (car.serviceProg / 100), 5);
        }
      }

      // ÖZEL HİKAYE ARACI BALONU
      if (car.state === "story_wait") {
        const bounce = Math.sin(Date.now() * 0.008) * 4;
        MR.rr(ctx, car.x - 48, car.y - 54 + bounce, 96, 30, 8, "#dc2626", "#fef08a", 2.5);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("❗ İNCELE!", car.x, car.y - 35 + bounce);
      }

      // YAKIT DOLUM BALONU & BARI
      if (!car.isStory && (car.state === "waiting_fuel" || car.state === "fueling")) {
        const pct = Math.min(1, car.fuelFilled / car.fuelNeeded);
        if (pct < 0.02 && data.staff.ali === 0 && data.staff.murat === 0) {
          MR.rr(ctx, car.x - 40, car.y - 48, 80, 25, 7, "#16a34a", "#fef08a", 2);
          ctx.fillStyle = "#fff";
          ctx.font = "900 10.5px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⛽ DOLDUR", car.x, car.y - 32);
        } else {
          MR.rr(ctx, car.x - 32, car.y - 42, 64, 11, 5, "#090d1a", "#fff", 1.4);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(car.x - 30, car.y - 40, 60 * pct, 7);
        }
      }
    });

    if (policeCruiser) {
      MR.drawDetailedVehicle(ctx, policeCruiser.x, policeCruiser.y, "#1e3a8a", "sedan", policeCruiser.y < 64, { isPolice: true });
    }

    // Yürüyen Müşteriler
    shoppers.forEach((sh) => {
      if (sh.phase !== "inside") {
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#090d1a";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // 8. Yürüyen Çalışanlar & Duman
    if (data.staff.ali > 0) MR.drawAnimatedWorker(ctx, workers.ali.x, workers.ali.y, workers.ali.color, workers.ali.hat, "Ali", workers.ali.moving);
    if (data.staff.murat > 0) MR.drawAnimatedWorker(ctx, workers.murat.x, workers.murat.y, workers.murat.color, workers.murat.hat, "Murat", workers.murat.moving);
    if (data.staff.zeynep > 0) MR.drawAnimatedWorker(ctx, workers.zeynep.x, workers.zeynep.y, workers.zeynep.color, workers.zeynep.hat, "Zeynep", workers.zeynep.moving);
    if (data.staff.kadir > 0 && data.carWashUnlocked) MR.drawAnimatedWorker(ctx, workers.kadir.x, workers.kadir.y, workers.kadir.color, workers.kadir.hat, "Kadir", false);
    if (data.staff.cemil > 0 && data.garageUnlocked) MR.drawAnimatedWorker(ctx, workers.cemil.x, workers.cemil.y, workers.cemil.color, workers.cemil.hat, "Cemil", false);

    if (data.dumanHired) {
      ctx.save();
      ctx.translate(workers.duman.x, workers.duman.y);
      MR.rr(ctx, -11, -6, 22, 13, 6, "#d97706", "#050811", 2);
      ctx.fillStyle = "#050811";
      ctx.beginPath();
      ctx.arc(workers.duman.dir > 0 ? 8 : -8, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "900 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fde68a";
      ctx.fillText("🐕 Duman", 0, -10);
      ctx.restore();
    }

    // 9. Uçan Yazılar
    floatingTexts.forEach((ft) => {
      ctx.globalAlpha = Math.min(1, ft.life);
      ctx.font = "900 15px sans-serif";
      ctx.textAlign = "center";
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
  // HARİTAYA DOKUNMA KONTROLLERİ
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

    // 1. Ana Yakıt Silosu
    if (Math.abs(pt.x - TANK_POS.x) < 38 && Math.abs(pt.y - TANK_POS.y) < 58) {
      callFuelTanker(false);
      return;
    }

    // 2. Pompa Adaları (1..4)
    for (let i = 0; i < PUMPS.length; i++) {
      const p = PUMPS[i];
      if (Math.abs(pt.x - p.x) < 38 && pt.y > p.y - 46 && pt.y < p.carY + 46) {
        if (i >= data.pumpsUnlocked) {
          if (i > data.pumpsUnlocked) return showToast(`Önce Pompa ${data.pumpsUnlocked + 1}'i açmalısın!`);
          if (data.cash >= p.unlockCost) {
            data.cash -= p.unlockCost;
            data.pumpsUnlocked += 1;
            sfx.perfectHit();
            addFloatingText(p.x, p.y, `🎉 ${p.label} KURULDU!`, "#fde68a");
            saveGame();
            updateHUD();
          } else {
            sfx.burnFail();
            showToast(`${p.label} için ${p.unlockCost} ₺ gerekli!`);
          }
          return;
        }

        const carAtPump = cars.find((c) => c.pumpIdx === i && c.state !== "leaving" && c.state !== "entering_road");
        if (carAtPump) {
          if (carAtPump.state === "story_wait") {
            openStoryEncounter(carAtPump);
            return;
          }
          if (data.fuelStock <= 1) {
            sfx.burnFail();
            return showToast("🛢️ Ana depo boş! Sol alttan Tanker Çağır!");
          }
          pointerHeldPump = i;
          carAtPump.manualLatched = true;
          sfx.tap();
        }
        return;
      }
    }

    // 3. Market Binası
    if (pt.x >= MARKET_POS.x && pt.x <= MARKET_POS.x + MARKET_POS.w && pt.y >= MARKET_POS.y) {
      if (marketQueue > 0) completeOneMarketSale();
      else openUpgradesModal();
      return;
    }

    // 4. Oto Yıkama Tesisi
    if (pt.x >= WASH_POS.x && pt.x <= WASH_POS.x + WASH_POS.w && pt.y >= WASH_POS.y) {
      if (!data.carWashUnlocked) {
        if (data.cash >= WASH_POS.unlockCost) {
          data.cash -= WASH_POS.unlockCost;
          data.carWashUnlocked = true;
          sfx.perfectHit();
          addFloatingText(WASH_POS.carX, WASH_POS.y + 40, "🚿 OTO YIKAMA KURULDU!", "#38bdf8");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Oto Yıkama için ${WASH_POS.unlockCost} ₺ biriktirmelisin!`);
        }
        return;
      }
      if (washCar && washCar.state === "washing") {
        washCar.serviceManual = true;
        sfx.tap();
      }
      return;
    }

    // 5. Tamirhane Garajı
    if (pt.x >= GARAGE_POS.x && pt.x <= GARAGE_POS.x + GARAGE_POS.w && pt.y >= GARAGE_POS.y) {
      if (!data.garageUnlocked) {
        if (data.cash >= GARAGE_POS.unlockCost) {
          data.cash -= GARAGE_POS.unlockCost;
          data.garageUnlocked = true;
          sfx.perfectHit();
          addFloatingText(GARAGE_POS.carX, GARAGE_POS.y + 40, "🔧 TAMİRHANE KURULDU!", "#c084fc");
          saveGame();
          updateHUD();
        } else {
          sfx.burnFail();
          showToast(`Tamirhane için ${GARAGE_POS.unlockCost} ₺ biriktirmelisin!`);
        }
        return;
      }
      if (garageCar && garageCar.state === "repairing") {
        garageCar.serviceManual = true;
        sfx.tap();
      }
    }
  });

  window.addEventListener("pointerup", () => (pointerHeldPump = -1));
  window.addEventListener("pointercancel", () => (pointerHeldPump = -1));

  // =========================================================================
  // TESİS GELİŞTİRME VE ÇALIŞAN MENÜLERİ (ZORLU & UZUN ÖMÜRLÜ MALİYETLER)
  // =========================================================================
  function openUpgradesModal() {
    sfx.tap();
    el.upCashText.textContent = Math.round(data.cash);
    el.upgradesList.innerHTML = "";

    const nextPumpCost = data.pumpsUnlocked < 4 ? PUMPS[data.pumpsUnlocked].unlockCost : 0;

    const items = [
      {
        title: `⛽ Yeni Pompa Adası Kur (${data.pumpsUnlocked}/4)`,
        desc: "4. pompada yüksek gelirli VIP araçlar hizmet alır!",
        done: data.pumpsUnlocked >= 4,
        cost: nextPumpCost,
        buy: () => (data.pumpsUnlocked += 1)
      },
      {
        title: `⚡ Pompa Kalitesi & Hızı (Sv.${data.pumpSpeedLvl}/8)`,
        desc: "Pompa dolum hızını ve araç başı net yakıt kârını (+7 ₺) artırır.",
        done: data.pumpSpeedLvl >= 8,
        cost: Math.round(240 * Math.pow(1.55, data.pumpSpeedLvl - 1)),
        buy: () => (data.pumpSpeedLvl += 1)
      },
      {
        title: `🛢️ Yeraltı Yakıt Tankını Büyüt (Sv.${data.tankLevel}/6)`,
        desc: `Kapasiteyi +900L büyütür (Şu an: ${maxFuelCapacity()}L) ve depoyu bedava fuller!`,
        done: data.tankLevel >= 6,
        cost: Math.round(320 * Math.pow(1.6, data.tankLevel - 1)),
        buy: () => {
          data.tankLevel += 1;
          data.fuelStock = maxFuelCapacity();
        }
      },
      {
        title: data.carWashUnlocked ? `🚿 Oto Yıkama Geliştir (Sv.${data.carWashLvl}/6)` : "🚿 Oto Yıkama Tüneli İnşa Et",
        desc: data.carWashUnlocked ? "Köpüklü yıkama gelirini +14 ₺ artırır." : "Haritanın altına gelir getiren oto yıkama tesisi kurar!",
        done: data.carWashUnlocked && data.carWashLvl >= 6,
        cost: data.carWashUnlocked ? Math.round(380 * Math.pow(1.55, data.carWashLvl - 1)) : WASH_POS.unlockCost,
        buy: () => {
          if (!data.carWashUnlocked) data.carWashUnlocked = true;
          else data.carWashLvl += 1;
        }
      },
      {
        title: data.garageUnlocked ? `🔧 Tamirhane Geliştir (Sv.${data.garageLvl}/6)` : "🔧 Lastik & Motor Tamirhanesi Kur",
        desc: data.garageUnlocked ? "Tamir gelirini araç başı +20 ₺ artırır." : "En yüksek yan geliri sağlayan tamir garajını açar!",
        done: data.garageUnlocked && data.garageLvl >= 6,
        cost: data.garageUnlocked ? Math.round(620 * Math.pow(1.55, data.garageLvl - 1)) : GARAGE_POS.unlockCost,
        buy: () => {
          if (!data.garageUnlocked) data.garageUnlocked = true;
          else data.garageLvl += 1;
        }
      },
      {
        title: `🏪 7/24 Market Rafları (Sv.${data.marketLvl}/8)`,
        desc: "Büfe satış gelirini müşteri başı +9 ₺ yükseltir.",
        done: data.marketLvl >= 8,
        cost: Math.round(260 * Math.pow(1.5, data.marketLvl - 1)),
        buy: () => (data.marketLvl += 1)
      },
      {
        title: "🚛 Otomatik Tanker İkmal Anlaşması",
        desc: "Ana yakıt deposu %15'e indiğinde sen basmadan tanker otomatik gelir!",
        done: data.autoTanker,
        cost: 2400,
        buy: () => (data.autoTanker = true)
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
            return showToast(`Yetersiz kasa! (${it.cost} ₺ gerekli)`);
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
        title: data.staff.ali > 0 ? `👷 Pompacı Ali (Sv.${data.staff.ali}/6)` : "👷 Pompacı Ali'yi İşe Al",
        desc: "Pompalara koşup benzin doldurur; her 5 araçta Özel Müşteri getirir!",
        done: data.staff.ali >= 6,
        cost: data.staff.ali === 0 ? 360 : Math.round(320 * Math.pow(1.55, data.staff.ali))
      },
      {
        key: "duman",
        title: data.dumanHired ? "🐕 Bekçi Köpek Duman (Görevde ❤️)" : "🐕 Bekçi Köpek Duman'ı Sahiplen",
        desc: "Özel müşterilerde tehlikeli/sahtekâr şahıslara hırlayarak seni uyarır!",
        done: data.dumanHired,
        cost: 240
      },
      {
        key: "zeynep",
        title: data.staff.zeynep > 0 ? `👩‍🍳 Kasiyer Zeynep (Sv.${data.staff.zeynep}/6)` : "👩‍🍳 Kasiyer Zeynep'i İşe Al",
        desc: "7/24 Market müşterilerine otomatik satış yapar.",
        done: data.staff.zeynep >= 6,
        cost: data.staff.zeynep === 0 ? 480 : Math.round(360 * Math.pow(1.55, data.staff.zeynep))
      },
      {
        key: "kadir",
        title: data.staff.kadir > 0 ? `🚿 Yıkamacı Kadir (Sv.${data.staff.kadir}/6)` : "🚿 Yıkamacı Kadir'i İşe Al",
        desc: "Oto yıkamaya giren araçları otomatik yıkar.",
        done: data.staff.kadir >= 6,
        cost: data.staff.kadir === 0 ? 980 : Math.round(500 * Math.pow(1.55, data.staff.kadir))
      },
      {
        key: "murat",
        title: data.staff.murat > 0 ? `👷 2. Pompacı Murat (Sv.${data.staff.murat}/6)` : "👷 2. Pompacı Murat'ı İşe Al",
        desc: "Çoklu pompalarda Ali ile birlikte çalışıp trafiği eritir!",
        done: data.staff.murat >= 6,
        cost: data.staff.murat === 0 ? 1150 : Math.round(580 * Math.pow(1.55, data.staff.murat))
      },
      {
        key: "cemil",
        title: data.staff.cemil > 0 ? `🔧 Tamir Ustası Cemil (Sv.${data.staff.cemil}/6)` : "🔧 Tamir Ustası Cemil'i İşe Al",
        desc: "Tamirhane garajındaki araçları otomatik onarıp yüksek gelir sağlar!",
        done: data.staff.cemil >= 6,
        cost: data.staff.cemil === 0 ? 2100 : Math.round(850 * Math.pow(1.55, data.staff.cemil))
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
            return showToast(`Yetersiz kasa! (${st.cost} ₺ gerekli)`);
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
  // BÜYÜK YAZILI ÖZEL MÜŞTERİ EKRANI
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
        ? "🐕 DUMAN HIRLIYOR! Bu araçta veya şahısta bir sahtekârlık / tehlike var!"
        : "🐕 Duman sakin ve kuyruk sallıyor: Bu müşteri dürüst veya yardıma muhtaç.";
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

  el.insIdBtn.addEventListener("click", () => activeStoryCar && showClueText(el.insIdBtn, activeStoryCar.storyEvent.clues.idText));
  el.insTrunkBtn.addEventListener("click", () => activeStoryCar && showClueText(el.insTrunkBtn, activeStoryCar.storyEvent.clues.trunkText));
  el.insMoneyBtn.addEventListener("click", () => activeStoryCar && showClueText(el.insMoneyBtn, activeStoryCar.storyEvent.clues.moneyText));
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
        x: 78,
        y: 50,
        targetX: activeStoryCar.x,
        targetY: activeStoryCar.y,
        suspectCar: activeStoryCar,
        state: "entering",
        timer: 1.2
      };
    } else {
      activeStoryCar.state = "leaving";
    }

    // Her özel müşteri çözümünde bir sonrakine ilerle (asla takılı kalmaz!)
    data.storyIndex += 1;

    if (isCorrect) {
      data.cash += ev.reward;
      if (choice !== "police") sfx.perfectHit();
      addFloatingText(activeStoryCar.x, activeStoryCar.y - 25, `🌟 +${ev.reward} ₺`, "#fde68a");
      el.resTitle.textContent = `✅ DOĞRU KARAR! (+${ev.reward} ₺)`;
      el.resTitle.style.color = "#4ade80";
      el.resBody.textContent = ev.successMsg;
    } else {
      const pen = 85;
      data.cash = Math.max(0, data.cash - pen);
      sfx.burnFail();
      el.resTitle.textContent = `❌ YANLIŞ KARAR! (-${pen} ₺)`;
      el.resTitle.style.color = "#f87171";
      el.resBody.textContent = ev.failMsg;
    }

    el.liveHintText.textContent = "👆 Haritada araçlara yakıt koymaya devam et (5 araç sonra yeni özel olay)!";
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

  el.musicBtn.addEventListener("click", () => {
    const on = sfx.toggleMusic();
    el.musicBtn.textContent = on ? "🎵" : "🔕";
  });
  el.muteBtn.addEventListener("click", () => {
    const m = sfx.toggleMute();
    el.muteBtn.textContent = m ? "🔇" : "🔊";
  });

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

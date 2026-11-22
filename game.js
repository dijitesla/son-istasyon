// Son İstasyon v2.0 — Ana Oyun Motoru (3 Gece x 5 Müşteri = 15 Bölüm)

(function () {
  const nights = window.GAME_NIGHTS;
  const shopItems = window.SHOP_UPGRADES;
  const clueDb = window.CLUE_DATABASE;
  const sfx = window.sfx;
  const renderPortrait = window.renderPortraitSVG;

  const SAVE_KEY = "son_istasyon_v2_save";

  let persistent = {
    cash: 220,
    upgrades: {},
    clues: {}
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.cash === "number") persistent.cash = parsed.cash;
      if (parsed.upgrades) persistent.upgrades = parsed.upgrades;
      if (parsed.clues) persistent.clues = parsed.clues;
    }
  } catch (_) {}

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(persistent));
    } catch (_) {}
  }

  let state = {
    nightIdx: 0,
    custIdx: 0,
    correctInNight: 0,
    tipEarned: 0,
    fuelDone: false,
    coffeeDone: false,
    toastState: "idle", // idle | cooking | done
    grillVal: 0,
    grillInterval: null,
    waterDone: false,
    uvChecked: false,
    uvLightOn: false,
    phoneState: "none", // none | waiting_plug | charging | ringing | read
    phoneUnlocked: false,
    pinInput: "",
    phoneTimer: null,
    intruderScared: false,
    pumpVal: 0,
    pumpInterval: null
  };

  const el = {
    startScreen: document.getElementById("startScreen"),
    startNightTitle: document.getElementById("startNightTitle"),
    bossNoteText: document.getElementById("bossNoteText"),
    startShiftBtn: document.getElementById("startShiftBtn"),
    toastBanner: document.getElementById("toastBanner"),
    nightBadge: document.getElementById("nightBadge"),
    clockText: document.getElementById("clockText"),
    customerCounter: document.getElementById("customerCounter"),
    cashText: document.getElementById("cashText"),
    muteBtn: document.getElementById("muteBtn"),
    radioText: document.getElementById("radioText"),
    cctvBtn: document.getElementById("cctvBtn"),
    cctvBtnLabel: document.getElementById("cctvBtnLabel"),
    cluesBtn: document.getElementById("cluesBtn"),
    clueCountText: document.getElementById("clueCountText"),
    pumpCarWrap: document.getElementById("pumpCarWrap"),
    carMini: document.getElementById("carMini"),
    avatarHolder: document.getElementById("avatarHolder"),
    speakerName: document.getElementById("speakerName"),
    speakerRole: document.getElementById("speakerRole"),
    speechText: document.getElementById("speechText"),
    questionRow: document.getElementById("questionRow"),
    ticketBadges: document.getElementById("ticketBadges"),

    btnFuel: document.getElementById("btnFuel"),
    subFuel: document.getElementById("subFuel"),
    btnCoffee: document.getElementById("btnCoffee"),
    subCoffee: document.getElementById("subCoffee"),
    btnToast: document.getElementById("btnToast"),
    subToast: document.getElementById("subToast"),
    grillBarWrap: document.getElementById("grillBarWrap"),
    grillBarFill: document.getElementById("grillBarFill"),
    btnWater: document.getElementById("btnWater"),
    subWater: document.getElementById("subWater"),
    btnUv: document.getElementById("btnUv"),
    subUv: document.getElementById("subUv"),
    btnPhone: document.getElementById("btnPhone"),
    phoneBadge: document.getElementById("phoneBadge"),
    phoneEmoji: document.getElementById("phoneEmoji"),
    subPhone: document.getElementById("subPhone"),

    btnServe: document.getElementById("btnServe"),
    serveSubText: document.getElementById("serveSubText"),
    btnLock: document.getElementById("btnLock"),
    btnPolice: document.getElementById("btnPolice"),

    fuelModal: document.getElementById("fuelModal"),
    pumpCurrentVal: document.getElementById("pumpCurrentVal"),
    pumpTargetVal: document.getElementById("pumpTargetVal"),
    holdPumpBtn: document.getElementById("holdPumpBtn"),
    closeFuelBtn: document.getElementById("closeFuelBtn"),

    coffeeModal: document.getElementById("coffeeModal"),
    brewSadeBtn: document.getElementById("brewSadeBtn"),
    brewSutluBtn: document.getElementById("brewSutluBtn"),
    closeCoffeeBtn: document.getElementById("closeCoffeeBtn"),

    uvModal: document.getElementById("uvModal"),
    banknoteCard: document.getElementById("banknoteCard"),
    billDenomText: document.getElementById("billDenomText"),
    billSerialText: document.getElementById("billSerialText"),
    uvSecretStrip: document.getElementById("uvSecretStrip"),
    toggleUvBeamBtn: document.getElementById("toggleUvBeamBtn"),
    closeUvBtn: document.getElementById("closeUvBtn"),

    cctvModal: document.getElementById("cctvModal"),
    tabCam1: document.getElementById("tabCam1"),
    tabCam2: document.getElementById("tabCam2"),
    cam1View: document.getElementById("cam1View"),
    cam2View: document.getElementById("cam2View"),
    cctvCarType: document.getElementById("cctvCarType"),
    cctvPlate: document.getElementById("cctvPlate"),
    cctvNote: document.getElementById("cctvNote"),
    depotNoteBox: document.getElementById("depotNoteBox"),
    triggerAlarmBtn: document.getElementById("triggerAlarmBtn"),
    closeCctvBtn: document.getElementById("closeCctvBtn"),

    phoneModal: document.getElementById("phoneModal"),
    phoneFrame: document.getElementById("phoneFrame"),
    phoneClock: document.getElementById("phoneClock"),
    phoneOwner: document.getElementById("phoneOwner"),
    pinLockSection: document.getElementById("pinLockSection"),
    pinHintText: document.getElementById("pinHintText"),
    pinDots: document.getElementById("pinDots"),
    pinPad: document.getElementById("pinPad"),
    revealPinBtn: document.getElementById("revealPinBtn"),
    notifList: document.getElementById("notifList"),
    closePhoneBtn: document.getElementById("closePhoneBtn"),

    cluesModal: document.getElementById("cluesModal"),
    cluesListContainer: document.getElementById("cluesListContainer"),
    closeCluesBtn: document.getElementById("closeCluesBtn"),

    outcomeModal: document.getElementById("outcomeModal"),
    outcomeBadge: document.getElementById("outcomeBadge"),
    outcomeTitle: document.getElementById("outcomeTitle"),
    outcomeDesc: document.getElementById("outcomeDesc"),
    nextCustomerBtn: document.getElementById("nextCustomerBtn"),

    nightEndModal: document.getElementById("nightEndModal"),
    paperHeadline: document.getElementById("paperHeadline"),
    paperSummary: document.getElementById("paperSummary"),
    shopCashText: document.getElementById("shopCashText"),
    shopListContainer: document.getElementById("shopListContainer"),
    nextNightBtn: document.getElementById("nextNightBtn")
  };

  // Yağmur Efekti
  const canvas = document.getElementById("rainCanvas");
  const ctx = canvas.getContext("2d");
  let drops = [];

  function resizeRain() {
    canvas.width = canvas.clientWidth || 400;
    canvas.height = canvas.clientHeight || 220;
    drops = Array.from({ length: 52 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 10 + Math.random() * 13,
      speed: 4.5 + Math.random() * 4
    }));
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(148, 197, 255, 0.27)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const d of drops) {
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2.4, d.y + d.len);
      d.y += d.speed;
      d.x -= 0.5;
      if (d.y > canvas.height) {
        d.y = -14;
        d.x = Math.random() * (canvas.width + 25);
      }
    }
    ctx.stroke();
    requestAnimationFrame(drawRain);
  }
  window.addEventListener("resize", resizeRain);
  resizeRain();
  drawRain();

  let toastTimer = null;
  function showToast(msg) {
    el.toastBanner.textContent = msg;
    el.toastBanner.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toastBanner.classList.add("hidden"), 2200);
  }

  function curNight() {
    return nights[state.nightIdx];
  }

  function curCust() {
    return curNight().customers[state.custIdx];
  }

  function updateClueCount() {
    el.clueCountText.textContent = String(Object.keys(persistent.clues).length);
  }

  function updateStartScreenNight(idx) {
    state.nightIdx = idx;
    const n = nights[idx];
    el.startNightTitle.textContent = `📩 Patron • ${n.title}`;
    el.bossNoteText.textContent = n.bossSms;
    document.querySelectorAll(".night-pill-btn").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.night) === idx);
    });
  }

  document.querySelectorAll(".night-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      updateStartScreenNight(Number(btn.dataset.night));
    });
  });

  updateStartScreenNight(0);
  updateClueCount();

  function setCustomerMood(mood) {
    const c = curCust();
    el.avatarHolder.innerHTML = renderPortrait(c.look, mood);
  }

  function isOrderComplete() {
    const req = curCust().requests;
    if (req.fuel > 0 && !state.fuelDone) return false;
    if (req.coffee && !state.coffeeDone) return false;
    if (req.toast && state.toastState !== "done") return false;
    if (req.water && !state.waterDone) return false;
    if (curCust().wantsCharger && state.phoneState === "waiting_plug") return false;
    return true;
  }

  function renderUI() {
    const c = curCust();
    const req = c.requests;
    el.cashText.textContent = persistent.cash;
    updateClueCount();

    // İstek Fişi
    el.ticketBadges.innerHTML = "";
    const addChip = (label, done) => {
      const sp = document.createElement("span");
      sp.className = "req-chip" + (done ? " done" : "");
      sp.textContent = label + (done ? " ✓" : "");
      el.ticketBadges.appendChild(sp);
    };

    if (req.fuel > 0) addChip(`⛽ ${req.fuel}₺`, state.fuelDone);
    if (req.coffee) addChip(req.coffee === "sade" ? "☕ Sade" : "🥛 Sütlü", state.coffeeDone);
    if (req.toast) addChip("🥪 Tost", state.toastState === "done");
    if (req.water) addChip("💧 Su", state.waterDone);
    if (c.wantsCharger) addChip("🔌 Şarj", state.phoneState !== "waiting_plug");

    // 1. Pompa
    el.btnFuel.classList.remove("needed", "prepared");
    if (req.fuel > 0) {
      if (state.fuelDone) {
        el.btnFuel.classList.add("prepared");
        el.subFuel.textContent = `${req.fuel}₺ Hazır ✓`;
      } else {
        el.btnFuel.classList.add("needed");
        el.subFuel.textContent = `${req.fuel}₺ Bas!`;
      }
    } else {
      el.subFuel.textContent = "İstenmedi";
    }

    // 2. Kahve
    el.btnCoffee.classList.remove("needed", "prepared");
    if (req.coffee) {
      if (state.coffeeDone) {
        el.btnCoffee.classList.add("prepared");
        el.subCoffee.textContent = "Hazır ✓";
      } else {
        el.btnCoffee.classList.add("needed");
        el.subCoffee.textContent = req.coffee === "sade" ? "Sade İstedi" : "Sütlü İstedi";
      }
    } else {
      el.subCoffee.textContent = "İstenmedi";
    }

    // 3. Tost
    el.btnToast.classList.remove("needed", "prepared");
    if (req.toast) {
      if (state.toastState === "done") {
        el.btnToast.classList.add("prepared");
        el.subToast.textContent = "Çıtır Hazır ✓";
        el.grillBarWrap.classList.remove("active");
      } else if (state.toastState === "cooking") {
        el.btnToast.classList.add("needed");
        el.subToast.textContent = "Yeşilde Al!";
        el.grillBarWrap.classList.add("active");
      } else {
        el.btnToast.classList.add("needed");
        el.subToast.textContent = "Pişir!";
        el.grillBarWrap.classList.remove("active");
      }
    } else {
      el.subToast.textContent = "İstenmedi";
      el.grillBarWrap.classList.remove("active");
    }

    // 4. Su
    el.btnWater.classList.remove("needed", "prepared");
    if (req.water) {
      if (state.waterDone) {
        el.btnWater.classList.add("prepared");
        el.subWater.textContent = "Verildi ✓";
      } else {
        el.btnWater.classList.add("needed");
        el.subWater.textContent = "Dolaptan Al!";
      }
    } else {
      el.subWater.textContent = "İstenmedi";
    }

    // 5. Mor Işık (Para Kontrolü)
    el.btnUv.classList.remove("prepared", "uv-suspect");
    if (state.uvChecked) {
      if (c.cashBill.fake) {
        el.btnUv.classList.add("uv-suspect");
        el.subUv.textContent = "⚠️ SAHTE PARA!";
      } else {
        el.btnUv.classList.add("prepared");
        el.subUv.textContent = `${c.cashBill.denom}₺ Gerçek ✓`;
      }
    } else if (persistent.upgrades.proUv && c.cashBill.fake) {
      el.btnUv.classList.add("uv-suspect");
      el.subUv.textContent = "⚠️ Şüpheli!";
    } else {
      el.subUv.textContent = `${c.cashBill.denom}₺ İncele`;
    }

    // 6. Şarj Prizi
    el.btnPhone.classList.remove("needed", "prepared", "phone-ringing");
    el.phoneBadge.style.display = "none";
    if (state.phoneState === "none") {
      el.phoneEmoji.textContent = "🔌";
      el.subPhone.textContent = "Boşta";
    } else if (state.phoneState === "waiting_plug") {
      el.btnPhone.classList.add("needed");
      el.phoneEmoji.textContent = "📱";
      el.subPhone.textContent = "Prize Tak!";
    } else if (state.phoneState === "charging") {
      el.btnPhone.classList.add("prepared");
      el.phoneEmoji.textContent = "⚡";
      el.subPhone.textContent = "Şarjda...";
    } else if (state.phoneState === "ringing") {
      el.btnPhone.classList.add("phone-ringing");
      el.phoneEmoji.textContent = c.phoneData.locked ? "🔒" : "📲";
      el.subPhone.textContent = c.phoneData.locked ? "Şifreli Mesaj!" : "Mesaj Düştü!";
      el.phoneBadge.textContent = "!";
      el.phoneBadge.style.display = "inline-block";
    } else if (state.phoneState === "read") {
      el.btnPhone.classList.add("prepared");
      el.phoneEmoji.textContent = "📱";
      el.subPhone.textContent = "Tekrar Bak";
    }

    // Kamera Uyarı Işığı
    if (c.depotIntruder && !state.intruderScared && persistent.upgrades.depotAlarm) {
      el.cctvBtn.classList.add("danger-blink");
      el.cctvBtnLabel.textContent = "🚨 DEPO ALARM!";
    } else {
      el.cctvBtn.classList.remove("danger-blink");
      el.cctvBtnLabel.textContent = "KAMERA (2)";
    }

    // Satış Butonu
    if (isOrderComplete()) {
      el.btnServe.classList.remove("locked-serve");
      el.serveSubText.textContent = `+${c.reward + state.tipEarned} ₺ Tahsil Et`;
    } else {
      el.btnServe.classList.add("locked-serve");
      el.serveSubText.textContent = "Önce İsteği Hazırla";
    }
  }

  function loadCustomer(custIndex) {
    clearTimeout(state.phoneTimer);
    clearInterval(state.grillInterval);
    clearInterval(state.pumpInterval);

    state.custIdx = custIndex;
    state.tipEarned = 0;
    state.fuelDone = false;
    state.coffeeDone = false;
    state.toastState = "idle";
    state.grillVal = 0;
    state.waterDone = false;
    state.uvChecked = false;
    state.uvLightOn = false;
    state.phoneUnlocked = false;
    state.pinInput = "";
    state.intruderScared = false;

    const n = curNight();
    const c = curCust();
    state.phoneState = c.wantsCharger ? "waiting_plug" : "none";

    el.nightBadge.textContent = `Gece ${n.nightNumber}/3`;
    el.clockText.textContent = c.time;
    el.customerCounter.textContent = `${custIndex + 1}/${n.customers.length}`;
    el.radioText.textContent = c.radioTicker;

    // Araba ve Karakter Animasyonu
    el.pumpCarWrap.classList.add("offscreen");
    el.avatarHolder.classList.add("entering");

    setTimeout(() => {
      if (c.car.plate === "YAYA GELDİ") {
        el.pumpCarWrap.classList.add("offscreen");
      } else {
        el.carMini.style.background = c.car.color;
        el.pumpCarWrap.classList.remove("offscreen");
      }
      setCustomerMood("neutral");
      el.avatarHolder.classList.remove("entering");
      sfx.doorBell();
    }, 170);

    el.speakerName.textContent = c.name;
    el.speakerRole.textContent = c.role;
    el.speechText.textContent = `"${c.greeting}"`;

    // Diyalog Soruları
    el.questionRow.innerHTML = "";
    c.questions.forEach((q) => {
      const b = document.createElement("button");
      b.className = "q-btn";
      b.textContent = `💬 ${q.btn}`;
      b.addEventListener("click", () => {
        sfx.tap();
        b.classList.add("asked");
        el.speechText.textContent = `"${q.reply}"`;
        setCustomerMood(q.mood || "neutral");
      });
      el.questionRow.appendChild(b);
    });

    renderUI();
  }

  // ================= 1. POMPA 4 BENZİN SAYACI =================
  el.btnFuel.addEventListener("click", () => {
    const c = curCust();
    if (!c.requests.fuel) {
      sfx.tap();
      showToast("Bu müşteri yakıt istemedi.");
      return;
    }
    if (state.fuelDone) {
      showToast("Yakıt zaten dolduruldu!");
      return;
    }
    sfx.tap();
    state.pumpVal = 0;
    el.pumpCurrentVal.textContent = "0";
    el.pumpTargetVal.textContent = String(c.requests.fuel);
    el.fuelModal.classList.remove("hidden");
  });

  function startPumping(e) {
    if (e) e.preventDefault();
    if (state.pumpInterval || state.fuelDone) return;
    const target = curCust().requests.fuel;

    state.pumpInterval = setInterval(() => {
      const nearTarget = Math.abs(target - state.pumpVal) <= 55;
      const step = persistent.upgrades.autoPump && nearTarget ? 5 : 10;
      state.pumpVal += step;
      el.pumpCurrentVal.textContent = String(state.pumpVal);
      sfx.pumpTick(260 + Math.min(state.pumpVal, 600) * 0.6);

      if (state.pumpVal >= target + 120) {
        stopPumping();
      }
    }, 65);
  }

  function stopPumping() {
    if (!state.pumpInterval) return;
    clearInterval(state.pumpInterval);
    state.pumpInterval = null;

    const target = curCust().requests.fuel;
    const diff = state.pumpVal - target;
    const tolPerfect = persistent.upgrades.autoPump ? 35 : 20;

    if (state.pumpVal < target - 50) {
      showToast(`Henüz ${state.pumpVal} ₺ oldu, basılı tutmaya devam et!`);
      return;
    }

    state.fuelDone = true;
    el.fuelModal.classList.add("hidden");

    if (Math.abs(diff) <= tolPerfect) {
      sfx.perfectHit();
      state.tipEarned += 25;
      showToast(`🎯 Tam İsabet (${state.pumpVal} ₺)! +25 ₺ Bahşiş!`);
    } else if (diff > 55) {
      sfx.burnFail();
      persistent.cash = Math.max(0, persistent.cash - 30);
      showToast(`⚠️ Sayacı taşırdın (${state.pumpVal} ₺)! -30 ₺ zarar.`);
    } else {
      sfx.cashRegister();
      showToast(`⛽ Yakıt tamamlandı (${state.pumpVal} ₺).`);
    }
    renderUI();
  }

  el.holdPumpBtn.addEventListener("pointerdown", startPumping);
  window.addEventListener("pointerup", stopPumping);
  window.addEventListener("pointercancel", stopPumping);

  el.closeFuelBtn.addEventListener("click", () => {
    stopPumping();
    el.fuelModal.classList.add("hidden");
  });

  // ================= 2. KAHVE MAKİNESİ =================
  el.btnCoffee.addEventListener("click", () => {
    const c = curCust();
    if (!c.requests.coffee) {
      sfx.tap();
      showToast("Müşteri kahve istemedi.");
      return;
    }
    if (state.coffeeDone) {
      showToast("Kahve zaten hazır!");
      return;
    }
    sfx.tap();
    el.coffeeModal.classList.remove("hidden");
  });

  function pickCoffee(type) {
    const wanted = curCust().requests.coffee;
    if (type !== wanted) {
      sfx.burnFail();
      showToast(`Müşteri ${wanted === "sade" ? "SADE" : "SÜTLÜ"} kahve istemişti!`);
      return;
    }
    sfx.coffeeBrew();
    state.coffeeDone = true;
    el.coffeeModal.classList.add("hidden");
    showToast("☕ Sıcak kahve hazırlandı!");
    renderUI();
  }

  el.brewSadeBtn.addEventListener("click", () => pickCoffee("sade"));
  el.brewSutluBtn.addEventListener("click", () => pickCoffee("sutlu"));
  el.closeCoffeeBtn.addEventListener("click", () => el.coffeeModal.classList.add("hidden"));

  // ================= 3. TOST IZGARASI (ZAMANLAMA ÇUBUĞU) =================
  el.btnToast.addEventListener("click", () => {
    const c = curCust();
    if (!c.requests.toast) {
      sfx.tap();
      showToast("Müşteri tost istemedi.");
      return;
    }
    if (state.toastState === "done") {
      showToast("Tost zaten hazır!");
      return;
    }
    if (state.toastState === "idle") {
      sfx.toastStart();
      state.toastState = "cooking";
      state.grillVal = 0;
      renderUI();

      state.grillInterval = setInterval(() => {
        state.grillVal += 4;
        el.grillBarFill.style.width = `${Math.min(state.grillVal, 100)}%`;

        if (state.grillVal < 45) {
          el.grillBarFill.style.background = "#38bdf8"; // Çiğ
        } else if (state.grillVal <= 85) {
          el.grillBarFill.style.background = "#22c55e"; // Altın Kızarmış
          if (persistent.upgrades.smartGrill && state.grillVal >= 64) {
            clearInterval(state.grillInterval);
            state.toastState = "done";
            state.tipEarned += 15;
            sfx.toastReady();
            showToast("🥪 Termostatlı Izgara: Çıtır Tost Hazır! (+15 ₺)");
            renderUI();
            return;
          }
        } else {
          el.grillBarFill.style.background = "#ef4444"; // Yanıyor
        }

        if (state.grillVal >= 100) {
          clearInterval(state.grillInterval);
          state.toastState = "idle";
          state.grillVal = 0;
          sfx.burnFail();
          showToast("🔥 Tost yandı! Tekrar basıp pişir.");
          renderUI();
        }
      }, 95);
      return;
    }

    if (state.toastState === "cooking") {
      if (state.grillVal < 45) {
        showToast("Henüz kaşarı erimedi, çubuk YEŞİL olunca bas!");
        return;
      }
      if (state.grillVal <= 88) {
        clearInterval(state.grillInterval);
        state.toastState = "done";
        state.tipEarned += 15;
        sfx.toastReady();
        showToast("🥪 Altın kıvamında tost! (+15 ₺ Bahşiş)");
        renderUI();
      }
    }
  });

  // ================= 4. SOĞUK SU =================
  el.btnWater.addEventListener("click", () => {
    const c = curCust();
    if (!c.requests.water) {
      sfx.tap();
      showToast("Müşteri su istemedi.");
      return;
    }
    if (state.waterDone) return;
    sfx.waterGrab();
    state.waterDone = true;
    renderUI();
  });

  // ================= 5. MOR IŞIK (SAHTE PARA KONTROLÜ) =================
  el.btnUv.addEventListener("click", () => {
    const bill = curCust().cashBill;
    sfx.tap();
    state.uvLightOn = false;
    el.banknoteCard.classList.remove("uv-active");
    el.billDenomText.textContent = `${bill.denom} ₺`;
    el.billSerialText.textContent = `SERİ: ${bill.serial}`;
    el.uvSecretStrip.textContent = bill.uvText;
    el.uvSecretStrip.className = "uv-secret-strip " + (bill.fake ? "uv-fake" : "uv-real");
    el.uvModal.classList.remove("hidden");
  });

  el.toggleUvBeamBtn.addEventListener("click", () => {
    sfx.uvToggle();
    state.uvLightOn = !state.uvLightOn;
    state.uvChecked = true;
    el.banknoteCard.classList.toggle("uv-active", state.uvLightOn);
    renderUI();
  });

  el.closeUvBtn.addEventListener("click", () => {
    sfx.tap();
    el.uvModal.classList.add("hidden");
  });

  // ================= 6. ÇİFT GÜVENLİK KAMERASI =================
  function switchCameraTab(camNum) {
    const c = curCust();
    el.tabCam1.classList.toggle("active", camNum === 1);
    el.tabCam2.classList.toggle("active", camNum === 2);
    el.cam1View.style.display = camNum === 1 ? "block" : "none";
    el.cam2View.style.display = camNum === 2 ? "block" : "none";

    el.cctvCarType.textContent = c.car.type;
    el.cctvPlate.textContent = c.car.plate;
    el.cctvNote.textContent = c.car.pumpNote;

    if (c.depotIntruder && !state.intruderScared) {
      el.depotNoteBox.textContent = c.depotNote;
      el.depotNoteBox.style.borderLeftColor = "#ef4444";
      el.triggerAlarmBtn.style.display = "block";
    } else if (c.depotIntruder && state.intruderScared) {
      el.depotNoteBox.textContent = "✓ Spot ışığı ve siren açıldı! Maskeli şahıs panikle duvarın arkasına kaçtı.";
      el.depotNoteBox.style.borderLeftColor = "#4ade80";
      el.triggerAlarmBtn.style.display = "none";
    } else {
      el.depotNoteBox.textContent = c.depotNote;
      el.depotNoteBox.style.borderLeftColor = "#4ade80";
      el.triggerAlarmBtn.style.display = "none";
    }
  }

  el.cctvBtn.addEventListener("click", () => {
    sfx.cameraClick();
    const startTab = curCust().depotIntruder && !state.intruderScared && persistent.upgrades.depotAlarm ? 2 : 1;
    switchCameraTab(startTab);
    el.cctvModal.classList.remove("hidden");
  });

  el.tabCam1.addEventListener("click", () => {
    sfx.cameraClick();
    switchCameraTab(1);
  });

  el.tabCam2.addEventListener("click", () => {
    sfx.cameraClick();
    switchCameraTab(2);
  });

  el.triggerAlarmBtn.addEventListener("click", () => {
    sfx.alarmBlast();
    state.intruderScared = true;
    persistent.cash += 40;
    showToast("🔔 Depo hırsızı püskürtüldü! (+40 ₺ Güvenlik Primi)");
    switchCameraTab(2);
    renderUI();
  });

  el.closeCctvBtn.addEventListener("click", () => {
    sfx.tap();
    el.cctvModal.classList.add("hidden");
  });

  // ================= 7. ŞARJDAKİ TELEFON & 4 HANELİ ŞİFRE =================
  function buildPinKeypad() {
    el.pinPad.innerHTML = "";
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Sil", "0", "Aç"];
    keys.forEach((k) => {
      const b = document.createElement("button");
      b.className = "pin-key";
      b.textContent = k;
      b.addEventListener("click", () => onPinPress(k));
      el.pinPad.appendChild(b);
    });
  }
  buildPinKeypad();

  function renderPinDots() {
    const dots = el.pinDots.querySelectorAll(".pin-dot");
    dots.forEach((d, idx) => {
      d.classList.toggle("filled", idx < state.pinInput.length);
    });
  }

  function onPinPress(key) {
    const pd = curCust().phoneData;
    if (!pd) return;

    if (key === "Sil") {
      sfx.tap();
      state.pinInput = state.pinInput.slice(0, -1);
      renderPinDots();
      return;
    }
    if (key === "Aç") {
      checkPinCode();
      return;
    }
    if (state.pinInput.length < 4) {
      sfx.keypadBeep(Number(key));
      state.pinInput += key;
      renderPinDots();
      if (state.pinInput.length === 4) {
        setTimeout(checkPinCode, 140);
      }
    }
  }

  function checkPinCode() {
    const pd = curCust().phoneData;
    if (state.pinInput === pd.pin) {
      sfx.pinUnlock();
      state.phoneUnlocked = true;
      showToast("🔓 Telefon kilidi açıldı!");
      openPhoneModal();
    } else {
      sfx.burnFail();
      state.pinInput = "";
      renderPinDots();
      showToast("❌ Yanlış şifre! İpucuna tekrar bak.");
    }
  }

  el.revealPinBtn.addEventListener("click", () => {
    const pd = curCust().phoneData;
    if (!pd) return;
    sfx.tap();
    el.pinHintText.textContent = `💡 Çözülen Şifre: ${pd.pin} (Tuşlayabilirsin)`;
  });

  function openPhoneModal() {
    const c = curCust();
    const pd = c.phoneData;
    el.phoneFrame.className = "lockscreen-phone" + (pd.wallpaperTone === "crimson" ? " crimson" : "");
    el.phoneClock.textContent = c.time;
    el.phoneOwner.textContent = `${pd.owner} • ⚡ Şarjda`;

    if (pd.locked && !state.phoneUnlocked) {
      el.pinLockSection.style.display = "block";
      el.notifList.style.display = "none";
      el.pinHintText.textContent = `🔒 ${pd.pinHint}`;
      state.pinInput = "";
      renderPinDots();
    } else {
      el.pinLockSection.style.display = "none";
      el.notifList.style.display = "block";
      el.notifList.innerHTML = "";
      pd.notifications.forEach((n) => {
        const d = document.createElement("div");
        d.className = "notif-card";
        d.innerHTML = `
          <div class="notif-meta">${n.app}</div>
          <div class="notif-sender">${n.sender}</div>
          <div class="notif-body">${n.body}</div>
        `;
        el.notifList.appendChild(d);
      });
    }
    el.phoneModal.classList.remove("hidden");
  }

  el.btnPhone.addEventListener("click", () => {
    if (state.phoneState === "none") {
      sfx.tap();
      showToast("Bu müşteri şarja telefon bırakmadı.");
      return;
    }
    if (state.phoneState === "waiting_plug") {
      sfx.tap();
      state.phoneState = "charging";
      showToast("📱 Telefon şarja takıldı...");
      renderUI();
      state.phoneTimer = setTimeout(() => {
        state.phoneState = "ringing";
        sfx.phoneBuzz();
        showToast("📲 Şarjdaki telefona bildirim düştü!");
        renderUI();
      }, 1150);
      return;
    }
    if (state.phoneState === "charging") {
      showToast("Telefon açılıyor, 1 saniye bekle...");
      return;
    }
    sfx.tap();
    state.phoneState = "read";
    openPhoneModal();
    renderUI();
  });

  el.closePhoneBtn.addEventListener("click", () => {
    sfx.tap();
    el.phoneModal.classList.add("hidden");
  });

  // ================= 8. KANIT PANOSU =================
  el.cluesBtn.addEventListener("click", () => {
    sfx.tap();
    el.cluesListContainer.innerHTML = "";
    const keys = Object.keys(clueDb);
    keys.forEach((k) => {
      const info = clueDb[k];
      const unlocked = !!persistent.clues[k];
      const item = document.createElement("div");
      item.style.cssText =
        "background:#1e293b; border:2px solid " +
        (unlocked ? "#f59e0b" : "#334155") +
        "; border-radius:10px; padding:9px 11px;";
      item.innerHTML = unlocked
        ? `<div style="font-size:10px; color:#fde68a; font-weight:800;">📌 ${info.night} KANITI</div>
           <div style="font-size:13px; font-weight:900; margin:2px 0;">${info.title}</div>
           <div style="font-size:12px; color:#cbd5e1;">${info.detail}</div>`
        : `<div style="font-size:12px; color:#64748b; font-weight:800;">🔒 Gizli Kanıt (${info.night} içinde bulunur)</div>`;
      el.cluesListContainer.appendChild(item);
    });
    el.cluesModal.classList.remove("hidden");
  });

  el.closeCluesBtn.addEventListener("click", () => {
    sfx.tap();
    el.cluesModal.classList.add("hidden");
  });

  // ================= 9. KARAR VE GECE SONU DÜKKÂNI =================
  function handleDecision(choice) {
    const c = curCust();
    if (choice === "serve" && !isOrderComplete()) {
      sfx.tap();
      showToast("Satışı tamamlamak için önce fişteki tüm istekleri hazırla!");
      return;
    }

    clearTimeout(state.phoneTimer);
    clearInterval(state.grillInterval);
    clearInterval(state.pumpInterval);

    const res = c.outcomes[choice];
    let extraNote = "";

    // Eğer arka depoda hırsız vardı ve kameradan alarm çalınmadıysa!
    if (c.depotIntruder && !state.intruderScared && choice !== "police") {
      persistent.cash = Math.max(0, persistent.cash - 90);
      extraNote = " ⚠️ (Arka depo kamerasına bakmadığın için kasadan -90 ₺ malzeme çalındı!)";
    }

    if (choice === "serve") {
      sfx.cashRegister();
      if (res.correct) {
        persistent.cash += c.reward + state.tipEarned;
      } else {
        persistent.cash = Math.max(0, persistent.cash - (res.penalty || 0));
      }
    } else if (choice === "lock") {
      sfx.lockDoor();
      if (res.bonus) persistent.cash += res.bonus;
      if (res.penalty) persistent.cash = Math.max(0, persistent.cash - res.penalty);
    } else if (choice === "police") {
      sfx.policeSiren();
      if (res.bonus) persistent.cash += res.bonus;
      if (res.penalty) persistent.cash = Math.max(0, persistent.cash - res.penalty);
    }

    if (res.correct) state.correctInNight += 1;
    if (res.clue) persistent.clues[res.clue] = true;
    saveProgress();
    renderUI();

    el.outcomeBadge.textContent = res.badge;
    el.outcomeBadge.className = "stamp-badge " + (res.correct ? "stamp-good" : "stamp-bad");
    el.outcomeTitle.textContent = res.title;
    el.outcomeDesc.textContent = res.desc + extraNote;

    const isLastCustomer = state.custIdx >= curNight().customers.length - 1;
    el.nextCustomerBtn.textContent = isLastCustomer
      ? "☀️ SABAH GAZETESİ VE DÜKKÂN ➔"
      : `SIRADAKİ MÜŞTERİ (${state.custIdx + 2}/5) ➔`;

    el.outcomeModal.classList.remove("hidden");
  }

  el.btnServe.addEventListener("click", () => handleDecision("serve"));
  el.btnLock.addEventListener("click", () => handleDecision("lock"));
  el.btnPolice.addEventListener("click", () => handleDecision("police"));

  el.nextCustomerBtn.addEventListener("click", () => {
    sfx.tap();
    el.outcomeModal.classList.add("hidden");
    if (state.custIdx < curNight().customers.length - 1) {
      loadCustomer(state.custIdx + 1);
    } else {
      openNightEndHub();
    }
  });

  function renderShop() {
    el.shopCashText.textContent = String(persistent.cash);
    el.shopListContainer.innerHTML = "";
    shopItems.forEach((item) => {
      const owned = !!persistent.upgrades[item.id];
      const row = document.createElement("div");
      row.className = "shop-item";
      row.innerHTML = `
        <div>
          <div style="font-size:12.5px; font-weight:900;">${item.name}</div>
          <div style="font-size:11px; color:#cbd5e1; line-height:1.3;">${item.desc}</div>
        </div>
      `;
      const btn = document.createElement("button");
      btn.className = "shop-buy-btn";
      if (owned) {
        btn.disabled = true;
        btn.textContent = "ALINDI ✓";
      } else {
        btn.textContent = `${item.cost} ₺ Al`;
        btn.addEventListener("click", () => {
          if (persistent.cash < item.cost) {
            sfx.burnFail();
            showToast("Kasada yeterli para yok!");
            return;
          }
          sfx.cashRegister();
          persistent.cash -= item.cost;
          persistent.upgrades[item.id] = true;
          saveProgress();
          renderShop();
          renderUI();
        });
      }
      row.appendChild(btn);
      el.shopListContainer.appendChild(row);
    });
  }

  function openNightEndHub() {
    const n = curNight().nightNumber;
    if (n === 1) {
      el.paperHeadline.textContent = `${state.correctInNight}/5 DOĞRU KARAR! SON İSTASYON'DA HAREKETLİ GECE!`;
      el.paperSummary.textContent =
        "İlk vardiyanda 5 müşteriyi ağırladın. 404 plakalı araç ve 'Kuzgun' şebekesiyle ilgili ilk ciddi ipuçları ortaya çıktı!";
      el.nextNightBtn.textContent = "🌙 2. GECEYE GEÇ (5 YENİ MÜŞTERİ) ➔";
    } else if (n === 2) {
      el.paperHeadline.textContent = `2. GECE TAMAMLANDI (${state.correctInNight}/5)! EMRE YAŞIYOR!`;
      el.paperSummary.textContent =
        "Maden yolundaki depo deşifre oldu! Yarın gece hem Emre'nin hem de elebaşı Kuzgun'un istasyona gelmesi bekleniyor.";
      el.nextNightBtn.textContent = "🌙 3. GECE: FİNAL VARDİYASINA GEÇ ➔";
    } else {
      el.paperHeadline.textContent = `BÜYÜK FİNAL (${state.correctInNight}/5)! SON İSTASYON EFSANESİ!`;
      el.paperSummary.textContent =
        "3 gece boyunca toplam 15 müşteriyi yönetip Pompa 4'ün altındaki sırrı çözdün! İstediğin geceyi tekrar oynayabilirsin.";
      el.nextNightBtn.textContent = "🏆 ANA EKRANA DÖN";
    }
    renderShop();
    el.nightEndModal.classList.remove("hidden");
  }

  el.nextNightBtn.addEventListener("click", () => {
    sfx.tap();
    el.nightEndModal.classList.add("hidden");
    if (state.nightIdx < nights.length - 1) {
      state.nightIdx += 1;
      state.correctInNight = 0;
      loadCustomer(0);
    } else {
      updateStartScreenNight(0);
      el.startScreen.classList.remove("hidden");
    }
  });

  el.muteBtn.addEventListener("click", () => {
    const m = sfx.toggleMute();
    el.muteBtn.textContent = m ? "🔇" : "🔊";
  });

  el.startShiftBtn.addEventListener("click", () => {
    sfx.startRainAmbience();
    sfx.tap();
    state.correctInNight = 0;
    el.startScreen.classList.add("hidden");
    loadCustomer(0);
  });
})();

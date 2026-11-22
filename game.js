// Son İstasyon v4.0 — Ana Oyun Motoru
// (El Fenerli Bagaj, Köpek Duman, Çalan Sabit Telefon, Para Üstü & Veresiye Defteri, Fotoğraf Galerisi)

(function () {
  const storyNights = window.GAME_NIGHTS;
  const catalog = window.CATALOG;
  const shopItems = window.SHOP_UPGRADES;
  const badgesList = window.BADGES_LIST;
  const clueDb = window.CLUE_DATABASE;
  const sfx = window.sfx;

  const SAVE_KEY = "son_istasyon_v4_save";

  let persistent = {
    cash: 260,
    upgrades: {},
    clues: {},
    badges: {},
    ledger: [],
    endlessShift: 1
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.cash === "number") persistent.cash = p.cash;
      if (p.upgrades) persistent.upgrades = p.upgrades;
      if (p.clues) persistent.clues = p.clues;
      if (p.badges) persistent.badges = p.badges;
      if (Array.isArray(p.ledger)) persistent.ledger = p.ledger;
      if (typeof p.endlessShift === "number") persistent.endlessShift = p.endlessShift;
    }
  } catch (_) {}

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(persistent));
    } catch (_) {}
  }

  function unlockBadge(badgeId) {
    if (!badgeId || persistent.badges[badgeId]) return;
    persistent.badges[badgeId] = true;
    saveProgress();
    const b = badgesList.find((x) => x.id === badgeId);
    if (b) {
      setTimeout(() => showToast(`🏅 Yeni Rozet: ${b.icon} ${b.name}!`), 550);
    }
  }

  let state = {
    mode: "story",
    nightIdx: 0,
    activeNightObj: storyNights[0],
    custIdx: 0,
    correctInNight: 0,
    tipEarned: 0,

    dumanFed: false,
    trunkInspected: false,

    landlineActive: false,
    landlineAnswered: false,
    landlineTimer: null,

    selectedChange: 0,

    selectedFuelType: "benzin",
    fuelDone: false,
    drinkDone: false,
    toastState: "idle",
    grillVal: 0,
    grillInterval: null,
    marketDone: false,

    uvChecked: false,
    uvLightOn: false,

    isBlackout: false,
    breakers: [false, false, false, false],
    outageTimer: null,

    phoneState: "none",
    phoneUnlocked: false,
    phoneTab: "msgs", // msgs | gallery
    pinInput: "",
    suspicion: 0,
    suspicionInterval: null,
    phoneTimer: null,

    intruderScared: false,
    pumpVal: 0,
    pumpInterval: null
  };

  const el = {
    phoneStage: document.getElementById("phoneStage"),
    startScreen: document.getElementById("startScreen"),
    startNightTitle: document.getElementById("startNightTitle"),
    bossNoteText: document.getElementById("bossNoteText"),
    endlessSelectBtn: document.getElementById("endlessSelectBtn"),
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
    wantedBtn: document.getElementById("wantedBtn"),
    cluesBtn: document.getElementById("cluesBtn"),
    clueCountText: document.getElementById("clueCountText"),
    dumanPill: document.getElementById("dumanPill"),

    pumpCarWrap: document.getElementById("pumpCarWrap"),
    outsideCarSvgHolder: document.getElementById("outsideCarSvgHolder"),
    avatarHolder: document.getElementById("avatarHolder"),
    speakerName: document.getElementById("speakerName"),
    speakerRole: document.getElementById("speakerRole"),
    speechText: document.getElementById("speechText"),

    questionRow: document.getElementById("questionRow"),
    askIdBtn: document.getElementById("askIdBtn"),
    trunkSearchBtn: document.getElementById("trunkSearchBtn"),
    openLedgerBtn: document.getElementById("openLedgerBtn"),
    landlineRingBtn: document.getElementById("landlineRingBtn"),
    breakerAlertBtn: document.getElementById("breakerAlertBtn"),
    ticketBadges: document.getElementById("ticketBadges"),

    btnFuel: document.getElementById("btnFuel"),
    subFuel: document.getElementById("subFuel"),
    btnCoffee: document.getElementById("btnCoffee"),
    subCoffee: document.getElementById("subCoffee"),
    btnToast: document.getElementById("btnToast"),
    subToast: document.getElementById("subToast"),
    grillBarWrap: document.getElementById("grillBarWrap"),
    grillBarFill: document.getElementById("grillBarFill"),
    btnMarket: document.getElementById("btnMarket"),
    subMarket: document.getElementById("subMarket"),
    btnUv: document.getElementById("btnUv"),
    subUv: document.getElementById("subUv"),
    btnPhone: document.getElementById("btnPhone"),
    phoneBadge: document.getElementById("phoneBadge"),
    phoneEmoji: document.getElementById("phoneEmoji"),
    subPhone: document.getElementById("subPhone"),

    btnServe: document.getElementById("btnServe"),
    serveSubText: document.getElementById("serveSubText"),
    btnHide: document.getElementById("btnHide"),
    btnLock: document.getElementById("btnLock"),
    btnPolice: document.getElementById("btnPolice"),

    // Yeni v4 Modallar
    trunkModal: document.getElementById("trunkModal"),
    trunkViewport: document.getElementById("trunkViewport"),
    trunkSvgHolder: document.getElementById("trunkSvgHolder"),
    flashlightMask: document.getElementById("flashlightMask"),
    trunkResultBox: document.getElementById("trunkResultBox"),
    closeTrunkBtn: document.getElementById("closeTrunkBtn"),

    dumanModal: document.getElementById("dumanModal"),
    dumanStatusDesc: document.getElementById("dumanStatusDesc"),
    feedDumanBtn: document.getElementById("feedDumanBtn"),
    petDumanBtn: document.getElementById("petDumanBtn"),
    closeDumanBtn: document.getElementById("closeDumanBtn"),

    landlineModal: document.getElementById("landlineModal"),
    landlineCallerText: document.getElementById("landlineCallerText"),
    landlineBodyText: document.getElementById("landlineBodyText"),
    landlineScamChoices: document.getElementById("landlineScamChoices"),
    scamAcceptBtn: document.getElementById("scamAcceptBtn"),
    scamRejectBtn: document.getElementById("scamRejectBtn"),
    closeLandlineBtn: document.getElementById("closeLandlineBtn"),

    registerModal: document.getElementById("registerModal"),
    regPaidWith: document.getElementById("regPaidWith"),
    regBillCost: document.getElementById("regBillCost"),
    regTargetChange: document.getElementById("regTargetChange"),
    regCurrentChange: document.getElementById("regCurrentChange"),
    resetChangeBtn: document.getElementById("resetChangeBtn"),
    autoChangeBtn: document.getElementById("autoChangeBtn"),
    confirmSaleBtn: document.getElementById("confirmSaleBtn"),
    writeCreditActionBtn: document.getElementById("writeCreditActionBtn"),
    closeRegisterBtn: document.getElementById("closeRegisterBtn"),

    ledgerModal: document.getElementById("ledgerModal"),
    ledgerEntriesBox: document.getElementById("ledgerEntriesBox"),
    writeCreditQuickBtn: document.getElementById("writeCreditQuickBtn"),
    closeLedgerBtn: document.getElementById("closeLedgerBtn"),

    // Mevcut Modallar
    fuelModal: document.getElementById("fuelModal"),
    pumpCurrentVal: document.getElementById("pumpCurrentVal"),
    pumpTargetVal: document.getElementById("pumpTargetVal"),
    holdPumpBtn: document.getElementById("holdPumpBtn"),
    closeFuelBtn: document.getElementById("closeFuelBtn"),

    coffeeModal: document.getElementById("coffeeModal"),
    closeCoffeeBtn: document.getElementById("closeCoffeeBtn"),
    toastModal: document.getElementById("toastModal"),
    closeToastBtn: document.getElementById("closeToastBtn"),
    marketModal: document.getElementById("marketModal"),
    closeMarketBtn: document.getElementById("closeMarketBtn"),

    idModal: document.getElementById("idModal"),
    idFullName: document.getElementById("idFullName"),
    idBirthYear: document.getElementById("idBirthYear"),
    idValidUntil: document.getElementById("idValidUntil"),
    idPlateMatch: document.getElementById("idPlateMatch"),
    closeIdBtn: document.getElementById("closeIdBtn"),

    wantedModal: document.getElementById("wantedModal"),
    wantedTitle: document.getElementById("wantedTitle"),
    wantedDesc: document.getElementById("wantedDesc"),
    closeWantedBtn: document.getElementById("closeWantedBtn"),

    breakerModal: document.getElementById("breakerModal"),
    breakerGrid: document.getElementById("breakerGrid"),
    closeBreakerBtn: document.getElementById("closeBreakerBtn"),

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
    cam1SvgBox: document.getElementById("cam1SvgBox"),
    cam2SvgBox: document.getElementById("cam2SvgBox"),
    cctvCarType: document.getElementById("cctvCarType"),
    cctvPlate: document.getElementById("cctvPlate"),
    cctvNote: document.getElementById("cctvNote"),
    depotNoteBox: document.getElementById("depotNoteBox"),
    triggerAlarmBtn: document.getElementById("triggerAlarmBtn"),
    closeCctvBtn: document.getElementById("closeCctvBtn"),

    phoneModal: document.getElementById("phoneModal"),
    phoneFrame: document.getElementById("phoneFrame"),
    suspicionPct: document.getElementById("suspicionPct"),
    suspicionFill: document.getElementById("suspicionFill"),
    phoneClock: document.getElementById("phoneClock"),
    phoneOwner: document.getElementById("phoneOwner"),
    pinLockSection: document.getElementById("pinLockSection"),
    pinHintText: document.getElementById("pinHintText"),
    pinDots: document.getElementById("pinDots"),
    pinPad: document.getElementById("pinPad"),
    revealPinBtn: document.getElementById("revealPinBtn"),
    unlockedPhoneContent: document.getElementById("unlockedPhoneContent"),
    phoneTabMsgs: document.getElementById("phoneTabMsgs"),
    phoneTabGallery: document.getElementById("phoneTabGallery"),
    notifList: document.getElementById("notifList"),
    galleryList: document.getElementById("galleryList"),
    closePhoneBtn: document.getElementById("closePhoneBtn"),

    cluesModal: document.getElementById("cluesModal"),
    badgesListContainer: document.getElementById("badgesListContainer"),
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

  // Yağmur
  const canvas = document.getElementById("rainCanvas");
  const ctx = canvas.getContext("2d");
  let drops = [];

  function resizeRain() {
    canvas.width = canvas.clientWidth || 400;
    canvas.height = canvas.clientHeight || 205;
    drops = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 10 + Math.random() * 12,
      speed: 4.6 + Math.random() * 4
    }));
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(148, 197, 255, 0.26)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const d of drops) {
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2.3, d.y + d.len);
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
    toastTimer = setTimeout(() => el.toastBanner.classList.add("hidden"), 2500);
  }

  function curNight() {
    return state.activeNightObj;
  }

  function curCust() {
    return curNight().customers[state.custIdx];
  }

  function updateHeaderCounts() {
    const total = Object.keys(persistent.clues).length + Object.keys(persistent.badges).length;
    el.clueCountText.textContent = String(total);
    el.cashText.textContent = String(persistent.cash);
  }

  function selectStoryNight(idx) {
    state.mode = "story";
    state.nightIdx = idx;
    state.activeNightObj = storyNights[idx];
    el.startNightTitle.textContent = `📩 Patron • ${state.activeNightObj.title}`;
    el.bossNoteText.textContent = state.activeNightObj.bossSms;
    document.querySelectorAll(".night-pill-btn").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.night) === idx);
    });
    el.endlessSelectBtn.classList.remove("active");
  }

  function selectEndlessMode() {
    state.mode = "endless";
    state.activeNightObj = window.generateEndlessNight(persistent.endlessShift);
    el.startNightTitle.textContent = `♾️ ${state.activeNightObj.title}`;
    el.bossNoteText.textContent = state.activeNightObj.bossSms;
    document.querySelectorAll(".night-pill-btn").forEach((b) => b.classList.remove("active"));
    el.endlessSelectBtn.classList.add("active");
  }

  document.querySelectorAll(".night-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      selectStoryNight(Number(btn.dataset.night));
    });
  });

  el.endlessSelectBtn.addEventListener("click", () => {
    sfx.tap();
    selectEndlessMode();
  });

  selectStoryNight(0);
  updateHeaderCounts();

  function setCustomerMood(mood) {
    el.avatarHolder.innerHTML = window.renderPortraitSVG(curCust().look, mood);
  }

  function isOrderComplete() {
    const req = curCust().requests;
    if (req.fuel > 0 && !state.fuelDone) return false;
    if (req.drink && !state.drinkDone) return false;
    if (req.toast && state.toastState !== "done") return false;
    if (req.market && !state.marketDone) return false;
    if (curCust().wantsCharger && state.phoneState === "waiting_plug") return false;
    return true;
  }

  // Vardiya başında önceki geceden kalan veresiyeleri tahsil et!
  function settlePreviousLedger() {
    let gained = 0;
    let scammed = 0;
    persistent.ledger.forEach((entry) => {
      if (!entry.settled) {
        entry.settled = true;
        if (entry.honest) {
          const payback = entry.amount * 2;
          persistent.cash += payback;
          gained += payback;
          entry.resultText = `✓ Sözünü tuttu, +${payback} ₺ ödedi!`;
        } else {
          scammed += 1;
          entry.resultText = `❌ Sahte isim vermiş, borcun üstüne yattı!`;
        }
      }
    });
    saveProgress();
    if (gained > 0) {
      setTimeout(() => {
        sfx.cashRegister();
        showToast(`📓 Veresiye Müjdesi! Dünkü borç 2 katıyla (+${gained} ₺) ödendi!`);
      }, 650);
    } else if (scammed > 0) {
      setTimeout(() => {
        sfx.burnFail();
        showToast("⚠️ Dünkü veresiye sahte çıktı, borç ödenmedi!");
      }, 650);
    }
  }

  function updateDumanUI() {
    const c = curCust();
    el.dumanPill.classList.remove("happy", "growling");
    if (!state.dumanFed) {
      el.dumanPill.textContent = "🐕 Duman: Aç 🦴";
      return;
    }
    if (c.isThreat) {
      el.dumanPill.classList.add("growling");
      el.dumanPill.textContent = "🐕 Hırlıyor! 💢";
    } else {
      el.dumanPill.classList.add("happy");
      el.dumanPill.textContent = "🐕 Dost 🐾";
    }
  }

  function renderUI() {
    const c = curCust();
    const req = c.requests;
    updateHeaderCounts();
    updateDumanUI();

    el.phoneStage.classList.toggle("blackout", state.isBlackout);
    el.breakerAlertBtn.style.display = state.isBlackout ? "flex" : "none";
    el.landlineRingBtn.style.display = state.landlineActive && !state.landlineAnswered ? "flex" : "none";

    // Veresiye isteyen müşteride buton parlasın
    el.openLedgerBtn.textContent = c.payment && c.payment.asksCredit ? "📓 Veresiye!" : "📓 Defter";

    // İstek Fişi
    el.ticketBadges.innerHTML = "";
    const addChip = (label, done) => {
      const sp = document.createElement("span");
      sp.className = "req-chip" + (done ? " done" : "");
      sp.textContent = label + (done ? " ✓" : "");
      el.ticketBadges.appendChild(sp);
    };

    if (req.fuel > 0) addChip(`⛽ ${req.fuel}₺ ${catalog.fuels[req.fuelType].short}`, state.fuelDone);
    if (req.drink) addChip(catalog.drinks[req.drink].label, state.drinkDone);
    if (req.toast) addChip(catalog.toasts[req.toast].label, state.toastState === "done");
    if (req.market) addChip(catalog.market[req.market].label, state.marketDone);
    if (c.wantsCharger) addChip("🔌 Şarj", state.phoneState !== "waiting_plug");

    // İstasyon Kartları
    el.btnFuel.classList.remove("needed", "prepared");
    if (req.fuel > 0) {
      el.btnFuel.classList.add(state.fuelDone ? "prepared" : "needed");
      el.subFuel.textContent = state.fuelDone ? "Dolu ✓" : `${req.fuel}₺ ${catalog.fuels[req.fuelType].short}`;
    } else {
      el.subFuel.textContent = "İstenmedi";
    }

    el.btnCoffee.classList.remove("needed", "prepared");
    if (req.drink) {
      el.btnCoffee.classList.add(state.drinkDone ? "prepared" : "needed");
      el.subCoffee.textContent = state.drinkDone ? "Hazır ✓" : catalog.drinks[req.drink].short;
    } else {
      el.subCoffee.textContent = "İstenmedi";
    }

    el.btnToast.classList.remove("needed", "prepared");
    if (req.toast) {
      if (state.toastState === "done") {
        el.btnToast.classList.add("prepared");
        el.subToast.textContent = "Çıtır ✓";
        el.grillBarWrap.classList.remove("active");
      } else if (state.toastState === "cooking") {
        el.btnToast.classList.add("needed");
        el.subToast.textContent = "Yeşilde Al!";
        el.grillBarWrap.classList.add("active");
      } else {
        el.btnToast.classList.add("needed");
        el.subToast.textContent = catalog.toasts[req.toast].short;
        el.grillBarWrap.classList.remove("active");
      }
    } else {
      el.subToast.textContent = "İstenmedi";
      el.grillBarWrap.classList.remove("active");
    }

    el.btnMarket.classList.remove("needed", "prepared");
    if (req.market) {
      el.btnMarket.classList.add(state.marketDone ? "prepared" : "needed");
      el.subMarket.textContent = state.marketDone ? "Verildi ✓" : catalog.market[req.market].short;
    } else {
      el.subMarket.textContent = "İstenmedi";
    }

    el.btnUv.classList.remove("prepared", "uv-suspect");
    if (state.uvChecked) {
      el.btnUv.classList.add(c.cashBill.fake ? "uv-suspect" : "prepared");
      el.subUv.textContent = c.cashBill.fake ? "⚠️ SAHTE!" : `${c.cashBill.denom}₺ Gerçek ✓`;
    } else if (persistent.upgrades.proUv && c.cashBill.fake) {
      el.btnUv.classList.add("uv-suspect");
      el.subUv.textContent = "⚠️ Şüpheli!";
    } else {
      el.subUv.textContent = `${c.cashBill.denom}₺ İncele`;
    }

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
      el.subPhone.textContent = c.phoneData.locked ? "Şifreli!" : "Mesaj+Galeri";
      el.phoneBadge.style.display = "inline-block";
    } else if (state.phoneState === "read") {
      el.btnPhone.classList.add("prepared");
      el.phoneEmoji.textContent = "📱";
      el.subPhone.textContent = "Mesaj+Galeri";
    } else if (state.phoneState === "snatched") {
      el.phoneEmoji.textContent = "😠";
      el.subPhone.textContent = "Geri Aldı!";
    }

    if (c.depotIntruder && !state.intruderScared && (persistent.upgrades.depotAlarm || state.dumanFed)) {
      el.cctvBtn.classList.add("danger-blink");
      el.cctvBtnLabel.textContent = "🚨 DEPO!";
    } else {
      el.cctvBtn.classList.remove("danger-blink");
      el.cctvBtnLabel.textContent = "KAMERA (2)";
    }

    if (isOrderComplete() && !state.isBlackout) {
      el.btnServe.classList.remove("locked-serve");
      el.serveSubText.textContent = c.payment.asksCredit ? "Kasa / Veresiye" : `Tutar: ${c.payment.billCost}₺`;
    } else {
      el.btnServe.classList.add("locked-serve");
      el.serveSubText.textContent = state.isBlackout ? "Şalter Kapalı!" : "İsteği Hazırla";
    }
  }

  function loadCustomer(idx) {
    clearTimeout(state.phoneTimer);
    clearTimeout(state.outageTimer);
    clearTimeout(state.landlineTimer);
    clearInterval(state.grillInterval);
    clearInterval(state.pumpInterval);
    stopPhoneSuspicion();

    state.custIdx = idx;
    state.tipEarned = 0;
    state.trunkInspected = false;
    state.landlineActive = false;
    state.landlineAnswered = false;
    state.selectedChange = 0;

    state.fuelDone = false;
    state.drinkDone = false;
    state.toastState = "idle";
    state.grillVal = 0;
    state.marketDone = false;
    state.uvChecked = false;
    state.uvLightOn = false;
    state.isBlackout = false;
    state.phoneUnlocked = false;
    state.phoneTab = "msgs";
    state.pinInput = "";
    state.suspicion = 0;
    state.intruderScared = false;

    const n = curNight();
    const c = curCust();
    state.phoneState = c.wantsCharger ? "waiting_plug" : "none";

    el.nightBadge.textContent = n.isEndless ? `Sonsuz #${n.nightNumber}` : `Gece ${n.nightNumber}/5`;
    el.clockText.textContent = c.time;
    el.customerCounter.textContent = `${idx + 1}/${n.customers.length}`;
    el.radioText.textContent = c.radioTicker;

    el.pumpCarWrap.classList.add("offscreen");
    el.avatarHolder.classList.add("entering");

    setTimeout(() => {
      if (c.car.shape === "walk") {
        el.outsideCarSvgHolder.innerHTML = "";
        el.pumpCarWrap.classList.add("offscreen");
      } else {
        el.outsideCarSvgHolder.innerHTML = window.renderOutsideVehicleSVG(c.car);
        el.pumpCarWrap.classList.remove("offscreen");
      }
      setCustomerMood("neutral");
      el.avatarHolder.classList.remove("entering");
      sfx.doorBell();

      // Köpek Duman tehlike sezgisi!
      if (state.dumanFed && c.isThreat) {
        setTimeout(() => {
          sfx.dogGrowl();
          showToast("🐕 Duman bu müşteriye hırlıyor! Dikkat et!");
        }, 420);
      }
    }, 170);

    if (c.powerOutage) {
      state.outageTimer = setTimeout(triggerBlackout, 1300);
    }

    // Sabit büfe telefonu çalma sürprizi!
    if (c.landlineCall) {
      state.landlineTimer = setTimeout(() => {
        state.landlineActive = true;
        sfx.landlineRing();
        showToast("☎️ Büfenin sabit telefonu çalıyor!");
        renderUI();
      }, 2100);
    }

    el.speakerName.textContent = c.name;
    el.speakerRole.textContent = c.role;
    el.speechText.textContent = `"${c.greeting}"`;

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

  // ================= YENİ 1: EL FENERİYLE BAGAJ ARAMA =================
  function moveFlashlight(e) {
    const rect = el.trunkViewport.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const xPct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));

    el.flashlightMask.style.setProperty("--fx", `${xPct}%`);
    el.flashlightMask.style.setProperty("--fy", `${yPct}%`);

    if (xPct > 26 && xPct < 76 && yPct > 22 && yPct < 82 && !state.trunkInspected) {
      state.trunkInspected = true;
      const td = curCust().trunkData;
      el.trunkResultBox.textContent = `🔦 Bulundu: ${td.label}`;
      el.trunkResultBox.style.color = td.suspicious ? "#fca5a5" : "#86efac";
      if (td.suspicious) {
        sfx.alarmBlast();
        unlockBadge("trunk_detective");
      } else {
        sfx.tap();
      }
    }
  }

  el.trunkSearchBtn.addEventListener("click", () => {
    const c = curCust();
    if (!c.trunkData) {
      sfx.tap();
      showToast("Bu müşteride aranacak araç bagajı yok!");
      return;
    }
    sfx.flashlightClick();
    el.trunkSvgHolder.innerHTML = window.renderTrunkInteriorSVG(c.trunkData.type, c.trunkData.label);
    el.flashlightMask.style.setProperty("--fx", "14%");
    el.flashlightMask.style.setProperty("--fy", "20%");
    el.trunkResultBox.textContent = state.trunkInspected
      ? `🔦 Bulundu: ${c.trunkData.label}`
      : "🔍 Parmağını karanlık bagajın ortasına doğru gezdir...";
    el.trunkModal.classList.remove("hidden");
  });

  el.trunkViewport.addEventListener("pointerdown", moveFlashlight);
  el.trunkViewport.addEventListener("pointermove", moveFlashlight);
  el.closeTrunkBtn.addEventListener("click", () => el.trunkModal.classList.add("hidden"));

  // ================= YENİ 2: İSTASYON KÖPEĞİ DUMAN =================
  el.dumanPill.addEventListener("click", () => {
    sfx.tap();
    el.dumanStatusDesc.textContent = state.dumanFed
      ? "Duman bu gece karnını doyurdu, gözü kulağı kapıda! Tehlikeli veya yalancı müşteri geldiğinde hırlayarak seni uyarır ve arka depoyu kollar."
      : "Sadık dostun Duman şu an aç ve kulübesinde uyukluyor. 20 ₺ karşılığında mama ve su verirsen sabaha kadar tehlikeli müşterilere hırlayarak seni önceden uyarır!";
    el.feedDumanBtn.disabled = state.dumanFed;
    el.feedDumanBtn.textContent = state.dumanFed ? "🍖 Karnı Tok ✓" : "🍖 Mama & Su Ver (20 ₺)";
    el.dumanModal.classList.remove("hidden");
  });

  el.feedDumanBtn.addEventListener("click", () => {
    if (state.dumanFed) return;
    if (persistent.cash < 20) {
      sfx.burnFail();
      showToast("Mama için 20 ₺ gerekli!");
      return;
    }
    persistent.cash -= 20;
    state.dumanFed = true;
    saveProgress();
    sfx.dogBark();
    unlockBadge("dog_friend");
    el.dumanModal.classList.add("hidden");
    showToast("🐕 Duman doydu! Artık tehlikeli müşterilere hırlayacak!");
    renderUI();
  });

  el.petDumanBtn.addEventListener("click", () => {
    sfx.dogBark();
    showToast("🐕 Duman keyifle kuyruk salladı!");
  });

  el.closeDumanBtn.addEventListener("click", () => el.dumanModal.classList.add("hidden"));

  // ================= YENİ 3: ÇALAN SABİT BÜFE TELEFONU =================
  el.landlineRingBtn.addEventListener("click", () => {
    const call = curCust().landlineCall;
    if (!call) return;
    sfx.tap();
    state.landlineAnswered = true;
    el.landlineCallerText.textContent = `📞 Arayan: ${call.caller}`;
    el.landlineBodyText.textContent = `"${call.text}"`;
    el.landlineScamChoices.style.display = call.isScam ? "grid" : "none";
    el.closeLandlineBtn.style.display = call.isScam ? "none" : "block";
    el.landlineModal.classList.remove("hidden");
    renderUI();
  });

  el.scamAcceptBtn.addEventListener("click", () => {
    sfx.burnFail();
    persistent.cash = Math.max(0, persistent.cash - 150);
    saveProgress();
    el.landlineModal.classList.add("hidden");
    showToast("😱 Telefon dolandırıcısına 150 ₺ kaptırdın!");
    renderUI();
  });

  el.scamRejectBtn.addEventListener("click", () => {
    sfx.perfectHit();
    persistent.cash += 65;
    saveProgress();
    unlockBadge("scam_buster");
    el.landlineModal.classList.add("hidden");
    showToast("☎️ Dolandırıcının yüzüne kapattın! (+65 ₺ Prim)");
    renderUI();
  });

  el.closeLandlineBtn.addEventListener("click", () => {
    sfx.tap();
    el.landlineModal.classList.add("hidden");
  });

  // ================= YENİ 4: PARA ÜSTÜ KASASI & VERESİYE DEFTERİ =================
  function openCashRegister() {
    const c = curCust();
    const pay = c.payment;
    state.selectedChange = 0;
    const targetChange = Math.max(0, pay.paidWith - pay.billCost);

    el.regPaidWith.textContent = `${pay.paidWith} ₺`;
    el.regBillCost.textContent = `${pay.billCost} ₺`;
    el.regTargetChange.textContent = `${targetChange} ₺`;
    el.regCurrentChange.textContent = "0 ₺";
    el.autoChangeBtn.style.display = persistent.upgrades.digitalRegister ? "block" : "none";
    el.writeCreditActionBtn.style.display = pay.asksCredit ? "block" : "none";
    el.registerModal.classList.remove("hidden");
  }

  document.querySelectorAll(".money-chip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.coinChange();
      state.selectedChange += Number(btn.dataset.amt);
      el.regCurrentChange.textContent = `${state.selectedChange} ₺`;
    });
  });

  el.resetChangeBtn.addEventListener("click", () => {
    sfx.tap();
    state.selectedChange = 0;
    el.regCurrentChange.textContent = "0 ₺";
  });

  el.autoChangeBtn.addEventListener("click", () => {
    const pay = curCust().payment;
    sfx.coinChange();
    state.selectedChange = Math.max(0, pay.paidWith - pay.billCost);
    el.regCurrentChange.textContent = `${state.selectedChange} ₺`;
  });

  el.confirmSaleBtn.addEventListener("click", () => {
    const pay = curCust().payment;
    const target = Math.max(0, pay.paidWith - pay.billCost);
    if (state.selectedChange !== target) {
      sfx.burnFail();
      showToast(`⚠️ Para üstü yanlış! ${target} ₺ seçmelisin (Şu an: ${state.selectedChange} ₺).`);
      return;
    }
    state.tipEarned += 15;
    el.registerModal.classList.add("hidden");
    finalizeDecision("serve");
  });

  function recordCreditAndFinish() {
    const c = curCust();
    sfx.ledgerWrite();
    persistent.ledger.unshift({
      name: c.name,
      amount: c.payment.creditAmount || c.payment.billCost,
      honest: !!c.payment.creditHonest,
      settled: false,
      resultText: "⏳ Yarın gece bekleniyor..."
    });
    saveProgress();
    el.registerModal.classList.add("hidden");
    el.ledgerModal.classList.add("hidden");
    finalizeDecision("credit");
  }

  el.writeCreditActionBtn.addEventListener("click", recordCreditAndFinish);
  el.writeCreditQuickBtn.addEventListener("click", () => {
    if (!isOrderComplete()) {
      sfx.burnFail();
      showToast("Veresiye yazmadan önce müşterinin siparişini hazırla!");
      return;
    }
    recordCreditAndFinish();
  });

  el.closeRegisterBtn.addEventListener("click", () => el.registerModal.classList.add("hidden"));

  el.openLedgerBtn.addEventListener("click", () => {
    sfx.tap();
    const c = curCust();
    el.writeCreditQuickBtn.style.display = c.payment && c.payment.asksCredit ? "block" : "none";
    el.ledgerEntriesBox.innerHTML = "";
    if (persistent.ledger.length === 0) {
      el.ledgerEntriesBox.innerHTML = `<div style="color:#94a3b8; padding:8px;">Defterde henüz kayıtlı veresiye yok.</div>`;
    } else {
      persistent.ledger.slice(0, 8).forEach((item) => {
        const d = document.createElement("div");
        d.style.cssText = "background:#1e293b; border:1.5px solid #475569; border-radius:8px; padding:7px 9px;";
        d.innerHTML = `<strong>${item.name}</strong> — ${item.amount} ₺<br/><span style="font-size:11px; color:#fde68a;">${item.resultText}</span>`;
        el.ledgerEntriesBox.appendChild(d);
      });
    }
    el.ledgerModal.classList.remove("hidden");
  });

  el.closeLedgerBtn.addEventListener("click", () => el.ledgerModal.classList.add("hidden"));

  // ================= ŞALTER, KİMLİK, BÜLTEN =================
  function triggerBlackout() {
    state.isBlackout = true;
    state.breakers = persistent.upgrades.upsBattery ? [true, true, true, false] : [false, false, false, false];
    sfx.powerOutage();
    showToast("⚡ SİGORTA ATTI! Şalter kutusunu aç!");
    renderUI();
  }

  function renderBreakers() {
    el.breakerGrid.innerHTML = "";
    state.breakers.forEach((isOn, idx) => {
      const b = document.createElement("button");
      b.className = "breaker-switch" + (isOn ? " on" : "");
      b.innerHTML = `<div>ŞALTER ${idx + 1}</div><div style="margin-top:4px;">${isOn ? "AÇIK ✓" : "KAPALI"}</div>`;
      b.addEventListener("click", () => {
        sfx.tap();
        state.breakers[idx] = true;
        renderBreakers();
        if (state.breakers.every(Boolean)) {
          state.isBlackout = false;
          sfx.powerRestore();
          showToast("💡 Elektrik geri geldi!");
          el.breakerModal.classList.add("hidden");
          renderUI();
        }
      });
      el.breakerGrid.appendChild(b);
    });
  }

  el.breakerAlertBtn.addEventListener("click", () => {
    sfx.tap();
    renderBreakers();
    el.breakerModal.classList.remove("hidden");
  });
  el.closeBreakerBtn.addEventListener("click", () => el.breakerModal.classList.add("hidden"));

  function checkPowerBeforeAction() {
    if (state.isBlackout) {
      sfx.burnFail();
      renderBreakers();
      el.breakerModal.classList.remove("hidden");
      showToast("⚡ Önce şalterleri kaldır!");
      return false;
    }
    return true;
  }

  el.askIdBtn.addEventListener("click", () => {
    sfx.idCardSlide();
    const id = curCust().idCard;
    el.idFullName.textContent = id.fullName;
    el.idBirthYear.textContent = String(id.birthYear);
    el.idValidUntil.textContent = id.validUntil;
    el.idValidUntil.style.color = id.validUntil.includes("GEÇ") ? "#dc2626" : "#0f172a";
    el.idPlateMatch.textContent = id.plateMatch;
    el.idPlateMatch.style.color = id.plateMatch.includes("UYUŞMUYOR") || id.plateMatch.includes("SAHTE") ? "#dc2626" : "#0f172a";
    el.idModal.classList.remove("hidden");
  });
  el.closeIdBtn.addEventListener("click", () => el.idModal.classList.add("hidden"));

  el.wantedBtn.addEventListener("click", () => {
    sfx.tap();
    const wp = curNight().wantedPoster;
    el.wantedTitle.textContent = wp.title;
    el.wantedDesc.textContent = wp.desc;
    el.wantedModal.classList.remove("hidden");
  });
  el.closeWantedBtn.addEventListener("click", () => el.wantedModal.classList.add("hidden"));

  // ================= POMPA, İÇECEK, TOST, MARKET, MOR IŞIK =================
  document.querySelectorAll(".fuel-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sfx.tap();
      state.selectedFuelType = btn.dataset.ftype;
      document.querySelectorAll(".fuel-type-btn").forEach((b) => {
        b.classList.toggle("selected", b.dataset.ftype === state.selectedFuelType);
      });
    });
  });

  el.btnFuel.addEventListener("click", () => {
    if (!checkPowerBeforeAction()) return;
    const req = curCust().requests;
    if (!req.fuel) return showToast("Müşteri yakıt istemedi.");
    if (state.fuelDone) return showToast("Yakıt zaten dolduruldu!");
    sfx.tap();
    state.pumpVal = 0;
    el.pumpCurrentVal.textContent = "0";
    el.pumpTargetVal.textContent = `${req.fuel} ₺ ${catalog.fuels[req.fuelType].label}`;
    el.fuelModal.classList.remove("hidden");
  });

  function startPumping(e) {
    if (e) e.preventDefault();
    if (state.pumpInterval || state.fuelDone) return;
    const req = curCust().requests;
    if (state.selectedFuelType !== req.fuelType) {
      sfx.burnFail();
      showToast(`⚠️ Yanlış tabanca! Müşteri ${catalog.fuels[req.fuelType].short} istedi!`);
      return;
    }
    state.pumpInterval = setInterval(() => {
      const near = Math.abs(req.fuel - state.pumpVal) <= 55;
      state.pumpVal += persistent.upgrades.autoPump && near ? 5 : 10;
      el.pumpCurrentVal.textContent = String(state.pumpVal);
      sfx.pumpTick(260 + Math.min(state.pumpVal, 600) * 0.55);
      if (state.pumpVal >= req.fuel + 110) stopPumping();
    }, 65);
  }

  function stopPumping() {
    if (!state.pumpInterval) return;
    clearInterval(state.pumpInterval);
    state.pumpInterval = null;
    const target = curCust().requests.fuel;
    const diff = state.pumpVal - target;
    const tol = persistent.upgrades.autoPump ? 35 : 20;
    if (state.pumpVal < target - 50) {
      showToast(`Henüz ${state.pumpVal} ₺ oldu, basılı tutmaya devam et!`);
      return;
    }
    state.fuelDone = true;
    el.fuelModal.classList.add("hidden");
    if (Math.abs(diff) <= tol) {
      sfx.perfectHit();
      state.tipEarned += 25;
      showToast(`🎯 Tam İsabet (${state.pumpVal} ₺)! +25 ₺ Bahşiş!`);
    } else if (diff > 55) {
      sfx.burnFail();
      persistent.cash = Math.max(0, persistent.cash - 30);
      showToast(`⚠️ Sayacı taşırdın! -30 ₺ zarar.`);
    } else {
      sfx.cashRegister();
      showToast(`⛽ Yakıt tamam (${state.pumpVal} ₺).`);
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

  el.btnCoffee.addEventListener("click", () => {
    if (!checkPowerBeforeAction()) return;
    const req = curCust().requests;
    if (!req.drink) return showToast("Müşteri sıcak içecek istemedi.");
    if (state.drinkDone) return showToast("İçecek zaten hazır!");
    sfx.tap();
    el.coffeeModal.classList.remove("hidden");
  });

  document.querySelectorAll(".drink-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wanted = curCust().requests.drink;
      if (btn.dataset.drink !== wanted) {
        sfx.burnFail();
        showToast(`Müşteri ${catalog.drinks[wanted].label} istedi!`);
        return;
      }
      sfx.coffeeBrew();
      state.drinkDone = true;
      if (persistent.upgrades.vipEspresso) state.tipEarned += 20;
      el.coffeeModal.classList.add("hidden");
      renderUI();
    });
  });
  el.closeCoffeeBtn.addEventListener("click", () => el.coffeeModal.classList.add("hidden"));

  el.btnToast.addEventListener("click", () => {
    if (!checkPowerBeforeAction()) return;
    const req = curCust().requests;
    if (!req.toast) return showToast("Müşteri tost istemedi.");
    if (state.toastState === "done") return showToast("Tost zaten hazır!");
    if (state.toastState === "idle") {
      sfx.tap();
      el.toastModal.classList.remove("hidden");
      return;
    }
    if (state.toastState === "cooking") {
      if (state.grillVal < 45) return showToast("Henüz çiğ, YEŞİL olunca bas!");
      if (state.grillVal <= 88) {
        clearInterval(state.grillInterval);
        state.toastState = "done";
        state.tipEarned += 15;
        sfx.toastReady();
        showToast("🥪 Çıtır tost hazır! (+15 ₺)");
        renderUI();
      }
    }
  });

  document.querySelectorAll(".toast-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wanted = curCust().requests.toast;
      if (btn.dataset.toast !== wanted) {
        sfx.burnFail();
        showToast(`Müşteri ${catalog.toasts[wanted].label} istedi!`);
        return;
      }
      el.toastModal.classList.add("hidden");
      sfx.toastStart();
      state.toastState = "cooking";
      state.grillVal = 0;
      renderUI();

      state.grillInterval = setInterval(() => {
        state.grillVal += 4;
        el.grillBarFill.style.width = `${Math.min(state.grillVal, 100)}%`;
        if (state.grillVal < 45) el.grillBarFill.style.background = "#38bdf8";
        else if (state.grillVal <= 86) {
          el.grillBarFill.style.background = "#22c55e";
          if (persistent.upgrades.smartGrill && state.grillVal >= 64) {
            clearInterval(state.grillInterval);
            state.toastState = "done";
            state.tipEarned += 20;
            sfx.toastReady();
            renderUI();
            return;
          }
        } else el.grillBarFill.style.background = "#ef4444";

        if (state.grillVal >= 100) {
          clearInterval(state.grillInterval);
          state.toastState = "idle";
          state.grillVal = 0;
          sfx.burnFail();
          showToast("🔥 Tost yandı! Tekrar pişir.");
          renderUI();
        }
      }, 95);
    });
  });
  el.closeToastBtn.addEventListener("click", () => el.toastModal.classList.add("hidden"));

  el.btnMarket.addEventListener("click", () => {
    const req = curCust().requests;
    if (!req.market) return showToast("Müşteri market ürünü istemedi.");
    if (state.marketDone) return showToast("Ürün zaten verildi!");
    sfx.tap();
    el.marketModal.classList.remove("hidden");
  });

  document.querySelectorAll(".market-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wanted = curCust().requests.market;
      if (btn.dataset.market !== wanted) {
        sfx.burnFail();
        showToast(`Müşteri ${catalog.market[wanted].label} istedi!`);
        return;
      }
      sfx.shelfGrab();
      state.marketDone = true;
      el.marketModal.classList.add("hidden");
      renderUI();
    });
  });
  el.closeMarketBtn.addEventListener("click", () => el.marketModal.classList.add("hidden"));

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
  el.closeUvBtn.addEventListener("click", () => el.uvModal.classList.add("hidden"));

  // ================= ÇİFT KAMERA =================
  function switchCameraTab(camNum) {
    const c = curCust();
    el.tabCam1.classList.toggle("active", camNum === 1);
    el.tabCam2.classList.toggle("active", camNum === 2);
    el.cam1View.style.display = camNum === 1 ? "block" : "none";
    el.cam2View.style.display = camNum === 2 ? "block" : "none";

    el.cam1SvgBox.innerHTML = window.renderCctvPumpSVG(c.car);
    el.cctvCarType.textContent = c.car.type;
    el.cctvPlate.textContent = c.car.plate;
    el.cctvNote.textContent = c.car.pumpNote;

    el.cam2SvgBox.innerHTML = window.renderCctvDepotSVG(c.depotIntruder, state.intruderScared);
    if (c.depotIntruder && !state.intruderScared) {
      el.depotNoteBox.textContent = c.depotNote;
      el.depotNoteBox.style.borderLeftColor = "#ef4444";
      el.triggerAlarmBtn.style.display = "block";
    } else if (c.depotIntruder && state.intruderScared) {
      el.depotNoteBox.textContent = "✓ Spot ışığı ve siren açıldı! Maskeli şahıs kaçtı.";
      el.depotNoteBox.style.borderLeftColor = "#4ade80";
      el.triggerAlarmBtn.style.display = "none";
    } else {
      el.depotNoteBox.textContent = c.depotNote;
      el.depotNoteBox.style.borderLeftColor = "#4ade80";
      el.triggerAlarmBtn.style.display = "none";
    }
  }

  el.cctvBtn.addEventListener("click", () => {
    if (!checkPowerBeforeAction()) return;
    sfx.cameraClick();
    const startTab = curCust().depotIntruder && !state.intruderScared && (persistent.upgrades.depotAlarm || state.dumanFed) ? 2 : 1;
    switchCameraTab(startTab);
    el.cctvModal.classList.remove("hidden");
  });
  el.tabCam1.addEventListener("click", () => switchCameraTab(1));
  el.tabCam2.addEventListener("click", () => switchCameraTab(2));
  el.triggerAlarmBtn.addEventListener("click", () => {
    sfx.alarmBlast();
    state.intruderScared = true;
    persistent.cash += 45;
    showToast("🔔 Depo hırsızı püskürtüldü! (+45 ₺ Prim)");
    switchCameraTab(2);
    renderUI();
  });
  el.closeCctvBtn.addEventListener("click", () => el.cctvModal.classList.add("hidden"));

  // ================= TELEFON + YENİ 5: FOTOĞRAF GALERİSİ =================
  function buildPinKeypad() {
    el.pinPad.innerHTML = "";
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Sil", "0", "Aç"].forEach((k) => {
      const b = document.createElement("button");
      b.className = "pin-key";
      b.textContent = k;
      b.addEventListener("click", () => onPinPress(k));
      el.pinPad.appendChild(b);
    });
  }
  buildPinKeypad();

  function updateSuspicionUI() {
    const val = Math.min(100, Math.round(state.suspicion));
    el.suspicionPct.textContent = `${val}%`;
    el.suspicionFill.style.width = `${val}%`;
    if (val >= 100) {
      stopPhoneSuspicion();
      el.phoneModal.classList.add("hidden");
      state.phoneState = "snatched";
      sfx.burnFail();
      setCustomerMood("angry");
      el.speechText.textContent = `"Hey! Sen benim telefonumu mu karıştırıyorsun?! Ver şunu geri!"`;
      showToast("😠 Müşteri şüphelendi ve telefonunu geri aldı!");
      renderUI();
    }
  }

  function startPhoneSuspicion() {
    stopPhoneSuspicion();
    state.suspicionInterval = setInterval(() => {
      state.suspicion += 2.3;
      updateSuspicionUI();
    }, 680);
  }

  function stopPhoneSuspicion() {
    if (state.suspicionInterval) {
      clearInterval(state.suspicionInterval);
      state.suspicionInterval = null;
    }
  }

  function renderPinDots() {
    el.pinDots.querySelectorAll(".pin-dot").forEach((d, i) => {
      d.classList.toggle("filled", i < state.pinInput.length);
    });
  }

  function onPinPress(k) {
    const pd = curCust().phoneData;
    if (!pd) return;
    if (k === "Sil") {
      sfx.tap();
      state.pinInput = state.pinInput.slice(0, -1);
      renderPinDots();
      return;
    }
    if (k === "Aç") return verifyPin();
    if (state.pinInput.length < 4) {
      sfx.keypadBeep(Number(k));
      state.pinInput += k;
      renderPinDots();
      if (state.pinInput.length === 4) setTimeout(verifyPin, 130);
    }
  }

  function verifyPin() {
    const pd = curCust().phoneData;
    if (state.pinInput === pd.pin) {
      sfx.pinUnlock();
      state.phoneUnlocked = true;
      unlockBadge("code_breaker");
      showToast("🔓 Şifre çözüldü! Mesajlar ve Galeri açıldı!");
      openPhoneModal();
    } else {
      sfx.burnFail();
      state.pinInput = "";
      state.suspicion += 22;
      updateSuspicionUI();
      renderPinDots();
      if (state.suspicion < 100) showToast("❌ Yanlış şifre! Şüphe arttı!");
    }
  }

  el.revealPinBtn.addEventListener("click", () => {
    const pd = curCust().phoneData;
    if (pd) {
      sfx.tap();
      el.pinHintText.textContent = `💡 Çözülen Şifre: ${pd.pin}`;
    }
  });

  function switchPhoneInnerTab(tab) {
    state.phoneTab = tab;
    el.phoneTabMsgs.classList.toggle("active", tab === "msgs");
    el.phoneTabGallery.classList.toggle("active", tab === "gallery");
    el.notifList.style.display = tab === "msgs" ? "block" : "none";
    el.galleryList.style.display = tab === "gallery" ? "block" : "none";
  }

  el.phoneTabMsgs.addEventListener("click", () => {
    sfx.tap();
    switchPhoneInnerTab("msgs");
  });
  el.phoneTabGallery.addEventListener("click", () => {
    sfx.tap();
    switchPhoneInnerTab("gallery");
  });

  function openPhoneModal() {
    const c = curCust();
    const pd = c.phoneData;
    el.phoneFrame.className = "lockscreen-phone" + (pd.wallpaperTone === "crimson" ? " crimson" : "");
    el.phoneClock.textContent = c.time;
    el.phoneOwner.textContent = `${pd.owner} • ⚡ Şarjda`;
    updateSuspicionUI();
    startPhoneSuspicion();

    if (pd.locked && !state.phoneUnlocked) {
      el.pinLockSection.style.display = "block";
      el.unlockedPhoneContent.style.display = "none";
      el.pinHintText.textContent = `🔒 ${pd.pinHint}`;
      state.pinInput = "";
      renderPinDots();
    } else {
      el.pinLockSection.style.display = "none";
      el.unlockedPhoneContent.style.display = "block";

      el.notifList.innerHTML = "";
      pd.notifications.forEach((n) => {
        const d = document.createElement("div");
        d.className = "notif-card";
        d.innerHTML = `<div class="notif-meta">${n.app}</div><div class="notif-sender">${n.sender}</div><div class="notif-body">${n.body}</div>`;
        el.notifList.appendChild(d);
      });

      const photos = pd.gallery || [];
      el.phoneTabGallery.textContent = `🖼️ Galeri (${photos.length})`;
      el.galleryList.innerHTML = photos.map((p) => window.renderPhonePhotoSVG(p)).join("");
      switchPhoneInnerTab(state.phoneTab);
    }
    el.phoneModal.classList.remove("hidden");
  }

  el.btnPhone.addEventListener("click", () => {
    if (state.phoneState === "none") return showToast("Müşteri şarja telefon bırakmadı.");
    if (state.phoneState === "snatched") return showToast("Müşteri telefonunu geri aldı!");
    if (state.phoneState === "waiting_plug") {
      sfx.tap();
      state.phoneState = "charging";
      showToast("📱 Telefon prize takıldı...");
      renderUI();
      state.phoneTimer = setTimeout(() => {
        state.phoneState = "ringing";
        sfx.phoneBuzz();
        showToast("📲 Telefona gizli bildirim düştü!");
        renderUI();
      }, 1050);
      return;
    }
    if (state.phoneState === "charging") return showToast("Telefon açılıyor, 1 saniye bekle...");
    sfx.tap();
    state.phoneState = "read";
    openPhoneModal();
    renderUI();
  });

  el.closePhoneBtn.addEventListener("click", () => {
    stopPhoneSuspicion();
    el.phoneModal.classList.add("hidden");
  });

  // ================= ROZETLER & KANIT PANOSU =================
  el.cluesBtn.addEventListener("click", () => {
    sfx.tap();
    el.badgesListContainer.innerHTML = "";
    badgesList.forEach((b) => {
      const got = !!persistent.badges[b.id];
      const div = document.createElement("div");
      div.style.cssText =
        "background:#1e293b; border:1.8px solid " +
        (got ? "#22c55e" : "#334155") +
        "; border-radius:9px; padding:7px; opacity:" +
        (got ? "1" : "0.52");
      div.innerHTML = `<div style="font-size:11.5px; font-weight:900;">${b.icon} ${b.name}</div>
                       <div style="font-size:9.8px; color:#cbd5e1; margin-top:2px;">${b.desc}</div>`;
      el.badgesListContainer.appendChild(div);
    });

    el.cluesListContainer.innerHTML = "";
    Object.keys(clueDb).forEach((k) => {
      const info = clueDb[k];
      const unlocked = !!persistent.clues[k];
      const item = document.createElement("div");
      item.style.cssText = "background:#1e293b; border:1.8px solid " + (unlocked ? "#f59e0b" : "#334155") + "; border-radius:9px; padding:8px;";
      item.innerHTML = unlocked
        ? `<div style="font-size:9.5px; color:#fde68a; font-weight:800;">📌 ${info.night}</div>
           <div style="font-size:12px; font-weight:900;">${info.title}</div>
           <div style="font-size:11px; color:#cbd5e1;">${info.detail}</div>`
        : `<div style="font-size:11px; color:#64748b; font-weight:800;">🔒 Gizli Kanıt (${info.night})</div>`;
      el.cluesListContainer.appendChild(item);
    });
    el.cluesModal.classList.remove("hidden");
  });
  el.closeCluesBtn.addEventListener("click", () => el.cluesModal.classList.add("hidden"));

  // ================= KARAR VE GECE SONU =================
  el.btnServe.addEventListener("click", () => {
    if (!checkPowerBeforeAction()) return;
    if (!isOrderComplete()) {
      sfx.tap();
      showToast("Önce fişteki tüm siparişleri hazırla!");
      return;
    }
    sfx.tap();
    openCashRegister();
  });

  el.btnHide.addEventListener("click", () => finalizeDecision("hide"));
  el.btnLock.addEventListener("click", () => finalizeDecision("lock"));
  el.btnPolice.addEventListener("click", () => finalizeDecision("police"));

  function finalizeDecision(choice) {
    const c = curCust();

    clearTimeout(state.phoneTimer);
    clearTimeout(state.outageTimer);
    clearTimeout(state.landlineTimer);
    clearInterval(state.grillInterval);
    clearInterval(state.pumpInterval);
    stopPhoneSuspicion();
    state.isBlackout = false;
    state.landlineActive = false;

    const res = c.outcomes[choice] || c.outcomes.lock;
    let extraNote = "";

    if (c.depotIntruder && !state.intruderScared && choice !== "police") {
      const loss = state.dumanFed ? 40 : 90;
      persistent.cash = Math.max(0, persistent.cash - loss);
      extraNote = state.dumanFed
        ? ` ⚠️ (Arka depoya sızan hırsızı Duman kovaladı, zarar azaldı: -${loss} ₺)`
        : ` ⚠️ (Arka depo kamerasına bakmadığın için -${loss} ₺ malzeme çalındı!)`;
    }

    if (choice === "serve") {
      sfx.cashRegister();
      if (res.correct) persistent.cash += c.reward + state.tipEarned;
      else persistent.cash = Math.max(0, persistent.cash - (res.penalty || 0));
    } else if (choice === "credit") {
      // Veresiye ertesi gece tahsil edilecek
    } else if (choice === "hide") {
      sfx.safeRoom();
      if (res.bonus) persistent.cash += res.bonus;
      if (res.penalty) persistent.cash = Math.max(0, persistent.cash - res.penalty);
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
    if (res.badgeUnlock) unlockBadge(res.badgeUnlock);
    saveProgress();
    renderUI();

    el.outcomeBadge.textContent = res.badge;
    el.outcomeBadge.className = "stamp-badge " + (res.correct ? "stamp-good" : "stamp-bad");
    el.outcomeTitle.textContent = res.title;
    el.outcomeDesc.textContent = res.desc + extraNote;

    const isLast = state.custIdx >= curNight().customers.length - 1;
    el.nextCustomerBtn.textContent = isLast
      ? "☀️ SABAH GAZETESİ VE DÜKKÂN ➔"
      : `SIRADAKİ MÜŞTERİ (${state.custIdx + 2}/5) ➔`;

    el.outcomeModal.classList.remove("hidden");
  }

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
          <div style="font-size:11.5px; font-weight:900;">${item.name}</div>
          <div style="font-size:10px; color:#cbd5e1; line-height:1.25;">${item.desc}</div>
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
    const n = curNight();
    if (n.nightNumber === 1 && !n.isEndless) unlockBadge("first_night");

    if (n.isEndless) {
      el.paperHeadline.textContent = `SONSUZ VARDİYA #${n.nightNumber} BİTTİ (${state.correctInNight}/5 DOĞRU)!`;
      el.paperSummary.textContent =
        "Sabaha sağ salim çıktın! Yazdığın veresiyeler yeni vardiyanın başında sonuçlanacak.";
      el.nextNightBtn.textContent = `♾️ YENİ RASTGELE VARDİYAYA GEÇ (#${n.nightNumber + 1}) ➔`;
    } else if (state.nightIdx < storyNights.length - 1) {
      el.paperHeadline.textContent = `${n.nightNumber}. GECE TAMAMLANDI (${state.correctInNight}/5 DOĞRU)!`;
      el.paperSummary.textContent = `Vardiyayı tamamladın! ${n.nightNumber + 1}. Gecede bambaşka 5 yeni müşteri ve önceki veresiyelerin dönüşü seni bekliyor.`;
      el.nextNightBtn.textContent = `🌙 ${n.nightNumber + 1}. GECEYE GEÇ (5 YENİ MÜŞTERİ) ➔`;
    } else {
      unlockBadge("story_master");
      el.paperHeadline.textContent = `5 GECE / 25 MÜŞTERİ TAMAMLANDI! SON İSTASYON EFSANESİ!`;
      el.paperSummary.textContent =
        "Ana hikayeyi bitirdin! Şimdi tüm v4.0 özellikleriyle 'Sonsuz Rastgele Vardiya' moduna geçebilirsin!";
      el.nextNightBtn.textContent = "♾️ SONSUZ RASTGELE VARDİYAYA BAŞLA ➔";
    }

    renderShop();
    el.nightEndModal.classList.remove("hidden");
  }

  el.nextNightBtn.addEventListener("click", () => {
    sfx.tap();
    el.nightEndModal.classList.add("hidden");
    state.dumanFed = false;

    if (state.mode === "endless") {
      persistent.endlessShift += 1;
      saveProgress();
      state.activeNightObj = window.generateEndlessNight(persistent.endlessShift);
    } else if (state.nightIdx < storyNights.length - 1) {
      state.nightIdx += 1;
      state.activeNightObj = storyNights[state.nightIdx];
    } else {
      state.mode = "endless";
      state.activeNightObj = window.generateEndlessNight(persistent.endlessShift);
    }
    state.correctInNight = 0;
    settlePreviousLedger();
    loadCustomer(0);
  });

  el.muteBtn.addEventListener("click", () => {
    const m = sfx.toggleMute();
    el.muteBtn.textContent = m ? "🔇" : "🔊";
  });

  el.startShiftBtn.addEventListener("click", () => {
    sfx.startRainAmbience();
    sfx.tap();
    state.dumanFed = false;
    if (state.mode === "endless") {
      state.activeNightObj = window.generateEndlessNight(persistent.endlessShift);
    } else {
      state.activeNightObj = storyNights[state.nightIdx];
    }
    state.correctInNight = 0;
    el.startScreen.classList.add("hidden");
    settlePreviousLedger();
    loadCustomer(0);
  });
})();

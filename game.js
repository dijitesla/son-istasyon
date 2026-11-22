// Son İstasyon — Ana Oyun Döngüsü (1. Gece: Kayıp Vardiya)

(function () {
  const story = window.GAME_STORY;
  const sfx = window.sfx;

  const ITEM_META = {
    coffee: { label: "☕ Kahve", btnId: "btnCoffee", subId: "subCoffee", defaultSub: "Hazırla" },
    toast: { label: "🥪 Tost", btnId: "btnToast", subId: "subToast", defaultSub: "Hazırla" },
    water: { label: "💧 Su", btnId: "btnWater", subId: "subWater", defaultSub: "Dolaptan Al" }
  };

  let state = {
    idx: 0,
    cash: 200,
    correctCount: 0,
    prepared: {},
    phoneState: "none", // none | waiting_plug | charging | ringing | read
    phoneTimer: null,
    cctvChecked: false,
    savedMelis: false,
    stoppedBora: false,
    caught404: false
  };

  // DOM Referansları
  const el = {
    startScreen: document.getElementById("startScreen"),
    bossNoteText: document.getElementById("bossNoteText"),
    startShiftBtn: document.getElementById("startShiftBtn"),
    toastBanner: document.getElementById("toastBanner"),
    clockText: document.getElementById("clockText"),
    customerCounter: document.getElementById("customerCounter"),
    cashText: document.getElementById("cashText"),
    muteBtn: document.getElementById("muteBtn"),
    radioText: document.getElementById("radioText"),
    cctvBtn: document.getElementById("cctvBtn"),
    pumpCarWrap: document.getElementById("pumpCarWrap"),
    carMini: document.getElementById("carMini"),
    avatarHolder: document.getElementById("avatarHolder"),
    speakerName: document.getElementById("speakerName"),
    speakerRole: document.getElementById("speakerRole"),
    speechText: document.getElementById("speechText"),
    questionRow: document.getElementById("questionRow"),
    ticketBadges: document.getElementById("ticketBadges"),
    btnCoffee: document.getElementById("btnCoffee"),
    btnToast: document.getElementById("btnToast"),
    btnWater: document.getElementById("btnWater"),
    btnPhone: document.getElementById("btnPhone"),
    phoneBadge: document.getElementById("phoneBadge"),
    phoneEmoji: document.getElementById("phoneEmoji"),
    subPhone: document.getElementById("subPhone"),
    btnServe: document.getElementById("btnServe"),
    serveSubText: document.getElementById("serveSubText"),
    btnLock: document.getElementById("btnLock"),
    btnPolice: document.getElementById("btnPolice"),
    cctvModal: document.getElementById("cctvModal"),
    cctvTime: document.getElementById("cctvTime"),
    cctvCarType: document.getElementById("cctvCarType"),
    cctvPlate: document.getElementById("cctvPlate"),
    cctvNote: document.getElementById("cctvNote"),
    closeCctvBtn: document.getElementById("closeCctvBtn"),
    phoneModal: document.getElementById("phoneModal"),
    phoneFrame: document.getElementById("phoneFrame"),
    phoneClock: document.getElementById("phoneClock"),
    phoneOwner: document.getElementById("phoneOwner"),
    notifList: document.getElementById("notifList"),
    closePhoneBtn: document.getElementById("closePhoneBtn"),
    outcomeModal: document.getElementById("outcomeModal"),
    outcomeBadge: document.getElementById("outcomeBadge"),
    outcomeTitle: document.getElementById("outcomeTitle"),
    outcomeDesc: document.getElementById("outcomeDesc"),
    nextCustomerBtn: document.getElementById("nextCustomerBtn"),
    endingModal: document.getElementById("endingModal"),
    paperHeadline: document.getElementById("paperHeadline"),
    paperSummary: document.getElementById("paperSummary"),
    finalCash: document.getElementById("finalCash"),
    finalScore: document.getElementById("finalScore"),
    replayBtn: document.getElementById("replayBtn")
  };

  // Başlangıç metni
  el.bossNoteText.textContent = story.bossNote.text;

  // Yağmur Efekti (Canvas)
  const canvas = document.getElementById("rainCanvas");
  const ctx = canvas.getContext("2d");
  let drops = [];

  function resizeRain() {
    canvas.width = canvas.clientWidth || 400;
    canvas.height = canvas.clientHeight || 260;
    drops = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 10 + Math.random() * 14,
      speed: 4.5 + Math.random() * 4
    }));
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(148, 197, 255, 0.28)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const d of drops) {
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2.5, d.y + d.len);
      d.y += d.speed;
      d.x -= 0.6;
      if (d.y > canvas.height) {
        d.y = -15;
        d.x = Math.random() * (canvas.width + 30);
      }
    }
    ctx.stroke();
    requestAnimationFrame(drawRain);
  }

  window.addEventListener("resize", resizeRain);
  resizeRain();
  drawRain();

  // Kısa Uyarı Göster
  let toastTimeout = null;
  function showToast(msg) {
    el.toastBanner.textContent = msg;
    el.toastBanner.classList.remove("hidden");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      el.toastBanner.classList.add("hidden");
    }, 2100);
  }

  function currentCustomer() {
    return story.customers[state.idx];
  }

  function isOrderComplete() {
    const c = currentCustomer();
    const itemsOk = c.orders.every((item) => state.prepared[item]);
    const chargerOk = !c.wantsCharger || state.phoneState !== "waiting_plug";
    return itemsOk && chargerOk;
  }

  function renderTicketAndButtons() {
    const c = currentCustomer();
    el.ticketBadges.innerHTML = "";

    c.orders.forEach((item) => {
      const span = document.createElement("span");
      const done = !!state.prepared[item];
      span.className = "req-chip" + (done ? " done" : "");
      span.textContent = ITEM_META[item].label + (done ? " ✓" : "");
      el.ticketBadges.appendChild(span);
    });

    if (c.wantsCharger) {
      const pSpan = document.createElement("span");
      const plugged = state.phoneState !== "waiting_plug";
      pSpan.className = "req-chip" + (plugged ? " done" : "");
      pSpan.textContent = plugged ? "🔌 Şarja Takıldı ✓" : "🔌 Şarja Tak";
      el.ticketBadges.appendChild(pSpan);
    }

    // Büfe kartlarını güncelle
    Object.keys(ITEM_META).forEach((key) => {
      const meta = ITEM_META[key];
      const btn = document.getElementById(meta.btnId);
      const sub = document.getElementById(meta.subId);
      const needed = c.orders.includes(key);
      const done = !!state.prepared[key];

      btn.classList.remove("needed", "prepared");
      if (done) {
        btn.classList.add("prepared");
        sub.textContent = "Hazır ✓";
      } else if (needed) {
        btn.classList.add("needed");
        sub.textContent = "İstendi!";
      } else {
        sub.textContent = meta.defaultSub;
      }
    });

    // Şarj Prizi Kartı
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
      el.subPhone.textContent = "Şarj Oluyor...";
    } else if (state.phoneState === "ringing") {
      el.btnPhone.classList.add("phone-ringing");
      el.phoneEmoji.textContent = "📲";
      el.subPhone.textContent = "Mesaj Geldi!";
      el.phoneBadge.textContent = String(c.phoneData.notifications.length);
      el.phoneBadge.style.display = "inline-block";
    } else if (state.phoneState === "read") {
      el.btnPhone.classList.add("prepared");
      el.phoneEmoji.textContent = "📱";
      el.subPhone.textContent = "Tekrar Bak";
    }

    // Satışı Tamamla butonu durumu
    if (isOrderComplete()) {
      el.btnServe.classList.remove("locked-serve");
      el.serveSubText.textContent = `+${c.reward} ₺ Tahsil Et`;
    } else {
      el.btnServe.classList.add("locked-serve");
      el.serveSubText.textContent = "Önce İsteği Hazırla";
    }
  }

  function loadCustomer(index) {
    clearTimeout(state.phoneTimer);
    state.idx = index;
    state.prepared = {};
    state.cctvChecked = false;

    const c = currentCustomer();
    state.phoneState = c.wantsCharger ? "waiting_plug" : "none";

    // HUD & Radyo
    el.clockText.textContent = c.time;
    el.customerCounter.textContent = `Müşteri ${index + 1}/${story.customers.length}`;
    el.cashText.textContent = state.cash;
    el.radioText.textContent = c.radioTicker;

    // Kamera uyarısı
    el.cctvBtn.classList.add("alert-pulse");

    // Araba animasyonu
    el.pumpCarWrap.classList.add("offscreen");
    el.avatarHolder.classList.add("entering");

    setTimeout(() => {
      el.carMini.style.background = c.car.color;
      el.pumpCarWrap.classList.remove("offscreen");
      el.avatarHolder.innerHTML = c.avatarSvg;
      el.avatarHolder.classList.remove("entering");
      sfx.doorBell();
    }, 180);

    // Konuşma
    el.speakerName.textContent = c.name;
    el.speakerRole.textContent = c.role;
    el.speechText.textContent = `"${c.greeting}"`;

    // Diyalog soruları
    el.questionRow.innerHTML = "";
    c.questions.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "q-btn";
      btn.textContent = `💬 ${q.btn}`;
      btn.addEventListener("click", () => {
        sfx.tap();
        btn.classList.add("asked");
        el.speechText.textContent = `"${q.reply}"`;
      });
      el.questionRow.appendChild(btn);
    });

    renderTicketAndButtons();
  }

  // Büfe Ürün Hazırlama
  ["coffee", "toast", "water"].forEach((itemKey) => {
    const btn = document.getElementById(ITEM_META[itemKey].btnId);
    btn.addEventListener("click", () => {
      const c = currentCustomer();
      if (!c.orders.includes(itemKey)) {
        sfx.tap();
        showToast("Müşteri bunu istemedi!");
        return;
      }
      if (state.prepared[itemKey]) {
        showToast("Zaten hazırlandı!");
        return;
      }
      state.prepared[itemKey] = true;
      if (itemKey === "coffee") sfx.coffeeBrew();
      if (itemKey === "toast") sfx.toastReady();
      if (itemKey === "water") sfx.waterGrab();
      renderTicketAndButtons();
    });
  });

  // Şarj Prizi / Gizli Telefon Etkileşimi
  el.btnPhone.addEventListener("click", () => {
    const c = currentCustomer();
    if (state.phoneState === "none") {
      sfx.tap();
      showToast("Bu müşteri şarja telefon bırakmadı.");
      return;
    }
    if (state.phoneState === "waiting_plug") {
      sfx.tap();
      state.phoneState = "charging";
      showToast("Telefon şarja takıldı...");
      renderTicketAndButtons();

      // 1.3 saniye sonra telefona gizli bildirim düşer!
      state.phoneTimer = setTimeout(() => {
        state.phoneState = "ringing";
        sfx.phoneBuzz();
        showToast("📲 Şarjdaki telefona mesaj düştü!");
        renderTicketAndButtons();
      }, 1300);
      return;
    }
    if (state.phoneState === "charging") {
      showToast("Telefon yeni açılıyor, 1 saniye bekle...");
      return;
    }
    if (state.phoneState === "ringing" || state.phoneState === "read") {
      sfx.tap();
      state.phoneState = "read";
      openPhoneModal(c);
      renderTicketAndButtons();
    }
  });

  function openPhoneModal(c) {
    const pd = c.phoneData;
    el.phoneFrame.className = "lockscreen-phone" + (pd.wallpaperTone === "crimson" ? " crimson" : "");
    el.phoneClock.textContent = c.time;
    el.phoneOwner.textContent = `${pd.owner} • ${pd.battery}`;
    el.notifList.innerHTML = "";

    pd.notifications.forEach((n) => {
      const div = document.createElement("div");
      div.className = "notif-card";
      div.innerHTML = `
        <div class="notif-meta">${n.app}</div>
        <div class="notif-sender">${n.sender}</div>
        <div class="notif-body">${n.body}</div>
      `;
      el.notifList.appendChild(div);
    });

    el.phoneModal.classList.remove("hidden");
  }

  el.closePhoneBtn.addEventListener("click", () => {
    sfx.tap();
    el.phoneModal.classList.add("hidden");
  });

  // Güvenlik Kamerası (Pompa 4)
  el.cctvBtn.addEventListener("click", () => {
    const c = currentCustomer();
    sfx.cameraClick();
    state.cctvChecked = true;
    el.cctvBtn.classList.remove("alert-pulse");
    el.cctvTime.textContent = c.time;
    el.cctvCarType.textContent = c.car.type;
    el.cctvPlate.textContent = c.car.plate;
    el.cctvNote.textContent = c.car.pumpNote;
    el.cctvModal.classList.remove("hidden");
  });

  el.closeCctvBtn.addEventListener("click", () => {
    sfx.tap();
    el.cctvModal.classList.add("hidden");
  });

  // Karar İşleme
  function handleDecision(choice) {
    const c = currentCustomer();

    if (choice === "serve" && !isOrderComplete()) {
      sfx.tap();
      showToast("Satışı tamamlamak için önce müşterinin isteğini hazırla!");
      return;
    }

    clearTimeout(state.phoneTimer);
    const result = c.outcomes[choice];

    if (choice === "serve") {
      sfx.cashRegister();
      if (result.correct) {
        state.cash += c.reward;
      } else {
        state.cash = Math.max(0, state.cash - (result.penalty || 0));
      }
    } else if (choice === "lock") {
      sfx.lockDoor();
      if (result.bonus) state.cash += result.bonus;
      if (result.penalty) state.cash = Math.max(0, state.cash - result.penalty);
    } else if (choice === "police") {
      sfx.policeSiren();
      if (result.bonus) state.cash += result.bonus;
      if (result.penalty) state.cash = Math.max(0, state.cash - result.penalty);
    }

    if (result.correct) state.correctCount += 1;
    if (c.id === "melis" && choice === "serve") state.savedMelis = true;
    if (c.id === "bora" && (choice === "lock" || choice === "police")) state.stoppedBora = true;
    if (c.id === "yabanci" && choice === "police") state.caught404 = true;

    el.cashText.textContent = state.cash;

    el.outcomeBadge.textContent = result.badge;
    el.outcomeBadge.className = "stamp-badge " + (result.correct ? "stamp-good" : "stamp-bad");
    el.outcomeTitle.textContent = result.title;
    el.outcomeDesc.textContent = result.desc;
    el.nextCustomerBtn.textContent =
      state.idx < story.customers.length - 1
        ? "SIRADAKİ MÜŞTERİYİ BEKLE ➔"
        : "☀️ SABAH 06:00 GAZETESİNİ GÖR";

    el.outcomeModal.classList.remove("hidden");
  }

  el.btnServe.addEventListener("click", () => handleDecision("serve"));
  el.btnLock.addEventListener("click", () => handleDecision("lock"));
  el.btnPolice.addEventListener("click", () => handleDecision("police"));

  el.nextCustomerBtn.addEventListener("click", () => {
    sfx.tap();
    el.outcomeModal.classList.add("hidden");
    if (state.idx < story.customers.length - 1) {
      loadCustomer(state.idx + 1);
    } else {
      showMorningEnding();
    }
  });

  function showMorningEnding() {
    let headline = "";
    let summary = "";

    if (state.caught404 && state.stoppedBora) {
      headline = "SON İSTASYON'DA KAHRAMAN KASIYER! 404 PLAKALI ŞÜPHELİ YAKALANDI!";
      summary =
        "Gece vardiyasına yeni başlayan kasiyerin dikkati sayesinde hem kayıp Emre olayının baş şüphelisi Pompa 4'te kıskıvrak yakalandı hem de genç bir yolcu takipçisinden kurtarıldı.";
    } else if (state.caught404) {
      headline = "POMPA 4'TE GECE OPERASYONU: ARANAN LACİVERT SEDAN ELE GEÇİRİLDİ!";
      summary =
        "Yeni kasiyerin 112 ihbarıyla yakalanan aracın bagajından kayıp çalışan Emre'nin yaka kartı çıktı. Ancak gece yaşanan diğer olaylar kasabada tedirginlik yarattı.";
    } else {
      headline = "404 PLAKALI ARAÇ GECE KARANLIĞINDA İZİNİ KAYBETTİRDİ!";
      summary =
        "Son İstasyon güvenlik kameralarına takılan şüpheli araç sabaha karşı kasabadan çıkış yaptı. Kayıp kasiyer Emre'nin akıbeti hâlâ gizemini koruyor.";
    }

    el.paperHeadline.textContent = headline;
    el.paperSummary.textContent = summary;
    el.finalCash.textContent = state.cash;
    el.finalScore.textContent = `${state.correctCount}/${story.customers.length}`;
    el.endingModal.classList.remove("hidden");
  }

  // Ses Aç/Kapat
  el.muteBtn.addEventListener("click", () => {
    const muted = sfx.toggleMute();
    el.muteBtn.textContent = muted ? "🔇" : "🔊";
  });

  // Oyunu Başlat & Tekrar Oyna
  el.startShiftBtn.addEventListener("click", () => {
    sfx.startRainAmbience();
    sfx.tap();
    el.startScreen.classList.add("hidden");
    loadCustomer(0);
  });

  el.replayBtn.addEventListener("click", () => {
    sfx.tap();
    el.endingModal.classList.add("hidden");
    state.cash = 200;
    state.correctCount = 0;
    state.savedMelis = false;
    state.stoppedBora = false;
    state.caught404 = false;
    loadCustomer(0);
  });
})();

// Son İstasyon v24.0 — Tam Ekran Şehir Planı, Köşe Mini Radar ve 4 Dev Yeni Bölge / Sistem:
// 1) 🏡 3D Patron Malikanesi & Özel Garaj Tepesi (Kuzey Manzaralı Tepe: Villa, Arabalar, Helikopter & VIP Davet)
// 2) ⚽ Stadyumda Kendi Futbol Kulübün (Yıldız Transferler, Canlı 90dk Maç Simülasyonu & Bilet/Yayın Geliri)
// 3) 🚕 Şehir İçi Taksi & Dolmuş Hattı (10 Arazi + Liman + Malikane Arası Gezen Canlı Sarı Taksi & Dolmuşlar)
// 4) ⚓ Uluslararası Liman, Marina & İhracat Gemisi (Güney Deniz Kıyısı: 3D Kargo Gemisi, Vinçler, Lüks Yat & İhracat)

window.CityV24 = (function () {
  // Şehir Bölgeleri Dünya Koordinatları (Mini Radar + Kamera Uçuşu İçin)
  const CITY_ZONES = [
    { id: "land15",  ox: -96,  oz: -104, w: 42, d: 34, label: "15",          row: "north" },
    { id: "mansion", ox: 0,    oz: -104, w: 68, d: 34, label: "🏡 Malikane", row: "north" },
    { id: "land16",  ox: 96,   oz: -104, w: 42, d: 34, label: "16",          row: "north" },
    { id: "taxi_hq", ox: -140, oz: -69,  w: 16, d: 16, label: "🚕 Taksi",    row: "mid" },
    { id: "land12",  ox: -168, oz: -36,  w: 44, d: 52, label: "12",          row: "upper" },
    { id: "station", ox: -112, oz: -36,  w: 44, d: 52, label: "1",           row: "upper" },
    { id: "land2",   ox: -56,  oz: -36,  w: 44, d: 52, label: "2",           row: "upper" },
    { id: "land3",   ox: 0,    oz: -36,  w: 44, d: 52, label: "3",           row: "upper" },
    { id: "land4",   ox: 56,   oz: -36,  w: 44, d: 52, label: "4",           row: "upper" },
    { id: "land5",   ox: 112,  oz: -36,  w: 44, d: 52, label: "5",           row: "upper" },
    { id: "land11",  ox: 168,  oz: -36,  w: 44, d: 52, label: "11",          row: "upper" },
    { id: "land13",  ox: -168, oz: 36,   w: 44, d: 52, label: "13",          row: "lower" },
    { id: "land6",   ox: -112, oz: 36,   w: 44, d: 52, label: "6",           row: "lower" },
    { id: "land7",   ox: -56,  oz: 36,   w: 44, d: 52, label: "7",           row: "lower" },
    { id: "land8",   ox: 0,    oz: 36,   w: 44, d: 52, label: "8",           row: "lower" },
    { id: "land9",   ox: 56,   oz: 36,   w: 44, d: 52, label: "9",           row: "lower" },
    { id: "land10",  ox: 112,  oz: 36,   w: 44, d: 52, label: "10",          row: "lower" },
    { id: "land14",  ox: 168,  oz: 36,   w: 44, d: 52, label: "14",          row: "lower" },
    { id: "port",    ox: 0,    oz: 98,   w: 96, d: 34, label: "⚓ Liman",    row: "south" }
  ];

  const MANSION_UPGRADES = [
    { key: "infinityPool", name: "🏊 Sonsuzluk Havuzu & Palmiye Terası", cost: 18000, dailyBonus: 450, desc: "Malikanenin önüne ışıklı sonsuzluk havuzu ve palmiyeler kurar (+450 ₺/gün prestij geliri)." },
    { key: "securityTeam", name: "🕶️ Özel Malikane Koruma Ekibi", cost: 14000, dailyBonus: 200, secBonus: 10, desc: "24 saat VIP koruma kalkanı (+10 Güvenlik ve +200 ₺/gün)." },
    { key: "vipGuesthouse", name: "🏛️ VIP Misafir Köşkü & Şarap Mahzeni", cost: 32000, dailyBonus: 950, desc: "Yabancı yatırımcıları ağırlayan özel köşk (+950 ₺/gün şahsi gelir)." }
  ];

  const CLUB_TRANSFERS = [
    { key: "keeper",     name: "🧤 Milli Kaleci (Uğurcan)",   cost: 16000, power: 10, wage: 40, desc: "Kalede devleşir, yenilgi ihtimalini büyük oranda düşürür (+10 Güç)." },
    { key: "midfielder", name: "🧠 Brezilyalı 10 Numara",      cost: 28000, power: 14, wage: 55, desc: "Orta sahada pas trafiğini yönetir, gol şansını artırır (+14 Güç)." },
    { key: "striker",    name: "⚡ Dünya Yıldızı Golcü",       cost: 46000, power: 20, wage: 80, desc: "Tribünleri ayağa kaldıran süper forvet! Bilet gelirini +%35 artırır (+20 Güç)." },
    { key: "coach",      name: "👔 Efsane Teknik Direktör",    cost: 34000, power: 15, wage: 65, desc: "Taktik dehası: Şampiyonluk primlerini ve galibiyet şansını uçurur (+15 Güç)." }
  ];

  const RIVAL_CLUBS = [
    { name: "Kuzeyspor FK", power: 56 },
    { name: "Anadolu Gücü", power: 68 },
    { name: "Yıldızşehir SK", power: 78 },
    { name: "Altın Vadi FK", power: 86 },
    { name: "Marmara United", power: 95 }
  ];

  const EXPORT_CARGOS = [
    {
      key: "agri_export",
      emoji: "🌾",
      name: "Organik Gıda & Tarım İhracatı",
      basePay: 4200,
      bonusDesc: "4.–10. Arazide Organik Çiftliğin varsa +%50 ekstra kazanç!",
      checkBonus: (data) => hasExtraProject(data, "agrifarm"),
      bonusMult: 1.50
    },
    {
      key: "fuel_export",
      emoji: "🛢️",
      name: "Rafineri Akaryakıt İhracatı",
      basePay: 4800,
      bonusDesc: "3. Arazide Rafinerin varsa +%45 ekstra kazanç!",
      checkBonus: (data) => !!(data.empire && data.empire.land3 && data.empire.land3.refineryUnlocked),
      bonusMult: 1.45
    },
    {
      key: "auto_export",
      emoji: "🚗",
      name: "Yerli Otomobil & Sanayi İhracatı",
      basePay: 8200,
      bonusDesc: "4.–10. Arazide Oto Fabrikan varsa +%55 ekstra kazanç!",
      checkBonus: (data) => hasExtraProject(data, "autofactory"),
      bonusMult: 1.55
    },
    {
      key: "tech_export",
      emoji: "💻",
      name: "Yüksek Teknoloji & Sunucu İhracatı",
      basePay: 12500,
      bonusDesc: "4.–10. Arazide Teknokentin varsa +%60 ekstra kazanç!",
      checkBonus: (data) => hasExtraProject(data, "techpark"),
      bonusMult: 1.60
    }
  ];

  const CLUB_FOUND_COST = 28000;
  const TAXI_UNLOCK_COST = 8500;
  const PORT_UNLOCK_COST = 42000;
  const RORO_COST = 36000;
  const PORT_MANAGER_COST = 29000;

  // Canlı 60 FPS Değişkenler
  let currentDistrictTab = "mansion"; // "mansion" | "club" | "taxi" | "port"
  let radarCollapsed = false;
  let radarBound = false;

  // 1) Canlı Şehir Taksi & Dolmuş Araçları (3D Bulvarda Gezer!)
  const liveTaxis = [];
  let taxiFareTimer = 0;

  // 2) Canlı 3D İhracat Kargo Gemisi (Güney Denizinde Yüzer!)
  let cargoShip = null;
  // { wx, wz, phase: 'arriving'|'loading'|'departing', timer, cargoDef, payout }
  let autoShipCooldown = 6.0;
  const v24Floats = [];

  // 3) Canlı 90 Dakika Futbol Maçı Durumu
  let liveMatch = null;
  // { minute, myScore, oppScore, oppName, logText, stadiumLandId, tickAcc }
  let matchCooldown = 0;
  let partyCooldown = 0;

  function hasExtraProject(data, projKey) {
    const ext = data.empire && data.empire.extraLands;
    if (!ext) return false;
    return Object.values(ext).some((st) => st && st.owned && st.projectKey === projKey);
  }

  function findStadiumLandId(data) {
    const ext = data.empire && data.empire.extraLands;
    if (!ext) return null;
    for (const lid of Object.keys(ext)) {
      if (ext[lid] && ext[lid].owned && ext[lid].projectKey === "stadium") return lid;
    }
    return null;
  }

  function createDefaultV24() {
    return {
      mansion: {
        infinityPool: false,
        securityTeam: false,
        vipGuesthouse: false
      },
      club: {
        founded: false,
        transfers: { keeper: false, midfielder: false, striker: false, coach: false },
        wins: 0,
        draws: 0,
        losses: 0
      },
      taxi: {
        unlocked: false,
        fleetCount: 0, // 0..8
        dispatchLvl: 1 // 1..5
      },
      port: {
        unlocked: false,
        craneLvl: 1, // 1..5
        roroUnlocked: false,
        portManager: false,
        shipmentsDone: 0
      }
    };
  }

  function mergeV24(saved) {
    const def = createDefaultV24();
    if (!saved) return def;
    return {
      mansion: Object.assign({}, def.mansion, saved.mansion || {}),
      club: {
        founded: !!(saved.club && saved.club.founded),
        transfers: Object.assign({}, def.club.transfers, (saved.club && saved.club.transfers) || {}),
        wins: (saved.club && saved.club.wins) || 0,
        draws: (saved.club && saved.club.draws) || 0,
        losses: (saved.club && saved.club.losses) || 0
      },
      taxi: Object.assign({}, def.taxi, saved.taxi || {}),
      port: Object.assign({}, def.port, saved.port || {})
    };
  }

  function ensureV24(data) {
    if (!data.empire) return createDefaultV24();
    if (!data.empire.v24) data.empire.v24 = createDefaultV24();
    return data.empire.v24;
  }

  function calcMansionDailyBonus(v24) {
    if (!v24 || !v24.mansion) return 0;
    let sum = 0;
    MANSION_UPGRADES.forEach((u) => {
      if (v24.mansion[u.key]) sum += u.dailyBonus || 0;
    });
    return sum;
  }

  function calcClubPower(v24, data) {
    let p = 52;
    if (!v24 || !v24.club) return p;
    CLUB_TRANSFERS.forEach((t) => {
      if (v24.club.transfers && v24.club.transfers[t.key]) p += t.power;
    });
    const stLid = findStadiumLandId(data);
    if (stLid && data.empire && data.empire.extraLands && data.empire.extraLands[stLid]) {
      p += (data.empire.extraLands[stLid].floorsLvl || 1) * 3;
    }
    return Math.min(99, p);
  }

  function getTaxiVehicleCost(count) {
    return Math.round(4200 * Math.pow(1.38, count));
  }

  function getTaxiCycleIncome(v24, data) {
    if (!v24 || !v24.taxi || !v24.taxi.unlocked || v24.taxi.fleetCount <= 0) return 0;
    const perVeh = 85 + (v24.taxi.dispatchLvl - 1) * 32;
    const synAuto = data && window.MetropolisV28 && window.MetropolisV28.calcSupplyChainSynergies(data).hasAuto ? 1.35 : 1.0;
    return Math.round(v24.taxi.fleetCount * perVeh * synAuto);
  }

  function calcExportPayout(cargoDef, data) {
    const v24 = ensureV24(data);
    const craneMult = 1 + ((v24.port.craneLvl || 1) - 1) * 0.28;
    const roroMult = v24.port.roroUnlocked ? 1.35 : 1.0;
    const synMult = cargoDef.checkBonus(data) ? cargoDef.bonusMult : 1.0;
    const pChief = data && data.empire && data.empire.v28 && data.empire.v28.directors && data.empire.v28.directors.portChief
      ? 1 + (data.empire.v28.directors.portChief.lvl || 0) * 0.1
      : 1.0;
    return Math.round(cargoDef.basePay * craneMult * roroMult * synMult * pChief);
  }

  // =========================================================================
  // 🚕 3D ŞEHİR TAKSİ & DOLMUŞ FİLOSU HAREKET MOTORU
  // =========================================================================
  function pickRandomTaxiWaypoint(curWx, curWz) {
    const roadZChoices = [-61.2, 10.8, 73.5];
    const aveXChoices = [-140, -84, -28, 28, 84, 140];
    // Kavşak mantığıyla doğal şehir içi rota üret
    const targetAve = aveXChoices[Math.floor(Math.random() * aveXChoices.length)];
    const targetRoadZ = roadZChoices[Math.floor(Math.random() * roadZChoices.length)];
    const finalX = -125 + Math.random() * 250;
    return [
      { wx: targetAve, wz: curWz },
      { wx: targetAve, wz: targetRoadZ },
      { wx: finalX, wz: targetRoadZ }
    ];
  }

  function syncTaxiEntities(targetCount) {
    while (liveTaxis.length < targetCount) {
      const idx = liveTaxis.length;
      const isDolmus = idx % 3 === 2; // Her 3 araçtan 1'i Şehir Dolmuşu/Minibüs!
      const startZ = idx % 2 === 0 ? -61.2 : 10.8;
      const startX = -135 + idx * 32;
      liveTaxis.push({
        wx: startX,
        wz: startZ,
        angle: Math.PI / 2,
        isDolmus,
        color: isDolmus ? "#e0f2fe" : "#facc15",
        shape: isDolmus ? "bus" : "sedan",
        waypoints: pickRandomTaxiWaypoint(startX, startZ)
      });
    }
    if (liveTaxis.length > targetCount) {
      liveTaxis.length = targetCount;
    }
  }

  // =========================================================================
  // ⚓ 3D İHRACAT GEMİSİ SEFER BAŞLATMA
  // =========================================================================
  function startExportVoyage(cargoKey, data, helpers, isAuto = false) {
    const v24 = ensureV24(data);
    if (!v24.port.unlocked || cargoShip) return false;
    const def = EXPORT_CARGOS.find((c) => c.key === cargoKey) || EXPORT_CARGOS[0];
    const payout = calcExportPayout(def, data);

    cargoShip = {
      wx: -185,
      wz: 118,
      phase: "arriving",
      timer: 4.0,
      cargoDef: def,
      payout
    };

    if (!isAuto && helpers) {
      if (helpers.sfx && helpers.sfx.shipHorn) helpers.sfx.shipHorn();
      if (helpers.showToast) {
        helpers.showToast(`🚢 ${def.emoji} ${def.name} gemisi limana yanaşıyor! (+${payout.toLocaleString("tr-TR")} ₺)`);
      }
    }
    return true;
  }

  // =========================================================================
  // ⚽ STADYUMDA CANLI FUTBOL MAÇI BAŞLATMA
  // =========================================================================
  function startClubMatch(data, helpers) {
    const v24 = ensureV24(data);
    if (!v24.club.founded || liveMatch || matchCooldown > 0) return false;
    const opp = RIVAL_CLUBS[Math.floor(Math.random() * RIVAL_CLUBS.length)];
    const stLid = findStadiumLandId(data);

    liveMatch = {
      minute: 1,
      myScore: 0,
      oppScore: 0,
      myPower: calcClubPower(v24, data),
      oppName: opp.name,
      oppPower: opp.power,
      stadiumLandId: stLid,
      logText: "📣 Hakem ilk düdüğü çaldı! Tribünler tıklım tıklım!",
      tickAcc: 0
    };

    if (helpers) {
      if (helpers.sfx) helpers.sfx.doorBell();
      if (helpers.showToast) helpers.showToast(`⚽ MAÇ BAŞLADI: ${getClubName(data)} vs ${opp.name}!`);
    }
    return true;
  }

  function getClubName(data) {
    const bShort = window.MechanicsV23 ? window.MechanicsV23.getBrandShort(data) : "SON İSTASYON";
    return `${bShort} SK`;
  }

  // =========================================================================
  // ANA 60 FPS GÜNCELLEME DÖNGÜSÜ
  // =========================================================================
  function updateV24(dt, data, helpers) {
    const v24 = ensureV24(data);
    const moraleMult = window.MechanicsV23 ? window.MechanicsV23.getMoraleMult(data) : 1.0;

    if (matchCooldown > 0) matchCooldown = Math.max(0, matchCooldown - dt);
    if (partyCooldown > 0) partyCooldown = Math.max(0, partyCooldown - dt);

    // 1. 🚕 Şehir Taksi & Dolmuş Hattı Simülasyonu
    const desiredTaxis = v24.taxi.unlocked ? v24.taxi.fleetCount : 0;
    syncTaxiEntities(desiredTaxis);
    if (desiredTaxis > 0) {
      liveTaxis.forEach((tx) => {
        const wp = tx.waypoints[0];
        if (!wp) {
          tx.waypoints = pickRandomTaxiWaypoint(tx.wx, tx.wz);
          return;
        }
        const dx = wp.wx - tx.wx;
        const dz = wp.wz - tx.wz;
        const dist = Math.hypot(dx, dz);
        const spd = (tx.isDolmus ? 22 : 27) * moraleMult;
        if (dist > 0.2) tx.angle = Math.atan2(dx, dz);
        if (dist <= spd * dt) {
          tx.wx = wp.wx;
          tx.wz = wp.wz;
          tx.waypoints.shift();
          if (tx.waypoints.length === 0) {
            tx.waypoints = pickRandomTaxiWaypoint(tx.wx, tx.wz);
          }
        } else {
          tx.wx += (dx / dist) * spd * dt;
          tx.wz += (dz / dist) * spd * dt;
        }
      });

      taxiFareTimer += dt * moraleMult;
      if (taxiFareTimer >= 6.5) {
        taxiFareTimer -= 6.5;
        const fare = getTaxiCycleIncome(v24, data);
        if (fare > 0) {
          data.cash += fare;
          if (data.daily) data.daily.taxiIncome = (data.daily.taxiIncome || 0) + fare;
          const sample = liveTaxis[Math.floor(Math.random() * liveTaxis.length)];
          if (sample) {
            v24Floats.push({ wx: sample.wx, wz: sample.wz, text: `🚕 Taksimetre +${fare}₺`, color: "#fde047", life: 1.5 });
          }
        }
      }
    }

    // 2. ⚓ Liman & 3D Kargo Gemisi Hareketi
    if (v24.port.unlocked) {
      if (!cargoShip && v24.port.portManager) {
        autoShipCooldown -= dt;
        if (autoShipCooldown <= 0) {
          autoShipCooldown = 11.0;
          // En kârlı ihracat yükünü otomatik seç!
          let bestDef = EXPORT_CARGOS[0];
          let bestVal = 0;
          EXPORT_CARGOS.forEach((c) => {
            const val = calcExportPayout(c, data);
            if (val > bestVal) {
              bestVal = val;
              bestDef = c;
            }
          });
          startExportVoyage(bestDef.key, data, helpers, true);
        }
      }

      if (cargoShip) {
        if (cargoShip.phase === "arriving") {
          cargoShip.wx += 38 * dt;
          if (cargoShip.wx >= 0) {
            cargoShip.wx = 0;
            cargoShip.phase = "loading";
            cargoShip.timer = Math.max(2.0, 4.2 - (v24.port.craneLvl - 1) * 0.45);
          }
        } else if (cargoShip.phase === "loading") {
          cargoShip.timer -= dt * moraleMult;
          if (cargoShip.timer <= 0) {
            const earn = cargoShip.payout;
            data.cash += earn;
            if (data.daily) data.daily.portIncome = (data.daily.portIncome || 0) + earn;
            v24.port.shipmentsDone = (v24.port.shipmentsDone || 0) + 1;
            if (data.empire && data.empire.v16) data.empire.v16.xp = (data.empire.v16.xp || 0) + 45;
            v24Floats.push({
              wx: 0,
              wz: 104,
              text: `⚓ İHRACAT +${earn.toLocaleString("tr-TR")} ₺!`,
              color: "#4ade80",
              life: 2.3
            });
            if (helpers) {
              if (helpers.sfx && helpers.sfx.shipHorn) helpers.sfx.shipHorn();
              if (!v24.port.portManager && helpers.showToast) {
                helpers.showToast(`⚓ Gemi yüklendi ve denize açıldı! +${earn.toLocaleString("tr-TR")} ₺ ihracat geliri!`);
              }
              if (helpers.saveGame) helpers.saveGame();
            }
            cargoShip.phase = "departing";
          }
        } else if (cargoShip.phase === "departing") {
          cargoShip.wx += 44 * dt;
          if (cargoShip.wx > 195) {
            cargoShip = null;
            refreshDistrictModalIfOpen(data, helpers);
          }
        }
      }
    }

    // 3. ⚽ Canlı 90 Dakika Futbol Maçı Simülasyonu
    if (liveMatch) {
      liveMatch.tickAcc += dt;
      if (liveMatch.tickAcc >= 0.13) {
        liveMatch.tickAcc -= 0.13;
        liveMatch.minute += 1;

        // Gol şansı hesabı
        const powerDiff = liveMatch.myPower - liveMatch.oppPower;
        const myGoalProb = Math.max(0.012, 0.032 + powerDiff * 0.0009);
        const oppGoalProb = Math.max(0.008, 0.025 - powerDiff * 0.0006);

        if (Math.random() < myGoalProb) {
          liveMatch.myScore += 1;
          liveMatch.logText = `${liveMatch.minute}' ⚽ GOOOL! ${getClubName(data)} tribünleri yıktı geçti!`;
          if (helpers && helpers.sfx && helpers.sfx.stadiumGoal) helpers.sfx.stadiumGoal();
          if (liveMatch.stadiumLandId) {
            const z = CITY_ZONES.find((x) => x.id === liveMatch.stadiumLandId);
            if (z) v24Floats.push({ wx: z.ox, wz: z.oz, text: `⚽ GOOOL! (${liveMatch.myScore}-${liveMatch.oppScore})`, color: "#4ade80", life: 1.8 });
          }
        } else if (Math.random() < oppGoalProb) {
          liveMatch.oppScore += 1;
          liveMatch.logText = `${liveMatch.minute}' ⚠️ Konuk ekip ${liveMatch.oppName} gol buldu.`;
        }

        if (liveMatch.minute >= 90) {
          const won = liveMatch.myScore > liveMatch.oppScore;
          const draw = liveMatch.myScore === liveMatch.oppScore;
          if (won) v24.club.wins += 1;
          else if (draw) v24.club.draws += 1;
          else v24.club.losses += 1;

          const hasStriker = !!(v24.club.transfers && v24.club.transfers.striker);
          const hasStad = !!liveMatch.stadiumLandId;
          let prize = won ? 14500 : draw ? 7200 : 3800;
          if (hasStriker) prize = Math.round(prize * 1.35);
          if (hasStad) prize = Math.round(prize * 1.45);

          data.cash += prize;
          if (data.daily) data.daily.clubIncome = (data.daily.clubIncome || 0) + prize;
          if (won) data.reputation = Math.min(100, (data.reputation || 50) + 6);
          if (helpers) {
            if (won && helpers.sfx && helpers.sfx.stadiumGoal) helpers.sfx.stadiumGoal();
            if (helpers.showToast) {
              helpers.showToast(
                `🏁 MAÇ BİTTİ: ${getClubName(data)} ${liveMatch.myScore} - ${liveMatch.oppScore} ${liveMatch.oppName}! (+${prize.toLocaleString("tr-TR")} ₺ Bilet & Yayın Geliri)`
              );
            }
            if (helpers.triggerVipRush && won) helpers.triggerVipRush(35);
            if (helpers.saveGame) helpers.saveGame();
            if (helpers.updateHUD) helpers.updateHUD();
          }
          liveMatch = null;
          matchCooldown = 16;
        }
        refreshDistrictModalIfOpen(data, helpers);
      }
    }

    for (let i = v24Floats.length - 1; i >= 0; i--) {
      v24Floats[i].life -= dt;
      if (v24Floats[i].life <= 0) v24Floats.splice(i, 1);
    }
  }

  // =========================================================================
  // 🗺️ KÖŞEDE CANLI ŞEHİR RADARI (KUŞBAKIŞI MİNİ HARİTA — TEK DOKUNUŞLA UÇUŞ!)
  // =========================================================================
  function isZoneOwned(zoneId, data) {
    const emp = data.empire || {};
    const v24 = ensureV24(data);
    if (zoneId === "station") return true;
    if (zoneId === "mansion") return !!(emp.properties && (emp.properties.villa || emp.properties.residence || emp.properties.city2p1 || emp.properties.studio));
    if (zoneId === "port") return !!v24.port.unlocked;
    if (zoneId === "taxi_hq") return !!v24.taxi.unlocked;
    if (zoneId === "land2") return !!emp.land2Owned;
    if (zoneId === "land3") return !!(emp.land3 && emp.land3.owned);
    const st = emp.extraLands && emp.extraLands[zoneId];
    return !!(st && st.owned);
  }

  // Dünya koordinatı (-205..+205, -135..+145) <-> Mini Radar Canvas (156 x 116)
  function worldToRadar(wx, wz, cw, ch) {
    const rx = ((wx + 205) / 410) * cw;
    const ry = ((wz + 135) / 280) * ch;
    return { x: rx, y: ry };
  }

  function radarToWorld(rx, ry, cw, ch) {
    const wx = (rx / cw) * 410 - 205;
    const wz = (ry / ch) * 280 - 135;
    return { wx, wz };
  }

  function bindMiniRadar(onSelectZone) {
    if (radarBound) return;
    radarBound = true;

    const toggleBtn = document.getElementById("miniRadarToggleBtn");
    const boxEl = document.getElementById("miniRadarBox");
    const canvas = document.getElementById("miniRadarCanvas");

    if (toggleBtn && boxEl) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        radarCollapsed = !radarCollapsed;
        boxEl.classList.toggle("collapsed", radarCollapsed);
        toggleBtn.textContent = radarCollapsed ? "🗺️ Harita" : "➖";
      });
    }

    if (canvas) {
      canvas.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        const rect = canvas.getBoundingClientRect();
        const rx = e.clientX - rect.left;
        const ry = e.clientY - rect.top;
        const { wx, wz } = radarToWorld(rx, ry, rect.width, rect.height);

        // En yakın şehir bölgesini bul
        let bestZone = null;
        let bestDist = Infinity;
        CITY_ZONES.forEach((z) => {
          const dx = Math.max(0, Math.abs(wx - z.ox) - z.w * 0.48);
          const dz = Math.max(0, Math.abs(wz - z.oz) - z.d * 0.48);
          const d = Math.hypot(dx, dz);
          if (d < bestDist) {
            bestDist = d;
            bestZone = z;
          }
        });
        if (bestZone && onSelectZone) {
          onSelectZone(bestZone.id, wx, wz);
        }
      });
    }
  }

  function renderMiniRadar(data, activeLand, camLookAt) {
    if (radarCollapsed) return;
    const canvas = document.getElementById("miniRadarCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    // 1. Zemin: Kuzey Yeşil Tepe, Orta Şehir Düzlüğü, Güney Mavi Deniz!
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#14432a";
    ctx.fillRect(0, 0, cw, ch * 0.24);
    ctx.fillStyle = "#1a3828";
    ctx.fillRect(0, ch * 0.24, cw, ch * 0.54);
    ctx.fillStyle = "#0369a1";
    ctx.fillRect(0, ch * 0.78, cw, ch * 0.22);

    // Kumsal şeridi
    ctx.fillStyle = "#fde68a";
    ctx.fillRect(0, ch * 0.765, cw, 2.2);

    // 2. İki Ana Otoyol Bulvarı
    ctx.fillStyle = "#334155";
    const r1 = worldToRadar(0, -63, cw, ch).y;
    const r2 = worldToRadar(0, 9, cw, ch).y;
    ctx.fillRect(4, r1 - 2, cw - 8, 4);
    ctx.fillRect(4, r2 - 2, cw - 8, 4);

    // 3. Bölgeler (Malikane, 1..16 Araziler, Liman — Rakip Araziler Kırmızı Görünür!)
    CITY_ZONES.forEach((z) => {
      if (z.id === "taxi_hq") return;
      const c = worldToRadar(z.ox, z.oz, cw, ch);
      const rw = Math.max(11, (z.w / 410) * cw - 1.5);
      const rh = Math.max(11, (z.d / 280) * ch - 2);
      const owned = isZoneOwned(z.id, data);
      const isFocused = activeLand === z.id;
      const lDef = !owned && window.ExtraLandsSystem ? window.ExtraLandsSystem.getLandDef(z.id) : null;
      const isRival = !!(lDef && lDef.rivalBoss);

      ctx.fillStyle = isFocused
        ? "rgba(250, 204, 21, 0.92)"
        : z.id === "mansion"
        ? owned ? "rgba(16, 185, 129, 0.85)" : "rgba(71, 85, 105, 0.75)"
        : z.id === "port"
        ? owned ? "rgba(14, 165, 233, 0.92)" : "rgba(30, 58, 138, 0.78)"
        : owned
        ? "rgba(34, 197, 94, 0.82)"
        : isRival
        ? "rgba(185, 28, 28, 0.85)"
        : "rgba(30, 41, 59, 0.78)";

      ctx.strokeStyle = isFocused ? "#ffffff" : owned ? "#86efac" : isRival ? "#fca5a5" : "#475569";
      ctx.lineWidth = isFocused ? 1.6 : 1;
      ctx.beginPath();
      ctx.roundRect(c.x - rw / 2, c.y - rh / 2, rw, rh, 2.5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFocused ? "#090d1a" : "#f8fafc";
      ctx.font = z.id === "mansion" || z.id === "port" ? "900 7px sans-serif" : "900 7.2px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(z.label, c.x, c.y + 2.5);
    });

    // 4. Canlı Hareketli Noktalar (Kargo Gemisi, Taksiler, Patron Aracı!)
    if (cargoShip) {
      const sp = worldToRadar(cargoShip.wx, cargoShip.wz, cw, ch);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(sp.x - 5, sp.y - 2.2, 10, 4.4);
    }

    ctx.fillStyle = "#fde047";
    liveTaxis.forEach((tx) => {
      const tp = worldToRadar(tx.wx, tx.wz, cw, ch);
      ctx.fillRect(tp.x - 1.5, tp.y - 1.5, 3, 3);
    });

    if (window.MechanicsV23) {
      const st23 = window.MechanicsV23.get3DRenderState(data);
      if (st23.bossDrive) {
        const bp = worldToRadar(st23.bossDrive.wx, st23.bossDrive.wz, cw, ch);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      if (st23.pendingEmergencyLand) {
        const ez = CITY_ZONES.find((x) => x.id === st23.pendingEmergencyLand.landId);
        if (ez) {
          const ep = worldToRadar(ez.ox, ez.oz, cw, ch);
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(ep.x, ep.y - 4, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 5. Kameranın Baktığı Odak Çerçevesi
    if (camLookAt) {
      const cp = worldToRadar(camLookAt.x, camLookAt.z, cw, ch);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(cp.x - 11, cp.y - 8, 22, 16);
    }
  }

  // =========================================================================
  // 🏙️ YENİ BÖLGELER YÖNETİM MODALI (MALİKANE • FUTBOL KULÜBÜ • TAKSİ • LİMAN)
  // =========================================================================
  function openDistrictModal(tab, data, helpers) {
    if (tab) currentDistrictTab = tab;
    renderDistrictModal(data, helpers);
    const modal = document.getElementById("cityDistrictModal");
    if (modal) modal.classList.remove("hidden");
  }

  function setDistrictTab(tab) {
    currentDistrictTab = tab;
  }

  function refreshDistrictModalIfOpen(data, helpers) {
    const modal = document.getElementById("cityDistrictModal");
    if (modal && !modal.classList.contains("hidden")) {
      renderDistrictModal(data, helpers);
    }
  }

  function renderDistrictModal(data, helpers) {
    const v24 = ensureV24(data);
    const emp = data.empire || {};
    const body = document.getElementById("cityDistrictBody");
    if (!body) return;

    document.querySelectorAll(".dist24-tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.disttab === currentDistrictTab);
    });

    // SEKME 1: 🏡 3D PATRON MALİKANESİ & ÖZEL GARAJ TEPESİ
    if (currentDistrictTab === "mansion") {
      const hasVilla = !!(emp.properties && emp.properties.villa);
      const ownedCarsCount = Object.values(emp.cars || {}).filter(Boolean).length;
      const hasHeli = !!(emp.v16 && emp.v16.vipAssets && emp.v16.vipAssets.helicopter);
      const dailyBonus = calcMansionDailyBonus(v24);

      const upCards = MANSION_UPGRADES.map((u) => {
        const bought = !!v24.mansion[u.key];
        return `
          <div class="upgrade-card" style="border-color:${bought ? "#22c55e" : "#334155"};">
            <div class="up-info">
              <h3>${u.name}</h3>
              <p>${u.desc}</p>
            </div>
            <button class="up-buy-btn v24-mansion-up-btn" data-mkey="${u.key}" ${bought ? "disabled" : ""}>
              ${bought ? "KURULDU ✓" : `${u.cost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;
      }).join("");

      body.innerHTML = `
        <div class="rep-section" style="border-color:#22c55e; margin-bottom:10px;">
          <h4>🏡 KUZEY MANZARALI PATRON MALİKANESİ TEPESİ</h4>
          <p style="font-size:12.5px; color:#cbd5e1; margin-bottom:8px;">
            Şehir menüsünden aldığın <strong>Ev/Villa, ${ownedCarsCount}/4 Koleksiyon Araban ve ${hasHeli ? "🚁 Helikopterin" : "VIP varlıkların"}</strong> kuzeydeki tepede canlı 3D sergilenir!
          </p>
          <div class="rep-row"><span>🏠 Konut Durumu:</span><strong style="color:${hasVilla ? "#4ade80" : "#fde047"};">${hasVilla ? "🏡 Havuzlu Boğaz Villası Aktif" : "Şehir -> Emlakçı'dan Villa Alabilirsin"}</strong></div>
          <div class="rep-row"><span>🏎️ Garajdaki Arabaların:</span><strong style="color:#38bdf8;">${ownedCarsCount} / 4 Araç Park Halinde</strong></div>
          <div class="rep-row"><span>💳 Ekstra Malikane Geliri:</span><strong class="val-pos">+${dailyBonus} ₺ / gün</strong></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px;">
            <button id="v24FlyMansionBtn" class="up-buy-btn" style="background:#0284c7; color:#fff;">🎥 Tepeyi 3D Gör</button>
            <button id="v24HostPartyBtn" class="up-buy-btn" ${partyCooldown > 0 ? "disabled" : ""}>
              ${partyCooldown > 0 ? `🥂 Davet (${Math.ceil(partyCooldown)}sn)` : "🥂 VIP Davet Ver (3.500₺)"}
            </button>
          </div>
        </div>
        ${upCards}
      `;

      const flyBtn = document.getElementById("v24FlyMansionBtn");
      if (flyBtn) {
        flyBtn.addEventListener("click", () => {
          document.getElementById("cityDistrictModal").classList.add("hidden");
          if (helpers.focusZone) helpers.focusZone("mansion");
        });
      }

      const partyBtn = document.getElementById("v24HostPartyBtn");
      if (partyBtn && partyCooldown <= 0) {
        partyBtn.addEventListener("click", () => {
          helpers.payForBusiness(3500, "Malikane VIP Yatırımcı & Basın Daveti", () => {
            partyCooldown = 45;
            data.reputation = Math.min(100, (data.reputation || 50) + 8);
            if (emp.v16 && emp.v16.ipoLaunched) {
              emp.v16.ipoStockPrice = Math.round(emp.v16.ipoStockPrice * 1.12);
            }
            if (helpers.triggerVipRush) helpers.triggerVipRush(40);
            v24Floats.push({ wx: 0, wz: -104, text: "🥂 VIP DAVET: İTİBAR +8 & VIP AKINI!", color: "#fde047", life: 2.5 });
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast("🥂 Malikanede muhteşem VIP davet verildi! +8 İtibar ve 40sn VIP Müşteri Akını!");
            renderDistrictModal(data, helpers);
          });
        });
      }

      body.querySelectorAll(".v24-mansion-up-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const u = MANSION_UPGRADES.find((x) => x.key === btn.dataset.mkey);
          if (!u || v24.mansion[u.key]) return;
          helpers.payForBusiness(u.cost, u.name, () => {
            v24.mansion[u.key] = true;
            if (u.secBonus) data.security = Math.min(100, (data.security || 65) + u.secBonus);
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast(`${u.name} 3D Malikanene eklendi!`);
            renderDistrictModal(data, helpers);
          });
        });
      });
      return;
    }

    // SEKME 2: ⚽ STADYUMDA KENDİ FUTBOL KULÜBÜN
    if (currentDistrictTab === "club") {
      const clubName = getClubName(data);
      const power = calcClubPower(v24, data);
      const stLid = findStadiumLandId(data);

      if (!v24.club.founded) {
        body.innerHTML = `
          <div class="rep-section" style="border-color:#4ade80; text-align:center;">
            <h3 style="font-size:18px; color:#fde047; margin-bottom:6px;">⚽ ${clubName} Futbol Kulübünü Kur!</h3>
            <p style="font-size:13px; color:#cbd5e1; margin-bottom:12px;">
              Kendi şehir kulübünü kur, yıldız futbolcular transfer et ve canlı 90 dakika maçlara çık! Maç günleri tüm şehir taraftarlarla dolar!
              ${stLid ? `<br/><span style="color:#4ade80;">🏟️ Kendi Stadyumun (${stLid.replace("land", "")}. Arazi) hazır: Bilet gelirleri +%45 bonuslu!</span>` : `<br/><span style="color:#93c5fd;">💡 İpucu: 4.–10. arazilerden birine 🏟️ Stadyum kurarsan maç gelirlerin +%45 artar!</span>`}
            </p>
            <button id="v24FoundClubBtn" class="primary-btn" style="background:linear-gradient(180deg,#16a34a,#15803d);">
              ⚽ ${clubName} Kulübünü Kur (${CLUB_FOUND_COST.toLocaleString("tr-TR")} ₺)
            </button>
          </div>
        `;
        const fBtn = document.getElementById("v24FoundClubBtn");
        if (fBtn) {
          fBtn.addEventListener("click", () => {
            helpers.payForBusiness(CLUB_FOUND_COST, `${clubName} Kulüp Kuruluşu`, () => {
              v24.club.founded = true;
              helpers.sfx.stadiumGoal();
              helpers.saveGame();
              helpers.updateHUD();
              helpers.showToast(`⚽ ${clubName} resmen kuruldu! Yıldız transferleri yapıp maça çıkabilirsin!`);
              renderDistrictModal(data, helpers);
            });
          });
        }
        return;
      }

      const matchBox = liveMatch
        ? `
          <div class="rep-section" style="border-color:#facc15; background:rgba(20,83,45,0.45); text-align:center; margin-bottom:10px;">
            <div style="font-size:12px; font-weight:900; color:#fde047;">⏱️ CANLI MAÇ • ${liveMatch.minute}'. DAKİKA</div>
            <div style="font-size:21px; font-weight:900; color:#fff; margin:6px 0;">
              ${clubName} <span style="color:#4ade80;">${liveMatch.myScore} - ${liveMatch.oppScore}</span> ${liveMatch.oppName}
            </div>
            <div style="font-size:12.5px; font-weight:800; color:#fde68a;">${liveMatch.logText}</div>
          </div>
        `
        : `
          <div class="rep-section" style="border-color:#4ade80; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong style="font-size:15px; color:#fff;">⚽ ${clubName}</strong>
              <span class="shift-pill" style="color:#4ade80;">Takım Gücü: ${power}</span>
            </div>
            <div style="font-size:12px; color:#cbd5e1; margin-bottom:9px;">
              Galibiyet: <strong>${v24.club.wins}G</strong> • Beraberlik: <strong>${v24.club.draws}B</strong> • Mağlubiyet: <strong>${v24.club.losses}M</strong>
              ${stLid ? " • 🏟️ Stadyum Bonusu Aktif (+%45)" : ""}
            </div>
            <button id="v24PlayMatchBtn" class="primary-btn" style="background:linear-gradient(180deg,#16a34a,#15803d);" ${matchCooldown > 0 ? "disabled" : ""}>
              ${matchCooldown > 0 ? `⏳ Takım Dinleniyor (${Math.ceil(matchCooldown)}sn)` : "⚽ CANLI MAÇA ÇIK (Tribün & Yayın Geliri!)"}
            </button>
          </div>
        `;

      const trCards = CLUB_TRANSFERS.map((t) => {
        const signed = !!(v24.club.transfers && v24.club.transfers[t.key]);
        return `
          <div class="upgrade-card" style="border-color:${signed ? "#22c55e" : "#334155"};">
            <div class="up-info">
              <h3>${t.name}</h3>
              <p>${t.desc}</p>
            </div>
            <button class="up-buy-btn v24-sign-btn" data-tkey="${t.key}" ${signed ? "disabled" : ""}>
              ${signed ? "KADRODA ✓" : `${t.cost.toLocaleString("tr-TR")} ₺`}
            </button>
          </div>
        `;
      }).join("");

      body.innerHTML = `${matchBox}${trCards}`;

      const playBtn = document.getElementById("v24PlayMatchBtn");
      if (playBtn && !liveMatch && matchCooldown <= 0) {
        playBtn.addEventListener("click", () => {
          startClubMatch(data, helpers);
          renderDistrictModal(data, helpers);
        });
      }

      body.querySelectorAll(".v24-sign-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const t = CLUB_TRANSFERS.find((x) => x.key === btn.dataset.tkey);
          if (!t || v24.club.transfers[t.key]) return;
          helpers.payForBusiness(t.cost, `${t.name} Transferi`, () => {
            v24.club.transfers[t.key] = true;
            helpers.sfx.stadiumGoal();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast(`⚽ ${t.name} kulübümüze imza attı! Takım Gücü: ${calcClubPower(v24, data)}`);
            renderDistrictModal(data, helpers);
          });
        });
      });
      return;
    }

    // SEKME 3: 🚕 ŞEHİR İÇİ TAKSİ & DOLMUŞ HATTI
    if (currentDistrictTab === "taxi") {
      if (!v24.taxi.unlocked) {
        body.innerHTML = `
          <div class="rep-section" style="border-color:#facc15; text-align:center;">
            <h3 style="font-size:18px; color:#fde047; margin-bottom:6px;">🚕 Merkez Taksi &amp; Dolmuş Durağı Kur</h3>
            <p style="font-size:13px; color:#cbd5e1; margin-bottom:12px;">
              10 arazin, Malikane ve Liman arasında 7/24 yolcu taşıyan kendi <strong>3D Sarı Taksi ve Şehir Dolmuşu</strong> filonu kur!
            </p>
            <button id="v24UnlockTaxiBtn" class="primary-btn" style="background:linear-gradient(180deg,#f59e0b,#b45309); color:#090d1a;">
              🚕 Taksi Durağını Aç + İlk Aracı Al (${TAXI_UNLOCK_COST.toLocaleString("tr-TR")} ₺)
            </button>
          </div>
        `;
        const uBtn = document.getElementById("v24UnlockTaxiBtn");
        if (uBtn) {
          uBtn.addEventListener("click", () => {
            helpers.payForBusiness(TAXI_UNLOCK_COST, "Merkez Taksi & Dolmuş Durağı", () => {
              v24.taxi.unlocked = true;
              v24.taxi.fleetCount = 1;
              helpers.sfx.carHorn();
              helpers.saveGame();
              helpers.updateHUD();
              helpers.showToast("🚕 Taksi Durağı açıldı! İlk sarı taksin 3D şehir caddelerinde sefere başladı!");
              renderDistrictModal(data, helpers);
            });
          });
        }
        return;
      }

      const nextVehCost = getTaxiVehicleCost(v24.taxi.fleetCount);
      const dispCost = Math.round(5200 * Math.pow(1.55, v24.taxi.dispatchLvl - 1));
      const cycInc = getTaxiCycleIncome(v24, data);

      body.innerHTML = `
        <div class="rep-section" style="border-color:#facc15; margin-bottom:10px;">
          <h4>🚕 CANLI ŞEHİR TAKSİ &amp; DOLMUŞ FİLOSU (${v24.taxi.fleetCount}/8 Araç)</h4>
          <p style="font-size:12.5px; color:#cbd5e1;">
            Araçların şu an 3D bulvarlarda 10 arazi arasında yolcu taşıyor!
            <br/>Döngü Geliri: <strong style="color:#4ade80;">+${cycInc} ₺ / 6.5 sn</strong>
          </p>
        </div>

        <div class="upgrade-card" style="border-color:#facc15;">
          <div class="up-info">
            <h3>🚕 Yeni Taksi / Dolmuş Ekle (${v24.taxi.fleetCount}/8)</h3>
            <p>Filoya yeni plaka ve araç katar; cadde üstündeki canlı araç ve gelir artar!</p>
          </div>
          <button id="v24BuyTaxiBtn" class="up-buy-btn" ${v24.taxi.fleetCount >= 8 ? "disabled" : ""}>
            ${v24.taxi.fleetCount >= 8 ? "TAM FİLO ✓" : `${nextVehCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>

        <div class="upgrade-card">
          <div class="up-info">
            <h3>📱 Dijital Taksi Uygulaması &amp;Telsiz Ağı (Sv.${v24.taxi.dispatchLvl}/5)</h3>
            <p>Boş gezmeyi önler, araç başı taksimetre kazancını +32 ₺ artırır!</p>
          </div>
          <button id="v24UpDispatchBtn" class="up-buy-btn" ${v24.taxi.dispatchLvl >= 5 ? "disabled" : ""}>
            ${v24.taxi.dispatchLvl >= 5 ? "MAKS ✓" : `${dispCost.toLocaleString("tr-TR")} ₺`}
          </button>
        </div>
      `;

      const buyTx = document.getElementById("v24BuyTaxiBtn");
      if (buyTx && v24.taxi.fleetCount < 8) {
        buyTx.addEventListener("click", () => {
          helpers.payForBusiness(nextVehCost, "Yeni Şehir Taksisi & Plakası", () => {
            v24.taxi.fleetCount += 1;
            helpers.sfx.carHorn();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast(`🚕 ${v24.taxi.fleetCount}. araç şehir hattına katıldı!`);
            renderDistrictModal(data, helpers);
          });
        });
      }

      const upDp = document.getElementById("v24UpDispatchBtn");
      if (upDp && v24.taxi.dispatchLvl < 5) {
        upDp.addEventListener("click", () => {
          helpers.payForBusiness(dispCost, "Dijital Taksi Çağrı Merkezi", () => {
            v24.taxi.dispatchLvl += 1;
            helpers.sfx.perfectHit();
            helpers.saveGame();
            helpers.updateHUD();
            renderDistrictModal(data, helpers);
          });
        });
      }
      return;
    }

    // SEKME 4: ⚓ GÜNEY DENİZ KIYISI LİMAN, MARİNA & İHRACAT GEMİSİ
    if (!v24.port.unlocked) {
      body.innerHTML = `
        <div class="rep-section" style="border-color:#38bdf8; text-align:center;">
          <h3 style="font-size:18px; color:#7dd3fc; margin-bottom:6px;">⚓ Uluslararası Ticaret Limanı &amp; Marina Kur</h3>
          <p style="font-size:13px; color:#cbd5e1; margin-bottom:12px;">
            Şehrin güneyindeki mavi deniz kıyısına dev konteyner vinçleri ve gümrük iskelesi kur! Rafineri yakıtını, fabrikanın otomobillerini ve teknoloji ürünlerini <strong>3D Kargo Gemileriyle</strong> yurt dışına ihraç et!
          </p>
          <div style="display:grid; gap:8px;">
            <button id="v24UnlockPortBtn" class="primary-btn" style="background:linear-gradient(180deg,#0284c7,#0369a1);">
              ⚓ Limanı &amp; İskele Vinçlerini Kur (${PORT_UNLOCK_COST.toLocaleString("tr-TR")} ₺)
            </button>
            <button id="v24FlySeaBtn" class="up-buy-btn" style="background:#1e293b; color:#bae6fd;">🎥 Deniz Kıyısını 3D Gör</button>
          </div>
        </div>
      `;
      const uPort = document.getElementById("v24UnlockPortBtn");
      if (uPort) {
        uPort.addEventListener("click", () => {
          helpers.payForBusiness(PORT_UNLOCK_COST, "Uluslararası İhracat Limanı", () => {
            v24.port.unlocked = true;
            helpers.sfx.shipHorn();
            helpers.saveGame();
            helpers.updateHUD();
            helpers.showToast("⚓ Uluslararası Liman açıldı! İlk ihracat gemini hemen çağırabilirsin!");
            renderDistrictModal(data, helpers);
          });
        });
      }
      const flySea = document.getElementById("v24FlySeaBtn");
      if (flySea) {
        flySea.addEventListener("click", () => {
          document.getElementById("cityDistrictModal").classList.add("hidden");
          if (helpers.focusZone) helpers.focusZone("port");
        });
      }
      return;
    }

    const craneCost = Math.round(16000 * Math.pow(1.55, v24.port.craneLvl - 1));
    const cargoCards = EXPORT_CARGOS.map((c) => {
      const pay = calcExportPayout(c, data);
      const hasSyn = c.checkBonus(data);
      return `
        <div class="upgrade-card" style="border-color:${hasSyn ? "#22c55e" : "#38bdf8"};">
          <div class="up-info">
            <h3>${c.emoji} ${c.name}</h3>
            <p>Sefer Geliri: <strong style="color:#4ade80;">+${pay.toLocaleString("tr-TR")} ₺</strong><br/>
            <span style="font-size:11.5px; color:${hasSyn ? "#86efac" : "#94a3b8"};">${hasSyn ? "✅ Üretim Tesisi Bonusu Aktif!" : c.bonusDesc}</span></p>
          </div>
          <button class="up-buy-btn v24-ship-btn" data-ckey="${c.key}" ${cargoShip ? "disabled" : ""}>
            ${cargoShip ? "Gemi Limanda 🚢" : "🚢 Gemi Yükle"}
          </button>
        </div>
      `;
    }).join("");

    body.innerHTML = `
      <div class="rep-section" style="border-color:#38bdf8; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>⚓ İHRACAT LİMANI &amp; MARİNA (Sefer: ${v24.port.shipmentsDone || 0})</h4>
          <button id="v24FlyPortOpenBtn" class="sal-btn" style="padding:4px 8px; font-size:11px;">🎥 Limana Bak</button>
        </div>
        <p style="font-size:12px; color:#cbd5e1; margin-top:4px;">
          ${cargoShip ? `🚢 <strong>${cargoShip.cargoDef.name}</strong> gemisi şu an denizde (${cargoShip.phase === "loading" ? "Vinçler yükleme yapıyor..." : "Seyir halinde"})!` : "✅ İskele müsait — göndermek istediğin ihracat gemisini seç!"}
        </p>
      </div>

      ${cargoCards}

      <div class="upgrade-card">
        <div class="up-info">
          <h3>🏗️ Dev Konteyner Vinçleri (Sv.${v24.port.craneLvl}/5)</h3>
          <p>Tüm gemi ihracat gelirlerini +%28 artırır ve yükleme süresini hızlandırır!</p>
        </div>
        <button id="v24CraneUpBtn" class="up-buy-btn" ${v24.port.craneLvl >= 5 ? "disabled" : ""}>
          ${v24.port.craneLvl >= 5 ? "MAKS ✓" : `${craneCost.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card">
        <div class="up-info">
          <h3>🚢 Ro-Ro Otomotiv &amp; Soğuk Zincir İskelesi</h3>
          <p>Tüm ihracat seferlerinin kazancını kalıcı olarak +%35 büyütür!</p>
        </div>
        <button id="v24RoroBtn" class="up-buy-btn" ${v24.port.roroUnlocked ? "disabled" : ""}>
          ${v24.port.roroUnlocked ? "KURULDU ✓" : `${RORO_COST.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>

      <div class="upgrade-card" style="border-color:#facc15;">
        <div class="up-info">
          <h3>👨‍✈️ Liman Müdürü Kaptan Demir</h3>
          <p>En yüksek kârlı ihracat gemilerini hiç ara vermeden otomatik yanaştırıp yükler!</p>
        </div>
        <button id="v24PortMgrBtn" class="up-buy-btn" ${v24.port.portManager ? "disabled" : ""}>
          ${v24.port.portManager ? "GÖREVDE ✓" : `${PORT_MANAGER_COST.toLocaleString("tr-TR")} ₺`}
        </button>
      </div>
    `;

    const flyPort = document.getElementById("v24FlyPortOpenBtn");
    if (flyPort) {
      flyPort.addEventListener("click", () => {
        document.getElementById("cityDistrictModal").classList.add("hidden");
        if (helpers.focusZone) helpers.focusZone("port");
      });
    }

    body.querySelectorAll(".v24-ship-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        startExportVoyage(btn.dataset.ckey, data, helpers, false);
        renderDistrictModal(data, helpers);
      });
    });

    const crBtn = document.getElementById("v24CraneUpBtn");
    if (crBtn && v24.port.craneLvl < 5) {
      crBtn.addEventListener("click", () => {
        helpers.payForBusiness(craneCost, "Liman Konteyner Vinç Yükseltmesi", () => {
          v24.port.craneLvl += 1;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderDistrictModal(data, helpers);
        });
      });
    }

    const rrBtn = document.getElementById("v24RoroBtn");
    if (rrBtn && !v24.port.roroUnlocked) {
      rrBtn.addEventListener("click", () => {
        helpers.payForBusiness(RORO_COST, "Ro-Ro & Soğuk Zincir Terminali", () => {
          v24.port.roroUnlocked = true;
          helpers.sfx.perfectHit();
          helpers.saveGame();
          helpers.updateHUD();
          renderDistrictModal(data, helpers);
        });
      });
    }

    const pmBtn = document.getElementById("v24PortMgrBtn");
    if (pmBtn && !v24.port.portManager) {
      pmBtn.addEventListener("click", () => {
        helpers.payForBusiness(PORT_MANAGER_COST, "Liman Müdürü Kaptan Demir", () => {
          v24.port.portManager = true;
          helpers.sfx.shipHorn();
          helpers.saveGame();
          helpers.updateHUD();
          helpers.showToast("👨‍✈️ Kaptan Demir göreve başladı! İhracat gemileri artık 7/24 otomatik çalışacak!");
          renderDistrictModal(data, helpers);
        });
      });
    }
  }

  function get3DRenderState(data) {
    const v24 = ensureV24(data);
    return {
      v24,
      taxis: liveTaxis,
      cargoShip,
      liveMatch,
      floats: v24Floats
    };
  }

  return {
    CITY_ZONES,
    createDefaultV24,
    mergeV24,
    ensureV24,
    calcMansionDailyBonus,
    getClubName,
    updateV24,
    bindMiniRadar,
    renderMiniRadar,
    openDistrictModal,
    setDistrictTab,
    renderDistrictModal,
    get3DRenderState
  };
})();

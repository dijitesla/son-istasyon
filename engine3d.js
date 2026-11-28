// Son İstasyon v22.0 — TEK DEV AÇIK DÜNYA 2×5 ŞEHİR BULVARI 3D MOTORU (Three.js)
// 10 arazinin tamamı tek bir kesintisiz 3D şehir bulvarında (Üst Sıra 1–5, Alt Sıra 6–10) yan yana & arka arkaya!
// Parmağınla sürükleyip gez, uzaklaştırıp tüm imparatorluğu gör, istediğin araziye doğrudan dokun!

window.Engine3D = (function () {
  const WORLD_W = 480;
  const WORLD_H = 620;
  const SCALE = 0.1;

  // v24.0 GERÇEK ŞEHİR HARİTASI: Kuzey VIP Malikane Tepesi + 10 Arazi Ticaret Bulvarı + Güney Deniz & İhracat Limanı!
  const LAND_IDS = ["mansion", "station", "land2", "land3", "land4", "land5", "land6", "land7", "land8", "land9", "land10", "port"];
  const LAND_LAYOUT = {
    mansion: { ox:    0, oz: -104, title: "PATRON MALİKANESİ" },
    station: { ox: -112, oz:  -36, title: "1. İSTASYON" },
    land2:   { ox:  -56, oz:  -36, title: "2. GRAND AVM" },
    land3:   { ox:    0, oz:  -36, title: "3. LUNAPARK" },
    land4:   { ox:   56, oz:  -36, title: "4. ARAZİ" },
    land5:   { ox:  112, oz:  -36, title: "5. ARAZİ" },
    land6:   { ox: -112, oz:   36, title: "6. ARAZİ" },
    land7:   { ox:  -56, oz:   36, title: "7. ARAZİ" },
    land8:   { ox:    0, oz:   36, title: "8. ARAZİ" },
    land9:   { ox:   56, oz:   36, title: "9. ARAZİ" },
    land10:  { ox:  112, oz:   36, title: "10. ARAZİ" },
    port:    { ox:    0, oz:   98, title: "İHRACAT LİMANI" }
  };

  let THREE = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let canvasEl = null;
  let overlayCanvas = null;
  let overlayCtx = null;
  let ready = false;

  let hemiLight = null;
  let sunLight = null;
  let fillLight = null;
  let fog = null;

  // Gerçek SimCity / Açık Dünya Serbest 360° & İki Parmak Çoklu Dokunmatik Kamera!
  const ELEV_PRESETS = [
    { name: "İzometrik 3D", dist: 92, height: 74, radius: 118, pitch: 0.68, lookZ: 0.5 },
    { name: "Yakın Sokak 3D", dist: 62, height: 44, radius: 76, pitch: 0.61, lookZ: 2.0 },
    { name: "Tüm Şehir", dist: 238, height: 188, radius: 303, pitch: 0.67, lookZ: -2.0 }
  ];
  let elevIdx = 0;
  let yawIndex = 0; // 0..3 -> 4 İzometrik köşe (veya 360° serbest açı!)
  const YAW_ANGLES = [0.46, 2.35, -2.55, -0.46];
  let curYaw = YAW_ANGLES[0];
  let targetYaw = YAW_ANGLES[0];
  let curPitch = ELEV_PRESETS[0].pitch;
  let targetPitch = ELEV_PRESETS[0].pitch;
  let lastUserInputMs = 0;

  let camZoom = 1.0;
  let targetZoom = 1.0;
  let panX = LAND_LAYOUT.station.ox;
  let panZ = LAND_LAYOUT.station.oz;
  let targetPanX = LAND_LAYOUT.station.ox;
  let targetPanZ = LAND_LAYOUT.station.oz;
  const curCamPos = { x: LAND_LAYOUT.station.ox + 42, y: 74, z: LAND_LAYOUT.station.oz + 82 };
  const curLookAt = { x: LAND_LAYOUT.station.ox, y: 0, z: LAND_LAYOUT.station.oz + 0.5 };

  let raycaster = null;
  let groundPlane = null;
  let ndcVec = null;

  let worldBaseGroup = null;
  let staticLandGroup = null;
  let dynamicGroup = null;
  let weatherGroup = null;

  const landGroups = {};
  const landSigs = {};
  const landAnimRefs = {};
  const boulevardCars = [];

  let animRefs = {
    ferrisWheel: null,
    ferrisCabins: [],
    entryBarrier: null,
    exitBarrier: null,
    fuelFillMesh: null,
    fountainRings: [],
    hotelRoomMeshes: [],
    fireMesh: null,
    washRollers: [],
    windRotors: [],
    radarRotors: [],
    marketInteriorMat: null,
    restInteriorMat: null,
    motelRoomMats: []
  };

  // v27.0 Sıfır Tahsisli (Zero-Alloc) Şekil Bazlı Araç & Karakter Havuzları (60 FPS Sabit Akıcılık!)
  const vehiclePools = {};
  const humanCharPool = [];
  const dogCharPool = [];
  let starFieldMesh = null;
  let starFieldMat = null;
  let lastRadarMs = 0;
  let heliMesh = null;
  let cargoShipMesh = null;
  let seaWaterMat = null;
  let weatherMeshes = [];
  let rimLight = null;
  let cloudMeshes = [];
  let fuelHoseMeshes = [];
  let smokeMeshes = [];

  // =========================================================================
  // PROSEDÜREL HD DOKU, GEOMETRİ ÖNBELLEĞİ & TABELA ÜRETİCİ (KRİSTAL NETLİK!)
  // =========================================================================
  const texCache = {};
  const matCache = {};
  const geoCache = {};

  function applyAniso(tex) {
    if (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy() || 1);
    }
    return tex;
  }

  function createNoiseTexture(baseHex, speck1, speck2, repeatX, repeatY, key) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = baseHex;
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) {
      g.fillStyle = i % 3 === 0 ? speck1 : speck2;
      const sz = i % 7 === 0 ? 3 : 2;
      g.fillRect((i * 53) % 256, (i * 97) % 256, sz, sz);
    }
    g.fillStyle = "rgba(255,255,255,0.025)";
    for (let y = 0; y < 256; y += 32) {
      g.fillRect(0, y, 256, 1);
    }
    const tex = applyAniso(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function createPaverTexture(baseHex, seamHex, repeatX, repeatY, key) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = baseHex;
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = seamHex;
    g.lineWidth = 2;
    for (let r = 0; r < 4; r++) {
      const y = r * 32;
      g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke();
      const off = (r % 2) * 16;
      for (let x = off; x < 128; x += 32) {
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke();
      }
    }
    const tex = applyAniso(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function createSignTexture(text, bgHex, textHex = "#ffffff", borderHex = "#fde047") {
    const key = `sign_${text}_${bgHex}_${textHex}_${borderHex}`;
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const g = c.getContext("2d");
    g.fillStyle = bgHex;
    g.fillRect(0, 0, 256, 64);
    g.strokeStyle = borderHex;
    g.lineWidth = 6;
    g.strokeRect(4, 4, 248, 56);
    g.fillStyle = textHex;
    g.font = "900 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 128, 34);
    const tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function createRoofTexture(baseHex, seamHex, key) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = baseHex;
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = seamHex;
    g.lineWidth = 2;
    for (let x = 0; x <= 128; x += 32) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke();
    }
    for (let y = 0; y <= 128; y += 32) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke();
    }
    for (let i = 0; i < 240; i++) {
      g.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.06)";
      g.fillRect((i * 47) % 128, (i * 83) % 128, 3, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function createTotemTexture(data) {
    const M23 = window.MechanicsV23;
    const pol = M23 && data ? M23.getFuelPolicy(data) : { key: "normal", benzin: "44.90", dizel: "43.20", lpg: "25.40", ev: "9.50" };
    const brandShort = M23 && data ? M23.getBrandShort(data) : "SON";
    const neon = M23 && data ? M23.getNeonTheme(data) : { key: "amber", hex: "#dc2626", dark: "#dc2626" };
    const key = `fuel_totem_v23_${brandShort}_${pol.key}_${neon.key}`;
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#0f172a";
    g.fillRect(0, 0, 128, 256);
    g.fillStyle = neon.key === "amber" ? "#dc2626" : neon.dark;
    g.fillRect(6, 6, 116, 48);
    g.strokeStyle = neon.hex;
    g.lineWidth = 3;
    g.strokeRect(6, 6, 116, 48);
    g.fillStyle = "#fef08a";
    g.font = brandShort.length > 7 ? "900 13.5px sans-serif" : brandShort.length > 5 ? "900 16px sans-serif" : "900 20px sans-serif";
    g.textAlign = "center";
    g.fillText(`${brandShort} 7/24`, 64, 37);
    const rows = [
      ["BENZİN", pol.benzin, "#4ade80"],
      ["DİZEL", pol.dizel, "#facc15"],
      ["OTOGAZ", pol.lpg, "#38bdf8"],
      ["EV kW", pol.ev, "#c084fc"]
    ];
    rows.forEach(([lbl, pr, col], idx) => {
      const y = 66 + idx * 45;
      g.fillStyle = "#1e293b";
      g.fillRect(8, y, 112, 36);
      g.fillStyle = "#cbd5e1";
      g.font = "800 13px sans-serif";
      g.textAlign = "left";
      g.fillText(lbl, 14, y + 23);
      g.fillStyle = col;
      g.font = "900 17px monospace";
      g.textAlign = "right";
      g.fillText(pr, 114, y + 24);
    });
    const tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function createWindowFacadeTexture(wallHex, winHex, litHex, cols = 4, rows = 2, hasDoor = false) {
    const key = `win21_${wallHex}_${winHex}_${litHex}_${cols}_${rows}_${hasDoor}`;
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = wallHex;
    g.fillRect(0, 0, 256, 128);
    // Yatay mimari sıva ve kat çizgileri
    g.fillStyle = "rgba(0,0,0,0.16)";
    g.fillRect(0, 114, 256, 14);
    g.fillStyle = "rgba(255,255,255,0.1)";
    for (let r = 0; r < rows; r++) {
      g.fillRect(0, (r * 128) / rows, 256, 4);
    }
    const padX = 10;
    const padY = 12;
    const cellW = 256 / cols;
    const cellH = 128 / rows;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const isDoorSlot = hasDoor && r === rows - 1 && col === Math.floor(cols / 2);
        const x0 = col * cellW + padX;
        const y0 = r * cellH + padY;
        const ww = cellW - padX * 2;
        const wh = cellH - padY * 2;
        if (isDoorSlot) {
          g.fillStyle = "#0f172a";
          g.fillRect(x0 - 2, y0 - 2, ww + 4, wh + 14);
          g.fillStyle = "#38bdf8";
          g.fillRect(x0 + 2, y0 + 2, ww - 4, wh + 8);
          g.fillStyle = "#e2e8f0";
          g.fillRect(x0 + ww / 2 - 1, y0 + 2, 2, wh + 8);
        } else {
          const isLit = (r + col) % 2 === 0;
          // Pencere kasası
          g.fillStyle = "rgba(15,23,42,0.75)";
          g.fillRect(x0 - 2, y0 - 2, ww + 4, wh + 4);
          g.fillStyle = isLit ? litHex : winHex;
          g.fillRect(x0, y0, ww, wh);
          // Cam diyagonal parlama + orta çıta
          g.fillStyle = "rgba(255,255,255,0.34)";
          g.fillRect(x0 + 3, y0 + 3, ww - 6, 4);
          g.fillStyle = "rgba(15,23,42,0.45)";
          g.fillRect(x0 + ww / 2 - 1, y0, 2, wh);
        }
      }
    }
    const tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    texCache[key] = tex;
    return tex;
  }

  function getMat(color, opts = {}) {
    const key = `${color}_${opts.rough ?? 0.65}_${opts.metal ?? 0.1}_${opts.emissive || ""}_${opts.emInt || 0}_${opts.op ?? 1}_${opts.texKey || ""}`;
    if (matCache[key]) return matCache[key];
    const cfg = {
      color,
      roughness: opts.rough !== undefined ? opts.rough : 0.65,
      metalness: opts.metal !== undefined ? opts.metal : 0.1
    };
    if (opts.map) cfg.map = opts.map;
    if (opts.emissive) {
      cfg.emissive = new THREE.Color(opts.emissive);
      cfg.emissiveIntensity = opts.emInt || 0.6;
    }
    if (opts.op !== undefined && opts.op < 1) {
      cfg.transparent = true;
      cfg.opacity = opts.op;
    }
    const m = new THREE.MeshStandardMaterial(cfg);
    matCache[key] = m;
    return m;
  }

  function to3DX(lx) { return (lx - WORLD_W / 2) * SCALE; }
  function to3DZ(ly) { return (ly - WORLD_H / 2) * SCALE; }
  function toLogicalX(wx) { return wx / SCALE + WORLD_W / 2; }
  function toLogicalY(wz) { return wz / SCALE + WORLD_H / 2; }

  function getBoxGeo(w, h, d) {
    const k = `b_${w.toFixed(3)}_${h.toFixed(3)}_${d.toFixed(3)}`;
    if (!geoCache[k]) geoCache[k] = new THREE.BoxGeometry(w, h, d);
    return geoCache[k];
  }

  function getCylGeo(rt, rb, h, seg) {
    const k = `c_${rt.toFixed(3)}_${rb.toFixed(3)}_${h.toFixed(3)}_${seg}`;
    if (!geoCache[k]) geoCache[k] = new THREE.CylinderGeometry(rt, rb, h, seg);
    return geoCache[k];
  }

  function box(w, h, d, color, opts = {}) {
    const mesh = new THREE.Mesh(getBoxGeo(w, h, d), getMat(color, opts));
    if (opts.shadow !== false) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    return mesh;
  }

  function cyl(rt, rb, h, seg, color, opts = {}) {
    const mesh = new THREE.Mesh(getCylGeo(rt, rb, h, seg), getMat(color, opts));
    if (opts.shadow !== false) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    return mesh;
  }

  // Gerçekçi Dokulu Mimari Çatı + Parapet + Işıklı Cam Çatı Penceresi + Klima + 3D Işıklı Tabela!
  function addDetailedRoof(parent, cx, topY, cz, w, d, roofCol, accentCol, signText = "", signBg = "#0f172a") {
    // Dokulu çatı tabanı (düz plastik görünmez!)
    const rTexKey = `roof_${roofCol}`;
    const rTex = createRoofTexture(roofCol, "rgba(255,255,255,0.07)", rTexKey);
    const roof = box(w + 0.24, 0.3, d + 0.24, "#ffffff", { map: rTex, texKey: rTexKey, rough: 0.74 });
    roof.position.set(cx, topY, cz);
    parent.add(roof);

    // 4 Kenarlı Mimari Parapet Duvarı + Köşe Sütun Kapakları
    const rimH = 0.42;
    const rimT = 0.26;
    const rN = box(w + 0.26, rimH, rimT, accentCol, { emissive: accentCol, emInt: 0.42, rough: 0.38 });
    rN.position.set(cx, topY + rimH / 2, cz - d / 2);
    const rS = box(w + 0.26, rimH, rimT, accentCol, { emissive: accentCol, emInt: 0.42, rough: 0.38 });
    rS.position.set(cx, topY + rimH / 2, cz + d / 2);
    const rW = box(rimT, rimH, d, accentCol, { emissive: accentCol, emInt: 0.42, rough: 0.38 });
    rW.position.set(cx - w / 2, topY + rimH / 2, cz);
    const rE = box(rimT, rimH, d, accentCol, { emissive: accentCol, emInt: 0.42, rough: 0.38 });
    rE.position.set(cx + w / 2, topY + rimH / 2, cz);
    parent.add(rN, rS, rW, rE);

    // Çatı HVAC / Klima Üniteleri + Cam Işıklık (Skylight)
    if (w >= 5 && d >= 4) {
      const ac1 = box(1.25, 0.56, 1.05, "#cbd5e1", { metal: 0.45, rough: 0.42 });
      ac1.position.set(cx - w * 0.28, topY + 0.42, cz + d * 0.18);
      const fan = cyl(0.34, 0.34, 0.1, 10, "#0f172a");
      fan.position.set(cx - w * 0.28, topY + 0.72, cz + d * 0.18);
      parent.add(ac1, fan);

      if (w >= 8 && d >= 6) {
        // Mimari Cam Çatı Penceresi (Skylight) + Havalandırma Borusu
        const skyFrame = box(w * 0.34, 0.24, d * 0.28, "#334155", { metal: 0.5 });
        skyFrame.position.set(cx + w * 0.15, topY + 0.26, cz + d * 0.08);
        const skyGlass = box(w * 0.3, 0.28, d * 0.24, "#7dd3fc", { emissive: "#38bdf8", emInt: 0.45, metal: 0.7, rough: 0.12 });
        skyGlass.position.set(cx + w * 0.15, topY + 0.3, cz + d * 0.08);
        const ventPipe = cyl(0.22, 0.22, 0.85, 8, "#94a3b8", { metal: 0.55 });
        ventPipe.position.set(cx - w * 0.1, topY + 0.55, cz + d * 0.26);
        parent.add(skyFrame, skyGlass, ventPipe);
      }
    }

    // Çatı Üstü Çift Yönlü Işıklı 3D Tabela + Metal Ayaklar!
    if (signText) {
      const tex = createSignTexture(signText, signBg, "#fef9c3", accentCol);
      const signMat = new THREE.MeshStandardMaterial({
        map: tex,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: tex,
        emissiveIntensity: 0.62,
        roughness: 0.26
      });
      const sw = Math.min(w * 0.88, 6.8);
      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(sw, 1.42, 0.3), signMat);
      signBoard.position.set(cx, topY + 1.05, cz - d / 2 + 0.26);
      signBoard.castShadow = true;
      const postL = cyl(0.08, 0.08, 0.5, 6, "#cbd5e1", { metal: 0.6 });
      postL.position.set(cx - sw * 0.32, topY + 0.3, cz - d / 2 + 0.26);
      const postR = cyl(0.08, 0.08, 0.5, 6, "#cbd5e1", { metal: 0.6 });
      postR.position.set(cx + sw * 0.32, topY + 0.3, cz - d / 2 + 0.26);
      parent.add(signBoard, postL, postR);
    }
  }

  // =========================================================================
  // BAŞLATMA (WEBGL + THREE.JS)
  // =========================================================================
  function init(threeCanvas, hudCanvas) {
    if (!window.THREE || !threeCanvas) return false;
    THREE = window.THREE;
    canvasEl = threeCanvas;
    overlayCanvas = hudCanvas;
    overlayCtx = hudCanvas ? hudCanvas.getContext("2d") : null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false
      });
    } catch (err) {
      console.warn("WebGL init fallback:", err);
      return false;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#1d3557");
    fog = new THREE.FogExp2("#1d3557", 0.00078);
    scene.fog = fog;

    // DAR FOV (28°) + GENİŞ GÖRÜŞ MESAFESİ (980) = KUZEY MALİKANE + 10 ARAZİ + GÜNEY DENİZ TEK EKRANDA NET!
    camera = new THREE.PerspectiveCamera(28, 1, 1, 980);

    // 3 Noktalı Stüdyo Işıklandırması (Optimize 1024px Keskin Odaklı Gölge = Yüksek FPS + Net Detay!)
    hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 1.1);
    scene.add(hemiLight);

    sunLight = new THREE.DirectionalLight(0xfff5dc, 1.48);
    sunLight.position.set(LAND_LAYOUT.station.ox + 42, 68, LAND_LAYOUT.station.oz + 34);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 18;
    sunLight.shadow.camera.far = 210;
    const sc = 54;
    sunLight.shadow.camera.left = -sc;
    sunLight.shadow.camera.right = sc;
    sunLight.shadow.camera.top = sc;
    sunLight.shadow.camera.bottom = -sc;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    scene.add(sunLight.target);

    fillLight = new THREE.DirectionalLight(0x93c5fd, 0.54);
    fillLight.position.set(-32, 34, -26);
    scene.add(fillLight);

    // v26.0 Sıcak Altın Rim (Kenar Parlama) Işığı — Araç tavanları, camlar & binalar daha gerçekçi parlar!
    rimLight = new THREE.DirectionalLight(0xfde68a, 0.38);
    rimLight.position.set(-48, 22, 46);
    scene.add(rimLight);

    // v27.0 Gece Gökyüzü Yıldız Kubbesi (Tek Draw-Call — Yalnızca Akşam/Gece Belirir!)
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(180 * 3);
    for (let si = 0; si < 180; si++) {
      const th = (si * 2.39996) % (Math.PI * 2);
      const rad = 210 + (si % 7) * 32;
      starPositions[si * 3] = Math.cos(th) * rad;
      starPositions[si * 3 + 1] = 68 + (si % 11) * 12;
      starPositions[si * 3 + 2] = Math.sin(th) * rad;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starFieldMat = new THREE.PointsMaterial({
      color: 0xfef9c3,
      size: 2.2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0
    });
    starFieldMesh = new THREE.Points(starGeo, starFieldMat);
    starFieldMesh.visible = false;
    scene.add(starFieldMesh);

    worldBaseGroup = new THREE.Group();
    staticLandGroup = new THREE.Group();
    dynamicGroup = new THREE.Group();
    weatherGroup = new THREE.Group();
    scene.add(worldBaseGroup);
    scene.add(staticLandGroup);
    scene.add(dynamicGroup);
    scene.add(weatherGroup);

    // v26.0 Gökyüzünde Yumuşak Süzülen 3D Bulut Kümeleri
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xdbeafe,
      emissiveIntensity: 0.25,
      roughness: 0.95,
      transparent: true,
      opacity: 0.62
    });
    for (let ci = 0; ci < 9; ci++) {
      const cg = new THREE.Group();
      const s1 = new THREE.Mesh(new THREE.SphereGeometry(5.5, 10, 8), cloudMat);
      s1.scale.set(1.6, 0.55, 1.0);
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(4.2, 10, 8), cloudMat);
      s2.position.set(-4.8, -0.4, 0.6);
      s2.scale.set(1.4, 0.5, 0.95);
      const s3 = new THREE.Mesh(new THREE.SphereGeometry(4.0, 10, 8), cloudMat);
      s3.position.set(4.9, -0.5, -0.5);
      s3.scale.set(1.35, 0.48, 0.9);
      cg.add(s1, s2, s3);
      cg.position.set(-190 + ci * 48, 52 + (ci % 3) * 6, -95 + (ci % 4) * 58);
      cg.userData = { speed: 1.4 + (ci % 3) * 0.55, mat: cloudMat };
      scene.add(cg);
      cloudMeshes.push(cg);
    }

    // v26.0 Canlı Yükselen Baca Dumanı / Buhar Parçacıkları (Restoran & Taş Fırın!)
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.36 });
    for (let si = 0; si < 8; si++) {
      const sm = new THREE.Mesh(new THREE.SphereGeometry(0.45, 7, 7), smokeMat.clone());
      sm.userData = { phase: si * 0.125, isOven: si < 4 };
      scene.add(sm);
      smokeMeshes.push(sm);
    }

    // 10 Arazi İçin Bağımsız Önbellekli Sahne Grupları (Yalnızca Değişen Arazi Yenilenir!)
    LAND_IDS.forEach((lid) => {
      const grp = new THREE.Group();
      const L = LAND_LAYOUT[lid];
      grp.position.set(L.ox, 0, L.oz);
      staticLandGroup.add(grp);
      landGroups[lid] = grp;
      landSigs[lid] = "";
    });

    // Tek 2×5 Şehir Bulvarı Zemin & Otoyol Ağı (1 Kez Kurulur!)
    buildUnifiedWorldBase();

    // İki Ana Bulvarda Kesintisiz Akan 16 Şehir Trafik Aracı
    const bCols = ["#ef4444", "#38bdf8", "#f8fafc", "#facc15", "#22c55e", "#f97316", "#a855f7", "#cbd5e1"];
    for (let i = 0; i < 16; i++) {
      const row = i % 2;
      const dir = i % 4 < 2 ? 1 : -1;
      boulevardCars.push({
        wx: -165 + i * 22,
        wz: (row === 0 ? -63 : 9) + (dir > 0 ? 1.85 : -1.85),
        dir,
        speed: 14 + (i % 5) * 3.5,
        color: bCols[i % bCols.length],
        shape: i % 6 === 0 ? "truck" : i % 4 === 0 ? "sport" : "sedan"
      });
    }

    raycaster = new THREE.Raycaster();
    groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    ndcVec = new THREE.Vector2();

    ready = true;
    handleResize();
    return true;
  }

  function handleResize() {
    if (!ready || !canvasEl) return;
    const parent = canvasEl.parentElement;
    const w = (parent && parent.clientWidth) || 440;
    const h = (parent && parent.clientHeight) || 580;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();

    if (overlayCanvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
      if (overlayCanvas.width !== Math.round(w * dpr) || overlayCanvas.height !== Math.round(h * dpr)) {
        overlayCanvas.width = Math.round(w * dpr);
        overlayCanvas.height = Math.round(h * dpr);
      }
    }
  }

  // =========================================================================
  // KAMERA KONTROLLERİ (SERBEST 360° DÖNDÜRME, İKİ PARMAK ZOOM, 1:1 KAYDIRMA)
  // =========================================================================
  function intersectGround(clientX, clientY, outVec) {
    if (!ready || !canvasEl) return false;
    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    ndcVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndcVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndcVec, camera);
    return !!raycaster.ray.intersectPlane(groundPlane, outVec);
  }

  function screenToWorldHit(clientX, clientY) {
    if (!ready || !canvasEl) return { landId: "station", x: 240, y: 310 };
    const hit = new THREE.Vector3();
    if (intersectGround(clientX, clientY, hit)) {
      let bestId = "station";
      let bestDist = Infinity;
      for (let i = 0; i < LAND_IDS.length; i++) {
        const lid = LAND_IDS[i];
        const L = LAND_LAYOUT[lid];
        const d = Math.hypot(hit.x - L.ox, hit.z - L.oz);
        if (d < bestDist) {
          bestDist = d;
          bestId = lid;
        }
      }
      const L = LAND_LAYOUT[bestId];
      return {
        landId: bestId,
        x: Math.max(0, Math.min(WORLD_W, toLogicalX(hit.x - L.ox))),
        y: Math.max(0, Math.min(WORLD_H, toLogicalY(hit.z - L.oz)))
      };
    }
    return { landId: getFocusedLand(), x: 240, y: 310 };
  }

  function screenToLogical(clientX, clientY) {
    const h = screenToWorldHit(clientX, clientY);
    return { x: h.x, y: h.y };
  }

  function worldPosToScreen(wx, heightY, wz) {
    if (!ready || !canvasEl) return { x: -100, y: -100, visible: false };
    const v = new THREE.Vector3(wx, heightY, wz);
    v.project(camera);
    const w = canvasEl.clientWidth || 440;
    const h = canvasEl.clientHeight || 580;
    return {
      x: (v.x * 0.5 + 0.5) * w,
      y: (-v.y * 0.5 + 0.5) * h,
      visible: v.z < 1
    };
  }

  function worldToScreen(lx, heightY, ly, landId = "station") {
    const L = LAND_LAYOUT[landId] || LAND_LAYOUT.station;
    return worldPosToScreen(L.ox + to3DX(lx), heightY, L.oz + to3DZ(ly));
  }

  function zoomBy(delta) {
    lastUserInputMs = performance.now();
    targetZoom = Math.max(0.34, Math.min(2.9, targetZoom + delta));
  }

  function zoomByFactor(factor) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    lastUserInputMs = performance.now();
    const clampedFactor = Math.max(0.75, Math.min(1.35, factor));
    targetZoom = Math.max(0.34, Math.min(2.9, targetZoom * clampedFactor));
  }

  function rotateBy(deltaRad) {
    if (!Number.isFinite(deltaRad)) return;
    lastUserInputMs = performance.now();
    targetYaw += deltaRad;
  }

  function tiltBy(deltaPitch) {
    if (!Number.isFinite(deltaPitch)) return;
    lastUserInputMs = performance.now();
    targetPitch = Math.max(0.38, Math.min(1.22, targetPitch + deltaPitch));
  }

  function panBy(dxPx, dyPx) {
    lastUserInputMs = performance.now();
    const f = 0.066 * camZoom * (ELEV_PRESETS[elevIdx].radius / 118);
    const cosY = Math.cos(curYaw);
    const sinY = Math.sin(curYaw);
    const worldDx = (-dxPx * cosY - dyPx * sinY) * f;
    const worldDz = (dxPx * sinY - dyPx * cosY) * f;
    targetPanX = Math.max(-154, Math.min(154, targetPanX + worldDx));
    targetPanZ = Math.max(-118, Math.min(112, targetPanZ + worldDz));
  }

  // Parmağın altındaki zemin noktasını 1:1 parmağa kilitleyen hassas kaydırma!
  function panByScreen(prevX, prevY, curX, curY) {
    lastUserInputMs = performance.now();
    const hPrev = new THREE.Vector3();
    const hCur = new THREE.Vector3();
    if (intersectGround(prevX, prevY, hPrev) && intersectGround(curX, curY, hCur)) {
      const worldDx = Math.max(-24, Math.min(24, hPrev.x - hCur.x));
      const worldDz = Math.max(-24, Math.min(24, hPrev.z - hCur.z));
      targetPanX = Math.max(-154, Math.min(154, targetPanX + worldDx));
      targetPanZ = Math.max(-118, Math.min(112, targetPanZ + worldDz));
    } else {
      panBy(curX - prevX, curY - prevY);
    }
  }

  function focusLand(landId, instant = false) {
    const L = LAND_LAYOUT[landId] || LAND_LAYOUT.station;
    targetPanX = L.ox;
    targetPanZ = L.oz;
    if (elevIdx === 2) {
      elevIdx = 0;
      targetPitch = ELEV_PRESETS[0].pitch;
    }
    if (targetZoom > 1.35) targetZoom = 1.0;
    if (instant) {
      panX = L.ox;
      panZ = L.oz;
      curLookAt.x = L.ox;
      curLookAt.z = L.oz + ELEV_PRESETS[elevIdx].lookZ;
    }
  }

  function followWorldPos(wx, wz) {
    targetPanX = Math.max(-150, Math.min(150, wx));
    targetPanZ = Math.max(-112, Math.min(104, wz));
    if (elevIdx === 2) elevIdx = 0;
    if (targetZoom > 1.15) targetZoom = 0.88;
  }

  function getFocusedLand() {
    let bestId = "station";
    let bestDist = Infinity;
    for (let i = 0; i < LAND_IDS.length; i++) {
      const lid = LAND_IDS[i];
      const L = LAND_LAYOUT[lid];
      const d = Math.hypot(targetPanX - L.ox, targetPanZ - L.oz);
      if (d < bestDist) {
        bestDist = d;
        bestId = lid;
      }
    }
    return bestId;
  }

  function rotate90() {
    yawIndex = (yawIndex + 1) % YAW_ANGLES.length;
    targetYaw = YAW_ANGLES[yawIndex];
    const names = ["Güney-Doğu", "Kuzey-Doğu", "Kuzey-Batı", "Güney-Batı"];
    return names[yawIndex];
  }

  function resetCamera(landId) {
    targetPitch = ELEV_PRESETS[elevIdx].pitch;
    if (landId && LAND_LAYOUT[landId]) {
      focusLand(landId, false);
    } else {
      targetZoom = 1.0;
    }
  }

  function cycleAngle() {
    elevIdx = (elevIdx + 1) % ELEV_PRESETS.length;
    targetPitch = ELEV_PRESETS[elevIdx].pitch;
    if (elevIdx === 2) {
      targetPanX = 0;
      targetPanZ = 0;
      targetZoom = 1.08;
    }
    return ELEV_PRESETS[elevIdx].name;
  }

  // =========================================================================
  // DOĞA, AĞAÇLAR, DOKULU OTOYOL & ÇEVRE
  // =========================================================================
  function createPineTree(x, z, scale = 1) {
    const g = new THREE.Group();
    const trunk = cyl(0.2, 0.3, 1.3, 6, "#78492a", { rough: 0.9 });
    trunk.position.y = 0.65;
    g.add(trunk);
    [
      [1.3, 2.0, 1.9, "#15803d"],
      [1.0, 1.7, 2.95, "#16a34a"],
      [0.65, 1.3, 3.8, "#22c55e"]
    ].forEach(([r, h, y, col]) => {
      const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), getMat(col, { rough: 0.85 }));
      c.position.y = y;
      c.castShadow = true;
      g.add(c);
    });
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    return g;
  }

  function createPalmTree(x, z, scale = 1) {
    const g = new THREE.Group();
    const trunk = cyl(0.16, 0.32, 4.2, 7, "#85583a", { rough: 0.9 });
    trunk.position.y = 2.1;
    trunk.rotation.z = 0.05;
    g.add(trunk);
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI * 2) / 6;
      const leaf = box(0.55, 0.1, 2.1, "#22c55e", { rough: 0.72 });
      leaf.position.set(Math.sin(ang) * 0.95, 4.15, Math.cos(ang) * 0.95);
      leaf.rotation.y = ang;
      leaf.rotation.x = 0.3;
      g.add(leaf);
    }
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    return g;
  }

  function createBroadleafTree(x, z, scale = 1, tint = "#16a34a") {
    const g = new THREE.Group();
    const trunk = cyl(0.22, 0.34, 1.8, 6, "#78492a", { rough: 0.9 });
    trunk.position.y = 0.9;
    g.add(trunk);
    const spheres = [
      [0, 2.55, 0, 1.35, tint],
      [-0.65, 2.2, 0.45, 0.95, "#22c55e"],
      [0.65, 2.25, -0.35, 0.92, "#15803d"]
    ];
    spheres.forEach(([sx, sy, sz, r, col]) => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), getMat(col, { rough: 0.82 }));
      m.position.set(sx, sy, sz);
      m.castShadow = true;
      g.add(m);
    });
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    return g;
  }

  function createFlowerBush(x, z, flowerCol = "#f43f5e") {
    const g = new THREE.Group();
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 1), getMat("#15803d", { rough: 0.86 }));
    bush.scale.set(1.25, 0.72, 1.25);
    bush.position.y = 0.36;
    bush.castShadow = true;
    g.add(bush);
    [[-0.35, 0.62, 0.2], [0.3, 0.66, -0.15], [0.05, 0.74, 0.22]].forEach(([fx, fy, fz]) => {
      const fl = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 6, 6),
        getMat(flowerCol, { emissive: flowerCol, emInt: 0.3, shadow: false })
      );
      fl.position.set(fx, fy, fz);
      g.add(fl);
    });
    g.position.set(x, 0, z);
    return g;
  }

  function createStreetLamp3D(lx, ly) {
    const g = new THREE.Group();
    const base = cyl(0.24, 0.28, 0.4, 6, "#334155", { metal: 0.5 });
    base.position.y = 0.2;
    const pole = cyl(0.09, 0.13, 4.4, 6, "#64748b", { metal: 0.5, rough: 0.4 });
    pole.position.y = 2.2;
    const arm = box(0.95, 0.12, 0.12, "#94a3b8", { metal: 0.5 });
    arm.position.set(0.38, 4.35, 0);
    const hood = box(0.62, 0.14, 0.36, "#1e293b", { metal: 0.6 });
    hood.position.set(0.76, 4.34, 0);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 8, 8),
      getMat("#fef08a", { emissive: "#fde047", emInt: 1.65, rough: 0.2, shadow: false })
    );
    bulb.position.set(0.76, 4.2, 0);
    // Zeminde sıcak ışık halesi!
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 16),
      getMat("#fef08a", { emissive: "#fde047", emInt: 0.5, op: 0.14, shadow: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0.7, 0.12, 0);
    g.add(base, pole, arm, hood, bulb, pool);
    g.position.set(to3DX(lx), 0, to3DZ(ly));
    return g;
  }

  // =========================================================================
  // TEK DEV 2×5 ŞEHİR BULVARI ZEMİNİ, OTOYOLLAR, BAĞLANTI CADDELERİ & PEYZAJ
  // =========================================================================
  function buildUnifiedWorldBase() {
    const group = worldBaseGroup;
    // Geniş Zümrüt Çim Arazi (Tüm 10 araziyi + ufku sarar!)
    const grassTex = createNoiseTexture("#226038", "rgba(74,222,128,0.06)", "rgba(15,40,22,0.08)", 44, 30, "world_grass_2x5");
    const terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(680, 480),
      getMat("#ffffff", { map: grassTex, texKey: "world_grass_2x5", rough: 0.92, shadow: false })
    );
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.1;
    terrain.receiveShadow = true;
    group.add(terrain);

    // İki Kesintisiz Ana Bulvar (Kuzey Otoyolu z=-63 & Orta Şehir Bulvarı z=+9) + Güney Çevre Yolu z=+73
    const roadTex = createNoiseTexture("#232d3f", "rgba(255,255,255,0.07)", "rgba(0,0,0,0.22)", 48, 2, "world_blvd_asphalt");
    const dashMat = getMat("#f8fafc", { rough: 0.45, shadow: false });
    [-63, 9].forEach((rz) => {
      const road = box(360, 0.18, 7.8, "#ffffff", { map: roadTex, texKey: "world_blvd_asphalt", rough: 0.88, shadow: false });
      road.position.set(0, -0.02, rz);
      road.receiveShadow = true;
      group.add(road);

      for (let dx = -168; dx <= 168; dx += 6.0) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.04, 0.24), dashMat);
        dash.position.set(dx, 0.08, rz);
        group.add(dash);
      }
      const e1 = box(360, 0.04, 0.16, "#facc15", { shadow: false });
      e1.position.set(0, 0.08, rz - 3.5);
      const e2 = box(360, 0.04, 0.16, "#facc15", { shadow: false });
      e2.position.set(0, 0.08, rz + 3.5);
      group.add(e1, e2);

      // Kuzey tarafı metal otoyol bariyeri (Malikane Tepesi yolu hizasında temiz geçiş boşluğu!)
      if (rz === -63) {
        const railL = box(142, 0.34, 0.18, "#cbd5e1", { metal: 0.72, rough: 0.28, shadow: false });
        railL.position.set(-102, 0.55, rz - 4.1);
        const railR = box(142, 0.34, 0.18, "#cbd5e1", { metal: 0.72, rough: 0.28, shadow: false });
        railR.position.set(102, 0.55, rz - 4.1);
        group.add(railL, railR);
      }
    });

    // Güney Sahil Kordon Yolu (Deniz Kıyısı & Liman Bağlantısı)
    const southRoad = box(340, 0.16, 5.4, "#ffffff", { map: roadTex, texKey: "world_blvd_asphalt", rough: 0.88, shadow: false });
    southRoad.position.set(0, -0.03, 73.5);
    group.add(southRoad);

    // 6 Dikey Bağlantı Caddesi + Kuzey Malikane Yolu!
    const aveTex = createNoiseTexture("#273246", "rgba(255,255,255,0.06)", "rgba(0,0,0,0.18)", 2, 22, "world_ave_asphalt");
    [-140, -84, -28, 28, 84, 140].forEach((ax) => {
      const ave = box(5.4, 0.15, 139, "#ffffff", { map: aveTex, texKey: "world_ave_asphalt", rough: 0.88, shadow: false });
      ave.position.set(ax, -0.035, 5.5);
      ave.receiveShadow = true;
      group.add(ave);

      for (let dz = -56; dz <= 66; dz += 7.5) {
        if (Math.abs(dz - 9) < 5) continue;
        const d = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 2.6), dashMat);
        d.position.set(ax, 0.06, dz);
        group.add(d);
      }
    });

    // Kuzey Malikane Tepesi Panoramik Yokuş Yolu (Kuzey Otoyolu z=-63 -> Malikane Tepesi z=-90)
    const hillRoad = box(6.8, 0.22, 27, "#ffffff", { map: aveTex, texKey: "world_ave_asphalt", rough: 0.85, shadow: false });
    hillRoad.position.set(0, 1.35, -76.5);
    hillRoad.rotation.x = 0.11;
    group.add(hillRoad);

    // Güney Altın Kumsal Şeridi + Sahil Taş Kordonu + Masmavi Deniz!
    const promenade = box(350, 0.22, 2.8, "#e2e8f0", { rough: 0.65, shadow: false });
    promenade.position.set(0, 0.05, 77.6);
    const sandBeach = box(680, 0.14, 7.5, "#fde68a", { rough: 0.92, shadow: false });
    sandBeach.position.set(0, -0.04, 81.2);
    const seaTex = createNoiseTexture("#0284c7", "rgba(186,230,253,0.22)", "rgba(3,105,161,0.32)", 28, 18, "world_sea_v24");
    seaWaterMat = new THREE.MeshStandardMaterial({
      map: seaTex,
      color: new THREE.Color("#0ea5e9"),
      emissive: new THREE.Color("#0369a1"),
      emissiveIntensity: 0.28,
      roughness: 0.16,
      metalness: 0.45
    });
    const seaMesh = new THREE.Mesh(new THREE.PlaneGeometry(680, 220), seaWaterMat);
    seaMesh.rotation.x = -Math.PI / 2;
    seaMesh.position.set(0, -0.05, 192);
    group.add(promenade, sandBeach, seaMesh);

    // Orta Refüj, Kuzey Orman & Güney Palmiyeli Sahil Kordonu!
    const altTints = ["#16a34a", "#15803d", "#65a30d", "#eab308"];
    const bushCols = ["#f43f5e", "#facc15", "#c084fc", "#fb923c"];
    for (let tx = -156; tx <= 156; tx += 13) {
      const idx = Math.abs(Math.round(tx));
      // Kuzey otoyolu arkası ağaçlar (Malikane tepesi önü hariç!)
      if (Math.abs(tx) > 40) {
        group.add(idx % 3 === 0 ? createBroadleafTree(tx, -72.5, 1.15, altTints[idx % 4]) : createPineTree(tx, -72.5, 1.15));
      }
      // Güney sahil kordonu palmiye ağaçları (Liman iskelesi önü hariç!)
      if (Math.abs(tx) > 50) {
        group.add(createPalmTree(tx, 78.2, 0.96));
      }
      // 1. sıra ile Orta Bulvar arası yeşil refüj (kavşaklara denk gelmesin)
      const nearAve = [-140, -84, -28, 28, 84, 140].some((ax) => Math.abs(tx - ax) < 5.5);
      if (!nearAve) {
        group.add(idx % 2 === 0 ? createBroadleafTree(tx, -0.2, 0.88, altTints[idx % 4]) : createPineTree(tx, -0.2, 0.88));
        group.add(createFlowerBush(tx + 4.2, -0.2, bushCols[idx % 4]));
      }
    }
    // Batı & Doğu dış kenar ağaçları
    for (let tz = -54; tz <= 68; tz += 11) {
      const idx = Math.abs(Math.round(tz));
      group.add(idx % 2 === 0 ? createBroadleafTree(-148, tz, 1.05, altTints[idx % 4]) : createPineTree(-148, tz, 1.05));
      group.add(idx % 2 === 1 ? createBroadleafTree(148, tz, 1.05, altTints[(idx + 1) % 4]) : createPineTree(148, tz, 1.05));
    }

    // Batı Kavşağında Merkez Taksi & Dolmuş Terminali Platformu
    const taxiPad = box(11.5, 0.2, 13.5, "#334155", { rough: 0.8, shadow: false });
    taxiPad.position.set(-140, 0.08, -26);
    const taxiBooth = box(4.2, 2.6, 3.6, "#facc15", { rough: 0.45 });
    taxiBooth.position.set(-143, 1.4, -26);
    addDetailedRoof(group, -143, 2.75, -26, 4.4, 3.8, "#0f172a", "#fde047", "TAKSİ", "#ca8a04");
    group.add(taxiPad, taxiBooth);

    // Kuzey ve Yan Ufuk Yeşil Tepeleri (Güney tarafı açık deniz manzaralı!)
    [
      [-155, -116, 28, 9.0], [-78, -138, 34, 11.5], [0, -148, 38, 12.5], [78, -138, 34, 11.5], [155, -116, 30, 9.5],
      [-192, -18, 26, 7.2], [192, 12, 28, 7.8]
    ].forEach(([hx, hz, hr, hh]) => {
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(hr, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        getMat("#1b5130", { rough: 0.95, shadow: false })
      );
      hill.scale.set(1.35, hh / hr, 1.0);
      hill.position.set(hx, -0.25, hz);
      group.add(hill);
    });
  }

  // Her Parsel İçin Komşuyla Çakışmayan Temiz Zemin Pedi + Bordür + Köşe Peyzajı!
  function addCommonEnvironment(group, theme = "station") {
    const padTexKey = `pad_${theme}`;
    const padTex =
      theme === "vip"
        ? createNoiseTexture("#dce3ec", "rgba(255,255,255,0.35)", "rgba(100,116,139,0.14)", 10, 12, padTexKey)
        : theme === "mall"
        ? createNoiseTexture("#57657a", "rgba(255,255,255,0.12)", "rgba(15,23,42,0.16)", 10, 12, padTexKey)
        : theme === "resort"
        ? createNoiseTexture("#28804a", "rgba(134,239,172,0.18)", "rgba(6,78,59,0.16)", 10, 12, padTexKey)
        : createNoiseTexture("#374357", "rgba(255,255,255,0.08)", "rgba(15,23,42,0.18)", 12, 14, padTexKey);

    const pad = box(44.4, 0.16, 52.8, "#ffffff", { map: padTex, texKey: padTexKey, rough: 0.86, shadow: false });
    pad.position.set(0, -0.02, 3.9);
    pad.receiveShadow = true;
    group.add(pad);

    // Kaldırım Bordürleri
    const curbCol = theme === "vip" ? "#f8fafc" : "#cbd5e1";
    [
      [45.0, 0.24, 0.55, 0, 0.08, 30.2],
      [0.55, 0.24, 53.2, -22.4, 0.08, 3.9],
      [0.55, 0.24, 53.2, 22.4, 0.08, 3.9]
    ].forEach(([w, h, d, x, y, z]) => {
      const m = box(w, h, d, curbCol, { rough: 0.72, shadow: false });
      m.position.set(x, y, z);
      group.add(m);
    });

    // Parsel Yan Kenar Şık Ağaç & Çiçek Çalıları (Bağlantı caddesine taşmaz!)
    const treeFn = theme === "vip" ? createPalmTree : createPineTree;
    const bushCols = ["#f43f5e", "#facc15", "#c084fc", "#fb923c"];
    [-16, 4, 24].forEach((tz, i) => {
      group.add(treeFn(-23.8, tz, 0.86));
      group.add(treeFn(23.8, tz, 0.86));
      group.add(createFlowerBush(-23.6, tz + 3.2, bushCols[i % 4]));
      group.add(createFlowerBush(23.6, tz + 3.2, bushCols[(i + 2) % 4]));
    });
  }

  // Henüz Alınmamış Komşu Arsalar İçin Şık 3D "SATILIK ARSA" Görünümü!
  function buildForSalePlot(group, title, accentCol = "#f59e0b") {
    const grassPlot = box(42.0, 0.14, 49.0, "#1f6f3f", { rough: 0.9, shadow: false });
    grassPlot.position.set(0, 0.04, 3.9);
    group.add(grassPlot);
    // 4 Kenar Ahşap/Sarı Çit
    [[42.4, 0.65, 0.25, 0, 0.4, -20.5], [42.4, 0.65, 0.25, 0, 0.4, 28.4], [0.25, 0.65, 49.0, -21.1, 0.4, 3.9], [0.25, 0.65, 49.0, 21.1, 0.4, 3.9]].forEach(([w, h, d, x, y, z]) => {
      const f = box(w, h, d, "#b45309", { rough: 0.8 });
      f.position.set(x, y, z);
      group.add(f);
    });
    // Ortada Dev 3D "SATILIK ARSA" Tabelası
    const p1 = cyl(0.18, 0.22, 4.2, 6, "#64748b", { metal: 0.5 });
    p1.position.set(-4.2, 2.1, 2);
    const p2 = cyl(0.18, 0.22, 4.2, 6, "#64748b", { metal: 0.5 });
    p2.position.set(4.2, 2.1, 2);
    const tex = createSignTexture(title || "SATILIK ARSA", "#0f172a", "#fef08a", accentCol);
    const sMat = new THREE.MeshStandardMaterial({ map: tex, emissive: new THREE.Color("#ffffff"), emissiveMap: tex, emissiveIntensity: 0.6 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(11.6, 2.8, 0.4), sMat);
    board.position.set(0, 4.4, 2);
    board.castShadow = true;
    group.add(p1, p2, board);
  }

  // =========================================================================
  // 1. ARAZİ — DETAYLI 3D İSTASYON DİORAMASI (BOŞLUKLU, TABELALI, GERÇEKÇİ!)
  // =========================================================================
  function buildStationScene(group, data, stMeta) {
    addCommonEnvironment(group, "station");

    // 1. Yaya Kaldırımı, Beyaz Yaya Geçidi (Zebra) ve Giriş/Çıkış Yol Çizgileri!
    const walkStrip = box(41.2, 0.13, 2.4, "#cbd5e1", { rough: 0.78, shadow: false });
    walkStrip.position.set(0, 0.09, to3DZ(492));
    group.add(walkStrip);

    // Market / Restoran / Motel önü beyaz yaya geçidi çizgileri
    const zebraMat = getMat("#f8fafc", { rough: 0.5, shadow: false });
    [-12, 0, 12].forEach((zx) => {
      for (let s = -1.6; s <= 1.6; s += 0.8) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 1.8), zebraMat);
        st.position.set(zx + s, 0.1, to3DZ(474));
        group.add(st);
      }
    });

    // Giriş / Çıkış sarı yön şeritleri
    [to3DX(98), to3DX(412)].forEach((lx) => {
      const stripe = box(0.24, 0.03, 10.5, "#facc15", { shadow: false });
      stripe.position.set(lx, 0.09, to3DZ(110));
      group.add(stripe);
    });

    // Otoyol Girişi Işıklı 3D Yakıt Fiyat Totemi (Canlı Fiyat + Özel Marka Adı!)
    const M23 = window.MechanicsV23;
    const brandFull = M23 ? M23.ensureV23(data).brandName : "SON İSTASYON";
    const neonObj = M23 ? M23.getNeonTheme(data) : { hex: "#facc15", glow: "#fde047", dark: "#991b1b" };

    const totemGroup = new THREE.Group();
    const tBase = box(1.8, 0.45, 1.2, "#334155");
    tBase.position.y = 0.22;
    const tTex = createTotemTexture(data);
    const tMat = new THREE.MeshStandardMaterial({
      map: tTex,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: tTex,
      emissiveIntensity: 0.65,
      roughness: 0.24
    });
    const tSide = getMat("#0f172a", { metal: 0.5, rough: 0.35 });
    const tPylon = new THREE.Mesh(new THREE.BoxGeometry(2.4, 5.2, 0.58), [tSide, tSide, tSide, tSide, tMat, tMat]);
    tPylon.position.y = 3.0;
    tPylon.castShadow = true;
    totemGroup.add(tBase, tPylon);
    totemGroup.position.set(to3DX(56), 0, to3DZ(92));
    totemGroup.rotation.y = 0.35;
    group.add(totemGroup);

    // 2. Otoyol Dev Işıklı Reklam Tabelası (Kendi Marka Adın & Neon Rengin!)
    if (data.billboardInstalled) {
      const bGroup = new THREE.Group();
      const leg1 = cyl(0.16, 0.2, 4.4, 6, "#64748b", { metal: 0.5 });
      leg1.position.set(-3.0, 2.2, 0);
      const leg2 = cyl(0.16, 0.2, 4.4, 6, "#64748b", { metal: 0.5 });
      leg2.position.set(3.0, 2.2, 0);
      const bTex = createSignTexture(`★ ${brandFull} ★`, neonObj.dark || "#991b1b", "#fef9c3", neonObj.hex);
      const bMat = new THREE.MeshStandardMaterial({ map: bTex, emissive: new THREE.Color("#ffffff"), emissiveMap: bTex, emissiveIntensity: 0.58 });
      const board = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.0, 0.42), bMat);
      board.position.set(0, 4.9, 0);
      board.castShadow = true;
      bGroup.add(leg1, leg2, board);
      bGroup.position.set(to3DX(255), 0, to3DZ(76));
      group.add(bGroup);
    }

    group.add(createStreetLamp3D(128, 93));
    group.add(createStreetLamp3D(382, 93));
    group.add(createStreetLamp3D(120, 492));
    group.add(createStreetLamp3D(360, 492));

    // 3. 3D Yakıt Silosu + Canlı Seviye Çubuğu
    const tankX = to3DX(stMeta.TANK_POS.x);
    const tankZ = to3DZ(stMeta.TANK_POS.y);
    const tankBase = box(4.0, 0.3, 6.0, "#1e293b");
    tankBase.position.set(tankX, 0.16, tankZ);
    group.add(tankBase);
    // Yakıt Silosu Koruma Dubaları (Sarı-Siyah Güvenlik Bariyerleri!)
    [[-1.85, -2.8], [1.85, -2.8], [-1.85, 2.8], [1.85, 2.8]].forEach(([bx, bz]) => {
      const bol = cyl(0.14, 0.15, 0.95, 8, "#facc15", { rough: 0.35 });
      bol.position.set(tankX + bx, 0.52, tankZ + bz);
      const tip = cyl(0.15, 0.15, 0.22, 8, "#0f172a");
      tip.position.set(tankX + bx, 0.88, tankZ + bz);
      group.add(bol, tip);
    });
    // Gerçekçi Hafif Lastik İzi Sürüş Koridoru (Otoyol Girişinden Pompalara!)
    const trackMat = getMat("#1e293b", { op: 0.22, rough: 0.92, shadow: false });
    [[-0.7, 0], [0.7, 0]].forEach(([ox]) => {
      const trV = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 22), trackMat);
      trV.rotation.x = -Math.PI / 2;
      trV.position.set(to3DX(98) + ox, 0.085, to3DZ(165));
      group.add(trV);
    });
    const silo = cyl(1.25, 1.25, 5.0, 16, "#e2e8f0", { metal: 0.5, rough: 0.28 });
    silo.position.set(tankX, 2.7, tankZ);
    group.add(silo);
    const band = cyl(1.28, 1.28, 0.85, 16, "#ef4444");
    band.position.set(tankX, 3.6, tankZ);
    group.add(band);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1.25, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), getMat("#cbd5e1", { metal: 0.5 }));
    cap.position.set(tankX, 5.2, tankZ);
    group.add(cap);
    const gauge = box(0.42, 3.8, 0.42, "#22c55e", { emissive: "#4ade80", emInt: 0.9 });
    gauge.position.set(tankX + 1.32, 2.5, tankZ);
    animRefs.fuelFillMesh = gauge;
    group.add(gauge);

    // 4. 9 Adet 3D Yakıt Pompası + Şık İnce Neon Kanopiler
    stMeta.PUMPS.forEach((p, idx) => {
      const px = to3DX(p.x);
      const pz = to3DZ(p.y);
      const unlocked = idx < data.pumpsUnlocked;
      const isVip = !!p.isVip;

      if (!unlocked) {
        const slot = box(4.0, 0.12, 4.8, "#1e293b", { op: 0.55 });
        slot.position.set(px, 0.08, pz + 1.0);
        group.add(slot);
        return;
      }

      const island = box(4.2, 0.28, 1.2, "#cbd5e1");
      island.position.set(px, 0.16, pz);
      // Pompa Adası Koruyucu Sarı Çelik Dubalar
      const bL = cyl(0.11, 0.12, 0.78, 8, "#facc15", { rough: 0.35 });
      bL.position.set(px - 2.02, 0.45, pz);
      const bR = cyl(0.11, 0.12, 0.78, 8, "#facc15", { rough: 0.35 });
      bR.position.set(px + 2.02, 0.45, pz);
      group.add(island, bL, bR);

      const pumpBody = box(1.2, 1.65, 0.8, isVip ? "#eab308" : "#ef4444", { metal: 0.25, rough: 0.32 });
      pumpBody.position.set(px, 1.08, pz);
      const screen = box(0.85, 0.48, 0.86, "#e0f2fe", { emissive: "#38bdf8", emInt: 0.8 });
      screen.position.set(px, 1.45, pz);
      group.add(pumpBody, screen);

      const p1 = cyl(0.11, 0.13, 3.5, 8, "#e2e8f0", { metal: 0.5 });
      p1.position.set(px - 1.7, 1.85, pz);
      const p2 = cyl(0.11, 0.13, 3.5, 8, "#e2e8f0", { metal: 0.5 });
      p2.position.set(px + 1.7, 1.85, pz);
      group.add(p1, p2);

      const canopy = box(4.8, 0.36, 3.2, isVip ? "#92400e" : "#1e293b", { metal: 0.35, rough: 0.3 });
      canopy.position.set(px, 3.7, pz + 0.3);
      const neonStrip = box(4.92, 0.15, 3.32, isVip ? "#fde047" : neonObj.hex, {
        emissive: isVip ? "#facc15" : neonObj.hex,
        emInt: 1.25
      });
      neonStrip.position.set(px, 3.54, pz + 0.3);
      // Kanopi altı sıcak LED aydınlatma + yer ışık halesi
      const underGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(4.2, 2.6),
        getMat("#fef9c3", { emissive: "#fef08a", emInt: 0.45, op: 0.12, shadow: false })
      );
      underGlow.rotation.x = -Math.PI / 2;
      underGlow.position.set(px, 0.09, pz + 0.6);
      group.add(canopy, neonStrip, underGlow);
    });

    // 5. 🔵 3D LPG Adası
    if (data.lpgUnlocked) {
      const lx = to3DX(stMeta.LPG_POS.x);
      const lz = to3DZ(stMeta.LPG_POS.y);
      const tx = to3DX(stMeta.LPG_POS.tankX);
      const tz = to3DZ(stMeta.LPG_POS.tankY);

      const lpgTank = cyl(0.92, 0.92, 4.0, 14, "#f8fafc", { metal: 0.35, rough: 0.22 });
      lpgTank.rotation.x = Math.PI / 2;
      lpgTank.position.set(tx, 1.15, tz);
      const band = cyl(0.96, 0.96, 1.1, 14, "#0284c7", { emissive: "#0284c7", emInt: 0.35 });
      band.rotation.x = Math.PI / 2;
      band.position.set(tx, 1.15, tz);
      group.add(lpgTank, band);

      const lpgCan = box(4.4, 0.34, 2.9, "#0284c7", { emissive: "#0284c7", emInt: 0.4 });
      lpgCan.position.set(lx, 3.55, lz + 0.3);
      const lp1 = cyl(0.11, 0.11, 3.4, 6, "#e2e8f0");
      lp1.position.set(lx - 1.6, 1.75, lz);
      const lp2 = cyl(0.11, 0.11, 3.4, 6, "#e2e8f0");
      lp2.position.set(lx + 1.6, 1.75, lz);
      group.add(lpgCan, lp1, lp2);
    }

    // 6. 🚌 Otobüs Peronu & 🥖 Taş Fırın
    if (data.busBakeryUnlocked) {
      const b = stMeta.BUS_BAY_POS;
      const bx = to3DX(b.x + b.w - 32);
      const bz = to3DZ(b.y + b.h / 2);
      const oven = box(4.8, 2.3, 2.7, "#8a3717", { rough: 0.85 });
      oven.position.set(bx, 1.15, bz);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), getMat("#b45309", { rough: 0.78 }));
      dome.position.set(bx - 0.9, 2.3, bz);
      const fire = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 8, 8),
        getMat("#f97316", { emissive: "#fb923c", emInt: 1.8, shadow: false })
      );
      fire.position.set(bx - 0.9, 0.7, bz + 1.25);
      animRefs.fireMesh = fire;
      group.add(oven, dome, fire);
    }

    // 7. Band 3 — 5 Servis Binası (Aralarında TEMİZ BOŞLUKLAR + Parapet + 3D Tabelalar!)
    const addServiceBay3D = (b, unlocked, wallCol, roofCol, accentCol, label, type) => {
      const cx = to3DX(b.x + b.w / 2);
      const cz = to3DZ(b.y + b.h / 2);
      const bw = b.w * SCALE - 1.1; // Binalar arasında nefes alan boşluk!
      const bd = b.h * SCALE - 1.0;
      if (!unlocked) {
        const plot = box(bw, 0.14, bd, "#1e293b", { op: 0.55 });
        plot.position.set(cx, 0.08, cz);
        group.add(plot);
        return;
      }
      const floor = box(bw + 0.3, 0.16, bd + 0.3, "#1e293b", { shadow: false });
      floor.position.set(cx, 0.08, cz);
      group.add(floor);

      const bayH = 2.65;
      const lw = box(0.38, bayH, bd, wallCol, { rough: 0.6 });
      lw.position.set(cx - bw / 2 + 0.2, bayH / 2 + 0.1, cz);
      const rw = box(0.38, bayH, bd, wallCol, { rough: 0.6 });
      rw.position.set(cx + bw / 2 - 0.2, bayH / 2 + 0.1, cz);
      group.add(lw, rw);

      addDetailedRoof(group, cx, bayH + 0.2, cz, bw, bd, roofCol, accentCol, label, wallCol);

      if (type === "ev") {
        const ch = box(0.62, 2.0, 0.62, "#e0f2fe", { emissive: "#22d3ee", emInt: 1.05 });
        ch.position.set(cx - bw / 2 + 0.95, 1.05, cz);
        const evPad = box(bw - 1.5, 0.05, bd - 1.5, "#10b981", { emissive: "#059669", emInt: 0.35, shadow: false });
        evPad.position.set(cx, 0.18, cz);
        group.add(ch, evPad);
      } else if (type === "wash") {
        // Oto Yıkama Dönen Köpüklü Mavi Fırça Silindirleri!
        [-bw * 0.25, bw * 0.25].forEach((ox) => {
          const roller = cyl(0.55, 0.55, 2.1, 10, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.45, rough: 0.55 });
          roller.position.set(cx + ox, 1.25, cz);
          const core = cyl(0.16, 0.16, 2.35, 6, "#e2e8f0", { metal: 0.6 });
          core.position.set(cx + ox, 1.25, cz);
          group.add(roller, core);
          animRefs.washRollers.push(roller);
        });
      } else if (type === "garage") {
        // Tamirhane Sarı Hidrolik Lift Direkleri + Kırmızı Alet Dolabı!
        [-bw * 0.28, bw * 0.28].forEach((ox) => {
          const lift = box(0.28, 2.2, 0.28, "#facc15", { metal: 0.45 });
          lift.position.set(cx + ox, 1.15, cz);
          group.add(lift);
        });
        const chest = box(0.85, 0.95, 0.55, "#dc2626", { metal: 0.35 });
        chest.position.set(cx, 0.55, cz + bd * 0.34);
        group.add(chest);
      } else if (type === "scale") {
        const plate = box(bw - 1.2, 0.22, bd - 1.4, "#facc15", { metal: 0.45 });
        plate.position.set(cx, 0.18, cz);
        group.add(plate);
      }
    };

    addServiceBay3D(stMeta.EV_POS, data.evUnlocked, "#0c4a6e", "#1e293b", "#22d3ee", "⚡ EV", "ev");
    addServiceBay3D(stMeta.WASH_POS, data.carWashUnlocked, "#0369a1", "#1e293b", "#38bdf8", "🚿 YIKAMA", "wash");
    addServiceBay3D(stMeta.GARAGE_POS, data.garageUnlocked, "#4c1d95", "#1e293b", "#c084fc", "🔧 TAMİR", "garage");
    addServiceBay3D(stMeta.TOW_POS, data.towUnlocked, "#92400e", "#1e293b", "#f59e0b", "🚜 ÇEKİCİ", "tow");
    addServiceBay3D(stMeta.SCALE_POS, data.scaleUnlocked, "#78350f", "#1e293b", "#facc15", "⚖️ KANTAR", "scale");

    // 8. Band 4 — 3D Market, Restoran ve Mini Motel (Işıklı Cam Vitrinler + İç Kasa/Oda Işıkları + Taş Meydan!)
    const patioTex = createPaverTexture("#475569", "rgba(15,23,42,0.38)", 16, 4, "station_front_patio");
    const patioFloor = box(40.8, 0.11, 12.2, "#ffffff", { map: patioTex, texKey: "station_front_patio", rough: 0.8, shadow: false });
    patioFloor.position.set(0, 0.075, to3DZ(526));
    patioFloor.receiveShadow = true;
    group.add(patioFloor);

    const buildFrontBuilding = (b, unlocked, wallHex, roofCol, neonCol, title, kind) => {
      const cx = to3DX(b.x + b.w / 2);
      const cz = to3DZ(b.y + b.h / 2);
      const bw = b.w * SCALE - 1.4; // Binalar bitişik yapışmaz, aralarında şık yol görünür!
      const bd = b.h * SCALE - 1.4;
      if (!unlocked) {
        const plot = box(bw, 0.14, bd, "#1e293b", { op: 0.55 });
        plot.position.set(cx, 0.08, cz);
        group.add(plot);
        return;
      }
      const bh = kind === "motel" ? 4.9 : 3.5;
      const winTex = createWindowFacadeTexture(wallHex, "#1e293b", "#fde68a", 4, kind === "motel" ? 2 : 1, true);
      const sideMat = getMat(wallHex, { rough: 0.68 });
      const frontMat = new THREE.MeshStandardMaterial({
        map: winTex,
        emissive: new THREE.Color("#fde047"),
        emissiveMap: winTex,
        emissiveIntensity: 0.25,
        roughness: 0.38
      });

      const mats = [sideMat, sideMat, sideMat, sideMat, frontMat, frontMat];
      const body = new THREE.Mesh(getBoxGeo(bw, bh, bd), mats);
      body.position.set(cx, bh / 2 + 0.1, cz);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // v27.0 Ön Cephe Şeffaf Işıklı Cam Vitrin & İç Kasa Görünümü (Müşteri Girince Parlar!)
      const frontZ = cz - bd / 2;
      const frame = box(bw * 0.78, 2.25, 0.18, "#0f172a", { metal: 0.6, rough: 0.3 });
      frame.position.set(cx, 1.25, frontZ - 0.06);
      const intMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#bae6fd"),
        emissive: new THREE.Color("#fde68a"),
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.45
      });
      const showcase = new THREE.Mesh(getBoxGeo(bw * 0.72, 1.95, 0.22), intMat);
      showcase.position.set(cx, 1.25, frontZ - 0.08);
      // Vitrin önü iç kasa/tezgah silüeti ve kapı paspası
      const counter = box(bw * 0.32, 0.78, 0.28, neonCol, { rough: 0.45 });
      counter.position.set(cx - bw * 0.16, 0.52, frontZ - 0.12);
      const doorMat = box(1.8, 0.05, 0.95, "#1e293b", { rough: 0.9, shadow: false });
      doorMat.position.set(cx + bw * 0.12, 0.14, frontZ - 0.55);
      group.add(frame, showcase, counter, doorMat);

      if (kind === "market") animRefs.marketInteriorMat = intMat;
      if (kind === "restaurant") animRefs.restInteriorMat = intMat;

      addDetailedRoof(group, cx, bh + 0.22, cz, bw, bd, roofCol, neonCol, title, wallHex);

      if (kind === "market") {
        // Market önü içecek soğutucu dolabı + dondurma dolabı + çiçek saksıları!
        const cooler = box(0.95, 1.55, 0.65, "#e0f2fe", { emissive: "#38bdf8", emInt: 0.65 });
        cooler.position.set(cx + bw * 0.36, 0.85, frontZ - 0.38);
        const iceBox = box(1.15, 0.75, 0.62, "#ef4444", { rough: 0.4 });
        iceBox.position.set(cx - bw * 0.34, 0.48, frontZ - 0.38);
        group.add(cooler, iceBox, createFlowerBush(cx - bw * 0.42, frontZ - 0.85, "#facc15"));
        if (data.solarInstalled) {
          for (let sx = -2.4; sx <= 2.4; sx += 2.4) {
            const panel = box(1.9, 0.12, 2.8, "#0284c7", { metal: 0.78, rough: 0.16, emissive: "#0369a1", emInt: 0.35 });
            panel.position.set(cx + sx, bh + 0.72, cz + 0.6);
            panel.rotation.x = 0.22;
            group.add(panel);
          }
        }
      }
      if (kind === "restaurant") {
        for (let i = 0; i < 6; i++) {
          const aw = box((bw - 0.6) / 6, 0.22, 1.35, i % 2 === 0 ? "#dc2626" : "#f8fafc");
          aw.position.set(cx - (bw - 0.6) / 2 + ((bw - 0.6) / 6) * (i + 0.5), 2.6, frontZ - 0.58);
          aw.rotation.x = 0.32;
          group.add(aw);
        }
        // Restoran önü açık hava kafe masaları & kırmızı-beyaz şemsiyeler!
        [-2.8, 2.8].forEach((ox) => {
          const tbl = cyl(0.58, 0.58, 0.08, 10, "#f8fafc");
          tbl.position.set(cx + ox, 0.72, frontZ - 1.55);
          const leg = cyl(0.06, 0.08, 1.9, 6, "#cbd5e1");
          leg.position.set(cx + ox, 1.0, frontZ - 1.55);
          const umb = new THREE.Mesh(
            new THREE.ConeGeometry(1.18, 0.46, 8),
            getMat("#ef4444", { rough: 0.52 })
          );
          umb.position.set(cx + ox, 2.08, frontZ - 1.55);
          umb.castShadow = true;
          group.add(tbl, leg, umb);
        });
        // Çatı tuğla bacası
        const chim = box(0.95, 1.5, 0.95, "#9a3412", { rough: 0.85 });
        chim.position.set(cx + bw * 0.32, bh + 0.9, cz + bd * 0.22);
        group.add(chim);
      }
      if (kind === "motel") {
        // v27.0 Motel 2. Kat 4 Bağımsız Oda Penceresi (Dolu Oda Kadar Pencere Sıcak Sarı Yanar!)
        for (let ri = 0; ri < 4; ri++) {
          const rMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1e293b"),
            emissive: new THREE.Color("#0284c7"),
            emissiveIntensity: 0.25,
            roughness: 0.25,
            metalness: 0.4
          });
          const rx = cx - bw * 0.33 + ri * (bw * 0.22);
          const winMesh = new THREE.Mesh(getBoxGeo(bw * 0.16, 1.05, 0.22), rMat);
          winMesh.position.set(rx, 3.55, frontZ - 0.08);
          const sill = box(bw * 0.18, 0.12, 0.32, "#cbd5e1");
          sill.position.set(rx, 2.98, frontZ - 0.12);
          group.add(winMesh, sill);
          animRefs.motelRoomMats.push(rMat);
        }
        // Motel çatı uydu çanağı + çiçekler
        const dishPole = cyl(0.08, 0.1, 1.1, 6, "#cbd5e1", { metal: 0.6 });
        dishPole.position.set(cx + bw * 0.3, bh + 0.75, cz + bd * 0.22);
        const dish = new THREE.Mesh(
          new THREE.SphereGeometry(0.68, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.45),
          getMat("#f1f5f9", { metal: 0.5, rough: 0.3 })
        );
        dish.position.set(cx + bw * 0.3, bh + 1.35, cz + bd * 0.22);
        dish.rotation.x = -0.65;
        group.add(dishPole, dish, createFlowerBush(cx - bw * 0.38, frontZ - 0.55, "#f472b6"));
      }
    };

    const brandShort = M23 ? M23.getBrandShort(data) : "SON";
    buildFrontBuilding(stMeta.MARKET_POS, true, "#57321d", "#293548", neonObj.hex, `${brandShort} MARKET`, "market");
    buildFrontBuilding(stMeta.RESTAURANT_POS, data.restaurantUnlocked, "#6c2310", "#3b1c14", "#fb923c", "RESTORAN", "restaurant");
    buildFrontBuilding(stMeta.MOTEL_POS, data.motelUnlocked, "#4a1942", "#2d1444", "#f472b6", "MİNİ MOTEL", "motel");
  }

  // =========================================================================
  // 2. ARAZİ — DETAYLI 3D OTOPARK, FİSKİYE, CAM KUBBELİ AVM & GÖKDELEN PLAZA
  // =========================================================================
  function buildLand2Scene(group, data) {
    addCommonEnvironment(group, "mall");
    const emp = data.empire;
    if (!emp.land2Owned) {
      buildForSalePlot(group, "2. ARAZİ • SATILIK", "#38bdf8");
      return;
    }

    if (emp.parkingUnlocked) {
      const pTex = createNoiseTexture("#263042", "rgba(255,255,255,0.08)", "rgba(0,0,0,0.18)", 12, 6, "park_asphalt");
      const pFloor = box(38.4, 0.14, 16.8, "#ffffff", { map: pTex, texKey: "park_asphalt", rough: 0.86, shadow: false });
      pFloor.position.set(0, 0.12, to3DZ(196));
      pFloor.receiveShadow = true;
      group.add(pFloor);

      const lineMat = getMat("#f8fafc", { shadow: false });
      for (let col = 0; col <= 10; col++) {
        const lx = to3DX(64 + col * 34);
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 3.5), lineMat);
        l1.position.set(lx, 0.2, to3DZ(147));
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 3.5), lineMat);
        l2.position.set(lx, 0.2, to3DZ(239));
        group.add(l1, l2);
      }

      const makeGate = (gx, gz, col) => {
        const booth = box(2.3, 2.3, 1.9, "#1e293b");
        booth.position.set(gx, 1.15, gz);
        const roof = box(2.7, 0.32, 2.3, col, { emissive: col, emInt: 0.6 });
        roof.position.set(gx, 2.45, gz);
        group.add(booth, roof);
        const pivot = new THREE.Group();
        pivot.position.set(gx + 1.25, 1.05, gz + 0.5);
        const arm = box(3.3, 0.2, 0.2, "#ef4444");
        arm.position.set(1.65, 0, 0);
        pivot.add(arm);
        group.add(pivot);
        return pivot;
      };
      animRefs.entryBarrier = makeGate(to3DX(74), to3DZ(98), "#22c55e");
      animRefs.exitBarrier = makeGate(to3DX(378), to3DZ(98), "#f59e0b");
    } else {
      const pPlot = box(38.4, 0.12, 16.8, "#1e293b", { op: 0.55 });
      pPlot.position.set(0, 0.08, to3DZ(196));
      group.add(pPlot);
    }

    // Mermer Süs Havuzu & Fıskiye
    const fz = to3DZ(303);
    const basin = cyl(3.4, 3.7, 0.72, 20, "#f1f5f9", { rough: 0.35 });
    basin.position.set(0, 0.38, fz);
    const water = cyl(3.0, 3.0, 0.64, 20, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.6, rough: 0.1 });
    water.position.set(0, 0.48, fz);
    const jet = cyl(0.24, 0.52, 2.1, 10, "#e0f2fe", { emissive: "#bae6fd", emInt: 0.9, op: 0.85 });
    jet.position.set(0, 1.65, fz);
    animRefs.fountainRings = [jet];
    group.add(basin, water, jet);

    // Meydan çiçek saksıları
    [[-6.8, fz], [6.8, fz], [-11, fz - 3], [11, fz - 3]].forEach(([px, pz], i) => {
      group.add(createFlowerBush(px, pz, i % 2 === 0 ? "#facc15" : "#f43f5e"));
    });

    group.add(createStreetLamp3D(64, 294));
    group.add(createStreetLamp3D(416, 294));

    // 3D OTOYOL GRAND AVM (Dokulu Vitrin Cepheli + Cam Kubbeli!)
    if (emp.mallUnlocked) {
      const mx = to3DX(174);
      const mz = to3DZ(456);
      const mw = 23.0;
      const md = 24.0;
      const mallTex = createWindowFacadeTexture("#1e293b", "#0ea5e9", "#fde68a", 6, 2);
      const mallMat = new THREE.MeshStandardMaterial({
        map: mallTex,
        emissive: new THREE.Color("#fde047"),
        emissiveMap: mallTex,
        emissiveIntensity: 0.25,
        roughness: 0.35,
        metalness: 0.3
      });
      const mallBase = new THREE.Mesh(new THREE.BoxGeometry(mw, 5.8, md), mallMat);
      mallBase.position.set(mx, 2.95, mz);
      mallBase.castShadow = true;
      mallBase.receiveShadow = true;
      group.add(mallBase);

      const M23 = window.MechanicsV23;
      const bShort2 = M23 ? M23.getBrandShort(data) : "OTOYOL";
      const neon2 = M23 ? M23.getNeonTheme(data).hex : "#f59e0b";
      addDetailedRoof(group, mx, 5.95, mz, mw, md, "#1e293b", neon2, `${bShort2} GRAND AVM`, "#7c2d12");

      const portico = box(6.8, 3.2, 2.0, "#991b1b", { emissive: "#dc2626", emInt: 0.4 });
      portico.position.set(mx, 1.6, mz - md / 2 - 0.8);
      group.add(portico);

      const dome = new THREE.Mesh(
        new THREE.CylinderGeometry(5.2, 5.2, 15.5, 16, 1, false, 0, Math.PI),
        getMat("#38bdf8", { emissive: "#0ea5e9", emInt: 0.55, metal: 0.6, rough: 0.14, op: 0.88 })
      );
      dome.rotation.z = Math.PI / 2;
      dome.rotation.y = Math.PI / 2;
      dome.position.set(mx, 6.15, mz + 0.6);
      group.add(dome);
    } else {
      const mPlot = box(22.4, 0.14, 23.4, "#1e293b", { op: 0.55 });
      mPlot.position.set(to3DX(174), 0.08, to3DZ(456));
      group.add(mPlot);
    }

    const logLvl = emp.sideLevels.logistics || 0;
    if (logLvl > 0) {
      const lx = to3DX(370);
      const lz = to3DZ(388);
      const lh = 3.0 + logLvl * 0.5;
      const wh = box(10.8, lh, 10.8, "#065f46", { rough: 0.65 });
      wh.position.set(lx, lh / 2 + 0.1, lz);
      group.add(wh);
      addDetailedRoof(group, lx, lh + 0.2, lz, 10.8, 10.8, "#1e293b", "#34d399", "LOJİSTİK", "#064e3b");
    } else {
      const lPlot = box(10.6, 0.14, 10.6, "#1e293b", { op: 0.55 });
      lPlot.position.set(to3DX(370), 0.08, to3DZ(388));
      group.add(lPlot);
    }

    const offLvl = emp.sideLevels.office || 0;
    if (offLvl > 0) {
      const ox = to3DX(370);
      const oz = to3DZ(524);
      const oh = 5.5 + offLvl * 2.0;
      const plazaTex = createWindowFacadeTexture("#0f172a", "#0369a1", "#7dd3fc", 5, 4);
      const pMat = new THREE.MeshStandardMaterial({
        map: plazaTex,
        emissive: new THREE.Color("#38bdf8"),
        emissiveMap: plazaTex,
        emissiveIntensity: 0.35,
        metalness: 0.65,
        roughness: 0.2
      });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(10.4, oh, 10.4), pMat);
      tower.position.set(ox, oh / 2 + 0.1, oz);
      tower.castShadow = true;
      group.add(tower);
      addDetailedRoof(group, ox, oh + 0.2, oz, 10.4, 10.4, "#0f172a", "#38bdf8", "PLAZA", "#1e3a8a");
      const hRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.2, 8, 22),
        getMat("#facc15", { emissive: "#fde047", emInt: 1.0 })
      );
      hRing.rotation.x = Math.PI / 2;
      hRing.position.set(ox, oh + 0.5, oz + 0.6);
      group.add(hRing);
    } else {
      const oPlot = box(10.2, 0.14, 10.2, "#1e293b", { op: 0.55 });
      oPlot.position.set(to3DX(370), 0.08, to3DZ(524));
      group.add(oPlot);
    }
  }

  // =========================================================================
  // 3. ARAZİ — 3D GO-KART, DÖNEN DÖNME DOLAP, RAFİNERİ & TERMAL BUNGALOVLAR
  // =========================================================================
  function buildLand3Scene(group, data) {
    addCommonEnvironment(group, "resort");
    const l3 = data.empire.land3;
    if (!l3 || !l3.owned) {
      buildForSalePlot(group, "3. ARAZİ • SATILIK", "#a855f7");
      return;
    }

    if (l3.themeUnlocked) {
      const trackOuter = cyl(6.6, 6.6, 0.22, 24, "#1e293b", { shadow: false });
      trackOuter.scale.set(1.15, 1, 0.82);
      trackOuter.position.set(to3DX(122), 0.16, to3DZ(194));
      const trackInner = cyl(4.0, 4.0, 0.28, 20, "#22c55e", { shadow: false });
      trackInner.scale.set(1.15, 1, 0.82);
      trackInner.position.set(to3DX(122), 0.18, to3DZ(194));
      // Kırmızı-beyaz Go-Kart yarış bordürleri
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        const kb = box(0.9, 0.22, 0.35, i % 2 === 0 ? "#ef4444" : "#f8fafc", { shadow: false });
        kb.position.set(to3DX(122) + Math.cos(a) * 7.6, 0.2, to3DZ(194) + Math.sin(a) * 5.4);
        kb.rotation.y = -a + Math.PI / 2;
        group.add(kb);
      }
      group.add(trackOuter, trackInner);

      const wx = to3DX(212);
      const wz = to3DZ(258);
      const wr = 5.4;
      const legL = cyl(0.22, 0.32, 8.2, 6, "#e2e8f0", { metal: 0.6 });
      legL.position.set(wx - 1.8, 4.0, wz);
      legL.rotation.z = -0.22;
      const legR = cyl(0.22, 0.32, 8.2, 6, "#e2e8f0", { metal: 0.6 });
      legR.position.set(wx + 1.8, 4.0, wz);
      legR.rotation.z = 0.22;
      group.add(legL, legR);

      const wheelHub = new THREE.Group();
      wheelHub.position.set(wx, 7.6, wz);
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(wr, 0.22, 8, 28),
        getMat("#fde047", { emissive: "#facc15", emInt: 1.0, metal: 0.4 })
      );
      const innerRim = new THREE.Mesh(
        new THREE.TorusGeometry(wr * 0.72, 0.12, 6, 24),
        getMat("#f472b6", { emissive: "#ec4899", emInt: 0.9 })
      );
      const centerStar = cyl(0.95, 0.95, 0.45, 10, "#fef08a", { emissive: "#facc15", emInt: 1.4 });
      centerStar.rotation.x = Math.PI / 2;
      wheelHub.add(rim, innerRim, centerStar);

      const cabinCols = ["#ef4444", "#38bdf8", "#4ade80", "#f472b6", "#facc15", "#a855f7", "#fb923c", "#2dd4bf"];
      animRefs.ferrisCabins = [];
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        const spoke = box(0.12, wr * 2, 0.12, "#e2e8f0");
        spoke.rotation.z = ang;
        wheelHub.add(spoke);
        const cabHolder = new THREE.Group();
        cabHolder.position.set(Math.cos(ang) * wr, Math.sin(ang) * wr, 0);
        const cab = box(1.2, 1.35, 1.3, cabinCols[i], { emissive: cabinCols[i], emInt: 0.35 });
        cabHolder.add(cab);
        wheelHub.add(cabHolder);
        animRefs.ferrisCabins.push(cabHolder);
      }
      animRefs.ferrisWheel = wheelHub;
      group.add(wheelHub);
    } else {
      const thPlot = box(16.5, 0.14, 14.5, "#1e293b", { op: 0.55 });
      thPlot.position.set(to3DX(150), 0.08, to3DZ(210));
      group.add(thPlot);
    }

    const fx = to3DX(346);
    const fz = to3DZ(219);
    const flPad = box(16.2, 0.16, 22.4, "#334155", { shadow: false });
    flPad.position.set(fx, 0.1, fz);
    group.add(flPad);

    if (l3.refineryUnlocked) {
      [fx - 3.5, fx + 3.5].forEach((sx) => {
        const tank = cyl(2.3, 2.3, 5.0, 18, "#e2e8f0", { metal: 0.65, rough: 0.24 });
        tank.position.set(sx, 2.7, to3DZ(164));
        group.add(tank);
      });
      const pipe = cyl(0.3, 0.3, 7.0, 8, "#facc15", { metal: 0.5 });
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(fx, 4.3, to3DZ(164));
      const stack = cyl(0.45, 0.65, 8.2, 10, "#94a3b8", { metal: 0.5 });
      stack.position.set(fx, 4.2, to3DZ(142));
      group.add(pipe, stack);
    }

    if (l3.resortUnlocked) {
      const rz = to3DZ(469);
      const deck = box(14.0, 0.26, 16.4, "#a16207", { rough: 0.78 });
      deck.position.set(0, 0.16, rz);
      const pool = box(10.8, 0.3, 13.8, "#38bdf8", { emissive: "#0284c7", emInt: 0.6, rough: 0.1 });
      pool.position.set(0, 0.2, rz);
      group.add(deck, pool);

      [[-6.2, rz - 4], [6.2, rz - 4], [-6.2, rz + 4], [6.2, rz + 4]].forEach(([ux, uz], idx) => {
        const pole = cyl(0.08, 0.08, 2.4, 6, "#f8fafc");
        pole.position.set(ux, 1.2, uz);
        const top = new THREE.Mesh(
          new THREE.ConeGeometry(1.5, 0.65, 8),
          getMat(idx % 2 === 0 ? "#f43f5e" : "#facc15", { rough: 0.6 })
        );
        top.position.set(ux, 2.5, uz);
        top.castShadow = true;
        group.add(pole, top);
      });

      ["b1", "b2", "b3", "b4", "b5", "b6"].forEach((bk, idx) => {
        const st = l3.bungalows && l3.bungalows[bk];
        if (!st || !st.owned) return;
        const isLeft = idx < 3;
        const row = idx % 3;
        const bx = isLeft ? to3DX(106) : to3DX(374);
        const bz = to3DZ(404 + row * 56);
        const base = box(6.6, 0.38, 4.3, "#78350f");
        base.position.set(bx, 0.24, bz);
        const roof = new THREE.Mesh(
          new THREE.CylinderGeometry(2.4, 2.4, 6.0, 3),
          getMat("#92400e", { rough: 0.76 })
        );
        roof.rotation.z = Math.PI / 2;
        roof.position.set(bx, 1.85, bz);
        roof.castShadow = true;
        const glass = box(0.28, 2.0, 2.9, st.rented ? "#fde047" : "#334155", {
          emissive: st.rented ? "#facc15" : "#000000",
          emInt: st.rented ? 0.95 : 0
        });
        glass.position.set(bx + (isLeft ? 3.05 : -3.05), 1.4, bz);
        group.add(base, roof, glass);
      });
    } else {
      const rsPlot = box(34.0, 0.14, 16.5, "#1e293b", { op: 0.55 });
      rsPlot.position.set(0, 0.08, to3DZ(469));
      group.add(rsPlot);
    }
  }

  // =========================================================================
  // 4.–10. ARAZİLER — 6 İKONİK ÇOK KATLI 3D MEGA PROJE
  // =========================================================================
  function buildExtraLandScene(group, data, landId) {
    addCommonEnvironment(group, "vip");
    const st = data.empire.extraLands && data.empire.extraLands[landId];
    animRefs.hotelRoomMeshes = [];

    if (!st || !st.owned) {
      const lNum = landId.replace("land", "");
      buildForSalePlot(group, `${lNum}. ARAZİ • SATILIK`, "#facc15");
      return;
    }

    const fcTex = createNoiseTexture("#2b3547", "rgba(255,255,255,0.08)", "rgba(0,0,0,0.16)", 10, 4, "vip_drive");
    const forecourt = box(35, 0.14, 12.5, "#ffffff", { map: fcTex, texKey: "vip_drive", rough: 0.82, shadow: false });
    forecourt.position.set(0, 0.1, to3DZ(175));
    const carpet = box(6.6, 0.18, 6.2, "#dc2626", { emissive: "#991b1b", emInt: 0.35 });
    carpet.position.set(0, 0.14, to3DZ(222));
    // Lüks Mermer Giriş Saçağı (Porte-Cochère) & Sütunlar!
    const pcRoof = box(8.6, 0.42, 4.4, "#f8fafc", { rough: 0.35 });
    pcRoof.position.set(0, 3.4, to3DZ(240));
    const pcTrim = box(8.8, 0.18, 4.6, "#facc15", { emissive: "#eab308", emInt: 0.65 });
    pcTrim.position.set(0, 3.16, to3DZ(240));
    [-3.6, 3.6].forEach((px) => {
      const col = cyl(0.32, 0.38, 3.3, 10, "#f8fafc", { rough: 0.3 });
      col.position.set(px, 1.65, to3DZ(226));
      group.add(col);
    });
    group.add(forecourt, carpet, pcRoof, pcTrim);

    group.add(createStreetLamp3D(76, 128));
    group.add(createStreetLamp3D(404, 128));

    if (!st.projectKey) {
      const site = box(28, 0.36, 22, "#475569");
      site.position.set(0, 0.22, to3DZ(416));
      group.add(site);
      return;
    }

    const floors = st.floorsLvl || 1;
    const cx = 0;
    const cz = to3DZ(420);
    const totalH = 4.2 + floors * 3.0;

    if (st.projectKey === "stadium") {
      const pitch = box(24, 0.25, 16, "#16a34a", { rough: 0.85, shadow: false });
      pitch.position.set(cx, 0.22, cz);
      const midLine = box(0.25, 0.28, 15.6, "#ffffff", { shadow: false });
      midLine.position.set(cx, 0.23, cz);
      group.add(pitch, midLine);
      const standH = 2.8 + floors * 1.1;
      [
        [32, standH, 4.2, cx, standH / 2, cz - 10.2],
        [32, standH, 4.2, cx, standH / 2, cz + 10.2],
        [4.2, standH, 24.4, cx - 14.2, standH / 2, cz],
        [4.2, standH, 24.4, cx + 14.2, standH / 2, cz]
      ].forEach(([w, h, d, x, y, z]) => {
        const stand = box(w, h, d, "#065f46", { rough: 0.65 });
        stand.position.set(x, y, z);
        const rim = box(w + 0.3, 0.45, d + 0.3, "#4ade80", { emissive: "#22c55e", emInt: 0.7 });
        rim.position.set(x, h + 0.2, z);
        group.add(stand, rim);
      });
      [[-15.5, -11.5], [15.5, -11.5], [-15.5, 11.5], [15.5, 11.5]].forEach(([px, pz]) => {
        const pylon = cyl(0.3, 0.45, standH + 7, 8, "#cbd5e1", { metal: 0.6 });
        pylon.position.set(cx + px, (standH + 7) / 2, cz + pz);
        const lampHead = box(2.4, 1.2, 0.9, "#fef9c3", { emissive: "#fef08a", emInt: 1.5 });
        lampHead.position.set(cx + px, standH + 7.2, cz + pz);
        group.add(pylon, lampHead);
      });
    } else if (st.projectKey === "convention") {
      const body = box(30, totalH * 0.72, 22, "#4c1d95", { rough: 0.52 });
      body.position.set(cx, totalH * 0.36 + 0.1, cz);
      const cornice = box(31.2, 0.68, 23.2, "#facc15", { emissive: "#eab308", emInt: 0.45, metal: 0.5 });
      cornice.position.set(cx, totalH * 0.72 + 0.35, cz);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(8.2, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2),
        getMat("#f59e0b", { metal: 0.75, rough: 0.22, emissive: "#ca8a04", emInt: 0.35 })
      );
      dome.position.set(cx, totalH * 0.72 + 0.5, cz);
      dome.castShadow = true;
      group.add(body, cornice, dome);
      for (let i = 0; i < 6; i++) {
        const col = cyl(0.45, 0.52, totalH * 0.7, 10, "#f8fafc", { rough: 0.3 });
        col.position.set(cx - 11.5 + i * 4.6, totalH * 0.35 + 0.1, cz - 11.6);
        group.add(col);
      }
    } else if (st.projectKey === "agrifarm") {
      // 🌾 ORGANİK ÇİFTLİK: Cam Seralar, Kırmızı Çiftlik Ambarı, Tahıl Silosu & Dönen Yel Değirmeni!
      [-9.5, -1.5].forEach((gx) => {
        const ghBase = box(6.6, 1.4, 15.5, "#f1f5f9");
        ghBase.position.set(gx, 0.8, cz + 1.5);
        const ghGlass = new THREE.Mesh(
          new THREE.CylinderGeometry(3.3, 3.3, 15.2, 12, 1, false, 0, Math.PI),
          getMat("#86efac", { emissive: "#22c55e", emInt: 0.35, op: 0.82, rough: 0.15 })
        );
        ghGlass.rotation.z = Math.PI / 2;
        ghGlass.rotation.y = Math.PI / 2;
        ghGlass.position.set(gx, 1.5, cz + 1.5);
        group.add(ghBase, ghGlass);
      });
      // Kırmızı Çiftlik Ambarı + Tahıl Silosu
      const barn = box(10.5, 4.6 + floors * 0.5, 11.5, "#991b1b", { rough: 0.72 });
      barn.position.set(9.2, (4.6 + floors * 0.5) / 2 + 0.1, cz - 2.0);
      addDetailedRoof(group, 9.2, 4.8 + floors * 0.5, cz - 2.0, 10.8, 11.8, "#450a0a", "#84cc16", "ORGANİK ÇİFTLİK", "#7f1d1d");
      const silo = cyl(2.2, 2.2, 8.5 + floors * 0.8, 16, "#cbd5e1", { metal: 0.65, rough: 0.25 });
      silo.position.set(14.5, (8.5 + floors * 0.8) / 2, cz + 6.5);
      const siloCap = new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), getMat("#94a3b8", { metal: 0.65 }));
      siloCap.position.set(14.5, 8.5 + floors * 0.8, cz + 6.5);
      group.add(barn, silo, siloCap);
      // Dönen Rüzgar Değirmeni
      const wmTower = cyl(0.45, 1.1, 8.8, 8, "#f8fafc");
      wmTower.position.set(6.8, 4.4, cz + 7.2);
      const wmRotor = new THREE.Group();
      wmRotor.position.set(6.8, 8.6, cz + 6.5);
      for (let b = 0; b < 4; b++) {
        const bl = box(0.55, 5.6, 0.12, "#fde047", { emissive: "#eab308", emInt: 0.35 });
        bl.rotation.z = (b * Math.PI) / 2;
        wmRotor.add(bl);
      }
      animRefs.windRotors.push(wmRotor);
      group.add(wmTower, wmRotor);
    } else if (st.projectKey === "aquapark") {
      // 🎢 DEV AQUAPARK: Turkuaz Dalga Havuzu, Güneşlenme Terası & 3 Renkli Su Kaydırağı Kulesi!
      const deck = box(32, 0.32, 21, "#fde68a", { rough: 0.8 });
      deck.position.set(cx, 0.2, cz);
      const wavePool = box(21, 0.42, 15.5, "#22d3ee", { emissive: "#0284c7", emInt: 0.72, rough: 0.08 });
      wavePool.position.set(cx - 3.8, 0.28, cz);
      group.add(deck, wavePool);

      const towerH = 6.5 + floors * 2.1;
      const slideTower = box(5.8, towerH, 5.8, "#0284c7", { rough: 0.4 });
      slideTower.position.set(10.8, towerH / 2 + 0.1, cz - 3.5);
      addDetailedRoof(group, 10.8, towerH + 0.2, cz - 3.5, 6.2, 6.2, "#0c4a6e", "#fde047", "AQUAPARK", "#0369a1");
      group.add(slideTower);

      // 3 Renkli Kıvrımlı Su Kaydırağı Tüpü (Havuza İner!)
      [
        { col: "#ef4444", dz: -4.2, hMul: 0.92 },
        { col: "#facc15", dz: 0.0,  hMul: 0.75 },
        { col: "#ec4899", dz: 4.2,  hMul: 0.58 }
      ].forEach((sl) => {
        const chute = cyl(0.75, 0.75, 15.5, 12, sl.col, { emissive: sl.col, emInt: 0.35, rough: 0.22 });
        chute.position.set(3.5, towerH * sl.hMul * 0.52, cz + sl.dz);
        chute.rotation.z = 1.05;
        group.add(chute);
      });
    } else if (st.projectKey === "filmstudio") {
      // 🎬 FİLM & DİZİ STÜDYOSU: İki Dev Çekim Hangarı, Yeşil Perde Sahnesi & Projektörler!
      const hH = 5.4 + floors * 1.1;
      [-8.2, 8.2].forEach((hx, idx) => {
        const hangar = box(13.5, hH, 16.5, "#27272a", { rough: 0.55 });
        hangar.position.set(hx, hH / 2 + 0.1, cz + 2.0);
        addDetailedRoof(group, hx, hH + 0.2, cz + 2.0, 13.8, 16.8, "#18181b", "#f43f5e", idx === 0 ? "STÜDYO A" : "STÜDYO B", "#9f1239");
        group.add(hangar);
      });
      // Açık Hava Yeşil Perde (Greenbox) Çekim Sahnesi
      const greenStage = box(11.5, 3.8, 0.45, "#22c55e", { emissive: "#16a34a", emInt: 0.85 });
      greenStage.position.set(0, 2.0, cz - 8.2);
      const greenFloor = box(11.5, 0.22, 5.4, "#22c55e", { emissive: "#16a34a", emInt: 0.55 });
      greenFloor.position.set(0, 0.22, cz - 5.6);
      group.add(greenStage, greenFloor);
    } else if (st.projectKey === "university") {
      // 🎓 ÖZEL ÜNİVERSİTE: Kırmızı Tuğla Fakülte Kanatları, Kubbeli Kütüphane & Saat Kulesi!
      const uH = 4.6 + floors * 1.4;
      const mainWing = box(28, uH, 8.5, "#7c2d12", { rough: 0.62 });
      mainWing.position.set(cx, uH / 2 + 0.1, cz + 5.5);
      const leftWing = box(7.5, uH * 0.88, 12.5, "#9a3412", { rough: 0.62 });
      leftWing.position.set(-10.2, (uH * 0.88) / 2 + 0.1, cz - 3.5);
      const rightWing = box(7.5, uH * 0.88, 12.5, "#9a3412", { rough: 0.62 });
      rightWing.position.set(10.2, (uH * 0.88) / 2 + 0.1, cz - 3.5);
      addDetailedRoof(group, cx, uH + 0.2, cz + 5.5, 28.4, 8.8, "#1e293b", "#fbbf24", "ÜNİVERSİTE", "#7c2d12");
      // Saat Kulesi + Işıklı Saat Kadranı
      const clockH = uH + 6.5;
      const clockTower = box(4.4, clockH, 4.4, "#b45309", { rough: 0.5 });
      clockTower.position.set(cx, clockH / 2 + 0.1, cz + 4.5);
      const clockFace = cyl(1.35, 1.35, 0.35, 16, "#fef9c3", { emissive: "#fde047", emInt: 1.3 });
      clockFace.rotation.x = Math.PI / 2;
      clockFace.position.set(cx, clockH - 1.8, cz + 2.2);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(3.2, 3.8, 4), getMat("#0f172a", { metal: 0.5 }));
      spire.rotation.y = Math.PI / 4;
      spire.position.set(cx, clockH + 1.9, cz + 4.5);
      group.add(mainWing, leftWing, rightWing, clockTower, clockFace, spire);
    } else if (st.projectKey === "powerplant") {
      // ⚡ RÜZGAR & GÜNEŞ ENERJİ SANTRALİ: Dönen 3 Kanatlı Dev Rüzgar Türbinleri & Güneş Tarlası!
      const ctrl = box(11.5, 3.8, 7.5, "#0f172a", { metal: 0.4 });
      ctrl.position.set(-9.5, 2.0, cz + 5.5);
      addDetailedRoof(group, -9.5, 4.0, cz + 5.5, 11.8, 7.8, "#1e293b", "#38bdf8", "ENERJİ SANTRALİ", "#0284c7");
      group.add(ctrl);

      // Mavi Güneş Paneli Sıraları
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          const sp = box(5.8, 0.18, 3.6, "#0284c7", { emissive: "#0369a1", emInt: 0.55, metal: 0.8, rough: 0.15 });
          sp.position.set(-10.5 + c * 7.0, 1.15, cz - 6.5 + r * 5.2);
          sp.rotation.x = 0.36;
          group.add(sp);
        }
      }

      // Dönen Dev Beyaz Rüzgar Türbinleri (Seviyeye Göre 2..4 Adet!)
      const turbCount = Math.min(4, 1 + floors);
      [-11, -3.5, 4.5, 12.5].slice(0, turbCount).forEach((tx, idx) => {
        const tH = 11.5 + (idx % 2) * 2.0;
        const mast = cyl(0.28, 0.65, tH, 10, "#f8fafc", { rough: 0.3 });
        mast.position.set(tx, tH / 2, cz + 6.5);
        const nacelle = box(1.1, 1.1, 2.4, "#f1f5f9");
        nacelle.position.set(tx, tH, cz + 6.5);
        const rotor = new THREE.Group();
        rotor.position.set(tx, tH, cz + 5.2);
        for (let b = 0; b < 3; b++) {
          const holder = new THREE.Group();
          holder.rotation.z = (b * Math.PI * 2) / 3;
          const blade = box(0.42, 5.4, 0.12, "#ffffff", { rough: 0.25 });
          blade.position.y = 2.7;
          holder.add(blade);
          rotor.add(holder);
        }
        animRefs.windRotors.push(rotor);
        group.add(mast, nacelle, rotor);
      });
    } else if (st.projectKey === "twintowers") {
      // 🏙️ İKİZ KULELER LÜKS REZİDANS: Cam Gökyüzü Köprülü Çift Gökdelen!
      const tH = 7.5 + floors * 3.4;
      const M23 = window.MechanicsV23;
      const bShortT = M23 ? M23.getBrandShort(data) : "PLATİN";
      const twTex = createWindowFacadeTexture("#0f172a", "#0284c7", "#bae6fd", 3, floors + 1);
      const twMat = new THREE.MeshStandardMaterial({ map: twTex, emissive: new THREE.Color("#38bdf8"), emissiveMap: twTex, emissiveIntensity: 0.35, metalness: 0.7, roughness: 0.18 });
      [-8.6, 8.6].forEach((tx, idx) => {
        const tower = new THREE.Mesh(new THREE.BoxGeometry(11.6, tH, 14.5), twMat);
        tower.position.set(tx, tH / 2 + 0.1, cz);
        tower.castShadow = true;
        group.add(tower);
        addDetailedRoof(group, tx, tH + 0.2, cz, 11.8, 14.8, "#0f172a", "#38bdf8", idx === 0 ? `${bShortT} KULE A` : "KULE B", "#0369a1");
      });
      // Gökyüzü Köprüsü (Skybridge)
      const bridgeY = tH * 0.68;
      const skyBridge = box(7.2, 2.4, 5.6, "#7dd3fc", { emissive: "#0284c7", emInt: 0.75, metal: 0.8, rough: 0.12 });
      skyBridge.position.set(0, bridgeY, cz);
      group.add(skyBridge);
    } else if (st.projectKey === "airport") {
      // ✈️ ÖZEL HAVALİMANI & VIP JET TERMİNALİ: Pist, Radar Kulesi ve 3D Beyaz Yolcu Jeti!
      const termH = 4.5 + floors * 0.9;
      const term = box(24, termH, 8.8, "#0c4a6e", { metal: 0.55, rough: 0.25 });
      term.position.set(-2.5, termH / 2 + 0.1, cz - 5.5);
      addDetailedRoof(group, -2.5, termH + 0.2, cz - 5.5, 24.4, 9.2, "#0f172a", "#38bdf8", "VIP HAVALİMANI", "#0284c7");
      group.add(term);

      // Hava Trafik Kontrol Kulesi + Dönen Radar
      const atcH = 11.5 + floors * 1.4;
      const atcShaft = cyl(1.2, 1.8, atcH, 10, "#e2e8f0");
      atcShaft.position.set(12.8, atcH / 2, cz - 5.5);
      const atcCab = cyl(2.6, 2.0, 2.4, 12, "#38bdf8", { emissive: "#0284c7", emInt: 0.65, metal: 0.8 });
      atcCab.position.set(12.8, atcH + 1.0, cz - 5.5);
      const radarPivot = new THREE.Group();
      radarPivot.position.set(12.8, atcH + 2.6, cz - 5.5);
      radarPivot.add(box(3.4, 0.55, 0.35, "#fde047", { emissive: "#facc15", emInt: 0.8 }));
      animRefs.radarRotors.push(radarPivot);
      group.add(atcShaft, atcCab, radarPivot);

      // Pist / Apron Asfaltı + Yeşil Pist Işıkları + 3D Beyaz Yolcu Jeti!
      const runway = box(36, 0.18, 10.5, "#1e293b", { shadow: false });
      runway.position.set(0, 0.18, cz + 5.8);
      group.add(runway);
      for (let rx = -15; rx <= 15; rx += 6) {
        const dash = box(2.6, 0.05, 0.35, "#f8fafc", { shadow: false });
        dash.position.set(rx, 0.29, cz + 5.8);
        const lgt = box(0.35, 0.25, 0.35, "#4ade80", { emissive: "#22c55e", emInt: 1.5, shadow: false });
        lgt.position.set(rx, 0.32, cz + 10.6);
        group.add(dash, lgt);
      }
      // 3D Beyaz VIP Jet Uçağı
      const jet = new THREE.Group();
      const fuselage = cyl(1.15, 1.15, 16.5, 14, "#f8fafc", { rough: 0.2, metal: 0.3 });
      fuselage.rotation.z = Math.PI / 2;
      fuselage.position.y = 1.65;
      const nose = new THREE.Mesh(new THREE.ConeGeometry(1.15, 3.2, 14), getMat("#f8fafc", { rough: 0.2 }));
      nose.rotation.z = -Math.PI / 2;
      nose.position.set(9.8, 1.65, 0);
      const wings = box(3.2, 0.18, 14.8, "#cbd5e1", { metal: 0.55 });
      wings.position.set(0.5, 1.5, 0);
      const tailFin = box(2.4, 3.4, 0.22, "#0284c7", { emissive: "#0369a1", emInt: 0.4 });
      tailFin.position.set(-7.2, 3.2, 0);
      jet.add(fuselage, nose, wings, tailFin);
      jet.position.set(-1.5, 0.2, cz + 5.8);
      group.add(jet);
    } else if (st.projectKey === "banktower") {
      // 🏦 FİNANS KULESİ & ÖZEL BANKA: Altın Taçlı Siyah Gökdelen!
      const bH = 8.0 + floors * 3.5;
      const M23 = window.MechanicsV23;
      const bShortB = M23 ? M23.getBrandShort(data) : "HOLDİNG";
      const bkTex = createWindowFacadeTexture("#1c1917", "#422006", "#fde047", 4, floors + 1);
      const bkMat = new THREE.MeshStandardMaterial({ map: bkTex, emissive: new THREE.Color("#facc15"), emissiveMap: bkTex, emissiveIntensity: 0.32, metalness: 0.72, roughness: 0.2 });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(24, bH, 18), bkMat);
      tower.position.set(cx, bH / 2 + 0.1, cz);
      tower.castShadow = true;
      group.add(tower);
      addDetailedRoof(group, cx, bH + 0.2, cz, 24.4, 18.4, "#090d1a", "#facc15", `${bShortB} BANK`, "#78350f");
      // Altın Piramit Taç & Yeşil Borsa Kayar Şeridi
      const ticker = box(24.6, 0.75, 18.6, "#22c55e", { emissive: "#16a34a", emInt: 1.1 });
      ticker.position.set(cx, 3.8, cz);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(8.5, 5.2, 4), getMat("#facc15", { emissive: "#ca8a04", emInt: 0.55, metal: 0.85, rough: 0.18 }));
      crown.rotation.y = Math.PI / 4;
      crown.position.set(cx, bH + 3.0, cz);
      group.add(ticker, crown);
    } else {
      const M23 = window.MechanicsV23;
      const bShortX = M23 ? M23.getBrandShort(data) : "GRAND";
      const neonX = M23 ? M23.getNeonTheme(data).hex : "#facc15";
      const palette = {
        hotel: { body: "#7c2d12", trim: neonX, glass: "#38bdf8", title: `${bShortX} OTEL` },
        hospital: { body: "#e2e8f0", trim: "#38bdf8", glass: "#0ea5e9", title: "ÖZEL HASTANE" },
        autofactory: { body: "#334155", trim: "#f97316", glass: "#7dd3fc", title: "OTO FABRİKA" },
        techpark: { body: "#1e1b4b", trim: "#818cf8", glass: "#38bdf8", title: "TEKNOKENT" }
      }[st.projectKey] || { body: "#334155", trim: neonX, glass: "#38bdf8", title: "TESİS" };

      const bw = 30;
      const bd = 21;
      const sideTex = createWindowFacadeTexture(palette.body, "#0f172a", "#38bdf8", 4, floors);
      const sideMat = new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.45, metalness: 0.25 });
      const bodyMat = getMat(palette.body, { metal: 0.25, rough: 0.42 });
      const mainBody = new THREE.Mesh(new THREE.BoxGeometry(bw, totalH, bd), [sideMat, sideMat, bodyMat, bodyMat, bodyMat, bodyMat]);
      mainBody.position.set(cx, totalH / 2 + 0.1, cz);
      mainBody.castShadow = true;
      mainBody.receiveShadow = true;
      group.add(mainBody);

      addDetailedRoof(group, cx, totalH + 0.22, cz, bw, bd, "#0f172a", palette.trim, palette.title, palette.body);

      // 4 Köşe Dikey Mimari LED Şeritleri (Gece & Gündüz Prestijli Gökdelen Hissi!)
      [[-bw / 2 - 0.08, -bd / 2 - 0.08], [bw / 2 + 0.08, -bd / 2 - 0.08], [-bw / 2 - 0.08, bd / 2 + 0.08], [bw / 2 + 0.08, bd / 2 + 0.08]].forEach(([kx, kz]) => {
        const strip = box(0.28, totalH, 0.28, palette.trim, { emissive: palette.trim, emInt: 0.85, shadow: false });
        strip.position.set(cx + kx, totalH / 2 + 0.1, cz + kz);
        group.add(strip);
      });

      // Ön VE Arka Cephelerde Canlı Dolu/Hazır Pencereleri (Hangi açıdan bakarsan bak parlar!)
      for (let f = 0; f < floors; f++) {
        const wy = 2.6 + f * 2.95;
        for (let c = 0; c < 6; c++) {
          const wx = cx - 11.8 + c * 4.72;
          const winMat = new THREE.MeshStandardMaterial({
            color: palette.glass,
            emissive: new THREE.Color("#0284c7"),
            emissiveIntensity: 0.4,
            roughness: 0.18,
            metalness: 0.65
          });
          const wFront = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.7, 0.22), winMat);
          wFront.position.set(wx, wy, cz - bd / 2 - 0.08);
          const wBack = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.7, 0.22), winMat);
          wBack.position.set(wx, wy, cz + bd / 2 + 0.08);
          group.add(wFront, wBack);
          animRefs.hotelRoomMeshes.push(winMat);
        }
      }

      if (st.projectKey === "hospital") {
        const h1 = box(4.0, 1.15, 0.35, "#ef4444", { emissive: "#ef4444", emInt: 1.2 });
        const h2 = box(1.15, 4.0, 0.35, "#ef4444", { emissive: "#ef4444", emInt: 1.2 });
        h1.position.set(cx, totalH + 2.8, cz - bd / 2 + 0.6);
        h2.position.set(cx, totalH + 2.8, cz - bd / 2 + 0.6);
        group.add(h1, h2);
      }
      if (st.projectKey === "techpark") {
        const spire = cyl(0.15, 0.58, 8.2, 8, "#818cf8", { emissive: "#6366f1", emInt: 0.9, metal: 0.7 });
        spire.position.set(cx, totalH + 4.6, cz);
        group.add(spire);
      }
      if (st.vipUpgrade) {
        const deck = box(13.0, 0.42, 9.2, "#f8fafc", { rough: 0.4 });
        deck.position.set(cx - 6.6, totalH + 0.55, cz + 1.2);
        const pool = box(11.4, 0.48, 7.4, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.78, rough: 0.1 });
        pool.position.set(cx - 6.6, totalH + 0.6, cz + 1.2);
        group.add(deck, pool);
      }
      if (st.heliUpgrade) {
        const hx = cx + 8.4;
        const hz = cz + 1.2;
        const pad = cyl(4.4, 4.7, 0.42, 22, "#1e293b");
        pad.position.set(hx, totalH + 0.6, hz);
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(3.3, 0.22, 8, 26),
          getMat("#facc15", { emissive: "#fde047", emInt: 1.0 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(hx, totalH + 0.85, hz);
        group.add(pad, ring);
      }
    }
  }

  // =========================================================================
  // 3D ARAÇLAR (BOYANMIŞ TAVANLI, JANTLI, FARLI), KARAKTERLER & HELİKOPTER
  // =========================================================================
  function createVehicle3D(color, shape) {
    const g = new THREE.Group();
    const isBus = shape === "bus";
    const isTaxi = shape === "taxi";
    const isEmerg = shape === "ambulance" || shape === "fire";
    const isTruck = shape === "truck" || shape === "tanker" || shape === "tow" || isBus || isEmerg;
    const isSport = shape === "sport" || shape === "ev";
    const w = isTruck ? 2.38 : 1.94;
    const l = isBus ? 5.8 : isTruck ? 4.7 : isSport ? 3.8 : 3.5;
    const h = isBus ? 2.25 : isTruck ? 1.82 : isSport ? 0.94 : 1.12;

    // Havuzda Yeniden Kullanılabilir Metalik Araç Gövde Materyali (0 Yeniden Yaratma!)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color || "#ef4444"),
      metalness: 0.52,
      roughness: 0.18
    });
    const body = new THREE.Mesh(getBoxGeo(w, h * 0.56, l), bodyMat);
    body.position.y = 0.42 + h * 0.28;
    body.castShadow = true;
    body.receiveShadow = true;
    const bumper = box(w + 0.08, 0.22, l + 0.12, "#1e293b", { metal: 0.35, rough: 0.45, shadow: false });
    bumper.position.y = 0.44;
    g.add(body, bumper);

    let roofMat = null;
    let policeBar = null;
    let taxiSign = null;

    if (shape === "ambulance") {
      const boxBody = box(w * 0.96, 1.38, l * 0.64, "#f8fafc", { rough: 0.25 });
      boxBody.position.set(0, 1.42, 0.62);
      const stripe = box(w * 0.99, 0.28, l * 0.65, "#ef4444", { emissive: "#dc2626", emInt: 0.45, shadow: false });
      stripe.position.set(0, 1.25, 0.62);
      const cab = box(w * 0.92, 1.15, l * 0.3, "#f8fafc", { rough: 0.25 });
      cab.position.set(0, 1.22, -1.4);
      const ws = box(w * 0.84, 0.52, 0.14, "#0f172a", { metal: 0.85, rough: 0.12, shadow: false });
      ws.position.set(0, 1.42, -2.1);
      const barL = box(0.65, 0.24, 0.34, "#ef4444", { emissive: "#ef4444", emInt: 2.2, shadow: false });
      barL.position.set(-0.48, 2.2, -0.5);
      const barR = box(0.65, 0.24, 0.34, "#38bdf8", { emissive: "#0284c7", emInt: 2.2, shadow: false });
      barR.position.set(0.48, 2.2, -0.5);
      g.add(boxBody, stripe, cab, ws, barL, barR);
    } else if (shape === "fire") {
      const tankBox = box(w * 0.96, 1.32, l * 0.62, "#dc2626", { metal: 0.35, rough: 0.25 });
      tankBox.position.set(0, 1.38, 0.62);
      const ladder = box(0.75, 0.18, l * 0.78, "#e2e8f0", { metal: 0.75, shadow: false });
      ladder.position.set(0, 2.15, 0.25);
      const cab = box(w * 0.94, 1.26, l * 0.32, "#b91c1c", { metal: 0.35, rough: 0.25 });
      cab.position.set(0, 1.28, -1.42);
      const ws = box(w * 0.84, 0.52, 0.14, "#bae6fd", { emissive: "#0ea5e9", emInt: 0.3, metal: 0.85, shadow: false });
      ws.position.set(0, 1.48, -2.14);
      const barL = box(0.68, 0.24, 0.34, "#ef4444", { emissive: "#ef4444", emInt: 2.2, shadow: false });
      barL.position.set(-0.48, 2.02, -1.4);
      const barR = box(0.68, 0.24, 0.34, "#facc15", { emissive: "#eab308", emInt: 2.2, shadow: false });
      barR.position.set(0.48, 2.02, -1.4);
      g.add(tankBox, ladder, cab, ws, barL, barR);
    } else if (shape === "tanker") {
      const tank = cyl(0.94, 0.94, 3.2, 14, "#f8fafc", { metal: 0.65, rough: 0.18 });
      tank.rotation.x = Math.PI / 2;
      tank.position.set(0, 1.44, 0.52);
      const tStripe = cyl(0.96, 0.96, 0.7, 14, "#ea580c", { emissive: "#c2410c", emInt: 0.3, shadow: false });
      tStripe.rotation.x = Math.PI / 2;
      tStripe.position.set(0, 1.44, 0.52);
      const cab = box(2.18, 1.48, 1.3, "#ea580c", { metal: 0.4, rough: 0.25 });
      cab.position.set(0, 1.24, -1.58);
      const ws = box(1.92, 0.58, 0.12, "#bae6fd", { emissive: "#0ea5e9", emInt: 0.35, metal: 0.85, rough: 0.1, shadow: false });
      ws.position.set(0, 1.45, -2.22);
      g.add(tank, tStripe, cab, ws);
    } else if (shape === "tow") {
      const cab = box(2.14, 1.3, 1.4, "#f59e0b", { metal: 0.38, rough: 0.24 });
      cab.position.set(0, 1.18, -1.48);
      const ws = box(1.9, 0.52, 1.1, "#0f172a", { metal: 0.85, rough: 0.12, shadow: false });
      ws.position.set(0, 1.4, -1.56);
      const bed = box(2.26, 0.22, 2.8, "#475569", { metal: 0.55 });
      bed.position.set(0, 0.88, 0.78);
      const beacon = box(1.1, 0.24, 0.32, "#fde047", { emissive: "#f59e0b", emInt: 1.8, shadow: false });
      beacon.position.set(0, 1.95, -1.48);
      g.add(cab, ws, bed, beacon);
    } else if (isBus) {
      const glassBand = box(w + 0.04, 0.72, l * 0.9, "#0f172a", { metal: 0.88, rough: 0.12, shadow: false });
      glassBand.position.set(0, 1.55, 0);
      const roofCap = box(w * 0.96, 0.24, l * 0.96, "#f8fafc", { rough: 0.3 });
      roofCap.position.set(0, 2.04, 0);
      const acPod = box(1.2, 0.24, 1.8, "#cbd5e1", { metal: 0.4, shadow: false });
      acPod.position.set(0, 2.22, 0.2);
      g.add(glassBand, roofCap, acPod);
    } else {
      // Gerçekçi 3 Parçalı Binek / SUV / Spor / Taksi / Kamyon: Cam Kabin + Yan Aynalar + Tavan!
      const cabLen = isTruck ? l * 0.36 : l * 0.52;
      const cabZ = isTruck ? -l * 0.28 : 0.12;
      const cabinGlass = box(w * 0.84, h * 0.44, cabLen, "#0f172a", { metal: 0.88, rough: 0.09, shadow: false });
      cabinGlass.position.set(0, 0.42 + h * 0.56 + h * 0.18, cabZ);
      roofMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color || "#ef4444"),
        metalness: 0.5,
        roughness: 0.18
      });
      const roofCap = new THREE.Mesh(getBoxGeo(w * 0.8, 0.12, cabLen * 0.84), roofMat);
      roofCap.position.set(0, 0.42 + h * 0.56 + h * 0.4, cabZ);
      roofCap.castShadow = true;

      // Yan Aynalar
      const mirL = new THREE.Mesh(getBoxGeo(0.18, 0.12, 0.22), bodyMat);
      mirL.position.set(-w / 2 - 0.08, 0.42 + h * 0.58, cabZ - cabLen * 0.34);
      const mirR = new THREE.Mesh(getBoxGeo(0.18, 0.12, 0.22), bodyMat);
      mirR.position.set(w / 2 + 0.08, 0.42 + h * 0.58, cabZ - cabLen * 0.34);
      g.add(cabinGlass, roofCap, mirL, mirR);

      if (isSport) {
        const spoiler = box(w * 0.92, 0.12, 0.36, "#0f172a", { metal: 0.6, shadow: false });
        spoiler.position.set(0, 0.42 + h * 0.68, l * 0.42);
        g.add(spoiler);
      }

      // Kamyon Kasası Detayı
      if (shape === "truck") {
        const cargoBox = box(w * 0.96, 1.32, l * 0.58, "#e2e8f0", { rough: 0.38 });
        cargoBox.position.set(0, 1.38, l * 0.19);
        g.add(cargoBox);
      }

      // Polis Devriyesi Tepe Lambası (Görünürlüğü Anında Açılıp Kapatılabilir!)
      policeBar = new THREE.Group();
      const barL = box(0.45, 0.18, 0.26, "#ef4444", { emissive: "#ef4444", emInt: 2.0, shadow: false });
      barL.position.set(-0.26, 0.42 + h * 0.56 + h * 0.52, cabZ);
      const barR = box(0.45, 0.18, 0.26, "#38bdf8", { emissive: "#0284c7", emInt: 2.0, shadow: false });
      barR.position.set(0.26, 0.42 + h * 0.56 + h * 0.52, cabZ);
      policeBar.add(barL, barR);
      policeBar.visible = color === "#1e3a8a";
      g.add(policeBar);

      // Işıklı Sarı "TAKSİ" Tepe Tabelası!
      if (isTaxi || !isTruck) {
        taxiSign = box(0.68, 0.22, 0.28, "#fef08a", { emissive: "#facc15", emInt: 1.55, shadow: false });
        taxiSign.position.set(0, 0.42 + h * 0.56 + h * 0.52, cabZ - 0.05);
        taxiSign.visible = isTaxi;
        g.add(taxiSign);
      }
    }

    // Krom Jantlı 4 Tekerlek (Önbellekli Geometri!)
    const wheelMat = getMat("#090d16", { rough: 0.88, shadow: false });
    const rimMat = getMat("#e2e8f0", { metal: 0.85, rough: 0.2, shadow: false });
    const whGeo = getCylGeo(0.4, 0.4, 0.28, 10);
    const rimGeo = getCylGeo(0.22, 0.22, 0.31, 8);
    [[-w / 2 - 0.04, -l * 0.31], [w / 2 + 0.04, -l * 0.31], [-w / 2 - 0.04, l * 0.31], [w / 2 + 0.04, l * 0.31]].forEach(([wx, wz]) => {
      const wh = new THREE.Mesh(whGeo, wheelMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, 0.4, wz);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, 0.4, wz);
      g.add(wh, rim);
    });

    // Ön Krom Panjur + Parlak LED Farlar + Kesintisiz LED Arka Stop Şeridi
    const grille = box(w * 0.44, 0.22, 0.08, "#cbd5e1", { metal: 0.8, rough: 0.2, shadow: false });
    grille.position.set(0, 0.68, -l / 2 - 0.03);
    const tailStrip = box(w * 0.76, 0.11, 0.09, "#ef4444", { emissive: "#dc2626", emInt: 1.45, shadow: false });
    tailStrip.position.set(0, 0.72, l / 2 + 0.04);
    g.add(grille, tailStrip);

    const hlMat = getMat("#fef9c3", { emissive: "#fef08a", emInt: 1.75, shadow: false });
    const tlMat = getMat("#ef4444", { emissive: "#dc2626", emInt: 1.55, shadow: false });
    [-w * 0.34, w * 0.34].forEach((fx) => {
      const hl = new THREE.Mesh(getBoxGeo(0.38, 0.22, 0.12), hlMat);
      hl.position.set(fx, 0.72, -l / 2 - 0.04);
      const tl = new THREE.Mesh(getBoxGeo(0.38, 0.2, 0.12), tlMat);
      tl.position.set(fx, 0.72, l / 2 + 0.04);
      g.add(hl, tl);
    });

    // Yumuşak Zemin Temas Gölgesi
    const shKey = `csh_${w.toFixed(2)}_${l.toFixed(2)}`;
    if (!geoCache[shKey]) geoCache[shKey] = new THREE.PlaneGeometry(w + 0.55, l + 0.6);
    const contactSh = new THREE.Mesh(
      geoCache[shKey],
      getMat("#050811", { op: 0.34, shadow: false })
    );
    contactSh.rotation.x = -Math.PI / 2;
    contactSh.position.y = 0.03;
    g.add(contactSh);

    // Gece/Akşam Far Işık Hüzmesi
    const beamKey = `beam_${w.toFixed(2)}`;
    if (!geoCache[beamKey]) geoCache[beamKey] = new THREE.ConeGeometry(w * 0.78, 4.2, 8, 1, true);
    if (!matCache.headlightBeamMat) {
      matCache.headlightBeamMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.24,
        depthWrite: false
      });
    }
    const beam = new THREE.Mesh(geoCache[beamKey], matCache.headlightBeamMat);
    beam.rotation.x = -Math.PI / 2;
    beam.scale.set(1.0, 1.0, 0.14);
    beam.position.set(0, 0.14, -l / 2 - 2.05);
    beam.visible = false;
    g.add(beam);

    g.userData = { color, shape, bodyMat, roofMat, headlightBeam: beam, policeBar, taxiSign };
    return g;
  }

  function createCharacter3D(shirtCol, hatCol, isDog = false) {
    const g = new THREE.Group();
    if (isDog) {
      const body = box(0.72, 0.5, 1.22, "#d97706", { rough: 0.75 });
      body.position.y = 0.48;
      const collar = box(0.58, 0.14, 0.16, "#dc2626", { emissive: "#b91c1c", emInt: 0.3, shadow: false });
      collar.position.set(0, 0.64, -0.52);
      const head = box(0.52, 0.48, 0.54, "#b45309");
      head.position.set(0, 0.8, -0.72);
      const snout = box(0.28, 0.22, 0.24, "#1e293b", { shadow: false });
      snout.position.set(0, 0.7, -1.04);
      const earL = box(0.14, 0.24, 0.14, "#78350f", { shadow: false });
      earL.position.set(-0.2, 1.08, -0.68);
      const earR = box(0.14, 0.24, 0.14, "#78350f", { shadow: false });
      earR.position.set(0.2, 1.08, -0.68);
      const tail = box(0.14, 0.42, 0.14, "#f59e0b", { shadow: false });
      tail.position.set(0, 0.82, 0.65);
      tail.rotation.x = 0.45;
      [[-0.22, -0.4], [0.22, -0.4], [-0.22, 0.4], [0.22, 0.4]].forEach(([px, pz]) => {
        const paw = box(0.16, 0.34, 0.16, "#92400e", { shadow: false });
        paw.position.set(px, 0.17, pz);
        g.add(paw);
      });
      g.add(body, collar, head, snout, earL, earR, tail);
      g.userData = { isDog: true, tail };
      return g;
    }
    const legL = box(0.22, 0.62, 0.22, "#1e293b", { shadow: false });
    legL.position.set(-0.17, 0.34, 0);
    const legR = box(0.22, 0.62, 0.22, "#1e293b", { shadow: false });
    legR.position.set(0.17, 0.34, 0);

    const shirtMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(shirtCol || "#38bdf8"), roughness: 0.6 });
    const hatMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hatCol || "#1e293b"), roughness: 0.55 });

    const torso = new THREE.Mesh(getBoxGeo(0.68, 0.78, 0.42), shirtMat);
    torso.position.y = 1.04;
    torso.castShadow = true;
    const armL = new THREE.Mesh(getBoxGeo(0.18, 0.64, 0.18), shirtMat);
    armL.position.set(-0.46, 1.02, 0);
    const armR = new THREE.Mesh(getBoxGeo(0.18, 0.64, 0.18), shirtMat);
    armR.position.set(0.46, 1.02, 0);
    if (!geoCache.charHead) geoCache.charHead = new THREE.SphereGeometry(0.34, 8, 8);
    const head = new THREE.Mesh(geoCache.charHead, getMat("#fad2b4", { rough: 0.68, shadow: false }));
    head.position.y = 1.7;
    const cap = new THREE.Mesh(getCylGeo(0.36, 0.38, 0.16, 8), hatMat);
    cap.position.y = 1.96;
    const visor = new THREE.Mesh(getBoxGeo(0.42, 0.06, 0.24), hatMat);
    visor.position.set(0, 1.9, -0.26);
    g.add(legL, legR, torso, armL, armR, head, cap, visor);
    g.userData = { isDog: false, shirtCol: shirtCol || "#38bdf8", hatCol: hatCol || "#1e293b", shirtMat, hatMat, legL, legR, armL, armR };
    return g;
  }

  function createHelicopter3D() {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 10), getMat("#0f172a", { metal: 0.6, rough: 0.25 }));
    hull.scale.set(0.85, 0.72, 1.75);
    hull.castShadow = true;
    const glass = new THREE.Mesh(new THREE.SphereGeometry(1.15, 10, 8), getMat("#38bdf8", { emissive: "#0284c7", emInt: 0.5, metal: 0.8, rough: 0.1 }));
    glass.position.set(0, 0.15, -0.85);
    glass.scale.set(0.82, 0.65, 1.0);
    const tail = box(0.32, 0.38, 3.6, "#1e293b", { metal: 0.5 });
    tail.position.set(0, 0.15, 2.8);
    const fin = box(0.16, 1.3, 0.75, "#facc15", { emissive: "#eab308", emInt: 0.5 });
    fin.position.set(0, 0.55, 4.4);
    const rotorPivot = new THREE.Group();
    rotorPivot.position.set(0, 1.25, 0);
    rotorPivot.add(box(7.2, 0.08, 0.32, "#f1f5f9"), box(0.32, 0.08, 7.2, "#f1f5f9"));
    g.add(hull, glass, tail, fin, rotorPivot);
    g.userData.rotorPivot = rotorPivot;
    return g;
  }

  function createCargoShip3D() {
    const g = new THREE.Group();
    // 26m Kırmızı/Lacivert Okyanus İhracat Kargo Gemisi Gövdesi
    const lowerHull = box(6.8, 1.8, 25.0, "#991b1b", { rough: 0.48 });
    lowerHull.position.y = 0.85;
    const upperHull = box(7.2, 1.6, 26.2, "#0f172a", { metal: 0.35, rough: 0.38 });
    upperHull.position.y = 2.45;
    const deck = box(6.8, 0.25, 25.4, "#334155");
    deck.position.y = 3.35;
    g.add(lowerHull, upperHull, deck);

    // Kıç Köprüüstü Kulesi & Baca
    const bridge = box(5.8, 4.4, 4.4, "#f8fafc", { rough: 0.28 });
    bridge.position.set(0, 5.5, -8.8);
    const bridgeGlass = box(6.0, 0.75, 4.6, "#38bdf8", { emissive: "#0284c7", emInt: 0.55, metal: 0.8 });
    bridgeGlass.position.set(0, 6.85, -8.8);
    const funnel = cyl(0.72, 0.92, 2.8, 10, "#f59e0b");
    funnel.position.set(0, 8.6, -9.6);
    g.add(bridge, bridgeGlass, funnel);

    // Güverte Üstü Renkli İhracat Konteyner Yığınları
    const cCols = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#06b6d4", "#a855f7"];
    let ci = 0;
    for (let cz = -3.5; cz <= 8.5; cz += 4.2) {
      for (let cx = -1.7; cx <= 1.7; cx += 3.4) {
        for (let lv = 0; lv < 2; lv++) {
          const cont = box(2.8, 1.45, 3.8, cCols[ci % cCols.length], { metal: 0.25, rough: 0.5 });
          cont.position.set(cx, 4.2 + lv * 1.5, cz);
          g.add(cont);
          ci++;
        }
      }
    }
    g.rotation.y = Math.PI / 2; // Batı -> Doğu yönünde yüzer
    return g;
  }

  // =========================================================================
  // KUZEY TEPESİ — 🏡 3D PATRON MALİKANESİ, SONSUZLUK HAVUZU & ÖZEL GARAJ
  // =========================================================================
  function buildMansionScene(group, data) {
    const emp = data.empire || {};
    const v24 = (emp.v24 && emp.v24.mansion) || {};
    const props = emp.properties || {};
    const carsMap = emp.cars || {};
    const hasHeli = !!(emp.v16 && emp.v16.vipAssets && emp.v16.vipAssets.helicopter);
    const hasVilla = !!props.villa;
    const hasAnyHome = !!(props.villa || props.residence || props.city2p1 || props.studio);

    // Yükseltilmiş Manzaralı Yeşil Teras Tepesi + Taş İstinat Duvarı
    const cliffWall = box(72, 3.1, 34, "#475569", { rough: 0.85 });
    cliffWall.position.set(0, 1.45, 0);
    const lawnTop = box(70, 0.35, 32, "#15803d", { rough: 0.88 });
    lawnTop.position.set(0, 3.1, 0);
    const marbleCourt = box(46, 0.2, 22, "#f1f5f9", { rough: 0.35 });
    marbleCourt.position.set(0, 3.3, 1.5);
    group.add(cliffWall, lawnTop, marbleCourt);

    // Altın Ferforje Korkuluklar & Palmiyeler
    [-31, -22, 22, 31].forEach((px) => {
      const palm = createPalmTree(px, -10, 1.05);
      palm.position.y = 3.2;
      group.add(palm);
    });

    const baseY = 3.35;
    if (!hasAnyHome) {
      // Henüz ev alınmadıysa şık 3D "VİLLA TEPESİ" tabelası
      const tex = createSignTexture("🏡 PATRON VİLLA TEPESİ", "#0f172a", "#fde047", "#22c55e");
      const sMat = new THREE.MeshStandardMaterial({ map: tex, emissive: new THREE.Color("#ffffff"), emissiveMap: tex, emissiveIntensity: 0.6 });
      const brd = new THREE.Mesh(new THREE.BoxGeometry(14, 3.0, 0.45), sMat);
      brd.position.set(0, baseY + 3.2, -2);
      group.add(brd);
    } else {
      // Lüks 2 Katlı Boğaz Villası / Konutu
      const vw = hasVilla ? 22 : 15;
      const vh = hasVilla ? 6.6 : 4.6;
      const vd = hasVilla ? 11 : 9;
      const winTex = createWindowFacadeTexture("#f8fafc", "#0284c7", "#fef08a", 4, 2, true);
      const frontMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: new THREE.Color("#fde68a"), emissiveMap: winTex, emissiveIntensity: 0.35, roughness: 0.28 });
      const sideMat = getMat("#f8fafc", { rough: 0.32 });
      const villaMesh = new THREE.Mesh(new THREE.BoxGeometry(vw, vh, vd), [sideMat, sideMat, sideMat, sideMat, frontMat, frontMat]);
      villaMesh.position.set(0, baseY + vh / 2, -4.5);
      villaMesh.castShadow = true;
      group.add(villaMesh);

      const bShort = window.MechanicsV23 ? window.MechanicsV23.getBrandShort(data) : "PATRON";
      addDetailedRoof(group, 0, baseY + vh + 0.15, -4.5, vw, vd, "#7c2d12", "#facc15", `${bShort} MALİKANE`, "#9a3412");
    }

    // Sonsuzluk Havuzu (Villa veya Havuz Yükseltmesi Varsa)
    if (hasVilla || v24.infinityPool) {
      const poolRim = box(14.5, 0.38, 6.2, "#ffffff", { rough: 0.25 });
      poolRim.position.set(0, baseY + 0.18, 6.2);
      const poolWater = box(13.2, 0.42, 5.0, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.78, rough: 0.08 });
      poolWater.position.set(0, baseY + 0.22, 6.2);
      group.add(poolRim, poolWater);
    }

    // VIP Misafir Köşkü
    if (v24.vipGuesthouse) {
      const gh = box(8.5, 3.8, 7.5, "#fef3c7", { rough: 0.4 });
      gh.position.set(-17.5, baseY + 1.9, -3.5);
      addDetailedRoof(group, -17.5, baseY + 3.9, -3.5, 8.8, 7.8, "#78350f", "#facc15", "VIP KÖŞK", "#92400e");
      group.add(gh);
    }

    // Özel Koleksiyon Garajı — Sahip Olunan Tüm Arabalar Park Halinde!
    const carSlots = [
      { key: "hatchback", x: 12.5, z: 5.5, col: "#22c55e", shape: "sedan" },
      { key: "sedan_lux", x: 16.0, z: 5.5, col: "#f8fafc", shape: "sedan" },
      { key: "ev_suv",    x: 19.5, z: 5.5, col: "#38bdf8", shape: "ev" },
      { key: "supercar",  x: 16.0, z: 10.2, col: "#ef4444", shape: "sport" }
    ];
    carSlots.forEach((cs) => {
      if (carsMap[cs.key]) {
        const cm = createVehicle3D(cs.col, cs.shape);
        cm.position.set(cs.x, baseY, cs.z);
        group.add(cm);
      }
    });

    // Özel Helikopter Pisti & Park Halinde Patron Helikopteri
    if (hasHeli) {
      const hPad = cyl(4.6, 4.8, 0.3, 20, "#1e293b");
      hPad.position.set(18.5, baseY + 0.15, -4.5);
      const hRing = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.2, 8, 24), getMat("#facc15", { emissive: "#fde047", emInt: 1.0 }));
      hRing.rotation.x = Math.PI / 2;
      hRing.position.set(18.5, baseY + 0.35, -4.5);
      const parkedHeli = createHelicopter3D();
      parkedHeli.position.set(18.5, baseY + 1.15, -4.5);
      parkedHeli.rotation.y = 0.5;
      group.add(hPad, hRing, parkedHeli);
    }
  }

  // =========================================================================
  // GÜNEY DENİZ KIYISI — ⚓ ULUSLARARASI TİCARET LİMANI, DENİZ FENERİ & YAT MARİNASI
  // =========================================================================
  function buildPortScene(group, data) {
    const emp = data.empire || {};
    const pState = (emp.v24 && emp.v24.port) || {};
    const hasYacht = !!(emp.v16 && emp.v16.vipAssets && emp.v16.vipAssets.yacht);

    // Ana Beton Liman Rıhtımı (Sahil yolundan denize uzanır!)
    const pier = box(78, 1.3, 28, "#475569", { rough: 0.78 });
    pier.position.set(0, 0.45, -2);
    const pierEdge = box(78.4, 0.35, 0.85, "#facc15", { shadow: false });
    pierEdge.position.set(0, 1.12, 11.8);
    group.add(pier, pierEdge);

    // Kırmızı-Beyaz Deniz Feneri (Sağ Burun)
    const lhBase = cyl(1.6, 2.1, 9.5, 12, "#f8fafc", { rough: 0.4 });
    lhBase.position.set(35, 5.2, 8);
    const lhBand = cyl(1.75, 1.9, 2.6, 12, "#dc2626");
    lhBand.position.set(35, 5.5, 8);
    const lhLamp = cyl(1.2, 1.2, 1.6, 10, "#fef08a", { emissive: "#fde047", emInt: 1.8 });
    lhLamp.position.set(35, 10.6, 8);
    group.add(lhBase, lhBand, lhLamp);

    // Sol VIP Yat Marinası + Lüks Motor Yat (28m)
    const marinaDock = box(18, 0.7, 16, "#92400e", { rough: 0.75 });
    marinaDock.position.set(-50, 0.35, 2);
    group.add(marinaDock);
    if (hasYacht) {
      const yachtHull = box(3.6, 1.3, 11.5, "#f8fafc", { rough: 0.18, metal: 0.25 });
      yachtHull.position.set(-50, 0.7, 15.5);
      yachtHull.rotation.y = Math.PI / 2;
      const yachtDeck = box(3.0, 1.1, 6.8, "#e0f2fe", { emissive: "#38bdf8", emInt: 0.45, metal: 0.7 });
      yachtDeck.position.set(-50, 1.75, 15.5);
      yachtDeck.rotation.y = Math.PI / 2;
      group.add(yachtHull, yachtDeck);
    }

    if (!pState.unlocked) {
      const tex = createSignTexture("⚓ LİMAN KUR (42.000₺)", "#0f172a", "#bae6fd", "#38bdf8");
      const sMat = new THREE.MeshStandardMaterial({ map: tex, emissive: new THREE.Color("#ffffff"), emissiveMap: tex, emissiveIntensity: 0.6 });
      const brd = new THREE.Mesh(new THREE.BoxGeometry(15, 3.2, 0.45), sMat);
      brd.position.set(0, 4.2, -2);
      group.add(brd);
      return;
    }

    // Gümrük & Liman Yönetim Binası
    const bShort = window.MechanicsV23 ? window.MechanicsV23.getBrandShort(data) : "SON";
    const hq = box(14, 4.6, 8.5, "#1e3a8a", { rough: 0.45 });
    hq.position.set(-24, 3.3, -6);
    addDetailedRoof(group, -24, 5.7, -6, 14.4, 8.8, "#0f172a", "#38bdf8", `${bShort} LİMAN`, "#0284c7");
    group.add(hq);

    // Rıhtım Konteyner İstifleri
    const cols = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#06b6d4"];
    for (let i = 0; i < 8; i++) {
      const c = box(2.8, 1.5, 4.2, cols[i % cols.length], { metal: 0.3 });
      c.position.set(-8 + (i % 4) * 4.2, 1.85 + Math.floor(i / 4) * 1.55, -6);
      group.add(c);
    }

    // Dev Konteyner Kıyı Vinçleri (Gantry Cranes — Geminin Üzerine Uzanır!)
    const craneCount = Math.min(3, 1 + Math.floor((pState.craneLvl || 1) / 2));
    [-12, 4, 20].slice(0, craneCount).forEach((cx) => {
      const leg1 = box(0.75, 11.5, 0.75, "#f59e0b", { metal: 0.5 });
      leg1.position.set(cx - 2.4, 6.6, 7.5);
      const leg2 = box(0.75, 11.5, 0.75, "#f59e0b", { metal: 0.5 });
      leg2.position.set(cx + 2.4, 6.6, 7.5);
      const boom = box(1.4, 0.95, 19.5, "#dc2626", { metal: 0.45 });
      boom.position.set(cx, 12.2, 13.5);
      group.add(leg1, leg2, boom);
    });
  }

  function computeSceneSig(activeLand, data) {
    const v23 = (data.empire && data.empire.v23) || {};
    const v24 = (data.empire && data.empire.v24) || {};
    const bSig = `${v23.brandName || "SON"}_${v23.neonTheme || "amber"}_${v23.fuelPolicy || "normal"}`;
    if (activeLand === "mansion") {
      const e = data.empire || {};
      const pSig = Object.keys(e.properties || {}).filter((k) => e.properties[k]).join("");
      const cSig = Object.keys(e.cars || {}).filter((k) => e.cars[k]).join("");
      const hSig = e.v16 && e.v16.vipAssets && e.v16.vipAssets.helicopter ? 1 : 0;
      const m24 = v24.mansion || {};
      return `mn_${bSig}_${pSig}_${cSig}_${hSig}_${m24.infinityPool}_${m24.vipGuesthouse}`;
    }
    if (activeLand === "port") {
      const e = data.empire || {};
      const ySig = e.v16 && e.v16.vipAssets && e.v16.vipAssets.yacht ? 1 : 0;
      const p24 = v24.port || {};
      return `pt_${bSig}_${ySig}_${p24.unlocked}_${p24.craneLvl}_${p24.roroUnlocked}`;
    }
    if (activeLand === "station") {
      return `st_${bSig}_${data.pumpsUnlocked}_${data.lpgUnlocked}_${data.towUnlocked}_${data.busBakeryUnlocked}_${data.evUnlocked}_${data.carWashUnlocked}_${data.garageUnlocked}_${data.scaleUnlocked}_${data.restaurantUnlocked}_${data.motelUnlocked}_${data.solarInstalled}_${data.billboardInstalled}`;
    }
    if (activeLand === "land2") {
      const e = data.empire;
      return `l2_${bSig}_${e.land2Owned}_${e.parkingUnlocked}_${e.parkingCapLvl}_${e.mallUnlocked}_${e.sideLevels.logistics}_${e.sideLevels.office}`;
    }
    if (activeLand === "land3") {
      const l3 = data.empire.land3 || {};
      const bOwned = Object.values(l3.bungalows || {}).map((x) => (x.owned ? (x.rented ? 2 : 1) : 0)).join("");
      return `l3_${l3.owned}_${l3.themeUnlocked}_${l3.refineryUnlocked}_${l3.resortUnlocked}_${l3.spaUnlocked}_${bOwned}`;
    }
    const st = (data.empire.extraLands && data.empire.extraLands[activeLand]) || {};
    return `ex_${bSig}_${activeLand}_${st.owned}_${st.projectKey}_${st.floorsLvl}_${st.vipUpgrade}_${st.heliUpgrade}`;
  }

  function clearGroup(grp) {
    while (grp.children.length > 0) grp.remove(grp.children[0]);
  }

  function rebuildLandGroup(lid, data, stMeta) {
    const grp = landGroups[lid];
    if (!grp) return;
    clearGroup(grp);
    animRefs = {
      ferrisWheel: null,
      ferrisCabins: [],
      entryBarrier: null,
      exitBarrier: null,
      fuelFillMesh: null,
      fountainRings: [],
      hotelRoomMeshes: [],
      fireMesh: null,
      washRollers: [],
      windRotors: [],
      radarRotors: [],
      marketInteriorMat: null,
      restInteriorMat: null,
      motelRoomMats: []
    };
    landAnimRefs[lid] = animRefs;
    if (lid === "mansion") buildMansionScene(grp, data);
    else if (lid === "port") buildPortScene(grp, data);
    else if (lid === "station") buildStationScene(grp, data, stMeta);
    else if (lid === "land2") buildLand2Scene(grp, data);
    else if (lid === "land3") buildLand3Scene(grp, data);
    else buildExtraLandScene(grp, data, lid);
  }

  // =========================================================================
  // 60 FPS SIFIR GECİKMELİ AÇIK DÜNYA RENDER DÖNGÜSÜ (HAVUZLU & MESAFE CULLING!)
  // =========================================================================
  let lastFrameMs = performance.now();
  function renderFrame(activeLand, phase, data, stMeta) {
    if (!ready) return;
    const nowMs = performance.now();
    const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastFrameMs) / 1000));
    lastFrameMs = nowMs;

    // 10 Arazinin Tamamını Kontrol Et — Sadece Değişen Arazi Yeniden Kurulur!
    for (let i = 0; i < LAND_IDS.length; i++) {
      const lid = LAND_IDS[i];
      const sig = computeSceneSig(lid, data);
      if (sig !== landSigs[lid]) {
        landSigs[lid] = sig;
        rebuildLandGroup(lid, data, stMeta);
      }
    }

    // Dinamik Gökyüzü, Gün Batımı, Gece Yıldızları & Gerçekçi Işıklandırma!
    const n = phase.night;
    const sunset = Math.max(0, 1 - Math.abs(n - 0.42) * 3.2);
    const skyCol = new THREE.Color().setRGB(
      0.08 + (1 - n) * 0.35 + sunset * 0.24,
      0.13 + (1 - n) * 0.49 + sunset * 0.1,
      0.26 + (1 - n) * 0.6 - sunset * 0.06
    );
    scene.background.copy(skyCol);
    fog.color.copy(skyCol);
    sunLight.intensity = 0.68 + (1 - n) * 1.04;
    hemiLight.intensity = 0.6 + (1 - n) * 0.64;
    sunLight.color.setHex(n > 0.62 ? 0x93c5fd : sunset > 0.25 ? 0xfdba74 : 0xfff8e7);
    if (rimLight) {
      rimLight.intensity = 0.26 + sunset * 0.44 + (1 - n) * 0.18;
      rimLight.color.setHex(n > 0.6 ? 0x38bdf8 : sunset > 0.25 ? 0xfb923c : 0xfde68a);
    }
    if (starFieldMesh && starFieldMat) {
      starFieldMesh.visible = n > 0.32;
      if (starFieldMesh.visible) {
        starFieldMesh.position.set(curLookAt.x, 0, curLookAt.z);
        starFieldMat.opacity = Math.min(0.88, (n - 0.32) * 1.3);
      }
    }

    // Tek Aşamalı Hızlı Kamera Takibi (Parmakla Kaydırma/Döndürmede Sıfır Gecikme!)
    const pr = ELEV_PRESETS[elevIdx];
    const userActive = nowMs - lastUserInputMs < 150;
    const k = userActive ? 0.56 : 0.18;
    camZoom += (targetZoom - camZoom) * k;
    panX += (targetPanX - panX) * k;
    panZ += (targetPanZ - panZ) * k;
    curPitch += (targetPitch - curPitch) * k;

    let dYaw = targetYaw - curYaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    targetYaw = curYaw + dYaw;
    curYaw += dYaw * k;

    const portraitFit = camera.aspect < 0.8 ? Math.min(1.45, 0.8 / Math.max(0.46, camera.aspect)) : 1.0;
    const effRadius = pr.radius * camZoom * portraitFit;
    const horizDist = effRadius * Math.cos(curPitch);
    curCamPos.x = panX + Math.sin(curYaw) * horizDist;
    curCamPos.y = Math.max(11, effRadius * Math.sin(curPitch));
    curCamPos.z = panZ + pr.lookZ + Math.cos(curYaw) * horizDist;
    curLookAt.x = panX;
    curLookAt.z = panZ + pr.lookZ;

    camera.position.set(curCamPos.x, curCamPos.y, curCamPos.z);
    camera.lookAt(curLookAt.x, 0, curLookAt.z);
    camera.updateMatrixWorld();

    // Güneş Gölgesi Kamerayı Takip Eder
    sunLight.target.position.set(curLookAt.x, 0, curLookAt.z);
    sunLight.position.set(curLookAt.x + 38, 64, curLookAt.z + 30);
    sunLight.target.updateMatrixWorld();

    const isSkyOverview = elevIdx === 2 || camZoom > 1.75;

    // v27.0 Akıllı Ekran Dışı Mesafe Gizleme (Off-Screen Culling — FPS'yi 2.5 Katına Çıkarır!)
    const isLandNear = (lid) => {
      if (isSkyOverview) return true;
      const L = LAND_LAYOUT[lid];
      return Math.hypot(L.ox - curLookAt.x, L.oz - curLookAt.z) < 108;
    };
    for (let i = 0; i < LAND_IDS.length; i++) {
      const lid = LAND_IDS[i];
      if (landGroups[lid]) landGroups[lid].visible = isLandNear(lid);
    }

    // Süzülen 3D Bulutlar
    for (let ci = 0; ci < cloudMeshes.length; ci++) {
      const cg = cloudMeshes[ci];
      cg.position.x += cg.userData.speed * dt;
      if (cg.position.x > 220) cg.position.x = -220;
      if (ci === 0 && cg.userData.mat) {
        cg.userData.mat.color.setHex(n > 0.6 ? 0x64748b : sunset > 0.25 ? 0xfed7aa : 0xffffff);
        cg.userData.mat.opacity = 0.34 + (1 - n) * 0.32;
      }
    }

    // Yükselen Sıcak Baca Dumanı (Restoran & Taş Fırın!)
    const stL = LAND_LAYOUT.station;
    const stationNear = isLandNear("station");
    for (let si = 0; si < smokeMeshes.length; si++) {
      const sm = smokeMeshes[si];
      const activeSmoke = sm.userData.isOven ? !!data.busBakeryUnlocked : !!data.restaurantUnlocked;
      sm.visible = activeSmoke && stationNear && !isSkyOverview;
      if (sm.visible) {
        const cyc = (nowMs * 0.00032 + sm.userData.phase) % 1;
        const baseX = sm.userData.isOven ? stL.ox + to3DX(342) : stL.ox + to3DX(276);
        const baseZ = sm.userData.isOven ? stL.oz + to3DZ(90) : stL.oz + to3DZ(554);
        const baseY = sm.userData.isOven ? 3.4 : 5.1;
        sm.position.set(baseX + Math.sin(cyc * 5 + si) * 0.55 + cyc * 1.1, baseY + cyc * 4.2, baseZ - cyc * 0.5);
        sm.scale.setScalar(0.55 + cyc * 1.35);
        sm.material.opacity = Math.sin(cyc * Math.PI) * 0.32;
      }
    }

    // GÖRÜNÜR ARAZİLERİN DİNAMİK VARLIKLARINI TOPLA!
    const vehList = [];
    const charList = [];
    const overlayLabels = [];
    const floats = [];

    const pushVeh = (lid, lx, ly, angle, color, shape) => {
      const L = LAND_LAYOUT[lid];
      vehList.push({ wx: L.ox + to3DX(lx), wz: L.oz + to3DZ(ly), angle, color, shape: shape || "sedan" });
    };
    const pushChar = (lid, lx, ly, shirt, hat, moving, isDog = false) => {
      const L = LAND_LAYOUT[lid];
      charList.push({ wx: L.ox + to3DX(lx), wz: L.oz + to3DZ(ly), shirt, hat, moving, isDog });
    };
    const pushLbl = (lid, lx, ly, h, opts) => {
      const L = LAND_LAYOUT[lid];
      overlayLabels.push(Object.assign({ wx: L.ox + to3DX(lx), wz: L.oz + to3DZ(ly), h }, opts));
    };
    const pushFloat = (lid, ft) => {
      const L = LAND_LAYOUT[lid];
      floats.push({ wx: L.ox + to3DX(ft.x), wz: L.oz + to3DZ(ft.y), text: ft.text, color: ft.color, life: ft.life });
    };

    // 0. İki Ana Şehir Bulvarında Kesintisiz Akan Trafik!
    for (let i = 0; i < boulevardCars.length; i++) {
      const bc = boulevardCars[i];
      bc.wx += bc.dir * bc.speed * dt;
      if (bc.wx > 176) bc.wx = -176;
      if (bc.wx < -176) bc.wx = 176;
      if (isSkyOverview || Math.hypot(bc.wx - curLookAt.x, bc.wz - curLookAt.z) < 115) {
        vehList.push({
          wx: bc.wx,
          wz: bc.wz,
          angle: bc.dir > 0 ? Math.PI / 2 : -Math.PI / 2,
          color: bc.color,
          shape: bc.shape
        });
      }
    }

    // 1. ARAZİ (İSTASYON) CANLI VERİLERİ + İÇERİDEKİ MÜŞTERİ GÖRÜNÜRLÜĞÜ!
    if (stationNear) {
      const mQ = stMeta.marketQueue || 0;
      const rList = stMeta.restaurantQueue || [];
      const rQ = rList.length;
      const mWait = (stMeta.motelQueue && stMeta.motelQueue.length) || 0;
      const mOcc = (stMeta.motelOccupants && stMeta.motelOccupants.length) || 0;
      const mMax = stMeta.maxMotel || 2;

      const ar1 = landAnimRefs.station;
      if (ar1) {
        if (ar1.fuelFillMesh) {
          const pct = Math.max(0.05, Math.min(1, data.fuelStock / stMeta.maxFuel));
          ar1.fuelFillMesh.scale.y = pct;
          ar1.fuelFillMesh.position.y = 0.6 + 1.9 * pct;
        }
        if (ar1.fireMesh) ar1.fireMesh.scale.setScalar(0.85 + Math.sin(nowMs * 0.016) * 0.22);
        if (ar1.washRollers && ar1.washRollers.length > 0) {
          ar1.washRollers.forEach((r, idx) => (r.rotation.y += idx % 2 === 0 ? 0.12 : -0.12));
        }
        // Market & Restoran İç Vitrin Işığı: İçeride müşteri varken sıcak altın parlar, boşken sakin mavi kalır!
        if (ar1.marketInteriorMat) {
          ar1.marketInteriorMat.color.setHex(mQ > 0 ? 0xfef3c7 : 0x93c5fd);
          ar1.marketInteriorMat.emissive.setHex(mQ > 0 ? 0xfacc15 : 0x38bdf8);
          ar1.marketInteriorMat.emissiveIntensity = mQ > 0 ? 1.15 : 0.22;
        }
        if (ar1.restInteriorMat) {
          ar1.restInteriorMat.color.setHex(rQ > 0 ? 0xfed7aa : 0x93c5fd);
          ar1.restInteriorMat.emissive.setHex(rQ > 0 ? 0xfb923c : 0x38bdf8);
          ar1.restInteriorMat.emissiveIntensity = rQ > 0 ? 1.18 : 0.22;
        }
        // Motel 2. Kat Oda Pencereleri: İçeride kalan misafir sayısı kadar oda penceresi sıcak sarı yanar!
        if (ar1.motelRoomMats && ar1.motelRoomMats.length > 0) {
          ar1.motelRoomMats.forEach((rm, ri) => {
            if (ri < mOcc) {
              rm.color.setHex(0xfef08a);
              rm.emissive.setHex(0xf59e0b);
              rm.emissiveIntensity = 1.3;
            } else {
              rm.color.setHex(0x1e293b);
              rm.emissive.setHex(0x0284c7);
              rm.emissiveIntensity = 0.2;
            }
          });
        }
      }

      stMeta.cars.forEach((c) => {
        pushVeh("station", c.x, c.y, c.angle, c.color, c.shape);
        if (c.state === "story_wait") {
          pushLbl("station", c.x, c.y, 3.4, { text: "❗ İNCELE!", bg: "#dc2626", brd: "#fef08a", major: true });
        } else if (!isSkyOverview && !c.isStory && c.pumpIdx >= 0 && (c.state === "waiting_fuel" || c.state === "fueling")) {
          const pct = Math.min(1, c.fuelFilled / c.fuelNeeded);
          const noPumper = data.staff.ali === 0 && data.staff.murat === 0 && data.staff.hasan === 0;
          if (pct < 0.04 && noPumper) {
            pushLbl("station", c.x, c.y, 3.0, { text: "⛽ DOLDUR", bg: "#16a34a", brd: "#fef08a" });
          } else if (pct > 0.04 && pct < 0.99) {
            pushLbl("station", c.x, c.y, 2.7, { pct, barCol: "#4ade80" });
          }
        } else if (!isSkyOverview && c.state === "charging") {
          if (data.staff.kerem === 0 && !c.serviceManual) {
            pushLbl("station", c.x, c.y, 3.3, { text: "⚡ ŞARJ ET!", bg: "#0891b2", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", c.x, c.y, 3.6, { text: "⚡ EV Müşterisi", bg: "rgba(8,145,178,0.9)", brd: "#22d3ee" });
            pushLbl("station", c.x, c.y, 2.6, { pct: Math.min(1, (c.serviceProg || 0) / 100), barCol: "#22d3ee" });
          }
        } else if (!isSkyOverview && c.state === "washing") {
          if (data.staff.kadir === 0 && !c.serviceManual) {
            pushLbl("station", c.x, c.y, 3.3, { text: "🚿 YIKA!", bg: "#0284c7", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", c.x, c.y, 3.6, { text: "🚿 Yıkanıyor", bg: "rgba(3,105,161,0.9)", brd: "#38bdf8" });
            pushLbl("station", c.x, c.y, 2.6, { pct: Math.min(1, (c.serviceProg || 0) / 100), barCol: "#38bdf8" });
          }
        } else if (!isSkyOverview && c.state === "repairing") {
          if (data.staff.cemil === 0 && !c.serviceManual) {
            pushLbl("station", c.x, c.y, 3.3, { text: "🔧 ONAR!", bg: "#7e22ce", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", c.x, c.y, 3.6, { text: "🔧 Tamirde", bg: "rgba(107,33,168,0.9)", brd: "#c084fc" });
            pushLbl("station", c.x, c.y, 2.6, { pct: Math.min(1, (c.serviceProg || 0) / 100), barCol: "#c084fc" });
          }
        } else if (!isSkyOverview && c.state === "weighing") {
          if (data.staff.osman === 0 && !c.serviceManual) {
            pushLbl("station", c.x, c.y, 3.6, { text: `⚖️ TART (${c.weightTons}T)`, bg: "#ca8a04", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", c.x, c.y, 3.8, { text: `⚖️ ${c.weightTons} TON`, bg: "rgba(133,77,14,0.9)", brd: "#facc15" });
            pushLbl("station", c.x, c.y, 2.8, { pct: Math.min(1, (c.serviceProg || 0) / 100), barCol: "#facc15" });
          }
        } else if (!isSkyOverview && c.state === "lpg_filling") {
          const hasPumper = data.staff.ali > 0 || data.staff.murat > 0 || data.staff.hasan > 0;
          if (!hasPumper && !c.serviceManual && !stMeta.pointerHeldLpg) {
            pushLbl("station", c.x, c.y, 3.3, { text: "🔵 LPG VER!", bg: "#0284c7", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", c.x, c.y, 2.7, { pct: Math.min(1, (c.serviceProg || 0) / 100), barCol: "#38bdf8" });
          }
        }
      });

      if (stMeta.tanker) pushVeh("station", stMeta.tanker.x, stMeta.tanker.y, stMeta.tanker.angle, "#ea580c", "tanker");
      if (stMeta.activeTowTruck) pushVeh("station", stMeta.activeTowTruck.x, stMeta.activeTowTruck.y, stMeta.activeTowTruck.angle, "#f59e0b", "tow");
      if (stMeta.activeBus) {
        pushVeh("station", stMeta.activeBus.x, stMeta.activeBus.y, stMeta.activeBus.angle, stMeta.activeBus.color, "bus");
        if (!isSkyOverview && stMeta.activeBus.phase === "boarding") {
          pushLbl("station", stMeta.activeBus.x, stMeta.activeBus.y, 3.6, { text: "🚌 YOLCU MOLASI • 🥖 Sıcak Ekmek", bg: "rgba(154,52,18,0.92)", brd: "#fde047" });
        }
      }
      if (stMeta.policeCruiser) pushVeh("station", stMeta.policeCruiser.x, stMeta.policeCruiser.y, stMeta.policeCruiser.angle, "#1e3a8a", "sedan");

      const wMap = stMeta.workers;
      ["ali", "murat", "hasan", "zeynep", "mehmet", "selin", "kerem", "kadir", "cemil", "osman"].forEach((k) => {
        if (data.staff[k] > 0 && wMap[k]) pushChar("station", wMap[k].x, wMap[k].y, wMap[k].color, wMap[k].hat, !!wMap[k].moving);
      });
      if (data.dumanHired && wMap.duman) pushChar("station", wMap.duman.x, wMap.duman.y, "", "", true, true);

      // Yürüyen Müşteriler + Market/Restoran/Motel İçindeki Görünür 3D Müşteriler!
      const insideMarketShoppers = [];
      stMeta.shoppers.forEach((sh) => {
        if (sh.phase !== "inside") {
          pushChar("station", sh.x, sh.y, sh.shirt, sh.hair, true);
        } else if (sh.dest === "market") {
          insideMarketShoppers.push(sh);
        }
      });

      // 1a) MARKET: Vitrin önünde / kasada bekleyen 3D müşteriler + Canlı Rozet!
      const fallbackCols = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
      for (let mi = 0; mi < Math.min(mQ, 4); mi++) {
        const ref = insideMarketShoppers[mi];
        pushChar(
          "station",
          92 + mi * 12,
          470 - (mi % 2) * 5,
          (ref && ref.shirt) || fallbackCols[mi % fallbackCols.length],
          (ref && ref.hair) || "#18181b",
          false
        );
      }
      if (!isSkyOverview) {
        if (stMeta.powerOutage) {
          pushLbl("station", stMeta.MARKET_POS.doorX, stMeta.MARKET_POS.y + 40, 5.6, { text: "⚡ SİGORTAYI AÇ!", bg: "#dc2626", brd: "#fde047", major: true });
        } else if (mQ > 0) {
          if (data.staff.zeynep === 0) {
            pushLbl("station", 112, 488, 5.4, { text: `🛒 MARKET: ${mQ} Müşteri • DOKUN SAT!`, bg: "#16a34a", brd: "#fef08a", major: true });
          } else {
            pushLbl("station", 112, 488, 5.6, { text: `🛒 MARKET: ${mQ} Müşteri`, bg: "rgba(20,83,45,0.92)", brd: "#4ade80" });
            pushLbl("station", 112, 488, 4.3, { pct: Math.min(1, (stMeta.marketProgress || 0) / 100), barCol: "#4ade80" });
          }
        } else {
          pushLbl("station", 112, 492, 5.2, { text: "🏪 MARKET • Boş", bg: "rgba(15,23,42,0.74)", brd: "#64748b" });
        }
      }

      // 1b) RESTORAN: Şemsiyeli teras masalarında oturan/bekleyen 3D müşteriler + Canlı Rozet!
      if (data.restaurantUnlocked) {
        const seatCoords = [
          [211, 464],
          [267, 464],
          [224, 471],
          [254, 471]
        ];
        for (let ri = 0; ri < Math.min(rQ, 4); ri++) {
          const ref = rList[ri] && rList[ri].shopperRef;
          pushChar(
            "station",
            seatCoords[ri][0],
            seatCoords[ri][1],
            (ref && ref.shirt) || fallbackCols[(ri + 2) % fallbackCols.length],
            (ref && ref.hair) || "#451a03",
            false
          );
        }
        if (!isSkyOverview) {
          if (rQ > 0) {
            const dishEmoji = (rList[0] && rList[0].emoji) || "🍽️";
            if (data.staff.mehmet === 0) {
              pushLbl("station", 239, 488, 5.4, { text: `🍽️ RESTORAN: ${rQ} Müşteri ${dishEmoji} • SERVİS ET!`, bg: "#ea580c", brd: "#fef08a", major: true });
            } else {
              pushLbl("station", 239, 488, 5.6, { text: `🍽️ RESTORAN: ${rQ} Müşteri ${dishEmoji}`, bg: "rgba(124,45,18,0.92)", brd: "#fb923c" });
              pushLbl("station", 239, 488, 4.3, { pct: Math.min(1, (stMeta.restaurantProgress || 0) / 100), barCol: "#fb923c" });
            }
          } else {
            pushLbl("station", 239, 492, 5.2, { text: "🍽️ RESTORAN • Boş", bg: "rgba(15,23,42,0.74)", brd: "#64748b" });
          }
        }
      }

      // 1c) MİNİ MOTEL: Resepsiyon önü bekleyen misafirler + Dolu Oda Sayısı Rozeti!
      if (data.motelUnlocked) {
        for (let gi = 0; gi < Math.min(mWait, 3); gi++) {
          const ref = stMeta.motelQueue[gi] && stMeta.motelQueue[gi].shopperRef;
          pushChar(
            "station",
            356 + gi * 13,
            470,
            (ref && ref.shirt) || fallbackCols[(gi + 1) % fallbackCols.length],
            (ref && ref.hair) || "#27272a",
            false
          );
        }
        if (!isSkyOverview) {
          if (mWait > 0 && data.staff.selin === 0 && mOcc < mMax) {
            pushLbl("station", 368, 492, 6.8, { text: `🏨 MOTEL: ${mWait} Misafir • ODA VER!`, bg: "#db2777", brd: "#fef08a", major: true });
          } else if (mOcc > 0 || mWait > 0) {
            pushLbl("station", 368, 492, 6.9, { text: `🏨 MOTEL: ${mOcc}/${mMax} Dolu${mWait > 0 ? ` (+${mWait} Sırada)` : ""}`, bg: "rgba(131,24,67,0.92)", brd: "#f472b6" });
            if (mWait > 0 && data.staff.selin > 0 && mOcc < mMax) {
              pushLbl("station", 368, 492, 5.5, { pct: Math.min(1, (stMeta.motelProgress || 0) / 100), barCol: "#f472b6" });
            }
          } else {
            pushLbl("station", 368, 492, 6.6, { text: `🏨 MOTEL • 0/${mMax} Boş`, bg: "rgba(15,23,42,0.74)", brd: "#64748b" });
          }
        }
      }

      // Sıradaki açılabilir pompa ve kilitli ön sıra binalar için 3D harita üstü ipucu!
      if (!isSkyOverview) {
        if (data.pumpsUnlocked < stMeta.PUMPS.length) {
          const nextP = stMeta.PUMPS[data.pumpsUnlocked];
          pushLbl("station", nextP.x, nextP.y + 10, 1.9, {
            text: `🔒 ${nextP.short} (${nextP.unlockCost}₺)`,
            bg: "rgba(15,23,42,0.82)",
            brd: "#94a3b8"
          });
        }
        if (data.pumpsUnlocked >= 2 && !data.restaurantUnlocked) {
          pushLbl("station", 239, 512, 1.9, {
            text: `🔒 Restoran (${stMeta.RESTAURANT_POS.unlockCost}₺)`,
            bg: "rgba(15,23,42,0.82)",
            brd: "#fb923c"
          });
        }
        if (data.pumpsUnlocked >= 2 && !data.motelUnlocked) {
          pushLbl("station", 368, 512, 1.9, {
            text: `🔒 Motel (${stMeta.MOTEL_POS.unlockCost}₺)`,
            bg: "rgba(15,23,42,0.82)",
            brd: "#f472b6"
          });
        }
      }

      if (!isSkyOverview) stMeta.floatingTexts.forEach((ft) => pushFloat("station", ft));
      if (isSkyOverview) {
        pushLbl("station", 240, 260, 7.5, { text: "⛽ 1. İSTASYON", bg: "rgba(153,27,27,0.92)", brd: "#facc15", major: true });
      }
    }

    // 2. ARAZİ (OTOPARK & GRAND AVM) CANLI VERİLERİ
    if (isLandNear("land2") && window.EmpireSystem && window.EmpireSystem.get3DState) {
      const s2 = window.EmpireSystem.get3DState();
      const emp = data.empire;
      const ar2 = landAnimRefs.land2;
      if (emp.land2Owned) {
        s2.parkingCars.forEach((c) => {
          if (!(c.isDeck && c.state === "parked")) pushVeh("land2", c.x, c.y, c.angle, c.color, c.shape);
        });
        if (emp.mallUnlocked && s2.mallDeliveryWaiting) {
          pushVeh("land2", 96, 296, Math.PI / 2, "#ea580c", "truck");
        }
        s2.lotShoppers.forEach((sh) => pushChar("land2", sh.x, sh.y, sh.shirt, sh.hair, true));
        if (!isSkyOverview) s2.land2Floats.forEach((ft) => pushFloat("land2", ft));
        if (ar2) {
          if (ar2.entryBarrier) ar2.entryBarrier.rotation.z += ((s2.entryGateOpen ? Math.PI * 0.42 : 0) - ar2.entryBarrier.rotation.z) * 0.2;
          if (ar2.exitBarrier) ar2.exitBarrier.rotation.z += ((s2.exitGateOpen ? Math.PI * 0.42 : 0) - ar2.exitBarrier.rotation.z) * 0.2;
          if (ar2.fountainRings[0]) ar2.fountainRings[0].scale.y = 0.85 + Math.sin(nowMs * 0.008) * 0.22;
        }
        if (isSkyOverview) {
          pushLbl("land2", 240, 360, 12.0, { text: "🏬 2. GRAND AVM", bg: "rgba(124,45,18,0.92)", brd: "#fde047", major: true });
        } else {
          const waitingGateCars = s2.parkingCars.filter((c) => c.waitingAtBooth).length;
          const l2Stf = emp.land2Staff || {};
          pushLbl("land2", 230, 110, 4.0, { text: emp.parkingUnlocked ? `🅿️ OTOPARK (${s2.parkingCars.length} Araç)` : `🔒 Otopark (${window.EmpireSystem.PARKING_UNLOCK_COST}₺)`, bg: "rgba(9,13,26,0.88)", brd: "#38bdf8" });
          if (emp.parkingUnlocked && waitingGateCars > 0 && !l2Stf.gateOfficer && !l2Stf.land2Manager) {
            pushLbl("land2", 392, 108, 3.8, { text: `🎫 ÜCRET AL (${waitingGateCars})!`, bg: "#16a34a", brd: "#fef08a", major: true });
          }
          if (emp.mallUnlocked && s2.mallDeliveryWaiting) {
            pushLbl("land2", 98, 296, 3.6, { text: "📦 MAL KABUL YAP!", bg: "#ea580c", brd: "#fef08a", major: true });
          }
          if (emp.mallUnlocked && s2.mallNeedsCleaning) {
            pushLbl("land2", 174, 368, 3.6, { text: "🧹 AVM BAKIM YAP!", bg: "#dc2626", brd: "#fef08a", major: true });
          }
          pushLbl("land2", 174, 456, 11.6, {
            text: emp.mallUnlocked ? `🏬 GRAND AVM (${s2.lotShoppers.length} Müşteri)` : `🔒 AVM Kur (${window.EmpireSystem.MALL_UNLOCK_COST}₺)`,
            bg: "rgba(124,45,18,0.92)",
            brd: "#fde047"
          });
          const logLvl = (emp.sideLevels && emp.sideLevels.logistics) || 0;
          const offLvl = (emp.sideLevels && emp.sideLevels.office) || 0;
          pushLbl("land2", 370, 388, logLvl > 0 ? 4.4 + logLvl * 0.5 : 2.0, {
            text: logLvl > 0 ? `📦 LOJİSTİK ★${logLvl}` : "🔒 Lojistik (4200₺)",
            bg: logLvl > 0 ? "rgba(6,78,59,0.9)" : "rgba(15,23,42,0.84)",
            brd: "#34d399"
          });
          pushLbl("land2", 370, 524, offLvl > 0 ? 6.8 + offLvl * 2.0 : 2.0, {
            text: offLvl > 0 ? `🏢 PLAZA ★${offLvl}` : "🔒 Plaza (9500₺)",
            bg: offLvl > 0 ? "rgba(15,23,42,0.92)" : "rgba(15,23,42,0.84)",
            brd: "#38bdf8"
          });
        }
      } else {
        pushLbl("land2", 240, 310, 6.2, { text: `🏗️ 2. ARAZİ AL (${window.EmpireSystem.LAND2_COST}₺)`, bg: "#16a34a", brd: "#fef08a", major: true });
      }
    }

    // 3. ARAZİ (LUNAPARK, RAFİNERİ & TATİL KÖYÜ) CANLI VERİLERİ
    if (isLandNear("land3") && window.Land3System && window.Land3System.get3DState) {
      const s3 = window.Land3System.get3DState();
      const l3 = data.empire.land3 || {};
      const ar3 = landAnimRefs.land3;
      if (l3.owned) {
        s3.activeFleetTrucks.forEach((tr) => pushVeh("land3", tr.x, tr.y, tr.angle, tr.color, "truck"));
        s3.resortGuests.forEach((g) => pushChar("land3", g.x, g.y, g.shirt, "#18181b", true));
        if (!isSkyOverview) s3.land3Floats.forEach((ft) => pushFloat("land3", ft));
        if (l3.themeUnlocked) {
          s3.karts.forEach((k) => {
            const p1 = s3.KART_TRACK_PTS[k.seg];
            const p2 = s3.KART_TRACK_PTS[(k.seg + 1) % s3.KART_TRACK_PTS.length];
            const kx = p1.x + (p2.x - p1.x) * k.t;
            const ky = p1.y + (p2.y - p1.y) * k.t;
            pushVeh("land3", kx, ky, Math.atan2(p2.x - p1.x, -(p2.y - p1.y)), k.col, "sport");
          });
        }
        if (ar3 && ar3.ferrisWheel) {
          ar3.ferrisWheel.rotation.z = s3.wheelAngle;
          ar3.ferrisCabins.forEach((cab) => (cab.rotation.z = -s3.wheelAngle));
        }
        if (isSkyOverview) {
          pushLbl("land3", 240, 290, 12.5, { text: "🎡 3. LUNAPARK & KÖY", bg: "rgba(131,24,67,0.92)", brd: "#f472b6", major: true });
        } else {
          pushLbl("land3", 150, 170, 12.2, { text: l3.themeUnlocked ? `🎡 LUNAPARK ★${l3.themeLvl}` : `🔒 Lunapark`, bg: "rgba(131,24,67,0.9)", brd: "#f472b6" });
          pushLbl("land3", 346, 200, 9.0, { text: `🏭 RAFİNERİ & ${l3.fleetCount || 0}/10`, bg: "rgba(15,23,42,0.9)", brd: "#38bdf8" });
          pushLbl("land3", 240, 470, 4.8, { text: l3.resortUnlocked ? `🏖️ TATİL KÖYÜ (${s3.resortGuests.length} Misafir)` : `🔒 Tatil Köyü`, bg: "rgba(4,120,87,0.9)", brd: "#4ade80" });
        }
      } else {
        pushLbl("land3", 240, 310, 6.2, { text: `🎡 3. ARAZİ AL (${window.Land3System.LAND3_COST}₺)`, bg: "#7c3aed", brd: "#fef08a", major: true });
      }
    }

    // 4.–10. ARAZİLERİN TAMAMI (Ekran İçi Mesafe Kontrollü!)
    if (window.ExtraLandsSystem && window.ExtraLandsSystem.get3DState) {
      for (let idx = 4; idx <= 10; idx++) {
        const lid = `land${idx}`;
        if (!isLandNear(lid)) continue;
        const rt = window.ExtraLandsSystem.get3DState(lid);
        const lDef = window.ExtraLandsSystem.getLandDef(lid);
        const st = data.empire.extraLands && data.empire.extraLands[lid];
        const arX = landAnimRefs[lid];
        if (!rt || !st) continue;
        if (st.owned) {
          rt.waitingCars.forEach((c) => pushVeh(lid, c.x, c.y, c.angle, c.color, c.shape));
          rt.walkers.forEach((w) => pushChar(lid, w.x, w.y, w.col, "#18181b", true));
          if (!isSkyOverview) rt.floats.forEach((ft) => pushFloat(lid, ft));
          const occU = rt.occupiedTimers.length;
          const dirtyU = rt.dirtyCount;
          if (arX && arX.windRotors && arX.windRotors.length > 0) {
            arX.windRotors.forEach((wr) => (wr.rotation.z -= 1.65 * dt));
          }
          if (arX && arX.radarRotors && arX.radarRotors.length > 0) {
            arX.radarRotors.forEach((rr) => (rr.rotation.y += 2.2 * dt));
          }
          if (arX && arX.hotelRoomMeshes) {
            arX.hotelRoomMeshes.forEach((mat, rIdx) => {
              if (rIdx < occU) {
                mat.color.setHex(0xfef08a); mat.emissive.setHex(0xf59e0b); mat.emissiveIntensity = 1.15;
              } else if (rIdx < occU + dirtyU) {
                mat.color.setHex(0xc2410c); mat.emissive.setHex(0x9a3412); mat.emissiveIntensity = 0.65;
              } else {
                mat.color.setHex(0x1e3a5f); mat.emissive.setHex(0x0284c7); mat.emissiveIntensity = 0.3;
              }
            });
          }
          if (!st.projectKey) {
            pushLbl(lid, 240, 360, 4.5, { text: `🏗️ ${idx}. ARAZİ PROJE SEÇ`, bg: "#0284c7", brd: "#fef08a", major: true });
          } else {
            const proj = window.ExtraLandsSystem.getProjectDef(st.projectKey);
            const maxU = 6 * (st.floorsLvl || 1);
            const hTop = 5.5 + (st.floorsLvl || 1) * 3.0;
            pushLbl(lid, 240, 420, hTop + 2.2, {
              text: isSkyOverview ? `${proj.emoji} ${idx}. ${proj.short || proj.name}` : `${proj.emoji} ${proj.name} ★${st.floorsLvl} (${occU}/${maxU} Müşteri)`,
              bg: "rgba(9,13,26,0.9)",
              brd: proj.accent,
              major: true
            });
            if (!isSkyOverview) {
              const waitingReady = rt.waitingCars.filter((c) => c.arrived).length;
              const stf = st.staff || {};
              if (waitingReady > 0 && !stf.clerk && !stf.manager) {
                pushLbl(lid, 148, 548, 2.2, {
                  text: `${proj.checkinLabel} (${waitingReady})!`,
                  bg: "#16a34a",
                  brd: "#fef08a",
                  major: true
                });
              }
              if (dirtyU > 0 && !stf.cleaner && !stf.manager) {
                pushLbl(lid, 332, 548, 2.2, {
                  text: `${proj.prepLabel} (${dirtyU})!`,
                  bg: "#ea580c",
                  brd: "#fef08a",
                  major: true
                });
              }
            }
          }
        } else {
          pushLbl(lid, 240, 310, 6.2, { text: `🏞️ ${lDef.num}. ARSA (${lDef.deedCost.toLocaleString("tr-TR")}₺)`, bg: "#16a34a", brd: "#fef08a", major: true });
        }
      }
    }

    // v23.0 — 3D PATRON MAKAM ARACI SÜRÜŞÜ, ARAZİLER ARASI AMBULANS/İTFAİYE VE 2X TEFTİŞ ETİKETLERİ!
    let v23Render = null;
    if (window.MechanicsV23 && window.MechanicsV23.get3DRenderState) {
      v23Render = window.MechanicsV23.get3DRenderState(data);
      if (v23Render.bossDrive) {
        const bd = v23Render.bossDrive;
        vehList.push({
          wx: bd.wx,
          wz: bd.wz,
          angle: Math.PI - bd.angle,
          color: bd.color,
          shape: bd.shape
        });
        overlayLabels.push({
          wx: bd.wx,
          wz: bd.wz,
          h: 3.1,
          text: bd.tag,
          bg: "rgba(153, 27, 27, 0.94)",
          brd: "#fde047",
          major: true
        });
      }
      if (v23Render.emergencyVehicle) {
        const ev = v23Render.emergencyVehicle;
        vehList.push({
          wx: ev.wx,
          wz: ev.wz,
          angle: Math.PI - ev.angle,
          color: ev.kind === "ambulance" ? "#f8fafc" : "#dc2626",
          shape: ev.kind === "ambulance" ? "ambulance" : "fire"
        });
        overlayLabels.push({
          wx: ev.wx,
          wz: ev.wz,
          h: 3.6,
          text: ev.kind === "ambulance" ? "🚑 ACİL AMBULANS" : "🚒 ACİL EKİP",
          bg: "#dc2626",
          brd: "#fef08a",
          major: true
        });
      }
      if (v23Render.pendingEmergencyLand) {
        const pL = LAND_LAYOUT[v23Render.pendingEmergencyLand.landId];
        if (pL) {
          overlayLabels.push({
            wx: pL.ox,
            wz: pL.oz,
            h: 11.5,
            text: v23Render.pendingEmergencyLand.kind === "ambulance" ? "🚨 🚑 ACİL DURUM!" : "🚨 🚒 KIVILCIM ALARMI!",
            bg: "#dc2626",
            brd: "#fef08a",
            major: true
          });
        }
      }
      if (v23Render.inspectedLands) {
        Object.keys(v23Render.inspectedLands).forEach((lid) => {
          const rem = v23Render.inspectedLands[lid];
          if (rem > 0 && LAND_LAYOUT[lid]) {
            overlayLabels.push({
              wx: LAND_LAYOUT[lid].ox,
              wz: LAND_LAYOUT[lid].oz - 14,
              h: 6.2,
              text: `📣 2X HIZ (${Math.ceil(rem)}sn)`,
              bg: "rgba(21, 128, 61, 0.92)",
              brd: "#fde047",
              major: true
            });
          }
        });
      }
      if (v23Render.floats) {
        v23Render.floats.forEach((ft) => floats.push(ft));
      }
    }

    // v24.0 + v27.0 — 🏡 MALİKANE, 🚕 ŞEHİR TAKSİ FİLOSU, ⚽ STADYUM, ⚓ İHRACAT GEMİSİ & DENİZ!
    if (seaWaterMat && isLandNear("port")) {
      seaWaterMat.emissiveIntensity = 0.24 + Math.sin(nowMs * 0.0022) * 0.08;
      if (seaWaterMat.map) {
        seaWaterMat.map.offset.x = (nowMs * 0.000045) % 1;
        seaWaterMat.map.offset.y = Math.sin(nowMs * 0.0004) * 0.04;
      }
    }
    if (window.CityV24 && window.CityV24.get3DRenderState) {
      const s24 = window.CityV24.get3DRenderState(data);
      const v24 = s24.v24 || {};

      if (isLandNear("mansion")) {
        overlayLabels.push({
          wx: LAND_LAYOUT.mansion.ox,
          wz: LAND_LAYOUT.mansion.oz,
          h: 11.2,
          text: "🏡 PATRON MALİKANESİ & GARAJ",
          bg: "rgba(20, 83, 45, 0.92)",
          brd: "#fde047",
          major: true
        });
      }
      if (isLandNear("port")) {
        overlayLabels.push({
          wx: LAND_LAYOUT.port.ox,
          wz: LAND_LAYOUT.port.oz,
          h: 10.5,
          text: v24.port && v24.port.unlocked ? `⚓ İHRACAT LİMANI ★${v24.port.craneLvl}` : "⚓ LİMAN KUR (42.000₺)",
          bg: "rgba(12, 74, 110, 0.92)",
          brd: "#38bdf8",
          major: true
        });
      }
      if (stationNear) {
        overlayLabels.push({
          wx: -143,
          wz: -26,
          h: 4.8,
          text: v24.taxi && v24.taxi.unlocked ? `🚕 TAKSİ (${v24.taxi.fleetCount}/8)` : "🚕 TAKSİ DURAĞI",
          bg: "rgba(113, 63, 18, 0.92)",
          brd: "#facc15",
          major: false
        });
      }

      // Canlı Taksi & Şehir Dolmuşları (Sarı taksilere ışıklı TAKSİ tabelası!)
      s24.taxis.forEach((tx) => {
        if (isSkyOverview || Math.hypot(tx.wx - curLookAt.x, tx.wz - curLookAt.z) < 115) {
          vehList.push({
            wx: tx.wx,
            wz: tx.wz,
            angle: Math.PI - tx.angle,
            color: tx.color,
            shape: tx.shape === "sedan" && tx.color === "#facc15" ? "taxi" : tx.shape
          });
        }
      });

      // Canlı 3D Kargo Gemisi (Güney Denizinde Yüzer!)
      if (s24.cargoShip && isLandNear("port")) {
        if (!cargoShipMesh) {
          cargoShipMesh = createCargoShip3D();
          scene.add(cargoShipMesh);
        }
        cargoShipMesh.visible = true;
        cargoShipMesh.position.set(s24.cargoShip.wx, Math.sin(nowMs * 0.003) * 0.16, s24.cargoShip.wz);
        overlayLabels.push({
          wx: s24.cargoShip.wx,
          wz: s24.cargoShip.wz,
          h: 10.2,
          text: s24.cargoShip.phase === "loading" ? `🚢 YÜKLENİYOR (+${s24.cargoShip.payout.toLocaleString("tr-TR")}₺)` : `🚢 ${s24.cargoShip.cargoDef.emoji} İHRACAT GEMİSİ`,
          bg: "rgba(153, 27, 27, 0.92)",
          brd: "#fde047",
          major: true
        });
      } else if (cargoShipMesh) {
        cargoShipMesh.visible = false;
      }

      // Canlı Futbol Maçı Skorbordu
      if (s24.liveMatch) {
        const mLid = s24.liveMatch.stadiumLandId || "land7";
        const sL = LAND_LAYOUT[mLid] || LAND_LAYOUT.land7;
        overlayLabels.push({
          wx: sL.ox,
          wz: sL.oz,
          h: 16.5,
          text: `⚽ ${s24.liveMatch.minute}' | ${s24.liveMatch.myScore} - ${s24.liveMatch.oppScore}`,
          bg: "#15803d",
          brd: "#fef08a",
          major: true
        });
      }

      if (s24.floats) {
        s24.floats.forEach((ft) => floats.push(ft));
      }

      // Köşe Mini Radar Çizimini Saniyede ~11 Kez Güncelle (Ana 3D FPS'yi Hiç Yormaz!)
      if (window.CityV24.renderMiniRadar && nowMs - lastRadarMs > 90) {
        lastRadarMs = nowMs;
        window.CityV24.renderMiniRadar(data, activeLand, curLookAt);
      }
    }

    // v27.0 SIFIR TAHSİSLİ ŞEKİL BAZLI ARAÇ HAVUZU (0 Mesh Yıkımı / 0 Bellek Sızıntısı!)
    const shapeUsed = {};
    for (let i = 0; i < vehList.length; i++) {
      const v = vehList[i];
      const sh = v.shape || "sedan";
      if (!vehiclePools[sh]) vehiclePools[sh] = [];
      const pool = vehiclePools[sh];
      const idx = shapeUsed[sh] || 0;
      shapeUsed[sh] = idx + 1;
      let mesh = pool[idx];
      if (!mesh) {
        mesh = createVehicle3D(v.color, sh);
        dynamicGroup.add(mesh);
        pool.push(mesh);
      }
      if (mesh.userData.color !== v.color) {
        mesh.userData.color = v.color;
        if (mesh.userData.bodyMat) mesh.userData.bodyMat.color.set(v.color || "#ef4444");
        if (mesh.userData.roofMat) mesh.userData.roofMat.color.set(v.color || "#ef4444");
        if (mesh.userData.policeBar) mesh.userData.policeBar.visible = v.color === "#1e3a8a";
      }
      if (mesh.userData.taxiSign) {
        mesh.userData.taxiSign.visible = sh === "taxi" || (sh === "sedan" && v.color === "#facc15");
      }
      mesh.visible = true;
      mesh.position.set(v.wx, 0.08, v.wz);
      mesh.rotation.y = -v.angle;
      if (mesh.userData.headlightBeam) {
        mesh.userData.headlightBeam.visible = n > 0.34 && !isSkyOverview;
      }
    }
    const poolShapes = Object.keys(vehiclePools);
    for (let si = 0; si < poolShapes.length; si++) {
      const sh = poolShapes[si];
      const pool = vehiclePools[sh];
      const used = shapeUsed[sh] || 0;
      for (let kIdx = used; kIdx < pool.length; kIdx++) {
        pool[kIdx].visible = false;
      }
    }

    // Canlı 3D Yakıt / EV / LPG Dolum Hortumları
    const activeFueling = [];
    if (stationNear && !isSkyOverview) {
      stMeta.cars.forEach((c) => {
        if (c.state === "fueling" && c.pumpIdx >= 0 && stMeta.PUMPS[c.pumpIdx]) {
          activeFueling.push({ px: stMeta.PUMPS[c.pumpIdx].x, py: stMeta.PUMPS[c.pumpIdx].y, car: c });
        } else if (c.state === "charging" && stMeta.EV_POS) {
          activeFueling.push({ px: stMeta.EV_POS.x + 14, py: stMeta.EV_POS.y + 48, car: c });
        } else if (c.state === "lpg_filling" && stMeta.LPG_POS) {
          activeFueling.push({ px: stMeta.LPG_POS.x, py: stMeta.LPG_POS.y, car: c });
        }
      });
    }
    while (fuelHoseMeshes.length < activeFueling.length) {
      const hm = new THREE.Mesh(
        getCylGeo(0.08, 0.08, 1, 6),
        getMat("#22c55e", { emissive: "#16a34a", emInt: 0.75, shadow: false })
      );
      dynamicGroup.add(hm);
      fuelHoseMeshes.push(hm);
    }
    const upVec = new THREE.Vector3(0, 1, 0);
    for (let hi = 0; hi < fuelHoseMeshes.length; hi++) {
      const hm = fuelHoseMeshes[hi];
      if (hi < activeFueling.length) {
        const { px, py, car } = activeFueling[hi];
        const p1 = new THREE.Vector3(stL.ox + to3DX(px), 1.35, stL.oz + to3DZ(py));
        const p2 = new THREE.Vector3(stL.ox + to3DX(car.x), 0.92, stL.oz + to3DZ(car.y));
        const distH = p1.distanceTo(p2);
        hm.visible = distH > 0.2 && distH < 10;
        if (hm.visible) {
          hm.position.copy(p1).add(p2).multiplyScalar(0.5);
          hm.scale.set(1, distH, 1);
          hm.quaternion.setFromUnitVectors(upVec, p2.sub(p1).normalize());
        }
      } else {
        hm.visible = false;
      }
    }

    // v27.0 SIFIR TAHSİSLİ KARAKTER HAVUZU (İnsan & Köpek Ayrı Havuzlarda!)
    const walkT = nowMs * 0.015;
    let humanUsed = 0;
    let dogUsed = 0;
    for (let i = 0; i < charList.length; i++) {
      const c = charList[i];
      let mesh;
      if (c.isDog) {
        mesh = dogCharPool[dogUsed];
        if (!mesh) {
          mesh = createCharacter3D("", "", true);
          dynamicGroup.add(mesh);
          dogCharPool.push(mesh);
        }
        dogUsed++;
      } else {
        mesh = humanCharPool[humanUsed];
        if (!mesh) {
          mesh = createCharacter3D(c.shirt || "#38bdf8", c.hat || "#1e293b", false);
          dynamicGroup.add(mesh);
          humanCharPool.push(mesh);
        }
        humanUsed++;
        const sCol = c.shirt || "#38bdf8";
        const hCol = c.hat || "#1e293b";
        if (mesh.userData.shirtCol !== sCol) {
          mesh.userData.shirtCol = sCol;
          mesh.userData.shirtMat.color.set(sCol);
        }
        if (mesh.userData.hatCol !== hCol) {
          mesh.userData.hatCol = hCol;
          mesh.userData.hatMat.color.set(hCol);
        }
      }
      mesh.visible = true;
      const bob = c.moving ? Math.abs(Math.sin(walkT + i)) * 0.14 : 0;
      mesh.position.set(c.wx, 0.08 + bob, c.wz);
      if (mesh.userData.legL) {
        const sw = c.moving ? Math.sin(walkT + i) * 0.58 : 0;
        mesh.userData.legL.rotation.x = sw;
        mesh.userData.legR.rotation.x = -sw;
        if (mesh.userData.armL) {
          mesh.userData.armL.rotation.x = -sw * 0.85;
          mesh.userData.armR.rotation.x = sw * 0.85;
        }
      }
      if (mesh.userData.tail) {
        mesh.userData.tail.rotation.z = Math.sin(walkT * 1.8) * 0.55;
      }
    }
    for (let hi = humanUsed; hi < humanCharPool.length; hi++) humanCharPool[hi].visible = false;
    for (let di = dogUsed; di < dogCharPool.length; di++) dogCharPool[di].visible = false;

    // Helikopter & Hava Efektleri
    if (window.HoldingV16 && window.HoldingV16.get3DState) {
      const v16s = window.HoldingV16.get3DState();
      if (v16s.heliFly && v16s.heliFly.active) {
        if (!heliMesh) {
          heliMesh = createHelicopter3D();
          scene.add(heliMesh);
        }
        heliMesh.visible = true;
        heliMesh.position.set(curLookAt.x + to3DX(v16s.heliFly.x), 17.5, curLookAt.z + to3DZ(v16s.heliFly.y));
        heliMesh.rotation.y = -Math.PI * 0.4;
        if (heliMesh.userData.rotorPivot) heliMesh.userData.rotorPivot.rotation.y = v16s.heliFly.rotor;
      } else if (heliMesh) {
        heliMesh.visible = false;
      }

      const particles = v16s.snowFlakes.length > 0 ? v16s.snowFlakes : v16s.confettiBits;
      const isSnow = v16s.snowFlakes.length > 0;
      while (weatherMeshes.length < particles.length) {
        const pm = new THREE.Mesh(
          getBoxGeo(0.3, 0.14, 0.3),
          getMat("#ffffff", { emissive: "#e0f2fe", emInt: 0.7, shadow: false })
        );
        weatherGroup.add(pm);
        weatherMeshes.push(pm);
      }
      for (let i = 0; i < weatherMeshes.length; i++) {
        if (i < particles.length) {
          const p = particles[i];
          const pm = weatherMeshes[i];
          pm.visible = true;
          pm.position.set(curLookAt.x + to3DX(p.x) * 1.5, 26 - (p.y / 620) * 25, curLookAt.z + to3DZ((p.y * 0.9 + i * 17) % 600) * 1.5);
          if (!isSnow && p.col) pm.material = getMat(p.col, { emissive: p.col, emInt: 0.6, shadow: false });
          else if (isSnow) pm.material = getMat("#ffffff", { emissive: "#bae6fd", emInt: 0.7, shadow: false });
          pm.rotation.y += 0.08;
        } else {
          weatherMeshes[i].visible = false;
        }
      }
    }

    renderer.render(scene, camera);

    // Ekran Üstü Net 2D Etiketler & Kazanç Yazıları
    if (overlayCtx && overlayCanvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
      const cw = overlayCanvas.width / dpr;
      const ch = overlayCanvas.height / dpr;
      overlayCtx.save();
      overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayCtx.clearRect(0, 0, cw, ch);

      overlayLabels.forEach((lbl) => {
        if (isSkyOverview && !lbl.major) return;
        const sc = worldPosToScreen(lbl.wx, lbl.h || 3, lbl.wz);
        if (!sc.visible || sc.x < 2 || sc.x > cw - 2 || sc.y < 14 || sc.y > ch - 14) return;

        if (lbl.pct !== undefined) {
          const bx = Math.max(26, Math.min(cw - 26, sc.x));
          overlayCtx.fillStyle = "rgba(9, 13, 26, 0.9)";
          overlayCtx.strokeStyle = lbl.barCol || "#4ade80";
          overlayCtx.lineWidth = 1.3;
          overlayCtx.beginPath();
          overlayCtx.roundRect(bx - 23, sc.y - 4.5, 46, 8.4, 4);
          overlayCtx.fill();
          overlayCtx.stroke();
          overlayCtx.fillStyle = lbl.barCol || "#4ade80";
          overlayCtx.fillRect(bx - 21, sc.y - 2.8, 42 * Math.max(0.03, lbl.pct), 5);
        } else {
          overlayCtx.font = isSkyOverview ? "900 9px sans-serif" : "900 10px sans-serif";
          const tw = overlayCtx.measureText(lbl.text).width + 13;
          const dx = Math.max(tw / 2 + 5, Math.min(cw - tw / 2 - 5, sc.x));
          overlayCtx.fillStyle = lbl.bg || "rgba(9, 13, 26, 0.88)";
          overlayCtx.strokeStyle = lbl.brd || "#facc15";
          overlayCtx.lineWidth = 1.5;
          overlayCtx.beginPath();
          overlayCtx.roundRect(dx - tw / 2, sc.y - 10, tw, 19, 999);
          overlayCtx.fill();
          overlayCtx.stroke();
          overlayCtx.fillStyle = "#ffffff";
          overlayCtx.textAlign = "center";
          overlayCtx.fillText(lbl.text, dx, sc.y + 2.6);
        }
      });

      floats.forEach((ft) => {
        const sc = worldPosToScreen(ft.wx, 4.5 + (1.6 - Math.min(1.6, ft.life)) * 2.8, ft.wz);
        if (!sc.visible || sc.x < -40 || sc.x > cw + 40 || sc.y < -20 || sc.y > ch + 20) return;
        overlayCtx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        overlayCtx.font = "900 12.5px sans-serif";
        overlayCtx.textAlign = "center";
        overlayCtx.strokeStyle = "#050811";
        overlayCtx.lineWidth = 3.5;
        overlayCtx.strokeText(ft.text, sc.x, sc.y);
        overlayCtx.fillStyle = ft.color || "#4ade80";
        overlayCtx.fillText(ft.text, sc.x, sc.y);
        overlayCtx.globalAlpha = 1;
      });

      if (v23Render && v23Render.bossDrive && v23Render.bossDrive.hornFlash > 0) {
        const hSc = worldPosToScreen(v23Render.bossDrive.wx, 1.0, v23Render.bossDrive.wz);
        if (hSc.visible) {
          const prog = 1 - v23Render.bossDrive.hornFlash / 0.85;
          overlayCtx.strokeStyle = `rgba(253, 224, 71, ${Math.max(0, 1 - prog)})`;
          overlayCtx.lineWidth = 3.2;
          overlayCtx.beginPath();
          overlayCtx.arc(hSc.x, hSc.y, 18 + prog * 56, 0, Math.PI * 2);
          overlayCtx.stroke();
        }
      }

      overlayCtx.restore();
    }
  }

  return {
    init,
    isReady() { return ready; },
    handleResize,
    screenToLogical,
    screenToWorldHit,
    worldToScreen,
    zoomBy,
    zoomByFactor,
    panBy,
    panByScreen,
    rotateBy,
    tiltBy,
    focusLand,
    followWorldPos,
    getFocusedLand,
    rotate90,
    resetCamera,
    cycleAngle,
    renderFrame
  };
})();

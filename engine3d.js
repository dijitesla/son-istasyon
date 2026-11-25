// Son İstasyon v21.0 — AAA İzometrik 3D Grafik Motoru (Three.js)
// 2048px yumuşak gölgeler, dokulu çatı & cam cepheler, 3D yakıt fiyat totemi, kafe şemsiyeleri,
// metalik jantlı & tavanlı 3D araçlar, kollu yürüyen karakterler, dönen yıkama fırçaları ve 10 arazi!

window.Engine3D = (function () {
  const WORLD_W = 480;
  const WORLD_H = 620;
  const SCALE = 0.1;

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

  // Gerçek SimCity / My Perfect Hotel Tarzı Dar FOV İzometrik Kamera!
  // 4 İzometrik Yön (45°, 135°, 225°, 315°) + 3 Yükseklik Açısı (İzometrik / Sinematik / Yüksek)
  const ELEV_PRESETS = [
    { name: "İzometrik 3D", dist: 92, height: 74, lookZ: 0.5 },
    { name: "Yakın 3D", dist: 64, height: 46, lookZ: 2.0 },
    { name: "Yüksek Bakış", dist: 86, height: 102, lookZ: 0.5 }
  ];
  let elevIdx = 0;
  let yawIndex = 0; // 0..3 -> 4 İzometrik köşe
  const YAW_ANGLES = [0.46, 2.35, -2.55, -0.46];
  let curYaw = YAW_ANGLES[0];
  let targetYaw = YAW_ANGLES[0];

  let camZoom = 1.0;
  let targetZoom = 1.0;
  let panX = 0;
  let panZ = 0;
  let targetPanX = 0;
  let targetPanZ = 0;
  const curCamPos = { x: 42, y: 74, z: 82 };
  const curLookAt = { x: 0, y: 0, z: 0.5 };

  let raycaster = null;
  let groundPlane = null;
  let ndcVec = null;

  let staticLandGroup = null;
  let dynamicGroup = null;
  let weatherGroup = null;
  let lastBuildSig = "";

  let animRefs = {
    ferrisWheel: null,
    ferrisCabins: [],
    entryBarrier: null,
    exitBarrier: null,
    fuelFillMesh: null,
    fountainRings: [],
    hotelRoomMeshes: [],
    fireMesh: null,
    washRollers: []
  };

  let vehicleMeshes = [];
  let charMeshes = [];
  let heliMesh = null;
  let weatherMeshes = [];

  // =========================================================================
  // PROSEDÜREL DOKU & TABELA ÜRETİCİ (0 KB İNDİRME — KRİSTAL NETLİK!)
  // =========================================================================
  const texCache = {};
  const matCache = {};

  function createNoiseTexture(baseHex, speck1, speck2, repeatX, repeatY, key) {
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = baseHex;
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 650; i++) {
      g.fillStyle = i % 2 === 0 ? speck1 : speck2;
      g.fillRect((i * 37) % 128, (i * 73) % 128, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
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

  function createTotemTexture() {
    const key = "fuel_totem_v21";
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#0f172a";
    g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#dc2626";
    g.fillRect(6, 6, 116, 48);
    g.fillStyle = "#fef08a";
    g.font = "900 22px sans-serif";
    g.textAlign = "center";
    g.fillText("SON 7/24", 64, 38);
    const rows = [
      ["BENZİN", "44.90", "#4ade80"],
      ["DİZEL", "43.20", "#facc15"],
      ["OTOGAZ", "25.40", "#38bdf8"],
      ["EV kW", "9.50", "#c084fc"]
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

  function box(w, h, d, color, opts = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), getMat(color, opts));
    if (opts.shadow !== false) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    return mesh;
  }

  function cyl(rt, rb, h, seg, color, opts = {}) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), getMat(color, opts));
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#1d3557");
    fog = new THREE.FogExp2("#1d3557", 0.0028);
    scene.fog = fog;

    // DAR FOV (28°) = GERÇEK SİMCİTY İZOMETRİK DİORAMA GÖRÜNÜMÜ (Binalar kameraya çarpıp devleşmez!)
    camera = new THREE.PerspectiveCamera(28, 1, 1, 320);

    // 3 Noktalı Stüdyo Işıklandırması (Sıcak Güneş + Gökyüzü Dolgu + Yumuşak Gölge)
    hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 1.05);
    scene.add(hemiLight);

    sunLight = new THREE.DirectionalLight(0xfff5dc, 1.44);
    sunLight.position.set(38, 64, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 15;
    sunLight.shadow.camera.far = 190;
    const sc = 46;
    sunLight.shadow.camera.left = -sc;
    sunLight.shadow.camera.right = sc;
    sunLight.shadow.camera.top = sc;
    sunLight.shadow.camera.bottom = -sc;
    sunLight.shadow.bias = -0.00045;
    scene.add(sunLight);

    fillLight = new THREE.DirectionalLight(0x93c5fd, 0.48);
    fillLight.position.set(-32, 34, -26);
    scene.add(fillLight);

    staticLandGroup = new THREE.Group();
    dynamicGroup = new THREE.Group();
    weatherGroup = new THREE.Group();
    scene.add(staticLandGroup);
    scene.add(dynamicGroup);
    scene.add(weatherGroup);

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (overlayCanvas.width !== Math.round(w * dpr) || overlayCanvas.height !== Math.round(h * dpr)) {
        overlayCanvas.width = Math.round(w * dpr);
        overlayCanvas.height = Math.round(h * dpr);
      }
    }
  }

  // =========================================================================
  // KAMERA KONTROLLERİ (DÖNDÜR, YAKINLAŞTIR, KAYDIR, 3D RAYCAST)
  // =========================================================================
  function screenToLogical(clientX, clientY) {
    if (!ready || !canvasEl) return { x: 240, y: 310 };
    const rect = canvasEl.getBoundingClientRect();
    ndcVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndcVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndcVec, camera);
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(groundPlane, hit)) {
      return {
        x: Math.max(0, Math.min(WORLD_W, toLogicalX(hit.x))),
        y: Math.max(0, Math.min(WORLD_H, toLogicalY(hit.z)))
      };
    }
    return { x: 240, y: 310 };
  }

  function worldToScreen(lx, heightY, ly) {
    if (!ready || !canvasEl) return { x: -100, y: -100, visible: false };
    const v = new THREE.Vector3(to3DX(lx), heightY, to3DZ(ly));
    v.project(camera);
    const w = canvasEl.clientWidth || 440;
    const h = canvasEl.clientHeight || 580;
    return {
      x: (v.x * 0.5 + 0.5) * w,
      y: (-v.y * 0.5 + 0.5) * h,
      visible: v.z < 1
    };
  }

  function zoomBy(delta) {
    targetZoom = Math.max(0.55, Math.min(1.45, targetZoom + delta));
  }

  function panBy(dxPx, dyPx) {
    const f = 0.055 * camZoom;
    // Kamera dönüş açısına göre doğal kaydırma!
    const cosY = Math.cos(curYaw);
    const sinY = Math.sin(curYaw);
    const worldDx = (-dxPx * cosY - dyPx * sinY) * f;
    const worldDz = (dxPx * sinY - dyPx * cosY) * f;
    targetPanX = Math.max(-16, Math.min(16, targetPanX + worldDx));
    targetPanZ = Math.max(-18, Math.min(18, targetPanZ + worldDz));
  }

  function rotate90() {
    yawIndex = (yawIndex + 1) % YAW_ANGLES.length;
    targetYaw = YAW_ANGLES[yawIndex];
    const names = ["Güney-Doğu", "Kuzey-Doğu", "Kuzey-Batı", "Güney-Batı"];
    return names[yawIndex];
  }

  function resetCamera() {
    targetPanX = 0;
    targetPanZ = 0;
    targetZoom = 1.0;
  }

  function cycleAngle() {
    elevIdx = (elevIdx + 1) % ELEV_PRESETS.length;
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

  function addCommonEnvironment(group, theme = "station") {
    // Dokulu Zümrüt Çim Çevre
    const grassTex = createNoiseTexture(
      theme === "vip" ? "#24552a" : "#226038",
      "rgba(74,222,128,0.06)",
      "rgba(15,40,22,0.08)",
      16,
      16,
      `grass_${theme}`
    );
    const outerGround = new THREE.Mesh(
      new THREE.PlaneGeometry(280, 280),
      getMat("#ffffff", { map: grassTex, texKey: `grass_${theme}`, rough: 0.92, shadow: false })
    );
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.y = -0.08;
    outerGround.receiveShadow = true;
    group.add(outerGround);

    // Dokulu Ana Parsel Zemini (Asfalt veya Lüks Taş!)
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

    // Dokulu 2 Şeritli Otoyol
    const roadTex = createNoiseTexture("#232d3f", "rgba(255,255,255,0.07)", "rgba(0,0,0,0.22)", 24, 2, "highway_asphalt");
    const road = box(190, 0.18, 7.8, "#ffffff", { map: roadTex, texKey: "highway_asphalt", rough: 0.88, shadow: false });
    road.position.set(0, -0.01, -27.0);
    road.receiveShadow = true;
    group.add(road);

    // Otoyol Kesikli Beyaz Şeritler + Kenar Sarı Çizgileri
    const dashMat = getMat("#f8fafc", { rough: 0.45, shadow: false });
    for (let dx = -72; dx <= 72; dx += 5.2) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.04, 0.24), dashMat);
      dash.position.set(dx, 0.09, -27.0);
      group.add(dash);
    }
    const edgeY1 = box(190, 0.04, 0.16, "#facc15", { shadow: false });
    edgeY1.position.set(0, 0.09, -30.5);
    const edgeY2 = box(190, 0.04, 0.16, "#facc15", { shadow: false });
    edgeY2.position.set(0, 0.09, -23.5);
    group.add(edgeY1, edgeY2);

    // Otoyol Metal Bariyerleri (İstasyon giriş/çıkışında açık!)
    [
      [-55, -31.1, 70], [55, -31.1, 70], [0, -31.1, 44],
      [-52, -22.9, 64], [52, -22.9, 64], [2, -22.9, 24]
    ].forEach(([gx, gz, gw]) => {
      const rail = box(gw, 0.34, 0.18, "#cbd5e1", { metal: 0.72, rough: 0.28, shadow: false });
      rail.position.set(gx, 0.55, gz);
      group.add(rail);
    });

    // Çevre 3D Ağaçları (Çam + Geniş Yapraklı Meşe + Çiçekli Çalılar + Uzak Tepeler!)
    const treeFn = theme === "vip" ? createPalmTree : createPineTree;
    const altTints = ["#16a34a", "#15803d", "#65a30d", "#eab308"];
    const bushCols = ["#f43f5e", "#facc15", "#c084fc", "#fb923c"];
    for (let tz = -18; tz <= 30; tz += 6.6) {
      const idx = Math.abs(Math.round(tz));
      const useBroad = theme !== "vip" && idx % 2 === 0;
      group.add(useBroad ? createBroadleafTree(-25.4, tz, 0.94, altTints[idx % 4]) : treeFn(-25.2, tz, 0.94));
      group.add(!useBroad && theme !== "vip" ? createBroadleafTree(25.4, tz, 0.96, altTints[(idx + 1) % 4]) : treeFn(25.2, tz, 0.94));
      if (idx % 2 === 1) {
        group.add(createFlowerBush(-23.6, tz + 2.2, bushCols[idx % 4]));
        group.add(createFlowerBush(23.6, tz + 2.2, bushCols[(idx + 2) % 4]));
      }
    }
    for (let tx = -20; tx <= 20; tx += 7.4) {
      const idx = Math.abs(Math.round(tx));
      group.add(theme !== "vip" && idx % 2 === 1 ? createBroadleafTree(tx, 33.4, 0.96, altTints[idx % 4]) : treeFn(tx, 33.2, 1.0));
      group.add(createFlowerBush(tx + 3.2, 31.4, bushCols[idx % 4]));
    }
    for (let tx = -42; tx <= 42; tx += 9.5) {
      const idx = Math.abs(Math.round(tx));
      group.add(idx % 3 === 0 ? createBroadleafTree(tx, -34.6, 1.12, altTints[idx % 4]) : createPineTree(tx, -34.4, 1.1));
    }

    // Uzak Ufuk Yeşil Tepeleri (Harita boşlukta kesilmez, derinlik kazanır!)
    [[-52, -48, 22, 6.5], [14, -54, 28, 8.2], [58, -46, 20, 6.0], [-56, 36, 20, 5.5]].forEach(([hx, hz, hr, hh]) => {
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(hr, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        getMat("#1b5130", { rough: 0.95, shadow: false })
      );
      hill.scale.set(1.3, hh / hr, 1.0);
      hill.position.set(hx, -0.2, hz);
      group.add(hill);
    });
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

    // Otoyol Girişi Işıklı 3D Yakıt Fiyat Totemi (SON 7/24)!
    const totemGroup = new THREE.Group();
    const tBase = box(1.8, 0.45, 1.2, "#334155");
    tBase.position.y = 0.22;
    const tTex = createTotemTexture();
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

    // 2. Otoyol Dev Işıklı Reklam Tabelası ("SON İSTASYON")
    if (data.billboardInstalled) {
      const bGroup = new THREE.Group();
      const leg1 = cyl(0.16, 0.2, 4.4, 6, "#64748b", { metal: 0.5 });
      leg1.position.set(-3.0, 2.2, 0);
      const leg2 = cyl(0.16, 0.2, 4.4, 6, "#64748b", { metal: 0.5 });
      leg2.position.set(3.0, 2.2, 0);
      const bTex = createSignTexture("★ SON İSTASYON ★", "#991b1b", "#fef9c3", "#facc15");
      const bMat = new THREE.MeshStandardMaterial({ map: bTex, emissive: new THREE.Color("#ffffff"), emissiveMap: bTex, emissiveIntensity: 0.55 });
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
      group.add(island);

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
      const neonStrip = box(4.92, 0.15, 3.32, isVip ? "#fde047" : "#38bdf8", {
        emissive: isVip ? "#facc15" : "#0ea5e9",
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

    // 8. Band 4 — 3D Market, Restoran ve Mini Motel (Dokulu Cam Cepheler + Kaldırım Aralığı + Çatı Detayı!)
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
      const sideMat = getMat(wallHex, { rough: 0.7 });
      const frontMat = new THREE.MeshStandardMaterial({
        map: winTex,
        emissive: new THREE.Color("#fde047"),
        emissiveMap: winTex,
        emissiveIntensity: 0.28,
        roughness: 0.4
      });

      const mats = [sideMat, sideMat, sideMat, sideMat, frontMat, frontMat];
      const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mats);
      body.position.set(cx, bh / 2 + 0.1, cz);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      addDetailedRoof(group, cx, bh + 0.22, cz, bw, bd, roofCol, neonCol, title, wallHex);

      if (kind === "market") {
        // Market önü içecek soğutucu dolabı + çiçek saksıları!
        const cooler = box(0.95, 1.55, 0.65, "#e0f2fe", { emissive: "#38bdf8", emInt: 0.55 });
        cooler.position.set(cx + bw * 0.34, 0.85, cz - bd / 2 - 0.35);
        group.add(cooler, createFlowerBush(cx - bw * 0.38, cz - bd / 2 - 0.55, "#facc15"));
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
          aw.position.set(cx - (bw - 0.6) / 2 + ((bw - 0.6) / 6) * (i + 0.5), 2.6, cz - bd / 2 - 0.58);
          aw.rotation.x = 0.32;
          group.add(aw);
        }
        // Restoran önü açık hava kafe masaları & kırmızı-beyaz şemsiyeler!
        [-2.8, 2.8].forEach((ox) => {
          const tbl = cyl(0.55, 0.55, 0.08, 10, "#f8fafc");
          tbl.position.set(cx + ox, 0.72, cz - bd / 2 - 1.45);
          const leg = cyl(0.06, 0.08, 1.9, 6, "#cbd5e1");
          leg.position.set(cx + ox, 1.0, cz - bd / 2 - 1.45);
          const umb = new THREE.Mesh(
            new THREE.ConeGeometry(1.15, 0.45, 8),
            getMat("#ef4444", { rough: 0.55 })
          );
          umb.position.set(cx + ox, 2.05, cz - bd / 2 - 1.45);
          umb.castShadow = true;
          group.add(tbl, leg, umb);
        });
        // Çatı tuğla bacası
        const chim = box(0.95, 1.5, 0.95, "#9a3412", { rough: 0.85 });
        chim.position.set(cx + bw * 0.32, bh + 0.9, cz + bd * 0.22);
        group.add(chim);
      }
      if (kind === "motel") {
        // Motel çatı uydu çanağı + teras korkuluğu + sıcak aplikler
        const dishPole = cyl(0.08, 0.1, 1.1, 6, "#cbd5e1", { metal: 0.6 });
        dishPole.position.set(cx + bw * 0.3, bh + 0.75, cz + bd * 0.22);
        const dish = new THREE.Mesh(
          new THREE.SphereGeometry(0.68, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.45),
          getMat("#f1f5f9", { metal: 0.5, rough: 0.3 })
        );
        dish.position.set(cx + bw * 0.3, bh + 1.35, cz + bd * 0.22);
        dish.rotation.x = -0.65;
        group.add(dishPole, dish, createFlowerBush(cx - bw * 0.38, cz - bd / 2 - 0.55, "#f472b6"));
      }
    };

    buildFrontBuilding(stMeta.MARKET_POS, true, "#57321d", "#293548", "#f59e0b", "MARKET 7/24", "market");
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
      const sign = box(14, 3.0, 0.6, "#1e293b", { emissive: "#f59e0b", emInt: 0.35 });
      sign.position.set(0, 2.0, 0);
      group.add(sign);
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

      addDetailedRoof(group, mx, 5.95, mz, mw, md, "#1e293b", "#f59e0b", "OTOYOL GRAND AVM", "#7c2d12");

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
    }
  }

  // =========================================================================
  // 3. ARAZİ — 3D GO-KART, DÖNEN DÖNME DOLAP, RAFİNERİ & TERMAL BUNGALOVLAR
  // =========================================================================
  function buildLand3Scene(group, data) {
    addCommonEnvironment(group, "resort");
    const l3 = data.empire.land3;
    if (!l3 || !l3.owned) {
      const sign = box(14, 3.0, 0.6, "#4c1d95", { emissive: "#a855f7", emInt: 0.45 });
      sign.position.set(0, 2.0, 0);
      group.add(sign);
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
      const sign = box(15, 3.4, 0.7, "#1e293b", { emissive: "#f59e0b", emInt: 0.35 });
      sign.position.set(0, 2.2, 0);
      group.add(sign);
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
    } else {
      const palette = {
        hotel: { body: "#7c2d12", trim: "#facc15", glass: "#38bdf8", title: "GRAND OTEL" },
        hospital: { body: "#e2e8f0", trim: "#38bdf8", glass: "#0ea5e9", title: "ÖZEL HASTANE" },
        autofactory: { body: "#334155", trim: "#f97316", glass: "#7dd3fc", title: "OTO FABRİKA" },
        techpark: { body: "#1e1b4b", trim: "#818cf8", glass: "#38bdf8", title: "TEKNOKENT" }
      }[st.projectKey] || { body: "#334155", trim: "#facc15", glass: "#38bdf8", title: "TESİS" };

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
    const isTruck = shape === "truck" || shape === "tanker" || shape === "tow" || isBus;
    const isSport = shape === "sport" || shape === "ev";
    const w = isTruck ? 2.38 : 1.94;
    const l = isBus ? 5.8 : isTruck ? 4.7 : isSport ? 3.8 : 3.5;
    const h = isBus ? 2.25 : isTruck ? 1.82 : isSport ? 0.94 : 1.12;

    // Parlak Metalik Alt Gövde + Siyah Tampon Şeridi
    const body = box(w, h * 0.56, l, color, { metal: 0.48, rough: 0.2 });
    body.position.y = 0.42 + h * 0.28;
    const bumper = box(w + 0.08, 0.22, l + 0.12, "#1e293b", { metal: 0.35, rough: 0.45 });
    bumper.position.y = 0.44;
    g.add(body, bumper);

    if (shape === "tanker") {
      const tank = cyl(0.94, 0.94, 3.2, 14, "#f8fafc", { metal: 0.65, rough: 0.18 });
      tank.rotation.x = Math.PI / 2;
      tank.position.set(0, 1.44, 0.52);
      const tStripe = cyl(0.96, 0.96, 0.7, 14, "#ea580c", { emissive: "#c2410c", emInt: 0.3 });
      tStripe.rotation.x = Math.PI / 2;
      tStripe.position.set(0, 1.44, 0.52);
      const cab = box(2.18, 1.48, 1.3, "#ea580c", { metal: 0.4, rough: 0.25 });
      cab.position.set(0, 1.24, -1.58);
      const ws = box(1.92, 0.58, 0.12, "#bae6fd", { emissive: "#0ea5e9", emInt: 0.35, metal: 0.85, rough: 0.1 });
      ws.position.set(0, 1.45, -2.22);
      g.add(tank, tStripe, cab, ws);
    } else if (shape === "tow") {
      const cab = box(2.14, 1.3, 1.4, "#f59e0b", { metal: 0.38, rough: 0.24 });
      cab.position.set(0, 1.18, -1.48);
      const ws = box(1.9, 0.52, 1.1, "#0f172a", { metal: 0.85, rough: 0.12 });
      ws.position.set(0, 1.4, -1.56);
      const bed = box(2.26, 0.22, 2.8, "#475569", { metal: 0.55 });
      bed.position.set(0, 0.88, 0.78);
      const beacon = box(1.1, 0.24, 0.32, "#fde047", { emissive: "#f59e0b", emInt: 1.8 });
      beacon.position.set(0, 1.95, -1.48);
      g.add(cab, ws, bed, beacon);
    } else if (isBus) {
      const glassBand = box(w + 0.04, 0.72, l * 0.9, "#0f172a", { metal: 0.88, rough: 0.12 });
      glassBand.position.set(0, 1.55, 0);
      const roofCap = box(w * 0.96, 0.24, l * 0.96, "#f8fafc", { rough: 0.3 });
      roofCap.position.set(0, 2.04, 0);
      const acPod = box(1.2, 0.24, 1.8, "#cbd5e1", { metal: 0.4 });
      acPod.position.set(0, 2.22, 0.2);
      g.add(glassBand, roofCap, acPod);
    } else {
      // Gerçekçi 3 Parçalı Binek / SUV / Spor Araç: Koyu Cam Kabin + Gövde Rengi Boyalı Tavan + Rüzgarlık!
      const cabLen = isTruck ? l * 0.36 : l * 0.52;
      const cabZ = isTruck ? -l * 0.28 : 0.12;
      const cabinGlass = box(w * 0.84, h * 0.44, cabLen, "#0f172a", { metal: 0.88, rough: 0.1 });
      cabinGlass.position.set(0, 0.42 + h * 0.56 + h * 0.18, cabZ);
      const roofCap = box(w * 0.8, 0.12, cabLen * 0.84, color, { metal: 0.5, rough: 0.18 });
      roofCap.position.set(0, 0.42 + h * 0.56 + h * 0.4, cabZ);
      g.add(cabinGlass, roofCap);

      if (isSport) {
        const spoiler = box(w * 0.92, 0.12, 0.36, "#0f172a", { metal: 0.6 });
        spoiler.position.set(0, 0.42 + h * 0.68, l * 0.42);
        g.add(spoiler);
      }
      if (color === "#1e3a8a") {
        // Polis Devriyesi Kırmızı/Mavi Tepe Lambası!
        const barL = box(0.45, 0.18, 0.26, "#ef4444", { emissive: "#ef4444", emInt: 2.0 });
        barL.position.set(-0.26, 0.42 + h * 0.56 + h * 0.52, cabZ);
        const barR = box(0.45, 0.18, 0.26, "#38bdf8", { emissive: "#0284c7", emInt: 2.0 });
        barR.position.set(0.26, 0.42 + h * 0.56 + h * 0.52, cabZ);
        g.add(barL, barR);
      }
    }

    // Krom Jantlı 4 Tekerlek!
    const wheelMat = getMat("#090d16", { rough: 0.88 });
    const rimMat = getMat("#e2e8f0", { metal: 0.85, rough: 0.2 });
    [[-w / 2 - 0.04, -l * 0.31], [w / 2 + 0.04, -l * 0.31], [-w / 2 - 0.04, l * 0.31], [w / 2 + 0.04, l * 0.31]].forEach(([wx, wz]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.28, 12), wheelMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, 0.4, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.31, 8), rimMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, 0.4, wz);
      g.add(wh, rim);
    });

    // Ön Krom Panjur + Parlak LED Farlar + Kırmızı Stop Lambaları
    const grille = box(w * 0.44, 0.22, 0.08, "#cbd5e1", { metal: 0.8, rough: 0.2, shadow: false });
    grille.position.set(0, 0.68, -l / 2 - 0.03);
    g.add(grille);

    const hlMat = getMat("#fef9c3", { emissive: "#fef08a", emInt: 1.75, shadow: false });
    const tlMat = getMat("#ef4444", { emissive: "#dc2626", emInt: 1.4, shadow: false });
    [-w * 0.34, w * 0.34].forEach((fx) => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), hlMat);
      hl.position.set(fx, 0.72, -l / 2 - 0.04);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.12), tlMat);
      tl.position.set(fx, 0.72, l / 2 + 0.04);
      g.add(hl, tl);
    });

    g.userData = { color, shape };
    return g;
  }

  function createCharacter3D(shirtCol, hatCol, isDog = false) {
    const g = new THREE.Group();
    if (isDog) {
      // Sevimli Detaylı Bekçi Köpeği Duman (4 Bacak, Kulaklar, Kırmızı Tasma, Sallanan Kuyruk!)
      const body = box(0.72, 0.5, 1.22, "#d97706", { rough: 0.75 });
      body.position.y = 0.48;
      const collar = box(0.58, 0.14, 0.16, "#dc2626", { emissive: "#b91c1c", emInt: 0.3 });
      collar.position.set(0, 0.64, -0.52);
      const head = box(0.52, 0.48, 0.54, "#b45309");
      head.position.set(0, 0.8, -0.72);
      const snout = box(0.28, 0.22, 0.24, "#1e293b");
      snout.position.set(0, 0.7, -1.04);
      const earL = box(0.14, 0.24, 0.14, "#78350f");
      earL.position.set(-0.2, 1.08, -0.68);
      const earR = box(0.14, 0.24, 0.14, "#78350f");
      earR.position.set(0.2, 1.08, -0.68);
      const tail = box(0.14, 0.42, 0.14, "#f59e0b");
      tail.position.set(0, 0.82, 0.65);
      tail.rotation.x = 0.45;
      [[-0.22, -0.4], [0.22, -0.4], [-0.22, 0.4], [0.22, 0.4]].forEach(([px, pz]) => {
        const paw = box(0.16, 0.34, 0.16, "#92400e");
        paw.position.set(px, 0.17, pz);
        g.add(paw);
      });
      g.add(body, collar, head, snout, earL, earR, tail);
      g.userData = { key: "dog", tail };
      return g;
    }
    const legL = box(0.22, 0.62, 0.22, "#1e293b");
    legL.position.set(-0.17, 0.34, 0);
    const legR = box(0.22, 0.62, 0.22, "#1e293b");
    legR.position.set(0.17, 0.34, 0);
    const torso = box(0.68, 0.78, 0.42, shirtCol || "#38bdf8", { rough: 0.6 });
    torso.position.y = 1.04;
    const armL = box(0.18, 0.64, 0.18, shirtCol || "#38bdf8");
    armL.position.set(-0.46, 1.02, 0);
    const armR = box(0.18, 0.64, 0.18, shirtCol || "#38bdf8");
    armR.position.set(0.46, 1.02, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 10), getMat("#fad2b4", { rough: 0.68 }));
    head.position.y = 1.7;
    head.castShadow = true;
    const cap = cyl(0.36, 0.38, 0.16, 10, hatCol || "#1e293b");
    cap.position.y = 1.96;
    const visor = box(0.42, 0.06, 0.24, hatCol || "#1e293b");
    visor.position.set(0, 1.9, -0.26);
    g.add(legL, legR, torso, armL, armR, head, cap, visor);
    g.userData = { key: `${shirtCol}_${hatCol}`, legL, legR, armL, armR };
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

  function computeSceneSig(activeLand, data) {
    if (activeLand === "station") {
      return `st_${data.pumpsUnlocked}_${data.lpgUnlocked}_${data.towUnlocked}_${data.busBakeryUnlocked}_${data.evUnlocked}_${data.carWashUnlocked}_${data.garageUnlocked}_${data.scaleUnlocked}_${data.restaurantUnlocked}_${data.motelUnlocked}_${data.solarInstalled}_${data.billboardInstalled}`;
    }
    if (activeLand === "land2") {
      const e = data.empire;
      return `l2_${e.land2Owned}_${e.parkingUnlocked}_${e.parkingCapLvl}_${e.mallUnlocked}_${e.sideLevels.logistics}_${e.sideLevels.office}`;
    }
    if (activeLand === "land3") {
      const l3 = data.empire.land3 || {};
      const bOwned = Object.values(l3.bungalows || {}).map((x) => (x.owned ? (x.rented ? 2 : 1) : 0)).join("");
      return `l3_${l3.owned}_${l3.themeUnlocked}_${l3.refineryUnlocked}_${l3.resortUnlocked}_${l3.spaUnlocked}_${bOwned}`;
    }
    const st = (data.empire.extraLands && data.empire.extraLands[activeLand]) || {};
    return `ex_${activeLand}_${st.owned}_${st.projectKey}_${st.floorsLvl}_${st.vipUpgrade}_${st.heliUpgrade}`;
  }

  function clearGroup(grp) {
    while (grp.children.length > 0) grp.remove(grp.children[0]);
  }

  function rebuildStaticLand(activeLand, data, stMeta) {
    clearGroup(staticLandGroup);
    animRefs = { ferrisWheel: null, ferrisCabins: [], entryBarrier: null, exitBarrier: null, fuelFillMesh: null, fountainRings: [], hotelRoomMeshes: [], fireMesh: null, washRollers: [] };
    if (activeLand === "station") buildStationScene(staticLandGroup, data, stMeta);
    else if (activeLand === "land2") buildLand2Scene(staticLandGroup, data);
    else if (activeLand === "land3") buildLand3Scene(staticLandGroup, data);
    else buildExtraLandScene(staticLandGroup, data, activeLand);
  }

  // =========================================================================
  // 60 FPS RENDER DÖNGÜSÜ
  // =========================================================================
  function renderFrame(activeLand, phase, data, stMeta) {
    if (!ready) return;

    const sig = computeSceneSig(activeLand, data);
    if (sig !== lastBuildSig) {
      lastBuildSig = sig;
      rebuildStaticLand(activeLand, data, stMeta);
    }

    // Dinamik Gökyüzü & Işık
    const n = phase.night;
    const skyCol = new THREE.Color().setRGB(
      0.11 + (1 - n) * 0.32,
      0.17 + (1 - n) * 0.45,
      0.30 + (1 - n) * 0.56
    );
    scene.background.copy(skyCol);
    fog.color.copy(skyCol);
    sunLight.intensity = 0.68 + (1 - n) * 0.98;
    hemiLight.intensity = 0.62 + (1 - n) * 0.6;
    sunLight.color.setHex(n > 0.6 ? 0xbae6fd : n > 0.25 ? 0xfdba74 : 0xfff8e7);

    // Yumuşak 360° Döndürülebilir İzometrik Kamera!
    const pr = ELEV_PRESETS[elevIdx];
    camZoom += (targetZoom - camZoom) * 0.14;
    panX += (targetPanX - panX) * 0.16;
    panZ += (targetPanZ - panZ) * 0.16;
    let dYaw = targetYaw - curYaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    curYaw += dYaw * 0.12;

    const dist = pr.dist * camZoom;
    const goalX = panX + Math.sin(curYaw) * dist;
    const goalZ = panZ + pr.lookZ + Math.cos(curYaw) * dist;
    const goalY = pr.height * camZoom;

    curCamPos.x += (goalX - curCamPos.x) * 0.14;
    curCamPos.y += (goalY - curCamPos.y) * 0.14;
    curCamPos.z += (goalZ - curCamPos.z) * 0.14;
    curLookAt.x += (panX - curLookAt.x) * 0.14;
    curLookAt.z += (panZ + pr.lookZ - curLookAt.z) * 0.14;

    camera.position.set(curCamPos.x, curCamPos.y, curCamPos.z);
    camera.lookAt(curLookAt.x, 0, curLookAt.z);

    // Dinamik Varlıklar
    const vehList = [];
    const charList = [];
    const overlayLabels = [];
    const floats = [];

    if (activeLand === "station") {
      if (animRefs.fuelFillMesh) {
        const pct = Math.max(0.05, Math.min(1, data.fuelStock / stMeta.maxFuel));
        animRefs.fuelFillMesh.scale.y = pct;
        animRefs.fuelFillMesh.position.y = 0.6 + 1.9 * pct;
      }
      if (animRefs.fireMesh) {
        animRefs.fireMesh.scale.setScalar(0.85 + Math.sin(Date.now() * 0.016) * 0.22);
      }
      if (animRefs.washRollers && animRefs.washRollers.length > 0) {
        animRefs.washRollers.forEach((r, idx) => (r.rotation.y += idx % 2 === 0 ? 0.12 : -0.12));
      }

      stMeta.highwayBgCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: "sedan" }));
      stMeta.cars.forEach((c) => {
        vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: c.shape });
        if (c.state === "story_wait") {
          overlayLabels.push({ lx: c.x, ly: c.y, h: 3.4, text: "❗ İNCELE!", bg: "#dc2626", brd: "#fef08a" });
        } else if (!c.isStory && c.pumpIdx >= 0 && (c.state === "waiting_fuel" || c.state === "fueling")) {
          const pct = Math.min(1, c.fuelFilled / c.fuelNeeded);
          const noPumper = data.staff.ali === 0 && data.staff.murat === 0 && data.staff.hasan === 0;
          if (pct < 0.04 && noPumper) {
            overlayLabels.push({ lx: c.x, ly: c.y, h: 3.0, text: "⛽ DOLDUR", bg: "#16a34a", brd: "#fef08a" });
          } else if (pct > 0.04 && pct < 0.99) {
            overlayLabels.push({ lx: c.x, ly: c.y, h: 2.7, pct, barCol: "#4ade80" });
          }
        }
      });
      if (stMeta.tanker) vehList.push({ x: stMeta.tanker.x, y: stMeta.tanker.y, angle: stMeta.tanker.angle, color: "#ea580c", shape: "tanker" });
      if (stMeta.activeTowTruck) vehList.push({ x: stMeta.activeTowTruck.x, y: stMeta.activeTowTruck.y, angle: stMeta.activeTowTruck.angle, color: "#f59e0b", shape: "tow" });
      if (stMeta.activeBus) vehList.push({ x: stMeta.activeBus.x, y: stMeta.activeBus.y, angle: stMeta.activeBus.angle, color: stMeta.activeBus.color, shape: "bus" });
      if (stMeta.policeCruiser) vehList.push({ x: stMeta.policeCruiser.x, y: stMeta.policeCruiser.y, angle: stMeta.policeCruiser.angle, color: "#1e3a8a", shape: "sedan" });

      const wMap = stMeta.workers;
      ["ali", "murat", "hasan", "zeynep", "mehmet", "selin", "kerem", "kadir", "cemil", "osman"].forEach((k) => {
        if (data.staff[k] > 0 && wMap[k]) {
          charList.push({ x: wMap[k].x, y: wMap[k].y, shirt: wMap[k].color, hat: wMap[k].hat, moving: !!wMap[k].moving });
        }
      });
      if (data.dumanHired && wMap.duman) charList.push({ x: wMap.duman.x, y: wMap.duman.y, isDog: true, moving: true });
      stMeta.shoppers.forEach((sh) => {
        if (sh.phase !== "inside") charList.push({ x: sh.x, y: sh.y, shirt: sh.shirt, hat: sh.hair, moving: true });
      });
      stMeta.floatingTexts.forEach((ft) => floats.push({ x: ft.x, y: ft.y, text: ft.text, color: ft.color, life: ft.life }));

      if (stMeta.powerOutage) {
        overlayLabels.push({ lx: stMeta.MARKET_POS.doorX, ly: stMeta.MARKET_POS.y + 40, h: 5.5, text: "⚡ SİGORTAYI AÇ!", bg: "#dc2626", brd: "#fde047" });
      }
    } else if (activeLand === "land2" && window.EmpireSystem && window.EmpireSystem.get3DState) {
      const s2 = window.EmpireSystem.get3DState();
      const emp = data.empire;
      s2.lotBgHighwayCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: -Math.PI / 2, color: c.color, shape: "sedan" }));
      s2.parkingCars.forEach((c) => {
        if (!(c.isDeck && c.state === "parked")) vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: c.shape });
      });
      s2.lotShoppers.forEach((sh) => charList.push({ x: sh.x, y: sh.y, shirt: sh.shirt, hat: sh.hair, moving: true }));
      s2.land2Floats.forEach((ft) => floats.push(ft));

      if (animRefs.entryBarrier) animRefs.entryBarrier.rotation.z += ((s2.entryGateOpen ? Math.PI * 0.42 : 0) - animRefs.entryBarrier.rotation.z) * 0.2;
      if (animRefs.exitBarrier) animRefs.exitBarrier.rotation.z += ((s2.exitGateOpen ? Math.PI * 0.42 : 0) - animRefs.exitBarrier.rotation.z) * 0.2;
      if (animRefs.fountainRings[0]) animRefs.fountainRings[0].scale.y = 0.85 + Math.sin(Date.now() * 0.008) * 0.22;

      if (!emp.land2Owned) {
        overlayLabels.push({ lx: 240, ly: 310, h: 4.5, text: `🏗️ 2. ARAZİ TAPUSU AL (${window.EmpireSystem.LAND2_COST}₺)`, bg: "#16a34a", brd: "#fef08a" });
      } else {
        overlayLabels.push({ lx: 230, ly: 110, h: 4.0, text: emp.parkingUnlocked ? `🅿️ OTOPARK (${s2.parkingCars.length} Araç) • Yönet` : `🔒 Otopark Kur`, bg: "rgba(9,13,26,0.88)", brd: "#38bdf8" });
        overlayLabels.push({ lx: 174, ly: 456, h: 11.6, text: emp.mallUnlocked ? `🏬 GRAND AVM • Dükkanlar` : `🔒 AVM Kur`, bg: "rgba(124,45,18,0.92)", brd: "#fde047" });
      }
    } else if (activeLand === "land3" && window.Land3System && window.Land3System.get3DState) {
      const s3 = window.Land3System.get3DState();
      const l3 = data.empire.land3 || {};
      s3.bgCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: -Math.PI / 2, color: c.color, shape: "sedan" }));
      s3.activeFleetTrucks.forEach((tr) => vehList.push({ x: tr.x, y: tr.y, angle: tr.angle, color: tr.color, shape: "truck" }));
      s3.resortGuests.forEach((g) => charList.push({ x: g.x, y: g.y, shirt: g.shirt, hat: "#18181b", moving: true }));
      s3.land3Floats.forEach((ft) => floats.push(ft));

      if (l3.themeUnlocked) {
        s3.karts.forEach((k) => {
          const p1 = s3.KART_TRACK_PTS[k.seg];
          const p2 = s3.KART_TRACK_PTS[(k.seg + 1) % s3.KART_TRACK_PTS.length];
          const kx = p1.x + (p2.x - p1.x) * k.t;
          const ky = p1.y + (p2.y - p1.y) * k.t;
          vehList.push({ x: kx, y: ky, angle: Math.atan2(p2.x - p1.x, -(p2.y - p1.y)), color: k.col, shape: "sport" });
        });
      }
      if (animRefs.ferrisWheel) {
        animRefs.ferrisWheel.rotation.z = s3.wheelAngle;
        animRefs.ferrisCabins.forEach((cab) => (cab.rotation.z = -s3.wheelAngle));
      }
      if (!l3.owned) {
        overlayLabels.push({ lx: 240, ly: 310, h: 4.5, text: `🎡 3. ARAZİ TAPUSU AL (${window.Land3System.LAND3_COST}₺)`, bg: "#7c3aed", brd: "#fef08a" });
      } else {
        overlayLabels.push({ lx: 150, ly: 170, h: 12.2, text: l3.themeUnlocked ? `🎡 LUNAPARK ★${l3.themeLvl}` : `🔒 Lunapark`, bg: "rgba(131,24,67,0.9)", brd: "#f472b6" });
        overlayLabels.push({ lx: 346, ly: 200, h: 9.0, text: `🏭 RAFİNERİ & ${l3.fleetCount || 0}/10 TIR`, bg: "rgba(15,23,42,0.9)", brd: "#38bdf8" });
        overlayLabels.push({ lx: 240, ly: 470, h: 4.8, text: l3.resortUnlocked ? `🏖️ TATİL KÖYÜ • Yönet` : `🔒 Tatil Köyü`, bg: "rgba(4,120,87,0.9)", brd: "#4ade80" });
      }
    } else if (activeLand.startsWith("land") && window.ExtraLandsSystem && window.ExtraLandsSystem.get3DState) {
      const rt = window.ExtraLandsSystem.get3DState(activeLand);
      const lDef = window.ExtraLandsSystem.getLandDef(activeLand);
      const st = data.empire.extraLands && data.empire.extraLands[activeLand];
      if (rt) {
        rt.bgCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: -Math.PI / 2, color: c.color, shape: "sedan" }));
        rt.waitingCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: c.shape }));
        rt.walkers.forEach((w) => charList.push({ x: w.x, y: w.y, shirt: w.col, hat: "#18181b", moving: true }));
        rt.floats.forEach((ft) => floats.push(ft));

        const occU = rt.occupiedTimers.length;
        const dirtyU = rt.dirtyCount;
        animRefs.hotelRoomMeshes.forEach((mat, idx) => {
          if (idx < occU) {
            mat.color.setHex(0xfef08a);
            mat.emissive.setHex(0xf59e0b);
            mat.emissiveIntensity = 1.15;
          } else if (idx < occU + dirtyU) {
            mat.color.setHex(0xc2410c);
            mat.emissive.setHex(0x9a3412);
            mat.emissiveIntensity = 0.65;
          } else {
            mat.color.setHex(0x1e3a5f);
            mat.emissive.setHex(0x0284c7);
            mat.emissiveIntensity = 0.3;
          }
        });

        if (st && !st.owned) {
          overlayLabels.push({ lx: 240, ly: 310, h: 4.5, text: `🏞️ ${lDef.name} AL (${lDef.deedCost.toLocaleString("tr-TR")}₺)`, bg: "#16a34a", brd: "#fef08a" });
        } else if (st && !st.projectKey) {
          overlayLabels.push({ lx: 240, ly: 360, h: 3.5, text: `🏗️ DOKUN VE 6 PROJEDEN BİRİNİ KUR!`, bg: "#0284c7", brd: "#fef08a" });
        } else if (st && st.projectKey) {
          const proj = window.ExtraLandsSystem.getProjectDef(st.projectKey);
          const maxU = 6 * (st.floorsLvl || 1);
          const hTop = 5.5 + (st.floorsLvl || 1) * 3.0;
          overlayLabels.push({
            lx: 240,
            ly: 420,
            h: hTop + 2.2,
            text: `${proj.emoji} ${proj.name} ★${st.floorsLvl} (${occU}/${maxU} Dolu)`,
            bg: "rgba(9,13,26,0.9)",
            brd: proj.accent
          });
        }
      }
    }

    // Araç Havuzu
    while (vehicleMeshes.length < vehList.length) {
      const m = createVehicle3D("#ef4444", "sedan");
      dynamicGroup.add(m);
      vehicleMeshes.push(m);
    }
    for (let i = 0; i < vehicleMeshes.length; i++) {
      if (i < vehList.length) {
        const v = vehList[i];
        let mesh = vehicleMeshes[i];
        if (mesh.userData.color !== v.color || mesh.userData.shape !== v.shape) {
          dynamicGroup.remove(mesh);
          mesh = createVehicle3D(v.color, v.shape);
          dynamicGroup.add(mesh);
          vehicleMeshes[i] = mesh;
        }
        mesh.visible = true;
        mesh.position.set(to3DX(v.x), 0.08, to3DZ(v.y));
        mesh.rotation.y = -v.angle;
      } else {
        vehicleMeshes[i].visible = false;
      }
    }

    // Karakter Havuzu
    const walkT = Date.now() * 0.015;
    while (charMeshes.length < charList.length) {
      const cm = createCharacter3D("#38bdf8", "#0f172a");
      dynamicGroup.add(cm);
      charMeshes.push(cm);
    }
    for (let i = 0; i < charMeshes.length; i++) {
      if (i < charList.length) {
        const c = charList[i];
        let mesh = charMeshes[i];
        const key = c.isDog ? "dog" : `${c.shirt}_${c.hat}`;
        if (mesh.userData.key !== key) {
          dynamicGroup.remove(mesh);
          mesh = createCharacter3D(c.shirt, c.hat, !!c.isDog);
          dynamicGroup.add(mesh);
          charMeshes[i] = mesh;
        }
        mesh.visible = true;
        const bob = c.moving ? Math.abs(Math.sin(walkT + i)) * 0.14 : 0;
        mesh.position.set(to3DX(c.x), 0.08 + bob, to3DZ(c.y));
        if (mesh.userData.legL && c.moving) {
          const sw = Math.sin(walkT + i) * 0.58;
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
      } else {
        charMeshes[i].visible = false;
      }
    }

    // Helikopter & Hava
    if (window.HoldingV16 && window.HoldingV16.get3DState) {
      const v16s = window.HoldingV16.get3DState();
      if (v16s.heliFly && v16s.heliFly.active) {
        if (!heliMesh) {
          heliMesh = createHelicopter3D();
          scene.add(heliMesh);
        }
        heliMesh.visible = true;
        heliMesh.position.set(to3DX(v16s.heliFly.x), 15.5, to3DZ(v16s.heliFly.y));
        heliMesh.rotation.y = -Math.PI * 0.4;
        if (heliMesh.userData.rotorPivot) heliMesh.userData.rotorPivot.rotation.y = v16s.heliFly.rotor;
      } else if (heliMesh) {
        heliMesh.visible = false;
      }

      const particles = v16s.snowFlakes.length > 0 ? v16s.snowFlakes : v16s.confettiBits;
      const isSnow = v16s.snowFlakes.length > 0;
      while (weatherMeshes.length < particles.length) {
        const pm = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.14, 0.3),
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
          pm.position.set(to3DX(p.x), 24 - (p.y / 620) * 23, to3DZ((p.y * 0.9 + i * 17) % 600));
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = overlayCanvas.width / dpr;
      const ch = overlayCanvas.height / dpr;
      overlayCtx.save();
      overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayCtx.clearRect(0, 0, cw, ch);

      overlayLabels.forEach((lbl) => {
        const sc = worldToScreen(lbl.lx, lbl.h || 3, lbl.ly);
        if (!sc.visible || sc.x < -60 || sc.x > cw + 60 || sc.y < -30 || sc.y > ch + 30) return;

        if (lbl.pct !== undefined) {
          overlayCtx.fillStyle = "rgba(9, 13, 26, 0.88)";
          overlayCtx.strokeStyle = "#4ade80";
          overlayCtx.lineWidth = 1.2;
          overlayCtx.beginPath();
          overlayCtx.roundRect(sc.x - 22, sc.y - 4.5, 44, 8, 4);
          overlayCtx.fill();
          overlayCtx.stroke();
          overlayCtx.fillStyle = lbl.barCol || "#4ade80";
          overlayCtx.fillRect(sc.x - 20, sc.y - 2.8, 40 * lbl.pct, 4.6);
        } else {
          overlayCtx.font = "900 10px sans-serif";
          const tw = overlayCtx.measureText(lbl.text).width + 14;
          overlayCtx.fillStyle = lbl.bg || "rgba(9, 13, 26, 0.88)";
          overlayCtx.strokeStyle = lbl.brd || "#facc15";
          overlayCtx.lineWidth = 1.5;
          overlayCtx.beginPath();
          overlayCtx.roundRect(sc.x - tw / 2, sc.y - 11, tw, 20, 999);
          overlayCtx.fill();
          overlayCtx.stroke();
          overlayCtx.fillStyle = "#ffffff";
          overlayCtx.textAlign = "center";
          overlayCtx.fillText(lbl.text, sc.x, sc.y + 2.8);
        }
      });

      floats.forEach((ft) => {
        const sc = worldToScreen(ft.x, 4.5 + (1.6 - Math.min(1.6, ft.life)) * 2.8, ft.y);
        if (!sc.visible) return;
        overlayCtx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        overlayCtx.font = "900 13px sans-serif";
        overlayCtx.textAlign = "center";
        overlayCtx.strokeStyle = "#050811";
        overlayCtx.lineWidth = 3.5;
        overlayCtx.strokeText(ft.text, sc.x, sc.y);
        overlayCtx.fillStyle = ft.color || "#4ade80";
        overlayCtx.fillText(ft.text, sc.x, sc.y);
        overlayCtx.globalAlpha = 1;
      });

      overlayCtx.restore();
    }
  }

  return {
    init,
    isReady() { return ready; },
    handleResize,
    screenToLogical,
    worldToScreen,
    zoomBy,
    panBy,
    rotate90,
    resetCamera,
    cycleAngle,
    renderFrame
  };
})();

// Son İstasyon v20.0 — Gerçek İzometrik 3D WebGL Motoru (Three.js)
// SimCity BuildIt / My Perfect Hotel tarzı açılı 3D kamera, yakınlaştırma, gerçek 3D binalar,
// 3D araçlar, 3D yürüyen karakterler, dönen 3D dönme dolap, 3D helikopter ve 10 arazi!

window.Engine3D = (function () {
  const WORLD_W = 480;
  const WORLD_H = 620;
  const SCALE = 0.1; // 480x620 -> 48x62 3D birim

  let THREE = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let canvasEl = null;
  let overlayCanvas = null;
  let overlayCtx = null;
  let ready = false;

  // Işıklar & Atmosfer
  let hemiLight = null;
  let sunLight = null;
  let ambientNightLight = null;
  let fog = null;

  // Kamera Durumu (İzometrik 3D + Yakınlaştırma + Kaydırma + Açı Değiştirme!)
  const CAM_PRESETS = [
    { name: "İzometrik 3D", offset: [18, 40, 44], lookZ: 2 },
    { name: "Yakın Sinematik", offset: [22, 24, 34], lookZ: 4 },
    { name: "Geniş Bakış", offset: [6, 56, 36], lookZ: 1 }
  ];
  let camPresetIdx = 0;
  let camZoom = 1.0; // 0.58 (yakın) .. 1.45 (uzak)
  let targetZoom = 1.0;
  let panX = 0;
  let panZ = 0;
  let targetPanX = 0;
  let targetPanZ = 0;
  const curCamPos = { x: 18, y: 40, z: 44 };
  const curLookAt = { x: 0, y: 0, z: 2 };

  // Raycasting için Y=0 zemin düzlemi
  let raycaster = null;
  let groundPlane = null;
  let ndcVec = null;

  // Sahne Grupları
  let staticLandGroup = null;
  let dynamicGroup = null;
  let weatherGroup = null;
  let lastBuildSig = "";

  // Canlı 3D Animasyon Referansları (Statik Sahne İçindeki Hareketli Parçalar)
  let animRefs = {
    ferrisWheel: null,
    ferrisCabins: [],
    entryBarrier: null,
    exitBarrier: null,
    fuelFillMesh: null,
    fountainRings: [],
    poolWater: null,
    hotelRoomMeshes: [],
    beaconLights: [],
    fireMesh: null
  };

  // Yeniden Kullanılabilir 3D Dinamik Havuzlar
  let vehicleMeshes = [];
  let charMeshes = [];
  let heliMesh = null;
  let weatherMeshes = [];

  // Paylaşımlı Materyal & Geometri Önbelleği
  const matCache = {};
  function getMat(color, opts = {}) {
    const key = `${color}_${opts.rough || 0.65}_${opts.metal || 0.1}_${opts.emissive || ""}_${opts.emInt || 0}_${opts.op || 1}`;
    if (matCache[key]) return matCache[key];
    const cfg = {
      color,
      roughness: opts.rough !== undefined ? opts.rough : 0.65,
      metalness: opts.metal !== undefined ? opts.metal : 0.1
    };
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

  function to3DX(lx) {
    return (lx - WORLD_W / 2) * SCALE;
  }
  function to3DZ(ly) {
    return (ly - WORLD_H / 2) * SCALE;
  }
  function toLogicalX(wx) {
    return wx / SCALE + WORLD_W / 2;
  }
  function toLogicalY(wz) {
    return wz / SCALE + WORLD_H / 2;
  }

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
      renderer.toneMappingExposure = 1.12;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#132038");
    fog = new THREE.FogExp2("#132038", 0.0055);
    scene.fog = fog;

    camera = new THREE.PerspectiveCamera(36, 1, 0.5, 240);
    camera.position.set(18, 40, 44);
    camera.lookAt(0, 0, 2);

    // Işık Sistemi
    hemiLight = new THREE.HemisphereLight(0xbfdfff, 0x26382b, 0.95);
    scene.add(hemiLight);

    sunLight = new THREE.DirectionalLight(0xfff4d6, 1.35);
    sunLight.position.set(28, 52, 24);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 140;
    const sc = 42;
    sunLight.shadow.camera.left = -sc;
    sunLight.shadow.camera.right = sc;
    sunLight.shadow.camera.top = sc;
    sunLight.shadow.camera.bottom = -sc;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);

    ambientNightLight = new THREE.PointLight(0x38bdf8, 0.4, 90);
    ambientNightLight.position.set(0, 16, 0);
    scene.add(ambientNightLight);

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
  // KAMERA KONTROLLERİ & 3D RAYCAST <-> MANTIKSAL KOORDİNAT DÖNÜŞÜMÜ
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
    targetZoom = Math.max(0.55, Math.min(1.42, targetZoom + delta));
  }

  function panBy(dxPx, dyPx) {
    const factor = 0.055 * camZoom;
    targetPanX = Math.max(-16, Math.min(16, targetPanX - dxPx * factor));
    targetPanZ = Math.max(-18, Math.min(18, targetPanZ - dyPx * factor));
  }

  function resetCamera() {
    targetPanX = 0;
    targetPanZ = 0;
    targetZoom = 1.0;
  }

  function cycleAngle() {
    camPresetIdx = (camPresetIdx + 1) % CAM_PRESETS.length;
    return CAM_PRESETS[camPresetIdx].name;
  }

  // =========================================================================
  // ORTAK 3D DOĞA, AĞAÇLAR, OTOYOL, SOKAK LAMBALARI
  // =========================================================================
  function createPineTree(x, z, scale = 1) {
    const g = new THREE.Group();
    const trunk = cyl(0.22, 0.32, 1.3, 6, "#6b4423", { rough: 0.9 });
    trunk.position.y = 0.65;
    g.add(trunk);

    const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.35, 2.2, 7), getMat("#166534", { rough: 0.85 }));
    c1.position.y = 2.0;
    c1.castShadow = true;
    g.add(c1);

    const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.9, 7), getMat("#15803d", { rough: 0.82 }));
    c2.position.y = 3.1;
    c2.castShadow = true;
    g.add(c2);

    const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 7), getMat("#22c55e", { rough: 0.8 }));
    c3.position.y = 4.0;
    c3.castShadow = true;
    g.add(c3);

    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    return g;
  }

  function createPalmTree(x, z, scale = 1) {
    const g = new THREE.Group();
    const trunk = cyl(0.18, 0.34, 4.2, 7, "#85583a", { rough: 0.9 });
    trunk.position.y = 2.1;
    trunk.rotation.z = 0.06;
    g.add(trunk);

    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI * 2) / 6;
      const leaf = box(0.55, 0.12, 2.1, "#16a34a", { rough: 0.75 });
      leaf.position.set(Math.sin(ang) * 0.95, 4.15, Math.cos(ang) * 0.95);
      leaf.rotation.y = ang;
      leaf.rotation.x = 0.32;
      g.add(leaf);
    }
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    return g;
  }

  function createStreetLamp3D(lx, ly) {
    const g = new THREE.Group();
    const pole = cyl(0.1, 0.14, 4.6, 6, "#64748b", { metal: 0.5, rough: 0.4 });
    pole.position.y = 2.3;
    g.add(pole);
    const arm = box(0.9, 0.12, 0.12, "#94a3b8", { metal: 0.5 });
    arm.position.set(0.35, 4.55, 0);
    g.add(arm);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 8),
      getMat("#fef08a", { emissive: "#fde047", emInt: 1.4, rough: 0.2, shadow: false })
    );
    bulb.position.set(0.7, 4.42, 0);
    g.add(bulb);
    g.position.set(to3DX(lx), 0, to3DZ(ly));
    return g;
  }

  function addCommonEnvironment(group, theme = "station") {
    // Geniş Çevre Yeşilliği (Ufukta boşluk kalmasın!)
    const meadowCol = theme === "vip" ? "#1e4620" : theme === "resort" ? "#15803d" : "#1f4d2e";
    const outerGround = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      getMat(meadowCol, { rough: 0.92, shadow: false })
    );
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.y = -0.06;
    outerGround.receiveShadow = true;
    group.add(outerGround);

    // Ana Parsel Zemini (48 x 62)
    const padCol = theme === "vip" ? "#e2e8f0" : theme === "mall" ? "#64748b" : theme === "resort" ? "#22c55e" : "#334155";
    const pad = box(44, 0.16, 52, padCol, { rough: 0.82, shadow: false });
    pad.position.set(0, -0.02, 3.8);
    pad.receiveShadow = true;
    group.add(pad);

    // Parsel Çevresi Beyaz Beton Bordür
    const curbMat = getMat("#cbd5e1", { rough: 0.75 });
    [
      [44.6, 0.28, 0.5, 0, 0.1, 29.8],
      [0.5, 0.28, 52.6, -22.2, 0.1, 3.8],
      [0.5, 0.28, 52.6, 22.2, 0.1, 3.8]
    ].forEach(([w, h, d, x, y, z]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), curbMat);
      m.position.set(x, y, z);
      m.receiveShadow = true;
      group.add(m);
    });

    // Üst 2 Şeritli Otoyol (y = 0..80 -> z = -31..-23)
    const road = box(160, 0.18, 7.6, "#1e293b", { rough: 0.85, shadow: false });
    road.position.set(0, -0.01, -27.0);
    road.receiveShadow = true;
    group.add(road);

    // Otoyol Kesikli Beyaz Şeritler
    const dashMat = getMat("#f8fafc", { rough: 0.5, shadow: false });
    for (let dx = -60; dx <= 60; dx += 5.5) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.24), dashMat);
      dash.position.set(dx, 0.09, -27.0);
      group.add(dash);
    }

    // Otoyol Üst Kenar Bariyeri
    const guard = box(160, 0.45, 0.35, "#94a3b8", { metal: 0.4, rough: 0.4 });
    guard.position.set(0, 0.22, -31.0);
    group.add(guard);

    // Çevre 3D Ağaçları (Palmiye veya Çam!)
    const treeFn = theme === "vip" ? createPalmTree : createPineTree;
    for (let tz = -18; tz <= 30; tz += 7.5) {
      group.add(treeFn(-24.8, tz, 0.95 + (Math.abs(tz) % 3) * 0.1));
      group.add(treeFn(24.8, tz, 0.95 + (Math.abs(tz + 2) % 3) * 0.1));
    }
    for (let tx = -20; tx <= 20; tx += 8) {
      group.add(treeFn(tx, 32.5, 1.05));
    }
    for (let tx = -36; tx <= 36; tx += 11) {
      group.add(createPineTree(tx, -34.5, 1.15));
    }
  }

  // =========================================================================
  // 1. ARAZİ — GERÇEK 3D ANA İSTASYON SAHNESİ
  // =========================================================================
  function buildStationScene(group, data, stMeta) {
    addCommonEnvironment(group, "station");

    // 1. Ana İstasyon Beton Forecourt & Asfalt Şerit
    const tarmac = box(40, 0.06, 48, "#283244", { rough: 0.88, shadow: false });
    tarmac.position.set(0, 0.07, 4);
    tarmac.receiveShadow = true;
    group.add(tarmac);

    // 2. Otoyol Dev LED Reklam Tabelası
    if (data.billboardInstalled) {
      const bGroup = new THREE.Group();
      const leg1 = cyl(0.18, 0.22, 4.8, 6, "#64748b", { metal: 0.5 });
      leg1.position.set(-2.8, 2.4, 0);
      const leg2 = cyl(0.18, 0.22, 4.8, 6, "#64748b", { metal: 0.5 });
      leg2.position.set(2.8, 2.4, 0);
      const board = box(8.6, 2.1, 0.45, "#991b1b", { emissive: "#dc2626", emInt: 0.55 });
      board.position.set(0, 5.2, 0);
      const trim = box(8.9, 0.2, 0.55, "#facc15", { emissive: "#fde047", emInt: 0.85 });
      trim.position.set(0, 6.3, 0);
      bGroup.add(leg1, leg2, board, trim);
      bGroup.position.set(to3DX(255), 0, to3DZ(76));
      group.add(bGroup);
    }

    // 3. Sokak Lambaları
    group.add(createStreetLamp3D(128, 93));
    group.add(createStreetLamp3D(382, 93));

    // 4. 3D Ana Yakıt Deposu Silosu + Canlı Seviye Çubuğu
    const tankX = to3DX(stMeta.TANK_POS.x);
    const tankZ = to3DZ(stMeta.TANK_POS.y);
    const tankBase = box(4.2, 0.35, 6.4, "#1e293b");
    tankBase.position.set(tankX, 0.2, tankZ);
    group.add(tankBase);
    const silo = cyl(1.3, 1.3, 5.4, 14, "#e2e8f0", { metal: 0.45, rough: 0.32 });
    silo.position.set(tankX, 2.9, tankZ);
    group.add(silo);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1.3, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), getMat("#94a3b8", { metal: 0.5 }));
    cap.position.set(tankX, 5.6, tankZ);
    group.add(cap);
    const gauge = box(0.45, 4.2, 0.45, "#22c55e", { emissive: "#4ade80", emInt: 0.85 });
    gauge.position.set(tankX + 1.35, 2.7, tankZ);
    animRefs.fuelFillMesh = gauge;
    group.add(gauge);

    // 5. 9 Adet 3D Yakıt Pompası + Parlak Neon Kanopiler!
    stMeta.PUMPS.forEach((p, idx) => {
      const px = to3DX(p.x);
      const pz = to3DZ(p.y);
      const unlocked = idx < data.pumpsUnlocked;
      const isVip = !!p.isVip;

      if (!unlocked) {
        const padSlot = box(4.2, 0.14, 5.2, "#1e293b", { op: 0.65 });
        padSlot.position.set(px, 0.1, pz + 1.2);
        group.add(padSlot);
        return;
      }

      // Beton ada
      const island = box(4.6, 0.35, 1.4, "#94a3b8");
      island.position.set(px, 0.22, pz);
      group.add(island);

      // 3D Pompa Makinesi
      const pumpBody = box(1.35, 1.85, 0.9, isVip ? "#eab308" : "#ef4444", { metal: 0.25, rough: 0.35 });
      pumpBody.position.set(px, 1.25, pz);
      group.add(pumpBody);

      const screen = box(0.95, 0.55, 0.95, "#e0f2fe", { emissive: "#38bdf8", emInt: 0.7 });
      screen.position.set(px, 1.65, pz);
      group.add(screen);

      // Kanopi Direkleri & Parlak LED Çatı
      const p1 = cyl(0.14, 0.16, 3.8, 8, "#cbd5e1", { metal: 0.5 });
      p1.position.set(px - 1.9, 2.0, pz);
      const p2 = cyl(0.14, 0.16, 3.8, 8, "#cbd5e1", { metal: 0.5 });
      p2.position.set(px + 1.9, 2.0, pz);
      group.add(p1, p2);

      const canopy = box(5.1, 0.48, 3.6, isVip ? "#a16207" : "#1e293b", { metal: 0.35, rough: 0.35 });
      canopy.position.set(px, 4.05, pz + 0.4);
      group.add(canopy);

      const neonStrip = box(5.22, 0.16, 3.72, isVip ? "#fde047" : "#38bdf8", {
        emissive: isVip ? "#facc15" : "#0ea5e9",
        emInt: 1.15
      });
      neonStrip.position.set(px, 3.85, pz + 0.4);
      group.add(neonStrip);
    });

    // 6. 🔵 3D LPG Adası & Basınçlı Silo
    if (data.lpgUnlocked) {
      const lx = to3DX(stMeta.LPG_POS.x);
      const lz = to3DZ(stMeta.LPG_POS.y);
      const tx = to3DX(stMeta.LPG_POS.tankX);
      const tz = to3DZ(stMeta.LPG_POS.tankY);

      const lpgTank = cyl(1.0, 1.0, 4.4, 14, "#f8fafc", { metal: 0.3, rough: 0.25 });
      lpgTank.rotation.x = Math.PI / 2;
      lpgTank.position.set(tx, 1.3, tz);
      group.add(lpgTank);
      const band = cyl(1.04, 1.04, 1.2, 14, "#0284c7", { emissive: "#0284c7", emInt: 0.3 });
      band.rotation.x = Math.PI / 2;
      band.position.set(tx, 1.3, tz);
      group.add(band);

      const lpgCanopy = box(4.8, 0.42, 3.2, "#0284c7", { emissive: "#0284c7", emInt: 0.35 });
      lpgCanopy.position.set(lx, 3.8, lz + 0.4);
      group.add(lpgCanopy);
      const lp1 = cyl(0.14, 0.14, 3.7, 6, "#e2e8f0");
      lp1.position.set(lx - 1.8, 1.85, lz);
      const lp2 = cyl(0.14, 0.14, 3.7, 6, "#e2e8f0");
      lp2.position.set(lx + 1.8, 1.85, lz);
      group.add(lp1, lp2);
    }

    // 7. 🚌 3D Otobüs Peronu & 🥖 Taş Fırın (Canlı Alev!)
    if (data.busBakeryUnlocked) {
      const b = stMeta.BUS_BAY_POS;
      const bx = to3DX(b.x + b.w - 32);
      const bz = to3DZ(b.y + b.h / 2);
      const oven = box(5.4, 2.8, 3.0, "#7c2d12", { rough: 0.85 });
      oven.position.set(bx, 1.4, bz);
      group.add(oven);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), getMat("#9a3412", { rough: 0.8 }));
      dome.position.set(bx - 1.1, 2.8, bz);
      group.add(dome);
      const fire = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 8, 8),
        getMat("#f97316", { emissive: "#fb923c", emInt: 1.8, shadow: false })
      );
      fire.position.set(bx - 1.1, 0.8, bz + 1.35);
      animRefs.fireMesh = fire;
      group.add(fire);
    }

    // 8. Band 3 — 5 Servis Binası (EV Şarj, Oto Yıkama, Tamirhane, Çekici, Kantar)
    const addServiceBay3D = (b, unlocked, roofCol, accentCol, type) => {
      const cx = to3DX(b.x + b.w / 2);
      const cz = to3DZ(b.y + b.h / 2);
      const bw = b.w * SCALE;
      const bd = b.h * SCALE;
      if (!unlocked) {
        const plot = box(bw - 0.3, 0.15, bd - 0.3, "#1e293b", { op: 0.65 });
        plot.position.set(cx, 0.1, cz);
        group.add(plot);
        return;
      }
      const floor = box(bw, 0.2, bd, "#1e293b");
      floor.position.set(cx, 0.12, cz);
      group.add(floor);

      // Yan duvarlar + 3D Çatı (Araçlar içine girsin diye ön/arka açık tünel!)
      const lw = box(0.45, 3.2, bd, roofCol);
      lw.position.set(cx - bw / 2 + 0.25, 1.7, cz);
      const rw = box(0.45, 3.2, bd, roofCol);
      rw.position.set(cx + bw / 2 - 0.25, 1.7, cz);
      const rf = box(bw + 0.3, 0.45, bd + 0.2, roofCol, { metal: 0.25 });
      rf.position.set(cx, 3.45, cz);
      const sign = box(bw, 0.55, 0.35, accentCol, { emissive: accentCol, emInt: 0.85 });
      sign.position.set(cx, 3.7, cz + bd / 2);
      group.add(lw, rw, rf, sign);

      if (type === "ev") {
        const charger = box(0.7, 2.2, 0.7, "#e0f2fe", { emissive: "#22d3ee", emInt: 0.9 });
        charger.position.set(cx - bw / 2 + 1.1, 1.2, cz);
        group.add(charger);
      } else if (type === "scale") {
        const plate = box(bw - 1.4, 0.26, bd - 1.6, "#facc15", { metal: 0.4 });
        plate.position.set(cx, 0.22, cz);
        group.add(plate);
      }
    };

    addServiceBay3D(stMeta.EV_POS, data.evUnlocked, "#0c4a6e", "#22d3ee", "ev");
    addServiceBay3D(stMeta.WASH_POS, data.carWashUnlocked, "#0369a1", "#38bdf8", "wash");
    addServiceBay3D(stMeta.GARAGE_POS, data.garageUnlocked, "#4c1d95", "#c084fc", "garage");
    addServiceBay3D(stMeta.TOW_POS, data.towUnlocked, "#92400e", "#f59e0b", "tow");
    addServiceBay3D(stMeta.SCALE_POS, data.scaleUnlocked, "#78350f", "#facc15", "scale");

    // 9. Band 4 — 3D Yaya Meydanı Binaları: Market, Restoran, Mini Motel!
    const buildFrontBuilding = (b, unlocked, bodyCol, roofCol, neonCol, kind) => {
      const cx = to3DX(b.x + b.w / 2);
      const cz = to3DZ(b.y + b.h / 2);
      const bw = b.w * SCALE;
      const bd = b.h * SCALE;
      if (!unlocked) {
        const plot = box(bw - 0.3, 0.16, bd - 0.3, "#1e293b", { op: 0.65 });
        plot.position.set(cx, 0.1, cz);
        group.add(plot);
        return;
      }
      const bh = kind === "motel" ? 5.6 : 4.2;
      const body = box(bw, bh, bd, bodyCol, { rough: 0.7 });
      body.position.set(cx, bh / 2 + 0.1, cz);
      group.add(body);

      const roof = box(bw + 0.5, 0.55, bd + 0.5, roofCol, { metal: 0.25 });
      roof.position.set(cx, bh + 0.35, cz);
      group.add(roof);

      const neon = box(bw + 0.2, 0.28, 0.3, neonCol, { emissive: neonCol, emInt: 1.05 });
      neon.position.set(cx, bh + 0.2, cz - bd / 2 - 0.18);
      group.add(neon);

      // Parlak Ön Vitrin Camları
      const win = box(bw - 1.6, 1.8, 0.22, "#fef3c7", { emissive: "#fde047", emInt: 0.75, rough: 0.2 });
      win.position.set(cx, 1.5, cz - bd / 2 - 0.06);
      group.add(win);

      if (kind === "market" && data.solarInstalled) {
        for (let sx = -3.2; sx <= 3.2; sx += 2.2) {
          const panel = box(1.8, 0.14, 3.2, "#0284c7", { metal: 0.75, rough: 0.2, emissive: "#0369a1", emInt: 0.25 });
          panel.position.set(cx + sx, bh + 0.9, cz);
          panel.rotation.x = 0.22;
          group.add(panel);
        }
      }
      if (kind === "restaurant") {
        // Kırmızı-Beyaz 3D Tente!
        for (let i = 0; i < 7; i++) {
          const aw = box((bw - 0.6) / 7, 0.25, 1.4, i % 2 === 0 ? "#dc2626" : "#f8fafc");
          aw.position.set(cx - (bw - 0.6) / 2 + ((bw - 0.6) / 7) * (i + 0.5), 2.9, cz - bd / 2 - 0.65);
          aw.rotation.x = 0.35;
          group.add(aw);
        }
      }
      if (kind === "motel") {
        // 2. Kat Oda Pencereleri!
        for (let i = 0; i < 4; i++) {
          const w2 = box(1.9, 1.3, 0.22, "#fde047", { emissive: "#facc15", emInt: 0.9 });
          w2.position.set(cx - 3.6 + i * 2.4, 4.1, cz - bd / 2 - 0.06);
          group.add(w2);
        }
      }
    };

    buildFrontBuilding(stMeta.MARKET_POS, true, "#57321d", "#1e293b", "#f59e0b", "market");
    buildFrontBuilding(stMeta.RESTAURANT_POS, data.restaurantUnlocked, "#6c2310", "#7c2d12", "#fb923c", "restaurant");
    buildFrontBuilding(stMeta.MOTEL_POS, data.motelUnlocked, "#4a1942", "#4c1d95", "#f472b6", "motel");
  }

  // =========================================================================
  // 2. ARAZİ — GERÇEK 3D OTOPARK, FİSKİYELİ MEYDAN, GRAND AVM & PLAZA KULELERİ
  // =========================================================================
  function buildLand2Scene(group, data) {
    addCommonEnvironment(group, "mall");
    const emp = data.empire;

    if (!emp.land2Owned) {
      const sign = box(14, 3.2, 0.6, "#1e293b", { emissive: "#f59e0b", emInt: 0.3 });
      sign.position.set(0, 2.2, 0);
      group.add(sign);
      return;
    }

    // 1. 3D Ücretli Otopark Alanı (Üst Bölge)
    if (emp.parkingUnlocked) {
      const pFloor = box(38.4, 0.14, 16.8, "#1e293b", { rough: 0.85, shadow: false });
      pFloor.position.set(0, 0.12, to3DZ(196));
      pFloor.receiveShadow = true;
      group.add(pFloor);

      // Park Çizgileri
      const lineMat = getMat("#e2e8f0", { shadow: false });
      for (let col = 0; col <= 10; col++) {
        const lx = to3DX(64 + col * 34);
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 3.6), lineMat);
        l1.position.set(lx, 0.2, to3DZ(147));
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 3.6), lineMat);
        l2.position.set(lx, 0.2, to3DZ(239));
        group.add(l1, l2);
      }

      // Giriş & Çıkış 3D Gişe Kulübeleri + Hareketli 3D Bariyer Kolları!
      const makeGate = (gx, gz, col) => {
        const booth = box(2.4, 2.4, 2.0, "#1e293b");
        booth.position.set(gx, 1.2, gz);
        const roof = box(2.8, 0.35, 2.4, col, { emissive: col, emInt: 0.6 });
        roof.position.set(gx, 2.55, gz);
        group.add(booth, roof);

        const pivot = new THREE.Group();
        pivot.position.set(gx + 1.3, 1.1, gz + 0.5);
        const arm = box(3.4, 0.22, 0.22, "#ef4444");
        arm.position.set(1.7, 0, 0);
        pivot.add(arm);
        group.add(pivot);
        return pivot;
      };
      animRefs.entryBarrier = makeGate(to3DX(74), to3DZ(98), "#22c55e");
      animRefs.exitBarrier = makeGate(to3DX(378), to3DZ(98), "#f59e0b");

      // Katlı Otopark Çelik Çerçevesi (Sv.2+)
      if (emp.parkingCapLvl >= 2) {
        const arch = box(38.6, 0.35, 1.6, "#0369a1", { emissive: "#38bdf8", emInt: 0.65 });
        arch.position.set(0, 4.2, to3DZ(116));
        group.add(arch);
      }
    }

    // 2. 3D Mermer Süs Havuzu & Fıskiye
    const fx = 0;
    const fz = to3DZ(303);
    const basin = cyl(3.4, 3.7, 0.75, 20, "#e2e8f0", { rough: 0.4 });
    basin.position.set(fx, 0.4, fz);
    group.add(basin);
    const water = cyl(3.0, 3.0, 0.65, 20, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.55, rough: 0.15 });
    water.position.set(fx, 0.5, fz);
    group.add(water);
    const jet = cyl(0.25, 0.55, 2.2, 10, "#e0f2fe", { emissive: "#bae6fd", emInt: 0.85, op: 0.85 });
    jet.position.set(fx, 1.7, fz);
    animRefs.fountainRings = [jet];
    group.add(jet);

    group.add(createStreetLamp3D(64, 294));
    group.add(createStreetLamp3D(416, 294));

    // 3. 3D OTOYOL GRAND AVM (Cam Kubbeli Çok Katlı Alışveriş Merkezi!)
    if (emp.mallUnlocked) {
      const mx = to3DX(174);
      const mz = to3DZ(456);
      const mw = 24.4;
      const md = 25.4;

      const mallBase = box(mw, 6.2, md, "#1e293b", { metal: 0.25, rough: 0.45 });
      mallBase.position.set(mx, 3.15, mz);
      group.add(mallBase);

      // Cam Cephe Kuşağı (Altın + Turkuaz Parlak Vitrinler!)
      const glassBand = box(mw + 0.18, 2.8, md + 0.18, "#38bdf8", { emissive: "#0284c7", emInt: 0.45, metal: 0.7, rough: 0.18 });
      glassBand.position.set(mx, 2.6, mz);
      group.add(glassBand);

      // Kırmızı Halı & Altın AVM Giriş Kemeri
      const portico = box(7.4, 3.4, 2.2, "#991b1b", { emissive: "#dc2626", emInt: 0.4 });
      portico.position.set(mx, 1.7, mz - md / 2 - 0.8);
      group.add(portico);
      const goldTrim = box(mw + 0.6, 0.55, md + 0.6, "#f59e0b", { emissive: "#f59e0b", emInt: 0.5, metal: 0.5 });
      goldTrim.position.set(mx, 6.45, mz);
      group.add(goldTrim);

      // 3D Dev Turkuaz Cam Atrium Kubbesi (Silindirik Tonoz Çatı!)
      const dome = new THREE.Mesh(
        new THREE.CylinderGeometry(5.8, 5.8, 17, 16, 1, false, 0, Math.PI),
        getMat("#38bdf8", { emissive: "#0ea5e9", emInt: 0.55, metal: 0.6, rough: 0.15, op: 0.9 })
      );
      dome.rotation.z = Math.PI / 2;
      dome.rotation.y = Math.PI / 2;
      dome.position.set(mx, 6.65, mz);
      group.add(dome);
    }

    // 4. 3D Sağ Kanat Kuleler: Lojistik Deposu & Gökdelen Plaza!
    const logLvl = emp.sideLevels.logistics || 0;
    if (logLvl > 0) {
      const lx = to3DX(370);
      const lz = to3DZ(388);
      const lh = 3.2 + logLvl * 0.55;
      const wh = box(11.8, lh, 11.8, "#065f46", { rough: 0.65 });
      wh.position.set(lx, lh / 2 + 0.1, lz);
      const trim = box(12.2, 0.4, 12.2, "#34d399", { emissive: "#10b981", emInt: 0.6 });
      trim.position.set(lx, lh + 0.25, lz);
      group.add(wh, trim);
    }

    const offLvl = emp.sideLevels.office || 0;
    if (offLvl > 0) {
      const ox = to3DX(370);
      const oz = to3DZ(524);
      const oh = 5.5 + offLvl * 2.1; // Seviye arttıkça göğe yükselen 3D gökdelen!
      const tower = box(11.4, oh, 11.4, "#0f172a", { metal: 0.6, rough: 0.25 });
      tower.position.set(ox, oh / 2 + 0.1, oz);
      group.add(tower);

      // Işıklı Cam Kat Bantları
      for (let fy = 2.0; fy < oh - 1.2; fy += 2.2) {
        const band = box(11.6, 1.1, 11.6, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.65, metal: 0.7, rough: 0.15 });
        band.position.set(ox, fy, oz);
        group.add(band);
      }
      // Çatı Helikopter Pisti
      const hPad = cyl(3.4, 3.6, 0.35, 18, "#1e293b");
      hPad.position.set(ox, oh + 0.25, oz);
      const hRing = cyl(2.6, 2.6, 0.4, 18, "#facc15", { emissive: "#fde047", emInt: 0.9 });
      hRing.position.set(ox, oh + 0.27, oz);
      group.add(hPad, hRing);
    }
  }

  // =========================================================================
  // 3. ARAZİ — 3D GO-KART, DÖNEN 3D DÖNME DOLAP, RAFİNERİ & TERMAL BUNGALOVLAR
  // =========================================================================
  function buildLand3Scene(group, data) {
    addCommonEnvironment(group, "resort");
    const l3 = data.empire.land3;
    if (!l3 || !l3.owned) {
      const sign = box(14, 3.2, 0.6, "#4c1d95", { emissive: "#a855f7", emInt: 0.45 });
      sign.position.set(0, 2.2, 0);
      group.add(sign);
      return;
    }

    // 1. 3D Go-Kart Pisti & Dönen 3D Dönme Dolap!
    if (l3.themeUnlocked) {
      const tx = to3DX(148);
      const tz = to3DZ(218);
      const trackPad = box(19.6, 0.14, 22.8, "#166534", { rough: 0.85, shadow: false });
      trackPad.position.set(tx, 0.1, tz);
      group.add(trackPad);

      // Oval Pist Asfaltı
      const trackOuter = cyl(6.8, 6.8, 0.24, 24, "#1e293b", { shadow: false });
      trackOuter.scale.set(1.15, 1, 0.82);
      trackOuter.position.set(to3DX(122), 0.18, to3DZ(194));
      group.add(trackOuter);
      const trackInner = cyl(4.2, 4.2, 0.3, 20, "#22c55e", { shadow: false });
      trackInner.scale.set(1.15, 1, 0.82);
      trackInner.position.set(to3DX(122), 0.2, to3DZ(194));
      group.add(trackInner);

      // GERÇEK 3D DİK DURAN VE DÖNEN DÖNME DOLAP!
      const wx = to3DX(212);
      const wz = to3DZ(258);
      const wr = 5.4;

      // Çelik A-Frame Ayaklar
      const legL = cyl(0.24, 0.34, 8.2, 6, "#cbd5e1", { metal: 0.6 });
      legL.position.set(wx - 1.8, 4.0, wz);
      legL.rotation.z = -0.22;
      const legR = cyl(0.24, 0.34, 8.2, 6, "#cbd5e1", { metal: 0.6 });
      legR.position.set(wx + 1.8, 4.0, wz);
      legR.rotation.z = 0.22;
      group.add(legL, legR);

      const wheelHub = new THREE.Group();
      wheelHub.position.set(wx, 7.6, wz);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(wr, 0.22, 8, 28),
        getMat("#fde047", { emissive: "#facc15", emInt: 1.0, metal: 0.4 })
      );
      wheelHub.add(rim);
      const innerRim = new THREE.Mesh(
        new THREE.TorusGeometry(wr * 0.72, 0.12, 6, 24),
        getMat("#f472b6", { emissive: "#ec4899", emInt: 0.9 })
      );
      wheelHub.add(innerRim);

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

    // 2. 3D Rafineri Siloları & 10 Tır Filo Garajı
    const fx = to3DX(346);
    const fz = to3DZ(219);
    const flPad = box(16.8, 0.18, 23.2, "#334155");
    flPad.position.set(fx, 0.12, fz);
    group.add(flPad);

    if (l3.refineryUnlocked) {
      [fx - 3.6, fx + 3.6].forEach((sx) => {
        const tank = cyl(2.4, 2.4, 5.2, 18, "#e2e8f0", { metal: 0.65, rough: 0.25 });
        tank.position.set(sx, 2.8, to3DZ(164));
        group.add(tank);
      });
      const pipe = cyl(0.32, 0.32, 7.2, 8, "#facc15", { metal: 0.5 });
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(fx, 4.4, to3DZ(164));
      group.add(pipe);
      const stack = cyl(0.45, 0.65, 8.5, 10, "#94a3b8", { metal: 0.5 });
      stack.position.set(fx, 4.3, to3DZ(142));
      group.add(stack);
    }

    // 3. 3D Havuzlu Termal Bungalov Tatil Köyü!
    if (l3.resortUnlocked) {
      const rx = 0;
      const rz = to3DZ(469);
      // Ahşap Güverte + Turkuaz Havuz
      const deck = box(14.0, 0.26, 16.5, "#92400e", { rough: 0.8 });
      deck.position.set(rx, 0.16, rz);
      group.add(deck);
      const pool = box(10.8, 0.3, 14.0, "#38bdf8", { emissive: "#0284c7", emInt: 0.55, rough: 0.12 });
      pool.position.set(rx, 0.2, rz);
      animRefs.poolWater = pool;
      group.add(pool);

      // 4 Renkli 3D Güneş Şemsiyesi
      [[-6.2, rz - 4], [6.2, rz - 4], [-6.2, rz + 4], [6.2, rz + 4]].forEach(([ux, uz], idx) => {
        const pole = cyl(0.08, 0.08, 2.4, 6, "#e2e8f0");
        pole.position.set(ux, 1.2, uz);
        const top = new THREE.Mesh(
          new THREE.ConeGeometry(1.5, 0.65, 8),
          getMat(idx % 2 === 0 ? "#f43f5e" : "#facc15", { rough: 0.6 })
        );
        top.position.set(ux, 2.5, uz);
        top.castShadow = true;
        group.add(pole, top);
      });

      // 6 Gerçek 3D Üçgen Çatılı A-Frame Ahşap Bungalov!
      const bKeys = ["b1", "b2", "b3", "b4", "b5", "b6"];
      bKeys.forEach((bk, idx) => {
        const st = l3.bungalows && l3.bungalows[bk];
        if (!st || !st.owned) return;
        const isLeft = idx < 3;
        const row = idx % 3;
        const bx = isLeft ? to3DX(106) : to3DX(374);
        const bz = to3DZ(404 + row * 56);

        const base = box(6.8, 0.4, 4.4, "#78350f");
        base.position.set(bx, 0.25, bz);
        group.add(base);

        // 3D A-Frame Prizma Çatı (3 kenarlı silindir yatık!)
        const roof = new THREE.Mesh(
          new THREE.CylinderGeometry(2.5, 2.5, 6.2, 3),
          getMat("#92400e", { rough: 0.78 })
        );
        roof.rotation.z = Math.PI / 2;
        roof.rotation.y = 0;
        roof.position.set(bx, 1.9, bz);
        roof.castShadow = true;
        group.add(roof);

        // Sıcak Sarı Veranda Camı (Kiradaysa parlar!)
        const glass = box(0.3, 2.1, 3.0, st.rented ? "#fde047" : "#334155", {
          emissive: st.rented ? "#facc15" : "#000000",
          emInt: st.rented ? 0.95 : 0
        });
        glass.position.set(bx + (isLeft ? 3.15 : -3.15), 1.45, bz);
        group.add(glass);
      });
    }
  }

  // =========================================================================
  // 4.–10. ARAZİLER — 6 FARKLI İKONİK ÇOK KATLI 3D MEGA PROJE BİNASI!
  // =========================================================================
  function buildExtraLandScene(group, data, landId) {
    addCommonEnvironment(group, "vip");
    const st = data.empire.extraLands && data.empire.extraLands[landId];
    animRefs.hotelRoomMeshes = [];
    animRefs.beaconLights = [];

    if (!st || !st.owned) {
      const sign = box(15, 3.6, 0.7, "#1e293b", { emissive: "#f59e0b", emInt: 0.35 });
      sign.position.set(0, 2.4, 0);
      group.add(sign);
      return;
    }

    // Kavisli VIP Giriş Avlusu & Kırmızı Halı
    const forecourt = box(36, 0.14, 13, "#334155", { rough: 0.8 });
    forecourt.position.set(0, 0.1, to3DZ(175));
    group.add(forecourt);

    const carpet = box(6.8, 0.18, 6.4, "#dc2626", { emissive: "#991b1b", emInt: 0.3 });
    carpet.position.set(0, 0.14, to3DZ(222));
    group.add(carpet);

    group.add(createStreetLamp3D(76, 128));
    group.add(createStreetLamp3D(404, 128));

    if (!st.projectKey) {
      const site = box(30, 0.4, 24, "#475569");
      site.position.set(0, 0.25, to3DZ(416));
      group.add(site);
      return;
    }

    const floors = st.floorsLvl || 1;
    const cx = 0;
    const cz = to3DZ(420);
    const totalH = 4.2 + floors * 3.1; // 1..5 kat -> 7.3 .. 19.7 metre gökdelen!

    if (st.projectKey === "stadium") {
      // 🏟️ GERÇEK 3D AÇIK HAVA STADYUMU (Yeşil Saha + 4 Tribün + 4 Dev Projektör Kulesi!)
      const pitch = box(24, 0.25, 16, "#16a34a", { rough: 0.85, shadow: false });
      pitch.position.set(cx, 0.22, cz);
      group.add(pitch);
      const midLine = box(0.25, 0.28, 15.6, "#ffffff", { shadow: false });
      midLine.position.set(cx, 0.23, cz);
      group.add(midLine);

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

      // 4 Köşe Dev Stadyum Projektörü!
      [[-15.5, -11.5], [15.5, -11.5], [-15.5, 11.5], [15.5, 11.5]].forEach(([px, pz]) => {
        const pylon = cyl(0.3, 0.45, standH + 7, 8, "#cbd5e1", { metal: 0.6 });
        pylon.position.set(cx + px, (standH + 7) / 2, cz + pz);
        const lampHead = box(2.4, 1.2, 0.9, "#fef9c3", { emissive: "#fef08a", emInt: 1.5 });
        lampHead.position.set(cx + px, standH + 7.2, cz + pz);
        group.add(pylon, lampHead);
      });
    } else if (st.projectKey === "convention") {
      // 👑 3D KRALİYET KONGRE SARAYI (Mermer Sütunlar + Dev Altın Kubbe!)
      const body = box(31, totalH * 0.72, 23, "#4c1d95", { rough: 0.55 });
      body.position.set(cx, totalH * 0.36 + 0.1, cz);
      group.add(body);
      const cornice = box(32.2, 0.7, 24.2, "#facc15", { emissive: "#eab308", emInt: 0.45, metal: 0.5 });
      cornice.position.set(cx, totalH * 0.72 + 0.35, cz);
      group.add(cornice);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(8.5, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2),
        getMat("#f59e0b", { metal: 0.75, rough: 0.22, emissive: "#ca8a04", emInt: 0.35 })
      );
      dome.position.set(cx, totalH * 0.72 + 0.5, cz);
      dome.castShadow = true;
      group.add(dome);
      // 6 Mermer Sütun Ön Cephede
      for (let i = 0; i < 6; i++) {
        const col = cyl(0.45, 0.52, totalH * 0.7, 10, "#f8fafc", { rough: 0.3 });
        col.position.set(cx - 12 + i * 4.8, totalH * 0.35 + 0.1, cz - 12.1);
        group.add(col);
      }
    } else {
      // 🏨 GRAND OTEL / 🏥 HASTANE / 🚗 FABRİKA / 💻 TEKNOKENT (Çok Katlı 3D Gökdelen!)
      const palette = {
        hotel: { body: "#7c2d12", trim: "#facc15", glass: "#38bdf8" },
        hospital: { body: "#f1f5f9", trim: "#38bdf8", glass: "#0ea5e9" },
        autofactory: { body: "#334155", trim: "#f97316", glass: "#7dd3fc" },
        techpark: { body: "#1e1b4b", trim: "#818cf8", glass: "#38bdf8" }
      }[st.projectKey] || { body: "#334155", trim: "#facc15", glass: "#38bdf8" };

      const bw = 31;
      const bd = 22;
      const mainBody = box(bw, totalH, bd, palette.body, { metal: 0.25, rough: 0.42 });
      mainBody.position.set(cx, totalH / 2 + 0.1, cz);
      group.add(mainBody);

      // Lüks Çatı Kornişi
      const roofRim = box(bw + 0.8, 0.75, bd + 0.8, "#0f172a", { metal: 0.4 });
      roofRim.position.set(cx, totalH + 0.45, cz);
      const neonCrown = box(bw + 1.0, 0.26, bd + 1.0, palette.trim, { emissive: palette.trim, emInt: 1.05 });
      neonCrown.position.set(cx, totalH + 0.2, cz);
      group.add(roofRim, neonCrown);

      // Kat Kat Canlı Yanan 3D Oda Pencereleri (Ön & Sağ Cephe — Dolu odalar altın parlar!)
      for (let f = 0; f < floors; f++) {
        const wy = 2.6 + f * 3.0;
        for (let c = 0; c < 6; c++) {
          const wx = cx - 12.2 + c * 4.88;
          const winMat = new THREE.MeshStandardMaterial({
            color: palette.glass,
            emissive: new THREE.Color("#0284c7"),
            emissiveIntensity: 0.4,
            roughness: 0.18,
            metalness: 0.65
          });
          const win = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.75, 0.24), winMat);
          win.position.set(wx, wy, cz - bd / 2 - 0.08);
          group.add(win);
          animRefs.hotelRoomMeshes.push(winMat);
        }
      }

      // Hastane Kırmızı Haç Logosu
      if (st.projectKey === "hospital") {
        const h1 = box(4.2, 1.2, 0.35, "#ef4444", { emissive: "#ef4444", emInt: 1.2 });
        const h2 = box(1.2, 4.2, 0.35, "#ef4444", { emissive: "#ef4444", emInt: 1.2 });
        h1.position.set(cx, totalH + 2.8, cz - bd / 2 + 1);
        h2.position.set(cx, totalH + 2.8, cz - bd / 2 + 1);
        group.add(h1, h2);
      }

      // Teknokent Çatı Anteni
      if (st.projectKey === "techpark") {
        const spire = cyl(0.15, 0.6, 8.5, 8, "#818cf8", { emissive: "#6366f1", emInt: 0.9, metal: 0.7 });
        spire.position.set(cx, totalH + 4.8, cz);
        group.add(spire);
      }

      // 🏊 Çatı Sonsuzluk Havuzu (vipUpgrade)
      if (st.vipUpgrade) {
        const deck = box(13.5, 0.45, 9.6, "#f8fafc", { rough: 0.4 });
        deck.position.set(cx - 6.8, totalH + 0.95, cz);
        const pool = box(11.8, 0.5, 7.8, "#38bdf8", { emissive: "#0ea5e9", emInt: 0.75, rough: 0.1 });
        pool.position.set(cx - 6.8, totalH + 1.0, cz);
        group.add(deck, pool);
      }

      // 🚁 Çatı Helikopter Pisti (heliUpgrade)
      if (st.heliUpgrade) {
        const hx = cx + 8.6;
        const hz = cz;
        const pad = cyl(4.6, 4.9, 0.45, 22, "#1e293b");
        pad.position.set(hx, totalH + 1.0, hz);
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(3.5, 0.22, 8, 26),
          getMat("#facc15", { emissive: "#fde047", emInt: 1.0 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(hx, totalH + 1.26, hz);
        group.add(pad, ring);
      }
    }
  }

  // =========================================================================
  // 3D ARAÇ, KARAKTER VE HELİKOPTER MODELLERİ (HAVUZLANMIŞ — 60 FPS!)
  // =========================================================================
  function createVehicle3D(color, shape) {
    const g = new THREE.Group();
    const isBus = shape === "bus";
    const isTruck = shape === "truck" || shape === "tanker" || shape === "tow" || isBus;
    const isSport = shape === "sport" || shape === "ev";
    const w = isTruck ? 2.4 : 1.95;
    const l = isBus ? 5.8 : isTruck ? 4.8 : isSport ? 3.8 : 3.5;
    const h = isBus ? 2.3 : isTruck ? 1.85 : isSport ? 0.95 : 1.15;

    // Gövde
    const body = box(w, h * 0.62, l, color, { metal: 0.35, rough: 0.32 });
    body.position.y = 0.42 + h * 0.31;
    g.add(body);

    // Kabin / Cam
    if (shape === "tanker") {
      const tank = cyl(0.95, 0.95, 3.2, 12, "#f8fafc", { metal: 0.55, rough: 0.25 });
      tank.rotation.x = Math.PI / 2;
      tank.position.set(0, 1.45, 0.55);
      g.add(tank);
      const cab = box(2.2, 1.5, 1.3, "#ea580c");
      cab.position.set(0, 1.25, -1.6);
      g.add(cab);
    } else {
      const cabLen = isBus ? l * 0.94 : isTruck ? l * 0.34 : l * 0.56;
      const cabZ = isTruck && !isBus ? -l * 0.28 : 0.1;
      const cabin = box(w * 0.86, h * 0.52, cabLen, "#0f172a", { metal: 0.75, rough: 0.15 });
      cabin.position.set(0, 0.42 + h * 0.62 + h * 0.22, cabZ);
      g.add(cabin);
    }

    // 4 Tekerlek
    const wheelMat = getMat("#090d16", { rough: 0.9 });
    [[-w / 2 - 0.06, -l * 0.3], [w / 2 + 0.06, -l * 0.3], [-w / 2 - 0.06, l * 0.3], [w / 2 + 0.06, l * 0.3]].forEach(([wx, wz]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 10), wheelMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, 0.42, wz);
      g.add(wh);
    });

    // Ön Farlar (Beyaz Parlak) & Arka Stoplar (Kırmızı)
    const hlMat = getMat("#fef9c3", { emissive: "#fef08a", emInt: 1.5, shadow: false });
    const tlMat = getMat("#ef4444", { emissive: "#dc2626", emInt: 1.2, shadow: false });
    [-w * 0.32, w * 0.32].forEach((fx) => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.12), hlMat);
      hl.position.set(fx, 0.75, -l / 2 - 0.04);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), tlMat);
      tl.position.set(fx, 0.75, l / 2 + 0.04);
      g.add(hl, tl);
    });

    g.userData = { color, shape };
    return g;
  }

  function createCharacter3D(shirtCol, hatCol, isDog = false) {
    const g = new THREE.Group();
    if (isDog) {
      const body = box(0.75, 0.55, 1.25, "#d97706");
      body.position.y = 0.45;
      const head = box(0.55, 0.52, 0.55, "#b45309");
      head.position.set(0, 0.78, -0.68);
      g.add(body, head);
      g.userData = { key: "dog" };
      return g;
    }

    const legL = box(0.24, 0.65, 0.24, "#1e293b");
    legL.position.set(-0.18, 0.34, 0);
    const legR = box(0.24, 0.65, 0.24, "#1e293b");
    legR.position.set(0.18, 0.34, 0);
    const torso = box(0.72, 0.82, 0.44, shirtCol || "#38bdf8");
    torso.position.y = 1.05;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 10), getMat("#fad2b4", { rough: 0.7 }));
    head.position.y = 1.72;
    head.castShadow = true;
    const cap = cyl(0.36, 0.38, 0.18, 10, hatCol || "#1e293b");
    cap.position.y = 1.98;

    g.add(legL, legR, torso, head, cap);
    g.userData = { key: `${shirtCol}_${hatCol}`, legL, legR };
    return g;
  }

  function createHelicopter3D() {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 10), getMat("#0f172a", { metal: 0.6, rough: 0.25 }));
    hull.scale.set(0.85, 0.72, 1.75);
    hull.castShadow = true;
    g.add(hull);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(1.15, 10, 8), getMat("#38bdf8", { emissive: "#0284c7", emInt: 0.5, metal: 0.8, rough: 0.1 }));
    glass.position.set(0, 0.15, -0.85);
    glass.scale.set(0.82, 0.65, 1.0);
    g.add(glass);

    const tail = box(0.32, 0.38, 3.6, "#1e293b", { metal: 0.5 });
    tail.position.set(0, 0.15, 2.8);
    const fin = box(0.16, 1.3, 0.75, "#facc15", { emissive: "#eab308", emInt: 0.5 });
    fin.position.set(0, 0.55, 4.4);
    g.add(tail, fin);

    const rotorPivot = new THREE.Group();
    rotorPivot.position.set(0, 1.25, 0);
    const b1 = box(7.2, 0.08, 0.32, "#f1f5f9", { metal: 0.4 });
    const b2 = box(0.32, 0.08, 7.2, "#f1f5f9", { metal: 0.4 });
    rotorPivot.add(b1, b2);
    g.add(rotorPivot);
    g.userData.rotorPivot = rotorPivot;
    return g;
  }

  // =========================================================================
  // SAHNE İNŞA İMZASI & GÜNCELLEME
  // =========================================================================
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
    while (grp.children.length > 0) {
      grp.remove(grp.children[0]);
    }
  }

  function rebuildStaticLand(activeLand, data, stMeta) {
    clearGroup(staticLandGroup);
    animRefs = {
      ferrisWheel: null,
      ferrisCabins: [],
      entryBarrier: null,
      exitBarrier: null,
      fuelFillMesh: null,
      fountainRings: [],
      poolWater: null,
      hotelRoomMeshes: [],
      beaconLights: [],
      fireMesh: null
    };

    if (activeLand === "station") buildStationScene(staticLandGroup, data, stMeta);
    else if (activeLand === "land2") buildLand2Scene(staticLandGroup, data);
    else if (activeLand === "land3") buildLand3Scene(staticLandGroup, data);
    else buildExtraLandScene(staticLandGroup, data, activeLand);
  }

  // =========================================================================
  // 60 FPS RENDER DÖNGÜSÜ (3D SAHNE + EKRAN ÜSTÜ ETİKETLER)
  // =========================================================================
  function renderFrame(activeLand, phase, data, stMeta) {
    if (!ready) return;

    // 1. Statik 3D binaları gerekirse yenile
    const sig = computeSceneSig(activeLand, data);
    if (sig !== lastBuildSig) {
      lastBuildSig = sig;
      rebuildStaticLand(activeLand, data, stMeta);
    }

    // 2. Dinamik Gece-Gündüz Gökyüzü ve Işık Geçişi
    const n = phase.night; // 0 gündüz -> 1 gece
    const skyCol = new THREE.Color().setRGB(
      0.08 + (1 - n) * 0.28,
      0.13 + (1 - n) * 0.42,
      0.24 + (1 - n) * 0.56
    );
    scene.background.copy(skyCol);
    fog.color.copy(skyCol);
    sunLight.intensity = 0.55 + (1 - n) * 1.1;
    hemiLight.intensity = 0.52 + (1 - n) * 0.65;
    sunLight.color.setHex(n > 0.6 ? 0x93c5fd : n > 0.25 ? 0xfdba74 : 0xfff8e7);

    // 3. Yumuşak 3D Kamera Lerp
    const pr = CAM_PRESETS[camPresetIdx];
    camZoom += (targetZoom - camZoom) * 0.14;
    panX += (targetPanX - panX) * 0.16;
    panZ += (targetPanZ - panZ) * 0.16;

    const goalX = panX + pr.offset[0] * camZoom;
    const goalY = pr.offset[1] * camZoom;
    const goalZ = panZ + pr.offset[2] * camZoom;
    curCamPos.x += (goalX - curCamPos.x) * 0.12;
    curCamPos.y += (goalY - curCamPos.y) * 0.12;
    curCamPos.z += (goalZ - curCamPos.z) * 0.12;
    curLookAt.x += (panX - curLookAt.x) * 0.14;
    curLookAt.z += (panZ + pr.lookZ - curLookAt.z) * 0.14;

    camera.position.set(curCamPos.x, curCamPos.y, curCamPos.z);
    camera.lookAt(curLookAt.x, 0, curLookAt.z);

    // 4. Dinamik Araçlar, Karakterler ve Arazi İçi 3D Animasyonlar
    const vehList = [];
    const charList = [];
    const overlayLabels = [];
    const floats = [];

    if (activeLand === "station") {
      // Yakıt deposu canlı doluluk çubuğu
      if (animRefs.fuelFillMesh) {
        const pct = Math.max(0.05, Math.min(1, data.fuelStock / stMeta.maxFuel));
        animRefs.fuelFillMesh.scale.y = pct;
        animRefs.fuelFillMesh.position.y = 0.6 + 2.1 * pct;
      }
      if (animRefs.fireMesh) {
        const sc = 0.85 + Math.sin(Date.now() * 0.016) * 0.22;
        animRefs.fireMesh.scale.setScalar(sc);
      }

      stMeta.highwayBgCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: "sedan" }));
      stMeta.cars.forEach((c) => {
        vehList.push({ x: c.x, y: c.y, angle: c.angle, color: c.color, shape: c.shape });
        if (c.state === "story_wait") {
          overlayLabels.push({ lx: c.x, ly: c.y, h: 3.6, text: "❗ İNCELE!", bg: "#dc2626", brd: "#fef08a" });
        } else if (!c.isStory && c.pumpIdx >= 0 && (c.state === "waiting_fuel" || c.state === "fueling")) {
          const pct = Math.min(1, c.fuelFilled / c.fuelNeeded);
          const noPumper = data.staff.ali === 0 && data.staff.murat === 0 && data.staff.hasan === 0;
          if (pct < 0.05 && noPumper) {
            overlayLabels.push({ lx: c.x, ly: c.y, h: 3.1, text: "⛽ DOLDUR", bg: "#16a34a", brd: "#fef08a" });
          } else {
            overlayLabels.push({ lx: c.x, ly: c.y, h: 2.8, pct, barCol: "#22c55e" });
          }
        }
      });
      if (stMeta.tanker) vehList.push({ x: stMeta.tanker.x, y: stMeta.tanker.y, angle: stMeta.tanker.angle, color: "#ea580c", shape: "tanker" });
      if (stMeta.activeTowTruck) vehList.push({ x: stMeta.activeTowTruck.x, y: stMeta.activeTowTruck.y, angle: stMeta.activeTowTruck.angle, color: "#f59e0b", shape: "tow" });
      if (stMeta.activeBus) vehList.push({ x: stMeta.activeBus.x, y: stMeta.activeBus.y, angle: stMeta.activeBus.angle, color: stMeta.activeBus.color, shape: "bus" });
      if (stMeta.policeCruiser) vehList.push({ x: stMeta.policeCruiser.x, y: stMeta.policeCruiser.y, angle: stMeta.policeCruiser.angle, color: "#1e3a8a", shape: "sedan" });

      // Çalışanlar & Müşteriler
      const wMap = stMeta.workers;
      ["ali", "murat", "hasan", "zeynep", "mehmet", "selin", "kerem", "kadir", "cemil", "osman"].forEach((k) => {
        if (data.staff[k] > 0 && wMap[k]) {
          charList.push({ x: wMap[k].x, y: wMap[k].y, shirt: wMap[k].color, hat: wMap[k].hat, moving: !!wMap[k].moving });
        }
      });
      if (data.dumanHired && wMap.duman) {
        charList.push({ x: wMap.duman.x, y: wMap.duman.y, isDog: true, moving: true });
      }
      stMeta.shoppers.forEach((sh) => {
        if (sh.phase !== "inside") charList.push({ x: sh.x, y: sh.y, shirt: sh.shirt, hat: sh.hair, moving: true });
      });
      stMeta.floatingTexts.forEach((ft) => floats.push({ x: ft.x, y: ft.y, text: ft.text, color: ft.color, life: ft.life }));

      // Kilitli veya Aktif Bina Kısa Etiketleri
      if (stMeta.powerOutage) {
        overlayLabels.push({ lx: stMeta.MARKET_POS.doorX, ly: stMeta.MARKET_POS.y + 40, h: 5.8, text: "⚡ SİGORTAYI AÇ!", bg: "#dc2626", brd: "#fde047" });
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

      if (animRefs.entryBarrier) {
        const targetRot = s2.entryGateOpen ? Math.PI * 0.42 : 0;
        animRefs.entryBarrier.rotation.z += (targetRot - animRefs.entryBarrier.rotation.z) * 0.2;
      }
      if (animRefs.exitBarrier) {
        const targetRot = s2.exitGateOpen ? Math.PI * 0.42 : 0;
        animRefs.exitBarrier.rotation.z += (targetRot - animRefs.exitBarrier.rotation.z) * 0.2;
      }
      if (animRefs.fountainRings[0]) {
        animRefs.fountainRings[0].scale.y = 0.85 + Math.sin(Date.now() * 0.008) * 0.22;
      }

      if (!emp.land2Owned) {
        overlayLabels.push({ lx: 240, ly: 310, h: 4.5, text: `🏗️ 2. ARAZİ TAPUSU AL (${window.EmpireSystem.LAND2_COST}₺)`, bg: "#16a34a", brd: "#fef08a" });
      } else {
        overlayLabels.push({ lx: 230, ly: 100, h: 4.6, text: emp.parkingUnlocked ? `🅿️ OTOPARK (${s2.parkingCars.length} Araç) • Yönet` : `🔒 🅿️ Otopark Kur`, bg: "rgba(9,13,26,0.88)", brd: "#38bdf8" });
        overlayLabels.push({ lx: 174, ly: 456, h: 12.2, text: emp.mallUnlocked ? `🏬 OTOYOL GRAND AVM • Dükkanlar` : `🔒 🏬 AVM İnşa Et`, bg: "rgba(124,45,18,0.92)", brd: "#fde047" });
        overlayLabels.push({ lx: 370, ly: 388, h: 7.4, text: emp.sideLevels.logistics ? `📦 LOJİSTİK ★${emp.sideLevels.logistics}` : `🔒 📦 Lojistik`, bg: "rgba(6,78,59,0.9)", brd: "#34d399" });
        overlayLabels.push({ lx: 370, ly: 524, h: 18.0, text: emp.sideLevels.office ? `🏢 PLAZA ★${emp.sideLevels.office}` : `🔒 🏢 Plaza`, bg: "rgba(30,58,138,0.9)", brd: "#38bdf8" });
      }
    } else if (activeLand === "land3" && window.Land3System && window.Land3System.get3DState) {
      const s3 = window.Land3System.get3DState();
      const l3 = data.empire.land3 || {};
      s3.bgCars.forEach((c) => vehList.push({ x: c.x, y: c.y, angle: -Math.PI / 2, color: c.color, shape: "sedan" }));
      s3.activeFleetTrucks.forEach((tr) => vehList.push({ x: tr.x, y: tr.y, angle: tr.angle, color: tr.color, shape: "truck" }));
      s3.resortGuests.forEach((g) => charList.push({ x: g.x, y: g.y, shirt: g.shirt, hat: "#18181b", moving: true }));
      s3.land3Floats.forEach((ft) => floats.push(ft));

      // Go-Kart 3D Araçları!
      if (l3.themeUnlocked) {
        s3.karts.forEach((k) => {
          const p1 = s3.KART_TRACK_PTS[k.seg];
          const p2 = s3.KART_TRACK_PTS[(k.seg + 1) % s3.KART_TRACK_PTS.length];
          const kx = p1.x + (p2.x - p1.x) * k.t;
          const ky = p1.y + (p2.y - p1.y) * k.t;
          const ang = Math.atan2(p2.x - p1.x, -(p2.y - p1.y));
          vehList.push({ x: kx, y: ky, angle: ang, color: k.col, shape: "sport" });
        });
      }

      // Dönen 3D Dönme Dolap!
      if (animRefs.ferrisWheel) {
        animRefs.ferrisWheel.rotation.z = s3.wheelAngle;
        animRefs.ferrisCabins.forEach((cab) => {
          cab.rotation.z = -s3.wheelAngle; // Kabinler hep dik kalır!
        });
      }

      if (!l3.owned) {
        overlayLabels.push({ lx: 240, ly: 310, h: 4.5, text: `🎡 3. ARAZİ TAPUSU AL (${window.Land3System.LAND3_COST}₺)`, bg: "#7c3aed", brd: "#fef08a" });
      } else {
        overlayLabels.push({ lx: 150, ly: 170, h: 11.5, text: l3.themeUnlocked ? `🎡 GO-KART & LUNAPARK ★${l3.themeLvl}` : `🔒 Go-Kart Kur`, bg: "rgba(131,24,67,0.9)", brd: "#f472b6" });
        overlayLabels.push({ lx: 346, ly: 200, h: 9.2, text: `🏭 RAFİNERİ & ${l3.fleetCount || 0}/10 TIR`, bg: "rgba(15,23,42,0.9)", brd: "#38bdf8" });
        overlayLabels.push({ lx: 240, ly: 470, h: 5.5, text: l3.resortUnlocked ? `🏖️ TERMAL TATİL KÖYÜ • Yönet` : `🔒 Tatil Köyü Aç`, bg: "rgba(4,120,87,0.9)", brd: "#4ade80" });
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

        // 3D Otel/Bina Odalarını Canlı Dolu/Kirli/Hazır Rengine Göre Yak!
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
          const hTop = 5.5 + (st.floorsLvl || 1) * 3.1;
          overlayLabels.push({
            lx: 240,
            ly: 420,
            h: hTop + 1.8,
            text: `${proj.emoji} ${proj.name} ★${st.floorsLvl} (${occU}/${maxU} Dolu) • Yönet`,
            bg: "rgba(9,13,26,0.9)",
            brd: proj.accent
          });
        }
      }
    }

    // 5. 3D Araç Havuzunu Senkronize Et
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

    // 6. 3D Yürüyen Karakter Havuzunu Senkronize Et
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
        const bob = c.moving ? Math.abs(Math.sin(walkT + i)) * 0.16 : 0;
        mesh.position.set(to3DX(c.x), 0.08 + bob, to3DZ(c.y));
        if (mesh.userData.legL && c.moving) {
          mesh.userData.legL.rotation.x = Math.sin(walkT + i) * 0.55;
          mesh.userData.legR.rotation.x = -Math.sin(walkT + i) * 0.55;
        }
      } else {
        charMeshes[i].visible = false;
      }
    }

    // 7. 3D Patron Helikopteri & 3D Kar/Konfeti Atmosferi
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
        if (heliMesh.userData.rotorPivot) {
          heliMesh.userData.rotorPivot.rotation.y = v16s.heliFly.rotor;
        }
      } else if (heliMesh) {
        heliMesh.visible = false;
      }

      // 3D Hava Parçacıkları (Kar / Konfeti)
      const particles = v16s.snowFlakes.length > 0 ? v16s.snowFlakes : v16s.confettiBits;
      const isSnow = v16s.snowFlakes.length > 0;
      while (weatherMeshes.length < particles.length) {
        const pm = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.16, 0.32),
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

    // 8. 3D Sahneyi Çiz!
    renderer.render(scene, camera);

    // 9. Ekran Üstü Net 2D Etiketler & Uçan Kazanç Yazıları (+2609 ₺)
    if (overlayCtx && overlayCanvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = overlayCanvas.width / dpr;
      const ch = overlayCanvas.height / dpr;
      overlayCtx.save();
      overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayCtx.clearRect(0, 0, cw, ch);

      // Etkileşimli Bina & Araç Etiketleri
      overlayLabels.forEach((lbl) => {
        const sc = worldToScreen(lbl.lx, lbl.h || 3, lbl.ly);
        if (!sc.visible || sc.x < -60 || sc.x > cw + 60 || sc.y < -30 || sc.y > ch + 30) return;

        if (lbl.pct !== undefined) {
          overlayCtx.fillStyle = "rgba(9, 13, 26, 0.9)";
          overlayCtx.beginPath();
          overlayCtx.roundRect(sc.x - 24, sc.y - 5, 48, 9, 4);
          overlayCtx.fill();
          overlayCtx.fillStyle = lbl.barCol || "#22c55e";
          overlayCtx.fillRect(sc.x - 22, sc.y - 3, 44 * lbl.pct, 5);
        } else {
          overlayCtx.font = "900 10.5px sans-serif";
          const tw = overlayCtx.measureText(lbl.text).width + 16;
          overlayCtx.fillStyle = lbl.bg || "rgba(9, 13, 26, 0.88)";
          overlayCtx.strokeStyle = lbl.brd || "#facc15";
          overlayCtx.lineWidth = 1.6;
          overlayCtx.beginPath();
          overlayCtx.roundRect(sc.x - tw / 2, sc.y - 12, tw, 22, 999);
          overlayCtx.fill();
          overlayCtx.stroke();
          overlayCtx.fillStyle = "#ffffff";
          overlayCtx.textAlign = "center";
          overlayCtx.fillText(lbl.text, sc.x, sc.y + 3);
        }
      });

      // Uçan Kazanç Yazıları
      floats.forEach((ft) => {
        const sc = worldToScreen(ft.x, 4.5 + (1.6 - Math.min(1.6, ft.life)) * 2.8, ft.y);
        if (!sc.visible) return;
        overlayCtx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        overlayCtx.font = "900 13.5px sans-serif";
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
    resetCamera,
    cycleAngle,
    renderFrame
  };
})();

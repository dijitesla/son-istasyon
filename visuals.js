// Son İstasyon v3.0 — Zengin Karakter, Araç ve Görsel Güvenlik Kamerası Çizim Motoru

window.renderPortraitSVG = function (look, mood = "neutral") {
  const skin = look.skin || "#eab68c";
  const outfit = look.outfit || "#334155";
  const outfit2 = look.outfit2 || "#0f172a";
  const hairColor = look.hairColor || "#1e1b2e";
  const style = look.style || "short";
  // style: trucker | long | slick | hood | bun | cap | curly | beanie | hijab | bald | helmet | veil

  let brows = `
    <path d="M65 61 L82 62" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M98 62 L115 61" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
  `;
  let mouth = `<path d="M79 88 Q90 91 101 88" fill="none" stroke="#090d1a" stroke-width="3.4" stroke-linecap="round"/>`;
  let extras = "";
  let pupilOffset = 0;

  if (mood === "nervous") {
    pupilOffset = 2.4;
    brows = `
      <path d="M65 64 L82 58" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M98 58 L115 64" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
    `;
    mouth = `<path d="M79 91 Q85 86 90 90 Q95 94 101 89" fill="none" stroke="#090d1a" stroke-width="3.2" stroke-linecap="round"/>`;
    extras += `
      <path d="M121 56 C125 63 125 68 121 70 C117 68 117 63 121 56 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="2"/>
      <path d="M58 66 C61 71 61 75 58 77 C55 75 55 71 58 66 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="1.8"/>
    `;
  } else if (mood === "angry") {
    brows = `
      <path d="M65 56 L83 64" stroke="#090d1a" stroke-width="4" stroke-linecap="round"/>
      <path d="M97 64 L115 56" stroke="#090d1a" stroke-width="4" stroke-linecap="round"/>
    `;
    mouth = `<path d="M77 92 Q90 83 103 92" fill="none" stroke="#090d1a" stroke-width="3.8" stroke-linecap="round"/>`;
    extras += `<path d="M109 48 L115 52 L111 56" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (mood === "warm") {
    mouth = `<path d="M76 85 Q90 96 104 85" fill="none" stroke="#090d1a" stroke-width="3.6" stroke-linecap="round"/>`;
  }

  if (look.mustache) {
    extras += `<path d="M69 86 Q90 78 111 86 Q101 93 90 90 Q79 93 69 86 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="2.6"/>`;
  }
  if (look.beard) {
    extras += `<path d="M58 80 Q90 118 122 80 Q116 105 90 107 Q64 105 58 80 Z" fill="${hairColor}" fill-opacity="0.88" stroke="#090d1a" stroke-width="2.5"/>`;
  }
  if (look.glasses) {
    extras += `
      <rect x="63" y="63" width="22" height="14" rx="4" fill="rgba(56,189,248,0.2)" stroke="#090d1a" stroke-width="3"/>
      <rect x="95" y="63" width="22" height="14" rx="4" fill="rgba(56,189,248,0.2)" stroke="#090d1a" stroke-width="3"/>
      <line x1="85" y1="69" x2="95" y2="69" stroke="#090d1a" stroke-width="3"/>
    `;
  }
  if (look.sunglasses) {
    extras += `
      <rect x="62" y="62" width="24" height="15" rx="3" fill="#090d1a" stroke="#f59e0b" stroke-width="2.2"/>
      <rect x="94" y="62" width="24" height="15" rx="3" fill="#090d1a" stroke="#f59e0b" stroke-width="2.2"/>
      <line x1="86" y1="68" x2="94" y2="68" stroke="#f59e0b" stroke-width="2.5"/>
    `;
  }
  if (look.scar) {
    extras += `<path d="M103 57 L111 79" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (look.bandage) {
    extras += `<rect x="60" y="76" width="19" height="8" rx="2" transform="rotate(-12 70 80)" fill="#fef3c7" stroke="#090d1a" stroke-width="2"/>`;
  }

  // Kapüşonlu stil
  if (style === "hood") {
    const eyeGlow = mood === "angry" ? "#ef4444" : "#fca5a5";
    return `
      <svg viewBox="0 0 180 180" class="char-svg">
        <path d="M22 180 C26 126 52 114 90 114 C128 114 154 126 158 180 Z" fill="${outfit2}" stroke="#090d1a" stroke-width="5"/>
        <path d="M38 110 C34 36 62 20 90 20 C118 20 146 36 142 110 C126 124 54 124 38 110 Z" fill="${outfit}" stroke="#090d1a" stroke-width="5"/>
        <ellipse cx="90" cy="74" rx="34" ry="36" fill="#080b14"/>
        <ellipse cx="${76 + pupilOffset}" cy="69" rx="5.5" ry="3.2" fill="${eyeGlow}"/>
        <ellipse cx="${104 + pupilOffset}" cy="69" rx="5.5" ry="3.2" fill="${eyeGlow}"/>
        <path d="M64 85 L116 85" stroke="#374151" stroke-width="4" stroke-linecap="round"/>
        ${mood === "nervous" ? `<path d="M126 56 C130 63 130 68 126 70 C122 68 122 63 126 56 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="2"/>` : ""}
      </svg>
    `;
  }

  // Motosiklet Kasklı stil
  if (style === "helmet") {
    const helmColor = look.capColor || "#e11d48";
    return `
      <svg viewBox="0 0 180 180" class="char-svg">
        <path d="M24 180 C28 128 54 116 90 116 C126 116 152 128 156 180 Z" fill="${outfit}" stroke="#090d1a" stroke-width="5"/>
        <ellipse cx="90" cy="68" rx="44" ry="44" fill="${helmColor}" stroke="#090d1a" stroke-width="5"/>
        <path d="M54 56 L126 56 C128 74 118 86 90 86 C62 86 52 74 54 56 Z" fill="#1e293b" stroke="#090d1a" stroke-width="4"/>
        <path d="M62 62 L106 62" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      </svg>
    `;
  }

  let hairBack = "";
  let hairTop = "";

  if (style === "long") {
    hairBack = `<path d="M44 56 C37 96 39 134 54 146 L126 146 C141 134 143 96 136 56 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="5"/>`;
    hairTop = `<path d="M54 58 C62 32 118 32 126 58 C112 49 96 53 90 45 C80 53 66 49 54 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4"/>`;
  } else if (style === "veil") {
    // Gelin duvağı
    hairBack = `<path d="M36 48 C26 96 28 144 48 162 L132 162 C152 144 154 96 144 48 Z" fill="rgba(255,255,255,0.72)" stroke="#cbd5e1" stroke-width="3"/>`;
    hairTop = `
      <path d="M54 56 C62 32 118 32 126 56 C108 46 72 46 54 56 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4"/>
      <path d="M66 36 Q90 22 114 36" fill="none" stroke="#fef08a" stroke-width="4"/>
    `;
  } else if (style === "hijab") {
    const scarf = look.capColor || "#0ea5e9";
    hairBack = `<path d="M44 52 C40 98 46 132 90 136 C134 132 140 98 136 52 C126 24 54 24 44 52 Z" fill="${scarf}" stroke="#090d1a" stroke-width="5"/>`;
    hairTop = `<path d="M54 54 Q90 40 126 54" fill="none" stroke="#090d1a" stroke-width="4"/>`;
  } else if (style === "bun") {
    hairBack = `<circle cx="90" cy="25" r="16" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
    hairTop = `<path d="M53 58 C56 32 124 32 127 58 C108 46 72 46 53 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4"/>`;
  } else if (style === "trucker" || style === "cap") {
    const capColor = look.capColor || "#dc2626";
    hairTop = `
      <path d="M48 56 C48 25 132 25 132 56 Z" fill="${capColor}" stroke="#090d1a" stroke-width="5"/>
      <rect x="69" y="31" width="42" height="15" rx="4" fill="#fef08a" stroke="#090d1a" stroke-width="3"/>
      <path d="M42 55 Q90 46 142 58 Q112 64 42 55 Z" fill="${outfit2}" stroke="#090d1a" stroke-width="4"/>
    `;
  } else if (style === "beanie") {
    const bColor = look.capColor || "#374151";
    hairTop = `
      <path d="M50 56 C50 24 130 24 130 56 Z" fill="${bColor}" stroke="#090d1a" stroke-width="5"/>
      <rect x="48" y="46" width="84" height="13" rx="5" fill="${outfit2}" stroke="#090d1a" stroke-width="3.5"/>
    `;
  } else if (style === "curly") {
    hairTop = `<path d="M48 58 C44 33 66 22 90 25 C114 22 136 33 132 58 C118 46 62 46 48 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
  } else if (style === "bald") {
    hairTop = `<path d="M68 44 Q90 38 112 44" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-linecap="round"/>`;
  } else {
    hairTop = `<path d="M52 54 C54 27 124 26 128 52 C114 40 72 40 52 54 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
  }

  return `
    <svg viewBox="0 0 180 180" class="char-svg">
      ${hairBack}
      <path d="M25 180 C30 129 55 118 90 118 C125 118 150 129 155 180 Z" fill="${outfit}" stroke="#090d1a" stroke-width="5"/>
      <path d="M72 118 L90 152 L108 118 Z" fill="${outfit2}" stroke="#090d1a" stroke-width="4"/>
      ${look.tie ? `<path d="M87 123 L93 123 L95 150 L90 156 L85 150 Z" fill="${look.tie}" stroke="#090d1a" stroke-width="2.2"/>` : ""}
      <rect x="76" y="96" width="28" height="25" rx="8" fill="${skin}" stroke="#090d1a" stroke-width="4"/>
      <rect x="54" y="38" width="72" height="65" rx="26" fill="${skin}" stroke="#090d1a" stroke-width="5"/>
      ${hairTop}
      <circle cx="${75 + pupilOffset}" cy="70" r="4.8" fill="#090d1a"/>
      <circle cx="${105 + pupilOffset}" cy="70" r="4.8" fill="#090d1a"/>
      <circle cx="${76.5 + pupilOffset}" cy="68.5" r="1.5" fill="#ffffff"/>
      <circle cx="${106.5 + pupilOffset}" cy="68.5" r="1.5" fill="#ffffff"/>
      ${brows}
      ${mouth}
      ${extras}
    </svg>
  `;
};

// Pencere Dışındaki Gerçekçi Araç Silüetleri
window.renderOutsideVehicleSVG = function (car) {
  if (!car || car.shape === "walk") return "";
  const col = car.color || "#3b82f6";
  const shape = car.shape || "sedan"; // truck | suv | van | sport | taxi | moto | ambulance | sedan

  if (shape === "truck") {
    return `
      <svg viewBox="0 0 130 56" width="112" height="48">
        <rect x="42" y="6" width="84" height="38" rx="4" fill="#334155" stroke="#070911" stroke-width="3"/>
        <path d="M8 22 L38 22 L38 44 L8 44 Z" fill="${col}" stroke="#070911" stroke-width="3"/>
        <rect x="12" y="25" width="16" height="10" rx="2" fill="#7dd3fc"/>
        <circle cx="22" cy="46" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="62" cy="46" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="108" cy="46" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="8" cy="36" r="3.5" fill="#fef08a"/>
      </svg>
    `;
  }
  if (shape === "van" || shape === "ambulance") {
    const stripe = shape === "ambulance" ? `<rect x="16" y="28" width="88" height="6" fill="#ef4444"/><rect x="96" y="8" width="10" height="5" rx="2" fill="#38bdf8"/>` : "";
    return `
      <svg viewBox="0 0 120 52" width="104" height="45">
        <path d="M10 26 L26 12 L110 12 L110 42 L10 42 Z" fill="${col}" stroke="#070911" stroke-width="3"/>
        <path d="M16 26 L28 16 L50 16 L50 26 Z" fill="#7dd3fc"/>
        ${stripe}
        <circle cx="28" cy="43" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="92" cy="43" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
        <circle cx="10" cy="34" r="3.5" fill="#fef08a"/>
      </svg>
    `;
  }
  if (shape === "moto") {
    return `
      <svg viewBox="0 0 90 48" width="78" height="42">
        <circle cx="20" cy="36" r="9" fill="#090d1a" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="68" cy="36" r="9" fill="#090d1a" stroke="#94a3b8" stroke-width="3"/>
        <path d="M20 36 L38 20 L64 24 L68 36" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="15" cy="24" r="4" fill="#fef08a"/>
      </svg>
    `;
  }

  // Sedan / SUV / Taxi / Sport
  const taxiSign = shape === "taxi" ? `<rect x="48" y="6" width="22" height="7" rx="2" fill="#fef08a" stroke="#070911" stroke-width="2"/>` : "";
  const roofH = shape === "suv" ? 11 : 15;
  return `
    <svg viewBox="0 0 116 48" width="100" height="42">
      ${taxiSign}
      <path d="M8 26 L26 ${roofH} L86 ${roofH} L106 26 L108 40 L8 40 Z" fill="${col}" stroke="#070911" stroke-width="3"/>
      <path d="M29 ${roofH + 3} L82 ${roofH + 3} L96 25 L18 25 Z" fill="#7dd3fc" opacity="0.65"/>
      <circle cx="27" cy="40" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="88" cy="40" r="7" fill="#090d1a" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="9" cy="32" r="3.5" fill="#fef08a"/>
    </svg>
  `;
};

// GÜVENLİK KAMERASI 1 (POMPA 4 CANLI GÖRSEL EKRAN)
window.renderCctvPumpSVG = function (car) {
  const col = car.color || "#334155";
  const mudOverlay = car.muddyPlate
    ? `<path d="M108 82 Q132 76 146 92 Q122 98 106 90 Z" fill="#422006" opacity="0.88"/>`
    : "";
  const vestClue = car.vestClue
    ? `<path d="M196 58 L212 74 L202 80 L190 62 Z" fill="#ef4444" stroke="#070911" stroke-width="2"/>`
    : "";
  const walkScene =
    car.shape === "walk"
      ? `<text x="140" y="68" text-anchor="middle" fill="#86efac" font-size="13" font-weight="bold">[POMPA 4 BOŞ — YAYA GELDİ]</text>`
      : `
        <!-- Araç Arka/Yan Görünüm -->
        <rect x="66" y="34" width="142" height="52" rx="10" fill="${col}" stroke="#86efac" stroke-width="2"/>
        <rect x="82" y="40" width="96" height="18" rx="4" fill="#0f172a" stroke="#4ade80" stroke-width="1.2"/>
        <circle cx="92" cy="88" r="11" fill="#052e16" stroke="#86efac" stroke-width="2.5"/>
        <circle cx="182" cy="88" r="11" fill="#052e16" stroke="#86efac" stroke-width="2.5"/>
        <!-- Plaka -->
        <rect x="108" y="76" width="66" height="14" rx="2" fill="#f8fafc" stroke="#090d1a" stroke-width="1.5"/>
        <text x="141" y="86" text-anchor="middle" fill="#090d1a" font-family="monospace" font-weight="900" font-size="9.5">${car.plate}</text>
        ${mudOverlay}
        ${vestClue}
      `;

  return `
    <svg viewBox="0 0 280 112" width="100%" height="112" style="background:#04120a; border:1.5px solid #22c55e; border-radius:8px; margin-bottom:8px;">
      <!-- Pompa 4 Direği -->
      <rect x="18" y="20" width="28" height="76" rx="3" fill="#14532d" stroke="#4ade80" stroke-width="1.8"/>
      <text x="32" y="38" text-anchor="middle" fill="#86efac" font-size="9" font-weight="bold">P-04</text>
      <line x1="0" y1="98" x2="280" y2="98" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="5 4"/>
      ${walkScene}
      <text x="10" y="14" fill="#4ade80" font-size="9" font-family="monospace">REC ● CAM-01 GECE GÖRÜŞÜ</text>
    </svg>
  `;
};

// GÜVENLİK KAMERASI 2 (ARKA DEPO CANLI GÖRSEL EKRAN)
window.renderCctvDepotSVG = function (hasIntruder, scared) {
  const intruderSvg =
    hasIntruder && !scared
      ? `
        <!-- Maskeli Hırsız ve Levye -->
        <g>
          <ellipse cx="176" cy="48" rx="13" ry="15" fill="#090d1a" stroke="#ef4444" stroke-width="2"/>
          <circle cx="172" cy="46" r="2" fill="#ef4444"/>
          <circle cx="180" cy="46" r="2" fill="#ef4444"/>
          <path d="M156 102 C158 68 194 68 196 102 Z" fill="#111827" stroke="#ef4444" stroke-width="2"/>
          <!-- Levye -->
          <path d="M158 76 L132 64 L128 69" fill="none" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="148" y="18" width="96" height="15" rx="3" fill="#7f1d1d"/>
          <text x="196" y="29" text-anchor="middle" fill="#fecaca" font-size="9" font-weight="bold">! HAREKET ALGILANDI !</text>
        </g>
      `
      : scared
      ? `<text x="185" y="64" text-anchor="middle" fill="#fde68a" font-size="10.5" font-weight="bold">💡 SPOT AÇIK — ŞAHIS KAÇTI</text>`
      : `<text x="190" y="64" text-anchor="middle" fill="#4ade80" font-size="10" opacity="0.75">[HAREKET YOK — KİLİT SAĞLAM]</text>`;

  return `
    <svg viewBox="0 0 280 112" width="100%" height="112" style="background:#04120a; border:1.5px solid ${hasIntruder && !scared ? "#ef4444" : "#22c55e"}; border-radius:8px; margin-bottom:8px;">
      <!-- Çelik Depo Kapısı -->
      <rect x="74" y="22" width="60" height="80" fill="#0b2919" stroke="#4ade80" stroke-width="2"/>
      <line x1="74" y1="42" x2="134" y2="42" stroke="#22c55e" stroke-width="1"/>
      <line x1="74" y1="62" x2="134" y2="62" stroke="#22c55e" stroke-width="1"/>
      <line x1="74" y1="82" x2="134" y2="82" stroke="#22c55e" stroke-width="1"/>
      <circle cx="126" cy="64" r="4" fill="#fde68a"/>
      <line x1="0" y1="102" x2="280" y2="102" stroke="#22c55e" stroke-width="1.5"/>
      ${intruderSvg}
      <text x="10" y="14" fill="#4ade80" font-size="9" font-family="monospace">REC ● CAM-02 ARKA DEPO</text>
    </svg>
  `;
};

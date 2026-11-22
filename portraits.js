// Son İstasyon v2 — Dinamik Çizgi Roman Karakter ve İfade Üreticisi
// mood: "neutral" | "nervous" | "angry" | "warm"

window.renderPortraitSVG = function (look, mood = "neutral") {
  const skin = look.skin || "#eab68c";
  const outfit = look.outfit || "#334155";
  const outfit2 = look.outfit2 || "#0f172a";
  const hairColor = look.hairColor || "#1e1b2e";
  const style = look.style || "short"; // trucker | long | slick | hood | bun | cap | curly | scarred

  // Yüz ifadeleri
  let brows = `
    <path d="M65 61 L82 62" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M98 62 L115 61" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
  `;
  let mouth = `<path d="M79 88 Q90 91 101 88" fill="none" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>`;
  let extras = "";
  let pupilOffset = 0;

  if (mood === "nervous") {
    pupilOffset = 2.2;
    brows = `
      <path d="M65 64 L82 58" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M98 58 L115 64" stroke="#090d1a" stroke-width="3.5" stroke-linecap="round"/>
    `;
    mouth = `<path d="M80 91 Q85 86 90 90 Q95 94 101 89" fill="none" stroke="#090d1a" stroke-width="3.2" stroke-linecap="round"/>`;
    extras += `
      <!-- Ter Damlaları -->
      <path d="M120 56 C124 63 124 68 120 70 C116 68 116 63 120 56 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="2"/>
      <path d="M58 66 C61 71 61 75 58 77 C55 75 55 71 58 66 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="1.8"/>
    `;
  } else if (mood === "angry") {
    brows = `
      <path d="M65 57 L83 64" stroke="#090d1a" stroke-width="4" stroke-linecap="round"/>
      <path d="M97 64 L115 57" stroke="#090d1a" stroke-width="4" stroke-linecap="round"/>
    `;
    mouth = `<path d="M77 92 Q90 83 103 92" fill="none" stroke="#090d1a" stroke-width="3.8" stroke-linecap="round"/>`;
    extras += `<path d="M108 49 L114 53 L110 56" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (mood === "warm") {
    mouth = `<path d="M76 85 Q90 96 104 85" fill="none" stroke="#090d1a" stroke-width="3.6" stroke-linecap="round"/>`;
  }

  if (look.mustache) {
    extras += `<path d="M69 86 Q90 78 111 86 Q101 93 90 90 Q79 93 69 86 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="2.8"/>`;
  }
  if (look.glasses) {
    extras += `
      <rect x="63" y="63" width="22" height="14" rx="4" fill="rgba(56,189,248,0.18)" stroke="#090d1a" stroke-width="3"/>
      <rect x="95" y="63" width="22" height="14" rx="4" fill="rgba(56,189,248,0.18)" stroke="#090d1a" stroke-width="3"/>
      <line x1="85" y1="69" x2="95" y2="69" stroke="#090d1a" stroke-width="3"/>
    `;
  }
  if (look.scar) {
    extras += `<path d="M102 58 L110 78" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (look.bandage) {
    extras += `<rect x="61" y="76" width="18" height="8" rx="2" transform="rotate(-12 70 80)" fill="#fef3c7" stroke="#090d1a" stroke-width="2"/>`;
  }

  // Kapüşonlu gizemli stil
  if (style === "hood") {
    const eyeGlow = mood === "angry" ? "#ef4444" : "#fca5a5";
    return `
      <svg viewBox="0 0 180 180" class="char-svg">
        <defs>
          <linearGradient id="gHood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${outfit}"/>
            <stop offset="100%" stop-color="${outfit2}"/>
          </linearGradient>
        </defs>
        <path d="M22 180 C26 126 52 114 90 114 C128 114 154 126 158 180 Z" fill="url(#gHood)" stroke="#090d1a" stroke-width="5"/>
        <path d="M38 110 C34 36 62 20 90 20 C118 20 146 36 142 110 C126 124 54 124 38 110 Z" fill="${outfit}" stroke="#090d1a" stroke-width="5"/>
        <ellipse cx="90" cy="74" rx="34" ry="36" fill="#080b14"/>
        <ellipse cx="${76 + pupilOffset}" cy="69" rx="5.5" ry="3.2" fill="${eyeGlow}"/>
        <ellipse cx="${104 + pupilOffset}" cy="69" rx="5.5" ry="3.2" fill="${eyeGlow}"/>
        <path d="M64 85 L116 85" stroke="#374151" stroke-width="4" stroke-linecap="round"/>
        ${mood === "nervous" ? `<path d="M126 56 C130 63 130 68 126 70 C122 68 122 63 126 56 Z" fill="#38bdf8" stroke="#090d1a" stroke-width="2"/>` : ""}
      </svg>
    `;
  }

  let hairBack = "";
  let hairTop = "";
  if (style === "long") {
    hairBack = `<path d="M44 56 C37 96 39 134 54 146 L126 146 C141 134 143 96 136 56 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="5"/>`;
    hairTop = `<path d="M54 58 C62 32 118 32 126 58 C112 49 96 53 90 45 C80 53 66 49 54 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4"/>`;
  } else if (style === "bun") {
    hairBack = `<circle cx="90" cy="26" r="16" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
    hairTop = `<path d="M53 58 C56 32 124 32 127 58 C108 46 72 46 53 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4"/>`;
  } else if (style === "trucker" || style === "cap") {
    const capColor = look.capColor || "#dc2626";
    hairTop = `
      <path d="M48 56 C48 25 132 25 132 56 Z" fill="${capColor}" stroke="#090d1a" stroke-width="5"/>
      <rect x="69" y="31" width="42" height="15" rx="4" fill="#fef08a" stroke="#090d1a" stroke-width="3"/>
      <path d="M42 55 Q90 46 142 58 Q112 64 42 55 Z" fill="${outfit2}" stroke="#090d1a" stroke-width="4"/>
    `;
  } else if (style === "curly") {
    hairTop = `<path d="M48 58 C44 34 66 24 90 26 C114 24 136 34 132 58 C118 46 62 46 48 58 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
  } else {
    // slick / short
    hairTop = `<path d="M52 54 C54 27 124 26 128 52 C114 40 72 40 52 54 Z" fill="${hairColor}" stroke="#090d1a" stroke-width="4.5"/>`;
  }

  return `
    <svg viewBox="0 0 180 180" class="char-svg">
      ${hairBack}
      <!-- Omuzlar ve Kıyafet -->
      <path d="M25 180 C30 129 55 118 90 118 C125 118 150 129 155 180 Z" fill="${outfit}" stroke="#090d1a" stroke-width="5"/>
      <path d="M72 118 L90 152 L108 118 Z" fill="${outfit2}" stroke="#090d1a" stroke-width="4"/>
      ${look.tie ? `<path d="M87 123 L93 123 L95 150 L90 156 L85 150 Z" fill="${look.tie}" stroke="#090d1a" stroke-width="2.2"/>` : ""}
      <!-- Boyun ve Yüz -->
      <rect x="76" y="96" width="28" height="25" rx="8" fill="${skin}" stroke="#090d1a" stroke-width="4"/>
      <rect x="54" y="38" width="72" height="65" rx="26" fill="${skin}" stroke="#090d1a" stroke-width="5"/>
      ${hairTop}
      <!-- Gözler -->
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

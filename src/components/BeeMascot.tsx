export function BeeMascot({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="beeBody" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFE94D" />
          <stop offset="55%" stopColor="#FFC700" />
          <stop offset="100%" stopColor="#E8A400" />
        </radialGradient>
        <linearGradient id="beeStripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B2420" />
          <stop offset="100%" stopColor="#15110E" />
        </linearGradient>
        <linearGradient id="leafVest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5CDB6B" />
          <stop offset="100%" stopColor="#1FA94B" />
        </linearGradient>
        <radialGradient id="starBadge" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="55%" stopColor="#FFD54A" />
          <stop offset="100%" stopColor="#E8A400" />
        </radialGradient>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B6FF4D" />
          <stop offset="100%" stopColor="#23D46B" />
        </linearGradient>
        <radialGradient id="wingGrad" cx="30%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#DFF3FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#BFE6FF" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* wings */}
      <ellipse cx="29" cy="40" rx="15" ry="20" fill="url(#wingGrad)" stroke="#CDEBFF" strokeWidth="1" transform="rotate(-18 29 40)" />
      <ellipse cx="71" cy="40" rx="15" ry="20" fill="url(#wingGrad)" stroke="#CDEBFF" strokeWidth="1" transform="rotate(18 71 40)" />

      {/* antennae with lightning-bolt tips */}
      <path d="M43 22 C40 14, 36 11, 34 6" stroke="#2B2420" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M57 22 C60 14, 64 11, 66 6" stroke="#2B2420" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M31.5 2.5 L35.5 6 L32.5 7.5 L37 12.5 L31 8.5 L34 7 Z" fill="url(#boltGrad)" />
      <path d="M68.5 2.5 L64.5 6 L67.5 7.5 L63 12.5 L69 8.5 L66 7 Z" fill="url(#boltGrad)" />

      {/* body */}
      <ellipse cx="50" cy="52" rx="29" ry="26" fill="url(#beeBody)" />
      <path d="M22 44 C30 40, 70 40, 78 44 C77 49, 23 49, 22 44 Z" fill="url(#beeStripe)" opacity="0.92" />
      <path d="M24 60 C32 56, 68 56, 76 60 C74 66, 26 66, 24 60 Z" fill="url(#beeStripe)" opacity="0.92" />

      {/* leaf vest */}
      <path
        d="M30 46 C27 58, 29 70, 37 75 C41 70, 42 56, 40 46 C37 44, 33 44, 30 46 Z"
        fill="url(#leafVest)"
        stroke="#15803D"
        strokeWidth="1"
      />
      <path
        d="M70 46 C73 58, 71 70, 63 75 C59 70, 58 56, 60 46 C63 44, 67 44, 70 46 Z"
        fill="url(#leafVest)"
        stroke="#15803D"
        strokeWidth="1"
      />
      <path d="M34 50 C35 58, 36 65, 38 71" stroke="#15803D" strokeWidth="1" opacity="0.6" fill="none" />
      <path d="M66 50 C65 58, 64 65, 62 71" stroke="#15803D" strokeWidth="1" opacity="0.6" fill="none" />

      {/* star badge on chest */}
      <circle cx="50" cy="64" r="11" fill="url(#starBadge)" stroke="#C97E00" strokeWidth="1" />
      <circle cx="50" cy="64" r="11" fill="none" stroke="#FFF6D6" strokeWidth="1.2" opacity="0.7" />
      <path
        d="M50 57.5 L52.1 61.9 L57 62.6 L53.5 66 L54.3 70.8 L50 68.5 L45.7 70.8 L46.5 66 L43 62.6 L47.9 61.9 Z"
        fill="#fff"
      />

      {/* face */}
      <circle cx="40" cy="48" r="6.4" fill="#fff" />
      <circle cx="60" cy="48" r="6.4" fill="#fff" />
      <circle cx="41.2" cy="48.8" r="3.6" fill="#1A1523" />
      <circle cx="61.2" cy="48.8" r="3.6" fill="#1A1523" />
      <circle cx="42.6" cy="47.2" r="1.2" fill="#fff" />
      <circle cx="62.6" cy="47.2" r="1.2" fill="#fff" />
      <path d="M45 55.5 C47.5 58, 52.5 58, 55 55.5" stroke="#8A4B00" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="33" cy="53" r="3.2" fill="#FF9E9E" opacity="0.55" />
      <circle cx="67" cy="53" r="3.2" fill="#FF9E9E" opacity="0.55" />

      {/* glossy highlight */}
      <ellipse cx="40" cy="38" rx="9" ry="5.5" fill="#fff" opacity="0.35" transform="rotate(-20 40 38)" />
    </svg>
  );
}

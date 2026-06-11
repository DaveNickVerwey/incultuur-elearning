// SVG line iconen voor de 4 doelgroepen
// stijl: dunne lijnen, geen vulling, vergelijkbaar met Lucide/Phosphor

export const IconCultuur = ({ size = 24, color = 'currentColor', stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {/* Twee theatermaskers */}
    <path d="M3 6c0-1 .8-2 2-2h4c1.2 0 2 1 2 2v5c0 2.5-2 4-4 4s-4-1.5-4-4V6z" />
    <circle cx="5.5" cy="8.5" r="0.5" fill={color} />
    <circle cx="8.5" cy="8.5" r="0.5" fill={color} />
    <path d="M5.5 11.5 Q7 12.5 8.5 11.5" />
    <path d="M13 9c0-1 .8-2 2-2h4c1.2 0 2 1 2 2v5c0 2.5-2 4-4 4s-4-1.5-4-4V9z" />
    <circle cx="15.5" cy="11.5" r="0.5" fill={color} />
    <circle cx="18.5" cy="11.5" r="0.5" fill={color} />
    <path d="M15.5 14.5 Q17 15.5 18.5 14.5" />
  </svg>
)

export const IconBereik = ({ size = 24, color = 'currentColor', stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {/* Megafoon */}
    <path d="M3 11v2a1 1 0 0 0 1 1h2l5 3.5V6.5L6 10H4a1 1 0 0 0-1 1z" />
    <line x1="14" y1="9" x2="16.5" y2="7" />
    <line x1="14" y1="12" x2="17" y2="12" />
    <line x1="14" y1="15" x2="16.5" y2="17" />
  </svg>
)

export const IconSamenwerking = ({ size = 24, color = 'currentColor', stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {/* 4 handen in cirkel */}
    <path d="M12 4 Q11 6 10 7 Q9 8 9 9 L11 11 L13 11 L15 9 Q15 8 14 7 Q13 6 12 4z" />
    <path d="M20 12 Q18 11 17 10 Q16 9 15 9 L13 11 L13 13 L15 15 Q16 15 17 14 Q18 13 20 12z" />
    <path d="M12 20 Q13 18 14 17 Q15 16 15 15 L13 13 L11 13 L9 15 Q9 16 10 17 Q11 18 12 20z" />
    <path d="M4 12 Q6 13 7 14 Q8 15 9 15 L11 13 L11 11 L9 9 Q8 9 7 10 Q6 11 4 12z" />
  </svg>
)

export const IconMogelijkheden = ({ size = 24, color = 'currentColor', stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {/* Open deur */}
    <path d="M4 21h16" />
    <path d="M6 21V5a1 1 0 0 1 .7-1L14 2.5a1 1 0 0 1 1.3 1V21" />
    <circle cx="13" cy="12" r="0.6" fill={color} />
  </svg>
)

export const doelgroepIconen = {
  C: IconCultuur,
  B: IconBereik,
  S: IconSamenwerking,
  M: IconMogelijkheden,
}
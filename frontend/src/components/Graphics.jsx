/** Small inline SVG pieces used across the interface. */

/** A bangka: the double-outrigger boat seen all around Bantayan. */
export function Bangka({ size = 40, hull = '#ffffff', accent = '#f08a4b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="35" cy="14" r="5" fill={accent} />
      <path d="M13 29 L11 21 M35 29 L37 21" stroke={hull} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 21 H45" stroke={hull} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 21 q4 -2 8 0 M38 21 q4 -2 8 0" stroke={hull} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M9 29 H39 q-2 9 -9 9 H18 q-7 0 -9 -9 Z" fill={hull} />
      <path d="M0 43 q6 -4 12 0 t12 0 t12 0 t12 0" stroke={hull} strokeOpacity=".55" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** A repeating wave band. `fill` is the colour of the water. */
export function Waves({ fill = '#f2f7f6', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 30 C100 6 200 6 300 30 S500 54 600 30 S800 6 900 30 S1100 54 1200 30 V60 H0 Z"
        fill={fill}
      />
    </svg>
  )
}

const icon = (path) =>
  function Icon({ size = 22 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {path}
      </svg>
    )
  }

export const IconSearch = icon(<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>)
export const IconPrint = icon(<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v6H7z" /></>)
export const IconPlus = icon(<path d="M12 5v14M5 12h14" />)
export const IconSort = icon(<><path d="M8 5v14M4.5 15.5L8 19l3.5-3.5" /><path d="M16 19V5M12.5 8.5L16 5l3.5 3.5" /></>)

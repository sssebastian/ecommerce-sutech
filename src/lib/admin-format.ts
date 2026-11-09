// Fechas formateadas a mano (sin depender de la zona horaria del navegador)
// para que servidor y cliente rendericen exactamente lo mismo.
const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

/** "2026-11-08T14:05" → "8 nov, 14:05" */
export function formatDateTime(iso: string) {
  const [date, time] = iso.split("T")
  const [, m, d] = date.split("-").map(Number)
  return time ? `${d} ${months[m - 1]}, ${time}` : `${d} ${months[m - 1]}`
}

/** "2026-11-08" → "8 nov 2026" */
export function formatLongDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${d} ${months[m - 1]} ${y}`
}

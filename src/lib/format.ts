// Único lugar para cambiar moneda y región.
const currency = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function formatPrice(value: number) {
  return currency.format(value)
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round((1 - price / compareAt) * 100)
}

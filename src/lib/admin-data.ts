// Datos mock del panel de administración. Deterministas (sin Math.random
// ni fechas actuales) para que el prerender sea estable.
import { products, type CategorySlug } from "./data"

// Generador pseudoaleatorio con semilla: mismos datos en cada render.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ── Productos (vista admin) ────────────────────────────────────────────────
export type ProductStatus = "activo" | "borrador" | "archivado"

export const adminProducts = products.map((p, i) => ({
  ...p,
  sku: `ST-${p.id.toUpperCase().padStart(4, "0")}`,
  status: (i === 4 ? "borrador" : i === 19 ? "archivado" : "activo") as ProductStatus,
  sold: Math.round(p.reviewCount * 1.8),
}))

export type AdminProduct = (typeof adminProducts)[number]

// ── Ventas diarias (últimos 30 días hasta el 08/11/2026) ───────────────────
const rand = seeded(42)
export const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 9, 10 + i)) // 10 oct → 8 nov
  const weekend = [0, 6].includes(date.getUTCDay())
  const trend = 3800 + i * 55
  const value = Math.round(trend * (weekend ? 1.25 : 1) * (0.8 + rand() * 0.4))
  return { date: date.toISOString().slice(0, 10), revenue: value }
})

export const revenueByCategory: { category: CategorySlug; label: string; revenue: number }[] = [
  { category: "pcs", label: "PCs", revenue: 38400 },
  { category: "laptops", label: "Laptops", revenue: 31250 },
  { category: "monitores", label: "Monitores", revenue: 18900 },
  { category: "componentes", label: "Componentes", revenue: 14100 },
  { category: "mouse", label: "Mouse", revenue: 7650 },
  { category: "teclados", label: "Teclados", revenue: 6900 },
  { category: "audio", label: "Audio", revenue: 4300 },
  { category: "accesorios", label: "Accesorios", revenue: 2750 },
]

export const kpis = [
  { label: "Ingresos (30 días)", value: dailyRevenue.reduce((s, d) => s + d.revenue, 0), format: "money", delta: 12.4 },
  { label: "Pedidos", value: 1284, format: "number", delta: 8.1 },
  { label: "Ticket promedio", value: 97, format: "money", delta: -2.3 },
  { label: "Clientes nuevos", value: 342, format: "number", delta: 18.6 },
] as const

// ── Usuarios ────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "soporte" | "cliente"
export type UserStatus = "activo" | "suspendido" | "pendiente"

const firstNames = ["María", "Luis", "Andrea", "Carlos", "Sofía", "Diego", "Valentina", "Javier", "Camila", "Mateo", "Lucía", "Andrés", "Paula", "Tomás", "Daniela", "Gabriel", "Fernanda", "Ricardo"]
const lastNames = ["García", "Rodríguez", "Pérez", "López", "Martínez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Vargas", "Castro", "Morales", "Ortiz", "Rojas", "Herrera"]

const urand = seeded(7)
export const users = firstNames.map((first, i) => {
  const last = lastNames[(i * 5) % lastNames.length]
  const role: UserRole = i === 0 ? "admin" : i === 3 || i === 11 ? "soporte" : "cliente"
  const status: UserStatus = i === 7 ? "suspendido" : i === 14 || i === 16 ? "pendiente" : "activo"
  const orders = role === "cliente" && status !== "pendiente" ? Math.floor(urand() * 14) + 1 : 0
  const day = 1 + Math.floor(urand() * 27)
  const month = 1 + Math.floor(urand() * 10)
  return {
    id: `u${i + 1}`,
    name: `${first} ${last}`,
    email: `${first.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()}.${last.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()}@correo.com`,
    role,
    status,
    orders,
    spent: orders * Math.round(80 + urand() * 260),
    joined: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  }
})

export type AdminUser = (typeof users)[number]

// ── Pedidos y pagos ─────────────────────────────────────────────────────────
// Cada pago pertenece a un pedido: montos, clientes y estados coinciden.
export type PaymentStatus = "pagado" | "pendiente" | "reembolsado" | "fallido"
export type PaymentMethod = "tarjeta" | "paypal" | "transferencia"
export type FulfillmentStatus = "pendiente" | "preparando" | "enviado" | "entregado" | "cancelado" | "devuelto"
export type ShippingMethodName = "Envío estándar" | "Envío express" | "Retiro en tienda"

const prand = seeded(99)
const methods: PaymentMethod[] = ["tarjeta", "tarjeta", "tarjeta", "paypal", "transferencia"]
const statuses: PaymentStatus[] = ["pagado", "pagado", "pagado", "pagado", "pagado", "pendiente", "pendiente", "reembolsado", "fallido"]
const cities = [
  { city: "Ciudad de México", region: "CDMX", postal: "06600" },
  { city: "Guadalajara", region: "Jalisco", postal: "44100" },
  { city: "Monterrey", region: "Nuevo León", postal: "64000" },
  { city: "Puebla", region: "Puebla", postal: "72000" },
]
const streets = ["Av. Reforma 222", "Calle Juárez 45", "Av. Insurgentes Sur 1602", "Calle Hidalgo 310", "Blvd. Constitución 89"]
const carriers = ["DHL", "Estafeta", "FedEx"]

export const orders = Array.from({ length: 24 }, (_, i) => {
  const customer = users[(i * 7 + 1) % users.length]
  const method = methods[Math.floor(prand() * methods.length)]
  const paymentStatus: PaymentStatus =
    method === "transferencia" && i % 2 === 0 ? "pendiente" : statuses[Math.floor(prand() * statuses.length)]

  const itemCount = 1 + Math.floor(prand() * 3)
  const items = Array.from({ length: itemCount }, (_, j) => {
    const product = products[(i * 3 + j * 7) % products.length]
    return { productId: product.id, name: product.name, category: product.category, sku: `ST-${product.id.toUpperCase().padStart(4, "0")}`, unitPrice: product.price, quantity: j === 0 && prand() > 0.7 ? 2 : 1 }
  })
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
  const shippingMethod: ShippingMethodName = i % 5 === 3 ? "Retiro en tienda" : i % 4 === 1 ? "Envío express" : "Envío estándar"
  const shipping = shippingMethod === "Envío express" ? 19 : shippingMethod === "Retiro en tienda" || subtotal >= 99 ? 0 : 9

  const day = Math.max(8 - Math.floor(i / 3), 1)
  const hour = 9 + ((i * 3) % 12)
  const date = `2026-11-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`

  const fulfillment: FulfillmentStatus =
    paymentStatus === "fallido" ? "cancelado"
    : paymentStatus === "reembolsado" ? "devuelto"
    : paymentStatus === "pendiente" ? "pendiente"
    : day >= 7 ? "preparando"
    : day >= 5 ? "enviado"
    : "entregado"

  const place = cities[i % cities.length]
  const number = 104823 - i
  return {
    id: `ST-${number}`,
    number: `#ST-${number}`,
    date,
    customer: { id: customer.id, name: customer.name, email: customer.email, phone: `+52 55 ${String(1000 + i * 137).slice(0, 4)} ${String(5000 + i * 211).slice(0, 4)}`, orders: Math.max(customer.orders, 1) },
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    shippingMethod,
    address: { line1: streets[i % streets.length], line2: i % 3 === 0 ? "Depto. 4B" : undefined, ...place },
    tracking: fulfillment === "enviado" || fulfillment === "entregado" ? { carrier: carriers[i % carriers.length], code: `1Z${(9876543 + i * 7919).toString(36).toUpperCase()}` } : undefined,
    payment: {
      id: `pay_${(48213 - i * 37).toString(36)}`,
      method,
      last4: method === "tarjeta" ? String(1000 + Math.floor(prand() * 8999)) : undefined,
      status: paymentStatus,
    },
    fulfillment,
  }
})

export type Order = (typeof orders)[number]

export function getOrder(id: string) {
  return orders.find((o) => o.id === id)
}

export const payments = orders.map((o) => ({
  id: o.payment.id,
  orderId: o.id,
  order: o.number,
  customer: o.customer.name,
  email: o.customer.email,
  method: o.payment.method,
  last4: o.payment.last4,
  amount: o.total,
  status: o.payment.status,
  date: o.date,
}))

export type Payment = (typeof payments)[number]

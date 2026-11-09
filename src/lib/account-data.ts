import { products, type Product } from "./data"

// Datos simulados del cliente con sesión iniciada (fase 3: vendrán de la sesión + Prisma).

export const customer = {
  firstName: "Camila",
  lastName: "Martínez",
  email: "camila.martinez@gmail.com",
  phone: "+52 55 4821 0937",
  birthday: "1994-06-12",
  memberSince: "marzo 2024",
}

export type CustomerOrderStatus = "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado"

export type CustomerOrder = {
  id: string
  number: string
  date: string // texto ya formateado (evita fechas dinámicas en el prerender)
  status: CustomerOrderStatus
  items: { product: Product; quantity: number }[]
  shipping: number
  shippingMethod: string
  payment: string
  addressId: string
  tracking?: { carrier: string; code: string; eta?: string }
  deliveredOn?: string
}

const byIndex = (i: number) => products[i % products.length]

export const customerOrders: CustomerOrder[] = [
  {
    id: "ST-104822",
    number: "#ST-104822",
    date: "8 nov 2026",
    status: "enviado",
    items: [
      { product: byIndex(2), quantity: 1 },
      { product: byIndex(9), quantity: 1 },
    ],
    shipping: 0,
    shippingMethod: "Envío estándar",
    payment: "Visa •••• 4821",
    addressId: "casa",
    tracking: { carrier: "DHL", code: "1Z5ZK8Q3", eta: "Llega el martes 11 de noviembre" },
  },
  {
    id: "ST-104790",
    number: "#ST-104790",
    date: "2 nov 2026",
    status: "preparando",
    items: [{ product: byIndex(12), quantity: 2 }],
    shipping: 19,
    shippingMethod: "Envío express",
    payment: "PayPal",
    addressId: "oficina",
  },
  {
    id: "ST-104611",
    number: "#ST-104611",
    date: "14 oct 2026",
    status: "entregado",
    items: [
      { product: byIndex(5), quantity: 1 },
      { product: byIndex(15), quantity: 1 },
      { product: byIndex(17), quantity: 1 },
    ],
    shipping: 0,
    shippingMethod: "Envío estándar",
    payment: "Visa •••• 4821",
    addressId: "casa",
    tracking: { carrier: "Estafeta", code: "EST7731045MX" },
    deliveredOn: "17 oct 2026",
  },
  {
    id: "ST-104402",
    number: "#ST-104402",
    date: "21 sep 2026",
    status: "entregado",
    items: [{ product: byIndex(7), quantity: 1 }],
    shipping: 9,
    shippingMethod: "Envío estándar",
    payment: "Mastercard •••• 1150",
    addressId: "casa",
    tracking: { carrier: "FedEx", code: "7781 2290 4410" },
    deliveredOn: "24 sep 2026",
  },
  {
    id: "ST-104288",
    number: "#ST-104288",
    date: "3 sep 2026",
    status: "cancelado",
    items: [{ product: byIndex(0), quantity: 1 }],
    shipping: 0,
    shippingMethod: "Retiro en tienda",
    payment: "Transferencia",
    addressId: "casa",
  },
]

export function orderSubtotal(o: CustomerOrder) {
  return o.items.reduce((s, it) => s + it.product.price * it.quantity, 0)
}

export function orderUnits(o: CustomerOrder) {
  return o.items.reduce((s, it) => s + it.quantity, 0)
}

export function getCustomerOrder(id: string) {
  return customerOrders.find((o) => o.id === id)
}

export type Address = {
  id: string
  label: string
  name: string
  line1: string
  line2?: string
  city: string
  region: string
  postal: string
  phone: string
  isDefault?: boolean
  kind: "casa" | "oficina" | "otro"
}

export const addresses: Address[] = [
  {
    id: "casa",
    label: "Casa",
    name: "Camila Martínez",
    line1: "Av. Insurgentes Sur 1602",
    line2: "Depto. 4B, Col. Crédito Constructor",
    city: "Ciudad de México",
    region: "CDMX",
    postal: "03940",
    phone: "+52 55 4821 0937",
    isDefault: true,
    kind: "casa",
  },
  {
    id: "oficina",
    label: "Oficina",
    name: "Camila Martínez",
    line1: "Av. Paseo de la Reforma 222",
    line2: "Piso 12, Col. Juárez",
    city: "Ciudad de México",
    region: "CDMX",
    postal: "06600",
    phone: "+52 55 4821 0937",
    kind: "oficina",
  },
]

export function getAddress(id: string) {
  return addresses.find((a) => a.id === id)
}

export const favoriteProducts: Product[] = [3, 6, 10, 13, 16, 19].map(byIndex)

export const orderStatusFlow = ["confirmado", "preparando", "enviado", "entregado"] as const

export const orderStatusLabel: Record<CustomerOrderStatus, string> = {
  confirmado: "Confirmado",
  preparando: "Preparando",
  enviado: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

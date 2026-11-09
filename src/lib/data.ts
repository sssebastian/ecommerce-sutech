// Datos mock para la fase de UI. Tienen la misma forma que tendrán los
// modelos de Prisma, así el cambio a la base de datos es directo.

export type CategorySlug =
  | "pcs"
  | "laptops"
  | "monitores"
  | "teclados"
  | "mouse"
  | "audio"
  | "componentes"
  | "accesorios"

export type Category = {
  slug: CategorySlug
  name: string
  description: string
}

export type Brand = {
  slug: string
  name: string
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: string // Brand.slug
  category: CategorySlug
  price: number
  compareAtPrice?: number
  stock: number
  rating: number
  reviewCount: number
  badge?: "Nuevo" | "Oferta" | "Más vendido"
  shortDescription: string
  description: string
  specs: Record<string, string>
  createdAt: string
}

export const categories: Category[] = [
  { slug: "pcs", name: "PCs de escritorio", description: "Gaming, oficina y workstations" },
  { slug: "laptops", name: "Laptops", description: "Ultraligeras, gaming y profesionales" },
  { slug: "monitores", name: "Monitores", description: "Alta frecuencia, 4K y ultrawide" },
  { slug: "teclados", name: "Teclados", description: "Mecánicos, inalámbricos y compactos" },
  { slug: "mouse", name: "Mouse", description: "Gaming, ergonómicos e inalámbricos" },
  { slug: "audio", name: "Audio", description: "Audífonos, headsets y micrófonos" },
  { slug: "componentes", name: "Componentes", description: "GPU, CPU, RAM y almacenamiento" },
  { slug: "accesorios", name: "Accesorios", description: "Webcams, hubs, mousepads y más" },
]

export const brands: Brand[] = [
  { slug: "asus", name: "ASUS" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "dell", name: "Dell" },
  { slug: "lg", name: "LG" },
  { slug: "samsung", name: "Samsung" },
  { slug: "logitech", name: "Logitech" },
  { slug: "razer", name: "Razer" },
  { slug: "corsair", name: "Corsair" },
  { slug: "hyperx", name: "HyperX" },
  { slug: "nvidia", name: "NVIDIA" },
  { slug: "amd", name: "AMD" },
  { slug: "kingston", name: "Kingston" },
]

export const products: Product[] = [
  {
    id: "p1",
    slug: "pc-gamer-sutech-ryzen-7-rtx-4070-super",
    name: "PC Gamer SuTech Ryzen 7 · RTX 4070 Super",
    brand: "asus",
    category: "pcs",
    price: 1649,
    compareAtPrice: 1849,
    stock: 6,
    rating: 4.8,
    reviewCount: 124,
    badge: "Más vendido",
    shortDescription: "Ryzen 7 7800X3D, 32 GB DDR5, 2 TB NVMe",
    description:
      "Equipo armado y probado para jugar en 1440p a alta tasa de cuadros. Refrigeración líquida de 240 mm, gabinete con flujo de aire optimizado y cableado ordenado.",
    specs: {
      Procesador: "AMD Ryzen 7 7800X3D",
      "Tarjeta de video": "NVIDIA GeForce RTX 4070 Super 12 GB",
      Memoria: "32 GB DDR5 6000 MHz",
      Almacenamiento: "2 TB NVMe PCIe 4.0",
      "Fuente de poder": "750 W 80+ Gold",
      "Sistema operativo": "Windows 11 Home",
    },
    createdAt: "2026-10-20",
  },
  {
    id: "p2",
    slug: "pc-oficina-lenovo-thinkcentre-neo-50s",
    name: "Lenovo ThinkCentre Neo 50s",
    brand: "lenovo",
    category: "pcs",
    price: 619,
    stock: 14,
    rating: 4.4,
    reviewCount: 38,
    shortDescription: "Intel Core i5, 16 GB, 512 GB SSD",
    description: "PC compacta para oficina y estudio, silenciosa y fácil de mantener.",
    specs: {
      Procesador: "Intel Core i5-13400",
      Memoria: "16 GB DDR4",
      Almacenamiento: "512 GB SSD",
      "Sistema operativo": "Windows 11 Pro",
    },
    createdAt: "2026-08-02",
  },
  {
    id: "p3",
    slug: "laptop-asus-rog-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14",
    brand: "asus",
    category: "laptops",
    price: 1899,
    compareAtPrice: 2099,
    stock: 3,
    rating: 4.7,
    reviewCount: 86,
    badge: "Oferta",
    shortDescription: "Ryzen 9, RTX 4070, OLED 3K 120 Hz",
    description: "Laptop gaming de 14\" con pantalla OLED y chasis de aluminio de 1,5 kg.",
    specs: {
      Procesador: "AMD Ryzen 9 8945HS",
      "Tarjeta de video": "RTX 4070 8 GB",
      Pantalla: '14" OLED 3K 120 Hz',
      Memoria: "32 GB LPDDR5X",
      Almacenamiento: "1 TB NVMe",
      Peso: "1,5 kg",
    },
    createdAt: "2026-09-12",
  },
  {
    id: "p4",
    slug: "laptop-lenovo-ideapad-slim-5",
    name: "Lenovo IdeaPad Slim 5",
    brand: "lenovo",
    category: "laptops",
    price: 749,
    stock: 18,
    rating: 4.5,
    reviewCount: 211,
    badge: "Nuevo",
    shortDescription: "Ryzen 7, 16 GB, 1 TB SSD, 16\" WUXGA",
    description: "Laptop delgada para productividad con batería para todo el día.",
    specs: {
      Procesador: "AMD Ryzen 7 8845HS",
      Pantalla: '16" WUXGA IPS',
      Memoria: "16 GB",
      Almacenamiento: "1 TB SSD",
      Batería: "Hasta 12 h",
    },
    createdAt: "2026-11-01",
  },
  {
    id: "p5",
    slug: "laptop-dell-xps-13",
    name: "Dell XPS 13",
    brand: "dell",
    category: "laptops",
    price: 1299,
    stock: 0,
    rating: 4.6,
    reviewCount: 59,
    shortDescription: "Core Ultra 7, 16 GB, 512 GB, pantalla 2.8K",
    description: "Ultraportátil premium con teclado sin bordes y pantalla de alta resolución.",
    specs: {
      Procesador: "Intel Core Ultra 7 155H",
      Pantalla: '13,4" 2.8K OLED',
      Memoria: "16 GB",
      Almacenamiento: "512 GB SSD",
    },
    createdAt: "2026-06-15",
  },
  {
    id: "p6",
    slug: "monitor-lg-ultragear-27-qhd-180hz",
    name: "LG UltraGear 27\" QHD 180 Hz",
    brand: "lg",
    category: "monitores",
    price: 299,
    compareAtPrice: 349,
    stock: 22,
    rating: 4.7,
    reviewCount: 402,
    badge: "Oferta",
    shortDescription: "IPS 1 ms, HDR10, G-Sync compatible",
    description: "Monitor gaming de 27\" con panel Nano IPS y colores precisos.",
    specs: {
      Tamaño: '27"',
      Resolución: "2560 × 1440",
      Panel: "Nano IPS",
      Frecuencia: "180 Hz",
      "Tiempo de respuesta": "1 ms GtG",
      Conectividad: "2× HDMI 2.0, DisplayPort 1.4",
    },
    createdAt: "2026-07-30",
  },
  {
    id: "p7",
    slug: "monitor-samsung-odyssey-g9-49",
    name: "Samsung Odyssey G9 49\" Curvo",
    brand: "samsung",
    category: "monitores",
    price: 1099,
    stock: 4,
    rating: 4.5,
    reviewCount: 77,
    badge: "Nuevo",
    shortDescription: "OLED DQHD 240 Hz, curvatura 1800R",
    description: "Super ultrawide 32:9 equivalente a dos monitores de 27\" QHD.",
    specs: {
      Tamaño: '49"',
      Resolución: "5120 × 1440",
      Panel: "QD-OLED",
      Frecuencia: "240 Hz",
      Curvatura: "1800R",
    },
    createdAt: "2026-10-28",
  },
  {
    id: "p8",
    slug: "monitor-dell-s2725ds-27",
    name: "Dell 27\" S2725DS",
    brand: "dell",
    category: "monitores",
    price: 229,
    stock: 31,
    rating: 4.3,
    reviewCount: 145,
    shortDescription: "QHD IPS 100 Hz, parlantes integrados",
    description: "Monitor para oficina y hogar con diseño delgado y ajuste de altura.",
    specs: { Tamaño: '27"', Resolución: "2560 × 1440", Panel: "IPS", Frecuencia: "100 Hz" },
    createdAt: "2026-05-10",
  },
  {
    id: "p9",
    slug: "teclado-logitech-mx-keys-s",
    name: "Logitech MX Keys S",
    brand: "logitech",
    category: "teclados",
    price: 109,
    stock: 40,
    rating: 4.8,
    reviewCount: 530,
    badge: "Más vendido",
    shortDescription: "Inalámbrico, retroiluminado, multi-dispositivo",
    description: "Teclas esféricas cóncavas, retroiluminación inteligente y conexión a 3 equipos.",
    specs: { Conexión: "Bluetooth / Logi Bolt", Layout: "Español latino", Batería: "Hasta 10 días" },
    createdAt: "2026-03-01",
  },
  {
    id: "p10",
    slug: "teclado-razer-huntsman-v3-pro-tkl",
    name: "Razer Huntsman V3 Pro TKL",
    brand: "razer",
    category: "teclados",
    price: 249,
    compareAtPrice: 269,
    stock: 9,
    rating: 4.6,
    reviewCount: 64,
    badge: "Oferta",
    shortDescription: "Switches ópticos analógicos, Rapid Trigger",
    description: "Teclado TKL con actuación ajustable para juegos competitivos.",
    specs: { Formato: "TKL", Switches: "Ópticos analógicos", Conexión: "USB-C" },
    createdAt: "2026-09-02",
  },
  {
    id: "p11",
    slug: "teclado-corsair-k70-rgb-pro",
    name: "Corsair K70 RGB Pro",
    brand: "corsair",
    category: "teclados",
    price: 159,
    stock: 12,
    rating: 4.5,
    reviewCount: 98,
    shortDescription: "Mecánico Cherry MX Red, RGB por tecla",
    description: "Marco de aluminio, polling de 8000 Hz y reposamuñecas magnético.",
    specs: { Formato: "Full size", Switches: "Cherry MX Red", Conexión: "USB-C" },
    createdAt: "2026-04-21",
  },
  {
    id: "p12",
    slug: "mouse-logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight 2",
    brand: "logitech",
    category: "mouse",
    price: 159,
    stock: 25,
    rating: 4.9,
    reviewCount: 712,
    badge: "Más vendido",
    shortDescription: "60 g, sensor HERO 2, inalámbrico",
    description: "Mouse ultraligero para esports con switches ópticos híbridos.",
    specs: { Peso: "60 g", Sensor: "HERO 2 · 32 000 DPI", Conexión: "Lightspeed", Batería: "95 h" },
    createdAt: "2026-02-14",
  },
  {
    id: "p13",
    slug: "mouse-logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "logitech",
    category: "mouse",
    price: 99,
    stock: 33,
    rating: 4.8,
    reviewCount: 905,
    shortDescription: "Ergonómico, clics silenciosos, 8K DPI",
    description: "Rueda MagSpeed y diseño ergonómico para largas jornadas.",
    specs: { Sensor: "8000 DPI", Conexión: "Bluetooth / Logi Bolt", Batería: "70 días" },
    createdAt: "2026-01-09",
  },
  {
    id: "p14",
    slug: "mouse-razer-deathadder-v3",
    name: "Razer DeathAdder V3",
    brand: "razer",
    category: "mouse",
    price: 69,
    compareAtPrice: 89,
    stock: 2,
    rating: 4.6,
    reviewCount: 233,
    badge: "Oferta",
    shortDescription: "59 g, Focus Pro 30K, cable Speedflex",
    description: "Forma ergonómica icónica, ahora más ligera.",
    specs: { Peso: "59 g", Sensor: "Focus Pro 30K", Conexión: "USB" },
    createdAt: "2026-08-19",
  },
  {
    id: "p15",
    slug: "audifonos-hyperx-cloud-iii-wireless",
    name: "HyperX Cloud III Wireless",
    brand: "hyperx",
    category: "audio",
    price: 149,
    stock: 15,
    rating: 4.5,
    reviewCount: 188,
    badge: "Nuevo",
    shortDescription: "Headset gaming, 120 h de batería",
    description: "Comodidad legendaria con drivers de 53 mm y micrófono desmontable.",
    specs: { Conexión: "2,4 GHz", Batería: "120 h", Drivers: "53 mm" },
    createdAt: "2026-10-05",
  },
  {
    id: "p16",
    slug: "gpu-nvidia-geforce-rtx-4070-super",
    name: "Tarjeta de video GeForce RTX 4070 Super 12 GB",
    brand: "nvidia",
    category: "componentes",
    price: 599,
    stock: 7,
    rating: 4.7,
    reviewCount: 141,
    shortDescription: "12 GB GDDR6X, DLSS 3",
    description: "Rendimiento 1440p con trazado de rayos y generación de cuadros.",
    specs: { Memoria: "12 GB GDDR6X", "Consumo": "220 W", Salidas: "3× DP, 1× HDMI" },
    createdAt: "2026-06-30",
  },
  {
    id: "p17",
    slug: "cpu-amd-ryzen-7-7800x3d",
    name: "Procesador AMD Ryzen 7 7800X3D",
    brand: "amd",
    category: "componentes",
    price: 389,
    compareAtPrice: 449,
    stock: 11,
    rating: 4.9,
    reviewCount: 320,
    badge: "Oferta",
    shortDescription: "8 núcleos, 3D V-Cache, AM5",
    description: "El procesador más rápido para gaming de su generación.",
    specs: { Núcleos: "8 / 16 hilos", Socket: "AM5", TDP: "120 W" },
    createdAt: "2026-03-18",
  },
  {
    id: "p18",
    slug: "ssd-kingston-fury-renegade-2tb",
    name: "SSD Kingston Fury Renegade 2 TB",
    brand: "kingston",
    category: "componentes",
    price: 159,
    stock: 28,
    rating: 4.7,
    reviewCount: 96,
    shortDescription: "NVMe PCIe 4.0, hasta 7300 MB/s",
    description: "Almacenamiento de alto rendimiento con disipador opcional.",
    specs: { Capacidad: "2 TB", Interfaz: "PCIe 4.0 NVMe", Lectura: "7300 MB/s" },
    createdAt: "2026-07-07",
  },
  {
    id: "p19",
    slug: "webcam-logitech-brio-500",
    name: "Logitech Brio 500",
    brand: "logitech",
    category: "accesorios",
    price: 119,
    stock: 20,
    rating: 4.4,
    reviewCount: 72,
    shortDescription: "Webcam Full HD con corrección de luz",
    description: "Ideal para videollamadas, con tapa de privacidad y modo Show.",
    specs: { Resolución: "1080p 30 fps", Campo: "90°" },
    createdAt: "2026-05-25",
  },
  {
    id: "p20",
    slug: "mousepad-corsair-mm700-rgb-xl",
    name: "Corsair MM700 RGB XL",
    brand: "corsair",
    category: "accesorios",
    price: 59,
    stock: 45,
    rating: 4.5,
    reviewCount: 110,
    shortDescription: "Mousepad extendido con hub USB",
    description: "Superficie de tela micro-texturizada con iluminación RGB en el borde.",
    specs: { Tamaño: "930 × 400 mm", Extras: "2× USB" },
    createdAt: "2026-04-02",
  },
]

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getBrandName(slug: string) {
  return brands.find((b) => b.slug === slug)?.name ?? slug
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function productsByCategory(slug: CategorySlug) {
  return products.filter((p) => p.category === slug)
}

export const sampleReviews = [
  { id: "r1", author: "María G.", rating: 5, date: "2026-10-30", title: "Excelente compra", body: "Llegó en dos días, bien embalado y funciona perfecto. Totalmente recomendado." },
  { id: "r2", author: "Luis R.", rating: 4, date: "2026-10-12", title: "Muy bueno", body: "Cumple lo prometido. Le quito una estrella porque el manual es muy básico." },
  { id: "r3", author: "Andrea P.", rating: 5, date: "2026-09-21", title: "Calidad premium", body: "Se nota la calidad de construcción. El soporte respondió rápido una duda." },
]

// Carrito mock compartido por /carrito y /checkout. En la fase 3 vendrá de
// la tabla Cart (cookie de sesión / usuario).
const mockCart = [
  { slug: "pc-gamer-sutech-ryzen-7-rtx-4070-super", quantity: 1 },
  { slug: "monitor-lg-ultragear-27-qhd-180hz", quantity: 2 },
  { slug: "mouse-logitech-g-pro-x-superlight-2", quantity: 1 },
]

export type CartLine = { product: Product; quantity: number }

export function getMockCart(): CartLine[] {
  return mockCart.flatMap(({ slug, quantity }) => {
    const product = getProduct(slug)
    return product ? [{ product, quantity }] : []
  })
}

export const FREE_SHIPPING_FROM = 99

export const shippingMethods = [
  { id: "estandar", name: "Envío estándar", eta: "3 a 5 días hábiles", price: 9 },
  { id: "express", name: "Envío express", eta: "24 a 48 h", price: 19 },
  { id: "retiro", name: "Retiro en tienda", eta: "Listo en 2 h", price: 0 },
] as const

export type ShippingMethodId = (typeof shippingMethods)[number]["id"]

export function shippingCost(method: ShippingMethodId, subtotal: number) {
  const m = shippingMethods.find((s) => s.id === method)!
  if (method === "estandar" && subtotal >= FREE_SHIPPING_FROM) return 0
  return m.price
}

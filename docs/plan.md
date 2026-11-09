# SuTech — Plan del e-commerce de computación

Tienda online de productos de computación: PCs, laptops, monitores, teclados, mouse, audio, componentes y accesorios.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · PostgreSQL · Prisma

---

## Fase 1 — Diseño de UI (actual, sin backend)

Rutas agrupadas: `(tienda)` con header/footer completos, `(checkout)` con header mínimo, `(auth)` a pantalla dividida y `admin/` con barra lateral. Datos mock del admin en `src/lib/admin-data.ts`.

Todo con datos mock en `src/lib/data.ts`, con la misma forma que tendrán los modelos de Prisma para que el cambio a la BD sea directo.

| Estado | Pantalla | Ruta |
|---|---|---|
| ✅ | Layout global: barra superior, header (logo, buscador, carrito, favoritos, cuenta), menú de categorías, footer | `src/app/(tienda)/layout.tsx` |
| ✅ | Home: carrusel compacto de promociones (autoplay), categorías, ofertas, más vendidos, marcas, beneficios | `/` |
| ✅ | Catálogo con filtros (marca, precio, disponibilidad, valoración), orden, vista grid/lista, filtros móviles en panel lateral | `/productos?categoria=monitores` |
| ✅ | Detalle de producto: galería, precio, stock, cantidad, especificaciones, reseñas, relacionados | `/producto/[slug]` |
| ✅ | Carrito con resumen del pedido | `/carrito` |
| ✅ | Checkout: contacto, método de entrega, dirección, pago, resumen + confirmación | `/checkout`, `/checkout/confirmacion` |
| ✅ | Login, registro (medidor de contraseña) y recuperar contraseña | `/ingresar`, `/registro`, `/recuperar` |
| ✅ | Mi cuenta: resumen, pedidos (filtros + detalle con seguimiento), favoritos, direcciones (crear/editar), datos y seguridad | `/cuenta`, `/cuenta/pedidos/[id]`, `/cuenta/favoritos`, `/cuenta/direcciones`, `/cuenta/perfil` |
| ✅ | Admin · Resumen: KPIs, ingresos diarios, ingresos por categoría, pagos recientes, stock bajo | `/admin` |
| ✅ | Admin · Productos: tabla con búsqueda/filtros, selección múltiple, formulario crear/editar | `/admin/productos` |
| ✅ | Admin · Pagos: pestañas por estado, filtro por método, detalle con historial y reembolso | `/admin/pagos` |
| ✅ | Admin · Usuarios: roles (admin/soporte/cliente), estados, acciones, invitar usuario | `/admin/usuarios` |
| ✅ | Admin · Pedidos: pestañas por estado de entrega, acciones masivas, detalle con artículos, envío/seguimiento, historial y notas | `/admin/pedidos`, `/admin/pedidos/[id]` |
| ✅ | Admin · Configuración: general, envíos (métodos, envío gratis, zonas), proveedores de pago, notificaciones | `/admin/configuracion` |
| ✅ | Estados vacíos (carrito, búsqueda, filtros, pedidos, favoritos, direcciones, tablas admin), 404, error y loading skeletons | `not-found.tsx`, `error.tsx`, `loading.tsx` |
| ✅ | Modo oscuro (claro / oscuro / sistema) sin parpadeo | `src/components/theme/` |

## Fase 2 — Base de datos (PostgreSQL + Prisma)

Modelos principales (borrador):

```prisma
model Category { id, slug, name, icon, parentId?, products }
model Brand    { id, slug, name, logoUrl?, products }
model Product  {
  id, slug, name, description, price Decimal, compareAtPrice Decimal?,
  stock Int, sku, badge?, rating Float, reviewCount Int,
  specs Json,            // { "Procesador": "Ryzen 7 7800X3D", ... }
  images ProductImage[], categoryId, brandId, createdAt, updatedAt
}
model ProductImage { id, url, alt, position, productId }
model User     { id, email, name, passwordHash?, role (CUSTOMER|ADMIN), addresses, orders, reviews }
model Address  { id, userId, fullName, phone, line1, city, region, postalCode }
model Cart     { id, userId?, sessionId?, items CartItem[] }
model CartItem { id, cartId, productId, quantity }
model Order    { id, number, userId, fulfillmentStatus (PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED|RETURNED), subtotal, shipping, total, shippingMethod, carrier?, trackingCode?, items OrderItem[], addressSnapshot Json, notes OrderNote[] }
model Payment  { id, orderId, provider, method (CARD|PAYPAL|TRANSFER), status (PENDING|PAID|REFUNDED|FAILED), amount, fee, last4?, providerRef }
model OrderNote{ id, orderId, authorId, body, createdAt }
model StoreSettings { id, name, contactEmail, currency, timezone, freeShippingFrom, ... }   // una sola fila
model ShippingRate  { id, name, eta, price, enabled, zoneId? }
model OrderItem{ id, orderId, productId, name, unitPrice, quantity }
model Review   { id, productId, userId, rating, title, body, createdAt }
model Wishlist { userId, productId }
```

Tareas: instalar Prisma, `schema.prisma`, migraciones, seed con los datos mock actuales.

## Fase 3 — Lógica de negocio

1. Catálogo leído desde la BD (Server Components + Prisma), filtros/orden/paginación vía `searchParams`.
2. Búsqueda (Postgres full-text o `ILIKE` al inicio).
3. Carrito persistente (cookie de sesión + tabla `Cart`), Server Actions para agregar/quitar.
4. Autenticación (Auth.js o Better Auth) con roles; proteger `/admin` para ADMIN/SOPORTE.
5. Checkout + pasarela de pago (Stripe / Mercado Pago según país).
6. Panel admin con CRUD de productos, subida de imágenes y gestión de pedidos.
7. Emails transaccionales (confirmación de pedido).

## Fase 4 — Calidad y lanzamiento

SEO (metadata, sitemap, JSON-LD de producto), imágenes optimizadas, accesibilidad, tests (Vitest + Playwright), despliegue (Vercel + Postgres gestionado: Neon/Supabase).

---

## Decisiones pendientes

- **Moneda y país:** por ahora USD (`src/lib/format.ts`, un solo lugar para cambiarlo).
- **Imágenes de producto:** la UI usa ilustraciones placeholder por categoría; se reemplazan por fotos reales cuando existan en la BD.
- **Pasarela de pago** y **proveedor de auth**.

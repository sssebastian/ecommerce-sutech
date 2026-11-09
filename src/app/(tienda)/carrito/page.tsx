import type { Metadata } from "next"
import { CartView } from "@/components/cart/cart-view"
import { getMockCart } from "@/lib/data"

export const metadata: Metadata = { title: "Carrito" }

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Tu carrito</h1>
      <CartView initialLines={getMockCart()} />
    </div>
  )
}

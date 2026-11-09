import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSteps } from "@/components/checkout/steps"
import { getMockCart } from "@/lib/data"

export const metadata: Metadata = { title: "Finalizar compra" }

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <CheckoutSteps current={1} />
      <h1 className="mt-8 mb-6 text-2xl font-semibold tracking-tight">Finalizar compra</h1>
      <CheckoutForm lines={getMockCart()} />
    </div>
  )
}

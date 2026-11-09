"use client"

import { useState } from "react"
import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex h-10 items-center rounded-lg border">
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-r-none"
        aria-label="Restar"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-l-none"
        aria-label="Sumar"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  )
}

// Solo UI: los botones se conectarán a Server Actions en la fase 3.
export function PurchasePanel({ stock }: { stock: number }) {
  const [qty, setQty] = useState(1)
  const soldOut = stock === 0

  if (soldOut) {
    return (
      <div className="space-y-3">
        <Button variant="secondary" className="h-11 w-full" disabled>
          Agotado
        </Button>
        <Button variant="outline" className="h-11 w-full">
          Avísame cuando llegue
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <QuantityStepper value={qty} max={stock} onChange={setQty} />
        <Button className="h-10 flex-1">
          <ShoppingCart data-icon="inline-start" />
          Agregar al carrito
        </Button>
        <Button variant="outline" size="icon" className="size-10" aria-label="Agregar a favoritos">
          <Heart />
        </Button>
      </div>
      <Button variant="secondary" className="h-10 w-full">
        <Zap data-icon="inline-start" />
        Comprar ahora
      </Button>
    </div>
  )
}

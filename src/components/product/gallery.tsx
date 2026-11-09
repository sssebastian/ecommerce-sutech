"use client"

import { useState } from "react"
import type { CategorySlug } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ProductImage } from "./product-image"

// Con imágenes reales cada vista será una URL distinta; por ahora
// se simulan 4 vistas con el placeholder.
export function Gallery({ category, name }: { category: CategorySlug; name: string }) {
  const views = ["Frontal", "Lateral", "Posterior", "Detalle"]
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col" role="tablist" aria-label="Imágenes del producto">
        {views.map((v, i) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Vista ${v}`}
            onClick={() => setActive(i)}
            className={cn(
              "w-16 overflow-hidden rounded-lg border-2 transition sm:w-20",
              active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <ProductImage category={category} label="" iconClassName={cn(i % 2 && "-scale-x-100")} />
          </button>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl border">
        <ProductImage
          category={category}
          label={`${name} — vista ${views[active].toLowerCase()}`}
          iconClassName={cn("size-2/5 transition-transform", active % 2 && "-scale-x-100")}
        />
        <span className="absolute right-3 bottom-3 rounded-full bg-background/80 px-2.5 py-1 text-xs backdrop-blur">
          {active + 1} / {views.length}
        </span>
      </div>
    </div>
  )
}

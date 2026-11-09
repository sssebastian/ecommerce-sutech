"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Undo2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/states/empty-state"
import { ProductCard } from "@/components/product/product-card"
import type { Product } from "@/lib/data"

export function FavoritesGrid({ initial }: { initial: Product[] }) {
  const [items, setItems] = useState(initial)
  const [removed, setRemoved] = useState<Product | null>(null)

  const remove = (p: Product) => {
    setItems((xs) => xs.filter((x) => x.id !== p.id))
    setRemoved(p)
  }
  const undo = () => {
    if (!removed) return
    setItems((xs) => initial.filter((x) => x.id === removed.id || xs.some((y) => y.id === x.id)))
    setRemoved(null)
  }

  return (
    <div className="space-y-4">
      {removed && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
          <span className="truncate">
            Quitaste <span className="font-medium">{removed.name}</span> de favoritos
          </span>
          <Button variant="ghost" size="sm" onClick={undo}>
            <Undo2 data-icon="inline-start" /> Deshacer
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aún no tienes favoritos"
          description="Toca el corazón en cualquier producto para guardarlo aquí y comparar precios más tarde."
        >
          <Link href="/productos" className={buttonVariants()}>Explorar productos</Link>
          <Link href="/productos?ofertas=1" className={buttonVariants({ variant: "outline" })}>Ver ofertas</Link>
        </EmptyState>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "producto guardado" : "productos guardados"}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} favorite onToggleFavorite={() => remove(p)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

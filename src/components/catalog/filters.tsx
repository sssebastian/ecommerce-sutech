"use client"

import { useMemo, useState } from "react"
import { Search, Star } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { brands, type Product } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export type FilterState = {
  brands: string[]
  price: [number, number]
  inStock: boolean
  onSale: boolean
  minRating: number
}

export function priceBounds(items: Product[]): [number, number] {
  if (items.length === 0) return [0, 0]
  const prices = items.map((p) => p.price)
  return [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10]
}

export function activeFilterCount(f: FilterState, bounds: [number, number]) {
  return (
    f.brands.length +
    (f.price[0] !== bounds[0] || f.price[1] !== bounds[1] ? 1 : 0) +
    (f.inStock ? 1 : 0) +
    (f.onSale ? 1 : 0) +
    (f.minRating ? 1 : 0)
  )
}

export function Filters({
  items,
  value,
  onChange,
  onReset,
  className,
}: {
  items: Product[] // productos del contexto (categoría/búsqueda) antes de filtrar
  value: FilterState
  onChange: (next: FilterState) => void
  onReset: () => void
  className?: string
}) {
  const [brandQuery, setBrandQuery] = useState("")
  const bounds = priceBounds(items)

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of items) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
    return counts
  }, [items])

  const visibleBrands = brands.filter(
    (b) => brandCounts.has(b.slug) && b.name.toLowerCase().includes(brandQuery.toLowerCase())
  )

  const histogram = useMemo(() => {
    const buckets = 16
    const [min, max] = bounds
    const step = (max - min) / buckets || 1
    const counts = Array.from({ length: buckets }, () => 0)
    for (const p of items) counts[Math.min(buckets - 1, Math.floor((p.price - min) / step))]++
    const peak = Math.max(...counts, 1)
    return counts.map((c, i) => ({
      height: c / peak,
      inRange: min + step * (i + 1) > value.price[0] && min + step * i < value.price[1],
    }))
  }, [items, bounds, value.price])

  const toggleBrand = (slug: string, checked: boolean) =>
    onChange({
      ...value,
      brands: checked ? [...value.brands, slug] : value.brands.filter((b) => b !== slug),
    })

  return (
    <div className={cn("rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Filtros</h2>
        <Button variant="link" size="sm" className="h-auto px-0" onClick={onReset}>
          Limpiar
        </Button>
      </div>

      <Accordion multiple defaultValue={["marca", "precio", "disponibilidad", "valoracion"]} className="px-4">
        <AccordionItem value="marca">
          <AccordionTrigger>Marca</AccordionTrigger>
          <AccordionContent>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder="Buscar marca…"
                className="h-8 pl-8 text-sm"
                aria-label="Buscar marca"
              />
            </div>
            <ul className="space-y-2.5">
              {visibleBrands.map((b) => (
                <li key={b.slug}>
                  <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
                    <Checkbox
                      checked={value.brands.includes(b.slug)}
                      onCheckedChange={(c) => toggleBrand(b.slug, c)}
                    />
                    <span className="flex-1">{b.name}</span>
                    <span className="text-xs text-muted-foreground">{brandCounts.get(b.slug)}</span>
                  </Label>
                </li>
              ))}
              {visibleBrands.length === 0 && (
                <li className="text-sm text-muted-foreground">Sin coincidencias</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="precio">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="flex h-12 items-end gap-0.5 px-1.5" aria-hidden>
              {histogram.map((b, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-t-sm", b.inRange ? "bg-primary/35" : "bg-muted")}
                  style={{ height: `${Math.max(b.height * 100, 6)}%` }}
                />
              ))}
            </div>
            <Slider
              min={bounds[0]}
              max={bounds[1]}
              step={10}
              value={value.price}
              onValueChange={(v) => Array.isArray(v) && onChange({ ...value, price: [v[0], v[1]] })}
              aria-label="Rango de precio"
              className="mb-4"
            />
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 rounded-md border px-2.5 py-1.5">
                <span className="block text-[10px] text-muted-foreground uppercase">Mín</span>
                {formatPrice(value.price[0])}
              </div>
              <span className="text-muted-foreground">–</span>
              <div className="flex-1 rounded-md border px-2.5 py-1.5">
                <span className="block text-[10px] text-muted-foreground uppercase">Máx</span>
                {formatPrice(value.price[1])}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="disponibilidad">
          <AccordionTrigger>Disponibilidad</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
              <Checkbox checked={value.inStock} onCheckedChange={(c) => onChange({ ...value, inStock: c })} />
              Solo con stock
            </Label>
            <Label className="flex cursor-pointer items-center gap-2.5 font-normal">
              <Checkbox checked={value.onSale} onCheckedChange={(c) => onChange({ ...value, onSale: c })} />
              En oferta
            </Label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="valoracion">
          <AccordionTrigger>Valoración</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={String(value.minRating)}
              onValueChange={(v) => onChange({ ...value, minRating: Number(v) })}
              className="gap-2.5"
            >
              {[4.5, 4, 0].map((r) => (
                <Label key={r} className="flex cursor-pointer items-center gap-2.5 font-normal">
                  <RadioGroupItem value={String(r)} />
                  {r === 0 ? (
                    "Todas"
                  ) : (
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" /> {r} o más
                    </span>
                  )}
                </Label>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

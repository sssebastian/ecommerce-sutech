"use client"

import { useState } from "react"
import { ImagePlus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import type { AdminProduct } from "@/lib/admin-data"
import { brands, categories } from "@/lib/data"

const categoryItems = categories.map((c) => ({ value: c.slug, label: c.name }))
const brandItems = brands.map((b) => ({ value: b.slug, label: b.name }))

// Solo diseño: "Guardar" cerrará el panel. En la fase 3 será un Server Action.
export function ProductFormSheet({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: AdminProduct
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>{product ? "Editar producto" : "Nuevo producto"}</SheetTitle>
          <SheetDescription>
            {product ? product.sku : "Completa los datos y publícalo cuando esté listo."}
          </SheetDescription>
        </SheetHeader>
        {/* key reinicia el formulario al cambiar de producto */}
        <ProductForm key={product?.id ?? "new"} product={product} onDone={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}

function ProductForm({ product, onDone }: { product?: AdminProduct; onDone: () => void }) {
  const [specs, setSpecs] = useState<[string, string][]>(
    product ? Object.entries(product.specs) : [["", ""]]
  )

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        onDone()
      }}
    >
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <section className="space-y-4">
          <Field id="name" label="Nombre" required defaultValue={product?.name} />
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={product?.description} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField id="category" label="Categoría" items={categoryItems} defaultValue={product?.category} />
            <SelectField id="brand" label="Marca" items={brandItems} defaultValue={product?.brand} />
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Imágenes</h3>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-muted/40">
            <ImagePlus className="size-6" />
            <span>
              <span className="font-medium text-primary">Sube imágenes</span> o arrástralas aquí
            </span>
            <span className="text-xs">PNG, JPG o WebP · hasta 5 MB</span>
            <input type="file" accept="image/*" multiple className="sr-only" />
          </label>
        </section>

        <Separator />

        <section className="space-y-4">
          <h3 className="text-sm font-semibold">Precio e inventario</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="price" label="Precio" type="number" min={0} step="0.01" required defaultValue={product?.price} />
            <Field id="compareAtPrice" label="Precio anterior" type="number" min={0} step="0.01" hint="Muestra el descuento tachado." defaultValue={product?.compareAtPrice} />
            <Field id="sku" label="SKU" defaultValue={product?.sku} />
            <Field id="stock" label="Stock" type="number" min={0} required defaultValue={product?.stock} />
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Especificaciones</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSpecs([...specs, ["", ""]])}>
              <Plus data-icon="inline-start" /> Agregar
            </Button>
          </div>
          <ul className="space-y-2">
            {specs.map(([k, v], i) => (
              <li key={i} className="flex gap-2">
                <input
                  defaultValue={k}
                  placeholder="Atributo (p. ej. Procesador)"
                  aria-label="Atributo"
                  className="h-9 w-2/5 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <input
                  defaultValue={v}
                  placeholder="Valor"
                  aria-label="Valor"
                  className="h-9 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground"
                  aria-label="Quitar especificación"
                  onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <Separator />

        <section className="space-y-3">
          <Label className="flex items-center justify-between font-normal">
            <span>
              <span className="block font-medium">Publicado</span>
              <span className="text-xs text-muted-foreground">Visible en la tienda</span>
            </span>
            <Switch name="published" defaultChecked={product ? product.status === "activo" : false} />
          </Label>
          <Label className="flex items-center justify-between font-normal">
            <span>
              <span className="block font-medium">Destacado</span>
              <span className="text-xs text-muted-foreground">Aparece en la portada</span>
            </span>
            <Switch name="featured" defaultChecked={product?.badge === "Más vendido"} />
          </Label>
        </section>
      </div>

      <SheetFooter className="flex-row justify-end border-t">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Guardar cambios" : "Crear producto"}</Button>
      </SheetFooter>
    </form>
  )
}

function SelectField({
  id,
  label,
  items,
  defaultValue,
}: {
  id: string
  label: string
  items: { value: string; label: string }[]
  defaultValue?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select items={items} name={id} defaultValue={defaultValue ?? null}>
        <SelectTrigger id={id} className="h-10 w-full">
          <SelectValue placeholder="Selecciona…" />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

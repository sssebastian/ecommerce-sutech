"use client"

import { useMemo, useState } from "react"
import { Archive, Copy, Eye, MoreHorizontal, Pencil, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductImage } from "@/components/product/product-image"
import type { AdminProduct } from "@/lib/admin-data"
import { categories, getBrandName, getCategory } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { EmptyRow, TableFooter, TableSearch } from "./data-table"
import { ProductFormSheet } from "./product-form-sheet"
import { ProductStatusBadge } from "./status-badge"

const categoryItems = [{ value: "todas", label: "Todas las categorías" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]
const statusItems = [
  { value: "todos", label: "Todos los estados" },
  { value: "activo", label: "Activos" },
  { value: "borrador", label: "Borradores" },
  { value: "archivado", label: "Archivados" },
  { value: "stock-bajo", label: "Stock bajo" },
]

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("todas")
  const [status, setStatus] = useState("todos")
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<AdminProduct | undefined>()
  const [sheetOpen, setSheetOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (category === "todas" || p.category === category) &&
        (status === "todos" || (status === "stock-bajo" ? p.stock <= 5 : p.status === status))
    )
  }, [products, query, category, status])

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const openForm = (p?: AdminProduct) => {
    setEditing(p)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <TableSearch value={query} onChange={setQuery} placeholder="Buscar por nombre o SKU" className="w-full sm:w-72" />
          <FilterSelect items={categoryItems} value={category} onChange={setCategory} />
          <FilterSelect items={statusItems} value={status} onChange={setStatus} />
          {selected.length === 0 ? (
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="h-9">
                <Upload data-icon="inline-start" /> Importar CSV
              </Button>
              <Button className="h-9" onClick={() => openForm()}>
                <Plus data-icon="inline-start" /> Nuevo producto
              </Button>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{selected.length} seleccionados</span>
              <Button variant="outline" size="sm">
                <Archive data-icon="inline-start" /> Archivar
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 data-icon="inline-start" /> Eliminar
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={!allSelected && rows.some((r) => selected.includes(r.id))}
                    onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Vendidos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} data-state={selected.includes(p.id) ? "selected" : undefined}>
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onCheckedChange={(c) => setSelected(c ? [...selected, p.id] : selected.filter((id) => id !== p.id))}
                      aria-label={`Seleccionar ${p.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <button type="button" onClick={() => openForm(p)} className="flex items-center gap-3 text-left">
                      <ProductImage category={p.category} label="" className="w-10 shrink-0 rounded-md" />
                      <span className="min-w-0">
                        <span className="block max-w-64 truncate font-medium hover:text-primary">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {p.sku} · {getBrandName(p.brand)}
                        </span>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{getCategory(p.category)?.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPrice(p.price)}
                    {p.compareAtPrice && (
                      <span className="block text-xs text-muted-foreground line-through">{formatPrice(p.compareAtPrice)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className={cn(p.stock === 0 ? "font-medium text-rose-600 dark:text-rose-400" : p.stock <= 5 && "font-medium text-amber-700 dark:text-amber-400")}>
                      {p.stock === 0 ? "Agotado" : p.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{p.sold}</TableCell>
                  <TableCell>
                    <ProductStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Acciones para ${p.name}`} />}>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openForm(p)}>
                          <Pencil /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye /> Ver en tienda
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive /> Archivar
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <EmptyRow colSpan={8}>No hay productos que coincidan con los filtros.</EmptyRow>}
            </TableBody>
          </Table>
        </div>
        <TableFooter shown={rows.length} total={products.length} label="productos" />
      </div>

      <ProductFormSheet open={sheetOpen} onOpenChange={setSheetOpen} product={editing} />
    </>
  )
}

export function FilterSelect({
  items,
  value,
  onChange,
}: {
  items: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select items={items} value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-9 w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem key={i.value} value={i.value}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

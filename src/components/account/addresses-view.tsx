"use client"

import { useState } from "react"
import { Briefcase, Home, MapPin, MapPinned, MoreHorizontal, Pencil, Plus, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field } from "@/components/forms/field"
import { EmptyState } from "@/components/states/empty-state"
import type { Address } from "@/lib/account-data"
import { cn } from "@/lib/utils"

const kindIcon = { casa: Home, oficina: Briefcase, otro: MapPin } as const
const kinds = [
  { value: "casa", label: "Casa" },
  { value: "oficina", label: "Oficina" },
  { value: "otro", label: "Otro" },
] as const
const regions = ["CDMX", "Estado de México", "Jalisco", "Nuevo León", "Puebla", "Querétaro", "Yucatán"].map((r) => ({ value: r, label: r }))

export function AddressesView({ initial }: { initial: Address[] }) {
  const [items, setItems] = useState(initial)
  const [editing, setEditing] = useState<Address | "new" | null>(null)

  const setDefault = (id: string) => setItems((xs) => xs.map((a) => ({ ...a, isDefault: a.id === id })))
  const remove = (id: string) =>
    setItems((xs) => {
      const rest = xs.filter((a) => a.id !== id)
      // Si se borra la principal, la siguiente pasa a ser la principal.
      if (rest.length && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true }
      return rest
    })

  const addButton = (
    <Button onClick={() => setEditing("new")}>
      <Plus data-icon="inline-start" /> Agregar dirección
    </Button>
  )

  return (
    <>
      {items.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No tienes direcciones guardadas"
          description="Guarda tu casa u oficina para pagar más rápido en tu próxima compra."
        >
          {addButton}
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a) => {
            const Icon = kindIcon[a.kind]
            return (
              <article
                key={a.id}
                className={cn("relative flex flex-col rounded-2xl border bg-card p-5 text-sm", a.isDefault && "border-primary/50 ring-1 ring-primary/20")}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4.5" />
                    </span>
                    <div>
                      <h2 className="font-medium">{a.label}</h2>
                      {a.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <Star className="size-3 fill-current" /> Principal
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Acciones para ${a.label}`} />}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => setEditing(a)}><Pencil /> Editar</DropdownMenuItem>
                      {!a.isDefault && (
                        <DropdownMenuItem onClick={() => setDefault(a.id)}><Star /> Usar como principal</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => remove(a.id)}><Trash2 /> Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <address className="space-y-0.5 text-muted-foreground not-italic">
                  <p className="text-foreground">{a.name}</p>
                  <p>{a.line1}</p>
                  {a.line2 && <p>{a.line2}</p>}
                  <p>{a.postal} {a.city}, {a.region}</p>
                  <p>{a.phone}</p>
                </address>
              </article>
            )
          })}
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-accent/40 hover:text-foreground"
          >
            <span className="grid size-10 place-items-center rounded-full bg-muted">
              <Plus className="size-5" />
            </span>
            Agregar dirección
          </button>
        </div>
      )}

      <AddressDialog
        key={editing === null ? "closed" : editing === "new" ? "new" : editing.id}
        address={editing}
        onClose={() => setEditing(null)}
      />
    </>
  )
}

function AddressDialog({ address, onClose }: { address: Address | "new" | null; onClose: () => void }) {
  const a = address && address !== "new" ? address : undefined
  const [kind, setKind] = useState<Address["kind"]>(a?.kind ?? "casa")
  const [region, setRegion] = useState(a?.region ?? "CDMX")

  return (
    <Dialog open={address !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{a ? "Editar dirección" : "Nueva dirección"}</DialogTitle>
          <DialogDescription>La usaremos para calcular el envío y entregar tus pedidos.</DialogDescription>
        </DialogHeader>
        <form
          id="address-form"
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          <fieldset className="space-y-1.5 sm:col-span-2">
            <legend className="mb-1.5 text-sm font-medium">Tipo</legend>
            <div className="flex gap-2">
              {kinds.map((k) => {
                const Icon = kindIcon[k.value]
                return (
                  <button
                    key={k.value}
                    type="button"
                    aria-pressed={kind === k.value}
                    onClick={() => setKind(k.value)}
                    className={cn(
                      "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition",
                      kind === k.value ? "border-primary bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="size-4" /> {k.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <Field id="addr-name" label="Nombre de quien recibe" defaultValue={a?.name} required className="sm:col-span-2" />
          <Field id="addr-line1" label="Calle y número" defaultValue={a?.line1} required className="sm:col-span-2" />
          <Field id="addr-line2" label="Depto, colonia, referencias" hint="Opcional" defaultValue={a?.line2} className="sm:col-span-2" />
          <Field id="addr-postal" label="Código postal" defaultValue={a?.postal} inputMode="numeric" required />
          <Field id="addr-city" label="Ciudad" defaultValue={a?.city} required />
          <div className="space-y-1.5">
            <Label htmlFor="addr-region">Estado</Label>
            <Select items={regions} value={region} onValueChange={(v) => v && setRegion(v)} name="region">
              <SelectTrigger id="addr-region" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Field id="addr-phone" label="Teléfono" type="tel" defaultValue={a?.phone} required />
          <Label className="flex items-center gap-2 font-normal sm:col-span-2">
            <Checkbox name="isDefault" defaultChecked={a?.isDefault} /> Usar como dirección principal
          </Label>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="address-form">{a ? "Guardar cambios" : "Guardar dirección"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Ban, Bell, Copy, MoreHorizontal, PackageCheck, Printer, RotateCcw, Send, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import type { FulfillmentStatus } from "@/lib/admin-data"

// Solo diseño: las acciones se conectarán a Server Actions en la fase 3.

export function OrderHeaderActions({ status }: { status: FulfillmentStatus }) {
  const canRefund = status === "preparando" || status === "enviado" || status === "entregado"
  return (
    <>
      <Button variant="outline" className="h-9">
        <Printer data-icon="inline-start" /> Imprimir
      </Button>
      {status === "enviado" && (
        <Button className="h-9">
          <PackageCheck data-icon="inline-start" /> Marcar como entregado
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="size-9" aria-label="Más acciones" />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem><Send /> Reenviar confirmación</DropdownMenuItem>
          <DropdownMenuItem><Copy /> Duplicar pedido</DropdownMenuItem>
          {canRefund && <DropdownMenuItem><RotateCcw /> Reembolsar</DropdownMenuItem>}
          {status !== "cancelado" && status !== "devuelto" && status !== "entregado" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Ban /> Cancelar pedido</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const carriers = [
  { value: "dhl", label: "DHL" },
  { value: "estafeta", label: "Estafeta" },
  { value: "fedex", label: "FedEx" },
]

export function ShipForm() {
  const [carrier, setCarrier] = useState("dhl")
  return (
    <form className="grid gap-3 rounded-lg border border-dashed p-4 sm:grid-cols-[160px_1fr_auto] sm:items-end" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <Label htmlFor="carrier">Paquetería</Label>
        <Select items={carriers} value={carrier} onValueChange={(v) => v && setCarrier(v)} name="carrier">
          <SelectTrigger id="carrier" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {carriers.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Field id="trackingCode" label="Número de seguimiento" placeholder="1Z999AA10123456784" required />
      <Button type="submit" className="h-10">
        <Truck data-icon="inline-start" /> Marcar como enviado
      </Button>
    </form>
  )
}

export function NoteForm() {
  const [note, setNote] = useState("")
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        setNote("")
      }}
    >
      <Label htmlFor="note" className="sr-only">Agregar nota interna</Label>
      <Textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Agrega una nota interna (solo la ve el equipo)…"
        rows={2}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="secondary" disabled={!note.trim()}>
          Guardar nota
        </Button>
      </div>
    </form>
  )
}

export function PickupReady() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-4">
      <p className="text-sm text-muted-foreground">Cuando el pedido esté empacado, avisa al cliente para que lo retire.</p>
      <Button>
        <Bell data-icon="inline-start" /> Listo para retirar
      </Button>
    </div>
  )
}

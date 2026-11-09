"use client"

import { useState } from "react"
import { Check, Monitor, ShieldCheck, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Field } from "@/components/forms/field"
import { PasswordField } from "@/components/auth/auth-ui"
import { customer } from "@/lib/account-data"
import { cn } from "@/lib/utils"

// Solo diseño: cada formulario se conectará a una Server Action en la fase 3.

function Section({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card", className)}>
      <div className="border-b px-5 py-4">
        <h2 className="font-medium">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function SaveRow({ saved, label = "Guardar cambios" }: { saved: boolean; label?: string }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t px-5 py-3">
      {saved && (
        <span role="status" className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
          <Check className="size-4" /> Guardado
        </span>
      )}
      <Button type="submit">{label}</Button>
    </div>
  )
}

function useSaved() {
  const [saved, setSaved] = useState(false)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
  }
  return { saved, onSubmit, reset: () => setSaved(false) }
}

export function PersonalForm() {
  const { saved, onSubmit, reset } = useSaved()
  return (
    <Section title="Datos personales" description="Así aparecerás en tus pedidos y facturas">
      <form onSubmit={onSubmit} onChange={reset}>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field id="firstName" label="Nombre" defaultValue={customer.firstName} autoComplete="given-name" required />
          <Field id="lastName" label="Apellido" defaultValue={customer.lastName} autoComplete="family-name" required />
          <Field id="email" label="Correo electrónico" type="email" defaultValue={customer.email} autoComplete="email" hint="Te enviaremos un enlace para confirmar el cambio." required />
          <Field id="phone" label="Teléfono" type="tel" defaultValue={customer.phone} autoComplete="tel" />
          <Field id="birthday" label="Fecha de nacimiento" type="date" defaultValue={customer.birthday} hint="Opcional · te enviamos un cupón en tu cumpleaños" />
          <Field id="rfc" label="RFC para facturar" placeholder="XAXX010101000" hint="Opcional" />
        </div>
        <SaveRow saved={saved} />
      </form>
    </Section>
  )
}

export function PasswordForm() {
  const { saved, onSubmit, reset } = useSaved()
  return (
    <Section title="Contraseña" description="Usa al menos 8 caracteres, con números y símbolos">
      <form onSubmit={onSubmit} onChange={reset}>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <PasswordField id="currentPassword" label="Contraseña actual" autoComplete="current-password" required className="sm:col-span-2" />
          <PasswordField id="newPassword" label="Nueva contraseña" autoComplete="new-password" required />
          <PasswordField id="confirmPassword" label="Confirmar contraseña" autoComplete="new-password" required />
        </div>
        <SaveRow saved={saved} label="Actualizar contraseña" />
      </form>
    </Section>
  )
}

const sessions = [
  { icon: Monitor, device: "Chrome en Windows", place: "Ciudad de México", when: "Activa ahora", current: true },
  { icon: Smartphone, device: "Safari en iPhone", place: "Ciudad de México", when: "Hace 2 días" },
]

export function SessionsCard() {
  return (
    <Section title="Sesiones activas" description="Dispositivos donde iniciaste sesión">
      <ul className="divide-y">
        {sessions.map(({ icon: Icon, device, place, when, current }) => (
          <li key={device} className="flex items-center gap-3 px-5 py-3.5 text-sm">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
              <Icon className="size-4.5 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{device}</p>
              <p className="text-xs text-muted-foreground">
                {place} · {when}
              </p>
            </div>
            {current ? (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" /> Este dispositivo
              </span>
            ) : (
              <Button variant="outline" size="sm">Cerrar</Button>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}

const prefs = [
  { name: "orderUpdates", title: "Estado de mis pedidos", description: "Confirmación, envío y entrega por correo.", on: true },
  { name: "whatsapp", title: "Avisos por WhatsApp", description: "Te escribimos cuando tu pedido sale a reparto.", on: true },
  { name: "offers", title: "Ofertas y novedades", description: "Un correo semanal con los mejores descuentos.", on: false },
  { name: "priceDrops", title: "Bajas de precio en favoritos", description: "Te avisamos si algo que guardaste baja de precio.", on: true },
]

export function PreferencesCard() {
  return (
    <Section title="Notificaciones">
      <div className="divide-y">
        {prefs.map((p) => (
          <Label key={p.name} className="flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5 font-normal">
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{p.title}</span>
              <span className="text-xs text-muted-foreground">{p.description}</span>
            </span>
            <Switch name={p.name} defaultChecked={p.on} />
          </Label>
        ))}
      </div>
    </Section>
  )
}

export function DangerZone() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4">
      <div>
        <h2 className="font-medium">Eliminar cuenta</h2>
        <p className="text-sm text-muted-foreground">Se borrarán tus datos, direcciones y favoritos. Tus facturas se conservan por ley.</p>
      </div>
      <Button variant="destructive" onClick={() => setOpen(true)}>Eliminar cuenta</Button>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setConfirm("") }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar tu cuenta?</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer. Escribe <strong>ELIMINAR</strong> para confirmar.</DialogDescription>
          </DialogHeader>
          <Field id="confirmDelete" label="Confirmación" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="destructive" disabled={confirm !== "ELIMINAR"} onClick={() => setOpen(false)}>
              Eliminar definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

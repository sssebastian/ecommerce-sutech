"use client"

import { useMemo, useState } from "react"
import { Ban, KeyRound, Mail, MoreHorizontal, RotateCcw, ShieldCheck, Trash2, UserPlus, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Field } from "@/components/forms/field"
import type { AdminUser, UserRole } from "@/lib/admin-data"
import { formatLongDate as formatDate } from "@/lib/admin-format"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { EmptyRow, TableFooter, TableSearch } from "./data-table"
import { FilterSelect } from "./products-table"
import { UserStatusBadge } from "./status-badge"


const roles: Record<UserRole, { label: string; description: string; className: string }> = {
  admin: { label: "Admin", description: "Acceso total al panel", className: "bg-primary/10 text-primary" },
  soporte: { label: "Soporte", description: "Ve pedidos y clientes, gestiona reembolsos", className: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  cliente: { label: "Cliente", description: "Solo compra en la tienda", className: "bg-muted text-muted-foreground" },
}

const roleItems = [
  { value: "todos", label: "Todos los roles" },
  { value: "admin", label: "Administradores" },
  { value: "soporte", label: "Soporte" },
  { value: "cliente", label: "Clientes" },
]

const statusItems = [
  { value: "todos", label: "Todos los estados" },
  { value: "activo", label: "Activos" },
  { value: "pendiente", label: "Sin verificar" },
  { value: "suspendido", label: "Suspendidos" },
]

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("")
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("")
  const [role, setRole] = useState("todos")
  const [status, setStatus] = useState("todos")
  const [inviteOpen, setInviteOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return users.filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.email.includes(q)) &&
        (role === "todos" || u.role === role) &&
        (status === "todos" || u.status === status)
    )
  }, [users, query, role, status])

  return (
    <>
      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <TableSearch value={query} onChange={setQuery} placeholder="Buscar por nombre o correo" className="w-full sm:w-72" />
          <FilterSelect items={roleItems} value={role} onChange={setRole} />
          <FilterSelect items={statusItems} value={status} onChange={setStatus} />
          <Button className="ml-auto h-9" onClick={() => setInviteOpen(true)}>
            <UserPlus data-icon="inline-start" /> Invitar usuario
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Pedidos</TableHead>
                <TableHead className="text-right">Total gastado</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead className="w-12"><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span>
                        <span className="block font-medium">{u.name}</span>
                        <span className="block text-xs text-muted-foreground">{u.email}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", roles[u.role].className)}>
                      {u.role === "admin" && <ShieldCheck className="size-3" />}
                      {roles[u.role].label}
                    </span>
                  </TableCell>
                  <TableCell><UserStatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-right tabular-nums">{u.orders || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{u.spent ? formatPrice(u.spent) : "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(u.joined)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Acciones para ${u.name}`} />}>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem><UserRound /> Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem><Mail /> Enviar correo</DropdownMenuItem>
                        <DropdownMenuItem><KeyRound /> Restablecer contraseña</DropdownMenuItem>
                        <DropdownMenuItem><ShieldCheck /> Cambiar rol</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {u.status === "suspendido" ? (
                          <DropdownMenuItem><RotateCcw /> Reactivar cuenta</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem><Ban /> Suspender cuenta</DropdownMenuItem>
                        )}
                        <DropdownMenuItem variant="destructive"><Trash2 /> Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <EmptyRow colSpan={7}>No hay usuarios que coincidan con los filtros.</EmptyRow>}
            </TableBody>
          </Table>
        </div>
        <TableFooter shown={rows.length} total={users.length} label="usuarios" />
      </div>

      <InviteSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  )
}

function InviteSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Invitar usuario</SheetTitle>
          <SheetDescription>Recibirá un correo para crear su contraseña.</SheetDescription>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            onOpenChange(false)
          }}
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <Field id="inviteName" label="Nombre completo" required />
            <Field id="inviteEmail" type="email" label="Correo electrónico" required />
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium">Rol</legend>
              <RadioGroup name="role" defaultValue="soporte" className="gap-2">
                {(Object.keys(roles) as UserRole[]).map((r) => (
                  <Label key={r} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal leading-normal has-data-checked:border-primary has-data-checked:bg-accent/40">
                    <RadioGroupItem value={r} className="mt-0.5" />
                    <span>
                      <span className="block font-medium">{roles[r].label}</span>
                      <span className="text-xs text-muted-foreground">{roles[r].description}</span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>
          </div>
          <SheetFooter className="flex-row justify-end border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Mail data-icon="inline-start" /> Enviar invitación
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

import type { Metadata } from "next"
import { PageHeader, StatTile } from "@/components/admin/page-header"
import { UsersTable } from "@/components/admin/users-table"
import { users } from "@/lib/admin-data"

export const metadata: Metadata = { title: "Usuarios" }

export default function AdminUsersPage() {
  const customers = users.filter((u) => u.role === "cliente").length
  const staff = users.length - customers
  const unverified = users.filter((u) => u.status === "pendiente").length
  const suspended = users.filter((u) => u.status === "suspendido").length

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Usuarios" description="Clientes y equipo con acceso al panel" />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile label="Clientes" value={String(customers)} delta={18.6} />
        <StatTile label="Equipo" value={String(staff)} note="Administradores y soporte" />
        <StatTile label="Sin verificar" value={String(unverified)} note="No confirmaron su correo" />
        <StatTile label="Suspendidos" value={String(suspended)} note="Sin acceso a la tienda" />
      </div>
      <UsersTable users={users} />
    </div>
  )
}

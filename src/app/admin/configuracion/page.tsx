import type { Metadata } from "next"
import { PageHeader } from "@/components/admin/page-header"
import { SettingsForm } from "@/components/admin/settings-form"

export const metadata: Metadata = { title: "Configuración" }

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Configuración" description="Datos de la tienda, envíos, pagos y notificaciones" />
      <SettingsForm />
    </div>
  )
}

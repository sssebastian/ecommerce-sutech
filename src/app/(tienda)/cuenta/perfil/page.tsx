import type { Metadata } from "next"
import { AccountHeader } from "@/components/account/order-ui"
import { DangerZone, PasswordForm, PersonalForm, PreferencesCard, SessionsCard } from "@/components/account/profile-forms"

export const metadata: Metadata = { title: "Datos y seguridad" }

export default function ProfilePage() {
  return (
    <>
      <AccountHeader title="Datos y seguridad" description="Tu información personal, contraseña y notificaciones" />
      <PersonalForm />
      <PasswordForm />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <PreferencesCard />
        <SessionsCard />
      </div>
      <DangerZone />
    </>
  )
}

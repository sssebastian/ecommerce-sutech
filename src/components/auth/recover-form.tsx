"use client"

import { useState } from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/forms/field"
import { AuthHeader } from "./auth-ui"

export function RecoverForm() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
          <MailCheck className="size-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Revisa tu correo</h1>
        <p className="text-sm text-muted-foreground">
          Si existe una cuenta con <span className="font-medium text-foreground">{sentTo}</span>, recibirás un enlace
          para crear una nueva contraseña.
        </p>
        <Button variant="outline" className="h-10 w-full" onClick={() => setSentTo(null)}>
          Usar otro correo
        </Button>
        <Link href="/ingresar" className="block text-sm font-medium text-primary hover:underline">
          Volver a ingresar
        </Link>
      </div>
    )
  }

  return (
    <>
      <AuthHeader
        title="Recupera tu contraseña"
        subtitle="Ingresa tu correo y te enviaremos un enlace para restablecerla."
      />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setSentTo(String(new FormData(e.currentTarget).get("email")))
        }}
      >
        <Field id="email" type="email" label="Correo electrónico" autoComplete="email" required placeholder="tu@correo.com" />
        <Button type="submit" size="lg" className="h-10 w-full">
          Enviar enlace
        </Button>
      </form>
      <Link href="/ingresar" className="mt-6 block text-center text-sm font-medium text-primary hover:underline">
        Volver a ingresar
      </Link>
    </>
  )
}

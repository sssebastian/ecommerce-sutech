"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/forms/field"
import { AuthHeader, PasswordField, SocialAuth } from "./auth-ui"

// Solo UI: en la fase 3 se conecta al proveedor de auth (Auth.js / Better Auth).
export function LoginForm() {
  return (
    <>
      <AuthHeader
        title="Ingresa a tu cuenta"
        subtitle={
          <>
            ¿Eres nuevo?{" "}
            <Link href="/registro" className="font-medium text-primary hover:underline">
              Crea una cuenta
            </Link>
          </>
        }
      />
      <SocialAuth />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field id="email" type="email" label="Correo electrónico" autoComplete="email" required placeholder="tu@correo.com" />
        <PasswordField
          id="password"
          label="Contraseña"
          autoComplete="current-password"
          required
          labelAside={
            <Link href="/recuperar" className="text-xs font-medium text-primary hover:underline">
              ¿La olvidaste?
            </Link>
          }
        />
        <Label className="cursor-pointer font-normal">
          <Checkbox name="remember" defaultChecked /> Mantener sesión iniciada
        </Label>
        <Button type="submit" size="lg" className="h-10 w-full">
          Ingresar
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground hover:underline">
          ← Volver a la tienda
        </Link>
      </p>
    </>
  )
}

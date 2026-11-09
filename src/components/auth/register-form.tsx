"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Field } from "@/components/forms/field"
import { cn } from "@/lib/utils"
import { AuthHeader, PasswordField, SocialAuth } from "./auth-ui"

const rules = [
  { label: "8 caracteres o más", test: (p: string) => p.length >= 8 },
  { label: "Una mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número", test: (p: string) => /\d/.test(p) },
]

const levels = [
  { label: "Débil", color: "bg-rose-500" },
  { label: "Media", color: "bg-amber-500" },
  { label: "Fuerte", color: "bg-emerald-500" },
]

// Solo UI: la validación real se hará en el servidor en la fase 3.
export function RegisterForm() {
  const [password, setPassword] = useState("")
  const passed = rules.filter((r) => r.test(password)).length
  const level = levels[Math.max(0, passed - 1)]

  return (
    <>
      <AuthHeader
        title="Crea tu cuenta"
        subtitle={
          <>
            ¿Ya tienes una?{" "}
            <Link href="/ingresar" className="font-medium text-primary hover:underline">
              Ingresa
            </Link>
          </>
        }
      />
      <SocialAuth />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" label="Nombre" autoComplete="given-name" required />
          <Field id="lastName" label="Apellido" autoComplete="family-name" required />
        </div>
        <Field id="email" type="email" label="Correo electrónico" autoComplete="email" required placeholder="tu@correo.com" />
        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Contraseña"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <div className="space-y-2" aria-live="polite">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {levels.map((l, i) => (
                    <span key={l.label} className={cn("h-1 flex-1 rounded-full", i < passed ? level.color : "bg-muted")} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{passed > 0 ? level.label : "Muy débil"}</span>
              </div>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {rules.map((r) => {
                  const ok = r.test(password)
                  return (
                    <li key={r.label} className={cn("flex items-center gap-1", ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                      <Check className={cn("size-3", !ok && "opacity-30")} /> {r.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        <Label className="cursor-pointer items-start font-normal leading-snug">
          <Checkbox name="terms" required className="mt-0.5" />
          <span>
            Acepto los <Link href="#" className="text-primary hover:underline">Términos y condiciones</Link> y la{" "}
            <Link href="#" className="text-primary hover:underline">Política de privacidad</Link>
          </span>
        </Label>
        <Label className="cursor-pointer font-normal">
          <Checkbox name="newsletter" /> Quiero recibir ofertas por correo
        </Label>
        <Button type="submit" size="lg" className="h-10 w-full">
          Crear cuenta
        </Button>
      </form>
    </>
  )
}

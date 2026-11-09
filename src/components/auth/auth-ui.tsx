"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/forms/field"

export function AuthHeader({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export function SocialAuth() {
  return (
    <>
      <Button type="button" variant="outline" className="h-10 w-full">
        <GoogleIcon />
        Continuar con Google
      </Button>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />o con tu correo<span className="h-px flex-1 bg-border" />
      </div>
    </>
  )
}

export function PasswordField(
  props: Omit<React.ComponentProps<typeof Field>, "type">
) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Field {...props} type={visible ? "text" : "password"} className="[&_input]:pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-[1.85rem] right-1.5 text-muted-foreground"
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}

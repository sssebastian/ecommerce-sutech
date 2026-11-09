"use client"

import { useEffect, useSyncExternalStore } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { THEME_KEY, type Theme } from "./theme"

const listeners = new Set<() => void>()
const media = () => window.matchMedia("(prefers-color-scheme: dark)")

function readTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY)
    return t === "light" || t === "dark" ? t : "system"
  } catch {
    return "system"
  }
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && media().matches)
  const root = document.documentElement
  // Evita que todas las transiciones de color se animen al cambiar de tema.
  root.classList.add("[&_*]:transition-none!")
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
  requestAnimationFrame(() => root.classList.remove("[&_*]:transition-none!"))
}

function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, theme)
  } catch {}
  applyTheme(theme)
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  // Sincroniza entre pestañas.
  const onStorage = (e: StorageEvent) => e.key === THEME_KEY && (applyTheme(readTheme()), cb())
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", onStorage)
  }
}

function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme)

  // Si el usuario eligió "Sistema", sigue los cambios del sistema operativo en vivo.
  useEffect(() => {
    if (theme !== "system") return
    const mq = media()
    const onChange = () => applyTheme("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  return [theme, setTheme] as const
}

const options = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, set] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-lg" className={cn("relative", className)} aria-label="Cambiar tema" />}
      >
        {/* Los íconos cambian solo con CSS (clase .dark), así no hay desajuste de hidratación. */}
        <Sun className="size-5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tema</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(v) => set(v as Theme)}>
            {options.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon /> {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

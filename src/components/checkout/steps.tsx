import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = ["Carrito", "Envío y pago", "Confirmación"]

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="mx-auto flex max-w-md items-center gap-2 text-xs sm:text-sm" aria-label="Progreso de la compra">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-medium",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "text-muted-foreground"
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("whitespace-nowrap", active ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {i < steps.length - 1 && (
              <span className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

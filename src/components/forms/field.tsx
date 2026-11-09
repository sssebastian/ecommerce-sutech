import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Etiqueta + input + ayuda. Cuando haya validación con zod/Server Actions,
// `error` mostrará el mensaje del servidor.
export function Field({
  id,
  label,
  hint,
  error,
  className,
  labelAside,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  hint?: string
  error?: string
  labelAside?: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {labelAside}
      </div>
      <Input
        id={id}
        name={props.name ?? id}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? `${id}-desc` : undefined}
        className="h-10"
        {...props}
      />
      {(error || hint) && (
        <p id={`${id}-desc`} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

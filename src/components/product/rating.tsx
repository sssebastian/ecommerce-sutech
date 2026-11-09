import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function Rating({
  value,
  count,
  className,
  size = "sm",
}: {
  value: number
  count?: number
  className?: string
  size?: "sm" | "md"
}) {
  const star = size === "sm" ? "size-3.5" : "size-4.5"
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" aria-label={`${value} de 5 estrellas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              star,
              i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  )
}

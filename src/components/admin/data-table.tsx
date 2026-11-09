"use client"

import { ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Piezas compartidas por las tablas del admin.

export function TableSearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 pl-9"
      />
    </div>
  )
}

export function TableFooter({ shown, total, label }: { shown: number; total: number; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
      <span>
        Mostrando {shown} de {total} {label}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" aria-label="Página anterior" disabled>
          <ChevronLeft />
        </Button>
        <span className="px-2 tabular-nums">1 / 1</span>
        <Button variant="outline" size="icon" aria-label="Página siguiente" disabled>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-14 text-center text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-muted">
            <SearchX className="size-5" />
          </span>
          <div>
            <p className="font-medium text-foreground">Sin resultados</p>
            <p>{children}</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

import {
  Archive,
  Ban,
  Box,
  PackageCheck,
  Truck,
  Undo2,
  CheckCircle2,
  CircleDashed,
  Clock,
  PencilLine,
  RotateCcw,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { FulfillmentStatus, PaymentStatus, ProductStatus, UserStatus } from "@/lib/admin-data"
import { cn } from "@/lib/utils"

// Los estados siempre llevan icono + texto, nunca solo color.
type Tone = "good" | "warning" | "critical" | "neutral" | "info"

const tones: Record<Tone, string> = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-950 dark:text-amber-300",
  critical: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950 dark:text-rose-300",
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950 dark:text-sky-300",
}

function Pill({ tone, icon: Icon, children }: { tone: Tone; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", tones[tone])}>
      <Icon className="size-3" />
      {children}
    </span>
  )
}

const payment: Record<PaymentStatus, [Tone, LucideIcon, string]> = {
  pagado: ["good", CheckCircle2, "Pagado"],
  pendiente: ["warning", Clock, "Pendiente"],
  reembolsado: ["neutral", RotateCcw, "Reembolsado"],
  fallido: ["critical", XCircle, "Fallido"],
}

const product: Record<ProductStatus, [Tone, LucideIcon, string]> = {
  activo: ["good", CheckCircle2, "Activo"],
  borrador: ["neutral", PencilLine, "Borrador"],
  archivado: ["neutral", Archive, "Archivado"],
}

const user: Record<UserStatus, [Tone, LucideIcon, string]> = {
  activo: ["good", CheckCircle2, "Activo"],
  pendiente: ["warning", CircleDashed, "Sin verificar"],
  suspendido: ["critical", Ban, "Suspendido"],
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const [tone, icon, label] = payment[status]
  return <Pill tone={tone} icon={icon}>{label}</Pill>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const [tone, icon, label] = product[status]
  return <Pill tone={tone} icon={icon}>{label}</Pill>
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const [tone, icon, label] = user[status]
  return <Pill tone={tone} icon={icon}>{label}</Pill>
}

const fulfillment: Record<FulfillmentStatus, [Tone, LucideIcon, string]> = {
  pendiente: ["warning", Clock, "Sin pagar"],
  preparando: ["info", Box, "Por preparar"],
  enviado: ["info", Truck, "En camino"],
  entregado: ["good", PackageCheck, "Entregado"],
  cancelado: ["critical", XCircle, "Cancelado"],
  devuelto: ["neutral", Undo2, "Devuelto"],
}

export const fulfillmentLabels = Object.fromEntries(
  Object.entries(fulfillment).map(([k, v]) => [k, v[2]])
) as Record<FulfillmentStatus, string>

export function FulfillmentStatusBadge({ status }: { status: FulfillmentStatus }) {
  const [tone, icon, label] = fulfillment[status]
  return <Pill tone={tone} icon={icon}>{label}</Pill>
}

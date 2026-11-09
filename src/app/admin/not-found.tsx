import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/states/empty-state"

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <EmptyState
        icon={FileQuestion}
        title="No encontramos este registro"
        description="Puede que el pedido, producto o usuario se haya eliminado, o que el enlace esté mal escrito."
      >
        <Link href="/admin/pedidos" className={buttonVariants({ variant: "outline" })}>Pedidos</Link>
        <Link href="/admin/productos" className={buttonVariants({ variant: "outline" })}>Productos</Link>
        <Link href="/admin" className={buttonVariants()}>Ir al resumen</Link>
      </EmptyState>
    </div>
  )
}

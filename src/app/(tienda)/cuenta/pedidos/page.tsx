import type { Metadata } from "next"
import { AccountHeader } from "@/components/account/order-ui"
import { OrdersList } from "@/components/account/orders-list"
import { customerOrders } from "@/lib/account-data"

export const metadata: Metadata = { title: "Mis pedidos" }

export default function AccountOrdersPage() {
  return (
    <>
      <AccountHeader title="Mis pedidos" description="Sigue tus envíos, descarga facturas y gestiona devoluciones" />
      <OrdersList orders={customerOrders} />
    </>
  )
}

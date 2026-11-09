import type { Metadata } from "next"
import { AccountHeader } from "@/components/account/order-ui"
import { AddressesView } from "@/components/account/addresses-view"
import { addresses } from "@/lib/account-data"

export const metadata: Metadata = { title: "Direcciones" }

export default function AddressesPage() {
  return (
    <>
      <AccountHeader title="Direcciones" description="Administra dónde recibes tus pedidos" />
      <AddressesView initial={addresses} />
    </>
  )
}

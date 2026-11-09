import type { Metadata } from "next"
import { AccountHeader } from "@/components/account/order-ui"
import { FavoritesGrid } from "@/components/account/favorites-grid"
import { favoriteProducts } from "@/lib/account-data"

export const metadata: Metadata = { title: "Favoritos" }

export default function FavoritesPage() {
  return (
    <>
      <AccountHeader title="Favoritos" description="Productos que guardaste para más tarde" />
      <FavoritesGrid initial={favoriteProducts} />
    </>
  )
}

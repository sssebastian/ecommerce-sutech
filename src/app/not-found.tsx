import type { Metadata } from "next"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { NotFoundScreen } from "@/components/states/status-screens"

export const metadata: Metadata = { title: "Página no encontrada" }

// 404 para URLs que no existen: el layout raíz no trae header, así que se agrega aquí.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <NotFoundScreen />
      </main>
      <SiteFooter />
    </>
  )
}

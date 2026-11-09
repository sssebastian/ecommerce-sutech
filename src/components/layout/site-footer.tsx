import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { categories } from "@/lib/data"
import { Logo } from "./site-header"

const help = [
  { href: "#", label: "Seguimiento de pedido" },
  { href: "#", label: "Envíos y entregas" },
  { href: "#", label: "Cambios y devoluciones" },
  { href: "#", label: "Garantías" },
  { href: "#", label: "Preguntas frecuentes" },
]

const company = [
  { href: "#", label: "Sobre nosotros" },
  { href: "#", label: "Tiendas" },
  { href: "#", label: "Ventas corporativas" },
  { href: "#", label: "Términos y condiciones" },
  { href: "#", label: "Privacidad" },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Tecnología para trabajar, crear y jugar. Productos originales con garantía oficial.
          </p>
        </div>
        <FooterColumn
          title="Categorías"
          links={categories.map((c) => ({ href: `/productos?categoria=${c.slug}`, label: c.name }))}
        />
        <FooterColumn title="Ayuda" links={help} />
        <FooterColumn title="SuTech" links={company} />
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <span>© 2026 SuTech. Todos los derechos reservados.</span>
        <span>Visa · Mastercard · PayPal · Transferencia</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

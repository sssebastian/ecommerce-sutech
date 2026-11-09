import { Headset, ShieldCheck, Star, Truck } from "lucide-react"
import { Logo } from "@/components/layout/site-header"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Panel de marca */}
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,oklch(0.55_0.2_255/0.5),transparent_60%),radial-gradient(ellipse_at_0%_100%,oklch(0.6_0.15_200/0.3),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.04]" />
        <Logo className="relative [&>span:last-child]:text-white" />
        <div className="relative my-auto max-w-md space-y-8">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            Todo para tu setup, en un solo lugar.
          </h2>
          <ul className="space-y-4 text-slate-300">
            {[
              { icon: Truck, text: "Seguimiento de tus pedidos en tiempo real" },
              { icon: ShieldCheck, text: "Garantía oficial y devoluciones en 30 días" },
              { icon: Headset, text: "Soporte técnico para elegir tu equipo" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5">
                  <Icon className="size-4.5 text-sky-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="mt-3 text-sm text-slate-200">
            “Armé mi PC completa con ellos. Me asesoraron en cada componente y llegó en dos días.”
          </blockquote>
          <figcaption className="mt-3 text-xs text-slate-400">Cliente SuTech · Compra verificada</figcaption>
        </figure>
      </aside>

      {/* Formulario */}
      <main className="relative flex flex-col px-4 py-8 sm:px-8">
        <ThemeToggle className="absolute top-4 right-4" />
        <Logo className="mb-8 lg:hidden" />
        <div className="m-auto w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Pause, Play } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { CategoryIcon } from "@/components/product/category-icon"
import type { CategorySlug } from "@/lib/data"
import { cn } from "@/lib/utils"

type Slide = {
  eyebrow: string
  title: string
  highlight: string
  text: string
  cta: { label: string; href: string }
  icons: CategorySlug[]
  bg: string
  accent: string
}

const slides: Slide[] = [
  {
    eyebrow: "Nueva generación · RTX Serie 40 Super",
    title: "Arma tu setup",
    highlight: "sin límites",
    text: "PCs gamer armadas y probadas, listas para jugar en 1440p.",
    cta: { label: "Ver PCs gamer", href: "/productos?categoria=pcs" },
    icons: ["pcs", "componentes"],
    bg: "from-slate-950 via-slate-900 to-blue-950",
    accent: "text-sky-400",
  },
  {
    eyebrow: "Hasta 15% de descuento",
    title: "Monitores de",
    highlight: "hasta 240 Hz",
    text: "QHD, OLED y ultrawide para jugar y trabajar con más fluidez.",
    cta: { label: "Ver monitores", href: "/productos?categoria=monitores" },
    icons: ["monitores", "laptops"],
    bg: "from-cyan-950 via-sky-950 to-slate-950",
    accent: "text-cyan-300",
  },
  {
    eyebrow: "Semana de periféricos",
    title: "Teclados y mouse",
    highlight: "para pros",
    text: "Logitech, Razer y Corsair con hasta 12 cuotas sin interés.",
    cta: { label: "Ver ofertas", href: "/productos?ofertas=1" },
    icons: ["teclados", "mouse"],
    bg: "from-indigo-950 via-violet-950 to-slate-950",
    accent: "text-violet-300",
  },
]

const AUTOPLAY_MS = 3000

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Avanza cada 3 s. Depende de `current` para reiniciar el conteo
  // cuando el usuario cambia de diapositiva a mano (flechas, puntos o arrastre).
  useEffect(() => {
    if (!api || !playing) return
    const id = window.setTimeout(() => api.scrollNext(), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [api, playing, current])

  return (
    <section aria-roledescription="carrusel" aria-label="Promociones destacadas">
      <Carousel setApi={setApi} opts={{ loop: true, duration: 32 }} className="group/hero">
        <CarouselContent aria-live={playing ? "off" : "polite"}>
          {slides.map((s, i) => {
            const active = i === current
            return (
              <CarouselItem key={s.title} aria-roledescription="diapositiva" aria-label={`${i + 1} de ${slides.length}`}>
                <div className={cn("relative h-56 overflow-hidden rounded-2xl bg-linear-to-br text-white sm:h-64 lg:h-72", s.bg)}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.04]" />
                  <div className="relative flex h-full items-center justify-between gap-6 px-6 sm:px-12 lg:px-16">
                    {/* El texto entra con un leve desplazamiento cada vez que su diapositiva se activa */}
                    <div
                      className={cn(
                        "max-w-lg space-y-3",
                        active ? "animate-in duration-700 fade-in slide-in-from-bottom-3 fill-mode-both" : "opacity-0 transition-opacity duration-300"
                      )}
                    >
                      <p className="text-xs font-medium text-white/70 sm:text-sm">{s.eyebrow}</p>
                      <h2 className="text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                        {s.title} <span className={s.accent}>{s.highlight}</span>
                      </h2>
                      <p className="hidden text-sm text-white/70 sm:block">{s.text}</p>
                      <Link
                        href={s.cta.href}
                        tabIndex={active ? undefined : -1}
                        className={cn(buttonVariants({ variant: "secondary" }), "mt-1 h-9 px-4")}
                      >
                        {s.cta.label} <ArrowRight data-icon="inline-end" />
                      </Link>
                    </div>
                    <div className="relative hidden shrink-0 gap-3 md:flex" aria-hidden>
                      {s.icons.map((slug, j) => (
                        <div
                          key={slug}
                          style={{ animationDelay: `${150 + j * 120}ms` }}
                          className={cn(
                            "grid size-28 place-items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur lg:size-36",
                            j === 1 && "translate-y-6",
                            active ? "animate-in duration-700 fade-in zoom-in-90 fill-mode-both" : "opacity-0 transition-opacity duration-300"
                          )}
                        >
                          <CategoryIcon slug={slug} className={cn("size-12 lg:size-16", s.accent)} strokeWidth={1.1} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious
          aria-label="Promoción anterior"
          className="left-3 hidden border-white/20 bg-black/30 text-white opacity-0 backdrop-blur transition group-hover/hero:opacity-100 hover:bg-black/50 hover:text-white focus-visible:opacity-100 sm:inline-flex"
        />
        <CarouselNext
          aria-label="Promoción siguiente"
          className="right-3 hidden border-white/20 bg-black/30 text-white opacity-0 backdrop-blur transition group-hover/hero:opacity-100 hover:bg-black/50 hover:text-white focus-visible:opacity-100 sm:inline-flex"
        />

        {/* Indicadores: el activo se llena durante los 3 s que dura la diapositiva */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Ir a la promoción ${i + 1}`}
              aria-current={i === current}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "relative h-1.5 overflow-hidden rounded-full transition-all duration-300",
                i === current ? "w-8 bg-white/35" : "w-1.5 bg-white/40 hover:bg-white/70"
              )}
            >
              {i === current && (
                <span
                  key={`${current}-${playing}`}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  style={playing ? { animation: `hero-progress ${AUTOPLAY_MS}ms linear both` } : undefined}
                />
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar carrusel" : "Reproducir carrusel"}
            className="ml-1 grid size-5 place-items-center rounded-full text-white/80 hover:text-white"
          >
            {playing ? <Pause className="size-3 fill-current" /> : <Play className="size-3 fill-current" />}
          </button>
        </div>
      </Carousel>
    </section>
  )
}

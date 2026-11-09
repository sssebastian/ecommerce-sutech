import { cn } from "@/lib/utils"
import type { CategorySlug } from "@/lib/data"
import { CategoryIcon } from "./category-icon"

// Placeholder hasta tener fotos reales en la BD (ProductImage.url).
const tints: Record<CategorySlug, string> = {
  pcs: "from-sky-100 to-indigo-100 text-indigo-500 dark:from-sky-950 dark:to-indigo-950 dark:text-indigo-300",
  laptops: "from-slate-100 to-blue-100 text-blue-500 dark:from-slate-900 dark:to-blue-950 dark:text-blue-300",
  monitores: "from-cyan-50 to-sky-100 text-sky-600 dark:from-cyan-950 dark:to-sky-950 dark:text-sky-300",
  teclados: "from-violet-50 to-indigo-100 text-violet-500 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-300",
  mouse: "from-emerald-50 to-teal-100 text-teal-600 dark:from-emerald-950 dark:to-teal-950 dark:text-teal-300",
  audio: "from-rose-50 to-orange-100 text-rose-500 dark:from-rose-950 dark:to-orange-950 dark:text-rose-300",
  componentes: "from-amber-50 to-lime-100 text-amber-600 dark:from-amber-950 dark:to-lime-950 dark:text-amber-300",
  accesorios: "from-zinc-100 to-stone-200 text-stone-600 dark:from-zinc-900 dark:to-stone-900 dark:text-stone-300",
}

export function ProductImage({
  category,
  className,
  iconClassName,
  label,
}: {
  category: CategorySlug
  className?: string
  iconClassName?: string
  label: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden bg-linear-to-br",
        tints[category],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_0,transparent_55%)] opacity-60 dark:opacity-10" />
      <CategoryIcon slug={category} strokeWidth={1.25} className={cn("relative size-1/3", iconClassName)} />
    </div>
  )
}

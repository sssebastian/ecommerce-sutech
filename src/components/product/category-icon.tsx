import {
  Cpu,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  PcCase,
  Webcam,
  type LucideProps,
} from "lucide-react"
import type { CategorySlug } from "@/lib/data"

const icons: Record<CategorySlug, React.ComponentType<LucideProps>> = {
  pcs: PcCase,
  laptops: Laptop,
  monitores: Monitor,
  teclados: Keyboard,
  mouse: Mouse,
  audio: Headphones,
  componentes: Cpu,
  accesorios: Webcam,
}

export function CategoryIcon({ slug, ...props }: { slug: CategorySlug } & LucideProps) {
  const Icon = icons[slug]
  return <Icon {...props} />
}

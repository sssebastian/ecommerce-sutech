"use client"

import Link from "next/link"
import { Menu, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CategoryIcon } from "@/components/product/category-icon"
import { categories } from "@/lib/data"

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Abrir menú" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Categorías</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {categories.map((c) => (
            <SheetClose
              key={c.slug}
              render={<Link href={`/productos?categoria=${c.slug}`} />}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
            >
              <CategoryIcon slug={c.slug} className="size-4.5 text-primary" />
              {c.name}
            </SheetClose>
          ))}
          <SheetClose
            render={<Link href="/productos?ofertas=1" />}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-muted"
          >
            <Percent className="size-4.5" /> Ofertas
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

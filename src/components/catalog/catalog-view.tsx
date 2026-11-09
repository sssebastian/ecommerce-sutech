"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FilterX,
  LayoutGrid,
  List,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryIcon } from "@/components/product/category-icon";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/states/empty-state";
import { categories, getBrandName, type Product } from "@/lib/data";
import {
  activeFilterCount,
  Filters,
  priceBounds,
  type FilterState,
} from "./filters";

const suggestions = categories.filter((c) =>
  ["laptops", "monitores", "teclados", "mouse"].includes(c.slug),
);

const sortOptions = [
  { value: "relevancia", label: "Relevancia" },
  { value: "populares", label: "Más populares" },
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

function sortProducts(items: Product[], sort: string) {
  const list = [...items];
  switch (sort) {
    case "populares":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
    case "nuevos":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      return list;
  }
}

// Filtrado en cliente sobre datos mock. En la fase 3 esto se mueve al
// servidor (Prisma + searchParams).
export function CatalogView({
  items,
  initialSort = "relevancia",
  initialOnSale = false,
  query = "",
}: {
  items: Product[];
  initialSort?: string;
  initialOnSale?: boolean;
  query?: string;
}) {
  const bounds = priceBounds(items);
  const emptyFilters: FilterState = {
    brands: [],
    price: bounds,
    inStock: false,
    onSale: false,
    minRating: 0,
  };
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    onSale: initialOnSale,
  });
  const [sort, setSort] = useState(initialSort);
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(() => {
    const filtered = items.filter(
      (p) =>
        (filters.brands.length === 0 || filters.brands.includes(p.brand)) &&
        p.price >= filters.price[0] &&
        p.price <= filters.price[1] &&
        (!filters.inStock || p.stock > 0) &&
        (!filters.onSale || !!p.compareAtPrice) &&
        p.rating >= filters.minRating,
    );
    return sortProducts(filtered, sort);
  }, [items, filters, sort]);

  const activeCount = activeFilterCount(filters, bounds);
  const reset = () => setFilters(emptyFilters);
  const filterPanel = (
    <Filters
      items={items}
      value={filters}
      onChange={setFilters}
      onReset={reset}
    />
  );

  // Búsqueda sin resultados: sin filtros ni orden, solo sugerencias.
  if (items.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={
          query
            ? `No encontramos resultados para “${query}”`
            : "Aún no hay productos aquí"
        }
        description="Revisa la ortografía o prueba con términos más generales, como “monitor” o “teclado mecánico”."
      >
        {suggestions.map((c) => (
          <Link
            key={c.slug}
            href={`/productos?categoria=${c.slug}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <CategoryIcon slug={c.slug} data-icon="inline-start" /> {c.name}
          </Link>
        ))}
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">{filterPanel}</aside>

      <div className="min-w-0 space-y-4">
        {/* Barra de herramientas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" className="h-9 lg:hidden" />}
              >
                <SlidersHorizontal data-icon="inline-start" />
                Filtros
                {activeCount > 0 && (
                  <Badge className="ml-1 h-5 px-1.5">{activeCount}</Badge>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="sr-only">
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="p-3 pt-12">{filterPanel}</div>
              </SheetContent>
            </Sheet>
            <ToggleGroup
              variant="outline"
              value={[view]}
              onValueChange={(v) => v[0] && setView(v[0] as "grid" | "list")}
              aria-label="Vista"
            >
              <ToggleGroupItem
                value="grid"
                aria-label="Vista en cuadrícula"
                className="size-9"
              >
                <LayoutGrid />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="list"
                aria-label="Vista en lista"
                className="size-9"
              >
                <List />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              Ordenar por
            </span>
            <Select
              items={sortOptions}
              value={sort}
              onValueChange={(v) => v && setSort(v)}
            >
              <SelectTrigger className="h-9 w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chips de filtros activos */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.brands.map((b) => (
              <Chip
                key={b}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    brands: filters.brands.filter((x) => x !== b),
                  })
                }
              >
                {getBrandName(b)}
              </Chip>
            ))}
            {(filters.price[0] !== bounds[0] ||
              filters.price[1] !== bounds[1]) && (
              <Chip onRemove={() => setFilters({ ...filters, price: bounds })}>
                ${filters.price[0]} – ${filters.price[1]}
              </Chip>
            )}
            {filters.inStock && (
              <Chip onRemove={() => setFilters({ ...filters, inStock: false })}>
                Con stock
              </Chip>
            )}
            {filters.onSale && (
              <Chip onRemove={() => setFilters({ ...filters, onSale: false })}>
                En oferta
              </Chip>
            )}
            {filters.minRating > 0 && (
              <Chip onRemove={() => setFilters({ ...filters, minRating: 0 })}>
                {filters.minRating}★ o más
              </Chip>
            )}
            <Button variant="link" size="sm" onClick={reset}>
              Limpiar todo
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "producto" : "productos"}
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={FilterX}
            title="Ningún producto coincide con los filtros"
            description="Prueba quitar algún filtro o ampliar el rango de precio."
          >
            <Button variant="outline" onClick={reset}>
              Limpiar filtros
            </Button>
          </EmptyState>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} layout="list" />
            ))}
          </div>
        )}

        {/* Paginación visual (se conecta en la fase 3) */}
        {results.length > 0 && (
          <Pagination className="pt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" text="Anterior" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" text="Siguiente" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 py-1 pr-1 pl-3 text-xs">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar filtro"
        className="grid size-5 place-items-center rounded-full hover:bg-muted"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

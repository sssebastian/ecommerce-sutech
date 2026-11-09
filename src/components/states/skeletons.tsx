import { Skeleton } from "@/components/ui/skeleton"

// Esqueletos de carga: imitan la forma de cada página para que no "salte" el contenido.

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-end justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6" aria-busy="true" aria-label="Cargando producto">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-48" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 flex-1" />
          </div>
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function AccountSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border bg-card">
          <Skeleton className="h-14 rounded-none" />
          <div className="flex items-center gap-4 p-5">
            <Skeleton className="size-14 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" aria-busy="true" aria-label="Cargando">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-3 rounded-xl border bg-card p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex gap-3 border-b p-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="ml-auto h-9 w-32" />
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackLink, ErrorScreen } from "@/components/states/status-screens"

export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined

  return (
    <ErrorScreen
      title="No pudimos cargar esta sección"
      description="Puede ser un problema de conexión con la base de datos. Los datos no se modificaron."
      digest={digest}
    >
      <Button onClick={() => retry()}>
        <RotateCw data-icon="inline-start" /> Reintentar
      </Button>
      <BackLink href="/admin">Ir al resumen</BackLink>
    </ErrorScreen>
  )
}

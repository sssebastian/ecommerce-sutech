"use client"

import { useEffect } from "react"
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackLink, ErrorScreen } from "@/components/states/status-screens"

export default function StoreError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Fase 4: enviar a un servicio de monitoreo (Sentry, etc.).
    console.error(error)
  }, [error])

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined

  return (
    <ErrorScreen digest={digest}>
      <Button onClick={() => retry()}>
        <RotateCw data-icon="inline-start" /> Reintentar
      </Button>
      <BackLink href="/">Volver al inicio</BackLink>
    </ErrorScreen>
  )
}

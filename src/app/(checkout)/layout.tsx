import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { Logo } from "@/components/layout/site-header";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Header mínimo: en el checkout se quitan distracciones (buscador, menú).
export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/carrito"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Volver al carrito</span>
          </Link>
          <Logo />
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Compra segura</span>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/30 pb-16">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 SuTech ·{" "}
        <Link href="#" className="hover:underline">
          Términos
        </Link>{" "}
        ·{" "}
        <Link href="#" className="hover:underline">
          Privacidad
        </Link>{" "}
        ·{" "}
        <Link href="#" className="hover:underline">
          Ayuda
        </Link>
      </footer>
    </>
  );
}

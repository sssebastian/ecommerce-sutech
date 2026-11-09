"use client"

import Link from "next/link"
import { LogIn, Package, UserPlus, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 px-1.5 sm:px-2" />}>
        <Avatar className="size-7">
          <AvatarFallback className="bg-accent text-xs text-accent-foreground">IN</AvatarFallback>
        </Avatar>
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[11px] text-muted-foreground">Hola, ingresa</span>
          <span className="block text-sm font-medium">Mi cuenta</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem render={<Link href="/ingresar" />}>
          <LogIn /> Ingresar
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/registro" />}>
          <UserPlus /> Crear cuenta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/cuenta" />}>
          <UserRound /> Mi cuenta
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/cuenta/pedidos" />}>
          <Package /> Mis pedidos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

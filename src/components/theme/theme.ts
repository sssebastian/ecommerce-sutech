// Tema claro/oscuro sin dependencias: la preferencia se guarda en localStorage
// y un script en <head> aplica la clase `dark` antes del primer pintado (sin parpadeo).

export type Theme = "light" | "dark" | "system"

export const THEME_KEY = "sutech-theme"

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

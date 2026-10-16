import { NavLink, Outlet } from "react-router-dom";
import { Bot, Bookmark, Compass, Heart, Home, UserRound } from "lucide-react";
import { Header } from "../header";
import { CreatePostFab } from "@/Components/post/create-post-fab";

export function AppLayout() {
  const navItems = [
    { to: "/home", label: "Início", icon: Home },
    { to: "/favorites", label: "Favoritos", icon: Bookmark },
    { to: "/chatbot", label: "Assistente", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 pb-24 pt-5 sm:px-6 lg:grid-cols-[210px_minmax(0,580px)_250px] lg:gap-10 lg:px-8 lg:pb-10 lg:pt-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Navegação principal">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(39,73,58,0.05)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold">Seu espaço de bem-estar</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Compartilhe receitas que fazem bem para você e para quem está à sua volta.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
              <Compass className="h-4 w-4" />
              Descubra com calma
            </div>
          </div>
        </aside>
      </main>
      <CreatePostFab />
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border/80 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Navegação mobile">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/profile/me"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <UserRound className="h-5 w-5" />
          Perfil
        </NavLink>
      </nav>
    </div>
  );
}

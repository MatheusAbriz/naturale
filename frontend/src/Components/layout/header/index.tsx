import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Leaf, ListChecks, Search as SearchIcon, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    setSearch(location.pathname === "/home" ? searchParams.get("search") ?? "" : "");
  }, [location.pathname, searchParams]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/home?search=${encodeURIComponent(trimmed)}` : "/home");
  }

  function handleClearSearch() {
    setSearch("");
    navigate("/home");
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <Link to="/home" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Leaf className="h-4 w-4" /></span>
        <span>naturale</span>
      </Link>

      <nav className="hidden items-center gap-5 text-sm font-semibold text-muted-foreground md:flex">
        <Link to="/home" className="hover:text-primary">
          Início
        </Link>
        <Link to="/favorites" className="hover:text-primary">
          Favoritos
        </Link>
        <Link to="/chatbot" className="hover:text-primary">
          Chatbot
        </Link>
      </nav>

      <form onSubmit={handleSearchSubmit} className="ml-auto flex max-w-xs flex-1 items-center gap-1">
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar receitas..."
            className="h-9 rounded-full bg-muted/70 pr-8 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 shrink-0 rounded-full">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-secondary bg-muted text-xs font-bold text-primary">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user?.name?.slice(0, 1).toUpperCase()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>Meu perfil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>Configurações</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/plans")}><Sparkles className="h-4 w-4" /> Planos Naturale</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/advanced-search")}><SlidersHorizontal className="h-4 w-4" /> Busca avançada</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shopping-list")}><ListChecks className="h-4 w-4" /> Lista de compras</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
  );
}

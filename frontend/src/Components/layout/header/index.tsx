import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Leaf, ListChecks, Search as SearchIcon, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/styles/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/styles/overlays";
import {
  HeaderBar,
  Inner,
  LogoLink,
  LogoIcon,
  Nav,
  NavLink,
  SearchForm,
  SearchFieldWrap,
  SearchInput,
  ClearButton,
  AvatarButton,
  AvatarImg,
} from "./styles";

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
    <HeaderBar>
      <Inner>
        <LogoLink to="/home">
          <LogoIcon><Leaf size={16} /></LogoIcon>
          <span>naturale</span>
        </LogoLink>

        <Nav>
          <NavLink to="/home">Início</NavLink>
          <NavLink to="/favorites">Favoritos</NavLink>
          <NavLink to="/chatbot">Chatbot</NavLink>
        </Nav>

        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchFieldWrap>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar receitas..."
            />
            {search && (
              <ClearButton type="button" onClick={handleClearSearch} aria-label="Limpar busca">
                <X size={16} />
              </ClearButton>
            )}
          </SearchFieldWrap>
          <Button type="submit" $variant="ghost" $size="icon" style={{ borderRadius: 9999 }}>
            <SearchIcon size={16} />
          </Button>
        </SearchForm>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AvatarButton>
              {user?.avatar ? <AvatarImg src={user.avatar} alt={user.name} /> : user?.name?.slice(0, 1).toUpperCase()}
            </AvatarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>Meu perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>Configurações</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/plans")}><Sparkles size={16} /> Planos Naturale</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/advanced-search")}><SlidersHorizontal size={16} /> Busca avançada</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/shopping-list")}><ListChecks size={16} /> Lista de compras</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Inner>
    </HeaderBar>
  );
}

import { Outlet } from "react-router-dom";
import { Bot, Bookmark, Compass, Heart, Home, Sparkles, UserRound } from "lucide-react";
import { Header } from "../header";
import { CreatePostFab } from "@/Components/post/create-post-fab";
import {
  Root,
  Main,
  SideAside,
  SideNav,
  SideNavLink,
  Section,
  PromoCard,
  PromoIcon,
  PromoTitle,
  PromoDescription,
  PromoFooter,
  MobileNav,
  MobileNavLink,
} from "./styles";

export function AppLayout() {
  const navItems = [
    { to: "/home", label: "Início", icon: Home },
    { to: "/favorites", label: "Favoritos", icon: Bookmark },
    { to: "/chatbot", label: "Assistente", icon: Bot },
    { to: "/plans", label: "Planos", icon: Sparkles },
  ];

  return (
    <Root>
      <Header />
      <Main>
        <SideAside>
          <SideNav aria-label="Navegação principal">
            {navItems.map(({ to, label, icon: Icon }) => (
              <SideNavLink key={to} to={to}>
                <Icon size={20} />
                {label}
              </SideNavLink>
            ))}
          </SideNav>
        </SideAside>

        <Section>
          <Outlet />
        </Section>

        <SideAside>
          <PromoCard>
            <PromoIcon>
              <Heart size={20} />
            </PromoIcon>
            <PromoTitle>Seu espaço de bem-estar</PromoTitle>
            <PromoDescription>
              Compartilhe receitas que fazem bem para você e para quem está à sua volta.
            </PromoDescription>
            <PromoFooter>
              <Compass size={16} />
              Descubra com calma
            </PromoFooter>
          </PromoCard>
        </SideAside>
      </Main>
      <CreatePostFab />
      <MobileNav aria-label="Navegação mobile">
        {navItems.map(({ to, label, icon: Icon }) => (
          <MobileNavLink key={to} to={to}>
            <Icon size={20} />
            {label}
          </MobileNavLink>
        ))}
        <MobileNavLink to="/profile/me">
          <UserRound size={20} />
          Perfil
        </MobileNavLink>
      </MobileNav>
    </Root>
  );
}

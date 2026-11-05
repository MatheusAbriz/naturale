import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import { alpha, media } from "@/styles/theme";

export const Root = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

export const Main = styled.main`
  margin: 0 auto;
  display: grid;
  width: 100%;
  max-width: 1280px;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 20px 16px 96px;

  ${media.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }

  ${media.lg} {
    grid-template-columns: 210px minmax(0, 580px) 250px;
    gap: 40px;
    padding: 32px 32px 40px;
  }
`;

export const SideAside = styled.aside`
  display: none;

  ${media.lg} {
    display: block;
  }
`;

export const SideNav = styled.nav`
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SideNavLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedForeground};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.foreground};
  }

  &.active {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Section = styled.section`
  min-width: 0;
`;

export const PromoCard = styled.div`
  position: sticky;
  top: 96px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  box-shadow: 0 8px 28px rgba(39, 73, 58, 0.05);
`;

export const PromoIcon = styled.div`
  margin-bottom: 12px;
  display: flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentForeground};
`;

export const PromoTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;

export const PromoDescription = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const PromoFooter = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MobileNav = styled.nav`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  border-top: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  background: ${({ theme }) => alpha(theme.colors.white, 0.95)};
  padding: 8px 8px max(8px, env(safe-area-inset-bottom));
  backdrop-filter: blur(8px);

  ${media.lg} {
    display: none;
  }
`;

export const MobileNavLink = styled(RouterNavLink)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 6px 0;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedForeground};

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

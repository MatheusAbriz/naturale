import { styled } from "styled-components"
import { theme } from "../../assets/css/variaveis"
import { Link as RouterLink } from "react-router-dom"

export const StyledHeader = styled.header`
  background: ${theme.corFundo};
  padding: ${theme.espacamentoPadrao};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;

  nav ul li {
    color: ${theme.corBranco};
  }
`

export const LogoLink = styled(RouterLink)`
  flex-shrink: 0;

  @media (max-width: 900px) {
    display: none;
  }
`

export const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  margin: 0 auto;

  a {
    color: ${theme.corBranco};
    text-decoration: none;
    font-weight: 500;
  }

  @media (max-width: 900px) {
    display: none;
  }
`

export const DesktopAvatar = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`

export const SearchWrapper = styled.div`
  min-width: 200px;

  @media (min-width: 451px) and (max-width: 900px) {
    flex-basis: 0;
  }

  @media (max-width: 450px) {
    width: 100%;
    order: 2;
  }
`

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.corBranco};
  cursor: pointer;

  @media (max-width: 900px) {
    display: block;
  }

  @media (max-width: 450px) {
    order: 1;
    margin-left: auto;
  }
`

export const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 99;
`

export const MobileMenuContent = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background: ${theme.corFundo};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transform: ${props => (props.$isOpen ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease-out;
  z-index: 100;

  nav {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  nav a {
    color: ${theme.corBranco};
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .mobile-avatar {
    margin-top: auto;
  }
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.corBranco};
  cursor: pointer;
  align-self: flex-end;
`

export const MobileMenuLogo = styled.div`
  width: 100%;
  max-width: 150px;
`

import styled from "styled-components";
import { Link } from "react-router-dom";
import { alpha, media } from "@/styles/theme";
import { Input as BaseInput } from "@/styles/inputs";

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  background: ${({ theme }) => alpha(theme.colors.white, 0.9)};
  backdrop-filter: blur(8px);
`;

export const Inner = styled.div`
  margin: 0 auto;
  display: flex;
  height: 64px;
  max-width: 1280px;
  align-items: center;
  gap: 12px;
  padding: 0 16px;

  ${media.sm} {
    padding: 0 24px;
  }

  ${media.lg} {
    padding: 0 32px;
  }
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.primary};
`;

export const LogoIcon = styled.span`
  display: flex;
  height: 32px;
  width: 32px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
`;

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mutedForeground};

  ${media.md} {
    display: flex;
  }
`;

export const NavLink = styled(Link)`
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SearchForm = styled.form`
  margin-left: auto;
  display: flex;
  max-width: 320px;
  flex: 1;
  align-items: center;
  gap: 4px;
`;

export const SearchFieldWrap = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchInput = styled(BaseInput)`
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => alpha(theme.colors.muted, 0.7)};
  padding-right: 32px;
  font-size: 14px;
  border: none;
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: ${({ theme }) => theme.colors.mutedForeground};

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

export const AvatarButton = styled.button`
  height: 36px;
  width: 36px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const AvatarImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

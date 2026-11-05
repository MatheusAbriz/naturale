import styled from "styled-components";
import { Link } from "react-router-dom";
import { alpha, media } from "@/styles/theme";

export const Root = styled.div`
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.background};

  ${media.lg} {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const Main = styled.main`
  display: flex;
  min-height: 100svh;
  align-items: center;
  padding: 40px 20px;

  ${media.sm} {
    padding: 40px;
  }

  ${media.lg} {
    padding: 40px 64px;
  }

  ${media.xl} {
    padding: 40px 96px;
  }
`;

export const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 512px;
`;

export const LogoLink = styled(Link)`
  margin-bottom: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.primary};
`;

export const LogoIcon = styled.span`
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h1`
  margin: 8px 0 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.foreground};

  ${media.sm} {
    font-size: 36px;
  }
`;

export const Description = styled.p`
  margin: 12px 0 0;
  max-width: 448px;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};

  ${media.sm} {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const ChildrenWrap = styled.div`
  margin-top: 32px;
`;

export const Aside = styled.aside`
  position: relative;
  display: none;
  min-height: 100svh;
  overflow: hidden;

  ${media.lg} {
    display: block;
  }
`;

export const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
`;

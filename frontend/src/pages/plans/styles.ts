import styled, { keyframes } from "styled-components";
import { Loader2 } from "lucide-react";
import { alpha, media } from "@/styles/theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinningIcon = styled(Loader2)`
  flex-shrink: 0;
  animation: ${spin} 1s linear infinite;
`;

export const Page = styled.div`
  padding-bottom: 32px;
`;

export const Hero = styled.section`
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  padding: 32px 20px;

  ${media.sm} {
    padding: 40px 32px;
  }
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => alpha(theme.colors.white, 0.15)};
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
`;

export const HeroTitle = styled.h1`
  margin: 16px 0 0;
  max-width: 576px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.01em;

  ${media.sm} {
    font-size: 36px;
  }
`;

export const HeroText = styled.p`
  margin: 12px 0 0;
  max-width: 672px;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => alpha(theme.colors.white, 0.8)};

  ${media.sm} {
    font-size: 16px;
  }
`;

export const PendingBanner = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.accentForeground, 0.25)};
  background: ${({ theme }) => alpha(theme.colors.accent, 0.4)};
  padding: 12px 16px;
`;

export const PendingLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PendingTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;

export const PendingSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const PendingRight = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
`;

export const DismissButton = styled.button`
  color: ${({ theme }) => theme.colors.mutedForeground};

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

export const PlansGrid = styled.div`
  margin-top: 24px;
  display: grid;
  gap: 16px;
  /* 1 card por linha: a página fica dentro da coluna central do layout
     (~580px no desktop), estreita demais pra 3 colunas ficarem legíveis. */
`;

export const PlanArticle = styled.article<{ $deluxe: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme, $deluxe }) => ($deluxe ? alpha(theme.colors.accentForeground, 0.35) : theme.colors.border)};
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

export const DeluxeBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.accent};
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accentForeground};
`;

export const PlanHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const PlanName = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
`;

export const PlanDescription = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CurrentBadge = styled.span`
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.secondary};
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const PlanPrice = styled.p`
  margin: 24px 0 0;
  font-size: 24px;
  font-weight: 800;
`;

export const FeaturesList = styled.ul`
  margin: 24px 0 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  list-style: none;
`;

export const FeatureItem = styled.li`
  display: flex;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
`;

export const FooterNote = styled.p`
  margin: 20px 0 0;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const DialogInfoBox = styled.div`
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.muted};
  padding: 16px;
  font-size: 14px;
`;

export const DialogInfoPrice = styled.p`
  margin: 0;
  font-weight: 700;
`;

export const DialogInfoText = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const LinkBox = styled.div`
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.muted};
  padding: 12px;
`;

export const LinkInput = styled.input`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  outline: none;
  border: none;
`;

export const DialogFooterNote = styled.p`
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

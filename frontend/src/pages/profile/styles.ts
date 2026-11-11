import styled from "styled-components";
import { alpha, media } from "@/styles/theme";

export const HeroSection = styled.section`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

export const Banner = styled.div`
  height: 96px;
  background: ${({ theme }) => theme.colors.primary};

  ${media.sm} {
    height: 128px;
  }
`;

export const HeroContent = styled.div`
  padding: 0 20px 20px;

  ${media.sm} {
    padding: 0 28px 20px;
  }
`;

export const AvatarRow = styled.div`
  margin-top: -48px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.sm} {
    margin-top: -56px;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

export const Avatar = styled.img`
  height: 96px;
  width: 96px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 4px solid ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.muted};
  object-fit: cover;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  ${media.sm} {
    height: 112px;
    width: 112px;
  }
`;

export const NameBlock = styled.div`
  margin-top: 16px;
`;

export const NameRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const Username = styled.p`
  margin: 2px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const MetricsGrid = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => alpha(theme.colors.muted, 0.7)};
  padding: 12px 0;

  > div + div {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  text-align: center;
`;

export const ClickableMetricItem = styled(MetricItem)`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.lg};

  &:hover {
    background: ${({ theme }) => alpha(theme.colors.muted, 1)};
  }
`;

export const MetricValue = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 800;
`;

export const MetricIcon = styled.span`
  display: none;

  ${media.sm} {
    display: inline-flex;
  }
`;

export const MetricLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.mutedForeground};

  ${media.sm} {
    font-size: 12px;
  }
`;

export const DeluxeBanner = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.accentForeground, 0.15)};
  background: ${({ theme }) => alpha(theme.colors.accent, 0.5)};
  padding: 16px;
  font-size: 14px;
`;

export const DeluxeIcon = styled.span`
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.accentForeground};
`;

export const DeluxeTitle = styled.p`
  margin: 0;
  font-weight: 800;
`;

export const DeluxeText = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const PostsHeaderRow = styled.div`
  margin: 32px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PostsHeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
`;

export const PostsHeaderSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const NewRecipeLabel = styled.span`
  display: none;

  ${media.sm} {
    display: inline;
  }
`;

export const EmptyCreateWrap = styled.div`
  margin-top: -32px;
  display: flex;
  justify-content: center;
`;

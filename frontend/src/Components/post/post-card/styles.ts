import styled from "styled-components";
import { Card as BaseCard } from "@/styles/cards";

export const Card = styled(BaseCard)`
  gap: 0;
  padding: 0;
  margin-bottom: 20px;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.cardHover};
  }
`;

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
`;

export const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  object-fit: cover;
`;

export const Username = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

export const AuthorSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CoverImage = styled.img`
  aspect-ratio: 4 / 3;
  width: 100%;
  background: ${({ theme }) => theme.colors.muted};
  object-fit: cover;
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 14px 0;
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.foreground};
  transition: background-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const FavoriteButton = styled.button`
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.foreground};
  transition: background-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const Count = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Body = styled.div`
  padding: 4px 14px 12px;
`;

export const Title = styled.p`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const PostText = styled.p<{ $expanded: boolean }>`
  margin: 0;
  font-size: 14px;
  line-height: 24px;
  color: ${({ $expanded, theme }) => ($expanded ? "inherit" : theme.colors.mutedForeground)};

  ${({ $expanded }) =>
    !$expanded &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

export const ExpandButton = styled.button`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`;

export const TimeRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Footer = styled.div`
  margin-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 8px;
`;

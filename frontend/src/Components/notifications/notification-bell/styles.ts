import styled from "styled-components";
import { DropdownMenuContent } from "@/styles/overlays";

export const BellButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.foreground};

  &:hover {
    background: ${({ theme }) => theme.colors.muted};
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.destructive};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const Panel = styled(DropdownMenuContent)`
  width: 360px;
  max-width: calc(100vw - 32px);
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const ClearAllButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: #047857;

  &:hover {
    text-decoration: underline;
  }
`;

export const NotificationItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  white-space: normal;
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentForeground};
  }
`;

export const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UnreadDot = styled.span`
  flex-shrink: 0;
  margin-top: 4px;
  height: 8px;
  width: 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.destructive};
`;

export const DeleteButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  width: 22px;
  margin-top: 2px;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.mutedForeground};

  &:hover {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

export const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

export const NotificationText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 18px;
`;

export const NotificationTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EmptyMessage = styled.p`
  margin: 0;
  padding: 20px 0;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const LoadMoreButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #047857;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

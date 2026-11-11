import styled from "styled-components";
import { DropdownMenuContent, DropdownMenuItem } from "@/styles/overlays";

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
  padding: 8px 10px 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const NotificationItem = styled(DropdownMenuItem)`
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  white-space: normal;
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

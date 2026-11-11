import styled from "styled-components";
import { DialogContent as BaseDialogContent } from "@/styles/overlays";

export const StyledDialogContent = styled(BaseDialogContent)`
  display: flex;
  max-height: 85vh;
  flex-direction: column;
`;

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const LoadMoreButton = styled.button`
  margin-top: 12px;
  font-size: 14px;
  color: #047857;

  &:hover {
    text-decoration: underline;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Name = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

export const Username = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

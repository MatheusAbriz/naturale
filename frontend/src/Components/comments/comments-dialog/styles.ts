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

export const ComposerForm = styled.form`
  display: flex;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 12px;
`;

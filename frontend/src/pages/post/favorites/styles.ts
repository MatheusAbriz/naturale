import styled from "styled-components";

export const Header = styled.div`
  margin-bottom: 20px;
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const Description = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CollectionsPanel = styled.div`
  margin-bottom: 20px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  padding: 16px;
`;

export const CollectionsPanelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CollectionsPanelTitle = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
`;

export const CollectionsPanelSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const PillsRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

export const Pill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.muted)};
  color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.mutedForeground)};
`;

export const PromptWrap = styled.div`
  margin-bottom: 20px;
`;

export const OrganizeLink = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`;

export const DialogInput = styled.input`
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.input};
  background: ${({ theme }) => theme.colors.white};
  padding: 0 12px;
  font-size: 14px;
  outline: none;
`;

export const EmptyCollectionsHint = styled.p`
  margin: 0;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.muted};
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CollectionsGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const CollectionCheckboxLabel = styled.label`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
`;

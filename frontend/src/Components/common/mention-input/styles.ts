import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const SuggestionList = styled.ul`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 4px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
  background: ${({ theme }) => theme.colors.popover};
  color: ${({ theme }) => theme.colors.popoverForeground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.dropdown};
  z-index: 50;
  list-style: none;
`;

export const SuggestionItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.accentForeground : "inherit")};
`;

export const SuggestionAvatar = styled.img`
  height: 24px;
  width: 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

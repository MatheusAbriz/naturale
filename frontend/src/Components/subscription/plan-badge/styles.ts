import styled from "styled-components";

export const Badge = styled.span<{ $deluxe: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 800;
  background: ${({ theme, $deluxe }) => ($deluxe ? theme.colors.accent : theme.colors.secondary)};
  color: ${({ theme, $deluxe }) => ($deluxe ? theme.colors.accentForeground : theme.colors.primary)};
`;

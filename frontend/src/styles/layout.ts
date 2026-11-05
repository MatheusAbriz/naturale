import styled from "styled-components";

export const Form = styled.form<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 16 }) => $gap}px;
`;

export const Row = styled.div<{ $gap?: number; $align?: string; $justify?: string; $wrap?: boolean }>`
  display: flex;
  align-items: ${({ $align = "center" }) => $align};
  justify-content: ${({ $justify = "flex-start" }) => $justify};
  gap: ${({ $gap = 8 }) => $gap}px;
  flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};
`;

export const Column = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 8 }) => $gap}px;
`;

import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Wrap = styled.div<{ $padY: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $padY }) => $padY}px 0;
`;

export const Spinner = styled.div<{ $size: number; $border: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: ${({ $border }) => $border}px solid ${({ theme }) => theme.colors.primary};
  border-top-color: transparent;
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 0.6s linear infinite;
`;

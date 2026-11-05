import styled from "styled-components";
import { alpha, media } from "@/styles/theme";

export const Fab = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.fab};
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background: ${({ theme }) => alpha(theme.colors.primary, 0.9)};
  }

  ${media.lg} {
    bottom: 32px;
    right: 32px;
  }
`;

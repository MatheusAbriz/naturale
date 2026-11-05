import styled from "styled-components";
import { alpha } from "@/styles/theme";

export const Wrap = styled.div`
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  border: 1px solid ${({ theme }) => alpha(theme.colors.primary, 0.15)};
  background: ${({ theme }) => alpha(theme.colors.secondary, 0.6)};
  padding: 20px;
  text-align: center;
`;

export const IconCircle = styled.span`
  margin: 0 auto;
  display: flex;
  height: 44px;
  width: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h2`
  margin: 12px 0 0;
  font-weight: 800;
`;

export const Description = styled.p`
  margin: 4px auto 0;
  max-width: 384px;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

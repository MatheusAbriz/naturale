import styled from "styled-components";
import { alpha } from "./theme";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.cardForeground};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.8)};
  border-radius: ${({ theme }) => theme.radius["2xl"]};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 24px;
`;

export const CardTitle = styled.div`
  line-height: 1;
  font-weight: 600;
`;

export const CardDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CardContent = styled.div`
  padding: 0 24px;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

import styled from "styled-components";
import { Link } from "react-router-dom";

export const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const Muted = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const SmallMuted = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const MutedLink = styled(Link)`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

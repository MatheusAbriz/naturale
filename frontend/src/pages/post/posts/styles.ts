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

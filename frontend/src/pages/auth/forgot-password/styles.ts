import styled from "styled-components";
import { Form } from "@/styles/layout";

export { Form };

export const RetryButton = styled.button`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`;

import styled, { keyframes } from "styled-components";
import { FullScreen } from "./styles";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #059669;
  border-top-color: transparent;
  border-radius: 9999px;
  animation: ${spin} 0.6s linear infinite;
`;

export function GlobalLoading() {
  return (
    <FullScreen>
      <Spinner />
    </FullScreen>
  );
}

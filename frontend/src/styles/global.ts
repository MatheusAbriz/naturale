import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    border-color: ${({ theme }) => theme.colors.border};
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    font-family: ${({ theme }) => theme.font.family};
    -webkit-font-smoothing: antialiased;
  }

  button {
    font-family: inherit;
    background: none;
    border: none;
    color: inherit;
  }

  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, textarea, select {
    font-family: inherit;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  img {
    display: block;
    max-width: 100%;
  }
`;

import { createGlobalStyle, css } from "styled-components";

const styles = css`
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #83838398;
  }

  * {
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
  }

  body {
    margin: 0;
    font-family: "Space Grotesk", "Poppins", Arial, Helvetica, sans-serif;
    font-size: 1.6rem;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.5s linear;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  img {
    user-select: none;
    pointer-events: none;
  }
`;

const GlobalStyles = createGlobalStyle`
  ${styles}
`;

export { GlobalStyles };

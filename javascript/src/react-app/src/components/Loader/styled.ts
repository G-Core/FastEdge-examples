import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const LoaderShimmer = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background: ${({ theme: { shimmer } }) => `linear-gradient(
    to right,
    ${shimmer.col1} 0%,
    ${shimmer.col2} 20%,
    ${shimmer.col3} 40%,
    ${shimmer.col4} 100%
  )`};
  background-size: 200% 100%;
  border-radius: 15px;
  animation: ${shimmer} 1.5s infinite linear;
`;

export { LoaderShimmer };

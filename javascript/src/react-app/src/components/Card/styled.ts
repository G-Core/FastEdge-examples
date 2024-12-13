import styled from "styled-components";

const StyledCard = styled.div<{ centered: boolean }>`
  background: ${({ theme }) => theme.card.background};
  color: ${({ theme }) => theme.text},
  border-radius: 20px;
  min-width: 150px;
  align-items: center;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: ${(centered) =>
    centered ? "space-evenly" : "space-between"};
`;

export { StyledCard };

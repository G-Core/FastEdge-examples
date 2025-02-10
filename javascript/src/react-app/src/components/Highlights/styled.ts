import styled from "styled-components";

const Container = styled.div`
  display: grid;
  justify-content: space-around;
  flex-wrap: wrap;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const Title = styled.div`
  margin-bottom: 1rem;
`;

const Value = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1rem;

  h1 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  h3 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  span {
    color: #7f7f7f;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
  }
`;

export { Container, Title, Value };

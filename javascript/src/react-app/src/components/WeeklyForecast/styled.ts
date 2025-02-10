import styled from "styled-components";

const Container = styled.div`
  display: grid;
  justify-content: space-around;
  flex-wrap: wrap;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

const Day = styled.div`
  margin-bottom: 1rem;
  font-size: 2.3rem;

  span {
    color: #7f7f7f;
    font-size: 1.4rem;
  }

  @media (max-width: 980px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.div`
  font-size: 1.3rem;
  color: #7f7f7f;
  text-align: center;
`;

const TemperatureWrapper = styled.div`
  color: #7f7f7f;
  margin-left: 1rem;
`;

export { Container, Day, Description, TemperatureWrapper };

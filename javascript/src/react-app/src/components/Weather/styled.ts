import styled from "styled-components";

const WeatherIcon = styled.div<{ icon: string }>`
  height: 35%;
  display: block;
  margin: 2rem auto;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background: ${({ icon }) => `url(/weather_icons/${icon}.png)`};

  @media (max-width: 600px) {
    height: 200px;
    width: 100%;
  }
`;

const TemperatureWrapper = styled.div`
  border: 1px solid deeppink;
`;

const TemperatureHeading = styled.h2`
  font-size: 10rem;
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  font-family: "Poppins";
  font-weight: 300;

  span {
    font-size: 5rem;
    margin-top: 20px;
    font-weight: 400;
  }
`;

const FeelsLikeWrapper = styled.div`
  margin-top: -3rem;
  text-align: left !important;
  color: #7f7f7f;

  @media (max-width: 600px) {
    margin-top: 0;
  }
`;

const Description = styled.div`
  font-size: 2rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  text-transform: capitalize;

  @media (max-width: 750px) {
    font-size: 1.8rem;
  }

  i {
    font-size: 3rem;

    @media (max-width: 750px) {
      font-size: 2rem;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.divider.background};
  margin: 2rem 0;
`;

const Day = styled.div`
  font-size: 3rem;

  span {
    color: #7f7f7f;
    white-space: nowrap;
  }

  @media (max-width: 750px) {
    font-size: 1.8rem;
  }
`;

const City = styled.div`
  text-transform: capitalize;
  font-size: 2rem;
  margin: 2rem 0;

  @media (max-width: 750px) {
    font-size: 1.8rem;
  }
`;

export {
  City,
  Day,
  Description,
  Divider,
  FeelsLikeWrapper,
  TemperatureHeading,
  TemperatureWrapper,
  WeatherIcon,
};

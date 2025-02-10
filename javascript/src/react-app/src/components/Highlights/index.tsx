import React from "react";
import dayjs from "dayjs";

import { Card, Loader } from "@/components/index";
import { useAppState } from "@/provider/AppStateContext";

import { Container, Title, Value } from "./styled";

const Highlights: React.FC = () => {
  const appState = useAppState();
  const { weather, isDark } = appState;
  if (!weather) {
    return <Loader width={"100%"} height={"350px"} />;
  }
  const { current } = weather;

  const dateFormat = (date: string): string => dayjs(date).format("h:mm A");

  return (
    <>
      <Container>
        <Card>
          <Title>Humidity</Title>
          <img src="/weather_icons/humidity.png" width={100} alt="" />
          <Value>
            <h1>{current.humidity}</h1>
            <span>%</span>
          </Value>
        </Card>
        <Card>
          <Title>Wind Speed</Title>
          <img
            src={`/weather_icons/wind-${isDark ? "night" : "day"}.png`}
            width={120}
            alt="wind icon"
          />
          <Value>
            <h1>{current.windSpeed.toFixed(1)}</h1>
            <span>m/s</span>
          </Value>
        </Card>
        <Card>
          <Title>Sunrise</Title>
          <img src="/weather_icons/sunrise.png" width={70} alt="" />
          <Value>
            <h3> {dateFormat(current.sunrise)}</h3>
          </Value>
        </Card>
        <Card>
          <Title>Pressure</Title>
          <img src="/weather_icons/pressure.png" width={60} alt="" />
          <Value>
            <h1>{current.pressure}</h1>
            <span>hPa</span>
          </Value>
        </Card>
        <Card>
          <Title>Clouds</Title>
          <img src="/weather_icons/clouds.png" width={100} alt="" />
          <Value>
            <h1> {current.clouds}</h1>
            <span>%</span>
          </Value>
        </Card>
        <Card>
          <Title>Sunset</Title>
          <img src="/weather_icons/sunset.png" width={70} alt="" />
          <Value>
            <h3> {dateFormat(current.sunset)}</h3>
          </Value>
        </Card>
      </Container>
    </>
  );
};

export { Highlights };

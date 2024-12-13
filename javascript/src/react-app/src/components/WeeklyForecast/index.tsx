import React, { useMemo } from "react";
import dayjs from "dayjs";

import { useAppState } from "@/provider/AppStateContext";

import { Forecast } from "@types";
import { Card, Loader, Temperature } from "@/components/index";

import { Container, Day, Description, TemperatureWrapper } from "./styled";

interface ForecastCards extends Forecast {
  day: string;
}

const WeeklyForecast: React.FC = () => {
  const appState = useAppState();
  const { weather } = appState;

  const forecasts = useMemo(() => {
    if (!weather) return [];

    const dayFormat = (date: string): string => dayjs(date).format("dddd");
    const today = dayFormat(weather.time);

    const futureData = weather.forecast.reduce<Array<ForecastCards>>(
      (acc, forecast) => {
        const day = dayFormat(forecast.time);
        if (day !== today) {
          acc.push({ ...forecast, day });
        }
        return acc;
      },
      []
    );
    const halfData = futureData.filter((f, i) => i % 2);
    return halfData.slice(0, halfData.length - (halfData.length % 4));
  }, [weather]);

  if (!weather) {
    return <Loader width={"100%"} height={"500px"} />;
  }

  return (
    <Container>
      {forecasts.map((forecast, index) => {
        return (
          <Card key={index}>
            <Day>{forecast.day}</Day>
            <img
              src={`/weather_icons/${forecast.icon}.png`}
              alt="icon"
              width={100}
            />
            <Description>{forecast.description}</Description>
            <TemperatureWrapper>
              <Temperature temperature={forecast.temp} />°
            </TemperatureWrapper>
          </Card>
        );
      })}
    </Container>
  );
};

export { WeeklyForecast };

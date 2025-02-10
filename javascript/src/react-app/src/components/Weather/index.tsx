import dayjs from "dayjs";
import { useAppState } from "@/provider/AppStateContext";
import { Loader, Temperature } from "@/components/index";

import {
  City,
  Day,
  Description,
  Divider,
  FeelsLikeWrapper,
  TemperatureHeading,
  WeatherIcon,
} from "./styled";

const Weather: React.FC = () => {
  const appState = useAppState();
  const { weather, unit } = appState;

  if (!weather) {
    return (
      <Loader width={"100%"} height={"900px"}>
        Loading
      </Loader>
    );
  }
  const { current } = weather;

  const dateFormat = (date: string): string => dayjs(date).format("h:mm A");
  const dayFormat = (date: string): string => dayjs(date).format("dddd");

  return (
    <>
      <WeatherIcon className="weather-icon" icon={current.icon}></WeatherIcon>
      <TemperatureHeading>
        <Temperature temperature={current.temp} />
        <span>°{unit}</span>
      </TemperatureHeading>
      <FeelsLikeWrapper>
        Feels like <Temperature temperature={current.feelsLike} /> °{unit}
      </FeelsLikeWrapper>
      <Description>
        <i className="fa-brands fa-cloudversify"></i>&nbsp;
        {current.description}
      </Description>
      <Divider />
      <Day>
        {dayFormat(weather.time)}, <span>{dateFormat(weather.time)}</span>
      </Day>
      <City>
        <i className="fa-solid fa-location-dot"></i>
        {` ${weather.weatherStation}, ${weather.country}`}
      </City>
    </>
  );
};

export { Weather };

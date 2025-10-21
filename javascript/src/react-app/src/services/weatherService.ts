import dayjs from "dayjs";

import { config } from "@/config/index";
import { CurrentWeather, Weather } from "@types";

import { GetCurrentWeatherResponse, GetWeatherForecastResponse } from "./types";

const formatDate = (dt: number, timezone: number): string => {
  return dayjs.unix(dt + timezone).format();
};

async function getCurrentWeather(params: string): Promise<CurrentWeather> {
  const res = await fetch(`${config.BACKEND_ORIGIN}/current?${params}`);
  const response: GetCurrentWeatherResponse = await res.json();
  if (response.message || !response.sys) {
    // Something happened. i.e. no value found - bad city name etc
    return null;
  }

  return {
    name: response.name,
    country: response.sys.country,
    time: formatDate(response.dt, response.timezone),
    timezone: response.timezone,
    coords: {
      lat: response.coord.lat,
      lon: response.coord.lon,
    },
    current: {
      feelsLike: response.main.feels_like,
      humidity: response.main.humidity,
      pressure: response.main.pressure,
      temp: response.main.temp,
      sunrise: formatDate(response.sys.sunrise, response.timezone),
      sunset: formatDate(response.sys.sunset, response.timezone),
      windSpeed: response.wind.speed,
      clouds: response.clouds.all,
      overall: response.weather[0]?.main,
      description: response.weather[0]?.description,
      icon: response.weather[0]?.icon,
    },
  };
}

async function getWeatherForecast(
  currentWeather: CurrentWeather
): Promise<Weather> {
  if (!currentWeather) return null;
  const res = await fetch(
    `${config.BACKEND_ORIGIN}/forecast?lat=${currentWeather?.coords.lat}&lon=${currentWeather?.coords.lon}`
  );
  const response: GetWeatherForecastResponse = await res.json();
  if (response.message) {
    // Something happened. i.e. no value found - bad lon/lat etc
    return { ...currentWeather, weatherStation: "Unknown", forecast: [] };
  }

  return {
    ...currentWeather,
    weatherStation: response.city.name,
    forecast: response.list.map((forecast) => ({
      time: formatDate(forecast.dt, currentWeather.timezone),
      temp: forecast.main.temp,
      overall: forecast.weather[0]?.main,
      description: forecast.weather[0]?.description,
      icon: forecast.weather[0]?.icon,
    })),
  };
}

async function getWeatherWithCoords(
  lon: number,
  lat: number
): Promise<Weather> {
  const currentWeather = await getCurrentWeather(`lon=${lon}&lat=${lat}`);
  return await getWeatherForecast(currentWeather);
}

async function getWeatherWithCity(city: string): Promise<Weather> {
  const currentWeather = await getCurrentWeather(`q=${city}`);
  return await getWeatherForecast(currentWeather);
}

export { getWeatherWithCity, getWeatherWithCoords };

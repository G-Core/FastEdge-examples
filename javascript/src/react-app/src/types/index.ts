type GeoCoords = {
  lat: number;
  lon: number;
};

interface CurrentWeatherResponse {
  name: string;
  country: string;
  coords: GeoCoords;
  time: string;
  timezone: number;
  current: {
    feelsLike: number;
    humidity: number;
    pressure: number;
    temp: number;
    sunrise: string;
    sunset: string;
    windSpeed: number;
    clouds: number;
    overall: string;
    description: string;
    icon: string;
  };
}

type CurrentWeather = CurrentWeatherResponse | null;

interface Forecast {
  time: string;
  temp: number;
  overall: string;
  description: string;
  icon: string;
}

interface WeatherResponse extends CurrentWeatherResponse {
  weatherStation: string;
  forecast: Array<Forecast>;
}

type Weather = WeatherResponse | null;

export type { CurrentWeather, Forecast, GeoCoords, Weather };

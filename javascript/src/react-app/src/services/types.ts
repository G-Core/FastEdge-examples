interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

interface Clouds {
  all: number;
}

interface Coords {
  lat: number;
  lon: number;
}

interface WeatherItem {
  clouds: Clouds;
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
    temp_kf?: number;
  };
  pop: number;
  sys: {
    pod: string;
  };
  visibility: number;
  weather: Array<Weather>;
  wind: Wind;
}

interface City {
  coord: Coords;
  country: string;
  id: number;
  name: string;
  population: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

interface GetWeatherForecastResponse {
  city: City;
  cnt: number;
  cod: string;
  list: Array<WeatherItem>;
  message: number;
}

interface GetCurrentWeatherResponse {
  base: string;
  clouds: Clouds;
  cod: number;
  coord: { lon: number; lat: number };
  dt: number;
  id: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
  weather: Array<Weather>;
  wind: Wind;
  message: number;
}

export type { GetWeatherForecastResponse, GetCurrentWeatherResponse };

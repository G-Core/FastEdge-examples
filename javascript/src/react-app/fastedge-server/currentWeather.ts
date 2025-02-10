import { json } from "itty-router";

import { IRequestWithMapApiKey } from "./middleware";

async function currentWeatherHandler({
  query,
  mapApiKey,
  headers,
}: IRequestWithMapApiKey) {
  const { lon, lat, q } = query;
  let city = q;

  if ((!lat || !lon) && !city) {
    return json({ error: "lat or lon not provided" }, { status: 400 });
  }

  if (lat === "999" && lon === "999") {
    // use city name from headers - browser geo location not supported or enabled
    city = headers.get("geoip-city") ?? "";
  }

  const params = `appid=${mapApiKey}&units=metric`;

  if (city) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&${params}`
    );
  }

  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${params}`
  );
}

export { currentWeatherHandler };

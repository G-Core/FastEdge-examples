import { json } from "itty-router";

import { IRequestWithMapApiKey } from "./middleware";

async function forecastHandler({ query, mapApiKey }: IRequestWithMapApiKey) {
  const { lon, lat } = query;
  if (!lat || !lon) {
    return json({ error: "lat or lon not provided" }, { status: 400 });
  }

  const params = `appid=${mapApiKey}&units=metric`;

  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&${params}`
  );
}

export { forecastHandler };

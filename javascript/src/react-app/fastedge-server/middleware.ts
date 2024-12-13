import { error, IRequest } from "itty-router";
import { getEnv } from "fastedge::env";

type IRequestWithMapApiKey = IRequest & { mapApiKey: string };

function withMapApiKey(request: IRequest) {
  const WEATHER_API_KEY = getEnv("WEATHER_API_KEY");
  if (!WEATHER_API_KEY) {
    return error(400, "Missing environment variable WEATHER_API_KEY");
  }
  request.mapApiKey = WEATHER_API_KEY;
}

export { withMapApiKey };
export type { IRequestWithMapApiKey };

import { ThemeType } from "../../styles/theme";

import { Weather } from "@types";

interface AppState {
  weather: Weather;
  unit: string;
  invalidCity: boolean;
  isDark: boolean;
  theme: ThemeType;
}

type AppStateAction =
  | { type: "WEATHER"; payload: Weather }
  | { type: "UNIT"; payload: string };

export type { AppState, AppStateAction };

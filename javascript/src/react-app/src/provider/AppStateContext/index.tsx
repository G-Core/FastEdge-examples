import { createContext, useContext, useReducer } from "react";
import dayjs from "dayjs";

import { lightTheme, darkTheme } from "@/styles/theme";

import { AppState, AppStateAction } from "./types";

const initialAppState: AppState = {
  weather: null,
  unit: "C",
  invalidCity: false,
  isDark: false,
  theme: lightTheme,
};

const isDayTime = (time: string, sunrise: string, sunset: string): boolean => {
  const currentTime = dayjs(time);
  return (
    currentTime.isAfter(dayjs(sunrise)) && currentTime.isBefore(dayjs(sunset))
  );
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  const { type, payload } = action;
  switch (type) {
    case "WEATHER": {
      if (payload === null) {
        return { ...state, invalidCity: true };
      }
      const isDark = !isDayTime(
        payload.time,
        payload.current.sunrise,
        payload.current.sunset
      );
      return {
        ...state,
        weather: payload,
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        invalidCity: false,
      };
    }
    case "UNIT": {
      return { ...state, unit: payload };
    }
    default:
      return state;
  }
}

const AppStateContext = createContext<AppState>(initialAppState);
const AppStateDispatchContext = createContext<React.Dispatch<AppStateAction>>(
  () => undefined
);

function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);

  return (
    <AppStateContext.Provider value={state}>
      <AppStateDispatchContext.Provider value={dispatch}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

function useAppState() {
  return useContext(AppStateContext);
}

function useAppStateDispatch() {
  return useContext(AppStateDispatchContext);
}

export { AppStateProvider, useAppState, useAppStateDispatch };

import { useEffect } from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@/styles/globalStyles";
import { Container, MainContent, SectionHeading, SideBar } from "@/App.styled";
import { getBrowserGeoCoords } from "@/utils";
import { getWeatherWithCoords } from "@/services/weatherService";

import {
  CityInput,
  Header,
  Highlights,
  Weather,
  WeeklyForecast,
} from "@/components/index";

import { useAppState, useAppStateDispatch } from "@/provider/AppStateContext";

const App: React.FC = () => {
  const appState = useAppState();
  const setAppState = useAppStateDispatch();

  useEffect(() => {
    (async () => {
      const { lon, lat } = await getBrowserGeoCoords();
      const weather = await getWeatherWithCoords(lon, lat);
      setAppState({ type: "WEATHER", payload: weather });
    })();
  }, [setAppState]);

  return (
    <ThemeProvider theme={appState.theme}>
      <GlobalStyles />
      <Container>
        <SideBar>
          <CityInput />
          <Weather />
        </SideBar>
        <MainContent>
          <Header />
          <SectionHeading>{"Today's Highlights"}</SectionHeading>
          <Highlights />
          <SectionHeading>This Week</SectionHeading>
          <WeeklyForecast />
        </MainContent>
      </Container>
    </ThemeProvider>
  );
};

export default App;

import React, { useRef } from "react";

import {
  getWeatherWithCity,
  getWeatherWithCoords,
} from "@/services/weatherService";
import { useAppState, useAppStateDispatch } from "@/provider/AppStateContext";
import { getBrowserGeoCoords } from "@/utils";

import {
  Container,
  ErrorMsg,
  InputCrossHairs,
  InputWrapper,
  StyledInput,
} from "./styled";

const CityInput: React.FC = () => {
  const input = useRef<HTMLInputElement>(null);
  const { invalidCity } = useAppState();
  const setAppState = useAppStateDispatch();

  let time: NodeJS.Timeout;
  return (
    <Container>
      <InputWrapper cityError={invalidCity}>
        <InputCrossHairs
          onClick={async () => {
            const { lon, lat } = await getBrowserGeoCoords();
            const weather = await getWeatherWithCoords(lon, lat);
            setAppState({ type: "WEATHER", payload: weather });
            if (input.current) {
              input.current.value = "";
            }
          }}
        >
          <i className="fa-solid fa-location-crosshairs"></i>
        </InputCrossHairs>
        <i className="fa-solid fa-magnifying-glass"></i>
        <StyledInput
          type="text"
          ref={input}
          placeholder="Search for places ..."
          onInput={({ target }) => {
            const { value } = target as HTMLInputElement;
            clearTimeout(time);
            time = setTimeout(async () => {
              const weather = await getWeatherWithCity(value);
              setAppState({ type: "WEATHER", payload: weather });
            }, 800);
          }}
        />
      </InputWrapper>
      {invalidCity && <ErrorMsg>Invalid city</ErrorMsg>}
    </Container>
  );
};

export { CityInput };

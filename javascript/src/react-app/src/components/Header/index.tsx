import React from "react";

import { useAppState, useAppStateDispatch } from "@/provider/AppStateContext";

import { Container, Control, ControlWrapper } from "./styled";

const Header: React.FC = () => {
  const appState = useAppState();
  const setAppState = useAppStateDispatch();
  const { unit } = appState;
  return (
    <Container>
      <ControlWrapper>
        <Control
          active={unit === "C"}
          onClick={() => {
            setAppState({ type: "UNIT", payload: "C" });
          }}
        >
          °C
        </Control>
        <Control
          active={unit === "F"}
          onClick={() => {
            setAppState({ type: "UNIT", payload: "F" });
          }}
        >
          °F
        </Control>
      </ControlWrapper>
    </Container>
  );
};

export { Header };

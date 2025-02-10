import React from "react";

import { StyledCard } from "./styled";
import { CardProps } from "./types";

const Card: React.FC<CardProps> = ({ children, centered = false }) => {
  return <StyledCard centered={centered}>{children}</StyledCard>;
};

export { Card };

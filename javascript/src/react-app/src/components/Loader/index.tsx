import React from "react";

import { LoaderShimmer } from "./styled";

interface LoaderProps extends React.PropsWithChildren<unknown> {
  width: string;
  height: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ height, width, text }) => {
  return (
    <LoaderShimmer height={height} width={width}>
      {text ?? ""}
    </LoaderShimmer>
  );
};

export { Loader };

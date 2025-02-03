import * as React from "react";
import { StyleSheetManager } from "styled-components";
import "./src/styles/global.css";
import "./src/styles/lantern.css";
import "./src/styles/fortune.css";

export const wrapRootElement = ({ element }) => {
  console.log('Client hydration started');
  return (
    <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith("$")}>
      {element}
    </StyleSheetManager>
  );
}
import * as React from "react";
import { StyleSheetManager } from "styled-components";

export const wrapRootElement = ({ element }) => (
  <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith("$")}>
    {element}
  </StyleSheetManager>
);

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/HoganBrush.woff"
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
      key="HoganBrushFont"
    />,
  ]);
  setHtmlAttributes({ lang: `en` });
};
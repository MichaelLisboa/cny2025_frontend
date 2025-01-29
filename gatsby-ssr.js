import * as React from "react";
import { StyleSheetManager, ServerStyleSheet } from "styled-components";

export const wrapRootElement = ({ element }) => (
  <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith("$")}>
    {element}
  </StyleSheetManager>
);

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` });

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
};

// 🛠 Ensure styled-components SSR works properly
export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
  const sheet = new ServerStyleSheet();

  try {
    const bodyHTML = sheet.collectStyles(bodyComponent);
    replaceBodyHTMLString(bodyHTML);
    setHeadComponents([sheet.getStyleElement()]);
  } catch (error) {
    console.error("SSR Error with styled-components:", error);
  } finally {
    sheet.seal();
  }
};
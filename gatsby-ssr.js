import * as React from "react";

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
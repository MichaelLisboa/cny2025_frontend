import * as React from "react";
import "./src/styles/global.css"
// ...existing code...
/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

// You can delete this file if you're not using it
import { StyleSheetManager } from "styled-components";

export const wrapRootElement = ({ element }) => (
  <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith("$")}>
    {element}
  </StyleSheetManager>
);
import * as React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout
    image="background-zodiac-sky.jpg"
    alignImage="top"
    scrollable={false}
  >
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage

export const Head = () => <SEO title="404: Not Found" />
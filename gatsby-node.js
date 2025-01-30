const fs = require("fs");
const path = require("path");

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/lantern\/[^/]+/)) {
    page.matchPath = "/lantern/:id"; // Tell Gatsby to match dynamic routes
    createPage(page);
  }
};

exports.onPostBuild = () => {
  const manifestPath = path.join(__dirname, "public", "manifest.webmanifest");

  // Read the generated manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  console.log("Updating manifest with screenshots and form_factor...");

  // Add screenshots with form_factor
  manifest.screenshots = [
    {
      src: "/alliance.png",
      sizes: "1080x2400",
      type: "image/png",
      form_factor: "narrow",
    },
    {
      src: "/result.png",
      sizes: "1080x2400",
      type: "image/png",
      form_factor: "narrow",
    },
    {
      src: "/home-wide.jpg",
      sizes: "1920x1080",
      type: "image/jpg",
      form_factor: "wide",
    },
  ];

  // Write back to the manifest file
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Manifest updated with screenshots and form_factor.");
};
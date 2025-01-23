module.exports = {
  siteMetadata: {
    title: 'Welcome to the Year of the Snake',
    description: 'The Snake symbolizes transformation and change.',
    image: '/icons/icon-512x512.png',
    siteUrl: 'https://cny2025.michaellisboa.com'
  },
  plugins: [
    'gatsby-plugin-styled-components',
    // "gatsby-plugin-google-gtag",
    'gatsby-plugin-layout',
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          globPatterns: ['**/*.{js,css,html,webp}'],
        },
      },
    },
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: `Wishes in the Sky`,
    //     short_name: `Wishes in the Sky`,
    //     start_url: `/`,
    //     background_color: `#AE504F`,
    //     theme_color: `#AE504F`,
    //     display: `standalone`,
    //     icon: `src/images/logo.png`,
    //   }
    // },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`], // Automatically generate images in multiple formats (e.g., WebP, JPEG).
          placeholder: `blurred`,    // Generate a blurred placeholder for lazy loading.
          quality: 80,               // Set the quality of images.
          breakpoints: [750, 1080, 1366, 1920, 2560, 3840], // Include 4K resolution, // Custom breakpoints for responsive images.
          backgroundColor: `transparent`, // Background color for images without transparency.
          webpOptions: {
            quality: 80, // Quality for WebP format.
          },
        },
      },
    },
    // {
    //   resolve: `gatsby-plugin-netlify`,
    //   options: {
    //     headers: {
    //       "/*.js": [
    //         "Content-Type: application/javascript",
    //       ],
    //     },
    //   },
    // },
    // {
    //   resolve: `gatsby-plugin-netlify`,
    //   options: {
    //     headers: {}, // option to add more headers. `Link` headers are transformed by the below criteria
    //     allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
    //     mergeSecurityHeaders: true, // boolean to turn off the default security headers
    //     mergeCachingHeaders: true, // boolean to turn off the default caching headers
    //     transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
    //     generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
    //   }
    // },
    "gatsby-transformer-sharp", {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    }]
};
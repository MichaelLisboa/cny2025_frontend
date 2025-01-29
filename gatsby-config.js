module.exports = {
  siteMetadata: {
    title: 'Welcome to the Year of the Snake',
    description: "The Snake symbolizes transformation and change. Share your new year's wish to the sky and join us in welcoming in the Year of the Snake.",
    image: '/og-meta.jpg',
    siteUrl: 'https://cny2025.michaellisboa.com'
  },
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-WS2KRK4L6B", // Google Analytics / GA
        ],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout.js`),
      },
    },
    "gatsby-plugin-image",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `Wishes in the Sky`,
        short_name: `Wishes in the Sky`,
        start_url: `/?utm_source=CNY2025_app&utm_medium=app&utm_campaign=CNY2025_app`,
        background_color: `#052352`,
        theme_color: `#052352`,
        display: `standalone`,
        description: "Share your new year's wish to the sky and join us in welcoming the Year of the Snake.",
        orientation: "portrait-primary",
        icon: `./static/web-app-manifest-512x512.png`,
        icons: [
          {
            "src": "/web-app-manifest-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any"
          },{
            "src": "/web-app-manifest-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          },
        ],
      }
    },
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
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          globPatterns: ['**/*.{js,css,html,webp,map,png,svg}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set to 5 MB
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

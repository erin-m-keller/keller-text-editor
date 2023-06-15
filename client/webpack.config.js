// initialize variables
const path = require('path'),
      { InjectManifest } = require('workbox-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = () => {
  return {
    // set the mode to development
    mode: 'development',
    // the entry points
    entry: {
      // the entry point for the main bundle
      main: './src/js/index.js',
      // the entry point for the install bundle
      install: './src/js/install.js'
    },
    // configure the output
    output: {
      // the filename for the bundled JavaScript file using the entry point name
      filename: '[name].bundle.js',
      // the output path for the bundled JavaScript file
      path: path.resolve(__dirname, 'dist'),
    },
    // configure the plugins
    plugins: [
      // generate HTML files
      new HtmlWebpackPlugin({
        // the template HTML file
        template: './index.html',
        // the title of the HTML page
        title: 'PWA Text Editor'
      }),
      // generate PWA manifest file
      new WebpackPwaManifest({
        // disable fingerprints in manifest file names
        fingerprints: false,
        // inject the manifest into the HTML file
        inject: true,
        // the name of the PWA
        name: 'Just Another Text Editor',
        // the short name of the PWA
        short_name: 'J.A.T.E',
        // the description of the PWA
        description: 'Takes notes with JavaScript syntax highlighting!',
        // the background color of the PWA
        background_color: '#6A66A3',
        // the theme color of the PWA
        theme_color: '#6A66A3',
        // the start URL of the PWA
        start_url: '/',
        // the public path of the PWA
        publicPath: '/',
        // the icons for the PWA
        icons: [
          {
            // the source path of the icon
            src: path.resolve('src/images/logo.png'),
            // the sizes of the icon
            sizes: [96, 128, 192, 256, 384, 512],
            // the destination path for the icon
            destination: path.join('src', 'images'),
          },
        ],
      }),
      // injects a service worker into the output
      new InjectManifest({
        // the path to the service worker source file
        swSrc: './sw.js',
        // the destination filename for the injected service worker
        swDest: 'sw.js',
      }),
    ],
    // configure the module rules
    module: {
      rules: [
        // process CSS files
        {
          // test for files with .css extension
          test: /\.css$/i,
          // use style-loader to inject CSS into the DOM and css-loader to handle CSS imports
          use: ['style-loader', 'css-loader'],
        },
        // transpile JavaScript files
        {
          // test for files with .js or .mjs extension
          test: /\.m?js$/,
          // exclude the 'node_modules' directory from the transpilation process
          exclude: /node_modules/,
          // use babel-loader to transpile JavaScript code
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // use @babel/preset-env for transpiling based on target environments
              plugins: [
                '@babel/plugin-proposal-object-rest-spread', // enable support for object spread syntax
                '@babel/transform-runtime', // transform references to helpers and built-ins into imports
              ],
            },
          },
        },
      ],
    },
  };
};
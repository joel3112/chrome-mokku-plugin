const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    options: path.join(__dirname, `${srcDir}options.ts`),
    background: path.join(__dirname, `${srcDir}background.ts`),
    content_script: path.join(__dirname, `${srcDir}content_script.ts`),
    devtool: path.join(__dirname, `${srcDir}devtool.ts`),
    panel: path.join(__dirname, `${srcDir}panel/index.tsx`),
    inject: path.join(__dirname, `${srcDir}inject.ts`),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  // optimization: {
  //   splitChunks: {
  //     name: "vendor",
  //     chunks: "initial",
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ttf)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@mokku/types": path.resolve(__dirname, `${srcDir}types`),
      "@mokku/services": path.resolve(__dirname, `${srcDir}services`),
      "@mokku/store": path.resolve(__dirname, `${srcDir}panel/App/store`),
    },
  },
  plugins: [new CopyPlugin([{ from: ".", to: "../" }], { context: "public" })],
};

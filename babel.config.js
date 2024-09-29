module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // Importing path
          path: ".env", // Path to .env
        },
      ],
    ],
  };
};

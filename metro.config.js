const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("glb"); 
config.resolver.sourceExts.push("cjs", "svg"); 

config.watchFolders = [
  path.resolve(__dirname, "src"),
];

module.exports = withNativeWind(config, { input: "./src/global.css" });

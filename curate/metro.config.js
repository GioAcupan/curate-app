const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// expo-sqlite web support requires .wasm assets
config.resolver.assetExts = [...(config.resolver.assetExts || []), "wasm"];

module.exports = withNativeWind(config, { input: "./global.css" });

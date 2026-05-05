# Quick Task: Fix java.lang.String cannot be cast to java.lang.Boolean

## Description
App crashes on load with Android error: `java.lang.String cannot be cast to java.lang.Boolean`. Root cause: missing `babel.config.js` with NativeWind plugin, causing className props to pass through untransformed to the native bridge.

## Diagnosis
1. No `babel.config.js` in project root — NativeWind v4 requires `nativewind/babel` plugin
2. Missing babel config means className props aren't transformed, potentially causing type mismatches across the React Native native bridge on Android

## Fix
1. Create `curate/babel.config.js` with `babel-preset-expo` and `nativewind/babel` plugin
2. Update `curate/metro.config.js` to use `withNativeWind` for CSS support

## Files to modify
- `curate/babel.config.js` — CREATE
- `curate/metro.config.js` — UPDATE

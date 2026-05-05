---
status: complete
fixed: "java.lang.String cannot be cast to java.lang.Boolean" crash on Android
---

## Changes
- Created `curate/babel.config.js` — added `babel-preset-expo` with `nativewind` JSX import source and `nativewind/babel` plugin
- Updated `curate/metro.config.js` — enabled CSS support via `isCSSEnabled: true`

## Root cause
Missing `babel.config.js` meant NativeWind className props weren't transformed by the `nativewind/babel` plugin, passing raw strings through the React Native native bridge on Android and causing a Java ClassCastException.

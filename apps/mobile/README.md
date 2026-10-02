# BharatYatra Android app

This is the React Native Community CLI Android project using JavaScript. It uses the standard Gradle/native scaffold and no Expo. Shared API access will use `@bharatyatra/api-client`; saved trips remain device-local in the initial version.

## Run

From the monorepo root, install npm dependencies, install Android Studio and a compatible JDK, install an Android SDK platform/build tools, and start an emulator or attach a device. Then run:

```sh
npm run dev:mobile
```

The generated React Native 0.87.1 template expects Node.js 22.11 or newer. Android SDK/JDK availability should be checked with `adb devices` and `java -version`. No signing key or Firebase configuration is included.

import type { CapacitorConfig } from "@capacitor/cli"

const SERVER_URL = process.env.CAP_SERVER_URL

const config: CapacitorConfig = {
  appId: "fr.lasso.app",
  appName: "Lasso",
  webDir: "www",
  backgroundColor: "#F3EDE2",
  server: SERVER_URL
    ? {
        url: SERVER_URL,
        cleartext: SERVER_URL.startsWith("http://"),
        androidScheme: SERVER_URL.startsWith("https://") ? "https" : "http",
      }
    : undefined,
  ios: {
    contentInset: "automatic",
    limitsNavigationsToAppBoundDomains: false,
    preferredContentMode: "mobile",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== "production",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#F3EDE2",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashImmersive: false,
    },
    StatusBar: {
      style: "DEFAULT",
      backgroundColor: "#F3EDE2",
      overlaysWebView: false,
    },
  },
}

export default config

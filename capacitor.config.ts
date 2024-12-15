import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "ionic-dendrologic",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    },
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
    Keyboard: {
      resize: KeyboardResize.None,
    },
  },
};

export default config;

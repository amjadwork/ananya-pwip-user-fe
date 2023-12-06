import { useEffect } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "../styles/globals.css";
import { OverlayProvider } from "@/context/OverlayContext";

function MyPWIPApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={session}>
          <OverlayProvider>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
              />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
              />

              <meta name="theme-color" content="#FFFFFF" />
              <link rel="manifest" href="/manifest.json" />

              <link
                href="/assets/splash/iphone5_splash.png"
                media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/iphone6_splash.png"
                media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/iphoneplus_splash.png"
                media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/iphonex_splash.png"
                media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/iphonexr_splash.png"
                media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/iphonexsmax_splash.png"
                media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/ipad_splash.png"
                media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/ipadpro1_splash.png"
                media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/ipadpro3_splash.png"
                media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              <link
                href="/assets/splash/ipadpro2_splash.png"
                media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
                rel="apple-touch-startup-image"
              />
              {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <Component {...pageProps} />
          </OverlayProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyPWIPApp;

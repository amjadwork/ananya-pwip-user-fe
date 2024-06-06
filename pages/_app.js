import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { Provider, useSelector } from "react-redux";
import { hotjar } from "react-hotjar";
import Frame from "react-frame-component";

import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "../styles/globals.css";
import { OverlayProvider } from "@/context/OverlayContext";

function DesktopWarning() {
  const userDetails = useSelector((state) => state.auth.user);

  return (
    <div className="h-full w-full">
      <img
        className="h-16 w-16 rounded-md"
        src="https://pwip-app-production-s3-storage.blr1.digitaloceanspaces.com/ec.assets/icon-512x512.png"
      />
      <h1 className="mt-4 text-2xl font-bold text-pwip-black-600">
        Hey! {userDetails?.name}
      </h1>
      <span className="text-pwip-v2-primary-600 text-md">
        {userDetails?.email || userDetails?.phone}
      </span>
      <h3 className="mt-4 text-pwip-gray-900 text-md">
        For the best experience, we encourage you to access
        <br />
        the app from your smartphone (Windows, Android, iOS). <br />
        Go to{" "}
        <a className="text-pwip-v2-primary-500" href="https://app.pwip.co/">
          app.pwip.co
        </a>{" "}
        on your mobile device.
      </h3>

      <p className="mt-8 text-pwip-gray-800 text-sm">
        <strong>Note</strong>: We are not available on the desktop, you can use
        the app from the mobile
      </p>
    </div>
  );
}

function InitializeAnalytics() {
  const userDetails = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (userDetails?._id) {
      // Check if Hotjar has been initialized before calling its methods
      if (hotjar.initialized()) {
        hotjar.identify("USER_ID", { userProperty: `${userDetails?._id}` });
      }
    }
  }, [userDetails?._id]);

  return (
    <>
      {/* google analytics */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-MC3H87LJ8J`}
      />

      <Script id="" strategy="lazyOnload">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-MC3H87LJ8J');
          `}
      </Script>

      {/* google tag manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PSZLRSLG');
              `}
      </Script>
    </>
  );
}

function MyPWIPApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if (
      (typeof window !== "undefined" &&
        window?.location?.origin === "https://app.pwip.co/") ||
      (typeof window !== "undefined" &&
        window?.location?.origin === "https://app.pwip.co")
    ) {
      const options = {
        id: 3801647, // Replace with your actual Hotjar site ID
        sv: 6, // Optional: Specify the snippet version if needed
        debug: false, // Disable debug mode by default
      };

      hotjar.initialize(options);
    }
  }, []);

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

              {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <InitializeAnalytics />

            <div className="relative w-full h-full grid grid-cols-2 gap-8 px-[72px] z-[110] max-xl:hidden bg-white overflow-hidden">
              <div className="h-full w-full mt-[30%] pl-12">
                <DesktopWarning />
              </div>
              <div className="relative h-screen w-[380px] max-w-[380px] min-w-[380px] overflow-hidden flex justify-center items-center bg-white">
                {/* <img
                  src="/assets/images/iphone-mockup.svg"
                  className="h-[820px] absolute z-[150] w-[380px]"
                /> */}

                {/* <Frame
                  className="h-[95%] max-h-[768px] w-[95%] rounded-[3.25rem] relative z-[160]"
                  initialContent="<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='stylesheet' href='https://pwip-app-production-s3-storage.blr1.digitaloceanspaces.com/ec.assets/tailwind.css'><style>@tailwind base;@tailwind components;@tailwind utilities;@font-face {font-family: 'Gilroy';src: url('/assets/font/Gilroy/Gilroy-Regular.ttf') format('truetype'),url('/assets/font/Gilroy/Gilroy-Regular.woff') format('woff');font-weight: normal;font-style: normal;}@font-face {font-family: 'Gilroy';src: url('/assets/font/Gilroy/Gilroy-Bold.woff') format('woff'),url('/assets/font/Gilroy/Gilroy-Bold.ttf') format('truetype');font-weight: bold;font-style: normal;}@font-face {font-family: 'DM-Sans';src: url('/assets/font/DMSans/DMSans-Regular.ttf') format('truetype');font-weight: normal;font-style: normal;}@font-face {font-family: 'DM-Sans';src: url('/assets/font/DMSans/DMSans-Bold.ttf') format('truetype');font-weight: bold;font-style: normal;}@font-face {font-family: 'DM-Sans';src: url('/assets/font/DMSans/DMSans-Italic.ttf') format('truetype');font-weight: normal;font-style: italic;}body {margin: env(safe-area-inset-top) 0 0 0;}body {margin-top: constant(safe-area-inset-top);padding-bottom: constant(safe-area-inset-bottom);}html,body {padding: 0;margin: 0;font-family: 'Gilroy';}a {color: inherit;text-decoration: none;}* {box-sizing: border-box;font-family: 'Gilroy';}body {scrollbar-width: none;}body {-ms-overflow-style: none;}body::-webkit-scrollbar {display: none;}.hide-scroll-bar {-ms-overflow-style: none;scrollbar-width: none;}.hide-scroll-bar::-webkit-scrollbar {display: none;}[data-rsbs-backdrop] {z-index: 20 !important;}[data-rsbs-overlay] {z-index: 25 !important;}.slick-dots {bottom: -32px !important;}.slick-dots li {margin: 0;margin-right: 5px;width: auto;}.react-player__preview {pointer-events: none;}</style></head><body><div></div></body></html>"
                >
                  <Component {...pageProps} />
                </Frame> */}
              </div>
            </div>

            <div className="xl:hidden">
              <Component {...pageProps} />
            </div>
          </OverlayProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyPWIPApp;

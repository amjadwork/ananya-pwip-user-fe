import { useEffect } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { hotjar } from "react-hotjar";

import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "../styles/globals.css";
import { OverlayProvider } from "@/context/OverlayContext";

function MyPWIPApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    hotjar.initialize("3801647", 6);
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
            <Component {...pageProps} />
          </OverlayProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyPWIPApp;

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
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
              />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content="black-translucent"
              />
              <meta name="theme-color" content="#005F81" />
            </Head>
            <Component {...pageProps} />
          </OverlayProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyPWIPApp;

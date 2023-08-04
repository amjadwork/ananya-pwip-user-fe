import Head from "next/head";

import "../styles/globals.css";
import { OverlayProvider } from "@/context/OverlayContext";

function MyPWIPApp({ Component, pageProps }) {
  return (
    <OverlayProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1; viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="theme-color" content="#005F81" />
      </Head>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}

export default MyPWIPApp;

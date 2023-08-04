import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";

// Import Containers
import SelectVariantContainer from "@/containers/ec/SelectVariant";
// Import Layouts

export default function ExportCosting() {
  const router = useRouter();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>Export Costing by pwip</title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Header />

        <SelectVariantContainer roundedTop={true} />
      </AppLayout>
    </React.Fragment>
  );
}

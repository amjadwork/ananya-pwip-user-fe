import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";

// Import Containers

// Import Layouts

function Dashboard() {
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

        <title>Export Costing by pwip</title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*<meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Header />

        <div
          className={`relative top-[72px] h-full w-full bg-white z-10 py-6 px-5`}
        >
          {/*  */}
        </div>
        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Dashboard);

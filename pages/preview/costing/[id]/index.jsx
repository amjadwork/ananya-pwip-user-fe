import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import CostingOverviewContainer from "@/containers/ec/CostingContainer";

// import axios from "axios";

function CostingPreview() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (router && !session?.accessToken) {
      sessionStorage.setItem("previewURL", router.asPath);
    }

    if (session?.accessToken) {
      sessionStorage.removeItem("previewURL");
    }
  }, [router, session]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Costing preview | PWIP</title>

        <meta name="PWIP Exports" content="PWIP Exports" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*<meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <AppLayout>
        <CostingOverviewContainer />
      </AppLayout>
    </React.Fragment>
  );
}

export default CostingPreview;

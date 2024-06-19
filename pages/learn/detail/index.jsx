import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";

// Import Containers
import LearnVideoDetailContainer from "@/containers/ec/LearnVideoDetail";

import { riceAndBagsIcon, underConstruction } from "../../../theme/icon";
// Import Layouts

function LearnDetail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

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
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Course | PWIP</title>

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

        <meta name="theme-color" content="#1B1B1B" />

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <AppLayout>
        {/* <Header /> */}

        <LearnVideoDetailContainer />

        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(LearnDetail);

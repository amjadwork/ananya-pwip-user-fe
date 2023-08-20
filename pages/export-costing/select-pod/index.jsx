import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import { fetchDestinationRequest } from "@/redux/actions/location.actions";

// Import Components
import { Header } from "@/components/Header";

// Import Containers
import SelectLocationContainer from "@/containers/ec/SelectLocation";
// Import Layouts

function SelectPortOfDestination() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCosting = useSelector((state) => state.costing);

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  React.useEffect(() => {
    if (!selectedCosting.product) {
      router.replace("/export-costing");
    }
  }, [selectedCosting]);

  React.useEffect(() => {
    dispatch(fetchDestinationRequest());

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

        <SelectLocationContainer
          roundedTop={true}
          title="Select Port of Destination"
          showSelectedVariant={true}
        />
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(SelectPortOfDestination);

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsRequest } from "../../redux/actions/products.actions";

import withAuth from "@/hoc/withAuth";

import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";

// Import Containers
import SelectVariantContainer from "@/containers/ec/SelectVariant";
// Import Layouts

function Category() {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const filterForCategory = useSelector((state) => state.category.category);

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  async function getProductList() {
    try {
      dispatch(fetchProductsRequest());
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (token) {
      getProductList();
    }
  }, [token]);

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

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <AppLayout>
        <Header
          backgroundColor={
            filterForCategory?.productCategory?.color
              ? `bg-[${filterForCategory?.productCategory?.color}]`
              : "bg-white"
          }
        />

        <SelectVariantContainer roundedTop={true} isFromCategory={true} />
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Category);

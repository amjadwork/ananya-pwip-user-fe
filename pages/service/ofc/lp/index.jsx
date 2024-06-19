/** @format */

import React, { useEffect, useCallback, useLayoutEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { ofcServiceId } from "@/utils/helper";

import { ofcLpFeatures } from "@/constants/ofcLP.constants";
import LandingPage from "@/containers/lp";

// function calculatePercentage(value, total) {
//   if (typeof value !== "number" || typeof total !== "number") {
//     console.error("Invalid input. Please provide valid numeric values");
//   }

//   const percentage = (value / total) * 100;
//   return percentage;
// }

// function filterArrayByReference(originalArray, referenceArray) {
//   // Filter the array based on the condition
//   const newArray = originalArray.filter((item) => {
//     // Check if any ID in the applicable_services array is present in the reference array
//     return item.applicable_services?.some((id) => referenceArray.includes(id));
//   });

//   return newArray;
// }

// function getObjectWithLatestDate(dataArray) {
//   if (!Array.isArray(dataArray) || dataArray.length === 0) {
//     // Return null or handle the case where the array is empty or not valid
//     return null;
//   }

//   // Sort the array based on the 'amount_paid_date' in descending order
//   const sortedArray = dataArray.sort(
//     (a, b) => new Date(b.amount_paid_date) - new Date(a.amount_paid_date)
//   );

//   // Return the first (i.e., the latest) object in the sorted array
//   return sortedArray[0];
// }

const SERVICE_ID = Number(ofcServiceId);

function lp() {
  const plansData = useSelector((state) => state.subscription?.plans);

  const videoUrl = "https://www.youtube.com/embed/Tb4GGo2_QFM";

  const [pickYourPlan, setPickYourPlan] = React.useState([]);

  useEffect(() => {
    if (plansData) {
      // Sort plansData array so that Premium plan comes first
      const sortedPlansData = [...plansData].sort((a, b) => {
        if (a.name.toLowerCase() === "premium") return -1;
        if (b.name.toLowerCase() === "premium") return 1;
        return 0;
      });
      setPickYourPlan(sortedPlansData);
    }
  }, [plansData]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>PWIP | OFC Service</title>

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
        <Header />

        <div className={`relative h-full w-full bg-white z-0`}>
          <div
            className={`min-h-[calc(100vh-120px)] inline-flex flex-col h-full w-full px-5 pt-[82px] pb-[120px] bg-white overflow-auto hide-scroll-bar`}
          >
            <LandingPage
              serviceName="ofc"
              SERVICE_ID={SERVICE_ID}
              title="Reduce your hassle for finding the OFC."
              titleImgSrc="/assets/images/services/lp/riceLP1.svg"
              pickYourPlan={pickYourPlan}
              features={ofcLpFeatures}
              videoContent={false}
            />
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(lp);

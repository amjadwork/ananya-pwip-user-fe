import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Lottie from "lottie-react";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  // fetchMyCostingRequest,
  fetchAllMyCostingsRequest,
  saveCostingFailure,
  fetchMyCostingFailure,
  saveCostingSuccess,
} from "@/redux/actions/myCosting.actions";
import { fetchGeneratedCostingFailure } from "@/redux/actions/costing.actions";
import { setTermsOfShipmentRequest } from "@/redux/actions/shipmentTerms.actions";

import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";

// Import Components
import { Header } from "@/components/Header";
import { inrToUsd } from "@/utils/helper";

import { homeIcon, downloadIcon } from "../../theme/icon";

import paymentSuccessful from "../../theme/lottie/payment-success.json";

// Import Containers

// Import Layouts

function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

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

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <AppLayout>
        <Header />

        <React.Fragment>
          <div className="w-full h-full relative bg-white px-5 pt-[56px]">
            <div className="w-full flex flex-col items-center">
              <div className="min-w-[310px] h-auto">
                <Lottie animationData={paymentSuccessful} />
              </div>
              <span className="text-center font-bold text-pwip-green-800 text-lg">
                Payment Successful
              </span>
            </div>

            <div className="inline-flex w-full h-full flex-col justify-between px-5 mt-12">
              <div className="flex justify-between py-2">
                <span className="text-sky-950 text-sm font-bold">
                  Transaction id
                </span>
                <span className="text-sky-950 text-sm font-bold">
                  6371569477
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-sky-950 text-sm font-medium">
                  Amount Paid
                </span>
                <span className="text-zinc-900 text-sm font-medium">₹1299</span>
              </div>
            </div>
          </div>
        </React.Fragment>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(PaymentSuccess);
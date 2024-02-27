/** @format */

import React, { useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react";

// import moment from "moment";
import { Button } from "@/components/Button";
import useRazorpay from "react-razorpay";
import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import SubscriptionCard from "@/components/SubscriptionCard";
import { subscriptionDetails } from "@/constants/subscriptionDetails";

import {
  getServicesRequest,
  getPlansRequest,
  // getSubscriptionRequest,
} from "@/redux/actions/subscription.action";

import {
  // fetchMyCostingRequest,
  fetchAllMyCostingsRequest,
  // saveCostingFailure,
} from "@/redux/actions/myCosting.actions";

// Import Components
import { Header } from "@/components/Header";
import axios from "axios";
import { apiBaseURL, razorpayKey } from "@/utils/helper";

import paymentSuccessful from "../../theme/lottie/payment-success.json";
import moment from "moment";
import { apiStagePaymentBeUrl, exportCostingServiceId } from "utils/helper";
import { filterIcon } from "../../theme/icon";

// Import Containers

// Import Layouts

function calculatePercentage(value, total) {
  if (typeof value !== "number" || typeof total !== "number") {
    console.error("Invalid input. Please provide valid numeric values");
  }

  const percentage = (value / total) * 100;
  return percentage;
}

const cardBacgroundColors = ["bg-pwip-v2-primary-200", "bg-pwip-v2-green-300"];

function filterArrayByReference(originalArray, referenceArray) {
  // Filter the array based on the condition
  const newArray = originalArray.filter((item) => {
    // Check if any ID in the applicable_services array is present in the reference array
    return item.applicable_services?.some((id) => referenceArray.includes(id));
  });

  return newArray;
}

function getObjectWithLatestDate(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    // Return null or handle the case where the array is empty or not valid
    return null;
  }

  // Sort the array based on the 'amount_paid_date' in descending order
  const sortedArray = dataArray.sort(
    (a, b) => new Date(b.amount_paid_date) - new Date(a.amount_paid_date)
  );

  // Return the first (i.e., the latest) object in the sorted array
  return sortedArray[0];
}

function Subscription() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();

  const { openBottomSheet, openToastMessage } = useOverlayContext();

  const myCosting = useSelector((state) => state.myCosting);
  const servicesData = useSelector((state) => state.subscription?.services);
  const plansData = useSelector((state) => state.subscription?.plans);

  const userDetails = useSelector((state) => state.auth?.user);
  const authToken = useSelector((state) => state.auth?.token);

  const [allMyCostingsData, setAllMyCostingsData] = React.useState([]);
  const [modulePlansData, setModulePlansData] = React.useState([]);
  const [moduleServicesData, setModuleServicesData] = React.useState([]);
  const [usersSubscriptionData, setUsersSubscriptionData] =
    React.useState(null);

  const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;
  const SERVICE_ID = Number(exportCostingServiceId); // should be Number
 

  React.useEffect(() => {
    dispatch(fetchAllMyCostingsRequest());
  }, []);

  React.useEffect(() => {
    if (
      myCosting?.allMyCostingsFromHistory &&
      myCosting?.allMyCostingsFromHistory?.length
    ) {
      setAllMyCostingsData([...myCosting.allMyCostingsFromHistory]);
    }
  }, [myCosting]);

  React.useEffect(() => {
    dispatch(getServicesRequest());
  }, []);

  React.useEffect(() => {
    if (servicesData && servicesData.length) {
      setModuleServicesData([...servicesData]);
      dispatch(getPlansRequest());
    }
  }, [servicesData]);


  const checkUserSubscriptionDetails = async () => {
    try {
      const response = await axios.get(
        API_STAGE_PAYMENT_BE +
          "api" +
          "/user-subscription?serviceId=" +
          SERVICE_ID,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return err;
    }
  };

  function calculateDaysLeft(expiryDate) {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const differenceInTime = expiry.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }

  React.useEffect(() => {
    if (modulePlansData.length) {
      const getUsersSubscriptionDetails = async () => {
        const response = await checkUserSubscriptionDetails();
        if (typeof response === "object") {
          setUsersSubscriptionData(response);
        }

        if (response?.length) {
          setUsersSubscriptionData(response[0]);
        }
      };

      getUsersSubscriptionDetails();
    }
  }, [modulePlansData]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>Subscription | PWIP</title>

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

        <div className={`relative h-full w-full bg-white z-0`}>
          <div
            className={`min-h-[calc(100vh-120px)] inline-flex flex-col h-full w-full px-5 pt-[82px] pb-[120px] bg-white overflow-auto hide-scroll-bar`}
          >
            <div className="text-[#1B1B1B] text-sm font-normal mb-[6px] flex justify-between">
              <span>All Subscriptions</span>
              {filterIcon}
            </div>

            <React.Fragment>
              {subscriptionDetails.map((subscription, index) => {
                const { name, type, validity, expiry } = subscription;
                let subscriptionValidity;
                if (validity === "Lifetime Access") {
                  subscriptionValidity = validity;
                } else {
                  const daysLeft = calculateDaysLeft(expiry);
                  subscriptionValidity =
                    daysLeft <= 10 ? (
                      <span className="text-red-500">{`Expires in ${daysLeft} days`}</span>
                    ) : (
                      `Expires on ${expiry}`
                    );
                }
                return (
                  <div key={index}>
                    <SubscriptionCard
                      subscriptionName={name}
                      subscriptionType={type}
                      subscriptionValidity={subscriptionValidity}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          </div>
        </div>
        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Subscription);

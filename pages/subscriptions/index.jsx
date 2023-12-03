import React, { useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
// import moment from "moment";
import { Button } from "@/components/Button";
import useRazorpay from "react-razorpay";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  getServicesRequest,
  getPlansRequest,
  getSubscriptionRequest,
} from "@/redux/actions/subscription.action";

import {
  // fetchMyCostingRequest,
  fetchAllMyCostingsRequest,
  // saveCostingFailure,
} from "@/redux/actions/myCosting.actions";

// Import Components
import { Header } from "@/components/Header";
// import { inrToUsd } from "@/utils/helper";

// Import Containers

// Import Layouts

function calculatePercentage(value, total) {
  if (typeof value !== "number" || typeof total !== "number" || total === 0) {
    throw new Error(
      "Invalid input. Please provide valid numeric values, and ensure total is not zero."
    );
  }

  const percentage = (value / total) * 100;
  return percentage;
}

const cardBacgroundColors = ["bg-pwip-v2-primary-200", "bg-pwip-v2-green-300"];

function filterArrayByReference(originalArray, referenceArray) {
  // Filter the array based on the condition
  const newArray = originalArray.filter((item) => {
    // Check if any ID in the applicable_services array is present in the reference array
    return item.applicable_services.some((id) => referenceArray.includes(id));
  });

  return newArray;
}

function Subscription() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();

  const myCosting = useSelector((state) => state.myCosting);
  const servicesData = useSelector((state) => state.subscription?.services);
  const plansData = useSelector((state) => state.subscription?.plans);
  const userSubscription = useSelector(
    (state) => state.subscription?.userSubscription
  );
  const userDetails = useSelector((state) => state.auth?.user);

  const [allMyCostingsData, setAllMyCostingsData] = React.useState([]);
  const [modulePlansData, setModulePlansData] = React.useState([]);
  const [moduleServicesData, setModuleServicesData] = React.useState([]);
  const [usersSubscriptionData, setUsersSubscriptionData] =
    React.useState(null);

  // const [searchStringValue, setSearchStringValue] = React.useState("");

  const handlePayment = useCallback(
    async (price) => {
      // const order = await createOrder(params);
      // const options = {
      //   key: "rzp_live_SGjcr25rqb3FMM",
      //   amount: price,
      //   currency: "INR",
      //   name: "PWIP Foodtech Pvt Limited",
      //   description: "Test Transaction",
      //   image: "https://pwip.co/assets/web/img/web/logo.png",
      //   order_id: order.id,
      //   handler: (res) => {
      //     console.log(res);
      //   },
      //   prefill: {
      //     name: userDetails.name,
      //     email: userDetails.email,
      //     contact: userDetails.phone || "",
      //   },
      //   notes: {
      //     address:
      //       "PWIP FOODTECH PVT LTD WeWork, Vaishnavi Signature.78/9 Outer Ring Road, Bellandur Main Rd, Bengaluru, Karnataka 560103",
      //   },
      //   theme: {
      //     color: "#003559",
      //   },
      // };
      // const rzpay = new Razorpay(options);
      // rzpay.open();
    },
    [Razorpay]
  );

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

  React.useEffect(() => {
    if (plansData && moduleServicesData.length) {
      const servicesId = new Set(
        [...moduleServicesData].map((d) => d.id).flat()
      );
      const uniqueServicesId = [...servicesId];
      const plans = [
        ...filterArrayByReference(plansData, uniqueServicesId),
      ].filter((d) => d.active);

      setModulePlansData([...plans].reverse());
    }
  }, [plansData, moduleServicesData]);

  React.useEffect(() => {
    if (modulePlansData.length) {
      dispatch(getSubscriptionRequest());
    }
  }, [modulePlansData]);

  React.useEffect(() => {
    if (userDetails && userSubscription?.length && modulePlansData.length) {
      const planIds = modulePlansData.map((d) => d.id);

      const subs = [...userSubscription]
        .filter((d) => d.user_id === userDetails._id)
        .filter((d) => planIds.includes(d.plan_id));

      if (subs.length) {
        setUsersSubscriptionData(subs[0]);
      }
    }
  }, [userSubscription, userDetails, modulePlansData]);

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

        <div className={`relative h-full w-full bg-white z-0`}>
          <div
            className={`min-h-[calc(100vh-120px)] inline-flex flex-col h-full w-full px-5 pt-[82px] pb-[120px] bg-white overflow-auto hide-scroll-bar`}
          >
            <div className="text-pwip-v2-primary-600 text-base font-[800] mb-[6px]">
              <span>Current plan & usage</span>
            </div>

            <div className="px-3 py-5 bg-pwip-v2-gray-100 rounded-lg w-full h-auto mb-[30px]">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-v2-primary text-sm font-[700]">
                  {usersSubscriptionData
                    ? modulePlansData.find(
                        (d) => d.id === usersSubscriptionData?.plan_id
                      )?.name === "Basic"
                      ? "Basic"
                      : "Premium"
                    : "Free plan"}
                </span>

                <div className="inline-flex items-center space-x-[2px]">
                  <span className="text-pwip-v2-primary-700 text-sm font-[600]">
                    {allMyCostingsData?.length}
                  </span>
                  <span className="text-pwip-black-600 text-sm font-[600]">
                    /
                    {usersSubscriptionData
                      ? modulePlansData.find(
                          (d) => d.id === usersSubscriptionData?.plan_id
                        )?.name === "Premium"
                        ? "Unlimited"
                        : 500
                      : 10}
                  </span>
                </div>
              </div>
              <div className="w-full bg-pwip-v2-gray-300 rounded-full h-[8px] mb-[10px] mt-[6px] overflow-hidden">
                <div
                  className="h-[8px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #006EB4 4.17%, #003559 104.92%)",
                    width:
                      usersSubscriptionData &&
                      modulePlansData.find(
                        (d) => d.id === usersSubscriptionData?.plan_id
                      )?.name === "Basic"
                        ? calculatePercentage(
                            allMyCostingsData.length || 0,
                            500
                          )
                        : usersSubscriptionData &&
                          modulePlansData.find(
                            (d) => d.id === usersSubscriptionData?.plan_id
                          )?.name === "Premiun"
                        ? 0
                        : calculatePercentage(
                            allMyCostingsData.length || 0,
                            10
                          ),
                  }}
                ></div>
              </div>
              <span className="text-pwip-v2-primary text-sm font-[500]">
                {allMyCostingsData?.length >= 500 &&
                usersSubscriptionData &&
                modulePlansData.find(
                  (d) => d.id === usersSubscriptionData?.plan_id
                )?.name === "Basic"
                  ? "Your basic plan has exhausted !!!"
                  : usersSubscriptionData &&
                    modulePlansData.find(
                      (d) => d.id === usersSubscriptionData?.plan_id
                    )?.name === "Premium"
                  ? "Enjoy and generate unlimited costings"
                  : usersSubscriptionData &&
                    modulePlansData.find(
                      (d) => d.id === usersSubscriptionData?.plan_id
                    )?.name !== "Premium" &&
                    usersSubscriptionData &&
                    modulePlansData.find(
                      (d) => d.id === usersSubscriptionData?.plan_id
                    )?.name !== "Basic" &&
                    allMyCostingsData?.length >= 10
                  ? "Your free plan has exhausted !!!"
                  : "Upgrade to premium to get unlimited costings"}
              </span>
            </div>

            <div className="w-full">
              <div className="flex overflow-x-scroll hide-scroll-bar mb-[28px]">
                <div className="flex flex-nowrap">
                  {modulePlansData.map((details, index) => {
                    return (
                      <div
                        key={details?.name + "_" + index}
                        className={`min-w-[320px] inline-block px-[12px] py-[18px]  ${cardBacgroundColors[index]} rounded-lg mr-[12px]`}
                      >
                        <div className="overflow-hidden w-auto h-auto inline-flex flex-col items-center space-y-[18px] mb-[30px]">
                          <span className="text-base text-center text-pwip-v2-black-600 font-[700] line-clamp-1 capitalize">
                            {details?.name}
                          </span>

                          <span className="text-sm text-pwip-v2-gray-800 font-[400] text-center">
                            {details?.description}
                          </span>
                        </div>

                        <Button
                          type={"white"}
                          label={`₹${details?.price} /mo`}
                          rounded="!rounded-full"
                          minHeight="!min-h-[35px]"
                          onClick={async () => {
                            handlePayment(details?.price);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <React.Fragment>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-pwip-v2-primary">
                  <thead className="text-sm text-pwip-v2-primary font-[700]">
                    <tr>
                      <th
                        scope="col"
                        className="pr-6 py-3 text-left whitespace-nowrap"
                      >
                        What you get :
                      </th>
                      <th scope="col" className="pr-6 py-3 text-center">
                        Premium
                      </th>
                      <th scope="col" className="pr-6 py-3 text-center">
                        Basic
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <th
                        scope="row"
                        className="pr-6 py-3 font-medium text-gray-900"
                      >
                        <div className="max-w-[80%]">Costings</div>
                      </th>
                      <td className="pr-6 py-3 text-center">Unlimited</td>
                      <td className="pr-6 py-3 text-center">250</td>
                    </tr>
                    <tr className="bg-white">
                      <th
                        scope="row"
                        className="pr-6 py-3 font-medium text-gray-900"
                      >
                        <div className="max-w-[80%]">Access to community</div>
                      </th>
                      <td className="pr-6 py-3">
                        <div className="w-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M5 7.5L6.5 9L9 5.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z"
                              stroke="#006EB4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="pr-6 py-3">{/*  */}</td>
                    </tr>
                    <tr className="bg-white ">
                      <th
                        scope="row"
                        className="pr-6 py-3 font-medium text-gray-900"
                      >
                        <div className="w-[80%]">24/7 customer support</div>
                      </th>
                      <td className="pr-6 py-3">
                        <div className="w-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M5 7.5L6.5 9L9 5.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z"
                              stroke="#006EB4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="pr-6 py-3">
                        <div className="w-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M5 7.5L6.5 9L9 5.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z"
                              stroke="#006EB4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          </div>
        </div>
        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Subscription);

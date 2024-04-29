import React, { useEffect, useLayoutEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import useRazorpay from "react-razorpay";

import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});
import { Button } from "@/components/Button";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import {
  ricePriceServiceId,
  exportCostingServiceId,
  checkSubscription,
  ofcServiceId,
  pwipPrimePlanId,
  getUniqueObjectsBySourceId,
} from "@/utils/helper";
import {
  popularSourceLocationData,
  popularDestinationData,
  riceCategory,
} from "@/constants/home.constants";
import {
  fetchCategoryRequest,
  // fetchCategoryFailure,
} from "@/redux/actions/category.actions";
import { useOverlayContext } from "@/context/OverlayContext";

import {
  // exportCostingIcon,
  // ricePriceServiceIcon,
  // exportOrdersServiceIcon,
  // labsServiceIcon,
  // networkServiceIcon,
  // communityProductIcon,
  infoIcon,
  arrowLongRightIcon,
} from "../../theme/icon";

// Import Components
import { Header } from "@/components/Header";
import axios from "axios";
import {
  apiBaseURL,
  apiStagePaymentBeUrl,
  formatNumberWithCommas,
  pwipPrimeServiceId,
  razorpayKey,
} from "utils/helper";

import Lottie from "lottie-react";
import paymentSuccessful from "../../theme/lottie/payment-success.json";

const { flag } = require("country-emoji");

const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;

// Import Containers

// Import Layouts

function PWIPPrimeLP({ authToken, getUsersSubscriptionDetails }) {
  const [Razorpay] = useRazorpay();
  const router = useRouter();

  const { openBottomSheet, closeBottomSheet, openToastMessage } =
    useOverlayContext();

  const userDetails = useSelector((state) => state.auth?.user);

  const SERVICE_ID = Number(pwipPrimeServiceId);

  const createOrder = async (planid) => {
    try {
      const response = await axios.post(
        API_STAGE_PAYMENT_BE + "api" + "/create-order",
        {
          plan_id: planid,
          service_id: pwipPrimeServiceId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response?.data;
    } catch (err) {
      return err;
    }
  };

  const verifyPayment = async (body) => {
    try {
      const response = await axios.post(
        API_STAGE_PAYMENT_BE + "api" + "/verify-pay",
        body,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response?.data;
    } catch (err) {
      return err;
    }
  };

  const handlePayment = useCallback(
    async (item) => {
      const orderResponse = await createOrder(item?.id, userDetails?._id);

      try {
        if (orderResponse.rz_order?.order_id) {
          const options = {
            // key: "rzp_live_SGjcr25rqb3FMM", //"rzp_test_aw3ZNIR1FCxuQl",
            key: razorpayKey,
            currency: "INR",
            name: "PWIP Foodtech Pvt Limited",
            description: "Your export partners",
            image: "https://pwip.co/assets/web/img/web/logo.png",
            order_id: orderResponse.rz_order?.order_id,
            handler: async (res) => {
              const paymentVerifyPayload = {
                ...res,
                planId: item?.id,
                serviceId: SERVICE_ID,
              };
              const responseVerify = await verifyPayment(paymentVerifyPayload);

              // const details = await checkSubscription(SERVICE_ID, authToken);

              // if (details?.activeSubscription) {
              //   closeBottomSheet();
              //   router.replace(`/home`);
              // }

              await getUsersSubscriptionDetails();

              if (responseVerify?.result === "Payment Success") {
                const content = (
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
                          {res?.razorpay_payment_id}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sky-950 text-sm font-medium">
                          Amount Paid
                        </span>
                        <span className="text-zinc-900 text-sm font-medium">
                          ₹{Math.ceil(orderResponse?.rz_order?.amount / 100)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
                openBottomSheet(content, null, true);
              } else {
                openToastMessage({
                  type: "error",
                  message: "Payment failed, try again",
                  // autoHide: false,
                });
              }
            },
            prefill: {
              name: userDetails.name,
              email: userDetails.email,
              phone: userDetails.phone || "",
              contact: userDetails.phone || "",
            },
            notes: {
              address:
                "PWIP FOODTECH PVT LTD WeWork, Vaishnavi Signature.78/9 Outer Ring Road, Bellandur Main Rd, Bengaluru, Karnataka 560103",
            },
            theme: {
              color: "#003559",
            },
          };
          const rzpay = new Razorpay(options);
          rzpay.open();
        }
      } catch (err) {
        openToastMessage({
          type: "error",
          message: "Something went while creating your order, try again",
          // autoHide: false,
        });
        console.error(err);
      }
    },
    [Razorpay]
  );

  return (
    <div className="inline-flex flex-col w-full h-full px-5 pt-8 pb-[82px]">
      <div className="inline-flex flex-col w-full h-full space-y-3">
        <div className="inline-flex items-center justify-center space-x-3">
          <img
            className="h-[22px] w-[22px]"
            src="/assets/images/services/lp/diamond.png"
          />
          <h2 className="text-lg font-bold text-center">PWIP Prime</h2>
        </div>
        <p className="text-center text-xs text-pwip-black-600">
          PWIP Prime provides all services from today and the one that will come
          in future, all under one plan, discover a lot of possibilities in your
          export business with this.
        </p>
      </div>

      <div className="w-full my-10">
        <img
          className="w-full"
          src="/assets/images/services/lp/all-services.png"
        />
      </div>

      <div className="inline-flex flex-col w-full h-full space-y-3">
        <div className="inline-flex items-center justify-center space-x-3">
          <h2 className="text-lg text-center font-bold">
            All export related problems, <br />
            One solution
          </h2>
        </div>
      </div>

      <div className="w-full my-10">
        <img
          className="w-full"
          src="/assets/images/services/lp/price-compare.png"
        />
      </div>

      <div
        className={`container fixed bottom-[64px] left-0 right-0 bg-white p-2 px-5 pb-4 transition-transform`}
      >
        <div
          className=" bg-[#006EB4] text-white px-4 py-3 text-center font-medium text-[16px] rounded-lg"
          onClick={async () => {
            const plan = {
              id: pwipPrimePlanId,
              name: "PWIP Prime",
              description: "",
              validity: 30,
              validity_type: "days",
              refund_policy: 1,
              refund_policy_valid_day: 7,
              currency: "INR",
              applicable_for_users: [],
              applicable_services: [27, 30, 32, 35],
              price: 1499,
              show_for_user: 0,
              usage_cap: 0,
              createdAt: "2024-04-13T06:20:28.000Z",
              updatedAt: "2024-04-13T06:58:09.000Z",
              active: 1,
              deletedBy: null,
              is_free: 0,
              is_unlimited: 1,
              show_to_user: 0,
            };
            handlePayment(plan);
          }}
        >
          Pay ₹1,499 and subscribe
        </div>
      </div>
    </div>
  );
}

function transformData(inputArray) {
  const outputArray = [];
  const colorCodes = ["#165BAA", "#3988FF", "#6DC4FD"];

  inputArray.forEach((item) => {
    const label = item.HSN || item.label;
    const color = colorCodes[inputArray.findIndex((i) => i.HSN === item.HSN)];

    const dataToAdd = item.data.map(({ primary, secondary }) => ({
      primary,
      secondary,
    }));

    outputArray.push({ label, color, data: dataToAdd });
  });

  return outputArray;
}

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);

  const { openBottomSheet, openToastMessage, stopLoading, startLoading } =
    useOverlayContext();

  const [eximTrendsData, setEximTrendsData] = React.useState(null);
  const [showPrime, setShowPrime] = React.useState(false);
  // const [usersSubscriptionData, setUsersSubscriptionData] =
  //   React.useState(null);

  const checkUserSubscriptionDetails = async (planId) => {
    try {
      let endpoint = "/get-user-subscription";

      if (planId) {
        endpoint = "/get-user-subscription" + `?planId=${planId}`;
      }

      const response = await axios.get(apiBaseURL + "api" + endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  };

  const fetchEXIMTrend = async () => {
    try {
      // const response = await axios.get(
      //   apiBaseURL +
      //     "api" +
      //     "/service/rice-price/exim-trend?ToDate=01-04-2024&rangeInMonths=6",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authToken}`,
      //     },
      //   }
      // );

      const eximDataFromResponse = {
        totalVolume: 5337910.098269986,
        topDestination: { destination: "Dammam", qty: 414727.90800000005 },
        topHSN: { hsn: "10063020", qty: 2465851.543499979 },
        chart: [
          {
            label: "10062000",
            color: "#165BAA",
            data: [
              { primary: "Nov", secondary: 185.276 },
              { primary: "Feb", secondary: 67045.65400000001 },
              { primary: "Dec", secondary: 48163.305 },
              { primary: "Jan", secondary: 76400.76599999999 },
            ],
          },
          {
            label: "10063010",
            color: "#3988FF",
            data: [
              { primary: "Nov", secondary: 139959.3256 },
              { primary: "Feb", secondary: 844749.2024500016 },
              { primary: "Dec", secondary: 452178.91036999953 },
              { primary: "Jan", secondary: 910264.526809999 },
            ],
          },
          {
            label: "10063020",
            color: "#6DC4FD",
            data: [
              { primary: "Nov", secondary: 490625.61448400014 },
              { primary: "Feb", secondary: 681787.6215580027 },
              { primary: "Dec", secondary: 622079.0872000027 },
              { primary: "Jan", secondary: 671359.2202580011 },
            ],
          },
        ],
        units: "MTS",
      };

      let eximData = transformData(eximDataFromResponse?.chart);

      const eximTrends = {
        // ...response?.data,
        ...eximDataFromResponse,
        chart: eximData || [],
      };

      localStorage.setItem("eximTrends", JSON.stringify(eximTrends));

      setEximTrendsData(eximTrends);

      stopLoading();
    } catch (err) {
      console.error(err);
      stopLoading();
    }
  };

  useLayoutEffect(() => {
    if (authToken) {
      const eximTrends = localStorage.getItem("eximTrends");

      if (eximTrends) {
        setEximTrendsData(JSON.parse(eximTrends));
      } else {
        startLoading();
        fetchEXIMTrend();
      }
    }
  }, [authToken]);

  const getUsersSubscriptionDetails = async () => {
    const response = await checkUserSubscriptionDetails(pwipPrimePlanId);

    if (response?.status === 404) {
      setShowPrime(true);
    }

    if (response?.length) {
      setShowPrime(false);
    }
  };

  useLayoutEffect(() => {
    getUsersSubscriptionDetails();
  }, []);

  const primaryAxis = React.useMemo(
    () => ({
      position: "left",
      showGrid: true,
      invert: true,
      shouldNice: true,
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        position: "bottom",
        elementType: "bar",
        showGrid: true,
        shouldNice: true,
        getValue: (datum) => {
          return datum.secondary;
        },
        minDomainLength: 1.25,
        tickLabelRotationDeg: 0,
        tickCount: 3,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>My costing history | PWIP</title>

        <meta name="PWIP App" content="PWIP App" />
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

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-white-100 z-0 pb-[72px]`}
        >
          {/* <div
            className={`relative left-0 h-[auto] w-full bg-white z-0 py-6 px-5`}
          >
            <div
              style={{
                filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
              }}
              className="h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
            >
              <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.7"
                    d="M15.62 14.7062L12.0868 11.3939M13.9956 7.09167C13.9956 10.456 11.0864 13.1833 7.49778 13.1833C3.90915 13.1833 1 10.456 1 7.09167C1 3.72733 3.90915 1 7.49778 1C11.0864 1 13.9956 3.72733 13.9956 7.09167Z"
                    stroke="#878D96"
                    strokeWidth="1.52292"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                placeholder="Search for a rice variety"
                className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
                value={searchStringValue}
                onFocus={() => {
                  window.clearTimeout(blurOccurred);
                }}
                onBlur={(e) => {
                  // setSearchFocus(false);
                  // dispatch(searchScreenFailure());
                  blurOccurred = window.setTimeout(function () {
                    handleInputDoneClick(e);
                  }, 10);
                }}
                onChange={(event) => {
                  setSearchStringValue(event.target.value);
                  handleSearch(event.target.value);
                }}
              />
              {searchStringValue ? (
                <button
                  onClick={() => {
                    setSearchStringValue("");
                    handleSearch("");
                  }}
                  className="outline-none border-none bg-transparent inline-flex items-center justify-center"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4584 5.54199L5.54175 13.4587M5.54175 5.54199L13.4584 13.4587"
                      stroke="#686E6D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </div> */}
          <div
            className={`inline-flex flex-col h-full w-full px-5 bg-white pb-6 pt-5 hide-scroll-bar space-y-8`}
            // style={{
            //   paddingTop: mainContainerHeight + "px",
            //   paddingBottom: mainContainerHeight + 20 + "px",
            // }}
          >
            <div className="w-full grid grid-cols-3 gap-x-5 gap-y-8">
              {[
                {
                  name: "Export Costing",
                  icon: "/assets/images/home_main/export-costing.png",
                  url: "/export-costing/lp",
                  subscribedUrl: "/export-costing",
                  serviceId: Number(exportCostingServiceId),
                },
                {
                  name: "Rice prices",
                  icon: "/assets/images/home_main/rice-prices.png",
                  url: "/service/rice-price/lp",
                  subscribedUrl: "/service/rice-price",
                  serviceId: Number(ricePriceServiceId),
                },
                {
                  name: "Export orders",
                  comingSoon: true,
                  icon: "/assets/images/home_main/export-orders.png",
                  subscribedUrl: "/service/export-orders",
                },
                {
                  name: "OFC",
                  icon: "/assets/images/home_main/ofc.png",
                  subscribedUrl: "/service/ofc",
                  url: "/service/ofc/lp",
                  serviceId: Number(ofcServiceId),
                },
                {
                  name: "EXIM",
                  comingSoon: true,
                  icon: "/assets/images/home_main/exim.png",
                  url: "/service/exim",
                },
                {
                  name: "Community",
                  icon: "/assets/images/home_main/community.png",
                  url: "https://community.pwip.co/",
                },
              ].map((item, index) => {
                return (
                  <div
                    key={item?.name + "_" + index}
                    onClick={async () => {
                      sessionStorage.removeItem("backThroughServicePage");

                      if (item?.comingSoon) {
                        router.push("/waitlist?_s=" + item?.name);

                        return;
                      }

                      if (item.name.toLowerCase() === "community") {
                        window.open(item.url, "_blank");

                        return;
                      }

                      if (item?.serviceId) {
                        const subsRes = await checkSubscription(
                          item?.serviceId,
                          authToken
                        );

                        if (!subsRes?.activeSubscription) {
                          router.push(item?.url);

                          return;
                        }

                        if (subsRes?.activeSubscription) {
                          router.push(item?.subscribedUrl);

                          return;
                        }
                      }
                    }}
                    className="inline-flex flex-col w-full items-center space-y-2 cursor-pointer"
                  >
                    <div className="w-full h-[78px] rounded-lg border-[1px] border-pwip-v2-primary-50 inline-flex items-center justify-center relative">
                      {item?.comingSoon ? (
                        <div className="absolute z-0 h-auto w-full rounded-lg top-0 left-0 inline-flex justify-end">
                          <div className="inline-flex h-auto w-auto items-center justify-center py-[1px] rounded-tr-lg rounded-bl-lg px-2 bg-pwip-v2-yellow-100">
                            <span className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-center text-[9px] font-semibold">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      ) : null}
                      <img
                        src={item.icon}
                        className={`h-[32px] relative z-10 ${
                          item?.name === "Export orders" ? "!h-[47px]" : ""
                        }  ${item?.name === "EXIM" ? "!h-[36px]" : ""} ${
                          item?.name === "Community" ? "!h-[38px]" : ""
                        }`}
                      />
                    </div>

                    <span className="text-pwip-black-600 font-medium text-xs text-center">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {showPrime ? (
              <div
                onClick={async () => {
                  const content = (
                    <PWIPPrimeLP
                      authToken={authToken}
                      getUsersSubscriptionDetails={getUsersSubscriptionDetails}
                    />
                  );

                  openBottomSheet(content);
                }}
                className="grid grid-cols-2 w-full h-auto py-5 px-5 bg-pwip-v2-green-200 rounded-lg relative"
              >
                <div className="inline-flex flex-col space-y-5 h-full cols-span-10">
                  <div className="inline-flex flex-col space-y-1">
                    <span className="text-sm font-bold text-pwip-black-600 text-left whitespace-nowrap">
                      Curated for Exporter's.
                    </span>
                    <span className="text-xs font-normal text-pwip-black-500 text-left leading-[18px]">
                      Upgrade to all-in-one plan at{" "}
                      <span className="font-semibold text-pwip-v2-green-900">
                        ₹1499/-
                      </span>{" "}
                      and get all the benefits.
                    </span>
                  </div>

                  <div className="relative w-full">
                    <Button
                      type="white"
                      label="Know more"
                      rounded="!rounded-md"
                      maxHeight="!max-h-[26px]"
                      minHeight="!min-h-[26px]"
                      fontSize="!text-xs"
                      maxWidth="max-w-[60%]"
                    />
                  </div>
                </div>

                <div className="h-full cols-span-2">
                  <img
                    src="/assets/images/home_main/container.svg"
                    alt="container"
                    className="absolute top-0 right-0 h-full"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="inline-flex flex-col w-full relative">
            {/* <div className="w-full h-auto">
              <h2
                className={`px-5 mt-2 mb-5 text-pwip-v2-primary font-sans text-base font-bold`}
              >
                Top 5 destination ports for rice
              </h2>

              <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] px-5 w-full">
                <div className="flex flex-nowrap">
                  {[...popularDestinationData].map((items, index) => {
                    const imageURI =
                      "/assets/images/" +
                      `${
                        index === 0
                          ? "one.png"
                          : index === 1
                          ? "two.png"
                          : index === 2
                          ? "three.png"
                          : index === 3
                          ? "four.png"
                          : index === 4
                          ? "five.png"
                          : ""
                      }`;
                    return (
                      <div
                        key={`${index}_` + (index + 1 * 2)}
                        className="inline-block px-[15px] py-[18px] bg-pwip-v2-primary-100 rounded-xl mr-4 transition-all border-[1px] border-pwip-v2-gray-250"
                      >
                        <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                          <img src={imageURI} className="w-[24px] h-[24px]" />
                          <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]">
                            <span className="line-clamp-1">
                              {items.country}
                            </span>
                            <span className="text-sm">
                              {flag(items.country)}
                            </span>
                          </div>
                          <span className="mt-[4px] text-base text-pwip-v2-gray-800 font-[800] line-clamp-1">
                            {items.portName}
                          </span>
                          <span className="mt-[6px] text-xs text-pwip-v2-gray-500 font-[400] line-clamp-1 uppercase">
                            {items.portCode}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}

            <div className="w-full h-auto">
              <h2
                className={`px-5 mt-2 text-pwip-v2-primary font-sans text-base font-bold`}
              >
                Rice catagories
              </h2>
              <span className="px-5 text-sm text-pwip-v2-gray-400 font-normal">
                Search rice by the category
              </span>

              <div className="grid grid-cols-4 gap-4 px-5 mt-5">
                {[...riceCategory].map((items, index) => {
                  return (
                    <div
                      key={items?.name + index}
                      className="inline-flex flex-col items-center justify-center space-y-[10px]"
                      onClick={async () => {
                        const subsRes = await checkSubscription(
                          Number(ricePriceServiceId),
                          authToken
                        );

                        if (!subsRes?.activeSubscription) {
                          router.push("/service/rice-price/lp");

                          return;
                        }

                        if (subsRes?.activeSubscription) {
                          dispatch(
                            fetchCategoryRequest({
                              productCategory: {
                                name: items.name,
                                color:
                                  index === 0
                                    ? "#F3F7F9"
                                    : index === 1
                                    ? "#F7FFF2"
                                    : index === 2
                                    ? "#FFF5EF"
                                    : index === 3
                                    ? "#FFFBED"
                                    : "#F3F7F9",
                              },
                            })
                          );

                          router.push("/category?from=home");

                          return;
                        }
                      }}
                    >
                      <div
                        style={{
                          background: items?.color,
                        }}
                        className="h-[72px] w-[72px] rounded-lg inline-flex items-center justify-center"
                      >
                        <img
                          src={items?.image}
                          className="bg-cover h-[58px] w-[58px] object-cover rounded-md"
                        />
                      </div>
                      <span className="text-pwip-gray-700 text-sm font-[500] font-sans text-center line-clamp-1">
                        {items?.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-auto">
              <div className="inline-flex w-full flex-col px-5 mt-[32px] ">
                <h3 className="text-pwip-v2-primary font-sans text-base font-bold">
                  Top sourcing locations
                </h3>
                <span className="text-sm text-pwip-v2-gray-400 font-normal">
                  India's favourite sourcing locations
                </span>
              </div>

              <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] px-5 mt-5 w-full">
                <div className="flex flex-nowrap">
                  {getUniqueObjectsBySourceId([
                    ...popularSourceLocationData,
                  ]).map((items, index) => {
                    return (
                      <div
                        key={items?.sourceName + (index + 1 * 2)}
                        className="inline-block px-[15px] py-[18px] bg-pwip-v2-primary-100 rounded-xl mr-4 border-[1px] border-pwip-v2-gray-250"
                        // style={{
                        //   boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                        //   backdropFilter: "blur(8px)",
                        // }}
                        onClick={async () => {
                          // dispatch(searchScreenFailure());

                          const subsRes = await checkSubscription(
                            Number(ricePriceServiceId),
                            authToken
                          );

                          if (!subsRes?.activeSubscription) {
                            router.push("/service/rice-price/lp");

                            return;
                          }

                          if (subsRes?.activeSubscription) {
                            dispatch(
                              fetchCategoryRequest({
                                sourceId: items._sourceId,
                              })
                            );

                            router.push("/category?from=home");

                            return;
                          }
                        }}
                      >
                        <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                          {/* <img
                            src={"/assets/images/" + items?.icon}
                            className="w-[24px] h-[24px]"
                          /> */}
                          <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]">
                            <span className="line-clamp-1">
                              {items?.sourceState} (IN)
                            </span>
                            <span className="text-sm">🇮🇳</span>
                          </div>
                          <span className="mt-[4px] text-base text-pwip-v2-gray-800 font-[800] line-clamp-1">
                            {items?.sourceName || ""}
                          </span>
                          {/* <span className="mt-[6px] text-xs text-pwip-v2-gray-500 font-[400] line-clamp-1">
                            {items?.totalVariants || 0}{" "}
                            {items?.totalVariants > 1 ? "varieties" : "variety"}{" "}
                            available
                          </span> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-pwip-v2-gray-100 w-full h-full px-5 py-6 mt-[32px]">
            <h3 className="text-sm font-bold text-pwip-black-600">
              Trends of last 6 months
            </h3>
            <span className="text-xs text-pwip-black-600 font-normal">
              Following information is based on EXIM Data
            </span>
            <div className="flex flex-col w-full mt-[20px]">
              <div className={`flex overflow-x-scroll hide-scroll-bar`}>
                <div className="flex flex-nowrap">
                  {[
                    {
                      label: "Popular HSN",
                      description: eximTrendsData?.topHSN?.hsn,
                      imageSrc: "/assets/images/home_main/rice_cat.png",
                    },
                    {
                      label: "Popular destination ports",
                      description: eximTrendsData?.topDestination?.destination,
                      imageSrc: "/assets/images/home_main/port_cat.png",
                    },
                  ].map((item, index) => {
                    return (
                      <div
                        key={item.label + "_" + index}
                        className="inline-block relative h-[132px] w-[182px] border-[1px] border-pwip-v2-gray-200 bg-white rounded-lg mr-[12px]"
                      >
                        <div className="p-4 space-y-1">
                          <p className="text-xs text-pwip-black-600">
                            {item?.label}
                          </p>
                          <p className="text-xs uppercase font-semibold text-pwip-black-600">
                            {item?.description}
                          </p>
                        </div>

                        <img
                          className="absolute bottom-0 rounded-b-lg"
                          src={item?.imageSrc}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col w-full h-auto mt-8">
              <div className="inline-flex w-full flex-col space-y-1 border-b-[1px] border-b-pwip-v2-gray-200 pb-6">
                <div className="inline-flex justify-between w-full items-center">
                  <span className="text-pwip-v2-gray-400 text-base font-semibold">
                    Top 3 exported HSN in last 6 months
                  </span>

                  <div
                    onClick={() => {
                      openToastMessage({
                        type: "info",
                        message:
                          "We only consider sea as mode of medium for calculating the analytics from EXIM data.",
                        // autoHide: false,
                      });
                    }}
                    className="text-pwip-v2-gray-400 inline-flex items-center justify-center h-auto w-auto"
                  >
                    {infoIcon}
                  </div>
                </div>
                <span className="text-pwip-v2-primary text-2xl font-semibold">
                  {formatNumberWithCommas(
                    eximTrendsData?.totalVolume?.toFixed(0) || 0
                  )}{" "}
                  tonn
                </span>
                <span className="text-pwip-v2-primary text-sm font-normal">
                  In volume
                </span>
              </div>

              {eximTrendsData?.chart?.length ? (
                <div
                  className="w-full h-[180px] relative overflow-hidden mt-3"
                  id="home-chart"
                >
                  <Chart
                    options={{
                      data: eximTrendsData?.chart || [],
                      primaryAxis,
                      secondaryAxes,
                      // tooltip: {
                      //   show: true,
                      //   showDatumInTooltip: true,
                      //   align: "top",
                      //   alignPriority: "top",
                      // },
                      showDebugAxes: false,
                      showVoronoi: false,
                      memoizeSeries: true,
                      defaultColors: ["#165BAA", "#3988FF", "#6DC4FD"],
                      getSeriesStyle: () => {
                        return {
                          rectangle: {
                            height: "15px",
                          },
                        };
                      },
                    }}
                  />
                </div>
              ) : null}

              {eximTrendsData?.chart?.length ? (
                <div className="inline-flex flex-col w-full space-y-1 mt-5">
                  {eximTrendsData?.chart?.map((item, index) => {
                    return (
                      <div
                        key={item?.label + "_" + index}
                        className="inline-flex items-center space-x-2"
                      >
                        <div
                          className="h-2 w-4"
                          style={{
                            backgroundColor: item?.color,
                          }}
                        />
                        <span className="text-xs text-pwip-v2-gray-800">
                          {item?.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div
            onClick={() => {
              router.push("/waitlist?_s=EXIM");
            }}
            className="bg-pwip-v2-primary-100 inline-flex w-full h-auto items-center justify-center text-pwip-v2-primary-600 font-semibold space-x-2 py-5 border-t-[1px] border-t-pwip-v2-gray-200 cursor-pointer"
          >
            <span className="text-xs">Want to know see more of this?</span>
            {arrowLongRightIcon}
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Home);

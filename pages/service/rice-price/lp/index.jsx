/** @format */

import React, { useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

// import moment from "moment";
import useRazorpay from "react-razorpay";
import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  getServicesRequest,
  getPlansRequest,
} from "@/redux/actions/subscription.action";

import { fetchAllMyCostingsRequest } from "@/redux/actions/myCosting.actions";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import axios from "axios";
import { apiBaseURL, razorpayKey } from "@/utils/helper";

import { apiStagePaymentBeUrl, exportCostingServiceId } from "utils/helper";
import { riceLpContent } from "constants/riceLpContent";

function calculatePercentage(value, total) {
  if (typeof value !== "number" || typeof total !== "number") {
    console.error("Invalid input. Please provide valid numeric values");
  }

  const percentage = (value / total) * 100;
  return percentage;
}

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

function lp() {
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
  const [plansCardContent, setPlansCardContent] = React.useState([]);

  const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;
  const SERVICE_ID = Number(exportCostingServiceId);

  const createOrder = async (planid) => {
    try {
      const response = await axios.post(
        API_STAGE_PAYMENT_BE + "api" + "/create-order",
        {
          plan_id: planid,
          service_id: SERVICE_ID,
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

              if (responseVerify?.result === "Payment Success") {
                // const payload = {
                //   user_id: userDetails?._id,
                //   plan_id: item?.id,
                //   order_id: order?.order_id,
                //   payment_id: res?.razorpay_payment_id,
                //   amount_paid: order?.amount / 100, //paise to inr
                //   amount_paid_date: moment(new Date()).format(
                //     "YYYY-MM-DD HH:mm:ss"
                //   ), //2023-12-13 20:59:27
                //   payment_platform: "",
                //   payment_status: "success",
                // };
                // await createSubscription(payload);
                getUsersSubscriptionDetails();

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
        console.log(err);
      }
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
      ].filter((f) => f.show_for_user);

      setModulePlansData([...plans]);
    }
  }, [plansData, moduleServicesData]);

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

  const startFreeTrialForUser = async () => {
    try {
      const response = await axios.post(
        API_STAGE_PAYMENT_BE +
          "api" +
          "/start-free-trial?serviceId=" +
          SERVICE_ID,
        null,
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

  const getUsersSubscriptionDetails = async () => {
    const response = await checkUserSubscriptionDetails();
    if (typeof response === "object") {
      setUsersSubscriptionData(response);
    }

    if (response?.length) {
      setUsersSubscriptionData(response[0]);
    }
  };

  React.useEffect(() => {
    if (modulePlansData.length) {
      getUsersSubscriptionDetails();
    }
  }, [modulePlansData]);

  React.useEffect(() => {
    if (plansData && moduleServicesData.length) {
      const servicesId = new Set(
        [...moduleServicesData].map((d) => d.id).flat()
      );
      const uniqueServicesId = [...servicesId];

      const plans = [
        ...filterArrayByReference(plansData, uniqueServicesId),
      ].filter((f) => f.show_for_user);

      setModulePlansData([...plans]);
    }
  }, [plansData, moduleServicesData]);

  React.useEffect(() => {
    if (plansData) {
      // Sort plansData array so that Premium plan comes first
      const sortedPlansData = [...plansData].sort((a, b) => {
        if (a.name.toLowerCase() === "premium") return -1;
        if (b.name.toLowerCase() === "premium") return 1;
        return 0;
      });
      setPlansCardContent(sortedPlansData);
    }
  }, [plansData]);

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
            <React.Fragment>
              <div className="text-[#1B1B1B] text-[20px] font-bold mb-8 flex justify-between">
                <span>Find the right rice price with us</span>
                <div className="bg-[#F7F7F7] h-[80px] w-[180px] rounded-md"></div>
              </div>

              <div className="bg-[#FFF8E9] p-5 rounded-lg">
                <div className="font-semibold text-[14px]">Free Trial</div>
                <div className="text-[12px] font-normal mt-2">
                  We update rice price every 2 weeks, see prices for 120+
                  variety of rice{" "}
                </div>
                <div
                  className="font-normal text-sm text-[12px] text-[#2072AB] mt-3.5"
                  onClick={async () => {
                    const res = await startFreeTrialForUser();

                    if (res) {
                      getUsersSubscriptionDetails();
                    }
                  }}
                >
                  Start now{" "}
                </div>
              </div>
              <div className="font-semibold text-[14px] mt-6">
                Pick your Plan
              </div>
              <p className="font-normal text-[12px] text-[#1B1B1B] mt-1.5">
                Recurring billing and cancel anytime.
              </p>
              <div>
                {plansCardContent
                  .filter((plan) => plan.name !== "Free Trial") // Exclude the Free Trial plan
                  .map((plan, index) => (
                    <div
                      key={index}
                      className={`py-7 px-5 text-white mt-${
                        index === 0 ? "6" : "4"
                      } rounded-lg mb-3.5`}
                      style={{
                        background: `linear-gradient(to top left, ${
                          plan.name.toLowerCase() === "basic"
                            ? "#533D75"
                            : "#2F3F74"
                        }, ${
                          plan.name.toLowerCase() === "basic"
                            ? "#A97AE6"
                            : "#537FE7"
                        })`,
                      }}
                    >
                      {plan.name.toLowerCase() === "premium" && (
                        <div className="bg-white h-[15px] w-[80px] text-[#384F90] text-center text-[10px] font-semibold rounded-sm mb-3">
                          Recommended
                        </div>
                      )}
                      <div className="font-bold text-[16px] mt-2">
                        {plan.name} Plan
                      </div>
                      <div className="text-[11px] font-light mt-0.5">
                        &#8377;{plan.yearlyPrice}/- for 12 months
                      </div>
                      <p className="font-normal text-[12px] mt-1.5">
                        {plan.description}
                      </p>
                      <div className="flex justify-between mt-8">
                        <div className="font-semibold text-[14px]">
                          &#8377;{plan.price}/
                          <span className="font-normal">month</span>
                        </div>
                        <div
                          className="bg-white h-[28px] w-[98px] text-[#384F90] text-center p-1 text-[12px] font-semibold rounded-sm"
                          onClick={async () => {
                            if (
                              usersSubscriptionData?.activeSubscriptionObject
                                ?.plan_id !== plan?.id
                            ) {
                              handlePayment(plan);
                            }
                          }}
                        >
                          Start now
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-6">
                <div className="text-[20px] font-bold mb-8">
                  What do you get?
                </div>
                {riceLpContent.map((rice, index) => (
                  <div>
                    <div className="flex justify-normal mb-2.5" key={index}>
                      <div className="bg-[#FFD271] font-bold text-[12px] pl-1 w-[16px] h-[16px] align-center rounded-sm">
                        {rice.no}
                      </div>
                      <div className="font-bold text-[14px] ml-2">
                        {rice.name}
                      </div>
                    </div>
                    <div className="font-normal text-[12px]">
                      {rice.description}
                    </div>
                    {rice.premiumFeature && (
                      <div className="bg-[#FFD271]  h-[16px] w-[95px] text-black text-center text-[10px] font-semibold rounded-md mt-1 mb-5">
                        Premium feature
                      </div>
                    )}
                    <div className="bg-[#F7F7F7] mt-4 mb-6 h-[136px] w-full rounded-md"></div>
                  </div>
                ))}
                <div className="bg-[#F7F7F7] mt-4 mb-6 h-[176px] w-full rounded-md"></div>
              </div>
              <div
                className="bg-[#006EB4] text-white p-3 text-center font-medium text-[16px] rounded-md"
                onClick={async () => {
                  const res = await startFreeTrialForUser();

                  if (res) {
                    getUsersSubscriptionDetails();
                  }
                }}
              >
                Unlock Free Trial
              </div>
            </React.Fragment>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(lp);

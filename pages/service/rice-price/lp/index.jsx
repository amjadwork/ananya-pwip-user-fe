/** @format */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react";
import ReactPlayer from "react-player";

// import moment from "moment";
import useRazorpay from "react-razorpay";
import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  getServicesRequest,
  getPlansRequest,
} from "@/redux/actions/subscription.action";

// Import Components
import { Header } from "@/components/Header";
import axios from "axios";
import {
  apiBaseURL,
  razorpayKey,
  checkSubscription,
  ricePriceServiceId,
} from "@/utils/helper";

import { apiStagePaymentBeUrl } from "@/utils/helper";
import { riceLpContent } from "@/constants/riceLpContent";

import paymentSuccessful from "../../../../theme/lottie/payment-success.json";
import { nextArrow } from "../../../../theme/icon";

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

const SERVICE_ID = Number(ricePriceServiceId);
const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;

function lp() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();
  const videoRef = useRef();
  const pickPlanRef = useRef(); // Reference to the "Pick your Plan" section

  const { openBottomSheet, openToastMessage } = useOverlayContext();

  const plansData = useSelector((state) => state.subscription?.plans);

  const userDetails = useSelector((state) => state.auth?.user);
  const authToken = useSelector((state) => state.auth?.token);
  const [plansCardContent, setPlansCardContent] = React.useState([]);

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showDefaultThumbnail, setShowDefaultThumbnail] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgressInPercent, setVideoProgressInPercent] = useState(0);
  const [videoVolume, setVideoVolume] = useState(false);
  const url = "https://www.youtube.com/embed/Tb4GGo2_QFM";

  const [showFixedButton, setShowFixedButton] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const pickPlanSectionTop =
      pickPlanRef.current.getBoundingClientRect().top + scrollTop;

    // If the "Pick your Plan" section is in view, show the fixed button
    setShowFixedButton(scrollTop > pickPlanSectionTop);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Only run this effect once when component mounts

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

              const details = await checkSubscription(SERVICE_ID, authToken);

              if (details?.activeSubscription) {
                router.replace("/service/rice-price");
              }

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
        console.log(err);
      }
    },
    [Razorpay]
  );

  async function initPage() {
    const details = await checkSubscription(SERVICE_ID, authToken);

    await dispatch(getServicesRequest());
    await dispatch(getPlansRequest());

    if (details?.activeSubscription) {
      router.replace("/service/rice-price");
      return;
    }

    return;
  }

  useLayoutEffect(() => {
    if (authToken) {
      initPage();
    }
  }, [authToken]);

  useEffect(() => {
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

        <div className={`relative h-full w-full z-0`}>
          <div
            className={`min-h-[calc(100vh-120px)] inline-flex flex-col h-full w-full px-5 pt-[82px] pb-[120px] bg-white overflow-auto hide-scroll-bar`}
          >
            <React.Fragment>
              <div className="text-[#1B1B1B] text-[20px] font-bold mb-8 flex justify-between items-center">
                <span>Find the right rice price with us</span>
                <img
                  className="h-12 w-36"
                  src="/assets/images/services/riceLP/riceLP3.svg"
                />
              </div>

              {plansCardContent
                .filter(
                  (plan) =>
                    plan.is_free &&
                    plan.applicable_services.includes(SERVICE_ID)
                )
                .map((plan, planIndex) => {
                  return (
                    <div
                      key={plan?.id + "_" + planIndex * 99}
                      className="bg-[#FFF8E9] p-5 rounded-lg"
                    >
                      <div className="font-semibold text-[14px]">
                        Free Trial
                      </div>
                      <div className="text-[12px] font-normal mt-2">
                        {plan?.description}
                      </div>
                      <div
                        className="font-normal text-sm text-[12px] text-[#2072AB] mt-3.5 flex items-center"
                        onClick={async () => {
                          const res = await startFreeTrialForUser();

                          if (res) {
                            const details = await checkSubscription(
                              SERVICE_ID,
                              authToken
                            );

                            if (details?.activeSubscription) {
                              router.replace("/service/rice-price");
                              return;
                            }
                          }
                        }}
                      >
                        Start now &nbsp;{nextArrow}
                      </div>
                    </div>
                  );
                })}

              <div ref={pickPlanRef}>
                <div className="font-semibold text-[14px] mt-6">
                  Pick your Plan
                </div>
                <p className="font-normal text-[12px] text-[#1B1B1B] mt-1.5">
                  Recurring billing and cancel anytime.
                </p>
                <div>
                  {plansCardContent
                    .filter(
                      (plan) =>
                        !plan.is_free &&
                        plan.applicable_services.includes(SERVICE_ID)
                    ) // Exclude the Free Trial plan
                    .map((plan, index) => (
                      <div
                        key={plan?.id + index * 73}
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
                          &#8377;{(plan.price * 12 * 0.8).toFixed(2)}/- for 12
                          months
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
                              handlePayment(plan);
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
                    <div className="mb-9">
                      <div
                        className="flex justify-normal mb-2.5"
                        key={"rice_" + index}
                      >
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
                      <img
                        className="mt-4 h-[140px] rounded-md"
                        src={rice?.imageUrl}
                      />
                    </div>
                  ))}
                  <div className="mt-11">
                    <ReactPlayer
                      ref={videoRef}
                      url={url}
                      loop={false}
                      width="100%"
                      height="176px"
                      controls={false}
                      light={false}
                      playing={videoPlaying}
                      stopOnUnmount={true}
                      volume={videoVolume ? 0 : 1}
                      onClickPreview={() => {
                        return null;
                      }}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload", // Disable download button
                          },
                        },
                      }}
                      onProgress={(progress) => {
                        const totalDuration = videoDuration;
                        const currentProgress = progress?.playedSeconds
                          ? Math.ceil(progress?.playedSeconds)
                          : 0; // in seconds

                        const percentageCompleted =
                          (currentProgress / totalDuration) * 100;

                        setVideoProgressInPercent(percentageCompleted);
                      }}
                      onDuration={(duration) => {
                        setVideoDuration(duration);
                      }}
                      playIcon={
                        <div className="relative">
                          {/* <img
                src={"/assets/images/play-icon.svg"}
                className="h-[72px] w-[72px]"
              /> */}
                        </div>
                      }
                      onEnded={() => {
                        setVideoPlaying(false);
                        setShowDefaultThumbnail(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Fixed button */}
              {showFixedButton && (
                <div className="container fixed bottom-0 left-0 right-0 bg-white p-2">
                  <div
                    className=" bg-[#006EB4] text-white p-4 text-center font-medium text-[16px] rounded-md"
                    onClick={async () => {
                      const res = await startFreeTrialForUser();

                      if (res) {
                        const details = await checkSubscription(
                          SERVICE_ID,
                          authToken
                        );

                        if (details?.activeSubscription) {
                          router.replace("/service/rice-price");
                          return;
                        }
                      }
                    }}
                  >
                    Unlock Free Trial
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(lp);

/** @format */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Lottie from "lottie-react";

import ReactPlayer from "react-player";
import { useOverlayContext } from "@/context/OverlayContext";

import useRazorpay from "react-razorpay";

import {
  getServicesRequest,
  getPlansRequest,
} from "@/redux/actions/subscription.action";

import { razorpayKey, checkSubscription } from "@/utils/helper";
import { apiStagePaymentBeUrl } from "@/utils/helper";
import paymentSuccessful from "../../theme/lottie/payment-success.json";
import { nextArrow } from "../../theme/icon";

const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;

const LandingPage = (props) => {
  const {
    serviceName,
    title,
    titleImgSrc,
    pickYourPlan,
    features,
    videoContent,
    SERVICE_ID,
    videoUrl,
  } = props;

  const authToken = useSelector((state) => state.auth?.token);
  const userDetails = useSelector((state) => state.auth?.user);

  const router = useRouter();
  const videoRef = useRef();
  const dispatch = useDispatch();
  const pickPlanRef = useRef(); // Reference to the "Pick your Plan" section

  const { openBottomSheet, openToastMessage } = useOverlayContext();

  const [Razorpay] = useRazorpay();

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showDefaultThumbnail, setShowDefaultThumbnail] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgressInPercent, setVideoProgressInPercent] = useState(0);
  const [videoVolume, setVideoVolume] = useState(0);

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
                router.replace(`/${serviceName}`);
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
      router.replace(`/${serviceName}`);
      return;
    }

    return;
  }

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

  useLayoutEffect(() => {
    if (authToken) {
      initPage();
    }
  }, [authToken]);

  return (
    <React.Fragment>
      <div className="text-[#1B1B1B] text-[20px] font-bold mb-8 flex justify-between items-center">
        <span>{title}</span>
        <img className="h-12 w-36" src={titleImgSrc} />
      </div>

      {pickYourPlan
        .filter(
          (plan) =>
            plan.is_free && plan.applicable_services.includes(SERVICE_ID)
        )
        .map((plan, planIndex) => {
          return (
            <div
              key={plan?.id + "_" + planIndex * 99}
              className="bg-[#FFF8E9] p-5 rounded-lg"
            >
              <span className="font-semibold text-[14px]">Free Trial</span>
              <p className="text-[12px] font-normal mt-2 mb-0">
                {plan?.description}
              </p>
              <div
                className="font-normal text-sm text-[#2072AB] mt-3.5 flex items-center"
                onClick={async () => {
                  const res = await startFreeTrialForUser();

                  if (res) {
                    const details = await checkSubscription(
                      SERVICE_ID,
                      authToken
                    );

                    if (details?.activeSubscription) {
                      if (serviceName === "export-costing") {
                        router.replace(`/${serviceName}`);
                        return;
                      }

                      router.replace(`/service/${serviceName}`);

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

      <div className="mt-8" ref={pickPlanRef}>
        <span className="font-semibold text-[14px] mt-6">Pick your Plan</span>
        <p className="font-normal text-[12px] text-[#1B1B1B] mt-1.5">
          Recurring billing and cancel anytime.
        </p>
        <div>
          {pickYourPlan
            .filter(
              (plan) =>
                !plan.is_free && plan.applicable_services.includes(SERVICE_ID)
            ) // Exclude the Free Trial plan
            .map((plan, index) => (
              <div
                key={plan?.id + index * 73}
                className={`py-7 px-5 text-white mt-${
                  index === 0 ? "6" : "4"
                } rounded-lg mb-3.5`}
                style={{
                  background: `linear-gradient(to top left, ${
                    plan.name.toLowerCase() === "basic" ? "#533D75" : "#2F3F74"
                  }, ${
                    plan.name.toLowerCase() === "basic" ? "#A97AE6" : "#537FE7"
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
                  &#8377;{(plan.price * 12 * 0.8).toFixed(2)}/- for 12 months
                </div>
                <p className="font-normal text-[12px] mt-1.5">
                  {plan.description}
                </p>
                <div className="flex justify-between mt-8">
                  <span className="font-semibold text-[14px]">
                    &#8377;{plan.price}/
                    <span className="font-normal">month</span>
                  </span>
                  <div
                    className="bg-white h-[32px] w-[98px] text-[#384F90] text-center p-1 text-[12px] font-semibold rounded inline-flex items-center justify-center"
                    onClick={async () => {
                      handlePayment(plan);
                    }}
                  >
                    <span>Start now</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-6">
          <div className="text-[20px] font-bold mb-8">What do you get?</div>
          {features.map((rice, index) => (
            <div className="mb-9">
              <div className="flex justify-normal mb-2.5" key={"rice_" + index}>
                <div className="bg-[#FFD271] font-bold text-[12px] pl-1 w-[16px] h-[16px] align-center rounded-sm">
                  {index + 1}
                </div>
                <div className="font-bold text-[14px] ml-2">{rice.name}</div>
              </div>
              <div className="font-normal text-[12px]">{rice.description}</div>
              {rice.premiumFeature && (
                <div className="bg-[#FFD271]  h-[16px] w-[95px] text-black text-center text-[10px] font-semibold rounded-lg mt-1 mb-5">
                  Premium feature
                </div>
              )}
              <img
                className="mt-4 w-full auto rounded-lg"
                src={rice?.imageUrl}
              />
            </div>
          ))}
          {videoContent ? (
            <div
              className="lp relative bg-pwip-black-600 rounded-lg"
              id="videoPlayerEl"
            >
              <ReactPlayer
                ref={videoRef}
                url={videoUrl}
                loop={false}
                width="100%"
                height="172px"
                style={{
                  borderRadius: 8,
                }}
                controls={false}
                light={true}
                previewTabIndex={1}
                playing={videoPlaying}
                stopOnUnmount={true}
                volume={videoVolume}
                muted={!videoVolume ? true : false}
                onReady={() => {
                  setVideoPlaying(true);
                }}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload", // Disable download button
                    },
                  },
                }}
                playIcon={
                  <div
                    className="relative"
                    onClick={() => {
                      setVideoPlaying(true);
                    }}
                  >
                    <svg
                      width="52"
                      height="51"
                      viewBox="0 0 52 51"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="14.3976"
                        y="14"
                        width="23.2047"
                        height="24"
                        fill="#006EB4"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.0968 25.5C5.0968 14.0569 14.455 4.78125 26 4.78125C37.545 4.78125 46.9032 14.0569 46.9032 25.5C46.9032 36.9431 37.545 46.2188 26 46.2188C14.455 46.2188 5.0968 36.9431 5.0968 25.5ZM35.1631 23.4111C35.5387 23.6183 35.8515 23.9212 36.0694 24.2885C36.2872 24.6557 36.402 25.074 36.402 25.5C36.402 25.926 36.2872 26.3443 36.0694 26.7115C35.8515 27.0788 35.5387 27.3817 35.1631 27.5889L23.1507 34.204C22.7837 34.406 22.3698 34.5094 21.95 34.5042C21.5302 34.499 21.1191 34.3853 20.7572 34.1743C20.3954 33.9633 20.0953 33.6624 19.8868 33.3012C19.6783 32.9401 19.5685 32.5312 19.5682 32.1151V18.8849C19.5682 17.0638 21.5428 15.9099 23.1507 16.796L35.1631 23.4111Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                }
                onEnded={() => {
                  setVideoPlaying(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Fixed button */}
      <div
        className={`${
          showFixedButton
            ? "translate-y-0 opacity-1"
            : "translate-y-20 opacity-1"
        } container fixed bottom-0 left-0 right-0 bg-white p-2 px-5 transition-transform`}
      >
        <div
          className=" bg-[#006EB4] text-white px-4 py-3 text-center font-medium text-[16px] rounded-lg"
          onClick={async () => {
            const res = await startFreeTrialForUser();

            if (res) {
              const details = await checkSubscription(SERVICE_ID, authToken);

              if (details?.activeSubscription) {
                if (serviceName === "export-costing") {
                  router.replace(`/${serviceName}`);
                  return;
                }

                router.replace(`/service/${serviceName}`);

                return;
              }
            }
          }}
        >
          Unlock Free Trial
        </div>
      </div>
    </React.Fragment>
  );
};

export default LandingPage;

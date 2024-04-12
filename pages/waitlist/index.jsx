/** @format */
import Head from "next/head";

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
import ChartLottie from "../../theme/lottie/chart.json";

import ReactPlayer from "react-player";
import { useOverlayContext } from "@/context/OverlayContext";
import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import useRazorpay from "react-razorpay";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";

import {
  getServicesRequest,
  getPlansRequest,
} from "@/redux/actions/subscription.action";

import { razorpayKey, checkSubscription } from "@/utils/helper";
import { apiStagePaymentBeUrl } from "@/utils/helper";
import paymentSuccessful from "../../theme/lottie/payment-success.json";
import { nextArrow } from "../../theme/icon";

const API_STAGE_PAYMENT_BE = apiStagePaymentBeUrl;

const featuresExportOrders = [
  {
    name: "Be the first one to accept PWIP orders.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: false,
    imageUrl: "/assets/images/services/lp/export-order-feature-1.png",
  },
  {
    name: "Place your own export order.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: true,
    imageUrl: "/assets/images/services/lp/export-order-feature-2.png",
  },
  {
    name: "Track your export order anytime, anywhere.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: true,
    imageUrl: "/assets/images/services/lp/export-order-feature-3.png",
  },
  {
    name: "Stay updated all the time.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: true,
    imageUrl: "/assets/images/services/lp/export-order-feature-4.png",
  },
];

const featuresEXIM = [
  {
    name: "Individual EXIM analysis of HSN groups.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: false,
    imageUrl: "/assets/images/services/lp/exim-feature-1.png",
  },
  {
    name: "Know the trends, before you invest.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: true,
    imageUrl: "/assets/images/services/lp/exim-feature-2.png",
  },
  {
    name: "Browse through the complete data.",
    description:
      "Unlimited access to rice prices to make your price discovery more convenient.",
    // premiumFeature: true,
    imageUrl: "/assets/images/services/lp/exim-feature-3.png",
  },
];

const WaitingList = (props) => {
  const authToken = useSelector((state) => state.auth?.token);
  // const userDetails = useSelector((state) => state.auth?.user);

  const router = useRouter();
  // const videoRef = useRef();
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
  const [features, setFeatures] = useState([]);
  const [pageTitle, setPageTitle] = useState({
    title: "",
    desc: "",
  });

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

  useEffect(() => {
    if (router?.query?._s === "Export orders") {
      setFeatures(featuresExportOrders);
      const obj = {
        title: "Join our waitlist to start your export orders journey",
        desc: "Export order is coming soon. Join to get early accsess.",
      };
      setPageTitle(obj);
    }

    if (router?.query?._s === "EXIM") {
      setFeatures(featuresEXIM);
      const obj = {
        title: "Join us to access Exim data and stay updated with the market",
        desc: "EXIM analysis is coming real soon, Join to get the EXIM data at your finger tip.",
      };

      setPageTitle(obj);
    }
  }, [router]);

  const style = {
    height: 180,
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>PWIP | Join waitlist for Export orders</title>

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

        <div className={`relative h-full w-full bg-white z-0`}>
          <div
            className={`min-h-[calc(100vh-120px)] inline-flex flex-col h-full w-full px-5 pt-[82px] pb-[120px] bg-white overflow-auto hide-scroll-bar`}
          >
            <div className="relative w-full">
              <div className="inline-flex flex-col w-[90%] space-y-3">
                <span className="text-pwip-black-600 text-[20px] font-bold leading-6">
                  {pageTitle?.title}
                </span>
                <span className="text-xs text-pwip-black-600 font-normal">
                  {pageTitle?.desc}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex h-full w-full flex-col justify-center">
                  <Button
                    type="primary"
                    label="Join"
                    maxHeight="!max-h-[38px]"
                    minHeight="!min-h-[38px]"
                    maxWidth="!w-auto !max-w-[70%]"
                    onClick={async () => {
                      //
                    }}
                  />
                </div>

                <div className="inline-flex w-full justify-end">
                  {router?.query?._s === "Export orders" ? (
                    <img
                      className="h-[142px] w-auto"
                      src="/assets/images/services/export-order/export-order-waitlist.png"
                    />
                  ) : null}

                  {router?.query?._s === "EXIM" ? (
                    <div className="w-auto z-0">
                      <Lottie animationData={ChartLottie} style={style} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-8" ref={pickPlanRef}>
              <div>
                <div className="text-[20px] font-bold mb-8">
                  What do you get?
                </div>
                {features.map((rice, index) => (
                  <div className="mb-9">
                    <div
                      className="flex justify-normal mb-2.5"
                      key={"rice_" + index}
                    >
                      <div className="bg-[#FFD271] font-bold text-[12px] pl-1 w-[16px] h-[16px] align-center rounded-sm">
                        {index + 1}
                      </div>
                      <div className="font-bold text-[14px] ml-2">
                        {rice.name}
                      </div>
                    </div>
                    <div className="font-normal text-[12px]">
                      {rice.description}
                    </div>
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
              </div>
            </div>
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
              //
            }}
          >
            Join the waitlist
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
};

export default WaitingList;
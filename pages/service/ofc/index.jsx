import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import { useOverlayContext } from "@/context/OverlayContext";
import SelectLocationContainer from "@/containers/ec/SelectLocation";

import { searchIcon, bookmarkOutlineIcon } from "../../../theme/icon";
import ServiceSplashLottie from "../../../theme/lottie/service-splash.json";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import SearchAndFilter from "@/containers/rice-price/SearchAndFilter";

import {
  api,
  checkSubscription,
  ofcServiceId,
  inrToUsd,
  formatNumberWithCommas,
} from "@/utils/helper";

import {
  fetchVariantPriceRequest,
  addVariantToWatchlistRequest,
  fetchAllWatchlistForVariantRequest,
  setSelectedVariantForDetailRequest,
} from "@/redux/actions/variant-prices.actions";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";

import {
  setSelectedPOLForOFCFailure,
  setSelectedPODForOFCFailure,
} from "@/redux/actions/ofc.actions";

import { productStateList } from "@/constants/stateList";

import ShipOFC from "../../../theme/lottie/ofc-ship.json";

// Import Containers

// Import Layouts
const SERVICE_ID = ofcServiceId;

function mapWatchlist(array1, array2) {
  // Create a map to store objects from array1 based on _variantId and _sourceId
  const map = new Map();
  array1.forEach((item) =>
    map.set(`${item._variantId}-${item._sourceId}`, item)
  );

  // Modify array2 to include watchlist key with matching object from array1
  const newArray2 = array2.map((item) => {
    const watchlistItem = map.get(`${item.variantId}-${item.source._sourceId}`);
    return watchlistItem
      ? { ...item, watchlist: watchlistItem }
      : { ...item, watchlist: null };
  });

  return newArray2;
}

function OFCService() {
  const fixedDivRef = useRef();

  const {
    openSearchFilterModal,
    closeSearchFilterModal,
    isSearchFilterModalOpen,
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
    stopLoading,
  } = useOverlayContext();

  const router = useRouter();

  const forexRate = useSelector((state) => state.utils.forexRate);
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);
  const variantPriceList =
    useSelector((state) => state.variantPriceList.variantWithPriceList) || [];
  const variantWatchList =
    useSelector((state) => state.variantPriceList.variantWatchList) || [];
  const selectedPOL = useSelector((state) => state.ofc.selectedPOL);
  const selectedPOD = useSelector((state) => state.ofc.selectedPOD);

  const [ofcResultData, setOFCResultData] = useState(null);

  const [splashScreen, setSplashScreen] = React.useState(false);
  const [progressValue, setProgressValue] = React.useState(0); // State for progress value

  async function initPage() {
    const details = await checkSubscription(SERVICE_ID, authToken);

    if (!details?.activeSubscription) {
      router.replace("/service/ofc/lp");

      return;
    }

    dispatch(fetchOriginRequest());

    return;
  }

  useLayoutEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (selectedPOL) {
      dispatch(fetchDestinationRequest(null, selectedPOL?._id));
    }
  }, [selectedPOL]);

  React.useEffect(() => {
    const backThroughServicePage = sessionStorage.getItem(
      "backThroughServicePage"
    );

    if (backThroughServicePage || backThroughServicePage === "true") {
      setSplashScreen(false);
    } else {
      setSplashScreen(true);
    }

    stopLoading();
  }, []);

  React.useEffect(() => {
    // Update progress value using requestAnimationFrame
    const updateProgressValue = () => {
      const duration = 2000;
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateProgress = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progress = (elapsedTime / duration) * 100;

        const currentValue = progress > 100 ? 100 : progress; // Limit progress to 100%
        setProgressValue(currentValue);

        if (now < endTime) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    };

    if (splashScreen) {
      updateProgressValue();

      dispatch(setSelectedPOLForOFCFailure());
      dispatch(setSelectedPODForOFCFailure());

      // Reset progress value after given seconds
      setTimeout(() => {
        stopLoading();
        setProgressValue(0);
        setSplashScreen(false);
      }, 2300);
    }
  }, [splashScreen]);

  const style = {
    height: 180,
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>OFC | PWIP</title>

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

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-v2-gray-50 z-0`}
        >
          <div className="inline-flex flex-col w-full h-full">
            <div className={`w-full bg-white`}>
              <div className="inline-flex flex-col space-y-1 w-full px-5 py-6">
                <span className="text-pwip-v2-primary text-xs font-regular">
                  Lets search for
                </span>
                <span className="text-pwip-v2-primary text-lg font-semibold">
                  Ocean freight charges.
                </span>
              </div>
            </div>

            <div
              div
              className="w-full h-full inline-flex flex-col hide-scroll-bar"
            >
              <div
                className={`w-full h-full space-y-4 px-5 py-4 overflow-y-auto hide-scroll-bar transition-all`}
              >
                <div
                  className="rounded-lg w-full inline-flex flex-col space-y-3 bg-white p-4 relative"
                  style={{ boxShadow: "0px 1px 6px -2px #00000012" }}
                >
                  <div
                    onClick={() => {
                      setOFCResultData(null);
                      const content = (
                        <div>
                          <SelectLocationContainer
                            title="Select Port of Origin"
                            roundedTop={false}
                            noTop={true}
                            noPaddingBottom={true}
                            isFromOtherService={true}
                            locationType="origin"
                          />
                        </div>
                      );
                      openBottomSheet(content);
                    }}
                    className="inline-flex items-center space-x-4 border-[1px] border-pwip-gray-300 rounded-lg w-full px-3 py-2 relative z-10"
                  >
                    <div className="min-h-[42px] h-[42px] min-w-[42px] w-[42px] rounded-lg bg-pwip-v2-gray-100 inline-flex items-center justify-center">
                      <img
                        className="h-6 w-6"
                        src="/assets/images/services/ofc/pol-ofc.svg"
                      />
                    </div>

                    <div className="inline-flex flex-col space-y-1 w-full">
                      <span
                        className={`
                        text-sm ${
                          selectedPOL
                            ? "text-pwip-black-600 font-semibold"
                            : "text-pwip-v2-gray-500 font-medium"
                        }
                      `}
                      >
                        {selectedPOL?.portName || "Port of loading"} (
                        {selectedPOL?.portCode || "POL"})
                      </span>
                      {selectedPOL ? (
                        <span className="font-regular text-xs text-pwip-v2-gray-500">
                          {selectedPOL?.state}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-full h-[42px] w-[42px] bg-pwip-v2-primary-500 absolute top-[4.15rem] right-[2.5rem] z-20 !m-0 inline-flex items-center justify-center">
                    <img
                      className="h-5 w-5"
                      src="/assets/images/services/ofc/go-to-port-arrow.svg"
                    />
                  </div>

                  <div
                    onClick={() => {
                      if (!selectedPOL?.portName) {
                        openToastMessage({
                          type: "info",
                          message: "Please select a port of loading (POL)",
                          autoHide: true,
                        });

                        setTimeout(() => {
                          closeToastMessage();
                        }, 2500);
                        return;
                      }

                      setOFCResultData(null);
                      const content = (
                        <div>
                          <SelectLocationContainer
                            title="Select Port of Destination"
                            roundedTop={false}
                            noTop={true}
                            noPaddingBottom={true}
                            isFromOtherService={true}
                            locationType="destination"
                          />
                        </div>
                      );
                      openBottomSheet(content);
                    }}
                    className="inline-flex items-center space-x-4 border-[1px] border-pwip-gray-300 rounded-lg w-full px-3 py-2 relative z-10 !mb-4"
                  >
                    <div className="min-h-[42px] h-[42px] min-w-[42px] w-[42px] rounded-lg bg-pwip-v2-gray-100 inline-flex items-center justify-center">
                      <img
                        className="h-6 w-6"
                        src="/assets/images/services/ofc/pod-ofc.svg"
                      />
                    </div>

                    <div className="inline-flex flex-col space-y-1 w-full">
                      <span
                        className={`
                        text-sm ${
                          selectedPOD
                            ? "text-pwip-black-600 font-semibold"
                            : "text-pwip-v2-gray-500 font-medium"
                        }
                      `}
                      >
                        {selectedPOD?.portName || "Destination port"} (
                        {selectedPOD?.portCode || "POD"})
                      </span>
                      {selectedPOD ? (
                        <span className="font-regular text-xs text-pwip-v2-gray-500">
                          {selectedPOD?.country}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    type={
                      selectedPOL && selectedPOD && !ofcResultData
                        ? "primary"
                        : "disabled"
                    }
                    label="Search OFC"
                    disabled={
                      selectedPOL && selectedPOD && !ofcResultData
                        ? false
                        : true
                    }
                    onClick={async () => {
                      const responseOFC = await api.get(
                        `/ofc?origin=${selectedPOL?._id}&destination=${selectedPOD?._id}`,
                        {
                          headers: {
                            "Content-Type": "application/json",
                            Accept: "application/pdf",
                            Authorization: `Bearer ${authToken}`,
                          },
                        }
                      );

                      if (
                        responseOFC?.data?.length &&
                        responseOFC?.data[0]?.destinations?.length
                      ) {
                        setOFCResultData(responseOFC?.data[0]?.destinations[0]);
                      }
                    }}
                  />
                </div>
              </div>

              {ofcResultData ? (
                <div className="bg-white w-full h-full py-4 px-5">
                  <h3 className="text-base font-semibold">Search result</h3>

                  <div className="w-full rounded-lg bg-pwip-v2-gray-50 p-4 mt-5">
                    <div className="inline-flex items-center w-full">
                      <div className="inline-flex items-center justify-start w-auto h-full">
                        <span className="text-sm font-regular text-pwip-black-500">
                          {selectedPOL?.portCode}
                        </span>
                      </div>
                      <div className="inline-flex items-center justify-center w-full h-full">
                        <img
                          className="h-auto w-[80%]"
                          src="/assets/images/services/ofc/ship.svg"
                        />
                      </div>
                      <div className="inline-flex items-center justify-end w-auto h-full">
                        <span className="text-sm font-regular text-pwip-black-500">
                          {selectedPOD?.portCode}
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex flex-col w-full mt-2 space-y-1 border-b-[2px] border-b-pwip-gray-300 border-dashed pb-4">
                      <div className="inline-flex items-center w-full">
                        <div className="inline-flex items-center justify-start w-full h-full">
                          <span className="text-xs font-regular text-pwip-black-500">
                            {selectedPOL?.portName}
                          </span>
                        </div>

                        <div className="inline-flex items-center justify-end w-full h-full">
                          <span className="text-xs font-regular text-pwip-black-500">
                            {selectedPOD?.portName}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center w-full">
                        <div className="inline-flex items-center justify-start w-full h-full">
                          <span className="text-xs font-regular text-pwip-gray-400">
                            {selectedPOL?.state}
                          </span>
                        </div>

                        <div className="inline-flex items-center justify-end w-full h-full">
                          <span className="text-xs font-regular text-pwip-gray-400">
                            {selectedPOD?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-start justify-between w-full pt-4">
                      <div className="inline-flex flex-col space-y-1 items-start justify-start w-auto h-full">
                        <span className="text-base font-semibold text-pwip-black-500">
                          Charges
                        </span>
                        <span className="text-xs font-normal text-pwip-gray-600">
                          <span className="font-bold text-pwip-primary">
                            Note:
                          </span>{" "}
                          Prices are shown <br /> per container
                        </span>
                      </div>

                      <div className="inline-flex flex-col space-y-1 items-end justify-end w-auto h-full">
                        <span className="text-base font-semibold text-pwip-green-800">
                          $
                          {Math.ceil(
                            Number(
                              inrToUsd(ofcResultData?.ofcCharge, forexRate?.USD)
                            )
                          ) || 0}
                          {/* /container */}
                        </span>

                        <span className="text-xs font-semibold text-right text-pwip-black-600">
                          ₹
                          {formatNumberWithCommas(
                            Math.ceil(ofcResultData?.ofcCharge)
                          ) || 0}
                          {/* /container */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-auto z-0 bg-white pb-8">
                <Lottie animationData={ShipOFC} style={style} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`h-screen w-screen fixed top-0 left-0 transition-all bg-white inline-flex flex-col justify-between ${
            splashScreen ? "block opacity-1 z-20" : "hidden opacity-0"
          }`}
        >
          <div className="inline-flex space-y-3 items-center flex-col justify-center h-full w-full px-8 relative top-[-100px]">
            {/* Splash screen content */}
            <div className="min-w-[310px] h-auto relative inline-flex items-center justify-center">
              <img
                className="h-[32px] absolute z-10"
                src="/assets/images/services/ofc-service-logo.png"
              />
              <div className="w-auto z-0">
                <Lottie animationData={ServiceSplashLottie} style={style} />
              </div>
            </div>

            <div className="inline-flex items-center flex-col justify-center">
              <span className="text-center text-sm text-pwip-black-500 font-semibold leading-5">
                Get your estimated rice price anytime, anywhere
              </span>
            </div>

            {/* Progress bar */}
            <div className="px-5 w-full h-auto">
              <div className="w-full h-2 rounded-full bg-pwip-v2-gray-350 !mt-12">
                <div
                  style={{ width: `${progressValue}%` }}
                  className="h-2 rounded-full bg-pwip-v2-primary-500"
                ></div>
              </div>
            </div>
          </div>

          {/* <div className="inline-flex items-center flex-col justify-center px-8 pb-8">
            <span className="text-center text-xs text-pwip-v2-gray-500 leading-5">
              Generate costing in 2 clicks for estimations and customize it as
              per your order before sharing ahead.
            </span>
          </div> */}
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(OFCService);

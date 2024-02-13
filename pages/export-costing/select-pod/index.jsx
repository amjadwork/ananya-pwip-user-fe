import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/Button";
import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import {
  fetchDestinationRequest,
  // fetchOriginRequest,
  // fetchDestinationFailure,
} from "@/redux/actions/location.actions";

import {
  generateQuickCostingRequest,
  fetchGeneratedCostingFailure,
  resetCostingSelection,
  resetCustomCostingSelection,
} from "@/redux/actions/costing.actions";
import {
  saveCostingRequest,
  fetchMyCostingFailure,
  updateCostingFailure,
} from "@/redux/actions/myCosting.actions";

import { pencilIcon } from "../../../theme/icon";

// Import Components
import { Header } from "@/components/Header";

// Import Containers
import SelectLocationContainer from "@/containers/ec/SelectLocation";
// Import Layouts

import {
  apiBaseURL,
  exportCostingServiceId,
  apiStagePaymentBeUrl,
  getCostingToSaveHistoryPayload,
} from "@/utils/helper";

import axios from "axios";

function getObjectWithLatestDate(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    // Return null or handle the case where the array is empty or not valid
    return null;
  }

  // Sort the array based on the 'amount_paid_date' in descending order
  const sortedArray = dataArray.sort(
    (a, b) => new Date(b?.amount_paid_date) - new Date(a?.amount_paid_date)
  );

  // Return the first (i.e., the latest) object in the sorted array
  return sortedArray[0];
}

function SelectPortOfDestination() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { openToastMessage } = useOverlayContext();

  const selectedProductForCosting = useSelector(
    (state) => state.costing.product
  );

  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const shipmentTerm = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.selected
  );
  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const authToken = useSelector((state) => state.auth.token);

  // const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [isGenerated, setIsGenerated] = React.useState(false);

  async function handleSaveCosting() {
    const saveHistoryPayload = getCostingToSaveHistoryPayload(generatedCosting);

    const payloadBody = {
      ...saveHistoryPayload,
      isQuickCosting: true,
    };
    await dispatch(updateCostingFailure());
    await dispatch(saveCostingRequest(payloadBody));
    await dispatch(fetchGeneratedCostingFailure());
    setIsGenerated(false);
    router.push("/export-costing/costing");
  }

  const checkUserSubscriptionDetails = async () => {
    try {
      const response = await axios.get(
        apiStagePaymentBeUrl +
          "api" +
          "/user-subscription?serviceId=" +
          exportCostingServiceId, //+ userDetails.user._id,
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

  React.useEffect(() => {
    if (generatedCosting && isGenerated) {
      handleSaveCosting();
    }
  }, [generatedCosting, isGenerated]);

  React.useEffect(() => {
    if (!selectedProductForCosting) {
      router.replace("/export-costing");
    }

    if (selectedProductForCosting) {
      dispatch(fetchDestinationRequest());
      // dispatch(fetchOriginRequest());
    }
  }, [selectedProductForCosting]);

  // React.useEffect(() => {
  //   const element = document.getElementById("fixedMenuSection");
  //   if (element) {
  //     const height = element.offsetHeight;
  //     setMainContainerHeight(height);
  //   }
  // }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Select destination port | PWIP</title>

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

        <SelectLocationContainer
          roundedTop={true}
          title="Select Port of Destination"
          showSelectedVariant={true}
        />
        <div
          className="w-full rounded-t-lg fixed bottom-0 h-auto px-[24px] py-4 bg-white z-[1000]"
          style={{
            boxShadow: "0px -8px 16px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="w-full inline-flex flex-col space-y-[6px] mb-[18px]">
            <div className="w-full inline-flex justify-between items-center">
              <span className="text-sm font-[700] text-pwip-v2-gray-800 text-left">
                {selectedCosting?.product?.variantName}
              </span>
              <div
                className="h-full min-w-[50.15px] w-auto outline-none bg-transparent border-none inline-flex items-center justify-between space-x-2 text-sm text-pwip-v2-primary-500"
                onClick={() => {
                  dispatch(resetCostingSelection());
                  router.replace("/export-costing");
                }}
              >
                <span className="font-[500]">Edit</span>
                {pencilIcon}
              </div>
            </div>
            <div className="flex items-center space-x-[10px]">
              <span className="text-sm font-[400] text-pwip-v2-primary-500 text-left">
                {selectedCosting?.product?.sourceRates?.sourceName}
              </span>
              {selectedCosting?.portOfDestination &&
              Object.keys(selectedCosting?.portOfDestination).length > 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="2"
                  viewBox="0 0 30 2"
                  fill="none"
                >
                  <path
                    d="M1 1H29.5"
                    stroke="#2072AB"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                </svg>
              ) : null}

              <span className="text-sm font-[400] text-pwip-v2-primary-500 text-left">
                {selectedCosting?.portOfDestination?.portName}
              </span>
            </div>
          </div>

          <Button
            type={
              selectedCosting?.product &&
              Object.keys(selectedCosting?.product)?.length > 0 &&
              selectedCosting?.portOfDestination &&
              Object.keys(selectedCosting?.portOfDestination).length > 0
                ? "primary"
                : "disabled"
            }
            label="Generate costing"
            disabled={
              selectedCosting?.product &&
              Object.keys(selectedCosting?.product)?.length > 0 &&
              selectedCosting?.portOfDestination &&
              Object.keys(selectedCosting?.portOfDestination).length > 0
                ? false
                : true
            }
            onClick={async () => {
              const subscriptionResponse = await checkUserSubscriptionDetails();
              let currentPlan = null;

              if (subscriptionResponse?.length) {
                currentPlan = subscriptionResponse[0];
              }

              if (typeof subscriptionResponse === "object") {
                currentPlan = subscriptionResponse;
              }

              if (!currentPlan) {
                openToastMessage({
                  type: "error",
                  message:
                    "Something went wrong while checking subscription details",
                  // autoHide: false,
                });

                return;
              }

              if (!currentPlan?.activeSubscription) {
                openToastMessage({
                  type: "error",
                  message:
                    currentPlan?.message || "You have no active subscription",
                  // autoHide: false,
                });

                return;
              }

              if (currentPlan?.isSubscriptionExpired) {
                openToastMessage({
                  type: "error",
                  message: "Your subscription is expired",
                  // autoHide: false,
                });

                return;
              }

              //     type: "error",
              //     message: "You have exhausted your current plan!!",

              if (
                selectedCosting?.product &&
                Object.keys(selectedCosting?.product)?.length > 0 &&
                selectedCosting?.portOfDestination &&
                Object.keys(selectedCosting?.portOfDestination).length > 0
              ) {
                await dispatch(fetchGeneratedCostingFailure());
                await dispatch(fetchMyCostingFailure());
                const body = {
                  destinationPortId: selectedCosting?.portOfDestination?._id,
                  sourceId: selectedCosting?.product?.sourceRates?._sourceId,
                  sourceRateId: selectedCosting?.product?.sourceRates?._id,
                  shipmentTermType: shipmentTerm || "FOB",
                  unit: "mt",
                };
                await dispatch(generateQuickCostingRequest(body));
                // await dispatch(resetCostingSelection());
                await dispatch(resetCustomCostingSelection());
                setIsGenerated(true);
              }
            }}
          />
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(SelectPortOfDestination);

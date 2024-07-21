import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";
import { fetchProductsRequest } from "@/redux/actions/products.actions";
import { useOverlayContext } from "@/context/OverlayContext";
import axios from "axios";

import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";

import { api, inrToUsd, convertUnits, apiBaseURL } from "@/utils/helper";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import { breakupArr } from "@/constants/breakupStructure";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import { generatePayloadForCustomCosting } from "@/utils/helper";

import { fetchPackagingBagsRequest } from "@/redux/actions/packaging.actions";
import { fetchContainersRequest } from "@/redux/actions/container.actions";
import {
  fetchMyCostingFailure,
  saveCostingRequest,
  saveCostingFailure,
  // updateCostingRequest,
  fetchMyCostingRequest,
  updateCostingFailure,
} from "@/redux/actions/myCosting.actions";
import {
  generateCustomCostingRequest,
  fetchGeneratedCostingFailure,
  resetCustomCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions";

// Import Containers
// import CostingForm from "@/containers/ec/Forms/CostingForm";
// import BreakupForm from "@/containers/ec/Forms/BreakupForm";

import {
  exportCostingServiceId,
  apiStagePaymentBeUrl,
  getCostingToSaveHistoryPayload,
} from "@/utils/helper";

import {
  riceCardIcon,
  locationCardIcon,
  bagsCardIcon,
  containerCardIcon,
  shlCardIcon,
  chaCardIcon,
  inspectionCardIcon,
  transportationCardIcon,
  ofcCardIcon,
  financeCardIcon,
  overheadsCardIcon,
  marginCardIcon,
  dutyCardIcon,
  chevronDown,
  checkIcon,
  arrowLeftBackIcon,
} from "../../../../theme/icon";

// function getUniqueBagsWeight(inputArray) {
//   const uniqueBagsWeightMap = new Map();

//   // Iterate through the array and store each object in the Map with the "bag" as the key
//   inputArray.forEach((item) => {
//     uniqueBagsWeightMap.set(item.weight, item);
//   });

//   // Convert the Map values back to an array
//   const uniqueBagsArray = Array.from(uniqueBagsWeightMap.values());

//   return uniqueBagsArray;
// }

function ExportDutyPercentageBar({
  setFieldValue,
  formValues,
  handleClick = (arg1) => null,
}) {
  const [values, setValues] = useState({});
  const [activeOtp, setActiveOtp] = useState(20);

  useEffect(() => {
    if (formValues) {
      setValues(formValues);
    }

    if (formValues?.exportDutyValueInPercent) {
      setActiveOtp(formValues?.exportDutyValueInPercent);
    }
  }, [formValues]);

  if (values)
    return (
      <div className="flex w-full overflow-x-scroll hide-scroll-bar mt-4">
        <div className="flex w-full flex-nowrap space-x-[7px]">
          {[20, 25, 30, 35, 40, 45, 50, 100].map((opt, optIndex) => {
            let selected =
              "border-[1px] text-pwip-gray-850 border-pwip-v2-gray-300";
            let icon = null;

            if (activeOtp === opt) {
              icon = checkIcon;
              selected =
                "border-[1px] text-pwip-v2-primary-700 border-pwip-v2-primary-700";
            }

            return (
              <div
                className="inline-block"
                key={opt + "_" + optIndex}
                onClick={() => {
                  setFieldValue("exportDutyValueInPercent", opt);
                  setActiveOtp(opt);
                  handleClick(opt);
                }}
              >
                <div
                  className={`inline-flex items-center justify-center h-auto w-auto min-w-[52px] rounded-md bg-pwip-v2-gray-50 ${selected} px-3 py-[6px] font-sans transition-all`}
                >
                  {icon ? <div className="mr-[10px]">{icon}</div> : null}
                  <span className="font-[600] text-xs">{opt}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  if (!values) {
    return <></>;
  }
}

function compareObjects(values, customCostingSelection) {
  const mapping = {
    _variantId: "product",
    brokenPercentage: "brokenPercentage",
    _bagId: "bags",
    bagSize: "bags.weight",
    _originId: "portOfOrigin",
    _destinationId: "portOfDestination",
    _containerId: "containers",
    containersCount: "containersCount",
    // containerWeight: "containersWeight",
    costOfRice: "exMillPrice",
    bagPrice: "bagCost",
    transportation: "transportation",
    cfsHandling: "chaCost",
    shl: "shlCost",
    ofc: "ofcCost",
    inspectionCost: "constants.inspectionCharge",
    financeCost: "constants.financeCost",
    overheads: "constants.overHeadCharge",
    margin: "constants.margin",
    exportDuty: "constants.exportDutyCharge",
    exportDutyValue: "constants.exportDutyCharge",
  };

  for (const valuesKey in mapping) {
    let valuesKeyValue = getNestedValue(values, valuesKey);
    let customKey = getNestedValue(customCostingSelection, mapping[valuesKey]);

    if (valuesKey === "exportDuty" && valuesKeyValue === false) {
      customKey = 0;
      valuesKeyValue = 0;
    }

    if (
      valuesKey === "ofc" &&
      customCostingSelection.constants.exportDutyCharge === 0
    ) {
      customKey = 0;
      valuesKeyValue = 0;
    }

    if (isObject(valuesKeyValue) && isObject(customKey)) {
      // Check the _id key for objects
      if (valuesKeyValue._id !== customKey._id) {
        return false;
      }
    } else if (valuesKeyValue !== customKey) {
      return false;
    }
  }

  return true;
}

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function getNestedValue(obj, path) {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

const calculateGrandTotal = (formValues, shipmentTerm) => {
  const {
    costOfRice,
    bagPrice,
    transportation,
    cfsHandling,
    shl,
    ofc,
    inspectionCost,
    financeCost,
    overheads,
    margin,
    exportDuty,
    exportDutyValue,
  } = formValues;

  const shipmentTermAdjustmentForOFC =
    shipmentTerm === "FOB" ? 0 : parseFloat(ofc);
  const exportDutyAdjustment = exportDuty ? parseFloat(exportDutyValue) : 0;

  const grandTotal =
    parseFloat(costOfRice) +
    parseFloat(bagPrice) +
    parseFloat(transportation) +
    parseFloat(cfsHandling) +
    parseFloat(shl) +
    shipmentTermAdjustmentForOFC +
    parseFloat(inspectionCost) +
    parseFloat(financeCost) +
    parseFloat(overheads) +
    parseFloat(margin) +
    exportDutyAdjustment;

  return grandTotal;
};

const lineBetweenLocation = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="2"
    viewBox="0 0 32 2"
    fill="none"
    className="w-auto"
  >
    <path
      d="M0.682129 1L60.8784 1"
      stroke="currentColor"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
);

const tabsItems = [
  {
    title: "Product & transportation",
    description: "Rice, POD, POL, OFC, etc",
  },

  {
    title: "Bags & containers",
    description: "Bags, bag price, containers",
  },

  {
    title: "Handling & Inspection",
    description: "CHA, SHL, etc",
  },

  {
    title: "Other Charges",
    description: "Finance cost, overheads, etc",
  },
];

function sumNumericalValues(obj) {
  let total = 0;

  for (const key in obj) {
    if (
      !isNaN(obj[key]) &&
      !["pqc", "surrender", "blFee", "shlCharge", "chaCharge"].includes(key)
    ) {
      total += parseFloat(obj[key]);
    }
  }

  return total;
}

function calculateCurrentRicePrice(originalRicePrice, brokenPercent) {
  // Ensure brokenPercent is within the valid range [0, 100]
  brokenPercent = Math.min(100, Math.max(0, brokenPercent));

  // Calculate the adjustment factor based on brokenPercent
  let adjustmentFactor = Math.floor(brokenPercent / 5) * 0.3;

  // Calculate the current rice price
  let currentRicePrice = originalRicePrice - adjustmentFactor;

  return currentRicePrice;
}

const initialValues = {
  costingName: "",
  _variantId: {},
  brokenPercentage: "",
  _bagId: {},
  bagSize: "",
  _originId: {},
  _destinationId: {},
  _containerId: {},
  containersCount: "",
  containerWeight: "",
  exportDuty: false,
  exportDutyValue: 0,

  // breakup
  costOfRice: "",
  bagPrice: "",
  transportation: "",
  cfsHandling: "",
  shl: "",
  ofc: "",
  inspectionCost: "",
  financeCost: "",
  overheads: "",
  margin: "",
};

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

function EditCosting() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const formik = useRef();
  const bottomSheetInputRef = useRef();
  const bottomSheetSecondaryInputRef = useRef();

  const [
    pageConstructedForInitialization,
    setPageConstructedForInitialization,
  ] = React.useState(false);

  const [grandTotal, setGrandTotal] = React.useState(0);

  const [customCostingSelection, setCustomCostingSelectionItem] =
    React.useState(null);
  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [selectedUnitForPayload, setSelectedUnitForPayload] =
    React.useState("mt");

  // const [highlightBottomInput, setHighlightBottomInput] = React.useState(0);

  const packagingBags = useSelector((state) => state.bags);
  const authToken = useSelector((state) => state.auth.token);
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const shipmentTerm = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.selected
  );
  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const customCostingSelectionFromSelector = useSelector(
    (state) => state.costing.customCostingSelection
  );
  const forexRate = useSelector((state) => state.utils.forexRate);
  const selectedMyCostingFromHistory = useSelector((state) => {
    if (
      state.myCosting &&
      state.myCosting.currentCostingFromHistory &&
      state.myCosting.currentCostingFromHistory.length
    ) {
      return state.myCosting.currentCostingFromHistory[0];
    }
    return null;
  });
  const myRecentSavedCosting = useSelector(
    (state) => state.myCosting.myRecentSavedCosting
  );

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

  async function getProductList() {
    try {
      dispatch(fetchProductsRequest());
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (authToken) {
      getProductList();
    }
  }, [authToken]);

  useEffect(() => {
    dispatch(fetchMyCostingFailure());
  }, []);

  useEffect(() => {
    if (
      customCostingSelectionFromSelector &&
      !customCostingSelection?.product
    ) {
      setSelectedUnitForPayload(
        customCostingSelectionFromSelector?.unit || "mt"
      );
      setCustomCostingSelectionItem(customCostingSelectionFromSelector);
    }
  }, [customCostingSelectionFromSelector, customCostingSelection]);

  const constructPage = async () => {
    await dispatch(fetchMyCostingRequest(myRecentSavedCosting._id));
    await dispatch(fetchPackagingBagsRequest());
    await dispatch(fetchContainersRequest());
    setPageConstructedForInitialization(true);
  };

  useEffect(() => {
    if (myRecentSavedCosting && !selectedMyCostingFromHistory && !isGenerated) {
      constructPage();
    }
  }, [myRecentSavedCosting, selectedMyCostingFromHistory, isGenerated]);

  useEffect(() => {
    const previewCostingId = sessionStorage?.getItem("previewIdData");

    if (previewCostingId) {
      sessionStorage.removeItem("previewIdData");
    }
  }, []);

  useEffect(() => {
    if (selectedMyCostingFromHistory && pageConstructedForInitialization) {
      const customCostingMapping = {
        bags: selectedMyCostingFromHistory?.details?.packageDetails,
        chaData: selectedMyCostingFromHistory,
        containers: selectedMyCostingFromHistory?.details?.containerObject,
        portOfDestination:
          selectedMyCostingFromHistory?.details?.destinationObject,
        portOfOrigin: selectedMyCostingFromHistory?.details?.originPortObject,
        product: {
          ...selectedMyCostingFromHistory?.details?.variantObject,
          sourceObject: selectedMyCostingFromHistory?.details?.sourceObject,
        },
        brokenPercentage: selectedMyCostingFromHistory?.brokenPercentage || 0,
        exMillPrice: selectedMyCostingFromHistory?.costing?.exmillPrice,
        // selectedMyCostingFromHistory?.details?.variantObject?.sourceRates.find(
        //   (d) =>
        //     d._sourceId ===
        //     selectedMyCostingFromHistory?.details?.sourceObject?._id
        // )?.price,
        unit: selectedMyCostingFromHistory?.unit,
        containersCount:
          selectedMyCostingFromHistory?.details?.containerCount || 1,
        transportation: selectedMyCostingFromHistory?.costing?.transportCharge,
        shlCost: selectedMyCostingFromHistory?.costing?.shlCost,
        chaCost: selectedMyCostingFromHistory?.costing?.cfsHandling,
        ofcCost: selectedMyCostingFromHistory?.costing?.ofcCost,
        bagCost: selectedMyCostingFromHistory?.costing?.package,
        constants: selectedMyCostingFromHistory?.constants,
        ofcData: null,
        shlData: null,
      };

      const originId =
        selectedMyCostingFromHistory.details.originPortObject._id;
      const destinationId =
        selectedMyCostingFromHistory.details.destinationObject._id;

      setPageConstructedForInitialization(false);

      callFetchCHAandSHLandOFCCost(
        originId,
        destinationId,
        customCostingMapping
      );
    }
  }, [selectedMyCostingFromHistory, pageConstructedForInitialization]);

  async function saveCustomCostingToHistory() {
    const saveHistoryPayload = getCostingToSaveHistoryPayload(
      {
        ...generatedCosting,
        costingName: formik.current.values.costingName,
      },
      shipmentTerm
    );

    let payloadBody = {
      ...saveHistoryPayload,
      isQuickCosting: false,
      unit: selectedUnitForPayload,
      isExportDuty: formik.current.values.exportDuty,
      brokenPercentage: formik.current.values.brokenPercentage || 5,
      containersCount: parseFloat(formik.current.values.containersCount),
      _containerId: formik.current.values._containerId._id,
    };

    if (!formik.current.values.exportDuty) {
      payloadBody.exportDuty = 0;
    }

    await dispatch(saveCostingRequest(payloadBody));
    await dispatch(fetchMyCostingFailure());
    await dispatch(fetchGeneratedCostingFailure());
    await dispatch(saveCostingFailure());
    await dispatch(updateCostingFailure());
    await dispatch(resetCustomCostingSelection());

    setIsGenerated(false);
    router.back("/export-costing/costing");
  }

  useEffect(() => {
    if (generatedCosting && isGenerated) {
      saveCustomCostingToHistory();
    }
  }, [generatedCosting, isGenerated]);

  useEffect(() => {
    if (formik && formik.current && customCostingSelection) {
      const formikRef = formik.current;

      const formValues = formikRef?.values || {};

      let customProductPrice = customCostingSelection?.exMillPrice;

      if (customCostingSelection && customProductPrice) {
        customProductPrice = customCostingSelection?.exMillPrice;
        // convertUnits(
        //   "kg",
        //   customCostingSelection.unit,
        //   customCostingSelection?.exMillPrice
        // );
      }

      let breakUpFormValues = {
        ...formValues,
        _variantId: customCostingSelection?.product,
        brokenPercentage:
          formik.current.values.brokenPercentage ||
          customCostingSelection?.brokenPercentage ||
          0,
        _bagId: customCostingSelection?.bags,
        bagSize: customCostingSelection?.bags?.weight,
        _originId: customCostingSelection?.portOfOrigin,
        _destinationId: customCostingSelection?.portOfDestination,
        _containerId: customCostingSelection?.containers,
        containersCount: customCostingSelection?.containersCount || 1,
        containerWeight:
          customCostingSelection?.containersWeight ||
          customCostingSelection?.containers?.weight,

        // Breakup values
        costOfRice: customProductPrice || 0,
        bagPrice: customCostingSelection?.bagCost,
        transportation: customCostingSelection?.transportation,
        cfsHandling: customCostingSelection?.chaCost,
        shl: customCostingSelection?.shlCost,
        ofc: shipmentTerm === "FOB" ? 0 : customCostingSelection?.ofcCost,
        inspectionCost: customCostingSelection?.constants?.inspectionCharge,
        financeCost: customCostingSelection?.constants?.financeCost,
        overheads: customCostingSelection?.constants?.overHeadCharge,
        margin: customCostingSelection?.constants?.margin,
        exportDuty: customCostingSelection?.constants?.exportDutyCharge
          ? true
          : false,
        exportDutyValue:
          customCostingSelection?.constants?.exportDutyCharge || 0,
      };

      formikRef.setValues(breakUpFormValues);
    }
  }, [formik, customCostingSelection]);

  useEffect(() => {
    if (formik?.current?.values && !isBottomSheetOpen) {
      const grandTotal = calculateGrandTotal(
        {
          ...formik?.current?.values,
        },
        shipmentTerm
      );

      setGrandTotal(grandTotal);
    }
  }, [formik?.current?.values, isBottomSheetOpen]);

  useEffect(() => {
    if (customCostingSelection?.bags) {
      breakupArr[0].rowItems[1].label = customCostingSelection?.bags
        ? `${customCostingSelection?.bags?.bag}-${customCostingSelection?.bags?.weight}${customCostingSelection?.bags?.unit}`
        : "";
    }
  }, [breakupArr, customCostingSelection]);

  useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  // scroll behaviour

  function scrollActiveTab(index) {
    setActiveTab(index);

    const tabsContainer = document.getElementById("tabContainer");
    const activeTabElement = document.getElementById(`tabElement_${index}`);

    // Scroll the container to bring the active tab into view
    if (activeTabElement) {
      const containerWidth = tabsContainer.offsetWidth;
      const tabOffset = activeTabElement.offsetLeft;
      const tabWidth = activeTabElement.offsetWidth;
      const scrollPosition =
        tabOffset - ((containerWidth - tabWidth) / tabsItems.length) * 2;

      tabsContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }

  // scroll behaviour function ends here

  async function fetchCHAandSHLandOFCCost(originId, destinationId) {
    try {
      const responseCHA = await api.get(
        `/cha?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const responseSHL = await api.get(
        `/shl?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const responseOFC = await api.get(
        `/ofc?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = {
        shl: responseSHL?.data || [],
        ofc: responseOFC?.data || [],
        cha: responseCHA?.data || [],
      };

      return response;
    } catch (error) {
      // Dispatch a failure action in case of an error
      return error;
    }
  }

  async function callFetchCHAandSHLandOFCCost(
    originId,
    destinationId,
    customMapping
  ) {
    const response = await fetchCHAandSHLandOFCCost(originId, destinationId);

    if (response) {
      dispatch(
        setCustomCostingSelection({
          ...selectedCosting,
          customCostingSelection: {
            ...customMapping,
            shlData: response?.shl[0]?.destinations[0],
            ofcData: response?.ofc[0]?.destinations[0],
            chaData: response?.cha[0]?.destinations[0],
          },
        })
      );

      dispatch(
        fetchOriginRequest(
          selectedMyCostingFromHistory?.details?.sourceObject?._id
        )
      );
      dispatch(
        fetchDestinationRequest(
          null,
          selectedMyCostingFromHistory?.details?.originPortObject?._id
        )
      );
    }
  }

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Edit costing | PWIP</title>

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
        <div
          className={`fixed visible z-20 top-0 left-0 right-0 opacity-1 h-auto bg-pwip-v2-primary-700 px-5 py-2 transition-all duration-500`}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col items-start flex-grow w-[65%] max-w-[40%] overflow-hidden pr-3">
              <div
                className="inline-flex items-center space-x-2 text-white text-sm"
                onClick={() => {
                  router.back();
                }}
              >
                {arrowLeftBackIcon}
                <span>Back</span>
              </div>
              {/* <span className="text-white text-xs font-normal font-sans line-clamp-1">
                {customCostingSelection?.product?.variantName || "-/-"}
              </span>

              <div className="w-full mt-[8px] flex items-center justify-between space-x-2">
                <div className="inline-flex items-center space-x-3 max-w-[28%]">
                  <span className="text-white text-xs font-[700] font-sans line-clamp-1">
                    {customCostingSelection?.portOfOrigin?.portName ===
                    "Visakhapatnam Port"
                      ? "Vizag Port"
                      : customCostingSelection?.portOfOrigin?.portName}
                  </span>
                </div>

                <div className="inline-flex items-center space-x-3 text-white">
                  {lineBetweenLocation}
                </div>

                <div className="inline-flex items-center space-x-3">
                  <span className="text-white text-xs font-[700] font-sans line-clamp-1">
                    {customCostingSelection?.product?.sourceRates
                      ?.sourceName === "Visakhapatnam" ||
                    customCostingSelection?.product?.sourceObject?.region ===
                      "Visakhapatnam"
                      ? "Vizag"
                      : customCostingSelection?.product?.sourceRates
                          ?.sourceName ||
                        customCostingSelection?.product?.sourceObject?.region}
                  </span>
                </div>

                <div className="inline-flex items-center space-x-3 text-white">
                  {lineBetweenLocation}
                </div>

                <div className="inline-flex items-center space-x-3">
                  <span className="text-white text-xs font-[700] font-sans line-clamp-1">
                    {customCostingSelection?.portOfDestination?.portName ||
                      selectedMyCostingFromHistory?.details?.destinationObject
                        ?.portName}
                  </span>
                </div>
              </div> */}
            </div>

            <div className="flex justify-end w-[35%]">
              <div className="inline-flex flex-col space-x-1 text-pwip-v2-green-700">
                <span className="text-white text-xs font-[700] font-sans line-clamp-1 text-right">
                  Total ({shipmentTerm})
                </span>
                <div className="inline-flex items-end justify-end space-x-1 text-right text-sm text-pwip-v2-green-700">
                  <span className="font-[700] font-sans line-clamp-1">
                    ${inrToUsd(grandTotal || 0, forexRate.USD)}
                  </span>
                  <span className="font-[400] font-sans line-clamp-1 mt-[6px]">
                    /{selectedUnitForPayload}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Header />

        <div
          id="fixedMenuSection"
          className="fixed top-[58px] h-[auto] w-full bg-pwip-gray-45 z-10"
        >
          <div
            className={`flex overflow-x-scroll hide-scroll-bar`}
            id="tabContainer"
          >
            <div className="flex flex-nowrap">
              {[...tabsItems].map((item, index) => {
                return (
                  <div
                    id={`tabElement_${index}`}
                    key={item.title + "_" + index}
                    onClick={() => scrollActiveTab(index)}
                    className="inline-block px-5 py-[14px] bg-pwip-v2-gray-100 border-r-[1px] border-r-pwip-v2-gray-300 transition-opacity"
                    style={{
                      opacity: activeTab === index ? 1 : 0.3,
                      borderBottom:
                        activeTab === index ? "2px solid #006EB4" : "unset",
                    }}
                  >
                    <div className="overflow-hidden w-auto h-auto inline-flex flex-col items-start space-y-[4px]">
                      <span className="text-pwip-v2-primary-700 font-[600] text-sm whitespace-nowrap">
                        {item.title}
                      </span>
                      <span className="text-pwip-gray-600 font-[400] text-xs line-clamp-1">
                        {item.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`min-h-screen h-full w-full bg-pwip-v2-gray-50 pb-[32px] overflow-auto hide-scroll-bar`}
          style={{
            paddingTop: mainContainerHeight + 68 + "px",
            paddingBottom: "82px",
          }}
        >
          <Formik
            innerRef={formik}
            initialValues={{
              ...initialValues,
            }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="inline-flex flex-col w-full"
                onSubmit={handleSubmit}
              >
                {[
                  {
                    tab: 0,
                    section: [
                      {
                        cardTitle: "Update rice",
                        icon: riceCardIcon,
                        form: [
                          {
                            label: "Select a variety of rice",
                            type: "select",
                            name: "_variantId",
                            placeholder: "Ex: Sona masuri",
                            value: values?._variantId?.variantName || "",
                          },
                          {
                            label: "Ex-mill price",
                            type: "input",
                            name: "costOfRice",
                            placeholder: "Ex: 52.5",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.costOfRice ? values?.costOfRice : "",
                          },
                          {
                            label: "Broken %",
                            type: "tagSelect",
                            name: "brokenPercentage",
                            placeholder: "5%",
                            value: values?.brokenPercentage || "",
                            option: [5, 10, 15, 20, 25, 100],
                          },
                        ],
                      },

                      {
                        cardTitle: "Update location",
                        icon: locationCardIcon,
                        form: [
                          {
                            label: "Select port of origin",
                            type: "select",
                            name: "_originId",
                            placeholder: "Ex: Vizag port",
                            value:
                              values?._originId?.portName ||
                              values?._originId?.originPortName ||
                              "",
                          },
                          {
                            label: "Select port of destination",
                            type: "select",
                            name: "_destinationId",
                            placeholder: "Ex: Singapore",
                            value: values?._destinationId?.portName || "",
                          },
                        ],
                      },

                      {
                        cardTitle: "Transportation",
                        icon: transportationCardIcon,
                        form: [
                          {
                            label: "Enter cost of transportation",
                            type: "input",
                            name: "transportation",
                            placeholder: "",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.transportation,
                            showDescription: true,
                            fieldDescription: `The cost of transport from mill (sourcing) location to the port of loading (origin)`,
                          },
                        ],
                      },

                      {
                        cardTitle: "Ocean freight charges (OFC)",
                        icon: ofcCardIcon,
                        form: [
                          {
                            label: "Enter OFC",
                            type: "input",
                            name: "ofc",
                            placeholder: "",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.ofc,
                            showDescription: values?.ofc ? true : false,
                            fieldDescription: `OFC is calculated per container basis, 1 container is 26 tonnes, so OFC will be ₹${(
                              values?.ofc * 26
                            ).toFixed(2)} ($${inrToUsd(
                              values?.ofc * 26,
                              forexRate.USD
                            )}) per container`,
                          },
                        ],
                      },
                    ],
                  },

                  {
                    tab: 1,
                    section: [
                      {
                        cardTitle: "Update bags",
                        icon: bagsCardIcon,
                        form: [
                          {
                            label: "Select a bag type",
                            type: "select",
                            name: "_bagId",
                            placeholder: "Ex: Jute",
                            value: values?._bagId?.bag || "",
                          },
                          {
                            label: "Select a bag size",
                            type: "inputTagSelect",
                            name: "bagSize",
                            showCurrency: false,
                            option:
                              packagingBags?.bags
                                ?.filter((f) => f.bag === values?._bagId?.bag)
                                .sort((a, b) => a.weight - b.weight) || [],
                            hideUSD: true,
                            placeholder: "Ex: 15kg",
                            unit: `${values?._bagId?.unit}`,
                            value: `${values?.bagSize}` || "",
                          },
                          {
                            label: "Bag cost",
                            type: "input",
                            name: "bagPrice",
                            showCurrency: true,
                            placeholder: "Ex: 10.5",
                            unit: selectedUnitForPayload,
                            value: values?.bagPrice ? values?.bagPrice : "",
                            showDescription: true,
                            fieldDescription:
                              "Bag cost per ton is calculated based on the bag size that you select.",
                          },
                        ],
                      },

                      {
                        cardTitle: "Update containers",
                        icon: containerCardIcon,
                        form: [
                          {
                            label: "Select a container type",
                            type: "select",
                            name: "_containerId",
                            placeholder: "",
                            value: `${values?._containerId?.type || ""} ${
                              values?._containerId?.size || ""
                            }`,
                          },
                          {
                            label: "Number of containers",
                            type: "input",
                            name: "containersCount",
                            placeholder: "",
                            hideUSD: true,
                            value: values?.containersCount || "",
                          },
                          {
                            label: "Container weight",
                            type: "input",
                            name: "containerWeight",
                            hideUSD: true,
                            hideUnit: false,
                            unit: "mt",
                            placeholder: "",
                            value: values?.containerWeight || "",
                          },
                        ],
                      },
                    ],
                  },

                  {
                    tab: 2,
                    section: [
                      {
                        cardTitle: "Update SHL",
                        icon: shlCardIcon,
                        form: [
                          {
                            label: "Enter SHL",
                            type: "input",
                            name: "shl",
                            placeholder: "",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.shl,
                            showDescription: true,
                            fieldDescription: `SHL is calculated per container basis, 1 container is 26 tonnes, so SHL will be ₹${(
                              values?.shl * 26
                            ).toFixed(2)} ($${inrToUsd(
                              values?.shl * 26,
                              forexRate.USD
                            )}) per container`,
                          },
                        ],
                      },

                      {
                        cardTitle: "Update CHA",
                        icon: chaCardIcon,
                        form: [
                          {
                            label: "Enter CHA",
                            type: "input",
                            name: "cfsHandling",
                            placeholder: "",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.cfsHandling,
                            showDescription: true,
                            fieldDescription: `CHA is calculated per container basis, 1 container is 26 tonnes, so CHA will be ₹${(
                              values?.cfsHandling * 26
                            ).toFixed(2)} ($${inrToUsd(
                              values?.cfsHandling * 26,
                              forexRate.USD
                            )}) per container`,
                          },
                        ],
                      },

                      {
                        cardTitle: "Inspection Cost",
                        icon: inspectionCardIcon,
                        form: [
                          {
                            label: "Enter cost of inspection",
                            type: "input",
                            name: "inspectionCost",
                            placeholder: "",
                            showCurrency: true,
                            unit: selectedUnitForPayload,
                            value: values?.inspectionCost,
                          },
                        ],
                      },
                    ],
                  },

                  {
                    tab: 3,
                    section: [
                      {
                        cardTitle: "Finance Cost",
                        icon: financeCardIcon,
                        form: [
                          {
                            label: "Enter finance cost",
                            type: "input",
                            name: "financeCost",
                            placeholder: "",
                            showCurrency: true,
                            hideUnit: true,
                            value: values?.financeCost,
                          },
                        ],
                      },

                      {
                        cardTitle: "Overheads",
                        icon: overheadsCardIcon,
                        form: [
                          {
                            label: "Enter overheads",
                            type: "input",
                            name: "overheads",
                            placeholder: "",
                            showCurrency: true,
                            hideUnit: true,
                            value: values?.overheads,
                          },
                        ],
                      },

                      {
                        cardTitle: "Margin",
                        icon: marginCardIcon,
                        form: [
                          {
                            label: "Enter margin",
                            type: "input",
                            name: "margin",
                            placeholder: "",
                            showCurrency: true,
                            hideUnit: true,
                            value: values?.margin,
                          },
                        ],
                      },

                      {
                        cardTitle: "Export duty",
                        icon: dutyCardIcon,
                        form: [
                          {
                            label: "Enter your own duty (default is 20%)",
                            type: "input",
                            name: "exportDutyValue",
                            placeholder: "",
                            showCurrency: true,
                            hideUnit: true,
                            value: values?.exportDutyValue,
                          },
                        ],
                      },
                    ],
                  },
                ].map((sec, secIndex) => {
                  return (
                    <React.Fragment key={"section" + "_#" + secIndex}>
                      {sec.tab === activeTab ? (
                        <React.Fragment>
                          {sec.section.map((d, i) => {
                            const fieldName = d.form.find((d) => d.name)?.name;

                            const showSecondInput = [
                              "ofc",
                              "shl",
                              "cfsHandling",
                              "inspectionCost",
                            ].includes(fieldName);

                            return (
                              <React.Fragment key={d.cardTitle + " " + i}>
                                {fieldName === "exportDutyValue" ? (
                                  <div className="inline-flex items-center py-8 px-5 space-x-4">
                                    <input
                                      type="checkbox"
                                      checked={values?.exportDuty}
                                      name="exportDuty"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="text-pwip-v2-primary h-[17px] w-[17px] rounded-md"
                                    />
                                    <label
                                      onClick={() => {
                                        setFieldValue(
                                          "exportDuty",
                                          !values.exportDuty
                                        );
                                        // HEYYY

                                        if (!values.exportDuty) {
                                          if (
                                            !values?.exportDutyBaseGrandTotal
                                          ) {
                                            setFieldValue(
                                              "exportDutyBaseGrandTotal",
                                              grandTotal
                                            );
                                          }

                                          let defaultDuty = grandTotal * 0.2;

                                          if (
                                            values?.exportDutyBaseGrandTotal
                                          ) {
                                            defaultDuty =
                                              values?.exportDutyBaseGrandTotal *
                                              0.2;
                                          }

                                          setGrandTotal(
                                            (
                                              Number(grandTotal) +
                                              Number(defaultDuty)
                                            ).toFixed(2)
                                          );
                                          setFieldValue(
                                            "exportDutyValue",
                                            defaultDuty.toFixed(2)
                                          );
                                        } else {
                                          setFieldValue("exportDutyValue", 0);
                                          setGrandTotal(
                                            values?.exportDutyBaseGrandTotal
                                          );
                                        }
                                      }}
                                      className="text-sm font-[500] text-pwip-black-600"
                                    >
                                      Export duty applicable
                                    </label>
                                  </div>
                                ) : null}
                                <div
                                  className="bg-white w-full h-auto px-5 py-7 mb-3 transition-opacity"
                                  style={{
                                    opacity:
                                      !values?.exportDuty &&
                                      fieldName === "exportDutyValue"
                                        ? 0.25
                                        : 1,
                                  }}
                                >
                                  <div className="inline-flex items-center space-x-2 mb-6">
                                    {d.icon}
                                    <h2 className="text-pwip-v2-primary font-[700] text-lg">
                                      {d.cardTitle}
                                    </h2>
                                  </div>

                                  <div className="inline-flex w-full flex-col space-y-5">
                                    {d.form.map((field, index) => {
                                      let secondFieldDefaultValue = 0;

                                      if (showSecondInput) {
                                        secondFieldDefaultValue =
                                          field?.value * 26;
                                      }

                                      return (
                                        <div
                                          key={field.label + index}
                                          className="inline-flex flex-col w-full"
                                        >
                                          <label className="text-sm font-[500] text-pwip-black-600">
                                            {field.label}
                                          </label>
                                          {field.type === "select" ? (
                                            <div className="inline-flex items-center relative mt-2">
                                              <input
                                                placeholder={field.placeholder}
                                                type="text"
                                                name={field.name}
                                                readOnly={true}
                                                value={field?.value || ""}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onClick={() => {
                                                  if (
                                                    field.name === "_variantId"
                                                  ) {
                                                    const content = (
                                                      <div>
                                                        <SelectVariantContainer
                                                          roundedTop={false}
                                                          noTop={true}
                                                          noPaddingBottom={true}
                                                          isFromEdit={true}
                                                          setFieldValue={
                                                            setFieldValue
                                                          }
                                                          selectedUnitForPayload={
                                                            selectedUnitForPayload
                                                          }
                                                        />
                                                      </div>
                                                    );
                                                    openBottomSheet(content);
                                                  }

                                                  if (
                                                    field.name === "_originId"
                                                  ) {
                                                    const content = (
                                                      <div>
                                                        <SelectLocationContainer
                                                          title="Select Port of Origin"
                                                          roundedTop={false}
                                                          noTop={true}
                                                          noPaddingBottom={true}
                                                          isFromEdit={true}
                                                          locationType="origin"
                                                          setFieldValue={
                                                            setFieldValue
                                                          }
                                                          containerWeight={parseFloat(
                                                            values?.containerWeight
                                                          )}
                                                          formValues={values}
                                                        />
                                                      </div>
                                                    );
                                                    openBottomSheet(content);
                                                  }

                                                  if (
                                                    field.name ===
                                                    "_destinationId"
                                                  ) {
                                                    const content = (
                                                      <div>
                                                        <SelectLocationContainer
                                                          title="Select Port of Destination"
                                                          roundedTop={false}
                                                          noTop={true}
                                                          noPaddingBottom={true}
                                                          isFromEdit={true}
                                                          locationType="destination"
                                                          setFieldValue={
                                                            setFieldValue
                                                          }
                                                          containerWeight={parseFloat(
                                                            values?.containerWeight
                                                          )}
                                                          formValues={values}
                                                          shipmentTerm={
                                                            shipmentTerm
                                                          }
                                                        />
                                                      </div>
                                                    );
                                                    openBottomSheet(content);
                                                  }

                                                  if (field.name === "_bagId") {
                                                    const content = (
                                                      <div>
                                                        <SelectBagsContainer
                                                          roundedTop={false}
                                                          noTop={true}
                                                          noPaddingBottom={true}
                                                          setFieldValue={
                                                            setFieldValue
                                                          }
                                                          selectedUnitForPayload={
                                                            selectedUnitForPayload
                                                          }
                                                        />
                                                      </div>
                                                    );
                                                    openBottomSheet(content);
                                                  }

                                                  if (
                                                    field.name ===
                                                    "_containerId"
                                                  ) {
                                                    const content = (
                                                      <div>
                                                        <SelectCargoContainersContainer
                                                          roundedTop={false}
                                                          noTop={true}
                                                          noPaddingBottom={true}
                                                          setFieldValue={
                                                            setFieldValue
                                                          }
                                                        />
                                                      </div>
                                                    );
                                                    openBottomSheet(content);
                                                  }
                                                }}
                                                className="inline-flex items-center h-[40px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
                                              />
                                              <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
                                                {chevronDown}
                                              </div>
                                            </div>
                                          ) : null}

                                          {field.type === "input" ? (
                                            <div
                                              className="inline-flex items-start flex-col w-full relative mt-2"
                                              onClick={() => {
                                                const content = (
                                                  <div className="px-5 mb- 5">
                                                    <h2 className="mt-4 text-pwip-v2-primary font-sans text-base font-bold">
                                                      {field.label}
                                                    </h2>

                                                    <div
                                                      className={`w-full grid ${
                                                        showSecondInput
                                                          ? "grid-cols-2 gap-2"
                                                          : "grid-cols-1"
                                                      } mt-[18px]`}
                                                    >
                                                      <div
                                                        onClick={() => {
                                                          bottomSheetInputRef?.current?.focus();

                                                          if (showSecondInput) {
                                                            const elementOne =
                                                              document.getElementById(
                                                                "inputContainerOne"
                                                              );

                                                            if (elementOne) {
                                                              elementOne.classList.add(
                                                                "!border-pwip-v2-primary-700"
                                                              );
                                                            }

                                                            const elementTwo =
                                                              document.getElementById(
                                                                "inputContainerTwo"
                                                              );

                                                            if (elementTwo) {
                                                              elementTwo.classList.remove(
                                                                "!border-pwip-v2-primary-700"
                                                              );
                                                            }
                                                          }
                                                        }}
                                                        id="inputContainerOne"
                                                        className={`transition-all inline-flex flex-col w-full bg-pwip-v2-gray-100 rounded-lg px-[24px] py-[14px] border-pwip-v2-gray-100 border-[1px] !border-pwip-v2-primary-700`}
                                                      >
                                                        <div className="text-pwip-black-600 font-[700] text-[20px] inline-flex items-center space-x-1 overflow-hidden">
                                                          {field?.name !==
                                                          "containersCount" ? (
                                                            <span>₹</span>
                                                          ) : null}
                                                          <input
                                                            ref={
                                                              bottomSheetInputRef
                                                            }
                                                            className="w-full bg-transparent outline-none border-none"
                                                            defaultValue={
                                                              field?.value
                                                            }
                                                            name={field?.name}
                                                            onChange={(e) => {
                                                              const bottomSheetUSDValueElement =
                                                                document.getElementById(
                                                                  "bottomSheetUSDValue"
                                                                );

                                                              // here modify 2nd input
                                                              if (
                                                                showSecondInput
                                                              ) {
                                                                bottomSheetSecondaryInputRef.current.value =
                                                                  (
                                                                    e.target
                                                                      .value *
                                                                    26
                                                                  ).toFixed(2);

                                                                const secondaryBottomSheetUSDValue =
                                                                  document.getElementById(
                                                                    "bottomSheetSecondaryUSDValue"
                                                                  );

                                                                if (
                                                                  secondaryBottomSheetUSDValue &&
                                                                  e.target.value
                                                                ) {
                                                                  secondaryBottomSheetUSDValue.innerText =
                                                                    "$" +
                                                                    `${inrToUsd(
                                                                      e.target
                                                                        .value *
                                                                        26,
                                                                      forexRate.USD
                                                                    )}`;
                                                                }
                                                              }
                                                              // end

                                                              if (
                                                                bottomSheetUSDValueElement &&
                                                                e.target.value
                                                              ) {
                                                                bottomSheetUSDValueElement.innerText =
                                                                  "$" +
                                                                  `${inrToUsd(
                                                                    e.target
                                                                      .value,
                                                                    forexRate.USD
                                                                  )}`;
                                                              }
                                                            }}
                                                            onBlur={(e) => {
                                                              handleBlur(e);

                                                              if (
                                                                field?.name ===
                                                                "costOfRice"
                                                              ) {
                                                                setFieldValue(
                                                                  "updatedBaseCostOfRice",
                                                                  convertUnits(
                                                                    selectedUnitForPayload,
                                                                    "kg",
                                                                    e.target
                                                                      .value
                                                                  )
                                                                );
                                                                setFieldValue(
                                                                  "updatedBaseBrokenPercentage",
                                                                  values?.brokenPercentage
                                                                );
                                                              }

                                                              if (
                                                                field?.name ===
                                                                "containersCount"
                                                              ) {
                                                                if (
                                                                  customCostingSelection.shlData &&
                                                                  customCostingSelection.chaData &&
                                                                  e.target.value
                                                                ) {
                                                                  const blFee =
                                                                    customCostingSelection
                                                                      .shlData
                                                                      .blFee;
                                                                  const blSurrender =
                                                                    customCostingSelection
                                                                      .shlData
                                                                      .surrender;

                                                                  const pqc =
                                                                    customCostingSelection
                                                                      .chaData
                                                                      .pqc;

                                                                  const updatedBlFee =
                                                                    blFee /
                                                                    parseInt(
                                                                      e.target
                                                                        .value
                                                                    );

                                                                  const updatedBlSurrender =
                                                                    blSurrender /
                                                                    parseInt(
                                                                      e.target
                                                                        .value
                                                                    );
                                                                  const updatedpqc =
                                                                    pqc /
                                                                    parseInt(
                                                                      e.target
                                                                        .value
                                                                    );

                                                                  const totalSHL =
                                                                    (sumNumericalValues(
                                                                      customCostingSelection.shlData
                                                                    ) +
                                                                      updatedBlFee +
                                                                      updatedBlSurrender) /
                                                                    parseFloat(
                                                                      values.containerWeight
                                                                    );

                                                                  const totalCHA =
                                                                    (sumNumericalValues(
                                                                      customCostingSelection.chaData
                                                                    ) +
                                                                      updatedpqc) /
                                                                    parseFloat(
                                                                      values.containerWeight
                                                                    );

                                                                  setFieldValue(
                                                                    "cfsHandling",
                                                                    totalCHA.toFixed(
                                                                      2
                                                                    )
                                                                  );

                                                                  setFieldValue(
                                                                    "shl",
                                                                    totalSHL.toFixed(
                                                                      2
                                                                    )
                                                                  );
                                                                }
                                                              }
                                                            }}
                                                            pattern="[0-9]*"
                                                            inputMode="numeric"
                                                          />
                                                        </div>

                                                        {field?.name !==
                                                        "containersCount" ? (
                                                          <React.Fragment>
                                                            <span
                                                              id="bottomSheetUSDValue"
                                                              className="text-pwip-v2-green-800 font-[400] text-sm mt-2"
                                                            >
                                                              $
                                                              {inrToUsd(
                                                                field?.value,
                                                                forexRate.USD
                                                              )}
                                                            </span>
                                                            <span className="text-pwip-v2-primary-700 font-[600] text-xs mt-2">
                                                              per{" "}
                                                              {
                                                                selectedUnitForPayload
                                                              }
                                                            </span>
                                                          </React.Fragment>
                                                        ) : null}
                                                      </div>

                                                      {/* per metric tonne */}
                                                      {showSecondInput ? (
                                                        <div
                                                          onClick={() => {
                                                            bottomSheetSecondaryInputRef.current.focus();

                                                            if (
                                                              showSecondInput
                                                            ) {
                                                              const elementOne =
                                                                document.getElementById(
                                                                  "inputContainerOne"
                                                                );

                                                              if (elementOne) {
                                                                elementOne.classList.remove(
                                                                  "!border-pwip-v2-primary-700"
                                                                );
                                                              }

                                                              const elementTwo =
                                                                document.getElementById(
                                                                  "inputContainerTwo"
                                                                );

                                                              if (elementTwo) {
                                                                elementTwo.classList.add(
                                                                  "!border-pwip-v2-primary-700"
                                                                );
                                                              }
                                                            }
                                                          }}
                                                          id="inputContainerTwo"
                                                          className={`transition-all inline-flex flex-col w-full bg-pwip-v2-gray-100 rounded-lg px-[24px] py-[14px] border-[1px] border-pwip-v2-gray-100`}
                                                        >
                                                          <div className="text-pwip-black-600 font-[700] text-[20px] inline-flex items-center space-x-1 overflow-hidden">
                                                            <span>₹</span>
                                                            <input
                                                              ref={
                                                                bottomSheetSecondaryInputRef
                                                              }
                                                              className="w-full bg-transparent outline-none border-none"
                                                              defaultValue={secondFieldDefaultValue.toFixed(
                                                                2
                                                              )}
                                                              name={field?.name}
                                                              onChange={(e) => {
                                                                const bottomSheetUSDValueElement =
                                                                  document.getElementById(
                                                                    "bottomSheetSecondaryUSDValue"
                                                                  );

                                                                bottomSheetInputRef.current.value =
                                                                  (
                                                                    e.target
                                                                      .value /
                                                                    26
                                                                  ).toFixed(2);

                                                                const primaryBottomSheetUSDValue =
                                                                  document.getElementById(
                                                                    "bottomSheetUSDValue"
                                                                  );

                                                                if (
                                                                  primaryBottomSheetUSDValue &&
                                                                  e.target.value
                                                                ) {
                                                                  bottomSheetUSDValueElement.innerText =
                                                                    "$" +
                                                                    `${inrToUsd(
                                                                      e.target
                                                                        .value *
                                                                        26,
                                                                      forexRate.USD
                                                                    )}`;
                                                                }

                                                                if (
                                                                  bottomSheetUSDValueElement &&
                                                                  e.target.value
                                                                ) {
                                                                  bottomSheetUSDValueElement.innerText =
                                                                    "$" +
                                                                    `${inrToUsd(
                                                                      e.target
                                                                        .value,
                                                                      forexRate.USD
                                                                    )}`;
                                                                }
                                                              }}
                                                              onBlur={
                                                                handleBlur
                                                              }
                                                              pattern="[0-9]*"
                                                              inputMode="numeric"
                                                            />
                                                          </div>

                                                          {field?.name !==
                                                          "containersCount" ? (
                                                            <React.Fragment>
                                                              <span
                                                                id="bottomSheetSecondaryUSDValue"
                                                                className="text-pwip-v2-green-800 font-[400] text-sm mt-2"
                                                              >
                                                                $
                                                                {inrToUsd(
                                                                  secondFieldDefaultValue,
                                                                  forexRate.USD
                                                                )}
                                                              </span>
                                                              <span className="text-pwip-v2-primary-700 font-[600] text-xs mt-2">
                                                                {showSecondInput
                                                                  ? "container"
                                                                  : selectedUnitForPayload}
                                                              </span>
                                                            </React.Fragment>
                                                          ) : null}
                                                        </div>
                                                      ) : null}
                                                    </div>

                                                    {fieldName ===
                                                    "exportDutyValue" ? (
                                                      <ExportDutyPercentageBar
                                                        setFieldValue={
                                                          setFieldValue
                                                        }
                                                        formValues={values}
                                                        handleClick={(per) => {
                                                          const exportDutyFormValue =
                                                            grandTotal *
                                                            (per / 100);

                                                          bottomSheetInputRef.current.value =
                                                            exportDutyFormValue.toFixed(
                                                              2
                                                            );

                                                          setFieldValue(
                                                            "exportDutyValue",
                                                            exportDutyFormValue.toFixed(
                                                              2
                                                            )
                                                          );
                                                        }}
                                                      />
                                                    ) : null}

                                                    <div className="inline-flex items-center w-full space-x-5 mt-[30px]">
                                                      <Button
                                                        type="outline"
                                                        label="Cancel"
                                                        minHeight="!min-h-[42px]"
                                                        onClick={() => {
                                                          closeBottomSheet();
                                                        }}
                                                      />
                                                      <Button
                                                        type="primary"
                                                        label="Done"
                                                        minHeight="!min-h-[42px]"
                                                        onClick={() => {
                                                          setFieldValue(
                                                            field?.name,
                                                            bottomSheetInputRef
                                                              .current.value
                                                          );

                                                          closeBottomSheet();
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                );

                                                if (
                                                  field.name ===
                                                    "exportDutyValue" &&
                                                  !values.exportDuty
                                                ) {
                                                  return null;
                                                }
                                                if (
                                                  field.name ===
                                                    "containerWeight" ||
                                                  field.name === "bagSize"
                                                ) {
                                                  return null;
                                                }
                                                openBottomSheet(
                                                  content,
                                                  () => {
                                                    bottomSheetInputRef?.current?.focus();
                                                  },
                                                  true
                                                );
                                              }}
                                            >
                                              <div
                                                className="inline-flex items-center justify-between h-[40px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] font-sans"
                                                style={{
                                                  backgroundColor:
                                                    field.name ===
                                                      "containerWeight" ||
                                                    field.name === "bagSize"
                                                      ? "#f6f6f6"
                                                      : null,
                                                }}
                                              >
                                                <div className="inline-flex items-end space-x-2">
                                                  <div className="inline-flex items-center text-pwip-gray-850 font-[700] text-xs">
                                                    {field?.showCurrency ? (
                                                      <span>₹</span>
                                                    ) : null}
                                                    <span>{field?.value}</span>
                                                  </div>
                                                  {!field?.hideUSD &&
                                                  field?.value ? (
                                                    <span className="text-pwip-v2-green-800 font-[400] text-xs">
                                                      $
                                                      {inrToUsd(
                                                        field?.value || 0,
                                                        forexRate.USD
                                                      )}
                                                    </span>
                                                  ) : null}
                                                </div>
                                                {!field?.hideUnit &&
                                                field?.unit ? (
                                                  <span className="text-pwip-v2-primary-700 font-[700] text-xs">
                                                    /{field?.unit}
                                                  </span>
                                                ) : null}
                                              </div>
                                            </div>
                                          ) : null}

                                          {field.type === "tagSelect" ? (
                                            <div className="flex w-full overflow-x-scroll hide-scroll-bar mt-2">
                                              <div className="flex w-full flex-nowrap space-x-[7px]">
                                                {field.option.map(
                                                  (opt, optIndex) => {
                                                    let selected =
                                                      "border-[1px] text-pwip-gray-850 border-pwip-v2-gray-300";
                                                    let icon = null;

                                                    if (
                                                      opt === values[field.name]
                                                    ) {
                                                      icon = checkIcon;
                                                      selected =
                                                        "border-[1px] text-pwip-v2-primary-700 border-pwip-v2-primary-700";
                                                    }

                                                    return (
                                                      <div
                                                        className="inline-block"
                                                        key={
                                                          opt + "_" + optIndex
                                                        }
                                                        onClick={() => {
                                                          if (
                                                            opt ===
                                                            values[field.name]
                                                          ) {
                                                            return null;
                                                          }

                                                          if (
                                                            field.name ===
                                                            "brokenPercentage"
                                                          ) {
                                                            const sourceRatesObj =
                                                              values?._variantId
                                                                ?.sourceRates
                                                                ?.length
                                                                ? values
                                                                    ?._variantId
                                                                    ?.sourceRates
                                                                : [
                                                                    values
                                                                      ?._variantId
                                                                      ?.sourceRates,
                                                                  ];

                                                            let ricePrice =
                                                              sourceRatesObj?.find(
                                                                (d) =>
                                                                  d?._sourceId ===
                                                                  values
                                                                    ?._variantId
                                                                    ?.sourceObject
                                                                    ?._id
                                                              )?.price;

                                                            const valueCostOfRice =
                                                              values?.updatedBaseCostOfRice;

                                                            if (
                                                              valueCostOfRice
                                                            ) {
                                                              ricePrice =
                                                                valueCostOfRice;
                                                            }

                                                            if (
                                                              values?.updatedBaseCostOfRice ||
                                                              opt ===
                                                                customCostingSelection?.brokenPercentage
                                                            ) {
                                                              // const valueCostOfRice =
                                                              //   convertUnits(
                                                              //     selectedUnitForPayload,
                                                              //     "kg",
                                                              //     values?.costOfRice
                                                              //   );

                                                              if (
                                                                values?.updatedBaseCostOfRice &&
                                                                values?.updatedBaseBrokenPercentage.toString() !==
                                                                  opt.toString()
                                                              ) {
                                                                setFieldValue(
                                                                  "costOfRice",
                                                                  convertUnits(
                                                                    "kg",
                                                                    selectedUnitForPayload,
                                                                    parseFloat(
                                                                      calculateCurrentRicePrice(
                                                                        // valueCostOfRice ||
                                                                        values?.updatedBaseCostOfRice,
                                                                        opt
                                                                      )
                                                                    )
                                                                  )
                                                                );
                                                                const grandTotal =
                                                                  calculateGrandTotal(
                                                                    {
                                                                      ...values,
                                                                      costOfRice:
                                                                        convertUnits(
                                                                          "kg",
                                                                          selectedUnitForPayload,
                                                                          parseFloat(
                                                                            calculateCurrentRicePrice(
                                                                              // valueCostOfRice ||
                                                                              values?.updatedBaseCostOfRice,
                                                                              opt
                                                                            )
                                                                          )
                                                                        ),
                                                                    },
                                                                    shipmentTerm
                                                                  );

                                                                setGrandTotal(
                                                                  grandTotal
                                                                );
                                                              } else if (
                                                                values?.updatedBaseCostOfRice &&
                                                                values?.updatedBaseBrokenPercentage.toString() ===
                                                                  opt.toString()
                                                              ) {
                                                                setFieldValue(
                                                                  "costOfRice",
                                                                  convertUnits(
                                                                    "kg",
                                                                    selectedUnitForPayload,
                                                                    parseFloat(
                                                                      values?.updatedBaseCostOfRice
                                                                    )
                                                                  )
                                                                  // valueCostOfRice ||
                                                                );

                                                                const grandTotal =
                                                                  calculateGrandTotal(
                                                                    {
                                                                      ...values,
                                                                      costOfRice:
                                                                        convertUnits(
                                                                          "kg",
                                                                          selectedUnitForPayload,
                                                                          parseFloat(
                                                                            values?.updatedBaseCostOfRice
                                                                          )
                                                                        ),
                                                                      // valueCostOfRice ||
                                                                      // values?.updatedBaseCostOfRice,
                                                                    },
                                                                    shipmentTerm
                                                                  );

                                                                setGrandTotal(
                                                                  grandTotal
                                                                );
                                                              } else {
                                                                setFieldValue(
                                                                  "costOfRice",
                                                                  // valueCostOfRice ||
                                                                  customCostingSelection?.exMillPrice
                                                                );

                                                                const grandTotal =
                                                                  calculateGrandTotal(
                                                                    {
                                                                      ...values,
                                                                      costOfRice:
                                                                        // valueCostOfRice ||
                                                                        customCostingSelection?.exMillPrice,
                                                                    },
                                                                    shipmentTerm
                                                                  );

                                                                setGrandTotal(
                                                                  grandTotal
                                                                );
                                                              }
                                                            } else {
                                                              setFieldValue(
                                                                "costOfRice",
                                                                convertUnits(
                                                                  "kg",
                                                                  selectedUnitForPayload,
                                                                  parseFloat(
                                                                    calculateCurrentRicePrice(
                                                                      // valueCostOfRice ||
                                                                      ricePrice,
                                                                      opt
                                                                    )
                                                                  )
                                                                )
                                                              );

                                                              const grandTotal =
                                                                calculateGrandTotal(
                                                                  {
                                                                    ...values,
                                                                    costOfRice:
                                                                      convertUnits(
                                                                        "kg",
                                                                        selectedUnitForPayload,
                                                                        parseFloat(
                                                                          calculateCurrentRicePrice(
                                                                            // valueCostOfRice ||
                                                                            ricePrice,
                                                                            opt
                                                                          )
                                                                        )
                                                                      ),
                                                                  },
                                                                  shipmentTerm
                                                                );

                                                              setGrandTotal(
                                                                grandTotal
                                                              );
                                                            }
                                                          }

                                                          setFieldValue(
                                                            field.name,
                                                            opt
                                                          );
                                                        }}
                                                      >
                                                        <div
                                                          className={`inline-flex items-center justify-center h-auto w-auto min-w-[52px] rounded-md bg-pwip-v2-gray-50 ${selected} px-3 py-[6px] font-sans transition-all`}
                                                        >
                                                          {icon ? (
                                                            <div className="mr-[10px]">
                                                              {icon}
                                                            </div>
                                                          ) : null}
                                                          <span className="font-[600] text-xs">
                                                            {opt}%
                                                          </span>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            </div>
                                          ) : null}

                                          {field.type === "inputTagSelect" ? (
                                            <React.Fragment>
                                              {/* <div className="inline-flex items-center justify-between h-[40px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] font-sans my-2">
                                                <div className="inline-flex items-end space-x-2">
                                                  <div className="inline-flex items-center text-pwip-gray-850 font-[700] text-xs">
                                                    {field?.showCurrency ? (
                                                      <span>₹</span>
                                                    ) : null}
                                                    <span>{field?.value}</span>
                                                  </div>
                                                  {!field?.hideUSD &&
                                                  field?.value ? (
                                                    <span className="text-pwip-v2-green-800 font-[400] text-xs">
                                                      $
                                                      {inrToUsd(
                                                        field?.value || 0,
                                                        forexRate.USD
                                                      )}
                                                    </span>
                                                  ) : null}
                                                </div>
                                                {!field?.hideUnit &&
                                                field?.unit ? (
                                                  <span className="text-pwip-v2-primary-700 font-[700] text-xs">
                                                    /{field?.unit}
                                                  </span>
                                                ) : null}
                                              </div> */}
                                              <div className="flex w-full overflow-x-scroll hide-scroll-bar mt-2">
                                                <div className="flex w-full flex-nowrap space-x-[7px]">
                                                  {field.option.map(
                                                    (opt, optIndex) => {
                                                      let selected =
                                                        "border-[1px] text-pwip-gray-850 border-pwip-v2-gray-300";
                                                      let icon = null;

                                                      if (
                                                        opt?.weight ===
                                                        values[field.name]
                                                      ) {
                                                        icon = checkIcon;
                                                        selected =
                                                          "border-[1px] text-pwip-v2-primary-700 border-pwip-v2-primary-700";
                                                      }

                                                      return (
                                                        <div
                                                          className="inline-block"
                                                          key={
                                                            opt?.bag +
                                                            "_" +
                                                            optIndex
                                                          }
                                                          onClick={() => {
                                                            setFieldValue(
                                                              field.name,
                                                              opt?.weight
                                                            );

                                                            const bagAsPerWeight =
                                                              packagingBags?.bags.find(
                                                                (p) => {
                                                                  if (
                                                                    p.bag ===
                                                                      values
                                                                        ._bagId
                                                                        .bag &&
                                                                    p.weight ===
                                                                      opt?.weight
                                                                  ) {
                                                                    return p;
                                                                  }
                                                                }
                                                              );

                                                            if (
                                                              bagAsPerWeight &&
                                                              bagAsPerWeight?._id
                                                            ) {
                                                              setFieldValue(
                                                                "_bagId",
                                                                bagAsPerWeight
                                                              );
                                                            }

                                                            setFieldValue(
                                                              "bagPrice",
                                                              convertUnits(
                                                                opt?.unit,
                                                                selectedUnitForPayload,
                                                                opt?.cost
                                                              ) / opt?.weight
                                                            );

                                                            const grandTotal =
                                                              calculateGrandTotal(
                                                                {
                                                                  ...values,
                                                                  bagPrice:
                                                                    convertUnits(
                                                                      opt?.unit,
                                                                      selectedUnitForPayload,
                                                                      opt?.cost
                                                                    ) /
                                                                    opt?.weight,
                                                                },
                                                                shipmentTerm
                                                              );

                                                            setGrandTotal(
                                                              grandTotal
                                                            );
                                                          }}
                                                        >
                                                          <div
                                                            className={`inline-flex items-center justify-center h-auto w-auto min-w-[52px] rounded-md bg-pwip-v2-gray-50 ${selected} px-3 py-[6px] font-sans transition-all`}
                                                          >
                                                            {icon ? (
                                                              <div className="mr-[10px]">
                                                                {icon}
                                                              </div>
                                                            ) : null}
                                                            <span className="font-[600] text-xs">
                                                              {opt?.weight}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            </React.Fragment>
                                          ) : null}

                                          {field?.showDescription ? (
                                            <p className="text-sm text-[#B1B1B1] mt-2">
                                              {field.fieldDescription}
                                            </p>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  );
                })}

                <div
                  className="w-full fixed left-0 bottom-0 px-5 py-4 bg-white inline-flex items-start space-x-[20px]"
                  style={{
                    boxShadow: "0px -1px 12px #00000021",
                  }}
                >
                  {/* <div className="w-[42px]">
                    <Button
                      type="outline"
                      minHeight="!min-h-[42px]"
                      label={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M7 3L2 8M2 8L7 13M2 8H14"
                            stroke="#1B6EA7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                      onClick={() => {
                        router.back();
                      }}
                    />
                  </div> */}
                  <Button
                    type={
                      compareObjects(values, customCostingSelection) ||
                      isSubmitting ||
                      !values?._variantId ||
                      (values?._variantId &&
                        !Object?.keys(values?._variantId)?.length) ||
                      !values?._originId ||
                      (values?._originId &&
                        !Object?.keys(values?._originId)?.length) ||
                      !values?._destinationId ||
                      (values?._destinationId &&
                        !Object?.keys(values?._destinationId)?.length)
                        ? "disabled"
                        : "primary"
                    }
                    buttonType="submit"
                    label="Save to see full details"
                    minHeight="!min-h-[42px]"
                    // disabled={
                    //   isSubmitting ||
                    //   !values?._variantId ||
                    //   (values?._variantId &&
                    //     !Object?.keys(values?._variantId)?.length) ||
                    //   !values?._originId ||
                    //   (values?._originId &&
                    //     !Object?.keys(values?._originId)?.length) ||
                    //   !values?._destinationId ||
                    //   (values?._destinationId &&
                    //     !Object?.keys(values?._destinationId)?.length)
                    //     ? true
                    //     : false
                    // }
                    onClick={async () => {
                      if (
                        !values?._variantId ||
                        !values?._originId ||
                        !values?._destinationId
                      ) {
                        openToastMessage({
                          type: "info",
                          message:
                            "Please select port of origin and port of destination",
                          // autoHide: false,
                        });
                        return null;
                      }

                      if (
                        (values?._variantId &&
                          !Object?.keys(values?._variantId)?.length) ||
                        (values?._originId &&
                          !Object?.keys(values?._originId)?.length) ||
                        (values?._destinationId &&
                          !Object?.keys(values?._destinationId)?.length)
                      ) {
                        openToastMessage({
                          type: "info",
                          message:
                            "Please select port of origin and port of destination",
                          // autoHide: false,
                        });
                        return null;
                      }

                      // const subscriptionResponse =
                      //   await checkUserSubscriptionDetails();
                      // const currentPlan =
                      //   getObjectWithLatestDate(subscriptionResponse);

                      // if (
                      //   currentPlan?.total_generated_costing >=
                      //   currentPlan?.usage_cap
                      // ) {
                      //   openToastMessage({
                      //     type: "error",
                      //     message: "You have exhausted your current plan!!",
                      //     // autoHide: false,
                      //   });

                      //   return;
                      // }

                      const subscriptionResponse =
                        await checkUserSubscriptionDetails();
                      let currentPlan = null;

                      if (typeof subscriptionResponse === "object") {
                        currentPlan = subscriptionResponse;
                      }

                      if (subscriptionResponse?.length) {
                        currentPlan = subscriptionResponse[0];
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

                      if (
                        !currentPlan?.activeSubscription &&
                        !currentPlan?.userSubscriptionHistory?.length
                      ) {
                        openToastMessage({
                          type: "error",
                          message:
                            currentPlan?.message ||
                            "You have no active subscription",
                          // autoHide: false,
                        });

                        return;
                      }

                      if (!currentPlan?.activeSubscription) {
                        openToastMessage({
                          type: "error",
                          message:
                            currentPlan?.message ||
                            "You have no active subscription",
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

                      if (currentPlan?.isSubscriptionExhausted) {
                        openToastMessage({
                          type: "error",
                          message:
                            "You have exhausted your current subscription",
                          // autoHide: false,
                        });

                        return;
                      }

                      let givenData = { ...values };
                      givenData.unit =
                        selectedMyCostingFromHistory?.unit || "mt";
                      givenData.shipmentTermType = shipmentTerm;

                      givenData.variantCost = parseFloat(values?.costOfRice);
                      givenData.exportDutyValue =
                        parseFloat(values.exportDutyValue) || 0;

                      givenData.sourceId =
                        givenData?._variantId?.sourceRates?._sourceId ||
                        givenData?._variantId?.sourceObject?._id;

                      givenData._sourceId =
                        givenData?._variantId?.sourceRates?._sourceId ||
                        givenData?._variantId?.sourceObject?._id;

                      if (compareObjects(values, customCostingSelection)) {
                        openToastMessage({
                          type: "info",
                          message:
                            "No changes made, go back or make changes to save",
                          // autoHide: false,
                        });
                        return;
                      } else {
                        const payload =
                          generatePayloadForCustomCosting(givenData);
                        dispatch(generateCustomCostingRequest(payload));
                        setIsGenerated(true);
                      }

                      // const payload =
                      //   generatePayloadForCustomCosting(givenData);
                      // dispatch(generateCustomCostingRequest(payload));
                      // setIsGenerated(true);
                    }}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(EditCosting);

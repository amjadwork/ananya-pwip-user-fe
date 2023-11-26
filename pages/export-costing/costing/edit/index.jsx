import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";
import { useOverlayContext } from "@/context/OverlayContext";

import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";

import { api, inrToUsd } from "@/utils/helper";

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
  updateCostingRequest,
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
import CostingForm from "@/containers/ec/Forms/CostingForm";
import BreakupForm from "@/containers/ec/Forms/BreakupForm";

import { getCostingToSaveHistoryPayload } from "@/utils/helper";

import {
  riceCardIcon,
  locationCardIcon,
  bagsCardIcon,
  containerCardIcon,
  shlCardIcon,
  chaCardIcon,
  inspectionCardIcon,
  chevronDown,
} from "../../../../theme/icon";

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
    description: "CHA, OFC, SHL, etc",
  },

  {
    title: "Other Charges",
    description: "Finance cost, overheads, etc",
  },
];

function convertUnits(currentUnit, neededUnit, value) {
  // Define conversion factors for each unit
  const conversionFactors = {
    kg: 1,
    qt: 0.01, // 1 quintal = 10 kg
    mt: 0.001, // 1 metric ton = 1000 kg
  };

  // Check if the units are valid
  if (!conversionFactors[currentUnit] || !conversionFactors[neededUnit]) {
    return "Invalid units provided";
  }

  // Convert the price to the needed unit
  const priceInNeededUnit = (
    (value * conversionFactors[currentUnit]) /
    conversionFactors[neededUnit]
  ).toFixed(0);
  return priceInNeededUnit;
}

const initialValues = {
  costingName: "",
  _variantId: {},
  // costOfRice: "",
  brokenPercentage: "",
  _bagId: {},
  bagSize: "",
  // bagPrice: "",
  _originId: {},
  _destinationId: {},
  _containerId: {},
  containersCount: "",
  containerWeight: "",
  exportDuty: false,
  exportDutyValue: 0,
  // pwipFullfillment: false,

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
  // exportDuty: false,
  // pwipFullfillment: false,
};

function EditCosting() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { openBottomSheet } = useOverlayContext();

  const formik = useRef();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [selectedUnitForPayload, setSelectedUnitForPayload] =
    React.useState("mt");
  const [componentShipmentTerm, setComponentShipmentTerm] =
    React.useState(null);

  const authToken = useSelector((state) => state.auth.token);
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const shipmentTerm = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.selected
  );
  const isShipmentTermDropdownOpen = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.showShipmentTermDropdown
  );
  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const customCostingSelection = useSelector(
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

  React.useEffect(() => {
    setComponentShipmentTerm(shipmentTerm);
  }, [isShipmentTermDropdownOpen]);

  const handleShipmentChangeCalls = async () => {
    await dispatch(updateCostingFailure());

    const payloadBody = {
      shipmentTermType: shipmentTerm || "FOB",
      termOfAgreement: shipmentTerm || "FOB",
    };

    await dispatch(updateCostingRequest(payloadBody));
    await dispatch(updateCostingFailure());
    await dispatch(fetchMyCostingRequest(selectedMyCostingFromHistory?._id));
  };

  React.useEffect(() => {
    if (shipmentTerm && componentShipmentTerm) {
      handleShipmentChangeCalls();
    }
  }, [shipmentTerm]);

  React.useEffect(() => {
    if (generatedCosting && isGenerated) {
      const saveHistoryPayload = getCostingToSaveHistoryPayload({
        ...generatedCosting,
        costingName: formik.current.values.costingName,
      });

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

      dispatch(fetchGeneratedCostingFailure());
      dispatch(saveCostingFailure());
      dispatch(saveCostingRequest(payloadBody));
      setIsGenerated(false);
      dispatch(resetCustomCostingSelection());
      router.replace("/export-costing/costing");
    }
  }, [generatedCosting, isGenerated]);

  useEffect(() => {
    if (
      formik &&
      formik.current &&
      customCostingSelection &&
      selectedMyCostingFromHistory
    ) {
      const formikRef = formik.current;

      let customProductPrice =
        customCostingSelection?.product?.sourceRates?.price;

      if (
        customCostingSelection &&
        customCostingSelection?.product &&
        customProductPrice
      ) {
        customProductPrice = convertUnits(
          "kg",
          selectedMyCostingFromHistory.unit,
          customCostingSelection?.product?.sourceRates?.price
        );
      }

      const breakUpFormValues = {
        costingName: selectedMyCostingFromHistory?.costingName || "",
        _variantId:
          customCostingSelection?.product ||
          selectedMyCostingFromHistory?.details?.variantObject,
        brokenPercentage:
          formik.current.values.brokenPercentage ||
          customCostingSelection?.product?.brokenPercentage ||
          selectedMyCostingFromHistory?.brokenPercentage ||
          0,
        _bagId:
          customCostingSelection?.bags ||
          selectedMyCostingFromHistory?.details.packageDetails,
        bagSize:
          customCostingSelection?.bags?.weight ||
          selectedMyCostingFromHistory?.details.packageDetails.weight,
        _originId:
          customCostingSelection?.portOfOrigin ||
          selectedMyCostingFromHistory?.details?.originPortObject,
        _destinationId:
          customCostingSelection?.portOfDestination ||
          selectedMyCostingFromHistory?.details.destinationObject,
        _containerId:
          customCostingSelection?.containers ||
          selectedMyCostingFromHistory?.details?.containerObject,
        containersCount:
          customCostingSelection?.containerCount ||
          selectedMyCostingFromHistory?.details?.containerCount ||
          1,
        containerWeight:
          customCostingSelection?.containersWeight ||
          customCostingSelection?.containers?.weight ||
          selectedMyCostingFromHistory?.details?.containerObject.weight,

        // Breakup values
        costOfRice:
          customProductPrice ||
          selectedMyCostingFromHistory?.costing?.exmillPrice ||
          0,
        bagPrice:
          customCostingSelection?.bags?.cost ||
          selectedMyCostingFromHistory?.costing?.package,
        transportation:
          customCostingSelection?.transportation ||
          selectedMyCostingFromHistory?.costing?.transportCharge,
        cfsHandling:
          customCostingSelection?.cha ||
          selectedMyCostingFromHistory?.costing?.cfsHandling,
        shl:
          customCostingSelection?.shl ||
          selectedMyCostingFromHistory?.costing?.shlCost,
        ofc:
          shipmentTerm === "FOB"
            ? 0
            : customCostingSelection?.ofc
            ? customCostingSelection?.ofc
            : selectedMyCostingFromHistory?.costing?.ofcCost,
        inspectionCost:
          selectedMyCostingFromHistory?.constants?.inspectionCharge,
        financeCost: selectedMyCostingFromHistory?.constants?.financeCost,
        overheads: selectedMyCostingFromHistory?.constants?.overHeadCharge,
        margin: selectedMyCostingFromHistory?.constants?.margin,
        exportDuty: selectedMyCostingFromHistory?.constants?.exportDutyCharge
          ? true
          : false,
        exportDutyValue:
          selectedMyCostingFromHistory?.constants?.exportDutyCharge,
        pwipFullfillment: selectedMyCostingFromHistory?.constants
          .pwipFullfillment
          ? true
          : false,
      };

      formikRef.setValues(breakUpFormValues);
    }
  }, [formik, customCostingSelection, selectedMyCostingFromHistory]);

  // possible issue for bag in edit screen
  React.useEffect(() => {
    if (customCostingSelection?.bags || generatedCosting) {
      breakupArr[0].rowItems[1].label = customCostingSelection?.bags
        ? `${customCostingSelection?.bags?.bag}-${customCostingSelection?.bags?.weight}${customCostingSelection?.bags?.unit}`
        : `${generatedCosting?.details?.packageDetails?.bag}-${generatedCosting?.details?.packageDetails?.weight}${generatedCosting?.details?.packageDetails?.unit}`;
    }
  }, [breakupArr, customCostingSelection, generatedCosting]);

  useEffect(() => {
    if (selectedMyCostingFromHistory && !generatedCosting) {
      const sheet = selectedMyCostingFromHistory;

      breakupArr[0].rowItems[1].label = `${sheet?.details?.packageDetails?.bag}-${sheet?.details?.packageDetails?.weight}${sheet?.details?.packageDetails?.unit}`;
    }
  }, [selectedMyCostingFromHistory, generatedCosting]);
  // possible issue for bag in edit screen ends

  React.useEffect(() => {
    dispatch(fetchPackagingBagsRequest());
    dispatch(fetchContainersRequest());

    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

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

  async function callFetchCHAandSHLandOFCCost(originId, destinationId) {
    const response = await fetchCHAandSHLandOFCCost(originId, destinationId);

    if (response) {
      dispatch(
        setCustomCostingSelection({
          ...selectedCosting,
          customCostingSelection: {
            ...selectedCosting.customCostingSelection,
            product: {
              ...selectedMyCostingFromHistory?.details?.variantObject,
              sourceObject: selectedMyCostingFromHistory?.details?.sourceObject,
            },
            portOfOrigin:
              selectedMyCostingFromHistory?.details?.originPortObject,
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
          selectedMyCostingFromHistory?.details?.sourceObject?._id
        )
      );
    }
  }

  React.useEffect(() => {
    if (
      selectedMyCostingFromHistory &&
      !selectedCosting?.customCostingSelection?.product &&
      !selectedCosting?.customCostingSelection?.shlData
    ) {
      const originId =
        selectedMyCostingFromHistory.details.originPortObject._id;
      const destinationId =
        selectedMyCostingFromHistory.details.destinationObject._id;

      callFetchCHAandSHLandOFCCost(originId, destinationId);
    }
  }, [selectedMyCostingFromHistory, selectedCosting]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Export Costing by pwip</title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Header />

        <div
          id="fixedMenuSection"
          className="fixed top-[56px] h-[auto] w-full bg-pwip-gray-45 z-10"
        >
          {/* <div className="w-full h-[46px] bg-pwip-gray-300 rounded-full inline-flex items-center p-1">
            <div
              onClick={() => setActiveTab(0)}
              className={`w-[50%] h-full inline-flex items-center justify-center ${
                activeTab === 0 ? "bg-white" : "opacity-40"
              } rounded-full`}
            >
              <span className="text-pwip-gray-1100 font-sans font-bold text-sm">
                Costing
              </span>
            </div>

            <div
              onClick={() => setActiveTab(1)}
              className={`w-[50%] h-full inline-flex items-center justify-center ${
                activeTab === 1 ? "bg-white" : "opacity-40"
              } rounded-full`}
            >
              <span className="text-pwip-gray-1100 font-sans font-bold text-sm">
                Breakup
              </span>
            </div>
          </div> */}

          <div className={`flex overflow-x-scroll hide-scroll-bar`}>
            <div className="flex flex-nowrap">
              {[...tabsItems].map((item, index) => {
                return (
                  <div
                    key={item.title + "_" + index}
                    onClick={() => setActiveTab(index)}
                    className="inline-block px-5 py-[14px] bg-pwip-v2-gray-100 border-r-[1px] border-r-pwip-v2-gray-300"
                    style={{
                      opacity: activeTab === index ? 1 : 0.4,
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
                            unit: values?._variantId?.sourceRates?.unit,
                            value: values?._variantId?.sourceRates?.price
                              ? `₹${values?._variantId?.sourceRates?.price}`
                              : "",
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
                            label: "Select a Bag size",
                            type: "select",
                            name: "bagSize",
                            placeholder: "Ex: 15kg",
                            value: values?.bagSize || "",
                          },
                          {
                            label: "Bag cost",
                            type: "input",
                            name: "bagPrice",
                            placeholder: "Ex: 10.5",
                            unit: "mt",
                            value: values?.bagPrice
                              ? `₹${values?.bagPrice}`
                              : "",
                          },
                          // {
                          //   label: "Broken %",
                          //   type: "tagSelect",
                          //   name: "brokenPercentage",
                          //   placeholder: "5%",
                          //   value: values?.brokenPercentage || "",
                          //   option: [5, 10, 15, 20, 25, 100],
                          // },
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
                            unit: "container",
                            value: `₹${values?.shl}` || "",
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
                            unit: "container",
                            value: `₹${values?.cfsHandling}` || "",
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
                            unit: "container",
                            value: `₹${values?.inspectionCost}`,
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
                        icon: shlCardIcon,
                        form: [
                          {
                            label: "Enter finance cost",
                            type: "input",
                            name: "financeCost",
                            placeholder: "",
                            hideUnit: true,
                            value: `₹${values?.financeCost}` || "",
                          },
                        ],
                      },

                      {
                        cardTitle: "Overheads",
                        icon: chaCardIcon,
                        form: [
                          {
                            label: "Enter overheads",
                            type: "input",
                            name: "overheads",
                            placeholder: "",
                            hideUnit: true,
                            value: `₹${values?.overheads}` || "",
                          },
                        ],
                      },

                      {
                        cardTitle: "Margin",
                        icon: inspectionCardIcon,
                        form: [
                          {
                            label: "Enter margin",
                            type: "input",
                            name: "margin",
                            placeholder: "",
                            hideUnit: true,
                            value: `₹${values?.inspectionCost}`,
                          },
                        ],
                      },

                      {
                        cardTitle: "Export duty",
                        icon: inspectionCardIcon,
                        form: [
                          {
                            label: "Enter your own duty (default is 20%",
                            type: "input",
                            name: "exportDutyValue",
                            placeholder: "",
                            hideUnit: true,
                            value: `₹${values?.exportDutyValue}`,
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
                            return (
                              <div
                                key={d.cardTitle + " " + i}
                                className="bg-white w-full h-auto px-5 py-7 mb-3"
                              >
                                <div className="inline-flex items-center space-x-2 mb-6">
                                  {d.icon}
                                  <h2 className="text-pwip-v2-primary font-[700] text-lg">
                                    {d.cardTitle}
                                  </h2>
                                </div>

                                <div className="inline-flex w-full flex-col space-y-5">
                                  {d.form.map((field, index) => {
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
                                                      />
                                                    </div>
                                                  );
                                                  openBottomSheet(content);
                                                }

                                                if (
                                                  field.name === "_containerId"
                                                ) {
                                                  const content = (
                                                    <div>
                                                      <SelectCargoContainersContainer
                                                        roundedTop={false}
                                                        noTop={true}
                                                        noPaddingBottom={true}
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
                                          <div className="inline-flex items-center relative mt-2">
                                            <div className="inline-flex items-center justify-between h-[40px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] font-sans">
                                              <div className="inline-flex items-end space-x-1">
                                                <span className="text-pwip-gray-850 font-[700] text-sm">
                                                  {field?.value}
                                                </span>
                                                {!field?.hideUSD &&
                                                field?.value ? (
                                                  <span className="text-pwip-v2-green-800 font-[700] text-sm">
                                                    $
                                                    {inrToUsd(
                                                      field?.value.split(
                                                        "₹"
                                                      )[1],
                                                      forexRate.USD
                                                    )}
                                                  </span>
                                                ) : null}
                                              </div>
                                              {!field?.hideUnit &&
                                              field?.unit ? (
                                                <span className="text-pwip-v2-primary-700 font-[700] text-sm">
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
                                                  return (
                                                    <div
                                                      className="inline-block"
                                                      key={opt + "_" + optIndex}
                                                    >
                                                      <div className="inline-flex items-center justify-between h-auto w-auto min-w-[52px] rounded-md bg-pwip-v2-gray-50 border-[0.1px] border-[#006EB4] text-pwip-gray-850 px-3 py-[6px] font-sans">
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
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  );
                })}
                {/* <CostingForm
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  activeTab={activeTab}
                />

                <BreakupForm
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  activeTab={activeTab}
                /> */}
                <div className="w-full fixed left-0 bottom-0 px-5 py-4 bg-white inline-flex items-start space-x-[20px]">
                  <div className="w-[42px]">
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
                  </div>
                  <Button
                    type="primary"
                    buttonType="submit"
                    label="Save to see full details"
                    minHeight="!min-h-[42px]"
                    disabled={
                      isSubmitting ||
                      !Object.keys(values?._variantId).length ||
                      !Object.keys(values?._originId).length ||
                      !Object.keys(values?._destinationId).length
                    }
                    onClick={() => {
                      let givenData = { ...values };
                      givenData.unit =
                        selectedMyCostingFromHistory?.unit || "mt";
                      givenData.shipmentTermType = shipmentTerm;
                      // ===
                      //   selectedMyCostingFromHistory?.termOfAgreement
                      //     ? shipmentTerm
                      //     : selectedMyCostingFromHistory?.termOfAgreement;
                      givenData.variantCost = parseFloat(values?.costOfRice);
                      givenData.exportDutyValue =
                        parseFloat(values.exportDutyValue) || 0;

                      setSelectedUnitForPayload(
                        selectedMyCostingFromHistory?.unit || "mt"
                      );

                      const payload =
                        generatePayloadForCustomCosting(givenData);
                      dispatch(generateCustomCostingRequest(payload));
                      dispatch(fetchMyCostingFailure());
                      setIsGenerated(true);
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

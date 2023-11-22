import React, { useEffect, useState } from "react";
import Head from "next/head";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { inrToUsd } from "@/utils/helper";
import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { getCostingToSaveHistoryPayload } from "@/utils/helper";

import {
  generateQuickCostingRequest,
  fetchGeneratedCostingFailure,
  generateCustomCostingRequest,
} from "@/redux/actions/costing.actions";
import {
  updateCostingRequest,
  fetchMyCostingRequest,
  saveCostingFailure,
  fetchMyCostingFailure,
  updateCostingFailure,
} from "@/redux/actions/myCosting.actions";

// import { setTermsOfShipmentRequest } from "@/redux/actions/shipmentTerms.actions";

import {
  chevronDown,
  transportationCostIcon,
  shlCostIcon,
  ofcCostIcon,
  inspectionCostIcon,
  financeCostIcon,
  overheadsCostIcon,
  dutyCostIcon,
  marginCostIcon,
  cfsCostIcon,
  costOfRiceIcon,
  bagTypeIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  eyePreviewIcon,
  downloadIcon,
  shareIcon,
} from "../../../theme/icon";
import { useSession } from "next-auth/react";
import axios from "axios";

const lineBetweenLocation = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="62"
    height="2"
    viewBox="0 0 62 2"
    fill="none"
  >
    <path
      d="M0.682129 1L60.8784 1"
      stroke="#003559"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
);

function extractCustomCostingPayload(data) {
  return {
    shipmentTermType: "FOB",
    currentUnit: "qt",
    unitToConvert: "qt",
    _variantId: data.details.variantObject._id,
    sourceRateId: data.details.variantObject.sourceRates[0]._id,
    sourceId: data.details.sourceObject._id,
    _originId: data.details.originPortObject._id,
    _destinationId: data.details.destinationObject._id,
    _containerId: data.details.containerObject._id,
    _bagId: data.details.packageDetails._id,
    variantCost: data.costing.exmillPrice.toString(),
    brokenPercent: data.brokenPercentage,
    containersWeight: data.details.containerObject.weight,
    totalContainers: 1,
    transportationCost: data.costing.transportCharge,
    bagCost: data.costing.package,
    ofc: data.costing.ofcCost,
    inspectionCost: data.constants.inspectionCharge,
    insurance: data.constants.insurance,
    financeCost: data.constants.financeCost,
    overheads: data.constants.overHeadCharge,
    margin: data.constants.margin,
    cfsHandling: data.costing.cfsHandling,
    shl: data.costing.shlCost,
    exportDuty: data.constants.exportDutyCharge !== 0,
    fulfilledByPwip: data.constants.pwipFullfillment !== 0,
  };
}

const unitOptions = [
  {
    label: "Metric ton",
    value: "mt",
  },
  {
    label: "Killogram",
    value: "kg",
  },
  {
    label: "Quintal",
    value: "qt",
  },
];

const lineBackgroundColor = ["bg-pwip-teal-900", "bg-pwip-orange-900"];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractBreakUpItems(breakUpObject, forex) {
  const breakUpItems = [];

  for (const key in breakUpObject) {
    if (
      key !== "_destinationPortId" &&
      key !== "_containerId" &&
      key !== "createdAt" &&
      key !== "updatedAt" &&
      key !== "_id" &&
      key !== "shlCharge" &&
      key !== "chaCharge"
    ) {
      const formattedLabel = capitalizeFirstLetter(
        key.replace(/([A-Z])/g, " $1").trim()
      ); // Convert to spaced words
      const breakUpItem = {
        inr: breakUpObject[key],
        usd: inrToUsd(breakUpObject[key] || 0, forex.USD),
        label: formattedLabel,
      };
      breakUpItems.push(breakUpItem);
    }
  }

  return breakUpItems;
}

function updateCharges(response, chargesToUpdate, forex, shipmentTerm) {
  if (response) {
    const updatedCharges = chargesToUpdate.map((chargeGroup) => {
      const updatedRowItems = chargeGroup.rowItems.map((rowItem) => {
        let updatedInr;

        switch (rowItem.label) {
          case "Cost of rice":
            updatedInr = response.costing.exmillPrice;
            break;
          // case "PPWoven-50 Kg":
          //   updatedInr = response.costing.package;
          //   break;
          case "Transportation":
            updatedInr = response.costing.transportCharge;
            break;
          case "CFS Handling":
            updatedInr = response.costing.cfsHandling;
            rowItem.breakUp = extractBreakUpItems(
              response?.breakUp?.chaObject?.chaDetailObject,
              forex
            );

            break;
          case "Shipping line locals":
            updatedInr = response.costing.shlCost;
            rowItem.breakUp = extractBreakUpItems(
              response?.breakUp?.shlObject?.shlDetailObject,
              forex
            );

            break;
          case "OFC":
            updatedInr = shipmentTerm === "FOB" ? 0 : response.costing.ofcCost;
            break;
          case "Inspection cost":
            updatedInr = response.constants.inspectionCharge;
            break;
          case "Finance cost":
            updatedInr = response.constants.financeCost;
            break;
          case "Overheads":
            updatedInr = response.constants.overHeadCharge;
            break;
          case "Margin":
            updatedInr = response.constants.margin;
            break;
          case "20% Export duty":
            updatedInr = response.constants.exportDutyCharge || 0;
            break;
          case "PWIP Fulfilment":
            updatedInr = response.constants.pwipFullfillment || 0;
            break;
          // Add more cases for other labels if needed
          default:
            updatedInr = rowItem.inr; // Use the original inr value if not found in mappings
            break;
        }

        if (rowItem?.category === "bags") {
          updatedInr = response.costing.package;
        }

        return {
          ...rowItem,
          inr: updatedInr,
          usd: inrToUsd(updatedInr || 0, forex.USD) || 0,
        };
      });

      return { ...chargeGroup, rowItems: updatedRowItems };
    });

    return updatedCharges;
  }
}

let breakupArr = [
  {
    title: "Rice and bags",
    afterIcon: "/assets/images/costing/road.png",
    rowItems: [
      {
        label: "Cost of rice",
        icon: costOfRiceIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "PPWoven-50 Kg",
        icon: bagTypeIcon,
        category: "bags",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Handling and Inspection",
    afterIcon: "/assets/images/costing/container.png",
    rowItems: [
      {
        label: "Transportation",
        icon: transportationCostIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "CFS Handling",
        icon: cfsCostIcon,
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "Craft paper",
            inr: 0,
            usd: 0,
          },
          {
            label: "Silica gel",
            inr: 0,
            usd: 0,
          },
          {
            label: "Loading chargers",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "Shipping line locals",
        icon: shlCostIcon,
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "THC",
            inr: 0,
            usd: 0,
          },
          {
            label: "BL",
            inr: 0,
            usd: 0,
          },
          {
            label: "Surrender",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "OFC",
        icon: ofcCostIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "Inspection cost",
        icon: inspectionCostIcon,
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Other chargers",
    afterIcon: "/assets/images/costing/ocean.png",
    rowItems: [
      {
        label: "Finance cost",
        icon: financeCostIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "Overheads",
        icon: overheadsCostIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "Margin",
        icon: marginCostIcon,
        inr: 0,
        usd: 0,
      },
      {
        label: "20% Export duty",
        icon: dutyCostIcon,
        inr: 0,
        usd: 0,
      },
      // {
      //   label: "PWIP Fulfilment",
      //   inr: 0,
      //   usd: 0,
      // },
    ],
  },
];

function CostingOverview() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const selectedCosting = useSelector((state) => state.costing);

  const myRecentSavedCosting = useSelector(
    (state) => state.myCosting.myRecentSavedCosting
  );
  const currentCostingFromHistory = useSelector(
    (state) => state.myCosting.currentCostingFromHistory
  );

  const shipmentTerm = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.selected
  );
  const isShipmentTermDropdownOpen = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.showShipmentTermDropdown
  );
  const forexRate = useSelector((state) => state.utils.forexRate);

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
  } = useOverlayContext();

  const [showBreakup, setShowBreakup] = useState(true);
  const [breakupChargesData, setBreakupChargesData] = useState([]);
  const [isChangingUnit, setIsChangingUnit] = useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState({
    label: "Metric ton",
    value: "mt",
  });
  const [generatedCostingData, setGeneratedCostingData] = useState(null);
  const [componentShipmentTerm, setComponentShipmentTerm] = useState(null);

  React.useEffect(() => {
    setComponentShipmentTerm(shipmentTerm);
  }, [isShipmentTermDropdownOpen]);

  React.useEffect(() => {
    if (shipmentTerm && componentShipmentTerm) {
      dispatch(updateCostingFailure());
      const payloadBody = {
        shipmentTermType: shipmentTerm || "FOB",
        termOfAgreement: shipmentTerm || "FOB",
      };
      dispatch(updateCostingRequest(payloadBody));
      dispatch(fetchGeneratedCostingFailure());
      dispatch(fetchMyCostingFailure());
    }
  }, [shipmentTerm]);

  React.useEffect(() => {
    if (generatedCosting && selectedUnit && isChangingUnit && shipmentTerm) {
      dispatch(updateCostingFailure());
      const payloadBody = {
        ...getCostingToSaveHistoryPayload(generatedCosting),
        unit: selectedUnit?.value,
        shipmentTermType: shipmentTerm || "FOB",
        termOfAgreement: shipmentTerm || "FOB",
      };
      dispatch(updateCostingRequest(payloadBody));
      setIsChangingUnit(false);
      dispatch(fetchGeneratedCostingFailure());
      dispatch(fetchMyCostingFailure());
    }
  }, [generatedCosting, selectedUnit, isChangingUnit, shipmentTerm]);

  React.useEffect(() => {
    if (generatedCosting) {
      breakupArr[0].rowItems[1].label = `${generatedCosting?.details?.packageDetails?.bag}-${generatedCosting?.details?.packageDetails?.weight}${generatedCosting?.details?.packageDetails?.unit}`;
    }
  }, [breakupArr, generatedCosting]);

  useEffect(() => {
    if (
      currentCostingFromHistory &&
      currentCostingFromHistory?.length &&
      !generatedCosting &&
      forexRate
    ) {
      // Following commented code causing re-renders, need to fix

      // const action = {
      //   selected: currentCostingFromHistory[0]?.termOfAgreement,
      //   showShipmentTermDropdown: false,
      // };

      // dispatch(setTermsOfShipmentRequest(action));
      setGeneratedCostingData(currentCostingFromHistory[0]);
      const sheet = currentCostingFromHistory[0];

      breakupArr[0].rowItems[1].label = `${sheet?.details?.packageDetails?.bag}-${sheet?.details?.packageDetails?.weight}${sheet?.details?.packageDetails?.unit}`;

      const updatedCharges = updateCharges(
        currentCostingFromHistory[0],
        breakupArr,
        forexRate,
        shipmentTerm
      );

      const selected = unitOptions.find((u) => u.value === sheet.unit);

      setSelectedUnit(selected);

      if (updatedCharges) {
        setBreakupChargesData(updatedCharges);
      }
    }
  }, [currentCostingFromHistory, generatedCosting, forexRate]);

  useEffect(() => {
    if (myRecentSavedCosting && !currentCostingFromHistory) {
      dispatch(fetchMyCostingRequest(myRecentSavedCosting._id));
    }
  }, [myRecentSavedCosting, currentCostingFromHistory]);

  const handleOpenBreakUpBottomSheet = (itemIndex) => {
    const selectedBreakup = breakupChargesData[itemIndex].rowItems.filter(
      (d) => {
        if (d?.breakUp?.length) {
          return d;
        }
      }
    );

    const content = (
      <div className="inline-flex flex-col w-full">
        {selectedBreakup.map((selected, selectedIndex) => {
          return (
            <div
              key={selected.label + selectedIndex}
              className="inline-flex flex-col w-full"
            >
              <div className="border-b-[1px] border-b-pwip-gray-50 inline-flex items-center justify-between w-full px-7 py-5">
                <div className="w-[60%] inline-flex items-center justify-between text-pwip-gray-1000 text-sm font-bold font-sans">
                  <span>{selected.label}</span>
                  <span>:</span>
                </div>
                <div className="w-[20%] inline-flex items-center justify-end text-pwip-gray-1000 text-sm font-bold font-sans">
                  <span>₹{selected.inr}</span>
                </div>
                <div className="w-[20%] inline-flex items-center justify-end text-pwip-gray-1000 text-sm font-bold font-sans">
                  <span>${selected.usd}</span>
                </div>
              </div>

              <div className="inline-flex items-center h-auto px-7 relative border-b-[1px] border-b-pwip-gray-40">
                <div className="inline-flex items-center flex-col h-full">
                  <div
                    className={`h-3 w-3 rounded-full absolute top-[12px] ${lineBackgroundColor[selectedIndex]}`}
                  />
                  <div
                    className={`h-full max-h-[calc(100%-24px)] top-[12px] w-1 absolute ${lineBackgroundColor[selectedIndex]}`}
                  />
                  <div
                    className={`h-3 w-3 rounded-full absolute bottom-[12px] ${lineBackgroundColor[selectedIndex]}`}
                  />
                </div>
                <div className="w-full">
                  {selected?.breakUp?.map((item, index) => {
                    return (
                      <div
                        key={item.label + index * 12}
                        className="inline-flex items-center justify-between w-full py-3 pl-3"
                      >
                        <div className="w-[60%] inline-flex items-center justify-between text-pwip-gray-800 text-xs font-normal font-sans">
                          <span>{item.label}</span>
                          <span>:</span>
                        </div>
                        <div className="w-[20%] inline-flex items-center justify-end text-pwip-gray-800 text-xs font-normal font-sans">
                          <span>₹{item.inr}</span>
                        </div>
                        <div className="w-[20%] inline-flex items-center justify-end text-pwip-gray-800 text-xs font-normal font-sans">
                          <span>${item.usd}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
    openBottomSheet(content);
  };

  const handleOpenUnitSelectBottomSheet = () => {
    const content = (
      <React.Fragment>
        <div
          id="fixedMenuSection"
          className={`h-[auto] w-full bg-white z-10 py-6 px-5`}
        >
          <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
            Select unit of measurement
          </h2>
        </div>

        <div
          className={`h-full w-full bg-white py-8 overflow-auto px-5 hide-scroll-bar`}
        >
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                label: "Metric ton",
                value: "mt",
              },
              {
                label: "Killogram",
                value: "kg",
              },
              {
                label: "Quintal",
                value: "qt",
              },
            ].map((items, index) => {
              return (
                <div
                  key={items.label + index}
                  onClick={async () => {
                    const body = {
                      destinationPortId: selectedCosting.portOfDestination._id,
                      sourceId: selectedCosting.product.sourceRates._sourceId,
                      sourceRateId: selectedCosting.product.sourceRates._id,
                      shipmentTermType: shipmentTerm || "FOB",
                      unit: items?.value || "mt",
                    };
                    setGeneratedCostingData(null);

                    if (
                      currentCostingFromHistory &&
                      currentCostingFromHistory?.length &&
                      currentCostingFromHistory[0]?.isQuickCosting
                    ) {
                      await dispatch(generateQuickCostingRequest(body));
                    } else {
                      let givenData = {
                        ...currentCostingFromHistory[0],
                      };

                      let payload = extractCustomCostingPayload({
                        ...givenData,
                      });

                      payload.currentUnit = selectedUnit?.value || "mt";
                      payload.unitToConvert = items?.value || "mt";
                      payload.shipmentTermType = shipmentTerm || "FOB";
                      await dispatch(generateCustomCostingRequest(payload));
                    }
                    setIsChangingUnit(true);
                    setSelectedUnit(items);
                    closeBottomSheet();
                  }}
                  className="cursor-pointer h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col items-center space-t"
                  style={{
                    boxShadow:
                      "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="w-[42px] pt-3 inline-flex items-center justify-center">
                    <img
                      src={`/assets/images/units/${items.value.toUpperCase()}.svg`}
                    />
                  </div>
                  <div className="p-3 flex w-fill flex-col space-y-[4px]">
                    <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1 text-center">
                      {items.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
    openBottomSheet(content);
  };

  const handleShareBottomSheet = () => {
    const content = (
      <React.Fragment>
        <div className="px-5 mb-6 pt-5">
          <span className="text-base font-sans font-medium text-pwip-gray-900 text-left">
            Download or share your costing
          </span>
        </div>
        <div className="inline-flex flex-col w-full space-y-6">
          <button
            type="button"
            onClick={() => {
              handleDownload();
            }}
            className="w-full space-x-4 text-pwip-gray-850 inline-flex items-center px-5 hover:bg-pwip-white-100 dark:hover:bg-pwip-white-100 group"
          >
            {downloadIcon}
            <span className="text-base font-medium font-sans">Download</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleShare();
            }}
            className="w-full space-x-4 text-pwip-gray-850 inline-flex items-center px-5 hover:bg-pwip-white-100 dark:hover:bg-pwip-white-100 group"
          >
            {shareIcon}
            <span className="text-base font-medium font-sans">Share</span>
          </button>
        </div>
      </React.Fragment>
    );
    openBottomSheet(content);
  };

  const handleShare = () => {
    if (navigator && navigator.share) {
      navigator
        .share({
          title: "Export costing",
          text: "1121 steam 5% Broken, Chennai - Singapore, ₹42000 ($345)",
          url:
            window.location.origin +
            "/preview/costing/123?utm_source=yourapp&utm_medium=social&utm_campaign=summer_sale&source=yourapp&campaign=summer_sale&user_id=123456&timestamp=2023-08-03",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const handleDownload = () => {
    openToastMessage({
      type: "loading",
      message: "Downloading ...",
      // autoHide: false,
    });
    closeBottomSheet();
    axios
      .post(
        "https://api-stage.pwip.co/api/generateCostingSheet/download",
        {
          historyId: currentCostingFromHistory[0]?._id,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: "Bearer " + session?.accessToken,
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          currentCostingFromHistory[0]?.costingName + ".pdf"
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();

        closeToastMessage();
      })
      .catch((error) => {
        closeToastMessage();
        openToastMessage({
          type: "error",
          message:
            error?.response?.message ||
            error?.response?.data?.message ||
            "Something went wrong",
        });
      });
  };

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
          className={`min-h-screen h-full w-full bg-white overflow-auto pb-8 pt-[56px] inline-flex flex-col justify-between hide-scroll-bar`}
        >
          <div className="inline-flex flex-col w-full h-full pb-[82px] bg-pwip-v2-gray-50">
            <div className="px-5 py-5 w-full h-auto bg-pwip-v2-yellow-100">
              <div className="inline-flex flex-col w-full space-y-2">
                <div
                  className="py-4 px-5 rounded-lg bg-white overflow-hidden"
                  style={{
                    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="inline-flex items-center justify-between w-full">
                    <div className="w-full inline-flex flex-col">
                      <span className="text-pwip-gray-1000 text-sm font-normal font-sans line-clamp-1 mb-[4px]">
                        {shipmentTerm}
                      </span>
                      <div className="inline-flex items-end space-x-1 text-pwip-v2-green-800">
                        <span className="text-xl font-[700] font-sans line-clamp-1">
                          $
                          {inrToUsd(
                            generatedCostingData?.grandTotal || 0,
                            forexRate.USD
                          )}
                        </span>
                        <span className="text-sm mb-[2.5px] font-[400] font-sans line-clamp-1">
                          /{selectedUnit?.value}
                        </span>
                      </div>
                      <span className="mt-[6px] text-pwip-v2-primary text-sm font-[700] font-sans line-clamp-1">
                        ₹{generatedCostingData?.grandTotal || 0}
                      </span>
                    </div>

                    <div
                      className="inline-flex items-center justify-end text-pwip-gray-800 space-x-2"
                      // onClick={async () => {
                      //   if (myRecentSavedCosting) {
                      //     await dispatch(updateCostingFailure());
                      //     await dispatch(
                      //       fetchMyCostingRequest(myRecentSavedCosting._id)
                      //     );
                      //   }
                      //   router.push("/export-costing/costing/edit");
                      // }}
                    >
                      <img
                        src="/assets/images/costing/ship.svg"
                        className="h-auto w-[220px]"
                      />
                    </div>
                  </div>

                  <div className="inline-flex flex-col w-full mt-5">
                    <div className="inline-flex items-center space-x-2">
                      <span className="text-pwip-v2-primary text-sm font-normal font-sans line-clamp-1">
                        {generatedCostingData?.details?.variantObject
                          ?.variantName || "-/-"}
                      </span>
                      <span className="text-sm text-pwip-v2-primary-700 font-normal font-sans line-clamp-1">
                        {generatedCostingData?.brokenPercentage || 0}% broken
                      </span>
                    </div>

                    <div className="w-full mt-[12px] inline-flex items-center space-x-[10px] justify-between">
                      <span className="text-pwip-v2-primary text-xs font-[700] font-sans line-clamp-1">
                        {generatedCostingData?.details?.originPortObject
                          ?.originPortName ||
                          generatedCostingData?.details?.originPortObject
                            ?.portName ||
                          "-/-"}
                      </span>

                      {lineBetweenLocation}

                      <span className="text-pwip-v2-primary text-xs font-[700] font-sans line-clamp-1">
                        {generatedCostingData?.details?.sourceObject?.region ||
                          "-/-"}
                      </span>

                      {lineBetweenLocation}

                      <span className="text-pwip-v2-primary text-xs font-[700] font-sans line-clamp-1">
                        {generatedCostingData?.details?.destinationObject
                          ?.portName || "-/-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showBreakup && (
              <React.Fragment>
                <div className="inline-flex flex-col w-full px-5 py-5 space-y-5">
                  {breakupChargesData.map((item, index) => {
                    const hasBreakup = breakupChargesData[index].rowItems.some(
                      (d) => d?.breakUp?.length
                    );
                    return (
                      <React.Fragment key={item.title + index}>
                        <div className="bg-white border-[1px] border-pwip-v2-gray-250 rounded-lg">
                          <div className="inline-flex items-center justify-between w-full px-5 py-6 rounded-t-lg">
                            <div className="inline-flex flex-col items-start space-y-[4px] w-full">
                              <span className="text-pwip-v2-primary text-base font-[700]">
                                {item.title}
                              </span>
                              <span className="text-pwip-black-600 text-xs font-[400]">
                                Some note or information for user
                              </span>
                            </div>
                          </div>

                          <div className="w-full">
                            {item.rowItems.map((row, rowIndex) => {
                              let paddingBottom = "pb-2";
                              if (rowIndex === item.rowItems.length - 1) {
                                paddingBottom = "pb-4";
                              }
                              return (
                                <React.Fragment>
                                  <div className="w-full px-5">
                                    <div
                                      key={row.label + rowIndex}
                                      className={`inline-flex items-start w-full ${
                                        rowIndex === item.rowItems.length - 1
                                          ? ""
                                          : "border-b-[1px] border-b-pwip-v2-gray-250"
                                      }`}
                                    >
                                      <div
                                        className={`w-full pt-4 ${paddingBottom} inline-flex items-center space-x-5 overflow-hidden`}
                                      >
                                        {row?.icon}
                                        <span className="text-pwip-black-600 text-sm font-[600] line-clamp-1">
                                          {row.label}
                                        </span>
                                      </div>
                                      <div
                                        className={`w-full max-w-[36%] text-right pt-4 ${paddingBottom} inline-flex flex-col space-y-[6px]`}
                                      >
                                        <span className="text-pwip-black-600 text-sm font-[600]">
                                          ${row.usd}
                                        </span>
                                        <span className="text-pwip-v2-primary-700 text-xs font-normal">
                                          ₹{row.inr}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {rowIndex === item.rowItems.length - 1 &&
                                  hasBreakup ? (
                                    <div
                                      onClick={() => {
                                        if (hasBreakup) {
                                          handleOpenBreakUpBottomSheet(index);
                                        }
                                      }}
                                      className="border-t-[1px] border-t-pwip-v2-gray-250 w-full py-4 text-pwip-v2-primary-700 text-sm inline-flex items-center justify-center space-x-2"
                                    >
                                      <span className="text-center ">
                                        Show breakup for CFS & SHL
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="17"
                                        viewBox="0 0 17 17"
                                        fill="none"
                                      >
                                        <path
                                          d="M9.5625 3.1875L14.875 8.5M14.875 8.5L9.5625 13.8125M14.875 8.5H2.125"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  ) : null}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* <div className="rounded-md px-5">
                  <div className="inline-flex items-center w-full bg-pwip-gray-45 border-[1px] border-pwip-gray-40">
                    <div
                      className={`w-[60%] py-4 px-4 inline-flex items-center`}
                    >
                      <span className="text-pwip-gray-1000 text-base font-bold">
                        Grand Total
                      </span>
                    </div>
                    <div
                      className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                    >
                      <span className="text-pwip-gray-1000 text-base font-bold">
                        ₹{generatedCostingData?.grandTotal || 0}
                      </span>
                    </div>
                    <div
                      className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                    >
                      <span className="text-pwip-gray-1000 text-base font-bold">
                        $
                        {inrToUsd(
                          generatedCostingData?.grandTotal || 0,
                          forexRate.USD
                        )}
                      </span>
                    </div>
                  </div>
                </div> */}
              </React.Fragment>
            )}
          </div>
          <div className="inline-flex items-center w-full space-x-6 px-5 py-5 fixed bottom-0 left-0 bg-white">
            <div className="w-full">
              <Button
                type="outline"
                label="Back to home"
                onClick={() => {
                  dispatch(saveCostingFailure());
                  setGeneratedCostingData(null);
                  router.replace("/export-costing");
                }}
              />
            </div>
            <div className="inline-flex items-center justify-end space-x-4 w-full">
              <Button
                type="outline"
                labelAsIcon={true}
                label={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                  >
                    <path
                      d="M3.73432 7.72245C3.57551 7.41384 3.32631 7.17092 3.02584 7.03181C2.72536 6.89271 2.39063 6.86531 2.07417 6.9539C1.75771 7.04249 1.47745 7.24206 1.27738 7.52129C1.07731 7.80052 0.96875 8.14359 0.96875 8.49666C0.96875 8.84973 1.07731 9.1928 1.27738 9.47203C1.47745 9.75126 1.75771 9.95083 2.07417 10.0394C2.39063 10.128 2.72536 10.1006 3.02584 9.96151C3.32631 9.8224 3.57551 9.57948 3.73432 9.27087M3.73432 7.72245C3.85238 7.95195 3.91993 8.21545 3.91993 8.49666C3.91993 8.77787 3.85238 9.04208 3.73432 9.27087M3.73432 7.72245L10.0083 3.95837M3.73432 9.27087L10.0083 13.035M10.0083 3.95837C10.1003 4.14547 10.2259 4.31088 10.3778 4.44494C10.5297 4.579 10.7047 4.67902 10.8928 4.73915C11.0809 4.79927 11.2782 4.8183 11.4732 4.79512C11.6681 4.77194 11.8569 4.70701 12.0283 4.60413C12.1998 4.50125 12.3505 4.36249 12.4718 4.19595C12.593 4.02942 12.6823 3.83845 12.7344 3.63422C12.7865 3.42999 12.8003 3.2166 12.7752 3.00651C12.75 2.79642 12.6863 2.59386 12.5878 2.41066C12.3937 2.04965 12.0762 1.7853 11.7036 1.67443C11.3309 1.56356 10.9329 1.61502 10.595 1.81775C10.2571 2.02049 10.0064 2.3583 9.89666 2.75859C9.78696 3.15887 9.82705 3.58967 10.0083 3.95837ZM10.0083 13.035C9.91418 13.218 9.85434 13.4192 9.83222 13.6272C9.81009 13.8352 9.82612 14.0459 9.87938 14.2472C9.93263 14.4485 10.0221 14.6365 10.1426 14.8004C10.2632 14.9644 10.4124 15.1011 10.5819 15.2028C10.7513 15.3045 10.9377 15.3691 11.1303 15.393C11.3228 15.4169 11.5179 15.3996 11.7043 15.3421C11.8907 15.2845 12.0648 15.1879 12.2166 15.0578C12.3684 14.9276 12.495 14.7664 12.5891 14.5834C12.7793 14.2138 12.8256 13.7777 12.7181 13.3712C12.6105 12.9646 12.3578 12.6208 12.0156 12.4155C11.6734 12.2102 11.2696 12.1601 10.8932 12.2763C10.5167 12.3924 10.1984 12.6653 10.0083 13.035Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
                onClick={() => {
                  handleShare();
                }}
              />

              <Button
                type="primary"
                labelAsIcon={true}
                label={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <path
                      d="M2.125 11.6875V13.2812C2.125 13.7039 2.29291 14.1093 2.5918 14.4082C2.89068 14.7071 3.29606 14.875 3.71875 14.875H13.2812C13.7039 14.875 14.1093 14.7071 14.4082 14.4082C14.7071 14.1093 14.875 13.7039 14.875 13.2812V11.6875M11.6875 8.5L8.5 11.6875M8.5 11.6875L5.3125 8.5M8.5 11.6875V2.125"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
                onClick={() => {
                  handleDownload();
                }}
              />
            </div>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(CostingOverview);

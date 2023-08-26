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
// import { getCostingToSaveHistoryPayload } from "@/utils/helper";

import { generateQuickCostingRequest } from "@/redux/actions/costing.actions";
import {
  updateCostingRequest,
  fetchMyCostingRequest,
} from "@/redux/actions/myCosting.actions";

import {
  chevronDown,
  pencilIcon,
  riceAndBagsIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  eyePreviewIcon,
} from "../../../theme/icon";

const lineBackgroundColor = ["bg-pwip-teal-900", "bg-pwip-orange-900"];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractBreakUpItems(breakUpObject) {
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
        usd: inrToUsd(breakUpObject[key] || 0, 83.16),
        label: formattedLabel,
      };
      breakUpItems.push(breakUpItem);
    }
  }

  return breakUpItems;
}

function updateCharges(response, chargesToUpdate, generatedCosting) {
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
              response.breakup.chaObject.chaDetailObject
            );

            break;
          case "Shipping line locals":
            updatedInr = response.costing.shlCost;
            rowItem.breakUp = extractBreakUpItems(
              response.breakup.shlObject.shlDetailObject
            );

            break;
          case "OFC":
            updatedInr = generatedCosting?.grandTotalFob
              ? 0
              : response.costing.ofcCost;
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
          usd: inrToUsd(updatedInr || 0, 83.16) || 0,
        };
      });

      return { ...chargeGroup, rowItems: updatedRowItems };
    });

    return updatedCharges;
  }
}

const breakupArr = [
  {
    title: "Rice and bags",
    icon: riceAndBagsIcon,
    afterIcon: "/assets/images/costing/road.png",
    rowItems: [
      {
        label: "Cost of rice",
        inr: 0,
        usd: 0,
      },
      {
        label: "PPWoven-50 Kg",
        category: "bags",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Handling and Inspection",
    icon: handlingAndInspectionIcon,
    afterIcon: "/assets/images/costing/container.png",
    rowItems: [
      {
        label: "Transportation",
        inr: 0,
        usd: 0,
      },
      {
        label: "CFS Handling",
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
        inr: 0,
        usd: 0,
      },
      {
        label: "Inspection cost",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Other chargers",
    icon: otherChargesIcon,
    afterIcon: "/assets/images/costing/ocean.png",
    rowItems: [
      {
        label: "Finance cost",
        inr: 0,
        usd: 0,
      },
      {
        label: "Overheads",
        inr: 0,
        usd: 0,
      },
      {
        label: "Margin",
        inr: 0,
        usd: 0,
      },
      {
        label: "20% Export duty",
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

  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const myCosting = useSelector((state) => state.myCosting);

  const { openBottomSheet, closeBottomSheet } = useOverlayContext();

  const [showBreakup, setShowBreakup] = useState(false);
  const [breakupChargesData, setBreakupChargesData] = useState([]);
  const [isChangingUnit, setIsChangingUnit] = useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState({
    label: "Metric ton",
    value: "mt",
  });

  React.useEffect(() => {
    if (
      selectedCosting &&
      selectedCosting?.generatedCosting &&
      selectedUnit &&
      isChangingUnit
    ) {
      const payloadBody = {
        unit: selectedUnit?.value,
      };
      setIsChangingUnit(false);
      dispatch(updateCostingRequest(payloadBody));
    }
  }, [selectedCosting, selectedUnit, isChangingUnit]);

  React.useEffect(() => {
    if (selectedCosting) {
      breakupArr[0].rowItems[1].label = `${selectedCosting?.generatedCosting?.details?.packageDetails?.bag}-${selectedCosting?.generatedCosting?.details?.packageDetails?.weight}${selectedCosting?.generatedCosting?.details?.packageDetails?.unit}`;
    }
  }, [breakupArr, selectedCosting]);

  useEffect(() => {
    if (generatedCosting && breakupArr) {
      const updatedCharges = updateCharges(
        generatedCosting,
        breakupArr,
        generatedCosting
      );
      if (updatedCharges) {
        setBreakupChargesData(updatedCharges);
      }
    }
  }, [generatedCosting]);

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
                <div className="inline-flex items-center justify-center flex-col h-full">
                  <div
                    className={`h-3 w-3 rounded-full absolute top-[14px] ${lineBackgroundColor[selectedIndex]}`}
                  />
                  <div
                    className={`h-[85%] w-1 absolute top-5 ${lineBackgroundColor[selectedIndex]}`}
                  />
                  <div
                    className={`h-3 w-3 rounded-full absolute bottom-[16px] ${lineBackgroundColor[selectedIndex]}`}
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
          className={`h-full w-full bg-white pb-8 overflow-auto px-5 hide-scroll-bar`}
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
                  onClick={() => {
                    closeBottomSheet();
                    setSelectedUnit(items);
                    const body = {
                      destinationPortId: selectedCosting.portOfDestination._id,
                      sourceId: selectedCosting.product.sourceRates._sourceId,
                      sourceRateId: selectedCosting.product.sourceRates._id,
                      shipmentTermType: "FOB",
                      unit: items?.value || "mt",
                    };
                    dispatch(generateQuickCostingRequest(body));
                    setIsChangingUnit(true);
                  }}
                  className="cursor-pointer h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col items-center space-t"
                  style={{
                    boxShadow:
                      "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="w-[42px] pt-3 inline-flex items-center justify-center">
                    <img src="/assets/images/units/weight.png" />
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

  const handleShare = () => {
    if (navigator && navigator.share) {
      navigator
        .share({
          title: "Export consting",
          text: "1121 steam 5% Broken, Chennai - Singapore, ₹42000 ($345)",
          url:
            window.location.origin +
            "/preview/costing/123?utm_source=yourapp&utm_medium=social&utm_campaign=summer_sale&source=yourapp&campaign=summer_sale&user_id=123456&timestamp=2023-08-03",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  if (!generatedCosting) {
    return null;
  }

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
          className={`min-h-screen h-full w-full bg-white overflow-auto px-5 pb-8 pt-[98px] inline-flex flex-col justify-between hide-scroll-bar`}
        >
          <div className="inline-flex flex-col w-full h-full py-[20px]">
            <div className="inline-flex flex-col w-full space-y-2">
              <div className="inline-flex items-center justify-between">
                <span className="text-pwip-gray-900 text-base font-normal font-sans line-clamp-1">
                  Your Costing Bill
                </span>
                <div
                  onClick={() => handleOpenUnitSelectBottomSheet()}
                  className="inline-flex items-center space-x-3 text-pwip-gray-1000 text-sm cursor-pointer"
                >
                  <span className="text-sm font-normal font-sans line-clamp-1">
                    {selectedUnit?.label}
                  </span>
                  {chevronDown}
                </div>
              </div>
              <div
                className="border-[1px] border-pwip-gray-650 py-2 px-3 rounded-lg"
                onClick={() => setShowBreakup(!showBreakup)}
                style={{
                  boxShadow:
                    "0px 4px 0px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)",
                }}
              >
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-pwip-gray-1000 text-lg font-normal font-sans line-clamp-1">
                    {generatedCosting?.details?.originPortObject
                      ?.originPortName || "-/-"}{" "}
                    -{" "}
                    {generatedCosting?.details?.destinationObject?.portName ||
                      "-/-"}
                  </span>
                  <div
                    className="inline-flex items-center justify-end text-pwip-gray-800 space-x-2"
                    onClick={async () => {
                      setShowBreakup(false);
                      await dispatch(
                        fetchMyCostingRequest(
                          myCosting.myRecentSavedCosting._id
                        )
                      );
                      router.push("/export-costing/costing/edit");
                    }}
                  >
                    <span className="text-xs font-medium font-sans line-clamp-1">
                      Edit
                    </span>
                    {pencilIcon}
                  </div>
                </div>

                <span className="text-pwip-gray-1000 text-sm font-normal font-sans line-clamp-1">
                  {generatedCosting?.grandTotalFob ? "FOB" : "CIF"}
                </span>

                <div className="inline-flex items-center justify-between w-full mt-2">
                  <span className="text-pwip-gray-1000 text-sm font-normal font-sans line-clamp-1">
                    {generatedCosting?.details?.variantObject?.variantName ||
                      "-/-"}
                  </span>
                  <div className="inline-flex items-center justify-end text-pwip-green-800 space-x-4">
                    <span className="text-base font-medium font-sans line-clamp-1">
                      ₹{generatedCosting?.grandTotal || 0}
                    </span>

                    <span className="text-base font-medium font-sans line-clamp-1">
                      ${inrToUsd(generatedCosting?.grandTotal || 0, 83.16)}
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center justify-between w-full text-pwip-gray-500">
                  <span className="text-sm font-normal font-sans line-clamp-1">
                    {generatedCosting?.details?.variantObject
                      ?.brokenPercentage || 0}
                    % broken
                  </span>
                  <div className="inline-flex items-center justify-end  space-x-4">
                    <span className="text-sm font-medium font-sans line-clamp-1">
                      Per {selectedUnit?.label}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-full inline-flex items-center justify-center text-pwip-gray-550 cursor-pointer transition-transform ${
                    showBreakup ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {chevronDown}
                </div>
              </div>
            </div>

            {showBreakup && (
              <React.Fragment>
                <div className="inline-flex items-center justify-center my-[10px]">
                  <span className="text-pwip-gray-500 text-sm font-normal font-sans line-clamp-1 text-center">
                    Costing Breakup
                  </span>
                </div>

                <div className="inline-flex flex-col w-full">
                  {breakupChargesData.map((item, index) => {
                    const hasBreakup = breakupChargesData[index].rowItems.some(
                      (d) => d?.breakUp?.length
                    );
                    return (
                      <React.Fragment key={item.title + index}>
                        <div
                          onClick={() => {
                            if (hasBreakup) {
                              handleOpenBreakUpBottomSheet(index);
                            }
                          }}
                          className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40"
                        >
                          <div className="inline-flex items-center justify-between w-full p-3 border-[1px] border-pwip-gray-40">
                            <div className="inline-flex items-center space-x-2 w-full">
                              {item.icon}
                              <span className="text-pwip-gray-1000 text-base font-medium">
                                {item.title}
                              </span>
                            </div>

                            {hasBreakup && (
                              <div className="text-pwip-gray-550">
                                {eyePreviewIcon}
                              </div>
                            )}
                          </div>

                          <div className="inline-flex items-center w-full">
                            <div className="w-[60%] pt-4 pb-2 px-4 inline-flex items-center">
                              <span className="text-pwip-gray-750 text-sm font-normal">
                                Details
                              </span>
                            </div>
                            <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                              <span className="text-pwip-gray-750 text-sm font-normal">
                                ₹INR
                              </span>
                            </div>
                            <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                              <span className="text-pwip-gray-750 text-sm font-normal">
                                $USD
                              </span>
                            </div>
                          </div>

                          {item.rowItems.map((row, rowIndex) => {
                            let paddingBottom = "pb-2";
                            if (rowIndex === item.rowItems.length - 1) {
                              paddingBottom = "pb-4";
                            }
                            return (
                              <div
                                key={row.label + rowIndex}
                                className="inline-flex items-center w-full"
                              >
                                <div
                                  className={`w-[60%] pt-4 ${paddingBottom} px-4 inline-flex items-center`}
                                >
                                  <span className="text-pwip-gray-850 text-sm font-normal">
                                    {row.label}
                                  </span>
                                </div>
                                <div
                                  className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                                >
                                  <span className="text-pwip-gray-850 text-sm font-normal">
                                    {row.inr}
                                  </span>
                                </div>
                                <div
                                  className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                                >
                                  <span className="text-pwip-gray-850 text-sm font-normal">
                                    {row.usd}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="w-full inline-flex items-center justify-center">
                          <img
                            src={item.afterIcon}
                            className="h-[40px] w-[22px] bg-cover"
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40">
                  <div className="inline-flex items-center w-full">
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
                        ₹{generatedCosting?.grandTotal || 0}
                      </span>
                    </div>
                    <div
                      className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                    >
                      <span className="text-pwip-gray-1000 text-base font-bold">
                        ${inrToUsd(generatedCosting?.grandTotal || 0, 83.16)}
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="inline-flex items-center w-full space-x-6">
            <Button
              type="outline"
              label="Create new"
              onClick={() => {
                router.replace("/export-costing");
              }}
            />
            <Button type="subtle" label="Share" onClick={handleShare} />
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(CostingOverview);

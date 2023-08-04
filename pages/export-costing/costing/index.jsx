import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useOverlayContext } from "@/context/OverlayContext";

import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import {
  chevronDown,
  pencilIcon,
  riceAndBagsIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  eyePreviewIcon,
} from "../../../theme/icon";

// Import Containers
// import { UserTypeContainer } from "@/containers/ec/UserType";
// Import Layouts

const lineBackgroundColor = ["bg-pwip-teal-900", "bg-pwip-orange-900"];

const breakupArr = [
  {
    title: "Rice and bags",
    icon: riceAndBagsIcon,
    afterIcon: "/assets/images/costing/road.png",
    rowItems: [
      {
        label: "Cost of rice",
        inr: 1000,
        usd: 12.77,
      },
      {
        label: "PPWoven-50 Kg",
        inr: 99,
        usd: 11.49,
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
        inr: 1000,
        usd: 12.77,
      },
      {
        label: "CFS Handling",
        inr: 99,
        usd: 11.49,
        breakUp: [
          {
            label: "Craft paper",
            inr: 15,
            usd: 0.49,
          },
          {
            label: "Silica gel",
            inr: 15,
            usd: 0.49,
          },
          {
            label: "Loading chargers",
            inr: 15,
            usd: 0.49,
          },
        ],
      },
      {
        label: "Shipping line locals",
        inr: 99,
        usd: 11.49,
        breakUp: [
          {
            label: "THC",
            inr: 15,
            usd: 0.49,
          },
          {
            label: "BL",
            inr: 15,
            usd: 0.49,
          },
          {
            label: "Surrender",
            inr: 15,
            usd: 0.49,
          },
        ],
      },
      {
        label: "OFC",
        inr: 99,
        usd: 11.49,
      },
      {
        label: "Inspection cost",
        inr: 99,
        usd: 11.49,
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
        inr: 1000,
        usd: 12.77,
      },
      {
        label: "Overheads",
        inr: 99,
        usd: 11.49,
      },
      {
        label: "Margin",
        inr: 99,
        usd: 11.49,
      },
      {
        label: "20% Export duty",
        inr: 99,
        usd: 11.49,
      },
      {
        label: "PWIP Fulfilment ",
        inr: 99,
        usd: 11.49,
      },
    ],
  },
];

export default function CostingOverview() {
  const router = useRouter();
  const { openBottomSheet } = useOverlayContext();

  const [showBreakup, setShowBreakup] = useState(false);

  const handleOpenBottomSheet = (itemIndex) => {
    const selectedBreakup = breakupArr[itemIndex].rowItems.filter((d) => {
      if (d?.breakUp?.length) {
        return d;
      }
    });

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
                    className={`h-[70%] w-1 absolute top-5 ${lineBackgroundColor[selectedIndex]}`}
                  />
                  <div
                    className={`h-3 w-3 rounded-full absolute bottom-[15px] ${lineBackgroundColor[selectedIndex]}`}
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
                  // onClick={() => (handleBack ? handleBack() : router.back())}
                  className="inline-flex items-center space-x-3 text-pwip-gray-1000 text-sm cursor-pointer"
                >
                  <span className="text-sm font-normal font-sans line-clamp-1">
                    Metric tons
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
                    Chennai - Singapore
                  </span>
                  <div
                    className="inline-flex items-center justify-end text-pwip-gray-800 space-x-2"
                    onClick={() => {
                      setShowBreakup(false);
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
                  FOB
                </span>

                <div className="inline-flex items-center justify-between w-full mt-2">
                  <span className="text-pwip-gray-1000 text-sm font-normal font-sans line-clamp-1">
                    1121 steam
                  </span>
                  <div className="inline-flex items-center justify-end text-pwip-green-800 space-x-4">
                    <span className="text-base font-medium font-sans line-clamp-1">
                      ₹42000
                    </span>

                    <span className="text-base font-medium font-sans line-clamp-1">
                      $345
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center justify-between w-full text-pwip-gray-500">
                  <span className="text-sm font-normal font-sans line-clamp-1">
                    5% broken
                  </span>
                  <div className="inline-flex items-center justify-end  space-x-4">
                    <span className="text-sm font-medium font-sans line-clamp-1">
                      Per Metric ton
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
                  {breakupArr.map((item, index) => {
                    const hasBreakup = breakupArr[index].rowItems.some(
                      (d) => d?.breakUp?.length
                    );
                    return (
                      <React.Fragment key={item.title + index}>
                        <div
                          onClick={() => {
                            if (hasBreakup) {
                              handleOpenBottomSheet(index);
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
                        ₹42000
                      </span>
                    </div>
                    <div
                      className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                    >
                      <span className="text-pwip-gray-1000 text-base font-bold">
                        $345
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

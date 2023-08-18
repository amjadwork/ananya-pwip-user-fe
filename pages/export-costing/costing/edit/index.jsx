import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useOverlayContext } from "@/context/OverlayContext";

import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import {
  chevronDown,
  plusIcon,
  minusIcon,
  riceAndBagsIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  eyePreviewIcon,
} from "../../../../theme/icon";

// Import Containers
import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";

// Import Layouts

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

const CostingForm = () => {
  const { openBottomSheet } = useOverlayContext();

  return (
    <div className="inline-flex flex-col w-full space-y-4">
      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Costing Name
        </label>
        <input
          placeholder="Ex: Sona Masuri"
          type="text"
          className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
        />
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Rice Name
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Sona masuri"
            type="text"
            readOnly={true}
            onClick={() => {
              const content = (
                <div>
                  <SelectVariantContainer
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Rice Name
        </label>
        <div className="inline-flex items-center relative h-[40px] mt-[4px]  w-full border-[1px] border-pwip-gray-650 rounded-md bg-white">
          <div className="w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-r-[1px] border-r-pwip-gray-650 rounded-l-md text-pwip-gray-400">
            {minusIcon}
          </div>
          <input
            placeholder="Ex: 10%"
            type="text"
            className="inline-flex items-center w-full px-[18px] text-xs font-sans text-center"
          />
          <div className="w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-l-[1px] border-l-pwip-gray-650 rounded-r-md text-pwip-gray-400">
            {plusIcon}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Bag type
          </label>
          <div className="inline-flex items-center relative">
            <input
              placeholder="Ex: PP Woven"
              type="text"
              readOnly={true}
              onClick={() => {
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
              }}
              className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
            />
            <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
              {chevronDown}
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Bag size
          </label>
          <input
            placeholder="Ex: 5 kg"
            type="text"
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Select port of orgin
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            readOnly={true}
            onClick={() => {
              const content = (
                <div>
                  <SelectLocationContainer
                    title="Select Port of Origin"
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Select port of destination
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            readOnly={true}
            onClick={() => {
              const content = (
                <div>
                  <SelectLocationContainer
                    title="Select Port of Destination"
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Container type
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            readOnly={true}
            onClick={() => {
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
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            No of containers
          </label>
          <input
            placeholder="Ex: 10"
            type="text"
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>

        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Containers weight
          </label>
          <input
            placeholder="Ex: 1000 kg"
            type="text"
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>
      </div>

      <div className="!mt-10 inline-flex flex-col w-full space-y-10">
        <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            20% Export duty
          </label>
        </div>

        <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            Full fill through PWIP
          </label>
        </div>
      </div>

      <div className="w-full !mt-[32px]">
        <Button
          type="primary"
          label="Update costing"
          // onClick={() => {
          //   router.push("/export-costing/costing");
          // }}
        />
      </div>
    </div>
  );
};

const BreakupForm = () => {
  return (
    <React.Fragment>
      <div className="inline-flex flex-col w-full">
        {breakupArr.map((item, index) => {
          const hasBreakup = breakupArr[index].rowItems.some(
            (d) => d?.breakUp?.length
          );
          return (
            <React.Fragment key={item.title + index}>
              <div
                //   onClick={() => {
                //     if (hasBreakup) {
                //       handleOpenBottomSheet(index);
                //     }
                //   }}
                className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40"
              >
                <div className="inline-flex items-center justify-between w-full p-3 border-[1px] border-pwip-gray-40">
                  <div className="inline-flex items-center space-x-2 w-full">
                    {item.icon}
                    <span className="text-pwip-gray-1000 text-base font-medium">
                      {item.title}
                    </span>
                  </div>
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
                        <input
                          className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                          value={row.inr}
                        />
                      </div>
                      <div
                        className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                      >
                        <input
                          className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                          value={row.usd}
                        />
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
          <div className={`w-[60%] py-4 px-4 inline-flex items-center`}>
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

      <div className="w-full !mt-[32px]">
        <Button
          type="primary"
          label="Update costing"
          // onClick={() => {
          //   router.push("/export-costing/costing");
          // }}
        />
      </div>
    </React.Fragment>
  );
};

export default function EditCosting() {
  const router = useRouter();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(1);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

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
          className="fixed top-[92px] h-[auto] w-full bg-pwip-gray-45 z-10 py-5 px-5"
        >
          <div className="w-full h-[46px] bg-pwip-gray-300 rounded-full inline-flex items-center p-1">
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
          </div>
        </div>

        <div
          className={`min-h-screen h-full w-full bg-pwip-gray-45 pb-[32px] overflow-auto px-5 hide-scroll-bar`}
          style={{
            paddingTop: mainContainerHeight + 92 + "px",
          }}
        >
          {activeTab === 0 && <CostingForm />}

          {activeTab === 1 && <BreakupForm />}
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

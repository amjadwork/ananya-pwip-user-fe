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
} from "../../../../theme/icon";

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

export default function EditCosting() {
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

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

        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

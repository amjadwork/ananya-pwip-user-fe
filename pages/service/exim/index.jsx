import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { useOverlayContext } from "@/context/OverlayContext";
import Slider from "react-slick";

const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});

import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  chevronDown,
  increaseUpIcon,
  decreaseDownIcon,
  eyePreviewIcon,
  checkIcon,
} from "../../../theme/icon";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { getStateAbbreviation, getDateRangeByPeriod } from "@/utils/helper";

import {
  fetchProductDetailRequest,
  fetchProductDetailFailure,
} from "@/redux/actions/products.actions";
import {
  fetchVariantPriceRequest,
  setSelectedVariantForDetailRequest,
  fetchVariantPriceHistoryRequest,
  addVariantToWatchlistRequest,
  fetchAllWatchlistForVariantRequest,
} from "@/redux/actions/variant-prices.actions";

import { fetchVariantProfileRequest } from "@/redux/actions/variant-profile.actions";

import {
  graphPeriod,
  propertyData,
} from "@/constants/variantProfile.constants";

import moment from "moment";

import {
  setCostingSelection,
  // setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

function ViewMode({ handleSelect, selectedViewMode }) {
  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);

  const options = [
    {
      label: "See all data",
      value: "all",
    },
    {
      label: "Annual volume view",
      value: "volume",
    },
    {
      label: "Annual FOB view",
      value: "fob",
    },
  ];

  useEffect(() => {
    if (selectedViewMode) {
      setSelectionOption(selectedViewMode?.value);
    }
  }, [selectedViewMode]);
  return (
    <div className="inline-flex w-full flex-col pb-20">
      <div className="w-full px-6 pt-6 pb-4 mb-3">
        <span className="font-medium text-base">View modes</span>
      </div>
      {options?.map((d, i) => {
        return (
          <div
            key={d?.value + "_" + i}
            onClick={() => {
              handleSelect(d);
              setSelectionOption(d?.value);
              closeBottomSheet();
            }}
            className={`inline-flex items-center justify-between w-full px-6 py-4 ${
              i !== options.length - 1
                ? "border-b border-b-pwip-v2-gray-350"
                : ""
            } ${selectedOption === d?.value ? "bg-pwip-v2-gray-100" : ""}`}
          >
            <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
              <img
                className="h-4 w-4"
                src={"/assets/images/services/exim/" + d?.value + ".png"}
              />
              <span className="text-pwip-black-500 text-sm">{d?.label}</span>
            </div>

            {selectedOption === d?.value ? (
              <span className="text-pwip-v2-primary-500">{checkIcon}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function LocationViewMode({ handleSelect, selectedViewMode }) {
  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);

  const options = [
    {
      label: "Foreign ports",
      value: "pod",
    },
    {
      label: "Indian ports",
      value: "pol",
    },
  ];

  useEffect(() => {
    if (selectedViewMode) {
      setSelectionOption(selectedViewMode?.value);
    }
  }, [selectedViewMode]);
  return (
    <div className="inline-flex w-full flex-col pb-20">
      <div className="w-full px-6 pt-6 pb-4 mb-3">
        <span className="font-medium text-base">Select a port type</span>
      </div>
      {options?.map((d, i) => {
        return (
          <div
            key={d?.value + "_" + i}
            onClick={() => {
              handleSelect(d);
              setSelectionOption(d?.value);
              closeBottomSheet();
            }}
            className={`inline-flex items-center justify-between w-full px-6 py-4 ${
              i !== options.length - 1
                ? "border-b border-b-pwip-v2-gray-350"
                : ""
            } ${selectedOption === d?.value ? "bg-pwip-v2-gray-100" : ""}`}
          >
            <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
              <img
                className="h-4 w-4"
                src={"/assets/images/services/exim/" + d?.value + ".png"}
              />
              <span className="text-pwip-black-500 text-sm">{d?.label}</span>
            </div>

            {selectedOption === d?.value ? (
              <span className="text-pwip-v2-primary-500">{checkIcon}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DataTableForAllFilter() {
  return (
    <table className="table-auto w-full">
      <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
        <tr>
          <th className="p-2 whitespace-nowrap sticky left-0 z-10 bg-gray-50">
            <div className="font-semibold text-left">Product Description</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">Exporter</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">Foreign Port</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Foreign Country</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Quantity</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Unit</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Value_FC</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Indian Port</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Mode</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Date</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Buyer</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Rate_FC</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">IEC</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Exporter Address1</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Exporter Address2</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Exporter City</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Currency</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">FOB</div>
          </th>

          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">Rate</div>
          </th>
        </tr>
      </thead>

      <tbody className="text-sm divide-y divide-gray-100">
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Alex Shatov</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">alexshatov@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,890.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇺🇸</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Philip Harbach</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">philip.h@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,767.04
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇩🇪</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Mirko Fisuk</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">mirkofisuk@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,996.00
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇫🇷</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Olga Semklo</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">olga.s@cool.design</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $1,220.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇮🇹</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Burak Long</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">longburak@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $1,890.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇬🇧</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function DataTableForAnnualViewFilter() {
  return (
    <table className="table-auto w-full">
      <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
        <tr>
          <th className="p-2 whitespace-nowrap sticky left-0 z-10 bg-gray-50">
            <div className="font-semibold text-left">Year</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">2020</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">2021</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">2022</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">2023</div>
          </th>
          <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-center">2024</div>
          </th>
        </tr>
      </thead>

      <tbody className="text-sm divide-y divide-gray-100">
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Alex Shatov</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">alexshatov@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,890.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇺🇸</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Philip Harbach</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">philip.h@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,767.04
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇩🇪</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Mirko Fisuk</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">mirkofisuk@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $2,996.00
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇫🇷</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Olga Semklo</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">olga.s@cool.design</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $1,220.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇮🇹</div>
          </td>
        </tr>
        <tr>
          <td className="p-2 whitespace-nowrap sticky left-0 z-10 bg-white">
            <div className="flex items-center">
              <div className="font-medium text-gray-800">Burak Long</div>
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">longburak@gmail.com</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left font-medium text-green-500">
              $1,890.66
            </div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-lg text-center">🇬🇧</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function compareArrays(arr, obj) {
  return arr.map((property) => {
    const { key } = property;
    const value = obj[key];

    if (typeof value === "string") {
      return {
        ...property,
        value: value,
        isString: true,
        showOnlyRangeTo: false,
      };
    } else if (typeof value === "object") {
      const { rangeFrom, rangeTo, unit, notes } = value;
      if (rangeFrom === 0 && rangeTo === 0) {
        return {
          ...property,
          value: notes,
          isString: false,
          showOnlyRangeTo: true,
        };
      } else if (rangeFrom === 0) {
        return {
          ...property,
          value: `${rangeTo} ${unit}`,
          isString: false,
          showOnlyRangeTo: true,
        };
      } else {
        return {
          ...property,
          value: `${rangeFrom} - ${rangeTo} ${unit}`,
          isString: false,
          showOnlyRangeTo: false,
        };
      }
    } else {
      return property;
    }
  });
}

function generateSliderArr(inputArray) {
  let resultArray = [];
  let currentSubArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    currentSubArray.push(inputArray[i]);

    if ((i + 1) % 3 === 0 || i === inputArray.length - 1) {
      resultArray.push([...currentSubArray]);
      currentSubArray = [];
    }
  }

  return resultArray;
}

function EXIMService() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  //   const variantDetail = useSelector((state) => state.products?.variantDetail);

  const [selectedViewMode, setSelectedViewMode] = useState({
    label: "Annual volume view",
    value: "volume",
  });

  const [selectedLocationViewMode, setSelectedLocationViewMode] = useState({
    label: "Foreign ports",
    value: "pod",
  });

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>My costing history | PWIP</title>

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
        <Header hideLogo={true} />

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-v2-gray-100 z-0 space-y-2 pb-12`}
        >
          <div className="sticky top-0 w-full h-auto pt-3 pb-4 bg-pwip-v2-gray-100">
            <div className="flex flex-col w-full space-y-1 px-5">
              <div
                style={{
                  filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
                }}
                className="h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
              >
                <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                  <svg
                    width="38"
                    height="17"
                    viewBox="0 0 38 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="38" height="17" rx="4" fill="#878D96" />
                    <path
                      d="M8.79901 12V4.72727H9.89631V7.88778H13.522V4.72727H14.6229V12H13.522V8.82884H9.89631V12H8.79901ZM20.1875 6.63778C20.1496 6.30161 19.9934 6.04119 19.7188 5.85653C19.4441 5.66951 19.0985 5.57599 18.6818 5.57599C18.3835 5.57599 18.1255 5.62334 17.9077 5.71804C17.6899 5.81037 17.5206 5.93821 17.3999 6.10156C17.2815 6.26255 17.2223 6.44602 17.2223 6.65199C17.2223 6.82481 17.2625 6.97396 17.343 7.09943C17.4259 7.22491 17.5336 7.33026 17.6662 7.41548C17.8011 7.49834 17.9455 7.56818 18.0994 7.625C18.2533 7.67945 18.4013 7.72443 18.5433 7.75994L19.2536 7.9446C19.4856 8.00142 19.7235 8.07836 19.9673 8.17543C20.2112 8.27249 20.4373 8.40033 20.6456 8.55895C20.8539 8.71757 21.022 8.91406 21.1499 9.14844C21.2801 9.38281 21.3452 9.66335 21.3452 9.99006C21.3452 10.402 21.2386 10.7678 21.0256 11.0874C20.8149 11.407 20.5083 11.6591 20.1058 11.8438C19.7057 12.0284 19.2216 12.1207 18.6534 12.1207C18.1089 12.1207 17.6378 12.0343 17.2401 11.8615C16.8423 11.6887 16.531 11.4437 16.3061 11.1264C16.0812 10.8068 15.9569 10.428 15.9332 9.99006H17.0341C17.0554 10.2528 17.1406 10.4718 17.2898 10.647C17.4413 10.8198 17.6342 10.9489 17.8686 11.0341C18.1054 11.117 18.3646 11.1584 18.6463 11.1584C18.9564 11.1584 19.2322 11.1098 19.4737 11.0128C19.7176 10.9134 19.9093 10.776 20.049 10.6009C20.1887 10.4233 20.2585 10.2161 20.2585 9.9794C20.2585 9.76397 20.197 9.58759 20.0739 9.45028C19.9531 9.31297 19.7886 9.19934 19.5803 9.10938C19.3743 9.01941 19.1411 8.9401 18.8807 8.87145L18.0213 8.63707C17.4389 8.47846 16.9773 8.24527 16.6364 7.9375C16.2978 7.62973 16.1286 7.22254 16.1286 6.71591C16.1286 6.29687 16.2422 5.93111 16.4695 5.61861C16.6967 5.30611 17.0045 5.06345 17.3928 4.89062C17.781 4.71544 18.219 4.62784 18.7067 4.62784C19.1991 4.62784 19.6335 4.71425 20.0099 4.88707C20.3887 5.0599 20.687 5.29782 20.9048 5.60085C21.1226 5.90151 21.2363 6.24716 21.2457 6.63778H20.1875ZM28.5265 4.72727V12H27.5179L23.8212 6.66619H23.7537V12H22.6564V4.72727H23.6721L27.3723 10.0682H27.4398V4.72727H28.5265Z"
                      fill="#F3F7F9"
                    />
                  </svg>
                </button>

                <span className="w-full bg-white pl-[18px] text-sm font-sans outline-none border-none text-pwip-v2-gray-500">
                  Search for a HSN
                </span>
                <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                  {chevronDown}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white w-full py-4 px-5 relative space-y-9">
            <div className="w-full h-auto">
              <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] mt-3 w-full">
                <div className="flex flex-nowrap space-x-3">
                  {[
                    {
                      title: "Most exported to port",
                      value: "Abu dhabi",
                    },

                    {
                      title: "Most exported to country",
                      value: "Emirates",
                    },

                    {
                      title: "Most exported in year",
                      value: "2017",
                    },

                    {
                      title: "Most exported from port",
                      value: "Kolkata",
                    },

                    {
                      title: "Total volume exported",
                      value: "54M",
                    },

                    {
                      title: "Total FOB exported",
                      value: "$392k",
                    },
                  ].map((d, i) => (
                    <div
                      key={d?.title + "_" + i}
                      className="px-4 py-3 rounded-lg border border-pwip-v2-gray-200 inline-flex w-full flex-col space-y-2"
                    >
                      <div className="h-8 w-8 rounded-full bg-pwip-v2-primary-200"></div>
                      <div className="inline-flex flex-col space-y-1">
                        <span className="font-medium text-pwip-black-600 text-sm whitespace-nowrap">
                          {d?.title}
                        </span>

                        <span className="font-normal text-pwip-gray-550 text-sm whitespace-nowrap">
                          {d?.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-auto space-y-7">
              {[
                {
                  type: "up",
                },
                {
                  type: "up",
                },
                {
                  type: "down",
                },
              ].map((d, i) => {
                return (
                  <div
                    key={d?.type + "_" + i}
                    className="w-full inline-flex items-start justify-start space-x-4"
                  >
                    {d?.type === "up" ? (
                      <div
                        className={`h-6 w-6 ${
                          d?.type === "up"
                            ? "text-pwip-v2-green-600 bg-pwip-green-200"
                            : ""
                        } rounded-full inline-flex items-center justify-center`}
                      >
                        {increaseUpIcon}
                      </div>
                    ) : (
                      <div className="min-h-6 min-w-6 max-h-6 max-w-6 text-pwip-v2-red-600 bg-pwip-v2-red-200 rounded-full inline-flex items-center justify-center">
                        {decreaseDownIcon}
                      </div>
                    )}

                    <div className="inline-flex flex-col space-y-1">
                      <span className="font-medium text-pwip-black-600 text-sm whitespace-nowrap">
                        Increasing demand
                      </span>
                      <p className="font-normal text-pwip-gray-550 text-sm max-w-[90%]">
                        Over the last 5 years, market demand has increased to
                        4.85%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* table */}

            <div className="inline-flex w-full flex-col h-auto">
              <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] mt-3 w-full mb-4">
                <div className="flex flex-nowrap space-x-3">
                  <div
                    onClick={() => {
                      const content = (
                        <ViewMode
                          handleSelect={(selectedMode) => {
                            setSelectedViewMode(selectedMode);
                          }}
                          selectedViewMode={selectedViewMode}
                        />
                      );
                      openBottomSheet(content);
                    }}
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-pwip-v2-gray-350"
                  >
                    <span className="text-pwip-v2-primary-700">
                      {eyePreviewIcon}
                    </span>
                    <div className="inline-flex items-center justify-between space-x-10">
                      <span className="text-sm text-pwip-gray-800 whitespace-nowrap">
                        {selectedViewMode?.label}
                      </span>
                      {chevronDown}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      const content = (
                        <LocationViewMode
                          handleSelect={(selectedMode) => {
                            setSelectedLocationViewMode(selectedMode);
                          }}
                          selectedViewMode={selectedLocationViewMode}
                        />
                      );
                      openBottomSheet(content);
                    }}
                    className="inline-flex items-center px-3 py-2 rounded-lg border border-pwip-v2-gray-350"
                  >
                    <div className="inline-flex items-center justify-between space-x-10">
                      <span className="text-sm text-pwip-gray-800 whitespace-nowrap">
                        {selectedLocationViewMode?.label}
                      </span>
                      {chevronDown}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-auto overflow-x-scroll hide-scroll-bar">
                {selectedViewMode?.value === "all" ? (
                  <DataTableForAllFilter />
                ) : (
                  <DataTableForAnnualViewFilter />
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(EXIMService);

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  // fetchMyCostingRequest,
  fetchAllMyCostingsRequest,
  saveCostingFailure,
  fetchMyCostingFailure,
  saveCostingSuccess,
} from "@/redux/actions/myCosting.actions";
import { fetchGeneratedCostingFailure } from "@/redux/actions/costing.actions";
import { setTermsOfShipmentRequest } from "@/redux/actions/shipmentTerms.actions";

import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";

// Import Components
import { Header } from "@/components/Header";
import { inrToUsd } from "@/utils/helper";

// import { riceGrainIcon } from "../../theme/icon";

// Import Containers

// Import Layouts

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

const popularFilters = [
  {
    name: "Basmati",
    icon: "one.png",
  },
  {
    name: "Paraboiled",
    icon: "two.png",
  },
  {
    name: "Raw",
    icon: "three.png",
  },
  {
    name: "Steam",
    icon: "four.png",
  },
  {
    name: "Steam",
    icon: "five.png",
  },
];

const units = [
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

function MyCosting() {
  const router = useRouter();
  const dispatch = useDispatch();

  // const myCosting = useSelector((state) => state.myCosting);
  const allMyCostingsFromHistory = useSelector(
    (state) => state.myCosting.allMyCostingsFromHistory
  );
  const forexRate = useSelector((state) => state.utils.forexRate);
  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [allMyCostingsData, setAllMyCostingsData] = React.useState([]);
  const [searchStringValue, setSearchStringValue] = React.useState("");

  function handleSearch(searchString) {
    const dataToFilter = [...allMyCostingsFromHistory];

    // Create an empty array to store the matching variants
    const matchingVariants = [];

    // Convert the search string to lowercase for a case-insensitive search
    const searchLower = searchString.toLowerCase();

    // Iterate through the array of variants
    for (const variant of dataToFilter) {
      // Convert the variant name to lowercase for comparison
      const variantNameLower = variant.costingName.toLowerCase();

      // Check if the variant name contains the search string
      if (variantNameLower.includes(searchLower)) {
        // If it does, add the variant to the matchingVariants array
        matchingVariants.push(variant);
      }
    }

    if (searchString) {
      setAllMyCostingsData([...matchingVariants]);
    }

    if (!searchString) {
      setAllMyCostingsData([...allMyCostingsFromHistory]);
    }
  }

  React.useEffect(() => {
    if (allMyCostingsFromHistory && allMyCostingsFromHistory?.length) {
      setAllMyCostingsData([...allMyCostingsFromHistory]);
    }
  }, [allMyCostingsFromHistory]);

  React.useEffect(() => {
    dispatch(fetchAllMyCostingsRequest());
  }, []);

  React.useEffect(() => {
    if (!searchScreenActive && allMyCostingsFromHistory?.length) {
      handleSearch("");
      setSearchStringValue("");
    }
  }, [searchScreenActive, allMyCostingsFromHistory]);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  const handleInputDoneClick = (event) => {
    event.target.blur();
  };

  let blurOccurred = null;

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>Export Costing by pwip</title>

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

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Header />

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-white-100 z-0 py-6`}
        >
          <div
            id="fixedMenuSection"
            className={`fixed left-0 top-[56px] h-[auto] w-full bg-white z-0 pt-3 pb-6 px-5`}
          >
            <div
              style={{
                filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
              }}
              className="h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
            >
              <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.7"
                    d="M15.62 14.7062L12.0868 11.3939M13.9956 7.09167C13.9956 10.456 11.0864 13.1833 7.49778 13.1833C3.90915 13.1833 1 10.456 1 7.09167C1 3.72733 3.90915 1 7.49778 1C11.0864 1 13.9956 3.72733 13.9956 7.09167Z"
                    stroke="#878D96"
                    strokeWidth="1.52292"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                placeholder="Search for a variety of rice"
                className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
                value={searchStringValue}
                onFocus={() => {
                  // setSearchFocus(true);
                  dispatch(searchScreenRequest(true));
                  window.clearTimeout(blurOccurred);
                }}
                onBlur={(e) => {
                  // setSearchFocus(false);
                  // dispatch(searchScreenFailure());
                  blurOccurred = window.setTimeout(function () {
                    handleInputDoneClick(e);
                  }, 10);
                }}
                onChange={(event) => {
                  setSearchStringValue(event.target.value);
                  handleSearch(event.target.value);
                }}
              />
              {searchStringValue || searchScreenActive ? (
                <button
                  onClick={() => {
                    setSearchStringValue("");
                    handleSearch("");
                    dispatch(searchScreenFailure());
                  }}
                  className="outline-none border-none bg-transparent inline-flex items-center justify-center"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4584 5.54199L5.54175 13.4587M5.54175 5.54199L13.4584 13.4587"
                      stroke="#686E6D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
          <div
            className={`min-h-[calc(100vh-140px)] inline-flex flex-col h-full w-full px-5 bg-pwip-v2-gray-100 pb-0 overflow-auto hide-scroll-bar`}
            style={{
              paddingTop: mainContainerHeight + "px",
              paddingBottom: mainContainerHeight + 20 + "px",
            }}
          >
            {/* {!searchStringValue && !searchScreenActive ? (
              <div className="flex overflow-x-scroll hide-scroll-bar mb-[28px]">
                <div className="flex flex-nowrap">
                  <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
                    <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
                      <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                        Filter
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="11"
                        viewBox="0 0 19 11"
                        fill="none"
                      >
                        <path
                          d="M7.75 2.5H17.5M7.75 2.5C7.75 2.89782 7.59196 3.27936 7.31066 3.56066C7.02936 3.84196 6.64782 4 6.25 4C5.85218 4 5.47064 3.84196 5.18934 3.56066C4.90804 3.27936 4.75 2.89782 4.75 2.5M7.75 2.5C7.75 2.10218 7.59196 1.72064 7.31066 1.43934C7.02936 1.15804 6.64782 1 6.25 1C5.85218 1 5.47064 1.15804 5.18934 1.43934C4.90804 1.72064 4.75 2.10218 4.75 2.5M4.75 2.5H1M13.75 8.5H17.5M13.75 8.5C13.75 8.89782 13.592 9.27936 13.3107 9.56066C13.0294 9.84196 12.6478 10 12.25 10C11.8522 10 11.4706 9.84196 11.1893 9.56066C10.908 9.27936 10.75 8.89782 10.75 8.5M13.75 8.5C13.75 8.10218 13.592 7.72064 13.3107 7.43934C13.0294 7.15804 12.6478 7 12.25 7C11.8522 7 11.4706 7.15804 11.1893 7.43934C10.908 7.72064 10.75 8.10218 10.75 8.5M10.75 8.5H1"
                          stroke="#434B53"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
                    <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
                      <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                        Sort
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="8"
                        viewBox="0 0 13 8"
                        fill="none"
                      >
                        <path
                          d="M12 1L6.5 6.5L1 1"
                          stroke="#434B53"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {[...popularFilters].map((items, index) => {
                    return (
                      <div
                        key={items?.name + (index + 1 * 2)}
                        className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
                      >
                        <div className="overflow-hidden w-auto h-auto inline-flex items-center">
                          <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                            {items?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null} */}

            <div className="w-full space-y-5">
              {allMyCostingsData?.map((items, index) => {
                return (
                  <div
                    key={items._id + index}
                    className="bg-white rounded-md px-4 py-3 cursor-pointer"
                    style={{
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.10)",
                    }}
                    onClick={async () => {
                      await dispatch(saveCostingFailure());
                      await dispatch(fetchMyCostingFailure());
                      await dispatch(fetchGeneratedCostingFailure());
                      await dispatch(saveCostingSuccess(items));
                      // await dispatch(fetchMyCostingRequest(items._id));
                      const action = {
                        selected: items?.termOfAgreement,
                        showShipmentTermDropdown: false,
                      };
                      await dispatch(setTermsOfShipmentRequest(action));
                      router.push("/export-costing/costing");
                    }}
                  >
                    <div className="inline-flex items-start justify-between w-full">
                      <div className="inline-flex flex-col items-start max-w-[70%] overflow-hidden">
                        <span className="line-clamp-1 text-sm text-pwip-black-600 font-[700] uppercase">
                          {items?.costingName ||
                            `${items?.variantName} - ${items?.destinationPortName}`}
                        </span>
                        <div className="inline-flex items-end space-x-2 mt-[8px]">
                          <span className="text-pwip-black-600 text-sm font-normal font-sans line-clamp-1">
                            {items?.variantName}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex text-right flex-col items-end justify-end text-pwip-v2-green-800">
                        <span className="text-sm font-[700] font-sans line-clamp-1">
                          ${inrToUsd(items?.grandTotal, forexRate.USD)}/
                          {items?.unit}
                        </span>

                        <span className="text-xs font-[700] font-sans line-clamp-1 text-pwip-v2-primary mt-[8px]">
                          ₹{items?.grandTotal}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center justify-between w-full mt-6 mb-[8px]">
                      <div className="w-full mt-[8px] flex items-center justify-between space-x-2">
                        <div className="inline-flex items-center space-x-3">
                          <span className="text-pwip-black-600 text-xs font-[600] font-sans line-clamp-1">
                            {items?.sourceName === "Visakhapatnam"
                              ? "Vizag"
                              : items?.sourceName}
                          </span>
                        </div>

                        <div className="inline-flex items-center space-x-3 text-pwip-black-600">
                          {lineBetweenLocation}
                        </div>

                        <div className="inline-flex items-center space-x-3">
                          <span className="text-pwip-black-600 text-xs font-[600] font-sans line-clamp-1">
                            {items?.originPortName === "Visakhapatnam Port"
                              ? "Vizag Port"
                              : items?.originPortName}
                          </span>
                        </div>

                        <div className="inline-flex items-center space-x-3 text-pwip-black-600">
                          {lineBetweenLocation}
                        </div>

                        <div className="inline-flex items-center space-x-3">
                          <span className="text-pwip-black-600 text-xs font-[600] font-sans line-clamp-1">
                            {items?.destinationPortName || "-/-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full inline-flex items-center justify-between text-pwip-gray-550">
                      <div className="inline-flex items-center space-x-4">
                        <span className="text-sm font-normal font-sans line-clamp-1">
                          {items?.brokenPercentage || 0}% Broken
                        </span>
                        <div className="h-[18px] w-[1px] bg-pwip-gray-550" />
                        <span className="line-clamp-1 text-sm">
                          {items?.termOfAgreement || ""}
                        </span>
                      </div>
                      <div className="inline-flex items-start space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4.44768 2V3.5M11.3663 2V3.5M1.97675 12.5V5C1.97675 4.60218 2.13294 4.22064 2.41098 3.93934C2.68901 3.65804 3.0661 3.5 3.4593 3.5H12.3547C12.7479 3.5 13.1249 3.65804 13.403 3.93934C13.681 4.22064 13.8372 4.60218 13.8372 5V12.5M1.97675 12.5C1.97675 12.8978 2.13294 13.2794 2.41098 13.5607C2.68901 13.842 3.0661 14 3.4593 14H12.3547C12.7479 14 13.1249 13.842 13.403 13.5607C13.681 13.2794 13.8372 12.8978 13.8372 12.5M1.97675 12.5V7.5C1.97675 7.10218 2.13294 6.72064 2.41098 6.43934C2.68901 6.15804 3.0661 6 3.4593 6H12.3547C12.7479 6 13.1249 6.15804 13.403 6.43934C13.681 6.72064 13.8372 7.10218 13.8372 7.5V12.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="line-clamp-1 text-sm">
                          {items?.createdAt
                            ? moment(items?.createdAt).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(MyCosting);

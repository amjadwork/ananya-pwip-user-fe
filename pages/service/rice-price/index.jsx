import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  searchIcon,
  bookmarkFilledIcon,
  bookmarkOutlineIcon,
} from "../../../theme/icon";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import {
  getStateAbbreviation,
  checkSubscription,
  ricePriceServiceId,
} from "@/utils/helper";

import {
  fetchVariantPriceRequest,
  addVariantToWatchlistRequest,
  fetchAllWatchlistForVariantRequest,
} from "@/redux/actions/variant-prices.actions";
import { productStateList } from "@/constants/stateList";

// Import Containers

// Import Layouts
const SERVICE_ID = ricePriceServiceId;

const FilterSection = ({ allTagsData, handleFilterSelect, selectedFilter }) => {
  return (
    <div className={`flex w-full flex-col px-5 pb-4`}>
      <div className={`flex overflow-x-scroll hide-scroll-bar`}>
        <div className="flex flex-nowrap">
          <div
            className={`inline-block px-[16px] py-[4px] border-[1px] ${
              selectedFilter === "All"
                ? "border-pwip-v2-primary-700 bg-pwip-v2-primary-200"
                : "border-pwip-v2-gray-200 bg-pwip-v2-gray-100"
            } rounded-full mr-[12px] transition-all`}
            // className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
          >
            <div
              onClick={() => {
                handleFilterSelect(null, true);
              }}
              className="overflow-hidden text-pwip-v2-gray-800 w-auto h-auto inline-flex items-center space-x-2"
            >
              <span className="text-xs text-pwip-v2-gray-800 font-[400] whitespace-nowrap">
                All
              </span>

              {selectedFilter === "All" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-[14px] h-[14px]"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
          {[...allTagsData].map((items, index) => {
            const isSelected = selectedFilter?._id === items?._id || false;

            return (
              <div
                key={items?.name + (index + 1 * 2)}
                onClick={() => {
                  handleFilterSelect(items);
                }}
                // className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
                className={`inline-block whitespace-nowrap px-[16px] py-[3px] border-[1px] ${
                  isSelected
                    ? "border-pwip-v2-primary-700 bg-pwip-v2-primary-200"
                    : "border-pwip-v2-gray-200 bg-pwip-v2-gray-100"
                } rounded-full mr-[12px] transition-all`}
              >
                <div className="overflow-hidden text-pwip-v2-gray-800 w-auto h-auto inline-flex items-center space-x-2">
                  <span className="text-xs font-[400] whitespace-nowrap">
                    {items?.name}
                  </span>

                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-[14px] h-[14px]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function mapWatchlist(array1, array2) {
  // Create a map to store objects from array1 based on _variantId and _sourceId
  const map = new Map();
  array1.forEach((item) =>
    map.set(`${item._variantId}-${item._sourceId}`, item)
  );

  // Modify array2 to include watchlist key with matching object from array1
  const newArray2 = array2.map((item) => {
    const watchlistItem = map.get(`${item.variantId}-${item.source._sourceId}`);
    return watchlistItem
      ? { ...item, watchlist: watchlistItem }
      : { ...item, watchlist: null };
  });

  return newArray2;
}

function RicePrice() {
  const fixedDivRef = useRef();

  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);
  const variantPriceList =
    useSelector((state) => state.variantPriceList.variantWithPriceList) || [];
  const variantWatchList =
    useSelector((state) => state.variantPriceList.variantWatchList) || [];

  const [isFixed, setIsFixed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [filteredVariantPriceListData, setFilteredVariantPriceListData] =
    useState([]);

  const [topWatchlistVariants, setTopWatchlistVariants] = useState([]);

  const checkY = () => {
    if (fixedDivRef.current) {
      const fixedDivTop = fixedDivRef.current.offsetTop; //fixedDivRef.current.offsetHeight;

      const shouldBeFixed =
        parseInt(window.scrollY.toFixed(0)) >= parseInt(fixedDivTop.toFixed(0));

      if (shouldBeFixed) {
        setIsFixed(true);
      } else if (!shouldBeFixed) {
        setIsFixed(false);
      }
    }
  };

  const debouncedCheckY = debounce(checkY, 5);

  useEffect(() => {
    window.addEventListener("scroll", debouncedCheckY);

    return () => {
      window.removeEventListener("scroll", debouncedCheckY);
    };
  }, []);

  async function initPage() {
    const details = await checkSubscription(SERVICE_ID, authToken);

    if (!details?.activeSubscription) {
      router.replace("/service/rice-price/lp");

      return;
    }

    await dispatch(fetchVariantPriceRequest());
    await dispatch(fetchAllWatchlistForVariantRequest());

    return;
  }

  useLayoutEffect(() => {
    initPage();
  }, []);

  useEffect(() => {
    if (variantPriceList.length) {
      if (variantWatchList.length) {
        const mergedData = mapWatchlist(variantWatchList, variantPriceList);
        setFilteredVariantPriceListData(mergedData);

        let filteredForSavedWatchlist = [...mergedData].filter((d) => {
          if (d?.watchlist?.saved) return d;
        });

        if (filteredForSavedWatchlist.length > 5) {
          filteredForSavedWatchlist = filteredForSavedWatchlist.slice(0, 5);
        }

        setTopWatchlistVariants([...filteredForSavedWatchlist]);
      } else {
        setFilteredVariantPriceListData(variantPriceList);
      }
    }
  }, [variantWatchList, variantPriceList]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>My costing history | PWIP</title>

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

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-white-100 z-0`}
        >
          {topWatchlistVariants?.length ? (
            <div className="inline-flex w-full items-center justify-between px-5 py-3">
              <span className="text-pwip-v2-primary text-xs font-semibold">
                Watchlist
              </span>
              <span className="text-pwip-v2-gray-500 text-xs">Manage</span>
            </div>
          ) : null}

          {topWatchlistVariants?.length ? (
            <div
              className={`flex overflow-x-scroll hide-scroll-bar px-5 space-x-3`}
            >
              {topWatchlistVariants.map((item, index) => {
                return (
                  <div
                    key={item?.name + "_" + index}
                    className="flex flex-nowrap"
                  >
                    <div className="inline-flex flex-col px-3 py-4 bg-pwip-v2-gray-100 space-y-3 w-[242px] rounded-lg">
                      <div className="inline-flex items-center justify-between w-full">
                        <div className="w-[70%]">
                          <span className="text-sm font-semibold text-pwip-black-600 line-clamp-1">
                            {item?.name}
                          </span>
                        </div>

                        <div className="w-auto inline-flex items-center justify-end">
                          <span className="text-sm font-bold text-pwip-v2-primary whitespace-nowrap">
                            ₹{item?.source?.price}/{item?.unit}
                          </span>
                        </div>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <span className="text-xs font-normal text-pwip-gray-400">
                          {item?.source?.region}
                        </span>

                        {item?.source?.changeDir === "+" ? (
                          <span className="text-xs font-normal text-pwip-green-800">
                            {item?.source?.changeDir}₹{item?.changeInPrice || 0}
                          </span>
                        ) : (
                          <span className="text-xs font-normal text-pwip-red-700">
                            {item?.source?.changeDir}₹
                            {`${item?.source?.changeInPrice}`.split("-")
                              .length === 2
                              ? `${item?.source?.changeInPrice}`.split("-")[1]
                              : 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="inline-flex flex-col w-full mt-8">
            <div className="inline-flex w-full items-center justify-between px-5 py-3">
              <span className="text-pwip-v2-primary text-base font-bold">
                Search rice by states
              </span>
              {/* <span className="text-pwip-v2-gray-500 text-xs">
                {searchIcon}
              </span> */}
            </div>

            <div
              className={`flex overflow-x-scroll hide-scroll-bar px-5 space-x-5 mt-2`}
            >
              {productStateList.map((item, index) => {
                return (
                  <div
                    key={index * 33 + "_" + index}
                    className="flex flex-nowrap"
                  >
                    <div className="inline-flex flex-col space-y-5">
                      {item.map((states, stateIndex) => {
                        return (
                          <div
                            key={states?.name + "_" + stateIndex}
                            className="inline-flex flex-col items-center justify-center bg-white space-y-3 min-w-[80px] rounded-lg"
                          >
                            <img
                              className="w-[80px] rounded-md border-[1px] border-pwip-v2-gray-300"
                              src={states?.imageUrl}
                            />
                            <span className="text-pwip-v2-gray-800 whitespace-nowrap text-xs font-normal text-center">
                              {states?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={fixedDivRef}
            className="inline-flex flex-col w-full mt-8 bg-pwip-v2-gray-50"
          >
            <div
              className={`w-full bg-white ${
                isFixed ? "sticky top-[56px] left-0 z-10" : ""
              }`}
            >
              <div className="inline-flex w-full items-center justify-between px-5 py-6">
                <span className="text-pwip-v2-primary text-base font-bold">
                  {filteredVariantPriceListData?.length} varieties to explore
                </span>
                <span className="text-pwip-v2-gray-500 text-xs">
                  {searchIcon}
                </span>
              </div>

              <FilterSection
                allTagsData={[
                  {
                    _id: 0,
                    name: "Basmati",
                  },
                  {
                    _id: 1,
                    name: "Parboiled",
                  },
                  {
                    _id: 2,
                    name: "Raw",
                  },
                  {
                    _id: 3,
                    name: "Steam",
                  },
                  {
                    _id: 4,
                    name: "Sella",
                  },
                ]}
                selectedFilter={selectedFilter}
                handleFilterSelect={(item, isAll) => {
                  if (selectedFilter !== "All" && isAll) {
                    setSelectedFilter("All");
                    setFilteredVariantPriceListData([...variantPriceList]);
                    return null;
                  }

                  if (selectedFilter === "All" && isAll) {
                    return null;
                  }

                  if (selectedFilter?.name === item?.name) {
                    setSelectedFilter(null);
                    setFilteredVariantPriceListData([...variantPriceList]);
                    return null;
                  } else {
                    setSelectedFilter(item);
                  }

                  const dataToFilterOrSort = [...variantPriceList];

                  const filteredData = dataToFilterOrSort?.filter((d) => {
                    if (
                      d?.name
                        ?.toLowerCase()
                        ?.includes(item?.name?.toLowerCase())
                    ) {
                      return d;
                    }
                  });

                  setFilteredVariantPriceListData([...filteredData]);
                }}
              />
            </div>

            <div
              div
              className="w-full h-auto inline-flex flex-col hide-scroll-bar"
            >
              <div
                className={`w-full h-full space-y-4 px-5 pt-4 pb-[72px] overflow-y-auto hide-scroll-bar transition-all`}
              >
                {filteredVariantPriceListData.map((item, index) => {
                  return (
                    <div
                      key={item.source._id + index}
                      className="inline-flex flex-col w-full space-y-5 bg-white rounded-lg px-3 py-4"
                    >
                      <div className="inline-flex w-full justify-between">
                        <div
                          onClick={() => {
                            router.push("/service/rice-price/detail");
                          }}
                          className="relative inline-flex space-x-3 w-[90%]"
                        >
                          <img
                            src={
                              item?.images?.length
                                ? item?.images[0]
                                : "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                            }
                            className="bg-cover h-[42px] w-[44px] border-[1px] border-pwip-v2-gray-100 rounded-lg object-cover"
                          />

                          <div className="inline-flex flex-col items-start justify-between w-full">
                            <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                              {item?.name}
                            </span>

                            <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1 mt-[6px]">
                              <span className="text-pwip-black-600">
                                {item?.source?.region},{" "}
                                {getStateAbbreviation(item?.source?.state) ||
                                  ""}
                              </span>{" "}
                              {item?.brokenPercentage || 0}% Broken
                            </span>
                          </div>
                        </div>

                        <div
                          onClick={() => {
                            if (
                              item?.watchlist?.saved &&
                              item?.watchlist?._sourceId ===
                                item?.source?._sourceId
                            ) {
                              dispatch(
                                addVariantToWatchlistRequest(
                                  item?.variantId,
                                  item?.source?._sourceId,
                                  "remove"
                                )
                              );

                              return;
                            }

                            dispatch(
                              addVariantToWatchlistRequest(
                                item?.variantId,
                                item?.source?._sourceId,
                                "add"
                              )
                            );
                          }}
                          className="w-[22px] h-[22px] inline-flex items-center justify-center relative text-pwip-v2-primary-800"
                        >
                          {item?.watchlist?.saved &&
                          item?.watchlist?._sourceId === item?.source?._sourceId
                            ? bookmarkFilledIcon
                            : bookmarkOutlineIcon}
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          router.push("/service/rice-price/detail");
                        }}
                        className="w-full inline-flex justify-between"
                      >
                        <div className="inline-flex items-end space-x-3">
                          <span className="text-pwip-black-600 text-sm font-bold">
                            ₹{item?.source?.price}/{item?.source?.unit}
                          </span>

                          {item?.source?.changeDir === "-" ? (
                            <span className="text-pwip-red-700 text-xs mb-[1px] font-medium">
                              {item?.source?.changeDir}₹
                              {`${item?.source?.changeInPrice}`.split("-")
                                .length === 2
                                ? `${item?.source?.changeInPrice}`.split("-")[1]
                                : 0}
                            </span>
                          ) : (
                            <span className="text-pwip-v2-green-800 text-xs mb-[1px] font-medium">
                              {item?.source?.changeDir}₹
                              {item?.source?.changeInPrice || 0}
                            </span>
                          )}
                        </div>

                        <div>
                          <Button
                            type="subtle-light"
                            label="See details"
                            rounded="!rounded-full"
                            maxHeight="!max-h-[20px]"
                            minHeight="!min-h-[20px]"
                            fontSize="!text-[11px]"
                            onClick={async () => {
                              router.push("/service/rice-price/detail");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!variantPriceList?.length ? (
                  <div className="inline-flex flex-col justify-center items-center w-full h-full">
                    <img
                      className="w-auto h-[260px]"
                      src="/assets/images/no-state/no-result.svg"
                    />
                    <h2 className="text-xl text-center text-pwip-v2-primary font-[700] mt-8">
                      No Results
                    </h2>
                    <p className="text-base text-center text-pwip-v2-gray-500 font-[500] mt-5">
                      Sorry, there is no result for this search, let’s try
                      another phrase
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(RicePrice);

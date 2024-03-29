import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { useOverlayContext } from "@/context/OverlayContext";

import {
  searchIcon,
  arrowLeftBackIcon,
  closeXmark,
  bookmarkFilledIcon,
  bookmarkOutlineIcon,
} from "../../../theme/icon";

// Import Components
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

const SearchInput = ({ placeholder }) => {
  const [searchStringValue, setSearchStringValue] = useState("");
  let blurOccurred = null;

  const handleSearch = (value) => {
    // Your search logic here
    console.log("Search value:", value);
  };

  const handleInputDoneClick = (e) => {
    // Your input done click logic here
    console.log("Input done clicked:", e);
  };

  const memoizedSearchInput = useMemo(
    () => (
      <div
        style={{
          filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
        }}
        className="h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
      >
        <button className="outline-none border-none text-[#878D96] bg-transparent inline-flex items-center justify-center">
          {searchIcon}
        </button>
        <input
          placeholder={placeholder}
          className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
          value={searchStringValue}
          onChange={(event) => {
            setSearchStringValue(event.target.value);
            handleSearch(event.target.value);
          }}
          onFocus={() => {
            window.clearTimeout(blurOccurred);
          }}
          onBlur={(e) => {
            blurOccurred = window.setTimeout(() => {
              handleInputDoneClick(e);
            }, 10);
          }}
          inputMode="text"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === "Done" ||
              event.keyCode === 13
            ) {
              event.target.blur();
            }
          }}
        />
        {searchStringValue ? (
          <button
            onClick={() => {
              setSearchStringValue("");
              handleSearch("");
            }}
            className="outline-none text-[#686E6D] border-none bg-transparent inline-flex items-center justify-center"
          >
            {closeXmark}
          </button>
        ) : null}
      </div>
    ),
    [
      searchStringValue,
      setSearchStringValue,
      handleSearch,
      handleInputDoneClick,
      blurOccurred,
    ]
  );

  return memoizedSearchInput;
};

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

function SearchAndFilter({ title }) {
  const fixedDivRef = useRef();

  const { openSearchFilterModal, closeSearchFilterModal } = useOverlayContext();

  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);
  const variantPriceList =
    useSelector((state) => state.variantPriceList.variantWithPriceList) || [];
  const variantWatchList =
    useSelector((state) => state.variantPriceList.variantWatchList) || [];

  const [isFixed, setIsFixed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [variantAndWatchlistMergedData, setVariantAndWatchlistMergedData] =
    useState([]);

  const [filteredVariantPriceListData, setFilteredVariantPriceListData] =
    useState([]);

  const [searchStringValue, setSearchStringValue] = React.useState("");

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

  const debouncedCheckY = debounce(checkY, 0);

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

  function handleSearch(searchString) {
    //
  }

  useEffect(() => {
    if (variantPriceList.length) {
      if (variantWatchList.length) {
        const mergedData = mapWatchlist(variantWatchList, variantPriceList);
        setVariantAndWatchlistMergedData(mergedData);
        setFilteredVariantPriceListData(mergedData);

        let filteredForSavedWatchlist = [...mergedData].filter((d) => {
          if (d?.watchlist?.saved) return d;
        });

        if (filteredForSavedWatchlist.length > 5) {
          filteredForSavedWatchlist = filteredForSavedWatchlist.slice(0, 5);
        }
      } else {
        setFilteredVariantPriceListData(variantPriceList);
        setVariantAndWatchlistMergedData(variantPriceList);
      }
    }
  }, [variantWatchList, variantPriceList]);

  let blurOccurred = null;

  const handleInputDoneClick = (event) => {
    event.target.blur();
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

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

      <div className={`relative h-full w-full bg-pwip-white-100 z-0`}>
        <div className="inline-flex flex-col w-full bg-pwip-v2-gray-50">
          <div
            id="fixedDiv"
            className={`w-full bg-white fixed top-0 left-0 z-10`}
          >
            <div className="inline-flex flex-col space-y-6 w-full px-5 py-6">
              <div className="inline-flex items-center space-x-4">
                <button
                  onClick={() => {
                    closeSearchFilterModal();
                  }}
                  className="outline-none border-none text-pwip-v2-primary bg-transparent inline-flex items-center justify-center"
                >
                  {arrowLeftBackIcon}
                </button>

                <div className="w-auto">
                  <span className="text-pwip-v2-primary text-base font-bold">
                    {title}
                  </span>
                </div>
              </div>

              <SearchInput placeholder="Search by rice name, or region" />
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
                  setFilteredVariantPriceListData([
                    ...variantAndWatchlistMergedData,
                  ]);
                  return null;
                }

                if (selectedFilter === "All" && isAll) {
                  return null;
                }

                if (selectedFilter?.name === item?.name) {
                  setSelectedFilter(null);
                  setFilteredVariantPriceListData([
                    ...variantAndWatchlistMergedData,
                  ]);
                  return null;
                } else {
                  setSelectedFilter(item);
                }

                const dataToFilterOrSort = [...variantAndWatchlistMergedData];

                const filteredData = dataToFilterOrSort?.filter((d) => {
                  if (
                    d?.name?.toLowerCase()?.includes(item?.name?.toLowerCase())
                  ) {
                    return d;
                  }
                });

                setFilteredVariantPriceListData([...filteredData]);
              }}
            />
          </div>

          <div
            className={`fixed left-0 top-[208px] w-full h-full space-y-4 px-5 pt-4 pb-[258px] overflow-y-scroll hide-scroll-bar transition-all`}
            style={{
              top:
                document.getElementById("fixedDiv")?.clientHeight + 12 + "px",
              paddingBottom:
                document.getElementById("fixedDiv")?.clientHeight + 62 + "px",
            }}
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
                            {getStateAbbreviation(item?.source?.state) || ""}
                          </span>{" "}
                          {item?.brokenPercentage || 0}% Broken
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        if (
                          item?.watchlist?.saved &&
                          item?.watchlist?._sourceId === item?.source?._sourceId
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

            {!filteredVariantPriceListData?.length ? (
              <div className="inline-flex flex-col justify-center items-center w-full h-full">
                <img
                  className="w-auto h-[260px]"
                  src="/assets/images/no-state/no-result.svg"
                />
                <h2 className="text-xl text-center text-pwip-v2-primary font-[700] mt-8">
                  No Results
                </h2>
                <p className="text-base text-center text-pwip-v2-gray-500 font-[500] mt-5">
                  Sorry, there is no result for this search, let’s try another
                  phrase
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SearchAndFilter;

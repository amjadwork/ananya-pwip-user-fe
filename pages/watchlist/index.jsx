/** @format */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import { useOverlayContext } from "@/context/OverlayContext";

import {
  fetchVariantPriceRequest,
  addVariantToWatchlistRequest,
  fetchAllWatchlistForVariantRequest,
} from "@/redux/actions/variant-prices.actions";

import { getStateAbbreviation } from "@/utils/helper";

import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";

import {
  bookmarkFilledIcon,
  addMoreIcon,
  checkOutlineIcon,
  checkFilledIcon,
} from "../../theme/icon";

import { Header } from "@/components/Header";
import WatchlistBottomSheet from "@/containers/rice-price/WatchlistBottomSheet";

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

function Watchlist() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);
  const variantPriceList =
    useSelector((state) => state.variantPriceList.variantWithPriceList) || [];
  const variantWatchList =
    useSelector((state) => state.variantPriceList.variantWatchList) || [];

  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );
  const { openBottomSheet, openToastMessage } = useOverlayContext();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [variantAndWatchlistMergedData, setVariantAndWatchlistMergedData] =
    useState([]);
  const [filteredVariantPriceListData, setFilteredVariantPriceListData] =
    useState([]);
  const [watchlistVariants, setWatchlistVariants] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);

  const [searchStringValue, setSearchStringValue] = React.useState("");

  let blurOccurred = null;
  function handleSearch(searchString) {
    const dataToFilter = [...watchlistVariants];
    // Create an empty array to store the matching variants
    const matchingVariants = [];

    // Convert the search string to lowercase for a case-insensitive search
    const searchLower = searchString.toLowerCase();

    // Iterate through the array of variants
    for (const variant of dataToFilter) {
      const variantNameLower = variant.name.toLowerCase();
      const sourceNameLower = variant.source.region.toLowerCase();
      const sourceStateLower = variant.source.state.toLowerCase();
      //Check if the variant name contains the search string
      if (
        variantNameLower.includes(searchLower) ||
        sourceNameLower.includes(searchLower) ||
        sourceStateLower.includes(searchLower)
      ) {
        // If it does, add the variant to the matchingVariants array
        matchingVariants.push(variant);
      }
    }

    if (searchString) {
      setFilteredWatchlist(matchingVariants);
    }

    if (!searchString) {
      let list = [...watchlistVariants];

      setFilteredWatchlist([...list]);
    }
  }

  const handleRemoveFromWatchlist = (item) => {
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
      const updatedWatchlist = watchlistVariants.filter(
        (variant) =>
          variant?.variantId !== item?.variantId ||
          variant?.source?._sourceId !== item?.source?._sourceId
      );
      setFilteredVariantPriceListData(updatedWatchlist);
    } else {
      dispatch(
        addVariantToWatchlistRequest(
          item?.variantId,
          item?.source?._sourceId,
          "add"
        )
      );
    }
  };

  const handleAddMoreBottomSheet = () => {
    setIsBottomSheetOpen(true);
    const content = (
      <WatchlistBottomSheet // Use the bottom sheet component here
        variantAndWatchlistMergedData={variantAndWatchlistMergedData}
        handleRemoveFromWatchlist={handleRemoveFromWatchlist}
        getStateAbbreviation={getStateAbbreviation}
      />
    );
    openBottomSheet(content);
  };

  const handleInputDoneClick = (event) => {
    event.target.blur();
  };

  React.useEffect(() => {
    if (!searchScreenActive && watchlistVariants.length) {
      handleSearch("");
      setSearchStringValue("");
    }
  }, [searchScreenActive, watchlistVariants]);

  useEffect(() => {
    if (variantPriceList.length) {
      if (variantWatchList.length) {
        const mergedData = mapWatchlist(variantWatchList, variantPriceList);
        setVariantAndWatchlistMergedData(mergedData);
        setFilteredVariantPriceListData(mergedData);

        let filteredForSavedWatchlist = [...mergedData].filter((d) => {
          if (d?.watchlist?.saved) return d;
        });

        setWatchlistVariants([...filteredForSavedWatchlist]);
        setFilteredWatchlist([...filteredForSavedWatchlist]);
      } else {
        setFilteredVariantPriceListData(variantPriceList);
        setVariantAndWatchlistMergedData(variantPriceList);
        setWatchlistVariants([]);
        setFilteredWatchlist([]);
      }
    }
  }, [variantWatchList, variantPriceList]);

  useEffect(() => {
    if (!variantPriceList.length) {
      dispatch(fetchVariantPriceRequest());
      dispatch(fetchAllWatchlistForVariantRequest());
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>Watchlist</title>

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
        <Header />

        <div className={`relative h-full w-full bg-white`}>
          <div className="w-full px-6">
            <div className="fixed top-[56px] w-full px-5 pb-9 pt-1 left-0 bg-white">
              <div
                style={{
                  filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
                }}
                className="h-[48px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
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
                  placeholder="Search for a rice variety"
                  className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
                  value={searchStringValue}
                  onChange={(event) => {
                    setSearchStringValue(event.target.value);
                    handleSearch(event.target.value);
                  }}
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
                  inputMode="text"
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === "Done" ||
                      event.keyCode === 13
                    ) {
                      event.target.blur(); // Blur the input on "Enter" key press
                    }
                  }}
                />
                {searchStringValue || searchScreenActive ? (
                  <button
                    onClick={() => {
                      setSearchStringValue("");
                      dispatch(searchScreenFailure());
                      handleSearch("");
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

            <div className="mb-6 mt-36 flex justify-between">
              <div className="font-bold text-base text-pwip-v2-primary">
                Your top selected rices
              </div>
              <div
                className="font-semibold text-[12px] text-[#878D96] flex items-center"
                onClick={() => {
                  handleAddMoreBottomSheet();
                }}
              >
                {" "}
                Add more {addMoreIcon}{" "}
              </div>
            </div>

            <div
              className={`w-full pb-[120px] overflow-auto hide-scroll-bar grid grid-cols-2 gap-5`}
            >
              {filteredWatchlist?.length
                ? filteredWatchlist.map((item, index) => (
                    <div
                      key={item?.name + "_" + index}
                      className="h-[92px] px-3 py-4 bg-[#F3F7F9] rounded-lg mb-2.5"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="">
                          <div className="text-xs font-semibold text-pwip-black-600 line-clamp-1">
                            {item?.name}
                          </div>
                        </div>
                        <div className="w-auto flex items-center justify-end">
                          <span className="text-xs font-normal text-[#757575] whitespace-nowrap">
                            ,{item?.source?.region}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-pwip-v2-primary w-full mb-2">
                        ₹{item?.source?.price}/{item?.unit}
                      </div>
                      <div className="flex justify-between">
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
                        <div
                          onClick={() => handleRemoveFromWatchlist(item)}
                          className="cursor-pointer text-pwip-v2-primary-800"
                        >
                          {bookmarkFilledIcon}
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>

        {/*  */}
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(Watchlist);

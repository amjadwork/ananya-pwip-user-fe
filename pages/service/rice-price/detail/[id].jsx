import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { curveBumpX } from "d3-shape";
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
  sharePrimaryIcon,
  bookmarkOutlineIcon,
  bookmarkFilledIcon,
} from "../../../../theme/icon";

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

function RicePriceDetail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const variantDetail = useSelector((state) => state.products?.variantDetail);
  const variantPriceDetailById = useSelector(
    (state) => state.variantPriceList?.variantWithPriceList
  );
  const forexRate = useSelector((state) => state.utils.forexRate);

  const selectedVariantPriceDetail =
    useSelector((state) => state.variantPriceList.variantDetails) || null;

  const variantPriceHistoryData =
    useSelector((state) => state.variantPriceList.variantPriceHistory) || null;

  const variantProfileData =
    useSelector((state) => state.variantProfile.variantProfileData) || null;

  const variantWatchList =
    useSelector((state) => state.variantPriceList.variantWatchList) || [];

  const watchListData =
    useMemo(
      () => variantWatchList.find((d) => d?._sourceId === router?.query?._s),
      [variantWatchList]
    ) || null;

  const [selectedChartPeriod, setSelectedChartPeriod] = useState("3M");
  const [activeSlide, setActiveSlide] = useState(0);
  const [variantDetailData, setVariantDetailData] = useState(null);
  const [variantProfileDetailData, setVariantProfileDetailData] = useState([]);
  const [activeCurrency, setActiveCurrency] = React.useState("inr");

  const [graphData, setGraphData] = useState([
    {
      label: "Rice Price",
      data: [],
    },
  ]);

  const handleShare = () => {
    if (navigator && navigator.share) {
      navigator
        .share({
          title: "Sona masoori raw 5% broken, Raichur",
          text: ``,
          url:
            window.location.origin +
            `${window.location.pathname}?_s=${router?.query?._s}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const primaryAxis = useMemo(
    () => ({
      position: "bottom",
      showGrid: false,
      invert: false,
      shouldNice: true,
      getValue: (datum) => new Date(moment(datum.primary).format("YYYY-MM-DD")), // moment(datum.primary).format("MMM YY"),
      tickLabelRotationDeg: 0,
      styles: {
        line: {
          strokeWidth: 1,
          stroke: "#E6E6E9",
        },
        tick: {
          strokeWidth: 1,
          stroke: "#e6e6e900",
        },
      },
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        position: "left",
        elementType: "line",
        showGrid: true,
        shouldNice: true,
        getValue: (datum) => datum.secondary,
        minDomainLength: 1.25,
        tickLabelRotationDeg: 0,
        tickCount: 3,
        showDatumElements: true, // "onFocus",
        curve: curveBumpX,
        scaleType: "linear",
      },
    ],
    []
  );

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 8000,
      speed: 500,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      beforeChange: function (prev, next) {
        setActiveSlide(next);
      },
      customPaging: function (i) {
        return (
          <div
            className={`${
              activeSlide === i
                ? "w-[6px] bg-[#003559]"
                : "w-[6px] bg-[#E1E0E0]"
            } h-[6px] rounded-full`}
          >
            {/*  */}
          </div>
        );
      },
    }),
    [activeSlide]
  );

  useEffect(() => {
    if (variantDetail) {
      let detailsObj = { ...variantDetail };

      detailsObj.sourceRates =
        detailsObj?.sourceRates?.find(
          (s) => s._sourceId === router?.query?._s
        ) || null;

      console.log("variantDetail", detailsObj);
      setVariantDetailData(detailsObj);
    }
  }, [variantDetail]);

  useEffect(() => {
    if (variantPriceDetailById.length) {
      dispatch(setSelectedVariantForDetailRequest(variantPriceDetailById[0]));
    }
  }, [variantPriceDetailById]);

  useEffect(() => {
    if (router?.query?.id && router?.query?._s) {
      dispatch(fetchVariantPriceRequest(router?.query?.id, router?.query?._s));
    }
  }, [router?.query?.id, router?.query?._s]);

  useEffect(() => {
    if (router?.query?.id && router?.query?._s && selectedChartPeriod) {
      const variantId = router?.query?.id;
      const sourceId = router?.query?._s;

      const range = getDateRangeByPeriod(selectedChartPeriod);

      let startDate = range.startDate;
      let endDate = range.endDate;

      dispatch(
        fetchVariantPriceHistoryRequest(variantId, sourceId, startDate, endDate)
      );
    }
  }, [router?.query?.id, router?.query?._s, selectedChartPeriod]);

  useEffect(() => {
    if (variantPriceHistoryData.length) {
      let dataToPlot = [...variantPriceHistoryData].map((d) => {
        return {
          primary: d.createdAt,
          secondary:
            activeCurrency === "inr"
              ? d.price
              : activeCurrency === "usd"
              ? d.price / (forexRate?.USD || 83)
              : d?.price,
          radius: undefined,
        };
      });

      const graphDataPoints = [
        {
          label: "Rice Price",
          data: dataToPlot,
        },
      ];
      setGraphData(graphDataPoints);
    }
  }, [variantPriceHistoryData, activeCurrency]);

  useEffect(() => {
    if (variantProfileData?.length) {
      const profileObject = variantProfileData[0];
      const combinedArray = compareArrays(propertyData, profileObject);

      if (combinedArray.length) {
        const silderArray = generateSliderArr(combinedArray);

        setVariantProfileDetailData(silderArray);
      }
    }
  }, [variantProfileData]);

  useLayoutEffect(() => {
    if (router?.query?.id) {
      dispatch(fetchProductDetailRequest(router?.query?.id));
      dispatch(fetchVariantProfileRequest(router?.query?.id));
      dispatch(fetchAllWatchlistForVariantRequest(router?.query?.id));
    }
  }, [router?.query?.id]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>{variantDetailData?.variantName} | Rice Prices | PWIP</title>

        <meta name="PWIP Exports" content="PWIP Exports" />
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
        <Header
          hideLogo={true}
          handleCurrencyDropdownChange={(value) => {
            setActiveCurrency(value);
          }}
        />

        <div
          className={`relative top-[56px] h-full w-full bg-pwip-v2-gray-100 z-0 space-y-2 pb-12`}
        >
          <div className="relative w-full h-auto pt-3 pb-4 bg-white">
            <div className="flex flex-col w-full space-y-1 px-5">
              <div className="inline-flex w-full items-center justify-between">
                <span className="text-pwip-v2-primary-700 text-xs font-bold">
                  {selectedVariantPriceDetail?.source?.region},{" "}
                  {getStateAbbreviation(
                    selectedVariantPriceDetail?.source?.state
                  )}
                </span>
                <div className="inline-flex items-center space-x-5">
                  <button
                    onClick={() => {
                      handleShare();
                    }}
                    className="w-[22px] h-[22px] inline-flex items-center justify-center relative text-pwip-v2-primary-800 outline-none border-none"
                  >
                    {sharePrimaryIcon}
                  </button>

                  <button
                    onClick={async () => {
                      if (watchListData?.saved) {
                        await dispatch(
                          addVariantToWatchlistRequest(
                            router?.query?.id,
                            router?.query?._s,
                            "remove",
                            true
                          )
                        );
                      } else {
                        await dispatch(
                          addVariantToWatchlistRequest(
                            router?.query?.id,
                            router?.query?._s,
                            "add",
                            true
                          )
                        );
                      }
                    }}
                    className="w-[22px] h-[22px] inline-flex items-center justify-center relative text-pwip-v2-primary-800 outline-none border-none"
                  >
                    {watchListData?.saved
                      ? bookmarkFilledIcon
                      : bookmarkOutlineIcon}
                  </button>
                </div>
              </div>

              <div className="inline-flex flex-col w-full">
                <span className="text-pwip-v2-primary text-base font-bold">
                  {variantDetailData?.variantName}
                </span>
                <span className="text-pwip-gray-550 text-xs font-regular">
                  HSN Code: {variantDetailData?.HSNCode}
                </span>

                <div className="flex w-full items-end justify-between mt-4">
                  <div className="inline-flex items-end space-x-[10px]">
                    {activeCurrency === "inr" ? (
                      <React.Fragment>
                        <span className="text-pwip-v2-primary text-xl font-bold">
                          ₹{selectedVariantPriceDetail?.source?.price}/
                          {selectedVariantPriceDetail?.source?.unit}
                        </span>

                        <div className="w-auto space-x-1 border-b-[1px] border-b-pwip-gray-550 border-dashed">
                          <span className="text-pwip-gray-550 text-xs font-regular">
                            Last price: ₹
                            {(
                              selectedVariantPriceDetail?.source?.price -
                              selectedVariantPriceDetail?.source?.changeInPrice
                            )?.toFixed(2)}
                          </span>
                          {/* <span className="text-pwip-gray-400 text-xs font-regular mb-[3.5px]">
                      (23rd Mar)
                    </span> */}
                        </div>
                      </React.Fragment>
                    ) : null}

                    {activeCurrency === "usd" ? (
                      <React.Fragment>
                        <span className="text-pwip-v2-primary text-xl font-bold">
                          $
                          {(
                            selectedVariantPriceDetail?.source?.price /
                            (forexRate?.USD || 83)
                          )?.toFixed(2)}
                          /{selectedVariantPriceDetail?.source?.unit}
                        </span>

                        <div className="w-auto space-x-1 border-b-[1px] border-b-pwip-gray-550 border-dashed">
                          <span className="text-pwip-gray-550 text-xs font-regular">
                            Last price: $
                            {(
                              (selectedVariantPriceDetail?.source?.price -
                                selectedVariantPriceDetail?.source
                                  ?.changeInPrice) /
                              (forexRate?.USD || 83)
                            )?.toFixed(2)}
                          </span>
                          {/* <span className="text-pwip-gray-400 text-xs font-regular mb-[3.5px]">
                      (23rd Mar)
                    </span> */}
                        </div>
                      </React.Fragment>
                    ) : null}
                  </div>

                  {selectedVariantPriceDetail?.source?.changeDir === "+" ? (
                    <React.Fragment>
                      {activeCurrency === "inr" ? (
                        <span className="text-pwip-green-600 text-xs font-semibold mb-[3.5px]">
                          {selectedVariantPriceDetail?.source?.changeDir}₹
                          {selectedVariantPriceDetail?.source?.changeInPrice?.toFixed(
                            2
                          ) || 0}
                        </span>
                      ) : null}

                      {activeCurrency === "usd" ? (
                        <span className="text-pwip-green-600 text-xs font-semibold mb-[3.5px]">
                          {selectedVariantPriceDetail?.source?.changeDir}$
                          {(
                            (selectedVariantPriceDetail?.source
                              ?.changeInPrice || 0) / (forexRate?.USD || 83)
                          )?.toFixed(2) || 0}
                        </span>
                      ) : null}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {activeCurrency === "inr" ? (
                        <span className="text-pwip-red-700 text-xs font-semibold mb-[3.5px]">
                          {selectedVariantPriceDetail?.source?.changeDir}₹
                          {`${selectedVariantPriceDetail?.source?.changeInPrice?.toFixed(
                            2
                          )}`.split("-").length === 2
                            ? `${selectedVariantPriceDetail?.source?.changeInPrice?.toFixed(
                                2
                              )}`.split("-")[1]
                            : 0}
                        </span>
                      ) : null}

                      {activeCurrency === "usd" ? (
                        <span className="text-pwip-red-700 text-xs font-semibold mb-[3.5px]">
                          {selectedVariantPriceDetail?.source?.changeDir}₹
                          {`${(
                            selectedVariantPriceDetail?.source?.changeInPrice /
                            (forexRate?.USD || 83)
                          )?.toFixed(2)}`.split("-").length === 2
                            ? `${(
                                selectedVariantPriceDetail?.source
                                  ?.changeInPrice / (forexRate?.USD || 83)
                              )?.toFixed(2)}`.split("-")[1]
                            : 0}
                        </span>
                      ) : null}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col w-full bg-white px-5">
              <div
                className="w-full h-[200px] relative overflow-hidden mt-3"
                id="rice-detail"
              >
                {graphData[0]?.data?.length ? (
                  <Chart
                    options={{
                      data: [...graphData],
                      primaryAxis,
                      secondaryAxes,
                      padding: {
                        left: 0,
                        right: 0,
                      },
                      tooltip: {
                        show: false,
                      },
                      showDebugAxes: false,
                      showVoronoi: false,
                      memoizeSeries: true,
                      defaultColors: ["#61A1E7"],
                      interactionMode: "primary",
                      primaryCursor: {
                        show: true,
                        showLine: true,
                        showLabel: true,
                      },
                    }}
                  />
                ) : null}
              </div>

              <div className="grid grid-cols-6 bg-pwip-v2-gray-100 rounded-lg mt-7">
                {graphPeriod.map((period, periodIndex) => {
                  return (
                    <div
                      onClick={() => {
                        setSelectedChartPeriod(period);
                      }}
                      className={`w-full h-auto py-3 px-2 inline-flex items-center justify-center text-center text-xs font-semibold ${
                        selectedChartPeriod === period
                          ? "bg-pwip-v2-primary-700 text-pwip-white-100"
                          : "text-pwip-black-600"
                      } ${
                        periodIndex === graphPeriod.length - 1
                          ? "rounded-r-lg"
                          : ""
                      } ${periodIndex === 0 ? "rounded-l-lg" : ""}`}
                    >
                      {period}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white w-full py-4 px-5 relative">
            <h3 className="font-semibold text-lg text-pwip-black-600">
              Properties
            </h3>

            <div id="variant-properties" className="mt-5">
              <Slider {...sliderSettings}>
                {variantProfileDetailData.map((items, index) => {
                  return (
                    <div
                      key={"items_13ew" + index * 123}
                      className="grid grid-rows-4 w-full px-3 min-h-[183px]"
                    >
                      {items.map((property, propertyIndex) => (
                        <div
                          className={`py-5 ${
                            propertyIndex === items.length - 1
                              ? ""
                              : "border-b-[1px] border-b-pwip-v2-gray-250"
                          } w-full inline-flex justify-between items-center`}
                        >
                          <div className="inline-flex items-center space-x-5">
                            <img className="h-4 w-4" src={property.icon} />

                            <span className="text-sm text-pwip-black-600 font-semibold">
                              {property.label}
                            </span>
                          </div>

                          <span className="text-sm text-pwip-gray-550 font-regular">
                            {property.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>

          <div className="inline-flex w-full px-5 py-4 !mt-[42px]">
            <div className="relative w-full">
              <img
                src="/assets/images/services/ec-cta-banner.png"
                className="w-full h-full relative z-0"
              />

              <div className="absolute top-0 left-0 z-10 bg-transparent w-full h-full inline-flex flex-col items-center justify-between py-[32px]">
                <h2 className="text-center text-pwip-white-100 font-bold text-sm">
                  <span className="opacity-[0.8]">Get</span>{" "}
                  <span className="opacity-[1]">costing</span>{" "}
                  <span className="opacity-[0.8]">
                    for {variantDetailData?.variantName}
                  </span>
                </h2>

                <button
                  onClick={() => {
                    dispatch(
                      setCostingSelection({
                        product: variantDetailData,
                      })
                    );
                    router.push("/export-costing/select-pod");
                  }}
                  className="bg-pwip-white-100 rounded-md py-2 px-5 text-center text-pwip-v2-primary text-[11px]"
                >
                  Generate now
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

// export default withAuth(RicePriceDetail);

export default withAuth(RicePriceDetail);

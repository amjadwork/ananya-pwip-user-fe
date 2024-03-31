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
} from "@/redux/actions/variant-prices.actions";

import moment from "moment";

const graphPeriod = ["2W", "1M", "3M", "6M", "1Y", "2Y"];

const propertyData = [
  {
    icon: "/assets/images/services/prop/grain-type.png",
    label: "Grain type",
    value: "Medium grain",
  },
  {
    icon: "/assets/images/services/prop/grain-length.png",
    label: "Grain length",
    value: "N/A",
  },
  {
    icon: "/assets/images/services/prop/grain-width.png",
    label: "Grain width",
    value: "N/A",
  },
  {
    icon: "/assets/images/services/prop/grain-color.png",
    label: "Color",
    value: "off white",
  },
];

function RicePriceDetail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const variantDetail = useSelector((state) => state.products?.variantDetail);
  const variantPriceDetailById = useSelector(
    (state) => state.variantPriceList?.variantWithPriceList
  );

  const selectedVariantPriceDetail =
    useSelector((state) => state.variantPriceList.variantDetails) || null;

  const variantPriceHistoryData =
    useSelector((state) => state.variantPriceList.variantPriceHistory) || null;

  const [selectedChartPeriod, setSelectedChartPeriod] = useState("3M");
  const [activeSlide, setActiveSlide] = useState(0);
  const [variantDetailData, setVariantDetailData] = useState(null);
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
            `${window.location.pathname}?_s=${router?.query?._s}&utm_source=yourapp&utm_medium=social&utm_campaign=summer_sale&source=yourapp&campaign=summer_sale&user_id=123456&timestamp=2023-08-03`,
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
      autoplaySpeed: 6000,
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
                ? "w-[18px] bg-[#003559]"
                : "w-[8px] bg-[#E1E0E0]"
            } h-[8px] rounded-full`}
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
          secondary: d.price,
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
  }, [variantPriceHistoryData]);

  useLayoutEffect(() => {
    if (router?.query?.id) {
      dispatch(fetchProductDetailRequest(router?.query?.id));
    }
  }, [router?.query?.id]);

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
          className={`relative top-[56px] h-full w-full bg-pwip-v2-gray-100 z-0 space-y-2`}
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
                    onClick={() => {
                      //
                    }}
                    className="w-[22px] h-[22px] inline-flex items-center justify-center relative text-pwip-v2-primary-800 outline-none border-none"
                  >
                    {bookmarkFilledIcon}
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
                    <span className="text-pwip-v2-primary text-xl font-bold">
                      ₹{selectedVariantPriceDetail?.source?.price}/
                      {selectedVariantPriceDetail?.source?.unit}
                    </span>

                    <div className="w-auto space-x-1 border-b-[1px] border-b-pwip-gray-550 border-dashed">
                      <span className="text-pwip-gray-550 text-xs font-regular">
                        Last price: ₹31.50
                      </span>
                      {/* <span className="text-pwip-gray-400 text-xs font-regular mb-[3.5px]">
                      (23rd Mar)
                    </span> */}
                    </div>
                  </div>

                  {selectedVariantPriceDetail?.source?.changeDir === "+" ? (
                    <span className="text-pwip-green-600 text-xs font-semibold mb-[3.5px]">
                      {selectedVariantPriceDetail?.source?.changeDir}₹
                      {selectedVariantPriceDetail?.source?.changeInPrice || 0}
                    </span>
                  ) : (
                    <span className="text-pwip-red-700 text-xs font-semibold mb-[3.5px]">
                      {selectedVariantPriceDetail?.source?.changeDir}₹
                      {`${selectedVariantPriceDetail?.source?.changeInPrice}`.split(
                        "-"
                      ).length === 2
                        ? `${selectedVariantPriceDetail?.source?.changeInPrice}`.split(
                            "-"
                          )[1]
                        : 0}
                    </span>
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
                {[1, 2, 3, 4].map((items, index) => {
                  return (
                    <div
                      key={items + index * 123}
                      className="grid grid-rows-4 w-full px-3"
                    >
                      {propertyData.map((property, propertyIndex) => (
                        <div
                          className={`py-5 ${
                            propertyIndex === propertyData.length - 1
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
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

// export default withAuth(RicePriceDetail);

export default withAuth(RicePriceDetail);

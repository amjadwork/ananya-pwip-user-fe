import React from "react";
import dynamic from "next/dynamic";

import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
const Chart = dynamic(() => import("react-charts").then((mod) => mod.Chart), {
  ssr: false,
});
import { Button } from "@/components/Button";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import {
  exportCostingIcon,
  ricePriceServiceIcon,
  exportOrdersServiceIcon,
  labsServiceIcon,
  networkServiceIcon,
  communityProductIcon,
  infoIcon,
  arrowLongRightIcon,
} from "../../theme/icon";

// Import Components
import { Header } from "@/components/Header";

// Import Containers

// Import Layouts

const data = [
  {
    label: "RNR Parboiled",
    color: "#165BAA",
    data: [
      {
        primary: "Jan",
        secondary: 98,
      },
      {
        primary: "Feb",
        secondary: 83,
      },
      {
        primary: "Mar",
        secondary: 98,
      },
      {
        primary: "Apr",
        secondary: 27,
      },
      {
        primary: "May",
        secondary: 14,
      },
      {
        primary: "Jun",
        secondary: 70,
      },
      // {
      //   primary: "Jul",
      //   secondary: 93,
      // },
      // {
      //   primary: "Aug",
      //   secondary: 78,
      // },
      // {
      //   primary: "Sep",
      //   secondary: 99,
      // },
      // {
      //   primary: "Oct",
      //   secondary: 14,
      // },

      // {
      //   primary: "Nov",
      //   secondary: 42,
      // },
      // {
      //   primary: "Dec",
      //   secondary: 31,
      // },
    ],
  },
  {
    label: "Basmati sella",
    color: "#3988FF",
    data: [
      {
        primary: "Jan",
        secondary: 37,
      },
      {
        primary: "Feb",
        secondary: 45,
      },
      {
        primary: "Mar",
        secondary: 70,
      },
      {
        primary: "Apr",
        secondary: 7,
      },
      {
        primary: "May",
        secondary: 87,
      },
      {
        primary: "Jun",
        secondary: 65,
      },
      // {
      //   primary: "Jul",
      //   secondary: 16,
      // },
      // {
      //   primary: "Aug",
      //   secondary: 8,
      // },
      // {
      //   primary: "Sep",
      //   secondary: 87,
      // },
      // {
      //   primary: "Oct",
      //   secondary: 4,
      // },

      // {
      //   primary: "Nov",
      //   secondary: 12,
      // },
      // {
      //   primary: "Dec",
      //   secondary: 1,
      // },
    ],
  },
  {
    label: "Basmati steam",
    color: "#6DC4FD",
    data: [
      {
        primary: "Jan",
        secondary: 6,
      },
      {
        primary: "Feb",
        secondary: 30,
      },
      {
        primary: "Mar",
        secondary: 77,
      },
      {
        primary: "Apr",
        secondary: 89,
      },
      {
        primary: "May",
        secondary: 36,
      },
      {
        primary: "Jun",
        secondary: 65,
      },
      // {
      //   primary: "Jul",
      //   secondary: 43,
      // },
      // {
      //   primary: "Aug",
      //   secondary: 75,
      // },
      // {
      //   primary: "Sep",
      //   secondary: 13,
      // },
      // {
      //   primary: "Oct",
      //   secondary: 45,
      // },

      // {
      //   primary: "Nov",
      //   secondary: 77,
      // },
      // {
      //   primary: "Dec",
      //   secondary: 96,
      // },
    ],
  },
];

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [searchStringValue, setSearchStringValue] = React.useState("");

  function handleSearch(searchString) {
    //
  }

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

  const primaryAxis = React.useMemo(
    () => ({
      position: "left",
      showGrid: true,
      invert: true,
      shouldNice: true,
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        position: "bottom",
        elementType: "bar",
        showGrid: true,
        shouldNice: true,
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

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
          className={`relative top-[56px] h-full w-full bg-pwip-white-100 z-0 pb-[72px]`}
        >
          <div
            className={`relative left-0 h-[auto] w-full bg-white z-0 py-6 px-5`}
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
                placeholder="Search for a rice variety"
                className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
                value={searchStringValue}
                onFocus={() => {
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
              {searchStringValue ? (
                <button
                  onClick={() => {
                    setSearchStringValue("");
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
          <div
            className={`inline-flex flex-col h-full w-full px-5 bg-white pb-6 overflow-auto hide-scroll-bar space-y-8`}
            // style={{
            //   paddingTop: mainContainerHeight + "px",
            //   paddingBottom: mainContainerHeight + 20 + "px",
            // }}
          >
            <div className="w-full grid grid-cols-3 gap-x-5 gap-y-8">
              {[
                {
                  name: "Export Costing",
                  icon: exportCostingIcon,
                  url: "/export-costing",
                },
                {
                  name: "Rice prices",
                  icon: ricePriceServiceIcon,
                  url: "/service/rice-price",
                },
                {
                  name: "Export orders",
                  icon: exportOrdersServiceIcon,
                  url: "/service/export-orders",
                },
                {
                  name: "Labs",
                  icon: labsServiceIcon,
                  url: "/service/labs",
                },
                {
                  name: "Network",
                  icon: networkServiceIcon,
                  url: "/service/network",
                },
                {
                  name: "Community",
                  icon: communityProductIcon,
                  url: "https://community.pwip.co/",
                },
              ].map((item, index) => {
                return (
                  <div
                    key={item?.name + "_" + index}
                    onClick={() => {
                      if (item.name.toLowerCase() === "community") {
                        window.open(item.url, "_blank");

                        return;
                      }

                      router.push(item?.url);
                    }}
                    className="inline-flex flex-col w-full items-center space-y-2 cursor-pointer"
                  >
                    <div className="w-full h-[78px] rounded-lg border-[1px] border-pwip-v2-primary-50 inline-flex items-center justify-center">
                      {item.icon}
                    </div>

                    <span className="text-pwip-black-600 font-medium text-xs text-center">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="inline-flex w-full h-auto py-4 px-5 bg-pwip-v2-green-200 rounded-lg relative">
              <div className="inline-flex flex-col space-y-6 h-full w-full max-w-[55%]">
                <div className="inline-flex flex-col space-y-1">
                  <span className="text-sm font-bold text-pwip-black-600 text-left">
                    Become an exporter
                  </span>
                  <span className="text-xs font-normal text-pwip-black-500 text-left">
                    Documentation, onboarding, and everything
                  </span>
                </div>

                <div className="relative w-full">
                  <Button
                    type="white"
                    label="Know more"
                    rounded="!rounded-md"
                    maxHeight="!max-h-[22px]"
                    minHeight="!min-h-[22px]"
                    fontSize="!text-xs"
                    maxWidth="max-w-[65%]"
                    onClick={async () => {
                      //
                    }}
                  />
                </div>
              </div>

              <div className="h-full">
                <img
                  src="/assets/images/home_main/container.svg"
                  alt="container"
                  className="absolute top-0 right-0 h-full"
                />
              </div>
            </div>
          </div>
          <div className="bg-pwip-v2-primary-100 w-full h-full px-5 py-6">
            <h3 className="text-sm font-bold text-pwip-black-600">
              Trends of last 6 months
            </h3>
            <span className="text-xs text-pwip-black-600 font-normal">
              Following information is based on EXIM Data
            </span>
            <div className="flex flex-col w-full mt-[20px]">
              <div className={`flex overflow-x-scroll hide-scroll-bar`}>
                <div className="flex flex-nowrap">
                  {[
                    {
                      label: "Popular rice",
                      description: "RNR PARBOILED RICE",
                      imageSrc: "/assets/images/home_main/rice_cat.png",
                    },
                    {
                      label: "Popular destination ports",
                      description: "SINGAPORE",
                      imageSrc: "/assets/images/home_main/port_cat.png",
                    },
                  ].map((item, index) => {
                    return (
                      <div
                        key={item.label + "_" + index}
                        className="inline-block relative h-[132px] w-[182px] border-[1px] border-pwip-v2-gray-200 bg-white rounded-lg mr-[12px]"
                      >
                        <div className="p-4 space-y-1">
                          <p className="text-xs text-pwip-black-600">
                            {item?.label}
                          </p>
                          <p className="text-xs uppercase font-semibold text-pwip-black-600">
                            {item?.description}
                          </p>
                        </div>

                        <img
                          className="absolute bottom-0 rounded-b-lg"
                          src={item?.imageSrc}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col w-full h-auto mt-[32px]">
              <div className="inline-flex w-full flex-col space-y-1 border-b-[1px] border-b-pwip-v2-gray-200 pb-6">
                <div className="inline-flex justify-between w-full items-center">
                  <span className="text-pwip-v2-gray-400 text-base font-semibold">
                    Top 3 exported rice in last 6 months
                  </span>

                  <div className="text-pwip-v2-gray-400 inline-flex items-center justify-center h-auto w-auto">
                    {infoIcon}
                  </div>
                </div>
                <span className="text-pwip-v2-primary text-2xl font-semibold">
                  991 tonn
                </span>
                <span className="text-pwip-v2-primary text-sm font-normal">
                  In volume
                </span>
              </div>
              <div className="w-full h-[180px] relative overflow-hidden mt-3">
                <Chart
                  options={{
                    data,
                    primaryAxis,
                    secondaryAxes,
                    // tooltip: {
                    //   show: true,
                    //   showDatumInTooltip: true,
                    //   align: "top",
                    //   alignPriority: "top",
                    // },
                    showDebugAxes: false,
                    showVoronoi: false,
                    memoizeSeries: true,
                    defaultColors: ["#165BAA", "#3988FF", "#6DC4FD"],
                    getSeriesStyle: () => {
                      return {
                        rectangle: {
                          height: "15px",
                        },
                      };
                    },
                  }}
                />
              </div>
              <div className="inline-flex flex-col w-full space-y-1 mt-5">
                {data?.map((item, index) => {
                  return (
                    <div
                      key={item?.label + "_" + index}
                      className="inline-flex items-center space-x-2"
                    >
                      <div
                        className="h-2 w-4"
                        style={{
                          backgroundColor: item?.color,
                        }}
                      />
                      <span className="text-xs text-pwip-v2-gray-800">
                        {item?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="bg-pwip-v2-primary-100 inline-flex w-full h-auto items-center justify-center text-pwip-v2-primary-600 font-semibold space-x-2 py-5 border-t-[1px] border-t-pwip-v2-gray-200 cursor-pointer">
            <span className="text-xs">See detailed EXIM analysis</span>
            {arrowLongRightIcon}
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

// export default withAuth(Home);

export default Home;

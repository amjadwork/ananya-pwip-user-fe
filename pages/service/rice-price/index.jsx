import React, { useEffect, useLayoutEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import { searchIcon, bookmarkOutlineIcon } from "../../../theme/icon";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import {
  getStateAbbreviation,
  checkSubscription,
  ricePriceServiceId,
} from "@/utils/helper";

import { fetchVariantPriceRequest } from "@/redux/actions/variant-prices.actions";

// Import Containers

// Import Layouts
const SERVICE_ID = ricePriceServiceId;

const productStateList = [
  [
    {
      name: "Haryana",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/haryana.png?updatedAt=1711323994568",
    },
    {
      name: "Odisha",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/odisha.png?updatedAt=1711323994651",
    },
  ],
  [
    {
      name: "Punjab",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/punjab.png?updatedAt=1711323998032",
    },
    {
      name: "Uttar Pradesh",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/uttar-pradesh.png?updatedAt=1711323997805",
    },
  ],
  [
    {
      name: "Bihar",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/bihar.png?updatedAt=1711323994658",
    },
    {
      name: "Gujrat",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/gujrat.png?updatedAt=1711323994488",
    },
  ],
  [
    {
      name: "Madhya Pradesh",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/madhya-pradesh.png?updatedAt=1711323994654",
    },
    {
      name: "West Bengal",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/west-bengal.png?updatedAt=1711323994646",
    },
  ],
  [
    {
      name: "Chattisgarh",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/chattisgarh.png?updatedAt=1711323994048",
    },
    {
      name: "Maharashtra",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/maharastra.png?updatedAt=1711323994208",
    },
  ],
  [
    {
      name: "Telangana",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/telengana.png?updatedAt=1711323998233",
    },

    {
      name: "Andhra Pradesh",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/andhra-pradesh.png?updatedAt=1711323998318",
    },
  ],
  [
    {
      name: "Karnataka",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/karnataka.png?updatedAt=1711323997816",
    },
    {
      name: "Kerala",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/kerala.png?updatedAt=1711323994348",
    },
  ],
  [
    {
      name: "Tamil Nadu",
      imageUrl:
        "https://ik.imagekit.io/qeoc0zl3c/states/tamil-nadu.png?updatedAt=1711323994643",
    },
  ],
];

const FilterSection = ({ allTagsData, handleFilterSelect, selectedFilter }) => {
  return (
    <div className={`flex w-full flex-col px-5 mb-[24px] pb-4`}>
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
              className="overflow-hidden w-auto h-auto inline-flex items-center"
            >
              <span className="text-sm text-pwip-v2-gray-800 font-[400] whitespace-nowrap">
                All
              </span>
            </div>
          </div>
          {[...allTagsData].map((items, index) => {
            const isSelected = selectedFilter?._id === items?._id || false;

            return (
              <div
                key={items?.tagName + (index + 1 * 2)}
                onClick={() => {
                  handleFilterSelect(items);
                }}
                // className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
                className={`inline-block whitespace-nowrap px-[16px] py-[4px] border-[1px] ${
                  !isSelected
                    ? "border-pwip-v2-primary-700 bg-pwip-v2-primary-200"
                    : "border-pwip-v2-gray-200 bg-pwip-v2-gray-100"
                } rounded-full mr-[12px] transition-all`}
              >
                <div className="overflow-hidden text-pwip-v2-gray-800 w-auto h-auto inline-flex items-center space-x-2">
                  <span className="text-sm font-[400] whitespace-nowrap">
                    {items?.tagName}
                  </span>

                  {!isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-[18px] h-[18px]"
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

function RicePrice() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth?.token);
  const variantPriceList =
    useSelector((state) => state.variantPriceList.variantWithPriceList) || [];

  useEffect(() => {
    console.log("variantPriceList", variantPriceList);
  }, [variantPriceList.length]);
  //   const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  async function initPage() {
    const details = await checkSubscription(SERVICE_ID, authToken);

    if (!details?.activeSubscription) {
      router.replace("/service/rice-price/lp");

      return;
    }

    await dispatch(fetchVariantPriceRequest());

    return;
  }

  useLayoutEffect(() => {
    initPage();
  }, []);

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
          <div className="inline-flex w-full items-center justify-between px-5 py-3">
            <span className="text-pwip-v2-primary text-xs font-semibold">
              Watchlist
            </span>
            <span className="text-pwip-v2-gray-500 text-xs">Manage</span>
          </div>

          <div
            className={`flex overflow-x-scroll hide-scroll-bar px-5 space-x-3`}
          >
            {[
              {
                name: "Basmati steam rice",
                region: "Raichur",
                currency: "₹",
                price: 32,
                unit: "kg",
                changeInPrice: 0.5,
                changeDir: "+",
              },
              {
                name: "Basmati steam rice",
                region: "Raichur",
                currency: "₹",
                price: 32,
                unit: "kg",
                changeInPrice: 0.5,
                changeDir: "-",
              },
              {
                name: "Basmati steam rice",
                region: "Raichur",
                currency: "₹",
                price: 32,
                unit: "kg",
                changeInPrice: 0.5,
                changeDir: "+",
              },
            ].map((item, index) => {
              return (
                <div
                  key={item?.name + "_" + index}
                  className="flex flex-nowrap"
                >
                  <div className="inline-flex flex-col px-3 py-4 bg-pwip-v2-gray-100 space-y-3 w-[242px] rounded-lg">
                    <div className="inline-flex justify-between w-full">
                      <span className="text-sm font-semibold text-pwip-black-600">
                        {item?.name}
                      </span>

                      <span className="text-sm font-bold text-pwip-v2-primary">
                        {item?.currency}
                        {item?.price} / {item?.unit}
                      </span>
                    </div>
                    <div className="inline-flex justify-between w-full">
                      <span className="text-xs font-normal text-pwip-gray-400">
                        {item?.region}
                      </span>

                      {item?.changeDir === "+" ? (
                        <span className="text-xs font-normal text-pwip-green-800">
                          {item?.changeDir}
                          {item?.currency}
                          {item?.changeInPrice}
                        </span>
                      ) : (
                        <span className="text-xs font-normal text-pwip-red-700">
                          {item?.changeDir}
                          {item?.currency}
                          {item?.changeInPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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

          <div className="inline-flex flex-col w-full mt-8 bg-pwip-v2-gray-50">
            <div className="inline-flex w-full items-center justify-between px-5 py-6">
              <span className="text-pwip-v2-primary text-base font-bold">
                120 varieties to explore
              </span>
              <span className="text-pwip-v2-gray-500 text-xs">
                {searchIcon}
              </span>
            </div>

            <div
              div
              className="w-full h-auto inline-flex flex-col hide-scroll-bar"
            >
              <FilterSection
                allTagsData={[
                  {
                    tagName: "Basmati",
                  },
                  {
                    tagName: "Non Basmati",
                  },
                  {
                    tagName: "Parboiled",
                  },
                  {
                    tagName: "Raw",
                  },
                  {
                    tagName: "Steam",
                  },
                ]}
                selectedFilter="All"
                handleFilterSelect={(item, isAll) => {
                  //
                }}
              />

              <div
                className={`w-full h-full space-y-4 px-5 pb-[72px] overflow-y-auto hide-scroll-bar transition-all`}
              >
                {variantPriceList.map((item, index) => {
                  return (
                    <div
                      key={item.source._id + index}
                      onClick={() => {
                        // router.push("/service/rice-price/details");
                      }}
                      className="inline-flex flex-col w-full space-y-5 bg-white rounded-lg px-3 py-4"
                    >
                      <div className="inline-flex w-full justify-between">
                        <div
                          onClick={() => {
                            router.push("/service/rice-price/detail");
                          }}
                          className="relative inline-flex space-x-3 w-full"
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

                        <div className="w-auto h-auto relative text-pwip-v2-primary-800">
                          {bookmarkOutlineIcon}
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
                              ₹{item?.source?.changeInPrice || 0}
                            </span>
                          ) : (
                            <span className="text-pwip-v2-green-800 text-xs mb-[1px] font-medium">
                              ₹{item?.source?.changeInPrice || 0}
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

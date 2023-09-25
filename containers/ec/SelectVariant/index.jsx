import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

import { fetchMyCostingSuccess } from "@/redux/actions/myCosting.actions.js";

const SelectVariantContainer = (props) => {
  const isFromEdit = props.isFromEdit || false;
  const setFieldValue = props.setFieldValue;

  const { closeBottomSheet } = useOverlayContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products); // Use api reducer slice
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const selectedMyCostingFromHistory = useSelector((state) => {
    if (
      state.myCosting &&
      state.myCosting.currentCostingFromHistory &&
      state.myCosting.currentCostingFromHistory.length
    ) {
      return state.myCosting.currentCostingFromHistory[0];
    }
    return null;
  });

  const { roundedTop = false, noTop = false, noPaddingBottom = false } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [productsData, setProductsData] = React.useState([]);
  const [popularProductsData, setPopularProductsData] = React.useState([]);
  const [listProductsData, setListProductsData] = React.useState([]);
  const [searchStringValue, setSearchStringValue] = React.useState("");

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  React.useEffect(() => {
    if (!products.error) {
      setProductsData(products.products);

      if ([...products.products].slice(0, 4)) {
        setPopularProductsData([...products.products].slice(0, 4));
      }

      if (products.products) {
        setPopularProductsData([...products.products].slice(0, 4));
        setListProductsData(
          [...products.products].slice(5, products.products.length - 1)
        );
      }
    }
  }, [products]);

  function handleSearch(searchString) {
    const dataToFilter = [...productsData];

    // Create an empty array to store the matching variants
    const matchingVariants = [];

    // Convert the search string to lowercase for a case-insensitive search
    const searchLower = searchString.toLowerCase();

    // Iterate through the array of variants
    for (const variant of dataToFilter) {
      // Convert the variant name to lowercase for comparison
      const variantNameLower = variant.variantName.toLowerCase();

      // Check if the variant name contains the search string
      if (variantNameLower.includes(searchLower)) {
        // If it does, add the variant to the matchingVariants array
        matchingVariants.push(variant);
      }
    }

    if (searchString) {
      setPopularProductsData([]);
      setListProductsData(matchingVariants);
    }

    if (!searchString) {
      setPopularProductsData([...products.products].slice(0, 4));
      setListProductsData(
        [...products.products].slice(5, products.products.length - 1)
      );
    }
  }

  return (
    <React.Fragment>
      <div
        id="fixedMenuSection"
        className={`${roundedTop ? "rounded-t-3xl" : ""} fixed ${
          !noTop ? "top-[72px]" : "top-[18px]"
        }  h-[auto] w-full bg-white z-10 py-6 px-5`}
      >
        <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
          Select Your Choice of Rice
        </h2>
        <div className="h-[48px] mt-[10px] w-full rounded-md bg-pwip-primary-100 text-base font-sans inline-flex items-center px-[18px]">
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
                stroke="#686E6D"
                strokeWidth="1.52292"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            placeholder="Ex: Sona Masuri"
            className="h-full w-full bg-pwip-primary-100 pl-[18px] text-base font-sans outline-none border-none"
            value={searchStringValue}
            onChange={(event) => {
              setSearchStringValue(event.target.value);
              handleSearch(event.target.value);
            }}
          />
          {!popularProductsData.length && (
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
          )}
        </div>
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[98px]" : "pb-0"
        } overflow-auto px-5 hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 42 + "px",
        }}
      >
        {popularProductsData.length && (
          <h2
            className={`${
              noTop ? "mt-0" : "mt-8"
            } mb-5 text-pwip-gray-800 font-sans text-sm font-bold`}
          >
            Popular choices
          </h2>
        )}

        <div className="grid grid-cols-2 gap-6">
          {popularProductsData.map((items, index) => {
            return (
              <div
                key={items._id + index}
                onClick={() => {
                  if (isFromEdit) {
                    if (setFieldValue) {
                      setFieldValue("_originId", {});
                      setFieldValue("_destinationId", {});

                      let object = {
                        ...selectedMyCostingFromHistory,
                        details: {
                          ...selectedMyCostingFromHistory?.details,
                          originPortObject: {},
                          destinationObject: {},
                        },
                      };

                      dispatch(fetchMyCostingSuccess([{ ...object }]));

                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfOrigin: null,
                            portOfDestination: null,
                            product: items,
                          },
                        })
                      );
                    } else {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            product: items,
                          },
                        })
                      );
                    }
                    dispatch(fetchDestinationRequest());
                    dispatch(fetchOriginRequest());

                    closeBottomSheet();
                  } else {
                    dispatch(
                      setCostingSelection({
                        ...selectedCosting,
                        product: items,
                      })
                    );
                    router.push("/export-costing/select-pod");
                  }
                }}
                className="h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <img
                  src={
                    items.images[0] ||
                    "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                  }
                  className="bg-cover h-[80px] w-full rounded-md"
                />
                <div className="p-3 flex w-fill flex-col space-y-[4px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                    ₹{items.sourceRates.price}/{items.sourceRates.unit}
                  </span>
                  <span className="text-pwip-gray-600 text-xs font-bold font-sans line-clamp-1">
                    {items.variantName}
                  </span>

                  <div className="inline-flex items-center justify-between">
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      {items.brokenPercentage || 0}% Broken
                    </span>
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      {items.sourceRates.sourceName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-auto inline-flex flex-col mt-5 space-y-[10px]">
          {listProductsData.map((items, index) => {
            return (
              <div
                key={items._id + index}
                onClick={() => {
                  if (isFromEdit) {
                    if (setFieldValue) {
                      setFieldValue("_originId", {});
                      setFieldValue("_destinationId", {});

                      let object = {
                        ...selectedMyCostingFromHistory,
                        details: {
                          ...selectedMyCostingFromHistory?.details,
                          originPortObject: {},
                          destinationObject: {},
                        },
                      };

                      dispatch(fetchMyCostingSuccess([{ ...object }]));

                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfOrigin: null,
                            portOfDestination: null,
                            product: items,
                          },
                        })
                      );
                    } else {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            product: items,
                          },
                        })
                      );
                    }
                    dispatch(fetchDestinationRequest());
                    dispatch(fetchOriginRequest());
                    closeBottomSheet();
                  } else {
                    dispatch(
                      setCostingSelection({
                        ...selectedCosting,
                        product: items,
                      })
                    );
                    router.push("/export-costing/select-pod");
                  }
                }}
                className="inline-flex items-center w-full p-[5px] space-x-[10px] bg-white rounded-sm border-b-[1px] border-b-pwip-gray-50"
              >
                <img
                  src={
                    items.images[0] ||
                    "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                  }
                  className="bg-cover h-[46px] w-[46px] rounded-sm"
                />
                <div className="w-full inline-flex flex-col space-y-2">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                      {items.variantName}
                    </span>
                    <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                      ₹{items.sourceRates.price}/{items.sourceRates.unit}
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      {items.sourceRates.sourceName}
                    </span>
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      {items.brokenPercentage || 0}% Broken
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SelectVariantContainer;

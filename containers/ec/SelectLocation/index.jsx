import React from "react";
import { useRouter } from "next/router";
import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

const SelectLocationContainer = (props) => {
  const isFromEdit = props.isFromEdit || false;
  const locationType = props.locationType || "destination";

  const { closeBottomSheet } = useOverlayContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const locationsData = useSelector((state) => state.locations);

  const {
    roundedTop = false,
    noTop = false,
    noPaddingBottom = false,
    title = "",
    showSelectedVariant = false,
  } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [selectedCostingProduct, setSelectedCostingProduct] =
    React.useState(null);
  const [destinationList, setDestinationList] = React.useState([]);

  const [popularDestinationData, setPopularDestinationData] = React.useState(
    []
  );
  const [listDestinationData, setListDestinationData] = React.useState([]);
  const [searchStringValue, setSearchStringValue] = React.useState("");

  React.useEffect(() => {
    if (
      locationsData?.locations?.destinations?.length &&
      locationType === "destination"
    ) {
      setDestinationList(locationsData.locations.destinations);

      if ([...locationsData.locations.destinations].slice(0, 4)) {
        setPopularDestinationData(
          [...locationsData.locations.destinations].slice(0, 4)
        );
      }

      if (locationsData.locations.destinations) {
        setPopularDestinationData(
          [...locationsData.locations.destinations].slice(0, 4)
        );
        setListDestinationData(
          [...locationsData.locations.destinations].slice(
            5,
            locationsData.locations.destinations.length - 1
          )
        );
      }
    }
    if (locationsData?.locations?.origin?.length && locationType === "origin") {
      setDestinationList(locationsData.locations.origin);

      if ([...locationsData.locations.origin].slice(0, 4)) {
        setPopularDestinationData(
          [...locationsData.locations.origin].slice(0, 4)
        );
      }

      if (locationsData.locations.origin) {
        setPopularDestinationData(
          [...locationsData.locations.origin].slice(0, 4)
        );
        setListDestinationData(
          [...locationsData.locations.origin].slice(
            5,
            locationsData.locations.origin.length - 1
          )
        );
      }
    }
  }, [locationsData, locationType]);

  React.useEffect(() => {
    if (selectedCosting && selectedCosting.product) {
      setSelectedCostingProduct(selectedCosting.product);
    }
  }, [selectedCosting]);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, [selectedCostingProduct]);

  function handleSearch(searchString) {
    const dataToFilter = [...destinationList];

    // Create an empty array to store the matching variants
    const matchingVariants = [];

    // Convert the search string to lowercase for a case-insensitive search
    const searchLower = searchString.toLowerCase();

    // Iterate through the array of variants
    for (const variant of dataToFilter) {
      // Convert the variant name to lowercase for comparison
      const variantNameLower = variant.portName.toLowerCase();

      // Check if the variant name contains the search string
      if (variantNameLower.includes(searchLower)) {
        // If it does, add the variant to the matchingVariants array
        matchingVariants.push(variant);
      }
    }

    if (searchString) {
      setPopularDestinationData([]);
      setListDestinationData(matchingVariants);
    }

    if (!searchString && locationType === "destination") {
      setPopularDestinationData(
        [...locationsData.locations.destinations].slice(0, 4)
      );
      setListDestinationData(
        [...locationsData.locations.destinations].slice(
          5,
          locationsData.locations.destinations.length - 1
        )
      );
    }

    if (!searchString && locationType === "origin") {
      setPopularDestinationData(
        [...locationsData.locations.origin].slice(0, 4)
      );
      setListDestinationData(
        [...locationsData.locations.origin].slice(
          5,
          locationsData.locations.origin.length - 1
        )
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
        {showSelectedVariant && selectedCostingProduct ? (
          <div
            onClick={async () => {
              // await dispatch(resetCostingSelection());
              router.back();
            }}
            className="inline-flex items-center w-full p-[8px] space-x-[10px] bg-pwip-primary-40 rounded-[5px] border-[1px] border-pwip-primary-400 mb-[28px]"
          >
            <img
              src={
                selectedCostingProduct.images[0] ||
                "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
              }
              className="bg-cover h-[62px] w-[62px] rounded-md"
            />
            <div className="w-full inline-flex flex-col space-y-1">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                  {selectedCostingProduct.variantName}
                </span>
                <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                  ₹{selectedCostingProduct.sourceRates.price}/
                  {selectedCostingProduct.sourceRates.unit}
                </span>
              </div>

              <span className="text-pwip-gray-700 font-sans text-xs font-bold">
                {selectedCostingProduct.brokenPercentage || 0}% Broken
              </span>

              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                  {selectedCostingProduct.sourceRates.sourceName}
                </span>

                <div className="inline-flex items-center justify-end text-pwip-primary-400 space-x-1">
                  <span className="text-xs font-medium font-sans line-clamp-1">
                    Edit
                  </span>
                  {pencilIcon}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
          {title}
        </h2>
        {/* <input
          placeholder="Ex: Ho chi min city port"
          className="h-[48px] mt-[10px] w-full rounded-md bg-pwip-primary-100 px-[18px] text-base font-sans"
        /> */}
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
                stroke-width="1.52292"
                stroke-linecap="round"
                stroke-linejoin="round"
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
          {!popularDestinationData.length && (
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
        {popularDestinationData.length && (
          <h2
            className={`${
              noTop ? "mt-0" : "mt-8"
            } mb-5 text-pwip-gray-800 font-sans text-sm font-bold`}
          >
            Popular choices
          </h2>
        )}

        <div className="grid grid-cols-2 gap-6">
          {popularDestinationData.map((items, index) => {
            return (
              <div
                key={items._id + index}
                onClick={() => {
                  if (isFromEdit) {
                    if (locationType === "destination") {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfDestination: items,
                          },
                        })
                      );
                    }

                    if (locationType === "origin") {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfOrigin: items,
                          },
                        })
                      );
                    }

                    closeBottomSheet();
                  } else {
                    dispatch(
                      setCostingSelection({
                        ...selectedCosting,
                        portOfDestination: items,
                      })
                    );
                    router.push("/export-costing/overview");
                  }
                }}
                className="h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="w-full pt-3 inline-flex items-center justify-center">
                  {dummyRemoveMeCityIcon}
                </div>
                <div className="p-3 flex w-fill flex-col space-y-[4px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                    {items.portName}
                  </span>

                  <div className="inline-flex items-center justify-between">
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      {items.portCode}
                    </span>
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      {items.country}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-auto inline-flex flex-col mt-5 space-y-[10px]">
          {listDestinationData.map((items, index) => {
            return (
              <div
                key={items._id + index}
                className="inline-flex items-center w-full p-[5px] space-x-[10px] bg-white rounded-sm border-b-[1px] border-b-pwip-gray-50"
                onClick={() => {
                  if (isFromEdit) {
                    if (locationType === "destination") {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfDestination: items,
                          },
                        })
                      );
                    }

                    if (locationType === "origin") {
                      dispatch(
                        setCustomCostingSelection({
                          ...selectedCosting,
                          customCostingSelection: {
                            ...selectedCosting.customCostingSelection,
                            portOfOrigin: items,
                          },
                        })
                      );
                    }
                    closeBottomSheet();
                  } else {
                    dispatch(
                      setCostingSelection({
                        ...selectedCosting,
                        portOfDestination: items,
                      })
                    );
                    router.push("/export-costing/overview");
                  }
                }}
              >
                <div className="h-[46px] w-[46px] rounded-sm bg-pwip-primary-50">
                  {/*  */}
                </div>
                <div className="w-full inline-flex flex-col space-y-2">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                      {items.portName}
                    </span>
                    <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                      {items.portCode}
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      {items.country}
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

export default SelectLocationContainer;

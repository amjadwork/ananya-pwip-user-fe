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

  React.useEffect(() => {
    if (
      locationsData?.locations?.destinations?.length &&
      locationType === "destination"
    ) {
      setDestinationList(locationsData.locations.destinations);
    }
    if (locationsData?.locations?.origin?.length && locationType === "origin") {
      setDestinationList(locationsData.locations.origin);
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
        <input
          placeholder="Ex: Ho chi min city port"
          className="h-[48px] mt-[10px] w-full rounded-md bg-pwip-primary-100 px-[18px] text-base font-sans"
        />
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[98px]" : "pb-0"
        } overflow-auto px-5 hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 42 + "px",
        }}
      >
        <h2
          className={`${
            noTop ? "mt-0" : "mt-8"
          } mb-5 text-pwip-gray-800 font-sans text-sm font-bold`}
        >
          Popular ports
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {[...destinationList].slice(0, 4).map((items, index) => {
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
          {[...destinationList]
            .slice(5, destinationList.length - 1)
            .map((items, index) => {
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

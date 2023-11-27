import React from "react";
import { call, select, put } from "redux-saga/effects";
import { useRouter } from "next/router";
import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import { api } from "@/utils/helper";

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

const popularFilters = [
  {
    name: "Basmati",
    icon: "one.png",
  },
  {
    name: "Paraboiled",
    icon: "two.png",
  },
  {
    name: "Raw",
    icon: "three.png",
  },
  {
    name: "Steam",
    icon: "four.png",
  },
  {
    name: "Steam",
    icon: "five.png",
  },
];

const SelectLocationContainer = (props) => {
  const isFromEdit = props.isFromEdit || false;
  const locationType = props.locationType || "destination";
  const setFieldValue = props.setFieldValue;
  const containerWeight = props.containerWeight || 26;

  const { closeBottomSheet } = useOverlayContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const locationsData = useSelector((state) => state.locations);
  const authToken = useSelector((state) => state.auth.token);

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

  async function fetchTransportationCost(originId, sourceId) {
    try {
      const response = await api.get(
        `/transportation?origin=${originId}&sourcePort=${sourceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response;
    } catch (error) {
      // Dispatch a failure action in case of an error
      return error;
    }
  }

  async function fetchCHAandSHLandOFCCost(originId, destinationId) {
    try {
      const responseCHA = await api.get(
        `/cha?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const responseSHL = await api.get(
        `/shl?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const responseOFC = await api.get(
        `/ofc?origin=${originId}&destination=${destinationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = {
        shl: responseSHL?.data || [],
        ofc: responseOFC?.data || [],
        cha: responseCHA?.data || [],
      };

      return response;
    } catch (error) {
      // Dispatch a failure action in case of an error
      return error;
    }
  }

  React.useEffect(() => {
    if (
      locationsData?.locations?.destinations?.length &&
      locationType === "destination"
    ) {
      setDestinationList(locationsData.locations.destinations);

      if ([...locationsData.locations.destinations].slice(0, 5)) {
        setPopularDestinationData(
          [...locationsData.locations.destinations].slice(0, 5)
        );
      }

      if (locationsData.locations.destinations) {
        setPopularDestinationData(
          [...locationsData.locations.destinations].slice(0, 5)
        );

        if (isFromEdit) {
          setListDestinationData([...locationsData.locations.destinations]);
        } else {
          setListDestinationData(
            [...locationsData.locations.destinations].slice(
              5,
              locationsData.locations.destinations.length - 1
            )
          );
        }
      }
    }
    if (locationsData?.locations?.origin?.length && locationType === "origin") {
      setDestinationList(locationsData.locations.origin);

      if ([...locationsData.locations.origin].slice(0, 5)) {
        setPopularDestinationData(
          [...locationsData.locations.origin].slice(0, 5)
        );
      }

      if (locationsData.locations.origin) {
        setPopularDestinationData(
          [...locationsData.locations.origin].slice(0, 5)
        );
        if (isFromEdit) {
          setListDestinationData([...locationsData.locations.origin]);
        } else {
          setListDestinationData(
            [...locationsData.locations.origin].slice(
              5,
              locationsData.locations.origin.length - 1
            )
          );
        }
      }
    }
  }, [locationsData, locationType, isFromEdit]);

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
        [...locationsData.locations.destinations].slice(0, 5)
      );
      // setListDestinationData(
      //   [...locationsData.locations.destinations].slice(
      //     4,
      //     locationsData.locations.destinations.length - 1
      //   )
      // );
      if (isFromEdit) {
        setListDestinationData([...locationsData.locations.destinations]);
      } else {
        setListDestinationData(
          [...locationsData.locations.destinations].slice(
            5,
            locationsData.locations.destinations.length - 1
          )
        );
      }
    }

    if (!searchString && locationType === "origin") {
      setPopularDestinationData(
        [...locationsData.locations.origin].slice(0, 5)
      );
      // setListDestinationData(
      //   [...locationsData.locations.origin].slice(
      //     4,
      //     locationsData.locations.origin.length - 1
      //   )
      // );
      if (isFromEdit) {
        setListDestinationData([...locationsData.locations.origin]);
      } else {
        setListDestinationData(
          [...locationsData.locations.origin].slice(
            5,
            locationsData.locations.origin.length - 1
          )
        );
      }
    }
  }

  return (
    <React.Fragment>
      <div
        id="fixedMenuSection"
        className={`fixed ${
          !noTop ? "top-[56px]" : "top-[18px]"
        }  h-[auto] w-full z-10 py-3 pb-[30px] px-5`}
        style={{
          background:
            "linear-gradient(180deg, #FFF 84.97%, rgba(255, 255, 255, 0.00) 100%)",
        }}
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
            placeholder={`Search for ${locationType} port`}
            className="h-full w-full bg-white pl-[18px] text-sm font-sans outline-none border-none placeholder:text-pwip-v2-gray-500"
            value={searchStringValue}
            onChange={(event) => {
              setSearchStringValue(event.target.value);
              handleSearch(event.target.value);
            }}
          />
          {!popularDestinationData.length ? (
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
        className={`min-h-screen h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[172px]" : "pb-0"
        } overflow-auto px-5 hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 32 + "px",
        }}
      >
        {!isFromEdit ? (
          <React.Fragment>
            <h2
              className={`mt-4 mb-5 text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Popular destination ports
            </h2>

            <div className="flex overflow-x-scroll hide-scroll-bar py-2 px-[1px]">
              <div className="flex flex-nowrap">
                {[...popularDestinationData].map((items, index) => {
                  const imageURI =
                    "/assets/images/" +
                    `${
                      index === 0
                        ? "one.png"
                        : index === 1
                        ? "two.png"
                        : index === 2
                        ? "three.png"
                        : index === 3
                        ? "four.png"
                        : index === 4
                        ? "five.png"
                        : ""
                    }`;
                  return (
                    <div
                      key={`${index}_` + (index + 1 * 2)}
                      className="inline-block px-[15px] py-[18px] bg-pwip-v2-primary-100 rounded-xl mr-4"
                      style={{
                        boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                      onClick={async () => {
                        if (isFromEdit) {
                          if (locationType === "destination") {
                            const sourceId =
                              selectedCosting.customCostingSelection
                                .portOfOrigin._id;

                            const response = await fetchCHAandSHLandOFCCost(
                              sourceId,
                              items?._id
                            );

                            if (response.cha.length) {
                              setFieldValue(
                                "cfsHandling",
                                Math.floor(
                                  response?.cha[0]?.destinations[0]?.chaCharge /
                                    containerWeight
                                )
                              );
                            }

                            if (response.ofc.length) {
                              setFieldValue(
                                "ofc",
                                Math.floor(
                                  response?.ofc[0]?.destinations[0]?.ofcCharge /
                                    containerWeight
                                )
                              );
                            }

                            if (response.shl.length) {
                              setFieldValue(
                                "shl",
                                Math.floor(
                                  response?.shl[0]?.destinations[0]?.shlCharge /
                                    containerWeight
                                )
                              );
                            }

                            dispatch(
                              setCustomCostingSelection({
                                ...selectedCosting,
                                customCostingSelection: {
                                  ...selectedCosting.customCostingSelection,
                                  portOfDestination: items,
                                  shl: Math.floor(
                                    response?.shl[0]?.destinations[0]
                                      ?.shlCharge / containerWeight
                                  ),
                                  ofc: Math.floor(
                                    response?.ofc[0]?.destinations[0]
                                      ?.ofcCharge / containerWeight
                                  ),
                                  cha: Math.floor(
                                    response?.cha[0]?.destinations[0]
                                      ?.chaCharge / containerWeight
                                  ),

                                  shlData: response?.shl[0]?.destinations[0],
                                  ofcData: response?.ofc[0]?.destinations[0],
                                  chaData: response?.cha[0]?.destinations[0],
                                },
                              })
                            );
                          }

                          if (locationType === "origin") {
                            if (
                              selectedCosting?.customCostingSelection?.product
                            ) {
                              const sourceId =
                                selectedCosting?.customCostingSelection?.product
                                  ?.sourceRates?._sourceId ||
                                selectedCosting?.customCostingSelection?.product
                                  ?.sourceObject?._id;

                              const response = await fetchTransportationCost(
                                items?._id,
                                sourceId
                              );

                              if (
                                response?.data &&
                                response?.data?.length &&
                                response?.data[0]?.sourceLocations?.length
                              ) {
                                setFieldValue(
                                  "transportation",
                                  response?.data[0]?.sourceLocations[0]
                                    ?.transportationCharge
                                );

                                dispatch(
                                  setCustomCostingSelection({
                                    ...selectedCosting,
                                    customCostingSelection: {
                                      ...selectedCosting.customCostingSelection,
                                      portOfOrigin: items,
                                      transportation:
                                        response?.data[0]?.sourceLocations[0]
                                          ?.transportationCharge,
                                    },
                                  })
                                );
                              }
                            }
                          }

                          closeBottomSheet();
                        } else {
                          dispatch(
                            setCostingSelection({
                              ...selectedCosting,
                              portOfDestination: items,
                            })
                          );
                          // router.push("/export-costing/overview");
                        }
                      }}
                    >
                      <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                        <img src={imageURI} className="w-[24px] h-[24px]" />
                        <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]">
                          <span className="line-clamp-1">{items.country}</span>
                          <span className="text-sm">🇮🇳</span>
                        </div>
                        <span className="mt-[4px] text-base text-pwip-v2-gray-800 font-[800] line-clamp-1">
                          {items.portName}
                        </span>
                        <span className="mt-[6px] text-xs text-pwip-v2-gray-500 font-[400] line-clamp-1 uppercase">
                          {items.portCode}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ) : null}

        <React.Fragment>
          <div
            className={`w-full h-auto inline-flex flex-col ${
              !isFromEdit ? "mt-[32px]" : ""
            }`}
          >
            <h2
              className={`mb-[24px] text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Choose your {locationType} port
            </h2>

            <div className="flex overflow-x-scroll hide-scroll-bar mb-[32px]">
              <div className="flex flex-nowrap">
                <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
                  <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
                    <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                      Filter
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="11"
                      viewBox="0 0 19 11"
                      fill="none"
                    >
                      <path
                        d="M7.75 2.5H17.5M7.75 2.5C7.75 2.89782 7.59196 3.27936 7.31066 3.56066C7.02936 3.84196 6.64782 4 6.25 4C5.85218 4 5.47064 3.84196 5.18934 3.56066C4.90804 3.27936 4.75 2.89782 4.75 2.5M7.75 2.5C7.75 2.10218 7.59196 1.72064 7.31066 1.43934C7.02936 1.15804 6.64782 1 6.25 1C5.85218 1 5.47064 1.15804 5.18934 1.43934C4.90804 1.72064 4.75 2.10218 4.75 2.5M4.75 2.5H1M13.75 8.5H17.5M13.75 8.5C13.75 8.89782 13.592 9.27936 13.3107 9.56066C13.0294 9.84196 12.6478 10 12.25 10C11.8522 10 11.4706 9.84196 11.1893 9.56066C10.908 9.27936 10.75 8.89782 10.75 8.5M13.75 8.5C13.75 8.10218 13.592 7.72064 13.3107 7.43934C13.0294 7.15804 12.6478 7 12.25 7C11.8522 7 11.4706 7.15804 11.1893 7.43934C10.908 7.72064 10.75 8.10218 10.75 8.5M10.75 8.5H1"
                        stroke="#434B53"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
                  <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
                    <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                      Sort
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="8"
                      viewBox="0 0 13 8"
                      fill="none"
                    >
                      <path
                        d="M12 1L6.5 6.5L1 1"
                        stroke="#434B53"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {[...popularFilters].map((items, index) => {
                  return (
                    <div
                      key={items?.name + (index + 1 * 2)}
                      className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
                    >
                      <div className="overflow-hidden w-auto h-auto inline-flex items-center">
                        <span className="text-sm text-pwip-v2-gray-800 font-[400] line-clamp-1">
                          {items?.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-full space-y-[24px]">
              {[...listDestinationData].map((items, index) => {
                return (
                  <div
                    key={items._id + index}
                    className="inline-flex items-center w-full p-[5px] space-x-[15px] bg-white"
                    onClick={async () => {
                      if (isFromEdit) {
                        if (locationType === "destination") {
                          const response = await fetchCHAandSHLandOFCCost(
                            selectedCosting.customCostingSelection.portOfOrigin
                              ._id,
                            items?._id
                          );

                          if (response.cha.length) {
                            setFieldValue(
                              "cfsHandling",
                              Math.floor(
                                response?.cha[0]?.destinations[0]?.chaCharge /
                                  containerWeight
                              )
                            );
                          }

                          if (response.ofc.length) {
                            setFieldValue(
                              "ofc",
                              Math.floor(
                                response?.ofc[0]?.destinations[0]?.ofcCharge /
                                  containerWeight
                              )
                            );
                          }

                          if (response.shl.length) {
                            setFieldValue(
                              "shl",
                              Math.floor(
                                response?.shl[0]?.destinations[0]?.shlCharge /
                                  containerWeight
                              )
                            );
                          }

                          dispatch(
                            setCustomCostingSelection({
                              ...selectedCosting,
                              customCostingSelection: {
                                ...selectedCosting.customCostingSelection,
                                portOfDestination: items,
                                shl: Math.floor(
                                  response?.shl[0]?.destinations[0]?.shlCharge /
                                    containerWeight
                                ),
                                ofc: Math.floor(
                                  response?.ofc[0]?.destinations[0]?.ofcCharge /
                                    containerWeight
                                ),
                                cha: Math.floor(
                                  response?.cha[0]?.destinations[0]?.chaCharge /
                                    containerWeight
                                ),

                                shlData: response?.shl[0]?.destinations[0],
                                ofcData: response?.ofc[0]?.destinations[0],
                                chaData: response?.cha[0]?.destinations[0],
                              },
                            })
                          );
                        }

                        console.log(selectedCosting, items);

                        if (locationType === "origin") {
                          if (
                            selectedCosting?.customCostingSelection?.product
                          ) {
                            const response = await fetchTransportationCost(
                              items?._id,
                              selectedCosting?.customCostingSelection?.product
                                ?.sourceRates?._sourceId ||
                                selectedCosting?.customCostingSelection?.product
                                  ?.sourceObject?._id
                            );

                            if (
                              response?.data &&
                              response?.data?.length &&
                              response?.data[0]?.sourceLocations?.length
                            ) {
                              setFieldValue(
                                "transportation",
                                response?.data[0]?.sourceLocations[0]
                                  ?.transportationCharge
                              );

                              dispatch(
                                setCustomCostingSelection({
                                  ...selectedCosting,
                                  customCostingSelection: {
                                    ...selectedCosting.customCostingSelection,
                                    portOfOrigin: items,
                                    transportation:
                                      response?.data[0]?.sourceLocations[0]
                                        ?.transportationCharge,
                                  },
                                })
                              );
                            }
                          }
                        }
                        closeBottomSheet();
                      } else {
                        dispatch(
                          setCostingSelection({
                            ...selectedCosting,
                            portOfDestination: items,
                          })
                        );
                        // router.push("/export-costing/overview");
                      }
                    }}
                  >
                    <div className="min-h-[110px] min-w-[112px] rounded-lg relative">
                      <img
                        src={
                          "https://images-global.nhst.tech/image/Wms0M1VtY2oycjlOd1N5d2RoUTM5MnZmZGQwVXlhNjlmZmJZWkRTVS9rTT0=/nhst/binary/c739d40ffe66628a1e8196f515030223"
                        }
                        className="bg-cover h-[110px] w-[112px] rounded-lg"
                      />
                      {/* <div
                        className="min-h-[110px] min-w-[112px] rounded-lg absolute top-0 left-0 inline-flex items-end justify-end px-[10px] py-[12px]"
                        style={{
                          background:
                            "linear-gradient(rgba(27, 27, 27, 0) 0%, rgba(27, 27, 27, 0.48) 49.24%, rgba(27, 27, 27, 0.56) 65%, rgb(27 27 27 / 85%) 100%)",
                        }}
                      >
                        <span className="text-white text-sm font-bold font-sans line-clamp-1 capitalize">
                          ₹{items.sourceRates.price}/{items.sourceRates.unit}
                        </span>
                      </div> */}
                    </div>
                    <div className="w-full inline-flex flex-col space-y-[20px]">
                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                          {items.portName}
                        </span>

                        <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1 mt-[6px]">
                          {items.portCode}
                        </span>
                      </div>

                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
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
      </div>
    </React.Fragment>
  );
};

export default SelectLocationContainer;

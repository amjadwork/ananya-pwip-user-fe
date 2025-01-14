import React, { useState, useRef, useMemo } from "react";
// import { call, select, put } from "redux-saga/effects";
import { useRouter } from "next/router";
// import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import { api } from "@/utils/helper";
import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";
import {
  setSelectedPOLForOFCRequest,
  setSelectedPODForOFCRequest,
} from "@/redux/actions/ofc.actions";

import {
  searchIcon,
  // bookmarkFilledIcon,
  // bookmarkOutlineIcon,
} from "../../../theme/icon";

import { debounce } from "lodash";
// const { flag } = require("country-emoji");

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

import { postNewPortRequest } from "@/redux/actions/portRequest.actions.js";
import PortRequestForm from "@/containers/PortRequestForm";

// function PortRequestForm({ callback }) {
//   const {
//     closeBottomSheet,
//     startLoading,
//     stopLoading,
//     openToastMessage,
//     closeToastMessage,
//   } = useOverlayContext();

//   const [portName, setPortName] = useState("");
//   const [portCode, setPortCode] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState("");

//   const dispatch = useDispatch();

//   // Assuming countryList is obtained from somewhere
//   const countryList = useMemo(() => Country.getAllCountries(), []);

//   return (
//     <div className="inline-flex flex-col w-full h-auto px-5 py-4 pb-12">
//       <h3 className="font-semibold text-base text-pwip-black-600">
//         Tell us the port you want us to add
//       </h3>
//       <p className="text-pwip-gray-500 text-xs mt-1">
//         Enter the Port name or port code along with the country that you would
//         like to see on PWIP App.
//       </p>

//       <div className="w-full inline-flex flex-col mt-5 space-y-4">
//         {[
//           {
//             type: "text",
//             label: "Port name",
//             optional: false,
//             placeholder: "Enter port name",
//             value: portName,
//             onChange: setPortName,
//           },
//           {
//             type: "text",
//             label: "Port code",
//             optional: true,
//             placeholder: "Enter port code",
//             value: portCode,
//             onChange: setPortCode,
//           },
//           {
//             type: "select",
//             label: "Country",
//             optional: false,
//             placeholder: "Select a country",
//             value: selectedCountry,
//             onChange: setSelectedCountry,
//           },
//         ].map((m, i) => (
//           <div
//             key={m?.label + "_" + i}
//             className="w-full inline-flex flex-col space-y-1"
//           >
//             <label className="text-sm text-pwip-black-500">
//               {m?.label}{" "}
//               {m?.optional ? (
//                 <span className="text-gray-400">(Optional)</span>
//               ) : null}
//             </label>
//             {m?.type === "select" ? (
//               <select
//                 className={`bg-white block w-full h-10 p-1 px-3 text-sm text-gray-900 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
//                 value={m.value}
//                 onChange={(e) => m.onChange(e.target.value)}
//               >
//                 <option value="" className="text-sm text-gray-500"></option>
//                 {countryList?.map((country, index) => (
//                   <option
//                     key={country?.name + "_" + index}
//                     value={country?.isoCode}
//                     className="text-sm text-gray-500"
//                   >
//                     {country?.flag} {country?.name} ({country?.isoCode})
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={m.type}
//                 value={m.value}
//                 onChange={(e) => m.onChange(e.target.value)}
//                 className={`bg-white block w-full h-10 p-1 px-3 text-sm text-gray-900 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
//                 placeholder={m.placeholder}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="w-full mt-5">
//         <button
//           disabled={(!portName && !portCode) || !selectedCountry}
//           onClick={async () => {
//             if (!portName && !portCode) {
//               return;
//             }

//             if (!selectedCountry) {
//               return;
//             }

//             startLoading();
//             const payload = {
//               portName: portName,
//               portCode: portCode,
//               country: selectedCountry,
//             };
//             await dispatch(postNewPortRequest(payload));
//             closeBottomSheet();
//             stopLoading();

//             callback();

//             openToastMessage({
//               type: "success",
//               message: `We have recieved your request to add ${
//                 portName || portCode
//               }, we will notify you once port is available for use.`,
//               autoHide: true,
//             });

//             setTimeout(() => {
//               closeToastMessage();
//             }, 2500);
//           }}
//           className={`w-full outline-none border-none bg-pwip-v2-primary-600 text-center text-sm text-white py-3 px-5 rounded-lg mt-3 ${
//             (!portName && !portCode) || !selectedCountry ? "opacity-[0.5]" : ""
//           }`}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

const FilterSection = ({
  locationType,
  inFixedBar,
  fixedDivRef,
  isFixed,
  searchFocus,
  filterOptions = [],
  handleFilterSelect,
  selectedFilter,
  isFromEdit,
  isFromOtherService,
}) => {
  const dispatch = useDispatch();
  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );

  return (
    <div
      ref={fixedDivRef}
      className={`flex w-full flex-col`}
      style={{
        animation: !searchFocus
          ? "500ms ease-in-out 0s 1 normal none running fadeInDown"
          : "unset",
        background:
          !searchFocus || !searchScreenActive || !isFromEdit
            ? "linear-gradient(rgb(255, 255, 255) 94.86%, rgba(255, 255, 255, 0) 100%)"
            : "unset",
      }}
    >
      <div
        className={`inline-flex w-full items-end justify-between ${
          searchScreenActive || isFromEdit ? "mt-[38px]" : ""
        } mb-[24px]`}
      >
        <div className="w-full flex flex-col">
          {!isFromEdit && !isFromOtherService ? (
            <span className="text-xs font-semibold text-pwip-v2-gray-400">
              Step 2
            </span>
          ) : null}

          <h2 className={`text-pwip-v2-primary font-sans text-base font-bold`}>
            Choose the {locationType} port
          </h2>
        </div>

        {!searchScreenActive && !isFromEdit ? (
          <div
            className="text-pwip-v2-gray-500 text-xs h-6 w-6 text-center inline-flex items-center justify-center"
            onClick={() => {
              dispatch(searchScreenRequest(true));
              // window.clearTimeout(blurOccurred);
            }}
          >
            <span>{searchIcon}</span>
          </div>
        ) : null}
      </div>

      <div
        className={`flex overflow-x-scroll hide-scroll-bar ${
          !inFixedBar ? "mt-[20px]" : ""
        }`}
      >
        <div className="flex flex-nowrap">
          {/* <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
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
          </div> */}

          {/* <div className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]">
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
          </div> */}

          {[...filterOptions].map((items, index) => {
            const isSelected = selectedFilter?.name === items?.name;

            return (
              <div
                key={items?.name + (index + 1 * 2)}
                onClick={() => {
                  handleFilterSelect(items);
                }}
                className={`inline-block whitespace-nowrap px-[16px] py-[4px] border-[1px] ${
                  isSelected
                    ? "border-pwip-v2-primary-700 bg-pwip-v2-primary-200"
                    : "border-pwip-v2-gray-200 bg-pwip-v2-gray-100"
                } rounded-full mr-[12px] transition-all`}
              >
                <div className="overflow-hidden text-pwip-v2-gray-800 w-auto h-auto inline-flex items-center space-x-2">
                  <span className="text-sm font-[400] whitespace-nowrap">
                    {items?.name}
                  </span>

                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-[18px] h-[18px]"
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

const SelectLocationContainer = (props) => {
  const fixedDivRef = useRef();

  const isFromEdit = props.isFromEdit || false;
  const isFromOtherService = props.isFromOtherService || false;
  const locationType = props.locationType || "destination";
  const setFieldValue = props.setFieldValue;
  const containerWeight = props.containerWeight || 26;
  const formValues = props.formValues;
  const shipmentTerm = props.shipmentTerm;

  const { closeBottomSheet, openBottomSheet, startLoading, stopLoading } =
    useOverlayContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const locationsData = useSelector((state) => state.locations);
  const authToken = useSelector((state) => state.auth.token);

  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );

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
  const [isFixed, setIsFixed] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState(null);

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

        if (isFromEdit || isFromOtherService) {
          setListDestinationData([...locationsData.locations.destinations]);
        } else {
          setListDestinationData(
            [...locationsData.locations.destinations].slice(
              5,
              locationsData.locations.destinations.length - 1
            )
          );
        }

        const filterOpt = [...locationsData.locations.destinations];

        const uniqueNamesSet = new Set();
        filterOpt.forEach((item) => {
          uniqueNamesSet.add(item.country);
        });

        const uniqueNamesArray = Array.from(uniqueNamesSet);

        setFilterOptions(
          uniqueNamesArray.map((d) => ({
            name: d,
          }))
        );
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
        if (isFromEdit || isFromOtherService) {
          setListDestinationData([...locationsData.locations.origin]);
        } else {
          setListDestinationData(
            [...locationsData.locations.origin].slice(
              5,
              locationsData.locations.origin.length - 1
            )
          );
        }

        const filterOpt = [...locationsData.locations.origin];

        const uniqueNamesSet = new Set();
        filterOpt.forEach((item) => {
          uniqueNamesSet.add(item.state);
        });

        const uniqueNamesArray = Array.from(uniqueNamesSet);

        setFilterOptions(
          uniqueNamesArray.map((d) => ({
            name: d,
          }))
        );
      }
    }
  }, [locationsData, locationType, isFromEdit, isFromOtherService]);

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
  }, [searchScreenActive, listDestinationData?.length]);

  function handleSearch(searchString) {
    const dataToFilter = [...destinationList];

    // Create an empty array to store the matching variants
    const matchingVariants = [];

    // Convert the search string to lowercase for a case-insensitive search
    const searchLower = searchString.toLowerCase();

    // Iterate through the array of variants
    for (const variant of dataToFilter) {
      // Convert the variant name to lowercase for comparison
      const variantNameLower = variant?.portName?.toLowerCase();

      const countryNameLower =
        variant?.country?.toLowerCase() || variant?.state?.toLowerCase();
      const portCodeLower = variant?.portCode?.toLowerCase();

      // const countryNameLower = variant.country.toLowerCase();
      // const portCodeLower = variant.portCode.toLowerCase();

      // Check if the variant name contains the search string
      if (
        variantNameLower.includes(searchLower) ||
        countryNameLower.includes(searchLower) ||
        portCodeLower.includes(searchLower)
      ) {
        // If it does, add the variant to the matchingVariants array
        matchingVariants.push(variant);
      }
    }

    if (searchString) {
      setPopularDestinationData([]);
      setListDestinationData(matchingVariants);
    }

    if (
      !searchString &&
      locationType === "destination" &&
      locationsData.locations.destinations.length
    ) {
      setPopularDestinationData(
        [...locationsData.locations.destinations].slice(0, 5)
      );
      // setListDestinationData(
      //   [...locationsData.locations.destinations].slice(
      //     4,
      //     locationsData.locations.destinations.length - 1
      //   )
      // );
      if (isFromEdit || isFromOtherService) {
        if (locationsData.locations.destinations.length)
          setListDestinationData([...locationsData.locations.destinations]);
      } else {
        if (locationsData.locations.destinations.length)
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
      if (isFromEdit || isFromOtherService) {
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

  React.useEffect(() => {
    if (!searchScreenActive && destinationList?.length) {
      handleSearch("");
      setSearchStringValue("");
    }
  }, [searchScreenActive, destinationList]);

  let isFixedFlag = false;

  const checkY = () => {
    if (fixedDivRef?.current) {
      const fixedDiv = fixedDivRef.current.getBoundingClientRect();
      const divHeight = fixedDivRef.current.offsetHeight;
      const startY = fixedDiv.bottom;

      const shouldBeFixed =
        parseInt(window.scrollY.toFixed(0)) > parseInt(startY.toFixed(0));

      if (shouldBeFixed && !isFixedFlag) {
        setIsFixed(true);
        isFixedFlag = true;
      } else if (!shouldBeFixed && isFixedFlag) {
        setIsFixed(false);
        isFixedFlag = false;
      }
    }
  };

  const debouncedCheckY = debounce(checkY, 5);

  const handleInputDoneClick = (event) => {
    event.target.blur();
  };

  React.useEffect(() => {
    if (!isFromEdit && !isFromOtherService) {
      window.addEventListener("scroll", debouncedCheckY);

      return () => {
        window.removeEventListener("scroll", debouncedCheckY);
      };
    }
  }, [isFromEdit, isFromOtherService]);

  let blurOccurred = null;

  return (
    <React.Fragment>
      <div
        id="fixedMenuSection"
        className={`fixed ${
          !noTop ? "top-[56px]" : "top-[14px]"
        }  h-[auto] w-full z-10 py-3 pb-[18px] px-5`}
        style={{
          background:
            "linear-gradient(180deg, #FFF 84.97%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      >
        {searchScreenActive || isFromEdit ? (
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
              placeholder={`Search for a ${locationType} port`}
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
        ) : null}

        {listDestinationData?.length ? (
          <FilterSection
            locationType={locationType}
            isFromEdit={isFromEdit}
            isFromOtherService={isFromOtherService}
            inFixedBar={true}
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            handleFilterSelect={(item) => {
              if (selectedFilter?.name === item?.name) {
                setSelectedFilter(null);
                if (locationType === "origin") {
                  setListDestinationData([...locationsData.locations.origin]);
                }

                if (locationType === "destination") {
                  setListDestinationData([
                    ...locationsData.locations.destinations,
                  ]);
                }
                return null;
              } else {
                setSelectedFilter(item);
              }

              if (locationType === "destination") {
                const dataToFilterOrSort = [
                  ...locationsData.locations.destinations,
                ];

                const filteredData = dataToFilterOrSort.filter((d) => {
                  if (
                    d.country.toLowerCase().includes(item.name.toLowerCase())
                  ) {
                    return d;
                  }
                });

                setListDestinationData([...filteredData]);
              }

              if (locationType === "origin") {
                const dataToFilterOrSort = [...locationsData.locations.origin];

                const filteredData = dataToFilterOrSort.filter((d) => {
                  if (d.state.toLowerCase().includes(item.name.toLowerCase())) {
                    return d;
                  }
                });

                setListDestinationData([...filteredData]);
              }
            }}
          />
        ) : null}
      </div>
      <div
        className={`min-h-screen h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[172px]" : "pb-0"
        } overflow-auto hide-scroll-bar`}
        style={{
          paddingTop: isFromEdit
            ? mainContainerHeight + 96 + "px"
            : window.innerWidth >= 1280
            ? "136px"
            : isFromOtherService
            ? mainContainerHeight - 34 + "px"
            : searchScreenActive && listDestinationData?.length
            ? mainContainerHeight + 22 + "px"
            : !listDestinationData?.length && searchScreenActive
            ? 160 + "px"
            : 162 + "px",
        }}
      >
        <React.Fragment>
          <div
            className={`w-full h-auto inline-flex flex-col ${
              !isFromEdit || !isFromOtherService ? "mt-[32px]" : ""
            }`}
          >
            <div className="w-full h-full space-y-[24px]">
              {[...listDestinationData].map((items, index) => {
                return (
                  <div
                    key={items._id + index}
                    className="inline-flex items-center w-full p-[5px] px-5 space-x-[15px] bg-white transition-all"
                    style={{
                      backgroundColor:
                        selectedCosting?.portOfDestination?._id === items._id
                          ? "#F5FAFF"
                          : "#ffffff",
                    }}
                    onClick={async () => {
                      if (isFromOtherService && locationType === "origin") {
                        dispatch(setSelectedPOLForOFCRequest(items));
                        closeBottomSheet();
                        return;
                      }

                      if (
                        isFromOtherService &&
                        locationType === "destination"
                      ) {
                        dispatch(setSelectedPODForOFCRequest(items));
                        closeBottomSheet();
                        return;
                      }

                      if (isFromEdit) {
                        if (locationType === "destination") {
                          if (setFieldValue) {
                            setFieldValue("_destinationId", items);
                          }

                          const response = await fetchCHAandSHLandOFCCost(
                            formValues?._originId?._id ||
                              selectedCosting.customCostingSelection
                                .portOfOrigin._id,
                            items?._id
                          );

                          if (setFieldValue) {
                            if (response.cha.length) {
                              setFieldValue(
                                "cfsHandling",
                                Math.floor(
                                  response?.cha[0]?.destinations[0]?.chaCharge /
                                    containerWeight
                                )
                              );
                            }

                            if (response.ofc.length && shipmentTerm !== "FOB") {
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
                          }
                        }

                        if (locationType === "origin") {
                          if (setFieldValue) {
                            setFieldValue("_originId", items);
                          }

                          const response = await fetchCHAandSHLandOFCCost(
                            items?._id,
                            formValues?._destinationId?._id ||
                              selectedCosting.customCostingSelection
                                .portOfDestination._id
                          );

                          if (setFieldValue) {
                            if (response.cha.length) {
                              setFieldValue(
                                "cfsHandling",
                                Math.floor(
                                  response?.cha[0]?.destinations[0]?.chaCharge /
                                    containerWeight
                                )
                              );
                            }

                            if (response.ofc.length && shipmentTerm !== "FOB") {
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
                          }

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

                            if (setFieldValue) {
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
                              }
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
                      }
                    }}
                  >
                    <div className="min-h-[110px] min-w-[112px] rounded-lg relative">
                      <img
                        src={items.imageUrl}
                        className="bg-cover h-[110px] w-[112px] rounded-lg"
                      />
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
                          {items.country || items.state}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!listDestinationData?.length && searchStringValue ? (
                <div className="inline-flex flex-col justify-center items-center w-full h-full p-[5px] px-5">
                  <img
                    className="w-auto h-[120px]"
                    src="/assets/images/no-state/no-result.svg"
                  />
                  <h2 className="text-lg text-center text-pwip-v2-primary font-[700] mt-4">
                    No Results
                  </h2>
                  <p className="text-sm text-center text-pwip-v2-gray-500 font-[500] mt-2">
                    Sorry, there is no result for this search, <br />
                    let’s try another phrase
                  </p>

                  {locationType === "destination" ? (
                    <button
                      onClick={() => {
                        startLoading();
                        closeBottomSheet();

                        const content = (
                          <PortRequestForm
                            callback={() => {
                              setSearchStringValue("");
                              setListDestinationData([
                                ...locationsData.locations.destinations,
                              ]);
                            }}
                          />
                        );

                        setTimeout(() => {
                          openBottomSheet(content);
                          stopLoading();
                        }, 1000);
                      }}
                      className="outline-none border-none bg-pwip-v2-primary-600 text-center text-sm text-white py-2 px-3 rounded-lg mt-3"
                    >
                      Request a port
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};

export default SelectLocationContainer;

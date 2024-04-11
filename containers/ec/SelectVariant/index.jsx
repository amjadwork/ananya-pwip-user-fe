import React, { useRef } from "react";
import { debounce } from "lodash";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";
import {
  fetchCategoryRequest,
  // fetchCategoryFailure,
} from "@/redux/actions/category.actions";

import {
  searchIcon,
  // bookmarkFilledIcon,
  // bookmarkOutlineIcon,
} from "../../../theme/icon";

import {
  setCostingSelection,
  // setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";
import { convertUnits, getStateAbbreviation } from "@/utils/helper";

// import { fetchMyCostingSuccess } from "@/redux/actions/myCosting.actions.js";

const riceCategory = [
  {
    name: "Basmati",
    color: "#CFECFF",
    image:
      "https://ik.imagekit.io/qeoc0zl3c/Basmati.png?updatedAt=1706983415823",
  },
  {
    name: "Parboiled",
    color: "#CFE4C4",
    image:
      "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
  },
  {
    name: "Raw",
    color: "#E7D4C9",
    image: "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
  },
  {
    name: "Steam",
    color: "#F7EDC6",
    image:
      "https://ik.imagekit.io/qeoc0zl3c/Basmati.png?updatedAt=1706983367141",
  },
];

const FilterSection = ({
  listProductsData,
  inFixedBar,
  isFromEdit,
  fixedDivRef,
  isFixed,
  searchFocus,
  handleRadioSelection,
  sortByMethod,
  filterByMethod,
  filterOptions = [],
  handleFilterSelect,
  selectedFilter,
  isFromCategory,
  filterForCategory,
}) => {
  const { openBottomSheet, closeBottomSheet } = useOverlayContext();
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
        background: !searchFocus
          ? "linear-gradient(rgb(255, 255, 255) 94.86%, rgba(255, 255, 255, 0) 100%)"
          : "unset",
      }}
    >
      <div
        className={`inline-flex w-full items-end justify-between ${
          searchScreenActive || isFromEdit ? "mt-[38px]" : ""
        }`}
      >
        <div className="w-full flex flex-col">
          {!isFromCategory && !isFromEdit ? (
            <span className="text-xs font-semibold text-pwip-v2-gray-400">
              Step 1
            </span>
          ) : null}

          {isFromCategory ? (
            <h2
              className={`text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Choose from {listProductsData?.length || 0} varieties of{" "}
              {filterForCategory?.productCategory?.name} rice
            </h2>
          ) : (
            <h2
              className={`text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Choose rice from {listProductsData?.length || 0} varieties
            </h2>
          )}
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

      <div className={`flex overflow-x-scroll hide-scroll-bar mt-[20px]`}>
        <div className="flex flex-nowrap">
          <div
            onClick={() => {
              const content = (
                <React.Fragment>
                  <div className={`h-[auto] w-full bg-white z-10 py-6 px-5`}>
                    <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
                      Filter by
                    </h2>
                  </div>

                  <div
                    className={`h-full w-full bg-white pb-12 overflow-auto px-5 hide-scroll-bar`}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          label: "Source",
                          value: "source",
                        },
                        {
                          label: "Category",
                          value: "category",
                        },
                      ].map((items, index) => {
                        return (
                          <div
                            key={items.label + index}
                            onClick={async () => {
                              handleRadioSelection(items, "filter");
                              closeBottomSheet();
                            }}
                            className="cursor-pointer h-auto w-full rounded-md bg-pwip-white-100 inline-flex items-center"
                          >
                            <input
                              type="radio"
                              checked={filterByMethod?.value === items?.value}
                              onChange={(e) => {
                                handleRadioSelection(items, "filter");
                              }}
                            />
                            <div className="p-3 flex w-fill flex-col space-y-[4px]">
                              <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1 text-center">
                                {items.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              );
              openBottomSheet(content);
            }}
            className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
          >
            <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
              <span className="text-sm text-pwip-v2-gray-800 font-[400] whitespace-nowrap">
                Filter{" "}
                {filterByMethod?.value ? `by ${filterByMethod?.value}` : ""}
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

          {/* <div
            onClick={() => {
              const content = (
                <React.Fragment>
                  <div className={`h-[auto] w-full bg-white z-10 py-6 px-5`}>
                    <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
                      Sort by
                    </h2>
                  </div>

                  <div
                    className={`h-full w-full bg-white pb-12 overflow-auto px-5 hide-scroll-bar`}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          label: "Price",
                          value: "price",
                        },
                        {
                          label: "Name",
                          value: "name",
                        },
                      ].map((items, index) => {
                        return (
                          <div
                            key={items.label + index}
                            onClick={async () => {
                              handleRadioSelection(items, "sort");
                              closeBottomSheet();
                            }}
                            className="cursor-pointer h-auto w-full rounded-md bg-pwip-white-100 inline-flex items-center"
                          >
                            <input
                              type="radio"
                              checked={sortByMethod?.value === items?.value}
                              onChange={(e) => {
                                handleRadioSelection(items, "sort");
                              }}
                            />
                            <div className="p-3 flex w-fill flex-col space-y-[4px]">
                              <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1 text-center">
                                {items.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              );
              openBottomSheet(content);
            }}
            className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
          >
            <div className="overflow-hidden w-auto h-auto inline-flex items-center space-x-[14px]">
              <span className="text-sm text-pwip-v2-gray-800 font-[400] whitespace-nowrap">
                Sort {sortByMethod?.value ? `by ${sortByMethod?.value}` : ""}
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

          {filterOptions.map((items, index) => {
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

function getUniqueObjectsBySourceId(inputArray) {
  const uniqueObjects = {};

  inputArray.forEach((item) => {
    const sourceId = item._sourceId;

    // Check if the sourceId is already in the result object
    if (!uniqueObjects[sourceId]) {
      // If not found, add the current object to the result object
      uniqueObjects[sourceId] = {
        ...item,
        totalVariants: 1,
        variants: [item.variant],
      };
    } else {
      // If found, increment the totalVariants count and add the variant to the array
      uniqueObjects[sourceId].totalVariants += 1;
      uniqueObjects[sourceId].variants.push(item.variant);
    }
  });

  // Convert the result object to an array
  const resultArray = Object.values(uniqueObjects);

  return resultArray;
}

const SelectVariantContainer = (props) => {
  const fixedDivRef = useRef();

  const isFromEdit = props.isFromEdit || false;
  const isFromCategory = props.isFromCategory || false;
  const selectedUnitForPayload = props.selectedUnitForPayload || "mt";

  const setFieldValue = props.setFieldValue;

  const { openBottomSheet, closeBottomSheet } = useOverlayContext();

  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products); // Use api reducer slice
  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice
  const originPortObject = useSelector((state) => {
    if (
      state.myCosting &&
      state.myCosting.currentCostingFromHistory &&
      state.myCosting.currentCostingFromHistory.length
    ) {
      return state.myCosting.currentCostingFromHistory[0]?.details
        ?.originPortObject;
    }
    return null;
  });
  const filterForCategory = useSelector((state) => state.category.category);
  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );
  // const { roundedTop = false, noTop = false, noPaddingBottom = false } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [productsData, setProductsData] = React.useState([]);
  // const [popularProductsData, setPopularProductsData] = React.useState([]);
  const [listProductsData, setListProductsData] = React.useState([]);
  const [searchStringValue, setSearchStringValue] = React.useState("");
  const [isFixed, setIsFixed] = React.useState(false);
  const [sortByMethod, setSortByMethod] = React.useState(null);
  const [filterByMethod, setFilterByMethod] = React.useState(null);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState(null);

  const [popularSourceLocationData, setPopularSourceLocationData] =
    React.useState([]);

  // React.useEffect(() => {
  //   if (!isFromCategory) {
  //     console.log("here console");
  //     dispatch(fetchCategoryFailure());
  //   }
  // }, [isFromCategory]);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);

      // dispatch(fetchCategoryFailure());
    }
  }, [searchScreenActive]);

  React.useEffect(() => {
    if (!products?.error && !popularSourceLocationData?.length) {
      let productList = [...products.products];
      let sourceList = [];

      if (isFromCategory) {
        if (filterForCategory?.sourceId) {
          productList = [...products.products].filter((d) => {
            if (filterForCategory?.sourceId === d?.sourceRates?._sourceId) {
              return d;
            }
          });
        }

        if (filterForCategory?.productCategory?.name) {
          productList = [...products.products].filter((d) => {
            if (
              d?.variantName
                ?.toLowerCase()
                .includes(
                  filterForCategory?.productCategory?.name?.toLowerCase()
                )
            ) {
              return d;
            }
          });
        }
      }

      if (productList.length) {
        setProductsData([...productList]);

        sourceList = [...productList].map((d) => {
          let obj = {
            ...d.sourceRates,
            variant: d,
          };

          delete obj.sourceRates;

          return {
            ...obj,
          };
        });
      }

      if (sourceList.length) {
        setPopularSourceLocationData(
          getUniqueObjectsBySourceId(sourceList)
            .slice(0, 5)
            .map((d, i) => {
              const obj = {
                ...d,
                icon:
                  i === 0
                    ? "one.png"
                    : i === 1
                    ? "two.png"
                    : i === 2
                    ? "three.png"
                    : i === 3
                    ? "four.png"
                    : i === 4
                    ? "five.png"
                    : "five.png",
              };

              return obj;
            })
        );
      }

      if (productList) {
        setListProductsData([...productList]);

        // let riceCats = riceCategory.filter((f) => {
        //   if (filterForCategory?.productCategory?.name !== f.name) {
        //     return f;
        //   }
        // });

        let riceCats = [...riceCategory];

        if (
          filterForCategory?.productCategory?.name.toLowerCase() === "basmati"
        ) {
          riceCats = [
            {
              name: "Sella",
              color: "#CFE4C4",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
            },
            {
              name: "Raw",
              color: "#E7D4C9",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
            },
            {
              name: "Steam",
              color: "#F7EDC6",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Basmati.png?updatedAt=1706983367141",
            },
          ];
        }

        if (
          filterForCategory?.productCategory?.name.toLowerCase() === "parboiled"
        ) {
          riceCats = [
            {
              name: "White",
              color: "#CFE4C4",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
            },
            {
              name: "Gold",
              color: "#E7D4C9",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
            },
          ];
        }

        if (filterForCategory?.productCategory?.name.toLowerCase() === "raw") {
          riceCats = [
            {
              name: "New",
              color: "#CFE4C4",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
            },
            {
              name: "Old",
              color: "#E7D4C9",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
            },
          ];
        }

        if (
          filterForCategory?.productCategory?.name.toLowerCase() === "steam"
        ) {
          riceCats = [
            {
              name: "New",
              color: "#CFE4C4",
              image:
                "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
            },
          ];
        }

        setFilterOptions([...riceCats]);
      }
    }
  }, [products, popularSourceLocationData, isFromCategory]);

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
      const sourceNameLower = variant.sourceRates.sourceName.toLowerCase();
      const sourceStateLower = variant.sourceRates.sourceState.toLowerCase();

      // Check if the variant name contains the search string
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
      setListProductsData(matchingVariants);
    }

    if (!searchString) {
      let productList = [...productsData];

      setListProductsData([...productList]);
    }
  }

  React.useEffect(() => {
    if (!searchScreenActive && productsData.length) {
      handleSearch("");
      setSearchStringValue("");
    }
  }, [searchScreenActive, productsData]);

  let isFixedFlag = false;

  const checkY = () => {
    if (fixedDivRef?.current) {
      const fixedDiv = fixedDivRef.current.getBoundingClientRect();
      const divHeight = fixedDivRef.current.offsetHeight;
      const startY = fixedDiv.bottom;

      const shouldBeFixed =
        parseInt(window.scrollY.toFixed(0)) >
        parseInt((startY + divHeight * 2).toFixed(0));

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
    if (!isFromEdit && !isFromCategory) {
      window.addEventListener("scroll", debouncedCheckY);

      return () => {
        window.removeEventListener("scroll", debouncedCheckY);
      };
    }
  }, [isFromEdit, isFromCategory]);

  let blurOccurred = null;

  return (
    <React.Fragment>
      {/* {!isFromEdit && !searchScreenActive ? (
        <div
          className={`inline-flex items-center mt-[56px] h-[auto] min-h-[120px] w-full z-0 py-3 px-5 bg-pwip-v2-primary-100`}
        >
          <div className="inline-flex space-x-4 w-full">
            <div className="inline-flex w-full flex-col">
              <h3 className="text-sm text-pwip-black-600 font-semibold">
                Costings at your finger tips!
              </h3>
              <p className="text-xs text-pwip-v2-gray-500 font-normal mt-1">
                Generate costings in 2 clicks and be ready with your estimates.
              </p>
            </div>

            <img
              className="h-[32px] w-auto"
              src="/assets/images/services/ec-service-logo.png"
            />
          </div>
        </div>
      ) : null} */}

      <div
        id="fixedMenuSection"
        className={`transition-all bg-white  ${
          isFromEdit ? "fixed" : "sticky top-[56px]"
        } pt-5 pb-3 h-[auto] w-full ${
          isFromCategory || isFromEdit ? "pb-[18px]" : "pb-[18px]"
        } px-5 z-10`}
        style={{
          transition: "max-height 6000s ease",
          background:
            !isFromCategory && !isFixed
              ? "linear-gradient(180deg, #FFFFFF 94.86%, rgba(255, 255, 255, 0.00) 100%)"
              : !isFromCategory && isFixed
              ? "#ffffff"
              : `linear-gradient(180deg, ${
                  filterForCategory?.productCategory?.color || "#FFFFFF"
                } 94.86%, rgba(255, 255, 255, 0.00) 100%)`,
        }}
      >
        <div
          style={{
            filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
          }}
          className={`h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans ${
            searchScreenActive || isFromEdit
              ? "inline-flex items-center opacity-1"
              : "hidden opacity-0"
          } transition-opacity px-[18px]`}
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

        <FilterSection
          listProductsData={listProductsData}
          isFromEdit={isFromEdit}
          inFixedBar={true}
          filterOptions={filterOptions}
          isFromCategory={isFromCategory}
          filterForCategory={filterForCategory}
          handleFilterSelect={(item) => {
            setSelectedFilter(item);
            if (selectedFilter?.name === item?.name) {
              setSelectedFilter(null);
              setListProductsData([...productsData]);
              return null;
            } else {
              setSelectedFilter(item);
            }
            const dataToFilterOrSort = [...productsData];

            const filteredData = dataToFilterOrSort.filter((d) => {
              if (
                d.variantName.toLowerCase().includes(item.name.toLowerCase())
              ) {
                return d;
              }

              if (
                d.sourceRates.sourceName
                  .toLowerCase()
                  .includes(item.name.toLowerCase())
              ) {
                return d;
              }
            });

            setListProductsData([...filteredData]);
          }}
          selectedFilter={selectedFilter}
          handleRadioSelection={(item, method) => {
            const dataToFilterOrSort = [...productsData];

            if (method === "sort") {
              setSortByMethod(item);

              if (item.value === "name") {
                const sortedArrary = dataToFilterOrSort.sort((a, b) => {
                  const variantNameA = a?.variantName;
                  const variantNameB = b?.variantName;

                  if (variantNameA < variantNameB) {
                    return -1;
                  }
                  if (variantNameA > variantNameB) {
                    return 1;
                  }
                  return 0;
                });
                setListProductsData([...sortedArrary]);
              }

              if (item.value === "price") {
                const sortedArrary = dataToFilterOrSort.sort(
                  (a, b) => a?.sourceRates?.price - b?.sourceRates?.price
                );

                setListProductsData([...sortedArrary]);
              }
            }

            if (method === "filter") {
              setFilterByMethod(item);

              if (item?.value === "source") {
                const filterOpt = dataToFilterOrSort.map((d) => {
                  return {
                    name: d?.sourceRates?.sourceName,
                  };
                });

                const uniqueNamesSet = new Set();
                filterOpt.forEach((item) => {
                  uniqueNamesSet.add(item.name);
                });

                const uniqueNamesArray = Array.from(uniqueNamesSet);
                setFilterOptions(
                  uniqueNamesArray.map((d) => ({
                    name: d,
                  }))
                );
              }

              if (item?.value === "category") {
                let riceCats = [...riceCategory];

                if (
                  filterForCategory?.productCategory?.name.toLowerCase() ===
                  "basmati"
                ) {
                  riceCats = [
                    {
                      name: "Sella",
                      color: "#CFE4C4",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
                    },
                    {
                      name: "Raw",
                      color: "#E7D4C9",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
                    },
                    {
                      name: "Steam",
                      color: "#F7EDC6",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Basmati.png?updatedAt=1706983367141",
                    },
                  ];
                }

                if (
                  filterForCategory?.productCategory?.name.toLowerCase() ===
                  "parboiled"
                ) {
                  riceCats = [
                    {
                      name: "White",
                      color: "#CFE4C4",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
                    },
                    {
                      name: "Gold",
                      color: "#E7D4C9",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
                    },
                  ];
                }

                if (
                  filterForCategory?.productCategory?.name.toLowerCase() ===
                  "raw"
                ) {
                  riceCats = [
                    {
                      name: "New",
                      color: "#CFE4C4",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
                    },
                    {
                      name: "Old",
                      color: "#E7D4C9",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Raw.png?updatedAt=1706983415401",
                    },
                  ];
                }

                if (
                  filterForCategory?.productCategory?.name.toLowerCase() ===
                  "steam"
                ) {
                  riceCats = [
                    {
                      name: "New",
                      color: "#CFE4C4",
                      image:
                        "https://ik.imagekit.io/qeoc0zl3c/Parboiled.png?updatedAt=1706983415797",
                    },
                  ];
                }

                setFilterOptions([...riceCats]);
              }
            }

            return null;
          }}
          filterByMethod={filterByMethod}
          sortByMethod={sortByMethod}
        />
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white pb-0 overflow-auto hide-scroll-bar`}
        style={{
          paddingTop: isFromEdit
            ? mainContainerHeight + 104 + "px"
            : window.innerWidth >= 1280
            ? "136px"
            : searchScreenActive
            ? 38 + "px"
            : 32 + "px",
        }}
      >
        <React.Fragment>
          <div className="w-full h-auto inline-flex flex-col mt-[32px]">
            <div
              className={`w-full h-full space-y-[24px] px-5 pb-[88px] overflow-y-auto hide-scroll-bar transition-all`}
            >
              {listProductsData.map((items, index) => {
                return (
                  <div
                    key={items._id + index}
                    onClick={() => {
                      dispatch(searchScreenFailure());

                      if (isFromCategory && router?.query?.from === "home") {
                        router?.push(
                          `/service/rice-price/detail/${items?._id}?_s=${items?.sourceRates?._sourceId}`
                        );
                        return;
                      }

                      if (isFromEdit) {
                        if (setFieldValue) {
                          setFieldValue(
                            "brokenPercentage",
                            items?.brokenPercentage || "0"
                          );

                          setFieldValue("_originId", {});
                          setFieldValue("_destinationId", {});
                          setFieldValue("_variantId", items);
                          setFieldValue("containersCount", 1);

                          setFieldValue(
                            "costOfRice",
                            convertUnits(
                              "kg",
                              selectedUnitForPayload,
                              items?.sourceRates?.price
                            )
                          );
                        }
                        dispatch(
                          fetchOriginRequest(items?.sourceRates?._sourceId)
                        );
                        if (isFromEdit && originPortObject) {
                          dispatch(
                            fetchDestinationRequest(null, originPortObject?._id)
                          );
                        } else {
                          dispatch(
                            fetchDestinationRequest(
                              items?.sourceRates?._sourceId
                            )
                          );
                        }

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
                    className="inline-flex items-center w-full space-x-[15px] bg-white"
                  >
                    <div className="min-h-[110px] min-w-[112px] rounded-lg relative">
                      <img
                        src={
                          items.images[0] ||
                          "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                        }
                        className="bg-cover h-[110px] w-[112px] rounded-lg object-cover"
                      />
                      <div
                        className="min-h-[110px] min-w-[112px] rounded-lg absolute top-0 left-0 inline-flex items-end justify-end px-[10px] py-[12px]"
                        style={{
                          background:
                            "linear-gradient(rgba(27, 27, 27, 0) 0%, rgba(27, 27, 27, 0.48) 49.24%, rgba(27, 27, 27, 0.56) 65%, rgb(27 27 27 / 85%) 100%)",
                        }}
                      >
                        <span className="text-white text-sm font-bold font-sans line-clamp-1 capitalize">
                          ₹{items.sourceRates.price}/{items.sourceRates.unit}
                        </span>
                      </div>
                    </div>
                    <div className="w-full inline-flex flex-col space-y-[20px]">
                      <div className="inline-flex flex-col items-start justify-between w-full">
                        <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                          {items.variantName}
                        </span>

                        <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1 mt-[6px]">
                          {items.brokenPercentage || 0}% Broken
                        </span>
                      </div>

                      <div className="inline-flex items-center justify-between w-full">
                        <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
                          {items.sourceRates.sourceName},{" "}
                          {getStateAbbreviation(
                            items.sourceRates.sourceState
                          ) || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!listProductsData?.length && searchStringValue ? (
                <div className="inline-flex flex-col justify-center items-center w-full h-full">
                  <img
                    className="w-auto h-[260px]"
                    src="/assets/images/no-state/no-result.svg"
                  />
                  <h2 className="text-xl text-center text-pwip-v2-primary font-[700] mt-8">
                    No Results
                  </h2>
                  <p className="text-base text-center text-pwip-v2-gray-500 font-[500] mt-5">
                    Sorry, there is no result for this search, let’s try another
                    phrase
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};

export default SelectVariantContainer;

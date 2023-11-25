import React, { useRef } from "react";
import { debounce } from "lodash";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import {
  fetchDestinationRequest,
  fetchOriginRequest,
} from "@/redux/actions/location.actions";
import { fetchCategoryRequest } from "@/redux/actions/category.actions";

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";

import { fetchMyCostingSuccess } from "@/redux/actions/myCosting.actions.js";

const popularFilters = [
  {
    name: "Basmati",
    icon: "one.png",
  },
  {
    name: "Parboiled",
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

const popularSourceLocations = [
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

const riceCategory = [
  {
    name: "Basmati",
    color: "#CFECFF",
  },
  {
    name: "Parboiled",
    color: "#CFE4C4",
  },
  {
    name: "Raw",
    color: "#E7D4C9",
  },
  {
    name: "Steam",
    color: "#F7EDC6",
  },
];

const FilterSection = ({
  listProductsData,
  inFixedBar,
  fixedDivRef,
  isFixed,
  searchFocus,
}) => {
  return (
    <div
      ref={fixedDivRef}
      className={`flex w-full flex-col ${
        !inFixedBar ? "px-5 mb-[32px]" : "pb-2"
      }
      ${
        isFixed && !searchFocus ? "fixed left-0 top-[158px] bg-white z-20" : ""
      } pb-4
      `}
      style={{
        animation:
          isFixed && !searchFocus
            ? "500ms ease-in-out 0s 1 normal none running fadeInDown"
            : "unset",
        background:
          isFixed && !searchFocus
            ? "linear-gradient(rgb(255, 255, 255) 94.86%, rgba(255, 255, 255, 0) 100%)"
            : "unset",
      }}
    >
      <h2
        className={`text-pwip-v2-primary font-sans text-base font-bold ${
          inFixedBar && !searchFocus ? "mb-[24px] mt-[38px]" : ""
        }`}
      >
        {listProductsData?.length || 0} varieties to explore
      </h2>

      <div
        className={`flex overflow-x-scroll hide-scroll-bar ${
          !inFixedBar ? "mt-[20px]" : ""
        }`}
      >
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
  const filterForCategory = useSelector((state) => state.category.category);
  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );
  const { roundedTop = false, noTop = false, noPaddingBottom = false } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [productsData, setProductsData] = React.useState([]);
  const [popularProductsData, setPopularProductsData] = React.useState([]);
  const [listProductsData, setListProductsData] = React.useState([]);
  const [searchStringValue, setSearchStringValue] = React.useState("");
  const [isFixed, setIsFixed] = React.useState(false);
  // const [searchFocus, setSearchFocus] = React.useState(false);

  const [popularSourceLocationData, setPopularSourceLocationData] =
    React.useState([]);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

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

      // Check if the variant name contains the search string
      if (variantNameLower.includes(searchLower)) {
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

  // const checkY = () => {
  //   const fixedDiv = fixedDivRef.current.getBoundingClientRect();
  //   const divHeight = fixedDivRef.current.offsetHeight;
  //   const startY = fixedDiv.bottom;

  //   // console.log(
  //   //   window.scrollY,
  //   //   startY,
  //   //   window.scrollY > startY + divHeight * 2
  //   // );

  //   if (window.scrollY >= startY + divHeight * 2) {
  //     setIsFixed(true);
  //   } else {
  //     setIsFixed(false);
  //   }
  // };

  let isFixedFlag = false;

  const checkY = () => {
    if (fixedDivRef?.current) {
      const fixedDiv = fixedDivRef.current.getBoundingClientRect();
      const divHeight = fixedDivRef.current.offsetHeight;
      const startY = fixedDiv.bottom;

      const shouldBeFixed =
        parseInt(window.scrollY.toFixed(0)) >
        parseInt((startY + divHeight * 2).toFixed(0));

      // console.log(
      //   parseInt(window.scrollY.toFixed(0)) >
      //     parseInt((startY + divHeight * 2).toFixed(0)),
      //   parseInt(window.scrollY.toFixed(0)),
      //   parseInt((startY + divHeight * 2).toFixed(0))
      // );

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

  // React.useEffect(() => {
  //   window.addEventListener("focusout", handleInputDoneClick);

  //   return () => {
  //     window.removeEventListener("focusout", handleInputDoneClick);
  //   };
  // }, []);

  let blurOccurred = null;

  return (
    <React.Fragment>
      <div
        id="fixedMenuSection"
        className={`fixed ${
          !noTop ? "top-[56px]" : "top-[18px]"
        }  h-[auto] w-full z-10 py-3 ${
          isFromCategory ? "pb-[12px]" : "pb-[32px]"
        } px-5`}
        style={{
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
            placeholder="Search for a variety of rice"
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
              dispatch(searchScreenFailure());
              blurOccurred = window.setTimeout(function () {
                handleInputDoneClick(e);
              }, 10);
            }}
            inputMode="search"
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

        {isFromCategory ? (
          <FilterSection
            listProductsData={listProductsData}
            inFixedBar={true}
          />
        ) : null}
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white pb-0 overflow-auto hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 32 + "px",
        }}
      >
        {!isFromCategory && !searchScreenActive && !searchStringValue ? (
          <React.Fragment>
            <h2
              className={`px-5 mt-4 mb-5 text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Search rice by category
            </h2>

            <div className="grid grid-cols-4 gap-4 px-5">
              {[...riceCategory].map((items, index) => {
                return (
                  <div
                    key={items?.name + index}
                    className="inline-flex flex-col items-center justify-center space-y-[10px]"
                    onClick={() => {
                      dispatch(
                        fetchCategoryRequest({
                          productCategory: {
                            name: items.name,
                            color:
                              index === 0
                                ? "#F3F7F9"
                                : index === 1
                                ? "#F7FFF2"
                                : index === 2
                                ? "#FFF5EF"
                                : index === 3
                                ? "#FFFBED"
                                : "#F3F7F9",
                          },
                        })
                      );

                      router.push("/category");
                    }}
                  >
                    <div
                      style={{
                        background: items?.color,
                      }}
                      className="h-[72px] w-[72px] rounded-lg inline-flex items-center justify-center"
                    >
                      <img
                        src={
                          "assets/images/rice_cat.png"
                          // items.images[0] ||
                          // "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                        }
                        className="bg-cover h-[58px] w-[58px] object-cover rounded-md"
                      />
                    </div>
                    <span className="text-pwip-gray-700 text-sm font-[500] font-sans text-center line-clamp-1">
                      {items?.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ) : null}

        {!isFromCategory && !searchScreenActive && !searchStringValue ? (
          <React.Fragment>
            <h2
              className={`px-5 mt-[32px] mb-5 text-pwip-v2-primary font-sans text-base font-bold`}
            >
              Popular sourcing locations
            </h2>

            <div className="flex overflow-x-scroll hide-scroll-bar py-2 px-5">
              <div className="flex flex-nowrap">
                {[...popularSourceLocationData].map((items, index) => {
                  return (
                    <div
                      key={items?.sourceName + (index + 1 * 2)}
                      className="inline-block px-[15px] py-[18px] bg-pwip-v2-primary-100 rounded-xl mr-4"
                      style={{
                        boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                      onClick={() => {
                        dispatch(
                          fetchCategoryRequest({
                            sourceId: items._sourceId,
                          })
                        );

                        router.push("/category");
                      }}
                    >
                      <div className="overflow-hidden w-[186px] h-auto inline-flex flex-col">
                        <img
                          src={"/assets/images/" + items?.icon}
                          className="w-[24px] h-[24px]"
                        />
                        <div className="mt-[10px] inline-flex items-center space-x-2 text-pwip-v2-primary-800 text-xs font-[600]">
                          <span className="line-clamp-1">Karnataka (IN)</span>
                          <span className="text-sm">🇮🇳</span>
                        </div>
                        <span className="mt-[4px] text-base text-pwip-v2-gray-800 font-[800] line-clamp-1">
                          {items?.sourceName || ""}
                        </span>
                        <span className="mt-[6px] text-xs text-pwip-v2-gray-500 font-[400] line-clamp-1">
                          {items?.totalVariants || 0} variety of rice available
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
          <div className="w-full h-auto inline-flex flex-col mt-[32px]">
            {!isFromCategory && !searchScreenActive && !searchStringValue ? (
              <FilterSection
                fixedDivRef={fixedDivRef}
                listProductsData={listProductsData}
                isFixed={isFixed}
                searchFocus={searchScreenActive}
              />
            ) : null}

            {/* <div className="flex w-full flex-col">
              <h2
                className={`px-5 mb-[24px] text-pwip-v2-primary font-sans text-base font-bold`}
              >
                {listProductsData?.length || 0} varieties to explore
              </h2>

              <div className="flex overflow-x-scroll hide-scroll-bar mb-[32px] px-5">
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
            </div> */}

            <div
              className={`w-full h-full space-y-[24px] px-5 pb-[88px] ${
                isFixed ? "pt-[162px]" : ""
              } overflow-y-auto hide-scroll-bar transition-all`}
              // style={{
              //   maxHeight: `calc(100vh - ${
              //     mainContainerHeight + 56 + 64 + 46
              //   }px)`,
              // }}
            >
              {listProductsData.map((items, index) => {
                return (
                  <div
                    key={items._id + index}
                    onClick={() => {
                      if (isFromEdit) {
                        if (setFieldValue) {
                          setFieldValue("_originId", {});
                          setFieldValue("_destinationId", {});
                          setFieldValue("_variantId", items);

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
                        dispatch(fetchOriginRequest());
                        dispatch(fetchDestinationRequest());
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
                        className="bg-cover h-[110px] w-[112px] rounded-lg"
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
                          {items.sourceRates.sourceName}
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

export default SelectVariantContainer;

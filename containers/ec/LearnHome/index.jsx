import React, { useRef, useCallback } from "react";
import { call, select, put } from "redux-saga/effects";
import { useRouter } from "next/router";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import { api } from "@/utils/helper";
import {
  searchScreenRequest,
  searchScreenFailure,
} from "@/redux/actions/utils.actions.js";
import { debounce } from "lodash";

import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

const popularFilters = [
  {
    name: "All",
    icon: "one.png",
  },
  {
    name: "Rice",
    icon: "two.png",
  },
  {
    name: "Exports",
    icon: "three.png",
  },
  {
    name: "Founder's fun network",
    icon: "four.png",
  },
  {
    name: "Steam",
    icon: "five.png",
  },
];

const FilterSection = ({ inFixedBar, fixedDivRef, isFixed, searchFocus }) => {
  return (
    <div
      ref={fixedDivRef}
      className={`flex w-full flex-col ${
        !inFixedBar ? "px-5 mb-[24px]" : "pb-2"
      }
      ${
        isFixed && !searchFocus
          ? "fixed left-0 top-[142px] bg-white z-20"
          : "top-[158px]"
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
        Learn with our videos
      </h2>

      <div
        className={`flex overflow-x-scroll hide-scroll-bar ${
          !inFixedBar ? "mt-[20px]" : ""
        }`}
      >
        <div className="flex flex-nowrap">
          {[...popularFilters].map((items, index) => {
            return (
              <div
                key={items?.name + (index + 1 * 2)}
                className="inline-block px-[16px] py-[4px] border-[1px] border-pwip-v2-gray-200 bg-pwip-v2-gray-100 rounded-full mr-[12px]"
              >
                <div className="overflow-hidden w-auto h-auto inline-flex items-center">
                  <span className="text-sm text-pwip-v2-gray-800 font-[400] whitespace-nowrap">
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

const LearnHomeContainer = (props) => {
  const fixedDivRef = useRef();

  const isFromEdit = props.isFromEdit || false;
  const locationType = props.locationType || "destination";

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
  const [activeSlide, setActiveSlide] = React.useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: function (prev, next) {
      setActiveSlide(next);
    },
    customPaging: function (i) {
      // console.log(i);
      return (
        <div
          className={`${
            activeSlide === i ? "w-[18px] bg-[#003559]" : "w-[8px] bg-[#E1E0E0]"
          } h-[8px] rounded-full`}
        >
          {/*  */}
        </div>
      );
    },
  };

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
    window.addEventListener("scroll", debouncedCheckY);

    return () => {
      window.removeEventListener("scroll", debouncedCheckY);
    };
  }, []);

  let blurOccurred = null;

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
            placeholder={`Search for videos and courses`}
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
        } overflow-auto hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 52 + "px",
        }}
      >
        <React.Fragment>
          <div className="h-auto min-h-[190px] w-screen overflow-hidden hide-scroll-bar py-2 px-5">
            <Slider {...sliderSettings}>
              {[...popularDestinationData].map((items, index) => {
                return (
                  <div
                    key={`${index}_` + (index + 1 * 2)}
                    className="inline-block rounded-xl transition-all pt-[2px] pb-2 px-[2px]"
                  >
                    <div
                      className="w-full h-full px-[15px] py-[18px] rounded-xl grid grid-cols-2 gap-4"
                      style={{
                        boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.12)",
                        backdropFilter: "blur(8px)",
                        background: `linear-gradient(88deg, #8FC7EC 1.22%, #C7E8FF 83.53%)`,
                      }}
                    >
                      <div className="overflow-hidden w-auto h-auto inline-flex flex-col">
                        <div className="w-full">
                          <span className="mt-[4px] text-[24px] text-pwip-v2-gray-800 font-[800] line-clamp-2">
                            Rice & Exports
                          </span>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => null}
                            className="bg-pwip-v2-primary-700 rounded-lg outline-none border-none py-[3px] px-4 text-white text-xs w-auto"
                          >
                            Check Out
                          </button>
                        </div>
                      </div>

                      <div className="w-auto h-auto">
                        <img
                          src="https://www.thestatesman.com/wp-content/uploads/2021/09/rice-stock.jpg"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </React.Fragment>

        <React.Fragment>
          <div className={`w-full h-auto inline-flex flex-col mt-[12px]`}>
            <div className="flex overflow-x-scroll hide-scroll-bar">
              <FilterSection
                fixedDivRef={fixedDivRef}
                isFixed={isFixed}
                searchFocus={searchScreenActive}
              />
            </div>

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
                      router.push("/learn/detail");
                    }}
                  >
                    <div className="h-[110px] min-w-[112px] w-[112px] rounded-lg relative">
                      <img
                        src={
                          "https://store-images.s-microsoft.com/image/apps.11879.13734281781052682.f6ae95d2-26ff-49d4-a8c8-440a26f9d100.6e86e456-aa0f-47e2-becd-b247e7862832?h=464"
                        }
                        className="bg-cover h-[110px] w-[112px] rounded-lg"
                      />
                    </div>
                    <div className="w-full h-[100px] inline-flex flex-col justify-between">
                      <div className="w-auto h-auto relative">
                        <div className="inline-flex items-center justify-between w-full">
                          <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md mr-[12px]">
                            <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                              Rice
                            </span>
                          </div>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M14.6608 2.76765C15.5775 2.87432 16.25 3.66515 16.25 4.58848V17.4993L10 14.3743L3.75 17.4993V4.58848C3.75 3.66515 4.42167 2.87432 5.33917 2.76765C8.43599 2.40818 11.564 2.40818 14.6608 2.76765Z"
                              stroke="#006EB4"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="inline-flex flex-col w-full mt-[6px] space-y-[6px]">
                          <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                            Kolam Rice vs Bullet Rice
                          </span>
                          <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1">
                            By Dhanraj Kidiyoor
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex flex-col w-full mt-[6px]">
                        <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
                          14.32 min
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

export default LearnHomeContainer;

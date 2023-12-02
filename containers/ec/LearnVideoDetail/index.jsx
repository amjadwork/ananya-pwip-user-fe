import React, { useRef, useCallback, useState, useEffect } from "react";
import { call, select, put } from "redux-saga/effects";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import { dummyRemoveMeCityIcon, logoCircle } from "../../../theme/icon";
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

const YouTubePlayer = () => {
  const router = useRouter();
  const videoRef = useRef();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showDefaultThumbnail, setShowDefaultThumbnail] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgressInPercent, setVideoProgressInPercent] = useState(0);
  const [videoVolume, setVideoVolume] = useState(false);
  const [showPlayerCustomControls, setShowPlayerCustomControls] =
    useState(true);

  let timeoutId;

  useEffect(() => {
    if (videoPlaying && showPlayerCustomControls) {
      timeoutId = setTimeout(() => {
        setShowPlayerCustomControls(false);
      }, 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [videoPlaying, showPlayerCustomControls]);

  return (
    <div
      className="relative bg-pwip-black-600"
      style={{ paddingBottom: "56.25%" }}
    >
      {/* The padding-bottom is set to 56.25% to achieve a 16:9 aspect ratio */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          onClick={() => {
            if (videoRef?.current) {
              if (
                showDefaultThumbnail ||
                videoRef?.current?.player?.isPlaying
              ) {
                setShowDefaultThumbnail(false);
              }
            }

            setShowPlayerCustomControls(!showPlayerCustomControls);
            clearTimeout(timeoutId);

            return null;
          }}
          className="h-full w-full bg-[#00000047] absolute top-0 left-0 z-10"
        >
          <div className="h-full w-full inline-flex flex-col justify-between">
            <div
              className={`inline-flex items-center justify-between px-4 py-3 transition-all ${
                showPlayerCustomControls
                  ? "translate-y-0 opacity-1"
                  : "-translate-y-4 opacity-0"
              }`}
            >
              <button
                onClick={() => {
                  router.back();
                }}
                className="border-none outline-none h-auto w-auto rounded-full"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 35 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16.9163" cy="17.7487" r="11.0833" fill="white" />
                  <path
                    d="M32.0837 18.332C32.0837 10.2908 25.5416 3.74871 17.5003 3.74871C9.45908 3.74871 2.91699 10.2908 2.91699 18.332C2.91699 26.3733 9.45908 32.9154 17.5003 32.9154C25.5416 32.9154 32.0837 26.3733 32.0837 18.332ZM10.2087 18.332L17.5003 11.0404L17.5003 16.8737L24.792 16.8737L24.792 19.7904L17.5003 19.7904L17.5003 25.6237L10.2087 18.332Z"
                    fill="#0B0F11"
                  />
                </svg>
              </button>

              <button className="border-none outline-none h-auto w-auto inline-flex items-center justify-center">
                <img
                  src="/assets/images/logo-white.png"
                  className="h-[36px] w-auto"
                />
              </button>
            </div>

            <div className="h-full w-full"></div>

            <div
              className={`inline-flex items-center justify-center w-full px-4 py-3 space-x-3 transition-all ${
                showPlayerCustomControls
                  ? "translate-y-0 opacity-1"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <button
                onClick={() => {
                  setVideoPlaying(!videoPlaying);
                }}
                className="inline-flex items-center justify-center border-none outline-none h-auto w-auto rounded-full"
              >
                {videoPlaying ? (
                  <img
                    src="/assets/images/pause-icon.svg"
                    className="h-[36px] w-[36px]"
                  />
                ) : (
                  <img
                    src="/assets/images/play-icon.svg"
                    className="h-[36px] w-[36px]"
                  />
                )}
              </button>

              <div className="w-full">
                <div className="w-full h-1.5 rounded-full bg-[#e2e2e25e]">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: videoProgressInPercent + "%",
                    }}
                  >
                    {/*  */}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setVideoVolume(!videoVolume);
                }}
                className="inline-flex items-center justify-center border-none outline-none h-auto w-auto rounded-full"
              >
                {videoVolume ? (
                  <img
                    src="/assets/images/sound-off.svg"
                    className="h-[36px] w-[36px]"
                  />
                ) : (
                  <img
                    src="/assets/images/sound-on.svg"
                    className="h-[36px] w-[36px]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <ReactPlayer
          ref={videoRef}
          url="https://www.youtube.com/embed/z_Yt7Wk_bZ8"
          loop={false}
          width="100%"
          height="100%"
          controls={false}
          light={showDefaultThumbnail}
          playing={videoPlaying}
          stopOnUnmount={true}
          volume={videoVolume ? 0 : 1}
          onClickPreview={() => {
            console.log("null", null);
          }}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload", // Disable download button
              },
            },
          }}
          onProgress={(progress) => {
            // console.log(progress);
            const totalDuration = videoDuration;
            const currentProgress = progress?.playedSeconds
              ? Math.ceil(progress?.playedSeconds)
              : 0; // in seconds

            const percentageCompleted = (currentProgress / totalDuration) * 100;

            setVideoProgressInPercent(percentageCompleted);
          }}
          onDuration={(duration) => {
            setVideoDuration(duration);
          }}
          playIcon={
            <div className="relative">
              {/* <img
                src={"/assets/images/play-icon.svg"}
                className="h-[72px] w-[72px]"
              /> */}
            </div>
          }
          onEnded={() => {
            setVideoPlaying(false);
            setShowDefaultThumbnail(true);
          }}
        />
      </div>
    </div>
  );
};

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

const LearnVideoDetailContainer = (props) => {
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
        className={`fixed h-[auto] w-full z-10`}
        style={{
          background:
            "linear-gradient(180deg, #FFF 84.97%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      >
        <YouTubePlayer />
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white pb-[64px] overflow-auto hide-scroll-bar px-5`}
        style={{
          paddingTop: mainContainerHeight + "px",
        }}
      >
        <div className={`w-full h-auto inline-flex flex-col`}>
          <div className="w-full inline-flex items-start space-x-5 pt-[20px]">
            <div>
              <h2 className="text-pwip-black-600 text-[18px] font-[700]">
                Exploring Myanmar's Rice Market Rice Mills, Insights &
                Adventures
              </h2>
            </div>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M14.6608 3.76765C15.5775 3.87432 16.25 4.66515 16.25 5.58848V18.4993L10 15.3743L3.75 18.4993V5.58848C3.75 4.66515 4.42167 3.87432 5.33917 3.76765C8.43599 3.40818 11.564 3.40818 14.6608 3.76765Z"
                  fill="#3A72A8"
                  stroke="#005F81"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center justify-between w-full h-auto mt-2">
            <div className="inline-flex items-center space-x-3">
              <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md mr-[12px]">
                <span className="text-sm text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                  Rice
                </span>
              </div>

              <div className="inline-flex items-center flex-col w-full">
                <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
                  14.32 min
                </span>
              </div>
            </div>

            <div className="inline-flex items-center justify-center h-[24px] w-[24px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.15833 11.2577L12.85 14.5743M12.8417 5.42435L7.15833 8.74102M17.5 4.16602C17.5 5.54673 16.3807 6.66602 15 6.66602C13.6193 6.66602 12.5 5.54673 12.5 4.16602C12.5 2.7853 13.6193 1.66602 15 1.66602C16.3807 1.66602 17.5 2.7853 17.5 4.16602ZM7.5 9.99935C7.5 11.3801 6.38071 12.4993 5 12.4993C3.61929 12.4993 2.5 11.3801 2.5 9.99935C2.5 8.61864 3.61929 7.49935 5 7.49935C6.38071 7.49935 7.5 8.61864 7.5 9.99935ZM17.5 15.8327C17.5 17.2134 16.3807 18.3327 15 18.3327C13.6193 18.3327 12.5 17.2134 12.5 15.8327C12.5 14.452 13.6193 13.3327 15 13.3327C16.3807 13.3327 17.5 14.452 17.5 15.8327Z"
                  stroke="#686E6D"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center justify-between w-full py-3 my-[28px] border-t-[1px] border-t-pwip-gray-50 border-b-[1px] border-b-pwip-gray-50">
          <div className="inline-flex items-center space-x-3">
            <img
              src="/assets/images/logo-circle.png"
              className="h-[42px] w-[42px] object-contain"
            />
            <span className="text-pwip-black-600 text-base font-[700] font-sans line-clamp-1">
              PWIP
            </span>
          </div>

          <div className="w-auto">
            <button className="text-white text-sm font-[500] bg-[#C53A2E] inline-flex items-center justify-between rounded-[4px] border-none outline-none px-[8px] py-[6px] space-x-2">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.88477 4.33956C4.88477 3.55516 4.88477 3.16296 5.04832 2.94676C5.1908 2.75842 5.40857 2.64187 5.64432 2.62779C5.91493 2.61163 6.24126 2.82919 6.89392 3.2643L15.3873 8.92652C15.9265 9.28604 16.1962 9.46581 16.2901 9.69238C16.3723 9.89047 16.3723 10.1131 16.2901 10.3112C16.1962 10.5378 15.9265 10.7175 15.3873 11.077L6.89392 16.7393C6.24126 17.1744 5.91493 17.3919 5.64432 17.3758C5.40857 17.3617 5.1908 17.2452 5.04832 17.0568C4.88477 16.8406 4.88477 16.4484 4.88477 15.664V4.33956Z"
                  fill="#FBFCFF"
                />
              </svg>

              <span>View Channel</span>
            </button>
          </div>
        </div>

        <div className="w-full inline-flex h-auto flex-col space-y-[16px]">
          <div className="w-full">
            <h2 className="text-pwip-black-600 text-base font-[700]">About</h2>
          </div>

          <div className="w-full h-auto text-pwip-black-600 font-[400]">
            <p>
              🌾🌏 We visit rice mills, have insightful conversations with the
              amazing rice mill owner William, and get into the secrets of the
              Myanmar rice industry. 🚀💼 Don't miss the chance to gain valuable
              knowledge about this bustling market! Watch the full vlog and
              immerse yourself in the world of rice trade. Like, share, comment,
              and subscribe to stay updated with our rice import-export
              adventures! 📺🔔
            </p>
          </div>
        </div>

        <div className="w-full inline-flex h-auto flex-col mt-[24px]">
          <div className="w-full mb-3">
            <h2 className="text-pwip-black-600 text-base font-[700]">
              Also View
            </h2>
          </div>

          <div className="w-full h-full space-y-[24px]">
            {[1, 2, 3].map((d, i) => {
              return (
                <div
                  key={d * i + d}
                  className="inline-flex items-center w-full space-x-[15px] bg-white transition-all"
                  style={{
                    backgroundColor: "#ffffff",
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
      </div>
    </React.Fragment>
  );
};

export default LearnVideoDetailContainer;

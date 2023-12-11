import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { secondsToMinutes } from "@/utils/helper.js";

import {
  fetchLearnIDRequest,
  fetchLearnDetailRequest,
} from "@/redux/actions/learn.actions.js";

const YouTubePlayer = ({ url }) => {
  const router = useRouter();
  const videoRef = useRef();

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showDefaultThumbnail, setShowDefaultThumbnail] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgressInPercent, setVideoProgressInPercent] = useState(0);
  const [videoVolume, setVideoVolume] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  function handleOrientationChange() {
    if (screen.orientation && screen.orientation.lock) {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        // Lock to landscape when entering fullscreen
        screen.orientation.lock("landscape");
      } else {
        // Unlock orientation when exiting fullscreen
        screen.orientation.unlock();
      }
    }
  }

  useEffect(() => {
    // Add event listeners on mount
    document.addEventListener("fullscreenchange", handleOrientationChange);
    document.addEventListener("mozfullscreenchange", handleOrientationChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleOrientationChange
    );
    document.addEventListener("msfullscreenchange", handleOrientationChange);

    // Remove event listeners on unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleOrientationChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleOrientationChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleOrientationChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleOrientationChange
      );
    };
  }, []);

  return (
    <div
      className="relative bg-pwip-black-600"
      style={{ paddingBottom: "56.25%" }}
      id="videoPlayerEl"
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

            return null;
          }}
          className={`h-full w-full ${
            showPlayerCustomControls ? "bg-[#00000047]" : "bg-transparent"
          } absolute top-0 left-0 z-10`}
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

            <div
              onClick={() => {
                setShowPlayerCustomControls(!showPlayerCustomControls);
                clearTimeout(timeoutId);

                return null;
              }}
              className={`h-full w-full ${
                !showPlayerCustomControls
                  ? "absolute top-0 left-0 overflow-hidden z-20"
                  : ""
              }`}
            ></div>

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

              <button
                onClick={() => {
                  setIsFullScreen(!isFullScreen);

                  const videoPlayerEl =
                    document.getElementById("videoPlayerEl");

                  if (!isFullScreen) {
                    // Enter fullscreen
                    if (videoPlayerEl.requestFullscreen) {
                      videoPlayerEl.requestFullscreen();
                    } else if (videoPlayerEl.mozRequestFullScreen) {
                      // Firefox
                      videoPlayerEl.mozRequestFullScreen();
                    } else if (videoPlayerEl.webkitRequestFullscreen) {
                      // Chrome, Safari and Opera
                      videoPlayerEl.webkitRequestFullscreen();
                    } else if (videoPlayerEl.msRequestFullscreen) {
                      // IE/Edge
                      videoPlayerEl.msRequestFullscreen();
                    }
                  } else {
                    // Exit fullscreen
                    if (document.exitFullscreen) {
                      document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                      // Firefox
                      document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                      // Chrome, Safari and Opera
                      document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                      // IE/Edge
                      document.msExitFullscreen();
                    }
                  }

                  // if (videoPlayerEl && !isFullScreen) {
                  //   if (videoPlayerEl.requestFullscreen) {
                  //     videoPlayerEl.requestFullscreen();
                  //   } else if (videoPlayerEl.mozRequestFullScreen) {
                  //     // Firefox
                  //     videoPlayerEl.mozRequestFullScreen();
                  //   } else if (videoPlayerEl.webkitRequestFullscreen) {
                  //     // Chrome, Safari and Opera
                  //     videoPlayerEl.webkitRequestFullscreen();
                  //   } else if (videoPlayerEl.msRequestFullscreen) {
                  //     // IE/Edge
                  //     videoPlayerEl.msRequestFullscreen();
                  //   }
                  // }

                  // if (videoPlayerEl && isFullScreen) {
                  //   if (document.fullscreenElement) {
                  //     document.exitFullscreen();
                  //   } else if (document.mozFullScreenElement) {
                  //     // Firefox
                  //     document.mozCancelFullScreen();
                  //   } else if (document.webkitFullscreenElement) {
                  //     // Chrome, Safari and Opera
                  //     document.webkitExitFullscreen();
                  //   } else if (document.msFullscreenElement) {
                  //     // IE/Edge
                  //     document.msExitFullscreen();
                  //   }
                  // }
                }}
                className="inline-flex items-center justify-center border-none outline-none h-auto w-auto rounded-full"
              >
                {isFullScreen ? (
                  <img
                    src="/assets/images/fullscreen-off.svg"
                    className="h-[36px] w-[36px]"
                  />
                ) : (
                  <img
                    src="/assets/images/fullscreen-on.svg"
                    className="h-[36px] w-[36px]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <ReactPlayer
          ref={videoRef}
          url={url}
          loop={false}
          width="100%"
          height="100%"
          controls={false}
          light={false}
          playing={videoPlaying}
          stopOnUnmount={true}
          volume={videoVolume ? 0 : 1}
          onClickPreview={() => {
            return null;
          }}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload", // Disable download button
              },
            },
          }}
          onProgress={(progress) => {
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

const LearnVideoDetailContainer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const learnID = useSelector((state) => state.learnList.id) || [];
  const learnDetail = useSelector((state) => state.learnList.detail) || [];
  const learnListData = useSelector((state) => state.learnList.learnList) || [];
  const tagsData = useSelector((state) => state.tags.tags);

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [learnDetailData, setLearnDetailData] = React.useState(null);
  const [learnRecommendData, setLearnRecommendData] = React.useState([]);
  const [allTagsData, setAllTagsData] = React.useState([]);

  const handleShare = () => {
    if (navigator && navigator.share) {
      navigator
        .share({
          title: learnDetailData?.title,
          text: `Watch on youtube`,
          url: learnDetailData?.url,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  useEffect(() => {
    if (tagsData && tagsData.length) {
      setAllTagsData(tagsData);
    }
  }, [tagsData]);

  useEffect(() => {
    if (learnListData) {
      setLearnRecommendData(learnListData);
    }
  }, [learnListData]);

  useEffect(() => {
    if (learnDetail) {
      setLearnDetailData(learnDetail);
    }
  }, [learnDetail]);

  useEffect(() => {
    if (learnID) {
      dispatch(fetchLearnDetailRequest(learnID));
    }
  }, [learnID]);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, [learnID]);

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
        <YouTubePlayer url={learnDetailData?.url || ""} />
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white pb-[64px] overflow-auto hide-scroll-bar px-5`}
        style={{
          paddingTop: mainContainerHeight + "px",
        }}
      >
        <div className={`w-full h-auto inline-flex flex-col`}>
          <div className="w-full inline-flex items-start justify-between space-x-5 pt-[20px]">
            <div>
              <h2 className="text-pwip-black-600 text-[18px] font-[700]">
                {learnDetailData?.title || ""}
              </h2>
            </div>

            <div>
              {/* <svg
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
            </div>
          </div>
          <div className="inline-flex items-center justify-between w-full h-auto mt-2">
            <div className="inline-flex items-center space-x-3">
              <div className="inline-flex items-center space-x-3">
                {allTagsData.map((tag) => {
                  if (
                    learnDetailData?.tags?.length > 2 &&
                    learnDetailData?.tags.slice(0, 2)?.includes(tag?._id)
                  ) {
                    return (
                      <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                        <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                          {tag?.tagName || ""}
                        </span>
                      </div>
                    );
                  }

                  if (
                    learnDetailData?.tags?.length <= 2 &&
                    learnDetailData?.tags?.includes(tag?._id)
                  ) {
                    return (
                      <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                        <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                          {tag?.tagName || ""}
                        </span>
                      </div>
                    );
                  }

                  return null;
                })}

                {learnDetailData?.tags?.length > 2 ? (
                  <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                    <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                      + 1
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="inline-flex items-center flex-col w-full">
                <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
                  {learnDetailData?.duration_seconds
                    ? secondsToMinutes(learnDetailData?.duration_seconds)
                    : ""}{" "}
                  min
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                handleShare();
              }}
              className="inline-flex items-center justify-center h-[24px] w-[24px]"
            >
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
            <button
              onClick={() => {
                const urlToOpen = "https://www.youtube.com/@pwipindia";
                window.open(urlToOpen, "_blank");
              }}
              className="text-white text-sm font-[500] bg-[#C53A2E] inline-flex items-center justify-between rounded-[4px] border-none outline-none px-[8px] py-[6px] space-x-2"
            >
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
              {learnDetailData?.about
                ? learnDetailData?.about?.replace(/\n/g, "<br>")
                : "Not available"}
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
            {[...learnRecommendData]
              .filter((d) => d._id !== learnID)
              .map((items, index) => {
                let image =
                  "https://store-images.s-microsoft.com/image/apps.11879.13734281781052682.f6ae95d2-26ff-49d4-a8c8-440a26f9d100.6e86e456-aa0f-47e2-becd-b247e7862832?h=464";

                if (items?.title === "Qatar's Rice Export Trade Secret") {
                  image =
                    "/assets/images/learn/qatar-rice-export-trade-secret.png";
                }

                if (
                  items?.title === "ISO Certification for Rice Exporters Guide"
                ) {
                  image = "/assets/images/learn/iso-certification.png";
                }

                if (
                  items?.title ===
                  "How Many Types of Rice Can You Name? Unbelievable!"
                ) {
                  image = "/assets/images/learn/75-variety.png";
                }

                if (
                  items?.title ===
                  "Guide to 1121 Basmati Rice for Beginners | Everything You Need to Know"
                ) {
                  image = "/assets/images/learn/longest-grain.png";
                }

                if (
                  items?.title === "Double Boiled Rice: What You Need to Know"
                ) {
                  image = "/assets/images/learn/double-boiled.png";
                }

                if (
                  items?.title ===
                  "Exploring Myanmar's Rice Market: A Window to Export Growth!"
                ) {
                  image = "/assets/images/learn/myanmar-rice.png";
                }

                return (
                  <div
                    key={items._id + index}
                    className="inline-flex items-center w-full py-[5px] space-x-[15px] bg-white transition-all"
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                    onClick={async () => {
                      dispatch(fetchLearnIDRequest(items._id));
                    }}
                  >
                    <div className="h-[110px] min-w-[112px] w-[112px] rounded-lg relative">
                      <img
                        src={image}
                        className="bg-cover h-[110px] w-[112px] rounded-lg"
                      />
                    </div>
                    <div className="w-full h-[100px] inline-flex flex-col justify-between">
                      <div className="w-auto h-auto relative">
                        <div className="inline-flex items-center justify-between w-full">
                          <div className="inline-flex items-center space-x-2">
                            {allTagsData.map((tag) => {
                              if (
                                items?.tags?.length > 2 &&
                                items?.tags.slice(0, 2)?.includes(tag?._id)
                              ) {
                                return (
                                  <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                                    <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                                      {tag?.tagName || ""}
                                    </span>
                                  </div>
                                );
                              }

                              if (
                                items?.tags?.length <= 2 &&
                                items?.tags?.includes(tag?._id)
                              ) {
                                return (
                                  <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                                    <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                                      {tag?.tagName || ""}
                                    </span>
                                  </div>
                                );
                              }

                              return null;
                            })}

                            {items?.tags?.length > 2 ? (
                              <div className="inline-flex items-center justify-center py-[3px] px-[6px] bg-pwip-v2-gray-100 rounded-md">
                                <span className="text-[10px] text-center text-pwip-v2-primary-700 font-[400] whitespace-nowrap">
                                  + 1
                                </span>
                              </div>
                            ) : null}
                          </div>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6 text-pwip-v2-primary-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                            />
                          </svg>
                        </div>

                        <div className="inline-flex flex-col w-full mt-[6px] space-y-[6px]">
                          <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                            {items?.title || ""}
                          </span>
                          <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1">
                            By {items?.author || ""}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex flex-col w-full mt-[6px]">
                        <span className="text-pwip-black-600 text-xs font-[400] font-sans line-clamp-1">
                          {secondsToMinutes(items?.duration_seconds) || 0} min
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

/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useDispatch } from "react-redux";

import { hideToastNotificationFailure } from "@/redux/actions/toastOverlay.actions";
import { forexRateRequest } from "@/redux/actions/utils.actions";
import { forexRateSuccess } from "redux/actions/utils.actions";

const OverlayContext = createContext();

export function useOverlayContext() {
  return useContext(OverlayContext);
}

export function OverlayProvider({ children }) {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState(null);

  const [isSearchFilterModalOpen, setIsSearchFilterModalOpen] = useState(false);
  const [searchFilterChildren, setSearchFilterChildren] = useState(null);

  const [bottomSheetChildren, setBottomSheetChildren] = useState(null);

  const [autoHideToast, setAutoHideToast] = useState(true);
  const [toastPosition, setToastPosition] = useState("bottom");
  const [usdValue, setUSDValue] = useState(0);
  const [usdInputValue, setUSDInputValue] = useState(0);
  const [initialFocusRef, setInitialFocusRef] = useState(false);
  const [isDataCaptureEventAction, setIsDataCaptureEventAction] =
    useState(false);

  const openModal = (usdValue) => {
    if (usdValue) {
      setUSDValue(usdValue);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const openSearchFilterModal = (content) => {
    setIsSearchFilterModalOpen(true);

    setSearchFilterChildren(content);
  };

  const closeSearchFilterModal = () => setIsSearchFilterModalOpen(false);

  const openBottomSheet = async (
    content,
    handler,
    initialFocus,
    isEventAction
  ) => {
    setIsBottomSheetOpen(true);

    await setBottomSheetChildren(content);

    if (initialFocus) {
      setInitialFocusRef(true);
    } else {
      setInitialFocusRef(false);
    }

    if (isEventAction) {
      setIsDataCaptureEventAction(true);
    } else {
      setIsDataCaptureEventAction(false);
    }

    if (handler) {
      handler();
    }
  };
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const openToastMessage = (contentObj, position) => {
    setShowToast(true);

    if (position) {
      setToastPosition(position);
    }

    if (contentObj?.autoHide === true || contentObj?.autoHide === false) {
      setAutoHideToast(contentObj?.autoHide);
    }

    setToastContent(contentObj);
  };
  const closeToastMessage = () => {
    dispatch(hideToastNotificationFailure());
    setShowToast(false);
    setToastContent(null);
  };

  useEffect(() => {
    if (showToast && autoHideToast) {
      setTimeout(() => {
        closeToastMessage();
      }, 3000);
    }
  }, [showToast, autoHideToast]);

  const value = {
    isModalOpen,
    openModal,
    closeModal,

    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,

    isLoading,
    startLoading,
    stopLoading,

    showToast,
    openToastMessage,
    closeToastMessage,

    isSearchFilterModalOpen,
    openSearchFilterModal,
    closeSearchFilterModal,
  };

  const bottomSheet = (
    <div className="inline-flex items-center justify-center fixed top-0 left-0 h-screen w-screen z-0">
      <BottomSheet
        open={isBottomSheetOpen}
        onDismiss={() => {
          if (!isDataCaptureEventAction) {
            closeBottomSheet();
          }
        }}
        snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight - 72]}
        defaultSnap={({ lastSnap, snapPoints }) => {
          if (initialFocusRef) {
            return lastSnap ?? Math.max(...snapPoints);
          }
        }}
        initialFocusRef={false}
      >
        <div className="w-full h-auto pb-8">{bottomSheetChildren}</div>
      </BottomSheet>
    </div>
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}
      {isLoading && (
        <div
          className={`h-screen w-screen bg-black fixed top-0 left-0 overflow-hidden z-[2000] bg-opacity-60 inline-flex justify-center items-center`}
        >
          <div className="inline-flex flex-col justify-center items-center space-y-3 text-pwip-primary-50">
            <svg
              aria-hidden="true"
              className="w-5 h-5 animate-spin fill-pwip-primary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#24A3D0"
              />
            </svg>
            <span className="text-center font-sans text-xs">
              Hold on! getting things <br />
              ready for you.
            </span>
          </div>
        </div>
      )}
      {isBottomSheetOpen ? bottomSheet : null}
      {showToast && (
        <div
          className={`w-full h-auto left-0 ${
            toastPosition === "top" ? "top-[32px]" : "bottom-[82px]"
          } fixed inline-flex items-center justify-center z-[1000] px-6`}
        >
          <div
            id="toast-danger"
            className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div
              className={`
              inline-flex 
              items-center 
              justify-center 
              flex-shrink-0 
              w-8 
              h-8 
              ${
                toastContent?.type === "loading"
                  ? "text-blue-200 bg-blue-800"
                  : toastContent?.type === "success"
                  ? "text-green-200 bg-green-800"
                  : toastContent?.type === "info"
                  ? "text-yellow-200 bg-yellow-800"
                  : "text-red-500 bg-red-100"
              }
              rounded-lg`}
            >
              {toastContent?.type === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {toastContent?.type === "error" && (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                </svg>
              )}

              {toastContent?.type === "loading" && (
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 animate-spin fill-pwip-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1d40b0"
                  />
                </svg>
              )}

              {toastContent?.type === "info" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              )}
              <span className="sr-only">{toastContent?.type} icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">
              {toastContent?.message || "Something went wrong"}.
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              datadismisstarget="#toast-danger"
              aria-label="Close"
              onClick={() => closeToastMessage()}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="h-screen w-screen bg-black fixed top-0 left-0 overflow-hidden z-50 bg-opacity-60 inline-flex justify-center items-center">
          <div className="w-[90%] px-6 py-5 bg-white rounded-lg relative top-[-12%]">
            <div className="inline-flex items-center justify-between w-full">
              <div className="inline-flex items-center text-sm space-x-3 text-pwip-gray-800">
                <span className="font-sans font-medium">
                  Change forex conversion
                </span>
              </div>

              <button
                onClick={() => closeModal()}
                className="outline-none bg-transparent border-none text-pwip-gray-800 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="inline-flex items-center w-full py-4">
              <div className="inline-flex items-center w-full">
                <div className="border-[1px] rounded-l-md py-2 px-4 h-[36px] w-auto inline-flex items-center">
                  <span className="text-pwip-gray-1000 text-sm whitespace-nowrap">
                    1 USD
                  </span>
                </div>
                <div className="border-[1px] border-l-[0px] rounded-r-md py-2 px-4 h-[36px] w-full max-w-[76%] relative inline-flex items-center justify-between">
                  <input
                    defaultValue={usdValue}
                    onChange={(e) => {
                      e.preventDefault();
                      setUSDInputValue(parseFloat(e.target.value || 0));
                    }}
                    className="outline-none h-full w-full"
                  />

                  <div className="w-auto h-auto">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.75 13.5001L14.9999 14.3206C14.6021 14.7556 14.0626 15.0001 13.5001 15.0001C12.9376 15.0001 12.3981 14.7556 12.0003 14.3206C11.6019 13.8864 11.0625 13.6426 10.5001 13.6426C9.93778 13.6426 9.39835 13.8864 8.99998 14.3206M2.25 15H3.50591C3.87279 15 4.05624 15 4.22887 14.9586C4.38192 14.9219 4.52824 14.8613 4.66245 14.779C4.81382 14.6862 4.94354 14.5565 5.20296 14.2971L14.625 4.87505C15.2463 4.25373 15.2463 3.24637 14.625 2.62505C14.0037 2.00373 12.9963 2.00373 12.375 2.62505L2.95295 12.0471C2.69352 12.3065 2.5638 12.4362 2.47104 12.5876C2.3888 12.7218 2.32819 12.8681 2.29145 13.0212C2.25 13.1938 2.25 13.3773 2.25 13.7442V15Z"
                        stroke="#4F5655"
                        strokeWidth="1.58333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center w-full mt-4">
              <div className="inline-flex items-center justify-center w-full space-x-5">
                <button
                  onClick={() => {
                    dispatch(forexRateRequest());
                    closeModal();
                  }}
                  className="bg-pwip-primary border-[1px] border-pwip-primary w-full py-2 rounded-md text-white text-center text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    dispatch(
                      forexRateSuccess({
                        INR: usdInputValue,
                      })
                    );
                    closeModal();
                  }}
                  className="border-[1px] border-pwip-primary w-full py-2 rounded-md text-pwip-primary text-center text-xs"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearchFilterModalOpen && (
        <div className="h-screen w-screen bg-white fixed top-0 left-0 z-50 inline-flex justify-center items-center">
          {searchFilterChildren}
        </div>
      )}
    </OverlayContext.Provider>
  );
}

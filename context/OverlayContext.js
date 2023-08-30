import React, { createContext, useContext, useState, useEffect } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { useDispatch } from "react-redux";

import { hideToastNotificationFailure } from "@/redux/actions/toastOverlay.actions";

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

  const [bottomSheetChildren, setBottomSheetChildren] = useState(null);
  const [autoHideToast, setAutoHideToast] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openBottomSheet = (content) => {
    setIsBottomSheetOpen(true);
    setBottomSheetChildren(content);
  };
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const openToastMessage = (contentObj) => {
    setShowToast(true);
    if (contentObj?.autoHide) {
      setAutoHideToast(false);
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
  };

  const bottomSheet = (
    <div className="inline-flex items-center justify-center fixed top-0 left-0 h-screen w-screen z-0">
      <BottomSheet
        open={isBottomSheetOpen}
        onDismiss={closeBottomSheet}
        snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight - 72]}
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
          className={`h-screen w-screen bg-black fixed top-0 left-0 overflow-hidden z-50 bg-opacity-60 inline-flex justify-center items-center`}
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
        <div className="w-full h-auto left-0 bottom-[82px] fixed inline-flex items-center justify-center !z-[99] px-6">
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
                  : "text-red-500 bg-red-100"
              }
              rounded-lg`}
            >
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
      {/* <div className="h-screen w-screen bg-black fixed top-0 left-0 overflow-hidden z-50 bg-opacity-60 inline-flex justify-center items-center">
        
      </div> */}
    </OverlayContext.Provider>
  );
}

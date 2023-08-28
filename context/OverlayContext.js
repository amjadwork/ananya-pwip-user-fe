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
    setToastContent(contentObj);
  };
  const closeToastMessage = () => {
    dispatch(hideToastNotificationFailure());
    setShowToast(false);
    setToastContent(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        closeToastMessage();
      }, 3000);
    }
  }, [showToast]);

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
        <div className="inline-flex items-center justify-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-25 z-10">
          {/*  */}
        </div>
      )}

      {isBottomSheetOpen ? bottomSheet : null}

      {showToast && (
        <div className="w-full h-auto left-0 bottom-[88px] fixed inline-flex items-center justify-center z-40 px-6">
          <div
            id="toast-danger"
            className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span className="sr-only">Error icon</span>
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
    </OverlayContext.Provider>
  );
}

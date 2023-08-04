import React, { createContext, useContext, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

const OverlayContext = createContext();

export function useOverlayContext() {
  return useContext(OverlayContext);
}

export function OverlayProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
  };

  const bottomSheet = (
    <div
      onClick={closeBottomSheet}
      className="inline-flex items-center justify-center fixed top-0 left-0 h-screen w-screen z-0"
    >
      <BottomSheet
        open={isBottomSheetOpen}
        onDismiss={closeBottomSheet}
        snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight - 72]}
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
    </OverlayContext.Provider>
  );
}

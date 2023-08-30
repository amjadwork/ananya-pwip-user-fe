import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useOverlayContext } from "@/context/OverlayContext";
import { useDispatch, useSelector } from "react-redux";

import { BottomNavBar } from "@/components/BottomNavBar";

import { setTermsOfShipmentRequest } from "@/redux/actions/shipmentTerms.actions";
import { forexRateRequest } from "@/redux/actions/utils.actions";

const hideBottomBarAtRoutes = ["costing", "edit"];

const AppLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const shipmentTerms = useSelector((state) => state.shipmentTerm);
  const toastOverlay = useSelector((state) => state.toastOverlay);
  const showLoader = useSelector((state) => state.utils.showLoader);

  const { openToastMessage, startLoading, stopLoading } = useOverlayContext();

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (showLoader) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [showLoader]);

  React.useEffect(() => {
    if (router) {
      const splitedRoutes = router.route.split("/");

      setActiveRoute(splitedRoutes[splitedRoutes.length - 1]);
    }
  }, []);

  React.useEffect(() => {
    if (toastOverlay) {
      const { showToastNotification, toastContent } = toastOverlay;

      if (showToastNotification) {
        openToastMessage({
          type: "error",
          message: toastContent?.message || "Something went wrong",
        });
      }
    }
  }, [toastOverlay]);

  React.useEffect(() => {
    dispatch(
      forexRateRequest({
        usd: 82,
      })
    );
  }, []);

  return (
    <React.Fragment>
      <Head>{/* Common head content */}</Head>
      <div className="h-full flex flex-col hide-scroll-bar">
        <main
          className={`flex-grow ${
            hideBottomBarAtRoutes.includes(activeRoute)
              ? "min-h-screen"
              : "min-h-[calc(100vh-88px)]"
          }  hide-scroll-bar`}
        >
          {children}
        </main>
        {!hideBottomBarAtRoutes.includes(activeRoute) ? <BottomNavBar /> : null}

        {shipmentTerms?.shipmentTerm?.showShipmentTermDropdown ? (
          <div
            id="dropdown"
            className="z-[1000] fixed top-14 right-5 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44"
          >
            <ul
              className="py-2 text-sm font-sans font-medium text-gray-700"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const action = {
                      selected: "FOB",
                      showShipmentTermDropdown: false,
                    };
                    dispatch(setTermsOfShipmentRequest(action));
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  FOB
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const action = {
                      selected: "CIF",
                      showShipmentTermDropdown: false,
                    };
                    dispatch(setTermsOfShipmentRequest(action));
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  CIF
                </button>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default AppLayout;

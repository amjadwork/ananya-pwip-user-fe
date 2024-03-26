import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useOverlayContext } from "@/context/OverlayContext";
import { useDispatch, useSelector } from "react-redux";

import { BottomNavBar } from "@/components/BottomNavBar";

import { setTermsOfShipmentRequest } from "@/redux/actions/shipmentTerms.actions";
import { forexRateRequest } from "@/redux/actions/utils.actions";
import { Button } from "@/components/Button";

const hideBottomBarAtRoutes = [
  "costing",
  "edit",
  "detail",
  "lp",
  "rice-price",
  "export-costing",
];

const AppLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const shipmentTerms = useSelector((state) => state.shipmentTerm);
  const toastOverlay = useSelector((state) => state.toastOverlay);
  const showLoader = useSelector((state) => state.utils.showLoader);
  const forexRate = useSelector((state) => state.utils.forexRate);

  const { openToastMessage, startLoading, stopLoading } = useOverlayContext();

  const [activeRoute, setActiveRoute] = React.useState("");
  const [lastScrollTop, setLastScrollTop] = React.useState(0);
  const [scrollDirection, setScrollDirection] = React.useState("up");

  // const [deferredPrompt, setDeferredPrompt] = React.useState(null);

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
        usd: forexRate && forexRate?.USD ? forexRate?.USD : 82,
      })
    );
  }, []);

  // Debounce function to limit the rate of execution
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to handle the scroll event with debounce
  const handleScroll = debounce(() => {
    // Get the current scroll position
    const currentScrollTop =
      window.scrollY || document.documentElement.scrollTop;

    // Compare with the previous scroll position
    if (currentScrollTop > lastScrollTop) {
      if (scrollDirection !== "down") {
        setScrollDirection("down");
      }
    } else if (currentScrollTop < lastScrollTop) {
      if (scrollDirection !== "up") {
        setScrollDirection("up");
      }
    }

    // Update the last scroll position
    setLastScrollTop(currentScrollTop);
  }, 10); // Adjust the delay as needed // Adjust the delay as needed

  React.useEffect(() => {
    // Attach the debounced scroll event listener
    if (handleScroll) window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, lastScrollTop]); // Dependency array to ensure the effect runs only when lastScrollTop changes

  // React.useEffect(() => {
  //   const handleBeforeInstallPrompt = (event) => {
  //     event.preventDefault();
  //     setDeferredPrompt(event);
  //   };

  //   window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  //   return () => {
  //     window.removeEventListener(
  //       "beforeinstallprompt",
  //       handleBeforeInstallPrompt
  //     );
  //   };
  // }, []);

  // const handleInstallClick = () => {
  //   if (deferredPrompt) {
  //     deferredPrompt.prompt();
  //     deferredPrompt.userChoice.then((choiceResult) => {
  //       if (choiceResult.outcome === "accepted") {
  //         console.log("User accepted the A2HS prompt");
  //       } else {
  //         console.log("User dismissed the A2HS prompt");
  //       }
  //       setDeferredPrompt(null);
  //     });
  //   }
  // };

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

        {/* {deferredPrompt && (
          <div className="fixed bottom-[64px] z-[1000] w-full px-5 py-3 bg-pwip-v2-primary-700 inline-flex items-center space-x-2">
            <div className="w-full">
              <span className="text-sm text-white font-sans font-[500]">
                Install the pwip app now for best experience
              </span>
            </div>
            <div className="inline-flex w-full">
              <Button
                type="white"
                label="Install now"
                onClick={handleInstallClick}
                minHeight="min-h-[34px] max-h-[32px]"
              />
            </div>
          </div>
        )} */}

        {!hideBottomBarAtRoutes.includes(activeRoute) && !router?.query?.id ? (
          <BottomNavBar
            scrollDirection={scrollDirection}
            lastScrollTop={lastScrollTop}
          />
        ) : null}

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

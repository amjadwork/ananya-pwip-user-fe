import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { chevronDown, arrowLeftBackIcon } from "../../theme/icon";
// import {
//   fetchMyCostingFailure,
//   saveCostingFailure,
// } from "@/redux/actions/myCosting.actions";

const hideBottomBarAtRoutes = ["costing", "edit"];

export function Header(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  // const backgroundColor = props.backgroundColor || "bg-[#2475c0]";
  // const component = props.component;
  const hideLogo = props.hideLogo || false;

  const [activeRoute, setActiveRoute] = React.useState("");
  const [environmentBasedClasses, setEnvironmentBasedClasses] =
    React.useState("");

  const handleBack = () => {
    // if (activeRoute === "edit") {
    //   dispatch(fetchMyCostingFailure());
    // }

    // if (activeRoute === "costing") {
    //   dispatch(saveCostingFailure());
    // }
    router.back();
  };

  React.useEffect(() => {
    if (router) {
      const splitedRoutes = router.route.split("/");

      setActiveRoute(splitedRoutes[splitedRoutes.length - 1]);
    }
  }, []);

  React.useEffect(() => {
    const isInStandaloneMode = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    if (isInStandaloneMode()) {
      setEnvironmentBasedClasses("h-[130px]");
    } else {
      setEnvironmentBasedClasses("h-[92px]");
    }
  }, []);

  return (
    <header
      className={`inline-flex items-center w-full ${environmentBasedClasses} px-5 py-4 ${
        hideBottomBarAtRoutes.includes(activeRoute) ? "" : "pb-[28px]"
      }  space-x-4 bg-pwip-primary fixed top-0 z-10`}
    >
      <div className="inline-flex items-center justify-between w-full h-auto">
        <div className="inline-flex items-center">
          {!hideLogo && !hideBottomBarAtRoutes.includes(activeRoute) && (
            <img src="/assets/images/logo-white.png" className="h-full" />
          )}

          {hideBottomBarAtRoutes.includes(activeRoute) && (
            <div
              className="inline-flex items-center space-x-2 text-white"
              onClick={() => handleBack()}
            >
              {arrowLeftBackIcon}
              <span className="text-sm font-bold font-sans">Back</span>
            </div>
          )}
        </div>
        <div
          // onClick={() => (handleBack ? handleBack() : router.back())}
          className="inline-flex items-center justify-center space-x-3 text-white text-sm"
        >
          <span className="font-sans">1 USD = 81 INR | FOB</span>
          {chevronDown}
        </div>
      </div>
    </header>
  );
}

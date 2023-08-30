import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";

import { chevronDown, arrowLeftBackIcon } from "../../theme/icon";
import {
  setTermsOfShipmentRequest,
  // setTermsOfShipmentFailure,
} from "@/redux/actions/shipmentTerms.actions";

const atRoutes = ["costing", "edit", "my-costing", "more"];

export function Header(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openModal } = useOverlayContext();

  const shipmentTerms = useSelector((state) => state.shipmentTerm);
  const forexRate = useSelector((state) => state.utils.forexRate);
  // const backgroundColor = props.backgroundColor || "bg-[#2475c0]";
  // const component = props.component;
  const hideLogo = props.hideLogo || false;

  const [activeRoute, setActiveRoute] = React.useState("");
  const [environmentBasedClasses, setEnvironmentBasedClasses] =
    React.useState("");

  const handleBack = () => {
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
    const route = ["costing", "edit", "my-costing", "more"];

    if (isInStandaloneMode()) {
      if (route.includes(activeRoute)) {
        setEnvironmentBasedClasses("h-[130px]");
      } else {
        setEnvironmentBasedClasses("h-[140px]");
      }
    } else {
      if (route.includes(activeRoute)) {
        setEnvironmentBasedClasses("h-[72px]");
      } else {
        setEnvironmentBasedClasses("h-[92px]");
      }
    }
  }, [activeRoute]);

  return (
    <header
      className={`inline-flex items-center w-full ${environmentBasedClasses} px-5 py-4 ${
        atRoutes.includes(activeRoute) ? "" : "pb-[28px]"
      }  space-x-4 bg-pwip-primary fixed top-0 z-10`}
    >
      <div className="inline-flex items-center justify-between w-full h-auto">
        <div className="inline-flex items-center">
          {!hideLogo && !atRoutes.includes(activeRoute) && (
            <img src="/assets/images/logo-white.png" className="h-full" />
          )}

          {atRoutes.includes(activeRoute) && (
            <div
              className="inline-flex items-center space-x-2 text-white"
              onClick={() => handleBack()}
            >
              {arrowLeftBackIcon}
              <span className="text-sm font-bold font-sans">Back</span>
            </div>
          )}
        </div>
        <div className="text-white inline-flex items-center justify-center">
          <div className="h-full w-auto font-sans text-white text-sm inline-flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                openModal(forexRate?.USD || 0);
              }}
              className="h-full min-w-[50.15px] w-auto outline-none bg-transparent border-none"
            >
              <span>1 USD = {forexRate?.USD} INR</span>
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => {
                const action = {
                  ...shipmentTerms?.shipmentTerm,
                  showShipmentTermDropdown:
                    !shipmentTerms?.shipmentTerm?.showShipmentTermDropdown,
                };
                dispatch(setTermsOfShipmentRequest(action));
              }}
              className="h-full min-w-[50.15px] w-auto outline-none bg-transparent border-none inline-flex items-center justify-between"
            >
              <span>{shipmentTerms?.shipmentTerm?.selected}</span>

              {chevronDown}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

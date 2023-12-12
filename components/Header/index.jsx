import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import { resetCostingSelection } from "@/redux/actions/costing.actions";

import {
  // chevronDown,
  arrowLeftBackIcon,
  pencilIcon,
  // editIcon,
} from "../../theme/icon";
// import {
//   setTermsOfShipmentRequest,
//   // setTermsOfShipmentFailure,
// } from "@/redux/actions/shipmentTerms.actions";
import { resetCustomCostingSelection } from "@/redux/actions/costing.actions";
import { searchScreenFailure } from "@/redux/actions/utils.actions.js";
import {
  // fetchCategoryRequest,
  fetchCategoryFailure,
} from "@/redux/actions/category.actions";

const atRoutes = [
  "select-pod",
  "costing",
  "edit",
  // "my-costing",
  "subscriptions",
  "profile-edit",
  "category",
];

export function Header(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openModal, openToastMessage } = useOverlayContext();

  const shipmentTerms = useSelector((state) => state.shipmentTerm);
  const forexRate = useSelector((state) => state.utils.forexRate);
  const searchScreenActive = useSelector(
    (state) => state.utils.searchScreenActive
  );

  const hideLogo = props.hideLogo || false;
  const showLogoForPreview = props.showLogoForPreview || false;

  const hideBack = props.hideBack || false;
  const handleClickEdit = props.handleClickEdit || null;
  const backgroundColor = props.backgroundColor || "bg-white";

  const [activeRoute, setActiveRoute] = React.useState("");
  // const [environmentBasedclassNamees, setEnvironmentBasedclassNamees] =
  //   React.useState("");

  const handleBack = () => {
    if (activeRoute === "edit") {
      dispatch(resetCustomCostingSelection());
    }

    router.back();
  };

  React.useEffect(() => {
    if (router) {
      const splitedRoutes = router.route.split("/");

      setActiveRoute(splitedRoutes[splitedRoutes.length - 1]);
    }
  }, []);

  // React.useEffect(() => {
  //   const isInStandaloneMode = () =>
  //     window.matchMedia("(display-mode: standalone)").matches ||
  //     window.navigator.standalone;
  //   const route = ["costing", "edit", "my-costing", "more", "profile-edit"];

  //   if (isInStandaloneMode()) {
  //     if (route.includes(activeRoute)) {
  //       setEnvironmentBasedclassNamees("h-[130px]");
  //     } else {
  //       setEnvironmentBasedclassNamees("h-[140px]");
  //     }
  //   } else {
  //     if (route.includes(activeRoute)) {
  //       setEnvironmentBasedclassNamees("h-[56px]");
  //     } else {
  //       setEnvironmentBasedclassNamees("h-[56px]");
  //     }
  //   }
  // }, [activeRoute]);

  return (
    <header
      className={`inline-flex items-center w-full h-[56px] px-5 py-4 space-x-4 ${backgroundColor} fixed top-0 z-10`}
    >
      <div className="inline-flex items-center justify-between w-full h-auto">
        <div className="inline-flex items-center">
          {((!hideLogo &&
            !atRoutes.includes(activeRoute) &&
            !searchScreenActive) ||
            showLogoForPreview) && (
            <img
              src="/assets/images/logo-blue.png"
              className="h-full w-[40px]"
            />
          )}

          {(atRoutes.includes(activeRoute) || searchScreenActive) &&
            !hideBack && (
              <div
                className="inline-flex items-center space-x-2 text-pwip-black-600 text-sm"
                onClick={() => {
                  if (!searchScreenActive) {
                    handleBack();
                  }

                  if (activeRoute === "category") {
                    dispatch(fetchCategoryFailure());
                  }

                  if (searchScreenActive) {
                    dispatch(searchScreenFailure());
                  }

                  if (activeRoute === "select-pod" && !searchScreenActive) {
                    dispatch(resetCostingSelection());
                  }
                }}
              >
                {arrowLeftBackIcon}
                <span>Back</span>
              </div>
            )}
        </div>
        <div className="text-pwip-black-600 inline-flex items-center justify-center">
          {(["more", "costing"].includes(activeRoute) || router?.query?.id) && (
            <div
              className="h-full min-w-[50.15px] w-auto outline-none bg-transparent border-none inline-flex items-center justify-between space-x-2 text-sm"
              onClick={async () => {
                if (router?.query?.id) {
                  openToastMessage({
                    type: "info",
                    message: "You need to login",
                    // autoHide: false,
                  });
                }

                if (activeRoute === "costing" && !router?.query?.id) {
                  await dispatch(resetCustomCostingSelection());

                  router.push("/export-costing/costing/edit");
                }

                if (activeRoute === "more") {
                  router.push("/more/profile-edit");
                }
              }}
            >
              <span>Edit</span>
              {pencilIcon}
            </div>
          )}

          {!["profile-edit", "more", "costing"].includes(activeRoute) &&
            !router?.query?.id && (
              <div className="h-full w-auto font-sans text-pwip-black-600 text-sm inline-flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    openModal(forexRate?.USD || 0);
                  }}
                  className="h-full min-w-[50.15px] w-auto outline-none bg-transparent border-none inline-flex items-center justify-between space-x-2"
                >
                  <span>USD = ₹{forexRate?.USD}</span>
                  {pencilIcon}
                </button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}

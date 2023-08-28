import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useOverlayContext } from "@/context/OverlayContext";
import { useSelector } from "react-redux";

import { BottomNavBar } from "@/components/BottomNavBar";

const hideBottomBarAtRoutes = ["costing", "edit"];

const AppLayout = ({ children }) => {
  const router = useRouter();
  const toastOverlay = useSelector((state) => state.toastOverlay);

  const { openToastMessage } = useOverlayContext();

  const [activeRoute, setActiveRoute] = React.useState("");

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

  return (
    <React.Fragment>
      <Head>{/* Common head content */}</Head>
      <div className="h-full flex flex-col bg-pwip-primary hide-scroll-bar">
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
      </div>
    </React.Fragment>
  );
};

export default AppLayout;

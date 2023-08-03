import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { BottomNavBar } from "@/components/BottomNavBar";

const hideBottomBarAtRoutes = ["costing"];

const AppLayout = ({ children }) => {
  const router = useRouter();

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (router) {
      const splitedRoutes = router.route.split("/");

      setActiveRoute(splitedRoutes[splitedRoutes.length - 1]);
    }
  }, []);

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

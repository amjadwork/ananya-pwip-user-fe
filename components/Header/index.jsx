import React from "react";
import { useRouter } from "next/router";
import { chevronDown } from "../../theme/icon";

const hideBottomBarAtRoutes = ["costing"];

export function Header(props) {
  const router = useRouter();

  // const backgroundColor = props.backgroundColor || "bg-[#2475c0]";
  // const component = props.component;
  const hideLogo = props.hideLogo || false;
  // const handleBack = props.handleBack;

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (router) {
      const splitedRoutes = router.route.split("/");

      setActiveRoute(splitedRoutes[splitedRoutes.length - 1]);
    }
  }, []);

  return (
    <header
      className={`inline-flex items-center w-full h-[92px] px-5 py-4 ${
        hideBottomBarAtRoutes.includes(activeRoute) ? "" : "pb-[28px]"
      }  space-x-4 bg-pwip-primary fixed top-0`}
    >
      <div className="inline-flex items-center justify-between w-full h-auto">
        {!hideLogo && (
          <img src="/assets/images/logo-white.png" className="h-full" />
        )}
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

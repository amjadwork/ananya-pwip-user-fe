import React from "react";
import { useRouter } from "next/router";
import {
  exportCostingBottomBarIcon,
  learnBottomBarIcon,
  dashboardBottomBarIcon,
  myCostingBottomBarIcon,
} from "../../theme/icon";

const options = [
  {
    icon: exportCostingBottomBarIcon,
    label: "Costing",
    path: "export-costing",
  },
  {
    icon: learnBottomBarIcon,
    label: "Learn",
    path: "learn",
  },
  {
    icon: dashboardBottomBarIcon,
    label: "Dashboard",
    path: "dashboard",
  },
  {
    icon: myCostingBottomBarIcon,
    label: "My Costing",
    path: "my-costing",
  },
];

export function BottomNavBar(props) {
  const router = useRouter();

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (router) setActiveRoute(router.route.split("/")[1]);
  }, []);

  return (
    <nav
      className={`inline-flex items-center w-full p-3 bg-pwip-white-100 h-[88px] fixed bottom-0`}
      style={{
        boxShadow: "12px -3px 29px 17px rgba(0, 0, 0, 0.08)",
      }}
    >
      {options.map((opt, index) => {
        return (
          <div
            key={opt.label + index}
            onClick={() => {
              router.push("/" + opt.path);
            }}
            className={`${
              activeRoute === opt.path
                ? "text-pwip-primary"
                : "text-pwip-gray-550"
            } inline-flex flex-col items-center justify-center h-full w-[calc(100%/4)] space-y-[6px]`}
          >
            <div className="inline-flex items-center justify-center">
              {opt.icon}
            </div>
            <span className="text-sm font-medium font-sans">{opt.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

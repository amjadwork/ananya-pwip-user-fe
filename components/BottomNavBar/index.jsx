import React from "react";
import { useRouter } from "next/router";

import { options } from "@/constants/bottombarOptions";

export function BottomNavBar({ scrollDirection = "up", lastScrollTop }) {
  const router = useRouter();

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (router) setActiveRoute(router.route.split("/")[1]);
  }, []);

  return (
    <nav
      className={`fixed bottom-0 left-0 z-50 w-full h-16 bg-white transition-all ${
        scrollDirection === "up" || lastScrollTop < 2
          ? "translate-y-0"
          : "translate-y-16"
      }`}
      style={{
        boxShadow: "12px -3px 29px 17px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="grid h-full w-full grid-cols-5 mx-auto font-medium px-0">
        {options.map((opt, index) => {
          return (
            <button
              key={opt.label + index}
              type="button"
              onClick={() => {
                router.push("/" + opt.path);
              }}
              className={`${
                activeRoute === opt.path
                  ? "text-pwip-v2-primary-500"
                  : "text-pwip-v2-gray-400"
              } inline-flex flex-col items-center justify-center hover:bg-white-100 dark:hover:bg-white-100 group space-y-[6px]`}
            >
              {opt.icon}
              <span className="text-xs font-medium font-sans whitespace-nowrap">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

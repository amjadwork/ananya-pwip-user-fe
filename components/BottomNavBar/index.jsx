import React from "react";
import { useRouter } from "next/router";

import { options } from "@/constants/bottombarOptions";

export function BottomNavBar() {
  const router = useRouter();

  const [activeRoute, setActiveRoute] = React.useState("");

  React.useEffect(() => {
    if (router) setActiveRoute(router.route.split("/")[1]);
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white"
      style={{
        boxShadow: "12px -3px 29px 17px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
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
                  ? "text-pwip-primary"
                  : "text-pwip-gray-550"
              } inline-flex flex-col items-center justify-center px-5 hover:bg-white-100 dark:hover:bg-white-100 group space-y-[6px]`}
            >
              {opt.icon}
              <span className="text-xs font-medium font-sans">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

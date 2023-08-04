import React from "react";
import { useRouter } from "next/router";

const SelectVariantContainer = (props) => {
  const router = useRouter();

  const { roundedTop = false, noTop = false, noPaddingBottom = false } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  return (
    <React.Fragment>
      <div
        id="fixedMenuSection"
        className={`${roundedTop ? "rounded-t-3xl" : ""} fixed ${
          !noTop ? "top-[72px]" : "top-[18px]"
        }  h-[auto] w-full bg-white z-10 py-6 px-5`}
      >
        <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
          Select Your Choice of Rice
        </h2>
        <input
          placeholder="Ex: Sona Masuri"
          className="h-[48px] mt-[10px] w-full rounded-md bg-pwip-primary-100 px-[18px] text-base font-sans"
        />
      </div>

      <div
        className={`min-h-screen h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[98px]" : "pb-0"
        } overflow-auto px-5 hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 42 + "px",
        }}
      >
        <h2
          className={`${
            noTop ? "mt-0" : "mt-8"
          } mb-5 text-pwip-gray-800 font-sans text-sm font-bold`}
        >
          Popular choices
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((items, index) => {
            return (
              <div
                key={items + index}
                onClick={() => {
                  router.push("/export-costing/select-pod");
                }}
                className="h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <img
                  src="https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                  className="bg-cover h-[80px] w-full rounded-md"
                />
                <div className="p-3 flex w-fill flex-col space-y-[4px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                    ₹32/Kg
                  </span>
                  <span className="text-pwip-gray-600 text-xs font-bold font-sans line-clamp-1">
                    Red matt rice
                  </span>

                  <div className="inline-flex items-center justify-between">
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      5% Broken
                    </span>
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      Salem, TN
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-auto inline-flex flex-col mt-5 space-y-[10px]">
          {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item, index) => {
            return (
              <div
                key={item + index}
                onClick={() => {
                  router.push("/export-costing/select-pod");
                }}
                className="inline-flex items-center w-full p-[5px] space-x-[10px] bg-white rounded-sm border-b-[1px] border-b-pwip-gray-50"
              >
                <img
                  src="https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                  className="bg-cover h-[46px] w-[46px] rounded-sm"
                />
                <div className="w-full inline-flex flex-col space-y-2">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                      Red matt rice
                    </span>
                    <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                      ₹32/Kg
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      Salem, TN
                    </span>
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      5% Broken
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SelectVariantContainer;

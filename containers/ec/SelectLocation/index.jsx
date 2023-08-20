import React from "react";
import { useRouter } from "next/router";
import { dummyRemoveMeCityIcon, pencilIcon } from "../../../theme/icon";

const SelectLocationContainer = (props) => {
  const router = useRouter();

  const {
    roundedTop = false,
    noTop = false,
    noPaddingBottom = false,
    title = "",
    showSelectedVariant = false,
  } = props;

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
        {showSelectedVariant && (
          <div
            onClick={() => {
              router.back();
            }}
            className="inline-flex items-center w-full p-[8px] space-x-[10px] bg-pwip-primary-40 rounded-[5px] border-[1px] border-pwip-primary-400 mb-[28px]"
          >
            <img
              src="https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
              className="bg-cover h-[62px] w-[62px] rounded-md"
            />
            <div className="w-full inline-flex flex-col space-y-1">
              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                  Sona masuri Parboiled
                </span>
                <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                  ₹32/Kg
                </span>
              </div>

              <span className="text-pwip-gray-700 font-sans text-xs font-bold">
                5% Broken
              </span>

              <div className="inline-flex items-center justify-between w-full">
                <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                  Tamil nadu
                </span>

                <div className="inline-flex items-center justify-end text-pwip-primary-400 space-x-1">
                  <span className="text-xs font-medium font-sans line-clamp-1">
                    Edit
                  </span>
                  {pencilIcon}
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-base text-pwip-gray-900 font-sans font-bold">
          {title}
        </h2>
        <input
          placeholder="Ex: Ho chi min city port"
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
          Popular ports
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((items, index) => {
            return (
              <div
                key={items + index}
                onClick={() => {
                  router.push("/export-costing/overview");
                }}
                className="h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="w-full pt-3 inline-flex items-center justify-center">
                  {dummyRemoveMeCityIcon}
                </div>
                <div className="p-3 flex w-fill flex-col space-y-[4px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                    Atlanta port
                  </span>

                  <div className="inline-flex items-center justify-between">
                    <span className="text-pwip-gray-700 text-xs font-bold font-sans line-clamp-1">
                      USA
                    </span>
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      Californa, USA
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
                className="inline-flex items-center w-full p-[5px] space-x-[10px] bg-white rounded-sm border-b-[1px] border-b-pwip-gray-50"
              >
                <div className="h-[46px] w-[46px] rounded-sm bg-pwip-primary-50">
                  {/*  */}
                </div>
                <div className="w-full inline-flex flex-col space-y-2">
                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-600 text-sm font-bold font-sans line-clamp-1">
                      Mumbai port
                    </span>
                    <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1">
                      IND
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-between w-full">
                    <span className="text-pwip-gray-500 text-xs font-medium font-sans line-clamp-1">
                      India
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

export default SelectLocationContainer;

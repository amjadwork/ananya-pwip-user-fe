import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setCustomCostingSelection } from "@/redux/actions/costing.actions.js";

import { useOverlayContext } from "@/context/OverlayContext";

const SelectBagsContainer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const selectedCosting = useSelector((state) => state.costing);
  const packagingBags = useSelector((state) => state.bags);

  const { closeBottomSheet } = useOverlayContext();

  const {
    roundedTop = false,
    noTop = false,
    noPaddingBottom = false,
    title = "",
  } = props;

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [packagingBagsData, setPackagingBagsData] = React.useState([]);

  React.useEffect(() => {
    if (packagingBags && !packagingBags?.error && packagingBags?.bags?.length) {
      setPackagingBagsData([...packagingBags?.bags]);
    }
  }, [packagingBags]);

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
          Select Bag type
        </h2>
        <input
          placeholder="Ex: PP Woven"
          className="h-[48px] mt-[10px] w-full rounded-md bg-pwip-primary-100 px-[18px] text-base font-sans"
        />
      </div>

      <div
        className={`h-full w-full bg-white ${
          !noPaddingBottom ? "pb-[98px]" : "pb-8"
        } overflow-auto px-5 hide-scroll-bar`}
        style={{
          paddingTop: mainContainerHeight + 56 + "px",
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {[...packagingBagsData].map((items, index) => {
            return (
              <div
                key={items._id + index}
                onClick={() => {
                  dispatch(
                    setCustomCostingSelection({
                      ...selectedCosting,
                      customCostingSelection: {
                        ...selectedCosting.customCostingSelection,
                        bags: items,
                      },
                    })
                  );
                  closeBottomSheet();
                }}
                className="h-auto w-full rounded-md bg-pwip-white-100 inline-flex flex-col space-t"
                style={{
                  boxShadow:
                    "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="w-full pt-3 inline-flex items-center justify-center">
                  <img src="/assets/images/bags/jutebag.png" />
                </div>
                <div className="p-3 flex w-fill flex-col space-y-[4px]">
                  <span className="text-pwip-gray-700 text-sm font-bold font-sans line-clamp-1 text-center">
                    {items?.bag || ""} - {items?.weight}
                    {items?.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SelectBagsContainer;

/** @format */

import React from "react";

import { checkOutlineIcon, checkFilledIcon } from "../../../theme/icon";

const WatchlistBottomSheet = ({
  variantAndWatchlistMergedData,
  handleRemoveFromWatchlist,
  getStateAbbreviation,
}) => {
  return (
    <React.Fragment>
      <div div className="w-full inline-flex flex-col hide-scroll-bar">
        <div
          className={`w-full space-y-4 px-5 pt-4 pb-[72px] overflow-y-auto hide-scroll-bar transition-all`}
        >
          {variantAndWatchlistMergedData.map((item, index) => {
            return (
              <div
                key={item.source._id + index}
                className="inline-flex flex-col w-full space-y-5  bg-[#F3F7F9] rounded-lg px-3 py-3"
              >
                <div className="inline-flex w-full justify-between">
                  <div className="relative inline-flex space-x-3 w-[90%]">
                    <img
                      src={
                        item?.images?.length
                          ? item?.images[0]
                          : "https://m.media-amazon.com/images/I/41RLYdZ6L4L._AC_UF1000,1000_QL80_.jpg"
                      }
                      className="bg-cover h-[42px] w-[44px] border-[1px] border-pwip-v2-gray-100 rounded-lg object-cover"
                    />

                    <div className="inline-flex flex-col items-start justify-between w-full">
                      <span className="text-pwip-black-600 text-sm font-[700] font-sans line-clamp-1">
                        {item?.name}
                      </span>

                      <span className="text-pwip-gray-800 text-xs font-[400] font-sans line-clamp-1 mt-[6px]">
                        <span className="text-pwip-black-600">
                          {item?.source?.region},{" "}
                          {getStateAbbreviation(item?.source?.state) || ""}
                        </span>{" "}
                        {item?.brokenPercentage || 0}% Broken
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => handleRemoveFromWatchlist(item)}
                    className="w-[22px] h-[22px] inline-flex items-center justify-center relative  text-pwip-green-800"
                  >
                    {item?.watchlist?.saved &&
                    item?.watchlist?._sourceId === item?.source?._sourceId
                      ? checkFilledIcon
                      : checkOutlineIcon}
                  </div>
                </div>

                <div className="w-full inline-flex justify-between"></div>
              </div>
            );
          })}

          {!variantAndWatchlistMergedData?.length ? (
            <div className="inline-flex flex-col justify-center items-center w-full h-full">
              <img
                className="w-auto h-[260px]"
                src="/assets/images/no-state/no-result.svg"
              />
              <h2 className="text-xl text-center text-pwip-v2-primary font-[700] mt-8">
                No Results
              </h2>
              <p className="text-base text-center text-pwip-v2-gray-500 font-[500] mt-5">
                Sorry, there is no result for this search, let’s try another
                phrase
              </p>
            </div>
          ) : null}
        </div>
      </div>{" "}
    </React.Fragment>
  );
};

export default WatchlistBottomSheet;
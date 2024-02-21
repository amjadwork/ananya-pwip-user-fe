/** @format */

import React from "react";
import { inSubscription, crownIcon } from "../../theme/icon";

const SubscriptionCard = ({
  subscriptionName,
  subscriptionType,
  subscriptionValidity,
}) => {
  return (
    <div className="w-full p-4 border-b border-solid border-[#ccc]">
      <div className="flex item-center">
        {inSubscription}
        <div className="w-full">
          <div className="flex justify-between">
            <h2 className="text-sm font-semibold ml-2">{subscriptionName}</h2>
            <p className="text-[#1B1B1B] text-xs bg-[#F6F6F6] px-4 pt-0.5 rounded-md mb-0.5 justify-end">
              {subscriptionType}
            </p>
          </div>
          <div className="flex justify-between">
            <h2 className="text-[#808080] font-normal text-xs ml-2">
              {subscriptionValidity}
            </h2>
            <p className="text-[#2072AB] text-xs">View details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;

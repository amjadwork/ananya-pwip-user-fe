/** @format */

import React from "react";
import { useRouter } from "next/router";
import { inSubscription } from "../../theme/icon";

const SubscriptionCard = ({
  subscriptionName,
  subscriptionType,
  subscriptionValidity,
}) => {
  const router = useRouter();
  const isPremium = subscriptionType === "Premium";

  return (
    <div className="w-full p-4 border-b border-solid border-[#ccc]">
      <div className="flex item-center">
        {inSubscription}
        <div className="w-full">
          <div className="flex justify-between">
            <h2 className="text-sm font-semibold ml-2">{subscriptionName}</h2>
            <p className="text-[rgb(27,27,27)] text-xs bg-[#F6F6F6] px-3 pt-0.5 rounded-md mb-0.5 flex">
              {isPremium && (
                <div className=" flex items-center mr-0.5">
                  <img
                    src="/assets/images/crown.png"
                    alt="Premium"
                    width={10}
                    height={10}
                  />
                </div>
              )}
              {subscriptionType}
            </p>
          </div>
          <div className="flex justify-between">
            <h2 className="text-[#808080] font-normal text-xs ml-2">
              {subscriptionValidity}
            </h2>
            <p
              onClick={() => {
                router.push("/subscription-details");
              }}
              className="text-[#2072AB] text-xs"
            >
              View details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;

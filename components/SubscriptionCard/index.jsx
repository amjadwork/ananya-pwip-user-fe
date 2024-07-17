/** @format */

import React from "react";
import { useRouter } from "next/router";
import { inSubscription } from "../../theme/icon";

const SubscriptionCard = ({
  subscriptionName,
  subscriptionType,
  subscriptionValidity,
  subscription_id,
  expiresInDays,
  subscription_status
}) => {
  const router = useRouter();
  const isPremium = subscriptionType === "Premium";

  const handleViewDetails = () => {
    router.push({
      pathname: "/subscription-details",
      query: {
        subscriptionName,
        subscriptionType,
        subscription_id,
        expiresInDays,
        subscription_status,
      },
    });
  };

  return (
    <div className="w-full h-16 p-4 border-b border-solid border-[#ccc] mt-4">
      <div className="flex item-center">
        {inSubscription}
        <div className="w-full">
          <div className="flex justify-between">
            <h2 className="text-xs font-semibold ml-3">{subscriptionName}</h2>
            <p className="text-[rgb(27,27,27)] text-[10px] bg-[#F6F6F6] px-3 pt-0.5 rounded-md mb-0.5 flex">
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
          <div className="flex justify-between mt-1">
            <h2 className="text-[#808080] font-normal text-[10px] ml-3 ">
              {subscriptionValidity}
            </h2>
            <p
              onClick={handleViewDetails}
              className="text-[#2072AB] text-[10px]"
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

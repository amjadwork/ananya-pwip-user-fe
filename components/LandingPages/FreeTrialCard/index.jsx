/** @format */

import React from "react";
import { nextArrow } from "theme/icon";

const FreeTrialCard = ({
  plan,
  planIndex,
  SERVICE_ID,
  authToken,
  startFreeTrialForUser,
  checkSubscription,
  router,
}) => {
  const handleStartTrial = async () => {
    const res = await startFreeTrialForUser();

    if (res) {
      const details = await checkSubscription(SERVICE_ID, authToken);

      if (details?.activeSubscription) {
        router.replace("/export-costing");
      }
    }
  };

  return (
    <div
                      key={plan?.id + "_" + planIndex * 99}
                      className="bg-[#FFF8E9] p-5 rounded-lg"
                    >
                      <span className="font-semibold text-[14px]">
                        Free Trial
                      </span>
                      <p className="text-[12px] font-normal mt-2 mb-0">
                        {plan?.description}
                      </p>
                      <div
                        className="font-normal text-sm text-[#2072AB] mt-3.5 flex items-center"
                        onClick={async () => {
                          const res = await startFreeTrialForUser();

                          if (res) {
                            const details = await checkSubscription(
                              SERVICE_ID,
                              authToken
                            );

                            if (details?.activeSubscription) {
                              router.replace("/service/rice-price");
                              return;
                            }
                          }
                        }}
                      >
                        Start now &nbsp;{nextArrow}
                      </div>
                    </div>
  );
};

export default FreeTrialCard;

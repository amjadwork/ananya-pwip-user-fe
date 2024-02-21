/** @format */
import React from "react";
import { inSubscription } from "../../theme/icon";
import { Button } from "components/Button";

const SubscriptionDetailCard = ({}) => {
  return (
    <div className="w-full h-auto bg-white p-4 border border-solid border-[#ccc] shadow rounded-xl">
      <div className="flex">
        {inSubscription}

        <div className="w-full flex justify-between">
          <div className="text-sm font-semibold ml-2 flex items-center">
            Rice Price
          </div>
          <div className="text-xs h-5 w-14 text-white bg-[#25AF7D] px-3 flex items-center rounded-md ">
            Active
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between text-sm font-semibold mt-3">
        <div>Basic Plan</div>
        <div>299/mo</div>
      </div>
      <div className=" w-full flex text-xs mt-1">
        <div className="text-[#808080]">Validity: 30 days</div>
        <div className="text-[#B5B5B5]">(27 April - 27 May, 2024)</div>
      </div>
      <hr className="w-full mt-3"></hr>
      <div className="flex flex-col">
        <div className=" w-full h-10 border-b border-solid border-[#F9F9F9] flex items-center ">
          <div className="flex justify-left">
            <img
              src="/assets/images/paper-bill.png"
              alt="paper-bill"
              width={14}
              height={14}
            />
            <h2 className="text-[#1B1B1B] font-normal text-xs ml-2">
              Order #846748294
            </h2>
          </div>
        </div>
        <div className=" w-full h-10 border-b border-solid border-[#F9F9F9] flex items-center  ">
          <div className="flex justify-left">
            <img
              src="/assets/images/paper-bill.png"
              alt="paper-bill"
              width={14}
              height={14}
            />
            <h2 className="text-[#1B1B1B] font-normal text-xs ml-2">
              Transaction ID #T8467482
            </h2>
          </div>
        </div>
        <div className=" w-full h-10 border-b border-solid border-[#F9F9F9] flex items-center  ">
          <div className="flex justify-left">
            <img
              src="/assets/images/paper-bill.png"
              alt="paper-bill"
              width={14}
              height={14}
            />
            <h2 className="text-[#1B1B1B] font-normal text-xs ml-2">
              Payment made on 27 April, 2024 at 07:49 PM
            </h2>
          </div>
        </div>
        <div className=" w-full h-10 flex items-center ">
          <div className="flex justify-left">
            <img
              src="/assets/images/paper-bill.png"
              alt="paper-bill"
              width={14}
              height={14}
            />
            <h2 className="text-[#1B1B1B] font-normal text-xs ml-2">
              Request subscription cancellation
            </h2>
          </div>
        </div>
        <button
          onClick={() => {
            //onclick function
          }}
          className="border border-[#2072AB] w-[40%] mt-4 p-1 rounded-md text-pwip-primary text-center text-xs"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDetailCard;

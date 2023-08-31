import React, { useEffect, useRef } from "react";

import { useOverlayContext } from "@/context/OverlayContext";
import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";

import { chevronDown, plusIcon, minusIcon } from "../../../../theme/icon";

const CostingForm = ({ values, handleChange, handleBlur, setFieldValue }) => {
  const { openBottomSheet } = useOverlayContext();

  return (
    <React.Fragment>
      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Costing Name
        </label>
        <input
          placeholder="Ex: Sona Masuri"
          type="text"
          name="costingName"
          defaultValue={values?.costingName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
        />
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Rice Name
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Sona masuri"
            type="text"
            name="_variantId"
            readOnly={true}
            defaultValue={values?._variantId?.variantName || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={() => {
              const content = (
                <div>
                  <SelectVariantContainer
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                    isFromEdit={true}
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      {/* <div className="inline-flex flex-col w-full">
              <label className="text-sm font-normal text-pwip-gray-600">
                Rice Price
              </label>
              <div className="inline-flex items-center relative">
                <input
                  placeholder="Ex: INR 52.5"
                  type="text"
                  defaultValue={values?.costOfRice}
                  name="costOfRice"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
                />
              </div>
            </div> */}

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Broken Percentage
        </label>
        <div className="inline-flex items-center relative h-[40px] mt-[4px]  w-full border-[1px] border-pwip-gray-650 rounded-md bg-white">
          <button
            onClick={() => {
              let current = values?.brokenPercentage || 0;
              const decrementValue = current > 0 ? current - 1 : 0;
              setFieldValue("brokenPercentage", decrementValue);
            }}
            className="outline-none w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-r-[1px] border-r-pwip-gray-650 rounded-l-md text-pwip-gray-400"
          >
            {minusIcon}
          </button>
          <input
            placeholder="Ex: 10%"
            type="text"
            readOnly={true}
            defaultValue={values?.brokenPercentage}
            name="brokenPercentage"
            onChange={handleChange}
            onBlur={handleBlur}
            className="outline-none inline-flex items-center w-full px-[18px] text-xs font-sans text-center"
          />
          <button
            onClick={() => {
              let current = values?.brokenPercentage || 0;
              const incrementValue = current + 1;
              setFieldValue("brokenPercentage", incrementValue);
            }}
            className="outline-none w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-l-[1px] border-l-pwip-gray-650 rounded-r-md text-pwip-gray-400"
          >
            {plusIcon}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Bag type
          </label>
          <div className="inline-flex items-center relative">
            <input
              placeholder="Ex: PP Woven"
              type="text"
              name="_bagId"
              defaultValue={values?._bagId?.bag || ""}
              readOnly={true}
              onChange={handleChange}
              onBlur={handleBlur}
              onClick={() => {
                const content = (
                  <div>
                    <SelectBagsContainer
                      roundedTop={false}
                      noTop={true}
                      noPaddingBottom={true}
                    />
                  </div>
                );
                openBottomSheet(content);
              }}
              className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
            />
            <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
              {chevronDown}
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Bag size
          </label>
          <input
            placeholder="Ex: 5 kg"
            type="text"
            name="bagSize"
            defaultValue={values?.bagSize || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>
      </div>

      {/* <div className="inline-flex flex-col w-full">
              <label className="text-sm font-normal text-pwip-gray-600">
                Bag Price
              </label>
              <div className="inline-flex items-center relative">
                <input
                  placeholder="Ex: INR 2.5"
                  type="text"
                  name="bagPrice"
                  defaultValue={values?.bagPrice || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
                />
              </div>
            </div> */}

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Select port of orgin
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            name="_originId"
            defaultValue={
              values?._originId?.portName || values?._originId?.originPortName
            }
            readOnly={true}
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={() => {
              const content = (
                <div>
                  <SelectLocationContainer
                    title="Select Port of Origin"
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                    isFromEdit={true}
                    locationType="origin"
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Select port of destination
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            name="_destinationId"
            defaultValue={values?._destinationId?.portName}
            readOnly={true}
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={() => {
              const content = (
                <div>
                  <SelectLocationContainer
                    title="Select Port of Destination"
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                    isFromEdit={true}
                    locationType="destination"
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="inline-flex flex-col w-full">
        <label className="text-sm font-normal text-pwip-gray-600">
          Container type
        </label>
        <div className="inline-flex items-center relative">
          <input
            placeholder="Ex: Mumbai india"
            type="text"
            name="_containerId"
            value={`${values?._containerId?.type || ""} ${
              values?._containerId?.size || ""
            }`}
            readOnly={true}
            onChange={handleChange}
            onBlur={handleBlur}
            onClick={() => {
              const content = (
                <div>
                  <SelectCargoContainersContainer
                    roundedTop={false}
                    noTop={true}
                    noPaddingBottom={true}
                  />
                </div>
              );
              openBottomSheet(content);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <div className="absolute h-full mt-[4px] inline-flex items-center right-[18px]">
            {chevronDown}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            No of containers
          </label>
          <input
            placeholder="Ex: 10"
            type="text"
            name="containersCount"
            value={values?.containersCount}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>

        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Containers weight
          </label>
          <input
            placeholder="Ex: 1000 kg"
            type="text"
            name="containerWeight"
            value={values?.containerWeight}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>
      </div>

      <div className="!mt-10 inline-flex flex-col w-full space-y-10">
        <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            name="exportDuty"
            checked={values.exportDuty}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            20% Export duty
          </label>
        </div>

        <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            name="pwipFullfillment"
            checked={values.pwipFullfillment}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            Full fill through PWIP
          </label>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CostingForm;

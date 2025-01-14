import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useOverlayContext } from "@/context/OverlayContext";
import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";
import {
  setCostingSelection,
  setCustomCostingSelection,
} from "@/redux/actions/costing.actions.js";

import { chevronDown, plusIcon, minusIcon } from "../../../../theme/icon";

function sumNumericalValues(obj) {
  let total = 0;

  for (const key in obj) {
    if (!isNaN(obj[key]) && !["pqc", "surrender", "blFee"].includes(key)) {
      total += parseFloat(obj[key]);
    }
  }

  return total;
}

const CostingForm = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  activeTab,
}) => {
  const dispatch = useDispatch();

  const selectedCosting = useSelector((state) => state.costing); // Use api reducer slice

  const { openBottomSheet } = useOverlayContext();

  return (
    <div
      style={{
        display: activeTab === 0 ? "block" : "none",
      }}
      key="costing"
      className="space-y-4"
    >
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
            value={values?._variantId?.variantName || ""}
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
                    setFieldValue={setFieldValue}
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
              let currentCostOfRice = parseFloat(values.costOfRice) || 0;

              let current = values?.brokenPercentage || 0;
              const decrementValue = current > 0 ? current - 5 : 0;

              currentCostOfRice = currentCostOfRice + 0.3;

              setFieldValue(
                "costOfRice",
                parseFloat(currentCostOfRice.toFixed(2))
              );
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
              let currentCostOfRice = parseFloat(values.costOfRice) || 0;

              let current = values?.brokenPercentage || 0;
              const incrementValue = current + 5;

              currentCostOfRice = currentCostOfRice - 0.3;

              setFieldValue(
                "costOfRice",
                parseFloat(currentCostOfRice.toFixed(2))
              );
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
              placeholder="Ex: Standard Dry"
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
            readOnly={true}
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
                    setFieldValue={setFieldValue}
                    containerWeight={parseFloat(values?.containerWeight)}
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
                    setFieldValue={setFieldValue}
                    containerWeight={parseFloat(values?.containerWeight)}
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
            pattern="[0-9]*"
            inputMode="numeric"
            onBlur={(e) => {
              if (
                selectedCosting.customCostingSelection.shlData &&
                selectedCosting.customCostingSelection.chaData &&
                e.target.value
              ) {
                const blFee =
                  selectedCosting.customCostingSelection.shlData.blFee;
                const blSurrender =
                  selectedCosting.customCostingSelection.shlData.surrender;

                const pqc = selectedCosting.customCostingSelection.chaData.pqc;

                const updatedBlFee =
                  blFee /
                  (parseFloat(values.containerWeight) *
                    parseInt(e.target.value));
                const updatedBlSurrender =
                  blSurrender /
                  (parseFloat(values.containerWeight) *
                    parseInt(e.target.value));
                const updatedpqc =
                  pqc /
                  (parseFloat(values.containerWeight) *
                    parseInt(e.target.value));

                const totalSHL =
                  (sumNumericalValues(
                    selectedCosting.customCostingSelection.shlData
                  ) +
                    updatedBlFee +
                    updatedBlSurrender) /
                  parseFloat(values.containerWeight);
                const totalCHA =
                  (sumNumericalValues(
                    selectedCosting.customCostingSelection.chaData
                  ) +
                    updatedpqc) /
                  parseFloat(values.containerWeight);

                setFieldValue("cfsHandling", Math.floor(totalCHA));

                setFieldValue("shl", Math.floor(totalSHL));

                dispatch(
                  setCustomCostingSelection({
                    ...selectedCosting,
                    customCostingSelection: {
                      ...selectedCosting.customCostingSelection,
                      shl: Math.floor(totalSHL),
                      cha: Math.floor(totalCHA),
                      containerCount: parseInt(e.target.value),
                    },
                  })
                );
              }
              handleBlur(e);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>

        <div className="inline-flex flex-col w-full">
          <label className="text-sm font-normal text-pwip-gray-600">
            Per container weight
          </label>
          <input
            placeholder="Ex: 1000 kg"
            type="text"
            name="containerWeight"
            value={values?.containerWeight}
            onChange={handleChange}
            pattern="[0-9]*"
            inputMode="numeric"
            onBlur={(e) => {
              if (e.target.value) {
                dispatch(
                  setCustomCostingSelection({
                    ...selectedCosting,
                    customCostingSelection: {
                      ...selectedCosting.customCostingSelection,
                      containersWeight: parseFloat(e.target.value),
                    },
                  })
                );
              }

              handleBlur(e);
            }}
            className="inline-flex items-center h-[40px] mt-[4px] w-full rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
        </div>
      </div>

      <div className="!mt-10 inline-flex flex-col w-full space-y-10">
        <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            name="exportDuty"
            checked={values?.exportDuty}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            20% Export duty
          </label>
        </div>

        {/* <div className="inline-flex items-center space-x-4 w-full">
          <input
            type="checkbox"
            name="pwipFullfillment"
            checked={values?.pwipFullfillment}
            onChange={handleChange}
            onBlur={handleBlur}
            className="inline-flex items-center h-[20px] w-[20px] rounded-md bg-white border-[1px] border-pwip-gray-650 px-[18px] text-xs font-sans"
          />
          <label className="text-sm font-normal text-pwip-gray-600">
            Full fill through PWIP
          </label>
        </div> */}
      </div>
    </div>
  );
};

export default CostingForm;

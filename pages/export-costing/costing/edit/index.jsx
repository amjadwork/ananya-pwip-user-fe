import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";

import { useOverlayContext } from "@/context/OverlayContext";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import { inrToUsd } from "@/utils/helper";

import {
  chevronDown,
  plusIcon,
  minusIcon,
  riceAndBagsIcon,
  handlingAndInspectionIcon,
  otherChargesIcon,
  // eyePreviewIcon,
} from "../../../../theme/icon";

// Import Containers
import SelectVariantContainer from "@/containers/ec/SelectVariant";
import SelectLocationContainer from "@/containers/ec/SelectLocation";
import SelectBagsContainer from "@/containers/ec/SelectBags";
import SelectCargoContainersContainer from "@/containers/ec/SelectContainers";

// Import Layouts

const breakupArr = [
  {
    title: "Rice and bags",
    icon: riceAndBagsIcon,
    afterIcon: "/assets/images/costing/road.png",
    rowItems: [
      {
        label: "Cost of rice",
        name: "costOfRice",
        inr: 0,
        usd: 0,
      },
      {
        label: "PPWoven-50 Kg",
        name: "bagPrice",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Handling and Inspection",
    icon: handlingAndInspectionIcon,
    afterIcon: "/assets/images/costing/container.png",
    rowItems: [
      {
        label: "Transportation",
        name: "transportation",
        inr: 0,
        usd: 0,
      },
      {
        label: "CFS Handling",
        name: "cfsHandling",
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "Craft paper",
            inr: 0,
            usd: 0,
          },
          {
            label: "Silica gel",
            inr: 0,
            usd: 0,
          },
          {
            label: "Loading chargers",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "Shipping line locals",
        name: "shl",
        inr: 0,
        usd: 0,
        breakUp: [
          {
            label: "THC",
            inr: 0,
            usd: 0,
          },
          {
            label: "BL",
            inr: 0,
            usd: 0,
          },
          {
            label: "Surrender",
            inr: 0,
            usd: 0,
          },
        ],
      },
      {
        label: "OFC",
        name: "ofc",
        inr: 0,
        usd: 0,
      },
      {
        label: "Inspection cost",
        name: "inspectionCost",
        inr: 0,
        usd: 0,
      },
    ],
  },
  {
    title: "Other chargers",
    icon: otherChargesIcon,
    // afterIcon: "/assets/images/costing/ocean.png",
    rowItems: [
      {
        label: "Finance cost",
        name: "financeCost",
        inr: 0,
        usd: 0,
      },
      {
        label: "Overheads",
        name: "overheads",
        inr: 0,
        usd: 0,
      },
      {
        label: "Margin",
        name: "margin",
        inr: 0,
        usd: 0,
      },
      // {
      //   label: "20% Export duty",
      //   name: "exportDuty",
      //   inr: 0,
      //   usd: 0,
      // },
      // {
      //   label: "PWIP Fulfilment ",
      //   name: "pwipFullfillment",
      //   inr: 0,
      //   usd: 0,
      // },
    ],
  },
];

const CostingForm = () => {
  const formik = useRef();

  const { openBottomSheet } = useOverlayContext();
  const selectedAndGeneratedCosting = useSelector((state) => state.costing);

  useEffect(() => {
    if (formik && formik.current && selectedAndGeneratedCosting) {
      const formikRef = formik.current;

      formikRef.setValues({
        costingName: "",
        _variantId:
          selectedAndGeneratedCosting?.customCostingSelection?.product ||
          selectedAndGeneratedCosting?.product,
        brokenPercentage:
          selectedAndGeneratedCosting?.customCostingSelection?.product
            ?.brokenPercentage || 0,
        _bagId:
          selectedAndGeneratedCosting.generatedCosting.details.packageDetails,
        bagSize:
          selectedAndGeneratedCosting.generatedCosting.details.packageDetails
            .weight,
        _originId:
          selectedAndGeneratedCosting.generatedCosting.details.originPortObject,
        _destinationId:
          selectedAndGeneratedCosting.generatedCosting.details
            .destinationObject,
        _containerId:
          selectedAndGeneratedCosting.generatedCosting.breakup.chaObject
            .chaContainerObject,
        containersCount: 1,
        containerWeight:
          selectedAndGeneratedCosting.generatedCosting.breakup.chaObject
            .chaContainerObject.weight,
        exportDuty: selectedAndGeneratedCosting.generatedCosting.constants
          .exportDutyCharge
          ? true
          : false,
        pwipFullfillment: selectedAndGeneratedCosting.generatedCosting.constants
          .pwipFullfillment
          ? true
          : false,
      });
    }
  }, [formik, selectedAndGeneratedCosting]);

  return (
    <Formik
      innerRef={formik}
      initialValues={{
        costingName: "",
        _variantId: {},
        // costOfRice: "",
        brokenPercentage: "",
        _bagId: {},
        bagSize: "",
        // bagPrice: "",
        _originId: {},
        _destinationId: {},
        _containerId: {},
        containersCount: "",
        containerWeight: "",
        exportDuty: false,
        pwipFullfillment: false,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form
          className="inline-flex flex-col w-full space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="inline-flex flex-col w-full">
            <label className="text-sm font-normal text-pwip-gray-600">
              Costing Name
            </label>
            <input
              placeholder="Ex: Sona Masuri"
              type="text"
              name="costingName"
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
              <div className="w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-r-[1px] border-r-pwip-gray-650 rounded-l-md text-pwip-gray-400">
                {minusIcon}
              </div>
              <input
                placeholder="Ex: 10%"
                type="text"
                defaultValue={values?.brokenPercentage}
                name="brokenPercentage"
                onChange={handleChange}
                onBlur={handleBlur}
                className="inline-flex items-center w-full px-[18px] text-xs font-sans text-center"
              />
              <div className="w-[44px] h-full inline-flex items-center justify-center right-[18px] bg-white border-l-[1px] border-l-pwip-gray-650 rounded-r-md text-pwip-gray-400">
                {plusIcon}
              </div>
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
                defaultValue={values?._originId?.originPortName}
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

          <div className="w-full !mt-[32px]">
            <Button
              type="primary"
              buttonType="submit"
              label="Update costing"
              disabled={isSubmitting}
            />
          </div>
        </form>
      )}
    </Formik>
  );
};

const BreakupForm = () => {
  const formik = useRef();

  const selectedAndGeneratedCosting = useSelector((state) => state.costing);

  useEffect(() => {
    if (formik && formik.current && selectedAndGeneratedCosting) {
      const formikRef = formik.current;

      formikRef.setValues({
        costOfRice:
          selectedAndGeneratedCosting?.customCostingSelection?.product
            ?.sourceRates?.price ||
          selectedAndGeneratedCosting?.product?.sourceRates?.price ||
          0,
        bagPrice: selectedAndGeneratedCosting.generatedCosting.costing.package,
        transportation:
          selectedAndGeneratedCosting.generatedCosting.costing.transportCharge,
        cfsHandling:
          selectedAndGeneratedCosting.generatedCosting.costing.cfsHandling,
        shl: selectedAndGeneratedCosting.generatedCosting.costing.shlCost,
        ofc: selectedAndGeneratedCosting.generatedCosting.costing.ofcCost,
        inspectionCost:
          selectedAndGeneratedCosting.generatedCosting.constants
            .inspectionCharge,
        financeCost:
          selectedAndGeneratedCosting.generatedCosting.constants.financeCost,
        overheads:
          selectedAndGeneratedCosting.generatedCosting.constants.overHeadCharge,
        margin: selectedAndGeneratedCosting.generatedCosting.constants.margin,
        // exportDuty: selectedAndGeneratedCosting.generatedCosting.constants
        //   .exportDutyCharge
        //   ? true
        //   : false,
        // pwipFullfillment: selectedAndGeneratedCosting.generatedCosting.constants
        //   .pwipFullfillment
        //   ? true
        //   : false,
      });
    }
  }, [formik, selectedAndGeneratedCosting]);

  return (
    <Formik
      innerRef={formik}
      initialValues={{
        costOfRice: "",
        bagPrice: "",
        transportation: "",
        cfsHandling: "",
        shl: "",
        ofc: "",
        inspectionCost: "",
        financeCost: "",
        overheads: "",
        margin: "",
        // exportDuty: false,
        // pwipFullfillment: false,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form className="inline-flex flex-col w-full" onSubmit={handleSubmit}>
          <div className="inline-flex flex-col w-full">
            {breakupArr.map((item, index) => {
              const hasBreakup = breakupArr[index].rowItems.some(
                (d) => d?.breakUp?.length
              );
              return (
                <React.Fragment key={item.title + index}>
                  <div
                    //   onClick={() => {
                    //     if (hasBreakup) {
                    //       handleOpenBottomSheet(index);
                    //     }
                    //   }}
                    className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40"
                  >
                    <div className="inline-flex items-center justify-between w-full p-3 border-[1px] border-pwip-gray-40">
                      <div className="inline-flex items-center space-x-2 w-full">
                        {item.icon}
                        <span className="text-pwip-gray-1000 text-base font-medium">
                          {item.title}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center w-full">
                      <div className="w-[60%] pt-4 pb-2 px-4 inline-flex items-center">
                        <span className="text-pwip-gray-750 text-sm font-normal">
                          Details
                        </span>
                      </div>
                      <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                        <span className="text-pwip-gray-750 text-sm font-normal">
                          ₹INR
                        </span>
                      </div>
                      <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                        <span className="text-pwip-gray-750 text-sm font-normal">
                          $USD
                        </span>
                      </div>
                    </div>

                    {item.rowItems.map((row, rowIndex) => {
                      let paddingBottom = "pb-2";
                      if (rowIndex === item.rowItems.length - 1) {
                        paddingBottom = "pb-4";
                      }

                      return (
                        <div
                          key={row.label + rowIndex}
                          className="inline-flex items-center w-full"
                        >
                          <div
                            className={`w-[60%] pt-4 ${paddingBottom} px-4 inline-flex items-center`}
                          >
                            <span className="text-pwip-gray-850 text-sm font-normal">
                              {row.label}
                            </span>
                          </div>
                          <div
                            className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                          >
                            <input
                              className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                              name={row.name}
                              defaultValue={values[row.name]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          <div
                            className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                          >
                            <input
                              className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                              readOnly={true}
                              value={parseFloat(
                                inrToUsd(values[row.name], 83.16)
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {item.afterIcon && (
                    <div className="w-full inline-flex items-center justify-center">
                      <img
                        src={item.afterIcon}
                        className="h-[40px] w-[22px] bg-cover"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* <div className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40">
            <div className="inline-flex items-center w-full">
              <div className={`w-[60%] py-4 px-4 inline-flex items-center`}>
                <span className="text-pwip-gray-1000 text-base font-bold">
                  Grand Total
                </span>
              </div>
              <div
                className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
              >
                <span className="text-pwip-gray-1000 text-base font-bold">
                  ₹42000
                </span>
              </div>
              <div
                className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
              >
                <span className="text-pwip-gray-1000 text-base font-bold">
                  $345
                </span>
              </div>
            </div>
          </div> */}

          <div className="w-full !mt-[32px]">
            <Button
              type="primary"
              buttonType="submit"
              label="Update costing"
              // onClick={() => {
              //   router.push("/export-costing/costing");
              // }}
            />
          </div>
        </form>
      )}
    </Formik>
  );
};

function EditCosting() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);

  // const selectedAndGeneratedCosting = useSelector((state) => state.costing);

  // console.log("selectedAndGeneratedCosting **", selectedAndGeneratedCosting);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        /> */}

        <title>Export Costing by pwip</title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <Header />

        <div
          id="fixedMenuSection"
          className="fixed top-[92px] h-[auto] w-full bg-pwip-gray-45 z-10 py-5 px-5"
        >
          <div className="w-full h-[46px] bg-pwip-gray-300 rounded-full inline-flex items-center p-1">
            <div
              onClick={() => setActiveTab(0)}
              className={`w-[50%] h-full inline-flex items-center justify-center ${
                activeTab === 0 ? "bg-white" : "opacity-40"
              } rounded-full`}
            >
              <span className="text-pwip-gray-1100 font-sans font-bold text-sm">
                Costing
              </span>
            </div>

            <div
              onClick={() => setActiveTab(1)}
              className={`w-[50%] h-full inline-flex items-center justify-center ${
                activeTab === 1 ? "bg-white" : "opacity-40"
              } rounded-full`}
            >
              <span className="text-pwip-gray-1100 font-sans font-bold text-sm">
                Breakup
              </span>
            </div>
          </div>
        </div>

        <div
          className={`min-h-screen h-full w-full bg-pwip-gray-45 pb-[32px] overflow-auto px-5 hide-scroll-bar`}
          style={{
            paddingTop: mainContainerHeight + 92 + "px",
          }}
        >
          {activeTab === 0 && <CostingForm />}

          {activeTab === 1 && <BreakupForm />}
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(EditCosting);

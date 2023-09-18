import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

import { breakupArr } from "@/constants/breakupStructure";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import { generatePayloadForCustomCosting } from "@/utils/helper";

import { fetchPackagingBagsRequest } from "@/redux/actions/packaging.actions";
import { fetchContainersRequest } from "@/redux/actions/container.actions";
import {
  fetchMyCostingFailure,
  saveCostingRequest,
  saveCostingFailure,
  updateCostingRequest,
  fetchMyCostingRequest,
  updateCostingFailure,
} from "@/redux/actions/myCosting.actions";
import {
  generateCustomCostingRequest,
  fetchGeneratedCostingFailure,
  resetCustomCostingSelection,
} from "@/redux/actions/costing.actions";

// Import Containers
import CostingForm from "@/containers/ec/Forms/CostingForm";
import BreakupForm from "@/containers/ec/Forms/BreakupForm";

import { getCostingToSaveHistoryPayload } from "@/utils/helper";

function convertUnits(currentUnit, unitToConvert, value) {
  // Define conversion factors
  const conversionFactors = {
    kg: {
      mt: 0.001,
      qt: 0.01,
    },
    mt: {
      kg: 1000,
      qt: 10,
    },
    qt: {
      kg: 100,
      mt: 0.1,
    },
  };

  // Check if the units are valid
  if (
    !(currentUnit in conversionFactors) ||
    !(unitToConvert in conversionFactors[currentUnit])
  ) {
    return "Invalid units";
  }

  // Perform the conversion
  const conversionFactor = conversionFactors[currentUnit][unitToConvert];
  const convertedValue = value * conversionFactor;

  return convertedValue;
}

const initialValues = {
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
  // pwipFullfillment: false,

  // breakup
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
};

function EditCosting() {
  const router = useRouter();
  const dispatch = useDispatch();

  const formik = useRef();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [selectedUnitForPayload, setSelectedUnitForPayload] =
    React.useState("mt");
  const [componentShipmentTerm, setComponentShipmentTerm] =
    React.useState(null);

  const shipmentTerm = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.selected
  );
  const isShipmentTermDropdownOpen = useSelector(
    (state) => state.shipmentTerm.shipmentTerm.showShipmentTermDropdown
  );
  const generatedCosting = useSelector(
    (state) => state.costing.generatedCosting
  );
  const customCostingSelection = useSelector(
    (state) => state.costing.customCostingSelection
  );

  const selectedMyCostingFromHistory = useSelector((state) => {
    if (
      state.myCosting &&
      state.myCosting.currentCostingFromHistory &&
      state.myCosting.currentCostingFromHistory.length
    ) {
      return state.myCosting.currentCostingFromHistory[0];
    }
    return null;
  });

  React.useEffect(() => {
    setComponentShipmentTerm(shipmentTerm);
  }, [isShipmentTermDropdownOpen]);

  const handleShipmentChangeCalls = async () => {
    await dispatch(updateCostingFailure());

    const payloadBody = {
      shipmentTermType: shipmentTerm || "FOB",
      termOfAgreement: shipmentTerm || "FOB",
    };

    await dispatch(updateCostingRequest(payloadBody));
    await dispatch(updateCostingFailure());
    await dispatch(fetchMyCostingRequest(selectedMyCostingFromHistory?._id));
  };

  React.useEffect(() => {
    if (shipmentTerm && componentShipmentTerm) {
      handleShipmentChangeCalls();
    }
  }, [shipmentTerm]);

  React.useEffect(() => {
    if (generatedCosting && isGenerated) {
      const saveHistoryPayload = getCostingToSaveHistoryPayload({
        ...generatedCosting,
        costingName: formik.current.values.costingName,
      });

      let payloadBody = {
        ...saveHistoryPayload,
        isQuickCosting: false,
        unit: selectedUnitForPayload,
        isExportDuty: formik.current.values.exportDuty,
        brokenPercentage: formik.current.values.brokenPercentage || 5,
        containersCount: parseFloat(formik.current.values.containersCount),
        _containerId: formik.current.values._containerId._id,
      };

      if (!formik.current.values.exportDuty) {
        payloadBody.exportDuty = 0;
      }

      dispatch(fetchGeneratedCostingFailure());
      dispatch(saveCostingFailure());
      dispatch(saveCostingRequest(payloadBody));
      setIsGenerated(false);
      dispatch(resetCustomCostingSelection());
      router.replace("/export-costing/costing");
    }
  }, [generatedCosting, isGenerated]);

  useEffect(() => {
    if (
      formik &&
      formik.current &&
      customCostingSelection &&
      selectedMyCostingFromHistory
    ) {
      const formikRef = formik.current;

      // let customProduct = customCostingSelection?.product;

      // if (customProduct) {
      //   customProduct.sourceRates.price = convertUnits(
      //     "kg",
      //     selectedMyCostingFromHistory.unit,
      //     customProduct?.sourceRates?.price
      //   );
      // }

      const breakUpFormValues = {
        costingName: selectedMyCostingFromHistory?.costingName || "",
        _variantId:
          customCostingSelection?.product ||
          selectedMyCostingFromHistory?.details?.variantObject,
        brokenPercentage:
          formik.current.values.brokenPercentage ||
          customCostingSelection?.product?.brokenPercentage ||
          selectedMyCostingFromHistory?.brokenPercentage ||
          0,
        _bagId:
          customCostingSelection?.bags ||
          selectedMyCostingFromHistory?.details.packageDetails,
        bagSize:
          customCostingSelection?.bags?.weight ||
          selectedMyCostingFromHistory?.details.packageDetails.weight,
        _originId:
          customCostingSelection?.portOfOrigin ||
          selectedMyCostingFromHistory?.details?.originPortObject,
        _destinationId:
          customCostingSelection?.portOfDestination ||
          selectedMyCostingFromHistory?.details.destinationObject,
        _containerId:
          customCostingSelection?.containers ||
          selectedMyCostingFromHistory?.details?.containerObject,
        containersCount: 1,
        containerWeight:
          customCostingSelection?.containers?.weight ||
          selectedMyCostingFromHistory?.details?.containerObject.weight,

        // Breakup values
        costOfRice:
          customCostingSelection?.product?.sourceRates?.price ||
          selectedMyCostingFromHistory?.costing?.exmillPrice ||
          0,
        bagPrice:
          customCostingSelection?.bags?.cost ||
          selectedMyCostingFromHistory?.costing?.package,
        transportation: selectedMyCostingFromHistory?.costing?.transportCharge,
        cfsHandling: selectedMyCostingFromHistory?.costing?.cfsHandling,
        shl: selectedMyCostingFromHistory?.costing?.shlCost,
        ofc:
          shipmentTerm === "FOB"
            ? 0
            : selectedMyCostingFromHistory?.costing?.ofcCost,
        inspectionCost:
          selectedMyCostingFromHistory?.constants?.inspectionCharge,
        financeCost: selectedMyCostingFromHistory?.constants?.financeCost,
        overheads: selectedMyCostingFromHistory?.constants?.overHeadCharge,
        margin: selectedMyCostingFromHistory?.constants?.margin,
        exportDuty: selectedMyCostingFromHistory?.constants?.exportDutyCharge
          ? true
          : false,
        pwipFullfillment: selectedMyCostingFromHistory?.constants
          .pwipFullfillment
          ? true
          : false,
      };

      formikRef.setValues(breakUpFormValues);
    }
  }, [formik, customCostingSelection, selectedMyCostingFromHistory]);

  React.useEffect(() => {
    if (customCostingSelection || generatedCosting) {
      breakupArr[0].rowItems[1].label = customCostingSelection?.bags
        ? `${customCostingSelection?.bags?.bag}-${customCostingSelection?.bags?.weight}${customCostingSelection?.bags?.unit}`
        : `${generatedCosting?.details?.packageDetails?.bag}-${generatedCosting?.details?.packageDetails?.weight}${generatedCosting?.details?.packageDetails?.unit}`;
    }
  }, [breakupArr, customCostingSelection, generatedCosting]);

  useEffect(() => {
    if (selectedMyCostingFromHistory && !generatedCosting) {
      const sheet = selectedMyCostingFromHistory;

      breakupArr[0].rowItems[1].label = `${sheet?.details?.packageDetails?.bag}-${sheet?.details?.packageDetails?.weight}${sheet?.details?.packageDetails?.unit}`;
    }
  }, [selectedMyCostingFromHistory, generatedCosting]);

  React.useEffect(() => {
    dispatch(fetchPackagingBagsRequest());
    dispatch(fetchContainersRequest());

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
          className="fixed top-[72px] h-[auto] w-full bg-pwip-gray-45 z-10 py-5 px-5"
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
          <Formik
            innerRef={formik}
            initialValues={{
              ...initialValues,
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              // errors,
              // touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="inline-flex flex-col w-full space-y-4"
                onSubmit={handleSubmit}
              >
                {activeTab === 0 && (
                  <CostingForm
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                  />
                )}

                {activeTab === 1 && (
                  <BreakupForm
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                )}

                <div className="w-full !mt-[32px]">
                  <Button
                    type="primary"
                    buttonType="submit"
                    label="Update costing"
                    disabled={isSubmitting}
                    onClick={() => {
                      let givenData = { ...values };
                      givenData.unit =
                        selectedMyCostingFromHistory?.unit || "mt";
                      givenData.shipmentTermType =
                        shipmentTerm ===
                        selectedMyCostingFromHistory?.termOfAgreement
                          ? shipmentTerm
                          : selectedMyCostingFromHistory?.termOfAgreement;
                      givenData.variantCost = parseFloat(values?.costOfRice);

                      setSelectedUnitForPayload(
                        selectedMyCostingFromHistory?.unit || "mt"
                      );

                      const payload =
                        generatePayloadForCustomCosting(givenData);
                      dispatch(generateCustomCostingRequest(payload));
                      dispatch(fetchMyCostingFailure());
                      setIsGenerated(true);
                    }}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(EditCosting);

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
} from "@/redux/actions/myCosting.actions";
import {
  generateCustomCostingRequest,
  fetchGeneratedCostingFailure,
} from "@/redux/actions/costing.actions";

// Import Containers
import CostingForm from "@/containers/ec/Forms/CostingForm";
import BreakupForm from "@/containers/ec/Forms/BreakupForm";

import { getCostingToSaveHistoryPayload } from "@/utils/helper";

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
  pwipFullfillment: false,

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

  const selectedAndGeneratedCosting = useSelector((state) => state.costing);
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
    if (
      selectedAndGeneratedCosting &&
      selectedAndGeneratedCosting?.generatedCosting &&
      isGenerated
    ) {
      const saveHistoryPayload = getCostingToSaveHistoryPayload(
        selectedAndGeneratedCosting?.generatedCosting
      );

      const payloadBody = {
        ...saveHistoryPayload,
        isQuickCosting: false,
      };

      dispatch(fetchGeneratedCostingFailure());

      dispatch(saveCostingRequest(payloadBody));
      setIsGenerated(false);
      router.push("/export-costing/costing");
    }
  }, [selectedAndGeneratedCosting, isGenerated]);

  useEffect(() => {
    if (
      formik &&
      formik.current &&
      selectedAndGeneratedCosting &&
      selectedMyCostingFromHistory
    ) {
      const formikRef = formik.current;

      formikRef.setValues({
        costingName: selectedMyCostingFromHistory?.costingName || "",
        _variantId:
          selectedAndGeneratedCosting?.customCostingSelection?.product ||
          selectedMyCostingFromHistory?.details?.variantObject,
        brokenPercentage:
          selectedAndGeneratedCosting?.customCostingSelection?.product
            ?.brokenPercentage ||
          selectedMyCostingFromHistory?.details?.variantObject
            ?.brokenPercentage ||
          0,
        _bagId:
          selectedAndGeneratedCosting?.customCostingSelection?.bags ||
          selectedMyCostingFromHistory?.details.packageDetails,
        bagSize:
          selectedAndGeneratedCosting?.customCostingSelection?.bags?.weight ||
          selectedMyCostingFromHistory?.details.packageDetails.weight,
        _originId:
          selectedAndGeneratedCosting?.customCostingSelection?.portOfOrigin ||
          selectedMyCostingFromHistory?.details?.originPortObject,
        _destinationId:
          selectedAndGeneratedCosting?.customCostingSelection
            ?.portOfDestination ||
          selectedMyCostingFromHistory?.details.destinationObject,
        _containerId:
          selectedAndGeneratedCosting?.customCostingSelection?.containers ||
          selectedMyCostingFromHistory?.details?.containerObject,
        containersCount: 1,
        containerWeight:
          selectedAndGeneratedCosting?.customCostingSelection?.containers
            ?.weight ||
          selectedMyCostingFromHistory?.details?.containerObject.weight,

        // Breakup values
        costOfRice:
          selectedAndGeneratedCosting?.customCostingSelection?.product
            ?.sourceRates?.price ||
          selectedMyCostingFromHistory?.costing?.exmillPrice ||
          0,
        bagPrice:
          selectedAndGeneratedCosting?.customCostingSelection?.bags?.cost ||
          selectedMyCostingFromHistory?.costing?.package,
        transportation: selectedMyCostingFromHistory?.costing?.transportCharge,
        cfsHandling: selectedMyCostingFromHistory?.costing?.cfsHandling,
        shl: selectedMyCostingFromHistory?.costing?.shlCost,
        ofc: selectedMyCostingFromHistory?.costing?.ofcCost,
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
      });
    }
  }, [formik, selectedAndGeneratedCosting, selectedMyCostingFromHistory]);

  React.useEffect(() => {
    if (selectedAndGeneratedCosting) {
      breakupArr[0].rowItems[1].label = selectedAndGeneratedCosting
        .customCostingSelection?.bags
        ? `${selectedAndGeneratedCosting.customCostingSelection?.bags?.bag}-${selectedAndGeneratedCosting.customCostingSelection?.bags?.weight}${selectedAndGeneratedCosting.customCostingSelection?.bags?.unit}`
        : `${selectedAndGeneratedCosting?.generatedCosting?.details?.packageDetails?.bag}-${selectedAndGeneratedCosting?.generatedCosting?.details?.packageDetails?.weight}${selectedAndGeneratedCosting?.generatedCosting?.details?.packageDetails?.unit}`;
    }
  }, [breakupArr, selectedAndGeneratedCosting]);

  useEffect(() => {
    if (
      selectedMyCostingFromHistory &&
      !selectedAndGeneratedCosting.generatedCosting
    ) {
      const sheet = selectedMyCostingFromHistory;

      breakupArr[0].rowItems[1].label = `${sheet?.details?.packageDetails?.bag}-${sheet?.details?.packageDetails?.weight}${sheet?.details?.packageDetails?.unit}`;
    }
  }, [selectedMyCostingFromHistory, selectedAndGeneratedCosting]);

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
                        selectedMyCostingFromHistory?.termOfAgreement;
                      givenData.variantCost = parseFloat(values?.costOfRice);

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

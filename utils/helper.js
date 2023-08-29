import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setAuthData } from "@/redux/actions/auth.actions";

export function inrToUsd(inrAmount, exchangeRate) {
  return (inrAmount / exchangeRate).toFixed(2);
}

export let api = axios.create({
  baseURL: "https://api-stage.pwip.co/api", // Replace with your API base URL
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = [401, 403];
    if (error.response && status.includes(error.response.status)) {
      // Unauthorized error (e.g., invalid token)
      const dispatch = useDispatch();
      dispatch(setAuthData(null, null)); // Assuming you have a logout action to clear user state

      const router = useRouter();
      router.replace("/"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export function getCostingToSaveHistoryPayload(inputJson) {
  return {
    costingName: `${inputJson?.details?.variantObject?.variantName} - ${inputJson?.details?.destinationObject?.portName}`,
    brokenPercentage: inputJson.details.variantObject.brokenPercentage || 0,
    unit: "mt",
    _variantId: inputJson.details.variantObject._variantId,
    _bagId:
      inputJson?.details?.packageDetails?._id ||
      inputJson?.details?.packageObject?._id,
    bagSize:
      inputJson?.details?.packageDetails?.weight ||
      inputJson?.details?.packageObject?.weight,
    _sourceId: inputJson?.details?.sourceObject?._id,
    _originId:
      inputJson?.details?.originPortObject?._originId ||
      inputJson?.details?.originObject?._id,
    _destinationId:
      inputJson?.details?.destinationObject?._destinationId ||
      inputJson?.details?.destinationObject?._id,
    _containerId:
      inputJson?.details?.ofcObject?._containerId ||
      inputJson?.details?.ofcObject?.chaDetailObject?._containerId,
    containersCount: 1,
    containerWeight:
      inputJson?.details?.ofcObject?.containerObject?.weight ||
      inputJson?.details?.ofcObject?.chaContainerObject?.weight,
    isExportDuty: inputJson.constants.exportDutyCharge ? true : false,
    isPwipFullfillment: inputJson.constants.pwipFullfillment ? true : false,
    termOfAgreement: inputJson?.grandTotalFob ? "FOB" : "CIF",
    costOfRice: inputJson.costing.exmillPrice,
    bagPrice: inputJson.costing.package,
    transportation: inputJson.costing.transportCharge,
    cfsHandling: inputJson.costing.cfsHandling,
    shippingLineLocals: inputJson.costing.shlCost,
    OFC: inputJson.costing.ofcCost || 0,
    inspectionCost: inputJson.constants.inspectionCharge,
    insurance: inputJson.constants.insurance,
    financeCost: inputJson.constants.financeCost,
    overhead: inputJson.constants.overHeadCharge,
    margin: inputJson.constants.margin,
    exportDuty: inputJson.constants.exportDutyCharge || 0,
    pwipFullfillment: inputJson.constants.pwipFullfillment || 0,
    FOB: inputJson.grandTotalFob || 0,
    CIF: inputJson.grandTotalCif || 0,
    grandTotal: inputJson.grandTotal || 0,
  };
}

export function generatePayloadForCustomCosting(givenData) {
  const payload = {
    shipmentTermType: givenData.shipmentTermType,
    currentUnit: givenData.unit,
    unitToConvert: givenData.unit,
    _variantId: givenData._variantId._id,
    sourceRateId: givenData._variantId.sourceRates[0]._id,
    sourceId: givenData._variantId.sourceRates[0]._sourceId,
    _originId: givenData._originId._id,
    _destinationId: givenData._destinationId._id,
    _containerId: givenData._containerId._id,
    _bagId: givenData._bagId._id,
    variantCost: givenData.costOfRice,
    brokenPercent: givenData.brokenPercentage,
    containersWeight: givenData.containerWeight * givenData.containersCount,
    totalContainers: givenData.containersCount,
    transportationCost: givenData.transportation,
    bagCost: givenData.bagPrice,
    ofc: givenData.ofc,
    inspectionCost: givenData.inspectionCost,
    insurance: 0, // Assuming insurance cost is not given in the input
    financeCost: givenData.financeCost,
    overheads: givenData.overheads,
    margin: givenData.margin,
    cfsHandling: givenData.cfsHandling,
    shl: givenData.shl,
    exportDuty: givenData.exportDuty,
    fulfilledByPwip: givenData.pwipFullfillment,
  };
  return payload;
}

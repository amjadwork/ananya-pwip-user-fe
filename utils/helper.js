import axios from "axios";
require("dotenv").config();

// import { useDispatch } from "react-redux";
// import { useRouter } from "next/router";

export async function checkSubscription(serviceId, token) {
  try {
    const response = await fetch(
      `/api/check-subscription?serviceId=${serviceId}&authToken=${token}`
    );
    return await response.json();
  } catch (err) {
    // Handle error
    console.error(err);
    return err;
  }
}

export function toKebabCase(inputString) {
  return inputString?.toLowerCase().replace(/\s+/g, "-");
}

export function inrToUsd(inrAmount, exchangeRate) {
  return (inrAmount / exchangeRate).toFixed(2);
}

export function formatNumberWithCommas(input) {
  // Convert the input to a string if it's not already
  const numberString = typeof input === "number" ? input.toString() : input;

  // Use a regular expression to add commas every three digits
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function abbreviateNumber(input) {
  // Remove commas and spaces from the input string
  const numberString = input.replace(/[,\s]/g, "");

  // Convert the string to a number
  const number = parseFloat(numberString);

  // Check if the number is valid
  if (isNaN(number)) {
    return "Invalid input";
  }

  // Determine the abbreviation based on the number's magnitude
  if (number < 1000) {
    return number.toString();
  } else if (number >= 1000 && number < 100000) {
    return (number / 1000).toFixed(0) + "k";
  } else if (number >= 100000 && number < 10000000) {
    return (number / 100000).toFixed(0) + "L";
  } else if (number >= 10000000) {
    return (number / 10000000).toFixed(0) + "cr";
  }
}

export const apiBaseURL = process.env.NEXT_PUBLIC_API_URL; //|| "https://api-stage.pwip.co/";
export const apiStagePaymentBeUrl =
  process.env.NEXT_PUBLIC_API_STAGE_PAYMENT_BE_URL;
export const exportCostingServiceId =
  process.env.NEXT_PUBLIC_API_EXPORT_COSTING_SERVICE_ID;

export const ricePriceServiceId =
  process.env.NEXT_PUBLIC_API_RICE_PRICE_SERVICE_ID;

export const ofcServiceId = process.env.NEXT_PUBLIC_OFC_SERVICE_ID;

export const pwipPrimeServiceId = process.env.NEXT_PUBLIC_PWIP_PRIME_SERVICE_ID;

export const pwipPrimePlanId = process.env.NEXT_PUBLIC_PWIP_PRIME_PLAN_ID;

// Razorpay configs
export const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

// auth configs
export const auth0BaseURL = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL;
export const auth0ClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
export const auth0ClientSecret = process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET;

export let api = axios.create({
  baseURL: apiBaseURL + "api", // Replace with your API base URL
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export function getCostingToSaveHistoryPayload(inputJson) {
  return {
    costingName:
      inputJson?.costingName ||
      `${inputJson?.details?.variantObject?.variantName} - ${inputJson?.details?.destinationObject?.portName}`,
    brokenPercentage: inputJson?.details?.variantObject?.brokenPercentage || 0,
    unit: "mt",
    _variantId: inputJson?.details?.variantObject?._variantId,
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
    isExportDuty: inputJson?.constants?.exportDutyCharge ? true : false,
    isPwipFullfillment: inputJson?.constants?.pwipFullfillment ? true : false,
    termOfAgreement: inputJson?.grandTotalFob ? "FOB" : "CIF",
    costOfRice: inputJson?.costing?.exmillPrice,
    bagPrice: inputJson?.costing?.package,
    transportation: inputJson?.costing?.transportCharge,
    cfsHandling: inputJson?.costing?.cfsHandling,
    shippingLineLocals: inputJson?.costing?.shlCost,
    OFC: inputJson?.costing?.ofcCost || 0,
    inspectionCost: inputJson?.constants?.inspectionCharge,
    insurance: inputJson?.constants?.insurance,
    financeCost: inputJson?.constants?.financeCost,
    overhead: inputJson?.constants?.overHeadCharge,
    margin: inputJson?.constants?.margin,
    exportDuty: inputJson?.constants?.exportDutyCharge || 0,
    pwipFullfillment: inputJson?.constants?.pwipFullfillment || 0,
    FOB: inputJson?.grandTotalFob || 0,
    CIF: inputJson?.grandTotalCif || 0,
    grandTotal: inputJson?.grandTotal || 0,
  };
}

export function generatePayloadForCustomCosting(givenData) {
  const payload = {
    shipmentTermType: givenData.shipmentTermType,
    currentUnit: givenData.unit,
    unitToConvert: givenData.unit,
    _variantId: givenData._variantId._id,
    sourceRateId: Array.isArray(givenData?._variantId?.sourceRates)
      ? givenData._variantId.sourceRates[0]._id
      : givenData._variantId.sourceRates._id,
    sourceId: givenData?._variantId?.sourceObject?._id || givenData?._sourceId, //givenData._variantId.sourceRates[0]._sourceId,
    _sourceId: givenData?._variantId?.sourceObject?._id || givenData?._sourceId,
    _originId: givenData._originId._id,
    _destinationId: givenData._destinationId._id,
    _containerId: givenData._containerId._id,
    _bagId: givenData._bagId._id,
    variantCost: givenData.costOfRice,
    brokenPercent: givenData.brokenPercentage,
    containersWeight: givenData.containerWeight * givenData.containersCount,
    totalContainers: parseFloat(givenData.containersCount) || 1,
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
    exportDutyValue: givenData.exportDutyValue || 0,
    fulfilledByPwip: givenData.pwipFullfillment,
  };
  return payload;
}

export function intersectObjects(refPayload, formValues) {
  const result = {};

  for (const key in refPayload) {
    if (formValues.hasOwnProperty(key)) {
      result[key] = formValues[key];
    }
  }

  return result;
}

export function getChangedPropertiesFromObject(original, updated) {
  const changedProperties = {};

  for (const key in updated) {
    if (original[key] !== updated[key]) {
      changedProperties[key] = updated[key];
    }
  }

  return changedProperties;
}

export function convertUnits(currentUnit, neededUnit, value) {
  // Define conversion factors for each unit
  const conversionFactors = {
    kg: 1,
    qt: 0.01, // 1 quintal = 10 kg
    mt: 0.001, // 1 metric ton = 1000 kg
  };

  // Check if the units are valid
  if (!conversionFactors[currentUnit] || !conversionFactors[neededUnit]) {
    return "Invalid units provided";
  }

  // Convert the price to the needed unit
  const priceInNeededUnit = (
    (parseFloat(value) * parseFloat(conversionFactors[currentUnit])) /
    parseFloat(conversionFactors[neededUnit])
  ).toFixed(2);

  return priceInNeededUnit;
}

export function secondsToMinutes(seconds) {
  // Calculate minutes
  const minutes = Math.floor(seconds / 60);

  // Calculate remaining seconds
  const remainingSeconds = seconds % 60;

  // Format the result with two decimal places
  const formattedMinutes = `${minutes}.${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;

  return formattedMinutes;
}

export function getStateAbbreviation(stateName) {
  if (stateName) {
    const stateAbbreviations = {
      "Andhra Pradesh": "AP",
      "Arunachal Pradesh": "AR",
      Assam: "AS",
      Bihar: "BR",
      Chhattisgarh: "CG",
      Goa: "GA",
      Gujarat: "GJ",
      Haryana: "HR",
      "Himachal Pradesh": "HP",
      "Jammu and Kashmir": "JK",
      Jharkhand: "JH",
      Karnataka: "KA",
      Kerala: "KL",
      "Madhya Pradesh": "MP",
      Maharashtra: "MH",
      Manipur: "MN",
      Meghalaya: "ML",
      Mizoram: "MZ",
      Nagaland: "NL",
      Odisha: "OD",
      Punjab: "PB",
      Rajasthan: "RJ",
      Sikkim: "SK",
      "Tamil Nadu": "TN",
      Tripura: "TR",
      Uttarakhand: "UK",
      "Uttar Pradesh": "UP",
      "West Bengal": "WB",
      "Andaman and Nicobar Islands": "AN",
      Chandigarh: "CH",
      "Dadra and Nagar Haveli": "DH",
      "Daman and Diu": "DD",
      Delhi: "DL",
      Lakshadweep: "LD",
      Pondicherry: "PY",
      Telangana: "TS",
    };

    // Convert the input to title case for better matching
    const formattedStateName = stateName
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Check if the provided stateName exists in the mapping, if not return null
    return stateAbbreviations[formattedStateName] || null;
  }
}

export function getDateRangeByPeriod(period) {
  const currentDate = new Date();
  let startDate, endDate;

  switch (period) {
    case "2W":
      startDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      endDate = currentDate;
      break;
    case "3W":
      startDate = new Date(currentDate.getTime() - 21 * 24 * 60 * 60 * 1000);
      endDate = currentDate;
      break;
    case "1M":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      endDate = currentDate;
      break;
    case "2M":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        1
      );
      endDate = currentDate;
      break;
    case "3M":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 3,
        1
      );
      endDate = currentDate;
      break;
    case "4M":
      startDate = new Date(
        Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - 4, 1)
      );
      endDate = currentDate;
      break;
    case "6M":
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 6,
        1
      );
      endDate = currentDate;
      break;
    case "1Y":
      startDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        1
      );
      endDate = currentDate;
      break;
    case "2Y":
      startDate = new Date(
        currentDate.getFullYear() - 2,
        currentDate.getMonth(),
        1
      );
      endDate = currentDate;
      break;
    default:
      startDate = null;
      endDate = null;
      break;
  }

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

export function getUniqueObjectsBySourceId(inputArray) {
  const uniqueObjects = {};

  inputArray.forEach((item) => {
    const sourceId = item._sourceId;

    // Check if the sourceId is already in the result object
    if (!uniqueObjects[sourceId]) {
      // If not found, add the current object to the result object
      uniqueObjects[sourceId] = {
        ...item,
        totalVariants: 1,
        variants: [item.variant],
      };
    } else {
      // If found, increment the totalVariants count and add the variant to the array
      uniqueObjects[sourceId].totalVariants += 1;
      uniqueObjects[sourceId].variants.push(item.variant);
    }
  });

  // Convert the result object to an array
  const resultArray = Object.values(uniqueObjects);

  return resultArray;
}

import {
  SET_TERMS_OF_SHIPMENT_REQUEST,
  SET_TERMS_OF_SHIPMENT_SUCCESS,
  SET_TERMS_OF_SHIPMENT_FAILURE,
} from "./types/shipmentTerms.types";

// Destination
export const setTermsOfShipmentRequest = (data) => ({
  type: SET_TERMS_OF_SHIPMENT_REQUEST,
  payload: data,
});

export const setTermsOfShipmentSuccess = (data) => ({
  type: SET_TERMS_OF_SHIPMENT_SUCCESS,
  payload: data,
});

export const setTermsOfShipmentFailure = (error) => ({
  type: SET_TERMS_OF_SHIPMENT_FAILURE,
  payload: error,
});

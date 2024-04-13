import {
  // POL
  SET_SELECTED_POL_FOR_OFC_REQUEST,
  SET_SELECTED_POL_FOR_OFC_SUCCESS,
  SET_SELECTED_POL_FOR_OFC_FAILURE,

  //   POD
  SET_SELECTED_POD_FOR_OFC_REQUEST,
  SET_SELECTED_POD_FOR_OFC_SUCCESS,
  SET_SELECTED_POD_FOR_OFC_FAILURE,
} from "./types/ofc.types";

// POL
export const setSelectedPOLForOFCRequest = (pol) => ({
  type: SET_SELECTED_POL_FOR_OFC_REQUEST,
  payload: {
    portOfLoading: pol,
  },
});

export const setSelectedPOLForOFCSuccess = (pol) => ({
  type: SET_SELECTED_POL_FOR_OFC_SUCCESS,
  payload: pol,
});

export const setSelectedPOLForOFCFailure = (error) => ({
  type: SET_SELECTED_POL_FOR_OFC_FAILURE,
  payload: error,
});

// POD
export const setSelectedPODForOFCRequest = (pod) => ({
  type: SET_SELECTED_POD_FOR_OFC_REQUEST,
  payload: {
    portOfDestination: pod,
  },
});

export const setSelectedPODForOFCSuccess = (pod) => ({
  type: SET_SELECTED_POD_FOR_OFC_SUCCESS,
  payload: pod,
});

export const setSelectedPODForOFCFailure = (error) => ({
  type: SET_SELECTED_POD_FOR_OFC_FAILURE,
  payload: error,
});

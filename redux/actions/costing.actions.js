import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,

  // GENERATE COSTING
  GENERATE_COSTING_REQUEST,
  GENERATE_COSTING_SUCESS,
  GENERATE_COSTING_FAILURE,

  // Custom costing
  SET_CUSTOM_COSTING_SELECTION_SUCCESS,
  SET_CUSTOM_COSTING_SELECTION_FAILURE,
} from "./types/costing.types";

export const setCostingSelection = (selected) => ({
  type: SET_COSTING_SELECTION,
  payload: selected,
});

export const resetCostingSelection = () => ({
  type: RESET_COSTING_SELECTION,
});

// custom costing
export const setCustomCostingSelection = (selected) => ({
  type: SET_CUSTOM_COSTING_SELECTION_SUCCESS,
  payload: selected,
});

export const resetCustomCostingSelection = () => ({
  type: SET_CUSTOM_COSTING_SELECTION_FAILURE,
});

// generate costing
export const generateQuickCostingRequest = (requestData) => ({
  type: GENERATE_COSTING_REQUEST,
  payload: requestData,
});

export const fetchGeneratedCostingSuccess = (costing) => ({
  type: GENERATE_COSTING_SUCESS,
  payload: costing,
});

export const fetchGeneratedCostingFailure = () => ({
  type: GENERATE_COSTING_FAILURE,
});

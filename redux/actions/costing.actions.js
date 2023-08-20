import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,

  // GENERATE COSTING
  GENERATE_COSTING_REQUEST,
  GENERATE_COSTING_SUCESS,
  GENERATE_COSTING_FAILURE,
} from "./types/costing.types";

export const setCostingSelection = (selected) => ({
  type: SET_COSTING_SELECTION,
  payload: selected,
});

export const resetCostingSelection = () => ({
  type: RESET_COSTING_SELECTION,
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

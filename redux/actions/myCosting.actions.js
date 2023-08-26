import {
  SAVE_COSTING_REQUEST,
  SAVE_COSTING_SUCCESS,
  SAVE_COSTING_FAILURE,
  UPDATE_COSTING_REQUEST,
  UPDATE_COSTING_SUCCESS,
  UPDATE_COSTING_FAILURE,
  FETCH_MY_COSTING_REQUEST,
  FETCH_MY_COSTING_SUCCESS,
  FETCH_MY_COSTING_FAILURE,
  FETCH_ALL_MY_COSTINGS_REQUEST,
  FETCH_ALL_MY_COSTINGS_SUCCESS,
  FETCH_ALL_MY_COSTINGS_FAILURE,
} from "./types/myCosting.types";

// Save costing
export const saveCostingRequest = (requestData) => {
  return {
    type: SAVE_COSTING_REQUEST,
    payload: requestData,
  };
};

export const saveCostingSuccess = (costing) => ({
  type: SAVE_COSTING_SUCCESS,
  payload: costing,
});

export const saveCostingFailure = () => ({
  type: SAVE_COSTING_FAILURE,
});

// Update costing
export const updateCostingRequest = (requestData) => {
  return {
    type: UPDATE_COSTING_REQUEST,
    payload: requestData,
  };
};

export const updateCostingSuccess = (costing) => ({
  type: UPDATE_COSTING_SUCCESS,
  payload: costing,
});

export const updateCostingFailure = () => ({
  type: UPDATE_COSTING_FAILURE,
});

// Get my costing
export const fetchMyCostingRequest = (id) => {
  return {
    type: FETCH_MY_COSTING_REQUEST,
    payload: id,
  };
};

export const fetchMyCostingSuccess = (costing) => ({
  type: FETCH_MY_COSTING_SUCCESS,
  payload: costing,
});

export const fetchMyCostingFailure = () => ({
  type: FETCH_MY_COSTING_FAILURE,
});

// fetch all my costings
export const fetchAllMyCostingsRequest = () => {
  return {
    type: FETCH_ALL_MY_COSTINGS_REQUEST,
  };
};

export const fetchAllMyCostingsSuccess = (costing) => ({
  type: FETCH_ALL_MY_COSTINGS_SUCCESS,
  payload: costing,
});

export const fetchAllMyCostingsFailure = () => ({
  type: FETCH_ALL_MY_COSTINGS_FAILURE,
});

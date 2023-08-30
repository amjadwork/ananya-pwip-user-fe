import {
  SHOW_LOADER_REQUEST,
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
  SET_FOREX_RATE_REQUEST,
  SET_FOREX_RATE_SUCCESS,
  SET_FOREX_RATE_FAILURE,
} from "./types/utils.types";

// loader
export const LoaderRequest = () => ({
  type: SHOW_LOADER_REQUEST,
});

export const showLoaderSuccess = () => ({
  type: SHOW_LOADER_SUCCESS,
});

export const hideLoaderFailure = () => ({
  type: SHOW_LOADER_FAILURE,
});

// forex rate
export const forexRateRequest = (data) => {
  return {
    type: SET_FOREX_RATE_REQUEST,
    payload: data,
  };
};

export const forexRateSuccess = (action) => {
  return {
    type: SET_FOREX_RATE_SUCCESS,
    payload: action.payload,
  };
};

export const forexRateFailure = () => ({
  type: SET_FOREX_RATE_FAILURE,
});

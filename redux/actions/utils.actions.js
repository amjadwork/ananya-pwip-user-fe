/** @format */

import {
  SHOW_LOADER_REQUEST,
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
  SET_FOREX_RATE_REQUEST,
  SET_FOREX_RATE_SUCCESS,
  SET_FOREX_RATE_FAILURE,
  SET_SEARCH_SCREEN_REQUEST,
  SET_SEARCH_SCREEN_SUCCESS,
  SET_SEARCH_SCREEN_FAILURE,

  // SEND
  SET_OTP_SEND_REQUEST,
  SET_OTP_RECEIVED_SUCCESS,
  SET_OTP_RECEIVED_FAILURE,
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

export const forexRateSuccess = (data) => {
  return {
    type: SET_FOREX_RATE_SUCCESS,
    payload: data,
  };
};

export const forexRateFailure = () => ({
  type: SET_FOREX_RATE_FAILURE,
});

// search screen
export const searchScreenRequest = (data) => {
  return {
    type: SET_SEARCH_SCREEN_REQUEST,
    payload: data,
  };
};

export const searchScreenSuccess = (action) => {
  return {
    type: SET_SEARCH_SCREEN_SUCCESS,
    payload: action.payload,
  };
};

export const searchScreenFailure = () => ({
  type: SET_SEARCH_SCREEN_FAILURE,
});

// SEND OTP AND VERIFY
export const sendOTPRequest = (phone) => {
  return {
    type: SET_OTP_SEND_REQUEST,
    payload: phone,
  };
};

export const otpRecievedSuccess = (action) => {
  return {
    type: SET_OTP_RECEIVED_SUCCESS,
    payload: action.payload,
  };
};

export const otpRecievedFailure = () => ({
  type: SET_OTP_RECEIVED_FAILURE,
});

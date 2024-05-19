/** @format */

import {
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
  SET_FOREX_RATE_SUCCESS,
  SET_FOREX_RATE_FAILURE,
  SET_SEARCH_SCREEN_SUCCESS,
  SET_SEARCH_SCREEN_FAILURE,

  // OTP & Verify
  SET_OTP_RECEIVED_SUCCESS,
  SET_OTP_RECEIVED_FAILURE,

  // verify
  SET_VERIFY_OTP_RESPONSE_SUCCESS,
  SET_VERIFY_OTP_RESPONSE_FAILURE,
} from "../actions/types/utils.types";

const initialState = {
  showLoader: false,
  forexRate: {
    USD: 0,
  },
  searchScreenActive: false,
  otpDetails: null,
  verifyOTPResponse: null,
};

const utilsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER_SUCCESS:
      return {
        ...state,
        showLoader: true,
      };
    case SHOW_LOADER_FAILURE:
      return {
        ...state,
        showLoader: false,
      };

    case SET_FOREX_RATE_SUCCESS:
      return {
        ...state,
        forexRate: {
          USD: parseFloat(
            action.payload?.rates?.INR || action.payload?.INR
          ).toFixed(1),
        },
      };
    case SET_FOREX_RATE_FAILURE:
      return {
        ...state,
        forexRate: {
          USD: 0,
        },
      };

    case SET_SEARCH_SCREEN_SUCCESS:
      return {
        ...state,
        searchScreenActive: true,
      };
    case SET_SEARCH_SCREEN_FAILURE:
      return {
        ...state,
        searchScreenActive: false,
      };

    // otp & verify
    case SET_OTP_RECEIVED_SUCCESS:
      return {
        ...state,
        otpDetails: action.payload,
      };
    case SET_OTP_RECEIVED_FAILURE:
      return {
        ...state,
        otpDetails: null,
      };

    // verify
    case SET_VERIFY_OTP_RESPONSE_SUCCESS:
      return {
        ...state,
        verifyOTPResponse: action.payload,
      };
    case SET_VERIFY_OTP_RESPONSE_FAILURE:
      return {
        ...state,
        verifyOTPResponse: null,
      };

    default:
      return state;
  }
};

export default utilsReducer;

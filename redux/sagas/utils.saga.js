/** @format */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  SHOW_LOADER_REQUEST,
  SET_FOREX_RATE_REQUEST,
  SET_SEARCH_SCREEN_REQUEST,

  // otp & verify
  SET_OTP_SEND_REQUEST,
  SET_VERIFY_OTP_RESPONSE_REQUEST,
} from "../actions/types/utils.types";
import {
  showLoaderSuccess,
  hideLoaderFailure,
  forexRateSuccess,
  forexRateFailure,
  searchScreenSuccess,
  searchScreenFailure,

  // otp & verify
  otpRecievedSuccess,
  otpRecievedFailure,
  verifyOTPResponseSuccess,
  verifyOTPResponseFailure,
} from "../actions/utils.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* setLoaderUtil(data) {
  try {
    yield put(showLoaderSuccess(data));
  } catch (error) {
    yield put(hideLoaderFailure(error));
  }
}

function* setForexRateUtil() {
  try {
    const response = yield call(makeApiCall, "/forexrate?currency=usd", "get");
    if (response.data) {
      yield put(forexRateSuccess(response.data));
    } else {
      yield put(forexRateSuccess(response));
    }
  } catch (error) {
    yield put(forexRateFailure(error));
  }
}

function* setSearchScreenUtil(data) {
  try {
    yield put(searchScreenSuccess(data));
  } catch (error) {
    yield put(searchScreenFailure());
  }
}

function* setOTPforPhoneVerification(action) {
  try {
    if (!action?.payload?.phone) {
      throw "Phone is required!";
    }

    const payload = {
      phone: action?.payload?.phone?.toString(),
    };

    const response = yield call(
      makeApiCall,
      "/communication/whatsapp/send-otp",
      "post",
      payload
    );

    if (response?.data) {
      yield put(otpRecievedSuccess(response?.data));
    }
  } catch (error) {
    yield put(otpRecievedFailure());
  }
}

function* verifyOTPforPhone(action) {
  try {
    const payload = {
      ...action?.payload,
      is_phone_verified: 1,
    };

    const response = yield call(
      makeApiCall,
      "/communication/whatsapp/verify-otp",
      "post",
      payload
    );

    if (response?.data) {
      yield put(verifyOTPResponseSuccess(response?.data));
    }
  } catch (error) {
    yield put(verifyOTPResponseSuccess(error?.response?.data));
  }
}

export default function* utilsSaga() {
  yield takeLatest(SHOW_LOADER_REQUEST, setLoaderUtil);
  yield takeLatest(SET_FOREX_RATE_REQUEST, setForexRateUtil);
  yield takeLatest(SET_SEARCH_SCREEN_REQUEST, setSearchScreenUtil);
  yield takeLatest(SET_OTP_SEND_REQUEST, setOTPforPhoneVerification);

  yield takeLatest(SET_VERIFY_OTP_RESPONSE_REQUEST, verifyOTPforPhone);
}

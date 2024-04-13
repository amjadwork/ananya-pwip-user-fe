/** @format */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  SHOW_LOADER_REQUEST,
  SET_FOREX_RATE_REQUEST,
  SET_SEARCH_SCREEN_REQUEST,
} from "../actions/types/utils.types";
import {
  showLoaderSuccess,
  hideLoaderFailure,
  forexRateSuccess,
  forexRateFailure,
  searchScreenSuccess,
  searchScreenFailure,
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

export default function* utilsSaga() {
  yield takeLatest(SHOW_LOADER_REQUEST, setLoaderUtil);
  yield takeLatest(SET_FOREX_RATE_REQUEST, setForexRateUtil);
  yield takeLatest(SET_SEARCH_SCREEN_REQUEST, setSearchScreenUtil);
}

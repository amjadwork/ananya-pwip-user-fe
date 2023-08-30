import { put, takeLatest } from "redux-saga/effects";
import {
  SHOW_LOADER_REQUEST,
  SET_FOREX_RATE_REQUEST,
} from "../actions/types/utils.types";
import {
  showLoaderSuccess,
  hideLoaderFailure,
  forexRateSuccess,
  forexRateFailure,
} from "../actions/utils.actions";

function* setLoaderUtil(data) {
  try {
    yield put(showLoaderSuccess(data));
  } catch (error) {
    yield put(hideLoaderFailure(error));
  }
}

function* setForexRateUtil(data) {
  try {
    yield put(forexRateSuccess(data));
  } catch (error) {
    yield put(forexRateFailure(error));
  }
}

export default function* utilsSaga() {
  yield takeLatest(SHOW_LOADER_REQUEST, setLoaderUtil);
  yield takeLatest(SET_FOREX_RATE_REQUEST, setForexRateUtil);
}

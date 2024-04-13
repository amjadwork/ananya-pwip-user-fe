import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  SET_SELECTED_POL_FOR_OFC_REQUEST,
  SET_SELECTED_POD_FOR_OFC_REQUEST,
} from "../actions/types/ofc.types";
import {
  setSelectedPOLForOFCSuccess,
  setSelectedPOLForOFCFailure,
  setSelectedPODForOFCSuccess,
  setSelectedPODForOFCFailure,
} from "../actions/ofc.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* setSelectedPOL(action) {
  const { portOfLoading } = action?.payload;

  try {
    yield put(setSelectedPOLForOFCSuccess(portOfLoading));
  } catch (error) {
    yield put(setSelectedPOLForOFCFailure(error));
  }
}

function* setSelectedPOD(action) {
  const { portOfDestination } = action?.payload;

  try {
    yield put(setSelectedPODForOFCSuccess(portOfDestination));
  } catch (error) {
    yield put(setSelectedPODForOFCFailure(error));
  }
}

export default function* ofcSaga() {
  yield takeLatest(SET_SELECTED_POL_FOR_OFC_REQUEST, setSelectedPOL);
  yield takeLatest(SET_SELECTED_POD_FOR_OFC_REQUEST, setSelectedPOD);
}

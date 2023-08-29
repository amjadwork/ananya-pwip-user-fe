import { call, put, takeLatest, select } from "redux-saga/effects";
import { SET_TERMS_OF_SHIPMENT_REQUEST } from "../actions/types/shipmentTerms.types";
import {
  setTermsOfShipmentSuccess,
  setTermsOfShipmentFailure,
} from "../actions/shipmentTerms.actions";

function* setShipmentTerms(action) {
  const { payload } = action;

  try {
    yield put(setTermsOfShipmentSuccess(payload));
  } catch (error) {
    yield put(setTermsOfShipmentFailure(error));
  }
}

export default function* shipmentTermsSaga() {
  yield takeLatest(SET_TERMS_OF_SHIPMENT_REQUEST, setShipmentTerms);
}

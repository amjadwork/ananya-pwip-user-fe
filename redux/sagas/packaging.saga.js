import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_PACKAGE_BAGS_REQUEST } from "../actions/types/packaging.types";
import {
  fetchPackagingBagsSuccess,
  fetchPackagingBagsFailure,
} from "../actions/packaging.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchPackagingBags() {
  try {
    const response = yield call(makeApiCall, "/packaging", "get");

    yield put(fetchPackagingBagsSuccess(response.data));
  } catch (error) {
    yield put(fetchPackagingBagsFailure(error));
  }
}

export default function* packagingBagsSaga() {
  yield takeLatest(FETCH_PACKAGE_BAGS_REQUEST, fetchPackagingBags);
}

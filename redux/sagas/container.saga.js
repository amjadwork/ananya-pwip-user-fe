import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_CONTAINERS_REQUEST } from "../actions/types/container.types";
import {
  fetchContainersSuccess,
  fetchContainersFailure,
} from "../actions/container.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchContainers() {
  try {
    const response = yield call(makeApiCall, "/container", "get");

    yield put(fetchContainersSuccess(response.data));
  } catch (error) {
    yield put(fetchContainersFailure(error));
  }
}

export default function* containerSaga() {
  yield takeLatest(FETCH_CONTAINERS_REQUEST, fetchContainers);
}

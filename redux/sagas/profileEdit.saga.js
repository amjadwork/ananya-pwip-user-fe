import { call, put, takeLatest } from "redux-saga/effects";
import {
  UPDATE_PROFILE_REQUEST,
  FETCH_PROFILE_REQUEST,
} from "../actions/types/profileEdit.types";
import {
  updateProfileSuccess,
  updateProfileFailure,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "../actions/profileEdit.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* updateProfileData(action) {
  const body = action.payload;
  try {
    const response = yield call(makeApiCall, "/profile", "patch", {
      ...body,
    });

    yield put(updateProfileSuccess(response.data));
  } catch (error) {
    yield put(updateProfileFailure(error));
  }
}

function* fetchProfileData() {
  try {
    const response = yield call(makeApiCall, `/profile`, "get");

    yield put(fetchProfileSuccess(response.data[0]));
  } catch (error) {
    yield put(fetchProfileFailure(error));
  }
}

export default function* profileEditSaga() {
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileData);
  yield takeLatest(FETCH_PROFILE_REQUEST, fetchProfileData);
}

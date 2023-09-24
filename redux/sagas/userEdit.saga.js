import { call, put, takeLatest } from "redux-saga/effects";
import {
  UPDATE_USER_REQUEST,
  FETCH_USER_REQUEST,
} from "../actions/types/userEdit.types";
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} from "../actions/userEdit.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* updateUserData(action) {
  try {
    const body = action.payload;

    const response = yield call(makeApiCall, "/user", "patch", {
      ...body,
    });

    if (response) {
      yield put(fetchUserRequest());
    }
  } catch (error) {
    yield put(fetchUserFailure(error));
  }
}

function* fetchUserData() {
  try {
    const response = yield call(makeApiCall, `/user`, "get");

    yield put(fetchUserSuccess(response.data[0]));
  } catch (error) {
    yield put(fetchUserFailure(error));
  }
}

export default function* userEditSaga() {
  yield takeLatest(UPDATE_USER_REQUEST, updateUserData);
  yield takeLatest(FETCH_USER_REQUEST, fetchUserData);
}

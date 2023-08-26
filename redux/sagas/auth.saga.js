import { takeLatest, put } from "redux-saga/effects";
import { setAuthData } from "../actions/auth.actions";
import { AUTH_SUCCESS } from "../actions/types/auth.types";

function* handleAuthSuccess(action) {
  const { user, token } = action.payload;
  yield put(setAuthData(user, token));
}

function* authSaga() {
  yield takeLatest(AUTH_SUCCESS, handleAuthSuccess);
}

export default authSaga;

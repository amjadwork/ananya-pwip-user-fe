import { takeLatest, put, call } from "redux-saga/effects";
import {
  handleSettingAuthDataSuccess,
  handleSettingAuthDataFailure,
} from "../actions/auth.actions";
import { SET_AUTH_DATA_REQUEST } from "../actions/types/auth.types";

import { makeApiCall } from "./_commonFunctions.saga";

function* handleAuthSuccessAndFailure(action) {
  const { user, token } = action.payload;

  try {
    if (user && token) {
      const body = {
        ...user,
        auth_id: user.sub,
      };

      const response = yield call(
        makeApiCall,
        "/login",
        "post",
        body,
        null,
        token
      );

      if (response?.data) {
        yield put(
          handleSettingAuthDataSuccess(
            { ...user, ...response.data.data },
            token
          )
        );
      }
    }
  } catch (error) {
    yield put(handleSettingAuthDataFailure(error));
  }
}

function* authSaga() {
  yield takeLatest(SET_AUTH_DATA_REQUEST, handleAuthSuccessAndFailure);
}

export default authSaga;

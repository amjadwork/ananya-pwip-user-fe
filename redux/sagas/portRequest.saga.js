/** @format */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  POST_NEW_PORT_REQUEST,
} from "../actions/types/portRequest.types";
import {
  postNewPortSuccess,
  postNewPortFailure,
} from "../actions/portRequest.actions";

import { makeApiCall } from "./_commonFunctions.saga";

function* postNewPortSaga(action) {
const body = action.payload;
  try {
   const response = yield call(makeApiCall, "/request-port", "post", {
      ...body,
   });
      
    yield put(postNewPortSuccess(response.data));
  } catch (error) {
    yield put(postNewPortFailure(error.message));
  }
}

export default function* watchPostNewPort() {
  yield takeLatest(POST_NEW_PORT_REQUEST, postNewPortSaga);
}
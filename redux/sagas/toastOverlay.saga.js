import { put, takeLatest } from "redux-saga/effects";
import { TOAST_NOTIFICATION_REQUEST } from "../actions/types/toastOverlay.types";
import {
  showToastNotificationSuccess,
  hideToastNotificationFailure,
} from "../actions/toastOverlay.actions";

function* fetchToastOverlay(content) {
  try {
    yield put(showToastNotificationSuccess(content));
  } catch (error) {
    yield put(hideToastNotificationFailure(error));
  }
}

export default function* toastOverlaySaga() {
  yield takeLatest(TOAST_NOTIFICATION_REQUEST, fetchToastOverlay);
}

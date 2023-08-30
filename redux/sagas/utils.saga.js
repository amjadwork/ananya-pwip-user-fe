import { put, takeLatest } from "redux-saga/effects";
import { SHOW_LOADER_REQUEST } from "../actions/types/utils.types";
import { showLoaderSuccess, hideLoaderFailure } from "../actions/utils.actions";

function* setLoaderUtil(data) {
  try {
    yield put(showLoaderSuccess(data));
  } catch (error) {
    yield put(hideLoaderFailure(error));
  }
}

export default function* utilsSaga() {
  yield takeLatest(SHOW_LOADER_REQUEST, setLoaderUtil);
}

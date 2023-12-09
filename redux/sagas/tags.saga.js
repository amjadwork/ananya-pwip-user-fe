import { call, put, takeLatest, select } from "redux-saga/effects";
import { SET_TAGS_REQUEST } from "../actions/types/tags.types";
import { setTagsFetchSuccess, resetTagsFailure } from "../actions/tags.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchTagsData() {
  try {
    const response = yield call(makeApiCall, "/tags", "get");

    if (response) {
      yield put(setTagsFetchSuccess(response?.data || []));
    }
  } catch (error) {
    yield put(resetTagsFailure(error));
  }
}

export default function* tagsSaga() {
  yield takeLatest(SET_TAGS_REQUEST, fetchTagsData);
}

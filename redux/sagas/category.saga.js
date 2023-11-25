import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_CATEGORY_REQUEST } from "../actions/types/category.types";
import {
  fetchCategorySuccess,
  fetchCategoryFailure,
} from "../actions/category.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchCategory(action) {
  try {
    yield put(fetchCategorySuccess(action.payload));
  } catch (error) {
    yield put(fetchCategoryFailure());
  }
}

export default function* categorySaga() {
  yield takeLatest(FETCH_CATEGORY_REQUEST, fetchCategory);
}

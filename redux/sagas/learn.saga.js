import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_LEARN_LIST_REQUEST,
  SET_LEARN_DETAILS_ID_REQUEST,
  SET_LEARN_DETAILS_REQUEST,
} from "../actions/types/learn.types";
import {
  setLearnListSuccess,
  setLearnListFailure,
  setLearnIDSuccess,
  setLearnIDFailure,
  setLearnDetailSuccess,
  setLearnDetailFailure,
} from "../actions/learn.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* setLearnList() {
  try {
    const response = yield call(makeApiCall, "/learn", "get");
    yield put(setLearnListSuccess(response?.data));
  } catch (error) {
    yield put(setLearnListFailure(error));
  }
}

function* setLearnDetailID(action) {
  try {
    yield put(setLearnIDSuccess(action.payload));
  } catch (error) {
    yield put(setLearnIDFailure(error));
  }
}

function* setLearnDetail(action) {
  try {
    const id = action.payload;

    const response = yield call(makeApiCall, "/learn/" + id, "get");
    yield put(setLearnDetailSuccess(response?.data));
  } catch (error) {
    yield put(setLearnDetailFailure(error));
  }
}

export default function* learnListSaga() {
  yield takeLatest(FETCH_LEARN_LIST_REQUEST, setLearnList);
  yield takeLatest(SET_LEARN_DETAILS_ID_REQUEST, setLearnDetailID);
  yield takeLatest(SET_LEARN_DETAILS_REQUEST, setLearnDetail);
}

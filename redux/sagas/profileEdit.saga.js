import { call, put, takeLatest, select } from "redux-saga/effects";
import {
    SAVE_PROFILE_REQUEST,
    UPDATE_PROFILE_REQUEST,
    FETCH_MY_PROFILE_REQUEST,
  } from "../actions/types/profileEdit.types";
import {
  saveProfileSuccess,
  saveProfileFailure,
  updateProfileSuccess,
  updateProfileFailure,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "../actions/profileEdit.actions";
import { makeApiCall } from "./_commonFunctions.saga";



function* profileInfo(action) {
    const body = action.payload;
  
    try {
      const response = yield call(makeApiCall, "/saveCosting", "post", {
        ...body,
      });
  
      yield put(saveProfileSuccess(response.data));
    } catch (error) {
      yield put(saveProfileFailure(error));
    }
  }

function* updateProfileInfo(action) {
    try {
        const response = yield call(makeApiCall, "/login", "patch", {
            ...body,
          });
      yield put(updateProfileSuccess(response.data));
    } catch (error) {
      yield put(updateProfileFailure(error));    }
};


function* getProfileInfo(action) {
  const id = action.payload;
  try {
    const response = yield call(makeApiCall, "/login", "get");
    yield put(fetchProfileSuccess(response.data));
  } catch (error) {
    yield put(fetchProfileFailure(error));
  }
};

export default function* profileEditSaga() {
    yield takeLatest(SAVE_PROFILE_REQUEST, profileInfo);
    yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileInfo);
    yield takeLatest(FETCH_MY_PROFILE_REQUEST, getProfileInfo);
  }
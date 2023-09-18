import { call, put, takeLatest } from "redux-saga/effects";
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



function* saveProfileInfo(action) {
    const body = action.payload;
  
    try {
      const response = yield call(makeApiCall, "/profile", "post", {
        ...body,
      });
  
      yield put(saveProfileSuccess(response.data));
    } catch (error) {
      yield put(saveProfileFailure(error));
    }
  }

function* updateProfileInfo(action) {
  const body = action.payload;

    try {
        const response = yield call(makeApiCall, "/profile", "patch", {
            ...body,
          });
          
      yield put(updateProfileSuccess(response.data));
    } catch (error) {
      yield put(updateProfileFailure(error));    }
};


function* getProfileInfo(action) {
  const userId = action.id;
  try {
    const response = yield call(makeApiCall, `/profile/${id}`, "get");

    yield put(fetchProfileSuccess(response.data));
  } catch (error) {
    yield put(fetchProfileFailure(error));
  }
};

export default function* profileEditSaga() {
    yield takeLatest(SAVE_PROFILE_REQUEST, saveProfileInfo);
    yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfileInfo);
    yield takeLatest(FETCH_MY_PROFILE_REQUEST, getProfileInfo);
  }
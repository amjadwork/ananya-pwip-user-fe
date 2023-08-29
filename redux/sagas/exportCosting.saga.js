import { call, put, takeLatest, select } from "redux-saga/effects";
import { DOWNLOAD_REQUEST } from "../actions/types/exportCosting.types";
import {
  downloadCostingSuccess,
  downloadCostingFailure,
} from "../actions/exportCosting.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchDownloadCosting(action) {
  const { payload } = action;
  try {
    const response = yield call(
      makeApiCall,
      "/generateCostingSheet/download",
      "post",
      {
        ...payload,
      },
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
      }
    );

    yield put(downloadCostingSuccess(response.data));
  } catch (error) {
    yield put(downloadCostingFailure(error));
  }
}

export default function* exportCostingSaga() {
  yield takeLatest(DOWNLOAD_REQUEST, fetchDownloadCosting);
}

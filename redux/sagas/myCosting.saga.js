import { call, put, takeLatest, select } from "redux-saga/effects";

import {
  SAVE_COSTING_REQUEST,
  UPDATE_COSTING_REQUEST,
  FETCH_MY_COSTING_REQUEST,
  FETCH_ALL_MY_COSTINGS_REQUEST,
} from "../actions/types/myCosting.types";
import {
  saveCostingSuccess,
  saveCostingFailure,
  updateCostingSuccess,
  updateCostingFailure,
  fetchMyCostingSuccess,
  fetchMyCostingFailure,
  fetchAllMyCostingsSuccess,
  fetchAllMyCostingsFailure,
} from "../actions/myCosting.actions";
import { setTermsOfShipmentRequest } from "../actions/shipmentTerms.actions";

import { makeApiCall } from "./_commonFunctions.saga";

function* myCostingSheet(action) {
  const body = action.payload;

  try {
    const response = yield call(makeApiCall, "/saveCosting", "post", {
      ...body,
    });

    yield put(saveCostingSuccess(response.data));
  } catch (error) {
    yield put(saveCostingFailure(error));
  }
}

function* updateMyCostingSheet(action) {
  const body = action.payload;

  try {
    const currentCostingFromHistory = yield select(
      (state) => state.myCosting.currentCostingFromHistory
    );
    const myRecentSavedCosting = yield select(
      (state) => state.myCosting.myRecentSavedCosting
    );

    const response = yield call(
      makeApiCall,
      `/historyCosting/${
        myRecentSavedCosting?._id ||
        currentCostingFromHistory[0]?._id ||
        currentCostingFromHistory?._id
      }`,
      "patch",
      {
        ...body,
      }
    );

    yield put(updateCostingSuccess(response.data));
  } catch (error) {
    yield put(updateCostingFailure(error));
  }
}

function* getMyCostingSheetById(action) {
  const id = action.payload;

  let url = `/historyCosting/preview/${id}`;
  let secretHeader = null;

  if (action?.apiType === "shared") {
    url = `/historyCosting/sharedpreview/${id}`;
    secretHeader = {
      "secret-key": "5e4a8c7f9b89a7d2e3f8c89a7d2e3f8",
    };
  }

  try {
    if (id) {
      const response = yield call(makeApiCall, url, "get", null, {
        headers: {
          ...secretHeader,
        },
      });

      if (action?.apiType === "shared") {
        const action = {
          selected: response.data[0]?.termOfAgreement || "FOB",
          showShipmentTermDropdown: false,
        };
        yield put(setTermsOfShipmentRequest(action));

        sessionStorage.setItem("previewIdData", JSON.stringify(response.data));
      }

      yield put(fetchMyCostingSuccess(response.data));
    }
  } catch (error) {
    yield put(fetchMyCostingFailure(error));
  }
}

function* getAllMyCostingSheets() {
  try {
    const response = yield call(makeApiCall, `/myCosting`, "get");

    yield put(fetchAllMyCostingsSuccess(response.data));
  } catch (error) {
    yield put(fetchAllMyCostingsFailure(error));
  }
}

export default function* myCostingSaga() {
  yield takeLatest(SAVE_COSTING_REQUEST, myCostingSheet);
  yield takeLatest(UPDATE_COSTING_REQUEST, updateMyCostingSheet);
  yield takeLatest(FETCH_MY_COSTING_REQUEST, getMyCostingSheetById);
  yield takeLatest(FETCH_ALL_MY_COSTINGS_REQUEST, getAllMyCostingSheets);
}

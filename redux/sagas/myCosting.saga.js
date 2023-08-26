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

import { api } from "@/utils/helper";

function* myCostingSheet(action) {
  const body = action.payload;

  try {
    const authState = yield select((state) => state.auth);

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      api.post,
      "/saveCosting",
      { ...body },
      {
        headers: {
          ...headers,
        },
      }
    );

    yield put(saveCostingSuccess(response.data));
  } catch (error) {
    yield put(saveCostingFailure(error));
  }
}

function* updateMyCostingSheet(action) {
  const body = action.payload;

  try {
    const authState = yield select((state) => state.auth);
    const myRecentSavedCosting = yield select(
      (state) => state.myCosting.myRecentSavedCosting
    );

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      api.patch,
      `/historyCosting/${myRecentSavedCosting._id}`,
      { ...body },
      {
        headers: {
          ...headers,
        },
      }
    );

    yield put(updateCostingSuccess(response.data));
  } catch (error) {
    yield put(updateCostingFailure(error));
  }
}

function* getMyCostingSheetById(action) {
  const id = action.payload;
  try {
    const authState = yield select((state) => state.auth);

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(api.get, `/historyCosting/preview/${id}`, {
      headers: {
        ...headers,
      },
    });

    yield put(fetchMyCostingSuccess(response.data));
  } catch (error) {
    yield put(fetchMyCostingFailure(error));
  }
}

function* getAllMyCostingSheets(action) {
  const id = action.payload;
  try {
    const authState = yield select((state) => state.auth);

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(api.get, `/myCosting`, {
      headers: {
        ...headers,
      },
    });

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

import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
  SET_COSTING_SELECTION_SUCCESS,
  RESET_COSTING_SELECTION_SUCCESS,
  GENERATE_COSTING_REQUEST,
} from "../actions/types/costing.types";
import {
  setCostingSelection,
  resetCostingSelection,
  fetchGeneratedCostingSuccess,
  fetchGeneratedCostingFailure,
} from "../actions/costing.actions";

function* setCostingSheetOptions(action) {
  const { product, portOfDestination } = action.payload;
  yield put(setCostingSelection({ product, portOfDestination }));
}

function* resetCostingSheetOptions() {
  yield put(resetCostingSelection());
}

function* generateQuickCostingSheet(action) {
  const body = action.payload;

  try {
    const authState = yield select((state) => state.auth); // Assuming your token is stored in auth reducer

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      axios.post,
      "https://api-stage.pwip.co/api" + "/quick-costing",
      { ...body },
      {
        headers: {
          ...headers,
        },
      }
    );
    yield put(fetchGeneratedCostingSuccess(response.data));
  } catch (error) {
    yield put(fetchGeneratedCostingFailure(error));
  }
}

export default function* costingSaga() {
  yield takeLatest(SET_COSTING_SELECTION_SUCCESS, setCostingSheetOptions);
  yield takeLatest(RESET_COSTING_SELECTION_SUCCESS, resetCostingSheetOptions);
  yield takeLatest(GENERATE_COSTING_REQUEST, generateQuickCostingSheet);
}

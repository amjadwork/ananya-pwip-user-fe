import { put, takeLatest } from "redux-saga/effects";
import {
  SET_COSTING_SELECTION_SUCCESS,
  SET_COSTING_SELECTION_FAILURE,
} from "../actions/types/costing.types";
import {
  setCostingSelection,
  resetCostingSelection,
} from "../actions/costing.actions";

function* setCostingSheet(action) {
  const { product, portOfDestination } = action.payload;
  yield put(setCostingSelection({ product, portOfDestination }));
}

function* resetCostingSheet() {
  yield put(resetCostingSelection());
}

export default function* costingSaga() {
  yield takeLatest(SET_COSTING_SELECTION_SUCCESS, setCostingSheet);
  yield takeLatest(SET_COSTING_SELECTION_FAILURE, resetCostingSheet);
}

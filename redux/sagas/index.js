import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import productsSaga from "./products.saga";
import costingSaga from "./costing.saga";

function* rootSaga() {
  yield all([authSaga(), productsSaga(), costingSaga()]);
}

export default rootSaga;

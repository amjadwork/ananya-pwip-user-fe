import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import productsSaga from "./products.saga";
import costingSaga from "./costing.saga";
import locationSaga from "./location.saga";
import packagingBagsSaga from "./packaging.saga";
import containerSaga from "./container.saga";
import myCostingSaga from "./myCosting.saga";

function* rootSaga() {
  yield all([
    authSaga(),
    productsSaga(),
    costingSaga(),
    locationSaga(),
    packagingBagsSaga(),
    containerSaga(),
    myCostingSaga(),
  ]);
}

export default rootSaga;

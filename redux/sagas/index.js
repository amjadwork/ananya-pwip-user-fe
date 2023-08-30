import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import productsSaga from "./products.saga";
import costingSaga from "./costing.saga";
import locationSaga from "./location.saga";
import packagingBagsSaga from "./packaging.saga";
import containerSaga from "./container.saga";
import myCostingSaga from "./myCosting.saga";
import toastOverlaySaga from "./toastOverlay.saga";
import exportCostingSaga from "./exportCosting.saga";
import shipmentTermsSaga from "./shipmentTerms.saga";
import utilsSaga from "./utils.saga";

function* rootSaga() {
  yield all([
    authSaga(),
    productsSaga(),
    costingSaga(),
    locationSaga(),
    packagingBagsSaga(),
    containerSaga(),
    myCostingSaga(),
    toastOverlaySaga(),
    exportCostingSaga(),
    shipmentTermsSaga(),
    utilsSaga(),
  ]);
}

export default rootSaga;

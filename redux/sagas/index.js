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
import profileEditSaga from "./profileEdit.saga";
import userEditSaga from "./userEdit.saga";
import subscriptionSaga from "./subscription.saga";
import categorySaga from "./category.saga";

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
    profileEditSaga(),
    userEditSaga(),
    subscriptionSaga(),
    categorySaga(),
  ]);
}

export default rootSaga;

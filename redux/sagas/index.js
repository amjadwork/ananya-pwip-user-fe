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
import learnListSaga from "./learn.saga";
import tagsSaga from "./tags.saga";
import variantsWithPriceSaga from "./variant-prices.saga";
import variantsProfileSaga from "./variant-profile.saga";
import ofcSaga from "./ofc.saga";
import watchPostNewPort from "./portRequest.saga";

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
    learnListSaga(),
    tagsSaga(),
    variantsWithPriceSaga(),
    variantsProfileSaga(),
    ofcSaga(),
    watchPostNewPort(),
  ]);
}

export default rootSaga;

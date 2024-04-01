import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_VARIANT_PROFILE_REQUEST } from "../actions/types/variant-profile.type";
import {
  setVariantProfileSuccess,
  setVariantProfileFailure,
} from "../actions/variant-profile.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchVariantProfile(action) {
  const { variantId } = action?.payload;

  let url = `/service/rice-price/variant-profiles?variantId=${variantId}`;

  try {
    const response = yield call(makeApiCall, url, "get");

    yield put(setVariantProfileSuccess(response.data));
  } catch (error) {
    yield put(setVariantProfileFailure(error));
  }
}

export default function* variantsProfileSaga() {
  yield takeLatest(FETCH_VARIANT_PROFILE_REQUEST, fetchVariantProfile);
}

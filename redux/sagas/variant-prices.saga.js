import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_VARIANT_PRICE_REQUEST } from "../actions/types/variant-prices.types";
import {
  fetchVariantPriceSuccess,
  fetchVariantPriceFailure,
} from "../actions/variant-prices.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchVariantWithPrice() {
  try {
    const response = yield call(
      makeApiCall,
      "/service/rice-price/variant-price-list",
      "get"
    );

    yield put(fetchVariantPriceSuccess(response.data));
  } catch (error) {
    yield put(fetchVariantPriceFailure(error));
  }
}

export default function* variantsWithPriceSaga() {
  yield takeLatest(FETCH_VARIANT_PRICE_REQUEST, fetchVariantWithPrice);
}

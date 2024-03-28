import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
  FETCH_VARIANT_PRICE_REQUEST,
} from "../actions/types/variant-prices.types";
import {
  fetchVariantPriceSuccess,
  fetchVariantPriceFailure,
  addVariantToWatchlistSuccess,
  addVariantToWatchlistFailure,
  fetchAllWatchlistForVariantRequest,
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

// watchlist
function* addOrRemoveVariantInWatchlist(action) {
  const actionPayload = action?.payload;

  const body = {
    variantId: actionPayload?.variantId,
    sourceId: actionPayload?.sourceId,
    saved: actionPayload?.type === "add" ? true : false,
  };

  try {
    const response = yield call(
      makeApiCall,
      "/service/rice-price/variant-watchlist",
      "post",
      {
        ...body,
      }
    );

    if (response) {
      yield put(fetchAllWatchlistForVariantRequest());
    }
  } catch (error) {
    console.error(error);
  }
}

function* fetchWatchlistForVariant() {
  try {
    const response = yield call(
      makeApiCall,
      "/service/rice-price/variant-watchlist",
      "get"
    );

    if (response) {
      yield put(addVariantToWatchlistSuccess(response.data));
    }
  } catch (error) {
    yield put(addVariantToWatchlistFailure(error));
  }
}

export default function* variantsWithPriceSaga() {
  yield takeLatest(FETCH_VARIANT_PRICE_REQUEST, fetchVariantWithPrice);
  yield takeLatest(
    FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
    fetchWatchlistForVariant
  );

  yield takeLatest(
    ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
    addOrRemoveVariantInWatchlist
  );
}

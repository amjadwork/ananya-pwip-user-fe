import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
  FETCH_VARIANT_PRICE_REQUEST,
  SET_SELECTED_VARIANT_FOR_DETAIL_REQUEST,
  FETCH_VARIANT_PRICE_HISTORY_REQUEST,
} from "../actions/types/variant-prices.types";
import {
  fetchVariantPriceSuccess,
  fetchVariantPriceFailure,
  addVariantToWatchlistSuccess,
  addVariantToWatchlistFailure,
  fetchAllWatchlistForVariantRequest,
  selectedVariantForDetailSuccess,
  selectedVariantForDetailFailure,
  setVariantPriceHistorySuccess,
  setVariantPriceHistoryFailure,
} from "../actions/variant-prices.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchVariantWithPrice(action) {
  const query = action?.payload;

  console.log("query", query);

  const variantId = query?.variantId || null;
  const sourceId = query?.sourceId || null;

  let url = "/service/rice-price/variant-price-list";

  if (variantId && sourceId) {
    url = `/service/rice-price/variant-price-list?variantId=${variantId}&region=${sourceId}`;
  }

  try {
    const response = yield call(makeApiCall, url, "get");

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

function* setSelectedVariantDetailsData(action) {
  try {
    const response = action.payload;

    if (response) {
      yield put(selectedVariantForDetailSuccess(response));
    }
  } catch (error) {
    yield put(selectedVariantForDetailFailure(error));
  }
}

function* fetchVariantPriceRequestData(action) {
  try {
    const { variantId, sourceId, startDate, endDate } = action.payload;

    const response = yield call(
      makeApiCall,
      "/history/variant/" +
        variantId +
        `?sourceId=${sourceId}&startDate=${startDate}&endDate=${endDate}`,
      "get"
    );

    if (response) {
      yield put(setVariantPriceHistorySuccess(response?.data));
    }
  } catch (error) {
    console.log(error);
    yield put(setVariantPriceHistoryFailure(error));
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

  yield takeLatest(
    SET_SELECTED_VARIANT_FOR_DETAIL_REQUEST,
    setSelectedVariantDetailsData
  );

  yield takeLatest(
    FETCH_VARIANT_PRICE_HISTORY_REQUEST,
    fetchVariantPriceRequestData
  );
}

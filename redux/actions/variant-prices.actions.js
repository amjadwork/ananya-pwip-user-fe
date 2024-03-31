import {
  FETCH_VARIANT_PRICE_REQUEST,
  FETCH_VARIANT_PRICE_SUCCESS,
  FETCH_VARIANT_PRICE_FAILURE,

  // watchlist
  ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
  VARIANTS_WATCHLIST_SUCCESS,
  VARIANTS_WATCHLIST_FAILURE,

  // SELECTED VARIANT
  SET_SELECTED_VARIANT_FOR_DETAIL_REQUEST,
  SELECTED_VARIANT_FOR_DETAIL_SUCCESS,
  SELECTED_VARIANT_FOR_DETAIL_FAILURE,

  // PRICE HISTORY
  FETCH_VARIANT_PRICE_HISTORY_REQUEST,
  SET_VARIANT_PRICE_HISTORY_SUCCESS,
  SET_VARIANT_PRICE_HISTORY_FAILURE,
} from "./types/variant-prices.types";

export const fetchVariantPriceRequest = (variantId, sourceId) => ({
  type: FETCH_VARIANT_PRICE_REQUEST,
  payload: {
    variantId: variantId,
    sourceId: sourceId,
  },
});

export const fetchVariantPriceSuccess = (products) => ({
  type: FETCH_VARIANT_PRICE_SUCCESS,
  payload: products,
});

export const fetchVariantPriceFailure = (error) => ({
  type: FETCH_VARIANT_PRICE_FAILURE,
  payload: error,
});

// watchlist
export const fetchAllWatchlistForVariantRequest = () => ({
  type: FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
});

export const addVariantToWatchlistRequest = (variantId, sourceId, type) => ({
  type: ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
  payload: {
    variantId: variantId,
    sourceId: sourceId,
    type: type,
  },
});

export const addVariantToWatchlistSuccess = (data) => ({
  type: VARIANTS_WATCHLIST_SUCCESS,
  payload: data,
});

export const addVariantToWatchlistFailure = (error) => ({
  type: VARIANTS_WATCHLIST_FAILURE,
  payload: error,
});

// SELECTED VARIANT
export const setSelectedVariantForDetailRequest = (data) => ({
  type: SET_SELECTED_VARIANT_FOR_DETAIL_REQUEST,
  payload: data,
});

export const selectedVariantForDetailSuccess = (detail) => ({
  type: SELECTED_VARIANT_FOR_DETAIL_SUCCESS,
  payload: detail,
});

export const selectedVariantForDetailFailure = (error) => ({
  type: SELECTED_VARIANT_FOR_DETAIL_FAILURE,
  payload: error,
});

// VARIANT_PRICE_HISTORY
export const fetchVariantPriceHistoryRequest = (
  variantId,
  sourceId,
  startDate,
  endDate
) => ({
  type: FETCH_VARIANT_PRICE_HISTORY_REQUEST,
  payload: {
    variantId: variantId,
    sourceId: sourceId,
    startDate: startDate,
    endDate: endDate,
  },
});

export const setVariantPriceHistorySuccess = (data) => ({
  type: SET_VARIANT_PRICE_HISTORY_SUCCESS,
  payload: data,
});

export const setVariantPriceHistoryFailure = (error) => ({
  type: SET_VARIANT_PRICE_HISTORY_FAILURE,
  payload: error,
});

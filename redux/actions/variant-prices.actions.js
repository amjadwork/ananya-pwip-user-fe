import {
  FETCH_VARIANT_PRICE_REQUEST,
  FETCH_VARIANT_PRICE_SUCCESS,
  FETCH_VARIANT_PRICE_FAILURE,

  // watchlist
  ADD_REMOVE_VARIANT_IN_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_FOR_VARIANT_REQUEST,
  VARIANTS_WATCHLIST_SUCCESS,
  VARIANTS_WATCHLIST_FAILURE,
} from "./types/variant-prices.types";

export const fetchVariantPriceRequest = () => ({
  type: FETCH_VARIANT_PRICE_REQUEST,
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

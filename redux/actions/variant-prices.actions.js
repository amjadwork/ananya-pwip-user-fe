import {
  FETCH_VARIANT_PRICE_REQUEST,
  FETCH_VARIANT_PRICE_SUCCESS,
  FETCH_VARIANT_PRICE_FAILURE,
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

import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_SUCCESS,
  FETCH_PRODUCT_DETAIL_FAILURE,
} from "./types/products.types";

export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchProductDetailRequest = (id) => ({
  type: FETCH_PRODUCT_DETAIL_REQUEST,
  payload: id,
});

export const fetchProductDetailSuccess = (detail) => ({
  type: FETCH_PRODUCT_DETAIL_SUCCESS,
  payload: detail,
});

export const fetchProductDetailFailure = (error) => ({
  type: FETCH_PRODUCT_DETAIL_FAILURE,
  payload: error,
});

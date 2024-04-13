import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCT_DETAIL_REQUEST,
} from "../actions/types/products.types";
import {
  fetchProductsSuccess,
  fetchProductsFailure,

  // variant details
  fetchProductDetailSuccess,
  fetchProductDetailFailure,
} from "../actions/products.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchProducts() {
  try {
    const response = yield call(
      makeApiCall,
      "/variant" +
        "?_productId=641e0f2545fe91930399b09b&_categoryId=641e0f2645fe91930399b09e,641e0f2645fe91930399b09f&getBy=source",
      "get"
    );

    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error));
  }
}

function* fetchProductDetailById(action) {
  const id = action.payload;

  try {
    const response = yield call(makeApiCall, "/variant/" + id, "get");

    yield put(fetchProductDetailSuccess(response.data));
  } catch (error) {
    yield put(fetchProductDetailFailure(error));
  }
}

export default function* productsSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProducts);
  yield takeLatest(FETCH_PRODUCT_DETAIL_REQUEST, fetchProductDetailById);
}

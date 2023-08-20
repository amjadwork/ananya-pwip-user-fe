import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import { FETCH_PRODUCTS_REQUEST } from "../actions/types/products.types";
import {
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../actions/products.actions";

function* fetchProducts() {
  try {
    const authState = yield select((state) => state.auth); // Assuming your token is stored in auth reducer

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      axios.get,
      "https://api-stage.pwip.co/api" +
        "/variant" +
        "?_productId=641e0f2545fe91930399b09b&_categoryId=641e0f2645fe91930399b09e%2C63e95d98acde4c886f2d05fa&getBy=source",
      {
        headers: {
          ...headers,
        },
      }
    ); // Use axios here
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error));
  }
}

export default function* productsSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProducts);
}

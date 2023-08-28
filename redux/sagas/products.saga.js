import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_PRODUCTS_REQUEST } from "../actions/types/products.types";
import {
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../actions/products.actions";
import { api } from "@/utils/helper";

function* fetchProducts() {
  try {
    const authState = yield select((state) => state.auth);

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      api.get,
      "/variant" +
        "?_productId=641e0f2545fe91930399b09b&_categoryId=641e0f2645fe91930399b09e,641e0f2645fe91930399b09f&getBy=source",
      {
        headers: {
          ...headers,
        },
      }
    );
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsFailure(error));
  }
}

export default function* productsSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProducts);
}

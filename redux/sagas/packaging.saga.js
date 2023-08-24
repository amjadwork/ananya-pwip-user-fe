import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_PACKAGE_BAGS_REQUEST } from "../actions/types/packaging.types";
import {
  fetchPackagingBagsSuccess,
  fetchPackagingBagsFailure,
} from "../actions/packaging.actions";
import { api } from "@/utils/helper";

function* fetchPackagingBags() {
  try {
    const authState = yield select((state) => state.auth); // Assuming your token is stored in auth reducer

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(api.get, "/packaging", {
      headers: {
        ...headers,
      },
    });

    yield put(fetchPackagingBagsSuccess(response.data));
  } catch (error) {
    yield put(fetchPackagingBagsFailure(error));
  }
}

export default function* packagingBagsSaga() {
  yield takeLatest(FETCH_PACKAGE_BAGS_REQUEST, fetchPackagingBags);
}

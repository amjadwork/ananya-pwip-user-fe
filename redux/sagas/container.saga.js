import { call, put, takeLatest, select } from "redux-saga/effects";
import { FETCH_CONTAINERS_REQUEST } from "../actions/types/container.types";
import {
  fetchContainersSuccess,
  fetchContainersFailure,
} from "../actions/container.actions";
import { api } from "@/utils/helper";

function* fetchContainers() {
  try {
    const authState = yield select((state) => state.auth);

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(api.get, "/container", {
      headers: {
        ...headers,
      },
    });

    yield put(fetchContainersSuccess(response.data));
  } catch (error) {
    yield put(fetchContainersFailure(error));
  }
}

export default function* containerSaga() {
  yield takeLatest(FETCH_CONTAINERS_REQUEST, fetchContainers);
}

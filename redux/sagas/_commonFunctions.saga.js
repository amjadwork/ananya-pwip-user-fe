import { call, select, put } from "redux-saga/effects";
import { api } from "@/utils/helper";
import { showToastNotificationSuccess } from "../actions/toastOverlay.actions";

export function* makeApiCall(url, method, data, overrideHeaders) {
  try {
    const authState = yield select((state) => state.auth);

    let headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    let response = null;

    if (method === "get") {
      response = yield call(api[method], url, {
        headers: {
          ...headers,
        },
      });
    } else {
      if (overrideHeaders) {
        let headerOfRequest = { ...overrideHeaders };

        headerOfRequest.headers.Authorization = `Bearer ${authState.token}`;

        response = yield call(api[method], url, data, {
          ...headerOfRequest,
        });
      } else {
        response = yield call(api[method], url, data, {
          headers: {
            ...headers,
          },
        });
      }
    }

    return response;
  } catch (error) {
    yield put(
      showToastNotificationSuccess({
        type: "error",
        message: error?.response?.data?.message || "Something went wrong",
      })
    );
    throw error;
  }
}

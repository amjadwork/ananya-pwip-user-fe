import { call, select } from "redux-saga/effects";
import { api } from "@/utils/helper";

export function* makeApiCall(url, method, data) {
  try {
    const authState = yield select((state) => state.auth);

    const headers = {
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
      response = yield call(api[method], url, data, {
        headers: {
          ...headers,
        },
      });
    }

    return response;
  } catch (error) {
    // console.log("saga", error?.response?.data?.message);
    throw error;
  }
}

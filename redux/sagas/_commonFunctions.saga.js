import { call, select, put } from "redux-saga/effects";
import { api } from "@/utils/helper";
import { setAuthData } from "../actions/auth.actions";
import { showToastNotificationSuccess } from "../actions/toastOverlay.actions";
import { showLoaderSuccess, hideLoaderFailure } from "../actions/utils.actions";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";

export function* makeApiCall(url, method, data, overrideHeaders) {
  try {
    yield put(showLoaderSuccess());
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

    yield put(hideLoaderFailure());

    return response;
  } catch (error) {
    const status = [401, 403];

    if (error.response && status.includes(error.response.status)) {
      yield put(setAuthData(null, null));

      signOut();

      localStorage.removeItem("persist:root");

      yield put(
        showToastNotificationSuccess({
          type: "error",
          message:
            error?.response?.data?.message + `, redirecting...` ||
            error?.response?.message + `, redirecting...` ||
            "Unauthorized, please login again" + `, redirecting...`,
        })
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } else {
      yield put(
        showToastNotificationSuccess({
          type: "error",
          message:
            error?.response?.data?.message ||
            error?.response?.message ||
            "Something went wrong",
        })
      );
    }

    yield put(hideLoaderFailure());
    throw error;
  }
}

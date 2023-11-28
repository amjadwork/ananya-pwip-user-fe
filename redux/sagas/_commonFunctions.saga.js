import { call, select, put } from "redux-saga/effects";
import { api } from "@/utils/helper";
import { handleSettingAuthDataFailure } from "../actions/auth.actions";
import { showToastNotificationSuccess } from "../actions/toastOverlay.actions";
import { showLoaderSuccess, hideLoaderFailure } from "../actions/utils.actions";
import { signOut } from "next-auth/react";

const handleLogoutOnFailure = async () => {
  await signOut();

  localStorage.removeItem("persist:root");

  setTimeout(() => {
    window.location.href = "/";
  }, 5000);
};

export function* makeApiCall(
  url,
  method,
  data,
  overrideHeaders,
  overrideToken
) {
  try {
    yield put(showLoaderSuccess());
    const authState = yield select((state) => state.auth);

    let headers = {
      Authorization: `Bearer ${overrideToken || authState.token}`,
    };

    let response = null;

    if (method === "get") {
      if (overrideHeaders) {
        let headerOfRequest = { ...overrideHeaders };
        if (authState.token) {
          headerOfRequest.headers.Authorization = `Bearer ${authState.token}`;
        }

        response = yield call(api[method], url, {
          ...overrideHeaders,
        });
      } else {
        response = yield call(api[method], url, {
          headers: {
            ...headers,
          },
        });
      }
    } else {
      if (overrideHeaders) {
        let headerOfRequest = { ...overrideHeaders };
        if (authState.token) {
          headerOfRequest.headers.Authorization = `Bearer ${authState.token}`;
        }

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
      yield put(handleSettingAuthDataFailure());

      yield put(
        showToastNotificationSuccess({
          type: "error",
          message:
            error?.response?.data?.message + `, redirecting...` ||
            error?.response?.message + `, redirecting...` ||
            "Unauthorized, please login again" + `, redirecting...`,
        })
      );

      handleLogoutOnFailure();
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

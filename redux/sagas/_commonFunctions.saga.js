import { call, select, put } from "redux-saga/effects";
import {
  api,
  auth0BaseURL,
  auth0ClientId,
  auth0ClientSecret,
} from "@/utils/helper";
import {
  handleSettingAuthDataFailure,
  handleSettingAuthDataRequest,
} from "../actions/auth.actions";
import { showToastNotificationSuccess } from "../actions/toastOverlay.actions";
import { showLoaderSuccess, hideLoaderFailure } from "../actions/utils.actions";
import { signOut } from "next-auth/react";
import axios from "axios";

const handleLogoutOnFailure = async () => {
  await signOut();

  localStorage.removeItem("persist:root");

  setTimeout(() => {
    window.location.href = "/";
  }, 5000);
};

const getRefreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${auth0BaseURL}/oauth/token`, {
      grant_type: "refresh_token",
      client_id: auth0ClientId,
      client_secret: auth0ClientSecret,
      refresh_token: refreshToken, // Replace with the actual refresh token
    });

    // Extract the new access token from the response
    const newAccessToken = response.data.access_token;

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing authentication:", error);
    throw error;
  }
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
      // Attempt to refresh the token
      try {
        const refreshToken = yield select(
          (state) => state?.auth?.user?.refreshToken
        );
        const authState = yield select((state) => state.auth);

        const newToken = yield call(getRefreshToken, refreshToken);

        // If successful, update the headers with the new token and retry the API call
        if (newToken) {
          yield put(handleSettingAuthDataRequest(authState.user, newToken));
          yield put(hideLoaderFailure());
        }
      } catch (refreshError) {
        // If token refresh fails, perform logout
        yield put(handleSettingAuthDataFailure());
        yield put(
          showToastNotificationSuccess({
            type: "error",
            message: "Authentication expired" + `, redirecting...`,
          })
        );
        handleLogoutOnFailure();
      }
    } else {
      yield put(
        showToastNotificationSuccess({
          type: "error",
          message:
            error?.response?.data?.message ||
            error?.response?.message ||
            "Something went wrong, please refresh",
        })
      );
    }

    yield put(hideLoaderFailure());
    throw error;
  }
}

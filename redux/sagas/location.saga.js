import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_LOCATION_DESTINATION_REQUEST,
  FETCH_LOCATION_ORIGIN_REQUEST,
} from "../actions/types/location.types";
import {
  fetchDestinationSuccess,
  fetchDestinationFailure,
  fetchOriginSuccess,
  fetchOriginFailure,
} from "../actions/location.actions";
import { makeApiCall } from "./_commonFunctions.saga";

function* fetchDestinationLocation(payload) {
  try {
    const selectedSourceId = yield select(
      (state) => state?.costing?.product?.sourceRates?._sourceId
    );

    const selectedSourceIdFromCustomCosting = yield select(
      (state) =>
        state?.costing?.customCostingSelection?.product?.sourceRates?._sourceId
    );

    let url =
      "/location/destination" +
      `?filterBy=source&sourceId=${
        payload.sourceId ||
        selectedSourceIdFromCustomCosting ||
        selectedSourceId
      }`;

    if (payload.originId) {
      url =
        "/location/destination" +
        `?filterBy=origin&originId=${payload.originId}`;
    }

    const response = yield call(makeApiCall, url, "get");

    yield put(fetchDestinationSuccess(response.data.destination));
  } catch (error) {
    yield put(fetchDestinationFailure(error));
  }
}

function* fetchOriginLocation(payload) {
  try {
    const selectedSourceId = yield select(
      (state) => state?.costing?.product?.sourceRates?._sourceId
    );

    const selectedSourceIdFromCustomCosting = yield select(
      (state) =>
        state?.costing?.customCostingSelection?.product?.sourceRates?._sourceId
    );

    let url =
      "/location/origin" +
      `?filterBySource=${
        payload.sourceId ||
        selectedSourceIdFromCustomCosting ||
        selectedSourceId
      }`;

    if (!payload.sourceId) {
      url = "/location/origin";
    }

    const response = yield call(makeApiCall, url, "get");
    yield put(fetchOriginSuccess(response.data.origin));
  } catch (error) {
    yield put(fetchOriginFailure(error));
  }
}

export default function* locationSaga() {
  yield takeLatest(
    FETCH_LOCATION_DESTINATION_REQUEST,
    fetchDestinationLocation
  );
  yield takeLatest(FETCH_LOCATION_ORIGIN_REQUEST, fetchOriginLocation);
}

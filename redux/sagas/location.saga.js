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

function* fetchDestinationLocation() {
  try {
    const selectedSourceId = yield select(
      (state) => state?.costing?.product?.sourceRates?._sourceId
    );

    const selectedSourceIdFromCustomCosting = yield select(
      (state) =>
        state?.costing?.customCostingSelection?.product?.sourceRates?._sourceId
    );

    const response = yield call(
      makeApiCall,
      "/location/destination" +
        `?filterBy=source&sourceId=${
          selectedSourceIdFromCustomCosting || selectedSourceId
        }`,
      "get"
    );

    yield put(fetchDestinationSuccess(response.data.destination));
  } catch (error) {
    yield put(fetchDestinationFailure(error));
  }
}

function* fetchOriginLocation() {
  try {
    const selectedSourceId = yield select(
      (state) => state?.costing?.product?.sourceRates?._sourceId
    );

    const selectedSourceIdFromCustomCosting = yield select(
      (state) =>
        state?.costing?.customCostingSelection?.product?.sourceRates?._sourceId
    );

    const response = yield call(
      makeApiCall,
      "/location/origin" +
        `?filterBySource=${
          selectedSourceIdFromCustomCosting || selectedSourceId
        }`,
      "get"
    );
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

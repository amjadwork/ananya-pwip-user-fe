import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import { FETCH_LOCATION_DESTINATION_REQUEST } from "../actions/types/location.types";
import {
  fetchDestinationSuccess,
  fetchDestinationFailure,
} from "../actions/location.actions";

function* fetchDestinationLocation() {
  try {
    const authState = yield select((state) => state.auth); // Assuming your token is stored in auth reducer
    const selectedSourceId = yield select(
      (state) => state.costing.product.sourceRates._sourceId
    ); // Assuming your token is stored in auth reducer

    const headers = {
      Authorization: `Bearer ${authState.token}`,
    };

    const response = yield call(
      axios.get,
      "https://api-stage.pwip.co/api" +
        "/location/destination" +
        `?filterBy=source&sourceId=${selectedSourceId}`,
      {
        headers: {
          ...headers,
        },
      }
    );
    yield put(fetchDestinationSuccess(response.data.destination));
  } catch (error) {
    yield put(fetchDestinationFailure(error));
  }
}

export default function* locationSaga() {
  yield takeLatest(
    FETCH_LOCATION_DESTINATION_REQUEST,
    fetchDestinationLocation
  );
}

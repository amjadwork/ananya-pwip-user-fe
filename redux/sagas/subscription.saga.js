import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  GET_SERVICES_REQUEST,
  GET_PLANS_REQUEST,
  GET_SUBSCRIPTION_REQUEST,
} from "../actions/types/subscription.type";
import {
  // services
  getServicesSuccess,
  getServicesFailure,

  // plan
  getPlansSuccess,
  getPlansFailure,

  // subscription
  getSubscriptionSuccess,
  getSubscriptionFailure,
} from "../actions/subscription.action";
import { makeApiCall } from "./_commonFunctions.saga";

function* getServicesData() {
  try {
    const response = yield call(makeApiCall, "/services", "get");

    yield put(getServicesSuccess(response.data));
  } catch (error) {
    yield put(getServicesFailure());
  }
}

function* getPlansData() {
  try {
    const response = yield call(makeApiCall, "/plans", "get");

    yield put(getPlansSuccess(response.data));
  } catch (error) {
    yield put(getPlansFailure());
  }
}

function* getSubscriptionData() {
  try {
    const response = yield call(makeApiCall, "/subscription", "get");

    yield put(getSubscriptionSuccess(response.data));
  } catch (error) {
    yield put(getSubscriptionFailure());
  }
}

export default function* subscriptionSaga() {
  yield takeLatest(GET_SERVICES_REQUEST, getServicesData);
  yield takeLatest(GET_PLANS_REQUEST, getPlansData);
  yield takeLatest(GET_SUBSCRIPTION_REQUEST, getSubscriptionData);
}

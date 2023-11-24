import {
  // services
  GET_SERVICES_REQUEST,
  GET_SERVICES_SUCCESS,
  GET_SERVICES__FAILURE,

  // plans
  GET_PLANS_REQUEST,
  GET_PLANS_SUCCESS,
  GET_PLANS__FAILURE,

  // subscription
  GET_SUBSCRIPTION_REQUEST,
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_FAILURE,
} from "./types/subscription.type";

// Services
export const getServicesRequest = () => ({
  type: GET_SERVICES_REQUEST,
  // payload: data,
});

export const getServicesSuccess = (data) => ({
  type: GET_SERVICES_SUCCESS,
  payload: data,
});

export const getServicesFailure = () => ({
  type: GET_SERVICES__FAILURE,
  //   payload: error,
});

// Plans
export const getPlansRequest = () => ({
  type: GET_PLANS_REQUEST,
  // payload: data,
});

export const getPlansSuccess = (data) => ({
  type: GET_PLANS_SUCCESS,
  payload: data,
});

export const getPlansFailure = () => ({
  type: GET_PLANS__FAILURE,
  //   payload: error,
});

// Subscription
export const getSubscriptionRequest = () => ({
  type: GET_SUBSCRIPTION_REQUEST,
  // payload: data,
});

export const getSubscriptionSuccess = (data) => ({
  type: GET_SUBSCRIPTION_SUCCESS,
  payload: data,
});

export const getSubscriptionFailure = () => ({
  type: GET_SUBSCRIPTION_FAILURE,
  //   payload: error,
});

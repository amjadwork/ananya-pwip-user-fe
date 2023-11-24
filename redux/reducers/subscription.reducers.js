import {
  // services
  GET_SERVICES_SUCCESS,
  GET_SERVICES__FAILURE,

  // plans
  GET_PLANS_SUCCESS,
  GET_PLANS__FAILURE,

  // subscription
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_FAILURE,
} from "../actions/types/subscription.type";

const initialState = {
  services: null,
  plans: null,
  userSubscription: null,
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    // services
    case GET_SERVICES_SUCCESS:
      return {
        ...state,
        services: action.payload,
      };
    case GET_SERVICES__FAILURE:
      return {
        ...state,
        services: null,
      };

    // plans
    case GET_PLANS_SUCCESS:
      return {
        ...state,
        plans: action.payload,
      };
    case GET_PLANS__FAILURE:
      return {
        ...state,
        plans: null,
      };

    // subscription
    case GET_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        userSubscription: action.payload,
      };
    case GET_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        userSubscription: null,
      };

    default:
      return state;
  }
};

export default subscriptionReducer;

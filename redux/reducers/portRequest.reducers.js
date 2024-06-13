/** @format */

import {
  POST_NEW_PORT_REQUEST,
  POST_NEW_PORT_SUCCESS,
  POST_NEW_PORT_FAILURE,
} from "../actions/types/portRequest.types";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const portRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_NEW_PORT_REQUEST:
      return { ...state, loading: true, error: null };
    case POST_NEW_PORT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case POST_NEW_PORT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default portRequestReducer;

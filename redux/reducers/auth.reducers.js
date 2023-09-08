import {
  SET_AUTH_DATA_REQUEST,
  SET_AUTH_DATA_SUCCESS,
  SET_AUTH_DATA_FAILURE,
} from "../actions/types/auth.types";

const initialState = {
  user: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_DATA_REQUEST:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case SET_AUTH_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case SET_AUTH_DATA_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;

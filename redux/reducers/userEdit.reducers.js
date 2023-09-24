import {
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from "../actions/types/userEdit.types";

const initialState = {
  userData: null,
};

const userEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
      };

    case UPDATE_USER_FAILURE:
      return {
        ...state,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        userData: null,
      };

    default:
      return state;
  }
};

export default userEditReducer;

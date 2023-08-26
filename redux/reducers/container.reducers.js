import {
  FETCH_CONTAINERS_SUCCESS,
  FETCH_CONTAINERS_FAILURE,
} from "../actions/types/container.types";

const initialState = {
  containers: null,
  error: null,
};

const containersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTAINERS_SUCCESS:
      return {
        ...state,
        containers: action.payload,
        error: null,
      };
    case FETCH_CONTAINERS_FAILURE:
      return {
        ...state,
        containers: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default containersReducer;

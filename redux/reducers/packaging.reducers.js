import {
  FETCH_PACKAGE_BAGS_SUCCESS,
  FETCH_PACKAGE_BAGS_FAILURE,
} from "../actions/types/packaging.types";

const initialState = {
  bags: null,
  error: null,
};

const packagingBagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PACKAGE_BAGS_SUCCESS:
      return {
        ...state,
        bags: action.payload,
        error: null,
      };
    case FETCH_PACKAGE_BAGS_FAILURE:
      return {
        ...state,
        bags: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default packagingBagsReducer;

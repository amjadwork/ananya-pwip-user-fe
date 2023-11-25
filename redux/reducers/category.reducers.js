import {
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
} from "../actions/types/category.types";

const initialState = {
  category: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        category: action.payload,
      };
    case FETCH_CATEGORY_FAILURE:
      return {
        ...state,
        category: null,
      };

    default:
      return state;
  }
};

export default categoryReducer;

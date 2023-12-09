import {
  SET_TAGS_FETCH_SUCCESS,
  RESET_TAGS_FAILURE,
} from "../actions/types/tags.types";

const initialState = {
  tags: null,
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAGS_FETCH_SUCCESS:
      return {
        ...state,
        tags: action.payload,
      };
    case RESET_TAGS_FAILURE:
      return {
        ...state,
        tags: null,
      };

    default:
      return state;
  }
};

export default tagsReducer;

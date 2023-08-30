import {
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
} from "../actions/types/utils.types";

const initialState = {
  showLoader: false,
};

const utilsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER_SUCCESS:
      return {
        ...state,
        showLoader: true,
      };
    case SHOW_LOADER_FAILURE:
      return {
        ...state,
        showLoader: false,
      };

    default:
      return state;
  }
};

export default utilsReducer;

import {
  DOWNLOAD_SUCCESS,
  DOWNLOAD_FAILURE,
} from "../actions/types/exportCosting.types";

const initialState = {
  download: null,
};

const exportCostingReducer = (state = initialState, action) => {
  switch (action.type) {
    case DOWNLOAD_SUCCESS:
      return {
        ...state,
        download: action.payload,
        error: null,
      };
    case DOWNLOAD_FAILURE:
      return {
        ...state,
        download: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default exportCostingReducer;

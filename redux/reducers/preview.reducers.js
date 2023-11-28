import {
  SET_PREVIEW_DATA_SUCCESS,
  SET_PREVIEW_DATA_FAILURE,
} from "../actions/types/preview.types";

const initialState = {
  previewDataReducer: null,
  error: null,
};

const previewDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREVIEW_DATA_SUCCESS:
      return {
        ...state,
        previewData: action.payload,
        error: null,
      };
    case SET_PREVIEW_DATA_FAILURE:
      return {
        ...state,
        previewData: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default previewDataReducer;

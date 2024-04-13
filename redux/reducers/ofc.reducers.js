import {
  SET_SELECTED_POL_FOR_OFC_SUCCESS,
  SET_SELECTED_POL_FOR_OFC_FAILURE,
  SET_SELECTED_POD_FOR_OFC_SUCCESS,
  SET_SELECTED_POD_FOR_OFC_FAILURE,
} from "../actions/types/ofc.types";

const initialState = {
  selectedPOL: null,
  selectedPOD: null,
  error: null,
};

const ofcReducer = (state = initialState, action) => {
  switch (action.type) {
    // POL
    case SET_SELECTED_POL_FOR_OFC_SUCCESS:
      return {
        ...state,
        selectedPOL: action.payload,
        error: null,
      };
    case SET_SELECTED_POL_FOR_OFC_FAILURE:
      return {
        ...state,
        selectedPOL: null,
        error: action.payload,
      };

    // POD
    case SET_SELECTED_POD_FOR_OFC_SUCCESS:
      return {
        ...state,
        selectedPOD: action.payload,
        error: null,
      };
    case SET_SELECTED_POD_FOR_OFC_FAILURE:
      return {
        ...state,
        selectedPOD: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ofcReducer;

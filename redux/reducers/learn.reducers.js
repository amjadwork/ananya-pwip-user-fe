import {
  SET_LEARN_LIST_SUCCESS,
  SET_LEARN_LIST_FAILURE,
  SET_LEARN_DETAILS_ID_SUCCESS,
  SET_LEARN_DETAILS_ID_FAILURE,
  SET_LEARN_DETAILS_SUCCESS,
  SET_LEARN_DETAILS_FAILURE,
} from "../actions/types/learn.types";

const initialState = {
  learnList: [],
  id: null,
  detail: null,
};

const learnListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LEARN_LIST_SUCCESS:
      return {
        ...state,
        learnList: action.payload,
      };
    case SET_LEARN_LIST_FAILURE:
      return {
        ...state,
        learnList: null,
      };

    case SET_LEARN_DETAILS_ID_SUCCESS:
      return {
        ...state,
        id: action.payload,
      };
    case SET_LEARN_DETAILS_ID_FAILURE:
      return {
        ...state,
        id: null,
      };

    case SET_LEARN_DETAILS_SUCCESS:
      return {
        ...state,
        detail: action.payload,
      };
    case SET_LEARN_DETAILS_FAILURE:
      return {
        ...state,
        detail: null,
      };

    default:
      return state;
  }
};

export default learnListReducer;

import {
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
  SET_FOREX_RATE_SUCCESS,
  SET_FOREX_RATE_FAILURE,
  SET_SEARCH_SCREEN_SUCCESS,
  SET_SEARCH_SCREEN_FAILURE,
} from "../actions/types/utils.types";

const initialState = {
  showLoader: false,
  forexRate: {
    USD: 0,
  },
  searchScreenActive: false,
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

    case SET_FOREX_RATE_SUCCESS:
      return {
        ...state,
        forexRate: {
          USD: action.payload.usd,
        },
      };
    case SET_FOREX_RATE_FAILURE:
      return {
        ...state,
        forexRate: {
          USD: 0,
        },
      };

    case SET_SEARCH_SCREEN_SUCCESS:
      return {
        ...state,
        searchScreenActive: true,
      };
    case SET_SEARCH_SCREEN_FAILURE:
      return {
        ...state,
        searchScreenActive: false,
      };

    default:
      return state;
  }
};

export default utilsReducer;

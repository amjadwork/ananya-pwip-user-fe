import {
  FETCH_VARIANT_PRICE_SUCCESS,
  FETCH_VARIANT_PRICE_FAILURE,

  // watchlist
  VARIANTS_WATCHLIST_SUCCESS,
  VARIANTS_WATCHLIST_FAILURE,

  // selected variant
  SELECTED_VARIANT_FOR_DETAIL_SUCCESS,
  SELECTED_VARIANT_FOR_DETAIL_FAILURE,

  // variant history
  SET_VARIANT_PRICE_HISTORY_SUCCESS,
  SET_VARIANT_PRICE_HISTORY_FAILURE,
} from "../actions/types/variant-prices.types";

const initialState = {
  variantWithPriceList: [],
  variantWatchList: [],
  variantDetails: null,
  variantPriceHistory: [],
  error: null,
};

const variantPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VARIANT_PRICE_SUCCESS:
      return {
        ...state,
        variantWithPriceList: action.payload,
        error: null,
      };
    case FETCH_VARIANT_PRICE_FAILURE:
      return {
        ...state,
        variantWithPriceList: [],
        error: action.payload,
      };

    //  watchlist
    case VARIANTS_WATCHLIST_SUCCESS:
      return {
        ...state,
        variantWatchList: action.payload,
        error: null,
      };
    case VARIANTS_WATCHLIST_FAILURE:
      return {
        ...state,
        variantWatchList: [],
        error: action.payload,
      };

    //  SELECTED VARIANT
    case SELECTED_VARIANT_FOR_DETAIL_SUCCESS:
      return {
        ...state,
        variantDetails: action.payload,
        error: null,
      };
    case SELECTED_VARIANT_FOR_DETAIL_FAILURE:
      return {
        ...state,
        variantDetails: null,
        error: action.payload,
      };

    // VARIANT HISTORY
    case SET_VARIANT_PRICE_HISTORY_SUCCESS:
      return {
        ...state,
        variantPriceHistory: action.payload,
        error: null,
      };
    case SET_VARIANT_PRICE_HISTORY_FAILURE:
      return {
        ...state,
        variantPriceHistory: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default variantPriceReducer;

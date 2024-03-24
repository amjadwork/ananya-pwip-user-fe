import {
  FETCH_VARIANT_PRICE_SUCCESS,
  FETCH_VARIANT_PRICE_FAILURE,
} from "../actions/types/variant-prices.types";

const initialState = {
  variantWithPriceList: [],
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
    default:
      return state;
  }
};

export default variantPriceReducer;

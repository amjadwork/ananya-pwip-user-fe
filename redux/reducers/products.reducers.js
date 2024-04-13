import {
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,

  //
  FETCH_PRODUCT_DETAIL_SUCCESS,
  FETCH_PRODUCT_DETAIL_FAILURE,
} from "../actions/types/products.types";

const initialState = {
  products: [],
  variantDetail: null,
  error: null,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        error: null,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        products: [],
        error: action.payload,
      };

    // variant details
    case FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        variantDetail: action.payload,
        error: null,
      };
    case FETCH_PRODUCT_DETAIL_FAILURE:
      return {
        ...state,
        variantDetail: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productsReducer;

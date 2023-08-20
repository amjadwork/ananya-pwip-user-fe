import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,
  GENERATE_COSTING_SUCESS,
  GENERATE_COSTING_FAILURE,
} from "../actions/types/costing.types";

const initialState = {
  product: null,
  portOfDestination: null,
  generatedCosting: null,
};

const costingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COSTING_SELECTION:
      return {
        ...state,
        product: action.payload.product,
        portOfDestination: action.payload.portOfDestination,
      };
    case RESET_COSTING_SELECTION:
      return {
        ...state,
        product: null,
        portOfDestination: null,
      };
    case GENERATE_COSTING_SUCESS:
      return {
        ...state,
        generatedCosting: action.payload,
      };
    case GENERATE_COSTING_FAILURE:
      return {
        ...state,
        generatedCosting: null,
      };
    default:
      return state;
  }
};

export default costingReducer;

import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,
} from "../actions/types/costing.types";

const initialState = {
  product: null,
  portOfDestination: null,
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
    default:
      return state;
  }
};

export default costingReducer;

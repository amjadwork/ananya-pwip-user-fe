import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,
  GENERATE_COSTING_SUCESS,
  GENERATE_COSTING_FAILURE,
  SET_CUSTOM_COSTING_SELECTION_SUCCESS,
  SET_CUSTOM_COSTING_SELECTION_FAILURE,
} from "../actions/types/costing.types";

const initialState = {
  product: null,
  portOfDestination: null,
  generatedCosting: null,
  customCostingSelection: {
    product: null,
    portOfOrigin: null,
    portOfDestination: null,
    bags: null,
    container: null,
  },
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
    case SET_CUSTOM_COSTING_SELECTION_SUCCESS:
      return {
        ...state,
        customCostingSelection: action.payload.customCostingSelection,
      };
    case SET_CUSTOM_COSTING_SELECTION_FAILURE:
      return {
        ...state,
        customCostingSelection: {
          product: null,
          portOfOrigin: null,
          portOfDestination: null,
          bags: null,
          container: null,
        },
      };
    default:
      return state;
  }
};

export default costingReducer;

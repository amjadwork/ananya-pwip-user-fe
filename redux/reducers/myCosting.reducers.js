import {
  SAVE_COSTING_SUCCESS,
  SAVE_COSTING_FAILURE,
  UPDATE_COSTING_SUCCESS,
  UPDATE_COSTING_FAILURE,
  FETCH_MY_COSTING_SUCCESS,
  FETCH_MY_COSTING_FAILURE,
  FETCH_ALL_MY_COSTINGS_SUCCESS,
  FETCH_ALL_MY_COSTINGS_FAILURE,
} from "../actions/types/myCosting.types";

const initialState = {
  myRecentSavedCosting: null,
  currentCostingFromHistory: null,
  allMyCostingsFromHistory: null,
};

const myCostingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_COSTING_SUCCESS:
      return {
        ...state,
        myRecentSavedCosting: action.payload,
      };

    case SAVE_COSTING_FAILURE:
      return {
        ...state,
        myRecentSavedCosting: null,
      };

    case UPDATE_COSTING_SUCCESS:
      return {
        ...state,
        myRecentSavedCosting: action.payload,
      };

    case UPDATE_COSTING_FAILURE:
      return {
        ...state,
        myRecentSavedCosting: null,
      };

    case FETCH_MY_COSTING_SUCCESS:
      return {
        ...state,
        currentCostingFromHistory: action.payload,
      };
    case FETCH_MY_COSTING_FAILURE:
      return {
        ...state,
        currentCostingFromHistory: null,
      };

    case FETCH_ALL_MY_COSTINGS_SUCCESS:
      return {
        ...state,
        allMyCostingsFromHistory: action.payload,
      };
    case FETCH_ALL_MY_COSTINGS_FAILURE:
      return {
        ...state,
        allMyCostingsFromHistory: null,
      };
    default:
      return state;
  }
};

export default myCostingReducer;

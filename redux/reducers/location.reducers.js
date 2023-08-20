import {
  FETCH_LOCATION_DESTINATION_SUCCESS,
  FETCH_LOCATION_DESTINATION_FAILURE,
} from "../actions/types/location.types";

const initialState = {
  locations: {
    destinations: [],
    origins: [],
    sources: [],
  },
  error: null,
};

const locationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOCATION_DESTINATION_SUCCESS:
      return {
        ...state,
        locations: {
          ...state.locations,
          destinations: action.payload,
        },
        error: null,
      };
    case FETCH_LOCATION_DESTINATION_FAILURE:
      return {
        ...state,
        locations: {
          ...state.locations,
          destinations: [],
        },
        error: action.payload,
      };
    default:
      return state;
  }
};

export default locationsReducer;

import {
  FETCH_LOCATION_DESTINATION_SUCCESS,
  FETCH_LOCATION_DESTINATION_FAILURE,
  FETCH_LOCATION_ORIGIN_SUCCESS,
  FETCH_LOCATION_ORIGIN_FAILURE,
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
    // Destination
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

    // Origin
    case FETCH_LOCATION_ORIGIN_SUCCESS:
      return {
        ...state,
        locations: {
          ...state.locations,
          origin: action.payload,
        },
        error: null,
      };

    case FETCH_LOCATION_ORIGIN_FAILURE:
      return {
        ...state,
        locations: {
          ...state.locations,
          origin: [],
        },
        error: action.payload,
      };
    default:
      return state;
  }
};

export default locationsReducer;

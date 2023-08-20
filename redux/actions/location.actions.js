import {
  FETCH_LOCATION_DESTINATION_REQUEST,
  FETCH_LOCATION_DESTINATION_SUCCESS,
  FETCH_LOCATION_DESTINATION_FAILURE,
} from "./types/location.types";

export const fetchDestinationRequest = () => ({
  type: FETCH_LOCATION_DESTINATION_REQUEST,
});

export const fetchDestinationSuccess = (destinations) => ({
  type: FETCH_LOCATION_DESTINATION_SUCCESS,
  payload: destinations,
});

export const fetchDestinationFailure = (error) => ({
  type: FETCH_LOCATION_DESTINATION_FAILURE,
  payload: error,
});

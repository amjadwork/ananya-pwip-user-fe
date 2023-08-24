import {
  FETCH_LOCATION_DESTINATION_REQUEST,
  FETCH_LOCATION_DESTINATION_SUCCESS,
  FETCH_LOCATION_DESTINATION_FAILURE,
  FETCH_LOCATION_ORIGIN_REQUEST,
  FETCH_LOCATION_ORIGIN_SUCCESS,
  FETCH_LOCATION_ORIGIN_FAILURE,
} from "./types/location.types";

// Destination
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

// Origin
export const fetchOriginRequest = () => ({
  type: FETCH_LOCATION_ORIGIN_REQUEST,
});

export const fetchOriginSuccess = (destinations) => ({
  type: FETCH_LOCATION_ORIGIN_SUCCESS,
  payload: destinations,
});

export const fetchOriginFailure = (error) => ({
  type: FETCH_LOCATION_ORIGIN_FAILURE,
  payload: error,
});

import {
  FETCH_CONTAINERS_REQUEST,
  FETCH_CONTAINERS_SUCCESS,
  FETCH_CONTAINERS_FAILURE,
} from "./types/container.types";

// Destination
export const fetchContainersRequest = () => ({
  type: FETCH_CONTAINERS_REQUEST,
});

export const fetchContainersSuccess = (containers) => ({
  type: FETCH_CONTAINERS_SUCCESS,
  payload: containers,
});

export const fetchContainersFailure = (error) => ({
  type: FETCH_CONTAINERS_FAILURE,
  payload: error,
});

import {
  FETCH_PACKAGE_BAGS_REQUEST,
  FETCH_PACKAGE_BAGS_SUCCESS,
  FETCH_PACKAGE_BAGS_FAILURE,
} from "./types/packaging.types";

// Destination
export const fetchPackagingBagsRequest = () => ({
  type: FETCH_PACKAGE_BAGS_REQUEST,
});

export const fetchPackagingBagsSuccess = (bags) => ({
  type: FETCH_PACKAGE_BAGS_SUCCESS,
  payload: bags,
});

export const fetchPackagingBagsFailure = (error) => ({
  type: FETCH_PACKAGE_BAGS_FAILURE,
  payload: error,
});

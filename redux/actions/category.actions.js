import {
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
} from "./types/category.types";

// Destination
export const fetchCategoryRequest = (data) => ({
  type: FETCH_CATEGORY_REQUEST,
  payload: data,
});

export const fetchCategorySuccess = (data) => ({
  type: FETCH_CATEGORY_SUCCESS,
  payload: data,
});

export const fetchCategoryFailure = () => ({
  type: FETCH_CATEGORY_FAILURE,
});

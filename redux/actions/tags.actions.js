import {
  SET_TAGS_REQUEST,
  SET_TAGS_FETCH_SUCCESS,
  RESET_TAGS_FAILURE,
} from "./types/tags.types";

// Destination
export const setTagsRequest = () => ({
  type: SET_TAGS_REQUEST,
});

export const setTagsFetchSuccess = (data) => ({
  type: SET_TAGS_FETCH_SUCCESS,
  payload: data,
});

export const resetTagsFailure = () => ({
  type: RESET_TAGS_FAILURE,
});

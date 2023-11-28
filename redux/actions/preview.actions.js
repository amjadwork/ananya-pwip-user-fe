import {
  SET_PREVIEW_DATA_REQUEST,
  SET_PREVIEW_DATA_SUCCESS,
  SET_PREVIEW_DATA_FAILURE,
} from "./types/preview.types";

// Destination
export const setPreviewDataRequest = (id) => ({
  type: SET_PREVIEW_DATA_REQUEST,
  payload: id,
});

export const setPreviewDataSuccess = (data) => ({
  type: SET_PREVIEW_DATA_SUCCESS,
  payload: data,
});

export const setPreviewDataFailure = (error) => ({
  type: SET_PREVIEW_DATA_FAILURE,
  payload: error,
});

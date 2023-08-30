import {
  SHOW_LOADER_REQUEST,
  SHOW_LOADER_SUCCESS,
  SHOW_LOADER_FAILURE,
} from "./types/utils.types";

export const LoaderRequest = () => ({
  type: SHOW_LOADER_REQUEST,
});

export const showLoaderSuccess = () => ({
  type: SHOW_LOADER_SUCCESS,
});

export const hideLoaderFailure = () => ({
  type: SHOW_LOADER_FAILURE,
});

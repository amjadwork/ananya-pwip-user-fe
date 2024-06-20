/** @format */
import {
  POST_NEW_PORT_REQUEST,
  POST_NEW_PORT_SUCCESS,
  POST_NEW_PORT_FAILURE,
} from "./types/portRequest.types";

export const postNewPortRequest = (data) => ({
  type: POST_NEW_PORT_REQUEST,
  payload: data,
});

export const postNewPortSuccess = (response) => ({
  type: POST_NEW_PORT_SUCCESS,
  payload: response,
});

export const postNewPortFailure = (error) => ({
  type: POST_NEW_PORT_FAILURE,
  payload: error,
});

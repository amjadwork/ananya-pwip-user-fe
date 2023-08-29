import {
  DOWNLOAD_REQUEST,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_FAILURE,
} from "./types/exportCosting.types";

export const downloadCostingRequest = (id) => ({
  type: DOWNLOAD_REQUEST,
  payload: {
    historyId: id,
  },
});

export const downloadCostingSuccess = (data) => ({
  type: DOWNLOAD_SUCCESS,
  payload: data,
});

export const downloadCostingFailure = () => ({
  type: DOWNLOAD_FAILURE,
});

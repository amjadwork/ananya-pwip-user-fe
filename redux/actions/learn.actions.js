import {
  FETCH_LEARN_LIST_REQUEST,
  SET_LEARN_LIST_SUCCESS,
  SET_LEARN_LIST_FAILURE,
  SET_LEARN_DETAILS_ID_REQUEST,
  SET_LEARN_DETAILS_ID_SUCCESS,
  SET_LEARN_DETAILS_ID_FAILURE,
  SET_LEARN_DETAILS_REQUEST,
  SET_LEARN_DETAILS_SUCCESS,
  SET_LEARN_DETAILS_FAILURE,
} from "./types/learn.types";

// all learn list
export const fetchLearnListRequest = () => {
  return {
    type: FETCH_LEARN_LIST_REQUEST,
  };
};

export const setLearnListSuccess = (data) => ({
  type: SET_LEARN_LIST_SUCCESS,
  payload: data,
});

export const setLearnListFailure = () => ({
  type: SET_LEARN_LIST_FAILURE,
});

// learn id
export const fetchLearnIDRequest = (id) => {
  return {
    type: SET_LEARN_DETAILS_ID_REQUEST,
    payload: id,
  };
};

export const setLearnIDSuccess = (data) => ({
  type: SET_LEARN_DETAILS_ID_SUCCESS,
  payload: data,
});

export const setLearnIDFailure = () => ({
  type: SET_LEARN_DETAILS_ID_FAILURE,
});

// learn detail
export const fetchLearnDetailRequest = (id) => {
  return {
    type: SET_LEARN_DETAILS_REQUEST,
    payload: id,
  };
};

export const setLearnDetailSuccess = (data) => ({
  type: SET_LEARN_DETAILS_SUCCESS,
  payload: data,
});

export const setLearnDetailFailure = () => ({
  type: SET_LEARN_DETAILS_FAILURE,
});

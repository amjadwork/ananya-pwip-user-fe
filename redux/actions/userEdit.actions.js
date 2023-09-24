import {
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from "./types/userEdit.types";

//UPDATE USER DETAILS
export const updateUserRequest = (userData) => {
  return {
    type: UPDATE_USER_REQUEST,
    payload: userData,
  };
};

export const updateUserSuccess = () => ({
  type: UPDATE_USER_SUCCESS,
});

export const updateUserFailure = () => ({
  type: UPDATE_USER_FAILURE,
});

// GET USER DETAILS
export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (data) => ({
  type: FETCH_USER_SUCCESS,
  payload: data,
});

export const fetchUserFailure = () => ({
  type: FETCH_USER_FAILURE,
});

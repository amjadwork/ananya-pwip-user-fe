import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
} from "./types/profileEdit.types";

//UPDATE PROFILE DETAILS
export const updateProfileRequest = (userData) => {
  return {
    type: UPDATE_PROFILE_REQUEST,
    payload: userData,
  };
};

export const updateProfileSuccess = (userData) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: userData,
});

export const updateProfileFailure = () => ({
  type: UPDATE_PROFILE_FAILURE,
});

// GET PROFILE DETAILS
export const fetchProfileRequest = () => {
  return {
    type: FETCH_PROFILE_REQUEST,
  };
};

export const fetchProfileSuccess = (data) => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: data,
});

export const fetchProfileFailure = () => ({
  type: FETCH_PROFILE_FAILURE,
});

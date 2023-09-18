import {
    SAVE_PROFILE_REQUEST,
    SAVE_PROFILE_SUCCESS,
    SAVE_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
  } from "./types/profileEdit.types";


//SAVE PROFILE DETAILS
export const saveProfileRequest = (userData) => {
  return {
    type: SAVE_PROFILE_REQUEST,
    payload: userData,
  };
};

export const saveProfileSuccess = (userData) => ({
  type: SAVE_PROFILE_SUCCESS,
  payload: userData,
});

export const saveProfileFailure = () => ({
  type: SAVE_PROFILE_FAILURE,
});

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
export const fetchProfileRequest = (userId) => {
    return {
      type: FETCH_PROFILE_REQUEST,
      payload: userId,
    };
  };
  
export const fetchProfileSuccess = (userId) => ({
    type: FETCH_PROFILE_SUCCESS,
    payload: userId,
  });
  
export const fetchProfileFailure = () => ({
    type: FETCH_PROFILE_FAILURE,
  });
  
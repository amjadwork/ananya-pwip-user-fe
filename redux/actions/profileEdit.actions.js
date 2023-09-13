import {
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
  } from "./types/profileEdit.types";

//UPDATE PROFILE DETAILS
export const updateProfileRequest = (requestData) => {
    return {
      type: UPDATE_PROFILE_REQUEST,
      payload: requestData,
    };
  };

export const updateProfileSuccess = (profileData) => ({
    type: UPDATE_PROFILE_SUCCESS,
    payload: profileData,
  });


export const updateProfileFailure = () => ({
    type: UPDATE_PROFILE_FAILURE,
  });

// GET PROFILE DETAILS
export const fetchProfileRequest = (id) => {
    return {
      type: FETCH_PROFILE_REQUEST,
      payload: id,
    };
  };
  
export const fetchProfileSuccess = (costing) => ({
    type: FETCH_PROFILE_SUCCESS,
    payload: costing,
  });
  
export const fetchProfileFailure = () => ({
    type: FETCH_PROFILE_FAILURE,
  });
  
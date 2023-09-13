import {
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
  } from "../actions/types/profileEdit.types";

const initialState = {
    fullName: null,
    email: null,
    number: null,
    companyName: null,
    profession: null,
    gstNumber: null,
  };
  
  const profileEditReducer = (state = initialState, action) => {
    switch (action.type) {

    case UPDATE_PROFILE_SUCCESS:
        return {
          ...state,
          profileInfo: action.payload,
        };
  
    case UPDATE_PROFILE_FAILURE:
        return {
          ...state,
          profileInfo: null,
        };

    case FETCH_PROFILE_SUCCESS:
        return {
           ...state,
           currentCostingFromHistory: action.payload,
        };

    case FETCH_PROFILE_FAILURE:
        return {
            ...state,
            currentCostingFromHistory: null,
        };

    default:
        return state;
  }
};
  
  export default profileEditReducer;
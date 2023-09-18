import {
    SAVE_PROFILE_SUCCESS,
    SAVE_PROFILE_FAILURE,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
  } from "../actions/types/profileEdit.types";

const initialState = {
    fullName: null,
    email: null,
    mobile: null,
    companyName: null,
    profession: null,
    gstNumber: null,
  };
  
  const profileEditReducer = (state = initialState, action) => {
    switch (action.type) {
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        initialState: action.payload,
      };

    case SAVE_PROFILE_FAILURE:
      return {
        ...state,
        initialState: null,
      };

    case UPDATE_PROFILE_SUCCESS:
        return {
          ...state,
          userInfo: action.payload,
        };
  
    case UPDATE_PROFILE_FAILURE:
        return {
          ...state,
          userInfo: null,
        };

    case FETCH_PROFILE_SUCCESS:
        return {
           ...state,
           currentUserInfo: action.payload,
        };

    case FETCH_PROFILE_FAILURE:
        return {
            ...state,
            currentUserInfo: null,
        };
        
    default:
        return state;
  }
};
  
  export default profileEditReducer;
import {
    SAVE_PROFILE_SUCCESS,
    SAVE_PROFILE_FAILURE,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
  } from "../actions/types/profileEdit.types";

const initialState = {
  name: null,
  headline: null,
  email: null,
  mobile: null,
  headline:null,
  companyName: null,
  profession: null,
  gstNumber: null,
  bio:null,
  city:null,
  state:null,
  country:null,
  pincode:null,
  website:null,
  facebook:null,
  linkedin:null,
  instagram:null,
  whatsapp:null,
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
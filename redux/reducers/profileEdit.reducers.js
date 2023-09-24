import {
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
} from "../actions/types/profileEdit.types";

const initialState = {
  profileData: null,
};

const profileEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
      };

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        profileData: action.payload,
      };

    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        profileData: null,
      };

    default:
      return state;
  }
};

export default profileEditReducer;

import {
  SET_VARIANT_PROFILE_SUCCESS,
  SET_VARIANT_PROFILE_FAILURE,
} from "../actions/types/variant-profile.type";

const initialState = {
  variantProfileData: null,
  error: null,
};

const variantProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VARIANT_PROFILE_SUCCESS:
      return {
        ...state,
        variantProfileData: action.payload,
        error: null,
      };
    case SET_VARIANT_PROFILE_FAILURE:
      return {
        ...state,
        variantProfileData: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default variantProfileReducer;

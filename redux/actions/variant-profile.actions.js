import {
  FETCH_VARIANT_PROFILE_REQUEST,
  SET_VARIANT_PROFILE_SUCCESS,
  SET_VARIANT_PROFILE_FAILURE,
} from "./types/variant-profile.type";

export const fetchVariantProfileRequest = (variantId) => ({
  type: FETCH_VARIANT_PROFILE_REQUEST,
  payload: {
    variantId: variantId,
  },
});

export const setVariantProfileSuccess = (profile) => ({
  type: SET_VARIANT_PROFILE_SUCCESS,
  payload: profile,
});

export const setVariantProfileFailure = (error) => ({
  type: SET_VARIANT_PROFILE_FAILURE,
  payload: error,
});

import {
  SET_AUTH_DATA_REQUEST,
  SET_AUTH_DATA_SUCCESS,
  SET_AUTH_DATA_FAILURE,
} from "./types/auth.types";

export const handleSettingAuthDataRequest = (user, token) => (
  {
  type: SET_AUTH_DATA_REQUEST,
  payload: { user, token },
});

export const handleSettingAuthDataSuccess = (user, token) => (
  {
  type: SET_AUTH_DATA_SUCCESS,
  payload: { user, token },
});

export const handleSettingAuthDataFailure = () => ({
  type: SET_AUTH_DATA_FAILURE,
});

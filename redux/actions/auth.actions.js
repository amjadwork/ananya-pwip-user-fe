import { SET_AUTH_DATA } from "./types/auth.types";

export const setAuthData = (user, token) => ({
  type: SET_AUTH_DATA,
  payload: { user, token },
});

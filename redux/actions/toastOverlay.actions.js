import {
  TOAST_NOTIFICATION_REQUEST,
  SHOW_TOAST_NOTIFICATION_SUCCESS,
  HIDE_TOAST_NOTIFICATION_FAILURE,
} from "./types/toastOverlay.types";

export const toastNotificationRequest = () => ({
  type: TOAST_NOTIFICATION_REQUEST,
});

export const showToastNotificationSuccess = ({ type, message }) => ({
  type: SHOW_TOAST_NOTIFICATION_SUCCESS,
  payload: { type, message },
});

export const hideToastNotificationFailure = () => ({
  type: HIDE_TOAST_NOTIFICATION_FAILURE,
  payload: { type: null, message: null },
});

import {
  SHOW_TOAST_NOTIFICATION_SUCCESS,
  HIDE_TOAST_NOTIFICATION_FAILURE,
} from "../actions/types/toastOverlay.types";

const initialState = {
  showToastNotification: false,
  toastContent: null,
};

const toastOverlayReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST_NOTIFICATION_SUCCESS:
      return {
        ...state,
        showToastNotification: true,
        toastContent: action.payload,
      };
    case HIDE_TOAST_NOTIFICATION_FAILURE:
      return {
        ...state,
        showToastNotification: false,
        toastContent: null,
      };

    default:
      return state;
  }
};

export default toastOverlayReducer;

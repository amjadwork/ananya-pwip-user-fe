import {
  SET_TERMS_OF_SHIPMENT_SUCCESS,
  SET_TERMS_OF_SHIPMENT_FAILURE,
} from "../actions/types/shipmentTerms.types";

const initialState = {
  shipmentTerm: {
    showShipmentTermDropdown: false,
    selected: "FOB",
  },
  error: null,
};

const shipmentTermReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TERMS_OF_SHIPMENT_SUCCESS:
      return {
        ...state,
        shipmentTerm: action.payload,
        error: null,
      };
    case SET_TERMS_OF_SHIPMENT_FAILURE:
      return {
        ...state,
        shipmentTerm: {
          showShipmentTermDropdown: false,
          selected: "FOB",
        },
        error: action.payload,
      };

    default:
      return state;
  }
};

export default shipmentTermReducer;

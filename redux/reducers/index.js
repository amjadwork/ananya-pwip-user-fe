import { combineReducers } from "redux";
import authReducer from "./auth.reducers"; // Import your authReducer
import productsReducer from "./products.reducers";
import costingReducer from "./costing.reducers";
import locationsReducer from "./location.reducers";
import packagingBagsReducer from "./packaging.reducers";
import containersReducer from "./container.reducers";
import myCostingReducer from "./myCosting.reducers";
import toastOverlayReducer from "./toastOverlay.reducers";
import exportCostingReducer from "./exportCosting.reducers";
import shipmentTermReducer from "./shipmentTerms.reducers";
import utilsReducer from "./utils.reducers";
import profileEditReducer from "./profileEdit.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  locations: locationsReducer,
  costing: costingReducer,
  bags: packagingBagsReducer,
  containers: containersReducer,
  myCosting: myCostingReducer,
  toastOverlay: toastOverlayReducer,
  exportCosting: exportCostingReducer,
  shipmentTerm: shipmentTermReducer,
  utils: utilsReducer,
  profileEdit: profileEditReducer,
});

export default rootReducer;

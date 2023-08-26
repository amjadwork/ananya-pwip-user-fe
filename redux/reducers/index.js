import { combineReducers } from "redux";
import authReducer from "./auth.reducers"; // Import your authReducer
import productsReducer from "./products.reducers";
import costingReducer from "./costing.reducers";
import locationsReducer from "./location.reducers";
import packagingBagsReducer from "./packaging.reducers";
import containersReducer from "./container.reducers";
import myCostingReducer from "./myCosting.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  locations: locationsReducer,
  costing: costingReducer,
  bags: packagingBagsReducer,
  containers: containersReducer,
  myCosting: myCostingReducer,
});

export default rootReducer;

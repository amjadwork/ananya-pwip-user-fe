import { combineReducers } from "redux";
import authReducer from "./auth.reducers"; // Import your authReducer
import productsReducer from "./products.reducers";
import costingReducer from "./costing.reducers";
import locationsReducer from "./location.reducers";
import packagingBagsReducer from "./packaging.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  locations: locationsReducer,
  costing: costingReducer,
  bags: packagingBagsReducer,
});

export default rootReducer;
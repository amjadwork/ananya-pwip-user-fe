import { combineReducers } from "redux";
import authReducer from "./auth.reducers"; // Import your authReducer
import productsReducer from "./products.reducers";
import costingReducer from "./costing.reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  costing: costingReducer,
});

export default rootReducer;

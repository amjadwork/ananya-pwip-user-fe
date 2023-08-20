import {
  SET_COSTING_SELECTION,
  RESET_COSTING_SELECTION,
} from "./types/costing.types";

export const setCostingSelection = (selected) => ({
  type: SET_COSTING_SELECTION,
  payload: selected,
});

export const resetCostingSelection = () => ({
  type: RESET_COSTING_SELECTION,
});

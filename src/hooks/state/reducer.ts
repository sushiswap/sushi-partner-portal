import { combineReducers } from "@reduxjs/toolkit";

import application from "./reducer/reducer";

const reducer = combineReducers({
  application,
});

export default reducer;

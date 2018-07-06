import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
// import index from "./reducers";
const initialState = {};
const middleware = [thunk];

// First param is your root reducer
const store = createStore(
  rootReducer,
  // index,
  initialState,

  // My modification
  // errors,

  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;

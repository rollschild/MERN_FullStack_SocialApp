import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
  // greetings: "test"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEST_DISPATCH:
      return {
        // return a copy of the state
        // DISPATCHing to the reducer the data that got
        // ...passed in
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}

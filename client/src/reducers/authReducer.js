// import { TEST_DISPATCH } from "../actions/types";
import isEmpty from "../validation/is-empty";
import { SET_CURRENT_USER } from "../actions/types";
const initialState = {
  isAuthenticated: false,
  user: {}
  // greetings: "test"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      // setState({ errors: {} });
      return {
        ...state, // extract the state
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}

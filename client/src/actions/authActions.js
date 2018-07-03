import { TEST_DISPATCH } from "./types";

// Register
// This is an action creator
// ...which will go ahead and despatch
// ...this to the reducer along with the payload
export const registerUser = userData => {
  return {
    // must have a type
    type: TEST_DISPATCH,
    payload: userData
  };
};

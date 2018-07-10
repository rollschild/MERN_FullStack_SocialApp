import axios from "axios";
import {
  GET_PROFILE,
  // GET_ERRORS,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading);
  axios
    .get("/api/profiles")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data // the actual profile
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE, // not GET_ERRORS
        payload: {}
      });
    });
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

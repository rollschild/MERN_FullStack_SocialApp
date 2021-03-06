import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_PROFILES
} from "./types";
import { logoutUser } from "./authActions";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
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

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profiles/handle/${handle}`)
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data // the actual profile
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE, // not GET_ERRORS
        payload: null // we want to check if it's null later
      });
    });
};

// Get all profiles for all users
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profiles/all")
    .then(res => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data // the actual profile
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE, // not GET_ERRORS
        payload: null // we want to keep the profile
        // ...state as null in the reducer
      });
    });
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post("/api/profiles/experience", expData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post("/api/profiles/education", eduData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete an experience
export const deleteExperience = id => dispatch => {
  axios
    .delete(`/api/profiles/experience/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete an experience
export const deleteEducation = id => dispatch => {
  axios
    .delete(`/api/profiles/education/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create profile
// history: we want to redirect
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profiles", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete BOTH account & profile
// we are using *dispatch* because we are
// ...using an axios request
export const deleteAccount = () => dispatch => {
  if (
    window.confirm("Are you sure to delete? This actions cannot be undone!")
  ) {
    axios
      .delete("/api/profiles")
      .then(res => {
        dispatch(logoutUser());
        /* dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        }); */
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  }
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

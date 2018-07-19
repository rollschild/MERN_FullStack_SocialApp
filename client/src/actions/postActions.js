import axios from "axios";
import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST,
  LIKE_POST
} from "./types";

// Add post
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
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

// Get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    // .then(res => dispatch(getPosts()))
    .then(({ data }) =>
      dispatch({
        type: LIKE_POST,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    // .then(res => dispatch(getPosts()))
    .then(({ data }) =>
      dispatch({
        type: LIKE_POST,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

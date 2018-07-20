import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  LIKE_POST
} from "../actions/types";

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false // set loading back to false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case DELETE_POST:
      return {
        ...state,
        // id of the post to be deleted comes
        //...in from the payload
        posts: state.posts.filter(post => post._id !== action.payload) // still having imutable state
      };
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return {
              ...post,
              ...action.payload
            };
          } else {
            return post;
          }
        })
      };
    default:
      return state;
  }
}

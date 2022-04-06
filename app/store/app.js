    // actions
export const APP_LOADING = "APP_LOADING";

// action creators
export const appLoading = (status = true) => {
  return { type: APP_LOADING, status };
};

// reducer
const initialState = { loading: false };
export default function reducer(state = initialState, action) {
  if (action.type === APP_LOADING) {
      return { loading: action.status };
  } else {
      return state;
  }
}

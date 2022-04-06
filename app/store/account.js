import {api} from '../components/config';
import {get, post} from '../components/crud';

export const ACCOUNT_SET = 'ACCOUNT_SET';
export const ACCOUNT_UPDATE = 'ACCOUNT_UPDATE';

export const AccountSet = user => ({type: ACCOUNT_SET, user});

export const accountFetch = () => {
  return async dispatch => {
    try {
      const response = await get(api.account);
      console.log(response);
      dispatch({type: ACCOUNT_SET, account: response});
    } catch (error) {
      console.log(error);
      dispatch({type: ACCOUNT_SET, account: null});
    }
  };
};

export const updatePushID = id => {
  return async dispatch => {
    try {
      const response = await post(api.push_id, {id});
      dispatch({type: ACCOUNT_UPDATE, push: response});
    } catch (error) {
      console.log(error);
      dispatch({type: ACCOUNT_UPDATE, push: null});
    }
  };
};

// reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case ACCOUNT_SET:
      return action.account;
    default:
      return state;
  }
}

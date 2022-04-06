import {api} from '../components/config';
import {get, post, update} from '../components/crud';

// action types
export const USER_DELETE = 'USER_DELETE';
export const USER_SET = 'USER_SET';
export const NEW_USER = 'NEW_USER';
export const UPDATE_USER = 'NEW_USER';

// action creators
export const userDelete = () => ({type: USER_DELETE});

export const userSet = user => ({type: USER_SET, user});

export const userFetch = token => {
  return async dispatch => {
    try {
      dispatch({type: USER_SET, user});
    } catch (error) {
      dispatch({type: USER_SET, user: null});
    }
  };
};

export const userUpdate = (document, data) => {
  return async dispatch => {
    update(api.user, document.replace(/\D+/g, ''), data)
      .then(r => {
        dispatch({
          type: UPDATE_USER,
          message: 'Dados atualizados',
          status: 'success',
        });
      })
      .catch(e => {
        dispatch({
          type: UPDATE_USER,
          message: 'Não foi possível atualizar',
          status: 'error',
        });
      });
  };
};

export const novaSenha = senha => {
  return async dispatch => {
    return await post(api.NovaSenha, {senha});
  };
};

export const esqueceuSenha = document => {
  return async dispatch => {
    return await post(api.esqueceuSenha, {document});
  };
};

export const termos = () => {
  return async dispatch => {
    return await post(api.termos, {});
  };
};

export const reAuthUser = senha => {
  return async dispatch => {
    return await post(api.userReauth, {senha});
  };
};

export const userSave = data => {
  return async dispatch => {
    return await post(api.user, data);
  };
};

export const userByDocumentFetch = document => {
  return async dispatch => {
    try {
      get(api.userByDocument + document.replace(/\D+/g, '')).then(r => {
        if (r.status === 'success') {
          dispatch({type: USER_SET, user: r.data});
        } else {
          dispatch({type: USER_SET, user: null});
        }
      });
    } catch (e) {
      dispatch({type: USER_SET, user: null});
    }
  };
};

// reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case USER_DELETE:
      return null;

    case USER_SET:
      return action.user;
    case UPDATE_USER:
      return action;
    default:
      return state;
  }
}

import {api} from "../components/config";
import {post} from "../components/crud";
import json from "../../package.json"

// action types
export const TOKEN_FETCH = "TOKEN_FETCH";
export const TOKEN_ERROR = "TOKEN_ERROR";


export const Authenticate = (document, password) => {
    return async dispatch => {
        try {
            let response = await post(api.login, {usuario: document, senha: password , versao:json.version});
            let { access_token } = response;
            if (access_token) {
                dispatch({type: TOKEN_FETCH, token: access_token});
            }
            dispatch({
                type: TOKEN_ERROR,
                error: response
            });
        } catch (error) {
            console.log(error);
            dispatch({type: TOKEN_FETCH, token: null});
        }
    };
};

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case TOKEN_FETCH:
            return action.token;
        case TOKEN_ERROR:
            const { error } = action;
            return error;
        default:
            return state;
    }

}

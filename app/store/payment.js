import {api} from "../components/config";
import {get, post, update} from "../components/crud";

// action types
export const AUTHORIZE_PAYMENT = "AUTHORIZE_PAYMENT";
export const PAYMENT_NOW = "PAYMENT_NOW";

export const paymentAuthorize = data => {
    return async dispatch => {
        let response = await post(api.authorize, {
            codigo: data.barCode,
            instalationVersion: data.instalationVersion,
        });
        dispatch({type: AUTHORIZE_PAYMENT, data: response.data});
    }
}

export const paymentNow = data => {
    return async dispatch => {
       let response = await post(api.pay, data);
        dispatch({type: PAYMENT_NOW, data: response})
    }

}

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case AUTHORIZE_PAYMENT:
            return action.data;
        case PAYMENT_NOW:
            const data = {details: action.data}
            return {...state, ...data}
        default:
            return state;
    }
}

import {api} from "../components/config";
import {post} from "../components/crud";

export const BILLET_VALIDATE = "BILLET_VALIDATE";
export const BILLET_CIP = "BILLET_CIP";
export const SET_INFO = "SET_INFO";
export const BILLET_PAY = 'BILLET_PAY';

export const billetValidateFetch = (codigo) => {
    return async dispatch => {
        try {
            const response = await post(api.validateBillet, {codigo});
            dispatch({
                type: BILLET_VALIDATE,
                data: response.data !== 'Ocorreu um erro.' ? response.data : response.message
            });
        } catch (error) {
            console.log(error);
            dispatch({type: BILLET_VALIDATE, data: null});
        }
    };
};

export const billetCIPFetch = (codigo) => {
    return async dispatch => {
        try {
            const response = await post(api.consultCIP, {codigo});
            dispatch({type: BILLET_CIP, data: response.data !== 'Ocorreu um erro.' ? response.data : response.message});
        } catch (error) {
            dispatch({type: BILLET_CIP, data: null});
        }
    }
};

export const billetPay = (data) => {
    return async dispatch => {
        return await post(api.payBillet, data);
    }
}

export const setBilletInfo = (column, value) => {
    return async dispatch => {
        try {
            let data = {column, value};
            dispatch({type: SET_INFO, data});
        } catch (error) {

        }
    }
}

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case SET_INFO:
            let resp = {};
            resp[action.data.column] = action.data.value;
            return {...state, ...resp};
        case BILLET_VALIDATE:
            return action.data;
        case BILLET_CIP:
            const {data} = action;
            data.isValid = true;
            return data;
        case BILLET_PAY:
            return action.data;
        default:
            return state;
    }
}

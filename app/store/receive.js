import {api} from "../components/config";
import {get, post, update} from "../components/crud";

// action types
export const GENERATE_PAYMENT = "GENERATE_PAYMENT";

export const generatePayment = (value) => {
    return async dispatch => {
        try{
            let response = await post(api.payment, {valor: value});
            dispatch({type: GENERATE_PAYMENT, data: response});
            console.log(response)
        } catch(e){

        }
    }
}

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case GENERATE_PAYMENT:
            return action.data;
        default:
            return state;
    }
}

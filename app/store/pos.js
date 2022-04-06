import {get} from "../components/crud";
import {api} from "../components/config";
import moment from "moment";

export const POS_TRANSACTIONS = 'POS_TRANSACTIONS';

export const posTransactionFetch = (data_inicial, data_final) => {
    console.log(data_inicial, 'data ini store');
    console.log(data_final, 'data fim store')
    return async dispatch => {
        try {
              data_inicial = data_inicial ?? '';
            data_final = data_final ?? '';
            const response = await get(api.frogPOS, {data_inicial, data_final});
            dispatch({type: POS_TRANSACTIONS, response});
            //console.log(response,'response')
        } catch (error) {
            //console.log(error, 'error');
            dispatch({type: POS_TRANSACTIONS, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case POS_TRANSACTIONS:
            //console.log(action.response)
            return action.response;
        default:
            return state;
    }
}



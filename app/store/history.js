import {api} from "../components/config";
import {get} from "../components/crud";
import moment from "moment";

export const HISTORY_SET = "HISTORY_SET";

export const historySet = user => ({type: HISTORY_SET, user});

export const historyFetch = (data_inicial, data_final) => {
    return async dispatch => {
        try {
            data_inicial = data_inicial ?? '';
            data_final = data_final ?? '';
            const response = await get(api.history, {data_inicial, data_final});
            
            dispatch({type: HISTORY_SET, history: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: HISTORY_SET, history: null});
        }
    };
};

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case HISTORY_SET:
            const {days, perDay} = action.history;
            return {days, perDay};
        default:
            return state;
    }
}

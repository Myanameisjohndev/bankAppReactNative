import {get} from "../components/crud";
import {api} from "../components/config";

export const BANK_LIST = 'BANK_LIST';

export const banksFetch = () => {
    return async dispatch => {
        try {
            const response = await get(api.banks);
            dispatch({type: BANK_LIST, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: BANK_LIST, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case BANK_LIST:
            return action.data;
        default:
            return state;
    }
}

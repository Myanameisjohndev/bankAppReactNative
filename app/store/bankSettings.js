import {get} from "../components/crud";
import {api} from "../components/config";

export const BANK_INFORMATIONS = 'BANK_INFORMATIONS';

export const settingsFetch = () => {
    return async dispatch => {
        try {
            const response = await get(api.settings);
            dispatch({type: BANK_INFORMATIONS, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: BANK_INFORMATIONS, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case BANK_INFORMATIONS:
            return action.data;
        default:
            return state;
    }
}

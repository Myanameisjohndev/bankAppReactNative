import {post} from "../components/crud";
import {api} from "../components/config";

export const ANTICIPATION_REQUEST = 'ANTICIPATION_REQUEST';

export const requestAnticipation = (value) => {
    return async dispatch => {
        try {
            const response = await post(api.anticipation, {valor: value});
            dispatch({type: ANTICIPATION_REQUEST, data: response});
        } catch (error) {
            console.log(error);
            dispatch({type: ANTICIPATION_REQUEST, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case ANTICIPATION_REQUEST:
            return action.data;
        default:
            return state;
    }
}

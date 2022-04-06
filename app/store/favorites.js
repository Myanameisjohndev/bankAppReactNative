import {get, post} from "../components/crud";
import {api} from "../components/config";

export const FAVORITE_LIST = 'FAVORITE_LIST';
export const TYPE_KEYS = 'TYPE_KEYS';

export const favoritesFetch = () => {
    return async dispatch => {
        try {
            const response = await get(api.favoritos);
            dispatch({type: FAVORITE_LIST, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: FAVORITE_LIST, data: {}});
        }
    };
};

export const favoritesStore = (data) => {
    return async dispatch => {
        try {
            console.log('envio e');
            console.log(data);
            const response = await post(api.favoritos, data);
            console.log('retorno e');
            console.log(response);
            dispatch({type: FAVORITE_LIST, data: response});
        } catch (error) {
            console.log('exception');
            console.log(error);
            dispatch({type: FAVORITE_LIST, data: response});
        }
    };
}

export const getTypeKeys = () => {
    return async dispatch => {
        try {
            const response = await get(api.getTypeKeys);
            //console.log(response)
            dispatch({type: TYPE_KEYS, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: TYPE_KEYS, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case FAVORITE_LIST:
            return action.data;
        case TYPE_KEYS:
            let keys = action.data;
            return {...state,...{keys}};    
        default:
            return state;
    }
}

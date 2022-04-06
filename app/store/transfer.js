import {find, get, post, postPix} from "../components/crud";
import {api} from "../components/config";

export const SET_INFO = 'SET_INFO';
export const CLEAR_INFO = 'CLEAR_INFO';
export const TRANSFER = 'TRANSFER';


export const setTransferInfo = (column, value) => {
    return async dispatch => {
        try {
            let data = {column, value};
            dispatch({type: SET_INFO, data});
        } catch (error) {

        }
    }
}

export const clearTransfer = () => {
    return async dispatch => {
        try {
            dispatch({type: CLEAR_INFO});
        } catch (error) {

        }
    }
}

export const transferNow = (data) => {
    return async dispatch => {
        try {
            console.log('data do envio');
            console.log(data);
            let request = await post(data.tipo_chave==null ? api.transfer : api.transferPix, data);
            console.log('Response do pix abaixo');
            console.log(request);
            return request;
        } catch (e) {
            console.log(e);
        }
    }
}

export const findAccount = (CpfOrCnpj, bank) => {
    return async dispatch => {
        try{
            console.log(CpfOrCnpj)
            return await get(api.findAccount+'/'+CpfOrCnpj, {bank});
        } catch(e){
            console.log(e)
        }
    }
}
export default function reducer(state = null, action) {
    switch (action.type) {
        case SET_INFO:
            let data = {};
            data[action.data.column] = action.data.value;
            return {...state, ...data};
        case CLEAR_INFO:
            return {};
        case TRANSFER:
            return action.data;
        default:
            return state;
    }
}

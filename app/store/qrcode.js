import {api} from "../components/config";
import {get, post, update} from "../components/crud";

// action types
export const QRCODE = "QRCODE";

export const gerarQrCode = (value) => {
    return async dispatch => {
        try{  
           
            const response = await post(api.solicitarQrCode, {valor: value});
            dispatch({type: QRCODE, data: response});
            
        } catch(e){
            
            console.log(e)
        }
    }
}

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case QRCODE:
            return action.data;
        default:
            return state;
    }
}

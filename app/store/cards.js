import {get, post, update , put, del} from "../components/crud";
import {api} from "../components/config";

//Cards

export const CARD_LIST = 'CARD_LIST';
export const UPDATE_CARD = 'UPDATE_CARD';
export const NEW_CARD_VIRTUAL = 'NEW_CARD_VIRTUAL'
export const HISTORY_SET = "HISTORY_SET";
export const LIBERAR_PRIMEIRO_CARTAO = "LIBERAR_PRIMEIRO_CARTAO"

export const cardsFetch = () => {
    return async dispatch => {
        try {
            const response = await get(api.cards);
            //console.log('cards sao ');
            //console.log(response);
            dispatch({type: CARD_LIST, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: CARD_LIST, data: {}});
        }
    };
};

export const updateStatusCardStore = (data, bool) => {
    return async dispatch => {
        try {
            console.log(data, bool, 'store')
            let response='';
            if(Boolean(bool) === true){
                console.log('Metodo bloquear cartao');
                response = await post(api.bloquearCartao, data);
            }else if(Boolean(bool) === false){
                console.log('Metodo desbloquear cartao');
               response = await post(api.desbloquearCartao, data);
            }
            //
            console.log('response cartao e ');
            console.log(response);
            return response;
            //dispatch({type: UPDATE_CARD, data: response.data});
        } catch (error) {
            console.log('exception');
            console.log(error);
            return error;
            //dispatch({type: UPDATE_CARD, data: response});
        }
    };
}

export const novaSenhaCartao = (data) => {
    return async dispatch => {
        try {
            console.log('dados atualizar senha');
            console.log(data);
            let response = await put(api.newPasswordCard ,data);
            console.log(response);

            return response;
            //dispatch({type: UPDATE_CARD, data: response.data});
        } catch (error) {
            console.log('exception');
            console.log(error);
            return error;
            //dispatch({type: UPDATE_CARD, data: response});
        }
    };
}

export const listarCartaoVirtual = (params) => {
    return async dispatch => {
        const result = await get(api.listarCartaoVirtual)
        //console.log(result)
        return result

    };
};

export const excluirCartaoVirtual = (params) => {
    return async dispatch => {
        const result = await del(api.excluirCartaoVirtual, params)
        //await del(api.excluirCartaoVirtual, params)
        //console.log(result)
        return result

    };
};


export const solicitarNovoCartaoVirtual = (params) => {
    return async dispatch => {
        const result = await post(api.solicitarNovoCartaoVirtual)
        //console.log(result)
        return result

    };
};


export const historyFetch = (data_inicial, data_final) => {
    return async dispatch => {
        try {
            console.log(response, 'teste')
            //console.log('cards1')
            data_inicial = data_inicial ?? '';
            data_final = data_final ?? '';
            const response = await get(api.cardHistory, {data_inicial, data_final});

            dispatch({type: HISTORY_SET, history: response.data});
        } catch (error) {
            //console.log(error);
            console.log('cards2')
            dispatch({type: HISTORY_SET, history: null});
        }
    };
};

export const exibirSenha = (params) => {
    let dados = {
        id_cartao: params.id_cartao,
        id_usuario: params.id_usuario
    }
    return async dispatch => {
        const result = await get(api.exibirSenhaCartaoFisico, dados)
        return result

    };
};


export const desbloquearPrimeiroCartao = (params) => {
    return async dispatch => {
        const result = await post(api.desbloquearPrimeiroCartao, params)
        return result

    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case NEW_CARD_VIRTUAL:
            console.log(action.data, 'action.datacas')
            return action.data
        case CARD_LIST:
            //console.log(action.data)
            return action.data;
        default:
            return state;
    }
}

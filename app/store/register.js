import {get} from "../components/crud";
import {api} from "../components/config";

export const CONSULTAR_CPFCNPJ = 'CONSULTAR_CPFCNPJ';

export const usuarioDocumentoFetch = (documento) => {
    return async dispatch => {
        try {
            documento = documento.replace(/\D+/g, '');
            console.log(documento)
            const response = await get(api.consultarDocumento, {documento});
             dispatch({type: CONSULTAR_CPFCNPJ, data: response.data});
        } catch (error) {
            console.log(error);
            dispatch({type: CONSULTAR_CPFCNPJ, data: {}});
        }
    };
};

export default function reducer(state = null, action) {
    switch (action.type) {
        case CONSULTAR_CPFCNPJ:
            return action.data;
        default:
            return state;
    }
}

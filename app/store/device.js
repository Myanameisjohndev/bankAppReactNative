import {api} from "../components/config";
import {get, post, update} from "../components/crud";
import DeviceInfo from "react-native-device-info";

export const DEVICE_VALIDATE = "DEVICE_VALIDATE";

export const deviceValidate = (deviceID, deviceName) => {
    return async dispatch => {
        let response = await get(api.device, {dispositivo: deviceID, dispositivo_nome: deviceName});
        if (response.status === 'success') {
            dispatch({type: DEVICE_VALIDATE, data: response})
        } else {
            dispatch({type: DEVICE_VALIDATE, data: {status: 'error', message: 'Dispositivo não autorizado!'}});
        }
    }
}

export const userDeviceValidate = (image) => {
    return async dispatch => {
        let response = await post(api.faceValidate, {foto: image, dispositivo: DeviceInfo.getUniqueId()});

        if (response.status === 'success') {
            dispatch({type: DEVICE_VALIDATE, data: response})
        } else {
            console.log(response)
            dispatch({type: DEVICE_VALIDATE, data: {status: 'error', message: response.data}});
        }
    }
}

// reducer
export default function reducer(state = null, action) {
    switch (action.type) {
        case DEVICE_VALIDATE:
            return action.data;
        default:
            return state;
    }
}

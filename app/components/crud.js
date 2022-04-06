import AsyncStorage from '@react-native-community/async-storage';

export async function get(rota, params = []) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
        };
        fetch(rota + '?true&' + converter(params), init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
            }).catch(e => reject(e))
    })
}

export async function find(rota, id) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
        };
        fetch(rota + '/' + id, init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
            })
    })
}

export async function post(rota, params) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(params),
        };
        fetch(rota, init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
            }).catch(e => {
                console.log(e)
            reject(e.message);
        })
    })
}

/**
 *
 * @param rota
 * @param id
 * @returns {Promise<unknown>}
 */
export async function del(rota, id, reject) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'delete',
            headers: myHeaders,
            mode: 'cors',
        };
        console.log(rota + id)
        fetch(rota + id, init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
                //console.log(response, 'response')
            }).catch(e => reject(e))
    })
};

/**
 *
 * @param rota
 * @param id
 * @param params
 * @returns {Promise<unknown>}
 */
export async function update(rota, id, params) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(params),
        };

        fetch(rota + "/" + id, init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
            })
    })
}

export async function put(rota, params) {
    let myHeaders = new Headers({
        'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => {
        let init = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(params),
        };

        fetch(rota , init)
            .then(res => res.json())
            .then(response => {
                resolve(response);
            })
    })
}

function converter(params) {
    if (Object.keys(params).length === 0) return params;
    return Object.keys(params).map(
        indice => indice + '=' + params[indice]
    ).join('&');
}

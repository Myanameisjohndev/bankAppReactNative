export const Helpers = {
    toMoney: (value) => {
        return parseFloat(value).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, "$1.")
    },
    validateEmail: (email) => {
        if (email === undefined || email === null || email === '') return false;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    validateCellPhone: (cellphone) => {
        return cellphone !== null && cellphone !== '' && cellphone.replace(/\D+/g, '').length === 11;
    },
    validateName: (name) => {
        return name !== null && name !== '';
    },
    validarCPF: (cpf) => {
        if (!cpf) return false;
        cpf = cpf.trim();
        if (cpf === null || cpf === '' || cpf === undefined) return false;
        cpf = cpf.replace(/\D+/g, '');
        cpf = cpf.split('');
        if (!cpf || cpf.length !== 11 || cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222"
            || cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" || cpf === "66666666666"
            || cpf === "77777777777" || cpf === "88888888888" || cpf === "99999999999") return false;

        let v1 = 0;
        let v2 = 0;
        let aux = false;

        for (let i = 1; cpf.length > i; i++) {
            if (cpf[i - 1] != cpf[i]) {
                aux = true;
            }
        }

        if (aux == false) {
            return false;
        }

        for (let i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
            v1 += cpf[i] * p;
        }

        v1 = ((v1 * 10) % 11);

        if (v1 == 10) {
            v1 = 0;
        }

        if (v1 != cpf[9]) {
            return false;
        }

        for (let i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
            v2 += cpf[i] * p;
        }

        v2 = ((v2 * 10) % 11);

        if (v2 == 10) {
            v2 = 0;
        }

        if (v2 != cpf[10]) {
            return false;
        } else {
            return true;
        }

    },
    validCnpj: function (cnpj) {
        if (!cnpj || cnpj.length != 18) return false;
        cnpj = cnpj.trim();
        cnpj = cnpj.replace(/\D+/g, '');
        cnpj = cnpj.split('');

        let v1 = 0;
        let v2 = 0;
        let aux = false;

        for (let i = 1; cnpj.length > i; i++) {
            if (cnpj[i - 1] != cnpj[i]) {
                aux = true;
            }
        }

        if (aux == false) {
            return false;
        }

        for (let i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v1 += cnpj[i] * p1;
            } else {
                v1 += cnpj[i] * p2;
            }
        }

        v1 = (v1 % 11);

        if (v1 < 2) {
            v1 = 0;
        } else {
            v1 = (11 - v1);
        }

        if (v1 != cnpj[12]) {
            return false;
        }

        for (let i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v2 += cnpj[i] * p1;
            } else {
                v2 += cnpj[i] * p2;
            }
        }

        v2 = (v2 % 11);

        if (v2 < 2) {
            v2 = 0;
        } else {
            v2 = (11 - v2);
        }

        if (v2 != cnpj[13]) {
            return false;
        } else {
            return true;
        }
    },
    convertToMoney: (value) => {
        try {
            value = value.toString().replace(/\D+/g, '')
            let reais = value.substr(0, value.length - 2)
            let centavos = value.substr(value.length - 2, value.length) || '00';

            return 'R$ ' + reais + ',' + centavos;
        } catch (e) {
            console.log(e);
            return '0,00';
        }
    },
    toTitleCase: (phrase) => {
        try {
            return phrase
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        } catch (e) {
            return null;
        }
    },
    toUpper(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) {
                return word[0].toUpperCase() + word.substr(1);
            })
            .join(' ');
    }
};
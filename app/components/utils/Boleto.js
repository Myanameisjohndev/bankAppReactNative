/**
 * Identifica o tipo de código inserido (se baseando na quantidade de dígitos).
 *
 * ------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * ------------
 *
 * @return {string} CODIGO_DE_BARRAS
 * @return {string} LINHA_DIGITAVEL
 */
exports.identificarTipoCodigo = function identificarTipoCodigo(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    if (codigo.length == 44) {
        return 'CODIGO_DE_BARRAS'
    } else if (codigo.length == 46 || codigo.length == 47 || codigo.length == 48) {
        return 'LINHA_DIGITAVEL'
    } else {
        return 'TAMANHO_INCORRETO';
    }
}

/**
 * Identifica o tipo de boleto inserido a partir da validação de seus dois dígitos iniciais.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {string} BANCO
 * @return {string} ARRECADACAO_PREFEITURA
 * @return {string} ARRECADACAO_ORGAOS_GOVERNAMENTAIS
 * @return {string} ARRECADACAO_TAXAS_DE_TRANSITO
 * @return {string} CONVENIO_SANEAMENTO
 * @return {string} CONVENIO_ENERGIA_ELETRICA_E_GAS
 * @return {string} CONVENIO_TELECOMUNICACOES
 * @return {string} OUTROS
 */
exports.identificarTipoBoleto = function identificarTipoBoleto(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    if (codigo.substr(0, 1) == '8') {
        if (codigo.substr(1, 1) == '1') {
            return 'ARRECADACAO_PREFEITURA';
        } else if (codigo.substr(1, 1) == '2') {
            return 'CONVENIO_SANEAMENTO';
        } else if (codigo.substr(1, 1) == '3') {
            return 'CONVENIO_ENERGIA_ELETRICA_E_GAS';
        } else if (codigo.substr(1, 1) == '4') {
            return 'CONVENIO_TELECOMUNICACOES';
        } else if (codigo.substr(1, 1) == '5') {
            return 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS';
        } else if (codigo.substr(1, 1) == '6' || codigo.substr(1, 1) == '9') {
            return 'OUTROS';
        } else if (codigo.substr(1, 1) == '7') {
            return 'ARRECADACAO_TAXAS_DE_TRANSITO';
        }
    } else {
        return 'BANCO';
    }
}

exports.identificarParaQuem =  function identificarParaQuem(codigo){
    let Tipo = this.identificarTipoBoleto(codigo);
    let retorno = null;
   if(Tipo === 'BANCO'){
       let banco = codigo.substr(0, 3);
       switch (parseInt(banco)) {
           case 246:
               retorno = 'Banco ABC Brasil';
           break;
       }
   }

    return retorno;
}

/**
 * Identifica o o código de referência do boleto para determinar qual módulo
 * será utilizado para calcular os dígitos verificadores
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {json} {mod, efetivo}
 */
exports.identificarReferencia = function identificarReferencia(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');

    const referencia = codigo.substr(2, 1);

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    switch (referencia) {
        case '6':
            return {
                mod: 10,
                    efetivo: true
            };
            break;
        case '7':
            return {
                mod: 10,
                    efetivo: false
            };
            break;
        case '8':
            return {
                mod: 11,
                    efetivo: true
            };
            break;
        case '9':
            return {
                mod: 11,
                    efetivo: false
            };
            break;
        default:
            break;
    }
}

/**
 * Identifica o fator da data de vencimento do boleto
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {Date} dataBoleto
 */
exports.identificarData = function identificarData (codigo, tipoCodigo){
    codigo = codigo.replace(/[^0-9]/g, '');
    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let fatorData = '';
    let dataBoleto = new Date();

    dataBoleto.setFullYear(1997);
    dataBoleto.setMonth(9);
    dataBoleto.setDate(7);
    dataBoleto.setHours(23, 54, 59);

    if (tipoCodigo === 'CODIGO_DE_BARRAS') {
        if (tipoBoleto == 'BANCO') {
            fatorData = codigo.substr(5, 4)
        } else {
            fatorData = '0';
        }
    } else if (tipoCodigo === 'LINHA_DIGITAVEL') {
        if (tipoBoleto == 'BANCO') {
            fatorData = codigo.substr(33, 4)
        } else {
            fatorData = '0';
        }
    }

    dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData));
    dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000);

    return dataBoleto.toLocaleDateString();
}

/**
 * Identifica o valor no CÓDIGO DE BARRAS do boleto do tipo 'Arrecadação'
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {string} valorFinal
 */
exports.identificarValorCodBarrasArrecadacao = function identificarValorCodBarrasArrecadacao(codigo, tipoCodigo) {
    codigo = codigo.replace(/[^0-9]/g, '');
    const isValorEfetivo = this.identificarReferencia(codigo).efetivo;

    let valorBoleto = '';
    let valorFinal;

    if (isValorEfetivo) {
        if (tipoCodigo == 'LINHA_DIGITAVEL') {
            valorBoleto = codigo.substr(4, 14);
            valorBoleto = codigo.split('');
            valorBoleto.splice(11, 1);
            valorBoleto = valorBoleto.join('');
            valorBoleto = valorBoleto.substr(4, 11);
        } else if (tipoCodigo == 'CODIGO_DE_BARRAS') {
            valorBoleto = codigo.substr(4, 11);
        }

        valorFinal = valorBoleto.substr(0, 9) + '.' + valorBoleto.substr(9, 2);

        let char = valorFinal.substr(1, 1);
        while (char === '0') {
            valorFinal = substringReplace(valorFinal, '', 0, 1);
            char = valorFinal.substr(1, 1);
        }

    } else {
        valorFinal = 0;
    }

    return valorFinal;
}

/**
 * Identifica o valor no boleto inserido
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {string} tipoCodigo tipo de código inserido (CODIGO_DE_BARRAS / LINHA_DIGITAVEL)
 *
 * -------------
 *
 * @return {float} valorFinal
 */
exports.identificarValor = function identificarValor(codigo, tipoCodigo) {

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let valorBoleto = '';
    let valorFinal;

    if (tipoCodigo == 'CODIGO_DE_BARRAS') {
        if (tipoBoleto == 'BANCO') {
            valorBoleto = codigo.substr(9, 10);
            valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2);

            let char = valorFinal.substr(1, 1);
            while (char === '0') {
                valorFinal = substringReplace(valorFinal, '', 0, 1);
                char = valorFinal.substr(1, 1);
            }
        } else {
            valorFinal = this.identificarValorCodBarrasArrecadacao(codigo, 'CODIGO_DE_BARRAS');
        }

    } else if (tipoCodigo == 'LINHA_DIGITAVEL') {
        if (tipoBoleto == 'BANCO') {
            valorBoleto = codigo.substr(37);
            valorFinal = valorBoleto.substr(0, 8) + '.' + valorBoleto.substr(8, 2);

            let char = valorFinal.substr(1, 1);
            while (char === '0') {
                valorFinal = substringReplace(valorFinal, '', 0, 1);
                char = valorFinal.substr(1, 1);
            }
        } else {
            valorFinal = this.identificarValorCodBarrasArrecadacao(codigo, 'LINHA_DIGITAVEL');
        }
    }
    return parseFloat(valorFinal);
}


/**
 * Calcula o dígito verificador de uma numeração a partir do módulo 11
 *
 * -------------
 *
 * @param {string} numero Numeração
 *
 * -------------
 *
 * @return {string} soma
 */
exports.calculaMod11 = function calculaMod11(numero , tipo_boleto=null){
    numero = numero.replace(/\D/g, '');

    let soma = 0;
    let peso = 2;
    const base = 9;
    const contador = numero.length - 1;
    for (let i = contador; i >= 0; i--) {
        soma = soma + (parseInt(numero.substring(i, i + 1)) * peso);
        if (peso < base) {
            peso++;
        } else {
            peso = 2;
        }
    }

    let digito = 11 - (soma % 11);
    if (digito > 9) {
        digito = 0;
    }

    // Se for igual a 0, 10 ou 11, o dígito será 1
    if (tipo_boleto !== 'CONVENIO_TELECOMUNICACOES' && (digito === 0 || digito === 10 || digito === 11)) {
        digito = 1;
    }
    else if (tipo_boleto === 'CONVENIO_TELECOMUNICACOES' &&  (digito === 0 || digito === 10 || digito === 11)) {
        digito = digito.toString().substr(digito.length-1,1);
    }

    return digito;
}

/**
 * Define qual módulo deverá ser utilizado para calcular os dígitos verificadores
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {int} mod Modulo 10 ou Modulo 11
 *
 * -------------
 *
 * @return {string} digitoVerificador
 */
exports.digitosVerificadores = function digitosVerificadores(codigo, mod) {
    codigo = codigo.replace(/[^0-9]/g, '');
    switch (mod) {
        case 10:
            return (codigo + this.calculaMod10(codigo)).toString();
            break;
        case 11:
            return (codigo + this.calculaMod11(codigo)).toString();
            break;
        default:
            break;
    }
}

/**
 * Converte a numeração do código de barras em linha digitável
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {boolean} formatada Gerar numeração convertida com formatação (formatado = true / somente números = false)
 *
 * -------------
 *
 * @return {string} resultado
 */
exports.codBarras2LinhaDigitavel = function codBarras2LinhaDigitavel(codigo, formatada){
    codigo = codigo.replace(/[^0-9]/g, '');

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let resultado = '';

    if (tipoBoleto == 'BANCO') {
        const novaLinha = codigo.substr(0, 4) + codigo.substr(19, 25) + codigo.substr(4, 1) + codigo.substr(5, 14);

        const bloco1 = novaLinha.substr(0, 9) + this.calculaMod10(novaLinha.substr(0, 9));
        const bloco2 = novaLinha.substr(9, 10) + this.calculaMod10(novaLinha.substr(9, 10));
        const bloco3 = novaLinha.substr(19, 10) + this.calculaMod10(novaLinha.substr(19, 10));
        const bloco4 = novaLinha.substr(29);

        resultado = (bloco1 + bloco2 + bloco3 + bloco4).toString();

        if (formatada) {
            resultado =
                resultado.slice(0, 5) +
                '.' +
                resultado.slice(5, 10) +
                ' ' +
                resultado.slice(10, 15) +
                '.' +
                resultado.slice(15, 21) +
                ' ' +
                resultado.slice(21, 26) +
                '.' +
                resultado.slice(26, 32) +
                ' ' +
                resultado.slice(32, 33) +
                ' ' +
                resultado.slice(33);
        }
    } else {
        const identificacaoValorRealOuReferencia = this.identificarReferencia(codigo);
        let bloco1;
        let bloco2;
        let bloco3;
        let bloco4;

        if (identificacaoValorRealOuReferencia.mod == 10) {
            bloco1 = codigo.substr(0, 11) + this.calculaMod10(codigo.substr(0, 11));
            bloco2 = codigo.substr(11, 11) + this.calculaMod10(codigo.substr(11, 11));
            bloco3 = codigo.substr(22, 11) + this.calculaMod10(codigo.substr(22, 11));
            bloco4 = codigo.substr(33, 11) + this.calculaMod10(codigo.substr(33, 11));
        } else if (identificacaoValorRealOuReferencia.mod == 11) {
            bloco1 = codigo.substr(0, 11) + this.calculaMod11(codigo.substr(0, 11),tipoBoleto);
            bloco2 = codigo.substr(11, 11) + this.calculaMod11(codigo.substr(11, 11),tipoBoleto);
            bloco3 = codigo.substr(22, 11) + this.calculaMod11(codigo.substr(22, 11),tipoBoleto);
            bloco4 = codigo.substr(33, 11) + this.calculaMod11(codigo.substr(33, 11),tipoBoleto);
        }

        resultado = bloco1 + bloco2 + bloco3 + bloco4;
    }

    return resultado;
}

/**
 * Converte a numeração da linha digitável em código de barras
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {string} resultado
 */
exports.linhaDigitavel2CodBarras = function linhaDigitavel2CodBarras(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let resultado = '';

    if (tipoBoleto == 'BANCO') {
        resultado = codigo.substr(0, 4) +
            codigo.substr(32, 1) +
            codigo.substr(33, 14) +
            codigo.substr(4, 5) +
            codigo.substr(10, 10) +
            codigo.substr(21, 10);
    } else {

        codigo = codigo.split('');
        codigo.splice(11, 1);
        codigo.splice(22, 1);
        codigo.splice(33, 1);
        codigo.splice(44, 1);
        codigo = codigo.join('');

        resultado = codigo;
    }

    return resultado;
}

/**
 * Calcula o dígito verificador de toda a numeração do código de barras
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 * @param {int} posicaoCodigo Posição onde deve se encontrar o dígito verificador
 * @param {int} mod Módulo 10 ou Módulo 11
 *
 * -------------
 *
 * @return {string} numero
 */
exports.calculaDVCodBarras = function calculaDVCodBarras(codigo, posicaoCodigo, mod) {
    codigo = codigo.replace(/[^0-9]/g, '');

    codigo = codigo.split('');
    codigo.splice(posicaoCodigo, 1);
    codigo = codigo.join('');

    if (mod === 10) {
        return this.calculaMod10(codigo);
    } else if (mod === 11) {
        return this.calculaMod11(codigo);
    }
}

/**
 * Informa se o código de barras inserido é válido, calculando seu dígito verificador.
 *
 * -------------
 *
 * @param {string} codigo Numeração do boleto
 *
 * -------------
 *
 * @return {boolean} true = boleto válido / false = boleto inválido
 */
exports.validarCodigoComDV = function validarCodigoComDV(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');
    let tipoCodigo = this.identificarTipoCodigo(codigo);
    let tipoBoleto;

    let resultado;

    if (tipoCodigo === 'LINHA_DIGITAVEL') {
        tipoBoleto = this.identificarTipoBoleto(codigo, 'LINHA_DIGITAVEL');

        if (tipoBoleto == 'BANCO') {
            const bloco1 = codigo.substr(0, 9) + this.calculaMod10(codigo.substr(0, 9));
            const bloco2 = codigo.substr(10, 10) + this.calculaMod10(codigo.substr(10, 10));
            const bloco3 = codigo.substr(21, 10) + this.calculaMod10(codigo.substr(21, 10));
            const bloco4 = codigo.substr(32, 1);
            const bloco5 = codigo.substr(33);

            resultado = (bloco1 + bloco2 + bloco3 + bloco4 + bloco5).toString();
        } else {
            const identificacaoValorRealOuReferencia = this.identificarReferencia(codigo);
            let bloco1;
            let bloco2;
            let bloco3;
            let bloco4;

            if (identificacaoValorRealOuReferencia.mod == 10) {
                bloco1 = codigo.substr(0, 11) + this.calculaMod10(codigo.substr(0, 11));
                bloco2 = codigo.substr(12, 11) + this.calculaMod10(codigo.substr(12, 11));
                bloco3 = codigo.substr(24, 11) + this.calculaMod10(codigo.substr(24, 11));
                bloco4 = codigo.substr(36, 11) + this.calculaMod10(codigo.substr(36, 11));
            } else if (identificacaoValorRealOuReferencia.mod == 11) {
                bloco1 = codigo.substr(0, 11) + this.calculaMod11(codigo.substr(0, 11));
                bloco2 = codigo.substr(12, 11) + this.calculaMod11(codigo.substr(12, 11));
                bloco3 = codigo.substr(24, 11) + this.calculaMod11(codigo.substr(24, 11));
                bloco4 = codigo.substr(36, 11) + this.calculaMod11(codigo.substr(36, 11));
            }

            resultado = bloco1 + bloco2 + bloco3 + bloco4;
        }
    } else if (tipoCodigo === 'CODIGO_DE_BARRAS') {
        tipoBoleto = this.identificarTipoBoleto(codigo, 'CODIGO_DE_BARRAS');

        if (tipoBoleto == 'BANCO') {
            const DV = this.calculaDVCodBarras(codigo, 4, 11);
            resultado = codigo.substr(0, 4) + DV + codigo.substr(5);
        } else {
            const identificacaoValorRealOuReferencia = this.identificarReferencia(codigo);

            resultado = codigo.split('');
            resultado.splice(3, 1);
            resultado = resultado.join('');

            const DV = this.calculaDVCodBarras(codigo, 3, identificacaoValorRealOuReferencia.mod);

            resultado = resultado.substr(0, 3) + DV + resultado.substr(3);

        }
    }

    return codigo === resultado;
}

/**
 * Gerar código de barras já realizando o cálculo do dígito verificador
 *
 * -------------
 *
 * @param {string} novoCodigo Numeração do boleto
 *
 * -------------
 *
 * @return {string} numero
 */
exports.geraCodBarras = function geraCodBarras(codigo){
    codigo = codigo.replace(/[^0-9]/g, '');

    const tipoBoleto = this.identificarTipoBoleto(codigo);

    let novoCodigo;

    novoCodigo = this.linhaDigitavel2CodBarras(codigo);
    novoCodigo = novoCodigo.split('');
    novoCodigo.splice(4, 1);
    novoCodigo = novoCodigo.join('');
    let dv = this.calculaMod11(novoCodigo);
    novoCodigo = novoCodigo.substr(0, 4) + dv + novoCodigo.substr(4);

    return novoCodigo;
}

/**
 * ## _`BOLETO COBRANÇA`_
 * ### _AS POSIÇÕES AQUI MENCIONADAS PARTEM DO NÚMERO 0 E NÃO DO 1, A FIM DE FACILITAR O ENTENDIMENTO LÓGICO_
 * ---------------------------------------------------------
 *
 * ### _TIPO:_ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)
 *
 * ---------------------------------------------------------
 *
 * #### _EXEMPLO:_ 11123444455555555556666666666666666666666666
 *
 * Bloco | Posições | Definição
 * --- | --- | ---
 * _1_ | *0 a 2*  | `Código do Banco na Câmara de Compensação`
 * _2_ | *3 a 3*  | `Código da Moeda = 9 (Real)`
 * _3_ | *4 a 4*  | `Digito Verificador (DV) do código de Barras`
 * _4_ | *5 a 8*  | `Fator de Vencimento`
 * _5_ | *9 a 18*  | `Valor com 2 casas de centavos`
 * _6_ | *19 a 43*  | `Campo Livre (De uso da instituição bancária)`
 *
 * ---------------------------------------------------------
 *
 * ### _TIPO:_ LINHA DIGITÁVEL (47 POSIÇÕES NUMÉRICAS)
 *
 * ---------------------------------------------------------
 *
 * #### _EXEMPLO_: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
 *
 * Campo | Posições linha dig. | Definição
 * --- | --- | ---
 * _A_ | *0 a 2* (0 a 2 do cód. barras)  | `Código do Banco na Câmara de compensação`
 * _B_ | *3 a 3* (3 a 3 do cód. barras)  | `Código da moeda`
 * _C_ | *4 a 8* (19 a 23 do cód. barras)  | `Campo Livre`
 * _X_ | *9 a 9*  | `Dígito verificador do Bloco 1 (Módulo 10)`
 * _D_ | *10 a 19* (24 a 33 do cód. barras)  | `Campo Livre`
 * _Y_ | *20 a 20*  | `Dígito verificador do Bloco 2 (Módulo 10)`
 * _E_ | *21 a 30* (24 a 43 do cód. barras)  | `Campo Livre`
 * _Z_ | *31 a 31*  | `Dígito verificador do Bloco 3 (Módulo 10)`
 * _K_ | *32 a 32* (4 a 4 do cód. barras)  | `Dígito verificador do código de barras`
 * _U_ | *33 a 36* (5 a 8 do cód. barras)  | `Fator de Vencimento`
 * _V_ | *37 a 43* (9 a 18 do cód. barras)  | `Valor`
 *
 * ## _`CONTA CONVÊNIO / ARRECADAÇÃO`_
 *
 * ---------------------------------------------------------
 *
 * ### _TIPO:_ CÓDIGO DE BARRAS (44 POSIÇÕES NUMÉRICAS)
 *
 * ---------------------------------------------------------
 *
 * #### _EXEMPLO_: 12345555555555566667777777777777777777777777
 *
 * Campo | Posições | Definição
 * --- | --- | ---
 * _1_ | *0 a 0*  | `"8" Identificação da Arrecadação/convênio`
 * _2_ | *1 a 1*  | `Identificação do segmento`
 * _3_ | *2 a 2*  | `Identificação do valor real ou referência`
 * _4_ | *3 a 3*  | `Dígito verificador geral (módulo 10 ou 11)`
 * _5_ | *4 a 14*  | `Valor efetivo ou valor referência`
 * _6_ | *15 a 18*  | `Identificação da empresa/órgão`
 * _7_ | *19 a 43*  | `Campo livre de utilização da empresa/órgão`
 *
 * ---------------------------------------------------------
 *
 * ### _TIPO:_ LINHA DIGITÁVEL (48 POSIÇÕES NUMÉRICAS)
 *
 * ---------------------------------------------------------
 *
 * #### _EXEMPLO_: ABCDEEEEEEE-W EEEEFFFFGGG-X GGGGGGGGGGG-Y GGGGGGGGGGG-Z
 *
 * Campo | Posições | Definição
 * --- | --- | ---
 * _A_ | *0 a 0*  | `"8" Identificação da Arrecadação/convênio`
 * _B_ | *1 a 1*  | `Identificação do segmento`
 * _C_ | *2 a 2*  | `Identificação do valor real ou referência`
 * _D_ | *3 a 3*  | `Dígito verificador geral (módulo 10 ou 11)`
 * _E_ | *4 a 14*  | `Valor efetivo ou valor referência`
 * _W_ | *11 a 11*  | `Dígito verificador do Bloco 1`
 * _F_ | *15 a 18*  | `Identificação da empresa/órgão`
 * _G_ | *19 a 43*  | `Campo livre de utilização da empresa/órgão`
 * _X_ | *23 a 23*  | `Dígito verificador do Bloco 2`
 * _Y_ | *35 a 35*  | `Dígito verificador do Bloco 3`
 * _Z_ | *47 a 47*  | `Dígito verificador do Bloco 4`
 */
exports.validarBoleto = function validarBoleto(codigo){
    let retorno = {};
    codigo = codigo.replace(/[^0-9]/g, '');

    /**
     * Boletos de cartão de crédito geralmente possuem 46 dígitos. É necessário adicionar mais um zero no final, para formar 47 caracteres
     * Alguns boletos de cartão de crédito do Itaú possuem 36 dígitos. É necessário acrescentar 11 zeros no final.
     */
    if (codigo.length == 36) {
        codigo = codigo + '00000000000';
    } else if (codigo.length == 46) {
        codigo = codigo + '0';
    }

    if (codigo.length != 44 && codigo.length != 46 && codigo.length != 47 && codigo.length != 48) {
        retorno.sucesso = false;
        retorno.codigoInput = codigo;
        retorno.mensagem = 'O código inserido possui ' + codigo.length + ' dígitos. Por favor insira uma numeração válida.';
    } else if (codigo.substr(0, 1) == '8' && codigo.length == 46 && codigo.length == 47) {
        retorno.sucesso = false;
        retorno.codigoInput = codigo;
        retorno.mensagem = 'Este tipo de boleto deve possuir um código de barras 44 caracteres numéricos. Ou linha digitável de 48 caracteres numéricos.';
    } else if (!this.validarCodigoComDV(codigo)) {
        retorno.sucesso = false;
        retorno.codigoInput = codigo;
        retorno.mensagem = 'A validação do dígito verificador falhou. Tem certeza que inseriu a numeração correta?';
    } else {
        retorno.sucesso = true;
        retorno.codigoInput = codigo;
        retorno.mensagem = 'Boleto válido';
        let tipoCodigo = this.identificarTipoCodigo(codigo);

        switch (tipoCodigo) {
            case 'LINHA_DIGITAVEL':
                retorno.tipoCodigoInput = 'LINHA_DIGITAVEL';
                retorno.tipoBoleto = this.identificarTipoBoleto(codigo, 'LINHA_DIGITAVEL');
                retorno.codigoBarras = this.linhaDigitavel2CodBarras(codigo);
                retorno.linhaDigitavel = codigo;
                retorno.vencimento = this.identificarData(codigo, 'LINHA_DIGITAVEL');
                retorno.valor = this.identificarValor(codigo, 'LINHA_DIGITAVEL');
                break;
            case 'CODIGO_DE_BARRAS':
                retorno.tipoCodigoInput = 'CODIGO_DE_BARRAS';
                retorno.tipoBoleto = this.identificarTipoBoleto(codigo, 'CODIGO_DE_BARRAS');
                retorno.codigoBarras = codigo;
                retorno.linhaDigitavel = this.codBarras2LinhaDigitavel(codigo, false);
                retorno.vencimento = this.identificarData(codigo, 'CODIGO_DE_BARRAS');
                retorno.valor = this.identificarValor(codigo, 'CODIGO_DE_BARRAS');
                retorno.destino = this.identificarParaQuem(codigo);
                break;
            default:
                break;
        }
    }

    return retorno;
}

/**
 * Calcula o dígito verificador de uma numeração a partir do módulo 10
 *
 * -------------
 *
 * @param {string} numero Numeração
 *
 * -------------
 *
 * @return {string} soma
 */
exports.calculaMod10 = function calculaMod10(numero) {
    numero = numero.replace(/\D/g, '');
    var i;
    var mult = 2;
    var soma = 0;
    var s = '';

    for (i = numero.length - 1; i >= 0; i--) {
        s = (mult * parseInt(numero.charAt(i))) + s;
        if (--mult < 1) {
            mult = 2;
        }
    }
    for (i = 0; i < s.length; i++) {
        soma = soma + parseInt(s.charAt(i));
    }
    soma = soma % 10;
    if (soma != 0) {
        soma = 10 - soma;
    }
    return soma;
}


/**
 * Função auxiliar para remover os zeros à esquerda dos valores detectados no código inserido
 *
 * -------------
 *
 * @param {string} str Texto a ser verificado
 * @param {string} repl Texto que substituirá
 * @param {int} inicio Posição inicial
 * @param {int} tamanho Tamanho
 *
 * -------------
 *
 * @return {string} resultado
 */
function substringReplace(str, repl, inicio, tamanho) {
    if (inicio < 0) {
        inicio = inicio + str.length;
    }

    tamanho = tamanho !== undefined ? tamanho : str.length;
    if (tamanho < 0) {
        tamanho = tamanho + str.length - inicio;
    }

    return [
        str.slice(0, inicio),
        repl.substr(0, tamanho),
        repl.slice(tamanho),
        str.slice(inicio + tamanho)
    ].join('');
}
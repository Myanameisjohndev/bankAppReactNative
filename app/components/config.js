import {baseUrl} from '../style/pallet';

export const colors = {
    primary: "#000",
    secondary: "#fff",
    thirdDark: '#1C1C1C',
    gray: "#57585b"
};


const api = {
    login: "/login",
    account: "/conta/usuario",
    push_id: "/conta/usuario/push",
    history: "/conta/historico",
    userByDocument: "/usuario/findAccount/",
    user: "/usuario",
    authorize: "/BankTransaction/pagamento/autorizar",
    pay: "/BankTransaction/pagamento/efetuar",
    device: "/conta/dispositivo",
    settings: "/settings",
    payment: "/boleto",
    registerFinish: '/pessoa/finish',
    saveDocument: '/pessoa_documentos',
    anticipation: '/conta/anticipation',
    banks: '/BankTransaction/getBanks',
    transfer: '/BankTransaction/transfer',
    transferPix:'/BankTransaction/pix',
    findAccount: '/usuario/findAccount',
    NovaSenha: '/usuario/novaSenha',
    esqueceuSenha: '/usuario/esqueceuSenha',
    userReauth: '/usuario/reauth',
    termos: '/usuario/termos',
    validateBillet: '/boleto/consultar',
    consultCIP: '/boleto/cip',
    payBillet: '/boleto/pagar',
    favoritos: '/favoritos',
    cards:'/cartao/todos',
    bloquearCartao:'/cartao/bloquear',
    desbloquearCartao:'/cartao/desbloquear',
    newPasswordCard:'/cartao/alterar_senha',
    getTypeKeys: '/getTiposChaves',
    consultarDocumento: '/usuario/documentos',
    frogPOS: '/frog/individual',
    faceValidate: '/conta/face',
    solicitarQrCode: '/pix/qrcode/estatico',
    solicitarNovoCartaoVirtual: '/cartao/virtual',
    cardHistory: '/conta/historico/cartao',
    desbloquearPrimeiroCartao: '/cartao/primeiro_desbloqueio',
    listarCartaoVirtual: '/cartao/virtual',
    excluirCartaoVirtual: '/cartao/virtual/',
    exibirSenhaCartaoFisico: '/cartao/exibir_senha'
};

Object.keys(api).forEach(key => {
    const url = () =>  `${baseUrl}${api[key]}`;
    api[key] = url();
});

export {api};

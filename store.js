import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk from "redux-thunk";

// reducers
import app from "./app/store/app";
import token from "./app/store/token";
import user from "./app/store/user";
import account from "./app/store/account";
import history from "./app/store/history";
import payment from "./app/store/payment";
import device from "./app/store/device";
import bankSettings from "./app/store/bankSettings";
import receive from './app/store/receive';
import anticipation from "./app/store/anticipation";
import banks from "./app/store/Banks";
import transfer from './app/store/transfer';
import billet from "./app/store/billet";
import favorites from './app/store/favorites';
import register from './app/store/register';
import pos from './app/store/pos';
import cards from './app/store/cards';
import qrcode from './app/store/qrcode';

const rootReducer = combineReducers({
    user,
    app,
    token,
    account,
    history,
    payment,
    device,
    bankSettings,
    receive,
    anticipation,
    banks,
    transfer,
    billet,
    favorites,
    register,
    pos,
    cards,
    
    qrcode
});

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

export default store;

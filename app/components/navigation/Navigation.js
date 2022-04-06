import React from "react";
import {createDrawerNavigator, createStackNavigator, createSwitchNavigator} from "react-navigation";
import {fadeIn} from 'react-navigation-transitions';
import Login from "../../../app/pages/login";
import Sessao from "../../../app/pages/sessao";
import NovaSessao from "../../../app/pages/NovaSessao";
import Validacao from "../../../app/pages/Validacao";
import Dashboard from "../../../app/pages/dashboard";
import History from "../../../app/pages/history";
import Receiver from "../../../app/pages/Receiver";
import Receipt from "../../../app/pages/Receipt";
import Register from "../../pages/register";
import Pay from "../../../app/pages/pay";
import Transfer from "../../../app/pages/transfer";
import {boxes, boxesLight, gradientBackgroundBase, movBoxes, selectedMenu} from "../../style/pallet";
import Authentication from "../../pages/authentication";
import BankList from "../../pages/transferSteps/bankList";
import receiverAccount from "../../pages/transferSteps/receiverAccount";
import security from "../security";
import confirmPayment from "../../pages/transferSteps/confirmPayment";
import EnterBarCode from "../../pages/paySteps/enterBarCode";
import billetInfo from "../../pages/paySteps/billetInfo";
import PosTransaction from "../../pages/posTranscations";
import FavoriteAccount from '../../pages/favoriteAccounts';
import NewPassword from "../../pages/newPassword";
import ForgotPassword from "../../pages/forgotPassword";
import Favored from "../../pages/favored";
import FavoredAccount from "../../pages/favored_account";
import CreateFavored from "../../pages/create_favored";
import CreateFavoredPix from "../../pages/create_favored_pix";
import Cards from "../../pages/cards";
import CardUser from "../../pages/cardUser";
import NewPasswordCard from "../cartao/newPasswordCard";
import QrCodeDeposit from "../../pages/QrCodeDeposit"
import cardHistory from "../cartao/cardHistory";
import GestaoCartao from "../../pages/gestãoCartao";
import SolicitarNovoCartao from "../cartao/solicitarNovoCartao";
import CartaoVirtual from "../cartao/cartaoVirtual";
import SenhaCartao from "../cartao/senhaCartao";

const tabNav = createStackNavigator(
    {
        Dashboard,
        History,
        Receipt,
        Transfer,
        Favored,
        FavoredAccount,
        CreateFavored,
        CreateFavoredPix,
        Cards,
        CardUser,
        NewPasswordCard,
        confirmPayment,
        Receiver,
        security,
        Pay,
        EnterBarCode,
        billetInfo,
        PosTransaction,
        QrCodeDeposit,
        cardHistory,
        GestaoCartao,
        SolicitarNovoCartao,
        CartaoVirtual,
        SenhaCartao
        
    },
    {
        initialRouteName: "Dashboard",
        defaultNavigationOptions: {
            headerShown: false,
            gesturesEnabled:false
        },
        transitionConfig: () => fadeIn(),
    },
    
);

let Navigation = () => {
    const headerStyles = {
        
        headerBackTitle: null,
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
   
            backgroundColor: '#f578',
 
        },
        cardStyle: {
            backgroundColor: '#f578'
        },

        headerTintColor: "#09d"
    };

    
    const AuthStackNavigator = createStackNavigator(
        {
            Login,
            Sessao,
            NovaSessao,
            Authentication,
            Register,
            ForgotPassword,
            
        },
        {
            initialRouteName: "Login",
            defaultNavigationOptions: headerStyles
        }
    );

    const TransNavigation = createStackNavigator(
        {
            Transfer,
            BankList,
            receiverAccount,
            security,
            FavoriteAccount,
            
        },
        {
            initialRouteName: "Transfer",
            defaultNavigationOptions: {
                headerShown: false
            },
            transitionConfig: () => fadeIn(),
        }
    );

    

    const ResetPassword = createStackNavigator({
            NewPassword,
          
        },
        {
            initialRouteName: "NewPassword",
            defaultNavigationOptions: {
                headerShown: false
            },
            transitionConfig: () => fadeIn(),
        })

    const ValidationScreen = createStackNavigator({
            Validacao
        },
        {
            initialRouteName: "Validacao",
            defaultNavigationOptions: {
                headerShown: false
            },
            transitionConfig: () => fadeIn(),
        })

    return createSwitchNavigator(
        {
            Auth: AuthStackNavigator,
            App: tabNav,
            Validacao: ValidationScreen,
            Transf: TransNavigation,

          
            ResetPassword: ResetPassword
        },
        {initialRouteName: "Auth"}
    );

};

export default Navigation;

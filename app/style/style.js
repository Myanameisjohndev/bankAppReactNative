import {StyleSheet, Dimensions} from 'react-native'
import {
    boxes,
    buttonsShadow,
    movBoxes,
    gradientRoundDiagonalLeftTop,
    gradientRoundDiagonalRighBot,
    boxesLight,
    valuesNegative,
    gradientBackgroundBase,
    defaultTextColor, buttonBoxes, degrade_primario, cor_fundo, text_dark,
} from './pallet';

let hdisp = Dimensions.get('window').height;
let wdisp = Dimensions.get('window').width;

let ppStyle = StyleSheet.create({
    goButton: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        textAlign: 'center',
        alignContent: 'center'
    },
    generalViews: {
        height: "100%",
        width: "100%",
        color:text_dark,
        backgroundColor: cor_fundo
    },
    textColor: {
        color: defaultTextColor
    },
    //login page
    loginLogo: {
        width: 400,
        height: 100,
        alignSelf: "center",
        marginVertical: "30%",
        resizeMode: 'contain',
    },
    centerAll: {
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    loginCard: {
        alignSelf: "center",
        width: "90%",
        height: "30.9%",
        marginTop: "-5%",
        borderRadius: 20,
        backgroundColor: boxes,
        elevation: 10,
        overflow: 'hidden'
    },
    comprovantCard: {
        alignSelf: "center",
        width: "99%",
        height: null,
        borderRadius: 20,
        backgroundColor: boxes,
        elevation: 10,
        overflow: 'hidden'
    },
    inputLoginID: {
        alignSelf: "center",
        color: '#000',
        height: 55,
        width: "85%",
        marginTop: 30,
        fontSize: 18,
        borderRadius: 30,
        paddingHorizontal: "5%",
        backgroundColor: "white",
        textAlign: "center",
        elevation: 5,
        opacity: 0.8,
        overflow: 'hidden',
        borderColor: 'black',
        borderBottomWidth: 1
    },
    inputLoginPS: {
        alignSelf: "center",
        height: 55,
        color: '#000',
        width: "85%",
        marginTop: "7%",
        marginBottom: "3%",
        fontSize: 18,
        borderRadius: 30,
        paddingHorizontal: "5%",
        backgroundColor: "white",
        textAlign: "center",
        elevation: 5,
        opacity: 0.8,
        overflow: 'hidden',
        borderColor: 'black',
        borderBottomWidth: 1
    },
    forgotPass: {
        alignSelf: "flex-end",
        color: "white",
        opacity: 0.7,
        fontSize: 16,
        marginRight: "10%"
    },
    loginGo: {
        alignSelf: "center",
        marginTop: "-6%",
        elevation: 20,
    },
    newAccText: {
        color: "white",
        alignSelf: "center",
        fontSize: 20,
        marginTop: "40%",
        opacity: 0.5,
    },
    loginRegister: {
        marginTop: "3%",
        marginHorizontal: "5%",
        borderRadius: 30,
        backgroundColor: boxes,
        elevation: 5,
        overflow: 'hidden',
        marginBottom: "60%",
    },
    loginRegBack: {
        alignItems: "center",
        paddingVertical: "4%",
        borderRadius: 30,
        
    },
    loginNoAcc: {
        color: "white",
        fontSize: 20,
        opacity: 1,
    },
    clearFix: {
        marginBottom: 30
    },
    small: {
        fontSize: 14,
        color: defaultTextColor
    },

    //authentication login page
    authTitle: {
        alignSelf: "center",
        textAlign: "center",
        color: "white",
        fontSize: 25,
        marginHorizontal: "5%",
        marginTop: "20%",
        opacity: 0.9
    },
    authFingerPrint: {
        alignSelf: "center",
        marginTop: "20%",
        opacity: 0.9,
        marginBottom: "15%"
    },
    authGradPassTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        backgroundColor: gradientRoundDiagonalRighBot,
        marginBottom: "2%",
        elevation: 5,
        overflow: 'hidden'
    },
    authGradAccTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        backgroundColor: gradientRoundDiagonalRighBot,
        elevation: 5,
        overflow: 'hidden',
        marginBottom: "10%"
    },
    authGradPass: {
        alignItems: "center"
    },
    authGradAcc: {
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: "4%",
        overflow: 'hidden'
    },
    authUsePassTXT: {
        color: "white",
        fontSize: 18,
        opacity: 0.9,
    },
    authUseOtherAccTXT: {
        color: "white",
        fontSize: 23,
        opacity: 0.7

    },


    //Home
    homeLogo: {
        alignSelf: "center",
        width: 130,
        height: 100,
        marginTop: "15%",
        overflow: 'hidden',
        resizeMode: 'contain',
    },
    homeTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 20,
        opacity: 0.9,
        marginTop: "5%"
    },
    homeAvailable: {
        color: "white",
        alignSelf: "center",
        fontSize: 30,
        opacity: 0.9
    },
    homeDispAvlb: {
        alignSelf: "center",
        paddingHorizontal: "3%",
        paddingVertical: "3%",
        marginTop: "3%",
        marginBottom: 12,
        opacity: 0.7
    },
    homeIconAvlbTXT: {
        color: "white",
        alignSelf: "center",
        marginTop: "-6%",
        marginBottom: "8%",
        opacity: 0.9
    },
    homeList: {
        backgroundColor: boxes,
        alignSelf: "center",
        width: "95%",
        height: "62%",
        borderRadius: 20,
        elevation: 5,
        overflow: 'hidden',
        marginBottom: "1%"
    },
    homeListTitle: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        marginTop: "2%",
        marginBottom: "2%",
        opacity: 0.9
    },
    homeListMov: {
        backgroundColor: movBoxes,
        height: 100,
        width: "100%",
        marginVertical: "1%",
        borderRadius: 15,
        alignSelf: "center",
        elevation: 5,
        paddingHorizontal: "2%",
        paddingVertical: "1%",
        overflow: 'hidden'
    },
    homeListItem: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 16,
        opacity: 0.9
    },
    homeListItemDT: {
        alignSelf: "flex-end",
        color: "white",
        fontSize: 15,
        opacity: 0.9
    },
    homeFill: {
        height: 15,
        marginBottom: 25
    },


    //Bills
    billsTitle: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        marginTop: "30%",
        opacity: 0.8
    },
    iconBarCode: {
        alignSelf: "center",
        marginTop: "10%",
        opacity: 0.7,
        marginBottom: "15%",
        maxWidth: '40%'
    },
    billsPayTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        marginTop: "20%",
        overflow: 'hidden'
    },
    billsCashinTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        marginTop: "20%",
        overflow: 'hidden'
    },
    billsBackPay: {
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: "4%",
        marginBottom: "20%",
        elevation: 5,
        overflow: 'hidden'
    },
    billsBackCashin: {
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: "4%",
        marginBottom: "20%",
        elevation: 5,
        overflow: 'hidden'
    },
    billsPayTXT: {
        color: "white",
        fontSize: 23,
        opacity: 0.7,
    },
    billsCashinTXT: {
        color: "white",
        fontSize: 23,
        opacity: 0.7

    },
    billsIcons: {
        alignSelf: "center",
        marginTop: "30%",
        opacity: 0.5
    },
    billsIconsSec: {
        alignSelf: "center",
        opacity: 0.9,
        marginTop: "-13%",
        marginLeft: "10%",
        color: "#008b00",
        backgroundColor: buttonsShadow,
        borderRadius: 30
    },
    billsFill: {
        width: "90%",
        marginBottom: "20%"
    },


    //history
    historyListTitle: {
        alignSelf: "center",
        color: "white",
        fontSize: 25,
        marginTop: "15%",
        marginBottom: "6%",
        opacity: 0.9,
    },
    historyList: {
        marginBottom: "2%",
        marginRight: "1%",
        flex: 1
    },
    historyListMov: {
        backgroundColor: movBoxes,
        height: 100,
        width: "98%",
        marginVertical: "1%",
        borderRadius: 15,
        alignSelf: "center",
        elevation: 5,
        paddingHorizontal: "2%",
        paddingVertical: "1%",
        overflow: 'hidden'
    },
    historyListItem: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 16,
        opacity: 0.9
    },
    historyListItemDT: {
        alignSelf: "flex-end",
        color: "white",
        fontSize: 15,
        opacity: 0.9
    },

    //TED
    inputSearch: {
        color: '#000',
        alignSelf: "center",
        height: 50,
        width: "95%",
        marginTop: "5%",
        marginBottom: '2%',
        fontSize: 18,
        borderRadius: 30,
        paddingHorizontal: "5%",
        backgroundColor: "white",
        textAlign: "center",
        elevation: 5,
        opacity: 1,
        overflow: 'hidden',
        borderColor: 'black',
        borderBottomWidth: 1
    },
    sendTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 28,
        marginTop: "2%",
        marginBottom: '2%',
        opacity: 0.8
    },
    sendBankName: {
        color: "white",
        fontSize: 20,
        marginTop: "2%",
        opacity: 0.9,
        alignSelf: 'center'
    },
    sendBankList: {
        backgroundColor: movBoxes,
        height: 45,
        width: "98%",
        marginVertical: "1%",
        borderRadius: 15,
        alignSelf: "center",
        elevation: 5,
        overflow: 'hidden'
    },
    sendBankListSelected: {
        backgroundColor: boxesLight,
        height: 45,
        width: "98%",
        marginVertical: "1%",
        borderRadius: 15,
        alignSelf: "center",
        elevation: 5,
        overflow: 'hidden'
    },
    sendSubTitle: {
        color: "white",
        fontSize: 20,
        marginTop: "10%",
        marginLeft: '5%',
        opacity: 0.9
    },
    sendValueSubtitle: {
        color: "white",
        fontSize: 30,
        alignSelf: "center",
        opacity: 0.9,
        marginTop: "10%"
    },
    sendAmount: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: 60,
        width: "70%",
        textAlign: "center",
        fontSize: 30,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        opacity: 0.8,
        color: "white"
    },
    sendAvailable: {
        color: "white",
        alignSelf: "center",
        fontSize: 20,
        opacity: 0.5,
        marginTop: "2%"
    },
    sendWarn: {
        color: "white",
        alignSelf: "center",
        fontSize: 15,
        opacity: 0.8,
        marginHorizontal: "10%",
        textAlign: "center",
        marginTop: "2%",
        backgroundColor: boxes,
        borderRadius: 10,
        elevation: 5,
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        overflow: 'hidden'
    },
    sendValueWarn: {
        color: "white",
        alignSelf: "center",
        fontSize: 18,
        opacity: 0.8,
        marginHorizontal: "10%",
        textAlign: "center",
        marginTop: "5%",
        backgroundColor: boxes,
        borderRadius: 10,
        elevation: 5,
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        overflow: 'hidden'
    },
    sendIDSubTitle: {
        color: "white",
        alignSelf: "center",
        textAlign: 'center',
        fontSize: 18,
        marginTop: "10%",
        opacity: 0.9
    },
    sendIDInput: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "2%",
        opacity: 0.8,
        color: "#fff",
        textShadowColor: 'white'
    },
    sendBankSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 18,
        marginTop: "10%",
        opacity: 0.9
    },
    sendAccSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 18,
        marginTop: "10%",
        opacity: 0.9
    },
    sendAccName: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "1%",
        opacity: 0.8,
        color: "white"
    },
    sendAccAgc: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "40%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "1%",
        opacity: 0.8,
        color: "white"
    },
    sendAccNum: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "40%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "1%",
        opacity: 0.8,
        color: "white"
    },
    sendAccDig: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "30%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "1%",
        opacity: 0.8,
        color: "white"
    },
    sendGo: {
        alignSelf: "center",
        marginTop: "10%",
    },
    sendBankGo: {
        alignSelf: "center",
        paddingBottom: '3%',
        paddingTop: '3%'
    },
    sendFinish: {
        alignSelf: "center",
        paddingBottom: '3%',
        paddingTop: '25%'
    },
    sendReturn: {
        alignSelf: "center",
        marginTop: "5%",
        marginBottom: "40%"
    },

    //Profile User
    profileTitle: {
        alignSelf: "center",
        fontSize: 40,
        color: "white",
        marginTop: "20%",
        opacity: 0.8
    },
    profileIconUser: {
        alignSelf: "center",
        backgroundColor: boxes,
        borderRadius: 50,
        overflow: 'hidden',
        marginTop: "15%",
        elevation: 10,
        opacity: 0.8
    },
    profileUserName: {
        alignSelf: "center",
        fontSize: 18,
        color: "white",
        marginTop: "5%",
        opacity: 0.8
    },
    profileUserAgc: {
        alignSelf: "center",
        fontSize: 20,
        color: "white",
        marginTop: "1%",
        opacity: 0.5
    },
    profileUserAcc: {
        alignSelf: "center",
        fontSize: 20,
        color: "white",
        marginTop: "1%",
        opacity: 0.5,
        overflow: "hidden"
    },
    profileBack: {
        backgroundColor: boxesLight,
        marginHorizontal: "40%",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 30,
        marginTop: "10%",
        elevation: 5,
        marginBottom: "35%"
    },
    profileIconHomeTXT: {
        color: "white"
    },
    profileAuthDevice: {
        alignItems: "center",
        alignContent: "center",
        backgroundColor: boxes,
        marginHorizontal: "15%",
        overflow: "hidden",
        paddingVertical: "2%",
        elevation: 5,
        borderRadius: 30
    },
    profileRestPass: {
        alignItems: "center",
        alignContent: "center",
        backgroundColor: boxes,
        marginHorizontal: "15%",
        marginTop: '7%',
        marginBottom: "5%",
        overflow: "hidden",
        paddingVertical: "2%",
        elevation: 5,
        borderRadius: 30
    },
    profileLogout: {
        alignItems: "center",
        elevation: 5,
        marginTop: "20%"
    },
    profileAuthDeviceTXT: {
        fontSize: 25,
        color: "white",
    },
    profileRestPassTXT: {
        fontSize: 25,
        color: "white",
    },
    profileLogoutTXT: {
        fontSize: 25,
        color: valuesNegative,
    },

    //BillsCashinAmount
    cashinTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "15%",
        opacity: 0.8
    },
    cashinSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 25,
        marginTop: "50%",
        opacity: 0.9
    },
    cashinAmount: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    cashinWarn: {
        color: "white",
        alignSelf: "center",
        fontSize: 15,
        opacity: 0.8,
        marginHorizontal: "20%",
        textAlign: "center",
        marginTop: "10%",
        backgroundColor: boxes,
        borderRadius: 10,
        elevation: 5,
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        overflow: 'hidden'
    },
    cashinGo: {
        alignSelf: "center",
        marginTop: "50%",
    },
    cashinReturn: {
        alignSelf: "center",
        marginTop: "10%",
        marginBottom: "22%"
    },

    //BillCashGen
    cashGenTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "25%",
        opacity: 0.8
    },
    cashGenSubTitle: {
        color: text_dark,
        alignSelf: "center",
        fontSize: 20,
        marginTop: "5%",
        opacity: 0.9,
        marginHorizontal: "0%",
        textAlign: "justify"
    },
    cashGenNum: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "1%",
        width: "80%",
        textAlign: "center",
        fontSize: 15,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "30%",
        marginBottom: "30%",
        opacity: 0.8,
        color: "white"
    },
    cashGenCopyTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        overflow: 'hidden',
    },
    cashGenShareTC: {
        marginHorizontal: "5%",
        borderRadius: 30,
        marginTop: "5%",
        overflow: 'hidden',
    },
    cashGenGradCopy: {
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: "4%",
        elevation: 5,
        overflow: 'hidden'
    },
    cashGenGradShare: {
        alignItems: "center",
        borderRadius: 30,
        paddingVertical: "4%",
        elevation: 5,
        overflow: 'hidden'
    },
    cashGenCopyTXT: {
        color: "white",
        fontSize: 20,
        opacity: 0.7,
    },
    cashGenShareTXT: {
        color: "white",
        fontSize: 20,
        opacity: 0.7

    },
    cashGenReturn: {
        alignSelf: "center",
        marginTop: "5%",
        marginBottom: "20%"
    },

    //IDNewAcc
    newIDTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "25%",
        opacity: 0.8
    },
    newIDSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 25,
        marginTop: "55%",
        opacity: 0.9
    },
    newIDNum: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "5%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newIDGo: {
        alignSelf: "center",
        marginTop: "30%",
    },
    newIDReturn: {
        alignSelf: "center",
        marginTop: "15%",
        marginBottom: "22%"
    },

    //InfoNewAcc
    newInfoTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "25%",
        opacity: 0.8
    },
    newInfoSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 20,
        marginTop: "30%",
        opacity: 0.9
    },
    newInfoName: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: 50,
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "10%",
        opacity: 0.8,
        color: "white"
    },
    newInfoMail: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: 50,
        width: "85%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newInfoCel: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: 50,
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newInfoGo: {
        alignSelf: "center",
        marginTop: "45%",
    },
    newInfoReturn: {
        alignSelf: "center",
        marginTop: "15%",
        marginBottom: "25%"
    },

    //PerfNewAcc
    newPerfTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "20%",
        opacity: 0.8
    },
    newPerfSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 25,
        marginTop: "20%",
        marginHorizontal: "10%",
        opacity: 0.9,
        textAlign: "center"
    },
    newPerfNameM: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "3%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "10%",
        opacity: 0.8,
        color: "white"
    },
    newPerfBD: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "4%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newPerfOE: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "4%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newPerfUF: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "4%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newPerfDE: {
        alignSelf: "center",
        backgroundColor: "transparent",
        height: "4%",
        width: "70%",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: "5%",
        borderBottomColor: boxesLight,
        borderBottomWidth: 1,
        marginTop: "5%",
        opacity: 0.8,
        color: "white"
    },
    newPerfGo: {
        alignSelf: "center",
        marginTop: "15%",
    },
    newPerfReturn: {
        alignSelf: "center",
        marginTop: "15%",
        marginBottom: "40%"
    },


    //DocNewAcc
    newDocTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginTop: "25%",
        opacity: 0.8
    },
    newDocSubTitle: {
        color: "white",
        alignSelf: "center",
        fontSize: 25,
        marginTop: "30%",
        opacity: 0.9,
        textAlign: "center",
        marginHorizontal: "10%"
    },
    newDocGo: {
        alignSelf: "center",
        marginTop: "45%",
    },
    newDocReturn: {
        alignSelf: "center",
        marginTop: "15%",
        marginBottom: "10%"
    },

});

export default ppStyle;

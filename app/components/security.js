import React, {Component, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, Text, StatusBar, ActivityIndicator, View, Image, TextInput} from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from "react-native-linear-gradient";
import {
    darkButton,
    defaultTextColor, degrade_primario, degrade_secundario,
    gradGreenDark,
    gradGreenLight, gradientBackgroundBase, lightButton, telefone, whiteLabel,
} from '../style/pallet';
import TouchID from 'react-native-touch-id';
import Loading from "./common/Loading";
import DeviceInfo from 'react-native-device-info';
import {transferNow} from '../store/transfer';
import {reAuthUser} from '../store/user';
import {billetPay} from '../store/billet';
import {Header, Right, Left, Body, Container, Content, H1, Input, H3} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import theme from "../style/theme";
import PinView from 'react-native-pin-view';
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Linking} from "react-native";


class Authentication extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    pinView = React.createRef();

    state = {
        senha: null,
        loading: true,
        alert: {},
        showPass: false,
    };

    constructor(props) {
        super(props);
        this.errorMessage = null;
    }


    async goToCaller() {
        const {navigation, transfer, transferNow, billet, billetPay} = this.props;
        let operation = navigation.getParam('after');
        switch (operation) {
            case 'pay':
                this.setState({loading: true});
                transfer.banco = (transfer.banco && typeof transfer.banco === 'object' ? transfer.banco.id : transfer.banco) || transfer.banco.id;
                transfer.instalationVersion = DeviceInfo.getUniqueId();
                let ted = await transferNow(transfer);
                this.processedTed(ted);
                break;
            case 'billet':
                this.setState({loading: true});
                let newBillet = billet;
                newBillet.instalationVersion = DeviceInfo.getUniqueId();
                newBillet.value = newBillet.valor_atualizado;
                newBillet.valor = newBillet.valor_atualizado;
                let payment = await billetPay(newBillet);
                this.processPayment(payment);
                break;
        }
    }

    componentDidMount() {
        TouchID.isSupported().then(r => this.setState({isPassword: false}, function () {
            this.requestAuth();
            this.setState({loading: false})
        }.bind(this)))
            .catch(err => this.setState({isPassword: true}, function () {
                this.setState({loading: false})
            }.bind(this)));
    }

    render() {
        const {navigation} = this.props;
        if (this.state.loading) return <Loading />
        if (this.state.isPassword) return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.replace('Dashboard')}>
                            <AntDesign name={'close'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                            Confirmar senha
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content scrollEnabled={true} style={[{marginHorizontal: 30, marginTop: 8}]}>
                    <H1 allowFontScaling={false} style={[theme.h3]}>
                        Digite a sua senha do app.
                    </H1>
                    <View style={[{flexDirection: 'row', marginTop: 12}]}>
                        {/*<PinView*/}
                        {/*    onValueChange={(valor) => {*/}
                        {/*        this.setState({senha: valor});*/}
                        {/*    }}*/}
                        {/*    ref={this.pinView}*/}
                        {/*    inputViewStyle={[theme.circle]}*/}
                        {/*    buttonViewStyle={{*/}
                        {/*        borderWidth: 1,*/}
                        {/*        borderColor: darkButton,*/}
                        {/*    }}*/}
                        {/*    buttonTextStyle={{color: darkButton}}*/}
                        {/*    inputViewFilledStyle={{backgroundColor: darkButton, opacity: 1}}*/}
                        {/*    pinLength={4}*/}
                        {/*    onButtonPress={(key, me) => {*/}
                        {/*        if (key === "custom_left") {*/}
                        {/*            this.pinView.current.clear()*/}
                        {/*        }*/}
                        {/*        */}
                        {/*    }}*/}
                        {/*    customLeftButton={<Icon name={'backspace'} size={40} color={darkButton} />}*/}
                        {/*/>*/}

                        <TextInput
                            style={[theme.input, {textAlign: 'center'}]}
                            placeholder="Nova senha"
                            maxLength={6}
                            keyboardType="default"
                            secureTextEntry={!this.state.showPass}
                            onChangeText={valor =>  this.setState({senha: valor})}
                        />
                        <TouchableOpacity
                            transparent
                            onPress={e => {
                                this.setState({showPass: !this.state.showPass})
                            }}
                            underlayColor="none" style={{position: 'absolute', right: 10, top: 30, bottom: 0}}
                        >
                            <Icon
                                name={this.state.showPass ? 'visibility-off' : 'visibility'}
                                color="white"
                                size={30}
                                style={[{color: '#000', bottom: 0}]}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.state.senha && this.state.senha.length === 6 && this.ValidateToCall()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading || !this.state.senha || this.state.senha.length < 6 ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                            {
                                marginTop: 5,
                            }
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 style={[theme.centerAll, theme.h3_light]}>
                            Confirmar
                        </H3>
                    </TouchableOpacity>
                </Content>
                <SCLAlert
                    show={this.state.showAlert}
                    onRequestClose={this.alertClose.bind(this)}
                    theme={this.state.alert.theme || 'info'}
                    title={this.state.alert.title || ''}
                    subtitle={this.state.alert.subtitle || ''}
                    headerIconComponent={this.state.alert.icon ||
                    <AntDesign name={this.state.alert.icone || 'info'} size={35} color={'#fff'} />}
                >
                    <SCLAlertButton theme={this.state.alert.theme || "info"} onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                    <SCLAlertButton theme={"info"} onPress={() => Linking.openURL(this.suporteMessage())}>Pedir
                        ajuda</SCLAlertButton>
                </SCLAlert>
                <View style={{height: 10}} />
            </Container>
        )


        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.replace('Dashboard')}>
                            <AntDesign name={'close'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                            Confirmar senha
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content scrollEnabled={true} style={[{marginHorizontal: 30, marginTop: 20}]}>
                    <Text style={[theme.centerAll, theme.h3, theme.defaultColor]}>
                        Ultilize a sua biometria para finalizar a transação
                    </Text>
                    <View style={{marginTop: hp('11%')}} />
                    <TouchableOpacity onPress={() => this.requestAuth()}>
                        <Icon
                            name="fingerprint"
                            color="white"
                            size={200}
                            style={[theme.icones, theme.centerAll]}
                        />
                    </TouchableOpacity>
                    <View style={{marginTop: hp('7%')}} />
                    <Text style={[theme.centerAll, {fontSize: 20}, theme.fontDefault]}>
                        Ou
                    </Text>
                    <View style={{marginTop: hp('7%')}} />
                    <TouchableOpacity onPress={() => this.setState({isPassword: !this.state.isPassword})}>
                        <Text style={[theme.centerAll, theme.h3_no_margin, {textDecorationLine: 'underline'}]}>
                            autorizar com senha
                        </Text>
                    </TouchableOpacity>
                </Content>
                <SCLAlert
                    show={this.state.showAlert}
                    onRequestClose={this.alertClose.bind(this)}
                    theme={this.state.alert.theme || 'info'}
                    title={this.state.alert.title || ''}
                    subtitle={this.state.alert.subtitle || ''}
                    headerIconComponent={this.state.alert.icon ||
                    <AntDesign name={this.state.alert.icone || 'info'} size={35} color={'#fff'} />}
                >
                    <SCLAlertButton theme={this.state.alert.theme || "info"} onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                    <SCLAlertButton theme={"info"} onPress={() => Linking.openURL(this.suporteMessage())}>Pedir
                        ajuda</SCLAlertButton>
                </SCLAlert>
            </Container>
        )
    }

    clearToUsePassword() {
        this.setState({isPassword: true});
    }

    requestAuth() {
        const {navigation} = this.props;
        const optionalConfigObject = {
            title: 'Entrar com digital',
            sensorDescription: 'Use sua digital para autorizar a transação.',
            sensorErrorDescription: 'Falhou',
            cancelText: 'Cancelar',
            fallbackLabel: 'Mostrar senha',
            unifiedErrors: false,
            passcodeFallback: false,
        };

        TouchID.authenticate('', optionalConfigObject)
            .then(async success => {
                await this.goToCaller();
            })
            .catch(error => {

            });
    }

    suporteMessage() {
        const {account, navigation, billet, transfer} = this.props;
        let operation = navigation.getParam('after');
        switch (operation) {
            case 'pay':
                return `whatsapp://send?text=Olá, suporte ${whiteLabel} Bank. Recebi o erro *"${this.errorMessage}"* ao efetuar uma transferência no valor de ${transfer.valor}. Meu documento é ${account.data.cpf || account.data.cnpj}.&phone=${telefone}`;
            case 'billet':
                return `whatsapp://send?text=Olá, suporte ${whiteLabel} Bank. Recebi o erro *"${this.errorMessage}"* ao pagar meu boleto no valor de R$ ${parseFloat(billet.valor_atualizado).toFixed(2).toString().replace('.', ',')}. Meu documento é ${account.data.cpf || account.data.cnpj}.&phone==${telefone}`;
        }
    }

    processedTed(ted) {
        const {navigation} = this.props;
        if (ted.status !== 'success') {
            this.setState({loading: false}, function () {
                this.errorMessage = ted.message;
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: ted.message,
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });
                // this.setState({senha: null}, function () {
                //     try{
                //         this.pinView.current.clearAll();
                //     } catch(e){
                //
                //     }
                // }.bind(this))
                this.setState({senha: ''})
                return false;
            }.bind(this));
            return false;
        } else {
            navigation.replace('Receipt', {
                transacao: ted.data.transaction
            });
        }
        this.setState({loading: false});
    }

    alertClose() {
        let operation = this.props.navigation.getParam('after');
        if (operation === 'billet' && this.state.alert.title === 'Falha ao pagar') {
            this.props.navigation.navigate('Payment');
        }
        this.setState({showAlert: false})
    }

    async ValidateToCall() {
        const {reAuthUser} = this.props;
        this.setState({loading: true});
        let auth = await reAuthUser(this.state.senha);
        if (auth.autorizado === false) {
            this.setState({loading: false}, function () {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'Senha inválida, tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });
                this.setState({senha: ''})
                return false;
            }.bind(this));
            return false;
        } else {
            await this.goToCaller();
        }

    }

    processPayment(payment) {
        if (payment.status === 'error') {
            this.errorMessage = payment.message;
            this.setState(data => {
                data.alert = {
                    title: 'Falha ao pagar',
                    subtitle: payment.message,
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
        } else if (payment.status === 'success') {
            this.props.navigation.replace('Receipt', {transacao: payment.data})
            this.setState({loading: false});
        }
    }
}


const mapStateToProps = state => {
    return {token: state.token, transfer: state.transfer, billet: state.billet, account: state.account};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {transferNow, reAuthUser, billetPay},
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication);


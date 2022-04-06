import React, {Component} from 'react';
import {TouchableOpacity, Text, StatusBar, ScrollView} from 'react-native';
import {bindActionCreators} from "redux";
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from "react-native-linear-gradient";
import {
    gradGreenDark,
    gradGreenLight
} from '../style/pallet';
import Style from '../style/style';
import TouchID from 'react-native-touch-id';
import {AlertHelper} from "../components/AlertHelper";
import {Authenticate} from "../store/token";
import {deviceValidate} from "../store/device";
import DeviceInfo from 'react-native-device-info';
import Loading from "../components/common/Loading";

class Authentication extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    state = {loading: false};

    render() {
        const {navigation} = this.props;
        if (this.state.loading) return <Loading />
        return (
            <ScrollView scrollToOverflowEnabled={false} style={Style.generalViews}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                />
                <Text style={Style.authTitle}>Toque na digital para entrar</Text>
                <TouchableOpacity onPress={() => this.requestAuth()}>
                    <Icon
                        name="fingerprint"
                        color="white"
                        size={200}
                        style={Style.authFingerPrint}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.clearToUsePassword()}
                    style={Style.authGradPassTC}
                >
                    <LinearGradient
                        colors={[gradGreenDark, gradGreenLight]}
                        start={{x: 1.1, y: 5}}
                        end={{x: -1.1, y: -1}}
                        style={Style.authGradPass}
                    >
                        <Text style={Style.authUsePassTXT}>Usar senha</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.clearToNewAccount()}
                    style={Style.authGradAccTC}
                >
                    <LinearGradient
                        colors={[gradGreenDark, gradGreenLight]}
                        start={{x: 1.1, y: 5}}
                        end={{x: -1.1, y: -1}}
                        style={Style.authGradPass}
                    >
                        <Text style={Style.authUsePassTXT}>Entrar com outra conta</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    async clearToNewAccount() {
        const {navigation} = this.props;
        AsyncStorage.setItem('usuario', '')
        AsyncStorage.setItem('senha', '')
        navigation.navigate('Login');
    }

    clearToUsePassword() {
        const {navigation} = this.props;
        AsyncStorage.setItem('senha', '')
        navigation.navigate('Login');
    }

    requestAuth() {
        const {navigation} = this.props;
        const optionalConfigObject = {
            title: 'Entrar com digital',
            sensorDescription: 'Use sua digital para entrar no banco',
            sensorErrorDescription: 'Falhou',
            cancelText: 'Cancelar',
            fallbackLabel: 'Mostrar senha',
            unifiedErrors: false,
            passcodeFallback: false,
        };

        TouchID.authenticate('', optionalConfigObject)
            .then(success => {
                AlertHelper.show('success', 'Autenticação realizada', 'Você será conectado em alguns instantes.');
                setTimeout(async function () {
                    await this.authOk();
                }.bind(this), 1000)
            })
            .catch(error => {
                AlertHelper.show('error', 'Falha de autenticação', 'Não foi possível validar sua digital, tente novamente.');
            });
    }

    async authOk() {
        const {Authenticate} = this.props;

        this.setState({loading: true});
        let usuario = await AsyncStorage.getItem('usuario')
        let senha = await AsyncStorage.getItem('senha')
        await Authenticate(usuario, senha);
        if (this.props.token && this.props.token.access_token) {
            await AsyncStorage.setItem('token', this.props.token.access_token);
            await this.props.deviceValidate(DeviceInfo.getUniqueId(), DeviceInfo.getDeviceName());
            if (this.props.device.status === 'success') {
                this.props.navigation.navigate("App");
            } else {
                AlertHelper.show('warn', 'Primeiro acesso?', 'Entre em contato com nosso suporte para liberação do dispositivo!');
            }
        } else if (this.props.token && this.props.token.status === 'error') {
            AlertHelper.show('error', 'Oops', this.props.token.message);
        }

        this.setState({loading: false});
    }
}


const mapStateToProps = state => {
    return {token: state.token, account: state.account, device: state.device};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {Authenticate, deviceValidate},
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication);

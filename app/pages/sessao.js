import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Container, Content, H1, View, Text} from "native-base";
import {StatusBar, TouchableOpacity} from "react-native";
import theme from "../style/theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from "../components/common/Loading";
import AsyncStorage from '@react-native-community/async-storage';
import TouchID from "react-native-touch-id";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import AntDesign from "react-native-vector-icons/AntDesign";
import DeviceInfo from "react-native-device-info";
import {Authenticate} from "../store/token";
import {deviceValidate} from '../store/device';

class Sessao extends Component {
    state = {loading: false, hiddenDocument: null, alert: {}};

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            let usuario = await AsyncStorage.getItem('usuario');
            this.setState({hiddenDocument: usuario.toString().substr(0, 3) + '.***.***-' + usuario.toString().substr(12, 14)});
            TouchID.isSupported().then(r => this.requestAuth())
                .catch(err => console.log(err));
        } catch (e) {

        }
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
            .then(async success => {
                await this.authOk();
            })
            .catch(error => {

            });
    }

    alertClose() {
        this.setState({showAlert: false})
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
            console.log(this.props.device)
            if (this.props.device.status === 'success') {
                this.props.navigation.navigate("App");
            } else {
                this.props.navigation.navigate("Validacao");
            }
        } else if (this.props.token && this.props.token.status === 'error') {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: this.props.token.message,
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
        }

        this.setState({loading: false});
    }

    render() {
        if (this.state.loading) return <Loading />

        return (
            <Container>
                <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor="transparent"
                />
                <Content style={{marginHorizontal: 5}} padder={true}>
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: '60%', marginTop: 60, fontSize: 35}]}>
                        Login
                    </H1>
                    <H1 style={[theme.h3, {maxWidth: '100%', marginTop: 0}]}>
                        Olá, {this.state.hiddenDocument}
                    </H1>
                    <H1 style={[theme.h3, {maxWidth: '70%', marginTop: 0}]}>
                        Não é você?{" "}
                    </H1>
                    <TouchableOpacity onPress={() => this.clearToOtherAccount()}>
                        <H1 style={[{textDecorationLine: 'underline'}, theme.h3]}>Fazer login com outra conta</H1>
                    </TouchableOpacity>
                    <View style={{marginTop: 50}} />
                    <Text style={[theme.centerAll, theme.fontDefault, theme.defaultColor, {fontSize: 18}]}>
                        Comece usando sua biometria
                    </Text>
                    <View style={{marginTop: 50}} />
                    <TouchableOpacity onPress={() => this.requestAuth()}>
                        <Icon
                            name="fingerprint"
                            color="white"
                            size={200}
                            style={[theme.icones, theme.centerAll]}
                        />
                    </TouchableOpacity>
                    <View style={{marginTop: 50}} />
                    <Text style={[theme.centerAll]}>
                        Ou
                    </Text>
                    <View style={{marginTop: 60}} />
                    <TouchableOpacity onPress={() => this.clearToOtherAccount(true)}>
                        <Text style={[theme.centerAll, {textDecorationLine: 'underline'}]}>
                            Entrar com senha
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
                    <AntDesign name={this.state.alert.icone || "info"} size={35} color={'#fff'} />}
                >
                    <SCLAlertButton theme={this.state.alert.theme || "info"} onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                </SCLAlert>
            </Container>
        );
    }

    clearToOtherAccount(withPassword) {
        if (!withPassword) AsyncStorage.setItem('usuario', '');
        AsyncStorage.setItem('senha', '');
        this.props.navigation.navigate('NovaSessao');
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
)(Sessao);

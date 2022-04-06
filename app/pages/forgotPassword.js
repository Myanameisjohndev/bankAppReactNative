import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActivityIndicator, Image, Linking, StatusBar, TouchableOpacity} from 'react-native';
import {Container, Content, Text, View, Header, Right, Left, Body, H1, H3, Card} from 'native-base';

import Style from '../style/style';
import {
    buttonBoxes,
    buttonTwoBoxes, darkButton,
    defaultTextColor,
    degrade_primario,
    gradientBackgroundBase,
    lightButton, telefone, whiteLabel,
} from '../style/pallet';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/common/Loading';
import {TextInputMask} from 'react-native-masked-text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {esqueceuSenha} from '../store/user';
import {AlertHelper} from '../components/AlertHelper';
import theme from '../style/theme';
import {Helpers} from '../components/helpers';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

class ForgotPassword extends Component {
    state = {loading: false, document: null, isPhysicalPerson: true, showAlert: false, alert: {}, generated: false};
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    alertClose() {
        this.setState({showAlert: false});
    }

    render() {
        if (this.state.generated === false) {
            return (
                <Container>
                    <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                        <Left>
                            <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                                <AntDesign name={'left'} size={35} color={defaultTextColor} />
                            </TouchableOpacity>
                        </Left>
                        <Body>
                            <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                                Recuperar senha
                            </H1>
                        </Body>
                    </Header>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Content style={{marginHorizontal: 5}} padder>
                        <H1 allowFontScaling={false} style={[theme.h3, theme.justifyText]}>
                            Olá, digite seu documento .
                        </H1>

                        <View style={[theme.h3, theme.paddingTop, {paddingTop: 20}]}>

                            <H3 allowFontScaling={false} style={theme.h3}>
                                CPF / CNPJ
                            </H3>

                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: this.state.isPhysicalPerson === true ? '999.999.999-99*' : '99.999.999/9999-99',

                                }}
                                keyboardType="number-pad"
                                style={[theme.input, {textAlign: 'center'}]}

                                value={this.state.document}
                                returnKeyLabel="Acessar"
                                returnKeyType="done"
                                onChangeText={text => {
                                    this.setState({
                                        document: text,
                                        isPhysicalPerson: text.length <= 14,
                                    });
                                }}
                            />

                        </View>

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
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                    </SCLAlert>

                    <View style={
                        [theme.fixBottom, theme.centerAll]
                    }>
                        <TouchableOpacity
                            onPress={() => this.requestNewPassword()}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 30,

                                },
                                {
                                    backgroundColor: darkButton,
                                },
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === 'ios' ? 'large' : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                                Enviar código sms
                            </H3>
                        </TouchableOpacity>
                    </View>

                </Container>
            );
        }

        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>

                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content style={[{marginHorizontal: 17, backgroundColor: degrade_primario}]}>
                    <H1 allowFontScaling={false} style={[theme.h3_no_margin, theme.justifyText, {
                        color: '#BBCC3E',
                        fontSize: 36,
                        paddingTop: 15
                    }]}>
                        Senha solicitada!
                    </H1>
                    <H1 allowFontScaling={false} style={[theme.h3, theme.justifyText, {color: '#FFF'}]}>
                        Sua senha foi enviada por sms para o seu número cadastrado :)
                    </H1>
                    <View>

                        <H1 allowFontScaling={false} style={[theme.h3, theme.justifyText, {color: '#FFF'}]}>
                            Se você tiver dúvidas, ou algum problema, pode entrar na nossa
                        </H1>

                        <TouchableOpacity
                            onPress={() => Linking.openURL('whatsapp://send?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20'+ {whiteLabel} +'.&phone='+ {telefone} +'')}
                        >

                            <H3 allowFontScaling={false} style={[theme.h3, {
                                color: '#FFF',
                                fontWeight: 'bold',
                                textDecorationLine: 'underline'
                            }]}>
                                página de ajuda
                            </H3>
                        </TouchableOpacity>

                    </View>

                    <Image
                        source={require('../../assets/icones/recoverPassword.png')}
                        style={[theme.centerAll, {
                            resizeMode: 'contain',
                            height: 180,
                            paddingTop: 15,
                            marginTop: 40,
                            marginLeft: 5,
                        }]} />

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <H1 allowFontScaling={false} style={[theme.h3, theme.justifyText, {
                            color: '#FFF',
                            backgroundColor: '#BBCC3E',
                            padding: 15,
                            textAlign: 'center',
                            marginTop: 0,
                        }]}>
                            Obrigado
                        </H1>
                    </TouchableOpacity>
                    <View style={{height: 10}} />
                </Content>
            </Container>
        );
    }

    async requestNewPassword() {
        const {esqueceuSenha} = this.props;

        if (!Helpers.validarCPF(this.state.document) && !Helpers.validCnpj(this.state.document)) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'CPF / CNPJ inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });

            this.setState({loading: false});

            return false;
        }
        this.setState({loading: true})

        let response = await esqueceuSenha(this.state.document.replace(/\D+/g, ''));
        //this.props.navigation.navigate('Login');

        this.setState({generated: true});
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({esqueceuSenha}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForgotPassword);

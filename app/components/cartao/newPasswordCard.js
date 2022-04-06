import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActivityIndicator, Image, Linking, StatusBar, TextInput, TouchableOpacity} from 'react-native';
import {Body, Container, Content, H1, H3, Header, Input, Left, Text, View} from 'native-base';
import Style from '../../style/style';
import {
    buttonBoxes,
    buttonTwoBoxes,
    darkButton,
    defaultTextColor,
    degrade_primario, degrade_secundario,
    lightButton, text_light, whiteLabel , telefone
} from '../../style/pallet';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {novaSenhaCartao,exibirSenha} from '../../store/cards';
import {AlertHelper} from '../AlertHelper';
import Loading from '../common/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../style/theme';
import {TextInputMask} from 'react-native-masked-text';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

class NewPasswordCard extends Component {
    state = {
        senha: null,
        senha1: null,
        senha0:'0000',
        loading: false,
        generated: true,
        showPass: false,
        showRePass: false,
        showPreviousPass:false,
        showAlert: false,
        alert: {},
        new_card:false
    };
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };


    constructor(props) {
        //console.log(props);
        super(props);
        this.new_card = this.props.navigation.getParam('new_card', {
            new_card: this.card,
          })
        this.senhaAtual = this.props.navigation.getParam('senhaAtual',{
            senhaAtual: this.card
        });

        console.log('newCard é');
        console.log(this.new_card);


        //this.setState({new_card: this.new_card });
    }

    componentDidMount(){
        this.getPasswordCard();
    }

    async getPasswordCard(){
        const {exibirSenha} = this.props;
        let senha= await exibirSenha(this.new_card);
        this.state.senha0=senha.message.password;
    }

    async save() {
        const {senha, senha1 , senha0} = this.state;
        const {novaSenha, navigation, novaSenhaCartao} = this.props;
        console.log(this.state)
        console.log(this.state.senha, 'senha testada')
        //this.setState({loading: true});
        if (!senha || senha.length < 4) {
            this.setState(data => {
                data.alert = {
                    title: 'Tamanho incorreto',
                    subtitle: 'Senha deve possuir 4 dígitos!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }
        /* if (!senha || senha0.length < 4) {
            this.setState(data => {
                data.alert = {
                    title: 'Tamanho incorreto',
                    subtitle: 'Senha atual deve possuir 4 dígitos!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        } */

        if (this.isCPF(senha)) {
            this.setState(data => {
                data.alert = {
                    title: 'Senha fraca',
                    subtitle: 'Não utilize os digitos do seu CPF como senha!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }


        if (this.isNascimento(senha)) {
            this.setState(data => {
                data.alert = {
                    title: 'Senha fraca',
                    subtitle: 'Não utilize data de nascimento como senha!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (senha === '1234' || senha === '4321' || senha === '0000' || senha === '1111') {
            this.setState(data => {
                data.alert = {
                    title: 'Senha fraca',
                    subtitle: 'Crie uma senha mais forte',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (this.isSequence(senha)) {
            this.setState(data => {
                data.alert = {
                    title: 'Senha fraca',
                    subtitle: 'Não utilize sequências númericas em sua senha!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (senha !== senha1) {
            this.setState(data => {
                data.alert = {
                    title: 'Senhas não coincidem!',
                    subtitle: 'Senhas devem ser iguais!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }
        await AsyncStorage.setItem('senha', senha);
        //console.log('iniciar atualizar card');

        console.log('usuario e '+ this.new_card.id_usuario );
        console.log('cartao e '+ this.new_card.id_cartao );
        console.log('password e '+ senha );
        console.log('old_password e '+ this.state.senha0 );
        let save = await novaSenhaCartao({
            id_usuario:this.new_card.id_usuario,
            id_cartao: this.new_card.id_cartao,
            password:senha,
            old_password:this.state.senha0
        });

        console.log(save, 'save')

        if (save.status === 'success') {
            this.setState(data => {
                data.alert = {
                    title: 'Sucesso !',
                    subtitle: 'Sua senha poderá ser usada na proxima transação!',
                    theme: 'success',
                    icone: 'closecircle',
                };
                data.showAlert = true;

                return data;
            });
            this.setState({loading: false});
            //this.props.navigation.replace('Cards');
        }if (save.status === 'error') {
            console.log('error e');
            console.log(save);
            this.setState(data => {
                data.alert = {
                    title: 'Erro !',
                    subtitle: 'Erro ao alterar senha, tente novamente. ',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
           // this.setState({generated: false});
        }
    }

    alertClose() {
        this.setState({showAlert: false});
    }

    render() {

        //console.log(this.new_card)



        if (this.state.generated === true) {
            return (
                <Container>
                    <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                        <Left style={{justifyContent: 'center'}}>
                            <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.replace('Cards')}>
                                <AntDesign name={'left'} size={35} color={defaultTextColor} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{marginRight: 20 }}>
                            <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                                Alterar senha
                            </H1>
                        </Body>
                    </Header>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Content style={{marginHorizontal: 5}} padder>

                        <H1 style={[theme.h3, theme.justifyText]}>
                            Olá, digite sua nova senha de 4 dígitos.
                        </H1>

                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <TextInput
                                style={[theme.input, {textAlign: 'center'}]}
                                placeholder="Senha atual"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={!this.state.showPreviousPass}
                                onChangeText={senha0 => this.setState({senha0})}
                                value={this.state.senha0  }
                            />
                            <TouchableOpacity
                                transparent
                                onPress={e => {
                                    this.setState({showPreviousPass: !this.state.showPreviousPass})
                                }}
                                underlayColor="none" style={{position: 'absolute', right: 10, top: 30, bottom: 0}}
                            >
                                <Icon
                                    name={this.state.showPreviousPass ? 'visibility-off' : 'visibility'}
                                    color="white"
                                    size={30}
                                    style={[{color: '#000', bottom: 0}]}
                                />
                            </TouchableOpacity>
                        </View>


                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <TextInput
                                style={[theme.input, {textAlign: 'center'}]}
                                placeholder="Nova senha"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={!this.state.showPass}
                                onChangeText={senha => this.setState({senha})}
                                value={this.state.senha || ''}
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
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                style={[theme.input, {textAlign: 'center'}]}
                                placeholder="Repita a senha"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={!this.state.showRePass}
                                onChangeText={senha1 => this.setState({senha1})}
                                value={this.state.senha1 || ''}
                            />
                            <TouchableOpacity
                                transparent
                                onPress={e => {
                                    this.setState({showRePass: !this.state.showRePass})
                                }}
                                underlayColor="none" style={{position: 'absolute', right: 10, top: 30, bottom: 0}}
                            >
                                <Icon
                                    name={this.state.showRePass ? 'visibility-off' : 'visibility'}
                                    color="white"
                                    size={30}
                                    style={[{color: '#000', bottom: 0}]}
                                />
                            </TouchableOpacity>
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
                                        onPress={() => this.props.navigation.replace('Cards', {onGoBack: () => this.refresh()})}>Ok</SCLAlertButton>
                    </SCLAlert>

                    <View style={
                        [theme.fixBottom, theme.centerAll]
                    }>
                        <TouchableOpacity
                            onPress={() => this.save()}
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
                            <H3 style={[theme.centerAll, theme.h3_light]}>
                                Atualizar
                            </H3>
                        </TouchableOpacity>
                    </View>

                </Container>

            );
        }

    }

    isSequence(senha) {
        let senha_split = senha.split('');

        if (senha_split[0] === senha_split[1] && senha_split[1] === senha_split[2] ||
            senha_split[1] === senha_split[2] && senha_split[2] === senha_split[3]
        ) return true;

        return /(\d)\1{2}/.test(senha);
    }

    isCPF(senha) {
        const {account} = this.props;
        if (account.data.cpf && senha === account.data.cpf.substr(0, 4)) return true;
        return !!(account.data.cpf && senha === account.data.cpf.substr(7, 11));
    }

    isNascimento(senha) {
        const {account} = this.props;
        let data_nascimento = account.data.pessoa.data_nascimento.replace(/\D+/g, '');
        let dia_mes = data_nascimento.substr(0, 4);

        if (senha === dia_mes) return true;
        return senha === data_nascimento.substr(4, 8);


    }
}

const mapStateToProps = state => {
    return {account: state.account};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({novaSenhaCartao,exibirSenha}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NewPasswordCard);

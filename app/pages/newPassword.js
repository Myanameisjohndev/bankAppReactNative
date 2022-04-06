import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  Image,
  Linking,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Body,
  Container,
  Content,
  H1,
  H3,
  Header,
  Input,
  Left,
  Text,
  View,
} from 'native-base';
import Style from '../style/style';
import {
  buttonBoxes,
  buttonTwoBoxes,
  darkButton,
  defaultTextColor,
  degrade_primario,
  degrade_secundario,
  lightButton,
  text_light,
  whiteLabel,
  telefone,
} from '../style/pallet';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {novaSenha} from '../store/user';
import {AlertHelper} from '../components/AlertHelper';
import Loading from '../components/common/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../style/theme';
import {TextInputMask} from 'react-native-masked-text';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

class NewPassword extends Component {
  state = {
    senha: null,
    senha1: null,
    loading: false,
    generated: true,
    showPass: false,
    showRePass: false,
    showAlert: false,
    alert: {},
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    //alert(this.isMediumPassword("Gut751"));
  }

  async save() {
    const {senha, senha1} = this.state;
    const {novaSenha, navigation} = this.props;
    this.setState({loading: true});
    if (!senha || senha.length < 6) {
      this.setState(data => {
        data.alert = {
          title: 'Tamanho incorreto',
          subtitle: 'Senha deve possuir 6 dígitos!',
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
      this.setState({loading: false});
      return false;
    }

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

    if (
      senha === '123456' ||
      senha === '654321' ||
      senha === '000000' ||
      senha === '111111'
    ) {
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
    if (!this.isMediumPassword(senha)) {
      this.setState(data => {
        data.alert = {
          title: 'Senha fraca !',
          subtitle:
            'No mínimo 1 letra maiúscula , 1 letra minúscula e números.',
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
    let save = await novaSenha(senha);
    if (save.status === 'success') {
      this.setState(data => {
        data.alert = {
          title: 'Sucesso !',
          subtitle:
            'Sua senha foi alterada e poderá ser usada a partir do próximo Login!',
          theme: 'success',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
      this.setState({loading: false});
      this.setState({generated: false});

      // AlertHelper.show('success', 'Parabéns!', 'Sua senha foi alterada e poderá ser usada a partir do próximo Login!');
      // this.props.navigation.navigate('App');
    }
  }

  alertClose() {
    this.setState({showAlert: false});
  }

  render() {
    if (this.state.generated === false) {
      return (
        <Container>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />
          <Content
            style={[{marginHorizontal: 17, backgroundColor: degrade_primario}]}>
            <H1
              style={[
                theme.h3,
                theme.justifyText,
                {color: '#90bce9', fontSize: 36, paddingTop: 15},
              ]}>
              Senha Alterada a!
            </H1>
            <H1 style={[theme.h3, theme.justifyText, {color: '#FFF'}]}>
              Agora você já pode começar a usar o nosso app :)
            </H1>
            <View>
              <H1 style={[theme.h3, theme.justifyText, {color: '#FFF'}]}>
                Se você tiver dúvidas, ou algum problema, pode entrar na nossa
              </H1>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'whatsapp://send?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20no%20' +
                      {whiteLabel} +
                      '.&phone=' +
                      {telefone} +
                      '',
                  )
                }>
                <H3
                  style={[
                    theme.h3,
                    {
                      color: '#FFF',
                      fontWeight: 'bold',
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  página de ajuda
                </H3>
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/icones/recoverPassword.png')}
              style={[
                theme.centerAll,
                {
                  resizeMode: 'contain',
                  height: 180,
                  paddingTop: 15,
                  marginTop: 60,
                  marginLeft: 5,
                },
              ]}
            />

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('App')}
              style={[
                this.state.loading ? theme.buttonDisabled : theme.buttonDark,
                theme.centerAll,
                {
                  color: '#FFF',
                  backgroundColor: '#90bce9',

                  textAlign: 'center',
                  marginTop: 0,
                },
              ]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[
                    theme.h3,
                    theme.justifyText,
                    {
                      color: '#FFF',
                      backgroundColor: '#90bce9',

                      textAlign: 'center',
                      marginTop: 0,
                    },
                  ]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3 style={[theme.centerAll, theme.h3_light]}>
                Começar a usar o app
              </H3>
            </TouchableOpacity>
          </Content>
        </Container>
      );
    }

    if (this.state.generated === true) {
      return (
        <Container>
          <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
            <Body>
              <H1
                style={[
                  theme.h1,
                  {marginTop: 15, marginLeft: 5, alignSelf: 'flex-start'},
                ]}>
                Nova senha
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
              Olá, agora digite sua nova senha de 6 dígitos.
            </H1>

            <View style={{marginTop: '2%', flexDirection: 'row'}}>
              <TextInput
                style={[theme.input, {textAlign: 'center'}]}
                placeholder="Nova senha"
                maxLength={6}
                keyboardType="default"
                secureTextEntry={!this.state.showPass}
                onChangeText={senha => this.setState({senha})}
                value={this.state.senha || ''}
              />
              <TouchableOpacity
                transparent
                onPress={e => {
                  this.setState({showPass: !this.state.showPass});
                }}
                underlayColor="none"
                style={{position: 'absolute', right: 10, top: 30, bottom: 0}}>
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
                maxLength={6}
                keyboardType="default"
                secureTextEntry={!this.state.showRePass}
                onChangeText={senha1 => this.setState({senha1})}
                value={this.state.senha1 || ''}
              />
              <TouchableOpacity
                transparent
                onPress={e => {
                  this.setState({showRePass: !this.state.showRePass});
                }}
                underlayColor="none"
                style={{position: 'absolute', right: 10, top: 30, bottom: 0}}>
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
            headerIconComponent={
              this.state.alert.icon || (
                <AntDesign
                  name={this.state.alert.icone || 'info'}
                  size={35}
                  color={'#fff'}
                />
              )
            }>
            <SCLAlertButton
              theme={this.state.alert.theme || 'info'}
              onPress={this.alertClose.bind(this)}>
              Ok
            </SCLAlertButton>
          </SCLAlert>

          <View style={[theme.fixBottom, theme.centerAll]}>
            <TouchableOpacity
              onPress={() => this.save()}
              disabled={this.state.loading}
              style={[
                this.state.loading ? theme.buttonDisabled : theme.buttonDark,
                theme.centerAll,
                {
                  marginTop: 30,
                },
                {
                  backgroundColor: darkButton,
                },
              ]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[theme.centerAll, {marginTop: 8}]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3 style={[theme.centerAll, theme.h3_light]}>Próximo</H3>
            </TouchableOpacity>
          </View>
        </Container>
      );
    }
  }

  isSequence(senha) {
    let senha_split = senha.split('');

    if (
      (senha_split[0] === senha_split[1] &&
        senha_split[1] === senha_split[2]) ||
      (senha_split[1] === senha_split[2] && senha_split[2] === senha_split[3])
    ) {
      return true;
    }

    return /(\d)\1{2}/.test(senha);
  }

  isCPF(senha) {
    const {account} = this.props;
    if (account.data.cpf && senha === account.data.cpf.substr(0, 4)) {
      return true;
    }
    return !!(account.data.cpf && senha === account.data.cpf.substr(7, 11));
  }

  isNascimento(senha) {
    const {account} = this.props;
    let data_nascimento = account.data.pessoa.data_nascimento.replace(
      /\D+/g,
      '',
    );
    let dia_mes = data_nascimento.substr(0, 4);

    if (senha === dia_mes) {
      return true;
    }
    return senha === data_nascimento.substr(4, 8);
  }
  isMediumPassword(senha) {
    let mediumPassword = new RegExp(
      '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.{8,}))',
    );
    return mediumPassword.test(senha);
  }
  isStrongPassword(senha) {
    let strongPassword = new RegExp(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
    );
    return strongPassword.test(senha);
  }
}

const mapStateToProps = state => {
  return {account: state.account};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({novaSenha}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewPassword);

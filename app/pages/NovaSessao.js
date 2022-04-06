import React, {Component, createRef} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  H1,
  View,
  Text,
  Card,
  H3,
  Input,
  CheckBox,
  Header,
} from 'native-base';
import {StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native';
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/common/Loading';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  cor_fundo,
  darkButton,
  disabledButton,
  lightButton,
} from '../style/pallet';
import {Helpers} from '../components/helpers';
import {TextInputMask} from 'react-native-masked-text';
import {Authenticate} from '../store/token';
import {deviceValidate} from '../store/device';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {TextInput} from 'react-native-gesture-handler';

class NovaSessao extends Component {
  constructor(props) {
    super(props);
    this.mostrarListaView = this.mostrarListaView.bind(this);
    this.mostrarOpcaoInput;
    this.teste;
    this.dropdownController = createRef(null);
    this.usuario;
  }

  state = {
    isPhysicalPerson: true,
    loading: false,
    lembrar_dados: null,
    usuario: null,
    senha: null,
    showAlert: false,
    alert: {},
    selectedItem: null,
    temAsync: null,
    listaStorage: null,
    listaDados: [],
    listaStorageView: [],
  };

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  async componentDidMount() {
    let usuario = await AsyncStorage.getItem('usuario');
    let lembrar_dados = (await AsyncStorage.getItem('lembrar_dados')) === '1';
    this.setState({usuario, lembrar_dados});
    let listaStorage = await AsyncStorage.getItem('listaStorage');
    this.setState({listaStorage: JSON.parse(listaStorage)});

    let temp = this.state.listaStorage;
    let listaVestor;
    if (this.state.listaStorage === null) {
      this.setState({listaStorage: []});
      this.mostrarOpcaoInput = false;
    }
    console.log(this.state.listaStorage, 'storage');
    if (temp) {
      this.mostrarOpcaoInput = true;
      listaVestor = temp.map(e => {
        return {
          id: e,
          title: e,
        };
      });
    }

    this.setState({listaStorageView: listaVestor});
    //console.log(this.state.listaStorageView[0].id, 'novo vetor');
    //console.log(this.state.listaStorageView);
  }

  alertClose() {
    this.setState({showAlert: false});
  }

  render() {
    return (
      <Container>
        <Header style={{height: 24}} transparent />
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor={cor_fundo}
        />
        <Content style={{marginHorizontal: 5}} padder>
          <H1
            allowFontScaling={false}
            style={[
              theme.h3_no_margin,
              theme.fontBold,
              (theme.buttonTextColor = {
                maxWidth: '60%',
                fontSize: 35,
              }),
            ]}>
            Login
          </H1>
          <H1
            allowFontScaling={false}
            style={[
              theme.h3,
              theme.fontRegular,
              {
                fontSize: 25,
                maxWidth: '100%',
                marginTop: 0,
              },
            ]}>
            Não tem uma conta?
          </H1>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <H1
              allowFontScaling={false}
              style={[
                theme.h3,
                theme.fontBold,
                theme.buttonTextColor,
                {fontSize: 25, marginTop: 0},
              ]}>
              Cadastre-se
            </H1>
          </TouchableOpacity>

          <Card
            style={{
              marginTop: 50,
              zIndex: 1,
              marginBottom: 10,
              position: 'relative',
            }}
            transparent>
            <H3 allowFontScaling={false} style={theme.fontDefault}>
              CPF / CNPJ
            </H3>

            {!this.mostrarOpcaoInput && (
              <View>
                <TextInputMask
                  type={'custom'}
                  options={{
                    mask:
                      this.state.isPhysicalPerson === true
                        ? '999.999.999-99*'
                        : '99.999.999/9999-99',
                    validator: value => {
                      return (
                        Helpers.validarCPF(value) || Helpers.validCnpj(value)
                      );
                    },
                  }}
                  keyboardType="number-pad"
                  disabled={this.state.loading}
                  style={[theme.input]}
                  value={this.usuario}
                  onChangeText={usuario => {
                    this.setState({
                      usuario,
                      isPhysicalPerson: usuario.length <= 14,
                    });
                    this.usuario = usuario;
                  }}
                />
              </View>
            )}

            {this.mostrarOpcaoInput && (
              <View style={{position: 'relative'}}>
                <AutocompleteDropdown
                  inputContainerStyle={{
                    backgroundColor: '#fff',
                  }}
                  suggestionsListContainerStyle={{
                    backgroundColor: '#fff',
                    marginTop: 40,
                  }}
                  containerStyle={{flexGrow: 1, flexShrink: 1}}
                  rightButtonsContainerStyle={{
                    borderRadius: 5,
                    right: 8,
                    height: 30,
                    top: 30,
                    alignSelfs: 'center',
                    backgroundColor: '#fff',
                    width: 70,
                  }}
                  textInputProps={{
                    style: {
                      width: undefined,
                      height: 67,
                      borderRadius: 5,
                      borderColor: '#D0D0D0',
                      borderWidth: 1,
                      marginTop: 12,
                      flex: 1,
                      backgroundColor: '#fff',
                      fontSize: 23,
                      paddingLeft: 15,
                    },
                  }}
                  renderItem={(item, text) => (
                    <Text
                      style={{
                        color: 'black',
                        padding: 15,
                        backgroundColor: '#fff',
                        fontSize: 20,
                        zIndex: 5,
                      }}>
                      {item.title}
                    </Text>
                  )}
                  clearOnFocus={false}
                  closeOnBlur={true}
                  closeOnSubmit={false}
                  //value={this.state.selectedItem}
                  //initialValue={{id: '2'}} // or just '2'
                  onChangeText={item => this.mostrarListaView(item)}
                  onSelectItem={item => this.setState({selectedItem: item})}
                  dataSet={this.state.listaStorageView}
                  controller={controller => {
                    this.dropdownController.current = controller;
                  }}

                  /* InputComponent={() => {
                  return (
                    <TextInput
                      style={[theme.input]}
                      keyboardType="number-pad"
                      onBlur={() => this.teste()}
                    />
                  );
                }} */
                />
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                zIndex: -1,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                allowFontScaling={false}
                style={[{flex: 1, fontSize: 20}, theme.fontRegular]}>
                Lembrar dados
              </Text>
              <View style={{flex: 0.1}}>
                <CheckBox
                  color={darkButton}
                  checked={this.state.lembrar_dados}
                  onPress={() =>
                    this.setState({lembrar_dados: !this.state.lembrar_dados})
                  }
                />
              </View>
            </View>

            <View
              style={{paddingTop: 20, zIndex: -10, position: 'relative'}}
              transparent>
              <H3
                allowFontScaling={false}
                style={(theme.fontDefault, {zIndex: -1, position: 'relative'})}>
                Senha
              </H3>
              <Input
                disabled={this.state.loading}
                secureTextEntry={true}
                onChangeText={senha => this.setState({senha})}
                value={this.state.senha}
                keyboardType="default"
                style={theme.input}
              />
            </View>
          </Card>
          <View style={{flexDirection: 'row-reverse', flex: 1, marginTop: 10}}>
            <View
              style={{
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword')
                }>
                <Text
                  allowFontScaling={false}
                  style={[
                    {
                      flex: 1,
                      fontSize: 20,
                      textDecorationLine: 'underline',
                    },
                    theme.fontRegular,
                  ]}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: wp('10%')}} />
          <TouchableOpacity
            onPress={() => !this.state.loading && this.auth()}
            disabled={this.state.loading}
            style={[
              this.state.loading ? theme.buttonDisabled : theme.buttonDark,
              theme.centerAll,
              {marginTop: 0},
            ]}>
            {this.state.loading && (
              <ActivityIndicator
                style={[theme.centerAll, {marginTop: 8}]}
                color={lightButton}
                size={Platform.OS === 'ios' ? 'large' : 50}
              />
            )}
            <H3
              allowFontScaling={false}
              style={[theme.centerAll, theme.h3_light]}>
              Entrar
            </H3>
          </TouchableOpacity>
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
        </Content>
      </Container>
    );
  }

  teste = () => {
    console.log('blur');
  };

  mostrarListaView = item => {
    let tipoVariavel = isNaN(parseInt(item));

    if (tipoVariavel) {
      this.dropdownController.current.clear();
    } else {
      if (item.length <= 14) {
        this.cpf(item);
      } else if (item.length > 14 && item.length <= 18) {
        this.cnpj(item);
      } else {
        console.log('entrou');
        item = item.substring(0, 18);
        this.dropdownController.current.setInputText(item);
      }
    }
  };

  cnpj(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
    console.log(v, 'cnpj');
    this.dropdownController.current.setInputText(v);
    this.usuario = v;
    return v;
  }

  cpf(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    console.log(v, 'cpf');
    this.dropdownController.current.setInputText(v);
    this.usuario = v;

    return v;
  }

  setarStorage = () => {
    console.log(this.state.listaStorage, 'teste');
    let vetor = this.state.listaStorage;
    if (!vetor) {
      vetor = [];
    }
    //let vetor = JSON.parse(this.state.listaStorage)
    console.log(vetor, 'vetor');

    if (!vetor.includes(this.usuario)) {
      console.log('includes');
      vetor.push(this.usuario);
    }

    this.setState({
      listaDados: vetor,
    });
    console.log(vetor, 'vetor');
  };

  async auth() {
    console.log(this.state.selectedItem, 'selected');
    if (this.state.selectedItem) {
      this.usuario = this.state.selectedItem.id;
    }

    console.log(this.usuario, 'usuario');
    console.log(this.state.selectedItem, 'selectedd');
    this.setState({loading: true});
    if (!Helpers.validarCPF(this.usuario) && !Helpers.validCnpj(this.usuario)) {
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
    } else if (!this.state.senha || this.state.senha.toString().length < 4) {
      this.setState(data => {
        data.alert = {
          title: 'Campo inválido',
          subtitle: 'Tamanho da senha inválido. Tente novamente!',
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });

      this.setState({loading: false});
      return false;
    }

    await this.props.Authenticate(this.usuario, this.state.senha);

    if (this.props.token && this.props.token.access_token) {
      await AsyncStorage.setItem('token', this.props.token.access_token);

      if (this.state.lembrar_dados) {
        await AsyncStorage.setItem('usuario', this.usuario);
        await AsyncStorage.setItem('senha', this.state.senha);
        await AsyncStorage.setItem(
          'lembrar_dados',
          this.state.lembrar_dados ? '1' : '0',
        );
      }

      await this.setarStorage();

      /* await AsyncStorage.setItem(
        'listaStorage',
        JSON.stringify(['125.123.123-12', '186.050.547-20', '034.186.351-30']),
      ); */
      console.log(JSON.stringify(this.state.listaDados), 'listaDados');
      await AsyncStorage.setItem(
        'listaStorage',
        JSON.stringify(this.state.listaDados),
      );

      await this.props.deviceValidate(
        DeviceInfo.getUniqueId(),
        DeviceInfo.getDeviceName(),
      );

      if (this.props.device.status === 'success') {
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Validacao');
      }
    } else if (this.props.token.status === 'error') {
      this.setState(data => {
        data.alert = {
          title: 'Oops',
          subtitle: this.props.token.message,
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
    }

    this.setState({loading: false});
  }
}

const mapStateToProps = state => {
  return {token: state.token, account: state.account, device: state.device};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({Authenticate, deviceValidate}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NovaSessao);

import React, {Component} from 'react';
import {
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  BackHandler,
  Appearance,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  cor_fundo,
  darkButton,
  degrade_primario,
  degrade_secundario,
  text_light,
} from '../style/pallet';
import {accountFetch, updatePushID} from '../store/account';
import {settingsFetch} from '../store/bankSettings';
import Loading from '../components/common/Loading';
import FadeInView from 'react-native-fade-in-view';
import PTRView from 'react-native-pull-to-refresh';
import Termos from '../components/common/termos';
import {
  Container,
  Content,
  H1,
  Header,
  Button,
  View,
  H3,
  Footer,
  FooterTab,
} from 'native-base';
import theme from '../style/theme';
import Svg, {Defs, Path, Stop} from 'react-native-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DrawerOpen from '../components/navigation/drawerMain/DrawerOpen';
import AsyncStorage from '@react-native-community/async-storage';

class Dashboard extends Component {
  state = {showMoney: false, loading: true};
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  async load() {
    const {
      accountFetch,
      account,
      paymentAuthorize,
      settingsFetch,
      updatePushID,
    } = this.props;
    await accountFetch();
    await settingsFetch();
    let token = await AsyncStorage.getItem('id_push');
    if (token) {
      await updatePushID(token);
    }

    this.checkIfRequireNewPassword();
    console.log('dados abaixo');
    console.log(this.props.account.data.conta.paysmart_id);
    console.log(typeof this.props.account.data.conta.paysmart_id);
  }

  componentDidMount() {
    this.load().then(data => {
      this.setState({loading: false});
    });
    BackHandler.addEventListener('hardwareBackPress', this.removeBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.removeBack);
  }

  disableRemoveBack() {
    BackHandler.removeEventListener('hardwareBackPress', this.removeBack);

    return true;
  }

  async logout() {
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('senha');
    this.props.navigation.navigate('Login');
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    const {data} = this.props.account;
    console.log(data, 'data teste');
    //data.conta.paysmart_id=1;
    return (
      <Container style={{backgroundColor: cor_fundo}}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <PTRView
          onRefresh={() => this.load()}
          style={{
            marginTop: Platform.OS === 'ios' ? -9 : 0,
            backgroundColor: 'transparent',
            zIndex: -1,
          }}>
          <Content style={{backgroundColor: cor_fundo, height: '100%'}}>
            <Svg
              width={415}
              height={357}
              viewBox="0 0 415 357"
              fill={darkButton}>
              <Path
                d="M-1 0h416v312.613s-142.843 77.39-208 27.794C141.843 290.811-1 328.722-1 328.722V0z"
                fill={
                  Appearance.getColorScheme() === 'dark'
                    ? degrade_primario
                    : degrade_primario
                }
              />
              <Path
                d="M-1 0h416v312.613s-142.843 77.39-208 27.794C141.843 290.811-1 328.722-1 328.722V0z"
                fill={
                  Appearance.getColorScheme() === 'dark'
                    ? degrade_secundario
                    : degrade_secundario
                }
              />
              <Defs>
                <View style={{marginTop: 60, marginHorizontal: 17}}>
                  <View style={{flexDirection: 'row'}}>
                    <H1
                      style={[
                        theme.h1,
                        theme.fontBold,
                        {
                          color: text_light,
                          fontSize: 36,
                          paddingTop: Platform.OS === 'ios' ? 5 : 1,
                          flex: 1,
                        },
                      ]}
                      allowFontScaling={false}>
                      Olá, {data.pessoa.nome.split(' ')[0]}
                    </H1>
                  </View>
                  <H3
                    allowFontScaling={false}
                    style={[theme.h1, theme.fontDefault, {fontSize: 17}]}>
                    Ag 0001 C/C {data.conta.id.toString().padStart(6, '0')}
                  </H3>
                </View>
                <View style={{paddingTop: 100, marginHorizontal: 17}}>
                  <H3 allowFontScaling={false} style={[theme.h1]}>
                    Saldo disponível:
                  </H3>
                  <View style={{flexDirection: 'row'}}>
                    <H3
                      allowFontScaling={false}
                      style={[theme.h1, {flex: 0.36}]}>
                      {this.state.showMoney
                        ? data.conta.saldo
                          ? data.conta.saldo.saldo
                          : 'R$ 0.00'
                        : '• • • •'}
                    </H3>
                  </View>
                </View>
              </Defs>
            </Svg>
            <TouchableOpacity
              style={{
                flex: 0.2,
                right: 15,
                top: -295,
                backgroundColor: 'transparent',
              }}
              onPress={() => this.logout()}>
              <AntDesign
                size={25}
                name={'poweroff'}
                color={cor_fundo}
                style={{
                  justifyContent: 'flex-end',
                  textAlign: 'right',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              transparent
              onPress={e => {
                this.setState({showMoney: !this.state.showMoney});
              }}
              underlayColor="none"
              style={{
                top: -143,
                left: wp('38%'),
                backgroundColor: 'transparent',
              }}>
              <Icon
                allowFontScaling={false}
                name={this.state.showMoney ? 'visibility-off' : 'visibility'}
                color={cor_fundo}
                size={30}
                style={[{color: text_light}]}
              />
            </TouchableOpacity>
            <View style={{marginHorizontal: 20, marginTop: -40}}>
              <View style={{paddingBottom: 10}} />
              <View style={{height: 15}} />
              {/*<View style={{flexDirection: 'row'}}>*/}
              {/*    <View style={[{flexDirection: 'column'}, theme.centerAll]}>*/}
              {/*        <TouchableOpacity style={[theme.customButton, theme.centerAll, {flexDirection: 'row'}]}>*/}
              {/*            <Image*/}
              {/*                source={require('../../assets/icones/pix.png')}*/}
              {/*                style={[theme.centerAll, {*/}
              {/*                    resizeMode: 'contain',*/}
              {/*                    width: 34,*/}
              {/*                    height: 38,*/}
              {/*                    marginLeft: 5*/}
              {/*                }]} />*/}
              {/*            <H3 allowFontScaling={false} style={[theme.fontDefault, theme.centerAll]}>*/}
              {/*                PIX*/}
              {/*            </H3>*/}
              {/*        </TouchableOpacity>*/}
              {/*    </View>*/}
              {/*    <View style={{width: 5}} />*/}
              {/*    <View style={[{flexDirection: 'column'}, theme.centerAll]}>*/}
              {/*        <TouchableOpacity style={[theme.customButton, theme.centerAll, {flexDirection: 'row'}]}>*/}
              {/*            <Image*/}
              {/*                source={require('../../assets/icones/cartao.png')}*/}
              {/*                style={[theme.centerAll, {*/}
              {/*                    resizeMode: 'contain',*/}
              {/*                    width: 34,*/}
              {/*                    height: 38,*/}
              {/*                    marginLeft: 5*/}
              {/*                }]} />*/}
              {/*            <H3 allowFontScaling={false} style={[theme.fontDefault, theme.centerAll]}>*/}
              {/*                Cartões*/}
              {/*            </H3>*/}
              {/*        </TouchableOpacity>*/}
              {/*    </View>*/}
              {/*</View>*/}
              <View style={{height: 10}} />
              <View style={{flexDirection: 'row'}}>
                <View style={[{flexDirection: 'column'}, theme.centerAll]}>
                  <TouchableOpacity
                    style={[
                      theme.customButton,
                      theme.centerAll,
                      {flexDirection: 'row'},
                    ]}
                    onPress={() =>
                      this.disableRemoveBack() &&
                      this.props.navigation.navigate('Favored')
                    }>
                    <Image
                      source={require('../../assets/icones/ted2.png')}
                      style={[
                        theme.centerAll,
                        {
                          resizeMode: 'contain',
                          width: 34,
                          marginLeft: 5,
                        },
                      ]}
                    />
                    <H3
                      allowFontScaling={false}
                      style={[
                        theme.fontDefault,
                        theme.centerAll,
                        theme.fontLight,
                      ]}>
                      Transferir
                    </H3>
                  </TouchableOpacity>
                </View>
                <View style={{width: 5}} />
                <View style={[{flexDirection: 'column'}, theme.centerAll]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.disableRemoveBack() &&
                      this.props.navigation.navigate('History')
                    }
                    style={[
                      theme.customButton,
                      theme.centerAll,
                      {flexDirection: 'row'},
                    ]}>
                    <Image
                      source={require('../../assets/icones/extrato2.png')}
                      style={[
                        theme.centerAll,
                        {
                          resizeMode: 'contain',
                          width: 34,
                          height: 38,
                          marginLeft: 5,
                        },
                      ]}
                    />
                    <H3
                      allowFontScaling={false}
                      style={[
                        theme.fontDefault,
                        theme.centerAll,
                        theme.fontLight,
                      ]}>
                      Extrato
                    </H3>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{height: 10}} />
              {String(data.conta.paysmart_id) === '' ||
              data.conta.paysmart_id === null ? (
                <View
                  style={[
                    {flexDirection: 'column', marginHorizontal: 5},
                    theme.centerAll,
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.disableRemoveBack() &&
                      this.props.navigation.navigate('Receiver')
                    }
                    style={[
                      theme.customButton,
                      theme.centerAll,
                      {
                        flexDirection: 'row',
                        width: wp('91.9%'),
                      },
                    ]}>
                    <Image
                      source={require('../../assets/icones/emprestimo2.png')}
                      style={[
                        theme.centerAll,
                        {
                          resizeMode: 'contain',
                          width: 34,
                          marginLeft: 5,
                        },
                      ]}
                    />
                    <H3
                      allowFontScaling={false}
                      style={[
                        theme.fontDefault,
                        theme.h1,
                        theme.fontLight,
                        theme.centerAll,
                        {marginLeft: wp('8%')},
                      ]}>
                      {'  '} Receber boleto ou pix
                    </H3>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View
                    style={[
                      {flexDirection: 'column', marginHorizontal: 5},
                      theme.centerAll,
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.disableRemoveBack() &&
                        this.props.navigation.navigate('Receiver')
                      }
                      style={[
                        theme.customButton,
                        theme.centerAll,
                        {
                          flexDirection: 'row',
                          width: wp('91.9%'),
                        },
                      ]}>
                      <Image
                        source={require('../../assets/icones/emprestimo.png')}
                        style={[
                          theme.centerAll,
                          {
                            resizeMode: 'contain',
                            width: 34,
                            marginLeft: 5,
                          },
                        ]}
                      />
                      <H3
                        allowFontScaling={false}
                        style={[
                          theme.fontDefault,
                          theme.h1,
                          theme.centerAll,
                          {marginLeft: wp('8%')},
                        ]}>
                        {'  '} Receber boleto ou pix
                      </H3>
                    </TouchableOpacity>
                  </View>
                  <View style={{height: 15}} />
                  <View
                    style={[
                      {flexDirection: 'column', marginHorizontal: 5},
                      theme.centerAll,
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.disableRemoveBack() &&
                        this.props.navigation.navigate('Cards')
                      }
                      style={[
                        theme.customButton,
                        theme.centerAll,
                        {
                          flexDirection: 'row',
                          width: wp('91.9%'),
                        },
                      ]}>
                      <Image
                        source={require('../../assets/icones/cartao.png')}
                        style={[
                          theme.centerAll,
                          {
                            resizeMode: 'contain',
                            width: 34,
                            marginLeft: 5,
                          },
                        ]}
                      />
                      <H3
                        allowFontScaling={false}
                        style={[
                          theme.fontDefault,
                          theme.h1,
                          theme.centerAll,
                          {marginLeft: wp('24%')},
                        ]}>
                        Cartões
                      </H3>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{height: 15}} />
              {data.possui_terminal && (
                <View
                  style={[
                    {flexDirection: 'column', marginHorizontal: 5},
                    theme.centerAll,
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.disableRemoveBack() &&
                      this.props.navigation.navigate('PosTransaction')
                    }
                    style={[
                      theme.customButton,
                      theme.centerAll,
                      {
                        flexDirection: 'row',
                        width: wp('91.9%'),
                      },
                    ]}>
                    <View
                      style={[
                        theme.centerAll,
                        {
                          backgroundColor: darkButton,
                          borderRadius: 2,
                          width: 50,
                          height: 39,
                        },
                      ]}>
                      <Fontisto
                        name={'shopping-pos-machine'}
                        size={30}
                        style={[
                          theme.centerAll,
                          theme.fontLight,
                          {marginTop: 0},
                        ]}
                      />
                    </View>
                    <H3
                      allowFontScaling={false}
                      style={[
                        theme.fontDefault,
                        theme.centerAll,
                        theme.h1,
                        {marginLeft: wp('12%')},
                      ]}>
                      {'  '} Vendas Maquininhas
                    </H3>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{height: 15}} />
          </Content>
        </PTRView>
        <Footer style={{backgroundColor: degrade_secundario}}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() =>
              this.disableRemoveBack() && this.props.navigation.navigate('Pay')
            }>
            <FontAwesome
              name={'barcode'}
              style={[theme.centerAll]}
              color={text_light}
              size={25}
            />
            <H3
              allowFontScaling={false}
              style={[theme.fontDefault, theme.centerAll, theme.fontLight]}>
              {'  '}Pagamentos
            </H3>
          </TouchableOpacity>
        </Footer>
      </Container>
    );
  }

  checkIfRequireNewPassword() {
    const {account, navigation} = this.props;
    if (account.data.nova_senha === 1) {
      navigation.navigate('NewPassword');
    }
  }

  removeBack() {
    return true;
  }
}

const mapStateToProps = state => {
  return {account: state.account, bankSettings: state.bankSettings};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {accountFetch, settingsFetch, updatePushID},
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);

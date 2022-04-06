import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {whiteLabel} from '../style/pallet';
import {
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Style from '../style/style';
import theme from '../style/theme';
import {
  degrade_primario,
  degrade_secundario,
  degrade_secundario_2,
} from '../style/pallet';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../components/common/Loading';
import TouchID from 'react-native-touch-id';
import {Logo} from '../constants';
import {
  Container,
  Content,
  H1,
  Header,
  Button,
  View,
  Text,
  H3,
} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import json from '../../package.json';

class Login extends Component {
  state = {loading: true};

  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    this.checkIfIsFirstLoginOrNot().then(r => null);
  }

  render() {
    const {navigation} = this.props;
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Container>
        <LinearGradient
          colors={[
            degrade_primario,
            degrade_secundario_2,
            degrade_secundario_2,
          ]}
          style={[Style.authGradPass, {height: hp('100%'), flex: 1}]}>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="transparent"
          />
          <Content style={{marginTop: 24}}>
            <H1
              allowFontScaling={false}
              style={[theme.h1, {maxWidth: wp('60%'), marginTop: hp('5%')}]}>
              Tenha o{' '}
              <H1
                allowFontScaling={false}
                style={[theme.h1, theme.fontBold, {maxWidth: wp('60%')}]}>
                {whiteLabel}
              </H1>{' '}
              na palma da sua mão
            </H1>
            <Logo
              moreStyle={{
                alignSelf: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
            />
          </Content>
          <View style={[theme.fixBottom, {marginBottom: 10}]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}
              style={[theme.buttonWhite, theme.centerAll]}>
              <H3 style={[theme.centerAll, theme.h3]}>Criar conta</H3>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('NovaSessao')}>
              <H3 style={[theme.centerAll, theme.h1, {marginTop: 20}]}>
                Já possui uma conta?{' '}
                <H3 style={theme.buttonTextColor}>Login</H3>
              </H3>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Container>
    );
  }

  async checkIfIsFirstLoginOrNot() {
    const {navigation} = this.props;
    let usuario = await AsyncStorage.getItem('usuario');
    let senha = await AsyncStorage.getItem('senha');
    if (Platform.OS === 'ios' && (usuario == null || senha == null)) {
      this.setState({loading: false});
      return false;
    }

    if (usuario && usuario.length > 11 && senha && senha.length > 3) {
      TouchID.isSupported()
        .then(success => {
          navigation.navigate('Sessao');
        })
        .catch(error => {
          navigation.navigate('NovaSessao');
        });
    } else if (usuario && usuario.length) {
      navigation.navigate('NovaSessao');
    }

    this.setState({loading: false});
  }
}

const mapStateToProps = state => {
  return {token: state.token, account: state.account, device: state.device};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

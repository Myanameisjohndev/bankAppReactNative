import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import payment, {paymentAuthorize, paymentNow} from '../store/payment';
import Style from '../style/style';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import LinearGradient from 'react-native-linear-gradient';
import {
  defaultTextColor,
  degrade_primario,
  gradGreenDark,
  gradGreenLight,
  gradientBackgroundBase,
  lightButton,
} from '../style/pallet';
import {AlertHelper} from '../components/AlertHelper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {billetValidateFetch, billetCIPFetch} from '../store/billet';
import {
  Header,
  Right,
  Left,
  Body,
  Container,
  Content,
  H3,
  H1,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../components/common/Loading';
import Boleto from '../components/utils/Boleto';
import theme from '../style/theme';

const barcodeMaskProps = {
  animatedLineOrientation: 'vertical',
  height: Dimensions.get('window').height - 180,
  width: 100,
  edgeColor: '#fff',
  animatedLineColor: gradGreenDark,
  backgroundColor: '#000',
  maskOpacity: 0.5,
};

class Pay extends Component {
  state = {
    loading: false,
    hasCameraPermission: null,
    scanned: false,
    valor: '0,00',
  };

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.backEvent = this.backEvent.bind(this);
  }

  onBarCodeRead(scanResult) {
    this.setState(
      {loading: true},
      async function () {
        console.log(scanResult.data);
        let boleto = Boleto.codBarras2LinhaDigitavel(scanResult.data);
        console.log(boleto.toString());
        await this.validateBillet(boleto.toString());
      }.bind(this),
    );
  }

  async validateBillet(data) {
    try {
      const {billetCIPFetch} = this.props;
      await billetCIPFetch(data.replace(/\D+/g, ''));
      this.setState({loading: false});
      this.props.navigation.navigate('billetInfo', {digitable: data});
    } catch (e) {
      this.setState({loading: false});
    }
  }

  componentDidMount() {
    // BackHandler.removeEventListener('hardwareBackPress', () => true);
    // BackHandler.addEventListener('hardwareBackPress', this.backEvent);
  }

  backEvent() {
    const {navigation} = this.props;
    navigation.replace('Dashboard');
    return true;
  }

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Container>
        <Header style={[{height: 80, backgroundColor: degrade_primario}]}>
          <Left>
            <TouchableOpacity
              style={{marginTop: 20}}
              onPress={() => this.props.navigation.goBack()}>
              <AntDesign name={'left'} size={35} color={defaultTextColor} />
            </TouchableOpacity>
          </Left>

          <Body>
            <H1
              allowFontScaling={false}
              style={[
                theme.h1,
                {marginTop: 15},
                {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0},
              ]}>
              Pagamentos
            </H1>
          </Body>
        </Header>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <View style={Style.generalViews}>
          <View style={{height: '100%', width: '100%'}}>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{
                flex: 1,
                maxHeight: '90%',
              }}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              keepAudioSession={false}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'EsgBank precisa de acesso a camera',
                message: 'Permitir utilizar sua camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancelar',
              }}
              onBarCodeRead={this.onBarCodeRead.bind(this)}>
              <BarcodeMask {...barcodeMaskProps} />
              <View style={[{marginTop: hp('40%'), marginLeft: wp('-60%')}]}>
                <TouchableOpacity
                  onPress={() => this.goToEnterBarCode()}
                  style={[
                    this.state.loading
                      ? theme.buttonDisabled
                      : theme.buttonDark,
                    theme.centerAll,
                    {
                      marginTop: 0,
                      transform: [{rotate: '90deg'}],
                    },
                  ]}>
                  {this.state.loading && (
                    <ActivityIndicator
                      style={[{marginTop: 8}, {transform: [{rotate: '90deg'}]}]}
                      color={lightButton}
                      size={Platform.OS === 'ios' ? 'large' : 50}
                    />
                  )}
                  <H3
                    allowFontScaling={false}
                    style={[theme.centerAll, theme.h3_light]}>
                    Digitar código de barras
                  </H3>
                </TouchableOpacity>
              </View>
            </RNCamera>
          </View>
        </View>
      </Container>
    );
  }

  goToEnterBarCode() {
    const {navigation} = this.props;
    navigation.navigate('EnterBarCode');
  }
}

const mapStateToProps = (state) => {
  return {info: state.payment, consulta: state.billet};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {paymentAuthorize, paymentNow, billetValidateFetch, billetCIPFetch},
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);

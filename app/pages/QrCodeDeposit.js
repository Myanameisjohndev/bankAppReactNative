import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {gerarQrCode} from '../store/qrcode';
import {
  Toast,
  Container,
  Left,
  Right,
  Body,
  H1,
  Header,
  Content,
  H3,
} from 'native-base';
import theme from '../style/theme';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  buttonBoxes,
  buttonTwoBoxes,
  defaultTextColor,
  cor_fundo,
  degrade_primario,
  lightButton,
  telefone,
  whiteLabel,
} from '../style/pallet';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  Clipboard,
  Button,
  ActivityIndicator,
} from 'react-native';

class QrCodeDeposit extends Component {
  state = {
    loading: false,
    valor: null,
    data: null,
    generated: false,
    showAlert: false,
    codigoPix: null,
    alert: {},
    imagem: '',
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.data = new Date();
    this.imagem = this.props.navigation.getParam('imagem');

    if (this.props.navigation.getParam('valor') === null) {
      this.valor = 0;
    } else {
      this.valor = this.props.navigation.getParam('valor');
    }
  }

  async copyAndToast() {
    this.codigoPix = this.props.navigation.getParam('codigoPix');
    console.log(this.codigoPix);
    await Clipboard.setString(this.codigoPix);
    Toast.show({
      text: 'PIX copiado!',
      buttonText: 'Ok',
      type: 'success',
    });
  }

  async shareFile(uri) {
    if (Platform.OS !== 'ios') {
      await Share.open({
        title: 'Compartilhar',
        message: 'Este é o meu código PIX QR CODE!',
        url: uri,
      });
    } else {
      await Share.open({
        title: 'Compartilhar comprovante',
        url: uri,
      });
    }
  }
  capture() {
    this.refs.viewShot.capture().then(async uri => {
      await this.shareFile(uri);
    });
  }

  render() {
    return (
      <Container>
        <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
          <Left>
            <TouchableOpacity
              style={{marginTop: 20}}
              onPress={() => this.props.navigation.goBack()}>
              <AntDesign name={'close'} size={35} color={defaultTextColor} />
            </TouchableOpacity>
          </Left>
          <Body />
        </Header>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />

        <Content
          style={[{backgroundColor: degrade_primario, paddingTop: hp('1%')}]}>
          <View
            style={{
              border: 1,
              borderWidth: 4,
              borderRadius: 10,
              borderColor: '#FFF',
              marginHorizontal: wp('18%'),
            }}>
            <H1
              allowFontScaling={false}
              style={[theme.h3_light, {marginTop: 5}, {textAlign: 'center'}]}>
              PIX qrCode Gerado
            </H1>
            <H1
              allowFontScaling={false}
              style={[
                theme.h3_light,
                {fontSize: 30},
                {marginTop: 15, marginBottom: 25},
                {textAlign: 'center'},
                {fontWeight: 'bold'},
              ]}>
              {this.valor}
            </H1>
          </View>

          <View
            style={{
              marginTop: 15,
              borderColor: '#FFF',
              borderWidth: 1,
              borderStyle: 'dotted',
              borderRadius: 1,
            }}
          />

          <View
            style={[
              {marginLeft: wp('10%')},
              {marginRight: wp('10%')},
              {textAlign: 'left'},
            ]}>
            <H1
              allowFontScaling={false}
              style={[
                theme.h3_light,
                {fontSize: 18},
                {textAlign: 'center'},
                {marginBottom: 10},
              ]}>
              Utilize o PIX qrCode abaixo:
            </H1>

            <ViewShot
              style={{flex: 1}}
              ref="viewShot"
              options={{
                format: 'png',
                quality: 1,
                result: 'data-uri',
              }}>
              <Image
                source={{
                  uri: this.imagem,
                }}
                style={[
                  theme.centerAll,
                  {
                    resizeMode: 'contain',
                    height: wp('50%'),
                    width: wp('50%'),
                  },
                ]}
              />
            </ViewShot>
          </View>
        </Content>
        <View style={[theme.fixBottom, theme.centerAll]}>
          <TouchableOpacity
            onPress={() => this.copyAndToast()}
            disabled={this.state.loading}
            style={[
              this.state.loading ? theme.buttonDisabled : theme.buttonDark,
              theme.centerAll,
              {
                marginTop: 30,
              },
              {
                backgroundColor: '#90bce9',
              },
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
              Copiar código
            </H3>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.capture()}
            disabled={this.state.loading}
            style={[
              this.state.loading ? theme.buttonDisabled : theme.buttonDark,
              theme.centerAll,
              {
                marginTop: 10,
              },
              {
                backgroundColor: '#90bce9',
              },
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
              <AntDesign size={22} name={'sharealt'} color={'#fff'} />{' '}
              Compartilhar
            </H3>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {qrcode: state.qrcode};
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({gerarQrCode}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QrCodeDeposit);

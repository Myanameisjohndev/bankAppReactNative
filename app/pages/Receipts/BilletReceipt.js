import React, {Component} from 'react';

import {
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import Style from '../../style/style';
import {
  Fab,
  Content,
  Container,
  Left,
  Body,
  Right,
  Text,
  View,
  H3,
  H2,
  Header,
} from 'native-base';
import {
  cor_fundo,
  defaultTextColor,
  gradientBackgroundBase,
  lightButton,
  text_light,
} from '../../style/pallet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import theme from '../../style/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {logoComprovante} from '../../style/pallet';

class BilletReceipt extends Component {
  state = {loading: false};

  constructor(props) {
    super(props);
    const {title, dados, navigation, goBack} = this.props;
    this.dados = dados;
    this.title = title;
    this.goBack = goBack;
  }

  async shareFile(uri) {
    if (Platform.OS !== 'ios') {
      await Share.open({
        title: 'Compartilhar comprovante',
        message: 'Este é o meu comprovante de boleto EsgBank! ',
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
    this.refs.viewShot.capture().then(async (uri) => {
      this.shareFile(uri);
    });
  }

  render() {
    const {dados, title} = this;
    return (
      <Container>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Content scrollEnabled={true} style={{marginHorizontal: 10}} padder>
          <ViewShot
            style={{backgroundColor: text_light}}
            ref="viewShot"
            options={{
              format: 'png',
              quality: 1,
              result: 'data-uri',
            }}>
            <View style={{marginHorizontal: 10, paddingBottom: 30}}>
              <Image
                source={logoComprovante}
                style={{
                  height: 220,
                  width: 160,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  flex: 1,
                  marginTop: -30,
                }}
              />

              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: -40}]}>
                {title}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.fontDefault, {fontSize: 15}]}>
                {dados.complementos.data_transacao}
              </Text>
              <Text allowFontScaling={false} style={[theme.h3]}>
                Valor pago
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {fontSize: 30, marginTop: 0}]}>
                {(dados.formated_currency
                  ? dados.formated_currency.replace('-', '')
                  : null) || dados.valor_transacao}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: 30}]}>
                Linha digitável
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 0}]}>
                {dados.boleto.linha_digitavel}
              </Text>
              <View style={{marginTop: hp('8%')}}>
                <View style={{borderWidth: 1, borderStyle: 'dashed'}} />
              </View>
              <Text
                allowFontScaling={false}
                style={[
                  theme.centerAll,
                  theme.fontDefault,
                  {
                    color: '#8d8d8d',
                    fontSize: 16,
                    marginTop: 10,
                  },
                ]}>
                Autenticação de segurança
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  theme.centerAll,
                  theme.fontDefault,
                  {
                    color: '#8d8d8d',
                    fontSize: 16,
                  },
                ]}>
                {dados.id.toString() +
                  dados.conta.id.toString() +
                  dados.boleto.id.toString()}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  theme.centerAll,
                  theme.fontDefault,
                  {
                    color: '#8d8d8d',
                    fontSize: 16,
                  },
                ]}>
                Pagprime Bank - 30.944.783/0001-22
              </Text>
            </View>
          </ViewShot>
          <View style={{paddingTop: 25}}>
            <TouchableOpacity
              onPress={() => this.capture()}
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
                <AntDesign size={22} name={'sharealt'} color={'#fff'} />{' '}
                Compartilhar
              </H3>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.goBack()}>
            <Text
              allowFontScaling={false}
              style={[
                theme.centerAll,
                {
                  paddingTop: 0,
                  textDecorationLine: 'underline',
                },
                theme.h3,
              ]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
    return (
      <Container>
        <Header
          noShadow
          style={{
            backgroundColor: gradientBackgroundBase,
            marginTop: Platform.OS === 'ios' ? 0 : 24,
          }}>
          <Left>
            <TouchableOpacity onPress={() => this.goBack()}>
              <AntDesign
                name={'arrowleft'}
                size={35}
                color={defaultTextColor}
              />
            </TouchableOpacity>
          </Left>
          <Body />
          <Right />
        </Header>
        <Content scrollEnabled={true} padder style={[Style.generalViews]}>
          <ViewShot
            style={{backgroundColor: gradientBackgroundBase}}
            ref="viewShot"
            options={{
              format: 'png',
              quality: 1,
              result: 'data-uri',
            }}>
            <StatusBar translucent backgroundColor="transparent" />

            <Text
              allowFontScaling={false}
              style={[Style.sendTitle, {fontSize: 23}]}>
              {title}
            </Text>

            <View style={[Style.comprovantCard, {marginTop: 30}]}>
              <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                <Text
                  allowFontScaling={false}
                  style={[Style.sendBankName, {flex: 0.3}]}>
                  Valor
                </Text>
                <Text
                  Input
                  editable={false}
                  style={[Style.inputSearch, {flex: 1}]}
                  value={dados.formated_currency}
                />
              </View>
              <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                <Text
                  allowFontScaling={false}
                  style={[Style.sendBankName, {flex: 0.3}]}>
                  Número do boleto
                </Text>
                <Text
                  Input
                  editable={false}
                  multiline={true}
                  numberOfLines={4}
                  style={[Style.inputSearch, {flex: 1, height: 70}]}
                  value={dados.boleto.linha_digitavel}
                />
              </View>
              <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                <Text
                  allowFontScaling={false}
                  style={[Style.sendBankName, {flex: 0.3}]}>
                  Data do pagamento
                </Text>
                <Text
                  Input
                  editable={false}
                  style={[Style.inputSearch, {flex: 1}]}
                  value={dados.complementos.data_transacao}
                />
              </View>

              <View style={Style.clearFix} />
            </View>
            <View style={[Style.comprovantCard, {marginTop: 30}]}>
              <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                <Text
                  allowFontScaling={false}
                  style={[Style.sendBankName, {flex: 0.3}]}>
                  Situação
                </Text>
                <Text
                  Input
                  editable={false}
                  style={[Style.inputSearch, {flex: 1}]}
                  value={dados.boleto.status}
                />
              </View>
              <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                <Text
                  allowFontScaling={false}
                  style={[Style.sendBankName, {flex: 0.3}]}>
                  Autorização
                </Text>
                <Text
                  Input
                  editable={false}
                  style={[Style.inputSearch, {flex: 1}]}
                  value={dados.complementos.remote_transaction_id}
                />
              </View>
              <View style={Style.clearFix} />
            </View>
            <View style={Style.clearFix} />
          </ViewShot>
        </Content>
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{backgroundColor: '#1C1C1C'}}
          position="bottomRight"
          onPress={() => this.capture()}>
          <AntDesign
            style={{
              color: '#FFF',
              fontSize: 25,
              paddingTop: Platform.OS === 'ios' ? 20 : 0,
              paddingRight: 4,
            }}
            name="sharealt"
          />
        </Fab>
      </Container>
    );
  }
}

export default BilletReceipt;

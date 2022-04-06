import React, {Component} from 'react';
import {
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import Style from '../../style/style';
import {
  Fab,
  Content,
  Container,
  CardItem,
  Text,
  View,
  H3,
  Left,
  Body,
  Right,
} from 'native-base';
import {
  cor_fundo,
  text_light,
  defaultTextColor,
  gradientBackgroundBase,
  lightButton,
} from '../../style/pallet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../style/theme';
import {Logo} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {Helpers} from '../../components/helpers';
import {logoComprovante} from '../../style/pallet';

class Devolution extends Component {
  state = {loading: false};

  constructor(props) {
    super(props);
    const {title, dados, goBack} = this.props;
    this.dados = dados;
    this.title = title;
    this.goBack = goBack;
    console.log(dados);
  }

  toUpper(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');
  }

  async shareFile(uri) {
    if (Platform.OS !== 'ios') {
      await Share.open({
        title: 'Compartilhar comprovante',
        message: 'Este é o meu comprovante de devolução EsgBank!',
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
      await this.shareFile(uri);
    });
  }

  render() {
    const {title, dados} = this;
    return (
      <Container>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Content scrollEnabled={true} padder>
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
                {dados.observacao}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.fontDefault, {fontSize: 15}]}>
                {dados.complementos.data_transacao}
              </Text>
              <Text allowFontScaling={false} style={[theme.h3]}>
                Valor da transferência
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {fontSize: 30, marginTop: 0}]}>
                {dados.formated_currency || dados.valor_transacao}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: 10}]}>
                Enviado para
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 0}]}>
                {Helpers.toTitleCase(dados.complementos.nome_receptor_completo)}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                {dados.complementos.documento}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: 10}]}>
                Dados da conta
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                Agência:{' '}
                {dados.complementos.agencia.toString().padStart(4, '0')} /
                conta: {dados.complementos.conta.toString()}-
                {dados.complementos.conta_digito.toString()}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                Banco: {dados.complementos.nome_instituicao}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: 10}]}>
                Motivo devolução
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                {dados.observacao}
              </Text>
              <View style={{marginTop: hp('10%')}}>
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
                  dados.id_tipo_transacao.toString() +
                  dados.id_usuario_transacao.toString() +
                  dados.conta.id.toString() +
                  dados.complementos.id.toString()}
              </Text>

              <Text
                allowFontScaling={false}
                style={[
                  theme.centerAll,
                  theme.fontDefault,
                  {color: '#8d8d8d', fontSize: 16},
                ]}>
                Pagprime Bank - 30.944.783/0001-22
              </Text>
            </View>
          </ViewShot>
          <View style={{paddingTop: 15}}>
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
              <H3 style={[theme.centerAll, theme.h3_light]}>
                <AntDesign size={22} name={'sharealt'} color={'#fff'} />{' '}
                Compartilhar
              </H3>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => console.log(this.props.goBack())}>
            <Text
              allowFontScaling={false}
              style={[
                theme.centerAll,
                {paddingTop: 0, textDecorationLine: 'underline'},
                theme.h3,
              ]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

export default Devolution;

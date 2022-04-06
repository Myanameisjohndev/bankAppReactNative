import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from '../../components/common/Loading';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Style from '../../style/style';
import TextInputMask from 'react-native-masked-text/lib/text-input-mask';
import {setBilletInfo} from '../../store/billet';
import {AlertHelper} from '../../components/AlertHelper';
import {
  Header,
  Right,
  Left,
  Body,
  Container,
  Content,
  H1,
  H3,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  cor_fundo,
  darkButton,
  defaultTextColor,
  degrade_primario,
  gradientBackgroundBase,
  lightButton,
  logoComprovante,
  text_light,
} from '../../style/pallet';
import theme from '../../style/theme';
import {Helpers} from '../../components/helpers';
import json from '../../../package.json';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ViewShot from 'react-native-view-shot';
import {log} from 'react-native-reanimated';

class BilletInfo extends Component {
  state = {
    loading: true,
    data: null,
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const {navigation, billet} = this.props;
    if (typeof billet === 'string') {
      AlertHelper.show('error', 'Oops', billet);
      this.setState({loading: false});
      navigation.navigate('Pay');
      return false;
    }
    this.setState({data: billet});
    this.setState({loading: false});
  }

  async payNow() {
    const {setBilletInfo, billet, navigation} = this.props;
    this.setState(
      {loading: true},
      async function () {
        for (const ele of Object.keys(billet)) {
          if (billet[ele] === null) continue;
          await setBilletInfo(ele, billet[ele].toString().toUpperCase());
        }

        await setBilletInfo(
          'digitable',
          navigation.getParam('digitable').replace(/\D+/g, ''),
        );

        let valor_atualizado = parseFloat(
          parseFloat(billet.valor_atualizado).toFixed(2),
        );
        let maximo = billet.valor_maximo
          ? parseFloat(parseFloat(billet.valor_maximo).toFixed(2))
          : 0;
        let minimo = billet.valor_minimo
          ? parseFloat(parseFloat(billet.valor_minimo).toFixed(2))
          : 0;

        console.log(billet);

        if (parseFloat(valor_atualizado) == 0) {
          AlertHelper.show(
            'error',
            'Valor não permitido',
            'valor atualizado não pode ser zero.',
          );
        }
        if (parseFloat(maximo) !== 0 && valor_atualizado > maximo) {
          AlertHelper.show(
            'error',
            'Valor não permitido',
            'você está informando um valor acima do permitido.',
          );
        } else if (parseFloat(minimo) !== 0 && valor_atualizado < minimo) {
          AlertHelper.show(
            'error',
            'Valor não permitido',
            'você está informando um valor abaixo do permitido.',
          );
        } else {
          this.props.navigation.navigate('security', {after: 'billet'});
        }
        this.setState({loading: false});
      }.bind(this),
    );
  }

  render() {
    if (this.state.loading || !this.state.data) return <Loading />;
    const {data} = this.state;
    console.log(data);
    return (
      <Container>
        <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
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
        <Content scrollEnabled={true} style={[{marginHorizontal: 17}]}>
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
                Dados do boleto
              </Text>
              {this.state.data.nome_pagador && (
                <Text
                  allowFontScaling={false}
                  style={[
                    theme.h3,
                    {
                      color: '#000',
                      fontSize: 20,
                      marginTop: 0,
                    },
                  ]}>
                  {this.state.data.banco}
                </Text>
              )}
              <Text
                allowFontScaling={false}
                style={[
                  theme.h3,
                  {
                    color: '#000',
                    fontSize: 20,
                    marginTop: 0,
                  },
                ]}>
                {this.state.data.receptor}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  theme.h3,
                  {
                    color: '#000',
                    fontSize: 20,
                    marginTop: 0,
                  },
                ]}>
                {this.state.data.data_vencimento}
              </Text>

              <Text allowFontScaling={false} style={[theme.h3]}>
                Valor
              </Text>
              {console.log(data.valor_minimo)}
              <TextInputMask
                allowFontScaling={false}
                type={'money'}
                editable={
                  (data.valor_minimo ||
                    data.valor_maximo ||
                    parseFloat(data.valor_minimo) == 0 ||
                    parseFloat(data.valor_maximo) == 0) &&
                  parseFloat(data.valor_maximo) !==
                    parseFloat(data.valor_minimo)
                }
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: '',
                }}
                keyboardType={'number-pad'}
                placeholder="R$ 10,00"
                placeholderTextColor={'#000'}
                style={
                  (data.valor_minimo ||
                    data.valor_maximo ||
                    parseFloat(data.valor_minimo) == 0 ||
                    parseFloat(data.valor_maximo) == 0) &&
                  parseFloat(data.valor_maximo) !==
                    parseFloat(data.valor_minimo)
                    ? [theme.input, {color: '#000'}, {textAlign: 'center'}]
                    : [
                        Style.inputSearch,
                        {
                          borderRadius: 0,
                          backgroundColor: '#FFF',
                          paddingLeft: 0,
                          fontSize: 28,
                          marginLeft: 0,
                          borderBottomWidth: 0,
                          paddingHorizontal: 0,
                          elevation: 0,
                          opacity: 1,
                          textAlign: 'left',
                        },
                        {color: '#000'},
                      ]
                }
                value={data.valor_atualizado}
                onChangeText={(valor_atualizado) => {
                  valor_atualizado = valor_atualizado
                    .replace('R$ ', '')
                    .replace('.', '')
                    .replace(',', '.');
                  this.setState((data) => {
                    let retorno = data.data;
                    retorno.valor_atualizado = valor_atualizado;
                    return retorno;
                  });
                }}
              />

              {this.state.data.nome_pagador && (
                <Text
                  allowFontScaling={false}
                  style={[theme.h3, {marginTop: 10}]}>
                  Dados do pagador
                </Text>
              )}
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 0}]}>
                {Helpers.toTitleCase(this.state.data.nome_pagador)}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                {this.state.data.documento_pagador}
              </Text>
            </View>
          </ViewShot>
          <TouchableOpacity
            onPress={() => this.payNow()}
            disabled={this.state.loading}
            style={[
              this.state.loading ? theme.buttonDisabled : theme.buttonDark,
              theme.centerAll,
              {
                marginTop: 0,
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
            <H3
              allowFontScaling={false}
              style={[theme.centerAll, theme.h3_light]}>
              Confirmar
            </H3>
          </TouchableOpacity>
          <View style={{height: 15}} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {billet: state.billet};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setBilletInfo}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BilletInfo);

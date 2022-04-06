import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Style from '../../style/style';
import {Fab, Content, Container, CardItem, Text, View, H3} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  cor_fundo,
  defaultTextColor,
  gradientBackgroundBase,
  lightButton,
  whiteLabel,
  text_light,
  degrade_secundario,
} from '../../style/pallet';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import theme from '../../style/theme';
import {Helpers} from '../../components/helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import json from './../../../package.json';
import {logoComprovante} from '../../style/pallet';

class TransferSend extends Component {
  state = {activeShare: true, imagem: null};

  constructor(props) {
    super(props);
    const {title, dados, goBack} = this.props;
    this.dados = dados;
    this.title = title;
    this.goBack = goBack;
  }

  async shareFile(uri) {
    if (Platform.OS !== 'ios') {
      await Share.open({
        title: 'Compartilhar comprovante',
        message: 'Este é o meu comprovante de transferência ' + whiteLabel,
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
              {console.log(dados)}
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
                Enviado de
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 0}]}>
                {Helpers.toTitleCase(dados.conta.usuario.pessoa.nome)}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                {dados.conta.usuario.cpf || dados.conta.usuario.cnpj}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {color: '#000', fontSize: 20, marginTop: 2}]}>
                Banco: {json.name}
              </Text>
              <Text
                allowFontScaling={false}
                style={[theme.h3, {marginTop: 10}]}>
                Para
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
          <View style={{paddingTop: 0}}>
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
                {paddingTop: 0, textDecorationLine: 'underline'},
                theme.h3,
              ]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
    // return (
    //     <Container>
    //         <Header noShadow style={{
    //             backgroundColor: gradientBackgroundBase,
    //             marginTop: Platform.OS === 'ios' ? 0 : 24
    //         }}>
    //             <Left>
    //                 <TouchableOpacity onPress={() => this.goBack()}>
    //                     <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
    //                 </TouchableOpacity>
    //             </Left>
    //             <Body />
    //             <Right />
    //         </Header>
    //         <StatusBar
    //             translucent
    //             backgroundColor={gradientBackgroundBase}
    //         />
    //         <Content scrollEnabled={true} padder style={[Style.generalViews]}>
    //             <ViewShot style={{backgroundColor: gradientBackgroundBase}} ref="viewShot" options={{
    //                 format: "png",
    //                 quality: 1,
    //                 result: 'data-uri'
    //             }}>
    //                 <Text allowFontScaling={false} style={[Style.sendTitle, {fontSize: 23}]}>
    //                     {title}
    //                 </Text>
    //                 <Text allowFontScaling={false} style={[Style.defaultFont, Style.centerAll, {fontSize: 18, color: '#fff'}]}>
    //                     {dados.complementos.data_transacao}
    //                 </Text>
    //
    //                 <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                     Valor
    //                 </Text>
    //                 <TextInput
    //                     editable={false}
    //                     style={[Style.inputSearch, {flex: 1}]}
    //                     value={dados.formated_currency || dados.valor_transacao}
    //                 />
    //                 <View style={[Style.comprovantCard, {marginTop: 30}]}>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3, flexDirection: 'row'}]}>
    //                             PPBank
    //                         </Text>
    //                         <Text allowFontScaling={false} style={[Style.small, Style.centerAll]}>
    //                             Origem
    //                         </Text>
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Nome
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.usuario_transacao.pessoa.nome}
    //                         />
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Agência
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={'0001'}
    //                         />
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Conta
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.conta.id.toString().padStart(12, '0')}
    //                         />
    //                     </View>
    //                     <View style={Style.clearFix} />
    //                 </View>
    //                 <View style={[Style.comprovantCard, {marginTop: 30}]}>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3, flexDirection: 'row'}]}>
    //                             {dados.complementos.nome_instituicao}
    //                         </Text>
    //                         <Text allowFontScaling={false} style={[Style.small, Style.centerAll]}>
    //                             Destino
    //                         </Text>
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Nome
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.complementos.nome_receptor_completo}
    //                         />
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Agência
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.complementos.agencia.toString().padStart(4, '0')}
    //                         />
    //                     </View>
    //                     <View style={{flexDirection: 'row', marginHorizontal: '5%'}}>
    //                         <View style={{flex: 0.7}}>
    //                             <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                                 Conta
    //                             </Text>
    //                             <TextInput
    //                                 editable={false}
    //                                 style={[Style.inputSearch, {flex: 1}]}
    //                                 value={dados.complementos.conta.toString()}
    //                             />
    //                         </View>
    //                         <View style={{flex: 0.4}}>
    //                             <Text allowFontScaling={false} style={[Style.sendBankName, {flex: 0.3}]}>
    //                                 Digito
    //                             </Text>
    //                             <TextInput
    //                                 editable={false}
    //                                 style={[Style.inputSearch, {flex: 1}]}
    //                                 value={dados.complementos.conta_digito.toString()}
    //                             />
    //                         </View>
    //                     </View>
    //                     <View style={Style.clearFix} />
    //                 </View>
    //             </ViewShot>
    //         </Content>
    //         <Fab
    //             active={this.state.activeShare}
    //             direction="up"
    //             containerStyle={{}}
    //             style={{backgroundColor: '#1C1C1C'}}
    //             position="bottomRight"
    //             onPress={() => this.capture()}>
    //             <AntDesign style={{
    //                 color: '#FFF',
    //                 fontSize: 25,
    //                 paddingTop: (Platform.OS === 'ios') ? 0 : 0,
    //                 paddingRight: 4
    //             }} name="sharealt" />
    //         </Fab>
    //     </Container>
    // );
  }
}

export default TransferSend;

import React, {Component} from 'react';
import {TouchableOpacity, StatusBar, Image} from 'react-native';
import {
  Fab,
  Content,
  Container,
  CardItem,
  Text,
  View,
  H3,
  Left,
  Right,
  Body,
  Header,
} from 'native-base';
import ViewShot from 'react-native-view-shot';
import {logoComprovante} from '../../style/pallet';
import {cor_fundo} from '../../style/pallet';

class PaymentReceived extends Component {
  constructor(props) {
    super(props);
    const {title, dados, goBack} = this.props;
    this.dados = dados;
    this.title = title;
    this.goBack = goBack;
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
            style={{backgroundColor: cor_fundo}}
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
            </View>
          </ViewShot>
        </Content>
      </Container>
    );
    // return (
    //     <Container>
    //         <Header noShadow  style={{backgroundColor: gradientBackgroundBase, marginTop: Platform.OS === 'ios' ? 0 : 24}}>
    //             <Left>
    //                 <TouchableOpacity onPress={() => this.goBack()}>
    //                     <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
    //                 </TouchableOpacity>
    //             </Left>
    //             <Body />
    //             <Right />
    //         </Header>
    //         <Content scrollEnabled={true} padder style={[Style.generalViews]}>
    //             <StatusBar
    //                 translucent
    //                 backgroundColor="transparent"
    //             />
    //             <Text style={[Style.sendTitle, {fontSize: 23}]}>
    //                 {title}
    //             </Text>
    //             <View style={[Style.comprovantCard, {marginTop: 30}]}>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Você recebeu
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.formated_currency}
    //                         />
    //                     </View>
    //                     <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
    //                         <Text style={[Style.sendBankName, {flex: 0.3}]}>
    //                             Data do recebimento
    //                         </Text>
    //                         <TextInput
    //                             editable={false}
    //                             style={[Style.inputSearch, {flex: 1}]}
    //                             value={dados.complementos.data_transacao}
    //                         />
    //                     </View>
    //
    //                     <View style={Style.clearFix} />
    //                 </View>
    //         </Content>
    //     </Container>
    // );
  }
}

export default PaymentReceived;

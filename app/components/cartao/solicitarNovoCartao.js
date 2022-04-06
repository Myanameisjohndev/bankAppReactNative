import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Fontisto from 'react-native-vector-icons/Fontisto';
import { SafeAreaView } from 'react-navigation';
import { defaultTextColor, degrade_primario, lightButton } from "../../style/pallet";
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../style/theme';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { connect } from "react-redux";
import { solicitarNovoCartaoVirtual, listarCartaoVirtual } from '../../store/cards'
import { bindActionCreators } from "redux";


import {
  Header,
  Right,
  Left,
  Body,
  Container,
  Content,
  H1,
  List,
  ListItem,
  Badge,
  Input,
  H3
} from "native-base";

class SolicitarNovoCartao extends Component {

  state = {
    alert: {},
    showAlertNewCard: false,
    showAlertSuccess: false,
    showAlertFail: false,
    statusRequisicao: true,
    response: '',
    resultCartao: null
  }

  constructor(props) {
    super(props)
    this.pedirCartao = this.pedirCartao.bind(this)

  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  pedirCartao() {
    this.setState(data => {
      console.log(data)
      data.alert = {
        title: 'Atenção',
        subtitle: 'Solicitar um novo cartão',
        theme: 'info',
        icone: 'creditcard',
      };
      data.showAlertNewCard = true;
      return data;
    });
  }

  async solicitarCartaoVirtual(params) {
    this.setState({showAlertNewCard: false})
    const { solicitarNovoCartaoVirtual, listarCartaoVirtual } = this.props
    const listarCartao = await listarCartaoVirtual()

    //if(listarCartao)
    const status = await solicitarNovoCartaoVirtual()
    
    console.log(status)
    if (status.status === 'error') {
      this.setState(data => {
        console.log(data)
        data.alert = {
          title: 'Atenção',
          subtitle: 'Seu cartão virtual não foi gerado!',
          theme: 'danger',
          icone: 'close',
        };
        data.showAlertFail = true;
        data.response = false
        return data;
      });
    }

    if (status.status === 'success') {
      this.setState(data => {
        //console.log(data)
        data.alert = {
          title: 'Atenção',
          subtitle: 'Seu cartão virtual foi gerado!',
          theme: 'success',
          icone: 'creditcard',
          button: 'success'
        };
        data.showAlertFail = true;
        data.response = false
        return data;
      });

      this.setState({resultCartao: status})
    }
  }

   async solicitarCartaoFisico(){
    this.setState({showAlertNewCard: false})
    const { solicitarNovoCartaoVirtual } = this.props
    const status = await solicitarNovoCartaoVirtual(true)
    
    if (status.status === 'error') {
      this.setState(data => {
        console.log(data)
        data.alert = {
          title: 'Atenção',
          subtitle: 'Seu cartão Fisico não foi gerado!',
          theme: 'danger',
          icone: 'close',
        };
        data.showAlertFail = true;
        data.response = false
        return data;
      });
    }
  }


  alertNewCard() {
    this.setState({ showAlertNewCard: false });
  }
  alertCloseSuccess() {
    this.setState({ showAlertSuccess: false });
  }
  alertCloseFail() {
    this.setState({ showAlertFail: false });
    //console.log(this.state.resultCartao.data, 'result')
    this.props.navigation.navigate('CartaoVirtual', { new_card: this.state.resultCartao.data })
  }


  render() {

    return (
      <SafeAreaView style={styles.container}>
        <Header style={[{ height: 100, backgroundColor: degrade_primario }]}>
          <Left>
          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => this.props.navigation.navigate('GestaoCartao', {onGoBack: () => this.refresh()})}>
            {/* <TouchableOpacity style={{ marginTop: 20 }} onPress={() => this.props.navigation.goBack()}> */}
              <AntDesign name={'left'} size={35} color={defaultTextColor} />
            </TouchableOpacity>
          </Left>
          <Body>
            <H1 allowFontScaling={false} style={[theme.h1, { marginTop: 15 }, { marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0 }]}>
              Solicitar cartão
            </H1>
          </Body>
        </Header>

        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />

        <View style={styles.containerCartao}>
          <View style={styles.imgFundo}>
            <Image
              source={require('../../../assets/img/card2.png')}
              style={styles.imagem} />
          </View>
          <Text style={styles.cartaoText}>Você não tem solicitações ativas</Text>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} onPress={this.pedirCartao}>
            <Text style={styles.buttonText}>PEDIR CARTÃO ADICIONAL</Text>
          </TouchableOpacity>
        </View>





        <View>
          <SCLAlert
            show={this.state.showAlertNewCard}
            onRequestClose={this.alertNewCard.bind(this)}
            theme={this.state.alert.theme || 'info'}
            title={this.state.alert.title || ''}
            subtitle={this.state.alert.subtitle || ''}
            headerIconComponent={
              this.state.alert.icon || (
                <AntDesign
                  name={this.state.alert.icone || 'info'}
                  size={40}
                  color={'#ffffff'}
                />
              )
            }>
            <SCLAlertButton
              theme={'info'}
              onPress={() => this.solicitarCartaoVirtual(false)}
            >
              Cartão virtual
            </SCLAlertButton>
            <SCLAlertButton
              theme={'info'}
              onPress={() => this.solicitarCartaoFisico(false)}
            >
              Cartão físico
            </SCLAlertButton>
          </SCLAlert>

          <SCLAlert
              show={this.state.showAlertSuccess}
              onRequestClose={this.alertCloseSuccess.bind(this)}
              theme={this.state.alert.theme || 'info'}
              title={this.state.alert.title || ''}
              subtitle={this.state.alert.subtitle || ''}
              headerIconComponent={
                this.state.alert.icon || (
                  <AntDesign
                    name={this.state.alert.icone || 'info'}
                    size={35}
                    color={'#ffffff'}
                  />
                )
              }>
              <SCLAlertButton
                theme={'danger'}
                onPress={() => this.alertCloseSuccess(this)}>
                OK
              </SCLAlertButton>
            </SCLAlert>


            <SCLAlert
              show={this.state.showAlertFail}
              onRequestClose={this.alertCloseFail.bind(this)}
              theme={this.state.alert.theme || 'info'}
              title={this.state.alert.title || ''}
              subtitle={this.state.alert.subtitle || ''}
              headerIconComponent={
                this.state.alert.icon || (
                  <AntDesign
                    name={this.state.alert.icone || 'info'}
                    size={35}
                    color={'#ffffff'}
                  />
                )
              }>
              <SCLAlertButton
                theme={this.state.alert.button || 'info'}
                onPress={() => this.alertCloseFail(this)}>
                OK
              </SCLAlertButton>
            </SCLAlert>

        </View>

      </SafeAreaView>
    )

  }
}

const mapStateToProps = state => {
  //console.log('state', state)
  return {
    response: state.response
  };
}
  ;


const mapDispatchToProps = dispatch => {

  return bindActionCreators({ solicitarNovoCartaoVirtual, listarCartaoVirtual }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SolicitarNovoCartao);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  imgFundo: {
    opacity: 0.3,
  },
  imagem: {
    height: 200,
    width: 200
  },
  containerCartao: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2
  },
  cartaoText: {
    color: "#808080",
    fontSize: 20
  },
  containerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#808080",
    width: "80%",
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: "#808080"
  }


})
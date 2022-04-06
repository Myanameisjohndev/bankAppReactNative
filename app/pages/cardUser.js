import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Body,
  Container,
  Content,
  H1,
  Header,
  Left,
  List,
  Text,
  ListItem,
  View,
  H3,
  Footer,
  FooterTab,
  Right,
} from 'native-base';
import {
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  back_cartao,
  defaultTextColor,
  degrade_primario,
  front_cartao,
  frontCartao,
  lightButton,
  logoComprovante,
} from '../style/pallet';
import theme from '../style/theme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { Linking } from 'react-native';
import CreditCard from 'react-native-credit-card';
import { updateStatusCardStore } from '../store/cards';

class CardUser extends Component {
  state = {
    loading: false,
    showAlertBlockCard: false,
    showAlertPassword: false,
    showAlertSuccess: false,
    alert: {},
    id_cartao: '0',
    status_card: false,
    fisicoOuVirtual: '',
  };
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.card = this.props.navigation.getParam('card');
    console.log('abaixo estado cartao fis ou virt');

    this.card.id_usuario = this.props.account.conta.id_usuario;
    this.state.status_card = this.card.bloqueado;
    this.state.id_cartao = this.card.id_cartao;
    //this.props.account.conta.id_usuario;
  }
  alertCloseCard() {
    this.setState({ showAlertBlockCard: false });
  }
  alertClosePassword() {
    this.setState({ showAlertPassword: false });
  }
  alertCloseSuccess() {
    this.setState({ showAlertSuccess: false });
  }

  render() {
    const { card } = this;
    return (
      <Container>
        <Header style={[{ height: 100, backgroundColor: degrade_primario }]}>
          <Left>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => this.props.navigation.navigate('Dashboard')}>
              <AntDesign name={'left'} size={35} color={defaultTextColor} />
            </TouchableOpacity>
          </Left>
          <Body>
            <H1
              allowFontScaling={false}
              style={[
                theme.h1,
                { marginTop: 15 },
                { marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0 },
              ]}>
              Cartão #{card.id}
            </H1>
          </Body>
        </Header>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <Content>
          <View
            style={{
              flex: 1,
              paddingBottom: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={[theme.h3, theme.centerAll, { marginHorizontal: 10 }]}>
              Dados do cartão
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <CreditCard
              type={'elo'}
              imageFront={front_cartao}
              imageBack={back_cartao}
              shiny={false}
              bar={false}
              focused={true}
              number={
                this.card.virtual
                  ? `${String(this.card.numero_cartao)}`
                  : `************${String(this.card.ultimos_digitos)}`
              }
              name={this.card.nome_impresso}
              expiry={this.card.data_expiracao}
              cvc={this.card.cvv}
            />
          </View>
          <View style={{ height: 15 }} />
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => this.blockCard()}
              // disabled={this.state.status_card}
              style={[theme.buttonDark, theme.centerAll]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[theme.centerAll, { marginTop: 8 }]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3
                allowFontScaling={false}
                style={[theme.centerAll, theme.h3_light]}>
                {this.state.status_card == true
                  ? 'Desbloquear cartão'
                  : 'Bloquear cartão'}
              </H3>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('NewPasswordCard', {
                  new_card: this.card,
                })
              }
              style={[theme.buttonDark, theme.centerAll]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[theme.centerAll, { marginTop: 8 }]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3
                allowFontScaling={false}
                style={[theme.centerAll, theme.h3_light]}>
                Alterar senha
              </H3>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ShowSenhaCartao', {
                  new_card: this.card,
                })
              }
              style={[theme.buttonDark, theme.centerAll]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[theme.centerAll, { marginTop: 8 }]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3
                allowFontScaling={false}
                style={[theme.centerAll, theme.h3_light]}>
                Visualizar senha
              </H3>
            </TouchableOpacity>
          </View>
          <View>
            <SCLAlert
              show={this.state.showAlertBlockCard}
              onRequestClose={this.alertCloseCard.bind(this)}
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
              {this.state.status_card == true && (
                <SCLAlertButton
                  theme={this.state.alert.theme || 'info'}
                  onPress={() => this.bloquearCartao(false)}>
                  Desbloquear
                </SCLAlertButton>
              )}
              {this.state.status_card == false && (
                <SCLAlertButton
                  theme={'danger'}
                  onPress={() => this.bloquearCartao(true)}>
                  Bloquear
                </SCLAlertButton>
              )}
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
                theme={'success'}
                onPress={() => this.alertCloseSuccess(this)}>
                OK
              </SCLAlertButton>
            </SCLAlert>
          </View>
          <View />
        </Content>
      </Container>
    );
  }

  blockCard() {
    this.setState(data => {
      data.alert = {
        title: 'Atenção ?',
        subtitle: 'O que deseja fazer com o cartão?',
        theme: 'danger',
        icone: 'closecircle',
      };
      data.showAlertBlockCard = true;
      return data;
    });
    this.setState({ loading: false });
    return false;
  }
  updatePassword() {
    this.setState({ showAlertPassword: true });
  }
  bloquearCartao(bool) {
    this.setState({ showAlertBlockCard: false });
    //this.state.status_card=bool;
    this.setState({ status_card: bool });
    this.updateStatusCardStore(bool);
  }

  async updateStatusCardStore(bool) {
    const { updateStatusCardStore } = this.props;
    this.setState({ loading: true });
    console.log('Boolean é igual a' + bool);
    console.log('Id cartão é igual a' + this.state.id_cartao);
    let result = await updateStatusCardStore(
      {
        id_cartao: this.state.id_cartao,
      },
      bool,
    );
    if (result.status === 'success') {
      this.setState(data => {
        data.alert = {
          title: 'Sucesso !',
          subtitle: 'Cartão atualizado com sucesso',
          theme: 'success',
          icone: 'closecircle',
        };
        data.showAlertSuccess = true;
        return data;
      });
    } else {
      this.setState(data => {
        data.alert = {
          title: 'Oops',
          subtitle: 'Erro ao atualizar status cartão',
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
    }
    this.setState({ loading: false });
  }
}

const mapStateToProps = state => {
  return {
    account: state.account ? state.account.data : null,
    bankSettings: state.bankSettings,
    favorites: state.favorites,
    banks: state.banks,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateStatusCardStore }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardUser);

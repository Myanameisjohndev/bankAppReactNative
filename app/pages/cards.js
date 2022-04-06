import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Image} from 'react-native';
import {
  Header,
  Right,
  Left,
  Body,
  Container,
  Content,
  H1,
  Text,
  List,
  ListItem,
  Badge,
  Input,
  H3,
  View,
} from 'native-base';
import {StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {defaultTextColor, degrade_primario, front_cartao, lightButton} from '../style/pallet';
import theme from '../style/theme';
import {cardsFetch} from '../store/cards';
import {banksFetch} from '../store/Banks';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Loading from '../components/common/Loading';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class Cards extends Component {
  state = {
    loading: true,
    value: null,
    cards: [],
    tipo_conta: 'corrente',
    showAlert: false,
    alert: {},
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
  }

  alertClose() {
    this.setState({showAlert: false});
  }

  async componentDidMount() {
    const {cardsFetch, banksFetch} = this.props;
    await cardsFetch();
    await banksFetch();
    this.setState({loading: false});
  }

  render() {
    const {cards} = this.props;
    if (this.state.loading) {
      return <Loading />;
    }
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
              Cartões
            </H1>
          </Body>
        </Header>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <Content padder={true}>
          {/* <Input
                        allowFontScaling={false}
                        disabled={this.state.loading}
                        placeholder={'Pesquise por nome ou CPF/CNPJ'}
                        onChangeText={(busca) => this.setState({busca})}
                        value={this.state.busca}
                        style={[theme.input, {height: 45, fontSize: 18}]}
                    /> */}
          <List>
            {cards &&
              Array.isArray(cards) &&
              cards.map(card => {
                return (
                  <ListItem
                    onPress={() =>
                      this.props.navigation.navigate('CardUser', {card: card})
                    }
                    Avatar>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Left style={{flex: 1}}>
                        <Image
                          source={front_cartao}
                          style={[
                            theme.centerAll,
                            {
                              resizeMode: 'contain',
                              width: 58,
                              height: 58,
                              marginLeft: 5,
                            },
                          ]}
                        />
                      </Left>

                      <Body
                        style={{
                          flex: 3,
                          textAlign: 'left',
                          fontSize: 18,
                          paddingLeft: 10,
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                          alignItems: 'flex-start',
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            theme.h3_no_margin,
                            {
                              fontSize: 14,
                              color: '#000000',
                              fontWeight: !card.virtual ? '900' : '100',
                            },
                          ]}>
                          Últimos dígitos
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[theme.h3_no_margin, {fontSize: 18}]}>
                          {card.virtual
                            ? `****${String(card.numero_cartao).slice(12, 16)}`
                            : `****${String(card.ultimos_digitos)}`}
                        </Text>

                        <Text
                          style={[
                            theme.h3_no_margin,
                            {
                              fontSize: 14,
                              color: '#000000',
                              fontWeight: !card.virtual ? '900' : '100',
                            },
                          ]}>
                          {card.virtual ? 'Cartão Virtual' : 'Cartão Físico'}
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                );
              })}
          </List>
          {/* <TouchableOpacity
                        onPress={() => this.setTedOrPix() }
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll, {marginTop: 40}
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Cadastrar Cartão
                        </H3>
                    </TouchableOpacity>


                    <SCLAlert
                        show={this.state.showAlert}
                        onRequestClose={this.alertClose.bind(this)}
                        theme={this.state.alert.theme || 'info'}
                        title={this.state.alert.title || ''}
                        subtitle={this.state.alert.subtitle || ''}
                        headerIconComponent={this.state.alert.icon ||
                        <AntDesign name={this.state.alert.icone || 'info'} size={35} color={'#ffffff'} />}
                    >
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={() =>this.props.navigation.replace('CreateFavoredPix') }>
                        Pix</SCLAlertButton>
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={() =>this.props.navigation.replace('CreateFavored') }
                        >Ted</SCLAlertButton>
                    </SCLAlert> */}
        </Content>
      </Container>
    );
  }

  setTedOrPix() {
    this.setState(data => {
      data.alert = {
        title: 'Ted ou Pix ?',
        subtitle: 'Informe se a conta é ted ou pix.',
        theme: 'default',
        icone: 'closecircle',
      };
      data.showAlert = true;
      return data;
    });
    this.setState({loading: false});
    return false;
  }
}

const mapStateToProps = state => {
  return {
    account: state.account ? state.account.data : null,
    bankSettings: state.bankSettings,
    favorites: state.favorites,
    cards: state.cards,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({cardsFetch, banksFetch}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cards);

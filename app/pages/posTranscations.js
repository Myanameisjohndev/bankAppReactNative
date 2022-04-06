import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from '../components/common/Loading';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Linking,
} from 'react-native';
import Style from '../style/style';
import {posTransactionFetch} from '../store/pos';
import {
  boxes,
  buttonBoxes,
  buttonTwoBoxes,
  defaultTextColor,
  degrade_primario,
  lightButton,
  valuesNegative,
  valuesPositive,
} from '../style/pallet';
import PTRView from 'react-native-pull-to-refresh';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CalendarPicker from 'react-native-calendar-picker';
import {
  Fab,
  Content,
  Container,
  Input,
  H3,
  Left,
  Right,
  Body,
  Header,
  H1,
  ListItem,
  List,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../style/theme';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Helpers} from '../components/helpers';
import TextInputMask from 'react-native-masked-text/lib/text-input-mask';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import DatePicker from 'react-native-datepicker';

class PosTransaction extends Component {
  state = {
    loading: true,
    data: {},
    data_atual: null,
    showModal: false,
    data_inicial: null,
    data_final: null,
    showAlert: false,
    alert: {},
    buttonShow: false,
    fistExecute: true,
  };

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  componentDidMount() {
    this.setState(
      {
        data_final: moment(new Date()).format('DD/MM/YYYY'),

        data_inicial: moment(new Date()).format('DD/MM/YYYY'),
      },
      this.load,
    );

  }

  constructor(props) {
    super(props);
    this.data_inicial = moment(new Date()).format('DD/MM/YYYY')

    this.onDateChange = this.onDateChange.bind(this);
  }

  async load() {
    const {posTransactionFetch} = this.props;

    const validar = this.validarConsulta();

    if (validar) {
      this.setState({loading: true});
      await posTransactionFetch(this.data_inicial, this.state.data_final);
      this.setState({loading: false});
    }
  }

  validarConsulta() {
    let title,
      subtitle = '';
    let error = 0;

    if (this.data_inicial == '' || this.state.data_final == '') {
      title = 'Data não permitida ';
      subtitle = 'Informe o intervalo de datas';
      error = 1;
    }

    if (
      (this.data_inicial.split(' ').length == 2 &&
        this.data_inicial.split(' ')[1].length != 5) ||
      (this.state.data_final.split(' ').length == 2 &&
        this.state.data_final.split(' ')[1].length != 5)
    ) {
      title = 'Data não permitida ';
      subtitle = 'Informe as horas corretamente . Exemplo : 10/04/2020 10:45';
      error = 1;
    }

    if (error == 1) {
      this.setState(data => {
        data.alert = {
          title: title,
          subtitle: subtitle,
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
      this.setState({loading: false});
      return false;
    }
    return true;
  }



  alertClose() {
    this.setState({showAlert: false});
  }

  onDateChange(date, type) {

    if (date === null) {
      this.setState({
        startDate: null,
        data_inicial: null,
        endDate: null,
        data_final: null,
      });
      return true;
    }
    if (type === 'END_DATE') {
      this.setState({
        endDate: date,

        data_final:
          date._i.day.toString().padStart(2, '0') +
          '/' +
          (date._i.month + 1).toString().padStart(2, '0') +
          '/' +
          date._i.year,
      });

    } else {

      this.data_inicial =  date._i.day.toString().padStart(2, '0') +'/' + (date._i.month + 1).toString().padStart(2, '0') +  '/' + date._i.year
      this.setState({
        startDate: date,
        data_inicial: this.data_inicial,
        endDate: null,
      });

    }

  }

  mostrarButton(){

      if(this.props.dataPos.length && this.state.buttonShow === false) this.setState({buttonShow: true})

  }

  render() {
    if (this.state.loading || !this.props.dataPos || !this.props.total) {
      return <Loading />;
    }
    const {dataPos, total, navigation, total_bruto} = this.props;
    this.mostrarButton()

    console.log(this.data_inicial, 'data inicial renderizada')
    console.log(this.state.data_final, 'data final renderizada')
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
                {
                  marginLeft: Platform.OS === 'ios' ? wp('-50%') : wp('-10%'),
                },
              ]}>
              Extrato Vendas
            </H1>
          </Body>
        </Header>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <PTRView
          onRefresh={() => this.load()}
          style={[Style.generalViews, {flex: 1}]}>
          <Content padder scrollEnabled={false}>
            <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
              <TextInput
                style={[theme.input, {height: 45, fontSize: 20, marginRight: 5, textAlign: 'center', paddingLeft: 0}]}
                onFocus={() =>
                  this.setState({showModal: !this.state.showModal})
                }
                keyboardType={'number-pad'}
                allowFontScaling={false}
                value={this.data_inicial}
                type={'datetime'}
              />

              <TextInput
                style={[theme.input, {height: 45, fontSize: 18, marginLeft: 5, textAlign: 'center', paddingLeft: 0}]}
                onFocus={() =>
                  this.setState({showModal: !this.state.showModal})
                }
                keyboardType={'number-pad'}
                allowFontScaling={false}
                value={this.state.data_final}
                type={'datetime'}
              />

            </View>

            {this.state.buttonShow && (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View
                  style={
                    (theme.centerAll,
                    [
                      {
                        flexDirection: 'column',
                        marginBottom: 40,
                        marginTop: 20,
                      },
                    ])
                  }>
                  <View style={[{flexDirection: 'row'}, theme.centerAll]}>
                    <View
                      style={
                        ([],
                        {
                          height: 60,
                          width: 160,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#9e9e9e',
                          borderWidth: 2,
                          marginRight: 5,
                          borderRadius: 5,
                        })
                      }>
                      <Text
                        allowFontScaling={false}
                        style={{position: 'absolute', top: 0, left: 2}}>
                        Total Líquido:
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          theme.h1_dark,
                          {
                            fontSize: 23,
                            justifyContent: 'center',
                            marginTop: 15,
                          },
                        ]}>
                        {total}
                      </Text>
                    </View>

                    <View
                      style={
                        ([],
                        {
                          height: 60,
                          width: 160,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#9e9e9e',
                          borderWidth: 2,
                          marginLeft: 5,
                          borderRadius: 5,
                        })
                      }>
                      <Text
                        allowFontScaling={false}
                        style={{position: 'absolute', top: 0, left: 2}}>
                        Total Bruto:
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          theme.h1_dark,
                          {
                            fontSize: 23,
                            justifyContent: 'center',
                            marginTop: 15,
                          },
                        ]}>
                        {total_bruto}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {!this.state.buttonShow && (
                <View style={{opacity: 0.3}}>
                <Image
                    source={require('../../assets/img/extrato.png')}
                    style={ theme.centerAll[{
                    resizeMode: 'contain',


                    margin: 10
                    }]}/>
                      </View>
            )}






            <List>
              {dataPos.map(transacao => {
                return (
                  <ListItem onPress={() => null} avatar>
                    <Left>
                      <Text allowFontScaling={false} style={{marginTop: 8}}>
                        {this.getIcon(13)}
                      </Text>
                    </Left>
                    <Body>
                      <Text
                        allowFontScaling={false}
                        style={[theme.fontDefault]}>
                        {this.onlyFirstLetterUpper(
                          transacao.tipo_operacao.toString(),
                        )}
                      </Text>

                      <Text>{transacao.nome_estabelecimento}</Text>
                      <Text>{transacao.bandeira}</Text>
                    </Body>
                    <Right>
                      <Text
                        allowFontScaling={false}
                        style={{
                          alignSelf: 'flex-end',
                          color:
                            transacao.status === '1' || transacao.status === '0'
                              ? valuesPositive
                              : valuesNegative,
                          textDecorationLine:
                            transacao.status === '1' || transacao.status === '0'
                              ? null
                              : 'line-through',

                          fontSize: 17,
                        }}>
                        {transacao.valor_original}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          Style.homeListItemDT,
                          {
                            color:
                              transacao.status === '1' ||
                              transacao.status === '0'
                                ? valuesPositive
                                : valuesNegative,
                            textDecorationLine:
                              transacao.status === '1' ||
                              transacao.status === '0'
                                ? null
                                : 'line-through',
                          },
                        ]}>
                        {transacao.valor_total}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[theme.fontDefault, {fontSize: 14}]}
                        note>
                        {transacao.data_confirmacao}
                      </Text>
                    </Right>
                  </ListItem>
                );
              })}
            </List>

            <Modal isVisible={this.state.showModal}>
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <View
                  style={[
                    Style.generalViews,
                    {
                      backgroundColor: boxes,
                      width: '110%',
                      height: 380,
                    },
                  ]}>
                  <View>
                    <View
                      style={{
                        marginTop: 0,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                      }}>
                      <CalendarPicker
                        onDateChange={this.onDateChange}
                        startFromMonday={true}
                        weekdays={[
                          'Seg',
                          'Ter',
                          'Qua',
                          'Qui',
                          'Sex',
                          'Sab',
                          'Dom',
                        ]}
                        months={[
                          'Janeiro',
                          'Fevereiro',
                          'Março',
                          'Abril',
                          'Maio',
                          'Junho',
                          'Julho',
                          'Agosto',
                          'Setembro',
                          'Outubro',
                          'Novembro',
                          'Dezembro',
                        ]}
                        previousTitle="Anterior"
                        nextTitle="Próximo"
                        selectedDayColor="#4b0077"
                        allowRangeSelection={true}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: 1,
                        backgroundColor: lightButton,
                        marginTop: 3,
                      }}>
                      <TouchableOpacity
                        style={Style.loginRegister}
                        onPress={() => {
                          this.setState({
                            showModal: !this.state.showModal,
                          });
                          this.load();
                        }}>
                        <LinearGradient
                          colors={[buttonBoxes, defaultTextColor]}
                          start={{x: 0, y: 1}}
                          end={{x: 0, y: 0}}
                          locations={[1, 0, 0]}
                          style={Style.loginRegBack}>
                          <Text
                            allowFontScaling={false}
                            style={Style.loginNoAcc}>
                            Confirmar
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>

            <SCLAlert
              show={this.state.showAlert}
              onRequestClose={this.alertClose.bind(this)}
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
                theme={this.state.alert.theme || 'info'}
                onPress={this.alertClose.bind(this)}>
                Ok
              </SCLAlertButton>
            </SCLAlert>
          </Content>
        </PTRView>
      </Container>
    );
  }

  getIcon(id) {
    switch (id) {
      case 11:
        return <AntDesign name="sync" size={28} color="#a2db2f" />;
      case 1:
        return <AntDesign name="barcode" size={28} color="#a2db2f" />;
      case 3:
      case 9:
      case 10:
      case 8:
      case 5:
        return <AntDesign name="arrowup" size={28} color="red" />;
      case 2:
      case 7:
        return <AntDesign name="arrowdown" size={28} color="#a2db2f" />;
      case 13:
        return (
          <Fontisto name="shopping-pos-machine" size={28} color="#a2db2f" />
        );
    }
  }

  onlyFirstLetterUpper(string) {
    string = string.toString().toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getDescription(transacao) {
    switch (transacao.status) {
      case 'Enviada':
        try {
          return (
            'Enviado para ' +
            Helpers.toTitleCase(
              transacao.complementos.nome_receptor_completo.split(' ')[0],
            ) +
            ', banco ' +
            transacao.complementos.nome_instituicao
          );
        } catch (e) {
          return (
            'Enviado para ' +
            Helpers.toTitleCase(transacao.complementos.nome_receptor_completo) +
            ', banco ' +
            transacao.complementos.nome_instituicao
          );
        }
      case 'Recebida':
        return (
          'Recebido de ' +
          Helpers.toTitleCase(transacao.usuario_transacao.pessoa.nome)
        );
      case 'Pago':
        return (
          'Pagamento para ' +
          Helpers.toTitleCase(transacao.complementos.nome_receptor_completo)
        );
      default:
        return '';
    }
  }

  receiptOrNot(ted) {
    if (ted.tipo_transacao.id === 9) {
      this.setState(data => {
        data.alert = {
          title: 'Oops',
          subtitle: 'Taxas não possuem comprovante!',
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
      return false;
    }
    return true;
  }
}

const mapStateToProps = state => {

  return {
    history: state.history,
    dataPos: state.pos ? state.pos.data : null,
    total: state.pos ? state.pos.total : null,
    total_bruto: state.pos ? state.pos.total_bruto : null
  };
};
const mapDispatchToProps = dispatch => {

  return bindActionCreators({posTransactionFetch}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PosTransaction);

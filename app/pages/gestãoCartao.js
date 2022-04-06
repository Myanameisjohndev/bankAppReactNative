import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, Image } from 'react-native'
import { connect } from "react-redux";
import { cardsFetch, updateStatusCardStore, desbloquearPrimeiroCartao } from '../store/cards'
import { bindActionCreators } from "redux";
import Fontisto from 'react-native-vector-icons/Fontisto';
import PinView from 'react-native-pin-view';
import { defaultTextColor, darkButton, degrade_primario, lightButton } from '../style/pallet';
import theme from '../style/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from "react-native-rbs";
import Loading from "../components/common/Loading";
import Carousel from 'react-native-snap-carousel';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import Icon from 'react-native-vector-icons/MaterialIcons';

class gestaoCartao extends Component {

  state = {
    dadosCartao: [],
    loading: false,
    activeIndex: 0,
    carouselItems: [],
    showAlertBlockCard: false,
    showAlertPassword: false,
    showAlertSuccess: false,
    showAlertPrimeiroCartao: false,
    id_cartao: '0',
    alert: {},
    status_card: false,
    validarPrimeiroCartao: false,
    validarPrimeiroCartaoStatus: false,
    digitoCartao: null,
    limite_disponivel: 0,
    limite_total: 0

  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  pinView = React.createRef();

  constructor(props) {
    super(props)
    this.vetor
    this.backHandler = null
    this.isDashBoard = true



    this.menus = [
      /* { name: 'Alterar senha', key: '1', icone: 'key', rota: 'NewPasswordCard' }, */
      { name: 'Extrato', key: '2', icone: 'nav-icon-list-a', rota: 'cardHistory' },
     // { name: 'Solicitar Cartão', key: '3', icone: 'credit-card', rota: 'SolicitarNovoCartao' },
      { name: 'Minha senha', key: '4', icone: 'key', rota: 'SenhaCartao'},
      { name: 'Cartão virtual', key: '5', icone: 'cloud-up', rota: 'CartaoVirtual' }
    ]
  }


  async componentDidMount() {
    const { cardsFetch } = this.props;
    await cardsFetch();
    console.log(this.props.cards)
    this.setState(data => {
      data.status_card = this.props.cards[0].bloqueado,
        data.limite_total = this.props.cards[0].limite.limite,
        data.limite_disponivel = this.props.cards[0].limite.limite_disponivel
      data.validarPrimeiroCartao = this.props.cards[0].situacao === 'Pendente' ? false : true
      data.dadosCartao = this.props.cards[this.state.activeIndex]
    })

    this.vetor = this.props.cards
    this.vetor = this.props.cards.map(card => {
      return {
        title: card.nome_impresso,
        text: card.ultimos_digitos
      }
    })

    this.setState({ carouselItems: this.vetor })
    this.RBSheet.open()

  }

  componentWillUnmount() {
    //this.backHandler.remove();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.activeIndex !== prevState.activeIndex) {
      this.RBSheet.open()
    }
    this.RBSheet.open()
    this.isDashBoard = true

  }

  ListaMenus({ nomelist, icone, rota, props }) {
    //console.log(this.fecharModal)
    return (
      //<TouchableOpacity onPress={() => {
      //this.fecharModal(this.props, this.isDashBoard = false, this.tab = {rota})}}>
      <View style={styles.menuOpcaoRBSheet}>
        <View style={styles.menuOpcaoIconeRBSheet}>
          <Fontisto name={icone} size={28} color={'#696969'}></Fontisto>
        </View>
        <View style={styles.menuOpcaoContainerTextRBSheet}>
          <Text style={styles.menuOpcaoTextRBSheet}>{nomelist}</Text>
        </View>

      </View>
      //</TouchableOpacity>

    )
  }


  _renderItem({ item, index }) {
    //console.log(this.props)
    return (
      <View style={styles.containerImagemCartao}>
        <Image style={styles.imagemCartao} source={require('../../assets/whitelabel/ppbank/cartao_front_ppbank.png')}></Image>
        {this.state.validarPrimeiroCartao && (
          <Text style={styles.textHeaderNome}>{item.title}</Text>
        )}
        {this.state.validarPrimeiroCartao && (
          <Text style={styles.textHeaderNumero}>{item.text}</Text>
        )}
        {!this.state.validarPrimeiroCartao && (
          <Text style={styles.textHeaderNumero}>CARTÃO BLOQUEADO</Text>
        )}


      </View>
    )
  }

  bloquearCartao(bool) {
    this.setState({ showAlertBlockCard: false });
    //this.setState({ status_card: bool });
    console.log(this.state.status_card, 'status')
    this.updateStatusCardStore(bool);
  }

  async updateStatusCardStore(bool) {
    const { updateStatusCardStore } = this.props;

    let dadosCartao = {
      id_usuario: this.props.cards[0].id_usuario,
      id_cartao: this.props.cards[0].id_cartao
    }

    let result = await updateStatusCardStore(dadosCartao, bool);

    console.log(result, 'result', bool)
    if (result.status === 'success') {
      this.setState(data => {
        data.alert = {
          title: 'Sucesso !',
          subtitle: 'Cartão atualizado com sucesso',
          theme: 'success',
          icone: 'closecircle',
        };
        data.status_card = !data.status_card
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
        data.status_card = !data.status_card
        data.showAlert = true;
        return data;
      });
    }
    this.setState({ loading: false });
  }

  blockCard() {
    this.setState(data => {
      data.alert = {
        title: 'Atenção',
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

  alertCloseCard() {
    this.setState({ showAlertBlockCard: false });
  }
  alertClosePassword() {
    this.setState({ showAlertPassword: false });
  }
  alertCloseSuccess() {
    this.setState({ showAlertSuccess: false });
  }

  alertCloseSuccessCardPrimary() {

    this.setState({ validarPrimeiroCartao: true, showAlertPrimeiroCartao: false });

  }
  alertCloseFailCardPrimary() {
    this.setState({ showAlertPrimeiroCartao: false });
  }

  fecharModal(props, isDashBoard, tab) {

    if (isDashBoard) {
      this.props.navigation.navigate('Dashboard')
    } else {
      switch (tab) {
        case 'cardHistory':
          this.props.navigation.navigate('cardHistory')
          this.RBSheet.close()
          break
        case 'NewPasswordCard':
          this.props.navigation.navigate('NewPasswordCard', { new_card: this.state.dadosCartao })
          this.RBSheet.close()
          break
        case 'SolicitarNovoCartao':
          this.props.navigation.navigate('SolicitarNovoCartao')
          this.RBSheet.close()
          break
        case 'NewPasswordCard':
          this.props.navigation.navigate('NewPasswordCard', { new_card: this.state.dadosCartao })
          this.RBSheet.close()
          break
        case 'CartaoVirtual':
          this.props.navigation.navigate('CartaoVirtual')
          this.RBSheet.close()
          break
        case 'SenhaCartao':
          this.props.navigation.replace('SenhaCartao', { new_card: this.state.dadosCartao })
          this.RBSheet.close()
          break

      }
    }

  }

  async desbloquearPrimeiroCard() {
    //console.log(this.props)
    const dadosCartao = {
      id_usuario: this.props.cards[0].id_usuario,
      ultimos_digitos: this.state.digitoCartao
    }

    //console.log(dadosCartao)
    let status = null
    const { desbloquearPrimeiroCartao } = this.props
    if (this.state.digitoCartao.length === 4 && this.state.digitoCartao === this.props.cards[0].ultimos_digitos) {
      status = await desbloquearPrimeiroCartao(dadosCartao)
      //console.log(status)
      if (status.status === 'success') {
        this.setState(data => {
          data.alert = {
            title: 'Atenção',
            subtitle: 'Cartão desbloqueado',
            theme: 'success',
            icone: 'creditcard',
          };
          data.showAlertPrimeiroCartao = true;
          data.validarPrimeiroCartaoStatus = true
          return data;
        });
      }

    } else if (this.state.digitoCartao.length === 4 && this.state.digitoCartao !== this.props.cards[0].ultimos_digitos) {
      this.setState(data => {
        data.alert = {
          title: 'Atenção',
          subtitle: 'Numero do cartão inválido',
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlertPrimeiroCartao = true;
        data.validarPrimeiroCartaoStatus = false
        return data;
      });
    }

  }

  render() {
    //if (this.state.loading) return <Loading />
    const { cards } = this.props

    return (
      <SafeAreaView style={styles.container}>
        <View>

          <Carousel
            layout={"stack"}
            ref={(ref) => this.carousel = ref}
            data={this.state.carouselItems}
            sliderWidth={380}
            itemWidth={300}
            enabledContentGestureInteraction={false}
            renderItem={this._renderItem.bind(this)}
            //onSnapToItem={index => this.setState({ activeIndex: index })}
            onSnapToItem={index => this.setState({
              dadosCartao: this.props.cards[index],
              activeIndex: index
            })}

          />
        </View>

        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="#121015"
        />

        <View style={{ height: 500 }}>
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            //customModalProps={{modalVisible: false}}
            height={450}
            animationType="slide"
            minClosingHeight={400}
            closeOnDragDown={false}
            dragFromTopOnly={false}
            closeDuration={0}
            closeOnPressMask={false}
            closeOnPressBack={true}
            onClose={() => {
              this.fecharModal(this.props, this.isDashBoard)
            }}
            //onOpen={() => }
            openDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: '#fff',
                paddingTop: 0,
              },
              wrapper: {
                backgroundColor: this.state.validarPrimeiroCartao === true ? "transparent" : "rgba(0, 0, 0, 0.4)"
                //opacity: this.state.validarPrimeiroCartao === true? 0.1 : 1
              },
              draggableIcon: {
                backgroundColor: '#A9A9A9',
                paddingTop: 5,
                marginBottom: 30,
              }

            }}
          >

            {!this.state.validarPrimeiroCartao && (

              <View>
                <View style={styles.containerTextPinCode}>
                  <Text style={styles.TextPinCode}>Digite os 4 últimos dígitos do seu cartão para</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 19 }}>desbloquea-lo</Text>
                </View>

                <PinView
                  onValueChange={(valor) => {
                    this.setState({ digitoCartao: valor });
                  }}
                  ref={this.pinView}
                  inputViewStyle={[theme.circle]}
                  buttonViewStyle={{
                    borderWidth: 1,
                    borderColor: darkButton,
                    width: 50,
                    height: 50,
                    margin: 0
                  }}
                  inputAreaStyle={{ marginTop: 20 }}
                  buttonTextStyle={{ color: darkButton }}
                  inputViewFilledStyle={{ backgroundColor: darkButton, opacity: 1 }}
                  pinLength={4}
                  onButtonPress={(key, me) => {
                    if (key === "custom_left") {
                      this.pinView.current.clear()
                    }
                    if (key === "custom_right") {
                      this.desbloquearPrimeiroCard()
                    }
                  }}
                  customLeftButton={<Icon name={'backspace'} size={40} color={darkButton} />}
                  customRightButton={<Icon name={'send'} size={40} color={darkButton} />}

                />
              </View>

            )}


            {this.state.validarPrimeiroCartao && (
              <View style={styles.containerRBSheet}>

                <View style={styles.containerBloquearCartaoRBSheet}>

                  <View style={styles.bloquearCartaoRBSheet}>
                    <TouchableOpacity style={{marginTop: 0 , marginRight:30}} onPress={() => this.props.navigation.replace('Dashboard')}>
                      <AntDesign name={'left'} size={35} color="#000" />
                    </TouchableOpacity>
                    <Fontisto name="locked" size={28}></Fontisto>
                    <Text style={styles.bloquearCartaoTextRBSheet}>Status: {this.state.status_card === false ? "Ativado" : "Desativado"}</Text>
                  </View>
                  <View style={styles.checkboxRBSheet}>
                    <BouncyCheckbox onPress={() => this.blockCard()} fillColor="green" style={[{ marginBottom: 10 }]} isChecked={this.state.status_card === false ? true : false} />
                  </View>
                </View>


                <View style={styles.containerLimiteRBSheet}>
                  <View style={styles.limiteDisponivelRBSheet}>
                    <Text style={styles.limiteTextoRBSheet}>LIMITE UTILIZADO</Text>
                    <Text style={styles.limiteTextoRBSheet}>LIMITE DIÁRIO</Text>
                  </View>
                  <View style={styles.limiteValoresRBSheet}>
                    <Text style={styles.limiteValoresTextRBSheet}>R$ {this.state.limite_disponivel}</Text>
                    <Text style={styles.limiteValoresTextRBSheet}>R$ {this.state.limite_total}</Text>
                  </View>
                </View>


                <View style={styles.containerMenuOpcaoRBSheet}>

                  <FlatList
                    keyExtractor={(item) => { item.key }}
                    horizontal
                    data={this.menus}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                            style={{flex:1,flexDirection:"row",justifyContent:'space-between',padding:13}}   onPress={() => this.fecharModal(this.props, this.isDashBoard = false, this.tab = item.rota)}>
                          <this.ListaMenus  props={this.props} nomelist={item.name} rota={item.rota} icone={item.icone} />
                        </TouchableOpacity>
                      )
                    }}>
                  </FlatList>


                  {/*
                 <TouchableOpacity onPress={() => {
                   //this.props.navigation.navigate('NewPasswordCard', { new_card: this.state.dadosCartao }), this.RBSheet.close()}}>
                   this.fecharModal(this.props, this.isDashBoard = false, this.tab = 'NewPasswordCard')}}>
                   <View style={styles.menuOpcaoRBSheet}>
                     <View style={styles.menuOpcaoIconeRBSheet}>
                       <Fontisto name="key" size={28} color={'#696969'}></Fontisto>
                     </View>
                     <View style={styles.menuOpcaoContainerTextRBSheet}>
                       <Text style={styles.menuOpcaoTextRBSheet}>Alterar Senha</Text>
                     </View>

                   </View>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={() => {
                   //this.props.navigation.navigate('cardHistory'), this.RBSheet.close()}}>
                   this.fecharModal(this.props, this.isDashBoard = false, this.tab = 'cardHistory')}}>

                   <View style={styles.menuOpcaoRBSheet}>
                     <View style={styles.menuOpcaoIconeRBSheet}>
                       <Fontisto name="nav-icon-list-a" size={28} color={'#696969'}></Fontisto>
                     </View>
                     <View style={styles.menuOpcaoContainerTextRBSheet}>
                       <Text style={styles.menuOpcaoTextRBSheet}>Extrato</Text>
                     </View>
                   </View>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={() => {
                   //this.props.navigation.navigate('SolicitarNovoCartao'), this.RBSheet.close()}}>
                   this.fecharModal(this.props, this.isDashBoard = false, this.tab = 'SolicitarNovoCartao')}}>
                   <View style={styles.menuOpcaoRBSheet}>
                     <View style={styles.menuOpcaoIconeRBSheet}>
                       <Fontisto name="credit-card" size={28} color={'#696969'}></Fontisto>
                     </View>
                     <View style={styles.menuOpcaoContainerTextRBSheet}>
                       <Text style={styles.menuOpcaoTextRBSheet}>Solicitar Cartão</Text>
                     </View>
                   </View>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={() => {
                   this.props.navigation.navigate('NewPasswordCard', { new_card: this.state.dadosCartao }), this.RBSheet.close()}}>
                   <View style={styles.menuOpcaoRBSheet}>
                     <View style={styles.menuOpcaoIconeRBSheet}>
                       <Fontisto name="map-marker-alt" size={28} color={'#696969'}></Fontisto>
                     </View>
                     <View style={styles.menuOpcaoContainerTextRBSheet}>
                       <Text style={styles.menuOpcaoTextRBSheet}>Rastreio</Text>
                     </View>
                   </View>
                 </TouchableOpacity>

                 <TouchableOpacity onPress={() => {
                    this.fecharModal(this.props, this.isDashBoard = false, this.tab = 'CartaoVirtual')}}>
                   <View style={styles.menuOpcaoRBSheet}>
                     <View style={styles.menuOpcaoIconeRBSheet}>
                       <Fontisto name="cloud-up" size={28} color={'#696969'}></Fontisto>
                     </View>
                     <View style={styles.menuOpcaoContainerTextRBSheet}>
                       <Text style={styles.menuOpcaoTextRBSheet}>Cartão Virtual</Text>
                     </View>
                   </View>
                 </TouchableOpacity>
 */}

                </View>
              </View>
            )}


          </RBSheet>
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
            {!this.state.status_card && (
              <SCLAlertButton
                theme={this.state.alert.theme || 'info'}
                onPress={() => this.bloquearCartao(false)}>
                Bloquear
              </SCLAlertButton>
            )}
            {this.state.status_card && (
              <SCLAlertButton
                theme={'danger'}
                onPress={() => this.bloquearCartao(true)}>
                Ativar
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

          <SCLAlert
            show={this.state.showAlertPrimeiroCartao}
            onRequestClose={this.alertCloseCard.bind(this)}
            //onRequestClose={false}
            theme={this.state.alert.theme || 'info'}
            title={this.state.alert.title || ''}
            subtitle={this.state.alert.subtitle || ''}
            //overlayStyle={{backgroundColor: 'transparent'}}
            children={(

              <View style={styles.limiteValoresRBSheet}>
                <Text style={styles.limiteValoresTextRBSheet}>R$ 1.654,54</Text>
                <Text style={styles.limiteValoresTextRBSheet}>R$ 41.345,47</Text>
              </View>

            )}
            headerIconComponent={
              this.state.alert.icon || (
                <AntDesign
                  name={this.state.alert.icone || 'info'}
                  size={35}
                  color={'#ffffff'}
                />
              )

            }>

            {this.state.validarPrimeiroCartaoStatus && (
              <SCLAlertButton
                theme={this.state.alert.theme || 'info'}
                onPress={() => this.alertCloseSuccessCardPrimary()}>
                Ok
              </SCLAlertButton>)}

            {!this.state.validarPrimeiroCartaoStatus && (
              <SCLAlertButton
                theme={this.state.alert.theme || 'info'}
                onPress={() => this.alertCloseFailCardPrimary()}>
                Ok
              </SCLAlertButton>)}
          </SCLAlert>
        </View>

      </SafeAreaView>

    )


  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ cardsFetch, updateStatusCardStore, desbloquearPrimeiroCartao }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(gestaoCartao);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121015',
    flex: 1

  },
  header: {
    height: 280,
    backgroundColor: "#121015",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  imagemCartao: {
    resizeMode: 'contain',
    height: 180,
    top: 0,
    transform: [{ rotate: '00deg' }],
    marginTop: 10
  },
  containerImagemCartao: {
    flexDirection: 'column',
    marginTop: 30,
    alignItems: 'center',

  },
  voltarPag: {
    justifyContent: 'center'
  },
  textHeaderNome: {
    position: 'absolute',
    bottom: 60,
    fontSize: 20,
    color: '#A9A9A9',
    fontWeight: 'bold'
  },
  containerHeaderText: {
    position: 'absolute',
  },
  textHeaderNumero: {
    color: '#fff',
    fontSize: 20
  },

  button: {
    backgroundColor: '#f6f6',
    borderColor: '#fff',
    borderWidth: 2
  },








  containerRBSheet: {
    backgroundColor: '#fff',
    flex: 1,
    paddingRight: 0,
    paddingLeft: 20,
    marginTop: 40

  },
  containerBloquearCartaoRBSheet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingRight: 20,
  },
  bloquearCartaoRBSheet: {
    flexDirection: 'row',

  },
  bloquearCartaoTextRBSheet: {
    fontSize: 20,
    marginLeft: 10
  },
  checkboxRBSheet: {

  },
  containerMenuOpcaoRBSheet: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 20,
    flex: 1,


  },
  menuOpcaoRBSheet: {
    width: 60,
    height: 90,
    marginRight: 24,
    marginBottom: 15,

  },

  menuOpcaoIconeRBSheet: {
    backgroundColor: '#F5F5F1',
    borderRadius: 10,
    borderWidth: 15,
    borderColor: '#F5F5F1',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 14.78,
    elevation: 5,

    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,

  },

  menuOpcaoContainerTextRBSheet: {
    flex: 1,
    width: "100%",
    justifyContent: 'flex-start',

    //backgroundColor: 'red'

  },
  menuOpcaoTextRBSheet: {
    justifyContent: 'center',
    textAlign: 'center',
    //backgroundColor: 'green'
  },
  containerLimiteRBSheet: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    borderColor: '#C0C0C0',
    marginRight: 20,
  },
  limiteDisponivelRBSheet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  limiteValoresRBSheet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 20
  },
  limiteTextoRBSheet: {
    fontSize: 15
  },
  limiteValoresTextRBSheet: {
    fontWeight: 'bold',
    fontSize: 20
  },




  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFiledRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },

  containerTextPinCode: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  TextPinCode: {
    fontSize: 17,
    textAlign: 'center'
  }

})


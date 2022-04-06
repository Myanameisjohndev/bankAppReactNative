import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";

import Fontisto from 'react-native-vector-icons/Fontisto';


export class MenuCartao extends Component {

  

  constructor(props) {
    super(props)
    //this.card = this.props.navigation.getParam('card');
    console.log(props.props, 'propss')
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  

  render() {
    
    return (
      <View style={styles.container}>
        <View style={styles.containerBloquearCartao}>
          <View style={styles.bloquearCartao}>
            <Fontisto name="locked" size={28}></Fontisto>
            <Text style={styles.bloquearCartaoText}>Status: desbloqueado</Text>
          </View>
          <View style={styles.checkbox}>
            <BouncyCheckbox fillColor="green" style={[{ marginBottom: 10 }]} isChecked={this.props.dadosCartao.bloqueado} />
          </View>

        </View>


        <View style={styles.containerLimite}>
          <View style={styles.limiteDisponivel}>
            <Text style={styles.limiteTexto}>LIMITE UTILIZADO</Text>
            <Text style={styles.limiteTexto}>DISPONÍVEL</Text>
          </View>
          <View style={styles.limiteValores}>
            <Text style={styles.limiteValoresText}>R$ 1.654,54</Text>
            <Text style={styles.limiteValoresText}>R$ 41.345,47</Text>
          </View>

        </View>



        <View style={styles.containerMenuOpcao}>
          <View style={styles.menuOpcao}>
          <TouchableOpacity onPress={() => {
            this.props.props.navigation.navigate('History', {new_card: this.props.dadosCartao})
            //this.props.solicitarSenha()
            //this.RBSheet.close()
          }
                //this.props.props.navigation.navigate('NewPasswordCard', {new_card: this.props.dadosCartao}),
                //this.props.solicitarSenha(this.props.props.navigation.navigate('NewPasswordCard', {new_card: this.props.dadosCartao}))
              }>
            <View style={styles.menuOpcaoIcone}>
              <Fontisto name="key" size={28} color={'#696969'}></Fontisto>
            </View>

            
            </TouchableOpacity>
            <Text style={styles.menuOpcaoText}>Minha senha</Text>
          </View>
          <View style={styles.menuOpcao}>
            <View style={styles.menuOpcaoIcone}>
              <Fontisto name="mastercard" size={28} color={'#696969'}></Fontisto>
            </View>

            <Text style={styles.menuOpcaoText}>Extrato</Text>
          </View>
          <View style={styles.menuOpcao}>
            <View style={styles.menuOpcaoIcone}>
              <Fontisto name="motorcycle" size={28} color={'#696969'}></Fontisto>
            </View>

            <Text style={styles.menuOpcaoText}>Pedir 2° via</Text>
          </View>
          <View style={styles.menuOpcao}>
            <View style={styles.menuOpcaoIcone}>
              <Fontisto name="map-marker-alt" size={28} color={'#696969'}></Fontisto>
            </View>

            <Text style={styles.menuOpcaoText}>Rastreio</Text>
          </View>


        </View>
      </View>
    )

  }
}

const styles = StyleSheet.create({

  containerRBSheet: {
    backgroundColor: '#fff',
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    

  },
  containerBloquearCartaoRBSheet: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 15
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    

  },
  menuOpcaoTextRBSheet: {

  },
  menuOpcaoRBSheet: {
    alignItems: 'center'
  },
  menuOpcaoIconeRBSheet: {
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
    borderWidth: 15,
    borderColor: '#DCDCDC',
    shadowColor: '#1717',
    shadowOffset: {
      width: 4, height: -2
    }
    
  },
  containerLimiteRBSheet: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    borderColor: '#C0C0C0'
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
  }




})
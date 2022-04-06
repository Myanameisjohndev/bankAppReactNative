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
import { solicitarNovoCartaoVirtual } from '../../store/cards'
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

export default class Teste extends Component {

  

  render() {

    return (
      <View style={{backgroundColor: 'red'}}><Input><Text>Teste teste teste</Text></Input></View>
    )

  }
}





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
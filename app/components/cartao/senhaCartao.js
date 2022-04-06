import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActivityIndicator, Image, Linking, StatusBar, TextInput, TouchableOpacity} from 'react-native';
import {Body, Container, Content, H1, H3, Header, Input, Left, Text, View} from 'native-base';
import {

    darkButton,
    defaultTextColor,
    degrade_primario, 
    lightButton, 
} from '../../style/pallet';
import {novaSenhaCartao} from '../../store/cards';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../style/theme';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { exibirSenha, cardsFetch } from '../../store/cards'

class SenhaCartao extends Component {
    state = {
        senha: null,  
        loading: false, 
        alert: {},
        senha: null,
        showPass: false
    };
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };


    constructor(props) {
        //console.log(props);
        super(props);
        this.new_card = this.props.navigation.getParam('new_card', {
            new_card: this.card,
          });
        //console.log(this.new_card)
        //this.setState({new_card: this.new_card });
    }

    async componentDidMount(){
      const {exibirSenha, cardsFetch} = this.props
      //const cartao = await cardsFetch()
      //console.log(cartao)
      
      //console.log(this.new_card.id_cartao, 'idcartao')
      const resposta = await exibirSenha(this.new_card.id_cartao)
      this.setState({senha: resposta.message.password})
      console.log(this.state.senha)
    }

    alertClose() {
        this.setState({showAlert: false});
    }

    render() {
            return (
                <Container>
                    <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                        <Left style={{justifyContent: 'center'}}>
                            <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.navigate('GestaoCartao', {onGoBack: () => this.refresh()})}>
                                <AntDesign name={'left'} size={35} color={defaultTextColor} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{marginRight: 20 }}>
                            <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                                Senha cartão
                            </H1>
                        </Body>
                    </Header>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Content style={{marginHorizontal: 5}} padder>

                        <H1 style={[theme.h3, theme.justifyText]}>
                            Olá, esta é sua senha para fazer transações no cartão fisico.
                        </H1>
                        

                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <TextInput
                                style={[theme.input, {textAlign: 'center'}]}
                                placeholder="Senha"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry={!this.state.showPass}
                                onChangeText={senha => this.setState({senha})}
                                value={this.state.senha || ''}
                            />
                            <TouchableOpacity
                                transparent
                                onPress={e => {
                                    this.setState({showPass: !this.state.showPass})
                                }}
                                underlayColor="none" style={{position: 'absolute', right: 10, top: 30, bottom: 0}}
                            >
                                <Icon
                                    name={this.state.showPass ? 'visibility-off' : 'visibility'}
                                    color="white"
                                    size={30}
                                    style={[{color: '#000', bottom: 0}]}
                                />
                            </TouchableOpacity>
                        </View>
                        

                    </Content>

    
                    <View style={
                        [theme.fixBottom, theme.centerAll]
                    }>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('NewPasswordCard', { new_card: this.new_card, senhaAtual: this.state.senha })}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 30,

                                },
                                {
                                    backgroundColor: darkButton,
                                },
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === 'ios' ? 'large' : 50}
                            />}
                            <H3 style={[theme.centerAll, theme.h3_light]}>
                                Alterar senha
                            </H3>
                        </TouchableOpacity>
                    </View>

                </Container>

            );
    }
}

const mapStateToProps = state => {
    return {account: state.account};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({exibirSenha, cardsFetch}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SenhaCartao);

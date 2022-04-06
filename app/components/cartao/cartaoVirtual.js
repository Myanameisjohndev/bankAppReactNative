import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { View, TouchableOpacity, ActivityIndicator, Image, StatusBar, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Container, Content, Header, Text, Left, Body, H1, Right, List, ListItem, H3, Input } from 'native-base';
import {
    darkButton, defaultTextColor, degrade_primario,
    lightButton
} from '../../style/pallet'
import Style from '../../style/style'
import { historyFetch, listarCartaoVirtual, excluirCartaoVirtual, solicitarNovoCartaoVirtual } from "../../store/cards";
import Loading from "../common/Loading";
import { SCLAlert, SCLAlertButton } from "react-native-scl-alert";
import theme from "../../style/theme";
import { Helpers } from "../helpers";
import moment from "moment";
import TextInputMask from "react-native-masked-text/lib/text-input-mask";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as BackHandler from 'react-native';
import * as Alert from 'react-native';

class CartaoVirtual extends Component {
    state = {
        loading: true,
        showModal: false,
        data_inicial: null,
        data_final: '',
        alert: {},
        id_usuario: null,
        listaDeCartao: "",
        showAlertExcluirSucesso: false,
        showAlertExcluirFail: false,
        showAlertExcluirAbrir: false,
        showAlertCriarSucesso: false,
        showAlertCriarAbrir: false,
        showAlertErro: false,
        statusListaCartao: false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null,

        }
    }

    constructor(props) {
        //console.log(props.account.conta.id_usuario)
        super(props);
        this.new_card = this.props.navigation.getParam('new_card', {
            new_card: this.card,
        });
        this.informacoesCartao = ""

        console.log(this.new_card, 'new card')
    }

    alertClose() {
        //console.log('teste')
        this.setState({ showAlertExcluirAbrir: false, showAlertCriarAbrir: false })

    }

    modalExcluirCartaoVirtual() {
        this.setState(data => {
            data.alert = {
                title: 'Atenção',
                subtitle: 'Deseja excluir o cartão?',
                theme: 'danger',
                icone: 'closecircle',
            };
            data.showAlertExcluirAbrir = true;
            return data;
        });
        this.setState({ loading: false });
        return false;
    }


    modalCriarCartaoVirtual() {
        this.setState(data => {
            data.alert = {
                title: 'Atenção',
                subtitle: 'Deseja criar um cartão virtual?',
                theme: 'info',
                icone: 'closecircle',
            };
            data.showAlertCriarAbrir = true;
            return data;
        });
        this.setState({ loading: false });
        return false;
    }


    modalErroSolicitacao() {
        this.setState(data => {
            data.alert = {
                title: 'Atenção',
                subtitle: 'Houve um erro em sua solicitação',
                theme: 'danger',
                icone: 'closecircle',
            };
            data.showAlertErro = true;
            return data;
        });
        this.setState({ loading: false });
        return false;
    }

    async excluirCartao(params) {
        const { excluirCartaoVirtual } = this.props
        const { listarCartaoVirtual } = this.props
        //const listarCartao = await listarCartaoVirtual()
        //console.log(listarCartao)
        let excluirCartao = await excluirCartaoVirtual(params)

        if (excluirCartao.status === 'success'){
                this.setState({ showAlertExcluirAbrir: false })
                const listarCartao = await listarCartaoVirtual()
                this.setState({ listaDeCartao: listarCartao, statusListaCartao: true })
        }
        console.log(excluirCartao)

        if(excluirCartao.status === 'error') this.modalErroSolicitacao()

    }

    async criarCartaoVirtual() {
        const { solicitarNovoCartaoVirtual } = this.props
        const { listarCartaoVirtual } = this.props
        const result = await solicitarNovoCartaoVirtual()
        //console.log(result)

        if (result.status === 'success') {
            this.setState({ showAlertCriarAbrir: false })
            const listarCartao = await listarCartaoVirtual()
            this.setState({ listaDeCartao: listarCartao.data[0], statusListaCartao: false })
            this.informacoesCartao = listarCartao.data[0]
        }else if(result.status === 'error'){
            this.modalErroSolicitacao()
        }
    }

    async componentDidMount() {
        const { listarCartaoVirtual } = this.props
        const listarCartao = await listarCartaoVirtual()

        this.setState({ listaDeCartao: listarCartao.data[0] })
        if(!this.state.listaDeCartao) this.setState({statusListaCartao: true})

    }



    render() {
        //if (this.state.loading) return <Loading />

        return (
            <Container>
                <Header style={[{ height: 100, backgroundColor: degrade_primario }]}>
                    <Left>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => this.props.navigation.navigate('GestaoCartao', { onGoBack: () => this.refresh() })}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, { marginTop: 15 }, { marginLeft: Platform.OS === 'ios' ? wp('-50%') : wp('0%') }]}>
                            Cartão Virtual
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />

                <View style={styles.container}>
                    <View style={styles.cartaoVirtualContainer}>
                        <Image style={styles.imagemCartao} source={require('../../../assets/whitelabel/ppbank/cartao_front_ppbank.png')}></Image>
                    </View>


                    <View style={styles.bodyContainer}>
                        <View style={styles.cardContainer}>
                            <Text style={styles.textTitulo}>Número</Text>
                            <Text>{this.state.listaDeCartao?.numero_cartao}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={styles.textTitulo}>Nome</Text>
                            <Text>{this.state.listaDeCartao?.nome_titular}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={styles.textTitulo}>Válidade</Text>
                            <Text>{this.state.listaDeCartao?.mes_vencimento}/{this.state.listaDeCartao?.ano_vencimento}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={styles.textTitulo}>CVC</Text>
                            <Text>{this.state.listaDeCartao?.cvv}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={styles.textTitulo}>Função</Text>
                            <Text>Débito</Text>
                        </View>
                    </View>




                    <View style={styles.rodapeContainer}>
                            <TouchableOpacity style={styles.buttonContainer} disabled={this.state.statusListaCartao} onPress={() => this.modalExcluirCartaoVirtual()}>
                            <View style={styles.iconeContainer}>
                                <Fontisto name={"locked"} size={25} color={'#000'}></Fontisto>
                            </View>
                            <Text>Excluir</Text>
                            </TouchableOpacity>
                        <TouchableOpacity disabled={!this.state.statusListaCartao} style={styles.buttonContainer} onPress={() => this.modalCriarCartaoVirtual()}>
                            <View style={styles.iconeContainer}>
                                <Fontisto name={"equalizer"} size={25} color={'#000'}></Fontisto>
                            </View>
                            <Text>Criar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View>
                    <SCLAlert
                        show={this.state.showAlertExcluirAbrir}
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
                            onPress={() => this.excluirCartao(this.state.listaDeCartao?.hash)}>
                            Excluir
                        </SCLAlertButton>
                        <SCLAlertButton
                            theme={this.state.alert.theme || 'info'}
                            onPress={() => this.alertClose()}>
                            Fechar
                        </SCLAlertButton>
                    </SCLAlert>
                    <SCLAlert
                        show={this.state.showAlertCriarAbrir}
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
                            onPress={() => this.criarCartaoVirtual()}>
                            Criar
                        </SCLAlertButton>
                        <SCLAlertButton
                            theme={this.state.alert.theme || 'info'}
                            onPress={() => this.alertClose()}>
                            Fechar
                        </SCLAlertButton>

                    </SCLAlert>


                    <SCLAlert
                        show={this.state.showAlertErro}
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
                            onPress={() => this.alertClose()}>
                            Fechar
                        </SCLAlertButton>
                    </SCLAlert>
                </View>
            </Container>



        )
    }




}

const mapStateToProps = state => {
    return { history: state.history, account: state.account.data };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ solicitarNovoCartaoVirtual, listarCartaoVirtual, excluirCartaoVirtual }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartaoVirtual);


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginRight: 20,
        marginLeft: 20

    },
    cartaoVirtualContainer: {
        alignItems: 'center',
    },
    imagemCartao: {
        resizeMode: 'contain',
        width: "100%",
        transform: [{ rotate: '00deg' }],
    },
    bodyContainer: {
        flex: 2,

    },
    cardContainer: {
        height: 50,
        alignItems: 'center'

    },
    textTitulo: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    rodapeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    iconeContainer: {
        backgroundColor: '#d9d9d9',
        borderWidth: 25,
        borderColor: '#d9d9d9',
        borderRadius: 100
    },
    buttonContainer: {
        alignItems: 'center'
    }

})

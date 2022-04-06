import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {View, TouchableOpacity, ActivityIndicator, Image, StatusBar} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Container, Content, Header, Text, Left, Body, H1, Right, List, ListItem, H3, Input} from 'native-base';

import {
    darkButton, defaultTextColor, degrade_primario,
    lightButton
} from '../../style/pallet';

import {historyFetch} from "../../store/cards";
import Loading from "../../components/common/Loading";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import theme from "../../style/theme";
import {Helpers} from "../../components/helpers";
import moment from "moment";
import TextInputMask from "react-native-masked-text/lib/text-input-mask";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import * as BackHandler from 'react-native';
import * as Alert from 'react-native';

class CardHistory extends Component {
    state = {loading: true, showModal: false, data_inicial: null, data_final: '', alert: {}}
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.onDateChange = this.onDateChange.bind(this);
        //console.log(props,'PROPS')
    }

    alertClose() {
        this.setState({showAlert: false})
    }

    onDateChange(date, type) {
        if (date === null) {
            this.setState({
                startDate: null,
                data_inicial: null,
                endDate: null,
                data_final: null
            });
            return true;
        }
        if (type === 'END_DATE') {
            this.setState({
                endDate: date,
                data_final: date._i.year + '-' + (date._i.month + 1).toString().padStart(2, '0') + '-' + date._i.day.toString().padStart(2, '0')
            });
        } else {
            this.setState({
                startDate: date,
                data_inicial: date._i.year + '-' + (date._i.month + 1).toString().padStart(2, '0') + '-' + date._i.day.toString().padStart(2, '0'),
                endDate: null,
            });
        }
    }

    async fetch() {
        this.setState({loading: true});
        await this.props.historyFetch(this.state.data_inicial, this.state.data_final);
        this.setState({loading: false});

        console.log(this.props, 'deu certo?')
    }

    componentDidMount() {

        this.setState({
            data_final: moment(new Date()).format("DD/MM/YYYY"),
            //data_inicial: moment(new Date()).subtract(7, 'd').format("DD/MM/YYYY")
            data_inicial: moment(new Date()).format("DD/MM/YYYY")
        },this.fetch);

    }

    histories() {
        const {history} = this.props;
        let movData = [];
        Object.entries(history.days).map(([key, value]) => {
            return Object.entries(value).map(([key2, data]) => {
                movData.push(data);
            });
        })

        return movData;
    }

    render() {
        if (this.state.loading) return <Loading />
        const {account} = this.props;
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.navigate('GestaoCartao', {onGoBack: () => this.refresh()})}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : wp('10%')}]}>
                            Extrato Cartão
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content padder>
                    <View style={{flexDirection: 'row'}}>
                        <TextInputMask
                            allowFontScaling={false}
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY'
                            }}
                            keyboardType={"number-pad"}
                            onChangeText={(data_inicial) => this.setState({data_inicial})}
                            value={this.state.data_inicial}
                            style={[theme.input, {height: 45, fontSize: 18}]}
                        />
                        <View style={{flex: 0.05}} />
                        <TextInputMask
                            allowFontScaling={false}
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY'
                            }}
                            keyboardType={"number-pad"}
                            onChangeText={(data_final) => this.setState({data_final})}
                            value={this.state.data_final}
                            style={[theme.input, {height: 45, fontSize: 18}]}
                        />
                        <View style={{flex: 0.05}} />
                        <TouchableOpacity
                            onPress={() => this.fetch()}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll, {
                                    flex: 0.3,
                                    height: 48,
                                    marginTop: 10
                                }
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light, {marginTop: 13}]}>
                                <AntDesign name={'search1'} size={25} />
                            </H3>
                        </TouchableOpacity>
                    </View>
                    <List>
                        {this.histories().map(transacao => {
                            return (
                                <ListItem
                                    onPress={() => this.receiptOrNot(transacao) && this.props.navigation.navigate('Receipt', {
                                        transacao: transacao,
                                        fromHistory: true
                                    })}
                                    avatar
                                >
                                    <Left>
                                        <Text allowFontScaling={false} style={{marginTop: 8}}>
                                            {this.getIcon(transacao.tipo_transacao.id)}
                                        </Text>
                                    </Left>
                                    <Body style={{minHeight:80}}>
                                        <Text allowFontScaling={false} style={[theme.fontDefault]}>{this.onlyFirstLetterUpper(transacao.tipo_transacao.nome.toString())}</Text>
                                        <Text allowFontScaling={false} style={[theme.fontDefault, {fontSize: 14}]} note>
                                            {this.getDescription(transacao)}
                                        </Text>

                                    </Body>
                                    <Right >
                                        <Text allowFontScaling={false} style={[theme.fontDefault]}>{transacao.formated_currency}</Text>
                                        <Text allowFontScaling={false} style={[theme.fontDefault, {fontSize: 14}]} note>
                                            {transacao.created_at.data}
                                        </Text>
                                        <Text allowFontScaling={false} style={[theme.fontDefault, {fontSize: 14}]} note>
                                            {transacao.created_at.hora}
                                        </Text>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                    {!this.histories().length && <View style={{marginHorizontal: 15}}>
                        <H1 allowFontScaling={false} style={[theme.h3, theme.centerAll, {fontSize: 30}]}>Você ainda não
                            efetuou nenhuma
                            transação!</H1>

                    </View>}
                </Content>

                <SCLAlert
                    show={this.state.showAlert}
                    onRequestClose={this.alertClose.bind(this)}
                    theme={this.state.alert.theme || 'info'}
                    title={this.state.alert.title || ''}
                    subtitle={this.state.alert.subtitle || ''}
                    headerIconComponent={this.state.alert.icon ||
                    <AntDesign name={this.state.alert.icone || 'info'} size={35} color={'#fff'} />}
                >
                    <SCLAlertButton theme={this.state.alert.theme || "info"} onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                </SCLAlert>
            </Container>
        )
    }

    /*
    2    TRANSFERÊNCIA Recebida
    3    TRANSFERÊNCIA Enviada
    6    MICRO-CREDITO Recebida
    7    CRÉDITO PPBANK Recebida
    1    BOLETO Recebida
    5    BOLETO Pago
    8    DÉBITO PPBANK Pago
    9    TAXA - TED Pago
    10    TAXA - BOLETO Pago
    11    DEVOLUÇÃO Recebida
    12    TRANSFERÊNCIA DASHBOARD Enviada
    13    PAGAMENTO VENDAS Recebida
    15    CAPITAL DE GIRO
    */
    getIcon(id) {
        switch (id) {
            case 11:
                return <AntDesign name="sync" size={28} color="#a2db2f" />
            case 1:
                return <AntDesign name="barcode" size={28} color="#a2db2f" />
            case 3:
            case 9:
            case 10:
            case 8:
            case 5:
            case 16:
                return <AntDesign name="arrowup" size={28} color="red" />
            case 17:
                return <AntDesign name="arrowdown" size={28} color="green" />
            case 2:
            case 15:
                return <AntDesign name="arrowup" size={28} color="red" />
            case 2:
            case 7:
                return <AntDesign name="arrowdown" size={28} color="#a2db2f" />
            case 13:
                return <Fontisto name="shopping-pos-machine" size={28} color="#a2db2f" />

        }
    }

    onlyFirstLetterUpper(string) {
        string = string.toString().toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getDescription(transacao) {
        switch (transacao.tipo_transacao.tipo) {
            case 'Enviada':
                try {
                    return 'Enviado para ' + Helpers.toTitleCase(transacao.complementos.nome_receptor_completo.split(' ')[0]) + ', ' + transacao.complementos.nome_instituicao;
                } catch (e) {
                    return 'Enviado para ' + Helpers.toTitleCase(transacao.complementos.nome_receptor_completo) + ', ' + transacao.complementos.nome_instituicao;
                }
            case 'Recebida':
                if(transacao.complementos.codigo_banco !== '000' ){
                    return 'Recebido de ' + Helpers.toTitleCase(transacao.complementos.nome_instituicao);
                }
                return 'Recebido de ' + Helpers.toTitleCase(transacao.usuario_transacao.pessoa.nome);
            case 'Pago':
                return 'Pagamento para ' + Helpers.toTitleCase(transacao.complementos.nome_receptor_completo);
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
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false
        }
        return true;
    }
}

const mapStateToProps = state => {
    return {history: state.history, account: state.account.data};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({historyFetch}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardHistory);

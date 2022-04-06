import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Loading from "../../components/common/Loading";
import {View, StatusBar, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Appearance} from 'react-native';
import Style from '../../style/style';
import {Helpers} from "../../components/helpers";
import AntDesign from "react-native-vector-icons/AntDesign";
import {Header, Right, Left, Body, Container, Content, H1, H3} from "native-base";
import {
    darkButton,
    defaultTextColor,
    degrade_primario,
    degrade_secundario,
    gradientBackgroundBase,
    lightButton,
} from '../../style/pallet';
import Svg, {Defs, Path, Stop} from "react-native-svg";
import theme from "../../style/theme";
import {setTransferInfo} from "../../store/transfer";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

class confirmPayment extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }
    state = {loading: true, tipo_transferencia: 'TED'};

    constructor(props) {
        super(props);
        this.transfer = this.props.navigation.getParam('transfer');
        console.log('transfer e');
        console.log(this.transfer);
        const conta = this.props.account.data;
        
    }

    componentDidMount() {
        this.setState({loading: false});
        if(this.transfer.tipo_chave!=null){
            this.setState({tipo_transferencia:'PIX'});
        }

    }

    render() {
        const conta = this.props.account.data;
        if (this.state.loading) return <Loading />
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1  allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                            Transferências
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content>
                    <Svg
                        width={415}
                        height={357}
                        viewBox="0 0 415 357"
                        fill={darkButton}
                    >
                        <Path
                            d="M-1 0h416v312.613s-142.843 77.39-208 27.794C141.843 290.811-1 328.722-1 328.722V0z"
                            fill={Appearance.getColorScheme() === 'dark' ? degrade_secundario : degrade_secundario}
                        />
                        <Path
                            d="M-1 0h416v312.613s-142.843 77.39-208 27.794C141.843 290.811-1 328.722-1 328.722V0z"
                            fill={Appearance.getColorScheme() === 'dark' ? degrade_secundario : degrade_secundario}
                        />
                        <Defs>
                            <View style={{marginHorizontal: 15, marginTop: 10}}>
                                <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21}]}>
                                    <H1 allowFontScaling={false} style={[theme.h1, theme.fontBold]}>
                                        De:{" "}
                                    </H1>
                                     {conta.pessoa.nome}
                                </H1>
                            </View>
                            <View style={{marginHorizontal: 15, marginTop: 20, maxWidth: '90%'}}>
                                <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21}]}>
                                    <H1 allowFontScaling={false} style={[theme.h1, theme.fontBold]}>
                                        Para:{" "}
                                    </H1>
                                    {Helpers.toTitleCase(this.transfer.nome)}
                                </H1>
                                
                                {this.transfer.tipo_chave==null &&
                                <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21, marginTop: 20}]}>
                                    {this.transfer.banco.name}
                                </H1>
                                }
                                {this.transfer.tipo_chave==null &&
                                <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21}]}>
                                    Ag: {this.transfer.agencia}{" "}Conta: {this.transfer.conta + '-' + this.transfer.digito}
                                </H1>
                                }
                                {this.transfer.tipo_chave==null &&
                                <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21}]}>
                                    {Helpers.toTitleCase(this.transfer.tipo_conta)}
                                </H1>
                                }
                                {this.transfer.tipo_chave!=null &&
                                <H1 allowFontScaling={false} style={[theme.h3_light, {fontSize: 21}]}>
                                    Tipo Chave: {this.transfer.tipo_chave.nome}
                                </H1>
                                }
                                {this.transfer.tipo_chave!=null &&
                                <H1 allowFontScaling={false} style={[theme.h3_no_margin_light, {fontSize: 21}]}>
                                    Valor da chave: {this.transfer.chave} 
                                </H1>
                                }
                                <H1 allowFontScaling={false} style={[theme.h1, theme.fontBold, {fontSize: 22, marginTop: 18}]}>
                                    Valor: {" "}
                                    <H1 allowFontScaling={false} style={[theme.h1, {fontSize: 21}]}>
                                        {this.transfer.valor}
                                    </H1>
                                </H1>
                            </View>
                        </Defs>
                    </Svg>
                    <View style={[{marginHorizontal: 40}]}>
                        <H1 allowFontScaling={false} style={[theme.h3]}>
                            Tipo de transferência:
                        </H1>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 40, marginTop: 20}}>
                        <TouchableOpacity
                            onPress={() => this.setState({tipo_transferencia: 'TED'})}
                            disabled={true}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 0, flex: 0.5,
                                    backgroundColor: this.state.tipo_transferencia === 'TED' ? darkButton : '#8e8c8c'
                                }
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light, {fontSize: 16}]}>
                                TED
                            </H3>
                        </TouchableOpacity>
                        <View style={{flex: 0.01}} />
                        <TouchableOpacity
                            onPress={() => this.setState({tipo_transferencia: 'PIX'})}
                            disabled={true || this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 0, flex: 0.5,
                                    backgroundColor: this.state.tipo_transferencia === 'PIX' ? darkButton : '#8e8c8c'
                                }
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light, {fontSize: 16}]}>
                                PIX
                            </H3>
                          

                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.goToPay()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                            {
                                marginTop: 30,
                            }
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Confirmar
                        </H3>
                    </TouchableOpacity>
                     <View style={{height: 15}} />
                </Content>
            </Container>
        )
    }

    goToAuth() {
        this.props.navigation.navigate('security', {after: 'pay'});
    }

    goToPay() {
        const {setTransferInfo} = this.props;

        Object.keys(this.transfer).forEach(async ele => {
            let column = ele;
            let valor = this.transfer[column];
            await setTransferInfo(column, valor);
        });
        this.props.navigation.replace('security', {after: 'pay'});
        this.setState({loading: false});
    }
}

const mapStateToProps = state => {
    return {bankSettings: state.bankSettings, account: state.account};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({setTransferInfo}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(confirmPayment);

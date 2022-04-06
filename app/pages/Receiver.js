import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {gerarQrCode} from '../store/qrcode'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TextInput,
    Image,
    TouchableOpacity,
    Clipboard,
    Button,
    ActivityIndicator,
} from 'react-native';
import Style from '../style/style';
import LinearGradient from 'react-native-linear-gradient';
import {
    buttonBoxes, buttonTwoBoxes, defaultTextColor, degrade_primario, lightButton, telefone, whiteLabel,
} from '../style/pallet';
import {TextInputMask} from 'react-native-masked-text';
import {AlertHelper} from '../components/AlertHelper';
import {Toast, Container, Left, Right, Body, H1, Header, Content, H3} from 'native-base';
import {generatePayment} from '../store/receive';
import Loading from '../components/common/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../style/theme';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {Linking} from "react-native";

class Receiver extends Component {
    state = {loading: false, barCode: null, valor: null, generated: false, showAlert: false, alert: {}, codigoPix: null};
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


    setTedOrPix(){
        this.setState(data => {
            data.alert = {
                title: 'BOLETO OU PIX',
                subtitle: 'Informe se vai gerar um código de barras ou PIX qrCode.',
                theme: 'info',
                icone: 'closecircle',
            };
            data.showAlert = true;
            return data;
        });
        
        this.setState({loading: false});
        return false;
    }

    render() {

        if (this.state.generated === false) {
            return (
                <Container>
                    <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                        <Left>
                            <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                                <AntDesign name={'left'} size={35} color={defaultTextColor} />
                            </TouchableOpacity>
                        </Left>
                        <Body>
                            <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                                Depositar
                            </H1>
                        </Body>
                    </Header>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Content style={[{marginHorizontal: 17}]}>
                        <H1 allowFontScaling={false} style={[theme.h3, theme.justifyText]}>
                            O dinheiro cai na conta em até 1 dia útil
                        </H1>
                        <Image
                            source={require('../../assets/icones/iconeBoleto.png')}
                            style={[theme.centerAll, {
                                resizeMode: 'contain',
                                height: 180,
                                marginLeft: 5,
                            }]} />
                        <Text allowFontScaling={false} style={[theme.fontDefault, theme.centerAll, {paddingTop: 40}]}> Cobramos uma taxa de
                            liquidação do boleto no valor de
                            R$ 2,89.</Text>
                        <View style={{marginBottom: hp('3%')}}>
                            <View style={{
                                flexDirection: 'column',
                                marginLeft: 5,
                            }}>
                                <Text allowFontScaling={false} style={[theme.h3, {paddingHorizontal: 0, fontSize: 27, paddingTop: 18}]}>
                                    Valor:
                                </Text>

                                <TextInputMask
                                    allowFontScaling={false}
                                    type={'money'}
                                    options={{
                                        precision: 2,
                                        separator: ',',
                                        delimiter: '.',
                                        unit: 'R$ ',
                                        suffixUnit: '',
                                    }}
                                    keyboardType={'number-pad'}
                                    placeholder="R$ 10,00"
                                    placeholderTextColor={'#808080'}
                                    style={[theme.h3_no_margin, {fontSize: 32, textAlign: 'right'}]}
                                    value={this.state.valor}
                                    onChangeText={valor => {
                                        if (valor.length <= 13) {
                                            this.setState({
                                                valor,
                                            });
                                        }
                                    }}
                                />
                            </View>

                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 40,
                        }}>
                            <TouchableOpacity
                                onPress={() => this.setState({valor: 'R$ 100,00'})}

                                style={[
                                    theme.buttonDark, theme.centerAll,
                                    {
                                        height: 30,
                                        flex: 0.5,
                                    },
                                ]}
                            >

                                <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_no_margin_light, {fontSize: 14, marginTop: 3}]}>
                                    100,00
                                </H3>
                            </TouchableOpacity>
                            <View style={{flex: 0.1}} />
                            <TouchableOpacity
                                onPress={() => this.setState({valor: 'R$ 1.000,00'})}
                                style={[
                                    theme.buttonDark, theme.centerAll,
                                    {
                                        height: 30,
                                        flex: 0.5,
                                    },
                                ]}
                            >

                                <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_no_margin_light, {fontSize: 14, marginTop: 3}]}>
                                    1.000,00
                                </H3>
                            </TouchableOpacity>
                            <View style={{flex: 0.1}} />
                            <TouchableOpacity
                                onPress={() => this.setState({valor: 'R$ 5.000,00'})}

                                style={[
                                    theme.buttonDark, theme.centerAll,
                                    {
                                        height: 30,
                                        flex: 0.5,
                                    },
                                ]}
                            >

                                <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_no_margin_light, {fontSize: 14, marginTop: 3}]}>
                                    5.000,00
                                </H3>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            //onPress={() => this.generateBarCode()}
                            onPress={() => this.setTedOrPix() }   
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 30,
                                },
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === 'ios' ? 'large' : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                                Confirmar
                            </H3>
                        </TouchableOpacity>

                        <View style={{height: 18}} />
                    </Content>
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
                                        disabled={this.state.loading}
                                        containerStyle={this.state.loading ? theme.buttonDisabledSCLAlert: null}
                                        onPress={() =>!this.state.loading &&  this.generateBarCode()}>BOLETO</SCLAlertButton>
                        <SCLAlertButton theme={ 'info' }
                                        disabled={this.state.loading}
                                        containerStyle={this.state.loading ? theme.buttonDisabledSCLAlert: null}
                                        onPress={() =>!this.state.loading && this.generateQrCode()}
                        >PIX qrCode</SCLAlertButton>
                    </SCLAlert>
                </Container>
            );
        }
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'close'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />

                <Content style={[{backgroundColor: degrade_primario, paddingTop: hp('5%')}]}>
                    <View style={{
                        border: 1,
                        borderWidth: 4,
                        borderRadius: 10,
                        borderColor: '#FFF',
                        marginHorizontal: wp('18%'),
                    }}>
                        <H1 allowFontScaling={false} style={[theme.h3_light, {marginTop: 25}, {textAlign: 'center'}]}>
                            Boleto Gerado
                        </H1>
                        <H1 allowFontScaling={false} style={[theme.h3_light, {fontSize: 30}, {marginTop: 25}, {textAlign: 'center'}, {fontWeight: 'bold'}]}>
                            {this.state.valor}
                        </H1>
                        <H1 allowFontScaling={false} style={[theme.h3_light, {marginTop: 25, paddingBottom: 25}, {textAlign: 'center'}]}>
                            {this.props.receive.data.vencimento}
                        </H1>
                    </View>

                    <View
                        style={{
                            marginTop: 50,
                            borderColor: '#FFF',
                            borderWidth: 1,
                            borderStyle: 'dotted',
                            borderRadius: 1,
                        }}
                    />

                    <View
                        style={[{paddingTop: 10}, {marginLeft: wp('10%')}, {marginRight: wp('10%')}, {textAlign: 'left'}]}>

                        <H1 allowFontScaling={false} style={[theme.h3_light, {fontSize: 18}]}>
                            Utilize o número informado abaixo:
                        </H1>

                        <H1 allowFontScaling={false} style={[theme.h3_light, {fontSize: 18}, {fontWeight: 'bold'}]}>
                            {this.props.receive.data.barCode}
                        </H1>

                    </View>

                </Content>
                <View style={
                    [theme.fixBottom, theme.centerAll]
                }>
                    <TouchableOpacity
                        onPress={() => this.copyAndToast()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                            {
                                marginTop: 30,

                            },
                            {
                                backgroundColor: '#BBCC3E',
                            },
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === 'ios' ? 'large' : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Copiar código
                        </H3>
                    </TouchableOpacity>
                </View>
            </Container>

        );


    }

    async generateQrCode(){
        this.setState({loading: true});
        let valor = this.state.valor
        await this.props.gerarQrCode(valor);
        let codigoPix = this.props.qrcode.data.emv_payload
        let imagemQrCode = this.props.qrcode.data.imagem_url
        this.setState({loading: false})
        this.props.navigation.replace('QrCodeDeposit', {valor: valor, imagem: imagemQrCode, codigoPix: codigoPix})
       

    }

    async generateBarCode() {

        try {
            const {generatePayment} = this.props;
            this.setState({loading: true});

            if (this.state.valor == null || this.state.valor.replace(/\D+/g, '') < 2000) {

                this.setState(data => {
                    data.alert = {
                        title: 'Valor não permitido',
                        subtitle: 'O valor minimo para gerar um boleto é de R$ 20,00.',
                        theme: 'danger',
                        icone: 'closecircle',
                    };
                    data.showAlert = true;
                    return data;
                });
                this.setState({loading: false});
                return false;
            }

            await generatePayment(this.state.valor);
            setTimeout(function () {
                const {receive} = this.props;
                if (receive.status !== 'success') {
                    this.setState(data => {
                        data.alert = {
                            title: 'Falha ao gerar',
                            subtitle: receive.message,
                            theme: 'danger',
                            icone: 'closecircle',
                        };
                        data.showAlert = true;
                        return data;
                    });
                    this.setState({loading: false});
                    return false;
                }

                this.setState({generated: true});
                this.setState({loading: false});
            }.bind(this), 500);
        } catch (e) {
            console.log(e);
            this.setState({loading: false});
        }
    }

    async copyAndToast() {
        const {receive} = this.props;
        await Clipboard.setString(receive.data.barCode);
        Toast.show({
            text: 'Código de barras copiado!',
            buttonText: 'Ok',
            type: 'success',
        });
    }

    suporteMessage() {
        const {account} = this.props;
        return `whatsapp://send?text=Olá, suporte ${whiteLabel} Bank. Preciso aumentar meu limite para gerar um boleto de ${this.state.valor}. Meu documento é ${account.data.cpf || account.data.cnpj}&phone= ${telefone}`;
    }
}

const mapStateToProps = state => {
    return {qrcode: state.qrcode, history: state.history, receive: state.receive, account: state.account};
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators({generatePayment, gerarQrCode}, dispatch);
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Receiver);

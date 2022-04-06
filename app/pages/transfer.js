import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Animated,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Text,
    BackHandler,
    TouchableOpacity,
    View, Appearance,
} from 'react-native';
import {setTransferInfo, clearTransfer} from "../store/transfer";
import {favoritesFetch} from '../store/favorites';
import {
    buttonBoxes,
    buttonTwoBoxes,
    darkButton,
    defaultTextColor,
    degrade_primario, degrade_secundario, disabledButton,
    gradientBackgroundBase, lightButton, text_button, text_inDark, text_light
} from "../style/pallet";
import AntDesign from "react-native-vector-icons/AntDesign";
import Loading from "../components/common/Loading";
import {accountFetch} from "../store/account";
import {Header, Right, Left, Body, Container, Content, H1, H3, List, ListItem} from "native-base";
import theme from "../style/theme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Svg, {Defs, Path, Stop} from "react-native-svg";
import TextInputMask from "react-native-masked-text/lib/text-input-mask";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import {Helpers} from "../components/helpers";

let offset = 0;
const translateY = new Animated.Value(0);

class Transfer extends Component {
    state = {loading: true, value: null, tipo_conta: 'Conta corrente', alert: {}}
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.conta = this.props.navigation.getParam('conta');
        this.pessoa = this.props.navigation.getParam('pessoa');
    }

  componentDidMount() {
        this.load();
    }

    async load() {
        const {clearTransfer, favoritesFetch, accountFetch, account} = this.props;
        if (!account) await accountFetch();
        this.setState({loading: false, tipo_conta: this.conta.tipo_conta});
    }


    render() {
        const {bankSettings, account, favorites} = this.props;
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

                        </Defs>
                    </Svg>
                    <View style={{marginTop: -400, marginHorizontal: 17}}>
                        {this.getHeaderContent()}
                    </View>
                    <View style={[{marginTop: 45}]}>
                        <Text allowFontScaling={false} style={[theme.h3_light_new, theme.fontRegular, {
                            textAlign: 'right',
                            marginRight: 30,
                            fontSize: 22.5
                        }]}>
                            Meu saldo: {(account.conta.saldo ? account.conta.saldo.saldo : 'R$ 0.00')}
                        </Text>
                    </View>
                    <View style={[{marginHorizontal: 30, marginTop: 0}]}>
                        <H1 allowFontScaling={false} style={[theme.h3, {color: '#000'}]}>
                            Valor:
                        </H1>
                        <View>
                            <TextInputMask
                                allowFontScaling={false}
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: 'R$ ',
                                    suffixUnit: ''
                                }}
                                keyboardType={"number-pad"}
                                placeholder="R$ 10,00"
                                placeholderTextColor={'#808080'}
                                style={[theme.h3_no_margin, {fontSize: 32, textAlign: 'right'}]}
                                value={this.state.value}
                                onChangeText={text => {
                                    if (text.length <= 13) {
                                        this.setState({
                                            value: text
                                        })
                                    }
                                }}
                            />
                        </View>
                    </View>
                    {this.conta.tipo_chave==null &&
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
                        <TouchableOpacity
                            onPress={() => this.setState({tipo_conta: 'Conta corrente'})}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 0, flex: 0.5,
                                    backgroundColor: this.state.tipo_conta === 'Conta corrente' ? darkButton : '#8e8c8c'
                                }
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light, {fontSize: 16}]}>
                                Conta corrente
                            </H3>
                        </TouchableOpacity>
                        <View style={{flex: 0.01}} />
                        <TouchableOpacity
                            onPress={() => this.setState({tipo_conta: 'Conta poupança'})}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                                {
                                    marginTop: 0, flex: 0.5,
                                    backgroundColor: this.state.tipo_conta === 'Conta poupança' ? darkButton : '#8e8c8c'
                                }
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light, {fontSize: 16}]}>
                                Conta Poupança
                            </H3>
                        </TouchableOpacity>
                    </View>
                    }
                    <TouchableOpacity
                        onPress={() => this.checkToNextStep()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                            {
                                marginTop: 15,
                            }
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Próximo
                        </H3>
                    </TouchableOpacity>
                    <View style={{height: 15}} />
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
        );
        // if (this.state.loading || !account) return <Loading />
        // return (
        //     <Container scrollToOverflowEnabled={false}>
        //         <Header noShadow style={{
        //             backgroundColor: gradientBackgroundBase,
        //             marginTop: Platform.OS === 'ios' ? 0 : 24
        //         }}>
        //             <Left>
        //                 <TouchableOpacity onPress={() => this.backEvent()}>
        //                     <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
        //                 </TouchableOpacity>
        //             </Left>
        //             <Body />
        //             <Right />
        //         </Header>
        //         <Content style={Style.generalViews} padder>
        //             <StatusBar
        //                 translucent
        //                 backgroundColor="transparent"
        //             />
        //             <Text allowFontScaling={false} style={[Style.cashGenSubTitle, {marginTop: 30, paddingBottom: '25%'}]}>Transferência</Text>
        //
        //             {/*<Text allowFontScaling={false} style={Style.sendSubTitle}>Favoritos</Text>*/}
        //
        //             {/*{favorites && <FavoritesList*/}
        //             {/*    list={favorites}*/}
        //             {/*    translateY={translateY}*/}
        //             {/*/>}*/}
        //             <Text allowFontScaling={false} style={Style.sendValueSubtitle}>Valor</Text>
        //             <TextInputMask
        //                 type={'money'}
        //                 options={{
        //                     precision: 2,
        //                     separator: ',',
        //                     delimiter: '.',
        //                     unit: 'R$ ',
        //                     suffixUnit: ''
        //                 }}
        //                 keyboardType={"number-pad"}
        //                 placeholder="Ex: R$ 10,00"
        //                 placeholderTextColor={'#808080'}
        //                 style={[Style.inputSearch, {fontSize: 25}]}
        //                 value={this.state.value}
        //                 onChangeText={text => {
        //                     this.setState({
        //                         value: text
        //                     })
        //                 }}
        //             />
        //             <Text allowFontScaling={false} style={Style.sendAvailable}>saldo: {account.conta.saldo ? account.conta.saldo.saldo : 'R$ 0,00'}</Text>
        //             <Text allowFontScaling={false} style={Style.sendWarn}>Cobramos uma taxa de transferência para outros bancos de
        //                 R$ {bankSettings.TAXA_USUARIO ? parseFloat(bankSettings.TAXA_USUARIO).toFixed(2).toString().replace('.', ',') : bankSettings.TAXA_PADRAO.replace('.', ',')}</Text>
        //
        //             <TouchableOpacity
        //                 activeOpacity={0.3}
        //                 style={Style.sendGo}
        //                 onPress={() => this.checkToNextStep()}
        //             >
        //                 <LinearGradient
        //                     colors={[buttonBoxes, buttonTwoBoxes]}
        //                     start={{x: 0.5, y: 1.3}}
        //                     end={{x: -0.9, y: -2.5}}
        //                     locations={[0, 0.3, 0.7]}
        //                     style={Style.goButton}
        //                 >
        //                     <AntDesign style={[Style.centerAll, {
        //                         marginTop: 20,
        //                         fontSize: 22
        //                     }]} name={'right'} color={defaultTextColor} />
        //                 </LinearGradient>
        //             </TouchableOpacity>
        //         </Content>
        //     </Container>
        // )
    }

    async checkToNextStep() {
        const {account, bankSettings, navigation, setTransferInfo} = this.props;
        if (account && account.conta && !account.conta.saldo) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Você não possui saldo!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });

            return false;
        }

        let saldo = account.conta.saldo.saldo.replace(/\D+/g, '');
        let taxa = (bankSettings.TAXA_USUARIO ? parseFloat(bankSettings.TAXA_USUARIO).toFixed(2) : parseFloat(bankSettings.TAXA_PADRAO).toFixed(2)).replace(/\D+/g, '');
        let valor = this.state.value.replace(/\D+/g, '');
       
        if (this.conta.banco !== '000' && (valor) > (saldo - taxa)) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: `Você poderá transferir o valor máximo de ${Helpers.convertToMoney(saldo - taxa)}`,
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });

            this.setState({value: Helpers.convertToMoney(saldo - taxa)})
            return false;
        }
        this.goToConfirmPayment();
    }

    getHeaderContent() {
        const {favorites} = this.props;
        if (this.pessoa && typeof this.pessoa !== "undefined" && this.conta && typeof this.conta !== "undefined") {
            return (
                <View style={{height: 230, marginTop: 20}}>
                    <H1 allowFontScaling={false} style={[theme.h3_light_new]}>
                        {this.pessoa.nome_completo}
                    </H1>
                    <H1 allowFontScaling={false} style={[theme.h3_no_margin_light]}>
                        {this.pessoa.documento}
                    </H1>
                    {this.conta.tipo_chave==null &&
                    <H1 allowFontScaling={false} style={[theme.h3_light, {fontSize: 21}]}>
                        {this.conta.banco} - {this.getBankName(this.conta.banco)}
                    </H1>
                    }
                    {this.conta.tipo_chave==null &&
                    <H1 allowFontScaling={false} style={[theme.h3_no_margin_light, {fontSize: 21}]}>
                        Agência: {this.conta.agencia}
                    </H1>
                    }
                    {this.conta.tipo_chave==null &&
                    <H1 allowFontScaling={false} style={[theme.h3_no_margin_light, {fontSize: 21}]}>
                        Conta: {this.conta.conta} - {this.conta.digito}
                    </H1>
                    }
                    {this.conta.tipo_chave!=null &&
                    <H1 allowFontScaling={false} style={[theme.h3_light_new, {fontSize: 21}]}>
                        Tipo Chave: {this.conta.tipo_chave.nome}
                    </H1>
                    }
                    {this.conta.tipo_chave!=null &&
                    <H1 allowFontScaling={false} style={[theme.h3_no_margin_light_new, {fontSize: 21}]}>
                        Valor da chave: {this.conta.chave} {console.log(this.conta)} 
                    </H1>
                    }

                </View>
            )
        }
        return (
            <View>
                <H1 allowFontScaling={false} style={[theme.h3_light]}>
                    Recentes
                </H1>
                <View style={{marginHorizontal: 0}}>
                    <List>
                        {favorites && favorites.slice(0, 2).map(favorito => {
                            return (
                                <ListItem onPress={() => null} first>
                                    <Body>
                                        <H3 allowFontScaling={false} style={[theme.h1]}>
                                            {favorito.nome_completo}
                                        </H3>
                                        <Text allowFontScaling={false} style={[theme.h1, {fontSize: 12}]} note>
                                            CPF/CNPJ: {favorito.documento}
                                        </Text>
                                    </Body>
                                </ListItem>
                            )
                        })}
                    </List>
                </View>
                <List style={{marginHorizontal: -17}}>
                    <ListItem onPress={() => this.props.navigation.navigate('Favored')} last={true} first={true}>
                        <Body>
                            <H3 allowFontScaling={false} style={[theme.h1]}>
                                Adicionar outro
                            </H3>
                            <Text allowFontScaling={false} style={[theme.h1, {fontSize: 14}]} note>
                                Selecione uma nova conta
                            </Text>
                        </Body>
                        <Right>
                            <AntDesign style={[theme.centerAll, {
                                fontSize: 22
                            }]} name={'right'} color={defaultTextColor} />
                        </Right>
                    </ListItem>
                </List>
            </View>
        )
    }

    getBankName(banco) {
        let nome_banco = this.props.banks.find(banklist => banklist.id === banco);
        return nome_banco.name;
    }

    alertClose() {
        this.setState({showAlert: false})
    }

    prepareRequestPix(){
        console.log('Dados abaixo');
        if(this.conta.tipo_chave!=null){
            if(this.conta.tipo_chave.id==1){//cpfcnpj
                if(this.conta.chave.length <= 14){
                     this.conta.tipo_chave.nome='CPF';
                }else{
                 this.conta.tipo_chave.nome='CNPJ';
                }
             }if(this.conta.tipo_chave.id==2){
                this.conta.tipo_chave.nome='TELEFONE';
             }if(this.conta.tipo_chave.id==3){
                this.conta.tipo_chave.nome='EMAIL';
             }if(this.conta.tipo_chave.id==4){
                this.conta.tipo_chave.nome='CHAVE_ALEATORIA';
             }
        }
    }

    goToConfirmPayment() {
        if (!this.state.value) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Preencha o valor e tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });

            return false;
        }
       
        this.prepareRequestPix();

        let data = {
            valor: this.state.value,
            nome: this.pessoa.nome_completo,
            document: this.pessoa.documento,
            agencia: this.conta.agencia,
            conta: this.conta.conta,
            digito: this.conta.digito,
            tipo_conta: this.state.tipo_conta,
            tipo_chave:this.conta.tipo_chave,
            chave:this.conta.chave,
            pix_key_type:this.conta.tipo_chave==null ? null : this.conta.tipo_chave.nome,
            pix_key:this.conta.chave,
            banco: {
                name: this.conta.banco!=null ? this.getBankName( this.conta.banco) : '',
                id: this.conta.banco!=null ? this.conta.banco : '',
            }
        }

        this.conta = this.pessoa = null;

        this.props.navigation.replace('confirmPayment', {transfer: data});
    }
}


const mapStateToProps = state => {
    return {
        account: state.account ? state.account.data : null,
        bankSettings: state.bankSettings,
        favorites: state.favorites,
        banks: state.banks
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({setTransferInfo, clearTransfer, favoritesFetch, accountFetch}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transfer);

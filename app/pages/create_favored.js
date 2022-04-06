import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Header,
    Right,
    Left,
    Body,
    Container,
    Content,
    H1,
    Text,
    View,
    Input,
    H3
} from "native-base";
import {
    StatusBar,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {darkButton, defaultTextColor, degrade_primario, lightButton} from "../style/pallet";
import AntDesign from "react-native-vector-icons/AntDesign";
import theme from "../style/theme";
import {banksFetch} from '../store/Banks'
import {favoritesStore} from '../store/favorites';
import Select2 from "react-native-select-two";
import Loading from "../components/common/Loading";
import {TextInputMask} from "react-native-masked-text";
import {Helpers} from "../components/helpers";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

class CreateFavored extends Component {
    state = {
        alert: {},
        loading: true,
        banco: null,
        tipo_conta: null,
        agencia: null,
        conta: null,
        digito: null,
        titular: null,
        nome_completo: null,
        documento: null,
        isPhysicalPerson: true,
        id_favorito:null,
        tiposConta: [
            {
                id: 1,
                name: 'Conta corrente'
            },
            {
                id: 2,
                name: 'Conta poupança'
            }
        ]
    };

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        if (this.props.navigation.getParam('documento')) {
            this.documento = this.props.navigation.getParam('documento').replace(/\D+/g, '');
            this.nome_completo = this.props.navigation.getParam('nome_completo');
        }
    }

    async componentDidMount() {
        const {banks} = this.props;
        this.setState({banks: banks}, function () {
            if (this.documento && this.nome_completo) {
                this.setState({documento: this.documento, nome_completo: this.nome_completo});
            }
            this.setState({loading: false});
        }.bind(this));
    }

    async storeFavorite() {
        const {favoritesStore} = this.props;
        this.setState({loading: true})

        await favoritesStore({
            documento: this.state.documento,
            nome_completo: this.state.nome_completo,
            agencia: this.state.agencia,
            digito: this.state.digito,
            conta: this.state.conta,
            tipo_conta: this.state.tipo_conta,
            banco: this.state.banco,
            id_favorito:this.props.navigation.getParam('id_favorito')
        });
        if (this.props.favorites.status === 'success') {

            let pessoa = this.montarPessoa();
            let conta = this.montarConta();

            // this.props.navigation.replace('Favored');
            this.props.navigation.replace('Transfer', {pessoa, conta});

        } else {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: this.props.favorites.data || 'Erro ao efetuar cadastro',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
        }
        this.setState({loading: false});
    }

    validate() {
        if (this.state.banco !== '000' && (!this.state.banco ||
            !this.state.tipo_conta ||
            !this.state.agencia ||
            !this.state.conta ||
            !this.state.digito ||
            !this.state.nome_completo ||
            !this.state.documento)
        ) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Preencha todos os campos e tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });

            return false;
        } else if (this.state.banco === '000')

            if (this.state.banco !== '000' && !Helpers.validateName(this.state.nome_completo)) {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'Informe um nome correto e tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle',
                    };
                    data.showAlert = true;
                    return data;
                });

                return false;
            }

        if (this.state.banco !== '000' && (!(Helpers.validarCPF(this.state.documento) || Helpers.validCnpj(this.state.documento)))) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Informe um CPF/CNPJ correto e tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle',
                };
                data.showAlert = true;
                return data;
            });
            return false;
        }

        if (this.state.banco !== '000' && this.state.agencia.length < 4) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Informe uma agência correta e tente novamente!',
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

    alertClose() {
        this.setState({showAlert: false})
    }

    montarConta(){

        return {
            "agencia":this.state.agencia==null ? this.props.favorites.data.agencia: this.state.agencia,
            "digito": this.state.digito==null ? this.props.favorites.data.digito: this.state.digito,
            "conta": this.state.conta==null ? this.props.favorites.data.conta: this.state.conta,
            "tipo_conta": this.state.tipo_conta==1? 'Conta corrente' : 'Conta poupança',
            "banco": this.state.banco,
            "id_favorito":this.state.id_favorito
        }
    }
    montarPessoa(){

        return {
            "nome_completo":this.state.nome_completo==null ? this.props.favorites.data.favorito.nome_completo: this.state.nome_completo,
            "documento":this.state.documento,
        }
    }

    render() {
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
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                            Novo favorecido
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content style={{marginHorizontal: 30}}>
                    <H3 allowFontScaling={false} style={[theme.h3_black, {marginBottom: 10}]}>
                        Nome da instituição
                    </H3>
                    <Select2
                        allowFontScaling={false}
                        selectedTitleStyle={[{fontSize: 23}, theme.h1_dark, {color: '#616060'}]}
                        data={this.state.banks.map(banco => {
                            let nome_banco = banco.id + ' - ' + (banco.name.length > 20 ? banco.name.toString().substr(0, 20) + '...' : banco.name)
                            return {
                                id: banco.id,
                                name: nome_banco,
                                checked: banco.checked
                            }
                        })}
                        searchPlaceHolderText={'Selecione um banco'}
                        title={'Selecione um banco'}
                        listEmptyTitle={'Banco não encontrado'}
                        cancelButtonText={'Cancelar'}
                        selectButtonText={'Confirmar'}
                        defaultFontName={Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi'}
                        colorTheme={darkButton}
                        selected={[{id: '000', name: 'teste'}]}
                        isSelectSingle={true}
                        onSelect={(banco, object) => {

                            if(banco==0){
                                this.state.agencia=null;
                                this.state.conta=null;
                                this.state.digito=null;
                                this.state.nome_completo=null;
                            }
                            let banks = this.state.banks.map((value) => {

                               //quando usuário não selecionar nenhum banco e confirmar
                                if(object.length == 0){
                                    value.checked = false;
                                    return value;
                                }
                                //se houver banco marcado devido a navegação entre telas eu deixo ele selecionado
                                if (value.id === object[0].id) {
                                    value.checked = true;
                                    return value;
                                }
                                value.checked = false;
                                return value;
                            });

                            this.setState({banks, banco: banco[0]});
                        }}
                        onRemoveItem={(banco, object) => {
                            this.setState({banco: null})
                        }}
                    />
                    {this.state.banco !== '000' &&
                    <View>
                        <H3 allowFontScaling={false} style={[theme.h3_black, {marginBottom: 10}]}>
                            Tipo de conta
                        </H3>
                        <Select2
                            allowFontScaling={false}
                            selectedTitleStyle={[{fontSize: 23}, theme.h1_dark, {color: '#616060'}]}
                            data={this.state.tiposConta}
                            showSearchBox={false}
                            searchPlaceHolderText={'Selecione o tipo de conta'}
                            title={'Selecione tipo de conta'}
                            listEmptyTitle={'Banco não encontrado'}
                            cancelButtonText={'Cancelar'}
                            selectButtonText={'Confirmar'}
                            defaultFontName={Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi'}
                            colorTheme={darkButton}
                            isSelectSingle={true}
                            onSelect={(tipo_conta, object) => {
                                let tiposConta = this.state.tiposConta.map((value) => {

                                    //quando usuário não selecionar nenhum tipo conta e confirmar
                                    if(object.length == 0){
                                        value.checked = false;
                                        return value;
                                    }
                                    //se houver conta marcada devido a navegação entre telas eu deixo ele selecionado
                                    if (value.id === object[0].id) {
                                        value.checked = true;
                                        return value;
                                    }
                                    value.checked = false;
                                    return value;
                                });

                                this.setState({tiposConta, tipo_conta: tipo_conta[0]})
                            }}
                            onRemoveItem={tipo_conta => {
                                this.tipo_conta = tipo_conta[0];
                            }}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 0.55}]}>
                                Agência
                            </H3>
                            <View style={{flex: 0.05}} />
                            <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 1}]}>
                                Conta
                            </H3>
                            <View style={{flex: 0.05}} />
                            <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 0.3}]}>
                                Dig.
                            </H3>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Input
                                allowFontScaling={false}
                                disabled={this.state.loading}
                                keyboardType="numeric"
                                onChangeText={(agencia) => this.setState({agencia: agencia.replace(/[^0-9]/g, '')})}
                                value={this.state.agencia}
                                maxLength={4}
                                style={[theme.input, {flex: 0.55}]}
                            />
                            <View style={{flex: 0.05}} />
                            <Input
                                allowFontScaling={false}
                                disabled={this.state.loading}
                                keyboardType="number-pad"
                                onChangeText={(conta) => this.setState({conta: conta.replace(/[^0-9]/g, '')})}
                                value={this.state.conta}
                                maxLength={10}
                                style={[theme.input, {flex: 1}]}
                            />
                            <View style={{flex: 0.05}} />
                            <Input
                                allowFontScaling={false}
                                disabled={this.state.loading}
                                keyboardType="number-pad"
                                onChangeText={(digito) => this.setState({digito: digito.replace(/[^0-9]/g, '')})}
                                value={this.state.digito}
                                maxLength={1}
                                style={[theme.input, {flex: 0.3}]}
                            />
                        </View>
                    </View>}
                    <View style={{flex: 0.05}} />
                    {this.state.banco !== '000' && <View>
                        <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 0.3}]}>
                            Nome completo
                        </H3>
                        <Input
                            allowFontScaling={false}
                            disabled={this.state.loading}
                            onChangeText={(nome_completo) => this.setState({nome_completo})}
                            value={this.state.nome_completo}
                            style={[theme.input, {flex: 0.5}]}
                        />
                    </View>
                    }
                    <View style={{flex: 0.05}} />
                    <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 0.3}]}>
                        CPF ou CNPJ do favorecido
                    </H3>
                    <TextInputMask
                        allowFontScaling={false}
                        type={'custom'}
                        options={{
                            mask: this.state.isPhysicalPerson === true ? '999.999.999-99*' : '99.999.999/9999-99',
                            validator: value => {
                                return Helpers.validarCPF(value) || Helpers.validCnpj(value)
                            },
                        }}
                        keyboardType="number-pad"
                        disabled={this.state.loading}
                        style={[theme.input]}
                        value={this.state.documento}
                        onChangeText={documento => {
                            this.setState({documento, isPhysicalPerson: documento.length <= 14})
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => this.validate() && this.storeFavorite()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll,
                            {
                                marginTop: 20, flex: 0.5
                            }
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Cadastrar favorecido
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
    }
}


const mapStateToProps = state => {
        return {
            account: state.account ? state.account.data : null,
            bankSettings: state.bankSettings,
            favorites: state.favorites,
            banks: state.banks
        };
    }
;

const mapDispatchToProps = dispatch => {
        return bindActionCreators({banksFetch, favoritesStore}, dispatch);
    }
;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateFavored);

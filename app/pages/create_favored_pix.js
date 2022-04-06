import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
    H3,
} from 'native-base';
import {StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native';
import {
    darkButton,
    defaultTextColor,
    degrade_primario,
    lightButton,
} from '../style/pallet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../style/theme';
import {banksFetch} from '../store/Banks';
import {favoritesStore, getTypeKeys} from '../store/favorites';
import Select2 from 'react-native-select-two';
import Loading from '../components/common/Loading';
import {TextInputMask} from 'react-native-masked-text';
import {Helpers} from '../components/helpers';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class CreateFavoredPix extends Component {
    state = {
        alert: {},
        loading: true,
        banco: null,
        tipo_conta: null,
        titular: null,
        nome_completo: null,
        valor_da_chave: null,
        chave_selecionada: null,
        documento: null,
        celular: null,
        email: null,
        chave_aleatorio: null,
        isPhysicalPerson: true,
        typeKeys: null,
        tiposConta: [
            {
                id: 3,
                name: 'Pix',
            },
        ],
        tiposChave: [],
    };

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        if (this.props.navigation.getParam('documento')) {
            this.documento = this.props.navigation
                .getParam('documento')
                .replace(/\D+/g, '');
            this.nome_completo = this.props.navigation.getParam('nome_completo');
        }
    }

    async componentDidMount() {
        const {banks, getTypeKeys} = this.props;
        await getTypeKeys();
        const {favorites} = this.props;
        console.log(favorites.keys);
        this.state.tiposChave = favorites.keys.map((o, i) => {
            return {id: o.id, name: o.nome};
        });

        console.log(this.state.tiposChave);

        this.setState(
            {banks: banks},
            function() {
                if (this.documento && this.nome_completo) {
                    this.setState({
                        documento: this.documento,
                        nome_completo: this.nome_completo,
                    });
                }
                this.setState({loading: false});
            }.bind(this),
        );
    }

    async storeFavorite() {
        //alert('persistir')
        const {favoritesStore} = this.props;
        this.setState({loading: true});

        console.log(this.state.valor_da_chave);

        await favoritesStore({
            documento: this.state.documento,
            nome_completo: this.state.nome_completo,
            chave: this.state.valor_da_chave,
            agencia: null,
            digito: null,
            conta: null,
            tipo_conta: null,
            banco: null,
            tipo_chave: this.state.tipo_chave,
            id_favorito: this.props.navigation.getParam('id_favorito'),
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
        if (!this.state.nome_completo || !this.state.valor_da_chave) {
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
        } else if (this.state.chave_selecionada == 1) {
            //documento
            if (this.state.valor_da_chave.length > 14) {
                //cnpj
                if (!Helpers.validCnpj(this.state.valor_da_chave)) {
                    this.setState(data => {
                        data.alert = {
                            title: 'Oops',
                            subtitle: 'CNPJ inválido!',
                            theme: 'danger',
                            icone: 'closecircle',
                        };
                        data.showAlert = true;
                        return data;
                    });
                    return false;
                }
            } else {
                //cpf
                if (!Helpers.validarCPF(this.state.valor_da_chave)) {
                    this.setState(data => {
                        data.alert = {
                            title: 'Oops',
                            subtitle: 'CPF inválido!',
                            theme: 'danger',
                            icone: 'closecircle',
                        };
                        data.showAlert = true;
                        return data;
                    });
                    return false;
                }
            }
        } else if (this.state.chave_selecionada == 2) {
            //celular
            if (!Helpers.validateCellPhone(this.state.valor_da_chave)) {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'Telefone inválido!',
                        theme: 'danger',
                        icone: 'closecircle',
                    };
                    data.showAlert = true;
                    return data;
                });
                return false;
            }
        } else if (this.state.chave_selecionada == 3) {
            //email
            if (!Helpers.validateEmail(this.state.valor_da_chave)) {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'E-mail inválido!',
                        theme: 'danger',
                        icone: 'closecircle',
                    };
                    data.showAlert = true;
                    return data;
                });
                return false;
            }
        } else if (this.state.chave_selecionada == 4) {
            //aleatoria
            console.log('aleatoria');
        }

        return true;
    }

    alertClose() {
        this.setState({showAlert: false});
    }

    montarConta() {
        return {
            tipo_conta: 'Pix',
            chave: this.state.valor_da_chave.trim(),
            agencia: null,
            digito: null,
            conta: null,
            banco: null,
            tipo_chave: this.props.favorites.data.tipo_chave,
        };
    }
    montarPessoa() {
        return {
            nome_completo:
                this.state.nome_completo == null
                    ? this.props.favorites.data.favorito.nome_completo
                    : this.state.nome_completo,
            documento: this.state.documento,
        };
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        }
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity
                            style={{marginTop: 20}}
                            onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1
                            allowFontScaling={false}
                            style={[
                                theme.h1,
                                {marginTop: 15},
                                {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0},
                            ]}>
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
                    <View>
                        <H3
                            allowFontScaling={false}
                            style={[theme.h3_black, {marginBottom: 10}]}>
                            Tipo de chave
                        </H3>
                        <Select2
                            allowFontScaling={false}
                            selectedTitleStyle={[
                                {fontSize: 23},
                                theme.h1_dark,
                                {color: '#616060'},
                            ]}
                            data={this.state.tiposChave}
                            showSearchBox={false}
                            searchPlaceHolderText={'Selecione o tipo de chave'}
                            title={'Selecione tipo de chave'}
                            listEmptyTitle={'Chave não encontrada'}
                            cancelButtonText={'Cancelar'}
                            selectButtonText={'Confirmar'}
                            defaultFontName={
                                // eslint-disable-next-line no-undef
                                Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi'
                            }
                            colorTheme={darkButton}
                            isSelectSingle={true}
                            onSelect={(tipo_chave, object) => {
                                let tiposChave = this.state.tiposChave.map(value => {
                                    if (value.id === object[0].id) {
                                        this.state.chave_selecionada = value.id;
                                    }

                                    //quando usuário não selecionar nenhum tipo conta e confirmar
                                    if (object.length == 0) {
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

                                this.setState({tiposChave, tipo_chave: tipo_chave[0]});
                            }}
                            onRemoveItem={tipo_chave => {
                                this.tipo_chave = tipo_chave[0];
                            }}
                        />
                    </View>

                    {this.state.chave_selecionada == 1 && (
                        <View>
                            <H3
                                allowFontScaling={false}
                                style={[theme.h3_black, {marginBottom: 10}]}>
                                Chave CPF/CNPJ
                            </H3>

                            <TextInputMask
                                allowFontScaling={false}
                                type={'custom'}
                                options={{
                                    mask:
                                        this.state.isPhysicalPerson === true
                                            ? '999.999.999-99*'
                                            : '99.999.999/9999-99',
                                    // validator: value => {
                                    //     return Helpers.validarCPF(value) || Helpers.validCnpj(value)
                                    // },
                                }}
                                keyboardType="number-pad"
                                disabled={this.state.loading}
                                style={[theme.input]}
                                value={this.state.valor_da_chave}
                                onChangeText={valor_da_chave => {
                                    this.setState({
                                        valor_da_chave,
                                        isPhysicalPerson: valor_da_chave.length <= 14,
                                    });
                                }}
                            />
                        </View>
                    )}

                    {this.state.chave_selecionada == 2 && (
                        <View>
                            <H3
                                allowFontScaling={false}
                                style={[theme.h3_black, {marginBottom: 10}]}>
                                Chave Celular
                            </H3>

                            <TextInputMask
                                allowFontScaling={false}
                                type={'custom'}
                                options={{
                                    mask: '(99) 99999-9999',
                                }}
                                keyboardType="number-pad"
                                disabled={this.state.loading}
                                style={[theme.input]}
                                value={this.state.valor_da_chave}
                                onChangeText={valor_da_chave => {
                                    this.setState({valor_da_chave, valor_da_chave});
                                }}
                            />
                        </View>
                    )}
                    {this.state.chave_selecionada == 3 && (
                        <View>
                            <H3
                                allowFontScaling={false}
                                style={[theme.h3_black, {marginBottom: 10}]}>
                                Chave E-mail
                            </H3>

                            <Input
                                allowFontScaling={false}
                                disabled={this.state.loading}
                                style={[theme.input]}
                                value={this.state.valor_da_chave}
                                onChangeText={valor_da_chave => {
                                    this.setState({valor_da_chave, valor_da_chave});
                                }}
                            />
                        </View>
                    )}

                    {this.state.chave_selecionada == 4 && (
                        <View>
                            <H3
                                allowFontScaling={false}
                                style={[theme.h3_black, {marginBottom: 10}]}>
                                Chave Aleatória
                            </H3>

                            <Input
                                allowFontScaling={false}
                                disabled={this.state.loading}
                                style={[theme.input]}
                                value={this.state.valor_da_chave}
                                onChangeText={valor_da_chave => {
                                    this.setState({valor_da_chave, valor_da_chave});
                                }}
                            />
                        </View>
                    )}

                    <View style={{flex: 0.05}} />
                    {this.state.banco !== '000' && (
                        <View>
                            <H3
                                allowFontScaling={false}
                                style={[theme.h3_black, {flex: 0.3}]}>
                                Nome
                            </H3>
                            <Input
                                allowFontScaling={false}
                                disabled={false}
                                onChangeText={nome_completo => this.setState({nome_completo})}
                                value={this.state.nome_completo}
                                style={[theme.input, {flex: 0.5}]}
                            />
                        </View>
                    )}
                    <View style={{flex: 0.05}} />
                    {/* <H3 allowFontScaling={false} style={[theme.h3_black, {flex: 0.3}]}>
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
                    /> */}
                    <TouchableOpacity
                        onPress={() => this.validate() && this.storeFavorite()}
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark,
                            theme.centerAll,
                            {
                                marginTop: 20,
                                flex: 0.5,
                            },
                        ]}>
                        {this.state.loading && (
                            <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === 'ios' ? 'large' : 50}
                            />
                        )}
                        <H3
                            allowFontScaling={false}
                            style={[theme.centerAll, theme.h3_light]}>
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
                    headerIconComponent={
                        this.state.alert.icon || (
                            <AntDesign
                                name={this.state.alert.icone || 'info'}
                                size={35}
                                color={'#fff'}
                            />
                        )
                    }>
                    <SCLAlertButton
                        theme={this.state.alert.theme || 'info'}
                        onPress={this.alertClose.bind(this)}>
                        Ok
                    </SCLAlertButton>
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
        banks: state.banks,
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {banksFetch, favoritesStore, getTypeKeys},
        dispatch,
    );
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateFavoredPix);

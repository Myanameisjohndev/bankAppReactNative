import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Loading from "../../components/common/Loading";
import {View, StatusBar, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import Style from '../../style/style';
import {TextInputMask} from 'react-native-masked-text'
import {Helpers} from "../../components/helpers";
import {setTransferInfo, findAccount} from "../../store/transfer";
import {AlertHelper} from "../../components/AlertHelper";
import {Header, Right, Left, Body, Container, Content} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import {defaultTextColor, gradientBackgroundBase} from "../../style/pallet";

class ReceiverAccount extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }
    state = {loading: true};

    componentDidMount() {
        this.setState({loading: false});
    }

    render() {
        if (this.state.loading) return <Loading />;
        return (
            <Container>
                <Header noShadow style={{
                    backgroundColor: gradientBackgroundBase,
                    marginTop: Platform.OS === 'ios' ? 0 : 24
                }}>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content scrollEnabled={true} style={Style.generalViews}>
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                    />
                    <Text style={Style.sendTitle}>Informações bancárias</Text>
                    <TextInputMask
                        type={'custom'}
                        options={{
                            mask: this.state.isPhysicalPerson === true ? '999.999.999-99*' : '99.999.999/9999-99',
                            validator: value => {
                                return Helpers.validarCPF(value) || Helpers.validCnpj(value)
                            },
                        }}
                        keyboardType="number-pad"
                        style={[Style.inputSearch]}
                        placeholder={"CPF/CNPJ"}
                        value={this.state.document}
                        returnKeyType="next"
                        onChangeText={text => {
                            this.setState({
                                document: text,
                                isPhysicalPerson: text.length <= 14
                            }, function () {
                                if (text.replace(/[^0-9]/g, '').length === 11 || text.replace(/[^0-9]/g, '').length === 14) {
                                    this.checkDocument();
                                }

                            }.bind(this))
                        }}
                    />
                    <TextInput
                        returnKeyType={'next'}
                        autoCompleteType={'name'}
                        textContentType={'name'}
                        style={Style.inputSearch}
                        placeholder={'Nome completo'}
                        onChangeText={(nome) => this.setState({nome})}
                        value={this.state.nome}
                    />

                    <TextInput
                        returnKeyType={'next'}
                        ref={(input) => {
                            this.ThirdTextInput = input;
                        }}
                        onSubmitEditing={() => {
                            this.FourthTextInput.focus();
                        }}
                        keyboardType={'numeric'}
                        style={Style.inputSearch}
                        placeholder={'Agência'}
                        value={this.state.agencia}
                        onChangeText={(agencia) => this.setState({agencia})}
                    />
                    <View style={{flexDirection: "row", paddingRight: '3%', paddingLeft: '3%'}}>
                        <TextInput
                            returnKeyType={'next'}
                            ref={(input) => {
                                this.FourthTextInput = input;
                            }}
                            onSubmitEditing={() => {
                                this.FifthTextInput.focus();
                            }}
                            keyboardType={'numeric'}
                            style={[Style.inputSearch, {flex: 1}]}
                            placeholder={'Conta'}
                            maxLength={12}
                            value={this.state.conta}
                            onChangeText={(conta) => this.setState({conta})}
                        />
                        <View style={{flex: 0.1}}>

                        </View>
                        <TextInput
                            ref={(input) => {
                                this.FifthTextInput = input;
                            }}
                            keyboardType={'numeric'}
                            maxLength={1}
                            style={[Style.inputSearch, {flex: 0.5}]} placeholder={'Dígito'} value={this.state.digito}
                            onChangeText={(digito) => this.setState({digito})}
                        />

                    </View>
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={Style.sendFinish}
                            onPress={() => this.goToAuth()}
                        >
                            <Image
                                source={require('../../../assets/img/arrowRound.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }

    goToAuth() {
        const {setTransferInfo} = this.props;
        Object.keys(this.state).forEach(async ele => {
            if (ele === 'loading') return true;
            await setTransferInfo(ele, (this.state[ele]).toString().toUpperCase());
        });
        if (!this.validate(this.state)) return false;
        this.props.navigation.navigate('confirmPayment');
    }

    validate(data) {
        if (data.nome === '' || data.nome === null || typeof data.nome === 'undefined' || data.nome.length < 3) {
            AlertHelper.show('warn', 'Ops', 'O campo nome deve ser preenchido corretamente');
            return false;
        }

        if (data.document === '' || data.document === null || typeof data.document === 'undefined' || (!Helpers.validCnpj(data.document) && !Helpers.validarCPF(data.document))) {
            AlertHelper.show('warn', 'Ops', 'CPF/CNPJ inválido.');
            return false;
        }

        if (data.agencia === '' || data.agencia === null || typeof data.agencia === 'undefined' || data.agencia.length !== 4) {
            AlertHelper.show('warn', 'Ops', 'O campo agência deve ser preenchido corretamente com 4 dígitos');
            return false;
        }


        if (data.digito === '' || data.digito === null || typeof data.digito === 'undefined' || data.digito.length !== 1) {
            AlertHelper.show('warn', 'Ops', 'O campo digito deve ser preenchido corretamente com 1 dígito.');
            return false;
        }


        if (data.conta === '' || data.conta === null || typeof data.conta === 'undefined' || data.conta.length < 3) {
            AlertHelper.show('warn', 'Ops', 'O campo conta deve ser preenchido corretamente');
            return false;
        }


        return true;
    }

    async checkDocument() {
        const {findAccount, transfer} = this.props;
        let dados = await findAccount(this.state.document.replace(/\D+/g, ''), transfer.banco.id);
        if (dados.status === 'success') {
            const {data} = dados;
            this.setState({
                conta: data.conta.id.toString().padStart(4, '0'),
                digito: data.conta.digito ? data.conta.digito.toString() : '1',
                agencia: data.conta.agencia.toString().padStart(4, '0'),
                nome: data.pessoa.nome
            })
        }
    }
}

const mapStateToProps = state => {
    return {transfer: state.transfer, bankSettings: state.bankSettings};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({setTransferInfo, findAccount}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReceiverAccount);
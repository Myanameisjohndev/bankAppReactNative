import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    ScrollView,
    AsyncStorage
} from 'react-native';
import Style from '../../style/style';
import {TextInputMask} from "react-native-masked-text";
import {Helpers} from "../../components/helpers";
import {AlertHelper} from "../../components/AlertHelper";
import {Container, Content, Header, Input, H1, Card, H3, Item} from 'native-base';
import theme from "../../style/theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {text_light} from "../../style/pallet";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import AntDesign from "react-native-vector-icons/AntDesign";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { getTrackingStatus,requestTrackingPermission } from 'react-native-tracking-transparency';

class FirstStep extends Component {
    state = {
        documento: null,
        nome: null,
        email: null,
        telefone: null,
        isPhysicalPerson: true,
        alert: {},
        showAlert: false,
        statusTracking:true // não tem uso

    };

    constructor(props) {
        super(props);
        const {navigation, next} = this.props;
        this.navigation = navigation;
        this.next = next;
    }

    validate() {
        if (!this.state.documento || !this.state.nome || !this.state.email || !this.state.telefone) {
            this.setState(data => {
                data.alert = {
                    title: 'Oops',
                    subtitle: 'Preencha todos os campos e tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });

            return false;
        }

        if (!this.state.isPhysicalPerson) {
            if (!this.state.cpf_titular || !this.state.nome_titular) {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'Preencha todos os campos e tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });

                return false;
            }

            if (!Helpers.validarCPF(this.state.cpf_titular)) {
                this.setState(data => {
                    data.alert = {
                        title: 'Oops',
                        subtitle: 'CPF do proprietário incorreto, verifique e tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });

                return false;
            }
        }

        if (!Helpers.validCnpj(this.state.documento) && !Helpers.validarCPF(this.state.documento)) {
            let msg = this.state.isPhysicalPerson ? 'CPF inválido. Tente novamente!' : 'CNPJ inválido. Tente novamente!'
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: msg,
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false;
        }

        if (!Helpers.validateName(this.state.nome)) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Nome inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false;
        }


        if (!Helpers.validateEmail(this.state.email)) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'E-mail inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false;
        }


        if (!Helpers.validateCellPhone(this.state.telefone)) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Celular inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
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

    async componentDidMount() {
        const requestTracking =  await this.requestTrackingPermission();
        if(requestTracking==='authorized' || requestTracking==='unavailable' ){
            this.setState({statusTracking: false});
        }
    }

    async getTrackingStatus() {
        return await getTrackingStatus();
    }
    async requestTrackingPermission(){
        return await requestTrackingPermission();
    }

    render() {

        return (
            <Container>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <Content style={{marginHorizontal: 5}} padder>
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: wp('60%'), paddingTop:5 , marginTop: 60, fontSize: 35}]}>
                        Cadastro
                    </H1>
                    <H1 style={[theme.h3, {maxWidth: wp('60%'), marginTop: 0}]}>
                        Vamos começar!
                    </H1>
                    <Card transparent style={{marginTop: hp('5%')}}>
                        <View>
                            <H3 style={theme.fontDefault}>
                                CPF ou CNPJ
                            </H3>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: this.state.isPhysicalPerson === true ? '999.999.999-99*' : '99.999.999/9999-99',
                                    validator: value => {
                                        return Helpers.validarCPF(value) || Helpers.validCnpj(value)
                                    },
                                }}
                                keyboardType="number-pad"
                                style={[theme.input]}
                                value={this.state.documento}
                                onChangeText={documento => {
                                    this.setState({documento, isPhysicalPerson: documento.length <= 14})
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                {this.state.isPhysicalPerson ? 'Nome completo' : 'Razão social'}
                            </H3>
                            <TextInput
                                onChangeText={(value) => this.setState({nome: value})}
                                value={this.state.nome}
                                style={theme.input}
                            />
                        </View>
                        {!this.state.isPhysicalPerson && <View>
                            <View style={{marginTop: 20}}>
                                <H3 style={theme.fontDefault}>
                                    CPF do proprietário
                                </H3>
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999.999.999-99',
                                        validator: value => {
                                            return Helpers.validarCPF(value)
                                        },
                                    }}
                                    keyboardType="number-pad"
                                    style={[theme.input]}
                                    value={this.state.cpf_titular}
                                    onChangeText={cpf_titular => {
                                        this.setState({cpf_titular})
                                    }}
                                />
                            </View>
                            <View style={{marginTop: 20}}>
                                <H3 style={theme.fontDefault}>
                                    Nome do proprietário
                                </H3>
                                <TextInput
                                    onChangeText={(value) => this.setState({nome_titular: value})}
                                    value={this.state.nome_titular}
                                    style={theme.input}
                                />
                            </View>
                        </View>}
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                E-mail
                            </H3>
                            <TextInput
                                keyboardType={"email-address"}
                                value={this.state.email}
                                onChangeText={(email) => this.setState({email})}
                                style={theme.input}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Número de celular
                            </H3>

                            <View style={{flexDirection: 'row'}}>
                                <TextInputMask
                                    style={theme.input}
                                    type={'cel-phone'}
                                    keyboardType={"phone-pad"}
                                    value={this.state.telefone}
                                    onChangeText={text => {
                                        this.setState({
                                            telefone: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </Card>
                    <TouchableOpacity
                        onPress={() => this.validate() && this.next(this.state)}
                        style={[theme.buttonDark, theme.centerAll, {marginTop: 20}]}
                    >
                        <H3 style={[theme.centerAll, theme.h3_light]}>
                            Próximo {" "}
                            <FontAwesome name={'long-arrow-right'} style={{fontSize: 22}} color={text_light} />
                        </H3>
                    </TouchableOpacity>
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
}

export default FirstStep;

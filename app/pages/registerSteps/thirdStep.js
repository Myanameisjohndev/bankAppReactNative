import React, {Component} from 'react';
import {Text, ScrollView, StatusBar, TextInput, FlatList, TouchableOpacity, Linking} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Style from '../../style/style';
import {
    aceitouTermos,
    boxes,
    buttonBoxes,
    buttonTwoBoxes,
    darkButton,
    defaultTextColor,
    gradPurpleLight,
    text_light,
} from '../../style/pallet';
import Select2 from "react-native-select-two";
import AntDesign from "react-native-vector-icons/AntDesign";
import {CheckBox, Radio} from 'native-base';
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Container, Content, View, H1, H3, Card, Input, Picker} from 'native-base';
import theme from "../../style/theme";
import {TextInputMask} from "react-native-masked-text";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class ThirdStep extends Component {
    state = {alert: {}, showAlert: false , aceitar:false , url:""};

    constructor(props) {
        super(props);
        const {navigation, next} = this.props;
        this.navigation = navigation;
        this.next = next;
    }

    alertClose() {
        this.setState({showAlert: false})
    }


    validate() {
        this.setState({loading: true});
        if (!this.state.cep || !this.state.logradouro || !this.state.complemento || !this.state.bairro || !this.state.cidade || !this.state.estado) {
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
            this.setState({loading: false});
            return false;
        }

        if (!this.state.cep) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'CEP inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (!this.state.logradouro) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Logradouro inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (!this.state.complemento) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Complemento inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });

            this.setState({loading: false});
            return false;
        }

        if (!this.state.bairro) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Bairro inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (!this.state.cidade) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Cidade inválida. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (!this.state.estado) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Estado inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        if (this.state.aceitar==false) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido',
                    subtitle: 'Aceite os termos do aplicativo para continuar',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            this.setState({loading: false});
            return false;
        }

        return true;
    }

    openUrl = () => {
        Linking.canOpenURL(aceitouTermos).then(supported => {
            if (supported) {
                Linking.openURL(aceitouTermos);
            } else {
                console.log("Don't know how to open URI: " + aceitouTermos);
            }
        });
    };

    render() {
        return (
            <Container>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <Content style={{marginHorizontal: 5}} padder>
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: wp('60%'), paddingTop:10 ,marginTop: 60, fontSize: 35}]}>
                        Cadastro

                    </H1>
                    <H1 style={[theme.h3, {marginTop: 0}]}>
                        Precisamos das últimas informações
                    </H1>
                    <Card transparent style={{marginTop: hp('2%')}}>
                        <View>
                            <H3 style={theme.fontDefault}>
                                CEP
                            </H3>
                            <TextInputMask
                                type={'zip-code'}
                                keyboardType="number-pad"
                                style={[theme.input]}
                                value={this.state.cep}
                                onChangeText={async cep => {
                                    this.setState({cep});
                                    if (cep.length === 9) {
                                        await this.searchCEP(cep);
                                    }
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Logradouro
                            </H3>
                            <Input

                                onChangeText={(logradouro) => this.setState({logradouro})}
                                style={theme.input}
                                value={this.state.logradouro}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Número (Opcional)
                            </H3>
                            <Input
                                //keyboardType="numeric"
                                onChangeText={(numero) => this.setState({numero})}
                                style={theme.input}
                                value={this.state.numero}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Complemento
                            </H3>
                            <Input
                                onChangeText={(complemento) => this.setState({complemento})}
                                style={theme.input}
                                value={this.state.complemento}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Bairro
                            </H3>
                            <Input
                                onChangeText={(bairro) => this.setState({bairro})}
                                style={theme.input}
                                value={this.state.bairro}
                            />
                        </View>
                        <View style={{marginTop: 20, flexDirection: 'row'}}>
                            <H3 style={[{flex: 1}, theme.fontDefault]}>
                                Cidade
                            </H3>

                            <View style={{flex: 0.2}} />
                            <H3 style={[{flex: 0.29}, theme.fontDefault]}>
                                UF
                            </H3>
                        </View>
                        <View style={{marginTop: 0, flexDirection: 'row' , flex:1}}>
                            <Input
                                style={[ theme.input  , {flex: 0.8, backgroundColor: '#f3f1f1'}]}
                                value={this.state.cidade}
                            />
                            <View style={{flex: 0.009}} />
                            <Input
                                style={[ theme.input,  {flex: 0.2, maxWidth: 75, backgroundColor: '#f3f1f1'}]}
                                value={this.state.estado}
                            />
                        </View>


                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <Text allowFontScaling={false} style={[{flex: 0.8, fontSize: 20}, theme.fontRegular]}>
                                Li e concordo com os {" "}

                                    <H3 onPress={this.openUrl} style={[{flex: 1}, theme.fontDefault]}>
                                         termos
                                    </H3>

                            </Text>

                            <View style={{flex: 0.2 , marginTop:5}}>
                                <CheckBox color={darkButton} checked={this.state.aceitar} onPress={() => this.setState({aceitar: !this.state.aceitar})} />
                            </View>

                        </View>



                    </Card>
                    <TouchableOpacity
                        onPress={() => !this.state.loading && this.validate() && this.next(this.state)}
                        disabled={this.state.loading}
                        style={[this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll, {marginTop: 20}]}
                    >
                        <H3 style={[theme.centerAll, theme.h3_light]}>
                            Concluir {" "}
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

    async searchCEP(cep) {
        try {
            let url = 'https://viacep.com.br/ws/' + cep.replace(/[^0-9]/g, '') + '/json/';
            let data = await fetch(url).then(res => res.json());
            this.setState({
                cidade: data.localidade,
                bairro: data.bairro,
                estado: data.uf,
                logradouro: data.logradouro,
                complemento: data.complemento
            })
        } catch (e) {

        }
    }
}

export default ThirdStep;

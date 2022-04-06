import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import Style from '../../style/style';
import {boxes, buttonBoxes, buttonTwoBoxes, darkButton, defaultTextColor, text_light} from "../../style/pallet";
import AntDesign from "react-native-vector-icons/AntDesign";
import {AlertHelper} from "../../components/AlertHelper";
import Modal from "react-native-modal";
import moment from "moment";
import {TextInputMask} from "react-native-masked-text";
import {Container, Content, View, H1, H3, Card, Input, Picker} from 'native-base';
import theme from "../../style/theme";
import Select2 from "react-native-select-two";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";

let generoData = [
    {id: 1, name: 'Masculino'},
    {id: 2, name: 'Feminino'},
];

let estadosCivisData = [
    {id: 'Solteiro', name: 'Solteiro'},
    {id: 'Casado', name: 'Casado'},
    {id: 'Viúvo', name: 'Viúvo'},
    {id: 'Separado judicialmente', name: 'Separado judicialmente'},
    {id: 'Divorciado', name: 'Divorciado'},
];

class SixthStep extends Component {
    state = {alert: {}, showAlert: false};

    constructor(props) {
        super(props);
        const {navigation, next} = this.props;
        this.navigation = navigation;
        this.next = next;
        this.setState({genero: null})
        this.setState({estado_civil: null})
    }


    validate() {
        if (!this.state.rg || !this.state.data_nascimento || !this.state.nome_mae ) {
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

        if (!this.state.rg || this.state.rg.length < 3) {
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


        if (!this.state.data_nascimento || this.isNotOfLegalAge()) {
            this.setState(data => {
                    data
                        .alert = {
                        title: 'Campo inválido!',
                        subtitle: 'Data de nascimento inválida ou não permitido(a). Tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                }
            )
            ;
            return false;
        }

        if (this.state.data_nascimento) {
            let datas = this.state.data_nascimento.split('/');
            if (datas[0] === '00' || datas[0] > '31' && datas[1] !== '02' || datas[1] === '02' && datas[0] > '29') {
                this.setState(data => {
                    data.alert = {
                        title: 'Campo inválido!',
                        subtitle: 'Dia de nascimento inválida. Tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });
                return false;
            }

            if (datas[1] === '00' || datas[1] > 12) {
                this.setState(data => {
                    data.alert = {
                        title: 'Campo inválido!',
                        subtitle: 'Mês de nascimento inválido. Tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });
                return false;
            }


            if (datas[2] === '0000') {
                this.setState(data => {
                    data.alert = {
                        title: 'Campo inválido!',
                        subtitle: 'Ano de nascimento inválido. Tente novamente!',
                        theme: 'danger',
                        icone: 'closecircle'
                    }
                    data.showAlert = true;
                    return data;
                });
                return false;
            }
        }

        if (!this.state.nome_mae || this.state.nome_mae.length < 3) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido!',
                    subtitle: 'Nome da mãe inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false;
        }

        /*

        if (!this.state.genero) {
            this.setState(data => {
                data.alert = {
                    title: 'Campo inválido!',
                    subtitle: 'Gênero inválido. Tente novamente!',
                    theme: 'danger',
                    icone: 'closecircle'
                }
                data.showAlert = true;
                return data;
            });
            return false;
        }

         */

        return true;
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
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: '60%', paddingTop:10 ,marginTop: 60, fontSize: 35}]}>
                        Cadastro

                    </H1>
                    <H1 style={[theme.h3, {maxWidth: '60%', marginTop: 0}]}>
                        Estamos quase lá!
                    </H1>
                    <Card transparent style={{marginTop: '15%'}}>
                        <View>
                            <H3 style={theme.fontDefault}>
                                Número do RG
                            </H3>
                            <Input
                                keyboardType="numeric"
                                onChangeText={(rg) => this.setState({rg})}
                                style={theme.input}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Data de nascimento
                            </H3>
                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'DD/MM/YYYY'
                                }}
                                keyboardType={"number-pad"}
                                value={this.state.data_nascimento}
                                onChangeText={(data_nascimento) => this.setState({data_nascimento})}
                                style={theme.input}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Nome da mãe
                            </H3>
                            <Input
                                onChangeText={(nome_mae) => this.setState({nome_mae})}
                                style={theme.input}
                                value={this.state.nome_mae}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Gênero
                            </H3>
                            <Select2
                                onChangeText={(nome_mae) => this.setState({nome_mae})}
                                style={[theme.input]}
                                selectedTitleStyle={{fontSize: 22}}
                                data={generoData}
                                showSearchBox={false}
                                cancelButtonText={'Cancelar'}
                                selectButtonText={'Confirmar'}
                                searchPlaceHolderText={'Selecione um gênero'}
                                title={'Selecione um gênero'}
                                listEmptyTitle={'Gênero não encontrado'}
                                defaultFontName={Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi'}
                                colorTheme={darkButton}
                                isSelectSingle={true}
                                onSelect={genero => {
                                    if(genero[0]!==undefined){
                                        let name = generoData[genero[0] - 1].name;
                                        this.setState({genero: name});
                                    }

                                }}
                                onRemoveItem={genero => {
                                    this.setState({genero: null})
                                }}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <H3 style={theme.fontDefault}>
                                Estado civíl
                            </H3>
                            <Select2
                                onChangeText={(nome_mae) => this.setState({nome_mae})}
                                style={[theme.input]}
                                selectedTitleStyle={{fontSize: 22}}
                                data={estadosCivisData}
                                showSearchBox={false}
                                cancelButtonText={'Cancelar'}
                                selectButtonText={'Confirmar'}
                                searchPlaceHolderText={'Selecione um estado civíl'}
                                title={'Selecione um estado civíl'}
                                listEmptyTitle={'Estado civíl não encontrado'}
                                defaultFontName={Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi'}
                                colorTheme={darkButton}
                                isSelectSingle={true}
                                onSelect={estado_civil => {
                                    this.setState({estado_civil: estado_civil[0]})
                                }}
                                onRemoveItem={estado_civil => {
                                    this.setState({estado_civil: null})
                                }}
                            />
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

        // return (
        //
        //     <ScrollView scrollToOverflowEnabled={false} style={Style.generalViews}>
        // <StatusBar
        //             translucent
        //             backgroundColor="transparent"
        //         />
        //         <Text style={Style.newInfoTitle}>Cadastro</Text>
        //         <Text style={[Style.centerAll, Style.newInfoSubTitle, {marginTop: 30}]}>Por ultimo, precisamos de mais
        //             algumas informações</Text>
        //         <TextInput
        //             placeholder="Número do RG"
        //             keyboardType="numeric"
        //             onChangeText={(rg) => this.setState({rg})}
        //             style={Style.inputSearch}
        //             placeholderTextColor={'#808080'}
        //         />
        //         <TextInputMask
        //             type={'datetime'}
        //             options={{
        //                 format: 'DD/MM/YYYY'
        //             }}
        //             keyboardType={"number-pad"}
        //             placeholder="Data de nascimento"
        //             value={this.state.data_nascimento}
        //             onChangeText={(data_nascimento) => this.setState({data_nascimento})}
        //             style={Style.inputSearch}
        //             placeholderTextColor={'#808080'}
        //         />
        //         <TextInput
        //             placeholder="Nome da mãe"
        //             onChangeText={(nome_mae) => this.setState({nome_mae})}
        //             style={Style.inputSearch}
        //             placeholderTextColor={'#808080'}
        //         />
        //         <View>
        //             <TouchableOpacity onPress={() => this.setState({generoModal: true})}>
        //                 <Text style={[Style.inputSearch, {height: 40, marginTop: 30}]}>
        //                     {this.state.genero ? this.state.genero.name : 'Gênero'}
        //                 </Text>
        //             </TouchableOpacity>
        //         </View>
        //         <TouchableOpacity
        //             style={[Style.sendGo, {marginTop: '30%'}]}
        //             onPress={() => this.validate() && this.next(this.state)}
        //         >
        //             <LinearGradient
        //                 colors={[buttonBoxes, buttonTwoBoxes]}
        //                 start={{x: 0.5, y: 1.3}}
        //                 end={{x: -0.9, y: -2.5}}
        //                 locations={[0, 0.3, 0.7]}
        //                 style={Style.goButton}
        //             >
        //                 <AntDesign style={[Style.centerAll, {
        //                     marginTop: 20,
        //                     fontSize: 22
        //                 }]} name={'right'} color={defaultTextColor} />
        //             </LinearGradient>
        //         </TouchableOpacity>
        //         <Modal isVisible={this.state.generoModal}>
        //             <View style={[{
        //                 flex: 1,
        //                 flexDirection: 'column',
        //                 justifyContent: 'center',
        //                 alignItems: 'center'
        //             }]}>
        //                 <View style={[Style.generalViews, {
        //                     backgroundColor: boxes,
        //                     width: '97%',
        //                     height: '60%', borderRadius: 10
        //                 }]}>
        //                     <Text style={Style.sendTitle}>
        //                         Selecione seu gênero
        //                     </Text>
        //                     <FlatList
        //                         data={[{id: 'masculino', name: 'Masculino'}, {id: 'feminino', name: 'Feminino'}]}
        //                         keyExtractor={MovData => MovData.id}
        //                         showsHorizontalScrollIndicator={true}
        //                         showsVerticalScrollIndicator={true}
        //                         style={[Style.historyList, {marginTop: '25%', marginHorizontal: 10, width: '94%'}]}
        //                         renderItem={({item}) => {
        //                             return <TouchableOpacity
        //                                 activeOpacity={0.7}
        //                                 onPress={() => this.setState({genero: item})}
        //                             >
        //                                 <View style={this.state.genero && this.state.genero.id === item.id ? Style.sendBankListSelected : Style.sendBankList}>
        //                                     <Text style={Style.sendBankName}>{item.name}</Text>
        //                                 </View>
        //                             </TouchableOpacity>
        //                         }}
        //                     >
        //                     </FlatList>
        //                     <TouchableOpacity
        //                         onPress={() => this.setState({generoModal: false})}
        //                         style={{marginHorizontal: 10, marginBottom: 10}}
        //                     >
        //                         <LinearGradient
        //                             colors={[buttonBoxes, buttonTwoBoxes]}
        //                             start={{x: 0.7, y: 1.3}}
        //                             end={{x: 0, y: -3.5}}
        //                             locations={[0, 0.6, 0.9]}
        //                             style={Style.loginRegBack}
        //                         >
        //                             <Text style={Style.loginNoAcc}>Confirmar</Text>
        //                         </LinearGradient>
        //                     </TouchableOpacity>
        //                 </View>
        //             </View>
        //         </Modal>
        //     </ScrollView>
        // );
    }

    alertClose() {
        this.setState({showAlert: false})
    }

    isNotOfLegalAge() {
        let inicio = moment(this.state.data_nascimento, "DD/MM/YYYY");
        let agora = moment();

        let diferenca = moment.duration({
            years: agora.year() - inicio.year(),
        });

        return diferenca.years() < 18;
    }
}

export default SixthStep;

import React, {Component} from 'react';
import {TouchableOpacity, StatusBar, TextInput} from "react-native";
import Style from '../../style/style';
import {Fab, Content, Container, CardItem, Text, View, H3, Right, Left, Body, Header} from "native-base";
import ViewShot from "react-native-view-shot";
import {defaultTextColor, gradientBackgroundBase} from "../../style/pallet";
import AntDesign from "react-native-vector-icons/AntDesign";

class TaxReceipt extends Component {

    constructor(props) {
        super(props);
        const {title, dados, goBack} = this.props;
        this.dados = dados;
        this.title = title;
        this.goBack = goBack;
    }


    render() {
        const {title, dados} = this;
        return (
            <Container>
                <Header noShadow  style={{backgroundColor: gradientBackgroundBase, marginTop: Platform.OS === 'ios' ? 0 : 24}}>
                    <Left>
                        <TouchableOpacity onPress={() => this.goBack()}>
                            <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content scrollEnabled={true} padder style={[Style.generalViews]}>
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                    />
                    <Text style={[Style.sendTitle, {fontSize: 23}]}>
                        Pagamento de taxa
                    </Text>
                    <View style={[Style.comprovantCard, {marginTop: 30}]}>
                        <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                            <Text style={[Style.sendBankName, {flex: 0.3}]}>
                                Você Pagou
                            </Text>
                            <TextInput
                                editable={false}
                                style={[Style.inputSearch, {flex: 1}]}
                                value={dados.formated_currency}
                            />
                        </View>
                        <View style={{flexDirection: 'column', marginHorizontal: '5%'}}>
                            <Text style={[Style.sendBankName, {flex: 0.3}]}>
                                Data do pagamento
                            </Text>
                            <TextInput
                                editable={false}
                                style={[Style.inputSearch, {flex: 1}]}
                                value={dados.complementos.data_transacao}
                            />
                        </View>

                        <View style={Style.clearFix} />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default TaxReceipt;
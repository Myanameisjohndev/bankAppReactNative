import React, {Component} from 'react';
import {Container, Content, H3, H1} from "native-base";
import theme from "../../style/theme";
import {text_inDark, text_light} from "../../style/pallet";
import {Logo} from "../../constants";
import {TouchableOpacity, StatusBar, View} from 'react-native';

class FinishStep extends Component {
    state = {};

    constructor(props) {
        super(props);
        const {navigation, data} = this.props;
        this.navigation = navigation;
        this.data = data;
    }

    render() {
        return (
            <Container style={theme.cor_fundo}>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content style={{marginHorizontal: 5}} padder>
                    <H1 style={[theme.h3, theme.fontBold, theme.centerAll, {
                        color: text_inDark,
                        marginTop: 60,
                        fontSize: 35,
                        paddingTop:10
                    }]}>
                        Análise Pendente
                    </H1>
                    <H3 style={[theme.fontDefault, theme.centerAll, {color: text_light, marginTop: 30}]}>
                        Suas informações já foram registradas e seus
                        documentos estão em análise. Agora é só aguardar.
                        Pedimos até 3 dias úteis. Fique de olho no seu e-mail e
                        app!

                    </H3>

                    <Logo moreStyle={{
                        marginTop: '20%',
                        maxHeight:250,
                        alignSelf: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} />
                    <View style={[theme.fixBottom, theme.centerAll, {marginBottom: 10}]}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Login')}
                            style={[theme.buttonGreen, theme.centerAll]}
                        >
                            <H3 style={[theme.centerAll, theme.h3]}>
                                Entendi
                            </H3>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default FinishStep;

import React, {Component} from 'react';
import {Container, Content, H3, H1} from "native-base";
import theme from "../../style/theme";
import {text_inDark, text_light} from "../../style/pallet";
import {Logo} from "../../constants";
import {TouchableOpacity} from 'react-native';

class errorFinish extends Component {
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
                <Content style={{marginHorizontal: 5}} padder>
                    <H1 style={[theme.h3, theme.fontBold, theme.centerAll, {
                        color: text_inDark,
                        marginTop: 60,
                        fontSize: 35
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
                        alignSelf: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} />
                    <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Login')}
                            style={[theme.buttonGreen, theme.centerAll]}
                        >
                            <H3 style={[theme.centerAll, theme.h3, {color: text_light}]}>
                                Entendi
                            </H3>
                        </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}

export default errorFinish;
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    ActivityIndicator,
    Image,
    Linking,
    StatusBar,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {
    Body,
    Container,
    Content,
    H1,
    H3,
    Header,
    Input,
    Left,
    Text,
    View,
} from 'native-base';
import Style from '../../style/style';
import {
    buttonBoxes,
    buttonTwoBoxes,
    darkButton,
    defaultTextColor,
    degrade_primario,
    degrade_secundario,
    lightButton,
    text_light,
    whiteLabel,
    telefone,
} from '../../style/pallet';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { novaSenhaCartao, exibirSenha } from '../../store/cards';
import { AlertHelper } from '../AlertHelper';
import Loading from '../common/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../style/theme';
import { TextInputMask } from 'react-native-masked-text';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

class ShowSenhaCartao extends Component {
    state = {
        senha0: '0000',
        loading: false,
        generated: true,
        new_card: false,
    };
    static navigationOptions = ({ navigation }) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        //console.log(props);
        super(props);
        this.new_card = this.props.navigation.getParam('new_card', {
            new_card: this.card,
        });
        this.senhaAtual = this.props.navigation.getParam('senhaAtual', {
            senhaAtual: this.card,
        });

        console.log('newCard é');
        console.log(this.new_card);

        //this.setState({new_card: this.new_card });
    }

    componentDidMount() {
        this.getPasswordCard();
    }

    async getPasswordCard() {
        const { exibirSenha } = this.props;
        let senha = await exibirSenha(this.new_card);
        this.setState({ senha0: senha.message.password });
    }

    render() {
        //console.log(this.new_card)

        if (this.state.generated === true) {
            return (
                <Container>
                    <Header style={[{ height: 100, backgroundColor: degrade_primario }]}>
                        <Left style={{ justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ marginTop: 20 }}
                                onPress={() => this.props.navigation.replace('Cards')}>
                                <AntDesign name={'left'} size={35} color={defaultTextColor} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{ marginRight: 20 }}>
                            <H1
                                allowFontScaling={false}
                                style={[
                                    theme.h1,
                                    { marginTop: 15 },
                                    { marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0 },
                                ]}>
                                Visualizar senha
                            </H1>
                        </Body>
                    </Header>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Content style={{ marginHorizontal: 5 }} padder>
                        <View style={{ marginTop: '5%', flexDirection: 'row' }}>
                            <H1
                                allowFontScaling={false}
                                style={[
                                    theme.h3,
                                    { marginTop: 15 },
                                    { marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0 },
                                ]}>
                                Olá, sua senha atual é {this.state.senha0}
                            </H1>
                        </View>
                    </Content>
                </Container>
            );
        }
    }
}

const mapStateToProps = state => {
    return { account: state.account };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ novaSenhaCartao, exibirSenha }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ShowSenhaCartao);

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
import TextInputMask from "react-native-masked-text/lib/text-input-mask";
import {buttonBoxes, buttonTwoBoxes, defaultTextColor, text_light} from "../../style/pallet";
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from "react-native-vector-icons/AntDesign";
import {AlertHelper} from "../../components/AlertHelper";
import {Helpers} from "../../components/helpers";
import {Container, Content, Header, Input, H1, Card, H3, Item} from 'native-base';
import theme from "../../style/theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";


class SecondStep extends Component {

    constructor(props) {
        super(props);
        const {navigation, next} = this.props;
        this.navigation = navigation;
        this.next = next;
    }

    render() {
        return (
            <Container>
                <StatusBar
                    translucent
                    backgroundColor={'#fff'}
                    barStyle="dark-content"
                />
                <Content style={{marginHorizontal: 5, marginTop: 60}} padder>
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: '60%', paddingTop:20 , marginTop: 0, fontSize: 35}]}>
                        Cadastro
                    </H1>
                    <H1 style={[theme.h3, theme.fontRegular, {marginTop: 0}]}>
                        Agora precisamos da sua foto!
                    </H1>
                    <H3 style={[theme.h3, {maxWidth: '80%', marginTop: 20}]}>
                        Lembre-se de estar num lugar claro. A foto deve estar clara e nítida para aprovação.
                    </H3>
                    <Image
                        source={require('../../../assets/icones/mulher.png')}
                        style={[theme.centerAll, {width: 222, height: 426}]}
                    />
                    <TouchableOpacity
                        onPress={() =>this.next(this.state)}
                        style={[theme.buttonDark, theme.centerAll, {marginTop: 0}]}
                    >
                        <H3 style={[theme.centerAll, theme.h3_light]}>
                            Tirar Foto {" "}
                            <FontAwesome name={'camera'} style={{fontSize: 22}} color={text_light} />
                        </H3>
                    </TouchableOpacity>
                </Content>
            </Container>
        )

    }
}

export default SecondStep;

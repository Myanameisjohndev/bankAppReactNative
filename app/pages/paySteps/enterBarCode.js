import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Loading from "../../components/common/Loading";
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    StatusBar,
    ScrollView,
    Clipboard,
    ActivityIndicator,
} from 'react-native';
import Style from '../../style/style';
import Icon from 'react-native-vector-icons/AntDesign'
import {billetValidateFetch, billetCIPFetch} from '../../store/billet'
import {AlertHelper} from "../../components/AlertHelper";
import {Header, Right, Left, Body, Container, Content, H1, H3} from 'native-base';
import AntDesign from "react-native-vector-icons/AntDesign";
import {darkButton, defaultTextColor, degrade_primario, gradientBackgroundBase, lightButton} from '../../style/pallet';
import Boleto from "../../components/utils/Boleto";
import theme from '../../style/theme';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';

class EnterBarCode extends Component {
    state = {
        loading: true,
        barCode: 0,
        showAlert: false, alert: {}
    }
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }


    async componentDidMount() {
        this.setState({loading: false});
        const text = await Clipboard.getString();

        if (text && Boleto.validarBoleto(text.replace(/\D+/g, '')).sucesso === true) {
            this.setState({barCode: text.replace(/\D+/g, '')});
            AlertHelper.show('info', 'Boleto identificado', 'Identificamos um boleto e colamos para você.');
        }

    }

    async validateBillet() {
        try {
            const {billetCIPFetch} = this.props;
            this.setState({loading: true});
            let boleto = this.state.barCode;
            if(boleto.length==36){
                boleto = this.state.barCode+'00000000000';
            }
            await billetCIPFetch(boleto);
            this.setState({loading: false});
            this.props.navigation.navigate('billetInfo', {digitable: boleto.toString()});
        } catch (e) {
            console.log(e)
        }
    }

    alertClose() {
        this.setState({showAlert: false});
    }

    render() {
        if (this.state.loading) return <Loading />
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === "ios" ? wp('-50%') : 0}]}>
                            Pagamentos
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content style={[{marginHorizontal: 17}]}>
                    <H1 allowFontScaling={false} style={[theme.h3]}>
                        Digite o código de barras do boleto.
                    </H1>

                    <TextInput
                        allowFontScaling={false}
                        style={[theme.input, {marginTop: 50 , height:120 , paddingBottom:25  }, {textAlign: 'center'}]}
                        placeholder="0012270039916628100"
                        keyboardType="numeric"
                        onChangeText={(barCode) => {
                            const numericRegex = /^([0-9]{1,100})+$/
                            if(numericRegex.test(barCode)) {
                                this.setState({barCode:barCode})
                            }
                            if(barCode.length=='0'){
                                this.setState({barCode})
                            }

                        }}

                        value={this.state.barCode}
                    />

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
                    <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                    onPress={this.alertClose.bind(this)}>Ok</SCLAlertButton>
                </SCLAlert>

                <View style={
                    [theme.fixBottom, theme.centerAll]
                }>


                    <TouchableOpacity
                        onPress={() => this.state.barCode && this.validateBillet()}
                        disabled={this.state.loading || ! this.state.barCode}
                        style={[
                            this.state.loading ||  this.state.barCode=="0"  || this.state.barCode==""   || this.state.barCode.length!=36 && this.state.barCode.length!=44 && this.state.barCode.length!=47 && this.state.barCode.length!=48  ? theme.buttonDisabled : theme.buttonDark,
                            theme.centerAll,
                            {marginTop: 30}
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === 'ios' ? 'large' : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Próximo
                        </H3>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {consulta: state.billet};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {billetValidateFetch, billetCIPFetch},
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EnterBarCode);

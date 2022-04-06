import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity
} from "react-native";
import {gradGreenDark, gradGreenLight, gradientBackgroundBase} from "../../style/pallet";
import Style from '../../style/style';
import {WebView} from 'react-native-webview';
import LinearGradient from "react-native-linear-gradient";
import {termos} from "../../store/user";


class Termos extends Component {

    constructor(props) {
        super(props);
        const {closeTermos} = this.props
        this.closeTermos = closeTermos;
    }
    async saveAccept(){
        const {termos} = this.props;
        await termos();
        this.closeTermos();
    }


    render() {
        return (
            <View style={[{backgroundColor: gradientBackgroundBase, flex: 1}]}>
                <Image source={require('../../../assets/ppbank.png')} style={{
                    resizeMode: 'contain',
                    width: 80, height: 80,
                    alignItems: "center",
                    alignSelf: 'center',
                    marginTop: '5%'
                }} />
                <StatusBar barStyle="default" />
                <WebView source={{uri: 'https://dashboard.ppbank.com.br/files/assets/PoliticaDePrivacidadePagPrime.html'}} style={{marginBottom: '5%'}} />
                <TouchableOpacity
                    onPress={() => this.saveAccept()}
                    style={Style.authGradPassTC}
                >
                    <LinearGradient
                        colors={[gradGreenDark, gradGreenLight]}
                        start={{x: 1.1, y: 5}}
                        end={{x: -1.1, y: -1}}
                        style={Style.authGradPass}
                    >
                        <Text style={Style.authUsePassTXT}>Concordar e continuar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {token: state.token, account: state.account, device: state.device};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {termos},
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Termos);



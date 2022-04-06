import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Body,
    Container,
    Content,
    H1,
    Header,
    Left,
    List,
    Text,
    ListItem,
    View,
    H3,
    Footer,
    FooterTab, Right
} from "native-base";
import {StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import {defaultTextColor, degrade_primario, lightButton} from "../style/pallet";
import theme from "../style/theme";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {Linking} from "react-native";

class FavoredAccount extends Component {
    state = {loading: false , showAlert: false, alert: {}}
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.pessoa = this.props.navigation.getParam('pessoa');
    }
    alertClose() {
        this.setState({showAlert: false});
    }

    render() {
        const {pessoa} = this;
        return (
            <Container>
                <Header style={[{height: 100, backgroundColor: degrade_primario}]}>
                    <Left>
                        <TouchableOpacity style={{marginTop: 20}} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign name={'left'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <H1 allowFontScaling={false} style={[theme.h1, {marginTop: 15}, {marginLeft: Platform.OS === 'ios' ? wp('-50%') : 0}]}>
                            Transferências
                        </H1>
                    </Body>
                </Header>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Content>
                    <Text allowFontScaling={false} style={[theme.h3, theme.centerAll, {marginHorizontal: 10}]}>
                        {pessoa.nome_completo}
                    </Text>
                    <Text allowFontScaling={false} style={[theme.h3_no_margin, theme.centerAll]}>
                        {pessoa.documento}
                    </Text>
                    {this.getList(pessoa)}
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginTop: 35
                    }}>
                        <TouchableOpacity
                            onPress={() => this.setTedOrPix()}
                            disabled={this.state.loading}
                            style={[
                                this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll
                            ]}
                        >
                            {this.state.loading && <ActivityIndicator
                                style={[theme.centerAll, {marginTop: 8}]}
                                color={lightButton}
                                size={Platform.OS === "ios" ? "large" : 50}
                            />}
                            <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                                Cadastrar conta
                            </H3>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 15}} />
                    <View>
                    <SCLAlert
                        show={this.state.showAlert}
                        onRequestClose={this.alertClose.bind(this)}
                        theme={this.state.alert.theme || 'info'}
                        title={this.state.alert.title || ''}
                        subtitle={this.state.alert.subtitle || ''}
                        headerIconComponent={this.state.alert.icon ||
                        <AntDesign name={this.state.alert.icone || 'info'} size={35} color={'#ffffff'} />}
                    >
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={() =>this.props.navigation.replace('CreateFavoredPix', {documento: pessoa.documento, nome_completo: pessoa.nome_completo,id_favorito:pessoa.id}) }>
                        Pix</SCLAlertButton>
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={() =>this.props.navigation.replace('CreateFavored', {documento: pessoa.documento, nome_completo: pessoa.nome_completo,id_favorito:pessoa.id}) }
                        >Ted</SCLAlertButton>
                    </SCLAlert>
                    </View>
                </Content>
            </Container>
        );
    }

    getList(pessoa) {
        if (pessoa.conta.length === 0) return null;
        return (
            <List style={{marginTop: 30}}>
                {pessoa.conta.length && pessoa.conta.map(conta => {
                    return (
                        <ListItem style={ {backgroundColor:'#FFF', shadowColor: "#000000", shadowOpacity: 0.1, marginRight:20 , marginBottom:10} } onPress={() => this.props.navigation.replace('Transfer', {pessoa, conta})}>
                            <Body  >
                                <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                   
                                    {conta.tipo_chave==null ? `${conta.banco} -  ${ this.getBankName(conta.banco) }` : 'Pix' }
                                    
                                </Text>
                                {conta.agencia!=null &&
                                <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                    Agência: {conta.agencia}
                                </Text>
                                }
                                {conta.conta!=null &&
                                <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                    Conta: {conta.conta} - {conta.digito}
                                </Text>
                                }
                                {conta.banco!=null &&
                                 <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                    Tipo conta: {conta.tipo_conta}
                                </Text>
                                }
                                {conta.tipo_chave!=null &&
                                 <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                    Tipo da chave: {conta.tipo_chave.nome}
                                </Text>
                                }
                                {conta.tipo_chave!=null &&
                                 <Text allowFontScaling={false} style={[theme.h1_dark, {fontSize: 18}]}>
                                    Chave: {conta.chave}
                                </Text>
                                }
                            </Body>
                            <Right>
                                <AntDesign name={'right'} size={25} color={'#000'} />
                            </Right>
                        </ListItem>
                    )
                })}
            </List>
        )


    }

    getBankName(banco) {
        console.log(banco);
        let nome_banco = this.props.banks.find(banklist => banklist.id === banco);
        return nome_banco.name;
    }

    setTedOrPix(){
        this.setState(data => {
            data.alert = {
                title: 'TED ou PIX ?',
                subtitle: 'Informe se a conta é ted ou pix.',
                theme: 'default',
                icone: 'closecircle',
            };
            data.showAlert = true;
            return data;
        });
        this.setState({loading: false});
        return false;
    }
}

const mapStateToProps = state => {
        return {
            account: state.account ? state.account.data : null,
            bankSettings: state.bankSettings,
            favorites: state.favorites,
            banks: state.banks
        };
    }
;

const mapDispatchToProps = dispatch => {
        return bindActionCreators({}, dispatch);
    }
;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FavoredAccount);

import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    Header,
    Right,
    Left,
    Body,
    Container,
    Content,
    H1,
    Text,
    List,
    ListItem,
    Badge,
    Input,
    H3
} from "native-base";
import {
    StatusBar,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import {defaultTextColor, degrade_primario, lightButton} from "../style/pallet";
import theme from "../style/theme";
import {favoritesFetch} from '../store/favorites';
import {banksFetch} from "../store/Banks";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Loading from "../components/common/Loading";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";


class Favored extends Component {
    state = {loading: true, value: null, tipo_conta: 'corrente',showAlert: false, alert: {}}
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
    }

    alertClose() {
        this.setState({showAlert: false});
    }

    async componentDidMount() {
        const {favoritesFetch, banksFetch} = this.props;
        await favoritesFetch();
        await banksFetch();
        this.setState({loading: false});
    }

    render() {
        const {favorites} = this.props;
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
                <Content padder={true}>
                    <Input
                        allowFontScaling={false}
                        disabled={this.state.loading}
                        placeholder={'Pesquise por nome ou CPF/CNPJ'}
                        onChangeText={(busca) => this.setState({busca})}
                        value={this.state.busca}
                        style={[theme.input, {height: 45, fontSize: 18}]}
                    />
                    <List>
                        {favorites && Array.isArray(favorites) && favorites.map(pessoa => {
                            if(this.state.busca && ! pessoa.nome_completo.includes(this.state.busca) && ! pessoa.documento.includes(this.state.busca)) return null;
                            return (
                                <ListItem onPress={() => this.props.navigation.navigate('FavoredAccount', {pessoa: pessoa})} Avatar>
                                    <Body>
                                        <Text allowFontScaling={false} style={[theme.h3_no_margin, {fontSize: 18}]}>
                                            {pessoa.nome_completo}
                                        </Text>
                                        <Text allowFontScaling={false} note>
                                            {pessoa.documento}
                                        </Text>
                                    </Body>
                                    <Right>
                                        <Badge info>
                                            <Text allowFontScaling={false} style={[theme.h1]}>
                                                {pessoa.conta.length}
                                            </Text>
                                        </Badge>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                    <TouchableOpacity
                        onPress={() => this.setTedOrPix() }
                        disabled={this.state.loading}
                        style={[
                            this.state.loading ? theme.buttonDisabled : theme.buttonDark, theme.centerAll, {marginTop: 40}
                        ]}
                    >
                        {this.state.loading && <ActivityIndicator
                            style={[theme.centerAll, {marginTop: 8}]}
                            color={lightButton}
                            size={Platform.OS === "ios" ? "large" : 50}
                        />}
                        <H3 allowFontScaling={false} style={[theme.centerAll, theme.h3_light]}>
                            Cadastrar pessoa
                        </H3>
                    </TouchableOpacity>

               
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
                                        onPress={() =>this.props.navigation.replace('CreateFavoredPix') }>
                        Pix</SCLAlertButton>
                        <SCLAlertButton theme={this.state.alert.theme || 'info'}
                                        onPress={() =>this.props.navigation.replace('CreateFavored') }
                        >Ted</SCLAlertButton>
                    </SCLAlert>
               
                </Content>
            </Container>
        );
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
            favorites: state.favorites
        };
    }
;

const mapDispatchToProps = dispatch => {
        return bindActionCreators({favoritesFetch, banksFetch}, dispatch);
    }
;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Favored);

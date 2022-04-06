import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {BackHandler} from 'react-native';
import {Image, StatusBar, Text, FlatList, View, TouchableOpacity, TextInput} from 'react-native';
import Style from '../../style/style';
import {banksFetch} from '../../store/Banks'
import Loading from "../../components/common/Loading";
import {Fab} from "native-base";
import {setTransferInfo} from "../../store/transfer";
import {AlertHelper} from "../../components/AlertHelper";
import {Header, Right, Left, Body, Container, Content} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import {defaultTextColor, gradientBackgroundBase} from "../../style/pallet";


class BankList extends Component {
    state = {selectedBank: null, loading: true, search: ''};
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.backEvent = this.backEvent.bind(this);
        this.backEventTwo = this.backEventTwo.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backEvent);
        this.load();

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backEvent);
        BackHandler.addEventListener('hardwareBackPress', this.backEventTwo);

    }

    backEventTwo() {
        const {navigation} = this.props;
        navigation.navigate('Dashboard');
        return true;
    }

    async load() {
        const {banksFetch, transfer} = this.props;
        await banksFetch();
        this.setState({loading: false});
    }

    backEvent() {
        this.props.navigation.goBack();
        return true;
    }


    render() {
        if (this.state.loading) return <Loading />;
        const {banks} = this.props;
        return (
            <Container>
                <Header noShadow  style={{backgroundColor: gradientBackgroundBase, marginTop: Platform.OS === 'ios' ? 0 : 24}}>
                    <Left>
                        <TouchableOpacity onPress={() => this.backEvent()}>
                            <AntDesign name={'arrowleft'} size={35} color={defaultTextColor} />
                        </TouchableOpacity>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content padder style={Style.generalViews}>
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                    />
                    <Text style={[Style.sendTitle, {marginTop: 0}]}>Para qual banco?</Text>
                    <TextInput
                        style={Style.inputSearch} placeholder={'Pesquisar banco'} value={this.state.search} onChangeText={(search) => this.setState({search})} />
                    <FlatList
                        data={banks}
                        keyExtractor={MovData => MovData.id}
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                        style={Style.historyList}
                        renderItem={({item}) => {
                            if (this.state.search !== '') {

                                if (item.id.toLowerCase().indexOf(this.state.search.toLowerCase()) === -1 &&
                                    item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) === -1) {
                                    return null;
                                }
                            }
                            return <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.setState({selectedBank: item})}
                            >
                                <View style={this.state.selectedBank && this.state.selectedBank.id === item.id ? Style.sendBankListSelected : Style.sendBankList}>
                                    <Text style={Style.sendBankName}>{item.id} - {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        }}
                    >
                    </FlatList>
                </Content>
                {this.state.selectedBank && <Fab
                    active={true}
                    direction="up"
                    containerStyle={{}}
                    style={{backgroundColor: '#fff'}}
                    position="bottomRight">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.goToAccountInfo()}
                    >
                        <Image
                            source={require('../../../assets/img/arrowRound.png')}
                        />
                    </TouchableOpacity>
                </Fab>}
            </Container>
        );
    }

    async goToAccountInfo() {
        const {navigation, setTransferInfo} = this.props;
        if (!this.state.selectedBank || !this.state.selectedBank.id || this.state.selectedBank.id === 0) {
            AlertHelper.show('error', 'Selecione um banco', 'Vocẽ deve selecionar um banco para continuar.');
            return false;
        }
        await setTransferInfo('banco', this.state.selectedBank);
        navigation.navigate('receiverAccount');
    }
}

const mapStateToProps = state => {
    return {transfer: state.transfer, bankSettings: state.bankSettings, banks: state.banks};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({banksFetch, setTransferInfo}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BankList);
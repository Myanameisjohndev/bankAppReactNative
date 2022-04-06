import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Loading from "../components/common/Loading";
import FirstStep from "./registerSteps/firstStep";
import {usuarioDocumentoFetch} from '../store/register';
import {AlertHelper} from "../components/AlertHelper";
import SecondStep from "./registerSteps/secondStep";
import ThirdStep from "./registerSteps/thirdStep";
import FourthStep from "./registerSteps/fourthStep";
import FifthStep from "./registerSteps/fifthStep";
import SixthStep from "./registerSteps/sixthStep";
import SeventhStep from "./registerSteps/seventhStep";
import FinishStep from "./registerSteps/finishStep";
import {userSave} from "../store/user";
import {BackHandler} from "react-native";

class Register extends Component {
    state = {data: {}, loading: true, step: 1};

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        this.setState({loading: false});
        BackHandler.removeEventListener('hardwareBackPress', () => true);
        BackHandler.addEventListener('hardwareBackPress', this.back);
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.back);
    }

    async next(data) {
        const {usuarioDocumentoFetch} = this.props;
        if (this.state.step === 1) {
            this.setState({loading: true});
            await usuarioDocumentoFetch(data.documento);
            setTimeout(function () {
                console.log(this.props.register);
                if (typeof this.props.register === 'object' && this.props.register.length === 0) {
                    let myData = this.state.data;
                    this.setState({data: data});
                    this.setState({step: ++this.state.step})
                } else {
                    switch (this.props.register.codigo) {
                        case -1: // bloqueado
                            AlertHelper.show('error', 'Oops', 'Identificamos uma restrição sobre seu cadastro, entre em contato conosco!');
                            this.props.navigation.goBack();
                            break;
                        case 0: // aguardando
                            AlertHelper.show('error', 'Conta em análise', 'Fique de olho em seu e-mail e App!');
                            this.props.navigation.goBack();
                            break;
                        case 1: // reprovado
                            AlertHelper.show('error', 'Oops', 'Seu ultimo cadastro foi reprovado, aguarde 3 meses e tente novamente.');
                            this.props.navigation.goBack();
                            break;
                        case 2:
                            AlertHelper.show('error', 'Conta aprovada', 'Cadastro já encontrado, faça o seu Login!');
                            this.props.navigation.goBack();
                            break;

                    }
                }

                this.setState({loading: false});
            }.bind(this), 100)
        } else {
            let myData = this.state.data;
            let newData = {...myData, ...data};
            this.setState({data: newData}, function () {
                this.setState({step: ++this.state.step}, async function () {
                    if (this.state.step === 8) {
                        const {userSave} = this.props;
                        this.setState({loading: true});
                        let response = await userSave(this.state.data);
                        if (response.status === 'success') {
                            this.setState({step: ++this.state.step})
                        } else {
                            console.log(response)
                            AlertHelper.show('error', 'Oops', 'Não conseguimos finalizar o seu cadastro, entre em contato com o suporte!');
                            this.props.navigation.navigate('Login');
                        }
                        this.setState({loading: false});
                    }
                }.bind(this));
            }.bind(this))
        }
    }

    back() {
        if (this.state.step === 1) {
            this.props.navigation.goBack();
            return true;
        }
        this.setState({step: --this.state.step});
        return true;
    }

    render() {
        const {navigation} = this.props;
        if (this.state.loading) return <Loading />
        switch (this.state.step) {
            case 1: // primeiro
                return <FirstStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 2: // segundo
                return <SecondStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 3: // terceiro
                return <SeventhStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 4: // quarto
                return <FourthStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 5: // quinto
                return <FifthStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 6: // sexto
                return <SixthStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            case 7: // sétimo
                return <ThirdStep back={() => this.back()} next={(data) => this.next(data)} navigation={this.props.navigation} />;
            default: // default (final)
                return <FinishStep data={this.state.data} navigation={this.props.navigation} />;
        }
    }
}

const mapStateToProps = state => {
    return {token: state.token, register: state.register};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {usuarioDocumentoFetch, userSave}, dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

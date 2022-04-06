import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from '../components/common/Loading';
import BilletReceipt from './Receipts/BilletReceipt';
import Share from 'react-native-share';
import PaymentReceived from './Receipts/paymentReceived';
import TaxReceipt from './Receipts/TaxReceipt';
import TransferSend from './Receipts/transferSend';
import {BackHandler} from 'react-native';
import Others from './Receipts/others';
import Devolution from './Receipts/DevolutionReceipt';
import PixReceipt from './Receipts/PixReceipt';
import {whiteLabel} from '../style/pallet';

class Receipt extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
      gestureEnabled: false,
    };
  };

  state = {
    activeShare: false,
    sharedFile: null,
    dados: {},
    loading: true,
  };

  constructor(props) {
    super(props);
    this.backEvent = this.backEvent.bind(this);
  }

  componentDidMount() {
    this.setState({loading: false});
    const {navigation} = this.props;
    if (!navigation.getParam('fromHistory')) {
      BackHandler.removeEventListener('hardwareBackPress', () => true);
      BackHandler.addEventListener('hardwareBackPress', this.backEvent);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backEvent);
  }

  backEvent() {
    console.log('voltou');
    const {navigation} = this.props;
    console.log(navigation.getParam('fromHistory'));
    if (navigation.getParam('fromHistory')) {
      navigation.goBack();
    } else {
      navigation.replace('Dashboard');
    }

    return true;
  }

  async shareFile(uri) {
    if (Platform.OS !== 'ios') {
      try {
        await Share.open({
          title: 'Compartilhar comprovante',
          message: 'Este é o meu comprovante de transferência ' + whiteLabel,
          url: 'data:image/png;base64,' + uri,
        });
      } catch (e) {}
    } else {
      await Share.open({
        title: 'Compartilhar comprovante',
        url: 'data:image/png;base64,' + uri,
      });
    }
  }

  capture() {
    this.refs.viewShot.capture().then((uri) => {
      this.shareFile(uri);
    });
  }

  getTitle() {
    const {navigation} = this.props;
    let transacao = navigation.getParam('transacao');
    let id_transacao = transacao.tipo_transacao.id;
    if (id_transacao === 3) {
      return 'Comprovante de transferência';
    } else if (id_transacao === 1) {
      return 'Comprovante Recebimento de boleto';
    } else if (id_transacao === 5) {
      return 'Comprovante de boleto';
    } else if (id_transacao === 7 || id_transacao === 6) {
      return 'Comprovante de crédito EsgBank';
    } else if (id_transacao === 11) {
      return 'Comprovante de devolução';
    } else if (id_transacao === 13) {
      return 'Pagamento de vendas';
    } else if (id_transacao === 8) {
      return 'Comprovante - Débito EsgBank';
    } else if (id_transacao === 15) {
      return 'Comprovante - Pgto. Cap. giro';
    } else if (id_transacao === 16 || id_transacao === 17) {
      return 'Comprovante - Pix';
    } else {
      return 'Comprovante';
    }
  }

  render() {
    if (this.state.loading) return <Loading />;
    const {navigation} = this.props;
    let dados = navigation.getParam('transacao');
    {
      console.log('os dados enviados como param sao ...');
    }
    {
      console.log(dados);
    }
    if (dados.boleto) {
      return (
        <BilletReceipt
          goBack={() => this.backEvent()}
          title={this.getTitle()}
          dados={dados}
        />
      );
    } else if (dados.tipo_transacao.id === false) {
      return (
        <PaymentReceived
          goBack={() => this.backEvent()}
          title={this.getTitle()}
          dados={dados}
        />
      );
    } else if (
      dados.tipo_transacao.id === 3 ||
      dados.tipo_transacao.id === 16
    ) {
      return (
        <TransferSend
          goBack={() => this.backEvent()}
          title={this.getTitle()}
          dados={dados}
        />
      );
    } else if (dados.tipo_transacao.id === 11) {
      return (
        <Devolution
          goBack={() => this.backEvent()}
          title={this.getTitle()}
          dados={dados}
        />
      );
    } else if (dados.tipo_transacao.id === 17) {
      return (
        <PixReceipt
          goBack={() => this.backEvent()}
          title={this.getTitle()}
          dados={dados}
        />
      );
    }

    return (
      <Others
        goBack={() => this.backEvent()}
        title={this.getTitle()}
        dados={dados}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {billet: state.billet};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);

import React, {Component} from 'react';
import Loading from "../../components/common/Loading";

class TransferRedirect extends Component {
    componentDidMount() {
        this.props.navigation.navigate('Transf');
    }

    render() {
        return <Loading />
    }
}

export default TransferRedirect;
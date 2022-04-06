import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


class Transfer extends Component {

    render() {
        return null;
    }

}
const mapStateToProps = state => {
    return {account: state.account.data, bankSettings: state.bankSettings, favorites: state.favorites};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transfer);
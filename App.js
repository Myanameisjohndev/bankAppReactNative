import React, {useEffect} from 'react';

import {appLoading} from './app/store/app';
import {StatusBar, View, Platform} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from './app/components/common/Loading';
import {SafeAreaView} from 'react-navigation';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import {AsyncStorage} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {AlertHelper} from './app/components/AlertHelper';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

class App extends React.Component {
  componentDidMount() {
    console.disableYellowBox = true;
    SplashScreen.hide();
    OneSignal.init('262b6738-711d-49f9-ba6e-2c5551caf072');
    OneSignal.addEventListener('received', this.receivedPush);
    OneSignal.addEventListener('opened', this.openedPush);
    OneSignal.addEventListener('ids', this.idsPush);
    OneSignal.enableVibrate(true);
    OneSignal.enableSound(true);
    OneSignal.getPermissionSubscriptionState(async function(status) {
      if (status.userId) {
        await AsyncStorage.setItem('id_push', status.userId);
      }
    });
  }

  receivedPush(push) {
    console.log(push);
  }

  openedPush(push) {
    console.log(push);
  }

  async idsPush(push) {}

  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        AlertHelper.show(
          'success',
          'Parabéns',
          'Seu aplicativo foi atualizado, reinicie para aplicar a atualização.',
        );
        break;
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.1)"
          barStyle="light-content"
          translucent={true}
        />
        {this.props.app.loading ? <Loading /> : this.props.children}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {app: state.app};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({appLoading}, dispatch);
};

//App = codePush(App);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

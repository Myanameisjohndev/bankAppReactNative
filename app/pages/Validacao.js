import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  H1,
  View,
  Text,
  Card,
  H3,
  Input,
  CheckBox,
} from 'native-base';
import {
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import theme from '../style/theme';
import CameraOverlay from '../components/common/cameraOverlay';
import {RNCamera} from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {lightButton, text_light} from '../style/pallet';
import {userDeviceValidate} from '../store/device';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Validacao extends Component {
  state = {foto_rosto: null, alert: {}};
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  alertClose() {
    this.setState({showAlert: false});
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <Container>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Content style={{marginHorizontal: 5}} padder>
          <H1
            allowFontScaling={false}
            style={[
              theme.h3,
              theme.fontBold,
              {maxWidth: '60%', paddingTop: 10, marginTop: 60, fontSize: 35},
            ]}>
            Validação
          </H1>
          {!this.state.foto_rosto && (
            <H1
              allowFontScaling={false}
              style={[theme.h3, {maxWidth: '70%', marginTop: 0}]}>
              Olá, para liberar o seu dispositivo, precisamos confirmar que é
              você.
            </H1>
          )}
          <View style={[styles.container, {paddingTop: -30}]}>
            {this.cameraContent()}
            <CameraOverlay />
            <View style={styles.cameraElements}>{this.getContent()}</View>
          </View>
        </Content>
        <SCLAlert
          show={this.state.showAlert}
          onRequestClose={this.alertClose.bind(this)}
          theme={this.state.alert.theme || 'info'}
          title={this.state.alert.title || ''}
          subtitle={this.state.alert.subtitle || ''}
          headerIconComponent={
            this.state.alert.icon || (
              <AntDesign
                name={this.state.alert.icone || 'info'}
                size={35}
                color={'#fff'}
              />
            )
          }>
          <SCLAlertButton
            theme={this.state.alert.theme || 'info'}
            onPress={this.alertClose.bind(this)}>
            Ok
          </SCLAlertButton>
        </SCLAlert>
      </Container>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({foto_rosto: data.base64});
    }
  };

  cameraContent() {
    if (this.state.foto_rosto) {
      return (
        <ImageBackground
          style={[styles.camera, {marginBottom: 50}]}
          source={{uri: 'data:image/png;base64,' + this.state.foto_rosto}}
        />
      );
    } else {
      return (
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={[styles.camera]}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'EsgBank precisa de acesso a camera',
            message: 'Permitir utilizar sua camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          keepAudioSession={false}
          captureAudio={false}
        />
      );
    }
  }

  getContent() {
    if (this.state.foto_rosto) {
      return (
        <View>
          <View style={{flex: 6, marginTop: '127%'}} />
          <View>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={async () => this.sendToValidation()}
              style={[
                this.state.loading ? theme.buttonDisabled : theme.buttonDark,
                theme.centerAll,
                {
                  marginTop: Platform.OS === 'ios' ? 40 : 10,
                  marginBottom: 5,
                },
              ]}>
              {this.state.loading && (
                <ActivityIndicator
                  style={[theme.centerAll, {marginTop: 8}]}
                  color={lightButton}
                  size={Platform.OS === 'ios' ? 'large' : 50}
                />
              )}
              <H3
                allowFontScaling={false}
                style={[theme.centerAll, theme.h3_light]}>
                Enviar{' '}
                <FontAwesome
                  name={'long-arrow-right'}
                  style={{fontSize: 22}}
                  color={text_light}
                />
              </H3>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => this.setState({foto_rosto: null})}
              style={[
                this.state.loading ? theme.buttonDisabled : theme.buttonDark,
                theme.centerAll,
                {marginTop: 0},
              ]}>
              <H3
                allowFontScaling={false}
                style={[theme.centerAll, theme.h3_light]}>
                Tirar outra
              </H3>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 10, paddingBottom: 0}} />
        </View>
      );
    } else {
      return (
        <View>
          <View style={{flex: 6, marginTop: '135%'}} />
          <TouchableOpacity
            onPress={() => this.takePicture()}
            style={[theme.buttonDark, theme.centerAll, {marginTop: 0}]}>
            <H3
              allowFontScaling={false}
              style={[theme.centerAll, theme.h3_light]}>
              Capturar{' '}
              <FontAwesome
                name={'camera'}
                style={{fontSize: 22}}
                color={text_light}
              />
            </H3>
          </TouchableOpacity>
        </View>
      );
    }
  }

  async sendToValidation() {
    this.setState({loading: true});
    await this.props.userDeviceValidate(this.state.foto_rosto);
    const {device} = this.props;
    if (device.status === 'error') {
      console.log(device);
      this.setState((data) => {
        data.alert = {
          title: 'Oops',
          subtitle: device.message,
          theme: 'danger',
          icone: 'closecircle',
        };
        data.showAlert = true;
        return data;
      });
      return false;
    } else {
      this.props.navigation.navigate('App');
    }

    this.setState({loading: false});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  camera: {
    position: 'absolute',
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  cameraElements: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  smartphoneImage: {
    width: 50,
    resizeMode: 'contain',
  },
});

const mapStateToProps = (state) => {
  return {token: state.token, account: state.account, device: state.device};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({userDeviceValidate}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Validacao);

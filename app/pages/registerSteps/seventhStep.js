import React, {Component} from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import {
  boxes,
  buttonBoxes,
  buttonTwoBoxes,
  defaultTextColor,
  gradientBackgroundBase,
  text_light,
} from '../../style/pallet';
import Style from '../../style/style';
import CameraOverlay from '../../components/common/cameraOverlay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Container,
  Content,
  Header,
  Input,
  H1,
  Card,
  H3,
  Item,
} from 'native-base';
import theme from '../../style/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class SeventhStep extends Component {
  state = {foto_rosto: null};

  constructor(props) {
    super(props);
    const {changeFatherState, next, state} = this.props;
    this.next = next;
    this.changeFatherState = changeFatherState;
    this.fatherState = state;
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({foto_rosto: data.base64});
    }
  };

  render() {
    return (
      <Container>
        <Header transparent />
        <StatusBar
          translucent
          backgroundColor={'#fff'}
          barStyle="dark-content"
        />
        <Content scrollEnabled={true} style={{marginHorizontal: 30}} padder>
          <H1
            style={[
              theme.h3,
              theme.fontBold,
              {maxWidth: '60%', fontSize: 35, marginTop: -10, paddingTop: 10},
            ]}>
            Tirar foto.
          </H1>
          <H1 style={[theme.h3, theme.fontRegular, {marginTop: 0}]}>
            Precisamos de uma foto do seu rosto!
          </H1>

          <View style={[styles.container, {paddingTop: -30}]}>
            {this.cameraContent()}
            <CameraOverlay />
            <View style={styles.cameraElements}>{this.getContent()}</View>
          </View>
        </Content>
      </Container>
    );
  }

  getContent() {
    if (this.state.foto_rosto) {
      return (
        <View>
          <View style={{flex: 6, marginTop: '155%'}} />
          <View>
            <TouchableOpacity
              onPress={() => this.next(this.state)}
              style={[
                theme.buttonDark,
                theme.centerAll,
                {marginTop: 10, marginBottom: 5},
              ]}>
              <H3 style={[theme.centerAll, theme.h3_light]}>Ficou bom</H3>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({foto_rosto: null})}
              style={[theme.buttonDark, theme.centerAll, {marginTop: 0}]}>
              <H3 style={[theme.centerAll, theme.h3_light]}>Não gostei</H3>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 10, paddingBottom: 0}} />
        </View>
      );
    } else {
      return (
        <View>
          <View style={{flex: 6, marginTop: '170%'}} />
          <TouchableOpacity
            onPress={() => this.takePicture()}
            style={[theme.buttonDark, theme.centerAll, {marginTop: 0}]}>
            <H3 style={[theme.centerAll, theme.h3_light]}>
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
          style={styles.camera}
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

export default SeventhStep;

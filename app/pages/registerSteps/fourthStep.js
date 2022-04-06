import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, ImageBackground, StatusBar, Dimensions} from "react-native";
import {RNCamera} from "react-native-camera";
import LinearGradient from "react-native-linear-gradient";
import {boxes, buttonBoxes, buttonTwoBoxes, text_light} from "../../style/pallet";
import Style from '../../style/style';
import {Container, Content, H1, H3} from 'native-base';
import theme from "../../style/theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";

let larguraImagem = Dimensions.get('window').width;

class FourthStep extends Component {

    state = {document_front: null};

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
            this.setState({document_front: data.base64});
        }
    };

    render() {
        return (
            <Container>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <Content style={{marginHorizontal: 5, marginTop: 45}} padder>
                    <H1 style={[theme.h3, theme.fontBold, {maxWidth: '100%', marginTop: 0, paddingTop:10 ,fontSize: 35}]}>
                        Frente do documento
                    </H1>
                    {this.getCameraContent()}
                    <View style={{paddingTop: '30%'}}>
                        {!this.state.document_front && <TouchableOpacity
                            onPress={() => this.takePicture()}
                            style={[theme.buttonDark, theme.centerAll, {marginTop: 0}]}
                        >
                            <H3 style={[theme.centerAll, theme.h3_light]}>
                                Capturar {" "}
                                <FontAwesome name={'camera'} style={{fontSize: 22}} color={text_light} />
                            </H3>
                        </TouchableOpacity>}
                        {this.state.document_front && <View>
                            <TouchableOpacity
                                onPress={() => this.next(this.state)}
                                style={[theme.buttonDark, theme.centerAll, {marginTop: -70}]}
                            >
                                <H3 style={[theme.centerAll, theme.h3_light]}>
                                    Ficou bom {" "}
                                </H3>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.setState({document_front: null})}
                                style={[theme.buttonDark, theme.centerAll, {marginTop: 10}]}
                            >
                                <H3 style={[theme.centerAll, theme.h3_light]}>
                                    Tirar outra {" "}
                                    <FontAwesome name={'camera'} style={{fontSize: 22}} color={text_light} />
                                </H3>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </Content>
            </Container>
        );
    }

    getCameraContent() {
        if (this.state.document_front) {
            return (
                <ImageBackground style={[{
                    flex: 1,
                    height: Dimensions.get('window').height / 1.7,
                    width: undefined,
                }]} source={{uri: 'data:image/png;base64,' + this.state.document_front}} />
            )
        }
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={[{width: undefined, minHeight: 300, maxHeight: 200, marginTop: 150}]}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                    title: 'PPBank precisa de acesso a camera',
                    message: 'Permitir utilizar sua camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                keepAudioSession={false}
                captureAudio={false}
            />
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
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
});

export default FourthStep;

import React from "react";
import {
    ActivityIndicator,
    Platform,
    StatusBar,
    StyleSheet,
    View,
    Image
} from "react-native";
import {colors} from "../config";
import {darkButton, gradientBackgroundBase} from "../../style/pallet";
import {Logo} from "../../constants";
import Shimmer from 'react-native-shimmer';

const Loading = ({color, message}) => {
    return (
        <View style={[styles.container, {
            backgroundColor: darkButton, alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        }]}>
            {
                Platform.OS==='ios'?
                    <Logo moreStyle={{
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }}/>
                    :
                <Shimmer>
                    <Logo moreStyle={{
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }}/>
                </Shimmer>
            }
            <StatusBar barStyle="default" backgroundColor="transparent" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default Loading;

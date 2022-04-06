import React from "react";
import {AppRegistry, View}  from "react-native";
import App from "./App";
import {name as appName} from "./app.json";
import store from "./store";
import {Provider} from "react-redux";
import {createAppContainer} from "react-navigation";
import Navigation from "./app/components/navigation/Navigation";
import NavigationService from "./app/components/navigation/NavigationService";
import DropdownAlert from "react-native-dropdownalert";
import {AlertHelper} from "./app/components/AlertHelper";
import {StatusBar, KeyboardAvoidingView} from "react-native";
import {Root} from "native-base";
import {gradientBackgroundBase} from "./app/style/pallet";


const AppContainer = createAppContainer(Navigation());

const appRoot = () => {
    if (__DEV__) {
        require('react-devtools');
      }
    return (
        <View style={{flex: 1, backgroundColor: gradientBackgroundBase}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? -60 : null}
                style={{flex: 1}}
            >
                <Root>
                    <Provider store={store}>
                        <App>
                            <AppContainer
                                ref={navigatorRef => {
                                    NavigationService.setTopLevelNavigator(navigatorRef);
                                }}
                            />
                        </App>
                    </Provider>
                    <DropdownAlert
                        updateStatusBar={false}
                        defaultContainer={{padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row'}}
                        ref={ref => AlertHelper.setDropDown(ref)}
                        onClose={() => AlertHelper.invokeOnClose()}
                    />
                </Root>
            </KeyboardAvoidingView>
        </View>
    );
};

AppRegistry.registerComponent(appName, () => appRoot);

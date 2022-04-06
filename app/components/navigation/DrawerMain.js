import React, {Component} from "react";
import {
    AppState,
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    DrawerActions,
    NavigationActions,
    StackActions
} from "react-navigation";
import Close from "./drawerMain/Close";
import Ico from "../common/Ico";
import items from "./drawerMain/items";
import {cor_fundo} from "../../style/pallet";

class DrawerMain extends Component {
    componentDidMount() {
        AppState.addEventListener("change", nextAppState => {
            // if (nextAppState === "active") this.validateToken();
        });
    }

    // validateToken = async () => {
    //     let token = await AsyncStorage.getItem("token");
    //     let user = await AsyncStorage.getItem("user");
    //     let isRefreshed = false;
    //     const {navigation} = this.props;
    //
    //     if (token && user) isRefreshed = await this.refreshToken(token);
    //
    //     if (!isRefreshed) {
    //         await this.logout();
    //         return null;
    //     }
    // };


    logout = async () => {
        await AsyncStorage.multiRemove(["token"]);
        // this.props.tokenDelete();
        this.navigateToScreen("Auth");
    };

    navigateToScreen = async route => {
        const action =
            route === "Auth"
                ? NavigationActions.navigate({routeName: route})
                : StackActions.replace({routeName: route});
        if (route === "Auth") {
            await AsyncStorage.multiRemove(["user", "token"]);
            await this.logout();
        }
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
        this.props.navigation.dispatch(action);
    };

    renderLinks = () => {
        if (items.links && items.links.length > 0) {
            return items.links.map((item, i) =>
                Platform.OS === "android" ? (
                    <TouchableNativeFeedback
                        key={"dilt" + i}
                        onPress={() => Linking.openURL(item.route)}
                    >
                        <View style={{...styles.linksItem, ...(item.style || null)}}>
                            <Ico name={item.icon} size={20} style={{color: "#fff"}} />
                            {item.text ? (
                                <Text style={styles.linksItemText}>{item.text}</Text>
                            ) : null}
                        </View>
                    </TouchableNativeFeedback>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        key={"dilt" + i}
                        onPress={() => Linking.openURL(item.route)}
                        style={{...styles.linksItem, ...(item.style || null)}}
                    >
                        <Ico name={item.icon} size={20} style={{color: "#fff"}} />
                        {item.text ? (
                            <Text style={styles.linksItemText}>{item.text}</Text>
                        ) : null}
                    </TouchableOpacity>
                )
            );
        }
        return null;
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={[styles.header, {backgroundColor: cor_fundo}]}>
                    <Image
                        source={{uri: 'https://litigationinvestigators.com/wp-content/uploads/2016/07/Spy-Detective-Sleuth.png'}}
                        style={{width: 100, height: 100, borderRadius: 100 / 2}}
                    />
                    <Close />
                </View>
                <View style={styles.links}>{this.renderLinks()}</View>
                <FlatList
                    data={items.screens}
                    contentContainerStyle={styles.screens}
                    renderItem={({item}) => {
                        return Platform.OS === "android" ? (
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.SelectableBackground()}
                                onPress={() => this.navigateToScreen(item.route)}
                            >
                                <View
                                    style={{
                                        ...styles.screensItem,
                                        ...(item.style || null)
                                    }}
                                >
                                    <Ico
                                        name={item.icon}
                                        size={22}
                                        style={{color: cor_fundo}}
                                    />
                                    <Text style={styles.screensItemText}>{item.text}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.navigateToScreen(item.route)}
                            >
                                <View
                                    style={{
                                        ...styles.screensItem,
                                        ...(item.style || null)
                                    }}
                                >
                                    <Ico
                                        name={item.icon}
                                        size={22}
                                        style={{color: cor_fundo}}
                                    />
                                    <Text style={styles.screensItemText}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingBottom: 15,
        backgroundColor: "#fff"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-start",
        alignItems: "center",
        width: "100%",
        height: 40,
        marginTop: 45,
        marginBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: cor_fundo
    },
    imageBackground: {
        width: "100%"
    },
    logo: {
        width: 16 * 10,
        height: 16,
        borderColor: "#f00"
    },
    links: {
        flexDirection: "row",
        alignItems: "stretch",
        height: 35,
        color: "#fff",
        backgroundColor: cor_fundo
    },
    linksItem: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: "rgba(0,0,0,.1)"
    },
    linksItemText: {
        marginLeft: 3,
        color: "#fff"
    },
    screens: {
        marginTop: 20
    },
    screensItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 35,
        paddingLeft: 20
    },
    screensItemText: {
        marginLeft: 5,
        color: "#333",
        fontSize: 20
    }
});

const mapStateToProps = state => {
    return {token: state.token, user: state.user};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {},
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DrawerMain);

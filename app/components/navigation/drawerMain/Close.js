import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from "react-native";
import { DrawerActions, withNavigation } from "react-navigation";
import Ico from "../../common/Ico";

let Close = props => {
  return (
    <View style={styles.closeButtonContainer}>
      {Platform.OS === "android" ? (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackground()}
          onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
        >
          <View style={styles.closeButton}>
            <Ico name="close" size={24} style={{ color: "#fff" }} />
          </View>
        </TouchableNativeFeedback>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
          style={styles.closeButton}
        >
          <Ico name="close" size={24} style={{ color: "#fff" }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    width: 30,
    height: 30,
    overflow: "hidden",
    marginLeft: "auto",
    marginRight: -4,
    borderRadius: 20
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withNavigation(Close);

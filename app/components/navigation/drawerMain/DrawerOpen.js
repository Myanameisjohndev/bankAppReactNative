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

let DrawerOpen = props => {
  return (
    <View style={styles.menuTouchableContainer}>
      {Platform.OS === "android" ? (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackground()}
          onPress={() => {
            props.navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <View style={styles.menuButton}>
            <Ico name="menu" size={24} style={{ color: "#fff" }} />
          </View>
        </TouchableNativeFeedback>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            props.navigation.dispatch(DrawerActions.openDrawer());
          }}
          style={styles.menuButton}
        >
          <Ico name="menu" size={24} style={{ color: "#fff" }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  menuTouchableContainer: {
    marginLeft: 10,
    overflow: "hidden",
    borderRadius: 20
  }
});

export default withNavigation(DrawerOpen);

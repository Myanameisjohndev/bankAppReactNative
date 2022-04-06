import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Ico = props => {
  props = { ...props };
  if (props.name.search("logo") === -1) {
    props.name =
      Platform.OS === "ios" ? `ios-${props.name}` : `md-${props.name}`;
  }
  return (
    <View
      style={{
        width: props.size,
        height: props.size,
        ...styles.container,
        ...props.containerStyle
      }}
    >
      <Icon {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Ico;

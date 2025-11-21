import { Text, View } from "react-native";
import React, { Component } from "react";

export default class explore extends Component {
  render() {
    return (
      <View
        style={
          {
            $$css: true,
            _: "flex-1 items-center justify-center",
          } as any
        }
      >
        <div className="flex flex-col items-center justify-center">
          <Text>explore</Text>
          <p className="text-xl font-medium">Hello</p>
        </div>
      </View>
    );
  }
}

import React from "react";
import { Image, ImageStyle } from "react-native";

interface MistralLogoProps {
  width?: number;
  height?: number;
  style?: ImageStyle;
}

export function MistralLogo({
  width = 42,
  height = 42,
  style,
}: MistralLogoProps) {
  return (
    <Image
      source={require("../../assets/images/mistral-logo.png")}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}

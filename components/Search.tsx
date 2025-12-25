import { Platform } from "react-native";

import WebComponent from "./Search.web";
import NativeComponent from "./Search.native";

const Component = Platform.OS === "web" ? WebComponent : NativeComponent;

export default Component;

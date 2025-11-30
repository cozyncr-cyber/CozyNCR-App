import { Svg, Path } from "react-native-svg";

export default function Star() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24">
      <Path
        d="M12 2.3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.1l6.5-.9L12 2.3z"
        fill="#F6C24E"
      />
    </Svg>
  );
}

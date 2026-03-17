import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  
  useEffect(() => {
    console.log("Hello Harvey");
  }, []);
  
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello Harvey</Text>
    </View>
  );
}

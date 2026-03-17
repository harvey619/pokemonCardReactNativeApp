import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";



export default function Details() {
    const {name} = useLocalSearchParams()
    
    console.log(name)

  
  
  return (
    <ScrollView
      contentContainerStyle={{ 
        gap: 16,
        padding: 16,
       }}
    >
    </ScrollView>
  );
}
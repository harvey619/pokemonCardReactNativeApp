import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";



export default function Details() {
    const {name} = useLocalSearchParams()
    
    console.log(name)
    
    useEffect(() => {
        
    },[])

  
  
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
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  
  useEffect(() => {
    //Fetch pokemons
    
    async function fetchPokemons() { 
      
      try {
        
      }catch (error) {
        console.error("Error fetching pokemons: ", error);
      }
    }
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

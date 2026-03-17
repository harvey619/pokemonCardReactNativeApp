import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  
  useEffect(() => {
    //Fetch pokemons
    fetchPokemons();
    
    async function fetchPokemons() { 
      
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        
        const data = await response.json();
        console.log(data);
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

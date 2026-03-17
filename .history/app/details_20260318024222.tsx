import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";



export default function Details() {
    const {name} = useLocalSearchParams()
    
    
    useEffect(() => {
        
        fetchPokemon();
        
        async function fetchPokemon() {
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
              const data = await response.json()
              console.log(data)
              
          } catch (error) {
            console.log(error)
          }  
        };
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
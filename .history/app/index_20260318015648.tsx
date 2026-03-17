import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";



export default function Index() {
  interface PokemonListItem {
    name: string;
    image: string;
  };
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  
  useEffect(() => {
    //Fetch pokemons
    fetchPokemons();
    
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches a list of 20 pokemons from the PokeAPI and sets the state with the fetched data.
   * Each pokemon object in the list contains the name and front default image of the pokemon.
   * If an error occurs while fetching the data, it is logged to the console.
   */
/*******  d78840a4-a857-4aff-b79f-4b3d6e35e27e  *******/
    async function fetchPokemons() { 
      
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        
        const data = await response.json();
        
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            
            return {
              name: pokemon.name,
              image : details.sprites.front_default,
            }
          })
        )
        
        setPokemons(detailedPokemons);
        
      }catch (error) {
        console.error("Error fetching pokemons: ", error);
      }
    }
  }, []);
  
  
  return (
    <ScrollView >
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

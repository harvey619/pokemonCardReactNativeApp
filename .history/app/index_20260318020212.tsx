import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";



export default function Index() {
  interface PokemonListItem {
    name: string;
    image: string;
    backImage: string;
  };
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  
  useEffect(() => {
    //Fetch pokemons
    fetchPokemons();
    
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
          <Image
            source={{ uri: pokemon.image }}
            style = {{ width:100,height:100 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

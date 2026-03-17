import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";



export default function Index() {
  interface PokemonListItem {
    name: string;
    image: string;
    backImage: string;
    types: PokemonType
  };
  
  interface PokemonType {
    type: {
      name: string;
      url: string;
    }
  }
  
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
              image: details.sprites.front_default,
              backImage: details.sprites.back_default,
              types : details.types
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
          <View style={{ 
            flexDirection : "row",
           }}>
          <Image
            source={{ uri: pokemon.image }}
            style = {{ width:150,height:150 }}
          />
          <Image
            source={{ uri: pokemon.backImage }}
            style = {{ width:150,height:150 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

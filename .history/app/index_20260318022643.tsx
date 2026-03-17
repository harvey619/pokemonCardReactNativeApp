import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";



export default function Index() {
  interface PokemonListItem {
    name: string;
    image: string;
    backImage: string;
    types: PokemonType[];
  };
  
  interface PokemonType {
    type: {
      name: string;
      url: string;
    }
  }
  
  const colorsByType = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
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
              types : details.types,
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
    <ScrollView
      contentContainerStyle={{ 
        gap: 16,
        padding: 16,
        
       }}
    >
      {pokemons.map((pokemon) => (
        <Link key={pokemon.name}
          href = {"/details"}
        >
        <View  style={{ 
          // @ts-ignore
          backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
          padding: 20,
          borderRadius:20,
         }}>
          <Text style = {styles.name}>{pokemon.name}</Text>
          <Text style = {styles.type}>{pokemon.types[0].type.name}</Text>
          
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
        <Link/>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    textAlign:"center"
  }
})

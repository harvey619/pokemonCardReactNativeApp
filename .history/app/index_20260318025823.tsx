import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchPokemonList,
  getTypeColor,
  type PokemonCardSummary,
  withAlpha,
} from "@/services/pokemon";



export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonCardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;

    fetchPokemons();

    async function fetchPokemons() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchPokemonList(20);
        if (isMounted) {
          setPokemons(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Could not load pokemon. Pull to refresh to retry.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  
  
  return (
    <ScrollView
      contentContainerStyle={{ 
        gap: 16,
        padding: 16,
        
       }}
    >
      {isLoading && <ActivityIndicator size="large" color="#0A7EA4" />}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      {pokemons.map((pokemon) => {
        const primaryType = pokemon.types[0]?.type.name ?? "normal";
        return (
          <Link
            key={pokemon.name}
            href={{
              pathname: "/details",
              params: { name: pokemon.name },
            }}
            asChild
          >
            <Pressable
              style={[
                styles.pokemonCard,
                { backgroundColor: withAlpha(getTypeColor(primaryType), "55") },
              ]}
            >
              <View>
                <Text style={styles.name}>{pokemon.name}</Text>
                <Text style={styles.type}>{primaryType}</Text>

                <View style={styles.spriteRow}>
                  <Image source={{ uri: pokemon.image }} style={styles.spriteImage} />
                  <Image source={{ uri: pokemon.backImage }} style={styles.spriteImage} />
                </View>
              </View>
            </Pressable>
          </Link>
        );
      })}
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
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
  },
  errorMessage: {
    color: "#B00020",
    textAlign: "center",
    fontWeight: "600",
  },
  pokemonCard: {
    padding: 20,
    borderRadius: 20,
  },
  spriteRow: {
    flexDirection: "row",
  },
  spriteImage: {
    width: 150,
    height: 150,
  },
});

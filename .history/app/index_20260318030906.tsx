import {
  fetchPokemonList,
  getTypeColor,
  type PokemonCardSummary,
} from "@/services/pokemon";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
      } catch {
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
    <FlatList
      data={pokemons}
      keyExtractor={(item) => item.name}
      numColumns={2}
      contentContainerStyle={styles.scrollContent}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <>
          {isLoading && (
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0A7EA4" />
          )}
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          {!isLoading && !errorMessage && pokemons.length === 0 && (
            <Text style={styles.emptyMessage}>No pokemon found.</Text>
          )}
        </>
      }
      renderItem={({ item: pokemon }) => {
        const primaryType = (pokemon.types[0]?.type.name ?? "normal").toLowerCase();
        const cardColor = getTypeColor(primaryType);
        return (
          <View style={[styles.cardWrapper, { backgroundColor: cardColor }]}> 
            <Link
              href={{
                pathname: "/details",
                params: { name: pokemon.name },
              }}
              asChild
            >
              <Pressable
                style={[
                  styles.pokemonCard,
                  { backgroundColor: cardColor },
                ]}
              >
                <Text style={styles.name}>{pokemon.name}</Text>

                <View style={styles.spriteRow}>
                  <Image source={{ uri: pokemon.image }} style={styles.spriteImage} />
                </View>
              </Pressable>
            </Link>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
  },
  loadingIndicator: {
    marginVertical: 8,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 6,
  },
  errorMessage: {
    color: "#B00020",
    textAlign: "center",
    fontWeight: "600",
  },
  pokemonCard: {
    minHeight: 180,
    padding: 12,
    borderRadius: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
  spriteRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  spriteImage: {
    width: 96,
    height: 96,
  },
});

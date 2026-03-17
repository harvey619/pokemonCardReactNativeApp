import {
  fetchPokemonList,
  getTypeColor,
  type PokemonCardSummary,
  withAlpha,
} from "@/services/pokemon";
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {isLoading && (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0A7EA4" />
      )}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      {!isLoading && !errorMessage && pokemons.length === 0 && (
        <Text style={styles.emptyMessage}>No pokemon found.</Text>
      )}

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
                { backgroundColor: withAlpha(getTypeColor(primaryType), "22") },
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{pokemon.name}</Text>
                  <Text style={styles.typeBadge}>{primaryType}</Text>
                </View>

                <View style={styles.spriteRow}>
                  <Image source={{ uri: pokemon.image }} style={styles.spriteImage} />
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
  scrollContent: {
    gap: 16,
    padding: 16,
  },
  loadingIndicator: {
    marginVertical: 8,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
  },
  cardContent: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 26,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  typeBadge: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textTransform: "capitalize",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  errorMessage: {
    color: "#B00020",
    textAlign: "center",
    fontWeight: "600",
  },
  pokemonCard: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },
  spriteRow: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  spriteImage: {
    width: 130,
    height: 130,
  },
});

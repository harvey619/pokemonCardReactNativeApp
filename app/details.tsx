import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  fetchPokemonDetails,
  getTypeColor,
  type PokemonDetails,
  withAlpha,
} from "@/services/pokemon";



export default function Details() {
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();

  const pokemonName = useMemo(() => {
    if (Array.isArray(name)) {
      return name[0];
    }
    return name;
  }, [name]);

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const currentPokemonName = pokemonName ?? "";

    if (!currentPokemonName) {
      setErrorMessage("Pokemon name is missing from route params.");
      return () => {
        isMounted = false;
      };
    }

    loadPokemon();

    async function loadPokemon() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchPokemonDetails(currentPokemonName);
        if (isMounted) {
          setPokemon(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Could not load Pokemon details. Tap retry.");
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
  }, [pokemonName]);

  const headerTitle = pokemon?.name ?? pokemonName ?? "Details";

  
  
  return (
    <>
      <Stack.Screen options={{ title: headerTitle }} />
      <ScrollView
        contentContainerStyle={{ 
          gap: 16,
          padding: 16,
        }}
      >
        {isLoading && <ActivityIndicator size="large" color="#0A7EA4" />}

        {!isLoading && errorMessage && (
          <View style={styles.centeredCard}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        )}

        {!isLoading && !errorMessage && pokemon && (
          <>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: withAlpha(
                    getTypeColor(pokemon.types[0]?.type.name ?? "normal"),
                    "55"
                  ),
                },
              ]}
            >
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.meta}>#{pokemon.id}</Text>
              <Image source={{ uri: pokemon.image }} style={styles.heroImage} />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Types</Text>
              <View style={styles.typeChipRow}>
                {pokemon.types.map((entry) => (
                  <View
                    key={entry.type.name}
                    style={[
                      styles.typeChip,
                      { backgroundColor: withAlpha(getTypeColor(entry.type.name), "44") },
                    ]}
                  >
                    <Text style={styles.typeChipText}>{entry.type.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.sectionText}>Height: {pokemon.height}</Text>
              <Text style={styles.sectionText}>Weight: {pokemon.weight}</Text>
              <Text style={styles.sectionText}>
                Abilities: {pokemon.abilities.join(", ")}
              </Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Base Stats</Text>
              {pokemon.stats.map((stat) => (
                <View key={stat.stat.name} style={styles.statRow}>
                  <Text style={styles.statName}>{stat.stat.name}</Text>
                  <Text style={styles.statValue}>{stat.baseStat}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!isLoading && errorMessage && pokemonName && (
          <Pressable
            onPress={() => {
              setPokemon(null);
              setErrorMessage(null);
              setIsLoading(true);
              fetchPokemonDetails(pokemonName)
                .then((data) => {
                  setPokemon(data);
                })
                .catch(() => {
                  setErrorMessage("Could not load Pokemon details. Tap retry.");
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  centeredCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#F8D7DA",
  },
  errorMessage: {
    color: "#7A1C24",
    textAlign: "center",
    fontWeight: "600",
  },
  name: {
    fontSize: 32,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  meta: {
    marginTop: 4,
    color: "#404040",
    fontWeight: "500",
  },
  heroImage: {
    width: 240,
    height: 240,
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionText: {
    fontSize: 15,
    color: "#262626",
  },
  typeChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typeChipText: {
    textTransform: "capitalize",
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statName: {
    textTransform: "capitalize",
    color: "#555",
  },
  statValue: {
    fontWeight: "700",
  },
  retryButton: {
    marginTop: 8,
    alignSelf: "center",
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
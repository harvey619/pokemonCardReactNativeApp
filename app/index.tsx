import {
  fetchPokemonPage,
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
  const numColumns = 2;
  const pageSize = 60;

  const [pokemons, setPokemons] = useState<PokemonCardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadInitialPage();

    async function loadInitialPage() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const page = await fetchPokemonPage(pageSize, 0);
        if (isMounted) {
          setPokemons(page.items);
          setNextOffset(page.nextOffset);
          setHasMore(page.hasMore);
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
  }, [pageSize]);

  async function handleLoadMore() {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page = await fetchPokemonPage(pageSize, nextOffset);
      setPokemons((prev) => [...prev, ...page.items]);
      setNextOffset(page.nextOffset);
      setHasMore(page.hasMore);
    } catch {
      setErrorMessage("Could not load more pokemon.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <FlatList
      key={`pokemon-grid-${numColumns}`}
      data={pokemons}
      keyExtractor={(item) => item.name}
      numColumns={numColumns}
      contentContainerStyle={styles.scrollContent}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.35}
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
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator style={styles.loadingIndicator} size="small" color="#0A7EA4" />
        ) : null
      }
      renderItem={({ item: pokemon }) => {
        const primaryType = (pokemon.types[0]?.type.name ?? "normal").toLowerCase();
        const cardColor = getTypeColor(primaryType);
        const cardWrapperStyle = StyleSheet.flatten([
          styles.cardWrapper,
          { backgroundColor: cardColor },
        ]);
        const pokemonCardStyle = StyleSheet.flatten([
          styles.pokemonCard,
          { backgroundColor: cardColor },
        ]);

        return (
          <View style={cardWrapperStyle}>
            <Link
              href={{
                pathname: "/details",
                params: { name: pokemon.name },
              }}
              asChild
            >
              <Pressable style={pokemonCardStyle}>
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

export type PokemonTypeSlot = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type PokemonStat = {
  baseStat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export type PokemonCardSummary = {
  id: number;
  name: string;
  image: string;
  backImage: string;
  types: PokemonTypeSlot[];
};

export type PokemonDetails = PokemonCardSummary & {
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
};

type PokemonListResponse = {
  results: Array<{
    name: string;
    url: string;
  }>;
};

type PokemonDetailsResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
    };
  };
  types: PokemonTypeSlot[];
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
};

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const DEFAULT_TYPE_COLOR = "#8A8A8A";

export function getTypeColor(typeName: string): string {
  return POKEMON_TYPE_COLORS[typeName] ?? DEFAULT_TYPE_COLOR;
}

export function withAlpha(hexColor: string, alphaHex = "33"): string {
  return `${hexColor}${alphaHex}`;
}

function mapPokemonDetails(data: PokemonDetailsResponse): PokemonDetails {
  const officialArtwork = data.sprites.other?.["official-artwork"]?.front_default;

  return {
    id: data.id,
    name: data.name,
    image: officialArtwork ?? data.sprites.front_default ?? "",
    backImage: data.sprites.back_default ?? data.sprites.front_default ?? "",
    types: data.types,
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((item) => item.ability.name),
    stats: data.stats.map((stat) => ({
      baseStat: stat.base_stat,
      effort: stat.effort,
      stat: stat.stat,
    })),
  };
}

export async function fetchPokemonDetails(nameOrId: string): Promise<PokemonDetails> {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`Unable to load pokemon: ${nameOrId}`);
  }

  const data = (await response.json()) as PokemonDetailsResponse;
  return mapPokemonDetails(data);
}

export async function fetchPokemonList(limit = 20): Promise<PokemonCardSummary[]> {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Unable to load pokemon list");
  }

  const data = (await response.json()) as PokemonListResponse;

  const detailedPokemons = await Promise.all(
    data.results.map(async (pokemon) => {
      const details = await fetchPokemonDetails(pokemon.name);
      return {
        id: details.id,
        name: details.name,
        image: details.image,
        backImage: details.backImage,
        types: details.types,
      };
    })
  );

  return detailedPokemons;
}

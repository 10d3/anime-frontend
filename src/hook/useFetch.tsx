"use client";
import { useQuery } from "@tanstack/react-query";

interface Episode {
  id: string;
  title: string;
  image: string;
  number: number;
  description: string | null;
  url: string;
}

interface FetchEpisodesProp {
  episodes: Episode[];
}

interface Source {
  url: string;
  isM3U8: boolean;
  quality: string;
}

interface EpisodeData {
  headers: {
    Referer: string;
  };
  sources: Source[];
  download: string;
}

const fetchAllEpisodesLinks = async ({
  episodes,
  page,
  limit,
}: FetchEpisodesProp & { page: number; limit: number }) => {
  try {
    // Calculer les index de début et de fin pour la pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;

    // Extraire les épisodes correspondant à la page actuelle
    const episodesToFetch = episodes.slice(startIndex, endIndex);

    const allEpisodesLinks = await Promise.all(
      episodesToFetch.map(async (episode) => {
        const url = `https://api-anim.vercel.app/anime/gogoanime/watch/${episode.id}`;
        // console.log("Fetching URL:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch episode links for ${episode.id}`);
        }

        const episodeData = await res.json();

        return {
          ...episode,
          videoSources: episodeData.sources,
          downloadLink: episodeData.download,
          referer: episodeData.headers.Referer,
        };
      })
    );
    return allEpisodesLinks;
  } catch (error) {
    console.error("Error in fetchAllEpisodesLinks:", error);
    throw error;
  }
};

const useFetchAllEpisodesLinks = ({
  episodes,
  page,
  limit,
}: FetchEpisodesProp & { page: number; limit: number }) => {
  return useQuery({
    queryKey: ["episode-links", episodes, page],
    queryFn: () => fetchAllEpisodesLinks({ episodes, page, limit }),
    enabled: !!episodes, // Assurez-vous que la requête ne s'exécute que lorsque des épisodes sont disponibles
    staleTime: 1000 * 60 * 15,
  });
};

export default useFetchAllEpisodesLinks;

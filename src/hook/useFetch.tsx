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

const fetchAllEpisodesLinks = async ({ episodes }: FetchEpisodesProp) => {
  try {
    const allEpisodesLinks = await Promise.all(
      episodes.map(async (episode) => {
        const url = `https://animetize-api.vercel.app/watch/${episode.id}`;
        console.log("Fetching URL:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch episode links for ${episode.id}`);
        }

        const episodeData = await res.json();
        console.log("Fetched Data:", episodeData); // Log the fetched data

        return {
          ...episode,
          videoSources: episodeData.sources,
          downloadLink: episodeData.download,
          referer: episodeData.headers.Referer,
        };
      })
    );

    console.log("All Episodes Links:", allEpisodesLinks); // Log the final data
    return allEpisodesLinks;
  } catch (error) {
    console.error("Error in fetchAllEpisodesLinks:", error);
    throw error;
  }
};


const useFetchAllEpisodesLinks = ({ episodes }: FetchEpisodesProp) => {
  return useQuery({
    queryKey: ["episode-links", episodes],
    queryFn: () => fetchAllEpisodesLinks({ episodes }),
    enabled: !!episodes, // Ensure the query only runs when episodes are available
  });
};

export default useFetchAllEpisodesLinks;

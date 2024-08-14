"use client";
import { removeNumberFromString } from "@/lib/utility";
import { useQuery } from "@tanstack/react-query";

interface TestProp {
  episodeCount: number;
  id: string;
  type: string;
}

const fetchEpisodeLinks = async ({ episodeCount, id, type }: TestProp) => {
  const baseId = removeNumberFromString(id || "");
  const allEpisodesLinks = [];

  if (type !== "TV") {
    // Fetch only once for non-TV types (e.g., movies)
    const url = `https://api-anim.vercel.app/anime/gogoanime/watch/${baseId}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch movie links");
    }
    const movieData = await res.json();
    allEpisodesLinks.push(movieData);
  } else {
    // Fetch for each episode if type is TV
    const episodePromises = [];
    for (let episode = 1; episode <= episodeCount; episode++) {
      const url = `https://api-anim.vercel.app/anime/gogoanime/watch/${baseId}-episode-${episode}`;
      episodePromises.push(
        fetch(url)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch episode links for episode ${episode}`);
            }
            return res.json();
          })
          .then((episodeData) => ({
            episode,
            ...episodeData,
          }))
      );
    }

    // Wait for all episodes to be fetched
    const episodesData = await Promise.all(episodePromises);
    allEpisodesLinks.push(...episodesData);
  }

  return allEpisodesLinks;
};

const useFetchAllEpisodesLinks = ({ episodeCount, id, type }: TestProp) => {
  return useQuery({
    queryKey: ["episode-links", episodeCount],
    queryFn: () => fetchEpisodeLinks({ episodeCount, id, type }),
    enabled: !!id && !!type && !!episodeCount, // Ensure the query only runs when these parameters are available
  });
};

export default useFetchAllEpisodesLinks;

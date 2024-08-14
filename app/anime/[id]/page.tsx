'use client';

import AnimeCard from "@/components/shared/AnimeCard";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { removeNumberFromString } from "@/lib/utility";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface paramsProp {
  params: {
    id: string;
    ep: number;
  };
}

interface AnimeData {
  image: string;
  title: string;
  type: string;
  id: string;
}

interface EpisodeLinks {
  sources: { url: string }[];
}

export default function Page({ params }: paramsProp) {
  const [episode, setEpisode] = useState(1);
  const [animeInfo, setAnimeInfo] = useState<AnimeData | null>(null);
  const [episodeLink, setEpisodeLink] = useState<EpisodeLinks | null>(null);

  const handleNextEpisode = () => {
    setEpisode((prevEpisode) => prevEpisode + 1);
  };

  const handlePreviousEpisode = () => {
    if (episode > 1) {
      setEpisode((prevEpisode) => prevEpisode - 1);
    }
  };

  const searchParams = useSearchParams();
  const episodes = searchParams.get("ep");
  const test = params.id.toLocaleLowerCase();

  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/zoro/info?id=${test}`;
    const res = await fetch(url);
    return res.json();
  };

  const fetchEpisodeLinks = async () => {
    const test2 = removeNumberFromString(animeInfo?.id || "");
    const url = `https://api-anim.vercel.app/anime/gogoanime/watch/${test2}-episode-${episode}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch episode links");
    }
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recentAnimeData = await fetchRecentAnime();
        setAnimeInfo(recentAnimeData);
      } catch (error) {
        console.error("Error fetching anime info:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (animeInfo) {
      const fetchData = async () => {
        try {
          const episodeLinksData = await fetchEpisodeLinks();
          setEpisodeLink(episodeLinksData);
        } catch (error) {
          console.error("Error fetching episode links:", error);
        }
      };

      fetchData();
    }
  }, [animeInfo, episode]);

  if (!animeInfo || !episodeLink) return <div>Loading...</div>;

  const litset =
    episodeLink.sources && episodeLink.sources.length > 3
      ? episodeLink.sources[3]?.url
      : "";

  const videoJsOptions = {
    sources: [
      {
        src: litset,
        type: "application/x-mpegURL",
      },
    ],
  };

  return (
    <section className="flex min-h-dvh flex-col items-center justify-between">
      {animeInfo && (
        <div className="flex flex-col gap-4 w-full">
          <div className="relative w-sdv h-[300px]">
            {animeInfo.image && (
              <Image
                className="w-full h-full"
                src={animeInfo.image}
                alt="image"
                width={1000}
                height={1000}
                quality={100}
                objectFit="contain"
              />
            )}
          </div>
          <div className="flex flex-col">
            <div>
              <h2>{animeInfo.title}</h2>
              <div className="flex flex-row justify-between">
                <Badge>{episodes} episodes</Badge>
                <Badge>{animeInfo.type}</Badge>
              </div>
            </div>
            <div></div>
            <div>
              {/* {episodeLink.error && <p>Error loading episode links.</p>}
              {episodeLink.isLoading && <p>Loading...</p>} */}
              {animeInfo && litset && (
                <div className="w-full">
                  <VideoPlayer key={litset} options={videoJsOptions} />
                </div>
              )}

              <div className="flex mt-4 space-x-4">
                {episode > 1 && (
                  <Button
                    onClick={handlePreviousEpisode}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Previous Episode
                  </Button>
                )}
                <Button
                  onClick={handleNextEpisode}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Next Episode
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

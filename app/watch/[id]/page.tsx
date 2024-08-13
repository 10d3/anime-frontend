"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import VideoPlayer from "@/components/shared/VideoPlayer";

interface paramsProp {
  params: {
    id: string;
  };
}

export default function Page({ params }: paramsProp) {
  const [episode, setEpisode] = useState(1); // State to keep track of the current episode

  const fetchEpisodeLinks = async () => {
    const url = `https://api-anim.vercel.app/anime/gogoanime/watch/${params.id}-episode-${episode}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch episode links");
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["episode-links", episode],
    queryFn: fetchEpisodeLinks,
  });

  // Safeguard to ensure sources exist and there's at least 4 elements in the array
  const litset = data?.sources && data.sources.length > 3 ? data.sources[3]?.url : "";

  const videoJsOptions = {
    sources: [
      {
        src: litset,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handleNextEpisode = () => {
    setEpisode((prevEpisode) => prevEpisode + 1);
  };

  const handlePreviousEpisode = () => {
    if (episode > 1) {
      setEpisode((prevEpisode) => prevEpisode - 1);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between pb-24 pt-4">
      <h1>{`Episode ${episode}`}</h1>
      {error && <p>Error loading episode links.</p>}
      {isLoading && <p>Loading...</p>}
      {data && litset && (
        <div className="w-full">
          <VideoPlayer options={videoJsOptions} />
        </div>
      )}

      <div className="flex mt-4 space-x-4">
        {episode > 1 && (
          <button
            onClick={handlePreviousEpisode}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Previous Episode
          </button>
        )}
        <button
          onClick={handleNextEpisode}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Next Episode
        </button>
      </div>
    </main>
  );
}
"use client";

// import AnimeCard from "@/components/shared/AnimeCard";
import { AnimeEp } from "@/components/shared/AnimeEp";
import { AnimePres } from "@/components/shared/AnimePres";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchAllEpisodesLinks from "@/hook/useFetch";
// import { removeNumberFromString } from "@/lib/utility";
import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
import React, { useState, useEffect } from "react";

interface paramsProp {
  params: {
    id: string;
    ep: number;
  };
  searchParams: {
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

export default function AnimeStarter({ params, searchParams }: paramsProp) {
  const [episode, setEpisode] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 9;
  const [selectedRange, setSelectedRange] = useState<[number, number]>([
    1,
    itemsPerPage,
  ]);

  const test = params.id.toLocaleLowerCase();

  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/gogoanime/info/${params.id}`;
    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["anime-info", params.id],
    queryFn: async () => {
      const animeData = await fetchRecentAnime();
      return animeData;
    },
    staleTime: 1000 * 60 * 15,
  });

  const id = data?.episodes;
  const type = data?.type;
  const episodes = data?.episodes;

  const {
    data: link,
    isLoading: loader,
    error: failed,
    isFetching: Fetching,
  } = useFetchAllEpisodesLinks({
    episodes,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Load last watched episode from watchTimes in localStorage
  useEffect(() => {
    const watchTimes = JSON.parse(localStorage.getItem("watchTimes") || "{}");

    // Extract episode numbers for the current anime id
    const episodeKeys = Object.keys(watchTimes).filter((key) =>
      key.startsWith(params.id)
    );

    // Extract episode numbers from keys
    const episodeNumbers = episodeKeys
      .map((key) => {
        const match = key.match(/episode-(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
      })
      .filter(Boolean); // Remove null values

    // Determine the highest watched episode
    const maxEpisodeNumber = Math.max(...episodeNumbers, 1); // Default to 1 if no episodes found

    // Calculate the page for the highest watched episode
    const lastPage = Math.floor((maxEpisodeNumber - 1) / itemsPerPage);
    setCurrentPage(lastPage);
    setSelectedRange([
      lastPage * itemsPerPage + 1,
      (lastPage + 1) * itemsPerPage,
    ]);
  }, [params.id, itemsPerPage]);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < episodes.length) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setSelectedRange([
        nextPage * itemsPerPage + 1,
        (nextPage + 1) * itemsPerPage,
      ]);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setSelectedRange([
        prevPage * itemsPerPage + 1,
        (prevPage + 1) * itemsPerPage,
      ]);
    }
  };

  const handleRangeSelect = (start: number, end: number) => {
    setSelectedRange([start, end]);
    setCurrentPage(Math.floor((start - 1) / itemsPerPage));
  };

  const handleCustomEpisodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const episodeNumber = parseInt(e.target.value, 10);
    if (
      episodeNumber &&
      episodeNumber > 0 &&
      episodeNumber <= episodes.length
    ) {
      const customPage = Math.floor((episodeNumber - 1) / itemsPerPage);
      setCurrentPage(customPage);
      setSelectedRange([
        customPage * itemsPerPage + 1,
        (customPage + 1) * itemsPerPage,
      ]);
    }
  };

  const handleEpisodeWatched = (episodeNumber: number) => {
    const watchTimes = JSON.parse(localStorage.getItem("watchTimes") || "{}");
    watchTimes[params.id] = { lastWatchedEpisode: episodeNumber };
    localStorage.setItem("watchTimes", JSON.stringify(watchTimes));
  };

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 relative px-4">
        <div className="w-full gap-8 items-center flex flex-col md:flex-row">
          <div className="w-1/2 flex justify-center">
            <Skeleton className="w-full md:w-[80%] h-[253px] rounded-lg bg-primary" />
          </div>
          <div className="w-full md:w-1/2 space-y-6 flex flex-col items-center justify-center">
            <Skeleton className="h-10 w-3/4 bg-primary rounded" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32 bg-primary rounded" />
            </div>
            <div className="flex flex-row gap-2">
              <Skeleton className="h-6 w-20 bg-primary rounded" />
              <Skeleton className="h-6 w-20 bg-primary rounded" />
              <Skeleton className="h-6 w-20 bg-primary rounded" />
            </div>
            <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
              <Skeleton className="h-6 w-20 bg-primary rounded" />
              <Skeleton className="h-6 w-20 bg-primary rounded" />
              <Skeleton className="h-6 w-20 bg-primary rounded" />
            </div>
            <Skeleton className="h-8 w-32 bg-primary rounded" />
            <Skeleton className="h-28 w-full bg-primary rounded" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32 bg-primary rounded" />
              <Skeleton className="h-10 w-32 bg-primary rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="flex min-h-dvh flex-col items-center justify-between">
      {data && (
        <div className="flex flex-col w-full">
          <AnimePres
            id={data.id}
            title={data.title}
            image={data.image}
            description={data.description ? data.description : null}
            genre={data.genres}
            releasedDate={data.releaseDate}
            status={data.status}
            type={data.type}
            subOrDub={data.subOrDub}
            totalEpisodes={data.totalEpisodes}
          />
          {data.totalEpisodes <= 1 ? null : (
            <div className="flex justify-between mt-4 px-4">
              <Button onClick={handlePrevPage} disabled={currentPage === 0}>
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={
                  !episodes ||
                  (currentPage + 1) * itemsPerPage >= episodes.length
                }
              >
                Next
              </Button>
            </div>
          )}
          {data.totalEpisodes <= 1 ? null : (
            <div className="flex justify-center mt-4 px-4 flex-col md:flex-row gap-4">
              <select
                value={`${selectedRange[0]}-${selectedRange[1]}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split("-").map(Number);
                  handleRangeSelect(start, end);
                }}
                className="p-2 border rounded bg-primary"
              >
                {Array(Math.ceil(episodes.length / itemsPerPage))
                  .fill(null)
                  .map((_, i) => {
                    const start = i * itemsPerPage + 1;
                    const end = Math.min(
                      (i + 1) * itemsPerPage,
                      episodes.length
                    );
                    return (
                      <option key={i} value={`${start}-${end}`}>
                        Episodes {start} - {end}
                      </option>
                    );
                  })}
              </select>
              <input
                type="number"
                placeholder="Jump to episode number"
                onChange={handleCustomEpisodeInput}
                className="w-full p-2 border rounded bg-primary text-primary"
              />
            </div>
          )}
          <div className="flex flex-col">
            {loader && (
              <section className="flex flex-col min-w-full gap-2 pt-2 px-4">
                <Skeleton className="min-w-full h-20 bg-secondary" />
                <div className="space-y-2">
                  <Skeleton className="h-[70px] w-full bg-secondary" />
                  <Skeleton className="h-[70px] w-full bg-secondary" />
                </div>
              </section>
            )}
            {error && <div>Something went wrong</div>}
            {Fetching && (
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full pt-2 px-4">
                {[...Array(6)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-6 w-full bg-primary rounded-lg"
                  />
                ))}
              </div>
            )}
            {link?.length && (
              <div>
                <AnimeEp link={link} type={data.type} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

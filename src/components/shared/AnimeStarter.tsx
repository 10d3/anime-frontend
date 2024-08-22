"use client";

import AnimeCard from "@/components/shared/AnimeCard";
import { AnimeEp } from "@/components/shared/AnimeEp";
import { AnimePres } from "@/components/shared/AnimePres";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchAllEpisodesLinks from "@/hook/useFetch";
import { removeNumberFromString } from "@/lib/utility";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
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
  const [episode, setEpisode] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  //   const searchParams = useSearchParams();
  // const episodes = Number(searchParams.ep)
  const test = params.id.toLocaleLowerCase();

  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/gogoanime/info/${params.id}`;
    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["recent-anime"],
    queryFn: async () => {
      const animeData = await fetchRecentAnime();
      return animeData;
    },
  });

  console.log(data);

  const id = data?.episodes;
  const type = data?.type;
  const episodes = data?.episodes;
  console.log(episodes);
  // console.log(episodeCount);
  // const {
  //   data: link,
  //   isLoading: loader,
  //   error: failed,
  // } = useFetchAllEpisodesLinks({ episodes });
  const {
    data: link,
    isLoading: loader,
    error: failed,
  } = useFetchAllEpisodesLinks({
    episodes,
    page: currentPage,
    limit: itemsPerPage,
  });

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < episodes.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  console.log(loader);
  console.log(failed);
  console.log(link);

  if (isLoading)
    return (
      <section className="bg-muted rounded-lg overflow-hidden shadow-lg w-full">
        <Skeleton className="min-w-full h-20" />
        <div className="space-y-2">
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
        </div>
      </section>
    );

  return (
    <section className="flex min-h-dvh flex-col items-center justify-between">
      {data && (
        <div className="flex flex-col gap-4 w-full">
          <AnimePres
            title={data.title}
            image={data.image}
            description={data.description ? data.description : null}
          />
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 0}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={
                !episodes || (currentPage + 1) * itemsPerPage >= episodes.length
              }
            >
              Next
            </Button>
          </div>
          <div className="flex flex-col">
            {isLoading && (
              <section className="flex flex-col min-w-full gap-2 pt-2">
                <Skeleton className="min-w-full h-20" />
                <div className="space-y-2">
                  <Skeleton className="h-[70px] w-full" />
                  <Skeleton className="h-[70px] w-full" />
                </div>
              </section>
            )}
            {error && <div>Something went wrong</div>}
            {link?.length && (
              <div>
                <AnimeEp link={link} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

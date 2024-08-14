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
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface paramsProp {
    params: {
      id: string;
      ep: number;
    };
    searchParams:{
      ep:number
    }
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

//   const searchParams = useSearchParams();
  const episodes = Number(searchParams.ep)
  const test = params.id.toLocaleLowerCase();

  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/zoro/info?id=${test}`;
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

  const id = data?.id;
  const type = data?.type;
  const episodeCount = Number(episodes);
  console.log(id);
  console.log(type);
  console.log(episodeCount);
  const {
    data: link,
    isLoading: loader,
    error: failed,
  } = useFetchAllEpisodesLinks({ episodeCount, id, type });
  console.log(link);

  if (!data)
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
          <div className="flex flex-col">
            {loader && (
              <section className="flex flex-col min-w-full gap-2 pt-2">
                <Skeleton className="min-w-full h-20" />
                <div className="space-y-2">
                  <Skeleton className="h-[70px] w-full" />
                  <Skeleton className="h-[70px] w-full" />
                </div>
              </section>
            )}
            {failed && <div>Something went wrong</div>}
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

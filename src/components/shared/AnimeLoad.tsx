"use client";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import AnimeCard from "./AnimeCard";
import { Button } from "../ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface SearchParams {
  q?: string;
  page?: string;
  title?: boolean;
  genre?: string;
}

interface AnimeData {
  id: string;
  title: string;
  totalEpisodes: number;
  type: string;
  image: string;
  episodes: any; // Consider defining a more specific type
  subOrDub: string;
}

export default function AnimeLoad({
  filterValues,
}: {
  filterValues: SearchParams;
}) {
  const [pageN, setPageN] = useState(1);
  const { q, genre } = filterValues;

  const fetchAnimeData = async (page: number, params: SearchParams) => {
    const baseUrl = "https://api-anim.vercel.app/anime/gogoanime";
    const url = params.genre
      ? `${baseUrl}/genre/${params.genre}?page=${page}`
      : `${baseUrl}/${params.q}?page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["animeData", pageN, filterValues],
    queryFn: () => fetchAnimeData(pageN, filterValues),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 pb-6 items-center justify-center">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <section className="w-full">
      {filterValues.title && (
        <div className="mb-4 flex items-center justify-center">
          <h1 className="text-4xl">Anime</h1>
        </div>
      )}
      <div className="flex w-full flex-col mt-6 justify-center items-center gap-6">
        <div className="w-[90%] grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {data?.results.map((anime: AnimeData) => (
            <AnimeCard
              key={anime.id}
              title={anime.title}
              episode={anime.totalEpisodes}
              id={anime.id}
              type={anime.type}
              image={anime.image}
              mailId={anime.episodes}
              subOrDub={anime.subOrDub}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => {
              if (pageN > 1) {
                setPageN((prev) => prev - 1);
                refetch();
              }
            }}
            className="bg-primary"
            disabled={pageN <= 1}
          >
            Previous
          </Button>
          <Button
            type="button"
            disabled={!data.hasNextPage}
            onClick={() => {
              setPageN((prev) => prev + 1);
              refetch();
            }}
            className="bg-primary"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
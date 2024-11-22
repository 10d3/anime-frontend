"use client";
import React, { useState, useEffect } from "react";
import Carousel from "./Caroussel";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import Expandable from "../animata/carousel/expandable";

export default function Hero() {
  const [animeData, setAnimeData] = useState<any>(null);

  const fetchRecentAnime = async () => {
    const url = "https://api-anim.vercel.app/anime/gogoanime/recent-episodes";
    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["recent-anime"],
    queryFn: async () => {
      const fetchedData = await fetchRecentAnime();
      setAnimeData(fetchedData);
      return fetchedData;
    },
    staleTime:1000 * 60 * 5,
  });

  if (isFetching) {
    return (
      <section className="flex flex-row min-w-full gap-2 pt-2">
        <Skeleton className="w-2/3 h-96 bg-secondary" />
        <div className="flex flex-1 flex-row space-x-2">
          <Skeleton className="h-96 w-1/2 bg-secondary" />
          <Skeleton className="h-96 w-1/2 bg-secondary" />
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <section className="w-full">
      {/* <Carousel autoSlide autoSlideInterval={3000}>
        {Array.isArray(animeData?.results) && animeData.results.length > 0 ? (
          animeData.results.slice(0, 8).map((s: any) => (
            <div key={s.id} className="relative min-w-full cursor-pointer">
              <Image
                className="min-w-full object-cover object-center contain-content h-[250px] opacity-60"
                priority
                src={s.image}
                height={1000}
                width={1000}
                alt={`image of ${s.title}`}
              />
              <div className="absolute bottom-12 left-6 z-20 bg-transparent">
                <Link href={`/anime/${s.id}`}>
                  <h1 className="text-2xl">{s.title}</h1>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>No slides available</div>
        )}
      </Carousel> */}
      <Expandable
        list={data.results.slice(0, 9)}
        className="w-full min-w-full storybook-fix md:hidden"
      />
      <Expandable
        list={data.results.slice(0, 16)}
        className="w-full min-w-full storybook-fix hidden md:flex"
      />
    </section>
  );
}

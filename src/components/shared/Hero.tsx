"use client";
import React, { useState, useEffect } from "react";
import Carousel from "./Caroussel";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function Hero() {
  const [animeData, setAnimeData] = useState<any>(null);

  const fetchRecentAnime = async () => {
    const url = "https://api-anim.vercel.app/meta/mal/recent-episodes";
    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-anime"],
    queryFn: async () => {
      const fetchedData = await fetchRecentAnime();
      setAnimeData(fetchedData);
      return fetchedData;
    },
  });

  if (isLoading) {
    return (
      <section className="flex flex-col min-w-full gap-2 pt-2">
        <Skeleton className="min-w-full h-20" />
        <div className="space-y-2">
          <Skeleton className="h-[70px] w-full" />
          <Skeleton className="h-[70px] w-full" />
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <section>
      <Carousel autoSlide autoSlideInterval={3000}>
        {Array.isArray(animeData?.results) && animeData.results.length > 0 ? (
          animeData.results.map((s: any) => (
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
      </Carousel>
    </section>
  );
}

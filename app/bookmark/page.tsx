"use client";
import AnimeCard from "@/components/shared/AnimeCard";
import React, { useEffect, useState } from "react";

export default function page() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookedAnime');
    if (storedBookmarks) {
      setAnimeList(JSON.parse(storedBookmarks));
    }
  }, []);
  // const animeList = JSON.parse(localStorage.getItem("bookedAnime") || "{}");

  console.log(animeList);
  return (
    <main className="flex min-h-auto flex-col items-center pb-24 pt-4 gap-4">
      <h1 className="text-2xl">Your Booked List of Anime</h1>
      <div className="w-full grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 lg:gap-6">
        {animeList?.map((s: any) => (
          <AnimeCard
            key={s.id}
            title={s.title}
            //   duration={s.duration}
            episode={s.totalEpisodes}
            id={s.id}
            type={s.type}
            image={s.image}
            mailId={s.episodes}
          />
        ))}
      </div>
    </main>
  );
}

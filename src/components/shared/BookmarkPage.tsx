"use client";
import AnimeCard from "./AnimeCard";
import React, { useEffect, useState } from "react";

export default function BookmarkPage() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookedAnime");
    if (storedBookmarks) {
      setAnimeList(JSON.parse(storedBookmarks));
    }
  }, []);

  if (animeList.length <= 0) {
    return (
      <div className="min-h-dvh w-full px-4 items-center pt-4 flex flex-col gap-4">
        <h1 className="text-2xl">My Booked List of Anime</h1>
        <div className="flex justify-center items-center">
          <h3 className="text-sm">No anime yet in your Booked List</h3>
        </div>
      </div>
    );
  }
  return (
    <main className="flex min-h-auto flex-col items-center pb-24 pt-4 gap-4 px-4 md:px-0">
      <h1 className="text-2xl">My Booked List of Anime</h1>
      <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 lg:gap-6">
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

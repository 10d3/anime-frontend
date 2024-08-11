'use client'
import AnimeCard from "@/components/shared/AnimeCard";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface paramsProp {
  params: {
    id: string;
  };
}
export default function Page({ params }: paramsProp) {
  const page = "1";
  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/zoro/${params.id}?page=${page}`;
    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-anime"],
    queryFn: fetchRecentAnime,
  });
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between pb-24 pt-4">
      <div className="flex flex-col gap-4">
      {data?.results.map((s: any) =>  (
          <AnimeCard key={s.id} title={s.title} duration={s.duration} episode={s.episodes} id={s.id} type={s.type} image={s.image}/>
      ))}
      </div>
    </main>
  );
}

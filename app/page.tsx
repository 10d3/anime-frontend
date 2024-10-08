import AnimeLoad from "@/components/shared/AnimeLoad";
import { AnimeSearchBar } from "@/components/shared/AnimeSearchBar";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Anime Start",
  description: "An Platform where you can watch you favorite anime freely",
  keywords: [
    "anime",
    "streaming anime",
    "anime en ligne",
    "séries animées",
    "épisodes d'anime",
    "anime japonais",
    "manga",
    "anime gratuit",
    "regarder anime",
    "anime en HD",
    "meilleurs anime",
    "nouveaux anime",
    "anime populaires",
  ],
  openGraph: {
    title: "Anime Start",
    description: "An Platform where you can watch you favorite anime freely",
    tags: [
      "anime",
      "streaming anime",
      "anime en ligne",
      "séries animées",
      "épisodes d'anime",
      "anime japonais",
      "manga",
      "anime gratuit",
      "regarder anime",
      "anime en HD",
      "meilleurs anime",
      "nouveaux anime",
      "anime populaires",
    ],
    images: [
      {
        url: `https://res.cloudinary.com/daqehqcut/image/upload/v1724473140/metadata_1_zilvbf.png`, // Dynamic og route
        width: 800,
        height: 600,
      },
      {
        url: `https://res.cloudinary.com/daqehqcut/image/upload/v1724473140/metadata_1_zilvbf.png`, // Dynamic og route
        width: 1800,
        height: 1600,
        alt: `image of Animestart`,
      },
    ],
  },
};

export default function Home() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between gap-4">
      <Hero />
      <section className="flex flex-col min-w-full pt-4 text-2xl">
        <h1 className="pl-6">Recent Episodes</h1>
        <AnimeLoad filterValues={{ q: "recent-episodes" }} />
      </section>
      <section className="flex flex-col min-w-full text-2xl">
        <h1 className="pl-6">Popular</h1>
        <AnimeLoad filterValues={{ q: "popular" }} />
      </section>
      <section className="flex flex-col min-w-full text-2xl">
        <h1 className="pl-6">Top Movies</h1>
        <AnimeLoad filterValues={{ q: "movies" }} />
      </section>
    </section>
  );
}

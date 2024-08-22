import AnimeLoad from "@/components/shared/AnimeLoad";
import { AnimeSearchBar } from "@/components/shared/AnimeSearchBar";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";


export const metadata: Metadata = {
  title: 'AnimeStart',
  description: 'An Platform where you can watch you favorite anime freely',
}


export default function Home() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between gap-4">
      <Hero />
      <section className="flex flex-col min-w-full pt-4 text-2xl">
        <h1 className="pl-6">Recent Episodes</h1>
        <AnimeLoad filterValues={{q:"recent-episodes"}}/>
      </section>
      <section className="flex flex-col min-w-full text-2xl">
        <h1 className="pl-6">Popular</h1>
        <AnimeLoad filterValues={{q:"popular"}}/>
      </section>
      <section className="flex flex-col min-w-full text-2xl">
        <h1 className="pl-6">Top Movies</h1>
        <AnimeLoad filterValues={{q:"movies"}}/>
      </section>
    </section>
  );
}

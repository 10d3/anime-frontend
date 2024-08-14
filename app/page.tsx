import { AnimeSearchBar } from "@/components/shared/AnimeSearchBar";
import Hero from "@/components/shared/Hero";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <section className="flex min-h-full flex-col items-center justify-between">
      <Hero />
      Welcome to the first front-end anime watcher
    </section>
  );
}

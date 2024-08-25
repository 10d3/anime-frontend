import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const fetchRecentAnime = async () => {
    const url = `https://api-anim.vercel.app/anime/gogoanime/genre/list`;
    const res = await fetch(url);
    return res.json();
  };
  const genre = await fetchRecentAnime();

  async function handleGenreSelection(formData: FormData) {
    "use server";

    const genreId = formData.get("genre") as string;

    // Encode the query parameter directly
    const query = genreId ? encodeURIComponent(genreId.trim()) : "";
    const url = `/anime?genre=${query}`;

    // Perform the redirect
    redirect(url);
  }

  return (
    <section className="flex min-h-full flex-col items-center justify-center w-full pt-4 px-4">
      <form action={handleGenreSelection}>
        <div className="flex gap-4 flex-wrap text-justify">
          {genre.map((category: any, i: number) => (
            <Button
              key={i}
              type="submit"
              name="genre"
              value={category.id}
              className="bg-primary"
            >
              {category.title}
            </Button>
          ))}
        </div>
      </form>
    </section>
  );
}

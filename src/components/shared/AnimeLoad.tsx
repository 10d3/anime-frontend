import React from "react";
import { Skeleton } from "../ui/skeleton";
import AnimeCard from "./AnimeCard";
import Link from "next/link";
import { Pagination } from "../ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { url } from "inspector";
import { permanentRedirect, redirect } from "next/navigation";
import { Button } from "../ui/button";

interface searchParams {
  q: string | undefined;
  //   eventtype?: string | undefined;
  //   location?: string | undefined;
  page?: any;
  title?: boolean;
  genre?: string;
}


export default async function AnimeLoad({
  filterValues,
}: {
  filterValues: searchParams;
}) {
  const { q, page} = filterValues;
  const pageN = page ? parseInt(page) : 1;
  const eventPerPage = 4;
  const skip = (pageN - 1) * eventPerPage;
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  let url:string;
  if (filterValues.genre) {
    url = `https://api-anim.vercel.app/anime/gogoanime/genre/${filterValues.genre}`;
  } else {
    url = `https://api-anim.vercel.app/anime/gogoanime/${q}`;
  }
  const fetchRecentAnime = async () => {
    // const url = url;
    const res = await fetch(url);
    return res.json();
  };

  const data = await fetchRecentAnime();

  async function nextPage(formData: FormData) {
    "use server";

    const genreId = formData.get("next") as string;
    // Encode the query parameter directly
    const query = genreId ? encodeURIComponent(genreId.trim()) : "";
    const url = `/anime?q=${query}`;

    // Perform the redirect
    redirect(url);
  }

  async function navigatePage(formData: FormData) {
    "use server";

    const direction = formData.get("direction") as string;
    const nextPageNumber = direction === "next" ? pageN + 1 : pageN - 1;

    const nextUrl = q ? `/anime?q=${q}?page=${nextPageNumber}` : `/anime?genre=${filterValues.genre}?page=${nextPageNumber}`


    redirect(nextUrl);
  }

  if (data?.results.length === 0) {
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

  return (
    <section className=" w-full">
      {filterValues.title && (
        <div className=" mb-4 flex items-center justify-center">
          <h1 className="text-4xl">Anime</h1>
        </div>
      )}
      {/* <EventFilterSidebar /> */}
      <div className="flex w-full flex-col mt-6 justify-center items-center gap-6">
        <div className="w-[90%] grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {data?.results.map((s: any) => (
            <AnimeCard
              key={s.id}
              title={s.title}
              //   duration={s.duration}
              episode={s.totalEpisodes}
              id={s.id}
              type={s.type}
              image={s.image}
              mailId={s.episodes}
              subOrDub={s.subOrDub}
            />
          ))}
        </div>
          <div>
            <form action={navigatePage} className="flex gap-4 mt-4">
              {Number(data.currentPage) > 1 && (
                <Button
                  type="submit"
                  name="direction"
                  value="previous"
                  className="bg-primary"
                >
                  Previous
                </Button>
              )}
              {data.hasNextPage && (
                <Button
                  type="submit"
                  name="direction"
                  value="next"
                  className="bg-primary"
                >
                  Next
                </Button>
              )}
            </form>
          </div>
      </div>
    </section>
  );
}

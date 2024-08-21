import React from "react";
import { Skeleton } from "../ui/skeleton";
import AnimeCard from "./AnimeCard";
import Link from "next/link";
import { Pagination } from "../ui/pagination";
import { useQuery } from "@tanstack/react-query";

interface searchParams {
  q: string | undefined;
  //   eventtype?: string | undefined;
  //   location?: string | undefined;
  page?: string;
  title?: boolean;
}

export default async function AnimeLoad({
  filterValues,
}: {
  filterValues: searchParams;
}) {
  const { q, page } = filterValues;
  const pageN = page ? parseInt(page) : 1;
  const eventPerPage = 4;
  const skip = (pageN - 1) * eventPerPage;
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const fetchRecentAnime = async () => {
    const url = `https://animetize-api.vercel.app/${q}`;
    const res = await fetch(url);
    return res.json();
  };

  const data = await fetchRecentAnime();
  //   const totalEventPrommise = prisma.event.count({ where });

  //   const eventsPromise = prisma.event.findMany({
  //     where,
  //     orderBy: {
  //       startDate: "desc",
  //     },
  //     take: eventPerPage,
  //     skip,
  //   });

  //   const [events, totalEvent] = await Promise.all([
  //     eventsPromise,
  //     totalEventPrommise,
  //   ]);

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
    <section className="mb-8 w-full">
      {filterValues.title && (
        <div className=" mb-4 flex items-center justify-center">
          <h1 className="text-4xl">Anime</h1>
        </div>
      )}
      {/* <EventFilterSidebar /> */}
      <div className="flex w-full flex-col mt-6 justify-center items-center gap-6">
        <div className="w-[90%] grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 lg:gap-6">
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
            />
          ))}
        </div>
        {/* {
                    title !== "Top Events" &&
                    events.length > 0 &&
                    <Pagination
                        currentPage={pageN}
                        totalPage={Math.ceil(totalEvent / eventPerPage)}
                        filterValues={filterValues}
                    />
                } */}
      </div>
    </section>
  );
}

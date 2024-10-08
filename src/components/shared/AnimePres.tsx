"use client";
import { Loader, StarIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { removeBookedAnime, savedBookAnime } from "../../lib/utility";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface AnimePresProp {
  title: string;
  image: string;
  description?: string;
  genre: string[];
  releasedDate: string;
  status: string;
  type: string;
  subOrDub: string;
  totalEpisodes: number;
  id: string;
}

export const AnimePres = ({
  id,
  title,
  image,
  description,
  genre,
  releasedDate,
  status,
  type,
  subOrDub,
  totalEpisodes,
}: AnimePresProp) => {
  const anime = {
    id,
    title,
    image,
    description,
    genre,
    releasedDate,
    status,
    type,
    subOrDub,
    totalEpisodes,
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const arr = [`${status}`, `${type}`, `${subOrDub}`];
  const animeList = JSON.parse(localStorage.getItem("bookedAnime") || "[]");
  const isInWatchlist = animeList.some((anime: any) => anime.title === title);
  const toggleWatchlist = async () => {
    setIsLoading(true);
    try {
      if (isInWatchlist) {
        await removeBookedAnime(anime);
      } else {
        await savedBookAnime(anime);
      }
    } catch (error) {
      console.error("Error toggling anime in watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };



  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative px-4">
      <div className=" w-full gap-8 items-center flex flex-col md:flex-row">
        <div className="w-1/2 flex justify-center">
          <img
            src={image}
            width={1000}
            height={1000}
            alt="Anime Cover"
            className="w-full md:w-[80%] h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="space-y-6 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-justify">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <StarFilledIcon className="w-5 h-5" />
                <StarFilledIcon className="w-5 h-5" />
                <StarFilledIcon className="w-5 h-5" />
                <StarFilledIcon className="w-5 h-5" />
                <StarIcon className="w-5 h-5" />
              </div>
              {/* <div className="text-muted-foreground">9.1</div> */}
            </div>
            {releasedDate && (
              <div className="flex flex-row gap-2">
                {arr.map((a, i) => (
                  <Badge key={i} className="py-1" variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
            {genre && (
              <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
                {genre.map((g, i) => (
                  <Badge className="w-auto py-1" key={i}>
                    {g}
                  </Badge>
                ))}
              </div>
            )}
            {totalEpisodes && (
              <Badge variant="outline" className="w-auto py-1">
                Total Episodes: {totalEpisodes}
              </Badge>
            )}
            {description && (
              <div className="text-justify">
                <p
                  className={`overflow-hidden ${
                    isExpanded ? "" : "line-clamp-5"
                  }`}
                >
                  {description}
                </p>
                <button
                  onClick={toggleReadMore}
                  className="text-blue-500 hover:underline mt-2"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </div>
            )}
            <div className="flex gap-4">
              <Button size="lg">Watch Trailer</Button>
              <Button
                disabled={isLoading}
                onClick={toggleWatchlist}
                variant="outline"
                size="lg"
              >
                {isLoading
                  ? isInWatchlist
                    ? "Removing..."
                    : "Adding..."
                  : isInWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </Button>
            </div>
            {isLoading && <Loader size={16} />}
          </div>
        </div>
      </div>
    </section>
  );
};

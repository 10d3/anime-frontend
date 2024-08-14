'use client'
import { StarIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface AnimePresProp {
  title: string;
  image: string;
  description?: string;
}
export const AnimePres = ({ title, image, description }: AnimePresProp) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="w-full flex justify-center">
            <Image
              priority
              src={image}
              width={1000}
              height={1000}
              alt="Anime Cover"
              className="w-full h-auto rounded-lg shadow-lg"
            //   style={{ aspectRatio: "150/225", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="w-5 h-5" />
                <StarIcon className="w-5 h-5" />
                <StarIcon className="w-5 h-5" />
                <StarIcon className="w-5 h-5" />
                <StarIcon className="w-5 h-5" />
              </div>
              <div className="text-muted-foreground">9.1 (IMDB)</div>
            </div>
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
              <Button variant="outline" size="lg">
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
